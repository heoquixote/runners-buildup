"""데이터 분석 PART 1 · 개발 환경(pip · 가상환경) 레슨 도식(SVG) 생성기.

python3 scripts/figures_env.py  ->  content/img/env/*.svg
그리기 도우미와 색은 figures_ml.py · figures_libs.py와 같은 것을 쓴다. 그림 속 명령 · 폴더 이름은 레슨 본문과 같아야 한다.
pip과 가상환경 코스(da-00-1 · da-00-2 · da-00-3)에서 쓴다. 기획안: docs/lesson-plans/python-da-env.md
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from figures_ml import (ACC, CYAN, FAIL, INK, INK2, LINE2, MUTED, ORANGE, PASS, SURF, SURF3, TRACK, WARN,  # noqa: E402
                        arrow, circle, line, rect, svg, text)
from figures_libs import code, pill  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "env")
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def term(x, y, w, h, title, color=LINE2):
    """터미널 창 틀: 제목 줄 + 신호등 점."""
    b = [rect(x, y, w, h, SURF, color, 10, 1.4), rect(x, y, w, 28, SURF3, color, 10, 1.4),
         rect(x + 1, y + 18, w - 2, 10, SURF3, SURF3, 0, 0)]
    for i, c in enumerate([FAIL, WARN, PASS]):
        b.append(circle(x + 16 + i * 14, y + 14, 4, c, op=0.8))
    b.append(text(x + 62, y + 14, title, 12, INK2, "start", 600))
    return "".join(b)


# ---------------- da-00-1 pip ----------------
@fig("pip-pypi")
def _():
    b = []
    # PyPI 창고
    b.append(rect(20, 30, 220, 220, SURF, CYAN, 12, 1.6))
    b.append(text(130, 56, "PyPI", 18, CYAN, weight=700))
    b.append(text(130, 78, "파이썬 패키지 창고 (pypi.org)", 12, MUTED))
    names = ["numpy", "pandas", "matplotlib", "seaborn", "scikit-learn", "requests"]
    for i, n in enumerate(names):
        r, c = divmod(i, 2)
        b.append(rect(38 + c * 96, 98 + r * 40, 88, 30, SURF3, LINE2, 6))
        b.append(text(82 + c * 96, 113 + r * 40, n, 11.5, INK2, mono=True))
    b.append(text(130, 230, "패키지 수십만 개", 12, MUTED))
    # pip
    b.append(rect(300, 110, 150, 60, ACC, ACC, 12, 2, op=0.12))
    b.append(text(375, 132, "pip", 20, ACC, weight=700, mono=True))
    b.append(text(375, 155, "찾아 와서 설치 · 관리", 12, INK2))
    b.append(arrow(244, 125, 294, 125, ACC, 2, accent=True))
    b.append(text(270, 108, "받기", 11.5, ACC))
    # 내 컴퓨터
    b.append(rect(510, 30, 250, 220, SURF, LINE2, 12, 1.4))
    b.append(text(635, 56, "내 컴퓨터의 파이썬", 15, INK, weight=700))
    b.append(rect(530, 76, 210, 150, SURF3, LINE2, 8))
    b.append(code(545, 96, "site-packages/", 12.5, CYAN))
    b.append(text(545, 116, "설치된 패키지가 모이는 폴더", 11.5, MUTED, "start"))
    for i, n in enumerate(["numpy  2.x", "pandas 2.x", "..."]):
        b.append(code(560, 146 + i * 24, n, 12.5, INK2))
    b.append(arrow(454, 140, 504, 140, ACC, 2, accent=True))
    # 명령 4개
    cmds = [("pip install pandas", "설치", PASS), ("pip install --upgrade pandas", "업그레이드", CYAN),
            ("pip install pandas==2.2.2", "버전 지정", WARN), ("pip uninstall pandas", "삭제", FAIL)]
    for i, (c, d, col) in enumerate(cmds):
        x = 20 + (i % 2) * 380
        y = 272 + (i // 2) * 40
        b.append(pill(x, y, 250, 30, c, col, 12))
        b.append(text(x + 262, y + 15, d, 12.5, INK2, "start"))
    return svg(780, 352, b, "PyPI 창고에서 pip이 패키지를 받아 내 컴퓨터 파이썬에 설치한다")


@fig("pip-where")
def _():
    b = []
    cols = [
        ("터미널 (명령 프롬프트)", "Windows: cmd · PowerShell\nmacOS: 터미널 · VS Code 터미널",
         ["C:\\> pip install pandas", "$ pip install pandas"], "pip 명령은 여기에", PASS),
        ("파이썬 대화형 (>>>)", "터미널에서 python 을 치면 들어감",
         [">>> pip install pandas", "SyntaxError"], "여기에 치면 에러.\nexit() 로 나와서 터미널로", FAIL),
        ("노트북 셀 (Jupyter · Colab)", "셀 안은 파이썬이지만\n앞에 % 나 ! 를 붙이면 명령",
         ["%pip install pandas", "!pip install pandas"], "% 는 지금 노트북 커널에 설치\n(Colab 은 ! 도 많이 씀)", WARN),
    ]
    for i, (t, sub, lines, note, col) in enumerate(cols):
        x = 16 + i * 252
        b.append(term(x, 16, 236, 170, t, col))
        b.append(text(x + 14, 66, sub, 11.5, MUTED, "start"))
        for k, ln in enumerate(lines):
            fill = FAIL if ln == "SyntaxError" else INK
            b.append(code(x + 14, 116 + k * 26, ln, 12, fill))
        b.append(rect(x, 198, 236, 58, col, col, 8, 1.4, op=0.1))
        b.append(text(x + 118, 227, note, 12.5, col, weight=600))
    return svg(788, 270, b, "pip 명령을 치는 곳: 터미널은 그대로, 파이썬 >>> 에서는 에러, 노트북 셀은 % 를 붙인다")


@fig("pip-which-python")
def _():
    b = []
    b.append(text(20, 22, "한 컴퓨터에 파이썬이 둘 있을 때 (예: python.org 3.12 + Anaconda 3.11)", 13, MUTED, "start"))
    # 두 파이썬
    for i, (name, path_, col) in enumerate([("파이썬 A", "C:\\Python312\\python.exe", CYAN),
                                            ("파이썬 B", "C:\\anaconda3\\python.exe", ORANGE)]):
        y = 50 + i * 110
        b.append(rect(470, y, 290, 90, SURF, col, 10, 1.6))
        b.append(text(486, y + 22, name, 14, col, "start", 700))
        b.append(code(486, y + 46, path_, 11.5, INK2))
        b.append(code(486, y + 70, "site-packages/", 11.5, MUTED))
    # 왼쪽 명령
    b.append(pill(20, 70, 250, 34, "pip install pandas", WARN, 12.5))
    b.append(text(20, 124, "PATH 에서 먼저 찾은 pip 이 설치.\n어느 파이썬인지 겉으로는 모른다", 12, INK2, "start"))
    b.append(arrow(274, 87, 464, 87, WARN, 1.8, dash="5 4"))
    b.append(arrow(274, 87, 464, 190, WARN, 1.8, dash="5 4"))
    b.append(text(372, 122, "?", 22, WARN, weight=700))
    b.append(pill(20, 200, 250, 34, "python -m pip install pandas", ACC, 12.5))
    b.append(text(20, 254, "'지금 python 으로 실행되는 그 파이썬'에\n설치. 실행할 파이썬과 항상 같다", 12, INK2, "start"))
    b.append(arrow(274, 217, 464, 110, ACC, 2, accent=True))
    b.append(text(20, 296, "python 이 A 를 가리키면 A 에, 가상환경을 켜 두면 가상환경에 설치됩니다", 12.5, ACC, "start", 600))
    return svg(780, 316, b, "pip 과 python -m pip 이 설치하는 곳의 차이")


# ---------------- da-00-2 venv ----------------
@fig("venv-conflict")
def _():
    b = []
    # 왼쪽: 한 환경
    b.append(rect(14, 14, 360, 280, SURF, FAIL, 12, 1.4))
    b.append(text(194, 38, "가상환경 없이: 파이썬 하나를 같이 씀", 14, FAIL, weight=700))
    for i, (p, need) in enumerate([("프로젝트 A", "pandas 1.x 필요"), ("프로젝트 B", "pandas 2.x 필요")]):
        x = 34 + i * 170
        b.append(rect(x, 60, 150, 56, SURF3, LINE2, 8))
        b.append(text(x + 75, 80, p, 13.5, INK, weight=600))
        b.append(text(x + 75, 100, need, 11.5, MUTED))
        b.append(arrow(x + 75, 120, 194, 168, MUTED, 1.6))
    b.append(rect(74, 172, 240, 64, SURF3, FAIL, 8, 1.6))
    b.append(text(194, 192, "파이썬 (하나)", 13.5, INK, weight=600))
    b.append(code(194, 216, "pandas 2.x 만 설치됨", 12, FAIL, "middle"))
    b.append(text(194, 266, "B 에 맞춰 올리면 A 가 깨진다", 13, FAIL, weight=600))
    # 오른쪽: 가상환경 둘
    b.append(rect(392, 14, 374, 280, SURF, PASS, 12, 1.4))
    b.append(text(579, 38, "가상환경으로: 프로젝트마다 따로", 14, PASS, weight=700))
    for i, (p, v) in enumerate([("프로젝트 A", "pandas 1.5.3"), ("프로젝트 B", "pandas 2.2.2")]):
        x = 410 + i * 182
        b.append(rect(x, 60, 164, 176, SURF3, PASS, 10, 1.4))
        b.append(text(x + 82, 82, p, 13.5, INK, weight=600))
        b.append(rect(x + 14, 102, 136, 116, SURF, LINE2, 8))
        b.append(code(x + 26, 122, "venv/", 12.5, CYAN))
        b.append(code(x + 26, 150, "파이썬", 12, INK2))
        b.append(code(x + 26, 176, v, 12, PASS))
        b.append(code(x + 26, 200, "numpy ...", 12, MUTED))
    b.append(text(579, 266, "서로 영향 없음", 13, PASS, weight=600))
    return svg(780, 308, b, "가상환경이 없으면 프로젝트끼리 버전이 충돌하고, 있으면 따로 쓴다")


@fig("venv-folder")
def _():
    b = []
    rows = [
        (0, "my_project/", INK, "프로젝트 폴더 (여기서 터미널을 연다)"),
        (1, "venv/", CYAN, "python -m venv venv 가 만든 가상환경"),
        (2, "Scripts/   (macOS · Linux: bin/)", INK2, "activate, python, pip 이 들어 있음"),
        (2, "Lib/site-packages/", INK2, "이 프로젝트에 설치한 패키지가 쌓이는 곳"),
        (2, "pyvenv.cfg", INK2, "어떤 파이썬으로 만들었는지 기록"),
        (1, "app.py", INK, "내 코드"),
        (1, "requirements.txt", ACC, "설치 목록 (다음 레슨)"),
        (1, ".gitignore", ACC, "Git 에 올리지 않을 것 (다음 레슨)"),
    ]
    b.append(rect(14, 14, 760, 30 + len(rows) * 34, SURF, LINE2, 12, 1.3))
    for i, (d, name, col, note) in enumerate(rows):
        y = 44 + i * 34
        x = 34 + d * 28
        if d:
            b.append(line(x - 18, y - 22, x - 18, y, LINE2, 1.2))
            b.append(line(x - 18, y, x - 6, y, LINE2, 1.2))
        b.append(code(x, y, name, 13, col))
        b.append(text(420, y, note, 12.5, MUTED, "start"))
    b.append(rect(28, 52 + 34, 370, 3 * 34 + 14, CYAN, CYAN, 8, 1.2, op=0.06))
    return svg(788, 60 + len(rows) * 34, b, "가상환경을 만든 뒤 프로젝트 폴더 구조")


@fig("venv-workflow")
def _():
    b = []
    first = [("① 폴더 열기", "VS Code 에서\n프로젝트 폴더", INK2), ("② 만들기", "python -m venv venv", CYAN),
             ("③ 인터프리터 선택", "VS Code 에서\nvenv 파이썬", CYAN)]
    daily = [("④ 켜기", "activate\n→ (venv) 표시", ACC), ("⑤ 설치 · 코딩", "python -m pip install …\n코드 실행", ACC),
             ("⑥ 기록", "pip freeze >\nrequirements.txt", ACC), ("⑦ 끄기", "deactivate", ACC)]
    b.append(text(20, 22, "처음 한 번", 13, CYAN, "start", 700))
    for i, (t, d, col) in enumerate(first):
        x = 20 + i * 190
        b.append(rect(x, 36, 170, 86, SURF3, col, 10, 1.5))
        b.append(text(x + 85, 58, t, 13.5, col, weight=700))
        b.append(text(x + 85, 94, d, 11.5, INK2, mono="venv" in d and "\n" not in d))
        if i < len(first) - 1:
            b.append(arrow(x + 172, 79, x + 188, 79, MUTED, 1.6))
    b.append(text(20, 152, "작업할 때마다", 13, ACC, "start", 700))
    for i, (t, d, col) in enumerate(daily):
        x = 20 + i * 190
        b.append(rect(x, 166, 170, 86, SURF3, col, 10, 1.5))
        b.append(text(x + 85, 188, t, 13.5, col, weight=700))
        b.append(text(x + 85, 224, d, 11.5, INK2))
        if i < len(daily) - 1:
            b.append(arrow(x + 172, 209, x + 188, 209, MUTED, 1.6))
    b.append(line(485, 124, 485, 138, MUTED, 1.4, dash="4 4"))
    b.append(line(485, 138, 160, 138, MUTED, 1.4, dash="4 4"))
    b.append(arrow(160, 138, 160, 162, MUTED, 1.4, dash="4 4"))
    return svg(780, 268, b, "가상환경 작업 흐름: 처음 한 번 만들고, 작업할 때마다 켜고 끈다")


# ---------------- da-00-3 requirements ----------------
@fig("requirements-flow")
def _():
    b = []
    # 내 PC
    b.append(rect(14, 30, 230, 220, SURF, CYAN, 12, 1.5))
    b.append(text(129, 52, "내 PC", 14, CYAN, weight=700))
    b.append(rect(30, 68, 198, 84, SURF3, LINE2, 8))
    b.append(code(42, 86, "(venv)", 12, CYAN))
    for i, n in enumerate(["pandas 2.2.2", "numpy 1.26.4"]):
        b.append(code(42, 110 + i * 22, n, 12, INK2))
    b.append(pill(22, 176, 214, 30, "pip freeze > requirements.txt", ACC, 10.5))
    b.append(text(129, 228, "① 지금 환경을 파일로", 12, INK2))
    # 파일
    b.append(rect(290, 56, 200, 130, SURF3, ACC, 10, 1.6))
    b.append(text(390, 76, "requirements.txt", 13, ACC, weight=700, mono=True))
    for i, n in enumerate(["pandas==2.2.2", "numpy==1.26.4", "matplotlib==3.9.0"]):
        b.append(code(306, 104 + i * 24, n, 12, INK))
    b.append(text(390, 212, "② 이 작은 파일만 Git 으로 공유", 12, INK2))
    b.append(arrow(248, 120, 284, 120, ACC, 2, accent=True))
    # 팀원 PC
    b.append(rect(536, 30, 230, 220, SURF, PASS, 12, 1.5))
    b.append(text(651, 52, "팀원 PC · 새 노트북", 14, PASS, weight=700))
    b.append(rect(552, 68, 198, 84, SURF3, LINE2, 8))
    b.append(code(564, 86, "(venv)  새로 만든 환경", 12, PASS))
    for i, n in enumerate(["pandas 2.2.2", "numpy 1.26.4"]):
        b.append(code(564, 110 + i * 22, n, 12, INK2))
    b.append(pill(544, 176, 214, 30, "pip install -r requirements.txt", ACC, 10.5))
    b.append(text(651, 228, "③ 같은 버전으로 되살리기", 12, INK2))
    b.append(arrow(494, 120, 530, 120, ACC, 2, accent=True))
    return svg(780, 264, b, "requirements.txt 로 환경을 저장하고 다른 PC 에서 되살리는 흐름")


@fig("gitignore-share")
def _():
    b = []
    b.append(rect(14, 14, 370, 230, SURF, PASS, 12, 1.5))
    b.append(text(199, 38, "Git 에 올린다 (공유)", 14, PASS, weight=700))
    for i, (n, d) in enumerate([("app.py · *.ipynb", "내 코드"), ("requirements.txt", "설치 목록 (몇 줄)"),
                                (".gitignore", "올리지 않을 목록"), ("README.md", "실행 방법 안내")]):
        b.append(code(34, 72 + i * 40, n, 13, INK))
        b.append(text(220, 72 + i * 40, d, 12, MUTED, "start"))
    b.append(rect(400, 14, 374, 230, SURF, FAIL, 12, 1.5))
    b.append(text(587, 38, ".gitignore 로 뺀다 (각자 PC 에만)", 14, FAIL, weight=700))
    for i, (n, d) in enumerate([("venv/", "수백 MB, 운영체제마다 다름"), ("__pycache__/", "파이썬이 만드는 임시 파일"),
                                (".ipynb_checkpoints/", "노트북 자동 저장본"), (".env", "비밀번호 · API 키")]):
        b.append(code(420, 72 + i * 40, n, 13, INK))
        b.append(text(600, 72 + i * 40, d, 12, MUTED, "start"))
    b.append(text(394, 262, "venv 는 requirements.txt 만 있으면 누구나 다시 만들 수 있다", 12.5, ACC, weight=600))
    return svg(788, 280, b, "Git 에 올리는 파일과 .gitignore 로 빼는 파일")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    only = set(sys.argv[1:])
    n = 0
    for name, f in FIGS.items():
        if only and name not in only:
            continue
        with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as fh:
            fh.write(f())
        n += 1
    print(f"{n} figures -> {os.path.normpath(OUT)}")
