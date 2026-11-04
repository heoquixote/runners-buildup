// 통계 · 머신러닝 트랙 문제 (유닛 12~20). scipy · scikit-learn 은 브라우저(Pyodide)에서 import 할 때 내려받는다.
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.
// 문제를 고치면 `node scripts/verify.mjs` 로 모범답안이 통과하고 시작 코드는 통과하지 않는지 확인한다.
export const SM_UNITS = [
  {
    "id": 12,
    "title": "기술통계",
    "summary": "평균 · 중앙값 · 표준편차 · 사분위수 · IQR 이상치",
    "note": "<h4>대표값은 하나만 보지 않습니다</h4><p>평균은 이상치에 끌려가고, 중앙값은 순서의 가운데라 덜 흔들립니다. 두 값이 크게 다르면 분포가 한쪽으로 치우친 것입니다.</p><h4>흩어짐</h4><p>표본 표준편차는 <code>np.std(x, ddof=1)</code>입니다. 사분위수 범위 IQR = Q3 − Q1, 이상치 기준은 Q1 − 1.5·IQR 미만 또는 Q3 + 1.5·IQR 초과입니다.</p><h4>변동계수 CV</h4><p>단위나 평균 크기가 다른 두 데이터의 흩어짐을 비교할 때 CV = 표준편차 / 평균 을 씁니다.</p>"
  },
  {
    "id": 13,
    "title": "확률분포",
    "summary": "이항 · 포아송 · 정규분포를 scipy.stats로 계산",
    "note": "<h4>세 가지 분포</h4><ul><li>이항 <code>stats.binom(n, p)</code>: n번 중 성공(불량) 횟수</li><li>포아송 <code>stats.poisson(mu)</code>: 단위 시간·면적당 발생 건수</li><li>정규 <code>stats.norm(loc=평균, scale=표준편차)</code>: 연속 측정값</li></ul><h4>자주 쓰는 메서드</h4><p><code>pmf(k)</code> 정확히 k, <code>cdf(k)</code> k 이하, <code>sf(k)</code> k 초과(= 1 − cdf), <code>ppf(q)</code> 하위 q 지점의 값.</p><p class=\"qc\">\"3개 이상\"은 <code>sf(2)</code>입니다. sf(k)는 k를 포함하지 않습니다.</p>"
  },
  {
    "id": 14,
    "title": "표본분포와 중심극한정리",
    "summary": "표준오차 SE = σ/√n, 표본평균의 분포 시뮬레이션",
    "note": "<h4>표준오차</h4><p>표본평균의 흩어짐은 SE = σ / √n 입니다. 표본을 4배로 늘려야 SE가 절반이 됩니다.</p><h4>중심극한정리</h4><p>원래 분포가 치우쳐 있어도, 표본 크기가 충분하면 표본평균의 분포는 정규분포에 가까워집니다. 시뮬레이션으로 확인할 때는 <code>np.random.default_rng(시드)</code>로 난수를 고정합니다.</p>"
  },
  {
    "id": 15,
    "title": "신뢰구간",
    "summary": "t 분포로 평균의 95% 신뢰구간, 비율의 신뢰구간",
    "note": "<h4>평균의 신뢰구간</h4><p>x̄ ± t<sub>0.975, n−1</sub> · s/√n. 임계값은 <code>stats.t.ppf(0.975, df=n-1)</code>입니다.</p><h4>비율의 신뢰구간 (정규근사)</h4><p>p̂ ± 1.96 · √(p̂(1−p̂)/n). 1.96은 <code>stats.norm.ppf(0.975)</code>입니다.</p><p class=\"qc\">95%는 \"이 구간에 참값이 있을 확률\"이 아니라, 같은 방법으로 구간을 100번 만들면 약 95번 참값을 포함한다는 뜻입니다.</p>"
  },
  {
    "id": 16,
    "title": "가설검정과 t검정",
    "summary": "p-value, 1표본 · 독립 2표본(Welch) · 대응표본 t검정",
    "note": "<h4>세 가지 t검정</h4><ul><li>1표본: <code>stats.ttest_1samp(x, 기준값)</code></li><li>독립 2표본: <code>stats.ttest_ind(a, b, equal_var=False)</code> (Welch, 분산이 같다고 가정하지 않음)</li><li>대응표본(같은 대상 전후): <code>stats.ttest_rel(전, 후)</code></li></ul><h4>판정</h4><p>결과의 <code>.pvalue</code>가 유의수준(보통 0.05)보다 작으면 귀무가설을 기각합니다. 단측검정은 <code>alternative='less'</code> 또는 <code>'greater'</code>.</p>"
  },
  {
    "id": 17,
    "title": "ML 워크플로와 데이터 분할",
    "summary": "train/test 분할, stratify, 기준 모델, 데이터 누수",
    "note": "<h4>분할부터</h4><p><code>train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)</code>. stratify를 주면 두 세트의 클래스 비율이 같아집니다.</p><h4>기준 모델</h4><p>가장 많은 클래스만 예측하는 모델(<code>DummyClassifier(strategy='most_frequent')</code>)의 정확도가 넘어야 할 최소선입니다.</p><h4>누수</h4><p>스케일링·결측 대체에 쓰는 평균은 <b>학습 데이터</b>로만 계산합니다. 테스트 데이터가 섞이면 성능이 부풀려집니다.</p>"
  },
  {
    "id": 18,
    "title": "선형 · 로지스틱 회귀",
    "summary": "LinearRegression 계수·R², LogisticRegression 확률 출력",
    "note": "<h4>선형회귀</h4><p><code>model = LinearRegression().fit(X, y)</code> 후 <code>model.coef_</code>(기울기), <code>model.intercept_</code>(절편), <code>model.score(X, y)</code>(R²). X는 2차원이어야 하므로 열 하나면 <code>x.reshape(-1, 1)</code>.</p><h4>로지스틱 회귀</h4><p><code>predict_proba(X)[:, 1]</code>이 클래스 1일 확률입니다. <code>predict</code>는 이 확률이 0.5 이상이면 1로 판정합니다.</p>"
  },
  {
    "id": 19,
    "title": "평가지표",
    "summary": "혼동행렬, precision · recall · F1, 임계값, ROC-AUC",
    "note": "<h4>혼동행렬</h4><p><code>confusion_matrix(y_true, y_pred)</code>는 [[TN, FP], [FN, TP]] 순서입니다. <code>.ravel()</code>로 네 값을 풀 수 있습니다.</p><h4>무엇을 볼까</h4><p>precision = TP/(TP+FP), recall = TP/(TP+FN). 불량을 놓치면 큰일 나는 검사는 recall을, 오탐 비용이 큰 일은 precision을 우선합니다.</p><h4>임계값</h4><p>확률을 몇 이상에서 1로 볼지 낮추면 recall은 오르고 precision은 내려갑니다. ROC-AUC(<code>roc_auc_score(y, 확률)</code>)는 임계값과 무관한 순서 능력입니다.</p>"
  },
  {
    "id": 20,
    "title": "트리와 앙상블",
    "summary": "결정트리 깊이와 과적합, 랜덤포레스트, 피처 중요도",
    "note": "<h4>결정트리</h4><p><code>DecisionTreeClassifier(max_depth=3, random_state=0)</code>. 깊이가 깊을수록 학습 정확도는 오르지만 테스트 정확도는 어느 순간 떨어집니다(과적합).</p><h4>랜덤포레스트</h4><p>여러 트리의 투표로 분산을 줄입니다. <code>n_estimators</code>, <code>random_state</code>를 고정해야 결과가 재현됩니다.</p><h4>피처 중요도</h4><p><code>model.feature_importances_</code>의 합은 1입니다. <code>np.argmax</code>로 가장 중요한 열을 찾습니다.</p>"
  }
];

