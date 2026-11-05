// 통계(유닛 32~34) · 머신러닝(35~39) 문제와 딥러닝(40~46) 개념 퀴즈. scratchpad build_sm2.py 로 생성.
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.
// 딥러닝은 실습 없이 개념만: 유닛 40~46에는 개념 퀴즈만 있다.
export const SM2_UNITS = [
  {
    "id": 32,
    "title": "카이제곱 · ANOVA",
    "summary": "적합도 · 독립성 카이제곱 검정, 일원분산분석과 사후검정",
    "note": "<h4>범주 데이터는 카이제곱</h4><ul><li>적합도: <code>stats.chisquare(관측, 기대)</code> 관측 빈도가 예상한 비율을 따르는가</li><li>독립성: <code>stats.chi2_contingency(교차표)</code> 두 범주 변수가 관계가 있는가. 교차표는 <code>pd.crosstab</code></li></ul><p class=\"qc\">기대 빈도가 5보다 작은 칸이 많으면 근사가 맞지 않습니다. 범주를 합치거나 Fisher 정확검정을 씁니다.</p><h4>세 집단 이상 평균은 ANOVA</h4><p><code>stats.f_oneway(a, b, c)</code>의 p-value가 작으면 \"적어도 하나는 다르다\"까지만 말할 수 있습니다. 어느 쌍인지는 <code>stats.tukey_hsd(a, b, c)</code>로 확인합니다. t검정을 쌍마다 여러 번 하면 1종 오류가 커집니다.</p>"
  },
  {
    "id": 33,
    "title": "상관과 회귀",
    "summary": "피어슨 · 스피어만 상관, 최소제곱 직선, 잔차, 기울기 검정",
    "note": "<h4>상관계수</h4><p><code>stats.pearsonr(x, y)</code>는 직선 관계의 세기(−1~1), <code>stats.spearmanr</code>은 순위 기준이라 이상치와 곡선 관계에 강합니다. 상관은 인과가 아닙니다.</p><h4>단순 회귀</h4><p><code>res = stats.linregress(x, y)</code> → <code>res.slope</code>, <code>res.intercept</code>, <code>res.rvalue</code>(R² = rvalue²), <code>res.pvalue</code>(기울기 = 0 검정), <code>res.stderr</code>. <code>np.polyfit(x, y, 1)</code>은 [기울기, 절편].</p><h4>잔차</h4><p>잔차 = 실제 − 예측. 잔차가 유난히 큰 점은 이상치 후보이고, 잔차에 패턴이 보이면 직선이 맞지 않는 것입니다.</p>"
  },
  {
    "id": 34,
    "title": "A/B 테스트와 검정력",
    "summary": "두 비율 비교, 신뢰구간, 검정력, 표본 수 설계",
    "note": "<h4>두 비율 비교</h4><p>z = (p̂₁ − p̂₂) / √(p̄(1−p̄)(1/n₁ + 1/n₂)), 양측 p-value = <code>2 * stats.norm.sf(abs(z))</code>. 차이의 95% 신뢰구간은 (p̂₂ − p̂₁) ± 1.96·√(p̂₁(1−p̂₁)/n₁ + p̂₂(1−p̂₂)/n₂).</p><h4>검정력과 표본 수</h4><p>검정력 = 실제 차이가 있을 때 잡아낼 확률(보통 80%). 필요한 표본 수는 효과 크기의 제곱에 반비례합니다. 효과가 절반이면 표본은 4배.</p><p class=\"qc\">실험 도중 p-value를 자꾸 들여다보다 0.05 아래로 내려간 순간 멈추면 1종 오류가 커집니다. 표본 수를 먼저 정하고 끝까지 모으세요.</p>"
  },
  {
    "id": 35,
    "title": "교차검증과 하이퍼파라미터",
    "summary": "K-fold, 층화 분할, GridSearchCV, 검증 곡선",
    "note": "<h4>K-fold 교차검증</h4><p><code>cross_val_score(모델, X, y, cv=5)</code>는 데이터를 5조각으로 나눠 돌아가며 한 조각을 검증에 씁니다. 평균은 성능, 표준편차는 흔들림입니다. 분류는 기본으로 층화(StratifiedKFold) 분할을 씁니다.</p><h4>하이퍼파라미터 고르기</h4><p><code>GridSearchCV(모델, {'max_depth': [...]}, cv=5).fit(X_train, y_train)</code> → <code>best_params_</code>, <code>best_score_</code>. 고른 뒤 테스트 데이터로는 <b>한 번만</b> 평가합니다.</p><p class=\"qc\">테스트 점수를 보면서 하이퍼파라미터를 고르면 테스트 데이터가 검증 데이터가 되어 버립니다.</p>"
  },
  {
    "id": 36,
    "title": "피처 엔지니어링과 Pipeline",
    "summary": "StandardScaler, OneHotEncoder, ColumnTransformer, Pipeline",
    "note": "<h4>전처리도 학습한다</h4><p>스케일러·인코더는 <code>fit</code>에서 평균·범주를 기억하고 <code>transform</code>에서 적용합니다. 학습 데이터로만 fit 하세요.</p><h4>열마다 다른 전처리</h4><p><code>ColumnTransformer([('num', StandardScaler(), 숫자열), ('cat', OneHotEncoder(handle_unknown='ignore'), 범주열)])</code></p><h4>Pipeline</h4><p><code>make_pipeline(전처리, 모델)</code>을 통째로 <code>cross_val_score</code>에 넣으면 폴드마다 전처리도 다시 fit 되어 누수가 없습니다.</p>"
  },
  {
    "id": 37,
    "title": "비지도 학습",
    "summary": "K-means 군집, 엘보 · 실루엣, PCA 차원 축소",
    "note": "<h4>K-means</h4><p><code>KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs)</code> → <code>labels_</code>, <code>cluster_centers_</code>, <code>inertia_</code>. 거리 기반이므로 먼저 표준화합니다.</p><h4>k 고르기</h4><p>inertia는 k가 커질수록 계속 줄어듭니다. 꺾이는 지점(엘보)이나 <code>silhouette_score</code>가 가장 높은 k를 봅니다.</p><h4>PCA</h4><p>상관된 여러 열을 분산이 큰 방향 몇 개로 요약합니다. <code>explained_variance_ratio_</code>의 누적합으로 몇 개면 충분한지 정합니다.</p>"
  },
  {
    "id": 38,
    "title": "불균형 데이터",
    "summary": "정확도의 함정, class_weight, 임계값 조정, 오버샘플링",
    "note": "<h4>정확도의 함정</h4><p>양성이 5%면 전부 음성이라고 해도 정확도 95%입니다. 재현율·정밀도·F1, PR 곡선을 보세요.</p><h4>대응 방법</h4><ul><li><code>class_weight='balanced'</code>: 드문 클래스 오류에 더 큰 벌점</li><li>임계값 조정: <code>predict_proba</code>를 0.5가 아닌 값으로 자르기</li><li>리샘플링: <b>학습 데이터만</b> 오버/언더샘플링</li></ul><p class=\"qc\">분할 전에 오버샘플링하면 같은 행이 학습과 테스트에 동시에 들어가 성능이 부풀려집니다.</p>"
  },
  {
    "id": 39,
    "title": "모델 해석",
    "summary": "피처 중요도, 순열 중요도, 표준화 계수, 부분 의존도",
    "note": "<h4>무엇이 예측을 움직이나</h4><ul><li><code>feature_importances_</code>: 트리 모델의 불순도 감소 합. 빠르지만 학습 데이터 기준</li><li><code>permutation_importance</code>: 테스트 데이터에서 열을 섞었을 때 점수 하락</li><li>선형 모델: 표준화한 뒤의 계수 크기</li></ul><h4>부분 의존도</h4><p>한 열만 여러 값으로 바꾸고 나머지는 그대로 둔 채 평균 예측을 그린 곡선입니다. 방향과 모양(선형, 포화)을 봅니다.</p><p class=\"qc\">중요도는 '예측에 쓰였다'는 뜻이지 '원인이다'는 뜻이 아닙니다. 상관된 열끼리는 중요도를 나눠 가집니다.</p>"
  },
  {
    "id": 40,
    "title": "퍼셉트론과 활성화 함수",
    "summary": "가중합 + 편향, 계단 · 시그모이드 · tanh · ReLU",
    "note": "<h4>뉴런 하나</h4><p>z = w·x + b (가중합 + 편향), 출력 = 활성화 함수 f(z).</p><h4>활성화 함수</h4><ul><li>시그모이드 1/(1+e<sup>−z</sup>): 0~1, 확률처럼 해석</li><li>tanh: −1~1</li><li>ReLU max(0, z): 은닉층의 기본값, 기울기 소실이 적음</li></ul><p class=\"qc\">활성화 함수가 없으면 층을 아무리 쌓아도 선형 모델 하나와 같습니다.</p>"
  },
  {
    "id": 41,
    "title": "손실함수와 경사하강법",
    "summary": "MSE · 교차엔트로피, 기울기, 학습률",
    "note": "<h4>손실함수</h4><p>회귀는 MSE, 분류는 교차엔트로피 −Σ y·log(p). 틀린 답에 자신 있게 확률을 줄수록 크게 벌점을 받습니다.</p><h4>경사하강법</h4><p>w ← w − η · ∂L/∂w. 학습률 η가 너무 크면 발산, 너무 작으면 느립니다. 미니배치로 기울기를 추정하는 것이 SGD입니다.</p>"
  },
  {
    "id": 42,
    "title": "순전파와 역전파",
    "summary": "계산 그래프, 연쇄법칙, 기울기 흐름",
    "note": "<h4>순전파</h4><p>입력에서 출력까지 차례로 계산하며 중간값을 저장합니다.</p><h4>역전파</h4><p>출력의 손실에서 거꾸로 연쇄법칙(∂L/∂x = ∂L/∂y · ∂y/∂x)으로 각 가중치의 기울기를 구합니다. 순전파에서 저장한 중간값을 다시 씁니다.</p>"
  },
  {
    "id": 43,
    "title": "MLP 학습과 과적합",
    "summary": "에폭 · 배치, 검증 손실, 드롭아웃 · 조기 종료",
    "note": "<h4>용어</h4><p>에폭 = 학습 데이터를 한 바퀴, 배치 = 한 번 기울기를 계산하는 묶음. 데이터 1,000개, 배치 100이면 1에폭에 100번이 아니라 10번 업데이트합니다.</p><h4>과적합 대응</h4><p>학습 손실은 계속 내려가는데 검증 손실이 오르기 시작하면 과적합입니다. 조기 종료, 드롭아웃, 가중치 감쇠(L2), 데이터 증강을 씁니다.</p>"
  },
  {
    "id": 44,
    "title": "CNN",
    "summary": "합성곱 필터, 스트라이드 · 패딩, 풀링, 특징 맵",
    "note": "<h4>합성곱</h4><p>작은 필터를 이미지 위로 밀며 곱해 더합니다. 같은 필터를 모든 위치에 쓰므로(가중치 공유) 파라미터가 적고, 위치가 달라도 같은 패턴을 찾습니다.</p><h4>출력 크기</h4><p>(N − F + 2P) / S + 1. 풀링(2×2 최대)은 크기를 절반으로 줄이고 작은 이동에 덜 민감하게 만듭니다.</p>"
  },
  {
    "id": 45,
    "title": "RNN과 시퀀스",
    "summary": "은닉 상태, 시간 펼치기, 기울기 소실, LSTM · GRU",
    "note": "<h4>RNN</h4><p>h<sub>t</sub> = tanh(W·x<sub>t</sub> + U·h<sub>t−1</sub> + b). 같은 가중치를 매 시점 재사용하며, 은닉 상태가 지금까지의 요약입니다.</p><h4>기울기 소실</h4><p>역전파 때 같은 행렬을 여러 번 곱하므로 기울기가 0으로 사라지거나 폭발합니다. LSTM · GRU는 게이트로 정보를 오래 보존합니다.</p>"
  },
  {
    "id": 46,
    "title": "임베딩과 어텐션",
    "summary": "단어 벡터, Q · K · V, 스케일드 닷프로덕트, Transformer",
    "note": "<h4>임베딩</h4><p>단어(토큰)를 의미가 비슷하면 가까운 벡터로 표현합니다.</p><h4>어텐션</h4><p>softmax(QK<sup>T</sup> / √d) · V. 질문(Q)과 각 키(K)의 유사도로 가중치를 만들어 값(V)을 섞습니다. 모든 위치를 한 번에 보므로 먼 단어 관계도 바로 잡고 병렬 계산이 됩니다.</p>"
  }
];

