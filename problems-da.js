// 파이썬 데이터분석 트랙 문제 (유닛 23~31: 브로드캐스팅 · pandas · 시계열 · matplotlib · seaborn). scratchpad build_da.py 로 생성.
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.
export const DA_UNITS = [
  {
    "id": 23,
    "title": "인덱싱과 브로드캐스팅",
    "summary": "2차원 인덱싱, shape, axis, 브로드캐스팅 규칙",
    "note": "<h4>2차원 인덱싱</h4><p><code>a[행, 열]</code>. <code>a[1]</code>은 행 하나, <code>a[:, 2]</code>는 열 하나, <code>a[:2, 1:]</code>은 부분 표입니다.</p><h4>브로드캐스팅</h4><p>모양이 다른 배열끼리 계산할 때, 뒤쪽 차원부터 맞춰 보며 크기가 1이거나 같은 차원을 늘려 맞춥니다. (4,3) − (3,) 은 행마다 같은 3개 값을 뺍니다. (4,) 를 열 방향으로 쓰려면 <code>a[:, None]</code>로 (4,1)을 만듭니다.</p>"
  },
  {
    "id": 24,
    "title": "pandas Series · DataFrame",
    "summary": "read_csv, head, shape, columns, describe, value_counts",
    "note": "<h4>두 가지 자료구조</h4><p><b>Series</b>는 이름표(index)가 붙은 1차원, <b>DataFrame</b>은 같은 index를 공유하는 Series 여러 개를 묶은 표입니다.</p><h4>첫 확인 순서</h4><p><code>pd.read_csv</code> → <code>head()</code> → <code>shape</code> · <code>columns</code> · <code>info()</code> → <code>describe()</code>. 범주형 열은 <code>value_counts()</code>, <code>nunique()</code>.</p>"
  },
  {
    "id": 25,
    "title": "선택과 필터",
    "summary": "df[조건], loc, iloc, isin, query",
    "note": "<h4>loc와 iloc</h4><p><code>loc[행 라벨/조건, 열 이름]</code>, <code>iloc[행 번호, 열 번호]</code>. loc 슬라이싱은 끝 라벨을 포함합니다.</p><h4>조건 필터</h4><p>조건이 여러 개면 <code>&</code>(그리고), <code>|</code>(또는)로 잇고 <b>조건마다 괄호</b>를 칩니다. 여러 값 중 하나는 <code>isin([...])</code>, 긴 조건은 <code>query(\"a > 1 and b == 'x'\")</code>.</p>"
  },
  {
    "id": 26,
    "title": "결측치와 전처리",
    "summary": "isna, fillna, dropna, ffill, astype, str 메서드, apply",
    "note": "<h4>결측치</h4><p><code>isna().sum()</code>으로 열별 개수를 먼저 봅니다. 채우기는 <code>fillna(값)</code>, 앞 값으로는 <code>ffill()</code>, 행 삭제는 <code>dropna()</code>. 평균은 이상치에 끌려가니 치우친 데이터는 중앙값으로 채웁니다.</p><h4>형변환과 문자열</h4><p>쉼표·단위가 붙은 숫자는 <code>.str.replace</code>로 지운 뒤 <code>astype(int)</code>. 값마다 규칙을 적용할 때는 <code>apply(lambda x: ...)</code>.</p>"
  },
  {
    "id": 27,
    "title": "groupby와 pivot_table",
    "summary": "split-apply-combine, agg, transform, pivot_table",
    "note": "<h4>split-apply-combine</h4><p><code>df.groupby('키')['값'].sum()</code>: 키별로 나누고(split), 집계하고(apply), 합칩니다(combine). 여러 집계는 <code>agg(새이름=('열', '함수'))</code>.</p><h4>transform과 pivot_table</h4><p><code>transform</code>은 그룹 집계값을 원래 행 수 그대로 돌려줘 비중 계산에 씁니다. <code>pivot_table(index, columns, values, aggfunc)</code>은 두 키로 교차표를 만듭니다.</p>"
  },
  {
    "id": 28,
    "title": "merge와 concat",
    "summary": "키 결합, how, 행 증가 함정, 위아래 붙이기",
    "note": "<h4>merge</h4><p><code>pd.merge(왼쪽, 오른쪽, on='키', how=...)</code>. 기본 how='inner'는 양쪽 모두 있는 키만, 'left'는 왼쪽 행을 모두 남기고 짝이 없으면 NaN.</p><h4>행 증가 함정</h4><p>오른쪽 표에 같은 키가 여러 번 있으면 결과 행이 늘어납니다. 결합 전 <code>duplicated()</code>로 키를 확인하고, <code>validate='one_to_one'</code>으로 막을 수 있습니다.</p><h4>concat</h4><p>같은 열 구조의 표를 위아래로 붙일 때 <code>pd.concat([a, b], ignore_index=True)</code>.</p>"
  },
  {
    "id": 29,
    "title": "시계열",
    "summary": "to_datetime, dt 접근자, resample, rolling, shift, diff",
    "note": "<h4>날짜형으로 바꾸기</h4><p><code>pd.to_datetime</code> 후 <code>.dt.month</code>, <code>.dt.hour</code>, <code>.dt.day_name()</code>, <code>.dt.dayofweek</code>(월=0).</p><h4>묶기와 미끄러지기</h4><p><code>resample('D')</code>·<code>('W')</code>는 시간 단위로 묶어 집계하고, <code>rolling(n)</code>은 n개 창을 밀며 평균을 냅니다. <code>shift(1)</code>은 전 시점 값, <code>diff()</code>는 차이, <code>pct_change()</code>는 변화율.</p>"
  },
  {
    "id": 30,
    "title": "matplotlib 기본",
    "summary": "fig/ax, plot · bar · scatter, 제목과 축, 서브플롯",
    "note": "<h4>fig와 ax</h4><p><code>fig, ax = plt.subplots()</code>로 그림(fig)과 축(ax)을 만들고 <code>ax.plot</code>, <code>ax.bar</code>, <code>ax.scatter</code>로 그립니다. 축 여러 개는 <code>plt.subplots(1, 2)</code>.</p><h4>읽히는 그래프</h4><p>제목 <code>set_title</code>, 축 이름 <code>set_xlabel</code>/<code>set_ylabel</code>, 기준선 <code>axhline</code>. 이 사이트에서는 한글 글꼴이 없어 그래프 글자는 영어로 씁니다.</p>"
  },
  {
    "id": 31,
    "title": "seaborn 통계 시각화",
    "summary": "histplot, boxplot, barplot, countplot, scatterplot, heatmap",
    "note": "<h4>DataFrame을 그대로</h4><p>seaborn은 <code>data=df, x='열', y='열', hue='열'</code>로 그립니다. 분포는 <code>histplot</code>·<code>boxplot</code>, 범주 비교는 <code>barplot</code>(평균)·<code>countplot</code>(개수), 관계는 <code>scatterplot</code>, 상관은 <code>heatmap(df.corr(), annot=True)</code>.</p><p class=\"qc\">barplot의 막대는 합계가 아니라 평균입니다. 합계를 그리려면 groupby로 먼저 집계하세요.</p>"
  }
];

