"""파이썬 기초 2026-11-10 보강 도식(SVG) 생성기: *args · Counter · 클래스와 객체(pb-08-4, pb-13-5, pb-14).

python3 scripts/figures_pb_extra.py  ->  content/img/py/*.svg
그리기 도우미와 색은 figures_ml.py와 같은 것을 쓴다. 그림 속 숫자 · 코드는 레슨 본문과 같아야 한다.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from figures_ml import (ACC, CYAN, FAIL, INK, INK2, LINE2, MUTED, ORANGE, PASS, SURF, SURF3, TRACK, WARN,  # noqa: E402,F401
                        arrow, line, path, rect, svg, text)

OUT = os.path.join(os.path.dirname(__file__), "..", "content", "img", "py")
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def code(x, y, s, size=12.5, fill=INK2, anchor="start", weight=500):
    # SVG는 앞쪽 공백을 지우므로 들여쓰기는 줄바꿈 없는 공백(U+00A0)으로 바꾼다
    s = "\n".join("\u00a0" * (len(ln) - len(ln.lstrip(" "))) + ln.lstrip(" ") for ln in str(s).split("\n"))
    return text(x, y, s, size, fill, anchor, weight, mono=True)


def chip(x, y, w, s, c, size=12.5, h=30):
    """값 하나를 담은 작은 칸."""
    return rect(x, y, w, h, SURF3, c, 6, 1.4) + code(x + w / 2, y + h / 2, s, size, c, "middle", 600)


# ---------------- pb-08-4 *args · **kwargs: 모으기와 풀기 ----------------
@fig("py-args-pack-unpack")
def _():
    b = []
    # 위: 정의할 때 모은다
    b.append(rect(10, 10, 820, 150, SURF, LINE2, 10))
    b.append(text(30, 34, "정의할 때 (def 줄) · 모은다", 15, ACC, "start", 700))
    b.append(code(30, 66, "average(10.1, 9.8, 10.4)", 13, INK, weight=600))
    for i, v in enumerate(["10.1", "9.8", "10.4"]):
        b.append(chip(40 + i * 70, 101, 58, v, CYAN))
    b.append(arrow(254, 116, 402, 116, MUTED, 1.6))
    b.append(code(410, 66, "def average(*values):", 13, ACC, weight=700))
    b.append(rect(410, 92, 230, 48, ACC, ACC, 8, 1.6, op=0.08))
    b.append(code(525, 116, "values = (10.1, 9.8, 10.4)", 12.5, ACC, "middle", 600))
    b.append(text(660, 106, "튜플 하나로", 12.5, INK2, "start"))
    b.append(text(660, 126, "**kwargs는 딕셔너리로", 12.5, INK2, "start"))
    # 아래: 호출할 때 푼다
    b.append(rect(10, 172, 820, 200, SURF, LINE2, 10))
    b.append(text(30, 196, "호출할 때 · 푼다", 15, ORANGE, "start", 700))
    # * 리스트
    b.append(code(30, 230, "temps = [10.1, 9.8, 10.4]", 12.5, INK2))
    b.append(code(30, 258, "average(*temps)", 13.5, ORANGE, weight=700))
    b.append(arrow(170, 258, 296, 258, MUTED, 1.6))
    for i, v in enumerate(["10.1", "9.8", "10.4"]):
        b.append(chip(304 + i * 70, 243, 58, v, CYAN))
    b.append(text(520, 258, "= average(10.1, 9.8, 10.4)", 12.5, INK2, "start"))
    # ** 딕셔너리
    b.append(code(30, 302, "spec = {\"low\": 9.8, \"high\": 10.2}", 12.5, INK2))
    b.append(code(30, 332, "judge(10.1, **spec)", 13.5, ORANGE, weight=700))
    b.append(arrow(206, 332, 300, 332, MUTED, 1.4))
    b.append(chip(304, 317, 100, "low=9.8", CYAN))
    b.append(chip(414, 317, 110, "high=10.2", CYAN))
    b.append(text(540, 332, "= judge(10.1, low=9.8, high=10.2)", 12.5, INK2, "start"))
    return svg(840, 382, b, "def 줄의 별은 값을 모으고, 호출할 때의 별은 값을 푼다")


# ---------------- pb-13-5 Counter · defaultdict ----------------
@fig("py-counter-defaultdict")
def _():
    b = []
    # 세기
    b.append(text(20, 20, "세기", 15, ACC, "start", 700))
    b.append(rect(10, 34, 400, 150, SURF, LINE2, 10))
    b.append(text(26, 54, "일반 딕셔너리", 12.5, MUTED, "start", 600))
    b.append(code(26, 104, "counts = {}\nfor d in defects:\n    counts[d] = counts.get(d, 0) + 1", 12.5, INK2))
    b.append(text(26, 162, "4줄 · 빈 상태에서 하나씩 더한다", 12, MUTED, "start"))
    b.append(rect(430, 34, 400, 150, ACC, ACC, 10, 1.6, op=0.07))
    b.append(text(446, 54, "Counter", 12.5, ACC, "start", 700))
    b.append(code(446, 94, "counts = Counter(defects)", 13, ACC, weight=700))
    b.append(code(446, 132, "scratch 3 · dent 2 · crack 1", 12.5, INK))
    b.append(text(446, 162, "1줄 · 없는 값은 0, most_common(n)", 12, MUTED, "start"))
    # 묶기
    b.append(text(20, 212, "묶기", 15, CYAN, "start", 700))
    b.append(rect(10, 226, 400, 170, SURF, LINE2, 10))
    b.append(text(26, 246, "일반 딕셔너리", 12.5, MUTED, "start", 600))
    b.append(code(26, 300, "for line, v in records:\n    if line not in groups:\n        groups[line] = []\n    groups[line].append(v)", 12.5, INK2))
    b.append(text(26, 372, "if를 빼먹으면 KeyError", 12, FAIL, "start"))
    b.append(rect(430, 226, 400, 170, CYAN, CYAN, 10, 1.6, op=0.07))
    b.append(text(446, 246, "defaultdict(list)", 12.5, CYAN, "start", 700, mono=True))
    b.append(code(446, 284, "for line, v in records:\n    groups[line].append(v)", 12.5, CYAN, weight=600))
    b.append(code(446, 330, "A: [10.1, 9.8, 10.4]\nB: [10.6, 10.9]", 12.5, INK))
    b.append(text(446, 372, "없는 key를 꺼내면 빈 리스트부터 만든다", 12, MUTED, "start"))
    return svg(840, 406, b, "Counter는 세기를, defaultdict는 그룹별로 모으기를 짧게 해 준다")


# ---------------- pb-14-1 객체 = 속성 + 메서드 ----------------
@fig("py-object-anatomy")
def _():
    b = []
    b.append(code(20, 22, "made = datetime(2026, 11, 7, 9, 30)", 13, INK, weight=600))
    b.append(rect(10, 44, 820, 210, SURF, ACC, 12, 1.6))
    b.append(text(30, 66, "made  ·  datetime 객체", 14, ACC, "start", 700))
    # 속성
    b.append(rect(30, 84, 370, 154, SURF3, PASS, 10, 1.3))
    b.append(text(46, 104, "속성 · 가진 값 (괄호 없음)", 13, PASS, "start", 700))
    for i, (k, v) in enumerate([("year", "2026"), ("month", "11"), ("day", "7"), ("hour", "9")]):
        y = 124 + i * 27
        b.append(code(52, y + 10, f"made.{k}", 12.5, INK2))
        b.append(rect(220, y, 70, 22, SURF, PASS, 5, 1.1))
        b.append(code(255, y + 11, v, 12.5, PASS, "middle", 600))
    # 메서드
    b.append(rect(420, 84, 390, 154, SURF3, ORANGE, 10, 1.3))
    b.append(text(436, 104, "메서드 · 할 수 있는 일 (괄호 있음)", 13, ORANGE, "start", 700))
    for i, (m, r) in enumerate([("weekday()", "→ 5"), ("strftime(\"%Y-%m-%d\")", "→ '2026-11-07'"), ("replace(hour=10)", "→ 새 datetime")]):
        y = 124 + i * 36
        b.append(rect(436, y, 200, 26, ORANGE, ORANGE, 13, 1.3, op=0.12))
        b.append(code(536, y + 13, m, 11.5, ORANGE, "middle", 600))
        b.append(code(648, y + 13, r, 12, INK2))
    b.append(text(420, 276, "made.year 처럼 이름만 쓰면 값을 꺼내고,  made.weekday() 처럼 괄호를 붙이면 일을 시킨다", 13, INK2))
    return svg(840, 296, b, "객체는 속성(가진 값)과 메서드(할 수 있는 일)를 함께 가진다")


# ---------------- pb-14-2 클래스와 인스턴스 ----------------
@fig("py-class-instance")
def _():
    b = []
    b.append(rect(10, 30, 250, 220, SURF, ACC, 12, 1.8, dash="6 4"))
    b.append(text(30, 54, "클래스 · 설계도", 14, ACC, "start", 700))
    b.append(code(30, 84, "class Lot:", 14, ACC, weight=700))
    b.append(text(30, 116, "속성", 12, MUTED, "start", 600))
    b.append(code(30, 162, "lot_id\nqty\ndefects", 12.5, INK2))
    b.append(text(150, 116, "메서드", 12, MUTED, "start", 600))
    b.append(code(150, 146, "rate()", 12.5, ORANGE, weight=600))
    b.append(text(30, 214, "틀은 하나", 12, MUTED, "start"))
    objs = [("a", "A0915", 1250, 18, "1.44"), ("b", "A0916", 980, 7, "0.71"), ("c", "A0917", 1100, 25, "2.27")]
    for i, (n, lot, q, d, r) in enumerate(objs):
        y = 10 + i * 88
        b.append(arrow(266, 140, 336, y + 38, MUTED, 1.5))
        b.append(rect(340, y, 490, 76, SURF3, CYAN, 10, 1.4))
        b.append(code(358, y + 20, f"{n} = Lot(\"{lot}\", {q}, {d})", 12.5, CYAN, weight=700))
        b.append(code(358, y + 52, f"lot_id={lot}  qty={q}  defects={d}", 12, INK2))
        b.append(code(690, y + 52, f"{n}.rate() → {r}", 12, ORANGE, weight=600))
    return svg(840, 276, b, "클래스 하나로 값이 다른 객체를 여러 개 만든다")


# ---------------- pb-14-2 a.rate() = Lot.rate(a) ----------------
@fig("py-self-call")
def _():
    b = []
    b.append(rect(10, 10, 820, 70, SURF, LINE2, 10))
    b.append(text(30, 30, "우리가 쓰는 모양", 12.5, MUTED, "start", 600))
    cw = 22 * 0.6
    b.append(code(240, 54, "a", 22, CYAN, "start", 700))
    b.append(code(240 + cw, 54, ".rate()", 22, ORANGE, "start", 700))
    b.append(text(560, 54, "점 앞의 객체가", 13, INK2, "start"))
    ax = 240 + cw * 9 + 6 + 17
    b.append(rect(10, 100, 820, 84, SURF, LINE2, 10))
    b.append(path(f"M{240 + cw / 2},70 C {240 + cw / 2},110 {ax},100 {ax},134", CYAN, 1.8, dash="5 4"))
    b.append(arrow(ax, 128, ax, 140, CYAN, 1.8))
    b.append(text(30, 120, "파이썬이 실제로 실행하는 모양", 12.5, MUTED, "start", 600))
    b.append(code(240, 158, "Lot.rate(", 22, ORANGE, "start", 700))
    b.append(rect(240 + cw * 9 + 6, 142, 34, 34, CYAN, CYAN, 6, 1.6, op=0.15))
    b.append(code(ax, 159, "a", 22, CYAN, "middle", 700))
    b.append(code(240 + cw * 9 + 44, 158, ")", 22, ORANGE, "start", 700))
    b.append(text(560, 158, "self 자리에 들어간다", 13, INK2, "start"))
    b.append(rect(10, 200, 820, 92, SURF3, LINE2, 10))
    b.append(code(30, 246, "def rate(self):\n    return round(self.defects / self.qty * 100, 2)", 13, INK2))
    b.append(text(560, 236, "self.qty     → a.qty     (1250)", 12.5, CYAN, "start", 600))
    b.append(text(560, 260, "self.defects → a.defects (18)", 12.5, CYAN, "start", 600))
    return svg(840, 302, b, "a.rate()는 Lot.rate(a)로 실행되어 a가 self 자리에 들어간다")


# ---------------- pb-14-3 만들기 → fit → predict ----------------
@fig("py-fit-predict")
def _():
    b = []
    steps = [
        ("① 만들기", "model = MeanModel()", "mean_ = None", "아직 아무것도 모른다", MUTED),
        ("② 배우기", "model.fit([10.1, 9.8, 10.4, 10.3])", "mean_ = 10.15", "배운 결과를 속성에 저장", ACC),
        ("③ 답하기", "model.predict([\"new1\", \"new2\"])", "mean_ = 10.15", "→ [10.15, 10.15]", ORANGE),
    ]
    w = 260
    for i, (title, call, state, note, c) in enumerate(steps):
        x = 10 + i * (w + 20)
        b.append(text(x + w / 2, 18, title, 15, c, "middle", 700))
        b.append(code(x + w / 2, 46, call, 10.5 if i else 12, INK, "middle", 600))
        b.append(rect(x, 66, w, 120, SURF, c, 12, 1.6))
        b.append(text(x + 16, 86, "model 객체", 12, MUTED, "start", 600))
        b.append(rect(x + 24, 102, w - 48, 40, SURF3, c, 8, 1.3))
        b.append(code(x + w / 2, 122, state, 13.5, c, "middle", 700))
        b.append(text(x + w / 2, 166, note, 12.5, INK2))
        if i < 2:
            b.append(arrow(x + w + 3, 126, x + w + 17, 126, MUTED, 1.8))
    b.append(text(420, 212, "fit은 결과를 객체 안에 남기고, predict는 그 값을 꺼내 쓴다. 끝의 밑줄(_) = fit으로 생긴 값", 12.5, INK2))
    return svg(840, 228, b, "모델 객체의 상태가 만들기, fit, predict 단계에서 어떻게 바뀌는가")


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
