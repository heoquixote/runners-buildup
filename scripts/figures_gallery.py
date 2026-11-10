"""차트 갤러리 썸네일(PNG) 생성기.

python3 scripts/figures_gallery.py  ->  content/img/gallery/mpl-*.png, sns-*.png
matplotlib 3.8.4 · seaborn 0.13.2 (브라우저 Pyodide와 같은 버전)로 실제 함수를 불러 그린다.
matplotlib 썸네일은 고정 시드로 만든 연습용 숫자, seaborn 썸네일은 사이트 데이터(tips · penguins · flights)를 쓴다.
카드에 적힌 함수 이름과 썸네일을 그린 함수가 같아야 한다.
점이 수백 개인 그림(pairplot 등)은 SVG로 저장하면 수백 KB가 되어 PNG로 저장한다.
쓰는 곳: matplotlib 차트 갤러리(da-09-5), seaborn 차트 갤러리(da-10-5).
"""
import os

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402
import seaborn as sns  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "content", "img", "gallery")
DATA = os.path.join(ROOT, "datasets")

SURF, LINE2, MUTED = "#121516", "#3d4344", "#a1aaa5"
CYAN, ACC, TRACK, ORANGE, ROSE, PASS = "#66dbff", "#c8ff3d", "#a896ff", "#ff9a51", "#ff8fcf", "#61db9c"
INK_ERR = "#f5f7f2"
PAL = [CYAN, ACC, TRACK, ORANGE, ROSE, PASS]
W, H = 2.4, 1.8
DPI = 200  # 480 x 360 픽셀: 카드 폭(약 240px)의 2배라 레티나 화면에서도 또렷하다

plt.rcParams.update({
    "svg.hashsalt": "runners-buildup", "svg.fonttype": "none",
    "figure.facecolor": SURF, "axes.facecolor": SURF, "savefig.facecolor": SURF,
    "axes.edgecolor": LINE2, "axes.linewidth": 0.8, "axes.grid": True, "axes.axisbelow": True,
    "grid.color": "#2a2f30", "grid.linewidth": 0.6,
    "xtick.color": LINE2, "ytick.color": LINE2, "xtick.major.size": 2.5, "ytick.major.size": 2.5,
    "axes.prop_cycle": matplotlib.cycler(color=PAL), "patch.edgecolor": SURF,
    "lines.linewidth": 1.8, "font.size": 6,
})
FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


def clean(f):
    """글자(축 이름 · 눈금 숫자 · 범례 · 제목)를 지워 그림만 남긴다."""
    for ax in f.axes:
        ax.set_xlabel("")
        ax.set_ylabel("")
        ax.set_title("")
        ax.tick_params(labelbottom=False, labelleft=False)
        if ax.get_legend():
            ax.get_legend().remove()
        for s in ax.spines.values():
            s.set_color(LINE2)
    for lg in f.legends:
        lg.remove()
    for t in list(f.texts):
        t.remove()


def save(name, f):
    clean(f)
    f.set_size_inches(W, H)
    f.tight_layout(pad=0.35)
    f.savefig(os.path.join(OUT, f"{name}.png"), dpi=DPI, metadata={"Software": None})
    plt.close(f)


def ax1():
    return plt.subplots(figsize=(W, H))


rng = np.random.default_rng(7)
tips = pd.read_csv(os.path.join(DATA, "tips.csv"))
penguins = pd.read_csv(os.path.join(DATA, "penguins.csv")).dropna()
flights = pd.read_csv(os.path.join(DATA, "flights.csv"))
MONTHS = flights["month"].unique()

# ---------------- matplotlib ----------------


@fig("mpl-bar")
def _():
    f, ax = ax1()
    ax.bar(["A", "B", "C", "D", "E"], [5, 8, 3, 6, 4], color=CYAN)
    return f


@fig("mpl-barh")
def _():
    f, ax = ax1()
    ax.barh(["A", "B", "C", "D", "E"], [9, 7, 5, 4, 2], color=CYAN)
    ax.invert_yaxis()
    return f


@fig("mpl-errorbar")
def _():
    f, ax = ax1()
    x = np.arange(5)
    ax.errorbar(x, [4, 6, 5, 7, 6], yerr=[0.8, 1.2, 0.6, 1.0, 1.4], fmt="o", color=CYAN, ecolor=MUTED, capsize=3, ms=4)
    ax.set_xlim(-0.6, 4.6)
    return f


@fig("mpl-plot")
def _():
    f, ax = ax1()
    x = np.arange(24)
    ax.plot(x, 10 + 0.4 * x + 2 * np.sin(x / 1.9), color=CYAN)
    ax.plot(x, 8 + 0.2 * x + 1.5 * np.cos(x / 2.4), color=ACC)
    return f


