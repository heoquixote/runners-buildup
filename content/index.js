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
  { id: "stats", label: "통계", en: "Statistics", color: "amber", ready: true,
    blurb: "기술통계 · 분포 · 검정 · 회귀. 시뮬레이션으로 직관을 만듭니다." },
  { id: "ml", label: "머신러닝", en: "Machine Learning", color: "green", ready: true,
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
  // intro: 트랙 맨 앞 소개 코스(Day 00). 연습문제 · 퀴즈 없이 읽고 넘어간다.
  { id: "pb-00", track: "python-basic", intro: true, title: "파이썬 시작하기", summary: "파이썬이란, 설치 방법, 역사, 엑셀 · SQL · R과 비교한 장점", level: "입문",
    concepts: ["py.intro"],
    lessons: [{ id: "pb-00-1", title: "파이썬은 무엇이고, 왜 파이썬인가", minutes: 10, concepts: ["py.intro"] }] },
  { id: "pb-01", track: "python-basic", title: "변수와 사칙연산", summary: "변수, 주석, + - * / // % **", unit: 1, level: "입문",
    concepts: ["py.variable", "py.arith"],
    lessons: [{ id: "pb-01-1", title: "변수는 값에 붙이는 이름표", minutes: 10, concepts: ["py.variable", "py.arith"],
      quiz: [
        { kind: "write", q: "1000개를 24개들이 박스에 담을 때 가득 찬 박스 수를 출력하는 코드를 작성하세요.", expect: "41", must: ["//"], solution: "print(1000 // 24)", explain: "//는 몫입니다. 24개들이 박스 41개가 가득 찹니다." },
        { kind: "ox", q: "a = 5 는 \"a와 5가 같다\"는 뜻이다.", answer: false, explain: "=는 오른쪽 값을 왼쪽 이름에 담는 대입입니다. 같은지 비교는 ==를 씁니다." },
      ] }] },
  { id: "pb-02", track: "python-basic", title: "문자열 기초", summary: "따옴표, 인덱싱, 슬라이싱, +, *, len, type", unit: 2, level: "입문",
    concepts: ["py.str", "py.index-slice"],
    lessons: [{ id: "pb-02-1", title: "문자열 자르고 붙이기", minutes: 12, concepts: ["py.str", "py.index-slice"],
      quiz: [
        { kind: "write", q: "슬라이싱으로 code에서 연도 24를 잘라 출력하는 코드를 작성하세요.", given: "code = 'KR24A0915X'", expect: "24", must: ["code\\[[^\\]]*:[^\\]]*\\]"], solution: "code = 'KR24A0915X'\nprint(code[2:4])", explain: "[2:4]는 2번, 3번 글자입니다. 끝 번호는 포함되지 않습니다." },
        { kind: "choice", q: "마지막 3글자를 꺼내는 식은?", options: ["code[3:]", "code[-3:]", "code[:3]", "code[-3]"], answer: 1, explain: "음수 인덱스는 뒤에서부터 셉니다. [-3:]은 뒤 3글자 전부입니다." },
      ] }] },
  { id: "pb-03", track: "python-basic", title: "문자열 메서드", summary: "upper, lower, split, join, replace, startswith, endswith, strip", unit: 3, level: "입문",
    concepts: ["py.str-method", "py.fstring"],
    lessons: [{ id: "pb-03-1", title: "문자열 메서드로 데이터 정리하기", minutes: 12, concepts: ["py.str-method", "py.fstring"],
      quiz: [
        { kind: "write", q: "split으로 log를 쉼표 기준으로 나눈 뒤, 조각 개수를 출력하는 코드를 작성하세요.", given: "log = 'ERROR,Temp,High'", expect: "3", must: ["\\.split\\(","len\\("], solution: "log = 'ERROR,Temp,High'\nprint(len(log.split(',')))", explain: "split(',')은 쉼표 기준으로 3조각 리스트를 돌려줍니다." },
        { kind: "ox", q: "s.upper()를 호출하면 s 자체가 대문자로 바뀐다.", answer: false, explain: "문자열은 바뀌지 않습니다. 새 문자열을 돌려주므로 s = s.upper()처럼 다시 담아야 합니다." },
      ] }] },
  { id: "pb-04", track: "python-basic", title: "리스트 기초", summary: "인덱싱, 중첩 리스트, 슬라이싱, +, *, len, 수정, del, append, extend", unit: 4, level: "입문",
    concepts: ["py.list", "py.object-ref"],
    lessons: [{ id: "pb-04-1", title: "리스트에 담고 꺼내고 고치기", minutes: 12, concepts: ["py.list", "py.object-ref"],
      quiz: [
        { kind: "write", q: "append로 lots에 103을 추가한 뒤, lots의 길이를 출력하는 코드를 작성하세요.", given: "lots = [101, 102]", expect: "3", must: ["\\.append\\(","len\\("], solution: "lots = [101, 102]\nlots.append(103)\nprint(len(lots))", explain: "append는 끝에 하나를 붙입니다." },
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
        { kind: "write", q: "get으로 stock에서 'B' 재고를 읽되, 키가 없으면 0이 나오게 출력하는 코드를 작성하세요.", given: "stock = {'A': 3}", expect: "0", must: ["\\.get\\("], solution: "stock = {'A': 3}\nprint(stock.get('B', 0))", explain: "get(키, 기본값)은 키가 없을 때 기본값을 돌려주고 에러를 내지 않습니다." },
        { kind: "write", q: "set으로 nums의 중복을 없앤 뒤, 서로 다른 값의 개수를 출력하는 코드를 작성하세요.", given: "nums = [1, 1, 2, 3, 3]", expect: "3", must: ["set\\(","len\\("], solution: "nums = [1, 1, 2, 3, 3]\nprint(len(set(nums)))", explain: "Set은 중복을 없앱니다. {1, 2, 3}" },
      ] }] },
  { id: "pb-07", track: "python-basic", title: "제어문 (if · for · while)", summary: "input, 형변환, if, for, while", unit: 7, level: "기본",
    concepts: ["py.input-cast", "py.if", "py.for", "py.while", "py.loop-flow"],
    lessons: [{ id: "pb-07-1", title: "조건으로 가르고 반복으로 돌리기", minutes: 15, concepts: ["py.input-cast", "py.if", "py.for", "py.while", "py.loop-flow"],
      quiz: [
        { kind: "write", q: "for문과 range로 1 2 3 을 출력하는 코드를 작성하세요.", expect: ["1 2 3","123"], must: ["\\bfor\\b","range\\("], solution: "for i in range(1, 4):\n    print(i, end=' ')", explain: "range(1, 4)는 1, 2, 3입니다. 끝 숫자 4는 포함되지 않습니다." },
        { kind: "ox", q: "input()으로 받은 값은 숫자를 입력해도 문자열이다.", answer: true, explain: "계산하려면 int()나 float()로 바꿔야 합니다." },
      ] }] },
  { id: "pb-08", track: "python-basic", title: "문자열 활용 (함수 문제)", summary: "인덱싱, 슬라이싱, 결합, len, split", unit: 8, level: "기본",
    concepts: ["py.function", "py.index-slice", "py.str-method"],
    lessons: [{ id: "pb-08-1", title: "solution 함수로 문자열 처리하기", minutes: 12, concepts: ["py.function", "py.index-slice", "py.str-method"],
      quiz: [
        { kind: "ox", q: "함수형 문제에서 답은 print()로 출력하면 채점된다.", answer: false, explain: "채점기는 return 값을 봅니다. print는 확인용입니다." },
        { kind: "write", q: "문자열의 마지막 3글자를 돌려주는 함수 tail을 완성해 tail('EQP-A2024-001')의 결과를 출력하세요.", given: "def tail(s):\n    return \n\nprint(tail('EQP-A2024-001'))", expect: "001", must: ["return\\s+s\\["], solution: "def tail(s):\n    return s[-3:]\n\nprint(tail('EQP-A2024-001'))", explain: "[-3:]은 마지막 3글자입니다." },
      ] }] },
  { id: "pb-09", track: "python-basic", title: "알고리즘 (함수형)", summary: "solution 함수, return, min/max, enumerate, 딕셔너리", unit: 9, level: "기본",
    concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
    lessons: [{ id: "pb-09-1", title: "함수 안에서 세고 찾고 집계하기", minutes: 15, concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
      quiz: [
        { kind: "write", q: "enumerate로 ['A', 'B']의 번호와 값을 한 줄에 하나씩 (0 A, 1 B) 출력하는 코드를 작성하세요.", expect: ["0 A\n1 B"], must: ["enumerate\\("], solution: "for i, v in enumerate(['A', 'B']):\n    print(i, v)", explain: "enumerate는 (번호, 값) 쌍을 줍니다. 번호는 0부터입니다." },
        { kind: "ox", q: "함수 안에서 만든 변수는 함수 밖에서도 그대로 쓸 수 있다.", answer: false, explain: "함수 안의 변수는 지역 변수입니다. 밖으로 전하려면 return 하세요." },
      ] }] },
  { id: "pb-10", track: "python-basic", title: "파일 입출력 (CSV · JSON)", summary: "open, with, read/readlines, csv, json", unit: 11, level: "기본",
    concepts: ["py.file", "py.csv", "py.json"],
    lessons: [{ id: "pb-10-1", title: "파일을 열고 CSV · JSON 읽기", minutes: 15, concepts: ["py.file", "py.csv", "py.json"],
      quiz: [
        { kind: "ox", q: "with open(...) as f: 블록이 끝나면 파일은 자동으로 닫힌다.", answer: true, explain: "with 문은 블록을 벗어날 때 close()를 대신 호출합니다." },
        { kind: "choice", q: "CSV 한 줄 'A,12,OK'를 읽어 값 3개로 나누는 방법은?", options: ["line.split()", "line.split(',')", "line.strip()", "line.join(',')"], answer: 1, explain: "쉼표 기준으로 나누려면 split(',')입니다. 줄 끝 개행은 strip()으로 먼저 지웁니다." },
      ] }] },
  { id: "pb-11", track: "python-basic", title: "컴프리헨션과 람다", summary: "리스트 컴프리헨션, 조건부 컴프리헨션, lambda, sorted의 key", unit: 21, level: "기본",
    concepts: ["py.comprehension", "py.lambda"],
    lessons: [{ id: "pb-11-1", title: "for문 세 줄을 한 줄로, 정렬 기준은 lambda로", minutes: 15, concepts: ["py.comprehension", "py.lambda"],
      quiz: [
        { kind: "write", q: "리스트 컴프리헨션으로 temps에서 30 이상인 값만 남긴 리스트를 출력하는 코드를 작성하세요.", given: "temps = [28, 31, 35, 29, 30]", expect: "[31, 35, 30]", must: ["\\[.+\\bfor\\b.+\\bin\\b.+\\bif\\b.+\\]"], solution: "temps = [28, 31, 35, 29, 30]\nprint([t for t in temps if t >= 30])", explain: "[t for t in temps if 조건] 은 조건이 True인 값만 원래 순서대로 모읍니다." },
        { kind: "choice", q: "pairs = [(\"A\", 3), (\"B\", 1)] 을 두 번째 값 기준으로 정렬하는 코드는?", options: ["sorted(pairs, key=lambda p: p[1])", "sorted(pairs, key=p[1])", "sorted(pairs[1])", "pairs.sort(1)"], answer: 0, explain: "key에는 원소 하나를 받아 기준값을 돌려주는 함수를 넘깁니다." },
      ] }] },
  { id: "pb-12", track: "python-basic", title: "예외 처리", summary: "try, except, else, finally, ValueError · ZeroDivisionError · KeyError", unit: 22, level: "기본",
    concepts: ["py.exception"],
    lessons: [{ id: "pb-12-1", title: "에러가 나도 멈추지 않는 코드", minutes: 15, concepts: ["py.exception"],
      quiz: [
        { kind: "write", q: "try / except로 float('N/A')에서 나는 에러를 잡아 0.0을 출력하는 코드를 작성하세요.", expect: "0.0", must: ["\\btry\\s*:", "\\bexcept\\b"], solution: "try:\n    print(float('N/A'))\nexcept ValueError:\n    print(0.0)", explain: "float('N/A')는 ValueError를 냅니다. except 블록에서 대신할 값을 정합니다." },
        { kind: "ox", q: "except: 처럼 에러 이름을 비워 두는 것이 가장 안전한 습관이다.", answer: false, explain: "이름 없는 except는 오타(NameError)까지 숨깁니다. 잡을 에러를 이름으로 적으세요." },
      ] }] },

  // ── 파이썬 데이터분석 ────────────────────────────────────
  { id: "da-01", track: "python-da", title: "NumPy 배열과 연산", summary: "배열 연산, 통계량, 불리언 인덱싱, axis, 이상치", unit: 10, level: "기본",
    concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
    lessons: [{ id: "da-01-1", title: "반복문 없이 배열을 한 번에 계산하기", minutes: 15, concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
      quiz: [
        { kind: "write", q: "반복문 없이 a의 모든 원소에 2를 곱한 배열을 출력하는 코드를 작성하세요.", given: "import numpy as np\na = np.array([1, 2, 3])", expect: ["[2 4 6]"], must: ["a\\s*\\*\\s*2|2\\s*\\*\\s*a"], solution: "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)", explain: "배열에 숫자를 곱하면 모든 원소에 적용됩니다. 리스트의 [1,2,3]*2와 다릅니다." },
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
  { id: "st-01", track: "stats", title: "기술통계", summary: "평균·중앙값·분산, 사분위수, IQR 이상치, 변동계수", unit: 12, level: "입문",
    concepts: ["st.descriptive"],
    lessons: [{ id: "st-01-1", title: "평균만 보면 속는다: 대표값과 흩어짐", minutes: 15, concepts: ["st.descriptive"],
      quiz: [
        { kind: "choice", q: "이상치가 있는 데이터의 대표값으로 더 안정적인 것은?", options: ["평균", "중앙값", "최댓값", "합계"], answer: 1, explain: "중앙값은 가운데 순서의 값이라 극단값 하나에 거의 흔들리지 않습니다." },
        { kind: "ox", q: "표본 데이터의 표준편차는 np.std(x, ddof=1)로 구한다.", answer: true, explain: "ddof=1은 n−1로 나누는 표본 표준편차입니다. NumPy 기본값은 ddof=0입니다." },
      ] }] },
  { id: "st-02", track: "stats", title: "확률분포", summary: "이항 · 포아송 · 정규, pmf · cdf · sf · ppf", unit: 13, level: "입문",
    concepts: ["st.distribution"],
    lessons: [{ id: "st-02-1", title: "scipy.stats로 확률 계산하기", minutes: 15, concepts: ["st.distribution"],
      quiz: [
        { kind: "choice", q: "\"불량이 2개 이하일 확률\"을 구하는 메서드는?", options: ["pmf(2)", "cdf(2)", "sf(2)", "ppf(2)"], answer: 1, explain: "cdf(k)는 k 이하(누적) 확률입니다." },
        { kind: "choice", q: "평균과 표준편차로 정해지는 연속 분포는?", options: ["이항분포", "포아송분포", "정규분포", "기하분포"], answer: 2, explain: "stats.norm(loc=평균, scale=표준편차)." },
      ] }] },
  { id: "st-03", track: "stats", title: "표본분포와 중심극한정리", summary: "표본평균의 분포, 표준오차, 시뮬레이션", unit: 14, level: "기본",
    concepts: ["st.clt"],
    lessons: [{ id: "st-03-1", title: "표본평균은 왜 정규분포가 될까", minutes: 15, concepts: ["st.clt"],
      quiz: [
        { kind: "choice", q: "모표준편차가 6이고 n = 9일 때 표준오차는?", options: ["6", "3", "2", "0.67"], answer: 2, explain: "SE = σ/√n = 6/3 = 2." },
        { kind: "ox", q: "표본 크기가 커지면 표본평균들의 분포는 더 좁아진다.", answer: true, explain: "표준오차 σ/√n이 줄어들기 때문입니다." },
      ] }] },
  { id: "st-04", track: "stats", title: "신뢰구간", summary: "95%의 의미, t 분포, 비율의 신뢰구간", unit: 15, level: "기본",
    concepts: ["st.ci"],
    lessons: [{ id: "st-04-1", title: "평균과 비율의 95% 신뢰구간", minutes: 15, concepts: ["st.ci"],
      quiz: [
        { kind: "short", q: "표본 12개로 평균의 신뢰구간을 만들 때 t 분포의 자유도는?", answer: "11", explain: "n − 1 = 11." },
        { kind: "ox", q: "같은 데이터로 99% 신뢰구간을 만들면 95% 구간보다 넓다.", answer: true, explain: "더 높은 신뢰수준을 얻으려면 구간이 넓어집니다." },
      ] }] },
  { id: "st-05", track: "stats", title: "가설검정과 t검정", summary: "p-value, 유의수준, 1표본 · Welch · 대응표본, 단측", unit: 16, level: "기본",
    concepts: ["st.test", "st.power"],
    lessons: [{ id: "st-05-1", title: "p-value로 판단하기: 세 가지 t검정", minutes: 18, concepts: ["st.test"],
      quiz: [
        { kind: "choice", q: "같은 시편을 두 측정기로 잰 값을 비교할 때 쓰는 함수는?", options: ["stats.ttest_ind", "stats.ttest_rel", "stats.ttest_1samp", "stats.norm.cdf"], answer: 1, explain: "같은 대상을 두 번 잰 대응표본입니다." },
        { kind: "ox", q: "p-value가 0.05보다 작으면 귀무가설을 기각한다(유의수준 0.05).", answer: true, explain: "관측 결과가 귀무가설 아래에서 드물다는 뜻이므로 기각합니다." },
      ] }] },
  { id: "st-06", track: "stats", title: "카이제곱 · ANOVA", summary: "범주 독립성, 세 집단 이상 비교", status: "planned", level: "실무", concepts: ["st.chi-anova"], lessons: [] },
  { id: "st-07", track: "stats", title: "상관과 회귀", summary: "상관계수, 최소제곱, 계수 해석", status: "planned", level: "실무", concepts: ["st.regression"], lessons: [] },
  { id: "st-08", track: "stats", title: "A/B 테스트와 검정력", summary: "표본 수 설계, 검정력 분석", status: "planned", level: "실무", concepts: ["st.abtest", "st.power"], lessons: [] },

  // ── 머신러닝 ─────────────────────────────────────────────
  { id: "ml-01", track: "ml", title: "ML 워크플로와 데이터 분할", summary: "train/test, stratify, 기준 모델, 누수", unit: 17, level: "입문",
    concepts: ["ml.workflow"],
    lessons: [{ id: "ml-01-1", title: "모델보다 먼저: 나누고, 기준을 세우고, 새지 않게", minutes: 15, concepts: ["ml.workflow"],
      quiz: [
        { kind: "choice", q: "train_test_split에서 클래스 비율을 유지하는 인자는?", options: ["shuffle", "stratify", "random_state", "test_size"], answer: 1, explain: "stratify=y." },
        { kind: "ox", q: "스케일러는 전체 데이터로 fit 한 뒤 나누는 것이 정석이다.", answer: false, explain: "분할 후 학습 데이터로만 fit 해야 누수가 없습니다." },
      ] }] },
  { id: "ml-02", track: "ml", title: "선형 · 로지스틱 회귀", summary: "계수 해석, R², 확률 출력", unit: 18, level: "기본",
    concepts: ["ml.linear", "ml.gd"],
    lessons: [{ id: "ml-02-1", title: "직선 하나로 예측하고, 확률로 분류하기", minutes: 18, concepts: ["ml.linear", "ml.gd"],
      quiz: [
        { kind: "choice", q: "LinearRegression에서 기울기가 들어 있는 속성은?", options: ["model.slope", "model.coef_", "model.weight", "model.intercept_"], answer: 1, explain: "coef_는 피처별 기울기 배열, intercept_는 절편입니다." },
        { kind: "ox", q: "LogisticRegression의 predict는 확률이 0.5 이상이면 1로 판정한다.", answer: true, explain: "이진 분류의 기본 임계값은 0.5입니다." },
      ] }] },
  { id: "ml-03", track: "ml", title: "평가지표", summary: "혼동행렬, precision · recall · F1, 임계값, ROC-AUC", unit: 19, level: "기본",
    concepts: ["ml.metrics"],
    lessons: [{ id: "ml-03-1", title: "정확도 말고 무엇을 볼까", minutes: 15, concepts: ["ml.metrics"],
      quiz: [
        { kind: "short", q: "TP=6, FN=2일 때 재현율은? (소수)", answer: ["0.75", ".75"], explain: "6 / (6 + 2) = 0.75." },
        { kind: "choice", q: "임계값을 낮추면 보통 어떻게 되나?", options: ["recall↓ precision↑", "recall↑ precision↓", "둘 다 ↑", "변화 없음"], answer: 1, explain: "더 많이 1로 판정해 놓침은 줄고 오탐은 늘어납니다." },
      ] }] },
  { id: "ml-04", track: "ml", title: "트리와 앙상블", summary: "결정트리, 깊이와 과적합, 랜덤포레스트, 피처 중요도", unit: 20, level: "기본",
    concepts: ["ml.tree", "ml.overfit"],
    lessons: [{ id: "ml-04-1", title: "질문을 쌓는 결정트리, 투표하는 숲", minutes: 18, concepts: ["ml.tree", "ml.overfit"],
      quiz: [
        { kind: "choice", q: "결정트리의 과적합을 줄이는 가장 직접적인 방법은?", options: ["max_depth 제한", "random_state 변경", "표준화", "test_size 증가"], answer: 0, explain: "깊이를 제한하면 학습 데이터를 외우는 것을 막습니다." },
        { kind: "ox", q: "랜덤포레스트는 여러 결정트리의 예측을 모아 투표한다.", answer: true, explain: "배깅 + 피처 무작위 선택으로 만든 트리들의 다수결입니다." },
      ] }] },
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
