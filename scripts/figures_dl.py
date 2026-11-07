"""딥러닝 트랙 레슨 도식(SVG) 생성기.

python3 scripts/figures_dl.py  ->  content/img/dl/*.svg
그리기 도우미와 색은 figures_ml.py와 같은 것을 쓴다. 딥러닝 트랙은 실행 셀이 없어서
그림이 설명의 중심이다. 그림 속 숫자는 레슨 본문의 손 계산과 같아야 한다.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from figures_ml import (ACC, CYAN, FAIL, INK, INK2, LINE, LINE2, MUTED, ORANGE, PASS, SURF, SURF3, TRACK, WARN,  # noqa: E402
                        arrow, box, circle, line, path, pseudo, rect, svg, text)

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "dl")
PINK = "#ff8fcf"
DARK = "#121516"
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def curve(f, a, b, sx, sy, n=120):
    pts = [a + (b - a) * i / n for i in range(n + 1)]
    return "M" + " L".join(f"{sx(x):.1f},{sy(f(x)):.1f}" for x in pts)


def sigmoid(z):
    return 1 / (1 + math.exp(-z))


def node(cx, cy, label="", c=CYAN, r=20, size=13, fill=SURF3):
    return circle(cx, cy, r, fill, c, 1.8) + (text(cx, cy, label, size, c, weight=700) if label else "")


def edge(x1, y1, x2, y2, r1=20, r2=20, color=LINE2, sw=1.2, accent=False, head=False):
    d = math.hypot(x2 - x1, y2 - y1)
    ux, uy = (x2 - x1) / d, (y2 - y1) / d
    a, b2 = (x1 + ux * r1, y1 + uy * r1), (x2 - ux * r2, y2 - uy * r2)
    if head:
        return arrow(a[0], a[1], b2[0], b2[1], color, sw, accent=accent)
    return line(a[0], a[1], b2[0], b2[1], color, sw)


def grid(x0, y0, vals, cs, colors=None, size=13, hi=None, hic=ACC):
    """숫자 격자. vals: 2차원 리스트. hi: 강조할 (i, j) 집합."""
    b = []
    for i, row in enumerate(vals):
        for j, v in enumerate(row):
            on = hi is not None and (i, j) in hi
            f = colors(v) if colors else SURF3
            b.append(rect(x0 + j * cs, y0 + i * cs, cs, cs, f, hic if on else LINE2, 0, 2 if on else 1))
            b.append(text(x0 + j * cs + cs / 2, y0 + i * cs + cs / 2, v, size, INK, weight=600, mono=True))
    return b


def axes(x0, y0, x1, y1, xl="", yl=""):
    b = [line(x0, y1, x1, y1, LINE2, 1.4), line(x0, y1, x0, y0, LINE2, 1.4)]
    if xl:
        b.append(text(x1, y1 + 34, xl, 12, MUTED, "end"))
    if yl:
        b.append(text(x0 - 6, y0 - 10, yl, 12, MUTED, "start"))
    return b


# ---------------- dl-00 ----------------
@fig("dl00-ml-vs-dl")
def _():
    b = []
    b.append(rect(10, 10, 760, 130, SURF, LINE2, 10))
    b.append(text(30, 34, "전통 머신러닝 — 특징은 사람이 만든다", 15, CYAN, "start", 700))
    b.append(box(30, 58, 120, 60, "사진\n(숫자 격자)", size=13))
    b.append(arrow(156, 88, 196, 88))
    b.append(box(202, 54, 210, 68, "사람이 특징 설계\n귀 모양 · 털 무늬 · 색 …", stroke=WARN, color=WARN, size=13))
    b.append(arrow(418, 88, 458, 88))
    b.append(box(464, 58, 140, 60, "모델\n(트리 · 로지스틱)", stroke=CYAN, color=CYAN, size=13))
    b.append(arrow(610, 88, 650, 88))
    b.append(box(656, 64, 100, 48, "고양이?", stroke=ACC, color=ACC, size=14))
    b.append(rect(10, 156, 760, 156, SURF, LINE2, 10))
    b.append(text(30, 180, "딥러닝 — 특징도 모델이 데이터에서 배운다", 15, ACC, "start", 700))
    b.append(box(30, 210, 120, 60, "사진\n(숫자 격자)", size=13))
    b.append(arrow(156, 240, 196, 240, ACC, accent=True))
    b.append(rect(202, 200, 402, 80, SURF3, ACC, 10, 1.6))
    for k, (lab, c) in enumerate([("층 1\n선 · 점", INK2), ("층 2\n모양", INK2), ("층 3\n부품", INK2), ("판단", ACC)]):
        x = 218 + k * 96
        b.append(box(x, 214, 82, 52, lab, fill=DARK, stroke=c, color=c, size=12))
        if k < 3:
            b.append(arrow(x + 84, 240, x + 94, 240, MUTED, 1.4))
    b.append(text(403, 296, "신경망 하나가 특징 만들기 + 판단을 함께 배운다", 12, MUTED))
    b.append(arrow(610, 240, 650, 240, ACC, accent=True))
    b.append(box(656, 216, 100, 48, "고양이?", stroke=ACC, color=ACC, size=14))
    return svg(780, 322, b, "전통 머신러닝과 딥러닝의 차이")


@fig("dl00-hierarchy")
def _():
    b = []
    cols = [("입력", "픽셀 숫자", INK2), ("층 1", "선 · 모서리", CYAN), ("층 2", "곡선 · 모양", TRACK), ("층 3", "눈 · 귀 · 코", ORANGE), ("출력", "고양이 0.94", ACC)]
    for k, (t, d, c) in enumerate(cols):
        x = 20 + k * 150
        b.append(rect(x, 40, 126, 126, SURF3, c, 10, 1.6))
        b.append(text(x + 63, 22, t, 14, c, weight=700))
        b.append(text(x + 63, 186, d, 13, INK, weight=600))
        cx, cy = x + 63, 103
        if k == 0:
            r = pseudo(36, 5)
            for i in range(6):
                for j in range(6):
                    g = int(60 + r[i * 6 + j] * 150)
                    b.append(f'<rect x="{x + 15 + j * 16}" y="{55 + i * 16}" width="15" height="15" fill="rgb({g},{g},{g})"/>')
        elif k == 1:
            for (x1, y1, x2, y2) in [(-40, -30, -10, -30), (-40, 0, -40, 35), (5, -40, 40, -10), (10, 20, 45, 20), (-20, 15, -5, 40)]:
                b.append(path(f"M{cx + x1},{cy + y1} L{cx + x2},{cy + y2}", c, 3))
        elif k == 2:
            b.append(path(f"M{cx - 40},{cy + 10} Q{cx - 20},{cy - 40} {cx},{cy + 10}", c, 3))
            b.append(circle(cx + 22, cy - 18, 14, "none", c, 3))
            b.append(path(f"M{cx - 10},{cy + 36} L{cx + 10},{cy + 22} L{cx + 30},{cy + 36}", c, 3))
        elif k == 3:
            b.append(path(f"M{cx - 38},{cy - 20} L{cx - 28},{cy - 48} L{cx - 14},{cy - 26}", c, 3))
            b.append(path(f"M{cx + 14},{cy - 26} L{cx + 28},{cy - 48} L{cx + 38},{cy - 20}", c, 3))
            b.append(circle(cx - 16, cy, 7, c))
            b.append(circle(cx + 16, cy, 7, c))
            b.append(path(f"M{cx - 6},{cy + 18} L{cx},{cy + 24} L{cx + 6},{cy + 18}", c, 3))
        else:
            b.append(circle(cx, cy + 6, 38, "none", c, 3))
            b.append(path(f"M{cx - 34},{cy - 14} L{cx - 26},{cy - 50} L{cx - 8},{cy - 30}", c, 3))
            b.append(path(f"M{cx + 8},{cy - 30} L{cx + 26},{cy - 50} L{cx + 34},{cy - 14}", c, 3))
            b.append(circle(cx - 14, cy, 5, c))
            b.append(circle(cx + 14, cy, 5, c))
        if k < 4:
            b.append(arrow(x + 128, 103, x + 148, 103, MUTED, 1.6))
    b.append(text(380, 218, "뒤 층으로 갈수록 앞 층이 찾은 것을 조합해 더 큰 개념을 본다", 13, MUTED))
    return svg(760, 234, b, "층이 쌓일수록 추상화되는 표현")


@fig("dl00-timeline")
def _():
    b = []
    y = 120
    b.append(line(30, y, 750, y, LINE2, 2))
    ev = [(60, "1958", "퍼셉트론", "뉴런 하나", CYAN, -1),
          (165, "1969", "첫 번째 겨울", "XOR을 못 푼다", FAIL, 1),
          (270, "1986", "역전파", "층을 쌓아 학습", CYAN, -1),
          (375, "1990s", "두 번째 겨울", "깊으면 안 배운다", FAIL, 1),
          (480, "2012", "딥러닝 부활", "이미지 대회 압승", ACC, -1),
          (585, "2017", "Transformer", "어텐션", TRACK, 1),
          (690, "2020s", "대규모 언어 모델", "챗봇 · 생성 AI", ORANGE, -1)]
    for x, yr, t, d, c, side in ev:
        b.append(circle(x, y, 8, c))
        yy = y - 58 if side < 0 else y + 58
        b.append(line(x, y - 10, x, yy + 34, c, 1.2, "3 3") if side < 0 else line(x, y + 10, x, yy - 26, c, 1.2, "3 3"))
        b.append(text(x, yy - 14, yr, 13, c, weight=800, mono=True))
        b.append(text(x, yy + 6, t, 13, INK, weight=700))
        b.append(text(x, yy + 24, d, 11, MUTED))
    return svg(780, 240, b, "인공신경망의 역사")


@fig("dl00-track-map")
def _():
    b = []
    days = [("01", "시작하기", INK2), ("02", "뉴런 · 활성화", CYAN), ("03", "손실 · 경사하강", CYAN), ("04", "순전파 · 역전파", CYAN), ("05", "MLP · 과적합", CYAN),
            ("06", "CNN · 이미지", TRACK), ("07", "RNN · 순서", TRACK), ("08", "어텐션 · LLM", TRACK), ("09", "생성 모델", ORANGE), ("10", "실무 · 전이 학습", ACC)]
    for k, (d, t, c) in enumerate(days):
        col, row = k % 5, k // 5
        x = 20 + col * 150 if row == 0 else 20 + (4 - col) * 150
        y = 30 + row * 120
        b.append(rect(x, y, 128, 70, SURF3, c, 12, 1.6))
        b.append(text(x + 64, y + 22, "DAY " + d, 12, c, weight=800, mono=True))
        b.append(text(x + 64, y + 48, t, 13, INK, weight=700))
        if k < 9:
            if col < 4:
                if row == 0:
                    b.append(arrow(x + 130, y + 35, x + 148, y + 35, MUTED, 1.4))
                else:
                    b.append(arrow(x - 2, y + 35, x - 20, y + 35, MUTED, 1.4))
            else:
                b.append(arrow(x + 64, y + 72, x + 64, y + 118, MUTED, 1.4))
    b.append(text(20, 238, "기초 원리", 12, CYAN, "start", 700))
    b.append(text(110, 238, "데이터 모양별 구조", 12, TRACK, "start", 700))
    b.append(text(250, 238, "만드는 모델", 12, ORANGE, "start", 700))
    b.append(text(350, 238, "실제로 쓰기", 12, ACC, "start", 700))
    return svg(760, 250, b, "딥러닝 트랙 지도")


# ---------------- dl-01 ----------------
@fig("dl01-neuron")
def _():
    b = []
    ins = [("x₁", "날씨 좋음", "w₁ = 3"), ("x₂", "친구도 감", "w₂ = 2"), ("x₃", "거리가 멂", "w₃ = −4")]
    for k, (x, d, w) in enumerate(ins):
        y = 60 + k * 80
        b.append(node(110, y, x, CYAN, 24, 15))
        b.append(text(70, y, d, 12, MUTED, "end"))
        b.append(edge(110, y, 330, 140, 24, 44, MUTED, 1.6, head=True))
        b.append(text(200, y + (140 - y) * 0.36 + (14 if k == 2 else -12), w, 13, WARN, weight=700, mono=True))
    b.append(circle(330, 140, 44, SURF3, ACC, 2))
    b.append(text(330, 128, "Σ", 26, ACC, weight=700))
    b.append(text(330, 158, "+ b (−2)", 12, ACC, weight=700))
    b.append(text(330, 206, "① 가중합 z", 13, ACC, weight=700))
    b.append(arrow(376, 140, 446, 140, ACC, 2, accent=True))
    b.append(text(411, 124, "z", 14, ACC, weight=700, mono=True))
    b.append(rect(450, 104, 110, 72, SURF3, TRACK, 10, 1.8))
    b.append(path("M466,160 L500,160 L500,122 L544,122", TRACK, 2.4))
    b.append(text(505, 206, "② 활성화 f(z)", 13, TRACK, weight=700))
    b.append(arrow(562, 140, 630, 140, TRACK, 2))
    b.append(box(634, 116, 96, 48, "간다(1)\n안 간다(0)", stroke=INK2, size=12))
    return svg(750, 260, b, "뉴런 하나의 계산: 가중합과 활성화")


@fig("dl01-activations")
def _():
    b = []
    fns = [("계단", lambda z: 1.0 if z > 0 else 0.0, INK2, "0 또는 1"),
           ("시그모이드", sigmoid, CYAN, "0 ~ 1"),
           ("tanh", math.tanh, TRACK, "−1 ~ 1"),
           ("ReLU", lambda z: max(0.0, z), ACC, "0 ~ ∞")]
    for k, (name, f, c, rng) in enumerate(fns):
        x0 = 15 + k * 186
        b.append(rect(x0, 10, 172, 200, SURF, LINE2, 10))
        b.append(text(x0 + 86, 32, name, 15, c, weight=700))
        sx = lambda z, x0=x0: x0 + 86 + z * 14
        sy = lambda v: 128 - v * 40
        b.append(line(x0 + 12, sy(0), x0 + 160, sy(0), LINE2))
        b.append(line(x0 + 86, 52, x0 + 86, 180, LINE2))
        b.append(line(x0 + 12, sy(1), x0 + 160, sy(1), LINE, 1, "3 3"))
        b.append(line(x0 + 12, sy(-1), x0 + 160, sy(-1), LINE, 1, "3 3"))
        if name == "계단":
            b.append(path(f"M{sx(-5)},{sy(0)} L{sx(0)},{sy(0)} M{sx(0)},{sy(1)} L{sx(5)},{sy(1)}", c, 2.6))
        elif name == "ReLU":
            b.append(path(f"M{sx(-5)},{sy(0)} L{sx(0)},{sy(0)} L{sx(1.9)},{sy(1.9)}", c, 2.6))
        else:
            b.append(path(curve(f, -5, 5, sx, sy), c, 2.6))
        b.append(text(x0 + 160, sy(1) - 8, "1", 10, MUTED, "end"))
        b.append(text(x0 + 160, sy(-1) + 10, "−1", 10, MUTED, "end"))
        b.append(text(x0 + 86, 196, "출력 " + rng, 12, INK, weight=600))
    return svg(760, 220, b, "활성화 함수 네 가지")


@fig("dl01-softmax")
def _():
    b = []
    scores = [("고양이", 2.0), ("개", 1.0), ("새", 0.0)]
    e = [math.exp(s) for _, s in scores]
    p = [v / sum(e) for v in e]
    b.append(text(150, 22, "출력층 점수 z", 14, MUTED, weight=700))
    b.append(text(560, 22, "소프트맥스 확률 (합 = 1)", 14, ACC, weight=700))
    for k, (name, s) in enumerate(scores):
        y = 50 + k * 56
        b.append(text(60, y + 16, name, 14, INK, "end", 600))
        b.append(rect(72, y, s * 70 + 4, 32, CYAN, CYAN, 4, 1, op=0.5))
        b.append(text(72 + s * 70 + 14, y + 16, f"{s:.0f}", 14, CYAN, "start", 700, mono=True))
        b.append(text(470, y + 16, name, 14, INK, "end", 600))
        b.append(rect(482, y, p[k] * 260, 32, ACC, ACC, 4, 1, op=0.5))
        b.append(text(482 + p[k] * 260 + 10, y + 16, f"{p[k]:.2f}", 14, ACC, "start", 700, mono=True))
    b.append(arrow(260, 106, 380, 106, ACC, 2.2, accent=True))
    b.append(text(320, 82, "eᶻ로 키우고\n합으로 나누기", 12, ACC, weight=700))
    return svg(780, 220, b, "소프트맥스: 점수를 확률로")


def xor_panel(x0, title, pos, c, cut=None, note=""):
    b = [rect(x0, 10, 220, 230, SURF, LINE2, 10), text(x0 + 110, 32, title, 15, c, weight=700)]
    sx = lambda v: x0 + 50 + v * 120
    sy = lambda v: 200 - v * 130
    b.append(line(sx(-0.2), sy(0), sx(1.25), sy(0), LINE2))
    b.append(line(sx(0), sy(-0.15), sx(0), sy(1.2), LINE2))
    for (u, v) in [(0, 0), (0, 1), (1, 0), (1, 1)]:
        on = (u, v) in pos
        b.append(circle(sx(u), sy(v), 11, ACC if on else DARK, ACC if on else FAIL, 2.4))
        b.append(text(sx(u) + 22, sy(v) - 14, f"({u},{v})", 10, MUTED, mono=True))
    if cut:
        (a1, b1), (a2, b2) = cut
        b.append(line(sx(a1), sy(b1), sx(a2), sy(b2), WARN, 2.2, "6 4"))
    b.append(text(x0 + 110, 226, note, 12, WARN if cut else FAIL, weight=700))
    return b


@fig("dl01-xor")
def _():
    b = []
    b += xor_panel(10, "AND", {(1, 1)}, CYAN, ((0.3, 1.25), (1.25, 0.3)), "직선 하나로 나뉨")
    b += xor_panel(250, "OR", {(0, 1), (1, 0), (1, 1)}, CYAN, ((-0.2, 0.7), (0.7, -0.15)), "직선 하나로 나뉨")
    b += xor_panel(490, "XOR", {(0, 1), (1, 0)}, FAIL, None, "어떤 직선으로도 안 나뉨")
    b.append(circle(30, 262, 7, ACC))
    b.append(text(44, 262, "출력 1", 12, INK, "start"))
    b.append(circle(110, 262, 7, DARK, FAIL, 2.2))
    b.append(text(124, 262, "출력 0", 12, INK, "start"))
    return svg(720, 278, b, "AND, OR, XOR")


@fig("dl01-xor-hidden")
def _():
    b = []
    b.append(rect(10, 10, 300, 270, SURF, LINE2, 10))
    b.append(text(160, 32, "입력 공간 (x₁, x₂)", 14, MUTED, weight=700))
    sx = lambda v: 80 + v * 150
    sy = lambda v: 220 - v * 150
    for (u, v) in [(0, 0), (0, 1), (1, 0), (1, 1)]:
        on = u != v
        b.append(circle(sx(u), sy(v), 11, ACC if on else DARK, ACC if on else FAIL, 2.4))
        b.append(text(sx(u), sy(v) + 24, f"({u},{v})", 11, MUTED, mono=True))
    b.append(arrow(318, 135, 410, 135, ACC, 2.4, accent=True))
    b.append(text(364, 104, "은닉층", 13, ACC, weight=700))
    b.append(text(364, 162, "h₁ = OR\nh₂ = NAND", 12, INK2, weight=600))
    b.append(rect(418, 10, 300, 270, SURF, LINE2, 10))
    b.append(text(568, 32, "은닉 공간 (h₁, h₂)", 14, ACC, weight=700))
    sx2 = lambda v: 490 + v * 150
    pts = {(0, 1): "(0,0)", (1, 1): "(0,1) (1,0)", (1, 0): "(1,1)"}
    for (u, v), lab in pts.items():
        on = (u, v) == (1, 1)
        b.append(circle(sx2(u), sy(v), 11, ACC if on else DARK, ACC if on else FAIL, 2.4))
        b.append(text(sx2(u), sy(v) + 24, lab, 11, MUTED, mono=True))
    b.append(line(sx2(0.45), sy(1.08), sx2(1.08), sy(0.45), WARN, 2.2, "6 4"))
    b.append(text(568, 266, "이제 직선 하나로 나뉜다", 12, WARN, weight=700))
    return svg(730, 290, b, "은닉층이 점을 새 공간으로 옮긴다")


# ---------------- dl-02 ----------------
@fig("dl02-crossentropy")
def _():
    b = []
    x0, x1, y0, y1 = 70, 650, 30, 250
    b += axes(x0, y0, x1, y1, "정답에 준 확률 p", "손실 −log p")
    sx = lambda p: x0 + (p - 0.0) / 1.0 * (x1 - x0)
    sy = lambda v: y1 - v / 4.8 * (y1 - y0)
    b.append(path(curve(lambda p: -math.log(p), 0.0085, 1.0, sx, sy, 200), ACC, 2.8))
    for p, c in [(0.9, PASS), (0.5, WARN), (0.1, FAIL)]:
        v = -math.log(p)
        b.append(line(sx(p), y1, sx(p), sy(v), c, 1.2, "4 3"))
        b.append(circle(sx(p), sy(v), 6, c))
        b.append(text(sx(p) + 10, sy(v) - 12, f"p = {p} → {v:.3f}", 13, c, "start", 700))
    for t in (0, 0.25, 0.5, 0.75, 1.0):
        b.append(text(sx(t), y1 + 16, f"{t}", 11, MUTED))
    b.append(text(sx(0.55), 60, "정답을 낮게 볼수록(자신 있게 틀릴수록) 벌점이 폭발", 13, INK2, weight=600))
    return svg(700, 300, b, "교차엔트로피 손실")


def bowl(x0, w, h, y0):
    """화면 좌표에서 L=(w-3)^2 그릇. 0~6 범위."""
    sx = lambda v: x0 + v / 6.6 * w
    sy = lambda L: y0 + h - L / 12 * h
    return sx, sy


@fig("dl02-gd-bowl")
def _():
    b = []
    sx, sy = bowl(60, 600, 230, 20)
    b += axes(60, 20, 660, 250, "가중치 w", "손실 L")
    b.append(path(curve(lambda w: (w - 3) ** 2, -0.3, 6.3, sx, lambda L: sy(min(L, 12))), CYAN, 2.6))
    ws = [0.0, 0.6, 1.08, 1.464]
    for k, w in enumerate(ws):
        L = (w - 3) ** 2
        b.append(circle(sx(w), sy(L), 9, ACC if k == 0 else ORANGE, op=1 - k * 0.15))
        b.append(text(sx(w) + 14, sy(L) - 8, f"w={w:g}", 11, INK, "start", mono=True))
        if k < 3:
            w2 = ws[k + 1]
            b.append(arrow(sx(w) + 8, sy(L) + 6, sx(w2) - 8, sy((w2 - 3) ** 2) - 4, ACC, 1.8, accent=True))
    b.append(circle(sx(3), sy(0), 6, PASS))
    b.append(text(sx(3), sy(0) + 16, "가장 낮은 곳 (w = 3)", 12, PASS, weight=700))
    b.append(line(sx(0) - 30, sy(9) - 36, sx(0) + 30, sy(9) + 36, WARN, 2))
    b.append(text(sx(0) + 70, sy(9) - 40, "기울기 −6 : 오른쪽이 내리막", 12, WARN, "start", 700))
    return svg(700, 296, b, "경사하강법: 기울기 반대로 한 걸음씩")


@fig("dl02-lr-compare")
def _():
    b = []
    cases = [("학습률 작음 (0.01)", [0, 0.06, 0.119, 0.176, 0.233], CYAN, "너무 느림"),
             ("학습률 적당 (0.1)", [0, 0.6, 1.08, 1.464, 1.771, 2.017, 2.214], PASS, "차근차근 도착"),
             ("학습률 큼 (1.1)", [0, 6.6, -1.32, 8.18], FAIL, "튕겨 나감 (발산)")]
    for k, (t, ws, c, note) in enumerate(cases):
        x0 = 10 + k * 245
        b.append(rect(x0, 10, 230, 230, SURF, LINE2, 10))
        b.append(text(x0 + 115, 32, t, 13, c, weight=700))
        sx = lambda v, x0=x0: x0 + 20 + (v + 2) / 12 * 190
        sy = lambda L: 210 - min(L, 40) / 40 * 160
        b.append(path(curve(lambda w: (w - 3) ** 2, -2, 8.3, sx, sy), LINE2, 2))
        pts = [(sx(w), sy((w - 3) ** 2)) for w in ws]
        b.append(path("M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts), c, 1.6, dash="4 3"))
        for i, (x, y) in enumerate(pts):
            b.append(circle(x, y, 5 if i else 7, c))
        b.append(text(x0 + 115, 226, note, 12, c, weight=700))
    return svg(750, 250, b, "학습률에 따른 차이")


def contour(cx, cy, rx, ry, n=4):
    out = []
    for k in range(1, n + 1):
        out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx * k / n:.1f}" ry="{ry * k / n:.1f}" fill="none" stroke="{LINE2}" stroke-width="1.2"/>')
    return out


@fig("dl02-batch-paths")
def _():
    b = []
    cases = [("배치 (전부 보고 한 걸음)", CYAN, "M40,160 C70,120 110,90 150,90", "곧지만 한 걸음이 무겁다"),
             ("SGD (하나 보고 한 걸음)", FAIL, None, "가볍지만 지그재그"),
             ("미니배치 (몇십 개씩)", ACC, None, "적당히 곧고 빠르다 · 표준")]
    for k, (t, c, d, note) in enumerate(cases):
        x0 = 10 + k * 245
        b.append(rect(x0, 10, 230, 220, SURF, LINE2, 10))
        b.append(text(x0 + 115, 32, t, 13, c, weight=700))
        cx, cy = x0 + 140, 116
        b += contour(cx, cy, 82, 62)
        b.append(circle(cx, cy, 5, PASS))
        r = pseudo(40, 3 + k)
        pts = []
        steps = {0: 5, 1: 16, 2: 9}[k]
        noise = {0: 0, 1: 28, 2: 10}[k]
        sxp, syp = x0 + 34, 176
        for i in range(steps + 1):
            t = i / steps
            x = sxp + (cx - sxp) * t + (r[i] - 0.5) * noise * (1 - t * 0.6)
            y = syp + (cy - syp) * t + (r[i + 20] - 0.5) * noise * 1.6 * (1 - t * 0.6)
            pts.append((x, y))
        pts[-1] = (cx + (r[39] - 0.5) * noise * 0.3, cy + (r[38] - 0.5) * noise * 0.3)
        b.append(path("M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts), c, 2))
        for (x, y) in pts[:-1]:
            b.append(circle(x, y, 3, c))
        b.append(text(x0 + 115, 214, note, 12, INK2, weight=600))
    return svg(750, 240, b, "배치, SGD, 미니배치 경로 비교")


@fig("dl02-momentum")
def _():
    b = []
    for k, (t, c) in enumerate([("기본 경사하강법", FAIL), ("모멘텀 (관성)", ACC)]):
        x0 = 10 + k * 370
        b.append(rect(x0, 10, 350, 220, SURF, LINE2, 10))
        b.append(text(x0 + 175, 32, t, 14, c, weight=700))
        cx, cy = x0 + 215, 125
        b += contour(cx, cy, 160, 58, 5)
        b.append(circle(cx, cy, 5, PASS))
        if k == 0:
            pts = [(x0 + 60, 85), (x0 + 72, 165), (x0 + 88, 92), (x0 + 106, 158), (x0 + 126, 98), (x0 + 146, 150), (x0 + 166, 104), (x0 + 186, 144), (x0 + 204, 116)]
            note = "골짜기 벽 사이를 오가며 느리게 전진"
        else:
            pts = [(x0 + 60, 85), (x0 + 88, 150), (x0 + 130, 113), (x0 + 172, 132), (x0 + 205, 124), (x0 + 215, 125)]
            note = "흔들림은 상쇄, 앞 방향은 쌓여 빨라짐"
        b.append(path("M" + " L".join(f"{x},{y}" for x, y in pts), c, 2.2))
        for (x, y) in pts:
            b.append(circle(x, y, 3.5, c))
        b.append(text(x0 + 175, 214, note, 12, INK2, weight=600))
    return svg(740, 240, b, "모멘텀이 지그재그를 줄이는 모습")


# ---------------- dl-03 ----------------
@fig("dl03-train-loop")
def _():
    b = []
    steps = [("① 순전파", "입력 → 예측", CYAN, 360, 40), ("② 손실 계산", "예측 vs 정답", WARN, 600, 140),
             ("③ 역전파", "가중치별 책임(기울기)", ORANGE, 360, 240), ("④ 업데이트", "w ← w − 학습률 × 기울기", ACC, 120, 140)]
    for t, d, c, x, y in steps:
        b.append(rect(x - 110, y - 30, 220, 60, SURF3, c, 12, 1.8))
        b.append(text(x, y - 10, t, 14, c, weight=700))
        b.append(text(x, y + 13, d, 12, INK, weight=500))
    b.append(arrow(470, 55, 560, 108, MUTED, 1.8))
    b.append(arrow(560, 172, 470, 225, MUTED, 1.8))
    b.append(arrow(250, 225, 160, 172, MUTED, 1.8))
    b.append(arrow(160, 108, 250, 55, MUTED, 1.8))
    b.append(text(360, 140, "반복\n(에폭 × 배치 수만큼)", 13, MUTED, weight=600))
    return svg(720, 290, b, "학습 한 바퀴의 네 단계")


@fig("dl03-forward")
def _():
    b = []
    X = [(80, 90, "x₁ = 1"), (80, 210, "x₂ = 2")]
    H = [(330, 90, "h₁"), (330, 210, "h₂")]
    Y = (590, 150)
    for (x, y, lab) in X:
        b.append(node(x, y, "", CYAN, 26))
        b.append(text(x, y, lab, 12, CYAN, weight=700))
    wl = {(0, 0): "0.5", (1, 0): "0.5", (0, 1): "1", (1, 1): "−1"}
    for i, (x, y, _) in enumerate(X):
        for j, (hx, hy, _) in enumerate(H):
            b.append(edge(x, y, hx, hy, 26, 30, MUTED, 1.4, head=True))
            mx, my = x + (hx - x) * 0.3, y + (hy - y) * 0.3
            b.append(text(mx, my - 10, "w=" + wl[(i, j)], 12, WARN, weight=700, mono=True))
    vals = ["z = 0.5·1 + 0.5·2 − 1 = 0.5\nReLU → 0.5", "z = 1·1 − 1·2 + 0 = −1\nReLU → 0"]
    for j, (hx, hy, lab) in enumerate(H):
        b.append(node(hx, hy, lab, TRACK, 30, 15))
        b.append(text(hx, hy + (52 if j else -52), vals[j], 11, TRACK, weight=600, mono=True))
        b.append(edge(hx, hy, Y[0], Y[1], 30, 30, MUTED, 1.4, head=True))
        b.append(text(hx + (Y[0] - hx) * 0.5, hy + (Y[1] - hy) * 0.5 - 14, "w=" + ("2" if j == 0 else "3"), 12, WARN, weight=700, mono=True))
    b.append(node(Y[0], Y[1], "ŷ", ACC, 30, 16))
    b.append(text(Y[0], Y[1] + 54, "2·0.5 + 3·0 + 0.5\n= 1.5", 12, ACC, weight=700, mono=True))
    b.append(text(40, 290, "편향: h₁ −1, h₂ 0, 출력 0.5", 12, MUTED, "start", 600))
    b.append(text(Y[0] + 50, Y[1] - 6, "정답 2\n손실 (2−1.5)² = 0.25", 12, WARN, "start", 700))
    return svg(760, 300, b, "순전파 손 계산 예")


@fig("dl03-gears")
def _():
    b = []

    def gear(cx, cy, r, c, label, sub):
        out = []
        n = max(8, int(r / 4))
        pts = []
        for k in range(n * 2):
            a = math.pi * k / n
            rr = r + (6 if k % 2 == 0 else 0)
            pts.append(f"{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}")
        out.append(f'<polygon points="{" ".join(pts)}" fill="{SURF3}" stroke="{c}" stroke-width="2"/>')
        out.append(text(cx, cy - 6, label, 16, c, weight=800))
        out.append(text(cx, cy + 14, sub, 11, MUTED))
        return out
    b += gear(110, 120, 44, CYAN, "A", "1바퀴")
    b += gear(260, 120, 34, TRACK, "B", "2바퀴")
    b += gear(390, 120, 26, ACC, "C", "6바퀴")
    b.append(text(185, 196, "A 1 → B 2  (×2)", 13, TRACK, weight=700))
    b.append(text(325, 196, "B 1 → C 3  (×3)", 13, ACC, weight=700))
    b.append(rect(470, 70, 240, 100, SURF, ACC, 10, 1.6))
    b.append(text(590, 100, "A가 C에 주는 영향", 14, INK, weight=700))
    b.append(text(590, 132, "2 × 3 = 6", 20, ACC, weight=800, mono=True))
    b.append(text(590, 156, "= 연쇄법칙 (영향의 곱)", 12, MUTED))
    return svg(720, 220, b, "연쇄법칙을 톱니바퀴로 보기")


@fig("dl03-graph")
def _():
    b = []
    b.append(box(30, 40, 110, 46, "사과 100원", stroke=CYAN, color=CYAN, size=13))
    b.append(box(30, 140, 110, 46, "개수 2", stroke=CYAN, color=CYAN, size=13))
    b.append(circle(260, 113, 30, SURF3, TRACK, 2))
    b.append(text(260, 113, "×", 22, TRACK, weight=700))
    b.append(box(380, 190, 110, 46, "세금 1.1", stroke=CYAN, color=CYAN, size=13))
    b.append(circle(470, 113, 30, SURF3, TRACK, 2))
    b.append(text(470, 113, "×", 22, TRACK, weight=700))
    b.append(box(590, 90, 110, 46, "총액 220", stroke=ACC, color=ACC, size=14))
    b.append(arrow(142, 63, 232, 100, CYAN, 1.8))
    b.append(arrow(142, 163, 232, 126, CYAN, 1.8))
    b.append(arrow(292, 113, 438, 113, CYAN, 1.8))
    b.append(arrow(435, 200, 458, 142, CYAN, 1.8))
    b.append(arrow(502, 113, 586, 113, CYAN, 1.8))
    b.append(text(365, 98, "200", 13, CYAN, weight=700, mono=True))
    b.append(text(645, 160, "∂총액/∂총액 = 1", 12, ORANGE, weight=700, mono=True))
    b.append(text(365, 134, "← 1.1", 13, ORANGE, weight=700, mono=True))
    b.append(text(395, 256, "← 200", 13, ORANGE, weight=700, mono=True))
    b.append(text(195, 50, "← 2.2", 13, ORANGE, weight=700, mono=True))
    b.append(text(195, 182, "← 110", 13, ORANGE, weight=700, mono=True))
    b.append(text(30, 270, "파란 숫자: 순전파 값 (앞으로)", 12, CYAN, "start", 600))
    b.append(text(30, 290, "주황 숫자: 역전파 기울기 (뒤로) — 곱셈 노드는 '상대편 값'을 곱해서 넘긴다", 12, ORANGE, "start", 600))
    return svg(720, 304, b, "계산 그래프로 보는 역전파")


@fig("dl03-vanishing")
def _():
    b = []
    x0, y1 = 70, 250
    b += axes(x0, 66, 690, y1, "층 (출력에서 거꾸로 센 번호)", "")
    layers = list(range(1, 11))
    for k in layers:
        x = x0 + 20 + (k - 1) * 60
        s = 0.25 ** (k - 1)
        h_sig = max(2, s * 170)
        b.append(rect(x, y1 - h_sig, 22, h_sig, CYAN, CYAN, 2, 1, op=0.7))
        b.append(rect(x + 26, y1 - 170, 22, 170, ACC, ACC, 2, 1, op=0.35))
        b.append(text(x + 24, y1 + 14, str(k), 11, MUTED))
    b.append(rect(440, 14, 14, 14, CYAN, CYAN, 2, op=0.7))
    b.append(text(460, 21, "시그모이드: 층마다 × 0.25 이하", 12, INK, "start"))
    b.append(rect(440, 38, 14, 14, ACC, ACC, 2, op=0.35))
    b.append(text(460, 45, "ReLU(양수 쪽): 층마다 × 1", 12, INK, "start"))
    b.append(text(70, 21, "앞 층에 도착하는 기울기 크기", 12, MUTED, "start", 600))
    b.append(text(70, 45, "3층만 지나도 1/16, 10층이면 약 100만분의 1", 13, CYAN, "start", 700))
    return svg(720, 296, b, "기울기 소실: 층마다 작아지는 기울기")


@fig("dl03-residual")
def _():
    b = []
    b.append(box(30, 90, 100, 50, "입력 x", stroke=CYAN, color=CYAN))
    b.append(arrow(132, 115, 190, 115))
    b.append(box(194, 90, 120, 50, "층 1", stroke=INK2))
    b.append(arrow(316, 115, 370, 115))
    b.append(box(374, 90, 120, 50, "층 2", stroke=INK2))
    b.append(arrow(496, 115, 548, 115))
    b.append(circle(570, 115, 20, SURF3, ACC, 2))
    b.append(text(570, 115, "+", 22, ACC, weight=800))
    b.append(arrow(592, 115, 640, 115, ACC, accent=True))
    b.append(text(670, 115, "출력", 14, ACC, weight=700))
    b.append(path("M80,88 C80,24 570,24 570,92", ACC, 2.2, dash="7 5"))
    b.append(text(325, 30, "지름길 (잔차 연결): x를 그대로 더한다", 13, ACC, weight=700))
    b.append(text(350, 176, "기울기도 이 지름길로 곧장 앞층까지 흘러가서, 아주 깊게 쌓아도 잘 배운다 (ResNet)", 12, MUTED))
    return svg(720, 196, b, "잔차 연결")


# ---------------- dl-04 ----------------
@fig("dl04-mlp-blueprint")
def _():
    b = []
    layers = [(4, 90, CYAN, "입력층 4\n(특성 수)"), (8, 330, TRACK, "은닉층 8\n(ReLU)"), (3, 570, ACC, "출력층 3\n(소프트맥스)")]
    pos = []
    for n, x, c, lab in layers:
        ys = [40 + (300 - 40) * (k + 0.5) / n for k in range(n)]
        pos.append([(x, y) for y in ys])
    for a, bb in zip(pos, pos[1:]):
        for (x1, y1) in a:
            for (x2, y2) in bb:
                b.append(edge(x1, y1, x2, y2, 13, 13, LINE2, 0.9))
    for (n, x, c, lab), ps in zip(layers, pos):
        for (x1, y1) in ps:
            b.append(node(x1, y1, "", c, 13))
        b.append(text(x, 330, lab, 13, c, weight=700))
    b.append(text(210, 18, "4×8 + 8 = 40개", 13, WARN, weight=700, mono=True))
    b.append(text(450, 18, "8×3 + 3 = 27개", 13, WARN, weight=700, mono=True))
    b.append(text(690, 170, "합계\n67개", 15, WARN, weight=800))
    return svg(740, 360, b, "MLP 설계도와 파라미터 수")


@fig("dl04-learning-curve")
def _():
    b = []
    x0, x1, y0, y1 = 70, 690, 30, 250
    b += axes(x0, y0, x1, y1, "에폭", "손실")
    sx = lambda e: x0 + e / 40 * (x1 - x0)
    sy = lambda v: y1 - v / 1.2 * (y1 - y0)
    tr = lambda e: 0.08 + 1.0 * math.exp(-e / 7)
    va = lambda e: 0.30 + 0.85 * math.exp(-e / 6) + max(0, e - 14) ** 1.6 * 0.004
    b.append(f'<rect x="{sx(0)}" y="{y0}" width="{sx(8) - sx(0)}" height="{y1 - y0}" fill="{CYAN}" fill-opacity="0.06"/>')
    b.append(f'<rect x="{sx(22)}" y="{y0}" width="{sx(40) - sx(22)}" height="{y1 - y0}" fill="{FAIL}" fill-opacity="0.07"/>')
    b.append(path(curve(tr, 0, 40, sx, sy), CYAN, 2.6))
    b.append(path(curve(va, 0, 40, sx, sy), ORANGE, 2.6))
    best = min(range(0, 401), key=lambda k: va(k / 10)) / 10
    b.append(line(sx(best), y0 + 20, sx(best), y1, ACC, 1.6, "5 4"))
    b.append(circle(sx(best), sy(va(best)), 6, ACC))
    b.append(text(sx(best), y0 + 10, "조기 종료: 검증 손실이 가장 낮은 곳", 12, ACC, weight=700))
    b.append(text(sx(4), y1 - 14, "과소적합\n(둘 다 높음)", 11, CYAN, weight=600))
    b.append(text(sx(31), y0 + 40, "과적합\n(검증만 다시 오름)", 12, FAIL, weight=700))
    b.append(text(sx(38), sy(tr(38)) - 12, "학습", 12, CYAN, "end", 700))
    b.append(text(sx(38), sy(va(38)) - 12, "검증", 12, ORANGE, "end", 700))
    return svg(720, 296, b, "학습 곡선과 조기 종료")


@fig("dl04-dropout")
def _():
    b = []
    off = [{(1, 1), (1, 4), (2, 0), (2, 3)}, {(1, 0), (1, 3), (2, 2), (2, 4)}]
    for k, title in enumerate(["학습 1회차", "학습 2회차"]):
        x0 = 10 + k * 250
        b.append(rect(x0, 10, 236, 250, SURF, LINE2, 10))
        b.append(text(x0 + 118, 32, title, 14, INK2, weight=700))
        cols = [3, 5, 5, 2]
        P = []
        for li, n in enumerate(cols):
            x = x0 + 30 + li * 60
            P.append([(x, 60 + (200 - 20) * (j + 0.5) / n) for j in range(n)])
        for li in range(3):
            for j1, (xa, ya) in enumerate(P[li]):
                for j2, (xb, yb) in enumerate(P[li + 1]):
                    if (li, j1) in off[k] or (li + 1, j2) in off[k]:
                        continue
                    b.append(edge(xa, ya, xb, yb, 10, 10, LINE2, 1))
        for li, ps in enumerate(P):
            for j, (x, y) in enumerate(ps):
                if (li, j) in off[k]:
                    b.append(circle(x, y, 10, DARK, LINE2, 1.4))
                    b.append(text(x, y, "×", 12, FAIL, weight=800))
                else:
                    b.append(node(x, y, "", ACC if li in (1, 2) else CYAN, 10))
    x0 = 520
    b.append(rect(x0, 10, 220, 250, SURF, ACC, 10, 1.6))
    b.append(text(x0 + 110, 32, "예측할 때", 14, ACC, weight=700))
    b.append(text(x0 + 110, 110, "모든 노드를 켠다", 14, INK, weight=700))
    b.append(text(x0 + 110, 150, "매번 다른 팀으로\n연습한 효과 =\n여러 모델의 평균", 13, MUTED))
    return svg(750, 270, b, "드롭아웃")


def part_icon(cx, cy, s=1.0, flip=False, rot=0, bright=1.0):
    """나사 구멍이 있는 부품 그림 (데이터 증강용)."""
    col = f"rgb({int(102 * bright)},{int(219 * bright)},{int(255 * bright)})"
    tr = f' transform="rotate({rot} {cx} {cy}){f" translate({2 * cx} 0) scale(-1 1)" if flip else ""}"'
    body = (f'<g{tr}>'
            f'<path d="M{cx - 40 * s},{cy - 30 * s} L{cx + 30 * s},{cy - 30 * s} L{cx + 40 * s},{cy - 10 * s} L{cx + 40 * s},{cy + 30 * s} L{cx - 40 * s},{cy + 30 * s} Z" fill="{SURF3}" stroke="{col}" stroke-width="2.2"/>'
            f'<circle cx="{cx - 18 * s}" cy="{cy}" r="{9 * s}" fill="none" stroke="{col}" stroke-width="2"/>'
            f'<path d="M{cx + 8 * s},{cy + 12 * s} L{cx + 26 * s},{cy - 4 * s}" stroke="{FAIL}" stroke-width="2.4"/>'
            f'</g>')
    return body


@fig("dl04-augment")
def _():
    b = []
    items = [("원본", {}), ("좌우 뒤집기", {"flip": True}), ("15° 회전", {"rot": 15}), ("어둡게", {"bright": 0.55})]
    for k, (t, kw) in enumerate(items):
        x = 20 + k * 175
        b.append(rect(x, 20, 150, 150, SURF, ACC if k == 0 else LINE2, 10, 1.6))
        b.append(part_icon(x + 75, 95, 1.0, **kw))
        b.append(text(x + 75, 190, t, 13, ACC if k == 0 else INK, weight=700))
        if k == 0:
            b.append(arrow(172, 95, 193, 95, ACC, 1.8, accent=True))
    b.append(text(370, 220, "빨간 선 = 긁힘 불량. 어떻게 보이든 '긁힘'이라는 정답은 같다 → 학습 사진이 4배", 12, MUTED))
    return svg(720, 236, b, "데이터 증강")


# ---------------- dl-05 ----------------
DIGIT = [[0, 0, 200, 0, 0], [0, 180, 255, 0, 0], [0, 0, 255, 0, 0], [0, 0, 255, 0, 0], [0, 120, 255, 120, 0]]


@fig("dl05-pixels")
def _():
    b = []
    cs = 44
    for i, row in enumerate(DIGIT):
        for j, v in enumerate(row):
            b.append(f'<rect x="{20 + j * cs}" y="{30 + i * cs}" width="{cs}" height="{cs}" fill="rgb({v},{v},{v})" stroke="{LINE2}"/>')
    b.append(text(130, 18, "우리가 보는 것", 13, MUTED, weight=700))
    b.append(arrow(258, 140, 318, 140, ACC, 2.2, accent=True))
    b += grid(330, 30, DIGIT, cs, size=12, colors=lambda v: SURF3 if v == 0 else "#2b3a14")
    b.append(text(440, 18, "컴퓨터가 보는 것 (0 = 검정, 255 = 흰색)", 13, ACC, weight=700))
    b.append(text(600, 140, "5 × 5\n= 25개 숫자", 14, INK, "start", 700))
    return svg(720, 260, b, "이미지는 숫자 격자")


@fig("dl05-rgb")
def _():
    b = []
    for k, (c, name) in enumerate([(FAIL, "R (빨강)"), (PASS, "G (초록)"), ("#6aa8ff", "B (파랑)")]):
        x, y = 40 + k * 34, 30 + k * 26
        b.append(rect(x, y, 170, 140, c, c, 6, 1.6, op=0.25))
        b.append(text(x + 160, y + 128, name, 12, c, "end", 700))
    b.append(text(150, 230, "컬러 사진 = 숫자 격자 3장 겹침", 13, INK, weight=700))
    b.append(rect(330, 40, 370, 170, SURF, LINE2, 10))
    b.append(text(515, 70, "100 × 100 × 3 = 30,000개 숫자", 15, CYAN, weight=700, mono=True))
    b.append(text(515, 112, "한 줄로 펼쳐 은닉 노드 1,000개에 연결하면", 13, INK2))
    b.append(text(515, 142, "30,000 × 1,000 = 3,000만 개 가중치", 15, FAIL, weight=800, mono=True))
    b.append(text(515, 180, "첫 층 하나만으로!", 13, FAIL, weight=600))
    return svg(720, 250, b, "컬러 이미지의 채널과 크기")


@fig("dl05-conv")
def _():
    b = []
    img = [[0, 0, 1, 0, 0]] * 5
    filt = [[-1, 2, -1]] * 3
    cs = 40
    hi = {(i, j) for i in range(3) for j in range(1, 4)}
    b += grid(20, 40, img, cs, size=14, hi=hi, colors=lambda v: "#2b3a14" if v else SURF3)
    b.append(rect(20 + cs, 40, cs * 3, cs * 3, "none", ACC, 4, 3))
    b.append(text(120, 24, "입력 5×5 (세로선)", 13, MUTED, weight=700))
    b.append(text(278, 100, "×", 24, MUTED, weight=700))
    b += grid(300, 60, filt, cs, size=14, colors=lambda v: "#3a2a1c" if v < 0 else "#1c3a2a")
    b.append(text(360, 44, "필터 3×3", 13, ORANGE, weight=700))
    b.append(text(360, 196, "세로선 찾기 필터", 12, MUTED))
    b.append(arrow(428, 120, 488, 120, ACC, 2.2, accent=True))
    fmap = [[-3, 6, -3]] * 3
    b += grid(500, 60, fmap, cs, size=14, hi={(0, 1)}, colors=lambda v: "#2b3a14" if v > 0 else SURF3)
    b.append(text(560, 44, "특징 맵 3×3", 13, ACC, weight=700))
    b.append(text(560, 196, "세로선 자리에서 크게 반응", 12, MUTED))
    b.append(text(370, 246, "노란 칸 9개 × 필터 9칸을 곱해 더함: 줄마다 (0·−1 + 1·2 + 0·−1) = 2, 세 줄이라 6", 12, ACC, weight=600))
    return svg(720, 262, b, "합성곱: 필터가 훑으며 특징 맵을 만든다")


@fig("dl05-pad-stride")
def _():
    b = []
    cs = 26
    b.append(rect(10, 10, 340, 250, SURF, LINE2, 10))
    b.append(text(180, 32, "패딩 1: 가장자리에 0 두르기", 14, CYAN, weight=700))
    for i in range(7):
        for j in range(7):
            edge_ = i in (0, 6) or j in (0, 6)
            b.append(rect(80 + j * cs, 52 + i * cs, cs, cs, DARK if edge_ else SURF3, LINE2, 0, 1, dash="2 2" if edge_ else None))
            if edge_:
                b.append(text(80 + j * cs + cs / 2, 52 + i * cs + cs / 2, "0", 10, MUTED, mono=True))
    b.append(rect(80, 52, cs * 3, cs * 3, "none", ACC, 3, 2.6))
    b.append(text(180, 246, "5×5 입력 → 출력도 5×5 (크기 유지)", 12, INK2, weight=600))
    b.append(rect(370, 10, 340, 250, SURF, LINE2, 10))
    b.append(text(540, 28, "스트라이드 2: 두 칸씩 건너뛰기", 14, TRACK, weight=700))
    for i in range(7):
        for j in range(7):
            b.append(rect(440 + j * cs, 52 + i * cs, cs, cs, SURF3, LINE2, 0))
    b.append(rect(440, 52, cs * 3, cs * 3, "none", ACC, 3, 2.6))
    b.append(rect(440 + 2 * cs, 52, cs * 3, cs * 3, "none", TRACK, 3, 2.6, dash="5 3"))
    b.append(arrow(440 + 1.5 * cs, 47, 440 + 3.5 * cs, 47, TRACK, 1.6))
    b.append(text(540, 246, "7×7 입력 → (7 − 3) ÷ 2 + 1 = 3×3", 12, INK2, weight=600))
    return svg(720, 270, b, "패딩과 스트라이드")


@fig("dl05-pooling")
def _():
    b = []
    m = [[1, 3, 2, 0], [4, 2, 1, 1], [0, 1, 5, 2], [2, 1, 3, 4]]
    cs = 46
    cols = [CYAN, TRACK, ORANGE, ACC]
    for i in range(4):
        for j in range(4):
            q = (i // 2) * 2 + j // 2
            b.append(rect(30 + j * cs, 40 + i * cs, cs, cs, cols[q], LINE2, 0, 1, op=0.18))
            mx = max(m[(i // 2) * 2 + a][(j // 2) * 2 + c] for a in range(2) for c in range(2))
            big = m[i][j] == mx
            b.append(text(30 + j * cs + cs / 2, 40 + i * cs + cs / 2, m[i][j], 16, cols[q] if big else INK, weight=800 if big else 500, mono=True))
    b.append(text(122, 24, "특징 맵 4×4", 13, MUTED, weight=700))
    b.append(arrow(230, 132, 320, 132, ACC, 2.2, accent=True))
    b.append(text(275, 110, "2×2 최대", 12, ACC, weight=700))
    out = [[4, 2], [2, 5]]
    for i in range(2):
        for j in range(2):
            q = i * 2 + j
            b.append(rect(340 + j * 56, 76 + i * 56, 56, 56, cols[q], cols[q], 0, 1.6, op=0.22))
            b.append(text(340 + j * 56 + 28, 76 + i * 56 + 28, out[i][j], 18, cols[q], weight=800, mono=True))
    b.append(text(396, 60, "결과 2×2", 13, ACC, weight=700))
    b.append(text(560, 110, "구역마다 가장 큰 값 하나", 13, INK, "start" if False else "middle", 700))
    b.append(text(560, 140, "가로 · 세로 절반, 학습할 값 없음", 12, MUTED))
    b.append(text(560, 162, "조금 밀려도 같은 결과", 12, MUTED))
    return svg(720, 240, b, "최대 풀링")


@fig("dl05-cnn-pipeline")
def _():
    b = []
    blocks = [("입력\n사진", 70, 120, CYAN, 1), ("합성곱\n+ ReLU", 200, 110, TRACK, 3), ("풀링", 310, 80, TRACK, 3),
              ("합성곱\n+ ReLU", 420, 70, ORANGE, 6), ("풀링", 520, 50, ORANGE, 6), ("펼치기\n+ 완전연결", 630, 0, INK2, 0)]
    for t, x, s, c, depth in blocks:
        if depth:
            for d in range(min(depth, 6)):
                off = d * 5
                b.append(rect(x - s / 2 + off, 120 - s / 2 - off, s * 0.7, s, SURF3, c, 3, 1.4))
        else:
            for k in range(6):
                b.append(circle(x, 70 + k * 20, 7, SURF3, c, 1.6))
        b.append(text(x + 10, 214, t, 12, c, weight=700))
    for (x1, x2) in [(118, 150), (248, 280), (346, 382), (450, 492), (548, 600)]:
        b.append(arrow(x1, 120, x2, 120, MUTED, 1.6))
    b.append(arrow(650, 120, 690, 120, ACC, 2, accent=True))
    b.append(box(694, 92, 70, 56, "불량\n0.97", stroke=ACC, color=ACC, size=13))
    b.append(text(330, 250, "앞쪽: 선 · 질감 → 뒤쪽: 모양 · 부품. 크기는 줄고, 필터(특징) 수는 늘어난다", 12, MUTED))
    return svg(780, 268, b, "CNN 전체 구조")


# ---------------- dl-06 ----------------
@fig("dl06-rnn-unroll")
def _():
    b = []
    words = ["오늘", "날씨", "정말", "좋다"]
    for k, w in enumerate(words):
        x = 110 + k * 160
        b.append(box(x - 40, 190, 80, 40, w, stroke=CYAN, color=CYAN, size=14))
        b.append(arrow(x, 188, x, 142, CYAN, 1.6))
        b.append(rect(x - 46, 92, 92, 48, SURF3, TRACK, 10, 1.8))
        b.append(text(x, 116, "RNN 셀", 13, TRACK, weight=700))
        if k < 3:
            b.append(arrow(x + 48, 116, x + 110, 116, ACC, 2, accent=True))
            b.append(text(x + 80, 100, f"h{k + 1}", 13, ACC, weight=700, mono=True))
    b.append(arrow(110 + 3 * 160 + 48, 116, 110 + 3 * 160 + 100, 116, ACC, 2, accent=True))
    b.append(box(110 + 3 * 160 + 104, 94, 90, 44, "긍정\n0.92", stroke=ACC, color=ACC, size=13))
    b.append(text(380, 30, "같은 셀(같은 가중치)을 단어마다 다시 쓰며, 메모 h를 다음 칸으로 넘긴다", 13, INK2, weight=600))
    b.append(text(380, 56, "h = 지금까지 읽은 내용의 요약", 12, ACC, weight=700))
    return svg(800, 246, b, "RNN을 시간 순서로 펼친 모습")


@fig("dl06-io-shapes")
def _():
    b = []
    cases = [("다대일", "문장 → 긍정/부정\n센서 30분 → 고장?", [1, 1, 1, 1], [0, 0, 0, 1]),
             ("다대다", "번역 · 단어마다 품사", [1, 1, 1, 1], [1, 1, 1, 1]),
             ("일대다", "사진 한 장 → 설명 문장", [1, 0, 0, 0], [1, 1, 1, 1])]
    for k, (t, d, ins, outs) in enumerate(cases):
        x0 = 10 + k * 245
        b.append(rect(x0, 10, 230, 220, SURF, LINE2, 10))
        b.append(text(x0 + 115, 32, t, 15, ACC, weight=700))
        for i in range(4):
            x = x0 + 40 + i * 50
            b.append(rect(x - 16, 100, 32, 32, SURF3, TRACK, 6, 1.6))
            if i < 3:
                b.append(arrow(x + 17, 116, x + 33, 116, TRACK, 1.4))
            if ins[i]:
                b.append(circle(x, 166, 9, CYAN))
                b.append(arrow(x, 156, x, 134, CYAN, 1.4))
            if outs[i]:
                b.append(circle(x, 64, 9, ACC))
                b.append(arrow(x, 98, x, 75, ACC, 1.4))
        b.append(text(x0 + 115, 204, d, 11, MUTED))
    return svg(750, 240, b, "RNN 입력과 출력 모양")


@fig("dl06-lstm")
def _():
    b = []
    b.append(rect(60, 70, 600, 186, SURF, LINE2, 14))
    b.append(arrow(20, 100, 700, 100, ACC, 3, accent=True))
    b.append(text(20, 56, "셀 상태 (장기 기억의 컨베이어 벨트)", 13, ACC, "start", 700))
    gates = [("잊기 게이트", "지난 기억 중\n무엇을 버릴까?", FAIL, 190, "×"), ("입력 게이트", "새 정보 중\n무엇을 적을까?", PASS, 360, "+"), ("출력 게이트", "지금 무엇을\n내보낼까?", CYAN, 530, "")]
    for t, d, c, x, op in gates:
        if op:
            b.append(circle(x, 100, 16, SURF3, c, 2))
            b.append(text(x, 100, op, 18, c, weight=800))
            b.append(arrow(x, 170, x, 118, c, 1.8))
        else:
            b.append(arrow(x, 102, x, 150, c, 1.8))
        b.append(rect(x - 74, 172, 148, 72, SURF3, c, 10, 1.6))
        b.append(text(x, 191, t, 13, c, weight=700))
        b.append(text(x, 222, d, 11, INK2))
    b.append(text(360, 278, "게이트 = 0(닫힘) ~ 1(열림) 밸브. 벨트 위 정보가 곱 대신 덧셈으로 흘러 기울기가 덜 사라진다", 12, MUTED))
    b.append(text(600, 50, "→ h (출력)", 12, CYAN, weight=700))
    return svg(720, 296, b, "LSTM 셀의 세 게이트")


# ---------------- dl-07 ----------------
@fig("dl07-tokenize")
def _():
    b = []
    b.append(box(20, 30, 680, 46, "\"노즐이 막혀서 불량이 났다\"", stroke=INK2, size=15))
    toks = ["노즐", "이", "막혀", "서", "불량", "이", "났다"]
    ids = ["8121", "17", "5530", "42", "2291", "17", "6604"]
    x = 30
    for t, i in zip(toks, ids):
        w = 30 + len(t) * 16
        b.append(rect(x, 110, w, 38, SURF3, CYAN, 8, 1.6))
        b.append(text(x + w / 2, 129, t, 14, CYAN, weight=700))
        b.append(arrow(x + w / 2, 150, x + w / 2, 178, MUTED, 1.4))
        b.append(text(x + w / 2, 194, i, 13, ACC, weight=700, mono=True))
        x += w + 12
    b.append(text(20, 96, "① 토큰으로 자르기", 12, CYAN, "start", 700))
    b.append(text(20, 222, "② 사전 번호로 바꾸기 → ③ 번호마다 임베딩 벡터를 꺼내 쓴다", 12, ACC, "start", 700))
    return svg(720, 240, b, "문장을 토큰과 번호로")


@fig("dl07-embedding-map")
def _():
    b = []
    x0, x1, y0, y1 = 60, 460, 20, 300
    b += axes(x0, y0, x1, y1, "의미 축 1", "의미 축 2")
    sx = lambda v: x0 + v * (x1 - x0)
    sy = lambda v: y1 - v * (y1 - y0)
    pts = [("불량", 0.9, 0.2, ACC), ("결함", 0.85, 0.3, ACC), ("흠집", 0.78, 0.14, ACC),
           ("송장", 0.1, 0.9, CYAN), ("견적", 0.2, 0.82, CYAN), ("납품", 0.28, 0.92, CYAN),
           ("온도", 0.55, 0.55, TRACK), ("압력", 0.62, 0.5, TRACK)]
    for t, u, v, c in pts:
        b.append(circle(sx(u), sy(v), 6, c))
        if t == "흠집":
            b.append(text(sx(u) - 10, sy(v) + 12, t, 13, c, "end", 700))
        else:
            b.append(text(sx(u) + 10, sy(v) - 10, t, 13, c, "start", 700))
    b.append(line(sx(0), sy(0), sx(0.9), sy(0.2), ACC, 1.4, "4 3"))
    b.append(line(sx(0), sy(0), sx(0.85), sy(0.3), ACC, 1.4, "4 3"))
    b.append(line(sx(0), sy(0), sx(0.1), sy(0.9), CYAN, 1.4, "4 3"))
    b.append(rect(490, 40, 220, 220, SURF, LINE2, 10))
    b.append(text(600, 64, "코사인 유사도", 14, INK, weight=700))
    b.append(text(600, 96, "(방향이 얼마나 같나)", 11, MUTED))
    b.append(text(600, 136, "불량 ~ 결함", 13, ACC, weight=700))
    b.append(text(600, 158, "0.99", 18, ACC, weight=800, mono=True))
    b.append(text(600, 200, "불량 ~ 송장", 13, CYAN, weight=700))
    b.append(text(600, 222, "0.32", 18, CYAN, weight=800, mono=True))
    return svg(720, 344, b, "임베딩 공간: 뜻이 비슷하면 가깝다")


@fig("dl07-qkv")
def _():
    b = []
    b.append(box(20, 110, 110, 50, "그것\n(Q: 찾는 것)", stroke=ACC, color=ACC, size=13))
    words = [("노즐", "2", "0.67"), ("어제", "0", "0.09"), ("라인", "1", "0.24")]
    for k, (w, s, p) in enumerate(words):
        y = 40 + k * 90
        b.append(box(220, y, 100, 50, f"{w}\n(K)", stroke=CYAN, color=CYAN, size=13))
        b.append(arrow(132, 135, 216, y + 25, MUTED, 1.4))
        b.append(text(360, y + 25, s, 15, WARN, weight=800, mono=True))
        b.append(text(470, y + 25, p, 15, ACC, weight=800, mono=True))
        b.append(rect(510, y + 12, float(p) * 120, 26, ACC, ACC, 3, op=0.45))
        b.append(box(650, y, 90, 50, f"{w}\n(V)", stroke=TRACK, color=TRACK, size=13))
    b.append(text(360, 20, "① 점수 Q·K", 12, WARN, weight=700))
    b.append(text(470, 20, "② softmax 가중치", 12, ACC, weight=700))
    b.append(text(695, 20, "③ 내용 V", 12, TRACK, weight=700))
    b.append(text(380, 300, "④ 새 '그것' = 0.67 × 노즐(V) + 0.09 × 어제(V) + 0.24 × 라인(V) → 대부분 '노즐'의 뜻", 13, INK, weight=700))
    return svg(760, 320, b, "어텐션: Q, K, V로 가중합 만들기")


@fig("dl07-attention-map")
def _():
    b = []
    toks = ["노즐", "이", "막혀", "그것", "을", "교체"]
    W = [[0.70, 0.08, 0.12, 0.04, 0.02, 0.04], [0.40, 0.35, 0.15, 0.04, 0.03, 0.03], [0.45, 0.10, 0.35, 0.04, 0.02, 0.04],
         [0.62, 0.03, 0.18, 0.12, 0.02, 0.03], [0.05, 0.05, 0.05, 0.45, 0.35, 0.05], [0.30, 0.02, 0.08, 0.40, 0.05, 0.15]]
    cs = 46
    x0, y0 = 120, 60
    for j, t in enumerate(toks):
        b.append(text(x0 + j * cs + cs / 2, y0 - 14, t, 12, CYAN, weight=700))
    for i, t in enumerate(toks):
        b.append(text(x0 - 10, y0 + i * cs + cs / 2, t, 12, ACC, "end", 700))
        for j in range(6):
            v = W[i][j]
            b.append(rect(x0 + j * cs, y0 + i * cs, cs, cs, ACC, DARK, 0, 1, op=0.08 + v * 1.1))
            b.append(text(x0 + j * cs + cs / 2, y0 + i * cs + cs / 2, f"{v:.2f}", 10, INK if v < 0.5 else DARK, weight=600, mono=True))
    b.append(rect(x0 - 4, y0 + 3 * cs, cs * 6 + 8, cs, "none", WARN, 4, 2.4))
    b.append(text(x0 + 3 * cs, 22, "참고되는 단어 (K)", 12, CYAN, weight=700))
    b.append(text(500, 200, "'그것' 줄에서\n'노즐'이 0.62로 가장 진하다", 13, WARN, "start", 700))
    b.append(text(500, 260, "줄마다 합은 1 (softmax)", 12, MUTED, "start"))
    return svg(720, 350, b, "어텐션 가중치 히트맵")


@fig("dl07-transformer-block")
def _():
    b = []
    b.append(box(260, 330, 200, 40, "토큰 임베딩 + 위치 정보", stroke=CYAN, color=CYAN, size=13))
    b.append(rect(220, 70, 280, 240, SURF, TRACK, 14, 1.8))
    b.append(text(520, 80, "× N번 쌓기", 14, TRACK, "start", 700))
    b.append(box(250, 240, 220, 46, "멀티헤드 셀프 어텐션", stroke=ACC, color=ACC, size=14))
    b.append(box(250, 170, 220, 34, "더하기 (잔차) + 정규화", stroke=LINE2, color=INK2, size=12))
    b.append(box(250, 120, 220, 40, "피드포워드 (작은 MLP)", stroke=ORANGE, color=ORANGE, size=13))
    b.append(box(250, 80, 220, 30, "더하기 (잔차) + 정규화", stroke=LINE2, color=INK2, size=12))
    b.append(arrow(360, 328, 360, 288, MUTED, 1.6))
    b.append(arrow(360, 238, 360, 206, MUTED, 1.6))
    b.append(arrow(360, 168, 360, 162, MUTED, 1.6))
    b.append(arrow(360, 118, 360, 112, MUTED, 1.6))
    b.append(arrow(360, 78, 360, 40, MUTED, 1.6))
    b.append(box(280, 6, 160, 34, "다음 토큰 확률", stroke=ACC, color=ACC, size=13))
    b.append(text(110, 263, "단어끼리 서로 참고\n(여러 관점 동시에)", 12, ACC, weight=600))
    b.append(text(110, 140, "단어마다 따로\n정보 다듬기", 12, ORANGE, weight=600))
    b.append(text(620, 350, "위치 정보: 어텐션은\n순서를 모르므로 더해 준다", 12, CYAN, weight=600))
    return svg(740, 380, b, "Transformer 블록")


@fig("dl07-next-token")
def _():
    b = []
    b.append(box(20, 90, 200, 50, "\"오늘 날씨가\"", stroke=INK2, size=15))
    b.append(arrow(222, 115, 282, 115, ACC, 2.2, accent=True))
    b.append(box(286, 85, 110, 60, "언어\n모델", stroke=ACC, color=ACC, size=14))
    b.append(arrow(398, 115, 440, 115, ACC, 2.2, accent=True))
    probs = [("좋다", 0.41), ("맑다", 0.22), ("춥다", 0.15), ("흐리다", 0.09), ("…", 0.13)]
    for k, (w, p) in enumerate(probs):
        y = 30 + k * 40
        b.append(text(500, y + 14, w, 14, ACC if k == 0 else INK, "end", 700))
        b.append(rect(510, y, p * 380, 28, ACC if k == 0 else CYAN, "none", 4, op=0.6 if k == 0 else 0.35))
        b.append(text(518 + p * 380, y + 14, f"{p:.2f}", 12, INK, "start", 600, mono=True))
    b.append(text(370, 250, "하나 고르고 → \"오늘 날씨가 좋다\"를 다시 넣어 다음 토큰 → … 반복하며 한 글자씩 써 내려간다", 12, MUTED))
    return svg(760, 266, b, "다음 토큰 예측")


# ---------------- dl-08 ----------------
@fig("dl08-autoencoder")
def _():
    b = []
    b.append(f'<path d="M150,40 L330,110 L330,170 L150,240 Z" fill="{CYAN}" fill-opacity="0.12" stroke="{CYAN}" stroke-width="1.8"/>')
    b.append(f'<path d="M390,110 L570,40 L570,240 L390,170 Z" fill="{TRACK}" fill-opacity="0.12" stroke="{TRACK}" stroke-width="1.8"/>')
    b.append(rect(330, 100, 60, 80, SURF3, ACC, 8, 2))
    b.append(text(240, 140, "인코더\n(압축)", 14, CYAN, weight=700))
    b.append(text(480, 140, "디코더\n(복원)", 14, TRACK, weight=700))
    b.append(text(360, 140, "잠재\n공간", 12, ACC, weight=700))
    b.append(box(20, 110, 110, 60, "입력\n센서 100개", stroke=INK2, size=13))
    b.append(arrow(132, 140, 148, 140))
    b.append(arrow(572, 140, 590, 140))
    b.append(box(594, 110, 110, 60, "복원\n100개", stroke=INK2, size=13))
    b.append(text(360, 206, "숫자 4개", 12, ACC, weight=700))
    b.append(text(360, 268, "복원 오차 = 입력과 복원이 얼마나 다른가 (작을수록 잘 압축 · 복원)", 13, WARN, weight=700))
    return svg(720, 290, b, "오토인코더 구조")


@fig("dl08-recon-error")
def _():
    b = []
    x0, x1, y0, y1 = 60, 680, 30, 220
    b += axes(x0, y0, x1, y1, "복원 오차", "개수")
    sx = lambda v: x0 + v / 0.6 * (x1 - x0)
    sy = lambda v: y1 - v * (y1 - y0)
    norm = lambda e: 0.8 * math.exp(-0.5 * ((e - 0.035) / 0.015) ** 2)
    ab = lambda e: 0.35 * math.exp(-0.5 * ((e - 0.38) / 0.07) ** 2)
    b.append(path(curve(norm, 0, 0.6, sx, sy, 200) + f" L{sx(0.6)},{y1} L{sx(0)},{y1} Z", CYAN, 1.4, fill=CYAN))
    b[-1] = b[-1].replace('fill="' + CYAN + '"', f'fill="{CYAN}" fill-opacity="0.25"')
    b.append(path(curve(ab, 0, 0.6, sx, sy, 200) + f" L{sx(0.6)},{y1} L{sx(0)},{y1} Z", FAIL, 1.4, fill=FAIL))
    b[-1] = b[-1].replace('fill="' + FAIL + '"', f'fill="{FAIL}" fill-opacity="0.25"')
    b.append(line(sx(0.10), y0, sx(0.10), y1, WARN, 2, "6 4"))
    b.append(text(sx(0.10) + 8, y0 + 10, "임계값 0.10", 13, WARN, "start", 700))
    b.append(text(sx(0.10) + 8, y0 + 34, "← 정상 (평소에 배운 모습)", 13, CYAN, "start", 700))
    b.append(text(sx(0.38), sy(0.35) - 14, "이상 (복원이 엉망)", 13, FAIL, weight=700))
    for t in (0, 0.1, 0.2, 0.3, 0.4, 0.5):
        b.append(text(sx(t), y1 + 14, f"{t:.1f}", 11, MUTED))
    return svg(720, 266, b, "복원 오차로 이상 찾기")


@fig("dl08-gan")
def _():
    b = []
    b.append(box(20, 40, 120, 50, "무작위 잡음", stroke=MUTED, color=INK2, size=13))
    b.append(arrow(142, 65, 192, 65))
    b.append(box(196, 30, 150, 70, "생성자\n(위조범)", stroke=ORANGE, color=ORANGE, size=14))
    b.append(arrow(348, 65, 410, 110, ORANGE, 1.8))
    b.append(text(380, 66, "가짜", 12, ORANGE, weight=700))
    b.append(box(20, 170, 170, 50, "진짜 사진들", stroke=PASS, color=PASS, size=13))
    b.append(arrow(192, 195, 410, 140, PASS, 1.8))
    b.append(text(300, 186, "진짜", 12, PASS, weight=700))
    b.append(box(414, 90, 150, 70, "판별자\n(감정사)", stroke=CYAN, color=CYAN, size=14))
    b.append(arrow(566, 125, 610, 125, CYAN, 1.8))
    b.append(box(614, 100, 100, 50, "진짜?\n가짜?", stroke=CYAN, color=CYAN, size=13))
    b.append(path("M664,98 C664,6 271,6 271,28", ACC, 1.8, dash="6 4"))
    b.append(text(470, 48, "판별 결과로 둘 다 실력을 올린다 (경쟁)", 12, ACC, weight=700))
    b.append(text(360, 252, "끝: 감정사가 진짜 · 가짜를 반반으로밖에 못 맞히면, 위조범이 진짜 같은 사진을 만든다는 뜻", 12, MUTED))
    return svg(730, 270, b, "GAN의 생성자와 판별자")


@fig("dl08-diffusion")
def _():
    b = []
    n = 5
    for k in range(n):
        x = 30 + k * 140
        b.append(rect(x, 50, 110, 110, SURF3, LINE2, 8))
        noise = k / (n - 1)
        r = pseudo(120, 9 + k)
        if noise < 1:
            op = 1 - noise
            b.append(f'<g opacity="{op:.2f}">{part_icon(x + 55, 105, 0.9)}</g>')
        for i in range(int(40 + 80 * noise)):
            b.append(circle(x + 8 + r[i] * 94, 58 + r[(i + 37) % 120] * 94, 2.2, INK2, op=0.25 + 0.5 * noise))
        b.append(text(x + 55, 178, ["깨끗한 사진", "잡음 조금", "잡음 많이", "거의 잡음", "순수 잡음"][k], 12, INK2, weight=600))
    b.append(arrow(40, 30, 690, 30, FAIL, 1.8))
    b.append(text(365, 18, "학습: 잡음을 조금씩 더하는 과정을 보여 준다", 12, FAIL, weight=700))
    b.append(arrow(690, 206, 40, 206, ACC, 2.2, accent=True))
    b.append(text(365, 226, "생성: 순수 잡음에서 시작해 '잡음 지우기'를 여러 번 → 새 사진", 12, ACC, weight=700))
    return svg(730, 240, b, "확산 모델")


# ---------------- dl-09 ----------------
@fig("dl09-transfer")
def _():
    b = []
    b.append(rect(10, 10, 340, 230, SURF, LINE2, 10))
    b.append(text(180, 32, "① 사전학습: 사진 수백만 장 · 1,000종", 13, CYAN, weight=700))
    for k, (t, c) in enumerate([("층 1 선", CYAN), ("층 2 질감", CYAN), ("층 3 모양", CYAN), ("머리: 1,000종 분류", MUTED)]):
        b.append(box(40, 52 + k * 44, 280, 36, t, stroke=c, color=c, size=13))
    b.append(arrow(352, 125, 398, 125, ACC, 2.2, accent=True))
    b.append(rect(400, 10, 340, 230, SURF, ACC, 10, 1.6))
    b.append(text(570, 32, "② 우리 공장: 불량 사진 500장", 13, ACC, weight=700))
    for k, (t, c, lock) in enumerate([("층 1 선", INK2, True), ("층 2 질감", INK2, True), ("층 3 모양", WARN, False), ("새 머리: 정상 / 불량", ACC, False)]):
        b.append(box(430, 52 + k * 44, 280, 36, t + ("  🔒 고정" if lock else ("  (선택) 살짝 조정" if k == 2 else "  새로 학습")), stroke=c, color=c, size=12))
    b.append(text(375, 262, "몸통은 그대로 빌려 쓰고, 머리만 바꿔 우리 문제에 맞춘다", 13, INK, weight=700))
    return svg(750, 280, b, "전이 학습")


@fig("dl09-project-loop")
def _():
    b = []
    steps = [("문제 정의", "정말 딥러닝이\n필요한가?", INK2), ("데이터", "라벨 품질 · 분할\n· 증강", CYAN), ("모델", "사전학습 모델\n출력층 · 손실", TRACK),
             ("학습", "학습률 · 배치\n· 조기 종료", ORANGE), ("평가", "테스트 · 오류 사례\n· 기준 모델 비교", WARN), ("배포 · 관찰", "속도 · 성능 감시\n· 재학습", ACC)]
    cx, cy, rx, ry, hw, hh = 380, 185, 250, 140, 80, 32
    P = []
    for k in range(6):
        a = -math.pi / 2 + k * 2 * math.pi / 6
        P.append((cx + rx * math.cos(a), cy + ry * math.sin(a)))
    for k in range(6):
        (x1, y1), (x2, y2) = P[k], P[(k + 1) % 6]
        dx, dy = x2 - x1, y2 - y1
        t = min(hw / abs(dx) if dx else 9, hh / abs(dy) if dy else 9)
        b.append(arrow(x1 + dx * (t + 0.04), y1 + dy * (t + 0.04), x2 - dx * (t + 0.04), y2 - dy * (t + 0.04), MUTED, 1.8))
    for (t, d, c), (x, y) in zip(steps, P):
        b.append(rect(x - hw, y - hh, 2 * hw, 2 * hh, SURF3, c, 12, 1.8))
        b.append(text(x, y - 13, t, 14, c, weight=700))
        b.append(text(x, y + 13, d, 11, INK2))
    b.append(text(cx, cy, "한 바퀴로 끝나지 않고\n계속 돈다", 13, MUTED, weight=600))
    return svg(760, 370, b, "딥러닝 프로젝트의 흐름")


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