export const SM2_PROBLEMS = [
  {
    "id": "32-1",
    "unit": 32,
    "domain": "mfg",
    "title": "요일별 불량이 고르게 나오나 (적합도 검정)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.chisquare(관측)",
        "기대 빈도가 같다는 가설 검정"
      ],
      [
        ".statistic / .pvalue",
        "카이제곱 통계량과 p-value"
      ],
      [
        "(O − E)² / E",
        "칸마다 차이의 제곱을 기대값으로 나눈 합"
      ]
    ],
    "origin": "통계",
    "desc": "<p>한 주 동안 요일별 불량 건수입니다. 금요일이 많아 보이는데, 요일과 무관하게 고르게 나온다는 가설(H0)을 기각할 수 있는지 검정합니다.</p>\n<ol><li><code>total</code>: 전체 불량 수</li><li><code>expected</code>: 요일마다 같다고 볼 때의 기대 빈도 배열</li><li><code>chi2</code>: 카이제곱 통계량 (직접 계산)</li><li><code>p</code>: p-value (stats.chisquare 사용)</li><li><code>reject</code>: 유의수준 0.05에서 H0 기각 여부</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nobs = np.array([18, 22, 25, 20, 35])   # 월 화 수 목 금\n\n# 1. 전체 불량 수\ntotal = \n# 2. 요일마다 같다고 볼 때의 기대 빈도 배열\nexpected = \n# 3. 카이제곱 통계량 (직접 계산)\nchi2 = \n# 4. p-value (stats.chisquare 사용)\np = \n# 5. 유의수준 0.05에서 H0 기각 여부\nreject = \n\nprint(total, expected, round(chi2, 3), round(p, 4), reject)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nobs = np.array([18, 22, 25, 20, 35])   # 월 화 수 목 금\n\n# 1. 전체 불량 수\ntotal = int(obs.sum())\n# 2. 요일마다 같다고 볼 때의 기대 빈도 배열\nexpected = np.full(5, total / 5)\n# 3. 카이제곱 통계량 (직접 계산)\nchi2 = float(((obs - expected) ** 2 / expected).sum())\n# 4. p-value (stats.chisquare 사용)\np = float(stats.chisquare(obs).pvalue)\n# 5. 유의수준 0.05에서 H0 기각 여부\nreject = bool(p < 0.05)\n\nprint(total, expected, round(chi2, 3), round(p, 4), reject)\n",
    "hints": [
      "obs.sum()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 전체 불량 수",
        "expr": "total == 120",
        "hint": "obs.sum()"
      },
      {
        "label": "2단계 요일마다 같다고 볼 때의 기대 빈도 배열",
        "expr": "np.allclose(expected, [24.0, 24.0, 24.0, 24.0, 24.0], atol=1e-6)",
        "hint": "np.full(5, total / 5)"
      },
      {
        "label": "3단계 카이제곱 통계량 (직접 계산)",
        "expr": "abs(chi2 - 7.416666666666667) < 7.42e-06",
        "hint": "((obs - expected) ** 2 / expected).sum()"
      },
      {
        "label": "4단계 p-value (stats.chisquare 사용)",
        "expr": "abs(p - 0.11544057945802733) < 1e-06",
        "hint": "stats.chisquare(obs).pvalue"
      },
      {
        "label": "5단계 유의수준 0.05에서 H0 기각 여부",
        "expr": "reject == False",
        "hint": "p < 0.05"
      }
    ]
  },
  {
    "id": "32-2",
    "unit": 32,
    "domain": "mfg",
    "title": "설비 세 대의 평균 두께 비교 (ANOVA)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.f_oneway(a, b, c)",
        "일원분산분석"
      ],
      [
        "stats.tukey_hsd(a, b, c)",
        "어느 쌍이 다른지 사후검정"
      ],
      [
        ".pvalue[i, j]",
        "i번과 j번 집단 비교의 p-value"
      ]
    ],
    "origin": "통계",
    "desc": "<p>설비 A·B·C에서 각 6개씩 도금 두께(mm)를 쟀습니다. 세 설비의 평균이 모두 같은지 ANOVA로 검정하고, 다르다면 어느 쌍이 다른지 Tukey HSD로 확인합니다.</p>\n<ol><li><code>means</code>: 설비별 평균 리스트 [A, B, C]</li><li><code>F</code>: F 통계량</li><li><code>p</code>: ANOVA p-value</li><li><code>p_ac</code>: Tukey HSD에서 A와 C 비교의 p-value</li><li><code>odd</code>: 평균이 다른 설비 이름 (&#x27;A&#x27;, &#x27;B&#x27;, &#x27;C&#x27; 중)</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\na = np.array([10.02, 10.05, 9.98, 10.01, 10.04, 10.00])\nb = np.array([10.08, 10.11, 10.06, 10.12, 10.09, 10.07])\nc = np.array([10.01, 9.99, 10.03, 10.00, 10.02, 9.98])\n\n# 1. 설비별 평균 리스트 [A, B, C]\nmeans = \n# 2. F 통계량\nF = \n# 3. ANOVA p-value\np = \n# 4. Tukey HSD에서 A와 C 비교의 p-value\np_ac = \n# 5. 평균이 다른 설비 이름 ('A', 'B', 'C' 중)\nodd = \n\nprint([round(m, 4) for m in means], round(F, 2), f'{p:.2e}', round(p_ac, 3), odd)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\na = np.array([10.02, 10.05, 9.98, 10.01, 10.04, 10.00])\nb = np.array([10.08, 10.11, 10.06, 10.12, 10.09, 10.07])\nc = np.array([10.01, 9.99, 10.03, 10.00, 10.02, 9.98])\n\n# 1. 설비별 평균 리스트 [A, B, C]\nmeans = [float(a.mean()), float(b.mean()), float(c.mean())]\n# 2. F 통계량\nF = float(stats.f_oneway(a, b, c).statistic)\n# 3. ANOVA p-value\np = float(stats.f_oneway(a, b, c).pvalue)\n# 4. Tukey HSD에서 A와 C 비교의 p-value\np_ac = float(stats.tukey_hsd(a, b, c).pvalue[0, 2])\n# 5. 평균이 다른 설비 이름 ('A', 'B', 'C' 중)\nodd = 'ABC'[int(np.argmax(means))]\n\nprint([round(m, 4) for m in means], round(F, 2), f'{p:.2e}', round(p_ac, 3), odd)\n",
    "hints": [
      "[a.mean(), b.mean(), c.mean()]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 설비별 평균 리스트 [A, B, C]",
        "expr": "np.allclose(means, [10.01666667, 10.08833333, 10.005], atol=1e-6)",
        "hint": "[a.mean(), b.mean(), c.mean()]"
      },
      {
        "label": "2단계 F 통계량",
        "expr": "abs(F - 23.594420600859017) < 2.36e-05",
        "hint": "stats.f_oneway(a, b, c).statistic"
      },
      {
        "label": "3단계 ANOVA p-value",
        "expr": "abs(p - 2.3326036968103444e-05) <= 2.33e-08",
        "hint": "stats.f_oneway(a, b, c).pvalue"
      },
      {
        "label": "4단계 Tukey HSD에서 A와 C 비교의 p-value",
        "expr": "abs(p_ac - 0.6557791015912071) < 0.001",
        "hint": "stats.tukey_hsd(a, b, c).pvalue[0, 2] (0=A, 2=C)"
      },
      {
        "label": "5단계 평균이 다른 설비 이름 ('A', 'B', 'C' 중)",
        "expr": "odd == 'B'",
        "hint": "평균이 가장 큰 설비가 나머지와 떨어져 있습니다."
      }
    ]
  },
  {
    "id": "32-3",
    "unit": 32,
    "domain": "general",
    "title": "쿠폰과 재구매는 관계가 있나 (독립성 검정)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "pd.crosstab(행, 열)",
        "두 범주 변수의 교차표"
      ],
      [
        "stats.chi2_contingency(표)",
        "독립성 카이제곱 검정"
      ],
      [
        ".expected_freq",
        "독립일 때의 기대 빈도"
      ]
    ],
    "origin": "통계",
    "desc": "<p>고객 150명의 쿠폰 사용 여부(<code>coupon</code>)와 재구매 여부(<code>rebuy</code>)입니다. 두 변수가 독립인지 검정합니다.</p>\n<ol><li><code>table</code>: coupon(행) × rebuy(열) 교차표</li><li><code>rate</code>: 쿠폰 사용·미사용별 재구매율 Series</li><li><code>res</code>: chi2_contingency 결과</li><li><code>p</code>: p-value</li><li><code>dof</code>: 자유도</li><li><code>min_expected</code>: 기대 빈도의 최솟값</li></ol>",
    "starter": "import pandas as pd\nfrom scipy import stats\n\ndf = pd.DataFrame({\n    'coupon': ['사용'] * 60 + ['미사용'] * 90,\n    'rebuy': ['재구매'] * 27 + ['이탈'] * 33 + ['재구매'] * 27 + ['이탈'] * 63,\n})\n\n# 1. coupon(행) × rebuy(열) 교차표\ntable = \n# 2. 쿠폰 사용·미사용별 재구매율 Series\nrate = \n# 3. chi2_contingency 결과\nres = \n# 4. p-value\np = \n# 5. 자유도\ndof = \n# 6. 기대 빈도의 최솟값\nmin_expected = \n\nprint(table)\nprint(rate.round(3))\nprint(round(p, 4), dof, min_expected)\n",
    "solution": "import pandas as pd\nfrom scipy import stats\n\ndf = pd.DataFrame({\n    'coupon': ['사용'] * 60 + ['미사용'] * 90,\n    'rebuy': ['재구매'] * 27 + ['이탈'] * 33 + ['재구매'] * 27 + ['이탈'] * 63,\n})\n\n# 1. coupon(행) × rebuy(열) 교차표\ntable = pd.crosstab(df['coupon'], df['rebuy'])\n# 2. 쿠폰 사용·미사용별 재구매율 Series\nrate = table['재구매'] / table.sum(axis=1)\n# 3. chi2_contingency 결과\nres = stats.chi2_contingency(table)\n# 4. p-value\np = float(res.pvalue)\n# 5. 자유도\ndof = int(res.dof)\n# 6. 기대 빈도의 최솟값\nmin_expected = float(res.expected_freq.min())\n\nprint(table)\nprint(rate.round(3))\nprint(round(p, 4), dof, min_expected)\n",
    "hints": [
      "pd.crosstab(df['coupon'], df['rebuy'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 coupon(행) × rebuy(열) 교차표",
        "expr": "table.shape == (2, 2) and [str(c) for c in table.columns.tolist()] == ['이탈', '재구매'] and abs(float(table.select_dtypes('number').sum().sum()) - 150.0) < 1e-3",
        "hint": "pd.crosstab(df['coupon'], df['rebuy'])"
      },
      {
        "label": "2단계 쿠폰 사용·미사용별 재구매율 Series",
        "expr": "rate.index.tolist() == ['미사용', '사용'] and np.allclose(rate.values.astype(float), [0.3, 0.45], atol=1e-4, equal_nan=True)",
        "hint": "table['재구매'] / table.sum(axis=1)"
      },
      {
        "label": "3단계 chi2_contingency 결과",
        "expr": "abs(res.pvalue - stats.chi2_contingency(table).pvalue) < 1e-9",
        "hint": "stats.chi2_contingency(table)"
      },
      {
        "label": "4단계 p-value",
        "expr": "abs(p - 0.08886998633829254) < 1e-06",
        "hint": "res.pvalue"
      },
      {
        "label": "5단계 자유도",
        "expr": "dof == 1",
        "hint": "res.dof  (행 수 − 1) × (열 수 − 1)"
      },
      {
        "label": "6단계 기대 빈도의 최솟값",
        "expr": "abs(min_expected - 21.6) < 2.16e-05",
        "hint": "res.expected_freq.min() (5 이상이어야 근사가 믿을 만합니다)"
      }
    ]
  },
  {
    "id": "32-4",
    "unit": 32,
    "domain": "general",
    "title": "광고 소재 세 개의 체류시간 비교",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.f_oneway",
        "세 집단 이상 평균 비교"
      ],
      [
        "stats.kruskal",
        "순위 기반(비모수) 대안"
      ],
      [
        "max(dict, key=)",
        "평균이 가장 큰 소재"
      ]
    ],
    "origin": "통계",
    "desc": "<p>광고 소재 A·B·C를 본 방문자 7명씩의 체류시간(초)입니다. 소재에 따라 평균 체류시간이 다른지 검정합니다.</p>\n<ol><li><code>means</code>: 소재별 평균 딕셔너리 {이름: 평균}</li><li><code>p_anova</code>: ANOVA p-value</li><li><code>p_kw</code>: Kruskal-Wallis p-value</li><li><code>best</code>: 평균 체류시간이 가장 긴 소재 이름</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\ngroups = {\n    'A': np.array([42, 38, 45, 40, 44, 39, 41]),\n    'B': np.array([48, 52, 47, 50, 49, 53, 51]),\n    'C': np.array([41, 43, 39, 44, 42, 40, 45]),\n}\n\n# 1. 소재별 평균 딕셔너리 {이름: 평균}\nmeans = \n# 2. ANOVA p-value\np_anova = \n# 3. Kruskal-Wallis p-value\np_kw = \n# 4. 평균 체류시간이 가장 긴 소재 이름\nbest = \n\nprint(means)\nprint(f'{p_anova:.2e}', f'{p_kw:.2e}', best)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\ngroups = {\n    'A': np.array([42, 38, 45, 40, 44, 39, 41]),\n    'B': np.array([48, 52, 47, 50, 49, 53, 51]),\n    'C': np.array([41, 43, 39, 44, 42, 40, 45]),\n}\n\n# 1. 소재별 평균 딕셔너리 {이름: 평균}\nmeans = {k: float(v.mean()) for k, v in groups.items()}\n# 2. ANOVA p-value\np_anova = float(stats.f_oneway(*groups.values()).pvalue)\n# 3. Kruskal-Wallis p-value\np_kw = float(stats.kruskal(*groups.values()).pvalue)\n# 4. 평균 체류시간이 가장 긴 소재 이름\nbest = max(means, key=means.get)\n\nprint(means)\nprint(f'{p_anova:.2e}', f'{p_kw:.2e}', best)\n",
    "hints": [
      "{k: v.mean() for k, v in groups.items()}",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 소재별 평균 딕셔너리 {이름: 평균}",
        "expr": "set(means) == {'A', 'B', 'C'} and abs(means['B'] - 50.0) < 1e-9 and abs(means['A'] - 289/7) < 1e-9",
        "hint": "{k: v.mean() for k, v in groups.items()}"
      },
      {
        "label": "2단계 ANOVA p-value",
        "expr": "abs(p_anova - 1.5091161771890294e-06) <= 1.51e-09",
        "hint": "stats.f_oneway(groups['A'], groups['B'], groups['C']).pvalue"
      },
      {
        "label": "3단계 Kruskal-Wallis p-value",
        "expr": "abs(p_kw - 0.0011324338584808693) <= 1.13e-06",
        "hint": "stats.kruskal(groups['A'], groups['B'], groups['C']).pvalue"
      },
      {
        "label": "4단계 평균 체류시간이 가장 긴 소재 이름",
        "expr": "best == 'B'",
        "hint": "max(means, key=means.get)"
      }
    ]
  },
  {
    "id": "33-1",
    "unit": 33,
    "domain": "mfg",
    "title": "온도가 오르면 두께가 얼마나 늘까",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "stats.pearsonr(x, y)",
        "피어슨 상관계수"
      ],
      [
        "stats.linregress(x, y)",
        "단순 선형회귀"
      ],
      [
        ".slope / .intercept / .rvalue",
        "기울기 · 절편 · 상관계수"
      ]
    ],
    "origin": "통계",
    "desc": "<p>도금조 온도(℃)를 바꿔 가며 잰 두께(mm)입니다. 상관계수와 회귀직선을 구하고 215℃일 때 두께를 예측합니다.</p>\n<ol><li><code>r</code>: 피어슨 상관계수</li><li><code>res</code>: linregress 결과</li><li><code>slope</code>: 기울기 (온도 1℃당 두께 변화)</li><li><code>pred215</code>: 215℃일 때 예측 두께</li><li><code>r2</code>: 결정계수 R²</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\ntemp = np.array([198, 200, 202, 204, 206, 208, 210, 212])\nthick = np.array([10.01, 10.03, 10.04, 10.07, 10.08, 10.11, 10.12, 10.15])\n\n# 1. 피어슨 상관계수\nr = \n# 2. linregress 결과\nres = \n# 3. 기울기 (온도 1℃당 두께 변화)\nslope = \n# 4. 215℃일 때 예측 두께\npred215 = \n# 5. 결정계수 R²\nr2 = \n\nprint(round(r, 4), round(slope, 5), round(pred215, 3), round(r2, 4))\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\ntemp = np.array([198, 200, 202, 204, 206, 208, 210, 212])\nthick = np.array([10.01, 10.03, 10.04, 10.07, 10.08, 10.11, 10.12, 10.15])\n\n# 1. 피어슨 상관계수\nr = float(stats.pearsonr(temp, thick).statistic)\n# 2. linregress 결과\nres = stats.linregress(temp, thick)\n# 3. 기울기 (온도 1℃당 두께 변화)\nslope = float(res.slope)\n# 4. 215℃일 때 예측 두께\npred215 = float(res.intercept + res.slope * 215)\n# 5. 결정계수 R²\nr2 = float(res.rvalue ** 2)\n\nprint(round(r, 4), round(slope, 5), round(pred215, 3), round(r2, 4))\n",
    "hints": [
      "stats.pearsonr(temp, thick).statistic",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 피어슨 상관계수",
        "expr": "abs(r - 0.9944270997010336) < 1e-06",
        "hint": "stats.pearsonr(temp, thick).statistic"
      },
      {
        "label": "2단계 linregress 결과",
        "expr": "abs(res.slope - stats.linregress(temp, thick).slope) < 1e-12",
        "hint": "stats.linregress(temp, thick)"
      },
      {
        "label": "3단계 기울기 (온도 1℃당 두께 변화)",
        "expr": "abs(slope - 0.009821428571428596) < 1e-06",
        "hint": "res.slope"
      },
      {
        "label": "4단계 215℃일 때 예측 두께",
        "expr": "abs(pred215 - 10.174464285714285) < 1.02e-05",
        "hint": "res.intercept + res.slope * 215"
      },
      {
        "label": "5단계 결정계수 R²",
        "expr": "abs(r2 - 0.9888852566198099) < 1e-06",
        "hint": "res.rvalue ** 2"
      }
    ]
  },
  {
    "id": "33-2",
    "unit": 33,
    "domain": "mfg",
    "title": "잔차로 이상한 로트 찾기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "np.polyfit(x, y, 1)",
        "1차 최소제곱 [기울기, 절편]"
      ],
      [
        "np.polyval(계수, x)",
        "예측값"
      ],
      [
        "잔차 = y − 예측",
        "직선에서 벗어난 정도"
      ],
      [
        "R² = 1 − SSE/SST",
        "설명력"
      ]
    ],
    "origin": "통계",
    "desc": "<p>전류밀도(A/dm²)와 도금 두께(μm) 10개 로트입니다. 직선을 맞추고 잔차가 가장 큰 로트를 찾습니다.</p>\n<ol><li><code>coef</code>: [기울기, 절편]</li><li><code>pred</code>: 예측값 배열</li><li><code>resid</code>: 잔차 배열 (y − pred)</li><li><code>worst</code>: 잔차 절댓값이 가장 큰 로트 번호 (0부터)</li><li><code>r2</code>: R²</li></ol>",
    "starter": "import numpy as np\n\nx = np.array([2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8])\ny = np.array([8.1, 8.9, 9.6, 10.5, 11.2, 13.9, 12.8, 13.7, 14.3, 15.2])\n\n# 1. [기울기, 절편]\ncoef = \n# 2. 예측값 배열\npred = \n# 3. 잔차 배열 (y − pred)\nresid = \n# 4. 잔차 절댓값이 가장 큰 로트 번호 (0부터)\nworst = \n# 5. R²\nr2 = \n\nprint(coef.round(3), resid.round(2), worst, round(r2, 4), sep='\\n')\n",
    "solution": "import numpy as np\n\nx = np.array([2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8])\ny = np.array([8.1, 8.9, 9.6, 10.5, 11.2, 13.9, 12.8, 13.7, 14.3, 15.2])\n\n# 1. [기울기, 절편]\ncoef = np.polyfit(x, y, 1)\n# 2. 예측값 배열\npred = np.polyval(coef, x)\n# 3. 잔차 배열 (y − pred)\nresid = y - pred\n# 4. 잔차 절댓값이 가장 큰 로트 번호 (0부터)\nworst = int(np.argmax(np.abs(resid)))\n# 5. R²\nr2 = float(1 - (resid ** 2).sum() / ((y - y.mean()) ** 2).sum())\n\nprint(coef.round(3), resid.round(2), worst, round(r2, 4), sep='\\n')\n",
    "hints": [
      "np.polyfit(x, y, 1)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 [기울기, 절편]",
        "expr": "np.allclose(coef, [3.99393939, 0.23757576], atol=1e-6)",
        "hint": "np.polyfit(x, y, 1)"
      },
      {
        "label": "2단계 예측값 배열",
        "expr": "np.allclose(pred, [8.22545455, 9.02424242, 9.8230303, 10.62181818, 11.42060606, 12.21939394, 13.01818182, 13.8169697, 14.61575758, 15.41454545], atol=1e-6)",
        "hint": "np.polyval(coef, x)"
      },
      {
        "label": "3단계 잔차 배열 (y − pred)",
        "expr": "np.allclose(resid, [-0.12545455, -0.12424242, -0.2230303, -0.12181818, -0.22060606, 1.68060606, -0.21818182, -0.1169697, -0.31575758, -0.21454545], atol=1e-6)",
        "hint": "y - pred"
      },
      {
        "label": "4단계 잔차 절댓값이 가장 큰 로트 번호 (0부터)",
        "expr": "worst == 5",
        "hint": "np.argmax(np.abs(resid))"
      },
      {
        "label": "5단계 R²",
        "expr": "abs(r2 - 0.9431009246832667) < 1e-06",
        "hint": "1 - (resid**2).sum() / ((y - y.mean())**2).sum()"
      }
    ]
  },
  {
    "id": "33-3",
    "unit": 33,
    "domain": "general",
    "title": "이상치 하나가 상관계수를 바꾼다",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.pearsonr",
        "값 그대로의 선형 상관"
      ],
      [
        "stats.spearmanr",
        "순위 상관 (이상치에 강함)"
      ],
      [
        "x[:-1]",
        "마지막 값 빼기"
      ]
    ],
    "origin": "통계",
    "desc": "<p>매장 10곳의 광고비(백만 원)와 매출(천만 원)입니다. 마지막 매장은 대형 행사로 매출이 튀었습니다. 피어슨과 스피어만 상관을 비교합니다.</p>\n<ol><li><code>r_p</code>: 피어슨 상관계수</li><li><code>r_s</code>: 스피어만 상관계수</li><li><code>r_p_trim</code>: 마지막 매장을 뺀 피어슨 상관계수</li><li><code>slope_all</code>: 전체 데이터 회귀 기울기</li><li><code>slope_trim</code>: 마지막 매장을 뺀 회귀 기울기</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nad = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])\nsales = np.array([12, 15, 14, 18, 21, 22, 25, 24, 28, 80])\n\n# 1. 피어슨 상관계수\nr_p = \n# 2. 스피어만 상관계수\nr_s = \n# 3. 마지막 매장을 뺀 피어슨 상관계수\nr_p_trim = \n# 4. 전체 데이터 회귀 기울기\nslope_all = \n# 5. 마지막 매장을 뺀 회귀 기울기\nslope_trim = \n\nprint(round(r_p, 3), round(r_s, 3), round(r_p_trim, 3))\nprint(round(slope_all, 2), round(slope_trim, 2))\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nad = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])\nsales = np.array([12, 15, 14, 18, 21, 22, 25, 24, 28, 80])\n\n# 1. 피어슨 상관계수\nr_p = float(stats.pearsonr(ad, sales).statistic)\n# 2. 스피어만 상관계수\nr_s = float(stats.spearmanr(ad, sales).statistic)\n# 3. 마지막 매장을 뺀 피어슨 상관계수\nr_p_trim = float(stats.pearsonr(ad[:-1], sales[:-1]).statistic)\n# 4. 전체 데이터 회귀 기울기\nslope_all = float(np.polyfit(ad, sales, 1)[0])\n# 5. 마지막 매장을 뺀 회귀 기울기\nslope_trim = float(np.polyfit(ad[:-1], sales[:-1], 1)[0])\n\nprint(round(r_p, 3), round(r_s, 3), round(r_p_trim, 3))\nprint(round(slope_all, 2), round(slope_trim, 2))\n",
    "hints": [
      "stats.pearsonr(ad, sales).statistic",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 피어슨 상관계수",
        "expr": "abs(r_p - 0.7220645579231455) < 1e-06",
        "hint": "stats.pearsonr(ad, sales).statistic"
      },
      {
        "label": "2단계 스피어만 상관계수",
        "expr": "abs(r_s - 0.9757575757575757) < 1e-06",
        "hint": "stats.spearmanr(ad, sales).statistic"
      },
      {
        "label": "3단계 마지막 매장을 뺀 피어슨 상관계수",
        "expr": "abs(r_p_trim - 0.9772648114139314) < 1e-06",
        "hint": "stats.pearsonr(ad[:-1], sales[:-1]).statistic"
      },
      {
        "label": "4단계 전체 데이터 회귀 기울기",
        "expr": "abs(slope_all - 4.696969696969699) < 4.7e-06",
        "hint": "np.polyfit(ad, sales, 1)[0]"
      },
      {
        "label": "5단계 마지막 매장을 뺀 회귀 기울기",
        "expr": "abs(slope_trim - 1.9500000000000006) < 1.95e-06",
        "hint": "np.polyfit(ad[:-1], sales[:-1], 1)[0]"
      }
    ]
  },
  {
    "id": "33-4",
    "unit": 33,
    "domain": "general",
    "title": "공부 시간과 점수: 기울기는 유의한가",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "stats.linregress",
        "기울기 · 절편 · p-value"
      ],
      [
        ".pvalue",
        "기울기가 0이라는 가설의 p-value"
      ],
      [
        ".stderr",
        "기울기의 표준오차"
      ]
    ],
    "origin": "통계",
    "desc": "<p>학생 8명의 주간 공부 시간과 시험 점수입니다. 공부 시간 1시간이 점수를 얼마나 올리는지, 그 기울기가 통계적으로 유의한지 봅니다.</p>\n<ol><li><code>res</code>: linregress 결과</li><li><code>slope</code>: 1시간당 점수 변화</li><li><code>pred10</code>: 10시간 공부할 때 예측 점수</li><li><code>p</code>: 기울기의 p-value</li><li><code>ci_low</code>: 기울기 95% 신뢰구간 하한 (t 분포, 자유도 n−2)</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nhours = np.array([1, 2, 3, 4, 5, 6, 7, 8])\nscore = np.array([52, 55, 61, 60, 68, 70, 75, 79])\n\n# 1. linregress 결과\nres = \n# 2. 1시간당 점수 변화\nslope = \n# 3. 10시간 공부할 때 예측 점수\npred10 = \n# 4. 기울기의 p-value\np = \n# 5. 기울기 95% 신뢰구간 하한 (t 분포, 자유도 n−2)\nci_low = \n\nprint(round(slope, 3), round(pred10, 1), f'{p:.2e}', round(ci_low, 3))\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nhours = np.array([1, 2, 3, 4, 5, 6, 7, 8])\nscore = np.array([52, 55, 61, 60, 68, 70, 75, 79])\n\n# 1. linregress 결과\nres = stats.linregress(hours, score)\n# 2. 1시간당 점수 변화\nslope = float(res.slope)\n# 3. 10시간 공부할 때 예측 점수\npred10 = float(res.intercept + res.slope * 10)\n# 4. 기울기의 p-value\np = float(res.pvalue)\n# 5. 기울기 95% 신뢰구간 하한 (t 분포, 자유도 n−2)\nci_low = float(res.slope - stats.t.ppf(0.975, len(hours) - 2) * res.stderr)\n\nprint(round(slope, 3), round(pred10, 1), f'{p:.2e}', round(ci_low, 3))\n",
    "hints": [
      "stats.linregress(hours, score)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 linregress 결과",
        "expr": "abs(res.slope - stats.linregress(hours, score).slope) < 1e-12",
        "hint": "stats.linregress(hours, score)"
      },
      {
        "label": "2단계 1시간당 점수 변화",
        "expr": "abs(slope - 3.857142857142857) < 3.86e-06",
        "hint": "res.slope"
      },
      {
        "label": "3단계 10시간 공부할 때 예측 점수",
        "expr": "abs(pred10 - 86.21428571428571) < 8.62e-05",
        "hint": "res.intercept + res.slope * 10"
      },
      {
        "label": "4단계 기울기의 p-value",
        "expr": "abs(p - 4.176621327176146e-06) <= 4.18e-09",
        "hint": "res.pvalue"
      },
      {
        "label": "5단계 기울기 95% 신뢰구간 하한 (t 분포, 자유도 n−2)",
        "expr": "abs(ci_low - 3.2573214426907957) < 3.26e-06",
        "hint": "res.slope - stats.t.ppf(0.975, n - 2) * res.stderr"
      }
    ]
  },
  {
    "id": "34-1",
    "unit": 34,
    "domain": "mfg",
    "title": "신규 공정의 불량률이 정말 낮아졌나",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "p̂ = x / n",
        "표본 비율"
      ],
      [
        "합동 비율",
        "(x1 + x2) / (n1 + n2)"
      ],
      [
        "z = (p̂1 − p̂2) / SE",
        "두 비율 차이의 z 통계량"
      ],
      [
        "2 * stats.norm.sf(|z|)",
        "양측 p-value"
      ]
    ],
    "origin": "통계",
    "desc": "<p>기존 공정 1,200개 중 불량 48개, 신규 공정 1,200개 중 불량 30개입니다. 두 공정의 불량률 차이를 2표본 비율 z검정으로 확인합니다.</p>\n<ol><li><code>p1</code>: 기존 불량률</li><li><code>p2</code>: 신규 불량률</li><li><code>pp</code>: 합동 불량률</li><li><code>z</code>: z 통계량</li><li><code>p_value</code>: 양측 p-value</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nx1, n1 = 48, 1200   # 기존\nx2, n2 = 30, 1200   # 신규\n\n# 1. 기존 불량률\np1 = \n# 2. 신규 불량률\np2 = \n# 3. 합동 불량률\npp = \n# 4. z 통계량\nz = \n# 5. 양측 p-value\np_value = \n\nprint(p1, p2, round(z, 3), round(p_value, 4))\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nx1, n1 = 48, 1200   # 기존\nx2, n2 = 30, 1200   # 신규\n\n# 1. 기존 불량률\np1 = x1 / n1\n# 2. 신규 불량률\np2 = x2 / n2\n# 3. 합동 불량률\npp = (x1 + x2) / (n1 + n2)\n# 4. z 통계량\nz = (p1 - p2) / np.sqrt(pp * (1 - pp) * (1 / n1 + 1 / n2))\n# 5. 양측 p-value\np_value = float(2 * stats.norm.sf(abs(z)))\n\nprint(p1, p2, round(z, 3), round(p_value, 4))\n",
    "hints": [
      "x1 / n1",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 기존 불량률",
        "expr": "abs(p1 - 0.04) < 1e-06",
        "hint": "x1 / n1"
      },
      {
        "label": "2단계 신규 불량률",
        "expr": "abs(p2 - 0.025) < 1e-06",
        "hint": "x2 / n2"
      },
      {
        "label": "3단계 합동 불량률",
        "expr": "abs(pp - 0.0325) < 1e-06",
        "hint": "(x1 + x2) / (n1 + n2)"
      },
      {
        "label": "4단계 z 통계량",
        "expr": "abs(z - 2.0720475471299116) < 2.07e-06",
        "hint": "SE = √(pp(1−pp)(1/n1 + 1/n2))"
      },
      {
        "label": "5단계 양측 p-value",
        "expr": "abs(p_value - 0.03826100725430526) < 1e-06",
        "hint": "2 * stats.norm.sf(abs(z))"
      }
    ]
  },
  {
    "id": "34-2",
    "unit": 34,
    "domain": "mfg",
    "title": "몇 개를 재야 차이를 잡아낼까 (검정력)",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "stats.norm.ppf(0.975)",
        "양측 5% 기준 z"
      ],
      [
        "SE = σ√(2/n)",
        "두 평균 차이의 표준오차"
      ],
      [
        "검정력 ≈ Φ(δ/SE − z₀.₉₇₅)",
        "차이가 진짜 있을 때 잡아낼 확률"
      ],
      [
        "n = 2((z_α + z_β)σ/δ)²",
        "필요 표본 수 (집단당)"
      ]
    ],
    "origin": "통계",
    "desc": "<p>개선 전후 두께 평균 차이가 실제로 δ = 0.05mm이고 표준편차 σ = 0.1mm일 때, 집단당 30개씩 재면 이 차이를 얼마나 잡아낼 수 있을까요? 검정력 80%를 얻으려면 몇 개가 필요할까요? (양측 α = 0.05, 정규근사)</p>\n<ol><li><code>z_a</code>: 양측 α = 0.05의 z 기준값</li><li><code>se</code>: 집단당 n개일 때 평균 차이의 표준오차</li><li><code>power30</code>: n = 30일 때 검정력</li><li><code>z_b</code>: 검정력 80%에 해당하는 z</li><li><code>n_need</code>: 검정력 80%에 필요한 집단당 표본 수 (올림한 정수)</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\ndelta, sigma, n = 0.05, 0.1, 30\n\n# 1. 양측 α = 0.05의 z 기준값\nz_a = \n# 2. 집단당 n개일 때 평균 차이의 표준오차\nse = \n# 3. n = 30일 때 검정력\npower30 = \n# 4. 검정력 80%에 해당하는 z\nz_b = \n# 5. 검정력 80%에 필요한 집단당 표본 수 (올림한 정수)\nn_need = \n\nprint(round(power30, 3), n_need)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\ndelta, sigma, n = 0.05, 0.1, 30\n\n# 1. 양측 α = 0.05의 z 기준값\nz_a = float(stats.norm.ppf(0.975))\n# 2. 집단당 n개일 때 평균 차이의 표준오차\nse = sigma * np.sqrt(2 / n)\n# 3. n = 30일 때 검정력\npower30 = float(stats.norm.cdf(delta / se - z_a))\n# 4. 검정력 80%에 해당하는 z\nz_b = float(stats.norm.ppf(0.8))\n# 5. 검정력 80%에 필요한 집단당 표본 수 (올림한 정수)\nn_need = int(np.ceil(2 * ((z_a + z_b) * sigma / delta) ** 2))\n\nprint(round(power30, 3), n_need)\n",
    "hints": [
      "stats.norm.ppf(0.975)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 양측 α = 0.05의 z 기준값",
        "expr": "abs(z_a - 1.959963984540054) < 1.96e-06",
        "hint": "stats.norm.ppf(0.975)"
      },
      {
        "label": "2단계 집단당 n개일 때 평균 차이의 표준오차",
        "expr": "abs(se - 0.025819888974716113) < 1e-06",
        "hint": "sigma * np.sqrt(2 / n)"
      },
      {
        "label": "3단계 n = 30일 때 검정력",
        "expr": "abs(power30 - 0.49063676233555414) < 1e-06",
        "hint": "stats.norm.cdf(delta / se - z_a)"
      },
      {
        "label": "4단계 검정력 80%에 해당하는 z",
        "expr": "abs(z_b - 0.8416212335729143) < 1e-06",
        "hint": "stats.norm.ppf(0.8)"
      },
      {
        "label": "5단계 검정력 80%에 필요한 집단당 표본 수 (올림한 정수)",
        "expr": "n_need == 63",
        "hint": "int(np.ceil(2 * ((z_a + z_b) * sigma / delta) ** 2))"
      }
    ]
  },
  {
    "id": "34-3",
    "unit": 34,
    "domain": "general",
    "title": "버튼 색 A/B 테스트 결과 읽기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "전환율 = 전환 / 방문",
        "그룹별 비율"
      ],
      [
        "상대 상승률",
        "(B − A) / A"
      ],
      [
        "SE = √(pA(1−pA)/nA + pB(1−pB)/nB)",
        "차이의 표준오차"
      ],
      [
        "차이 ± 1.96·SE",
        "95% 신뢰구간"
      ]
    ],
    "origin": "통계",
    "desc": "<p>A안(기존) 2,400명 중 120명, B안(새 버튼) 2,400명 중 156명이 구매했습니다. 전환율 차이와 95% 신뢰구간을 구합니다.</p>\n<ol><li><code>p_a</code>: A 전환율</li><li><code>p_b</code>: B 전환율</li><li><code>lift</code>: 상대 상승률 (B − A) / A</li><li><code>se</code>: 차이의 표준오차</li><li><code>ci</code>: 차이(B − A)의 95% 신뢰구간 (하한, 상한)</li><li><code>win</code>: 신뢰구간이 0을 포함하지 않고 B가 높은지</li></ol>",
    "starter": "import numpy as np\n\nconv_a, n_a = 120, 2400\nconv_b, n_b = 156, 2400\n\n# 1. A 전환율\np_a = \n# 2. B 전환율\np_b = \n# 3. 상대 상승률 (B − A) / A\nlift = \n# 4. 차이의 표준오차\nse = \n# 5. 차이(B − A)의 95% 신뢰구간 (하한, 상한)\nci = \n# 6. 신뢰구간이 0을 포함하지 않고 B가 높은지\nwin = \n\nprint(p_a, p_b, round(lift, 3), [round(v, 4) for v in ci], win)\n",
    "solution": "import numpy as np\n\nconv_a, n_a = 120, 2400\nconv_b, n_b = 156, 2400\n\n# 1. A 전환율\np_a = conv_a / n_a\n# 2. B 전환율\np_b = conv_b / n_b\n# 3. 상대 상승률 (B − A) / A\nlift = (p_b - p_a) / p_a\n# 4. 차이의 표준오차\nse = float(np.sqrt(p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b))\n# 5. 차이(B − A)의 95% 신뢰구간 (하한, 상한)\nci = (p_b - p_a - 1.96 * se, p_b - p_a + 1.96 * se)\n# 6. 신뢰구간이 0을 포함하지 않고 B가 높은지\nwin = bool(ci[0] > 0)\n\nprint(p_a, p_b, round(lift, 3), [round(v, 4) for v in ci], win)\n",
    "hints": [
      "conv_a / n_a",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 A 전환율",
        "expr": "abs(p_a - 0.05) < 1e-06",
        "hint": "conv_a / n_a"
      },
      {
        "label": "2단계 B 전환율",
        "expr": "abs(p_b - 0.065) < 1e-06",
        "hint": "conv_b / n_b"
      },
      {
        "label": "3단계 상대 상승률 (B − A) / A",
        "expr": "abs(lift - 0.3) < 1e-06",
        "hint": "(p_b - p_a) / p_a"
      },
      {
        "label": "4단계 차이의 표준오차",
        "expr": "abs(se - 0.006716739040139443) < 1e-06",
        "hint": "np.sqrt(p_a*(1-p_a)/n_a + p_b*(1-p_b)/n_b)"
      },
      {
        "label": "5단계 차이(B − A)의 95% 신뢰구간 (하한, 상한)",
        "expr": "np.allclose(ci, [0.00183519, 0.02816481], atol=1e-6)",
        "hint": "(diff - 1.96 * se, diff + 1.96 * se)"
      },
      {
        "label": "6단계 신뢰구간이 0을 포함하지 않고 B가 높은지",
        "expr": "win == True",
        "hint": "ci[0] > 0"
      }
    ]
  },
  {
    "id": "34-4",
    "unit": 34,
    "domain": "general",
    "title": "실험 전에 표본 수부터 정하기",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "p̄ = (p1 + p2) / 2",
        "평균 전환율"
      ],
      [
        "n = (z_α√(2p̄(1−p̄)) + z_β√(p1(1−p1) + p2(1−p2)))² / (p2 − p1)²",
        "두 비율 비교 표본 수 (집단당)"
      ],
      [
        "np.ceil",
        "올림"
      ]
    ],
    "origin": "통계",
    "desc": "<p>현재 전환율이 5%이고, 6%로 오르면(최소 탐지 효과 1%p) 잡아내고 싶습니다. 양측 α = 0.05, 검정력 80%일 때 집단당 필요한 방문자 수와, 하루 방문자 1,500명을 반반 나눌 때 걸리는 일수를 구합니다.</p>\n<ol><li><code>pbar</code>: 평균 전환율</li><li><code>z_a</code>: 양측 α = 0.05의 z</li><li><code>z_b</code>: 검정력 80%의 z</li><li><code>n_per</code>: 집단당 필요 표본 수 (올림한 정수)</li><li><code>days</code>: 필요 일수 (두 집단 합계 ÷ 하루 방문자, 올림)</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\np1, p2 = 0.05, 0.06\ndaily = 1500\n\n# 1. 평균 전환율\npbar = \n# 2. 양측 α = 0.05의 z\nz_a = \n# 3. 검정력 80%의 z\nz_b = \n# 4. 집단당 필요 표본 수 (올림한 정수)\nn_per = \n# 5. 필요 일수 (두 집단 합계 ÷ 하루 방문자, 올림)\ndays = \n\nprint(n_per, days)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\np1, p2 = 0.05, 0.06\ndaily = 1500\n\n# 1. 평균 전환율\npbar = (p1 + p2) / 2\n# 2. 양측 α = 0.05의 z\nz_a = float(stats.norm.ppf(0.975))\n# 3. 검정력 80%의 z\nz_b = float(stats.norm.ppf(0.8))\n# 4. 집단당 필요 표본 수 (올림한 정수)\nn_per = int(np.ceil((z_a * np.sqrt(2 * pbar * (1 - pbar)) + z_b * np.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / (p2 - p1) ** 2))\n# 5. 필요 일수 (두 집단 합계 ÷ 하루 방문자, 올림)\ndays = int(np.ceil(2 * n_per / daily))\n\nprint(n_per, days)\n",
    "hints": [
      "(p1 + p2) / 2",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 평균 전환율",
        "expr": "abs(pbar - 0.055) < 1e-06",
        "hint": "(p1 + p2) / 2"
      },
      {
        "label": "2단계 양측 α = 0.05의 z",
        "expr": "abs(z_a - 1.959963984540054) < 1.96e-06",
        "hint": "stats.norm.ppf(0.975)"
      },
      {
        "label": "3단계 검정력 80%의 z",
        "expr": "abs(z_b - 0.8416212335729143) < 1e-06",
        "hint": "stats.norm.ppf(0.8)"
      },
      {
        "label": "4단계 집단당 필요 표본 수 (올림한 정수)",
        "expr": "n_per == 8158",
        "hint": "공식 그대로 계산한 뒤 int(np.ceil(...))"
      },
      {
        "label": "5단계 필요 일수 (두 집단 합계 ÷ 하루 방문자, 올림)",
        "expr": "days == 11",
        "hint": "int(np.ceil(2 * n_per / daily))"
      }
    ]
  },
  {
    "id": "35-1",
    "unit": 35,
    "domain": "mfg",
    "title": "5-fold 교차검증으로 성능 재기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "cross_val_score(모델, X, y, cv=5)",
        "폴드 5개의 점수 배열"
      ],
      [
        ".mean() / .std()",
        "평균과 흔들림"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>도금 데이터(<code>X</code>: 온도·전류밀도, <code>y</code>: 불량)로 깊이 3 결정트리의 성능을 5-fold 교차검증으로 잽니다. 한 번 나눈 테스트 점수보다 덜 운에 좌우됩니다.</p>\n<ol><li><code>scores</code>: 5-fold 정확도 배열</li><li><code>mean_acc</code>: 평균 정확도</li><li><code>std_acc</code>: 정확도 표준편차</li><li><code>worst_fold</code>: 점수가 가장 낮은 폴드 번호 (0부터)</li></ol>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.tree import DecisionTreeClassifier\n\nmodel = DecisionTreeClassifier(max_depth=3, random_state=0)\n\n# 1. 5-fold 정확도 배열\nscores = \n# 2. 평균 정확도\nmean_acc = \n# 3. 정확도 표준편차\nstd_acc = \n# 4. 점수가 가장 낮은 폴드 번호 (0부터)\nworst_fold = \n\nprint(scores.round(3), round(mean_acc, 3), round(std_acc, 3), worst_fold)\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.tree import DecisionTreeClassifier\n\nmodel = DecisionTreeClassifier(max_depth=3, random_state=0)\n\n# 1. 5-fold 정확도 배열\nscores = cross_val_score(model, X, y, cv=5)\n# 2. 평균 정확도\nmean_acc = float(scores.mean())\n# 3. 정확도 표준편차\nstd_acc = float(scores.std())\n# 4. 점수가 가장 낮은 폴드 번호 (0부터)\nworst_fold = int(np.argmin(scores))\n\nprint(scores.round(3), round(mean_acc, 3), round(std_acc, 3), worst_fold)\n",
    "hints": [
      "cross_val_score(model, X, y, cv=5)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 5-fold 정확도 배열",
        "expr": "len(scores) == 5 and np.allclose(scores, cross_val_score(DecisionTreeClassifier(max_depth=3, random_state=0), X, y, cv=5))",
        "hint": "cross_val_score(model, X, y, cv=5)"
      },
      {
        "label": "2단계 평균 정확도",
        "expr": "abs(mean_acc - scores.mean()) < 1e-12",
        "hint": "scores.mean()"
      },
      {
        "label": "3단계 정확도 표준편차",
        "expr": "abs(std_acc - scores.std()) < 1e-12",
        "hint": "scores.std()"
      },
      {
        "label": "4단계 점수가 가장 낮은 폴드 번호 (0부터)",
        "expr": "worst_fold == int(np.argmin(scores))",
        "hint": "np.argmin(scores)"
      }
    ]
  },
  {
    "id": "35-2",
    "unit": 35,
    "domain": "mfg",
    "title": "GridSearchCV로 트리 깊이 고르기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "GridSearchCV(모델, param_grid, cv=5)",
        "후보마다 교차검증"
      ],
      [
        ".best_params_ / .best_score_",
        "가장 좋은 조합과 그 CV 점수"
      ],
      [
        ".best_estimator_",
        "전체 학습 데이터로 다시 학습된 최종 모델"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>학습 데이터에서만 교차검증으로 <code>max_depth</code>를 고르고, 마지막에 테스트 데이터로 한 번만 평가합니다.</p>\n<ol><li><code>grid</code>: 학습 데이터로 fit 한 GridSearchCV (random_state=0 트리, cv=5)</li><li><code>best_depth</code>: 가장 좋은 max_depth</li><li><code>cv_best</code>: 그 깊이의 평균 CV 정확도</li><li><code>test_acc</code>: 최종 모델의 테스트 정확도</li></ol>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split, GridSearchCV\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\nparam_grid = {'max_depth': [1, 2, 3, 4, 6, None]}\n\n# 1. 학습 데이터로 fit 한 GridSearchCV (random_state=0 트리, cv=5)\ngrid = \n# 2. 가장 좋은 max_depth\nbest_depth = \n# 3. 그 깊이의 평균 CV 정확도\ncv_best = \n# 4. 최종 모델의 테스트 정확도\ntest_acc = \n\nprint(best_depth, round(cv_best, 3), round(test_acc, 3))\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split, GridSearchCV\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\nparam_grid = {'max_depth': [1, 2, 3, 4, 6, None]}\n\n# 1. 학습 데이터로 fit 한 GridSearchCV (random_state=0 트리, cv=5)\ngrid = GridSearchCV(DecisionTreeClassifier(random_state=0), param_grid, cv=5).fit(X_train, y_train)\n# 2. 가장 좋은 max_depth\nbest_depth = grid.best_params_['max_depth']\n# 3. 그 깊이의 평균 CV 정확도\ncv_best = float(grid.best_score_)\n# 4. 최종 모델의 테스트 정확도\ntest_acc = float(grid.score(X_test, y_test))\n\nprint(best_depth, round(cv_best, 3), round(test_acc, 3))\n",
    "hints": [
      "GridSearchCV(DecisionTreeClassifier(random_state=0), param_grid, cv=5).fit(X_train, y_train)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 학습 데이터로 fit 한 GridSearchCV (random_state=0 트리, cv=5)",
        "expr": "hasattr(grid, 'best_params_') and len(grid.cv_results_['params']) == 6",
        "hint": "GridSearchCV(DecisionTreeClassifier(random_state=0), param_grid, cv=5).fit(X_train, y_train)"
      },
      {
        "label": "2단계 가장 좋은 max_depth",
        "expr": "best_depth == GridSearchCV(DecisionTreeClassifier(random_state=0), param_grid, cv=5).fit(X_train, y_train).best_params_['max_depth']",
        "hint": "grid.best_params_['max_depth']"
      },
      {
        "label": "3단계 그 깊이의 평균 CV 정확도",
        "expr": "abs(cv_best - grid.best_score_) < 1e-12",
        "hint": "grid.best_score_"
      },
      {
        "label": "4단계 최종 모델의 테스트 정확도",
        "expr": "abs(test_acc - grid.best_estimator_.score(X_test, y_test)) < 1e-12",
        "hint": "grid.score(X_test, y_test)  (best_estimator_로 예측)"
      }
    ]
  },
  {
    "id": "35-3",
    "unit": 35,
    "domain": "general",
    "title": "층화 K-fold와 F1 점수",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "StratifiedKFold(n_splits, shuffle, random_state)",
        "클래스 비율을 유지하는 분할"
      ],
      [
        "scoring='f1'",
        "정확도 대신 F1로 평가"
      ],
      [
        "make_pipeline(StandardScaler(), LogisticRegression())",
        "스케일링 포함 모델"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>구독 해지 데이터로 로지스틱 회귀를 평가합니다. 해지 고객이 적으므로 층화 분할을 쓰고, 정확도와 F1을 함께 봅니다.</p>\n<ol><li><code>cv</code>: 5겹, 섞기, random_state=0 인 StratifiedKFold</li><li><code>acc</code>: 정확도 평균</li><li><code>f1</code>: F1 평균 (scoring=&#x27;f1&#x27;)</li><li><code>pos_rate</code>: 전체 해지 비율</li></ol>",
    "starter": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import StratifiedKFold, cross_val_score\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression())\n\n# 1. 5겹, 섞기, random_state=0 인 StratifiedKFold\ncv = \n# 2. 정확도 평균\nacc = \n# 3. F1 평균 (scoring='f1')\nf1 = \n# 4. 전체 해지 비율\npos_rate = \n\nprint(round(acc, 3), round(f1, 3), round(pos_rate, 3))\n",
    "solution": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import StratifiedKFold, cross_val_score\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression())\n\n# 1. 5겹, 섞기, random_state=0 인 StratifiedKFold\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)\n# 2. 정확도 평균\nacc = float(cross_val_score(model, X, y, cv=cv).mean())\n# 3. F1 평균 (scoring='f1')\nf1 = float(cross_val_score(model, X, y, cv=cv, scoring='f1').mean())\n# 4. 전체 해지 비율\npos_rate = float(y.mean())\n\nprint(round(acc, 3), round(f1, 3), round(pos_rate, 3))\n",
    "hints": [
      "StratifiedKFold(n_splits=5, shuffle=True, random_state=0)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 5겹, 섞기, random_state=0 인 StratifiedKFold",
        "expr": "cv.get_n_splits() == 5 and cv.shuffle and cv.random_state == 0",
        "hint": "StratifiedKFold(n_splits=5, shuffle=True, random_state=0)"
      },
      {
        "label": "2단계 정확도 평균",
        "expr": "abs(acc - cross_val_score(model, X, y, cv=cv).mean()) < 1e-9",
        "hint": "cross_val_score(model, X, y, cv=cv).mean()"
      },
      {
        "label": "3단계 F1 평균 (scoring='f1')",
        "expr": "abs(f1 - cross_val_score(model, X, y, cv=cv, scoring='f1').mean()) < 1e-9",
        "hint": "cross_val_score(model, X, y, cv=cv, scoring='f1').mean()"
      },
      {
        "label": "4단계 전체 해지 비율",
        "expr": "abs(pos_rate - 0.2) < 1e-06",
        "hint": "y.mean()"
      }
    ]
  },
  {
    "id": "35-4",
    "unit": 35,
    "domain": "general",
    "title": "K를 바꿔 가며 검증 곡선 그리기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "KNeighborsClassifier(n_neighbors=k)",
        "가장 가까운 k명의 투표"
      ],
      [
        "for k in ks",
        "후보마다 교차검증"
      ],
      [
        "ks[np.argmax(점수)]",
        "가장 좋은 k"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>구독 해지 데이터로 KNN의 이웃 수 k를 1, 3, 5, 9, 15, 25로 바꿔 5-fold 교차검증 정확도를 비교합니다. k가 작으면 과적합, 너무 크면 과소적합입니다.</p>\n<ol><li><code>cv_means</code>: k마다 5-fold 평균 정확도 리스트 (StandardScaler 포함 파이프라인)</li><li><code>best_k</code>: 가장 좋은 k</li><li><code>train_k1</code>: k=1 모델의 학습 데이터 정확도 (전체 X로 fit 후 X로 score)</li></ol>",
    "starter": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\n\nks = [1, 3, 5, 9, 15, 25]\n\n# 1. k마다 5-fold 평균 정확도 리스트 (StandardScaler 포함 파이프라인)\ncv_means = \n# 2. 가장 좋은 k\nbest_k = \n# 3. k=1 모델의 학습 데이터 정확도 (전체 X로 fit 후 X로 score)\ntrain_k1 = \n\nfor k, s in zip(ks, cv_means):\n    print(k, round(s, 3))\nprint('best', best_k, 'train k=1', train_k1)\n",
    "solution": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\n\nks = [1, 3, 5, 9, 15, 25]\n\n# 1. k마다 5-fold 평균 정확도 리스트 (StandardScaler 포함 파이프라인)\ncv_means = [cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k)), X, y, cv=5).mean() for k in ks]\n# 2. 가장 좋은 k\nbest_k = ks[int(np.argmax(cv_means))]\n# 3. k=1 모델의 학습 데이터 정확도 (전체 X로 fit 후 X로 score)\ntrain_k1 = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=1)).fit(X, y).score(X, y)\n\nfor k, s in zip(ks, cv_means):\n    print(k, round(s, 3))\nprint('best', best_k, 'train k=1', train_k1)\n",
    "hints": [
      "리스트 컴프리헨션으로 ks를 돌며 cross_val_score(...).mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 k마다 5-fold 평균 정확도 리스트 (StandardScaler 포함 파이프라인)",
        "expr": "len(cv_means) == 6 and np.allclose(cv_means, [cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k)), X, y, cv=5).mean() for k in ks])",
        "hint": "리스트 컴프리헨션으로 ks를 돌며 cross_val_score(...).mean()"
      },
      {
        "label": "2단계 가장 좋은 k",
        "expr": "best_k == ks[int(np.argmax(cv_means))]",
        "hint": "ks[int(np.argmax(cv_means))]"
      },
      {
        "label": "3단계 k=1 모델의 학습 데이터 정확도 (전체 X로 fit 후 X로 score)",
        "expr": "train_k1 == 1.0",
        "hint": "자기 자신이 가장 가까운 이웃이라 1.0이 나옵니다."
      }
    ]
  },
  {
    "id": "36-1",
    "unit": 36,
    "domain": "mfg",
    "title": "스케일러는 학습 데이터로만 fit",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "StandardScaler().fit(X_train)",
        "학습 데이터의 평균·표준편차 기억"
      ],
      [
        ".transform(X_test)",
        "같은 기준으로 테스트 변환"
      ],
      [
        ".mean_ / .scale_",
        "기억한 평균과 표준편차"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>온도와 전류밀도는 단위가 달라 거리·계수 기반 모델에 그대로 넣기 어렵습니다. 학습 데이터 기준으로 표준화합니다.</p>\n<ol><li><code>scaler</code>: X_train으로 fit 한 StandardScaler</li><li><code>Xs_train</code>: 변환한 학습 데이터</li><li><code>Xs_test</code>: 같은 scaler로 변환한 테스트 데이터</li><li><code>test_mean</code>: 변환된 테스트 데이터의 열 평균 (0이 아닐 수 있음)</li></ol>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. X_train으로 fit 한 StandardScaler\nscaler = \n# 2. 변환한 학습 데이터\nXs_train = \n# 3. 같은 scaler로 변환한 테스트 데이터\nXs_test = \n# 4. 변환된 테스트 데이터의 열 평균 (0이 아닐 수 있음)\ntest_mean = \n\nprint(scaler.mean_.round(3), scaler.scale_.round(3))\nprint(test_mean.round(3))\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. X_train으로 fit 한 StandardScaler\nscaler = StandardScaler().fit(X_train)\n# 2. 변환한 학습 데이터\nXs_train = scaler.transform(X_train)\n# 3. 같은 scaler로 변환한 테스트 데이터\nXs_test = scaler.transform(X_test)\n# 4. 변환된 테스트 데이터의 열 평균 (0이 아닐 수 있음)\ntest_mean = Xs_test.mean(axis=0)\n\nprint(scaler.mean_.round(3), scaler.scale_.round(3))\nprint(test_mean.round(3))\n",
    "hints": [
      "StandardScaler().fit(X_train)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 X_train으로 fit 한 StandardScaler",
        "expr": "np.allclose(scaler.mean_, X_train.mean(axis=0))",
        "hint": "StandardScaler().fit(X_train)"
      },
      {
        "label": "2단계 변환한 학습 데이터",
        "expr": "np.allclose(Xs_train.mean(axis=0), 0, atol=1e-9) and np.allclose(Xs_train.std(axis=0), 1)",
        "hint": "scaler.transform(X_train)"
      },
      {
        "label": "3단계 같은 scaler로 변환한 테스트 데이터",
        "expr": "np.allclose(Xs_test, (X_test - X_train.mean(axis=0)) / X_train.std(axis=0))",
        "hint": "scaler.transform(X_test)  (다시 fit 하지 않습니다)"
      },
      {
        "label": "4단계 변환된 테스트 데이터의 열 평균 (0이 아닐 수 있음)",
        "expr": "np.allclose(test_mean, ((X_test - X_train.mean(axis=0)) / X_train.std(axis=0)).mean(axis=0))",
        "hint": "Xs_test.mean(axis=0)"
      }
    ]
  },
  {
    "id": "36-2",
    "unit": 36,
    "domain": "mfg",
    "title": "라인(범주)을 원-핫 인코딩해 모델에 넣기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "ColumnTransformer([(이름, 변환기, 열들), ...])",
        "열마다 다른 전처리"
      ],
      [
        "OneHotEncoder(handle_unknown='ignore')",
        "범주 → 0/1 열"
      ],
      [
        "make_pipeline(전처리, 모델)",
        "전처리와 모델을 한 덩어리로"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p><code>df</code>에 숫자 열(temp, current)과 범주 열(line)이 섞여 있습니다. 숫자는 표준화, 범주는 원-핫 인코딩한 뒤 로지스틱 회귀로 불량을 예측합니다.</p>\n<ol><li><code>pre</code>: 숫자 열은 StandardScaler, line은 OneHotEncoder(handle_unknown=&#x27;ignore&#x27;)인 ColumnTransformer</li><li><code>model</code>: pre와 LogisticRegression()을 이은 파이프라인 (X_train으로 fit)</li><li><code>n_features</code>: 전처리 후 열 개수</li><li><code>test_acc</code>: 테스트 정확도</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\n# 도금 공정 120개 로트: 온도, 전류밀도, 라인(A/B/C), 불량 여부\ni = np.arange(120)\ndf = pd.DataFrame({\n    'temp': 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91),\n    'current': 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71),\n    'line': np.array(['A', 'B', 'C'])[i % 3],\n})\nscore = (df['temp'] - 52) / 4 + (df['current'] - 3.0) / 0.6 + 0.6 * (df['line'] == 'C') + 0.7 * np.sin(i * 3.33)\ndf['defect'] = (score > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.linear_model import LogisticRegression\n\nX = df[['temp', 'current', 'line']]\ny = df['defect']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 숫자 열은 StandardScaler, line은 OneHotEncoder(handle_unknown='ignore')인 ColumnTransformer\npre = \n# 2. pre와 LogisticRegression()을 이은 파이프라인 (X_train으로 fit)\nmodel = \n# 3. 전처리 후 열 개수\nn_features = \n# 4. 테스트 정확도\ntest_acc = \n\nprint(n_features, round(test_acc, 3))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\n# 도금 공정 120개 로트: 온도, 전류밀도, 라인(A/B/C), 불량 여부\ni = np.arange(120)\ndf = pd.DataFrame({\n    'temp': 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91),\n    'current': 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71),\n    'line': np.array(['A', 'B', 'C'])[i % 3],\n})\nscore = (df['temp'] - 52) / 4 + (df['current'] - 3.0) / 0.6 + 0.6 * (df['line'] == 'C') + 0.7 * np.sin(i * 3.33)\ndf['defect'] = (score > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.linear_model import LogisticRegression\n\nX = df[['temp', 'current', 'line']]\ny = df['defect']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 숫자 열은 StandardScaler, line은 OneHotEncoder(handle_unknown='ignore')인 ColumnTransformer\npre = ColumnTransformer([('num', StandardScaler(), ['temp', 'current']), ('cat', OneHotEncoder(handle_unknown='ignore'), ['line'])])\n# 2. pre와 LogisticRegression()을 이은 파이프라인 (X_train으로 fit)\nmodel = make_pipeline(pre, LogisticRegression()).fit(X_train, y_train)\n# 3. 전처리 후 열 개수\nn_features = model[0].transform(X_train).shape[1]\n# 4. 테스트 정확도\ntest_acc = float(model.score(X_test, y_test))\n\nprint(n_features, round(test_acc, 3))\n",
    "hints": [
      "ColumnTransformer([('num', StandardScaler(), [...]), ('cat', OneHotEncoder(handle_unknown='ignore'), ['line'])])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 숫자 열은 StandardScaler, line은 OneHotEncoder(handle_unknown='ignore')인 ColumnTransformer",
        "expr": "len(pre.transformers) == 2",
        "hint": "ColumnTransformer([('num', StandardScaler(), [...]), ('cat', OneHotEncoder(handle_unknown='ignore'), ['line'])])"
      },
      {
        "label": "2단계 pre와 LogisticRegression()을 이은 파이프라인 (X_train으로 fit)",
        "expr": "hasattr(model, 'predict')",
        "hint": "make_pipeline(pre, LogisticRegression()).fit(X_train, y_train)"
      },
      {
        "label": "3단계 전처리 후 열 개수",
        "expr": "n_features == 5",
        "hint": "model[0].transform(X_train).shape[1]  (숫자 2 + 라인 3)"
      },
      {
        "label": "4단계 테스트 정확도",
        "expr": "abs(test_acc - model.score(X_test, y_test)) < 1e-12 and test_acc >= 0.7",
        "hint": "model.score(X_test, y_test)"
      }
    ]
  },
  {
    "id": "36-3",
    "unit": 36,
    "domain": "general",
    "title": "요금제를 원-핫으로 펼쳐 보기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.get_dummies(df, columns=[...])",
        "pandas로 원-핫"
      ],
      [
        "OneHotEncoder().fit(...)",
        "scikit-learn으로 원-핫"
      ],
      [
        ".categories_",
        "인코더가 기억한 범주"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>구독 고객 데이터 <code>df</code>의 <code>plan</code> 열(basic, standard, premium)을 원-핫으로 바꿉니다. 모델에는 학습 때 본 범주를 기억하는 OneHotEncoder가 안전합니다.</p>\n<ol><li><code>dummies</code>: plan을 원-핫으로 펼친 DataFrame (pd.get_dummies, dtype=int)</li><li><code>enc</code>: plan 열로 fit 한 OneHotEncoder(handle_unknown=&#x27;ignore&#x27;)</li><li><code>new</code>: 처음 보는 요금제 &#x27;vip&#x27;를 변환한 결과 (리스트)</li><li><code>churn_by_plan</code>: 요금제별 해지율 Series</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\n# 구독 고객 120명: 이용시간, 문의 수, 요금제, 해지 여부\ni = np.arange(120)\ndf = pd.DataFrame({\n    'hours': 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73),\n    'calls': 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37),\n    'plan': np.array(['basic', 'standard', 'premium'])[i % 3],\n})\nscore = -(df['hours'] - 20) / 8 + (df['calls'] - 2.0) / 1.5 + 0.6 * (df['plan'] == 'basic') + 0.7 * np.sin(i * 3.11)\ndf['churn'] = (score > 1.0).astype(int)\nfrom sklearn.preprocessing import OneHotEncoder\n\n# 1. plan을 원-핫으로 펼친 DataFrame (pd.get_dummies, dtype=int)\ndummies = \n# 2. plan 열로 fit 한 OneHotEncoder(handle_unknown='ignore')\nenc = \n# 3. 처음 보는 요금제 'vip'를 변환한 결과 (리스트)\nnew = \n# 4. 요금제별 해지율 Series\nchurn_by_plan = \n\nprint(dummies.head(3))\nprint(enc.categories_, new)\nprint(churn_by_plan.round(3))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\n# 구독 고객 120명: 이용시간, 문의 수, 요금제, 해지 여부\ni = np.arange(120)\ndf = pd.DataFrame({\n    'hours': 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73),\n    'calls': 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37),\n    'plan': np.array(['basic', 'standard', 'premium'])[i % 3],\n})\nscore = -(df['hours'] - 20) / 8 + (df['calls'] - 2.0) / 1.5 + 0.6 * (df['plan'] == 'basic') + 0.7 * np.sin(i * 3.11)\ndf['churn'] = (score > 1.0).astype(int)\nfrom sklearn.preprocessing import OneHotEncoder\n\n# 1. plan을 원-핫으로 펼친 DataFrame (pd.get_dummies, dtype=int)\ndummies = pd.get_dummies(df, columns=['plan'], dtype=int)\n# 2. plan 열로 fit 한 OneHotEncoder(handle_unknown='ignore')\nenc = OneHotEncoder(handle_unknown='ignore').fit(df[['plan']])\n# 3. 처음 보는 요금제 'vip'를 변환한 결과 (리스트)\nnew = enc.transform(pd.DataFrame({'plan': ['vip']})).toarray().tolist()\n# 4. 요금제별 해지율 Series\nchurn_by_plan = df.groupby('plan')['churn'].mean()\n\nprint(dummies.head(3))\nprint(enc.categories_, new)\nprint(churn_by_plan.round(3))\n",
    "hints": [
      "pd.get_dummies(df, columns=['plan'], dtype=int)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 plan을 원-핫으로 펼친 DataFrame (pd.get_dummies, dtype=int)",
        "expr": "sorted(c for c in dummies.columns if c.startswith('plan_')) == ['plan_basic', 'plan_premium', 'plan_standard'] and len(dummies) == 120",
        "hint": "pd.get_dummies(df, columns=['plan'], dtype=int)"
      },
      {
        "label": "2단계 plan 열로 fit 한 OneHotEncoder(handle_unknown='ignore')",
        "expr": "list(enc.categories_[0]) == ['basic', 'premium', 'standard']",
        "hint": "OneHotEncoder(handle_unknown='ignore').fit(df[['plan']])  (2차원으로 넣습니다)"
      },
      {
        "label": "3단계 처음 보는 요금제 'vip'를 변환한 결과 (리스트)",
        "expr": "new == [[0.0, 0.0, 0.0]]",
        "hint": "enc.transform(pd.DataFrame({'plan': ['vip']})).toarray().tolist()"
      },
      {
        "label": "4단계 요금제별 해지율 Series",
        "expr": "churn_by_plan.index.tolist() == ['basic', 'premium', 'standard'] and np.allclose(churn_by_plan.values.astype(float), [0.425, 0.175, 0.225], atol=1e-4, equal_nan=True)",
        "hint": "df.groupby('plan')['churn'].mean()"
      }
    ]
  },
  {
    "id": "36-4",
    "unit": 36,
    "domain": "general",
    "title": "전처리부터 모델까지 한 파이프라인으로 교차검증",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "ColumnTransformer",
        "열별 전처리"
      ],
      [
        "Pipeline 전체를 cross_val_score에",
        "폴드마다 전처리도 다시 fit → 누수 없음"
      ],
      [
        "RandomForestClassifier",
        "비교 모델"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>구독 고객 데이터로 전처리 + 모델 파이프라인을 만들고 5-fold 교차검증합니다. 파이프라인째 넣어야 폴드마다 스케일러가 학습 폴드로만 fit 됩니다.</p>\n<ol><li><code>pre</code>: hours·calls는 표준화, plan은 원-핫(handle_unknown=&#x27;ignore&#x27;)</li><li><code>pipe</code>: pre + LogisticRegression() 파이프라인</li><li><code>cv_acc</code>: 5-fold 평균 정확도</li><li><code>cv_acc_num</code>: plan 없이 hours, calls만 쓴 같은 파이프라인의 5-fold 평균 정확도</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\n# 구독 고객 120명: 이용시간, 문의 수, 요금제, 해지 여부\ni = np.arange(120)\ndf = pd.DataFrame({\n    'hours': 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73),\n    'calls': 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37),\n    'plan': np.array(['basic', 'standard', 'premium'])[i % 3],\n})\nscore = -(df['hours'] - 20) / 8 + (df['calls'] - 2.0) / 1.5 + 0.6 * (df['plan'] == 'basic') + 0.7 * np.sin(i * 3.11)\ndf['churn'] = (score > 1.0).astype(int)\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nX = df[['hours', 'calls', 'plan']]\ny = df['churn']\n\n# 1. hours·calls는 표준화, plan은 원-핫(handle_unknown='ignore')\npre = \n# 2. pre + LogisticRegression() 파이프라인\npipe = \n# 3. 5-fold 평균 정확도\ncv_acc = \n# 4. plan 없이 hours, calls만 쓴 같은 파이프라인의 5-fold 평균 정확도\ncv_acc_num = \n\nprint('with plan', round(cv_acc, 3), '| numeric only', round(cv_acc_num, 3))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\n# 구독 고객 120명: 이용시간, 문의 수, 요금제, 해지 여부\ni = np.arange(120)\ndf = pd.DataFrame({\n    'hours': 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73),\n    'calls': 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37),\n    'plan': np.array(['basic', 'standard', 'premium'])[i % 3],\n})\nscore = -(df['hours'] - 20) / 8 + (df['calls'] - 2.0) / 1.5 + 0.6 * (df['plan'] == 'basic') + 0.7 * np.sin(i * 3.11)\ndf['churn'] = (score > 1.0).astype(int)\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nX = df[['hours', 'calls', 'plan']]\ny = df['churn']\n\n# 1. hours·calls는 표준화, plan은 원-핫(handle_unknown='ignore')\npre = ColumnTransformer([('num', StandardScaler(), ['hours', 'calls']), ('cat', OneHotEncoder(handle_unknown='ignore'), ['plan'])])\n# 2. pre + LogisticRegression() 파이프라인\npipe = make_pipeline(pre, LogisticRegression())\n# 3. 5-fold 평균 정확도\ncv_acc = float(cross_val_score(pipe, X, y, cv=5).mean())\n# 4. plan 없이 hours, calls만 쓴 같은 파이프라인의 5-fold 평균 정확도\ncv_acc_num = float(cross_val_score(make_pipeline(StandardScaler(), LogisticRegression()), X[['hours', 'calls']], y, cv=5).mean())\n\nprint('with plan', round(cv_acc, 3), '| numeric only', round(cv_acc_num, 3))\n",
    "hints": [
      "ColumnTransformer([('num', ...), ('cat', ...)])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 hours·calls는 표준화, plan은 원-핫(handle_unknown='ignore')",
        "expr": "len(pre.transformers) == 2",
        "hint": "ColumnTransformer([('num', ...), ('cat', ...)])"
      },
      {
        "label": "2단계 pre + LogisticRegression() 파이프라인",
        "expr": "len(pipe.steps) == 2",
        "hint": "make_pipeline(pre, LogisticRegression())"
      },
      {
        "label": "3단계 5-fold 평균 정확도",
        "expr": "abs(cv_acc - cross_val_score(pipe, X, y, cv=5).mean()) < 1e-9",
        "hint": "cross_val_score(pipe, X, y, cv=5).mean()"
      },
      {
        "label": "4단계 plan 없이 hours, calls만 쓴 같은 파이프라인의 5-fold 평균 정확도",
        "expr": "abs(cv_acc_num - cross_val_score(make_pipeline(StandardScaler(), LogisticRegression()), X[['hours', 'calls']], y, cv=5).mean()) < 1e-9",
        "hint": "make_pipeline(StandardScaler(), LogisticRegression())에 X[['hours', 'calls']]"
      }
    ]
  },
  {
    "id": "37-1",
    "unit": 37,
    "domain": "mfg",
    "title": "설비 운전 패턴을 K-means로 묶기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "StandardScaler().fit_transform(X)",
        "단위 맞추기"
      ],
      [
        "KMeans(n_clusters, n_init=10, random_state=0)",
        "군집 모델"
      ],
      [
        ".labels_ / .cluster_centers_ / .inertia_",
        "군집 번호 · 중심 · 군집 내 제곱합"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>설비 90대의 진동과 소비전력입니다. 정답(라벨) 없이 비슷한 운전 패턴끼리 3개 군집으로 묶습니다.</p>\n<ol><li><code>Xs</code>: 표준화한 X</li><li><code>km</code>: Xs로 fit 한 KMeans (n_clusters=3, n_init=10, random_state=0)</li><li><code>sizes</code>: 군집별 설비 수 (작은 것부터 정렬한 리스트)</li><li><code>vib_means</code>: 군집별 원래 진동 평균 (작은 것부터 정렬)</li></ol>",
    "starter": "import numpy as np\n\n# 설비 90대의 진동(mm/s)과 소비전력(kW). 운전 패턴이 몇 가지인지 모른다.\ni = np.arange(90)\ng = i % 3\nvib = np.array([2.0, 4.5, 3.2])[g] + 0.35 * np.sin(i * 1.7)\npower = np.array([11.0, 12.5, 15.5])[g] + 0.5 * np.cos(i * 2.3)\nX = np.column_stack([vib, power])\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\n# 1. 표준화한 X\nXs = \n# 2. Xs로 fit 한 KMeans (n_clusters=3, n_init=10, random_state=0)\nkm = \n# 3. 군집별 설비 수 (작은 것부터 정렬한 리스트)\nsizes = \n# 4. 군집별 원래 진동 평균 (작은 것부터 정렬)\nvib_means = \n\nprint(sizes, [round(v, 2) for v in vib_means], round(km.inertia_, 2))\n",
    "solution": "import numpy as np\n\n# 설비 90대의 진동(mm/s)과 소비전력(kW). 운전 패턴이 몇 가지인지 모른다.\ni = np.arange(90)\ng = i % 3\nvib = np.array([2.0, 4.5, 3.2])[g] + 0.35 * np.sin(i * 1.7)\npower = np.array([11.0, 12.5, 15.5])[g] + 0.5 * np.cos(i * 2.3)\nX = np.column_stack([vib, power])\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\n# 1. 표준화한 X\nXs = StandardScaler().fit_transform(X)\n# 2. Xs로 fit 한 KMeans (n_clusters=3, n_init=10, random_state=0)\nkm = KMeans(n_clusters=3, n_init=10, random_state=0).fit(Xs)\n# 3. 군집별 설비 수 (작은 것부터 정렬한 리스트)\nsizes = sorted(np.bincount(km.labels_).tolist())\n# 4. 군집별 원래 진동 평균 (작은 것부터 정렬)\nvib_means = sorted(float(X[km.labels_ == k, 0].mean()) for k in range(3))\n\nprint(sizes, [round(v, 2) for v in vib_means], round(km.inertia_, 2))\n",
    "hints": [
      "StandardScaler().fit_transform(X)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 표준화한 X",
        "expr": "np.allclose(Xs.mean(axis=0), 0, atol=1e-9)",
        "hint": "StandardScaler().fit_transform(X)"
      },
      {
        "label": "2단계 Xs로 fit 한 KMeans (n_clusters=3, n_init=10, random_state=0)",
        "expr": "km.n_clusters == 3 and len(km.labels_) == 90",
        "hint": "KMeans(n_clusters=3, n_init=10, random_state=0).fit(Xs)"
      },
      {
        "label": "3단계 군집별 설비 수 (작은 것부터 정렬한 리스트)",
        "expr": "sizes == [30, 30, 30]",
        "hint": "sorted(np.bincount(km.labels_).tolist())"
      },
      {
        "label": "4단계 군집별 원래 진동 평균 (작은 것부터 정렬)",
        "expr": "np.allclose(vib_means, sorted(X[km.labels_ == k, 0].mean() for k in range(3))) and vib_means[0] < 2.5 and vib_means[2] > 4",
        "hint": "sorted(X[km.labels_ == k, 0].mean() for k in range(3))"
      }
    ]
  },
  {
    "id": "37-2",
    "unit": 37,
    "domain": "mfg",
    "title": "엘보와 실루엣으로 k 고르기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "km.inertia_",
        "군집 내 제곱합 (k가 커질수록 작아짐)"
      ],
      [
        "silhouette_score(X, labels)",
        "군집이 얼마나 잘 갈라졌나 (−1~1)"
      ],
      [
        "ks[np.argmax(...)]",
        "가장 좋은 k"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>같은 설비 데이터에서 k를 2~6으로 바꿔 inertia와 실루엣 점수를 비교합니다.</p>\n<ol><li><code>models</code>: k마다 fit 한 KMeans 리스트 (n_init=10, random_state=0)</li><li><code>inertias</code>: k마다 inertia 리스트</li><li><code>sils</code>: k마다 실루엣 점수 리스트</li><li><code>best_k</code>: 실루엣이 가장 높은 k</li></ol>",
    "starter": "import numpy as np\n\n# 설비 90대의 진동(mm/s)과 소비전력(kW). 운전 패턴이 몇 가지인지 모른다.\ni = np.arange(90)\ng = i % 3\nvib = np.array([2.0, 4.5, 3.2])[g] + 0.35 * np.sin(i * 1.7)\npower = np.array([11.0, 12.5, 15.5])[g] + 0.5 * np.cos(i * 2.3)\nX = np.column_stack([vib, power])\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\n\nXs = StandardScaler().fit_transform(X)\nks = [2, 3, 4, 5, 6]\n\n# 1. k마다 fit 한 KMeans 리스트 (n_init=10, random_state=0)\nmodels = \n# 2. k마다 inertia 리스트\ninertias = \n# 3. k마다 실루엣 점수 리스트\nsils = \n# 4. 실루엣이 가장 높은 k\nbest_k = \n\nfor k, a, s in zip(ks, inertias, sils):\n    print(k, round(a, 2), round(s, 3))\nprint('best', best_k)\n",
    "solution": "import numpy as np\n\n# 설비 90대의 진동(mm/s)과 소비전력(kW). 운전 패턴이 몇 가지인지 모른다.\ni = np.arange(90)\ng = i % 3\nvib = np.array([2.0, 4.5, 3.2])[g] + 0.35 * np.sin(i * 1.7)\npower = np.array([11.0, 12.5, 15.5])[g] + 0.5 * np.cos(i * 2.3)\nX = np.column_stack([vib, power])\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\n\nXs = StandardScaler().fit_transform(X)\nks = [2, 3, 4, 5, 6]\n\n# 1. k마다 fit 한 KMeans 리스트 (n_init=10, random_state=0)\nmodels = [KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs) for k in ks]\n# 2. k마다 inertia 리스트\ninertias = [m.inertia_ for m in models]\n# 3. k마다 실루엣 점수 리스트\nsils = [silhouette_score(Xs, m.labels_) for m in models]\n# 4. 실루엣이 가장 높은 k\nbest_k = ks[int(np.argmax(sils))]\n\nfor k, a, s in zip(ks, inertias, sils):\n    print(k, round(a, 2), round(s, 3))\nprint('best', best_k)\n",
    "hints": [
      "[KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs) for k in ks]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 k마다 fit 한 KMeans 리스트 (n_init=10, random_state=0)",
        "expr": "[m.n_clusters for m in models] == ks",
        "hint": "[KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs) for k in ks]"
      },
      {
        "label": "2단계 k마다 inertia 리스트",
        "expr": "np.allclose(inertias, [m.inertia_ for m in models]) and all(a >= b for a, b in zip(inertias, inertias[1:]))",
        "hint": "[m.inertia_ for m in models]"
      },
      {
        "label": "3단계 k마다 실루엣 점수 리스트",
        "expr": "np.allclose(sils, [silhouette_score(Xs, m.labels_) for m in models])",
        "hint": "[silhouette_score(Xs, m.labels_) for m in models]"
      },
      {
        "label": "4단계 실루엣이 가장 높은 k",
        "expr": "best_k == 3",
        "hint": "ks[int(np.argmax(sils))]"
      }
    ]
  },
  {
    "id": "37-3",
    "unit": 37,
    "domain": "general",
    "title": "회원 행동 4가지를 PCA로 요약",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "PCA().fit(Xs)",
        "주성분 분석"
      ],
      [
        ".explained_variance_ratio_",
        "주성분마다 설명하는 분산 비율"
      ],
      [
        "np.cumsum",
        "누적 비율"
      ],
      [
        ".components_",
        "주성분 방향(각 열의 가중치)"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>회원 100명의 방문 수, 이용 시간, 주문 수, 리뷰 수입니다. 앞의 세 지표는 함께 움직입니다. 표준화 후 PCA로 몇 개의 축이면 충분한지 봅니다.</p>\n<ol><li><code>Xs</code>: 표준화한 df</li><li><code>pca</code>: Xs로 fit 한 PCA()</li><li><code>ratio</code>: 설명 분산 비율 배열</li><li><code>cum</code>: 누적 설명 분산 비율</li><li><code>n90</code>: 누적 90% 이상이 되는 최소 주성분 수</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\n# 회원 100명의 월간 행동 4가지. 서로 상관이 높다.\ni = np.arange(100)\nbase = np.sin(i * 0.37) + 0.5 * np.cos(i * 1.13)\ndf = pd.DataFrame({\n    'visits': 10 + 4 * base + 0.8 * np.sin(i * 2.1),\n    'minutes': 60 + 25 * base + 6 * np.cos(i * 1.7),\n    'orders': 3 + 1.2 * base + 0.5 * np.sin(i * 2.9),\n    'reviews': 1 + 0.3 * np.cos(i * 0.71) + 0.4 * np.sin(i * 3.7),\n})\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\n\n# 1. 표준화한 df\nXs = \n# 2. Xs로 fit 한 PCA()\npca = \n# 3. 설명 분산 비율 배열\nratio = \n# 4. 누적 설명 분산 비율\ncum = \n# 5. 누적 90% 이상이 되는 최소 주성분 수\nn90 = \n\nprint(ratio.round(3), cum.round(3), n90)\nprint(pd.DataFrame(pca.components_[:2], columns=df.columns).round(2))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\n# 회원 100명의 월간 행동 4가지. 서로 상관이 높다.\ni = np.arange(100)\nbase = np.sin(i * 0.37) + 0.5 * np.cos(i * 1.13)\ndf = pd.DataFrame({\n    'visits': 10 + 4 * base + 0.8 * np.sin(i * 2.1),\n    'minutes': 60 + 25 * base + 6 * np.cos(i * 1.7),\n    'orders': 3 + 1.2 * base + 0.5 * np.sin(i * 2.9),\n    'reviews': 1 + 0.3 * np.cos(i * 0.71) + 0.4 * np.sin(i * 3.7),\n})\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\n\n# 1. 표준화한 df\nXs = StandardScaler().fit_transform(df)\n# 2. Xs로 fit 한 PCA()\npca = PCA().fit(Xs)\n# 3. 설명 분산 비율 배열\nratio = pca.explained_variance_ratio_\n# 4. 누적 설명 분산 비율\ncum = np.cumsum(ratio)\n# 5. 누적 90% 이상이 되는 최소 주성분 수\nn90 = int(np.argmax(cum >= 0.9) + 1)\n\nprint(ratio.round(3), cum.round(3), n90)\nprint(pd.DataFrame(pca.components_[:2], columns=df.columns).round(2))\n",
    "hints": [
      "StandardScaler().fit_transform(df)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 표준화한 df",
        "expr": "Xs.shape == (100, 4)",
        "hint": "StandardScaler().fit_transform(df)"
      },
      {
        "label": "2단계 Xs로 fit 한 PCA()",
        "expr": "len(pca.explained_variance_ratio_) == 4",
        "hint": "PCA().fit(Xs)"
      },
      {
        "label": "3단계 설명 분산 비율 배열",
        "expr": "np.allclose(ratio, [0.71733803, 0.24965057, 0.02411129, 0.00890011], atol=1e-6)",
        "hint": "pca.explained_variance_ratio_"
      },
      {
        "label": "4단계 누적 설명 분산 비율",
        "expr": "np.allclose(cum, [0.71733803, 0.9669886, 0.99109989, 1.0], atol=1e-6)",
        "hint": "np.cumsum(ratio)"
      },
      {
        "label": "5단계 누적 90% 이상이 되는 최소 주성분 수",
        "expr": "n90 == 2",
        "hint": "int(np.argmax(cum >= 0.9) + 1)"
      }
    ]
  },
  {
    "id": "37-4",
    "unit": 37,
    "domain": "general",
    "title": "고객 세그먼트 만들고 군집별 특징 읽기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "KMeans(...).fit_predict(Xs)",
        "학습과 군집 번호를 한 번에"
      ],
      [
        "df.assign(cluster=...)",
        "군집 열 붙이기"
      ],
      [
        "groupby('cluster').mean()",
        "군집별 평균으로 특징 읽기"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>같은 회원 데이터에서 방문 수와 이용 시간만 써서 3개 세그먼트로 나누고, 세그먼트별 평균으로 특징을 읽습니다.</p>\n<ol><li><code>labels</code>: fit_predict로 얻은 군집 번호 (n_clusters=3, n_init=10, random_state=0)</li><li><code>seg</code>: cluster 열을 붙인 DataFrame</li><li><code>profile</code>: 군집별 네 지표 평균 DataFrame</li><li><code>heavy</code>: 평균 이용 시간(minutes)이 가장 긴 군집 번호</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\n# 회원 100명의 월간 행동 4가지. 서로 상관이 높다.\ni = np.arange(100)\nbase = np.sin(i * 0.37) + 0.5 * np.cos(i * 1.13)\ndf = pd.DataFrame({\n    'visits': 10 + 4 * base + 0.8 * np.sin(i * 2.1),\n    'minutes': 60 + 25 * base + 6 * np.cos(i * 1.7),\n    'orders': 3 + 1.2 * base + 0.5 * np.sin(i * 2.9),\n    'reviews': 1 + 0.3 * np.cos(i * 0.71) + 0.4 * np.sin(i * 3.7),\n})\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nXs = StandardScaler().fit_transform(df[['visits', 'minutes']])\n\n# 1. fit_predict로 얻은 군집 번호 (n_clusters=3, n_init=10, random_state=0)\nlabels = \n# 2. cluster 열을 붙인 DataFrame\nseg = \n# 3. 군집별 네 지표 평균 DataFrame\nprofile = \n# 4. 평균 이용 시간(minutes)이 가장 긴 군집 번호\nheavy = \n\nprint(profile.round(1))\nprint('heavy users =', heavy)\n",
    "solution": "import numpy as np\nimport pandas as pd\n\n# 회원 100명의 월간 행동 4가지. 서로 상관이 높다.\ni = np.arange(100)\nbase = np.sin(i * 0.37) + 0.5 * np.cos(i * 1.13)\ndf = pd.DataFrame({\n    'visits': 10 + 4 * base + 0.8 * np.sin(i * 2.1),\n    'minutes': 60 + 25 * base + 6 * np.cos(i * 1.7),\n    'orders': 3 + 1.2 * base + 0.5 * np.sin(i * 2.9),\n    'reviews': 1 + 0.3 * np.cos(i * 0.71) + 0.4 * np.sin(i * 3.7),\n})\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nXs = StandardScaler().fit_transform(df[['visits', 'minutes']])\n\n# 1. fit_predict로 얻은 군집 번호 (n_clusters=3, n_init=10, random_state=0)\nlabels = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Xs)\n# 2. cluster 열을 붙인 DataFrame\nseg = df.assign(cluster=labels)\n# 3. 군집별 네 지표 평균 DataFrame\nprofile = seg.groupby('cluster').mean()\n# 4. 평균 이용 시간(minutes)이 가장 긴 군집 번호\nheavy = int(profile['minutes'].idxmax())\n\nprint(profile.round(1))\nprint('heavy users =', heavy)\n",
    "hints": [
      "KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Xs)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 fit_predict로 얻은 군집 번호 (n_clusters=3, n_init=10, random_state=0)",
        "expr": "len(labels) == 100 and len(set(labels.tolist())) == 3",
        "hint": "KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Xs)"
      },
      {
        "label": "2단계 cluster 열을 붙인 DataFrame",
        "expr": "'cluster' in seg.columns and len(seg) == 100",
        "hint": "df.assign(cluster=labels)"
      },
      {
        "label": "3단계 군집별 네 지표 평균 DataFrame",
        "expr": "profile.shape == (3, 4)",
        "hint": "seg.groupby('cluster').mean()"
      },
      {
        "label": "4단계 평균 이용 시간(minutes)이 가장 긴 군집 번호",
        "expr": "heavy == int(seg.groupby('cluster')['minutes'].mean().idxmax())",
        "hint": "profile['minutes'].idxmax()"
      }
    ]
  },
  {
    "id": "38-1",
    "unit": 38,
    "domain": "mfg",
    "title": "정확도 94%의 함정",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "DummyClassifier(strategy='most_frequent')",
        "전부 다수 클래스로 예측"
      ],
      [
        "recall_score",
        "실제 불량 중 잡아낸 비율"
      ],
      [
        "y.mean()",
        "양성(불량) 비율"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>프레스 공정 데이터는 불량이 드뭅니다. 모두 정상이라고만 답하는 모델의 정확도와 재현율을 로지스틱 회귀와 비교합니다.</p>\n<ol><li><code>pos_rate</code>: 전체 불량 비율</li><li><code>dummy</code>: 학습 데이터로 fit 한 DummyClassifier(strategy=&#x27;most_frequent&#x27;)</li><li><code>dummy_acc</code>: 더미의 테스트 정확도</li><li><code>dummy_rec</code>: 더미의 테스트 재현율</li><li><code>lr_rec</code>: 표준화 + 로지스틱 회귀(기본 설정)의 테스트 재현율</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 프레스 공정 300개 로트: 압력, 온도 편차. 불량(1)은 드물다.\ni = np.arange(300)\npressure = 50 + 3 * np.sin(i * 0.31) + 1.2 * np.cos(i * 1.77)\ndtemp = 0.5 * np.cos(i * 0.47) + 0.3 * np.sin(i * 2.53)\nX = np.column_stack([pressure, dtemp])\nscore = (pressure - 50) / 3 + dtemp / 0.5 + 0.6 * np.sin(i * 3.41)\ny = (score > 1.75).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score, recall_score\n\n# 1. 전체 불량 비율\npos_rate = \n# 2. 학습 데이터로 fit 한 DummyClassifier(strategy='most_frequent')\ndummy = \n# 3. 더미의 테스트 정확도\ndummy_acc = \n# 4. 더미의 테스트 재현율\ndummy_rec = \n# 5. 표준화 + 로지스틱 회귀(기본 설정)의 테스트 재현율\nlr_rec = \n\nprint(round(pos_rate, 3), round(dummy_acc, 3), dummy_rec, round(lr_rec, 3))\n",
    "solution": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 프레스 공정 300개 로트: 압력, 온도 편차. 불량(1)은 드물다.\ni = np.arange(300)\npressure = 50 + 3 * np.sin(i * 0.31) + 1.2 * np.cos(i * 1.77)\ndtemp = 0.5 * np.cos(i * 0.47) + 0.3 * np.sin(i * 2.53)\nX = np.column_stack([pressure, dtemp])\nscore = (pressure - 50) / 3 + dtemp / 0.5 + 0.6 * np.sin(i * 3.41)\ny = (score > 1.75).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score, recall_score\n\n# 1. 전체 불량 비율\npos_rate = float(y.mean())\n# 2. 학습 데이터로 fit 한 DummyClassifier(strategy='most_frequent')\ndummy = DummyClassifier(strategy='most_frequent').fit(X_train, y_train)\n# 3. 더미의 테스트 정확도\ndummy_acc = float(accuracy_score(y_test, dummy.predict(X_test)))\n# 4. 더미의 테스트 재현율\ndummy_rec = float(recall_score(y_test, dummy.predict(X_test)))\n# 5. 표준화 + 로지스틱 회귀(기본 설정)의 테스트 재현율\nlr_rec = float(recall_score(y_test, make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train).predict(X_test)))\n\nprint(round(pos_rate, 3), round(dummy_acc, 3), dummy_rec, round(lr_rec, 3))\n",
    "hints": [
      "y.mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 전체 불량 비율",
        "expr": "abs(pos_rate - 0.056666666666666664) < 1e-06",
        "hint": "y.mean()"
      },
      {
        "label": "2단계 학습 데이터로 fit 한 DummyClassifier(strategy='most_frequent')",
        "expr": "(dummy.predict(X_test) == 0).all()",
        "hint": "DummyClassifier(strategy='most_frequent').fit(X_train, y_train)"
      },
      {
        "label": "3단계 더미의 테스트 정확도",
        "expr": "abs(dummy_acc - (y_test == 0).mean()) < 1e-12",
        "hint": "accuracy_score(y_test, dummy.predict(X_test))"
      },
      {
        "label": "4단계 더미의 테스트 재현율",
        "expr": "dummy_rec == 0.0",
        "hint": "recall_score(y_test, dummy.predict(X_test))"
      },
      {
        "label": "5단계 표준화 + 로지스틱 회귀(기본 설정)의 테스트 재현율",
        "expr": "abs(lr_rec - recall_score(y_test, make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train).predict(X_test))) < 1e-12",
        "hint": "make_pipeline(StandardScaler(), LogisticRegression()).fit(...).predict(X_test) 로 recall_score"
      }
    ]
  },
  {
    "id": "38-2",
    "unit": 38,
    "domain": "mfg",
    "title": "class_weight='balanced'로 소수 클래스에 무게 주기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "LogisticRegression(class_weight='balanced')",
        "드문 클래스 오류에 더 큰 벌점"
      ],
      [
        "precision_score / recall_score",
        "오탐과 놓침의 균형"
      ],
      [
        "f1_score",
        "둘의 조화평균"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>같은 데이터에서 기본 로지스틱 회귀와 <code>class_weight='balanced'</code> 모델의 재현율 · 정밀도를 비교합니다.</p>\n<ol><li><code>bal</code>: class_weight=&#x27;balanced&#x27;인 같은 파이프라인 (X_train으로 fit)</li><li><code>rec_base</code>: 기본 모델 테스트 재현율</li><li><code>rec_bal</code>: balanced 모델 테스트 재현율</li><li><code>prec_bal</code>: balanced 모델 테스트 정밀도</li><li><code>n_alarm</code>: balanced 모델이 불량으로 판정한 테스트 로트 수</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 프레스 공정 300개 로트: 압력, 온도 편차. 불량(1)은 드물다.\ni = np.arange(300)\npressure = 50 + 3 * np.sin(i * 0.31) + 1.2 * np.cos(i * 1.77)\ndtemp = 0.5 * np.cos(i * 0.47) + 0.3 * np.sin(i * 2.53)\nX = np.column_stack([pressure, dtemp])\nscore = (pressure - 50) / 3 + dtemp / 0.5 + 0.6 * np.sin(i * 3.41)\ny = (score > 1.75).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_score, recall_score, f1_score\n\nbase = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train)\n\n# 1. class_weight='balanced'인 같은 파이프라인 (X_train으로 fit)\nbal = \n# 2. 기본 모델 테스트 재현율\nrec_base = \n# 3. balanced 모델 테스트 재현율\nrec_bal = \n# 4. balanced 모델 테스트 정밀도\nprec_bal = \n# 5. balanced 모델이 불량으로 판정한 테스트 로트 수\nn_alarm = \n\nprint('base recall', round(rec_base, 3), '| balanced recall', round(rec_bal, 3), 'precision', round(prec_bal, 3), 'alarms', n_alarm)\n",
    "solution": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 프레스 공정 300개 로트: 압력, 온도 편차. 불량(1)은 드물다.\ni = np.arange(300)\npressure = 50 + 3 * np.sin(i * 0.31) + 1.2 * np.cos(i * 1.77)\ndtemp = 0.5 * np.cos(i * 0.47) + 0.3 * np.sin(i * 2.53)\nX = np.column_stack([pressure, dtemp])\nscore = (pressure - 50) / 3 + dtemp / 0.5 + 0.6 * np.sin(i * 3.41)\ny = (score > 1.75).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_score, recall_score, f1_score\n\nbase = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train)\n\n# 1. class_weight='balanced'인 같은 파이프라인 (X_train으로 fit)\nbal = make_pipeline(StandardScaler(), LogisticRegression(class_weight='balanced')).fit(X_train, y_train)\n# 2. 기본 모델 테스트 재현율\nrec_base = float(recall_score(y_test, base.predict(X_test)))\n# 3. balanced 모델 테스트 재현율\nrec_bal = float(recall_score(y_test, bal.predict(X_test)))\n# 4. balanced 모델 테스트 정밀도\nprec_bal = float(precision_score(y_test, bal.predict(X_test), zero_division=0))\n# 5. balanced 모델이 불량으로 판정한 테스트 로트 수\nn_alarm = int(bal.predict(X_test).sum())\n\nprint('base recall', round(rec_base, 3), '| balanced recall', round(rec_bal, 3), 'precision', round(prec_bal, 3), 'alarms', n_alarm)\n",
    "hints": [
      "LogisticRegression(class_weight='balanced')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 class_weight='balanced'인 같은 파이프라인 (X_train으로 fit)",
        "expr": "bal[-1].class_weight == 'balanced'",
        "hint": "LogisticRegression(class_weight='balanced')"
      },
      {
        "label": "2단계 기본 모델 테스트 재현율",
        "expr": "abs(rec_base - recall_score(y_test, base.predict(X_test))) < 1e-12",
        "hint": "recall_score(y_test, base.predict(X_test))"
      },
      {
        "label": "3단계 balanced 모델 테스트 재현율",
        "expr": "abs(rec_bal - recall_score(y_test, bal.predict(X_test))) < 1e-12 and rec_bal >= rec_base",
        "hint": "recall_score(y_test, bal.predict(X_test))"
      },
      {
        "label": "4단계 balanced 모델 테스트 정밀도",
        "expr": "abs(prec_bal - precision_score(y_test, bal.predict(X_test), zero_division=0)) < 1e-12",
        "hint": "precision_score(y_test, bal.predict(X_test), zero_division=0)"
      },
      {
        "label": "5단계 balanced 모델이 불량으로 판정한 테스트 로트 수",
        "expr": "n_alarm == int(bal.predict(X_test).sum())",
        "hint": "bal.predict(X_test).sum()"
      }
    ]
  },
  {
    "id": "38-3",
    "unit": 38,
    "domain": "general",
    "title": "이상 거래 탐지 임계값 낮추기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "predict_proba(X)[:, 1]",
        "양성 확률"
      ],
      [
        "(proba >= t).astype(int)",
        "임계값 t로 판정"
      ],
      [
        "recall · precision",
        "임계값에 따라 반대로 움직임"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>카드 결제 데이터에서 이상 거래는 드뭅니다. 기본 임계값 0.5 대신 0.2로 낮추면 재현율과 정밀도가 어떻게 바뀌는지 봅니다.</p>\n<ol><li><code>proba</code>: 테스트 데이터의 이상 거래 확률</li><li><code>pred_05</code>: 임계값 0.5 판정 (0/1 배열)</li><li><code>pred_02</code>: 임계값 0.2 판정</li><li><code>rec</code>: 두 임계값의 재현율 [0.5, 0.2]</li><li><code>prec</code>: 두 임계값의 정밀도 [0.5, 0.2] (zero_division=0)</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 카드 결제 300건: 결제 금액(만 원), 직전 결제와의 시간 간격(시간). 이상 거래(1)는 드물다.\ni = np.arange(300)\namount = 8 + 5 * np.sin(i * 0.29) + 2 * np.cos(i * 1.61)\ngap = 12 + 8 * np.cos(i * 0.43) + 3 * np.sin(i * 2.21)\nX = np.column_stack([amount, gap])\nscore = (amount - 8) / 5 - (gap - 12) / 8 + 0.6 * np.sin(i * 3.07)\ny = (score > 1.6).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_score, recall_score\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train)\n\n# 1. 테스트 데이터의 이상 거래 확률\nproba = \n# 2. 임계값 0.5 판정 (0/1 배열)\npred_05 = \n# 3. 임계값 0.2 판정\npred_02 = \n# 4. 두 임계값의 재현율 [0.5, 0.2]\nrec = \n# 5. 두 임계값의 정밀도 [0.5, 0.2] (zero_division=0)\nprec = \n\nprint('recall', [round(r, 3) for r in rec], 'precision', [round(p, 3) for p in prec])\n",
    "solution": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 카드 결제 300건: 결제 금액(만 원), 직전 결제와의 시간 간격(시간). 이상 거래(1)는 드물다.\ni = np.arange(300)\namount = 8 + 5 * np.sin(i * 0.29) + 2 * np.cos(i * 1.61)\ngap = 12 + 8 * np.cos(i * 0.43) + 3 * np.sin(i * 2.21)\nX = np.column_stack([amount, gap])\nscore = (amount - 8) / 5 - (gap - 12) / 8 + 0.6 * np.sin(i * 3.07)\ny = (score > 1.6).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import precision_score, recall_score\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression()).fit(X_train, y_train)\n\n# 1. 테스트 데이터의 이상 거래 확률\nproba = model.predict_proba(X_test)[:, 1]\n# 2. 임계값 0.5 판정 (0/1 배열)\npred_05 = (proba >= 0.5).astype(int)\n# 3. 임계값 0.2 판정\npred_02 = (proba >= 0.2).astype(int)\n# 4. 두 임계값의 재현율 [0.5, 0.2]\nrec = [recall_score(y_test, pred_05), recall_score(y_test, pred_02)]\n# 5. 두 임계값의 정밀도 [0.5, 0.2] (zero_division=0)\nprec = [precision_score(y_test, pred_05, zero_division=0), precision_score(y_test, pred_02, zero_division=0)]\n\nprint('recall', [round(r, 3) for r in rec], 'precision', [round(p, 3) for p in prec])\n",
    "hints": [
      "model.predict_proba(X_test)[:, 1]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 테스트 데이터의 이상 거래 확률",
        "expr": "np.allclose(proba, model.predict_proba(X_test)[:, 1])",
        "hint": "model.predict_proba(X_test)[:, 1]"
      },
      {
        "label": "2단계 임계값 0.5 판정 (0/1 배열)",
        "expr": "np.array_equal(pred_05, (proba >= 0.5).astype(int))",
        "hint": "(proba >= 0.5).astype(int)"
      },
      {
        "label": "3단계 임계값 0.2 판정",
        "expr": "np.array_equal(pred_02, (proba >= 0.2).astype(int))",
        "hint": "(proba >= 0.2).astype(int)"
      },
      {
        "label": "4단계 두 임계값의 재현율 [0.5, 0.2]",
        "expr": "np.allclose(rec, [recall_score(y_test, (proba >= 0.5).astype(int)), recall_score(y_test, (proba >= 0.2).astype(int))]) and rec[1] >= rec[0]",
        "hint": "[recall_score(y_test, pred_05), recall_score(y_test, pred_02)]"
      },
      {
        "label": "5단계 두 임계값의 정밀도 [0.5, 0.2] (zero_division=0)",
        "expr": "np.allclose(prec, [precision_score(y_test, (proba >= 0.5).astype(int), zero_division=0), precision_score(y_test, (proba >= 0.2).astype(int), zero_division=0)])",
        "hint": "precision_score(..., zero_division=0)"
      }
    ]
  },
  {
    "id": "38-4",
    "unit": 38,
    "domain": "general",
    "title": "학습 데이터만 오버샘플링하기",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "resample(..., replace=True, n_samples=, random_state=)",
        "소수 클래스를 복원 추출로 늘리기"
      ],
      [
        "np.vstack / np.concatenate",
        "다시 합치기"
      ],
      [
        "테스트는 그대로",
        "평가 데이터는 절대 늘리지 않음"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>이상 거래(1)를 학습 데이터 안에서만 정상(0) 개수만큼 복원 추출로 늘린 뒤 학습합니다. 테스트 데이터는 손대지 않습니다.</p>\n<ol><li><code>X_up</code>: 소수 클래스를 다수 클래스 개수만큼 복원 추출 (random_state=0)</li><li><code>X_bal</code>: X_maj와 X_up을 위아래로 합친 배열</li><li><code>y_bal</code>: 그에 맞는 라벨 (0이 len(X_maj)개, 1이 len(X_up)개)</li><li><code>rec_up</code>: 오버샘플링 데이터로 학습한 모델(표준화 + 로지스틱)의 테스트 재현율</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 카드 결제 300건: 결제 금액(만 원), 직전 결제와의 시간 간격(시간). 이상 거래(1)는 드물다.\ni = np.arange(300)\namount = 8 + 5 * np.sin(i * 0.29) + 2 * np.cos(i * 1.61)\ngap = 12 + 8 * np.cos(i * 0.43) + 3 * np.sin(i * 2.21)\nX = np.column_stack([amount, gap])\nscore = (amount - 8) / 5 - (gap - 12) / 8 + 0.6 * np.sin(i * 3.07)\ny = (score > 1.6).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.utils import resample\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import recall_score\n\nX_min, X_maj = X_train[y_train == 1], X_train[y_train == 0]\n\n# 1. 소수 클래스를 다수 클래스 개수만큼 복원 추출 (random_state=0)\nX_up = \n# 2. X_maj와 X_up을 위아래로 합친 배열\nX_bal = \n# 3. 그에 맞는 라벨 (0이 len(X_maj)개, 1이 len(X_up)개)\ny_bal = \n# 4. 오버샘플링 데이터로 학습한 모델(표준화 + 로지스틱)의 테스트 재현율\nrec_up = \n\nprint(len(X_maj), len(X_min), '->', X_bal.shape, 'recall', round(rec_up, 3))\n",
    "solution": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# 카드 결제 300건: 결제 금액(만 원), 직전 결제와의 시간 간격(시간). 이상 거래(1)는 드물다.\ni = np.arange(300)\namount = 8 + 5 * np.sin(i * 0.29) + 2 * np.cos(i * 1.61)\ngap = 12 + 8 * np.cos(i * 0.43) + 3 * np.sin(i * 2.21)\nX = np.column_stack([amount, gap])\nscore = (amount - 8) / 5 - (gap - 12) / 8 + 0.6 * np.sin(i * 3.07)\ny = (score > 1.6).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.utils import resample\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import recall_score\n\nX_min, X_maj = X_train[y_train == 1], X_train[y_train == 0]\n\n# 1. 소수 클래스를 다수 클래스 개수만큼 복원 추출 (random_state=0)\nX_up = resample(X_min, replace=True, n_samples=len(X_maj), random_state=0)\n# 2. X_maj와 X_up을 위아래로 합친 배열\nX_bal = np.vstack([X_maj, X_up])\n# 3. 그에 맞는 라벨 (0이 len(X_maj)개, 1이 len(X_up)개)\ny_bal = np.concatenate([np.zeros(len(X_maj), dtype=int), np.ones(len(X_up), dtype=int)])\n# 4. 오버샘플링 데이터로 학습한 모델(표준화 + 로지스틱)의 테스트 재현율\nrec_up = float(recall_score(y_test, make_pipeline(StandardScaler(), LogisticRegression()).fit(X_bal, y_bal).predict(X_test)))\n\nprint(len(X_maj), len(X_min), '->', X_bal.shape, 'recall', round(rec_up, 3))\n",
    "hints": [
      "resample(X_min, replace=True, n_samples=len(X_maj), random_state=0)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 소수 클래스를 다수 클래스 개수만큼 복원 추출 (random_state=0)",
        "expr": "X_up.shape == X_maj.shape",
        "hint": "resample(X_min, replace=True, n_samples=len(X_maj), random_state=0)"
      },
      {
        "label": "2단계 X_maj와 X_up을 위아래로 합친 배열",
        "expr": "X_bal.shape == (2 * len(X_maj), 2)",
        "hint": "np.vstack([X_maj, X_up])"
      },
      {
        "label": "3단계 그에 맞는 라벨 (0이 len(X_maj)개, 1이 len(X_up)개)",
        "expr": "len(y_bal) == len(X_bal) and abs(np.mean(y_bal) - 0.5) < 1e-12",
        "hint": "np.concatenate([np.zeros(len(X_maj), dtype=int), np.ones(len(X_up), dtype=int)])"
      },
      {
        "label": "4단계 오버샘플링 데이터로 학습한 모델(표준화 + 로지스틱)의 테스트 재현율",
        "expr": "abs(rec_up - recall_score(y_test, make_pipeline(StandardScaler(), LogisticRegression()).fit(X_bal, y_bal).predict(X_test))) < 1e-12",
        "hint": "make_pipeline(...).fit(X_bal, y_bal) 후 X_test로 recall"
      }
    ]
  },
  {
    "id": "39-1",
    "unit": 39,
    "domain": "mfg",
    "title": "랜덤포레스트 피처 중요도 순위",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "RandomForestClassifier(n_estimators, random_state)",
        "랜덤포레스트"
      ],
      [
        ".feature_importances_",
        "불순도 감소 기반 중요도"
      ],
      [
        "pd.Series(값, index=열 이름).sort_values()",
        "이름 붙여 정렬"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>사출 공정 네 가지 조건(<code>X</code>: temp, pressure, speed, humidity)으로 불량을 예측하는 랜덤포레스트를 만들고 피처 중요도를 읽습니다.</p>\n<ol><li><code>rf</code>: 학습한 랜덤포레스트 (n_estimators=50, random_state=0)</li><li><code>imp</code>: 열 이름을 index로 한 중요도 Series (큰 순서)</li><li><code>top</code>: 가장 중요한 열 이름</li><li><code>test_acc</code>: 테스트 정확도</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 사출 공정 200개 로트: 네 가지 조건과 불량 여부. humidity는 사실 불량과 관계가 없다.\ni = np.arange(200)\nX = pd.DataFrame({\n    'temp': 230 + 6 * np.sin(i * 0.37) + 2 * np.cos(i * 1.91),\n    'pressure': 80 + 5 * np.cos(i * 0.53) + 1.5 * np.sin(i * 2.71),\n    'speed': 40 + 3 * np.sin(i * 0.83) + np.cos(i * 1.37),\n    'humidity': 45 + 8 * np.cos(i * 0.97) + 2 * np.sin(i * 2.17),\n})\ny = (((X['temp'] - 230) / 6 + 0.6 * (X['pressure'] - 80) / 5 + 0.7 * np.sin(i * 3.33)) > 0.8).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.ensemble import RandomForestClassifier\n\n# 1. 학습한 랜덤포레스트 (n_estimators=50, random_state=0)\nrf = \n# 2. 열 이름을 index로 한 중요도 Series (큰 순서)\nimp = \n# 3. 가장 중요한 열 이름\ntop = \n# 4. 테스트 정확도\ntest_acc = \n\nprint(imp.round(3))\nprint(top, round(test_acc, 3))\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 사출 공정 200개 로트: 네 가지 조건과 불량 여부. humidity는 사실 불량과 관계가 없다.\ni = np.arange(200)\nX = pd.DataFrame({\n    'temp': 230 + 6 * np.sin(i * 0.37) + 2 * np.cos(i * 1.91),\n    'pressure': 80 + 5 * np.cos(i * 0.53) + 1.5 * np.sin(i * 2.71),\n    'speed': 40 + 3 * np.sin(i * 0.83) + np.cos(i * 1.37),\n    'humidity': 45 + 8 * np.cos(i * 0.97) + 2 * np.sin(i * 2.17),\n})\ny = (((X['temp'] - 230) / 6 + 0.6 * (X['pressure'] - 80) / 5 + 0.7 * np.sin(i * 3.33)) > 0.8).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.ensemble import RandomForestClassifier\n\n# 1. 학습한 랜덤포레스트 (n_estimators=50, random_state=0)\nrf = RandomForestClassifier(n_estimators=50, random_state=0).fit(X_train, y_train)\n# 2. 열 이름을 index로 한 중요도 Series (큰 순서)\nimp = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=False)\n# 3. 가장 중요한 열 이름\ntop = imp.index[0]\n# 4. 테스트 정확도\ntest_acc = float(rf.score(X_test, y_test))\n\nprint(imp.round(3))\nprint(top, round(test_acc, 3))\n",
    "hints": [
      "RandomForestClassifier(n_estimators=50, random_state=0).fit(X_train, y_train)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 학습한 랜덤포레스트 (n_estimators=50, random_state=0)",
        "expr": "len(rf.estimators_) == 50",
        "hint": "RandomForestClassifier(n_estimators=50, random_state=0).fit(X_train, y_train)"
      },
      {
        "label": "2단계 열 이름을 index로 한 중요도 Series (큰 순서)",
        "expr": "abs(imp.sum() - 1) < 1e-9 and list(imp.values) == sorted(imp.values, reverse=True) and set(imp.index) == set(X.columns)",
        "hint": "pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=False)"
      },
      {
        "label": "3단계 가장 중요한 열 이름",
        "expr": "top == 'temp'",
        "hint": "imp.index[0]"
      },
      {
        "label": "4단계 테스트 정확도",
        "expr": "abs(test_acc - rf.score(X_test, y_test)) < 1e-12 and test_acc >= 0.7",
        "hint": "rf.score(X_test, y_test)"
      }
    ]
  },
  {
    "id": "39-2",
    "unit": 39,
    "domain": "mfg",
    "title": "순열 중요도로 다시 확인하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "permutation_importance(모델, X_test, y_test, n_repeats, random_state)",
        "열을 섞었을 때 점수가 얼마나 떨어지나"
      ],
      [
        ".importances_mean",
        "열별 평균 하락폭"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>불순도 기반 중요도는 학습 데이터 기준이라 값이 다양한 열을 과대평가할 수 있습니다. 테스트 데이터에서 열을 하나씩 섞어 정확도 하락을 봅니다.</p>\n<ol><li><code>result</code>: 테스트 데이터 순열 중요도 (n_repeats=10, random_state=0)</li><li><code>pimp</code>: 열 이름을 index로 한 평균 하락폭 Series</li><li><code>top</code>: 하락폭이 가장 큰 열</li><li><code>humid_small</code>: humidity 하락폭이 temp의 10% 미만인지</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 사출 공정 200개 로트: 네 가지 조건과 불량 여부. humidity는 사실 불량과 관계가 없다.\ni = np.arange(200)\nX = pd.DataFrame({\n    'temp': 230 + 6 * np.sin(i * 0.37) + 2 * np.cos(i * 1.91),\n    'pressure': 80 + 5 * np.cos(i * 0.53) + 1.5 * np.sin(i * 2.71),\n    'speed': 40 + 3 * np.sin(i * 0.83) + np.cos(i * 1.37),\n    'humidity': 45 + 8 * np.cos(i * 0.97) + 2 * np.sin(i * 2.17),\n})\ny = (((X['temp'] - 230) / 6 + 0.6 * (X['pressure'] - 80) / 5 + 0.7 * np.sin(i * 3.33)) > 0.8).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.inspection import permutation_importance\n\nrf = RandomForestClassifier(n_estimators=50, random_state=0).fit(X_train, y_train)\n\n# 1. 테스트 데이터 순열 중요도 (n_repeats=10, random_state=0)\nresult = \n# 2. 열 이름을 index로 한 평균 하락폭 Series\npimp = \n# 3. 하락폭이 가장 큰 열\ntop = \n# 4. humidity 하락폭이 temp의 10% 미만인지\nhumid_small = \n\nprint(pimp.round(3))\nprint(top, humid_small)\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 사출 공정 200개 로트: 네 가지 조건과 불량 여부. humidity는 사실 불량과 관계가 없다.\ni = np.arange(200)\nX = pd.DataFrame({\n    'temp': 230 + 6 * np.sin(i * 0.37) + 2 * np.cos(i * 1.91),\n    'pressure': 80 + 5 * np.cos(i * 0.53) + 1.5 * np.sin(i * 2.71),\n    'speed': 40 + 3 * np.sin(i * 0.83) + np.cos(i * 1.37),\n    'humidity': 45 + 8 * np.cos(i * 0.97) + 2 * np.sin(i * 2.17),\n})\ny = (((X['temp'] - 230) / 6 + 0.6 * (X['pressure'] - 80) / 5 + 0.7 * np.sin(i * 3.33)) > 0.8).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.inspection import permutation_importance\n\nrf = RandomForestClassifier(n_estimators=50, random_state=0).fit(X_train, y_train)\n\n# 1. 테스트 데이터 순열 중요도 (n_repeats=10, random_state=0)\nresult = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=0)\n# 2. 열 이름을 index로 한 평균 하락폭 Series\npimp = pd.Series(result.importances_mean, index=X.columns)\n# 3. 하락폭이 가장 큰 열\ntop = pimp.idxmax()\n# 4. humidity 하락폭이 temp의 10% 미만인지\nhumid_small = bool(pimp['humidity'] < 0.1 * pimp['temp'])\n\nprint(pimp.round(3))\nprint(top, humid_small)\n",
    "hints": [
      "permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=0)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 테스트 데이터 순열 중요도 (n_repeats=10, random_state=0)",
        "expr": "result.importances.shape == (4, 10)",
        "hint": "permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=0)"
      },
      {
        "label": "2단계 열 이름을 index로 한 평균 하락폭 Series",
        "expr": "list(pimp.index) == list(X.columns) and np.allclose(pimp.values, result.importances_mean)",
        "hint": "pd.Series(result.importances_mean, index=X.columns)"
      },
      {
        "label": "3단계 하락폭이 가장 큰 열",
        "expr": "top == 'temp'",
        "hint": "pimp.idxmax()"
      },
      {
        "label": "4단계 humidity 하락폭이 temp의 10% 미만인지",
        "expr": "humid_small == bool(pimp['humidity'] < 0.1 * pimp['temp'])",
        "hint": "pimp['humidity'] < 0.1 * pimp['temp']"
      }
    ]
  },
  {
    "id": "39-3",
    "unit": 39,
    "domain": "general",
    "title": "표준화한 회귀계수로 영향력 비교",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "LinearRegression().coef_",
        "원래 단위 기울기"
      ],
      [
        "표준화 후 계수",
        "1 표준편차 변화당 효과 → 서로 비교 가능"
      ],
      [
        "pd.Series(..., index=열)",
        "이름 붙이기"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>회원 150명의 월 구매액을 방문 수, 쿠폰 사용 수, 나이로 예측합니다. 원래 계수는 단위가 달라 크기를 바로 비교할 수 없으니 표준화 후 계수도 구합니다.</p>\n<ol><li><code>lr</code>: X_train으로 학습한 LinearRegression</li><li><code>coef</code>: 원래 단위 계수 Series (index=열 이름)</li><li><code>std_coef</code>: 표준화 + 선형회귀 파이프라인의 계수 Series</li><li><code>top</code>: 표준화 계수 절댓값이 가장 큰 열</li><li><code>r2</code>: 테스트 R²</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 쇼핑몰 회원 150명의 월 구매액(만 원)과 세 가지 행동 지표\ni = np.arange(150)\nX = pd.DataFrame({\n    'visits': 12 + 5 * np.sin(i * 0.41) + 1.5 * np.cos(i * 1.73),\n    'coupon': 2 + 1.5 * np.cos(i * 0.59) + 0.5 * np.sin(i * 2.37),\n    'age': 35 + 10 * np.sin(i * 0.23) + 3 * np.cos(i * 1.31),\n})\ny = 3.0 * X['visits'] + 4.0 * X['coupon'] + 0.05 * X['age'] + 2 * np.sin(i * 3.11)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\n# 1. X_train으로 학습한 LinearRegression\nlr = \n# 2. 원래 단위 계수 Series (index=열 이름)\ncoef = \n# 3. 표준화 + 선형회귀 파이프라인의 계수 Series\nstd_coef = \n# 4. 표준화 계수 절댓값이 가장 큰 열\ntop = \n# 5. 테스트 R²\nr2 = \n\nprint(coef.round(3))\nprint(std_coef.round(3))\nprint(top, round(r2, 3))\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 쇼핑몰 회원 150명의 월 구매액(만 원)과 세 가지 행동 지표\ni = np.arange(150)\nX = pd.DataFrame({\n    'visits': 12 + 5 * np.sin(i * 0.41) + 1.5 * np.cos(i * 1.73),\n    'coupon': 2 + 1.5 * np.cos(i * 0.59) + 0.5 * np.sin(i * 2.37),\n    'age': 35 + 10 * np.sin(i * 0.23) + 3 * np.cos(i * 1.31),\n})\ny = 3.0 * X['visits'] + 4.0 * X['coupon'] + 0.05 * X['age'] + 2 * np.sin(i * 3.11)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\n# 1. X_train으로 학습한 LinearRegression\nlr = LinearRegression().fit(X_train, y_train)\n# 2. 원래 단위 계수 Series (index=열 이름)\ncoef = pd.Series(lr.coef_, index=X.columns)\n# 3. 표준화 + 선형회귀 파이프라인의 계수 Series\nstd_coef = pd.Series(make_pipeline(StandardScaler(), LinearRegression()).fit(X_train, y_train)[-1].coef_, index=X.columns)\n# 4. 표준화 계수 절댓값이 가장 큰 열\ntop = std_coef.abs().idxmax()\n# 5. 테스트 R²\nr2 = float(lr.score(X_test, y_test))\n\nprint(coef.round(3))\nprint(std_coef.round(3))\nprint(top, round(r2, 3))\n",
    "hints": [
      "LinearRegression().fit(X_train, y_train)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 X_train으로 학습한 LinearRegression",
        "expr": "len(lr.coef_) == 3",
        "hint": "LinearRegression().fit(X_train, y_train)"
      },
      {
        "label": "2단계 원래 단위 계수 Series (index=열 이름)",
        "expr": "np.allclose(coef.values, LinearRegression().fit(X_train, y_train).coef_) and list(coef.index) == list(X.columns)",
        "hint": "pd.Series(lr.coef_, index=X.columns)"
      },
      {
        "label": "3단계 표준화 + 선형회귀 파이프라인의 계수 Series",
        "expr": "np.allclose(std_coef.values, coef.values * X_train.std(ddof=0).values)",
        "hint": "make_pipeline(StandardScaler(), LinearRegression()).fit(...)[-1].coef_"
      },
      {
        "label": "4단계 표준화 계수 절댓값이 가장 큰 열",
        "expr": "top == 'visits'",
        "hint": "std_coef.abs().idxmax()"
      },
      {
        "label": "5단계 테스트 R²",
        "expr": "abs(r2 - lr.score(X_test, y_test)) < 1e-12 and r2 > 0.8",
        "hint": "lr.score(X_test, y_test)"
      }
    ]
  },
  {
    "id": "39-4",
    "unit": 39,
    "domain": "general",
    "title": "부분 의존도를 직접 계산하기",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "X.copy()",
        "원본을 지키며 복사"
      ],
      [
        "Xc['열'] = 값",
        "한 열만 고정값으로 바꾸기"
      ],
      [
        "model.predict(Xc).mean()",
        "다른 열은 그대로 두고 평균 예측"
      ]
    ],
    "origin": "머신러닝",
    "desc": "<p>랜덤포레스트 회귀로 월 구매액을 예측한 뒤, <code>coupon</code> 값을 0~4로 바꿨을 때 평균 예측이 어떻게 변하는지 직접 계산합니다. 이것이 부분 의존도(PDP)입니다.</p>\n<ol><li><code>pdp</code>: grid의 각 값으로 coupon을 고정했을 때 X_train 평균 예측 리스트</li><li><code>effect</code>: coupon 0 → 4일 때 평균 예측 변화</li><li><code>monotonic</code>: pdp가 grid를 따라 줄어들지 않는지</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 쇼핑몰 회원 150명의 월 구매액(만 원)과 세 가지 행동 지표\ni = np.arange(150)\nX = pd.DataFrame({\n    'visits': 12 + 5 * np.sin(i * 0.41) + 1.5 * np.cos(i * 1.73),\n    'coupon': 2 + 1.5 * np.cos(i * 0.59) + 0.5 * np.sin(i * 2.37),\n    'age': 35 + 10 * np.sin(i * 0.23) + 3 * np.cos(i * 1.31),\n})\ny = 3.0 * X['visits'] + 4.0 * X['coupon'] + 0.05 * X['age'] + 2 * np.sin(i * 3.11)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)\nfrom sklearn.ensemble import RandomForestRegressor\n\nrf = RandomForestRegressor(n_estimators=50, random_state=0).fit(X_train, y_train)\ngrid = [0, 1, 2, 3, 4]\n\n# 1. grid의 각 값으로 coupon을 고정했을 때 X_train 평균 예측 리스트\npdp = \n# 2. coupon 0 → 4일 때 평균 예측 변화\neffect = \n# 3. pdp가 grid를 따라 줄어들지 않는지\nmonotonic = \n\nprint([round(v, 1) for v in pdp], round(effect, 1), monotonic)\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# 쇼핑몰 회원 150명의 월 구매액(만 원)과 세 가지 행동 지표\ni = np.arange(150)\nX = pd.DataFrame({\n    'visits': 12 + 5 * np.sin(i * 0.41) + 1.5 * np.cos(i * 1.73),\n    'coupon': 2 + 1.5 * np.cos(i * 0.59) + 0.5 * np.sin(i * 2.37),\n    'age': 35 + 10 * np.sin(i * 0.23) + 3 * np.cos(i * 1.31),\n})\ny = 3.0 * X['visits'] + 4.0 * X['coupon'] + 0.05 * X['age'] + 2 * np.sin(i * 3.11)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)\nfrom sklearn.ensemble import RandomForestRegressor\n\nrf = RandomForestRegressor(n_estimators=50, random_state=0).fit(X_train, y_train)\ngrid = [0, 1, 2, 3, 4]\n\n# 1. grid의 각 값으로 coupon을 고정했을 때 X_train 평균 예측 리스트\npdp = [float(rf.predict(X_train.assign(coupon=v)).mean()) for v in grid]\n# 2. coupon 0 → 4일 때 평균 예측 변화\neffect = pdp[-1] - pdp[0]\n# 3. pdp가 grid를 따라 줄어들지 않는지\nmonotonic = all(a <= b + 1e-9 for a, b in zip(pdp, pdp[1:]))\n\nprint([round(v, 1) for v in pdp], round(effect, 1), monotonic)\n",
    "hints": [
      "[rf.predict(X_train.assign(coupon=v)).mean() for v in grid]  (assign은 복사본을 돌려줍니다)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 grid의 각 값으로 coupon을 고정했을 때 X_train 평균 예측 리스트",
        "expr": "len(pdp) == 5 and np.allclose(pdp, [rf.predict(X_train.assign(coupon=v)).mean() for v in grid])",
        "hint": "[rf.predict(X_train.assign(coupon=v)).mean() for v in grid]  (assign은 복사본을 돌려줍니다)"
      },
      {
        "label": "2단계 coupon 0 → 4일 때 평균 예측 변화",
        "expr": "abs(effect - (pdp[-1] - pdp[0])) < 1e-9 and effect > 0",
        "hint": "pdp[-1] - pdp[0]"
      },
      {
        "label": "3단계 pdp가 grid를 따라 줄어들지 않는지",
        "expr": "monotonic == all(a <= b + 1e-9 for a, b in zip(pdp, pdp[1:]))",
        "hint": "all(a <= b for a, b in zip(pdp, pdp[1:]))"
      }
    ]
  }
];

