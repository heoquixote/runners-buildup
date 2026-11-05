// 커리큘럼: 트랙 > 코스 > 레슨. 문제는 코스의 unit 번호로 problems.js 의 유닛과 이어진다.
// 레슨 본문은 content/<트랙>/<레슨 id>.md 에 있고, 화면에서 그때그때 불러온다.
// 레슨 quiz 는 본문을 다 읽었는지 확인하는 1~3문항(형식은 problems.js 의 개념 퀴즈와 같다).

export const TRACKS = [
  { id: "python-basic", label: "파이썬 기초", en: "Python Basics", color: "violet", ready: true,
    blurb: "변수부터 파일 입출력까지. QA/QC 현장 예제로 문법을 익힙니다." },
  { id: "python-da", label: "데이터 분석", en: "Data Analysis", color: "cyan", ready: true,
    blurb: "NumPy · pandas로 데이터를 불러오고, 고르고, 묶고, 합칩니다." },
  { id: "python-viz", label: "데이터 시각화", en: "Visualization", color: "rose", ready: true,
    blurb: "matplotlib · seaborn으로 데이터를 그리고 읽습니다." },
  { id: "sql", label: "SQL", en: "SQL", color: "lime", ready: true,
    blurb: "SELECT부터 윈도우 함수 · 리텐션 분석까지. 브라우저 안의 SQLite로 바로 실행합니다." },
  { id: "stats", label: "통계", en: "Statistics", color: "amber", ready: true,
    blurb: "기술통계 · 분포 · 검정 · 회귀. 시뮬레이션으로 직관을 만듭니다." },
  { id: "ml", label: "머신러닝", en: "Machine Learning", color: "green", ready: true,
    blurb: "scikit-learn으로 회귀 · 분류 · 군집을 만들고 평가합니다." },
  { id: "dl", label: "딥러닝", en: "Deep Learning", color: "orange", ready: true,
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
  // intro: 트랙 맨 앞 소개 코스(Day 01). 연습문제 · 퀴즈 없이 읽고 넘어간다.
  { id: "pb-00", track: "python-basic", intro: true, title: "파이썬 시작하기", summary: "파이썬이란, 설치 방법, 역사, 엑셀 · SQL · R과 비교한 장점", level: "입문",
    concepts: ["py.intro"],
    lessons: [
      { id: "pb-00-1", title: "파이썬은 무엇이고, 왜 파이썬인가", minutes: 10, concepts: ["py.intro"] },
      // optional: 셋 중 하나만 골라 따라 하는 설치 가이드. 코스 진도 · 오늘의 학습 추천에서 뺀다.
      { id: "pb-00-2", title: "설치 가이드 ① Google Colab으로 바로 시작하기", minutes: 10, concepts: ["py.intro"], optional: true },
      { id: "pb-00-3", title: "설치 가이드 ② Anaconda 설치하고 Jupyter 열기", minutes: 20, concepts: ["py.intro"], optional: true },
      { id: "pb-00-4", title: "설치 가이드 ③ python.org + VS Code", minutes: 25, concepts: ["py.intro"], optional: true },
    ] },
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
    lessons: [{ id: "pb-07-1", title: "조건으로 가르고 반복으로 돌리기", minutes: 25, concepts: ["py.input-cast", "py.if", "py.for", "py.while", "py.loop-flow"],
      quiz: [
        { kind: "write", q: "for문과 range로 1 2 3 을 출력하는 코드를 작성하세요.", expect: ["1 2 3","123"], must: ["\\bfor\\b","range\\("], solution: "for i in range(1, 4):\n    print(i, end=' ')", explain: "range(1, 4)는 1, 2, 3입니다. 끝 숫자 4는 포함되지 않습니다." },
        { kind: "ox", q: "input()으로 받은 값은 숫자를 입력해도 문자열이다.", answer: true, explain: "계산하려면 int()나 float()로 바꿔야 합니다." },
      ] }] },
  { id: "pb-08", track: "python-basic", title: "문자열 활용 (함수 문제)", summary: "인덱싱, 슬라이싱, 결합, len, split", unit: 8, level: "기본",
    concepts: ["py.function", "py.index-slice", "py.str-method"],
    lessons: [{ id: "pb-08-1", title: "solution 함수로 문자열 처리하기", minutes: 20, concepts: ["py.function", "py.index-slice", "py.str-method"],
      quiz: [
        { kind: "ox", q: "함수형 문제에서 답은 print()로 출력하면 채점된다.", answer: false, explain: "채점기는 return 값을 봅니다. print는 확인용입니다." },
        { kind: "write", q: "문자열의 마지막 3글자를 돌려주는 함수 tail을 완성해 tail('EQP-A2024-001')의 결과를 출력하세요.", given: "def tail(s):\n    return \n\nprint(tail('EQP-A2024-001'))", expect: "001", must: ["return\\s+s\\["], solution: "def tail(s):\n    return s[-3:]\n\nprint(tail('EQP-A2024-001'))", explain: "[-3:]은 마지막 3글자입니다." },
      ] }] },
  { id: "pb-09", track: "python-basic", title: "알고리즘 (함수형)", summary: "solution 함수, return, min/max, enumerate, 딕셔너리", unit: 9, level: "기본",
    concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
    lessons: [{ id: "pb-09-1", title: "함수 안에서 세고 찾고 집계하기", minutes: 20, concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
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

  // ── 데이터 분석 (NumPy · pandas) ──────────────────────────
  { id: "da-01", track: "python-da", title: "NumPy 배열과 연산", summary: "배열 연산, 통계량, 불리언 인덱싱, axis, 이상치", unit: 10, level: "기본",
    concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
    lessons: [{ id: "da-01-1", title: "반복문 없이 배열을 한 번에 계산하기", minutes: 25, concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
      quiz: [
        { kind: "write", q: "반복문 없이 a의 모든 원소에 2를 곱한 배열을 출력하는 코드를 작성하세요.", given: "import numpy as np\na = np.array([1, 2, 3])", expect: ["[2 4 6]"], must: ["a\\s*\\*\\s*2|2\\s*\\*\\s*a"], solution: "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)", explain: "배열에 숫자를 곱하면 모든 원소에 적용됩니다. 리스트의 [1,2,3]*2와 다릅니다." },
        { kind: "choice", q: "2차원 배열에서 열(세로) 방향으로 합을 구해 열마다 값 하나씩 얻으려면?", options: ["arr.sum()", "arr.sum(axis=0)", "arr.sum(axis=1)", "arr.sum(axis=2)"], answer: 1, explain: "axis=0은 행을 따라 접어 열별 결과를 남깁니다." },
      ] }] },
  { id: "da-02", track: "python-da", title: "인덱싱과 브로드캐스팅", summary: "2차원 인덱싱, 형상(shape), 브로드캐스팅 규칙", unit: 23, level: "기본",
    concepts: ["np.broadcast", "np.axis"],
    lessons: [{ id: "da-02-1", title: "모양이 다른 배열끼리 계산하는 규칙", minutes: 25, concepts: ["np.broadcast", "np.axis"],
      quiz: [
        { kind: "write", q: "a에서 첫 행의 마지막 두 값을 리스트로 출력하는 코드를 작성하세요.", given: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])", expect: "[2, 3]", must: ["a\\[\\s*0\\s*,\\s*1\\s*:\\s*\\]"], solution: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(a[0, 1:].tolist())", explain: "a[0, 1:]은 0번 행의 1번 열부터 끝까지입니다." },
        { kind: "choice", q: "(4, 3) 배열에서 (3,) 배열을 빼면 어떻게 계산될까?", options: ["행마다 같은 3개 값을 뺀다", "열마다 같은 4개 값을 뺀다", "에러가 난다", "첫 행만 계산된다"], answer: 0, explain: "뒤 차원 3이 같으므로 (3,)이 4행으로 늘어나 각 행에서 빠집니다." },
      ] }] },
  { id: "da-03", track: "python-da", title: "pandas Series · DataFrame", summary: "read_csv, head, shape, describe, value_counts", unit: 24, level: "기본",
    concepts: ["pd.dataframe"],
    lessons: [{ id: "da-03-1", title: "표 데이터를 불러와 첫인상 잡기", minutes: 25, concepts: ["pd.dataframe"],
      quiz: [
        { kind: "write", q: "df의 qty 열 합계를 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "2110", must: ["\\[\\s*['\"]qty['\"]\\s*\\]"], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df['qty'].sum())", explain: "df['qty']는 Series이고 sum()으로 합계를 냅니다." },
        { kind: "ox", q: "df.head()는 기본으로 처음 5행을 보여 준다.", answer: true, explain: "개수를 바꾸려면 head(10)처럼 숫자를 넣습니다." },
      ] }] },
  { id: "da-04", track: "python-da", title: "선택과 필터", summary: "loc, iloc, 조건 필터, isin, query", unit: 25, level: "기본",
    concepts: ["pd.select"],
    lessons: [{ id: "da-04-1", title: "원하는 행과 열만 골라내기", minutes: 25, concepts: ["pd.select"],
      quiz: [
        { kind: "write", q: "df에서 line이 'A'인 행의 qty를 리스트로 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "[500, 520]", must: ["==\\s*['\"]A['\"]"], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df.loc[df['line'] == 'A', 'qty'].tolist())", explain: "df.loc[조건, '열'].tolist()" },
        { kind: "choice", q: "iloc[0:2]가 선택하는 행은?", options: ["0, 1번", "0, 1, 2번", "1, 2번", "라벨이 0~2인 행"], answer: 0, explain: "iloc 슬라이싱은 파이썬 리스트처럼 끝 번호를 포함하지 않습니다." },
      ] }] },
  { id: "da-05", track: "python-da", title: "결측치와 전처리", summary: "isna, fillna, dropna, 형변환, str 메서드, apply", unit: 26, level: "기본",
    concepts: ["pd.missing"],
    lessons: [{ id: "da-05-1", title: "빈칸과 지저분한 값 정리하기", minutes: 30, concepts: ["pd.missing"],
      quiz: [
        { kind: "write", q: "s의 결측값을 0으로 채운 뒤 합계를 출력하는 코드를 작성하세요.", given: "import numpy as np\nimport pandas as pd\ns = pd.Series([4.0, np.nan, 5.0])", expect: "9.0", must: ["fillna\\("], solution: "import numpy as np\nimport pandas as pd\ns = pd.Series([4.0, np.nan, 5.0])\nprint(s.fillna(0).sum())", explain: "fillna(0)로 채운 뒤 sum()" },
        { kind: "ox", q: "pd.Series(['1,200']).astype(int)는 바로 정수로 바뀐다.", answer: false, explain: "쉼표가 있어 ValueError가 납니다. str.replace(',', '')로 먼저 지우세요." },
      ] }] },
  { id: "da-06", track: "python-da", title: "groupby와 pivot_table", summary: "split-apply-combine, agg, transform, pivot_table", unit: 27, level: "실무",
    concepts: ["pd.groupby", "pd.pivot"],
    lessons: [{ id: "da-06-1", title: "나누고, 집계하고, 합치기", minutes: 30, concepts: ["pd.groupby", "pd.pivot"],
      quiz: [
        { kind: "write", q: "groupby로 line별 qty 합계를 딕셔너리로 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "{'A': 1020, 'B': 480, 'C': 610}", must: ["groupby\\("], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df.groupby('line')['qty'].sum().to_dict())", explain: "groupby('line')['qty'].sum()" },
        { kind: "choice", q: "groupby 결과를 원래 행 수 그대로 돌려줘 비중 계산에 쓰는 메서드는?", options: ["agg", "transform", "apply", "pivot"], answer: 1, explain: "transform은 그룹 집계값을 각 행에 붙여 줍니다." },
      ] }] },
  { id: "da-07", track: "python-da", title: "merge와 concat", summary: "키 결합, how, 행 증가 함정, 위아래 붙이기", unit: 28, level: "실무",
    concepts: ["pd.merge"],
    lessons: [{ id: "da-07-1", title: "두 표를 키로 잇고 위아래로 붙이기", minutes: 30, concepts: ["pd.merge"],
      quiz: [
        { kind: "write", q: "a와 b를 key로 left 결합한 결과의 행 수를 출력하는 코드를 작성하세요.", given: "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3]})\nb = pd.DataFrame({'key': [2, 3, 4], 'v': ['x', 'y', 'z']})", expect: "3", must: ["how\\s*=\\s*['\"]left['\"]"], solution: "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3]})\nb = pd.DataFrame({'key': [2, 3, 4], 'v': ['x', 'y', 'z']})\nprint(len(pd.merge(a, b, on='key', how='left')))", explain: "left는 왼쪽 행 3개를 모두 남깁니다." },
        { kind: "ox", q: "merge 후 행 수가 늘었다면 오른쪽 표에 키 중복이 있는지 먼저 의심해야 한다.", answer: true, explain: "1:N, N:M 결합에서는 행이 복제됩니다." },
      ] }] },
  { id: "da-08", track: "python-da", title: "시계열", summary: "to_datetime, dt, resample, rolling, shift", unit: 29, level: "실무",
    concepts: ["pd.time"],
    lessons: [{ id: "da-08-1", title: "시간 순서가 있는 데이터 다루기", minutes: 30, concepts: ["pd.time"],
      quiz: [
        { kind: "write", q: "pd.to_datetime으로 '2026-11-04 21:30'의 시(hour)를 출력하는 코드를 작성하세요.", expect: "21", must: ["to_datetime\\("], solution: "import pandas as pd\nprint(pd.to_datetime('2026-11-04 21:30').hour)", explain: "Timestamp의 .hour" },
        { kind: "choice", q: "1시간 단위 데이터를 하루 평균으로 바꾸는 코드는?", options: ["s.rolling(24).mean()", "s.resample('D').mean()", "s.shift(24)", "s.groupby(24).mean()"], answer: 1, explain: "resample('D')는 날짜 단위로 묶습니다." },
      ] }] },
  // ── 데이터 시각화 (matplotlib · seaborn) ─ 분석 목적별(비교 · 추이 · 분포 · 관계 · 구성) 구성. 기획안: docs/lesson-plans/viz.md ──
  { id: "da-09", track: "python-viz", dir: "python-da", title: "matplotlib 기본 구조", summary: "그래프 뼈대(fig · ax), 그리는 순서, 서브플롯 배치와 꾸미기", level: "기본",
    concepts: ["mpl.basic", "mpl.layout"],
    lessons: [
      { id: "da-09-1", title: "그래프의 뼈대: fig와 ax", minutes: 15, concepts: ["mpl.basic"],
        quiz: [
          { kind: "write", q: "fig, ax를 만들고 ax.plot으로 [1, 4, 9]를 그린 뒤, 그려진 선의 개수를 출력하는 코드를 작성하세요.", given: "import matplotlib.pyplot as plt", expect: "1", must: ["\\.plot\\("], solution: "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.plot([1, 4, 9])\nprint(len(ax.lines))", explain: "ax.plot을 한 번 부르면 ax.lines에 선 하나가 생깁니다." },
          { kind: "choice", q: "matplotlib에서 Axes(ax)가 뜻하는 것은?", options: ["x축 하나", "도화지 위에 놓인 그래프 한 칸 전체", "그림 파일 전체", "범례 상자"], answer: 1, explain: "Figure가 도화지, Axes는 그 위의 그래프 한 칸입니다. 제목·축·선이 모두 ax 안에 그려집니다." },
        ] },
      { id: "da-09-4", title: "여러 그래프 배치와 다듬기", minutes: 18, concepts: ["mpl.layout"] },
    ] },
  { id: "da-10", track: "python-viz", dir: "python-da", title: "seaborn 기본 구조", summary: "data · x · y · hue, 칸 단위 함수와 그림 단위 함수", level: "기본",
    concepts: ["sns.stat"],
    lessons: [
      { id: "da-10-1", title: "seaborn의 기본 구조: data · x · y · hue", minutes: 18, concepts: ["sns.stat"],
        quiz: [
          { kind: "write", q: "sns.countplot으로 df의 line별 개수를 그린 뒤, 막대 개수를 출력하는 코드를 작성하세요.", given: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C']})", expect: "3", must: ["countplot\\("], solution: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C']})\nax = sns.countplot(data=df, x='line')\nprint(len(ax.patches))", explain: "범주 A, B, C마다 막대 하나입니다." },
          { kind: "choice", q: "새 도화지를 스스로 만들어서 ax=를 받지 않고, col=로 칸을 나누는 함수는?", options: ["histplot", "boxplot", "displot", "heatmap"], answer: 2, explain: "displot · catplot · relplot · pairplot 같은 그림 단위 함수는 새 도화지를 만듭니다. 칸 단위 함수(histplot 등)는 ax=로 자리를 정해 줍니다." },
        ] },
    ] },
  { id: "da-12", track: "python-viz", dir: "python-da", title: "비교: 어느 쪽이 더 큰가", summary: "막대 · 가로 막대 · countplot, 평균과 오차 막대, 묶음 막대 · pointplot · 점 그래프", level: "기본",
    concepts: ["viz.compare"],
    lessons: [
      { id: "da-12-1", title: "막대 그래프 읽기", minutes: 15, concepts: ["viz.compare"],
        quiz: [
          { kind: "choice", q: "두 공장의 합격률 막대 그래프에서 y축이 90%부터 시작한다. A 막대가 B 막대보다 3배 길어 보이고 실제 값은 A 99%, B 93%다. 맞는 해석은?", options: ["A가 B보다 합격률이 3배 높다", "A가 B보다 6%p 높다. 막대 길이 차이는 축을 90에서 잘라 과장된 것이다", "축과 상관없이 막대 길이 비율이 곧 값의 비율이다", "B 공장은 합격률이 매우 낮다"], answer: 1, explain: "막대는 길이로 값을 나타내므로 0에서 시작해야 합니다. 축을 자르면 작은 차이가 몇 배처럼 보입니다." },
          { kind: "ox", q: "3등실 생존자 수(119명)가 2등실(87명)보다 많으므로 3등실의 생존율도 더 높다.", answer: false, explain: "개수는 그룹 크기의 영향을 받습니다. 3등실은 491명, 2등실은 184명이라 생존율은 3등실 24%, 2등실 47%입니다." },
        ] },
      { id: "da-12-2", title: "평균과 오차 막대 읽기", minutes: 18, concepts: ["viz.compare"],
        quiz: [
          { kind: "ox", q: "sns.barplot의 막대 높이는 기본으로 그룹의 합계다.", answer: false, explain: "기본은 평균입니다. 합계를 그리려면 estimator=\"sum\"을 줍니다." },
          { kind: "choice", q: "두 그룹의 평균 막대에서 오차 막대(95% 신뢰 구간)가 크게 겹친다. 알맞은 해석은?", options: ["두 그룹의 평균은 확실히 다르다", "두 그룹의 평균이 다르다고 단정하기 어렵다", "두 그룹의 데이터 개수가 같다", "오차 막대는 최솟값과 최댓값이다"], answer: 1, explain: "신뢰 구간이 크게 겹치면 데이터를 다시 모았을 때 순서가 바뀔 수도 있습니다. 차이를 단정하지 않습니다." },
        ] },
      { id: "da-12-3", title: "두 기준으로 나눠 비교하기", minutes: 18, concepts: ["viz.compare"],
        quiz: [
          { kind: "choice", q: "종(Adelie · Chinstrap · Gentoo)별 평균 몸무게 pointplot에서 암컷 선과 수컷 선이 거의 평행하다. 맞는 해석은?", options: ["암수 차이가 종마다 크게 다르다", "종과 상관없이 수컷이 암컷보다 비슷한 만큼 무겁다", "성별은 몸무게와 관계없다", "종은 몸무게와 관계없다"], answer: 1, explain: "평행선은 한 기준의 효과가 다른 기준과 상관없이 일정하다는 뜻입니다. 선이 엇갈려야 '조건에 따라 효과가 다르다'고 말합니다." },
        ] },
    ] },
  { id: "da-13", track: "python-viz", dir: "python-da", title: "추이: 시간에 따라 어떻게 변하나", summary: "선 그래프의 추세 · 계절성 · 급변, 이동평균 · 로그 축 · 기준선, 여러 시계열 비교", level: "기본",
    concepts: ["viz.trend"],
    lessons: [
      { id: "da-13-1", title: "선 그래프 읽기", minutes: 18, concepts: ["viz.trend"],
        quiz: [
          { kind: "choice", q: "월별 매출 선 그래프가 매년 12월에 봉우리를 만들고, 봉우리 높이가 해마다 높아진다. 맞는 해석은?", options: ["계절성만 있고 추세는 없다", "추세만 있고 계절성은 없다", "매년 12월에 오르는 계절성과 해마다 늘어나는 추세가 함께 있다", "불규칙 변동이라 해석할 수 없다"], answer: 2, explain: "같은 간격으로 반복되는 봉우리는 계절성, 전체 수준이 올라가는 것은 추세입니다." },
          { kind: "ox", q: "x축이 '1등실 · 2등실 · 3등실'처럼 순서 없는 범주여도 점들을 선으로 이어 추이로 읽을 수 있다.", answer: false, explain: "선은 '이어지는 변화'를 뜻합니다. 순서가 없는 범주는 막대로 비교합니다." },
        ] },
      { id: "da-13-2", title: "추세를 또렷하게: 이동평균 · 로그 축 · 기준선", minutes: 18, concepts: ["viz.trend"],
        quiz: [
          { kind: "choice", q: "7일 이동평균선이 오늘 막 아래로 꺾였다. 알맞은 해석은?", options: ["오늘 처음으로 값이 떨어졌다", "실제 변화는 며칠 전부터 시작됐을 수 있다", "이동평균은 미래를 예측한 값이다", "꺾인 것은 의미가 없다"], answer: 1, explain: "이동평균은 과거 N일을 평균하므로 실제 변화보다 늦게 반응합니다." },
          { kind: "ox", q: "로그 y축에서 선이 곧은 직선이면 매년 같은 개수(예: 100명)씩 늘어난 것이다.", answer: false, explain: "로그 축의 직선은 매년 같은 '비율(%)'로 늘었다는 뜻입니다. 같은 개수씩 늘면 일반 축에서 직선입니다." },
        ] },
      { id: "da-13-3", title: "여러 시계열 비교하기", minutes: 18, concepts: ["viz.trend"],
        quiz: [
          { kind: "choice", q: "1월 승객과 7월 승객을 첫해 = 100으로 지수화했더니 1960년에 두 선이 각각 372, 420이 됐다. 맞는 해석은?", options: ["1960년 7월 승객은 420명이다", "7월 승객이 1월보다 더 빠른 비율로 늘었다", "두 달의 실제 승객 수가 비슷하다", "1월 승객은 줄었다"], answer: 1, explain: "지수는 첫해 대비 몇 배인지를 나타냅니다. 원래 크기는 사라지고 증가 속도만 비교됩니다." },
        ] },
    ] },
  { id: "da-14", track: "python-viz", dir: "python-da", title: "분포: 값들이 어떻게 퍼져 있나", summary: "히스토그램, 밀도 곡선 · ECDF · 러그, 상자그림, 바이올린 · 스트립 · 스웜", level: "기본",
    concepts: ["viz.dist"],
    lessons: [
      { id: "da-14-1", title: "히스토그램 읽기", minutes: 20, concepts: ["viz.dist"],
        quiz: [
          { kind: "choice", q: "소득 히스토그램이 왼쪽에 몰려 있고 오른쪽으로 긴 꼬리가 있다. '보통 사람의 소득'을 말할 때 알맞은 값은?", options: ["평균 (꼬리 때문에 더 정확하다)", "중앙값 (꼬리에 덜 끌려간다)", "최댓값", "가장 큰 bin의 개수"], answer: 1, explain: "오른쪽 꼬리 분포에서는 큰 값 몇 개가 평균을 끌어올립니다. 중앙값이 보통 값을 더 잘 나타냅니다." },
          { kind: "choice", q: "히스토그램에 봉우리가 두 개 보일 때 가장 먼저 의심할 것은?", options: ["데이터 입력 오류", "서로 다른 무리(그룹)가 섞여 있다", "평균이 정확하다", "bins가 너무 적다"], answer: 1, explain: "봉우리 두 개는 종 · 성별 · 공정처럼 다른 그룹이 섞여 있을 때 자주 생깁니다. hue로 나눠 확인합니다." },
          { kind: "ox", q: "bins 개수를 바꿔도 히스토그램의 모양은 항상 같다.", answer: false, explain: "bins에 따라 봉우리가 생기거나 사라질 수 있습니다. bins를 바꿔도 유지되는 모양만 믿습니다." },
        ] },
      { id: "da-14-2", title: "밀도 곡선과 ECDF 읽기", minutes: 18, concepts: ["viz.dist"],
        quiz: [
          { kind: "choice", q: "ECDF 그래프에서 y = 0.5 가로선과 곡선이 만나는 x값은?", options: ["평균", "중앙값", "최빈값", "최댓값"], answer: 1, explain: "ECDF의 y는 '그 값 이하의 비율'입니다. 50%가 되는 지점이 중앙값입니다." },
          { kind: "ox", q: "나이 KDE 곡선이 0보다 작은 쪽까지 뻗어 있으므로 나이가 음수인 데이터가 있다.", answer: false, explain: "KDE는 데이터마다 언덕을 쌓아 양 끝에서도 곡선이 뻗습니다. 실제 범위는 러그나 최솟값으로 확인합니다." },
        ] },
      { id: "da-14-3", title: "상자그림 읽기", minutes: 18, concepts: ["viz.dist"],
        quiz: [
          { kind: "choice", q: "상자그림에서 상자 안의 가운데 선이 뜻하는 것은?", options: ["평균", "중앙값", "최빈값", "최댓값"], answer: 1, explain: "가운데 선은 중앙값, 상자의 아래 · 위 끝은 Q1 · Q3(가운데 50%)입니다." },
          { kind: "ox", q: "상자가 더 큰 그룹은 데이터 개수도 더 많다.", answer: false, explain: "상자 높이(IQR)는 값이 퍼진 정도입니다. 개수는 상자에 나타나지 않으므로 n을 따로 적어 줍니다." },
          { kind: "choice", q: "봉우리가 두 개인 분포를 상자그림으로 그리면?", options: ["상자가 두 개로 나뉜다", "봉우리가 보이지 않고 평범한 상자로 그려진다", "이상치 점이 두 무리로 찍힌다", "그릴 수 없다"], answer: 1, explain: "상자그림은 다섯 숫자로 요약하므로 봉우리 개수를 보여 주지 못합니다. 바이올린이나 히스토그램으로 확인합니다." },
        ] },
      { id: "da-14-4", title: "바이올린 · 스트립 · 스웜 읽기", minutes: 18, concepts: ["viz.dist"],
        quiz: [
          { kind: "ox", q: "바이올린 두 개의 크기가 비슷하면 두 그룹의 데이터 개수도 비슷하다.", answer: false, explain: "바이올린은 그룹마다 넓이를 같게 맞춰 그립니다. 개수는 스트립 · 스웜이나 n 표시로 확인합니다." },
          { kind: "choice", q: "그룹마다 데이터가 20개 정도일 때 분포를 가장 정직하게 보여 주는 그래프는?", options: ["바이올린", "밀도 곡선", "스트립 또는 스웜", "파이"], answer: 2, explain: "데이터가 적으면 매끈한 곡선 모양은 대부분 곡선이 만든 것입니다. 점을 다 찍는 것이 가장 정직합니다." },
        ] },
    ] },
  { id: "da-15", track: "python-viz", dir: "python-da", title: "관계와 상관: 두 값이 함께 움직이나", summary: "산점도, 추세선 · 잔차, 상관계수 · 히트맵 · 앤스콤, pairplot · jointplot · 심슨의 역설", unit: 30, level: "실무",
    concepts: ["viz.relation"],
    lessons: [
      { id: "da-15-1", title: "산점도 읽기", minutes: 18, concepts: ["viz.relation"],
        quiz: [
          { kind: "choice", q: "점 1만 개를 기본 산점도로 그렸더니 가운데가 한 덩어리로 칠해졌다. 가장 먼저 할 일은?", options: ["점을 더 크게 그린다", "alpha(투명도)를 낮추고 점을 작게 그린다", "파이 그래프로 바꾼다", "데이터를 지운다"], answer: 1, explain: "점이 겹치면 빽빽한 곳과 드문 곳이 똑같아 보입니다. 투명하게 그리면 겹친 곳일수록 진해집니다." },
          { kind: "ox", q: "산점도에서 오른쪽 위로 올라가는 띠가 보이면 x가 y의 원인이다.", answer: false, explain: "산점도는 '함께 움직인다'까지만 보여 줍니다. 원인인지는 따로 따져야 합니다." },
        ] },
      { id: "da-15-2", title: "추세선 읽기", minutes: 18, concepts: ["viz.relation"],
        quiz: [
          { kind: "choice", q: "계산 금액(x)과 팁(y)의 추세선 기울기가 0.105다. 맞는 해석은?", options: ["팁은 항상 계산 금액의 0.105배다", "계산 금액이 1달러 늘면 팁이 평균 약 0.1달러 늘어난다", "상관계수가 0.105다", "팁이 1달러 늘면 계산 금액이 0.105달러 는다"], answer: 1, explain: "기울기는 x가 1 늘 때 선 위의 y가 늘어나는 양입니다. 개별 점은 선 위아래로 흩어져 있습니다." },
          { kind: "ox", q: "추세선 주변의 옅은 띠 안에 대부분의 점이 들어 있어야 한다.", answer: false, explain: "띠는 '선이 있을 법한 범위'(신뢰 구간)이지 점들의 범위가 아닙니다. 대부분의 점은 띠 밖에 있습니다." },
        ] },
      { id: "da-15-3", title: "상관계수와 히트맵 읽기", minutes: 20, concepts: ["viz.relation"],
        quiz: [
          { kind: "ox", q: "상관계수가 0에 가까우면 두 값 사이에는 아무 관계도 없다.", answer: false, explain: "r은 직선 관계만 잽니다. 양 끝에서 고장이 나는 U자 관계처럼 r ≈ 0이어도 강한 관계가 있을 수 있습니다." },
          { kind: "choice", q: "네 데이터의 상관계수가 모두 0.82로 같다. 가장 먼저 할 일은?", options: ["네 데이터 모두 강한 직선 관계라고 보고한다", "산점도를 그려 곡선 · 이상치 여부를 확인한다", "평균을 비교한다", "히트맵을 그린다"], answer: 1, explain: "앤스콤의 네 데이터처럼 r이 같아도 모양은 전혀 다를 수 있습니다. r을 보고하기 전에 산점도를 그립니다." },
          { kind: "ox", q: "아이스크림 판매량과 물놀이 사고 건수의 상관계수가 0.9이므로, 아이스크림 판매가 사고의 원인이다.", answer: false, explain: "상관은 인과가 아닙니다. 둘 다 더운 날씨라는 제3의 원인 때문에 함께 늘었을 수 있습니다." },
        ] },
      { id: "da-15-4", title: "여러 변수 한 번에: pairplot · jointplot", minutes: 18, concepts: ["viz.relation"],
        quiz: [
          { kind: "choice", q: "펭귄 전체로는 부리 깊이와 몸무게의 r이 −0.47인데, 종별로 나누면 세 종 모두 +0.6 안팎이다. 알맞은 결론은?", options: ["부리가 깊을수록 가볍다", "같은 종 안에서는 부리가 깊을수록 무겁다. 전체 음의 관계는 종을 섞어서 생긴 착시다", "두 변수는 관계가 없다", "종별 계산이 틀렸다"], answer: 1, explain: "그룹을 섞으면 관계 방향이 뒤집히는 심슨의 역설입니다. 그룹별 결론을 보고합니다." },
        ] },
    ] },
  { id: "da-16", track: "python-viz", dir: "python-da", title: "구성과 비율: 전체 중 얼마인가", summary: "파이 · 도넛, 누적 막대와 100% 막대, 누적 영역", level: "기본",
    concepts: ["viz.composition"],
    lessons: [
      { id: "da-16-1", title: "파이 · 도넛 읽기", minutes: 15, concepts: ["viz.composition"],
        quiz: [
          { kind: "choice", q: "제품 12종의 판매 비율을 비교해 가장 많이 팔린 순서를 보여 주려면?", options: ["파이 그래프", "크기순으로 정렬한 막대 그래프", "선 그래프", "히스토그램"], answer: 1, explain: "조각이 많거나 비슷한 파이는 크기 비교가 어렵습니다. 정렬한 막대가 순위를 가장 정확히 보여 줍니다." },
          { kind: "ox", q: "파이 그래프는 빠진 값(결측)이 많으면 원이 덜 채워져서 바로 알 수 있다.", answer: false, explain: "파이는 무엇을 넣든 꽉 찬 원(100%)으로 그려집니다. 분모(n)를 제목이나 설명에서 확인해야 합니다." },
        ] },
      { id: "da-16-2", title: "누적 막대와 100% 막대 읽기", minutes: 18, concepts: ["viz.composition"],
        quiz: [
          { kind: "choice", q: "등급별 생존 비율을 비교하려고 한다. 그룹 크기가 491명, 216명, 184명으로 다를 때 알맞은 그래프는?", options: ["개수 누적 막대", "100% 누적 막대 + 막대마다 n 표시", "파이 세 개", "선 그래프"], answer: 1, explain: "비율 비교는 100% 막대가 정확합니다. 그룹 크기가 사라지므로 n을 함께 적습니다." },
          { kind: "ox", q: "누적 막대에서 위쪽 조각은 조각 끝의 높이로 막대끼리 비교할 수 있다.", answer: false, explain: "위쪽 조각은 막대마다 시작 높이가 달라서 끝 높이가 아니라 조각 길이로 비교해야 합니다." },
        ] },
      { id: "da-16-3", title: "시간에 따른 구성: 누적 영역", minutes: 15, concepts: ["viz.composition"],
        quiz: [
          { kind: "ox", q: "100% 누적 영역에서 겨울 층이 얇아졌으므로 겨울 승객 수가 줄었다.", answer: false, explain: "100% 그래프는 비중만 보여 줍니다. 겨울 승객 수는 3.6배 늘었고 비중만 조금 줄었습니다." },
          { kind: "choice", q: "누적 영역 그래프에서 '전체 승객 추이'를 읽으려면 어디를 봐야 하나?", options: ["맨 아래 층", "맨 위 경계선", "가장 두꺼운 층", "범례"], answer: 1, explain: "맨 위 경계선이 모든 층의 합(전체)입니다." },
        ] },
    ] },
  { id: "da-11", track: "python-viz", dir: "python-da", title: "차트 고르기", unit: 31, summary: "질문 → 차트 → 도구, 차트 지도, 흔한 왜곡과 보고서 체크리스트", level: "기본",
    concepts: ["viz.choose"],
    lessons: [{ id: "da-11-1", title: "질문에 맞는 차트 고르기", minutes: 15, concepts: ["viz.choose"],
      quiz: [
        { kind: "choice", q: "반 4개의 학생 키를 비교하면서, 유난히 크거나 작은 학생(이상치)도 함께 보고 싶다. 알맞은 차트는?", options: ["반별 평균 막대 그래프", "반별 상자그림", "반별 파이 그래프", "선 그래프"], answer: 1, explain: "분포와 이상치를 그룹별로 비교하는 질문이므로 상자그림입니다. 평균 막대는 이상치를 보여 주지 않습니다." },
        { kind: "choice", q: "학생 100명의 하루 공부 시간과 시험 점수가 함께 움직이는지 보고 싶다. 알맞은 차트는?", options: ["산점도", "누적 막대", "파이 그래프", "히스토그램"], answer: 0, explain: "숫자 두 개의 관계는 산점도입니다. 점 하나가 학생 한 명입니다." },
        { kind: "choice", q: "지난 5년 동안 전체 매출과 그 안의 제품군별 비중이 어떻게 변했는지 한 장으로 보여 주려면?", options: ["파이 그래프 5개", "누적 영역 그래프", "산점도", "히스토그램"], answer: 1, explain: "시간에 따른 구성은 누적 영역입니다. 맨 위 선이 전체 추이, 층 두께가 제품군입니다. 비중 변화만 보려면 100% 누적 영역을 씁니다." },
      ] }] },

  // ── SQL ──────────────────────────────────────────────────
  // SQL 실행 셀(```sqlrun)과 SQL 코드 작성 문항(lang: "sql")은 브라우저 SQLite로 돌린다 (sql.js). 기획안: docs/lesson-plans/sql.md
  // 배열 순서 = 화면의 Day 순서. CASE · 문자열(sq-06)을 JOIN 앞에 둔다 (코스 id는 그대로).
  { id: "sq-00", track: "sql", intro: true, title: "SQL 시작하기", summary: "SQL이란, 쓰이는 곳, 역사, 엑셀 · 파이썬과 비교, 데이터베이스 구조와 실습 데이터", level: "입문",
    concepts: ["sql.intro"],
    lessons: [
      { id: "sq-00-0", title: "SQL은 무엇이고, 왜 SQL인가", minutes: 10, concepts: ["sql.intro"] },
      { id: "sq-00-1", title: "데이터베이스 구조와 첫 쿼리", minutes: 12, concepts: ["sql.intro"] },
    ] },
  { id: "sq-01", track: "sql", title: "SELECT · WHERE", summary: "열 고르기, 별칭, DISTINCT, 비교 · 논리 연산자, IN · BETWEEN · LIKE, NULL", level: "입문",
    concepts: ["sql.select"],
    lessons: [{ id: "sq-01-1", title: "필요한 열만, 필요한 행만", minutes: 20, concepts: ["sql.select"],
      quiz: [
        { kind: "write", lang: "sql", q: "11번 부서에서 직급이 과장 또는 대리인 사원의 이름(ename_ko)과 직급(joblv)을 조회하는 SQL을 작성하세요.", given: "SELECT ename_ko, joblv\nFROM emp\nWHERE ", solution: "SELECT ename_ko, joblv\nFROM emp\nWHERE deptno = 11 AND joblv IN ('과장', '대리');", explain: "두 조건이 모두 참이어야 하므로 AND, 직급 목록은 IN으로 씁니다. (joblv = '과장' OR joblv = '대리')처럼 괄호로 묶어도 됩니다." },
        { kind: "write", lang: "sql", q: "orders에서 상품 분류(category)가 '전자'이고 결제 금액(amount)이 300000 이상인 주문의 order_id와 amount를 조회하는 SQL을 작성하세요.", given: "SELECT order_id, amount\nFROM orders\nWHERE ", solution: "SELECT order_id, amount\nFROM orders\nWHERE category = '전자' AND amount >= 300000;", explain: "두 조건이 모두 참이어야 하므로 AND로 잇습니다. 글자 '전자'는 작은따옴표로 감쌉니다. 8건이 나옵니다." },
        { kind: "ox", q: "WHERE comm = NULL 로 성과급이 NULL인 행을 찾을 수 있다.", answer: false, explain: "NULL과의 비교는 참도 거짓도 아닌 '모름'이라 아무 행도 나오지 않습니다. IS NULL을 씁니다." },
      ] }] },
  { id: "sq-02", track: "sql", title: "정렬 · LIMIT · 내장 함수", summary: "ORDER BY, LIMIT · OFFSET, 계산 열, 정수 나눗셈, ROUND · CAST", level: "입문",
    concepts: ["sql.order"],
    lessons: [{ id: "sq-02-1", title: "줄 세우고, 자르고, 계산하기", minutes: 18, concepts: ["sql.order"],
      quiz: [
        { kind: "write", lang: "sql", q: "연봉(sal)이 5000 이상인 사원 중 연봉이 높은 순으로 3명의 이름(ename_ko)과 연봉을 조회하는 SQL을 작성하세요.", given: "SELECT ename_ko, sal\nFROM emp\nWHERE sal >= 5000", solution: "SELECT ename_ko, sal\nFROM emp\nWHERE sal >= 5000\nORDER BY sal DESC\nLIMIT 3;", explain: "줄부터 세우고(ORDER BY sal DESC) 앞에서 자릅니다(LIMIT 3). ORDER BY가 없으면 '상위' 3명이 아니라 아무 3명입니다." },
        { kind: "choice", q: "이 사이트(SQLite)에서 SELECT 7 / 2; 의 결과는?", options: ["3.5", "3", "4", "오류"], answer: 1, explain: "정수 ÷ 정수는 몫만 남깁니다. 소수가 필요하면 7 / 2.0 이나 7 * 1.0 / 2 로 씁니다. (MySQL은 3.5)" },
      ] }] },
  { id: "sq-03", track: "sql", title: "집계 GROUP BY · HAVING", summary: "COUNT · SUM · AVG, 그룹별 집계, HAVING, 쿼리 실행 순서", level: "기본",
    concepts: ["sql.group", "sql.exec-order"],
    lessons: [{ id: "sq-03-1", title: "묶어서 세고, 묶은 뒤 거르기", minutes: 22, concepts: ["sql.group", "sql.exec-order"],
      quiz: [
        { kind: "write", lang: "sql", q: "orders에서 상품 분류(category)별 주문 수와 평균 결제 금액을 조회하는 SQL을 작성하세요. 평균은 ROUND(AVG(amount))로 정수까지 반올림합니다.", given: "SELECT category\nFROM orders", solution: "SELECT category, COUNT(*) AS n, ROUND(AVG(amount)) AS avg_amount\nFROM orders\nGROUP BY category;", explain: "category로 묶고, 바구니마다 COUNT(*)와 AVG(amount)를 구합니다. 의류가 140건으로 가장 많고, 평균 금액은 전자가 203,937원으로 가장 큽니다." },
        { kind: "choice", q: "orders에서 '주문이 100건 넘는 상품 분류만' 남기려고 한다. COUNT(*) > 100 조건은 어디에 써야 할까?", options: ["WHERE", "HAVING", "ORDER BY", "SELECT"], answer: 1, explain: "분류별로 묶은 뒤의 개수에 거는 조건이므로 HAVING입니다. WHERE는 묶기 전에 실행되어 COUNT를 알 수 없습니다." },
        { kind: "ox", q: "events에서 COUNT(user_id)는 user_id가 비어 있는(NULL) 비회원 방문 기록까지 센다.", answer: false, explain: "COUNT(열)은 NULL을 빼고 셉니다. 1,113건 중 625건만 셉니다. 모든 행을 세려면 COUNT(*)." },
      ] }] },
  { id: "sq-06", track: "sql", title: "CASE · 날짜 · 문자열", summary: "문자열 함수, IFNULL · COALESCE, CASE 구간화, strftime 날짜", level: "기본",
    concepts: ["sql.case-date"],
    lessons: [{ id: "sq-06-1", title: "글자 · 날짜 다듬고, 조건으로 나누기", minutes: 25, concepts: ["sql.case-date"],
      quiz: [
        { kind: "write", lang: "sql", q: "CASE를 써서 연봉(sal)이 10000 이상이면 '고급여', 6000 이상이면 '중간', 나머지는 '기본'으로 등급을 붙이고, 사원 이름(ename_ko)과 등급을 조회하는 SQL을 작성하세요.", given: "SELECT ename_ko,\n       CASE\n       END AS grade\nFROM emp;", must: ["CASE"], solution: "SELECT ename_ko,\n       CASE\n           WHEN sal >= 10000 THEN '고급여'\n           WHEN sal >= 6000 THEN '중간'\n           ELSE '기본'\n       END AS grade\nFROM emp;", explain: "큰 값(좁은 조건)부터 씁니다. 6000 이상을 먼저 쓰면 10000 이상도 모두 '중간'이 됩니다." },
        { kind: "ox", q: "CASE는 WHEN 조건을 모두 확인한 뒤, 마지막으로 맞은 조건의 값을 고른다.", answer: false, explain: "위에서부터 확인하다가 처음 맞는 조건에서 멈춥니다. 그래서 조건 순서가 결과를 바꿉니다." },
      ] }] },
  { id: "sq-04", track: "sql", title: "JOIN", summary: "INNER · LEFT JOIN, 짝 없는 행 찾기, 키 중복, SELF JOIN, UNION", level: "기본",
    concepts: ["sql.join"],
    lessons: [{ id: "sq-04-1", title: "흩어진 표를 키로 잇기", minutes: 25, concepts: ["sql.join"],
      quiz: [
        { kind: "write", lang: "sql", q: "emp와 dept를 부서 번호로 이어서 지역(location)별 평균 연봉을 조회하는 SQL을 작성하세요. 평균은 ROUND(AVG(...))로 정수로 반올림합니다.", given: "SELECT d.location\nFROM emp e", must: ["JOIN"], solution: "SELECT d.location, ROUND(AVG(e.sal)) AS avg_sal\nFROM emp e\nJOIN dept d ON e.deptno = d.deptno\nGROUP BY d.location;", explain: "JOIN으로 위치를 붙인 뒤 location으로 묶습니다. 서울 9233, 아산 6000입니다. 부서가 없는 김대표는 INNER JOIN에서 빠집니다." },
        { kind: "choice", q: "고객 256명(users)과 주문 372건(orders)이 있고, 주문이 한 건도 없는 고객이 64명이다. users LEFT JOIN orders 의 결과는 몇 행일까?", options: ["256행", "372행", "436행", "95,232행"], answer: 2, explain: "주문이 있는 고객은 주문 수만큼(372행), 주문이 없는 고객 64명은 NULL을 채운 1행씩 남습니다. 372 + 64 = 436." },
        { kind: "ox", q: "UNION은 붙인 결과에서 중복 행을 지우고, UNION ALL은 지우지 않는다.", answer: true, explain: "중복을 지우는 만큼 UNION이 더 느립니다. 중복이 없거나 지울 필요가 없으면 UNION ALL." },
      ] }] },
  { id: "sq-05", track: "sql", title: "서브쿼리와 CTE", summary: "WHERE · SELECT · FROM 안의 서브쿼리, IN, 상관 서브쿼리, WITH", level: "기본",
    concepts: ["sql.subquery"],
    lessons: [{ id: "sq-05-1", title: "쿼리 안의 쿼리, 이름 붙인 중간 결과", minutes: 22, concepts: ["sql.subquery"],
      quiz: [
        { kind: "write", lang: "sql", q: "서브쿼리를 써서, 회사 전체 평균 연봉보다 연봉이 높은 사원의 이름(ename_ko)과 연봉(sal)을 조회하는 SQL을 작성하세요.", given: "SELECT ename_ko, sal\nFROM emp\nWHERE sal > ", must: ["\\(\\s*SELECT"], solution: "SELECT ename_ko, sal\nFROM emp\nWHERE sal > (SELECT AVG(sal) FROM emp);", explain: "괄호 안의 평균이 먼저 계산되어 값 하나(약 14057)가 되고, 바깥 쿼리가 그 값으로 거릅니다. 3명이 나옵니다." },
        { kind: "choice", q: "(SELECT deptno FROM dept WHERE location = '서울') 은 4행을 돌려준다. 바깥 WHERE에 알맞은 것은?", options: ["WHERE deptno = (서브쿼리)", "WHERE deptno IN (서브쿼리)", "WHERE deptno > (서브쿼리)", "WHERE deptno LIKE (서브쿼리)"], answer: 1, explain: "여러 값 중 하나와 같은지는 IN입니다. = 를 쓰면 SQLite는 첫 행만 몰래 쓰고, MySQL은 오류를 냅니다." },
      ] }] },
  { id: "sq-07", track: "sql", title: "윈도우 함수", summary: "OVER · PARTITION BY, ROW_NUMBER · RANK, 그룹별 1등, 누적합, LAG, 이동평균", level: "실무",
    concepts: ["sql.window"],
    lessons: [{ id: "sq-07-1", title: "행을 지우지 않고 순위 · 누적 구하기", minutes: 25, concepts: ["sql.window"],
      quiz: [
        { kind: "choice", q: "연봉 80, 60, 60, 50에 RANK() OVER (ORDER BY 연봉 DESC)를 붙이면?", options: ["1, 2, 3, 4", "1, 2, 2, 3", "1, 2, 2, 4", "1, 1, 2, 3"], answer: 2, explain: "RANK는 동점에 같은 순위를 주고 그 수만큼 다음 순위를 건너뜁니다. 건너뛰지 않는 것은 DENSE_RANK(1, 2, 2, 3)." },
        { kind: "write", lang: "sql", q: "부서 번호(deptno)가 있는 사원만 대상으로, 부서별 연봉 1등 사원의 부서 번호 · 이름(ename_ko) · 연봉(sal)을 조회하는 SQL을 작성하세요.", given: "WITH ranked AS (\n    SELECT deptno, ename_ko, sal\n    FROM emp\n    WHERE deptno IS NOT NULL\n)\nSELECT deptno, ename_ko, sal\nFROM ranked;", solution: "WITH ranked AS (\n    SELECT deptno, ename_ko, sal,\n           ROW_NUMBER() OVER (PARTITION BY deptno ORDER BY sal DESC) AS rn\n    FROM emp\n    WHERE deptno IS NOT NULL\n)\nSELECT deptno, ename_ko, sal\nFROM ranked\nWHERE rn = 1;", explain: "PARTITION BY deptno로 부서마다 순위를 1부터 매기고, CTE 바깥에서 rn = 1만 남깁니다. 윈도우 함수는 같은 쿼리의 WHERE에서 쓸 수 없어서 한 단계 감쌉니다." },
      ] }] },
  { id: "sq-08", track: "sql", title: "실무 분석 쿼리", summary: "월별 KPI, 퍼널 전환율, 재구매율, 코호트 리텐션", level: "실무",
    concepts: ["sql.analytics"],
    lessons: [{ id: "sq-08-1", title: "매출 · 퍼널 · 리텐션 표 만들기", minutes: 30, concepts: ["sql.analytics"],
      quiz: [
        { kind: "choice", q: "'장바구니 → 구매' 전환율을 계산할 때 분모는?", options: ["방문(visit) 세션 수", "상품 보기(view) 세션 수", "장바구니(cart) 세션 수", "구매(purchase) 세션 수"], answer: 2, explain: "단계 전환율 = 이번 단계 ÷ 바로 앞 단계. 장바구니에 담은 세션 중 몇 %가 샀는지이므로 분모는 장바구니 세션 수입니다." },
        { kind: "ox", q: "코호트 표에서 아직 관측하지 못한 달(예: 6월 가입자의 2개월째)은 0으로 채워야 한다.", answer: false, explain: "아직 오지 않은 달은 0이 아니라 '모름(NULL)'입니다. 0으로 채우면 아무도 다시 사지 않았다는 틀린 결론이 나옵니다." },
      ] }] },

  // ── 통계 ─────────────────────────────────────────────────
  // 코스 · 레슨 id는 유지하고 레슨을 나눴다(2026-11-05). DAY 번호는 아래 배열 순서로 정해진다. 기획안: docs/lesson-plans/stats.md
  { id: "st-00", track: "stats", intro: true, title: "통계 시작하기", summary: "통계가 하는 일(기술 · 추론), 모집단과 표본, 변수와 척도", level: "입문",
    concepts: ["st.intro"],
    lessons: [
      { id: "st-00-1", title: "통계는 왜 배울까", minutes: 17, concepts: ["st.intro"],
        quiz: [
          { kind: "choice", q: "다음 중 추론통계 문장은?", options: ["계산서 244장의 평균 팁은 3.00달러다", "일요일 계산서의 평균 팁이 토요일보다 0.26달러 높다", "이 식당 손님 전체로 봐도 일요일 팁이 더 많을 것이다", "가장 많이 온 요일은 토요일이다"], answer: 2, explain: "가진 데이터 밖(손님 전체)으로 말을 넓히는 문장이 추론통계입니다. 나머지는 가진 데이터를 요약한 기술통계입니다." },
          { kind: "ox", q: "데이터가 아주 많으면 표본이 한쪽으로 쏠려 있어도(편향) 문제가 저절로 사라진다.", answer: false, explain: "뽑는 방법이 쏠려 있으면 데이터가 많을수록 틀린 값을 더 확신하게 될 뿐입니다." },
        ] },
      { id: "st-00-2", title: "데이터의 재료: 모집단 · 표본 · 변수 · 척도", minutes: 20, concepts: ["st.intro"],
        quiz: [
          { kind: "choice", q: "설문의 '만족도 1~5점'은 어떤 척도일까?", options: ["명목척도", "서열척도", "등간척도", "비율척도"], answer: 1, explain: "순서는 있지만 4점과 5점의 간격이 1점과 2점의 간격과 같다고 보기 어려운 서열척도입니다." },
          { kind: "choice", q: "지역 코드(1 = 서울, 2 = 부산, 3 = 대구)를 요약하는 알맞은 방법은?", options: ["평균", "표준편차", "개수 · 비율 · 최빈값", "중앙값"], answer: 2, explain: "숫자는 이름표일 뿐인 명목척도라서 평균이나 중앙값은 의미가 없습니다." },
          { kind: "ox", q: "표본에서 계산한 평균(통계량)은 모집단의 평균(모수)과 항상 같다.", answer: false, explain: "표본평균은 모평균을 짐작하는 값으로, 뽑을 때마다 흔들립니다." },
        ] },
    ] },
  { id: "st-01", track: "stats", title: "기술통계", summary: "평균 · 중앙값 · 최빈값, 분산 · 표준편차 · 변동계수, 사분위수와 이상치, 분포의 모양", unit: 12, level: "입문",
    concepts: ["st.descriptive"],
    lessons: [
      { id: "st-01-1", title: "대표값: 평균 · 중앙값 · 최빈값", minutes: 20, concepts: ["st.descriptive"],
        quiz: [
          { kind: "choice", q: "이상치가 있는 데이터의 대표값으로 더 안정적인 것은?", options: ["평균", "중앙값", "최댓값", "합계"], answer: 1, explain: "중앙값은 가운데 순서의 값이라 극단값 하나에 거의 흔들리지 않습니다." },
          { kind: "choice", q: "티셔츠 판매 기록(빨강 · 파랑 · 검정)에서 '가장 잘 팔린 색'을 말하는 대표값은?", options: ["평균", "중앙값", "최빈값", "표준편차"], answer: 2, explain: "범주형 데이터에 쓸 수 있는 대표값은 가장 흔한 값, 최빈값뿐입니다." },
        ] },
      { id: "st-01-2", title: "흩어짐: 범위 · 분산 · 표준편차 · 변동계수", minutes: 23, concepts: ["st.descriptive"],
        quiz: [
          { kind: "ox", q: "표본 데이터의 표준편차는 np.std(x, ddof=1)로 구한다.", answer: true, explain: "ddof=1은 n−1로 나누는 표본 표준편차입니다. NumPy 기본값은 ddof=0입니다." },
          { kind: "short", q: "값 2, 4, 6의 분산을 n(=3)으로 나눠 구하세요. (소수 둘째 자리)", answer: ["2.67", "2.666", "2.667", "8/3"], explain: "평균 4, 편차 −2 · 0 · 2, 제곱합 8, 8 ÷ 3 ≈ 2.67." },
        ] },
      { id: "st-01-3", title: "위치와 이상치: 사분위수 · 상자그림 · z점수", minutes: 23, concepts: ["st.descriptive"] },
      { id: "st-01-4", title: "분포의 모양: 히스토그램 · 왜도 · 첨도", minutes: 20, concepts: ["st.descriptive"],
        quiz: [
          { kind: "choice", q: "평균이 중앙값보다 훨씬 크다면 분포는 어떤 모양일 가능성이 높을까?", options: ["좌우 대칭", "오른쪽(큰 값 쪽) 꼬리가 긴 분포", "왼쪽(작은 값 쪽) 꼬리가 긴 분포", "봉우리가 없는 평평한 분포"], answer: 1, explain: "큰 값 몇 개가 평균을 오른쪽으로 끌고 가면 평균 > 중앙값이 됩니다." },
          { kind: "ox", q: "왜도가 0에 가까우면 이상치가 하나도 없다.", answer: false, explain: "왜도는 좌우 균형만 봅니다. 양쪽에 이상치가 비슷하게 있으면 왜도는 0에 가까워도 첨도가 커집니다." },
        ] },
    ] },
  { id: "st-09", track: "stats", title: "확률 기초", summary: "사건과 확률, 큰 수의 법칙, 시뮬레이션, 조건부확률과 베이즈 정리", unit: 47, level: "입문",
    concepts: ["st.probability"],
    lessons: [
      { id: "st-09-1", title: "사건과 확률, 큰 수의 법칙", minutes: 20, concepts: ["st.probability"],
        quiz: [
          { kind: "short", q: "공정한 주사위를 한 번 던져 3 이하가 나올 확률은? (소수)", answer: ["0.5", ".5", "1/2"], explain: "{1, 2, 3} 세 개 ÷ 여섯 개 = 0.5." },
          { kind: "ox", q: "동전을 10번 던져 앞면이 7번 나왔으니, 이 동전의 앞면 확률은 0.7이라고 확신할 수 있다.", answer: false, explain: "10번은 너무 적어서 우연이 크게 작용합니다. 큰 수의 법칙은 아주 많이 반복할 때 성립합니다." },
        ] },
      { id: "st-09-2", title: "조건부확률과 베이즈 정리", minutes: 25, concepts: ["st.probability"],
        quiz: [
          { kind: "short", q: "남학생 60명 중 15명, 여학생 40명 중 4명이 안경을 썼다. P(안경 | 남학생)은? (소수)", answer: ["0.25", ".25", "1/4"], explain: "조건(남학생) 60명만 분모로: 15 ÷ 60 = 0.25." },
          { kind: "choice", q: "P(A | B)와 P(B | A)의 관계로 옳은 것은?", options: ["항상 같다", "분자는 같지만 분모가 달라서 보통 다르다", "합이 항상 1이다", "곱이 항상 P(A)다"], answer: 1, explain: "둘 다 분자는 'A이면서 B'이지만, 분모가 B 전체냐 A 전체냐가 다릅니다." },
          { kind: "ox", q: "정확도 90%인 검사에서 양성이 나왔다면, 그 사람이 실제로 병이 있을 확률도 90%다.", answer: false, explain: "병이 드물면(기저율이 낮으면) 양성 중 진짜 환자의 비율은 훨씬 낮을 수 있습니다. 베이즈 정리로 계산해야 합니다." },
        ] },
    ] },
  { id: "st-02", track: "stats", title: "확률분포", summary: "확률변수 · pmf · cdf · 기댓값, 이항 · 포아송, 정규분포와 표준화", unit: 13, level: "입문",
    concepts: ["st.distribution"],
    lessons: [
      { id: "st-02-1", title: "확률변수와 확률분포", minutes: 20, concepts: ["st.distribution"],
        quiz: [
          { kind: "choice", q: "\"불량이 2개 이하일 확률\"을 구하는 메서드는?", options: ["pmf(2)", "cdf(2)", "sf(2)", "ppf(2)"], answer: 1, explain: "cdf(k)는 k 이하(누적) 확률입니다." },
          { kind: "short", q: "X가 0, 1, 2를 각각 확률 0.25, 0.5, 0.25로 가질 때 기댓값은?", answer: ["1", "1.0"], explain: "0 × 0.25 + 1 × 0.5 + 2 × 0.25 = 1." },
        ] },
      { id: "st-02-2", title: "이항분포와 포아송분포", minutes: 23, concepts: ["st.distribution"],
        quiz: [
          { kind: "choice", q: "이항분포 X에서 \"5개 이상일 확률\"을 구하는 코드는?", options: ["X.sf(5)", "X.sf(4)", "X.cdf(5)", "1 - X.pmf(5)"], answer: 1, explain: "sf(k)는 k 초과입니다. 5 이상 = 4 초과이므로 sf(4)." },
          { kind: "choice", q: "\"하루 평균 3건 들어오는 민원이 오늘 몇 건 올까\"에 알맞은 분포는?", options: ["이항분포", "포아송분포", "정규분포", "균일분포"], answer: 1, explain: "일정한 시간 동안 드문 일이 일어나는 횟수는 평균 λ 하나로 정해지는 포아송분포를 씁니다." },
        ] },
      { id: "st-02-3", title: "정규분포와 표준화", minutes: 23, concepts: ["st.distribution"],
        quiz: [
          { kind: "choice", q: "평균과 표준편차로 정해지는 연속 분포는?", options: ["이항분포", "포아송분포", "정규분포", "기하분포"], answer: 2, explain: "stats.norm(loc=평균, scale=표준편차)." },
          { kind: "short", q: "정규분포에서 평균 ± 2 × 표준편차 안에 들어갈 확률은 약 몇 %? (숫자만)", answer: ["95", "95%"], explain: "68 - 95 - 99.7 규칙: ±1σ 68%, ±2σ 95%, ±3σ 99.7%." },
        ] },
    ] },
  { id: "st-03", track: "stats", title: "표본분포와 중심극한정리", summary: "무작위 추출과 편향, 표본평균의 분포와 표준오차, 중심극한정리", unit: 14, level: "기본",
    concepts: ["st.clt"],
    lessons: [
      { id: "st-03-1", title: "표본 뽑기와 편향", minutes: 20, concepts: ["st.clt"],
        quiz: [
          { kind: "choice", q: "\"고등학생의 하루 공부 시간\"을 학원가 앞에서만 설문했다. 어떤 문제가 생길까?", options: ["무응답 편향", "선택 편향", "흔들림만 커지고 편향은 없다", "아무 문제 없다"], answer: 1, explain: "뽑히기 쉬운 사람(학원에 다니는 학생)만 뽑혀서 실제보다 높게 나오는 선택 편향입니다." },
          { kind: "ox", q: "편향된 방법으로 뽑더라도 표본을 10배로 늘리면 편향이 줄어든다.", answer: false, explain: "표본을 키우면 흔들림은 줄지만 편향은 그대로입니다. 뽑는 방법을 고쳐야 합니다." },
        ] },
      { id: "st-03-2", title: "표본평균의 분포와 표준오차", minutes: 23, concepts: ["st.clt"],
        quiz: [
          { kind: "choice", q: "모표준편차가 6이고 n = 9일 때 표준오차는?", options: ["6", "3", "2", "0.67"], answer: 2, explain: "SE = σ/√n = 6/3 = 2." },
          { kind: "ox", q: "표본 크기가 커지면 표본평균들의 분포는 더 좁아진다.", answer: true, explain: "표준오차 σ/√n이 줄어들기 때문입니다." },
        ] },
      { id: "st-03-3", title: "중심극한정리", minutes: 23, concepts: ["st.clt"] },
    ] },
  { id: "st-04", track: "stats", title: "신뢰구간", summary: "95%의 의미, 신뢰수준과 폭, t 분포, 평균 · 비율의 신뢰구간", unit: 15, level: "기본",
    concepts: ["st.ci"],
    lessons: [
      { id: "st-04-1", title: "95% 신뢰구간의 뜻", minutes: 23, concepts: ["st.ci"],
        quiz: [
          { kind: "choice", q: "95% 신뢰구간의 올바른 해석은?", options: ["모평균이 이 구간에 있을 확률이 95%다", "데이터의 95%가 이 구간 안에 있다", "같은 방법으로 구간을 반복해 만들면 약 95%가 모평균을 포함한다", "표본평균이 맞을 확률이 95%다"], answer: 2, explain: "95%는 구간을 만드는 방법의 성공률입니다. 이미 만든 구간은 모평균을 포함하거나 안 하거나 둘 중 하나입니다." },
          { kind: "ox", q: "다른 조건이 같다면 표본 수를 늘릴수록 신뢰구간이 좁아진다.", answer: true, explain: "SE = σ/√n이 줄어들기 때문입니다. 4배로 늘리면 폭이 절반." },
        ] },
      { id: "st-04-2", title: "t분포로 구하는 평균 · 비율의 신뢰구간", minutes: 23, concepts: ["st.ci"],
        quiz: [
          { kind: "short", q: "표본 12개로 평균의 신뢰구간을 만들 때 t 분포의 자유도는?", answer: "11", explain: "n − 1 = 11." },
          { kind: "ox", q: "같은 데이터로 99% 신뢰구간을 만들면 95% 구간보다 넓다.", answer: true, explain: "더 높은 신뢰수준을 얻으려면 구간이 넓어집니다." },
        ] },
    ] },
  { id: "st-05", track: "stats", title: "가설검정과 t검정", summary: "귀무가설 · p-value · 유의수준, 1종 · 2종 오류와 검정력, 1표본 · Welch · 대응 t검정, 단측", unit: 16, level: "기본",
    concepts: ["st.test", "st.power"],
    lessons: [
      { id: "st-05-1", title: "가설검정의 논리와 p-value", minutes: 25, concepts: ["st.test"],
        quiz: [
          { kind: "ox", q: "p-value가 0.05보다 작으면 귀무가설을 기각한다(유의수준 0.05).", answer: true, explain: "관측 결과가 귀무가설 아래에서 드물다는 뜻이므로 기각합니다." },
          { kind: "choice", q: "p-value = 0.03의 올바른 해석은?", options: ["귀무가설이 맞을 확률이 3%다", "효과의 크기가 3%다", "귀무가설이 맞다면 지금만큼 또는 더 극단적인 결과가 나올 확률이 3%다", "대립가설이 맞을 확률이 97%다"], answer: 2, explain: "p-value는 귀무가설을 가정했을 때의 확률입니다. 가설이 맞을 확률도, 효과 크기도 아닙니다." },
        ] },
      { id: "st-05-2", title: "1종 오류 · 2종 오류 · 검정력", minutes: 23, concepts: ["st.power"],
        quiz: [
          { kind: "choice", q: "실제로는 효과가 없는 약을 \"효과가 있다\"고 결론 내렸다. 어떤 오류일까?", options: ["1종 오류", "2종 오류", "검정력", "올바른 판단"], answer: 0, explain: "없는 차이를 있다고 판단하는 헛경보가 1종 오류(확률 α)입니다." },
          { kind: "ox", q: "다른 조건이 같다면 표본 수를 늘릴수록 검정력이 높아진다.", answer: true, explain: "표준오차가 줄어 두 분포의 겹침이 줄어들기 때문입니다." },
        ] },
      { id: "st-05-3", title: "세 가지 t검정", minutes: 25, concepts: ["st.test"],
        quiz: [
          { kind: "choice", q: "같은 시편을 두 측정기로 잰 값을 비교할 때 쓰는 함수는?", options: ["stats.ttest_ind", "stats.ttest_rel", "stats.ttest_1samp", "stats.norm.cdf"], answer: 1, explain: "같은 대상을 두 번 잰 대응표본입니다." },
          { kind: "choice", q: "남학생 그룹과 여학생 그룹의 평균 키를 비교할 때 쓰는 함수는?", options: ["stats.ttest_1samp(x, 170)", "stats.ttest_rel(a, b)", "stats.ttest_ind(a, b, equal_var=False)", "stats.chi2_contingency(table)"], answer: 2, explain: "서로 다른 사람들로 된 독립인 두 그룹이므로 독립 2표본(Welch) t검정입니다." },
        ] },
    ] },
  { id: "st-06", track: "stats", title: "카이제곱 · ANOVA", summary: "관측도수와 기대도수, 독립성 · 적합도 검정, 일원분산분석과 사후검정", unit: 32, level: "실무",
    concepts: ["st.chi-anova"],
    lessons: [
      { id: "st-06-1", title: "카이제곱 검정: 범주끼리 관련이 있을까", minutes: 23, concepts: ["st.chi-anova"],
        quiz: [
          { kind: "ox", q: "독립성 카이제곱 검정의 자유도는 (행 수 − 1) × (열 수 − 1)이다.", answer: true, explain: "2×3 교차표면 1 × 2 = 2." },
          { kind: "short", q: "교차표에서 어떤 칸의 행 합계가 40, 열 합계가 50, 전체 합계가 100일 때 기대도수는?", answer: ["20", "20.0"], explain: "40 × 50 ÷ 100 = 20." },
        ] },
      { id: "st-06-2", title: "분산분석(ANOVA)과 사후검정", minutes: 25, concepts: ["st.chi-anova"],
        quiz: [
          { kind: "choice", q: "세 설비의 평균 두께가 같은지 한 번에 검정하는 함수는?", options: ["stats.ttest_ind", "stats.f_oneway", "stats.chisquare", "stats.pearsonr"], answer: 1, explain: "세 집단 이상 평균 비교는 일원분산분석(f_oneway)입니다." },
          { kind: "ox", q: "ANOVA 결과가 유의하면 모든 그룹이 서로 다르다는 뜻이다.", answer: false, explain: "'적어도 한 그룹은 다르다'까지만 말해 줍니다. 어느 쌍이 다른지는 사후검정(Tukey HSD)으로 봅니다." },
        ] },
    ] },
  { id: "st-07", track: "stats", title: "상관과 회귀", summary: "공분산 · 상관계수와 그 함정, 최소제곱 회귀, R² · 잔차 진단 · 외삽", unit: 33, level: "실무",
    concepts: ["st.regression"],
    lessons: [
      { id: "st-07-1", title: "공분산과 상관계수", minutes: 25, concepts: ["st.regression"],
        quiz: [
          { kind: "ox", q: "상관계수가 0.95로 높으면 x가 y의 원인이다.", answer: false, explain: "상관은 함께 움직인다는 뜻일 뿐입니다. 숨은 공통 원인이 있을 수 있습니다." },
          { kind: "choice", q: "두 변수의 피어슨 상관계수가 0에 가깝다. 옳은 해석은?", options: ["두 변수는 아무 관계가 없다", "직선 관계는 거의 없지만, 곡선 관계는 있을 수 있다", "한 변수가 다른 변수의 원인이 아니다", "데이터에 이상치가 없다"], answer: 1, explain: "피어슨 r은 직선 관계만 잽니다. U자 관계는 r = 0이 나올 수 있으니 산점도를 그려 보세요." },
        ] },
      { id: "st-07-2", title: "단순선형회귀: 최소제곱으로 직선 긋기", minutes: 25, concepts: ["st.regression"],
        quiz: [
          { kind: "write", q: "stats.linregress로 x, y의 기울기를 출력하는 코드를 작성하세요.", given: "from scipy import stats\nx = [1, 2, 3, 4]\ny = [1, 3, 5, 7]", expect: ["2.0", "2"], must: ["linregress\\("], solution: "from scipy import stats\nx = [1, 2, 3, 4]\ny = [1, 3, 5, 7]\nprint(round(stats.linregress(x, y).slope, 6))", explain: "y = 2x − 1이므로 기울기는 2." },
          { kind: "choice", q: "지느러미 길이(mm)로 몸무게(g)를 예측한 기울기가 49.7이다. 옳은 해석은?", options: ["지느러미를 1mm 늘리면 몸무게가 49.7g 는다", "지느러미가 1mm 긴 펭귄은 평균적으로 몸무게가 약 49.7g 더 나간다", "몸무게의 49.7%를 지느러미가 설명한다", "지느러미가 0mm면 몸무게는 49.7g이다"], answer: 1, explain: "기울기는 관찰된 경향(평균적인 차이)을 단위와 함께 말합니다. 늘리면 는다는 인과 해석은 할 수 없습니다." },
        ] },
      { id: "st-07-3", title: "회귀 결과 읽기와 진단", minutes: 25, concepts: ["st.regression"],
        quiz: [
          { kind: "choice", q: "단순회귀의 R² = 0.76의 뜻은?", options: ["예측이 76% 확률로 맞는다", "y 흩어짐의 약 76%를 직선(x)이 설명한다", "기울기가 0.76이다", "데이터의 76%가 직선 위에 있다"], answer: 1, explain: "R² = 1 − 남은 흩어짐 ÷ 전체 흩어짐. y가 다양한 정도 중 x로 설명되는 비율입니다." },
          { kind: "ox", q: "잔차 그래프에 뚜렷한 U자 패턴이 보이면 직선 모델이 적절하다는 뜻이다.", answer: false, explain: "잔차에 패턴이 남았다면 직선이 데이터의 곡선 모양을 놓친 것입니다." },
        ] },
    ] },
  { id: "st-08", track: "stats", title: "A/B 테스트와 검정력", summary: "무작위 배정, 두 비율 비교와 차이의 신뢰구간, 표본 수 설계, 유의성 vs 중요성", unit: 34, level: "실무",
    concepts: ["st.abtest", "st.power"],
    lessons: [
      { id: "st-08-1", title: "A/B 테스트의 구조와 두 비율 비교", minutes: 25, concepts: ["st.abtest"],
        quiz: [
          { kind: "choice", q: "A/B 테스트에서 사용자를 무작위로 두 그룹에 나누는 가장 큰 이유는?", options: ["계산을 쉽게 하려고", "두 그룹의 크기를 똑같이 맞추려고", "바꾼 것 말고 다른 모든 차이를 두 그룹에 고르게 섞으려고", "p-value를 작게 만들려고"], answer: 2, explain: "무작위 배정은 우리가 재지 못한 특성까지 고르게 섞어서, 남은 차이를 바꾼 것 하나로 돌릴 수 있게 합니다." },
          { kind: "ox", q: "전환율이 4%에서 5%로 오른 것은 '1% 상승'이라고 써야 정확하다.", answer: false, explain: "절대 차이는 1%p(퍼센트포인트), 상대 차이는 25% 상승입니다." },
        ] },
      { id: "st-08-2", title: "표본 수 설계와 실무 판단", minutes: 25, concepts: ["st.abtest", "st.power"],
        quiz: [
          { kind: "choice", q: "검출하려는 차이를 절반으로 줄이면 필요한 표본 수는 대략?", options: ["절반", "2배", "4배", "같다"], answer: 2, explain: "n ∝ 1/δ²." },
          { kind: "ox", q: "검정력 80%는 실제 차이가 있을 때 10번 중 8번은 유의한 결과를 얻는다는 뜻이다.", answer: true, explain: "1 − β = 0.8." },
        ] },
    ] },
  { id: "st-10", track: "stats", title: "통계 해석 실수 피하기", summary: "상관과 인과, 교란변수, 심슨의 역설, 결과를 정직하게 보고하는 법", unit: 48, level: "실무",
    concepts: ["st.causal"],
    lessons: [
      { id: "st-10-1", title: "상관과 인과, 심슨의 역설", minutes: 25, concepts: ["st.causal"],
        quiz: [
          { kind: "choice", q: "\"수영장 입장객이 많은 날 에어컨 판매량도 많다\"는 상관을 가장 잘 설명하는 것은?", options: ["수영장이 에어컨 판매를 늘린다", "에어컨이 수영장 입장객을 늘린다", "더운 날씨가 둘 다를 늘린다(교란변수)", "순전히 우연이다"], answer: 2, explain: "숨은 공통 원인(더위)이 두 변수를 함께 움직이는 교란변수의 전형적인 예입니다." },
          { kind: "choice", q: "심슨의 역설이란?", options: ["표본이 작으면 p-value가 커지는 현상", "그룹별로 본 관계와 그룹을 합쳐 본 관계가 반대로 나오는 현상", "평균이 중앙값보다 커지는 현상", "검정을 여러 번 하면 헛경보가 쌓이는 현상"], answer: 1, explain: "펭귄 부리처럼 종 안에서는 +인데 합치면 −가 될 수 있습니다. 그룹이 교란변수 역할을 합니다." },
          { kind: "ox", q: "무작위 배정 실험을 하면 교란변수 문제를 크게 줄일 수 있다.", answer: true, explain: "무작위 배정은 재지 않은 변수까지 두 그룹에 고르게 섞어 줍니다." },
        ] },
      { id: "st-10-2", title: "통계 결과를 보고하는 법", minutes: 23, concepts: ["st.causal"],
        quiz: [
          { kind: "choice", q: "가장 좋은 보고 문장은?", options: ["p = 0.002로 유의함!", "저녁이 점심보다 많이 썼다.", "저녁(176건) 평균 20.80달러, 점심(68건) 17.17달러로 3.63달러 높았다(95% CI 1.33 ~ 5.93, p = 0.002).", "저녁 손님이 21% 더 부자다."], answer: 2, explain: "표본 수 · 요약값 · 효과 크기 · 신뢰구간 · p-value가 모두 들어간 문장입니다." },
          { kind: "ox", q: "p-value만 적으면 효과의 크기(차이)는 따로 적지 않아도 된다.", answer: false, explain: "p-value는 우연인지 아닌지만 말합니다. 차이의 크기와 신뢰구간을 함께 적어야 판단할 수 있습니다." },
        ] },
    ] },

  // ── 머신러닝 ─────────────────────────────────────────────
  { id: "ml-00", track: "ml", intro: true, title: "머신러닝 시작하기", summary: "기계가 배운다는 것, 학습과 예측, 회귀 · 분류 · 비지도", level: "입문",
    concepts: ["ml.intro"],
    lessons: [
    { id: "ml-00-1", title: "기계는 어떻게 배울까", minutes: 15, concepts: ["ml.intro"],
      quiz: [
        { kind: "ox", q: "생존 여부 기록(정답)이 하나도 없어도, 승객 정보만으로 생존 예측 모델을 학습시킬 수 있다.", answer: false, explain: "생존을 맞히는 지도 학습은 예전 정답 기록이 있어야 '무엇을 맞히는지' 배울 수 있습니다." },
      ] },
    { id: "ml-00-2", title: "어떤 문제를 풀 수 있을까", minutes: 12, concepts: ["ml.intro"],
      quiz: [
        { kind: "choice", q: "'내일 가게 매출액(원)을 예측하기'는 어떤 문제일까?", options: ["회귀", "분류", "군집", "차원 축소"], answer: 0, explain: "맞히려는 답이 연속된 숫자(매출액)이므로 회귀입니다." },
        { kind: "choice", q: "'정답 없이, 구매 행동이 비슷한 고객끼리 무리로 나누기'는 어떤 문제일까?", options: ["회귀", "분류", "군집 (비지도 학습)", "기준 모델"], answer: 2, explain: "정답(y)이 없고 비슷한 것끼리 묶으므로 비지도 학습의 군집입니다." },
      ] }] },
  { id: "ml-01", track: "ml", title: "ML 워크플로와 데이터 준비", summary: "특성과 정답, 결측치, 인코딩, train/test, stratify, 기준 모델, 누수", unit: 17, level: "입문",
    concepts: ["ml.workflow", "ml.missing", "ml.encoding"],
    lessons: [
    { id: "ml-01-1", title: "데이터를 표로 보기: 특성과 정답", minutes: 12, concepts: ["ml.workflow"],
      quiz: [
        { kind: "choice", q: "타이타닉에서 '생존 여부'를 예측하려고 한다. 정답(y)이 되는 열은?", options: ["pclass", "sex", "survived", "fare"], answer: 2, explain: "맞히고 싶은 값이 정답 y이고, 나머지 중 예측에 쓰는 열이 특성 X입니다." },
      ] },
    { id: "ml-01-2", title: "결측치: 비어 있는 칸 다루기", minutes: 15, concepts: ["ml.missing"],
      quiz: [
        { kind: "choice", q: "운임처럼 아주 비싼 표(튀는 값)가 몇 개 섞인 숫자 열의 빈칸은 무엇으로 채우는 게 보통 더 안전할까?", options: ["평균", "중앙값", "최빈값", "0"], answer: 1, explain: "평균은 튀는 값에 끌려가지만 중앙값은 가운데 값이라 거의 흔들리지 않습니다." },
        { kind: "choice", q: "deck(갑판) 열은 77%가 비어 있다. 가장 알맞은 처리는?", options: ["빈칸이 있는 행을 모두 지운다", "열을 통째로 뺀다", "평균으로 채운다", "그대로 모델에 넣는다"], answer: 1, explain: "행을 지우면 891명 중 182명만 남습니다. 대부분이 빈 열은 열째 빼는 편이 낫습니다." },
      ] },
    { id: "ml-01-3", title: "인코딩: 글자를 숫자로", minutes: 15, concepts: ["ml.encoding"],
      quiz: [
        { kind: "choice", q: "혈액형(A, B, O, AB)처럼 순서가 없는 범주 열은 어떻게 숫자로 바꾸는 게 좋을까?", options: ["A=0, B=1, O=2, AB=3 번호 매기기", "원-핫 인코딩", "평균으로 바꾸기", "열을 지운다"], answer: 1, explain: "순서 없는 범주에 번호를 매기면 'AB는 A의 3배' 같은 가짜 크기가 생깁니다. 종류마다 0/1 열을 만드는 원-핫이 맞습니다." },
        { kind: "ox", q: "제품 등급 L < M < H처럼 순서가 있는 범주는 순서대로 0, 1, 2 번호를 매겨도 자연스럽다.", answer: true, explain: "진짜 순서가 있으면 번호의 크기 관계가 현실과 맞습니다. 이것이 순서 인코딩입니다." },
      ] },
    { id: "ml-01-4", title: "학습용과 시험용 나누기", minutes: 15, concepts: ["ml.workflow"],
      quiz: [
        { kind: "choice", q: "train_test_split에서 클래스 비율을 유지하는 인자는?", options: ["shuffle", "stratify", "random_state", "test_size"], answer: 1, explain: "stratify=y." },
      ] },
    { id: "ml-01-5", title: "기준 모델과 누수", minutes: 15, concepts: ["ml.workflow"],
      quiz: [
        { kind: "ox", q: "스케일러는 전체 데이터로 fit 한 뒤 나누는 것이 정석이다.", answer: false, explain: "분할 후 학습 데이터로만 fit 해야 누수가 없습니다." },
        { kind: "choice", q: "타이타닉 생존(survived) 예측 모델의 특성으로 넣으면 안 되는 열은?", options: ["pclass (객실 등급)", "age (나이)", "alive (생존 여부 yes/no)", "fare (운임)"], answer: 2, explain: "alive는 정답을 다른 말로 쓴 열이라 넣으면 정답을 그대로 읽는 누수가 됩니다." },
      ] }] },
  { id: "ml-02", track: "ml", title: "선형 · 로지스틱 회귀", summary: "직선 예측, MAE · RMSE · R², 경사하강법, 다중 회귀, 확률 출력", unit: 18, level: "기본",
    concepts: ["ml.linear", "ml.gd"],
    lessons: [
    { id: "ml-02-1", title: "선형회귀: 직선 하나로 예측하기", minutes: 12, concepts: ["ml.linear"],
      quiz: [
        { kind: "choice", q: "LinearRegression에서 기울기가 들어 있는 속성은?", options: ["model.slope", "model.coef_", "model.weight", "model.intercept_"], answer: 1, explain: "coef_는 피처별 기울기 배열, intercept_는 절편입니다." },
      ] },
    { id: "ml-02-2", title: "오차 재기: MAE · RMSE · R²", minutes: 12, concepts: ["ml.linear"],
      quiz: [
        { kind: "choice", q: "어떤 회귀 모델의 R²가 0이 나왔다. 무슨 뜻일까?", options: ["완벽하게 맞혔다", "항상 평균값만 말하는 것과 같은 수준이다", "오차가 0이다", "모델이 음수를 예측했다"], answer: 1, explain: "R² = 1 − (모델 오차 제곱합 / 평균만 찍을 때 오차 제곱합). 0이면 평균만 찍은 것과 같고, 음수면 그보다 못합니다." },
      ] },
    { id: "ml-02-3", title: "모델은 어떻게 직선을 찾을까: 경사하강법", minutes: 15, concepts: ["ml.gd"],
      quiz: [
        { kind: "ox", q: "경사하강법에서 학습률(보폭)을 너무 크게 하면 오차가 줄지 않고 오히려 커질 수 있다.", answer: true, explain: "보폭이 너무 크면 골짜기를 건너뛰어 반대편으로 더 높이 올라가기를 반복합니다(발산). 학습률 1.1에서 확인했습니다." },
      ] },
    { id: "ml-02-4", title: "특성을 여러 개 쓰면", minutes: 10, concepts: ["ml.linear"],
      quiz: [
      ] },
    { id: "ml-02-5", title: "로지스틱 회귀: 확률로 분류하기", minutes: 15, concepts: ["ml.linear"],
      quiz: [
        { kind: "ox", q: "LogisticRegression의 predict는 확률이 0.5 이상이면 1로 판정한다.", answer: true, explain: "이진 분류의 기본 임계값은 0.5입니다." },
      ] }] },
  { id: "ml-03", track: "ml", title: "평가지표", summary: "혼동행렬, precision · recall · F1, 임계값, ROC-AUC · PR-AUC", unit: 19, level: "기본",
    concepts: ["ml.metrics"],
    lessons: [
    { id: "ml-03-1", title: "혼동행렬: 맞힘과 틀림을 네 칸으로", minutes: 12, concepts: ["ml.metrics"],
      quiz: [
        { kind: "choice", q: "화재경보기가 불이 났는데 울리지 않았다. 혼동행렬의 어느 칸일까?", options: ["TP", "FP", "FN", "TN"], answer: 2, explain: "'아니다(N)'라고 했는데 틀렸으니(F) FN, 놓침입니다." },
      ] },
    { id: "ml-03-2", title: "정밀도, 재현율, F1", minutes: 15, concepts: ["ml.metrics"],
      quiz: [
        { kind: "short", q: "TP=6, FN=2일 때 재현율은? (소수)", answer: ["0.75", ".75"], explain: "6 / (6 + 2) = 0.75." },
        { kind: "choice", q: "암 검진의 1차 선별 검사에서 가장 중요하게 봐야 할 지표는?", options: ["정확도", "정밀도", "재현율", "R²"], answer: 2, explain: "1차 선별에서 환자를 놓치면(FN) 치명적입니다. 헛경보는 2차 정밀 검사에서 걸러낼 수 있습니다." },
      ] },
    { id: "ml-03-3", title: "임계값: 경보 감도 조절", minutes: 12, concepts: ["ml.metrics"],
      quiz: [
        { kind: "choice", q: "임계값을 낮추면 보통 어떻게 되나?", options: ["recall↓ precision↑", "recall↑ precision↓", "둘 다 ↑", "변화 없음"], answer: 1, explain: "더 많이 1로 판정해 놓침은 줄고 오탐은 늘어납니다." },
      ] },
    { id: "ml-03-4", title: "ROC 곡선과 AUC", minutes: 12, concepts: ["ml.metrics"],
      quiz: [
      ] }] },
  { id: "ml-04", track: "ml", title: "트리와 앙상블", summary: "결정트리, 지니 불순도, 과적합 · 과소적합, 랜덤포레스트, 부스팅, 피처 중요도", unit: 20, level: "기본",
    concepts: ["ml.tree", "ml.overfit"],
    lessons: [
    { id: "ml-04-1", title: "결정트리: 스무고개로 예측하기", minutes: 15, concepts: ["ml.tree"],
      quiz: [
        { kind: "choice", q: "결정트리가 첫 질문을 고르는 기준은?", options: ["열 이름의 알파벳 순서", "나눈 뒤 그룹들이 가장 덜 섞이는(불순도가 가장 낮아지는) 질문", "값의 종류가 가장 많은 열", "사람이 정해 준 순서"], answer: 1, explain: "후보 질문마다 나눈 뒤 지니 불순도를 계산해 가장 많이 줄어드는 질문을 고릅니다. 타이타닉에서는 성별이었습니다." },
      ] },
    { id: "ml-04-2", title: "깊어질수록 외운다: 과적합과 과소적합", minutes: 15, concepts: ["ml.overfit"],
      quiz: [
      ] },
    { id: "ml-04-3", title: "랜덤포레스트: 여러 트리의 투표", minutes: 12, concepts: ["ml.tree"],
      quiz: [
      ] },
    { id: "ml-04-4", title: "부스팅과 피처 중요도", minutes: 12, concepts: ["ml.tree"],
      quiz: [
        { kind: "choice", q: "앞 트리들이 틀린 부분을 고치도록 트리를 하나씩 차례로 쌓는 방법은?", options: ["랜덤포레스트(배깅)", "부스팅", "교차검증", "PCA"], answer: 1, explain: "배깅은 독립된 트리들의 다수결, 부스팅은 앞 트리의 실수를 차례로 보완합니다." },
      ] }] },
  { id: "ml-05", track: "ml", title: "교차검증과 하이퍼파라미터", summary: "K-fold, GridSearchCV, 검증 곡선 · 학습 곡선", unit: 35, level: "기본",
    concepts: ["ml.cv", "ml.overfit"],
    lessons: [
    { id: "ml-05-1", title: "K-fold 교차검증: 돌아가며 시험 보기", minutes: 15, concepts: ["ml.cv"],
      quiz: [
        { kind: "write", q: "cross_val_score로 5-fold 점수를 구한 뒤 점수 개수를 출력하는 코드를 작성하세요.", given: "import numpy as np\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.tree import DecisionTreeClassifier\nX = np.arange(40).reshape(20, 2)\ny = np.array([0, 1] * 10)", expect: "5", must: ["cross_val_score\\("], solution: "import numpy as np\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.tree import DecisionTreeClassifier\nX = np.arange(40).reshape(20, 2)\ny = np.array([0, 1] * 10)\nprint(len(cross_val_score(DecisionTreeClassifier(random_state=0), X, y, cv=5)))", explain: "cv=5면 점수 5개가 나옵니다." },
      ] },
    { id: "ml-05-2", title: "하이퍼파라미터와 GridSearchCV", minutes: 15, concepts: ["ml.cv"],
      quiz: [
        { kind: "ox", q: "GridSearchCV로 고른 모델은 테스트 데이터로 마지막에 한 번만 평가한다.", answer: true, explain: "테스트를 여러 번 보면 그 점수도 낙관적으로 부풀려집니다." },
      ] },
    { id: "ml-05-3", title: "검증 곡선: 설정값에 따라 점수가 어떻게 변하나", minutes: 15, concepts: ["ml.cv", "ml.overfit"],
      quiz: [
        { kind: "choice", q: "검증 곡선에서 학습 점수와 검증 점수가 둘 다 낮고 서로 붙어 있다. 어떤 상태일까?", options: ["과적합", "과소적합", "누수", "딱 좋음"], answer: 1, explain: "둘 다 낮으면 데이터의 패턴도 다 배우지 못한 과소적합입니다. 학습 점수만 높고 간격이 크게 벌어지면 과적합입니다." },
      ] }] },
  { id: "ml-06", track: "ml", title: "피처 엔지니어링과 Pipeline", summary: "SimpleImputer · OneHotEncoder, 표준화 · 정규화, 새 특성, ColumnTransformer · Pipeline", unit: 36, level: "실무",
    concepts: ["ml.feature"],
    lessons: [
    { id: "ml-06-1", title: "도구로 빈칸 채우고 글자 바꾸기", minutes: 15, concepts: ["ml.feature", "ml.missing", "ml.encoding"],
      quiz: [
      ] },
    { id: "ml-06-2", title: "숫자 크기 맞추기: 표준화와 정규화", minutes: 12, concepts: ["ml.feature"],
      quiz: [
        { kind: "ox", q: "랜덤포레스트 같은 트리 모델은 표준화를 하지 않아도 결과가 거의 같다.", answer: true, explain: "트리는 '기준값보다 큰가?'만 묻기 때문에 숫자의 단위가 바뀌어도 나누는 방식이 같습니다. 거리를 재는 KNN·K-means·SVM은 꼭 필요합니다." },
      ] },
    { id: "ml-06-3", title: "새 특성 만들기: 피처 엔지니어링", minutes: 12, concepts: ["ml.feature"],
      quiz: [
      ] },
    { id: "ml-06-4", title: "Pipeline: 손질부터 모델까지 한 줄로", minutes: 12, concepts: ["ml.feature"],
      quiz: [
      ] }] },
  { id: "ml-07", track: "ml", title: "비지도 학습", summary: "K-means 군집, 엘보 · 실루엣, PCA", unit: 37, level: "실무",
    concepts: ["ml.kmeans", "ml.pca"],
    lessons: [
    { id: "ml-07-1", title: "K-means: 정답 없이 묶기", minutes: 15, concepts: ["ml.kmeans"],
      quiz: [
        { kind: "ox", q: "회전수(1,000 단위)와 토크(10 단위)를 표준화하지 않고 K-means를 돌리면 거리가 거의 회전수로만 정해진다.", answer: true, explain: "K-means는 거리로 묶기 때문에 숫자가 큰 열이 거리를 독차지합니다. 그래서 표준화가 먼저입니다." },
        { kind: "ox", q: "K-means는 데이터에 뚜렷한 그룹이 없으면 그룹을 나누지 않는다.", answer: false, explain: "k를 주면 그룹이 없어도 무조건 k개로 나눕니다. 그룹이 의미 있는지는 사람이 확인해야 합니다." },
      ] },
    { id: "ml-07-2", title: "k는 몇 개로 할까: 엘보와 실루엣", minutes: 10, concepts: ["ml.kmeans"],
      quiz: [
        { kind: "choice", q: "K-means에서 k를 늘리면 inertia(점과 중심 사이 거리 제곱합)는 어떻게 될까?", options: ["거의 항상 줄어든다", "항상 늘어난다", "변하지 않는다", "0이 된다"], answer: 0, explain: "중심이 많아질수록 점이 더 가까운 중심을 찾으니 inertia는 계속 줄어듭니다. 그래서 값 자체보다 줄어드는 폭이 꺾이는 지점(엘보)을 봅니다." },
      ] },
    { id: "ml-07-3", title: "PCA: 여러 열을 몇 개로 요약하기", minutes: 15, concepts: ["ml.pca"],
      quiz: [
        { kind: "ox", q: "PCA의 첫 번째 주성분은 데이터의 분산이 가장 큰 방향이다.", answer: true, explain: "두 번째는 첫 번째와 직교하면서 남은 분산이 가장 큰 방향입니다." },
      ] }] },
  { id: "ml-08", track: "ml", title: "불균형 데이터", summary: "정확도의 함정, class_weight, 임계값과 비용, 오버샘플링", unit: 38, level: "실무",
    concepts: ["ml.imbalance"],
    lessons: [
    { id: "ml-08-1", title: "고장은 드물다: 불균형과 정확도의 함정", minutes: 12, concepts: ["ml.imbalance"],
      quiz: [
        { kind: "ox", q: "고장이 3%인 데이터에서 '전부 정상'이라고만 답해도 정확도는 약 97%가 나온다.", answer: true, explain: "정확도는 높지만 고장은 하나도 못 잡습니다(재현율 0). 불균형 데이터에서는 재현율·정밀도·F1을 봅니다." },
      ] },
    { id: "ml-08-2", title: "드문 쪽을 더 혼내기: class_weight", minutes: 12, concepts: ["ml.imbalance"],
      quiz: [
      ] },
    { id: "ml-08-3", title: "판정 기준선 내리기: 임계값과 비용", minutes: 15, concepts: ["ml.imbalance"],
      quiz: [
        { kind: "choice", q: "고장 1건을 놓치면 100만 원, 헛경보 1건은 1만 원이 든다. 판정 기준선(임계값)은 0.5에서 어떻게 바꾸는 게 맞을까?", options: ["더 낮춘다", "더 높인다", "0.5 그대로 둔다", "기준선은 비용과 상관없다"], answer: 0, explain: "놓침이 훨씬 비싸므로 기준선을 낮춰 헛경보가 늘더라도 놓침을 줄이는 쪽이 총비용이 적습니다." },
      ] },
    { id: "ml-08-4", title: "드문 쪽 데이터 늘리기: 오버샘플링", minutes: 12, concepts: ["ml.imbalance"],
      quiz: [
        { kind: "ox", q: "오버샘플링은 train/test로 나누기 전에 전체 데이터에 해야 한다.", answer: false, explain: "나누기 전에 복사하면 같은 행의 복사본이 시험용에도 들어가 점수가 부풀려집니다. 반드시 나눈 뒤 학습용에만 합니다." },
      ] }] },
  { id: "ml-09", track: "ml", title: "모델 해석", summary: "피처 중요도, 순열 중요도, 표준화 계수, 부분 의존도", unit: 39, level: "실무",
    concepts: ["ml.explain"],
    lessons: [
    { id: "ml-09-1", title: "무엇을 많이 봤나: 피처 중요도와 순열 중요도", minutes: 15, concepts: ["ml.explain"],
      quiz: [
        { kind: "choice", q: "테스트 데이터에서 열을 섞어 점수 하락으로 중요도를 재는 방법은?", options: ["feature_importances_", "permutation_importance", "coef_", "PCA"], answer: 1, explain: "sklearn.inspection.permutation_importance." },
        { kind: "ox", q: "상관이 높은 두 변수는 중요도를 서로 나눠 가져 각각 낮게 보일 수 있다.", answer: true, explain: "한 열을 섞어도 다른 열이 정보를 대신하기 때문입니다." },
      ] },
    { id: "ml-09-2", title: "어느 방향으로, 어떤 모양으로: 계수와 부분 의존도", minutes: 15, concepts: ["ml.explain"],
      quiz: [
        { kind: "ox", q: "부분 의존도에서 토크가 60을 넘을 때 고장 확률이 급히 오르면, 토크를 낮추면 반드시 고장이 줄어든다고 결론 내릴 수 있다.", answer: false, explain: "부분 의존도는 모델이 배운 관계(상관)를 보여 줄 뿐 인과를 증명하지 않습니다. 실제 조치는 현장 지식과 실험으로 확인합니다." },
      ] }] },
  { id: "ml-10", track: "ml", title: "다른 모델 둘러보기", summary: "KNN, 나이브 베이즈와 라플라스 스무딩, SVM과 커널, 모델 고르기", level: "실무",
    concepts: ["ml.knn", "ml.nb", "ml.svm"],
    lessons: [
    { id: "ml-10-1", title: "KNN: 가까운 이웃에게 묻기", minutes: 15, concepts: ["ml.knn"],
      quiz: [
        { kind: "ox", q: "KNN은 거리로 이웃을 고르므로, 운임(0~512)과 성별(0/1)을 표준화 없이 넣으면 운임이 거리를 거의 독차지한다.", answer: true, explain: "표준화 없이 0.698, 표준화 후 0.793이었습니다. 거리를 재는 모델은 스케일링이 꼭 필요합니다." },
      ] },
    { id: "ml-10-2", title: "나이브 베이즈: 확률을 곱해서 분류하기", minutes: 15, concepts: ["ml.nb"],
      quiz: [
        { kind: "choice", q: "나이브 베이즈에서 한 번도 나오지 않은 단어 때문에 확률 곱 전체가 0이 되는 것을 막는 방법은?", options: ["표준화", "라플라스 스무딩(개수에 1 더하기)", "원-핫 인코딩", "임계값 낮추기"], answer: 1, explain: "모든 개수에 1을 더해 '한 번도 안 나왔다 = 절대 안 나온다'로 단정하지 않게 합니다." },
      ] },
    { id: "ml-10-3", title: "SVM: 가장 넓은 길 찾기, 그리고 모델 고르기", minutes: 15, concepts: ["ml.svm"],
      quiz: [
        { kind: "choice", q: "새 표 데이터 분류 문제를 받았다. 이 트랙에서 정리한 순서대로라면 가장 먼저 할 일은?", options: ["부스팅 설정값을 GridSearch로 튜닝한다", "기준 모델(찍기) 점수를 확인한다", "SVM 커널을 바꿔 본다", "딥러닝 모델을 만든다"], answer: 1, explain: "기준 모델로 최소선을 확인하고 → 로지스틱 회귀 → 트리 앙상블 순서로 시도합니다." },
      ] }] },

  // ── 딥러닝 (개념 학습, 실습 없음) ───────────────────────────
  { id: "dl-01", track: "dl", title: "퍼셉트론과 활성화 함수", summary: "뉴런, 가중치, 시그모이드 · ReLU", unit: 40, level: "입문",
    concepts: ["dl.perceptron"],
    lessons: [{ id: "dl-01-1", title: "뉴런 하나가 하는 일", minutes: 12, concepts: ["dl.perceptron"],
      quiz: [
        { kind: "short", q: "ReLU(−3)의 값은?", answer: ["0"], explain: "max(0, −3) = 0." },
        { kind: "ox", q: "시그모이드 출력은 항상 0과 1 사이다.", answer: true, explain: "1/(1 + e^(−z))는 0과 1 사이 값입니다." },
      ] }] },
  { id: "dl-02", track: "dl", title: "손실함수와 경사하강법", summary: "MSE · 교차엔트로피, 학습률", unit: 41, level: "입문",
    concepts: ["dl.loss"],
    lessons: [{ id: "dl-02-1", title: "틀린 정도를 재고, 내리막으로 걷기", minutes: 15, concepts: ["dl.loss"],
      quiz: [
        { kind: "choice", q: "경사하강법의 업데이트 식은?", options: ["w ← w + η·∂L/∂w", "w ← w − η·∂L/∂w", "w ← η·w", "w ← w / η"], answer: 1, explain: "기울기 반대 방향으로 학습률만큼 움직입니다." },
        { kind: "ox", q: "학습률이 너무 작으면 수렴은 하지만 아주 느리다.", answer: true, explain: "그래서 학습률 스케줄러로 처음에 크게, 나중에 작게 조정하기도 합니다." },
      ] }] },
  { id: "dl-03", track: "dl", title: "순전파와 역전파", summary: "계산 그래프, 연쇄법칙", unit: 42, level: "기본",
    concepts: ["dl.backprop"],
    lessons: [{ id: "dl-03-1", title: "기울기는 뒤에서 앞으로 흐른다", minutes: 15, concepts: ["dl.backprop"],
      quiz: [
        { kind: "choice", q: "곱셈 노드 z = x · y에서 ∂z/∂x는?", options: ["1", "x", "y", "x + y"], answer: 2, explain: "곱셈 노드는 상대편 입력값을 곱해 기울기를 전달합니다." },
        { kind: "ox", q: "역전파는 출력층에서 입력층 방향으로 계산한다.", answer: true, explain: "손실에서 시작해 연쇄법칙으로 거꾸로 갑니다." },
      ] }] },
  { id: "dl-04", track: "dl", title: "MLP 학습과 과적합", summary: "에폭, 배치, 드롭아웃, 조기 종료", unit: 43, level: "기본",
    concepts: ["dl.mlp"],
    lessons: [{ id: "dl-04-1", title: "층을 쌓고, 과적합을 막기", minutes: 15, concepts: ["dl.mlp"],
      quiz: [
        { kind: "short", q: "데이터 600개, 배치 크기 100일 때 1에폭의 업데이트 횟수는?", answer: ["6"], explain: "600 / 100 = 6번." },
        { kind: "ox", q: "검증 손실이 오르기 시작한 시점에 학습을 멈추는 것을 조기 종료라고 한다.", answer: true, explain: "가장 좋았던 검증 손실의 가중치를 저장해 둡니다." },
      ] }] },
  { id: "dl-05", track: "dl", title: "CNN", summary: "합성곱, 패딩 · 스트라이드, 풀링", unit: 44, level: "기본",
    concepts: ["dl.cnn"],
    lessons: [{ id: "dl-05-1", title: "이미지를 훑는 작은 필터", minutes: 15, concepts: ["dl.cnn"],
      quiz: [
        { kind: "short", q: "입력 32, 필터 5, 패딩 0, 스트라이드 1이면 출력 크기는?", answer: ["28"], explain: "(32 − 5) / 1 + 1 = 28." },
        { kind: "choice", q: "2×2 최대 풀링(스트라이드 2)을 하면 가로 · 세로 크기는?", options: ["그대로", "절반", "2배", "1/4"], answer: 1, explain: "가로 · 세로가 각각 절반, 면적은 1/4이 됩니다." },
      ] }] },
  { id: "dl-06", track: "dl", title: "RNN과 시퀀스", summary: "은닉 상태, 기울기 소실, LSTM", unit: 45, level: "실무",
    concepts: ["dl.rnn"],
    lessons: [{ id: "dl-06-1", title: "순서를 기억하는 네트워크", minutes: 15, concepts: ["dl.rnn"],
      quiz: [
        { kind: "choice", q: "RNN에서 이전 시점의 정보를 다음 시점으로 넘기는 것은?", options: ["가중치 감쇠", "은닉 상태", "풀링", "임베딩"], answer: 1, explain: "h_t가 지금까지의 요약을 들고 다음 시점으로 갑니다." },
        { kind: "ox", q: "LSTM은 게이트를 써서 기울기 소실 문제를 줄인다.", answer: true, explain: "셀 상태를 따라 정보가 덧셈으로 흐르므로 기울기가 덜 사라집니다." },
      ] }] },
  { id: "dl-07", track: "dl", title: "임베딩과 어텐션", summary: "Q · K · V, 스케일드 닷프로덕트, Transformer", unit: 46, level: "실무",
    concepts: ["dl.attention"],
    lessons: [{ id: "dl-07-1", title: "어디를 볼지 스스로 정하기", minutes: 18, concepts: ["dl.attention"],
      quiz: [
        { kind: "choice", q: "어텐션 가중치를 만들 때 Q와 K의 유사도에 적용하는 함수는?", options: ["ReLU", "softmax", "tanh", "max"], answer: 1, explain: "softmax로 0~1, 합 1인 가중치를 만듭니다." },
        { kind: "ox", q: "셀프 어텐션에서 Q, K, V는 같은 입력에서 각각 다른 가중치 행렬로 만든다.", answer: true, explain: "같은 문장의 토큰들이 서로를 참고합니다." },
      ] }] },
];

export const LESSONS = COURSES.flatMap((c) => c.lessons.map((l) => ({ ...l, course: c.id, track: c.track, dir: c.dir || c.track })));
export const courseById = Object.fromEntries(COURSES.map((c) => [c.id, c]));
export const lessonById = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
export const trackById = Object.fromEntries(TRACKS.map((t) => [t.id, t]));
export const coursesOf = (trackId) => COURSES.filter((c) => c.track === trackId);
export const courseOfUnit = (unitId) => COURSES.find((c) => c.unit === unitId);
// dir: 레슨 md 폴더. 트랙을 옮긴 코스(da-09~da-11 → python-viz)는 파일을 원래 폴더에 둔다.
export const lessonPath = (l) => `content/${l.dir || l.track}/${l.id}.md`;
