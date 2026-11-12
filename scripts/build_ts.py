"""시계열 분석 트랙 유닛 52~60 문제 생성기.

python3 scripts/build_ts.py  ->  problems-ts.js   (pandas · statsmodels · scikit-learn 필요, datasets/ 에서 실행됨)
모범답안을 실제로 실행해 정답 값을 채우고, 모범답안의 `# N. 설명` 다음 줄 `변수 = 식`에서 식을 비워 시작 코드를 만든다.
"""
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(os.path.join(ROOT, "datasets"))   # 모범답안이 read_csv('파일.csv')로 읽는다

UNITS = [
    {"id": 52, "title": "시계열 데이터 준비", "summary": "날짜 인덱스, 간격 확인, resample 집계, 결측 채우기",
     "note": "<h4>시간을 인덱스로</h4><p><code>pd.to_datetime(열)</code>로 날짜 타입을 만들고 <code>set_index</code>로 인덱스에 올리면 <code>s.loc['2013-12']</code>처럼 기간으로 고를 수 있습니다.</p>"
             "<h4>간격이 고른지 확인</h4><p><code>s.index.to_series().diff()</code>는 이웃한 시각의 차이입니다. <code>asfreq('D')</code>는 빠진 날짜를 NaN 행으로 드러냅니다.</p>"
             "<h4>묶는 계산 고르기</h4><p><code>resample('h')</code> 뒤에 쌓이는 양은 <code>sum</code>, 온도 같은 상태값은 <code>mean</code>이나 <code>max</code>를 씁니다. 빈칸은 <code>interpolate()</code>로 앞뒤 값을 이어 채웁니다.</p>"},
    {"id": 53, "title": "시계열 분해", "summary": "이동평균, 주기별 평균, seasonal_decompose, STL",
     "note": "<h4>이동평균</h4><p><code>s.rolling(24).mean()</code>은 최근 24칸 평균입니다. <code>center=True</code>를 주면 앞뒤로 고르게 봅니다. 처음 몇 칸은 값이 모자라 NaN입니다.</p>"
             "<h4>분해</h4><p><code>seasonal_decompose(y, model='multiplicative', period=12)</code>는 추세 · 계절 · 잔차를 돌려줍니다. 물결 높이가 수준과 함께 커지면 곱셈형입니다.</p>"
             "<h4>STL</h4><p><code>STL(y, period=12).fit()</code>은 끝부분까지 추세를 내 주고 이상치에 덜 흔들립니다. <code>res.trend</code>, <code>res.seasonal</code>, <code>res.resid</code>로 꺼냅니다.</p>"},
    {"id": 54, "title": "자기상관", "summary": "shift와 상관계수, ACF · PACF, Ljung-Box 검정",
     "note": "<h4>자기상관</h4><p>원래 시계열과 k칸 민 시계열의 상관계수입니다. <code>s.corr(s.shift(k))</code> 또는 <code>s.autocorr(k)</code>.</p>"
             "<h4>ACF · PACF</h4><p><code>acf(s, nlags=24)</code>는 래그 0~24의 자기상관 배열입니다(0번은 항상 1). 기준선 ±1.96 ÷ √n 을 넘으면 우연으로 보기 어렵습니다. <code>pacf</code>는 중간 래그의 몫을 뺀 직접 영향입니다.</p>"
             "<h4>Ljung-Box</h4><p><code>acorr_ljungbox(s, lags=[24])</code>의 p-값이 작으면 '자기상관이 남아 있다'는 뜻입니다.</p>"},
    {"id": 55, "title": "정상성과 차분", "summary": "diff, 로그 변환, ADF · KPSS 검정",
     "note": "<h4>차분</h4><p><code>s.diff()</code>는 한 칸 전과의 차이(추세 제거), <code>s.diff(12)</code>는 한 주기 전과의 차이(계절 제거)입니다. 차분한 만큼 앞쪽 행이 NaN이 됩니다.</p>"
             "<h4>검정 두 가지</h4><p><code>adfuller(s)[1]</code>이 0.05보다 작으면 정상으로 봅니다(출발 가정: 비정상). <code>kpss(s, nlags='auto')[1]</code>은 반대로 0.05보다 작으면 비정상입니다(출발 가정: 정상).</p>"
             "<h4>로그</h4><p>흔들리는 폭이 수준과 함께 커지면 <code>np.log</code>를 먼저 씌웁니다.</p>"},
    {"id": 56, "title": "예측의 기본기", "summary": "시간 순서 분할, 기준 예측, MAE · MAPE · MASE, 롤링 원점",
     "note": "<h4>시간 순서대로 나누기</h4><p>섞지 않고 <code>train = y.iloc[:-h]</code>, <code>test = y.iloc[-h:]</code>로 자릅니다.</p>"
             "<h4>기준 예측</h4><p>naive는 마지막 값, seasonal naive는 지난 한 주기를 그대로 복사한 값입니다. 모델은 이 선을 넘어야 의미가 있습니다.</p>"
             "<h4>지표</h4><p>MAE = |오차|의 평균, MAPE = |오차| ÷ 실제값의 평균(%), MASE = MAE ÷ (학습 구간에서 naive가 낸 MAE). MASE가 1보다 작으면 naive보다 낫습니다.</p>"},
    {"id": 57, "title": "지수평활", "summary": "ewm으로 직접 평활, SimpleExpSmoothing, Holt-Winters",
     "note": "<h4>지수평활</h4><p>새 수준 = α × 새 값 + (1 − α) × 이전 수준. <code>s.ewm(alpha=0.3, adjust=False).mean()</code>이 같은 계산입니다. α가 클수록 최근 값을 더 따라갑니다.</p>"
             "<h4>statsmodels</h4><p><code>SimpleExpSmoothing(train).fit()</code>은 α를 스스로 고릅니다. 추세 · 계절이 있으면 <code>ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12)</code>.</p>"
             "<h4>예측</h4><p><code>fit.forecast(h)</code>가 앞으로 h칸의 예측입니다.</p>"},
    {"id": 58, "title": "ARIMA", "summary": "ARIMA 적합, AIC 비교, 예측 구간, 계절 · 외부 변수",
     "note": "<h4>ARIMA(p, d, q)</h4><p>p는 과거 값 몇 개, d는 차분 횟수, q는 과거 오차 몇 개를 쓰는지입니다. <code>ARIMA(train, order=(1, 1, 1)).fit()</code>.</p>"
             "<h4>고르기와 점검</h4><p>AIC(<code>fit.aic</code>)가 작은 쪽을 고르고, 잔차에 자기상관이 남았는지 Ljung-Box로 봅니다.</p>"
             "<h4>구간</h4><p><code>fit.get_forecast(h).conf_int()</code>는 예측 구간의 아래 · 위 값입니다. 멀리 갈수록 넓어집니다. 계절은 <code>seasonal_order=(P, D, Q, 주기)</code>, 외부 변수는 <code>exog</code>로 넣습니다.</p>"},
    {"id": 59, "title": "머신러닝으로 예측하기", "summary": "래그 · 이동 특성, 시간 순서 분할, 선형 · 트리 모델 비교",
     "note": "<h4>표로 바꾸기</h4><p><code>s.shift(1)</code>(하루 전), <code>s.shift(7)</code>(일주일 전), <code>s.shift(1).rolling(7).mean()</code>(어제까지의 7일 평균)을 특성으로 둡니다. 이동 통계 앞에 <code>shift(1)</code>을 빼먹으면 오늘 값이 섞여 들어갑니다(누수).</p>"
             "<h4>검증</h4><p>섞지 않고 뒤쪽 구간을 시험용으로 둡니다. 기준 예측(lag1을 그대로 쓰기)과 꼭 비교합니다.</p>"
             "<h4>트리의 천장</h4><p>트리 모델은 학습 때 본 정답 범위 밖의 값을 낼 수 없습니다. 추세가 있으면 차분하거나 선형 모델을 씁니다.</p>"},
    {"id": 60, "title": "시계열 이상 탐지", "summary": "이동 z-점수, 고정 기준선과 알람 평가, 시각별 기준, CUSUM",
     "note": "<h4>이동 z-점수</h4><p>(값 − 직전 구간 평균) ÷ 직전 구간 표준편차. 기준을 만들 때 <code>shift(1)</code>로 지금 값을 빼야 이상치가 자기 기준을 흐리지 않습니다.</p>"
             "<h4>맥락을 반영한 기준</h4><p>시각마다 평소 값이 다르면 <code>groupby(시각).transform('median')</code>으로 '그 시각의 평소'를 빼고 봅니다.</p>"
             "<h4>CUSUM</h4><p>기준보다 조금 높은 값이 이어질 때, 초과분을 계속 더해 작은 수준 변화를 잡습니다. C = max(0, 이전 C + 값 − 목표 − k).</p>"},
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
        expr = tmpl(ns, var) if callable(tmpl) else tmpl.format(v=repr(v), var=var)
        assert eval(expr, ns), (pid, var, expr)
        checks.append({"label": f"{k}단계 {label}", "expr": expr, "hint": rhs})
    desc = f"<p>{intro}</p>\n<ol>" + "".join(f"<li><code>{var}</code>: {label}</li>" for var, label, _, _ in items) + "</ol>"
    PROBLEMS.append({
        "id": pid, "unit": int(pid.split("-")[0]), "domain": domain, "title": title, "type": "steps", "level": level,
        "uses": uses, "origin": "시계열", "desc": desc, "starter": starter, "solution": solution,
        "hints": [items[0][2], extra_hint], "checks": checks,
    })


F = "abs({var} - {v}) < 1e-6"          # pandas · numpy로 바로 구하는 값
T = "abs({var} - {v}) < 1e-3 * max(1, abs({v}))"    # 통계 검정 · 분해 결과
M = "abs({var} - {v}) < 0.03 * max(1, abs({v}))"    # 최적화로 맞춘 모델 결과(환경마다 조금 다를 수 있음)
I = "{var} == {v}"


def S(agg="sum()", tol="1e-6"):
    """Series · 배열 확인: 길이와 요약값 하나."""
    def make(ns, var):
        val = float(eval(f"{var}.{agg}", ns))
        return f"len({var}) == {len(ns[var])} and abs(float({var}.{agg}) - {val!r}) < {tol} * max(1, abs({val!r}))"
    return make


def HAS(attr):
    return lambda ns, var: f"hasattr({var}, '{attr}')"


W = "import warnings\nwarnings.filterwarnings('ignore')\n"
MACHINE = "import pandas as pd\n\nm = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']"
HOURLY = MACHINE + "\nhourly = m.resample('h').mean().interpolate()   # 시간별 평균 온도"
FLIGHTS = ("import pandas as pd\n\ndf = pd.read_csv('flights.csv')\n"
           "df['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\n"
           "y = df.set_index('date')['passengers'].asfreq('MS')   # 월별 승객 수(천 명)")
BIKE = ("import pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\n"
        "day = bike.groupby('date')['rented_bikes'].sum().asfreq('D')\n"
        "day = day.where(day > 0).interpolate()   # 휴무일(0대)은 앞뒤 값으로 채움")
CO2 = "import pandas as pd\n\nco2 = pd.read_csv('co2.csv', parse_dates=['date']).set_index('date')['co2']\nco2m = co2.resample('MS').mean().interpolate()   # 월평균 CO2 농도(ppm)"


def imp(base, *lines):
    """base 맨 위 import 블록에 import 줄을 더한다 (import는 항상 맨 위)."""
    head, rest = base.split("\n\n", 1)
    lines = sorted(set(head.split("\n")) | set(lines), key=lambda s: (s.startswith("from"), s))
    return "\n".join(lines) + "\n\n" + rest


# ───────────── 유닛 52 시계열 데이터 준비 ─────────────
steps("52-1", "mfg", "설비 온도 로그: 시간 인덱스 만들고 간격 확인하기", 1,
      [["pd.to_datetime(열)", "문자열을 날짜 타입으로"], ["s.index.to_series().diff()", "이웃한 시각의 차이"], ["s.loc['2013-12']", "기간으로 고르기"]],
      "설비 온도 센서 로그 <code>machine_temp.csv</code>(timestamp, temp)입니다. 시각을 인덱스로 올리고, 몇 분 간격으로 기록됐는지 확인합니다.",
      "import pandas as pd\n\nraw = pd.read_csv('machine_temp.csv')",
      [("ts", "timestamp 열을 날짜 타입으로 바꾼 Series", "pd.to_datetime(raw['timestamp'])", lambda ns, var: f"str({var}.dtype).startswith('datetime64') and len({var}) == 22695"),
       ("m", "ts를 인덱스로 한 temp Series", "raw.set_index(ts)['temp']", lambda ns, var: f"isinstance({var}.index, pd.DatetimeIndex) and abs(float({var}.sum()) - {float(ns[var].sum())!r}) < 1e-3"),
       ("gap", "이웃한 시각 차이 중 가장 흔한 값 (Timedelta)", "m.index.to_series().diff().mode()[0]", "{var} == pd.Timedelta('5min')"),
       ("per_day", "하루에 기록되는 횟수 (정수)", "int(pd.Timedelta('1D') / gap)", I),
       ("span_days", "첫 기록부터 마지막 기록까지 지난 날 수 (정수)", "(m.index[-1] - m.index[0]).days", I),
       ("n_dec", "2013년 12월 기록 수", "len(m.loc['2013-12'])", I)],
      "print(gap, per_day, span_days, n_dec)")

steps("52-2", "mfg", "5분 간격 온도를 시간별 · 일별로 묶기", 2,
      [["s.resample('h').mean()", "시간별 평균"], ["s.resample('D').max()", "일별 최댓값"], ["s.idxmax()", "가장 큰 값의 인덱스"]],
      "5분 간격 설비 온도 <code>m</code>을 더 큰 단위로 묶습니다. 온도는 쌓이는 양이 아니라 상태값이므로 합계가 아니라 평균 · 최대 · 최소를 씁니다.",
      MACHINE,
      [("hourly", "시간별 평균 온도", "m.resample('h').mean()", S()),
       ("n_hours", "hourly의 행 수", "len(hourly)", I),
       ("daily_max", "일별 최고 온도", "m.resample('D').max()", S()),
       ("hot_day", "최고 온도가 가장 높았던 날 (Timestamp)", "daily_max.idxmax()", lambda ns, var: f"str({var})[:10] == '{str(ns[var])[:10]}'"),
       ("daily_range", "일별 온도 폭 (최고 − 최저)", "m.resample('D').max() - m.resample('D').min()", S()),
       ("wild_day", "온도 폭이 가장 컸던 날 (Timestamp)", "daily_range.idxmax()", lambda ns, var: f"str({var})[:10] == '{str(ns[var])[:10]}'")],
      "print(n_hours, hot_day.date(), round(daily_max.max(), 1), wild_day.date(), round(daily_range.max(), 1))")

steps("52-3", "general", "항공 승객: 연 · 월 열로 날짜 인덱스 만들기", 1,
      [["pd.to_datetime(문자열, format='%Y-%B')", "'1949-January' 꼴 읽기"], ["s.asfreq('MS')", "월초 간격으로 맞추기"], ["s.resample('YS').sum()", "연도별 합계"]],
      "<code>flights.csv</code>에는 연도(<code>year</code>)와 영어 월 이름(<code>month</code>)이 따로 들어 있습니다. 둘을 합쳐 날짜 인덱스를 만들고 연도별로 묶어 봅니다.",
      "import pandas as pd\n\ndf = pd.read_csv('flights.csv')",
      [("date", "'1949-January' 꼴 문자열을 날짜로 바꾼 Series", "pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')", lambda ns, var: f"str({var}.dtype).startswith('datetime64') and str({var}.iloc[1])[:10] == '1949-02-01'"),
       ("y", "date를 인덱스로 한 passengers Series (월초 간격 'MS')", "df.set_index(date)['passengers'].asfreq('MS')", lambda ns, var: f"len({var}) == 144 and {var}.index.freqstr == 'MS' and int({var}.sum()) == {int(ns[var].sum())}"),
       ("y_1955", "1955년 12개월의 승객 수", "y.loc['1955']", S()),
       ("yearly", "연도별 승객 합계", "y.resample('YS').sum()", S("iloc[-1]")),
       ("growth", "마지막 해 합계 ÷ 첫 해 합계", "yearly.iloc[-1] / yearly.iloc[0]", F)],
      "print(y_1955.sum(), yearly.iloc[0], yearly.iloc[-1], round(growth, 2))")

steps("52-4", "general", "따릉이: 시간별 대여를 일별로 묶고 휴무일 처리하기", 2,
      [["df.groupby('date')[열].sum()", "날짜별 합계"], ["s.where(조건)", "조건에 안 맞는 값은 NaN으로"], ["s.interpolate()", "앞뒤 값을 이어 채우기"]],
      "<code>seoul_bike.csv</code>는 시간별 대여 수입니다. 대여 수는 쌓이는 양이므로 합계로 일별 시계열을 만듭니다. 운영하지 않은 날은 0으로 찍혀 있어 그대로 두면 급락처럼 보입니다.",
      "import pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])",
      [("day", "날짜별 rented_bikes 합계 (일 간격 'D'로 맞춤)", "bike.groupby('date')['rented_bikes'].sum().asfreq('D')", S()),
       ("n_zero", "대여가 0대인 날 수", "int((day == 0).sum())", I),
       ("day_nan", "0대인 날을 NaN으로 바꾼 Series", "day.where(day > 0)", lambda ns, var: f"len({var}) == 365 and int({var}.isna().sum()) == 12"),
       ("day_fill", "NaN을 앞뒤 값으로 이어 채운 Series", "day_nan.interpolate()", S()),
       ("weekly", "day_fill의 주별 평균", "day_fill.resample('W').mean()", S())],
      "print(len(day), n_zero, round(day_fill.mean()), len(weekly))")

# ───────────── 유닛 53 시계열 분해 ─────────────
steps("53-1", "mfg", "이동평균으로 설비 온도의 큰 흐름 보기", 1,
      [["s.rolling(24).mean()", "최근 24칸 평균"], ["rolling(24, center=True)", "앞뒤로 고르게"], ["s.isna().sum()", "빈칸 수"]],
      "시간별 설비 온도 <code>hourly</code>에 24시간 이동평균을 씌워 큰 흐름을 뽑고, 원래 값에서 빼서 남는 흔들림의 크기를 봅니다.",
      HOURLY,
      [("ma24", "최근 24시간 이동평균", "hourly.rolling(24).mean()", S()),
       ("n_nan", "ma24에서 값이 없는 칸 수", "int(ma24.isna().sum())", I),
       ("ma24c", "가운데 맞춤(center=True) 24시간 이동평균", "hourly.rolling(24, center=True).mean()", S("dropna().iloc[0]")),
       ("detr", "원래 값 − ma24c (큰 흐름을 뺀 나머지)", "hourly - ma24c", S("abs().sum()")),
       ("ratio", "detr의 표준편차 ÷ hourly의 표준편차", "detr.std() / hourly.std()", F)],
      "print(n_nan, round(ma24.iloc[-1], 2), round(detr.std(), 2), round(ratio, 3))")

steps("53-2", "mfg", "설비 온도에 하루 주기가 있을까: 시각별 평균으로 확인", 2,
      [["s.groupby(s.index.hour).mean()", "시각(0~23시)별 평균"], ["s.index.dayofweek", "요일 (월 0 ~ 일 6)"], ["폭 ÷ 표준편차", "주기가 얼마나 뚜렷한지"]],
      "분해하기 전에 주기가 정말 있는지부터 봅니다. 시각별 · 요일별 평균의 폭이 전체 흔들림(표준편차)에 비해 작다면, 그 주기는 약한 것입니다.",
      HOURLY,
      [("by_hour", "시각(0~23시)별 평균 온도", "hourly.groupby(hourly.index.hour).mean()", S()),
       ("span_hour", "by_hour의 최댓값 − 최솟값", "by_hour.max() - by_hour.min()", F),
       ("by_dow", "요일별 평균 온도", "hourly.groupby(hourly.index.dayofweek).mean()", S()),
       ("span_dow", "by_dow의 최댓값 − 최솟값", "by_dow.max() - by_dow.min()", F),
       ("strength", "span_hour ÷ hourly의 표준편차", "span_hour / hourly.std()", F)],
      "print(round(span_hour, 2), round(span_dow, 2), round(hourly.std(), 2), round(strength, 2))")

steps("53-3", "general", "항공 승객: 곱셈형 분해로 성수기 찾기", 2,
      [["seasonal_decompose(y, model='multiplicative', period=12)", "추세 × 계절 × 잔차"], ["res.seasonal", "계절 지수 (1이면 평소)"], ["y / res.seasonal", "계절 조정"]],
      "월별 항공 승객 <code>y</code>는 해가 갈수록 물결이 커지는 곱셈형입니다. 분해해서 어느 달이 평소의 몇 배인지 보고, 계절을 걷어 낸 값을 만듭니다.",
      imp(FLIGHTS, "from statsmodels.tsa.seasonal import seasonal_decompose"),
      [("res", "곱셈형, 주기 12로 분해한 결과", "seasonal_decompose(y, model='multiplicative', period=12)", HAS("seasonal")),
       ("season", "월(1~12)별 계절 지수", "res.seasonal.groupby(res.seasonal.index.month).mean()", S("iloc[6]", "1e-4")),
       ("peak_month", "계절 지수가 가장 큰 달 (정수)", "int(season.idxmax())", I),
       ("n_trend_nan", "추세에서 값이 없는 칸 수", "int(res.trend.isna().sum())", I),
       ("adj", "계절 조정 값 (y ÷ 계절 지수)", "y / res.seasonal", S("sum()", "1e-4"))],
      "print(peak_month, round(season.max(), 3), round(season.min(), 3), n_trend_nan, round(adj.iloc[-1], 1))")

steps("53-4", "general", "CO2 농도: STL로 추세와 계절 나누기", 2,
      [["STL(y, period=12).fit()", "추세 · 계절 · 잔차"], ["res.trend / res.seasonal / res.resid", "성분 꺼내기"], ["1 − Var(잔차) ÷ Var(계절 + 잔차)", "계절 강도"]],
      "하와이 마우나로아의 월평균 CO2 농도 <code>co2m</code>입니다. STL로 나눠서 얼마나 올랐는지, 한 해 안에서 얼마나 오르내리는지, 계절이 얼마나 뚜렷한지 숫자로 냅니다.",
      imp(CO2, "from statsmodels.tsa.seasonal import STL"),
      [("res", "주기 12로 STL 분해한 결과", "STL(co2m, period=12).fit()", HAS("trend")),
       ("rise", "추세의 마지막 값 − 첫 값 (ppm)", "res.trend.iloc[-1] - res.trend.iloc[0]", T),
       ("amp", "계절 성분의 최댓값 − 최솟값 (ppm)", "res.seasonal.max() - res.seasonal.min()", T),
       ("resid_std", "잔차의 표준편차", "res.resid.std()", T),
       ("strength", "계절 강도: 1 − 잔차 분산 ÷ (계절 + 잔차)의 분산", "1 - res.resid.var() / (res.seasonal + res.resid).var()", T)],
      "print(round(rise, 1), round(amp, 2), round(resid_std, 3), round(strength, 3))")

# ───────────── 유닛 54 자기상관 ─────────────
steps("54-1", "mfg", "설비 온도: shift로 자기상관 직접 구하기", 1,
      [["s.shift(k)", "k칸 뒤로 밀기"], ["s.corr(다른 Series)", "상관계수"], ["s.autocorr(k)", "래그 k 자기상관"]],
      "시간별 설비 온도 <code>hourly</code>가 한 시간 전, 하루 전의 자신과 얼마나 닮았는지 구합니다. 한 시간 사이의 변화량(차분)도 같은 방법으로 봅니다.",
      HOURLY,
      [("lag1", "한 칸 민 시계열", "hourly.shift(1)", S()),
       ("r1", "hourly와 lag1의 상관계수 (래그 1 자기상관)", "hourly.corr(lag1)", F),
       ("r24", "래그 24 자기상관", "hourly.autocorr(24)", F),
       ("d", "한 시간 전과의 차이 (첫 NaN은 뺌)", "hourly.diff().dropna()", S("abs().sum()")),
       ("r1_d", "d의 래그 1 자기상관", "d.autocorr(1)", F)],
      "print(round(r1, 3), round(r24, 3), round(r1_d, 3))")

steps("54-2", "mfg", "온도 변화량의 ACF · PACF와 Ljung-Box 검정", 2,
      [["acf(s, nlags=24)", "래그 0~24 자기상관 배열"], ["1.96 / np.sqrt(n)", "우연의 범위"], ["acorr_ljungbox(s, lags=[24])", "자기상관이 남았는지 검정"]],
      "한 시간 사이의 온도 변화량 <code>d</code>에 아직 패턴이 남아 있는지 봅니다. 기준선을 넘는 래그를 찾고, Ljung-Box 검정으로 백색잡음인지 판정합니다.",
      imp(HOURLY, "import numpy as np", "from statsmodels.stats.diagnostic import acorr_ljungbox", "from statsmodels.tsa.stattools import acf, pacf") + "\nd = hourly.diff().dropna()   # 한 시간 사이의 변화량",
      [("a", "d의 ACF (래그 0~24)", "acf(d, nlags=24)", S("__getitem__(1)")),
       ("p", "d의 PACF (래그 0~24)", "pacf(d, nlags=24)", S("__getitem__(2)", "1e-3")),
       ("bound", "기준선 1.96 ÷ √n", "1.96 / np.sqrt(len(d))", F),
       ("sig", "ACF가 기준선을 넘는 래그(1~24) 리스트", "[k for k in range(1, 25) if abs(a[k]) > bound]", lambda ns, var: f"list({var}) == {ns[var]!r}"),
       ("lb_p", "래그 24까지의 Ljung-Box p-값", "acorr_ljungbox(d, lags=[24])['lb_pvalue'].iloc[0]", "abs({var} - {v}) < 1e-6"),
       ("is_white", "백색잡음으로 볼 수 있는지 (p-값 > 0.05, True/False)", "bool(lb_p > 0.05)", I)],
      "print(round(float(a[1]), 3), round(float(p[2]), 3), round(float(bound), 3), sig, is_white)")

steps("54-3", "general", "항공 승객: 계절 래그 찾기", 1,
      [["acf(s, nlags=24)", "래그 0~24 자기상관 배열"], ["s.diff().dropna()", "추세를 걷어 낸 변화량"], ["np.argmax(배열)", "가장 큰 값의 위치"]],
      "추세가 강하면 ACF가 모든 래그에서 높게 나와 계절이 묻힙니다. 차분으로 추세를 걷어 낸 뒤 어느 래그가 가장 닮았는지 찾습니다.",
      imp(FLIGHTS, "import numpy as np", "from statsmodels.tsa.stattools import acf"),
      [("a", "y의 ACF (래그 0~24)", "acf(y, nlags=24)", S("__getitem__(12)")),
       ("n_high", "a에서 0.5보다 큰 래그 수 (래그 0 제외)", "int((a[1:] > 0.5).sum())", I),
       ("d", "y의 1차 차분 (첫 NaN은 뺌)", "y.diff().dropna()", S()),
       ("ad", "d의 ACF (래그 0~24)", "acf(d, nlags=24)", S("__getitem__(12)")),
       ("top_lag", "ad에서 자기상관이 가장 큰 래그 (래그 0 제외, 정수)", "int(np.argmax(ad[1:]) + 1)", I)],
      "print(round(float(a[12]), 3), n_high, round(float(ad[12]), 3), top_lag)")

steps("54-4", "general", "따릉이: 일주일 전과 닮은 것은 직접 영향일까", 2,
      [["acf(s, nlags=14)[7]", "래그 7 자기상관"], ["pacf(s, nlags=14)[7]", "중간 래그의 몫을 뺀 직접 영향"]],
      "일별 따릉이 대여 수 <code>day</code>는 일주일 전 값과도 꽤 닮았습니다. 이것이 요일 효과인지, 어제 · 그제를 거쳐 건너온 영향인지 PACF로 가려냅니다.",
      imp(BIKE, "from statsmodels.tsa.stattools import acf, pacf"),
      [("a", "day의 ACF (래그 0~14)", "acf(day, nlags=14)", S("__getitem__(1)")),
       ("r7", "래그 7 자기상관", "a[7]", F),
       ("p", "day의 PACF (래그 0~14)", "pacf(day, nlags=14)", S("__getitem__(1)", "1e-3")),
       ("p7", "래그 7 편자기상관", "p[7]", T),
       ("direct", "래그 7의 직접 영향이 뚜렷한지 (|p7| > 0.2, True/False)", "bool(abs(p7) > 0.2)", I)],
      "print(round(float(a[1]), 2), round(float(r7), 2), round(float(p[1]), 2), round(float(p7), 2), direct)")

# ───────────── 유닛 55 정상성과 차분 ─────────────
QUIET = "\nwarnings.filterwarnings('ignore')   # 검정 함수의 안내 경고 끄기"

steps("55-1", "mfg", "설비 온도: ADF와 KPSS로 정상성 판정하기", 1,
      [["adfuller(s)[1]", "ADF p-값 (작으면 정상)"], ["kpss(s, nlags='auto')[1]", "KPSS p-값 (작으면 비정상)"]],
      "시간별 설비 온도 <code>hourly</code>가 정상 시계열인지 두 검정으로 확인합니다. 두 검정은 출발 가정이 반대라서, 둘 다 '정상' 쪽을 가리킬 때 가장 믿을 수 있습니다.",
      imp(HOURLY, "import warnings", "from statsmodels.tsa.stattools import adfuller, kpss") + QUIET,
      [("p_adf", "ADF 검정의 p-값", "adfuller(hourly)[1]", "abs({var} - {v}) < 1e-3"),
       ("adf_ok", "ADF가 정상으로 판정하는지 (p < 0.05, True/False)", "bool(p_adf < 0.05)", I),
       ("p_kpss", "KPSS 검정의 p-값 (nlags='auto')", "kpss(hourly, nlags='auto')[1]", "abs({var} - {v}) < 1e-3"),
       ("kpss_ok", "KPSS가 정상으로 보는지 (p > 0.05, True/False)", "bool(p_kpss > 0.05)", I),
       ("stationary", "두 검정이 모두 정상 쪽인지 (True/False)", "adf_ok and kpss_ok", I)],
      "print(round(float(p_adf), 4), adf_ok, round(float(p_kpss), 3), kpss_ok, stationary)")

steps("55-2", "mfg", "앞 절반과 뒤 절반: 평균과 흔들림이 같은가", 2,
      [["s.iloc[:n] / s.iloc[n:]", "앞뒤로 나누기"], ["s.rolling(168).std()", "일주일 창의 흔들림"], ["s.diff()", "한 칸 전과의 차이"]],
      "검정만 믿지 말고 눈으로도 확인합니다. 시간별 설비 온도를 앞뒤 절반으로 나눠 평균과 표준편차를 비교하고, 일주일 창으로 흔들림이 얼마나 달라지는지 봅니다.",
      HOURLY + "\nn = len(hourly) // 2\nfirst, second = hourly.iloc[:n], hourly.iloc[n:]",
      [("mean_gap", "뒤 절반 평균 − 앞 절반 평균", "second.mean() - first.mean()", F),
       ("std_ratio", "뒤 절반 표준편차 ÷ 앞 절반 표준편차", "second.std() / first.std()", F),
       ("roll_std", "168시간(일주일) 이동 표준편차", "hourly.rolling(168).std()", S()),
       ("calm_wild", "roll_std의 최댓값 ÷ 최솟값", "roll_std.max() / roll_std.min()", F),
       ("d_ratio", "차분(diff)한 값의 뒤 절반 표준편차 ÷ 앞 절반 표준편차", "second.diff().std() / first.diff().std()", F)],
      "print(round(mean_gap, 2), round(std_ratio, 2), round(calm_wild, 1), round(d_ratio, 2))")

steps("55-3", "general", "항공 승객: 로그와 차분으로 정상 시계열 만들기", 2,
      [["np.log(y)", "흔들림 폭 고르게"], ["s.diff(12)", "계절 차분"], ["adfuller(s)[1]", "ADF p-값"]],
      "월별 항공 승객 <code>y</code>는 추세도, 계절도, 커지는 물결도 있습니다. 로그 → 계절 차분 → 1차 차분 순서로 손질하며 ADF p-값이 어떻게 바뀌는지 봅니다.",
      imp(FLIGHTS, "import numpy as np", "from statsmodels.tsa.stattools import adfuller"),
      [("ly", "y에 로그를 씌운 Series", "np.log(y)", S()),
       ("p0", "ly의 ADF p-값", "adfuller(ly)[1]", "abs({var} - {v}) < 1e-3"),
       ("sd", "ly의 계절 차분 (12칸, NaN은 뺌)", "ly.diff(12).dropna()", S()),
       ("dd", "sd의 1차 차분 (NaN은 뺌)", "sd.diff().dropna()", S("abs().sum()")),
       ("p2", "dd의 ADF p-값", "adfuller(dd)[1]", "abs({var} - {v}) < 1e-3"),
       ("n_lost", "차분으로 잃은 행 수 (y 길이 − dd 길이)", "len(y) - len(dd)", I)],
      "print(round(float(p0), 3), round(float(p2), 4), n_lost)")

steps("55-4", "general", "CO2 농도: 차분 전후를 ADF · KPSS로 비교하기", 2,
      [["adfuller(s)[1]", "작으면 정상"], ["kpss(s, nlags='auto')[1]", "작으면 비정상"], ["s.diff(12)", "계절 차분"]],
      "월평균 CO2 농도 <code>co2m</code>은 꾸준히 오르는 추세와 한 해 주기가 있습니다. 원래 값과, 계절 차분 뒤 1차 차분한 값을 두 검정으로 비교합니다.",
      imp(CO2, "import warnings", "from statsmodels.tsa.stattools import adfuller, kpss") + QUIET,
      [("p_adf_raw", "co2m의 ADF p-값", "adfuller(co2m)[1]", "abs({var} - {v}) < 1e-3"),
       ("p_kpss_raw", "co2m의 KPSS p-값 (nlags='auto')", "kpss(co2m, nlags='auto')[1]", "abs({var} - {v}) < 1e-3"),
       ("dd", "계절 차분(12) 뒤 1차 차분한 Series (NaN은 뺌)", "co2m.diff(12).diff().dropna()", S("abs().sum()")),
       ("p_adf_dd", "dd의 ADF p-값", "adfuller(dd)[1]", "abs({var} - {v}) < 1e-3"),
       ("p_kpss_dd", "dd의 KPSS p-값 (nlags='auto')", "kpss(dd, nlags='auto')[1]", "abs({var} - {v}) < 1e-3"),
       ("stationary", "dd가 두 검정 모두에서 정상 쪽인지 (True/False)", "bool(p_adf_dd < 0.05 and p_kpss_dd > 0.05)", I)],
      "print(round(float(p_adf_raw), 3), round(float(p_kpss_raw), 3), round(float(p_adf_dd), 4), round(float(p_kpss_dd), 3), stationary)")

# ───────────── 유닛 56 예측의 기본기 ─────────────
steps("56-1", "mfg", "설비 온도: 기준 예측 두 가지와 MAE", 1,
      [["y.iloc[:-h], y.iloc[-h:]", "시간 순서대로 나누기"], ["pd.Series(값, index=test.index)", "같은 값으로 채운 예측"], ["(실제 − 예측).abs().mean()", "MAE"]],
      "시간별 설비 온도의 마지막 48시간을 시험 구간으로 떼어 놓고, 가장 단순한 예측 두 가지(마지막 값, 전체 평균)의 오차를 잽니다.",
      HOURLY,
      [("train", "마지막 48시간을 뺀 학습 구간", "hourly.iloc[:-48]", S()),
       ("test", "마지막 48시간 시험 구간", "hourly.iloc[-48:]", S()),
       ("naive", "naive 예측: train의 마지막 값을 48칸에 (index는 test와 같게)", "pd.Series(train.iloc[-1], index=test.index)", S()),
       ("mae_naive", "naive 예측의 MAE", "(test - naive).abs().mean()", F),
       ("mae_mean", "mean 예측(train 평균을 48칸에)의 MAE", "(test - train.mean()).abs().mean()", F),
       ("better", "MAE가 더 작은 쪽 이름 ('naive' 또는 'mean')", "'naive' if mae_naive < mae_mean else 'mean'", I)],
      "print(round(mae_naive, 2), round(mae_mean, 2), better)")

steps("56-2", "mfg", "롤링 원점으로 naive 예측 평가하고 MASE 구하기", 2,
      [["[식 for o in origins]", "원점마다 같은 계산 반복"], ["np.mean(리스트)", "여러 번의 평균"], ["MAE ÷ 학습 구간 naive MAE", "MASE"]],
      "한 번의 시험 구간은 운에 좌우됩니다. 예측을 시작하는 시점(원점)을 네 번 옮겨 가며 '다음 24시간'을 naive로 예측하고, 평균 오차와 MASE를 구합니다.",
      imp(HOURLY, "import numpy as np") + "\norigins = [len(hourly) - 24 * k for k in (4, 3, 2, 1)]   # 시험 구간이 시작되는 위치 네 곳",
      [("maes", "원점 o마다: hourly.iloc[o:o+24]를 직전 값 hourly.iloc[o-1]로 예측한 MAE 리스트", "[(hourly.iloc[o:o + 24] - hourly.iloc[o - 1]).abs().mean() for o in origins]", lambda ns, var: f"len({var}) == 4 and abs(float(sum({var})) - {float(sum(ns[var]))!r}) < 1e-6"),
       ("cv_mae", "네 번의 MAE 평균", "float(np.mean(maes))", F),
       ("worst", "MAE가 가장 컸던 원점의 순서 (0~3)", "int(np.argmax(maes))", I),
       ("scale", "첫 원점 이전 구간에서 한 칸 naive가 낸 MAE (diff의 절댓값 평균)", "hourly.iloc[:origins[0]].diff().abs().mean()", F),
       ("mase", "cv_mae ÷ scale", "cv_mae / scale", F)],
      "print([round(float(v), 2) for v in maes], round(cv_mae, 2), worst, round(scale, 3), round(mase, 2))")

steps("56-3", "general", "항공 승객: seasonal naive와 MAPE", 1,
      [["np.tile(배열, 2)", "배열을 두 번 이어 붙이기"], ["(|오차| ÷ 실제).mean() × 100", "MAPE (%)"]],
      "월별 항공 승객의 마지막 24개월을 시험 구간으로 둡니다. '작년 같은 달 값'을 그대로 쓰는 seasonal naive와 '마지막 값'을 쓰는 naive를 비교합니다.",
      imp(FLIGHTS, "import numpy as np") + "\ntrain, test = y.iloc[:-24], y.iloc[-24:]",
      [("snaive", "train의 마지막 12개월을 두 번 반복한 예측 (index는 test와 같게)", "pd.Series(np.tile(train.iloc[-12:].values, 2), index=test.index)", S()),
       ("mae_s", "seasonal naive의 MAE", "(test - snaive).abs().mean()", F),
       ("mape_s", "seasonal naive의 MAPE (%)", "((test - snaive).abs() / test).mean() * 100", F),
       ("mae_n", "naive(train의 마지막 값)의 MAE", "(test - train.iloc[-1]).abs().mean()", F),
       ("gain", "mae_n ÷ mae_s (seasonal naive가 몇 배 정확한지)", "mae_n / mae_s", F)],
      "print(round(mae_s, 1), round(mape_s, 1), round(mae_n, 1), round(gain, 2))")

steps("56-4", "general", "따릉이: 지난주 복사 vs 최근 7일 평균", 2,
      [["np.tile(배열, 4)", "배열을 네 번 이어 붙이기"], ["s.diff(7).abs().mean()", "학습 구간에서 seasonal naive가 낸 오차"], ["MAE ÷ scale", "MASE"]],
      "일별 따릉이 대여 수의 마지막 28일을 시험 구간으로 둡니다. 지난주 7일을 복사하는 예측과 최근 7일 평균을 쓰는 예측을 비교하고, MASE로 크기를 가늠합니다.",
      imp(BIKE, "import numpy as np") + "\ntrain, test = day.iloc[:-28], day.iloc[-28:]",
      [("snaive", "train의 마지막 7일을 네 번 반복한 예측 (index는 test와 같게)", "pd.Series(np.tile(train.iloc[-7:].values, 4), index=test.index)", S()),
       ("mae_s", "snaive의 MAE", "(test - snaive).abs().mean()", F),
       ("mae_m", "train의 마지막 7일 평균을 28칸에 쓴 예측의 MAE", "(test - train.iloc[-7:].mean()).abs().mean()", F),
       ("scale", "train에서 7일 전 값으로 예측했을 때의 MAE", "train.diff(7).abs().mean()", F),
       ("mase_m", "mae_m ÷ scale", "mae_m / scale", F)],
      "print(round(mae_s), round(mae_m), round(scale), round(mase_m, 2))")

# ───────────── 유닛 57 지수평활 ─────────────
steps("57-1", "mfg", "설비 온도: ewm으로 지수평활 직접 해 보기", 1,
      [["s.ewm(alpha=0.3, adjust=False).mean()", "지수평활"], ["α × (1 − α) ** k", "k칸 전 값의 가중치"]],
      "시간별 설비 온도에 α = 0.3과 α = 0.9로 지수평활을 걸어 봅니다. α가 작을수록 선이 매끄럽고, 과거 값의 가중치는 한 칸마다 (1 − α)배로 줄어듭니다.",
      HOURLY,
      [("s3", "α = 0.3 지수평활 (adjust=False)", "hourly.ewm(alpha=0.3, adjust=False).mean()", S()),
       ("s9", "α = 0.9 지수평활 (adjust=False)", "hourly.ewm(alpha=0.9, adjust=False).mean()", S()),
       ("next3", "α = 0.3일 때 다음 시간 예측 (s3의 마지막 값)", "s3.iloc[-1]", F),
       ("rough", "s9의 변화량 절댓값 평균 ÷ s3의 변화량 절댓값 평균", "s9.diff().abs().mean() / s3.diff().abs().mean()", F),
       ("w", "α = 0.3일 때 최근 5개 값의 가중치 리스트 (최근 것부터)", "[0.3 * 0.7 ** k for k in range(5)]", lambda ns, var: f"len({var}) == 5 and abs({var}[0] - 0.3) < 1e-9 and abs({var}[4] - {ns[var][4]!r}) < 1e-9"),
       ("w_sum", "w의 합 (최근 5개가 차지하는 몫)", "sum(w)", F)],
      "print(round(next3, 2), round(hourly.iloc[-1], 2), round(rough, 2), [round(v, 3) for v in w], round(w_sum, 3))")

steps("57-2", "mfg", "SimpleExpSmoothing: 모델이 고른 α 해석하기", 2,
      [["SimpleExpSmoothing(train).fit()", "α를 스스로 고름"], ["fit.params['smoothing_level']", "고른 α"], ["fit.forecast(24)", "24칸 예측"]],
      "α를 직접 정하지 않고 모델이 고르게 합니다. 고른 α가 1에 가깝다면 '마지막 값이 가장 좋은 예측'이라는 뜻이라, naive와 거의 같은 결과가 나옵니다.",
      imp(HOURLY, "import warnings", "from statsmodels.tsa.holtwinters import SimpleExpSmoothing") + "\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]",
      [("fit", "train에 맞춘 단순 지수평활 모델", "SimpleExpSmoothing(train).fit()", HAS("forecast")),
       ("alpha", "모델이 고른 α", "fit.params['smoothing_level']", "0.9 < {var} <= 1.0"),
       ("fc", "앞으로 24시간 예측", "fit.forecast(24)", lambda ns, var: f"len({var}) == 24 and abs(float({var}.iloc[0]) - {float(ns[var].iloc[0])!r}) < 0.5"),
       ("mae", "예측의 MAE (test.values와 fc.values 비교)", "abs(test.values - fc.values).mean()", "abs({var} - {v}) < 0.2"),
       ("mae_naive", "naive(train의 마지막 값)의 MAE", "(test - train.iloc[-1]).abs().mean()", F)],
      "print(round(float(alpha), 3), round(float(mae), 2), round(float(mae_naive), 2))")

steps("57-3", "general", "항공 승객: Holt-Winters로 추세와 계절까지", 2,
      [["ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12)", "Holt-Winters"], ["fit.forecast(24)", "24칸 예측"]],
      "월별 항공 승객은 추세와 곱셈형 계절이 있습니다. Holt-Winters로 마지막 24개월을 예측하고, 기준 예측인 seasonal naive를 넘는지 확인합니다.",
      imp(FLIGHTS, "import warnings", "import numpy as np", "from statsmodels.tsa.holtwinters import ExponentialSmoothing") + "\nwarnings.filterwarnings('ignore')\ntrain, test = y.iloc[:-24], y.iloc[-24:]",
      [("fit", "덧셈 추세 + 곱셈 계절(주기 12) Holt-Winters 모델", "ExponentialSmoothing(train, trend='add', seasonal='mul', seasonal_periods=12).fit()", HAS("forecast")),
       ("fc", "앞으로 24개월 예측", "fit.forecast(24)", lambda ns, var: f"len({var}) == 24 and abs(float({var}.sum()) - {float(ns[var].sum())!r}) < 0.03 * {float(ns[var].sum())!r}"),
       ("mae", "예측의 MAE", "abs(test.values - fc.values).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 3"),
       ("mae_s", "seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE", "abs(test.values - np.tile(train.iloc[-12:].values, 2)).mean()", F),
       ("beats", "Holt-Winters가 seasonal naive보다 나은지 (True/False)", "bool(mae < mae_s)", I)],
      "print(round(float(mae), 1), round(float(mae_s), 1), beats)")

steps("57-4", "general", "CO2 농도: 추세만 vs 추세 + 계절", 2,
      [["ExponentialSmoothing(train, trend='add')", "추세만 (Holt)"], ["seasonal='add', seasonal_periods=12", "계절 더하기"]],
      "월평균 CO2 농도의 마지막 24개월을 예측합니다. 추세만 넣은 모델과 계절까지 넣은 모델의 오차를 비교해, 계절 성분이 얼마나 값을 하는지 봅니다.",
      imp(CO2, "import warnings", "from statsmodels.tsa.holtwinters import ExponentialSmoothing") + "\nwarnings.filterwarnings('ignore')\ntrain, test = co2m.iloc[:-24], co2m.iloc[-24:]",
      [("fit_t", "덧셈 추세만 넣은 모델", "ExponentialSmoothing(train, trend='add').fit()", HAS("forecast")),
       ("fit_ts", "덧셈 추세 + 덧셈 계절(주기 12) 모델", "ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12).fit()", HAS("forecast")),
       ("mae_t", "fit_t의 24개월 예측 MAE", "abs(test.values - fit_t.forecast(24).values).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 2"),
       ("mae_ts", "fit_ts의 24개월 예측 MAE", "abs(test.values - fit_ts.forecast(24).values).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.15"),
       ("gain", "mae_t ÷ mae_ts (계절을 넣어 몇 배 정확해졌는지)", "mae_t / mae_ts", lambda ns, var: f"{var} > 2")],
      "print(round(float(mae_t), 2), round(float(mae_ts), 2), round(float(gain), 1))")

# ───────────── 유닛 58 ARIMA ─────────────
ARIMA_M = imp(HOURLY, "import warnings", "from statsmodels.stats.diagnostic import acorr_ljungbox", "from statsmodels.tsa.arima.model import ARIMA") + "\nwarnings.filterwarnings('ignore')\ntrain, test = hourly.iloc[:-24], hourly.iloc[-24:]"

steps("58-1", "mfg", "설비 온도: ARIMA(2,1,1) 맞추고 잔차 점검하기", 2,
      [["ARIMA(train, order=(2, 1, 1)).fit()", "ARIMA 적합"], ["fit.forecast(24)", "24칸 예측"], ["acorr_ljungbox(fit.resid, lags=[24])", "잔차에 패턴이 남았는지"]],
      "시간별 설비 온도에 ARIMA(2,1,1)을 맞춰 다음 24시간을 예측합니다. 예측 오차를 naive와 비교하고, 잔차에 자기상관이 남았는지 Ljung-Box로 점검합니다.",
      ARIMA_M,
      [("fit", "train에 맞춘 ARIMA(2,1,1) 모델", "ARIMA(train, order=(2, 1, 1)).fit()", HAS("aic")),
       ("fc", "앞으로 24시간 예측", "fit.forecast(24)", lambda ns, var: f"len({var}) == 24 and abs(float({var}.mean()) - {float(ns[var].mean())!r}) < 0.5"),
       ("mae", "예측의 MAE", "abs(test.values - fc.values).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.2"),
       ("mae_naive", "naive(train의 마지막 값)의 MAE", "(test - train.iloc[-1]).abs().mean()", F),
       ("lb_p", "잔차(첫 값 제외)의 래그 24 Ljung-Box p-값", "acorr_ljungbox(fit.resid.iloc[1:], lags=[24])['lb_pvalue'].iloc[0]", lambda ns, var: f"0 <= {var} <= 1 and ({var} > 0.05) == {bool(ns[var] > 0.05)}"),
       ("resid_ok", "잔차를 백색잡음으로 볼 수 있는지 (p > 0.05, True/False)", "bool(lb_p > 0.05)", I)],
      "print(round(float(mae), 2), round(float(mae_naive), 2), round(float(lb_p), 3), resid_ok)")

steps("58-2", "mfg", "AIC로 차수 고르고 예측 구간 보기", 2,
      [["{o: ARIMA(train, order=o).fit().aic for o in orders}", "후보마다 AIC"], ["min(d, key=d.get)", "값이 가장 작은 키"], ["fit.get_forecast(24).conf_int()", "예측 구간 (아래, 위)"]],
      "후보 차수 네 개 가운데 AIC가 가장 작은 것을 고릅니다. 고른 모델로 24시간 예측 구간을 구하고, 멀리 갈수록 구간이 얼마나 넓어지는지 확인합니다.",
      ARIMA_M + "\norders = [(1, 0, 0), (1, 1, 0), (0, 1, 1), (2, 1, 1)]",
      [("aics", "차수 → AIC 딕셔너리", "{o: ARIMA(train, order=o).fit().aic for o in orders}", lambda ns, var: f"len({var}) == 4 and abs({var}[(1, 1, 0)] - {float(ns[var][(1, 1, 0)])!r}) < 5"),
       ("best", "AIC가 가장 작은 차수 (튜플)", "min(aics, key=aics.get)", I),
       ("fit", "best 차수로 다시 맞춘 모델", "ARIMA(train, order=best).fit()", HAS("get_forecast")),
       ("ci", "24시간 예측 구간 (열 두 개: 아래, 위)", "fit.get_forecast(24).conf_int()", lambda ns, var: f"{var}.shape == (24, 2)"),
       ("w1", "1시간 뒤 구간의 폭 (위 − 아래)", "ci.iloc[0, 1] - ci.iloc[0, 0]", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.5"),
       ("w24", "24시간 뒤 구간의 폭", "ci.iloc[-1, 1] - ci.iloc[-1, 0]", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 3")],
      "print({o: round(float(v), 1) for o, v in aics.items()}, best, round(float(w1), 1), round(float(w24), 1))")

steps("58-3", "general", "항공 승객: 로그 + SARIMA(0,1,1)(0,1,1,12)", 2,
      [["ARIMA(s, order=(0, 1, 1), seasonal_order=(0, 1, 1, 12))", "계절 ARIMA"], ["np.exp(예측)", "로그를 되돌리기"]],
      "월별 항공 승객에 로그를 씌운 뒤 계절 ARIMA를 맞춥니다. 예측은 <code>np.exp</code>로 원래 단위로 되돌려서 평가하고, seasonal naive와 비교합니다.",
      imp(FLIGHTS, "import warnings", "import numpy as np", "from statsmodels.tsa.arima.model import ARIMA") + "\nwarnings.filterwarnings('ignore')\ntrain, test = y.iloc[:-24], y.iloc[-24:]",
      [("fit", "np.log(train)에 맞춘 ARIMA(0,1,1)(0,1,1,12) 모델", "ARIMA(np.log(train), order=(0, 1, 1), seasonal_order=(0, 1, 1, 12)).fit()", HAS("aic")),
       ("fc", "24개월 예측을 원래 단위로 되돌린 값", "np.exp(fit.forecast(24))", lambda ns, var: f"len({var}) == 24 and abs(float({var}.sum()) - {float(ns[var].sum())!r}) < 0.03 * {float(ns[var].sum())!r}"),
       ("mae", "예측의 MAE", "abs(test.values - fc.values).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 4"),
       ("mape", "예측의 MAPE (%)", "(abs(test.values - fc.values) / test.values).mean() * 100", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 1"),
       ("mae_s", "seasonal naive(train의 마지막 12개월을 두 번 반복)의 MAE", "abs(test.values - np.tile(train.iloc[-12:].values, 2)).mean()", F)],
      "print(round(float(mae), 1), round(float(mape), 1), round(float(mae_s), 1))")

steps("58-4", "general", "따릉이: 기온과 강수량을 외부 변수로 넣기", 3,
      [["ARIMA(y, exog=X, order=...)", "외부 변수 넣기"], ["fit.forecast(28, exog=미래의 X)", "예측에도 외부 변수가 필요"], ["fit.params['rain']", "외부 변수의 계수"]],
      "일별 따릉이 대여 수는 날씨에 크게 좌우됩니다. 같은 ARIMA(1,1,1)에 기온 · 강수량을 넣은 것과 안 넣은 것을 비교합니다. 여기서는 시험 구간의 실제 날씨를 알고 있다고 가정합니다.",
      "import warnings\nimport pandas as pd\nfrom statsmodels.tsa.arima.model import ARIMA\n\nwarnings.filterwarnings('ignore')\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\n"
      "day = bike.groupby('date').agg(rented=('rented_bikes', 'sum'), temp=('temp', 'mean'), rain=('rainfall', 'sum')).asfreq('D')\n"
      "day['rented'] = day['rented'].where(day['rented'] > 0).interpolate()   # 휴무일은 앞뒤 값으로\n"
      "train, test = day.iloc[:-28], day.iloc[-28:]\nX = ['temp', 'rain']",
      [("fit0", "train['rented']에 맞춘 ARIMA(1,1,1)", "ARIMA(train['rented'], order=(1, 1, 1)).fit()", HAS("aic")),
       ("fit1", "외부 변수 train[X]를 넣은 ARIMA(1,1,1)", "ARIMA(train['rented'], exog=train[X], order=(1, 1, 1)).fit()", lambda ns, var: f"'rain' in {var}.params.index"),
       ("mae0", "fit0의 28일 예측 MAE", "abs(test['rented'].values - fit0.forecast(28).values).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.05 * {float(ns[var])!r}"),
       ("mae1", "fit1의 28일 예측 MAE (exog=test[X])", "abs(test['rented'].values - fit1.forecast(28, exog=test[X]).values).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.05 * {float(ns[var])!r}"),
       ("rain_coef", "fit1에서 강수량(rain)의 계수", "fit1.params['rain']", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.1 * abs({float(ns[var])!r})")],
      "print(round(float(mae0)), round(float(mae1)), round(float(rain_coef), 1))")

# ───────────── 유닛 59 머신러닝으로 예측하기 ─────────────
steps("59-1", "mfg", "설비 온도: 래그 · 이동 특성으로 학습 표 만들기", 1,
      [["s.shift(1)", "한 칸 전 값"], ["s.shift(1).rolling(24).mean()", "직전 24칸 평균 (지금 값은 빼고)"], ["pd.DataFrame({...}).dropna()", "표로 묶고 빈 행 버리기"]],
      "시간별 설비 온도를 '특성 여러 개 + 정답 하나'인 표로 바꿉니다. 이동평균은 반드시 <code>shift(1)</code>을 먼저 해서, 맞혀야 할 지금 값이 특성에 섞이지 않게 합니다.",
      HOURLY,
      [("lag1", "1시간 전 값", "hourly.shift(1)", S()),
       ("lag24", "24시간 전 값", "hourly.shift(24)", S()),
       ("roll24", "직전 24시간 평균 (지금 값 제외)", "hourly.shift(1).rolling(24).mean()", S()),
       ("feat", "열 y(=hourly), lag1, lag24, roll24로 만든 표에서 NaN 행을 버린 것", "pd.DataFrame({'y': hourly, 'lag1': lag1, 'lag24': lag24, 'roll24': roll24}).dropna()", lambda ns, var: f"list({var}.columns) == ['y', 'lag1', 'lag24', 'roll24'] and len({var}) == {len(ns[var])} and abs(float({var}['roll24'].sum()) - {float(ns[var]['roll24'].sum())!r}) < 1e-3"),
       ("n_lost", "버려진 행 수", "len(hourly) - len(feat)", I),
       ("best_feat", "y와 상관계수가 가장 큰 특성 이름", "feat.corr()['y'].drop('y').idxmax()", I)],
      "print(feat.shape, n_lost, best_feat)\nprint(feat.head(3).round(2))")

FEAT_M = ("import pandas as pd\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.linear_model import LinearRegression\n\n"
          "m = pd.read_csv('machine_temp.csv', parse_dates=['timestamp']).set_index('timestamp')['temp']\nhourly = m.resample('h').mean().interpolate()\n"
          "feat = pd.DataFrame({'y': hourly, 'lag1': hourly.shift(1), 'lag2': hourly.shift(2), 'lag24': hourly.shift(24),\n"
          "                     'roll24': hourly.shift(1).rolling(24).mean()}).dropna()\n"
          "cols = ['lag1', 'lag2', 'lag24', 'roll24']\ntrain, test = feat.iloc[:-168], feat.iloc[-168:]   # 마지막 일주일이 시험 구간")

steps("59-2", "mfg", "선형 회귀 vs 랜덤 포레스트 vs naive (1시간 뒤 예측)", 2,
      [["LinearRegression().fit(X, y)", "선형 회귀"], ["RandomForestRegressor(n_estimators=50, random_state=0)", "랜덤 포레스트"], ["(실제 − 예측).abs().mean()", "MAE"]],
      "래그 특성 표로 1시간 뒤 온도를 예측합니다. 마지막 일주일을 시험 구간으로 두고 선형 회귀, 랜덤 포레스트, 그리고 기준 예측(1시간 전 값 그대로)을 비교합니다. 복잡한 모델이 꼭 이긴다는 보장은 없습니다.",
      FEAT_M,
      [("lin", "train으로 학습한 선형 회귀", "LinearRegression().fit(train[cols], train['y'])", HAS("coef_")),
       ("mae_lin", "선형 회귀의 시험 구간 MAE", "(test['y'] - lin.predict(test[cols])).abs().mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 1e-4"),
       ("rf", "train으로 학습한 랜덤 포레스트 (n_estimators=50, random_state=0)", "RandomForestRegressor(n_estimators=50, random_state=0).fit(train[cols], train['y'])", HAS("feature_importances_")),
       ("mae_rf", "랜덤 포레스트의 시험 구간 MAE", "(test['y'] - rf.predict(test[cols])).abs().mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.05"),
       ("mae_naive", "naive(lag1을 그대로 예측으로)의 MAE", "(test['y'] - test['lag1']).abs().mean()", F),
       ("best", "MAE가 가장 작은 방법 ('lin', 'rf', 'naive' 중 하나)", "min({'lin': mae_lin, 'rf': mae_rf, 'naive': mae_naive}, key={'lin': mae_lin, 'rf': mae_rf, 'naive': mae_naive}.get)", I)],
      "print(round(float(mae_lin), 3), round(float(mae_rf), 3), round(float(mae_naive), 3), best)")

steps("59-3", "general", "따릉이: 래그 · 요일 · 기온 특성으로 내일 예측하기", 2,
      [["s.shift(7)", "일주일 전 값"], ["s.index.dayofweek", "요일 (월 0 ~ 일 6)"], ["LinearRegression().fit(X, y)", "선형 회귀"]],
      "일별 따릉이 대여 수를 표로 바꿔 선형 회귀로 예측합니다. 어제 값만 쓰는 기준 예측보다 나아지는지, 기온을 더하면 더 좋아지는지 봅니다. 특성을 더한다고 항상 좋아지지는 않습니다. 기온은 그날 예보를 안다고 가정합니다.",
      "import pandas as pd\nfrom sklearn.linear_model import LinearRegression\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\n"
      "day = bike.groupby('date').agg(rented=('rented_bikes', 'sum'), temp=('temp', 'mean')).asfreq('D')\n"
      "day['rented'] = day['rented'].where(day['rented'] > 0).interpolate()   # 휴무일은 앞뒤 값으로\ny = day['rented']",
      [("feat", "열 y, lag1(1일 전), lag7(7일 전), roll7(직전 7일 평균), dow(요일), temp(day['temp'])로 만든 표에서 NaN 행을 버린 것",
        "pd.DataFrame({'y': y, 'lag1': y.shift(1), 'lag7': y.shift(7), 'roll7': y.shift(1).rolling(7).mean(), 'dow': y.index.dayofweek, 'temp': day['temp']}).dropna()",
        lambda ns, var: f"list({var}.columns) == ['y', 'lag1', 'lag7', 'roll7', 'dow', 'temp'] and len({var}) == {len(ns[var])} and abs(float({var}['roll7'].sum()) - {float(ns[var]['roll7'].sum())!r}) < 1e-3"),
       ("train", "마지막 28일을 뺀 학습 구간", "feat.iloc[:-28]", lambda ns, var: f"len({var}) == {len(ns[var])}"),
       ("test", "마지막 28일 시험 구간", "feat.iloc[-28:]", lambda ns, var: f"len({var}) == 28"),
       ("mae_naive", "naive(lag1 그대로)의 시험 구간 MAE", "(test['y'] - test['lag1']).abs().mean()", F),
       ("mae_a", "lag1, lag7, roll7, dow로 학습한 선형 회귀의 MAE", "(test['y'] - LinearRegression().fit(train[['lag1', 'lag7', 'roll7', 'dow']], train['y']).predict(test[['lag1', 'lag7', 'roll7', 'dow']])).abs().mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.5"),
       ("mae_b", "거기에 temp를 더한 선형 회귀의 MAE", "(test['y'] - LinearRegression().fit(train[['lag1', 'lag7', 'roll7', 'dow', 'temp']], train['y']).predict(test[['lag1', 'lag7', 'roll7', 'dow', 'temp']])).abs().mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 0.5")],
      "print(feat.shape, round(mae_naive), round(mae_a), round(mae_b))")

steps("59-4", "general", "항공 승객: 트리 모델의 천장 확인하기", 2,
      [["DecisionTreeRegressor(max_depth=5, random_state=0)", "결정 트리 회귀"], ["예측.max() <= 학습 정답.max()", "천장"], ["LinearRegression()", "추세를 따라가는 모델"]],
      "추세가 있는 시계열에 트리 모델을 그대로 쓰면 어떻게 되는지 확인합니다. 특성은 시간 순번 <code>t</code>와 월 <code>month</code>입니다. 트리의 예측은 학습 때 본 최댓값을 넘지 못합니다.",
      "import numpy as np\nimport pandas as pd\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.tree import DecisionTreeRegressor\n\ndf = pd.read_csv('flights.csv')\n"
      "df['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'], format='%Y-%B')\n"
      "tab = pd.DataFrame({'y': df['passengers'].values, 't': np.arange(len(df)), 'month': df['date'].dt.month.values})\n"
      "train, test = tab.iloc[:-24], tab.iloc[-24:]\ncols = ['t', 'month']",
      [("tree", "train으로 학습한 결정 트리 (max_depth=5, random_state=0)", "DecisionTreeRegressor(max_depth=5, random_state=0).fit(train[cols], train['y'])", HAS("tree_")),
       ("pred_tree", "트리의 시험 구간 예측", "tree.predict(test[cols])", lambda ns, var: f"len({var}) == 24 and abs(float({var}.max()) - {float(ns[var].max())!r}) < 1e-6"),
       ("capped", "트리 예측의 최댓값이 train 정답의 최댓값 이하인지 (True/False)", "bool(pred_tree.max() <= train['y'].max())", I),
       ("mae_tree", "트리의 MAE", "abs(test['y'].values - pred_tree).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 1e-4"),
       ("mae_lin", "같은 특성으로 학습한 선형 회귀의 MAE", "abs(test['y'].values - LinearRegression().fit(train[cols], train['y']).predict(test[cols])).mean()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 1e-4"),
       ("gap", "시험 구간 실제 최댓값 − 트리 예측 최댓값", "test['y'].max() - pred_tree.max()", lambda ns, var: f"abs({var} - {float(ns[var])!r}) < 1e-6")],
      "print(round(float(pred_tree.max()), 1), train['y'].max(), capped, round(float(mae_tree), 1), round(float(mae_lin), 1), round(float(gap), 1))")

# ───────────── 유닛 60 시계열 이상 탐지 ─────────────
steps("60-1", "mfg", "설비 온도: 이동 z-점수로 튀는 값 찾기", 1,
      [["s.rolling(288).mean().shift(1)", "직전 하루의 평균 (지금 값 제외)"], ["(값 − 평균) ÷ 표준편차", "z-점수"], ["불리언.idxmax()", "처음 True가 되는 시각"]],
      "5분 간격 설비 온도 <code>m</code>에서, 직전 하루(288개)와 비교해 크게 벗어난 값을 찾습니다. 기준을 만들 때 <code>shift(1)</code>로 지금 값을 빼는 것이 핵심입니다.",
      MACHINE,
      [("mu", "직전 288개의 평균 (rolling 뒤 shift(1))", "m.rolling(288).mean().shift(1)", S()),
       ("sd", "직전 288개의 표준편차 (rolling 뒤 shift(1))", "m.rolling(288).std().shift(1)", S()),
       ("z", "z-점수 (m − mu) ÷ sd", "(m - mu) / sd", S("abs().sum()")),
       ("flag", "|z| > 4 인지 (True/False Series)", "z.abs() > 4", lambda ns, var: f"len({var}) == 22695 and int({var}.sum()) == {int(ns[var].sum())}"),
       ("n_flag", "알람이 울린 점의 수", "int(flag.sum())", I),
       ("first", "처음 알람이 울린 시각 (Timestamp)", "flag.idxmax()", lambda ns, var: f"str({var}) == '{ns[var]}'")],
      "print(n_flag, first, round(float(z.loc[first]), 1))")

steps("60-2", "mfg", "고정 기준선 알람을 실제 고장 기록과 맞춰 보기", 2,
      [["low & ~low.shift(1, fill_value=False)", "False에서 True로 바뀌는 순간"], ["s.loc[시작:끝].any()", "구간 안에 True가 있는지"], ["잡은 고장 ÷ 전체 고장", "재현율"]],
      "'온도가 40 아래로 떨어지면 알람'이라는 고정 기준선을 씁니다. 알람이 몇 번 울렸는지 세고, 실제 고장 4건 가운데 고장 시각 앞 24시간 안에 알람이 있었던 건수를 구합니다.",
      MACHINE + "\nlabels = pd.to_datetime(['2013-12-11 06:00', '2013-12-16 17:25', '2014-01-28 13:55', '2014-02-08 14:30'])   # 실제 고장 시각",
      [("low", "온도가 40 미만인지 (True/False Series)", "m < 40", lambda ns, var: f"len({var}) == 22695 and int({var}.sum()) == {int(ns[var].sum())}"),
       ("start", "알람이 새로 시작된 순간 (직전은 False, 지금은 True)", "low & ~low.shift(1, fill_value=False)", lambda ns, var: f"len({var}) == 22695 and int({var}.sum()) == {int(ns[var].sum())}"),
       ("n_events", "알람이 울린 횟수 (연속 구간은 한 번으로)", "int(start.sum())", I),
       ("hits", "고장 시각 앞 24시간 안에 low가 한 번이라도 True였던 고장 수", "sum(bool(low.loc[t - pd.Timedelta('1D'):t].any()) for t in labels)", I),
       ("recall", "재현율 hits ÷ 고장 수", "hits / len(labels)", F),
       ("false_events", "어느 고장의 앞 24시간에도 속하지 않는 알람 시작 수", "sum(not any(t - pd.Timedelta('1D') <= s <= t for t in labels) for s in start[start].index)", I)],
      "print(int(low.sum()), n_events, hits, recall, false_events)")

steps("60-3", "general", "따릉이: '그 시각의 평소'와 비교해 이상 찾기", 2,
      [["s.groupby(s.index.hour).transform('median')", "시각별 중앙값을 각 행에"], ["1.4826 × MAD", "이상치에 강한 표준편차 추정"], ["s.idxmax()", "가장 큰 값의 시각"]],
      "2018년 6월 시간별 대여 수 <code>rented</code>입니다. 새벽의 30대는 평범하지만 퇴근 시간의 30대는 이상합니다. 시각별 중앙값을 빼고, 남은 차이가 평소보다 얼마나 큰지 점수로 만듭니다.",
      "import pandas as pd\n\nbike = pd.read_csv('seoul_bike.csv', parse_dates=['date'])\nbike['ts'] = bike['date'] + pd.to_timedelta(bike['hour'], unit='h')\nrented = bike.set_index('ts').loc['2018-06', 'rented_bikes'].asfreq('h')",
      [("usual", "각 행의 '그 시각(0~23시) 중앙값'", "rented.groupby(rented.index.hour).transform('median')", S()),
       ("resid", "실제 − 평소 (rented − usual)", "rented - usual", S("abs().sum()")),
       ("mad", "resid 절댓값의 중앙값", "resid.abs().median()", F),
       ("score", "이상 점수 |resid| ÷ (1.4826 × mad)", "resid.abs() / (1.4826 * mad)", S()),
       ("n_out", "점수가 5보다 큰 시각 수", "int((score > 5).sum())", I),
       ("worst", "점수가 가장 큰 시각 (Timestamp)", "score.idxmax()", lambda ns, var: f"str({var}) == '{ns[var]}'")],
      "print(round(float(mad), 1), n_out, worst, int(rented.loc[worst]), int(usual.loc[worst]))")

steps("60-4", "general", "배송 시간: 3시그마가 놓친 작은 변화를 CUSUM으로 잡기", 2,
      [["np.abs(x − 목표) > 3 × sd", "3시그마 기준"], ["cusum(x, 목표, k)", "초과분을 누적"], ["np.argmax(조건)", "처음 True가 되는 위치"]],
      "가상의 일별 평균 배송 시간(분) 70일치입니다. 41일째부터 평균이 1.5분쯤 늘었지만 하루하루는 평소 범위 안입니다. 처음 20일을 기준으로 삼아 3시그마 기준과 CUSUM을 비교합니다.",
      "import numpy as np\n\nrng = np.random.default_rng(27)\nx = np.r_[rng.normal(30, 2, 40), rng.normal(31.5, 2, 30)].round(1)   # 41일째부터 평균이 올라감\n\n"
      "def cusum(x, target, k):\n    c, out = 0.0, []\n    for v in x:\n        c = max(0.0, c + v - target - k)   # 목표 + k 를 넘은 만큼만 쌓는다\n        out.append(c)\n    return np.array(out)",
      [("target", "처음 20일의 평균 (목표값)", "x[:20].mean()", F),
       ("sd", "처음 20일의 표준편차 (ddof=1)", "x[:20].std(ddof=1)", F),
       ("n_3s", "목표에서 3 × sd 넘게 벗어난 날 수", "int((np.abs(x - target) > 3 * sd).sum())", I),
       ("c", "k = 0.5 × sd 로 계산한 CUSUM 배열", "cusum(x, target, 0.5 * sd)", S()),
       ("alarm_day", "CUSUM이 처음으로 5 × sd를 넘은 날 (0부터 세는 위치, 정수)", "int(np.argmax(c > 5 * sd))", I)],
      "print(round(float(target), 2), round(float(sd), 2), n_3s, alarm_day, round(float(c.max()), 1))")


if __name__ == "__main__":
    head = ("// 시계열 분석 트랙 유닛 52~60 문제. scripts/build_ts.py 로 생성.\n"
            "// domain: \"mfg\" = QAQC 과정(제조), \"general\" = 데이터 과정(일반).\n")

    def js(name, obj):
        return f"export const {name} = " + json.dumps(obj, ensure_ascii=False, indent=2) + ";\n"

    with open(os.path.join(ROOT, "problems-ts.js"), "w", encoding="utf-8") as f:
        f.write(head + js("TS_UNITS", UNITS) + js("TS_PROBLEMS", PROBLEMS))
    print(len(PROBLEMS), "problems")
