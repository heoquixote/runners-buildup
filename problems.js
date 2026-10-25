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
    summary: "solution 함수, return, min/max, enumerate",
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
    summary: "배열 연산, 통계량, 불리언 인덱싱",
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
    title: "규격 판정 OK / LOW / HIGH",
    type: "io",
    level: 1,
    origin: "신규",
    desc: `<p>규격은 <b>9.5 이상 10.5 이하</b>입니다. 측정값을 입력받아 규격보다 작으면 <code>LOW</code>, 크면 <code>HIGH</code>, 규격 안이면 <code>OK</code>를 출력하세요.</p>`,
    starter: `x = float(input("측정값: "))
`,
    solution: `x = float(input("측정값: "))
if x < 9.5:
    print("LOW")
elif x > 10.5:
    print("HIGH")
else:
    print("OK")
`,
    hints: ["경계값 9.5와 10.5는 규격 안(OK)입니다.", "if / elif / else 세 갈래로 나누세요."],
    tests: [
      { stdin: "10.2", expected: "OK" },
      { stdin: "9.4", expected: "LOW" },
      { stdin: "9.5", expected: "OK", hidden: true },
      { stdin: "10.5", expected: "OK", hidden: true },
      { stdin: "10.51", expected: "HIGH", hidden: true },
    ],
  },
  {
    id: "1-6",
    unit: 1,
    title: "규격 안에 들어올 때까지 재측정",
    type: "io",
    level: 2,
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
    title: "설비 로그에서 ERROR 건수 세기",
    type: "function",
    level: 2,
    origin: "split()",
    desc: `<p>설비 로그는 <code>'상태,종류,일시,값'</code> 형식입니다. 상태가 <code>ERROR</code>인 로그 수를 반환하세요.</p>`,
    starter: `def solution(logs):
    count = 0
    return count
`,
    solution: `def solution(logs):
    count = 0
    for log in logs:
        if log.split(",")[0] == "ERROR":
            count += 1
    return count
`,
    hints: ["log.split(',') 의 0번째 값이 상태입니다.", "'ERROR' in log 로 검사하면 다른 칸에 ERROR가 들어간 로그도 세게 됩니다."],
    tests: [
      { args: [["ERROR,Temp,A20240901,High", "OK,Temp,A20240901,Normal", "ERROR,Press,A20240902,Low"]], expected: 2 },
      { args: [[]], expected: 0 },
      { args: [["OK,ERROR_CHECK,A1,Normal"]], expected: 0, hidden: true },
    ],
  },

  // ── 단원 3 ─────────────────────────────────────────────
  {
    id: "3-1",
    unit: 3,
    title: "포장 단위 찾기",
    type: "function",
    level: 2,
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

  // ── 단원 4 ─────────────────────────────────────────────
  {
    id: "4-1",
    unit: 4,
    title: "5일간 불량률 분석",
    type: "steps",
    level: 2,
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
];
