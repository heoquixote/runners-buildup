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
  { id: "sql", label: "SQL", en: "SQL", color: "lime", ready: false,
    blurb: "SELECT부터 윈도우 함수까지. 브라우저 안의 SQLite로 바로 실행합니다." },
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

  // ── 데이터 분석 (NumPy · pandas) ──────────────────────────
  { id: "da-01", track: "python-da", title: "NumPy 배열과 연산", summary: "배열 연산, 통계량, 불리언 인덱싱, axis, 이상치", unit: 10, level: "기본",
    concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
    lessons: [{ id: "da-01-1", title: "반복문 없이 배열을 한 번에 계산하기", minutes: 15, concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
      quiz: [
        { kind: "write", q: "반복문 없이 a의 모든 원소에 2를 곱한 배열을 출력하는 코드를 작성하세요.", given: "import numpy as np\na = np.array([1, 2, 3])", expect: ["[2 4 6]"], must: ["a\\s*\\*\\s*2|2\\s*\\*\\s*a"], solution: "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)", explain: "배열에 숫자를 곱하면 모든 원소에 적용됩니다. 리스트의 [1,2,3]*2와 다릅니다." },
        { kind: "choice", q: "2차원 배열에서 열(세로) 방향으로 합을 구해 열마다 값 하나씩 얻으려면?", options: ["arr.sum()", "arr.sum(axis=0)", "arr.sum(axis=1)", "arr.sum(axis=2)"], answer: 1, explain: "axis=0은 행을 따라 접어 열별 결과를 남깁니다." },
      ] }] },
  { id: "da-02", track: "python-da", title: "인덱싱과 브로드캐스팅", summary: "2차원 인덱싱, 형상(shape), 브로드캐스팅 규칙", unit: 23, level: "기본",
    concepts: ["np.broadcast", "np.axis"],
    lessons: [{ id: "da-02-1", title: "모양이 다른 배열끼리 계산하는 규칙", minutes: 15, concepts: ["np.broadcast", "np.axis"],
      quiz: [
        { kind: "write", q: "a에서 첫 행의 마지막 두 값을 리스트로 출력하는 코드를 작성하세요.", given: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])", expect: "[2, 3]", must: ["a\\[\\s*0\\s*,\\s*1\\s*:\\s*\\]"], solution: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(a[0, 1:].tolist())", explain: "a[0, 1:]은 0번 행의 1번 열부터 끝까지입니다." },
        { kind: "choice", q: "(4, 3) 배열에서 (3,) 배열을 빼면 어떻게 계산될까?", options: ["행마다 같은 3개 값을 뺀다", "열마다 같은 4개 값을 뺀다", "에러가 난다", "첫 행만 계산된다"], answer: 0, explain: "뒤 차원 3이 같으므로 (3,)이 4행으로 늘어나 각 행에서 빠집니다." },
      ] }] },
  { id: "da-03", track: "python-da", title: "pandas Series · DataFrame", summary: "read_csv, head, shape, describe, value_counts", unit: 24, level: "기본",
    concepts: ["pd.dataframe"],
    lessons: [{ id: "da-03-1", title: "표 데이터를 불러와 첫인상 잡기", minutes: 15, concepts: ["pd.dataframe"],
      quiz: [
        { kind: "write", q: "df의 qty 열 합계를 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "2110", must: ["\\[\\s*['\"]qty['\"]\\s*\\]"], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df['qty'].sum())", explain: "df['qty']는 Series이고 sum()으로 합계를 냅니다." },
        { kind: "ox", q: "df.head()는 기본으로 처음 5행을 보여 준다.", answer: true, explain: "개수를 바꾸려면 head(10)처럼 숫자를 넣습니다." },
      ] }] },
  { id: "da-04", track: "python-da", title: "선택과 필터", summary: "loc, iloc, 조건 필터, isin, query", unit: 25, level: "기본",
    concepts: ["pd.select"],
    lessons: [{ id: "da-04-1", title: "원하는 행과 열만 골라내기", minutes: 15, concepts: ["pd.select"],
      quiz: [
        { kind: "write", q: "df에서 line이 'A'인 행의 qty를 리스트로 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "[500, 520]", must: ["==\\s*['\"]A['\"]"], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df.loc[df['line'] == 'A', 'qty'].tolist())", explain: "df.loc[조건, '열'].tolist()" },
        { kind: "choice", q: "iloc[0:2]가 선택하는 행은?", options: ["0, 1번", "0, 1, 2번", "1, 2번", "라벨이 0~2인 행"], answer: 0, explain: "iloc 슬라이싱은 파이썬 리스트처럼 끝 번호를 포함하지 않습니다." },
      ] }] },
  { id: "da-05", track: "python-da", title: "결측치와 전처리", summary: "isna, fillna, dropna, 형변환, str 메서드, apply", unit: 26, level: "기본",
    concepts: ["pd.missing"],
    lessons: [{ id: "da-05-1", title: "빈칸과 지저분한 값 정리하기", minutes: 15, concepts: ["pd.missing"],
      quiz: [
        { kind: "write", q: "s의 결측값을 0으로 채운 뒤 합계를 출력하는 코드를 작성하세요.", given: "import numpy as np\nimport pandas as pd\ns = pd.Series([4.0, np.nan, 5.0])", expect: "9.0", must: ["fillna\\("], solution: "import numpy as np\nimport pandas as pd\ns = pd.Series([4.0, np.nan, 5.0])\nprint(s.fillna(0).sum())", explain: "fillna(0)로 채운 뒤 sum()" },
        { kind: "ox", q: "pd.Series(['1,200']).astype(int)는 바로 정수로 바뀐다.", answer: false, explain: "쉼표가 있어 ValueError가 납니다. str.replace(',', '')로 먼저 지우세요." },
      ] }] },
  { id: "da-06", track: "python-da", title: "groupby와 pivot_table", summary: "split-apply-combine, agg, transform, pivot_table", unit: 27, level: "실무",
    concepts: ["pd.groupby", "pd.pivot"],
    lessons: [{ id: "da-06-1", title: "나누고, 집계하고, 합치기", minutes: 18, concepts: ["pd.groupby", "pd.pivot"],
      quiz: [
        { kind: "write", q: "groupby로 line별 qty 합계를 딕셔너리로 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "{'A': 1020, 'B': 480, 'C': 610}", must: ["groupby\\("], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df.groupby('line')['qty'].sum().to_dict())", explain: "groupby('line')['qty'].sum()" },
        { kind: "choice", q: "groupby 결과를 원래 행 수 그대로 돌려줘 비중 계산에 쓰는 메서드는?", options: ["agg", "transform", "apply", "pivot"], answer: 1, explain: "transform은 그룹 집계값을 각 행에 붙여 줍니다." },
      ] }] },
  { id: "da-07", track: "python-da", title: "merge와 concat", summary: "키 결합, how, 행 증가 함정, 위아래 붙이기", unit: 28, level: "실무",
    concepts: ["pd.merge"],
    lessons: [{ id: "da-07-1", title: "두 표를 키로 잇고 위아래로 붙이기", minutes: 15, concepts: ["pd.merge"],
      quiz: [
        { kind: "write", q: "a와 b를 key로 left 결합한 결과의 행 수를 출력하는 코드를 작성하세요.", given: "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3]})\nb = pd.DataFrame({'key': [2, 3, 4], 'v': ['x', 'y', 'z']})", expect: "3", must: ["how\\s*=\\s*['\"]left['\"]"], solution: "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3]})\nb = pd.DataFrame({'key': [2, 3, 4], 'v': ['x', 'y', 'z']})\nprint(len(pd.merge(a, b, on='key', how='left')))", explain: "left는 왼쪽 행 3개를 모두 남깁니다." },
        { kind: "ox", q: "merge 후 행 수가 늘었다면 오른쪽 표에 키 중복이 있는지 먼저 의심해야 한다.", answer: true, explain: "1:N, N:M 결합에서는 행이 복제됩니다." },
      ] }] },
  { id: "da-08", track: "python-da", title: "시계열", summary: "to_datetime, dt, resample, rolling, shift", unit: 29, level: "실무",
    concepts: ["pd.time"],
    lessons: [{ id: "da-08-1", title: "시간 순서가 있는 데이터 다루기", minutes: 18, concepts: ["pd.time"],
      quiz: [
        { kind: "write", q: "pd.to_datetime으로 '2026-11-04 21:30'의 시(hour)를 출력하는 코드를 작성하세요.", expect: "21", must: ["to_datetime\\("], solution: "import pandas as pd\nprint(pd.to_datetime('2026-11-04 21:30').hour)", explain: "Timestamp의 .hour" },
        { kind: "choice", q: "1시간 단위 데이터를 하루 평균으로 바꾸는 코드는?", options: ["s.rolling(24).mean()", "s.resample('D').mean()", "s.shift(24)", "s.groupby(24).mean()"], answer: 1, explain: "resample('D')는 날짜 단위로 묶습니다." },
      ] }] },
  // ── 데이터 시각화 (matplotlib · seaborn) ─ 코스 id · 레슨 파일 위치는 그대로 ──
  { id: "da-09", track: "python-viz", dir: "python-da", title: "matplotlib 기본", summary: "fig/ax, 선 · 막대 · 산점도, 축과 제목, 서브플롯", unit: 30, level: "기본",
    concepts: ["mpl.basic"],
    lessons: [{ id: "da-09-1", title: "fig와 ax로 그래프 그리기", minutes: 15, concepts: ["mpl.basic"],
      quiz: [
        { kind: "write", q: "fig, ax를 만들고 ax.plot으로 [1, 4, 9]를 그린 뒤, 그려진 선의 개수를 출력하는 코드를 작성하세요.", given: "import matplotlib.pyplot as plt", expect: "1", must: ["\\.plot\\("], solution: "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.plot([1, 4, 9])\nprint(len(ax.lines))", explain: "ax.plot을 한 번 부르면 ax.lines에 선 하나가 생깁니다." },
        { kind: "choice", q: "시간에 따른 매출 변화를 보여 줄 때 가장 알맞은 그래프는?", options: ["선 그래프", "원 그래프", "산점도", "히스토그램"], answer: 0, explain: "추이는 선, 범주 비교는 막대, 관계는 산점도입니다." },
      ] }] },
  { id: "da-10", track: "python-viz", dir: "python-da", title: "seaborn 통계 시각화", summary: "분포, 범주 비교, 관계, 상관 히트맵", unit: 31, level: "실무",
    concepts: ["sns.stat"],
    lessons: [{ id: "da-10-1", title: "DataFrame을 그대로 넣는 통계 그래프", minutes: 15, concepts: ["sns.stat"],
      quiz: [
        { kind: "write", q: "sns.countplot으로 df의 line별 개수를 그린 뒤, 막대 개수를 출력하는 코드를 작성하세요.", given: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C']})", expect: "3", must: ["countplot\\("], solution: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C']})\nax = sns.countplot(data=df, x='line')\nprint(len(ax.patches))", explain: "범주 A, B, C마다 막대 하나입니다." },
        { kind: "ox", q: "sns.boxplot은 범주별 평균만 막대로 보여 준다.", answer: false, explain: "boxplot은 중앙값, 사분위 범위, 이상치를 보여 줍니다. 평균 막대는 barplot입니다." },
      ] }] },

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
  { id: "st-06", track: "stats", title: "카이제곱 · ANOVA", summary: "범주 독립성, 세 집단 이상 비교", unit: 32, level: "실무",
    concepts: ["st.chi-anova"],
    lessons: [{ id: "st-06-1", title: "범주는 카이제곱, 세 집단은 ANOVA", minutes: 18, concepts: ["st.chi-anova"],
      quiz: [
        { kind: "choice", q: "세 설비의 평균 두께가 같은지 한 번에 검정하는 함수는?", options: ["stats.ttest_ind", "stats.f_oneway", "stats.chisquare", "stats.pearsonr"], answer: 1, explain: "세 집단 이상 평균 비교는 일원분산분석(f_oneway)입니다." },
        { kind: "ox", q: "독립성 카이제곱 검정의 자유도는 (행 수 − 1) × (열 수 − 1)이다.", answer: true, explain: "2×3 교차표면 1 × 2 = 2." },
      ] }] },
  { id: "st-07", track: "stats", title: "상관과 회귀", summary: "상관계수, 최소제곱, 계수 해석", unit: 33, level: "실무",
    concepts: ["st.regression"],
    lessons: [{ id: "st-07-1", title: "함께 움직이는 정도와 직선 하나로 예측하기", minutes: 18, concepts: ["st.regression"],
      quiz: [
        { kind: "write", q: "stats.linregress로 x, y의 기울기를 출력하는 코드를 작성하세요.", given: "from scipy import stats\nx = [1, 2, 3, 4]\ny = [1, 3, 5, 7]", expect: ["2.0", "2"], must: ["linregress\\("], solution: "from scipy import stats\nx = [1, 2, 3, 4]\ny = [1, 3, 5, 7]\nprint(round(stats.linregress(x, y).slope, 6))", explain: "y = 2x − 1이므로 기울기는 2." },
        { kind: "ox", q: "상관계수가 0.95로 높으면 x가 y의 원인이다.", answer: false, explain: "상관은 함께 움직인다는 뜻일 뿐입니다. 숨은 공통 원인이 있을 수 있습니다." },
      ] }] },
  { id: "st-08", track: "stats", title: "A/B 테스트와 검정력", summary: "두 비율 비교, 표본 수 설계, 검정력", unit: 34, level: "실무",
    concepts: ["st.abtest", "st.power"],
    lessons: [{ id: "st-08-1", title: "실험을 설계하고 결과를 읽는 법", minutes: 18, concepts: ["st.abtest", "st.power"],
      quiz: [
        { kind: "choice", q: "검출하려는 차이를 절반으로 줄이면 필요한 표본 수는 대략?", options: ["절반", "2배", "4배", "같다"], answer: 2, explain: "n ∝ 1/δ²." },
        { kind: "ox", q: "검정력 80%는 실제 차이가 있을 때 10번 중 8번은 유의한 결과를 얻는다는 뜻이다.", answer: true, explain: "1 − β = 0.8." },
      ] }] },

  // ── 머신러닝 ─────────────────────────────────────────────
  { id: "ml-01", track: "ml", title: "ML 워크플로와 데이터 분할", summary: "train/test, stratify, 기준 모델, 누수", unit: 17, level: "입문",
    concepts: ["ml.workflow"],
    lessons: [{ id: "ml-01-1", title: "모델보다 먼저: 나누고, 기준을 세우고, 새지 않게", minutes: 25, concepts: ["ml.workflow"],
      quiz: [
        { kind: "choice", q: "train_test_split에서 클래스 비율을 유지하는 인자는?", options: ["shuffle", "stratify", "random_state", "test_size"], answer: 1, explain: "stratify=y." },
        { kind: "ox", q: "스케일러는 전체 데이터로 fit 한 뒤 나누는 것이 정석이다.", answer: false, explain: "분할 후 학습 데이터로만 fit 해야 누수가 없습니다." },
        { kind: "choice", q: "타이타닉 생존(survived) 예측 모델의 특성으로 넣으면 안 되는 열은?", options: ["pclass (객실 등급)", "age (나이)", "alive (생존 여부 yes/no)", "fare (운임)"], answer: 2, explain: "alive는 정답을 다른 말로 쓴 열이라 넣으면 정답을 그대로 읽는 누수가 됩니다." },
      ] }] },
  { id: "ml-02", track: "ml", title: "선형 · 로지스틱 회귀", summary: "계수 해석, R², 확률 출력", unit: 18, level: "기본",
    concepts: ["ml.linear", "ml.gd"],
    lessons: [{ id: "ml-02-1", title: "직선 하나로 예측하고, 확률로 분류하기", minutes: 25, concepts: ["ml.linear", "ml.gd"],
      quiz: [
        { kind: "choice", q: "LinearRegression에서 기울기가 들어 있는 속성은?", options: ["model.slope", "model.coef_", "model.weight", "model.intercept_"], answer: 1, explain: "coef_는 피처별 기울기 배열, intercept_는 절편입니다." },
        { kind: "ox", q: "LogisticRegression의 predict는 확률이 0.5 이상이면 1로 판정한다.", answer: true, explain: "이진 분류의 기본 임계값은 0.5입니다." },
      ] }] },
  { id: "ml-03", track: "ml", title: "평가지표", summary: "혼동행렬, precision · recall · F1, 임계값, ROC-AUC", unit: 19, level: "기본",
    concepts: ["ml.metrics"],
    lessons: [{ id: "ml-03-1", title: "정확도 말고 무엇을 볼까", minutes: 25, concepts: ["ml.metrics"],
      quiz: [
        { kind: "short", q: "TP=6, FN=2일 때 재현율은? (소수)", answer: ["0.75", ".75"], explain: "6 / (6 + 2) = 0.75." },
        { kind: "choice", q: "임계값을 낮추면 보통 어떻게 되나?", options: ["recall↓ precision↑", "recall↑ precision↓", "둘 다 ↑", "변화 없음"], answer: 1, explain: "더 많이 1로 판정해 놓침은 줄고 오탐은 늘어납니다." },
        { kind: "choice", q: "암 검진의 1차 선별 검사에서 가장 중요하게 봐야 할 지표는?", options: ["정확도", "정밀도", "재현율", "R²"], answer: 2, explain: "1차 선별에서 환자를 놓치면(FN) 치명적입니다. 헛경보는 2차 정밀 검사에서 걸러낼 수 있습니다." },
      ] }] },
  { id: "ml-04", track: "ml", title: "트리와 앙상블", summary: "결정트리, 깊이와 과적합, 랜덤포레스트, 피처 중요도", unit: 20, level: "기본",
    concepts: ["ml.tree", "ml.overfit"],
    lessons: [{ id: "ml-04-1", title: "질문을 쌓는 결정트리, 투표하는 숲", minutes: 25, concepts: ["ml.tree", "ml.overfit"],
      quiz: [
      ] }] },
  { id: "ml-05", track: "ml", title: "교차검증과 하이퍼파라미터", summary: "K-fold, GridSearchCV, 검증 곡선", unit: 35, level: "기본",
    concepts: ["ml.cv", "ml.overfit"],
    lessons: [{ id: "ml-05-1", title: "한 번 나눈 점수를 믿지 말자", minutes: 22, concepts: ["ml.cv", "ml.overfit"],
      quiz: [
        { kind: "write", q: "cross_val_score로 5-fold 점수를 구한 뒤 점수 개수를 출력하는 코드를 작성하세요.", given: "import numpy as np\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.tree import DecisionTreeClassifier\nX = np.arange(40).reshape(20, 2)\ny = np.array([0, 1] * 10)", expect: "5", must: ["cross_val_score\\("], solution: "import numpy as np\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.tree import DecisionTreeClassifier\nX = np.arange(40).reshape(20, 2)\ny = np.array([0, 1] * 10)\nprint(len(cross_val_score(DecisionTreeClassifier(random_state=0), X, y, cv=5)))", explain: "cv=5면 점수 5개가 나옵니다." },
        { kind: "ox", q: "GridSearchCV로 고른 모델은 테스트 데이터로 마지막에 한 번만 평가한다.", answer: true, explain: "테스트를 여러 번 보면 그 점수도 낙관적으로 부풀려집니다." },
      ] }] },
  { id: "ml-06", track: "ml", title: "피처 엔지니어링과 Pipeline", summary: "스케일링, 원-핫 인코딩, ColumnTransformer, Pipeline", unit: 36, level: "실무",
    concepts: ["ml.feature"],
    lessons: [{ id: "ml-06-1", title: "전처리와 모델을 한 줄로 잇기", minutes: 25, concepts: ["ml.feature"],
      quiz: [
      ] }] },
  { id: "ml-07", track: "ml", title: "비지도 학습", summary: "K-means 군집, 엘보 · 실루엣, PCA", unit: 37, level: "실무",
    concepts: ["ml.kmeans", "ml.pca"],
    lessons: [{ id: "ml-07-1", title: "정답 없이 묶고, 줄이기", minutes: 25, concepts: ["ml.kmeans", "ml.pca"],
      quiz: [
        { kind: "ox", q: "회전수(1,000 단위)와 토크(10 단위)를 표준화하지 않고 K-means를 돌리면 거리가 거의 회전수로만 정해진다.", answer: true, explain: "K-means는 거리로 묶기 때문에 숫자가 큰 열이 거리를 독차지합니다. 그래서 표준화가 먼저입니다." },
        { kind: "ox", q: "K-means는 데이터에 뚜렷한 그룹이 없으면 그룹을 나누지 않는다.", answer: false, explain: "k를 주면 그룹이 없어도 무조건 k개로 나눕니다. 그룹이 의미 있는지는 사람이 확인해야 합니다." },
        { kind: "ox", q: "PCA의 첫 번째 주성분은 데이터의 분산이 가장 큰 방향이다.", answer: true, explain: "두 번째는 첫 번째와 직교하면서 남은 분산이 가장 큰 방향입니다." },
      ] }] },
  { id: "ml-08", track: "ml", title: "불균형 데이터", summary: "정확도의 함정, class_weight, 임계값, 오버샘플링", unit: 38, level: "실무",
    concepts: ["ml.imbalance"],
    lessons: [{ id: "ml-08-1", title: "드문 불량을 놓치지 않으려면", minutes: 25, concepts: ["ml.imbalance"],
      quiz: [
        { kind: "choice", q: "고장 1건을 놓치면 100만 원, 헛경보 1건은 1만 원이 든다. 판정 기준선(임계값)은 0.5에서 어떻게 바꾸는 게 맞을까?", options: ["더 낮춘다", "더 높인다", "0.5 그대로 둔다", "기준선은 비용과 상관없다"], answer: 0, explain: "놓침이 훨씬 비싸므로 기준선을 낮춰 헛경보가 늘더라도 놓침을 줄이는 쪽이 총비용이 적습니다." },
        { kind: "ox", q: "오버샘플링은 train/test로 나누기 전에 전체 데이터에 해야 한다.", answer: false, explain: "나누기 전에 복사하면 같은 행의 복사본이 시험용에도 들어가 점수가 부풀려집니다. 반드시 나눈 뒤 학습용에만 합니다." },
      ] }] },
  { id: "ml-09", track: "ml", title: "모델 해석", summary: "피처 중요도, 순열 중요도, 표준화 계수, 부분 의존도", unit: 39, level: "실무",
    concepts: ["ml.explain"],
    lessons: [{ id: "ml-09-1", title: "모델이 무엇을 보고 판단했나", minutes: 25, concepts: ["ml.explain"],
      quiz: [
        { kind: "choice", q: "테스트 데이터에서 열을 섞어 점수 하락으로 중요도를 재는 방법은?", options: ["feature_importances_", "permutation_importance", "coef_", "PCA"], answer: 1, explain: "sklearn.inspection.permutation_importance." },
        { kind: "ox", q: "상관이 높은 두 변수는 중요도를 서로 나눠 가져 각각 낮게 보일 수 있다.", answer: true, explain: "한 열을 섞어도 다른 열이 정보를 대신하기 때문입니다." },
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
// dir: 레슨 md 폴더. 트랙을 옮긴 코스(da-09·da-10 → python-viz)는 파일을 원래 폴더에 둔다.
export const lessonPath = (l) => `content/${l.dir || l.track}/${l.id}.md`;
