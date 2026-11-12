// 시계열 분석 트랙 유닛 52~60 문제. scripts/build_ts.py 로 생성.
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반).
export const TS_UNITS = [
  {
    "id": 52,
    "title": "시계열 데이터 준비",
    "summary": "날짜 인덱스, 간격 확인, resample 집계, 결측 채우기",
    "note": "<h4>시간을 인덱스로</h4><p><code>pd.to_datetime(열)</code>로 날짜 타입을 만들고 <code>set_index</code>로 인덱스에 올리면 <code>s.loc['2013-12']</code>처럼 기간으로 고를 수 있습니다.</p><h4>간격이 고른지 확인</h4><p><code>s.index.to_series().diff()</code>는 이웃한 시각의 차이입니다. <code>asfreq('D')</code>는 빠진 날짜를 NaN 행으로 드러냅니다.</p><h4>묶는 계산 고르기</h4><p><code>resample('h')</code> 뒤에 쌓이는 양은 <code>sum</code>, 온도 같은 상태값은 <code>mean</code>이나 <code>max</code>를 씁니다. 빈칸은 <code>interpolate()</code>로 앞뒤 값을 이어 채웁니다.</p>"
  },
  {
    "id": 53,
    "title": "시계열 분해",
    "summary": "이동평균, 주기별 평균, seasonal_decompose, STL",
    "note": "<h4>이동평균</h4><p><code>s.rolling(24).mean()</code>은 최근 24칸 평균입니다. <code>center=True</code>를 주면 앞뒤로 고르게 봅니다. 처음 몇 칸은 값이 모자라 NaN입니다.</p><h4>분해</h4><p><code>seasonal_decompose(y, model='multiplicative', period=12)</code>는 추세 · 계절 · 잔차를 돌려줍니다. 물결 높이가 수준과 함께 커지면 곱셈형입니다.</p><h4>STL</h4><p><code>STL(y, period=12).fit()</code>은 끝부분까지 추세를 내 주고 이상치에 덜 흔들립니다. <code>res.trend</code>, <code>res.seasonal</code>, <code>res.resid</code>로 꺼냅니다.</p>"
  },
  {
    "id": 54,
    "title": "자기상관",
    "summary": "shift와 상관계수, ACF · PACF, Ljung-Box 검정",
    "note": "<h4>자기상관</h4><p>원래 시계열과 k칸 민 시계열의 상관계수입니다. <code>s.corr(s.shift(k))</code> 또는 <code>s.autocorr(k)</code>.</p><h4>ACF · PACF</h4><p><code>acf(s, nlags=24)</code>는 래그 0~24의 자기상관 배열입니다(0번은 항상 1). 기준선 ±1.96 ÷ √n 을 넘으면 우연으로 보기 어렵습니다. <code>pacf</code>는 중간 래그의 몫을 뺀 직접 영향입니다.</p><h4>Ljung-Box</h4><p><code>acorr_ljungbox(s, lags=[24])</code>의 p-값이 작으면 '자기상관이 남아 있다'는 뜻입니다.</p>"
  },
  {
    "id": 55,
    "title": "정상성과 차분",
    "summary": "diff, 로그 변환, ADF · KPSS 검정",
    "note": "<h4>차분</h4><p><code>s.diff()</code>는 한 칸 전과의 차이(추세 제거), <code>s.diff(12)</code>는 한 주기 전과의 차이(계절 제거)입니다. 차분한 만큼 앞쪽 행이 NaN이 됩니다.</p><h4>검정 두 가지</h4><p><code>adfuller(s)[1]</code>이 0.05보다 작으면 정상으로 봅니다(출발 가정: 비정상). <code>kpss(s, nlags='auto')[1]</code>은 반대로 0.05보다 작으면 비정상입니다(출발 가정: 정상).</p><h4>로그</h4><p>흔들리는 폭이 수준과 함께 커지면 <code>np.log</code>를 먼저 씌웁니다.</p>"
  },
  {
    "id": 56,
    "title": "예측의 기본기",
    "summary": "시간 순서 분할, 기준 예측, MAE · MAPE · MASE, 롤링 원점",
    "note": "<h4>시간 순서대로 나누기</h4><p>섞지 않고 <code>train = y.iloc[:-h]</code>, <code>test = y.iloc[-h:]</code>로 자릅니다.</p><h4>기준 예측</h4><p>naive는 마지막 값, seasonal naive는 지난 한 주기를 그대로 복사한 값입니다. 모델은 이 선을 넘어야 의미가 있습니다.</p><h4>지표</h4><p>MAE = |오차|의 평균, MAPE = |오차| ÷ 실제값의 평균(%), MASE = MAE ÷ (학습 구간에서 naive가 낸 MAE). MASE가 1보다 작으면 naive보다 낫습니다.</p>"
  },
  {
    "id": 57,
    "title": "지수평활",
    "summary": "ewm으로 직접 평활, SimpleExpSmoothing, Holt-Winters",
    "note": "<h4>지수평활</h4><p>새 수준 = α × 새 값 + (1 − α) × 이전 수준. <code>s.ewm(alpha=0.3, adjust=False).mean()</code>이 같은 계산입니다. α가 클수록 최근 값을 더 따라갑니다.</p><h4>statsmodels</h4><p><code>SimpleExpSmoothing(train).fit()</code>은 α를 스스로 고릅니다. 추세 · 계절이 있으면 <code>ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12)</code>.</p><h4>예측</h4><p><code>fit.forecast(h)</code>가 앞으로 h칸의 예측입니다.</p>"
  },
  {
    "id": 58,
    "title": "ARIMA",
    "summary": "ARIMA 적합, AIC 비교, 예측 구간, 계절 · 외부 변수",
    "note": "<h4>ARIMA(p, d, q)</h4><p>p는 과거 값 몇 개, d는 차분 횟수, q는 과거 오차 몇 개를 쓰는지입니다. <code>ARIMA(train, order=(1, 1, 1)).fit()</code>.</p><h4>고르기와 점검</h4><p>AIC(<code>fit.aic</code>)가 작은 쪽을 고르고, 잔차에 자기상관이 남았는지 Ljung-Box로 봅니다.</p><h4>구간</h4><p><code>fit.get_forecast(h).conf_int()</code>는 예측 구간의 아래 · 위 값입니다. 멀리 갈수록 넓어집니다. 계절은 <code>seasonal_order=(P, D, Q, 주기)</code>, 외부 변수는 <code>exog</code>로 넣습니다.</p>"
  },
  {
    "id": 59,
    "title": "머신러닝으로 예측하기",
    "summary": "래그 · 이동 특성, 시간 순서 분할, 선형 · 트리 모델 비교",
    "note": "<h4>표로 바꾸기</h4><p><code>s.shift(1)</code>(하루 전), <code>s.shift(7)</code>(일주일 전), <code>s.shift(1).rolling(7).mean()</code>(어제까지의 7일 평균)을 특성으로 둡니다. 이동 통계 앞에 <code>shift(1)</code>을 빼먹으면 오늘 값이 섞여 들어갑니다(누수).</p><h4>검증</h4><p>섞지 않고 뒤쪽 구간을 시험용으로 둡니다. 기준 예측(lag1을 그대로 쓰기)과 꼭 비교합니다.</p><h4>트리의 천장</h4><p>트리 모델은 학습 때 본 정답 범위 밖의 값을 낼 수 없습니다. 추세가 있으면 차분하거나 선형 모델을 씁니다.</p>"
  },
  {
    "id": 60,
    "title": "시계열 이상 탐지",
    "summary": "이동 z-점수, 고정 기준선과 알람 평가, 시각별 기준, CUSUM",
    "note": "<h4>이동 z-점수</h4><p>(값 − 직전 구간 평균) ÷ 직전 구간 표준편차. 기준을 만들 때 <code>shift(1)</code>로 지금 값을 빼야 이상치가 자기 기준을 흐리지 않습니다.</p><h4>맥락을 반영한 기준</h4><p>시각마다 평소 값이 다르면 <code>groupby(시각).transform('median')</code>으로 '그 시각의 평소'를 빼고 봅니다.</p><h4>CUSUM</h4><p>기준보다 조금 높은 값이 이어질 때, 초과분을 계속 더해 작은 수준 변화를 잡습니다. C = max(0, 이전 C + 값 − 목표 − k).</p>"
  }
];
export const TS_PROBLEMS = [
  {
    "id": "52-1",
    "unit": 52,
    "domain": "mfg",
    "title": "설비 온도 로그: 시간 인덱스 만들고 간격 확인하기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.to_datetime(열)",
        "문자열을 날짜 타입으로"
      ],
      [
        "s.index.to_series().diff()",
        "이웃한 시각의 차이"
      ],
      [
        "s.loc['2013-12']",
        "기간으로 고르기"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>설비 온도 센서 로그 <code>machine_temp.csv</code>(timestamp, temp)입니다. 시각을 인덱스로 올리고, 몇 분 간격으로 기록됐는지 확인합니다.</p>\n<ol><li><code>ts</code>: timestamp 열을 날짜 타입으로 바꾼 Series</li><li><code>m</code>: ts를 인덱스로 한 temp Series</li><li><code>gap</code>: 이웃한 시각 차이 중 가장 흔한 값 (Timedelta)</li><li><code>per_day</code>: 하루에 기록되는 횟수 (정수)</li><li><code>span_days</code>: 첫 기록부터 마지막 기록까지 지난 날 수 (정수)</li><li><code>n_dec</code>: 2013년 12월 기록 수</li></ol>",
    "starter": "import pandas as pd\n\nraw = pd.read_csv('machine_temp.csv')\n\n# 1. timestamp 열을 날짜 타입으로 바꾼 Series\nts = \n# 2. ts를 인덱스로 한 temp Series\nm = \n# 3. 이웃한 시각 차이 중 가장 흔한 값 (Timedelta)\ngap = \n# 4. 하루에 기록되는 횟수 (정수)\nper_day = \n# 5. 첫 기록부터 마지막 기록까지 지난 날 수 (정수)\nspan_days = \n# 6. 2013년 12월 기록 수\nn_dec = \n\nprint(gap, per_day, span_days, n_dec)\n",
    "solution": "import pandas as pd\n\nraw = pd.read_csv('machine_temp.csv')\n\n# 1. timestamp 열을 날짜 타입으로 바꾼 Series\nts = pd.to_datetime(raw['timestamp'])\n# 2. ts를 인덱스로 한 temp Series\nm = raw.set_index(ts)['temp']\n# 3. 이웃한 시각 차이 중 가장 흔한 값 (Timedelta)\ngap = m.index.to_series().diff().mode()[0]\n# 4. 하루에 기록되는 횟수 (정수)\nper_day = int(pd.Timedelta('1D') / gap)\n# 5. 첫 기록부터 마지막 기록까지 지난 날 수 (정수)\nspan_days = (m.index[-1] - m.index[0]).days\n# 6. 2013년 12월 기록 수\nn_dec = len(m.loc['2013-12'])\n\nprint(gap, per_day, span_days, n_dec)\n",
    "hints": [
      "pd.to_datetime(raw['timestamp'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 timestamp 열을 날짜 타입으로 바꾼 Series",
        "expr": "str(ts.dtype).startswith('datetime64') and len(ts) == 22695",
        "hint": "pd.to_datetime(raw['timestamp'])"
      },
      {
        "label": "2단계 ts를 인덱스로 한 temp Series",
        "expr": "isinstance(m.index, pd.DatetimeIndex) and abs(float(m.sum()) - 1950102.12) < 1e-3",
        "hint": "raw.set_index(ts)['temp']"
      },
      {
        "label": "3단계 이웃한 시각 차이 중 가장 흔한 값 (Timedelta)",
        "expr": "gap == pd.Timedelta('5min')",
        "hint": "m.index.to_series().diff().mode()[0]"
      },
      {
        "label": "4단계 하루에 기록되는 횟수 (정수)",
        "expr": "per_day == 288",
        "hint": "int(pd.Timedelta('1D') / gap)"
      },
      {
        "label": "5단계 첫 기록부터 마지막 기록까지 지난 날 수 (정수)",
        "expr": "span_days == 78",
        "hint": "(m.index[-1] - m.index[0]).days"
      },
      {
        "label": "6단계 2013년 12월 기록 수",
        "expr": "n_dec == 8385",
        "hint": "len(m.loc['2013-12'])"
      }
    ]
  },
  {
    "id": "52-2",
    "unit": 52,
    "domain": "mfg",
    "title": "5분 간격 온도를 시간별 · 일별로 묶기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "s.resample('h').mean()",
        "시간별 평균"
      ],
      [
        "s.resample('D').max()",
        "일별 최댓값"
      ],
      [
        "s.idxmax()",
        "가장 큰 값의 인덱스"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>5분 간격 설비 온도 <code>m</code>을 더 큰 단위로 묶습니다. 온도는 쌓이는 양이 아니라 상태값이므로 합계가 아니라 평균 · 최대 · 최소를 씁니다.</p>\n<ol><li><code>hourly</code>: 시간별 평균 온도</li><li><code>n_hours</code>: hourly의 행 수</li><li><code>daily_max</code>: 일별 최고 온도</li><li><code>hot_day</code>: 최고 온도가 가장 높았던 날 (Timestamp)</li><li><code>daily_range</code>: 일별 온도 폭 (최고 − 최저)</li><li><code>wild_day</code>: 온도 폭이 가장 컸던 날 (Timestamp)</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\n\n# 1. 시간별 평균 온도\nhourly = \n# 2. hourly의 행 수\nn_hours = \n# 3. 일별 최고 온도\ndaily_max = \n# 4. 최고 온도가 가장 높았던 날 (Timestamp)\nhot_day = \n# 5. 일별 온도 폭 (최고 − 최저)\ndaily_range = \n# 6. 온도 폭이 가장 컸던 날 (Timestamp)\nwild_day = \n\nprint(n_hours, hot_day.date(), round(daily_max.max(), 1), wild_day.date(), round(daily_range.max(), 1))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\n\n# 1. 시간별 평균 온도\nhourly = m.resample('h').mean()\n# 2. hourly의 행 수\nn_hours = len(hourly)\n# 3. 일별 최고 온도\ndaily_max = m.resample('D').max()\n# 4. 최고 온도가 가장 높았던 날 (Timestamp)\nhot_day = daily_max.idxmax()\n# 5. 일별 온도 폭 (최고 − 최저)\ndaily_range = m.resample('D').max() - m.resample('D').min()\n# 6. 온도 폭이 가장 컸던 날 (Timestamp)\nwild_day = daily_range.idxmax()\n\nprint(n_hours, hot_day.date(), round(daily_max.max(), 1), wild_day.date(), round(daily_range.max(), 1))\n",
    "hints": [
      "m.resample('h').mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 시간별 평균 온도",
        "expr": "len(hourly) == 1891 and abs(float(hourly.sum()) - 162482.86069444445) < 1e-6 * max(1, abs(162482.86069444445))",
        "hint": "m.resample('h').mean()"
      },
      {
        "label": "2단계 hourly의 행 수",
        "expr": "n_hours == 1891",
        "hint": "len(hourly)"
      },
      {
        "label": "3단계 일별 최고 온도",
        "expr": "len(daily_max) == 80 and abs(float(daily_max.sum()) - 7635.88) < 1e-6 * max(1, abs(7635.88))",
        "hint": "m.resample('D').max()"
      },
      {
        "label": "4단계 최고 온도가 가장 높았던 날 (Timestamp)",
        "expr": "str(hot_day)[:10] == '2013-12-26'",
        "hint": "daily_max.idxmax()"
      },
      {
        "label": "5단계 일별 온도 폭 (최고 − 최저)",
        "expr": "len(daily_range) == 80 and abs(float(daily_range.sum()) - 1787.4300000000003) < 1e-6 * max(1, abs(1787.4300000000003))",
        "hint": "m.resample('D').max() - m.resample('D').min()"
      },
      {
        "label": "6단계 온도 폭이 가장 컸던 날 (Timestamp)",
        "expr": "str(wild_day)[:10] == '2013-12-16'",
        "hint": "daily_range.idxmax()"
      }
    ]
  },
  {
    "id": "52-3",
    "unit": 52,
    "domain": "general",
    "title": "항공 승객: 연 · 월 열로 날짜 인덱스 만들기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.to_datetime(문자열, format='%Y-%B')",
        "'1949-January' 꼴 읽기"
      ],
      [
        "s.asfreq('MS')",
        "월초 간격으로 맞추기"
      ],
      [
        "s.resample('YS').sum()",
        "연도별 합계"
      ]
    ],
    "origin": "시계열",
    "desc": "<p><code>flights.csv</code>에는 연도(<code>year</code>)와 영어 월 이름(<code>month</code>)이 따로 들어 있습니다. 둘을 합쳐 날짜 인덱스를 만들고 연도별로 묶어 봅니다.</p>\n<ol><li><code>date</code>: '1949-January' 꼴 문자열을 날짜로 바꾼 Series</li><li><code>y</code>: date를 인덱스로 한 passengers Series (월초 간격 'MS')</li><li><code>y_1955</code>: 1955년 12개월의 승객 수</li><li><code>yearly</code>: 연도별 승객 합계</li><li><code>growth</code>: 마지막 해 합계 ÷ 첫 해 합계</li></ol>",
    "starter": "import pandas as pd\n\ndf = pd.read_csv('flights.csv')\n\n# 1. '1949-January' 꼴 문자열을 날짜로 바꾼 Series\ndate = \n# 2. date를 인덱스로 한 passengers Series (월초 간격 'MS')\ny = \n# 3. 1955년 12개월의 승객 수\ny_1955 = \n# 4. 연도별 승객 합계\nyearly = \n# 5. 마지막 해 합계 ÷ 첫 해 합계\ngrowth = \n\nprint(y_1955.sum(), yearly.iloc[0], yearly.iloc[-1], round(growth, 2))\n",
    "solution": "import pandas as pd\n\ndf = pd.read_csv('flights.csv')\n\n# 1. '1949-January' 꼴 문자열을 날짜로 바꾼 Series\ndate = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\n# 2. date를 인덱스로 한 passengers Series (월초 간격 'MS')\ny = df.set_index(date)['passengers'].asfreq('MS')\n# 3. 1955년 12개월의 승객 수\ny_1955 = y.loc['1955']\n# 4. 연도별 승객 합계\nyearly = y.resample('YS').sum()\n# 5. 마지막 해 합계 ÷ 첫 해 합계\ngrowth = yearly.iloc[-1] / yearly.iloc[0]\n\nprint(y_1955.sum(), yearly.iloc[0], yearly.iloc[-1], round(growth, 2))\n",
    "hints": [
      "pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 '1949-January' 꼴 문자열을 날짜로 바꾼 Series",
        "expr": "str(date.dtype).startswith('datetime64') and str(date.iloc[1])[:10] == '1949-02-01'",
        "hint": "pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')"
      },
      {
        "label": "2단계 date를 인덱스로 한 passengers Series (월초 간격 'MS')",
        "expr": "len(y) == 144 and y.index.freqstr == 'MS' and int(y.sum()) == 40363",
        "hint": "df.set_index(date)['passengers'].asfreq('MS')"
      },
      {
        "label": "3단계 1955년 12개월의 승객 수",
        "expr": "len(y_1955) == 12 and abs(float(y_1955.sum()) - 3408.0) < 1e-6 * max(1, abs(3408.0))",
        "hint": "y.loc['1955']"
      },
      {
        "label": "4단계 연도별 승객 합계",
        "expr": "len(yearly) == 12 and abs(float(yearly.iloc[-1]) - 5714.0) < 1e-6 * max(1, abs(5714.0))",
        "hint": "y.resample('YS').sum()"
      },
      {
        "label": "5단계 마지막 해 합계 ÷ 첫 해 합계",
        "expr": "abs(growth - 3.7592105263157896) < 1e-6",
        "hint": "yearly.iloc[-1] / yearly.iloc[0]"
      }
    ]
  },
  {
    "id": "52-4",
    "unit": 52,
    "domain": "general",
    "title": "따릉이: 시간별 대여를 일별로 묶고 휴무일 처리하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "df.groupby('date')[열].sum()",
        "날짜별 합계"
      ],
      [
        "s.where(조건)",
        "조건에 안 맞는 값은 NaN으로"
      ],
      [
        "s.interpolate()",
        "앞뒤 값을 이어 채우기"
      ]
    ],
    "origin": "시계열",
    "desc": "<p><code>seoul_bike.csv</code>는 시간별 대여 수입니다. 대여 수는 쌓이는 양이므로 합계로 일별 시계열을 만듭니다. 운영하지 않은 날은 0으로 찍혀 있어 그대로 두면 급락처럼 보입니다.</p>\n<ol><li><code>day</code>: 날짜별 rented_bikes 합계 (일 간격 'D'로 맞춤)</li><li><code>n_zero</code>: 대여가 0대인 날 수</li><li><code>day_nan</code>: 0대인 날을 NaN으로 바꾼 Series</li><li><code>day_fill</code>: NaN을 앞뒤 값으로 이어 채운 Series</li><li><code>weekly</code>: day_fill의 주별 평균</li></ol>",
    "starter": "import pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\n\n# 1. 날짜별 rented_bikes 합계 (일 간격 'D'로 맞춤)\nday = \n# 2. 대여가 0대인 날 수\nn_zero = \n# 3. 0대인 날을 NaN으로 바꾼 Series\nday_nan = \n# 4. NaN을 앞뒤 값으로 이어 채운 Series\nday_fill = \n# 5. day_fill의 주별 평균\nweekly = \n\nprint(len(day), n_zero, round(day_fill.mean()), len(weekly))\n",
    "solution": "import pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\n\n# 1. 날짜별 rented_bikes 합계 (일 간격 'D'로 맞춤)\nday = bike.groupby('date')['rented_bikes'].sum().asfreq('D')\n# 2. 대여가 0대인 날 수\nn_zero = int((day == 0).sum())\n# 3. 0대인 날을 NaN으로 바꾼 Series\nday_nan = day.where(day > 0)\n# 4. NaN을 앞뒤 값으로 이어 채운 Series\nday_fill = day_nan.interpolate()\n# 5. day_fill의 주별 평균\nweekly = day_fill.resample('W').mean()\n\nprint(len(day), n_zero, round(day_fill.mean()), len(weekly))\n",
    "hints": [
      "bike.groupby('date')['rented_bikes'].sum().asfreq('D')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 날짜별 rented_bikes 합계 (일 간격 'D'로 맞춤)",
        "expr": "len(day) == 365 and abs(float(day.sum()) - 6172314.0) < 1e-6 * max(1, abs(6172314.0))",
        "hint": "bike.groupby('date')['rented_bikes'].sum().asfreq('D')"
      },
      {
        "label": "2단계 대여가 0대인 날 수",
        "expr": "n_zero == 12",
        "hint": "int((day == 0).sum())"
      },
      {
        "label": "3단계 0대인 날을 NaN으로 바꾼 Series",
        "expr": "len(day_nan) == 365 and int(day_nan.isna().sum()) == 12",
        "hint": "day.where(day > 0)"
      },
      {
        "label": "4단계 NaN을 앞뒤 값으로 이어 채운 Series",
        "expr": "len(day_fill) == 365 and abs(float(day_fill.sum()) - 6450986.5) < 1e-6 * max(1, abs(6450986.5))",
        "hint": "day_nan.interpolate()"
      },
      {
        "label": "5단계 day_fill의 주별 평균",
        "expr": "len(weekly) == 53 and abs(float(weekly.sum()) - 931110.5285714286) < 1e-6 * max(1, abs(931110.5285714286))",
        "hint": "day_fill.resample('W').mean()"
      }
    ]
  },
  {
    "id": "53-1",
    "unit": 53,
    "domain": "mfg",
    "title": "이동평균으로 설비 온도의 큰 흐름 보기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "s.rolling(24).mean()",
        "최근 24칸 평균"
      ],
      [
        "rolling(24, center=True)",
        "앞뒤로 고르게"
      ],
      [
        "s.isna().sum()",
        "빈칸 수"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>시간별 설비 온도 <code>hourly</code>에 24시간 이동평균을 씌워 큰 흐름을 뽑고, 원래 값에서 빼서 남는 흔들림의 크기를 봅니다.</p>\n<ol><li><code>ma24</code>: 최근 24시간 이동평균</li><li><code>n_nan</code>: ma24에서 값이 없는 칸 수</li><li><code>ma24c</code>: 가운데 맞춤(center=True) 24시간 이동평균</li><li><code>detr</code>: 원래 값 − ma24c (큰 흐름을 뺀 나머지)</li><li><code>ratio</code>: detr의 표준편차 ÷ hourly의 표준편차</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 최근 24시간 이동평균\nma24 = \n# 2. ma24에서 값이 없는 칸 수\nn_nan = \n# 3. 가운데 맞춤(center=True) 24시간 이동평균\nma24c = \n# 4. 원래 값 − ma24c (큰 흐름을 뺀 나머지)\ndetr = \n# 5. detr의 표준편차 ÷ hourly의 표준편차\nratio = \n\nprint(n_nan, round(ma24.iloc[-1], 2), round(detr.std(), 2), round(ratio, 3))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 최근 24시간 이동평균\nma24 = hourly.rolling(24).mean()\n# 2. ma24에서 값이 없는 칸 수\nn_nan = int(ma24.isna().sum())\n# 3. 가운데 맞춤(center=True) 24시간 이동평균\nma24c = hourly.rolling(24, center=True).mean()\n# 4. 원래 값 − ma24c (큰 흐름을 뺀 나머지)\ndetr = hourly - ma24c\n# 5. detr의 표준편차 ÷ hourly의 표준편차\nratio = detr.std() / hourly.std()\n\nprint(n_nan, round(ma24.iloc[-1], 2), round(detr.std(), 2), round(ratio, 3))\n",
    "hints": [
      "hourly.rolling(24).mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 최근 24시간 이동평균",
        "expr": "len(ma24) == 1891 and abs(float(ma24.sum()) - 160448.98674768518) < 1e-6 * max(1, abs(160448.98674768518))",
        "hint": "hourly.rolling(24).mean()"
      },
      {
        "label": "2단계 ma24에서 값이 없는 칸 수",
        "expr": "n_nan == 23",
        "hint": "int(ma24.isna().sum())"
      },
      {
        "label": "3단계 가운데 맞춤(center=True) 24시간 이동평균",
        "expr": "len(ma24c) == 1891 and abs(float(ma24c.dropna().iloc[0]) - 82.83403935185186) < 1e-6 * max(1, abs(82.83403935185186))",
        "hint": "hourly.rolling(24, center=True).mean()"
      },
      {
        "label": "4단계 원래 값 − ma24c (큰 흐름을 뺀 나머지)",
        "expr": "len(detr) == 1891 and abs(float(detr.abs().sum()) - 7179.275509259259) < 1e-6 * max(1, abs(7179.275509259259))",
        "hint": "hourly - ma24c"
      },
      {
        "label": "5단계 detr의 표준편차 ÷ hourly의 표준편차",
        "expr": "abs(ratio - 0.4443814271226074) < 1e-6",
        "hint": "detr.std() / hourly.std()"
      }
    ]
  },
  {
    "id": "53-2",
    "unit": 53,
    "domain": "mfg",
    "title": "설비 온도에 하루 주기가 있을까: 시각별 평균으로 확인",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "s.groupby(s.index.hour).mean()",
        "시각(0~23시)별 평균"
      ],
      [
        "s.index.dayofweek",
        "요일 (월 0 ~ 일 6)"
      ],
      [
        "폭 ÷ 표준편차",
        "주기가 얼마나 뚜렷한지"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>분해하기 전에 주기가 정말 있는지부터 봅니다. 시각별 · 요일별 평균의 폭이 전체 흔들림(표준편차)에 비해 작다면, 그 주기는 약한 것입니다.</p>\n<ol><li><code>by_hour</code>: 시각(0~23시)별 평균 온도</li><li><code>span_hour</code>: by_hour의 최댓값 − 최솟값</li><li><code>by_dow</code>: 요일별 평균 온도</li><li><code>span_dow</code>: by_dow의 최댓값 − 최솟값</li><li><code>strength</code>: span_hour ÷ hourly의 표준편차</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 시각(0~23시)별 평균 온도\nby_hour = \n# 2. by_hour의 최댓값 − 최솟값\nspan_hour = \n# 3. 요일별 평균 온도\nby_dow = \n# 4. by_dow의 최댓값 − 최솟값\nspan_dow = \n# 5. span_hour ÷ hourly의 표준편차\nstrength = \n\nprint(round(span_hour, 2), round(span_dow, 2), round(hourly.std(), 2), round(strength, 2))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 시각(0~23시)별 평균 온도\nby_hour = hourly.groupby(hourly.index.hour).mean()\n# 2. by_hour의 최댓값 − 최솟값\nspan_hour = by_hour.max() - by_hour.min()\n# 3. 요일별 평균 온도\nby_dow = hourly.groupby(hourly.index.dayofweek).mean()\n# 4. by_dow의 최댓값 − 최솟값\nspan_dow = by_dow.max() - by_dow.min()\n# 5. span_hour ÷ hourly의 표준편차\nstrength = span_hour / hourly.std()\n\nprint(round(span_hour, 2), round(span_dow, 2), round(hourly.std(), 2), round(strength, 2))\n",
    "hints": [
      "hourly.groupby(hourly.index.hour).mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 시각(0~23시)별 평균 온도",
        "expr": "len(by_hour) == 24 and abs(float(by_hour.sum()) - 2062.1617593043384) < 1e-6 * max(1, abs(2062.1617593043384))",
        "hint": "hourly.groupby(hourly.index.hour).mean()"
      },
      {
        "label": "2단계 by_hour의 최댓값 − 최솟값",
        "expr": "abs(span_hour - 4.021919831223627) < 1e-6",
        "hint": "by_hour.max() - by_hour.min()"
      },
      {
        "label": "3단계 요일별 평균 온도",
        "expr": "len(by_dow) == 7 and abs(float(by_dow.sum()) - 601.447885857429) < 1e-6 * max(1, abs(601.447885857429))",
        "hint": "hourly.groupby(hourly.index.dayofweek).mean()"
      },
      {
        "label": "4단계 by_dow의 최댓값 − 최솟값",
        "expr": "abs(span_dow - 8.541658826764163) < 1e-6",
        "hint": "by_dow.max() - by_dow.min()"
      },
      {
        "label": "5단계 span_hour ÷ hourly의 표준편차",
        "expr": "abs(strength - 0.29402742645937013) < 1e-6",
        "hint": "span_hour / hourly.std()"
      }
    ]
  },
  {
    "id": "53-3",
    "unit": 53,
    "domain": "general",
    "title": "항공 승객: 곱셈형 분해로 성수기 찾기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "seasonal_decompose(y, model='multiplicative', period=12)",
        "추세 × 계절 × 잔차"
      ],
      [
        "res.seasonal",
        "계절 지수 (1이면 평소)"
      ],
      [
        "y / res.seasonal",
        "계절 조정"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>월별 항공 승객 <code>y</code>는 해가 갈수록 물결이 커지는 곱셈형입니다. 분해해서 어느 달이 평소의 몇 배인지 보고, 계절을 걷어 낸 값을 만듭니다.</p>\n<ol><li><code>res</code>: 곱셈형, 주기 12로 분해한 결과</li><li><code>season</code>: 월(1~12)별 계절 지수</li><li><code>peak_month</code>: 계절 지수가 가장 큰 달 (정수)</li><li><code>n_trend_nan</code>: 추세에서 값이 없는 칸 수</li><li><code>adj</code>: 계절 조정 값 (y ÷ 계절 지수)</li></ol>",
    "starter": "import pandas as pd\nfrom statsmodels.tsa.seasonal import seasonal_decompose\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\n\n# 1. 곱셈형, 주기 12로 분해한 결과\nres = \n# 2. 월(1~12)별 계절 지수\nseason = \n# 3. 계절 지수가 가장 큰 달 (정수)\npeak_month = \n# 4. 추세에서 값이 없는 칸 수\nn_trend_nan = \n# 5. 계절 조정 값 (y ÷ 계절 지수)\nadj = \n\nprint(peak_month, round(season.max(), 3), round(season.min(), 3), n_trend_nan, round(adj.iloc[-1], 1))\n",
    "solution": "import pandas as pd\nfrom statsmodels.tsa.seasonal import seasonal_decompose\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\n\n# 1. 곱셈형, 주기 12로 분해한 결과\nres = seasonal_decompose(y, model='multiplicative', period=12)\n# 2. 월(1~12)별 계절 지수\nseason = res.seasonal.groupby(res.seasonal.index.month).mean()\n# 3. 계절 지수가 가장 큰 달 (정수)\npeak_month = int(season.idxmax())\n# 4. 추세에서 값이 없는 칸 수\nn_trend_nan = int(res.trend.isna().sum())\n# 5. 계절 조정 값 (y ÷ 계절 지수)\nadj = y / res.seasonal\n\nprint(peak_month, round(season.max(), 3), round(season.min(), 3), n_trend_nan, round(adj.iloc[-1], 1))\n",
    "hints": [
      "seasonal_decompose(y, model='multiplicative', period=12)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 곱셈형, 주기 12로 분해한 결과",
        "expr": "hasattr(res, 'seasonal')",
        "hint": "seasonal_decompose(y, model='multiplicative', period=12)"
      },
      {
        "label": "2단계 월(1~12)별 계절 지수",
        "expr": "len(season) == 12 and abs(float(season.iloc[6]) - 1.2265555429312014) < 1e-4 * max(1, abs(1.2265555429312014))",
        "hint": "res.seasonal.groupby(res.seasonal.index.month).mean()"
      },
      {
        "label": "3단계 계절 지수가 가장 큰 달 (정수)",
        "expr": "peak_month == 7",
        "hint": "int(season.idxmax())"
      },
      {
        "label": "4단계 추세에서 값이 없는 칸 수",
        "expr": "n_trend_nan == 12",
        "hint": "int(res.trend.isna().sum())"
      },
      {
        "label": "5단계 계절 조정 값 (y ÷ 계절 지수)",
        "expr": "len(adj) == 144 and abs(float(adj.sum()) - 40332.16823543277) < 1e-4 * max(1, abs(40332.16823543277))",
        "hint": "y / res.seasonal"
      }
    ]
  },
  {
    "id": "53-4",
    "unit": 53,
    "domain": "general",
    "title": "CO2 농도: STL로 추세와 계절 나누기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "STL(y, period=12).fit()",
        "추세 · 계절 · 잔차"
      ],
      [
        "res.trend / res.seasonal / res.resid",
        "성분 꺼내기"
      ],
      [
        "1 − Var(잔차) ÷ Var(계절 + 잔차)",
        "계절 강도"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>하와이 마우나로아의 월평균 CO2 농도 <code>co2m</code>입니다. STL로 나눠서 얼마나 올랐는지, 한 해 안에서 얼마나 오르내리는지, 계절이 얼마나 뚜렷한지 숫자로 냅니다.</p>\n<ol><li><code>res</code>: 주기 12로 STL 분해한 결과</li><li><code>rise</code>: 추세의 마지막 값 − 첫 값 (ppm)</li><li><code>amp</code>: 계절 성분의 최댓값 − 최솟값 (ppm)</li><li><code>resid_std</code>: 잔차의 표준편차</li><li><code>strength</code>: 계절 강도: 1 − 잔차 분산 ÷ (계절 + 잔차)의 분산</li></ol>",
    "starter": "import pandas as pd\nfrom statsmodels.tsa.seasonal import STL\n\nco2 = pd.read_csv('co2.csv', parse_dates=['date']).set_index('date')['co2']\nco2m = co2.resample('MS').mean().interpolate()   # 월평균 CO2 농도(ppm)\n\n# 1. 주기 12로 STL 분해한 결과\nres = \n# 2. 추세의 마지막 값 − 첫 값 (ppm)\nrise = \n# 3. 계절 성분의 최댓값 − 최솟값 (ppm)\namp = \n# 4. 잔차의 표준편차\nresid_std = \n# 5. 계절 강도: 1 − 잔차 분산 ÷ (계절 + 잔차)의 분산\nstrength = \n\nprint(round(rise, 1), round(amp, 2), round(resid_std, 3), round(strength, 3))\n",
    "solution": "import pandas as pd\nfrom statsmodels.tsa.seasonal import STL\n\nco2 = pd.read_csv('co2.csv', parse_dates=['date']).set_index('date')['co2']\nco2m = co2.resample('MS').mean().interpolate()   # 월평균 CO2 농도(ppm)\n\n# 1. 주기 12로 STL 분해한 결과\nres = STL(co2m, period=12).fit()\n# 2. 추세의 마지막 값 − 첫 값 (ppm)\nrise = res.trend.iloc[-1] - res.trend.iloc[0]\n# 3. 계절 성분의 최댓값 − 최솟값 (ppm)\namp = res.seasonal.max() - res.seasonal.min()\n# 4. 잔차의 표준편차\nresid_std = res.resid.std()\n# 5. 계절 강도: 1 − 잔차 분산 ÷ (계절 + 잔차)의 분산\nstrength = 1 - res.resid.var() / (res.seasonal + res.resid).var()\n\nprint(round(rise, 1), round(amp, 2), round(resid_std, 3), round(strength, 3))\n",
    "hints": [
      "STL(co2m, period=12).fit()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 주기 12로 STL 분해한 결과",
        "expr": "hasattr(res, 'trend')",
        "hint": "STL(co2m, period=12).fit()"
      },
      {
        "label": "2단계 추세의 마지막 값 − 첫 값 (ppm)",
        "expr": "abs(rise - 56.35667591203321) < 1e-3 * max(1, abs(56.35667591203321))",
        "hint": "res.trend.iloc[-1] - res.trend.iloc[0]"
      },
      {
        "label": "3단계 계절 성분의 최댓값 − 최솟값 (ppm)",
        "expr": "abs(amp - 6.953870475297247) < 1e-3 * max(1, abs(6.953870475297247))",
        "hint": "res.seasonal.max() - res.seasonal.min()"
      },
      {
        "label": "4단계 잔차의 표준편차",
        "expr": "abs(resid_std - 0.19493834430445153) < 1e-3 * max(1, abs(0.19493834430445153))",
        "hint": "res.resid.std()"
      },
      {
        "label": "5단계 계절 강도: 1 − 잔차 분산 ÷ (계절 + 잔차)의 분산",
        "expr": "abs(strength - 0.990842589155808) < 1e-3 * max(1, abs(0.990842589155808))",
        "hint": "1 - res.resid.var() / (res.seasonal + res.resid).var()"
      }
    ]
  },
  {
    "id": "54-1",
    "unit": 54,
    "domain": "mfg",
    "title": "설비 온도: shift로 자기상관 직접 구하기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "s.shift(k)",
        "k칸 뒤로 밀기"
      ],
      [
        "s.corr(다른 Series)",
        "상관계수"
      ],
      [
        "s.autocorr(k)",
        "래그 k 자기상관"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>시간별 설비 온도 <code>hourly</code>가 한 시간 전, 하루 전의 자신과 얼마나 닮았는지 구합니다. 한 시간 사이의 변화량(차분)도 같은 방법으로 봅니다.</p>\n<ol><li><code>lag1</code>: 한 칸 민 시계열</li><li><code>r1</code>: hourly와 lag1의 상관계수 (래그 1 자기상관)</li><li><code>r24</code>: 래그 24 자기상관</li><li><code>d</code>: 한 시간 전과의 차이 (첫 NaN은 뺌)</li><li><code>r1_d</code>: d의 래그 1 자기상관</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 한 칸 민 시계열\nlag1 = \n# 2. hourly와 lag1의 상관계수 (래그 1 자기상관)\nr1 = \n# 3. 래그 24 자기상관\nr24 = \n# 4. 한 시간 전과의 차이 (첫 NaN은 뺌)\nd = \n# 5. d의 래그 1 자기상관\nr1_d = \n\nprint(round(r1, 3), round(r24, 3), round(r1_d, 3))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 한 칸 민 시계열\nlag1 = hourly.shift(1)\n# 2. hourly와 lag1의 상관계수 (래그 1 자기상관)\nr1 = hourly.corr(lag1)\n# 3. 래그 24 자기상관\nr24 = hourly.autocorr(24)\n# 4. 한 시간 전과의 차이 (첫 NaN은 뺌)\nd = hourly.diff().dropna()\n# 5. d의 래그 1 자기상관\nr1_d = d.autocorr(1)\n\nprint(round(r1, 3), round(r24, 3), round(r1_d, 3))\n",
    "hints": [
      "hourly.shift(1)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 한 칸 민 시계열",
        "expr": "len(lag1) == 1891 and abs(float(lag1.sum()) - 162385.28569444446) < 1e-6 * max(1, abs(162385.28569444446))",
        "hint": "hourly.shift(1)"
      },
      {
        "label": "2단계 hourly와 lag1의 상관계수 (래그 1 자기상관)",
        "expr": "abs(r1 - 0.9679820997607593) < 1e-6",
        "hint": "hourly.corr(lag1)"
      },
      {
        "label": "3단계 래그 24 자기상관",
        "expr": "abs(r24 - 0.30740966150530163) < 1e-6",
        "hint": "hourly.autocorr(24)"
      },
      {
        "label": "4단계 한 시간 전과의 차이 (첫 NaN은 뺌)",
        "expr": "len(d) == 1890 and abs(float(d.abs().sum()) - 3501.672222222223) < 1e-6 * max(1, abs(3501.672222222223))",
        "hint": "hourly.diff().dropna()"
      },
      {
        "label": "5단계 d의 래그 1 자기상관",
        "expr": "abs(r1_d - 0.3641707476764247) < 1e-6",
        "hint": "d.autocorr(1)"
      }
    ]
  },
  {
    "id": "54-2",
    "unit": 54,
    "domain": "mfg",
    "title": "온도 변화량의 ACF · PACF와 Ljung-Box 검정",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "acf(s, nlags=24)",
        "래그 0~24 자기상관 배열"
      ],
      [
        "1.96 / np.sqrt(n)",
        "우연의 범위"
      ],
      [
        "acorr_ljungbox(s, lags=[24])",
        "자기상관이 남았는지 검정"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>한 시간 사이의 온도 변화량 <code>d</code>에 아직 패턴이 남아 있는지 봅니다. 기준선을 넘는 래그를 찾고, Ljung-Box 검정으로 백색잡음인지 판정합니다.</p>\n<ol><li><code>a</code>: d의 ACF (래그 0~24)</li><li><code>p</code>: d의 PACF (래그 0~24)</li><li><code>bound</code>: 기준선 1.96 ÷ √n</li><li><code>sig</code>: ACF가 기준선을 넘는 래그(1~24) 리스트</li><li><code>lb_p</code>: 래그 24까지의 Ljung-Box p-값</li><li><code>is_white</code>: 백색잡음으로 볼 수 있는지 (p-값 > 0.05, True/False)</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom statsmodels.stats.diagnostic import acorr_ljungbox\nfrom statsmodels.tsa.stattools import acf, pacf\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nd = hourly.diff().dropna()   # 한 시간 사이의 변화량\n\n# 1. d의 ACF (래그 0~24)\na = \n# 2. d의 PACF (래그 0~24)\np = \n# 3. 기준선 1.96 ÷ √n\nbound = \n# 4. ACF가 기준선을 넘는 래그(1~24) 리스트\nsig = \n# 5. 래그 24까지의 Ljung-Box p-값\nlb_p = \n# 6. 백색잡음으로 볼 수 있는지 (p-값 > 0.05, True/False)\nis_white = \n\nprint(round(float(a[1]), 3), round(float(p[2]), 3), round(float(bound), 3), sig, is_white)\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom statsmodels.stats.diagnostic import acorr_ljungbox\nfrom statsmodels.tsa.stattools import acf, pacf\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nd = hourly.diff().dropna()   # 한 시간 사이의 변화량\n\n# 1. d의 ACF (래그 0~24)\na = acf(d, nlags=24)\n# 2. d의 PACF (래그 0~24)\np = pacf(d, nlags=24)\n# 3. 기준선 1.96 ÷ √n\nbound = 1.96 / np.sqrt(len(d))\n# 4. ACF가 기준선을 넘는 래그(1~24) 리스트\nsig = [k for k in range(1, 25) if abs(a[k]) > bound]\n# 5. 래그 24까지의 Ljung-Box p-값\nlb_p = acorr_ljungbox(d, lags=[24])['lb_pvalue'].iloc[0]\n# 6. 백색잡음으로 볼 수 있는지 (p-값 > 0.05, True/False)\nis_white = bool(lb_p > 0.05)\n\nprint(round(float(a[1]), 3), round(float(p[2]), 3), round(float(bound), 3), sig, is_white)\n",
    "hints": [
      "acf(d, nlags=24)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 d의 ACF (래그 0~24)",
        "expr": "len(a) == 25 and abs(float(a.__getitem__(1)) - 0.3641124249896318) < 1e-6 * max(1, abs(0.3641124249896318))",
        "hint": "acf(d, nlags=24)"
      },
      {
        "label": "2단계 d의 PACF (래그 0~24)",
        "expr": "len(p) == 25 and abs(float(p.__getitem__(2)) - -0.18207147865774553) < 1e-3 * max(1, abs(-0.18207147865774553))",
        "hint": "pacf(d, nlags=24)"
      },
      {
        "label": "3단계 기준선 1.96 ÷ √n",
        "expr": "abs(bound - 0.04508428321036714) < 1e-6",
        "hint": "1.96 / np.sqrt(len(d))"
      },
      {
        "label": "4단계 ACF가 기준선을 넘는 래그(1~24) 리스트",
        "expr": "list(sig) == [1, 3, 4, 5, 6]",
        "hint": "[k for k in range(1, 25) if abs(a[k]) > bound]"
      },
      {
        "label": "5단계 래그 24까지의 Ljung-Box p-값",
        "expr": "abs(lb_p - 1.811274891388647e-53) < 1e-6",
        "hint": "acorr_ljungbox(d, lags=[24])['lb_pvalue'].iloc[0]"
      },
      {
        "label": "6단계 백색잡음으로 볼 수 있는지 (p-값 > 0.05, True/False)",
        "expr": "is_white == False",
        "hint": "bool(lb_p > 0.05)"
      }
    ]
  },
  {
    "id": "54-3",
    "unit": 54,
    "domain": "general",
    "title": "항공 승객: 계절 래그 찾기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "acf(s, nlags=24)",
        "래그 0~24 자기상관 배열"
      ],
      [
        "s.diff().dropna()",
        "추세를 걷어 낸 변화량"
      ],
      [
        "np.argmax(배열)",
        "가장 큰 값의 위치"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>추세가 강하면 ACF가 모든 래그에서 높게 나와 계절이 묻힙니다. 차분으로 추세를 걷어 낸 뒤 어느 래그가 가장 닮았는지 찾습니다.</p>\n<ol><li><code>a</code>: y의 ACF (래그 0~24)</li><li><code>n_high</code>: a에서 0.5보다 큰 래그 수 (래그 0 제외)</li><li><code>d</code>: y의 1차 차분 (첫 NaN은 뺌)</li><li><code>ad</code>: d의 ACF (래그 0~24)</li><li><code>top_lag</code>: ad에서 자기상관이 가장 큰 래그 (래그 0 제외, 정수)</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom statsmodels.tsa.stattools import acf\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\n\n# 1. y의 ACF (래그 0~24)\na = \n# 2. a에서 0.5보다 큰 래그 수 (래그 0 제외)\nn_high = \n# 3. y의 1차 차분 (첫 NaN은 뺌)\nd = \n# 4. d의 ACF (래그 0~24)\nad = \n# 5. ad에서 자기상관이 가장 큰 래그 (래그 0 제외, 정수)\ntop_lag = \n\nprint(round(float(a[12]), 3), n_high, round(float(ad[12]), 3), top_lag)\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom statsmodels.tsa.stattools import acf\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\n\n# 1. y의 ACF (래그 0~24)\na = acf(y, nlags=24)\n# 2. a에서 0.5보다 큰 래그 수 (래그 0 제외)\nn_high = int((a[1:] > 0.5).sum())\n# 3. y의 1차 차분 (첫 NaN은 뺌)\nd = y.diff().dropna()\n# 4. d의 ACF (래그 0~24)\nad = acf(d, nlags=24)\n# 5. ad에서 자기상관이 가장 큰 래그 (래그 0 제외, 정수)\ntop_lag = int(np.argmax(ad[1:]) + 1)\n\nprint(round(float(a[12]), 3), n_high, round(float(ad[12]), 3), top_lag)\n",
    "hints": [
      "acf(y, nlags=24)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 y의 ACF (래그 0~24)",
        "expr": "len(a) == 25 and abs(float(a.__getitem__(12)) - 0.7603950422625557) < 1e-6 * max(1, abs(0.7603950422625557))",
        "hint": "acf(y, nlags=24)"
      },
      {
        "label": "2단계 a에서 0.5보다 큰 래그 수 (래그 0 제외)",
        "expr": "n_high == 18",
        "hint": "int((a[1:] > 0.5).sum())"
      },
      {
        "label": "3단계 y의 1차 차분 (첫 NaN은 뺌)",
        "expr": "len(d) == 143 and abs(float(d.sum()) - 320.0) < 1e-6 * max(1, abs(320.0))",
        "hint": "y.diff().dropna()"
      },
      {
        "label": "4단계 d의 ACF (래그 0~24)",
        "expr": "len(ad) == 25 and abs(float(ad.__getitem__(12)) - 0.8291778597573045) < 1e-6 * max(1, abs(0.8291778597573045))",
        "hint": "acf(d, nlags=24)"
      },
      {
        "label": "5단계 ad에서 자기상관이 가장 큰 래그 (래그 0 제외, 정수)",
        "expr": "top_lag == 12",
        "hint": "int(np.argmax(ad[1:]) + 1)"
      }
    ]
  },
  {
    "id": "54-4",
    "unit": 54,
    "domain": "general",
    "title": "따릉이: 일주일 전과 닮은 것은 직접 영향일까",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "acf(s, nlags=14)[7]",
        "래그 7 자기상관"
      ],
      [
        "pacf(s, nlags=14)[7]",
        "중간 래그의 몫을 뺀 직접 영향"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>일별 따릉이 대여 수 <code>day</code>는 일주일 전 값과도 꽤 닮았습니다. 이것이 요일 효과인지, 어제 · 그제를 거쳐 건너온 영향인지 PACF로 가려냅니다.</p>\n<ol><li><code>a</code>: day의 ACF (래그 0~14)</li><li><code>r7</code>: 래그 7 자기상관</li><li><code>p</code>: day의 PACF (래그 0~14)</li><li><code>p7</code>: 래그 7 편자기상관</li><li><code>direct</code>: 래그 7의 직접 영향이 뚜렷한지 (|p7| > 0.2, True/False)</li></ol>",
    "starter": "import pandas as pd\nfrom statsmodels.tsa.stattools import acf, pacf\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date')['rented_bikes'].sum().asfreq('D')\nday = day.where(day > 0).interpolate()   # 휴무일(0대)은 앞뒤 값으로 채움\n\n# 1. day의 ACF (래그 0~14)\na = \n# 2. 래그 7 자기상관\nr7 = \n# 3. day의 PACF (래그 0~14)\np = \n# 4. 래그 7 편자기상관\np7 = \n# 5. 래그 7의 직접 영향이 뚜렷한지 (|p7| > 0.2, True/False)\ndirect = \n\nprint(round(float(a[1]), 2), round(float(r7), 2), round(float(p[1]), 2), round(float(p7), 2), direct)\n",
    "solution": "import pandas as pd\nfrom statsmodels.tsa.stattools import acf, pacf\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date')['rented_bikes'].sum().asfreq('D')\nday = day.where(day > 0).interpolate()   # 휴무일(0대)은 앞뒤 값으로 채움\n\n# 1. day의 ACF (래그 0~14)\na = acf(day, nlags=14)\n# 2. 래그 7 자기상관\nr7 = a[7]\n# 3. day의 PACF (래그 0~14)\np = pacf(day, nlags=14)\n# 4. 래그 7 편자기상관\np7 = p[7]\n# 5. 래그 7의 직접 영향이 뚜렷한지 (|p7| > 0.2, True/False)\ndirect = bool(abs(p7) > 0.2)\n\nprint(round(float(a[1]), 2), round(float(r7), 2), round(float(p[1]), 2), round(float(p7), 2), direct)\n",
    "hints": [
      "acf(day, nlags=14)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 day의 ACF (래그 0~14)",
        "expr": "len(a) == 15 and abs(float(a.__getitem__(1)) - 0.799560840746178) < 1e-6 * max(1, abs(0.799560840746178))",
        "hint": "acf(day, nlags=14)"
      },
      {
        "label": "2단계 래그 7 자기상관",
        "expr": "abs(r7 - 0.650446238001272) < 1e-6",
        "hint": "a[7]"
      },
      {
        "label": "3단계 day의 PACF (래그 0~14)",
        "expr": "len(p) == 15 and abs(float(p.__getitem__(1)) - 0.8017574364625135) < 1e-3 * max(1, abs(0.8017574364625135))",
        "hint": "pacf(day, nlags=14)"
      },
      {
        "label": "4단계 래그 7 편자기상관",
        "expr": "abs(p7 - 0.036754442806128) < 1e-3 * max(1, abs(0.036754442806128))",
        "hint": "p[7]"
      },
      {
        "label": "5단계 래그 7의 직접 영향이 뚜렷한지 (|p7| > 0.2, True/False)",
        "expr": "direct == False",
        "hint": "bool(abs(p7) > 0.2)"
      }
    ]
  },
  {
    "id": "55-1",
    "unit": 55,
    "domain": "mfg",
    "title": "설비 온도: ADF와 KPSS로 정상성 판정하기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "adfuller(s)[1]",
        "ADF p-값 (작으면 정상)"
      ],
      [
        "kpss(s, nlags='auto')[1]",
        "KPSS p-값 (작으면 비정상)"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>시간별 설비 온도 <code>hourly</code>가 정상 시계열인지 두 검정으로 확인합니다. 두 검정은 출발 가정이 반대라서, 둘 다 '정상' 쪽을 가리킬 때 가장 믿을 수 있습니다.</p>\n<ol><li><code>p_adf</code>: ADF 검정의 p-값</li><li><code>adf_ok</code>: ADF가 정상으로 판정하는지 (p < 0.05, True/False)</li><li><code>p_kpss</code>: KPSS 검정의 p-값 (nlags='auto')</li><li><code>kpss_ok</code>: KPSS가 정상으로 보는지 (p > 0.05, True/False)</li><li><code>stationary</code>: 두 검정이 모두 정상 쪽인지 (True/False)</li></ol>",
    "starter": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.stattools import adfuller, kpss\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')   # 검정 함수의 안내 경고 끄기\n\n# 1. ADF 검정의 p-값\np_adf = \n# 2. ADF가 정상으로 판정하는지 (p < 0.05, True/False)\nadf_ok = \n# 3. KPSS 검정의 p-값 (nlags='auto')\np_kpss = \n# 4. KPSS가 정상으로 보는지 (p > 0.05, True/False)\nkpss_ok = \n# 5. 두 검정이 모두 정상 쪽인지 (True/False)\nstationary = \n\nprint(round(float(p_adf), 4), adf_ok, round(float(p_kpss), 3), kpss_ok, stationary)\n",
    "solution": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.stattools import adfuller, kpss\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')   # 검정 함수의 안내 경고 끄기\n\n# 1. ADF 검정의 p-값\np_adf = adfuller(hourly)[1]\n# 2. ADF가 정상으로 판정하는지 (p < 0.05, True/False)\nadf_ok = bool(p_adf < 0.05)\n# 3. KPSS 검정의 p-값 (nlags='auto')\np_kpss = kpss(hourly, nlags='auto')[1]\n# 4. KPSS가 정상으로 보는지 (p > 0.05, True/False)\nkpss_ok = bool(p_kpss > 0.05)\n# 5. 두 검정이 모두 정상 쪽인지 (True/False)\nstationary = adf_ok and kpss_ok\n\nprint(round(float(p_adf), 4), adf_ok, round(float(p_kpss), 3), kpss_ok, stationary)\n",
    "hints": [
      "adfuller(hourly)[1]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 ADF 검정의 p-값",
        "expr": "abs(p_adf - 4.67704277223993e-08) < 1e-3",
        "hint": "adfuller(hourly)[1]"
      },
      {
        "label": "2단계 ADF가 정상으로 판정하는지 (p < 0.05, True/False)",
        "expr": "adf_ok == True",
        "hint": "bool(p_adf < 0.05)"
      },
      {
        "label": "3단계 KPSS 검정의 p-값 (nlags='auto')",
        "expr": "abs(p_kpss - 0.1) < 1e-3",
        "hint": "kpss(hourly, nlags='auto')[1]"
      },
      {
        "label": "4단계 KPSS가 정상으로 보는지 (p > 0.05, True/False)",
        "expr": "kpss_ok == True",
        "hint": "bool(p_kpss > 0.05)"
      },
      {
        "label": "5단계 두 검정이 모두 정상 쪽인지 (True/False)",
        "expr": "stationary == True",
        "hint": "adf_ok and kpss_ok"
      }
    ]
  },
  {
    "id": "55-2",
    "unit": 55,
    "domain": "mfg",
    "title": "앞 절반과 뒤 절반: 평균과 흔들림이 같은가",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "s.iloc[:n] / s.iloc[n:]",
        "앞뒤로 나누기"
      ],
      [
        "s.rolling(168).std()",
        "일주일 창의 흔들림"
      ],
      [
        "s.diff()",
        "한 칸 전과의 차이"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>검정만 믿지 말고 눈으로도 확인합니다. 시간별 설비 온도를 앞뒤 절반으로 나눠 평균과 표준편차를 비교하고, 일주일 창으로 흔들림이 얼마나 달라지는지 봅니다.</p>\n<ol><li><code>mean_gap</code>: 뒤 절반 평균 − 앞 절반 평균</li><li><code>std_ratio</code>: 뒤 절반 표준편차 ÷ 앞 절반 표준편차</li><li><code>roll_std</code>: 168시간(일주일) 이동 표준편차</li><li><code>calm_wild</code>: roll_std의 최댓값 ÷ 최솟값</li><li><code>d_ratio</code>: 차분(diff)한 값의 뒤 절반 표준편차 ÷ 앞 절반 표준편차</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nn = len(hourly) // 2\nfirst, second = hourly.iloc[:n], hourly.iloc[n:]\n\n# 1. 뒤 절반 평균 − 앞 절반 평균\nmean_gap = \n# 2. 뒤 절반 표준편차 ÷ 앞 절반 표준편차\nstd_ratio = \n# 3. 168시간(일주일) 이동 표준편차\nroll_std = \n# 4. roll_std의 최댓값 ÷ 최솟값\ncalm_wild = \n# 5. 차분(diff)한 값의 뒤 절반 표준편차 ÷ 앞 절반 표준편차\nd_ratio = \n\nprint(round(mean_gap, 2), round(std_ratio, 2), round(calm_wild, 1), round(d_ratio, 2))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nn = len(hourly) // 2\nfirst, second = hourly.iloc[:n], hourly.iloc[n:]\n\n# 1. 뒤 절반 평균 − 앞 절반 평균\nmean_gap = second.mean() - first.mean()\n# 2. 뒤 절반 표준편차 ÷ 앞 절반 표준편차\nstd_ratio = second.std() / first.std()\n# 3. 168시간(일주일) 이동 표준편차\nroll_std = hourly.rolling(168).std()\n# 4. roll_std의 최댓값 ÷ 최솟값\ncalm_wild = roll_std.max() / roll_std.min()\n# 5. 차분(diff)한 값의 뒤 절반 표준편차 ÷ 앞 절반 표준편차\nd_ratio = second.diff().std() / first.diff().std()\n\nprint(round(mean_gap, 2), round(std_ratio, 2), round(calm_wild, 1), round(d_ratio, 2))\n",
    "hints": [
      "second.mean() - first.mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 뒤 절반 평균 − 앞 절반 평균",
        "expr": "abs(mean_gap - -2.4838275933321228) < 1e-6",
        "hint": "second.mean() - first.mean()"
      },
      {
        "label": "2단계 뒤 절반 표준편차 ÷ 앞 절반 표준편차",
        "expr": "abs(std_ratio - 1.3212893713185148) < 1e-6",
        "hint": "second.std() / first.std()"
      },
      {
        "label": "3단계 168시간(일주일) 이동 표준편차",
        "expr": "len(roll_std) == 1891 and abs(float(roll_std.sum()) - 19678.753723656802) < 1e-6 * max(1, abs(19678.753723656802))",
        "hint": "hourly.rolling(168).std()"
      },
      {
        "label": "4단계 roll_std의 최댓값 ÷ 최솟값",
        "expr": "abs(calm_wild - 6.839347617757006) < 1e-6",
        "hint": "roll_std.max() / roll_std.min()"
      },
      {
        "label": "5단계 차분(diff)한 값의 뒤 절반 표준편차 ÷ 앞 절반 표준편차",
        "expr": "abs(d_ratio - 1.0565492094795328) < 1e-6",
        "hint": "second.diff().std() / first.diff().std()"
      }
    ]
  },
  {
    "id": "55-3",
    "unit": 55,
    "domain": "general",
    "title": "항공 승객: 로그와 차분으로 정상 시계열 만들기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "np.log(y)",
        "흔들림 폭 고르게"
      ],
      [
        "s.diff(12)",
        "계절 차분"
      ],
      [
        "adfuller(s)[1]",
        "ADF p-값"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>월별 항공 승객 <code>y</code>는 추세도, 계절도, 커지는 물결도 있습니다. 로그 → 계절 차분 → 1차 차분 순서로 손질하며 ADF p-값이 어떻게 바뀌는지 봅니다.</p>\n<ol><li><code>ly</code>: y에 로그를 씌운 Series</li><li><code>p0</code>: ly의 ADF p-값</li><li><code>sd</code>: ly의 계절 차분 (12칸, NaN은 뺌)</li><li><code>dd</code>: sd의 1차 차분 (NaN은 뺌)</li><li><code>p2</code>: dd의 ADF p-값</li><li><code>n_lost</code>: 차분으로 잃은 행 수 (y 길이 − dd 길이)</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom statsmodels.tsa.stattools import adfuller\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\n\n# 1. y에 로그를 씌운 Series\nly = \n# 2. ly의 ADF p-값\np0 = \n# 3. ly의 계절 차분 (12칸, NaN은 뺌)\nsd = \n# 4. sd의 1차 차분 (NaN은 뺌)\ndd = \n# 5. dd의 ADF p-값\np2 = \n# 6. 차분으로 잃은 행 수 (y 길이 − dd 길이)\nn_lost = \n\nprint(round(float(p0), 3), round(float(p2), 4), n_lost)\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom statsmodels.tsa.stattools import adfuller\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\n\n# 1. y에 로그를 씌운 Series\nly = np.log(y)\n# 2. ly의 ADF p-값\np0 = adfuller(ly)[1]\n# 3. ly의 계절 차분 (12칸, NaN은 뺌)\nsd = ly.diff(12).dropna()\n# 4. sd의 1차 차분 (NaN은 뺌)\ndd = sd.diff().dropna()\n# 5. dd의 ADF p-값\np2 = adfuller(dd)[1]\n# 6. 차분으로 잃은 행 수 (y 길이 − dd 길이)\nn_lost = len(y) - len(dd)\n\nprint(round(float(p0), 3), round(float(p2), 4), n_lost)\n",
    "hints": [
      "np.log(y)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 y에 로그를 씌운 Series",
        "expr": "len(ly) == 144 and abs(float(ly.sum()) - 798.0733380285894) < 1e-6 * max(1, abs(798.0733380285894))",
        "hint": "np.log(y)"
      },
      {
        "label": "2단계 ly의 ADF p-값",
        "expr": "abs(p0 - 0.4223667747703925) < 1e-3",
        "hint": "adfuller(ly)[1]"
      },
      {
        "label": "3단계 ly의 계절 차분 (12칸, NaN은 뺌)",
        "expr": "len(sd) == 132 and abs(float(sd.sum()) - 15.816438777209118) < 1e-6 * max(1, abs(15.816438777209118))",
        "hint": "ly.diff(12).dropna()"
      },
      {
        "label": "4단계 sd의 1차 차분 (NaN은 뺌)",
        "expr": "len(dd) == 131 and abs(float(dd.abs().sum()) - 4.522617902720538) < 1e-6 * max(1, abs(4.522617902720538))",
        "hint": "sd.diff().dropna()"
      },
      {
        "label": "5단계 dd의 ADF p-값",
        "expr": "abs(p2 - 0.00024859123113840886) < 1e-3",
        "hint": "adfuller(dd)[1]"
      },
      {
        "label": "6단계 차분으로 잃은 행 수 (y 길이 − dd 길이)",
        "expr": "n_lost == 13",
        "hint": "len(y) - len(dd)"
      }
    ]
  },
  {
    "id": "55-4",
    "unit": 55,
    "domain": "general",
    "title": "CO2 농도: 차분 전후를 ADF · KPSS로 비교하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "adfuller(s)[1]",
        "작으면 정상"
      ],
      [
        "kpss(s, nlags='auto')[1]",
        "작으면 비정상"
      ],
      [
        "s.diff(12)",
        "계절 차분"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>월평균 CO2 농도 <code>co2m</code>은 꾸준히 오르는 추세와 한 해 주기가 있습니다. 원래 값과, 계절 차분 뒤 1차 차분한 값을 두 검정으로 비교합니다.</p>\n<ol><li><code>p_adf_raw</code>: co2m의 ADF p-값</li><li><code>p_kpss_raw</code>: co2m의 KPSS p-값 (nlags='auto')</li><li><code>dd</code>: 계절 차분(12) 뒤 1차 차분한 Series (NaN은 뺌)</li><li><code>p_adf_dd</code>: dd의 ADF p-값</li><li><code>p_kpss_dd</code>: dd의 KPSS p-값 (nlags='auto')</li><li><code>stationary</code>: dd가 두 검정 모두에서 정상 쪽인지 (True/False)</li></ol>",
    "starter": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.stattools import adfuller, kpss\n\nco2 = pd.read_csv('co2.csv', parse_dates=['date']).set_index('date')['co2']\nco2m = co2.resample('MS').mean().interpolate()   # 월평균 CO2 농도(ppm)\nwarnings.filterwarnings('ignore')   # 검정 함수의 안내 경고 끄기\n\n# 1. co2m의 ADF p-값\np_adf_raw = \n# 2. co2m의 KPSS p-값 (nlags='auto')\np_kpss_raw = \n# 3. 계절 차분(12) 뒤 1차 차분한 Series (NaN은 뺌)\ndd = \n# 4. dd의 ADF p-값\np_adf_dd = \n# 5. dd의 KPSS p-값 (nlags='auto')\np_kpss_dd = \n# 6. dd가 두 검정 모두에서 정상 쪽인지 (True/False)\nstationary = \n\nprint(round(float(p_adf_raw), 3), round(float(p_kpss_raw), 3), round(float(p_adf_dd), 4), round(float(p_kpss_dd), 3), stationary)\n",
    "solution": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.stattools import adfuller, kpss\n\nco2 = pd.read_csv('co2.csv', parse_dates=['date']).set_index('date')['co2']\nco2m = co2.resample('MS').mean().interpolate()   # 월평균 CO2 농도(ppm)\nwarnings.filterwarnings('ignore')   # 검정 함수의 안내 경고 끄기\n\n# 1. co2m의 ADF p-값\np_adf_raw = adfuller(co2m)[1]\n# 2. co2m의 KPSS p-값 (nlags='auto')\np_kpss_raw = kpss(co2m, nlags='auto')[1]\n# 3. 계절 차분(12) 뒤 1차 차분한 Series (NaN은 뺌)\ndd = co2m.diff(12).diff().dropna()\n# 4. dd의 ADF p-값\np_adf_dd = adfuller(dd)[1]\n# 5. dd의 KPSS p-값 (nlags='auto')\np_kpss_dd = kpss(dd, nlags='auto')[1]\n# 6. dd가 두 검정 모두에서 정상 쪽인지 (True/False)\nstationary = bool(p_adf_dd < 0.05 and p_kpss_dd > 0.05)\n\nprint(round(float(p_adf_raw), 3), round(float(p_kpss_raw), 3), round(float(p_adf_dd), 4), round(float(p_kpss_dd), 3), stationary)\n",
    "hints": [
      "adfuller(co2m)[1]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 co2m의 ADF p-값",
        "expr": "abs(p_adf_raw - 0.9989084530577083) < 1e-3",
        "hint": "adfuller(co2m)[1]"
      },
      {
        "label": "2단계 co2m의 KPSS p-값 (nlags='auto')",
        "expr": "abs(p_kpss_raw - 0.01) < 1e-3",
        "hint": "kpss(co2m, nlags='auto')[1]"
      },
      {
        "label": "3단계 계절 차분(12) 뒤 1차 차분한 Series (NaN은 뺌)",
        "expr": "len(dd) == 513 and abs(float(dd.abs().sum()) - 167.85999999999848) < 1e-6 * max(1, abs(167.85999999999848))",
        "hint": "co2m.diff(12).diff().dropna()"
      },
      {
        "label": "4단계 dd의 ADF p-값",
        "expr": "abs(p_adf_dd - 2.270984793147749e-13) < 1e-3",
        "hint": "adfuller(dd)[1]"
      },
      {
        "label": "5단계 dd의 KPSS p-값 (nlags='auto')",
        "expr": "abs(p_kpss_dd - 0.1) < 1e-3",
        "hint": "kpss(dd, nlags='auto')[1]"
      },
      {
        "label": "6단계 dd가 두 검정 모두에서 정상 쪽인지 (True/False)",
        "expr": "stationary == True",
        "hint": "bool(p_adf_dd < 0.05 and p_kpss_dd > 0.05)"
      }
    ]
  },
  {
    "id": "56-1",
    "unit": 56,
    "domain": "mfg",
    "title": "설비 온도: 기준 예측 두 가지와 MAE",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "y.iloc[:-h], y.iloc[-h:]",
        "시간 순서대로 나누기"
      ],
      [
        "pd.Series(값, index=test.index)",
        "같은 값으로 채운 예측"
      ],
      [
        "(실제 − 예측).abs().mean()",
        "MAE"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>시간별 설비 온도의 마지막 48시간을 시험 구간으로 떼어 놓고, 가장 단순한 예측 두 가지(마지막 값, 전체 평균)의 오차를 잽니다.</p>\n<ol><li><code>train</code>: 마지막 48시간을 뺀 학습 구간</li><li><code>test</code>: 마지막 48시간 시험 구간</li><li><code>naive</code>: naive 예측: train의 마지막 값을 48칸에 (index는 test와 같게)</li><li><code>mae_naive</code>: naive 예측의 MAE</li><li><code>mae_mean</code>: mean 예측(train 평균을 48칸에)의 MAE</li><li><code>better</code>: MAE가 더 작은 쪽 이름 ('naive' 또는 'mean')</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 마지막 48시간을 뺀 학습 구간\ntrain = \n# 2. 마지막 48시간 시험 구간\ntest = \n# 3. naive 예측: train의 마지막 값을 48칸에 (index는 test와 같게)\nnaive = \n# 4. naive 예측의 MAE\nmae_naive = \n# 5. mean 예측(train 평균을 48칸에)의 MAE\nmae_mean = \n# 6. MAE가 더 작은 쪽 이름 ('naive' 또는 'mean')\nbetter = \n\nprint(round(mae_naive, 2), round(mae_mean, 2), better)\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 마지막 48시간을 뺀 학습 구간\ntrain = hourly.iloc[:-48]\n# 2. 마지막 48시간 시험 구간\ntest = hourly.iloc[-48:]\n# 3. naive 예측: train의 마지막 값을 48칸에 (index는 test와 같게)\nnaive = pd.Series(train.iloc[-1], index=test.index)\n# 4. naive 예측의 MAE\nmae_naive = (test - naive).abs().mean()\n# 5. mean 예측(train 평균을 48칸에)의 MAE\nmae_mean = (test - train.mean()).abs().mean()\n# 6. MAE가 더 작은 쪽 이름 ('naive' 또는 'mean')\nbetter = 'naive' if mae_naive < mae_mean else 'mean'\n\nprint(round(mae_naive, 2), round(mae_mean, 2), better)\n",
    "hints": [
      "hourly.iloc[:-48]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 마지막 48시간을 뺀 학습 구간",
        "expr": "len(train) == 1843 and abs(float(train.sum()) - 158048.48986111113) < 1e-6 * max(1, abs(158048.48986111113))",
        "hint": "hourly.iloc[:-48]"
      },
      {
        "label": "2단계 마지막 48시간 시험 구간",
        "expr": "len(test) == 48 and abs(float(test.sum()) - 4434.370833333333) < 1e-6 * max(1, abs(4434.370833333333))",
        "hint": "hourly.iloc[-48:]"
      },
      {
        "label": "3단계 naive 예측: train의 마지막 값을 48칸에 (index는 test와 같게)",
        "expr": "len(naive) == 48 and abs(float(naive.sum()) - 4310.24) < 1e-6 * max(1, abs(4310.24))",
        "hint": "pd.Series(train.iloc[-1], index=test.index)"
      },
      {
        "label": "4단계 naive 예측의 MAE",
        "expr": "abs(mae_naive - 2.7251215277777767) < 1e-6",
        "hint": "(test - naive).abs().mean()"
      },
      {
        "label": "5단계 mean 예측(train 평균을 48칸에)의 MAE",
        "expr": "abs(mae_mean - 6.626627017769931) < 1e-6",
        "hint": "(test - train.mean()).abs().mean()"
      },
      {
        "label": "6단계 MAE가 더 작은 쪽 이름 ('naive' 또는 'mean')",
        "expr": "better == 'naive'",
        "hint": "'naive' if mae_naive < mae_mean else 'mean'"
      }
    ]
  },
  {
    "id": "56-2",
    "unit": 56,
    "domain": "mfg",
    "title": "롤링 원점으로 naive 예측 평가하고 MASE 구하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "[식 for o in origins]",
        "원점마다 같은 계산 반복"
      ],
      [
        "np.mean(리스트)",
        "여러 번의 평균"
      ],
      [
        "MAE ÷ 학습 구간 naive MAE",
        "MASE"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>한 번의 시험 구간은 운에 좌우됩니다. 예측을 시작하는 시점(원점)을 네 번 옮겨 가며 '다음 24시간'을 naive로 예측하고, 평균 오차와 MASE를 구합니다.</p>\n<ol><li><code>maes</code>: 원점 o마다: hourly.iloc[o:o+24]를 직전 값 hourly.iloc[o-1]로 예측한 MAE 리스트</li><li><code>cv_mae</code>: 네 번의 MAE 평균</li><li><code>worst</code>: MAE가 가장 컸던 원점의 순서 (0~3)</li><li><code>scale</code>: 첫 원점 이전 구간에서 한 칸 naive가 낸 MAE (diff의 절댓값 평균)</li><li><code>mase</code>: cv_mae ÷ scale</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\norigins = [len(hourly) - 24 * k for k in (4, 3, 2, 1)]   # 시험 구간이 시작되는 위치 네 곳\n\n# 1. 원점 o마다: hourly.iloc[o:o+24]를 직전 값 hourly.iloc[o-1]로 예측한 MAE 리스트\nmaes = \n# 2. 네 번의 MAE 평균\ncv_mae = \n# 3. MAE가 가장 컸던 원점의 순서 (0~3)\nworst = \n# 4. 첫 원점 이전 구간에서 한 칸 naive가 낸 MAE (diff의 절댓값 평균)\nscale = \n# 5. cv_mae ÷ scale\nmase = \n\nprint([round(float(v), 2) for v in maes], round(cv_mae, 2), worst, round(scale, 3), round(mase, 2))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\norigins = [len(hourly) - 24 * k for k in (4, 3, 2, 1)]   # 시험 구간이 시작되는 위치 네 곳\n\n# 1. 원점 o마다: hourly.iloc[o:o+24]를 직전 값 hourly.iloc[o-1]로 예측한 MAE 리스트\nmaes = [(hourly.iloc[o:o + 24] - hourly.iloc[o - 1]).abs().mean() for o in origins]\n# 2. 네 번의 MAE 평균\ncv_mae = float(np.mean(maes))\n# 3. MAE가 가장 컸던 원점의 순서 (0~3)\nworst = int(np.argmax(maes))\n# 4. 첫 원점 이전 구간에서 한 칸 naive가 낸 MAE (diff의 절댓값 평균)\nscale = hourly.iloc[:origins[0]].diff().abs().mean()\n# 5. cv_mae ÷ scale\nmase = cv_mae / scale\n\nprint([round(float(v), 2) for v in maes], round(cv_mae, 2), worst, round(scale, 3), round(mase, 2))\n",
    "hints": [
      "[(hourly.iloc[o:o + 24] - hourly.iloc[o - 1]).abs().mean() for o in origins]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 원점 o마다: hourly.iloc[o:o+24]를 직전 값 hourly.iloc[o-1]로 예측한 MAE 리스트",
        "expr": "len(maes) == 4 and abs(float(sum(maes)) - 14.561840277777781) < 1e-6",
        "hint": "[(hourly.iloc[o:o + 24] - hourly.iloc[o - 1]).abs().mean() for o in origins]"
      },
      {
        "label": "2단계 네 번의 MAE 평균",
        "expr": "abs(cv_mae - 3.6404600694444453) < 1e-6",
        "hint": "float(np.mean(maes))"
      },
      {
        "label": "3단계 MAE가 가장 컸던 원점의 순서 (0~3)",
        "expr": "worst == 1",
        "hint": "int(np.argmax(maes))"
      },
      {
        "label": "4단계 첫 원점 이전 구간에서 한 칸 naive가 낸 MAE (diff의 절댓값 평균)",
        "expr": "abs(scale - 1.8964384367645242) < 1e-6",
        "hint": "hourly.iloc[:origins[0]].diff().abs().mean()"
      },
      {
        "label": "5단계 cv_mae ÷ scale",
        "expr": "abs(mase - 1.9196299752579165) < 1e-6",
        "hint": "cv_mae / scale"
      }
    ]
  },
  {
    "id": "56-3",
    "unit": 56,
    "domain": "general",
    "title": "항공 승객: seasonal naive와 MAPE",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "np.tile(배열, 2)",
        "배열을 두 번 이어 붙이기"
      ],
      [
        "(|오차| ÷ 실제).mean() × 100",
        "MAPE (%)"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>월별 항공 승객의 마지막 24개월을 시험 구간으로 둡니다. '작년 같은 달 값'을 그대로 쓰는 seasonal naive와 '마지막 값'을 쓰는 naive를 비교합니다.</p>\n<ol><li><code>snaive</code>: train의 마지막 12개월을 두 번 반복한 예측 (index는 test와 같게)</li><li><code>mae_s</code>: seasonal naive의 MAE</li><li><code>mape_s</code>: seasonal naive의 MAPE (%)</li><li><code>mae_n</code>: naive(train의 마지막 값)의 MAE</li><li><code>gain</code>: mae_n ÷ mae_s (seasonal naive가 몇 배 정확한지)</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\ntrain, test = y.iloc[:-24], y.iloc[-24:]\n\n# 1. train의 마지막 12개월을 두 번 반복한 예측 (index는 test와 같게)\nsnaive = \n# 2. seasonal naive의 MAE\nmae_s = \n# 3. seasonal naive의 MAPE (%)\nmape_s = \n# 4. naive(train의 마지막 값)의 MAE\nmae_n = \n# 5. mae_n ÷ mae_s (seasonal naive가 몇 배 정확한지)\ngain = \n\nprint(round(mae_s, 1), round(mape_s, 1), round(mae_n, 1), round(gain, 2))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\ntrain, test = y.iloc[:-24], y.iloc[-24:]\n\n# 1. train의 마지막 12개월을 두 번 반복한 예측 (index는 test와 같게)\nsnaive = pd.Series(np.tile(train.iloc[-12:].values, 2), index=test.index)\n# 2. seasonal naive의 MAE\nmae_s = (test - snaive).abs().mean()\n# 3. seasonal naive의 MAPE (%)\nmape_s = ((test - snaive).abs() / test).mean() * 100\n# 4. naive(train의 마지막 값)의 MAE\nmae_n = (test - train.iloc[-1]).abs().mean()\n# 5. mae_n ÷ mae_s (seasonal naive가 몇 배 정확한지)\ngain = mae_n / mae_s\n\nprint(round(mae_s, 1), round(mape_s, 1), round(mae_n, 1), round(gain, 2))\n",
    "hints": [
      "pd.Series(np.tile(train.iloc[-12:].values, 2), index=test.index)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 train의 마지막 12개월을 두 번 반복한 예측 (index는 test와 같게)",
        "expr": "len(snaive) == 24 and abs(float(snaive.sum()) - 9144.0) < 1e-6 * max(1, abs(9144.0))",
        "hint": "pd.Series(np.tile(train.iloc[-12:].values, 2), index=test.index)"
      },
      {
        "label": "2단계 seasonal naive의 MAE",
        "expr": "abs(mae_s - 71.25) < 1e-6",
        "hint": "(test - snaive).abs().mean()"
      },
      {
        "label": "3단계 seasonal naive의 MAPE (%)",
        "expr": "abs(mape_s - 15.523355162420376) < 1e-6",
        "hint": "((test - snaive).abs() / test).mean() * 100"
      },
      {
        "label": "4단계 naive(train의 마지막 값)의 MAE",
        "expr": "abs(mae_n - 115.25) < 1e-6",
        "hint": "(test - train.iloc[-1]).abs().mean()"
      },
      {
        "label": "5단계 mae_n ÷ mae_s (seasonal naive가 몇 배 정확한지)",
        "expr": "abs(gain - 1.6175438596491227) < 1e-6",
        "hint": "mae_n / mae_s"
      }
    ]
  },
  {
    "id": "56-4",
    "unit": 56,
    "domain": "general",
    "title": "따릉이: 지난주 복사 vs 최근 7일 평균",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "np.tile(배열, 4)",
        "배열을 네 번 이어 붙이기"
      ],
      [
        "s.diff(7).abs().mean()",
        "학습 구간에서 seasonal naive가 낸 오차"
      ],
      [
        "MAE ÷ scale",
        "MASE"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>일별 따릉이 대여 수의 마지막 28일을 시험 구간으로 둡니다. 지난주 7일을 복사하는 예측과 최근 7일 평균을 쓰는 예측을 비교하고, MASE로 크기를 가늠합니다.</p>\n<ol><li><code>snaive</code>: train의 마지막 7일을 네 번 반복한 예측 (index는 test와 같게)</li><li><code>mae_s</code>: snaive의 MAE</li><li><code>mae_m</code>: train의 마지막 7일 평균을 28칸에 쓴 예측의 MAE</li><li><code>scale</code>: train에서 7일 전 값으로 예측했을 때의 MAE</li><li><code>mase_m</code>: mae_m ÷ scale</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date')['rented_bikes'].sum().asfreq('D')\nday = day.where(day > 0).interpolate()   # 휴무일(0대)은 앞뒤 값으로 채움\ntrain, test = day.iloc[:-28], day.iloc[-28:]\n\n# 1. train의 마지막 7일을 네 번 반복한 예측 (index는 test와 같게)\nsnaive = \n# 2. snaive의 MAE\nmae_s = \n# 3. train의 마지막 7일 평균을 28칸에 쓴 예측의 MAE\nmae_m = \n# 4. train에서 7일 전 값으로 예측했을 때의 MAE\nscale = \n# 5. mae_m ÷ scale\nmase_m = \n\nprint(round(mae_s), round(mae_m), round(scale), round(mase_m, 2))\n",
    "solution": "import numpy as np\nimport pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date')['rented_bikes'].sum().asfreq('D')\nday = day.where(day > 0).interpolate()   # 휴무일(0대)은 앞뒤 값으로 채움\ntrain, test = day.iloc[:-28], day.iloc[-28:]\n\n# 1. train의 마지막 7일을 네 번 반복한 예측 (index는 test와 같게)\nsnaive = pd.Series(np.tile(train.iloc[-7:].values, 4), index=test.index)\n# 2. snaive의 MAE\nmae_s = (test - snaive).abs().mean()\n# 3. train의 마지막 7일 평균을 28칸에 쓴 예측의 MAE\nmae_m = (test - train.iloc[-7:].mean()).abs().mean()\n# 4. train에서 7일 전 값으로 예측했을 때의 MAE\nscale = train.diff(7).abs().mean()\n# 5. mae_m ÷ scale\nmase_m = mae_m / scale\n\nprint(round(mae_s), round(mae_m), round(scale), round(mase_m, 2))\n",
    "hints": [
      "pd.Series(np.tile(train.iloc[-7:].values, 4), index=test.index)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 train의 마지막 7일을 네 번 반복한 예측 (index는 test와 같게)",
        "expr": "len(snaive) == 28 and abs(float(snaive.sum()) - 557088.0) < 1e-6 * max(1, abs(557088.0))",
        "hint": "pd.Series(np.tile(train.iloc[-7:].values, 4), index=test.index)"
      },
      {
        "label": "2단계 snaive의 MAE",
        "expr": "abs(mae_s - 4799.089285714285) < 1e-6",
        "hint": "(test - snaive).abs().mean()"
      },
      {
        "label": "3단계 train의 마지막 7일 평균을 28칸에 쓴 예측의 MAE",
        "expr": "abs(mae_m - 4145.553571428572) < 1e-6",
        "hint": "(test - train.iloc[-7:].mean()).abs().mean()"
      },
      {
        "label": "4단계 train에서 7일 전 값으로 예측했을 때의 MAE",
        "expr": "abs(scale - 5432.921212121212) < 1e-6",
        "hint": "train.diff(7).abs().mean()"
      },
      {
        "label": "5단계 mae_m ÷ scale",
        "expr": "abs(mase_m - 0.7630431971256205) < 1e-6",
        "hint": "mae_m / scale"
      }
    ]
  },
  {
    "id": "57-1",
    "unit": 57,
    "domain": "mfg",
    "title": "설비 온도: ewm으로 지수평활 직접 해 보기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "s.ewm(alpha=0.3, adjust=False).mean()",
        "지수평활"
      ],
      [
        "α × (1 − α) ** k",
        "k칸 전 값의 가중치"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>시간별 설비 온도에 α = 0.3과 α = 0.9로 지수평활을 걸어 봅니다. α가 작을수록 선이 매끄럽고, 과거 값의 가중치는 한 칸마다 (1 − α)배로 줄어듭니다.</p>\n<ol><li><code>s3</code>: α = 0.3 지수평활 (adjust=False)</li><li><code>s9</code>: α = 0.9 지수평활 (adjust=False)</li><li><code>next3</code>: α = 0.3일 때 다음 시간 예측 (s3의 마지막 값)</li><li><code>rough</code>: s9의 변화량 절댓값 평균 ÷ s3의 변화량 절댓값 평균</li><li><code>w</code>: α = 0.3일 때 최근 5개 값의 가중치 리스트 (최근 것부터)</li><li><code>w_sum</code>: w의 합 (최근 5개가 차지하는 몫)</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. α = 0.3 지수평활 (adjust=False)\ns3 = \n# 2. α = 0.9 지수평활 (adjust=False)\ns9 = \n# 3. α = 0.3일 때 다음 시간 예측 (s3의 마지막 값)\nnext3 = \n# 4. s9의 변화량 절댓값 평균 ÷ s3의 변화량 절댓값 평균\nrough = \n# 5. α = 0.3일 때 최근 5개 값의 가중치 리스트 (최근 것부터)\nw = \n# 6. w의 합 (최근 5개가 차지하는 몫)\nw_sum = \n\nprint(round(next3, 2), round(hourly.iloc[-1], 2), round(rough, 2), [round(v, 3) for v in w], round(w_sum, 3))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. α = 0.3 지수평활 (adjust=False)\ns3 = hourly.ewm(alpha=0.3, adjust=False).mean()\n# 2. α = 0.9 지수평활 (adjust=False)\ns9 = hourly.ewm(alpha=0.9, adjust=False).mean()\n# 3. α = 0.3일 때 다음 시간 예측 (s3의 마지막 값)\nnext3 = s3.iloc[-1]\n# 4. s9의 변화량 절댓값 평균 ÷ s3의 변화량 절댓값 평균\nrough = s9.diff().abs().mean() / s3.diff().abs().mean()\n# 5. α = 0.3일 때 최근 5개 값의 가중치 리스트 (최근 것부터)\nw = [0.3 * 0.7 ** k for k in range(5)]\n# 6. w의 합 (최근 5개가 차지하는 몫)\nw_sum = sum(w)\n\nprint(round(next3, 2), round(hourly.iloc[-1], 2), round(rough, 2), [round(v, 3) for v in w], round(w_sum, 3))\n",
    "hints": [
      "hourly.ewm(alpha=0.3, adjust=False).mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 α = 0.3 지수평활 (adjust=False)",
        "expr": "len(s3) == 1891 and abs(float(s3.sum()) - 162442.46973260734) < 1e-6 * max(1, abs(162442.46973260734))",
        "hint": "hourly.ewm(alpha=0.3, adjust=False).mean()"
      },
      {
        "label": "2단계 α = 0.9 지수평활 (adjust=False)",
        "expr": "len(s9) == 1891 and abs(float(s9.sum()) - 162480.6982455317) < 1e-6 * max(1, abs(162480.6982455317))",
        "hint": "hourly.ewm(alpha=0.9, adjust=False).mean()"
      },
      {
        "label": "3단계 α = 0.3일 때 다음 시간 예측 (s3의 마지막 값)",
        "expr": "abs(next3 - 95.32152332700286) < 1e-6",
        "hint": "s3.iloc[-1]"
      },
      {
        "label": "4단계 s9의 변화량 절댓값 평균 ÷ s3의 변화량 절댓값 평균",
        "expr": "abs(rough - 1.7534024031680568) < 1e-6",
        "hint": "s9.diff().abs().mean() / s3.diff().abs().mean()"
      },
      {
        "label": "5단계 α = 0.3일 때 최근 5개 값의 가중치 리스트 (최근 것부터)",
        "expr": "len(w) == 5 and abs(w[0] - 0.3) < 1e-9 and abs(w[4] - 0.07202999999999998) < 1e-9",
        "hint": "[0.3 * 0.7 ** k for k in range(5)]"
      },
      {
        "label": "6단계 w의 합 (최근 5개가 차지하는 몫)",
        "expr": "abs(w_sum - 0.83193) < 1e-6",
        "hint": "sum(w)"
      }
    ]
  },
  {
    "id": "57-2",
    "unit": 57,
    "domain": "mfg",
    "title": "SimpleExpSmoothing: 모델이 고른 α 해석하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "SimpleExpSmoothing(train).fit()",
        "α를 스스로 고름"
      ],
      [
        "fit.params['smoothing_level']",
        "고른 α"
      ],
      [
        "fit.forecast(24)",
        "24칸 예측"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>α를 직접 정하지 않고 모델이 고르게 합니다. 고른 α가 1에 가깝다면 '마지막 값이 가장 좋은 예측'이라는 뜻이라, naive와 거의 같은 결과가 나옵니다.</p>\n<ol><li><code>fit</code>: train에 맞춘 단순 지수평활 모델</li><li><code>alpha</code>: 모델이 고른 α</li><li><code>fc</code>: 앞으로 24시간 예측</li><li><code>mae</code>: 예측의 MAE (test.values와 fc.values 비교)</li><li><code>mae_naive</code>: naive(train의 마지막 값)의 MAE</li></ol>",
    "starter": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.holtwinters import SimpleExpSmoothing\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]\n\n# 1. train에 맞춘 단순 지수평활 모델\nfit = \n# 2. 모델이 고른 α\nalpha = \n# 3. 앞으로 24시간 예측\nfc = \n# 4. 예측의 MAE (test.values와 fc.values 비교)\nmae = \n# 5. naive(train의 마지막 값)의 MAE\nmae_naive = \n\nprint(round(float(alpha), 3), round(float(mae), 2), round(float(mae_naive), 2))\n",
    "solution": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.holtwinters import SimpleExpSmoothing\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]\n\n# 1. train에 맞춘 단순 지수평활 모델\nfit = SimpleExpSmoothing(train).fit()\n# 2. 모델이 고른 α\nalpha = fit.params['smoothing_level']\n# 3. 앞으로 24시간 예측\nfc = fit.forecast(24)\n# 4. 예측의 MAE (test.values와 fc.values 비교)\nmae = abs(test.values - fc.values).mean()\n# 5. naive(train의 마지막 값)의 MAE\nmae_naive = (test - train.iloc[-1]).abs().mean()\n\nprint(round(float(alpha), 3), round(float(mae), 2), round(float(mae_naive), 2))\n",
    "hints": [
      "SimpleExpSmoothing(train).fit()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 train에 맞춘 단순 지수평활 모델",
        "expr": "hasattr(fit, 'forecast')",
        "hint": "SimpleExpSmoothing(train).fit()"
      },
      {
        "label": "2단계 모델이 고른 α",
        "expr": "0.9 < alpha <= 1.0",
        "hint": "fit.params['smoothing_level']"
      },
      {
        "label": "3단계 앞으로 24시간 예측",
        "expr": "len(fc) == 24 and abs(float(fc.iloc[0]) - 89.82999994977067) < 0.5",
        "hint": "fit.forecast(24)"
      },
      {
        "label": "4단계 예측의 MAE (test.values와 fc.values 비교)",
        "expr": "abs(mae - 3.3441319946737753) < 0.2",
        "hint": "abs(test.values - fc.values).mean()"
      },
      {
        "label": "5단계 naive(train의 마지막 값)의 MAE",
        "expr": "abs(mae_naive - 3.3441319444444435) < 1e-6",
        "hint": "(test - train.iloc[-1]).abs().mean()"
      }
    ]
  },
  {
    "id": "57-3",
    "unit": 57,
    "domain": "general",
    "title": "항공 승객: Holt-Winters로 추세와 계절까지",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12)",
        "Holt-Winters"
      ],
      [
        "fit.forecast(24)",
        "24칸 예측"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>월별 항공 승객은 추세와 곱셈형 계절이 있습니다. Holt-Winters로 마지막 24개월을 예측하고, 기준 예측인 seasonal naive를 넘는지 확인합니다.</p>\n<ol><li><code>fit</code>: 덧셈 추세 + 곱셈 계절(주기 12) Holt-Winters 모델</li><li><code>fc</code>: 앞으로 24개월 예측</li><li><code>mae</code>: 예측의 MAE</li><li><code>mae_s</code>: seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE</li><li><code>beats</code>: Holt-Winters가 seasonal naive보다 나은지 (True/False)</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nimport warnings\nfrom statsmodels.tsa.holtwinters import ExponentialSmoothing\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\nwarnings.filterwarnings('ignore')\ntrain, test = y.iloc[:-24], y.iloc[-24:]\n\n# 1. 덧셈 추세 + 곱셈 계절(주기 12) Holt-Winters 모델\nfit = \n# 2. 앞으로 24개월 예측\nfc = \n# 3. 예측의 MAE\nmae = \n# 4. seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE\nmae_s = \n# 5. Holt-Winters가 seasonal naive보다 나은지 (True/False)\nbeats = \n\nprint(round(float(mae), 1), round(float(mae_s), 1), beats)\n",
    "solution": "import numpy as np\nimport pandas as pd\nimport warnings\nfrom statsmodels.tsa.holtwinters import ExponentialSmoothing\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\nwarnings.filterwarnings('ignore')\ntrain, test = y.iloc[:-24], y.iloc[-24:]\n\n# 1. 덧셈 추세 + 곱셈 계절(주기 12) Holt-Winters 모델\nfit = ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12).fit()\n# 2. 앞으로 24개월 예측\nfc = fit.forecast(24)\n# 3. 예측의 MAE\nmae = abs(test.values - fc.values).mean()\n# 4. seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE\nmae_s = abs(test.values - np.tile(train.iloc[-12:].values, 2)).mean()\n# 5. Holt-Winters가 seasonal naive보다 나은지 (True/False)\nbeats = bool(mae < mae_s)\n\nprint(round(float(mae), 1), round(float(mae_s), 1), beats)\n",
    "hints": [
      "ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12).fit()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 덧셈 추세 + 곱셈 계절(주기 12) Holt-Winters 모델",
        "expr": "hasattr(fit, 'forecast')",
        "hint": "ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12).fit()"
      },
      {
        "label": "2단계 앞으로 24개월 예측",
        "expr": "len(fc) == 24 and abs(float(fc.sum()) - 10166.146652598953) < 0.03 * 10166.146652598953",
        "hint": "fit.forecast(24)"
      },
      {
        "label": "3단계 예측의 MAE",
        "expr": "abs(mae - 28.97937810845662) < 3",
        "hint": "abs(test.values - fc.values).mean()"
      },
      {
        "label": "4단계 seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE",
        "expr": "abs(mae_s - 71.25) < 1e-6",
        "hint": "abs(test.values - np.tile(train.iloc[-12:].values, 2)).mean()"
      },
      {
        "label": "5단계 Holt-Winters가 seasonal naive보다 나은지 (True/False)",
        "expr": "beats == True",
        "hint": "bool(mae < mae_s)"
      }
    ]
  },
  {
    "id": "57-4",
    "unit": 57,
    "domain": "general",
    "title": "CO2 농도: 추세만 vs 추세 + 계절",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "ExponentialSmoothing(train, trend='add')",
        "추세만 (Holt)"
      ],
      [
        "seasonal='add', seasonal_periods=12",
        "계절 더하기"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>월평균 CO2 농도의 마지막 24개월을 예측합니다. 추세만 넣은 모델과 계절까지 넣은 모델의 오차를 비교해, 계절 성분이 얼마나 값을 하는지 봅니다.</p>\n<ol><li><code>fit_t</code>: 덧셈 추세만 넣은 모델</li><li><code>fit_ts</code>: 덧셈 추세 + 덧셈 계절(주기 12) 모델</li><li><code>mae_t</code>: fit_t의 24개월 예측 MAE</li><li><code>mae_ts</code>: fit_ts의 24개월 예측 MAE</li><li><code>gain</code>: mae_t ÷ mae_ts (계절을 넣어 몇 배 정확해졌는지)</li></ol>",
    "starter": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.holtwinters import ExponentialSmoothing\n\nco2 = pd.read_csv('co2.csv', parse_dates=['date']).set_index('date')['co2']\nco2m = co2.resample('MS').mean().interpolate()   # 월평균 CO2 농도(ppm)\nwarnings.filterwarnings('ignore')\ntrain, test = co2m.iloc[:-24], co2m.iloc[-24:]\n\n# 1. 덧셈 추세만 넣은 모델\nfit_t = \n# 2. 덧셈 추세 + 덧셈 계절(주기 12) 모델\nfit_ts = \n# 3. fit_t의 24개월 예측 MAE\nmae_t = \n# 4. fit_ts의 24개월 예측 MAE\nmae_ts = \n# 5. mae_t ÷ mae_ts (계절을 넣어 몇 배 정확해졌는지)\ngain = \n\nprint(round(float(mae_t), 2), round(float(mae_ts), 2), round(float(gain), 1))\n",
    "solution": "import pandas as pd\nimport warnings\nfrom statsmodels.tsa.holtwinters import ExponentialSmoothing\n\nco2 = pd.read_csv('co2.csv', parse_dates=['date']).set_index('date')['co2']\nco2m = co2.resample('MS').mean().interpolate()   # 월평균 CO2 농도(ppm)\nwarnings.filterwarnings('ignore')\ntrain, test = co2m.iloc[:-24], co2m.iloc[-24:]\n\n# 1. 덧셈 추세만 넣은 모델\nfit_t = ExponentialSmoothing(train, trend='add').fit()\n# 2. 덧셈 추세 + 덧셈 계절(주기 12) 모델\nfit_ts = ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit()\n# 3. fit_t의 24개월 예측 MAE\nmae_t = abs(test.values - fit_t.forecast(24).values).mean()\n# 4. fit_ts의 24개월 예측 MAE\nmae_ts = abs(test.values - fit_ts.forecast(24).values).mean()\n# 5. mae_t ÷ mae_ts (계절을 넣어 몇 배 정확해졌는지)\ngain = mae_t / mae_ts\n\nprint(round(float(mae_t), 2), round(float(mae_ts), 2), round(float(gain), 1))\n",
    "hints": [
      "ExponentialSmoothing(train, trend='add').fit()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 덧셈 추세만 넣은 모델",
        "expr": "hasattr(fit_t, 'forecast')",
        "hint": "ExponentialSmoothing(train, trend='add').fit()"
      },
      {
        "label": "2단계 덧셈 추세 + 덧셈 계절(주기 12) 모델",
        "expr": "hasattr(fit_ts, 'forecast')",
        "hint": "ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit()"
      },
      {
        "label": "3단계 fit_t의 24개월 예측 MAE",
        "expr": "abs(mae_t - 13.417708628711614) < 2",
        "hint": "abs(test.values - fit_t.forecast(24).values).mean()"
      },
      {
        "label": "4단계 fit_ts의 24개월 예측 MAE",
        "expr": "abs(mae_ts - 0.2357859405813727) < 0.15",
        "hint": "abs(test.values - fit_ts.forecast(24).values).mean()"
      },
      {
        "label": "5단계 mae_t ÷ mae_ts (계절을 넣어 몇 배 정확해졌는지)",
        "expr": "gain > 2",
        "hint": "mae_t / mae_ts"
      }
    ]
  },
  {
    "id": "58-1",
    "unit": 58,
    "domain": "mfg",
    "title": "설비 온도: ARIMA(2,1,1) 맞추고 잔차 점검하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "ARIMA(train, order=(2, 1, 1)).fit()",
        "ARIMA 적합"
      ],
      [
        "fit.forecast(24)",
        "24칸 예측"
      ],
      [
        "acorr_ljungbox(fit.resid, lags=[24])",
        "잔차에 패턴이 남았는지"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>시간별 설비 온도에 ARIMA(2,1,1)을 맞춰 다음 24시간을 예측합니다. 예측 오차를 naive와 비교하고, 잔차에 자기상관이 남았는지 Ljung-Box로 점검합니다.</p>\n<ol><li><code>fit</code>: train에 맞춘 ARIMA(2,1,1) 모델</li><li><code>fc</code>: 앞으로 24시간 예측</li><li><code>mae</code>: 예측의 MAE</li><li><code>mae_naive</code>: naive(train의 마지막 값)의 MAE</li><li><code>lb_p</code>: 잔차(첫 값 제외)의 래그 24 Ljung-Box p-값</li><li><code>resid_ok</code>: 잔차를 백색잡음으로 볼 수 있는지 (p > 0.05, True/False)</li></ol>",
    "starter": "import pandas as pd\nimport warnings\nfrom statsmodels.stats.diagnostic import acorr_ljungbox\nfrom statsmodels.tsa.arima.model import ARIMA\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]\n\n# 1. train에 맞춘 ARIMA(2,1,1) 모델\nfit = \n# 2. 앞으로 24시간 예측\nfc = \n# 3. 예측의 MAE\nmae = \n# 4. naive(train의 마지막 값)의 MAE\nmae_naive = \n# 5. 잔차(첫 값 제외)의 래그 24 Ljung-Box p-값\nlb_p = \n# 6. 잔차를 백색잡음으로 볼 수 있는지 (p > 0.05, True/False)\nresid_ok = \n\nprint(round(float(mae), 2), round(float(mae_naive), 2), round(float(lb_p), 3), resid_ok)\n",
    "solution": "import pandas as pd\nimport warnings\nfrom statsmodels.stats.diagnostic import acorr_ljungbox\nfrom statsmodels.tsa.arima.model import ARIMA\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]\n\n# 1. train에 맞춘 ARIMA(2,1,1) 모델\nfit = ARIMA(train, order=(2, 1, 1)).fit()\n# 2. 앞으로 24시간 예측\nfc = fit.forecast(24)\n# 3. 예측의 MAE\nmae = abs(test.values - fc.values).mean()\n# 4. naive(train의 마지막 값)의 MAE\nmae_naive = (test - train.iloc[-1]).abs().mean()\n# 5. 잔차(첫 값 제외)의 래그 24 Ljung-Box p-값\nlb_p = acorr_ljungbox(fit.resid.iloc[1:], lags=[24])['lb_pvalue'].iloc[0]\n# 6. 잔차를 백색잡음으로 볼 수 있는지 (p > 0.05, True/False)\nresid_ok = bool(lb_p > 0.05)\n\nprint(round(float(mae), 2), round(float(mae_naive), 2), round(float(lb_p), 3), resid_ok)\n",
    "hints": [
      "ARIMA(train, order=(2, 1, 1)).fit()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 train에 맞춘 ARIMA(2,1,1) 모델",
        "expr": "hasattr(fit, 'aic')",
        "hint": "ARIMA(train, order=(2, 1, 1)).fit()"
      },
      {
        "label": "2단계 앞으로 24시간 예측",
        "expr": "len(fc) == 24 and abs(float(fc.mean()) - 91.96693652143081) < 0.5",
        "hint": "fit.forecast(24)"
      },
      {
        "label": "3단계 예측의 MAE",
        "expr": "abs(mae - 1.4536517330959082) < 0.2",
        "hint": "abs(test.values - fc.values).mean()"
      },
      {
        "label": "4단계 naive(train의 마지막 값)의 MAE",
        "expr": "abs(mae_naive - 3.3441319444444435) < 1e-6",
        "hint": "(test - train.iloc[-1]).abs().mean()"
      },
      {
        "label": "5단계 잔차(첫 값 제외)의 래그 24 Ljung-Box p-값",
        "expr": "0 <= lb_p <= 1 and (lb_p > 0.05) == True",
        "hint": "acorr_ljungbox(fit.resid.iloc[1:], lags=[24])['lb_pvalue'].iloc[0]"
      },
      {
        "label": "6단계 잔차를 백색잡음으로 볼 수 있는지 (p > 0.05, True/False)",
        "expr": "resid_ok == True",
        "hint": "bool(lb_p > 0.05)"
      }
    ]
  },
  {
    "id": "58-2",
    "unit": 58,
    "domain": "mfg",
    "title": "AIC로 차수 고르고 예측 구간 보기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "{o: ARIMA(train, order=o).fit().aic for o in orders}",
        "후보마다 AIC"
      ],
      [
        "min(d, key=d.get)",
        "값이 가장 작은 키"
      ],
      [
        "fit.get_forecast(24).conf_int()",
        "예측 구간 (아래, 위)"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>후보 차수 네 개 가운데 AIC가 가장 작은 것을 고릅니다. 고른 모델로 24시간 예측 구간을 구하고, 멀리 갈수록 구간이 얼마나 넓어지는지 확인합니다.</p>\n<ol><li><code>aics</code>: 차수 → AIC 딕셔너리</li><li><code>best</code>: AIC가 가장 작은 차수 (튜플)</li><li><code>fit</code>: best 차수로 다시 맞춘 모델</li><li><code>ci</code>: 24시간 예측 구간 (열 두 개: 아래, 위)</li><li><code>w1</code>: 1시간 뒤 구간의 폭 (위 − 아래)</li><li><code>w24</code>: 24시간 뒤 구간의 폭</li></ol>",
    "starter": "import pandas as pd\nimport warnings\nfrom statsmodels.stats.diagnostic import acorr_ljungbox\nfrom statsmodels.tsa.arima.model import ARIMA\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]\norders = [(1, 0, 0), (1, 1, 0), (0, 1, 1), (2, 1, 1)]\n\n# 1. 차수 → AIC 딕셔너리\naics = \n# 2. AIC가 가장 작은 차수 (튜플)\nbest = \n# 3. best 차수로 다시 맞춘 모델\nfit = \n# 4. 24시간 예측 구간 (열 두 개: 아래, 위)\nci = \n# 5. 1시간 뒤 구간의 폭 (위 − 아래)\nw1 = \n# 6. 24시간 뒤 구간의 폭\nw24 = \n\nprint({o: round(float(v), 1) for o, v in aics.items()}, best, round(float(w1), 1), round(float(w24), 1))\n",
    "solution": "import pandas as pd\nimport warnings\nfrom statsmodels.stats.diagnostic import acorr_ljungbox\nfrom statsmodels.tsa.arima.model import ARIMA\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]\norders = [(1, 0, 0), (1, 1, 0), (0, 1, 1), (2, 1, 1)]\n\n# 1. 차수 → AIC 딕셔너리\naics = {o: ARIMA(train, order=o).fit().aic for o in orders}\n# 2. AIC가 가장 작은 차수 (튜플)\nbest = min(aics, key=aics.get)\n# 3. best 차수로 다시 맞춘 모델\nfit = ARIMA(train, order=best).fit()\n# 4. 24시간 예측 구간 (열 두 개: 아래, 위)\nci = fit.get_forecast(24).conf_int()\n# 5. 1시간 뒤 구간의 폭 (위 − 아래)\nw1 = ci.iloc[0, 1] - ci.iloc[0, 0]\n# 6. 24시간 뒤 구간의 폭\nw24 = ci.iloc[-1, 1] - ci.iloc[-1, 0]\n\nprint({o: round(float(v), 1) for o, v in aics.items()}, best, round(float(w1), 1), round(float(w24), 1))\n",
    "hints": [
      "{o: ARIMA(train, order=o).fit().aic for o in orders}",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 차수 → AIC 딕셔너리",
        "expr": "len(aics) == 4 and abs(aics[(1, 1, 0)] - 9685.656983108607) < 5",
        "hint": "{o: ARIMA(train, order=o).fit().aic for o in orders}"
      },
      {
        "label": "2단계 AIC가 가장 작은 차수 (튜플)",
        "expr": "best == (2, 1, 1)",
        "hint": "min(aics, key=aics.get)"
      },
      {
        "label": "3단계 best 차수로 다시 맞춘 모델",
        "expr": "hasattr(fit, 'get_forecast')",
        "hint": "ARIMA(train, order=best).fit()"
      },
      {
        "label": "4단계 24시간 예측 구간 (열 두 개: 아래, 위)",
        "expr": "ci.shape == (24, 2)",
        "hint": "fit.get_forecast(24).conf_int()"
      },
      {
        "label": "5단계 1시간 뒤 구간의 폭 (위 − 아래)",
        "expr": "abs(w1 - 12.488319861755656) < 0.5",
        "hint": "ci.iloc[0, 1] - ci.iloc[0, 0]"
      },
      {
        "label": "6단계 24시간 뒤 구간의 폭",
        "expr": "abs(w24 - 81.37953595099393) < 3",
        "hint": "ci.iloc[-1, 1] - ci.iloc[-1, 0]"
      }
    ]
  },
  {
    "id": "58-3",
    "unit": 58,
    "domain": "general",
    "title": "항공 승객: 로그 + SARIMA(0,1,1)(0,1,1,12)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "ARIMA(s, order=(0, 1, 1), seasonal_order=(0, 1, 1, 12))",
        "계절 ARIMA"
      ],
      [
        "np.exp(예측)",
        "로그를 되돌리기"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>월별 항공 승객에 로그를 씌운 뒤 계절 ARIMA를 맞춥니다. 예측은 <code>np.exp</code>로 원래 단위로 되돌려서 평가하고, seasonal naive와 비교합니다.</p>\n<ol><li><code>fit</code>: np.log(train)에 맞춘 ARIMA(0,1,1)(0,1,1,12) 모델</li><li><code>fc</code>: 24개월 예측을 원래 단위로 되돌린 값</li><li><code>mae</code>: 예측의 MAE</li><li><code>mape</code>: 예측의 MAPE (%)</li><li><code>mae_s</code>: seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nimport warnings\nfrom statsmodels.tsa.arima.model import ARIMA\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\nwarnings.filterwarnings('ignore')\ntrain, test = y.iloc[:-24], y.iloc[-24:]\n\n# 1. np.log(train)에 맞춘 ARIMA(0,1,1)(0,1,1,12) 모델\nfit = \n# 2. 24개월 예측을 원래 단위로 되돌린 값\nfc = \n# 3. 예측의 MAE\nmae = \n# 4. 예측의 MAPE (%)\nmape = \n# 5. seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE\nmae_s = \n\nprint(round(float(mae), 1), round(float(mape), 1), round(float(mae_s), 1))\n",
    "solution": "import numpy as np\nimport pandas as pd\nimport warnings\nfrom statsmodels.tsa.arima.model import ARIMA\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ny = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)\nwarnings.filterwarnings('ignore')\ntrain, test = y.iloc[:-24], y.iloc[-24:]\n\n# 1. np.log(train)에 맞춘 ARIMA(0,1,1)(0,1,1,12) 모델\nfit = ARIMA(np.log(train), order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit()\n# 2. 24개월 예측을 원래 단위로 되돌린 값\nfc = np.exp(fit.forecast(24))\n# 3. 예측의 MAE\nmae = abs(test.values - fc.values).mean()\n# 4. 예측의 MAPE (%)\nmape = (abs(test.values - fc.values) / test.values).mean() * 100\n# 5. seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE\nmae_s = abs(test.values - np.tile(train.iloc[-12:].values, 2)).mean()\n\nprint(round(float(mae), 1), round(float(mape), 1), round(float(mae_s), 1))\n",
    "hints": [
      "ARIMA(np.log(train), order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 np.log(train)에 맞춘 ARIMA(0,1,1)(0,1,1,12) 모델",
        "expr": "hasattr(fit, 'aic')",
        "hint": "ARIMA(np.log(train), order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit()"
      },
      {
        "label": "2단계 24개월 예측을 원래 단위로 되돌린 값",
        "expr": "len(fc) == 24 and abs(float(fc.sum()) - 9907.065712597896) < 0.03 * 9907.065712597896",
        "hint": "np.exp(fit.forecast(24))"
      },
      {
        "label": "3단계 예측의 MAE",
        "expr": "abs(mae - 39.45559530842101) < 4",
        "hint": "abs(test.values - fc.values).mean()"
      },
      {
        "label": "4단계 예측의 MAPE (%)",
        "expr": "abs(mape - 8.518185544477424) < 1",
        "hint": "(abs(test.values - fc.values) / test.values).mean() * 100"
      },
      {
        "label": "5단계 seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE",
        "expr": "abs(mae_s - 71.25) < 1e-6",
        "hint": "abs(test.values - np.tile(train.iloc[-12:].values, 2)).mean()"
      }
    ]
  },
  {
    "id": "58-4",
    "unit": 58,
    "domain": "general",
    "title": "따릉이: 기온과 강수량을 외부 변수로 넣기",
    "type": "steps",
    "level": 3,
    "uses": [
      [
        "ARIMA(y, exog=X, order=...)",
        "외부 변수 넣기"
      ],
      [
        "fit.forecast(28, exog=미래의 X)",
        "예측에도 외부 변수가 필요"
      ],
      [
        "fit.params['rain']",
        "외부 변수의 계수"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>일별 따릉이 대여 수는 날씨에 크게 좌우됩니다. 같은 ARIMA(1,1,1)에 기온 · 강수량을 넣은 것과 안 넣은 것을 비교합니다. 여기서는 시험 구간의 실제 날씨를 알고 있다고 가정합니다.</p>\n<ol><li><code>fit0</code>: train['rented']에 맞춘 ARIMA(1,1,1)</li><li><code>fit1</code>: 외부 변수 train[X]를 넣은 ARIMA(1,1,1)</li><li><code>mae0</code>: fit0의 28일 예측 MAE</li><li><code>mae1</code>: fit1의 28일 예측 MAE (exog=test[X])</li><li><code>rain_coef</code>: fit1에서 강수량(rain)의 계수</li></ol>",
    "starter": "import warnings\nimport pandas as pd\nfrom statsmodels.tsa.arima.model import ARIMA\n\nwarnings.filterwarnings('ignore')\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date').agg(rented=('rented_bikes', 'sum'), temp=('temp', 'mean'), rain=('rainfall', 'sum')).asfreq('D')\nday['rented'] = day['rented'].where(day['rented'] > 0).interpolate()   # 휴무일은 앞뒤 값으로\ntrain, test = day.iloc[:-28], day.iloc[-28:]\nX = ['temp', 'rain']\n\n# 1. train['rented']에 맞춘 ARIMA(1,1,1)\nfit0 = \n# 2. 외부 변수 train[X]를 넣은 ARIMA(1,1,1)\nfit1 = \n# 3. fit0의 28일 예측 MAE\nmae0 = \n# 4. fit1의 28일 예측 MAE (exog=test[X])\nmae1 = \n# 5. fit1에서 강수량(rain)의 계수\nrain_coef = \n\nprint(round(float(mae0)), round(float(mae1)), round(float(rain_coef), 1))\n",
    "solution": "import warnings\nimport pandas as pd\nfrom statsmodels.tsa.arima.model import ARIMA\n\nwarnings.filterwarnings('ignore')\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date').agg(rented=('rented_bikes', 'sum'), temp=('temp', 'mean'), rain=('rainfall', 'sum')).asfreq('D')\nday['rented'] = day['rented'].where(day['rented'] > 0).interpolate()   # 휴무일은 앞뒤 값으로\ntrain, test = day.iloc[:-28], day.iloc[-28:]\nX = ['temp', 'rain']\n\n# 1. train['rented']에 맞춘 ARIMA(1,1,1)\nfit0 = ARIMA(train['rented'], order=(1, 1, 1)).fit()\n# 2. 외부 변수 train[X]를 넣은 ARIMA(1,1,1)\nfit1 = ARIMA(train['rented'], exog=train[X], order=(1, 1, 1)).fit()\n# 3. fit0의 28일 예측 MAE\nmae0 = abs(test['rented'].values - fit0.forecast(28).values).mean()\n# 4. fit1의 28일 예측 MAE (exog=test[X])\nmae1 = abs(test['rented'].values - fit1.forecast(28, exog=test[X]).values).mean()\n# 5. fit1에서 강수량(rain)의 계수\nrain_coef = fit1.params['rain']\n\nprint(round(float(mae0)), round(float(mae1)), round(float(rain_coef), 1))\n",
    "hints": [
      "ARIMA(train['rented'], order=(1, 1, 1)).fit()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 train['rented']에 맞춘 ARIMA(1,1,1)",
        "expr": "hasattr(fit0, 'aic')",
        "hint": "ARIMA(train['rented'], order=(1, 1, 1)).fit()"
      },
      {
        "label": "2단계 외부 변수 train[X]를 넣은 ARIMA(1,1,1)",
        "expr": "'rain' in fit1.params.index",
        "hint": "ARIMA(train['rented'], exog=train[X], order=(1, 1, 1)).fit()"
      },
      {
        "label": "3단계 fit0의 28일 예측 MAE",
        "expr": "abs(mae0 - 5696.819032695259) < 0.05 * 5696.819032695259",
        "hint": "abs(test['rented'].values - fit0.forecast(28).values).mean()"
      },
      {
        "label": "4단계 fit1의 28일 예측 MAE (exog=test[X])",
        "expr": "abs(mae1 - 3693.8003669021127) < 0.05 * 3693.8003669021127",
        "hint": "abs(test['rented'].values - fit1.forecast(28, exog=test[X]).values).mean()"
      },
      {
        "label": "5단계 fit1에서 강수량(rain)의 계수",
        "expr": "abs(rain_coef - -322.1928978612213) < 0.1 * abs(-322.1928978612213)",
        "hint": "fit1.params['rain']"
      }
    ]
  },
  {
    "id": "59-1",
    "unit": 59,
    "domain": "mfg",
    "title": "설비 온도: 래그 · 이동 특성으로 학습 표 만들기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "s.shift(1)",
        "한 칸 전 값"
      ],
      [
        "s.shift(1).rolling(24).mean()",
        "직전 24칸 평균 (지금 값은 빼고)"
      ],
      [
        "pd.DataFrame({...}).dropna()",
        "표로 묶고 빈 행 버리기"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>시간별 설비 온도를 '특성 여러 개 + 정답 하나'인 표로 바꿉니다. 이동평균은 반드시 <code>shift(1)</code>을 먼저 해서, 맞혀야 할 지금 값이 특성에 섞이지 않게 합니다.</p>\n<ol><li><code>lag1</code>: 1시간 전 값</li><li><code>lag24</code>: 24시간 전 값</li><li><code>roll24</code>: 직전 24시간 평균 (지금 값 제외)</li><li><code>feat</code>: 열 y(=hourly), lag1, lag24, roll24로 만든 표에서 NaN 행을 버린 것</li><li><code>n_lost</code>: 버려진 행 수</li><li><code>best_feat</code>: y와 상관계수가 가장 큰 특성 이름</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 1시간 전 값\nlag1 = \n# 2. 24시간 전 값\nlag24 = \n# 3. 직전 24시간 평균 (지금 값 제외)\nroll24 = \n# 4. 열 y(=hourly), lag1, lag24, roll24로 만든 표에서 NaN 행을 버린 것\nfeat = \n# 5. 버려진 행 수\nn_lost = \n# 6. y와 상관계수가 가장 큰 특성 이름\nbest_feat = \n\nprint(feat.shape, n_lost, best_feat)\nprint(feat.head(3).round(2))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도\n\n# 1. 1시간 전 값\nlag1 = hourly.shift(1)\n# 2. 24시간 전 값\nlag24 = hourly.shift(24)\n# 3. 직전 24시간 평균 (지금 값 제외)\nroll24 = hourly.shift(1).rolling(24).mean()\n# 4. 열 y(=hourly), lag1, lag24, roll24로 만든 표에서 NaN 행을 버린 것\nfeat = pd.DataFrame({'y': hourly, 'lag1': lag1, 'lag24': lag24, 'roll24': roll24}).dropna()\n# 5. 버려진 행 수\nn_lost = len(hourly) - len(feat)\n# 6. y와 상관계수가 가장 큰 특성 이름\nbest_feat = feat.corr()['y'].drop('y').idxmax()\n\nprint(feat.shape, n_lost, best_feat)\nprint(feat.head(3).round(2))\n",
    "hints": [
      "hourly.shift(1)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 1시간 전 값",
        "expr": "len(lag1) == 1891 and abs(float(lag1.sum()) - 162385.28569444446) < 1e-6 * max(1, abs(162385.28569444446))",
        "hint": "hourly.shift(1)"
      },
      {
        "label": "2단계 24시간 전 값",
        "expr": "len(lag24) == 1891 and abs(float(lag24.sum()) - 160246.6815277778) < 1e-6 * max(1, abs(160246.6815277778))",
        "hint": "hourly.shift(24)"
      },
      {
        "label": "3단계 직전 24시간 평균 (지금 값 제외)",
        "expr": "len(roll24) == 1891 and abs(float(roll24.sum()) - 160355.81261574075) < 1e-6 * max(1, abs(160355.81261574075))",
        "hint": "hourly.shift(1).rolling(24).mean()"
      },
      {
        "label": "4단계 열 y(=hourly), lag1, lag24, roll24로 만든 표에서 NaN 행을 버린 것",
        "expr": "list(feat.columns) == ['y', 'lag1', 'lag24', 'roll24'] and len(feat) == 1867 and abs(float(feat['roll24'].sum()) - 160355.81261574075) < 1e-3",
        "hint": "pd.DataFrame({'y': hourly, 'lag1': lag1, 'lag24': lag24, 'roll24': roll24}).dropna()"
      },
      {
        "label": "5단계 버려진 행 수",
        "expr": "n_lost == 24",
        "hint": "len(hourly) - len(feat)"
      },
      {
        "label": "6단계 y와 상관계수가 가장 큰 특성 이름",
        "expr": "best_feat == 'lag1'",
        "hint": "feat.corr()['y'].drop('y').idxmax()"
      }
    ]
  },
  {
    "id": "59-2",
    "unit": 59,
    "domain": "mfg",
    "title": "선형 회귀 vs 랜덤 포레스트 vs naive (1시간 뒤 예측)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "LinearRegression().fit(X, y)",
        "선형 회귀"
      ],
      [
        "RandomForestRegressor(n_estimators=50, random_state=0)",
        "랜덤 포레스트"
      ],
      [
        "(실제 − 예측).abs().mean()",
        "MAE"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>래그 특성 표로 1시간 뒤 온도를 예측합니다. 마지막 일주일을 시험 구간으로 두고 선형 회귀, 랜덤 포레스트, 그리고 기준 예측(1시간 전 값 그대로)을 비교합니다. 복잡한 모델이 꼭 이긴다는 보장은 없습니다.</p>\n<ol><li><code>lin</code>: train으로 학습한 선형 회귀</li><li><code>mae_lin</code>: 선형 회귀의 시험 구간 MAE</li><li><code>rf</code>: train으로 학습한 랜덤 포레스트 (n_estimators=50, random_state=0)</li><li><code>mae_rf</code>: 랜덤 포레스트의 시험 구간 MAE</li><li><code>mae_naive</code>: naive(lag1을 그대로 예측으로)의 MAE</li><li><code>best</code>: MAE가 가장 작은 방법 ('lin', 'rf', 'naive' 중 하나)</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.linear_model import LinearRegression\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()\nfeat = pd.DataFrame({'y': hourly, 'lag1': hourly.shift(1), 'lag2': hourly.shift(2), 'lag24': hourly.shift(24),\n                     'roll24': hourly.shift(1).rolling(24).mean()}).dropna()\ncols = ['lag1', 'lag2', 'lag24', 'roll24']\ntrain, test = feat.iloc[:-168], feat.iloc[-168:]   # 마지막 일주일이 시험 구간\n\n# 1. train으로 학습한 선형 회귀\nlin = \n# 2. 선형 회귀의 시험 구간 MAE\nmae_lin = \n# 3. train으로 학습한 랜덤 포레스트 (n_estimators=50, random_state=0)\nrf = \n# 4. 랜덤 포레스트의 시험 구간 MAE\nmae_rf = \n# 5. naive(lag1을 그대로 예측으로)의 MAE\nmae_naive = \n# 6. MAE가 가장 작은 방법 ('lin', 'rf', 'naive' 중 하나)\nbest = \n\nprint(round(float(mae_lin), 3), round(float(mae_rf), 3), round(float(mae_naive), 3), best)\n",
    "solution": "import pandas as pd\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.linear_model import LinearRegression\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()\nfeat = pd.DataFrame({'y': hourly, 'lag1': hourly.shift(1), 'lag2': hourly.shift(2), 'lag24': hourly.shift(24),\n                     'roll24': hourly.shift(1).rolling(24).mean()}).dropna()\ncols = ['lag1', 'lag2', 'lag24', 'roll24']\ntrain, test = feat.iloc[:-168], feat.iloc[-168:]   # 마지막 일주일이 시험 구간\n\n# 1. train으로 학습한 선형 회귀\nlin = LinearRegression().fit(train[cols], train['y'])\n# 2. 선형 회귀의 시험 구간 MAE\nmae_lin = (test['y'] - lin.predict(test[cols])).abs().mean()\n# 3. train으로 학습한 랜덤 포레스트 (n_estimators=50, random_state=0)\nrf = RandomForestRegressor(n_estimators=50, random_state=0).fit(train[cols], train['y'])\n# 4. 랜덤 포레스트의 시험 구간 MAE\nmae_rf = (test['y'] - rf.predict(test[cols])).abs().mean()\n# 5. naive(lag1을 그대로 예측으로)의 MAE\nmae_naive = (test['y'] - test['lag1']).abs().mean()\n# 6. MAE가 가장 작은 방법 ('lin', 'rf', 'naive' 중 하나)\nbest = min({'lin': mae_lin, 'rf': mae_rf, 'naive': mae_naive}, key={'lin': mae_lin, 'rf': mae_rf, 'naive': mae_naive}.get)\n\nprint(round(float(mae_lin), 3), round(float(mae_rf), 3), round(float(mae_naive), 3), best)\n",
    "hints": [
      "LinearRegression().fit(train[cols], train['y'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 train으로 학습한 선형 회귀",
        "expr": "hasattr(lin, 'coef_')",
        "hint": "LinearRegression().fit(train[cols], train['y'])"
      },
      {
        "label": "2단계 선형 회귀의 시험 구간 MAE",
        "expr": "abs(mae_lin - 1.4871304045386697) < 1e-4",
        "hint": "(test['y'] - lin.predict(test[cols])).abs().mean()"
      },
      {
        "label": "3단계 train으로 학습한 랜덤 포레스트 (n_estimators=50, random_state=0)",
        "expr": "hasattr(rf, 'feature_importances_')",
        "hint": "RandomForestRegressor(n_estimators=50, random_state=0).fit(train[cols], train['y'])"
      },
      {
        "label": "4단계 랜덤 포레스트의 시험 구간 MAE",
        "expr": "abs(mae_rf - 1.5795919146825417) < 0.05",
        "hint": "(test['y'] - rf.predict(test[cols])).abs().mean()"
      },
      {
        "label": "5단계 naive(lag1을 그대로 예측으로)의 MAE",
        "expr": "abs(mae_naive - 1.3703422619047627) < 1e-6",
        "hint": "(test['y'] - test['lag1']).abs().mean()"
      },
      {
        "label": "6단계 MAE가 가장 작은 방법 ('lin', 'rf', 'naive' 중 하나)",
        "expr": "best == 'naive'",
        "hint": "min({'lin': mae_lin, 'rf': mae_rf, 'naive': mae_naive}, key={'lin': mae_lin, 'rf': mae_rf, 'naive': mae_naive}.get)"
      }
    ]
  },
  {
    "id": "59-3",
    "unit": 59,
    "domain": "general",
    "title": "따릉이: 래그 · 요일 · 기온 특성으로 내일 예측하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "s.shift(7)",
        "일주일 전 값"
      ],
      [
        "s.index.dayofweek",
        "요일 (월 0 ~ 일 6)"
      ],
      [
        "LinearRegression().fit(X, y)",
        "선형 회귀"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>일별 따릉이 대여 수를 표로 바꿔 선형 회귀로 예측합니다. 어제 값만 쓰는 기준 예측보다 나아지는지, 기온을 더하면 더 좋아지는지 봅니다. 특성을 더한다고 항상 좋아지지는 않습니다. 기온은 그날 예보를 안다고 가정합니다.</p>\n<ol><li><code>feat</code>: 열 y, lag1(1일 전), lag7(7일 전), roll7(직전 7일 평균), dow(요일), temp(day['temp'])로 만든 표에서 NaN 행을 버린 것</li><li><code>train</code>: 마지막 28일을 뺀 학습 구간</li><li><code>test</code>: 마지막 28일 시험 구간</li><li><code>mae_naive</code>: naive(lag1 그대로)의 시험 구간 MAE</li><li><code>mae_a</code>: lag1, lag7, roll7, dow로 학습한 선형 회귀의 MAE</li><li><code>mae_b</code>: 거기에 temp를 더한 선형 회귀의 MAE</li></ol>",
    "starter": "import pandas as pd\nfrom sklearn.linear_model import LinearRegression\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date').agg(rented=('rented_bikes', 'sum'), temp=('temp', 'mean')).asfreq('D')\nday['rented'] = day['rented'].where(day['rented'] > 0).interpolate()   # 휴무일은 앞뒤 값으로\ny = day['rented']\n\n# 1. 열 y, lag1(1일 전), lag7(7일 전), roll7(직전 7일 평균), dow(요일), temp(day['temp'])로 만든 표에서 NaN 행을 버린 것\nfeat = \n# 2. 마지막 28일을 뺀 학습 구간\ntrain = \n# 3. 마지막 28일 시험 구간\ntest = \n# 4. naive(lag1 그대로)의 시험 구간 MAE\nmae_naive = \n# 5. lag1, lag7, roll7, dow로 학습한 선형 회귀의 MAE\nmae_a = \n# 6. 거기에 temp를 더한 선형 회귀의 MAE\nmae_b = \n\nprint(feat.shape, round(mae_naive), round(mae_a), round(mae_b))\n",
    "solution": "import pandas as pd\nfrom sklearn.linear_model import LinearRegression\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nday = bike.groupby('date').agg(rented=('rented_bikes', 'sum'), temp=('temp', 'mean')).asfreq('D')\nday['rented'] = day['rented'].where(day['rented'] > 0).interpolate()   # 휴무일은 앞뒤 값으로\ny = day['rented']\n\n# 1. 열 y, lag1(1일 전), lag7(7일 전), roll7(직전 7일 평균), dow(요일), temp(day['temp'])로 만든 표에서 NaN 행을 버린 것\nfeat = pd.DataFrame({'y': y, 'lag1': y.shift(1), 'lag7': y.shift(7), 'roll7': y.shift(1).rolling(7).mean(), 'dow': y.index.dayofweek, 'temp': day['temp']}).dropna()\n# 2. 마지막 28일을 뺀 학습 구간\ntrain = feat.iloc[:-28]\n# 3. 마지막 28일 시험 구간\ntest = feat.iloc[-28:]\n# 4. naive(lag1 그대로)의 시험 구간 MAE\nmae_naive = (test['y'] - test['lag1']).abs().mean()\n# 5. lag1, lag7, roll7, dow로 학습한 선형 회귀의 MAE\nmae_a = (test['y'] - LinearRegression().fit(train[['lag1', 'lag7', 'roll7', 'dow']], train['y']).predict(test[['lag1', 'lag7', 'roll7', 'dow']])).abs().mean()\n# 6. 거기에 temp를 더한 선형 회귀의 MAE\nmae_b = (test['y'] - LinearRegression().fit(train[['lag1', 'lag7', 'roll7', 'dow', 'temp']], train['y']).predict(test[['lag1', 'lag7', 'roll7', 'dow', 'temp']])).abs().mean()\n\nprint(feat.shape, round(mae_naive), round(mae_a), round(mae_b))\n",
    "hints": [
      "pd.DataFrame({'y': y, 'lag1': y.shift(1), 'lag7': y.shift(7), 'roll7': y.shift(1).rolling(7).mean(), 'dow': y.index.dayofweek, 'temp': day['temp']}).dropna()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 열 y, lag1(1일 전), lag7(7일 전), roll7(직전 7일 평균), dow(요일), temp(day['temp'])로 만든 표에서 NaN 행을 버린 것",
        "expr": "list(feat.columns) == ['y', 'lag1', 'lag7', 'roll7', 'dow', 'temp'] and len(feat) == 358 and abs(float(feat['roll7'].sum()) - 6362563.785714285) < 1e-3",
        "hint": "pd.DataFrame({'y': y, 'lag1': y.shift(1), 'lag7': y.shift(7), 'roll7': y.shift(1).rolling(7).mean(), 'dow': y.index.dayofweek, 'temp': day['temp']}).dropna()"
      },
      {
        "label": "2단계 마지막 28일을 뺀 학습 구간",
        "expr": "len(train) == 330",
        "hint": "feat.iloc[:-28]"
      },
      {
        "label": "3단계 마지막 28일 시험 구간",
        "expr": "len(test) == 28",
        "hint": "feat.iloc[-28:]"
      },
      {
        "label": "4단계 naive(lag1 그대로)의 시험 구간 MAE",
        "expr": "abs(mae_naive - 3550.785714285714) < 1e-6",
        "hint": "(test['y'] - test['lag1']).abs().mean()"
      },
      {
        "label": "5단계 lag1, lag7, roll7, dow로 학습한 선형 회귀의 MAE",
        "expr": "abs(mae_a - 2970.906597037629) < 0.5",
        "hint": "(test['y'] - LinearRegression().fit(train[['lag1', 'lag7', 'roll7', 'dow']], train['y']).predict(test[['lag1', 'lag7', 'roll7', 'dow']])).abs().mean()"
      },
      {
        "label": "6단계 거기에 temp를 더한 선형 회귀의 MAE",
        "expr": "abs(mae_b - 3125.85361682123) < 0.5",
        "hint": "(test['y'] - LinearRegression().fit(train[['lag1', 'lag7', 'roll7', 'dow', 'temp']], train['y']).predict(test[['lag1', 'lag7', 'roll7', 'dow', 'temp']])).abs().mean()"
      }
    ]
  },
  {
    "id": "59-4",
    "unit": 59,
    "domain": "general",
    "title": "항공 승객: 트리 모델의 천장 확인하기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "DecisionTreeRegressor(max_depth=5, random_state=0)",
        "결정 트리 회귀"
      ],
      [
        "예측.max() <= 학습 정답.max()",
        "천장"
      ],
      [
        "LinearRegression()",
        "추세를 따라가는 모델"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>추세가 있는 시계열에 트리 모델을 그대로 쓰면 어떻게 되는지 확인합니다. 특성은 시간 순번 <code>t</code>와 월 <code>month</code>입니다. 트리의 예측은 학습 때 본 최댓값을 넘지 못합니다.</p>\n<ol><li><code>tree</code>: train으로 학습한 결정 트리 (max_depth=5, random_state=0)</li><li><code>pred_tree</code>: 트리의 시험 구간 예측</li><li><code>capped</code>: 트리 예측의 최댓값이 train 정답의 최댓값 이하인지 (True/False)</li><li><code>mae_tree</code>: 트리의 MAE</li><li><code>mae_lin</code>: 같은 특성으로 학습한 선형 회귀의 MAE</li><li><code>gap</code>: 시험 구간 실제 최댓값 − 트리 예측 최댓값</li></ol>",
    "starter": "import numpy as np\nimport pandas as pd\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.tree import DecisionTreeRegressor\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ntab = pd.DataFrame({'y': df['passengers'].values, 't': np.arange(len(df)), 'month': df['date'].dt.month.values})\ntrain, test = tab.iloc[:-24], tab.iloc[-24:]\ncols = ['t', 'month']\n\n# 1. train으로 학습한 결정 트리 (max_depth=5, random_state=0)\ntree = \n# 2. 트리의 시험 구간 예측\npred_tree = \n# 3. 트리 예측의 최댓값이 train 정답의 최댓값 이하인지 (True/False)\ncapped = \n# 4. 트리의 MAE\nmae_tree = \n# 5. 같은 특성으로 학습한 선형 회귀의 MAE\nmae_lin = \n# 6. 시험 구간 실제 최댓값 − 트리 예측 최댓값\ngap = \n\nprint(round(float(pred_tree.max()), 1), train['y'].max(), capped, round(float(mae_tree), 1), round(float(mae_lin), 1), round(float(gap), 1))\n",
    "solution": "import numpy as np\nimport pandas as pd\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.tree import DecisionTreeRegressor\n\ndf = pd.read_csv('flights.csv')\ndf['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\ntab = pd.DataFrame({'y': df['passengers'].values, 't': np.arange(len(df)), 'month': df['date'].dt.month.values})\ntrain, test = tab.iloc[:-24], tab.iloc[-24:]\ncols = ['t', 'month']\n\n# 1. train으로 학습한 결정 트리 (max_depth=5, random_state=0)\ntree = DecisionTreeRegressor(max_depth=5, random_state=0).fit(train[cols], train['y'])\n# 2. 트리의 시험 구간 예측\npred_tree = tree.predict(test[cols])\n# 3. 트리 예측의 최댓값이 train 정답의 최댓값 이하인지 (True/False)\ncapped = bool(pred_tree.max() <= train['y'].max())\n# 4. 트리의 MAE\nmae_tree = abs(test['y'].values - pred_tree).mean()\n# 5. 같은 특성으로 학습한 선형 회귀의 MAE\nmae_lin = abs(test['y'].values - LinearRegression().fit(train[cols], train['y']).predict(test[cols])).mean()\n# 6. 시험 구간 실제 최댓값 − 트리 예측 최댓값\ngap = test['y'].max() - pred_tree.max()\n\nprint(round(float(pred_tree.max()), 1), train['y'].max(), capped, round(float(mae_tree), 1), round(float(mae_lin), 1), round(float(gap), 1))\n",
    "hints": [
      "DecisionTreeRegressor(max_depth=5, random_state=0).fit(train[cols], train['y'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 train으로 학습한 결정 트리 (max_depth=5, random_state=0)",
        "expr": "hasattr(tree, 'tree_')",
        "hint": "DecisionTreeRegressor(max_depth=5, random_state=0).fit(train[cols], train['y'])"
      },
      {
        "label": "2단계 트리의 시험 구간 예측",
        "expr": "len(pred_tree) == 24 and abs(float(pred_tree.max()) - 464.1666666666667) < 1e-6",
        "hint": "tree.predict(test[cols])"
      },
      {
        "label": "3단계 트리 예측의 최댓값이 train 정답의 최댓값 이하인지 (True/False)",
        "expr": "capped == True",
        "hint": "bool(pred_tree.max() <= train['y'].max())"
      },
      {
        "label": "4단계 트리의 MAE",
        "expr": "abs(mae_tree - 75.29166666666667) < 1e-4",
        "hint": "abs(test['y'].values - pred_tree).mean()"
      },
      {
        "label": "5단계 같은 특성으로 학습한 선형 회귀의 MAE",
        "expr": "abs(mae_lin - 55.05042573167572) < 1e-4",
        "hint": "abs(test['y'].values - LinearRegression().fit(train[cols], train['y']).predict(test[cols])).mean()"
      },
      {
        "label": "6단계 시험 구간 실제 최댓값 − 트리 예측 최댓값",
        "expr": "abs(gap - 157.83333333333331) < 1e-6",
        "hint": "test['y'].max() - pred_tree.max()"
      }
    ]
  },
  {
    "id": "60-1",
    "unit": 60,
    "domain": "mfg",
    "title": "설비 온도: 이동 z-점수로 튀는 값 찾기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "s.rolling(288).mean().shift(1)",
        "직전 하루의 평균 (지금 값 제외)"
      ],
      [
        "(값 − 평균) ÷ 표준편차",
        "z-점수"
      ],
      [
        "불리언.idxmax()",
        "처음 True가 되는 시각"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>5분 간격 설비 온도 <code>m</code>에서, 직전 하루(288개)와 비교해 크게 벗어난 값을 찾습니다. 기준을 만들 때 <code>shift(1)</code>로 지금 값을 빼는 것이 핵심입니다.</p>\n<ol><li><code>mu</code>: 직전 288개의 평균 (rolling 뒤 shift(1))</li><li><code>sd</code>: 직전 288개의 표준편차 (rolling 뒤 shift(1))</li><li><code>z</code>: z-점수 (m − mu) ÷ sd</li><li><code>flag</code>: |z| > 4 인지 (True/False Series)</li><li><code>n_flag</code>: 알람이 울린 점의 수</li><li><code>first</code>: 처음 알람이 울린 시각 (Timestamp)</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\n\n# 1. 직전 288개의 평균 (rolling 뒤 shift(1))\nmu = \n# 2. 직전 288개의 표준편차 (rolling 뒤 shift(1))\nsd = \n# 3. z-점수 (m − mu) ÷ sd\nz = \n# 4. |z| > 4 인지 (True/False Series)\nflag = \n# 5. 알람이 울린 점의 수\nn_flag = \n# 6. 처음 알람이 울린 시각 (Timestamp)\nfirst = \n\nprint(n_flag, first, round(float(z.loc[first]), 1))\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\n\n# 1. 직전 288개의 평균 (rolling 뒤 shift(1))\nmu = m.rolling(288).mean().shift(1)\n# 2. 직전 288개의 표준편차 (rolling 뒤 shift(1))\nsd = m.rolling(288).std().shift(1)\n# 3. z-점수 (m − mu) ÷ sd\nz = (m - mu) / sd\n# 4. |z| > 4 인지 (True/False Series)\nflag = z.abs() > 4\n# 5. 알람이 울린 점의 수\nn_flag = int(flag.sum())\n# 6. 처음 알람이 울린 시각 (Timestamp)\nfirst = flag.idxmax()\n\nprint(n_flag, first, round(float(z.loc[first]), 1))\n",
    "hints": [
      "m.rolling(288).mean().shift(1)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 직전 288개의 평균 (rolling 뒤 shift(1))",
        "expr": "len(mu) == 22695 and abs(float(mu.sum()) - 1924646.5606597222) < 1e-6 * max(1, abs(1924646.5606597222))",
        "hint": "m.rolling(288).mean().shift(1)"
      },
      {
        "label": "2단계 직전 288개의 표준편차 (rolling 뒤 shift(1))",
        "expr": "len(sd) == 22695 and abs(float(sd.sum()) - 132840.6228120873) < 1e-6 * max(1, abs(132840.6228120873))",
        "hint": "m.rolling(288).std().shift(1)"
      },
      {
        "label": "3단계 z-점수 (m − mu) ÷ sd",
        "expr": "len(z) == 22695 and abs(float(z.abs().sum()) - 25017.571084319534) < 1e-6 * max(1, abs(25017.571084319534))",
        "hint": "(m - mu) / sd"
      },
      {
        "label": "4단계 |z| > 4 인지 (True/False Series)",
        "expr": "len(flag) == 22695 and int(flag.sum()) == 304",
        "hint": "z.abs() > 4"
      },
      {
        "label": "5단계 알람이 울린 점의 수",
        "expr": "n_flag == 304",
        "hint": "int(flag.sum())"
      },
      {
        "label": "6단계 처음 알람이 울린 시각 (Timestamp)",
        "expr": "str(first) == '2013-12-15 19:30:00'",
        "hint": "flag.idxmax()"
      }
    ]
  },
  {
    "id": "60-2",
    "unit": 60,
    "domain": "mfg",
    "title": "고정 기준선 알람을 실제 고장 기록과 맞춰 보기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "low & ~low.shift(1, fill_value=False)",
        "False에서 True로 바뀌는 순간"
      ],
      [
        "s.loc[시작:끝].any()",
        "구간 안에 True가 있는지"
      ],
      [
        "잡은 고장 ÷ 전체 고장",
        "재현율"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>'온도가 40 아래로 떨어지면 알람'이라는 고정 기준선을 씁니다. 알람이 몇 번 울렸는지 세고, 실제 고장 4건 가운데 고장 시각 앞 24시간 안에 알람이 있었던 건수를 구합니다.</p>\n<ol><li><code>low</code>: 온도가 40 미만인지 (True/False Series)</li><li><code>start</code>: 알람이 새로 시작된 순간 (직전은 False, 지금은 True)</li><li><code>n_events</code>: 알람이 울린 횟수 (연속 구간은 한 번으로)</li><li><code>hits</code>: 고장 시각 앞 24시간 안에 low가 한 번이라도 True였던 고장 수</li><li><code>recall</code>: 재현율 hits ÷ 고장 수</li><li><code>false_events</code>: 어느 고장의 앞 24시간에도 속하지 않는 알람 시작 수</li></ol>",
    "starter": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nlabels = pd.to_datetime(['2013-12-11 06:00', '2013-12-16 17:25', '2014-01-28 13:55', '2014-02-08 14:30'])   # 실제 고장 시각\n\n# 1. 온도가 40 미만인지 (True/False Series)\nlow = \n# 2. 알람이 새로 시작된 순간 (직전은 False, 지금은 True)\nstart = \n# 3. 알람이 울린 횟수 (연속 구간은 한 번으로)\nn_events = \n# 4. 고장 시각 앞 24시간 안에 low가 한 번이라도 True였던 고장 수\nhits = \n# 5. 재현율 hits ÷ 고장 수\nrecall = \n# 6. 어느 고장의 앞 24시간에도 속하지 않는 알람 시작 수\nfalse_events = \n\nprint(int(low.sum()), n_events, hits, recall, false_events)\n",
    "solution": "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nlabels = pd.to_datetime(['2013-12-11 06:00', '2013-12-16 17:25', '2014-01-28 13:55', '2014-02-08 14:30'])   # 실제 고장 시각\n\n# 1. 온도가 40 미만인지 (True/False Series)\nlow = m < 40\n# 2. 알람이 새로 시작된 순간 (직전은 False, 지금은 True)\nstart = low & ~low.shift(1, fill_value=False)\n# 3. 알람이 울린 횟수 (연속 구간은 한 번으로)\nn_events = int(start.sum())\n# 4. 고장 시각 앞 24시간 안에 low가 한 번이라도 True였던 고장 수\nhits = sum(bool(low.loc[t - pd.Timedelta('1D'):t].any()) for t in labels)\n# 5. 재현율 hits ÷ 고장 수\nrecall = hits / len(labels)\n# 6. 어느 고장의 앞 24시간에도 속하지 않는 알람 시작 수\nfalse_events = sum(not any(t - pd.Timedelta('1D') <= s <= t for t in labels) for s in start[start].index)\n\nprint(int(low.sum()), n_events, hits, recall, false_events)\n",
    "hints": [
      "m < 40",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 온도가 40 미만인지 (True/False Series)",
        "expr": "len(low) == 22695 and int(low.sum()) == 399",
        "hint": "m < 40"
      },
      {
        "label": "2단계 알람이 새로 시작된 순간 (직전은 False, 지금은 True)",
        "expr": "len(start) == 22695 and int(start.sum()) == 5",
        "hint": "low & ~low.shift(1, fill_value=False)"
      },
      {
        "label": "3단계 알람이 울린 횟수 (연속 구간은 한 번으로)",
        "expr": "n_events == 5",
        "hint": "int(start.sum())"
      },
      {
        "label": "4단계 고장 시각 앞 24시간 안에 low가 한 번이라도 True였던 고장 수",
        "expr": "hits == 2",
        "hint": "sum(bool(low.loc[t - pd.Timedelta('1D'):t].any()) for t in labels)"
      },
      {
        "label": "5단계 재현율 hits ÷ 고장 수",
        "expr": "abs(recall - 0.5) < 1e-6",
        "hint": "hits / len(labels)"
      },
      {
        "label": "6단계 어느 고장의 앞 24시간에도 속하지 않는 알람 시작 수",
        "expr": "false_events == 0",
        "hint": "sum(not any(t - pd.Timedelta('1D') <= s <= t for t in labels) for s in start[start].index)"
      }
    ]
  },
  {
    "id": "60-3",
    "unit": 60,
    "domain": "general",
    "title": "따릉이: '그 시각의 평소'와 비교해 이상 찾기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "s.groupby(s.index.hour).transform('median')",
        "시각별 중앙값을 각 행에"
      ],
      [
        "1.4826 × MAD",
        "이상치에 강한 표준편차 추정"
      ],
      [
        "s.idxmax()",
        "가장 큰 값의 시각"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>2018년 6월 시간별 대여 수 <code>rented</code>입니다. 새벽의 30대는 평범하지만 퇴근 시간의 30대는 이상합니다. 시각별 중앙값을 빼고, 남은 차이가 평소보다 얼마나 큰지 점수로 만듭니다.</p>\n<ol><li><code>usual</code>: 각 행의 '그 시각(0~23시) 중앙값'</li><li><code>resid</code>: 실제 − 평소 (rented − usual)</li><li><code>mad</code>: resid 절댓값의 중앙값</li><li><code>score</code>: 이상 점수 |resid| ÷ (1.4826 × mad)</li><li><code>n_out</code>: 점수가 5보다 큰 시각 수</li><li><code>worst</code>: 점수가 가장 큰 시각 (Timestamp)</li></ol>",
    "starter": "import pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nbike['ts'] = bike['date'] + pd.to_timedelta(bike['hour'], unit='h')\nrented = bike.set_index('ts').loc['2018-06', 'rented_bikes'].asfreq('h')\n\n# 1. 각 행의 '그 시각(0~23시) 중앙값'\nusual = \n# 2. 실제 − 평소 (rented − usual)\nresid = \n# 3. resid 절댓값의 중앙값\nmad = \n# 4. 이상 점수 |resid| ÷ (1.4826 × mad)\nscore = \n# 5. 점수가 5보다 큰 시각 수\nn_out = \n# 6. 점수가 가장 큰 시각 (Timestamp)\nworst = \n\nprint(round(float(mad), 1), n_out, worst, int(rented.loc[worst]), int(usual.loc[worst]))\n",
    "solution": "import pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nbike['ts'] = bike['date'] + pd.to_timedelta(bike['hour'], unit='h')\nrented = bike.set_index('ts').loc['2018-06', 'rented_bikes'].asfreq('h')\n\n# 1. 각 행의 '그 시각(0~23시) 중앙값'\nusual = rented.groupby(rented.index.hour).transform('median')\n# 2. 실제 − 평소 (rented − usual)\nresid = rented - usual\n# 3. resid 절댓값의 중앙값\nmad = resid.abs().median()\n# 4. 이상 점수 |resid| ÷ (1.4826 × mad)\nscore = resid.abs() / (1.4826 * mad)\n# 5. 점수가 5보다 큰 시각 수\nn_out = int((score > 5).sum())\n# 6. 점수가 가장 큰 시각 (Timestamp)\nworst = score.idxmax()\n\nprint(round(float(mad), 1), n_out, worst, int(rented.loc[worst]), int(usual.loc[worst]))\n",
    "hints": [
      "rented.groupby(rented.index.hour).transform('median')",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 각 행의 '그 시각(0~23시) 중앙값'",
        "expr": "len(usual) == 720 and abs(float(usual.sum()) - 952605.0) < 1e-6 * max(1, abs(952605.0))",
        "hint": "rented.groupby(rented.index.hour).transform('median')"
      },
      {
        "label": "2단계 실제 − 평소 (rented − usual)",
        "expr": "len(resid) == 720 and abs(float(resid.abs().sum()) - 202865.0) < 1e-6 * max(1, abs(202865.0))",
        "hint": "rented - usual"
      },
      {
        "label": "3단계 resid 절댓값의 중앙값",
        "expr": "abs(mad - 150.75) < 1e-6",
        "hint": "resid.abs().median()"
      },
      {
        "label": "4단계 이상 점수 |resid| ÷ (1.4826 × mad)",
        "expr": "len(score) == 720 and abs(float(score.sum()) - 907.6654588472271) < 1e-6 * max(1, abs(907.6654588472271))",
        "hint": "resid.abs() / (1.4826 * mad)"
      },
      {
        "label": "5단계 점수가 5보다 큰 시각 수",
        "expr": "n_out == 42",
        "hint": "int((score > 5).sum())"
      },
      {
        "label": "6단계 점수가 가장 큰 시각 (Timestamp)",
        "expr": "str(worst) == '2018-06-26 18:00:00'",
        "hint": "score.idxmax()"
      }
    ]
  },
  {
    "id": "60-4",
    "unit": 60,
    "domain": "general",
    "title": "배송 시간: 3시그마가 놓친 작은 변화를 CUSUM으로 잡기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "np.abs(x − 목표) > 3 × sd",
        "3시그마 기준"
      ],
      [
        "cusum(x, 목표, k)",
        "초과분을 누적"
      ],
      [
        "np.argmax(조건)",
        "처음 True가 되는 위치"
      ]
    ],
    "origin": "시계열",
    "desc": "<p>가상의 일별 평균 배송 시간(분) 70일치입니다. 41일째부터 평균이 1.5분쯤 늘었지만 하루하루는 평소 범위 안입니다. 처음 20일을 기준으로 삼아 3시그마 기준과 CUSUM을 비교합니다.</p>\n<ol><li><code>target</code>: 처음 20일의 평균 (목표값)</li><li><code>sd</code>: 처음 20일의 표준편차 (ddof=1)</li><li><code>n_3s</code>: 목표에서 3 × sd 넘게 벗어난 날 수</li><li><code>c</code>: k = 0.5 × sd 로 계산한 CUSUM 배열</li><li><code>alarm_day</code>: CUSUM이 처음으로 5 × sd를 넘은 날 (0부터 세는 위치, 정수)</li></ol>",
    "starter": "import numpy as np\n\nrng = np.random.default_rng(27)\nx = np.r_[rng.normal(30, 2, 40), rng.normal(31.5, 2, 30)].round(1)   # 41일째부터 평균이 올라감\n\ndef cusum(x, target, k):\n    c, out = 0.0, []\n    for v in x:\n        c = max(0.0, c + v - target - k)   # 목표 + k 를 넘은 만큼만 쌓는다\n        out.append(c)\n    return np.array(out)\n\n# 1. 처음 20일의 평균 (목표값)\ntarget = \n# 2. 처음 20일의 표준편차 (ddof=1)\nsd = \n# 3. 목표에서 3 × sd 넘게 벗어난 날 수\nn_3s = \n# 4. k = 0.5 × sd 로 계산한 CUSUM 배열\nc = \n# 5. CUSUM이 처음으로 5 × sd를 넘은 날 (0부터 세는 위치, 정수)\nalarm_day = \n\nprint(round(float(target), 2), round(float(sd), 2), n_3s, alarm_day, round(float(c.max()), 1))\n",
    "solution": "import numpy as np\n\nrng = np.random.default_rng(27)\nx = np.r_[rng.normal(30, 2, 40), rng.normal(31.5, 2, 30)].round(1)   # 41일째부터 평균이 올라감\n\ndef cusum(x, target, k):\n    c, out = 0.0, []\n    for v in x:\n        c = max(0.0, c + v - target - k)   # 목표 + k 를 넘은 만큼만 쌓는다\n        out.append(c)\n    return np.array(out)\n\n# 1. 처음 20일의 평균 (목표값)\ntarget = x[:20].mean()\n# 2. 처음 20일의 표준편차 (ddof=1)\nsd = x[:20].std(ddof=1)\n# 3. 목표에서 3 × sd 넘게 벗어난 날 수\nn_3s = int((np.abs(x - target) > 3 * sd).sum())\n# 4. k = 0.5 × sd 로 계산한 CUSUM 배열\nc = cusum(x, target, 0.5 * sd)\n# 5. CUSUM이 처음으로 5 × sd를 넘은 날 (0부터 세는 위치, 정수)\nalarm_day = int(np.argmax(c > 5 * sd))\n\nprint(round(float(target), 2), round(float(sd), 2), n_3s, alarm_day, round(float(c.max()), 1))\n",
    "hints": [
      "x[:20].mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 처음 20일의 평균 (목표값)",
        "expr": "abs(target - 29.55) < 1e-6",
        "hint": "x[:20].mean()"
      },
      {
        "label": "2단계 처음 20일의 표준편차 (ddof=1)",
        "expr": "abs(sd - 1.9845455531762377) < 1e-6",
        "hint": "x[:20].std(ddof=1)"
      },
      {
        "label": "3단계 목표에서 3 × sd 넘게 벗어난 날 수",
        "expr": "n_3s == 0",
        "hint": "int((np.abs(x - target) > 3 * sd).sum())"
      },
      {
        "label": "4단계 k = 0.5 × sd 로 계산한 CUSUM 배열",
        "expr": "len(c) == 70 and abs(float(c.sum()) - 700.1008752605497) < 1e-6 * max(1, abs(700.1008752605497))",
        "hint": "cusum(x, target, 0.5 * sd)"
      },
      {
        "label": "5단계 CUSUM이 처음으로 5 × sd를 넘은 날 (0부터 세는 위치, 정수)",
        "expr": "alarm_day == 46",
        "hint": "int(np.argmax(c > 5 * sd))"
      }
    ]
  }
];
