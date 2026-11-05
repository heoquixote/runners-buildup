"""통계 트랙 유닛 48(확률) · 49(통계 해석) 문제 생성기.

python3 scripts/build_stats3.py  ->  problems-stats3.js
모범답안을 실제로 실행해 정답 값을 채우고, 모범답안의 `# N. 설명` 다음 줄 `변수 = 식`에서 식을 비워 시작 코드를 만든다.
"""
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), "..")

UNITS = [
    {
        "id": 48,
        "title": "확률 기초",
        "summary": "교차표로 구하는 조건부확률, 베이즈 정리, 시뮬레이션으로 확률 확인",
        "note": "<h4>조건부확률은 분모를 바꾸는 계산</h4><p>P(A | B) = P(A 그리고 B) ÷ P(B). 교차표에서는 조건에 해당하는 <b>행(또는 열) 합계</b>를 분모로 씁니다. "
                "<code>pd.crosstab(df['행'], df['열'], normalize='index')</code>는 행마다 비율을 구해 줍니다.</p>"
                "<h4>베이즈 정리</h4><p>P(원인 | 결과) = P(결과 | 원인) × P(원인) ÷ P(결과). 분모 P(결과)는 원인이 있을 때와 없을 때를 더해서 구합니다(전확률). "
                "원인이 드물면(사전확률이 작으면) 검사가 정확해도 양성 중 진짜는 적을 수 있습니다.</p>"
                "<h4>시뮬레이션</h4><p><code>rng = np.random.default_rng(시드)</code>, <code>rng.random(n) &lt; p</code>로 확률 p인 사건을 n번 흉내 냅니다. 많이 반복할수록 비율이 참 확률에 가까워집니다(큰 수의 법칙).</p>",
    },
    {
        "id": 49,
        "title": "통계 해석 실수 피하기",
        "summary": "심슨의 역설과 층별 비교, 교란변수 통제, 다중비교 보정",
        "note": "<h4>합친 결과와 나눈 결과가 다를 때</h4><p>그룹 구성이 다르면 전체 비율 비교가 뒤집힐 수 있습니다(심슨의 역설). 의심되는 변수로 나눠 <code>groupby([층, 그룹])</code>으로 비교하고, 같은 구성으로 맞춘 <b>표준화 비율</b>을 함께 봅니다.</p>"
                "<h4>교란변수 걸러 내기</h4><p>X와 Y를 각각 교란변수 Z로 회귀한 뒤 남은 잔차끼리 상관을 구하면(편상관), Z의 영향을 뺀 X와 Y의 관계를 볼 수 있습니다.</p>"
                "<h4>여러 번 검정하면</h4><p>검정 m개를 각각 α로 하면 하나라도 헛경보가 날 확률은 1 − (1 − α)<sup>m</sup>입니다. 본페로니 보정은 기준을 α ÷ m으로 낮춥니다.</p>",
    },
]

PROBLEMS = []


def steps(pid, domain, title, level, uses, intro, setup, items, printline, extra_hint="변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."):
    """items: [(var, 설명, 정답식, check_template)] check_template 에서 {v}는 계산한 정답값."""
    sol = [setup.rstrip(), ""]
    for k, (var, label, rhs, _) in enumerate(items, 1):
        sol += [f"# {k}. {label}", f"{var} = {rhs}"]
    sol += ["", printline]
    solution = "\n".join(sol) + "\n"
    ns = {}
    exec(solution, ns)
    starter = re.sub(r"^(# \d+\. .*\n)(\w+) = .*$", r"\1\2 = ", solution, flags=re.M)
    checks = []
    for k, (var, label, rhs, tmpl) in enumerate(items, 1):
        v = ns[var]
        if hasattr(v, "item") and getattr(v, "shape", None) == ():
            v = v.item()
        checks.append({"label": f"{k}단계 {label}", "expr": tmpl.format(v=repr(v), var=var), "hint": rhs})
    desc = f"<p>{intro}</p>\n<ol>" + "".join(f"<li><code>{var}</code>: {label}</li>" for var, label, _, _ in items) + "</ol>"
    PROBLEMS.append({
        "id": pid, "unit": int(pid.split("-")[0]), "domain": domain, "title": title, "type": "steps", "level": level,
        "uses": uses, "origin": "통계", "desc": desc, "starter": starter, "solution": solution,
        "hints": [items[0][2], extra_hint], "checks": checks,
    })


