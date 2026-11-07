// 파이썬 기초 표준 라이브러리 코스(pb-13, 유닛 50) 문제. scratchpad build_stdlib.py 로 생성(모범답안을 실행해 기대값을 채움).
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(50-Q)는 두 과정이 함께 쓴다.
// 실행 날짜에 따라 답이 바뀌지 않도록 문제는 모두 고정 날짜를 쓴다.
export const PBS_UNITS = [
  {
    "id": 50,
    "title": "표준 라이브러리",
    "summary": "import, datetime · timedelta · strftime/strptime, math.ceil, random.seed · sample, os.path · makedirs",
    "note": "<h4>import</h4><p><code>import math</code> → <code>math.ceil()</code>, <code>from datetime import datetime, timedelta</code> → <code>datetime.now()</code>. import 문은 코드 맨 위에 모읍니다.</p><h4>datetime</h4><p>문자열 → 날짜 <code>datetime.strptime(s, '%Y-%m-%d %H:%M')</code>, 날짜 → 문자열 <code>dt.strftime('%Y%m%d')</code>. <code>dt + timedelta(minutes=10)</code>은 10분 뒤, <code>dt2 - dt1</code>은 간격(timedelta)이고 분은 <code>.total_seconds() / 60</code>. <code>dt.weekday()</code>는 월 0 ~ 일 6.</p><h4>math · random</h4><p>모자라면 안 되는 개수는 <code>math.ceil(전체 / 단위)</code>. <code>random.seed(n)</code>으로 고정하면 같은 난수가 다시 나옵니다. <code>random.sample(목록, k)</code>는 중복 없이 k개, <code>random.uniform(a, b)</code>는 a~b 소수.</p><h4>os</h4><p><code>os.path.join('logs', '20261101')</code>로 경로를 잇고, <code>os.makedirs(경로, exist_ok=True)</code>로 이미 있어도 에러 없이 폴더를 만듭니다. <code>os.path.exists(경로)</code>로 확인합니다.</p><p class=\"qc\">문자열 날짜를 그대로 비교 · 정렬하면 글자 순서로 비교됩니다. 계산 전에 strptime으로 바꾸세요.</p>"
  }
];

