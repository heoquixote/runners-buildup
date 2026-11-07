"""머신러닝 유닛 51(ml-11 현장에 내보내기: 모델 저장 · 드리프트 · 미니 프로젝트) 문제 생성기.

python3 scripts/build_ml4.py  ->  problems-ml4.js
모범답안을 실제로 실행해 정답 값을 채우고, 모범답안의 `# N. 설명` 다음 줄 `변수 = 식`에서 식을 비워 시작 코드를 만든다.
"""
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(os.path.join(ROOT, "datasets"))   # 모범답안은 read_csv('파일명')으로 읽는다

UNITS = [
    {
        "id": 51,
        "title": "현장에 내보내기",
        "summary": "모델 저장 · 불러오기, 드리프트 감시(KS 통계량), 처음부터 끝까지 미니 프로젝트",
        "note": "<h4>모델 저장</h4><p>전처리까지 묶은 <b>Pipeline 전체</b>를 저장합니다. <code>pickle.dumps(모델)</code>은 바이트로, <code>pickle.loads(바이트)</code>는 다시 모델로 바꿉니다(파일이면 <code>pickle.dump</code> / <code>pickle.load</code>). 불러온 모델은 원래 모델과 예측이 똑같아야 합니다.</p>"
                "<h4>드리프트</h4><p>새 데이터의 분포가 학습 때와 달라지는 것. 정답은 늦게 오므로 <b>입력 분포</b>부터 비교합니다. "
                "<code>from scipy.stats import ks_2samp</code>, <code>ks_2samp(학습열, 새열).statistic</code>은 두 누적 분포 사이 가장 큰 간격(0~1)입니다.</p>"
                "<h4>프로젝트 순서</h4><p>시험용 먼저 떼기(stratify) → Pipeline → 학습용 교차검증으로 모델 고르기 → "
                "<code>cross_val_predict(..., method='predict_proba')</code>로 기준선 정하기 → 시험용은 마지막에 한 번.</p>",
    }
]

PROBLEMS = []

import pandas as _pd
from scipy.stats import ks_2samp as _ks
_df = _pd.read_csv("ai4i2020.csv")
KS_AIR = float(_ks(_df["air_temp"].iloc[:4000], _df["air_temp"].iloc[4000:6000]).statistic)
KS_RPM = float(_ks(_df["rpm"].iloc[:4000], _df["rpm"].iloc[4000:6000]).statistic)


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
        "uses": uses, "origin": "머신러닝", "desc": desc, "starter": starter, "solution": solution,
        "hints": [items[0][2], extra_hint], "checks": checks,
    })


F = "abs({var} - {v}) < 1e-6"
AI4I = ("<b>데이터</b>: AI4I 2020 설비 고장 데이터(1만 건, 시간 순서대로 쌓임). <code>air_temp</code>(공기 온도, K), <code>process_temp</code>(공정 온도, K), "
        "<code>rpm</code>, <code>torque</code>, <code>tool_wear</code>, <code>failure</code>(고장 1 / 정상 0).")
TITANIC = ("<b>데이터</b>: 타이타닉 승객 891명. <code>pclass</code>(객실 등급), <code>sex</code>, <code>age</code>(빈칸 있음), <code>sibsp</code>, <code>parch</code>, "
           "<code>fare</code>(운임), <code>survived</code>(생존 1 / 사망 0).")

