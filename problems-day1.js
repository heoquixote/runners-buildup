// 1회차 교안(파이썬 기초 문법)을 6개 유닛으로 나눈 문제.
// 1회차에는 아직 if·for를 배우지 않으므로, 변수에 값을 담는 "단계 실습형(steps)" 문제로 만든다.
// 기존 QAQC 과제(변수 빈칸, 리스트 append·슬라이싱 빈칸, 딕셔너리 빈칸, 평균, 최고-최저 등)와 겹치지 않게 한다.

export const DAY1_UNITS = [
  {
    id: 1,
    title: "변수와 사칙연산",
    summary: "변수, 주석, + - * / // % **",
    note: `
<h4>변수는 값에 붙이는 이름표</h4>
<pre>good = 1180      # 숫자
line = "L2"      # 문자 (따옴표)
# 으로 시작하는 줄은 주석. 실행되지 않습니다.</pre>
<p>변수 이름은 영문으로 짓고, 띄어쓰기 대신 <code>_</code>를 씁니다. <code>=</code>는 "같다"가 아니라 "오른쪽 값을 왼쪽 이름에 담는다"는 뜻입니다.</p>
<h4>사칙연산 (a = 10, b = 3)</h4>
<table class="ex-table"><thead><tr><th>연산자</th><th>뜻</th><th>결과</th></tr></thead><tbody>
<tr><td><code>a + b</code></td><td>덧셈</td><td>13</td></tr>
<tr><td><code>a - b</code></td><td>뺄셈</td><td>7</td></tr>
<tr><td><code>a * b</code></td><td>곱셈</td><td>30</td></tr>
<tr><td><code>a / b</code></td><td>나눗셈 (항상 소수)</td><td>3.333…</td></tr>
<tr><td><code>a // b</code></td><td>몫</td><td>3</td></tr>
<tr><td><code>a % b</code></td><td>나머지</td><td>1</td></tr>
<tr><td><code>a ** b</code></td><td>거듭제곱</td><td>1000</td></tr></tbody></table>
<p class="qc">현장 활용: 24개들이 박스에 몇 박스가 차고 몇 개가 남는지는 <code>//</code>와 <code>%</code>로 바로 나옵니다.</p>
<h4>단계 실습형 문제 푸는 법</h4>
<p>문제에서 정한 <b>변수 이름</b>에 답을 담으면 채점기가 그 변수 값을 확인합니다. <code>print()</code>는 확인용입니다.</p>`,
  },
  {
    id: 2,
    title: "문자열 기초",
    summary: "따옴표, 인덱싱, 슬라이싱, +, *, len, type",
    note: `
<h4>문자열은 따옴표로 감쌉니다</h4>
<pre>code = 'KR24A0915X'
type(code)      # &lt;class 'str'&gt;</pre>
<h4>인덱싱: 한 글자 꺼내기</h4>
<p>첫 글자는 <code>[0]</code>, 마지막 글자는 <code>[-1]</code>입니다.</p>
<h4>슬라이싱: 구간 잘라내기</h4>
<pre>code[0:2]    # 'KR'   0번부터 1번까지 (끝 번호는 포함 안 됨)
code[:2]     # 'KR'   처음부터
code[-3:]    # '15X'  뒤에서 3글자
code[::2]    # 한 칸씩 건너뛰며
code[::-1]   # 거꾸로</pre>
<h4>더하기, 곱하기, 길이</h4>
<pre>"L2" + "-" + "0457"   # 'L2-0457'
"=" * 10              # '=========='
len("L2-0457")        # 7</pre>
<h4>숫자와 문자는 바로 더할 수 없습니다</h4>
<p><code>"불량 " + 3</code>은 TypeError입니다. <code>str(3)</code>으로 바꿔서 더하고, 반대로 <code>"120"</code>을 계산하려면 <code>int("120")</code>, <code>float("35.5")</code>로 바꿉니다.</p>`,
  },
  {
    id: 3,
    title: "문자열 메서드",
    summary: "upper, lower, split, join, replace, startswith, endswith, strip",
    note: `
<h4>메서드는 값 뒤에 점(.)을 찍고 부르는 함수</h4>
<pre>raw = "qc-Line3-Pass"
raw.upper()              # 'QC-LINE3-PASS'
raw.lower()              # 'qc-line3-pass'
raw.startswith("qc")     # True
raw.endswith("Pass")     # True</pre>
<h4>split: 나눠서 리스트로</h4>
<pre>"A동 2층 3라인".split()        # ['A동', '2층', '3라인']  (공백 기준)
"23.1,23.4,22.9".split(",")   # ['23.1', '23.4', '22.9']</pre>
<h4>join: 리스트를 이어서 문자열로</h4>
<pre>"-".join(["2024", "10", "25"])   # '2024-10-25'</pre>
<p><code>split</code>과 <code>join</code>은 반대 방향입니다. join은 <b>붙일 문자</b>가 앞에 옵니다.</p>
<h4>replace, strip</h4>
<pre>"2024.10.25".replace(".", "-")   # '2024-10-25'
"  OK \\n".strip()                 # 'OK'  앞뒤 공백·줄바꿈 제거</pre>
<p class="qc">문자열은 바뀌지 않는 값입니다. <code>s.upper()</code>만 쓰면 s는 그대로이고, <code>s = s.upper()</code>처럼 다시 담아야 바뀝니다.</p>`,
  },
  {
    id: 4,
    title: "리스트 기초",
    summary: "인덱싱, 중첩 리스트, 슬라이싱, +, *, len, 수정, del, append, extend",
    note: `
<h4>리스트는 여러 값을 순서대로 담는 상자</h4>
<pre>temps = [23.1, 23.4, 22.8, 24.0]
temps[0]      # 23.1
temps[-1]     # 24.0
temps[1:3]    # [23.4, 22.8]
len(temps)    # 4</pre>
<h4>리스트 안의 리스트</h4>
<pre>lines = [["L1", 980], ["L2", 1010]]
lines[1]       # ['L2', 1010]
lines[1][1]    # 1010   (바깥 번호 → 안쪽 번호 순서)</pre>
<h4>바꾸기와 지우기 (CRUD의 U, D)</h4>
<pre>q = ["A01", "A02", "A03"]
q[1] = "A02-R"    # 수정
del q[0]          # 삭제 → ['A02-R', 'A03']</pre>
<h4>append vs extend</h4>
<pre>a = [1, 2]; a.append([3, 4])   # [1, 2, [3, 4]]  통째로 1개 추가
e = [1, 2]; e.extend([3, 4])   # [1, 2, 3, 4]    하나씩 풀어서 추가</pre>
<h4>+ 와 *</h4>
<pre>[1, 2] + [3]   # [1, 2, 3]
[0] * 3        # [0, 0, 0]</pre>`,
  },
  {
    id: 5,
    title: "리스트 정렬과 에러 읽기",
    summary: "sort vs sorted, reverse, remove, pop, SyntaxError · IndexError · NameError · ZeroDivisionError",
    note: `
<h4>sorted()와 .sort()</h4>
<table class="ex-table"><thead><tr><th></th><th><code>sorted(리스트)</code></th><th><code>리스트.sort()</code></th></tr></thead><tbody>
<tr><td>종류</td><td>내장 함수</td><td>리스트 메서드</td></tr>
<tr><td>원본</td><td>그대로 (새 리스트를 돌려줌)</td><td>원본이 바뀜 (돌려주는 값은 None)</td></tr></tbody></table>
<pre>w = [3.2, 1.8, 2.5]
s = sorted(w)            # s = [1.8, 2.5, 3.2], w는 그대로
w.sort()                 # w가 [1.8, 2.5, 3.2]로 바뀜
w.reverse()              # 순서 뒤집기
sorted(w, reverse=True)  # 큰 값부터</pre>
<h4>remove와 pop</h4>
<pre>q = ["P1", "P2", "P3"]
q.remove("P2")   # 값으로 지우기
last = q.pop()   # 맨 뒤를 꺼내서 돌려줌 → 'P3'
first = q.pop(0) # 0번을 꺼냄</pre>
<h4>에러 메시지 읽는 순서</h4>
<p>① 몇 번째 줄인지 → ② 에러 이름 → ③ 메시지 → ④ 그래도 모르면 검색</p>
<table class="ex-table"><thead><tr><th>에러</th><th>언제</th><th>예</th></tr></thead><tbody>
<tr><td>SyntaxError</td><td>문법이 틀림 (괄호, 따옴표, 콜론)</td><td><code>print(1, 2</code></td></tr>
<tr><td>IndexError</td><td>없는 번호로 접근</td><td><code>[1, 2, 3][3]</code></td></tr>
<tr><td>NameError</td><td>없는 변수 (오타 포함)</td><td><code>print(b)</code></td></tr>
<tr><td>ZeroDivisionError</td><td>0으로 나눔</td><td><code>5 / 0</code></td></tr>
<tr><td>TypeError</td><td>자료형이 안 맞음</td><td><code>"불량 " + 3</code></td></tr></tbody></table>`,
  },
  {
    id: 6,
    title: "딕셔너리와 Set",
    summary: "key-value CRUD, keys, values, items, in, get, set, union, intersection",
    note: `
<h4>딕셔너리: 이름(key)으로 값을 찾는 자료형</h4>
<pre>eqp = {"id": "EQ-07", "line": "L2", "temp": 180}
eqp["line"]          # 읽기 → 'L2'
eqp["status"] = "RUN" # 추가 (없는 키)
eqp["temp"] = 185     # 수정 (있는 키)
del eqp["line"]       # 삭제</pre>
<p>리스트처럼 <code>eqp[0]</code>으로는 꺼낼 수 없습니다. 반드시 키로 접근합니다.</p>
<h4>한꺼번에 보기</h4>
<pre>eqp.keys()     # dict_keys(['id', 'temp', 'status'])
eqp.values()   # dict_values(['EQ-07', 185, 'RUN'])
eqp.items()    # (키, 값) 쌍
list(eqp.keys())   # 리스트로 바꾸면 인덱싱 가능
"temp" in eqp      # True  (키가 있는지)
eqp.get("vib", 0)  # 키가 없으면 0  (eqp["vib"]는 KeyError)
eqp.clear()        # 모두 삭제 → {}</pre>
<h4>Set: 중복 없는 모음</h4>
<pre>s = set(["A01", "A03", "A03"])   # {'A01', 'A03'}
s.add("B02")
{1, 2, 3}.union({3, 4})          # {1, 2, 3, 4}  합집합
{1, 2, 3}.intersection({3, 4})   # {3}  교집합
{1, 2, 3} - {3, 4}               # {1, 2}  차집합</pre>
<p class="qc">Set은 순서가 없어서 인덱싱이 안 됩니다. 순서대로 보고 싶으면 <code>sorted(s)</code>로 리스트를 만드세요.</p>`,
  },
];

