// 커리큘럼: 트랙 > 코스 > 레슨. 문제는 코스의 unit 번호로 problems.js 의 유닛과 이어진다.
// 레슨 본문은 content/<트랙>/<레슨 id>.md 에 있고, 화면에서 그때그때 불러온다.
// 레슨 quiz 는 본문을 다 읽었는지 확인하는 1~3문항(형식은 problems.js 의 개념 퀴즈와 같다).

export const TRACKS = [
  { id: "python-basic", label: "파이썬 기초", en: "Python Basics", color: "violet", ready: true,
    blurb: "변수부터 파일 입출력까지. QA/QC 현장 예제로 문법을 익힙니다." },
  { id: "python-da", label: "파이썬 데이터분석", en: "Data Analysis", color: "cyan", ready: true,
    blurb: "NumPy · pandas · matplotlib · seaborn으로 데이터를 다루고 그립니다." },
  { id: "sql", label: "SQL", en: "SQL", color: "lime", ready: false,
    blurb: "SELECT부터 윈도우 함수까지. 브라우저 안의 SQLite로 바로 실행합니다." },
  { id: "stats", label: "통계", en: "Statistics", color: "amber", ready: false,
    blurb: "기술통계 · 분포 · 검정 · 회귀. 시뮬레이션으로 직관을 만듭니다." },
  { id: "ml", label: "머신러닝", en: "Machine Learning", color: "green", ready: false,
    blurb: "scikit-learn으로 회귀 · 분류 · 군집을 만들고 평가합니다." },
  { id: "dl", label: "딥러닝", en: "Deep Learning", color: "orange", ready: false,
    blurb: "퍼셉트론부터 어텐션까지, 개념과 모션 영상으로 원리를 이해합니다." },
];

// 과정(프로그램): 같은 커리큘럼을 배우되 연습문제의 소재가 다르다.
//  - qaqc: 가입 코드 QAQC8 로 들어온 수강생. 제조·품질(domain "mfg") 문제를 푼다. 회차 과제가 있다.
//  - basic: 그 외 모두. 일반 데이터(domain "general") 문제를 푼다. 일반 문제가 아직 없는 코스는 제조 문제를 대신 보여준다.
// 문제의 domain 은 problems.js 각 문제의 domain 필드(없으면 "mfg").
export const PROGRAMS = [
  { id: "qaqc", label: "QAQC 과정", domain: "mfg", joinCodes: ["QAQC8"], sessions: true,
    blurb: "제조 · 품질 검사 데이터로 푸는 문제. 수업 회차 과제가 함께 나옵니다." },
  { id: "basic", label: "기본 데이터 과정", domain: "general", joinCodes: [], sessions: false,
    blurb: "쇼핑몰 주문 · 고객 · 설문 같은 일반 데이터로 푸는 문제." },
];
export const DOMAIN_LABEL = { mfg: "제조 예제", general: "일반 예제" };
export const programOfJoinCode = (code) => PROGRAMS.find((p) => p.joinCodes.includes(String(code || "").toUpperCase())) || PROGRAMS.find((p) => p.id === "basic");
export const programById = Object.fromEntries(PROGRAMS.map((p) => [p.id, p]));