export const SM_PROBLEMS = [
  {
    "id": "12-1",
    "unit": 12,
    "domain": "mfg",
    "title": "도금 두께 요약하기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "np.mean / np.median",
        "평균 / 중앙값"
      ],
      [
        "np.std(x, ddof=1)",
        "표본 표준편차"
      ],
      [
        "np.percentile(x, [25, 75])",
        "1·3사분위수"
      ]
    ],
    "origin": "신규",
    "desc": "<p>도금 두께(µm) 12개 측정값을 요약합니다.</p>\n<ol><li><code>mean_t</code>: 평균</li><li><code>median_t</code>: 중앙값</li><li><code>std_t</code>: 표본 표준편차</li><li><code>iqr_t</code>: IQR (Q3 − Q1)</li></ol>\n<p class=\"qc\">평균이 중앙값보다 큰 이유는 9.9 하나 때문입니다. 이상치가 있으면 중앙값이 대표값으로 더 안정적입니다.</p>",
    "starter": "import numpy as np\n\nthick = np.array([8.2, 8.5, 8.1, 8.4, 8.3, 9.9, 8.2, 8.6, 8.0, 8.4, 8.3, 8.5])\n\n# 1. 평균\nmean_t = \n# 2. 중앙값\nmedian_t = \n# 3. 표본 표준편차\nstd_t = \n# 4. IQR (Q3 − Q1)\niqr_t = \n\nprint(f\"평균 {mean_t:.3f}, 중앙값 {median_t:.3f}, 표준편차 {std_t:.3f}, IQR {iqr_t:.3f}\")\n",
    "solution": "import numpy as np\n\nthick = np.array([8.2, 8.5, 8.1, 8.4, 8.3, 9.9, 8.2, 8.6, 8.0, 8.4, 8.3, 8.5])\n\n# 1. 평균\nmean_t = np.mean(thick)\n# 2. 중앙값\nmedian_t = np.median(thick)\n# 3. 표본 표준편차\nstd_t = np.std(thick, ddof=1)\n# 4. IQR (Q3 − Q1)\niqr_t = np.percentile(thick, 75) - np.percentile(thick, 25)\n\nprint(f\"평균 {mean_t:.3f}, 중앙값 {median_t:.3f}, 표준편차 {std_t:.3f}, IQR {iqr_t:.3f}\")\n",
    "hints": [
      "np.mean(thick)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 평균",
        "expr": "abs(mean_t - 8.450000000000001) < 0.000845",
        "hint": "np.mean(thick)"
      },
      {
        "label": "2단계 중앙값",
        "expr": "abs(median_t - 8.350000000000001) < 0.000835",
        "hint": "np.median(thick)"
      },
      {
        "label": "3단계 표본 표준편차",
        "expr": "abs(std_t - 0.4889692312312802) < 4.89e-05",
        "hint": "ddof=1 을 넣었는지 확인하세요."
      },
      {
        "label": "4단계 IQR (Q3 − Q1)",
        "expr": "abs(iqr_t - 0.3000000000000007) < 3e-05",
        "hint": "np.percentile(thick, 75) - np.percentile(thick, 25)"
      }
    ]
  },
  {
    "id": "12-2",
    "unit": 12,
    "domain": "mfg",
    "title": "IQR로 이상 측정값 찾기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "np.percentile",
        "사분위수"
      ],
      [
        "x[(x < 하한) | (x > 상한)]",
        "조건에 맞는 값만 꺼내기"
      ]
    ],
    "origin": "신규",
    "desc": "<p>설비 진동(mm/s) 15개에서 IQR 규칙으로 이상치를 찾습니다. 기준은 Q1 − 1.5·IQR 미만 또는 Q3 + 1.5·IQR 초과입니다.</p>\n<ol><li><code>iqr</code>: IQR</li><li><code>lower</code>: 하한 Q1 − 1.5·IQR</li><li><code>upper</code>: 상한 Q3 + 1.5·IQR</li><li><code>outliers</code>: 이상치 배열</li><li><code>n_out</code>: 이상치 개수</li></ol>",
    "starter": "import numpy as np\n\nvib = np.array([2.1, 2.3, 2.2, 2.4, 2.0, 2.2, 5.8, 2.3, 2.1, 2.5, 2.2, 0.4, 2.3, 2.4, 2.2])\nq1, q3 = np.percentile(vib, [25, 75])\n\n# 1. IQR\niqr = \n# 2. 하한 Q1 − 1.5·IQR\nlower = \n# 3. 상한 Q3 + 1.5·IQR\nupper = \n# 4. 이상치 배열\noutliers = \n# 5. 이상치 개수\nn_out = \n\nprint(iqr, lower, upper, outliers, n_out)\n",
    "solution": "import numpy as np\n\nvib = np.array([2.1, 2.3, 2.2, 2.4, 2.0, 2.2, 5.8, 2.3, 2.1, 2.5, 2.2, 0.4, 2.3, 2.4, 2.2])\nq1, q3 = np.percentile(vib, [25, 75])\n\n# 1. IQR\niqr = q3 - q1\n# 2. 하한 Q1 − 1.5·IQR\nlower = q1 - 1.5 * iqr\n# 3. 상한 Q3 + 1.5·IQR\nupper = q3 + 1.5 * iqr\n# 4. 이상치 배열\noutliers = vib[(vib < lower) | (vib > upper)]\n# 5. 이상치 개수\nn_out = len(outliers)\n\nprint(iqr, lower, upper, outliers, n_out)\n",
    "hints": [
      "q3 - q1",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 IQR",
        "expr": "abs(iqr - 0.1999999999999993) < 2e-05",
        "hint": "q3 - q1"
      },
      {
        "label": "2단계 하한 Q1 − 1.5·IQR",
        "expr": "abs(lower - 1.8500000000000014) < 0.000185",
        "hint": "q1 - 1.5 * iqr"
      },
      {
        "label": "3단계 상한 Q3 + 1.5·IQR",
        "expr": "abs(upper - 2.6499999999999986) < 0.000265",
        "hint": "q3 + 1.5 * iqr"
      },
      {
        "label": "4단계 이상치 배열",
        "expr": "sorted(np.asarray(outliers).tolist()) == [0.4, 5.8]",
        "hint": "vib[(vib < lower) | (vib > upper)]  괄호를 꼭 감싸세요."
      },
      {
        "label": "5단계 이상치 개수",
        "expr": "int(n_out) == 2",
        "hint": "len(outliers)"
      }
    ]
  },
  {
    "id": "12-3",
    "unit": 12,
    "domain": "general",
    "title": "카페 일 매출 요약하기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "np.mean / np.median",
        "평균 / 중앙값"
      ],
      [
        "np.std(x, ddof=1)",
        "표본 표준편차"
      ]
    ],
    "origin": "신규",
    "desc": "<p>카페의 2주간 일 매출(만 원)입니다. 행사 날이 하루 있습니다.</p>\n<ol><li><code>mean_s</code>: 평균</li><li><code>median_s</code>: 중앙값</li><li><code>std_s</code>: 표본 표준편차</li><li><code>gap</code>: 평균 − 중앙값</li></ol>\n<p class=\"qc\">평균과 중앙값의 차이가 크면 오른쪽 꼬리(큰 값)가 있다는 신호입니다.</p>",
    "starter": "import numpy as np\n\nsales = np.array([52, 48, 55, 50, 47, 61, 58, 49, 53, 51, 120, 54, 50, 56])\n\n# 1. 평균\nmean_s = \n# 2. 중앙값\nmedian_s = \n# 3. 표본 표준편차\nstd_s = \n# 4. 평균 − 중앙값\ngap = \n\nprint(mean_s, median_s, round(std_s, 2), round(gap, 2))\n",
    "solution": "import numpy as np\n\nsales = np.array([52, 48, 55, 50, 47, 61, 58, 49, 53, 51, 120, 54, 50, 56])\n\n# 1. 평균\nmean_s = np.mean(sales)\n# 2. 중앙값\nmedian_s = np.median(sales)\n# 3. 표본 표준편차\nstd_s = np.std(sales, ddof=1)\n# 4. 평균 − 중앙값\ngap = mean_s - median_s\n\nprint(mean_s, median_s, round(std_s, 2), round(gap, 2))\n",
    "hints": [
      "np.mean(sales)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 평균",
        "expr": "abs(mean_s - 57.42857142857143) < 0.00574",
        "hint": "np.mean(sales)"
      },
      {
        "label": "2단계 중앙값",
        "expr": "abs(median_s - 52.5) < 0.00525",
        "hint": "np.median(sales)"
      },
      {
        "label": "3단계 표본 표준편차",
        "expr": "abs(std_s - 18.43372446908649) < 0.00184",
        "hint": "ddof=1"
      },
      {
        "label": "4단계 평균 − 중앙값",
        "expr": "abs(gap - 4.928571428571431) < 0.000493",
        "hint": "mean_s - median_s"
      }
    ]
  },
  {
    "id": "12-4",
    "unit": 12,
    "domain": "general",
    "title": "두 지점의 흩어짐 비교 (변동계수)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "CV = std / mean",
        "단위가 달라도 비교 가능한 흩어짐"
      ]
    ],
    "origin": "신규",
    "desc": "<p>A 지점(평균 대기시간이 짧음)과 B 지점(평균 대기시간이 김)의 대기시간(분)입니다. 표준편차만 비교하면 평균 크기 차이에 속습니다. 변동계수로 비교하세요.</p>\n<ol><li><code>std_a</code>: A 표본 표준편차</li><li><code>std_b</code>: B 표본 표준편차</li><li><code>cv_a</code>: A 변동계수</li><li><code>cv_b</code>: B 변동계수</li><li><code>more_variable</code>: 상대적으로 더 들쭉날쭉한 지점 (&#x27;A&#x27; 또는 &#x27;B&#x27;)</li></ol>",
    "starter": "import numpy as np\n\na = np.array([4, 6, 5, 3, 7, 5, 4, 6])\nb = np.array([28, 31, 30, 27, 33, 29, 32, 30])\n\n# 1. A 표본 표준편차\nstd_a = \n# 2. B 표본 표준편차\nstd_b = \n# 3. A 변동계수\ncv_a = \n# 4. B 변동계수\ncv_b = \n# 5. 상대적으로 더 들쭉날쭉한 지점 ('A' 또는 'B')\nmore_variable = \n\nprint(round(cv_a, 3), round(cv_b, 3), more_variable)\n",
    "solution": "import numpy as np\n\na = np.array([4, 6, 5, 3, 7, 5, 4, 6])\nb = np.array([28, 31, 30, 27, 33, 29, 32, 30])\n\n# 1. A 표본 표준편차\nstd_a = np.std(a, ddof=1)\n# 2. B 표본 표준편차\nstd_b = np.std(b, ddof=1)\n# 3. A 변동계수\ncv_a = std_a / np.mean(a)\n# 4. B 변동계수\ncv_b = std_b / np.mean(b)\n# 5. 상대적으로 더 들쭉날쭉한 지점 ('A' 또는 'B')\nmore_variable = 'A' if cv_a > cv_b else 'B'\n\nprint(round(cv_a, 3), round(cv_b, 3), more_variable)\n",
    "hints": [
      "ddof=1",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 A 표본 표준편차",
        "expr": "abs(std_a - 1.3093073414159542) < 0.000131",
        "hint": "ddof=1"
      },
      {
        "label": "2단계 B 표본 표준편차",
        "expr": "abs(std_b - 2.0) < 0.0002",
        "hint": "ddof=1"
      },
      {
        "label": "3단계 A 변동계수",
        "expr": "abs(cv_a - 0.26186146828319085) < 2.62e-05",
        "hint": "std_a / np.mean(a)"
      },
      {
        "label": "4단계 B 변동계수",
        "expr": "abs(cv_b - 0.06666666666666667) < 6.67e-06",
        "hint": "std_b / np.mean(b)"
      },
      {
        "label": "5단계 상대적으로 더 들쭉날쭉한 지점 ('A' 또는 'B')",
        "expr": "more_variable == \"A\"",
        "hint": "변동계수가 큰 쪽입니다."
      }
    ]
  },
  {
    "id": "13-1",
    "unit": 13,
    "domain": "mfg",
    "title": "로트 불량 개수 확률 (이항분포)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.binom(n, p)",
        "이항분포"
      ],
      [
        ".pmf(k)",
        "정확히 k개"
      ],
      [
        ".sf(k)",
        "k개 초과"
      ]
    ],
    "origin": "신규",
    "desc": "<p>불량률이 2%인 공정에서 50개를 뽑아 검사합니다.</p>\n<ol><li><code>p0</code>: 불량이 하나도 없을 확률</li><li><code>p_ge3</code>: 불량이 3개 이상일 확률</li><li><code>expected</code>: 기대 불량 개수</li></ol>",
    "starter": "from scipy import stats\n\nn, p = 50, 0.02\nlot = stats.binom(n, p)\n\n# 1. 불량이 하나도 없을 확률\np0 = \n# 2. 불량이 3개 이상일 확률\np_ge3 = \n# 3. 기대 불량 개수\nexpected = \n\nprint(round(p0, 4), round(p_ge3, 4), expected)\n",
    "solution": "from scipy import stats\n\nn, p = 50, 0.02\nlot = stats.binom(n, p)\n\n# 1. 불량이 하나도 없을 확률\np0 = lot.pmf(0)\n# 2. 불량이 3개 이상일 확률\np_ge3 = lot.sf(2)\n# 3. 기대 불량 개수\nexpected = lot.mean()\n\nprint(round(p0, 4), round(p_ge3, 4), expected)\n",
    "hints": [
      "lot.pmf(0)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 불량이 하나도 없을 확률",
        "expr": "abs(p0 - 0.36416968008711703) < 3.64e-05",
        "hint": "lot.pmf(0)"
      },
      {
        "label": "2단계 불량이 3개 이상일 확률",
        "expr": "abs(p_ge3 - 0.07842774835096904) < 7.84e-06",
        "hint": "3개 이상 = 2개 초과 → lot.sf(2)"
      },
      {
        "label": "3단계 기대 불량 개수",
        "expr": "abs(expected - 1.0) < 0.0001",
        "hint": "lot.mean() 또는 n * p"
      }
    ]
  },
  {
    "id": "13-2",
    "unit": 13,
    "domain": "mfg",
    "title": "규격을 벗어나는 비율 (정규분포)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.norm(loc, scale)",
        "정규분포"
      ],
      [
        ".cdf(x)",
        "x 이하 확률"
      ],
      [
        ".sf(x)",
        "x 초과 확률"
      ]
    ],
    "origin": "신규",
    "desc": "<p>충전량이 평균 500.4g, 표준편차 1.2g인 정규분포를 따릅니다. 규격은 498 ~ 503g입니다.</p>\n<ol><li><code>p_low</code>: 하한 미만 비율</li><li><code>p_high</code>: 상한 초과 비율</li><li><code>ppm</code>: 규격 이탈 ppm (백만 개당)</li><li><code>worse_side</code>: 더 많이 벗어나는 쪽 (&#x27;low&#x27; 또는 &#x27;high&#x27;)</li></ol>",
    "starter": "from scipy import stats\n\nfill = stats.norm(loc=500.4, scale=1.2)\nLSL, USL = 498, 503\n\n# 1. 하한 미만 비율\np_low = \n# 2. 상한 초과 비율\np_high = \n# 3. 규격 이탈 ppm (백만 개당)\nppm = \n# 4. 더 많이 벗어나는 쪽 ('low' 또는 'high')\nworse_side = \n\nprint(round(p_low, 5), round(p_high, 5), round(ppm), worse_side)\n",
    "solution": "from scipy import stats\n\nfill = stats.norm(loc=500.4, scale=1.2)\nLSL, USL = 498, 503\n\n# 1. 하한 미만 비율\np_low = fill.cdf(LSL)\n# 2. 상한 초과 비율\np_high = fill.sf(USL)\n# 3. 규격 이탈 ppm (백만 개당)\nppm = (p_low + p_high) * 1_000_000\n# 4. 더 많이 벗어나는 쪽 ('low' 또는 'high')\nworse_side = 'low' if p_low > p_high else 'high'\n\nprint(round(p_low, 5), round(p_high, 5), round(ppm), worse_side)\n",
    "hints": [
      "fill.cdf(LSL)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 하한 미만 비율",
        "expr": "abs(p_low - 0.022750131948180218) < 2.28e-06",
        "hint": "fill.cdf(LSL)"
      },
      {
        "label": "2단계 상한 초과 비율",
        "expr": "abs(p_high - 0.015130140010235087) < 1.51e-06",
        "hint": "fill.sf(USL)"
      },
      {
        "label": "3단계 규격 이탈 ppm (백만 개당)",
        "expr": "abs(ppm - 37880.2719584153) < 3.79",
        "hint": "(p_low + p_high) * 1_000_000"
      },
      {
        "label": "4단계 더 많이 벗어나는 쪽 ('low' 또는 'high')",
        "expr": "worse_side == \"low\"",
        "hint": "p_low와 p_high를 비교하세요."
      }
    ]
  },
  {
    "id": "13-3",
    "unit": 13,
    "domain": "general",
    "title": "시간당 방문 고객 수 (포아송분포)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.poisson(mu)",
        "포아송분포"
      ],
      [
        ".pmf(k)",
        "정확히 k명"
      ],
      [
        ".sf(k)",
        "k명 초과"
      ]
    ],
    "origin": "신규",
    "desc": "<p>매장에 시간당 평균 4명이 방문합니다.</p>\n<ol><li><code>p_none</code>: 한 시간 동안 아무도 안 올 확률</li><li><code>p_ge6</code>: 6명 이상 올 확률</li><li><code>p_2to5</code>: 2명 이상 5명 이하일 확률</li></ol>",
    "starter": "from scipy import stats\n\nvisit = stats.poisson(4)\n\n# 1. 한 시간 동안 아무도 안 올 확률\np_none = \n# 2. 6명 이상 올 확률\np_ge6 = \n# 3. 2명 이상 5명 이하일 확률\np_2to5 = \n\nprint(round(p_none, 4), round(p_ge6, 4), round(p_2to5, 4))\n",
    "solution": "from scipy import stats\n\nvisit = stats.poisson(4)\n\n# 1. 한 시간 동안 아무도 안 올 확률\np_none = visit.pmf(0)\n# 2. 6명 이상 올 확률\np_ge6 = visit.sf(5)\n# 3. 2명 이상 5명 이하일 확률\np_2to5 = visit.cdf(5) - visit.cdf(1)\n\nprint(round(p_none, 4), round(p_ge6, 4), round(p_2to5, 4))\n",
    "hints": [
      "visit.pmf(0)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 한 시간 동안 아무도 안 올 확률",
        "expr": "abs(p_none - 0.01831563888873418) < 1.83e-06",
        "hint": "visit.pmf(0)"
      },
      {
        "label": "2단계 6명 이상 올 확률",
        "expr": "abs(p_ge6 - 0.2148696129695948) < 2.15e-05",
        "hint": "6명 이상 = 5명 초과"
      },
      {
        "label": "3단계 2명 이상 5명 이하일 확률",
        "expr": "abs(p_2to5 - 0.6935521925867343) < 6.94e-05",
        "hint": "cdf(5) - cdf(1)"
      }
    ]
  },
  {
    "id": "13-4",
    "unit": 13,
    "domain": "general",
    "title": "상위 10% 기준 점수 (정규분포 ppf)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        ".ppf(q)",
        "하위 q 지점의 값 (cdf의 역함수)"
      ]
    ],
    "origin": "신규",
    "desc": "<p>시험 점수가 평균 68점, 표준편차 12점인 정규분포를 따릅니다.</p>\n<ol><li><code>cut_top10</code>: 상위 10%에 들기 위한 점수</li><li><code>p_over80</code>: 80점 초과 비율</li><li><code>z_80</code>: 80점의 z점수</li></ol>",
    "starter": "from scipy import stats\n\nscore = stats.norm(loc=68, scale=12)\n\n# 1. 상위 10%에 들기 위한 점수\ncut_top10 = \n# 2. 80점 초과 비율\np_over80 = \n# 3. 80점의 z점수\nz_80 = \n\nprint(round(cut_top10, 2), round(p_over80, 4), z_80)\n",
    "solution": "from scipy import stats\n\nscore = stats.norm(loc=68, scale=12)\n\n# 1. 상위 10%에 들기 위한 점수\ncut_top10 = score.ppf(0.9)\n# 2. 80점 초과 비율\np_over80 = score.sf(80)\n# 3. 80점의 z점수\nz_80 = (80 - 68) / 12\n\nprint(round(cut_top10, 2), round(p_over80, 4), z_80)\n",
    "hints": [
      "상위 10% = 하위 90% 지점 → ppf(0.9)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 상위 10%에 들기 위한 점수",
        "expr": "abs(cut_top10 - 83.3786187865352) < 0.00834",
        "hint": "상위 10% = 하위 90% 지점 → ppf(0.9)"
      },
      {
        "label": "2단계 80점 초과 비율",
        "expr": "abs(p_over80 - 0.15865525393145707) < 1.59e-05",
        "hint": "score.sf(80)"
      },
      {
        "label": "3단계 80점의 z점수",
        "expr": "abs(z_80 - 1.0) < 0.0001",
        "hint": "(값 − 평균) / 표준편차"
      }
    ]
  },
  {
    "id": "14-1",
    "unit": 14,
    "domain": "mfg",
    "title": "표본 수와 표준오차",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "SE = σ / √n",
        "표본평균의 표준편차"
      ],
      [
        "np.sqrt",
        "제곱근"
      ]
    ],
    "origin": "신규",
    "desc": "<p>나사 길이의 공정 표준편차가 0.08mm로 알려져 있습니다. 매 시간 n개를 뽑아 평균을 관리합니다.</p>\n<ol><li><code>se_4</code>: n = 4 일 때 표준오차</li><li><code>se_16</code>: n = 16 일 때 표준오차</li><li><code>ratio</code>: se_4 / se_16</li><li><code>n_needed</code>: 표준오차를 0.01 이하로 만드는 최소 n (정수)</li></ol>",
    "starter": "import numpy as np\n\nsigma = 0.08\n\n# 1. n = 4 일 때 표준오차\nse_4 = \n# 2. n = 16 일 때 표준오차\nse_16 = \n# 3. se_4 / se_16\nratio = \n# 4. 표준오차를 0.01 이하로 만드는 최소 n (정수)\nn_needed = \n\nprint(se_4, se_16, ratio, n_needed)\n",
    "solution": "import numpy as np\n\nsigma = 0.08\n\n# 1. n = 4 일 때 표준오차\nse_4 = sigma / np.sqrt(4)\n# 2. n = 16 일 때 표준오차\nse_16 = sigma / np.sqrt(16)\n# 3. se_4 / se_16\nratio = se_4 / se_16\n# 4. 표준오차를 0.01 이하로 만드는 최소 n (정수)\nn_needed = int(np.ceil((sigma / 0.01) ** 2))\n\nprint(se_4, se_16, ratio, n_needed)\n",
    "hints": [
      "sigma / np.sqrt(4)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 n = 4 일 때 표준오차",
        "expr": "abs(se_4 - 0.04) < 4e-06",
        "hint": "sigma / np.sqrt(4)"
      },
      {
        "label": "2단계 n = 16 일 때 표준오차",
        "expr": "abs(se_16 - 0.02) < 2e-06",
        "hint": "sigma / np.sqrt(16)"
      },
      {
        "label": "3단계 se_4 / se_16",
        "expr": "abs(ratio - 2.0) < 0.0002",
        "hint": "se_4 / se_16"
      },
      {
        "label": "4단계 표준오차를 0.01 이하로 만드는 최소 n (정수)",
        "expr": "int(n_needed) == 64",
        "hint": "SE = σ/√n ≤ 0.01 → n ≥ (σ/0.01)²"
      }
    ]
  },
  {
    "id": "14-2",
    "unit": 14,
    "domain": "mfg",
    "title": "치우친 분포의 표본평균 시뮬레이션",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "rng.exponential(scale, size)",
        "지수분포 난수"
      ],
      [
        "배열.mean(axis=1)",
        "행마다 평균"
      ]
    ],
    "origin": "신규",
    "desc": "<p>설비 정지 간격(분)은 평균 10분인 지수분포처럼 한쪽으로 치우쳐 있습니다. 크기 30인 표본을 2000번 뽑아 표본평균의 분포를 봅니다.</p>\n<ol><li><code>means</code>: 표본평균 2000개 (행마다 평균)</li><li><code>mean_of_means</code>: 표본평균들의 평균</li><li><code>se_sim</code>: 표본평균들의 표준편차 (ddof=1)</li><li><code>se_theory</code>: 이론 표준오차 10/√30</li><li><code>close</code>: |se_sim − se_theory| &lt; 0.1 인가</li></ol>",
    "starter": "import numpy as np\n\nrng = np.random.default_rng(7)\nsamples = rng.exponential(scale=10, size=(2000, 30))   # 2000번 × 30개\n\n# 1. 표본평균 2000개 (행마다 평균)\nmeans = \n# 2. 표본평균들의 평균\nmean_of_means = \n# 3. 표본평균들의 표준편차 (ddof=1)\nse_sim = \n# 4. 이론 표준오차 10/√30\nse_theory = \n# 5. |se_sim − se_theory| < 0.1 인가\nclose = \n\nprint(round(mean_of_means, 3), round(se_sim, 3), round(se_theory, 3), close)\n",
    "solution": "import numpy as np\n\nrng = np.random.default_rng(7)\nsamples = rng.exponential(scale=10, size=(2000, 30))   # 2000번 × 30개\n\n# 1. 표본평균 2000개 (행마다 평균)\nmeans = samples.mean(axis=1)\n# 2. 표본평균들의 평균\nmean_of_means = means.mean()\n# 3. 표본평균들의 표준편차 (ddof=1)\nse_sim = means.std(ddof=1)\n# 4. 이론 표준오차 10/√30\nse_theory = 10 / np.sqrt(30)\n# 5. |se_sim − se_theory| < 0.1 인가\nclose = abs(se_sim - se_theory) < 0.1\n\nprint(round(mean_of_means, 3), round(se_sim, 3), round(se_theory, 3), close)\n",
    "hints": [
      "samples.mean(axis=1)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 표본평균 2000개 (행마다 평균)",
        "expr": "np.shape(means) == (2000,) and np.allclose(means, samples.mean(axis=1))",
        "hint": "samples.mean(axis=1)"
      },
      {
        "label": "2단계 표본평균들의 평균",
        "expr": "abs(mean_of_means - samples.mean(axis=1).mean()) < 1e-9",
        "hint": "means.mean()"
      },
      {
        "label": "3단계 표본평균들의 표준편차 (ddof=1)",
        "expr": "abs(se_sim - samples.mean(axis=1).std(ddof=1)) < 1e-9",
        "hint": "means.std(ddof=1)"
      },
      {
        "label": "4단계 이론 표준오차 10/√30",
        "expr": "abs(se_theory - 1.8257418583505538) < 0.000183",
        "hint": "σ / √n, 지수분포는 σ = 평균 = 10"
      },
      {
        "label": "5단계 |se_sim − se_theory| < 0.1 인가",
        "expr": "bool(close) is True",
        "hint": "abs(se_sim - se_theory) < 0.1"
      }
    ]
  },
  {
    "id": "14-3",
    "unit": 14,
    "domain": "general",
    "title": "설문 평균의 표준오차",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "np.std(x, ddof=1)",
        "표본 표준편차"
      ],
      [
        "s / √n",
        "표준오차 추정"
      ]
    ],
    "origin": "신규",
    "desc": "<p>앱 만족도(1~10점) 설문 응답 10개입니다. 모표준편차를 모르므로 표본 표준편차로 표준오차를 추정합니다.</p>\n<ol><li><code>n</code>: 응답 수</li><li><code>s</code>: 표본 표준편차</li><li><code>se</code>: 표준오차</li><li><code>se_100</code>: 같은 흩어짐으로 100명에게 받으면 표준오차</li></ol>",
    "starter": "import numpy as np\n\nscores = np.array([7, 8, 6, 9, 7, 5, 8, 7, 9, 6])\n\n# 1. 응답 수\nn = \n# 2. 표본 표준편차\ns = \n# 3. 표준오차\nse = \n# 4. 같은 흩어짐으로 100명에게 받으면 표준오차\nse_100 = \n\nprint(n, round(s, 3), round(se, 3), round(se_100, 3))\n",
    "solution": "import numpy as np\n\nscores = np.array([7, 8, 6, 9, 7, 5, 8, 7, 9, 6])\n\n# 1. 응답 수\nn = len(scores)\n# 2. 표본 표준편차\ns = np.std(scores, ddof=1)\n# 3. 표준오차\nse = s / np.sqrt(n)\n# 4. 같은 흩어짐으로 100명에게 받으면 표준오차\nse_100 = s / np.sqrt(100)\n\nprint(n, round(s, 3), round(se, 3), round(se_100, 3))\n",
    "hints": [
      "len(scores)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 응답 수",
        "expr": "int(n) == 10",
        "hint": "len(scores)"
      },
      {
        "label": "2단계 표본 표준편차",
        "expr": "abs(s - 1.3165611772087666) < 0.000132",
        "hint": "ddof=1"
      },
      {
        "label": "3단계 표준오차",
        "expr": "abs(se - 0.41633319989322654) < 4.16e-05",
        "hint": "s / np.sqrt(n)"
      },
      {
        "label": "4단계 같은 흩어짐으로 100명에게 받으면 표준오차",
        "expr": "abs(se_100 - 0.13165611772087665) < 1.32e-05",
        "hint": "s / np.sqrt(100)"
      }
    ]
  },
  {
    "id": "14-4",
    "unit": 14,
    "domain": "general",
    "title": "주사위 평균의 분포 시뮬레이션",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "rng.integers(1, 7, size)",
        "1~6 정수 난수"
      ],
      [
        "np.mean(조건)",
        "True 비율"
      ]
    ],
    "origin": "신규",
    "desc": "<p>주사위를 10번 던져 평균을 내는 실험을 5000번 반복합니다.</p>\n<ol><li><code>means</code>: 실험마다 평균 (5000개)</li><li><code>center</code>: 평균들의 평균</li><li><code>share_mid</code>: 평균이 3 이상 4 이하인 비율</li><li><code>se_theory</code>: 이론 표준오차 (주사위 σ = √(35/12))</li></ol>",
    "starter": "import numpy as np\n\nrng = np.random.default_rng(42)\nrolls = rng.integers(1, 7, size=(5000, 10))\n\n# 1. 실험마다 평균 (5000개)\nmeans = \n# 2. 평균들의 평균\ncenter = \n# 3. 평균이 3 이상 4 이하인 비율\nshare_mid = \n# 4. 이론 표준오차 (주사위 σ = √(35/12))\nse_theory = \n\nprint(round(center, 3), round(share_mid, 3), round(se_theory, 3))\n",
    "solution": "import numpy as np\n\nrng = np.random.default_rng(42)\nrolls = rng.integers(1, 7, size=(5000, 10))\n\n# 1. 실험마다 평균 (5000개)\nmeans = rolls.mean(axis=1)\n# 2. 평균들의 평균\ncenter = means.mean()\n# 3. 평균이 3 이상 4 이하인 비율\nshare_mid = np.mean((means >= 3) & (means <= 4))\n# 4. 이론 표준오차 (주사위 σ = √(35/12))\nse_theory = np.sqrt(35 / 12) / np.sqrt(10)\n\nprint(round(center, 3), round(share_mid, 3), round(se_theory, 3))\n",
    "hints": [
      "rolls.mean(axis=1)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 실험마다 평균 (5000개)",
        "expr": "np.shape(means) == (5000,) and np.allclose(means, rolls.mean(axis=1))",
        "hint": "rolls.mean(axis=1)"
      },
      {
        "label": "2단계 평균들의 평균",
        "expr": "abs(center - rolls.mean(axis=1).mean()) < 1e-9",
        "hint": "means.mean()"
      },
      {
        "label": "3단계 평균이 3 이상 4 이하인 비율",
        "expr": "abs(share_mid - np.mean((rolls.mean(axis=1) >= 3) & (rolls.mean(axis=1) <= 4))) < 1e-9",
        "hint": "np.mean((means >= 3) & (means <= 4))"
      },
      {
        "label": "4단계 이론 표준오차 (주사위 σ = √(35/12))",
        "expr": "abs(se_theory - 0.5400617248673216) < 5.4e-05",
        "hint": "np.sqrt(35/12) / np.sqrt(10)"
      }
    ]
  },
  {
    "id": "15-1",
    "unit": 15,
    "domain": "mfg",
    "title": "충전량 평균의 95% 신뢰구간",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.t.ppf(0.975, df)",
        "t 임계값"
      ],
      [
        "s / √n",
        "표준오차"
      ]
    ],
    "origin": "신규",
    "desc": "<p>음료 충전량(ml) 10개로 공정 평균의 95% 신뢰구간을 구합니다.</p>\n<ol><li><code>xbar</code>: 표본평균</li><li><code>se</code>: 표준오차</li><li><code>t_crit</code>: t 임계값 (자유도 n−1)</li><li><code>ci_low</code>: 하한</li><li><code>ci_high</code>: 상한</li><li><code>covers_500</code>: 목표 500ml가 구간 안에 있는가</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nml = np.array([498.2, 501.1, 499.6, 500.4, 497.9, 500.8, 499.1, 501.5, 498.7, 500.2])\nn = len(ml)\n\n# 1. 표본평균\nxbar = \n# 2. 표준오차\nse = \n# 3. t 임계값 (자유도 n−1)\nt_crit = \n# 4. 하한\nci_low = \n# 5. 상한\nci_high = \n# 6. 목표 500ml가 구간 안에 있는가\ncovers_500 = \n\nprint(round(ci_low, 2), round(ci_high, 2), covers_500)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nml = np.array([498.2, 501.1, 499.6, 500.4, 497.9, 500.8, 499.1, 501.5, 498.7, 500.2])\nn = len(ml)\n\n# 1. 표본평균\nxbar = ml.mean()\n# 2. 표준오차\nse = ml.std(ddof=1) / np.sqrt(n)\n# 3. t 임계값 (자유도 n−1)\nt_crit = stats.t.ppf(0.975, df=n - 1)\n# 4. 하한\nci_low = xbar - t_crit * se\n# 5. 상한\nci_high = xbar + t_crit * se\n# 6. 목표 500ml가 구간 안에 있는가\ncovers_500 = ci_low <= 500 <= ci_high\n\nprint(round(ci_low, 2), round(ci_high, 2), covers_500)\n",
    "hints": [
      "ml.mean()",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 표본평균",
        "expr": "abs(xbar - 499.75) < 0.05",
        "hint": "ml.mean()"
      },
      {
        "label": "2단계 표준오차",
        "expr": "abs(se - 0.39419397368413756) < 3.94e-05",
        "hint": "ml.std(ddof=1) / np.sqrt(n)"
      },
      {
        "label": "3단계 t 임계값 (자유도 n−1)",
        "expr": "abs(t_crit - 2.262157162798205) < 0.000226",
        "hint": "stats.t.ppf(0.975, df=n-1)"
      },
      {
        "label": "4단계 하한",
        "expr": "abs(ci_low - 498.85827127889854) < 0.0499",
        "hint": "xbar - t_crit * se"
      },
      {
        "label": "5단계 상한",
        "expr": "abs(ci_high - 500.64172872110146) < 0.0501",
        "hint": "xbar + t_crit * se"
      },
      {
        "label": "6단계 목표 500ml가 구간 안에 있는가",
        "expr": "bool(covers_500) is True",
        "hint": "ci_low <= 500 <= ci_high"
      }
    ]
  },
  {
    "id": "15-2",
    "unit": 15,
    "domain": "mfg",
    "title": "불량률의 95% 신뢰구간",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "p̂ ± 1.96·√(p̂(1−p̂)/n)",
        "비율 신뢰구간 (정규근사)"
      ],
      [
        "stats.norm.ppf(0.975)",
        "1.96"
      ]
    ],
    "origin": "신규",
    "desc": "<p>출하 검사에서 400개 중 14개가 불량이었습니다. 목표 불량률은 2%입니다.</p>\n<ol><li><code>p_hat</code>: 표본 불량률</li><li><code>margin</code>: 오차 한계 z·√(p̂(1−p̂)/n)</li><li><code>ci</code>: 신뢰구간 (하한, 상한) 튜플</li><li><code>above_target</code>: 구간 전체가 2%보다 높은가</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nn, bad = 400, 14\nz = stats.norm.ppf(0.975)\n\n# 1. 표본 불량률\np_hat = \n# 2. 오차 한계 z·√(p̂(1−p̂)/n)\nmargin = \n# 3. 신뢰구간 (하한, 상한) 튜플\nci = \n# 4. 구간 전체가 2%보다 높은가\nabove_target = \n\nprint(round(p_hat, 4), round(margin, 4), [round(float(v), 4) for v in ci], above_target)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nn, bad = 400, 14\nz = stats.norm.ppf(0.975)\n\n# 1. 표본 불량률\np_hat = bad / n\n# 2. 오차 한계 z·√(p̂(1−p̂)/n)\nmargin = z * np.sqrt(p_hat * (1 - p_hat) / n)\n# 3. 신뢰구간 (하한, 상한) 튜플\nci = (p_hat - margin, p_hat + margin)\n# 4. 구간 전체가 2%보다 높은가\nabove_target = ci[0] > 0.02\n\nprint(round(p_hat, 4), round(margin, 4), [round(float(v), 4) for v in ci], above_target)\n",
    "hints": [
      "bad / n",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 표본 불량률",
        "expr": "abs(p_hat - 0.035) < 3.5e-06",
        "hint": "bad / n"
      },
      {
        "label": "2단계 오차 한계 z·√(p̂(1−p̂)/n)",
        "expr": "abs(margin - 0.018010085484870975) < 1.8e-06",
        "hint": "z * np.sqrt(p_hat * (1 - p_hat) / n)"
      },
      {
        "label": "3단계 신뢰구간 (하한, 상한) 튜플",
        "expr": "len(ci) == 2 and abs(ci[0] - 0.0170) < 1e-3 and abs(ci[1] - 0.0530) < 1e-3",
        "hint": "(p_hat - margin, p_hat + margin)"
      },
      {
        "label": "4단계 구간 전체가 2%보다 높은가",
        "expr": "bool(above_target) is False",
        "hint": "하한이 0.02보다 큰지 보세요."
      }
    ]
  },
  {
    "id": "15-3",
    "unit": 15,
    "domain": "general",
    "title": "하루 앱 사용시간의 95% 신뢰구간",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.t.interval(0.95, df, loc, scale)",
        "t 신뢰구간 한 번에"
      ],
      [
        "stats.sem(x)",
        "표준오차"
      ]
    ],
    "origin": "신규",
    "desc": "<p>사용자 12명의 하루 앱 사용시간(분)입니다. <code>stats.t.interval</code>로 한 번에 구해 봅니다.</p>\n<ol><li><code>se</code>: 표준오차 (stats.sem)</li><li><code>ci</code>: 95% 신뢰구간 튜플</li><li><code>width</code>: 구간 폭</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nminutes = np.array([34, 41, 28, 52, 37, 45, 30, 39, 48, 33, 42, 36])\n\n# 1. 표준오차 (stats.sem)\nse = \n# 2. 95% 신뢰구간 튜플\nci = \n# 3. 구간 폭\nwidth = \n\nprint(round(se, 3), [round(float(v), 2) for v in ci], round(width, 2))\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nminutes = np.array([34, 41, 28, 52, 37, 45, 30, 39, 48, 33, 42, 36])\n\n# 1. 표준오차 (stats.sem)\nse = stats.sem(minutes)\n# 2. 95% 신뢰구간 튜플\nci = stats.t.interval(0.95, df=len(minutes) - 1, loc=minutes.mean(), scale=se)\n# 3. 구간 폭\nwidth = ci[1] - ci[0]\n\nprint(round(se, 3), [round(float(v), 2) for v in ci], round(width, 2))\n",
    "hints": [
      "stats.sem(minutes) 는 ddof=1 표준오차입니다.",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 표준오차 (stats.sem)",
        "expr": "abs(se - 2.085756166928145) < 0.000209",
        "hint": "stats.sem(minutes) 는 ddof=1 표준오차입니다."
      },
      {
        "label": "2단계 95% 신뢰구간 튜플",
        "expr": "len(ci) == 2 and abs(ci[0] - 34.159) < 0.01 and abs(ci[1] - 43.341) < 0.01",
        "hint": "stats.t.interval(0.95, df=n-1, loc=평균, scale=se)"
      },
      {
        "label": "3단계 구간 폭",
        "expr": "abs(width - 9.18143674195693) < 0.000918",
        "hint": "ci[1] - ci[0]"
      }
    ]
  },
  {
    "id": "15-4",
    "unit": 15,
    "domain": "general",
    "title": "두 광고의 전환율 신뢰구간 비교",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "p̂ ± z·√(p̂(1−p̂)/n)",
        "비율 신뢰구간"
      ]
    ],
    "origin": "신규",
    "desc": "<p>광고 A는 1200명 중 84명, 광고 B는 1000명 중 52명이 구매했습니다. 두 구간이 겹치는지 봅니다.</p>\n<ol><li><code>ci_a</code>: A의 신뢰구간 (prop_ci 사용)</li><li><code>ci_b</code>: B의 신뢰구간</li><li><code>overlap</code>: 두 구간이 겹치는가</li></ol>\n<p class=\"qc\">구간이 겹친다고 차이가 없다는 뜻은 아닙니다. 두 비율의 차이는 가설검정으로 따로 확인합니다.</p>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nz = stats.norm.ppf(0.975)\nn_a, buy_a = 1200, 84\nn_b, buy_b = 1000, 52\n\ndef prop_ci(k, n):\n    p = k / n\n    m = z * np.sqrt(p * (1 - p) / n)\n    return (p - m, p + m)\n\n# 1. A의 신뢰구간 (prop_ci 사용)\nci_a = \n# 2. B의 신뢰구간\nci_b = \n# 3. 두 구간이 겹치는가\noverlap = \n\nprint([round(float(v), 4) for v in ci_a], [round(float(v), 4) for v in ci_b], overlap)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nz = stats.norm.ppf(0.975)\nn_a, buy_a = 1200, 84\nn_b, buy_b = 1000, 52\n\ndef prop_ci(k, n):\n    p = k / n\n    m = z * np.sqrt(p * (1 - p) / n)\n    return (p - m, p + m)\n\n# 1. A의 신뢰구간 (prop_ci 사용)\nci_a = prop_ci(buy_a, n_a)\n# 2. B의 신뢰구간\nci_b = prop_ci(buy_b, n_b)\n# 3. 두 구간이 겹치는가\noverlap = ci_a[0] <= ci_b[1] and ci_b[0] <= ci_a[1]\n\nprint([round(float(v), 4) for v in ci_a], [round(float(v), 4) for v in ci_b], overlap)\n",
    "hints": [
      "prop_ci(buy_a, n_a)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 A의 신뢰구간 (prop_ci 사용)",
        "expr": "abs(ci_a[0] - 0.05557) < 1e-4 and abs(ci_a[1] - 0.08443) < 1e-4",
        "hint": "prop_ci(buy_a, n_a)"
      },
      {
        "label": "2단계 B의 신뢰구간",
        "expr": "abs(ci_b[0] - 0.03824) < 1e-4 and abs(ci_b[1] - 0.06576) < 1e-4",
        "hint": "prop_ci(buy_b, n_b)"
      },
      {
        "label": "3단계 두 구간이 겹치는가",
        "expr": "bool(overlap) is True",
        "hint": "한쪽 하한이 다른 쪽 상한보다 작거나 같으면 겹칩니다."
      }
    ]
  },
  {
    "id": "16-1",
    "unit": 16,
    "domain": "mfg",
    "title": "개선 전후 사이클타임 비교 (Welch t검정)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.ttest_ind(a, b, equal_var=False)",
        "독립 2표본 Welch t검정"
      ],
      [
        "결과.pvalue",
        "p-value"
      ]
    ],
    "origin": "신규",
    "desc": "<p>지그 개선 전후 사이클타임(초)입니다. 서로 다른 제품을 측정했으므로 독립 2표본입니다. 유의수준 0.05.</p>\n<ol><li><code>diff</code>: 평균 차이 (전 − 후)</li><li><code>res</code>: Welch t검정 결과</li><li><code>p</code>: p-value</li><li><code>improved</code>: 유의하게 줄었는가 (p &lt; 0.05 그리고 diff &gt; 0)</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nbefore = np.array([42.1, 43.5, 41.8, 44.2, 42.9, 43.1, 42.4, 43.8, 41.9, 43.0])\nafter = np.array([40.8, 41.5, 40.2, 42.0, 41.1, 40.6, 41.9, 40.9, 41.3, 40.7])\n\n# 1. 평균 차이 (전 − 후)\ndiff = \n# 2. Welch t검정 결과\nres = \n# 3. p-value\np = \n# 4. 유의하게 줄었는가 (p < 0.05 그리고 diff > 0)\nimproved = \n\nprint(round(diff, 2), f\"{p:.2e}\", improved)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nbefore = np.array([42.1, 43.5, 41.8, 44.2, 42.9, 43.1, 42.4, 43.8, 41.9, 43.0])\nafter = np.array([40.8, 41.5, 40.2, 42.0, 41.1, 40.6, 41.9, 40.9, 41.3, 40.7])\n\n# 1. 평균 차이 (전 − 후)\ndiff = before.mean() - after.mean()\n# 2. Welch t검정 결과\nres = stats.ttest_ind(before, after, equal_var=False)\n# 3. p-value\np = res.pvalue\n# 4. 유의하게 줄었는가 (p < 0.05 그리고 diff > 0)\nimproved = p < 0.05 and diff > 0\n\nprint(round(diff, 2), f\"{p:.2e}\", improved)\n",
    "hints": [
      "before.mean() - after.mean()",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 평균 차이 (전 − 후)",
        "expr": "abs(diff - 1.769999999999989) < 0.000177",
        "hint": "before.mean() - after.mean()"
      },
      {
        "label": "2단계 Welch t검정 결과",
        "expr": "abs(res.pvalue - 3.832e-05) < 1e-06 and res.statistic > 0",
        "hint": "stats.ttest_ind(before, after, equal_var=False)"
      },
      {
        "label": "3단계 p-value",
        "expr": "abs(p - res.pvalue) < 1e-12",
        "hint": "res.pvalue"
      },
      {
        "label": "4단계 유의하게 줄었는가 (p < 0.05 그리고 diff > 0)",
        "expr": "bool(improved) is True",
        "hint": "p < 0.05 and diff > 0"
      }
    ]
  },
  {
    "id": "16-2",
    "unit": 16,
    "domain": "mfg",
    "title": "두 측정기 비교 (대응표본 t검정)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.ttest_rel(a, b)",
        "대응표본 t검정"
      ],
      [
        "a - b",
        "쌍마다 차이"
      ]
    ],
    "origin": "신규",
    "desc": "<p>같은 시편 8개를 측정기 A와 B로 각각 쟀습니다(mm). 같은 대상을 두 번 쟀으므로 대응표본입니다.</p>\n<ol><li><code>d</code>: 쌍별 차이 (B − A)</li><li><code>mean_d</code>: 차이의 평균</li><li><code>p</code>: 대응표본 t검정 p-value</li><li><code>biased</code>: B가 체계적으로 다른가 (p &lt; 0.05)</li></ol>\n<p class=\"qc\">독립 2표본으로 검정하면 시편 간 차이가 섞여 p-value가 커집니다. 같은 대상의 전후·두 측정은 대응표본입니다.</p>",
    "starter": "import numpy as np\nfrom scipy import stats\n\ngauge_a = np.array([10.02, 9.98, 10.05, 10.01, 9.97, 10.03, 10.00, 10.04])\ngauge_b = np.array([10.04, 9.99, 10.08, 10.02, 10.00, 10.05, 10.01, 10.07])\n\n# 1. 쌍별 차이 (B − A)\nd = \n# 2. 차이의 평균\nmean_d = \n# 3. 대응표본 t검정 p-value\np = \n# 4. B가 체계적으로 다른가 (p < 0.05)\nbiased = \n\nprint(round(mean_d, 4), f\"{p:.4f}\", biased)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\ngauge_a = np.array([10.02, 9.98, 10.05, 10.01, 9.97, 10.03, 10.00, 10.04])\ngauge_b = np.array([10.04, 9.99, 10.08, 10.02, 10.00, 10.05, 10.01, 10.07])\n\n# 1. 쌍별 차이 (B − A)\nd = gauge_b - gauge_a\n# 2. 차이의 평균\nmean_d = d.mean()\n# 3. 대응표본 t검정 p-value\np = stats.ttest_rel(gauge_b, gauge_a).pvalue\n# 4. B가 체계적으로 다른가 (p < 0.05)\nbiased = p < 0.05\n\nprint(round(mean_d, 4), f\"{p:.4f}\", biased)\n",
    "hints": [
      "gauge_b - gauge_a",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 쌍별 차이 (B − A)",
        "expr": "np.allclose(d, gauge_b - gauge_a)",
        "hint": "gauge_b - gauge_a"
      },
      {
        "label": "2단계 차이의 평균",
        "expr": "abs(mean_d - 0.020000000000000018) < 2e-06",
        "hint": "d.mean()"
      },
      {
        "label": "3단계 대응표본 t검정 p-value",
        "expr": "abs(p - 0.00048622043755228286) < 1e-06",
        "hint": "stats.ttest_rel(gauge_b, gauge_a).pvalue"
      },
      {
        "label": "4단계 B가 체계적으로 다른가 (p < 0.05)",
        "expr": "bool(biased) is True",
        "hint": "p < 0.05"
      }
    ]
  },
  {
    "id": "16-3",
    "unit": 16,
    "domain": "general",
    "title": "새 화면의 체류시간 비교 (Welch t검정)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.ttest_ind(a, b, equal_var=False)",
        "Welch t검정"
      ],
      [
        "alternative='greater'",
        "단측검정: a가 더 크다"
      ]
    ],
    "origin": "신규",
    "desc": "<p>기존 화면(old)과 새 화면(new) 방문자의 체류시간(초)입니다. \"새 화면이 더 길다\"를 단측으로 검정합니다.</p>\n<ol><li><code>p_two</code>: 양측 p-value</li><li><code>p_one</code>: 단측 p-value (new &gt; old)</li><li><code>half</code>: p_one / p_two</li><li><code>adopt</code>: 단측 기준 유의수준 0.05에서 채택할 근거가 있는가</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nold = np.array([62, 75, 58, 81, 66, 70, 59, 73, 68, 64, 77, 61])\nnew = np.array([71, 84, 69, 90, 76, 79, 73, 88, 74, 80, 70, 85])\n\n# 1. 양측 p-value\np_two = \n# 2. 단측 p-value (new > old)\np_one = \n# 3. p_one / p_two\nhalf = \n# 4. 단측 기준 유의수준 0.05에서 채택할 근거가 있는가\nadopt = \n\nprint(f\"{p_two:.4f}\", f\"{p_one:.4f}\", round(half, 2), adopt)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nold = np.array([62, 75, 58, 81, 66, 70, 59, 73, 68, 64, 77, 61])\nnew = np.array([71, 84, 69, 90, 76, 79, 73, 88, 74, 80, 70, 85])\n\n# 1. 양측 p-value\np_two = stats.ttest_ind(new, old, equal_var=False).pvalue\n# 2. 단측 p-value (new > old)\np_one = stats.ttest_ind(new, old, equal_var=False, alternative='greater').pvalue\n# 3. p_one / p_two\nhalf = p_one / p_two\n# 4. 단측 기준 유의수준 0.05에서 채택할 근거가 있는가\nadopt = p_one < 0.05\n\nprint(f\"{p_two:.4f}\", f\"{p_one:.4f}\", round(half, 2), adopt)\n",
    "hints": [
      "stats.ttest_ind(new, old, equal_var=False).pvalue",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 양측 p-value",
        "expr": "abs(p_two - 0.002150581604181708) < 2.15e-06",
        "hint": "stats.ttest_ind(new, old, equal_var=False).pvalue"
      },
      {
        "label": "2단계 단측 p-value (new > old)",
        "expr": "abs(p_one - 0.001075290802090854) < 1.08e-06",
        "hint": "alternative='greater'"
      },
      {
        "label": "3단계 p_one / p_two",
        "expr": "abs(half - 0.5) < 5e-05",
        "hint": "단측 p는 양측 p의 절반입니다(방향이 맞을 때)."
      },
      {
        "label": "4단계 단측 기준 유의수준 0.05에서 채택할 근거가 있는가",
        "expr": "bool(adopt) is True",
        "hint": "p_one < 0.05"
      }
    ]
  },
  {
    "id": "16-4",
    "unit": 16,
    "domain": "general",
    "title": "\"평균 30분 배송\" 주장 검증 (1표본 t검정)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.ttest_1samp(x, 기준값)",
        "1표본 t검정"
      ]
    ],
    "origin": "신규",
    "desc": "<p>업체는 평균 배송시간이 30분이라고 합니다. 실제 15건(분)을 기록했습니다. 30분보다 <b>길다</b>는 쪽으로 단측검정합니다.</p>\n<ol><li><code>xbar</code>: 평균</li><li><code>res</code>: 1표본 t검정 결과 (alternative=&#x27;greater&#x27;)</li><li><code>t_stat</code>: t 통계량</li><li><code>reject</code>: 주장을 기각하는가 (p &lt; 0.05)</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nmins = np.array([31, 35, 29, 38, 33, 30, 36, 34, 28, 37, 32, 35, 31, 39, 33])\n\n# 1. 평균\nxbar = \n# 2. 1표본 t검정 결과 (alternative='greater')\nres = \n# 3. t 통계량\nt_stat = \n# 4. 주장을 기각하는가 (p < 0.05)\nreject = \n\nprint(round(xbar, 2), round(t_stat, 3), f\"{res.pvalue:.2e}\", reject)\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nmins = np.array([31, 35, 29, 38, 33, 30, 36, 34, 28, 37, 32, 35, 31, 39, 33])\n\n# 1. 평균\nxbar = mins.mean()\n# 2. 1표본 t검정 결과 (alternative='greater')\nres = stats.ttest_1samp(mins, 30, alternative='greater')\n# 3. t 통계량\nt_stat = res.statistic\n# 4. 주장을 기각하는가 (p < 0.05)\nreject = res.pvalue < 0.05\n\nprint(round(xbar, 2), round(t_stat, 3), f\"{res.pvalue:.2e}\", reject)\n",
    "hints": [
      "mins.mean()",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 평균",
        "expr": "abs(xbar - 33.4) < 0.00334",
        "hint": "mins.mean()"
      },
      {
        "label": "2단계 1표본 t검정 결과 (alternative='greater')",
        "expr": "res.statistic > 0 and res.pvalue < 0.001",
        "hint": "stats.ttest_1samp(mins, 30, alternative='greater')"
      },
      {
        "label": "3단계 t 통계량",
        "expr": "abs(t_stat - 4.00164873672555) < 0.0004",
        "hint": "res.statistic"
      },
      {
        "label": "4단계 주장을 기각하는가 (p < 0.05)",
        "expr": "bool(reject) is True",
        "hint": "res.pvalue < 0.05"
      }
    ]
  },
  {
    "id": "17-1",
    "unit": 17,
    "domain": "mfg",
    "title": "불량 데이터 나누기 (stratify)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "train_test_split(..., stratify=y)",
        "클래스 비율을 유지하며 분할"
      ],
      [
        "배열.mean()",
        "0/1 배열의 평균 = 1의 비율"
      ]
    ],
    "origin": "신규",
    "desc": "<p>도금 로트 120개(온도, 전류밀도)와 불량 여부입니다. 25%를 테스트로 떼되 불량 비율이 유지되게 나눕니다.</p>\n<ol><li><code>split</code>: train_test_split 결과 4개 (X_train, X_test, y_train, y_test)</li><li><code>defect_rate_all</code>: 전체 불량 비율</li><li><code>defect_rate_test</code>: 테스트 세트 불량 비율</li></ol>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\n\n# 1. train_test_split 결과 4개 (X_train, X_test, y_train, y_test)\nsplit = \n# 2. 전체 불량 비율\ndefect_rate_all = \n# 3. 테스트 세트 불량 비율\ndefect_rate_test = \n\nX_train, X_test, y_train, y_test = split\nprint(X_train.shape, X_test.shape, round(defect_rate_all, 3), round(defect_rate_test, 3))\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\n\n# 1. train_test_split 결과 4개 (X_train, X_test, y_train, y_test)\nsplit = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n# 2. 전체 불량 비율\ndefect_rate_all = y.mean()\n# 3. 테스트 세트 불량 비율\ndefect_rate_test = split[3].mean()\n\nX_train, X_test, y_train, y_test = split\nprint(X_train.shape, X_test.shape, round(defect_rate_all, 3), round(defect_rate_test, 3))\n",
    "hints": [
      "train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 train_test_split 결과 4개 (X_train, X_test, y_train, y_test)",
        "expr": "len(split) == 4 and np.shape(split[0]) == (90, 2) and np.shape(split[1]) == (30, 2)",
        "hint": "train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)"
      },
      {
        "label": "2단계 전체 불량 비율",
        "expr": "abs(defect_rate_all - y.mean()) < 1e-12",
        "hint": "y.mean()"
      },
      {
        "label": "3단계 테스트 세트 불량 비율",
        "expr": "abs(defect_rate_test - np.asarray(split[3]).mean()) < 1e-12 and abs(defect_rate_test - y.mean()) < 0.05",
        "hint": "split[3].mean()  (y_test)"
      }
    ]
  },
  {
    "id": "17-2",
    "unit": 17,
    "domain": "mfg",
    "title": "정확도의 함정: 기준 모델",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "DummyClassifier(strategy='most_frequent')",
        "가장 많은 클래스만 예측"
      ],
      [
        "recall_score",
        "실제 불량 중 잡아낸 비율"
      ]
    ],
    "origin": "신규",
    "desc": "<p>불량이 적은 데이터에서는 \"전부 양품\"이라고만 해도 정확도가 높게 나옵니다. 기준 모델의 정확도와 불량 재현율을 확인합니다.</p>\n<ol><li><code>base</code>: 학습된 기준 모델</li><li><code>base_acc</code>: 테스트 정확도</li><li><code>base_recall</code>: 불량 재현율 (recall)</li></ol>\n<p class=\"qc\">정확도가 높아도 불량을 하나도 못 잡을 수 있습니다. 불균형 데이터에서는 재현율·정밀도를 함께 봅니다.</p>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import accuracy_score, recall_score\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 학습된 기준 모델\nbase = \n# 2. 테스트 정확도\nbase_acc = \n# 3. 불량 재현율 (recall)\nbase_recall = \n\nprint(round(base_acc, 3), base_recall)\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import accuracy_score, recall_score\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 학습된 기준 모델\nbase = DummyClassifier(strategy='most_frequent').fit(X_train, y_train)\n# 2. 테스트 정확도\nbase_acc = accuracy_score(y_test, base.predict(X_test))\n# 3. 불량 재현율 (recall)\nbase_recall = recall_score(y_test, base.predict(X_test))\n\nprint(round(base_acc, 3), base_recall)\n",
    "hints": [
      "DummyClassifier(strategy='most_frequent').fit(X_train, y_train)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습된 기준 모델",
        "expr": "hasattr(base, 'predict') and set(np.unique(base.predict(X_test))) == {0}",
        "hint": "DummyClassifier(strategy='most_frequent').fit(X_train, y_train)"
      },
      {
        "label": "2단계 테스트 정확도",
        "expr": "abs(base_acc - (1 - np.mean(y_test))) < 1e-9",
        "hint": "accuracy_score(y_test, base.predict(X_test))"
      },
      {
        "label": "3단계 불량 재현율 (recall)",
        "expr": "base_recall == 0",
        "hint": "recall_score(y_test, base.predict(X_test))"
      }
    ]
  },
  {
    "id": "17-3",
    "unit": 17,
    "domain": "general",
    "title": "해지 고객 데이터 나누기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "train_test_split",
        "학습/테스트 분할"
      ],
      [
        "np.bincount(y)",
        "클래스별 개수"
      ]
    ],
    "origin": "신규",
    "desc": "<p>구독 고객 120명(월 이용시간, 문의 수)과 해지 여부입니다. 30%를 테스트로 나누고 해지 비율을 비교합니다.</p>\n<ol><li><code>split</code>: 분할 결과 4개 (test_size=0.3, random_state=1, stratify=y)</li><li><code>counts_train</code>: 학습 세트 클래스별 개수 (np.bincount)</li><li><code>churn_test</code>: 테스트 세트 해지 비율</li></ol>",
    "starter": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\n\n# 1. 분할 결과 4개 (test_size=0.3, random_state=1, stratify=y)\nsplit = \n# 2. 학습 세트 클래스별 개수 (np.bincount)\ncounts_train = \n# 3. 테스트 세트 해지 비율\nchurn_test = \n\nX_train, X_test, y_train, y_test = split\nprint(counts_train, round(churn_test, 3))\n",
    "solution": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\n\n# 1. 분할 결과 4개 (test_size=0.3, random_state=1, stratify=y)\nsplit = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)\n# 2. 학습 세트 클래스별 개수 (np.bincount)\ncounts_train = np.bincount(split[2])\n# 3. 테스트 세트 해지 비율\nchurn_test = split[3].mean()\n\nX_train, X_test, y_train, y_test = split\nprint(counts_train, round(churn_test, 3))\n",
    "hints": [
      "train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 분할 결과 4개 (test_size=0.3, random_state=1, stratify=y)",
        "expr": "len(split) == 4 and np.shape(split[1]) == (36, 2)",
        "hint": "train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)"
      },
      {
        "label": "2단계 학습 세트 클래스별 개수 (np.bincount)",
        "expr": "list(counts_train) == list(np.bincount(split[2]))",
        "hint": "np.bincount(y_train)"
      },
      {
        "label": "3단계 테스트 세트 해지 비율",
        "expr": "abs(churn_test - np.asarray(split[3]).mean()) < 1e-12",
        "hint": "y_test.mean()"
      }
    ]
  },
  {
    "id": "17-4",
    "unit": 17,
    "domain": "general",
    "title": "누수 없는 표준화",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "StandardScaler().fit(X_train)",
        "학습 데이터로만 평균·표준편차 계산"
      ],
      [
        "scaler.transform(X_test)",
        "같은 기준으로 변환"
      ]
    ],
    "origin": "신규",
    "desc": "<p>표준화 기준(평균, 표준편차)은 학습 데이터로만 정하고, 테스트 데이터에는 <code>transform</code>만 적용합니다.</p>\n<ol><li><code>scaler</code>: 학습 데이터로 fit 한 StandardScaler</li><li><code>Xtr_s</code>: 변환된 학습 데이터</li><li><code>Xte_s</code>: 변환된 테스트 데이터</li><li><code>test_mean_is_zero</code>: 테스트 데이터 열 평균이 정확히 0인가 (np.allclose)</li></ol>\n<p class=\"qc\">테스트 평균이 0이 아닌 것이 정상입니다. 테스트까지 함께 fit 하면 0이 되지만, 그건 미래 데이터를 미리 본 누수입니다.</p>",
    "starter": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)\n\n# 1. 학습 데이터로 fit 한 StandardScaler\nscaler = \n# 2. 변환된 학습 데이터\nXtr_s = \n# 3. 변환된 테스트 데이터\nXte_s = \n# 4. 테스트 데이터 열 평균이 정확히 0인가 (np.allclose)\ntest_mean_is_zero = \n\nprint(scaler.mean_.round(2), Xte_s.mean(axis=0).round(3), test_mean_is_zero)\n",
    "solution": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)\n\n# 1. 학습 데이터로 fit 한 StandardScaler\nscaler = StandardScaler().fit(X_train)\n# 2. 변환된 학습 데이터\nXtr_s = scaler.transform(X_train)\n# 3. 변환된 테스트 데이터\nXte_s = scaler.transform(X_test)\n# 4. 테스트 데이터 열 평균이 정확히 0인가 (np.allclose)\ntest_mean_is_zero = bool(np.allclose(Xte_s.mean(axis=0), 0))\n\nprint(scaler.mean_.round(2), Xte_s.mean(axis=0).round(3), test_mean_is_zero)\n",
    "hints": [
      "StandardScaler().fit(X_train)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습 데이터로 fit 한 StandardScaler",
        "expr": "np.allclose(scaler.mean_, X_train.mean(axis=0))",
        "hint": "StandardScaler().fit(X_train)"
      },
      {
        "label": "2단계 변환된 학습 데이터",
        "expr": "np.allclose(Xtr_s.mean(axis=0), 0)",
        "hint": "scaler.transform(X_train)"
      },
      {
        "label": "3단계 변환된 테스트 데이터",
        "expr": "np.allclose(Xte_s, (X_test - X_train.mean(axis=0)) / X_train.std(axis=0))",
        "hint": "scaler.transform(X_test)  (fit 하지 않음!)"
      },
      {
        "label": "4단계 테스트 데이터 열 평균이 정확히 0인가 (np.allclose)",
        "expr": "test_mean_is_zero == False",
        "hint": "np.allclose(Xte_s.mean(axis=0), 0)"
      }
    ]
  },
  {
    "id": "18-1",
    "unit": 18,
    "domain": "mfg",
    "title": "온도로 도금 두께 예측 (선형회귀)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "LinearRegression().fit(X, y)",
        "학습"
      ],
      [
        ".coef_ / .intercept_",
        "기울기 / 절편"
      ],
      [
        ".predict / .score",
        "예측 / R²"
      ]
    ],
    "origin": "신규",
    "desc": "<p>도금조 온도(℃)와 두께(µm) 10쌍입니다.</p>\n<ol><li><code>model</code>: 학습된 모델 (X는 temp.reshape(-1, 1))</li><li><code>slope</code>: 기울기 (1℃당 두께 변화)</li><li><code>intercept</code>: 절편</li><li><code>pred_55</code>: 55℃일 때 예측 두께</li><li><code>r2</code>: R² (model.score)</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\ntemp = np.array([45, 47, 48, 50, 51, 53, 54, 56, 57, 59])\nthick = np.array([7.6, 7.9, 8.1, 8.3, 8.6, 8.8, 9.1, 9.3, 9.4, 9.8])\n\n# 1. 학습된 모델 (X는 temp.reshape(-1, 1))\nmodel = \n# 2. 기울기 (1℃당 두께 변화)\nslope = \n# 3. 절편\nintercept = \n# 4. 55℃일 때 예측 두께\npred_55 = \n# 5. R² (model.score)\nr2 = \n\nprint(round(slope, 4), round(intercept, 3), round(pred_55, 3), round(r2, 4))\n",
    "solution": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\ntemp = np.array([45, 47, 48, 50, 51, 53, 54, 56, 57, 59])\nthick = np.array([7.6, 7.9, 8.1, 8.3, 8.6, 8.8, 9.1, 9.3, 9.4, 9.8])\n\n# 1. 학습된 모델 (X는 temp.reshape(-1, 1))\nmodel = LinearRegression().fit(temp.reshape(-1, 1), thick)\n# 2. 기울기 (1℃당 두께 변화)\nslope = model.coef_[0]\n# 3. 절편\nintercept = model.intercept_\n# 4. 55℃일 때 예측 두께\npred_55 = model.predict([[55]])[0]\n# 5. R² (model.score)\nr2 = model.score(temp.reshape(-1, 1), thick)\n\nprint(round(slope, 4), round(intercept, 3), round(pred_55, 3), round(r2, 4))\n",
    "hints": [
      "LinearRegression().fit(temp.reshape(-1, 1), thick)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습된 모델 (X는 temp.reshape(-1, 1))",
        "expr": "hasattr(model, 'coef_')",
        "hint": "LinearRegression().fit(temp.reshape(-1, 1), thick)"
      },
      {
        "label": "2단계 기울기 (1℃당 두께 변화)",
        "expr": "abs(slope - 0.15526315789473685) < 1.55e-05",
        "hint": "model.coef_[0]"
      },
      {
        "label": "3단계 절편",
        "expr": "abs(intercept - 0.616315789473683) < 6.16e-05",
        "hint": "model.intercept_"
      },
      {
        "label": "4단계 55℃일 때 예측 두께",
        "expr": "abs(pred_55 - 9.15578947368421) < 0.000916",
        "hint": "model.predict([[55]])[0]"
      },
      {
        "label": "5단계 R² (model.score)",
        "expr": "abs(r2 - 0.993765059209099) < 9.94e-05",
        "hint": "model.score(X, y)"
      }
    ]
  },
  {
    "id": "18-2",
    "unit": 18,
    "domain": "mfg",
    "title": "불량 확률 예측 (로지스틱 회귀)",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "LogisticRegression().fit(X, y)",
        "학습"
      ],
      [
        ".predict_proba(X)[:, 1]",
        "불량일 확률"
      ]
    ],
    "origin": "신규",
    "desc": "<p>도금 로트 데이터로 로지스틱 회귀를 학습하고, 새 로트 두 개의 불량 확률을 구합니다.</p>\n<ol><li><code>clf</code>: 학습된 LogisticRegression</li><li><code>proba</code>: 새 로트들의 불량 확률 (길이 2 배열)</li><li><code>train_acc</code>: 학습 데이터 정확도 (clf.score)</li><li><code>temp_effect</code>: 온도 계수가 양수인가 (clf.coef_[0][0] &gt; 0)</li></ol>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.linear_model import LogisticRegression\n\nnew_lots = np.array([[56.0, 3.5], [50.0, 2.6]])\n\n# 1. 학습된 LogisticRegression\nclf = \n# 2. 새 로트들의 불량 확률 (길이 2 배열)\nproba = \n# 3. 학습 데이터 정확도 (clf.score)\ntrain_acc = \n# 4. 온도 계수가 양수인가 (clf.coef_[0][0] > 0)\ntemp_effect = \n\nprint(proba.round(3), round(train_acc, 3), temp_effect)\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.linear_model import LogisticRegression\n\nnew_lots = np.array([[56.0, 3.5], [50.0, 2.6]])\n\n# 1. 학습된 LogisticRegression\nclf = LogisticRegression().fit(X, y)\n# 2. 새 로트들의 불량 확률 (길이 2 배열)\nproba = clf.predict_proba(new_lots)[:, 1]\n# 3. 학습 데이터 정확도 (clf.score)\ntrain_acc = clf.score(X, y)\n# 4. 온도 계수가 양수인가 (clf.coef_[0][0] > 0)\ntemp_effect = clf.coef_[0][0] > 0\n\nprint(proba.round(3), round(train_acc, 3), temp_effect)\n",
    "hints": [
      "LogisticRegression().fit(X, y)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습된 LogisticRegression",
        "expr": "hasattr(clf, 'coef_') and clf.coef_.shape == (1, 2)",
        "hint": "LogisticRegression().fit(X, y)"
      },
      {
        "label": "2단계 새 로트들의 불량 확률 (길이 2 배열)",
        "expr": "np.shape(proba) == (2,) and proba[0] > 0.5 > proba[1]",
        "hint": "clf.predict_proba(new_lots)[:, 1]"
      },
      {
        "label": "3단계 학습 데이터 정확도 (clf.score)",
        "expr": "0.85 <= train_acc <= 1",
        "hint": "clf.score(X, y)"
      },
      {
        "label": "4단계 온도 계수가 양수인가 (clf.coef_[0][0] > 0)",
        "expr": "bool(temp_effect) is True",
        "hint": "clf.coef_[0][0] > 0"
      }
    ]
  },
  {
    "id": "18-3",
    "unit": 18,
    "domain": "general",
    "title": "광고비로 매출 예측 (선형회귀)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "LinearRegression",
        "선형회귀"
      ],
      [
        ".score",
        "R²"
      ]
    ],
    "origin": "신규",
    "desc": "<p>월 광고비(백만 원)와 매출(백만 원) 8개월치입니다.</p>\n<ol><li><code>model</code>: 학습된 모델</li><li><code>slope</code>: 광고비 1백만 원당 매출 증가</li><li><code>pred_5</code>: 광고비 5백만 원일 때 예측 매출</li><li><code>r2</code>: R²</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\nad = np.array([1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5])\nrevenue = np.array([12.1, 13.8, 15.2, 16.1, 18.3, 19.0, 21.2, 22.4])\n\n# 1. 학습된 모델\nmodel = \n# 2. 광고비 1백만 원당 매출 증가\nslope = \n# 3. 광고비 5백만 원일 때 예측 매출\npred_5 = \n# 4. R²\nr2 = \n\nprint(round(slope, 3), round(pred_5, 2), round(r2, 4))\n",
    "solution": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\nad = np.array([1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5])\nrevenue = np.array([12.1, 13.8, 15.2, 16.1, 18.3, 19.0, 21.2, 22.4])\n\n# 1. 학습된 모델\nmodel = LinearRegression().fit(ad.reshape(-1, 1), revenue)\n# 2. 광고비 1백만 원당 매출 증가\nslope = model.coef_[0]\n# 3. 광고비 5백만 원일 때 예측 매출\npred_5 = model.predict([[5.0]])[0]\n# 4. R²\nr2 = model.score(ad.reshape(-1, 1), revenue)\n\nprint(round(slope, 3), round(pred_5, 2), round(r2, 4))\n",
    "hints": [
      "X는 ad.reshape(-1, 1)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습된 모델",
        "expr": "hasattr(model, 'coef_')",
        "hint": "X는 ad.reshape(-1, 1)"
      },
      {
        "label": "2단계 광고비 1백만 원당 매출 증가",
        "expr": "abs(slope - 2.921428571428572) < 0.000292",
        "hint": "model.coef_[0]"
      },
      {
        "label": "3단계 광고비 5백만 원일 때 예측 매출",
        "expr": "abs(pred_5 - 23.83571428571429) < 0.00238",
        "hint": "model.predict([[5.0]])[0]"
      },
      {
        "label": "4단계 R²",
        "expr": "abs(r2 - 0.9930858021478736) < 9.93e-05",
        "hint": "model.score(X, y)"
      }
    ]
  },
  {
    "id": "18-4",
    "unit": 18,
    "domain": "general",
    "title": "해지 확률 예측 (로지스틱 회귀)",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "LogisticRegression",
        "로지스틱 회귀"
      ],
      [
        ".predict_proba",
        "확률"
      ],
      [
        ".predict",
        "0.5 기준 판정"
      ]
    ],
    "origin": "신규",
    "desc": "<p>구독 고객 데이터로 해지 확률을 예측합니다.</p>\n<ol><li><code>clf</code>: 학습된 모델</li><li><code>proba</code>: 두 고객의 해지 확률</li><li><code>labels</code>: 0.5 기준 판정</li><li><code>hours_effect</code>: 이용시간 계수가 음수인가</li></ol>",
    "starter": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.linear_model import LogisticRegression\n\ncustomers = np.array([[10.0, 4.0], [30.0, 1.0]])\n\n# 1. 학습된 모델\nclf = \n# 2. 두 고객의 해지 확률\nproba = \n# 3. 0.5 기준 판정\nlabels = \n# 4. 이용시간 계수가 음수인가\nhours_effect = \n\nprint(proba.round(3), labels, hours_effect)\n",
    "solution": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.linear_model import LogisticRegression\n\ncustomers = np.array([[10.0, 4.0], [30.0, 1.0]])\n\n# 1. 학습된 모델\nclf = LogisticRegression().fit(X, y)\n# 2. 두 고객의 해지 확률\nproba = clf.predict_proba(customers)[:, 1]\n# 3. 0.5 기준 판정\nlabels = clf.predict(customers)\n# 4. 이용시간 계수가 음수인가\nhours_effect = clf.coef_[0][0] < 0\n\nprint(proba.round(3), labels, hours_effect)\n",
    "hints": [
      "LogisticRegression().fit(X, y)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습된 모델",
        "expr": "hasattr(clf, 'coef_')",
        "hint": "LogisticRegression().fit(X, y)"
      },
      {
        "label": "2단계 두 고객의 해지 확률",
        "expr": "np.shape(proba) == (2,) and proba[0] > 0.5 > proba[1]",
        "hint": "clf.predict_proba(customers)[:, 1]"
      },
      {
        "label": "3단계 0.5 기준 판정",
        "expr": "list(labels) == [1, 0]",
        "hint": "clf.predict(customers)"
      },
      {
        "label": "4단계 이용시간 계수가 음수인가",
        "expr": "bool(hours_effect) is True",
        "hint": "clf.coef_[0][0] < 0"
      }
    ]
  },
  {
    "id": "19-1",
    "unit": 19,
    "domain": "mfg",
    "title": "불량 검사 AI 성능 (혼동행렬)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "confusion_matrix(y, pred).ravel()",
        "TN, FP, FN, TP"
      ],
      [
        "precision_score / recall_score",
        "정밀도 / 재현율"
      ]
    ],
    "origin": "신규",
    "desc": "<p>외관 검사 AI가 불량 확률을 냈습니다. 0.5 이상을 불량으로 판정합니다.</p>\n<ol><li><code>pred</code>: 0.5 기준 판정 (0/1 정수 배열)</li><li><code>tn_fp_fn_tp</code>: 혼동행렬 네 값 (TN, FP, FN, TP)</li><li><code>precision</code>: 정밀도</li><li><code>recall</code>: 재현율</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score\n\n# 외관 검사 AI 결과 20건 (1 = 불량)\ny_true = np.array([0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0])\nproba = np.array([.10, .30, .80, .20, .45, .05, .60, .90, .15, .25, .70, .35, .10, .55, .40, .20, .85, .05, .30, .15])\n\n# 1. 0.5 기준 판정 (0/1 정수 배열)\npred = \n# 2. 혼동행렬 네 값 (TN, FP, FN, TP)\ntn_fp_fn_tp = \n# 3. 정밀도\nprecision = \n# 4. 재현율\nrecall = \n\nprint([int(v) for v in tn_fp_fn_tp], round(precision, 3), round(recall, 3))\n",
    "solution": "import numpy as np\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score\n\n# 외관 검사 AI 결과 20건 (1 = 불량)\ny_true = np.array([0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0])\nproba = np.array([.10, .30, .80, .20, .45, .05, .60, .90, .15, .25, .70, .35, .10, .55, .40, .20, .85, .05, .30, .15])\n\n# 1. 0.5 기준 판정 (0/1 정수 배열)\npred = (proba >= 0.5).astype(int)\n# 2. 혼동행렬 네 값 (TN, FP, FN, TP)\ntn_fp_fn_tp = tuple(confusion_matrix(y_true, pred).ravel())\n# 3. 정밀도\nprecision = precision_score(y_true, pred)\n# 4. 재현율\nrecall = recall_score(y_true, pred)\n\nprint([int(v) for v in tn_fp_fn_tp], round(precision, 3), round(recall, 3))\n",
    "hints": [
      "(proba >= 0.5).astype(int)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 0.5 기준 판정 (0/1 정수 배열)",
        "expr": "list(pred) == list((proba >= 0.5).astype(int))",
        "hint": "(proba >= 0.5).astype(int)"
      },
      {
        "label": "2단계 혼동행렬 네 값 (TN, FP, FN, TP)",
        "expr": "[int(v) for v in tn_fp_fn_tp] == [12, 2, 2, 4]",
        "hint": "confusion_matrix(y_true, pred).ravel()"
      },
      {
        "label": "3단계 정밀도",
        "expr": "abs(precision - 0.6666666666666666) < 6.67e-05",
        "hint": "precision_score(y_true, pred)"
      },
      {
        "label": "4단계 재현율",
        "expr": "abs(recall - 0.6666666666666666) < 6.67e-05",
        "hint": "recall_score(y_true, pred)"
      }
    ]
  },
  {
    "id": "19-2",
    "unit": 19,
    "domain": "mfg",
    "title": "불량을 놓치지 않는 임계값",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "(proba >= t).astype(int)",
        "임계값 t로 판정"
      ],
      [
        "recall_score",
        "재현율"
      ]
    ],
    "origin": "신규",
    "desc": "<p>불량을 놓치면 고객 클레임이 됩니다. 임계값을 0.5에서 0.35로 낮추면 무엇이 바뀌는지 봅니다.</p>\n<ol><li><code>recall_50</code>: 임계값 0.5 재현율</li><li><code>recall_35</code>: 임계값 0.35 재현율</li><li><code>precision_35</code>: 임계값 0.35 정밀도</li><li><code>missed_35</code>: 임계값 0.35에서 놓친 불량 개수 (FN)</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score\n\n# 외관 검사 AI 결과 20건 (1 = 불량)\ny_true = np.array([0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0])\nproba = np.array([.10, .30, .80, .20, .45, .05, .60, .90, .15, .25, .70, .35, .10, .55, .40, .20, .85, .05, .30, .15])\n\n# 1. 임계값 0.5 재현율\nrecall_50 = \n# 2. 임계값 0.35 재현율\nrecall_35 = \n# 3. 임계값 0.35 정밀도\nprecision_35 = \n# 4. 임계값 0.35에서 놓친 불량 개수 (FN)\nmissed_35 = \n\nprint(recall_50, recall_35, round(precision_35, 3), missed_35)\n",
    "solution": "import numpy as np\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score\n\n# 외관 검사 AI 결과 20건 (1 = 불량)\ny_true = np.array([0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0])\nproba = np.array([.10, .30, .80, .20, .45, .05, .60, .90, .15, .25, .70, .35, .10, .55, .40, .20, .85, .05, .30, .15])\n\n# 1. 임계값 0.5 재현율\nrecall_50 = recall_score(y_true, (proba >= 0.5).astype(int))\n# 2. 임계값 0.35 재현율\nrecall_35 = recall_score(y_true, (proba >= 0.35).astype(int))\n# 3. 임계값 0.35 정밀도\nprecision_35 = precision_score(y_true, (proba >= 0.35).astype(int))\n# 4. 임계값 0.35에서 놓친 불량 개수 (FN)\nmissed_35 = int(((proba < 0.35) & (y_true == 1)).sum())\n\nprint(recall_50, recall_35, round(precision_35, 3), missed_35)\n",
    "hints": [
      "recall_score(y_true, (proba >= 0.5).astype(int))",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 임계값 0.5 재현율",
        "expr": "abs(recall_50 - 0.6666666666666666) < 6.67e-05",
        "hint": "recall_score(y_true, (proba >= 0.5).astype(int))"
      },
      {
        "label": "2단계 임계값 0.35 재현율",
        "expr": "abs(recall_35 - 1.0) < 0.0001",
        "hint": "임계값만 0.35로"
      },
      {
        "label": "3단계 임계값 0.35 정밀도",
        "expr": "abs(precision_35 - 0.6666666666666666) < 6.67e-05",
        "hint": "precision_score"
      },
      {
        "label": "4단계 임계값 0.35에서 놓친 불량 개수 (FN)",
        "expr": "int(missed_35) == 0",
        "hint": "실제 1인데 0으로 판정한 수"
      }
    ]
  },
  {
    "id": "19-3",
    "unit": 19,
    "domain": "general",
    "title": "스팸 필터 평가 (precision · recall · F1)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "precision_score / recall_score / f1_score",
        "지표 계산"
      ]
    ],
    "origin": "신규",
    "desc": "<p>스팸 점수 0.5 이상을 스팸으로 분류합니다. 정상 메일이 스팸함에 가면 곤란하므로 정밀도가 중요합니다.</p>\n<ol><li><code>pred</code>: 0.5 기준 판정</li><li><code>precision</code>: 정밀도</li><li><code>recall</code>: 재현율</li><li><code>f1</code>: F1</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score\n\n# 스팸 필터 결과 16건 (1 = 스팸)\ny_true = np.array([1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0])\nscore = np.array([.92, .20, .65, .81, .10, .45, .30, .05, .77, .55, .15, .88, .25, .35, .60, .12])\n\n# 1. 0.5 기준 판정\npred = \n# 2. 정밀도\nprecision = \n# 3. 재현율\nrecall = \n# 4. F1\nf1 = \n\nprint(round(precision, 3), round(recall, 3), round(f1, 3))\n",
    "solution": "import numpy as np\nfrom sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score\n\n# 스팸 필터 결과 16건 (1 = 스팸)\ny_true = np.array([1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0])\nscore = np.array([.92, .20, .65, .81, .10, .45, .30, .05, .77, .55, .15, .88, .25, .35, .60, .12])\n\n# 1. 0.5 기준 판정\npred = (score >= 0.5).astype(int)\n# 2. 정밀도\nprecision = precision_score(y_true, pred)\n# 3. 재현율\nrecall = recall_score(y_true, pred)\n# 4. F1\nf1 = f1_score(y_true, pred)\n\nprint(round(precision, 3), round(recall, 3), round(f1, 3))\n",
    "hints": [
      "(score >= 0.5).astype(int)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 0.5 기준 판정",
        "expr": "list(pred) == list((score >= 0.5).astype(int))",
        "hint": "(score >= 0.5).astype(int)"
      },
      {
        "label": "2단계 정밀도",
        "expr": "abs(precision - 0.7142857142857143) < 7.14e-05",
        "hint": "precision_score"
      },
      {
        "label": "3단계 재현율",
        "expr": "abs(recall - 0.8333333333333334) < 8.33e-05",
        "hint": "recall_score"
      },
      {
        "label": "4단계 F1",
        "expr": "abs(f1 - 0.7692307692307693) < 7.69e-05",
        "hint": "f1_score"
      }
    ]
  },
  {
    "id": "19-4",
    "unit": 19,
    "domain": "general",
    "title": "임계값과 무관한 성능 (ROC-AUC)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "roc_auc_score(y, score)",
        "ROC 곡선 아래 면적"
      ],
      [
        "precision_score",
        "정밀도"
      ]
    ],
    "origin": "신규",
    "desc": "<p>임계값을 0.7로 올리면 정밀도가 어떻게 되는지, 그리고 임계값과 무관한 ROC-AUC를 구합니다.</p>\n<ol><li><code>precision_70</code>: 임계값 0.7 정밀도</li><li><code>recall_70</code>: 임계값 0.7 재현율</li><li><code>auc</code>: ROC-AUC</li></ol>",
    "starter": "import numpy as np\nfrom sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score\n\n# 스팸 필터 결과 16건 (1 = 스팸)\ny_true = np.array([1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0])\nscore = np.array([.92, .20, .65, .81, .10, .45, .30, .05, .77, .55, .15, .88, .25, .35, .60, .12])\n\n# 1. 임계값 0.7 정밀도\nprecision_70 = \n# 2. 임계값 0.7 재현율\nrecall_70 = \n# 3. ROC-AUC\nauc = \n\nprint(precision_70, round(recall_70, 3), round(auc, 3))\n",
    "solution": "import numpy as np\nfrom sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score\n\n# 스팸 필터 결과 16건 (1 = 스팸)\ny_true = np.array([1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0])\nscore = np.array([.92, .20, .65, .81, .10, .45, .30, .05, .77, .55, .15, .88, .25, .35, .60, .12])\n\n# 1. 임계값 0.7 정밀도\nprecision_70 = precision_score(y_true, (score >= 0.7).astype(int))\n# 2. 임계값 0.7 재현율\nrecall_70 = recall_score(y_true, (score >= 0.7).astype(int))\n# 3. ROC-AUC\nauc = roc_auc_score(y_true, score)\n\nprint(precision_70, round(recall_70, 3), round(auc, 3))\n",
    "hints": [
      "(score >= 0.7).astype(int)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 임계값 0.7 정밀도",
        "expr": "abs(precision_70 - 1.0) < 0.0001",
        "hint": "(score >= 0.7).astype(int)"
      },
      {
        "label": "2단계 임계값 0.7 재현율",
        "expr": "abs(recall_70 - 0.6666666666666666) < 6.67e-05",
        "hint": "recall_score"
      },
      {
        "label": "3단계 ROC-AUC",
        "expr": "abs(auc - 0.9500000000000001) < 9.5e-05",
        "hint": "roc_auc_score(y_true, score)  (판정값이 아니라 점수를 넣음)"
      }
    ]
  },
  {
    "id": "20-1",
    "unit": 20,
    "domain": "mfg",
    "title": "결정트리로 불량 판정",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "DecisionTreeClassifier(max_depth, random_state)",
        "결정트리"
      ],
      [
        ".feature_importances_",
        "피처 중요도"
      ]
    ],
    "origin": "신규",
    "desc": "<p>도금 로트 데이터로 깊이 3인 결정트리를 학습합니다. 열 0은 온도, 열 1은 전류밀도입니다.</p>\n<ol><li><code>tree</code>: 학습된 트리 (max_depth=3, random_state=0)</li><li><code>test_acc</code>: 테스트 정확도</li><li><code>importances</code>: 피처 중요도 배열</li><li><code>top_feature</code>: 가장 중요한 열 번호 (int)</li></ol>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 학습된 트리 (max_depth=3, random_state=0)\ntree = \n# 2. 테스트 정확도\ntest_acc = \n# 3. 피처 중요도 배열\nimportances = \n# 4. 가장 중요한 열 번호 (int)\ntop_feature = \n\nprint(round(test_acc, 3), importances.round(3), top_feature)\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\n# 1. 학습된 트리 (max_depth=3, random_state=0)\ntree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)\n# 2. 테스트 정확도\ntest_acc = tree.score(X_test, y_test)\n# 3. 피처 중요도 배열\nimportances = tree.feature_importances_\n# 4. 가장 중요한 열 번호 (int)\ntop_feature = int(np.argmax(importances))\n\nprint(round(test_acc, 3), importances.round(3), top_feature)\n",
    "hints": [
      "DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습된 트리 (max_depth=3, random_state=0)",
        "expr": "tree.get_depth() <= 3",
        "hint": "DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)"
      },
      {
        "label": "2단계 테스트 정확도",
        "expr": "abs(test_acc - tree.score(X_test, y_test)) < 1e-12 and test_acc >= 0.7",
        "hint": "tree.score(X_test, y_test)"
      },
      {
        "label": "3단계 피처 중요도 배열",
        "expr": "np.isclose(np.sum(importances), 1)",
        "hint": "tree.feature_importances_"
      },
      {
        "label": "4단계 가장 중요한 열 번호 (int)",
        "expr": "top_feature == int(np.argmax(tree.feature_importances_))",
        "hint": "int(np.argmax(importances))"
      }
    ]
  },
  {
    "id": "20-2",
    "unit": 20,
    "domain": "mfg",
    "title": "깊이와 과적합",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "for d in depths",
        "깊이를 바꿔 가며 반복"
      ],
      [
        ".score",
        "정확도"
      ]
    ],
    "origin": "신규",
    "desc": "<p>트리 깊이 1, 2, 4, 8, None(끝까지)에서 학습·테스트 정확도를 비교합니다.</p>\n<ol><li><code>train_scores</code>: 깊이별 학습 정확도 리스트</li><li><code>test_scores</code>: 깊이별 테스트 정확도 리스트</li><li><code>gap_full</code>: 깊이 None에서 (학습 − 테스트) 정확도 차이</li></ol>",
    "starter": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\ndepths = [1, 2, 4, 8, None]\n\n# 1. 깊이별 학습 정확도 리스트\ntrain_scores = \n# 2. 깊이별 테스트 정확도 리스트\ntest_scores = \n# 3. 깊이 None에서 (학습 − 테스트) 정확도 차이\ngap_full = \n\nfor d, a, b in zip(depths, train_scores, test_scores):\n    print(d, round(a, 3), round(b, 3))\nprint(\"gap\", round(gap_full, 3))\n",
    "solution": "import numpy as np\n\n# 도금 공정 120개 로트: 온도(℃), 전류밀도(A/dm²), 불량 여부(1 = 불량)\ni = np.arange(120)\ntemp = 52 + 4 * np.sin(i * 0.37) + 1.5 * np.cos(i * 1.91)\ncurrent = 3.0 + 0.6 * np.cos(i * 0.53) + 0.25 * np.sin(i * 2.71)\nX = np.column_stack([temp, current])\ny = (((temp - 52) / 4 + (current - 3.0) / 0.6 + 0.7 * np.sin(i * 3.33)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\ndepths = [1, 2, 4, 8, None]\n\n# 1. 깊이별 학습 정확도 리스트\ntrain_scores = [DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_train, y_train).score(X_train, y_train) for d in depths]\n# 2. 깊이별 테스트 정확도 리스트\ntest_scores = [DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_train, y_train).score(X_test, y_test) for d in depths]\n# 3. 깊이 None에서 (학습 − 테스트) 정확도 차이\ngap_full = train_scores[-1] - test_scores[-1]\n\nfor d, a, b in zip(depths, train_scores, test_scores):\n    print(d, round(a, 3), round(b, 3))\nprint(\"gap\", round(gap_full, 3))\n",
    "hints": [
      "for 문이나 리스트 컴프리헨션으로 depths를 돌며 fit → score(X_train, y_train)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 깊이별 학습 정확도 리스트",
        "expr": "len(train_scores) == 5 and train_scores[-1] == 1.0 and train_scores[0] <= train_scores[-1]",
        "hint": "for 문이나 리스트 컴프리헨션으로 depths를 돌며 fit → score(X_train, y_train)"
      },
      {
        "label": "2단계 깊이별 테스트 정확도 리스트",
        "expr": "len(test_scores) == 5 and all(0 <= s <= 1 for s in test_scores)",
        "hint": "같은 방식으로 score(X_test, y_test)"
      },
      {
        "label": "3단계 깊이 None에서 (학습 − 테스트) 정확도 차이",
        "expr": "abs(gap_full - (train_scores[-1] - test_scores[-1])) < 1e-12 and gap_full > 0",
        "hint": "train_scores[-1] - test_scores[-1]"
      }
    ]
  },
  {
    "id": "20-3",
    "unit": 20,
    "domain": "general",
    "title": "해지 예측 트리와 중요 피처",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "DecisionTreeClassifier",
        "결정트리"
      ],
      [
        ".feature_importances_",
        "피처 중요도"
      ]
    ],
    "origin": "신규",
    "desc": "<p>구독 고객 데이터로 깊이 3 트리를 학습합니다. 열 0은 이용시간, 열 1은 문의 수입니다.</p>\n<ol><li><code>tree</code>: 학습된 트리 (max_depth=3, random_state=0)</li><li><code>test_acc</code>: 테스트 정확도</li><li><code>top_feature</code>: 가장 중요한 열 번호</li></ol>",
    "starter": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)\n\n# 1. 학습된 트리 (max_depth=3, random_state=0)\ntree = \n# 2. 테스트 정확도\ntest_acc = \n# 3. 가장 중요한 열 번호\ntop_feature = \n\nprint(round(test_acc, 3), top_feature)\n",
    "solution": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)\n\n# 1. 학습된 트리 (max_depth=3, random_state=0)\ntree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)\n# 2. 테스트 정확도\ntest_acc = tree.score(X_test, y_test)\n# 3. 가장 중요한 열 번호\ntop_feature = int(np.argmax(tree.feature_importances_))\n\nprint(round(test_acc, 3), top_feature)\n",
    "hints": [
      "DecisionTreeClassifier(max_depth=3, random_state=0)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 학습된 트리 (max_depth=3, random_state=0)",
        "expr": "tree.get_depth() <= 3",
        "hint": "DecisionTreeClassifier(max_depth=3, random_state=0)"
      },
      {
        "label": "2단계 테스트 정확도",
        "expr": "abs(test_acc - tree.score(X_test, y_test)) < 1e-12 and test_acc >= 0.7",
        "hint": "tree.score(X_test, y_test)"
      },
      {
        "label": "3단계 가장 중요한 열 번호",
        "expr": "top_feature == int(np.argmax(tree.feature_importances_))",
        "hint": "np.argmax(tree.feature_importances_)"
      }
    ]
  },
  {
    "id": "20-4",
    "unit": 20,
    "domain": "general",
    "title": "트리 하나 vs 랜덤포레스트",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "RandomForestClassifier(n_estimators, random_state)",
        "랜덤포레스트"
      ],
      [
        ".score",
        "정확도"
      ]
    ],
    "origin": "신규",
    "desc": "<p>끝까지 자란 트리 하나와 트리 100개짜리 랜덤포레스트의 학습·테스트 정확도를 비교합니다.</p>\n<ol><li><code>tree</code>: 깊이 제한 없는 트리 (random_state=0)</li><li><code>forest</code>: 랜덤포레스트 (n_estimators=100, random_state=0)</li><li><code>tree_test</code>: 트리 테스트 정확도</li><li><code>forest_test</code>: 포레스트 테스트 정확도</li></ol>",
    "starter": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)\n\n# 1. 깊이 제한 없는 트리 (random_state=0)\ntree = \n# 2. 랜덤포레스트 (n_estimators=100, random_state=0)\nforest = \n# 3. 트리 테스트 정확도\ntree_test = \n# 4. 포레스트 테스트 정확도\nforest_test = \n\nprint(\"tree\", round(tree_test, 3), \"forest\", round(forest_test, 3))\n",
    "solution": "import numpy as np\n\n# 구독 서비스 고객 120명: 월 이용시간(시간), 고객센터 문의 수, 해지 여부(1 = 해지)\ni = np.arange(120)\nhours = 20 + 8 * np.sin(i * 0.41) + 3 * np.cos(i * 1.73)\ncalls = 2.0 + 1.5 * np.cos(i * 0.59) + 0.6 * np.sin(i * 2.37)\nX = np.column_stack([hours, calls])\ny = ((-(hours - 20) / 8 + (calls - 2.0) / 1.5 + 0.7 * np.sin(i * 3.11)) > 1.0).astype(int)\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)\n\n# 1. 깊이 제한 없는 트리 (random_state=0)\ntree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)\n# 2. 랜덤포레스트 (n_estimators=100, random_state=0)\nforest = RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)\n# 3. 트리 테스트 정확도\ntree_test = tree.score(X_test, y_test)\n# 4. 포레스트 테스트 정확도\nforest_test = forest.score(X_test, y_test)\n\nprint(\"tree\", round(tree_test, 3), \"forest\", round(forest_test, 3))\n",
    "hints": [
      "DecisionTreeClassifier(random_state=0).fit(X_train, y_train)",
      "변수 이름을 바꾸지 말고 = 오른쪽만 채우세요. print 줄로 값을 확인할 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 깊이 제한 없는 트리 (random_state=0)",
        "expr": "tree.score(X_train, y_train) == 1.0",
        "hint": "DecisionTreeClassifier(random_state=0).fit(X_train, y_train)"
      },
      {
        "label": "2단계 랜덤포레스트 (n_estimators=100, random_state=0)",
        "expr": "len(forest.estimators_) == 100",
        "hint": "RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)"
      },
      {
        "label": "3단계 트리 테스트 정확도",
        "expr": "abs(tree_test - tree.score(X_test, y_test)) < 1e-12",
        "hint": "tree.score(X_test, y_test)"
      },
      {
        "label": "4단계 포레스트 테스트 정확도",
        "expr": "abs(forest_test - forest.score(X_test, y_test)) < 1e-12 and forest_test >= 0.7",
        "hint": "forest.score(X_test, y_test)"
      }
    ]
  }
];

