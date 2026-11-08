"""파이썬 기초 표준 라이브러리 코스(pb-13) 도식(SVG) 생성기.

python3 scripts/figures_stdlib.py  ->  content/img/py/*.svg
그리기 도우미와 색은 figures_ml.py와 같은 것을 쓴다. 그림 속 숫자 · 코드는 레슨 본문과 같아야 한다.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from figures_ml import (ACC, CYAN, FAIL, INK, INK2, LINE2, MUTED, ORANGE, PASS, SURF, SURF3, TRACK, WARN,  # noqa: E402
                        arrow, box, circle, line, path, rect, svg, text)

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "py")
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def code(x, y, s, size=12.5, fill=INK2, anchor="start", weight=500):
    s = "\n".join(ln.replace(" ", " ") if ln.startswith(" ") else ln for ln in str(s).split("\n"))
    return text(x, y, s, size, fill, anchor, weight, mono=True)


def file_icon(x, y, name, c=INK2, w=96):
    return (rect(x, y, w, 30, SURF3, c, 5, 1.3) + text(x + w / 2, y + 15, name, 12, c, weight=600, mono=True))


# ---------------- pb-13-1 모듈 · 패키지 · 라이브러리 ----------------
@fig("py-module-library")
def _():
    b = []
    # 1. 모듈
    b.append(rect(10, 10, 210, 250, SURF, LINE2, 10))
    b.append(text(30, 34, "① 모듈", 16, ACC, "start", 700))
    b.append(text(30, 56, ".py 파일 하나 = 작은 도구 상자", 12, MUTED, "start"))
    b.append(rect(30, 76, 170, 160, ACC, ACC, 8, 1.8, op=0.08))
    b.append(code(42, 96, "math.py", 13, ACC, weight=700))
    b.append(line(42, 110, 188, 110, LINE2))
    for i, s in enumerate(["sqrt()  제곱근", "ceil()  올림", "floor() 내림", "pi      3.14159…"]):
        b.append(code(42, 132 + i * 26, s, 12, INK2))
    # 2. 패키지
    b.append(arrow(226, 135, 250, 135, MUTED))
    b.append(rect(256, 10, 230, 250, SURF, LINE2, 10))
    b.append(text(276, 34, "② 패키지", 16, CYAN, "start", 700))
    b.append(text(276, 56, "모듈 여러 개를 폴더로 묶은 것", 12, MUTED, "start"))
    b.append(path("M276,84 h46 l8,10 h126 v136 h-180 z", CYAN, 1.6, fill="none"))
    b.append(code(286, 106, "pandas/", 13, CYAN, weight=700))
    for i, s in enumerate(["frame.py", "series.py", "io/ …"]):
        b.append(file_icon(296, 124 + i * 36, s, INK2, 110))
    # 3. 라이브러리
    b.append(arrow(492, 135, 516, 135, MUTED))
    b.append(rect(522, 10, 268, 250, SURF, LINE2, 10))
    b.append(text(542, 34, "③ 라이브러리", 16, TRACK, "start", 700))
    b.append(text(542, 56, "모듈 · 패키지를 모아 부르는 말", 12, MUTED, "start"))
    b.append(rect(540, 74, 232, 78, SURF3, PASS, 8, 1.4))
    b.append(text(552, 92, "표준 라이브러리 · 설치 없이", 12.5, PASS, "start", 700))
    b.append(code(552, 118, "math  datetime  random\nos  csv  json …", 12, INK2))
    b.append(rect(540, 162, 232, 78, SURF3, ORANGE, 8, 1.4))
    b.append(text(552, 180, "외부 라이브러리 · pip 설치", 12.5, ORANGE, "start", 700))
    b.append(code(552, 206, "numpy  pandas\nmatplotlib  scikit-learn", 12, INK2))
    return svg(800, 270, b, "모듈, 패키지, 라이브러리의 관계")


# ---------------- pb-13-1 import 네 가지 모양 ----------------
@fig("py-import-forms")
def _():
    rows = [
        ("import math", "math.sqrt(25)", "모듈 이름을 붙여 부른다. 어디서 온 함수인지 바로 보인다", ACC),
        ("from math import sqrt", "sqrt(25)", "꺼낸 이름만 바로 쓴다. 짧지만 출처가 안 보인다", CYAN),
        ("import numpy as np", "np.array([1, 2])", "긴 이름에 별명을 붙인다. np · pd는 모두가 쓰는 관례", TRACK),
        ("from math import *", "sqrt(25)  ceil(4.1) …", "전부 꺼낸다. 내 변수와 이름이 겹칠 수 있어 쓰지 않는다", FAIL),
    ]
    b = []
    b.append(text(20, 20, "불러오는 줄", 12.5, MUTED, "start", 600))
    b.append(text(300, 20, "쓰는 법", 12.5, MUTED, "start", 600))
    b.append(text(500, 20, "특징", 12.5, MUTED, "start", 600))
    for i, (imp, use, note, c) in enumerate(rows):
        y = 38 + i * 62
        b.append(rect(10, y, 840, 52, SURF, LINE2, 8))
        b.append(rect(10, y, 6, 52, c, c, 2))
        b.append(code(28, y + 26, imp, 13.5, c, weight=700))
        b.append(arrow(258, y + 26, 286, y + 26, MUTED, 1.5))
        b.append(code(300, y + 26, use, 13, INK))
        b.append(text(500, y + 26, note, 12.5, INK2 if i < 3 else FAIL, "start"))
    return svg(860, 290, b, "import 문의 네 가지 모양과 쓰는 법")


# ---------------- pb-13-2 datetime 네 타입 ----------------
@fig("py-datetime-types")
def _():
    b = []
    items = [
        ("date", "달력의 한 칸", "date(2026, 11, 7)", "2026-11-07", PASS),
        ("time", "시계의 한 순간", "time(9, 30)", "09:30:00", CYAN),
        ("datetime", "달력 + 시계", "datetime(2026, 11, 7, 9, 30)", "2026-11-07 09:30:00", ACC),
        ("timedelta", "스톱워치 · 간격", "timedelta(days=1, hours=3)", "1 day, 3:00:00", ORANGE),
    ]
    for i, (name, alias, ctor, out, c) in enumerate(items):
        x = 10 + (i % 2) * 400
        y = 10 + (i // 2) * 112
        b.append(rect(x, y, 390, 100, SURF, LINE2, 10))
        b.append(rect(x, y, 6, 100, c, c, 2))
        b.append(code(x + 22, y + 24, name, 16, c, weight=700))
        b.append(text(x + 22 + len(name) * 10 + 16, y + 24, alias, 12.5, MUTED, "start"))
        b.append(code(x + 22, y + 54, ctor, 12.5, INK))
        b.append(code(x + 22, y + 80, "→ " + out, 12.5, INK2))
    b.append(code(205, 246, "datetime ± timedelta → datetime", 13, INK, "middle", 600))
    b.append(code(605, 246, "datetime − datetime → timedelta", 13, INK, "middle", 600))
    return svg(800, 266, b, "datetime 모듈의 네 가지 타입")


# ---------------- pb-13-2 strftime / strptime ----------------
@fig("py-strftime-strptime")
def _():
    b = []
    b.append(rect(10, 40, 210, 110, ACC, ACC, 12, 1.8, op=0.08))
    b.append(text(115, 70, "datetime", 16, ACC, weight=700, mono=True))
    b.append(text(115, 96, "계산 · 비교 가능", 12.5, INK2))
    b.append(code(115, 124, "2026-11-07 09:00:00", 12, INK, "middle"))
    b.append(rect(580, 40, 210, 110, SURF3, ORANGE, 12, 1.6))
    b.append(text(685, 70, "str (문자열)", 16, ORANGE, weight=700))
    b.append(text(685, 96, "보기 · 저장용, 계산 불가", 12.5, INK2))
    b.append(code(685, 124, "'2026-11-07 09:00'", 12, INK, "middle"))
    b.append(arrow(230, 70, 570, 70, ACC, 2, accent=True))
    b.append(code(400, 52, "strftime(\"%Y-%m-%d %H:%M\")", 12.5, ACC, "middle", 700))
    b.append(text(400, 86, "f = format, 날짜 → 글자", 11.5, MUTED))
    b.append(arrow(570, 124, 230, 124, MUTED, 2))
    b.append(code(400, 108, "datetime.strptime(s, \"%Y-%m-%d %H:%M\")", 12.5, INK2, "middle", 700))
    b.append(text(400, 142, "p = parse, 글자 → 날짜", 11.5, MUTED))
    b.append(text(400, 178, "두 방향 모두 같은 포맷 코드(%Y %m %d %H %M %S)를 쓴다", 12.5, INK2))
    return svg(800, 196, b, "strftime과 strptime의 방향")


# ---------------- pb-13-3 ceil · floor · trunc · round ----------------
@fig("py-ceil-floor-trunc")
def _():
    b = []
    x0, x1, y = 60, 760, 70
    lo, hi = -6, 6
    X = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)
    b.append(line(x0 - 10, y, x1 + 10, y, INK2, 1.6))
    for v in range(lo, hi + 1):
        b.append(line(X(v), y - 6, X(v), y + 6, INK2, 1.4))
        b.append(text(X(v), y + 20, v, 12, MUTED if v else INK, weight=600, mono=True))
    for v, label in [(4.6, "4.6"), (-4.6, "-4.6")]:
        b.append(circle(X(v), y, 6, WARN))
        b.append(text(X(v), y - 22, label, 13, WARN, weight=700, mono=True))
    rows = [
        ("math.ceil", "올림 · 큰 쪽(오른쪽)으로", 5, -4, ACC),
        ("math.floor", "내림 · 작은 쪽(왼쪽)으로", 4, -5, CYAN),
        ("math.trunc", "버림 · 0 쪽으로 (int()와 같다)", 4, -4, TRACK),
        ("round", "반올림 · 가까운 쪽으로", 5, -5, PASS),
    ]
    b.append(text(380, 128, "4.6", 12.5, MUTED, weight=600, mono=True))
    b.append(text(470, 128, "-4.6", 12.5, MUTED, weight=600, mono=True))
    for i, (fn, desc, a, c_, col) in enumerate(rows):
        yy = 156 + i * 30
        b.append(code(60, yy, fn, 13, col, weight=700))
        b.append(text(170, yy, desc, 12.5, INK2, "start"))
        b.append(code(380, yy, a, 13, INK, "middle", 700))
        b.append(code(470, yy, c_, 13, INK if c_ == -5 and fn == "math.floor" else INK, "middle", 700))
    b.append(text(560, 186, "양수에서는 floor = trunc,\n음수에서는 갈린다", 12.5, WARN, "start", 600))
    return svg(820, 276, b, "ceil, floor, trunc, round를 수직선 위에서 비교")


# ---------------- pb-13-3 seed ----------------
@fig("py-random-seed")
def _():
    b = []
    seq = [1, 1, 3, 2, 2]
    for r, (label, s, vals, c) in enumerate([
        ("random.seed(42)", "1회차 실행", seq, ACC),
        ("random.seed(42)", "2회차 실행", seq, ACC),
        ("seed 없음", "실행마다", [4, 2, 5, 1, 3], MUTED),
    ]):
        y = 14 + r * 62
        b.append(rect(10, y, 760, 50, SURF, LINE2, 8))
        b.append(code(28, y + 25, label, 13, c, weight=700))
        b.append(text(200, y + 25, s, 12, MUTED, "start"))
        b.append(arrow(280, y + 25, 312, y + 25, MUTED, 1.5))
        for i, v in enumerate(vals):
            b.append(rect(324 + i * 52, y + 9, 44, 32, SURF3, c if r < 2 else LINE2, 6, 1.3))
            b.append(text(346 + i * 52, y + 25, v if r < 2 else "?", 14, INK, weight=700, mono=True))
        b.append(text(612, y + 25, "같은 순서 그대로" if r < 2 else "매번 다른 순서", 12.5, PASS if r < 2 else WARN, "start", 600))
    b.append(text(390, 210, "seed는 난수 목록의 '시작 번호'. 번호가 같으면 같은 목록을 처음부터 다시 읽는다", 12.5, INK2))
    return svg(780, 226, b, "seed를 고정하면 같은 난수가 같은 순서로 나온다")


# ---------------- pb-13-4 경로 ----------------
@fig("py-os-paths")
def _():
    b = []
    b.append(rect(10, 10, 360, 250, SURF, LINE2, 10))
    b.append(text(30, 34, "폴더 나무", 15, INK, "start", 700))
    tree = [
        (0, "/  (맨 꼭대기)", MUTED),
        (1, "tmp/", MUTED),
        (2, "rb-a1b2c3/   ← 지금 위치 (작업 폴더)", ACC),
        (3, "logs/", CYAN),
        (4, "20261107/", CYAN),
        (5, "inspection.csv", INK),
    ]
    for i, (d, name, c) in enumerate(tree):
        x, y = 30 + d * 22, 64 + i * 32
        if d:
            b.append(path(f"M{x - 12},{y - 22} v22 h8", LINE2, 1.2))
        b.append(code(x, y, name, 12.5, c, weight=700 if c in (ACC, CYAN) else 500))
    b.append(rect(390, 10, 400, 118, SURF, LINE2, 10))
    b.append(text(410, 34, "상대 경로 · 지금 위치에서 출발", 14, CYAN, "start", 700))
    b.append(code(410, 66, "logs/20261107/inspection.csv", 12.5, INK))
    b.append(text(410, 98, "짧다. 작업 폴더가 바뀌면 가리키는 곳도 바뀐다", 12, MUTED, "start"))
    b.append(rect(390, 142, 400, 118, SURF, LINE2, 10))
    b.append(text(410, 166, "절대 경로 · 맨 꼭대기(/)에서 출발", 14, ACC, "start", 700))
    b.append(code(410, 198, "/tmp/rb-a1b2c3/logs/20261107/\ninspection.csv", 12, INK))
    b.append(text(410, 240, "어디서 실행해도 같은 곳. os.path.abspath()로 만든다", 12, MUTED, "start"))
    return svg(800, 270, b, "폴더 나무와 상대 경로, 절대 경로")


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