# ───────────── 51-1 제조: 저장하고 드리프트 감시 ─────────────
steps("51-1", "mfg", "고장 모델을 저장하고, 더운 구간의 드리프트 잡기", 2,
      [["pickle.dumps(모델) / pickle.loads(바이트)", "모델 → 바이트 → 모델"], ["ks_2samp(a, b).statistic", "두 분포의 가장 큰 간격"], ["[c for c in 목록 if 조건]", "조건에 맞는 열만 고르기"]],
      AI4I + " 시작 코드가 앞 4,000행(<code>train</code>)으로 Pipeline을 학습해 둡니다. 다음 2,000행(<code>new</code>)은 기온이 높은 구간입니다.",
      """import pickle
import pandas as pd
from scipy.stats import ks_2samp
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

df = pd.read_csv('ai4i2020.csv')
features = ['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']
train, new = df.iloc[:4000], df.iloc[4000:6000]
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(train[features], train['failure'])""",
      [("blob", "model을 pickle로 바꾼 바이트", "pickle.dumps(model)", "isinstance({var}, bytes) and len({var}) > 100"),
       ("loaded", "blob을 다시 불러온 모델", "pickle.loads(blob)", "(loaded.predict_proba(new[features]) == model.predict_proba(new[features])).all()"),
       ("same", "new에서 두 모델의 예측(predict)이 모두 같은지 (True/False)", "bool((loaded.predict(new[features]) == model.predict(new[features])).all())", "{var} is True"),
       ("ks", "열 이름 → train과 new의 KS 통계량 딕셔너리", "{c: ks_2samp(train[c], new[c]).statistic for c in features}", "abs({var}['air_temp'] - %r) < 1e-9 and abs({var}['rpm'] - %r) < 1e-9" % (KS_AIR, KS_RPM)),
       ("drift_cols", "KS가 0.1보다 큰 열 이름 리스트 (features 순서대로)", "[c for c in features if ks[c] > 0.1]", "list({var}) == {v}")],
      "print(same, {c: round(float(v), 3) for c, v in ks.items()}, drift_cols)")

# ───────────── 51-2 일반: 다른 손님에게 쓰면 ─────────────
steps("51-2", "general", "1·2등실로 배운 모델을 3등실에 쓰면: 분포 변화 확인", 2,
      [["ks_2samp(a, b).statistic", "두 분포의 가장 큰 간격"], ["모델.score(X, y)", "정확도"], ["열.mean()", "평균 비교"]],
      TITANIC + " 시작 코드가 1·2등실 승객(<code>old</code>)으로만 모델을 학습해 둡니다. 이 모델을 3등실 승객(<code>new</code>)에게 쓰면 어떻게 될지 확인합니다.",
      """import pandas as pd
from scipy.stats import ks_2samp
from sklearn.tree import DecisionTreeClassifier

df = pd.read_csv('titanic.csv')
df['female'] = (df['sex'] == 'female').astype(int)
df['age'] = df['age'].fillna(df['age'].median())
features = ['female', 'age', 'sibsp', 'parch', 'fare']
old, new = df[df['pclass'] <= 2], df[df['pclass'] == 3]
model = DecisionTreeClassifier(max_depth=3, random_state=0).fit(old[features], old['survived'])""",
      [("acc_old", "old에서의 정확도 (학습한 데이터)", "model.score(old[features], old['survived'])", F),
       ("acc_new", "new(3등실)에서의 정확도", "model.score(new[features], new['survived'])", F),
       ("fare_gap", "운임 평균 차이 (old 평균 − new 평균)", "old['fare'].mean() - new['fare'].mean()", F),
       ("ks_fare", "old와 new의 운임 KS 통계량", "ks_2samp(old['fare'], new['fare']).statistic", F),
       ("surv_gap", "실제 생존율 차이 (old − new)", "old['survived'].mean() - new['survived'].mean()", F)],
      "print(round(acc_old, 3), round(acc_new, 3), round(fare_gap, 1), round(ks_fare, 3), round(surv_gap, 3))")

