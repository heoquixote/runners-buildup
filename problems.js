// 문제 은행. 문제 추가·수정은 이 파일에서 한다.
// type: "io"(stdin → stdout) | "function"(solution 반환값) | "steps"(변수 검사)
// tests[].hidden 이 true 인 케이스는 학생에게 입력·기대값을 보여주지 않는다.
// 모든 모범답안은 `node scripts/verify.mjs` 로 자동 검증한다.

export const UNITS = [
  {
    id: 1,
    title: "기초 문법과 제어문",
    summary: "input, 형변환, if, for, while",
    note: `
<h4>input()은 항상 문자열을 돌려줍니다</h4>
<p>숫자로 계산하려면 <code>int()</code>나 <code>float()</code>로 바꿔야 합니다. 측정값처럼 소수점이 있으면 <code>float()</code>를 씁니다.</p>
<pre>lot = int(input("로트 번호: "))
x = float(input("측정값: "))</pre>
<h4>나머지 연산자 %</h4>
<p><code>n % 2 == 0</code>이면 짝수입니다. <code>i % 5 == 0</code>처럼 쓰면 "5개마다 1개" 같은 발취 규칙을 표현할 수 있습니다.</p>
<h4>if / elif / else</h4>
<p>규격 판정처럼 경우가 셋 이상이면 <code>elif</code>를 씁니다. 경계값(9.5, 10.5)이 규격 안인지 밖인지 <code>&lt;</code>와 <code>&lt;=</code>를 구분해서 생각하세요.</p>
<h4>for와 range</h4>
<p><code>range(1, n + 1)</code>은 1부터 n까지입니다. 끝 숫자는 포함되지 않습니다.</p>
<h4>while과 break</h4>
<p>"조건을 만족할 때까지 반복"은 <code>while True:</code> 안에서 조건을 만족하면 <code>break</code>로 빠져나옵니다.</p>`,
  },
  {
    id: 2,
    title: "문자열 다루기",
    summary: "인덱싱, 슬라이싱, 결합, len, split",
    note: `
<h4>인덱싱</h4>
<p>특정 한 글자를 가져옵니다. 파이썬은 0부터 셉니다. <code>s[-3]</code>은 뒤에서 세 번째 글자입니다.</p>
<p class="qc">활용: 장비 모델명 <code>'EQP-A2024-001'</code>에서 뒤 3자리 일련번호만 추출</p>
<h4>슬라이싱</h4>
<p><code>s[a:b]</code>는 a부터 b-1까지, <code>s[3:]</code>는 4번째 글자부터 끝까지, <code>s[-3:]</code>는 마지막 3글자입니다.</p>
<p class="qc">활용: 센서 파일명 <code>'Temp_Sensor_20240901.csv'</code>에서 날짜 부분만 분리</p>
<pre>String = 'Hello, World'
print(String[4])    # o
print(String[-3])   # r
print(String[3:])   # lo, World</pre>
<h4>결합과 길이</h4>
<p><code>+</code>로 문자열을 합치고, <code>len()</code>으로 글자 수를 셉니다.</p>
<p class="qc">활용: 부서 코드와 검사 일자를 합쳐 <code>'QA-2024-09-01'</code> 같은 ID 생성, 결과 코드가 8자리인지 검증</p>
<h4>대소문자 변환과 split</h4>
<p><code>.upper()</code>, <code>.lower()</code>, <code>.capitalize()</code>로 표기를 통일합니다. <code>.split(',')</code>은 구분자로 잘라 리스트를 돌려줍니다.</p>
<p class="qc">활용: 로그 <code>'ERROR,Temp,A20240901,High'</code>를 쉼표로 나눠 상태, 종류, 일시, 값을 추출</p>`,
  },
  {
    id: 3,
    title: "알고리즘 (함수형)",
    summary: "solution 함수, return, min/max, enumerate, 딕셔너리",
    note: `
<h4>solution 함수 문제</h4>
<p>프로그래머스처럼 <code>solution</code> 함수를 완성하는 문제입니다. 채점기가 여러 입력으로 함수를 호출하고 <b>반환값</b>을 비교합니다.</p>
<h4>print가 아니라 return</h4>
<p>값을 화면에 출력(<code>print</code>)하면 채점기는 받을 수 없습니다. 결과는 반드시 <code>return</code>으로 돌려주세요.</p>
<h4>자주 쓰는 도구</h4>
<pre>min([3, 11, 5])          # 3
max(best, cur)           # 둘 중 큰 값
for i, v in enumerate(values):
    print(i, v)          # 인덱스와 값을 함께
[c for c in codes if len(c) != 8]   # 조건에 맞는 것만 모으기</pre>`,
  },
  {
    id: 4,
    title: "NumPy 품질 데이터",
    summary: "배열 연산, 통계량, 불리언 인덱싱, axis, 이상치",
    note: `
<h4>배열은 한 번에 계산합니다</h4>
<p>NumPy 배열끼리는 같은 위치끼리 바로 연산됩니다. 반복문 없이 일별 불량률을 구할 수 있습니다.</p>
<pre>import numpy as np
defects = np.array([12, 8, 15, 10, 5])
production = np.array([1000, 1050, 980, 1020, 950])
rate = defects / production * 100
np.round(rate, 2)    # 소수 둘째 자리 반올림</pre>
<h4>기본 통계량</h4>
<p><code>np.sum</code>, <code>np.mean</code>, <code>arr.std(ddof=1)</code>. 표본 표준편차는 <code>ddof=1</code>입니다. 공정능력지수(Cp, Cpk) 계산에서 자주 틀리는 부분입니다.</p>
<h4>불리언 인덱싱</h4>
<pre>bool_idx = sensor_data > 25.0     # True/False 배열
sensor_data[bool_idx]             # 조건을 만족하는 값만
sensor_data[bool_idx] = -1        # 조건을 만족하는 값을 한 번에 변경</pre>
<p class="qc">채점은 출력 문자열이 아니라 문제에서 정한 <b>변수 값</b>으로 합니다. 변수 이름을 그대로 쓰세요.</p>`,
  },
];