export const PBS_PROBLEMS = [
  {
    "id": "50-1",
    "unit": 50,
    "domain": "mfg",
    "title": "날짜별 검사 로그 파일 만들기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "os.path.join",
        "운영체제에 맞게 경로 잇기"
      ],
      [
        "os.makedirs(…, exist_ok=True)",
        "이미 있어도 에러 없이 폴더 만들기"
      ],
      [
        "strftime('%Y%m%d')",
        "날짜 → 폴더 이름 문자열"
      ],
      [
        "timedelta(minutes=10)",
        "10분 간격"
      ],
      [
        "random.uniform",
        "범위 안 소수 난수"
      ],
      [
        "csv.writer",
        "CSV 저장"
      ]
    ],
    "origin": "표준 라이브러리 종합",
    "desc": "<p>설비가 날짜별 폴더에 검사 로그를 쌓는 상황을 재현합니다. 검사한 날 <code>day</code>는 2026년 11월 1일로 고정합니다.</p>\n<ol><li><code>folder</code>: <code>logs/20261101</code> 경로. 그 폴더를 만드세요(이미 있어도 에러가 나면 안 됨)</li><li><code>times</code>: day 09:00부터 10분 간격 검사 시각 5개(datetime 리스트)</li><li><code>rows</code>: 각 행 <code>[시각 문자열, 온도, 판정]</code>. 온도는 23.0~27.0 사이 난수를 소수점 1자리로 반올림, 25.0 초과면 <code>'NG'</code> 아니면 <code>'OK'</code> (seed 42)</li><li><code>path</code>: folder 안 <code>inspection.csv</code>. 헤더 <code>time,temp,result</code> 다음 줄부터 rows를 저장</li></ol>",
    "starter": "import os\nimport random\nimport csv\nfrom datetime import datetime, timedelta\n\nrandom.seed(42)\nday = datetime(2026, 11, 1)    # 검사한 날\n\n# 1. 'logs/YYYYMMDD' 폴더 경로를 만들고, 그 폴더를 만드세요 (이미 있어도 에러 없이)\nfolder = \n\n# 2. day의 09:00부터 10분 간격 검사 시각 5개 (datetime 리스트)\nstart = day.replace(hour=9, minute=0)\ntimes = \n\n# 3. 시각마다 [시각 문자열 'YYYY-MM-DD HH:MM', 온도, 판정] 행 만들기\n#    온도: 23.0~27.0 사이 난수를 소수점 1자리로, 판정: 25.0 초과면 'NG' 아니면 'OK'\nrows = []\nfor t in times:\n    temp = \n    result = \n    rows.append([t.strftime('%Y-%m-%d %H:%M'), temp, result])\n\n# 4. folder 안 inspection.csv 경로를 만들고, 헤더 time,temp,result 와 rows를 저장하세요\npath = \n\nprint(path, os.path.exists(path))\nfor r in rows:\n    print(r)\n",
    "solution": "import os\nimport random\nimport csv\nfrom datetime import datetime, timedelta\n\nrandom.seed(42)\nday = datetime(2026, 11, 1)    # 검사한 날\n\n# 1. 'logs/YYYYMMDD' 폴더 경로를 만들고, 그 폴더를 만드세요 (이미 있어도 에러 없이)\nfolder = os.path.join('logs', day.strftime('%Y%m%d'))\nos.makedirs(folder, exist_ok=True)\n\n# 2. day의 09:00부터 10분 간격 검사 시각 5개 (datetime 리스트)\nstart = day.replace(hour=9, minute=0)\ntimes = [start + timedelta(minutes=10 * i) for i in range(5)]\n\n# 3. 시각마다 [시각 문자열 'YYYY-MM-DD HH:MM', 온도, 판정] 행 만들기\n#    온도: 23.0~27.0 사이 난수를 소수점 1자리로, 판정: 25.0 초과면 'NG' 아니면 'OK'\nrows = []\nfor t in times:\n    temp = round(random.uniform(23.0, 27.0), 1)\n    result = 'NG' if temp > 25.0 else 'OK'\n    rows.append([t.strftime('%Y-%m-%d %H:%M'), temp, result])\n\n# 4. folder 안 inspection.csv 경로를 만들고, 헤더 time,temp,result 와 rows를 저장하세요\npath = os.path.join(folder, 'inspection.csv')\nwith open(path, 'w', newline='', encoding='utf-8') as f:\n    writer = csv.writer(f)\n    writer.writerow(['time', 'temp', 'result'])\n    writer.writerows(rows)\n\nprint(path, os.path.exists(path))\nfor r in rows:\n    print(r)\n",
    "hints": [
      "폴더 이름은 day.strftime('%Y%m%d'), 경로는 os.path.join('logs', 폴더이름)입니다. 만든 뒤 os.makedirs(folder, exist_ok=True).",
      "검사 시각은 [start + timedelta(minutes=10 * i) for i in range(5)].",
      "난수는 반복 안에서 순서대로 뽑아야 seed 42의 결과와 같아집니다. round(random.uniform(23.0, 27.0), 1).",
      "CSV는 open(path, 'w', newline='', encoding='utf-8')로 열고 csv.writer의 writerow(헤더), writerows(rows)."
    ],
    "checks": [
      {
        "label": "1단계 logs/20261101 폴더",
        "expr": "folder == __import__('os').path.join('logs', '20261101') and __import__('os').path.isdir(folder)",
        "hint": "folder = os.path.join('logs', day.strftime('%Y%m%d')) 다음 줄에서 os.makedirs(folder, exist_ok=True)로 실제 폴더를 만드세요."
      },
      {
        "label": "2단계 09:00부터 10분 간격 5개",
        "expr": "[t.strftime('%Y-%m-%d %H:%M') for t in times] == ['2026-11-01 09:00', '2026-11-01 09:10', '2026-11-01 09:20', '2026-11-01 09:30', '2026-11-01 09:40']",
        "hint": "start + timedelta(minutes=10 * i) 를 i = 0~4로 만드세요."
      },
      {
        "label": "3단계 온도와 판정",
        "expr": "rows == [['2026-11-01 09:00', 25.6, 'NG'], ['2026-11-01 09:10', 23.1, 'OK'], ['2026-11-01 09:20', 24.1, 'OK'], ['2026-11-01 09:30', 23.9, 'OK'], ['2026-11-01 09:40', 25.9, 'NG']]",
        "hint": "seed 42에서 반복 순서대로 round(random.uniform(23.0, 27.0), 1)을 뽑고, 25.0 초과만 NG입니다(25.0은 OK)."
      },
      {
        "label": "4단계 inspection.csv 저장",
        "expr": "path == __import__('os').path.join('logs', '20261101', 'inspection.csv') and open(path, encoding='utf-8').read().splitlines() == ['time,temp,result', '2026-11-01 09:00,25.6,NG', '2026-11-01 09:10,23.1,OK', '2026-11-01 09:20,24.1,OK', '2026-11-01 09:30,23.9,OK', '2026-11-01 09:40,25.9,NG']",
        "hint": "헤더 한 줄 + 5행이 있어야 합니다. newline=''로 열어야 빈 줄이 끼지 않습니다."
      }
    ]
  },
  {
    "id": "50-2",
    "unit": 50,
    "domain": "mfg",
    "title": "검사 기록 사이 가장 긴 공백",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "datetime.strptime",
        "문자열 → 날짜"
      ],
      [
        "sorted",
        "시각 순서로 정렬"
      ],
      [
        "b - a",
        "두 시각의 간격(timedelta)"
      ],
      [
        "total_seconds() / 60",
        "간격을 분으로"
      ]
    ],
    "origin": "datetime",
    "desc": "<p>설비 검사 기록 시각 목록 <code>times</code>(문자열 <code>'YYYY-MM-DD HH:MM'</code>)가 주어집니다. 기록이 <b>순서대로 들어오지 않을 수도</b> 있습니다.</p><p>시각 순으로 놓았을 때 이웃한 두 기록 사이 간격 중 <b>가장 긴 간격(분, 정수)</b>을 반환하세요. 자정을 넘는 간격도 정확히 계산해야 합니다. 기록이 1개 이하면 0을 반환합니다.</p><p>예: <code>['2026-11-07 09:00', '2026-11-07 09:10', '2026-11-07 09:35', '2026-11-07 09:40']</code> → 25</p>",
    "starter": "from datetime import datetime\n\ndef solution(times):\n    answer = 0\n    return answer\n",
    "solution": "from datetime import datetime\n\ndef solution(times):\n    if len(times) < 2:\n        return 0\n    dts = sorted(datetime.strptime(t, '%Y-%m-%d %H:%M') for t in times)\n    gaps = [(b - a).total_seconds() / 60 for a, b in zip(dts, dts[1:])]\n    return int(max(gaps))\n",
    "hints": [
      "먼저 datetime.strptime(t, '%Y-%m-%d %H:%M')으로 모두 datetime으로 바꾸고 sorted로 정렬하세요.",
      "이웃한 쌍은 zip(dts, dts[1:])로 만들 수 있습니다. (b - a).total_seconds() / 60 이 분입니다.",
      "(b - a).seconds 는 날짜가 바뀌는 부분을 빼고 계산하므로 total_seconds()를 쓰세요."
    ],
    "tests": [
      {
        "args": [
          [
            "2026-11-07 09:00",
            "2026-11-07 09:10",
            "2026-11-07 09:35",
            "2026-11-07 09:40"
          ]
        ],
        "expected": 25
      },
      {
        "args": [
          [
            "2026-11-06 23:50",
            "2026-11-07 00:20",
            "2026-11-07 00:30"
          ]
        ],
        "expected": 30
      },
      {
        "args": [
          [
            "2026-11-07 10:00",
            "2026-11-07 08:00",
            "2026-11-07 09:15"
          ]
        ],
        "expected": 75,
        "hidden": true
      },
      {
        "args": [
          [
            "2026-11-07 09:00"
          ]
        ],
        "expected": 0,
        "hidden": true
      },
      {
        "args": [
          [
            "2026-10-31 22:00",
            "2026-11-01 01:30",
            "2026-11-01 02:00",
            "2026-11-01 02:05"
          ]
        ],
        "expected": 210,
        "hidden": true
      },
      {
        "args": [
          [
            "2026-11-07 13:05",
            "2026-11-07 13:00"
          ]
        ],
        "expected": 5,
        "hidden": true
      }
    ]
  },
  {
    "id": "50-3",
    "unit": 50,
    "domain": "general",
    "title": "배송 도착 예정일과 요일",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "datetime.strptime",
        "주문일 문자열 → 날짜"
      ],
      [
        "timedelta(days=n)",
        "n일 뒤"
      ],
      [
        "weekday()",
        "요일 번호 (월 0 ~ 일 6)"
      ],
      [
        "strftime('%Y-%m-%d %a')",
        "날짜 + 요일 약자"
      ]
    ],
    "origin": "datetime",
    "desc": "<p>온라인 쇼핑몰의 주문일 <code>order_date</code>(<code>'YYYY-MM-DD'</code>)와 배송에 걸리는 날 수 <code>days</code>가 주어집니다.</p><p>주문일에 days일을 더한 날이 도착 예정일입니다. 단, 그날이 <b>일요일이면 배송이 없어 다음 날(월요일)</b>로 미룹니다. 도착 예정일을 <code>'YYYY-MM-DD 요일'</code> 모양 문자열로 반환하세요. 요일은 영문 약자(<code>%a</code>: Mon, Tue …)입니다.</p><p>예: <code>solution('2026-11-07', 3)</code> → <code>'2026-11-10 Tue'</code>, <code>solution('2026-11-05', 3)</code> → 11월 8일이 일요일이라 <code>'2026-11-09 Mon'</code></p>",
    "starter": "from datetime import datetime, timedelta\n\ndef solution(order_date, days):\n    answer = ''\n    return answer\n",
    "solution": "from datetime import datetime, timedelta\n\ndef solution(order_date, days):\n    arrive = datetime.strptime(order_date, '%Y-%m-%d') + timedelta(days=days)\n    if arrive.weekday() == 6:          # 일요일이면 월요일로\n        arrive = arrive + timedelta(days=1)\n    return arrive.strftime('%Y-%m-%d %a')\n",
    "hints": [
      "datetime.strptime(order_date, '%Y-%m-%d') + timedelta(days=days)",
      "weekday()가 6이면 일요일입니다. timedelta(days=1)을 한 번 더 더하세요.",
      "마지막에 strftime('%Y-%m-%d %a')로 문자열을 만듭니다."
    ],
    "tests": [
      {
        "args": [
          "2026-11-07",
          3
        ],
        "expected": "2026-11-10 Tue"
      },
      {
        "args": [
          "2026-11-05",
          3
        ],
        "expected": "2026-11-09 Mon"
      },
      {
        "args": [
          "2026-11-28",
          5
        ],
        "expected": "2026-12-03 Thu",
        "hidden": true
      },
      {
        "args": [
          "2026-12-30",
          2
        ],
        "expected": "2027-01-01 Fri",
        "hidden": true
      },
      {
        "args": [
          "2026-11-07",
          1
        ],
        "expected": "2026-11-09 Mon",
        "hidden": true
      },
      {
        "args": [
          "2027-02-26",
          2
        ],
        "expected": "2027-03-01 Mon",
        "hidden": true
      }
    ]
  },
  {
    "id": "50-4",
    "unit": 50,
    "domain": "general",
    "title": "설문 경품 추첨과 결과 페이지 수",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "random.seed",
        "같은 추첨 결과를 다시 만들기"
      ],
      [
        "random.sample",
        "중복 없이 k명"
      ],
      [
        "math.ceil",
        "올림 (모자라면 안 되는 개수)"
      ]
    ],
    "origin": "math · random",
    "desc": "<p>설문 응답자 23명 <code>names</code> 중에서 경품 당첨자를 뽑고, 응답자 명단을 한 페이지에 10명씩 보여 주려고 합니다.</p>\n<ol><li><code>winners</code>: seed 2026으로 고정한 뒤 <code>names</code>에서 <b>중복 없이</b> 3명</li><li><code>pages</code>: 10명씩 보여 줄 때 필요한 페이지 수</li><li><code>last_page</code>: 마지막 페이지에 보이는 사람 수</li></ol><p>seed를 고정했으므로 누가 실행해도 같은 3명이 뽑힙니다. 추첨 결과를 나중에 검증할 수 있게 하는 방법입니다.</p>",
    "starter": "import math\nimport random\n\nnames = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',\n         'Han', 'Oh', 'Seo', 'Shin', 'Kwon', 'Hwang', 'Ahn', 'Song', 'Yoo', 'Hong',\n         'Jeon', 'Ko', 'Moon']    # 설문 응답자 23명\n\n# 1. seed를 2026으로 고정하고, names에서 중복 없이 3명을 뽑으세요\nrandom.seed(2026)\nwinners = \n\n# 2. 한 페이지에 10명씩 보여 줄 때 필요한 페이지 수 (모자라면 안 됨)\npages = \n\n# 3. 마지막 페이지에 보이는 사람 수\nlast_page = \n\nprint(winners, pages, last_page)\n",
    "solution": "import math\nimport random\n\nnames = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',\n         'Han', 'Oh', 'Seo', 'Shin', 'Kwon', 'Hwang', 'Ahn', 'Song', 'Yoo', 'Hong',\n         'Jeon', 'Ko', 'Moon']    # 설문 응답자 23명\n\n# 1. seed를 2026으로 고정하고, names에서 중복 없이 3명을 뽑으세요\nrandom.seed(2026)\nwinners = random.sample(names, 3)\n\n# 2. 한 페이지에 10명씩 보여 줄 때 필요한 페이지 수 (모자라면 안 됨)\npages = math.ceil(len(names) / 10)\n\n# 3. 마지막 페이지에 보이는 사람 수\nlast_page = len(names) - (pages - 1) * 10\n\nprint(winners, pages, last_page)\n",
    "hints": [
      "중복 없이 뽑기는 random.sample(names, 3)입니다. choice를 세 번 쓰면 같은 사람이 또 뽑힐 수 있습니다.",
      "23 / 10 = 2.3 페이지 → 남은 3명도 한 페이지가 필요하므로 math.ceil입니다. 23 // 10 은 2라 모자랍니다.",
      "마지막 페이지 = 전체 - (앞 페이지 수 × 10)."
    ],
    "checks": [
      {
        "label": "1단계 당첨자 3명",
        "expr": "winners == ['Choi', 'Han', 'Ahn']",
        "hint": "random.seed(2026) 바로 다음에 random.sample(names, 3)을 한 번만 호출하세요."
      },
      {
        "label": "2단계 페이지 수",
        "expr": "pages == 3",
        "hint": "math.ceil(len(names) / 10)"
      },
      {
        "label": "3단계 마지막 페이지 인원",
        "expr": "last_page == 3",
        "hint": "len(names) - (pages - 1) * 10"
      }
    ]
  }
];

