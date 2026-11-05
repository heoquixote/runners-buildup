// 머신러닝 트랙 추가 문제 (2026-11-05): 레슨 세분화 때 새로 다룬 개념(결측치·인코딩, 경사하강법, 지니, 검증 곡선, 파생변수)과
// 새 코스 ml-10(유닛 47: KNN · 나이브 베이즈 · SVM). domain: "mfg" = QAQC 과정, "general" = 데이터 과정.
// 문제를 고치면 `node scripts/verify.mjs` 로 모범답안이 통과하고 시작 코드는 통과하지 않는지 확인한다.
export const ML3_UNITS = [
  {
    "id": 47,
    "title": "다른 모델 둘러보기",
    "summary": "KNN · 나이브 베이즈 · SVM",
    "note": "<h4>KNN</h4><p><code>KNeighborsClassifier(n_neighbors=k)</code>: 가장 가까운 k개의 다수결. 거리를 재므로 <code>make_pipeline(StandardScaler(), ...)</code>가 필수이고, k가 작으면 과적합, 크면 과소적합입니다.</p><h4>나이브 베이즈</h4><p>P(정답) × P(특성1 | 정답) × P(특성2 | 정답) …을 정답마다 계산해 큰 쪽으로 분류합니다. 범주형은 <code>CategoricalNB</code>, 숫자형은 <code>GaussianNB</code>. 한 번도 안 나온 값 때문에 곱이 0이 되지 않게 <code>alpha=1</code>(라플라스 스무딩)이 기본입니다.</p><h4>SVM</h4><p><code>SVC()</code>: 두 무리 사이 복도(마진)가 가장 넓은 경계선. 표준화 필수, 직선으로 못 나누면 <code>kernel='rbf'</code>(기본값). 드문 클래스에는 <code>class_weight='balanced'</code>.</p><p class=\"qc\">파이프라인 안 단계의 설정은 <code>kneighborsclassifier__n_neighbors</code>처럼 단계이름__설정이름으로 GridSearchCV에 넘깁니다.</p>"
  }
];