export const PROBLEMS = [
  // ── 단원 1 ─────────────────────────────────────────────
  {
    id: "1-1",
    unit: 1,
    title: "로트 번호로 생산 라인 배정",
    type: "io",
    level: 1,
    uses: [["input()", "키보드(입력값)에서 한 줄을 문자열로 읽기"], ["int()", "문자열을 정수로 바꾸기"], ["%", "나머지 연산자. lot % 2 == 0 이면 짝수"], ["if / else", "조건에 따라 다른 문장 실행"], ["print()", "결과 출력"]],
    origin: "짝수/홀수 판별하기",
    desc: `<p>로트 번호를 입력받아 <b>짝수면 A라인, 홀수면 B라인</b>에 배정하세요.</p>
<p>출력 형식: <code>A라인 배정</code> 또는 <code>B라인 배정</code></p>`,
    starter: `lot = int(input("로트 번호: "))
# 짝수면 "A라인 배정", 홀수면 "B라인 배정"을 출력하세요
`,
    solution: `lot = int(input("로트 번호: "))
if lot % 2 == 0:
    print("A라인 배정")
else:
    print("B라인 배정")
`,
    hints: ["2로 나눈 나머지는 lot % 2 입니다.", "나머지가 0이면 짝수입니다."],
    tests: [
      { stdin: "1024", expected: "A라인 배정" },
      { stdin: "777", expected: "B라인 배정" },
      { stdin: "0", expected: "A라인 배정", hidden: true },
      { stdin: "1", expected: "B라인 배정", hidden: true },
    ],
  },
  {
    id: "1-2",
    unit: 1,
    title: "시료 라벨 출력",
    type: "io",
    level: 1,
    uses: [["int(input())", "개수를 정수로 입력받기"], ["for i in range(1, n + 1)", "1부터 n까지 반복"], ["f-string", "f\"SAMPLE-{i}\" 처럼 변수를 문자열에 끼워 넣기"]],
    origin: "1부터 5까지 출력하기",
    desc: `<p>시료 개수 <code>n</code>을 입력받아 <code>SAMPLE-1</code>부터 <code>SAMPLE-n</code>까지 한 줄에 하나씩 출력하세요.</p>`,
    starter: `n = int(input("시료 개수: "))
`,
    solution: `n = int(input("시료 개수: "))
for i in range(1, n + 1):
    print(f"SAMPLE-{i}")
`,
    hints: ["for i in range(1, n + 1): 을 쓰면 1부터 n까지 반복합니다.", "f-string: f\"SAMPLE-{i}\""],
    tests: [
      { stdin: "3", expected: "SAMPLE-1\nSAMPLE-2\nSAMPLE-3" },
      { stdin: "1", expected: "SAMPLE-1", hidden: true },
      { stdin: "0", expected: "", hidden: true },
    ],
  },
  {
    id: "1-3",
    unit: 1,
    title: "발취 검사 대상 번호",
    type: "io",
    level: 1,
    uses: [["for + range()", "1부터 N까지 반복"], ["%", "i % 5 == 0 이면 5의 배수"], ["if", "조건에 맞는 번호만 출력"]],
    origin: "3의 배수만 출력하기",
    desc: `<p>1번부터 N번 제품 중 <b>5개마다 1개씩</b> 발취해 검사합니다. 발취 대상(5의 배수) 번호를 한 줄에 하나씩 출력하세요.</p>`,
    starter: `N = int(input("생산 수량: "))
`,
    solution: `N = int(input("생산 수량: "))
for i in range(1, N + 1):
    if i % 5 == 0:
        print(i)
`,
    hints: ["1부터 N까지 반복하면서 i % 5 == 0 인지 확인하세요."],
    tests: [
      { stdin: "12", expected: "5\n10" },
      { stdin: "4", expected: "" },
      { stdin: "25", expected: "5\n10\n15\n20\n25", hidden: true },
    ],
  },
  {
    id: "1-4",
    unit: 1,
    title: "불량 수 막대 표시",
    type: "io",
    level: 1,
    uses: [["input()", "라인 이름(문자열) 입력"], ["int()", "불량 수를 정수로 변환"], ["print(..., end=\"\")", "줄바꿈 없이 이어서 출력"], ["for + range(n)", "n번 반복"]],
    origin: "별 5개 출력하기",
    desc: `<p>라인 이름과 불량 수를 차례로 입력받아, <code>라인 | #####</code>처럼 불량 수만큼 <code>#</code>을 가로로 출력하세요.</p>
<p>예: 라인 <code>A</code>, 불량 수 <code>5</code> → <code>A | #####</code></p>`,
    starter: `line = input("라인: ")
n = int(input("불량 수: "))
`,
    solution: `line = input("라인: ")
n = int(input("불량 수: "))
print(line, "| ", end="")
for i in range(n):
    print("#", end="")
print()
`,
    hints: ['print("#", end="") 는 줄을 바꾸지 않고 이어서 출력합니다.', '"#" * n 처럼 문자열 곱셈을 써도 됩니다.'],
    tests: [
      { stdin: "A\n5", expected: "A | #####" },
      { stdin: "C\n0", expected: "C |" },
      { stdin: "B\n12", expected: "B | ############", hidden: true },
    ],
  },
  {
    id: "1-5",
    unit: 1,
    title: "규격 안에 들어올 때까지 재측정",
    type: "io",
    level: 3,
    challenge: true,
    uses: [["while True", "조건을 만족할 때까지 계속 반복"], ["break", "반복문 빠져나오기"], ["count += 1", "측정 횟수 세기"], ["9.5 <= x <= 10.5", "범위 비교를 한 번에"], ["f-string", "결과 문장 만들기"]],
    origin: "비밀번호 맞추기",
    desc: `<p>규격(9.5 이상 10.5 이하) 안의 값이 나올 때까지 측정값을 계속 입력받으세요.</p>
<ul><li>규격 밖이면 <code>재측정 필요</code>를 출력하고 다시 입력받습니다.</li>
<li>규격 안이면 <code>합격: 값 (측정 n회)</code>를 출력하고 끝냅니다.</li></ul>`,
    starter: `count = 0
while True:
    x = float(input("측정값: "))
    # 여기에 작성하세요
`,
    solution: `count = 0
while True:
    x = float(input("측정값: "))
    count += 1
    if 9.5 <= x <= 10.5:
        print(f"합격: {x} (측정 {count}회)")
        break
    print("재측정 필요")
`,
    hints: ["측정할 때마다 count를 1씩 늘리세요.", "규격 안이면 출력 후 break로 반복을 끝냅니다."],
    tests: [
      { stdin: "10.8\n9.2\n10.1", expected: "재측정 필요\n재측정 필요\n합격: 10.1 (측정 3회)" },
      { stdin: "10.0", expected: "합격: 10.0 (측정 1회)" },
      { stdin: "11\n10.5", expected: "재측정 필요\n합격: 10.5 (측정 2회)", hidden: true },
    ],
  },

  // ── 단원 2 ─────────────────────────────────────────────
  {
    id: "2-1",
    unit: 2,
    title: "장비 모델명에서 일련번호 추출",
    type: "function",
    level: 1,
    uses: [["def solution(model):", "주어진 함수 틀 안에 작성"], ["인덱싱·슬라이싱", "model[-3:] 처럼 뒤에서 3글자"], ["return", "답을 돌려주기"]],
    origin: "인덱싱",
    desc: `<p><code>solution(model)</code>은 <code>'EQP-A2024-001'</code> 형식의 모델명에서 <b>뒤 3자리 일련번호</b>를 문자열로 반환합니다.</p>`,
    starter: `def solution(model):
    answer = ''
    return answer
`,
    solution: `def solution(model):
    return model[-3:]
`,
    hints: ["음수 인덱스는 뒤에서부터 셉니다.", "model[-3:] 는 마지막 3글자입니다."],
    tests: [
      { args: ["EQP-A2024-001"], expected: "001" },
      { args: ["EQP-B2023-117"], expected: "117" },
      { args: ["LINE2-EQP-C2025-940"], expected: "940", hidden: true },
    ],
  },
  {
    id: "2-2",
    unit: 2,
    title: "센서 파일명에서 날짜 분리",
    type: "function",
    level: 2,
    uses: [["슬라이싱", "문자열[시작:끝] 으로 날짜 부분 잘라내기"], ["음수 인덱스", "-4 는 뒤에서 4번째(.csv 앞)"], ["+ 연결", "\"2024\" + \"-\" + \"01\""], ["return", "답을 돌려주기"]],
    origin: "슬라이싱",
    desc: `<p>센서 파일명은 <code>.csv</code> 바로 앞 8자리가 날짜(YYYYMMDD)입니다. 센서 이름 길이는 파일마다 다릅니다.</p>
<p><code>solution(filename)</code>이 날짜를 <code>'YYYY-MM-DD'</code> 형식으로 반환하도록 완성하세요.</p>`,
    starter: `def solution(filename):
    answer = ''
    return answer
`,
    solution: `def solution(filename):
    d = filename[-12:-4]
    return d[:4] + "-" + d[4:6] + "-" + d[6:]
`,
    hints: ["'.csv'는 4글자, 날짜는 그 앞 8글자입니다. 뒤에서부터 자르세요.", "날짜 8자리를 [:4], [4:6], [6:]로 나누세요."],
    tests: [
      { args: ["Temp_Sensor_20240901.csv"], expected: "2024-09-01" },
      { args: ["Humid_Sensor_20241231.csv"], expected: "2024-12-31" },
      { args: ["P_20250105.csv"], expected: "2025-01-05", hidden: true },
    ],
  },
  {
    id: "2-3",
    unit: 2,
    title: "검사 ID 만들기",
    type: "function",
    level: 1,
    uses: [["upper()", "문자열을 대문자로"], ["+ 연결", "부서 코드와 날짜 잇기"], ["return", "답을 돌려주기"]],
    origin: "문자열 결합, upper()",
    desc: `<p>부서 코드 <code>dept</code>와 검사 일자 <code>date</code>를 합쳐 <code>'QA-2024-09-01'</code> 형식의 ID를 반환하세요. 부서 코드는 <b>대문자</b>로 통일합니다.</p>`,
    starter: `def solution(dept, date):
    answer = ''
    return answer
`,
    solution: `def solution(dept, date):
    return dept.upper() + "-" + date
`,
    hints: ["문자열은 + 로 이어 붙입니다.", "dept.upper() 는 대문자로 바꾼 문자열을 돌려줍니다."],
    tests: [
      { args: ["qa", "2024-09-01"], expected: "QA-2024-09-01" },
      { args: ["QC", "2025-01-15"], expected: "QC-2025-01-15" },
      { args: ["Qa", "2025-03-02"], expected: "QA-2025-03-02", hidden: true },
    ],
  },
  {
    id: "2-4",
    unit: 2,
    title: "검사 결과 코드 길이 검증",
    type: "function",
    level: 2,
    uses: [["for 반복", "리스트의 코드 하나씩 보기"], ["len()", "문자열 길이"], ["!=", "같지 않다"], ["append() 또는 리스트 컴프리헨션", "조건에 맞는 것만 모으기"]],
    origin: "len()",
    desc: `<p>검사 결과 코드는 반드시 <b>8자리</b>여야 합니다. 8자리가 아닌 코드만 입력 순서대로 리스트로 반환하세요. 모두 정상이면 빈 리스트를 반환합니다.</p>`,
    starter: `def solution(codes):
    answer = []
    return answer
`,
    solution: `def solution(codes):
    return [c for c in codes if len(c) != 8]
`,
    hints: ["for 문으로 하나씩 보면서 len(c) != 8 이면 append 하세요."],
    tests: [
      { args: [["AB123456", "AB12345", "XY987654321"]], expected: ["AB12345", "XY987654321"] },
      { args: [["QC000001"]], expected: [] },
      { args: [["", "12345678", "1234567"]], expected: ["", "1234567"], hidden: true },
    ],
  },
  {
    id: "2-5",
    unit: 2,
    title: "설비 로그 정리 리포트",
    type: "function",
    level: 3,
    challenge: true,
    uses: [["split(\",\")", "쉼표로 칸 나누기"], ["strip()", "앞뒤 공백 지우기"], ["upper()", "대소문자 통일해서 비교"], ["len()", "칸 수가 4개인지 확인"], ["슬라이싱 + 연결", "A20240901 → 2024-09-01"], ["continue", "잘못된 줄은 건너뛰기"]],
    origin: "split() 응용 (단원 2 종합)",
    desc: `<p>설비 로그는 <code>'상태,종류,일시,값'</code> 형식입니다. 예: <code>'ERROR,Temp,A20240901,High'</code></p>
<p>상태가 <b>ERROR</b>인 로그만 골라 <code>'2024-09-01 Temp High'</code> 형식의 문자열 리스트로 반환하세요. 순서는 원래 순서를 따릅니다.</p>
<ul><li>현장 로그라 지저분합니다. 각 칸 앞뒤에 공백이 있을 수 있고, 상태는 <code>error</code>, <code>Error</code>처럼 대소문자가 섞여 있을 수 있습니다.</li>
<li>쉼표로 나눈 칸이 4개가 아닌 줄은 깨진 로그이므로 건너뜁니다.</li>
<li>일시 칸은 맨 앞 1글자(설비 코드) 뒤에 <code>YYYYMMDD</code>가 붙어 있습니다.</li></ul>`,
    starter: `def solution(logs):
    answer = []
    return answer
`,
    solution: `def solution(logs):
    answer = []
    for log in logs:
        parts = log.split(",")
        if len(parts) != 4:
            continue
        status = parts[0].strip()
        kind = parts[1].strip()
        when = parts[2].strip()
        value = parts[3].strip()
        if status.upper() != "ERROR":
            continue
        d = when[1:]
        answer.append(d[:4] + "-" + d[4:6] + "-" + d[6:] + " " + kind + " " + value)
    return answer
`,
    hints: ["먼저 log.split(',') 결과의 길이가 4인지 확인하고, 아니면 continue 로 건너뜁니다.", "각 칸에 .strip() 을 붙여 공백을 지우고, 상태는 .upper() == 'ERROR' 로 비교하세요.", "일시는 when[1:] 로 앞 글자를 뗀 뒤 [:4], [4:6], [6:] 으로 나눠 '-' 로 잇습니다."],
    tests: [
      { args: [["ERROR,Temp,A20240901,High", "OK,Temp,A20240901,Normal", "ERROR,Press,B20240902,Low"]], expected: ["2024-09-01 Temp High", "2024-09-02 Press Low"] },
      { args: [[" error , Temp , A20241005 , High ", "Error,Vib,C20241006,Over"]], expected: ["2024-10-05 Temp High", "2024-10-06 Vib Over"] },
      { args: [["ERROR,Temp,A20240901", "OK,ERROR_CHECK,A20240901,Normal"]], expected: [], hidden: true },
      { args: [[]], expected: [], hidden: true },
      { args: [["WARN,Temp,A20240903,High", "ERROR,Humi,D20241231,Low", "ERROR,Temp,A20241231,High,extra"]], expected: ["2024-12-31 Humi Low"], hidden: true },
    ],
  },

  // ── 단원 3 ─────────────────────────────────────────────
  {
    id: "3-1",
    unit: 3,
    title: "포장 단위 찾기",
    type: "function",
    level: 2,
    uses: [["for + range(1, n)", "1부터 n-1까지 시도"], ["%", "n % i == 1 인지 확인"], ["min() 또는 break", "가장 작은 값 고르기"]],
    origin: "나머지가 1이 되는 가장 작은 수 찾기 (프로그래머스)",
    desc: `<p>제품 <code>n</code>개를 <code>x</code>개씩 포장하면 정확히 <b>1개가 남도록</b> 하는 가장 작은 포장 단위 <code>x</code>를 반환하세요. 남은 1개는 재검사 시료로 씁니다. 답이 항상 존재함은 증명될 수 있습니다.</p>
<p>제한사항: 3 ≤ n ≤ 1,000,000 · 힌트: <code>min()</code></p>`,
    starter: `def solution(n):
    answer = 0
    return answer
`,
    solution: `def solution(n):
    answer = []
    for i in range(1, n):
        if n % i == 1:
            answer.append(i)
    return min(answer)
`,
    hints: ["1부터 n-1까지 나눠 보면서 나머지가 1인 수를 모으세요.", "모은 리스트에서 min()을 고르면 됩니다. 찾자마자 return 해도 됩니다."],
    tests: [
      { args: [10], expected: 3 },
      { args: [12], expected: 11 },
      { args: [7], expected: 2, hidden: true },
      { args: [1000000], expected: 3, hidden: true },
    ],
  },
  {
    id: "3-2",
    unit: 3,
    title: "연속 불량 최대 길이",
    type: "function",
    level: 2,
    uses: [["for 반복", "결과를 순서대로 보기"], ["변수 두 개", "현재 연속 길이와 최대 길이 따로 저장"], ["max()", "더 큰 값 남기기"]],
    origin: "신규",
    desc: `<p>검사 결과 리스트에서 <code>'P'</code>는 합격, <code>'F'</code>는 불량입니다. <b>F가 연속으로 나온 최대 길이</b>를 반환하세요. 연속 불량은 설비 이상의 신호입니다.</p>`,
    starter: `def solution(results):
    answer = 0
    return answer
`,
    solution: `def solution(results):
    best = cur = 0
    for r in results:
        cur = cur + 1 if r == "F" else 0
        best = max(best, cur)
    return best
`,
    hints: ["현재 연속 길이(cur)와 지금까지의 최대(best) 두 변수를 쓰세요.", "P를 만나면 cur를 0으로 되돌립니다."],
    tests: [
      { args: [["P", "F", "F", "P", "F", "F", "F"]], expected: 3 },
      { args: [["P", "P", "P", "P"]], expected: 0 },
      { args: [["F", "F", "F", "F", "F"]], expected: 5, hidden: true },
      { args: [["F", "P", "F", "P"]], expected: 1, hidden: true },
    ],
  },
  {
    id: "3-3",
    unit: 3,
    title: "관리 한계 이탈 위치 찾기",
    type: "function",
    level: 2,
    uses: [["enumerate()", "인덱스와 값을 함께 꺼내기"], ["or", "하한 미만 또는 상한 초과"], ["append() 또는 리스트 컴프리헨션", "위치 모으기"]],
    origin: "신규",
    desc: `<p>측정값 리스트 <code>values</code>와 관리 하한 <code>lcl</code>, 상한 <code>ucl</code>이 주어집니다. 한계를 벗어난 값의 <b>인덱스</b>를 리스트로 반환하세요. 한계값과 같은 값은 이탈이 아닙니다.</p>`,
    starter: `def solution(values, lcl, ucl):
    answer = []
    return answer
`,
    solution: `def solution(values, lcl, ucl):
    return [i for i, v in enumerate(values) if v < lcl or v > ucl]
`,
    hints: ["enumerate(values) 는 (인덱스, 값)을 함께 줍니다.", "v < lcl or v > ucl 이면 이탈입니다."],
    tests: [
      { args: [[10.1, 9.4, 10.0, 10.7, 10.2], 9.5, 10.5], expected: [1, 3] },
      { args: [[10.0, 10.5], 9.5, 10.5], expected: [] },
      { args: [[9.49, 9.5, 10.5, 10.51], 9.5, 10.5], expected: [0, 3], hidden: true },
    ],
  },

  {
    id: "3-4",
    unit: 3,
    title: "불량 유형별 건수 집계",
    type: "function",
    level: 2,
    uses: [["딕셔너리 {}", "유형을 키, 건수를 값으로 저장"], ["dict.get(키, 0)", "없는 키면 0으로 시작"], ["for 반복", "불량 기록 하나씩 보기"]],
    origin: "신규",
    desc: `<p>검사에서 나온 불량 유형 리스트 <code>defects</code>가 주어집니다. 유형별 건수를 <b>딕셔너리</b>로 반환하세요.</p>
<p>예: <code>["스크래치", "찍힘", "스크래치"]</code> → <code>{"스크래치": 2, "찍힘": 1}</code></p>
<p class="qc">현장 활용: 파레토 차트를 그리기 전 단계의 유형별 집계</p>`,
    starter: `def solution(defects):
    answer = {}
    return answer
`,
    solution: `def solution(defects):
    answer = {}
    for d in defects:
        answer[d] = answer.get(d, 0) + 1
    return answer
`,
    hints: ["빈 딕셔너리 answer = {} 에서 시작합니다.", "answer[d] = answer.get(d, 0) + 1 은 처음 나온 유형이면 0에서 1로, 이미 있으면 1을 더합니다."],
    tests: [
      { args: [["스크래치", "찍힘", "스크래치"]], expected: { "스크래치": 2, "찍힘": 1 } },
      { args: [["기포"]], expected: { "기포": 1 } },
      { args: [[]], expected: {}, hidden: true },
      { args: [["찍힘", "찍힘", "변색", "찍힘", "변색"]], expected: { "찍힘": 3, "변색": 2 }, hidden: true },
    ],
  },
  {
    id: "3-5",
    unit: 3,
    title: "이동평균으로 추세 보기",
    type: "function",
    level: 3,
    challenge: true,
    uses: [["슬라이싱 values[i:i+k]", "연속된 k개 꺼내기"], ["sum() / len()", "평균 계산"], ["round(값, 2)", "소수 둘째 자리 반올림"], ["range(len(values) - k + 1)", "구간 시작 위치 반복"]],
    origin: "신규",
    desc: `<p>측정값 리스트 <code>values</code>와 구간 크기 <code>k</code>가 주어집니다. 앞에서부터 연속된 <code>k</code>개씩의 평균(이동평균)을 소수 둘째 자리로 반올림해 리스트로 반환하세요.</p>
<p>예: <code>values = [10, 12, 11, 13]</code>, <code>k = 2</code> → <code>[11.0, 11.5, 12.0]</code></p>
<p>값이 <code>k</code>개보다 적으면 빈 리스트를 반환합니다.</p>
<p class="qc">현장 활용: 측정값의 잡음을 줄이고 공정이 서서히 올라가거나 내려가는 추세를 확인</p>`,
    starter: `def solution(values, k):
    answer = []
    return answer
`,
    solution: `def solution(values, k):
    answer = []
    for i in range(len(values) - k + 1):
        window = values[i:i + k]
        answer.append(round(sum(window) / k, 2))
    return answer
`,
    hints: ["구간의 시작 위치 i는 0부터 len(values) - k 까지입니다.", "values[i:i + k] 로 k개를 꺼낸 뒤 sum(...) / k"],
    tests: [
      { args: [[10, 12, 11, 13], 2], expected: [11.0, 11.5, 12.0] },
      { args: [[9.8, 10.1, 10.4, 10.0, 9.9], 3], expected: [10.1, 10.17, 10.1] },
      { args: [[10.0, 10.2], 3], expected: [], hidden: true },
      { args: [[5, 5, 5], 3], expected: [5.0], hidden: true },
    ],
  },

  // ── 단원 4 ─────────────────────────────────────────────
  {
    id: "4-1",
    unit: 4,
    title: "5일간 불량률 분석",
    type: "steps",
    level: 2,
    uses: [["np.array()", "NumPy 배열"], ["np.sum()", "합계"], ["np.mean()", "평균"], ["배열 / 배열", "같은 위치끼리 나누기"], ["np.round(배열, 2)", "소수 둘째 자리 반올림"]],
    origin: "실습 1: 5일간의 불량률 데이터 분석",
    desc: `<p>5일간 일별 불량품 수와 총 생산량 데이터입니다. NumPy로 아래 변수를 계산하세요. 채점은 <b>변수 값</b>으로 합니다.</p>
<ol><li><code>total_production</code>, <code>total_defects</code>: 총 생산량과 총 불량품 수</li>
<li><code>avg_daily_defects</code>: 평균 일별 불량품 수</li>
<li><code>daily_defect_rate</code>: 일별 불량률(%) 배열, 소수 둘째 자리 반올림</li>
<li><code>final_defect_rate</code>: 전체 기간 최종 불량률(%)</li></ol>`,
    starter: `import numpy as np

# 일별 불량품 수 (개)
defects = np.array([12, 8, 15, 10, 5])
# 일별 총 생산량 (개)
production = np.array([1000, 1050, 980, 1020, 950])

# 1. 총 생산량과 총 불량품 수
total_production = 0
total_defects = 0
print(f"1. 총 생산량: {total_production}개, 총 불량품 수: {total_defects}개")

# 2. 평균 일별 불량품 수
avg_daily_defects = 0
print(f"2. 평균 일별 불량품 수: {avg_daily_defects:.2f}개")

# 3. 일별 불량률(%)
daily_defect_rate = None
print(f"3. 일별 불량률 (%): {daily_defect_rate}")

# 4. 최종 불량률(%)
final_defect_rate = 0
print(f"4. 최종 불량률 (%): {final_defect_rate:.3f}%")
`,
    solution: `import numpy as np

defects = np.array([12, 8, 15, 10, 5])
production = np.array([1000, 1050, 980, 1020, 950])

total_production = np.sum(production)
total_defects = np.sum(defects)
print(f"1. 총 생산량: {total_production}개, 총 불량품 수: {total_defects}개")

avg_daily_defects = np.mean(defects)
print(f"2. 평균 일별 불량품 수: {avg_daily_defects:.2f}개")

daily_defect_rate = np.round(defects / production * 100, 2)
print(f"3. 일별 불량률 (%): {daily_defect_rate}")

final_defect_rate = total_defects / total_production * 100
print(f"4. 최종 불량률 (%): {final_defect_rate:.3f}%")
`,
    hints: ["np.sum(배열), np.mean(배열)", "배열끼리 나누면 같은 위치끼리 나눠집니다: defects / production * 100", "np.round(배열, 2)"],
    checks: [
      { label: "1단계 총 생산량 · 총 불량품 수", expr: "total_production == 5000 and total_defects == 50", hint: "np.sum으로 각각 더하세요." },
      { label: "2단계 평균 일별 불량품 수", expr: "abs(avg_daily_defects - 10) < 1e-6", hint: "np.mean(defects)" },
      { label: "3단계 일별 불량률 배열", expr: "np.allclose(daily_defect_rate, [1.2, 0.76, 1.53, 0.98, 0.53], atol=0.01)", hint: "defects / production * 100 을 소수 둘째 자리로 반올림하세요." },
      { label: "4단계 최종 불량률", expr: "abs(final_defect_rate - 1.0) < 1e-6", hint: "전체 불량 / 전체 생산 * 100" },
    ],
  },
  {
    id: "4-2",
    unit: 4,
    title: "온도 센서 데이터 정제",
    type: "steps",
    level: 2,
    uses: [["비교 연산 (배열 > 값)", "True/False 불리언 배열 만들기"], ["배열[불리언 배열]", "True 위치 값만 꺼내기"], ["배열[불리언 배열] = 값", "조건에 맞는 위치만 한 번에 바꾸기"]],
    origin: "실습 2: 온도 센서 데이터 정제",
    desc: `<p>센서 10개의 온도 중 기준 온도(25°C)를 <b>초과</b>하는 값을 걸러내고 -1로 바꾸세요.</p>
<ol><li><code>bool_idx</code>: 기준 초과 여부 불리언 배열</li>
<li><code>over_temp_values</code>: 초과한 값만 모은 배열</li>
<li><code>sensor_data</code>: 초과한 값을 -1로 바꾼 전체 배열</li></ol>`,
    starter: `import numpy as np

sensor_data = np.array([24.5, 25.1, 23.9, 26.0, 25.5, 24.8, 26.2, 23.5, 25.0, 24.9])
TARGET_TEMP = 25.0

# 1. 불리언 배열
bool_idx = None
print(f"1. 불리언 배열: {bool_idx}")

# 2. 기준 초과 값
over_temp_values = None
print(f"2. 기준 초과 값: {over_temp_values}")

# 3. 초과 값을 -1로 변경
print(f"3. 변경 후 배열: {sensor_data}")
`,
    solution: `import numpy as np

sensor_data = np.array([24.5, 25.1, 23.9, 26.0, 25.5, 24.8, 26.2, 23.5, 25.0, 24.9])
TARGET_TEMP = 25.0

bool_idx = sensor_data > TARGET_TEMP
print(f"1. 불리언 배열: {bool_idx}")

over_temp_values = sensor_data[bool_idx]
print(f"2. 기준 초과 값: {over_temp_values}")

sensor_data[bool_idx] = -1
print(f"3. 변경 후 배열: {sensor_data}")
`,
    hints: ["sensor_data > TARGET_TEMP 는 True/False 배열을 만듭니다.", "25.0은 '초과'가 아닙니다. >= 가 아니라 > 를 쓰세요.", "sensor_data[bool_idx] = -1"],
    checks: [
      { label: "1단계 불리언 배열", expr: "list(map(bool, bool_idx)) == [False, True, False, True, True, False, True, False, False, False]", hint: "25.0과 같은 값은 초과가 아닙니다(> 사용)." },
      { label: "2단계 기준 초과 값", expr: "np.allclose(over_temp_values, [25.1, 26.0, 25.5, 26.2])", hint: "sensor_data[bool_idx]" },
      { label: "3단계 -1로 바꾼 배열", expr: "np.allclose(sensor_data, [24.5, -1, 23.9, -1, -1, 24.8, -1, 23.5, 25.0, 24.9])", hint: "sensor_data[bool_idx] = -1" },
    ],
  },
  {
    id: "4-3",
    unit: 4,
    title: "공정능력지수 Cp, Cpk 계산",
    type: "steps",
    level: 3,
    uses: [["배열.mean()", "평균 μ"], ["배열.std(ddof=1)", "표본 표준편차 σ"], ["min()", "두 값 중 작은 값"], ["Cp = (USL−LSL)/6σ", "공정 산포 대비 규격 폭"], ["Cpk = min(USL−μ, μ−LSL)/3σ", "치우침까지 반영한 능력지수"]],
    origin: "신규",
    desc: `<p>축 지름(mm) 측정값 10개와 규격(USL 10.15, LSL 9.85)이 있습니다.</p>
<ol><li><code>mu</code>: 평균</li>
<li><code>sigma</code>: <b>표본</b> 표준편차</li>
<li><code>cp</code> = (USL − LSL) / (6σ)</li>
<li><code>cpk</code> = min(USL − μ, μ − LSL) / (3σ)</li></ol>
<p class="qc">Cpk ≥ 1.33이면 일반적으로 공정능력이 충분하다고 봅니다.</p>`,
    starter: `import numpy as np

d = np.array([10.02, 9.98, 10.05, 9.97, 10.01, 10.03, 9.99, 10.00, 10.04, 9.96])
USL, LSL = 10.15, 9.85

mu = 0
sigma = 0
cp = 0
cpk = 0
print(f"mu={mu}, sigma={sigma}, Cp={cp:.2f}, Cpk={cpk:.2f}")
`,
    solution: `import numpy as np

d = np.array([10.02, 9.98, 10.05, 9.97, 10.01, 10.03, 9.99, 10.00, 10.04, 9.96])
USL, LSL = 10.15, 9.85

mu = d.mean()
sigma = d.std(ddof=1)
cp = (USL - LSL) / (6 * sigma)
cpk = min(USL - mu, mu - LSL) / (3 * sigma)
print(f"mu={mu}, sigma={sigma}, Cp={cp:.2f}, Cpk={cpk:.2f}")
`,
    hints: ["d.mean()", "표본 표준편차는 d.std(ddof=1) 입니다. 기본값(ddof=0)은 모표준편차입니다."],
    checks: [
      { label: "1단계 평균 mu", expr: "abs(mu - 10.005) < 1e-6", hint: "d.mean()" },
      { label: "2단계 표본 표준편차 sigma", expr: "abs(sigma - 0.030277) < 1e-4", hint: "ddof=1 (표본 표준편차)인지 확인하세요." },
      { label: "3단계 Cp", expr: "abs(cp - 1.65) < 0.01", hint: "(USL - LSL) / (6 * sigma)" },
      { label: "4단계 Cpk", expr: "abs(cpk - 1.60) < 0.01", hint: "min(USL - mu, mu - LSL) / (3 * sigma)" },
    ],
  },
  {
    id: "4-4",
    unit: 4,
    title: "라인별 · 일별 생산 실적 집계",
    type: "steps",
    level: 2,
    uses: [["2차원 배열", "행 = 라인, 열 = 날짜"], ["배열.sum(axis=1)", "행(라인)마다 합계"], ["배열.sum(axis=0)", "열(날짜)마다 합계"], ["np.argmax()", "가장 큰 값의 위치"], ["배열.mean(axis=1)", "라인별 평균"]],
    origin: "신규",
    desc: `<p>3개 라인(A, B, C)의 5일간 생산 수량이 2차원 배열 <code>data</code>에 있습니다. 행은 라인, 열은 날짜입니다.</p>
<ol><li><code>line_total</code>: 라인별 5일 합계 (길이 3 배열)</li>
<li><code>day_total</code>: 날짜별 3개 라인 합계 (길이 5 배열)</li>
<li><code>best_line</code>: 합계가 가장 큰 라인의 <b>인덱스</b> (0=A, 1=B, 2=C)</li>
<li><code>line_avg</code>: 라인별 일평균, 소수 첫째 자리 반올림</li></ol>
<p class="qc">axis=1은 "옆으로(행 방향) 더하기", axis=0은 "아래로(열 방향) 더하기"로 기억하세요.</p>`,
    starter: `import numpy as np

# 행: A, B, C 라인 / 열: 1~5일차 생산 수량
data = np.array([
    [120, 118, 125, 130, 122],
    [ 98, 105, 110, 102, 100],
    [140, 135, 138, 142, 145],
])

# 1. 라인별 합계
line_total = None
print("1. 라인별 합계:", line_total)

# 2. 날짜별 합계
day_total = None
print("2. 날짜별 합계:", day_total)

# 3. 합계가 가장 큰 라인의 인덱스
best_line = None
print("3. 최다 생산 라인:", best_line)

# 4. 라인별 일평균 (소수 첫째 자리)
line_avg = None
print("4. 라인별 일평균:", line_avg)
`,
    solution: `import numpy as np

data = np.array([
    [120, 118, 125, 130, 122],
    [ 98, 105, 110, 102, 100],
    [140, 135, 138, 142, 145],
])

line_total = data.sum(axis=1)
print("1. 라인별 합계:", line_total)

day_total = data.sum(axis=0)
print("2. 날짜별 합계:", day_total)

best_line = np.argmax(line_total)
print("3. 최다 생산 라인:", best_line)

line_avg = np.round(data.mean(axis=1), 1)
print("4. 라인별 일평균:", line_avg)
`,
    hints: ["data.sum(axis=1) 은 각 행을 더합니다.", "np.argmax(line_total) 은 가장 큰 값의 인덱스를 줍니다.", "np.round(data.mean(axis=1), 1)"],
    checks: [
      { label: "1단계 라인별 합계", expr: "np.array_equal(np.asarray(line_total), [615, 515, 700])", hint: "data.sum(axis=1)" },
      { label: "2단계 날짜별 합계", expr: "np.array_equal(np.asarray(day_total), [358, 358, 373, 374, 367])", hint: "data.sum(axis=0)" },
      { label: "3단계 최다 생산 라인 인덱스", expr: "int(best_line) == 2", hint: "np.argmax(line_total)" },
      { label: "4단계 라인별 일평균", expr: "np.allclose(line_avg, [123.0, 103.0, 140.0])", hint: "data.mean(axis=1) 를 소수 첫째 자리로 반올림" },
    ],
  },
  {
    id: "4-5",
    unit: 4,
    title: "Z-점수로 이상치 찾기",
    type: "steps",
    level: 3,
    challenge: true,
    uses: [["배열.mean(), 배열.std(ddof=1)", "평균과 표본 표준편차"], ["(x - 평균) / 표준편차", "배열 전체를 한 번에 표준화"], ["np.abs()", "절댓값"], ["np.where(조건)[0]", "조건을 만족하는 인덱스"], ["len()", "개수"]],
    origin: "신규",
    desc: `<p>충전 중량(g) 측정값 10개가 있습니다. Z-점수가 절댓값 2를 넘으면 이상치로 봅니다.</p>
<ol><li><code>z</code>: 각 측정값의 Z-점수 배열 = (x − 평균) / 표본 표준편차</li>
<li><code>outlier_idx</code>: |z| &gt; 2 인 값의 <b>인덱스</b> 배열</li>
<li><code>n_outliers</code>: 이상치 개수</li></ol>
<p class="qc">Z-점수는 "평균에서 표준편차 몇 개만큼 떨어졌는가"입니다. 관리도의 ±3σ와 같은 생각입니다.</p>`,
    starter: `import numpy as np

x = np.array([50.2, 49.8, 50.1, 50.0, 53.9, 49.9, 50.3, 46.2, 50.1, 49.7])

# 1. Z-점수
z = None
print("1. Z-점수:", z)

# 2. |z| > 2 인 인덱스
outlier_idx = None
print("2. 이상치 위치:", outlier_idx)

# 3. 이상치 개수
n_outliers = 0
print("3. 이상치 개수:", n_outliers)
`,
    solution: `import numpy as np

x = np.array([50.2, 49.8, 50.1, 50.0, 53.9, 49.9, 50.3, 46.2, 50.1, 49.7])

z = (x - x.mean()) / x.std(ddof=1)
print("1. Z-점수:", np.round(z, 2))

outlier_idx = np.where(np.abs(z) > 2)[0]
print("2. 이상치 위치:", outlier_idx)

n_outliers = len(outlier_idx)
print("3. 이상치 개수:", n_outliers)
`,
    hints: ["z = (x - x.mean()) / x.std(ddof=1)", "np.where(np.abs(z) > 2) 는 튜플을 돌려주므로 [0]을 붙입니다.", "개수는 len(outlier_idx)"],
    checks: [
      { label: "1단계 Z-점수", expr: "np.allclose(z, (x - x.mean()) / x.std(ddof=1), atol=1e-6) and abs(float(z[4]) - 2.1268) < 1e-3", hint: "표본 표준편차(ddof=1)로 나눴는지 확인하세요." },
      { label: "2단계 이상치 인덱스", expr: "list(np.asarray(outlier_idx).tolist()) == [4, 7]", hint: "np.where(np.abs(z) > 2)[0]" },
      { label: "3단계 이상치 개수", expr: "int(n_outliers) == 2", hint: "len(outlier_idx)" },
    ],
  },
];
