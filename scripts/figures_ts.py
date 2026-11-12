"""시계열 분석 트랙 레슨 도식(SVG) 생성기.

python3 scripts/figures_ts.py  ->  content/img/ts/*.svg
그리기 도우미와 색은 figures_ml.py와 같은 것을 쓴다.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from figures_ml import (ACC, CYAN, FAIL, INK, INK2, LINE, LINE2, MUTED, ORANGE, PASS, SURF, SURF3, TRACK, WARN,  # noqa: E402
                        arrow, box, circle, line, path, pseudo, rect, svg, text)

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "ts")
BLUE = "#7aa8ff"
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def gauss(n, seed):
    u = pseudo(2 * n, seed)
    return [math.sqrt(-2 * math.log(max(u[2 * i], 1e-9))) * math.cos(2 * math.pi * u[2 * i + 1]) for i in range(n)]


def series(vals, x, y, w, h, lo=None, hi=None, color=INK, sw=2.2, dash=None, start=0, total=None):
    """vals를 (x, y, w, h) 상자 안에 꺾은선으로 그린다. start/total로 가로 위치를 어긋나게 둘 수 있다."""
    lo = min(vals) if lo is None else lo
    hi = max(vals) if hi is None else hi
    total = len(vals) if total is None else total
    pts = []
    for i, v in enumerate(vals):
        px = x + w * (start + i) / max(total - 1, 1)
        py = y + h - h * (v - lo) / (hi - lo)
        pts.append(f"{px:.1f},{py:.1f}")
    return path("M" + " L".join(pts), color, sw, dash=dash)


def ypos(v, y, h, lo, hi):
    return y + h - h * (v - lo) / (hi - lo)


def panel(x, y, w, h, title=None, color=INK, sub=None):
    out = [rect(x, y, w, h, SURF, LINE2, 10)]
    if title:
        out.append(text(x + w / 2, y + 22, title, 15, color, weight=700))
    if sub:
        out.append(text(x + w / 2, y + 42, sub, 12, MUTED))
    return "".join(out)


def wave(n, period, amp=1.0, slope=0.0, noise=0.0, seed=1, grow=0.0):
    g = gauss(n, seed)
    return [slope * i + amp * (1 + grow * i) * math.sin(2 * math.pi * i / period) + noise * g[i] for i in range(n)]


# ---------------- ts-00 ----------------
@fig("ts00-shuffle")
def _():
    b = []
    n = 36
    v = wave(n, 9, 1.0, 0.12, 0.15, 5)
    idx = sorted(range(n), key=lambda i: pseudo(n, 11)[i])
    sh = [v[i] for i in idx]
    lo, hi = min(v) - 0.3, max(v) + 0.3
    for k, (vals, title, col, note) in enumerate([(v, "순서대로", ACC, "오르는 흐름 + 반복되는 물결"), (sh, "섞어서", MUTED, "패턴이 보이지 않음")]):
        x = 20 + k * 360
        b.append(panel(x, 20, 330, 220, title, col))
        b.append(series(vals, x + 20, 50, 290, 130, lo, hi, col, 2.2))
        for i, val in enumerate(vals):
            b.append(circle(x + 20 + 290 * i / (n - 1), ypos(val, 50, 130, lo, hi), 2.4, col))
        b.append(text(x + 165, 205, note, 13, INK2, weight=600))
        b.append(text(x + 165, 225, "평균 · 표준편차는 같다", 12, MUTED))
    b.append(text(360, 130, "=", 20, MUTED, weight=700))
    return svg(730, 260, b, "같은 값을 순서대로 놓았을 때와 섞었을 때")


@fig("ts00-four-tasks")
def _():
    b = []
    cards = [("이해하기", ACC, "왜 이렇게 움직일까?", "분해 · 자기상관"),
             ("예측하기", CYAN, "다음 값은 얼마일까?", "지수평활 · ARIMA · ML"),
             ("이상 찾기", FAIL, "평소와 다른 곳은?", "잔차 · 관리도 · CUSUM"),
             ("분류하기", TRACK, "이 구간은 어떤 종류?", "딥러닝 트랙에서")]
    base = wave(24, 8, 1.0, 0.05, 0.12, 3)
    for k, (t, col, q, tool) in enumerate(cards):
        x = 16 + k * 182
        b.append(panel(x, 20, 170, 230, t, col))
        b.append(text(x + 85, 64, q, 12.5, INK2))
        lo, hi = -1.8, 3.4
        gx, gy, gw, gh = x + 15, 82, 140, 96
        if k == 0:
            b.append(series(base, gx, gy, gw, gh, lo, hi, MUTED, 1.8))
            b.append(series([0.05 * i for i in range(24)], gx, gy, gw, gh, lo, hi, col, 2.2, dash="5 4"))
        elif k == 1:
            b.append(series(base[:17], gx, gy, gw, gh, lo, hi, INK, 2, total=24))
            b.append(series(base[16:], gx, gy, gw, gh, lo, hi, col, 2.2, dash="5 4", start=16, total=24))
            b.append(line(gx + gw * 16 / 23, gy, gx + gw * 16 / 23, gy + gh, LINE2, 1.2, "3 3"))
        elif k == 2:
            v = list(base)
            v[14] = 3.1
            b.append(series(v, gx, gy, gw, gh, lo, hi, INK, 2))
            b.append(circle(gx + gw * 14 / 23, ypos(3.1, gy, gh, lo, hi), 7, "none", col, 2))
        else:
            b.append(rect(gx, gy + 6, gw / 2 - 4, gh - 12, PASS, PASS, 6, 1, op=0.10))
            b.append(rect(gx + gw / 2 + 4, gy + 6, gw / 2 - 4, gh - 12, col, col, 6, 1, op=0.12))
            v = wave(12, 6, 0.5, 0, 0.05, 2) + wave(12, 3, 1.3, 0, 0.3, 4)
            b.append(series(v, gx, gy, gw, gh, lo, hi, INK, 2))
            b.append(text(gx + gw / 4, gy + gh - 2, "정상 가동", 11, PASS, weight=600))
            b.append(text(gx + gw * 3 / 4, gy + gh - 2, "이상 진동", 11, col, weight=600))
        b.append(line(x + 15, 190, x + 155, 190, LINE2))
        b.append(text(x + 85, 216, tool, 12, MUTED, weight=600))
    return svg(760, 270, b, "시계열로 하는 일 네 가지")


@fig("ts00-map")
def _():
    b = []
    parts = [("PART 1", "시작하기", MUTED, ["시계열이란"]),
             ("PART 2", "시계열 읽기", ACC, ["데이터 준비", "분해", "자기상관", "정상성"]),
             ("PART 3", "예측 모델", CYAN, ["예측의 기본기", "지수평활", "ARIMA", "ML로 예측"]),
             ("PART 4", "현장 응용", ORANGE, ["이상 탐지", "프로젝트"])]
    x = 16
    for k, (p, t, col, items) in enumerate(parts):
        w = 120 if k == 0 else 200
        b.append(rect(x, 20, w, 220, SURF, col, 10, 1.4))
        b.append(text(x + w / 2, 42, p, 11.5, col, weight=700, mono=True))
        b.append(text(x + w / 2, 64, t, 16, INK, weight=700))
        for i, it in enumerate(items):
            b.append(box(x + 14, 86 + i * 36, w - 28, 28, it, SURF3, LINE2, INK2, 13, 600, 6))
        if k < 3:
            b.append(arrow(x + w + 4, 130, x + w + 22, 130, MUTED, 2))
        x += w + 26
    return svg(x - 10, 260, b, "시계열 분석 트랙 지도")


# ---------------- ts-01 ----------------
@fig("ts01-ruler")
def _():
    b = []
    for k, (title, col, missing) in enumerate([("눈금이 고른 자", ACC, set()), ("눈금이 빠진 자", FAIL, {2, 3, 6})]):
        y = 30 + k * 120
        b.append(text(30, y, title, 15, col, anchor="start", weight=700))
        b.append(rect(30, y + 18, 660, 44, SURF, LINE2, 6))
        prev = None
        for i in range(10):
            px = 60 + i * 66
            if i in missing:
                b.append(line(px, y + 18, px, y + 34, LINE2, 1.2, "2 3"))
                continue
            b.append(line(px, y + 18, px, y + 40, col, 2))
            b.append(text(px, y + 51, f"{i + 1}일", 11.5, INK2, mono=True))
            if prev is not None and k == 1:
                gap = i - prev
                b.append(text((px + 60 + prev * 66) / 2, y + 78, f"{gap}일" if gap > 1 else "1일", 12, FAIL if gap > 1 else MUTED, weight=700 if gap > 1 else 500))
            prev = i
        if k == 0:
            b.append(text(360, y + 78, "한 칸 = 언제나 하루", 12.5, MUTED))
    b.append(text(360, 248, "칸이 고르지 않으면 shift(1)의 '한 칸 전'이 어제일 수도, 사흘 전일 수도 있다", 12.5, INK2))
    return svg(720, 270, b, "눈금이 고른 자와 빠진 자")


@fig("ts01-agg-tree")
def _():
    b = []
    b.append(box(250, 16, 240, 40, "이 값은 어떤 종류인가?", SURF3, ACC, ACC, 15, 700))
    kinds = [("쌓이는 양", "대여 건수 · 생산량 · 매출", "합계  sum", ACC),
             ("그 순간의 상태", "온도 · 압력 · 습도", "평균 mean · 최대 max", CYAN),
             ("그 시점의 수준", "재고 · 잔고 · 누적 카운터", "마지막 값  last", ORANGE)]
    for k, (t, ex, how, col) in enumerate(kinds):
        x = 20 + k * 240
        cx = x + 100
        b.append(arrow(370 + (k - 1) * 60, 58, cx, 88, MUTED, 1.6))
        b.append(rect(x, 92, 200, 66, SURF, col, 10, 1.4))
        b.append(text(cx, 114, t, 15, col, weight=700))
        b.append(text(cx, 138, ex, 12, MUTED))
        b.append(arrow(cx, 160, cx, 184, MUTED, 1.6))
        b.append(box(x + 10, 188, 180, 36, how, SURF3, LINE2, INK, 13.5, 700))
    return svg(720, 240, b, "값의 종류에 따라 묶는 계산 고르기")


# ---------------- ts-02 ----------------
@fig("ts02-components")
def _():
    b = []
    n = 60
    g = gauss(n, 7)
    tr = [0.035 * i for i in range(n)]
    se = [0.7 * math.sin(2 * math.pi * i / 12) for i in range(n)]
    re = [0.22 * g[i] for i in range(n)]
    tot = [tr[i] + se[i] + re[i] for i in range(n)]
    b.append(panel(20, 20, 300, 250, "원래 시계열", INK))
    b.append(series(tot, 40, 60, 260, 180, -1.3, 3.2, INK, 2.2))
    b.append(text(340, 145, "=", 22, MUTED, weight=700))
    rows = [("추세", tr, ACC, -0.3, 2.4, "천천히 오르는 큰 흐름"), ("계절성", se, CYAN, -1, 1, "같은 주기로 반복"), ("잔차", re, ORANGE, -1, 1, "설명하지 못한 나머지")]
    for k, (t, vals, col, lo, hi, note) in enumerate(rows):
        y = 20 + k * 86
        b.append(rect(360, y, 350, 78, SURF, LINE2, 10))
        b.append(text(376, y + 20, t, 14, col, anchor="start", weight=700))
        b.append(text(376, y + 40, note, 11.5, MUTED, anchor="start"))
        b.append(series(vals, 520, y + 12, 175, 54, lo, hi, col, 2))
        if k < 2:
            b.append(text(535, y + 82, "+", 16, MUTED, weight=700))
    return svg(730, 290, b, "시계열 = 추세 + 계절성 + 잔차")


@fig("ts02-add-mul")
def _():
    b = []
    n = 60
    add = [1 + 0.04 * i + 0.5 * math.sin(2 * math.pi * i / 12) for i in range(n)]
    mul = [(1 + 0.04 * i) * (1 + 0.28 * math.sin(2 * math.pi * i / 12)) for i in range(n)]
    for k, (t, vals, col, f, note) in enumerate([("덧셈형", add, ACC, "추세 + 계절 + 잔차", "물결 높이가 일정"), ("곱셈형", mul, CYAN, "추세 × 계절 × 잔차", "수준이 높을수록 물결도 커짐")]):
        x = 20 + k * 360
        b.append(panel(x, 20, 330, 240, t, col, f))
        b.append(series(vals, x + 25, 62, 280, 140, 0, 4.6, col, 2.2))
        for i0 in (3, 51):
            px = x + 25 + 280 * i0 / (n - 1)
            hi_v, lo_v = (vals[i0], vals[i0 + 6])
            b.append(line(px + 8, ypos(hi_v, 62, 140, 0, 4.6), px + 8, ypos(lo_v, 62, 140, 0, 4.6), WARN, 2))
        b.append(text(x + 165, 236, note, 13, INK2, weight=600))
    return svg(730, 280, b, "덧셈형과 곱셈형 시계열")


@fig("ts02-two-seasons")
def _():
    b = []
    n = 24 * 14
    lvl = [1.0, 1.0, 1.05, 1.0, 1.1, 0.55, 0.5]
    vals = []
    for i in range(n):
        d, h = (i // 24) % 7, i % 24
        day = math.exp(-((h - 8) / 2.0) ** 2) + 1.3 * math.exp(-((h - 18) / 2.5) ** 2) if d < 5 else 0.9 * math.exp(-((h - 15) / 4.0) ** 2)
        vals.append(lvl[d] * (0.15 + day))
    x0, w = 40, 660
    for wk in range(2):
        for d in (5, 6):
            dx = x0 + w * ((wk * 7 + d) * 24) / (n - 1)
            b.append(rect(dx, 40, w * 24 / (n - 1), 150, TRACK, "none", 0, 0, op=0.10))
    b.append(series(vals, x0, 45, w, 140, 0, 1.75, CYAN, 1.6))
    names = "월화수목금토일"
    for dd in range(14):
        b.append(text(x0 + w * (dd * 24 + 12) / (n - 1), 204, names[dd % 7], 12, TRACK if dd % 7 >= 5 else MUTED, weight=600))
    b.append(line(x0, 224, x0 + w * 24 / (n - 1), 224, ACC, 2.5))
    b.append(text(x0, 242, "하루 주기 (24시간)", 12, ACC, anchor="start", weight=700))
    b.append(line(x0, 262, x0 + w * 168 / (n - 1), 262, ORANGE, 2.5))
    b.append(text(x0, 280, "일주일 주기 (168시간)", 12, ORANGE, anchor="start", weight=700))
    b.append(text(700, 28, "평일은 출퇴근 봉우리 두 개, 주말은 낮은 봉우리 하나", 12.5, INK2, anchor="end"))
    return svg(740, 296, b, "하루 주기와 일주일 주기가 겹친 시계열")


# ---------------- ts-03 ----------------
@fig("ts03-shift")
def _():
    b = []
    vals = [12, 15, 19, 16, 13, 18, 22, 14, 17, 21]
    cw = 54
    for r, (label, off, col) in enumerate([("원래  y(t)", 0, INK), ("한 칸 민 것  y(t−1)", 1, ACC)]):
        y = 50 + r * 76
        b.append(text(24, y + 18, label, 13, col, anchor="start", weight=700))
        for i in range(10):
            j = i - off
            x = 180 + i * cw
            if j < 0:
                b.append(rect(x, y, cw - 6, 36, SURF, LINE2, 6, dash="3 3"))
                b.append(text(x + (cw - 6) / 2, y + 18, "없음", 11, MUTED))
            else:
                b.append(box(x, y, cw - 6, 36, vals[j], SURF3, col if r else LINE2, col, 14, 600, 6))
    for i in range(1, 10):
        x = 180 + i * cw + (cw - 6) / 2
        b.append(line(x, 88, x, 124, CYAN, 1.4, "3 3"))
    b.append(rect(174 + cw, 40, 9 * cw, 132, "none", CYAN, 10, 1.4, "5 4"))
    b.append(text(180 + cw + 4.5 * cw, 192, "위아래로 짝지어진 9쌍의 상관계수 = 래그 1 자기상관", 13.5, CYAN, weight=700))
    b.append(text(360, 222, "일곱 칸 밀면 래그 7: '오늘과 일주일 전'이 얼마나 닮았는지를 본다", 12.5, MUTED))
    return svg(740, 244, b, "시계열을 한 칸 밀어 짝지으면 래그 1 자기상관")


@fig("ts03-rumor")
def _():
    b = []
    nodes = [(110, "그저께", "y(t−2)"), (360, "어제", "y(t−1)"), (610, "오늘", "y(t)")]
    for x, t, s in nodes:
        b.append(rect(x - 60, 110, 120, 60, SURF3, LINE2, 12))
        b.append(text(x, 130, t, 15, INK, weight=700))
        b.append(text(x, 152, s, 12, MUTED, mono=True))
    b.append(arrow(174, 140, 296, 140, MUTED, 2))
    b.append(arrow(424, 140, 546, 140, MUTED, 2))
    b.append(text(360, 196, "어제를 거쳐서 전해지는 영향 (건너서 온 소문)", 12.5, MUTED))
    b.append(f'<path d="M110,106 C200,20 520,20 606,104" fill="none" stroke="{ACC}" stroke-width="2.4" marker-end="url(#aha)"/>')
    b.append(text(360, 30, "그저께가 오늘에 직접 주는 영향", 13, ACC, weight=700))
    b.append(rect(60, 222, 290, 50, SURF, CYAN, 10, 1.3))
    b.append(text(205, 238, "ACF (래그 2)", 14, CYAN, weight=700))
    b.append(text(205, 258, "직접 경로 + 거쳐 온 경로 모두", 12, INK2))
    b.append(rect(370, 222, 290, 50, SURF, ACC, 10, 1.3))
    b.append(text(515, 238, "PACF (래그 2)", 14, ACC, weight=700))
    b.append(text(515, 258, "어제의 몫을 빼고 직접 경로만", 12, INK2))
    return svg(720, 290, b, "ACF는 모든 경로, PACF는 직접 경로")


@fig("ts03-white-vs-walk")
def _():
    b = []
    n = 120
    g = gauss(n, 21)
    walk, s = [], 0.0
    for v in g:
        s += v
        walk.append(s)
    lo, hi = min(walk) - 1, max(walk) + 1
    for k, (t, vals, col, a, c, note) in enumerate([("백색잡음", g, CYAN, -4, 4, "0 주변에서 일정한 폭으로 떨림"), ("랜덤워크 (누적 합)", walk, ORANGE, lo, hi, "추세처럼 보이지만 우연히 흘러간 것")]):
        x = 20 + k * 360
        b.append(panel(x, 20, 330, 230, t, col))
        b.append(line(x + 20, ypos(0, 50, 140, a, c), x + 310, ypos(0, 50, 140, a, c), LINE2, 1.2, "4 4"))
        b.append(series(vals, x + 20, 50, 290, 140, a, c, col, 1.8))
        b.append(text(x + 165, 222, note, 12.5, INK2, weight=600))
    b.append(text(360, 120, "cumsum", 11, MUTED, mono=True))
    b.append(arrow(346, 135, 374, 135, MUTED, 2))
    return svg(730, 270, b, "백색잡음과 랜덤워크")


# ---------------- ts-04 ----------------
@fig("ts04-stationary-4")
def _():
    b = []
    n = 80
    g = gauss(n, 9)
    data = [("정상", PASS, [0.5 * g[i] for i in range(n)], "평균 · 흔들림 폭이 일정"),
            ("추세 (평균이 변함)", FAIL, [0.05 * i - 2 + 0.4 * g[i] for i in range(n)], "평균이 시간에 따라 이동"),
            ("분산 변화", FAIL, [(0.1 + 0.02 * i) * g[i] for i in range(n)], "흔들리는 폭이 점점 커짐"),
            ("계절성", FAIL, [1.4 * math.sin(2 * math.pi * i / 20) + 0.3 * g[i] for i in range(n)], "시점에 따라 평균이 다름")]
    for k, (t, col, vals, note) in enumerate(data):
        x = 16 + k * 182
        b.append(rect(x, 20, 170, 200, SURF, col if k == 0 else LINE2, 10, 1.4 if k == 0 else 1.2))
        b.append(text(x + 85, 42, t, 14, col, weight=700))
        b.append(line(x + 12, 115, x + 158, 115, LINE2, 1, "3 3"))
        b.append(series(vals, x + 12, 60, 146, 110, -3.2, 3.2, INK if k == 0 else INK2, 1.6))
        b.append(text(x + 85, 198, note, 11.5, MUTED))
    b.append(text(16, 240, "정상", 12.5, PASS, anchor="start", weight=700))
    b.append(text(560, 240, "비정상 세 가지", 12.5, FAIL, anchor="middle", weight=700))
    return svg(760, 258, b, "정상 시계열과 비정상 세 가지")


@fig("ts04-diff-steps")
def _():
    b = []
    n = 72
    g = gauss(n, 13)
    raw = [math.exp(0.02 * i + 0.25 * math.sin(2 * math.pi * i / 12) + 0.03 * g[i]) for i in range(n)]
    lg = [math.log(v) for v in raw]
    sd = [lg[i] - lg[i - 12] for i in range(12, n)]
    d1 = [sd[i] - sd[i - 1] for i in range(1, len(sd))]
    steps = [("원래", raw, INK, "오르면서 물결이 커짐"), ("로그", lg, CYAN, "물결 높이가 일정"), ("계절 차분", sd, ACC, "물결이 사라짐"), ("1차 차분", d1, PASS, "0 주변에서 고르게")]
    ops = ["np.log", "diff(12)", "diff(1)"]
    for k, (t, vals, col, note) in enumerate(steps):
        x = 14 + k * 186
        b.append(rect(x, 30, 160, 170, SURF, LINE2, 10))
        b.append(text(x + 80, 50, t, 14, col, weight=700))
        pad = (max(vals) - min(vals)) * 0.15
        lo, hi = min(vals) - pad, max(vals) + pad
        if k >= 2:
            m = max(abs(min(vals)), abs(max(vals))) * (2.2 if k == 2 else 1.4)
            lo, hi = (-m * 0.2, m) if k == 2 else (-m, m)
        b.append(series(vals, x + 12, 66, 136, 96, lo, hi, col, 1.8))
        b.append(text(x + 80, 182, note, 11.5, MUTED))
        if k < 3:
            b.append(arrow(x + 162, 115, x + 184, 115, MUTED, 1.8))
            b.append(text(x + 173, 18, ops[k], 11, WARN, mono=True))
    return svg(760, 216, b, "로그와 차분으로 정상 시계열 만들기")


@fig("ts04-adf-kpss")
def _():
    b = []
    rows = [("ADF 검정", CYAN, "출발 가정: 비정상이다", "p < 0.05", "정상으로 판정", "p ≥ 0.05", "비정상일 수 있음"),
            ("KPSS 검정", ORANGE, "출발 가정: 정상이다", "p < 0.05", "비정상으로 판정", "p ≥ 0.05", "정상일 수 있음")]
    for k, (t, col, h0, p1, r1, p2, r2) in enumerate(rows):
        y = 20 + k * 120
        b.append(rect(20, y, 700, 104, SURF, LINE2, 10))
        b.append(text(40, y + 26, t, 16, col, anchor="start", weight=700))
        b.append(box(40, y + 46, 220, 40, h0, SURF3, col, INK, 13.5, 600))
        b.append(arrow(264, y + 58, 340, y + 34, MUTED, 1.6))
        b.append(arrow(264, y + 74, 340, y + 84, MUTED, 1.6))
        b.append(text(400, y + 30, p1, 13, WARN, weight=700, mono=True))
        b.append(text(400, y + 84, p2, 13, MUTED, mono=True))
        good = (k == 0)
        b.append(box(470, y + 14, 230, 34, r1, SURF3, PASS if good else FAIL, PASS if good else FAIL, 13.5, 700))
        b.append(box(470, y + 62, 230, 34, r2, SURF3, LINE2, INK2, 13, 500))
    b.append(text(370, 262, "둘 다 '정상' 쪽을 가리킬 때(ADF p 작음 · KPSS p 큼) 가장 믿을 수 있다", 12.5, INK2))
    return svg(740, 282, b, "ADF와 KPSS는 출발 가정이 반대")


# ---------------- ts-05 ----------------
@fig("ts05-baselines")
def _():
    b = []
    n, hz, per = 36, 12, 12
    g = gauss(n, 17)
    y = [2 + 0.04 * i + 0.8 * math.sin(2 * math.pi * i / per) + 0.12 * g[i] for i in range(n)]
    tot = n + hz
    x0, y0, w, h, lo, hi = 40, 30, 520, 220, 0.6, 5.2
    b.append(rect(x0 + w * (n - 1) / (tot - 1), y0, w * hz / (tot - 1), h, SURF3, "none", 0, 0, op=0.6))
    b.append(text(x0 + w * (n - 1 + hz / 2) / (tot - 1), y0 + 12, "예측 구간", 12, MUTED))
    b.append(series(y, x0, y0, w, h, lo, hi, INK, 2.2, total=tot))
    mean = sum(y) / n
    drift = (y[-1] - y[0]) / (n - 1)
    fc = [("naive", ACC, [y[-1]] * (hz + 1)), ("mean", CYAN, [mean] * (hz + 1)),
          ("seasonal naive", ORANGE, [y[-1]] + [y[n - per + i] for i in range(hz)]),
          ("drift", TRACK, [y[-1] + drift * i for i in range(hz + 1)])]
    for i, (nm, col, vals) in enumerate(fc):
        b.append(series(vals, x0, y0, w, h, lo, hi, col, 2.2, dash="6 4", start=n - 1, total=tot))
        ly = 60 + i * 50
        b.append(line(590, ly, 620, ly, col, 2.4, "6 4"))
        b.append(text(628, ly, nm, 13, col, anchor="start", weight=700, mono=True))
    notes = ["마지막 값 그대로", "전체 평균", "지난 주기를 복사", "처음과 끝을 이은 선"]
    for i, t in enumerate(notes):
        b.append(text(628, 78 + i * 50, t, 11.5, MUTED, anchor="start"))
    return svg(760, 270, b, "기준 예측 네 가지")


@fig("ts05-rolling-origin")
def _():
    b = []
    x0, cw = 150, 46
    for mode, (title, sub) in enumerate([("expanding", "학습 구간이 늘어남"), ("sliding", "학습 길이 고정")]):
        yb = 30 + mode * 170
        b.append(text(20, yb + 40, title, 14, ACC if mode == 0 else CYAN, anchor="start", weight=700, mono=True))
        b.append(text(20, yb + 60, sub, 11.5, MUTED, anchor="start"))
        for r in range(4):
            y = yb + r * 32
            b.append(text(x0 - 12, y + 11, f"{r + 1}회", 11.5, MUTED, anchor="end"))
            for c in range(12):
                tr_start = 0 if mode == 0 else r * 2
                tr_end = 4 + r * 2
                if tr_start <= c < tr_end:
                    f, s, op = (ACC if mode == 0 else CYAN), "none", 0.55
                elif tr_end <= c < tr_end + 2:
                    f, s, op = ORANGE, "none", 0.9
                else:
                    f, s, op = SURF3, LINE2, 1
                b.append(rect(x0 + c * cw, y, cw - 4, 22, f, s, 4, 1, op=op))
    b.append(arrow(x0, 340, x0 + 12 * cw - 4, 340, MUTED, 1.6))
    b.append(text(x0 + 12 * cw - 4, 356, "시간", 12, MUTED, anchor="end"))
    b.append(rect(x0, 350, 16, 12, ACC, "none", 3, 0, op=0.55))
    b.append(text(x0 + 22, 356, "학습", 12, INK2, anchor="start"))
    b.append(rect(x0 + 70, 350, 16, 12, ORANGE, "none", 3, 0, op=0.9))
    b.append(text(x0 + 92, 356, "시험 (항상 학습보다 뒤)", 12, INK2, anchor="start"))
    return svg(720, 374, b, "롤링 원점 검증: expanding과 sliding")


# ---------------- ts-06 ----------------
@fig("ts06-weights")
def _():
    b = []
    n = 10
    sets = [("평균", CYAN, [1 / n] * n, "모두 똑같이"), ("naive", ORANGE, [0] * (n - 1) + [1], "마지막 하나만"),
            ("지수평활 (α = 0.4)", ACC, [0.4 * 0.6 ** (n - 1 - i) for i in range(n)], "최근일수록 크게")]
    for k, (t, col, wts, note) in enumerate(sets):
        x = 16 + k * 244
        b.append(panel(x, 20, 228, 220, t, col))
        mx = max(wts)
        for i, wv in enumerate(wts):
            hgt = 120 * wv / mx if k != 0 else 34
            bx = x + 20 + i * 19
            b.append(rect(bx, 180 - hgt, 14, max(hgt, 1.5), col, "none", 3, 0, op=0.85 if wv > 0 else 0.25))
        b.append(line(x + 16, 180, x + 212, 180, LINE2))
        b.append(text(x + 20, 194, "먼 과거", 11, MUTED, anchor="start"))
        b.append(text(x + 208, 194, "최근", 11, MUTED, anchor="end"))
        b.append(text(x + 114, 220, note, 13, INK2, weight=600))
    return svg(760, 260, b, "과거 값에 주는 가중치: 평균, naive, 지수평활")


@fig("ts06-hw-three")
def _():
    b = []
    b.append(box(20, 100, 120, 50, "새 관측값", SURF3, INK2, INK, 14, 700))
    comps = [("수준  level", ACC, "지금 높이는 어디쯤?", "α"), ("추세  trend", CYAN, "한 칸에 얼마나 오르나?", "β"), ("계절  season", ORANGE, "이 달은 평소보다 얼마나?", "γ")]
    for k, (t, col, q, p) in enumerate(comps):
        y = 24 + k * 78
        b.append(arrow(144, 125, 196, y + 30, MUTED, 1.6))
        b.append(rect(200, y, 270, 60, SURF, col, 10, 1.4))
        b.append(text(216, y + 20, t, 14.5, col, anchor="start", weight=700))
        b.append(text(216, y + 42, q, 12, MUTED, anchor="start"))
        b.append(circle(440, y + 30, 16, SURF3, col, 1.4))
        b.append(text(440, y + 30, p, 15, col, weight=700))
        b.append(arrow(474, y + 30, 546, 125, MUTED, 1.6))
    b.append(rect(550, 88, 180, 74, SURF3, ACC, 10, 1.6))
    b.append(text(640, 110, "예측", 15, ACC, weight=700))
    b.append(text(640, 138, "수준 + h×추세 + 계절", 12.5, INK))
    b.append(text(335, 268, "α · β · γ 는 '새 값을 얼마나 믿고 고칠지'를 정하는 0~1 사이의 수", 12.5, INK2))
    return svg(750, 288, b, "Holt-Winters의 세 가지 갱신")


# ---------------- ts-07 ----------------
@fig("ts07-ar-ma")
def _():
    b = []
    n = 12
    ar = [0.0] * 3 + [0.75 ** i for i in range(n - 3)]
    ma = [0.0] * 3 + [1.0, 0.6] + [0.0] * (n - 5)
    for k, (t, col, vals, s1, s2) in enumerate([("AR: 값이 이어진다", CYAN, ar, "오늘 = φ × 어제 값 + 새 잡음", "충격의 영향이 서서히 줄어듦"),
                                                 ("MA: 충격이 잠깐 남는다", ORANGE, ma, "오늘 = 새 잡음 + θ × 어제 잡음", "충격이 q칸 뒤에는 사라짐")]):
        x = 20 + k * 370
        b.append(panel(x, 20, 340, 250, t, col, s1))
        b.append(line(x + 24, 200, x + 316, 200, LINE2))
        for i, v in enumerate(vals):
            bx = x + 30 + i * 24
            b.append(rect(bx, 200 - 96 * v, 16, max(96 * v, 1.5), col, "none", 3, 0, op=0.85 if v else 0.3))
        b.append(arrow(x + 30 + 3 * 24 + 8, 78, x + 30 + 3 * 24 + 8, 98, WARN, 1.8))
        b.append(text(x + 30 + 3 * 24 + 46, 84, "충격 1번", 11.5, WARN, weight=700))
        b.append(text(x + 24, 216, "시간", 11, MUTED, anchor="start"))
        b.append(text(x + 170, 246, s2, 13, INK2, weight=600))
    return svg(750, 290, b, "AR과 MA의 차이: 충격 하나가 남기는 흔적")


# ---------------- ts-08 ----------------
@fig("ts08-to-table")
def _():
    b = []
    vals = [31, 28, 35, 40, 38, 22, 19, 33, 30, 37]
    b.append(text(20, 26, "시계열 한 줄", 13.5, INK2, anchor="start", weight=700))
    for i, v in enumerate(vals):
        hl = i == 9
        b.append(box(20 + i * 50, 40, 44, 32, v, SURF3, ACC if hl else (CYAN if i in (8, 2) else LINE2), ACC if hl else INK, 13.5, 600, 6))
    b.append(text(20 + 9 * 50 + 22, 86, "오늘", 11, ACC, weight=700))
    b.append(text(20 + 8 * 50 + 22, 86, "1일 전", 11, CYAN))
    b.append(text(20 + 2 * 50 + 22, 86, "7일 전", 11, CYAN))
    b.append(rect(20 + 2 * 50 - 3, 36, 7 * 50, 40, "none", ORANGE, 8, 1.2, "4 3"))
    b.append(text(20 + 5.5 * 50, 100, "지난 7일", 11, ORANGE))
    b.append(arrow(270, 110, 270, 134, MUTED, 2))
    cols = [("lag1", CYAN), ("lag7", CYAN), ("roll7", ORANGE), ("요일", TRACK), ("y (정답)", ACC)]
    rows = [["37", "40", "31.3", "화", "?"], ["30", "35", "31.0", "월", "37"], ["33", "28", "30.7", "일", "30"]]
    x0, cw = 140, 96
    b.append(text(x0 - 14, 150, "특성", 12, MUTED, anchor="end"))
    for j, (c, col) in enumerate(cols):
        b.append(box(x0 + j * cw, 136, cw - 6, 28, c, SURF, col, col, 12.5, 700, 6))
    for i in range(3):
        r = rows[2 - i]
        for j, v in enumerate(r):
            b.append(box(x0 + j * cw, 170 + i * 32, cw - 6, 26, v, SURF3, LINE2, ACC if j == 4 else INK2, 13, 600, 6))
    b.append(text(x0 + 2 * cw - 3, 280, "모든 특성은 '그날보다 과거'의 값으로만 만든다", 12.5, INK2))
    return svg(640, 298, b, "시계열을 특성과 정답의 표로 바꾸기")


@fig("ts08-recursive-direct")
def _():
    b = []
    b.append(panel(20, 20, 350, 250, "재귀 전략", ACC, "모델 하나를 반복해서 쓴다"))
    for i, t in enumerate(["내일 예측", "모레 예측", "글피 예측"]):
        y = 76 + i * 60
        b.append(box(40, y, 110, 36, "모델", SURF3, ACC, ACC, 14, 700))
        b.append(arrow(154, y + 18, 206, y + 18, MUTED, 1.8))
        b.append(box(210, y, 130, 36, t, SURF3, LINE2, INK, 13, 600))
        if i < 2:
            b.append(f'<path d="M275,{y + 38} C275,{y + 54} 95,{y + 44} 95,{y + 58}" fill="none" stroke="{WARN}" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#ah)"/>')
    b.append(text(195, 254, "예측값이 다시 입력으로 → 오차가 쌓일 수 있음", 12, WARN))
    b.append(panel(390, 20, 350, 250, "직접 전략", CYAN, "지평마다 모델을 따로 둔다"))
    for i, (m, t) in enumerate([("모델 h=1", "1일 뒤 예측"), ("모델 h=2", "2일 뒤 예측"), ("모델 h=7", "7일 뒤 예측")]):
        y = 76 + i * 60
        b.append(box(410, y, 110, 36, m, SURF3, CYAN, CYAN, 13, 700))
        b.append(arrow(524, y + 18, 576, y + 18, MUTED, 1.8))
        b.append(box(580, y, 130, 36, t, SURF3, LINE2, INK, 13, 600))
    b.append(text(565, 254, "오차가 쌓이지 않지만 모델을 여러 개 학습", 12, MUTED))
    return svg(760, 290, b, "재귀 전략과 직접 전략")


@fig("ts08-tree-ceiling")
def _():
    b = []
    n, k = 40, 28
    g = gauss(n, 4)
    y = [1 + 0.09 * i + 0.25 * math.sin(i * 0.9) + 0.08 * g[i] for i in range(n)]
    x0, y0, w, h, lo, hi = 40, 30, 520, 220, 0.5, 5.2
    top = max(y[:k])
    cy = ypos(top, y0, h, lo, hi)
    sx = x0 + w * (k - 1) / (n - 1)
    b.append(rect(sx, y0, x0 + w - sx, h, SURF3, "none", 0, 0, op=0.6))
    b.append(text(x0 + 6, y0 + 10, "학습 구간", 12, MUTED, anchor="start"))
    b.append(text(sx + 8, y0 + 10, "예측 구간", 12, MUTED, anchor="start"))
    b.append(line(x0, cy, x0 + w, cy, FAIL, 1.4, "6 4"))
    b.append(text(x0 + 6, cy - 10, "학습 때 본 최댓값 = 천장", 12, FAIL, anchor="start", weight=700))
    b.append(series(y[:k], x0, y0, w, h, lo, hi, INK, 2.2, total=n))
    b.append(series(y[k - 1:], x0, y0, w, h, lo, hi, MUTED, 1.6, dash="2 4", start=k - 1, total=n))
    tree = [y[k - 1]] + [top - 0.08 + 0.04 * math.sin(i) for i in range(n - k)]
    lin = [y[k - 1]] + [1 + 0.09 * i for i in range(k, n)]
    b.append(series(tree, x0, y0, w, h, lo, hi, ORANGE, 2.4, start=k - 1, total=n))
    b.append(series(lin, x0, y0, w, h, lo, hi, CYAN, 2.4, start=k - 1, total=n))
    for i, (t, col, s) in enumerate([("트리 모델", ORANGE, "천장에서 평평해짐"), ("선형 모델", CYAN, "추세를 따라 계속 오름"), ("실제 값", MUTED, "")]):
        ly = 70 + i * 52
        b.append(line(585, ly, 613, ly, col, 2.4, "2 4" if i == 2 else None))
        b.append(text(622, ly, t, 13, col, anchor="start", weight=700))
        b.append(text(622, ly + 18, s, 11.5, MUTED, anchor="start"))
    return svg(760, 270, b, "트리 모델의 예측은 학습 때 본 범위를 넘지 못한다")


# ---------------- ts-09 ----------------
@fig("ts09-anomaly-types")
def _():
    b = []
    n = 48
    g = gauss(n, 6)
    base = [math.sin(2 * math.pi * i / 12) + 0.08 * g[i] for i in range(n)]
    p1 = list(base)
    p1[26] = 3.0
    p2 = list(base)
    p2[33] = 0.9
    p3 = list(base)
    for i in range(24, 38):
        p3[i] = 0.15 + 0.06 * g[i]
    data = [("점 이상", FAIL, p1, "한 점만 크게 튄다", (26, 26)), ("맥락 이상", WARN, p2, "값은 평범, 그 시각엔 이상", (33, 33)), ("집단 이상", TRACK, p3, "평범한 값이 길게 이어짐", (24, 37))]
    for k, (t, col, vals, note, (a, c)) in enumerate(data):
        x = 16 + k * 244
        b.append(panel(x, 20, 228, 220, t, col))
        gx, gy, gw, gh, lo, hi = x + 14, 48, 200, 140, -1.6, 3.4
        if a == c:
            b.append(circle(gx + gw * a / (n - 1), ypos(vals[a], gy, gh, lo, hi), 9, "none", col, 2))
        else:
            xa = gx + gw * a / (n - 1)
            b.append(rect(xa - 3, ypos(1.0, gy, gh, lo, hi), gw * (c - a) / (n - 1) + 6, ypos(-0.7, gy, gh, lo, hi) - ypos(1.0, gy, gh, lo, hi), col, col, 6, 1.2, op=0.14))
        b.append(series(vals, gx, gy, gw, gh, lo, hi, INK, 1.8))
        b.append(text(x + 114, 216, note, 12.5, INK2, weight=600))
    return svg(760, 260, b, "이상의 세 종류: 점, 맥락, 집단")


@fig("ts09-cusum")
def _():
    b = []
    n, cp = 100, 55
    g = gauss(n, 31)
    y = [g[i] + (0.9 if i >= cp else 0) for i in range(n)]
    cs, s = [], 0.0
    for v in y:
        s = max(0.0, s + v - 0.45)
        cs.append(s)
    x0, w = 60, 640
    cx = x0 + w * cp / (n - 1)
    b.append(text(x0, 22, "값", 13, INK2, anchor="start", weight=700))
    b.append(text(x0 + w, 22, "평균이 조금 올랐지만 눈으로는 잘 안 보인다", 12, MUTED, anchor="end"))
    b.append(rect(x0, 34, w, 110, SURF, LINE2, 8))
    b.append(series(y, x0, 40, w, 98, -3.2, 4, INK, 1.5))
    b.append(text(x0, 172, "CUSUM", 13, ACC, anchor="start", weight=700, mono=True))
    b.append(text(x0 + w, 172, "작은 초과분을 계속 더하면 오르막이 된다", 12, MUTED, anchor="end"))
    b.append(rect(x0, 184, w, 120, SURF, LINE2, 8))
    hi = max(cs) * 1.08
    lim = 6.0
    ly = ypos(lim, 190, 108, 0, hi)
    b.append(line(x0, ly, x0 + w, ly, FAIL, 1.4, "6 4"))
    b.append(text(x0 + 8, ly - 10, "한계선", 11.5, FAIL, anchor="start", weight=700))
    b.append(series(cs, x0, 190, w, 108, 0, hi, ACC, 2.2))
    b.append(line(cx, 34, cx, 304, WARN, 1.3, "4 4"))
    b.append(text(cx, 318, "실제 변화 시점", 12, WARN, weight=700))
    return svg(740, 332, b, "값 그래프와 CUSUM")


# ---------------- ts-10 ----------------
@fig("ts10-workflow")
def _():
    b = []
    steps = [("1", "질문 정하기", "무엇을 · 얼마나 멀리"), ("2", "데이터 준비", "간격 · 결측 · 집계"), ("3", "살펴보기", "분해 · 자기상관"), ("4", "기준 예측", "넘어야 할 선"),
             ("5", "후보 모델", "지수평활 · ARIMA · ML"), ("6", "롤링 원점 검증", "여러 시점에서 비교"), ("7", "구간과 함께 예측", "얼마나 확실한지"), ("8", "운영하며 점검", "오차 추적 · 재학습")]
    cols = [MUTED, ACC, ACC, CYAN, CYAN, CYAN, ORANGE, ORANGE]
    for i, (num, t, s) in enumerate(steps):
        r, c = divmod(i, 4)
        c = c if r == 0 else 3 - c
        x, y = 20 + c * 184, 24 + r * 124
        b.append(rect(x, y, 160, 84, SURF, cols[i], 10, 1.4))
        b.append(circle(x + 22, y + 24, 12, SURF3, cols[i], 1.4))
        b.append(text(x + 22, y + 24, num, 13, cols[i], weight=700))
        b.append(text(x + 92, y + 24, t, 14, INK, weight=700))
        b.append(text(x + 80, y + 58, s, 12, MUTED))
        if i < 7:
            if i == 3:
                b.append(arrow(x + 80, y + 88, x + 80, y + 120, MUTED, 1.8))
            elif r == 0:
                b.append(arrow(x + 162, y + 42, x + 182, y + 42, MUTED, 1.8))
            else:
                b.append(arrow(x - 2, y + 42, x - 22, y + 42, MUTED, 1.8))
    b.append(f'<path d="M100,236 C100,262 100,262 60,262 C6,262 6,66 16,66" fill="none" stroke="{WARN}" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#ah)"/>')
    b.append(text(250, 264, "성능이 떨어지면 다시 앞 단계로", 12, WARN))
    return svg(760, 282, b, "예측 프로젝트의 여덟 단계")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, f in FIGS.items():
        with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as fh:
            fh.write(f())
    print(f"{len(FIGS)} figures -> {os.path.normpath(OUT)}")
