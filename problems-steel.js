// 강판 표면 결함(UCI Steel Plates Faults, datasets/steel_faults.csv) 제조 문제 (2026-11-08). QAQC 과정(domain "mfg")에서 보인다.
// scratchpad 생성 스크립트로 만들었고, `node scripts/verify.mjs` 로 모범답안 통과 · 시작 코드 미통과를 확인한다.
export const STEEL_PROBLEMS = [
  {
    "id": "20-7",
    "unit": 20,
    "domain": "mfg",
    "title": "강판 결함 7종을 랜덤포레스트로 가려내기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "RandomForestClassifier(n_estimators=100, random_state=0)",
        "트리 100개의 투표"
      ],
      [
        ".feature_importances_",
        "특성별 중요도"
      ],
      [
        "pd.Series(값, index=이름).idxmax()",
        "가장 큰 값의 이름"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 강판 표면 결함 데이터(UCI Steel Plates Faults, 1,941건)입니다. 검사 카메라가 찾은 결함 하나가 한 행이고, 결함의 위치(<code>x_min</code> ~ <code>y_max</code>), 크기(<code>pixels_areas</code>, 둘레), 밝기(<code>sum_luminosity</code> 등), 컨베이어 길이(<code>conveyer_length</code>), 강판 두께(<code>thickness</code>), 모양 지수(<code>…_index</code>) 등 25개 숫자 열과 강종(<code>steel_type</code>, A300/A400)이 있습니다. 정답 <code>fault</code>는 결함 7종(Pastry, Z_Scratch, K_Scratch, Stains, Dirtiness, Bumps, Other_Faults)입니다. 시작 코드가 <code>pd.read_csv('steel_faults.csv')</code>로 불러와 숫자 열 <code>X</code>, 정답 <code>y</code>를 만들고 학습용 · 시험용으로 나눠 둡니다(층화, random_state=0).</p><p>지금까지는 고장 / 정상 두 가지를 맞혔다면, 이번에는 정답이 <b>7가지</b>인 다중 분류입니다. 모델 코드는 똑같고, sklearn이 알아서 7개 중 하나를 고릅니다. 결함 종류를 자동으로 분류하면 검사원이 사진을 하나하나 보지 않아도 결함 원인 공정을 빨리 찾을 수 있습니다.</p><ol><li><code>model</code>: 학습용으로 fit 한 랜덤포레스트 (n_estimators=100, random_state=0)</li><li><code>acc</code>: 시험용 정확도</li><li><code>imp</code>: 특성 이름을 index로 한 중요도 Series</li><li><code>top</code>: 중요도가 가장 큰 특성 이름</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\n# 강판 표면 결함 데이터 (UCI Steel Plates Faults, 1,941건). fault = 결함 종류 7가지\ndf = pd.read_csv('steel_faults.csv')\nX = df.drop(columns=['fault', 'steel_type'])\ny = df['fault']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 학습용으로 fit 한 랜덤포레스트 (n_estimators=100, random_state=0)\nmodel = \n# 2. 시험용 정확도\nacc = \n# 3. 특성 이름을 index로 한 중요도 Series\nimp = \n# 4. 중요도가 가장 큰 특성 이름\ntop = \n\nprint(y.value_counts())\nprint('accuracy', round(acc, 3))\nprint(imp.sort_values(ascending=False).head(5).round(3))\nprint('top', top)\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\n# 강판 표면 결함 데이터 (UCI Steel Plates Faults, 1,941건). fault = 결함 종류 7가지\ndf = pd.read_csv('steel_faults.csv')\nX = df.drop(columns=['fault', 'steel_type'])\ny = df['fault']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 학습용으로 fit 한 랜덤포레스트 (n_estimators=100, random_state=0)\nmodel = RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)\n# 2. 시험용 정확도\nacc = model.score(X_test, y_test)\n# 3. 특성 이름을 index로 한 중요도 Series\nimp = pd.Series(model.feature_importances_, index=X.columns)\n# 4. 중요도가 가장 큰 특성 이름\ntop = imp.idxmax()\n\nprint(y.value_counts())\nprint('accuracy', round(acc, 3))\nprint(imp.sort_values(ascending=False).head(5).round(3))\nprint('top', top)\n",
    "hints": [
      "RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 랜덤포레스트 학습",
        "expr": "isinstance(model, RandomForestClassifier) and model.n_estimators == 100 and model.random_state == 0 and len(model.classes_) == 7 and model.n_features_in_ == X.shape[1]",
        "hint": "RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)"
      },
      {
        "label": "2단계 시험용 정확도",
        "expr": "abs(acc - model.score(X_test, y_test)) < 1e-12 and 0.6 < acc < 0.95",
        "hint": "model.score(X_test, y_test)"
      },
      {
        "label": "3단계 중요도 Series",
        "expr": "isinstance(imp, pd.Series) and list(imp.index) == list(X.columns) and abs(imp.sum() - 1) < 1e-6",
        "hint": "pd.Series(model.feature_importances_, index=X.columns)"
      },
      {
        "label": "4단계 가장 중요한 특성",
        "expr": "top == imp.idxmax()",
        "hint": "imp.idxmax()"
      }
    ]
  },
  {
    "id": "19-5",
    "unit": 19,
    "domain": "mfg",
    "title": "결함 종류별 재현율: 어떤 결함을 가장 많이 놓칠까",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "recall_score(y_true, pred, average=None, labels=목록)",
        "클래스마다 재현율"
      ],
      [
        "classification_report",
        "클래스별 점수 표"
      ],
      [
        ".idxmin()",
        "가장 작은 값의 이름"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 강판 표면 결함 데이터(UCI Steel Plates Faults, 1,941건)입니다. 검사 카메라가 찾은 결함 하나가 한 행이고, 결함의 위치(<code>x_min</code> ~ <code>y_max</code>), 크기(<code>pixels_areas</code>, 둘레), 밝기(<code>sum_luminosity</code> 등), 컨베이어 길이(<code>conveyer_length</code>), 강판 두께(<code>thickness</code>), 모양 지수(<code>…_index</code>) 등 25개 숫자 열과 강종(<code>steel_type</code>, A300/A400)이 있습니다. 정답 <code>fault</code>는 결함 7종(Pastry, Z_Scratch, K_Scratch, Stains, Dirtiness, Bumps, Other_Faults)입니다. 시작 코드가 <code>pd.read_csv('steel_faults.csv')</code>로 불러와 숫자 열 <code>X</code>, 정답 <code>y</code>를 만들고 학습용 · 시험용으로 나눠 둡니다(층화, random_state=0).</p><p>정확도 하나로는 \"어떤 결함을 잘 놓치는지\"를 알 수 없습니다. 다중 분류에서는 <code>average=None</code>으로 <b>클래스마다</b> 재현율을 따로 구합니다. 재현율이 가장 낮은 결함이 검사에서 가장 많이 새어 나가는 결함입니다.</p><ol><li><code>pred</code>: 시작 코드의 <code>model</code>로 예측한 시험용 결과</li><li><code>labels</code>: 결함 이름 7개를 알파벳순으로 정렬한 리스트</li><li><code>rec</code>: <code>labels</code>를 index로 한 결함별 재현율 Series</li><li><code>worst</code>: 재현율이 가장 낮은 결함 이름</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import recall_score, classification_report\n\n# 강판 표면 결함 데이터 (UCI Steel Plates Faults, 1,941건). fault = 결함 종류 7가지\ndf = pd.read_csv('steel_faults.csv')\nX = df.drop(columns=['fault', 'steel_type'])\ny = df['fault']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\nmodel = RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)\n\n# 1. 시험용 예측\npred = \n# 2. 결함 이름 7개를 알파벳순으로 정렬한 리스트\nlabels = \n# 3. 결함별 재현율 Series (index = labels)\nrec = \n# 4. 재현율이 가장 낮은 결함 이름\nworst = \n\nprint(rec.round(3))\nprint('worst', worst)\nprint(classification_report(y_test, pred, digits=3))\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import recall_score, classification_report\n\n# 강판 표면 결함 데이터 (UCI Steel Plates Faults, 1,941건). fault = 결함 종류 7가지\ndf = pd.read_csv('steel_faults.csv')\nX = df.drop(columns=['fault', 'steel_type'])\ny = df['fault']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\nmodel = RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)\n\n# 1. 시험용 예측\npred = model.predict(X_test)\n# 2. 결함 이름 7개를 알파벳순으로 정렬한 리스트\nlabels = sorted(y.unique())\n# 3. 결함별 재현율 Series (index = labels)\nrec = pd.Series(recall_score(y_test, pred, average=None, labels=labels), index=labels)\n# 4. 재현율이 가장 낮은 결함 이름\nworst = rec.idxmin()\n\nprint(rec.round(3))\nprint('worst', worst)\nprint(classification_report(y_test, pred, digits=3))\n",
    "hints": [
      "recall_score(y_test, pred, average=None, labels=labels)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 시험용 예측",
        "expr": "len(pred) == len(y_test) and (pred == model.predict(X_test)).all()",
        "hint": "model.predict(X_test)"
      },
      {
        "label": "2단계 결함 이름 정렬",
        "expr": "list(labels) == sorted(y.unique())",
        "hint": "sorted(y.unique())"
      },
      {
        "label": "3단계 결함별 재현율",
        "expr": "isinstance(rec, pd.Series) and list(rec.index) == sorted(y.unique()) and np.allclose(rec.values, recall_score(y_test, pred, average=None, labels=sorted(y.unique())))",
        "hint": "pd.Series(recall_score(y_test, pred, average=None, labels=labels), index=labels)"
      },
      {
        "label": "4단계 가장 많이 놓치는 결함",
        "expr": "worst == rec.idxmin()",
        "hint": "rec.idxmin()"
      }
    ]
  },
  {
    "id": "47-7",
    "unit": 47,
    "domain": "mfg",
    "title": "표준화를 빼면 KNN이 무너진다: 강판 결함",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "KNeighborsClassifier(n_neighbors=5)",
        "가까운 5개의 다수결"
      ],
      [
        "make_pipeline(StandardScaler(), 모델)",
        "표준화 후 학습"
      ],
      [
        "X.max().idxmax()",
        "값이 가장 큰 열"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 강판 표면 결함 데이터(UCI Steel Plates Faults, 1,941건)입니다. 검사 카메라가 찾은 결함 하나가 한 행이고, 결함의 위치(<code>x_min</code> ~ <code>y_max</code>), 크기(<code>pixels_areas</code>, 둘레), 밝기(<code>sum_luminosity</code> 등), 컨베이어 길이(<code>conveyer_length</code>), 강판 두께(<code>thickness</code>), 모양 지수(<code>…_index</code>) 등 25개 숫자 열과 강종(<code>steel_type</code>, A300/A400)이 있습니다. 정답 <code>fault</code>는 결함 7종(Pastry, Z_Scratch, K_Scratch, Stains, Dirtiness, Bumps, Other_Faults)입니다. 시작 코드가 <code>pd.read_csv('steel_faults.csv')</code>로 불러와 숫자 열 <code>X</code>, 정답 <code>y</code>를 만들고 학습용 · 시험용으로 나눠 둡니다(층화, random_state=0).</p><p>이 데이터는 열마다 크기가 극단적으로 다릅니다. 결함 위치 <code>y_min</code>, <code>y_max</code>는 1,000만이 넘고, 모양 지수들은 0 ~ 1 사이입니다. KNN은 거리로 이웃을 찾으므로, 표준화를 빼면 거의 \"위치\" 하나로만 이웃을 고르게 됩니다. 같은 KNN을 표준화 없이, 표준화하고 한 번씩 학습해 비교합니다.</p><ol><li><code>big</code>: 최댓값이 가장 큰 열 이름</li><li><code>raw_acc</code>: 표준화 없이 <code>KNeighborsClassifier(n_neighbors=5)</code>의 시험용 정확도</li><li><code>scaled_acc</code>: <code>make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))</code>의 시험용 정확도</li><li><code>gain</code>: <code>scaled_acc - raw_acc</code></li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\n# 강판 표면 결함 데이터 (UCI Steel Plates Faults, 1,941건). fault = 결함 종류 7가지\ndf = pd.read_csv('steel_faults.csv')\nX = df.drop(columns=['fault', 'steel_type'])\ny = df['fault']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 최댓값이 가장 큰 열 이름\nbig = \n# 2. 표준화 없이 KNN(k=5) 시험용 정확도\nraw_acc = \n# 3. 표준화 + KNN(k=5) 시험용 정확도\nscaled_acc = \n# 4. 표준화로 오른 정확도\ngain = \n\nprint(big, X[big].max())\nprint('raw', round(raw_acc, 3), '/ scaled', round(scaled_acc, 3), '/ gain', round(gain, 3))\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\n# 강판 표면 결함 데이터 (UCI Steel Plates Faults, 1,941건). fault = 결함 종류 7가지\ndf = pd.read_csv('steel_faults.csv')\nX = df.drop(columns=['fault', 'steel_type'])\ny = df['fault']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 최댓값이 가장 큰 열 이름\nbig = X.max().idxmax()\n# 2. 표준화 없이 KNN(k=5) 시험용 정확도\nraw_acc = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train).score(X_test, y_test)\n# 3. 표준화 + KNN(k=5) 시험용 정확도\nscaled_acc = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)).fit(X_train, y_train).score(X_test, y_test)\n# 4. 표준화로 오른 정확도\ngain = scaled_acc - raw_acc\n\nprint(big, X[big].max())\nprint('raw', round(raw_acc, 3), '/ scaled', round(scaled_acc, 3), '/ gain', round(gain, 3))\n",
    "hints": [
      "make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)).fit(X_train, y_train).score(X_test, y_test)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 값이 가장 큰 열",
        "expr": "big == X.max().idxmax()",
        "hint": "X.max().idxmax()"
      },
      {
        "label": "2단계 표준화 없는 KNN",
        "expr": "abs(raw_acc - KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train).score(X_test, y_test)) < 1e-12",
        "hint": "KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train).score(X_test, y_test)"
      },
      {
        "label": "3단계 표준화한 KNN",
        "expr": "abs(scaled_acc - make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)).fit(X_train, y_train).score(X_test, y_test)) < 1e-12",
        "hint": "make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))"
      },
      {
        "label": "4단계 차이",
        "expr": "abs(gain - (scaled_acc - raw_acc)) < 1e-12 and gain > 0.1",
        "hint": "scaled_acc - raw_acc"
      }
    ]
  }
];
