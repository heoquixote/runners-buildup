# 채점 하네스: Pyodide(브라우저)와 CPython(로컬 검증 스크립트)에서 똑같이 동작한다.
# JS 쪽은 run_json / grade_json 두 함수만 호출한다.
import builtins
import contextlib
import copy
import importlib
import io
import json
import math
import os
import shutil
import sys
import tempfile
import traceback

FILENAME = "<내 코드>"
# 그래프는 화면(DOM) 없이 그림 파일로만 그린다. 실행 결과에 PNG로 붙여 보여 준다.
# Pyodide는 시작할 때 MPLBACKEND를 브라우저용 백엔드(js.document 사용)로 미리 채워 두는데,
# Web Worker에는 document가 없어 ImportError가 난다. 그래서 setdefault가 아니라 덮어쓴다.
os.environ["MPLBACKEND"] = "Agg"
# 예제 데이터셋(titanic.csv, ai4i2020.csv 등)이 놓이는 폴더. 브라우저에서는 worker.js 가 코드에 파일 이름이
# 보이면 사이트의 datasets/ 에서 받아 /datasets 에 써 두고, 로컬 검증은 RB_DATASETS 로 저장소의 datasets/ 를 가리킨다.
DATASET_DIR = os.environ.get("RB_DATASETS", "/datasets")

HINTS = {
    "NameError": "변수나 함수 이름의 철자, 그리고 사용하기 전에 정의했는지 확인하세요.",
    "SyntaxError": "괄호, 따옴표, 콜론(:)이 빠진 곳이 없는지 확인하세요.",
    "IndentationError": "들여쓰기(스페이스 4칸)가 맞는지 확인하세요.",
    "TabError": "탭과 스페이스가 섞여 있습니다. 스페이스 4칸으로 통일하세요.",
    "TypeError": "자료형을 확인하세요. 예: 문자열과 숫자는 바로 더할 수 없습니다(int(), str()로 변환).",
    "ValueError": "변환할 수 없는 값입니다. 예: int('10.5')는 오류이므로 float()를 쓰세요.",
    "ZeroDivisionError": "0으로 나누고 있습니다.",
    "IndexError": "리스트나 문자열의 범위를 벗어난 인덱스입니다.",
    "KeyError": "딕셔너리에 없는 키입니다.",
    "AttributeError": "그 자료형에는 없는 메서드입니다. 철자를 확인하세요.",
    "EOFError": "더 읽을 입력이 없습니다. input()을 너무 많이 호출하거나 반복문이 끝나지 않는지 확인하세요.",
    "ModuleNotFoundError": "이 사이트에서는 표준 라이브러리와 numpy · pandas · matplotlib · seaborn · scipy · scikit-learn을 쓸 수 있습니다. 모듈 이름 철자를 확인하세요.",
    "RecursionError": "함수가 자기 자신을 끝없이 호출하고 있습니다.",
}


class _Feed:
    """input()을 대신한다. 프롬프트 문구는 출력하지 않아 채점 출력에 섞이지 않는다."""

    def __init__(self, text, echo=False):
        self.echo = echo
        text = (text or "").replace("\r\n", "\n")
        self.lines = text.split("\n") if text != "" else []
        self.i = 0

    def __call__(self, prompt=""):
        if self.i >= len(self.lines):
            raise EOFError("입력이 부족합니다")
        value = self.lines[self.i]
        self.i += 1
        if self.echo:  # 실행(Run)에서는 콘솔처럼 프롬프트와 입력값을 보여준다
            sys.stdout.write(f"{prompt}{value}\n")
        return value


# 메시지별로 더 구체적인 안내 (입문자가 자주 만나는 경우)
MESSAGE_HINTS = [
    ("'return' outside function", "return은 def 함수 안에서만 씁니다. 입출력형 문제는 return 대신 print()로 출력하세요."),
    ("unsupported operand type(s) for +: 'int' and 'str'", "숫자와 문자열을 더하고 있습니다. str(숫자) 또는 f-string을 쓰세요."),
    ("can only concatenate str (not \"int\") to str", "문자열과 숫자를 더하고 있습니다. str(숫자) 또는 f-string을 쓰세요."),
    ("'<' not supported between instances of 'str'", "문자열과 숫자를 비교하고 있습니다. input()은 문자열이니 int()나 float()로 바꾸세요."),
    ("'>' not supported between instances of 'str'", "문자열과 숫자를 비교하고 있습니다. input()은 문자열이니 int()나 float()로 바꾸세요."),
    ("not all arguments converted during string formatting", "문자열에 % 연산을 하고 있습니다. input()으로 받은 값을 int()로 바꿨는지 확인하세요."),
    ("expected ':'", "if, for, while, def, else 줄 끝에 콜론(:)이 필요합니다."),
]


def _message_hint(message):
    for key, hint in MESSAGE_HINTS:
        if key in (message or ""):
            return hint
    return ""


