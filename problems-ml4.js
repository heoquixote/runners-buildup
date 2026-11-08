// 머신러닝 유닛 51(ml-11 현장에 내보내기) 문제. scripts/build_ml4.py 로 생성.
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.
export const ML4_UNITS = [
  {
    "id": 51,
    "title": "현장에 내보내기",
    "summary": "모델 저장 · 불러오기, 드리프트 감시(KS 통계량), 처음부터 끝까지 미니 프로젝트",
    "note": "<h4>모델 저장</h4><p>전처리까지 묶은 <b>Pipeline 전체</b>를 저장합니다. <code>pickle.dumps(모델)</code>은 바이트로, <code>pickle.loads(바이트)</code>는 다시 모델로 바꿉니다(파일이면 <code>pickle.dump</code> / <code>pickle.load</code>). 불러온 모델은 원래 모델과 예측이 똑같아야 합니다.</p><h4>드리프트</h4><p>새 데이터의 분포가 학습 때와 달라지는 것. 정답은 늦게 오므로 <b>입력 분포</b>부터 비교합니다. <code>from scipy.stats import ks_2samp</code>, <code>ks_2samp(학습열, 새열).statistic</code>은 두 누적 분포 사이 가장 큰 간격(0~1)입니다.</p><h4>프로젝트 순서</h4><p>시험용 먼저 떼기(stratify) → Pipeline → 학습용 교차검증으로 모델 고르기 → <code>cross_val_predict(..., method='predict_proba')</code>로 기준선 정하기 → 시험용은 마지막에 한 번.</p>"
  }
];
export const ML4_PROBLEMS = [
  {
    "id": "51-1",
    "unit": 51,
    "domain": "mfg",
    "title": "고장 모델을 저장하고, 더운 구간의 드리프트 잡기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "pickle.dumps(모델) / pickle.loads(바이트)",
        "모델 → 바이트 → 모델"
      ],
      [
        "ks_2samp(a, b).statistic",
        "두 분포의 가장 큰 간격"
      ],
      [
        "[c for c in 목록 if 조건]",
        "조건에 맞는 열만 고르기"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: AI4I 2020 설비 고장 데이터(1만 건, 시간 순서대로 쌓임). <code>air_temp</code>(공기 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>, <code>torque</code>, <code>tool_wear</code>, <code>failure</code>(고장 1 / 정상 0). 시작 코드가 앞 4,000행(<code>train</code>)으로 Pipeline을 학습해 둡니다. 다음 2,000행(<code>new</code>)은 기온이 높은 구간입니다.</p>\n<ol><li><code>blob</code>: model을 pickle로 바꾼 바이트</li><li><code>loaded</code>: blob을 다시 불러온 모델</li><li><code>same</code>: new에서 두 모델의 예측(predict)이 모두 같은지 (True/False)</li><li><code>ks</code>: 열 이름 → train과 new의 KS 통계량 딕셔너리</li><li><code>drift_cols</code>: KS가 0.1보다 큰 열 이름 리스트 (features 순서대로)</li></ol>",
    "starter": "import pickle\nimport pandas as pd\nfrom scipy.stats import ks_2samp\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\ndf = pd.read_csv('ai4i2020.csv')\nfeatures = ['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']\ntrain, new = df.iloc[:4000], df.iloc[4000:6000]\nmodel = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(train[features], train['failure'])\n\n# 1. model을 pickle로 바꾼 바이트\nblob = \n# 2. blob을 다시 불러온 모델\nloaded = \n# 3. new에서 두 모델의 예측(predict)이 모두 같은지 (True/False)\nsame = \n# 4. 열 이름 → train과 new의 KS 통계량 딕셔너리\nks = \n# 5. KS가 0.1보다 큰 열 이름 리스트 (features 순서대로)\ndrift_cols = \n\nprint(same, {c: round(float(v), 3) for c, v in ks.items()}, drift_cols)\n",
    "solution": "import pickle\nimport pandas as pd\nfrom scipy.stats import ks_2samp\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\ndf = pd.read_csv('ai4i2020.csv')\nfeatures = ['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']\ntrain, new = df.iloc[:4000], df.iloc[4000:6000]\nmodel = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(train[features], train['failure'])\n\n# 1. model을 pickle로 바꾼 바이트\nblob = pickle.dumps(model)\n# 2. blob을 다시 불러온 모델\nloaded = pickle.loads(blob)\n# 3. new에서 두 모델의 예측(predict)이 모두 같은지 (True/False)\nsame = bool((loaded.predict(new[features]) == model.predict(new[features])).all())\n# 4. 열 이름 → train과 new의 KS 통계량 딕셔너리\nks = {c: ks_2samp(train[c], new[c]).statistic for c in features}\n# 5. KS가 0.1보다 큰 열 이름 리스트 (features 순서대로)\ndrift_cols = [c for c in features if ks[c] > 0.1]\n\nprint(same, {c: round(float(v), 3) for c, v in ks.items()}, drift_cols)\n",
    "hints": [
      "pickle.dumps(model)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 model을 pickle로 바꾼 바이트",
        "expr": "isinstance(blob, bytes) and len(blob) > 100",
        "hint": "pickle.dumps(model)"
      },
      {
        "label": "2단계 blob을 다시 불러온 모델",
        "expr": "(loaded.predict_proba(new[features]) == model.predict_proba(new[features])).all()",
        "hint": "pickle.loads(blob)"
      },
      {
        "label": "3단계 new에서 두 모델의 예측(predict)이 모두 같은지 (True/False)",
        "expr": "same is True",
        "hint": "bool((loaded.predict(new[features]) == model.predict(new[features])).all())"
      },
      {
        "label": "4단계 열 이름 → train과 new의 KS 통계량 딕셔너리",
        "expr": "abs(ks['air_temp'] - 0.7625) < 1e-9 and abs(ks['rpm'] - 0.01775) < 1e-9",
        "hint": "{c: ks_2samp(train[c], new[c]).statistic for c in features}"
      },
      {
        "label": "5단계 KS가 0.1보다 큰 열 이름 리스트 (features 순서대로)",
        "expr": "list(drift_cols) == ['air_temp', 'process_temp']",
        "hint": "[c for c in features if ks[c] > 0.1]"
      }
    ]
  },
  {
    "id": "51-2",
    "unit": 51,
    "domain": "general",
    "title": "1·2등실로 배운 모델을 3등실에 쓰면: 분포 변화 확인",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "ks_2samp(a, b).statistic",
        "두 분포의 가장 큰 간격"
      ],
      [
        "모델.score(X, y)",
        "정확도"
      ],
      [
        "열.mean()",
        "평균 비교"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 타이타닉 승객 891명. <code>pclass</code>(객실 등급), <code>sex</code>, <code>age</code>(빈칸 있음), <code>sibsp</code>, <code>parch</code>, <code>fare</code>(운임), <code>survived</code>(생존 1 / 사망 0). 시작 코드가 1·2등실 승객(<code>old</code>)으로만 모델을 학습해 둡니다. 이 모델을 3등실 승객(<code>new</code>)에게 쓰면 어떻게 될지 확인합니다.</p>\n<ol><li><code>acc_old</code>: old에서의 정확도 (학습한 데이터)</li><li><code>acc_new</code>: new(3등실)에서의 정확도</li><li><code>fare_gap</code>: 운임 평균 차이 (old 평균 − new 평균)</li><li><code>ks_fare</code>: old와 new의 운임 KS 통계량</li><li><code>surv_gap</code>: 실제 생존율 차이 (old − new)</li></ol>",
    "starter": "import pandas as pd\nfrom scipy.stats import ks_2samp\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('titanic.csv')\ndf['female'] = (df['sex'] == 'female').astype(int)\ndf['age'] = df['age'].fillna(df['age'].median())\nfeatures = ['female', 'age', 'sibsp', 'parch', 'fare']\nold, new = df[df['pclass'] <= 2], df[df['pclass'] == 3]\nmodel = DecisionTreeClassifier(max_depth=3, random_state=0).fit(old[features], old['survived'])\n\n# 1. old에서의 정확도 (학습한 데이터)\nacc_old = \n# 2. new(3등실)에서의 정확도\nacc_new = \n# 3. 운임 평균 차이 (old 평균 − new 평균)\nfare_gap = \n# 4. old와 new의 운임 KS 통계량\nks_fare = \n# 5. 실제 생존율 차이 (old − new)\nsurv_gap = \n\nprint(round(acc_old, 3), round(acc_new, 3), round(fare_gap, 1), round(ks_fare, 3), round(surv_gap, 3))\n",
    "solution": "import pandas as pd\nfrom scipy.stats import ks_2samp\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('titanic.csv')\ndf['female'] = (df['sex'] == 'female').astype(int)\ndf['age'] = df['age'].fillna(df['age'].median())\nfeatures = ['female', 'age', 'sibsp', 'parch', 'fare']\nold, new = df[df['pclass'] <= 2], df[df['pclass'] == 3]\nmodel = DecisionTreeClassifier(max_depth=3, random_state=0).fit(old[features], old['survived'])\n\n# 1. old에서의 정확도 (학습한 데이터)\nacc_old = model.score(old[features], old['survived'])\n# 2. new(3등실)에서의 정확도\nacc_new = model.score(new[features], new['survived'])\n# 3. 운임 평균 차이 (old 평균 − new 평균)\nfare_gap = old['fare'].mean() - new['fare'].mean()\n# 4. old와 new의 운임 KS 통계량\nks_fare = ks_2samp(old['fare'], new['fare']).statistic\n# 5. 실제 생존율 차이 (old − new)\nsurv_gap = old['survived'].mean() - new['survived'].mean()\n\nprint(round(acc_old, 3), round(acc_new, 3), round(fare_gap, 1), round(ks_fare, 3), round(surv_gap, 3))\n",
    "hints": [
      "model.score(old[features], old['survived'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 old에서의 정확도 (학습한 데이터)",
        "expr": "abs(acc_old - 0.855) < 1e-6",
        "hint": "model.score(old[features], old['survived'])"
      },
      {
        "label": "2단계 new(3등실)에서의 정확도",
        "expr": "abs(acc_new - 0.745417515274949) < 1e-6",
        "hint": "model.score(new[features], new['survived'])"
      },
      {
        "label": "3단계 운임 평균 차이 (old 평균 − new 평균)",
        "expr": "abs(fare_gap - 41.27258539816701) < 1e-6",
        "hint": "old['fare'].mean() - new['fare'].mean()"
      },
      {
        "label": "4단계 old와 new의 운임 KS 통계량",
        "expr": "abs(ks_fare - 0.6359877800407332) < 1e-6",
        "hint": "ks_2samp(old['fare'], new['fare']).statistic"
      },
      {
        "label": "5단계 실제 생존율 차이 (old − new)",
        "expr": "abs(surv_gap - 0.31513747454175156) < 1e-6",
        "hint": "old['survived'].mean() - new['survived'].mean()"
      }
    ]
  },
  {
    "id": "51-3",
    "unit": 51,
    "domain": "mfg",
    "title": "미니 프로젝트: 비용으로 기준선 정하고 한 번만 시험하기",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "{t: 식 for t in 목록}",
        "기준선별 비용 딕셔너리"
      ],
      [
        "min(딕셔너리, key=딕셔너리.get)",
        "값이 가장 작은 키"
      ],
      [
        "cross_val_predict(..., method='predict_proba')",
        "학습용 안에서 확률 예측"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: AI4I 2020 설비 고장 데이터(1만 건, 시간 순서대로 쌓임). <code>air_temp</code>(공기 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>, <code>torque</code>, <code>tool_wear</code>, <code>failure</code>(고장 1 / 정상 0). 놓침 1건은 100만 원, 헛경보 1건은 5만 원입니다. 시작 코드가 시험용 20%를 떼어 두고 비용 함수 <code>cost(정답, 확률, 기준선)</code>을 만들어 둡니다. 기준선은 학습용 교차검증 예측으로만 정하고, 시험용은 마지막에 한 번만 씁니다.</p>\n<ol><li><code>oof</code>: 학습용(X_train, y_train) 5-fold 교차검증으로 얻은 고장 확률 배열</li><li><code>costs</code>: 기준선 0.05, 0.1, 0.15, 0.2, 0.3 → 학습용 총비용(만 원) 딕셔너리</li><li><code>best_t</code>: costs에서 비용이 가장 적은 기준선</li><li><code>test_proba</code>: 학습용 전체로 model을 학습한 뒤 시험용에서 낸 고장 확률</li><li><code>test_recall</code>: 시험용에서 best_t로 판정한 재현율 (시험용은 여기서 한 번만)</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import train_test_split, cross_val_predict, StratifiedKFold\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import confusion_matrix, recall_score\n\ndf = pd.read_csv('ai4i2020.csv')\ndf['power'] = df['rpm'] * df['torque'] * 2 * 3.1416 / 60\ndf['temp_gap'] = df['process_temp'] - df['air_temp']\nfeatures = ['air_temp', 'rpm', 'torque', 'tool_wear', 'power', 'temp_gap']\nX, y = df[features], df['failure']\nmodel = RandomForestClassifier(n_estimators=50, min_samples_leaf=3, class_weight='balanced', random_state=0, n_jobs=1)\ncv = StratifiedKFold(5, shuffle=True, random_state=0)\n\ndef cost(y_true, proba, t):\n    tn, fp, fn, tp = confusion_matrix(y_true, (proba >= t).astype(int)).ravel()\n    return int(fn * 100 + fp * 5)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)\n\n# 1. 학습용(X_train, y_train) 5-fold 교차검증으로 얻은 고장 확률 배열\noof = \n# 2. 기준선 0.05, 0.1, 0.15, 0.2, 0.3 → 학습용 총비용(만 원) 딕셔너리\ncosts = \n# 3. costs에서 비용이 가장 적은 기준선\nbest_t = \n# 4. 학습용 전체로 model을 학습한 뒤 시험용에서 낸 고장 확률\ntest_proba = \n# 5. 시험용에서 best_t로 판정한 재현율 (시험용은 여기서 한 번만)\ntest_recall = \n\nprint(costs, best_t, round(float(test_recall), 3))\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import train_test_split, cross_val_predict, StratifiedKFold\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import confusion_matrix, recall_score\n\ndf = pd.read_csv('ai4i2020.csv')\ndf['power'] = df['rpm'] * df['torque'] * 2 * 3.1416 / 60\ndf['temp_gap'] = df['process_temp'] - df['air_temp']\nfeatures = ['air_temp', 'rpm', 'torque', 'tool_wear', 'power', 'temp_gap']\nX, y = df[features], df['failure']\nmodel = RandomForestClassifier(n_estimators=50, min_samples_leaf=3, class_weight='balanced', random_state=0, n_jobs=1)\ncv = StratifiedKFold(5, shuffle=True, random_state=0)\n\ndef cost(y_true, proba, t):\n    tn, fp, fn, tp = confusion_matrix(y_true, (proba >= t).astype(int)).ravel()\n    return int(fn * 100 + fp * 5)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)\n\n# 1. 학습용(X_train, y_train) 5-fold 교차검증으로 얻은 고장 확률 배열\noof = cross_val_predict(model, X_train, y_train, cv=cv, method='predict_proba')[:, 1]\n# 2. 기준선 0.05, 0.1, 0.15, 0.2, 0.3 → 학습용 총비용(만 원) 딕셔너리\ncosts = {t: cost(y_train, oof, t) for t in [0.05, 0.1, 0.15, 0.2, 0.3]}\n# 3. costs에서 비용이 가장 적은 기준선\nbest_t = min(costs, key=costs.get)\n# 4. 학습용 전체로 model을 학습한 뒤 시험용에서 낸 고장 확률\ntest_proba = model.fit(X_train, y_train).predict_proba(X_test)[:, 1]\n# 5. 시험용에서 best_t로 판정한 재현율 (시험용은 여기서 한 번만)\ntest_recall = recall_score(y_test, (test_proba >= best_t).astype(int))\n\nprint(costs, best_t, round(float(test_recall), 3))\n",
    "hints": [
      "cross_val_predict(model, X_train, y_train, cv=cv, method='predict_proba')[:, 1]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 학습용(X_train, y_train) 5-fold 교차검증으로 얻은 고장 확률 배열",
        "expr": "len(oof) == 8000 and 0 <= min(oof) and max(oof) <= 1",
        "hint": "cross_val_predict(model, X_train, y_train, cv=cv, method='predict_proba')[:, 1]"
      },
      {
        "label": "2단계 기준선 0.05, 0.1, 0.15, 0.2, 0.3 → 학습용 총비용(만 원) 딕셔너리",
        "expr": "sorted(costs) == [0.05, 0.1, 0.15, 0.2, 0.3] and costs == {t: cost(y_train, oof, t) for t in [0.05, 0.1, 0.15, 0.2, 0.3]}",
        "hint": "{t: cost(y_train, oof, t) for t in [0.05, 0.1, 0.15, 0.2, 0.3]}"
      },
      {
        "label": "3단계 costs에서 비용이 가장 적은 기준선",
        "expr": "best_t in costs and costs[best_t] == min(costs.values())",
        "hint": "min(costs, key=costs.get)"
      },
      {
        "label": "4단계 학습용 전체로 model을 학습한 뒤 시험용에서 낸 고장 확률",
        "expr": "len(test_proba) == 2000",
        "hint": "model.fit(X_train, y_train).predict_proba(X_test)[:, 1]"
      },
      {
        "label": "5단계 시험용에서 best_t로 판정한 재현율 (시험용은 여기서 한 번만)",
        "expr": "abs(test_recall - recall_score(y_test, (test_proba >= best_t).astype(int))) < 1e-9 and test_recall > 0.7",
        "hint": "recall_score(y_test, (test_proba >= best_t).astype(int))"
      }
    ]
  },
  {
    "id": "51-4",
    "unit": 51,
    "domain": "general",
    "title": "미니 프로젝트: 타이타닉 생존 예측 한 바퀴",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "DummyClassifier()",
        "기준 모델(가장 많은 쪽만 답함)"
      ],
      [
        "make_pipeline(ColumnTransformer(...), 모델)",
        "손질 + 모델"
      ],
      [
        "cross_val_score(파이프라인, X, y, cv=5).mean()",
        "학습용 안에서 비교"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 타이타닉 승객 891명. <code>pclass</code>(객실 등급), <code>sex</code>, <code>age</code>(빈칸 있음), <code>sibsp</code>, <code>parch</code>, <code>fare</code>(운임), <code>survived</code>(생존 1 / 사망 0). 시작 코드가 시험용 25%를 떼어 두고, 숫자 열은 중앙값으로 채우고 성별은 원-핫으로 바꾸는 손질(<code>pre</code>)을 만들어 둡니다.</p>\n<ol><li><code>base</code>: 기준 모델(DummyClassifier)의 학습용 5-fold 정확도 평균</li><li><code>logit</code>: pre + LogisticRegression(max_iter=1000)의 학습용 5-fold 정확도 평균</li><li><code>forest</code>: pre + RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)의 학습용 5-fold 정확도 평균</li><li><code>best</code>: logit과 forest 중 점수가 높은 쪽 이름 ('logit' 또는 'forest')</li><li><code>test_acc</code>: best 모델을 학습용 전체로 학습해 시험용에서 한 번 잰 정확도</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import OneHotEncoder\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier\n\ndf = pd.read_csv('titanic.csv')\nnum_cols, cat_cols = ['pclass', 'age', 'sibsp', 'parch', 'fare'], ['sex']\nX, y = df[num_cols + cat_cols], df['survived']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)\npre = ColumnTransformer([('num', SimpleImputer(strategy='median'), num_cols), ('cat', OneHotEncoder(), cat_cols)])\n\n# 1. 기준 모델(DummyClassifier)의 학습용 5-fold 정확도 평균\nbase = \n# 2. pre + LogisticRegression(max_iter=1000)의 학습용 5-fold 정확도 평균\nlogit = \n# 3. pre + RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)의 학습용 5-fold 정확도 평균\nforest = \n# 4. logit과 forest 중 점수가 높은 쪽 이름 ('logit' 또는 'forest')\nbest = \n# 5. best 모델을 학습용 전체로 학습해 시험용에서 한 번 잰 정확도\ntest_acc = \n\nprint(round(base, 3), round(logit, 3), round(forest, 3), best, round(test_acc, 3))\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import OneHotEncoder\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier\n\ndf = pd.read_csv('titanic.csv')\nnum_cols, cat_cols = ['pclass', 'age', 'sibsp', 'parch', 'fare'], ['sex']\nX, y = df[num_cols + cat_cols], df['survived']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)\npre = ColumnTransformer([('num', SimpleImputer(strategy='median'), num_cols), ('cat', OneHotEncoder(), cat_cols)])\n\n# 1. 기준 모델(DummyClassifier)의 학습용 5-fold 정확도 평균\nbase = cross_val_score(DummyClassifier(), X_train, y_train, cv=5).mean()\n# 2. pre + LogisticRegression(max_iter=1000)의 학습용 5-fold 정확도 평균\nlogit = cross_val_score(make_pipeline(pre, LogisticRegression(max_iter=1000)), X_train, y_train, cv=5).mean()\n# 3. pre + RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)의 학습용 5-fold 정확도 평균\nforest = cross_val_score(make_pipeline(pre, RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)), X_train, y_train, cv=5).mean()\n# 4. logit과 forest 중 점수가 높은 쪽 이름 ('logit' 또는 'forest')\nbest = 'forest' if forest > logit else 'logit'\n# 5. best 모델을 학습용 전체로 학습해 시험용에서 한 번 잰 정확도\ntest_acc = make_pipeline(pre, RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0) if best == 'forest' else LogisticRegression(max_iter=1000)).fit(X_train, y_train).score(X_test, y_test)\n\nprint(round(base, 3), round(logit, 3), round(forest, 3), best, round(test_acc, 3))\n",
    "hints": [
      "cross_val_score(DummyClassifier(), X_train, y_train, cv=5).mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 기준 모델(DummyClassifier)의 학습용 5-fold 정확도 평균",
        "expr": "abs(base - 0.6167657950847267) < 1e-6",
        "hint": "cross_val_score(DummyClassifier(), X_train, y_train, cv=5).mean()"
      },
      {
        "label": "2단계 pre + LogisticRegression(max_iter=1000)의 학습용 5-fold 정확도 평균",
        "expr": "abs(logit - 0.7993042307260688) < 1e-6",
        "hint": "cross_val_score(make_pipeline(pre, LogisticRegression(max_iter=1000)), X_train, y_train, cv=5).mean()"
      },
      {
        "label": "3단계 pre + RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)의 학습용 5-fold 정확도 평균",
        "expr": "abs(forest - 0.8202783077095723) < 1e-6",
        "hint": "cross_val_score(make_pipeline(pre, RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0)), X_train, y_train, cv=5).mean()"
      },
      {
        "label": "4단계 logit과 forest 중 점수가 높은 쪽 이름 ('logit' 또는 'forest')",
        "expr": "best == 'forest'",
        "hint": "'forest' if forest > logit else 'logit'"
      },
      {
        "label": "5단계 best 모델을 학습용 전체로 학습해 시험용에서 한 번 잰 정확도",
        "expr": "abs(test_acc - 0.8161434977578476) < 1e-6",
        "hint": "make_pipeline(pre, RandomForestClassifier(n_estimators=100, max_depth=5, random_state=0) if best == 'forest' else LogisticRegression(max_iter=1000)).fit(X_train, y_train).score(X_test, y_test)"
      }
    ]
  }
];
export const ML4_QUIZZES = [
  {
    "id": "51-Q",
    "unit": 51,
    "title": "모델 저장 · 드리프트 · 프로젝트 순서 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "두 표본 a, b의 KS 통계량을 소수 둘째 자리까지 출력하는 코드를 작성하세요.",
        "given": "from scipy.stats import ks_2samp\na = [1, 2, 3, 4, 5]\nb = [3, 4, 5, 6, 7]",
        "expect": "0.4",
        "must": [
          "ks_2samp\\("
        ],
        "solution": "from scipy.stats import ks_2samp\na = [1, 2, 3, 4, 5]\nb = [3, 4, 5, 6, 7]\nprint(round(ks_2samp(a, b).statistic, 2))",
        "explain": "누적 분포를 겹쳐 보면 2에서 a는 0.4, b는 0이라 가장 큰 간격이 0.4입니다."
      },
      {
        "kind": "ox",
        "q": "모델을 저장할 때는 학습된 분류기만 저장하고, 표준화 같은 전처리는 예측할 때 다시 짜면 된다.",
        "answer": false,
        "explain": "전처리 기준(평균·표준편차 등)도 학습된 값입니다. Pipeline 전체를 저장해야 예측할 때 똑같은 손질이 됩니다."
      },
      {
        "kind": "choice",
        "q": "미니 프로젝트에서 판정 기준선(임계값)은 무엇으로 정해야 할까?",
        "options": [
          "시험용 데이터에서 점수가 가장 좋은 값",
          "학습용 교차검증 예측에서 총비용이 가장 적은 값",
          "언제나 0.5",
          "전체 데이터에서 재현율이 1이 되는 값"
        ],
        "answer": 1,
        "explain": "시험용으로 고르면 시험 점수가 부풀려집니다. 학습용 안의 교차검증 예측으로 고르고, 시험용은 마지막에 한 번만 씁니다."
      },
      {
        "kind": "choice",
        "q": "배포한 고장 모델의 재현율이 여름에 크게 떨어졌다. 입력 열의 KS 통계량이 air_temp 0.76, rpm 0.02였다면 가장 먼저 의심할 것은?",
        "options": [
          "회전수 센서 고장",
          "기온이 학습 때와 달라진 드리프트",
          "모델 파일이 깨짐",
          "판정 기준선이 너무 낮음"
        ],
        "answer": 1,
        "explain": "공기 온도 분포만 크게 달라졌습니다. 학습 때 거의 없던 온도 구간이라 모델이 그 상황을 배우지 못한 것입니다. 최근 데이터로 재학습을 검토합니다."
      }
    ]
  }
];