export const PBS_QUIZZES = [
  {
    "id": "50-Q",
    "unit": 50,
    "title": "표준 라이브러리 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "strftime으로 made를 폴더 이름용 문자열 20261107 모양으로 출력하는 코드를 작성하세요.",
        "given": "from datetime import datetime\nmade = datetime(2026, 11, 7, 9, 30)",
        "expect": "20261107",
        "must": [
          "strftime\\("
        ],
        "solution": "from datetime import datetime\nmade = datetime(2026, 11, 7, 9, 30)\nprint(made.strftime('%Y%m%d'))",
        "explain": "%Y(연 4자리) %m(월 2자리) %d(일 2자리)를 붙여 쓰면 20261107이 됩니다. 날짜별 폴더 · 파일 이름에 자주 씁니다."
      },
      {
        "kind": "choice",
        "q": "부품 1,250개를 한 상자에 48개씩 담을 때 필요한 상자 수를 구하는 식은?",
        "options": [
          "1250 // 48",
          "round(1250 / 48)",
          "math.ceil(1250 / 48)",
          "math.floor(1250 / 48)"
        ],
        "answer": 2,
        "explain": "26.04…상자이므로 남은 2개를 담을 상자 하나가 더 필요합니다(27). 몫(//)과 floor는 26, round도 26이라 모자랍니다."
      },
      {
        "kind": "choice",
        "q": "random.randint(1, 6) 이 돌려줄 수 있는 값은?",
        "options": [
          "1~5 중 하나",
          "1~6 중 하나",
          "0~6 중 하나",
          "1.0 이상 6.0 미만 소수"
        ],
        "answer": 1,
        "explain": "randint(a, b)는 a와 b를 모두 포함합니다. 끝 값을 빼는 것은 randrange(1, 6)입니다."
      },
      {
        "kind": "ox",
        "q": "items = random.shuffle(items) 처럼 쓰면 섞인 리스트가 items에 담긴다.",
        "answer": false,
        "explain": "shuffle은 원본을 제자리에서 섞고 None을 돌려줍니다. 이렇게 쓰면 items가 None이 됩니다. random.shuffle(items)만 쓰세요."
      },
      {
        "kind": "choice",
        "q": "경로를 'logs' + '/' + '20261107' 대신 os.path.join('logs', '20261107') 로 만드는 가장 큰 이유는?",
        "options": [
          "더 빨리 실행된다",
          "폴더를 자동으로 만들어 준다",
          "운영체제(Windows / Mac)에 맞는 구분 기호로 이어 준다",
          "파일이 있는지 확인해 준다"
        ],
        "answer": 2,
        "explain": "Windows는 \\, Mac · 리눅스는 /를 씁니다. join은 폴더를 만들거나 확인하지는 않습니다. 폴더 만들기는 os.makedirs, 확인은 os.path.exists입니다."
      }
    ]
  }
];
