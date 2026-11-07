"""머신러닝 트랙 레슨 도식(SVG) 생성기.

python3 scripts/figures_ml.py  ->  content/img/ml/*.svg
사이트 다크 테마 색을 쓰고, <img>로 넣기 때문에 웹폰트 대신 시스템 한글 글꼴을 지정한다.
"""
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "ml")

INK, INK2, MUTED = "#f5f7f2", "#c9cfcb", "#a1aaa5"
LINE, LINE2 = "#2a2f30", "#3d4344"
SURF, SURF3 = "#121516", "#1d2223"
ACC, TRACK, CYAN = "#c8ff3d", "#a896ff", "#66dbff"
PASS, FAIL, WARN, ORANGE = "#61db9c", "#ff7a92", "#ffcf4a", "#ff9a51"
FONT = "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif"
MONO = "'JetBrains Mono', Menlo, Consolas, monospace"


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" font-family="{FONT}">'
            f'<title>{esc(title)}</title>'
            f'<defs>'
            f'<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{MUTED}"/></marker>'
            f'<marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{ACC}"/></marker>'
            f'</defs>{"".join(body)}</svg>')


def rect(x, y, w, h, fill=SURF3, stroke=LINE2, rx=8, sw=1.2, dash=None, op=1):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}"{d}/>'


def text(x, y, s, size=15, fill=INK, anchor="middle", weight=500, mono=False, italic=False):
    fam = f' font-family="{MONO}"' if mono else ""
    it = ' font-style="italic"' if italic else ""
    lines = str(s).split("\n")
    out = []
    for i, ln in enumerate(lines):
        dy = (i - (len(lines) - 1) / 2) * size * 1.3
        out.append(f'<text x="{x}" y="{y + dy:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" dominant-baseline="central" font-weight="{weight}"{fam}{it}>{esc(ln)}</text>')
    return "".join(out)


def box(x, y, w, h, label, fill=SURF3, stroke=LINE2, color=INK, size=15, weight=600, rx=8):
    return rect(x, y, w, h, fill, stroke, rx) + text(x + w / 2, y + h / 2, label, size, color, weight=weight)


