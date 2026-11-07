"""통계 트랙 레슨 도식(SVG) 생성기.

python3 scripts/figures_stats.py  ->  content/img/stats/*.svg
그리기 도우미와 색은 figures_ml.py와 같은 것을 쓴다.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from figures_ml import (ACC, CYAN, FAIL, INK, INK2, LINE, LINE2, MUTED, ORANGE, PASS, SURF, SURF3, TRACK, WARN,  # noqa: E402
                        arrow, box, circle, esc, line, path, pseudo, rect, svg, text)

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "stats")
PINK = "#ff8fcf"
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def npdf(z, sd=1.0):
    return math.exp(-0.5 * (z / sd) ** 2) / (sd * math.sqrt(2 * math.pi))


def tpdf(t, df):
    c = math.gamma((df + 1) / 2) / (math.sqrt(df * math.pi) * math.gamma(df / 2))
    return c * (1 + t * t / df) ** (-(df + 1) / 2)


def curve(f, a, b, sx, sy, n=120):
    """f(x)를 a~b에서 그린 path d. sx, sy는 좌표 변환 함수."""
    pts = [a + (b - a) * i / n for i in range(n + 1)]
    return "M" + " L".join(f"{sx(x):.1f},{sy(f(x)):.1f}" for x in pts)


def area(f, a, b, sx, sy, n=80):
    pts = [a + (b - a) * i / n for i in range(n + 1)]
    return (f"M{sx(a):.1f},{sy(0):.1f} L" + " L".join(f"{sx(x):.1f},{sy(f(x)):.1f}" for x in pts)
            + f" L{sx(b):.1f},{sy(0):.1f} Z")


def fill(d, color, op=0.25):
    return f'<path d="{d}" fill="{color}" fill-opacity="{op}" stroke="none"/>'


def gauss_pts(n, seed):
    """Box-Muller로 만든 재현 가능한 표준정규 난수 n개."""
    u = pseudo(2 * n, seed)
    return [math.sqrt(-2 * math.log(max(u[2 * i], 1e-9))) * math.cos(2 * math.pi * u[2 * i + 1]) for i in range(n)]


# ---------------- st-00 ----------------
@fig("st00-desc-infer")
def _():
    b = []
    b.append(rect(20, 20, 300, 230, SURF, LINE2, 10))
    b.append(text(170, 46, "기술통계", 17, ACC, weight=700))
    b.append(text(170, 70, "손에 든 데이터를 요약", 13, MUTED))
    for i in range(4):
        for j in range(6):
            b.append(rect(60 + j * 38, 90 + i * 24, 32, 18, SURF3, LINE2, 3))
    b.append(arrow(170, 192, 170, 212, ACC, 2, accent=True))
    b.append(text(170, 230, "평균 · 중앙값 · 표준편차 · 그래프", 13, INK2, weight=600))
    b.append(rect(400, 20, 300, 230, SURF, LINE2, 10))
    b.append(text(550, 46, "추론통계", 17, CYAN, weight=700))
    b.append(text(550, 70, "표본으로 전체를 짐작", 13, MUTED))
    b.append(f'<ellipse cx="550" cy="150" rx="120" ry="60" fill="{CYAN}" fill-opacity="0.08" stroke="{CYAN}" stroke-width="1.4" stroke-dasharray="5 4"/>')
    b.append(text(550, 112, "전체(모집단) — 다 볼 수 없음", 12, CYAN))
    b.append(circle(500, 160, 26, SURF3, ACC, 1.6))
    b.append(text(500, 160, "표본", 13, ACC, weight=700))
    b.append(arrow(530, 160, 620, 160, CYAN, 2))
    b.append(text(632, 160, "?", 22, CYAN, weight=700))
    b.append(text(550, 230, "신뢰구간 · 가설검정 · 회귀", 13, INK2, weight=600))
    b.append(arrow(326, 135, 394, 135, MUTED, 2))
    b.append(text(360, 118, "그다음", 12, MUTED))
    return svg(720, 270, b, "기술통계와 추론통계")


@fig("st00-track-map")
def _():
    b = []
    steps = [("01", "시작하기", ""), ("02", "기술통계", "요약"), ("03", "확률", "확률"), ("04", "확률분포", "확률"),
             ("05", "표본분포", "표본"), ("06", "신뢰구간", "추정"), ("07", "가설검정", "검정"), ("08", "카이제곱·ANOVA", "검정"),
             ("09", "상관과 회귀", "관계"), ("10", "A/B 테스트", "실험"), ("11", "해석 실수", "해석")]
    colors = {"": MUTED, "요약": INK2, "확률": TRACK, "표본": CYAN, "추정": CYAN, "검정": PINK, "관계": ACC, "실험": ORANGE, "해석": WARN}
    for i, (d, name, tag) in enumerate(steps):
        row, col = divmod(i, 4)
        if row == 1:
            col = 3 - col
        x, y = 30 + col * 172, 24 + row * 104
        c = colors[tag]
        b.append(rect(x, y, 146, 64, SURF3, c, 10, 1.5))
        b.append(text(x + 14, y + 20, f"DAY {d}", 12, c, "start", 700, mono=True))
        b.append(text(x + 14, y + 44, name, 14, INK, "start", 700))
        if i < len(steps) - 1:
            nrow, ncol = divmod(i + 1, 4)
            if nrow == 1:
                ncol = 3 - ncol
            if nrow == row:
                if ncol > col:
                    b.append(arrow(x + 148, y + 32, x + 170, y + 32, MUTED, 1.6))
                else:
                    b.append(arrow(x - 2, y + 32, x - 24, y + 32, MUTED, 1.6))
            else:
                b.append(arrow(x + 73, y + 66, x + 73, y + 102, MUTED, 1.6))
    return svg(720, 330, b, "통계 트랙 11일 지도")


@fig("st00-pop-sample")
def _():
    b = []
    b.append(circle(220, 160, 140, CYAN, CYAN, 1.6, 0.08))
    b.append(text(220, 40, "모집단 (알고 싶은 전체)", 15, CYAN, weight=700))
    for k, (u, v) in enumerate(zip(pseudo(70, 3), pseudo(70, 11))):
        r, a = 125 * math.sqrt(u), 2 * math.pi * v
        x, y = 220 + r * math.cos(a), 165 + r * math.sin(a)
        inside = (x - 270) ** 2 + (y - 190) ** 2 < 44 ** 2
        b.append(circle(x, y, 4, ACC if inside else MUTED, op=1 if inside else 0.6))
    b.append(circle(270, 190, 48, "none", ACC, 2))
    b.append(text(270, 252, "표본 (실제로 뽑은 일부)", 13, ACC, weight=700))
    b.append(arrow(320, 190, 440, 190, ACC, 2, accent=True))
    b.append(box(450, 60, 240, 80, "모수 (parameter)\n모집단의 참값 μ, σ — 보통 모름", stroke=CYAN, color=CYAN, size=13))
    b.append(box(450, 160, 240, 80, "통계량 (statistic)\n표본에서 계산 x̄, s — 알 수 있음", stroke=ACC, color=ACC, size=13))
    b.append(arrow(570, 158, 570, 144, MUTED, 1.6, dash="4 3"))
    b.append(text(640, 151, "짐작", 12, MUTED))
    return svg(720, 300, b, "모집단과 표본, 모수와 통계량")


@fig("st00-scales")
def _():
    b = []
    rows = [("비율 척도", "키, 몸무게, 요금", "몇 배인지까지", ACC),
            ("등간 척도", "섭씨 온도, 연도", "차이까지", CYAN),
            ("서열 척도", "객실 등급, 만족도", "크다·작다까지", TRACK),
            ("명목 척도", "성별, 탑승 항구", "같다·다르다만", PINK)]
    ops = ["= ≠", "< >", "+ −", "× ÷"]
    for i, (name, ex, can, c) in enumerate(rows):
        y = 24 + i * 70
        w = 420 - i * 0
        b.append(rect(40 + i * 0, y, 640, 56, SURF3, c, 8, 1.5))
        b.append(text(60, y + 28, name, 15, c, "start", 700))
        b.append(text(190, y + 28, ex, 13, INK2, "start"))
        b.append(text(380, y + 28, can, 13, INK, "start", 600))
        nops = 4 - i
        for k in range(nops):
            b.append(text(520 + k * 40, y + 28, ops[k], 14, c, weight=700, mono=True))
    b.append(arrow(20, 300, 20, 30, MUTED, 1.6))
    b.append(text(14, 18, "할 수 있는 계산 ↑", 11, MUTED, "start"))
    return svg(720, 312, b, "척도의 네 종류")


# ---------------- st-01 ----------------
@fig("st01-mean-median")
def _():
    b = []
    vals = [1, 2, 2, 3, 3, 3, 4, 12]
    sx = lambda v: 60 + v * 46
    b.append(text(40, 24, "평균 = 시소의 균형점", 15, ACC, "start", 700))
    b.append(line(sx(0), 110, sx(13), 110, INK2, 3))
    counts = {}
    for v in vals:
        counts[v] = counts.get(v, 0) + 1
        b.append(rect(sx(v) - 12, 110 - counts[v] * 22, 24, 20, SURF3, PINK if v == 12 else LINE2, 4, 1.4))
    m = sum(vals) / len(vals)
    b.append(path(f"M{sx(m)},112 L{sx(m) - 14},138 L{sx(m) + 14},138 Z", ACC, 1.5, ACC))
    b.append(text(sx(m), 152, f"평균 {m:.2f}", 13, ACC, weight=700))
    b.append(text(sx(12), 128, "멀리 있는 값 하나", 12, PINK, weight=600))
    b.append(text(40, 196, "중앙값 = 줄의 한가운데", 15, CYAN, "start", 700))
    for i, v in enumerate(vals):
        x = 60 + i * 74
        hi = i in (3, 4)
        b.append(box(x, 216, 56, 40, str(v), stroke=CYAN if hi else (PINK if v == 12 else LINE2), color=CYAN if hi else INK, size=15))
    b.append(path(f"M{60 + 3 * 74 + 28},262 L{60 + 3 * 74 + 28},274 L{60 + 4 * 74 + 28},274 L{60 + 4 * 74 + 28},262", CYAN, 1.6))
    b.append(text(60 + 3.5 * 74 + 28, 290, "가운데 두 값의 평균 → 중앙값 3", 13, CYAN, weight=700))
    return svg(720, 306, b, "평균과 중앙값")


@fig("st01-spread")
def _():
    b = []
    A = [3, 2, 4, 3, 3, 4, 2, 3]
    B = [1, 6, 2, 5, 1, 3, 6, 0]
    sy = lambda v: 250 - v * 34
    b += [line(60, sy(3), 680, sy(3), ACC, 1.6, "6 4"), text(690, sy(3), "평균 3일", 12, ACC, "start", 700)]
    for k in range(7):
        b.append(text(48, sy(k), str(k), 11, MUTED, "end"))
    for name, data, x0, c in (("A사", A, 90, CYAN), ("B사", B, 400, PINK)):
        b.append(text(x0 + 120, 22, name, 15, c, weight=700))
        for i, v in enumerate(data):
            x = x0 + i * 34
            if v != 3:
                b.append(line(x, sy(3), x, sy(v), c, 1.6))
            b.append(circle(x, sy(v), 6, c))
    b.append(text(210, 272, "편차가 작다 → 표준편차 0.71일", 13, CYAN, weight=600))
    b.append(text(520, 272, "편차가 크다 → 표준편차 2.24일", 13, PINK, weight=600))
    return svg(740, 290, b, "흩어짐과 편차")


@fig("st01-boxplot-rule")
def _():
    b = []
    sx = lambda v: 40 + v * 26
    q1, med, q3 = 6, 9, 12
    iqr = q3 - q1
    y = 110
    b.append(rect(sx(q1), y - 34, sx(q3) - sx(q1), 68, ACC, ACC, 4, 1.6, op=0.12))
    b.append(line(sx(med), y - 34, sx(med), y + 34, ACC, 2.6))
    b += [line(sx(2), y, sx(q1), y, INK2, 1.6), line(sx(q3), y, sx(17.5), y, INK2, 1.6),
          line(sx(2), y - 14, sx(2), y + 14, INK2, 1.6), line(sx(17.5), y - 14, sx(17.5), y + 14, INK2, 1.6)]
    b.append(circle(sx(23.5), y, 6, PINK))
    b.append(text(sx(23.5), y - 22, "이상치 후보", 12, PINK, weight=700))
    for v, lab in ((q1, "Q1\n(25%)"), (med, "중앙값\n(50%)"), (q3, "Q3\n(75%)")):
        b.append(text(sx(v), 36, lab, 12, ACC, weight=700))
    b.append(path(f"M{sx(q1)},160 L{sx(q1)},168 L{sx(q3)},168 L{sx(q3)},160", ACC, 1.4))
    b.append(text(sx(med), 184, "IQR = Q3 − Q1 (가운데 50%)", 12, ACC, weight=600))
    b.append(path(f"M{sx(q3)},200 L{sx(q3)},208 L{sx(q3 + 1.5 * iqr)},208 L{sx(q3 + 1.5 * iqr)},200", MUTED, 1.4, dash="4 3"))
    b.append(text((sx(q3) + sx(q3 + 1.5 * iqr)) / 2, 224, "최대 1.5 × IQR", 12, MUTED, weight=600))
    b.append(text(sx(2), 146, "수염", 12, INK2))
    b.append(text(sx(21), 146, "이 경계 밖 → 점으로", 11, MUTED))
    b.append(line(sx(21), y - 20, sx(21), y + 20, MUTED, 1.2, "3 3"))
    return svg(720, 240, b, "상자그림과 1.5 IQR 규칙")


@fig("st01-zscore")
def _():
    b = []
    sx = lambda z: 360 + z * 100
    sy = lambda p: 200 - p * 380
    b.append(fill(area(npdf, 2, 3.5, sx, sy), PINK, 0.35))
    b.append(fill(area(npdf, -3.5, -2, sx, sy), PINK, 0.35))
    b.append(path(curve(npdf, -3.5, 3.5, sx, sy), ACC, 2.4))
    b.append(line(sx(-3.5), 200, sx(3.5), 200, MUTED, 1.4))
    for z in range(-3, 4):
        b.append(line(sx(z), 200, sx(z), 206, MUTED, 1.2))
        b.append(text(sx(z), 220, f"z = {z}" if z else "z = 0", 12, ACC if z == 0 else INK2, weight=700 if z == 0 else 500, mono=True))
    b.append(line(sx(0), sy(npdf(0)), sx(0), 200, ACC, 1.2, "4 3"))
    b.append(text(sx(0), 22, "평균", 13, ACC, weight=700))
    b.append(text(sx(2.75), 150, "아주 드문\n영역", 12, PINK, weight=700))
    b.append(text(sx(-2.75), 150, "아주 드문\n영역", 12, PINK, weight=700))
    b.append(text(360, 244, "z = (값 − 평균) ÷ 표준편차", 13, INK, weight=600))
    return svg(720, 260, b, "z점수")


@fig("st01-shapes")
def _():
    b = []
    titles = ["왼쪽 꼬리가 긴 분포", "좌우 대칭", "오른쪽 꼬리가 긴 분포"]
    fs = [lambda x: (x ** 3) * (1 - x) ** 0.6, lambda x: math.exp(-((x - 0.5) / 0.16) ** 2 / 2), lambda x: (x ** 0.6) * (1 - x) ** 3]
    marks = [(0.62, 0.70), (0.5, 0.5), (0.38, 0.30)]
    for k in range(3):
        x0 = 20 + k * 236
        b.append(rect(x0, 14, 218, 200, SURF, LINE2, 10))
        b.append(text(x0 + 109, 36, titles[k], 13, INK, weight=700))
        f = fs[k]
        mx = max(f(i / 200) for i in range(1, 200))
        sx = lambda v, x0=x0: x0 + 14 + v * 190
        sy = lambda p, mx=mx: 170 - p / mx * 110
        b.append(fill(area(f, 0.001, 0.999, sx, sy), TRACK, 0.18))
        b.append(path(curve(f, 0.001, 0.999, sx, sy), TRACK, 2))
        b.append(line(sx(0), 170, sx(1), 170, MUTED, 1.2))
        mean, med = marks[k]
        if k == 1:
            b.append(line(sx(mean), 56, sx(mean), 170, ACC, 1.8))
            b.append(text(sx(mean), 190, "평균 = 중앙값", 12, ACC, weight=700))
        else:
            b.append(line(sx(mean), 56, sx(mean), 170, ACC, 1.8))
            b.append(line(sx(med), 56, sx(med), 170, CYAN, 1.8, "4 3"))
            b.append(text(sx(mean), 190, "평균", 12, ACC, weight=700))
            b.append(text(sx(med), 204, "중앙값", 12, CYAN, weight=700))
    return svg(730, 228, b, "분포의 세 가지 모양")


# ---------------- st-09 확률 ----------------
@fig("st09-sample-space")
def _():
    b = []
    b.append(rect(40, 30, 440, 240, SURF, INK2, 10, 1.4))
    b.append(text(60, 50, "표본공간 S = {1, 2, 3, 4, 5, 6}", 13, INK2, "start", 600))
    b.append(circle(210, 160, 92, CYAN, CYAN, 1.8, 0.12))
    b.append(circle(310, 160, 92, PINK, PINK, 1.8, 0.12))
    b.append(text(112, 100, "A: 짝수", 13, CYAN, weight=700))
    b.append(text(412, 100, "B: 4 이상", 13, PINK, weight=700))
    for v, x, y in ((2, 165, 165), (4, 260, 135), (6, 260, 190), (5, 360, 165), (1, 80, 240), (3, 440, 240)):
        b.append(text(x, y, str(v), 22, INK, weight=700, mono=True))
    b.append(text(600, 90, "A 그리고 B\n= {4, 6}", 14, ACC, weight=700))
    b.append(text(600, 170, "A 또는 B\n= {2, 4, 5, 6}", 14, INK, weight=700))
    b.append(text(600, 240, "P(A) = 3/6 = 0.5", 13, CYAN, weight=600, mono=True))
    b.append(arrow(540, 96, 278, 162, ACC, 1.4, dash="4 3", accent=True))
    return svg(720, 290, b, "표본공간과 사건")


@fig("st09-lln")
def _():
    b = []
    x0, y0, w, h = 70, 20, 610, 220
    sx = lambda n: x0 + w * math.log10(n) / 4
    sy = lambda p: y0 + h - h * p
    b += [line(x0, y0 + h, x0 + w, y0 + h, MUTED, 1.2), line(x0, y0, x0, y0 + h, MUTED, 1.2)]
    for p in (0, 0.25, 0.5, 0.75, 1):
        b.append(text(x0 - 8, sy(p), f"{p:g}", 11, MUTED, "end", mono=True))
    for k in range(5):
        b.append(text(sx(10 ** k), y0 + h + 16, f"{10 ** k:,}", 11, MUTED, mono=True))
    b.append(line(x0, sy(0.5), x0 + w, sy(0.5), ACC, 1.6, "6 4"))
    b.append(text(x0 + w + 6, sy(0.5), "0.5", 12, ACC, "start", 700))
    u = pseudo(10000, 21)
    s, pts = 0, []
    for i in range(10000):
        s += u[i] < 0.5
        n = i + 1
        if n < 30 or n % max(1, n // 60) == 0:
            pts.append((n, s / n))
    b.append(path("M" + " L".join(f"{sx(n):.1f},{sy(p):.1f}" for n, p in pts), CYAN, 2))
    b.append(text(x0 + w / 2, y0 + h + 36, "던진 횟수 (로그 눈금)", 12, MUTED))
    b.append(text(x0 + 90, y0 + 14, "처음엔 크게 흔들림", 12, CYAN, "start", 600))
    b.append(text(x0 + w - 10, sy(0.5) - 26, "많이 던질수록 0.5에 붙음", 12, CYAN, "end", 600))
    return svg(720, 300, b, "큰 수의 법칙")


@fig("st09-conditional")
def _():
    b = []
    x0, y0 = 40, 60
    cw, ch = 110, 44
    heads = ["", "사망", "생존", "합계"]
    rows = [["여성", "81", "233", "314"], ["남성", "468", "109", "577"], ["합계", "549", "342", "891"]]
    for j, hd in enumerate(heads):
        b.append(text(x0 + j * cw + cw / 2, y0 - 16, hd, 13, MUTED, weight=700))
    for i, r in enumerate(rows):
        for j, v in enumerate(r):
            hi = i == 0
            stroke = ACC if hi else LINE2
            b.append(box(x0 + j * cw, y0 + i * ch, cw, ch, v, fill=SURF3 if not hi else SURF3, stroke=stroke,
                         color=(ACC if (hi and j == 2) else (CYAN if (hi and j == 3) else INK)), size=14, rx=0))
    b.append(rect(x0 - 4, y0 - 4, 4 * cw + 8, ch + 8, "none", ACC, 6, 2.2))
    b.append(arrow(x0 + 4 * cw + 14, y0 + ch / 2, 530, y0 + ch / 2, ACC, 2, accent=True))
    b.append(text(600, y0 + 10, "여성만 남기기", 13, ACC, weight=700))
    b.append(text(600, y0 + 70, "233", 26, ACC, weight=700, mono=True))
    b.append(line(550, y0 + 92, 650, y0 + 92, INK2, 2))
    b.append(text(600, y0 + 114, "314", 26, CYAN, weight=700, mono=True))
    b.append(text(600, y0 + 152, "= 0.742", 16, INK, weight=700, mono=True))
    b.append(text(260, 240, "P(생존 | 여성): 분모가 891이 아니라 314", 14, INK, weight=600))
    return svg(720, 262, b, "조건부확률")


@fig("st09-bayes-tree")
def _():
    b = []
    b.append(box(20, 120, 120, 56, "10,000명", stroke=INK2, size=15))
    b.append(box(220, 40, 150, 56, "병 있음 100명", stroke=PINK, color=PINK, size=14))
    b.append(box(220, 200, 150, 56, "병 없음 9,900명", stroke=CYAN, color=CYAN, size=14))
    b += [arrow(140, 140, 216, 74), arrow(140, 156, 216, 222)]
    b.append(text(170, 92, "1%", 12, MUTED, weight=700))
    b.append(text(170, 208, "99%", 12, MUTED, weight=700))
    leaves = [(10, "양성 90명", ACC, "90%", 40), (66, "음성 10명", MUTED, "10%", 40),
              (170, "양성 495명", ACC, "5%", 200), (226, "음성 9,405명", MUTED, "95%", 200)]
    for y, lab, c, pct, py in leaves:
        b.append(box(450, y, 150, 44, lab, stroke=c, color=c, size=13))
        b.append(arrow(370, py + 28, 446, y + 22))
        b.append(text(410, (py + 28 + y + 22) / 2 - 8, pct, 11, MUTED, weight=700))
    b.append(rect(620, 40, 90, 200, SURF, ACC, 10, 1.6))
    b.append(text(665, 80, "양성\n585명", 14, ACC, weight=700))
    b.append(text(665, 140, "그중\n진짜 환자", 12, INK2))
    b.append(text(665, 186, "90명", 18, PINK, weight=700))
    b.append(text(665, 218, "≈ 15%", 14, PINK, weight=700, mono=True))
    return svg(720, 284, b, "베이즈 정리 나무 그림")


# ---------------- st-02 확률분포 ----------------
@fig("st02-random-variable")
def _():
    b = []
    outs = ["앞 앞", "앞 뒤", "뒤 앞", "뒤 뒤"]
    vals = [2, 1, 1, 0]
    b.append(text(110, 20, "결과 (표본공간)", 13, MUTED, weight=700))
    b.append(text(360, 20, "앞면 수 X", 13, MUTED, weight=700))
    b.append(text(590, 20, "확률", 13, MUTED, weight=700))
    vy = {2: 60, 1: 140, 0: 220}
    for i, (o, v) in enumerate(zip(outs, vals)):
        y = 50 + i * 60
        b.append(box(50, y, 120, 40, o, size=14))
        b.append(arrow(172, y + 20, 326, vy[v] + 2, TRACK, 1.6))
    for v, y in vy.items():
        b.append(box(330, y - 20, 60, 44, str(v), stroke=ACC, color=ACC, size=18))
        p = {2: "1/4", 1: "2/4", 0: "1/4"}[v]
        b.append(arrow(394, y + 2, 540, y + 2, MUTED, 1.4))
        b.append(text(590, y + 2, f"P(X={v}) = {p}", 14, INK, weight=600, mono=True))
    return svg(720, 300, b, "확률변수")


@fig("st02-pmf-cdf")
def _():
    b = []
    p = [0.25, 0.5, 0.25]
    for k, title in enumerate(("pmf: 각 값의 확률", "cdf: 그 값까지 누적")):
        x0 = 50 + k * 350
        b.append(text(x0 + 140, 20, title, 14, ACC if k == 0 else CYAN, weight=700))
        b += [line(x0, 220, x0 + 280, 220, MUTED, 1.2), line(x0, 40, x0, 220, MUTED, 1.2)]
        sy = lambda q: 220 - q * 170
        for q in (0.25, 0.5, 0.75, 1):
            b.append(text(x0 - 8, sy(q), f"{q:g}", 11, MUTED, "end", mono=True))
            b.append(line(x0, sy(q), x0 + 280, sy(q), LINE, 1, "3 4"))
        for v in range(3):
            b.append(text(x0 + 60 + v * 80, 236, str(v), 13, INK2, mono=True))
        if k == 0:
            for v in range(3):
                b.append(rect(x0 + 40 + v * 80, sy(p[v]), 40, 220 - sy(p[v]), ACC, ACC, 2, 1, op=0.5))
        else:
            c, d = 0, []
            d.append(f"M{x0},{sy(0)} L{x0 + 60},{sy(0)}")
            for v in range(3):
                c += p[v]
                end = x0 + 60 + (v + 1) * 80 if v < 2 else x0 + 280
                d.append(f"M{x0 + 60 + v * 80},{sy(c)} L{end},{sy(c)}")
                b.append(circle(x0 + 60 + v * 80, sy(c), 4.5, CYAN))
            b.append(path(" ".join(d), CYAN, 2.6))
    return svg(720, 250, b, "pmf와 cdf")


@fig("st02-binomial")
def _():
    b = []
    conds = ["① 시행 횟수 n이 정해져 있다", "② 결과는 성공·실패 두 가지", "③ 매번 성공 확률 p가 같다", "④ 각 시행이 서로 독립"]
    b.append(rect(20, 20, 300, 220, SURF, LINE2, 10))
    b.append(text(170, 44, "이항분포의 네 조건", 15, ACC, weight=700))
    for i, c in enumerate(conds):
        b.append(text(40, 86 + i * 40, "✓", 16, PASS, "start", 700))
        b.append(text(64, 86 + i * 40, c, 13, INK, "start", 600))
    n, p = 100, 0.0339
    probs = [math.comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(11)]
    x0, w = 370, 320
    sy = lambda q: 210 - q / max(probs) * 150
    b.append(text(x0 + w / 2, 30, "B(100, 0.0339): 100대 중 고장 수", 13, INK2, weight=700))
    b.append(line(x0, 210, x0 + w, 210, MUTED, 1.2))
    for k, q in enumerate(probs):
        x = x0 + 6 + k * 28
        b.append(rect(x, sy(q), 20, 210 - sy(q), ACC if k == 3 else TRACK, ACC if k == 3 else TRACK, 2, 1, op=0.55))
        b.append(text(x + 10, 224, str(k), 11, MUTED, mono=True))
    b.append(text(x0 + 6 + 3 * 28 + 10, sy(probs[3]) - 12, "3대가 가장 흔함", 12, ACC, weight=700))
    return svg(720, 250, b, "이항분포")


@fig("st02-normal-rule")
def _():
    b = []
    sx = lambda z: 360 + z * 95
    sy = lambda p: 190 - p * 400
    for k, c, op in ((3, CYAN, 0.12), (2, TRACK, 0.18), (1, ACC, 0.28)):
        b.append(fill(area(npdf, -k, k, sx, sy), c, op))
    b.append(path(curve(npdf, -3.6, 3.6, sx, sy), INK, 2.2))
    b.append(line(sx(-3.6), 190, sx(3.6), 190, MUTED, 1.2))
    labels = {0: "μ"}
    for z in range(-3, 4):
        b.append(text(sx(z), 204, labels.get(z, f"μ{'+' if z > 0 else '−'}{abs(z)}σ"), 12, INK2, mono=True))
    for k, c, pct, y in ((1, ACC, "68%", 222), (2, TRACK, "95%", 244), (3, CYAN, "99.7%", 266)):
        b.append(path(f"M{sx(-k)},{y - 6} L{sx(-k)},{y} L{sx(k)},{y} L{sx(k)},{y - 6}", c, 1.6))
        b.append(rect(360 - 30, y - 9, 60, 18, "#121516", "none", 4))
        b.append(text(360, y, pct, 12, c, weight=700, mono=True))
    return svg(720, 280, b, "68-95-99.7 규칙")


# ---------------- st-03 표본 ----------------
@fig("st03-bias-target")
def _():
    b = []
    cfg = [("편향 작음 · 흔들림 작음", 0, 0, 10, PASS), ("편향 큼 · 흔들림 작음", 34, -26, 10, WARN),
           ("편향 작음 · 흔들림 큼", 0, 0, 34, WARN), ("편향 큼 · 흔들림 큼", 34, -26, 34, FAIL)]
    for k, (lab, dx, dy, spread, c) in enumerate(cfg):
        col, row = k % 2, k // 2
        cx, cy = 130 + col * 360, 110 + row * 220
        for r, op in ((80, 0.06), (56, 0.08), (32, 0.1)):
            b.append(circle(cx, cy, r, INK2, LINE2, 1.2, op))
        b.append(circle(cx, cy, 6, PINK))
        gx, gy = gauss_pts(12, 5 + k), gauss_pts(12, 50 + k)
        for i in range(12):
            b.append(circle(cx + dx + gx[i] * spread, cy + dy + gy[i] * spread, 4.5, ACC))
        b.append(text(cx + 110, cy, lab.replace(" · ", "\n"), 13, c, "start", 700))
    return svg(720, 440, b, "편향과 흔들림")


@fig("st03-sampling-dist")
def _():
    b = []
    b.append(rect(20, 60, 140, 170, SURF, CYAN, 10, 1.4))
    b.append(text(90, 80, "모집단", 14, CYAN, weight=700))
    for i, (u, v) in enumerate(zip(pseudo(40, 7), pseudo(40, 9))):
        b.append(circle(36 + u * 108, 100 + v * 116, 3.5, MUTED, op=0.8))
    labels = ["표본 1 → x̄ = 4.1", "표본 2 → x̄ = 3.7", "표본 3 → x̄ = 4.4", "⋮", "표본 1000 → x̄ = 3.9"]
    for i, lab in enumerate(labels):
        y = 50 + i * 46
        if lab == "⋮":
            b.append(text(280, y + 18, "⋮", 18, MUTED))
            continue
        b.append(box(200, y, 170, 36, lab, size=12, weight=600))
        b.append(arrow(162, 145, 196, y + 18, MUTED, 1.2))
        b.append(arrow(372, y + 18, 440, 200, ACC, 1.2, accent=True))
    x0 = 460
    heights = [1, 2, 4, 6, 7, 6, 4, 2, 1]
    for j, hgt in enumerate(heights):
        for k in range(hgt):
            b.append(rect(x0 + j * 26, 230 - (k + 1) * 18, 24, 16, ACC, ACC, 2, 1, op=0.45))
    b.append(line(x0 - 6, 232, x0 + 240, 232, MUTED, 1.2))
    b.append(text(x0 + 117, 250, "표본평균 1,000개의 분포", 13, ACC, weight=700))
    return svg(720, 270, b, "표본분포 만들기")


@fig("st03-clt")
def _():
    b = []
    ns = [1, 5, 30, 100]
    for k, n in enumerate(ns):
        x0 = 16 + k * 178
        b.append(rect(x0, 14, 164, 200, SURF, LINE2, 10))
        b.append(text(x0 + 82, 34, "n = 1 (모집단)" if n == 1 else f"n = {n}", 13, ACC if n >= 30 else INK, weight=700))
        # 지수분포(평균 1)의 표본평균 = 감마(n, 1/n) 밀도
        f = lambda x, n=n: (n ** n) * x ** (n - 1) * math.exp(-n * x) / math.gamma(n) if x > 0 else 0
        sx = lambda v, x0=x0: x0 + 12 + v / 3 * 140
        top = max(f(i / 100) for i in range(1, 300))
        sy = lambda p, top=top: 190 - p / top * 130
        bins = 45
        for i in range(bins):
            v = (i + 0.5) * 3 / bins
            b.append(rect(sx(i * 3 / bins), sy(f(v)), 140 / bins - 1, 190 - sy(f(v)), TRACK, TRACK, 1, 0.6, op=0.5))
        b.append(line(sx(0), 190, sx(3), 190, MUTED, 1.2))
        b.append(line(sx(1), 50, sx(1), 190, ACC, 1.2, "4 3"))
    b.append(text(360, 232, "점선 = 모평균. n이 커질수록 종 모양에 가까워지고 폭이 좁아진다", 12, MUTED, weight=600))
    return svg(730, 244, b, "중심극한정리")


# ---------------- st-04 추정 ----------------
@fig("st04-ci-coverage")
def _():
    b = []
    mu_y = 140
    b.append(line(30, mu_y, 700, mu_y, ACC, 1.8))
    b.append(text(706, mu_y, "참값", 12, ACC, "start", 700))
    g = gauss_pts(20, 13)
    g[13] = 2.6
    for i in range(20):
        x = 50 + i * 32
        c = mu_y + g[i] * 26
        half = 52
        miss = abs(c - mu_y) > half
        col = FAIL if miss else CYAN
        b.append(line(x, c - half, x, c + half, col, 2.4))
        b.append(circle(x, c, 4, col))
    b.append(text(360, 262, "구간 20개 중 19개는 참값을 지나고, 1개(빨강)는 빗나간다", 13, INK2, weight=600))
    return svg(730, 280, b, "95% 신뢰구간의 뜻")


@fig("st04-t-vs-normal")
def _():
    b = []
    sx = lambda z: 360 + z * 80
    sy = lambda p: 200 - p * 420
    b.append(fill(area(lambda t: tpdf(t, 4), 2.776, 4.2, sx, sy), PINK, 0.3))
    b.append(fill(area(lambda t: tpdf(t, 4), -4.2, -2.776, sx, sy), PINK, 0.3))
    b.append(path(curve(npdf, -4.2, 4.2, sx, sy), CYAN, 2.2))
    b.append(path(curve(lambda t: tpdf(t, 4), -4.2, 4.2, sx, sy), PINK, 2.2))
    b.append(line(sx(-4.2), 200, sx(4.2), 200, MUTED, 1.2))
    for z, lab, c, y in ((1.96, "1.96", CYAN, 216), (2.776, "2.78", PINK, 232)):
        for s in (-1, 1):
            b.append(line(sx(s * z), 200, sx(s * z), 120, c, 1.4, "4 3"))
            b.append(text(sx(s * z), y, ("−" if s < 0 else "+") + lab, 12, c, weight=700, mono=True))
    b.append(text(560, 40, "표준정규분포", 13, CYAN, "start", 700))
    b.append(text(560, 62, "t분포 (자유도 4)", 13, PINK, "start", 700))
    b.append(text(sx(3.4), 172, "더 두꺼운\n꼬리", 12, PINK, weight=600))
    return svg(720, 248, b, "t분포와 정규분포")


# ---------------- st-05 가설검정 ----------------
@fig("st05-test-steps")
def _():
    b = []
    steps = [("1", "가설 세우기", "H₀: 차이 없음\nH₁: 차이 있음", INK2),
             ("2", "통계량 계산", "데이터에서\nt, χ² 등", INK2),
             ("3", "p-value 계산", "H₀가 맞는 세상에서\n이만큼 드문가?", ACC),
             ("4", "판단", "p < α 이면\nH₀ 기각", CYAN)]
    for i, (n, t, d, c) in enumerate(steps):
        x = 14 + i * 176
        b.append(rect(x, 30, 156, 150, SURF3, c, 10, 1.8 if c == ACC else 1.2))
        b.append(circle(x + 26, 56, 14, c))
        b.append(text(x + 26, 56, n, 13, "#121516", weight=800))
        b.append(text(x + 92, 56, t, 14, c, weight=700))
        b.append(text(x + 78, 120, d, 12, INK, weight=500))
        if i < 3:
            b.append(arrow(x + 158, 105, x + 174, 105, MUTED, 1.6))
    return svg(720, 200, b, "가설검정 4단계")


@fig("st05-error-table")
def _():
    b = []
    x0, y0, cw, ch = 190, 60, 250, 80
    b.append(text(x0 + cw, 22, "실제", 14, MUTED, weight=700))
    b.append(text(x0 + cw / 2, 44, "차이 없음 (H₀ 참)", 13, INK2, weight=700))
    b.append(text(x0 + 1.5 * cw, 44, "차이 있음 (H₀ 거짓)", 13, INK2, weight=700))
    b.append(text(40, y0 + ch, "판단", 14, MUTED, weight=700))
    b.append(text(150, y0 + ch / 2, "H₀ 기각", 13, INK2, "end", 700))
    b.append(text(150, y0 + 1.5 * ch, "기각 못 함", 13, INK2, "end", 700))
    cells = [[("1종 오류 (α)\n헛경보", FAIL), ("올바른 판단\n검정력 1 − β", PASS)],
             [("올바른 판단", PASS), ("2종 오류 (β)\n놓침", FAIL)]]
    for i in range(2):
        for j in range(2):
            lab, c = cells[i][j]
            b.append(box(x0 + j * cw, y0 + i * ch, cw, ch, lab, stroke=c, color=c, size=14, rx=4))
    return svg(720, 240, b, "1종 오류와 2종 오류")


@fig("st05-power-curves")
def _():
    b = []
    for k, (sd, title) in enumerate(((1.0, "표본이 작을 때"), (0.55, "표본이 클 때"))):
        y0 = 20 + k * 170
        sx = lambda z: 120 + z * 110
        sy = lambda p, y0=y0, sd=sd: y0 + 140 - p * sd * 210
        f0 = lambda z, sd=sd: npdf(z, sd)
        f1 = lambda z, sd=sd: npdf(z - 2.2, sd)
        crit = 1.645 * sd
        b.append(fill(area(f1, -1, crit, sx, sy), FAIL, 0.25))
        b.append(fill(area(f1, crit, 5.2, sx, sy), PASS, 0.25))
        b.append(fill(area(f0, crit, 3.5, sx, sy), WARN, 0.6))
        b.append(path(curve(f0, -3, 3.5, sx, sy), INK2, 2))
        b.append(path(curve(f1, -1, 5.2, sx, sy), CYAN, 2))
        b.append(line(sx(-3), y0 + 140, sx(5.2), y0 + 140, MUTED, 1.2))
        b.append(line(sx(crit), y0 + 10, sx(crit), y0 + 140, ACC, 1.6, "5 4"))
        b.append(text(14, y0 + 20, title, 13, INK, "start", 700))
        b.append(text(sx(0), y0 + 156, "H₀ 세상", 11, INK2, weight=600))
        b.append(text(sx(2.2), y0 + 156, "실제 차이 있는 세상", 11, CYAN, weight=600))
    b.append(text(640, 60, "α", 14, WARN, "start", 700))
    b.append(text(660, 60, "헛경보", 12, WARN, "start"))
    b.append(text(640, 84, "β", 14, FAIL, "start", 700))
    b.append(text(660, 84, "놓침", 12, FAIL, "start"))
    b.append(text(640, 108, "■", 12, PASS, "start", 700))
    b.append(text(660, 108, "검정력", 12, PASS, "start"))
    b.append(text(640, 132, "┆", 14, ACC, "start", 700))
    b.append(text(660, 132, "기각 경계", 12, ACC, "start"))
    return svg(740, 360, b, "검정력과 표본 크기")


@fig("st05-ttest-chooser")
def _():
    b = []
    b.append(box(220, 14, 280, 50, "기준값 하나와 비교하나?", stroke=INK2, size=14))
    b.append(arrow(220, 39, 150, 39, PASS, 1.8))
    b.append(text(184, 26, "예", 12, PASS, weight=700))
    b.append(box(14, 14, 132, 50, "1표본 t검정\nttest_1samp", stroke=ACC, color=ACC, size=12))
    b.append(arrow(360, 66, 360, 106, FAIL, 1.8))
    b.append(text(380, 86, "아니오", 12, FAIL, "start", 700))
    b.append(box(220, 110, 280, 50, "같은 대상을 두 번 쟀나?", stroke=INK2, size=14))
    b.append(arrow(220, 135, 150, 135, PASS, 1.8))
    b.append(text(184, 122, "예", 12, PASS, weight=700))
    b.append(box(14, 110, 132, 50, "대응 t검정\nttest_rel", stroke=ACC, color=ACC, size=12))
    b.append(arrow(360, 162, 360, 202, FAIL, 1.8))
    b.append(text(380, 182, "아니오", 12, FAIL, "start", 700))
    b.append(box(200, 206, 320, 54, "독립 2표본 t검정\nttest_ind(equal_var=False)", stroke=ACC, color=ACC, size=13))
    b.append(text(610, 39, "예: 평균 몸무게가\n4,000g과 다른가", 11, MUTED))
    b.append(text(610, 135, "예: 같은 학생의\n수업 전·후 점수", 11, MUTED))
    b.append(text(610, 233, "예: 남녀 두 그룹의\n평균 비교", 11, MUTED))
    return svg(720, 276, b, "t검정 고르기")


# ---------------- st-06 ----------------
@fig("st06-observed-expected")
def _():
    b = []
    tables = [("관측도수 (실제로 센 수)", [["81", "233"], ["468", "109"]], 30, INK),
              ("기대도수 (관련 없다면)", [["193.5", "120.5"], ["355.5", "221.5"]], 390, CYAN)]
    for title, vals, x0, c in tables:
        b.append(text(x0 + 150, 22, title, 14, c, weight=700))
        b.append(text(x0 + 130, 50, "사망", 12, MUTED, weight=700))
        b.append(text(x0 + 240, 50, "생존", 12, MUTED, weight=700))
        for i, sex in enumerate(("여성", "남성")):
            b.append(text(x0 + 40, 86 + i * 60, sex, 13, INK2, weight=700))
            for j in range(2):
                hi = i == 0 and j == 1
                b.append(box(x0 + 80 + j * 110, 62 + i * 60, 100, 50, vals[i][j], stroke=ACC if hi else LINE2,
                             color=ACC if hi else c, size=16, rx=4))
    b.append(text(360, 204, "여성 생존: 기대 120.5명 → 실제 233명", 14, ACC, weight=700))
    b.append(text(360, 228, "χ² = Σ (관측 − 기대)² ÷ 기대", 13, INK2, weight=600, mono=True))
    return svg(720, 244, b, "관측도수와 기대도수")


@fig("st06-anova-idea")
def _():
    b = []
    cfg = [("F가 크다: 평균이 다르다", [60, 120, 175], 9, ACC), ("F가 작다: 차이가 흩어짐에 묻힘", [105, 118, 128], 32, PINK)]
    cols = [CYAN, TRACK, ORANGE]
    for k, (title, means, sd, tc) in enumerate(cfg):
        x0 = 20 + k * 360
        b.append(rect(x0, 14, 330, 240, SURF, LINE2, 10))
        b.append(text(x0 + 165, 34, title, 13, tc, weight=700))
        for g in range(3):
            gx = x0 + 70 + g * 95
            ys = gauss_pts(10, 30 + g + 7 * k)
            yy = [250 - (means[g] + v * sd) for v in ys]
            b.append(line(gx - 30, 250 - means[g], gx + 30, 250 - means[g], cols[g], 2.4))
            for i, y in enumerate(yy):
                b.append(circle(gx - 18 + (i % 5) * 9, min(max(y, 56), 228), 4, cols[g], op=0.85))
            b.append(text(gx, 246, f"그룹 {'ABC'[g]}", 11, cols[g], weight=600))
    return svg(720, 268, b, "분산분석(ANOVA)의 아이디어")


# ---------------- st-07 상관과 회귀 ----------------
@fig("st07-covariance-quadrants")
def _():
    b = []
    x0, y0, w, h = 60, 20, 420, 260
    mx, my = x0 + w / 2, y0 + h / 2
    b.append(rect(mx, y0, w / 2, h / 2, PASS, "none", 0, op=0.08))
    b.append(rect(x0, my, w / 2, h / 2, PASS, "none", 0, op=0.08))
    b.append(rect(x0, y0, w / 2, h / 2, FAIL, "none", 0, op=0.06))
    b.append(rect(mx, my, w / 2, h / 2, FAIL, "none", 0, op=0.06))
    b += [line(mx, y0, mx, y0 + h, ACC, 1.4, "5 4"), line(x0, my, x0 + w, my, ACC, 1.4, "5 4")]
    gx, gy = gauss_pts(40, 77), gauss_pts(40, 88)
    for i in range(40):
        x = gx[i]
        y = 0.75 * x + 0.6 * gy[i]
        b.append(circle(mx + x * 70, my - y * 70, 4, INK2, op=0.85))
    b.append(text(x0 + w - 30, y0 + 24, "+", 26, PASS, weight=700))
    b.append(text(x0 + 30, y0 + h - 24, "+", 26, PASS, weight=700))
    b.append(text(x0 + 30, y0 + 24, "−", 26, FAIL, weight=700))
    b.append(text(x0 + w - 30, y0 + h - 24, "−", 26, FAIL, weight=700))
    b.append(text(mx, y0 + h + 16, "x 평균", 11, ACC, weight=700))
    b.append(text(x0 - 6, my, "y 평균", 11, ACC, "end", 700))
    b.append(text(510, 70, "오른쪽 위: (+) × (+) = +", 13, PASS, "start", 600))
    b.append(text(510, 96, "왼쪽 아래: (−) × (−) = +", 13, PASS, "start", 600))
    b.append(text(510, 132, "왼쪽 위: (−) × (+) = −", 13, FAIL, "start", 600))
    b.append(text(510, 158, "오른쪽 아래: (+) × (−) = −", 13, FAIL, "start", 600))
    b.append(text(510, 210, "+칸에 점이 많으면\n공분산 > 0", 13, INK, "start", 700))
    return svg(720, 300, b, "공분산의 네 칸")


@fig("st07-least-squares")
def _():
    b = []
    pts = [(1, 2.2), (2, 2.4), (3, 4.1), (4, 3.6), (5, 5.4), (6, 5.0), (7, 6.9)]
    n = len(pts)
    mx = sum(p[0] for p in pts) / n
    my = sum(p[1] for p in pts) / n
    sl = sum((x - mx) * (y - my) for x, y in pts) / sum((x - mx) ** 2 for x, _ in pts)
    ic = my - sl * mx
    sc = 60
    sx = lambda x: 60 + x * 80
    sy = lambda y: 296 - y * 34
    b += [line(sx(0), sy(0), sx(8), sy(0), MUTED, 1.2), line(sx(0), sy(0), sx(0), sy(8), MUTED, 1.2)]
    for x, y in pts:
        yh = ic + sl * x
        side = abs(sy(y) - sy(yh))
        top = min(sy(y), sy(yh))
        b.append(rect(sx(x), top, side, side, PINK, PINK, 0, 1, op=0.18))
        b.append(line(sx(x), sy(y), sx(x), sy(yh), PINK, 2))
    b.append(path(f"M{sx(0.3)},{sy(ic + sl * 0.3)} L{sx(7.7)},{sy(ic + sl * 7.7)}", ACC, 2.6))
    for x, y in pts:
        b.append(circle(sx(x), sy(y), 5.5, CYAN))
    b.append(text(sx(7.7), sy(ic + sl * 7.7) - 22, "최소제곱 직선", 13, ACC, "end", 700))
    b.append(text(560, 220, "세로 막대 = 잔차", 13, PINK, "start", 700))
    b.append(text(560, 246, "정사각형 넓이 합이\n가장 작은 직선", 13, INK, "start", 600))
    return svg(720, 320, b, "최소제곱법")


@fig("st07-r-squared")
def _():
    b = []
    x0, w = 160, 500
    b.append(text(140, 60, "전체 흩어짐", 14, INK, "end", 700))
    b.append(rect(x0, 40, w, 40, INK2, INK2, 6, 1, op=0.35))
    b.append(text(x0 + w / 2, 60, "평균에서 잰 제곱합 = 100%", 13, INK, weight=700))
    b.append(text(140, 140, "직선을 쓴 뒤", 14, INK, "end", 700))
    b.append(rect(x0, 120, w * 0.76, 40, ACC, ACC, 6, 1, op=0.4))
    b.append(rect(x0 + w * 0.76, 120, w * 0.24, 40, PINK, PINK, 6, 1, op=0.4))
    b.append(text(x0 + w * 0.38, 140, "직선이 설명한 부분 76%", 13, INK, weight=700))
    b.append(text(x0 + w * 0.88, 140, "잔차 24%", 13, INK, weight=700))
    b.append(path(f"M{x0},170 L{x0},178 L{x0 + w * 0.76},178 L{x0 + w * 0.76},170", ACC, 1.6))
    b.append(text(x0 + w * 0.38, 196, "R² = 0.76", 15, ACC, weight=700, mono=True))
    return svg(720, 214, b, "결정계수 R²")


@fig("st07-residual-patterns")
def _():
    b = []
    titles = [("고른 띠: 좋음", PASS), ("U자 곡선: 직선이 안 맞음", FAIL), ("깔때기: 흩어짐이 일정치 않음", WARN)]
    for k, (t, c) in enumerate(titles):
        x0 = 14 + k * 238
        b.append(rect(x0, 14, 222, 210, SURF, LINE2, 10))
        b.append(text(x0 + 111, 34, t, 12, c, weight=700))
        zy = 135
        b.append(line(x0 + 14, zy, x0 + 208, zy, ACC, 1.2, "4 3"))
        g = gauss_pts(30, 100 + k)
        for i in range(30):
            u = i / 29
            if k == 0:
                r = g[i] * 18
            elif k == 1:
                r = (u - 0.5) ** 2 * 260 - 20 + g[i] * 6
            else:
                r = g[i] * (4 + u * 34)
            b.append(circle(x0 + 20 + u * 182, max(min(zy - r, 216), 50), 3.8, INK2, op=0.85))
    b.append(text(366, 240, "가로: x 또는 예측값 · 세로: 잔차 · 점선: 잔차 0", 12, MUTED))
    return svg(730, 254, b, "잔차 그래프의 세 가지 모양")


# ---------------- st-08 A/B ----------------
@fig("st08-ab-flow")
def _():
    b = []
    b.append(box(14, 110, 110, 60, "방문자들", stroke=INK2, size=14))
    b.append(arrow(126, 140, 160, 140, MUTED, 1.6))
    b.append(circle(196, 140, 32, SURF3, ACC, 1.8))
    b.append(text(196, 134, "동전", 13, ACC, weight=700))
    b.append(text(196, 152, "던지기", 11, ACC, weight=600))
    b.append(text(196, 190, "무작위 배정", 12, ACC, weight=700))
    b.append(arrow(226, 126, 286, 70, MUTED, 1.6))
    b.append(arrow(226, 154, 286, 210, MUTED, 1.6))
    b.append(box(290, 40, 140, 60, "A 그룹\n기존 버전", stroke=CYAN, color=CYAN, size=13))
    b.append(box(290, 180, 140, 60, "B 그룹\n새 버전", stroke=PINK, color=PINK, size=13))
    b.append(arrow(432, 70, 470, 70, MUTED, 1.6))
    b.append(arrow(432, 210, 470, 210, MUTED, 1.6))
    b.append(box(474, 46, 100, 48, "전환율 4.0%", stroke=CYAN, color=CYAN, size=12))
    b.append(box(474, 186, 100, 48, "전환율 5.5%", stroke=PINK, color=PINK, size=12))
    b.append(arrow(576, 72, 600, 126, MUTED, 1.6))
    b.append(arrow(576, 208, 600, 154, MUTED, 1.6))
    b.append(box(600, 110, 110, 60, "검정 +\n신뢰구간", stroke=ACC, color=ACC, size=13))
    b.append(text(360, 140, "같은 기간 · 하나만 다르게", 12, MUTED, weight=600))
    return svg(720, 250, b, "A/B 테스트 흐름")


@fig("st08-sample-size")
def _():
    from statistics import NormalDist
    za, zb = NormalDist().inv_cdf(0.975), NormalDist().inv_cdf(0.8)

    def n_per(d, p1=0.04):
        p2 = p1 + d
        pb = (p1 + p2) / 2
        return math.ceil((za * math.sqrt(2 * pb * (1 - pb)) + zb * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / d ** 2)

    b = []
    x0, y0, w, h = 90, 20, 580, 230
    sx = lambda d: x0 + (d - 0.3) / 1.9 * w
    sy = lambda n: y0 + h - n / 30000 * h
    b += [line(x0, y0 + h, x0 + w, y0 + h, MUTED, 1.2), line(x0, y0, x0, y0 + h, MUTED, 1.2)]
    for n in (0, 10000, 20000, 30000):
        b.append(text(x0 - 8, sy(n), f"{n:,}", 11, MUTED, "end", mono=True))
        b.append(line(x0, sy(n), x0 + w, sy(n), LINE, 1, "3 4"))
    for d in (0.5, 1.0, 1.5, 2.0):
        b.append(text(sx(d), y0 + h + 16, f"{d:g}%p", 11, MUTED, mono=True))
    ds = [0.45 + i * 0.0155 for i in range(101)]
    b.append(path("M" + " L".join(f"{sx(d):.1f},{max(sy(n_per(d / 100)), y0):.1f}" for d in ds), ACC, 2.6))
    for d in (0.5, 1.0, 1.5, 2.0):
        n = n_per(d / 100)
        b.append(circle(sx(d), sy(n), 5.5, PINK))
        b.append(text(sx(d) + 10, sy(n) - 14, f"{n:,}명", 12, PINK, "start", 700))
    b.append(text(x0 + w / 2, y0 + h + 36, "검출할 차이 (기준 전환율 4%)", 12, MUTED))
    b.append(text(26, y0 + h / 2, "그룹당 n", 12, MUTED))
    return svg(720, 296, b, "검출할 차이와 필요한 표본 수")


# ---------------- st-10 ----------------
@fig("st10-confounder")
def _():
    b = []
    b.append(box(260, 20, 200, 56, "더운 날씨", stroke=WARN, color=WARN, size=16))
    b.append(box(40, 190, 200, 56, "아이스크림 판매", stroke=CYAN, color=CYAN, size=15))
    b.append(box(480, 190, 200, 56, "물놀이 사고", stroke=PINK, color=PINK, size=15))
    b.append(arrow(300, 78, 170, 186, WARN, 2.2))
    b.append(arrow(420, 78, 550, 186, WARN, 2.2))
    b.append(text(196, 124, "원인", 12, WARN, weight=700))
    b.append(text(524, 124, "원인", 12, WARN, weight=700))
    b.append(line(244, 218, 476, 218, MUTED, 1.8, "6 5"))
    b.append(circle(360, 218, 16, SURF3, MUTED, 1.4))
    b.append(text(360, 218, "?", 16, INK, weight=700))
    b.append(text(360, 256, "상관은 있지만 원인 아님", 13, MUTED, weight=600))
    return svg(720, 276, b, "교란변수")


@fig("st10-simpson")
def _():
    b = []
    groups = [(160, 90, CYAN, "Adelie"), (330, 150, TRACK, "Chinstrap"), (500, 210, ORANGE, "Gentoo")]
    for gi, (cx, cy, c, name) in enumerate(groups):
        gx, gy = gauss_pts(16, 200 + gi), gauss_pts(16, 300 + gi)
        for i in range(16):
            x = gx[i] * 34
            y = -0.7 * x + gy[i] * 12
            b.append(circle(cx + x, cy + y, 4, c, op=0.8))
        b.append(path(f"M{cx - 60},{cy + 42} L{cx + 60},{cy - 42}", c, 2.6))
        b.append(text(cx + 70, cy - 52, name, 12, c, "start", 700))
    b.append(path("M90,50 L600,260", INK, 2, dash="8 6"))
    b.append(text(610, 276, "합치면: 기울기 −", 13, INK, "end", 700))
    b.append(text(40, 286, "각 종 안에서는 기울기 +", 13, ACC, "start", 700))
    return svg(720, 300, b, "심슨의 역설")


@fig("st10-report-frame")
def _():
    b = []
    cells = [("1", "무엇을 봤나", "대상 · 표본 수 · 비교한 것", INK2),
             ("2", "얼마나 다른가", "요약값 · 차이 · 효과 크기", ACC),
             ("3", "얼마나 확실한가", "신뢰구간 · p-value", CYAN),
             ("4", "그래서 무엇을", "해석 · 한계 · 행동", PINK)]
    for i, (n, t, d, c) in enumerate(cells):
        x, y = 20 + (i % 2) * 350, 20 + (i // 2) * 110
        b.append(rect(x, y, 330, 94, SURF3, c, 10, 1.6))
        b.append(circle(x + 30, y + 30, 15, c))
        b.append(text(x + 30, y + 30, n, 14, "#121516", weight=800))
        b.append(text(x + 58, y + 30, t, 16, c, "start", 700))
        b.append(text(x + 58, y + 64, d, 13, INK, "start", 500))
    return svg(720, 244, b, "결과 보고의 네 칸")


# ---------------- 2026-11-07 검정 도구 상자 ----------------
@fig("st12-qq-patterns")
def _():
    b = []
    pats = [("정규에 가까움", "점이 직선 위", lambda z: z, PASS),
            ("오른쪽 꼬리가 김", "아래로 볼록 (양 끝이 위로)", lambda z: 1.2 * (math.exp(0.6 * z) - 1.15), ORANGE),
            ("양쪽 꼬리가 두꺼움", "S자를 뒤집은 모양", lambda z: 0.8 * z + 0.1 * z ** 3, FAIL),
            ("양쪽 꼬리가 얇음 (균등)", "S자 모양", lambda z: 1.9 * math.tanh(0.75 * z), CYAN)]
    for i, (title, sub, f, col) in enumerate(pats):
        ox = 15 + i * 200
        b.append(rect(ox, 10, 185, 210, SURF, LINE2, 10))
        b.append(text(ox + 92, 30, title, 13, col, weight=700))
        x0, y0, s = ox + 92, 125, 30
        b.append(line(x0 - 75, y0 + 75, x0 + 75, y0 - 75, LINE2, 1.4, "5 4"))
        for k in range(15):
            z = -2.2 + k * 4.4 / 14
            y = max(-2.6, min(2.6, f(z)))
            b.append(circle(x0 + z * s, y0 - y * s, 3.6, col, op=0.9))
        b.append(text(ox + 92, 206, sub, 11, INK2))
    b.append(text(410, 238, "가로: 정규분포라면 나올 값 (이론 분위수)   세로: 실제 데이터 값 (정렬)", 12, MUTED))
    return svg(820, 252, b, "Q-Q 플롯의 네 가지 모양: 직선, 아래로 볼록, 뒤집은 S, S")


@fig("st12-interaction")
def _():
    b = []
    panels = [("교호작용 없음: 평행", [(0.25, 0.55), (0.55, 0.85)], PASS),
              ("교호작용 있음: 간격이 다름", [(0.25, 0.40), (0.45, 0.90)], WARN),
              ("교호작용 강함: 엇갈림", [(0.30, 0.75), (0.75, 0.35)], FAIL)]
    for i, (title, lines_, col) in enumerate(panels):
        ox = 15 + i * 250
        b.append(rect(ox, 10, 235, 220, SURF, LINE2, 10))
        b.append(text(ox + 117, 30, title, 13, col, weight=700))
        x1, x2, y0, h = ox + 50, ox + 190, 200, 150
        b.append(line(ox + 30, y0, ox + 215, y0, LINE2, 1.2))
        b.append(text(x1, y0 + 14, "요인 A: 수준 1", 10, INK2))
        b.append(text(x2, y0 + 14, "수준 2", 10, INK2))
        for (a1, a2), c, lab in zip(lines_, [CYAN, TRACK], ["B = 1", "B = 2"]):
            b.append(line(x1, y0 - a1 * h, x2, y0 - a2 * h, c, 2.6))
            b.append(circle(x1, y0 - a1 * h, 5, c))
            b.append(circle(x2, y0 - a2 * h, 5, c))
            b.append(text(x2 + 8, y0 - a2 * h, lab, 11, c, "start", 700))
    return svg(770, 240, b, "교호작용 그래프: 평행하면 교호작용 없음, 간격이 다르거나 엇갈리면 교호작용 있음")


@fig("st12-test-map")
def _():
    b = []
    # 3 columns by data type; rows: 2 groups indep / 2 groups paired / 3+ indep / 3+ paired / relation
    cols = [("연속형 · 정규에 가까움", ACC), ("연속형 · 치우침 / 순서형", CYAN), ("범주형 (비율 · 도수)", ORANGE)]
    rows = ["1그룹 vs 기준값", "2그룹 · 독립", "2그룹 · 대응", "3그룹 이상 · 독립", "3그룹 이상 · 대응", "두 변수의 관계"]
    cells = [
        ["1표본 t (σ를 알면 z)", "부호검정 · 윌콕슨 부호순위", "이항 · 1비율 z · 적합도 χ²"],
        ["Welch t", "맨-휘트니 U", "2비율 z · χ² · 피셔 정확"],
        ["대응 t", "윌콕슨 부호순위 · 부호검정", "McNemar"],
        ["ANOVA (+Tukey) · 이원 ANOVA", "크루스칼-월리스", "χ² 독립성"],
        ["반복측정 ANOVA", "프리드먼", "코크런 Q"],
        ["피어슨 r · 회귀 F", "스피어만 · 켄달", "χ² 독립성 · 크래머 V"],
    ]
    x0, w0, w, h, y0 = 10, 150, 225, 46, 66
    for j, (t, c) in enumerate(cols):
        x = x0 + w0 + 10 + j * (w + 10)
        b.append(rect(x, 10, w, 46, SURF3, c, 8, 1.8))
        b.append(text(x + w / 2, 33, t, 14, c, weight=700))
    for i, r in enumerate(rows):
        y = y0 + i * (h + 8)
        b.append(rect(x0, y, w0, h, SURF, LINE2, 8))
        b.append(text(x0 + w0 / 2, y + h / 2, r, 13, INK, weight=700))
        for j, (t, c) in enumerate(cols):
            x = x0 + w0 + 10 + j * (w + 10)
            b.append(rect(x, y, w, h, SURF, c, 8, 1.0, op=1))
            b.append(text(x + w / 2, y + h / 2, cells[i][j], 13, INK, weight=600))
    yb = y0 + len(rows) * (h + 8) + 6
    b.append(text(437, yb + 6, "검정 전 확인: 정규성은 Q-Q 플롯 · 샤피로, 등분산은 레빈   |   여러 번 검정하면: Holm · BH 보정", 12, MUTED))
    return svg(875, yb + 22, b, "검정 고르기 지도: 데이터 종류(열)와 그룹 구조(행)로 검정을 고른다")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, f in FIGS.items():
        with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as fh:
            fh.write(f())
    print(f"{len(FIGS)} figures -> {os.path.normpath(OUT)}")