export const DAY1_PROBLEMS = [
  // ── 유닛 1 변수와 사칙연산 ──────────────────────────────
  {
    id: "1-1",
    unit: 1,
    title: "오늘 생산 실적 계산",
    type: "steps",
    level: 1,
    uses: [["변수 = 값", "값에 이름 붙이기"], ["+ , /", "덧셈과 나눗셈"], ["* 100", "비율을 %로"]],
    origin: "변수와 사칙연산",
    desc: `<p>오늘 A라인의 양품은 <code>good</code>개, 불량은 <code>bad</code>개입니다. 아래 변수를 만드세요.</p>
<ol><li><code>total</code>: 전체 생산 수량 (양품 + 불량)</li>
<li><code>defect_rate</code>: 불량률(%) = 불량 ÷ 전체 × 100</li>
<li><code>good_rate</code>: 양품률(%) = 100 − 불량률</li></ol>`,
    starter: `good = 1180
bad = 20

# 1. 전체 생산 수량
total = 0

# 2. 불량률(%)
defect_rate = 0

# 3. 양품률(%)
good_rate = 0

print(total, defect_rate, good_rate)
`,
    solution: `good = 1180
bad = 20

total = good + bad
defect_rate = bad / total * 100
good_rate = 100 - defect_rate

print(total, defect_rate, good_rate)
`,
    hints: ["total = good + bad", "defect_rate = bad / total * 100", "숫자를 직접 쓰지 말고 변수로 계산하세요. 값이 바뀌어도 그대로 쓸 수 있습니다."],
    checks: [
      { label: "1단계 전체 수량", expr: "total == 1200", hint: "good + bad" },
      { label: "2단계 불량률", expr: "abs(defect_rate - 20 / 1200 * 100) < 1e-9", hint: "bad / total * 100" },
      { label: "3단계 양품률", expr: "abs(good_rate - (100 - 20 / 1200 * 100)) < 1e-9", hint: "100 - defect_rate" },
    ],
  },
  {
    id: "1-2",
    unit: 1,
    title: "박스 포장 수량",
    type: "steps",
    level: 1,
    uses: [["//", "몫: 꽉 찬 박스 수"], ["%", "나머지: 남는 제품 수"]],
    origin: "몫(//)과 나머지(%)",
    desc: `<p>제품 <code>qty</code>개를 한 박스에 <code>per_box</code>개씩 담습니다.</p>
<ol><li><code>full_boxes</code>: 꽉 찬 박스 수</li>
<li><code>remain</code>: 박스에 못 담고 남는 제품 수</li>
<li><code>check</code>: <code>full_boxes * per_box + remain</code> (원래 수량과 같아야 합니다)</li></ol>`,
    starter: `qty = 1000
per_box = 24

full_boxes = 0
remain = 0
check = 0

print(full_boxes, remain, check)
`,
    solution: `qty = 1000
per_box = 24

full_boxes = qty // per_box
remain = qty % per_box
check = full_boxes * per_box + remain

print(full_boxes, remain, check)
`,
    hints: ["qty // per_box 는 소수점 아래를 버린 몫입니다.", "qty % per_box 는 나머지입니다."],
    checks: [
      { label: "1단계 꽉 찬 박스 수", expr: "full_boxes == 41", hint: "/ 가 아니라 // 를 쓰세요. / 는 41.66… 소수가 나옵니다." },
      { label: "2단계 남는 수량", expr: "remain == 16", hint: "qty % per_box" },
      { label: "3단계 검산", expr: "check == 1000", hint: "full_boxes * per_box + remain" },
    ],
  },
  {
    id: "1-3",
    unit: 1,
    title: "설비 가동 시간 변환",
    type: "steps",
    level: 2,
    uses: [["//", "몫"], ["%", "나머지"], ["3600, 60", "1시간 = 3600초, 1분 = 60초"]],
    origin: "몫과 나머지로 단위 바꾸기",
    desc: `<p>설비 로그에 가동 시간이 초 단위(<code>sec</code>)로 남아 있습니다. 몇 시간 몇 분 몇 초인지 나누세요.</p>
<ol><li><code>hours</code>: 시간</li><li><code>minutes</code>: 시간을 빼고 남은 분</li><li><code>seconds</code>: 분까지 빼고 남은 초</li></ol>
<p>예: 9,045초 → 2시간 30분 45초</p>`,
    starter: `sec = 9045

hours = 0
minutes = 0
seconds = 0

print(hours, "시간", minutes, "분", seconds, "초")
`,
    solution: `sec = 9045

hours = sec // 3600
minutes = sec % 3600 // 60
seconds = sec % 60

print(hours, "시간", minutes, "분", seconds, "초")
`,
    hints: ["hours = sec // 3600", "시간을 빼고 남은 초는 sec % 3600 입니다. 이것을 60으로 나눈 몫이 분입니다.", "seconds = sec % 60"],
    checks: [
      { label: "1단계 시간", expr: "hours == 2", hint: "sec // 3600" },
      { label: "2단계 분", expr: "minutes == 30", hint: "sec % 3600 // 60" },
      { label: "3단계 초", expr: "seconds == 45", hint: "sec % 60" },
    ],
  },
  {
    id: "1-4",
    unit: 1,
    title: "실험 조합 수와 웨이퍼 면적",
    type: "steps",
    level: 2,
    uses: [["**", "거듭제곱. 2 ** 3 = 8"], ["*", "곱셈"], ["/", "나눗셈"]],
    origin: "거듭제곱(**)",
    desc: `<p>공정 조건 실험(DOE)을 계획합니다. 인자(온도, 압력, 시간…)가 <code>factors</code>개이고, 인자마다 수준이 <code>levels</code>개입니다.</p>
<ol><li><code>runs</code>: 모든 조합의 실험 횟수 = 수준 수<sup>인자 수</sup></li>
<li><code>area</code>: 반지름 <code>r</code>(mm) 웨이퍼의 면적 = 3.14 × r²</li>
<li><code>area_cm2</code>: 면적을 cm²로 (1cm² = 100mm²)</li></ol>`,
    starter: `factors = 3
levels = 2
r = 150

runs = 0
area = 0
area_cm2 = 0

print(runs, area, area_cm2)
`,
    solution: `factors = 3
levels = 2
r = 150

runs = levels ** factors
area = 3.14 * r ** 2
area_cm2 = area / 100

print(runs, area, area_cm2)
`,
    hints: ["runs = levels ** factors", "r 의 제곱은 r ** 2 입니다. ** 가 * 보다 먼저 계산됩니다.", "area_cm2 = area / 100"],
    checks: [
      { label: "1단계 실험 횟수", expr: "runs == 8", hint: "levels ** factors (2를 3번 곱하기)" },
      { label: "2단계 웨이퍼 면적", expr: "abs(area - 70650) < 1e-6", hint: "3.14 * r ** 2" },
      { label: "3단계 cm² 변환", expr: "abs(area_cm2 - 706.5) < 1e-6", hint: "area / 100" },
    ],
  },
  {
    id: "1-5",
    unit: 1,
    title: "2단계 공정 수율과 손실 비용",
    type: "steps",
    level: 3,
    challenge: true,
    uses: [["*", "수율끼리 곱하면 최종 수율"], ["int()", "소수점 아래 버리기"], ["//", "몫"], ["(a + b - 1) // b", "나눗셈 올림 계산"]],
    origin: "사칙연산 종합 (유닛 1 종합)",
    desc: `<p>제품은 1공정과 2공정을 차례로 거칩니다. 공정별 수율은 <code>y1</code>, <code>y2</code>입니다.</p>
<ol><li><code>final_yield</code>: 최종 수율 (두 수율의 곱)</li>
<li><code>good</code>: 투입 <code>produced</code>개 중 최종 양품 수 (소수점 아래는 버림, <code>int()</code>)</li>
<li><code>loss</code>: 불량 수 × 개당 손실 <code>unit_cost</code>원</li>
<li><code>boxes</code>: 양품을 24개들이 박스에 담을 때 필요한 박스 수. <b>남는 제품도 박스 하나에 담으므로 올림</b>입니다.</li></ol>`,
    starter: `produced = 5000
y1 = 0.95
y2 = 0.92
unit_cost = 1200

final_yield = 0
good = 0
loss = 0
boxes = 0

print(final_yield, good, loss, boxes)
`,
    solution: `produced = 5000
y1 = 0.95
y2 = 0.92
unit_cost = 1200

final_yield = y1 * y2
good = int(produced * final_yield)
loss = (produced - good) * unit_cost
boxes = (good + 24 - 1) // 24

print(final_yield, good, loss, boxes)
`,
    hints: ["최종 수율 = y1 * y2 (0.874)", "good = int(produced * final_yield) → 4370", "올림은 (good + 23) // 24 처럼 계산합니다. 4370 // 24 는 182 이고 2개가 남으니 183박스입니다."],
    checks: [
      { label: "1단계 최종 수율", expr: "abs(final_yield - 0.95 * 0.92) < 1e-9", hint: "y1 * y2" },
      { label: "2단계 양품 수", expr: "good == 4370", hint: "int(produced * final_yield)" },
      { label: "3단계 손실 비용", expr: "loss == 756000", hint: "(produced - good) * unit_cost" },
      { label: "4단계 박스 수 (올림)", expr: "boxes == 183", hint: "남는 2개도 박스에 담아야 합니다. (good + 23) // 24" },
    ],
  },

  // ── 유닛 2 문자열 기초 ─────────────────────────────────
  {
    id: "2-1",
    unit: 2,
    title: "부품 바코드 분해",
    type: "steps",
    level: 1,
    uses: [["문자열[번호]", "한 글자 꺼내기 (0부터)"], ["문자열[시작:끝]", "구간 잘라내기 (끝 번호는 미포함)"], ["[-1]", "마지막 글자"]],
    origin: "인덱싱과 슬라이싱",
    desc: `<p>부품 바코드 <code>barcode = 'KR24A0915X'</code>는 자리마다 뜻이 정해져 있습니다.</p>
<table class="ex-table"><thead><tr><th>자리</th><th>0~1</th><th>2~3</th><th>4</th><th>5~8</th><th>9 (마지막)</th></tr></thead>
<tbody><tr><td>뜻</td><td>국가</td><td>연도</td><td>라인</td><td>일련번호</td><td>검증 문자</td></tr></tbody></table>
<p><code>country</code>, <code>year</code>, <code>line</code>, <code>serial</code>, <code>check_char</code>를 만드세요. 모두 문자열입니다.</p>`,
    starter: `barcode = 'KR24A0915X'

country = ''
year = ''
line = ''
serial = ''
check_char = ''

print(country, year, line, serial, check_char)
`,
    solution: `barcode = 'KR24A0915X'

country = barcode[0:2]
year = barcode[2:4]
line = barcode[4]
serial = barcode[5:9]
check_char = barcode[-1]

print(country, year, line, serial, check_char)
`,
    hints: ["슬라이싱 [2:4] 는 2번, 3번 글자입니다. 끝 번호 4는 포함되지 않습니다.", "line 은 한 글자이므로 barcode[4]", "마지막 글자는 barcode[-1]"],
    checks: [
      { label: "국가 country", expr: "country == 'KR'", hint: "barcode[0:2] 또는 barcode[:2]" },
      { label: "연도 year", expr: "year == '24'", hint: "barcode[2:4]" },
      { label: "라인 line", expr: "line == 'A'", hint: "barcode[4]" },
      { label: "일련번호 serial", expr: "serial == '0915'", hint: "barcode[5:9]" },
      { label: "검증 문자 check_char", expr: "check_char == 'X'", hint: "barcode[-1]" },
    ],
  },
  {
    id: "2-2",
    unit: 2,
    title: "작업 라벨 만들기",
    type: "steps",
    level: 1,
    uses: [["+", "문자열 이어 붙이기"], ["*", "문자열 반복"], ["len()", "글자 수"]],
    origin: "문자열 병합과 반복",
    desc: `<p>라인 코드와 작업 번호로 라벨을 만듭니다.</p>
<ol><li><code>label</code>: <code>'L2-0457'</code> (라인 + '-' + 작업 번호)</li>
<li><code>bar</code>: <code>'='</code>를 20번 반복한 구분선</li>
<li><code>label_len</code>: label의 글자 수</li>
<li><code>tag</code>: <code>'[L2-0457]'</code> (label 앞뒤에 대괄호)</li></ol>`,
    starter: `line = 'L2'
job = '0457'

label = ''
bar = ''
label_len = 0
tag = ''

print(bar)
print(tag, label_len)
print(bar)
`,
    solution: `line = 'L2'
job = '0457'

label = line + '-' + job
bar = '=' * 20
label_len = len(label)
tag = '[' + label + ']'

print(bar)
print(tag, label_len)
print(bar)
`,
    hints: ["label = line + '-' + job", "bar = '=' * 20", "tag = '[' + label + ']'"],
    checks: [
      { label: "1단계 label", expr: "label == 'L2-0457'", hint: "line + '-' + job" },
      { label: "2단계 구분선 bar", expr: "bar == '=' * 20", hint: "'=' * 20" },
      { label: "3단계 글자 수", expr: "label_len == 7", hint: "len(label)" },
      { label: "4단계 tag", expr: "tag == '[L2-0457]'", hint: "'[' + label + ']'" },
    ],
  },
  {
    id: "2-3",
    unit: 2,
    title: "섞인 시리얼 풀기",
    type: "steps",
    level: 2,
    uses: [["[::2]", "0번부터 한 칸씩 건너뛰기"], ["[1::2]", "1번부터 한 칸씩 건너뛰기"], ["[::-1]", "거꾸로 뒤집기"]],
    origin: "슬라이싱 간격(step)",
    desc: `<p>구형 장비는 시리얼을 <b>문자와 숫자를 번갈아</b> 기록합니다. <code>raw = 'A1B2C3D4E5'</code></p>
<ol><li><code>letters</code>: 문자만 → <code>'ABCDE'</code></li>
<li><code>digits</code>: 숫자만 → <code>'12345'</code></li>
<li><code>reversed_raw</code>: raw를 거꾸로 → <code>'5E4D3C2B1A'</code></li>
<li><code>last_two</code>: letters의 마지막 두 글자</li></ol>`,
    starter: `raw = 'A1B2C3D4E5'

letters = ''
digits = ''
reversed_raw = ''
last_two = ''

print(letters, digits, reversed_raw, last_two)
`,
    solution: `raw = 'A1B2C3D4E5'

letters = raw[::2]
digits = raw[1::2]
reversed_raw = raw[::-1]
last_two = letters[-2:]

print(letters, digits, reversed_raw, last_two)
`,
    hints: ["[시작:끝:간격] 에서 간격이 2이면 한 칸씩 건너뜁니다.", "숫자는 1번 자리부터 시작합니다: raw[1::2]", "간격 -1 은 뒤에서부터 읽습니다."],
    checks: [
      { label: "1단계 letters", expr: "letters == 'ABCDE'", hint: "raw[::2]" },
      { label: "2단계 digits", expr: "digits == '12345'", hint: "raw[1::2]" },
      { label: "3단계 reversed_raw", expr: "reversed_raw == '5E4D3C2B1A'", hint: "raw[::-1]" },
      { label: "4단계 last_two", expr: "last_two == 'DE'", hint: "letters[-2:]" },
    ],
  },
  {
    id: "2-4",
    unit: 2,
    title: "문자로 들어온 수량 계산",
    type: "steps",
    level: 2,
    uses: [["int()", "문자열 → 정수"], ["float()", "문자열 → 소수"], ["str()", "숫자 → 문자열"], ["type()", "자료형 확인"]],
    origin: "자료형과 형변환",
    desc: `<p>ERP에서 받은 값이 모두 <b>문자열</b>입니다. <code>qty_text = '120'</code>, <code>price_text = '35.5'</code></p>
<ol><li><code>qty</code>: 정수로 바꾼 수량</li>
<li><code>price</code>: 소수로 바꾼 단가</li>
<li><code>amount</code>: 수량 × 단가</li>
<li><code>msg</code>: <code>'총액: 4260.0원'</code> (문자열과 숫자를 이어 붙이기)</li>
<li><code>wrong</code>: 바꾸지 않고 <code>qty_text * 2</code>를 하면 어떤 값이 되는지 담기</li></ol>`,
    starter: `qty_text = '120'
price_text = '35.5'

qty = qty_text
price = price_text
amount = 0
msg = ''
wrong = None

print(type(qty_text), type(qty))
print(msg, wrong)
`,
    solution: `qty_text = '120'
price_text = '35.5'

qty = int(qty_text)
price = float(price_text)
amount = qty * price
msg = '총액: ' + str(amount) + '원'
wrong = qty_text * 2

print(type(qty_text), type(qty))
print(msg, wrong)
`,
    hints: ["qty = int(qty_text), price = float(price_text)", "'총액: ' + amount 는 TypeError 입니다. str(amount)로 바꿔서 이으세요.", "문자열 * 2 는 계산이 아니라 반복입니다."],
    checks: [
      { label: "1단계 qty는 정수", expr: "qty == 120 and type(qty) == int", hint: "int(qty_text)" },
      { label: "2단계 price는 소수", expr: "price == 35.5 and type(price) == float", hint: "float(price_text)" },
      { label: "3단계 amount", expr: "abs(amount - 4260.0) < 1e-9", hint: "qty * price" },
      { label: "4단계 msg", expr: "msg == '총액: 4260.0원'", hint: "'총액: ' + str(amount) + '원'" },
      { label: "5단계 wrong", expr: "wrong == '120120'", hint: "문자열 '120'을 2번 반복하면?" },
    ],
  },
  {
    id: "2-5",
    unit: 2,
    title: "고정 길이 측정 기록 읽기",
    type: "steps",
    level: 3,
    challenge: true,
    uses: [["슬라이싱", "자리 위치로 잘라내기"], ["float()", "문자열 숫자를 소수로"], ["str()", "숫자를 문자열로"], ["+", "문자열 조립"]],
    origin: "문자열 기초 종합 (유닛 2 종합)",
    desc: `<p>측정기는 기록을 항상 같은 길이로 남깁니다. 예: <code>record = '20241025|L3|T=23.5C|H=41%'</code></p>
<ol><li><code>date</code>: <code>'2024-10-25'</code> (앞 8자리를 연-월-일로)</li>
<li><code>line</code>: <code>'L3'</code></li>
<li><code>temp</code>: 온도 <b>소수</b> 23.5</li>
<li><code>humid</code>: 습도 <b>정수</b> 41</li>
<li><code>summary</code>: <code>'L3 10/25 23.5C 41%'</code></li></ol>
<p>같은 형식의 다른 기록에도 그대로 동작하도록, 값을 직접 쓰지 말고 <code>record</code>를 잘라서 만드세요.</p>`,
    starter: `record = '20241025|L3|T=23.5C|H=41%'

date = ''
line = ''
temp = 0
humid = 0
summary = ''

print(summary)
`,
    solution: `record = '20241025|L3|T=23.5C|H=41%'

date = record[0:4] + '-' + record[4:6] + '-' + record[6:8]
line = record[9:11]
temp = float(record[14:18])
humid = int(record[-3:-1])
summary = line + ' ' + record[4:6] + '/' + record[6:8] + ' ' + str(temp) + 'C ' + str(humid) + '%'

print(summary)
`,
    hints: ["자리 번호를 종이에 적어 보세요. '|'도 한 글자입니다. L3는 9~10번입니다.", "온도 '23.5'는 14~17번 → record[14:18]", "습도는 뒤에서 세는 게 편합니다: record[-3:-1] 은 '41'"],
    checks: [
      { label: "1단계 date", expr: "date == '2024-10-25'", hint: "record[0:4] + '-' + record[4:6] + '-' + record[6:8]" },
      { label: "2단계 line", expr: "line == 'L3'", hint: "record[9:11]" },
      { label: "3단계 temp (소수)", expr: "temp == 23.5 and type(temp) == float", hint: "float(record[14:18])" },
      { label: "4단계 humid (정수)", expr: "humid == 41 and type(humid) == int", hint: "int(record[-3:-1])" },
      { label: "5단계 summary", expr: "summary == 'L3 10/25 23.5C 41%'", hint: "line + ' ' + 월 + '/' + 일 + ' ' + str(temp) + 'C ' + str(humid) + '%'" },
    ],
  },

  // ── 유닛 3 문자열 메서드 ───────────────────────────────
  {
    id: "3-1",
    unit: 3,
    title: "검사 코드 표기 통일",
    type: "steps",
    level: 1,
    uses: [["upper()", "대문자로"], ["lower()", "소문자로"], ["startswith()", "~로 시작하는지 True/False"], ["endswith()", "~로 끝나는지 True/False"]],
    origin: "upper, lower, startswith, endswith",
    desc: `<p>작업자마다 검사 코드를 다르게 적습니다. <code>raw = 'qc-Line3-Pass'</code></p>
<ol><li><code>code_up</code>: 모두 대문자</li><li><code>code_low</code>: 모두 소문자</li>
<li><code>is_qc</code>: 소문자로 바꾼 코드가 <code>'qc'</code>로 시작하는지</li>
<li><code>is_pass</code>: 대문자로 바꾼 코드가 <code>'PASS'</code>로 끝나는지</li></ol>`,
    starter: `raw = 'qc-Line3-Pass'

code_up = ''
code_low = ''
is_qc = None
is_pass = None

print(code_up, code_low, is_qc, is_pass)
`,
    solution: `raw = 'qc-Line3-Pass'

code_up = raw.upper()
code_low = raw.lower()
is_qc = code_low.startswith('qc')
is_pass = code_up.endswith('PASS')

print(code_up, code_low, is_qc, is_pass)
`,
    hints: ["raw.upper(), raw.lower()", "code_low.startswith('qc') 는 True 또는 False 를 돌려줍니다.", "대소문자를 먼저 통일하고 비교하면 'Pass', 'PASS', 'pass'를 모두 잡을 수 있습니다."],
    checks: [
      { label: "1단계 대문자", expr: "code_up == 'QC-LINE3-PASS'", hint: "raw.upper()" },
      { label: "2단계 소문자", expr: "code_low == 'qc-line3-pass'", hint: "raw.lower()" },
      { label: "3단계 is_qc", expr: "is_qc is True", hint: "code_low.startswith('qc')" },
      { label: "4단계 is_pass", expr: "is_pass is True", hint: "code_up.endswith('PASS')" },
    ],
  },
  {
    id: "3-2",
    unit: 3,
    title: "설비 위치 태그 나누기",
    type: "steps",
    level: 1,
    uses: [["split()", "공백 기준으로 나눠 리스트로"], ["split(\",\")", "쉼표 기준으로 나누기"], ["리스트[번호]", "나눈 결과에서 하나 꺼내기"], ["float()", "문자열을 소수로"]],
    origin: "split()",
    desc: `<p>설비 위치 태그와 측정값 문자열을 나눕니다.</p>
<ol><li><code>parts</code>: <code>tag</code>를 공백으로 나눈 리스트</li>
<li><code>floor</code>: parts에서 층 (<code>'2층'</code>)</li>
<li><code>vals</code>: <code>reading</code>을 쉼표로 나눈 리스트</li>
<li><code>first_val</code>: vals의 첫 값을 <b>소수</b>로</li>
<li><code>n_vals</code>: 측정값 개수</li></ol>`,
    starter: `tag = 'A동 2층 3라인 7번설비'
reading = '23.1,23.4,22.9,23.0'

parts = []
floor = ''
vals = []
first_val = 0
n_vals = 0

print(parts, floor, vals, first_val, n_vals)
`,
    solution: `tag = 'A동 2층 3라인 7번설비'
reading = '23.1,23.4,22.9,23.0'

parts = tag.split()
floor = parts[1]
vals = reading.split(',')
first_val = float(vals[0])
n_vals = len(vals)

print(parts, floor, vals, first_val, n_vals)
`,
    hints: ["tag.split() 은 공백마다 잘라 리스트를 돌려줍니다.", "split 결과의 원소는 모두 문자열입니다. 계산하려면 float()", "n_vals = len(vals)"],
    checks: [
      { label: "1단계 parts", expr: "parts == ['A동', '2층', '3라인', '7번설비']", hint: "tag.split()" },
      { label: "2단계 floor", expr: "floor == '2층'", hint: "parts[1]" },
      { label: "3단계 vals", expr: "vals == ['23.1', '23.4', '22.9', '23.0']", hint: "reading.split(',')" },
      { label: "4단계 first_val", expr: "first_val == 23.1 and type(first_val) == float", hint: "float(vals[0])" },
      { label: "5단계 n_vals", expr: "n_vals == 4", hint: "len(vals)" },
    ],
  },
  {
    id: "3-3",
    unit: 3,
    title: "리스트를 한 줄 보고서로",
    type: "steps",
    level: 2,
    uses: [["'구분자'.join(리스트)", "리스트를 구분자로 이어 문자열로"], ["' '.join('문자열')", "글자 사이사이에 끼워 넣기"]],
    origin: "join()",
    desc: `<p>흩어진 값을 이어서 보고서용 문자열을 만듭니다.</p>
<ol><li><code>date</code>: <code>['2024', '10', '25']</code> → <code>'2024-10-25'</code></li>
<li><code>ng_line</code>: <code>['A01', 'A07', 'B03']</code> → <code>'A01, A07, B03'</code> (쉼표+공백)</li>
<li><code>path</code>: <code>['data', 'line3', 'temp.csv']</code> → <code>'data/line3/temp.csv'</code></li>
<li><code>spaced</code>: <code>'NG'</code> → <code>'N G'</code></li></ol>`,
    starter: `ymd = ['2024', '10', '25']
ng_codes = ['A01', 'A07', 'B03']
folders = ['data', 'line3', 'temp.csv']

date = ''
ng_line = ''
path = ''
spaced = ''

print(date, ng_line, path, spaced)
`,
    solution: `ymd = ['2024', '10', '25']
ng_codes = ['A01', 'A07', 'B03']
folders = ['data', 'line3', 'temp.csv']

date = '-'.join(ymd)
ng_line = ', '.join(ng_codes)
path = '/'.join(folders)
spaced = ' '.join('NG')

print(date, ng_line, path, spaced)
`,
    hints: ["붙일 문자가 앞에 옵니다: '-'.join(ymd)", "쉼표 다음 공백까지 넣으려면 ', '.join(...)", "문자열도 한 글자씩 이어 붙일 수 있습니다: ' '.join('NG')"],
    checks: [
      { label: "1단계 date", expr: "date == '2024-10-25'", hint: "'-'.join(ymd)" },
      { label: "2단계 ng_line", expr: "ng_line == 'A01, A07, B03'", hint: "', '.join(ng_codes)" },
      { label: "3단계 path", expr: "path == 'data/line3/temp.csv'", hint: "'/'.join(folders)" },
      { label: "4단계 spaced", expr: "spaced == 'N G'", hint: "' '.join('NG')" },
    ],
  },
  {
    id: "3-4",
    unit: 3,
    title: "보고서 문구 바꾸기",
    type: "steps",
    level: 2,
    uses: [["replace(찾을것, 바꿀것)", "문자열 안의 글자 바꾸기"], ["replace(' ', '')", "공백 지우기"], ["strip()", "앞뒤 공백·줄바꿈 지우기"]],
    origin: "replace(), strip()",
    desc: `<p>보고서 문구를 정리합니다.</p>
<ol><li><code>report2</code>: <code>report</code>의 <code>'불량'</code>을 모두 <code>'NG'</code>로</li>
<li><code>date2</code>: <code>'2024.10.25'</code> → <code>'2024-10-25'</code></li>
<li><code>code2</code>: <code>'EQ 07 A'</code>의 공백을 모두 지워 <code>'EQ07A'</code></li>
<li><code>status</code>: <code>'  OK\\n'</code>의 앞뒤 공백과 줄바꿈을 지운 값</li></ol>`,
    starter: `report = '결과: 불량 3건, 불량률 0.3%'
dot_date = '2024.10.25'
code = 'EQ 07 A'
raw_status = '  OK\\n'

report2 = ''
date2 = ''
code2 = ''
status = ''

print(report2, date2, code2, status)
`,
    solution: `report = '결과: 불량 3건, 불량률 0.3%'
dot_date = '2024.10.25'
code = 'EQ 07 A'
raw_status = '  OK\\n'

report2 = report.replace('불량', 'NG')
date2 = dot_date.replace('.', '-')
code2 = code.replace(' ', '')
status = raw_status.strip()

print(report2, date2, code2, status)
`,
    hints: ["replace는 찾은 것을 모두 바꿉니다.", "공백을 지우려면 빈 문자열 '' 로 바꾸면 됩니다.", "raw_status.strip()"],
    checks: [
      { label: "1단계 report2", expr: "report2 == '결과: NG 3건, NG률 0.3%'", hint: "report.replace('불량', 'NG')" },
      { label: "2단계 date2", expr: "date2 == '2024-10-25'", hint: "dot_date.replace('.', '-')" },
      { label: "3단계 code2", expr: "code2 == 'EQ07A'", hint: "code.replace(' ', '')" },
      { label: "4단계 status", expr: "status == 'OK'", hint: "raw_status.strip()" },
    ],
  },
  {
    id: "3-5",
    unit: 3,
    title: "지저분한 로그 한 줄 정규화",
    type: "steps",
    level: 3,
    challenge: true,
    uses: [["strip()", "앞뒤 공백 제거"], ["split(' / ')", "구분 문자열로 나누기"], ["upper()", "대문자 통일"], ["replace()", "불필요한 글자 지우기"], ["'|'.join()", "다시 이어 붙이기"], ["startswith()", "형식 확인"]],
    origin: "문자열 메서드 종합 (유닛 3 종합)",
    desc: `<p>현장 PC가 남긴 로그 한 줄입니다. <code>raw = '  line-3 / temp=23.5 / ok  '</code></p>
<ol><li><code>items</code>: 앞뒤 공백을 지운 뒤 <code>' / '</code>로 나눈 리스트 → <code>['line-3', 'temp=23.5', 'ok']</code></li>
<li><code>line</code>: 첫 칸을 대문자로 → <code>'LINE-3'</code></li>
<li><code>temp</code>: 둘째 칸에서 <code>'temp='</code>를 지우고 <b>소수</b>로 → 23.5</li>
<li><code>status</code>: 셋째 칸을 대문자로 → <code>'OK'</code></li>
<li><code>clean</code>: 세 값을 <code>'|'</code>로 이은 문자열 → <code>'LINE-3|23.5|OK'</code></li>
<li><code>valid</code>: clean이 <code>'LINE-'</code>로 시작하고 <code>'|OK'</code>로 끝나면 True</li></ol>`,
    starter: `raw = '  line-3 / temp=23.5 / ok  '

items = []
line = ''
temp = 0
status = ''
clean = ''
valid = None

print(clean, valid)
`,
    solution: `raw = '  line-3 / temp=23.5 / ok  '

items = raw.strip().split(' / ')
line = items[0].upper()
temp = float(items[1].replace('temp=', ''))
status = items[2].upper()
clean = '|'.join([line, str(temp), status])
valid = clean.startswith('LINE-') and clean.endswith('|OK')

print(clean, valid)
`,
    hints: ["메서드는 이어서 쓸 수 있습니다: raw.strip().split(' / ')", "temp는 replace로 'temp='를 지운 뒤 float()", "join은 문자열만 이을 수 있어서 temp는 str(temp)로 바꿔 넣습니다.", "두 조건을 모두 만족하면 True: A and B"],
    checks: [
      { label: "1단계 items", expr: "items == ['line-3', 'temp=23.5', 'ok']", hint: "raw.strip().split(' / ')" },
      { label: "2단계 line", expr: "line == 'LINE-3'", hint: "items[0].upper()" },
      { label: "3단계 temp (소수)", expr: "temp == 23.5 and type(temp) == float", hint: "float(items[1].replace('temp=', ''))" },
      { label: "4단계 status", expr: "status == 'OK'", hint: "items[2].upper()" },
      { label: "5단계 clean", expr: "clean == 'LINE-3|23.5|OK'", hint: "'|'.join([line, str(temp), status])" },
      { label: "6단계 valid", expr: "valid is True", hint: "clean.startswith('LINE-') and clean.endswith('|OK')" },
    ],
  },

  // ── 유닛 4 리스트 기초 ─────────────────────────────────
  {
    id: "4-1",
    unit: 4,
    title: "시간대별 온도 기록 읽기",
    type: "steps",
    level: 1,
    uses: [["리스트[0], 리스트[-1]", "처음과 마지막 값"], ["리스트[a:b]", "구간 잘라내기"], ["len()", "원소 개수"]],
    origin: "리스트 인덱싱·슬라이싱",
    desc: `<p>08시부터 1시간마다 잰 온도 리스트 <code>temps</code>가 있습니다.</p>
<ol><li><code>first</code>: 08시 온도</li><li><code>last</code>: 마지막 측정 온도</li>
<li><code>morning</code>: 09시~11시 온도 3개 (리스트)</li><li><code>n</code>: 측정 횟수</li>
<li><code>noon</code>: 12시 온도</li></ol>`,
    starter: `#        08시   09시   10시   11시   12시   13시
temps = [22.4, 23.1, 23.8, 24.0, 24.6, 23.9]

first = 0
last = 0
morning = []
n = 0
noon = 0

print(first, last, morning, n, noon)
`,
    solution: `#        08시   09시   10시   11시   12시   13시
temps = [22.4, 23.1, 23.8, 24.0, 24.6, 23.9]

first = temps[0]
last = temps[-1]
morning = temps[1:4]
n = len(temps)
noon = temps[4]

print(first, last, morning, n, noon)
`,
    hints: ["08시가 0번입니다. 12시는 몇 번일까요?", "09시~11시는 1, 2, 3번 → temps[1:4]"],
    checks: [
      { label: "1단계 first", expr: "first == 22.4", hint: "temps[0]" },
      { label: "2단계 last", expr: "last == 23.9", hint: "temps[-1]" },
      { label: "3단계 morning", expr: "morning == [23.1, 23.8, 24.0]", hint: "temps[1:4]" },
      { label: "4단계 n", expr: "n == 6", hint: "len(temps)" },
      { label: "5단계 noon", expr: "noon == 24.6", hint: "temps[4]" },
    ],
  },
  {
    id: "4-2",
    unit: 4,
    title: "라인별 실적표 (중첩 리스트)",
    type: "steps",
    level: 2,
    uses: [["리스트[i][j]", "바깥 i번째 리스트의 안쪽 j번째 값"], ["리스트[-1]", "마지막 행"], ["+", "값끼리 더하기"]],
    origin: "중첩 리스트 인덱싱",
    desc: `<p><code>table</code>의 각 행은 <code>[라인, 생산량, 불량 수]</code>입니다.</p>
<ol><li><code>l2_prod</code>: L2의 생산량</li><li><code>l3_bad</code>: L3의 불량 수</li>
<li><code>last_line</code>: 마지막 행의 라인 이름</li>
<li><code>total_bad</code>: 세 라인 불량 수의 합 (인덱싱으로 꺼내서 더하기)</li>
<li><code>l1_row</code>: L1 행 전체 (리스트)</li></ol>`,
    starter: `table = [
    ['L1', 980, 12],
    ['L2', 1010, 8],
    ['L3', 995, 15],
]

l2_prod = 0
l3_bad = 0
last_line = ''
total_bad = 0
l1_row = []

print(l2_prod, l3_bad, last_line, total_bad, l1_row)
`,
    solution: `table = [
    ['L1', 980, 12],
    ['L2', 1010, 8],
    ['L3', 995, 15],
]

l2_prod = table[1][1]
l3_bad = table[2][2]
last_line = table[-1][0]
total_bad = table[0][2] + table[1][2] + table[2][2]
l1_row = table[0]

print(l2_prod, l3_bad, last_line, total_bad, l1_row)
`,
    hints: ["L2 행은 table[1], 그 안의 생산량은 1번 → table[1][1]", "마지막 행의 0번 → table[-1][0]"],
    checks: [
      { label: "1단계 l2_prod", expr: "l2_prod == 1010", hint: "table[1][1]" },
      { label: "2단계 l3_bad", expr: "l3_bad == 15", hint: "table[2][2]" },
      { label: "3단계 last_line", expr: "last_line == 'L3'", hint: "table[-1][0]" },
      { label: "4단계 total_bad", expr: "total_bad == 35", hint: "table[0][2] + table[1][2] + table[2][2]" },
      { label: "5단계 l1_row", expr: "l1_row == ['L1', 980, 12]", hint: "table[0]" },
    ],
  },
  {
    id: "4-3",
    unit: 4,
    title: "검사 대기열 수정·삭제",
    type: "steps",
    level: 2,
    uses: [["리스트[i] = 값", "i번째 값 바꾸기"], ["del 리스트[i]", "i번째 지우기"], ["del 리스트[a:b]", "구간 지우기"]],
    origin: "리스트 수정과 del",
    desc: `<p>검사 대기열 <code>queue</code>를 아래 순서대로 고치세요. 순서가 바뀌면 번호도 달라집니다.</p>
<ol><li>2번(세 번째) 시료 <code>'S03'</code>을 재검 표시 <code>'S03-R'</code>로 바꾸기</li>
<li>맨 앞 시료는 검사가 끝났으니 지우기</li>
<li>남은 대기열의 마지막 두 개는 다음 날로 미뤄 지우기</li></ol>
<p>최종 <code>queue</code>와 남은 개수 <code>remain</code>을 확인합니다.</p>`,
    starter: `queue = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06']

# 1. S03 → S03-R

# 2. 맨 앞 삭제

# 3. 마지막 두 개 삭제

remain = 0
print(queue, remain)
`,
    solution: `queue = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06']

queue[2] = 'S03-R'
del queue[0]
del queue[-2:]

remain = len(queue)
print(queue, remain)
`,
    hints: ["queue[2] = 'S03-R'", "del queue[0]", "마지막 두 개는 del queue[-2:]"],
    checks: [
      { label: "최종 queue", expr: "queue == ['S02', 'S03-R', 'S04']", hint: "순서대로 수정 → 맨 앞 삭제 → 마지막 두 개 삭제" },
      { label: "남은 개수", expr: "remain == 3", hint: "len(queue)" },
    ],
  },
  {
    id: "4-4",
    unit: 4,
    title: "append와 extend 비교",
    type: "steps",
    level: 2,
    uses: [["append(x)", "x를 통째로 1개 추가"], ["extend(리스트)", "리스트 안의 값을 하나씩 추가"], ["[0] * n", "같은 값 n개짜리 리스트"], ["리스트 + 리스트", "이어 붙인 새 리스트"]],
    origin: "append vs extend, +, *",
    desc: `<p>새로 들어온 로트 <code>new_lots</code>를 기존 목록에 추가합니다.</p>
<ol><li><code>a</code>: <code>['LOT1', 'LOT2']</code>에 new_lots를 <b>append</b></li>
<li><code>e</code>: <code>['LOT1', 'LOT2']</code>에 new_lots를 <b>extend</b></li>
<li><code>len_a</code>, <code>len_e</code>: 각각의 길이</li>
<li><code>counter</code>: 라인 4개의 불량 카운터를 0으로 초기화 → <code>[0, 0, 0, 0]</code> (<code>*</code> 사용)</li>
<li><code>merged</code>: <code>day_lots + night_lots</code></li></ol>`,
    starter: `new_lots = ['LOT3', 'LOT4']
day_lots = ['D1', 'D2']
night_lots = ['N1']

a = ['LOT1', 'LOT2']
# a에 append

e = ['LOT1', 'LOT2']
# e에 extend

len_a = 0
len_e = 0
counter = []
merged = []

print(a, len_a)
print(e, len_e)
print(counter, merged)
`,
    solution: `new_lots = ['LOT3', 'LOT4']
day_lots = ['D1', 'D2']
night_lots = ['N1']

a = ['LOT1', 'LOT2']
a.append(new_lots)

e = ['LOT1', 'LOT2']
e.extend(new_lots)

len_a = len(a)
len_e = len(e)
counter = [0] * 4
merged = day_lots + night_lots

print(a, len_a)
print(e, len_e)
print(counter, merged)
`,
    hints: ["a.append(new_lots) 는 리스트를 통째로 1칸에 넣습니다.", "e.extend(new_lots) 는 LOT3, LOT4를 하나씩 넣습니다.", "counter = [0] * 4"],
    checks: [
      { label: "1단계 append 결과", expr: "a == ['LOT1', 'LOT2', ['LOT3', 'LOT4']]", hint: "a.append(new_lots)" },
      { label: "2단계 extend 결과", expr: "e == ['LOT1', 'LOT2', 'LOT3', 'LOT4']", hint: "e.extend(new_lots)" },
      { label: "3단계 길이 비교", expr: "len_a == 3 and len_e == 4", hint: "len(a), len(e)" },
      { label: "4단계 counter", expr: "counter == [0, 0, 0, 0]", hint: "[0] * 4" },
      { label: "5단계 merged", expr: "merged == ['D1', 'D2', 'N1']", hint: "day_lots + night_lots" },
    ],
  },
  {
    id: "4-5",
    unit: 4,
    title: "주야간 생산 기록 정리",
    type: "steps",
    level: 3,
    challenge: true,
    uses: [["리스트[i] = 값", "잘못 입력된 값 고치기"], ["+", "두 리스트 합치기"], ["append()", "값 1개 추가"], ["del", "삭제"], ["sum()", "리스트 합계 (내장함수)"], ["리스트[i][j]", "중첩 리스트에서 꺼내기"]],
    origin: "리스트 기초 종합 (유닛 4 종합)",
    desc: `<p>주간(<code>day</code>)과 야간(<code>night</code>) 생산 기록을 정리합니다. 아래 순서를 지키세요.</p>
<ol><li>주간 두 번째 기록이 118이 아니라 <b>121</b>로 정정됐습니다.</li>
<li><code>week</code>: 주간 기록 뒤에 야간 기록을 이어 붙인 새 리스트</li>
<li>week 끝에 특근 기록 <b>98</b>을 추가</li>
<li>week의 맨 앞 기록은 시험 생산이라 삭제</li>
<li><code>week_total</code>: week의 합계 (<code>sum()</code>)</li>
<li><code>report</code>: <code>[['day', 주간 원소 수], ['night', 야간 원소 수], ['total', week_total]]</code></li>
<li><code>night_count</code>: report에서 야간 원소 수를 인덱싱으로 꺼낸 값</li></ol>`,
    starter: `day = [120, 118, 125]
night = [110, 115]

# 1. 정정

week = []
# 3. 특근 추가

# 4. 맨 앞 삭제

week_total = 0
report = []
night_count = 0

print(week, week_total)
print(report, night_count)
`,
    solution: `day = [120, 118, 125]
night = [110, 115]

day[1] = 121

week = day + night
week.append(98)

del week[0]

week_total = sum(week)
report = [['day', len(day)], ['night', len(night)], ['total', week_total]]
night_count = report[1][1]

print(week, week_total)
print(report, night_count)
`,
    hints: ["정정을 week를 만들기 전에 해야 week에도 반영됩니다.", "week = day + night 후 week.append(98), del week[0]", "report[1] 은 ['night', 2] → report[1][1]"],
    checks: [
      { label: "1단계 정정 (day)", expr: "day == [120, 121, 125]", hint: "day[1] = 121" },
      { label: "2~4단계 week", expr: "week == [121, 125, 110, 115, 98]", hint: "day + night → append(98) → del week[0]" },
      { label: "5단계 week_total", expr: "week_total == 569", hint: "sum(week)" },
      { label: "6단계 report", expr: "report == [['day', 3], ['night', 2], ['total', 569]]", hint: "[['day', len(day)], ['night', len(night)], ['total', week_total]]" },
      { label: "7단계 night_count", expr: "night_count == 2", hint: "report[1][1]" },
    ],
  },

  // ── 유닛 5 리스트 정렬과 에러 읽기 ─────────────────────
  {
    id: "5-1",
    unit: 5,
    title: "sorted와 sort의 차이",
    type: "steps",
    level: 1,
    uses: [["sorted(리스트)", "정렬된 새 리스트 (원본 그대로)"], ["리스트.sort()", "원본을 정렬 (돌려주는 값 None)"], ["리스트.reverse()", "순서 뒤집기"]],
    origin: "sort vs sorted, reverse",
    desc: `<p>부품 무게 <code>weights</code>를 정렬합니다. 순서대로 하세요.</p>
<ol><li><code>asc</code>: <code>sorted()</code>로 만든 오름차순 리스트 (이때 weights는 그대로)</li>
<li><code>original</code>: 1번 직후 weights의 복사본 → <code>weights[:]</code></li>
<li>weights를 <code>.sort()</code>로 정렬한 뒤 <code>.reverse()</code>로 뒤집어 내림차순으로 만들기</li>
<li><code>result</code>: <code>[3, 1, 2].sort()</code>의 결과를 담아 보고, 무엇이 담기는지 확인하기</li></ol>`,
    starter: `weights = [3.2, 1.8, 2.5, 4.1, 2.9]

asc = []
original = []

# 3. weights 내림차순

result = 'unknown'
print(asc, original, weights, result)
`,
    solution: `weights = [3.2, 1.8, 2.5, 4.1, 2.9]

asc = sorted(weights)
original = weights[:]

weights.sort()
weights.reverse()

result = [3, 1, 2].sort()
print(asc, original, weights, result)
`,
    hints: ["asc = sorted(weights) 는 원본을 건드리지 않습니다.", "weights.sort() 다음 weights.reverse()", "sort()는 원본을 바꾸기만 하고 None을 돌려줍니다. 그래서 a = a.sort() 처럼 쓰면 리스트가 사라집니다."],
    checks: [
      { label: "1단계 asc", expr: "asc == [1.8, 2.5, 2.9, 3.2, 4.1]", hint: "sorted(weights)" },
      { label: "2단계 원본은 그대로", expr: "original == [3.2, 1.8, 2.5, 4.1, 2.9]", hint: "sorted()는 원본을 바꾸지 않습니다. original = weights[:] 를 sort() 전에 쓰세요." },
      { label: "3단계 weights 내림차순", expr: "weights == [4.1, 3.2, 2.9, 2.5, 1.8]", hint: "weights.sort() 후 weights.reverse()" },
      { label: "4단계 sort()의 반환값", expr: "result is None", hint: "result = [3, 1, 2].sort()" },
    ],
  },
  {
    id: "5-2",
    unit: 5,
    title: "검사 대기열에서 꺼내기",
    type: "steps",
    level: 1,
    uses: [["pop()", "맨 뒤 값을 꺼내서 돌려줌"], ["pop(0)", "맨 앞 값을 꺼냄"], ["remove(값)", "그 값을 찾아 지움 (처음 하나만)"]],
    origin: "pop, remove",
    desc: `<p>검사 대기열 <code>wait</code>에서 순서대로 처리합니다.</p>
<ol><li><code>urgent</code>: 맨 뒤의 긴급 시료를 꺼낸 값 (<code>pop()</code>)</li>
<li><code>first</code>: 맨 앞 시료를 꺼낸 값 (<code>pop(0)</code>)</li>
<li>취소된 시료 <code>'P3'</code>를 값으로 지우기 (<code>remove</code>)</li>
<li><code>left</code>: 남은 개수</li></ol>`,
    starter: `wait = ['P1', 'P2', 'P3', 'P4', 'P3', 'P9']

urgent = ''
first = ''
# 3. P3 지우기

left = 0
print(urgent, first, wait, left)
`,
    solution: `wait = ['P1', 'P2', 'P3', 'P4', 'P3', 'P9']

urgent = wait.pop()
first = wait.pop(0)
wait.remove('P3')

left = len(wait)
print(urgent, first, wait, left)
`,
    hints: ["urgent = wait.pop()", "first = wait.pop(0)", "remove는 같은 값이 여러 개면 가장 앞의 하나만 지웁니다."],
    checks: [
      { label: "1단계 urgent", expr: "urgent == 'P9'", hint: "wait.pop()" },
      { label: "2단계 first", expr: "first == 'P1'", hint: "wait.pop(0)" },
      { label: "3단계 remove 후 wait", expr: "wait == ['P2', 'P4', 'P3']", hint: "wait.remove('P3') 는 앞쪽 P3 하나만 지웁니다." },
      { label: "4단계 left", expr: "left == 3", hint: "len(wait)" },
    ],
  },
  {
    id: "5-3",
    unit: 5,
    title: "에러 고치기 ① IndexError · NameError",
    type: "steps",
    level: 2,
    uses: [["IndexError", "없는 번호로 꺼냄. 마지막은 [-1] 또는 [len-1]"], ["NameError", "없는 변수 이름. 오타 확인"], ["에러 메시지의 줄 번호", "어디서 났는지 먼저 확인"]],
    origin: "파이썬 에러 관리하기",
    desc: `<p>동료가 짠 코드가 실행되지 않습니다. <b>실행</b>을 눌러 에러 메시지를 읽고, 에러가 없어질 때까지 고치세요.</p>
<ul><li><code>last</code>: 마지막 측정값</li><li><code>diff</code>: 첫 측정값과 두 번째 측정값의 차이 (두 번째 − 첫 번째)</li><li><code>avg</code>: 세 값의 평균</li></ul>
<p class="muted">계산식의 의도는 맞습니다. 에러가 나는 부분만 고치세요.</p>`,
    starter: `values = [12.0, 12.6, 12.3]

last = values[3]
diff = valuse[1] - values[0]
avg = (values[0] + values[1] + values[2]) / 3

print(last, diff, avg)
`,
    solution: `values = [12.0, 12.6, 12.3]

last = values[2]
diff = values[1] - values[0]
avg = (values[0] + values[1] + values[2]) / 3

print(last, diff, avg)
`,
    hints: ["원소가 3개면 번호는 0, 1, 2 까지입니다.", "NameError: name 'valuse' is not defined → 철자를 보세요."],
    checks: [
      { label: "last (IndexError 해결)", expr: "last == 12.3", hint: "values[3]은 없습니다. values[2] 또는 values[-1]" },
      { label: "diff (NameError 해결)", expr: "abs(diff - 0.6) < 1e-9", hint: "valuse → values" },
      { label: "avg", expr: "abs(avg - 12.3) < 1e-9", hint: "에러가 위에서 나면 아래 줄은 실행되지 않습니다." },
    ],
  },
  {
    id: "5-4",
    unit: 5,
    title: "에러 고치기 ② Syntax · ZeroDivision · Type",
    type: "steps",
    level: 2,
    uses: [["SyntaxError", "괄호·따옴표 짝 확인"], ["ZeroDivisionError", "0으로 나누지 않았는지"], ["TypeError", "문자열 + 숫자는 str()로"]],
    origin: "파이썬 에러 관리하기",
    desc: `<p>이번에도 에러가 납니다. 하나를 고치면 다음 에러가 보입니다. 끝까지 고치세요.</p>
<ul><li><code>title</code>: <code>'주간 불량 리포트'</code></li>
<li><code>daily</code>: 주간 불량 <code>total</code>을 실제 가동일 수로 나눈 하루 평균. <b>이번 주 가동일은 5일</b>입니다.</li>
<li><code>msg</code>: <code>'하루 평균 불량 4.0건'</code></li></ul>`,
    starter: `title = ('주간 불량 리포트'
total = 20
days = 0
daily = total / days
msg = '하루 평균 불량 ' + daily + '건'

print(title, msg)
`,
    solution: `title = ('주간 불량 리포트')
total = 20
days = 5
daily = total / days
msg = '하루 평균 불량 ' + str(daily) + '건'

print(title, msg)
`,
    hints: ["SyntaxError: '(' was never closed → 여는 괄호에 닫는 괄호가 없습니다.", "days가 0이면 나눌 수 없습니다. 가동일은 5일입니다.", "TypeError: can only concatenate str (not \"float\") to str → str(daily)"],
    checks: [
      { label: "title (SyntaxError 해결)", expr: "title == '주간 불량 리포트'", hint: "괄호를 닫거나 괄호를 지우세요." },
      { label: "daily (ZeroDivisionError 해결)", expr: "daily == 4.0", hint: "days = 5" },
      { label: "msg (TypeError 해결)", expr: "msg == '하루 평균 불량 4.0건'", hint: "'하루 평균 불량 ' + str(daily) + '건'" },
    ],
  },
  {
    id: "5-5",
    unit: 5,
    title: "측정값 중앙값과 절사 데이터",
    type: "steps",
    level: 3,
    challenge: true,
    uses: [["sorted()", "원본은 두고 정렬본 만들기"], ["sorted(..., reverse=True)", "큰 값부터"], ["len(s) // 2", "가운데 번호 (원소 수가 홀수일 때)"], ["[1:-1]", "양 끝 하나씩 빼기"], ["pop()", "꺼내면서 지우기"]],
    origin: "리스트 정렬 종합 (유닛 5 종합)",
    desc: `<p>두께 측정값 <code>readings</code>(7개)에 튀는 값이 섞여 있습니다. 평균 대신 <b>중앙값</b>과 <b>절사 데이터</b>로 봅니다.</p>
<ol><li><code>s</code>: 오름차순 정렬본 (<b>readings 원본 순서는 유지</b>)</li>
<li><code>median</code>: s의 가운데 값. 번호는 <code>len(s) // 2</code>로 구하세요.</li>
<li><code>trimmed</code>: s에서 가장 작은 값과 가장 큰 값을 하나씩 뺀 리스트</li>
<li><code>top2</code>: 큰 값 두 개 (큰 값부터)</li>
<li><code>outlier</code>: s에서 <code>pop()</code>으로 꺼낸 가장 큰 값. 꺼낸 뒤 s의 길이는 <code>s_len</code></li></ol>`,
    starter: `readings = [12.4, 12.1, 12.9, 12.3, 15.8, 12.2, 12.5]

s = []
median = 0
trimmed = []
top2 = []
outlier = 0
s_len = 0

print(s, median, trimmed, top2, outlier, s_len)
`,
    solution: `readings = [12.4, 12.1, 12.9, 12.3, 15.8, 12.2, 12.5]

s = sorted(readings)
median = s[len(s) // 2]
trimmed = s[1:-1]
top2 = sorted(readings, reverse=True)[:2]
outlier = s.pop()
s_len = len(s)

print(s, median, trimmed, top2, outlier, s_len)
`,
    hints: ["readings.sort()를 쓰면 원본이 바뀝니다. sorted(readings)", "7개면 가운데 번호는 7 // 2 = 3", "outlier = s.pop() 는 다른 값을 다 구한 뒤 마지막에 하세요. 먼저 꺼내면 median이 달라집니다."],
    checks: [
      { label: "1단계 원본 순서 유지", expr: "readings == [12.4, 12.1, 12.9, 12.3, 15.8, 12.2, 12.5]", hint: "sort() 대신 sorted()" },
      { label: "2단계 median", expr: "median == 12.4", hint: "s[len(s) // 2]" },
      { label: "3단계 trimmed", expr: "trimmed == [12.2, 12.3, 12.4, 12.5, 12.9]", hint: "s[1:-1]" },
      { label: "4단계 top2", expr: "top2 == [15.8, 12.9]", hint: "sorted(readings, reverse=True)[:2]" },
      { label: "5단계 outlier와 s_len", expr: "outlier == 15.8 and s_len == 6 and s == [12.1, 12.2, 12.3, 12.4, 12.5, 12.9]", hint: "outlier = s.pop(), s_len = len(s)" },
    ],
  },

  // ── 유닛 6 딕셔너리와 Set ─────────────────────────────
  {
    id: "6-1",
    unit: 6,
    title: "설비 카드 CRUD",
    type: "steps",
    level: 1,
    uses: [["딕셔너리[키]", "값 읽기"], ["딕셔너리[새 키] = 값", "추가"], ["딕셔너리[있는 키] = 값", "수정"], ["del 딕셔너리[키]", "삭제"]],
    origin: "딕셔너리 CRUD",
    desc: `<p>설비 카드 <code>eqp</code>를 순서대로 다루세요.</p>
<ol><li><b>R</b> <code>line</code>: 설비가 있는 라인 읽기</li>
<li><b>C</b> <code>'status'</code> 키에 <code>'RUN'</code> 추가</li>
<li><b>U</b> 설정 온도 <code>'temp'</code>를 185로 수정</li>
<li><b>D</b> <code>'line'</code> 키 삭제</li></ol>`,
    starter: `eqp = {'id': 'EQ-07', 'line': 'L2', 'temp': 180}

line = ''
# 2. 추가

# 3. 수정

# 4. 삭제

print(line, eqp)
`,
    solution: `eqp = {'id': 'EQ-07', 'line': 'L2', 'temp': 180}

line = eqp['line']
eqp['status'] = 'RUN'
eqp['temp'] = 185
del eqp['line']

print(line, eqp)
`,
    hints: ["읽기: eqp['line']", "없는 키에 값을 넣으면 추가, 있는 키에 넣으면 수정입니다.", "del eqp['line']"],
    checks: [
      { label: "R 읽기", expr: "line == 'L2'", hint: "eqp['line']" },
      { label: "C 추가", expr: "eqp.get('status') == 'RUN'", hint: "eqp['status'] = 'RUN'" },
      { label: "U 수정", expr: "eqp.get('temp') == 185", hint: "eqp['temp'] = 185" },
      { label: "D 삭제", expr: "'line' not in eqp and eqp == {'id': 'EQ-07', 'temp': 185, 'status': 'RUN'}", hint: "del eqp['line']" },
    ],
  },
  {
    id: "6-2",
    unit: 6,
    title: "규격표 한꺼번에 보기",
    type: "steps",
    level: 1,
    uses: [["keys()", "키 모음"], ["values()", "값 모음"], ["items()", "(키, 값) 쌍 모음"], ["list()", "리스트로 바꾸기"], ["in", "키가 있는지 True/False"]],
    origin: "keys, values, items, in",
    desc: `<p>공정 규격표 <code>spec</code>에서 정보를 뽑습니다.</p>
<ol><li><code>names</code>: 키 리스트</li><li><code>limits</code>: 값 리스트</li><li><code>pairs</code>: (키, 값) 쌍 리스트</li>
<li><code>has_temp</code>: <code>'temp'</code> 키가 있는지</li><li><code>has_vib</code>: <code>'vib'</code> 키가 있는지</li>
<li><code>second_name</code>: names의 두 번째 키</li></ol>`,
    starter: `spec = {'temp': 25, 'humid': 45, 'press': 1.0}

names = []
limits = []
pairs = []
has_temp = None
has_vib = None
second_name = ''

print(names, limits, pairs, has_temp, has_vib, second_name)
`,
    solution: `spec = {'temp': 25, 'humid': 45, 'press': 1.0}

names = list(spec.keys())
limits = list(spec.values())
pairs = list(spec.items())
has_temp = 'temp' in spec
has_vib = 'vib' in spec
second_name = names[1]

print(names, limits, pairs, has_temp, has_vib, second_name)
`,
    hints: ["spec.keys()는 dict_keys라서 list()로 감싸면 리스트가 됩니다.", "'temp' in spec 은 True/False", "second_name = names[1]"],
    checks: [
      { label: "1단계 names", expr: "names == ['temp', 'humid', 'press']", hint: "list(spec.keys())" },
      { label: "2단계 limits", expr: "limits == [25, 45, 1.0]", hint: "list(spec.values())" },
      { label: "3단계 pairs", expr: "pairs == [('temp', 25), ('humid', 45), ('press', 1.0)]", hint: "list(spec.items())" },
      { label: "4단계 has_temp / has_vib", expr: "has_temp is True and has_vib is False", hint: "'temp' in spec, 'vib' in spec" },
      { label: "5단계 second_name", expr: "second_name == 'humid'", hint: "names[1]" },
    ],
  },
  {
    id: "6-3",
    unit: 6,
    title: "자재 재고 입출고",
    type: "steps",
    level: 2,
    uses: [["d[키] = d[키] - n", "있는 값에서 빼기"], ["d.get(키, 0)", "키가 없으면 0을 돌려줌"], ["len()", "키 개수"], ["clear()", "모두 비우기"]],
    origin: "딕셔너리 수정, get",
    desc: `<p>자재 재고 <code>stock</code>을 갱신합니다.</p>
<ol><li>자재 A를 3개 출고 (기존 값에서 빼기)</li>
<li>자재 C를 5개 입고. C는 아직 목록에 없습니다. <code>stock.get('C', 0) + 5</code>처럼 처리하세요.</li>
<li>자재 B를 2개 입고 (같은 방법)</li>
<li><code>kinds</code>: 자재 종류 수</li>
<li><code>backup</code>: 갱신된 재고의 복사본 <code>dict(stock)</code>를 만든 뒤, stock은 <code>clear()</code>로 비우기 (재고 실사 시작)</li></ol>`,
    starter: `stock = {'A': 10, 'B': 4}

# 1~3. 입출고

kinds = 0
backup = {}
# 5. 비우기

print(backup, kinds, stock)
`,
    solution: `stock = {'A': 10, 'B': 4}

stock['A'] = stock['A'] - 3
stock['C'] = stock.get('C', 0) + 5
stock['B'] = stock.get('B', 0) + 2

kinds = len(stock)
backup = dict(stock)
stock.clear()

print(backup, kinds, stock)
`,
    hints: ["stock['C'] + 5 는 C가 없어서 KeyError 입니다. get을 쓰세요.", "backup = dict(stock) 은 clear() 전에!", "stock.clear()"],
    checks: [
      { label: "1~3단계 갱신된 재고", expr: "backup == {'A': 7, 'B': 6, 'C': 5}", hint: "A는 -3, C는 get으로 +5, B는 +2. backup은 clear() 전에 만드세요." },
      { label: "4단계 kinds", expr: "kinds == 3", hint: "len(stock)" },
      { label: "5단계 stock 비우기", expr: "stock == {}", hint: "stock.clear()" },
    ],
  },
  {
    id: "6-4",
    unit: 6,
    title: "점검 설비 중복 제거 (Set)",
    type: "steps",
    level: 2,
    uses: [["set(리스트)", "중복 제거"], ["add()", "원소 추가"], ["union()", "합집합"], ["intersection()", "교집합"], ["sorted(set)", "정렬된 리스트로"]],
    origin: "set, add, union, intersection",
    desc: `<p>오늘 점검 기록 <code>log</code>에는 같은 설비가 여러 번 적혀 있습니다.</p>
<ol><li><code>checked</code>: 중복을 없앤 설비 집합</li><li><code>n_checked</code>: 점검한 설비 수</li>
<li>checked에 오후에 점검한 <code>'C09'</code> 추가</li>
<li><code>both</code>: 1라인과 2라인이 <b>함께 쓰는</b> 설비 (교집합)</li>
<li><code>every</code>: 두 라인의 설비 전체 (합집합)</li>
<li><code>every_list</code>: every를 정렬한 리스트</li></ol>`,
    starter: `log = ['A01', 'A03', 'A03', 'B02', 'A01', 'B02']
line1 = {'A01', 'A03', 'B02'}
line2 = {'B02', 'C05', 'A03'}

checked = set()
n_checked = 0
# 3. C09 추가

both = set()
every = set()
every_list = []

print(checked, n_checked, both, every_list)
`,
    solution: `log = ['A01', 'A03', 'A03', 'B02', 'A01', 'B02']
line1 = {'A01', 'A03', 'B02'}
line2 = {'B02', 'C05', 'A03'}

checked = set(log)
n_checked = len(checked)
checked.add('C09')

both = line1.intersection(line2)
every = line1.union(line2)
every_list = sorted(every)

print(checked, n_checked, both, every_list)
`,
    hints: ["checked = set(log)", "n_checked 는 C09를 추가하기 전에 세세요.", "Set은 순서가 없으니 순서대로 보려면 sorted(every)"],
    checks: [
      { label: "1~3단계 checked", expr: "checked == {'A01', 'A03', 'B02', 'C09'}", hint: "set(log) 후 checked.add('C09')" },
      { label: "2단계 n_checked", expr: "n_checked == 3", hint: "add 전에 len(checked)" },
      { label: "4단계 both", expr: "both == {'A03', 'B02'}", hint: "line1.intersection(line2)" },
      { label: "5단계 every", expr: "every == {'A01', 'A03', 'B02', 'C05'}", hint: "line1.union(line2)" },
      { label: "6단계 every_list", expr: "every_list == ['A01', 'A03', 'B02', 'C05']", hint: "sorted(every)" },
    ],
  },
  {
    id: "6-5",
    unit: 6,
    title: "설비 점검 현황 종합",
    type: "steps",
    level: 3,
    challenge: true,
    uses: [["set()", "중복 제거"], ["set(딕셔너리)", "딕셔너리의 키로 집합 만들기"], ["A - B", "차집합: A에만 있는 것"], ["sorted()", "정렬된 리스트"], ["딕셔너리[키]", "값 찾기"], ["in", "포함 여부"]],
    origin: "딕셔너리 · Set 종합 (유닛 6 종합)",
    desc: `<p><code>eqp_line</code>은 설비 → 라인 대응표, <code>inspected</code>는 오늘 점검 기록(중복 있음, 대응표에 없는 오타 코드 포함)입니다.</p>
<ol><li><code>done</code>: 점검 기록 중 <b>대응표에 있는 설비만</b> 남긴 집합 (중복 없이). 힌트: 대응표의 키 집합과 교집합</li>
<li><code>todo</code>: 아직 점검하지 않은 설비를 정렬한 리스트 (차집합)</li>
<li><code>typo</code>: 대응표에 없는 코드 집합</li>
<li><code>rate</code>: 점검률(%) = 점검 설비 수 ÷ 전체 설비 수 × 100</li>
<li><code>summary</code>: <code>{'done': 점검 수, 'todo': 미점검 수, 'first_todo_line': todo 첫 설비의 라인}</code></li></ol>`,
    starter: `eqp_line = {'EQ1': 'L1', 'EQ2': 'L1', 'EQ3': 'L2', 'EQ4': 'L2', 'EQ5': 'L3'}
inspected = ['EQ1', 'EQ3', 'EQ3', 'EQ5', 'EQ8', 'EQ1']

done = set()
todo = []
typo = set()
rate = 0
summary = {}

print(done, todo, typo, rate, summary)
`,
    solution: `eqp_line = {'EQ1': 'L1', 'EQ2': 'L1', 'EQ3': 'L2', 'EQ4': 'L2', 'EQ5': 'L3'}
inspected = ['EQ1', 'EQ3', 'EQ3', 'EQ5', 'EQ8', 'EQ1']

all_eqp = set(eqp_line)
logged = set(inspected)
done = logged.intersection(all_eqp)
todo = sorted(all_eqp - done)
typo = logged - all_eqp
rate = len(done) / len(all_eqp) * 100
summary = {'done': len(done), 'todo': len(todo), 'first_todo_line': eqp_line[todo[0]]}

print(done, todo, typo, rate, summary)
`,
    hints: ["set(eqp_line) 은 키만 모은 집합 {'EQ1', ..., 'EQ5'} 입니다.", "done = set(inspected).intersection(set(eqp_line))", "todo = sorted(set(eqp_line) - done), typo = set(inspected) - set(eqp_line)", "todo[0] 의 라인은 eqp_line[todo[0]]"],
    checks: [
      { label: "1단계 done", expr: "done == {'EQ1', 'EQ3', 'EQ5'}", hint: "점검 기록 집합과 대응표 키 집합의 교집합" },
      { label: "2단계 todo", expr: "todo == ['EQ2', 'EQ4']", hint: "sorted(set(eqp_line) - done)" },
      { label: "3단계 typo", expr: "typo == {'EQ8'}", hint: "set(inspected) - set(eqp_line)" },
      { label: "4단계 rate", expr: "abs(rate - 60.0) < 1e-9", hint: "len(done) / len(eqp_line) * 100" },
      { label: "5단계 summary", expr: "summary == {'done': 3, 'todo': 2, 'first_todo_line': 'L1'}", hint: "{'done': len(done), 'todo': len(todo), 'first_todo_line': eqp_line[todo[0]]}" },
    ],
  },
];