F = "abs({var} - {v}) < 1e-6"

# ───────────── 유닛 47 확률 기초 ─────────────
steps("48-1", "mfg", "라인별 불량률: 교차표로 조건부확률 구하기", 1,
      [["pd.crosstab(행, 열)", "두 범주의 교차표"], ["P(A | B)", "B에 해당하는 것만 분모로"], ["P(B | A)", "방향을 바꾸면 분모도 바뀜"]],
      "A·B 두 라인에서 나온 제품 1,000개의 불량 여부입니다. 교차표를 만들고, 전체 불량률과 라인별 불량률, 그리고 불량품이 B라인에서 나왔을 확률을 구합니다.",
      "import pandas as pd\n\ndf = pd.DataFrame({\n    'line': ['A'] * 400 + ['B'] * 600,\n    'defect': ['불량'] * 12 + ['양품'] * 388 + ['불량'] * 36 + ['양품'] * 564,\n})",
      [("table", "line(행) × defect(열) 교차표", "pd.crosstab(df['line'], df['defect'])", "int({var}.loc['B', '불량']) == 36 and int({var}.values.sum()) == 1000"),
       ("p_def", "전체 불량률 P(불량)", "(df['defect'] == '불량').mean()", F),
       ("p_def_B", "B라인일 때 불량률 P(불량 | B)", "table.loc['B', '불량'] / table.loc['B'].sum()", F),
       ("p_B_def", "불량품이 B라인 것일 확률 P(B | 불량)", "table.loc['B', '불량'] / table['불량'].sum()", F),
       ("ratio", "B라인 불량률 ÷ A라인 불량률", "p_def_B / (table.loc['A', '불량'] / table.loc['A'].sum())", F)],
      "print(table)\nprint(round(p_def, 3), round(p_def_B, 3), round(p_B_def, 3), round(ratio, 2))")

steps("48-2", "mfg", "비전 검사기 알람을 믿어도 될까 (베이즈 정리)", 2,
      [["P(알람) = P(알람|불량)P(불량) + P(알람|양품)P(양품)", "전확률"], ["P(불량|알람) = P(알람|불량)P(불량) ÷ P(알람)", "베이즈 정리"]],
      "불량률은 2%입니다. 비전 검사기는 불량품의 95%에서 알람을 울리고(검출률), 양품에서도 3%는 잘못 알람을 울립니다. 알람이 울린 제품이 정말 불량일 확률을 구합니다.",
      "prior = 0.02    # P(불량)\nsens = 0.95     # P(알람 | 불량)\nfalse_alarm = 0.03   # P(알람 | 양품)",
      [("p_alarm", "알람이 울릴 확률 P(알람)", "sens * prior + false_alarm * (1 - prior)", F),
       ("post", "알람일 때 진짜 불량일 확률 P(불량 | 알람)", "sens * prior / p_alarm", F),
       ("true_alarms", "10,000개 중 진짜 불량에서 울린 알람 수", "round(10000 * prior * sens)", "{var} == {v}"),
       ("false_alarms", "10,000개 중 양품에서 울린 알람 수", "round(10000 * (1 - prior) * false_alarm)", "{var} == {v}"),
       ("post2", "독립인 두 번째 검사기도 알람을 울렸을 때 P(불량 | 알람 두 번)", "sens * post / (sens * post + false_alarm * (1 - post))", F)],
      "print(round(p_alarm, 4), round(post, 3), true_alarms, false_alarms, round(post2, 3))")