export const SM2_QUIZZES = [
  {
    "id": "32-Q",
    "unit": 32,
    "title": "카이제곱 · ANOVA 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "stats.chi2_contingency로 table의 독립성 검정 자유도를 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nfrom scipy import stats\ntable = np.array([[10, 20, 30], [15, 25, 20]])",
        "expect": "2",
        "must": [
          "chi2_contingency\\("
        ],
        "solution": "import numpy as np\nfrom scipy import stats\ntable = np.array([[10, 20, 30], [15, 25, 20]])\nprint(stats.chi2_contingency(table).dof)",
        "explain": "(2 − 1) × (3 − 1) = 2"
      },
      {
        "kind": "choice",
        "q": "라인(A/B/C)과 불량 유형(외관/치수/기능)이 관계가 있는지 볼 때 알맞은 검정은?",
        "options": [
          "일원분산분석",
          "독립성 카이제곱 검정",
          "대응표본 t검정",
          "피어슨 상관"
        ],
        "answer": 1,
        "explain": "두 범주 변수의 관계는 교차표 + 카이제곱 독립성 검정입니다."
      },
      {
        "kind": "ox",
        "q": "ANOVA의 p-value가 0.01이면 세 집단 평균이 모두 서로 다르다고 결론 내린다.",
        "answer": false,
        "explain": "적어도 한 집단이 다르다는 뜻까지입니다. 어느 쌍인지는 Tukey HSD 같은 사후검정으로 봅니다."
      },
      {
        "kind": "choice",
        "q": "세 집단을 t검정으로 쌍마다(3번) 비교하면 생기는 문제는?",
        "options": [
          "검정력이 0이 된다",
          "1종 오류(거짓 양성) 가능성이 커진다",
          "p-value가 음수가 된다",
          "표본이 줄어든다"
        ],
        "answer": 1,
        "explain": "검정을 여러 번 할수록 우연히 하나라도 유의하게 나올 확률이 커집니다."
      },
      {
        "kind": "ox",
        "q": "카이제곱 검정은 기대 빈도가 너무 작은 칸이 많으면 결과를 믿기 어렵다.",
        "answer": true,
        "explain": "보통 기대 빈도 5 이상을 권합니다. 작으면 범주를 합치거나 Fisher 정확검정을 씁니다."
      }
    ]
  },
  {
    "id": "33-Q",
    "unit": 33,
    "title": "상관과 회귀 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "np.polyfit으로 x, y에 맞춘 직선의 기울기를 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nx = np.array([1, 2, 3, 4])\ny = np.array([3, 5, 7, 9])",
        "expect": [
          "2.0",
          "2"
        ],
        "must": [
          "polyfit\\("
        ],
        "solution": "import numpy as np\nx = np.array([1, 2, 3, 4])\ny = np.array([3, 5, 7, 9])\nprint(round(np.polyfit(x, y, 1)[0], 6))",
        "explain": "polyfit(x, y, 1)은 [기울기, 절편]을 돌려줍니다. y = 2x + 1."
      },
      {
        "kind": "ox",
        "q": "상관계수가 0이면 두 변수 사이에 아무 관계도 없다.",
        "answer": false,
        "explain": "피어슨 상관은 직선 관계만 잽니다. y = x² 같은 곡선 관계는 상관 0이 나올 수 있습니다."
      },
      {
        "kind": "choice",
        "q": "이상치 하나에 크게 흔들리지 않는 상관계수는?",
        "options": [
          "피어슨",
          "스피어만",
          "공분산",
          "R²"
        ],
        "answer": 1,
        "explain": "스피어만은 값 대신 순위를 쓰므로 극단값의 영향이 작습니다."
      },
      {
        "kind": "short",
        "q": "단순 선형회귀에서 상관계수 r = 0.9이면 R²는? (소수)",
        "answer": [
          "0.81",
          ".81"
        ],
        "explain": "단순 회귀에서 R² = r²."
      },
      {
        "kind": "choice",
        "q": "잔차(실제 − 예측)를 예측값에 대해 그렸더니 U자 패턴이 보였다. 의미는?",
        "options": [
          "완벽한 모델",
          "직선이 관계를 다 설명하지 못함",
          "표본이 너무 많음",
          "상관이 0"
        ],
        "answer": 1,
        "explain": "잔차에 패턴이 있으면 곡선 항이나 다른 변수가 필요합니다."
      }
    ]
  },
  {
    "id": "34-Q",
    "unit": 34,
    "title": "A/B 테스트와 검정력 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "A 전환율 0.10, B 전환율 0.12일 때 상대 상승률(B − A) / A를 소수 둘째 자리까지 반올림해 출력하는 코드를 작성하세요.",
        "given": "p_a, p_b = 0.10, 0.12",
        "expect": "0.2",
        "solution": "p_a, p_b = 0.10, 0.12\nprint(round((p_b - p_a) / p_a, 2))",
        "explain": "(0.12 − 0.10) / 0.10 = 0.2 (20% 상승). 차이 자체는 2%p입니다."
      },
      {
        "kind": "choice",
        "q": "검정력(power)의 뜻은?",
        "options": [
          "귀무가설이 참일 때 기각할 확률",
          "실제 차이가 있을 때 그것을 검출할 확률",
          "p-value",
          "신뢰수준"
        ],
        "answer": 1,
        "explain": "검정력 = 1 − β(2종 오류 확률)."
      },
      {
        "kind": "choice",
        "q": "다른 조건이 같을 때 검출하려는 효과 크기를 절반으로 줄이면 필요한 표본 수는?",
        "options": [
          "절반",
          "같다",
          "2배",
          "약 4배"
        ],
        "answer": 3,
        "explain": "n ∝ 1/δ². 효과가 절반이면 표본은 4배."
      },
      {
        "kind": "ox",
        "q": "실험 중 매일 p-value를 확인하다가 처음 0.05 아래로 내려간 날 멈추는 것은 올바른 방법이다.",
        "answer": false,
        "explain": "여러 번 들여다보면 거짓 양성이 늘어납니다(피킹 문제). 표본 수를 미리 정하세요."
      },
      {
        "kind": "ox",
        "q": "A/B 테스트에서 사용자를 무작위로 나누는 이유는 두 그룹의 다른 조건을 비슷하게 맞추기 위해서다.",
        "answer": true,
        "explain": "무작위 배정이 있어야 차이를 처리(버튼, 공정 변경)의 효과로 볼 수 있습니다."
      }
    ]
  },
  {
    "id": "35-Q",
    "unit": 35,
    "title": "교차검증 · 하이퍼파라미터 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "KFold(n_splits=4)로 X를 나눴을 때 폴드 수를 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nfrom sklearn.model_selection import KFold\nX = np.arange(20).reshape(10, 2)",
        "expect": "4",
        "must": [
          "KFold\\("
        ],
        "solution": "import numpy as np\nfrom sklearn.model_selection import KFold\nX = np.arange(20).reshape(10, 2)\nprint(len(list(KFold(n_splits=4).split(X))))",
        "explain": "split(X)는 (학습 인덱스, 검증 인덱스) 쌍을 폴드 수만큼 만듭니다."
      },
      {
        "kind": "choice",
        "q": "GridSearchCV에서 가장 좋은 하이퍼파라미터 조합이 들어 있는 속성은?",
        "options": [
          "best_score_",
          "best_params_",
          "cv_results_",
          "n_splits_"
        ],
        "answer": 1,
        "explain": "best_score_는 그 조합의 평균 CV 점수입니다."
      },
      {
        "kind": "ox",
        "q": "하이퍼파라미터는 테스트 데이터 점수가 가장 높은 값으로 고르는 것이 정석이다.",
        "answer": false,
        "explain": "학습 데이터 안의 교차검증으로 고르고, 테스트는 마지막에 한 번만 씁니다."
      },
      {
        "kind": "choice",
        "q": "cross_val_score 결과 [0.82, 0.85, 0.60, 0.84, 0.83]에서 가장 먼저 의심할 것은?",
        "options": [
          "모델이 완벽하다",
          "한 폴드의 데이터 분포가 다르다",
          "정확도 계산 오류",
          "cv를 늘려야 한다"
        ],
        "answer": 1,
        "explain": "한 폴드만 낮으면 그 구간 데이터가 특이하거나 분할이 고르지 않은지 확인합니다."
      },
      {
        "kind": "ox",
        "q": "분류 문제에서 cv=5만 주면 scikit-learn은 층화 K-fold를 쓴다.",
        "answer": true,
        "explain": "분류기에 정수 cv를 주면 StratifiedKFold(섞지 않음)가 기본입니다."
      }
    ]
  },
  {
    "id": "36-Q",
    "unit": 36,
    "title": "피처 엔지니어링 · Pipeline 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "StandardScaler로 x를 표준화한 뒤 평균을 소수 둘째 자리까지 반올림해 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nfrom sklearn.preprocessing import StandardScaler\nx = np.array([[1.0], [2.0], [3.0], [6.0]])",
        "expect": [
          "0.0",
          "-0.0"
        ],
        "must": [
          "StandardScaler\\("
        ],
        "solution": "import numpy as np\nfrom sklearn.preprocessing import StandardScaler\nx = np.array([[1.0], [2.0], [3.0], [6.0]])\nprint(round(StandardScaler().fit_transform(x).mean(), 2))",
        "explain": "표준화 후 평균은 0, 표준편차는 1입니다."
      },
      {
        "kind": "choice",
        "q": "OneHotEncoder(handle_unknown='ignore')로 학습 때 없던 범주가 들어오면?",
        "options": [
          "에러",
          "모든 원-핫 열이 0",
          "가장 많은 범주로 바뀜",
          "NaN"
        ],
        "answer": 1,
        "explain": "모르는 범주는 모든 열 0으로 처리해 에러 없이 예측합니다."
      },
      {
        "kind": "ox",
        "q": "스케일러를 전체 데이터로 fit 한 뒤 교차검증하면 검증 점수가 부풀려질 수 있다.",
        "answer": true,
        "explain": "검증 폴드의 평균·분산이 학습에 새어 들어갑니다. 파이프라인으로 감싸세요."
      },
      {
        "kind": "choice",
        "q": "결정트리 · 랜덤포레스트에 표준화가 대체로 필요 없는 이유는?",
        "options": [
          "트리는 숫자를 못 다뤄서",
          "분기 기준이 값의 순서만 쓰기 때문",
          "자동으로 표준화해서",
          "범주만 쓰기 때문"
        ],
        "answer": 1,
        "explain": "트리는 '온도 > 52' 같은 순서 비교만 하므로 단위 변환에 영향을 받지 않습니다."
      },
      {
        "kind": "choice",
        "q": "숫자 열은 표준화, 범주 열은 원-핫처럼 열마다 다른 전처리를 묶는 도구는?",
        "options": [
          "Pipeline",
          "ColumnTransformer",
          "GridSearchCV",
          "KFold"
        ],
        "answer": 1,
        "explain": "ColumnTransformer로 묶고, 그 뒤에 모델을 Pipeline으로 잇습니다."
      }
    ]
  },
  {
    "id": "37-Q",
    "unit": 37,
    "title": "비지도 학습 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "KMeans(n_clusters=2, n_init=10, random_state=0)으로 X를 군집화한 뒤 군집별 개수를 작은 순으로 정렬한 리스트를 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nfrom sklearn.cluster import KMeans\nX = np.array([[1, 1], [1, 2], [2, 1], [9, 9], [9, 10]])",
        "expect": "[2, 3]",
        "must": [
          "KMeans\\("
        ],
        "solution": "import numpy as np\nfrom sklearn.cluster import KMeans\nX = np.array([[1, 1], [1, 2], [2, 1], [9, 9], [9, 10]])\nlabels = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)\nprint(sorted(np.bincount(labels).tolist()))",
        "explain": "가까운 세 점과 두 점으로 나뉩니다."
      },
      {
        "kind": "ox",
        "q": "K-means의 inertia는 k를 늘릴수록 대체로 작아지므로 inertia가 가장 작은 k를 고르면 된다.",
        "answer": false,
        "explain": "k = 데이터 수면 inertia는 0입니다. 꺾이는 지점이나 실루엣 점수로 고릅니다."
      },
      {
        "kind": "choice",
        "q": "K-means 전에 표준화가 필요한 이유는?",
        "options": [
          "군집 수를 정하려고",
          "거리 계산에서 단위가 큰 열이 결과를 지배하지 않게",
          "라벨을 만들려고",
          "속도를 높이려고"
        ],
        "answer": 1,
        "explain": "전력(kW)과 진동(mm/s)처럼 범위가 다르면 큰 쪽이 거리를 좌우합니다."
      },
      {
        "kind": "choice",
        "q": "PCA의 explained_variance_ratio_가 [0.70, 0.20, 0.07, 0.03]이면 누적 90%에 필요한 주성분 수는?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "answer": 1,
        "explain": "0.70 + 0.20 = 0.90."
      },
      {
        "kind": "ox",
        "q": "PCA의 주성분은 원래 열들의 선형 결합이다.",
        "answer": true,
        "explain": "components_가 각 열에 곱하는 가중치입니다."
      }
    ]
  },
  {
    "id": "38-Q",
    "unit": 38,
    "title": "불균형 데이터 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "y에서 양성(1) 비율을 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\ny = np.array([0] * 95 + [1] * 5)",
        "expect": "0.05",
        "solution": "import numpy as np\ny = np.array([0] * 95 + [1] * 5)\nprint(y.mean())",
        "explain": "0과 1로 된 배열의 평균이 1의 비율입니다."
      },
      {
        "kind": "choice",
        "q": "불량률 2% 데이터에서 '모두 정상'이라고 답하는 모델의 정확도는?",
        "options": [
          "2%",
          "50%",
          "98%",
          "100%"
        ],
        "answer": 2,
        "explain": "그래서 불균형 데이터에서 정확도만 보면 안 됩니다."
      },
      {
        "kind": "choice",
        "q": "불량을 하나라도 놓치면 큰 손해인 상황에서 가장 중요하게 볼 지표는?",
        "options": [
          "정밀도",
          "재현율",
          "정확도",
          "특이도"
        ],
        "answer": 1,
        "explain": "재현율 = 실제 불량 중 잡아낸 비율. 놓침(FN)을 줄이는 쪽입니다."
      },
      {
        "kind": "ox",
        "q": "오버샘플링은 train/test로 나누기 전에 전체 데이터에 하는 것이 좋다.",
        "answer": false,
        "explain": "학습 데이터만 오버샘플링해야 합니다. 먼저 하면 복제된 행이 테스트에도 들어가 성능이 부풀려집니다."
      },
      {
        "kind": "choice",
        "q": "예측 확률의 임계값을 0.5에서 0.2로 낮추면?",
        "options": [
          "재현율↑ 정밀도↓ 경향",
          "재현율↓ 정밀도↑ 경향",
          "둘 다 ↑",
          "변화 없음"
        ],
        "answer": 0,
        "explain": "더 많은 건을 양성으로 판정해 놓침은 줄고 오탐은 늘어납니다."
      }
    ]
  },
  {
    "id": "39-Q",
    "unit": 39,
    "title": "모델 해석 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "RandomForestClassifier(n_estimators=10, random_state=0)를 학습한 뒤 feature_importances_의 합을 소수 첫째 자리까지 반올림해 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nX = np.array([[0, 1], [1, 1], [0, 0], [1, 0], [2, 1], [2, 0]])\ny = np.array([0, 1, 0, 1, 1, 1])",
        "expect": "1.0",
        "must": [
          "feature_importances_"
        ],
        "solution": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nX = np.array([[0, 1], [1, 1], [0, 0], [1, 0], [2, 1], [2, 0]])\ny = np.array([0, 1, 0, 1, 1, 1])\nrf = RandomForestClassifier(n_estimators=10, random_state=0).fit(X, y)\nprint(round(rf.feature_importances_.sum(), 1))",
        "explain": "불순도 기반 중요도는 합이 1이 되도록 정규화되어 있습니다."
      },
      {
        "kind": "choice",
        "q": "순열 중요도(permutation importance)는 무엇을 재나?",
        "options": [
          "열의 분산",
          "열을 섞었을 때 모델 점수가 떨어지는 정도",
          "계수의 부호",
          "결측 비율"
        ],
        "answer": 1,
        "explain": "많이 떨어질수록 모델이 그 열에 의존한다는 뜻입니다."
      },
      {
        "kind": "ox",
        "q": "피처 중요도가 높은 변수는 결과의 원인이라고 결론 내릴 수 있다.",
        "answer": false,
        "explain": "예측에 쓰였다는 뜻일 뿐 인과가 아닙니다. 상관된 다른 변수의 대리일 수 있습니다."
      },
      {
        "kind": "choice",
        "q": "단위가 다른 변수들의 선형회귀 계수 크기를 비교하려면?",
        "options": [
          "그대로 비교",
          "변수를 표준화한 뒤 학습한 계수를 비교",
          "절편과 비교",
          "p-value만 비교"
        ],
        "answer": 1,
        "explain": "표준화 후 계수 = 1 표준편차 변화당 효과라 비교할 수 있습니다."
      },
      {
        "kind": "choice",
        "q": "부분 의존도(PDP) 곡선이 평평하면?",
        "options": [
          "그 변수를 바꿔도 평균 예측이 거의 안 변한다",
          "모델이 과적합",
          "변수가 범주형",
          "데이터가 부족"
        ],
        "answer": 0,
        "explain": "평균 예측이 그 변수에 거의 의존하지 않는다는 뜻입니다."
      }
    ]
  },
  {
    "id": "40-Q",
    "unit": 40,
    "title": "퍼셉트론 · 활성화 함수 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "시그모이드 함수 1 / (1 + e^(−z))로 z = 0일 때 값을 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nz = 0",
        "expect": "0.5",
        "must": [
          "exp\\("
        ],
        "solution": "import numpy as np\nz = 0\nprint(1 / (1 + np.exp(-z)))",
        "explain": "e⁰ = 1이므로 1/2."
      },
      {
        "kind": "write",
        "q": "np.maximum으로 z에 ReLU를 적용한 결과를 리스트로 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nz = np.array([-1.5, 0.0, 2.0])",
        "expect": "[0.0, 0.0, 2.0]",
        "must": [
          "maximum\\("
        ],
        "solution": "import numpy as np\nz = np.array([-1.5, 0.0, 2.0])\nprint(np.maximum(0, z).tolist())",
        "explain": "ReLU(z) = max(0, z)."
      },
      {
        "kind": "short",
        "q": "입력 x = [1, 2], 가중치 w = [0.5, −1], 편향 b = 1일 때 가중합 z = w·x + b는?",
        "answer": [
          "-0.5",
          "−0.5"
        ],
        "explain": "0.5·1 + (−1)·2 + 1 = −0.5."
      },
      {
        "kind": "ox",
        "q": "활성화 함수 없이 선형층만 여러 개 쌓아도 곡선 경계를 배울 수 있다.",
        "answer": false,
        "explain": "선형 변환을 여러 번 합성해도 선형입니다. 비선형 활성화가 있어야 곡선 경계를 만듭니다."
      },
      {
        "kind": "choice",
        "q": "단층 퍼셉트론 하나로 풀 수 없는 문제는?",
        "options": [
          "AND",
          "OR",
          "XOR",
          "NOT"
        ],
        "answer": 2,
        "explain": "XOR은 직선 하나로 나눌 수 없어 은닉층이 필요합니다."
      }
    ]
  },
  {
    "id": "41-Q",
    "unit": 41,
    "title": "손실함수 · 경사하강법 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "실제값 y와 예측값 p의 평균제곱오차(MSE)를 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\ny = np.array([3.0, 5.0])\np = np.array([2.0, 6.0])",
        "expect": "1.0",
        "must": [
          "mean\\("
        ],
        "solution": "import numpy as np\ny = np.array([3.0, 5.0])\np = np.array([2.0, 6.0])\nprint(np.mean((y - p) ** 2))",
        "explain": "((1)² + (−1)²) / 2 = 1."
      },
      {
        "kind": "write",
        "q": "손실 L(w) = (w − 3)²에서 w = 0, 학습률 0.1로 경사하강법을 한 번 한 뒤의 w를 출력하는 코드를 작성하세요. (기울기 = 2(w − 3))",
        "given": "w, lr = 0.0, 0.1",
        "expect": "0.6",
        "solution": "w, lr = 0.0, 0.1\nw = w - lr * 2 * (w - 3)\nprint(round(w, 6))",
        "explain": "0 − 0.1 × (−6) = 0.6. 최솟값 3을 향해 움직입니다."
      },
      {
        "kind": "choice",
        "q": "이진 분류 신경망의 출력층 + 손실 조합으로 알맞은 것은?",
        "options": [
          "ReLU + MSE",
          "시그모이드 + 이진 교차엔트로피",
          "tanh + MAE",
          "선형 + 교차엔트로피"
        ],
        "answer": 1,
        "explain": "시그모이드로 확률을 만들고 교차엔트로피로 벌점을 줍니다."
      },
      {
        "kind": "ox",
        "q": "학습률이 너무 크면 손실이 줄지 않고 오히려 커지며 발산할 수 있다.",
        "answer": true,
        "explain": "최솟값을 지나쳐 반대편으로 더 크게 튀기 때문입니다."
      },
      {
        "kind": "choice",
        "q": "미니배치 SGD가 전체 배치 경사하강법보다 좋은 점은?",
        "options": [
          "항상 더 정확한 기울기",
          "한 번 업데이트가 빠르고 메모리를 적게 씀",
          "학습률이 필요 없음",
          "손실이 항상 단조 감소"
        ],
        "answer": 1,
        "explain": "일부 샘플로 기울기를 추정해 자주 업데이트합니다. 대신 경로가 흔들립니다."
      }
    ]
  },
  {
    "id": "42-Q",
    "unit": 42,
    "title": "순전파 · 역전파 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "y = (2x + 1)² 에서 x = 1일 때 연쇄법칙으로 dy/dx를 계산해 출력하는 코드를 작성하세요. (u = 2x + 1, dy/du = 2u, du/dx = 2)",
        "given": "x = 1",
        "expect": "12",
        "solution": "x = 1\nu = 2 * x + 1\nprint(2 * u * 2)",
        "explain": "dy/dx = 2u · 2 = 2·3·2 = 12."
      },
      {
        "kind": "choice",
        "q": "역전파에서 각 가중치의 기울기를 구할 때 쓰는 미분 규칙은?",
        "options": [
          "곱의 법칙만",
          "연쇄법칙",
          "로피탈 정리",
          "적분"
        ],
        "answer": 1,
        "explain": "출력에서 입력 쪽으로 국소 기울기를 곱해 나갑니다."
      },
      {
        "kind": "ox",
        "q": "역전파에는 순전파 때 계산한 중간값이 필요하다.",
        "answer": true,
        "explain": "예: ReLU의 기울기는 순전파 입력이 양수였는지에 달려 있습니다. 그래서 학습 때 메모리를 더 씁니다."
      },
      {
        "kind": "choice",
        "q": "ReLU 노드에서 순전파 입력이 −2였다면, 그 노드를 지나는 기울기는?",
        "options": [
          "그대로 전달",
          "0",
          "2배",
          "−1배"
        ],
        "answer": 1,
        "explain": "z < 0이면 ReLU의 기울기는 0입니다."
      },
      {
        "kind": "ox",
        "q": "덧셈 노드(z = x + y)는 역전파 때 위에서 온 기울기를 두 입력에 그대로 나눠 준다.",
        "answer": true,
        "explain": "∂z/∂x = ∂z/∂y = 1이기 때문입니다."
      }
    ]
  },
  {
    "id": "43-Q",
    "unit": 43,
    "title": "MLP 학습 · 과적합 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "데이터 1,000개, 배치 크기 32일 때 1에폭의 업데이트 횟수(마지막 배치 포함)를 출력하는 코드를 작성하세요.",
        "given": "import math",
        "expect": "32",
        "solution": "import math\nprint(math.ceil(1000 / 32))",
        "explain": "1000 / 32 = 31.25 → 마지막 작은 배치까지 32번."
      },
      {
        "kind": "choice",
        "q": "학습 손실은 계속 줄고 검증 손실이 5에폭부터 오르기 시작했다. 알맞은 조치는?",
        "options": [
          "학습률을 크게 올린다",
          "에폭을 늘린다",
          "조기 종료 · 드롭아웃 등 규제를 쓴다",
          "검증 데이터를 학습에 합친다"
        ],
        "answer": 2,
        "explain": "과적합 신호입니다."
      },
      {
        "kind": "ox",
        "q": "드롭아웃은 예측(추론) 때도 매번 무작위로 뉴런을 끈다.",
        "answer": false,
        "explain": "학습 때만 끄고, 추론 때는 모두 켠 채 스케일을 맞춥니다."
      },
      {
        "kind": "choice",
        "q": "은닉층 2개(각 10개 뉴런), 입력 4, 출력 1인 MLP의 첫 층 가중치 행렬 모양은? (입력 × 뉴런)",
        "options": [
          "(4, 10)",
          "(10, 10)",
          "(10, 1)",
          "(4, 1)"
        ],
        "answer": 0,
        "explain": "4개 입력이 10개 뉴런으로 갑니다. 편향 10개가 따로 있습니다."
      },
      {
        "kind": "ox",
        "q": "입력 특성을 표준화하면 신경망 학습이 더 안정적인 경우가 많다.",
        "answer": true,
        "explain": "범위가 비슷해야 기울기 크기가 고르게 되어 학습률 하나로 잘 학습됩니다."
      }
    ]
  },
  {
    "id": "44-Q",
    "unit": 44,
    "title": "CNN 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "입력 28, 필터 3, 패딩 0, 스트라이드 1일 때 합성곱 출력 크기 (N − F + 2P) / S + 1을 출력하는 코드를 작성하세요.",
        "given": "N, F, P, S = 28, 3, 0, 1",
        "expect": "26",
        "solution": "N, F, P, S = 28, 3, 0, 1\nprint((N - F + 2 * P) // S + 1)",
        "explain": "28 − 3 + 1 = 26."
      },
      {
        "kind": "write",
        "q": "2×2 최대 풀링(스트라이드 2)을 a에 적용한 결과를 리스트로 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\na = np.arange(1, 17).reshape(4, 4)",
        "expect": "[[6, 8], [14, 16]]",
        "solution": "import numpy as np\na = np.arange(1, 17).reshape(4, 4)\nprint(a.reshape(2, 2, 2, 2).max(axis=(1, 3)).tolist())",
        "explain": "각 2×2 칸의 최댓값입니다. 반복문으로 칸마다 max를 구해도 됩니다."
      },
      {
        "kind": "choice",
        "q": "CNN이 완전연결층보다 이미지에 적은 파라미터로 잘 동작하는 핵심 이유는?",
        "options": [
          "활성화 함수가 달라서",
          "같은 필터를 모든 위치에서 공유해서",
          "풀링이 없어서",
          "배치가 커서"
        ],
        "answer": 1,
        "explain": "가중치 공유와 국소 연결 덕분입니다."
      },
      {
        "kind": "ox",
        "q": "3×3 필터에 패딩 1, 스트라이드 1이면 출력 크기가 입력과 같다.",
        "answer": true,
        "explain": "(N − 3 + 2) / 1 + 1 = N. 'same' 패딩이라고 부릅니다."
      },
      {
        "kind": "choice",
        "q": "RGB 입력(채널 3)에 3×3 필터 16개를 쓰는 합성곱층의 가중치 수는? (편향 제외)",
        "options": [
          "144",
          "432",
          "48",
          "9"
        ],
        "answer": 1,
        "explain": "3 × 3 × 3 × 16 = 432."
      }
    ]
  },
  {
    "id": "45-Q",
    "unit": 45,
    "title": "RNN · 시퀀스 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "기울기에 0.5를 30번 곱했을 때 값이 1e-6보다 작은지 출력하는 코드를 작성하세요.",
        "expect": "True",
        "must": [
          "\\*\\*\\s*30"
        ],
        "solution": "print(0.5 ** 30 < 1e-6)",
        "explain": "0.5³⁰ ≈ 9.3e-10. 같은 값을 여러 번 곱하면 기울기가 사라집니다."
      },
      {
        "kind": "choice",
        "q": "RNN이 시점마다 같은 가중치를 쓰는 이유로 알맞은 것은?",
        "options": [
          "메모리를 늘리려고",
          "길이가 다른 시퀀스를 같은 규칙으로 처리하려고",
          "병렬 계산을 위해",
          "과적합을 늘리려고"
        ],
        "answer": 1,
        "explain": "시간을 따라 같은 셀을 반복 적용합니다."
      },
      {
        "kind": "ox",
        "q": "기본 RNN은 긴 시퀀스에서 앞쪽 정보의 기울기가 사라지기 쉽다.",
        "answer": true,
        "explain": "역전파 때 같은 행렬과 tanh 미분을 여러 번 곱하기 때문입니다."
      },
      {
        "kind": "choice",
        "q": "LSTM이 긴 의존성을 보존하는 장치는?",
        "options": [
          "풀링",
          "게이트와 셀 상태",
          "드롭아웃",
          "배치 정규화"
        ],
        "answer": 1,
        "explain": "입력·망각·출력 게이트가 셀 상태로 정보를 오래 전달합니다."
      },
      {
        "kind": "choice",
        "q": "설비 센서의 지난 60분 값으로 다음 10분 고장 여부를 예측하는 문제의 입력 형태는?",
        "options": [
          "표 한 행",
          "시퀀스",
          "이미지",
          "그래프"
        ],
        "answer": 1,
        "explain": "시간 순서가 있는 시퀀스 → RNN · 1D CNN · Transformer 등을 씁니다."
      }
    ]
  },
  {
    "id": "46-Q",
    "unit": 46,
    "title": "임베딩 · 어텐션 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "np.exp로 scores에 softmax를 적용한 결과의 합을 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nscores = np.array([2.0, 1.0, 0.1])",
        "expect": "1.0",
        "must": [
          "exp\\("
        ],
        "solution": "import numpy as np\nscores = np.array([2.0, 1.0, 0.1])\nw = np.exp(scores) / np.exp(scores).sum()\nprint(round(w.sum(), 6))",
        "explain": "softmax 가중치는 0~1이고 합이 1입니다."
      },
      {
        "kind": "choice",
        "q": "스케일드 닷프로덕트 어텐션에서 QKᵀ를 √d로 나누는 이유는?",
        "options": [
          "계산을 빠르게",
          "차원이 크면 점수가 커져 softmax가 한쪽으로 쏠리는 것을 막으려고",
          "V의 크기를 맞추려고",
          "음수를 없애려고"
        ],
        "answer": 1,
        "explain": "값이 너무 크면 softmax가 거의 원-핫이 되어 기울기가 작아집니다."
      },
      {
        "kind": "ox",
        "q": "어텐션은 문장 안 모든 위치를 한 번에 비교하므로 멀리 떨어진 단어 관계도 바로 반영할 수 있다.",
        "answer": true,
        "explain": "RNN처럼 차례로 전달하지 않아도 됩니다."
      },
      {
        "kind": "choice",
        "q": "Transformer에 위치 인코딩이 필요한 이유는?",
        "options": [
          "단어 수를 줄이려고",
          "어텐션 자체에는 순서 정보가 없어서",
          "softmax를 위해",
          "임베딩 차원을 늘리려고"
        ],
        "answer": 1,
        "explain": "어텐션은 집합 연산처럼 순서를 모르므로 위치 정보를 더해 줍니다."
      },
      {
        "kind": "ox",
        "q": "임베딩에서 의미가 비슷한 단어는 벡터 공간에서 가까이 놓이도록 학습된다.",
        "answer": true,
        "explain": "코사인 유사도 등으로 비슷한 단어를 찾을 수 있습니다."
      }
    ]
  }
];
