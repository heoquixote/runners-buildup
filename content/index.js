// 커리큘럼: 트랙 > 코스 > 레슨. 문제는 코스의 unit 번호로 problems.js 의 유닛과 이어진다.
// 레슨 본문은 content/<트랙>/<레슨 id>.md 에 있고, 화면에서 그때그때 불러온다.
// 레슨 quiz 는 본문을 다 읽었는지 확인하는 1~3문항(형식은 problems.js 의 개념 퀴즈와 같다).

export const TRACKS = [
  { id: "python-basic", label: "파이썬 기초", en: "Python Basics", color: "violet", ready: true,
    blurb: "변수부터 파일 입출력 · 표준 라이브러리까지. QA/QC 현장 예제로 문법을 익힙니다." },
  { id: "python-da", label: "데이터 분석", en: "Data Analysis", color: "cyan", ready: true,
    blurb: "NumPy · pandas로 데이터를 불러오고, 고르고, 묶고, 합칩니다." },
  { id: "python-viz", label: "데이터 시각화", en: "Visualization", color: "rose", ready: true,
    blurb: "matplotlib · seaborn으로 데이터를 그리고 읽습니다." },
  { id: "sql", label: "SQL", en: "SQL", color: "lime", ready: true,
    blurb: "SELECT부터 윈도우 함수 · 리텐션 분석, 데이터베이스 설계(모델링 · 정규화 · 트랜잭션 · 인덱스)까지. 브라우저 안의 SQLite로 바로 실행합니다." },
  { id: "stats", label: "통계", en: "Statistics", color: "amber", ready: true,
    blurb: "기술통계 · 분포 · 검정 · 회귀. 시뮬레이션으로 직관을 만듭니다." },
  { id: "ml", label: "머신러닝", en: "Machine Learning", color: "green", ready: true,
    blurb: "scikit-learn으로 회귀 · 분류 · 군집을 만들고 평가합니다." },
  { id: "dl", label: "딥러닝", en: "Deep Learning", color: "orange", ready: true,
    blurb: "뉴런부터 Transformer · 생성 모델 · 전이 학습까지, 실습 없이 그림과 손 계산으로 원리를 이해합니다." },
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
  { id: "pb-01", track: "python-basic", title: "변수와 사칙연산", summary: "print 출력, 주석, f-string, 변수, 자료형, + - * / // % **, 자료형별 계산, 연산 우선순위, 반올림, 형변환", unit: 1, level: "입문",
    concepts: ["py.print", "py.variable", "py.arith", "py.types"],
    lessons: [{ id: "pb-01-0", title: "화면에 출력하기: print · 주석 · f-string", minutes: 12, concepts: ["py.print", "py.fstring"],
      quiz: [
        { kind: "write", q: "f-string 한 줄로 '합계: 30' 을 출력하는 코드를 작성하세요. 중괄호 안에서 10 + 20 을 계산하세요.", expect: "합계: 30", must: ["f[\"']", "\\{[^}]*\\+[^}]*\\}"], solution: "print(f\"합계: {10 + 20}\")", explain: "따옴표 앞 f가 중괄호 안의 10 + 20을 계산해 30으로 바꿔 끼웁니다." },
        { kind: "ox", q: "# 뒤에 쓴 주석도 파이썬이 실행한다.", answer: false, explain: "# 뒤는 사람이 읽는 메모라 실행되지 않습니다. 줄 앞에 #를 붙이면 그 줄을 잠시 꺼 둘 수 있습니다." },
      ] },
      { id: "pb-01-1", title: "변수 · 자료형 · 사칙연산", minutes: 18, concepts: ["py.variable", "py.types", "py.arith"],
      quiz: [
        { kind: "write", q: "1000개를 24개들이 박스에 담을 때 가득 찬 박스 수를 출력하는 코드를 작성하세요.", expect: "41", must: ["//"], solution: "print(1000 // 24)", explain: "//는 몫입니다. 24개들이 박스 41개가 가득 찹니다." },
        { kind: "ox", q: "a = 5 는 \"a와 5가 같다\"는 뜻이다.", answer: false, explain: "=는 오른쪽 값을 왼쪽 이름에 담는 대입입니다. 같은지 비교는 ==를 씁니다." },
      ] },
      { id: "pb-01-2", title: "숫자 계산 자세히: 우선순위 · 누적 · 반올림", minutes: 15, concepts: ["py.arith"],
        quiz: [
          { kind: "choice", q: "측정값 a, b, c 의 평균을 바르게 구하는 식은?", options: ["a + b + c / 3", "(a + b + c) / 3", "a + b + (c / 3)", "(a + b + c) // 3"], answer: 1, explain: "나누기가 더하기보다 먼저라서 괄호로 합을 먼저 구해야 합니다. //는 소수점 아래를 버리므로 평균이 틀어집니다." },
          { kind: "ox", q: "0.1 + 0.2 == 0.3 은 True 이다.", answer: false, explain: "소수는 2진수로 정확히 담기지 않아 0.30000000000000004가 됩니다. round()로 반올림하거나 차이가 아주 작은지로 비교합니다." },
        ] },
      { id: "pb-01-3", title: "자료형과 형변환", minutes: 15, concepts: ["py.types"],
        quiz: [
          { kind: "choice", q: "int(\"3.5\") 를 실행하면 나는 에러를 고르세요.", options: ["TypeError", "ValueError", "NameError", "SyntaxError"], answer: 1, explain: "int()는 정수 모양의 글자만 받습니다. 소수 모양이면 float()를 먼저 거칩니다." },
          { kind: "choice", q: "bool()에 넣었을 때 False가 나오는 값은?", options: ["\"0\"", "\" \"", "0", "-1"], answer: 2, explain: "숫자 0과 빈 문자열이 False입니다. \"0\"과 \" \"는 글자가 들어 있는 문자열이라 True입니다." },
        ] },
    ] },
  { id: "pb-02", track: "python-basic", title: "문자열 기초", summary: "따옴표, 인덱싱, 슬라이싱, +, *, len, sep · end, 이스케이프, 코드 해독", unit: 2, level: "입문",
    concepts: ["py.str", "py.index-slice"],
    lessons: [{ id: "pb-02-1", title: "문자열 자르고 붙이기", minutes: 12, concepts: ["py.str", "py.index-slice"],
      quiz: [
        { kind: "write", q: "슬라이싱으로 code에서 연도 24를 잘라 출력하는 코드를 작성하세요.", given: "code = 'KR24A0915X'", expect: "24", must: ["code\\[[^\\]]*:[^\\]]*\\]"], solution: "code = 'KR24A0915X'\nprint(code[2:4])", explain: "[2:4]는 2번, 3번 글자입니다. 끝 번호는 포함되지 않습니다." },
        { kind: "choice", q: "마지막 3글자를 꺼내는 식은?", options: ["code[3:]", "code[-3:]", "code[:3]", "code[-3]"], answer: 1, explain: "음수 인덱스는 뒤에서부터 셉니다. [-3:]은 뒤 3글자 전부입니다." },
      ] },
      { id: "pb-02-2", title: "문자열 출력 다루기: sep · end · 이스케이프", minutes: 12, concepts: ["py.str"],
        quiz: [
          { kind: "write", q: "print 한 번과 sep 으로 2024, 09, 15 를 2024-09-15 로 출력하는 코드를 작성하세요.", expect: "2024-09-15", must: ["sep\\s*="], solution: "print('2024', '09', '15', sep='-')", explain: "sep은 값 사이에 넣을 글자입니다. 기본값은 빈칸 하나입니다." },
          { kind: "ox", q: "문자열 \"A\\nB\" 의 len()은 4이다.", answer: false, explain: "\\n은 줄바꿈 글자 하나로 셉니다. A, 줄바꿈, B로 3글자입니다." },
        ] },
      { id: "pb-02-3", title: "슬라이싱으로 코드 해독하기", minutes: 15, concepts: ["py.index-slice"],
        quiz: [
          { kind: "write", q: "슬라이싱으로 code를 거꾸로 뒤집어 출력하는 코드를 작성하세요.", given: "code = 'A0915'", expect: "5190A", must: ["\\[\\s*:\\s*:\\s*-1\\s*\\]"], solution: "code = 'A0915'\nprint(code[::-1])", explain: "간격을 -1로 주면 뒤에서 앞으로 갑니다." },
          { kind: "ox", q: "code[4] = 'B' 처럼 문자열의 한 글자를 바로 바꿀 수 있다.", answer: false, explain: "문자열은 고칠 수 없습니다. code[:4] + 'B' + code[5:]처럼 새 문자열을 만들어 다시 담습니다." },
        ] },
    ] },
  { id: "pb-03", track: "python-basic", title: "문자열 메서드", summary: "split, join, replace, strip, in, find, count, startswith, isdigit, f-string 포맷", unit: 3, level: "입문",
    concepts: ["py.str-method", "py.fstring"],
    lessons: [{ id: "pb-03-1", title: "문자열 메서드로 데이터 정리하기", minutes: 12, concepts: ["py.str-method", "py.fstring"],
      quiz: [
        { kind: "write", q: "split으로 log를 쉼표 기준으로 나눈 뒤, 조각 개수를 출력하는 코드를 작성하세요.", given: "log = 'ERROR,Temp,High'", expect: "3", must: ["\\.split\\(","len\\("], solution: "log = 'ERROR,Temp,High'\nprint(len(log.split(',')))", explain: "split(',')은 쉼표 기준으로 3조각 리스트를 돌려줍니다." },
        { kind: "ox", q: "s.upper()를 호출하면 s 자체가 대문자로 바뀐다.", answer: false, explain: "문자열은 바뀌지 않습니다. 새 문자열을 돌려주므로 s = s.upper()처럼 다시 담아야 합니다." },
      ] },
      { id: "pb-03-2", title: "찾고 세고 검사하기: in · find · count · isdigit", minutes: 15, concepts: ["py.str-method"],
        quiz: [
          { kind: "choice", q: "s.find('WARN') 에서 'WARN'이 s에 없으면 돌려주는 값은?", options: ["0", "-1", "None", "에러가 난다"], answer: 1, explain: "find는 못 찾으면 -1을 돌려줍니다. 에러를 내는 것은 index()입니다." },
          { kind: "write", q: "isdigit()으로 qty가 숫자로만 이루어졌는지 출력하는 코드를 작성하세요.", given: "qty = '12a0'", expect: "False", must: ["\\.isdigit\\("], solution: "qty = '12a0'\nprint(qty.isdigit())", explain: "a가 섞여 있어 False입니다." },
        ] },
      { id: "pb-03-3", title: "f-string으로 보고서 한 줄 만들기", minutes: 15, concepts: ["py.fstring"],
        quiz: [
          { kind: "choice", q: "rate = 0.0345 일 때 f\"{rate:.1%}\" 의 결과는?", options: ["0.0%", "3.5%", "0.03%", "345.0%"], answer: 1, explain: "% 포맷은 100을 곱해 퍼센트로 보여 줍니다. 소수 첫째 자리에서 반올림해 3.5%입니다." },
          { kind: "write", q: "f-string으로 mean을 소수 둘째 자리까지 출력하는 코드를 작성하세요.", given: "mean = 10.04666", expect: "10.05", must: ["f[\"']", ":\\.2f"], solution: "mean = 10.04666\nprint(f'{mean:.2f}')", explain: ":.2f는 소수 둘째 자리까지 반올림해 보여 줍니다." },
        ] },
    ] },
  { id: "pb-04", track: "python-basic", title: "리스트 기초", summary: "인덱싱, 중첩 리스트, 수정, del, append, extend, 튜플, 언패킹, 참조와 복사", unit: 4, level: "입문",
    concepts: ["py.list", "py.tuple", "py.object-ref"],
    lessons: [{ id: "pb-04-1", title: "리스트에 담고 꺼내고 고치기", minutes: 12, concepts: ["py.list", "py.object-ref"],
      quiz: [
        { kind: "write", q: "append로 lots에 103을 추가한 뒤, lots의 길이를 출력하는 코드를 작성하세요.", given: "lots = [101, 102]", expect: "3", must: ["\\.append\\(","len\\("], solution: "lots = [101, 102]\nlots.append(103)\nprint(len(lots))", explain: "append는 끝에 하나를 붙입니다." },
        { kind: "choice", q: "append([1, 2])와 extend([1, 2])의 차이는?", options: ["같다", "append는 리스트 하나를 원소로, extend는 원소를 하나씩 붙인다", "extend는 앞에 붙인다", "append는 두 번 호출해야 한다"], answer: 1, explain: "append([1, 2])는 길이가 1 늘고, extend([1, 2])는 2 늘어납니다." },
      ] },
      { id: "pb-04-2", title: "튜플과 언패킹", minutes: 15, concepts: ["py.tuple"],
        quiz: [
          { kind: "ox", q: "spec = (9.5, 10.5) 일 때 spec[1] = 11.0 으로 상한을 바꿀 수 있다.", answer: false, explain: "튜플은 고칠 수 없습니다. spec = (spec[0], 11.0)처럼 새 튜플을 만들어 다시 담습니다." },
          { kind: "choice", q: "lot, qty = ('A0915', 1250, 18) 을 실행하면?", options: ["lot='A0915', qty=1250, 18은 버려진다", "ValueError가 난다", "qty에 (1250, 18)이 담긴다", "TypeError가 난다"], answer: 1, explain: "변수 2개에 값 3개를 풀 수 없어 ValueError: too many values to unpack 이 납니다." },
        ] },
      { id: "pb-04-3", title: "참조와 복사: 이름표 두 개, 상자 하나", minutes: 15, concepts: ["py.object-ref"],
        quiz: [
          { kind: "choice", q: "a = [1, 2]; b = a; b.append(3) 다음 print(a) 의 결과는?", options: ["[1, 2]", "[1, 2, 3]", "[3]", "에러"], answer: 1, explain: "b = a는 같은 리스트에 이름을 하나 더 붙입니다. 리스트는 하나뿐이라 a로 봐도 3이 들어 있습니다." },
          { kind: "ox", q: "lines = [[1], [2]] 를 lines.copy() 로 복사하면 안쪽 리스트까지 따로 고칠 수 있다.", answer: false, explain: "copy()는 바깥 리스트만 새로 만드는 얕은 복사입니다. 안쪽까지 따로 고치려면 copy.deepcopy()를 씁니다." },
        ] },
    ] },
  { id: "pb-05", track: "python-basic", title: "리스트 정렬과 에러 읽기", summary: "sort vs sorted, remove, pop, in, index, count, sum · min · max, Traceback 읽기, 흔한 에러 6가지", unit: 5, level: "입문",
    concepts: ["py.sort", "py.error"],
    lessons: [{ id: "pb-05-1", title: "정렬 두 가지와 에러 메시지 읽는 법", minutes: 12, concepts: ["py.sort", "py.error"],
      quiz: [
        { kind: "choice", q: "nums = [3, 1, 2] 일 때 print(nums.sort()) 의 출력은?", options: ["[1, 2, 3]", "[3, 1, 2]", "None", "에러"], answer: 2, explain: "sort()는 리스트를 제자리에서 바꾸고 None을 돌려줍니다. 정렬된 새 리스트가 필요하면 sorted()를 씁니다." },
        { kind: "choice", q: "리스트 길이가 3인데 nums[5]를 읽으면 나는 에러를 고르세요.", options: ["KeyError", "ValueError", "IndexError", "TypeError"], answer: 2, explain: "범위를 벗어난 인덱스는 IndexError입니다." },
      ] },
      { id: "pb-05-2", title: "리스트에서 찾고 요약하기", minutes: 15, concepts: ["py.list", "py.sort"],
        quiz: [
          { kind: "choice", q: "sorted(['9', '10', '2']) 의 결과는?", options: ["['2', '9', '10']", "['10', '2', '9']", "['9', '10', '2']", "에러가 난다"], answer: 1, explain: "문자열은 앞 글자부터 비교합니다. '1'이 '2'나 '9'보다 작아서 '10'이 맨 앞에 옵니다. 숫자로 바꾼 뒤 정렬해야 합니다." },
          { kind: "write", q: "sum과 len으로 sizes의 평균을 출력하는 코드를 작성하세요.", given: "sizes = [10.0, 9.5, 10.5]", expect: "10.0", must: ["sum\\(", "len\\("], solution: "sizes = [10.0, 9.5, 10.5]\nprint(sum(sizes) / len(sizes))", explain: "평균은 합계 ÷ 개수입니다. 개수를 3처럼 손으로 쓰지 말고 len()을 씁니다." },
        ] },
      { id: "pb-05-3", title: "에러 메시지 읽고 고치기", minutes: 15, concepts: ["py.error"],
        quiz: [
          { kind: "choice", q: "Traceback에서 가장 먼저 읽어야 할 곳은?", options: ["맨 위 Traceback (most recent call last) 줄", "맨 아래 에러 이름과 설명 줄", "가운데 File 줄", "아무 데나 상관없다"], answer: 1, explain: "맨 아래 줄에 에러 이름과 설명이 있습니다. 그다음 바로 위의 줄 번호와 코드를 봅니다." },
          { kind: "choice", q: "int('1,250') 처럼 자료형은 맞지만 값을 바꿀 수 없을 때 나는 에러를 고르세요.", options: ["ValueError", "TypeError", "IndexError", "NameError"], answer: 0, explain: "문자열을 int()에 넣는 것은 맞지만 쉼표가 섞인 값이라 바꿀 수 없어 ValueError입니다." },
        ] },
    ] },
  { id: "pb-06", track: "python-basic", title: "딕셔너리와 Set", summary: "key-value CRUD, get, 중첩 딕셔너리, 행 목록, update, pop, Set 연산(| & - ^), 부분집합", unit: 6, level: "입문",
    concepts: ["py.dict", "py.set"],
    lessons: [{ id: "pb-06-1", title: "이름으로 찾는 딕셔너리, 중복 없는 Set", minutes: 12, concepts: ["py.dict", "py.set"],
      quiz: [
        { kind: "write", q: "get으로 stock에서 'B' 재고를 읽되, 키가 없으면 0이 나오게 출력하는 코드를 작성하세요.", given: "stock = {'A': 3}", expect: "0", must: ["\\.get\\("], solution: "stock = {'A': 3}\nprint(stock.get('B', 0))", explain: "get(키, 기본값)은 키가 없을 때 기본값을 돌려주고 에러를 내지 않습니다." },
        { kind: "write", q: "set으로 nums의 중복을 없앤 뒤, 서로 다른 값의 개수를 출력하는 코드를 작성하세요.", given: "nums = [1, 1, 2, 3, 3]", expect: "3", must: ["set\\(","len\\("], solution: "nums = [1, 1, 2, 3, 3]\nprint(len(set(nums)))", explain: "Set은 중복을 없앱니다. {1, 2, 3}" },
      ] },
      { id: "pb-06-2", title: "딕셔너리로 기록 다루기", minutes: 15, concepts: ["py.dict"],
        quiz: [
          { kind: "write", q: "equip에서 EQ-08의 status를 꺼내 출력하는 코드를 작성하세요.", given: "equip = {'EQ-07': {'status': 'RUN'}, 'EQ-08': {'status': 'ALARM'}}", expect: "ALARM", must: ["\\[\\s*['\"]EQ-08['\"]\\s*\\]\\s*\\[\\s*['\"]status['\"]\\s*\\]"], solution: "equip = {'EQ-07': {'status': 'RUN'}, 'EQ-08': {'status': 'ALARM'}}\nprint(equip['EQ-08']['status'])", explain: "바깥 key로 설비를 고르고, 안쪽 key로 항목을 고릅니다." },
          { kind: "choice", q: "row = {'lot': 'A0915', 'memo': '재검'} 에서 m = row.pop('memo') 다음 m 에 담긴 값은?", options: ["'memo'", "'재검'", "None", "{'lot': 'A0915'}"], answer: 1, explain: "pop(key)는 항목을 지우면서 그 값을 돌려줍니다." },
        ] },
      { id: "pb-06-3", title: "Set 연산으로 비교하기", minutes: 15, concepts: ["py.set"],
        quiz: [
          { kind: "choice", q: "필수 점검 항목 required 중 오늘 점검하지 않은 항목(done 기준)을 구하는 식은?", options: ["required & done", "required | done", "required - done", "done - required"], answer: 2, explain: "A - B는 A에는 있는데 B에는 없는 것입니다. 기준이 되는 required를 앞에 둡니다." },
          { kind: "ox", q: "Set은 넣은 순서를 기억하므로 출력하면 항상 넣은 순서대로 나온다.", answer: false, explain: "Set은 순서가 없습니다. 순서대로 보려면 sorted()로 정렬된 리스트를 만듭니다." },
        ] },
    ] },
  { id: "pb-07", track: "python-basic", title: "제어문 (if · for · while)", summary: "input, 형변환, if, for, enumerate, zip, items, 중첩 for, while, break, continue, 추적표", unit: 7, level: "기본",
    concepts: ["py.input-cast", "py.if", "py.for", "py.while", "py.loop-flow"],
    lessons: [{ id: "pb-07-1", title: "조건으로 가르고 반복으로 돌리기", minutes: 25, concepts: ["py.input-cast", "py.if", "py.for", "py.while", "py.loop-flow"],
      quiz: [
        { kind: "write", q: "for문과 range로 1 2 3 을 출력하는 코드를 작성하세요.", expect: ["1 2 3","123"], must: ["\\bfor\\b","range\\("], solution: "for i in range(1, 4):\n    print(i, end=' ')", explain: "range(1, 4)는 1, 2, 3입니다. 끝 숫자 4는 포함되지 않습니다." },
        { kind: "ox", q: "input()으로 받은 값은 숫자를 입력해도 문자열이다.", answer: true, explain: "계산하려면 int()나 float()로 바꿔야 합니다." },
      ] },
      { id: "pb-07-2", title: "for 반복 깊게: 리스트 · 문자열 · 딕셔너리 돌기", minutes: 20, concepts: ["py.for", "py.enumerate"],
        quiz: [
          { kind: "choice", q: "zip(['A', 'B', 'C'], [1, 2]) 로 for를 돌면 몇 번 반복할까요?", options: ["2번", "3번", "에러가 난다", "5번"], answer: 0, explain: "zip은 짧은 쪽에 맞춰 멈춥니다. 남는 'C'는 조용히 버려지니 길이를 먼저 확인하세요." },
          { kind: "write", q: "enumerate로 ['L1', 'L2']의 번호를 1부터 붙여 한 줄에 하나씩 (1 L1, 2 L2) 출력하는 코드를 작성하세요.", expect: ["1 L1\n2 L2"], must: ["enumerate\\(", "start\\s*=\\s*1|,\\s*1\\s*\\)"], solution: "for i, v in enumerate(['L1', 'L2'], start=1):\n    print(i, v)", explain: "start=1을 주면 번호가 1부터 시작합니다." },
        ] },
      { id: "pb-07-3", title: "반복 흐름 추적: while · break · continue", minutes: 20, concepts: ["py.while", "py.loop-flow"],
        quiz: [
          { kind: "short", q: "stock = 50 에서 while stock > 0: 안에서 stock -= 20 을 하면 반복은 몇 번 실행될까요? (숫자만)", answer: "3", explain: "50 → 30 → 10 → -10. 10일 때도 조건이 참이라 한 번 더 돌아 3번입니다." },
          { kind: "choice", q: "for 반복 안에서 continue를 만나면 다음에 실행되는 곳은?", options: ["반복문 다음 줄", "다음 회차의 첫 줄", "같은 회차의 다음 줄", "프로그램이 끝난다"], answer: 1, explain: "continue는 이번 회차의 남은 줄만 건너뛰고 다음 회차로 갑니다. 반복 전체를 끝내는 것은 break입니다." },
        ] },
    ] },
  { id: "pb-08", track: "python-basic", title: "문자열 활용 (함수 문제)", summary: "함수, 매개변수 기본값, 키워드 인자, 여러 값 반환, 작은 함수로 나눠 문자열 검증", unit: 8, level: "기본",
    concepts: ["py.function", "py.index-slice", "py.str-method"],
    lessons: [{ id: "pb-08-1", title: "solution 함수로 문자열 처리하기", minutes: 20, concepts: ["py.function", "py.index-slice", "py.str-method"],
      quiz: [
        { kind: "ox", q: "함수형 문제에서 답은 print()로 출력하면 채점된다.", answer: false, explain: "채점기는 return 값을 봅니다. print는 확인용입니다." },
        { kind: "write", q: "문자열의 마지막 3글자를 돌려주는 함수 tail을 완성해 tail('EQP-A2024-001')의 결과를 출력하세요.", given: "def tail(s):\n    return \n\nprint(tail('EQP-A2024-001'))", expect: "001", must: ["return\\s+s\\["], solution: "def tail(s):\n    return s[-3:]\n\nprint(tail('EQP-A2024-001'))", explain: "[-3:]은 마지막 3글자입니다." },
      ] },
      { id: "pb-08-2", title: "함수 만들기 기본기: 기본값 · 키워드 인자 · 여러 값 반환", minutes: 15, concepts: ["py.function"],
        quiz: [
          { kind: "choice", q: "return 이 없는 함수를 x = f() 로 호출하면 x 에 담기는 값은?", options: ["0", "빈 문자열", "None", "에러가 난다"], answer: 2, explain: "돌려준 값이 없으면 None이 담깁니다. 결과를 받아 쓸 함수라면 return을 빠뜨린 것입니다." },
          { kind: "ox", q: "def judge(low=9.5, value): 처럼 기본값이 있는 매개변수를 앞에 둘 수 있다.", answer: false, explain: "기본값이 있는 매개변수는 기본값이 없는 매개변수보다 뒤에 둬야 합니다. 앞에 두면 SyntaxError입니다." },
        ] },
      { id: "pb-08-3", title: "작은 함수로 나눠 문자열 검증하기", minutes: 20, concepts: ["py.function", "py.str-method"],
        quiz: [
          { kind: "choice", q: "로트 코드 검증 함수 is_valid 에서 길이 검사를 맨 먼저 하는 이유는?", options: ["속도가 빨라서", "길이가 짧으면 뒤의 인덱싱에서 IndexError가 나기 때문에", "파이썬 문법 규칙이라서", "대문자로 바꾸기 위해"], answer: 1, explain: "code[9]처럼 자리를 꺼내기 전에 길이를 확인해야 짧은 입력에서 에러가 나지 않습니다. 위험한 일 전에 안전한 검사부터 합니다." },
        ] },
    ] },
  { id: "pb-09", track: "python-basic", title: "알고리즘 (함수형)", summary: "solution 함수, 세기 · 찾기 · 집계 패턴, 호출 스택, 지역 · 전역 변수, sum · max(key) · any · all", unit: 9, level: "기본",
    concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
    lessons: [{ id: "pb-09-1", title: "함수 안에서 세고 찾고 집계하기", minutes: 20, concepts: ["py.function", "py.scope", "py.enumerate", "py.dict"],
      quiz: [
        { kind: "write", q: "enumerate로 ['A', 'B']의 번호와 값을 한 줄에 하나씩 (0 A, 1 B) 출력하는 코드를 작성하세요.", expect: ["0 A\n1 B"], must: ["enumerate\\("], solution: "for i, v in enumerate(['A', 'B']):\n    print(i, v)", explain: "enumerate는 (번호, 값) 쌍을 줍니다. 번호는 0부터입니다." },
        { kind: "ox", q: "함수 안에서 만든 변수는 함수 밖에서도 그대로 쓸 수 있다.", answer: false, explain: "함수 안의 변수는 지역 변수입니다. 밖으로 전하려면 return 하세요." },
      ] },
      { id: "pb-09-2", title: "함수 호출과 스코프", minutes: 15, concepts: ["py.scope"],
        quiz: [
          { kind: "choice", q: "total = 0 인 상태에서 함수 안에 total = 120 을 쓰고 호출한 뒤, 밖에서 print(total) 하면?", options: ["0", "120", "None", "에러가 난다"], answer: 0, explain: "함수 안에서 같은 이름에 대입하면 새 지역 변수가 생깁니다. 바깥 total은 그대로 0입니다. 바꾸려면 return 값을 다시 담습니다." },
          { kind: "ox", q: "함수에 리스트를 넘기면 복사본이 넘어가므로, 함수 안에서 remove 해도 원본은 그대로다.", answer: false, explain: "매개변수는 원본 리스트에 붙은 또 하나의 이름표입니다. 함수 안에서 고치면 원본이 바뀝니다. 지키려면 copy()로 복사본을 고칩니다." },
        ] },
      { id: "pb-09-3", title: "내장 함수로 짧게 쓰기: sum · max(key) · any · all", minutes: 15, concepts: ["py.enumerate"],
        quiz: [
          { kind: "choice", q: "sizes 의 모든 값이 9.5~10.5 안인지 True/False 로 확인하는 식은?", options: ["any(9.5 <= s <= 10.5 for s in sizes)", "all(9.5 <= s <= 10.5 for s in sizes)", "max(sizes) <= 10.5", "sum(sizes) <= 10.5"], answer: 1, explain: "모두 만족해야 True인 것은 all입니다. max만 보면 하한(9.5) 미달을 놓칩니다." },
          { kind: "write", q: "max와 key로 defects에서 불량이 가장 많은 라인 이름을 출력하는 코드를 작성하세요.", given: "defects = {'L1': 18, 'L2': 7, 'L3': 25}", expect: "L3", must: ["max\\(", "key\\s*="], solution: "defects = {'L1': 18, 'L2': 7, 'L3': 25}\nprint(max(defects, key=defects.get))", explain: "딕셔너리를 그냥 max에 넣으면 key끼리 비교합니다. key=defects.get으로 값을 기준으로 삼습니다." },
        ] },
    ] },
  // tip: 가볍게 읽고 넘어가는 참고 코스(2026-11-08 진성 요청). 코스 화면 · 진도에 연습문제를 보여 주지 않는다.
  // unit 11 문제는 QAQC 회차 과제(SESSIONS 5회차)에서 계속 쓰므로 unit 연결은 남겨 둔다.
  { id: "pb-10", track: "python-basic", tip: true, title: "Tip · 파일 입출력과 데이터 형식", summary: "정형 · 반정형 · 비정형 데이터, with open, CSV · JSON 맛보기", unit: 11, level: "참고",
    concepts: ["py.data-format", "py.file", "py.csv", "py.json"],
    lessons: [
      // 퀴즈 없이 읽고 '다 읽었어요'로 완료
      { id: "pb-10-1", title: "데이터의 모양과 파일 다루기: 정형 · 반정형, CSV · JSON", minutes: 10, concepts: ["py.data-format", "py.file", "py.csv", "py.json"] },
    ] },
  { id: "pb-11", track: "python-basic", title: "컴프리헨션과 람다", summary: "리스트 · 딕셔너리 · Set 컴프리헨션, 조건식, lambda, 여러 기준 정렬, map · filter", unit: 21, level: "기본",
    concepts: ["py.comprehension", "py.lambda"],
    lessons: [{ id: "pb-11-1", title: "for문 세 줄을 한 줄로, 정렬 기준은 lambda로", minutes: 15, concepts: ["py.comprehension", "py.lambda"],
      quiz: [
        { kind: "write", q: "리스트 컴프리헨션으로 temps에서 30 이상인 값만 남긴 리스트를 출력하는 코드를 작성하세요.", given: "temps = [28, 31, 35, 29, 30]", expect: "[31, 35, 30]", must: ["\\[.+\\bfor\\b.+\\bin\\b.+\\bif\\b.+\\]"], solution: "temps = [28, 31, 35, 29, 30]\nprint([t for t in temps if t >= 30])", explain: "[t for t in temps if 조건] 은 조건이 True인 값만 원래 순서대로 모읍니다." },
        { kind: "choice", q: "pairs = [(\"A\", 3), (\"B\", 1)] 을 두 번째 값 기준으로 정렬하는 코드는?", options: ["sorted(pairs, key=lambda p: p[1])", "sorted(pairs, key=p[1])", "sorted(pairs[1])", "pairs.sort(1)"], answer: 0, explain: "key에는 원소 하나를 받아 기준값을 돌려주는 함수를 넘깁니다." },
      ] },
      { id: "pb-11-2", title: "컴프리헨션 넓히기: 조건식 · 딕셔너리 · Set", minutes: 15, concepts: ["py.comprehension"],
        quiz: [
          { kind: "choice", q: "sizes 의 모든 값에 'OK' 또는 'NG' 라벨을 붙여 같은 길이의 리스트를 만드는 식은?", options: ["[s for s in sizes if s <= 10.5]", "['OK' if s <= 10.5 else 'NG' for s in sizes]", "['OK' for s in sizes if s <= 10.5 else 'NG']", "[s if 'OK' else 'NG' for s in sizes]"], answer: 1, explain: "조건식(A if 조건 else B)을 식 자리에 두면 모든 원소를 바꿉니다. 뒤쪽 if는 거르기라서 개수가 줄어듭니다." },
          { kind: "write", q: "딕셔너리 컴프리헨션으로 lots와 qty를 짝지어 {'A0915': 1250, 'A0916': 980} 을 만들어 출력하세요.", given: "lots = ['A0915', 'A0916']\nqty = [1250, 980]", expect: "{'A0915': 1250, 'A0916': 980}", must: ["\\{.+:.+\\bfor\\b.+\\}"], solution: "lots = ['A0915', 'A0916']\nqty = [1250, 980]\nprint({l: q for l, q in zip(lots, qty)})", explain: "{key: value for ...} 모양이 딕셔너리 컴프리헨션입니다. zip으로 두 목록을 짝지었습니다." },
        ] },
      { id: "pb-11-3", title: "lambda와 key: 정렬 기준 고르기", minutes: 15, concepts: ["py.lambda"],
        quiz: [
          { kind: "choice", q: "rows = [(로트, 불량수), ...] 를 불량 많은 순, 같으면 로트 이름 순으로 정렬하는 key는?", options: ["key=lambda r: (r[1], r[0])", "key=lambda r: (-r[1], r[0])", "key=lambda r: -r[0]", "key=lambda r: r[1], reverse=True 만 쓰면 된다"], answer: 1, explain: "숫자에 마이너스를 붙이면 내림차순이 되고, 둘째 값 r[0]은 오름차순 그대로입니다. reverse=True는 두 기준을 모두 뒤집습니다." },
          { kind: "ox", q: "lambda 안에는 if문과 여러 줄 코드를 자유롭게 쓸 수 있다.", answer: false, explain: "lambda는 식 하나만 씁니다. 여러 줄이 필요하면 def로 함수를 만들어 그 이름을 key로 넘깁니다." },
        ] },
    ] },
  { id: "pb-12", track: "python-basic", title: "예외 처리", summary: "try, except, else, finally, raise, 반복 안 예외 처리, 실패 목록 모으기", unit: 22, level: "기본",
    concepts: ["py.exception"],
    lessons: [{ id: "pb-12-1", title: "에러가 나도 멈추지 않는 코드", minutes: 15, concepts: ["py.exception"],
      quiz: [
        { kind: "write", q: "try / except로 float('N/A')에서 나는 에러를 잡아 0.0을 출력하는 코드를 작성하세요.", expect: "0.0", must: ["\\btry\\s*:", "\\bexcept\\b"], solution: "try:\n    print(float('N/A'))\nexcept ValueError:\n    print(0.0)", explain: "float('N/A')는 ValueError를 냅니다. except 블록에서 대신할 값을 정합니다." },
        { kind: "ox", q: "except: 처럼 에러 이름을 비워 두는 것이 가장 안전한 습관이다.", answer: false, explain: "이름 없는 except는 오타(NameError)까지 숨깁니다. 잡을 에러를 이름으로 적으세요." },
      ] },
      { id: "pb-12-2", title: "raise: 잘못된 값에 직접 에러 내기", minutes: 15, concepts: ["py.exception"],
        quiz: [
          { kind: "choice", q: "try / except / else / finally 에서 에러가 나지 않았을 때 실행되지 않는 블록은?", options: ["try", "except", "else", "finally"], answer: 1, explain: "에러가 없으면 try → else → finally 순서로 지나가고 except는 건너뜁니다." },
          { kind: "ox", q: "불량 수가 검사 수보다 큰 입력이 들어오면, 계산 결과를 그대로 돌려주는 것이 raise 로 알리는 것보다 안전하다.", answer: false, explain: "조용히 틀린 값을 돌려주면 보고서까지 흘러갑니다. raise ValueError로 들어온 자리에서 바로 알리고, 처리 방법은 함수를 쓰는 쪽이 정합니다." },
        ] },
      { id: "pb-12-3", title: "데이터 정제에서 예외 다루기", minutes: 20, concepts: ["py.exception"],
        quiz: [
          { kind: "choice", q: "행 1,000개를 처리하는 for 반복 바깥에 try 를 두면 어떻게 될까요?", options: ["문제 행만 건너뛰고 끝까지 처리한다", "첫 에러에서 반복 전체가 끝난다", "에러가 난 행을 0으로 처리한다", "문법 오류가 난다"], answer: 1, explain: "에러가 나면 try 블록 전체를 빠져나가므로 반복도 끝납니다. 한 행씩 따로 처리하려면 try를 반복 안에 둡니다." },
        ] },
    ] },
  // 표준 라이브러리 (2026-11-07 진성 님 원고). 기획안 docs/lesson-plans/python-basic.md 의 pb-13
  { id: "pb-13", track: "python-basic", title: "표준 라이브러리 (datetime · math · random · os)", summary: "import와 내 모듈, datetime · timedelta, strftime · strptime, math 올림 · 내림, random seed · sample, os 경로 · 폴더", unit: 50, level: "기본",
    concepts: ["py.module", "py.datetime", "py.math", "py.random", "py.os"],
    lessons: [
      { id: "pb-13-1", title: "모듈과 import: 남이 만든 도구 상자 쓰기", minutes: 15, concepts: ["py.module"],
        quiz: [
          { kind: "choice", q: "from math import sqrt 로 불러왔을 때 25의 제곱근을 구하는 바른 코드는?", options: ["math.sqrt(25)", "sqrt(25)", "math(sqrt(25))", "import sqrt(25)"], answer: 1, explain: "from 모듈 import 이름 으로 꺼낸 이름은 모듈 이름 없이 바로 씁니다. math 라는 이름은 불러오지 않았으므로 math.sqrt 는 NameError가 납니다." },
          { kind: "ox", q: "datetime, math, os 같은 표준 라이브러리는 pip install 로 먼저 설치해야 쓸 수 있다.", answer: false, explain: "표준 라이브러리는 파이썬을 설치할 때 함께 들어 있어 import만 하면 됩니다. pip 설치가 필요한 것은 numpy · pandas 같은 외부 라이브러리입니다." },
        ] },
      { id: "pb-13-2", title: "datetime: 날짜와 시간 계산하기", minutes: 20, concepts: ["py.datetime"],
        quiz: [
          { kind: "choice", q: "CSV에서 읽은 문자열 \"2026-11-07\" 을 날짜 계산이 되는 datetime으로 바꾸는 코드는?", options: ["datetime.strftime(\"2026-11-07\", \"%Y-%m-%d\")", "datetime.strptime(\"2026-11-07\", \"%Y-%m-%d\")", "datetime(\"2026-11-07\")", "str(\"2026-11-07\")"], answer: 1, explain: "문자열 → 날짜는 strptime(p = parse, 읽어 내기), 날짜 → 문자열은 strftime(f = format)입니다." },
          { kind: "write", q: "made 에 timedelta를 더해 30일 뒤 날짜를 '%Y-%m-%d' 모양으로 출력하는 코드를 작성하세요.", given: "from datetime import datetime, timedelta\nmade = datetime(2026, 11, 7)", expect: "2026-12-07", must: ["timedelta\\(", "strftime\\("], solution: "from datetime import datetime, timedelta\nmade = datetime(2026, 11, 7)\nprint((made + timedelta(days=30)).strftime('%Y-%m-%d'))", explain: "datetime + timedelta(days=30) 은 30일 뒤 datetime입니다. 월이 바뀌는 것도 알아서 처리합니다. strftime으로 원하는 모양의 문자열을 만듭니다." },
        ] },
      { id: "pb-13-3", title: "math와 random: 계산 도구와 난수", minutes: 20, concepts: ["py.math", "py.random"],
        quiz: [
          { kind: "choice", q: "math.floor(-2.5) 의 결과는?", options: ["-2", "-3", "-2.5", "2"], answer: 1, explain: "floor(내림)는 수직선에서 더 작은 쪽(왼쪽)으로 갑니다. -2.5보다 작은 정수 중 가장 가까운 것은 -3입니다. 0 쪽으로 자르는 math.trunc(-2.5)는 -2입니다." },
          { kind: "ox", q: "random.seed(42) 로 고정한 뒤 random.randint(1, 5) 를 다섯 번 뽑으면, 다시 seed(42)를 하고 뽑아도 같은 순서로 나온다.", answer: true, explain: "seed는 난수 목록의 시작 번호입니다. 번호가 같으면 같은 난수가 같은 순서로 다시 나와 결과를 재현할 수 있습니다." },
        ] },
      { id: "pb-13-4", title: "os: 폴더와 파일 경로 다루기", minutes: 20, concepts: ["py.os"],
        quiz: [
          { kind: "choice", q: "이미 있는 logs 폴더를 os.makedirs(\"logs\") 로 한 번 더 만들면 어떤 에러가 날까요?", options: ["FileNotFoundError", "FileExistsError", "PermissionError", "에러 없이 지나간다"], answer: 1, explain: "이미 있는 폴더를 또 만들려 하면 FileExistsError가 납니다. 있어도 괜찮게 하려면 os.makedirs(\"logs\", exist_ok=True) 로 씁니다." },
        ] },
    ] },

  // ── 데이터 분석 (NumPy · pandas) ──────────────────────────
  { id: "da-01", track: "python-da", title: "NumPy 배열과 연산", summary: "배열 연산 · 만들기 · 자료형, 불리언 인덱싱, np.where, 정렬과 세기", unit: 10, level: "기본",
    concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
    lessons: [
      // 라이브러리 소개(PART 첫 페이지): 퀴즈 없이 읽고 '다 읽었어요'로 완료
      { id: "da-01-0", title: "NumPy 소개: 숫자를 한꺼번에 계산하는 도구", minutes: 10, concepts: ["np.array"] },
      { id: "da-01-1", title: "반복문 없이 배열을 한 번에 계산하기", minutes: 25, concepts: ["np.array", "np.stats", "np.bool-index", "np.axis"],
      quiz: [
        { kind: "write", q: "반복문 없이 a의 모든 원소에 2를 곱한 배열을 출력하는 코드를 작성하세요.", given: "import numpy as np\na = np.array([1, 2, 3])", expect: ["[2 4 6]"], must: ["a\\s*\\*\\s*2|2\\s*\\*\\s*a"], solution: "import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)", explain: "배열에 숫자를 곱하면 모든 원소에 적용됩니다. 리스트의 [1,2,3]*2와 다릅니다." },
        { kind: "choice", q: "2차원 배열에서 열(세로) 방향으로 합을 구해 열마다 값 하나씩 얻으려면?", options: ["arr.sum()", "arr.sum(axis=0)", "arr.sum(axis=1)", "arr.sum(axis=2)"], answer: 1, explain: "axis=0은 행을 따라 접어 열별 결과를 남깁니다." },
      ] },
      { id: "da-01-2", title: "배열 만들기와 자료형", minutes: 20, concepts: ["np.array"],
      quiz: [
        { kind: "write", q: "10.0부터 10.5까지 끝을 포함해 값 6개를 같은 간격으로 만든 배열 spec을 출력하는 코드를 작성하세요.", given: "import numpy as np", expect: ["[10.  10.1 10.2 10.3 10.4 10.5]"], must: ["linspace"], solution: "import numpy as np\nspec = np.linspace(10.0, 10.5, 6)\nprint(spec)", explain: "개수를 정할 때는 linspace를 씁니다. 끝 값 10.5도 들어갑니다." },
        { kind: "choice", q: "np.array([9.7, 10.2, 10.6]).astype(int)의 결과는?", options: ["[10 10 11]", "[9 10 10]", "[9.7 10.2 10.6]", "에러가 난다"], answer: 1, explain: "astype(int)는 소수점 아래를 버립니다. 반올림하려면 np.round 후 astype을 씁니다." },
      ] },
      { id: "da-01-3", title: "조건으로 바꾸고 세기", minutes: 20, concepts: ["np.bool-index", "np.stats"],
      quiz: [
        { kind: "write", q: "size가 9.5 이상 10.5 이하면 'OK', 아니면 'NG'인 배열을 np.where로 만들어 리스트로 출력하세요.", given: "import numpy as np\nsize = np.array([10.1, 9.2, 10.4, 10.8])", expect: "['OK', 'NG', 'OK', 'NG']", must: ["np\\.where"], solution: "import numpy as np\nsize = np.array([10.1, 9.2, 10.4, 10.8])\nlabel = np.where((size >= 9.5) & (size <= 10.5), 'OK', 'NG')\nprint(label.tolist())", explain: "np.where(조건, 참일 때, 거짓일 때)는 값마다 둘 중 하나를 고릅니다." },
        { kind: "choice", q: "rate = np.array([1.2, 3.5, 0.8])일 때 rate.argsort()의 결과는?", options: ["[0.8 1.2 3.5]", "[2 0 1]", "[1 0 2]", "[0 1 2]"], answer: 1, explain: "argsort는 값이 아니라 작은 값부터의 원래 위치를 줍니다. 0.8은 2번, 1.2는 0번, 3.5는 1번입니다." },
      ] },
    ] },
  { id: "da-02", track: "python-da", title: "인덱싱과 브로드캐스팅", summary: "2차원 인덱싱, 브로드캐스팅, axis 집계와 표준화, reshape와 이어 붙이기", unit: 23, level: "기본",
    concepts: ["np.broadcast", "np.axis"],
    lessons: [{ id: "da-02-1", title: "모양이 다른 배열끼리 계산하는 규칙", minutes: 25, concepts: ["np.broadcast", "np.axis"],
      quiz: [
        { kind: "write", q: "a에서 첫 행의 마지막 두 값을 리스트로 출력하는 코드를 작성하세요.", given: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])", expect: "[2, 3]", must: ["a\\[\\s*0\\s*,\\s*1\\s*:\\s*\\]"], solution: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(a[0, 1:].tolist())", explain: "a[0, 1:]은 0번 행의 1번 열부터 끝까지입니다." },
        { kind: "choice", q: "(4, 3) 배열에서 (3,) 배열을 빼면 어떻게 계산될까?", options: ["행마다 같은 3개 값을 뺀다", "열마다 같은 4개 값을 뺀다", "에러가 난다", "첫 행만 계산된다"], answer: 0, explain: "뒤 차원 3이 같으므로 (3,)이 4행으로 늘어나 각 행에서 빠집니다." },
      ] },
      { id: "da-02-2", title: "2차원 집계와 표준화", minutes: 25, concepts: ["np.axis", "np.broadcast"],
      quiz: [
        { kind: "write", q: "bad는 로트(행) × 센서(열) 이탈 여부 표입니다. 로트마다 하나라도 이탈했는지 리스트로 출력하세요.", given: "import numpy as np\nbad = np.array([[False, False], [True, False], [False, True]])", expect: "[False, True, True]", must: ["any\\(\\s*axis\\s*=\\s*1\\s*\\)"], solution: "import numpy as np\nbad = np.array([[False, False], [True, False], [False, True]])\nprint(bad.any(axis=1).tolist())", explain: "행마다 답 하나가 필요하니 axis=1로 접습니다." },
        { kind: "ox", q: "온도(℃)의 표준편차가 4.9이고 압력(MPa)의 표준편차가 0.06이면, 온도가 압력보다 더 많이 흔들린다고 말할 수 있다.", answer: false, explain: "단위가 달라 숫자 크기를 비교할 수 없습니다. z-score처럼 같은 잣대로 바꾼 뒤 비교합니다." },
      ] },
      { id: "da-02-3", title: "배열 모양 바꾸기", minutes: 20, concepts: ["np.array"],
      quiz: [
        { kind: "write", q: "값 12개인 temp를 3행 4열로 바꾼 뒤 행마다 평균을 리스트로 출력하세요.", given: "import numpy as np\ntemp = np.arange(12)", expect: "[1.5, 5.5, 9.5]", must: ["reshape"], solution: "import numpy as np\ntemp = np.arange(12)\nprint(temp.reshape(3, 4).mean(axis=1).tolist())", explain: "reshape(3, 4)는 왼쪽 위부터 행을 따라 채웁니다. 첫 행은 0~3이라 평균 1.5입니다." },
        { kind: "choice", q: "data = np.array([1, 2, 3]); part = data[:2]; part[0] = 0 을 실행한 뒤 data는?", options: ["[1 2 3]", "[0 2 3]", "[0 2]", "에러가 난다"], answer: 1, explain: "NumPy 슬라이싱 결과는 원본과 연결된 뷰라 원본도 바뀝니다. 따로 쓰려면 copy()를 붙입니다." },
      ] },
    ] },
  { id: "da-03", track: "python-da", title: "pandas Series · DataFrame", summary: "read_csv, describe, 표 만들기, 열 추가 · 이름 변경 · 삭제, 인덱스", unit: 24, level: "기본",
    concepts: ["pd.dataframe"],
    lessons: [
      // 라이브러리 소개(PART 첫 페이지): 퀴즈 없이 읽고 '다 읽었어요'로 완료
      { id: "da-03-0", title: "pandas 소개: 표를 코드로 다루는 도구", minutes: 10, concepts: ["pd.dataframe"] },
      { id: "da-03-1", title: "표 데이터를 불러와 첫인상 잡기", minutes: 25, concepts: ["pd.dataframe"],
      quiz: [
        { kind: "write", q: "df의 qty 열 합계를 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "2110", must: ["\\[\\s*['\"]qty['\"]\\s*\\]"], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df['qty'].sum())", explain: "df['qty']는 Series이고 sum()으로 합계를 냅니다." },
        { kind: "ox", q: "df.head()는 기본으로 처음 5행을 보여 준다.", answer: true, explain: "개수를 바꾸려면 head(10)처럼 숫자를 넣습니다." },
      ] },
      { id: "da-03-2", title: "DataFrame 만들고 열 다루기", minutes: 25, concepts: ["pd.dataframe"],
      quiz: [
        { kind: "write", q: "df의 qty 열 이름을 produced로 바꾼 표를 df2에 담고, df2의 열 이름을 리스트로 출력하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'lot': ['L01', 'L02'], 'qty': [500, 480]})", expect: "['lot', 'produced']", must: ["rename"], solution: "import pandas as pd\ndf = pd.DataFrame({'lot': ['L01', 'L02'], 'qty': [500, 480]})\ndf2 = df.rename(columns={'qty': 'produced'})\nprint(df2.columns.tolist())", explain: "rename(columns={옛: 새})는 새 표를 돌려주므로 변수에 담아야 합니다." },
        { kind: "ox", q: "df.drop(columns=['memo'])만 실행하면 df에서 memo 열이 사라진다.", answer: false, explain: "drop은 새 표를 돌려주고 원본은 그대로입니다. df = df.drop(...)처럼 다시 담아야 합니다." },
      ] },
      { id: "da-03-3", title: "인덱스 이해하기", minutes: 20, concepts: ["pd.dataframe"],
      quiz: [
        { kind: "choice", q: "mon = pd.Series({'A': 1, 'B': 2}), tue = pd.Series({'B': 3, 'C': 4})일 때 mon + tue의 A 값은?", options: ["1", "4", "NaN", "에러가 난다"], answer: 2, explain: "Series 연산은 이름표끼리 맞춰지고, 짝이 없는 A는 NaN입니다. 0으로 보려면 add(fill_value=0)을 씁니다." },
        { kind: "write", q: "mon과 tue를 더하되 없는 쪽은 0으로 보고 더한 합계 전체(숫자 하나)를 출력하세요.", given: "import pandas as pd\nmon = pd.Series({'A': 520, 'B': 480})\ntue = pd.Series({'B': 500, 'C': 300})", expect: ["1800.0", "1800"], must: ["fill_value"], solution: "import pandas as pd\nmon = pd.Series({'A': 520, 'B': 480})\ntue = pd.Series({'B': 500, 'C': 300})\nprint(mon.add(tue, fill_value=0).sum())", explain: "add(tue, fill_value=0)이면 A 520, B 980, C 300이 되어 합계 1800입니다." },
      ] },
    ] },
  { id: "da-04", track: "python-da", title: "선택과 필터", summary: "loc, iloc, 조건 필터, 문자열 · 범위 · 결측 조건, np.where · np.select 라벨", unit: 25, level: "기본",
    concepts: ["pd.select"],
    lessons: [{ id: "da-04-1", title: "원하는 행과 열만 골라내기", minutes: 25, concepts: ["pd.select"],
      quiz: [
        { kind: "write", q: "df에서 line이 'A'인 행의 qty를 리스트로 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "[500, 520]", must: ["==\\s*['\"]A['\"]"], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df.loc[df['line'] == 'A', 'qty'].tolist())", explain: "df.loc[조건, '열'].tolist()" },
        { kind: "choice", q: "iloc[0:2]가 선택하는 행은?", options: ["0, 1번", "0, 1, 2번", "1, 2번", "라벨이 0~2인 행"], answer: 0, explain: "iloc 슬라이싱은 파이썬 리스트처럼 끝 번호를 포함하지 않습니다." },
      ] },
      { id: "da-04-2", title: "문자열 · 범위 · 결측 조건", minutes: 25, concepts: ["pd.select"],
      quiz: [
        { kind: "write", q: "memo에 대소문자 상관없이 'leak'가 들어 있는 행의 개수를 출력하세요. 빈칸은 빼고 셉니다.", given: "import pandas as pd\nmemo = pd.Series(['Leak found', 'no issue', None, 'LEAK suspected'])", expect: "2", must: ["case\\s*=\\s*False", "na\\s*=\\s*False"], solution: "import pandas as pd\nmemo = pd.Series(['Leak found', 'no issue', None, 'LEAK suspected'])\nprint(memo.str.contains('leak', case=False, na=False).sum())", explain: "사람이 입력한 열에는 case=False와 na=False를 함께 붙입니다." },
        { kind: "choice", q: "age 열이 비어 있는 행을 고르는 코드로 옳은 것은?", options: ["df[df['age'] == None]", "df[df['age'] == np.nan]", "df[df['age'].isna()]", "df[df['age'] == '']"], answer: 2, explain: "NaN은 자기 자신과도 같지 않아서 ==로는 찾을 수 없습니다. isna()를 씁니다." },
      ] },
      { id: "da-04-3", title: "필터 결과로 새 열 만들기", minutes: 25, concepts: ["pd.select"],
      quiz: [
        { kind: "write", q: "np.select로 pct가 20 이상이면 'HIGH', 15 이상이면 'MID', 나머지는 'LOW'인 라벨을 만들어 리스트로 출력하세요.", given: "import numpy as np\nimport pandas as pd\npct = pd.Series([22.0, 16.5, 9.0])", expect: "['HIGH', 'MID', 'LOW']", must: ["np\\.select"], solution: "import numpy as np\nimport pandas as pd\npct = pd.Series([22.0, 16.5, 9.0])\nlabel = np.select([pct >= 20, pct >= 15], ['HIGH', 'MID'], default='LOW')\nprint(label.tolist())", explain: "np.select는 위 조건부터 차례로 보고 처음 True인 값을 고릅니다." },
        { kind: "choice", q: "원본 df에서 qty가 500 미만인 행의 status를 'LOW'로 바꾸는 코드는?", options: ["df[df['qty'] < 500]['status'] = 'LOW'", "df.loc[df['qty'] < 500, 'status'] = 'LOW'", "df[df['qty'] < 500].copy()['status'] = 'LOW'", "df['status'][df['qty'] < 500] == 'LOW'"], answer: 1, explain: "loc[조건, 열]로 행과 열을 한 번에 지정해야 원본이 바뀝니다." },
        { kind: "ox", q: "np.select에 넣는 조건 리스트는 순서를 바꿔도 결과가 같다.", answer: false, explain: "위에서부터 처음 True인 조건을 쓰므로, 겹치는 조건은 순서에 따라 결과가 달라집니다." },
      ] },
    ] },
  { id: "da-05", track: "python-da", title: "결측치와 전처리", summary: "결측 처리, 형변환, 문자열 열 나누기 · 숫자 뽑기, 이상치 · 구간 · 중복", unit: 26, level: "기본",
    concepts: ["pd.missing"],
    lessons: [{ id: "da-05-1", title: "빈칸과 지저분한 값 정리하기", minutes: 30, concepts: ["pd.missing"],
      quiz: [
        { kind: "write", q: "s의 결측값을 0으로 채운 뒤 합계를 출력하는 코드를 작성하세요.", given: "import numpy as np\nimport pandas as pd\ns = pd.Series([4.0, np.nan, 5.0])", expect: "9.0", must: ["fillna\\("], solution: "import numpy as np\nimport pandas as pd\ns = pd.Series([4.0, np.nan, 5.0])\nprint(s.fillna(0).sum())", explain: "fillna(0)로 채운 뒤 sum()" },
        { kind: "ox", q: "pd.Series(['1,200']).astype(int)는 바로 정수로 바뀐다.", answer: false, explain: "쉼표가 있어 ValueError가 납니다. str.replace(',', '')로 먼저 지우세요." },
      ] },
      { id: "da-05-2", title: "문자열 열 깊게 정리하기", minutes: 25, concepts: ["pd.missing"],
      quiz: [
        { kind: "write", q: "lot 열을 '-' 기준으로 나눠 두 번째 조각의 첫 글자(라인)를 리스트로 출력하세요.", given: "import pandas as pd\nlot = pd.Series(['L240915-A03', 'L240915-B11', 'L240916-A07'])", expect: "['A', 'B', 'A']", must: ["str\\.split"], solution: "import pandas as pd\nlot = pd.Series(['L240915-A03', 'L240915-B11', 'L240916-A07'])\nprint(lot.str.split('-').str[1].str[0].tolist())", explain: "str.split('-').str[1]로 두 번째 조각을 꺼내고, .str[0]으로 첫 글자를 꺼냅니다." },
        { kind: "ox", q: "pd.to_numeric(s, errors='coerce')를 쓰면 숫자로 바꾸지 못한 값의 목록을 따로 확인하지 않아도 된다.", answer: false, explain: "coerce는 실패한 값을 조용히 NaN으로 바꿉니다. '1.2k'처럼 살릴 수 있는 값이 섞였을 수 있으니 실패 목록을 꼭 확인합니다." },
      ] },
      { id: "da-05-3", title: "이상치 · 구간 · 중복", minutes: 25, concepts: ["pd.missing"],
      quiz: [
        { kind: "write", q: "IQR 규칙의 위 경계(Q3 + 1.5 × IQR)보다 큰 값의 개수를 출력하세요.", given: "import pandas as pd\ns = pd.Series([10, 12, 11, 13, 12, 11, 30, 12])", expect: "1", must: ["quantile"], solution: "import pandas as pd\ns = pd.Series([10, 12, 11, 13, 12, 11, 30, 12])\nq1, q3 = s.quantile([0.25, 0.75])\nhi = q3 + 1.5 * (q3 - q1)\nprint((s > hi).sum())", explain: "Q1 11, Q3 12.25라 IQR 1.25, 위 경계 14.125입니다. 30 하나만 넘습니다." },
        { kind: "choice", q: "데이터 개수가 같도록 4구간으로 나누려면?", options: ["pd.cut(s, 4)", "pd.qcut(s, 4)", "s.clip(4)", "s.groupby(4)"], answer: 1, explain: "qcut은 개수가 같도록, cut은 정한 경계(또는 같은 폭)로 나눕니다." },
        { kind: "choice", q: "재측정 기록에서 로트마다 가장 최근 측정만 남기는 순서로 옳은 것은?", options: ["drop_duplicates(subset='lot', keep='last')만 쓴다", "시각으로 정렬한 뒤 drop_duplicates(subset='lot', keep='last')", "drop_duplicates()로 완전히 같은 행만 지운다", "groupby('lot').sum()"], answer: 1, explain: "keep='last'는 표에 들어온 순서상 마지막입니다. 시각으로 먼저 정렬해야 최신 값이 남습니다." },
      ] },
    ] },
  { id: "da-06", track: "python-da", title: "groupby와 pivot_table", summary: "agg, transform, 그룹 필터 · 순위, pivot_table, melt · stack", unit: 27, level: "실무",
    concepts: ["pd.groupby", "pd.pivot"],
    lessons: [{ id: "da-06-1", title: "나누고, 집계하고, 합치기", minutes: 30, concepts: ["pd.groupby", "pd.pivot"],
      quiz: [
        { kind: "write", q: "groupby로 line별 qty 합계를 딕셔너리로 출력하는 코드를 작성하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})", expect: "{'A': 1020, 'B': 480, 'C': 610}", must: ["groupby\\("], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C'], 'qty': [500, 480, 520, 610]})\nprint(df.groupby('line')['qty'].sum().to_dict())", explain: "groupby('line')['qty'].sum()" },
        { kind: "choice", q: "groupby 결과를 원래 행 수 그대로 돌려줘 비중 계산에 쓰는 메서드는?", options: ["agg", "transform", "apply", "pivot"], answer: 1, explain: "transform은 그룹 집계값을 각 행에 붙여 줍니다." },
      ] },
      { id: "da-06-2", title: "그룹 안에서 고르고 순위 매기기", minutes: 25, concepts: ["pd.groupby"],
      quiz: [
        { kind: "write", q: "line별 ng의 최대 − 최소 폭을 lambda로 집계해 리스트로 출력하세요.", given: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'A', 'B', 'B'], 'ng': [3, 8, 2, 9]})", expect: "[5, 7]", must: ["lambda"], solution: "import pandas as pd\ndf = pd.DataFrame({'line': ['A', 'A', 'B', 'B'], 'ng': [3, 8, 2, 9]})\nprint(df.groupby('line')['ng'].agg(lambda s: s.max() - s.min()).tolist())", explain: "agg에는 그룹마다 Series를 받아 값 하나를 돌려주는 함수를 넣을 수 있습니다." },
        { kind: "choice", q: "그룹 크기가 30 이상인 그룹의 행만 남기는 코드는?", options: ["df.groupby('g').agg(lambda d: len(d) >= 30)", "df.groupby('g').filter(lambda d: len(d) >= 30)", "df.groupby('g').transform(lambda d: len(d) >= 30)", "df.groupby('g').head(30)"], answer: 1, explain: "filter는 함수가 True인 그룹의 행을 원래 모양 그대로 남깁니다." },
      ] },
      { id: "da-06-3", title: "넓은 표와 긴 표", minutes: 25, concepts: ["pd.pivot"],
      quiz: [
        { kind: "write", q: "wide를 melt로 긴 표로 바꾼 뒤 행 수를 출력하세요. lot은 그대로 둡니다.", given: "import pandas as pd\nwide = pd.DataFrame({'lot': ['L01', 'L02'], 'pos1': [10.0, 10.1], 'pos2': [9.9, 10.0], 'pos3': [10.1, 10.2]})", expect: "6", must: ["melt"], solution: "import pandas as pd\nwide = pd.DataFrame({'lot': ['L01', 'L02'], 'pos1': [10.0, 10.1], 'pos2': [9.9, 10.0], 'pos3': [10.1, 10.2]})\nlong = wide.melt(id_vars='lot', var_name='pos', value_name='size')\nprint(len(long))", explain: "행 수는 원래 행 수 2 × 녹인 열 3 = 6입니다." },
        { kind: "ox", q: "평균 pivot_table에서 손님이 없어 비어 있는 칸은 fill_value=0으로 채우는 것이 정확하다.", answer: false, explain: "평균 0은 '값이 0'으로 읽힙니다. 개수 · 합계 표의 빈칸은 0이 맞지만, 평균 표는 NaN으로 둡니다." },
      ] },
    ] },
  { id: "da-07", track: "python-da", title: "merge와 concat", summary: "키 결합, 행 증가 함정, 여러 표 단계 결합, 여러 파일 이어 붙이기", unit: 28, level: "실무",
    concepts: ["pd.merge"],
    lessons: [{ id: "da-07-1", title: "두 표를 키로 잇고 위아래로 붙이기", minutes: 30, concepts: ["pd.merge"],
      quiz: [
        { kind: "write", q: "a와 b를 key로 left 결합한 결과의 행 수를 출력하는 코드를 작성하세요.", given: "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3]})\nb = pd.DataFrame({'key': [2, 3, 4], 'v': ['x', 'y', 'z']})", expect: "3", must: ["how\\s*=\\s*['\"]left['\"]"], solution: "import pandas as pd\na = pd.DataFrame({'key': [1, 2, 3]})\nb = pd.DataFrame({'key': [2, 3, 4], 'v': ['x', 'y', 'z']})\nprint(len(pd.merge(a, b, on='key', how='left')))", explain: "left는 왼쪽 행 3개를 모두 남깁니다." },
        { kind: "ox", q: "merge 후 행 수가 늘었다면 오른쪽 표에 키 중복이 있는지 먼저 의심해야 한다.", answer: true, explain: "1:N, N:M 결합에서는 행이 복제됩니다." },
      ] },
      { id: "da-07-2", title: "여러 표 단계적으로 잇기", minutes: 25, concepts: ["pd.merge"],
      quiz: [
        { kind: "write", q: "plants의 plant_id를 정수로 바꾼 뒤 step1과 left 결합하고, plant 열을 리스트로 출력하세요.", given: "import pandas as pd\nstep1 = pd.DataFrame({'order_id': [1, 2], 'plant_id': [101, 102]})\nplants = pd.DataFrame({'plant_id': ['101', '102'], 'plant': ['화성', '구미']})", expect: "['화성', '구미']", must: ["astype\\(\\s*int\\s*\\)", "merge"], solution: "import pandas as pd\nstep1 = pd.DataFrame({'order_id': [1, 2], 'plant_id': [101, 102]})\nplants = pd.DataFrame({'plant_id': ['101', '102'], 'plant': ['화성', '구미']})\nplants['plant_id'] = plants['plant_id'].astype(int)\nprint(step1.merge(plants, on='plant_id', how='left')['plant'].tolist())", explain: "정수 101과 문자열 '101'은 다른 키입니다. 자료형을 먼저 맞춥니다." },
        { kind: "choice", q: "주문(여러 건) 표에 제품(제품당 한 행) 표를 붙일 때 오른쪽 키 중복을 미리 막는 옵션은?", options: ["validate='one_to_many'", "validate='many_to_one'", "how='inner'", "indicator=True"], answer: 1, explain: "왼쪽은 여러 번, 오른쪽은 한 번씩 나오는 관계라 many_to_one입니다. 오른쪽 키가 겹치면 바로 에러가 납니다." },
      ] },
      { id: "da-07-3", title: "여러 파일 이어 붙이기", minutes: 25, concepts: ["pd.merge"],
      quiz: [
        { kind: "write", q: "a와 b를 concat하기 전에 b의 defect 열 이름을 ng로 맞추고, 합친 표의 ng 합계를 출력하세요.", given: "import pandas as pd\na = pd.DataFrame({'lot': ['A01'], 'ng': [6]})\nb = pd.DataFrame({'lot': ['C01'], 'defect': [4]})", expect: ["10", "10.0"], must: ["rename", "concat"], solution: "import pandas as pd\na = pd.DataFrame({'lot': ['A01'], 'ng': [6]})\nb = pd.DataFrame({'lot': ['C01'], 'defect': [4]})\nb = b.rename(columns={'defect': 'ng'})\nprint(pd.concat([a, b], ignore_index=True)['ng'].sum())", explain: "열 이름이 다르면 concat 결과에 NaN 열이 생깁니다. 먼저 이름을 맞춥니다." },
        { kind: "ox", q: "파일이 많을 때는 반복문 안에서 매번 concat하는 것보다, 읽은 표를 리스트에 모아 마지막에 한 번 concat하는 편이 낫다.", answer: true, explain: "매번 concat하면 표를 계속 새로 만들어 느려집니다." },
      ] },
    ] },
  { id: "da-08", track: "python-da", title: "시계열", summary: "to_datetime, resample, rolling, 날짜 계산, 센서 결측 · 튀는 값 정리", unit: 29, level: "실무",
    concepts: ["pd.time"],
    lessons: [{ id: "da-08-1", title: "시간 순서가 있는 데이터 다루기", minutes: 30, concepts: ["pd.time"],
      quiz: [
        { kind: "write", q: "pd.to_datetime으로 '2026-11-04 21:30'의 시(hour)를 출력하는 코드를 작성하세요.", expect: "21", must: ["to_datetime\\("], solution: "import pandas as pd\nprint(pd.to_datetime('2026-11-04 21:30').hour)", explain: "Timestamp의 .hour" },
        { kind: "choice", q: "1시간 단위 데이터를 하루 평균으로 바꾸는 코드는?", options: ["s.rolling(24).mean()", "s.resample('D').mean()", "s.shift(24)", "s.groupby(24).mean()"], answer: 1, explain: "resample('D')는 날짜 단위로 묶습니다." },
      ] },
      { id: "da-08-2", title: "날짜 계산과 기간 자르기", minutes: 25, concepts: ["pd.time"],
      quiz: [
        { kind: "write", q: "made에 유효기간 30일을 더한 날짜가 today로부터 며칠 남았는지 정수로 출력하세요.", given: "import pandas as pd\nmade = pd.to_datetime('2026-10-20')\ntoday = pd.to_datetime('2026-11-06')", expect: "13", must: ["Timedelta"], solution: "import pandas as pd\nmade = pd.to_datetime('2026-10-20')\ntoday = pd.to_datetime('2026-11-06')\nexpire = made + pd.Timedelta(days=30)\nprint((expire - today).days)", explain: "날짜 + Timedelta = 날짜, 날짜 − 날짜 = Timedelta이고 .days로 일수를 꺼냅니다." },
        { kind: "choice", q: "날짜 인덱스 Series s에서 2026년 10월 데이터만 고르는 코드는?", options: ["s['10']", "s.loc['2026-10']", "s.iloc['2026-10']", "s.resample('2026-10')"], answer: 1, explain: "날짜 인덱스는 loc에 '연-월' 문자열을 넣으면 그 달 전체를 고릅니다." },
      ] },
      { id: "da-08-3", title: "센서 시계열 다듬기", minutes: 25, concepts: ["pd.time"],
      quiz: [
        { kind: "write", q: "10분 간격이어야 하는 temp에서 빠진 시각을 asfreq로 드러내고, 빠진 개수를 출력하세요.", given: "import pandas as pd\nt = pd.to_datetime(['2026-11-06 08:00', '2026-11-06 08:10', '2026-11-06 08:40'])\ntemp = pd.Series([201.2, 201.5, 202.3], index=t)", expect: "2", must: ["asfreq"], solution: "import pandas as pd\nt = pd.to_datetime(['2026-11-06 08:00', '2026-11-06 08:10', '2026-11-06 08:40'])\ntemp = pd.Series([201.2, 201.5, 202.3], index=t)\nprint(temp.asfreq('10min').isna().sum())", explain: "빠진 시각은 행 자체가 없어 isna로 못 찾습니다. asfreq로 시간표를 만들면 08:20, 08:30이 NaN이 됩니다." },
        { kind: "choice", q: "온도처럼 서서히 변하는 값의 빈칸을 채울 때 더 자연스러운 방법은?", options: ["ffill()", "interpolate()", "fillna(0)", "dropna()"], answer: 1, explain: "interpolate는 앞뒤 값을 직선으로 이어 흐름을 살립니다. ffill은 상태 값에 어울립니다." },
        { kind: "ox", q: "한 점만 튄 값을 diff().abs()로 찾으면 튄 시각 한 곳만 걸린다.", answer: false, explain: "올라갈 때와 돌아올 때 변화량이 두 번 커집니다. 한 점짜리 튐은 이동 중앙값과 비교하면 정확히 찾습니다." },
      ] },
    ] },
  // ── 데이터 시각화 (matplotlib · seaborn) ─ 분석 목적별(비교 · 추이 · 분포 · 관계 · 구성) 구성. 기획안: docs/lesson-plans/viz.md ──
  { id: "da-09", track: "python-viz", dir: "python-da", title: "matplotlib 기본 구조", summary: "대표 차트 갤러리, 그래프 뼈대(fig · ax), 그리는 순서, 서브플롯 배치와 꾸미기", level: "기본",
    concepts: ["mpl.basic", "mpl.layout"],
    lessons: [
      // 라이브러리 소개(PART 첫 페이지): 퀴즈 없이 읽고 '다 읽었어요'로 완료
      { id: "da-09-0", title: "matplotlib 소개: 파이썬 그래프의 바탕", minutes: 10, concepts: ["mpl.basic"] },
      // 차트 갤러리(PART 두 번째 페이지): 대표 차트 카드(::chart) + 질문별 실행 예제, 퀴즈 없음
      { id: "da-09-5", title: "matplotlib 차트 갤러리: 자주 쓰는 차트 한눈에", minutes: 15, concepts: ["mpl.basic"] },
      { id: "da-09-1", title: "그래프의 뼈대: fig와 ax", minutes: 15, concepts: ["mpl.basic"],
        quiz: [
          { kind: "write", q: "fig, ax를 만들고 ax.plot으로 [1, 4, 9]를 그린 뒤, 그려진 선의 개수를 출력하는 코드를 작성하세요.", given: "import matplotlib.pyplot as plt", expect: "1", must: ["\\.plot\\("], solution: "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.plot([1, 4, 9])\nprint(len(ax.lines))", explain: "ax.plot을 한 번 부르면 ax.lines에 선 하나가 생깁니다." },
          { kind: "choice", q: "matplotlib에서 Axes(ax)가 뜻하는 것은?", options: ["x축 하나", "도화지 위에 놓인 그래프 한 칸 전체", "그림 파일 전체", "범례 상자"], answer: 1, explain: "Figure가 도화지, Axes는 그 위의 그래프 한 칸입니다. 제목·축·선이 모두 ax 안에 그려집니다." },
        ] },
      { id: "da-09-4", title: "여러 그래프 배치와 다듬기", minutes: 18, concepts: ["mpl.layout"] },
    ] },
  { id: "da-10", track: "python-viz", dir: "python-da", title: "seaborn 기본 구조", summary: "함수 가족별 차트 갤러리, EDA 자동화 라이브러리, data · x · y · hue, 칸 단위 함수와 그림 단위 함수", level: "기본",
    concepts: ["sns.stat"],
    lessons: [
      // 라이브러리 소개(PART 첫 페이지): 퀴즈 없이 읽고 '다 읽었어요'로 완료
      { id: "da-10-0", title: "seaborn 소개: 표를 넘기면 통계 그래프가 나온다", minutes: 10, concepts: ["sns.stat"] },
      // 차트 갤러리 · EDA 자동화 라이브러리 소개: 퀴즈 없음. EDA 라이브러리는 브라우저에 설치가 안 되어 코드는 읽기 전용
      { id: "da-10-5", title: "seaborn 차트 갤러리: 함수 가족별 대표 차트", minutes: 18, concepts: ["sns.stat"] },
      { id: "da-10-6", title: "EDA 자동화 라이브러리: fasteda · YData Profiling · Sweetviz · PyGWalker", minutes: 15, concepts: ["sns.stat"] },
      { id: "da-10-1", title: "seaborn의 기본 구조: data · x · y · hue", minutes: 18, concepts: ["sns.stat"],
        quiz: [
          { kind: "write", q: "sns.countplot으로 df의 line별 개수를 그린 뒤, 막대 개수를 출력하는 코드를 작성하세요.", given: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C']})", expect: "3", must: ["countplot\\("], solution: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'line': ['A', 'B', 'A', 'C']})\nax = sns.countplot(data=df, x='line')\nprint(len(ax.patches))", explain: "범주 A, B, C마다 막대 하나입니다." },
          { kind: "choice", q: "새 도화지를 스스로 만들어서 ax=를 받지 않고, col=로 칸을 나누는 함수는?", options: ["histplot", "boxplot", "displot", "heatmap"], answer: 2, explain: "displot · catplot · relplot · pairplot 같은 그림 단위 함수는 새 도화지를 만듭니다. 칸 단위 함수(histplot 등)는 ax=로 자리를 정해 줍니다." },
        ] },
    ] },
  // 질문별 차트(PART 3~7): 질문(비교 · 추이 · 분포 · 관계 · 구성) = PART, 차트 하나 = DAY 하나. 레슨 md 이름(da-12-1 …)은 진도 기록 때문에 그대로 둔다.
  { id: "vz-01", track: "python-viz", dir: "python-da", title: "막대 그래프", summary: "세로 · 가로 막대와 정렬, 0에서 시작하는 축, countplot, 개수가 많다 ≠ 비율이 높다", level: "기본",
    concepts: ["viz.compare"],
    lessons: [
      { id: "da-12-1", title: "막대 그래프 읽기", minutes: 15, concepts: ["viz.compare"],
        quiz: [
          { kind: "choice", q: "두 공장의 합격률 막대 그래프에서 y축이 90%부터 시작한다. A 막대가 B 막대보다 3배 길어 보이고 실제 값은 A 99%, B 93%다. 맞는 해석은?", options: ["A가 B보다 합격률이 3배 높다", "A가 B보다 6%p 높다. 막대 길이 차이는 축을 90에서 잘라 과장된 것이다", "축과 상관없이 막대 길이 비율이 곧 값의 비율이다", "B 공장은 합격률이 매우 낮다"], answer: 1, explain: "막대는 길이로 값을 나타내므로 0에서 시작해야 합니다. 축을 자르면 작은 차이가 몇 배처럼 보입니다." },
          { kind: "ox", q: "막대 그래프에서 3등실 생존자 수(119명)가 2등실(87명)보다 많다는 사실이 확인되었는데, 이를 '3등실의 생존율도 2등실보다 높다'고 해석하는 게 옳다.", answer: false, explain: "막대는 생존자 수를 보여 줄 뿐이고, 수는 그룹 크기의 영향을 받습니다. 3등실은 491명, 2등실은 184명이라 생존율은 3등실 24%(119/491), 2등실 47%(87/184)로 오히려 2등실이 두 배 가까이 높습니다. 생존율을 비교하려면 비율 막대를 따로 그려야 합니다." },
        ] },
    ] },
  { id: "vz-02", track: "python-viz", dir: "python-da", title: "평균과 오차 막대", summary: "barplot 막대는 평균, 오차 막대 vs 표준편차 막대, 합계로 바꾸기", level: "기본",
    concepts: ["viz.compare"],
    lessons: [
      { id: "da-12-2", title: "평균과 오차 막대 읽기", minutes: 18, concepts: ["viz.compare"],
        quiz: [
          { kind: "ox", q: "sns.barplot의 막대 높이는 기본으로 그룹의 합계다.", answer: false, explain: "기본은 평균입니다. 합계를 그리려면 estimator=\"sum\"을 줍니다." },
          { kind: "choice", q: "두 그룹의 평균 막대에서 오차 막대(95% 신뢰 구간)가 크게 겹친다. 알맞은 해석은?", options: ["두 그룹의 평균은 확실히 다르다", "두 그룹의 평균이 다르다고 단정하기 어렵다", "두 그룹의 데이터 개수가 같다", "오차 막대는 최솟값과 최댓값이다"], answer: 1, explain: "신뢰 구간이 크게 겹치면 데이터를 다시 모았을 때 순서가 바뀔 수도 있습니다. 차이를 단정하지 않습니다." },
        ] },
    ] },
  { id: "vz-03", track: "python-viz", dir: "python-da", title: "묶음 막대 · 칸 나누기", summary: "기준이 둘이면 hue로 묶음 막대, 셋이면 catplot col=로 칸 나누기", level: "기본",
    concepts: ["viz.compare"],
    lessons: [
      { id: "da-12-3", title: "묶음 막대 · 칸 나누기 읽기", minutes: 15, concepts: ["viz.compare"],
        quiz: [
          { kind: "ox", q: "sns.barplot(x=\"class\", hue=\"sex\")로 그린 묶음 막대에서는 같은 등급 안의 여성 · 남성 비교가, 같은 성별끼리 등급을 비교하는 것보다 쉽다.", answer: true, explain: "hue로 나눈 쪽이 한 묶음 안에 나란히 서므로 묶음 안 비교가 쉽습니다. 다른 비교가 중요하면 x와 hue를 바꿉니다." },
        ] },
    ] },
  { id: "vz-04", track: "python-viz", dir: "python-da", title: "점 그래프", summary: "pointplot으로 평행 · 엇갈림 읽기, 범주가 많을 때 dot plot · 롤리팝", level: "기본",
    concepts: ["viz.compare"],
    lessons: [
      { id: "da-12-4", title: "점 그래프 읽기: pointplot · dot plot", minutes: 15, concepts: ["viz.compare"],
        quiz: [
          { kind: "choice", q: "종(Adelie · Chinstrap · Gentoo)별 평균 몸무게 pointplot에서 암컷 선과 수컷 선이 거의 평행하다. 맞는 해석은?", options: ["암수 차이가 종마다 크게 다르다", "종과 상관없이 수컷이 암컷보다 비슷한 만큼 무겁다", "성별은 몸무게와 관계없다", "종은 몸무게와 관계없다"], answer: 1, explain: "평행선은 한 기준의 효과가 다른 기준과 상관없이 일정하다는 뜻입니다. 선이 엇갈려야 '조건에 따라 효과가 다르다'고 말합니다." },
        ] },
    ] },
  { id: "vz-05", track: "python-viz", dir: "python-da", title: "선 그래프", summary: "추세 · 계절성 나눠 보기, y축 범위가 바꾸는 인상, 범주는 선으로 잇지 않기", level: "기본",
    concepts: ["viz.trend"],
    lessons: [
      { id: "da-13-1", title: "선 그래프 읽기", minutes: 18, concepts: ["viz.trend"],
        quiz: [
          { kind: "choice", q: "월별 매출 선 그래프가 매년 12월에 봉우리를 만들고, 봉우리 높이가 해마다 높아진다. 맞는 해석은?", options: ["계절성만 있고 추세는 없다", "추세만 있고 계절성은 없다", "매년 12월에 오르는 계절성과 해마다 늘어나는 추세가 함께 있다", "불규칙 변동이라 해석할 수 없다"], answer: 2, explain: "같은 간격으로 반복되는 봉우리는 계절성, 전체 수준이 올라가는 것은 추세입니다." },
          { kind: "ox", q: "x축이 '1등실 · 2등실 · 3등실'처럼 순서 없는 범주여도 점들을 선으로 이어 추이로 읽을 수 있다.", answer: false, explain: "선은 '이어지는 변화'를 뜻합니다. 순서가 없는 범주는 막대로 비교합니다." },
        ] },
    ] },
  { id: "vz-06", track: "python-viz", dir: "python-da", title: "이동평균 · 로그 축 · 기준선", summary: "이동평균으로 흔들림 걸러 내기, 비율 성장은 로그 축, 기준선과 목표 범위", level: "기본",
    concepts: ["viz.trend"],
    lessons: [
      { id: "da-13-2", title: "추세를 또렷하게: 이동평균 · 로그 축 · 기준선", minutes: 18, concepts: ["viz.trend"],
        quiz: [
          { kind: "choice", q: "7일 이동평균선이 오늘 막 아래로 꺾였다. 알맞은 해석은?", options: ["오늘 처음으로 값이 떨어졌다", "실제 변화는 며칠 전부터 시작됐을 수 있다", "이동평균은 미래를 예측한 값이다", "꺾인 것은 의미가 없다"], answer: 1, explain: "이동평균은 과거 N일을 평균하므로 실제 변화보다 늦게 반응합니다." },
          { kind: "ox", q: "로그 y축에서 선이 곧은 직선이면 매년 같은 개수(예: 100명)씩 늘어난 것이다.", answer: false, explain: "로그 축의 직선은 매년 같은 '비율(%)'로 늘었다는 뜻입니다. 같은 개수씩 늘면 일반 축에서 직선입니다." },
        ] },
    ] },
  { id: "vz-07", track: "python-viz", dir: "python-da", title: "여러 시계열", summary: "한 칸에 여러 선, 작은 여러 칸, 시작점 = 100 지수화, 달력형 히트맵", level: "기본",
    concepts: ["viz.trend"],
    lessons: [
      { id: "da-13-3", title: "여러 시계열 비교하기", minutes: 18, concepts: ["viz.trend"],
        quiz: [
          { kind: "choice", q: "1월 승객과 7월 승객을 첫해 = 100으로 지수화했더니 1960년에 두 선이 각각 372, 420이 됐다. 맞는 해석은?", options: ["1960년 7월 승객은 420명이다", "7월 승객이 1월보다 더 빠른 비율로 늘었다", "두 달의 실제 승객 수가 비슷하다", "1월 승객은 줄었다"], answer: 1, explain: "지수는 첫해 대비 몇 배인지를 나타냅니다. 원래 크기는 사라지고 증가 속도만 비교됩니다." },
        ] },
    ] },
  { id: "vz-08", track: "python-viz", dir: "python-da", title: "히스토그램", summary: "분포의 네 가지 모양, 긴 꼬리와 봉우리 두 개, bins와 비율", level: "기본",
    concepts: ["viz.dist"],
    lessons: [
      { id: "da-14-1", title: "히스토그램 읽기", minutes: 20, concepts: ["viz.dist"],
        quiz: [
          { kind: "choice", q: "소득 히스토그램이 왼쪽에 몰려 있고 오른쪽으로 긴 꼬리가 있다. '보통 사람의 소득'을 말할 때 알맞은 값은?", options: ["평균 (꼬리 때문에 더 정확하다)", "중앙값 (꼬리에 덜 끌려간다)", "최댓값", "가장 큰 bin의 개수"], answer: 1, explain: "오른쪽 꼬리 분포에서는 큰 값 몇 개가 평균을 끌어올립니다. 중앙값이 보통 값을 더 잘 나타냅니다." },
          { kind: "choice", q: "히스토그램에 봉우리가 두 개 보일 때 가장 먼저 의심할 것은?", options: ["데이터 입력 오류", "서로 다른 무리(그룹)가 섞여 있다", "평균이 정확하다", "bins가 너무 적다"], answer: 1, explain: "봉우리 두 개는 종 · 성별 · 공정처럼 다른 그룹이 섞여 있을 때 자주 생깁니다. hue로 나눠 확인합니다." },
          { kind: "ox", q: "bins 개수를 바꿔도 히스토그램의 모양은 항상 같다.", answer: false, explain: "bins에 따라 봉우리가 생기거나 사라질 수 있습니다. bins를 바꿔도 유지되는 모양만 믿습니다." },
        ] },
    ] },
  { id: "vz-09", track: "python-viz", dir: "python-da", title: "밀도 곡선 · 러그", summary: "KDE로 그룹 분포 겹쳐 보기, bw_adjust와 꼬리, 러그로 실제 위치 확인", level: "기본",
    concepts: ["viz.dist"],
    lessons: [
      { id: "da-14-2", title: "밀도 곡선(KDE) · 러그 읽기", minutes: 15, concepts: ["viz.dist"],
        quiz: [
          { kind: "ox", q: "나이 KDE 곡선이 0보다 작은 쪽까지 뻗어 있으므로 나이가 음수인 데이터가 있다.", answer: false, explain: "KDE는 데이터마다 언덕을 쌓아 양 끝에서도 곡선이 뻗습니다. 실제 범위는 러그나 최솟값으로 확인합니다." },
        ] },
    ] },
  { id: "vz-10", track: "python-viz", dir: "python-da", title: "ECDF", summary: "'이 값 이하가 몇 %', 중앙값 · 백분위를 누적 계단으로 읽기", level: "기본",
    concepts: ["viz.dist"],
    lessons: [
      { id: "da-14-5", title: "ECDF 읽기", minutes: 10, concepts: ["viz.dist"],
        quiz: [
          { kind: "choice", q: "ECDF 그래프에서 y = 0.5 가로선과 곡선이 만나는 x값은?", options: ["평균", "중앙값", "최빈값", "최댓값"], answer: 1, explain: "ECDF의 y는 '그 값 이하의 비율'입니다. 50%가 되는 지점이 중앙값입니다." },
        ] },
    ] },
  { id: "vz-11", track: "python-viz", dir: "python-da", title: "상자그림", summary: "상자의 부품(중앙값 · IQR · 이상치), 치우침 읽기, 그룹별 상자", level: "기본",
    concepts: ["viz.dist"],
    lessons: [
      { id: "da-14-3", title: "상자그림 읽기", minutes: 18, concepts: ["viz.dist"],
        quiz: [
          { kind: "choice", q: "상자그림에서 상자 안의 가운데 선이 뜻하는 것은?", options: ["평균", "중앙값", "최빈값", "최댓값"], answer: 1, explain: "가운데 선은 중앙값, 상자의 아래 · 위 끝은 Q1 · Q3(가운데 50%)입니다." },
          { kind: "ox", q: "상자가 더 큰 그룹은 데이터 개수도 더 많다.", answer: false, explain: "상자 높이(IQR)는 값이 퍼진 정도입니다. 개수는 상자에 나타나지 않으므로 n을 따로 적어 줍니다." },
          { kind: "choice", q: "봉우리가 두 개인 분포를 상자그림으로 그리면?", options: ["상자가 두 개로 나뉜다", "봉우리가 보이지 않고 평범한 상자로 그려진다", "이상치 점이 두 무리로 찍힌다", "그릴 수 없다"], answer: 1, explain: "상자그림은 다섯 숫자로 요약하므로 봉우리 개수를 보여 주지 못합니다. 바이올린이나 히스토그램으로 확인합니다." },
        ] },
    ] },
  { id: "vz-12", track: "python-viz", dir: "python-da", title: "바이올린", summary: "상자 + 밀도 곡선으로 봉우리까지, 폭을 개수로 읽지 않기", level: "기본",
    concepts: ["viz.dist"],
    lessons: [
      { id: "da-14-4", title: "바이올린 그래프 읽기", minutes: 12, concepts: ["viz.dist"],
        quiz: [
          { kind: "ox", q: "바이올린 두 개의 크기가 비슷하면 두 그룹의 데이터 개수도 비슷하다.", answer: false, explain: "바이올린은 그룹마다 넓이를 같게 맞춰 그립니다. 개수는 스트립 · 스웜이나 n 표시로 확인합니다." },
        ] },
    ] },
  { id: "vz-13", track: "python-viz", dir: "python-da", title: "스트립 · 스웜", summary: "값마다 점 하나, 개수까지 보이는 그래프, 상자 + 점 겹쳐 그리기", level: "기본",
    concepts: ["viz.dist"],
    lessons: [
      { id: "da-14-6", title: "스트립 · 스웜 읽기", minutes: 12, concepts: ["viz.dist"],
        quiz: [
          { kind: "choice", q: "그룹마다 데이터가 20개 정도일 때 분포를 가장 정직하게 보여 주는 그래프는?", options: ["바이올린", "밀도 곡선", "스트립 또는 스웜", "파이"], answer: 2, explain: "데이터가 적으면 매끈한 곡선 모양은 대부분 곡선이 만든 것입니다. 점을 다 찍는 것이 가장 정직합니다." },
        ] },
    ] },
  { id: "vz-14", track: "python-viz", dir: "python-da", title: "산점도", summary: "방향 · 모양 · 강도 · 튀는 점, 색 · 크기로 정보 얹기, 점이 겹칠 때", level: "실무",
    concepts: ["viz.relation"],
    lessons: [
      { id: "da-15-1", title: "산점도 읽기", minutes: 18, concepts: ["viz.relation"],
        quiz: [
          { kind: "choice", q: "점 1만 개를 기본 산점도로 그렸더니 가운데가 한 덩어리로 칠해졌다. 가장 먼저 할 일은?", options: ["점을 더 크게 그린다", "alpha(투명도)를 낮추고 점을 작게 그린다", "파이 그래프로 바꾼다", "데이터를 지운다"], answer: 1, explain: "점이 겹치면 빽빽한 곳과 드문 곳이 똑같아 보입니다. 투명하게 그리면 겹친 곳일수록 진해집니다." },
          { kind: "ox", q: "산점도에서 오른쪽 위로 올라가는 띠가 보이면 x가 y의 원인이다.", answer: false, explain: "산점도는 '함께 움직인다'까지만 보여 줍니다. 원인인지는 따로 따져야 합니다." },
        ] },
    ] },
  { id: "vz-15", track: "python-viz", dir: "python-da", title: "추세선", summary: "regplot 기울기 해석, 잔차, 그룹별 추세선과 곡선 추세선", level: "실무",
    concepts: ["viz.relation"],
    lessons: [
      { id: "da-15-2", title: "추세선 읽기", minutes: 18, concepts: ["viz.relation"],
        quiz: [
          { kind: "choice", q: "계산 금액(x)과 팁(y)의 추세선 기울기가 0.105다. 맞는 해석은?", options: ["팁은 항상 계산 금액의 0.105배다", "계산 금액이 1달러 늘면 팁이 평균 약 0.1달러 늘어난다", "상관계수가 0.105다", "팁이 1달러 늘면 계산 금액이 0.105달러 는다"], answer: 1, explain: "기울기는 x가 1 늘 때 선 위의 y가 늘어나는 양입니다. 개별 점은 선 위아래로 흩어져 있습니다." },
          { kind: "ox", q: "추세선 주변의 옅은 띠 안에 대부분의 점이 들어 있어야 한다.", answer: false, explain: "띠는 '선이 있을 법한 범위'(신뢰 구간)이지 점들의 범위가 아닙니다. 대부분의 점은 띠 밖에 있습니다." },
        ] },
    ] },
  { id: "vz-16", track: "python-viz", dir: "python-da", title: "상관계수 · 히트맵", summary: "상관계수 r, 상관 히트맵, 같은 r 다른 그림, 상관은 원인이 아니다", level: "실무",
    concepts: ["viz.relation"],
    lessons: [
      { id: "da-15-3", title: "상관계수와 히트맵 읽기", minutes: 20, concepts: ["viz.relation"],
        quiz: [
          { kind: "ox", q: "상관계수가 0에 가까우면 두 값 사이에는 아무 관계도 없다.", answer: false, explain: "r은 직선 관계만 잽니다. 양 끝에서 고장이 나는 U자 관계처럼 r ≈ 0이어도 강한 관계가 있을 수 있습니다." },
          { kind: "choice", q: "네 데이터의 상관계수가 모두 0.82로 같다. 가장 먼저 할 일은?", options: ["네 데이터 모두 강한 직선 관계라고 보고한다", "산점도를 그려 곡선 · 이상치 여부를 확인한다", "평균을 비교한다", "히트맵을 그린다"], answer: 1, explain: "앤스콤의 네 데이터처럼 r이 같아도 모양은 전혀 다를 수 있습니다. r을 보고하기 전에 산점도를 그립니다." },
          { kind: "ox", q: "아이스크림 판매량과 물놀이 사고 건수의 상관계수가 0.9이므로, 아이스크림 판매가 사고의 원인이다.", answer: false, explain: "상관은 인과가 아닙니다. 둘 다 더운 날씨라는 제3의 원인 때문에 함께 늘었을 수 있습니다." },
        ] },
    ] },
  { id: "vz-17", track: "python-viz", dir: "python-da", title: "pairplot · jointplot", summary: "여러 변수 한 번에 훑기, 섞인 그룹과 심슨의 역설", unit: 30, level: "실무",
    concepts: ["viz.relation"],
    lessons: [
      { id: "da-15-4", title: "pairplot · jointplot 읽기", minutes: 18, concepts: ["viz.relation"],
        quiz: [
          { kind: "choice", q: "펭귄 전체로는 부리 깊이와 몸무게의 r이 −0.47인데, 종별로 나누면 세 종 모두 +0.6 안팎이다. 알맞은 결론은?", options: ["부리가 깊을수록 가볍다", "같은 종 안에서는 부리가 깊을수록 무겁다. 전체 음의 관계는 종을 섞어서 생긴 착시다", "두 변수는 관계가 없다", "종별 계산이 틀렸다"], answer: 1, explain: "그룹을 섞으면 관계 방향이 뒤집히는 심슨의 역설입니다. 그룹별 결론을 보고합니다." },
        ] },
    ] },
  { id: "vz-18", track: "python-viz", dir: "python-da", title: "파이 · 도넛", summary: "전체 중 비중, 비슷한 조각은 막대로, 무엇의 100%인가, 도넛", level: "기본",
    concepts: ["viz.composition"],
    lessons: [
      { id: "da-16-1", title: "파이 · 도넛 읽기", minutes: 15, concepts: ["viz.composition"],
        quiz: [
          { kind: "choice", q: "제품 12종의 판매 비율을 비교해 가장 많이 팔린 순서를 보여 주려면?", options: ["파이 그래프", "크기순으로 정렬한 막대 그래프", "선 그래프", "히스토그램"], answer: 1, explain: "조각이 많거나 비슷한 파이는 크기 비교가 어렵습니다. 정렬한 막대가 순위를 가장 정확히 보여 줍니다." },
          { kind: "ox", q: "파이 그래프는 빠진 값(결측)이 많으면 원이 덜 채워져서 바로 알 수 있다.", answer: false, explain: "파이는 무엇을 넣든 꽉 찬 원(100%)으로 그려집니다. 분모(n)를 제목이나 설명에서 확인해야 합니다." },
        ] },
    ] },
  { id: "vz-19", track: "python-viz", dir: "python-da", title: "누적 막대 · 100% 막대", summary: "개수 누적 vs 100% 누적, 가운데 조각 읽기, 막대마다 n 적기", level: "기본",
    concepts: ["viz.composition"],
    lessons: [
      { id: "da-16-2", title: "누적 막대와 100% 막대 읽기", minutes: 18, concepts: ["viz.composition"],
        quiz: [
          { kind: "choice", q: "등급별 생존 비율을 비교하려고 한다. 그룹 크기가 491명, 216명, 184명으로 다를 때 알맞은 그래프는?", options: ["개수 누적 막대", "100% 누적 막대 + 막대마다 n 표시", "파이 세 개", "선 그래프"], answer: 1, explain: "비율 비교는 100% 막대가 정확합니다. 그룹 크기가 사라지므로 n을 함께 적습니다." },
          { kind: "ox", q: "누적 막대에서 위쪽 조각은 조각 끝의 높이로 막대끼리 비교할 수 있다.", answer: false, explain: "위쪽 조각은 막대마다 시작 높이가 달라서 끝 높이가 아니라 조각 길이로 비교해야 합니다." },
        ] },
    ] },
  { id: "vz-20", track: "python-viz", dir: "python-da", title: "누적 영역", summary: "전체 추이와 구성 변화를 한 장에, 100% 누적 영역", level: "기본",
    concepts: ["viz.composition"],
    lessons: [
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
  { id: "sq-04", track: "sql", title: "JOIN", summary: "INNER · LEFT JOIN, 짝 없는 행 찾기, 키 중복, SELF JOIN, UNION · INTERSECT · EXCEPT", level: "기본",
    concepts: ["sql.join"],
    lessons: [{ id: "sq-04-1", title: "흩어진 표를 키로 잇기", minutes: 25, concepts: ["sql.join"],
      quiz: [
        { kind: "write", lang: "sql", q: "emp와 dept를 부서 번호로 이어서 지역(location)별 평균 연봉을 조회하는 SQL을 작성하세요. 평균은 ROUND(AVG(...))로 정수로 반올림합니다.", given: "SELECT d.location\nFROM emp e", must: ["JOIN"], solution: "SELECT d.location, ROUND(AVG(e.sal)) AS avg_sal\nFROM emp e\nJOIN dept d ON e.deptno = d.deptno\nGROUP BY d.location;", explain: "JOIN으로 위치를 붙인 뒤 location으로 묶습니다. 서울 9233, 아산 6000입니다. 부서가 없는 김대표는 INNER JOIN에서 빠집니다." },
        { kind: "choice", q: "고객 256명(users)과 주문 372건(orders)이 있고, 주문이 한 건도 없는 고객이 64명이다. users LEFT JOIN orders 의 결과는 몇 행일까?", options: ["256행", "372행", "436행", "95,232행"], answer: 2, explain: "주문이 있는 고객은 주문 수만큼(372행), 주문이 없는 고객 64명은 NULL을 채운 1행씩 남습니다. 372 + 64 = 436." },
        { kind: "ox", q: "UNION은 붙인 결과에서 중복 행을 지우고, UNION ALL은 지우지 않는다.", answer: true, explain: "중복을 지우는 만큼 UNION이 더 느립니다. 중복이 없거나 지울 필요가 없으면 UNION ALL." },
      ] }] },
  { id: "sq-05", track: "sql", title: "서브쿼리와 CTE", summary: "WHERE · SELECT · FROM 안의 서브쿼리, IN, EXISTS · NOT EXISTS, 상관 서브쿼리, WITH", level: "기본",
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
  // 데이터베이스 설계 구역 (2026-11-07 추가). 셀 안에서 CREATE TABLE로 작은 표를 직접 만든다. 기획안: docs/lesson-plans/sql.md PART 6
  { id: "sq-09", track: "sql", title: "데이터 모델링", summary: "개념 · 논리 · 물리 모델, 엔터티 · 속성 · 관계, ERD 표기, 카디널리티, N:M 연결 테이블, 키의 종류", level: "기본",
    concepts: ["sql.modeling"],
    lessons: [
      { id: "sq-09-1", title: "설계도부터 그리기: 개념 · 논리 · 물리 모델", minutes: 15, concepts: ["sql.modeling"] },
      { id: "sq-09-2", title: "ERD 읽기: 관계 · 카디널리티 · 키", minutes: 20, concepts: ["sql.modeling"],
        quiz: [
          { kind: "choice", q: "고객 한 명은 주문을 여러 번 할 수 있고, 주문 한 건은 고객 한 명의 것이다. 고객 번호(외래키)는 어느 표에 두어야 할까?", options: ["고객 표", "주문 표", "두 표 모두", "새 연결 테이블"], answer: 1, explain: "고객 : 주문 = 1 : N입니다. 외래키는 N쪽(주문 표)에 둡니다. 주문 한 건에는 고객이 하나뿐이라 칸 하나면 충분합니다." },
          { kind: "choice", q: "학생은 여러 동아리에 가입할 수 있고, 동아리에도 여러 학생이 있다. 이 관계를 표로 만드는 방법은?", options: ["학생 표에 동아리 번호 열을 하나 추가한다", "동아리 표에 학생 번호 열을 하나 추가한다", "학생 번호와 동아리 번호를 담는 가입 표(연결 테이블)를 만든다", "한 칸에 동아리 번호를 쉼표로 이어 적는다"], answer: 2, explain: "N:M 관계는 연결 테이블로 1:N 두 개로 풉니다. 쉼표로 여러 값을 적으면 1NF 위반입니다." },
          { kind: "ox", q: "학생 표에서 {학번, 이름}은 행을 하나로 집을 수 있으므로 후보키다.", answer: false, explain: "학번만으로도 유일하므로 이름은 군더더기입니다. 최소성이 없어 슈퍼키이지 후보키가 아닙니다." },
        ] },
    ] },
  { id: "sq-10", track: "sql", title: "정규화와 반정규화", summary: "삽입 · 갱신 · 삭제 이상, 함수 종속, 1NF · 2NF · 3NF · BCNF, 반정규화 기법, OLTP vs OLAP, 스타 스키마", level: "기본",
    concepts: ["sql.normalization"],
    lessons: [
      { id: "sq-10-1", title: "한 사실은 한 곳에: 이상 현상과 정규화", minutes: 25, concepts: ["sql.normalization"] },
      { id: "sq-10-2", title: "일부러 합치기: 반정규화와 분석용 테이블", minutes: 20, concepts: ["sql.normalization"],
        quiz: [
          { kind: "choice", q: "기본키가 (학번, 과목 코드)인 수강 표에 학생 이름이 함께 들어 있다. 학생 이름은 학번만 알면 정해진다. 이 열을 떼어 내는 정규화 단계는?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1, explain: "기본키의 일부(학번)에만 기대는 부분 종속입니다. 부분 종속을 없애는 것이 2NF입니다." },
          { kind: "choice", q: "과목 담당 교수가 바뀌어 여러 줄 중 일부만 고쳤더니, 같은 과목에 교수가 둘이 되었다. 이 현상은?", options: ["삽입 이상", "갱신 이상", "삭제 이상", "무손실 분해"], answer: 1, explain: "같은 사실이 여러 줄에 중복되어, 고칠 때 일부를 빠뜨려 모순이 생긴 갱신 이상입니다." },
          { kind: "ox", q: "반정규화는 처음 설계할 때부터 JOIN을 줄이기 위해 적극적으로 적용하는 것이 좋다.", answer: false, explain: "정규화를 먼저 하고, 실제로 느린 쿼리를 측정한 뒤 꼭 필요한 곳만 반정규화합니다. 중복 데이터를 맞출 규칙도 함께 정합니다." },
        ] },
    ] },
  { id: "sq-11", track: "sql", title: "테이블 만들고 고치기", summary: "DDL · DML · DCL · TCL, CREATE · ALTER · DROP, 자료형, 제약조건과 무결성, INSERT · UPDATE · DELETE", level: "기본",
    concepts: ["sql.ddl-dml"],
    lessons: [
      { id: "sq-11-1", title: "테이블 만들기: 자료형과 제약조건", minutes: 25, concepts: ["sql.ddl-dml"] },
      { id: "sq-11-2", title: "데이터 넣고 고치고 지우기", minutes: 18, concepts: ["sql.ddl-dml"],
        quiz: [
          { kind: "write", lang: "sql", q: "아산공장(deptno 40) 사원의 연봉(sal)을 500 올린 뒤, 40번 부서 사원의 이름(ename_ko)과 연봉을 조회하는 SQL을 작성하세요.", given: "UPDATE emp\nSET \nWHERE deptno = 40;\n\nSELECT ename_ko, sal\nFROM emp\nWHERE deptno = 40;", must: ["UPDATE"], solution: "UPDATE emp\nSET sal = sal + 500\nWHERE deptno = 40;\n\nSELECT ename_ko, sal\nFROM emp\nWHERE deptno = 40;", explain: "SET sal = sal + 500처럼 지금 값으로 계산해 고칩니다. WHERE deptno = 40이 없으면 전 직원의 연봉이 오릅니다. 이주영 6000 → 6500." },
          { kind: "choice", q: "DELETE FROM emp; 를 실행하면?", options: ["emp 표가 통째로 사라진다", "emp의 모든 행이 지워지고 표 구조는 남는다", "WHERE가 없어서 오류가 난다", "첫 번째 행만 지워진다"], answer: 1, explain: "WHERE가 없으면 모든 행이 대상입니다. 표 구조까지 지우는 것은 DROP TABLE입니다." },
          { kind: "choice", q: "학년(grade) 열에 1, 2, 3만 들어오게 하려면 어떤 제약조건을 쓸까?", options: ["NOT NULL", "UNIQUE", "CHECK", "DEFAULT"], answer: 2, explain: "CHECK (grade BETWEEN 1 AND 3)처럼 허용할 값의 조건을 적습니다. 이런 규칙이 지키는 것을 도메인 무결성이라고 합니다." },
        ] },
    ] },
  { id: "sq-12", track: "sql", title: "트랜잭션 · 인덱스 · 뷰", summary: "BEGIN · COMMIT · ROLLBACK, ACID, 잠금, B-Tree 인덱스, 실행 계획, 인덱스를 못 쓰는 조건, 뷰", level: "실무",
    concepts: ["sql.tx-index"],
    lessons: [
      { id: "sq-12-1", title: "모두 되거나, 모두 안 되거나: 트랜잭션", minutes: 18, concepts: ["sql.tx-index"] },
      { id: "sq-12-2", title: "빨리 찾고, 이름 붙여 두기: 인덱스와 뷰", minutes: 22, concepts: ["sql.tx-index"],
        quiz: [
          { kind: "choice", q: "BEGIN 뒤에 UPDATE 두 개를 실행하고 ROLLBACK 했다. 결과는?", options: ["두 UPDATE 모두 반영된다", "첫 번째 UPDATE만 반영된다", "두 UPDATE 모두 취소되어 BEGIN 전 상태가 된다", "마지막 UPDATE만 취소된다"], answer: 2, explain: "ROLLBACK은 BEGIN 이후의 변경을 모두 취소합니다. 전부 되거나 전부 안 되는 원자성입니다." },
          { kind: "choice", q: "orders의 order_date 열에 인덱스가 있다. 다음 중 인덱스를 쓰지 못하는 조건은?", options: ["WHERE order_date = '2025-07-01'", "WHERE order_date >= '2025-07-01'", "WHERE substr(order_date, 1, 4) = '2025'", "WHERE order_date BETWEEN '2025-07-01' AND '2025-07-31'"], answer: 2, explain: "열을 함수로 감싸면 정렬된 인덱스를 쓸 수 없어 전체 스캔이 됩니다. order_date >= '2025-01-01' AND order_date < '2026-01-01'처럼 범위로 씁니다." },
          { kind: "ox", q: "인덱스는 검색을 빠르게 하므로 모든 열에 만들어 두는 것이 좋다.", answer: false, explain: "인덱스는 저장 공간을 쓰고, INSERT · UPDATE · DELETE 때마다 함께 고쳐야 해서 쓰기가 느려집니다. 자주 쓰는 느린 쿼리의 열에만 만듭니다." },
        ] },
    ] },

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
  { id: "st-09", track: "stats", title: "확률 기초", summary: "사건과 확률, 큰 수의 법칙, 시뮬레이션, 조건부확률과 베이즈 정리", unit: 48, level: "입문",
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
      { id: "st-09-3", title: "샘플링 검사의 확률과 OC 곡선", minutes: 22, concepts: ["st.probability", "st.distribution"],
        quiz: [
          { kind: "write", q: "로트 불량률이 2%일 때, 50개를 뽑아 불량 2개 이하면 합격하는 규칙의 합격 확률을 소수 셋째 자리로 출력하세요.", given: "from scipy import stats", expect: "0.922", must: ["binom\\.cdf"], solution: "from scipy import stats\nprint(round(stats.binom.cdf(2, 50, 0.02), 3))", explain: "c개 이하의 확률은 binom.cdf(c, n, p)입니다." },
          { kind: "choice", q: "좋은 로트는 더 잘 받고 나쁜 로트는 더 잘 거르려면 검사 규칙을 어떻게 바꿔야 할까?", options: ["c를 0으로 줄인다", "뽑는 수 n을 늘리고 c를 그에 맞게 정한다", "로트 크기를 줄인다", "맨 위 상자에서만 뽑는다"], answer: 1, explain: "n이 클수록 OC 곡선이 가팔라집니다. c만 줄이면 좋은 로트도 많이 떨어집니다." },
          { kind: "ox", q: "좋은 로트가 불합격되는 생산자 위험은 가설검정의 1종 오류와 같은 구조다.", answer: true, explain: "참인데 기각하는 것이 1종 오류, 나쁜 로트를 받는 소비자 위험이 2종 오류에 해당합니다." },
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
  { id: "st-04", track: "stats", title: "신뢰구간", summary: "95%의 의미, 신뢰수준과 폭, t 분포, 평균 · 비율의 신뢰구간, 부트스트랩", unit: 15, level: "기본",
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
      { id: "st-04-3", title: "부트스트랩: 공식 없이 구하는 신뢰구간", minutes: 22, concepts: ["st.ci"],
        quiz: [
          { kind: "write", q: "x에서 복원추출로 다시 뽑아 중앙값을 구하는 일을 2000번 반복하고, 95% 부트스트랩 구간의 아래 끝을 소수 둘째 자리로 출력하세요. 시드는 0입니다.", given: "import numpy as np\nx = np.array([12, 15, 14, 10, 30, 13, 11, 16, 14, 12])\nrng = np.random.default_rng(0)", expect: "12.0", must: ["replace\\s*=\\s*True|rng\\.choice\\(\\s*x\\s*,\\s*(size\\s*=\\s*)?len"], solution: "import numpy as np\nx = np.array([12, 15, 14, 10, 30, 13, 11, 16, 14, 12])\nrng = np.random.default_rng(0)\nmeds = np.array([np.median(rng.choice(x, size=len(x), replace=True)) for _ in range(2000)])\nprint(round(np.percentile(meds, 2.5), 2))", explain: "복원추출로 다시 뽑아 중앙값을 모은 뒤, 2.5% 지점이 구간의 아래 끝입니다." },
          { kind: "choice", q: "부트스트랩에서 다시 뽑을 때 복원추출을 쓰는 이유는?", options: ["계산이 빨라서", "비복원으로 n개를 뽑으면 매번 원래 표본과 같은 값들이 되기 때문에", "이상치를 지우기 위해", "표본을 늘리기 위해"], answer: 1, explain: "n개에서 n개를 비복원으로 뽑으면 순서만 바뀐 같은 표본입니다. 복원추출이어야 묶음마다 달라집니다." },
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
      { id: "st-06-3", title: "가정 확인과 비모수 검정", minutes: 22, concepts: ["st.chi-anova", "st.test"],
        quiz: [
          { kind: "choice", q: "설비 두 대에서 7개씩 잰 값이 치우쳐 있고 이상치도 있다. 두 그룹을 비교할 검정으로 알맞은 것은?", options: ["stats.ttest_ind (등분산)", "stats.mannwhitneyu", "stats.ttest_rel", "stats.chi2_contingency"], answer: 1, explain: "표본이 작고 정규성이 깨졌으면 순위로 비교하는 맨-휘트니 U 검정이 안전합니다." },
          { kind: "ox", q: "샤피로 검정 p-value가 0.05보다 작으면, 표본이 수천 개여도 t검정을 쓰면 안 된다.", answer: false, explain: "표본이 크면 샤피로는 사소한 어긋남도 잡아내고, 평균 비교는 중심극한정리 덕분에 정규성에 크게 흔들리지 않습니다. 그림과 표본 크기를 함께 봅니다." },
          { kind: "choice", q: "같은 설비 8대의 개선 전후 값을 순위로 비교하는 검정은?", options: ["stats.wilcoxon", "stats.kruskal", "stats.levene", "stats.shapiro"], answer: 0, explain: "대응 데이터의 비모수 검정은 윌콕슨 부호순위 검정입니다." },
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
  { id: "st-12", track: "stats", title: "검정 도구 상자", summary: "z검정 · 비율 검정, 분산 검정(F · 바틀렛), 정규성 검정(Q-Q · KS · 앤더슨), 이원분산분석, McNemar · 부호 · 프리드먼, 다중비교 보정, 상관 검정, 검정 고르기 지도", level: "실무",
    concepts: ["st.tests"],
    lessons: [
      { id: "st-12-1", title: "z검정과 비율 검정", minutes: 22, concepts: ["st.tests", "st.test"],
        quiz: [
          { kind: "choice", q: "불량률 목표가 2%인 라인에서 500개를 검사해 15개(3%)가 불량이었다. 가장 알맞은 검정은?", options: ["1표본 비율 z검정 (또는 이항검정)", "독립 2표본 t검정", "카이제곱 독립성 검정", "맨-휘트니 U 검정"], answer: 0, explain: "비율 하나를 기준값(0.02)과 비교하므로 1표본 비율 검정입니다. np = 10이라 z 근사도 쓸 수 있고, 정확한 값은 이항검정으로 구합니다." },
        ] },
      { id: "st-12-2", title: "흩어짐을 비교하는 검정: 카이제곱 분산 검정 · F검정 · 바틀렛", minutes: 22, concepts: ["st.tests"],
        quiz: [
          { kind: "ox", q: "F검정과 바틀렛 검정은 데이터가 정규분포에서 조금만 벗어나도 결과가 크게 흔들린다.", answer: true, explain: "두 검정은 정규성에 아주 민감합니다. 분포가 치우쳤거나 이상치가 있으면 레빈(또는 브라운-포사이스) 검정을 씁니다." },
        ] },
      { id: "st-12-3", title: "정규성 검정 더 보기: Q-Q 플롯 · KS · 앤더슨-달링", minutes: 20, concepts: ["st.tests"],
        quiz: [
          { kind: "choice", q: "Q-Q 플롯에서 점들이 가운데는 직선을 따르다가 오른쪽 끝에서 직선 위로 휘어 올라간다. 무슨 뜻일까?", options: ["오른쪽 꼬리가 정규분포보다 길다", "데이터가 완벽한 정규분포다", "표본이 너무 작다", "평균이 0이다"], answer: 0, explain: "큰 쪽 값들이 정규분포에서 기대한 것보다 더 크다는 뜻이라 오른쪽 꼬리가 깁니다(양의 왜도)." },
        ] },
      { id: "st-12-4", title: "두 요인을 함께: 이원분산분석과 교호작용", minutes: 25, concepts: ["st.tests", "st.chi-anova"],
        quiz: [
          { kind: "choice", q: "교호작용 그래프에서 두 선이 서로 엇갈린다. 무슨 뜻일까?", options: ["두 요인 모두 효과가 없다", "한 요인의 효과가 다른 요인의 수준에 따라 달라진다", "표본 수가 부족하다", "주효과만 있다"], answer: 1, explain: "선이 평행하면 교호작용이 없고, 기울기가 다르거나 엇갈리면 한 요인의 효과가 다른 요인에 따라 바뀝니다." },
        ] },
      { id: "st-12-5", title: "같은 대상을 여러 번: McNemar · 부호검정 · 프리드먼", minutes: 22, concepts: ["st.tests"],
        quiz: [
          { kind: "choice", q: "같은 학생 200명에게 교육 전후로 합격/불합격을 기록했다. 합격률이 달라졌는지 볼 검정은?", options: ["카이제곱 독립성 검정", "McNemar 검정", "독립 2표본 t검정", "크루스칼-월리스"], answer: 1, explain: "같은 대상의 두 번 측정(대응)이고 결과가 범주(합격/불합격)라 McNemar입니다. 결과가 바뀐 사람(불일치 칸)만 비교합니다." },
        ] },
      { id: "st-12-6", title: "여러 번 검정할 때: Bonferroni · Holm · FDR", minutes: 22, concepts: ["st.tests", "st.power"],
        quiz: [
          { kind: "short", q: "검정 10개를 하고 Bonferroni로 전체 1종 오류를 0.05로 묶으려 한다. 검정 하나의 유의수준은? (소수)", answer: ["0.005", ".005"], explain: "α / m = 0.05 / 10 = 0.005." },
          { kind: "ox", q: "Benjamini-Hochberg(FDR) 보정은 Bonferroni보다 더 많은 발견을 남기는 대신, 유의하다고 한 것 중 일부가 헛발견일 수 있음을 받아들인다.", answer: true, explain: "FDR은 '발견 중 헛발견의 비율'을 관리합니다. 탐색 단계에 알맞고, 하나라도 틀리면 안 되는 확인 단계에는 Bonferroni · Holm을 씁니다." },
        ] },
      { id: "st-12-7", title: "관계를 검정하기: 상관계수 검정 · 스피어만 · 켄달 · 회귀 F검정", minutes: 22, concepts: ["st.tests", "st.regression"],
        quiz: [
          { kind: "choice", q: "순위로 매긴 두 심사위원의 점수(1위~10위)가 얼마나 일치하는지 검정하려 한다. 가장 알맞은 것은?", options: ["피어슨 상관 검정", "스피어만 또는 켄달 순위상관 검정", "카이제곱 적합도 검정", "대응 t검정"], answer: 1, explain: "값이 순위라서 순위상관을 씁니다. 표본이 작고 같은 순위가 많으면 켄달 타우가 더 안정적입니다." },
        ] },
      { id: "st-12-8", title: "검정 고르기 지도와 효과크기 총정리", minutes: 20, concepts: ["st.tests"],
        quiz: [
          { kind: "choice", q: "세 공장의 불량 여부(불량/정상) 비율이 같은지 비교하려 한다. 검정 고르기 지도대로라면?", options: ["일원 ANOVA", "카이제곱 독립성(동질성) 검정", "크루스칼-월리스", "McNemar"], answer: 1, explain: "결과가 범주(불량/정상)이고 독립된 세 그룹이므로 3 × 2 분할표의 카이제곱 검정입니다." },
          { kind: "choice", q: "같은 환자 20명의 통증 점수(0~10, 치우침)를 세 가지 약으로 차례로 바꿔 쟀다. 알맞은 검정은?", options: ["일원 ANOVA", "프리드먼 검정", "크루스칼-월리스", "카이제곱"], answer: 1, explain: "같은 대상(대응) · 세 조건 이상 · 순서형/치우친 값이라 프리드먼 검정입니다." },
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
  { id: "st-10", track: "stats", title: "통계 해석 실수 피하기", summary: "상관과 인과, 교란변수, 심슨의 역설, 결과를 정직하게 보고하는 법", unit: 49, level: "실무",
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
  { id: "st-11", track: "stats", title: "품질 통계: 관리도와 공정능력", summary: "우연 원인과 이상 원인, I-MR · X̄-R · p 관리도, 런 규칙, Cp · Cpk · Ppk", level: "실무",
    concepts: ["st.spc"],
    lessons: [
      { id: "st-11-1", title: "관리도의 원리와 I-MR 관리도", minutes: 25, concepts: ["st.spc"],
        quiz: [
          { kind: "choice", q: "관리한계와 규격한계에 대한 설명으로 옳은 것은?", options: ["둘은 같은 것이다", "관리한계는 공정의 평소 흔들림에서, 규격한계는 고객 · 설계 요구에서 나온다", "관리한계 안이면 규격도 항상 만족한다", "규격한계는 평균 ± 3σ로 계산한다"], answer: 1, explain: "관리한계는 공정의 목소리, 규격한계는 고객의 목소리입니다. 같은 그래프에 섞지 않습니다." },
          { kind: "write", q: "x로 I 관리도의 관리 상한(평균 + 2.66 × 이동범위 평균)을 소수 셋째 자리로 출력하세요.", given: "import numpy as np\nx = np.array([10.0, 10.2, 9.9, 10.1, 10.0, 9.8])", expect: "10.532", must: ["diff"], solution: "import numpy as np\nx = np.array([10.0, 10.2, 9.9, 10.1, 10.0, 9.8])\nmr_bar = np.abs(np.diff(x)).mean()\nprint(round(x.mean() + 2.66 * mr_bar, 3))", explain: "이동범위는 np.abs(np.diff(x))이고 평균이 0.2라 10.0 + 2.66 × 0.2 = 10.532입니다." },
          { kind: "ox", q: "점이 모두 관리한계 안에 있으면 공정에 이상 원인이 없다고 판단해도 된다.", answer: false, explain: "연속 8점이 중심선 한쪽, 연속 상승 같은 런 규칙도 신호입니다." },
        ] },
      { id: "st-11-2", title: "X̄-R 관리도와 p 관리도", minutes: 25, concepts: ["st.spc"],
        quiz: [
          { kind: "choice", q: "X̄ 관리도에는 신호가 있고 R 관리도에는 신호가 없다. 가장 먼저 의심할 것은?", options: ["흔들림이 커졌다", "공정 중심이 옮겨 갔다 (설정 · 원료 변경 등)", "측정기가 고장 났다", "아무 일도 없다"], answer: 1, explain: "부분군 값이 함께 움직였다는 뜻이라 중심 이동을 의심합니다." },
          { kind: "write", q: "평균 불량률 0.04, 하루 검사 수 300개일 때 p 관리도의 관리 상한을 소수 넷째 자리로 출력하세요.", given: "import numpy as np\npbar, n = 0.04, 300", expect: "0.0739", must: ["sqrt"], solution: "import numpy as np\npbar, n = 0.04, 300\nprint(round(pbar + 3 * np.sqrt(pbar * (1 - pbar) / n), 4))", explain: "p̄ + 3 × √(p̄(1 − p̄)/n)입니다." },
        ] },
      { id: "st-11-3", title: "공정능력지수: Cp · Cpk · Ppk", minutes: 25, concepts: ["st.spc"],
        quiz: [
          { kind: "write", q: "규격 9.9 ~ 10.1, 평균 10.03, 표준편차 0.02일 때 Cpk를 소수 둘째 자리로 출력하세요.", given: "LSL, USL = 9.9, 10.1\nm, s = 10.03, 0.02", expect: "1.17", must: ["min"], solution: "LSL, USL = 9.9, 10.1\nm, s = 10.03, 0.02\nprint(round(min(USL - m, m - LSL) / (3 * s), 2))", explain: "가까운 쪽(상한)까지 0.07 ÷ 0.06 = 1.17입니다." },
          { kind: "choice", q: "Cp는 1.8인데 Cpk가 1.0이다. 가장 먼저 할 일은?", options: ["설비를 교체해 흔들림을 줄인다", "공정 평균을 규격 중앙으로 맞춘다", "규격을 넓혀 달라고 한다", "전수 검사를 중단한다"], answer: 1, explain: "Cp가 높으면 흔들림 폭은 충분히 좁습니다. Cp와 Cpk의 차이는 중심 치우침이라 중심을 맞추면 Cpk가 올라갑니다." },
          { kind: "ox", q: "관리도에 신호가 계속 나오는 불안정한 공정도 Cpk 하나로 능력을 요약할 수 있다.", answer: false, explain: "평균과 σ가 계속 바뀌는 공정은 지수 하나로 요약할 수 없습니다. 관리 상태를 먼저 만든 뒤 계산합니다." },
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
      ] },
    { id: "ml-00-3", title: "머신러닝 모델 지도: 어떤 문제에 어떤 모델", minutes: 15, concepts: ["ml.intro"],
      quiz: [
        { kind: "choice", q: "정답 없이 고객 1만 명의 구매 기록만 있다. 비슷한 고객끼리 묶고 싶을 때 어느 갈래의 모델을 쓸까?", options: ["지도학습 · 회귀 (선형회귀)", "지도학습 · 분류 (로지스틱 회귀)", "비지도학습 · 군집 (K-means)", "비지도학습 · 차원 축소 (PCA)"], answer: 2, explain: "정답(y)이 없고 비슷한 것끼리 묶는 일이라 비지도학습의 군집입니다." },
      ] }] },
  { id: "ml-01", track: "ml", title: "ML 워크플로와 데이터 준비", summary: "특성과 정답, 결측치, 인코딩, train/test, stratify, 기준 모델, 누수", unit: 17, level: "입문",
    concepts: ["ml.workflow", "ml.missing", "ml.encoding"],
    lessons: [
    // 라이브러리 소개(PART 첫 페이지): 퀴즈 없이 읽고 '다 읽었어요'로 완료
    { id: "ml-01-0", title: "scikit-learn 소개: 머신러닝 공구 상자", minutes: 12, concepts: ["ml.workflow"] },
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
  { id: "ml-02", track: "ml", title: "회귀: 선형 모델", summary: "최소제곱 직선, MAE · RMSE · R², 경사하강법, 다중 회귀, 다항 회귀와 편향-분산, Ridge · Lasso · ElasticNet", unit: 18, level: "기본",
    concepts: ["ml.linear", "ml.gd", "ml.regularization"],
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
    { id: "ml-02-7", title: "곡선도 직선 모델로: 다항회귀와 편향-분산", minutes: 18, concepts: ["ml.linear", "ml.overfit"],
      quiz: [
        { kind: "choice", q: "다항회귀의 차수를 1에서 15로 올렸더니 학습 R²는 0.99, 시험 R²는 크게 음수가 됐다. 어떤 상태일까?", options: ["과소적합 (편향이 크다)", "과적합 (분산이 크다)", "누수", "딱 좋다"], answer: 1, explain: "학습 데이터는 외웠지만 새 데이터에서 크게 흔들리는 고분산 상태입니다. 차수를 낮추거나 규제를 겁니다." },
      ] },
    { id: "ml-02-6", title: "계수에 벌점 주기: Ridge와 Lasso", minutes: 15, concepts: ["ml.regularization"],
      quiz: [
        { kind: "choice", q: "쓸모없는 특성의 계수를 딱 0으로 만들어, 특성을 저절로 골라 주는 효과가 있는 것은?", options: ["Ridge", "Lasso", "LinearRegression", "StandardScaler"], answer: 1, explain: "Lasso는 계수의 절댓값에 벌점을 줘서 작은 계수를 0으로 만듭니다. Ridge는 모든 계수를 조금씩 줄일 뿐 0으로 만들지는 않습니다." },
      ] }] },
  { id: "ml-12", track: "ml", title: "분류의 기본: 로지스틱 회귀와 다중 분류", summary: "시그모이드 · 로그 오즈 · 오즈비, 로그 손실, 결정 경계, 소프트맥스와 OvR", level: "기본",
    concepts: ["ml.logistic", "ml.multiclass"],
    lessons: [
    { id: "ml-02-5", title: "로지스틱 회귀: 확률로 분류하기", minutes: 15, concepts: ["ml.logistic"],
      quiz: [
        { kind: "ox", q: "LogisticRegression의 predict는 확률이 0.5 이상이면 1로 판정한다.", answer: true, explain: "이진 분류의 기본 임계값은 0.5입니다." },
      ] },
    { id: "ml-12-1", title: "셋 이상으로 나누기: 다중 분류와 소프트맥스", minutes: 18, concepts: ["ml.multiclass"],
      quiz: [
        { kind: "choice", q: "펭귄 세 종을 분류하는 모델의 클래스별 재현율이 0.98, 0.95, 0.40이다. macro 평균 재현율은?", options: ["약 0.78", "약 0.95", "약 0.40", "약 0.98"], answer: 0, explain: "macro 평균은 클래스 수로 나눈 단순 평균입니다. (0.98 + 0.95 + 0.40) / 3 ≈ 0.78." },
      ] }] },
  { id: "ml-03", track: "ml", title: "분류 평가지표", summary: "혼동행렬, 정밀도 · 재현율 · F1 · F-beta, macro · weighted 평균, 임계값, ROC-AUC · PR-AUC", unit: 19, level: "기본",
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
  { id: "ml-10", track: "ml", title: "분류 모델 더 보기: 거리 · 확률 · 경계", summary: "KNN(거리), 나이브 베이즈(확률)와 라플라스 스무딩, SVM(마진)과 커널, 모델 고르기", level: "실무", unit: 47,
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
  { id: "ml-04", track: "ml", title: "트리와 앙상블 (회귀 · 분류 공통)", summary: "결정트리, 지니 · 엔트로피 · 정보이득, 회귀 트리, 과적합, 랜덤포레스트(배깅), 그래디언트 부스팅 · XGBoost · LightGBM", unit: 20, level: "기본",
    concepts: ["ml.tree", "ml.overfit"],
    lessons: [
    { id: "ml-04-1", title: "결정트리: 스무고개로 예측하기", minutes: 15, concepts: ["ml.tree"],
      quiz: [
        { kind: "choice", q: "결정트리가 첫 질문을 고르는 기준은?", options: ["열 이름의 알파벳 순서", "나눈 뒤 그룹들이 가장 덜 섞이는(불순도가 가장 낮아지는) 질문", "값의 종류가 가장 많은 열", "사람이 정해 준 순서"], answer: 1, explain: "후보 질문마다 나눈 뒤 지니 불순도를 계산해 가장 많이 줄어드는 질문을 고릅니다. 타이타닉에서는 성별이었습니다." },
      ] },
    { id: "ml-04-5", title: "숫자도 트리로: 회귀 트리", minutes: 15, concepts: ["ml.tree"],
      quiz: [
        { kind: "ox", q: "회귀 트리는 학습 데이터에서 본 가장 큰 정답보다 더 큰 값을 예측할 수 있다.", answer: false, explain: "잎의 예측값은 그 잎에 들어온 학습 정답들의 평균이라, 학습 범위 밖으로 나가지 못합니다(외삽 불가)." },
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
      ] },
    { id: "ml-04-6", title: "잔차를 차례로 줄이기: 그래디언트 부스팅과 XGBoost · LightGBM", minutes: 18, concepts: ["ml.tree", "ml.boosting"],
      quiz: [
        { kind: "choice", q: "회귀용 그래디언트 부스팅에서 두 번째 트리가 맞히도록 학습하는 대상은?", options: ["원래 정답 y", "첫 트리까지의 예측이 남긴 잔차(정답 − 예측)", "무작위로 섞은 정답", "첫 트리의 피처 중요도"], answer: 1, explain: "각 트리는 지금까지 합친 예측이 틀린 만큼(잔차, 손실의 기울기)을 맞히도록 학습합니다." },
        { kind: "ox", q: "learning_rate를 낮추면 보통 트리 개수(n_estimators)를 더 늘려야 비슷한 성능이 나온다.", answer: true, explain: "한 트리가 반영되는 몫이 작아지니 더 많은 트리가 필요합니다. 대신 과적합에 덜 민감해집니다." },
      ] }] },
  { id: "ml-05", track: "ml", title: "교차검증과 하이퍼파라미터", summary: "K-fold, GridSearchCV, 검증 곡선 · 학습 곡선, 시계열 분할", unit: 35, level: "기본",
    concepts: ["ml.cv", "ml.overfit", "ml.timeseries"],
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
      ] },
    { id: "ml-05-4", title: "시간 순서가 있는 데이터 나누기", minutes: 15, concepts: ["ml.timeseries", "ml.cv"],
      quiz: [
        { kind: "ox", q: "월별 판매량처럼 시간 순서가 있는 데이터도 shuffle=True로 섞은 K-fold로 검증하는 것이 가장 정확하다.", answer: false, explain: "섞으면 미래 데이터로 과거를 맞히는 셈이라 점수가 부풀려집니다(숲 MAE 13.8 vs 시간 순서 28.6). TimeSeriesSplit처럼 과거로 학습하고 그 뒤로 시험합니다." },
      ] }] },
  { id: "ml-06", track: "ml", title: "피처 엔지니어링과 Pipeline", summary: "SimpleImputer · OneHotEncoder · 타깃 인코딩, 표준화 · 로그 변환, 새 특성, Pipeline, 피처 셀렉션, 다중공선성 · VIF", unit: 36, level: "실무",
    concepts: ["ml.feature", "ml.selection", "ml.collinearity"],
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
      ] },
    { id: "ml-06-5", title: "쓸 특성만 고르기: 피처 셀렉션", minutes: 15, concepts: ["ml.selection"],
      quiz: [
        { kind: "choice", q: "모델을 여러 번 학습하면서 가장 덜 쓰인 특성을 하나씩 빼 나가는 방식은?", options: ["Filter (SelectKBest)", "Wrapper (RFE)", "Embedded (Lasso)", "PCA"], answer: 1, explain: "RFE는 모델을 반복 학습하며 약한 열을 빼는 Wrapper 방식입니다. 조합을 보고 고르지만 느립니다." },
        { kind: "ox", q: "전체 데이터로 SelectKBest를 해서 특성을 고른 뒤 교차검증하면 정직한 점수가 나온다.", answer: false, explain: "특성 선택도 정답을 보는 단계라, 전체 데이터로 고르면 시험 조각의 정답을 미리 본 셈입니다(난수 데이터가 0.79로 부풀려짐). Pipeline 안에서 골라야 합니다." },
      ] },
    { id: "ml-06-6", title: "비슷한 열이 겹칠 때: 다중공선성과 VIF", minutes: 15, concepts: ["ml.collinearity"],
      quiz: [
        { kind: "choice", q: "어떤 열의 VIF가 10이다. 무슨 뜻일까?", options: ["이 열은 정답과 상관이 0.9다", "나머지 특성들로 이 열을 약 90%(R² 0.9) 설명할 수 있다", "이 열의 중요도가 10위다", "이 열에 빈칸이 10% 있다"], answer: 1, explain: "VIF = 1 / (1 − R²). 다른 특성들로 이 열을 맞힌 R²가 0.9면 VIF는 10입니다. 거의 다른 열의 복사본이라는 뜻입니다." },
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
  { id: "ml-07", track: "ml", title: "비지도 학습: 군집", summary: "K-means, 엘보 · 실루엣, DBSCAN · 계층 군집, 가우시안 혼합(GMM)", unit: 37, level: "실무",
    concepts: ["ml.kmeans", "ml.gmm"],
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
    { id: "ml-07-5", title: "확률로 묶기: 가우시안 혼합(GMM)", minutes: 15, concepts: ["ml.gmm"],
      quiz: [
        { kind: "choice", q: "K-means와 비교한 GMM의 특징으로 옳은 것은?", options: ["그룹 수를 자동으로 정한다", "점마다 각 그룹에 속할 확률을 준다", "표준화가 전혀 필요 없다", "정답(y)이 있어야 학습한다"], answer: 1, explain: "GMM은 그룹을 정규분포(타원)로 보고 점마다 소속 확률(predict_proba)을 줍니다. 그룹 수는 BIC 등으로 고릅니다." },
      ] }] },
  { id: "ml-13", track: "ml", title: "비지도 학습: 차원 축소와 이상 탐지", summary: "PCA와 설명된 분산, t-SNE로 지도 그리기, IsolationForest 이상 탐지", level: "실무",
    concepts: ["ml.pca", "ml.tsne", "ml.anomaly"],
    lessons: [
    { id: "ml-07-3", title: "PCA: 여러 열을 몇 개로 요약하기", minutes: 15, concepts: ["ml.pca"],
      quiz: [
        { kind: "ox", q: "PCA의 첫 번째 주성분은 데이터의 분산이 가장 큰 방향이다.", answer: true, explain: "두 번째는 첫 번째와 직교하면서 남은 분산이 가장 큰 방향입니다." },
      ] },
    { id: "ml-13-1", title: "고차원을 한 장의 지도로: t-SNE", minutes: 15, concepts: ["ml.tsne"],
      quiz: [
        { kind: "ox", q: "t-SNE 지도에서 두 덩어리 사이의 거리가 멀면, 원래 데이터에서도 두 그룹이 그만큼 멀다고 해석할 수 있다.", answer: false, explain: "t-SNE는 가까운 이웃 관계를 지키는 데 집중해서, 덩어리 사이 거리와 덩어리 크기는 믿을 수 없습니다." },
      ] },
    { id: "ml-07-4", title: "평소와 다른 것 찾기: 이상 탐지", minutes: 15, concepts: ["ml.anomaly"],
      quiz: [
        { kind: "ox", q: "IsolationForest가 이상 점수 1등으로 뽑은 설비는 반드시 고장이다.", answer: false, explain: "이상 점수는 '평소와 다르다'는 뜻일 뿐입니다. 실제로 1등 설비는 고장이 아니었고, 상위 1% 중 고장은 34%였습니다. 사람이 먼저 볼 후보로 씁니다." },
      ] }] },
  { id: "ml-09", track: "ml", title: "모델 해석", summary: "피처 중요도, 순열 중요도, 표준화 계수, 부분 의존도, SHAP", unit: 39, level: "실무",
    concepts: ["ml.explain", "ml.shap"],
    lessons: [
    { id: "ml-09-1", title: "무엇을 많이 봤나: 피처 중요도와 순열 중요도", minutes: 15, concepts: ["ml.explain"],
      quiz: [
        { kind: "choice", q: "테스트 데이터에서 열을 섞어 점수 하락으로 중요도를 재는 방법은?", options: ["feature_importances_", "permutation_importance", "coef_", "PCA"], answer: 1, explain: "sklearn.inspection.permutation_importance." },
        { kind: "ox", q: "상관이 높은 두 변수는 중요도를 서로 나눠 가져 각각 낮게 보일 수 있다.", answer: true, explain: "한 열을 섞어도 다른 열이 정보를 대신하기 때문입니다." },
      ] },
    { id: "ml-09-2", title: "어느 방향으로, 어떤 모양으로: 계수와 부분 의존도", minutes: 15, concepts: ["ml.explain"],
      quiz: [
        { kind: "ox", q: "부분 의존도에서 토크가 60을 넘을 때 고장 확률이 급히 오르면, 토크를 낮추면 반드시 고장이 줄어든다고 결론 내릴 수 있다.", answer: false, explain: "부분 의존도는 모델이 배운 관계(상관)를 보여 줄 뿐 인과를 증명하지 않습니다. 실제 조치는 현장 지식과 실험으로 확인합니다." },
      ] },
    { id: "ml-09-3", title: "이 한 건은 왜?: SHAP 값 직접 계산하기", minutes: 15, concepts: ["ml.shap", "ml.explain"],
      quiz: [
        { kind: "short", q: "기본값(평균 예측)이 0.05이고, 한 설비의 SHAP 값이 토크 +0.60, 공구 마모 +0.20, 나머지 열 합계 −0.05다. 이 설비의 모델 예측 확률은? (소수)", answer: ["0.8", "0.80", ".8"], explain: "기본값 + SHAP 값의 합 = 예측. 0.05 + 0.60 + 0.20 − 0.05 = 0.80." },
        { kind: "ox", q: "어떤 설비에서 토크의 SHAP 값이 가장 크면, 토크를 낮추면 그 설비의 고장이 줄어든다는 것이 증명된 것이다.", answer: false, explain: "SHAP 값은 모델이 그렇게 계산했다는 판단 근거일 뿐, 원인을 증명하지 않습니다. 조치 효과는 현장 실험으로 확인합니다." },
      ] }] },
  { id: "ml-11", track: "ml", title: "현장에 내보내기", summary: "모델 저장 · 불러오기, 드리프트 감시, 처음부터 끝까지 미니 프로젝트", level: "실무", unit: 51,
    concepts: ["ml.deploy"],
    lessons: [
    { id: "ml-11-1", title: "모델 저장하고 다시 쓰기, 그리고 드리프트", minutes: 15, concepts: ["ml.deploy"],
      quiz: [
        { kind: "choice", q: "고장 여부(정답)는 몇 주 뒤에야 확정된다. 배포한 모델이 낡았는지 가장 먼저 알아챌 수 있는 방법은?", options: ["정답이 쌓일 때까지 기다린다", "새로 들어오는 입력 데이터의 분포를 학습 때와 비교한다", "모델을 매일 처음부터 다시 만든다", "판정 기준선을 0.5로 되돌린다"], answer: 1, explain: "정답은 늦게 오지만 입력은 바로 옵니다. KS 통계량 등으로 입력 분포가 학습 때와 달라졌는지 먼저 감시합니다(공기 온도 KS 0.762)." },
      ] },
    { id: "ml-11-2", title: "처음부터 끝까지: 설비 고장 예측 미니 프로젝트", minutes: 25, concepts: ["ml.deploy", "ml.workflow"],
      quiz: [
      ] }] },

  // ── 딥러닝 (개념 학습, 실습 없음) ───────────────────────────
  { id: "dl-00", track: "dl", intro: true, title: "딥러닝 시작하기", summary: "머신러닝과의 차이, 층별 표현, 역사, 쓸 때 · 안 쓸 때", level: "입문",
    concepts: ["dl.intro"],
    lessons: [
    { id: "dl-00-1", title: "딥러닝은 무엇이 다를까", minutes: 12, concepts: ["dl.intro"],
      quiz: [
        { kind: "choice", q: "전통 머신러닝과 비교한 딥러닝의 가장 큰 차이는?", options: ["평가 지표를 쓰지 않는다", "특징을 사람이 만들지 않고 모델이 데이터에서 배운다", "학습 데이터가 필요 없다", "결과를 항상 설명할 수 있다"], answer: 1, explain: "딥러닝은 층을 쌓아 선 → 모양 → 물체처럼 특징까지 스스로 배웁니다." },
        { kind: "ox", q: "딥러닝은 사람의 뇌를 그대로 본떠 만든 것이다.", answer: false, explain: "이름만 뇌에서 따왔고, 실제로는 곱하고 더하는 계산을 여러 층 쌓은 수학 함수입니다." },
      ] },
    { id: "dl-00-2", title: "딥러닝의 역사와 쓸 때 · 안 쓸 때", minutes: 12, concepts: ["dl.intro"],
      quiz: [
        { kind: "choice", q: "설비 센서 요약값 3,000행(표 데이터)으로 고장 여부를 예측하려 한다. 먼저 시도할 방법으로 가장 알맞은 것은?", options: ["Transformer", "CNN", "부스팅 같은 전통 머신러닝", "GAN"], answer: 2, explain: "표 데이터, 적은 데이터에서는 부스팅이 더 빠르고 정확하고 설명하기 쉬운 경우가 많습니다." },
        { kind: "ox", q: "뉴런과 역전파 같은 딥러닝의 핵심 아이디어는 2010년대에 처음 발명되었다.", answer: false, explain: "아이디어는 수십 년 전에 나왔고, 새로 갖춰진 것은 데이터 · GPU · 학습 기법이라는 조건입니다." },
      ] }] },
  { id: "dl-01", track: "dl", title: "퍼셉트론과 활성화 함수", summary: "뉴런의 가중합 · 활성화, 시그모이드 · ReLU · 소프트맥스, XOR과 은닉층", unit: 40, level: "입문",
    concepts: ["dl.perceptron"],
    lessons: [
    // 라이브러리 소개(PART 첫 페이지): 퀴즈 없이 읽고 '다 읽었어요'로 완료
    { id: "dl-01-0", title: "PyTorch 소개: 딥러닝을 만드는 도구", minutes: 12, concepts: ["dl.perceptron"] },
    { id: "dl-01-1", title: "뉴런 하나가 하는 일", minutes: 12, concepts: ["dl.perceptron"],
      quiz: [
        { kind: "short", q: "가중치 (2, 1), 편향 −1인 뉴런에 입력 (1, 0)이 들어왔다. 가중합 z는?", answer: ["1"], explain: "2 × 1 + 1 × 0 + (−1) = 1." },
        { kind: "ox", q: "학습은 뉴런의 개수를 바꾸는 일이다.", answer: false, explain: "뉴런 수(구조)는 사람이 정하고, 학습은 그 안의 가중치와 편향만 바꿉니다." },
      ] },
    { id: "dl-01-2", title: "활성화 함수: 신호를 다듬는 스위치", minutes: 15, concepts: ["dl.perceptron"],
      quiz: [
        { kind: "short", q: "ReLU(−3)의 값은?", answer: ["0"], explain: "ReLU는 음수를 0으로, 양수는 그대로 내보냅니다." },
        { kind: "choice", q: "사진을 고양이 · 개 · 새 세 종류 중 하나로 분류하는 신경망의 출력층 활성화로 알맞은 것은?", options: ["ReLU", "시그모이드", "소프트맥스", "활성화 없음"], answer: 2, explain: "다중 분류는 점수를 합이 1인 확률로 바꾸는 소프트맥스를 씁니다." },
        { kind: "ox", q: "요즘 은닉층의 기본 활성화 함수는 ReLU다.", answer: true, explain: "계산이 빠르고 깊게 쌓아도 기울기가 덜 사라져 은닉층 표준이 되었습니다." },
      ] },
    { id: "dl-01-3", title: "왜 층을 쌓을까: XOR과 비선형", minutes: 15, concepts: ["dl.perceptron"],
      quiz: [
        { kind: "ox", q: "뉴런 하나(퍼셉트론)로 XOR 문제를 풀 수 있다.", answer: false, explain: "XOR은 직선 하나로 나뉘지 않아, 은닉층이 있어야 풉니다." },
        { kind: "choice", q: "비선형 활성화 없이 선형 층만 10개 쌓은 신경망은?", options: ["10배 더 복잡한 문제를 푼다", "선형 층 하나와 같은 일밖에 못 한다", "XOR을 풀 수 있다", "과적합이 사라진다"], answer: 1, explain: "2배 다음 3배는 그냥 6배이듯, 선형을 아무리 겹쳐도 선형입니다." },
      ] }] },
  { id: "dl-02", track: "dl", title: "손실함수와 경사하강법", summary: "MSE · 교차엔트로피, 학습률, 미니배치 · 에폭, 모멘텀 · Adam", unit: 41, level: "입문",
    concepts: ["dl.loss"],
    lessons: [
    { id: "dl-02-1", title: "틀린 정도 재기: 손실 함수", minutes: 15, concepts: ["dl.loss"],
      quiz: [
        { kind: "choice", q: "불량/정상 분류 신경망에 주로 쓰는 손실 함수는?", options: ["MSE", "교차엔트로피", "정확도", "R²"], answer: 1, explain: "분류는 정답 확률의 −log를 쓰는 교차엔트로피로, 자신 있게 틀릴수록 벌점이 커집니다." },
        { kind: "ox", q: "손실이 0.3이면 30% 틀렸다는 뜻이다.", answer: false, explain: "손실은 퍼센트가 아니라, 같은 문제 안에서 비교할 때만 의미가 있는 점수입니다." },
      ] },
    { id: "dl-02-2", title: "내리막으로 걷기: 경사하강법과 학습률", minutes: 15, concepts: ["dl.loss"],
      quiz: [
        { kind: "short", q: "w = 1, 기울기 4, 학습률 0.1일 때 한 번 업데이트한 w는?", answer: ["0.6"], explain: "w ← w − η × 기울기 = 1 − 0.1 × 4 = 0.6." },
        { kind: "ox", q: "학습률은 클수록 빨리, 확실하게 배운다.", answer: false, explain: "너무 크면 바닥을 넘나들며 발산합니다. 0.1, 0.01, 0.001처럼 바꿔 가며 찾습니다." },
      ] },
    { id: "dl-02-3", title: "조금씩 보고 고치기: 배치 · 미니배치 · 에폭", minutes: 12, concepts: ["dl.loss"],
      quiz: [
        { kind: "short", q: "데이터 600개, 배치 크기 100일 때 1에폭 동안 가중치를 몇 번 고칠까?", answer: ["6", "6번"], explain: "600 ÷ 100 = 6번." },
        { kind: "ox", q: "1에폭은 가중치를 한 번 고친 것을 말한다.", answer: false, explain: "1에폭은 데이터 전체를 한 번 본 것이고, 그동안 (데이터 수 ÷ 배치 크기)번 고칩니다." },
      ] },
    { id: "dl-02-4", title: "더 똑똑하게 내려가기: 옵티마이저", minutes: 12, concepts: ["dl.optimizer"],
      quiz: [
        { kind: "choice", q: "Adam은 어떤 두 아이디어를 합친 옵티마이저일까?", options: ["드롭아웃 + 조기 종료", "모멘텀 + RMSProp", "배치 정규화 + 잔차 연결", "SGD + 소프트맥스"], answer: 1, explain: "관성(모멘텀)과 가중치별 보폭 조절(RMSProp)을 함께 씁니다." },
        { kind: "ox", q: "Adam을 쓰면 학습률은 신경 쓰지 않아도 된다.", answer: false, explain: "Adam도 학습률이 너무 크면 발산하고 너무 작으면 느립니다." },
      ] }] },
  { id: "dl-03", track: "dl", title: "순전파와 역전파", summary: "층별 손 계산, 계산 그래프와 연쇄법칙, 기울기 소실 · 잔차 연결", unit: 42, level: "기본",
    concepts: ["dl.backprop"],
    lessons: [
    { id: "dl-03-1", title: "순전파: 입력에서 예측까지", minutes: 15, concepts: ["dl.backprop"],
      quiz: [
        { kind: "choice", q: "신경망 학습 한 바퀴의 순서로 알맞은 것은?", options: ["역전파 → 순전파 → 손실 → 업데이트", "순전파 → 손실 → 역전파 → 업데이트", "업데이트 → 순전파 → 역전파 → 손실", "손실 → 순전파 → 업데이트 → 역전파"], answer: 1, explain: "예측(순전파) → 채점(손실) → 책임 나누기(역전파) → 고치기(업데이트)." },
        { kind: "ox", q: "순전파가 진행되는 동안 가중치가 조금씩 바뀐다.", answer: false, explain: "순전파 중 가중치는 고정이고, 역전파로 기울기를 구한 뒤 업데이트 단계에서 바뀝니다." },
      ] },
    { id: "dl-03-2", title: "역전파: 책임을 거꾸로 나누기", minutes: 15, concepts: ["dl.backprop"],
      quiz: [
        { kind: "choice", q: "곱셈 노드 z = x × y에서 x 쪽으로 넘어가는 기울기는 위에서 온 기울기에 무엇을 곱한 것일까?", options: ["1", "x", "y", "x + y"], answer: 2, explain: "곱셈 노드는 상대편 입력값을 곱해서 넘깁니다." },
        { kind: "short", q: "톱니바퀴 A가 1바퀴 돌면 B가 2바퀴, B가 1바퀴 돌면 C가 3바퀴 돈다. A가 1바퀴 돌면 C는 몇 바퀴?", answer: ["6", "6바퀴"], explain: "연쇄법칙: 중간 영향의 곱 2 × 3 = 6." },
      ] },
    { id: "dl-03-3", title: "기울기 소실과 폭주", minutes: 15, concepts: ["dl.backprop"],
      quiz: [
        { kind: "choice", q: "깊은 신경망에서 기울기 소실을 줄이는 방법이 아닌 것은?", options: ["ReLU 사용", "잔차 연결", "배치 정규화", "은닉층 활성화를 모두 시그모이드로 바꾸기"], answer: 3, explain: "시그모이드 기울기는 최대 0.25라, 층마다 곱해지면 오히려 소실이 심해집니다." },
        { kind: "ox", q: "기울기 폭주는 역전파에서 곱해지는 수가 1보다 클 때 생긴다.", answer: true, explain: "1보다 크면 폭주, 작으면 소실입니다. 폭주는 기울기 클리핑으로 막습니다." },
      ] }] },
  { id: "dl-04", track: "dl", title: "MLP 학습과 과적합", summary: "출력층 · 손실 짝, 파라미터 수, 학습 곡선 · 조기 종료, 드롭아웃 · 증강", unit: 43, level: "기본",
    concepts: ["dl.mlp"],
    lessons: [
    { id: "dl-04-1", title: "신경망 설계도: 층 · 노드 · 출력층", minutes: 15, concepts: ["dl.mlp"],
      quiz: [
        { kind: "short", q: "입력 4개 → 출력 8개인 완전연결 층의 파라미터(가중치 + 편향) 수는?", answer: ["40", "40개"], explain: "4 × 8 + 8 = 40." },
        { kind: "choice", q: "부품 무게(kg)를 예측하는 회귀 신경망의 출력층 · 손실 짝으로 알맞은 것은?", options: ["노드 1개 · 활성화 없음 · MSE", "노드 1개 · 시그모이드 · 교차엔트로피", "노드 3개 · 소프트맥스 · 교차엔트로피", "노드 1개 · ReLU · 정확도"], answer: 0, explain: "회귀는 숫자를 그대로 내보내는 노드 1개와 MSE가 기본 세트입니다." },
        { kind: "ox", q: "이진 분류는 출력 노드가 반드시 2개여야 한다.", answer: false, explain: "시그모이드 노드 1개(불량 확률 p)로 충분합니다." },
      ] },
    { id: "dl-04-2", title: "학습 곡선으로 과적합 알아보기", minutes: 12, concepts: ["dl.mlp"],
      quiz: [
        { kind: "choice", q: "학습 손실은 계속 줄고 검증 손실은 5에폭부터 오르기 시작했다. 무슨 상태일까?", options: ["과소적합", "과적합", "학습률이 너무 작음", "정상, 계속 학습"], answer: 1, explain: "학습 데이터만 외우기 시작해 두 곡선의 간격이 벌어지는 과적합입니다." },
        { kind: "ox", q: "조기 종료로 학습을 멈추면 마지막 에폭의 가중치를 쓴다.", answer: false, explain: "검증 손실이 가장 낮았던 에폭의 가중치로 되돌려 씁니다." },
      ] },
    { id: "dl-04-3", title: "과적합을 막는 도구들", minutes: 15, concepts: ["dl.mlp"],
      quiz: [
        { kind: "ox", q: "드롭아웃은 예측할 때도 노드 일부를 끈다.", answer: false, explain: "드롭아웃은 학습할 때만 쓰고, 예측할 때는 모든 노드를 켭니다." },
        { kind: "choice", q: "불량 사진을 좌우 반전 · 살짝 회전해 학습 데이터를 늘리는 방법은?", options: ["배치 정규화", "가중치 규제", "데이터 증강", "조기 종료"], answer: 2, explain: "정답이 바뀌지 않는 변형으로 배울 거리를 늘리는 데이터 증강입니다." },
      ] }] },
  { id: "dl-05", track: "dl", title: "CNN", summary: "픽셀 · 채널, 합성곱 필터, 패딩 · 스트라이드, 풀링, CNN 구조", unit: 44, level: "기본",
    concepts: ["dl.cnn"],
    lessons: [
    { id: "dl-05-1", title: "이미지는 숫자 격자다", minutes: 12, concepts: ["dl.cnn"],
      quiz: [
        { kind: "short", q: "가로 100 · 세로 100 컬러(RGB) 사진에는 숫자가 몇 개 들어 있을까?", answer: ["30000", "30,000", "3만"], explain: "100 × 100 × 3 = 30,000." },
        { kind: "ox", q: "사진을 한 줄로 펼쳐 MLP에 넣어도 이웃 픽셀의 위치 관계는 그대로 활용된다.", answer: false, explain: "숫자는 그대로지만, 어느 픽셀이 위 · 아래 이웃이었는지라는 구조 정보를 MLP가 쓰지 못합니다." },
      ] },
    { id: "dl-05-2", title: "합성곱: 이미지를 훑는 작은 필터", minutes: 15, concepts: ["dl.cnn"],
      quiz: [
        { kind: "short", q: "입력 32, 필터 5, 패딩 0, 스트라이드 1이면 출력 크기는?", answer: ["28"], explain: "(32 − 5 + 0) ÷ 1 + 1 = 28." },
        { kind: "ox", q: "CNN의 필터 값은 사람이 설계해 넣는다.", answer: false, explain: "필터 값은 데이터에서 학습되는 가중치입니다." },
      ] },
    { id: "dl-05-3", title: "풀링과 CNN 전체 구조", minutes: 15, concepts: ["dl.cnn"],
      quiz: [
        { kind: "choice", q: "2×2 최대 풀링(스트라이드 2)을 하면 가로 · 세로 크기는?", options: ["그대로", "절반", "2배", "1/4"], answer: 1, explain: "가로 · 세로가 각각 절반, 면적은 1/4이 됩니다." },
        { kind: "ox", q: "풀링 층에는 학습되는 가중치가 있다.", answer: false, explain: "풀링은 최댓값(또는 평균)을 고르는 정해진 규칙이라 가중치가 없습니다." },
      ] }] },
  { id: "dl-06", track: "dl", title: "RNN과 시퀀스", summary: "은닉 상태, 펼친 구조, 시간 방향 기울기 소실, LSTM · GRU", unit: 45, level: "실무",
    concepts: ["dl.rnn"],
    lessons: [
    { id: "dl-06-1", title: "순서를 기억하는 네트워크", minutes: 15, concepts: ["dl.rnn"],
      quiz: [
        { kind: "choice", q: "RNN에서 이전 시점의 정보를 다음 시점으로 넘기는 것은?", options: ["가중치 감쇠", "은닉 상태", "풀링", "임베딩"], answer: 1, explain: "은닉 상태 h가 지금까지의 요약(메모)을 들고 다음 시점으로 갑니다." },
        { kind: "ox", q: "RNN은 시점마다 서로 다른 가중치를 쓴다.", answer: false, explain: "모든 시점에서 같은 셀(같은 가중치)을 재사용합니다. 그래서 길이가 달라도 처리할 수 있습니다." },
      ] },
    { id: "dl-06-2", title: "긴 기억의 문제와 LSTM · GRU", minutes: 15, concepts: ["dl.rnn"],
      quiz: [
        { kind: "choice", q: "LSTM에서 셀 상태의 어떤 정보를 버릴지 정하는 것은?", options: ["입력 게이트", "잊기 게이트", "출력 게이트", "풀링"], answer: 1, explain: "잊기 게이트가 0~1 밸브로 지난 기억 중 버릴 부분을 정합니다." },
        { kind: "ox", q: "LSTM은 게이트를 써서 기울기 소실 문제를 줄인다.", answer: true, explain: "셀 상태가 곱 대신 덧셈 위주로 흘러 기울기가 덜 사라집니다." },
      ] }] },
  { id: "dl-07", track: "dl", title: "임베딩과 어텐션", summary: "토큰 · 임베딩, Q · K · V 어텐션, Transformer, LLM", unit: 46, level: "실무",
    concepts: ["dl.attention"],
    lessons: [
    { id: "dl-07-1", title: "단어를 숫자로: 토큰과 임베딩", minutes: 15, concepts: ["dl.attention"],
      quiz: [
        { kind: "choice", q: "원-핫 표현의 한계로 알맞은 것은?", options: ["단어를 구별할 수 없다", "모든 단어 사이가 똑같이 멀어서 비슷함을 담지 못한다", "숫자가 너무 작다", "학습이 필요하다"], answer: 1, explain: "원-핫은 어떤 단어인지만 담고, 어떤 단어와 비슷한지는 담지 못합니다." },
        { kind: "ox", q: "임베딩 벡터의 숫자는 사람이 단어마다 정해 준다.", answer: false, explain: "임베딩 값은 학습으로 정해지고, 각 축의 의미도 사람이 정하지 않습니다." },
      ] },
    { id: "dl-07-2", title: "어텐션: 어디를 볼지 스스로 정하기", minutes: 18, concepts: ["dl.attention"],
      quiz: [
        { kind: "choice", q: "어텐션 가중치를 만들 때 Q와 K의 점수에 적용하는 함수는?", options: ["ReLU", "softmax", "tanh", "max"], answer: 1, explain: "softmax로 0~1, 합 1인 가중치를 만듭니다." },
        { kind: "ox", q: "어텐션은 가장 관련 있는 단어 하나만 골라 그 정보를 가져온다.", answer: false, explain: "모든 단어의 V를 가중치만큼 섞습니다." },
      ] },
    { id: "dl-07-3", title: "Transformer와 대규모 언어 모델", minutes: 18, concepts: ["dl.attention"],
      quiz: [
        { kind: "ox", q: "어텐션은 단어 순서를 스스로 알기 때문에 위치 정보가 필요 없다.", answer: false, explain: "어텐션은 순서를 모르므로 임베딩에 위치 정보를 더해 줍니다." },
        { kind: "choice", q: "GPT 같은 LLM이 사전학습에서 배우는 일은?", options: ["문장 중간 빈칸 맞히기", "다음 토큰 맞히기", "사진 분류", "데이터베이스 검색"], answer: 1, explain: "지금까지의 글을 보고 다음 토큰의 확률을 맞히도록 학습합니다." },
        { kind: "choice", q: "LLM이 그럴듯하지만 틀린 말(환각)을 하는 근본 이유는?", options: ["계산이 병렬이라서", "사실을 확인하지 않고 그럴듯한 다음 토큰을 이어 쓰기 때문", "위치 정보가 없어서", "모델이 너무 작아서"], answer: 1, explain: "기본 LLM은 검색하지 않고 학습한 패턴으로 이어 쓰기 때문에, 출처 확인과 RAG가 필요합니다." },
      ] }] },
  { id: "dl-08", track: "dl", title: "생성 모델", summary: "오토인코더 · 복원 오차 이상 탐지, GAN, 확산 모델", level: "실무",
    concepts: ["dl.generative"],
    lessons: [
    { id: "dl-08-1", title: "압축했다 되살리기: 오토인코더", minutes: 15, concepts: ["dl.generative"],
      quiz: [
        { kind: "choice", q: "정상 데이터로만 학습한 오토인코더에 처음 보는 고장 데이터가 들어오면?", options: ["복원 오차가 작다", "복원 오차가 크다", "정답 라벨을 출력한다", "학습이 멈춘다"], answer: 1, explain: "정상 패턴으로만 압축 · 복원하니 처음 보는 패턴은 엉망으로 복원되어 오차가 큽니다." },
        { kind: "ox", q: "오토인코더를 학습하려면 정답 라벨이 따로 있어야 한다.", answer: false, explain: "입력 자체가 정답이라 라벨이 필요 없는 비지도 학습입니다." },
      ] },
    { id: "dl-08-2", title: "새로 만드는 AI: GAN과 확산 모델", minutes: 15, concepts: ["dl.generative"],
      quiz: [
        { kind: "ox", q: "GAN 학습이 끝나면 판별자를 최종 모델로 쓴다.", answer: false, explain: "판별자는 코치 역할이고, 실제로 쓰는 것은 생성자입니다." },
        { kind: "choice", q: "확산 모델이 새 사진을 만드는 방법은?", options: ["판별자를 속이도록 학습한 생성자로 한 번에 만든다", "순수 잡음에서 출발해 잡음을 조금씩 지우기를 반복한다", "학습한 사진을 잘라 붙인다", "잠재 공간을 PCA로 줄인다"], answer: 1, explain: "학습한 '한 단계 잡음 지우기'를 수십~수백 번 반복해 새 사진이 드러나게 합니다." },
      ] }] },
  { id: "dl-09", track: "dl", title: "딥러닝 실무", summary: "사전학습 모델, 특징 추출 · 미세 조정, 프로젝트 한 바퀴, 설정값 체크리스트", level: "실무",
    concepts: ["dl.transfer"],
    lessons: [
    { id: "dl-09-1", title: "처음부터 만들지 않는다: 전이 학습", minutes: 15, concepts: ["dl.transfer"],
      quiz: [
        { kind: "choice", q: "불량 사진이 500장뿐이다. 사전학습 CNN으로 시작할 때 가장 알맞은 방법은?", options: ["처음부터 학습", "몸통은 고정하고 새 머리만 학습(특징 추출)", "모든 층을 큰 학습률로 다시 학습", "머리를 그대로 두고 몸통만 교체"], answer: 1, explain: "데이터가 적으면 몸통을 고정한 특징 추출이 과적합 위험이 낮고 빠릅니다." },
        { kind: "ox", q: "미세 조정할 때는 빨리 끝내기 위해 학습률을 처음보다 크게 한다.", answer: false, explain: "이미 좋은 가중치를 망가뜨리지 않도록 훨씬 작은 학습률로 조금씩 고칩니다." },
      ] },
    { id: "dl-09-2", title: "딥러닝 프로젝트 한 바퀴", minutes: 15, concepts: ["dl.transfer"],
      quiz: [
        { kind: "choice", q: "학습 손실은 줄고 검증 손실은 오른다. 먼저 손볼 설정으로 알맞지 않은 것은?", options: ["조기 종료", "드롭아웃", "데이터 증강", "모델을 더 크게 키우기"], answer: 3, explain: "과적합 신호이므로 모델을 줄이거나 규제를 더합니다. 키우는 것은 둘 다 높게 멈출 때입니다." },
        { kind: "ox", q: "학습이 잘 안 될 때는 여러 설정을 한꺼번에 바꿔 빨리 찾는 것이 좋다.", answer: false, explain: "한 번에 하나씩 바꾸고 기록해야 무엇이 효과였는지 알 수 있습니다." },
      ] }] },
];

// 트랙 페이지의 구역(단원). 같은 구역의 코스는 COURSES 순서에서 이어져 있어야 한다.
// DAY 번호는 구역과 관계없이 트랙 전체에서 이어 매긴다(dayNo). 구역에 없는 코스는 맨 뒤에 머리글 없이 붙는다.
export const SECTIONS = {
  "python-basic": [
    { id: "start", label: "시작하기", en: "Start", blurb: "파이썬이 무엇이고 어디서 실행하는지", courses: ["pb-00"] },
    { id: "data", label: "자료형과 자료구조", en: "Data Types", blurb: "숫자 · 문자열 · 리스트 · 딕셔너리로 값을 담고 다루기", courses: ["pb-01", "pb-02", "pb-03", "pb-04", "pb-05", "pb-06"] },
    { id: "flow", label: "제어문과 함수", en: "Control Flow", blurb: "조건 · 반복으로 흐름을 만들고 함수로 묶기", courses: ["pb-07", "pb-08", "pb-09"] },
    { id: "practical", label: "실무 문법", en: "Practical", blurb: "파일 입출력, 컴프리헨션 · 람다, 예외 처리, 표준 라이브러리", courses: ["pb-10", "pb-11", "pb-12", "pb-13"] },
  ],
  "python-da": [
    { id: "numpy", label: "NumPy", en: "NumPy", blurb: "배열로 숫자를 한꺼번에 계산하기", courses: ["da-01", "da-02"] },
    { id: "pandas-basic", label: "pandas 기초", en: "pandas Basics", blurb: "표를 읽고, 고르고, 깨끗하게 다듬기", courses: ["da-03", "da-04", "da-05"] },
    { id: "pandas-adv", label: "pandas 활용", en: "pandas in Practice", blurb: "묶어서 요약하고, 여러 표를 합치고, 시간 순으로 보기", courses: ["da-06", "da-07", "da-08"] },
  ],
  "python-viz": [
    { id: "matplotlib", label: "matplotlib", en: "matplotlib", blurb: "파이썬 그래프의 바탕과 차트 갤러리: 도화지와 그래프 칸", courses: ["da-09"] },
    { id: "seaborn", label: "seaborn", en: "seaborn", blurb: "표와 열 이름만으로 그리는 통계 그래프, 차트 갤러리, EDA 자동화", courses: ["da-10"] },
    { id: "compare", label: "비교", en: "Comparison", blurb: "어느 쪽이 더 큰가: 막대 · 오차 막대 · 묶음 막대 · 점 그래프", courses: ["vz-01", "vz-02", "vz-03", "vz-04"] },
    { id: "trend", label: "추이", en: "Trend", blurb: "시간에 따라 어떻게 변하나: 선 그래프와 다듬기, 여러 시계열", courses: ["vz-05", "vz-06", "vz-07"] },
    { id: "dist", label: "분포", en: "Distribution", blurb: "값들이 어떻게 퍼져 있나: 히스토그램부터 스웜까지", courses: ["vz-08", "vz-09", "vz-10", "vz-11", "vz-12", "vz-13"] },
    { id: "relation", label: "관계", en: "Relationship", blurb: "두 값이 함께 움직이나: 산점도 · 추세선 · 상관 · pairplot", courses: ["vz-14", "vz-15", "vz-16", "vz-17"] },
    { id: "composition", label: "구성", en: "Composition", blurb: "전체 중 얼마인가: 파이 · 누적 막대 · 누적 영역", courses: ["vz-18", "vz-19", "vz-20"] },
    { id: "wrapup", label: "정리", en: "Wrap-up", blurb: "어떤 차트를 쓸지 고르는 기준과 체크리스트", courses: ["da-11"] },
  ],
  sql: [
    { id: "start", label: "시작하기", en: "Start", blurb: "SQL과 데이터베이스, 실습 데이터 소개", courses: ["sq-00"] },
    { id: "select", label: "조회 기초", en: "Querying", blurb: "필요한 행과 열을 골라 정렬하기", courses: ["sq-01", "sq-02"] },
    { id: "aggregate", label: "집계와 변환", en: "Aggregation", blurb: "묶어서 세고 더하기, 값을 바꾸고 구간 나누기", courses: ["sq-03", "sq-06"] },
    { id: "tables", label: "여러 표 다루기", en: "Joins", blurb: "표를 이어 붙이고, 쿼리 안에 쿼리 넣기", courses: ["sq-04", "sq-05"] },
    { id: "analysis", label: "분석 쿼리", en: "Analytics", blurb: "윈도우 함수와 KPI · 퍼널 · 리텐션", courses: ["sq-07", "sq-08"] },
    { id: "design", label: "데이터베이스 설계", en: "Database Design", blurb: "표를 설계하고 나누고, 만들고, 안전하게 바꾸고, 빨리 찾기", courses: ["sq-09", "sq-10", "sq-11", "sq-12"] },
  ],
  stats: [
    { id: "start", label: "시작하기", en: "Start", blurb: "통계가 하는 일과 기본 용어", courses: ["st-00"] },
    { id: "describe", label: "요약과 확률", en: "Describe · Probability", blurb: "데이터를 숫자로 요약하고, 확률과 분포로 불확실성 다루기", courses: ["st-01", "st-09", "st-02"] },
    { id: "inference", label: "추론 통계", en: "Inference", blurb: "표본으로 모집단을 추정하고 검정하기", courses: ["st-03", "st-04", "st-05"] },
    { id: "relation", label: "비교와 관계", en: "Comparison · Relation", blurb: "여러 집단 비교, 두 변수의 관계와 회귀", courses: ["st-06", "st-07"] },
    { id: "tests", label: "검정 도구 상자", en: "Test Toolbox", blurb: "비율 · 분산 · 정규성 · 이원 ANOVA · 대응 · 다중비교 · 상관 검정, 그리고 검정 고르기 지도", courses: ["st-12"] },
    { id: "practice", label: "실무 해석", en: "In Practice", blurb: "A/B 테스트 설계와 흔한 해석 실수", courses: ["st-08", "st-10"] },
    { id: "quality", label: "품질 통계", en: "Quality (SPC)", blurb: "관리도로 공정을 지켜보고, 공정능력지수로 실력을 재기", courses: ["st-11"] },
  ],
  ml: [
    { id: "start", label: "시작하기", en: "Start", blurb: "기계가 배운다는 것, 문제 유형별 모델 지도", courses: ["ml-00"] },
    { id: "prep", label: "데이터 준비", en: "Data Prep", blurb: "특성과 정답, 결측치 · 인코딩, 학습용과 시험용, 누수", courses: ["ml-01"] },
    { id: "regression", label: "지도학습 · 회귀", en: "Supervised · Regression", blurb: "숫자를 맞히는 선형 모델: 최소제곱, 경사하강법, 다항회귀, 규제", courses: ["ml-02"] },
    { id: "classification", label: "지도학습 · 분류", en: "Supervised · Classification", blurb: "종류를 맞히는 모델과 평가: 로지스틱 · 소프트맥스, 지표, KNN · 나이브 베이즈 · SVM", courses: ["ml-12", "ml-03", "ml-10"] },
    { id: "ensemble", label: "트리와 앙상블", en: "Trees · Ensembles", blurb: "회귀 · 분류에 함께 쓰는 결정트리, 랜덤포레스트, 그래디언트 부스팅", courses: ["ml-04"] },
    { id: "tuning", label: "모델 다듬기", en: "Tuning", blurb: "교차검증 · 하이퍼파라미터, 피처 엔지니어링, 불균형 데이터", courses: ["ml-05", "ml-06", "ml-08"] },
    { id: "unsupervised", label: "비지도학습", en: "Unsupervised", blurb: "정답 없이 묶고(군집), 줄이고(차원 축소), 튀는 것 찾기(이상 탐지)", courses: ["ml-07", "ml-13"] },
    { id: "field", label: "해석과 현장", en: "Explain · Deploy", blurb: "모델이 왜 그렇게 판단했나, 저장 · 드리프트 감시, 미니 프로젝트", courses: ["ml-09", "ml-11"] },
  ],
  dl: [
    { id: "start", label: "시작하기", en: "Start", blurb: "머신러닝과 딥러닝은 무엇이 다른가", courses: ["dl-00"] },
    { id: "basics", label: "신경망 기초", en: "Neural Nets", blurb: "뉴런 · 손실 · 경사하강법 · 역전파 · 과적합", courses: ["dl-01", "dl-02", "dl-03", "dl-04"] },
    { id: "arch", label: "구조별 모델", en: "Architectures", blurb: "이미지는 CNN, 순서는 RNN, 문장은 어텐션", courses: ["dl-05", "dl-06", "dl-07"] },
    { id: "practice", label: "생성과 실무", en: "Generative · Practice", blurb: "생성 모델과 사전학습 모델 활용", courses: ["dl-08", "dl-09"] },
  ],
};

export const LESSONS = COURSES.flatMap((c) => c.lessons.map((l) => ({ ...l, course: c.id, track: c.track, dir: c.dir || c.track })));
export const courseById = Object.fromEntries(COURSES.map((c) => [c.id, c]));
export const lessonById = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
export const trackById = Object.fromEntries(TRACKS.map((t) => [t.id, t]));
export const coursesOf = (trackId) => COURSES.filter((c) => c.track === trackId);
export const courseOfUnit = (unitId) => COURSES.find((c) => c.unit === unitId);
// dir: 레슨 md 폴더. 트랙을 옮긴 코스(da-09~da-11 → python-viz)는 파일을 원래 폴더에 둔다.
export const lessonPath = (l) => `content/${l.dir || l.track}/${l.id}.md`;
// 트랙의 코스를 구역별로 나눈다. [{ section | null, courses: [...] }]
export const sectionsOf = (trackId) => {
  const list = coursesOf(trackId);
  const used = new Set();
  const out = (SECTIONS[trackId] || []).map((sec) => {
    const courses = list.filter((c) => sec.courses.includes(c.id));
    courses.forEach((c) => used.add(c.id));
    return { section: sec, courses };
  }).filter((g) => g.courses.length);
  const rest = list.filter((c) => !used.has(c.id));
  if (rest.length) out.push({ section: null, courses: rest });
  return out;
};