steps("48-3", "general", "운영체제별 구독률: 교차표로 조건부확률 구하기", 1,
      [["pd.crosstab(행, 열)", "두 범주의 교차표"], ["P(A | B)", "B에 해당하는 것만 분모로"], ["향상도(lift) = P(A | B) ÷ P(A)", "조건이 확률을 몇 배로 바꾸나"]],
      "앱 사용자 500명의 운영체제(<code>os</code>)와 유료 구독 여부(<code>sub</code>)입니다. 전체 구독률, iOS 사용자의 구독률, 구독자 중 iOS 비율을 구합니다.",
      "import pandas as pd\n\ndf = pd.DataFrame({\n    'os': ['iOS'] * 200 + ['Android'] * 300,\n    'sub': ['구독'] * 50 + ['무료'] * 150 + ['구독'] * 30 + ['무료'] * 270,\n})",
      [("table", "os(행) × sub(열) 교차표", "pd.crosstab(df['os'], df['sub'])", "int({var}.loc['iOS', '구독']) == 50 and int({var}.values.sum()) == 500"),
       ("p_sub", "전체 구독률 P(구독)", "(df['sub'] == '구독').mean()", F),
       ("p_sub_ios", "iOS일 때 구독률 P(구독 | iOS)", "table.loc['iOS', '구독'] / table.loc['iOS'].sum()", F),
       ("p_ios_sub", "구독자가 iOS일 확률 P(iOS | 구독)", "table.loc['iOS', '구독'] / table['구독'].sum()", F),
       ("lift", "향상도 P(구독 | iOS) ÷ P(구독)", "p_sub_ios / p_sub", F)],
      "print(table)\nprint(round(p_sub, 3), round(p_sub_ios, 3), round(p_ios_sub, 3), round(lift, 3))")

steps("48-4", "general", "'무료'가 들어간 메일은 스팸일까 (베이즈 + 시뮬레이션)", 2,
      [["P(스팸|단어) = P(단어|스팸)P(스팸) ÷ P(단어)", "베이즈 정리"], ["rng.random(n) < p", "확률 p인 사건을 n번 흉내"], ["배열[조건].mean()", "조건에 맞는 것만 골라 비율"]],
      "메일의 20%가 스팸입니다. '무료'라는 단어는 스팸의 40%, 정상 메일의 5%에 들어 있습니다. 베이즈 정리로 계산하고, 메일 100,000통을 시뮬레이션해서 같은 값이 나오는지 확인합니다.",
      "import numpy as np\n\nprior, p_word_spam, p_word_ham = 0.2, 0.4, 0.05\nrng = np.random.default_rng(0)",
      [("p_word", "'무료'가 들어 있을 확률 P(단어)", "p_word_spam * prior + p_word_ham * (1 - prior)", F),
       ("post", "'무료'가 있을 때 스팸일 확률 P(스팸 | 단어)", "p_word_spam * prior / p_word", F),
       ("spam", "메일 100,000통의 스팸 여부 (True/False 배열)", "rng.random(100_000) < prior", "len({var}) == 100000 and abs({var}.mean() - 0.2) < 0.01"),
       ("word", "각 메일에 '무료'가 있는지 (스팸이면 0.4, 아니면 0.05 확률)", "rng.random(100_000) < np.where(spam, p_word_spam, p_word_ham)", "len({var}) == 100000 and abs({var}.mean() - 0.12) < 0.01"),
       ("sim_post", "시뮬레이션으로 구한 P(스팸 | 단어)", "spam[word].mean()", "abs({var} - 0.6666666666666666) < 0.02")],
      "print(round(p_word, 3), round(post, 3), round(float(sim_post), 3))")

# ───────────── 유닛 48 통계 해석 ─────────────
SIMPSON_SETUP = """import pandas as pd

def make(line, size, n, bad):
    return pd.DataFrame({'line': line, 'size': size, 'defect': [1] * bad + [0] * (n - bad)})

df = pd.concat([
    make('A', '소형', 800, 24), make('A', '대형', 200, 24),
    make('B', '소형', 200, 4), make('B', '대형', 800, 80),
], ignore_index=True)"""
steps("49-1", "mfg", "어느 라인이 더 나은가: 심슨의 역설", 2,
      [["groupby(열)[값].mean()", "그룹별 비율"], ["groupby([층, 그룹])[값].mean().unstack()", "층별로 나눈 비율 표"], ["pd.crosstab(..., normalize='index')", "그룹별 구성비"]],
      "A·B 라인에서 소형·대형 제품을 1,000개씩 만들었습니다(<code>defect</code> 1 = 불량). 전체 불량률로 보면 A가 낫지만, 크기별로 나눠 보면 결론이 바뀝니다. 그 이유를 숫자로 확인합니다.",
      SIMPSON_SETUP,
      [("overall", "라인별 전체 불량률 Series", "df.groupby('line')['defect'].mean()", "abs({var}['A'] - 0.048) < 1e-9 and abs({var}['B'] - 0.084) < 1e-9"),
       ("by_size", "크기(행) × 라인(열) 불량률 표", "df.groupby(['size', 'line'])['defect'].mean().unstack()", "abs({var}.loc['소형', 'B'] - 0.02) < 1e-9 and abs({var}.loc['대형', 'A'] - 0.12) < 1e-9"),
       ("mix", "라인(행)별 크기 구성비 (행 합 = 1)", "pd.crosstab(df['line'], df['size'], normalize='index')", "abs({var}.loc['A', '소형'] - 0.8) < 1e-9 and abs({var}.loc['B', '대형'] - 0.8) < 1e-9"),
       ("std_rate", "소형·대형을 반반 만든다고 맞춘 라인별 표준화 불량률 Series", "by_size.mean()", "abs({var}['A'] - 0.075) < 1e-9 and abs({var}['B'] - 0.06) < 1e-9"),
       ("better", "표준화 불량률이 더 낮은 라인 이름", "std_rate.idxmin()", "{var} == 'B'")],
      "print(overall.round(3).to_dict())\nprint(by_size.round(3))\nprint(mix.round(2))\nprint(std_rate.round(3).to_dict(), better)")