# ───────────── 51-3 제조: 미니 프로젝트 ─────────────
steps("51-3", "mfg", "미니 프로젝트: 비용으로 기준선 정하고 한 번만 시험하기", 3,
      [["{t: 식 for t in 목록}", "기준선별 비용 딕셔너리"], ["min(딕셔너리, key=딕셔너리.get)", "값이 가장 작은 키"], ["cross_val_predict(..., method='predict_proba')", "학습용 안에서 확률 예측"]],
      AI4I + " 놓침 1건은 100만 원, 헛경보 1건은 5만 원입니다. 시작 코드가 시험용 20%를 떼어 두고 비용 함수 <code>cost(정답, 확률, 기준선)</code>을 만들어 둡니다. 기준선은 학습용 교차검증 예측으로만 정하고, 시험용은 마지막에 한 번만 씁니다.",
      """import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_predict, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, recall_score

df = pd.read_csv('ai4i2020.csv')
df['power'] = df['rpm'] * df['torque'] * 2 * 3.1416 / 60
df['temp_gap'] = df['process_temp'] - df['air_temp']
features = ['air_temp', 'rpm', 'torque', 'tool_wear', 'power', 'temp_gap']
X, y = df[features], df['failure']
model = RandomForestClassifier(n_estimators=50, min_samples_leaf=3, class_weight='balanced', random_state=0, n_jobs=1)
cv = StratifiedKFold(5, shuffle=True, random_state=0)

def cost(y_true, proba, t):
    tn, fp, fn, tp = confusion_matrix(y_true, (proba >= t).astype(int)).ravel()
    return int(fn * 100 + fp * 5)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)""",
      [("oof", "학습용(X_train, y_train) 5-fold 교차검증으로 얻은 고장 확률 배열", "cross_val_predict(model, X_train, y_train, cv=cv, method='predict_proba')[:, 1]", "len({var}) == 8000 and 0 <= min({var}) and max({var}) <= 1"),
       ("costs", "기준선 0.05, 0.1, 0.15, 0.2, 0.3 → 학습용 총비용(만 원) 딕셔너리", "{t: cost(y_train, oof, t) for t in [0.05, 0.1, 0.15, 0.2, 0.3]}", "{var} == {v}"),
       ("best_t", "costs에서 비용이 가장 적은 기준선", "min(costs, key=costs.get)", "abs({var} - {v}) < 1e-9"),
       ("test_proba", "학습용 전체로 model을 학습한 뒤 시험용에서 낸 고장 확률", "model.fit(X_train, y_train).predict_proba(X_test)[:, 1]", "len({var}) == 2000"),
       ("test_recall", "시험용에서 best_t로 판정한 재현율 (시험용은 여기서 한 번만)", "recall_score(y_test, (test_proba >= best_t).astype(int))", F)],
      "print(costs, best_t, round(float(test_recall), 3))")

# ───────────── 51-4 일반: 미니 프로젝트 ─────────────
steps("51-4", "general", "미니 프로젝트: 타이타닉 생존 예측 한 바퀴", 2,
      [["DummyClassifier()", "기준 모델(가장 많은 쪽만 답함)"], ["make_pipeline(ColumnTransformer(...), 모델)", "손질 + 모델"], ["cross_val_score(파이프라인, X, y, cv=5).mean()", "학습용 안에서 비교"]],
      TITANIC + " 시작 코드가 시험용 25%를 떼어 두고, 숫자 열은 중앙값으로 채우고 성별은 원-핫으로 바꾸는 손질(<code>pre</code>)을 만들어 둡니다.",
      """import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv('titanic.csv')
num_cols, cat_cols = ['pclass', 'age', 'sibsp', 'parch', 'fare'], ['sex']
X, y = df[num_cols + cat_cols], df['survived']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)
pre = ColumnTransformer([('num', SimpleImputer(strategy='median'), num_cols), ('cat', OneHotEncoder(), cat_cols)])""",
      [("base", "기준 모델(DummyClassifier)의 학습용 5-fold 정확도 평균", "cross_val_score(DummyClassifier(), X_train, y_train, cv=5).mean()", F),
       ("logit", "pre + LogisticRegression(max_iter=1000)의 학습용 5-fold 정확도 평균", "cross_val_score(make_pipeline(pre, LogisticRegression(max_iter=1000)), X_train, y_train, cv=5).mean()", F),
       ("forest", "pre + RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)의 학습용 5-fold 정확도 평균", "cross_val_score(make_pipeline(pre, RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)), X_train, y_train, cv=5).mean()", F),
       ("best", "logit과 forest 중 점수가 높은 쪽 이름 ('logit' 또는 'forest')", "'forest' if forest > logit else 'logit'", "{var} == {v}"),
       ("test_acc", "best 모델을 학습용 전체로 학습해 시험용에서 한 번 잰 정확도", "make_pipeline(pre, RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0) if best == 'forest' else LogisticRegression(max_iter=1000)).fit(X_train, y_train).score(X_test, y_test)", F)],
      "print(round(base, 3), round(logit, 3), round(forest, 3), best, round(test_acc, 3))")