// status: "ready"(레슨·문제 있음) | "planned"(제목만, 준비 중)
export const COURSES = [
  // ── 파이썬 기초 ─────────────────────────────────────────
  { id: "pb-01", track: "python-basic", title: "변수와 사칙연산", summary: "변수, 주석, + - * / // % **", unit: 1, level: "입문",
    concepts: ["py.variable", "py.arith"],
    lessons: [{ id: "pb-01-1", title: "변수는 값에 붙이는 이름표", minutes: 10, concepts: ["py.variable", "py.arith"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "box = 1000 // 24\nprint(box)", answer: "41", explain: "//는 몫입니다. 24개들이 박스 41개가 가득 찹니다." },
        { kind: "ox", q: "a = 5 는 \"a와 5가 같다\"는 뜻이다.", answer: false, explain: "=는 오른쪽 값을 왼쪽 이름에 담는 대입입니다. 같은지 비교는 ==를 씁니다." },
      ] }] },
  { id: "pb-02", track: "python-basic", title: "문자열 기초", summary: "따옴표, 인덱싱, 슬라이싱, +, *, len, type", unit: 2, level: "입문",
    concepts: ["py.str", "py.index-slice"],
    lessons: [{ id: "pb-02-1", title: "문자열 자르고 붙이기", minutes: 12, concepts: ["py.str", "py.index-slice"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "code = 'KR24A0915X'\nprint(code[2:4])", answer: "24", explain: "[2:4]는 2번, 3번 글자입니다. 끝 번호는 포함되지 않습니다." },
        { kind: "choice", q: "마지막 3글자를 꺼내는 식은?", options: ["code[3:]", "code[-3:]", "code[:3]", "code[-3]"], answer: 1, explain: "음수 인덱스는 뒤에서부터 셉니다. [-3:]은 뒤 3글자 전부입니다." },
      ] }] },
  { id: "pb-03", track: "python-basic", title: "문자열 메서드", summary: "upper, lower, split, join, replace, startswith, endswith, strip", unit: 3, level: "입문",
    concepts: ["py.str-method", "py.fstring"],
    lessons: [{ id: "pb-03-1", title: "문자열 메서드로 데이터 정리하기", minutes: 12, concepts: ["py.str-method", "py.fstring"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "log = 'ERROR,Temp,High'\nprint(len(log.split(',')))", answer: "3", explain: "split(',')은 쉼표 기준으로 3조각 리스트를 돌려줍니다." },
        { kind: "ox", q: "s.upper()를 호출하면 s 자체가 대문자로 바뀐다.", answer: false, explain: "문자열은 바뀌지 않습니다. 새 문자열을 돌려주므로 s = s.upper()처럼 다시 담아야 합니다." },
      ] }] },
  { id: "pb-04", track: "python-basic", title: "리스트 기초", summary: "인덱싱, 중첩 리스트, 슬라이싱, +, *, len, 수정, del, append, extend", unit: 4, level: "입문",
    concepts: ["py.list", "py.object-ref"],
    lessons: [{ id: "pb-04-1", title: "리스트에 담고 꺼내고 고치기", minutes: 12, concepts: ["py.list", "py.object-ref"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "lots = [101, 102]\nlots.append(103)\nprint(len(lots))", answer: "3", explain: "append는 끝에 하나를 붙입니다." },
        { kind: "choice", q: "append([1, 2])와 extend([1, 2])의 차이는?", options: ["같다", "append는 리스트 하나를 원소로, extend는 원소를 하나씩 붙인다", "extend는 앞에 붙인다", "append는 두 번 호출해야 한다"], answer: 1, explain: "append([1, 2])는 길이가 1 늘고, extend([1, 2])는 2 늘어납니다." },
      ] }] },
  { id: "pb-05", track: "python-basic", title: "리스트 정렬과 에러 읽기", summary: "sort vs sorted, reverse, remove, pop, SyntaxError · IndexError · NameError · ZeroDivisionError", unit: 5, level: "입문",
    concepts: ["py.sort", "py.error"],
    lessons: [{ id: "pb-05-1", title: "정렬 두 가지와 에러 메시지 읽는 법", minutes: 12, concepts: ["py.sort", "py.error"],
      quiz: [
        { kind: "choice", q: "nums = [3, 1, 2] 일 때 print(nums.sort()) 의 출력은?", options: ["[1, 2, 3]", "[3, 1, 2]", "None", "에러"], answer: 2, explain: "sort()는 리스트를 제자리에서 바꾸고 None을 돌려줍니다. 정렬된 새 리스트가 필요하면 sorted()를 씁니다." },
        { kind: "short", q: "리스트 길이가 3인데 nums[5]를 읽으면 나는 에러 이름을 쓰세요.", answer: "IndexError", explain: "범위를 벗어난 인덱스는 IndexError입니다." },
      ] }] },
  { id: "pb-06", track: "python-basic", title: "딕셔너리와 Set", summary: "key-value CRUD, keys, values, items, in, get, set, union, intersection", unit: 6, level: "입문",
    concepts: ["py.dict", "py.set"],
    lessons: [{ id: "pb-06-1", title: "이름으로 찾는 딕셔너리, 중복 없는 Set", minutes: 12, concepts: ["py.dict", "py.set"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "stock = {'A': 3}\nprint(stock.get('B', 0))", answer: "0", explain: "get(키, 기본값)은 키가 없을 때 기본값을 돌려주고 에러를 내지 않습니다." },
        { kind: "short", q: "출력 결과를 쓰세요.", code: "print(len({1, 1, 2, 3, 3}))", answer: "3", explain: "Set은 중복을 없앱니다. {1, 2, 3}" },
      ] }] },
  { id: "pb-07", track: "python-basic", title: "제어문 (if · for · while)", summary: "input, 형변환, if, for, while", unit: 7, level: "기본",
    concepts: ["py.input-cast", "py.if", "py.for", "py.while", "py.loop-flow"],
    lessons: [{ id: "pb-07-1", title: "조건으로 가르고 반복으로 돌리기", minutes: 15, concepts: ["py.input-cast", "py.if", "py.for", "py.while", "py.loop-flow"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "for i in range(1, 4):\n    print(i, end=' ')", answer: ["1 2 3", "123"], explain: "range(1, 4)는 1, 2, 3입니다. 끝 숫자 4는 포함되지 않습니다." },
        { kind: "ox", q: "input()으로 받은 값은 숫자를 입력해도 문자열이다.", answer: true, explain: "계산하려면 int()나 float()로 바꿔야 합니다." },
      ] }] },
  { id: "pb-08", track: "python-basic", title: "문자열 활용 (함수 문제)", summary: "인덱싱, 슬라이싱, 결합, len, split", unit: 8, level: "기본",
    concepts: ["py.function", "py.index-slice", "py.str-method"],
    lessons: [{ id: "pb-08-1", title: "solution 함수로 문자열 처리하기", minutes: 12, concepts: ["py.function", "py.index-slice", "py.str-method"],
      quiz: [
        { kind: "ox", q: "함수형 문제에서 답은 print()로 출력하면 채점된다.", answer: false, explain: "채점기는 return 값을 봅니다. print는 확인용입니다." },
        { kind: "short", q: "출력 결과를 쓰세요.", code: "def tail(s):\n    return s[-3:]\nprint(tail('EQP-A2024-001'))", answer: "001", explain: "[-3:]은 마지막 3글자입니다." },
      ] }] },
  { id: "pb-09", track: "python-basic", title: "알고리즘 (함수형)", summary: "solution 함수, return, min/max, enumerate, 딕셔너리", unit: 9, level: "기본",
    concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
    lessons: [{ id: "pb-09-1", title: "함수 안에서 세고 찾고 집계하기", minutes: 15, concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "for i, v in enumerate(['A', 'B']):\n    print(i, v)", answer: ["0 A\n1 B", "0 A 1 B", "0A1B"], explain: "enumerate는 (번호, 값) 쌍을 줍니다. 번호는 0부터입니다." },
        { kind: "ox", q: "함수 안에서 만든 변수는 함수 밖에서도 그대로 쓸 수 있다.", answer: false, explain: "함수 안의 변수는 지역 변수입니다. 밖으로 전하려면 return 하세요." },
      ] }] },
  { id: "pb-10", track: "python-basic", title: "파일 입출력 (CSV · JSON)", summary: "open, with, read/readlines, csv, json", unit: 11, level: "기본",
    concepts: ["py.file", "py.csv", "py.json"],
    lessons: [{ id: "pb-10-1", title: "파일을 열고 CSV · JSON 읽기", minutes: 15, concepts: ["py.file", "py.csv", "py.json"],
      quiz: [
        { kind: "ox", q: "with open(...) as f: 블록이 끝나면 파일은 자동으로 닫힌다.", answer: true, explain: "with 문은 블록을 벗어날 때 close()를 대신 호출합니다." },
        { kind: "choice", q: "CSV 한 줄 'A,12,OK'를 읽어 값 3개로 나누는 방법은?", options: ["line.split()", "line.split(',')", "line.strip()", "line.join(',')"], answer: 1, explain: "쉼표 기준으로 나누려면 split(',')입니다. 줄 끝 개행은 strip()으로 먼저 지웁니다." },
      ] }] },
  { id: "pb-11", track: "python-basic", title: "컴프리헨션과 람다", summary: "리스트 컴프리헨션, 조건부 컴프리헨션, lambda, key 함수", status: "planned", level: "기본", concepts: ["py.comprehension", "py.lambda"], lessons: [] },
  { id: "pb-12", track: "python-basic", title: "예외 처리", summary: "try, except, else, finally, raise", status: "planned", level: "기본", concepts: ["py.exception"], lessons: [] },

  // ── 파이썬 데이터분석 ────────────────────────────────────
  { id: "da-01", track: "python-da", title: "NumPy 배열과 연산", summary: "배열 연산, 통계량, 불리언 인덱싱, axis, 이상치", unit: 10, level: "기본",
    concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
    lessons: [{ id: "da-01-1", title: "반복문 없이 배열을 한 번에 계산하기", minutes: 15, concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
      quiz: [
        { kind: "short", q: "출력 결과를 쓰세요.", code: "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)", answer: ["[2 4 6]", "[2, 4, 6]"], explain: "배열에 숫자를 곱하면 모든 원소에 적용됩니다. 리스트의 [1,2,3]*2와 다릅니다." },
        { kind: "choice", q: "2차원 배열에서 열(세로) 방향으로 합을 구해 열마다 값 하나씩 얻으려면?", options: ["arr.sum()", "arr.sum(axis=0)", "arr.sum(axis=1)", "arr.sum(axis=2)"], answer: 1, explain: "axis=0은 행을 따라 접어 열별 결과를 남깁니다." },
      ] }] },
  { id: "da-02", track: "python-da", title: "인덱싱과 브로드캐스팅", summary: "2차원 인덱싱, 형상(shape), 브로드캐스팅 규칙", status: "planned", level: "기본", concepts: ["np.broadcast", "np.axis"], lessons: [] },
  { id: "da-03", track: "python-da", title: "pandas Series · DataFrame", summary: "읽기, head, info, describe, 열 선택", status: "planned", level: "기본", concepts: ["pd.dataframe"], lessons: [] },
  { id: "da-04", track: "python-da", title: "선택과 필터", summary: "loc, iloc, 조건 필터, query", status: "planned", level: "기본", concepts: ["pd.select"], lessons: [] },
  { id: "da-05", track: "python-da", title: "결측치와 전처리", summary: "isna, fillna, dropna, 형변환, apply", status: "planned", level: "기본", concepts: ["pd.missing"], lessons: [] },
  { id: "da-06", track: "python-da", title: "groupby와 pivot_table", summary: "split-apply-combine, agg, transform, pivot_table", status: "planned", level: "실무", concepts: ["pd.groupby", "pd.pivot"], lessons: [] },
  { id: "da-07", track: "python-da", title: "merge와 concat", summary: "키 결합, how, 행 증가 함정", status: "planned", level: "실무", concepts: ["pd.merge"], lessons: [] },
  { id: "da-08", track: "python-da", title: "시계열", summary: "datetime, resample, rolling, shift", status: "planned", level: "실무", concepts: ["pd.time"], lessons: [] },
  { id: "da-09", track: "python-da", title: "matplotlib 기본", summary: "선 · 막대 · 산점도, 축과 제목, 서브플롯", status: "planned", level: "기본", concepts: ["mpl.basic"], lessons: [] },
  { id: "da-10", track: "python-da", title: "seaborn 통계 시각화", summary: "분포, 범주 비교, 상관 히트맵", status: "planned", level: "실무", concepts: ["sns.stat"], lessons: [] },

  // ── SQL ──────────────────────────────────────────────────
  { id: "sq-01", track: "sql", title: "SELECT · WHERE", summary: "열 고르기, 조건, 비교·논리 연산자", status: "planned", level: "입문", concepts: ["sql.select"], lessons: [] },
  { id: "sq-02", track: "sql", title: "정렬 · LIMIT · 내장 함수", summary: "ORDER BY, LIMIT, 문자열·숫자 함수", status: "planned", level: "입문", concepts: ["sql.order"], lessons: [] },
  { id: "sq-03", track: "sql", title: "집계 GROUP BY · HAVING", summary: "COUNT · SUM · AVG, 그룹 조건", status: "planned", level: "기본", concepts: ["sql.group", "sql.exec-order"], lessons: [] },
  { id: "sq-04", track: "sql", title: "JOIN", summary: "INNER · LEFT · FULL, 키 중복", status: "planned", level: "기본", concepts: ["sql.join"], lessons: [] },
  { id: "sq-05", track: "sql", title: "서브쿼리와 CTE", summary: "WITH, 스칼라·인라인 뷰", status: "planned", level: "기본", concepts: ["sql.subquery"], lessons: [] },
  { id: "sq-06", track: "sql", title: "CASE · 날짜 · 문자열", summary: "조건 열, 날짜 계산, 문자열 가공", status: "planned", level: "기본", concepts: ["sql.case-date"], lessons: [] },
  { id: "sq-07", track: "sql", title: "윈도우 함수", summary: "ROW_NUMBER, RANK, 누적합, 이동평균", status: "planned", level: "실무", concepts: ["sql.window"], lessons: [] },
  { id: "sq-08", track: "sql", title: "실무 분석 쿼리", summary: "리텐션, 퍼널, 코호트", status: "planned", level: "실무", concepts: ["sql.analytics"], lessons: [] },

  // ── 통계 ─────────────────────────────────────────────────
  { id: "st-01", track: "stats", title: "기술통계", summary: "평균·중앙값·분산, 분포 모양", status: "planned", level: "입문", concepts: ["st.descriptive"], lessons: [] },
  { id: "st-02", track: "stats", title: "확률분포", summary: "이항·정규·포아송", status: "planned", level: "입문", concepts: ["st.distribution"], lessons: [] },
  { id: "st-03", track: "stats", title: "표본분포와 중심극한정리", summary: "표본평균의 분포, 표준오차", status: "planned", level: "기본", concepts: ["st.clt"], lessons: [] },
  { id: "st-04", track: "stats", title: "신뢰구간", summary: "95%의 의미, t 분포", status: "planned", level: "기본", concepts: ["st.ci"], lessons: [] },
  { id: "st-05", track: "stats", title: "가설검정과 t검정", summary: "p-value, 유의수준, 단측·양측", status: "planned", level: "기본", concepts: ["st.test", "st.power"], lessons: [] },
  { id: "st-06", track: "stats", title: "카이제곱 · ANOVA", summary: "범주 독립성, 세 집단 이상 비교", status: "planned", level: "실무", concepts: ["st.chi-anova"], lessons: [] },
  { id: "st-07", track: "stats", title: "상관과 회귀", summary: "상관계수, 최소제곱, 계수 해석", status: "planned", level: "실무", concepts: ["st.regression"], lessons: [] },
  { id: "st-08", track: "stats", title: "A/B 테스트와 검정력", summary: "표본 수 설계, 검정력 분석", status: "planned", level: "실무", concepts: ["st.abtest", "st.power"], lessons: [] },

  // ── 머신러닝 ─────────────────────────────────────────────
  { id: "ml-01", track: "ml", title: "ML 워크플로와 데이터 분할", summary: "train/test, 누수, 기준 모델", status: "planned", level: "입문", concepts: ["ml.workflow"], lessons: [] },
  { id: "ml-02", track: "ml", title: "선형 · 로지스틱 회귀", summary: "경사하강법, 계수, 확률 출력", status: "planned", level: "기본", concepts: ["ml.linear", "ml.gd"], lessons: [] },
  { id: "ml-03", track: "ml", title: "평가지표", summary: "precision · recall · F1 · ROC-AUC", status: "planned", level: "기본", concepts: ["ml.metrics"], lessons: [] },
  { id: "ml-04", track: "ml", title: "트리와 앙상블", summary: "결정트리, 랜덤포레스트, 부스팅", status: "planned", level: "기본", concepts: ["ml.tree"], lessons: [] },
  { id: "ml-05", track: "ml", title: "교차검증과 하이퍼파라미터", summary: "K-fold, GridSearch, 과적합", status: "planned", level: "기본", concepts: ["ml.cv", "ml.overfit"], lessons: [] },
  { id: "ml-06", track: "ml", title: "피처 엔지니어링과 Pipeline", summary: "스케일링, 인코딩, 파이프라인", status: "planned", level: "실무", concepts: ["ml.feature"], lessons: [] },
  { id: "ml-07", track: "ml", title: "비지도 학습", summary: "K-means, PCA", status: "planned", level: "실무", concepts: ["ml.kmeans", "ml.pca"], lessons: [] },
  { id: "ml-08", track: "ml", title: "불균형 데이터", summary: "리샘플링, class_weight, 임계값 조정", status: "planned", level: "실무", concepts: ["ml.imbalance"], lessons: [] },
  { id: "ml-09", track: "ml", title: "모델 해석", summary: "피처 중요도, 부분 의존도", status: "planned", level: "실무", concepts: ["ml.explain"], lessons: [] },

  // ── 딥러닝 (개념 학습, 실습 없음) ───────────────────────────
  { id: "dl-01", track: "dl", title: "퍼셉트론과 활성화 함수", summary: "뉴런, 가중치, 시그모이드 · ReLU", status: "planned", level: "입문", concepts: ["dl.perceptron"], lessons: [] },
  { id: "dl-02", track: "dl", title: "손실함수와 경사하강법", summary: "MSE · 교차엔트로피, 학습률", status: "planned", level: "입문", concepts: ["dl.loss"], lessons: [] },
  { id: "dl-03", track: "dl", title: "순전파와 역전파", summary: "계산 그래프, 연쇄법칙", status: "planned", level: "기본", concepts: ["dl.backprop"], lessons: [] },
  { id: "dl-04", track: "dl", title: "MLP 학습과 과적합", summary: "에폭, 배치, 드롭아웃", status: "planned", level: "기본", concepts: ["dl.mlp"], lessons: [] },
  { id: "dl-05", track: "dl", title: "CNN", summary: "합성곱, 풀링, 특징 맵", status: "planned", level: "기본", concepts: ["dl.cnn"], lessons: [] },
  { id: "dl-06", track: "dl", title: "RNN과 시퀀스", summary: "은닉 상태, 기울기 소실", status: "planned", level: "실무", concepts: ["dl.rnn"], lessons: [] },
  { id: "dl-07", track: "dl", title: "임베딩과 어텐션", summary: "Q · K · V, Transformer 개념", status: "planned", level: "실무", concepts: ["dl.attention"], lessons: [] },
];

export const LESSONS = COURSES.flatMap((c) => c.lessons.map((l) => ({ ...l, course: c.id, track: c.track })));
export const courseById = Object.fromEntries(COURSES.map((c) => [c.id, c]));
export const lessonById = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
export const trackById = Object.fromEntries(TRACKS.map((t) => [t.id, t]));
export const coursesOf = (trackId) => COURSES.filter((c) => c.track === trackId);
export const courseOfUnit = (unitId) => COURSES.find((c) => c.unit === unitId);
export const lessonPath = (l) => `content/${l.track}/${l.id}.md`;