steps("49-2", "mfg", "개선 전후 결과를 보고 문장으로 만들기", 2,
      [["stats.ttest_ind(a, b, equal_var=False)", "Welch t검정"], ["결과.confidence_interval(0.95)", "평균 차이의 95% 신뢰구간 (.low, .high)"], ["Cohen's d = 차이 ÷ 합동 표준편차", "효과 크기"]],
      "도금 두께 편차(μm)를 개선 전 12개 로트, 개선 후 12개 로트에서 쟀습니다. 보고에 필요한 네 가지(차이 · 신뢰구간 · p-value · 효과 크기)를 계산합니다.",
      "import numpy as np\nfrom scipy import stats\n\nbefore = np.array([2.9, 3.4, 3.1, 2.7, 3.6, 3.2, 3.0, 3.5, 2.8, 3.3, 3.1, 3.4])\nafter = np.array([2.6, 2.9, 2.7, 3.0, 2.5, 2.8, 3.1, 2.6, 2.9, 2.7, 3.0, 2.8])",
      [("diff", "평균 차이 (개선 후 − 개선 전)", "after.mean() - before.mean()", F),
       ("res", "Welch t검정 결과 (after, before 순서)", "stats.ttest_ind(after, before, equal_var=False)", "abs({var}.pvalue - stats.ttest_ind(after, before, equal_var=False).pvalue) < 1e-12"),
       ("ci", "평균 차이의 95% 신뢰구간", "res.confidence_interval(0.95)", "abs({var}.low - {{low}}) < 1e-6 and abs({var}.high - {{high}}) < 1e-6"),
       ("p", "p-value", "float(res.pvalue)", F),
       ("d", "Cohen's d (차이 ÷ 두 그룹 표준편차(ddof=1)의 제곱평균 제곱근)", "diff / np.sqrt((before.std(ddof=1) ** 2 + after.std(ddof=1) ** 2) / 2)", F)],
      "print(f'편차가 {diff:.2f}μm 바뀜 (95% CI {ci.low:.2f} ~ {ci.high:.2f}, p = {p:.4f}, d = {d:.2f})')")

steps("49-3", "general", "아이스크림과 물놀이 사고: 기온의 영향 빼기", 2,
      [["np.corrcoef(x, y)[0, 1]", "상관계수"], ["np.polyfit(z, x, 1) / np.polyval", "z로 x를 예측하는 직선"], ["잔차 = 실제 − 예측", "z로 설명되지 않고 남은 부분"]],
      "어느 해 여름 60일의 기온(℃), 아이스크림 판매량, 물놀이 사고 건수입니다. 판매량과 사고는 강하게 함께 움직이지만, 기온의 영향을 빼면(편상관) 관계가 거의 사라지는 것과, 30℃ 이상만 골라내는 식으로 거칠게 나누면 기온 차이가 남아 상관도 남는 것을 확인합니다.",
      "import numpy as np\n\nrng = np.random.default_rng(1)\ntemp = rng.uniform(22, 36, 60).round(1)\nice = (temp * 30 + rng.normal(0, 25, 60)).round()\nacc = (temp * 0.5 + rng.normal(0, 1.2, 60)).round(1)",
      [("r_all", "판매량 · 사고 상관계수", "np.corrcoef(ice, acc)[0, 1]", F),
       ("ice_res", "기온으로 판매량을 예측하고 남은 잔차 배열", "ice - np.polyval(np.polyfit(temp, ice, 1), temp)", "len({var}) == 60 and abs({var}.mean()) < 1e-6"),
       ("acc_res", "기온으로 사고를 예측하고 남은 잔차 배열", "acc - np.polyval(np.polyfit(temp, acc, 1), temp)", "len({var}) == 60 and abs({var}.mean()) < 1e-6"),
       ("r_partial", "두 잔차끼리의 상관계수 (기온을 뺀 편상관)", "np.corrcoef(ice_res, acc_res)[0, 1]", F),
       ("r_hot", "기온 30℃ 이상인 날만 골라 구한 판매량 · 사고 상관계수", "np.corrcoef(ice[temp >= 30], acc[temp >= 30])[0, 1]", F)],
      "print(round(r_all, 3), round(r_partial, 3), round(r_hot, 3))")

