"""라이브러리 소개 레슨 도식(SVG) 생성기.

python3 scripts/figures_libs.py  ->  content/img/libs/*.svg
그리기 도우미와 색은 figures_ml.py와 같은 것을 쓴다. 그림 속 숫자 · 코드는 레슨 본문과 같아야 한다.
NumPy · pandas · matplotlib · seaborn · scikit-learn · PyTorch 소개 레슨(da-01-0, da-03-0, da-09-0, da-10-0, ml-01-0, dl-01-0)에서 쓴다.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from figures_ml import (ACC, CYAN, FAIL, INK, INK2, LINE2, MUTED, ORANGE, PASS, SURF, SURF3, TRACK, WARN,  # noqa: E402
                        arrow, box, circle, line, path, rect, svg, text)

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "libs")
PINK = "#ff8fcf"
DARK = "#121516"
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def code(x, y, s, size=12.5, fill=INK2, anchor="start"):
    # SVG는 앞쪽 공백을 지우므로 들여쓰기는 줄바꿈 없는 공백으로 바꾼다
    s = "\n".join(ln.replace(" ", "\u00a0") if ln.startswith(" ") else ln for ln in str(s).split("\n"))
    return text(x, y, s, size, fill, anchor, 500, mono=True)


def pill(x, y, w, h, label, c, size=12.5, mono=True):
    return rect(x, y, w, h, c, c, h / 2, 1.4, op=0.14) + text(x + w / 2, y + h / 2, label, size, c, weight=600, mono=mono)


# ---------------- 데이터 파이썬 지도 (레슨마다 강조만 바뀜) ----------------
LIBS = {
    # key: (x, y, w, h, 이름, 역할)
    "python": (20, 280, 740, 44, "Python", "기본 문법 · 표준 라이브러리"),
    "numpy": (20, 208, 550, 56, "NumPy", "숫자 배열을 한 번에 계산"),
    "pandas": (20, 128, 174, 64, "pandas", "표 데이터 다루기"),
    "matplotlib": (208, 128, 174, 64, "matplotlib", "그래프 그리기"),
    "sklearn": (396, 128, 174, 64, "scikit-learn", "머신러닝"),
    "seaborn": (208, 48, 174, 64, "seaborn", "통계 그래프"),
    "pytorch": (586, 48, 174, 216, "PyTorch", "딥러닝"),
}
TRACKS = {"numpy": "데이터 분석", "pandas": "데이터 분석", "matplotlib": "데이터 시각화", "seaborn": "데이터 시각화",
          "sklearn": "머신러닝", "pytorch": "딥러닝"}


def lib_map(focus):
    b = []
    b.append(text(20, 20, "아래 칸이 바닥, 위 칸은 아래 도구를 바탕으로 만들어졌습니다", 12.5, MUTED, "start"))
    b.append(circle(560, 20, 5, ACC))
    b.append(text(572, 20, f"지금 배우는 도구 · {TRACKS[focus]} 트랙", 12.5, ACC, "start", 700))
    for key, (x, y, w, h, name, role) in LIBS.items():
        on = key == focus
        c = ACC if on else (INK2 if key == "python" else LINE2)
        if on:
            b.append(rect(x, y, w, h, ACC, ACC, 10, 2.4, op=0.14))
        else:
            b.append(rect(x, y, w, h, SURF3 if key != "python" else SURF, c, 10, 1.3))
        nc = ACC if on else (INK if key == "python" else INK2)
        rc = INK if on else MUTED
        if key == "pytorch":
            b.append(text(x + w / 2, y + 70, name, 17, nc, weight=700))
            b.append(text(x + w / 2, y + 96, role, 13, rc))
            b.append(text(x + w / 2, y + 140, "NumPy와 닮은\n'텐서'를 스스로 갖고\nGPU에서 계산", 12, MUTED))
        elif h <= 44:
            b.append(text(x + 18, y + h / 2, name, 16, nc, "start", 700))
            b.append(text(x + 100, y + h / 2, role, 13, rc, "start"))
        else:
            b.append(text(x + w / 2, y + h / 2 - 11, name, 16, nc, weight=700))
            b.append(text(x + w / 2, y + h / 2 + 13, role, 12.5, rc))
    return svg(780, 334, b, "데이터 분석에 쓰는 파이썬 라이브러리 지도")


for _k in LIBS:
    if _k != "python":
        FIGS[f"lib-map-{_k}"] = (lambda k: (lambda: lib_map(k)))(_k)


# ---------------- NumPy ----------------
@fig("np-list-vs-array")
def _():
    b = []
    # 리스트
    b.append(rect(10, 10, 350, 250, SURF, LINE2, 10))
    b.append(text(30, 34, "파이썬 리스트", 15, ORANGE, "start", 700))
    b.append(text(30, 56, "칸에는 '값이 있는 곳' 쪽지만, 값은 여기저기 흩어져 있다", 12, MUTED, "start"))
    for i in range(5):
        b.append(rect(30 + i * 46, 76, 46, 38, SURF3, ORANGE, 0, 1.4))
        b.append(circle(53 + i * 46, 95, 4, ORANGE))
    spots = [(70, 196, "12"), (300, 168, "8"), (150, 222, "15"), (230, 182, "10"), (318, 226, "5")]
    for i, (sx, sy, v) in enumerate(spots):
        b.append(path(f"M{53 + i * 46},{99} Q{(53 + i * 46 + sx) / 2 + 12},{(99 + sy) / 2} {sx},{sy - 16}", ORANGE, 1.3, dash="3 3"))
        b.append(rect(sx - 22, sy - 16, 44, 30, SURF3, LINE2, 6))
        b.append(text(sx, sy - 1, v, 13, INK, weight=600, mono=True))
    # 배열
    b.append(rect(370, 10, 350, 250, SURF, LINE2, 10))
    b.append(text(390, 34, "NumPy 배열 (ndarray)", 15, ACC, "start", 700))
    b.append(text(390, 56, "같은 종류의 값이 한 줄로 붙어 있다", 12, MUTED, "start"))
    for i, v in enumerate([12, 8, 15, 10, 5]):
        b.append(rect(390 + i * 60, 90, 60, 46, ACC, ACC, 0, 1.6, op=0.12))
        b.append(text(420 + i * 60, 113, v, 15, INK, weight=700, mono=True))
    b.append(code(390, 160, "dtype: int64  (모두 정수)", 12.5, CYAN))
    b.append(code(390, 182, "shape: (5,)   (값 5개, 1차원)", 12.5, CYAN))
    b.append(text(390, 220, "칸이 붙어 있고 종류가 같아서\n컴퓨터가 쭉 훑으며 빠르게 계산", 12.5, INK2, "start"))
    return svg(730, 270, b, "파이썬 리스트와 NumPy 배열이 값을 담는 방식")


@fig("np-loop-vs-vector")
def _():
    vals = [12, 8, 15, 10, 5]
    b = []
    b.append(rect(10, 10, 700, 120, SURF, LINE2, 10))
    b.append(text(30, 32, "for 반복 — 하나씩 꺼내 계산하고 다시 담기를 다섯 번", 14, ORANGE, "start", 700))
    for i, v in enumerate(vals):
        x = 40 + i * 132
        b.append(box(x, 52, 44, 32, str(v), size=13))
        b.append(arrow(x + 48, 68, x + 68, 68, ORANGE, 1.5))
        b.append(box(x + 72, 52, 44, 32, str(v * 2), stroke=ORANGE, color=ORANGE, size=13))
        b.append(text(x + 58, 104, f"{i + 1}번째", 11.5, MUTED))
    b.append(rect(10, 144, 700, 120, SURF, LINE2, 10))
    b.append(text(30, 166, "배열 연산 — 배열 전체에 한 번에", 14, ACC, "start", 700))
    for i, v in enumerate(vals):
        b.append(rect(40 + i * 46, 192, 46, 36, SURF3, LINE2, 0, 1.2))
        b.append(text(63 + i * 46, 210, v, 13, INK, weight=600, mono=True))
    b.append(code(292, 210, "* 2", 15, ACC))
    b.append(arrow(330, 210, 380, 210, ACC, 2.2, accent=True))
    for i, v in enumerate(vals):
        b.append(rect(392 + i * 46, 192, 46, 36, ACC, ACC, 0, 1.5, op=0.12))
        b.append(text(415 + i * 46, 210, v * 2, 13, INK, weight=700, mono=True))
    b.append(text(360, 248, "코드 한 줄, 반복은 NumPy 안쪽(C 언어)에서 빠르게", 12, MUTED))
    return svg(720, 274, b, "for 반복과 배열 연산 비교")


# ---------------- pandas ----------------
@fig("pd-anatomy")
def _():
    cols = ["survived", "pclass", "sex", "age", "fare"]
    rows = [[0, 3, "male", "22.0", "7.25"], [1, 1, "female", "38.0", "71.28"], [1, 3, "female", "26.0", "7.92"], [1, 1, "female", "35.0", "53.10"]]
    x0, y0, iw, cw, rh = 120, 70, 54, 84, 34
    b = []
    # 머리글
    b.append(rect(x0, y0, iw, rh, SURF, LINE2, 0))
    for j, c in enumerate(cols):
        b.append(rect(x0 + iw + j * cw, y0, cw, rh, ORANGE, ORANGE, 0, 1.3, op=0.14))
        b.append(text(x0 + iw + j * cw + cw / 2, y0 + rh / 2, c, 12.5, ORANGE, weight=700, mono=True))
    for i, r in enumerate(rows):
        y = y0 + rh * (i + 1)
        b.append(rect(x0, y, iw, rh, CYAN, CYAN, 0, 1.3, op=0.14))
        b.append(text(x0 + iw / 2, y + rh / 2, i, 13, CYAN, weight=700, mono=True))
        for j, v in enumerate(r):
            on = cols[j] == "fare"
            b.append(rect(x0 + iw + j * cw, y, cw, rh, ACC if on else SURF3, ACC if on else LINE2, 0, 1.5 if on else 1, op=0.14 if on else 1))
            b.append(text(x0 + iw + j * cw + cw / 2, y + rh / 2, v, 12.5, INK, weight=600 if on else 500, mono=True))
    ax = x0 + iw + 4 * cw
    b.append(rect(ax, y0, cw, rh * 5, "none", ACC, 4, 2.4))
    # 이름표
    b.append(text(x0 + iw + 2.5 * cw, 26, "columns — 열 이름", 13, ORANGE, weight=700))
    b.append(arrow(x0 + iw + 2.5 * cw, 38, x0 + iw + 2.5 * cw, y0 - 4, ORANGE, 1.4))
    b.append(text(52, y0 + rh * 3, "index\n행 이름표", 13, CYAN, weight=700))
    b.append(arrow(90, y0 + rh * 3, x0 - 6, y0 + rh * 3, CYAN, 1.4))
    b.append(text(ax + cw + 24, y0 + 40, "Series\n열 하나 df['fare']", 13, ACC, "start", 700))
    b.append(arrow(ax + cw + 20, y0 + 40, ax + cw + 4, y0 + 40, ACC, 1.4, accent=True))
    b.append(text(ax + cw + 24, y0 + 120, "속은 NumPy 배열\ndf['fare'].to_numpy()", 12, MUTED, "start"))
    b.append(text(x0 + iw + 2.5 * cw, y0 + rh * 5 + 26, "DataFrame — 같은 index를 공유하는 Series(열)들의 묶음", 13, INK, weight=600))
    return svg(780, 278, b, "DataFrame의 구조: index, columns, Series")


@fig("pd-workflow")
def _():
    steps = [("읽기", "read_csv"), ("살펴보기", "head · info"), ("고르기", "loc · 조건"), ("정리하기", "fillna · 형변환"),
             ("묶기", "groupby"), ("합치기", "merge · concat"), ("저장하기", "to_csv")]
    b = []
    w, g = 98, 12
    for i, (t, c) in enumerate(steps):
        x = 14 + i * (w + g)
        col = CYAN if i < 4 else (ACC if i < 6 else INK2)
        b.append(rect(x, 30, w, 64, SURF3, col, 10, 1.6))
        b.append(text(x + w / 2, 50, t, 14, col, weight=700))
        b.append(text(x + w / 2, 74, c, 11, INK2, mono=True))
        if i < len(steps) - 1:
            b.append(arrow(x + w + 1, 62, x + w + g - 1, 62, MUTED, 1.4))
    # PART 괄호
    def bracket(x1, x2, label, c):
        return path(f"M{x1},110 L{x1},120 L{x2},120 L{x2},110", c, 1.6) + text((x1 + x2) / 2, 140, label, 13, c, weight=700)
    b.append(bracket(14, 14 + 4 * (w + g) - g, "pandas 기초 PART — 불러오기 · 고르기 · 정리하기", CYAN))
    b.append(bracket(14 + 4 * (w + g), 14 + 6 * (w + g) - g, "pandas 활용 PART — 묶기 · 합치기 (+ 시계열)", ACC))
    b.append(text(395, 176, "엑셀에서 손으로 하던 필터 · 피벗 · VLOOKUP을 코드로 적어 두면, 다음 달 파일에도 그대로 다시 돌릴 수 있습니다", 12, MUTED))
    return svg(790, 192, b, "pandas로 하는 일의 흐름")


# ---------------- matplotlib ----------------
@fig("mpl-layers")
def _():
    b = []
    srcs = [("plt.plot(x, y)", "직접 그리기"), ("df.plot()", "pandas가 대신 호출"), ("sns.barplot(...)", "seaborn이 대신 호출")]
    for i, (c, d) in enumerate(srcs):
        x = 30 + i * 230
        b.append(rect(x, 14, 200, 58, SURF3, LINE2, 10))
        b.append(code(x + 100, 34, c, 13, INK, "middle"))
        b.append(text(x + 100, 56, d, 12, MUTED))
        b.append(arrow(x + 100, 76, x + 100 + (330 - (x + 100)) * 0.25, 110, MUTED, 1.5))
    b.append(rect(160, 114, 380, 150, ACC, ACC, 12, 2, op=0.08))
    b.append(text(180, 136, "matplotlib", 16, ACC, "start", 700))
    b.append(rect(190, 152, 320, 100, SURF3, INK2, 6, 1.4))
    b.append(text(200, 166, "Figure (도화지)", 12, INK2, "start", 600))
    for k in range(2):
        ax_x = 204 + k * 152
        b.append(rect(ax_x, 178, 140, 66, DARK, CYAN, 4, 1.4))
        b.append(text(ax_x + 8, 190, "Axes (그래프 칸)", 11, CYAN, "start", 600))
        if k == 0:
            b.append(path(f"M{ax_x + 12},234 L{ax_x + 45},214 L{ax_x + 78},222 L{ax_x + 126},200", CYAN, 2))
        else:
            for j, hgt in enumerate([24, 38, 18, 30]):
                b.append(rect(ax_x + 18 + j * 28, 238 - hgt, 18, hgt, CYAN, CYAN, 1, 1, op=0.5))
    b.append(arrow(544, 170, 600, 150, MUTED, 1.6))
    b.append(arrow(544, 210, 600, 232, MUTED, 1.6))
    b.append(box(604, 124, 120, 50, "화면\n(노트북 · 이 사이트)", size=12))
    b.append(box(604, 208, 120, 50, "파일\nPNG · PDF · SVG", size=12))
    b.append(text(380, 288, "어느 길로 그리든 마지막에 그림을 그리는 것은 matplotlib입니다", 13, INK, weight=600))
    return svg(750, 304, b, "pandas와 seaborn도 matplotlib으로 그린다")


@fig("mpl-gallery")
def _():
    b = []
    items = [("선 그래프", "ax.plot", "추이"), ("막대 그래프", "ax.bar", "비교"), ("산점도", "ax.scatter", "관계"),
             ("히스토그램", "ax.hist", "분포"), ("상자그림", "ax.boxplot", "분포 비교"), ("파이", "ax.pie", "구성")]
    w = 118
    for i, (t, c, q) in enumerate(items):
        x = 10 + i * (w + 8)
        b.append(rect(x, 10, w, 176, SURF, LINE2, 10))
        px, py = x + 14, 30
        if i < 5:
            b.append(line(px, py + 90, px + 90, py + 90, LINE2, 1.2))
            b.append(line(px, py, px, py + 90, LINE2, 1.2))
        if i == 0:
            b.append(path(f"M{px + 6},{py + 70} L{px + 26},{py + 54} L{px + 46},{py + 60} L{px + 66},{py + 30} L{px + 86},{py + 18}", CYAN, 2.2))
        elif i == 1:
            for j, h in enumerate([50, 72, 34, 60]):
                b.append(rect(px + 8 + j * 20, py + 90 - h, 14, h, CYAN, CYAN, 1, 1, op=0.6))
        elif i == 2:
            pts = [(10, 70), (18, 62), (26, 66), (34, 50), (40, 56), (48, 40), (56, 44), (62, 30), (70, 34), (80, 18), (30, 74), (66, 24)]
            for (a, c2) in pts:
                b.append(circle(px + a, py + c2, 3.2, CYAN, op=0.8))
        elif i == 3:
            for j, h in enumerate([10, 26, 48, 70, 54, 30, 14]):
                b.append(rect(px + 4 + j * 12, py + 90 - h, 12, h, CYAN, DARK, 0, 1, op=0.6))
        elif i == 4:
            for j, (lo, q1, md, q3, hi) in enumerate([(14, 32, 44, 56, 80), (24, 40, 52, 64, 84)]):
                cx = px + 26 + j * 40
                b.append(line(cx, py + 90 - hi, cx, py + 90 - lo, CYAN, 1.4))
                b.append(rect(cx - 12, py + 90 - q3, 24, q3 - q1, CYAN, CYAN, 1, 1.4, op=0.25))
                b.append(line(cx - 12, py + 90 - md, cx + 12, py + 90 - md, INK, 2))
        else:
            cx, cy, r = px + 45, py + 46, 38
            b.append(circle(cx, cy, r, CYAN, op=0.55))
            b.append(path(f"M{cx},{cy} L{cx},{cy - r} A{r},{r} 0 0,1 {cx + r * 0.95:.1f},{cy + r * 0.31:.1f} Z", DARK, 1.5, fill=ORANGE))
        b.append(text(x + w / 2, 142, t, 13, INK, weight=700))
        b.append(code(x + w / 2, 160, c, 11.5, CYAN, "middle"))
        b.append(text(x + w / 2, 176, q, 11, MUTED))
    return svg(774, 196, b, "matplotlib으로 그리는 기본 차트")


# ---------------- seaborn ----------------
@fig("sns-vs-mpl")
def _():
    b = []
    b.append(rect(10, 10, 300, 230, SURF, LINE2, 10))
    b.append(text(26, 32, "matplotlib — 내가 직접", 14, ORANGE, "start", 700))
    lines = ["fig, ax = plt.subplots()", "for sex, g in df.groupby('sex'):", "    ax.scatter(g['total_bill'],", "               g['tip'], label=sex)",
             "ax.set_xlabel('total_bill')", "ax.set_ylabel('tip')", "ax.legend(title='sex')"]
    for i, ln in enumerate(lines):
        b.append(code(26, 60 + i * 22, ln, 11.5, INK2))
    b.append(text(26, 222, "묶기 · 반복 · 축 이름 · 범례를 하나하나", 12, MUTED, "start"))
    b.append(rect(470, 10, 300, 230, SURF, LINE2, 10))
    b.append(text(486, 32, "seaborn — 열 이름만 배정", 14, ACC, "start", 700))
    for i, ln in enumerate(["sns.scatterplot(", "    data=df,", "    x='total_bill',", "    y='tip',", "    hue='sex')"]):
        b.append(code(486, 60 + i * 22, ln, 12, ACC if "hue" in ln else INK2))
    b.append(text(486, 222, "묶기 · 색 · 범례 · 축 이름은 알아서", 12, MUTED, "start"))
    # 가운데 결과 그림
    cx0, cy0 = 330, 60
    b.append(rect(cx0, cy0, 120, 120, DARK, LINE2, 6))
    import random
    rnd = random.Random(3)
    for k in range(26):
        x = rnd.uniform(8, 110)
        y = 110 - (x * 0.75 + rnd.uniform(-14, 14))
        c = CYAN if k % 2 else ORANGE
        b.append(circle(cx0 + x, cy0 + max(8, min(112, y)), 3, c, op=0.85))
    b.append(text(390, 196, "같은 그림", 13, INK, weight=700))
    b.append(arrow(312, 120, 326, 120, MUTED, 1.4))
    b.append(arrow(468, 120, 454, 120, MUTED, 1.4))
    return svg(780, 250, b, "같은 산점도를 matplotlib과 seaborn으로 그리기")


@fig("sns-families")
def _():
    fams = [("관계", "scatterplot\nlineplot", "두 값이 함께\n움직이나?", CYAN), ("분포", "histplot\nkdeplot", "값이 어떻게\n퍼져 있나?", ACC),
            ("범주", "barplot\nboxplot", "그룹끼리\n다른가?", ORANGE), ("회귀", "regplot\nlmplot", "추세선을\n그어 보면?", PINK),
            ("행렬", "heatmap", "표 전체를\n한눈에", TRACK)]
    b = []
    w = 146
    for i, (t, fn, q, c) in enumerate(fams):
        x = 10 + i * (w + 8)
        b.append(rect(x, 10, w, 236, SURF, LINE2, 10))
        b.append(text(x + w / 2, 32, t, 15, c, weight=700))
        px, py = x + 28, 50
        b.append(rect(px, py, 90, 70, DARK, LINE2, 4))
        if i == 0:
            for a, d in [(10, 58), (20, 50), (28, 54), (38, 40), (46, 44), (56, 30), (64, 34), (74, 16), (82, 20)]:
                b.append(circle(px + a, py + d, 3, c))
        elif i == 1:
            for j, h in enumerate([8, 20, 40, 56, 44, 24, 10]):
                b.append(rect(px + 6 + j * 11, py + 66 - h, 11, h, c, DARK, 0, 1, op=0.55))
            b.append(path(f"M{px + 4},{py + 64} C{px + 30},{py + 64} {px + 34},{py + 8} {px + 46},{py + 8} C{px + 58},{py + 8} {px + 62},{py + 64} {px + 88},{py + 64}", INK, 1.6))
        elif i == 2:
            for j, (q1, md, q3) in enumerate([(20, 30, 44), (30, 42, 56), (14, 22, 34)]):
                cx = px + 18 + j * 27
                b.append(rect(cx - 9, py + 66 - q3, 18, q3 - q1, c, c, 1, 1.2, op=0.3))
                b.append(line(cx - 9, py + 66 - md, cx + 9, py + 66 - md, INK, 1.6))
        elif i == 3:
            for a, d in [(10, 52), (22, 50), (30, 40), (42, 42), (50, 32), (62, 30), (72, 20), (80, 22)]:
                b.append(circle(px + a, py + d, 3, c, op=0.8))
            b.append(line(px + 6, py + 58, px + 86, py + 14, INK, 2))
        else:
            for r in range(3):
                for k in range(3):
                    op = [0.9, 0.3, 0.55, 0.3, 0.9, 0.15, 0.55, 0.15, 0.9][r * 3 + k]
                    b.append(rect(px + 9 + k * 24, py + 3 + r * 21, 24, 21, c, DARK, 0, 1, op=op))
        b.append(code(x + w / 2, 146, fn, 12, c, "middle"))
        b.append(text(x + w / 2, 206, q, 12.5, INK2))
    return svg(778, 256, b, "seaborn 함수 가족")


# ---------------- scikit-learn ----------------
@fig("sk-api")
def _():
    models = [("결정트리", "DecisionTreeClassifier()"), ("로지스틱 회귀", "LogisticRegression()"), ("KNN", "KNeighborsClassifier()")]
    btns = [("fit(X, y)", "학습", ACC), ("predict(X)", "예측", CYAN), ("score(X, y)", "채점", ORANGE)]
    b = []
    w = 232
    for i, (k, cls) in enumerate(models):
        x = 12 + i * (w + 12)
        b.append(rect(x, 10, w, 234, SURF, LINE2, 14))
        b.append(text(x + w / 2, 34, k, 15, INK, weight=700))
        b.append(code(x + w / 2, 56, cls, 11.5, MUTED, "middle"))
        for j, (bt, lab, c) in enumerate(btns):
            y = 80 + j * 52
            b.append(pill(x + 22, y, 132, 38, bt, c, 13))
            b.append(text(x + 172, y + 19, lab, 13, c, "start", 700))
    b.append(text(380, 266, "모델이 달라도 버튼은 같다 — 모델 이름 한 줄만 바꾸면 나머지 코드는 그대로", 13.5, INK, weight=600))
    return svg(760, 284, b, "scikit-learn 모델의 공통 사용법 fit, predict, score")


@fig("sk-modules")
def _():
    steps = [("나누기", "model_selection", "train_test_split\ncross_val_score", "학습용과 시험용 나누기\n교차검증", CYAN),
             ("손질하기", "impute · preprocessing", "SimpleImputer\nOneHotEncoder", "결측치 · 인코딩\n표준화", ORANGE),
             ("모델", "linear_model · tree\nensemble · neighbors", "LogisticRegression\nRandomForest…", "회귀 · 분류\n트리와 앙상블", ACC),
             ("평가하기", "metrics", "accuracy_score\nrecall_score", "평가지표", PINK)]
    b = []
    w, g = 170, 22
    for i, (t, mod, ex, where, c) in enumerate(steps):
        x = 14 + i * (w + g)
        b.append(rect(x, 40, w, 168, SURF3, c, 10, 1.6))
        b.append(text(x + w / 2, 62, t, 15, c, weight=700))
        b.append(code(x + w / 2, 94, mod, 11, INK, "middle"))
        b.append(line(x + 14, 120, x + w - 14, 120, LINE2, 1))
        b.append(code(x + w / 2, 146, ex, 11, INK2, "middle"))
        b.append(text(x + w / 2, 186, where, 11.5, MUTED))
        if i < 3:
            b.append(arrow(x + w + 2, 124, x + w + g - 2, 124, MUTED, 1.6))
    b.append(text(14, 22, "sklearn. 뒤에 붙는 이름 = 기능별 서랍", 13, INK2, "start", 600))
    b.append(rect(14 + (w + g) - 8, 218, 2 * w + g + 16, 34, "none", TRACK, 8, 1.4, "6 4"))
    b.append(code(14 + (w + g) + w + g / 2, 235, "pipeline: 손질 + 모델을 한 줄로", 12, TRACK, "middle"))
    return svg(780, 262, b, "scikit-learn 모듈 지도")


# ---------------- PyTorch ----------------
@fig("pt-tensor")
def _():
    vals = [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
    b = []

    def grid(x0, y0, c):
        out = []
        for i, r in enumerate(vals):
            for j, v in enumerate(r):
                out.append(rect(x0 + j * 52, y0 + i * 40, 52, 40, c, c, 0, 1.4, op=0.12))
                out.append(text(x0 + j * 52 + 26, y0 + i * 40 + 20, v, 14, INK, weight=600, mono=True))
        return "".join(out)
    b.append(rect(10, 10, 220, 240, SURF, LINE2, 10))
    b.append(text(120, 34, "NumPy 배열", 15, CYAN, weight=700))
    b.append(grid(42, 60, CYAN))
    b.append(code(120, 160, "shape (2, 3)", 12.5, INK2, "middle"))
    b.append(text(120, 196, "CPU에서 계산", 12.5, MUTED))
    b.append(code(286, 100, "torch.tensor", 11, ACC, "middle"))
    b.append(arrow(240, 120, 332, 120, ACC, 2, accent=True))
    b.append(rect(340, 10, 410, 240, SURF, LINE2, 10))
    b.append(text(450, 34, "PyTorch 텐서", 15, ACC, weight=700))
    b.append(grid(372, 60, ACC))
    b.append(code(450, 160, "shape (2, 3)", 12.5, INK2, "middle"))
    b.append(text(450, 184, "숫자 격자는 똑같다", 12, MUTED))
    b.append(pill(556, 56, 180, 30, ".to('cuda')", WARN, 12.5))
    b.append(text(646, 104, "GPU로 옮겨\n수천 개 곱셈을 동시에", 11.5, INK2))
    b.append(pill(556, 132, 180, 30, "requires_grad=True", PINK, 12))
    b.append(text(646, 180, "계산 과정을 기록했다가\n기울기를 자동으로", 11.5, INK2))
    b.append(text(545, 228, "텐서 = 배열 + GPU + 계산 기록", 13.5, INK, weight=700))
    return svg(760, 260, b, "NumPy 배열과 PyTorch 텐서")


@fig("pt-loop")
def _():
    steps = [("① 예측 (순전파)", "pred = model(X)", "지금 가중치로 답 내기", CYAN),
             ("② 손실 계산", "loss = loss_fn(pred, y)", "정답과 얼마나 틀렸나", ORANGE),
             ("③ 역전파", "loss.backward()", "가중치마다 고칠 방향(기울기)", PINK),
             ("④ 업데이트", "optimizer.step()", "기울기 반대로 조금 고치기", ACC)]
    pos = [(30, 20), (420, 20), (420, 186), (30, 186)]
    w, h = 300, 100
    b = []
    for (t, c, d, col), (x, y) in zip(steps, pos):
        b.append(rect(x, y, w, h, SURF3, col, 12, 1.8))
        b.append(text(x + 18, y + 24, t, 14.5, col, "start", 700))
        b.append(code(x + 18, y + 54, c, 13, INK))
        b.append(text(x + 18, y + 80, d, 12, MUTED, "start"))
    b.append(arrow(334, 70, 414, 70, MUTED, 1.8))
    b.append(arrow(570, 124, 570, 182, MUTED, 1.8))
    b.append(arrow(416, 236, 336, 236, MUTED, 1.8))
    b.append(arrow(180, 182, 180, 124, ACC, 1.8, accent=True))
    b.append(text(375, 153, "데이터 묶음(배치)마다\n이 네 단계를 수천 번 반복", 12.5, INK2, weight=600))
    b.append(code(375, 308, "optimizer.zero_grad()  ← 매번 ③ 전에 지난 기울기 지우기", 12, MUTED, "middle"))
    return svg(750, 324, b, "PyTorch 학습 반복의 네 단계")


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