def arrow(x1, y1, x2, y2, color=MUTED, sw=1.8, dash=None, accent=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = "aha" if accent else "ah"
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{d} marker-end="url(#{m})"/>'


def line(x1, y1, x2, y2, color=LINE2, sw=1.2, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{d}/>'


def circle(cx, cy, r, fill, stroke="none", sw=1.5, op=1):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}"/>'


def path(d, stroke=INK, sw=2.2, fill="none", dash=None):
    ds = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{ds}/>'


def pseudo(n, seed):
    """재현 가능한 의사난수 (0~1) — 그림 점 배치용."""
    vals, s = [], seed
    for _ in range(n):
        s = (s * 1103515245 + 12345) % 2147483648
        vals.append(s / 2147483648)
    return vals


FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


# ---------------- ml-00 ----------------
@fig("ml00-ai-ml-dl")
def _():
    b = []
    b.append(f'<ellipse cx="300" cy="170" rx="280" ry="150" fill="{TRACK}" fill-opacity="0.10" stroke="{TRACK}" stroke-width="1.6"/>')
    b.append(f'<ellipse cx="340" cy="190" rx="190" ry="105" fill="{CYAN}" fill-opacity="0.12" stroke="{CYAN}" stroke-width="1.6"/>')
    b.append(f'<ellipse cx="380" cy="212" rx="100" ry="56" fill="{ACC}" fill-opacity="0.16" stroke="{ACC}" stroke-width="1.6"/>')
    b.append(text(130, 72, "인공지능 (AI)", 17, TRACK, weight=700))
    b.append(text(250, 120, "머신러닝 (ML)", 16, CYAN, weight=700))
    b.append(text(380, 212, "딥러닝 (DL)", 15, ACC, weight=700))
    b.append(text(600, 70, "사람처럼 판단하는 프로그램 전부\n(규칙을 사람이 다 써 넣은 것도 포함)", 13, TRACK, "start", 600))
    b.append(text(600, 160, "데이터를 보고 규칙을\n스스로 찾는 방법", 13, CYAN, "start", 600))
    b.append(text(600, 240, "인공 신경망을 아주 깊게 쌓은\n머신러닝 (사진·음성·글)", 13, ACC, "start", 600))
    b += [line(560, 80, 590, 74, TRACK, 1.2), line(520, 170, 590, 162, CYAN, 1.2), line(478, 226, 590, 240, ACC, 1.2)]
    return svg(820, 330, b, "인공지능, 머신러닝, 딥러닝의 포함 관계")


@fig("ml00-train-predict")
def _():
    b = []
    b.append(rect(10, 10, 700, 130, SURF, LINE2, 10))
    b.append(text(30, 34, "① 학습 (fit) — 예전 기록으로 규칙 찾기", 15, ACC, "start", 700))
    b.append(box(30, 56, 150, 62, "승객 기록 X\n(등급·성별·나이)", size=13))
    b.append(box(190, 56, 120, 62, "정답 y\n(생존 여부)", stroke=ACC, color=ACC, size=13))
    b.append(arrow(316, 87, 380, 87, ACC, 2.2, accent=True))
    b.append(box(386, 52, 150, 70, "모델\n(규칙이 담긴 상자)", fill=SURF3, stroke=CYAN, color=CYAN, size=14))
    b.append(text(620, 87, "\"여성이면 생존 쪽\"\n\"3등실이면 위험\" …", 13, MUTED))
    b.append(rect(10, 156, 700, 120, SURF, LINE2, 10))
    b.append(text(30, 180, "② 예측 (predict) — 처음 보는 사람에게 적용", 15, CYAN, "start", 700))
    b.append(box(30, 200, 200, 58, "새 승객 X\n(정답 모름)", size=13))
    b.append(arrow(236, 229, 380, 229, CYAN, 2.2))
    b.append(box(386, 196, 150, 66, "같은 모델", fill=SURF3, stroke=CYAN, color=CYAN, size=14))
    b.append(arrow(542, 229, 596, 229, CYAN, 2.2))
    b.append(box(600, 204, 96, 50, "생존 예측\n1 또는 0", stroke=ACC, color=ACC, size=13))
    return svg(720, 286, b, "학습 단계와 예측 단계")


@fig("ml00-problem-types")
def _():
    b = []
    b.append(box(300, 14, 160, 44, "머신러닝 문제", fill=SURF, stroke=INK2, size=15))
    b += [path("M340,58 L195,96", MUTED, 1.6), path("M420,58 L565,96", MUTED, 1.6)]
    b.append(box(105, 96, 180, 50, "지도 학습\n정답(y)이 있다", stroke=ACC, color=ACC, size=14))
    b.append(box(475, 96, 180, 50, "비지도 학습\n정답이 없다", stroke=CYAN, color=CYAN, size=14))
    b += [path("M160,146 L100,184", MUTED, 1.4), path("M230,146 L290,184", MUTED, 1.4), path("M530,146 L470,184", MUTED, 1.4), path("M600,146 L660,184", MUTED, 1.4)]
    leaves = [(100, "회귀: 숫자 맞히기", "내일 매출, 공정 온도,\n집값", ACC), (290, "분류: 종류 맞히기", "생존/사망, 고장/정상,\n스팸/정상", ACC),
              (470, "군집: 비슷한 것 묶기", "고객 무리 나누기,\n운전 패턴 찾기", CYAN), (660, "차원 축소: 요약", "열 13개 → 2개로\n그림 그리기", CYAN)]
    for x, t, ex, c in leaves:
        b.append(box(x - 80, 184, 160, 40, t, stroke=c, color=c, size=13))
        b.append(text(x, 252, ex, 12, MUTED))
    return svg(760, 284, b, "머신러닝 문제의 종류")


# ---------------- ml-01 ----------------
@fig("ml01-program-vs-ml")
def _():
    b = []
    b.append(text(20, 26, "보통의 프로그래밍", 15, MUTED, "start", 600))
    b += [box(20, 44, 150, 50, "규칙\n(사람이 작성)", stroke=CYAN, size=14), box(20, 104, 150, 50, "데이터", size=14)]
    b += [arrow(176, 99, 268, 99), box(274, 74, 170, 50, "프로그램", fill=SURF), arrow(450, 99, 540, 99), box(546, 74, 150, 50, "답", stroke=ACC, color=ACC)]
    b.append(line(20, 182, 700, 182, LINE, 1, "4 5"))
    b.append(text(20, 212, "머신러닝", 15, MUTED, "start", 600))
    b += [box(20, 230, 150, 50, "데이터", size=14), box(20, 290, 150, 50, "답\n(예전 기록)", stroke=ACC, size=14)]
    b += [arrow(176, 285, 268, 285), box(274, 260, 170, 50, "학습", fill=SURF), arrow(450, 285, 540, 285, ACC, accent=True), box(546, 260, 150, 50, "규칙\n(컴퓨터가 찾음)", stroke=CYAN, color=CYAN, size=14)]
    return svg(720, 356, b, "프로그래밍과 머신러닝 비교")


@fig("ml01-table-xy")
def _():
    cols = ["pclass", "sex", "age", "fare", "survived"]
    rows = [["3", "male", "22", "7.25", "0"], ["1", "female", "38", "71.28", "1"], ["3", "female", "26", "7.93", "1"], ["1", "female", "35", "53.10", "1"]]
    x0, y0, cw, rh = 20, 70, 100, 40
    b = []
    b.append(rect(x0 - 6, 22, cw * 4 + 12, 40, "none", CYAN, 8, 1.6, "5 4"))
    b.append(text(x0 + cw * 2, 42, "특성 X : 예측에 쓰는 정보", 15, CYAN, weight=700))
    b.append(rect(x0 + cw * 4 + 6 - 6, 22, cw + 12 - 12, 40, "none", ACC, 8, 1.6, "5 4"))
    b.append(text(x0 + cw * 4.5, 42, "정답 y", 15, ACC, weight=700))
    for j, c in enumerate(cols):
        b.append(rect(x0 + j * cw, y0, cw, rh, SURF, LINE2, 0))
        b.append(text(x0 + j * cw + cw / 2, y0 + rh / 2, c, 14, ACC if j == 4 else CYAN, weight=700, mono=True))
    for i, r in enumerate(rows):
        hi = i == 1
        for j, v in enumerate(r):
            b.append(rect(x0 + j * cw, y0 + (i + 1) * rh, cw, rh, "#2a2440" if hi else SURF3, TRACK if hi else LINE2, 0, 1.4 if hi else 1))
            b.append(text(x0 + j * cw + cw / 2, y0 + (i + 1.5) * rh, v, 14, INK, mono=True))
    yy = y0 + 2.5 * rh
    b.append(arrow(x0 + cw * 5 + 70, yy, x0 + cw * 5 + 8, yy, TRACK))
    b.append(text(x0 + cw * 5 + 76, yy, "행 = 사례 하나\n(승객 한 명)", 14, TRACK, "start", 700))
    return svg(720, 300, b, "표에서 행, 특성 X, 정답 y")


@fig("ml01-split")
def _():
    b = []
    x0, w = 30, 660
    tw = w * 0.75
    b.append(rect(x0, 60, tw, 56, "#2a2440", TRACK, 6, 1.6))
    b.append(text(x0 + tw / 2, 88, "학습용 (train) 75% · 668명", 16, INK, weight=700))
    b.append(rect(x0 + tw + 6, 60, w - tw - 6, 56, "#3a2a1c", ORANGE, 6, 1.6))
    b.append(text(x0 + tw + 6 + (w - tw - 6) / 2, 88, "시험용 25%\n223명", 14, INK, weight=700))
    b.append(text(x0 + w / 2, 30, "타이타닉 승객 891명을 섞은 뒤 나누기", 15, MUTED, weight=600))
    b.append(text(x0 + tw / 2, 146, "문제집: 모델이 보고 규칙을 배운다", 14, TRACK, weight=600))
    b.append(text(x0 + tw + (w - tw) / 2, 146, "시험지: 처음 보는 문제로\n실력 확인", 14, ORANGE, weight=600))
    return svg(720, 180, b, "학습용과 시험용으로 나누기")


# ---------------- ml-02 ----------------
@fig("ml02-reg-vs-clf")
def _():
    b = [rect(10, 10, 340, 270, SURF, LINE2, 10), rect(370, 10, 340, 270, SURF, LINE2, 10)]
    b.append(text(180, 38, "회귀: 숫자를 맞힌다", 16, CYAN, weight=700))
    b.append(text(540, 38, "분류: 종류를 맞힌다", 16, ACC, weight=700))
    b += [line(50, 240, 320, 240, LINE2), line(50, 240, 50, 70, LINE2)]
    r = pseudo(40, 7)
    for i in range(20):
        x = 60 + i * 13
        y = 225 - (x - 60) * 0.55 - (r[i] - 0.5) * 50
        b.append(circle(x, y, 4.5, CYAN, op=0.85))
    b.append(path("M55,228 L320,82", ACC, 2.4))
    b.append(text(185, 262, "예: 공기 온도 → 공정 온도는 몇 K?", 13, MUTED))
    r2 = pseudo(60, 11)
    for i in range(14):
        b.append(circle(400 + r2[i] * 120, 80 + r2[i + 20] * 150, 6, PASS, op=0.9))
        b.append(circle(570 + r2[i + 30] * 115, 80 + r2[i + 40] * 150, 6, FAIL, op=0.9))
    b.append(line(540, 70, 540, 240, ACC, 1.6, "5 4"))
    b.append(text(460, 252, "생존 (1)", 13, PASS, weight=700))
    b.append(text(630, 252, "사망 (0)", 13, FAIL, weight=700))
    return svg(720, 290, b, "회귀와 분류 비교")


@fig("ml02-sigmoid")
def _():
    b = [rect(10, 10, 300, 230, SURF, LINE2, 10), rect(410, 10, 300, 230, SURF, LINE2, 10)]
    b.append(text(160, 36, "직선: 끝없이 커지고 작아짐", 14, MUTED, weight=600))
    b += [line(40, 125, 290, 125, LINE2), line(165, 50, 165, 215, LINE2)]
    b.append(path("M50,205 L280,50", CYAN, 2.6))
    b.append(text(160, 225, "점수 = 기울기 × x + 절편", 13, CYAN))
    b.append(arrow(320, 125, 400, 125, ACC, 2.2, accent=True))
    b.append(text(360, 92, "S자로\n눌러 담기", 13, ACC, weight=700))
    b.append(text(560, 36, "확률: 항상 0 ~ 1 사이", 14, MUTED, weight=600))
    x0, x1, yb, yt = 440, 690, 200, 60
    b += [line(x0, yb, x1, yb, LINE2), line(x0, yt, x1, yt, LINE2, 1, "3 4")]
    pts = []
    for k in range(61):
        t = -6 + 12 * k / 60
        p = 1 / (1 + math.exp(-t))
        pts.append(f"{x0 + (x1 - x0) * k / 60:.1f},{yb - (yb - yt) * p:.1f}")
    b.append(path("M" + " L".join(pts), ACC, 2.8))
    ym = (yb + yt) / 2
    b.append(line(x0, ym, x1, ym, WARN, 1.4, "5 4"))
    b += [text(x0 - 8, yb, "0", 13, MUTED, "end"), text(x0 - 8, yt, "1", 13, MUTED, "end"), text(x1 - 4, ym - 12, "0.5 넘으면 1로 판정", 12, WARN, "end", 600)]
    b.append(text(560, 225, "예: 생존 확률 0.93", 13, ACC))
    return svg(720, 250, b, "직선을 S자 곡선으로 바꿔 확률 만들기")


# ---------------- ml-03 ----------------
def cm_grid(x0, y0, cs, hi=None):
    b = []
    labels = [["TP\n제대로 울림", "FN\n놓침"], ["FP\n헛경보", "TN\n조용히 잘 있음"]]
    colors = [[PASS, FAIL], [WARN, PASS]]
    for i in range(2):
        for j in range(2):
            c = colors[i][j]
            on = hi is None or (i, j) in hi
            b.append(rect(x0 + j * cs, y0 + i * cs * 0.62, cs, cs * 0.62, c if on else SURF3, c if on else LINE2, 0, 1.4, op=0.22 if on else 1))
            b.append(text(x0 + j * cs + cs / 2, y0 + i * cs * 0.62 + cs * 0.31, labels[i][j], 14, c if on else MUTED, weight=700))
    return b


@fig("ml03-confusion")
def _():
    x0, y0, cs = 230, 70, 210
    b = [text(x0 + cs, 22, "모델의 예측", 15, MUTED, weight=700),
         text(x0 + cs / 2, 50, "경보 울림 (1)", 14, INK, weight=600), text(x0 + cs * 1.5, 50, "경보 안 울림 (0)", 14, INK, weight=600),
         text(110, y0 + cs * 0.62 * 1, "실제", 15, MUTED, weight=700),
         text(180, y0 + cs * 0.31, "진짜 불\n(1)", 14, INK, weight=600), text(180, y0 + cs * 0.93, "불 없음\n(0)", 14, INK, weight=600)]
    b += cm_grid(x0, y0, cs)
    return svg(720, 340, b, "혼동행렬 네 칸")


@fig("ml03-precision-recall")
def _():
    b = []
    cs = 150
    for k, (title, hi, col, note) in enumerate([
        ("정밀도: 울린 것 중 진짜 불", {(0, 0), (1, 0)}, ACC, "TP ÷ (TP + FP)\n헛경보가 적을수록 ↑"),
        ("재현율: 진짜 불 중 울린 것", {(0, 0), (0, 1)}, CYAN, "TP ÷ (TP + FN)\n놓침이 적을수록 ↑")]):
        x0 = 30 + k * 360
        b.append(text(x0 + cs, 24, title, 15, col, weight=700))
        b += cm_grid(x0, 46, cs, hi)
        if k == 0:
            b.append(rect(x0 - 4, 42, cs + 8, cs * 1.24 + 8, "none", col, 6, 2.2, "6 4"))
        else:
            b.append(rect(x0 - 4, 42, cs * 2 + 8, cs * 0.62 + 8, "none", col, 6, 2.2, "6 4"))
        b.append(text(x0 + cs, 46 + cs * 1.24 + 36, note, 14, INK2, weight=600))
    return svg(720, 300, b, "정밀도와 재현율의 분모 비교")


# ---------------- ml-04 ----------------
@fig("ml04-tree")
def _():
    b = []
    def node(x, y, label, stroke=LINE2, color=INK, w=190):
        return box(x - w / 2, y - 24, w, 48, label, stroke=stroke, color=color, size=14)
    def leaf(x, y, label, good):
        c = PASS if good else FAIL
        return rect(x - 75, y - 22, 150, 44, c, c, 22, 1.4, op=0.18) + text(x, y, label, 14, c, weight=700)
    b.append(node(360, 40, "여성인가?", ACC, ACC))
    b += [path("M300,64 L180,120", MUTED, 1.6), path("M420,64 L540,120", MUTED, 1.6)]
    b += [text(225, 86, "예", 13, MUTED), text(495, 86, "아니오", 13, MUTED)]
    b.append(node(180, 144, "3등실인가?"))
    b.append(node(540, 144, "나이 ≤ 6.5 ?"))
    b += [path("M140,168 L95,222", MUTED, 1.6), path("M220,168 L265,222", MUTED, 1.6), path("M500,168 L455,222", MUTED, 1.6), path("M580,168 L625,222", MUTED, 1.6)]
    b += [text(105, 192, "아니오", 12, MUTED), text(258, 192, "예", 12, MUTED), text(465, 192, "예", 12, MUTED), text(620, 192, "아니오", 12, MUTED)]
    b += [leaf(95, 244, "대부분 생존", True), leaf(265, 244, "사망 쪽 (반반)", False), leaf(455, 244, "생존 많음", True), leaf(625, 244, "대부분 사망", False)]
    return svg(720, 280, b, "타이타닉 결정트리 예시")


@fig("ml04-overfit")
def _():
    b = []
    x0, y0, w, h = 70, 30, 600, 220
    b += [line(x0, y0 + h, x0 + w, y0 + h, LINE2), line(x0, y0, x0, y0 + h, LINE2)]
    b.append(text(x0 + w / 2, y0 + h + 28, "트리 깊이 (질문 수) →", 14, MUTED, weight=600))
    b.append(text(26, y0 + h / 2, "점수", 14, MUTED, weight=600))
    tr, te = [], []
    for k in range(11):
        x = x0 + w * k / 10
        tr.append(f"{x:.0f},{y0 + h - h * (0.55 + 0.43 * (1 - math.exp(-k / 2.6))):.0f}")
        sc = 0.55 + 0.26 * (1 - math.exp(-k / 1.6)) - 0.018 * max(0, k - 3) ** 1.35
        te.append(f"{x:.0f},{y0 + h - h * sc:.0f}")
    b.append(f'<rect x="{x0 + w * 0.42}" y="{y0}" width="{w * 0.58}" height="{h}" fill="{FAIL}" fill-opacity="0.07"/>')
    b.append(path("M" + " L".join(tr), TRACK, 2.8))
    b.append(path("M" + " L".join(te), ORANGE, 2.8))
    b.append(text(x0 + w - 6, y0 + 36, "학습용 점수: 계속 오름 (외움)", 13, TRACK, "end", 700))
    b.append(text(x0 + w - 6, y0 + h * 0.62, "시험용 점수: 오히려 떨어짐", 13, ORANGE, "end", 700))
    b.append(text(x0 + w * 0.42 + 10, y0 + h - 16, "과적합 구간", 13, FAIL, "start", 700))
    b.append(line(x0 + w * 0.3, y0, x0 + w * 0.3, y0 + h, ACC, 1.4, "5 4"))
    b.append(text(x0 + w * 0.3, y0 + h + 10, "적당한 깊이", 12, ACC, weight=700))
    return svg(720, 290, b, "깊이에 따른 학습·시험 점수")


@fig("ml04-forest")
def _():
    b = []
    votes = [1, 0, 1, 1, 0]
    for k, v in enumerate(votes):
        cx = 80 + k * 120
        b.append(circle(cx, 40, 10, SURF3, LINE2))
        b += [line(cx, 50, cx - 26, 82, LINE2, 1.4), line(cx, 50, cx + 26, 82, LINE2, 1.4)]
        b += [circle(cx - 26, 88, 8, SURF3, LINE2), circle(cx + 26, 88, 8, SURF3, LINE2)]
        b.append(text(cx, 118, f"트리 {k + 1}", 12, MUTED))
        c = PASS if v else FAIL
        b.append(rect(cx - 40, 136, 80, 32, c, c, 16, 1.2, op=0.18) + text(cx, 152, "생존" if v else "사망", 14, c, weight=700))
        b.append(arrow(cx, 172, 360 + (cx - 320) * 0.25, 206, MUTED, 1.2))
    b.append(box(250, 212, 220, 48, "다수결: 생존 (3 : 2)", fill=SURF, stroke=ACC, color=ACC))
    return svg(720, 272, b, "랜덤포레스트의 투표")


# ---------------- ml-05 ----------------
@fig("ml05-kfold")
def _():
    b = []
    x0, bw, bh = 120, 100, 34
    for i in range(5):
        y = 40 + i * 46
        b.append(text(60, y + bh / 2, f"{i + 1}번째", 14, MUTED, weight=600))
        for j in range(5):
            test = i == j
            b.append(rect(x0 + j * (bw + 6), y, bw, bh, ORANGE if test else TRACK, ORANGE if test else TRACK, 4, 1.2, op=0.35 if test else 0.16))
            b.append(text(x0 + j * (bw + 6) + bw / 2, y + bh / 2, "시험" if test else "학습", 13, ORANGE if test else INK2, weight=700 if test else 500))
        b.append(text(x0 + 5 * (bw + 6) + 14, y + bh / 2, f"점수 {i + 1}", 13, INK2, "start"))
    b.append(text(360, 22, "데이터를 5조각으로 나누고, 시험 조각을 돌아가며 바꾼다", 14, INK, weight=600))
    b.append(text(360, 290, "점수 5개의 평균 = 교차검증 점수", 15, ACC, weight=700))
    return svg(720, 310, b, "5-fold 교차검증")


@fig("ml05-grid")
def _():
    b = []
    depths = [2, 3, 4, 5, 6]
    scores = [0.62, 0.70, 0.76, 0.80, 0.77]
    x0, base, hmax = 120, 230, 170
    b.append(text(360, 24, "후보마다 5-fold 교차검증 → 평균 점수가 가장 높은 후보 선택", 14, INK, weight=600))
    b.append(line(x0 - 20, base, 660, base, LINE2))
    for k, (d, s) in enumerate(zip(depths, scores)):
        best = s == max(scores)
        x = x0 + k * 105
        hh = hmax * (s - 0.5) / 0.35
        c = ACC if best else TRACK
        b.append(rect(x, base - hh, 64, hh, c, c, 4, 1.2, op=0.6 if best else 0.25))
        b.append(text(x + 32, base + 20, f"max_depth={d}", 13, INK2, mono=True))
        if best:
            b.append(text(x + 32, base - hh - 18, "최고!", 14, ACC, weight=700))
    b.append(text(360, 276, "(막대 높이는 설명용 예시)", 12, MUTED))
    return svg(720, 292, b, "GridSearchCV 개념")


# ---------------- ml-06 ----------------
@fig("ml06-onehot")
def _():
    b = []
    vals = ["Third", "First", "Third", "Second"]
    b.append(box(40, 30, 140, 36, "class", fill=SURF, color=CYAN, size=14))
    for i, v in enumerate(vals):
        b.append(box(40, 66 + i * 36, 140, 36, v, rx=0, size=14, weight=500))
    b.append(arrow(200, 120, 280, 120, ACC, 2.2, accent=True))
    b.append(text(240, 98, "원-핫", 13, ACC, weight=700))
    heads = ["First", "Second", "Third"]
    for j, h in enumerate(heads):
        b.append(box(300 + j * 120, 30, 120, 36, f"class_{h}", fill=SURF, color=CYAN, size=13, rx=0))
        for i, v in enumerate(vals):
            on = v == h
            b.append(rect(300 + j * 120, 66 + i * 36, 120, 36, ACC if on else SURF3, LINE2, 0, 1, op=0.25 if on else 1))
            b.append(text(360 + j * 120, 84 + i * 36, "1" if on else "0", 15, ACC if on else MUTED, weight=700 if on else 400, mono=True))
    b.append(text(360, 232, "범주마다 0/1 열을 하나씩: 해당 칸에만 동그라미", 14, INK2, weight=600))
    return svg(720, 250, b, "원-핫 인코딩")


@fig("ml06-scale")
def _():
    b = []
    def numline(y, lo, hi, label, pts, color, unit):
        x0, x1 = 160, 680
        o = [line(x0, y, x1, y, LINE2, 1.4), text(x0 - 14, y, label, 14, color, "end", 700)]
        for t in (lo, (lo + hi) / 2, hi):
            x = x0 + (x1 - x0) * (t - lo) / (hi - lo)
            o += [line(x, y - 5, x, y + 5, LINE2), text(x, y + 20, f"{t:g}{unit}", 12, MUTED)]
        for p in pts:
            o.append(circle(x0 + (x1 - x0) * (p - lo) / (hi - lo), y, 5, color, op=0.8))
        return o
    b.append(text(20, 24, "표준화 전: 단위가 달라 거리 비교가 불공정", 14, MUTED, "start", 700))
    b += numline(64, 0, 500, "운임", [7, 8, 13, 26, 31, 53, 71, 80, 151, 263, 512 - 12], ORANGE, "")
    b += numline(118, 0, 80, "나이", [2, 14, 22, 26, 29, 35, 38, 45, 54, 62], CYAN, "")
    b.append(text(20, 170, "표준화 후: 둘 다 평균 0, 퍼짐 1 근처", 14, ACC, "start", 700))
    b += numline(210, -3, 3, "운임", [-0.64, -0.63, -0.53, -0.27, -0.17, 0.33, 0.73, 0.9, 2.3, 4.6 - 1.9, 2.9], ORANGE, "")
    b += numline(264, -3, 3, "나이", [-2.0, -1.2, -0.6, -0.3, -0.1, 0.4, 0.6, 1.1, 1.7, 2.3], CYAN, "")
    return svg(720, 296, b, "표준화 전후 비교")


@fig("ml06-pipeline")
def _():
    b = []
    b.append(box(20, 40, 150, 46, "숫자 열\nage · fare …", stroke=CYAN, color=CYAN, size=13))
    b.append(box(20, 150, 150, 46, "글자 열\nsex · class …", stroke=ORANGE, color=ORANGE, size=13))
    b += [arrow(174, 63, 214, 63), box(218, 40, 130, 46, "빈칸 → 중앙값", size=13), arrow(352, 63, 392, 63), box(396, 40, 110, 46, "표준화", size=13)]
    b += [arrow(174, 173, 214, 173), box(218, 150, 130, 46, "빈칸 → 최빈값", size=13), arrow(352, 173, 392, 173), box(396, 150, 110, 46, "원-핫", size=13)]
    b.append(rect(208, 22, 310, 190, "none", TRACK, 10, 1.4, "6 4"))
    b.append(text(363, 232, "ColumnTransformer: 열 종류마다 다른 손질", 13, TRACK, weight=700))
    b += [arrow(510, 63, 560, 108), arrow(510, 173, 560, 128)]
    b.append(box(564, 94, 136, 48, "로지스틱 회귀", fill=SURF, stroke=ACC, color=ACC, size=14))
    b.append(rect(8, 8, 704, 248, "none", ACC, 12, 1.2, "2 5"))
    b.append(text(632, 30, "Pipeline 전체", 13, ACC, weight=700))
    return svg(720, 264, b, "ColumnTransformer와 Pipeline 흐름")


# ---------------- ml-07 ----------------
@fig("ml07-sup-vs-unsup")
def _():
    b = [rect(10, 10, 340, 250, SURF, LINE2, 10), rect(370, 10, 340, 250, SURF, LINE2, 10)]
    b += [text(180, 36, "지도 학습: 정답(색)이 있다", 15, ACC, weight=700), text(540, 36, "비지도 학습: 정답이 없다", 15, CYAN, weight=700)]
    r = pseudo(120, 5)
    centers = [(90, 110), (250, 100), (170, 200)]
    cols = [PASS, FAIL, WARN]
    for g, (cx, cy) in enumerate(centers):
        for k in range(12):
            dx, dy = (r[g * 24 + k] - 0.5) * 80, (r[g * 24 + k + 12] - 0.5) * 60
            b.append(circle(cx + dx, cy + dy, 5, cols[g], op=0.9))
            b.append(circle(cx + dx + 360, cy + dy, 5, MUTED, op=0.7))
    b.append(text(180, 244, "\"이 패턴이면 고장\"을 배운다", 13, INK2))
    b.append(text(540, 244, "비슷한 점끼리 묶어 구조를 찾는다", 13, INK2))
    return svg(720, 270, b, "지도 학습과 비지도 학습")


@fig("ml07-kmeans-steps")
def _():
    b = []
    r = pseudo(200, 21)
    pts = []
    for g, (cx, cy) in enumerate([(55, 70), (125, 60), (90, 135)]):
        for k in range(9):
            pts.append((cx + (r[g * 20 + k] - 0.5) * 50, cy + (r[g * 20 + k + 10] - 0.5) * 40, g))
    cols = [ACC, CYAN, ORANGE]
    titles = ["① 깃발 k개 꽂기", "② 가까운 깃발로", "③ 깃발을 한가운데로", "④ 안 바뀔 때까지 반복"]
    start = [(40, 140), (150, 120), (70, 40)]
    final = [(55, 70), (125, 60), (90, 135)]
    def flag(x, y, c):
        return line(x, y, x, y - 22, c, 2) + f'<path d="M{x},{y - 22} L{x + 14},{y - 17} L{x},{y - 12} z" fill="{c}"/>'
    for p in range(4):
        ox = 10 + p * 178
        b.append(rect(ox, 10, 168, 200, SURF, LINE2, 10))
        b.append(text(ox + 84, 226, titles[p], 13, INK, weight=700))
        for (x, y, g) in pts:
            if p == 0:
                c = MUTED
            elif p == 1:
                d = [(x - sx) ** 2 + (y - sy) ** 2 for sx, sy in start]
                c = cols[d.index(min(d))]
            else:
                c = cols[g]
            b.append(circle(ox + x + 4, y + 20, 4, c, op=0.85))
        fl = start if p < 2 else final
        for k, (fx, fy) in enumerate(fl):
            b.append(flag(ox + fx + 4, fy + 20, cols[k]))
        if p == 2:
            for k in range(3):
                b.append(arrow(ox + start[k][0] + 4, start[k][1] + 20, ox + final[k][0] + 4, final[k][1] + 24, MUTED, 1.2, "3 3"))
    return svg(720, 240, b, "K-means 4단계")


@fig("ml07-pca")
def _():
    b = [rect(10, 10, 700, 280, SURF, LINE2, 10)]
    r = pseudo(200, 33)
    cx, cy, ang = 330, 150, -0.5
    for k in range(70):
        u = (r[k] - 0.5) * 2 * 230 * (0.6 + 0.4 * r[k + 70])
        v = (r[k + 140 if k + 140 < 200 else k] - 0.5) * 70
        x = cx + u * math.cos(ang) - v * math.sin(ang)
        y = cy + u * math.sin(ang) + v * math.cos(ang)
        b.append(circle(x, y, 4, TRACK, op=0.7))
    L1, L2 = 220, 60
    b.append(arrow(cx, cy, cx + L1 * math.cos(ang), cy + L1 * math.sin(ang), ACC, 3, accent=True))
    b.append(arrow(cx, cy, cx - L2 * math.sin(ang), cy + L2 * math.cos(ang), CYAN, 3))
    b.append(text(cx + L1 * math.cos(ang) + 10, cy + L1 * math.sin(ang) - 14, "PC1: 가장 넓게 퍼진 방향", 14, ACC, "start", 700))
    b.append(text(cx - L2 * math.sin(ang) + 12, cy + L2 * math.cos(ang) + 16, "PC2: PC1과 수직, 그다음으로 퍼진 방향", 14, CYAN, "start", 700))
    return svg(720, 300, b, "PCA 주성분 방향")


# ---------------- ml-08 ----------------
@fig("ml08-imbalance")
def _():
    b = []
    fails = {17, 54, 88}
    for k in range(100):
        i, j = divmod(k, 20)
        f = k in fails
        b.append(circle(40 + j * 32, 40 + i * 32, 10 if f else 9, FAIL if f else SURF3, FAIL if f else LINE2, 1.4))
    b.append(text(360, 210, "100건 중 고장은 3~4건 (AI4I: 3.4%)", 15, INK, weight=700))
    b.append(text(360, 236, "\"전부 정상\"이라고 찍어도 정확도 96.6% — 하지만 고장은 하나도 못 잡는다", 13, MUTED))
    return svg(720, 256, b, "불균형 데이터 점 그림")


@fig("ml08-cost")
def _():
    b = []
    b.append(path("M360,70 L360,210", MUTED, 3))
    b.append(path("M300,226 L420,226 L360,206 z", MUTED, 2, SURF3))
    tilt = 0.22
    lx, ly = 360 - 230 * math.cos(tilt), 70 + 230 * math.sin(tilt)
    rx_, ry = 360 + 230 * math.cos(tilt), 70 - 230 * math.sin(tilt)
    b.append(path(f"M{lx:.0f},{ly:.0f} L{rx_:.0f},{ry:.0f}", INK2, 3))
    b.append(box(lx - 110, ly + 10, 220, 74, "놓침 (FN) 1건\n라인 정지 · 수리비 · 납기 지연", fill="#3a1d24", stroke=FAIL, color=FAIL, size=14))
    b.append(box(rx_ - 100, ry + 10, 200, 56, "헛경보 (FP) 1건\n점검 10분", fill="#3a3418", stroke=WARN, color=WARN, size=14))
    b.append(text(360, 262, "놓침이 훨씬 비싸면 → 기준선을 낮춰 재현율을 높인다", 15, ACC, weight=700))
    return svg(720, 280, b, "놓침 비용과 헛경보 비용 저울")


@fig("ml08-oversample")
def _():
    b = []
    def row(y, title, good, steps):
        c = PASS if good else FAIL
        o = [text(20, y + 26, title, 15, c, "start", 700)]
        x = 150
        for k, (lbl, w) in enumerate(steps):
            o.append(box(x, y, w, 52, lbl, size=13))
            x += w
            if k < len(steps) - 1:
                o.append(arrow(x + 4, y + 26, x + 30, y + 26))
                x += 34
        return o
    b += row(20, "올바름 ✓", True, [("① train / test\n나누기", 140), ("② train의 고장 행만\n복사해 늘리기", 170), ("③ 학습 → test로\n평가", 150)])
    b += row(110, "누수 ✗", False, [("① 고장 행 복사해\n늘리기", 140), ("② train / test\n나누기", 170), ("③ 같은 행 복사본이\ntrain·test 양쪽에!", 150)])
    b.append(rect(148 + 140 + 34 + 170 + 34 - 2, 108, 154, 56, "none", FAIL, 8, 2, "5 4"))
    b.append(text(360, 196, "복사본이 시험지에 섞이면 \"이미 본 문제\"를 맞혀 점수가 부풀려진다", 14, INK2, weight=600))
    return svg(720, 214, b, "오버샘플링 순서")


# ---------------- ml-09 ----------------
@fig("ml09-permutation")
def _():
    b = []
    vals = ["35.2", "62.1", "41.0", "28.7", "57.4"]
    shuf = ["41.0", "28.7", "57.4", "35.2", "62.1"]
    def table(x0, title, col, color, hi):
        o = [text(x0 + 165, 22, title, 14, color, weight=700)]
        for j, h in enumerate(["rpm", "torque", "tool_wear"]):
            o.append(box(x0 + j * 110, 38, 110, 32, h, fill=SURF, color=(ACC if (hi and j == 1) else CYAN), size=13, rx=0))
            for i in range(5):
                v = col[i] if j == 1 else ["1551", "1408", "1498", "1433", "1408"][i] if j == 0 else ["0", "3", "5", "7", "9"][i]
                on = hi and j == 1
                o.append(rect(x0 + j * 110, 70 + i * 30, 110, 30, ACC if on else SURF3, LINE2, 0, 1, op=0.18 if on else 1))
                o.append(text(x0 + j * 110 + 55, 85 + i * 30, v, 13, ACC if on else INK2, mono=True))
        return o
    b += table(20, "원래 테스트 데이터", vals, INK, False)
    b += table(380, "torque 열만 무작위로 섞기", shuf, ACC, True)
    b.append(arrow(355, 135, 375, 135, ACC, 2.2, accent=True))
    b.append(text(185, 246, "재현율 0.61", 15, INK, weight=700))
    b.append(text(545, 246, "재현율 뚝 ↓  →  torque가 중요하다", 15, ACC, weight=700))
    return svg(720, 266, b, "순열 중요도: 한 열만 섞기")


@fig("ml09-pdp")
def _():
    b = []
    b.append(text(20, 24, "모든 설비의 torque를 같은 값으로 바꾸고, 나머지 열은 그대로 → 평균 고장 확률", 14, INK, "start", 600))
    for k, t in enumerate([20, 45, 70]):
        x0 = 20 + k * 130
        b.append(rect(x0, 44, 116, 128, SURF, LINE2, 8))
        b.append(text(x0 + 58, 60, f"torque = {t}", 13, ACC, weight=700, mono=True))
        for i in range(4):
            b.append(rect(x0 + 10, 74 + i * 22, 96, 18, SURF3, LINE2, 3))
            b.append(text(x0 + 58, 83 + i * 22, f"… {t} …", 11, INK2, mono=True))
        b.append(text(x0 + 58, 190, ["평균 3%", "평균 3%", "평균 87%"][k], 13, [INK2, INK2, FAIL][k], weight=700))
    b.append(arrow(410, 110, 440, 110, ACC, 2.2, accent=True))
    x0, y0, w, h = 470, 44, 230, 150
    b += [line(x0, y0 + h, x0 + w, y0 + h, LINE2), line(x0, y0, x0, y0 + h, LINE2)]
    pts = [(20, .032), (25, .03), (30, .028), (35, .028), (40, .026), (45, .028), (50, .03), (55, .082), (60, .305), (65, .689), (70, .87)]
    d = "M" + " L".join(f"{x0 + w * (t - 20) / 50:.0f},{y0 + h - h * p:.0f}" for t, p in pts)
    b.append(path(d, ACC, 2.6))
    for t, p in pts:
        b.append(circle(x0 + w * (t - 20) / 50, y0 + h - h * p, 3.5, ACC))
    b += [text(x0 + w / 2, y0 + h + 18, "torque 20 → 70", 12, MUTED), text(x0 - 6, y0, "1", 12, MUTED, "end"), text(x0 - 6, y0 + h, "0", 12, MUTED, "end")]
    b.append(text(x0 + 120, y0 + 50, "55~60부터\n급상승", 13, FAIL, "start", 700))
    return svg(720, 236, b, "부분 의존도 계산 과정")


# ---------------- 2026-11-05 세분화 추가 ----------------
@fig("ml02-gd")
def _():
    b = []
    x0, y0, w, h = 60, 30, 600, 210
    def curve(t):  # t in [-1,1] -> loss 0..1
        return t * t
    pts = [(-1 + 2 * i / 60) for i in range(61)]
    d = "M" + " L".join(f"{x0 + w * (t + 1) / 2:.1f},{y0 + h - h * curve(t):.1f}" for t in pts)
    b.append(path(d, MUTED, 2.4))
    b.append(line(x0, y0 + h, x0 + w, y0 + h, LINE2, 1.2))
    steps = [-0.92, -0.62, -0.38, -0.2, -0.08]
    for i, t in enumerate(steps):
        cx, cy = x0 + w * (t + 1) / 2, y0 + h - h * curve(t)
        b.append(circle(cx, cy - 9, 9, ACC if i == len(steps) - 1 else CYAN, op=1 if i == len(steps) - 1 else 0.35 + 0.15 * i))
        b.append(text(cx, cy - 30, f"{i + 1}", 13, INK2, weight=700))
        if i < len(steps) - 1:
            t2 = steps[i + 1]
            b.append(arrow(cx + 10, cy - 14, x0 + w * (t2 + 1) / 2 - 10, y0 + h - h * curve(t2) - 14, ACC, 1.8, accent=True))
    b.append(text(x0 + w / 2, y0 + h + 22, "기울기 w (또는 절편 b)", 13, MUTED))
    b.append(text(x0 - 10, y0 + 10, "오차\n(MSE)", 13, MUTED, "end"))
    b.append(text(x0 + w / 2 + 20, y0 + h - 55, "↙ 가장 낮은 곳", 13, ACC, "start", 700))
    b.append(text(x0 + w / 2, y0 + 20, "한 걸음 = 학습률 × 기울기\n기울기의 반대 방향으로 이동", 13, INK2))
    return svg(720, 280, b, "경사하강법: 오차 그릇을 따라 내려가기")


@fig("ml04-gini")
def _():
    b = []
    def jar(x, label, n_s, n_d, g, col):
        out = [rect(x, 30, 180, 150, SURF, LINE2, 12)]
        tot = n_s + n_d
        for k in range(tot):
            cx, cy = x + 22 + (k % 8) * 20, 52 + (k // 8) * 20
            out.append(circle(cx, cy, 7, PASS if k < n_s else FAIL, op=0.9))
        out.append(text(x + 90, 200, label, 14, INK, weight=700))
        out.append(text(x + 90, 222, f"지니 {g}", 14, col, weight=700))
        return out
    b += jar(20, "섞여 있음 (반반)", 16, 16, "0.5", FAIL)
    b += jar(270, "조금 섞임", 24, 8, "0.375", WARN)
    b += jar(520, "한쪽만 (전부 생존)", 32, 0, "0", ACC)
    b.append(text(360, 252, "초록 = 생존, 빨강 = 사망. 섞임이 적을수록 지니가 0에 가깝습니다.", 13, MUTED))
    return svg(720, 270, b, "지니 불순도: 상자 안이 얼마나 섞였나")


@fig("ml10-knn")
def _():
    b = [rect(10, 10, 700, 270, SURF, LINE2, 10)]
    r = pseudo(80, 33)
    for k in range(18):
        b.append(circle(120 + (r[k] - 0.5) * 180, 140 + (r[k + 18] - 0.5) * 180, 7, PASS, op=0.9))
        b.append(circle(560 + (r[k + 36] - 0.5) * 180, 140 + (r[k + 54] - 0.5) * 170, 7, FAIL, op=0.9))
    near = [(300, 120, PASS), (330, 175, PASS), (285, 165, PASS), (390, 110, FAIL), (395, 185, FAIL)]
    for x, y, c in near:
        b.append(circle(x, y, 7, c, op=0.95))
    b.append(f'<circle cx="340" cy="148" r="72" fill="none" stroke="{CYAN}" stroke-width="1.6" stroke-dasharray="5 4"/>')
    b.append(circle(340, 148, 9, ACC, INK, 2))
    b.append(text(340, 236, "새 승객(노란 점)의 가장 가까운 5명: 생존 3, 사망 2 → 생존으로 예측", 14, INK, weight=700))
    b.append(text(120, 34, "생존", 14, PASS, weight=700))
    b.append(text(560, 34, "사망", 14, FAIL, weight=700))
    return svg(720, 290, b, "KNN: 가까운 이웃 k명의 투표")


@fig("ml10-svm")
def _():
    b = [rect(10, 10, 700, 270, SURF, LINE2, 10)]
    r = pseudo(60, 47)
    for k in range(14):
        b.append(circle(110 + r[k] * 150, 60 + r[k + 14] * 120 + r[k] * 60, 7, PASS, op=0.85))
        b.append(circle(440 + r[k + 28] * 180, 120 + r[k + 42] * 120 - r[k + 28] * 40, 7, FAIL, op=0.85))
    # margin lines (diagonal)
    b.append(line(250, 270, 430, 20, ACC, 2.4))
    b.append(line(195, 270, 375, 20, CYAN, 1.4, "6 5"))
    b.append(line(305, 270, 485, 20, CYAN, 1.4, "6 5"))
    for x, y, c in [(281, 150, PASS), (245, 200, PASS), (399, 140, FAIL), (363, 190, FAIL)]:
        b.append(circle(x, y, 9, c, INK, 2.2))
    b.append(text(560, 50, "경계선: 복도 한가운데", 14, ACC, "start", 700))
    b.append(text(560, 74, "점선 사이 = 마진(복도 폭)", 13, CYAN, "start"))
    b.append(text(560, 98, "테두리 점 = 서포트 벡터", 13, INK, "start"))
    return svg(720, 290, b, "SVM: 가장 넓은 복도를 내는 경계선")


# ---------------- 2026-11-05 추가: 그림 없던 레슨 ----------------
@fig("ml01-missing")
def _():
    b = []
    # mini table
    cols = ["age", "embarked", "deck"]
    rows = [["22", "S", "NaN"], ["NaN", "C", "C"], ["26", "S", "NaN"], ["35", "NaN", "NaN"], ["NaN", "Q", "NaN"]]
    x0, y0, cw, rh = 20, 40, 78, 34
    b.append(text(x0 + cw * 1.5, 22, "빈칸(NaN)이 섞인 표", 14, MUTED, weight=600))
    for j, c in enumerate(cols):
        b.append(box(x0 + j * cw, y0, cw, rh, c, fill=SURF, size=13, rx=0))
    for i, r in enumerate(rows):
        for j, v in enumerate(r):
            nan = v == "NaN"
            b.append(rect(x0 + j * cw, y0 + (i + 1) * rh, cw, rh, FAIL if nan else SURF3, LINE2, 0, op=0.18 if nan else 1))
            b.append(text(x0 + j * cw + cw / 2, y0 + (i + 1.5) * rh, v, 13, FAIL if nan else INK2, mono=True))
    b.append(text(x0 + cw * 2.5, y0 + 6.6 * rh, "77% 빔", 12, FAIL, weight=700))
    b.append(text(x0 + cw * 0.5, y0 + 6.6 * rh, "20% 빔", 12, WARN, weight=700))
    b.append(text(x0 + cw * 1.5, y0 + 6.6 * rh, "0.2% 빔", 12, MUTED, weight=700))
    # three choices
    bx, bw, bh = 330, 370, 70
    items = [
        ("① 행 지우기  dropna()", "빈칸이 아주 적을 때 (embarked 2칸)", MUTED),
        ("② 열 통째로 빼기  drop(columns=…)", "대부분 비어 쓸 수 없을 때 (deck)", FAIL),
        ("③ 채우기  fillna(중앙값·최빈값)", "꽤 비었지만 중요한 열 (age)", ACC),
    ]
    for i, (t, s, c) in enumerate(items):
        y = 34 + i * (bh + 16)
        b.append(rect(bx, y, bw, bh, SURF3, c, 10, 1.6))
        b.append(text(bx + 18, y + 24, t, 14, c, "start", 700))
        b.append(text(bx + 18, y + 50, s, 13, INK2, "start"))
        b.append(arrow(268, 150, bx - 6, y + bh / 2, MUTED, 1.4))
    return svg(720, 300, b, "결측치를 다루는 세 가지 방법")


@fig("ml01-encoding")
def _():
    b = []
    b.append(rect(10, 10, 330, 250, SURF, LINE2, 10))
    b.append(text(30, 36, "라벨 인코딩: S=0, C=1, Q=2", 15, FAIL, "start", 700))
    y = 120
    b.append(line(50, y, 310, y, LINE2, 2))
    for i, (lab, x) in enumerate([("S", 70), ("C", 175), ("Q", 280)]):
        b.append(line(x, y - 8, x, y + 8, MUTED, 2))
        b.append(circle(x, y, 10, CYAN))
        b.append(text(x, y - 30, lab, 16, INK, weight=700))
        b.append(text(x, y + 28, str(i), 15, MUTED, mono=True))
    b.append(text(175, 190, "모델은 숫자를 '크기'로 읽는다", 13, INK2))
    b.append(text(175, 215, "Q는 C의 2배? S와 Q의 평균이 C?", 13, FAIL, weight=600))
    b.append(text(175, 240, "→ 순서 없는 범주에는 맞지 않음", 13, MUTED))

    b.append(rect(360, 10, 350, 250, SURF, LINE2, 10))
    b.append(text(380, 36, "원-핫 인코딩: 범주마다 0/1 열", 15, ACC, "start", 700))
    hdr = ["embarked", "is_S", "is_C", "is_Q"]
    data = [["S", "1", "0", "0"], ["C", "0", "1", "0"], ["Q", "0", "0", "1"]]
    x0, y0, cw, rh = 380, 60, 76, 34
    for j, h in enumerate(hdr):
        b.append(box(x0 + j * cw, y0, cw, rh, h, fill=SURF3, size=12, rx=0, color=INK if j == 0 else ACC))
    for i, r in enumerate(data):
        for j, v in enumerate(r):
            on = v == "1"
            b.append(rect(x0 + j * cw, y0 + (i + 1) * rh, cw, rh, ACC if on else SURF3, LINE2, 0, op=0.22 if on else 1))
            b.append(text(x0 + j * cw + cw / 2, y0 + (i + 1.5) * rh, v, 14, ACC if on else INK2, mono=True, weight=700 if on else 500))
    b.append(text(535, 225, "각 항구가 서로 같은 거리 → 가짜 크기 관계 없음", 13, INK2))
    b.append(text(535, 247, "pd.get_dummies()", 13, MUTED, mono=True))
    return svg(720, 270, b, "라벨 인코딩과 원-핫 인코딩 비교")


R2_PTS = [(0.5, 2.2), (1.2, 2.6), (1.9, 3.9), (2.6, 3.5), (3.3, 5.0), (4.0, 4.6), (4.7, 6.1), (5.4, 6.3)]


def _r2_panel(ox, title, color, fit):
    b = [rect(ox, 10, 340, 250, SURF, LINE2, 10), text(ox + 20, 36, title, 15, color, "start", 700)]
    px = lambda x: ox + 30 + x * 52
    py = lambda y: 240 - y * 26
    b.append(line(ox + 25, 240, ox + 325, 240, LINE2, 1.4))
    b.append(line(ox + 25, 60, ox + 25, 240, LINE2, 1.4))
    mean = sum(y for _, y in R2_PTS) / len(R2_PTS)
    for x, y in R2_PTS:
        yy = mean if not fit else 1.6 + 0.85 * x
        b.append(line(px(x), py(y), px(x), py(yy), color, 2.4))
    if fit:
        b.append(line(px(0), py(1.6), px(5.8), py(1.6 + 0.85 * 5.8), color, 2.2))
    else:
        b.append(line(px(0), py(mean), px(5.8), py(mean), color, 2.2, "7 5"))
    for x, y in R2_PTS:
        b.append(circle(px(x), py(y), 6, INK))
    return b


@fig("ml02-r2")
def _():
    b = []
    b += _r2_panel(10, "평균만 찍기: 오차가 길다", MUTED, False)
    b += _r2_panel(370, "회귀 직선: 오차가 짧다", ACC, True)
    b.append(text(360, 290, "R² = 1 − (오른쪽 세로 막대 길이² 합) / (왼쪽 세로 막대 길이² 합)", 14, INK, weight=600))
    b.append(text(360, 314, "1에 가까울수록 '평균만 찍기'보다 훨씬 낫다 · 0이면 평균과 똑같다 · 음수면 평균보다 못하다", 12, MUTED))
    return svg(720, 330, b, "R²: 평균선의 오차와 회귀 직선의 오차 비교")


def _bump(cx, sd, amp, x0, x1, px, py):
    pts = []
    for i in range(61):
        x = x0 + (x1 - x0) * i / 60
        pts.append((px(x), py(amp * math.exp(-((x - cx) ** 2) / (2 * sd * sd)))))
    return "M" + " L".join(f"{a:.1f},{c:.1f}" for a, c in pts)


@fig("ml03-threshold")
def _():
    b = []
    px = lambda p: 50 + p * 600
    py = lambda v: 230 - v * 160
    b.append(line(40, 230, 670, 230, LINE2, 1.4))
    for t in [0, 0.25, 0.5, 0.75, 1.0]:
        b.append(text(px(t), 248, f"{t:g}", 12, MUTED, mono=True))
    b.append(text(360, 272, "모델이 낸 '고장 확률'", 13, MUTED))
    b.append(path(_bump(0.22, 0.12, 1.0, 0, 1, px, py) + f" L{px(1)},{py(0)} L{px(0)},{py(0)} Z", PASS, 1.8, PASS + "33"))
    b.append(path(_bump(0.68, 0.14, 0.55, 0, 1, px, py) + f" L{px(1)},{py(0)} L{px(0)},{py(0)} Z", FAIL, 1.8, FAIL + "33"))
    b.append(text(px(0.06), 70, "정상 장비", 14, PASS, weight=700))
    b.append(text(px(0.86), 110, "고장 장비", 14, FAIL, weight=700))
    b.append(line(px(0.5), 40, px(0.5), 230, ACC, 2.4))
    b.append(text(px(0.5), 28, "임계값 0.5", 13, ACC, weight=700))
    b.append(line(px(0.3), 40, px(0.3), 230, CYAN, 2, "6 5"))
    b.append(text(px(0.3), 28, "0.3으로 낮추면", 12, CYAN, weight=700))
    b.append(text(690, 150, "선 오른쪽 = '고장'으로 경보", 13, INK, "start", 600))
    b.append(text(690, 178, "낮추면: 놓치는 고장↓ (재현율↑)", 13, CYAN, "start"))
    b.append(text(690, 200, "         헛경보↑ (정밀도↓)", 13, CYAN, "start"))
    b.append(text(690, 228, "올리면: 그 반대", 13, MUTED, "start"))
    return svg(920, 290, b, "임계값을 옮기면 재현율과 정밀도가 바뀐다")


@fig("ml05-valcurve")
def _():
    b = []
    px = lambda d: 70 + (d - 1) * 42
    py = lambda s: 250 - (s - 0.6) * 520
    b.append(rect(px(1), 40, px(3.5) - px(1), 210, CYAN, "none", 0, op=0.07))
    b.append(rect(px(3.5), 40, px(6.5) - px(3.5), 210, ACC, "none", 0, op=0.09))
    b.append(rect(px(6.5), 40, px(14) - px(6.5), 210, FAIL, "none", 0, op=0.07))
    b.append(text((px(1) + px(3.5)) / 2, 236, "과소적합", 13, CYAN, weight=700))
    b.append(text((px(3.5) + px(6.5)) / 2, 236, "알맞음", 13, ACC, weight=700))
    b.append(text((px(6.5) + px(14)) / 2, 236, "과대적합 (외우기)", 13, FAIL, weight=700))
    b.append(line(px(1), 250, px(14), 250, LINE2, 1.4))
    b.append(line(px(1), 40, px(1), 250, LINE2, 1.4))
    for d in [1, 3, 5, 7, 9, 11, 13]:
        b.append(text(px(d), 266, str(d), 12, MUTED, mono=True))
    b.append(text(px(7.5), 290, "max_depth (나무 깊이)", 13, MUTED))
    tr = [0.79, 0.81, 0.83, 0.85, 0.87, 0.89, 0.91, 0.93, 0.95, 0.96, 0.97, 0.98, 0.985, 0.99]
    va = [0.78, 0.79, 0.81, 0.82, 0.825, 0.82, 0.81, 0.80, 0.795, 0.79, 0.785, 0.78, 0.78, 0.775]
    b.append(path("M" + " L".join(f"{px(i + 1):.1f},{py(s):.1f}" for i, s in enumerate(tr)), ORANGE, 2.6))
    b.append(path("M" + " L".join(f"{px(i + 1):.1f},{py(s):.1f}" for i, s in enumerate(va)), CYAN, 2.6))
    b.append(text(px(13.6), py(0.99) + 20, "학습 점수", 13, ORANGE, "end", 700))
    b.append(text(px(13.6), py(0.775) + 18, "검증 점수", 13, CYAN, "end", 700))
    b.append(circle(px(5), py(0.825), 7, ACC, INK, 2))
    b.append(text(px(5), py(0.825) + 26, "검증 점수 최고", 12, ACC, weight=700))
    b.append(line(px(12), py(0.98), px(12), py(0.78), INK2, 1.4, "4 4"))
    b.append(text(px(12) - 8, py(0.88), "벌어진 틈\n= 외운 정도", 12, INK2, "end"))
    return svg(680, 300, b, "검증 곡선의 세 구간: 과소적합, 알맞음, 과대적합")


@fig("ml07-elbow")
def _():
    b = []
    ks = [1, 2, 3, 4, 5, 6]
    vals = [4000, 1699, 987, 760, 610, 520]
    px = lambda k: 80 + (k - 1) * 100
    py = lambda v: 250 - v / 4000 * 200
    b.append(line(60, 250, 600, 250, LINE2, 1.4))
    b.append(line(60, 40, 60, 250, LINE2, 1.4))
    b.append(text(330, 286, "k (그룹 수)", 13, MUTED))
    b.append(text(66, 28, "inertia", 13, MUTED, "start", mono=True))
    b.append(path("M" + " L".join(f"{px(k)},{py(v):.1f}" for k, v in zip(ks, vals)), CYAN, 2.6))
    for k, v in zip(ks, vals):
        b.append(circle(px(k), py(v), 6, ACC if k == 3 else CYAN, INK if k == 3 else "none", 2))
        b.append(text(px(k), 266, str(k), 12, MUTED, mono=True))
    b.append(text(px(3) + 14, py(987) - 62, "엘보(팔꿈치): 여기부터\n줄어드는 폭이 확 작아짐", 13, ACC, "start", 700))
    b.append(text(px(1.5) + 14, py(2800), "크게 줄어듦", 12, INK2, "start"))
    b.append(text(px(5) - 10, py(700) - 26, "조금씩만 줄어듦", 12, INK2))
    return svg(640, 300, b, "엘보 방법: inertia가 꺾이는 k 찾기")


# ---------------- 2026-11-07 빠진 개념 추가 ----------------
@fig("ml02-ridge-lasso")
def _():
    b = []
    base = [6.0, -4.0, 3.0, 1.5, -0.8]
    ridge = [[v * f for v in base] for f in (1.0, 0.65, 0.35)]
    def soft(v, t):
        return 0.0 if abs(v) <= t else (abs(v) - t) * (1 if v > 0 else -1)
    lasso = [[soft(v, t) for v in base] for t in (0.0, 1.2, 2.6)]
    alphas = ["alpha 작음", "alpha 중간", "alpha 큼"]
    for row, (name, data, color, note) in enumerate([("Ridge", ridge, CYAN, "모두 조금씩 줄어든다"), ("Lasso", lasso, ACC, "작은 계수부터 0이 된다")]):
        y0 = 20 + row * 170
        b.append(text(20, y0 + 12, name, 16, color, "start", 700))
        b.append(text(110, y0 + 12, note, 13, INK2, "start"))
        for k, coefs in enumerate(data):
            x0 = 30 + k * 250
            zy = y0 + 95
            b.append(rect(x0, y0 + 30, 220, 130, SURF, LINE2, 8))
            b.append(line(x0 + 15, zy, x0 + 205, zy, LINE2, 1.2))
            for i, v in enumerate(coefs):
                bx = x0 + 28 + i * 36
                h = v * 9
                if abs(v) < 1e-9:
                    b.append(text(bx + 11, zy - 8, "0", 12, FAIL, weight=700, mono=True))
                    continue
                top = zy - h if h > 0 else zy
                b.append(rect(bx, top, 22, abs(h), color, "none", 2, op=0.85))
            b.append(text(x0 + 110, y0 + 148, alphas[k], 12, MUTED))
        b.append(arrow(30 + 220 + 6, y0 + 95, 30 + 250 - 6, y0 + 95, MUTED, 1.4))
        b.append(arrow(30 + 470 + 6, y0 + 95, 30 + 500 - 6, y0 + 95, MUTED, 1.4))
    return svg(780, 360, b, "alpha를 키울 때 Ridge와 Lasso의 계수 변화")


@fig("ml05-timesplit")
def _():
    b = []
    n, cw, ch = 12, 46, 22
    def panel(y0, title, color, folds):
        b.append(text(20, y0, title, 15, color, "start", 700))
        for f, cells in enumerate(folds):
            yy = y0 + 18 + f * (ch + 6)
            b.append(text(20, yy + ch / 2, f"{f + 1}회", 12, MUTED, "start"))
            for i in range(n):
                kind = cells[i]
                fill = {"tr": CYAN, "te": ORANGE, "no": SURF3}[kind]
                op = {"tr": 0.55, "te": 0.9, "no": 1}[kind]
                b.append(rect(60 + i * cw, yy, cw - 4, ch, fill, LINE2 if kind == "no" else "none", 4, op=op))
    order = [3, 8, 0, 11, 5, 9, 1, 6, 10, 2, 7, 4]
    shuffled = []
    for f in range(4):
        test = set(order[f * 3:(f + 1) * 3])
        shuffled.append(["te" if i in test else "tr" for i in range(n)])
    panel(24, "섞은 K-fold: 시험 칸이 여기저기 → 미래 데이터로 과거를 맞히게 됨", FAIL, shuffled)
    ts = []
    for f in range(4):
        end = 4 + f * 2
        ts.append(["tr" if i < end else "te" if i < end + 2 else "no" for i in range(n)])
    panel(180, "TimeSeriesSplit: 언제나 앞부분으로 학습 → 바로 뒤로 시험", PASS, ts)
    for i in range(0, n, 2):
        b.append(text(60 + i * cw + cw / 2, 316, f"{1949 + i}", 11, MUTED, mono=True))
    b.append(text(610, 336, "시간 →", 12, MUTED))
    b.append(rect(60, 330, 14, 12, CYAN, "none", 3, op=0.55))
    b.append(text(80, 336, "학습", 12, INK2, "start"))
    b.append(rect(130, 330, 14, 12, ORANGE, "none", 3, op=0.9))
    b.append(text(150, 336, "시험", 12, INK2, "start"))
    b.append(rect(200, 330, 14, 12, SURF3, LINE2, 3))
    b.append(text(220, 336, "아직 안 씀", 12, INK2, "start"))
    return svg(640, 352, b, "섞은 K-fold와 TimeSeriesSplit 비교")


@fig("ml06-selection")
def _():
    b = []
    cols = [("Filter (거르기)", CYAN, 20), ("Wrapper (감싸기)", ORANGE, 270), ("Embedded (내장)", ACC, 520)]
    for title, color, x0 in cols:
        b.append(rect(x0, 14, 230, 250, SURF, color, 10, 1.4))
        b.append(text(x0 + 115, 36, title, 15, color, weight=700))
    # filter: score bars
    scores = [0.9, 0.82, 0.75, 0.4, 0.2, 0.1]
    for i, sc in enumerate(scores):
        y = 62 + i * 24
        b.append(text(36, y + 8, f"열{i + 1}", 12, INK2, "start"))
        b.append(rect(76, y, 150 * sc, 16, CYAN, "none", 3, op=0.85 if i < 3 else 0.25))
    b.append(text(135, 214, "열마다 정답과의 점수 → 상위 k개", 12, INK2))
    b.append(text(135, 240, "빠름 · 겹치는 열도 모두 뽑음", 12, MUTED))
    # wrapper: loop
    b.append(box(300, 66, 170, 34, "모델 학습", stroke=ORANGE, color=INK, size=13))
    b.append(box(300, 128, 170, 34, "가장 약한 열 빼기", stroke=ORANGE, color=INK, size=13))
    b.append(arrow(385, 100, 385, 126, ORANGE, 1.6))
    b.append(path("M300,145 C268,145 268,83 298,83", ORANGE, 1.6))
    b.append(text(385, 180, "원하는 개수가 될 때까지 반복", 12, INK2))
    b.append(text(385, 214, "예: RFE", 12, INK2, mono=True))
    b.append(text(385, 240, "조합을 봄 · 여러 번 학습해 느림", 12, MUTED))
    # embedded: coefficients
    coefs = [("열1", 0.8), ("열2", 0.0), ("열3", 0.5), ("열4", 0.0), ("열5", 0.3)]
    for i, (nm, v) in enumerate(coefs):
        y = 62 + i * 26
        b.append(text(538, y + 8, nm, 12, INK2, "start"))
        if v == 0:
            b.append(text(590, y + 8, "계수 0 → 탈락", 12, FAIL, "start", 700))
        else:
            b.append(rect(580, y, 150 * v, 16, ACC, "none", 3, op=0.8))
    b.append(text(635, 214, "학습하면서 모델이 스스로", 12, INK2))
    b.append(text(635, 240, "예: Lasso · 트리 중요도", 12, MUTED))
    return svg(770, 280, b, "피처 셀렉션의 세 방식: Filter, Wrapper, Embedded")


@fig("ml06-vif")
def _():
    b = []
    px = lambda r2: 70 + r2 * 560
    py = lambda v: 250 - min(v, 22) / 22 * 210
    b.append(rect(px(0.8), 40, px(0.9) - px(0.8), 210, WARN, "none", 0, op=0.08))
    b.append(rect(px(0.9), 40, px(0.96) - px(0.9), 210, FAIL, "none", 0, op=0.10))
    b.append(text((px(0.8) + px(0.9)) / 2, 52, "주의", 12, WARN, weight=700))
    b.append(text((px(0.9) + px(0.96)) / 2, 52, "심함", 12, FAIL, weight=700))
    b.append(line(px(0), 250, px(1), 250, LINE2, 1.4))
    b.append(line(px(0), 40, px(0), 250, LINE2, 1.4))
    pts = [i / 100 for i in range(0, 96)]
    b.append(path("M" + " L".join(f"{px(r):.1f},{py(1 / (1 - r)):.1f}" for r in pts), CYAN, 2.6))
    for r, v in [(0, 1), (0.5, 2), (0.8, 5), (0.9, 10)]:
        b.append(circle(px(r), py(v), 6, ACC, INK, 1.6))
        b.append(text(px(r) - 10, py(v) - 18, f"R² {r} → VIF {v}", 12, ACC, "end" if r > 0.3 else "start", 700))
    for r in [0, 0.2, 0.4, 0.6, 0.8, 1.0]:
        b.append(text(px(r), 266, str(r), 12, MUTED, mono=True))
    b.append(text(px(0.5), 290, "R² (나머지 열들로 이 열을 맞히는 정도)", 13, MUTED))
    for v in [1, 5, 10, 20]:
        b.append(text(px(0) - 10, py(v), str(v), 12, MUTED, "end", mono=True))
    b.append(text(px(0) + 6, 28, "VIF = 1 / (1 − R²)", 13, INK2, "start", mono=True))
    return svg(680, 300, b, "R²와 VIF의 관계")


@fig("ml07-isolation")
def _():
    b = []
    rnd = pseudo(120, 7)
    pts = []
    for i in range(40):
        a, r = rnd[2 * i] * 6.283, rnd[2 * i + 1] ** 0.5 * 60
        pts.append((140 + r * math.cos(a), 150 + r * math.sin(a) * 0.8))
    for k, (x0, title, color) in enumerate([(0, "외딴 점: 2번 만에 혼자", FAIL), (380, "무리 속 점: 6번 잘라야 혼자", CYAN)]):
        b.append(rect(x0 + 10, 30, 340, 250, SURF, LINE2, 10))
        b.append(text(x0 + 180, 16, title, 15, color, weight=700))
        for (x, y) in pts:
            b.append(circle(x0 + x, y, 4, INK2, op=0.7))
    # left: outlier at (300, 70)
    b.append(circle(300, 70, 7, FAIL, INK, 1.5))
    b.append(line(250, 30, 250, 280, ORANGE, 2, "6 4"))
    b.append(text(256, 268, "①", 13, ORANGE, "start", 700))
    b.append(line(250, 110, 350, 110, ORANGE, 2, "6 4"))
    b.append(text(340, 122, "②", 13, ORANGE, "end", 700))
    # right: normal point at center
    cx, cy = 380 + 140, 150
    b.append(circle(cx, cy, 7, CYAN, INK, 1.5))
    cuts = [(cx + 30, 30, cx + 30, 280), (390, cy + 40, cx + 30, cy + 40), (cx - 40, 30, cx - 40, cy + 40),
            (cx - 40, cy - 30, cx + 30, cy - 30), (cx + 12, cy - 30, cx + 12, cy + 40), (cx - 40, cy + 14, cx + 12, cy + 14)]
    for i, (x1, y1, x2, y2) in enumerate(cuts):
        b.append(line(x1, y1, x2, y2, ORANGE, 1.8, "6 4"))
    b.append(text(380 + 330, 268, "자르기 6번", 13, ORANGE, "end", 700))
    return svg(740, 292, b, "IsolationForest: 외딴 점은 적게 잘라도 혼자 남는다")


@fig("ml09-shap-waterfall")
def _():
    b = []
    steps = [("torque = 65.1", 0.672), ("tool_wear = 212", 0.186), ("rpm = 1299", 0.041), ("process_temp = 309.3", 0.012), ("air_temp = 299.8", -0.026)]
    base, final = 0.043, 0.928
    px = lambda v: 210 + v * 470
    rows = [("기본값 (평균 예측)", None)] + steps + [("모델 예측", None)]
    cur = base
    for i, (label, v) in enumerate(rows):
        y = 26 + i * 36
        b.append(text(196, y + 12, label, 13, INK2, "end", mono=(v is not None)))
        if i == 0:
            b.append(rect(px(0), y, px(base) - px(0), 24, MUTED, "none", 3, op=0.6))
            b.append(text(px(base) + 8, y + 12, f"{base:.3f}", 13, INK, "start", 700, mono=True))
        elif v is None:
            b.append(rect(px(0), y, px(final) - px(0), 24, ACC, "none", 3, op=0.85))
            b.append(text(px(final) + 8, y + 12, f"{final:.3f}", 13, ACC, "start", 700, mono=True))
        else:
            lo, hi = sorted([cur, cur + v])
            color = FAIL if v > 0 else CYAN
            b.append(rect(px(lo), y, max(px(hi) - px(lo), 2), 24, color, "none", 3, op=0.85))
            lx = px(hi) + 8
            b.append(text(lx, y + 12, f"{v:+.3f}", 13, color, "start", 700, mono=True))
            b.append(line(px(cur + v), y + 24, px(cur + v), y + 36, LINE2, 1, "3 3"))
            cur += v
    yb = 26 + len(rows) * 36 + 4
    b.append(line(px(0), yb, px(1), yb, LINE2, 1.2))
    for t in [0, 0.25, 0.5, 0.75, 1.0]:
        b.append(text(px(t), yb + 14, str(t), 12, MUTED, mono=True))
    b.append(text(px(0.5), yb + 34, "고장 확률", 13, MUTED))
    return svg(760, yb + 46, b, "설비 2761번의 SHAP 폭포 그림")


@fig("ml11-drift")
def _():
    import csv
    path_csv = os.path.join(os.path.dirname(__file__), "..", "datasets", "ai4i2020.csv")
    with open(path_csv, encoding="utf-8") as fh:
        temps = [float(r["air_temp"]) for r in csv.DictReader(fh)]
    train, hot = temps[:4000], temps[4000:6000]
    lo, hi = 295, 305
    bins = [lo + i * 0.5 for i in range(21)]
    def hist(v):
        c = [0] * 20
        for x in v:
            k = min(max(int((x - lo) / 0.5), 0), 19)
            c[k] += 1
        return [x / len(v) for x in c]
    def cdf(v, x):
        return sum(1 for t in v if t <= x) / len(v)
    b = []
    # left: histogram
    ox, oy, w, h = 40, 40, 300, 200
    b.append(text(ox, 22, "공기 온도 분포", 14, INK, "start", 700))
    ht, hh = hist(train), hist(hot)
    m = max(ht + hh)
    for i in range(20):
        x = ox + i * w / 20
        for vals, color in [(ht, CYAN), (hh, ORANGE)]:
            bh = vals[i] / m * h
            b.append(rect(x + 1, oy + h - bh, w / 20 - 2, bh, color, "none", 1, op=0.45))
    b.append(line(ox, oy + h, ox + w, oy + h, LINE2, 1.2))
    for t in [295, 300, 305]:
        b.append(text(ox + (t - lo) / (hi - lo) * w, oy + h + 14, f"{t}K", 11, MUTED, mono=True))
    b.append(rect(ox, oy + h + 30, 12, 12, CYAN, "none", 2, op=0.6))
    b.append(text(ox + 18, oy + h + 36, "학습 구간 (0~3999행)", 12, INK2, "start"))
    b.append(rect(ox + 170, oy + h + 30, 12, 12, ORANGE, "none", 2, op=0.8))
    b.append(text(ox + 188, oy + h + 36, "더운 구간", 12, INK2, "start"))
    # right: CDF
    ox2 = 410
    b.append(text(ox2, 22, "누적 분포와 KS 통계량", 14, INK, "start", 700))
    xs = [lo + i * 0.1 for i in range(101)]
    ct = [cdf(train, x) for x in xs]
    chh = [cdf(hot, x) for x in xs]
    X = lambda x: ox2 + (x - lo) / (hi - lo) * w
    Y = lambda p: oy + h - p * h
    b.append(path("M" + " L".join(f"{X(x):.1f},{Y(p):.1f}" for x, p in zip(xs, ct)), CYAN, 2.4))
    b.append(path("M" + " L".join(f"{X(x):.1f},{Y(p):.1f}" for x, p in zip(xs, chh)), ORANGE, 2.4))
    gaps = [abs(a - c) for a, c in zip(ct, chh)]
    k = gaps.index(max(gaps))
    b.append(line(X(xs[k]), Y(ct[k]), X(xs[k]), Y(chh[k]), ACC, 2.4))
    b.append(text(X(xs[k]) + 8, (Y(ct[k]) + Y(chh[k])) / 2, f"가장 큰 간격\nKS = {max(gaps):.2f}", 12, ACC, "start", 700))
    b.append(line(ox2, oy + h, ox2 + w, oy + h, LINE2, 1.2))
    b.append(line(ox2, oy, ox2, oy + h, LINE2, 1.2))
    for t in [295, 300, 305]:
        b.append(text(X(t), oy + h + 14, f"{t}K", 11, MUTED, mono=True))
    b.append(text(ox2 - 6, oy, "1", 11, MUTED, "end", mono=True))
    b.append(text(ox2 - 6, oy + h, "0", 11, MUTED, "end", mono=True))
    return svg(740, 290, b, "학습 구간과 더운 구간의 공기 온도 분포 비교")


@fig("ml11-project")
def _():
    b = []
    steps = [("1", "문제 정의", "무엇이 더 아픈가\n(비용)"), ("2", "나누기", "시험용 20%\n봉투에 넣기"), ("3", "손질 · 특성", "Pipeline\n겹치는 열 확인"),
             ("4", "모델 비교", "기준 → 단순 → 복잡\n교차검증"), ("5", "기준선", "학습용 예측으로\n총비용 최소"), ("6", "최종 시험", "시험용\n단 한 번"), ("7", "보고 · 저장", "숫자 + 한계\n+ 운영 계획")]
    for i, (no, title, sub) in enumerate(steps):
        row, col = divmod(i, 4)
        x = 20 + col * 185 if row == 0 else 112 + col * 185
        y = 20 + row * 140
        color = ORANGE if no == "6" else ACC if no in ("1", "7") else CYAN
        b.append(rect(x, y, 160, 100, SURF, color, 10, 1.4))
        b.append(circle(x + 22, y + 22, 13, color, op=0.9))
        b.append(text(x + 22, y + 22, no, 13, SURF, weight=800))
        b.append(text(x + 92, y + 24, title, 15, color, weight=700))
        b.append(text(x + 80, y + 66, sub, 12, INK2))
        if i in (0, 1, 2, 4, 5):
            b.append(arrow(x + 162, y + 50, x + 183, y + 50, MUTED, 1.6))
    b.append(path("M630,122 L630,136 L192,136 L192,158", MUTED, 1.6))
    b.append(f'<polygon points="187,152 192,160 197,152" fill="{MUTED}"/>')
    b.append(rect(112, 274, 715, 26, ORANGE, "none", 6, op=0.10))
    b.append(text(470, 287, "2단계에서 떼어 둔 시험용은 6단계 전까지 열어 보지 않습니다", 12, ORANGE, weight=600))
    return svg(850, 310, b, "미니 프로젝트 7단계")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, f in FIGS.items():
        with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as fh:
            fh.write(f())
    print(f"{len(FIGS)} figures -> {os.path.normpath(OUT)}")