export const DA_PROBLEMS = [
  {
    "id": "23-1",
    "unit": 23,
    "domain": "mfg",
    "title": "로트 × 측정 위치 2차원 배열 다루기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "shape",
        "배열의 형상 (행, 열)"
      ],
      [
        "data[i]",
        "i번째 행"
      ],
      [
        "data[:, j]",
        "j번째 열"
      ],
      [
        "mean(axis=0)",
        "열마다 평균"
      ],
      [
        "브로드캐스팅",
        "(4,3) − (3,) 계산"
      ]
    ],
    "origin": "NumPy",
    "desc": "<p><code>data</code>는 로트 4개(행)를 위치 3곳(열)에서 잰 두께(mm)입니다.</p>\n<ol><li><code>shape</code>: 배열 형상</li><li><code>lot2</code>: 두 번째 로트의 측정값 3개</li><li><code>point3</code>: 모든 로트의 세 번째 위치 값</li><li><code>col_mean</code>: 위치(열)별 평균</li><li><code>centered</code>: 각 값에서 그 위치 평균을 뺀 배열</li></ol>",
    "starter": "import numpy as np\ndata = np.array([[10.02, 9.98, 10.05],\n                 [10.10, 10.04, 10.12],\n                 [9.95, 9.91, 9.99],\n                 [10.01, 10.00, 10.03]])\n\n# 1. 배열 형상\nshape = \n# 2. 두 번째 로트의 측정값 3개\nlot2 = \n# 3. 모든 로트의 세 번째 위치 값\npoint3 = \n# 4. 위치(열)별 평균\ncol_mean = \n# 5. 각 값에서 그 위치 평균을 뺀 배열\ncentered = \n\nprint(shape, lot2, point3, col_mean.round(3), centered.round(3), sep='\\n')\n",
    "solution": "import numpy as np\ndata = np.array([[10.02, 9.98, 10.05],\n                 [10.10, 10.04, 10.12],\n                 [9.95, 9.91, 9.99],\n                 [10.01, 10.00, 10.03]])\n\n# 1. 배열 형상\nshape = data.shape\n# 2. 두 번째 로트의 측정값 3개\nlot2 = data[1]\n# 3. 모든 로트의 세 번째 위치 값\npoint3 = data[:, 2]\n# 4. 위치(열)별 평균\ncol_mean = data.mean(axis=0)\n# 5. 각 값에서 그 위치 평균을 뺀 배열\ncentered = data - col_mean\n\nprint(shape, lot2, point3, col_mean.round(3), centered.round(3), sep='\\n')\n",
    "hints": [
      "data.shape 는 (행, 열) 튜플입니다.",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 배열 형상",
        "expr": "shape == (4, 3)",
        "hint": "data.shape 는 (행, 열) 튜플입니다."
      },
      {
        "label": "2단계 두 번째 로트의 측정값 3개",
        "expr": "np.allclose(lot2, [10.1, 10.04, 10.12], atol=1e-4)",
        "hint": "행 하나는 data[1]"
      },
      {
        "label": "3단계 모든 로트의 세 번째 위치 값",
        "expr": "np.allclose(point3, [10.05, 10.12, 9.99, 10.03], atol=1e-4)",
        "hint": "열 하나는 data[:, 2]"
      },
      {
        "label": "4단계 위치(열)별 평균",
        "expr": "np.allclose(col_mean, [10.02, 9.9825, 10.0475], atol=1e-4)",
        "hint": "axis=0 은 행 방향으로 내려가며 열마다 계산합니다."
      },
      {
        "label": "5단계 각 값에서 그 위치 평균을 뺀 배열",
        "expr": "np.allclose(centered, [[0.0, -0.0025, 0.0025], [0.08, 0.0575, 0.0725], [-0.07, -0.0725, -0.0575], [-0.01, 0.0175, -0.0175]], atol=1e-4)",
        "hint": "(4, 3) − (3,) 은 브로드캐스팅으로 행마다 같은 값을 뺍니다."
      }
    ]
  },
  {
    "id": "23-2",
    "unit": 23,
    "domain": "mfg",
    "title": "위치별 규격으로 한 번에 판정",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "브로드캐스팅 비교",
        "(4,3) >= (3,)"
      ],
      [
        "&",
        "두 조건 모두"
      ],
      [
        "all(axis=1)",
        "행 안의 모든 값이 True인지"
      ],
      [
        "np.where",
        "True 위치 찾기"
      ]
    ],
    "origin": "NumPy",
    "desc": "<p>같은 <code>data</code>에 위치마다 규격이 다릅니다. 하한 <code>lo</code>, 상한 <code>hi</code>도 위치 3곳의 배열입니다.</p>\n<ol><li><code>ok</code>: 각 값이 규격 안인지 (True/False 배열)</li><li><code>ok_count</code>: 규격 안 값의 개수</li><li><code>lot_pass</code>: 로트별 합격 여부 (세 위치 모두 규격 안)</li><li><code>bad_lots</code>: 불합격 로트 번호 리스트 (0부터)</li></ol>",
    "starter": "import numpy as np\ndata = np.array([[10.02, 9.98, 10.05],\n                 [10.10, 10.04, 10.12],\n                 [9.95, 9.91, 9.99],\n                 [10.01, 10.00, 10.03]])\nlo = np.array([9.96, 9.94, 9.98])\nhi = np.array([10.08, 10.06, 10.10])\n\n# 1. 각 값이 규격 안인지 (True/False 배열)\nok = \n# 2. 규격 안 값의 개수\nok_count = \n# 3. 로트별 합격 여부 (세 위치 모두 규격 안)\nlot_pass = \n# 4. 불합격 로트 번호 리스트 (0부터)\nbad_lots = \n\nprint(ok, ok_count, lot_pass, bad_lots, sep='\\n')\n",
    "solution": "import numpy as np\ndata = np.array([[10.02, 9.98, 10.05],\n                 [10.10, 10.04, 10.12],\n                 [9.95, 9.91, 9.99],\n                 [10.01, 10.00, 10.03]])\nlo = np.array([9.96, 9.94, 9.98])\nhi = np.array([10.08, 10.06, 10.10])\n\n# 1. 각 값이 규격 안인지 (True/False 배열)\nok = (data >= lo) & (data <= hi)\n# 2. 규격 안 값의 개수\nok_count = int(ok.sum())\n# 3. 로트별 합격 여부 (세 위치 모두 규격 안)\nlot_pass = ok.all(axis=1)\n# 4. 불합격 로트 번호 리스트 (0부터)\nbad_lots = np.where(~lot_pass)[0].tolist()\n\nprint(ok, ok_count, lot_pass, bad_lots, sep='\\n')\n",
    "hints": [
      "(4,3)과 (3,)을 비교하면 열마다 그 위치의 규격으로 비교됩니다. 괄호를 꼭 치세요.",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 각 값이 규격 안인지 (True/False 배열)",
        "expr": "np.array_equal(np.asarray(ok), np.array([[True, True, True], [False, True, False], [False, False, True], [True, True, True]]))",
        "hint": "(4,3)과 (3,)을 비교하면 열마다 그 위치의 규격으로 비교됩니다. 괄호를 꼭 치세요."
      },
      {
        "label": "2단계 규격 안 값의 개수",
        "expr": "ok_count == 8",
        "hint": "True는 1로 더해집니다."
      },
      {
        "label": "3단계 로트별 합격 여부 (세 위치 모두 규격 안)",
        "expr": "np.array_equal(np.asarray(lot_pass), np.array([True, False, False, True]))",
        "hint": "axis=1 은 행 하나 안에서 판단합니다."
      },
      {
        "label": "4단계 불합격 로트 번호 리스트 (0부터)",
        "expr": "bad_lots == [1, 2]",
        "hint": "~ 는 True/False를 뒤집습니다. np.where(조건)[0]이 위치입니다."
      }
    ]
  },
  {
    "id": "23-3",
    "unit": 23,
    "domain": "general",
    "title": "매장 × 요일 매출표",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "sum(axis=1)",
        "행(매장)별 합계"
      ],
      [
        "mean(axis=0)",
        "열(요일)별 평균"
      ],
      [
        "argmax",
        "최댓값 위치"
      ],
      [
        "keepdims=True",
        "나눗셈용으로 차원 유지"
      ]
    ],
    "origin": "NumPy",
    "desc": "<p><code>sales</code>는 매장 3곳(행)의 월~일 7일(열) 매출(만 원)입니다.</p>\n<ol><li><code>store_sum</code>: 매장별 주간 합계</li><li><code>day_avg</code>: 요일별 평균 매출</li><li><code>best_store</code>: 주간 합계가 가장 큰 매장 번호 (0부터)</li><li><code>share</code>: 각 매장에서 요일별 매출 비중 (행 합이 1)</li></ol>",
    "starter": "import numpy as np\nsales = np.array([[120, 135, 128, 140, 190, 260, 240],\n                  [ 95, 102,  99, 110, 150, 210, 205],\n                  [140, 150, 138, 155, 220, 300, 280]])\n\n# 1. 매장별 주간 합계\nstore_sum = \n# 2. 요일별 평균 매출\nday_avg = \n# 3. 주간 합계가 가장 큰 매장 번호 (0부터)\nbest_store = \n# 4. 각 매장에서 요일별 매출 비중 (행 합이 1)\nshare = \n\nprint(store_sum, day_avg.round(1), best_store, share.round(3), sep='\\n')\n",
    "solution": "import numpy as np\nsales = np.array([[120, 135, 128, 140, 190, 260, 240],\n                  [ 95, 102,  99, 110, 150, 210, 205],\n                  [140, 150, 138, 155, 220, 300, 280]])\n\n# 1. 매장별 주간 합계\nstore_sum = sales.sum(axis=1)\n# 2. 요일별 평균 매출\nday_avg = sales.mean(axis=0)\n# 3. 주간 합계가 가장 큰 매장 번호 (0부터)\nbest_store = int(store_sum.argmax())\n# 4. 각 매장에서 요일별 매출 비중 (행 합이 1)\nshare = sales / sales.sum(axis=1, keepdims=True)\n\nprint(store_sum, day_avg.round(1), best_store, share.round(3), sep='\\n')\n",
    "hints": [
      "axis=1 은 행 하나(매장) 안에서 7일을 더합니다.",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 매장별 주간 합계",
        "expr": "np.allclose(store_sum, [1213.0, 971.0, 1383.0], atol=1e-4)",
        "hint": "axis=1 은 행 하나(매장) 안에서 7일을 더합니다."
      },
      {
        "label": "2단계 요일별 평균 매출",
        "expr": "np.allclose(day_avg, [118.333333, 129.0, 121.666667, 135.0, 186.666667, 256.666667, 241.666667], atol=1e-4)",
        "hint": "axis=0 은 열(요일)마다 세 매장을 평균합니다."
      },
      {
        "label": "3단계 주간 합계가 가장 큰 매장 번호 (0부터)",
        "expr": "best_store == 2",
        "hint": "argmax()"
      },
      {
        "label": "4단계 각 매장에서 요일별 매출 비중 (행 합이 1)",
        "expr": "np.allclose(share, [[0.098928, 0.111294, 0.105523, 0.115416, 0.156636, 0.214345, 0.197857], [0.097837, 0.105046, 0.101957, 0.113285, 0.15448, 0.216272, 0.211123], [0.101229, 0.10846, 0.099783, 0.112075, 0.159074, 0.21692, 0.202458]], atol=1e-4)",
        "hint": "keepdims=True 로 (3,1) 모양을 유지하면 (3,7)과 나눌 수 있습니다."
      }
    ]
  },
  {
    "id": "23-4",
    "unit": 23,
    "domain": "general",
    "title": "상품 × 할인율 가격표 만들기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "[:, None]",
        "열 벡터로 바꾸기 (4,) → (4,1)"
      ],
      [
        "브로드캐스팅",
        "(4,1) × (3,) → (4,3)"
      ],
      [
        "round",
        "원 단위 반올림"
      ]
    ],
    "origin": "NumPy",
    "desc": "<p>상품 4개의 가격 <code>prices</code>와 할인율 3가지 <code>rates</code>로, 상품(행) × 할인율(열) 할인가 표를 만듭니다.</p>\n<ol><li><code>col</code>: prices를 (4, 1) 모양으로 바꾼 배열</li><li><code>table</code>: 할인가 표 (4, 3)</li><li><code>shape</code>: 표의 형상</li><li><code>max_saving</code>: 가장 크게 깎이는 금액</li></ol>",
    "starter": "import numpy as np\nprices = np.array([12000, 39000, 8500, 54000])\nrates = np.array([0.1, 0.2, 0.3])\n\n# 1. prices를 (4, 1) 모양으로 바꾼 배열\ncol = \n# 2. 할인가 표 (4, 3)\ntable = \n# 3. 표의 형상\nshape = \n# 4. 가장 크게 깎이는 금액\nmax_saving = \n\nprint(table.round(), shape, max_saving, sep='\\n')\n",
    "solution": "import numpy as np\nprices = np.array([12000, 39000, 8500, 54000])\nrates = np.array([0.1, 0.2, 0.3])\n\n# 1. prices를 (4, 1) 모양으로 바꾼 배열\ncol = prices[:, None]\n# 2. 할인가 표 (4, 3)\ntable = col * (1 - rates)\n# 3. 표의 형상\nshape = table.shape\n# 4. 가장 크게 깎이는 금액\nmax_saving = float((col * rates).max())\n\nprint(table.round(), shape, max_saving, sep='\\n')\n",
    "hints": [
      "prices[:, None] 또는 prices.reshape(-1, 1)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 prices를 (4, 1) 모양으로 바꾼 배열",
        "expr": "np.allclose(col, [[12000.0], [39000.0], [8500.0], [54000.0]], atol=1e-4)",
        "hint": "prices[:, None] 또는 prices.reshape(-1, 1)"
      },
      {
        "label": "2단계 할인가 표 (4, 3)",
        "expr": "np.allclose(table, [[10800.0, 9600.0, 8400.0], [35100.0, 31200.0, 27300.0], [7650.0, 6800.0, 5950.0], [48600.0, 43200.0, 37800.0]], atol=1e-4)",
        "hint": "(4,1) × (3,) 은 (4,3)으로 늘어납니다."
      },
      {
        "label": "3단계 표의 형상",
        "expr": "shape == (4, 3)",
        "hint": "table.shape"
      },
      {
        "label": "4단계 가장 크게 깎이는 금액",
        "expr": "abs(max_saving - 16200.0) < 0.0162",
        "hint": "할인 금액 = 가격 × 할인율"
      }
    ]
  },
  {
    "id": "24-1",
    "unit": 24,
    "domain": "mfg",
    "title": "생산 CSV 불러와 훑어보기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.read_csv",
        "CSV → DataFrame"
      ],
      [
        "len / shape",
        "행 수"
      ],
      [
        "columns.tolist()",
        "열 이름 목록"
      ],
      [
        "df['열'].mean()",
        "열 평균"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>MES에서 내려받은 <code>production.csv</code>를 불러와 구조를 확인합니다. 아래 <b>제공 파일</b>을 보세요.</p>\n<ol><li><code>df</code>: production.csv 를 읽은 DataFrame</li><li><code>n_rows</code>: 행 수</li><li><code>cols</code>: 열 이름 리스트</li><li><code>qty_mean</code>: 생산량 평균</li><li><code>max_defect</code>: 가장 큰 불량 수</li></ol>",
    "starter": "import pandas as pd\n\n# 1. production.csv 를 읽은 DataFrame\ndf = \n# 2. 행 수\nn_rows = \n# 3. 열 이름 리스트\ncols = \n# 4. 생산량 평균\nqty_mean = \n# 5. 가장 큰 불량 수\nmax_defect = \n\nprint(df.head(3))\nprint(n_rows, cols, qty_mean, max_defect)\n",
    "solution": "import pandas as pd\n\n# 1. production.csv 를 읽은 DataFrame\ndf = pd.read_csv('production.csv')\n# 2. 행 수\nn_rows = len(df)\n# 3. 열 이름 리스트\ncols = df.columns.tolist()\n# 4. 생산량 평균\nqty_mean = float(df['qty'].mean())\n# 5. 가장 큰 불량 수\nmax_defect = int(df['defect'].max())\n\nprint(df.head(3))\nprint(n_rows, cols, qty_mean, max_defect)\n",
    "hints": [
      "pd.read_csv('production.csv')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 production.csv 를 읽은 DataFrame",
        "expr": "df.shape == (6, 4) and [str(c) for c in df.columns.tolist()] == ['date', 'line', 'qty', 'defect'] and abs(float(df.select_dtypes('number').sum().sum()) - 3017.0) < 1e-3",
        "hint": "pd.read_csv('production.csv')"
      },
      {
        "label": "2단계 행 수",
        "expr": "n_rows == 6",
        "hint": "len(df) 또는 df.shape[0]"
      },
      {
        "label": "3단계 열 이름 리스트",
        "expr": "cols == ['date', 'line', 'qty', 'defect']",
        "hint": "df.columns.tolist()"
      },
      {
        "label": "4단계 생산량 평균",
        "expr": "abs(qty_mean - 495.0) < 0.000495",
        "hint": "df['qty'].mean()"
      },
      {
        "label": "5단계 가장 큰 불량 수",
        "expr": "max_defect == 12",
        "hint": "df['defect'].max()"
      }
    ],
    "files": {
      "production.csv": "date,line,qty,defect\n11-01,A,520,6\n11-01,B,480,9\n11-02,A,505,3\n11-02,B,470,12\n11-03,A,540,7\n11-03,B,455,10\n"
    }
  },
  {
    "id": "24-2",
    "unit": 24,
    "domain": "mfg",
    "title": "로트별 측정값 Series",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.Series(값, index=)",
        "이름표가 붙은 1차원 데이터"
      ],
      [
        "s['라벨']",
        "라벨로 꺼내기"
      ],
      [
        "idxmax()",
        "최댓값의 라벨"
      ],
      [
        "describe()",
        "요약 통계"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>로트 번호를 인덱스로 한 저항 측정값 Series를 만들고 요약합니다.</p>\n<ol><li><code>s</code>: values에 lots를 인덱스로 붙인 Series</li><li><code>l03</code>: L03 로트의 값</li><li><code>max_lot</code>: 값이 가장 큰 로트</li><li><code>q75</code>: 제3사분위수 (describe의 75%)</li></ol>",
    "starter": "import pandas as pd\nvalues = [4.98, 5.03, 5.10, 4.95, 5.01]\nlots = ['L01', 'L02', 'L03', 'L04', 'L05']\n\n# 1. values에 lots를 인덱스로 붙인 Series\ns = \n# 2. L03 로트의 값\nl03 = \n# 3. 값이 가장 큰 로트\nmax_lot = \n# 4. 제3사분위수 (describe의 75%)\nq75 = \n\nprint(s, l03, max_lot, q75, sep='\\n')\n",
    "solution": "import pandas as pd\nvalues = [4.98, 5.03, 5.10, 4.95, 5.01]\nlots = ['L01', 'L02', 'L03', 'L04', 'L05']\n\n# 1. values에 lots를 인덱스로 붙인 Series\ns = pd.Series(values, index=lots)\n# 2. L03 로트의 값\nl03 = float(s['L03'])\n# 3. 값이 가장 큰 로트\nmax_lot = s.idxmax()\n# 4. 제3사분위수 (describe의 75%)\nq75 = float(s.describe()['75%'])\n\nprint(s, l03, max_lot, q75, sep='\\n')\n",
    "hints": [
      "pd.Series(values, index=lots)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 values에 lots를 인덱스로 붙인 Series",
        "expr": "s.index.tolist() == ['L01', 'L02', 'L03', 'L04', 'L05'] and np.allclose(s.values.astype(float), [4.98, 5.03, 5.1, 4.95, 5.01], atol=1e-4, equal_nan=True)",
        "hint": "pd.Series(values, index=lots)"
      },
      {
        "label": "2단계 L03 로트의 값",
        "expr": "abs(l03 - 5.1) < 5.1e-06",
        "hint": "s['L03']"
      },
      {
        "label": "3단계 값이 가장 큰 로트",
        "expr": "max_lot == 'L03'",
        "hint": "idxmax()는 값이 아니라 라벨을 돌려줍니다."
      },
      {
        "label": "4단계 제3사분위수 (describe의 75%)",
        "expr": "abs(q75 - 5.03) < 5.03e-06",
        "hint": "s.describe()['75%']"
      }
    ]
  },
  {
    "id": "24-3",
    "unit": 24,
    "domain": "general",
    "title": "주문 DataFrame 기본 정보",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "len(df)",
        "주문 건수"
      ],
      [
        "df['a'] * df['b']",
        "열끼리 계산"
      ],
      [
        "assign",
        "새 열을 붙인 DataFrame"
      ],
      [
        "value_counts()",
        "값별 개수"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p>\n<ol><li><code>n_orders</code>: 주문 건수</li><li><code>revenue</code>: 총매출 (단가 × 수량의 합)</li><li><code>df2</code>: amount 열(단가 × 수량)을 붙인 DataFrame</li><li><code>by_region</code>: 지역별 주문 건수 (value_counts)</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. 주문 건수\nn_orders = \n# 2. 총매출 (단가 × 수량의 합)\nrevenue = \n# 3. amount 열(단가 × 수량)을 붙인 DataFrame\ndf2 = \n# 4. 지역별 주문 건수 (value_counts)\nby_region = \n\nprint(n_orders, revenue)\nprint(df2.head())\nprint(by_region)\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. 주문 건수\nn_orders = len(df)\n# 2. 총매출 (단가 × 수량의 합)\nrevenue = int((df['price'] * df['qty']).sum())\n# 3. amount 열(단가 × 수량)을 붙인 DataFrame\ndf2 = df.assign(amount=df['price'] * df['qty'])\n# 4. 지역별 주문 건수 (value_counts)\nby_region = df['region'].value_counts()\n\nprint(n_orders, revenue)\nprint(df2.head())\nprint(by_region)\n",
    "hints": [
      "len(df)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 주문 건수",
        "expr": "n_orders == 10",
        "hint": "len(df)"
      },
      {
        "label": "2단계 총매출 (단가 × 수량의 합)",
        "expr": "revenue == 749000",
        "hint": "(df['price'] * df['qty']).sum()"
      },
      {
        "label": "3단계 amount 열(단가 × 수량)을 붙인 DataFrame",
        "expr": "df2.shape == (10, 7) and [str(c) for c in df2.columns.tolist()] == ['order_id', 'region', 'category', 'price', 'qty', 'customer', 'amount'] and abs(float(df2.select_dtypes('number').sum().sum()) - 1321576.0) < 1e-3",
        "hint": "df.assign(amount=...) 은 원본을 바꾸지 않고 새 DataFrame을 돌려줍니다."
      },
      {
        "label": "4단계 지역별 주문 건수 (value_counts)",
        "expr": "by_region.to_dict() == {'서울': 4, '부산': 3, '대구': 3}",
        "hint": "df['region'].value_counts()"
      }
    ]
  },
  {
    "id": "24-4",
    "unit": 24,
    "domain": "general",
    "title": "회원 CSV 불러와 요약",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.read_csv",
        "CSV 읽기"
      ],
      [
        "nunique()",
        "서로 다른 값 개수"
      ],
      [
        "mean()",
        "평균"
      ],
      [
        "iloc[0]",
        "첫 번째 값"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>members.csv</code>는 회원 명단입니다. 아래 <b>제공 파일</b>을 보세요.</p>\n<ol><li><code>df</code>: members.csv 를 읽은 DataFrame</li><li><code>n_regions</code>: 서로 다른 지역 수</li><li><code>age_mean</code>: 평균 나이</li><li><code>first_name</code>: 첫 번째 회원 이름</li></ol>",
    "starter": "import pandas as pd\n\n# 1. members.csv 를 읽은 DataFrame\ndf = \n# 2. 서로 다른 지역 수\nn_regions = \n# 3. 평균 나이\nage_mean = \n# 4. 첫 번째 회원 이름\nfirst_name = \n\nprint(df)\nprint(n_regions, age_mean, first_name)\n",
    "solution": "import pandas as pd\n\n# 1. members.csv 를 읽은 DataFrame\ndf = pd.read_csv('members.csv')\n# 2. 서로 다른 지역 수\nn_regions = int(df['region'].nunique())\n# 3. 평균 나이\nage_mean = float(df['age'].mean())\n# 4. 첫 번째 회원 이름\nfirst_name = df['name'].iloc[0]\n\nprint(df)\nprint(n_regions, age_mean, first_name)\n",
    "hints": [
      "pd.read_csv('members.csv')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 members.csv 를 읽은 DataFrame",
        "expr": "df.shape == (5, 3) and [str(c) for c in df.columns.tolist()] == ['name', 'age', 'region'] and abs(float(df.select_dtypes('number').sum().sum()) - 165.0) < 1e-3",
        "hint": "pd.read_csv('members.csv')"
      },
      {
        "label": "2단계 서로 다른 지역 수",
        "expr": "n_regions == 3",
        "hint": "df['region'].nunique()"
      },
      {
        "label": "3단계 평균 나이",
        "expr": "abs(age_mean - 33.0) < 3.3e-05",
        "hint": "df['age'].mean()"
      },
      {
        "label": "4단계 첫 번째 회원 이름",
        "expr": "first_name == '서연'",
        "hint": "df['name'].iloc[0]"
      }
    ],
    "files": {
      "members.csv": "name,age,region\n서연,28,서울\n도윤,34,부산\n하준,41,서울\n지우,25,대구\n민서,37,부산\n"
    }
  },
  {
    "id": "25-1",
    "unit": 25,
    "domain": "mfg",
    "title": "조건으로 생산 기록 골라내기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "df[조건]",
        "불리언 필터"
      ],
      [
        "df.loc[조건, 열들]",
        "행과 열을 함께 선택"
      ],
      [
        "&",
        "두 조건 모두 (괄호 필수)"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p>\n<ol><li><code>line_b</code>: B라인 기록만</li><li><code>hot</code>: 온도가 205를 넘은 기록의 date, line, temp 열</li><li><code>bad</code>: 불량 5개 이상이면서 생산량 500 미만인 행 수</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. B라인 기록만\nline_b = \n# 2. 온도가 205를 넘은 기록의 date, line, temp 열\nhot = \n# 3. 불량 5개 이상이면서 생산량 500 미만인 행 수\nbad = \n\nprint(line_b, hot, bad, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. B라인 기록만\nline_b = df[df['line'] == 'B']\n# 2. 온도가 205를 넘은 기록의 date, line, temp 열\nhot = df.loc[df['temp'] > 205, ['date', 'line', 'temp']]\n# 3. 불량 5개 이상이면서 생산량 500 미만인 행 수\nbad = len(df[(df['defect'] >= 5) & (df['qty'] < 500)])\n\nprint(line_b, hot, bad, sep='\\n')\n",
    "hints": [
      "df[df['line'] == 'B']",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 B라인 기록만",
        "expr": "line_b.shape == (3, 5) and [str(c) for c in line_b.columns.tolist()] == ['date', 'line', 'qty', 'defect', 'temp'] and abs(float(line_b.select_dtypes('number').sum().sum()) - 2060.7) < 1e-3",
        "hint": "df[df['line'] == 'B']"
      },
      {
        "label": "2단계 온도가 205를 넘은 기록의 date, line, temp 열",
        "expr": "hot.shape == (3, 3) and [str(c) for c in hot.columns.tolist()] == ['date', 'line', 'temp'] and abs(float(hot.select_dtypes('number').sum().sum()) - 624.7) < 1e-3",
        "hint": "df.loc[행 조건, [열 목록]]"
      },
      {
        "label": "3단계 불량 5개 이상이면서 생산량 500 미만인 행 수",
        "expr": "bad == 3",
        "hint": "조건마다 괄호로 감싸고 & 로 잇습니다."
      }
    ]
  },
  {
    "id": "25-2",
    "unit": 25,
    "domain": "mfg",
    "title": "iloc와 query로 꺼내기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "iloc",
        "위치(번호)로 선택"
      ],
      [
        "loc",
        "라벨로 선택"
      ],
      [
        "query",
        "문자열 조건으로 필터"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p>\n<ol><li><code>first3</code>: 처음 3행</li><li><code>last_qty</code>: 마지막 행의 생산량</li><li><code>day2</code>: 11-02 일자의 line, qty 열 (query 사용)</li><li><code>c_temps</code>: C라인 온도 리스트</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. 처음 3행\nfirst3 = \n# 2. 마지막 행의 생산량\nlast_qty = \n# 3. 11-02 일자의 line, qty 열 (query 사용)\nday2 = \n# 4. C라인 온도 리스트\nc_temps = \n\nprint(first3, last_qty, day2, c_temps, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. 처음 3행\nfirst3 = df.iloc[:3]\n# 2. 마지막 행의 생산량\nlast_qty = int(df['qty'].iloc[-1])\n# 3. 11-02 일자의 line, qty 열 (query 사용)\nday2 = df.query(\"date == '11-02'\")[['line', 'qty']]\n# 4. C라인 온도 리스트\nc_temps = df.loc[df['line'] == 'C', 'temp'].tolist()\n\nprint(first3, last_qty, day2, c_temps, sep='\\n')\n",
    "hints": [
      "df.iloc[:3]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 처음 3행",
        "expr": "first3.shape == (3, 5) and [str(c) for c in first3.columns.tolist()] == ['date', 'line', 'qty', 'defect', 'temp'] and abs(float(first3.select_dtypes('number').sum().sum()) - 2236.6) < 1e-3",
        "hint": "df.iloc[:3]"
      },
      {
        "label": "2단계 마지막 행의 생산량",
        "expr": "last_qty == 600",
        "hint": "df['qty'].iloc[-1]"
      },
      {
        "label": "3단계 11-02 일자의 line, qty 열 (query 사용)",
        "expr": "day2.shape == (3, 2) and [str(c) for c in day2.columns.tolist()] == ['line', 'qty'] and abs(float(day2.select_dtypes('number').sum().sum()) - 1605.0) < 1e-3",
        "hint": "df.query(\"date == '11-02'\")"
      },
      {
        "label": "4단계 C라인 온도 리스트",
        "expr": "c_temps == [198.9, 199.5, 197.6]",
        "hint": "df.loc[조건, 'temp'].tolist()"
      }
    ]
  },
  {
    "id": "25-3",
    "unit": 25,
    "domain": "general",
    "title": "지역 · 금액 조건으로 주문 찾기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "df[조건]",
        "불리언 필터"
      ],
      [
        "isin",
        "여러 값 중 하나"
      ],
      [
        "&",
        "두 조건 모두"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p>\n<ol><li><code>seoul</code>: 서울 주문만</li><li><code>big</code>: 주문 금액(단가 × 수량)이 5만 원 이상인 주문의 order_id 리스트</li><li><code>se_bu_food</code>: 서울·부산의 식품 주문 수</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. 서울 주문만\nseoul = \n# 2. 주문 금액(단가 × 수량)이 5만 원 이상인 주문의 order_id 리스트\nbig = \n# 3. 서울·부산의 식품 주문 수\nse_bu_food = \n\nprint(seoul, big, se_bu_food, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. 서울 주문만\nseoul = df[df['region'] == '서울']\n# 2. 주문 금액(단가 × 수량)이 5만 원 이상인 주문의 order_id 리스트\nbig = df.loc[df['price'] * df['qty'] >= 50000, 'order_id'].tolist()\n# 3. 서울·부산의 식품 주문 수\nse_bu_food = len(df[df['region'].isin(['서울', '부산']) & (df['category'] == '식품')])\n\nprint(seoul, big, se_bu_food, sep='\\n')\n",
    "hints": [
      "df[df['region'] == '서울']",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 서울 주문만",
        "expr": "seoul.shape == (4, 6) and [str(c) for c in seoul.columns.tolist()] == ['order_id', 'region', 'category', 'price', 'qty', 'customer'] and abs(float(seoul.select_dtypes('number').sum().sum()) - 350423.0) < 1e-3",
        "hint": "df[df['region'] == '서울']"
      },
      {
        "label": "2단계 주문 금액(단가 × 수량)이 5만 원 이상인 주문의 order_id 리스트",
        "expr": "big == [103, 105, 107, 108, 109, 110]",
        "hint": "df.loc[조건, 'order_id'].tolist()"
      },
      {
        "label": "3단계 서울·부산의 식품 주문 수",
        "expr": "se_bu_food == 3",
        "hint": "isin(['서울', '부산']) 과 category 조건을 & 로"
      }
    ]
  },
  {
    "id": "25-4",
    "unit": 25,
    "domain": "general",
    "title": "query와 loc로 고객 찾기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "query",
        "\"price < 20000\" 처럼 조건 문자열"
      ],
      [
        "loc[행, 열]",
        "라벨로 한 칸"
      ],
      [
        "unique()",
        "중복 없는 값"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p>\n<ol><li><code>cheap</code>: 단가 2만 원 미만 주문의 customer 리스트 (query 사용)</li><li><code>third_cat</code>: 인덱스 2인 행의 category (loc)</li><li><code>elec_customers</code>: 전자 제품을 산 고객 (중복 없이, 정렬)</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. 단가 2만 원 미만 주문의 customer 리스트 (query 사용)\ncheap = \n# 2. 인덱스 2인 행의 category (loc)\nthird_cat = \n# 3. 전자 제품을 산 고객 (중복 없이, 정렬)\nelec_customers = \n\nprint(cheap, third_cat, elec_customers, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. 단가 2만 원 미만 주문의 customer 리스트 (query 사용)\ncheap = df.query('price < 20000')['customer'].tolist()\n# 2. 인덱스 2인 행의 category (loc)\nthird_cat = df.loc[2, 'category']\n# 3. 전자 제품을 산 고객 (중복 없이, 정렬)\nelec_customers = sorted(df.loc[df['category'] == '전자', 'customer'].unique().tolist())\n\nprint(cheap, third_cat, elec_customers, sep='\\n')\n",
    "hints": [
      "df.query('price < 20000')['customer']",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 단가 2만 원 미만 주문의 customer 리스트 (query 사용)",
        "expr": "cheap == ['c02', 'c01', 'c07']",
        "hint": "df.query('price < 20000')['customer']"
      },
      {
        "label": "2단계 인덱스 2인 행의 category (loc)",
        "expr": "third_cat == '전자'",
        "hint": "df.loc[2, 'category']"
      },
      {
        "label": "3단계 전자 제품을 산 고객 (중복 없이, 정렬)",
        "expr": "elec_customers == ['c02', 'c03', 'c06']",
        "hint": "unique() 후 sorted()"
      }
    ]
  },
  {
    "id": "26-1",
    "unit": 26,
    "domain": "mfg",
    "title": "센서 결측값 처리",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "isna().sum()",
        "열별 결측 개수"
      ],
      [
        "fillna",
        "결측 채우기"
      ],
      [
        "dropna",
        "결측 행 삭제"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>센서 데이터 <code>df</code>에 통신 오류로 빈 값(NaN)이 있습니다.</p>\n<ol><li><code>na_count</code>: 열별 결측 개수</li><li><code>temp_filled</code>: temp 결측을 temp 평균으로 채운 Series</li><li><code>complete</code>: 결측이 하나도 없는 행만 남긴 DataFrame</li><li><code>temp_ffill</code>: temp 결측을 바로 앞 값으로 채운 Series</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\ndf = pd.DataFrame({\n    'time': ['09:00', '09:10', '09:20', '09:30', '09:40', '09:50'],\n    'temp': [201.2, np.nan, 203.5, 202.8, np.nan, 204.1],\n    'pressure': [1.02, 1.01, np.nan, 1.03, 1.02, 1.04],\n})\n\n# 1. 열별 결측 개수\nna_count = \n# 2. temp 결측을 temp 평균으로 채운 Series\ntemp_filled = \n# 3. 결측이 하나도 없는 행만 남긴 DataFrame\ncomplete = \n# 4. temp 결측을 바로 앞 값으로 채운 Series\ntemp_ffill = \n\nprint(na_count, temp_filled, complete, temp_ffill, sep='\\n')\n",
    "solution": "import numpy as np\nimport pandas as pd\ndf = pd.DataFrame({\n    'time': ['09:00', '09:10', '09:20', '09:30', '09:40', '09:50'],\n    'temp': [201.2, np.nan, 203.5, 202.8, np.nan, 204.1],\n    'pressure': [1.02, 1.01, np.nan, 1.03, 1.02, 1.04],\n})\n\n# 1. 열별 결측 개수\nna_count = df.isna().sum()\n# 2. temp 결측을 temp 평균으로 채운 Series\ntemp_filled = df['temp'].fillna(df['temp'].mean())\n# 3. 결측이 하나도 없는 행만 남긴 DataFrame\ncomplete = df.dropna()\n# 4. temp 결측을 바로 앞 값으로 채운 Series\ntemp_ffill = df['temp'].ffill()\n\nprint(na_count, temp_filled, complete, temp_ffill, sep='\\n')\n",
    "hints": [
      "df.isna().sum()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 열별 결측 개수",
        "expr": "na_count.index.tolist() == ['time', 'temp', 'pressure'] and np.allclose(na_count.values.astype(float), [0.0, 2.0, 1.0], atol=1e-4, equal_nan=True)",
        "hint": "df.isna().sum()"
      },
      {
        "label": "2단계 temp 결측을 temp 평균으로 채운 Series",
        "expr": "temp_filled.index.tolist() == [0, 1, 2, 3, 4, 5] and np.allclose(temp_filled.values.astype(float), [201.2, 202.9, 203.5, 202.8, 202.9, 204.1], atol=1e-4, equal_nan=True)",
        "hint": "fillna(df['temp'].mean())"
      },
      {
        "label": "3단계 결측이 하나도 없는 행만 남긴 DataFrame",
        "expr": "complete.shape == (3, 3) and [str(c) for c in complete.columns.tolist()] == ['time', 'temp', 'pressure'] and abs(float(complete.select_dtypes('number').sum().sum()) - 611.19) < 1e-3",
        "hint": "df.dropna()"
      },
      {
        "label": "4단계 temp 결측을 바로 앞 값으로 채운 Series",
        "expr": "temp_ffill.index.tolist() == [0, 1, 2, 3, 4, 5] and np.allclose(temp_ffill.values.astype(float), [201.2, 201.2, 203.5, 202.8, 202.8, 204.1], atol=1e-4, equal_nan=True)",
        "hint": "df['temp'].ffill()"
      }
    ]
  },
  {
    "id": "26-2",
    "unit": 26,
    "domain": "mfg",
    "title": "문자로 들어온 수치 정리",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "str.replace",
        "글자 지우기"
      ],
      [
        "astype(int)",
        "형변환"
      ],
      [
        "apply(lambda)",
        "값마다 함수 적용"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>엑셀에서 옮긴 실적표라 숫자에 쉼표와 단위가 붙어 문자열로 들어왔습니다.</p>\n<ol><li><code>qty</code>: qty를 정수 Series로</li><li><code>rate</code>: rate를 실수 Series로 (% 제거)</li><li><code>grade</code>: rate가 2.0 넘으면 &#x27;NG&#x27;, 아니면 &#x27;OK&#x27;인 Series</li><li><code>qty_total</code>: 총생산량</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'line': ['A', 'B', 'C', 'D'],\n    'qty': ['1,250', '980', '1,105', '875'],\n    'rate': ['1.8%', '2.6%', '0.9%', '3.1%'],\n})\n\n# 1. qty를 정수 Series로\nqty = \n# 2. rate를 실수 Series로 (% 제거)\nrate = \n# 3. rate가 2.0 넘으면 'NG', 아니면 'OK'인 Series\ngrade = \n# 4. 총생산량\nqty_total = \n\nprint(qty, rate, grade, qty_total, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'line': ['A', 'B', 'C', 'D'],\n    'qty': ['1,250', '980', '1,105', '875'],\n    'rate': ['1.8%', '2.6%', '0.9%', '3.1%'],\n})\n\n# 1. qty를 정수 Series로\nqty = df['qty'].str.replace(',', '').astype(int)\n# 2. rate를 실수 Series로 (% 제거)\nrate = df['rate'].str.rstrip('%').astype(float)\n# 3. rate가 2.0 넘으면 'NG', 아니면 'OK'인 Series\ngrade = rate.apply(lambda r: 'NG' if r > 2.0 else 'OK')\n# 4. 총생산량\nqty_total = int(qty.sum())\n\nprint(qty, rate, grade, qty_total, sep='\\n')\n",
    "hints": [
      "쉼표를 지운 뒤 astype(int)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 qty를 정수 Series로",
        "expr": "qty.index.tolist() == [0, 1, 2, 3] and np.allclose(qty.values.astype(float), [1250.0, 980.0, 1105.0, 875.0], atol=1e-4, equal_nan=True)",
        "hint": "쉼표를 지운 뒤 astype(int)"
      },
      {
        "label": "2단계 rate를 실수 Series로 (% 제거)",
        "expr": "rate.index.tolist() == [0, 1, 2, 3] and np.allclose(rate.values.astype(float), [1.8, 2.6, 0.9, 3.1], atol=1e-4, equal_nan=True)",
        "hint": "str.rstrip('%') 또는 str.replace('%', '')"
      },
      {
        "label": "3단계 rate가 2.0 넘으면 'NG', 아니면 'OK'인 Series",
        "expr": "grade.tolist() == ['OK', 'NG', 'OK', 'NG']",
        "hint": "apply(lambda r: ... if ... else ...)"
      },
      {
        "label": "4단계 총생산량",
        "expr": "qty_total == 4210",
        "hint": "qty.sum()"
      }
    ]
  },
  {
    "id": "26-3",
    "unit": 26,
    "domain": "general",
    "title": "설문 결측 응답 채우기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "isna().sum()",
        "결측 개수"
      ],
      [
        "median()",
        "중앙값"
      ],
      [
        "fillna",
        "결측 채우기"
      ],
      [
        "fillna('미응답')",
        "문자 열 채우기"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>설문 응답 <code>df</code>에 빈칸이 있습니다.</p>\n<ol><li><code>missing</code>: 전체 결측 칸 수</li><li><code>age_filled</code>: age 결측을 중앙값으로 채운 Series</li><li><code>job_filled</code>: job 결측을 &#x27;미응답&#x27;으로 채운 Series</li><li><code>n_complete</code>: 모든 칸이 채워진 응답 수</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\ndf = pd.DataFrame({\n    'id': [1, 2, 3, 4, 5, 6],\n    'age': [29, np.nan, 41, 35, np.nan, 52],\n    'job': ['개발', '마케팅', None, '개발', '디자인', None],\n    'score': [4, 5, 3, np.nan, 4, 5],\n})\n\n# 1. 전체 결측 칸 수\nmissing = \n# 2. age 결측을 중앙값으로 채운 Series\nage_filled = \n# 3. job 결측을 '미응답'으로 채운 Series\njob_filled = \n# 4. 모든 칸이 채워진 응답 수\nn_complete = \n\nprint(missing, age_filled, job_filled, n_complete, sep='\\n')\n",
    "solution": "import numpy as np\nimport pandas as pd\ndf = pd.DataFrame({\n    'id': [1, 2, 3, 4, 5, 6],\n    'age': [29, np.nan, 41, 35, np.nan, 52],\n    'job': ['개발', '마케팅', None, '개발', '디자인', None],\n    'score': [4, 5, 3, np.nan, 4, 5],\n})\n\n# 1. 전체 결측 칸 수\nmissing = int(df.isna().sum().sum())\n# 2. age 결측을 중앙값으로 채운 Series\nage_filled = df['age'].fillna(df['age'].median())\n# 3. job 결측을 '미응답'으로 채운 Series\njob_filled = df['job'].fillna('미응답')\n# 4. 모든 칸이 채워진 응답 수\nn_complete = len(df.dropna())\n\nprint(missing, age_filled, job_filled, n_complete, sep='\\n')\n",
    "hints": [
      "isna().sum()은 열별 개수, 한 번 더 sum()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 전체 결측 칸 수",
        "expr": "missing == 5",
        "hint": "isna().sum()은 열별 개수, 한 번 더 sum()"
      },
      {
        "label": "2단계 age 결측을 중앙값으로 채운 Series",
        "expr": "age_filled.index.tolist() == [0, 1, 2, 3, 4, 5] and np.allclose(age_filled.values.astype(float), [29.0, 38.0, 41.0, 35.0, 38.0, 52.0], atol=1e-4, equal_nan=True)",
        "hint": "중앙값은 이상치에 덜 흔들립니다."
      },
      {
        "label": "3단계 job 결측을 '미응답'으로 채운 Series",
        "expr": "job_filled.tolist() == ['개발', '마케팅', '미응답', '개발', '디자인', '미응답']",
        "hint": "fillna('미응답')"
      },
      {
        "label": "4단계 모든 칸이 채워진 응답 수",
        "expr": "n_complete == 1",
        "hint": "len(df.dropna())"
      }
    ]
  },
  {
    "id": "26-4",
    "unit": 26,
    "domain": "general",
    "title": "가격 문자열과 이메일 정리",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "str.replace",
        "₩ · 쉼표 지우기"
      ],
      [
        "astype(int)",
        "정수로"
      ],
      [
        "str.lower / str.strip",
        "문자열 정리"
      ],
      [
        "str.split().str[0]",
        "앞부분 꺼내기"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>크롤링한 상품 데이터라 가격과 판매자 이메일 형식이 제각각입니다.</p>\n<ol><li><code>price</code>: price를 정수 Series로</li><li><code>seller</code>: 공백을 지우고 소문자로 바꾼 seller</li><li><code>seller_id</code>: seller에서 @ 앞부분</li><li><code>expensive</code>: 1만 원 이상 상품 수</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'item': ['셔츠', '머그컵', '이어폰', '노트'],\n    'price': ['₩39,000', '₩8,500', '₩129,000', '₩3,200'],\n    'seller': [' Shop@Mall.com', 'cup@MALL.com ', 'audio@mall.COM', ' Note@Mall.com '],\n})\n\n# 1. price를 정수 Series로\nprice = \n# 2. 공백을 지우고 소문자로 바꾼 seller\nseller = \n# 3. seller에서 @ 앞부분\nseller_id = \n# 4. 1만 원 이상 상품 수\nexpensive = \n\nprint(price, seller, seller_id, expensive, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'item': ['셔츠', '머그컵', '이어폰', '노트'],\n    'price': ['₩39,000', '₩8,500', '₩129,000', '₩3,200'],\n    'seller': [' Shop@Mall.com', 'cup@MALL.com ', 'audio@mall.COM', ' Note@Mall.com '],\n})\n\n# 1. price를 정수 Series로\nprice = df['price'].str.replace('₩', '').str.replace(',', '').astype(int)\n# 2. 공백을 지우고 소문자로 바꾼 seller\nseller = df['seller'].str.strip().str.lower()\n# 3. seller에서 @ 앞부분\nseller_id = seller.str.split('@').str[0]\n# 4. 1만 원 이상 상품 수\nexpensive = int((price >= 10000).sum())\n\nprint(price, seller, seller_id, expensive, sep='\\n')\n",
    "hints": [
      "₩와 쉼표를 지운 뒤 astype(int)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 price를 정수 Series로",
        "expr": "price.index.tolist() == [0, 1, 2, 3] and np.allclose(price.values.astype(float), [39000.0, 8500.0, 129000.0, 3200.0], atol=1e-4, equal_nan=True)",
        "hint": "₩와 쉼표를 지운 뒤 astype(int)"
      },
      {
        "label": "2단계 공백을 지우고 소문자로 바꾼 seller",
        "expr": "seller.tolist() == ['shop@mall.com', 'cup@mall.com', 'audio@mall.com', 'note@mall.com']",
        "hint": "str.strip().str.lower()"
      },
      {
        "label": "3단계 seller에서 @ 앞부분",
        "expr": "seller_id.tolist() == ['shop', 'cup', 'audio', 'note']",
        "hint": "str.split('@').str[0]"
      },
      {
        "label": "4단계 1만 원 이상 상품 수",
        "expr": "expensive == 2",
        "hint": "(조건).sum()"
      }
    ]
  },
  {
    "id": "27-1",
    "unit": 27,
    "domain": "mfg",
    "title": "라인별 실적 집계",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "groupby('line')['qty'].sum()",
        "그룹별 합계"
      ],
      [
        "agg",
        "여러 집계를 한 번에"
      ],
      [
        "Series끼리 나눗셈",
        "인덱스가 같은 것끼리"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p>\n<ol><li><code>qty_by_line</code>: 라인별 총생산량</li><li><code>defect_rate</code>: 라인별 불량률(%) = 불량 합 ÷ 생산 합 × 100</li><li><code>summary</code>: 라인별 qty 합계(qty_sum)와 temp 최댓값(temp_max)</li><li><code>worst</code>: 불량률이 가장 높은 라인</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. 라인별 총생산량\nqty_by_line = \n# 2. 라인별 불량률(%) = 불량 합 ÷ 생산 합 × 100\ndefect_rate = \n# 3. 라인별 qty 합계(qty_sum)와 temp 최댓값(temp_max)\nsummary = \n# 4. 불량률이 가장 높은 라인\nworst = \n\nprint(qty_by_line, defect_rate.round(2), summary, worst, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. 라인별 총생산량\nqty_by_line = df.groupby('line')['qty'].sum()\n# 2. 라인별 불량률(%) = 불량 합 ÷ 생산 합 × 100\ndefect_rate = df.groupby('line')['defect'].sum() / qty_by_line * 100\n# 3. 라인별 qty 합계(qty_sum)와 temp 최댓값(temp_max)\nsummary = df.groupby('line').agg(qty_sum=('qty', 'sum'), temp_max=('temp', 'max'))\n# 4. 불량률이 가장 높은 라인\nworst = defect_rate.idxmax()\n\nprint(qty_by_line, defect_rate.round(2), summary, worst, sep='\\n')\n",
    "hints": [
      "df.groupby('line')['qty'].sum()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 라인별 총생산량",
        "expr": "qty_by_line.index.tolist() == ['A', 'B', 'C'] and np.allclose(qty_by_line.values.astype(float), [1565.0, 1405.0, 1840.0], atol=1e-4, equal_nan=True)",
        "hint": "df.groupby('line')['qty'].sum()"
      },
      {
        "label": "2단계 라인별 불량률(%) = 불량 합 ÷ 생산 합 × 100",
        "expr": "defect_rate.index.tolist() == ['A', 'B', 'C'] and np.allclose(defect_rate.values.astype(float), [1.022364, 2.206406, 0.597826], atol=1e-4, equal_nan=True)",
        "hint": "인덱스(line)가 같은 Series끼리는 같은 라인끼리 나눠집니다."
      },
      {
        "label": "3단계 라인별 qty 합계(qty_sum)와 temp 최댓값(temp_max)",
        "expr": "summary.shape == (3, 2) and [str(c) for c in summary.columns.tolist()] == ['qty_sum', 'temp_max'] and abs(float(summary.select_dtypes('number').sum().sum()) - 5422.0) < 1e-3",
        "hint": "agg(새이름=('열', '함수'))"
      },
      {
        "label": "4단계 불량률이 가장 높은 라인",
        "expr": "worst == 'B'",
        "hint": "idxmax()"
      }
    ]
  },
  {
    "id": "27-2",
    "unit": 27,
    "domain": "mfg",
    "title": "일자 × 라인 피벗 표",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "pivot_table",
        "index · columns · values · aggfunc"
      ],
      [
        "sum(axis=1)",
        "행(일자)별 합계"
      ],
      [
        "transform",
        "그룹 값을 원래 행에 붙이기"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p>\n<ol><li><code>pv</code>: 행=date, 열=line, 값=qty 합계인 피벗 표</li><li><code>day_total</code>: 일자별 총생산량</li><li><code>line_mean</code>: 각 행에 그 라인의 평균 생산량을 붙인 Series (transform)</li><li><code>above</code>: 자기 라인 평균보다 많이 만든 행 수</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. 행=date, 열=line, 값=qty 합계인 피벗 표\npv = \n# 2. 일자별 총생산량\nday_total = \n# 3. 각 행에 그 라인의 평균 생산량을 붙인 Series (transform)\nline_mean = \n# 4. 자기 라인 평균보다 많이 만든 행 수\nabove = \n\nprint(pv, day_total, line_mean, above, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\n\n# 1. 행=date, 열=line, 값=qty 합계인 피벗 표\npv = df.pivot_table(index='date', columns='line', values='qty', aggfunc='sum')\n# 2. 일자별 총생산량\nday_total = pv.sum(axis=1)\n# 3. 각 행에 그 라인의 평균 생산량을 붙인 Series (transform)\nline_mean = df.groupby('line')['qty'].transform('mean')\n# 4. 자기 라인 평균보다 많이 만든 행 수\nabove = int((df['qty'] > line_mean).sum())\n\nprint(pv, day_total, line_mean, above, sep='\\n')\n",
    "hints": [
      "pivot_table(index=, columns=, values=, aggfunc=)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 행=date, 열=line, 값=qty 합계인 피벗 표",
        "expr": "pv.shape == (3, 3) and [str(c) for c in pv.columns.tolist()] == ['A', 'B', 'C'] and abs(float(pv.select_dtypes('number').sum().sum()) - 4810.0) < 1e-3",
        "hint": "pivot_table(index=, columns=, values=, aggfunc=)"
      },
      {
        "label": "2단계 일자별 총생산량",
        "expr": "day_total.index.tolist() == ['11-01', '11-02', '11-03'] and np.allclose(day_total.values.astype(float), [1610.0, 1605.0, 1595.0], atol=1e-4, equal_nan=True)",
        "hint": "axis=1 은 행 안에서 라인들을 더합니다."
      },
      {
        "label": "3단계 각 행에 그 라인의 평균 생산량을 붙인 Series (transform)",
        "expr": "line_mean.index.tolist() == [0, 1, 2, 3, 4, 5, 6, 7, 8] and np.allclose(line_mean.values.astype(float), [521.666667, 468.333333, 613.333333, 521.666667, 468.333333, 613.333333, 521.666667, 468.333333, 613.333333], atol=1e-4, equal_nan=True)",
        "hint": "transform 은 원래 행 수 그대로 돌려줍니다."
      },
      {
        "label": "4단계 자기 라인 평균보다 많이 만든 행 수",
        "expr": "above == 4",
        "hint": "(df['qty'] > line_mean).sum()"
      }
    ]
  },
  {
    "id": "27-3",
    "unit": 27,
    "domain": "general",
    "title": "지역별 매출 집계",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "groupby",
        "그룹별 집계"
      ],
      [
        "sort_values(ascending=False)",
        "큰 순 정렬"
      ],
      [
        "agg",
        "건수 · 합계 함께"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p>\n<ol><li><code>df2</code>: amount(단가 × 수량) 열을 붙인 DataFrame</li><li><code>rev</code>: 지역별 매출 합계, 큰 순</li><li><code>stats</code>: 지역별 주문 수(orders)와 평균 금액(avg)</li><li><code>top_region</code>: 매출 1위 지역</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. amount(단가 × 수량) 열을 붙인 DataFrame\ndf2 = \n# 2. 지역별 매출 합계, 큰 순\nrev = \n# 3. 지역별 주문 수(orders)와 평균 금액(avg)\nstats = \n# 4. 매출 1위 지역\ntop_region = \n\nprint(rev, stats.round(0), top_region, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. amount(단가 × 수량) 열을 붙인 DataFrame\ndf2 = df.assign(amount=df['price'] * df['qty'])\n# 2. 지역별 매출 합계, 큰 순\nrev = df2.groupby('region')['amount'].sum().sort_values(ascending=False)\n# 3. 지역별 주문 수(orders)와 평균 금액(avg)\nstats = df2.groupby('region').agg(orders=('order_id', 'count'), avg=('amount', 'mean'))\n# 4. 매출 1위 지역\ntop_region = rev.index[0]\n\nprint(rev, stats.round(0), top_region, sep='\\n')\n",
    "hints": [
      "df.assign(amount=...)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 amount(단가 × 수량) 열을 붙인 DataFrame",
        "expr": "df2.shape == (10, 7) and [str(c) for c in df2.columns.tolist()] == ['order_id', 'region', 'category', 'price', 'qty', 'customer', 'amount'] and abs(float(df2.select_dtypes('number').sum().sum()) - 1321576.0) < 1e-3",
        "hint": "df.assign(amount=...)"
      },
      {
        "label": "2단계 지역별 매출 합계, 큰 순",
        "expr": "rev.index.tolist() == ['서울', '부산', '대구'] and np.allclose(rev.values.astype(float), [373000.0, 201000.0, 175000.0], atol=1e-4, equal_nan=True)",
        "hint": "groupby → sum → sort_values(ascending=False)"
      },
      {
        "label": "3단계 지역별 주문 수(orders)와 평균 금액(avg)",
        "expr": "stats.shape == (3, 2) and [str(c) for c in stats.columns.tolist()] == ['orders', 'avg'] and abs(float(stats.select_dtypes('number').sum().sum()) - 218593.333333) < 1e-3",
        "hint": "agg(orders=('order_id', 'count'), avg=('amount', 'mean'))"
      },
      {
        "label": "4단계 매출 1위 지역",
        "expr": "top_region == '서울'",
        "hint": "정렬했으니 rev.index[0]"
      }
    ]
  },
  {
    "id": "27-4",
    "unit": 27,
    "domain": "general",
    "title": "카테고리 × 지역 매출 피벗과 비중",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "pivot_table",
        "fill_value=0 으로 빈칸 채우기"
      ],
      [
        "transform('sum')",
        "그룹 합계를 각 행에"
      ],
      [
        "비중",
        "행 값 ÷ 그룹 합계"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p>\n<ol><li><code>df2</code>: amount 열을 붙인 DataFrame</li><li><code>pv</code>: 행=category, 열=region, 값=amount 합계 (빈칸 0)</li><li><code>cat_total</code>: 각 주문 행에 그 카테고리 매출 합계를 붙인 Series</li><li><code>share</code>: 각 주문이 자기 카테고리 매출에서 차지하는 비중</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. amount 열을 붙인 DataFrame\ndf2 = \n# 2. 행=category, 열=region, 값=amount 합계 (빈칸 0)\npv = \n# 3. 각 주문 행에 그 카테고리 매출 합계를 붙인 Series\ncat_total = \n# 4. 각 주문이 자기 카테고리 매출에서 차지하는 비중\nshare = \n\nprint(pv, share.round(3), sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\n\n# 1. amount 열을 붙인 DataFrame\ndf2 = df.assign(amount=df['price'] * df['qty'])\n# 2. 행=category, 열=region, 값=amount 합계 (빈칸 0)\npv = df2.pivot_table(index='category', columns='region', values='amount', aggfunc='sum', fill_value=0)\n# 3. 각 주문 행에 그 카테고리 매출 합계를 붙인 Series\ncat_total = df2.groupby('category')['amount'].transform('sum')\n# 4. 각 주문이 자기 카테고리 매출에서 차지하는 비중\nshare = df2['amount'] / cat_total\n\nprint(pv, share.round(3), sep='\\n')\n",
    "hints": [
      "df.assign(amount=...)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 amount 열을 붙인 DataFrame",
        "expr": "df2.shape == (10, 7) and [str(c) for c in df2.columns.tolist()] == ['order_id', 'region', 'category', 'price', 'qty', 'customer', 'amount'] and abs(float(df2.select_dtypes('number').sum().sum()) - 1321576.0) < 1e-3",
        "hint": "df.assign(amount=...)"
      },
      {
        "label": "2단계 행=category, 열=region, 값=amount 합계 (빈칸 0)",
        "expr": "pv.shape == (3, 3) and [str(c) for c in pv.columns.tolist()] == ['대구', '부산', '서울'] and abs(float(pv.select_dtypes('number').sum().sum()) - 749000.0) < 1e-3",
        "hint": "fill_value=0"
      },
      {
        "label": "3단계 각 주문 행에 그 카테고리 매출 합계를 붙인 Series",
        "expr": "cat_total.index.tolist() == [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] and np.allclose(cat_total.values.astype(float), [181000.0, 191000.0, 377000.0, 191000.0, 181000.0, 191000.0, 377000.0, 377000.0, 191000.0, 181000.0], atol=1e-4, equal_nan=True)",
        "hint": "transform('sum')"
      },
      {
        "label": "4단계 각 주문이 자기 카테고리 매출에서 차지하는 비중",
        "expr": "share.index.tolist() == [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] and np.allclose(share.values.astype(float), [0.21547, 0.188482, 0.421751, 0.17801, 0.497238, 0.240838, 0.236074, 0.342175, 0.39267, 0.287293], atol=1e-4, equal_nan=True)",
        "hint": "amount ÷ cat_total"
      }
    ]
  },
  {
    "id": "28-1",
    "unit": 28,
    "domain": "mfg",
    "title": "생산 기록에 라인 정보 붙이기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.merge(왼쪽, 오른쪽, on=키)",
        "키로 결합"
      ],
      [
        "how='left'",
        "왼쪽 행은 모두 남기기"
      ],
      [
        "isna",
        "짝이 없는 행 찾기"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p><p><code>lines</code>는 라인별 담당자 표입니다. C라인은 아직 담당자 표에 없습니다.</p>\n<ol><li><code>inner</code>: 두 표에 모두 있는 라인만 결합 (기본 how)</li><li><code>left</code>: df 행을 모두 남기는 결합</li><li><code>no_manager</code>: 담당자가 없는 행 수</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nlines = pd.DataFrame({'line': ['A', 'B'], 'manager': ['김현우', '이수진']})\n\n# 1. 두 표에 모두 있는 라인만 결합 (기본 how)\ninner = \n# 2. df 행을 모두 남기는 결합\nleft = \n# 3. 담당자가 없는 행 수\nno_manager = \n\nprint(len(inner), len(left), no_manager)\nprint(left.head())\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nlines = pd.DataFrame({'line': ['A', 'B'], 'manager': ['김현우', '이수진']})\n\n# 1. 두 표에 모두 있는 라인만 결합 (기본 how)\ninner = pd.merge(df, lines, on='line')\n# 2. df 행을 모두 남기는 결합\nleft = pd.merge(df, lines, on='line', how='left')\n# 3. 담당자가 없는 행 수\nno_manager = int(left['manager'].isna().sum())\n\nprint(len(inner), len(left), no_manager)\nprint(left.head())\n",
    "hints": [
      "pd.merge(df, lines, on='line')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 두 표에 모두 있는 라인만 결합 (기본 how)",
        "expr": "inner.shape == (6, 6) and [str(c) for c in inner.columns.tolist()] == ['date', 'line', 'qty', 'defect', 'temp', 'manager'] and abs(float(inner.select_dtypes('number').sum().sum()) - 4248.3) < 1e-3",
        "hint": "pd.merge(df, lines, on='line')"
      },
      {
        "label": "2단계 df 행을 모두 남기는 결합",
        "expr": "left.shape == (9, 6) and [str(c) for c in left.columns.tolist()] == ['date', 'line', 'qty', 'defect', 'temp', 'manager'] and abs(float(left.select_dtypes('number').sum().sum()) - 6695.3) < 1e-3",
        "hint": "how='left'"
      },
      {
        "label": "3단계 담당자가 없는 행 수",
        "expr": "no_manager == 3",
        "hint": "left['manager'].isna().sum()"
      }
    ]
  },
  {
    "id": "28-2",
    "unit": 28,
    "domain": "mfg",
    "title": "날짜별 파일 이어 붙이기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.concat([df1, df2])",
        "위아래로 붙이기"
      ],
      [
        "ignore_index=True",
        "인덱스 새로 매기기"
      ],
      [
        "drop_duplicates",
        "중복 행 제거"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>MES에서 날짜별로 내려받은 기록 두 개를 하나로 합칩니다. 11-02 기록 한 줄이 두 파일에 중복으로 들어 있습니다.</p>\n<ol><li><code>all_rows</code>: d1과 d2를 위아래로 붙이고 인덱스를 새로 매긴 DataFrame</li><li><code>dedup</code>: 완전히 같은 행을 하나만 남긴 DataFrame</li><li><code>total</code>: 중복 제거 후 총생산량</li></ol>",
    "starter": "import pandas as pd\nd1 = pd.DataFrame({'date': ['11-01', '11-01', '11-02'], 'line': ['A', 'B', 'A'], 'qty': [520, 480, 505]})\nd2 = pd.DataFrame({'date': ['11-02', '11-02', '11-03'], 'line': ['A', 'B', 'A'], 'qty': [505, 470, 540]})\n\n# 1. d1과 d2를 위아래로 붙이고 인덱스를 새로 매긴 DataFrame\nall_rows = \n# 2. 완전히 같은 행을 하나만 남긴 DataFrame\ndedup = \n# 3. 중복 제거 후 총생산량\ntotal = \n\nprint(all_rows, dedup, total, sep='\\n')\n",
    "solution": "import pandas as pd\nd1 = pd.DataFrame({'date': ['11-01', '11-01', '11-02'], 'line': ['A', 'B', 'A'], 'qty': [520, 480, 505]})\nd2 = pd.DataFrame({'date': ['11-02', '11-02', '11-03'], 'line': ['A', 'B', 'A'], 'qty': [505, 470, 540]})\n\n# 1. d1과 d2를 위아래로 붙이고 인덱스를 새로 매긴 DataFrame\nall_rows = pd.concat([d1, d2], ignore_index=True)\n# 2. 완전히 같은 행을 하나만 남긴 DataFrame\ndedup = all_rows.drop_duplicates()\n# 3. 중복 제거 후 총생산량\ntotal = int(dedup['qty'].sum())\n\nprint(all_rows, dedup, total, sep='\\n')\n",
    "hints": [
      "pd.concat([d1, d2], ignore_index=True)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 d1과 d2를 위아래로 붙이고 인덱스를 새로 매긴 DataFrame",
        "expr": "all_rows.shape == (6, 3) and [str(c) for c in all_rows.columns.tolist()] == ['date', 'line', 'qty'] and abs(float(all_rows.select_dtypes('number').sum().sum()) - 3020.0) < 1e-3",
        "hint": "pd.concat([d1, d2], ignore_index=True)"
      },
      {
        "label": "2단계 완전히 같은 행을 하나만 남긴 DataFrame",
        "expr": "dedup.shape == (5, 3) and [str(c) for c in dedup.columns.tolist()] == ['date', 'line', 'qty'] and abs(float(dedup.select_dtypes('number').sum().sum()) - 2515.0) < 1e-3",
        "hint": "drop_duplicates()"
      },
      {
        "label": "3단계 중복 제거 후 총생산량",
        "expr": "total == 2515",
        "hint": "dedup['qty'].sum()"
      }
    ]
  },
  {
    "id": "28-3",
    "unit": 28,
    "domain": "general",
    "title": "주문에 고객 등급 붙이기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "merge(how='left')",
        "주문은 모두 남기고 고객 정보 붙이기"
      ],
      [
        "fillna",
        "등급 없는 고객 처리"
      ],
      [
        "groupby",
        "등급별 매출"
      ]
    ],
    "origin": "pandas",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p><p><code>customers</code>는 고객 등급표입니다. 일부 고객은 등급표에 없습니다.</p>\n<ol><li><code>merged</code>: 주문을 모두 남기고 grade를 붙인 DataFrame</li><li><code>unknown</code>: 등급이 없는 주문 수</li><li><code>grade_rev</code>: grade 결측을 &#x27;신규&#x27;로 채운 뒤 등급별 매출 합계</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\ncustomers = pd.DataFrame({'customer': ['c01', 'c02', 'c03', 'c04', 'c05'], 'grade': ['VIP', '일반', 'VIP', '일반', '일반']})\n\n# 1. 주문을 모두 남기고 grade를 붙인 DataFrame\nmerged = \n# 2. 등급이 없는 주문 수\nunknown = \n# 3. grade 결측을 '신규'로 채운 뒤 등급별 매출 합계\ngrade_rev = \n\nprint(merged.head(), unknown, grade_rev, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\ncustomers = pd.DataFrame({'customer': ['c01', 'c02', 'c03', 'c04', 'c05'], 'grade': ['VIP', '일반', 'VIP', '일반', '일반']})\n\n# 1. 주문을 모두 남기고 grade를 붙인 DataFrame\nmerged = pd.merge(df, customers, on='customer', how='left')\n# 2. 등급이 없는 주문 수\nunknown = int(merged['grade'].isna().sum())\n# 3. grade 결측을 '신규'로 채운 뒤 등급별 매출 합계\ngrade_rev = merged.fillna({'grade': '신규'}).assign(amount=lambda d: d['price'] * d['qty']).groupby('grade')['amount'].sum()\n\nprint(merged.head(), unknown, grade_rev, sep='\\n')\n",
    "hints": [
      "how='left'",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 주문을 모두 남기고 grade를 붙인 DataFrame",
        "expr": "merged.shape == (10, 7) and [str(c) for c in merged.columns.tolist()] == ['order_id', 'region', 'category', 'price', 'qty', 'customer', 'grade'] and abs(float(merged.select_dtypes('number').sum().sum()) - 572576.0) < 1e-3",
        "hint": "how='left'"
      },
      {
        "label": "2단계 등급이 없는 주문 수",
        "expr": "unknown == 2",
        "hint": "isna().sum()"
      },
      {
        "label": "3단계 grade 결측을 '신규'로 채운 뒤 등급별 매출 합계",
        "expr": "grade_rev.index.tolist() == ['VIP', '신규', '일반'] and np.allclose(grade_rev.values.astype(float), [284000.0, 204000.0, 261000.0], atol=1e-4, equal_nan=True)",
        "hint": "fillna({'grade': '신규'}) → assign(amount=...) → groupby"
      }
    ]
  },
  {
    "id": "28-4",
    "unit": 28,
    "domain": "general",
    "title": "키 중복으로 행이 늘어나는 함정",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "merge",
        "키 결합"
      ],
      [
        "1:N 결합",
        "한쪽 키가 여러 번 나오면 행이 늘어남"
      ],
      [
        "duplicated",
        "중복 키 찾기"
      ],
      [
        "validate",
        "결합 관계 검사"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>회원 표 <code>members</code>에 쿠폰 표 <code>coupons</code>를 붙입니다. 한 회원이 쿠폰을 여러 장 가질 수 있습니다.</p>\n<ol><li><code>merged</code>: members에 coupons를 붙인 DataFrame</li><li><code>grown</code>: 결합 후 늘어난 행 수 (결합 후 − members)</li><li><code>dup_keys</code>: coupons에서 두 번 이상 나온 customer (정렬된 리스트)</li><li><code>per_member</code>: 회원별 쿠폰 수 (이름 기준)</li></ol>",
    "starter": "import pandas as pd\nmembers = pd.DataFrame({'customer': ['c01', 'c02', 'c03'], 'name': ['서연', '도윤', '하준']})\ncoupons = pd.DataFrame({'customer': ['c01', 'c01', 'c02', 'c01', 'c03', 'c02'], 'coupon': ['W5', 'F10', 'W5', 'S3', 'F10', 'S3']})\n\n# 1. members에 coupons를 붙인 DataFrame\nmerged = \n# 2. 결합 후 늘어난 행 수 (결합 후 − members)\ngrown = \n# 3. coupons에서 두 번 이상 나온 customer (정렬된 리스트)\ndup_keys = \n# 4. 회원별 쿠폰 수 (이름 기준)\nper_member = \n\nprint(merged, grown, dup_keys, per_member, sep='\\n')\n",
    "solution": "import pandas as pd\nmembers = pd.DataFrame({'customer': ['c01', 'c02', 'c03'], 'name': ['서연', '도윤', '하준']})\ncoupons = pd.DataFrame({'customer': ['c01', 'c01', 'c02', 'c01', 'c03', 'c02'], 'coupon': ['W5', 'F10', 'W5', 'S3', 'F10', 'S3']})\n\n# 1. members에 coupons를 붙인 DataFrame\nmerged = pd.merge(members, coupons, on='customer')\n# 2. 결합 후 늘어난 행 수 (결합 후 − members)\ngrown = len(merged) - len(members)\n# 3. coupons에서 두 번 이상 나온 customer (정렬된 리스트)\ndup_keys = sorted(coupons.loc[coupons['customer'].duplicated(), 'customer'].unique().tolist())\n# 4. 회원별 쿠폰 수 (이름 기준)\nper_member = merged.groupby('name')['coupon'].count()\n\nprint(merged, grown, dup_keys, per_member, sep='\\n')\n",
    "hints": [
      "pd.merge(members, coupons, on='customer')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 members에 coupons를 붙인 DataFrame",
        "expr": "merged.shape == (6, 3) and [str(c) for c in merged.columns.tolist()] == ['customer', 'name', 'coupon'] and abs(float(merged.select_dtypes('number').sum().sum()) - 0.0) < 1e-3",
        "hint": "pd.merge(members, coupons, on='customer')"
      },
      {
        "label": "2단계 결합 후 늘어난 행 수 (결합 후 − members)",
        "expr": "grown == 3",
        "hint": "len(merged) - len(members)"
      },
      {
        "label": "3단계 coupons에서 두 번 이상 나온 customer (정렬된 리스트)",
        "expr": "dup_keys == ['c01', 'c02']",
        "hint": "duplicated()는 두 번째 등장부터 True입니다."
      },
      {
        "label": "4단계 회원별 쿠폰 수 (이름 기준)",
        "expr": "per_member.index.tolist() == ['도윤', '서연', '하준'] and np.allclose(per_member.values.astype(float), [2.0, 3.0, 1.0], atol=1e-4, equal_nan=True)",
        "hint": "groupby('name')['coupon'].count()"
      }
    ]
  },
  {
    "id": "29-1",
    "unit": 29,
    "domain": "mfg",
    "title": "시간별 온도 리샘플링과 이동평균",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "pd.date_range",
        "일정 간격 시각 만들기"
      ],
      [
        "resample('D').mean()",
        "일 단위로 묶어 평균"
      ],
      [
        "rolling(3).mean()",
        "3개 이동평균"
      ],
      [
        "diff()",
        "직전 대비 변화"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>설비 온도를 6시간마다 기록한 Series <code>s</code>입니다 (3일, 12개).</p>\n<ol><li><code>daily</code>: 일별 평균 온도</li><li><code>roll</code>: 3개 이동평균 (앞 2개는 NaN)</li><li><code>jump</code>: 직전 기록보다 가장 크게 오른 폭</li><li><code>peak_hour</code>: 가장 뜨거웠던 시각의 시(hour)</li></ol>",
    "starter": "import pandas as pd\nidx = pd.date_range('2026-11-01', periods=12, freq='6h')\ns = pd.Series([201.0, 203.5, 205.2, 202.1, 200.8, 204.4, 206.9, 203.0, 199.5, 202.7, 204.8, 201.6], index=idx)\n\n# 1. 일별 평균 온도\ndaily = \n# 2. 3개 이동평균 (앞 2개는 NaN)\nroll = \n# 3. 직전 기록보다 가장 크게 오른 폭\njump = \n# 4. 가장 뜨거웠던 시각의 시(hour)\npeak_hour = \n\nprint(daily, roll.round(2), jump, peak_hour, sep='\\n')\n",
    "solution": "import pandas as pd\nidx = pd.date_range('2026-11-01', periods=12, freq='6h')\ns = pd.Series([201.0, 203.5, 205.2, 202.1, 200.8, 204.4, 206.9, 203.0, 199.5, 202.7, 204.8, 201.6], index=idx)\n\n# 1. 일별 평균 온도\ndaily = s.resample('D').mean()\n# 2. 3개 이동평균 (앞 2개는 NaN)\nroll = s.rolling(3).mean()\n# 3. 직전 기록보다 가장 크게 오른 폭\njump = float(s.diff().max())\n# 4. 가장 뜨거웠던 시각의 시(hour)\npeak_hour = int(s.idxmax().hour)\n\nprint(daily, roll.round(2), jump, peak_hour, sep='\\n')\n",
    "hints": [
      "s.resample('D').mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 일별 평균 온도",
        "expr": "len(daily) == 3 and np.allclose(np.asarray(daily, dtype=float), np.array([202.95, 203.775, 202.15], dtype=float), atol=1e-4, equal_nan=True)",
        "hint": "s.resample('D').mean()"
      },
      {
        "label": "2단계 3개 이동평균 (앞 2개는 NaN)",
        "expr": "len(roll) == 12 and np.allclose(np.asarray(roll, dtype=float), np.array([None, None, 203.233333, 203.6, 202.7, 202.433333, 204.033333, 204.766667, 203.133333, 201.733333, 202.333333, 203.033333], dtype=float), atol=1e-4, equal_nan=True)",
        "hint": "s.rolling(3).mean()"
      },
      {
        "label": "3단계 직전 기록보다 가장 크게 오른 폭",
        "expr": "abs(jump - 3.5999999999999943) < 3.6e-06",
        "hint": "s.diff()는 직전 값과의 차이입니다."
      },
      {
        "label": "4단계 가장 뜨거웠던 시각의 시(hour)",
        "expr": "peak_hour == 12",
        "hint": "s.idxmax()는 시각(Timestamp), .hour 로 시를 꺼냅니다."
      }
    ]
  },
  {
    "id": "29-2",
    "unit": 29,
    "domain": "mfg",
    "title": "일자 문자열을 날짜로 바꿔 전일 대비 보기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.to_datetime",
        "문자열 → 날짜"
      ],
      [
        "dt.day_name()",
        "요일 이름"
      ],
      [
        "shift(1)",
        "한 칸 밀기 (전일 값)"
      ],
      [
        "pct_change()",
        "변화율"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>일별 생산 실적 <code>df</code>의 날짜가 문자열입니다.</p>\n<ol><li><code>dates</code>: day를 날짜형으로 바꾼 Series</li><li><code>weekday</code>: 요일 이름 리스트</li><li><code>prev</code>: 전일 생산량 (첫날은 NaN)</li><li><code>change</code>: 전일 대비 증감률(%)</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({'day': ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06'], 'qty': [1610, 1650, 1595, 1702, 1688]})\n\n# 1. day를 날짜형으로 바꾼 Series\ndates = \n# 2. 요일 이름 리스트\nweekday = \n# 3. 전일 생산량 (첫날은 NaN)\nprev = \n# 4. 전일 대비 증감률(%)\nchange = \n\nprint(weekday, prev, change.round(2), sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({'day': ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06'], 'qty': [1610, 1650, 1595, 1702, 1688]})\n\n# 1. day를 날짜형으로 바꾼 Series\ndates = pd.to_datetime(df['day'])\n# 2. 요일 이름 리스트\nweekday = dates.dt.day_name().tolist()\n# 3. 전일 생산량 (첫날은 NaN)\nprev = df['qty'].shift(1)\n# 4. 전일 대비 증감률(%)\nchange = df['qty'].pct_change() * 100\n\nprint(weekday, prev, change.round(2), sep='\\n')\n",
    "hints": [
      "pd.to_datetime(df['day'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "2단계 요일 이름 리스트",
        "expr": "weekday == ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']",
        "hint": "dates.dt.day_name()"
      },
      {
        "label": "3단계 전일 생산량 (첫날은 NaN)",
        "expr": "len(prev) == 5 and np.allclose(np.asarray(prev, dtype=float), np.array([None, 1610.0, 1650.0, 1595.0, 1702.0], dtype=float), atol=1e-4, equal_nan=True)",
        "hint": "shift(1)"
      },
      {
        "label": "4단계 전일 대비 증감률(%)",
        "expr": "len(change) == 5 and np.allclose(np.asarray(change, dtype=float), np.array([None, 2.484472, -3.333333, 6.708464, -0.822562], dtype=float), atol=1e-4, equal_nan=True)",
        "hint": "pct_change() * 100"
      }
    ]
  },
  {
    "id": "29-3",
    "unit": 29,
    "domain": "general",
    "title": "일별 방문자를 주 단위로",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "date_range",
        "날짜 인덱스"
      ],
      [
        "resample('W').sum()",
        "주 단위 합계 (일요일 기준)"
      ],
      [
        "rolling(7).mean()",
        "7일 이동평균"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>2주간 일별 방문자 수 Series <code>v</code>입니다. 첫날 2026-11-02는 월요일입니다.</p>\n<ol><li><code>weekly</code>: 주별 방문자 합계</li><li><code>ma7</code>: 7일 이동평균의 마지막 값</li><li><code>weekend_avg</code>: 토·일 방문자 평균</li></ol>",
    "starter": "import pandas as pd\nidx = pd.date_range('2026-11-02', periods=14, freq='D')\nv = pd.Series([320, 410, 385, 290, 505, 610, 580, 350, 430, 402, 315, 540, 655, 620], index=idx)\n\n# 1. 주별 방문자 합계\nweekly = \n# 2. 7일 이동평균의 마지막 값\nma7 = \n# 3. 토·일 방문자 평균\nweekend_avg = \n\nprint(weekly, ma7, weekend_avg, sep='\\n')\n",
    "solution": "import pandas as pd\nidx = pd.date_range('2026-11-02', periods=14, freq='D')\nv = pd.Series([320, 410, 385, 290, 505, 610, 580, 350, 430, 402, 315, 540, 655, 620], index=idx)\n\n# 1. 주별 방문자 합계\nweekly = v.resample('W').sum()\n# 2. 7일 이동평균의 마지막 값\nma7 = float(v.rolling(7).mean().iloc[-1])\n# 3. 토·일 방문자 평균\nweekend_avg = float(v[v.index.dayofweek >= 5].mean())\n\nprint(weekly, ma7, weekend_avg, sep='\\n')\n",
    "hints": [
      "resample('W')는 일요일에 끝나는 주로 묶습니다.",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 주별 방문자 합계",
        "expr": "len(weekly) == 2 and np.allclose(np.asarray(weekly, dtype=float), np.array([3100.0, 3312.0], dtype=float), atol=1e-4, equal_nan=True)",
        "hint": "resample('W')는 일요일에 끝나는 주로 묶습니다."
      },
      {
        "label": "2단계 7일 이동평균의 마지막 값",
        "expr": "abs(ma7 - 473.14285714285717) < 0.000473",
        "hint": "rolling(7).mean().iloc[-1]"
      },
      {
        "label": "3단계 토·일 방문자 평균",
        "expr": "abs(weekend_avg - 616.25) < 0.000616",
        "hint": "dayofweek 는 월=0 … 일=6"
      }
    ]
  },
  {
    "id": "29-4",
    "unit": 29,
    "domain": "general",
    "title": "주문 시각으로 월별 · 시간대별 집계",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "pd.to_datetime",
        "문자열 → 날짜시각"
      ],
      [
        "dt.month / dt.hour",
        "월 · 시 꺼내기"
      ],
      [
        "groupby",
        "월별 합계"
      ]
    ],
    "origin": "pandas",
    "desc": "<p>주문 기록 <code>df</code>의 <code>ts</code>는 주문 시각 문자열입니다.</p>\n<ol><li><code>ts</code>: ts를 날짜시각형으로</li><li><code>monthly</code>: 월별 매출 합계 (인덱스는 월 숫자)</li><li><code>night</code>: 20시 이후 주문 수</li><li><code>gap_days</code>: 첫 주문과 마지막 주문 사이 일수</li></ol>",
    "starter": "import pandas as pd\ndf = pd.DataFrame({\n    'ts': ['2026-09-03 10:15', '2026-09-18 21:40', '2026-10-01 13:05', '2026-10-09 22:10', '2026-10-21 09:30', '2026-11-02 20:55'],\n    'amount': [39000, 12000, 159000, 8500, 45000, 23000],\n})\n\n# 1. ts를 날짜시각형으로\nts = \n# 2. 월별 매출 합계 (인덱스는 월 숫자)\nmonthly = \n# 3. 20시 이후 주문 수\nnight = \n# 4. 첫 주문과 마지막 주문 사이 일수\ngap_days = \n\nprint(monthly, night, gap_days, sep='\\n')\n",
    "solution": "import pandas as pd\ndf = pd.DataFrame({\n    'ts': ['2026-09-03 10:15', '2026-09-18 21:40', '2026-10-01 13:05', '2026-10-09 22:10', '2026-10-21 09:30', '2026-11-02 20:55'],\n    'amount': [39000, 12000, 159000, 8500, 45000, 23000],\n})\n\n# 1. ts를 날짜시각형으로\nts = pd.to_datetime(df['ts'])\n# 2. 월별 매출 합계 (인덱스는 월 숫자)\nmonthly = df['amount'].groupby(ts.dt.month).sum()\n# 3. 20시 이후 주문 수\nnight = int((ts.dt.hour >= 20).sum())\n# 4. 첫 주문과 마지막 주문 사이 일수\ngap_days = int((ts.max() - ts.min()).days)\n\nprint(monthly, night, gap_days, sep='\\n')\n",
    "hints": [
      "pd.to_datetime(df['ts'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "2단계 월별 매출 합계 (인덱스는 월 숫자)",
        "expr": "monthly.index.tolist() == [9, 10, 11] and np.allclose(monthly.values.astype(float), [51000.0, 212500.0, 23000.0], atol=1e-4, equal_nan=True)",
        "hint": "df['amount'].groupby(ts.dt.month).sum()"
      },
      {
        "label": "3단계 20시 이후 주문 수",
        "expr": "night == 3",
        "hint": "ts.dt.hour >= 20"
      },
      {
        "label": "4단계 첫 주문과 마지막 주문 사이 일수",
        "expr": "gap_days == 60",
        "hint": "두 시각의 차이(Timedelta)의 .days"
      }
    ]
  },
  {
    "id": "30-1",
    "unit": 30,
    "domain": "mfg",
    "title": "일별 불량률 선 그래프",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "fig, ax = plt.subplots()",
        "그림과 축 만들기"
      ],
      [
        "ax.plot(x, y, marker='o')",
        "선 그래프"
      ],
      [
        "ax.set_title / set_xlabel / set_ylabel",
        "제목과 축 이름"
      ],
      [
        "ax.axhline",
        "기준선"
      ]
    ],
    "origin": "시각화",
    "desc": "<p>5일간 불량률로 선 그래프를 그립니다. 축 이름은 영어로 씁니다 (브라우저에는 한글 글꼴이 없습니다).</p>\n<ol><li><code>line</code>: rate를 marker=&#x27;o&#x27; 선 그래프로</li><li><code>title</code>: 제목 &#x27;Daily defect rate&#x27;</li><li><code>ylabel</code>: y축 이름 &#x27;Defect rate (%)&#x27;</li><li><code>limit</code>: y=2.5 위치에 빨간 기준선</li></ol>",
    "starter": "import matplotlib.pyplot as plt\ndays = ['11-01', '11-02', '11-03', '11-04', '11-05']\nrate = [1.8, 2.4, 1.5, 3.1, 2.2]\nfig, ax = plt.subplots(figsize=(6, 3))\n\n# 1. rate를 marker='o' 선 그래프로\nline = \n# 2. 제목 'Daily defect rate'\ntitle = \n# 3. y축 이름 'Defect rate (%)'\nylabel = \n# 4. y=2.5 위치에 빨간 기준선\nlimit = \n\nprint(ax.get_title(), len(ax.lines))\n",
    "solution": "import matplotlib.pyplot as plt\ndays = ['11-01', '11-02', '11-03', '11-04', '11-05']\nrate = [1.8, 2.4, 1.5, 3.1, 2.2]\nfig, ax = plt.subplots(figsize=(6, 3))\n\n# 1. rate를 marker='o' 선 그래프로\nline = ax.plot(days, rate, marker='o')\n# 2. 제목 'Daily defect rate'\ntitle = ax.set_title('Daily defect rate')\n# 3. y축 이름 'Defect rate (%)'\nylabel = ax.set_ylabel('Defect rate (%)')\n# 4. y=2.5 위치에 빨간 기준선\nlimit = ax.axhline(2.5, color='red', linestyle='--')\n\nprint(ax.get_title(), len(ax.lines))\n",
    "hints": [
      "ax.plot(x, y, marker='o')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 rate를 marker='o' 선 그래프로",
        "expr": "len(ax.lines) >= 1 and list(ax.lines[0].get_ydata()) == [1.8, 2.4, 1.5, 3.1, 2.2]",
        "hint": "ax.plot(x, y, marker='o')"
      },
      {
        "label": "2단계 제목 'Daily defect rate'",
        "expr": "ax.get_title() == 'Daily defect rate'",
        "hint": "ax.set_title('Daily defect rate')"
      },
      {
        "label": "3단계 y축 이름 'Defect rate (%)'",
        "expr": "ax.get_ylabel() == 'Defect rate (%)'",
        "hint": "ax.set_ylabel(...)"
      },
      {
        "label": "4단계 y=2.5 위치에 빨간 기준선",
        "expr": "any(list(l.get_ydata()) == [2.5, 2.5] for l in ax.lines)",
        "hint": "ax.axhline(2.5, color='red')"
      }
    ]
  },
  {
    "id": "30-2",
    "unit": 30,
    "domain": "mfg",
    "title": "라인별 막대와 온도-불량 산점도",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "plt.subplots(1, 2)",
        "그림 하나에 축 두 개"
      ],
      [
        "ax.bar",
        "막대 그래프"
      ],
      [
        "ax.scatter",
        "산점도"
      ]
    ],
    "origin": "시각화",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p><p>왼쪽에는 라인별 총생산량 막대, 오른쪽에는 온도와 불량 수의 산점도를 그립니다.</p>\n<ol><li><code>qty_by_line</code>: 라인별 총생산량</li><li><code>bars</code>: ax1에 라인별 생산량 막대</li><li><code>points</code>: ax2에 x=temp, y=defect 산점도</li><li><code>xlabel</code>: ax2의 x축 이름 &#x27;Temp&#x27;</li></ol>",
    "starter": "import matplotlib.pyplot as plt\nimport pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3))\n\n# 1. 라인별 총생산량\nqty_by_line = \n# 2. ax1에 라인별 생산량 막대\nbars = \n# 3. ax2에 x=temp, y=defect 산점도\npoints = \n# 4. ax2의 x축 이름 'Temp'\nxlabel = \n\nprint(qty_by_line)\n",
    "solution": "import matplotlib.pyplot as plt\nimport pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3))\n\n# 1. 라인별 총생산량\nqty_by_line = df.groupby('line')['qty'].sum()\n# 2. ax1에 라인별 생산량 막대\nbars = ax1.bar(qty_by_line.index, qty_by_line.values)\n# 3. ax2에 x=temp, y=defect 산점도\npoints = ax2.scatter(df['temp'], df['defect'])\n# 4. ax2의 x축 이름 'Temp'\nxlabel = ax2.set_xlabel('Temp')\n\nprint(qty_by_line)\n",
    "hints": [
      "groupby('line')['qty'].sum()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 라인별 총생산량",
        "expr": "qty_by_line.index.tolist() == ['A', 'B', 'C'] and np.allclose(qty_by_line.values.astype(float), [1565.0, 1405.0, 1840.0], atol=1e-4, equal_nan=True)",
        "hint": "groupby('line')['qty'].sum()"
      },
      {
        "label": "2단계 ax1에 라인별 생산량 막대",
        "expr": "len(ax1.patches) == 3",
        "hint": "ax1.bar(x, height)"
      },
      {
        "label": "3단계 ax2에 x=temp, y=defect 산점도",
        "expr": "len(ax2.collections) == 1 and len(ax2.collections[0].get_offsets()) == 9",
        "hint": "ax2.scatter(x, y)"
      },
      {
        "label": "4단계 ax2의 x축 이름 'Temp'",
        "expr": "ax2.get_xlabel() == 'Temp'",
        "hint": "ax2.set_xlabel('Temp')"
      }
    ]
  },
  {
    "id": "30-3",
    "unit": 30,
    "domain": "general",
    "title": "월별 매출 추이",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "ax.plot",
        "선 그래프"
      ],
      [
        "ax.set_title",
        "제목"
      ],
      [
        "ax.grid",
        "보조선"
      ]
    ],
    "origin": "시각화",
    "desc": "<p>6개월 월별 매출(백만 원)로 추이 그래프를 그립니다.</p>\n<ol><li><code>line</code>: sales 선 그래프 (marker=&#x27;o&#x27;)</li><li><code>title</code>: 제목 &#x27;Monthly sales&#x27;</li><li><code>xlabel</code>: x축 이름 &#x27;Month&#x27;</li><li><code>growth</code>: 6월 대비 11월 증가율(%)</li></ol>",
    "starter": "import matplotlib.pyplot as plt\nmonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']\nsales = [42, 45, 39, 51, 58, 63]\nfig, ax = plt.subplots(figsize=(6, 3))\n\n# 1. sales 선 그래프 (marker='o')\nline = \n# 2. 제목 'Monthly sales'\ntitle = \n# 3. x축 이름 'Month'\nxlabel = \n# 4. 6월 대비 11월 증가율(%)\ngrowth = \n\nprint(round(growth, 1))\n",
    "solution": "import matplotlib.pyplot as plt\nmonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']\nsales = [42, 45, 39, 51, 58, 63]\nfig, ax = plt.subplots(figsize=(6, 3))\n\n# 1. sales 선 그래프 (marker='o')\nline = ax.plot(months, sales, marker='o')\n# 2. 제목 'Monthly sales'\ntitle = ax.set_title('Monthly sales')\n# 3. x축 이름 'Month'\nxlabel = ax.set_xlabel('Month')\n# 4. 6월 대비 11월 증가율(%)\ngrowth = (sales[-1] - sales[0]) / sales[0] * 100\n\nprint(round(growth, 1))\n",
    "hints": [
      "ax.plot(x, y, marker='o')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 sales 선 그래프 (marker='o')",
        "expr": "len(ax.lines) == 1 and list(ax.lines[0].get_ydata()) == [42, 45, 39, 51, 58, 63]",
        "hint": "ax.plot(x, y, marker='o')"
      },
      {
        "label": "2단계 제목 'Monthly sales'",
        "expr": "ax.get_title() == 'Monthly sales'",
        "hint": "ax.set_title(...)"
      },
      {
        "label": "3단계 x축 이름 'Month'",
        "expr": "ax.get_xlabel() == 'Month'",
        "hint": "ax.set_xlabel(...)"
      },
      {
        "label": "4단계 6월 대비 11월 증가율(%)",
        "expr": "abs(growth - 50.0) < 5e-05",
        "hint": "(마지막 − 처음) ÷ 처음 × 100"
      }
    ]
  },
  {
    "id": "30-4",
    "unit": 30,
    "domain": "general",
    "title": "카테고리별 매출 가로 막대",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "groupby + sort_values",
        "정렬된 집계"
      ],
      [
        "ax.barh",
        "가로 막대"
      ],
      [
        "ax.invert_yaxis",
        "큰 값을 위로"
      ]
    ],
    "origin": "시각화",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p>\n<ol><li><code>rev</code>: 카테고리별 매출(단가 × 수량) 합계, 큰 순</li><li><code>bars</code>: rev 가로 막대</li><li><code>inv</code>: y축을 뒤집어 큰 값이 위로</li></ol>",
    "starter": "import matplotlib.pyplot as plt\nimport pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\nfig, ax = plt.subplots(figsize=(6, 3))\n\n# 1. 카테고리별 매출(단가 × 수량) 합계, 큰 순\nrev = \n# 2. rev 가로 막대\nbars = \n# 3. y축을 뒤집어 큰 값이 위로\ninv = \n\nprint(rev)\n",
    "solution": "import matplotlib.pyplot as plt\nimport pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\nfig, ax = plt.subplots(figsize=(6, 3))\n\n# 1. 카테고리별 매출(단가 × 수량) 합계, 큰 순\nrev = (df['price'] * df['qty']).groupby(df['category']).sum().sort_values(ascending=False)\n# 2. rev 가로 막대\nbars = ax.barh(rev.index, rev.values)\n# 3. y축을 뒤집어 큰 값이 위로\ninv = ax.invert_yaxis()\n\nprint(rev)\n",
    "hints": [
      "Series.groupby(df['category']).sum() 후 정렬",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 카테고리별 매출(단가 × 수량) 합계, 큰 순",
        "expr": "rev.index.tolist() == ['전자', '식품', '의류'] and np.allclose(rev.values.astype(float), [377000.0, 191000.0, 181000.0], atol=1e-4, equal_nan=True)",
        "hint": "Series.groupby(df['category']).sum() 후 정렬"
      },
      {
        "label": "2단계 rev 가로 막대",
        "expr": "len(ax.patches) == 3",
        "hint": "ax.barh(y, width)"
      },
      {
        "label": "3단계 y축을 뒤집어 큰 값이 위로",
        "expr": "ax.yaxis_inverted()",
        "hint": "ax.invert_yaxis()"
      }
    ]
  },
  {
    "id": "31-1",
    "unit": 31,
    "domain": "mfg",
    "title": "라인별 온도 분포 상자그림",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "import seaborn as sns",
        "seaborn 불러오기"
      ],
      [
        "sns.histplot",
        "히스토그램"
      ],
      [
        "sns.boxplot(x=, y=)",
        "범주별 상자그림"
      ],
      [
        "ax=",
        "그릴 축 지정"
      ]
    ],
    "origin": "시각화",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p><p>왼쪽에 온도 히스토그램, 오른쪽에 라인별 온도 상자그림을 그립니다. seaborn은 처음 실행할 때 내려받느라 시간이 조금 더 걸립니다.</p>\n<ol><li><code>h</code>: ax1에 temp 히스토그램 (bins=5)</li><li><code>b</code>: ax2에 x=line, y=temp 상자그림</li><li><code>temp_med</code>: 라인별 온도 중앙값</li></ol>",
    "starter": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3))\n\n# 1. ax1에 temp 히스토그램 (bins=5)\nh = \n# 2. ax2에 x=line, y=temp 상자그림\nb = \n# 3. 라인별 온도 중앙값\ntemp_med = \n\nprint(temp_med)\n",
    "solution": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3))\n\n# 1. ax1에 temp 히스토그램 (bins=5)\nh = sns.histplot(data=df, x='temp', bins=5, ax=ax1)\n# 2. ax2에 x=line, y=temp 상자그림\nb = sns.boxplot(data=df, x='line', y='temp', ax=ax2)\n# 3. 라인별 온도 중앙값\ntemp_med = df.groupby('line')['temp'].median()\n\nprint(temp_med)\n",
    "hints": [
      "sns.histplot(data=df, x='temp', bins=5, ax=ax1)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 ax1에 temp 히스토그램 (bins=5)",
        "expr": "len(ax1.patches) == 5",
        "hint": "sns.histplot(data=df, x='temp', bins=5, ax=ax1)"
      },
      {
        "label": "2단계 ax2에 x=line, y=temp 상자그림",
        "expr": "[t.get_text() for t in ax2.get_xticklabels()] == ['A', 'B', 'C']",
        "hint": "sns.boxplot(data=df, x='line', y='temp', ax=ax2)"
      },
      {
        "label": "3단계 라인별 온도 중앙값",
        "expr": "temp_med.index.tolist() == ['A', 'B', 'C'] and np.allclose(temp_med.values.astype(float), [202.0, 208.1, 198.9], atol=1e-4, equal_nan=True)",
        "hint": "상자 가운데 선이 중앙값입니다."
      }
    ]
  },
  {
    "id": "31-2",
    "unit": 31,
    "domain": "mfg",
    "title": "공정 변수 상관 히트맵",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "df.corr()",
        "상관계수 행렬"
      ],
      [
        "sns.heatmap(annot=True)",
        "숫자가 적힌 히트맵"
      ],
      [
        "cmap",
        "색상표"
      ]
    ],
    "origin": "시각화",
    "desc": "<p><code>df</code>는 3일 동안 라인 A·B·C의 생산 기록입니다. 열: <code>date</code>(일자), <code>line</code>, <code>qty</code>(생산량), <code>defect</code>(불량 수), <code>temp</code>(설비 온도).</p>\n<ol><li><code>corr</code>: qty, defect, temp 세 열의 상관계수 행렬</li><li><code>hm</code>: corr 히트맵 (annot=True, cmap=&#x27;coolwarm&#x27;)</li><li><code>r_temp_defect</code>: temp와 defect의 상관계수</li></ol>",
    "starter": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nfig, ax = plt.subplots(figsize=(4, 3))\n\n# 1. qty, defect, temp 세 열의 상관계수 행렬\ncorr = \n# 2. corr 히트맵 (annot=True, cmap='coolwarm')\nhm = \n# 3. temp와 defect의 상관계수\nr_temp_defect = \n\nprint(corr.round(2))\n",
    "solution": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'date': ['11-01', '11-01', '11-01', '11-02', '11-02', '11-02', '11-03', '11-03', '11-03'],\n    'line': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],\n    'qty': [520, 480, 610, 505, 470, 630, 540, 455, 600],\n    'defect': [6, 9, 4, 3, 12, 5, 7, 10, 2],\n    'temp': [201.5, 207.2, 198.9, 203.1, 209.4, 199.5, 202.0, 208.1, 197.6],\n})\nfig, ax = plt.subplots(figsize=(4, 3))\n\n# 1. qty, defect, temp 세 열의 상관계수 행렬\ncorr = df[['qty', 'defect', 'temp']].corr()\n# 2. corr 히트맵 (annot=True, cmap='coolwarm')\nhm = sns.heatmap(corr, annot=True, cmap='coolwarm', ax=ax)\n# 3. temp와 defect의 상관계수\nr_temp_defect = float(corr.loc['temp', 'defect'])\n\nprint(corr.round(2))\n",
    "hints": [
      "df[[열 목록]].corr()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 qty, defect, temp 세 열의 상관계수 행렬",
        "expr": "corr.shape == (3, 3) and [str(c) for c in corr.columns.tolist()] == ['qty', 'defect', 'temp'] and abs(float(corr.select_dtypes('number').sum().sum()) - 1.495285) < 1e-3",
        "hint": "df[[열 목록]].corr()"
      },
      {
        "label": "2단계 corr 히트맵 (annot=True, cmap='coolwarm')",
        "expr": "len(ax.collections) == 1 and len(ax.texts) == 9",
        "hint": "sns.heatmap(corr, annot=True, cmap='coolwarm', ax=ax)"
      },
      {
        "label": "3단계 temp와 defect의 상관계수",
        "expr": "abs(r_temp_defect - 0.8995141897875216) < 1e-06",
        "hint": "corr.loc['temp', 'defect']"
      }
    ]
  },
  {
    "id": "31-3",
    "unit": 31,
    "domain": "general",
    "title": "카테고리별 단가 비교",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "sns.barplot",
        "범주별 평균 막대 (errorbar=None)"
      ],
      [
        "sns.countplot",
        "범주별 개수"
      ]
    ],
    "origin": "시각화",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p><p>왼쪽에 카테고리별 평균 단가, 오른쪽에 지역별 주문 수를 그립니다.</p>\n<ol><li><code>bp</code>: ax1에 x=category, y=price 평균 막대 (errorbar=None, order=[&#x27;의류&#x27;, &#x27;식품&#x27;, &#x27;전자&#x27;])</li><li><code>cp</code>: ax2에 region별 주문 수 (countplot)</li><li><code>avg_price</code>: 카테고리별 평균 단가</li></ol>",
    "starter": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3))\n\n# 1. ax1에 x=category, y=price 평균 막대 (errorbar=None, order=['의류', '식품', '전자'])\nbp = \n# 2. ax2에 region별 주문 수 (countplot)\ncp = \n# 3. 카테고리별 평균 단가\navg_price = \n\nprint(avg_price.round(0))\n",
    "solution": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3))\n\n# 1. ax1에 x=category, y=price 평균 막대 (errorbar=None, order=['의류', '식품', '전자'])\nbp = sns.barplot(data=df, x='category', y='price', errorbar=None, order=['의류', '식품', '전자'], ax=ax1)\n# 2. ax2에 region별 주문 수 (countplot)\ncp = sns.countplot(data=df, x='region', ax=ax2)\n# 3. 카테고리별 평균 단가\navg_price = df.groupby('category')['price'].mean()\n\nprint(avg_price.round(0))\n",
    "hints": [
      "sns.barplot(..., errorbar=None, order=[...], ax=ax1)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 ax1에 x=category, y=price 평균 막대 (errorbar=None, order=['의류', '식품', '전자'])",
        "expr": "len(ax1.patches) == 3 and abs(ax1.patches[2].get_height() - 125666.6667) < 1",
        "hint": "sns.barplot(..., errorbar=None, order=[...], ax=ax1)"
      },
      {
        "label": "2단계 ax2에 region별 주문 수 (countplot)",
        "expr": "sorted(p.get_height() for p in ax2.patches) == [3, 3, 4]",
        "hint": "sns.countplot(data=df, x='region', ax=ax2)"
      },
      {
        "label": "3단계 카테고리별 평균 단가",
        "expr": "avg_price.index.tolist() == ['식품', '의류', '전자'] and np.allclose(avg_price.values.astype(float), [14625.0, 45333.333333, 125666.666667], atol=1e-4, equal_nan=True)",
        "hint": "막대 높이와 같은 값입니다."
      }
    ]
  },
  {
    "id": "31-4",
    "unit": 31,
    "domain": "general",
    "title": "단가와 수량의 관계 산점도",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "sns.scatterplot(hue=)",
        "범주별 색 산점도"
      ],
      [
        "corr",
        "상관계수"
      ]
    ],
    "origin": "시각화",
    "desc": "<p><code>df</code>는 쇼핑몰 주문 10건입니다. 열: <code>order_id</code>, <code>region</code>(지역), <code>category</code>, <code>price</code>(단가), <code>qty</code>(수량), <code>customer</code>(고객 ID).</p>\n<ol><li><code>sp</code>: x=price, y=qty, hue=category 산점도</li><li><code>r</code>: price와 qty의 상관계수</li><li><code>negative</code>: 음의 상관인지 (True/False)</li></ol>",
    "starter": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\nfig, ax = plt.subplots(figsize=(5, 3))\n\n# 1. x=price, y=qty, hue=category 산점도\nsp = \n# 2. price와 qty의 상관계수\nr = \n# 3. 음의 상관인지 (True/False)\nnegative = \n\nprint(round(r, 3), negative)\n",
    "solution": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],\n    'region': ['서울', '부산', '서울', '대구', '부산', '서울', '대구', '서울', '부산', '대구'],\n    'category': ['의류', '식품', '전자', '식품', '의류', '식품', '전자', '전자', '식품', '의류'],\n    'price': [39000, 12000, 159000, 8500, 45000, 23000, 89000, 129000, 15000, 52000],\n    'qty': [1, 3, 1, 4, 2, 2, 1, 1, 5, 1],\n    'customer': ['c01', 'c02', 'c03', 'c01', 'c04', 'c05', 'c02', 'c06', 'c07', 'c03'],\n})\nfig, ax = plt.subplots(figsize=(5, 3))\n\n# 1. x=price, y=qty, hue=category 산점도\nsp = sns.scatterplot(data=df, x='price', y='qty', hue='category', ax=ax)\n# 2. price와 qty의 상관계수\nr = float(df['price'].corr(df['qty']))\n# 3. 음의 상관인지 (True/False)\nnegative = r < 0\n\nprint(round(r, 3), negative)\n",
    "hints": [
      "sns.scatterplot(..., hue='category', ax=ax)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 x=price, y=qty, hue=category 산점도",
        "expr": "sum(len(c.get_offsets()) for c in ax.collections) == 10 and ax.get_legend() is not None",
        "hint": "sns.scatterplot(..., hue='category', ax=ax)"
      },
      {
        "label": "2단계 price와 qty의 상관계수",
        "expr": "abs(r - -0.6643196914048058) < 1e-06",
        "hint": "df['price'].corr(df['qty'])"
      },
      {
        "label": "3단계 음의 상관인지 (True/False)",
        "expr": "negative == True",
        "hint": "r < 0"
      }
    ]
  }
];