steps("49-4", "general", "지표 20개 중 '유의한' 것은 몇 개일까: 다중비교", 1,
      [["(배열 < 기준).sum()", "기준보다 작은 개수"], ["1 − (1 − α)^m", "하나라도 헛경보가 날 확률"], ["α ÷ m", "본페로니 보정 기준"]],
      "A/B 테스트에서 지표 20개를 각각 검정해 얻은 p-value입니다. 보정 없이 볼 때와 본페로니 보정을 했을 때 유의한 지표 수를 비교합니다.",
      "import numpy as np\n\nnames = [f'지표{i:02d}' for i in range(1, 21)]\npvals = np.array([0.41, 0.032, 0.77, 0.0012, 0.25, 0.048, 0.66, 0.12, 0.91, 0.019,\n                  0.53, 0.35, 0.0021, 0.84, 0.072, 0.29, 0.61, 0.044, 0.18, 0.97])\nalpha = 0.05",
      [("n_sig", "보정 없이 p < 0.05인 지표 수", "int((pvals < alpha).sum())", "{var} == {v}"),
       ("fwer", "효과가 전혀 없어도 20개 중 하나라도 유의하게 나올 확률", "1 - (1 - alpha) ** len(pvals)", F),
       ("bonf", "본페로니 보정 기준", "alpha / len(pvals)", F),
       ("n_sig_bonf", "보정 후 유의한 지표 수", "int((pvals < bonf).sum())", "{var} == {v}"),
       ("sig_names", "보정 후에도 유의한 지표 이름 리스트", "[n for n, p in zip(names, pvals) if p < bonf]", "list({var}) == {v}")],
      "print(n_sig, round(fwer, 3), bonf, n_sig_bonf, sig_names)")

# 49-2 ci 템플릿은 low/high 값을 따로 채운다
for p in PROBLEMS:
    if p["id"] == "49-2":
        ns = {}
        exec(p["solution"], ns)
        for c in p["checks"]:
            c["expr"] = c["expr"].replace("{low}", repr(float(ns["ci"].low))).replace("{high}", repr(float(ns["ci"].high)))

