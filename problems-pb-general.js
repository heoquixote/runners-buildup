// 파이썬 기초 1~11회차의 데이터 과정(일반 소재) 문제. 회차마다 N-6, N-7. scratchpad build_gen.py 로 생성.
// QAQC 과정(mfg)에는 보이지 않고, 가입 코드 없이 들어온 데이터 과정 학생에게만 보인다.
export const GEN_PROBLEMS = [
  {
    "id": "1-6",
    "unit": 1,
    "title": "카페 하루 매출 정리",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "변수 = 값",
        "값에 이름 붙이기"
      ],
      [
        "+ , *",
        "덧셈과 곱셈"
      ],
      [
        "/",
        "나눗셈 (결과는 실수)"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>오늘 카페에서 아메리카노(4,500원)가 <code>n_ame</code>잔, 라테(5,000원)가 <code>n_lat</code>잔 팔렸습니다.</p>\n<ol><li><code>sales</code>: 총매출 (원)</li><li><code>cups</code>: 총 판매 잔 수</li><li><code>avg_price</code>: 한 잔 평균 가격 (원)</li></ol>",
    "starter": "price_ame = 4500\nprice_lat = 5000\nn_ame = 38\nn_lat = 21\n\n# 1. 총매출 (원)\nsales = \n# 2. 총 판매 잔 수\ncups = \n# 3. 한 잔 평균 가격 (원)\navg_price = \n\nprint(sales, cups, avg_price)\n",
    "solution": "price_ame = 4500\nprice_lat = 5000\nn_ame = 38\nn_lat = 21\n\n# 1. 총매출 (원)\nsales = price_ame * n_ame + price_lat * n_lat\n# 2. 총 판매 잔 수\ncups = n_ame + n_lat\n# 3. 한 잔 평균 가격 (원)\navg_price = sales / cups\n\nprint(sales, cups, avg_price)\n",
    "hints": [
      "가격 × 잔 수를 두 메뉴 모두 더합니다.",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 총매출 (원)",
        "expr": "sales == 276000",
        "hint": "가격 × 잔 수를 두 메뉴 모두 더합니다."
      },
      {
        "label": "2단계 총 판매 잔 수",
        "expr": "cups == 59",
        "hint": "n_ame + n_lat"
      },
      {
        "label": "3단계 한 잔 평균 가격 (원)",
        "expr": "abs(avg_price - 4677.966101694915) < 0.00468",
        "hint": "총매출 ÷ 총 잔 수"
      }
    ]
  },
  {
    "id": "1-7",
    "unit": 1,
    "title": "모임 회비 나누기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "//",
        "몫 (나머지는 버림)"
      ],
      [
        "%",
        "나머지"
      ],
      [
        "(a + b - 1) // b",
        "올림 나눗셈"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>모임 비용 <code>total</code>원을 <code>people</code>명이 나눠 냅니다.</p>\n<ol><li><code>per_person</code>: 1인당 낼 금액 (원 단위 아래 버림)</li><li><code>left</code>: 위처럼 걷으면 모자라는 금액</li><li><code>per_person_up</code>: 모자라지 않게 걷는 1인당 금액 (올림)</li></ol>",
    "starter": "total = 187000\npeople = 6\n\n# 1. 1인당 낼 금액 (원 단위 아래 버림)\nper_person = \n# 2. 위처럼 걷으면 모자라는 금액\nleft = \n# 3. 모자라지 않게 걷는 1인당 금액 (올림)\nper_person_up = \n\nprint(per_person, left, per_person_up)\n",
    "solution": "total = 187000\npeople = 6\n\n# 1. 1인당 낼 금액 (원 단위 아래 버림)\nper_person = total // people\n# 2. 위처럼 걷으면 모자라는 금액\nleft = total % people\n# 3. 모자라지 않게 걷는 1인당 금액 (올림)\nper_person_up = (total + people - 1) // people\n\nprint(per_person, left, per_person_up)\n",
    "hints": [
      "몫은 // 입니다.",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 1인당 낼 금액 (원 단위 아래 버림)",
        "expr": "per_person == 31166",
        "hint": "몫은 // 입니다."
      },
      {
        "label": "2단계 위처럼 걷으면 모자라는 금액",
        "expr": "left == 4",
        "hint": "나머지는 % 입니다."
      },
      {
        "label": "3단계 모자라지 않게 걷는 1인당 금액 (올림)",
        "expr": "per_person_up == 31167",
        "hint": "(total + people - 1) // people 은 올림 나눗셈입니다."
      }
    ]
  },
  {
    "id": "2-6",
    "unit": 2,
    "title": "날짜 문자열 쪼개기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "슬라이싱",
        "s[시작:끝]"
      ],
      [
        "음수 인덱스",
        "뒤에서부터"
      ],
      [
        "+ 연결",
        "문자열 이어 붙이기"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p><code>date</code>는 <code>'YYYY-MM-DD'</code> 형식의 문자열입니다.</p>\n<ol><li><code>year</code>: 연도 4자리</li><li><code>month</code>: 월 2자리</li><li><code>day</code>: 일 2자리 (음수 인덱스로)</li><li><code>compact</code>: &#x27;20261104&#x27; 처럼 붙인 문자열</li></ol>",
    "starter": "date = '2026-11-04'\n\n# 1. 연도 4자리\nyear = \n# 2. 월 2자리\nmonth = \n# 3. 일 2자리 (음수 인덱스로)\nday = \n# 4. '20261104' 처럼 붙인 문자열\ncompact = \n\nprint(year, month, day, compact)\n",
    "solution": "date = '2026-11-04'\n\n# 1. 연도 4자리\nyear = date[:4]\n# 2. 월 2자리\nmonth = date[5:7]\n# 3. 일 2자리 (음수 인덱스로)\nday = date[-2:]\n# 4. '20261104' 처럼 붙인 문자열\ncompact = year + month + day\n\nprint(year, month, day, compact)\n",
    "hints": [
      "앞 4글자: date[:4]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 연도 4자리",
        "expr": "year == '2026'",
        "hint": "앞 4글자: date[:4]"
      },
      {
        "label": "2단계 월 2자리",
        "expr": "month == '11'",
        "hint": "인덱스 5, 6번 글자입니다."
      },
      {
        "label": "3단계 일 2자리 (음수 인덱스로)",
        "expr": "day == '04'",
        "hint": "마지막 2글자: date[-2:]"
      },
      {
        "label": "4단계 '20261104' 처럼 붙인 문자열",
        "expr": "compact == '20261104'",
        "hint": "+ 로 이어 붙입니다."
      }
    ]
  },
  {
    "id": "2-7",
    "unit": 2,
    "title": "주문번호 가리기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "len()",
        "글자 수"
      ],
      [
        "int()",
        "문자열 → 정수"
      ],
      [
        "문자열 * 숫자",
        "같은 글자 반복"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>주문번호 <code>order</code>는 <code>'ORD' + 날짜 8자리 + '-' + 일련번호 4자리</code>입니다.</p>\n<ol><li><code>length</code>: 주문번호 글자 수</li><li><code>seq</code>: 일련번호를 정수로 (42)</li><li><code>masked</code>: 앞 3글자만 남기고 나머지를 *로 가린 문자열</li></ol>",
    "starter": "order = 'ORD20261104-0042'\n\n# 1. 주문번호 글자 수\nlength = \n# 2. 일련번호를 정수로 (42)\nseq = \n# 3. 앞 3글자만 남기고 나머지를 *로 가린 문자열\nmasked = \n\nprint(length, seq, masked)\n",
    "solution": "order = 'ORD20261104-0042'\n\n# 1. 주문번호 글자 수\nlength = len(order)\n# 2. 일련번호를 정수로 (42)\nseq = int(order[-4:])\n# 3. 앞 3글자만 남기고 나머지를 *로 가린 문자열\nmasked = order[:3] + '*' * (len(order) - 3)\n\nprint(length, seq, masked)\n",
    "hints": [
      "len(order)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 주문번호 글자 수",
        "expr": "length == 16",
        "hint": "len(order)"
      },
      {
        "label": "2단계 일련번호를 정수로 (42)",
        "expr": "seq == 42",
        "hint": "마지막 4글자를 int()로 바꾸면 앞의 0이 사라집니다."
      },
      {
        "label": "3단계 앞 3글자만 남기고 나머지를 *로 가린 문자열",
        "expr": "masked == 'ORD*************'",
        "hint": "'*' * 개수 로 반복합니다."
      }
    ]
  },
  {
    "id": "3-6",
    "unit": 3,
    "title": "회원 이메일 정리",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "strip()",
        "앞뒤 공백 제거"
      ],
      [
        "lower()",
        "소문자로"
      ],
      [
        "split('@')",
        "@ 기준으로 나누기"
      ],
      [
        "endswith()",
        "끝 글자 확인"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>회원 가입 폼에서 받은 이메일 <code>raw</code>에 공백과 대문자가 섞여 있습니다.</p>\n<ol><li><code>email</code>: 공백을 지우고 소문자로 바꾼 이메일</li><li><code>user_id</code>: @ 앞부분</li><li><code>domain</code>: @ 뒷부분</li><li><code>is_example</code>: example.com 주소인지 (True/False)</li></ol>",
    "starter": "raw = '  DataRunner@Example.COM '\n\n# 1. 공백을 지우고 소문자로 바꾼 이메일\nemail = \n# 2. @ 앞부분\nuser_id = \n# 3. @ 뒷부분\ndomain = \n# 4. example.com 주소인지 (True/False)\nis_example = \n\nprint(email, user_id, domain, is_example)\n",
    "solution": "raw = '  DataRunner@Example.COM '\n\n# 1. 공백을 지우고 소문자로 바꾼 이메일\nemail = raw.strip().lower()\n# 2. @ 앞부분\nuser_id = email.split('@')[0]\n# 3. @ 뒷부분\ndomain = email.split('@')[1]\n# 4. example.com 주소인지 (True/False)\nis_example = email.endswith('example.com')\n\nprint(email, user_id, domain, is_example)\n",
    "hints": [
      "메서드는 이어서 쓸 수 있습니다: raw.strip().lower()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 공백을 지우고 소문자로 바꾼 이메일",
        "expr": "email == 'datarunner@example.com'",
        "hint": "메서드는 이어서 쓸 수 있습니다: raw.strip().lower()"
      },
      {
        "label": "2단계 @ 앞부분",
        "expr": "user_id == 'datarunner'",
        "hint": "split('@')의 0번"
      },
      {
        "label": "3단계 @ 뒷부분",
        "expr": "domain == 'example.com'",
        "hint": "split('@')의 1번"
      },
      {
        "label": "4단계 example.com 주소인지 (True/False)",
        "expr": "is_example == True",
        "hint": "email.endswith('example.com')"
      }
    ]
  },
  {
    "id": "3-7",
    "unit": 3,
    "title": "해시태그 정리",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "replace()",
        "글자 바꾸기·지우기"
      ],
      [
        "split()",
        "공백 기준으로 나누기"
      ],
      [
        "', '.join()",
        "리스트를 한 문자열로"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>게시글의 해시태그 문자열 <code>text</code>를 정리합니다.</p>\n<ol><li><code>tags</code>: # 를 지우고 공백으로 나눈 리스트</li><li><code>tag_line</code>: tags를 &#x27;, &#x27; 로 이은 문자열</li><li><code>count</code>: 태그 개수</li><li><code>has_python</code>: &#x27;python&#x27; 태그가 있는지</li></ol>",
    "starter": "text = '#python #데이터분석 #pandas #시각화'\n\n# 1. # 를 지우고 공백으로 나눈 리스트\ntags = \n# 2. tags를 ', ' 로 이은 문자열\ntag_line = \n# 3. 태그 개수\ncount = \n# 4. 'python' 태그가 있는지\nhas_python = \n\nprint(tags, tag_line, count, has_python)\n",
    "solution": "text = '#python #데이터분석 #pandas #시각화'\n\n# 1. # 를 지우고 공백으로 나눈 리스트\ntags = text.replace('#', '').split()\n# 2. tags를 ', ' 로 이은 문자열\ntag_line = ', '.join(tags)\n# 3. 태그 개수\ncount = len(tags)\n# 4. 'python' 태그가 있는지\nhas_python = 'python' in tags\n\nprint(tags, tag_line, count, has_python)\n",
    "hints": [
      "replace('#', '') 후 split()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 # 를 지우고 공백으로 나눈 리스트",
        "expr": "tags == ['python', '데이터분석', 'pandas', '시각화']",
        "hint": "replace('#', '') 후 split()"
      },
      {
        "label": "2단계 tags를 ', ' 로 이은 문자열",
        "expr": "tag_line == 'python, 데이터분석, pandas, 시각화'",
        "hint": "', '.join(tags)"
      },
      {
        "label": "3단계 태그 개수",
        "expr": "count == 4",
        "hint": "len(tags)"
      },
      {
        "label": "4단계 'python' 태그가 있는지",
        "expr": "has_python == True",
        "hint": "'python' in tags"
      }
    ]
  },
  {
    "id": "4-6",
    "unit": 4,
    "title": "일주일 걸음 수 나누기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "인덱싱",
        "s[0], s[-1]"
      ],
      [
        "슬라이싱",
        "s[:5], s[5:]"
      ],
      [
        "len()",
        "원소 개수"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p><code>walk</code>는 월요일부터 일요일까지 하루 걸음 수입니다.</p>\n<ol><li><code>monday</code>: 월요일 걸음 수</li><li><code>sunday</code>: 일요일 걸음 수 (음수 인덱스)</li><li><code>weekday</code>: 월~금 리스트</li><li><code>weekend</code>: 토·일 리스트</li><li><code>days</code>: 기록된 날 수</li></ol>",
    "starter": "walk = [8200, 10450, 6300, 12000, 9100, 4300, 7700]\n\n# 1. 월요일 걸음 수\nmonday = \n# 2. 일요일 걸음 수 (음수 인덱스)\nsunday = \n# 3. 월~금 리스트\nweekday = \n# 4. 토·일 리스트\nweekend = \n# 5. 기록된 날 수\ndays = \n\nprint(monday, sunday, weekday, weekend, days)\n",
    "solution": "walk = [8200, 10450, 6300, 12000, 9100, 4300, 7700]\n\n# 1. 월요일 걸음 수\nmonday = walk[0]\n# 2. 일요일 걸음 수 (음수 인덱스)\nsunday = walk[-1]\n# 3. 월~금 리스트\nweekday = walk[:5]\n# 4. 토·일 리스트\nweekend = walk[5:]\n# 5. 기록된 날 수\ndays = len(walk)\n\nprint(monday, sunday, weekday, weekend, days)\n",
    "hints": [
      "첫 번째는 walk[0]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 월요일 걸음 수",
        "expr": "monday == 8200",
        "hint": "첫 번째는 walk[0]"
      },
      {
        "label": "2단계 일요일 걸음 수 (음수 인덱스)",
        "expr": "sunday == 7700",
        "hint": "walk[-1]"
      },
      {
        "label": "3단계 월~금 리스트",
        "expr": "weekday == [8200, 10450, 6300, 12000, 9100]",
        "hint": "walk[:5]"
      },
      {
        "label": "4단계 토·일 리스트",
        "expr": "weekend == [4300, 7700]",
        "hint": "walk[5:]"
      },
      {
        "label": "5단계 기록된 날 수",
        "expr": "days == 7",
        "hint": "len(walk)"
      }
    ]
  },
  {
    "id": "4-7",
    "unit": 4,
    "title": "장바구니 (중첩 리스트)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "중첩 인덱싱",
        "cart[행][열]"
      ],
      [
        "리스트 + 리스트",
        "이어 붙인 새 리스트"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p><code>cart</code>의 각 원소는 <code>[상품명, 가격, 수량]</code>입니다.</p>\n<ol><li><code>first_item</code>: 첫 상품의 이름</li><li><code>milk_price</code>: 우유 가격</li><li><code>bread_total</code>: 빵 금액 (가격 × 수량)</li><li><code>new_cart</code>: 치즈 [&#x27;치즈&#x27;, 4900, 1]을 더한 새 장바구니</li><li><code>item_count</code>: new_cart의 상품 종류 수</li></ol>",
    "starter": "cart = [['사과', 1200, 3], ['우유', 2800, 1], ['빵', 3500, 2]]\n\n# 1. 첫 상품의 이름\nfirst_item = \n# 2. 우유 가격\nmilk_price = \n# 3. 빵 금액 (가격 × 수량)\nbread_total = \n# 4. 치즈 ['치즈', 4900, 1]을 더한 새 장바구니\nnew_cart = \n# 5. new_cart의 상품 종류 수\nitem_count = \n\nprint(first_item, milk_price, bread_total, item_count)\n",
    "solution": "cart = [['사과', 1200, 3], ['우유', 2800, 1], ['빵', 3500, 2]]\n\n# 1. 첫 상품의 이름\nfirst_item = cart[0][0]\n# 2. 우유 가격\nmilk_price = cart[1][1]\n# 3. 빵 금액 (가격 × 수량)\nbread_total = cart[2][1] * cart[2][2]\n# 4. 치즈 ['치즈', 4900, 1]을 더한 새 장바구니\nnew_cart = cart + [['치즈', 4900, 1]]\n# 5. new_cart의 상품 종류 수\nitem_count = len(new_cart)\n\nprint(first_item, milk_price, bread_total, item_count)\n",
    "hints": [
      "cart[0]은 ['사과', 1200, 3], 그 0번",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 첫 상품의 이름",
        "expr": "first_item == '사과'",
        "hint": "cart[0]은 ['사과', 1200, 3], 그 0번"
      },
      {
        "label": "2단계 우유 가격",
        "expr": "milk_price == 2800",
        "hint": "cart[1][1]"
      },
      {
        "label": "3단계 빵 금액 (가격 × 수량)",
        "expr": "bread_total == 7000",
        "hint": "cart[2][1] * cart[2][2]"
      },
      {
        "label": "4단계 치즈 ['치즈', 4900, 1]을 더한 새 장바구니",
        "expr": "new_cart == [['사과', 1200, 3], ['우유', 2800, 1], ['빵', 3500, 2], ['치즈', 4900, 1]]",
        "hint": "리스트 + [새 원소] 로 붙입니다. 바깥 대괄호에 주의하세요."
      },
      {
        "label": "5단계 new_cart의 상품 종류 수",
        "expr": "item_count == 4",
        "hint": "len(new_cart)"
      }
    ]
  },
  {
    "id": "5-6",
    "unit": 5,
    "title": "시험 점수 정렬",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "sorted()",
        "정렬된 새 리스트"
      ],
      [
        "reverse=True",
        "내림차순"
      ],
      [
        "슬라이싱",
        "[:3] 앞 3개"
      ]
    ],
    "domain": "general",
    "origin": "sorted",
    "desc": "<p><code>scores</code>는 반 학생들의 시험 점수입니다. 원본 <code>scores</code>는 바꾸지 마세요.</p>\n<ol><li><code>asc</code>: 오름차순 정렬한 새 리스트</li><li><code>top3</code>: 높은 점수 3개 (높은 순)</li><li><code>lowest</code>: 가장 낮은 점수</li></ol>",
    "starter": "scores = [78, 92, 85, 64, 99, 71]\n\n# 1. 오름차순 정렬한 새 리스트\nasc = \n# 2. 높은 점수 3개 (높은 순)\ntop3 = \n# 3. 가장 낮은 점수\nlowest = \n\nprint(asc, top3, lowest)\n",
    "solution": "scores = [78, 92, 85, 64, 99, 71]\n\n# 1. 오름차순 정렬한 새 리스트\nasc = sorted(scores)\n# 2. 높은 점수 3개 (높은 순)\ntop3 = sorted(scores, reverse=True)[:3]\n# 3. 가장 낮은 점수\nlowest = sorted(scores)[0]\n\nprint(asc, top3, lowest)\n",
    "hints": [
      "sorted(scores)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 오름차순 정렬한 새 리스트",
        "expr": "asc == [64, 71, 78, 85, 92, 99]",
        "hint": "sorted(scores)"
      },
      {
        "label": "2단계 높은 점수 3개 (높은 순)",
        "expr": "top3 == [99, 92, 85]",
        "hint": "sorted(scores, reverse=True)[:3]"
      },
      {
        "label": "3단계 가장 낮은 점수",
        "expr": "lowest == 64",
        "hint": "정렬한 리스트의 0번, 또는 min(scores)"
      }
    ]
  },
  {
    "id": "5-7",
    "unit": 5,
    "title": "대기 순번 확인",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "인덱싱",
        "q[0], q[-1]"
      ],
      [
        "index()",
        "값의 위치"
      ],
      [
        "[::-1]",
        "거꾸로 뒤집기"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>맛집 대기 명단 <code>queue</code>입니다. 앞에 있을수록 먼저 온 손님입니다.</p>\n<ol><li><code>next_guest</code>: 다음에 들어갈 손님</li><li><code>last_guest</code>: 가장 늦게 온 손님</li><li><code>hajun_pos</code>: 하준의 대기 순번 (1부터 셈)</li><li><code>reversed_q</code>: 늦게 온 순서로 뒤집은 리스트</li></ol>",
    "starter": "queue = ['민수', '지영', '하준', '서연', '도윤']\n\n# 1. 다음에 들어갈 손님\nnext_guest = \n# 2. 가장 늦게 온 손님\nlast_guest = \n# 3. 하준의 대기 순번 (1부터 셈)\nhajun_pos = \n# 4. 늦게 온 순서로 뒤집은 리스트\nreversed_q = \n\nprint(next_guest, last_guest, hajun_pos, reversed_q)\n",
    "solution": "queue = ['민수', '지영', '하준', '서연', '도윤']\n\n# 1. 다음에 들어갈 손님\nnext_guest = queue[0]\n# 2. 가장 늦게 온 손님\nlast_guest = queue[-1]\n# 3. 하준의 대기 순번 (1부터 셈)\nhajun_pos = queue.index('하준') + 1\n# 4. 늦게 온 순서로 뒤집은 리스트\nreversed_q = queue[::-1]\n\nprint(next_guest, last_guest, hajun_pos, reversed_q)\n",
    "hints": [
      "queue[0]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 다음에 들어갈 손님",
        "expr": "next_guest == '민수'",
        "hint": "queue[0]"
      },
      {
        "label": "2단계 가장 늦게 온 손님",
        "expr": "last_guest == '도윤'",
        "hint": "queue[-1]"
      },
      {
        "label": "3단계 하준의 대기 순번 (1부터 셈)",
        "expr": "hajun_pos == 3",
        "hint": "index()는 0부터 셉니다. +1 하세요."
      },
      {
        "label": "4단계 늦게 온 순서로 뒤집은 리스트",
        "expr": "reversed_q == ['도윤', '서연', '하준', '지영', '민수']",
        "hint": "queue[::-1]"
      }
    ]
  },
  {
    "id": "6-6",
    "unit": 6,
    "title": "회원 정보 다루기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "d[키]",
        "값 꺼내기"
      ],
      [
        "get(키, 기본값)",
        "없는 키도 에러 없이"
      ],
      [
        "in",
        "키가 있는지"
      ],
      [
        "keys()",
        "키 목록"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>회원 한 명의 정보가 딕셔너리 <code>member</code>에 있습니다.</p>\n<ol><li><code>name</code>: 이름</li><li><code>keys</code>: 키 목록 (리스트로)</li><li><code>point</code>: 적립금 (없으면 0)</li><li><code>has_email</code>: email 키가 있는지</li></ol>",
    "starter": "member = {'name': '서연', 'age': 28, 'grade': 'silver'}\n\n# 1. 이름\nname = \n# 2. 키 목록 (리스트로)\nkeys = \n# 3. 적립금 (없으면 0)\npoint = \n# 4. email 키가 있는지\nhas_email = \n\nprint(name, keys, point, has_email)\n",
    "solution": "member = {'name': '서연', 'age': 28, 'grade': 'silver'}\n\n# 1. 이름\nname = member['name']\n# 2. 키 목록 (리스트로)\nkeys = list(member.keys())\n# 3. 적립금 (없으면 0)\npoint = member.get('point', 0)\n# 4. email 키가 있는지\nhas_email = 'email' in member\n\nprint(name, keys, point, has_email)\n",
    "hints": [
      "member['name']",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 이름",
        "expr": "name == '서연'",
        "hint": "member['name']"
      },
      {
        "label": "2단계 키 목록 (리스트로)",
        "expr": "keys == ['name', 'age', 'grade']",
        "hint": "list(member.keys())"
      },
      {
        "label": "3단계 적립금 (없으면 0)",
        "expr": "point == 0",
        "hint": "member.get('point', 0)"
      },
      {
        "label": "4단계 email 키가 있는지",
        "expr": "has_email == False",
        "hint": "'email' in member"
      }
    ]
  },
  {
    "id": "6-7",
    "unit": 6,
    "title": "이틀 연속 방문자 찾기 (Set)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "set()",
        "중복 제거"
      ],
      [
        "&",
        "교집합"
      ],
      [
        "-",
        "차집합"
      ],
      [
        "sorted()",
        "Set을 정렬된 리스트로"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p>월요일·화요일 웹사이트 방문 기록입니다. 같은 사람이 여러 번 들어오면 여러 번 기록됩니다.</p>\n<ol><li><code>mon_users</code>: 월요일 방문자 수 (중복 제외)</li><li><code>both</code>: 이틀 다 온 사람 (가나다순 리스트)</li><li><code>only_mon</code>: 월요일에만 온 사람 (가나다순 리스트)</li></ol>",
    "starter": "mon = ['kim', 'lee', 'kim', 'park', 'lee', 'choi']\ntue = ['park', 'jung', 'kim', 'jung']\n\n# 1. 월요일 방문자 수 (중복 제외)\nmon_users = \n# 2. 이틀 다 온 사람 (가나다순 리스트)\nboth = \n# 3. 월요일에만 온 사람 (가나다순 리스트)\nonly_mon = \n\nprint(mon_users, both, only_mon)\n",
    "solution": "mon = ['kim', 'lee', 'kim', 'park', 'lee', 'choi']\ntue = ['park', 'jung', 'kim', 'jung']\n\n# 1. 월요일 방문자 수 (중복 제외)\nmon_users = len(set(mon))\n# 2. 이틀 다 온 사람 (가나다순 리스트)\nboth = sorted(set(mon) & set(tue))\n# 3. 월요일에만 온 사람 (가나다순 리스트)\nonly_mon = sorted(set(mon) - set(tue))\n\nprint(mon_users, both, only_mon)\n",
    "hints": [
      "len(set(mon))",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 월요일 방문자 수 (중복 제외)",
        "expr": "mon_users == 4",
        "hint": "len(set(mon))"
      },
      {
        "label": "2단계 이틀 다 온 사람 (가나다순 리스트)",
        "expr": "both == ['kim', 'park']",
        "hint": "sorted(set(mon) & set(tue))"
      },
      {
        "label": "3단계 월요일에만 온 사람 (가나다순 리스트)",
        "expr": "only_mon == ['choi', 'lee']",
        "hint": "차집합은 - 입니다."
      }
    ]
  },
  {
    "id": "7-6",
    "unit": 7,
    "title": "놀이기구 탑승 안내",
    "type": "io",
    "level": 1,
    "uses": [
      [
        "int(input())",
        "키를 정수로 입력받기"
      ],
      [
        "if / elif / else",
        "세 가지로 나누기"
      ],
      [
        "비교 연산",
        ">=, <"
      ]
    ],
    "domain": "general",
    "origin": "조건문",
    "desc": "<p>키(cm)를 입력받아 안내 문구를 출력하세요.</p><ul><li>140 이상: <code>탑승 가능</code></li><li>120 이상 140 미만: <code>보호자 동반</code></li><li>120 미만: <code>탑승 불가</code></li></ul>",
    "starter": "height = int(input(\"키(cm): \"))\n# 조건에 맞는 안내 문구를 출력하세요\n",
    "solution": "height = int(input(\"키(cm): \"))\nif height >= 140:\n    print(\"탑승 가능\")\nelif height >= 120:\n    print(\"보호자 동반\")\nelse:\n    print(\"탑승 불가\")\n",
    "hints": [
      "큰 조건부터 차례로 검사하면 elif에서 아래쪽 범위만 남습니다.",
      "경계값 140, 120에서 어느 쪽인지 확인하세요."
    ],
    "tests": [
      {
        "stdin": "152",
        "expected": "탑승 가능"
      },
      {
        "stdin": "130",
        "expected": "보호자 동반"
      },
      {
        "stdin": "119",
        "expected": "탑승 불가",
        "hidden": true
      },
      {
        "stdin": "140",
        "expected": "탑승 가능",
        "hidden": true
      },
      {
        "stdin": "120",
        "expected": "보호자 동반",
        "hidden": true
      }
    ]
  },
  {
    "id": "7-7",
    "unit": 7,
    "title": "3의 배수 개수와 합계",
    "type": "io",
    "level": 2,
    "uses": [
      [
        "for i in range(1, n + 1)",
        "1부터 n까지"
      ],
      [
        "%",
        "i % 3 == 0 이면 3의 배수"
      ],
      [
        "누적 변수",
        "count += 1, total += i"
      ],
      [
        "f-string",
        "출력 형식 맞추기"
      ]
    ],
    "domain": "general",
    "origin": "반복문",
    "desc": "<p>자연수 <code>n</code>을 입력받아 1부터 n까지 중 <b>3의 배수</b>의 개수와 합계를 출력하세요.</p><p>출력 형식: <code>3의 배수 3개, 합계 18</code></p>",
    "starter": "n = int(input(\"n: \"))\ncount = 0\ntotal = 0\n# 반복문으로 count와 total을 구하고 형식에 맞게 출력하세요\n",
    "solution": "n = int(input(\"n: \"))\ncount = 0\ntotal = 0\nfor i in range(1, n + 1):\n    if i % 3 == 0:\n        count += 1\n        total += i\nprint(f\"3의 배수 {count}개, 합계 {total}\")\n",
    "hints": [
      "range(1, n + 1)은 1부터 n까지입니다.",
      "print(f\"3의 배수 {count}개, 합계 {total}\")"
    ],
    "tests": [
      {
        "stdin": "10",
        "expected": "3의 배수 3개, 합계 18"
      },
      {
        "stdin": "3",
        "expected": "3의 배수 1개, 합계 3"
      },
      {
        "stdin": "2",
        "expected": "3의 배수 0개, 합계 0",
        "hidden": true
      },
      {
        "stdin": "100",
        "expected": "3의 배수 33개, 합계 1683",
        "hidden": true
      }
    ]
  },
  {
    "id": "8-6",
    "unit": 8,
    "title": "이메일 아이디 가리기",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "split('@')",
        "아이디와 도메인 나누기"
      ],
      [
        "슬라이싱",
        "앞 2글자"
      ],
      [
        "'*' * n",
        "가릴 글자 수만큼"
      ]
    ],
    "domain": "general",
    "origin": "문자열 활용",
    "desc": "<p><code>solution(email)</code>은 이메일 아이디의 <b>앞 2글자만 남기고 나머지를 *</b>로 가린 이메일을 반환합니다. 도메인(@ 뒤)은 그대로 둡니다.</p><pre>'datarunner@example.com' → 'da********@example.com'</pre>",
    "starter": "def solution(email):\n    answer = ''\n    return answer\n",
    "solution": "def solution(email):\n    user, domain = email.split('@')\n    return user[:2] + '*' * (len(user) - 2) + '@' + domain\n",
    "hints": [
      "user, domain = email.split('@')",
      "user[:2] + '*' * (len(user) - 2)"
    ],
    "tests": [
      {
        "args": [
          "datarunner@example.com"
        ],
        "expected": "da********@example.com"
      },
      {
        "args": [
          "kim@mail.net"
        ],
        "expected": "ki*@mail.net"
      },
      {
        "args": [
          "ab@x.io"
        ],
        "expected": "ab@x.io",
        "hidden": true
      }
    ]
  },
  {
    "id": "8-7",
    "unit": 8,
    "title": "전화번호 형식 맞추기",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "replace()",
        "하이픈·공백 지우기"
      ],
      [
        "슬라이싱",
        "3-4-4 자리로 나누기"
      ],
      [
        "+ 연결",
        "'-' 넣기"
      ]
    ],
    "domain": "general",
    "origin": "문자열 활용",
    "desc": "<p>사용자가 입력한 휴대폰 번호 <code>phone</code>에는 하이픈이나 공백이 있을 수도, 없을 수도 있습니다. 숫자 11자리만 남긴 뒤 <code>'010-1234-5678'</code> 형식으로 반환하세요.</p>",
    "starter": "def solution(phone):\n    answer = ''\n    return answer\n",
    "solution": "def solution(phone):\n    d = phone.replace('-', '').replace(' ', '')\n    return d[:3] + '-' + d[3:7] + '-' + d[7:]\n",
    "hints": [
      "replace('-', '').replace(' ', '')로 숫자만 남깁니다.",
      "d[:3], d[3:7], d[7:]"
    ],
    "tests": [
      {
        "args": [
          "01012345678"
        ],
        "expected": "010-1234-5678"
      },
      {
        "args": [
          "010 9876 5432"
        ],
        "expected": "010-9876-5432"
      },
      {
        "args": [
          "010-1111-2222"
        ],
        "expected": "010-1111-2222",
        "hidden": true
      }
    ]
  },
  {
    "id": "9-6",
    "unit": 9,
    "title": "평균 이상인 학생 수",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "sum() / len()",
        "평균"
      ],
      [
        "for / if",
        "평균 이상 세기"
      ],
      [
        "return",
        "개수 돌려주기"
      ]
    ],
    "domain": "general",
    "origin": "알고리즘",
    "desc": "<p>점수 리스트 <code>scores</code>가 주어집니다. <b>평균 이상</b>인 점수의 개수를 반환하세요.</p>",
    "starter": "def solution(scores):\n    answer = 0\n    return answer\n",
    "solution": "def solution(scores):\n    avg = sum(scores) / len(scores)\n    return len([s for s in scores if s >= avg])\n",
    "hints": [
      "avg = sum(scores) / len(scores)",
      "평균과 같은 점수도 셉니다 (>=)."
    ],
    "tests": [
      {
        "args": [
          [
            70,
            80,
            90
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            50,
            50,
            50,
            50
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            100,
            0,
            0,
            0,
            10
          ]
        ],
        "expected": 1,
        "hidden": true
      }
    ]
  },
  {
    "id": "9-7",
    "unit": 9,
    "title": "가장 많이 검색된 단어",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "딕셔너리 집계",
        "counts[w] = counts.get(w, 0) + 1"
      ],
      [
        "최댓값 찾기",
        "가장 큰 횟수"
      ],
      [
        "동률 처리",
        "먼저 나온 단어"
      ]
    ],
    "domain": "general",
    "origin": "알고리즘",
    "desc": "<p>검색어 기록 <code>words</code>에서 <b>가장 많이 나온 검색어</b>를 반환하세요. 횟수가 같으면 기록에서 <b>먼저 나온</b> 검색어를 반환합니다.</p>",
    "starter": "def solution(words):\n    answer = ''\n    return answer\n",
    "solution": "def solution(words):\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    best = words[0]\n    for w in counts:\n        if counts[w] > counts[best]:\n            best = w\n    return best\n",
    "hints": [
      "counts[w] = counts.get(w, 0) + 1 로 횟수를 셉니다.",
      "딕셔너리는 처음 넣은 순서를 기억합니다. 더 클 때만(>) 바꾸면 먼저 나온 단어가 남습니다."
    ],
    "tests": [
      {
        "args": [
          [
            "파이썬",
            "판다스",
            "파이썬",
            "SQL"
          ]
        ],
        "expected": "파이썬"
      },
      {
        "args": [
          [
            "a",
            "b",
            "b",
            "a"
          ]
        ],
        "expected": "a"
      },
      {
        "args": [
          [
            "통계",
            "ML",
            "ML",
            "통계",
            "SQL",
            "ML"
          ]
        ],
        "expected": "ML",
        "hidden": true
      }
    ]
  },
  {
    "id": "10-6",
    "unit": 10,
    "title": "2주간 일별 방문자 분석",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "np.array",
        "배열 만들기"
      ],
      [
        "mean / max",
        "통계 메서드"
      ],
      [
        "argmax",
        "최댓값 위치"
      ],
      [
        "reshape(2, 7)",
        "1주씩 행으로"
      ],
      [
        "sum(axis=1)",
        "행별 합계"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p><code>visits</code>는 14일 동안의 일별 웹사이트 방문자 수입니다.</p>\n<ol><li><code>avg</code>: 하루 평균 방문자</li><li><code>best_day</code>: 방문자가 가장 많은 날이 며칠째인지 (1부터)</li><li><code>week_sums</code>: 1주차·2주차 합계 배열</li><li><code>growth</code>: 2주차가 1주차보다 몇 % 늘었는지</li></ol>",
    "starter": "import numpy as np\nvisits = np.array([320, 410, 385, 290, 505, 610, 580, 350, 430, 402, 315, 540, 655, 620])\n\n# 1. 하루 평균 방문자\navg = \n# 2. 방문자가 가장 많은 날이 며칠째인지 (1부터)\nbest_day = \n# 3. 1주차·2주차 합계 배열\nweek_sums = \n# 4. 2주차가 1주차보다 몇 % 늘었는지\ngrowth = \n\nprint(avg, best_day, week_sums, growth)\n",
    "solution": "import numpy as np\nvisits = np.array([320, 410, 385, 290, 505, 610, 580, 350, 430, 402, 315, 540, 655, 620])\n\n# 1. 하루 평균 방문자\navg = visits.mean()\n# 2. 방문자가 가장 많은 날이 며칠째인지 (1부터)\nbest_day = int(visits.argmax()) + 1\n# 3. 1주차·2주차 합계 배열\nweek_sums = visits.reshape(2, 7).sum(axis=1)\n# 4. 2주차가 1주차보다 몇 % 늘었는지\ngrowth = (week_sums[1] - week_sums[0]) / week_sums[0] * 100\n\nprint(avg, best_day, week_sums, growth)\n",
    "hints": [
      "visits.mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 하루 평균 방문자",
        "expr": "abs(avg - 458.0) < 0.000458",
        "hint": "visits.mean()"
      },
      {
        "label": "2단계 방문자가 가장 많은 날이 며칠째인지 (1부터)",
        "expr": "best_day == 13",
        "hint": "argmax()는 0부터 셉니다."
      },
      {
        "label": "3단계 1주차·2주차 합계 배열",
        "expr": "np.allclose(week_sums, [3100.0, 3312.0], atol=1e-4)",
        "hint": "reshape(2, 7)로 한 주를 한 행으로 만든 뒤 axis=1로 합칩니다."
      },
      {
        "label": "4단계 2주차가 1주차보다 몇 % 늘었는지",
        "expr": "abs(growth - 6.838709677419355) < 6.84e-06",
        "hint": "(2주차 − 1주차) ÷ 1주차 × 100"
      }
    ]
  },
  {
    "id": "10-7",
    "unit": 10,
    "title": "시험 점수 표준화",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "mean / std",
        "평균과 표준편차"
      ],
      [
        "벡터 연산",
        "배열 전체에 한 번에 계산"
      ],
      [
        "불리언 합계",
        "(조건).sum() 은 True 개수"
      ]
    ],
    "domain": "general",
    "origin": "일반 데이터",
    "desc": "<p><code>scores</code>는 반 학생 10명의 점수입니다. 표준편차는 <code>scores.std()</code>(모집단 기준)를 씁니다.</p>\n<ol><li><code>mean</code>: 평균</li><li><code>std</code>: 표준편차</li><li><code>z</code>: 각 점수의 z-점수 배열</li><li><code>above</code>: 평균보다 높은 학생 수</li></ol>",
    "starter": "import numpy as np\nscores = np.array([72, 85, 90, 64, 78, 95, 58, 81, 88, 69])\n\n# 1. 평균\nmean = \n# 2. 표준편차\nstd = \n# 3. 각 점수의 z-점수 배열\nz = \n# 4. 평균보다 높은 학생 수\nabove = \n\nprint(mean, std, z.round(2), above)\n",
    "solution": "import numpy as np\nscores = np.array([72, 85, 90, 64, 78, 95, 58, 81, 88, 69])\n\n# 1. 평균\nmean = scores.mean()\n# 2. 표준편차\nstd = scores.std()\n# 3. 각 점수의 z-점수 배열\nz = (scores - mean) / std\n# 4. 평균보다 높은 학생 수\nabove = int((scores > mean).sum())\n\nprint(mean, std, z.round(2), above)\n",
    "hints": [
      "scores.mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 숫자를 직접 쓰지 말고 위의 변수로 계산하세요."
    ],
    "checks": [
      {
        "label": "1단계 평균",
        "expr": "abs(mean - 78.0) < 7.8e-05",
        "hint": "scores.mean()"
      },
      {
        "label": "2단계 표준편차",
        "expr": "abs(std - 11.419281938896159) < 1.14e-05",
        "hint": "scores.std()"
      },
      {
        "label": "3단계 각 점수의 z-점수 배열",
        "expr": "np.allclose(z, [-0.525427, 0.612998, 1.050854, -1.225997, 0.0, 1.48871, -1.751424, 0.262714, 0.875712, -0.788141], atol=1e-4)",
        "hint": "(scores - mean) / std 는 배열 전체에 한 번에 계산됩니다."
      },
      {
        "label": "4단계 평균보다 높은 학생 수",
        "expr": "above == 5",
        "hint": "(scores > mean)은 True/False 배열이고, sum()은 True 개수입니다."
      }
    ]
  },
  {
    "id": "11-6",
    "unit": 11,
    "title": "주문 CSV 총매출",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "open(filename, encoding='utf-8')",
        "파일 열기"
      ],
      [
        "readlines()[1:]",
        "헤더 건너뛰기"
      ],
      [
        "split(',')",
        "칸 나누기"
      ],
      [
        "int()",
        "금액을 정수로"
      ]
    ],
    "domain": "general",
    "origin": "CSV 읽기",
    "files": {
      "orders.csv": "order_id,amount\nO-101,12000\nO-102,34500\nO-103,8000\n"
    },
    "desc": "<p>쇼핑몰 주문 파일 이름 <code>filename</code>이 주어집니다. 첫 줄은 헤더 <code>order_id,amount</code>입니다. <code>amount</code>의 합계를 정수로 반환하세요.</p><p>채점할 때는 행 수와 금액이 다른 파일도 들어옵니다.</p>",
    "starter": "def solution(filename):\n    answer = 0\n    return answer\n",
    "solution": "def solution(filename):\n    total = 0\n    with open(filename, encoding='utf-8') as f:\n        for line in f.readlines()[1:]:\n            line = line.strip()\n            if line:\n                total += int(line.split(',')[1])\n    return total\n",
    "hints": [
      "readlines()[1:]로 헤더를 건너뜁니다.",
      "line.strip().split(',')[1]을 int()로 바꿔 더합니다."
    ],
    "tests": [
      {
        "args": [
          "orders.csv"
        ],
        "expected": 54500
      },
      {
        "args": [
          "orders.csv"
        ],
        "expected": 3500,
        "files": {
          "orders.csv": "order_id,amount\nA,1000\nB,2500\n"
        }
      },
      {
        "args": [
          "orders.csv"
        ],
        "expected": 99000,
        "files": {
          "orders.csv": "order_id,amount\nX,99000\n"
        },
        "hidden": true
      }
    ]
  },
  {
    "id": "11-7",
    "unit": 11,
    "title": "회원 JSON에서 30대 이상 찾기",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "json.load(f)",
        "JSON → 딕셔너리"
      ],
      [
        "리스트 순회",
        "data['members']"
      ],
      [
        "조건 필터",
        "age >= 30"
      ]
    ],
    "domain": "general",
    "origin": "JSON 읽기",
    "files": {
      "members.json": "{\"members\": [{\"name\": \"서연\", \"age\": 28}, {\"name\": \"도윤\", \"age\": 34}, {\"name\": \"하준\", \"age\": 41}]}"
    },
    "desc": "<p>회원 정보 파일 이름 <code>filename</code>이 주어집니다. 파일은 <code>{\"members\": [{\"name\": ..., \"age\": ...}, ...]}</code> 형식의 JSON입니다. 나이가 <b>30 이상</b>인 회원의 이름을 파일 순서대로 리스트로 반환하세요.</p>",
    "starter": "import json\n\ndef solution(filename):\n    answer = []\n    return answer\n",
    "solution": "import json\n\ndef solution(filename):\n    with open(filename, encoding='utf-8') as f:\n        data = json.load(f)\n    return [m['name'] for m in data['members'] if m['age'] >= 30]\n",
    "hints": [
      "with open(filename, encoding='utf-8') as f: data = json.load(f)",
      "data['members']의 각 m에서 m['age'] >= 30 인 m['name']"
    ],
    "tests": [
      {
        "args": [
          "members.json"
        ],
        "expected": [
          "도윤",
          "하준"
        ]
      },
      {
        "args": [
          "members.json"
        ],
        "expected": [
          "A"
        ],
        "files": {
          "members.json": "{\"members\": [{\"name\": \"A\", \"age\": 30}, {\"name\": \"B\", \"age\": 29}]}"
        }
      },
      {
        "args": [
          "members.json"
        ],
        "expected": [],
        "files": {
          "members.json": "{\"members\": []}"
        },
        "hidden": true
      }
    ]
  }
];