// 유닛별 개념 퀴즈. 1회차 교안의 퀴즈(extend/append/pop/슬라이싱/중첩 인덱싱)도 녹였다.
export const DAY1_QUIZZES = [
  {
    id: "1-Q", unit: 1, title: "변수 · 사칙연산 개념 퀴즈", type: "quiz", level: 1, origin: "OX · 객관식 · 출력 예측",
    questions: [
      { kind: "short", q: "출력 결과를 쓰세요.", code: "print(10 // 3)", answer: "3", explain: "//는 몫입니다. 10 = 3 × 3 + 1" },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "print(10 / 2)", answer: "5.0", explain: "/ 나눗셈은 나누어떨어져도 항상 소수(float)를 돌려줍니다." },
      { kind: "choice", q: "2 ** 3의 결과는?", options: ["5", "6", "8", "9"], answer: 2, explain: "**는 거듭제곱입니다. 2 × 2 × 2 = 8" },
      { kind: "ox", q: "# 뒤에 쓴 내용은 실행되지 않는다.", answer: true, explain: "#은 주석입니다. 코드에 설명을 남길 때 씁니다." },
      { kind: "choice", q: "변수 이름으로 쓸 수 없는 것은?", options: ["defect_rate", "line2", "2line", "_tmp"], answer: 2, explain: "변수 이름은 숫자로 시작할 수 없습니다. 띄어쓰기 대신 _를 씁니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = 7\na = a + 3\nprint(a)", answer: "10", explain: "=는 오른쪽을 먼저 계산해 왼쪽에 다시 담습니다." },
      { kind: "short", q: "1,000개를 24개씩 담을 때 남는 개수를 구하는 식에 들어갈 연산자를 쓰세요. 1000 __ 24", answer: "%", explain: "% 나머지 연산자입니다. 1000 % 24 = 16" },
    ],
  },
  {
    id: "2-Q", unit: 2, title: "문자열 기초 개념 퀴즈", type: "quiz", level: 1, origin: "OX · 객관식 · 출력 예측",
    questions: [
      { kind: "short", q: "출력 결과를 쓰세요.", code: "s = 'PYTHON'\nprint(s[0])", answer: "P", explain: "인덱스는 0부터 셉니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "s = 'PYTHON'\nprint(s[-1])", answer: "N", explain: "-1은 마지막 글자입니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "s = 'PYTHON'\nprint(s[1:4])", answer: "YTH", explain: "[1:4]는 1, 2, 3번입니다. 끝 번호는 포함되지 않습니다." },
      { kind: "ox", q: "s[:4]와 s[0:4]는 같은 결과다.", answer: true, explain: "시작 번호를 비우면 처음부터입니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "print('ab' * 3)", answer: "ababab", explain: "문자열 * 숫자는 반복입니다." },
      { kind: "choice", q: "'불량 ' + 3 을 실행하면?", options: ["'불량 3'", "'불량 333'", "TypeError", "SyntaxError"], answer: 2, explain: "문자열과 숫자는 바로 더할 수 없습니다. '불량 ' + str(3)" },
      { kind: "choice", q: "type('120')의 결과는?", options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'list'>"], answer: 1, explain: "따옴표로 감싸면 숫자처럼 보여도 문자열입니다." },
    ],
  },
  {
    id: "3-Q", unit: 3, title: "문자열 메서드 개념 퀴즈", type: "quiz", level: 1, origin: "OX · 객관식 · 출력 예측",
    questions: [
      { kind: "short", q: "출력 결과를 쓰세요.", code: "print(','.join('ab12'))", answer: "a,b,1,2", explain: "join은 글자(원소) 사이사이에 구분자를 끼워 넣습니다." },
      { kind: "choice", q: "'hello,python, Elice'.split(', ')의 결과는?", options: ["['hello', 'python', 'Elice']", "['hello,python', 'Elice']", "['hello', 'python, Elice']", "['hello,python, Elice']"], answer: 1, explain: "구분자가 ', '(쉼표+공백)이므로 'hello,python' 사이의 쉼표에서는 나뉘지 않습니다. 교안의 예제입니다." },
      { kind: "ox", q: "split()의 결과는 리스트다.", answer: true, explain: "나눈 조각을 리스트로 돌려줍니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "print('Hello Python'.replace('Hello', ''))", answer: [" Python", "Python"], explain: "'Hello'를 빈 문자열로 바꾸면 앞의 공백이 남아 ' Python'이 됩니다." },
      { kind: "ox", q: "s = 'ok' 다음에 s.upper()만 실행하면 s는 'OK'가 된다.", answer: false, explain: "문자열 메서드는 새 문자열을 돌려줄 뿐 원본을 바꾸지 않습니다. s = s.upper()" },
      { kind: "choice", q: "'Pass'.startswith('P')의 결과는?", options: ["'P'", "True", "False", "0"], answer: 1, explain: "startswith/endswith는 True 또는 False를 돌려줍니다." },
    ],
  },
  {
    id: "4-Q", unit: 4, title: "리스트 기초 개념 퀴즈", type: "quiz", level: 1, origin: "교안 퀴즈 · 출력 예측",
    questions: [
      { kind: "short", q: "tests의 길이는? (교안 퀴즈 1)", code: "tests = [1, 2, 3, 4, 5]\ntests.extend(['apple', 'banana', 1, 2])\nprint(len(tests))", answer: "9", explain: "extend는 리스트 안의 값을 하나씩 추가합니다. 5 + 4 = 9" },
      { kind: "short", q: "출력 결과를 쓰세요. (교안 퀴즈 2)", code: "tests = [1, 2, 3, 4, 5, 'apple', 'banana', 1, 2]\nprint(tests[2:5])", answer: "[3, 4, 5]", explain: "2, 3, 4번 원소입니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = [1, 2]\na.append([3, 4])\nprint(len(a))", answer: "3", explain: "append는 리스트를 통째로 한 칸에 넣습니다. [1, 2, [3, 4]]" },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "c = ['Hello', ['python', 'hi'], 14]\nprint(c[1][0])", answer: ["python", "'python'"], explain: "c[1]은 ['python', 'hi'], 그 0번은 'python'입니다." },
      { kind: "short", q: "len(x)의 결과는? (교안 심화)", code: "x = [{'1': 13, 'name': 142}, [102, (1, 23), 4], (11), {14, 'apple'}, '!']", answer: "5", explain: "바깥 리스트의 원소는 딕셔너리, 리스트, 11, set, '!' 다섯 개입니다. (11)은 튜플이 아니라 그냥 11입니다." },
      { kind: "short", q: "x[1][1]의 결과는? (위와 같은 x)", answer: ["(1, 23)", "(1,23)"], explain: "x[1]은 [102, (1, 23), 4], 그 1번은 튜플 (1, 23)입니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = [1, 2, 22, 4, 5]\ndel a[3:-1]\nprint(a)", answer: "[1, 2, 22, 5]", explain: "[3:-1]은 3번부터 마지막 앞까지, 즉 4 하나입니다." },
    ],
  },
  {
    id: "5-Q", unit: 5, title: "정렬 · 에러 개념 퀴즈", type: "quiz", level: 1, origin: "교안 퀴즈 · OX · 에러 이름",
    questions: [
      { kind: "short", q: "출력 결과를 쓰세요. (교안 퀴즈 3)", code: "tests = [1, 2, 3, 4, 5, 'apple', 'banana', 1, 2]\ntests.pop()\nprint(tests[-1])", answer: "1", explain: "pop()은 맨 뒤의 2를 꺼냅니다. 이제 마지막 원소는 1입니다." },
      { kind: "ox", q: "sorted(a)를 실행하면 a 자체가 정렬된다.", answer: false, explain: "sorted()는 정렬된 새 리스트를 돌려주고 원본은 그대로입니다. 원본을 바꾸려면 a.sort()" },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = [3, 1, 2]\nb = a.sort()\nprint(b)", answer: "None", explain: "sort()는 원본을 바꾸고 None을 돌려줍니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = [5, 4, 3, 4]\na.remove(4)\nprint(a)", answer: "[5, 3, 4]", explain: "remove는 같은 값 중 가장 앞의 하나만 지웁니다." },
      { kind: "choice", q: "a = [1, 2, 3] 에서 print(a[3])을 실행하면?", options: ["SyntaxError", "IndexError", "NameError", "ZeroDivisionError"], answer: 1, explain: "번호는 0~2까지입니다. 없는 번호로 접근하면 IndexError" },
      { kind: "choice", q: "print(1, 2 를 실행하면?", options: ["SyntaxError", "IndexError", "NameError", "TypeError"], answer: 0, explain: "괄호를 닫지 않아 문법 오류입니다." },
      { kind: "choice", q: "만든 적 없는 변수 b를 print(b)하면?", options: ["SyntaxError", "IndexError", "NameError", "ZeroDivisionError"], answer: 2, explain: "NameError는 변수 이름 오타일 때도 자주 납니다." },
      { kind: "short", q: "print(5 / 0)을 실행했을 때 나오는 에러 이름을 쓰세요.", answer: "ZeroDivisionError", explain: "0으로 나누기를 시도하면 발생합니다." },
    ],
  },
  {
    id: "6-Q", unit: 6, title: "딕셔너리 · Set 개념 퀴즈", type: "quiz", level: 1, origin: "OX · 객관식 · 출력 예측",
    questions: [
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = {'name': 'Alice', 'age': 25}\na['age'] = 30\nprint(a['age'])", answer: "30", explain: "있는 키에 값을 넣으면 수정입니다." },
      { kind: "ox", q: "딕셔너리는 a[0]처럼 번호로 값을 꺼낼 수 있다.", answer: false, explain: "딕셔너리는 키로 접근합니다. 0이라는 키가 없으면 KeyError" },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = {'name': 'Alice', 'job': 'Engineer'}\nprint('hobby' in a)", answer: "False", explain: "in은 키가 있는지 확인합니다." },
      { kind: "choice", q: "(키, 값) 쌍을 모두 꺼내는 메서드는?", options: ["keys()", "values()", "items()", "get()"], answer: 2, explain: "items()는 dict_items([('name', 'Alice'), ...])를 돌려줍니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "s = {1, 2, 3, 4}\ns.add(3)\nprint(len(s))", answer: "4", explain: "Set은 중복을 허용하지 않아 3을 다시 넣어도 그대로입니다." },
      { kind: "short", q: "출력 결과를 쓰세요.", code: "a = {1, 2, 3}\nb = {3, 4, 5}\nprint(a.intersection(b))", answer: "{3}", explain: "교집합입니다. 합집합은 union()" },
      { kind: "choice", q: "type(set([1, 1, 2]))의 결과는?", options: ["<class 'list'>", "<class 'set'>", "<class 'dict'>", "<class 'tuple'>"], answer: 1, explain: "set()으로 감싸면 중복이 빠진 Set {1, 2}가 됩니다. 교안 퀴즈의 type(set(tests))와 같은 원리입니다." },
    ],
  },
];