QUIZZES = [
    {
        "id": "48-Q", "unit": 48, "title": "확률 기초 개념 퀴즈", "type": "quiz", "level": 1, "origin": "코드 작성 · 객관식 · OX",
        "questions": [
            {"kind": "write", "q": "교차표 t에서 '여성일 때 생존할 확률' P(생존 | 여성)을 소수 셋째 자리까지 출력하는 코드를 작성하세요.",
             "given": "import pandas as pd\nt = pd.DataFrame({'사망': [81, 468], '생존': [233, 109]}, index=['여성', '남성'])",
             "expect": ["0.742"], "must": ["t\\.loc|t\\["],
             "solution": "import pandas as pd\nt = pd.DataFrame({'사망': [81, 468], '생존': [233, 109]}, index=['여성', '남성'])\nprint(round(t.loc['여성', '생존'] / t.loc['여성'].sum(), 3))",
             "explain": "조건(여성)에 맞는 행의 합계 314가 분모입니다. 233 ÷ 314 = 0.742."},
            {"kind": "ox", "q": "P(A | B)와 P(B | A)는 항상 같다.", "answer": False,
             "explain": "분모가 다릅니다. P(양성 | 병)이 90%여도 P(병 | 양성)은 15%일 수 있습니다."},
            {"kind": "choice", "q": "유병률 1%, 검출률 90%, 위양성률 5%인 검사에서 양성이 나왔다. 진짜 병일 확률에 가장 가까운 것은?",
             "options": ["90%", "50%", "15%", "1%"], "answer": 2,
             "explain": "0.9 × 0.01 ÷ (0.9 × 0.01 + 0.05 × 0.99) ≈ 0.154. 병 없는 사람이 워낙 많아 위양성이 진짜 양성보다 많습니다."},
            {"kind": "short", "q": "공정한 주사위를 한 번 던질 때 '짝수이면서 4 이상'일 확률은? (분수 또는 소수)", "answer": ["1/3", "0.333", ".333", "2/6"],
             "explain": "짝수 {2, 4, 6}과 4 이상 {4, 5, 6}의 겹침은 {4, 6}, 2/6 = 1/3."},
            {"kind": "ox", "q": "동전을 5번 던져 모두 앞면이 나왔다면, 6번째는 뒷면이 나올 확률이 0.5보다 크다.", "answer": False,
             "explain": "각 던지기는 독립입니다. 큰 수의 법칙은 '많이 던지면 비율이 0.5에 가까워진다'는 뜻이지, 앞의 결과를 메워 준다는 뜻이 아닙니다."},
        ],
    },
    {
        "id": "49-Q", "unit": 49, "title": "통계 해석 개념 퀴즈", "type": "quiz", "level": 1, "origin": "코드 작성 · 객관식 · OX",
        "questions": [
            {"kind": "write", "q": "지표 5개를 함께 판단할 때 본페로니 보정 기준(α = 0.05)을 출력하는 코드를 작성하세요.",
             "given": "alpha, m = 0.05, 5", "expect": ["0.01"], "must": ["alpha"],
             "solution": "alpha, m = 0.05, 5\nprint(alpha / m)",
             "explain": "본페로니 보정은 α를 검정 수로 나눕니다. 0.05 ÷ 5 = 0.01."},
            {"kind": "ox", "q": "두 변수의 상관계수가 0.9라면 한쪽이 다른 쪽의 원인이다.", "answer": False,
             "explain": "교란변수, 역인과, 우연 때문에도 강한 상관이 나올 수 있습니다."},
            {"kind": "choice", "q": "각 학과에서는 여학생 합격률이 더 높은데, 대학 전체로는 남학생 합격률이 더 높았다. 가장 그럴듯한 설명은?",
             "options": ["계산 실수", "여학생이 경쟁률 높은 학과에 더 많이 지원했다", "표본이 너무 크다", "p-value가 작다"], "answer": 1,
             "explain": "그룹(학과) 구성이 달라 합친 비율이 뒤집히는 심슨의 역설입니다."},
            {"kind": "choice", "q": "결과를 보고할 때 p-value와 함께 꼭 적어야 할 것은?",
             "options": ["검정 통계량의 이름만", "차이의 크기와 신뢰구간", "사용한 파이썬 버전", "유의하지 않은 지표는 빼기"], "answer": 1,
             "explain": "p-value는 '우연이 아니다'만 말합니다. 얼마나 다른지(효과 크기)와 얼마나 확실한지(신뢰구간)를 함께 적습니다."},
            {"kind": "short", "q": "효과가 전혀 없는 지표 10개를 각각 α = 0.05로 검정할 때, 하나라도 유의하게 나올 확률은? (소수 둘째 자리)",
             "answer": ["0.40", "0.4", ".40", ".4"], "explain": "1 − 0.95¹⁰ ≈ 0.401."},
        ],
    },
]


def js(name, obj):
    return f"export const {name} = " + json.dumps(obj, ensure_ascii=False, indent=2) + ";\n"


if __name__ == "__main__":
    head = ("// 통계 트랙 유닛 48(확률 기초) · 49(통계 해석 실수 피하기) 문제. scripts/build_stats3.py 로 생성.\n"
            "// domain: \"mfg\" = QAQC 과정(제조), \"general\" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.\n")
    out = head + js("ST3_UNITS", UNITS) + js("ST3_PROBLEMS", PROBLEMS) + js("ST3_QUIZZES", QUIZZES)
    with open(os.path.join(ROOT, "problems-stats3.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print(len(PROBLEMS), "problems,", len(QUIZZES), "quizzes")