export const DA_QUIZZES = [
  {
    "id": "23-Q",
    "unit": 23,
    "title": "인덱싱 · 브로드캐스팅 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "a의 두 번째 열을 리스트로 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])",
        "expect": "[2, 5]",
        "must": [
          "a\\[\\s*:\\s*,\\s*1\\s*\\]"
        ],
        "solution": "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(a[:, 1].tolist())",
        "explain": "a[:, 1]은 모든 행의 1번 열입니다."
      },
      {
        "kind": "write",
        "q": "브로드캐스팅으로 a의 각 행에서 b를 뺀 결과를 리스트로 출력하세요.",
        "given": "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nb = np.array([1, 2, 3])",
        "expect": "[[0, 0, 0], [3, 3, 3]]",
        "must": [
          "a\\s*-\\s*b"
        ],
        "solution": "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nb = np.array([1, 2, 3])\nprint((a - b).tolist())",
        "explain": "(2,3) − (3,)은 행마다 b를 뺍니다."
      },
      {
        "kind": "choice",
        "q": "(3, 1) 배열과 (4,) 배열을 더하면 결과의 shape은?",
        "options": [
          "(3, 4)",
          "(4, 3)",
          "(3, 1)",
          "에러"
        ],
        "answer": 0,
        "explain": "뒤 차원부터 1은 늘어나 맞춰집니다: (3,1)+(1,4) → (3,4)."
      },
      {
        "kind": "ox",
        "q": "data.sum(axis=1)은 열마다 합계를 낸다.",
        "answer": false,
        "explain": "axis=1은 행 하나 안에서 열 방향으로 더합니다. 즉 행마다 합계입니다."
      },
      {
        "kind": "choice",
        "q": "(3,) 배열을 (3, 1) 모양으로 바꾸는 방법이 아닌 것은?",
        "options": [
          "a[:, None]",
          "a.reshape(-1, 1)",
          "a.reshape(3, 1)",
          "a.T"
        ],
        "answer": 3,
        "explain": "1차원 배열의 .T는 그대로 (3,)입니다."
      }
    ]
  },
  {
    "id": "24-Q",
    "unit": 24,
    "title": "Series · DataFrame 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "df의 행 수와 열 수를 (행, 열) 튜플로 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]})",
        "expect": "(3, 2)",
        "must": [
          "\\.shape"
        ],
        "solution": "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]})\nprint(df.shape)",
        "explain": "df.shape은 (행 수, 열 수)입니다."
      },
      {
        "kind": "write",
        "q": "value_counts로 s에서 가장 많이 나온 값을 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\ns = pd.Series(['A', 'B', 'B', 'C', 'B'])",
        "expect": "B",
        "must": [
          "value_counts\\("
        ],
        "solution": "import pandas as pd\ns = pd.Series(['A', 'B', 'B', 'C', 'B'])\nprint(s.value_counts().index[0])",
        "explain": "value_counts()는 많은 순으로 정렬되어 index[0]이 최빈값입니다."
      },
      {
        "kind": "ox",
        "q": "df['qty']로 꺼낸 열 하나는 Series다.",
        "answer": true,
        "explain": "열 하나는 Series, df[['qty']]처럼 리스트로 꺼내면 DataFrame입니다."
      },
      {
        "kind": "choice",
        "q": "숫자 열의 개수·평균·표준편차·사분위수를 한 번에 보여 주는 메서드는?",
        "options": [
          "info()",
          "describe()",
          "head()",
          "value_counts()"
        ],
        "answer": 1,
        "explain": "describe()는 수치 요약, info()는 열별 자료형과 결측 개수입니다."
      },
      {
        "kind": "choice",
        "q": "df.columns.tolist()가 돌려주는 것은?",
        "options": [
          "열 이름 리스트",
          "첫 행 값",
          "열 개수",
          "행 이름 리스트"
        ],
        "answer": 0,
        "explain": "columns는 열 이름, index는 행 이름입니다."
      }
    ]
  },
  {
    "id": "25-Q",
    "unit": 25,
    "title": "선택과 필터 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "df에서 score가 80 이상인 행의 name을 리스트로 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\ndf = pd.DataFrame({'name': ['A', 'B', 'C'], 'score': [90, 70, 85]})",
        "expect": "['A', 'C']",
        "must": [
          "score.{0,4}\\]\\s*>=\\s*80"
        ],
        "solution": "import pandas as pd\ndf = pd.DataFrame({'name': ['A', 'B', 'C'], 'score': [90, 70, 85]})\nprint(df.loc[df['score'] >= 80, 'name'].tolist())",
        "explain": "df.loc[조건, '열']로 조건에 맞는 행의 열을 꺼냅니다."
      },
      {
        "kind": "write",
        "q": "iloc로 df의 마지막 행 score를 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\ndf = pd.DataFrame({'name': ['A', 'B', 'C'], 'score': [90, 70, 85]})",
        "expect": "85",
        "must": [
          "iloc"
        ],
        "solution": "import pandas as pd\ndf = pd.DataFrame({'name': ['A', 'B', 'C'], 'score': [90, 70, 85]})\nprint(df['score'].iloc[-1])",
        "explain": "iloc[-1]은 위치 기준 마지막입니다."
      },
      {
        "kind": "choice",
        "q": "두 조건을 모두 만족하는 행을 고르는 올바른 코드는?",
        "options": [
          "df[df.a > 1 and df.b < 5]",
          "df[(df.a > 1) & (df.b < 5)]",
          "df[df.a > 1 & df.b < 5]",
          "df[(df.a > 1) and (df.b < 5)]"
        ],
        "answer": 1,
        "explain": "pandas 조건은 &, |를 쓰고 조건마다 괄호가 필요합니다."
      },
      {
        "kind": "ox",
        "q": "df.loc[0:2]는 0, 1, 2번 라벨 행을 모두 포함한다.",
        "answer": true,
        "explain": "loc 슬라이싱은 끝 라벨을 포함합니다. iloc[0:2]는 0, 1번만입니다."
      },
      {
        "kind": "choice",
        "q": "region이 '서울' 또는 '부산'인 행을 고르는 가장 간단한 방법은?",
        "options": [
          "df[df.region == ['서울', '부산']]",
          "df[df.region.isin(['서울', '부산'])]",
          "df.loc['서울', '부산']",
          "df.query(서울, 부산)"
        ],
        "answer": 1,
        "explain": "isin([...])은 여러 값 중 하나에 해당하는지 검사합니다."
      }
    ]
  },
  {
    "id": "26-Q",
    "unit": 26,
    "title": "결측치 · 전처리 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "s의 결측값 개수를 출력하는 코드를 작성하세요.",
        "given": "import numpy as np\nimport pandas as pd\ns = pd.Series([1.0, np.nan, 3.0, np.nan])",
        "expect": "2",
        "must": [
          "isna\\(|isnull\\("
        ],
        "solution": "import numpy as np\nimport pandas as pd\ns = pd.Series([1.0, np.nan, 3.0, np.nan])\nprint(s.isna().sum())",
        "explain": "isna()는 결측이면 True, sum()은 True 개수입니다."
      },
      {
        "kind": "write",
        "q": "s의 문자열에서 쉼표를 지우고 정수로 바꾼 뒤 합계를 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\ns = pd.Series(['1,000', '2,250'])",
        "expect": "3250",
        "must": [
          "str\\.replace",
          "astype\\("
        ],
        "solution": "import pandas as pd\ns = pd.Series(['1,000', '2,250'])\nprint(s.str.replace(',', '').astype(int).sum())",
        "explain": "str.replace로 쉼표를 지우고 astype(int)로 바꿉니다."
      },
      {
        "kind": "choice",
        "q": "결측값을 바로 앞 행의 값으로 채우는 메서드는?",
        "options": [
          "fillna(0)",
          "ffill()",
          "dropna()",
          "bfill()"
        ],
        "answer": 1,
        "explain": "ffill은 forward fill, bfill은 뒤 값으로 채웁니다."
      },
      {
        "kind": "ox",
        "q": "이상치가 있는 데이터의 결측을 채울 때는 평균보다 중앙값이 덜 흔들린다.",
        "answer": true,
        "explain": "평균은 극단값에 끌려가지만 중앙값은 순서의 가운데라 영향이 적습니다."
      },
      {
        "kind": "choice",
        "q": "df.dropna()의 기본 동작은?",
        "options": [
          "결측이 있는 열을 지운다",
          "결측이 하나라도 있는 행을 지운다",
          "결측을 0으로 바꾼다",
          "원본 df를 바꾼다"
        ],
        "answer": 1,
        "explain": "기본은 행 삭제이며 새 DataFrame을 돌려줍니다."
      }
    ]
  },
  {
    "id": "27-Q",
    "unit": 27,
    "title": "groupby · pivot_table 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "groupby로 team별 score 평균을 딕셔너리로 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\ndf = pd.DataFrame({'team': ['A', 'B', 'A'], 'score': [80, 70, 90]})",
        "expect": "{'A': 85.0, 'B': 70.0}",
        "must": [
          "groupby\\("
        ],
        "solution": "import pandas as pd\ndf = pd.DataFrame({'team': ['A', 'B', 'A'], 'score': [80, 70, 90]})\nprint(df.groupby('team')['score'].mean().to_dict())",
        "explain": "groupby('team')['score'].mean() 결과를 to_dict()로 바꿨습니다."
      },
      {
        "kind": "write",
        "q": "transform으로 각 행에 그 team의 합계를 붙여 리스트로 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\ndf = pd.DataFrame({'team': ['A', 'B', 'A'], 'score': [80, 70, 90]})",
        "expect": "[170, 70, 170]",
        "must": [
          "transform\\("
        ],
        "solution": "import pandas as pd\ndf = pd.DataFrame({'team': ['A', 'B', 'A'], 'score': [80, 70, 90]})\nprint(df.groupby('team')['score'].transform('sum').tolist())",
        "explain": "transform은 원래 행 수 그대로 그룹 값을 돌려줍니다."
      },
      {
        "kind": "choice",
        "q": "df.groupby('line')['qty'].sum()의 결과 index는?",
        "options": [
          "0부터 시작하는 번호",
          "line 값들",
          "qty 값들",
          "열 이름"
        ],
        "answer": 1,
        "explain": "groupby 키가 결과의 index가 됩니다."
      },
      {
        "kind": "ox",
        "q": "pivot_table의 aggfunc 기본값은 평균(mean)이다.",
        "answer": true,
        "explain": "합계가 필요하면 aggfunc='sum'을 지정하세요."
      },
      {
        "kind": "choice",
        "q": "groupby 후 '합계'와 '최댓값'을 각각 다른 이름의 열로 한 번에 구하는 메서드는?",
        "options": [
          "apply",
          "agg",
          "filter",
          "pivot"
        ],
        "answer": 1,
        "explain": "agg(qty_sum=('qty', 'sum'), temp_max=('temp', 'max'))"
      }
    ]
  },
  {
    "id": "28-Q",
    "unit": 28,
    "title": "merge · concat 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "a와 b를 key로 결합(inner)한 결과의 행 수를 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3], 'x': ['a', 'b', 'c']})\nb = pd.DataFrame({'key': [2, 3, 4], 'y': ['B', 'C', 'D']})",
        "expect": "2",
        "must": [
          "merge\\("
        ],
        "solution": "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3], 'x': ['a', 'b', 'c']})\nb = pd.DataFrame({'key': [2, 3, 4], 'y': ['B', 'C', 'D']})\nprint(len(pd.merge(a, b, on='key')))",
        "explain": "inner는 양쪽에 모두 있는 키 2, 3만 남깁니다."
      },
      {
        "kind": "write",
        "q": "a와 b를 위아래로 붙이고 인덱스를 새로 매긴 뒤, 마지막 인덱스 번호를 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3], 'x': ['a', 'b', 'c']})\nb = pd.DataFrame({'key': [2, 3, 4], 'x': ['B', 'C', 'D']})",
        "expect": "5",
        "must": [
          "concat\\(",
          "ignore_index"
        ],
        "solution": "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3], 'x': ['a', 'b', 'c']})\nb = pd.DataFrame({'key': [2, 3, 4], 'x': ['B', 'C', 'D']})\nprint(pd.concat([a, b], ignore_index=True).index[-1])",
        "explain": "ignore_index=True면 0~5로 새로 매깁니다."
      },
      {
        "kind": "choice",
        "q": "왼쪽 표의 행을 모두 남기고, 짝이 없으면 NaN으로 두는 how는?",
        "options": [
          "inner",
          "left",
          "right",
          "outer"
        ],
        "answer": 1,
        "explain": "how='left'"
      },
      {
        "kind": "ox",
        "q": "오른쪽 표에 같은 키가 3번 있으면, 그 키의 왼쪽 행 1개는 결합 후 3행이 된다.",
        "answer": true,
        "explain": "1:N 결합에서는 왼쪽 행이 짝 수만큼 복제됩니다."
      },
      {
        "kind": "choice",
        "q": "merge 전에 오른쪽 표의 키 중복을 확인하는 코드는?",
        "options": [
          "right['key'].duplicated().any()",
          "right.isna()",
          "right.shape",
          "right.drop()"
        ],
        "answer": 0,
        "explain": "duplicated()는 두 번째 등장부터 True입니다."
      }
    ]
  },
  {
    "id": "29-Q",
    "unit": 29,
    "title": "시계열 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "문자열 날짜를 날짜형으로 바꿔 요일 이름을 출력하는 코드를 작성하세요.",
        "expect": "Wednesday",
        "must": [
          "to_datetime\\("
        ],
        "solution": "import pandas as pd\nprint(pd.to_datetime('2026-11-04').day_name())",
        "explain": "pd.to_datetime 후 day_name()"
      },
      {
        "kind": "write",
        "q": "shift(1)로 s의 전일 값을 리스트로 출력하는 코드를 작성하세요. (첫 값은 nan)",
        "given": "import pandas as pd\ns = pd.Series([10, 12, 15])",
        "expect": "[nan, 10.0, 12.0]",
        "must": [
          "shift\\("
        ],
        "solution": "import pandas as pd\ns = pd.Series([10, 12, 15])\nprint(s.shift(1).tolist())",
        "explain": "shift(1)은 값을 한 칸 아래로 밉니다."
      },
      {
        "kind": "choice",
        "q": "일별 데이터를 주 단위 합계로 바꾸는 코드는?",
        "options": [
          "s.rolling(7).sum()",
          "s.resample('W').sum()",
          "s.shift(7)",
          "s.diff(7)"
        ],
        "answer": 1,
        "explain": "resample은 시간 단위로 묶어 집계합니다. rolling은 행 수가 그대로입니다."
      },
      {
        "kind": "ox",
        "q": "s.rolling(3).mean()의 처음 두 값은 NaN이다.",
        "answer": true,
        "explain": "창에 값이 3개 모이기 전까지는 계산하지 않습니다."
      },
      {
        "kind": "choice",
        "q": "pandas에서 dt.dayofweek가 0인 요일은?",
        "options": [
          "일요일",
          "월요일",
          "토요일",
          "화요일"
        ],
        "answer": 1,
        "explain": "월=0 … 일=6입니다."
      }
    ]
  },
  {
    "id": "30-Q",
    "unit": 30,
    "title": "matplotlib 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "fig, ax를 만들고 ax.set_title로 제목 'Sales'를 단 뒤, 제목을 출력하는 코드를 작성하세요.",
        "given": "import matplotlib.pyplot as plt",
        "expect": "Sales",
        "must": [
          "subplots\\(",
          "set_title\\("
        ],
        "solution": "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.set_title('Sales')\nprint(ax.get_title())",
        "explain": "ax.set_title로 달고 ax.get_title로 읽습니다."
      },
      {
        "kind": "write",
        "q": "plt.subplots(1, 3)으로 축 3개를 만든 뒤 축 개수를 출력하는 코드를 작성하세요.",
        "given": "import matplotlib.pyplot as plt",
        "expect": "3",
        "must": [
          "subplots\\(\\s*1\\s*,\\s*3"
        ],
        "solution": "import matplotlib.pyplot as plt\nfig, axes = plt.subplots(1, 3)\nprint(len(axes))",
        "explain": "1행 3열이면 axes는 축 3개짜리 배열입니다."
      },
      {
        "kind": "choice",
        "q": "범주별 값을 비교할 때 가장 알맞은 그래프는?",
        "options": [
          "ax.plot",
          "ax.bar",
          "ax.scatter",
          "ax.hist"
        ],
        "answer": 1,
        "explain": "범주 비교는 막대, 시간 추이는 선, 두 변수 관계는 산점도입니다."
      },
      {
        "kind": "ox",
        "q": "ax.axhline(2.5)는 y=2.5 위치에 가로 기준선을 긋는다.",
        "answer": true,
        "explain": "세로선은 axvline입니다."
      },
      {
        "kind": "choice",
        "q": "두 연속 변수의 관계를 볼 때 알맞은 그래프는?",
        "options": [
          "막대",
          "원",
          "산점도",
          "누적 막대"
        ],
        "answer": 2,
        "explain": "산점도로 패턴과 이상치를 함께 봅니다."
      }
    ]
  },
  {
    "id": "31-Q",
    "unit": 31,
    "title": "seaborn 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "seaborn으로 df의 x 히스토그램(bins=4)을 그린 뒤, 막대 개수를 출력하는 코드를 작성하세요.",
        "given": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'x': [1, 2, 2, 3, 3, 3, 4, 5]})",
        "expect": "4",
        "must": [
          "histplot\\("
        ],
        "solution": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'x': [1, 2, 2, 3, 3, 3, 4, 5]})\nax = sns.histplot(data=df, x='x', bins=4)\nprint(len(ax.patches))",
        "explain": "histplot은 Axes를 돌려주고, 막대는 ax.patches에 있습니다."
      },
      {
        "kind": "choice",
        "q": "sns.barplot(data=df, x='cat', y='price')의 막대 높이는 기본적으로?",
        "options": [
          "합계",
          "평균",
          "개수",
          "최댓값"
        ],
        "answer": 1,
        "explain": "barplot은 평균(estimator=mean)을 그립니다. 개수는 countplot."
      },
      {
        "kind": "choice",
        "q": "범주별 분포(중앙값 · 사분위 · 이상치)를 한눈에 비교하는 그래프는?",
        "options": [
          "boxplot",
          "lineplot",
          "heatmap",
          "countplot"
        ],
        "answer": 0,
        "explain": "상자그림은 중앙값과 IQR, 이상치를 보여 줍니다."
      },
      {
        "kind": "ox",
        "q": "sns.heatmap(df.corr(), annot=True)는 칸마다 상관계수 숫자를 적어 준다.",
        "answer": true,
        "explain": "annot=True가 숫자 표시입니다."
      },
      {
        "kind": "choice",
        "q": "scatterplot에서 범주에 따라 점 색을 다르게 하는 인자는?",
        "options": [
          "color",
          "hue",
          "style=",
          "palette만"
        ],
        "answer": 1,
        "explain": "hue='열'은 그 열의 값마다 색을 다르게 합니다."
      }
    ]
  }
];