@fig("mpl-step")
def _():
    f, ax = ax1()
    x = np.arange(10)
    ax.step(x, [2, 2, 4, 4, 3, 6, 6, 5, 7, 7], where="post", color=CYAN)
    return f


@fig("mpl-fill_between")
def _():
    f, ax = ax1()
    x = np.linspace(0, 10, 60)
    y = 5 + 0.3 * x + np.sin(x)
    ax.fill_between(x, y - 1.2, y + 1.2, color=CYAN, alpha=0.3, lw=0)
    ax.plot(x, y, color=CYAN)
    return f


@fig("mpl-hist")
def _():
    f, ax = ax1()
    ax.hist(rng.normal(50, 10, 400), bins=16, color=CYAN, edgecolor=SURF, linewidth=0.6)
    return f


@fig("mpl-boxplot")
def _():
    f, ax = ax1()
    data = [rng.normal(m, s, 80) for m, s in [(5, 1), (6.5, 1.5), (4.5, 0.8)]]
    ax.boxplot(data, widths=0.5, patch_artist=True,
               boxprops={"facecolor": CYAN + "55", "edgecolor": CYAN}, medianprops={"color": ACC, "lw": 1.6},
               whiskerprops={"color": CYAN}, capprops={"color": CYAN},
               flierprops={"marker": "o", "ms": 2.5, "markerfacecolor": CYAN, "markeredgecolor": "none"})
    return f


@fig("mpl-violinplot")
def _():
    f, ax = ax1()
    data = [rng.normal(m, s, 200) for m, s in [(5, 1), (6.5, 1.5), (4.5, 0.8)]]
    parts = ax.violinplot(data, showmedians=True, widths=0.7)
    for b in parts["bodies"]:
        b.set_facecolor(CYAN)
        b.set_edgecolor(CYAN)
        b.set_alpha(0.45)
    for k in ("cbars", "cmins", "cmaxes", "cmedians"):
        parts[k].set_color(ACC if k == "cmedians" else CYAN)
        parts[k].set_linewidth(1)
    return f


@fig("mpl-ecdf")
def _():
    f, ax = ax1()
    ax.ecdf(rng.normal(50, 10, 120), color=CYAN)
    ax.ecdf(rng.normal(58, 8, 120), color=ACC)
    return f


@fig("mpl-scatter")
def _():
    f, ax = ax1()
    x = rng.uniform(0, 10, 70)
    ax.scatter(x, 2 + 0.8 * x + rng.normal(0, 1.4, 70), s=rng.uniform(6, 40, 70), color=CYAN, alpha=0.75, lw=0)
    return f


@fig("mpl-hexbin")
def _():
    f, ax = ax1()
    x = rng.normal(0, 1, 3000)
    ax.hexbin(x, 0.7 * x + rng.normal(0, 0.7, 3000), gridsize=16, cmap="mako", linewidths=0.2, edgecolors=SURF)
    return f


@fig("mpl-imshow")
def _():
    f, ax = ax1()
    ax.imshow(rng.uniform(0, 1, (6, 8)), cmap="mako", aspect="auto")
    ax.grid(False)
    return f


@fig("mpl-pie")
def _():
    f, ax = ax1()
    ax.pie([40, 25, 20, 15], colors=PAL[:4], startangle=90, counterclock=False,
           wedgeprops={"edgecolor": SURF, "linewidth": 1.2})
    ax.axis("equal")
    return f


@fig("mpl-stacked-bar")
def _():
    f, ax = ax1()
    x = ["A", "B", "C", "D"]
    a, b, c = np.array([3, 4, 2, 5]), np.array([2, 3, 3, 2]), np.array([1, 2, 2, 1])
    ax.bar(x, a, color=CYAN)
    ax.bar(x, b, bottom=a, color=ACC)
    ax.bar(x, c, bottom=a + b, color=TRACK)
    return f


@fig("mpl-stackplot")
def _():
    f, ax = ax1()
    x = np.arange(12)
    ax.stackplot(x, 3 + 0.2 * x, 2 + np.sin(x / 2) + 1, 1 + 0.1 * x ** 1.2, colors=[CYAN, ACC, TRACK], alpha=0.85, lw=0)
    ax.set_xlim(0, 11)
    return f


# ---------------- seaborn ----------------


@fig("sns-scatterplot")
def _():
    f, ax = ax1()
    sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time", s=10, palette=[CYAN, ACC], linewidth=0, ax=ax)
    return f


@fig("sns-lineplot")
def _():
    f, ax = ax1()
    sns.lineplot(data=flights, x="year", y="passengers", color=CYAN, ax=ax)
    return f