def _error_info(exc):
    name = type(exc).__name__
    line = None
    if isinstance(exc, SyntaxError) and exc.filename == FILENAME:
        line = exc.lineno
    else:
        for frame in traceback.extract_tb(exc.__traceback__):
            if frame.filename == FILENAME:
                line = frame.lineno
    message = str(exc) if not isinstance(exc, SyntaxError) else (exc.msg or "")
    return {
        "type": name,
        "message": message,
        "line": line,
        "hint": _message_hint(message) or HINTS.get(name, ""),
    }


def _exec(code, stdin="", ns=None, echo=False):
    if ns is None:
        ns = {"__name__": "__main__"}
    out = io.StringIO()
    old_out, old_input = sys.stdout, builtins.input
    sys.stdout = out
    builtins.input = _Feed(stdin, echo)
    error = None
    try:
        exec(compile(code, FILENAME, "exec"), ns)
    except SystemExit:
        pass
    except BaseException as exc:  # 학생 코드의 모든 예외를 결과로 돌려준다
        error = _error_info(exc)
    finally:
        sys.stdout = old_out
        builtins.input = old_input
    return out.getvalue(), error, ns


def _figures(capture=True):
    """학생 코드가 그린 matplotlib 그림을 PNG(base64)로 모으고 닫는다. 그림이 없으면 빈 리스트."""
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is None:
        return []
    images = []
    try:
        if capture:
            import base64
            for num in plt.get_fignums()[:4]:
                buf = io.BytesIO()
                plt.figure(num).savefig(buf, format="png", dpi=80, bbox_inches="tight")
                images.append(base64.b64encode(buf.getvalue()).decode("ascii"))
    except Exception:
        pass
    finally:
        plt.close("all")
    return images