export const SM_QUIZZES = [
  {
    "id": "12-Q",
    "unit": 12,
    "title": "기술통계 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "choice",
        "q": "이상치가 하나 섞였을 때 가장 덜 흔들리는 대표값은?",
        "options": [
          "평균",
          "중앙값",
          "표준편차",
          "최댓값"
        ],
        "answer": 1,
        "explain": "중앙값은 순서의 가운데 값이라 극단값 하나에 거의 영향을 받지 않습니다."
      },
      {
        "kind": "ox",
        "q": "np.std(x)의 기본값은 표본 표준편차(ddof=1)이다.",
        "answer": false,
        "explain": "NumPy 기본은 ddof=0(모표준편차)입니다. 표본이면 ddof=1을 넣습니다. pandas의 .std()는 기본이 ddof=1이라 헷갈리기 쉽습니다."
      },
      {
        "kind": "short",
        "q": "출력 결과를 쓰세요.",
        "code": "import numpy as np\nx = np.array([1, 2, 3, 4, 100])\nprint(np.median(x))",
        "answer": [
          "3.0",
          "3"
        ],
        "explain": "정렬했을 때 가운데 값은 3입니다. 100이 있어도 중앙값은 그대로입니다."
      },
      {
        "kind": "choice",
        "q": "IQR 이상치 기준의 상한은?",
        "options": [
          "Q3 + IQR",
          "Q3 + 1.5·IQR",
          "평균 + 2σ",
          "Q1 + 1.5·IQR"
        ],
        "answer": 1,
        "explain": "Q3 + 1.5·IQR 초과, Q1 − 1.5·IQR 미만을 이상치로 봅니다(Tukey 규칙)."
      },
      {
        "kind": "ox",
        "q": "평균이 중앙값보다 훨씬 크면 오른쪽(큰 값) 꼬리가 긴 분포일 가능성이 높다.",
        "answer": true,
        "explain": "큰 값들이 평균을 오른쪽으로 끌어당긴 상태입니다."
      }
    ]
  },
  {
    "id": "13-Q",
    "unit": 13,
    "title": "확률분포 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "choice",
        "q": "\"하루 동안 들어오는 불만 접수 건수\"에 가장 알맞은 분포는?",
        "options": [
          "이항분포",
          "포아송분포",
          "정규분포",
          "균등분포"
        ],
        "answer": 1,
        "explain": "일정 시간·공간에서 드물게 일어나는 사건의 개수는 포아송분포로 봅니다."
      },
      {
        "kind": "choice",
        "q": "이항분포에서 \"3개 이상\"일 확률은?",
        "options": [
          "sf(3)",
          "sf(2)",
          "cdf(3)",
          "1 - pmf(3)"
        ],
        "answer": 1,
        "explain": "sf(k)는 k 초과입니다. 3개 이상 = 2개 초과 = sf(2)."
      },
      {
        "kind": "ox",
        "q": "stats.norm.ppf(0.5)는 0이다.",
        "answer": true,
        "explain": "표준정규분포의 하위 50% 지점은 평균 0입니다."
      },
      {
        "kind": "short",
        "q": "출력 결과를 쓰세요 (소수 둘째 자리).",
        "code": "from scipy import stats\nprint(round(stats.norm.ppf(0.975), 2))",
        "answer": "1.96",
        "explain": "양측 95% 구간의 경계 z값이 1.96입니다."
      },
      {
        "kind": "ox",
        "q": "정규분포에서 평균 ± 2σ 안에 약 95%가 들어간다.",
        "answer": true,
        "explain": "68–95–99.7 규칙: ±1σ 68%, ±2σ 95%, ±3σ 99.7%."
      }
    ]
  },
  {
    "id": "14-Q",
    "unit": 14,
    "title": "표본분포 · 중심극한정리 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "choice",
        "q": "표준오차를 절반으로 줄이려면 표본 수를 몇 배로?",
        "options": [
          "2배",
          "4배",
          "√2배",
          "8배"
        ],
        "answer": 1,
        "explain": "SE = σ/√n 이므로 √n이 2배, 즉 n이 4배가 되어야 합니다."
      },
      {
        "kind": "ox",
        "q": "중심극한정리는 원래 데이터가 정규분포여야만 성립한다.",
        "answer": false,
        "explain": "원래 분포가 치우쳐 있어도 표본 크기가 크면 표본평균의 분포가 정규분포에 가까워집니다."
      },
      {
        "kind": "ox",
        "q": "표준편차와 표준오차는 같은 말이다.",
        "answer": false,
        "explain": "표준편차는 개별 값의 흩어짐, 표준오차는 표본평균(추정값)의 흩어짐입니다."
      },
      {
        "kind": "choice",
        "q": "np.random.default_rng(42)처럼 시드를 고정하는 이유는?",
        "options": [
          "더 정확한 난수를 위해",
          "실행할 때마다 같은 결과를 재현하려고",
          "속도를 높이려고",
          "정규분포로 만들려고"
        ],
        "answer": 1,
        "explain": "시드를 고정하면 같은 난수열이 나와 결과를 재현하고 채점할 수 있습니다."
      }
    ]
  },
  {
    "id": "15-Q",
    "unit": 15,
    "title": "신뢰구간 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "ox",
        "q": "95% 신뢰구간은 \"참값이 이 구간 안에 있을 확률이 95%\"라는 뜻이다.",
        "answer": false,
        "explain": "참값은 고정된 값입니다. 같은 방법으로 구간을 반복해 만들면 약 95%가 참값을 포함한다는 뜻입니다."
      },
      {
        "kind": "choice",
        "q": "표본 10개로 평균의 신뢰구간을 만들 때 t 분포의 자유도는?",
        "options": [
          "10",
          "9",
          "8",
          "11"
        ],
        "answer": 1,
        "explain": "표본 표준편차를 쓰므로 자유도는 n − 1 = 9입니다."
      },
      {
        "kind": "choice",
        "q": "신뢰수준을 95%에서 99%로 올리면 구간 폭은?",
        "options": [
          "좁아진다",
          "넓어진다",
          "그대로",
          "표본에 따라 다르다"
        ],
        "answer": 1,
        "explain": "더 확실하게 포함하려면 구간이 넓어져야 합니다."
      },
      {
        "kind": "ox",
        "q": "표본 수를 늘리면 같은 신뢰수준에서 구간이 좁아진다.",
        "answer": true,
        "explain": "표준오차 s/√n이 작아지기 때문입니다."
      }
    ]
  },
  {
    "id": "16-Q",
    "unit": 16,
    "title": "가설검정 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "ox",
        "q": "p-value가 0.03이면 귀무가설이 참일 확률이 3%라는 뜻이다.",
        "answer": false,
        "explain": "p-value는 귀무가설이 참이라고 가정했을 때 지금만큼 극단적인 결과가 나올 확률입니다."
      },
      {
        "kind": "choice",
        "q": "같은 작업자 10명의 교육 전후 점수를 비교할 때 알맞은 검정은?",
        "options": [
          "독립 2표본 t검정",
          "대응표본 t검정",
          "1표본 t검정",
          "카이제곱 검정"
        ],
        "answer": 1,
        "explain": "같은 대상을 두 번 측정했으므로 대응표본(ttest_rel)입니다."
      },
      {
        "kind": "choice",
        "q": "ttest_ind에서 equal_var=False가 뜻하는 것은?",
        "options": [
          "분산이 같다고 가정",
          "Welch 검정 (분산이 달라도 됨)",
          "대응표본",
          "단측검정"
        ],
        "answer": 1,
        "explain": "두 집단의 분산이 같다고 가정하지 않는 Welch t검정입니다. 실무에서는 이쪽이 안전합니다."
      },
      {
        "kind": "ox",
        "q": "유의수준 0.05에서 p = 0.07이면 \"차이가 없다\"고 증명된 것이다.",
        "answer": false,
        "explain": "기각하지 못했을 뿐 차이가 없다는 증거는 아닙니다. 표본이 작으면 실제 차이도 놓칠 수 있습니다(검정력)."
      },
      {
        "kind": "short",
        "q": "\"새 방식이 더 크다\"를 검정할 때 alternative 인자 값은? (new를 첫 번째 인자로)",
        "answer": [
          "greater",
          "'greater'"
        ],
        "explain": "ttest_ind(new, old, alternative='greater')."
      }
    ]
  },
  {
    "id": "17-Q",
    "unit": 17,
    "title": "ML 워크플로 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "choice",
        "q": "불량이 5%뿐인 데이터를 나눌 때 클래스 비율을 유지하려면?",
        "options": [
          "shuffle=False",
          "stratify=y",
          "test_size=0.5",
          "random_state=0"
        ],
        "answer": 1,
        "explain": "stratify=y를 주면 학습·테스트 세트의 클래스 비율이 원본과 같아집니다."
      },
      {
        "kind": "ox",
        "q": "불량 5% 데이터에서 정확도 95%인 모델은 좋은 모델이다.",
        "answer": false,
        "explain": "전부 양품이라고만 해도 95%입니다. 기준 모델과 비교하고 재현율을 함께 봐야 합니다."
      },
      {
        "kind": "choice",
        "q": "데이터 누수(leakage)에 해당하는 것은?",
        "options": [
          "학습 데이터로 스케일러를 fit",
          "전체 데이터로 스케일러를 fit한 뒤 분할",
          "random_state 고정",
          "테스트 데이터를 마지막에 한 번 평가"
        ],
        "answer": 1,
        "explain": "테스트 정보가 전처리 기준에 섞여 성능이 부풀려집니다. 분할 후 학습 데이터로만 fit 합니다."
      },
      {
        "kind": "ox",
        "q": "테스트 세트 점수를 보면서 하이퍼파라미터를 계속 바꾸는 것도 누수의 일종이다.",
        "answer": true,
        "explain": "테스트 세트에 맞춰진 모델이 됩니다. 튜닝은 검증 세트나 교차검증으로 합니다."
      }
    ]
  },
  {
    "id": "18-Q",
    "unit": 18,
    "title": "선형 · 로지스틱 회귀 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "choice",
        "q": "LinearRegression에 열 하나짜리 x를 넣을 때 필요한 것은?",
        "options": [
          "x.T",
          "x.reshape(-1, 1)",
          "x.flatten()",
          "list(x)"
        ],
        "answer": 1,
        "explain": "scikit-learn의 X는 (샘플 수, 피처 수) 2차원이어야 합니다."
      },
      {
        "kind": "ox",
        "q": "로지스틱 회귀는 이름과 달리 분류 모델이다.",
        "answer": true,
        "explain": "선형 결합을 시그모이드로 0~1 확률로 바꿔 분류합니다."
      },
      {
        "kind": "choice",
        "q": "predict_proba(X)[:, 1]의 의미는?",
        "options": [
          "클래스 0 확률",
          "클래스 1 확률",
          "예측 라벨",
          "결정 경계까지 거리"
        ],
        "answer": 1,
        "explain": "두 번째 열이 클래스 1일 확률입니다."
      },
      {
        "kind": "ox",
        "q": "R²가 1에 가까울수록 회귀선이 데이터를 잘 설명한다.",
        "answer": true,
        "explain": "R² = 1 − (잔차 제곱합 / 전체 제곱합). 1이면 완벽히 설명합니다."
      }
    ]
  },
  {
    "id": "19-Q",
    "unit": 19,
    "title": "평가지표 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "choice",
        "q": "불량을 놓치면 안 되는 검사에서 가장 중요하게 볼 지표는?",
        "options": [
          "정밀도",
          "재현율",
          "정확도",
          "특이도"
        ],
        "answer": 1,
        "explain": "재현율(recall) = 실제 불량 중 잡아낸 비율. 놓친 불량(FN)이 줄어야 올라갑니다."
      },
      {
        "kind": "choice",
        "q": "confusion_matrix(y, pred).ravel()의 순서는?",
        "options": [
          "TP, FP, FN, TN",
          "TN, FP, FN, TP",
          "TN, FN, FP, TP",
          "TP, TN, FP, FN"
        ],
        "answer": 1,
        "explain": "행은 실제, 열은 예측이고 0이 먼저라 [[TN, FP], [FN, TP]]입니다."
      },
      {
        "kind": "ox",
        "q": "임계값을 낮추면 재현율은 오르거나 같고, 정밀도는 보통 내려간다.",
        "answer": true,
        "explain": "더 많이 1로 판정하므로 놓치는 것(FN)은 줄고 잘못 잡는 것(FP)은 늘어납니다."
      },
      {
        "kind": "choice",
        "q": "roc_auc_score에 넣어야 하는 두 번째 인자는?",
        "options": [
          "0/1 예측값",
          "확률(점수)",
          "혼동행렬",
          "임계값"
        ],
        "answer": 1,
        "explain": "AUC는 점수의 순서로 계산하므로 확률이나 점수를 넣습니다."
      },
      {
        "kind": "short",
        "q": "TP=8, FP=2일 때 정밀도는? (소수)",
        "answer": [
          "0.8",
          ".8"
        ],
        "explain": "8 / (8 + 2) = 0.8"
      }
    ]
  },
  {
    "id": "20-Q",
    "unit": 20,
    "title": "트리와 앙상블 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "OX · 객관식 · 출력 예측",
    "questions": [
      {
        "kind": "ox",
        "q": "결정트리는 깊어질수록 학습 정확도가 오르거나 같다.",
        "answer": true,
        "explain": "더 잘게 나눌수록 학습 데이터에 더 맞춰집니다. 끝까지 자라면 보통 100%가 됩니다."
      },
      {
        "kind": "choice",
        "q": "학습 정확도 1.00, 테스트 0.70이면?",
        "options": [
          "과소적합",
          "과적합",
          "누수",
          "정상"
        ],
        "answer": 1,
        "explain": "학습 데이터를 외운 과적합입니다. max_depth를 줄이거나 앙상블을 씁니다."
      },
      {
        "kind": "choice",
        "q": "랜덤포레스트가 트리 하나보다 안정적인 이유는?",
        "options": [
          "트리가 더 깊어서",
          "여러 트리의 투표로 분산이 줄어서",
          "선형 모델이라서",
          "스케일링을 해서"
        ],
        "answer": 1,
        "explain": "서로 다른 표본·피처로 만든 트리들의 투표라 한 트리의 우연한 실수가 상쇄됩니다."
      },
      {
        "kind": "ox",
        "q": "feature_importances_의 합은 1이다.",
        "answer": true,
        "explain": "각 피처가 불순도를 줄인 몫을 정규화한 값이라 합이 1입니다."
      },
      {
        "kind": "ox",
        "q": "결정트리는 입력 피처를 표준화하지 않아도 된다.",
        "answer": true,
        "explain": "값의 크기 비교(분기)만 하므로 단위·스케일에 영향을 받지 않습니다."
      }
    ]
  }
];