@fig("sns-relplot")
def _():
    g = sns.relplot(data=tips, x="total_bill", y="tip", col="time", hue="time", s=6, palette=[CYAN, ACC],
                    linewidth=0, height=1.6, aspect=0.75, legend=False)
    return g.figure


@fig("sns-histplot")
def _():
    f, ax = ax1()
    sns.histplot(data=tips, x="total_bill", bins=18, color=CYAN, edgecolor=SURF, ax=ax)
    return f


@fig("sns-kdeplot")
def _():
    f, ax = ax1()
    sns.kdeplot(data=penguins, x="flipper_length_mm", hue="species", fill=True, alpha=0.35, palette=PAL[:3], ax=ax)
    return f


@fig("sns-ecdfplot")
def _():
    f, ax = ax1()
    sns.ecdfplot(data=penguins, x="flipper_length_mm", hue="species", palette=PAL[:3], ax=ax)
    return f


@fig("sns-countplot")
def _():
    f, ax = ax1()
    sns.countplot(data=tips, x="day", order=["Thur", "Fri", "Sat", "Sun"], color=CYAN, ax=ax)
    return f


@fig("sns-barplot")
def _():
    f, ax = ax1()
    sns.barplot(data=tips, x="day", y="tip", order=["Thur", "Fri", "Sat", "Sun"], color=CYAN,
                err_kws={"color": INK_ERR, "linewidth": 1.2}, ax=ax)
    return f



@fig("sns-pointplot")
def _():
    f, ax = ax1()
    sns.pointplot(data=tips, x="day", y="tip", hue="sex", order=["Thur", "Fri", "Sat", "Sun"], palette=[CYAN, ACC],
                  dodge=0.25, markersize=4, linewidth=1.4, ax=ax)
    return f


@fig("sns-boxplot")
def _():
    f, ax = ax1()
    sns.boxplot(data=tips, x="day", y="total_bill", order=["Thur", "Fri", "Sat", "Sun"], color=CYAN,
                linecolor=CYAN, fill=False, fliersize=2, linewidth=1, ax=ax)
    return f


@fig("sns-violinplot")
def _():
    f, ax = ax1()
    sns.violinplot(data=tips, x="day", y="total_bill", order=["Thur", "Fri", "Sat", "Sun"], color=CYAN,
                   linecolor=SURF, linewidth=0.8, inner="quart", ax=ax)
    return f


@fig("sns-boxenplot")
def _():
    f, ax = ax1()
    sns.boxenplot(data=penguins, x="species", y="body_mass_g", color=CYAN, linewidth=0.6, line_kws={"color": ACC},
                  flier_kws={"s": 2}, ax=ax)
    return f


@fig("sns-stripplot")
def _():
    f, ax = ax1()
    sns.stripplot(data=tips, x="day", y="total_bill", order=["Thur", "Fri", "Sat", "Sun"], color=CYAN, size=2,
                  alpha=0.8, ax=ax)
    return f


@fig("sns-swarmplot")
def _():
    f, ax = ax1()
    sns.swarmplot(data=penguins, x="species", y="flipper_length_mm", hue="species", palette=PAL[:3], size=1.6,
                  legend=False, ax=ax)
    return f


@fig("sns-regplot")
def _():
    f, ax = ax1()
    sns.regplot(data=tips, x="total_bill", y="tip", scatter_kws={"s": 6, "color": CYAN, "alpha": 0.7, "linewidths": 0},
                line_kws={"color": ACC, "lw": 1.6}, ax=ax)
    return f


@fig("sns-lmplot")
def _():
    g = sns.lmplot(data=penguins, x="bill_length_mm", y="bill_depth_mm", hue="species", palette=PAL[:3],
                   scatter_kws={"s": 4, "linewidths": 0}, line_kws={"lw": 1.4}, height=1.8, aspect=1.33, legend=False)
    return g.figure


@fig("sns-heatmap")
def _():
    f, ax = ax1()
    table = flights.pivot(index="month", columns="year", values="passengers").loc[MONTHS]
    sns.heatmap(table, cmap="mako", cbar=False, ax=ax)
    return f


@fig("sns-pairplot")
def _():
    g = sns.pairplot(penguins[["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "species"]], hue="species",
                     palette=PAL[:3], height=0.62, plot_kws={"s": 2, "linewidth": 0}, diag_kws={"linewidth": 0.6})
    return g.figure


@fig("sns-jointplot")
def _():
    g = sns.jointplot(data=tips, x="total_bill", y="tip", color=CYAN, height=1.8, s=5,
                      marginal_kws={"bins": 16, "edgecolor": SURF})
    return g.figure


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, f in FIGS.items():
        save(name, f())
        print("wrote", name)