export const ML3_PROBLEMS = [
  {
    "id": "17-5",
    "unit": 17,
    "domain": "mfg",
    "title": "센서 빈칸 채우고 제품 등급을 숫자로",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "isna().sum()",
        "빈칸 개수"
      ],
      [
        "train[열].median()",
        "학습용으로만 구한 중앙값"
      ],
      [
        "fillna(값)",
        "빈칸 채우기"
      ],
      [
        "map({'L': 0, ...})",
        "순서 있는 등급을 번호로"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>현장 센서는 가끔 값을 놓칩니다. 시작 코드가 토크(<code>torque</code>) 300칸을 일부러 비워 두고, 학습용·시험용으로 나눠 둡니다.</p>\n<ol><li><code>n_missing</code>: 전체 <code>df</code>에서 토크 빈칸 개수</li><li><code>med</code>: <b>학습용(train)</b> 토크의 중앙값 (시험용까지 섞으면 누수)</li><li><code>test_torque</code>: 시험용 토크 빈칸을 <code>med</code>로 채운 Series</li><li><code>type_num</code>: <code>df['type']</code>를 L→0, M→1, H→2로 바꾼 Series (순서가 있는 등급이라 번호가 자연스럽습니다)</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\ndf = pd.read_csv('ai4i2020.csv')\ndf.loc[df.sample(300, random_state=1).index, 'torque'] = np.nan   # sensor dropouts\ntrain, test = train_test_split(df, test_size=0.25, random_state=0)\n\n# 1. 토크 빈칸 개수\nn_missing =\n# 2. 학습용 토크의 중앙값\nmed =\n# 3. 시험용 토크 빈칸을 med로 채운 Series\ntest_torque =\n# 4. 제품 등급 L, M, H -> 0, 1, 2\ntype_num =\n\nprint(n_missing, round(med, 2), int(test_torque.isna().sum()), type_num.value_counts().sort_index().tolist())\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\ndf = pd.read_csv('ai4i2020.csv')\ndf.loc[df.sample(300, random_state=1).index, 'torque'] = np.nan   # sensor dropouts\ntrain, test = train_test_split(df, test_size=0.25, random_state=0)\n\n# 1. 토크 빈칸 개수\nn_missing = df['torque'].isna().sum()\n# 2. 학습용 토크의 중앙값\nmed = train['torque'].median()\n# 3. 시험용 토크 빈칸을 med로 채운 Series\ntest_torque = test['torque'].fillna(med)\n# 4. 제품 등급 L, M, H -> 0, 1, 2\ntype_num = df['type'].map({'L': 0, 'M': 1, 'H': 2})\nprint(n_missing, round(med, 2), int(test_torque.isna().sum()), type_num.value_counts().sort_index().tolist())\n",
    "hints": [
      "df['torque'].isna().sum()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 빈칸 개수",
        "expr": "int(n_missing) == 300",
        "hint": "df['torque'].isna().sum()"
      },
      {
        "label": "2단계 학습용 중앙값",
        "expr": "abs(med - train['torque'].median()) < 1e-9",
        "hint": "train['torque'].median()"
      },
      {
        "label": "3단계 시험용 채우기",
        "expr": "test_torque.isna().sum() == 0 and len(test_torque) == len(test) and np.allclose(test_torque[test['torque'].isna()], med)",
        "hint": "test['torque'].fillna(med)"
      },
      {
        "label": "4단계 등급 번호",
        "expr": "list(type_num.loc[df['type'] == 'L'].unique()) == [0] and list(type_num.loc[df['type'] == 'H'].unique()) == [2] and type_num.isna().sum() == 0",
        "hint": "df['type'].map({'L': 0, 'M': 1, 'H': 2})"
      }
    ]
  },
  {
    "id": "17-6",
    "unit": 17,
    "domain": "general",
    "title": "타이타닉 빈칸 채우고 탑승 항구 원-핫",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "df.isna().sum()",
        "열마다 빈칸 개수"
      ],
      [
        "fillna(df[열].median())",
        "숫자 열은 중앙값"
      ],
      [
        "mode()[0]",
        "글자 열은 최빈값"
      ],
      [
        "pd.get_dummies(열, prefix=..., dtype=int)",
        "원-핫 인코딩"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 타이타닉 승객 데이터(891명, 실제 기록)입니다. <code>survived</code>(생존 1 / 사망 0), <code>pclass</code>(객실 등급 1~3), <code>sex</code>, <code>age</code>(나이, 177명은 빈칸), <code>sibsp</code>(함께 탄 형제·배우자 수), <code>parch</code>(함께 탄 부모·자녀 수), <code>fare</code>(운임), <code>embarked</code>(탑승 항구 S·C·Q, 2명은 빈칸) 열을 씁니다.</p><ol><li><code>missing</code>: 열마다 빈칸 개수 (Series)</li><li><code>age_filled</code>: 나이 빈칸을 <b>중앙값</b>으로 채운 Series</li><li><code>emb_filled</code>: 탑승 항구 빈칸을 <b>최빈값</b>으로 채운 Series</li><li><code>onehot</code>: <code>emb_filled</code>를 <code>prefix='embarked'</code>, <code>dtype=int</code>로 원-핫 인코딩한 표 (열 3개)</li></ol>",
    "starter": "import pandas as pd\n\ndf = pd.read_csv('titanic.csv')\n\n# 1. 열마다 빈칸 개수\nmissing =\n# 2. 나이 빈칸을 중앙값으로\nage_filled =\n# 3. 탑승 항구 빈칸을 최빈값으로\nemb_filled =\n# 4. 탑승 항구 원-핫 (prefix='embarked', dtype=int)\nonehot =\n\nprint(missing['age'], age_filled.isna().sum(), emb_filled.value_counts().to_dict())\nprint(onehot.head(3))\n",
    "solution": "import pandas as pd\n\ndf = pd.read_csv('titanic.csv')\n\n# 1. 열마다 빈칸 개수\nmissing = df.isna().sum()\n# 2. 나이 빈칸을 중앙값으로\nage_filled = df['age'].fillna(df['age'].median())\n# 3. 탑승 항구 빈칸을 최빈값으로\nemb_filled = df['embarked'].fillna(df['embarked'].mode()[0])\n# 4. 탑승 항구 원-핫 (prefix='embarked', dtype=int)\nonehot = pd.get_dummies(emb_filled, prefix='embarked', dtype=int)\nprint(missing['age'], age_filled.isna().sum(), emb_filled.value_counts().to_dict())\nprint(onehot.head(3))\n",
    "hints": [
      "pd.get_dummies(emb_filled, prefix='embarked', dtype=int)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 빈칸 개수",
        "expr": "int(missing['age']) == 177 and int(missing['embarked']) == 2",
        "hint": "df.isna().sum()"
      },
      {
        "label": "2단계 나이 중앙값 채우기",
        "expr": "age_filled.isna().sum() == 0 and abs(age_filled[df['age'].isna()].iloc[0] - df['age'].median()) < 1e-9",
        "hint": "df['age'].fillna(df['age'].median())"
      },
      {
        "label": "3단계 항구 최빈값 채우기",
        "expr": "emb_filled.isna().sum() == 0 and (emb_filled[df['embarked'].isna()] == 'S').all()",
        "hint": "df['embarked'].fillna(df['embarked'].mode()[0])"
      },
      {
        "label": "4단계 원-핫",
        "expr": "sorted(onehot.columns) == ['embarked_C', 'embarked_Q', 'embarked_S'] and (onehot.sum(axis=1) == 1).all()",
        "hint": "pd.get_dummies(emb_filled, prefix='embarked', dtype=int)"
      }
    ]
  },
  {
    "id": "18-5",
    "unit": 18,
    "domain": "mfg",
    "title": "경사하강법 한 걸음 직접 계산하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "w * x + b",
        "지금 직선의 예측"
      ],
      [
        "(error * x).mean()",
        "기울기 계산에 쓰는 평균"
      ],
      [
        "w - lr * grad_w",
        "기울기의 반대로 한 걸음"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>공기 온도(표준화한 <code>x</code>)로 공정 온도(<code>y</code>)를 예측하는 직선 <code>y = w·x + b</code>를 경사하강법으로 찾습니다. 출발점은 <code>w = 0, b = 0</code>, 학습률은 <code>lr = 0.1</code>입니다. 첫 한 걸음을 직접 계산합니다.</p>\n<ol><li><code>pred</code>: 지금 직선의 예측 <code>w * x + b</code></li><li><code>error</code>: <code>pred - y</code></li><li><code>grad_w</code>: <code>2 * (error * x).mean()</code>, <code>grad_b</code>: <code>2 * error.mean()</code></li><li><code>w1</code>, <code>b1</code>: 한 걸음 뒤의 값 (<code>w - lr * grad_w</code>, <code>b - lr * grad_b</code>)</li></ol><p>맨 아래 코드가 같은 걸음을 50번 반복해 기울기가 <code>LinearRegression</code>과 같아지는지 보여 줍니다.</p>",
    "starter": "import numpy as np\nimport pandas as pd\n\ndf = pd.read_csv('ai4i2020.csv')\nx = ((df['air_temp'] - df['air_temp'].mean()) / df['air_temp'].std()).values\ny = df['process_temp'].values\nw, b, lr = 0.0, 0.0, 0.1\n\n# 1. 지금 직선의 예측\npred =\n# 2. 오차\nerror =\n# 3. 기울기 (w 방향, b 방향)\ngrad_w =\ngrad_b =\n# 4. 한 걸음 뒤의 w, b\nw1 =\nb1 =\n\nprint(\"after 1 step:\", round(w1, 3), round(b1, 2))\nfor step in range(50):\n    error = w * x + b - y\n    w, b = w - lr * 2 * (error * x).mean(), b - lr * 2 * error.mean()\nprint(\"after 50 steps: slope\", round(w / df['air_temp'].std(), 3), \" MSE\", round(((w * x + b - y) ** 2).mean(), 3))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\ndf = pd.read_csv('ai4i2020.csv')\nx = ((df['air_temp'] - df['air_temp'].mean()) / df['air_temp'].std()).values\ny = df['process_temp'].values\nw, b, lr = 0.0, 0.0, 0.1\n\n# 1. 지금 직선의 예측\npred = w * x + b\n# 2. 오차\nerror = pred - y\n# 3. 기울기 (w 방향, b 방향)\ngrad_w = 2 * (error * x).mean()\ngrad_b = 2 * error.mean()\n# 4. 한 걸음 뒤의 w, b\nw1 = w - lr * grad_w\nb1 = b - lr * grad_b\nprint(\"after 1 step:\", round(w1, 3), round(b1, 2))\nfor step in range(50):\n    error = w * x + b - y\n    w, b = w - lr * 2 * (error * x).mean(), b - lr * 2 * error.mean()\nprint(\"after 50 steps: slope\", round(w / df['air_temp'].std(), 3), \" MSE\", round(((w * x + b - y) ** 2).mean(), 3))\n",
    "hints": [
      "w - lr * grad_w",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 예측",
        "expr": "np.allclose(pred, 0.0 * x)",
        "hint": "w * x + b"
      },
      {
        "label": "2단계 오차",
        "expr": "np.allclose(error_1 := (0.0 * x - y), 0.0 * x - y) and 'grad_w' in dir()",
        "hint": "pred - y"
      },
      {
        "label": "3단계 기울기",
        "expr": "abs(grad_w - 2 * ((0.0 * x - y) * x).mean()) < 1e-9 and abs(grad_b - 2 * (0.0 * x - y).mean()) < 1e-9",
        "hint": "2 * (error * x).mean(), 2 * error.mean()"
      },
      {
        "label": "4단계 한 걸음",
        "expr": "abs(w1 - (-0.1 * 2 * ((0.0 * x - y) * x).mean())) < 1e-9 and abs(b1 - (-0.1 * 2 * (0.0 * x - y).mean())) < 1e-9",
        "hint": "w - lr * grad_w, b - lr * grad_b"
      }
    ]
  },
  {
    "id": "18-6",
    "unit": 18,
    "domain": "general",
    "title": "경사하강법으로 당뇨 진행도 직선 찾기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "for step in range(n):",
        "같은 걸음을 반복"
      ],
      [
        "w -= lr * grad_w",
        "기울기의 반대로 이동"
      ],
      [
        "LinearRegression",
        "공식으로 한 번에 구한 답과 비교"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: scikit-learn에 들어 있는 당뇨병 데이터(환자 442명)입니다. <code>x</code>는 체질량지수(BMI)를 표준화한 값, <code>y</code>는 1년 뒤 병의 진행 정도입니다.</p><p>경사하강법을 200걸음 반복해 직선 <code>y = w·x + b</code>를 찾고, <code>LinearRegression</code>이 공식으로 구한 답과 같아지는지 확인합니다. 반복문 안의 빈칸을 채우세요.</p>\n<ol><li><code>error</code>: 지금 직선의 오차 <code>w * x + b - y</code></li><li><code>w</code>, <code>b</code>: 학습률 <code>lr</code>만큼 기울기의 반대로 이동</li><li><code>mse</code>: 200걸음 뒤의 평균 제곱 오차</li><li><code>same</code>: 내 <code>w</code>가 <code>LinearRegression</code>의 기울기 <code>ref.coef_[0]</code>와 소수 둘째 자리까지 같은지 (True/False)</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.datasets import load_diabetes\nfrom sklearn.linear_model import LinearRegression\n\ndata = load_diabetes(scaled=False)\nbmi = data.data[:, 2]\nx = (bmi - bmi.mean()) / bmi.std()\ny = data.target\nw, b, lr = 0.0, 0.0, 0.1\n\nfor step in range(200):\n    # 1. 오차\n    error =\n    # 2. 한 걸음 이동\n    w =\n    b =\n\n# 3. 200걸음 뒤 MSE\nmse =\nref = LinearRegression().fit(x.reshape(-1, 1), y)\n# 4. 기울기가 소수 둘째 자리까지 같은가\nsame =\n\nprint(round(w, 2), round(b, 2), round(mse, 1), same)\n",
    "solution": "import numpy as np\nfrom sklearn.datasets import load_diabetes\nfrom sklearn.linear_model import LinearRegression\n\ndata = load_diabetes(scaled=False)\nbmi = data.data[:, 2]\nx = (bmi - bmi.mean()) / bmi.std()\ny = data.target\nw, b, lr = 0.0, 0.0, 0.1\n\nfor step in range(200):\n    # 1. 오차\n    error = w * x + b - y\n    # 2. 한 걸음 이동\n    w = w - lr * 2 * (error * x).mean()\n    b = b - lr * 2 * error.mean()\n# 3. 200걸음 뒤 MSE\nmse = ((w * x + b - y) ** 2).mean()\nref = LinearRegression().fit(x.reshape(-1, 1), y)\n# 4. 기울기가 소수 둘째 자리까지 같은가\nsame = abs(w - ref.coef_[0]) < 0.01\nprint(round(w, 2), round(b, 2), round(mse, 1), same)\n",
    "hints": [
      "w = w - lr * 2 * (error * x).mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1~2단계 반복 이동",
        "expr": "abs(w - LinearRegression().fit(x.reshape(-1, 1), y).coef_[0]) < 0.01 and abs(b - y.mean()) < 0.01",
        "hint": "error = w * x + b - y, w = w - lr * 2 * (error * x).mean()"
      },
      {
        "label": "3단계 MSE",
        "expr": "abs(mse - ((w * x + b - y) ** 2).mean()) < 1e-6",
        "hint": "((w * x + b - y) ** 2).mean()"
      },
      {
        "label": "4단계 비교",
        "expr": "same is True or same == True",
        "hint": "abs(w - ref.coef_[0]) < 0.01"
      }
    ]
  },
  {
    "id": "20-5",
    "unit": 20,
    "domain": "mfg",
    "title": "토크 기준으로 나누면 얼마나 깔끔해질까 (지니)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "1 - p**2 - (1 - p)**2",
        "지니 불순도"
      ],
      [
        "y[조건]",
        "조건에 맞는 행만"
      ],
      [
        "가중 평균",
        "그룹 크기 비율로 평균"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>결정트리는 나눈 뒤 <b>지니 불순도</b>(섞임 정도)가 가장 많이 줄어드는 질문을 고릅니다. \"토크가 50보다 큰가?\"로 나누면 얼마나 줄어드는지 직접 계산합니다.</p>\n<ol><li><code>gini</code> 함수의 반환값: <code>1 - p**2 - (1 - p)**2</code> (<code>p</code>는 고장 비율)</li><li><code>g_all</code>: 나누기 전 전체 지니</li><li><code>g_hi</code>, <code>g_lo</code>: 토크 &gt; 50 그룹, 나머지 그룹의 지니</li><li><code>g_split</code>: 두 그룹 지니를 그룹 크기 비율로 가중 평균한 값</li><li><code>drop</code>: <code>g_all - g_split</code> (클수록 좋은 질문)</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\ndf = pd.read_csv('ai4i2020.csv')\ny = df['failure']\nhi = df['torque'] > 50\n\ndef gini(s):\n    p = s.mean()\n    # 1. 지니 불순도\n    g =\n    return g\n\n# 2. 전체 지니\ng_all =\n# 3. 두 그룹의 지니\ng_hi =\ng_lo =\n# 4. 가중 평균\ng_split =\n# 5. 줄어든 양\ndrop =\n\nprint(round(g_all, 4), round(g_hi, 4), round(g_lo, 4), round(g_split, 4), round(drop, 4))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\ndf = pd.read_csv('ai4i2020.csv')\ny = df['failure']\nhi = df['torque'] > 50\n\ndef gini(s):\n    p = s.mean()\n    # 1. 지니 불순도\n    g = 1 - p ** 2 - (1 - p) ** 2\n    return g\n\n# 2. 전체 지니\ng_all = gini(y)\n# 3. 두 그룹의 지니\ng_hi = gini(y[hi])\ng_lo = gini(y[~hi])\n# 4. 가중 평균\ng_split = (hi.sum() * g_hi + (~hi).sum() * g_lo) / len(y)\n# 5. 줄어든 양\ndrop = g_all - g_split\nprint(round(g_all, 4), round(g_hi, 4), round(g_lo, 4), round(g_split, 4), round(drop, 4))\n",
    "hints": [
      "1 - p ** 2 - (1 - p) ** 2",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1~2단계 지니 함수와 전체 지니",
        "expr": "abs(g_all - (1 - y.mean() ** 2 - (1 - y.mean()) ** 2)) < 1e-12",
        "hint": "1 - p ** 2 - (1 - p) ** 2"
      },
      {
        "label": "3단계 두 그룹",
        "expr": "abs(g_hi - gini(y[hi])) < 1e-12 and abs(g_lo - gini(y[~hi])) < 1e-12 and g_hi > g_lo",
        "hint": "gini(y[hi]), gini(y[~hi])"
      },
      {
        "label": "4단계 가중 평균",
        "expr": "abs(g_split - (hi.mean() * g_hi + (1 - hi.mean()) * g_lo)) < 1e-12",
        "hint": "(hi.sum() * g_hi + (~hi).sum() * g_lo) / len(y)"
      },
      {
        "label": "5단계 줄어든 양",
        "expr": "abs(drop - (g_all - g_split)) < 1e-12",
        "hint": "g_all - g_split"
      }
    ]
  },
  {
    "id": "20-6",
    "unit": 20,
    "domain": "general",
    "title": "첫 질문은 성별일까 객실 등급일까 (지니)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "1 - p**2 - (1 - p)**2",
        "지니 불순도"
      ],
      [
        "딕셔너리 + max(key=...)",
        "가장 좋은 질문 고르기"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 타이타닉 승객 데이터(891명, 실제 기록)입니다. <code>survived</code>(생존 1 / 사망 0), <code>pclass</code>(객실 등급 1~3), <code>sex</code>, <code>age</code>(나이, 177명은 빈칸), <code>sibsp</code>(함께 탄 형제·배우자 수), <code>parch</code>(함께 탄 부모·자녀 수), <code>fare</code>(운임), <code>embarked</code>(탑승 항구 S·C·Q, 2명은 빈칸) 열을 씁니다.</p><p>결정트리가 첫 질문으로 무엇을 고를지 지니 불순도로 직접 확인합니다. <code>split_gini(조건)</code>은 조건으로 나눈 뒤 두 그룹 지니의 가중 평균을 돌려줍니다.</p>\n<ol><li><code>gini</code> 함수의 반환값</li><li><code>scores</code>: <code>{'female': ..., 'first_class': ..., 'child': ...}</code> 각 질문으로 나눈 뒤의 가중 지니</li><li><code>best</code>: 가중 지니가 <b>가장 작은</b> 질문의 이름</li></ol>",
    "starter": "import pandas as pd\n\ndf = pd.read_csv('titanic.csv')\ndf['age'] = df['age'].fillna(df['age'].median())\ny = df['survived']\n\ndef gini(s):\n    p = s.mean()\n    # 1. 지니 불순도\n    g =\n    return g\n\ndef split_gini(cond):\n    return (cond.sum() * gini(y[cond]) + (~cond).sum() * gini(y[~cond])) / len(y)\n\n# 2. 질문별 가중 지니\nscores =\n# 3. 가장 작은 질문\nbest =\n\nprint({k: round(v, 3) for k, v in scores.items()}, best)\n",
    "solution": "import pandas as pd\n\ndf = pd.read_csv('titanic.csv')\ndf['age'] = df['age'].fillna(df['age'].median())\ny = df['survived']\n\ndef gini(s):\n    p = s.mean()\n    # 1. 지니 불순도\n    g = 1 - p ** 2 - (1 - p) ** 2\n    return g\n\ndef split_gini(cond):\n    return (cond.sum() * gini(y[cond]) + (~cond).sum() * gini(y[~cond])) / len(y)\n\n# 2. 질문별 가중 지니\nscores = {'female': split_gini(df['sex'] == 'female'), 'first_class': split_gini(df['pclass'] == 1), 'child': split_gini(df['age'] <= 6.5)}\n# 3. 가장 작은 질문\nbest = min(scores, key=scores.get)\nprint({k: round(v, 3) for k, v in scores.items()}, best)\n",
    "hints": [
      "min(scores, key=scores.get)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 지니 함수",
        "expr": "abs(gini(y) - (1 - y.mean() ** 2 - (1 - y.mean()) ** 2)) < 1e-12",
        "hint": "1 - p ** 2 - (1 - p) ** 2"
      },
      {
        "label": "2단계 질문별 가중 지니",
        "expr": "set(scores) == {'female', 'first_class', 'child'} and abs(scores['female'] - split_gini(df['sex'] == 'female')) < 1e-12 and abs(scores['child'] - split_gini(df['age'] <= 6.5)) < 1e-12",
        "hint": "split_gini(df['sex'] == 'female') ..."
      },
      {
        "label": "3단계 가장 좋은 질문",
        "expr": "best == 'female'",
        "hint": "min(scores, key=scores.get)"
      }
    ]
  },
  {
    "id": "35-5",
    "unit": 35,
    "domain": "mfg",
    "title": "검증 곡선으로 고장 트리 깊이 고르기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "validation_curve(모델, X, y, param_name=..., param_range=..., cv=..., scoring=...)",
        "설정값마다 학습·검증 점수"
      ],
      [
        ".mean(axis=1)",
        "폴드 평균"
      ],
      [
        "np.argmax",
        "가장 높은 위치"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>트리 깊이 2~14에서 학습 F1과 검증 F1을 함께 구해, 어디서부터 외우기(과적합) 시작하는지 봅니다. 고장이 드물어 F1(<code>scoring='f1'</code>)로 잽니다.</p>\n<ol><li><code>train_s</code>, <code>valid_s</code>: <code>validation_curve</code>의 두 결과 (후보 × 폴드)</li><li><code>valid_mean</code>: 깊이별 검증 F1 평균</li><li><code>best_depth</code>: 검증 F1 평균이 가장 높은 깊이</li><li><code>gap_last</code>: 깊이 14에서 학습 F1 평균 − 검증 F1 평균</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import validation_curve, StratifiedKFold\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('ai4i2020.csv')\nX = df[['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']].values\ny = df['failure'].values\ndepths = [2, 4, 6, 8, 10, 12, 14]\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\n\n# 1. 학습·검증 점수\ntrain_s, valid_s =\n# 2. 깊이별 검증 F1 평균\nvalid_mean =\n# 3. 가장 좋은 깊이\nbest_depth =\n# 4. 깊이 14의 간격 (학습 - 검증)\ngap_last =\n\nprint(valid_mean.round(3), best_depth, round(gap_last, 3))\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import validation_curve, StratifiedKFold\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('ai4i2020.csv')\nX = df[['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']].values\ny = df['failure'].values\ndepths = [2, 4, 6, 8, 10, 12, 14]\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\n\n# 1. 학습·검증 점수\ntrain_s, valid_s = validation_curve(DecisionTreeClassifier(random_state=0), X, y, param_name='max_depth', param_range=depths, cv=cv, scoring='f1')\n# 2. 깊이별 검증 F1 평균\nvalid_mean = valid_s.mean(axis=1)\n# 3. 가장 좋은 깊이\nbest_depth = depths[int(np.argmax(valid_mean))]\n# 4. 깊이 14의 간격 (학습 - 검증)\ngap_last = train_s.mean(axis=1)[-1] - valid_mean[-1]\nprint(valid_mean.round(3), best_depth, round(gap_last, 3))\n",
    "hints": [
      "validation_curve(..., param_name='max_depth', param_range=depths, cv=cv, scoring='f1')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 validation_curve",
        "expr": "train_s.shape == (7, 5) and valid_s.shape == (7, 5)",
        "hint": "validation_curve(DecisionTreeClassifier(random_state=0), X, y, param_name='max_depth', param_range=depths, cv=cv, scoring='f1')"
      },
      {
        "label": "2단계 검증 평균",
        "expr": "np.allclose(valid_mean, valid_s.mean(axis=1))",
        "hint": "valid_s.mean(axis=1)"
      },
      {
        "label": "3단계 가장 좋은 깊이",
        "expr": "best_depth == depths[int(np.argmax(valid_s.mean(axis=1)))]",
        "hint": "depths[int(np.argmax(valid_mean))]"
      },
      {
        "label": "4단계 간격",
        "expr": "abs(gap_last - (train_s.mean(axis=1)[-1] - valid_s.mean(axis=1)[-1])) < 1e-12 and gap_last > 0",
        "hint": "train_s.mean(axis=1)[-1] - valid_mean[-1]"
      }
    ]
  },
  {
    "id": "35-6",
    "unit": 35,
    "domain": "general",
    "title": "과소적합과 과적합 구간 찾기 (검증 곡선)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "validation_curve",
        "설정값마다 학습·검증 점수"
      ],
      [
        "np.argmax",
        "가장 높은 위치"
      ],
      [
        "비교 연산 + 리스트",
        "조건에 맞는 깊이 고르기"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 타이타닉 승객 데이터(891명, 실제 기록)입니다. <code>survived</code>(생존 1 / 사망 0), <code>pclass</code>(객실 등급 1~3), <code>sex</code>, <code>age</code>(나이, 177명은 빈칸), <code>sibsp</code>(함께 탄 형제·배우자 수), <code>parch</code>(함께 탄 부모·자녀 수), <code>fare</code>(운임), <code>embarked</code>(탑승 항구 S·C·Q, 2명은 빈칸) 열을 씁니다.</p><p>시작 코드가 <code>X</code>(pclass, female, age, sibsp, parch, fare)와 <code>y</code>를 만들어 둡니다. 깊이 1~15의 검증 곡선을 그려 볼 수치를 구합니다.</p>\n<ol><li><code>train_mean</code>, <code>valid_mean</code>: 깊이별 학습·검증 정확도 평균 (5-fold)</li><li><code>best_depth</code>: 검증 평균이 가장 높은 깊이</li><li><code>overfit</code>: 학습 − 검증 간격이 <b>0.1보다 큰</b> 깊이들의 리스트</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import validation_curve\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('titanic.csv')\ndf['female'] = (df['sex'] == 'female').astype(int)\ndf['age'] = df['age'].fillna(df['age'].median())\nX = df[['pclass', 'female', 'age', 'sibsp', 'parch', 'fare']]\ny = df['survived']\ndepths = list(range(1, 16))\n\ntrain_s, valid_s = validation_curve(DecisionTreeClassifier(random_state=0), X, y, param_name='max_depth', param_range=depths, cv=5)\n# 1. 깊이별 학습·검증 평균\ntrain_mean =\nvalid_mean =\n# 2. 가장 좋은 깊이\nbest_depth =\n# 3. 간격이 0.1보다 큰 깊이들\noverfit =\n\nprint(best_depth, overfit)\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import validation_curve\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('titanic.csv')\ndf['female'] = (df['sex'] == 'female').astype(int)\ndf['age'] = df['age'].fillna(df['age'].median())\nX = df[['pclass', 'female', 'age', 'sibsp', 'parch', 'fare']]\ny = df['survived']\ndepths = list(range(1, 16))\n\ntrain_s, valid_s = validation_curve(DecisionTreeClassifier(random_state=0), X, y, param_name='max_depth', param_range=depths, cv=5)\n# 1. 깊이별 학습·검증 평균\ntrain_mean = train_s.mean(axis=1)\nvalid_mean = valid_s.mean(axis=1)\n# 2. 가장 좋은 깊이\nbest_depth = depths[int(np.argmax(valid_mean))]\n# 3. 간격이 0.1보다 큰 깊이들\noverfit = [d for d, g in zip(depths, train_mean - valid_mean) if g > 0.1]\nprint(best_depth, overfit)\n",
    "hints": [
      "[d for d, g in zip(depths, train_mean - valid_mean) if g > 0.1]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 평균",
        "expr": "np.allclose(train_mean, train_s.mean(axis=1)) and np.allclose(valid_mean, valid_s.mean(axis=1))",
        "hint": "train_s.mean(axis=1), valid_s.mean(axis=1)"
      },
      {
        "label": "2단계 가장 좋은 깊이",
        "expr": "best_depth == depths[int(np.argmax(valid_s.mean(axis=1)))]",
        "hint": "depths[int(np.argmax(valid_mean))]"
      },
      {
        "label": "3단계 과적합 깊이",
        "expr": "list(overfit) == [d for d, g in zip(depths, train_s.mean(axis=1) - valid_s.mean(axis=1)) if g > 0.1] and len(overfit) > 0",
        "hint": "[d for d, g in zip(depths, train_mean - valid_mean) if g > 0.1]"
      }
    ]
  },
  {
    "id": "36-5",
    "unit": 36,
    "domain": "mfg",
    "title": "동력과 온도차로 고장 예측 F1 올리기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "df['새 열'] = 계산식",
        "파생변수 만들기"
      ],
      [
        "cross_val_score(..., scoring='f1')",
        "교차검증 F1"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>회전수 × 토크는 물리적으로 <b>동력</b>, 공정 온도 − 공기 온도는 <b>열이 빠지는 정도</b>입니다. 두 열을 새로 만들어 넣으면 같은 트리 모델의 F1이 얼마나 오르는지 봅니다.</p>\n<ol><li><code>df['power']</code>: <code>rpm * torque * 2 * 3.1416 / 60</code> (와트)</li><li><code>df['temp_gap']</code>: <code>process_temp - air_temp</code></li><li><code>f1_base</code>: 기본 5개 열의 교차검증 F1 평균</li><li><code>f1_new</code>: 5개 + 새 2개 열의 교차검증 F1 평균</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('ai4i2020.csv')\ny = df['failure']\nbase = ['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\nmodel = DecisionTreeClassifier(max_depth=5, random_state=0)\n\n# 1. 동력 (W)\ndf['power'] =\n# 2. 온도차\ndf['temp_gap'] =\n# 3. 기본 열 F1\nf1_base =\n# 4. 새 열 추가 F1\nf1_new =\n\nprint(round(f1_base, 3), round(f1_new, 3))\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.tree import DecisionTreeClassifier\n\ndf = pd.read_csv('ai4i2020.csv')\ny = df['failure']\nbase = ['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\nmodel = DecisionTreeClassifier(max_depth=5, random_state=0)\n\n# 1. 동력 (W)\ndf['power'] = df['rpm'] * df['torque'] * 2 * 3.1416 / 60\n# 2. 온도차\ndf['temp_gap'] = df['process_temp'] - df['air_temp']\n# 3. 기본 열 F1\nf1_base = cross_val_score(model, df[base], y, cv=cv, scoring='f1').mean()\n# 4. 새 열 추가 F1\nf1_new = cross_val_score(model, df[base + ['power', 'temp_gap']], y, cv=cv, scoring='f1').mean()\nprint(round(f1_base, 3), round(f1_new, 3))\n",
    "hints": [
      "df['rpm'] * df['torque'] * 2 * 3.1416 / 60",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 동력",
        "expr": "np.allclose(df['power'], df['rpm'] * df['torque'] * 2 * 3.1416 / 60)",
        "hint": "df['rpm'] * df['torque'] * 2 * 3.1416 / 60"
      },
      {
        "label": "2단계 온도차",
        "expr": "np.allclose(df['temp_gap'], df['process_temp'] - df['air_temp'])",
        "hint": "df['process_temp'] - df['air_temp']"
      },
      {
        "label": "3단계 기본 F1",
        "expr": "abs(f1_base - cross_val_score(DecisionTreeClassifier(max_depth=5, random_state=0), df[base], y, cv=cv, scoring='f1').mean()) < 1e-9",
        "hint": "cross_val_score(model, df[base], y, cv=cv, scoring='f1').mean()"
      },
      {
        "label": "4단계 새 열 F1",
        "expr": "abs(f1_new - cross_val_score(DecisionTreeClassifier(max_depth=5, random_state=0), df[base + ['power', 'temp_gap']], y, cv=cv, scoring='f1').mean()) < 1e-9 and f1_new > f1_base",
        "hint": "base + ['power', 'temp_gap']"
      }
    ]
  },
  {
    "id": "36-6",
    "unit": 36,
    "domain": "general",
    "title": "가족 수 특성 만들고 구간으로 나누기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "열 + 열 + 1",
        "가족 수"
      ],
      [
        "pd.cut(열, bins=..., labels=...)",
        "숫자를 구간으로"
      ],
      [
        "groupby(...)['survived'].mean()",
        "구간별 생존율"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 타이타닉 승객 데이터(891명, 실제 기록)입니다. <code>survived</code>(생존 1 / 사망 0), <code>pclass</code>(객실 등급 1~3), <code>sex</code>, <code>age</code>(나이, 177명은 빈칸), <code>sibsp</code>(함께 탄 형제·배우자 수), <code>parch</code>(함께 탄 부모·자녀 수), <code>fare</code>(운임), <code>embarked</code>(탑승 항구 S·C·Q, 2명은 빈칸) 열을 씁니다.</p><p>형제·배우자 수와 부모·자녀 수를 합치면 <b>가족 수</b>라는 새 특성이 됩니다. 가족 수에 따라 생존율이 올라갔다 내려가는 모양이라, 구간으로 나눠 보는 것이 좋습니다.</p>\n<ol><li><code>df['family']</code>: <code>sibsp + parch + 1</code> (본인 포함)</li><li><code>df['family_group']</code>: <code>pd.cut</code>으로 <code>bins=[0, 1, 4, 11]</code>, <code>labels=['alone', '2-4', '5+']</code></li><li><code>rates</code>: 구간별 생존율 Series (<code>observed=True</code>)</li><li><code>best_group</code>: 생존율이 가장 높은 구간 이름</li></ol>",
    "starter": "import pandas as pd\n\ndf = pd.read_csv('titanic.csv')\n\n# 1. 가족 수\ndf['family'] =\n# 2. 구간\ndf['family_group'] =\n# 3. 구간별 생존율\nrates =\n# 4. 생존율이 가장 높은 구간\nbest_group =\n\nprint(rates.round(3).to_dict(), best_group)\n",
    "solution": "import pandas as pd\n\ndf = pd.read_csv('titanic.csv')\n\n# 1. 가족 수\ndf['family'] = df['sibsp'] + df['parch'] + 1\n# 2. 구간\ndf['family_group'] = pd.cut(df['family'], bins=[0, 1, 4, 11], labels=['alone', '2-4', '5+'])\n# 3. 구간별 생존율\nrates = df.groupby('family_group', observed=True)['survived'].mean()\n# 4. 생존율이 가장 높은 구간\nbest_group = rates.idxmax()\nprint(rates.round(3).to_dict(), best_group)\n",
    "hints": [
      "pd.cut(df['family'], bins=[0, 1, 4, 11], labels=['alone', '2-4', '5+'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 가족 수",
        "expr": "(df['family'] == df['sibsp'] + df['parch'] + 1).all()",
        "hint": "df['sibsp'] + df['parch'] + 1"
      },
      {
        "label": "2단계 구간",
        "expr": "df['family_group'].astype(str).value_counts().to_dict() == {'alone': 537, '2-4': 292, '5+': 62}",
        "hint": "pd.cut(df['family'], bins=[0, 1, 4, 11], labels=['alone', '2-4', '5+'])"
      },
      {
        "label": "3단계 구간별 생존율",
        "expr": "abs(float(rates['alone']) - 0.3035) < 0.001 and abs(float(rates['5+']) - 0.1613) < 0.001",
        "hint": "df.groupby('family_group', observed=True)['survived'].mean()"
      },
      {
        "label": "4단계 가장 높은 구간",
        "expr": "str(best_group) == '2-4'",
        "hint": "rates.idxmax()"
      }
    ]
  },
  {
    "id": "47-1",
    "unit": 47,
    "domain": "mfg",
    "title": "KNN은 표준화가 먼저 (설비 고장)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "KNeighborsClassifier(n_neighbors=k)",
        "가까운 k개의 다수결"
      ],
      [
        "make_pipeline(StandardScaler(), 모델)",
        "표준화 + 모델"
      ],
      [
        "cross_val_score(..., scoring='recall')",
        "교차검증 재현율"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>시간을 줄이려고 3,000건만 뽑아 씁니다. 회전수는 1,000 단위, 토크는 10 단위라 표준화 없이 거리를 재면 회전수가 거리를 독차지합니다.</p>\n<ol><li><code>raw</code>: 표준화 없이 <code>KNeighborsClassifier(n_neighbors=3)</code>의 교차검증 재현율 평균</li><li><code>scaled</code>: <code>make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=3))</code>의 교차검증 재현율 평균</li><li><code>better</code>: 표준화한 쪽이 더 높은가 (True/False)</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\n\ndf = pd.read_csv('ai4i2020.csv').sample(3000, random_state=0)\nX = df[['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']]\ny = df['failure']\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\n\n# 1. 표준화 없이\nraw =\n# 2. 표준화 + KNN\nscaled =\n# 3. 표준화한 쪽이 더 높은가\nbetter =\n\nprint(round(raw, 3), round(scaled, 3), better)\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\n\ndf = pd.read_csv('ai4i2020.csv').sample(3000, random_state=0)\nX = df[['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']]\ny = df['failure']\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\n\n# 1. 표준화 없이\nraw = cross_val_score(KNeighborsClassifier(n_neighbors=3), X, y, cv=cv, scoring='recall').mean()\n# 2. 표준화 + KNN\nscaled = cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=3)), X, y, cv=cv, scoring='recall').mean()\n# 3. 표준화한 쪽이 더 높은가\nbetter = scaled > raw\nprint(round(raw, 3), round(scaled, 3), better)\n",
    "hints": [
      "make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=3))",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 표준화 없이",
        "expr": "abs(raw - cross_val_score(KNeighborsClassifier(n_neighbors=3), X, y, cv=cv, scoring='recall').mean()) < 1e-9",
        "hint": "cross_val_score(KNeighborsClassifier(n_neighbors=3), X, y, cv=cv, scoring='recall').mean()"
      },
      {
        "label": "2단계 표준화 + KNN",
        "expr": "abs(scaled - cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=3)), X, y, cv=cv, scoring='recall').mean()) < 1e-9",
        "hint": "make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=3))"
      },
      {
        "label": "3단계 비교",
        "expr": "bool(better) == bool(scaled > raw) and bool(better)",
        "hint": "scaled > raw"
      }
    ]
  },
  {
    "id": "47-2",
    "unit": 47,
    "domain": "general",
    "title": "이웃 수 k를 GridSearchCV로 고르기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "GridSearchCV(파이프라인, {'kneighborsclassifier__n_neighbors': [...]}, cv=5)",
        "파이프라인 안 단계의 설정 고르기"
      ],
      [
        ".best_params_",
        "가장 좋은 설정"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 타이타닉 승객 데이터(891명, 실제 기록)입니다. <code>survived</code>(생존 1 / 사망 0), <code>pclass</code>(객실 등급 1~3), <code>sex</code>, <code>age</code>(나이, 177명은 빈칸), <code>sibsp</code>(함께 탄 형제·배우자 수), <code>parch</code>(함께 탄 부모·자녀 수), <code>fare</code>(운임), <code>embarked</code>(탑승 항구 S·C·Q, 2명은 빈칸) 열을 씁니다.</p><p>시작 코드가 <code>X</code>(pclass, female, age, sibsp, parch, fare)와 <code>y</code>를 만들어 둡니다. 표준화 + KNN 파이프라인에서 이웃 수 k를 고릅니다. 파이프라인 안 단계의 설정은 <code>단계이름__설정이름</code>으로 씁니다(밑줄 두 개).</p>\n<ol><li><code>pipe</code>: <code>make_pipeline(StandardScaler(), KNeighborsClassifier())</code></li><li><code>grid</code>: k 후보 <code>[1, 3, 5, 9, 15, 25, 51]</code>, <code>cv=5</code>로 학습한 GridSearchCV</li><li><code>best_k</code>: 가장 좋은 k</li><li><code>k1_score</code>: k=1의 평균 검증 점수 (<code>grid.cv_results_['mean_test_score'][0]</code>)</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import GridSearchCV\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\n\ndf = pd.read_csv('titanic.csv')\ndf['female'] = (df['sex'] == 'female').astype(int)\ndf['age'] = df['age'].fillna(df['age'].median())\nX = df[['pclass', 'female', 'age', 'sibsp', 'parch', 'fare']]\ny = df['survived']\nks = [1, 3, 5, 9, 15, 25, 51]\n\n# 1. 표준화 + KNN 파이프라인\npipe =\n# 2. GridSearchCV 학습\ngrid =\n# 3. 가장 좋은 k\nbest_k =\n# 4. k=1의 평균 검증 점수\nk1_score =\n\nprint(best_k, round(grid.best_score_, 3), round(k1_score, 3))\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import GridSearchCV\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\n\ndf = pd.read_csv('titanic.csv')\ndf['female'] = (df['sex'] == 'female').astype(int)\ndf['age'] = df['age'].fillna(df['age'].median())\nX = df[['pclass', 'female', 'age', 'sibsp', 'parch', 'fare']]\ny = df['survived']\nks = [1, 3, 5, 9, 15, 25, 51]\n\n# 1. 표준화 + KNN 파이프라인\npipe = make_pipeline(StandardScaler(), KNeighborsClassifier())\n# 2. GridSearchCV 학습\ngrid = GridSearchCV(pipe, {'kneighborsclassifier__n_neighbors': ks}, cv=5).fit(X, y)\n# 3. 가장 좋은 k\nbest_k = grid.best_params_['kneighborsclassifier__n_neighbors']\n# 4. k=1의 평균 검증 점수\nk1_score = grid.cv_results_['mean_test_score'][0]\nprint(best_k, round(grid.best_score_, 3), round(k1_score, 3))\n",
    "hints": [
      "GridSearchCV(pipe, {'kneighborsclassifier__n_neighbors': ks}, cv=5)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 파이프라인",
        "expr": "type(pipe[0]).__name__ == 'StandardScaler' and type(pipe[-1]).__name__ == 'KNeighborsClassifier'",
        "hint": "make_pipeline(StandardScaler(), KNeighborsClassifier())"
      },
      {
        "label": "2단계 GridSearchCV",
        "expr": "list(grid.cv_results_['param_kneighborsclassifier__n_neighbors']) == ks",
        "hint": "GridSearchCV(pipe, {'kneighborsclassifier__n_neighbors': ks}, cv=5).fit(X, y)"
      },
      {
        "label": "3단계 가장 좋은 k",
        "expr": "best_k == grid.best_params_['kneighborsclassifier__n_neighbors'] and best_k != 1",
        "hint": "grid.best_params_['kneighborsclassifier__n_neighbors']"
      },
      {
        "label": "4단계 k=1 점수",
        "expr": "abs(k1_score - grid.cv_results_['mean_test_score'][0]) < 1e-12 and k1_score < grid.best_score_",
        "hint": "grid.cv_results_['mean_test_score'][0]"
      }
    ]
  },
  {
    "id": "47-3",
    "unit": 47,
    "domain": "mfg",
    "title": "나이브 베이즈로 고장 확률 손 계산하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "(조건).mean()",
        "그룹 안의 비율 = 조건부 확률"
      ],
      [
        "P(고장) × P(특성1 | 고장) × P(특성2 | 고장)",
        "나이브 베이즈 점수"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>\"토크가 55를 넘고, 공구 사용 시간이 200분을 넘는\" 설비가 고장일 확률을 나이브 베이즈 방식으로 계산합니다. 두 특성이 서로 관계없다고(독립) 가정하고 확률을 곱합니다.</p>\n<ol><li><code>p_fail</code>: 전체 고장 비율 P(고장)</li><li><code>p_t_fail</code>, <code>p_w_fail</code>: 고장 설비 중 토크 &gt; 55 비율, 공구 &gt; 200 비율</li><li><code>p_t_ok</code>, <code>p_w_ok</code>: 정상 설비 중 같은 비율</li><li><code>prob</code>: <code>score_fail / (score_fail + score_ok)</code> (score_fail = p_fail × p_t_fail × p_w_fail)</li></ol><p>맨 아래 코드가 실제 비율과 비교해 보여 줍니다.</p>",
    "starter": "import pandas as pd\n\ndf = pd.read_csv('ai4i2020.csv')\nfail, ok = df[df['failure'] == 1], df[df['failure'] == 0]\n\n# 1. P(고장)\np_fail =\n# 2. 고장 설비 중 비율\np_t_fail =\np_w_fail =\n# 3. 정상 설비 중 비율\np_t_ok =\np_w_ok =\n# 4. 나이브 베이즈 고장 확률\nscore_fail = p_fail * p_t_fail * p_w_fail\nscore_ok = (1 - p_fail) * p_t_ok * p_w_ok\nprob =\n\nreal = df[(df['torque'] > 55) & (df['tool_wear'] > 200)]['failure']\nprint('naive bayes:', round(prob, 3), ' actual:', round(real.mean(), 3), 'of', len(real))\n",
    "solution": "import pandas as pd\n\ndf = pd.read_csv('ai4i2020.csv')\nfail, ok = df[df['failure'] == 1], df[df['failure'] == 0]\n\n# 1. P(고장)\np_fail = df['failure'].mean()\n# 2. 고장 설비 중 비율\np_t_fail = (fail['torque'] > 55).mean()\np_w_fail = (fail['tool_wear'] > 200).mean()\n# 3. 정상 설비 중 비율\np_t_ok = (ok['torque'] > 55).mean()\np_w_ok = (ok['tool_wear'] > 200).mean()\n# 4. 나이브 베이즈 고장 확률\nscore_fail = p_fail * p_t_fail * p_w_fail\nscore_ok = (1 - p_fail) * p_t_ok * p_w_ok\nprob = score_fail / (score_fail + score_ok)\nreal = df[(df['torque'] > 55) & (df['tool_wear'] > 200)]['failure']\nprint('naive bayes:', round(prob, 3), ' actual:', round(real.mean(), 3), 'of', len(real))\n",
    "hints": [
      "(fail['torque'] > 55).mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 P(고장)",
        "expr": "abs(p_fail - df['failure'].mean()) < 1e-12",
        "hint": "df['failure'].mean()"
      },
      {
        "label": "2단계 고장 중 비율",
        "expr": "abs(p_t_fail - (fail['torque'] > 55).mean()) < 1e-12 and abs(p_w_fail - (fail['tool_wear'] > 200).mean()) < 1e-12",
        "hint": "(fail['torque'] > 55).mean()"
      },
      {
        "label": "3단계 정상 중 비율",
        "expr": "abs(p_t_ok - (ok['torque'] > 55).mean()) < 1e-12 and abs(p_w_ok - (ok['tool_wear'] > 200).mean()) < 1e-12",
        "hint": "(ok['torque'] > 55).mean()"
      },
      {
        "label": "4단계 확률",
        "expr": "abs(prob - score_fail / (score_fail + score_ok)) < 1e-12 and 0 < prob < 1",
        "hint": "score_fail / (score_fail + score_ok)"
      }
    ]
  },
  {
    "id": "47-4",
    "unit": 47,
    "domain": "general",
    "title": "라플라스 스무딩으로 0 확률 막기 (스팸 필터)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "CategoricalNB(alpha=..., min_categories=2)",
        "범주형 나이브 베이즈"
      ],
      [
        "predict_proba(X)[:, 1]",
        "스팸일 확률"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 메일 10통의 아주 작은 예시입니다. 각 열은 그 단어가 메일에 있는지(1) 없는지(0), <code>spam</code>은 스팸이면 1입니다. 정상 메일에는 <code>free</code>가 한 번도 없었습니다.</p><p>\"free meeting\" 메일(<code>free=1, winner=0, meeting=1</code>)의 스팸 확률을 스무딩 없이, 그리고 라플라스 스무딩(<code>alpha=1</code>)으로 계산해 비교합니다.</p>\n<ol><li><code>nb0</code>: <code>alpha=1e-10</code>(스무딩 거의 없음), <code>min_categories=2</code>로 학습한 CategoricalNB</li><li><code>p0</code>: <code>nb0</code>로 본 새 메일의 스팸 확률</li><li><code>nb1</code>, <code>p1</code>: <code>alpha=1</code>로 같은 계산</li><li><code>zero_problem</code>: 스무딩 없을 때 정상 확률(<code>1 - p0</code>)이 0.001보다 작은가 (True/False)</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.naive_bayes import CategoricalNB\n\nmsgs = pd.DataFrame({\n    'free':    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0],\n    'winner':  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0],\n    'meeting': [0, 0, 0, 1, 0, 1, 1, 0, 1, 1],\n    'spam':    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],\n})\nX, y = msgs[['free', 'winner', 'meeting']], msgs['spam']\nnew = pd.DataFrame({'free': [1], 'winner': [0], 'meeting': [1]})\n\n# 1. 스무딩 거의 없이\nnb0 =\n# 2. 스팸 확률\np0 =\n# 3. 라플라스 스무딩\nnb1 =\np1 =\n# 4. 정상 확률이 사실상 0인가\nzero_problem =\n\nprint(round(p0, 3), round(p1, 3), zero_problem)\n",
    "solution": "import pandas as pd\nfrom sklearn.naive_bayes import CategoricalNB\n\nmsgs = pd.DataFrame({\n    'free':    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0],\n    'winner':  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0],\n    'meeting': [0, 0, 0, 1, 0, 1, 1, 0, 1, 1],\n    'spam':    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],\n})\nX, y = msgs[['free', 'winner', 'meeting']], msgs['spam']\nnew = pd.DataFrame({'free': [1], 'winner': [0], 'meeting': [1]})\n\n# 1. 스무딩 거의 없이\nnb0 = CategoricalNB(alpha=1e-10, min_categories=2).fit(X, y)\n# 2. 스팸 확률\np0 = nb0.predict_proba(new)[0, 1]\n# 3. 라플라스 스무딩\nnb1 = CategoricalNB(alpha=1, min_categories=2).fit(X, y)\np1 = nb1.predict_proba(new)[0, 1]\n# 4. 정상 확률이 사실상 0인가\nzero_problem = (1 - p0) < 0.001\nprint(round(p0, 3), round(p1, 3), zero_problem)\n",
    "hints": [
      "CategoricalNB(alpha=1, min_categories=2)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1~2단계 스무딩 없이",
        "expr": "abs(p0 - CategoricalNB(alpha=1e-10, min_categories=2).fit(X, y).predict_proba(new)[0, 1]) < 1e-9",
        "hint": "CategoricalNB(alpha=1e-10, min_categories=2).fit(X, y)"
      },
      {
        "label": "3단계 라플라스 스무딩",
        "expr": "abs(p1 - CategoricalNB(alpha=1, min_categories=2).fit(X, y).predict_proba(new)[0, 1]) < 1e-9 and p1 < p0",
        "hint": "CategoricalNB(alpha=1, min_categories=2).fit(X, y)"
      },
      {
        "label": "4단계 0 확률 문제",
        "expr": "bool(zero_problem) == bool((1 - p0) < 0.001) and bool(zero_problem)",
        "hint": "(1 - p0) < 0.001"
      }
    ]
  },
  {
    "id": "47-5",
    "unit": 47,
    "domain": "mfg",
    "title": "SVM으로 고장 잡기 (class_weight)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "SVC(kernel='rbf', class_weight=...)",
        "커널 SVM"
      ],
      [
        "make_pipeline(StandardScaler(), SVC(...))",
        "SVM도 표준화 필수"
      ],
      [
        "recall_score",
        "재현율"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: 실제 공개 데이터인 AI4I 2020 설비 고장 데이터(1만 건)입니다. <code>type</code>(제품 등급 L·M·H), <code>air_temp</code>(주변 온도, K), <code>process_temp</code>(공정 온도, K), <code>rpm</code>(회전수), <code>torque</code>(토크, Nm), <code>tool_wear</code>(공구 사용 시간, 분), <code>failure</code>(고장 1 / 정상 0) 열이 있고, 고장은 약 3.4%로 드뭅니다.</p><p>시간을 줄이려고 4,000건만 씁니다. SVM도 거리를 재므로 표준화를 함께 묶습니다. 고장이 드물어 기본 설정으로는 놓치는 게 많으니 <code>class_weight='balanced'</code>와 비교합니다.</p>\n<ol><li><code>svm</code>: <code>make_pipeline(StandardScaler(), SVC())</code>를 학습용으로 학습</li><li><code>rec_plain</code>: 시험용 재현율</li><li><code>svm_bal</code>: <code>SVC(class_weight='balanced')</code>로 같은 일</li><li><code>rec_bal</code>: 시험용 재현율</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.metrics import recall_score\n\ndf = pd.read_csv('ai4i2020.csv').sample(4000, random_state=0)\nX = df[['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']]\ny = df['failure']\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\n\n# 1. 표준화 + SVM\nsvm =\n# 2. 재현율\nrec_plain =\n# 3. class_weight='balanced'\nsvm_bal =\n# 4. 재현율\nrec_bal =\n\nprint(round(rec_plain, 3), round(rec_bal, 3))\n",
    "solution": "import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.metrics import recall_score\n\ndf = pd.read_csv('ai4i2020.csv').sample(4000, random_state=0)\nX = df[['air_temp', 'process_temp', 'rpm', 'torque', 'tool_wear']]\ny = df['failure']\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\n\n# 1. 표준화 + SVM\nsvm = make_pipeline(StandardScaler(), SVC()).fit(X_tr, y_tr)\n# 2. 재현율\nrec_plain = recall_score(y_te, svm.predict(X_te))\n# 3. class_weight='balanced'\nsvm_bal = make_pipeline(StandardScaler(), SVC(class_weight='balanced')).fit(X_tr, y_tr)\n# 4. 재현율\nrec_bal = recall_score(y_te, svm_bal.predict(X_te))\nprint(round(rec_plain, 3), round(rec_bal, 3))\n",
    "hints": [
      "make_pipeline(StandardScaler(), SVC(class_weight='balanced'))",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 SVM 학습",
        "expr": "type(svm[-1]).__name__ == 'SVC' and type(svm[0]).__name__ == 'StandardScaler' and svm[-1].class_weight is None",
        "hint": "make_pipeline(StandardScaler(), SVC()).fit(X_tr, y_tr)"
      },
      {
        "label": "2단계 재현율",
        "expr": "abs(rec_plain - recall_score(y_te, svm.predict(X_te))) < 1e-12",
        "hint": "recall_score(y_te, svm.predict(X_te))"
      },
      {
        "label": "3단계 balanced",
        "expr": "svm_bal[-1].class_weight == 'balanced'",
        "hint": "SVC(class_weight='balanced')"
      },
      {
        "label": "4단계 재현율",
        "expr": "abs(rec_bal - recall_score(y_te, svm_bal.predict(X_te))) < 1e-12 and rec_bal > rec_plain",
        "hint": "recall_score(y_te, svm_bal.predict(X_te))"
      }
    ]
  },
  {
    "id": "47-6",
    "unit": 47,
    "domain": "general",
    "title": "직선으로 못 나누는 데이터와 커널",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "make_circles",
        "안쪽 원과 바깥 고리 데이터"
      ],
      [
        "SVC(kernel='linear' / 'rbf')",
        "직선 경계 / 곡선 경계"
      ],
      [
        "cross_val_score",
        "교차검증 정확도"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><b>데이터</b>: <code>make_circles</code>로 만든 점 400개입니다. 안쪽 원(1)과 바깥 고리(0)라서 어떤 직선으로도 나눌 수 없습니다.</p>\n<ol><li><code>acc_linear</code>: <code>SVC(kernel='linear')</code>의 5-fold 정확도 평균</li><li><code>acc_rbf</code>: <code>SVC(kernel='rbf')</code>의 5-fold 정확도 평균</li><li><code>n_sv</code>: 전체 데이터로 학습한 rbf SVM의 서포트 벡터 개수 (<code>len(model.support_)</code>)</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.datasets import make_circles\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.svm import SVC\n\nX, y = make_circles(n_samples=400, noise=0.1, factor=0.4, random_state=0)\n\n# 1. 직선 커널\nacc_linear =\n# 2. rbf 커널\nacc_rbf =\n# 3. 서포트 벡터 개수\nmodel = SVC(kernel='rbf').fit(X, y)\nn_sv =\n\nprint(round(acc_linear, 3), round(acc_rbf, 3), n_sv)\n",
    "solution": "import numpy as np\nfrom sklearn.datasets import make_circles\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.svm import SVC\n\nX, y = make_circles(n_samples=400, noise=0.1, factor=0.4, random_state=0)\n\n# 1. 직선 커널\nacc_linear = cross_val_score(SVC(kernel='linear'), X, y, cv=5).mean()\n# 2. rbf 커널\nacc_rbf = cross_val_score(SVC(kernel='rbf'), X, y, cv=5).mean()\n# 3. 서포트 벡터 개수\nmodel = SVC(kernel='rbf').fit(X, y)\nn_sv = len(model.support_)\nprint(round(acc_linear, 3), round(acc_rbf, 3), n_sv)\n",
    "hints": [
      "SVC(kernel='rbf')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 직선 커널",
        "expr": "abs(acc_linear - cross_val_score(SVC(kernel='linear'), X, y, cv=5).mean()) < 1e-12",
        "hint": "cross_val_score(SVC(kernel='linear'), X, y, cv=5).mean()"
      },
      {
        "label": "2단계 rbf 커널",
        "expr": "abs(acc_rbf - cross_val_score(SVC(kernel='rbf'), X, y, cv=5).mean()) < 1e-12 and acc_rbf > 0.95",
        "hint": "cross_val_score(SVC(kernel='rbf'), X, y, cv=5).mean()"
      },
      {
        "label": "3단계 서포트 벡터",
        "expr": "n_sv == len(SVC(kernel='rbf').fit(X, y).support_)",
        "hint": "len(model.support_)"
      }
    ]
  }
];