QUIZZES = [
    {
        "id": "51-Q", "unit": 51, "title": "모델 저장 · 드리프트 · 프로젝트 순서 개념 퀴즈", "type": "quiz", "level": 1, "origin": "코드 작성 · 객관식 · OX",
        "questions": [
            {"kind": "write", "q": "두 표본 a, b의 KS 통계량을 소수 둘째 자리까지 출력하는 코드를 작성하세요.",
             "given": "from scipy.stats import ks_2samp\na = [1, 2, 3, 4, 5]\nb = [3, 4, 5, 6, 7]",
             "expect": "0.4", "must": ["ks_2samp\\("],
             "solution": "from scipy.stats import ks_2samp\na = [1, 2, 3, 4, 5]\nb = [3, 4, 5, 6, 7]\nprint(round(ks_2samp(a, b).statistic, 2))",
             "explain": "누적 분포를 겹쳐 보면 2에서 a는 0.4, b는 0이라 가장 큰 간격이 0.4입니다."},
            {"kind": "ox", "q": "모델을 저장할 때는 학습된 분류기만 저장하고, 표준화 같은 전처리는 예측할 때 다시 짜면 된다.", "answer": False,
             "explain": "전처리 기준(평균·표준편차 등)도 학습된 값입니다. Pipeline 전체를 저장해야 예측할 때 똑같은 손질이 됩니다."},
            {"kind": "choice", "q": "미니 프로젝트에서 판정 기준선(임계값)은 무엇으로 정해야 할까?",
             "options": ["시험용 데이터에서 점수가 가장 좋은 값", "학습용 교차검증 예측에서 총비용이 가장 적은 값", "언제나 0.5", "전체 데이터에서 재현율이 1이 되는 값"], "answer": 1,
             "explain": "시험용으로 고르면 시험 점수가 부풀려집니다. 학습용 안의 교차검증 예측으로 고르고, 시험용은 마지막에 한 번만 씁니다."},
            {"kind": "choice", "q": "배포한 고장 모델의 재현율이 여름에 크게 떨어졌다. 입력 열의 KS 통계량이 air_temp 0.76, rpm 0.02였다면 가장 먼저 의심할 것은?",
             "options": ["회전수 센서 고장", "기온이 학습 때와 달라진 드리프트", "모델 파일이 깨짐", "판정 기준선이 너무 낮음"], "answer": 1,
             "explain": "공기 온도 분포만 크게 달라졌습니다. 학습 때 거의 없던 온도 구간이라 모델이 그 상황을 배우지 못한 것입니다. 최근 데이터로 재학습을 검토합니다."},
        ],
    },
]


def js(name, obj):
    return f"export const {name} = " + json.dumps(obj, ensure_ascii=False, indent=2) + ";\n"


if __name__ == "__main__":
    head = ("// 머신러닝 유닛 51(ml-11 현장에 내보내기) 문제. scripts/build_ml4.py 로 생성.\n"
            "// domain: \"mfg\" = QAQC 과정(제조), \"general\" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.\n")
    out = head + js("ML4_UNITS", UNITS) + js("ML4_PROBLEMS", PROBLEMS) + js("ML4_QUIZZES", QUIZZES)
    with open(os.path.join(ROOT, "problems-ml4.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print(len(PROBLEMS), "problems,", len(QUIZZES), "quizzes")