def _norm_lines(text):
    lines = [line.rstrip() for line in (text or "").replace("\r\n", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return lines


def _plain(value):
    """numpy 값을 파이썬 기본형으로 바꿔 비교와 JSON 직렬화를 쉽게 한다."""
    if hasattr(value, "tolist") and not isinstance(value, (str, bytes)):
        try:
            return value.tolist()
        except Exception:
            pass
    if isinstance(value, tuple):
        return [_plain(v) for v in value]
    if isinstance(value, list):
        return [_plain(v) for v in value]
    if isinstance(value, dict):
        return {k: _plain(v) for k, v in value.items()}
    return value


def _same(actual, expected, tol):
    actual = _plain(actual)
    if isinstance(expected, bool) or isinstance(actual, bool):
        return actual is expected or (type(actual) is bool and actual == expected)
    if isinstance(expected, float) or (isinstance(actual, float) and isinstance(expected, int)):
        try:
            return math.isclose(float(actual), float(expected), rel_tol=tol, abs_tol=tol)
        except (TypeError, ValueError):
            return False
    if isinstance(expected, list):
        return (
            isinstance(actual, list)
            and len(actual) == len(expected)
            and all(_same(a, e, tol) for a, e in zip(actual, expected))
        )
    if isinstance(expected, dict):
        return (
            isinstance(actual, dict)
            and actual.keys() == expected.keys()
            and all(_same(actual[k], expected[k], tol) for k in expected)
        )
    return actual == expected


def _repr(value):
    try:
        return repr(_plain(value))
    except Exception:
        return "<표시할 수 없는 값>"


def _call_solution(ns, args):
    fn = ns.get("solution")
    if not callable(fn):
        return None, {
            "type": "NameError",
            "message": "solution 함수를 찾을 수 없습니다",
            "line": None,
            "hint": "def solution(...): 으로 시작하는 함수를 지우거나 이름을 바꾸지 않았는지 확인하세요.",
        }
    out = io.StringIO()
    old_out = sys.stdout
    sys.stdout = out
    try:
        return fn(*copy.deepcopy(args)), None
    except BaseException as exc:
        return None, _error_info(exc)
    finally:
        sys.stdout = old_out


def _link_datasets(path, files):
    """예제 데이터셋(.csv, SQL 실습 DB .sql)을 작업 폴더에서 pd.read_csv('titanic.csv') 처럼 이름만으로 열 수 있게 한다."""
    if not os.path.isdir(DATASET_DIR):
        return
    for name in os.listdir(DATASET_DIR):
        if name in files or not name.endswith((".csv", ".sql")):
            continue
        src, dst = os.path.join(DATASET_DIR, name), os.path.join(path, name)
        try:
            os.symlink(src, dst)
        except OSError:
            shutil.copyfile(src, dst)


@contextlib.contextmanager
def _workdir(problem, test=None):
    """파일 입출력 문제용: 빈 임시 폴더에 문제 파일을 만들어 두고 그 안에서 실행한다."""
    files = dict(problem.get("files") or {})
    files.update((test or {}).get("files") or {})
    old = os.getcwd()
    path = tempfile.mkdtemp(prefix="rb-")
    try:
        for name, text in files.items():
            with open(os.path.join(path, name), "w", encoding="utf-8", newline="") as f:
                f.write(text)
        _link_datasets(path, files)
        os.chdir(path)
        # 학생이 작업 폴더에 만든 .py 모듈(import qaqc)을 새로 찾도록 import 캐시를 비운다
        importlib.invalidate_caches()
        yield path
    finally:
        os.chdir(old)
        _forget_modules(path)
        shutil.rmtree(path, ignore_errors=True)


def _forget_modules(path):
    """작업 폴더에서 import한 모듈을 잊는다. 남겨 두면 다음 실행에서 파일을 고쳐도 옛 모듈이 그대로 쓰인다."""
    for name, module in list(sys.modules.items()):
        file = getattr(module, "__file__", None) or ""
        if file.startswith(path + os.sep):
            del sys.modules[name]


def _grade_io(problem, code):
    cases = []
    for test in problem["tests"]:
        with _workdir(problem, test):
            out, error, _ = _exec(code, test.get("stdin", ""))
        passed = error is None and _norm_lines(out) == _norm_lines(test["expected"])
        cases.append({
            "hidden": bool(test.get("hidden")),
            "input": test.get("stdin", ""),
            "expected": test["expected"],
            "actual": out,
            "passed": passed,
            "error": error,
        })
    return cases


def _grade_function(problem, code):
    tol = problem.get("tolerance", 1e-6)
    cases = []
    for test in problem["tests"]:
        with _workdir(problem, test):
            _, error, ns = _exec(code)
            result = None
            if error is None:
                result, error = _call_solution(ns, test["args"])
        passed = error is None and _same(result, test["expected"], tol)
        note = ""
        if error is None and result is None and test["expected"] is not None:
            note = "반환값이 없습니다(None). print 대신 return으로 값을 돌려주세요."
        cases.append({
            "hidden": bool(test.get("hidden")),
            "input": "solution(" + ", ".join(_repr(a) for a in test["args"]) + ")",
            "expected": _repr(test["expected"]),
            "actual": _repr(result) if error is None else "",
            "passed": passed,
            "error": error,
            "note": note,
        })
    return cases


def _grade_steps(problem, code):
    with _workdir(problem):
        return _grade_steps_in_dir(problem, code)


def _grade_steps_in_dir(problem, code):
    out, error, ns = _exec(code)
    env = dict(ns)
    try:
        import numpy as np  # noqa: F401  (단계 검사식에서 np를 쓴다)
        env.setdefault("np", np)
    except ImportError:
        pass
    cases = []
    for check in problem["checks"]:
        passed = False
        note = ""
        try:
            passed = bool(eval(check["expr"], env))
            if not passed:
                note = check.get("hint", "")
        except NameError as exc:
            missing = str(exc).split("'")[1] if "'" in str(exc) else str(exc)
            note = f"아직 '{missing}' 변수가 없습니다. 문제에서 정한 변수 이름을 그대로 쓰세요."
        except Exception as exc:
            note = f"검사 중 오류: {type(exc).__name__}: {exc}. " + check.get("hint", "")
        cases.append({
            "hidden": False,
            "input": check["label"],
            "expected": "",
            "actual": "",
            "passed": passed,
            "error": None,
            "note": note,
        })
    _figures(capture=False)
    return cases, out, error


def grade(problem, code):
    kind = problem["type"]
    stdout, error = "", None
    if kind == "io":
        cases = _grade_io(problem, code)
    elif kind == "function":
        cases = _grade_function(problem, code)
    else:
        cases, stdout, error = _grade_steps(problem, code)
    passed_count = sum(1 for c in cases if c["passed"])
    return {
        "passed": passed_count == len(cases) and len(cases) > 0,
        "passed_count": passed_count,
        "total_count": len(cases),
        "cases": cases,
        "stdout": stdout,
        "error": error,
    }


def run(problem, code, stdin=""):
    """채점 없이 실행. 함수형은 공개 예시로 solution을 호출해 결과를 덧붙인다."""
    first = next((t for t in problem.get("tests") or [] if not t.get("hidden")), None)
    with _workdir(problem, first):
        return _run_in_dir(problem, code, stdin)


def _run_in_dir(problem, code, stdin):
    out, error, ns = _exec(code, stdin, echo=True)
    calls = []
    if error is None and problem["type"] == "function":
        for test in problem["tests"]:
            if test.get("hidden"):
                continue
            with _workdir(problem, test):
                result, call_error = _call_solution(ns, test["args"])
            label = "solution(" + ", ".join(_repr(a) for a in test["args"]) + ")"
            calls.append({
                "call": label,
                "result": _repr(result) if call_error is None else "",
                "error": call_error,
            })
            if call_error and call_error["type"] == "NameError":
                break
    return {"stdout": out, "error": error, "calls": calls, "images": _figures()}


def grade_json(problem_json, code):
    return json.dumps(grade(json.loads(problem_json), code), ensure_ascii=False)


def run_json(problem_json, code, stdin=""):
    return json.dumps(run(json.loads(problem_json), code, stdin), ensure_ascii=False)