export const ML3_QUIZZES = [
  {
    "id": "47-Q",
    "unit": 47,
    "title": "KNN · 나이브 베이즈 · SVM 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "KNeighborsClassifier(n_neighbors=3)으로 X, y를 학습한 뒤 [[2.1]]의 예측값 하나를 출력하는 코드를 작성하세요.",
        "given": "from sklearn.neighbors import KNeighborsClassifier\nX = [[1], [2], [3], [10], [11], [12]]\ny = [0, 0, 0, 1, 1, 1]",
        "expect": "0",
        "must": [
          "KNeighborsClassifier\\(",
          "\\.predict\\("
        ],
        "solution": "from sklearn.neighbors import KNeighborsClassifier\nX = [[1], [2], [3], [10], [11], [12]]\ny = [0, 0, 0, 1, 1, 1]\nprint(KNeighborsClassifier(n_neighbors=3).fit(X, y).predict([[2.1]])[0])",
        "explain": "2.1과 가장 가까운 세 점(1, 2, 3)이 모두 0이라 0으로 예측합니다."
      },
      {
        "kind": "ox",
        "q": "KNN에서 k=1로 두면 학습 데이터 정확도는 거의 100%가 되지만 새 데이터에서는 오히려 나빠지기 쉽다.",
        "answer": true,
        "explain": "가장 가까운 이웃이 자기 자신이라 학습 데이터는 다 맞힙니다. 외운 것이라 과적합입니다."
      },
      {
        "kind": "choice",
        "q": "나이브 베이즈가 '나이브(순진)'라고 불리는 이유는?",
        "options": [
          "데이터를 조금만 써서",
          "특성들이 서로 독립이라고 가정하고 확률을 곱해서",
          "확률 대신 거리를 써서",
          "정답 없이 학습해서"
        ],
        "answer": 1,
        "explain": "실제로는 관계가 있을 수 있는 특성들을 독립이라고 가정해 곱셈만으로 계산합니다."
      },
      {
        "kind": "choice",
        "q": "SVM의 경계선 위치를 정하는 점들은?",
        "options": [
          "모든 점",
          "경계에서 가장 먼 점들",
          "복도(마진) 가장자리에 닿은 서포트 벡터",
          "무작위로 뽑은 점"
        ],
        "answer": 2,
        "explain": "경계선은 서포트 벡터만으로 정해지고, 멀리 있는 점은 영향을 주지 않습니다."
      },
      {
        "kind": "choice",
        "q": "다음 중 표준화를 하지 않아도 결과가 거의 같은 모델은?",
        "options": [
          "KNN",
          "SVM",
          "랜덤포레스트",
          "K-means"
        ],
        "answer": 2,
        "explain": "트리 계열은 '기준값보다 큰가?'만 묻기 때문에 단위의 영향을 받지 않습니다. 나머지는 거리를 잽니다."
      }
    ]
  }
];
