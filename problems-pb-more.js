// 파이썬 기초 추가 코스 문제 (유닛 21 컴프리헨션과 람다, 22 예외 처리). scratchpad build_pb.py 로 생성.
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.
export const PB_UNITS = [
  {
    "id": 21,
    "title": "컴프리헨션과 람다",
    "summary": "리스트 컴프리헨션, 조건부 컴프리헨션, lambda, sorted의 key",
    "note": "<h4>리스트 컴프리헨션</h4><p><code>[식 for 변수 in 반복 if 조건]</code>. 빈 리스트를 만들고 append 하는 for문을 한 줄로 줄인 것입니다.</p><h4>lambda와 key</h4><p><code>sorted(목록, key=lambda x: 기준)</code>은 각 원소에서 기준값을 뽑아 그 값으로 정렬합니다. 내림차순은 <code>reverse=True</code>, 기준이 여러 개면 튜플 <code>(기준1, 기준2)</code>.</p><p class=\"qc\">sorted는 새 리스트를 돌려주고, list.sort()는 원본을 바꾸고 None을 돌려줍니다.</p>"
  },
  {
    "id": 22,
    "title": "예외 처리",
    "summary": "try · except · else · finally, ValueError · ZeroDivisionError · KeyError",
    "note": "<h4>try / except</h4><p>에러가 날 수 있는 줄을 <code>try:</code> 안에 넣고, 에러가 나면 <code>except 에러이름:</code> 블록이 실행됩니다. 프로그램이 멈추지 않고 다음 줄로 넘어갑니다.</p><h4>자주 만나는 에러</h4><ul><li><code>ValueError</code>: <code>float('err')</code>처럼 변환할 수 없는 값</li><li><code>ZeroDivisionError</code>: 0으로 나누기</li><li><code>KeyError</code>: 딕셔너리에 없는 키</li></ul><p class=\"qc\">except: 처럼 에러 이름을 비워 두면 오타까지 숨겨집니다. 잡을 에러를 이름으로 적으세요.</p>"
  }
];

export const PB_PROBLEMS = [
  {
    "id": "21-1",
    "unit": 21,
    "domain": "mfg",
    "title": "규격 밖 측정값만 골라내기",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "리스트 컴프리헨션",
        "[v for v in values if 조건]"
      ],
      [
        "or",
        "하한 미만 또는 상한 초과"
      ]
    ],
    "origin": "컴프리헨션",
    "desc": "<p>두께 측정값 리스트 <code>values</code>와 규격 하한 <code>lo</code>, 상한 <code>hi</code>가 주어집니다. 규격을 벗어난(lo 미만 또는 hi 초과) 값만 <b>원래 순서대로</b> 리스트로 반환하세요.</p><p>for문과 append 대신 리스트 컴프리헨션 한 줄로 써 보세요.</p>",
    "starter": "def solution(values, lo, hi):\n    answer = []\n    return answer\n",
    "solution": "def solution(values, lo, hi):\n    return [v for v in values if v < lo or v > hi]\n",
    "hints": [
      "[v for v in values if ...] 의 if 자리에 규격 밖 조건을 쓰세요.",
      "규격 경계값(lo, hi와 같은 값)은 규격 안입니다."
    ],
    "tests": [
      {
        "args": [
          [
            10.1,
            9.7,
            10.4,
            9.9,
            10.6
          ],
          9.8,
          10.5
        ],
        "expected": [
          9.7,
          10.6
        ]
      },
      {
        "args": [
          [
            2.0,
            2.1,
            1.9
          ],
          1.8,
          2.2
        ],
        "expected": []
      },
      {
        "args": [
          [
            5.5,
            4.4,
            5.0,
            6.1,
            3.9,
            5.2
          ],
          4.5,
          6.0
        ],
        "expected": [
          4.4,
          6.1,
          3.9
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "21-2",
    "unit": 21,
    "domain": "mfg",
    "title": "가동률 높은 설비 순으로 정렬",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "sorted",
        "새 리스트로 정렬"
      ],
      [
        "lambda",
        "key=lambda x: x[1]"
      ],
      [
        "reverse=True",
        "내림차순"
      ],
      [
        "컴프리헨션",
        "이름만 뽑기"
      ]
    ],
    "origin": "lambda · key",
    "desc": "<p><code>machines</code>는 <code>(설비명, 가동률)</code> 튜플의 리스트입니다. 가동률이 <b>높은 순</b>으로 정렬한 뒤 설비명만 리스트로 반환하세요. 가동률이 같으면 원래 순서를 유지합니다.</p><pre>[(\"M1\", 82.5), (\"M2\", 91.0), (\"M3\", 77.3)] → [\"M2\", \"M1\", \"M3\"]</pre>",
    "starter": "def solution(machines):\n    answer = []\n    return answer\n",
    "solution": "def solution(machines):\n    ranked = sorted(machines, key=lambda m: m[1], reverse=True)\n    return [name for name, rate in ranked]\n",
    "hints": [
      "sorted(machines, key=lambda m: m[1], reverse=True)",
      "정렬된 튜플에서 이름만: [name for name, rate in ranked]"
    ],
    "tests": [
      {
        "args": [
          [
            [
              "M1",
              82.5
            ],
            [
              "M2",
              91.0
            ],
            [
              "M3",
              77.3
            ]
          ]
        ],
        "expected": [
          "M2",
          "M1",
          "M3"
        ]
      },
      {
        "args": [
          [
            [
              "A",
              50.0
            ],
            [
              "B",
              50.0
            ],
            [
              "C",
              60.0
            ]
          ]
        ],
        "expected": [
          "C",
          "A",
          "B"
        ]
      },
      {
        "args": [
          [
            [
              "P-01",
              99.1
            ],
            [
              "P-02",
              12.0
            ],
            [
              "P-03",
              88.8
            ],
            [
              "P-04",
              99.1
            ]
          ]
        ],
        "expected": [
          "P-01",
          "P-04",
          "P-03",
          "P-02"
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "21-3",
    "unit": 21,
    "domain": "general",
    "title": "5만 원 이상 주문에 할인 적용",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "리스트 컴프리헨션",
        "[식 for p in prices if 조건]"
      ],
      [
        "//",
        "정수 나눗셈"
      ]
    ],
    "origin": "컴프리헨션",
    "desc": "<p>주문 금액 리스트 <code>prices</code>에서 <b>50,000원 이상</b>인 주문만 골라 10% 할인한 금액을 원래 순서대로 반환하세요. 할인 금액은 <code>p * 9 // 10</code> 으로 계산해 정수로 만듭니다.</p>",
    "starter": "def solution(prices):\n    answer = []\n    return answer\n",
    "solution": "def solution(prices):\n    return [p * 9 // 10 for p in prices if p >= 50000]\n",
    "hints": [
      "컴프리헨션은 [바꾼 값 for p in prices if 고를 조건] 순서입니다.",
      "50000원 딱 맞는 주문도 포함됩니다 (>=)."
    ],
    "tests": [
      {
        "args": [
          [
            12000,
            50000,
            87000,
            49900
          ]
        ],
        "expected": [
          45000,
          78300
        ]
      },
      {
        "args": [
          [
            100000,
            200000
          ]
        ],
        "expected": [
          90000,
          180000
        ]
      },
      {
        "args": [
          [
            1000,
            2000
          ]
        ],
        "expected": [],
        "hidden": true
      }
    ]
  },
  {
    "id": "21-4",
    "unit": 21,
    "domain": "general",
    "title": "회원을 나이순, 같으면 이름순으로",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "sorted",
        "key 로 기준 지정"
      ],
      [
        "lambda",
        "튜플 기준 (나이, 이름)"
      ],
      [
        "컴프리헨션",
        "이름만 뽑기"
      ]
    ],
    "origin": "lambda · key",
    "desc": "<p><code>members</code>는 <code>{\"name\": 이름, \"age\": 나이}</code> 딕셔너리의 리스트입니다. 나이가 <b>적은 순</b>, 나이가 같으면 <b>이름 가나다순</b>으로 정렬한 이름 리스트를 반환하세요.</p>",
    "starter": "def solution(members):\n    answer = []\n    return answer\n",
    "solution": "def solution(members):\n    ranked = sorted(members, key=lambda m: (m[\"age\"], m[\"name\"]))\n    return [m[\"name\"] for m in ranked]\n",
    "hints": [
      "기준이 두 개면 key=lambda m: (m[\"age\"], m[\"name\"]) 처럼 튜플을 돌려주세요.",
      "정렬 뒤 [m[\"name\"] for m in ranked]"
    ],
    "tests": [
      {
        "args": [
          [
            {
              "name": "지민",
              "age": 31
            },
            {
              "name": "가영",
              "age": 27
            },
            {
              "name": "도윤",
              "age": 31
            }
          ]
        ],
        "expected": [
          "가영",
          "도윤",
          "지민"
        ]
      },
      {
        "args": [
          [
            {
              "name": "Zoe",
              "age": 20
            },
            {
              "name": "Amy",
              "age": 20
            }
          ]
        ],
        "expected": [
          "Amy",
          "Zoe"
        ]
      },
      {
        "args": [
          [
            {
              "name": "하늘",
              "age": 45
            },
            {
              "name": "나래",
              "age": 19
            },
            {
              "name": "다온",
              "age": 33
            },
            {
              "name": "가람",
              "age": 33
            }
          ]
        ],
        "expected": [
          "나래",
          "가람",
          "다온",
          "하늘"
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "22-1",
    "unit": 22,
    "domain": "mfg",
    "title": "깨진 센서 로그를 건너뛰고 평균 내기",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "try / except ValueError",
        "float() 변환 실패를 잡기"
      ],
      [
        "round",
        "소수 둘째 자리"
      ],
      [
        "None",
        "읽을 값이 없을 때"
      ]
    ],
    "origin": "예외 처리",
    "desc": "<p>온도 센서 로그 <code>logs</code>는 문자열 리스트인데, 통신 오류로 <code>\"err\"</code>나 빈 문자열이 섞여 있습니다. 숫자로 바꿀 수 있는 값만 평균을 내 <b>소수 둘째 자리로 반올림</b>해 반환하세요. 읽을 수 있는 값이 하나도 없으면 <code>None</code>을 반환합니다.</p><p><code>float(\"err\")</code>는 <code>ValueError</code>를 냅니다. if로 미리 걸러 내지 말고 try / except로 처리해 보세요.</p>",
    "starter": "def solution(logs):\n    answer = None\n    return answer\n",
    "solution": "def solution(logs):\n    vals = []\n    for s in logs:\n        try:\n            vals.append(float(s))\n        except ValueError:\n            pass\n    if not vals:\n        return None\n    return round(sum(vals) / len(vals), 2)\n",
    "hints": [
      "for s in logs: 안에서 try: vals.append(float(s)) / except ValueError: pass",
      "모은 값이 비어 있으면 return None"
    ],
    "tests": [
      {
        "args": [
          [
            "23.5",
            "err",
            "24.1",
            "",
            "23.9"
          ]
        ],
        "expected": 23.83
      },
      {
        "args": [
          [
            "err",
            "",
            "N/A"
          ]
        ],
        "expected": null
      },
      {
        "args": [
          [
            "-1.5",
            "2",
            "x",
            "3.25"
          ]
        ],
        "expected": 1.25,
        "hidden": true
      }
    ]
  },
  {
    "id": "22-2",
    "unit": 22,
    "domain": "mfg",
    "title": "투입 0인 라인의 수율 처리",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "try / except ZeroDivisionError",
        "0으로 나누기 잡기"
      ],
      [
        "round",
        "소수 첫째 자리"
      ]
    ],
    "origin": "예외 처리",
    "desc": "<p>라인별 양품 수 <code>good</code>와 투입 수 <code>total</code> 리스트가 주어집니다. 각 라인의 수율(%) <code>good / total * 100</code>을 <b>소수 첫째 자리로 반올림</b>한 리스트를 반환하세요. 투입이 0인 라인(가동하지 않은 라인)은 <code>0.0</code>으로 둡니다.</p>",
    "starter": "def solution(good, total):\n    answer = []\n    return answer\n",
    "solution": "def solution(good, total):\n    out = []\n    for g, t in zip(good, total):\n        try:\n            out.append(round(g / t * 100, 1))\n        except ZeroDivisionError:\n            out.append(0.0)\n    return out\n",
    "hints": [
      "zip(good, total)로 두 리스트를 나란히 돌 수 있습니다.",
      "except ZeroDivisionError: 에서 0.0을 넣으세요."
    ],
    "tests": [
      {
        "args": [
          [
            95,
            0,
            188
          ],
          [
            100,
            0,
            200
          ]
        ],
        "expected": [
          95.0,
          0.0,
          94.0
        ]
      },
      {
        "args": [
          [
            49,
            50
          ],
          [
            50,
            0
          ]
        ],
        "expected": [
          98.0,
          0.0
        ]
      },
      {
        "args": [
          [
            1,
            2,
            3
          ],
          [
            3,
            3,
            3
          ]
        ],
        "expected": [
          33.3,
          66.7,
          100.0
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "22-3",
    "unit": 22,
    "domain": "general",
    "title": "설문 나이 응답 정리",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "try / except ValueError",
        "int() 변환 실패 세기"
      ],
      [
        "리스트 반환",
        "[성공 목록, 실패 건수]"
      ]
    ],
    "origin": "예외 처리",
    "desc": "<p>설문 응답 <code>answers</code>는 나이를 적은 문자열 리스트입니다. <code>int()</code>로 바꿀 수 있는 응답은 정수 리스트로 모으고, 바꿀 수 없는 응답은 개수를 셉니다. <code>[정수 리스트, 실패 건수]</code>를 반환하세요.</p><pre>[\"29\", \"서른\", \"41\", \"\"] → [[29, 41], 2]</pre>",
    "starter": "def solution(answers):\n    ages = []\n    fail = 0\n    return [ages, fail]\n",
    "solution": "def solution(answers):\n    ages = []\n    fail = 0\n    for a in answers:\n        try:\n            ages.append(int(a))\n        except ValueError:\n            fail += 1\n    return [ages, fail]\n",
    "hints": [
      "try: ages.append(int(a))",
      "except ValueError: fail += 1"
    ],
    "tests": [
      {
        "args": [
          [
            "29",
            "서른",
            "41",
            ""
          ]
        ],
        "expected": [
          [
            29,
            41
          ],
          2
        ]
      },
      {
        "args": [
          [
            "20",
            "21"
          ]
        ],
        "expected": [
          [
            20,
            21
          ],
          0
        ]
      },
      {
        "args": [
          [
            "?",
            "33",
            "3.5",
            "52",
            "없음"
          ]
        ],
        "expected": [
          [
            33,
            52
          ],
          3
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "22-4",
    "unit": 22,
    "domain": "general",
    "title": "가격표에 없는 상품 건너뛰고 합계",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "try / except KeyError",
        "없는 키 잡기"
      ],
      [
        "딕셔너리",
        "prices[item]"
      ]
    ],
    "origin": "예외 처리",
    "desc": "<p>상품 가격표 <code>prices</code>(딕셔너리)와 장바구니 <code>items</code>(상품명 리스트)가 주어집니다. 가격표에 있는 상품의 가격 합계를 반환하세요. 가격표에 없는 상품은 <code>prices[item]</code>에서 <code>KeyError</code>가 나므로 그 상품만 건너뜁니다.</p>",
    "starter": "def solution(prices, items):\n    total = 0\n    return total\n",
    "solution": "def solution(prices, items):\n    total = 0\n    for item in items:\n        try:\n            total += prices[item]\n        except KeyError:\n            pass\n    return total\n",
    "hints": [
      "for item in items: 안에서 try: total += prices[item]",
      "except KeyError: pass 로 없는 상품을 건너뜁니다."
    ],
    "tests": [
      {
        "args": [
          {
            "사과": 1200,
            "우유": 2800,
            "빵": 3500
          },
          [
            "사과",
            "우유",
            "치즈",
            "사과"
          ]
        ],
        "expected": 5200
      },
      {
        "args": [
          {
            "A": 10
          },
          [
            "B",
            "C"
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          {
            "펜": 900,
            "노트": 2500
          },
          [
            "노트",
            "펜",
            "지우개",
            "노트"
          ]
        ],
        "expected": 5900,
        "hidden": true
      }
    ]
  },
  {
    "id": "21-5",
    "unit": 21,
    "domain": "mfg",
    "title": "측정값마다 판정 라벨 붙이기",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "조건식",
        "A if 조건 else B"
      ],
      [
        "리스트 컴프리헨션",
        "모든 값 변환"
      ]
    ],
    "origin": "조건식 컴프리헨션",
    "desc": "<p>측정값 리스트 <code>values</code>와 규격 하한 <code>lo</code>, 상한 <code>hi</code>가 주어집니다. 각 값에 판정 라벨을 붙인 리스트를 <b>원래 순서대로</b> 반환하세요.</p><ul><li><code>lo</code> 미만이면 <code>\"LOW\"</code></li><li><code>hi</code> 초과이면 <code>\"HIGH\"</code></li><li>그 밖(경계값 포함)은 <code>\"OK\"</code></li></ul><pre>[10.1, 9.2, 10.8], 9.5, 10.5 → [\"OK\", \"LOW\", \"HIGH\"]</pre><p>값을 거르지 않고 <b>모두 바꾸는</b> 문제입니다. 결과 길이는 입력과 같아야 합니다.</p>",
    "starter": "def solution(values, lo, hi):\n    answer = []\n    return answer\n",
    "solution": "def solution(values, lo, hi):\n    return [\"LOW\" if v < lo else \"HIGH\" if v > hi else \"OK\" for v in values]\n",
    "hints": [
      "조건식은 컴프리헨션 맨 앞(식 자리)에 둡니다: [라벨 for v in values]",
      "경우가 셋이면 \"LOW\" if v < lo else (\"HIGH\" if v > hi else \"OK\") 처럼 조건식을 이어 씁니다. 헷갈리면 for문으로 풀어도 됩니다."
    ],
    "tests": [
      {
        "args": [
          [
            10.1,
            9.2,
            10.8
          ],
          9.5,
          10.5
        ],
        "expected": [
          "OK",
          "LOW",
          "HIGH"
        ]
      },
      {
        "args": [
          [
            9.5,
            10.5,
            10
          ],
          9.5,
          10.5
        ],
        "expected": [
          "OK",
          "OK",
          "OK"
        ]
      },
      {
        "args": [
          [
            2.31,
            2.05,
            2.49,
            2.6,
            1.99
          ],
          2,
          2.5
        ],
        "expected": [
          "OK",
          "OK",
          "OK",
          "HIGH",
          "LOW"
        ],
        "hidden": true
      },
      {
        "args": [
          [],
          1,
          2
        ],
        "expected": [],
        "hidden": true
      }
    ]
  },
  {
    "id": "21-6",
    "unit": 21,
    "domain": "mfg",
    "title": "로트별 불량률 딕셔너리 만들기",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "딕셔너리 컴프리헨션",
        "{key: value for ...}"
      ],
      [
        "zip",
        "세 리스트 짝짓기"
      ],
      [
        "round",
        "소수 둘째 자리"
      ]
    ],
    "origin": "딕셔너리 컴프리헨션",
    "desc": "<p>같은 순서로 짝이 맞는 세 리스트 <code>lots</code>(로트 번호), <code>defects</code>(불량 수), <code>qty</code>(검사 수)가 주어집니다. <code>{로트: 불량률(%)}</code> 딕셔너리를 반환하세요.</p><ul><li>불량률(%) = 불량 수 / 검사 수 × 100, <code>round(값, 2)</code>로 소수 둘째 자리까지</li><li>검사 수가 0인 로트는 결과에서 <b>뺍니다</b></li></ul><pre>[\"A1\", \"A2\"], [18, 7], [1250, 0] → {\"A1\": 1.44}</pre>",
    "starter": "def solution(lots, defects, qty):\n    answer = {}\n    return answer\n",
    "solution": "def solution(lots, defects, qty):\n    return {lot: round(d / q * 100, 2) for lot, d, q in zip(lots, defects, qty) if q > 0}\n",
    "hints": [
      "zip(lots, defects, qty)로 세 값을 한 번에 꺼냅니다.",
      "검사 수가 0인 로트를 빼는 조건은 맨 뒤에 if q > 0 으로 붙입니다."
    ],
    "tests": [
      {
        "args": [
          [
            "A1",
            "A2"
          ],
          [
            18,
            7
          ],
          [
            1250,
            0
          ]
        ],
        "expected": {
          "A1": 1.44
        }
      },
      {
        "args": [
          [
            "A0915",
            "A0916",
            "A0917"
          ],
          [
            18,
            7,
            25
          ],
          [
            1250,
            980,
            1100
          ]
        ],
        "expected": {
          "A0915": 1.44,
          "A0916": 0.71,
          "A0917": 2.27
        }
      },
      {
        "args": [
          [
            "B1",
            "B2",
            "B3",
            "B4"
          ],
          [
            0,
            3,
            5,
            1
          ],
          [
            400,
            0,
            250,
            300
          ]
        ],
        "expected": {
          "B1": 0,
          "B3": 2,
          "B4": 0.33
        },
        "hidden": true
      }
    ]
  },
  {
    "id": "21-7",
    "unit": 21,
    "domain": "mfg",
    "title": "불량 많은 순, 같으면 로트 번호 순",
    "type": "function",
    "level": 3,
    "uses": [
      [
        "sorted",
        "key=lambda"
      ],
      [
        "튜플 key",
        "(기준1, 기준2)"
      ],
      [
        "마이너스",
        "숫자 기준만 내림차순"
      ]
    ],
    "origin": "lambda · 여러 기준 정렬",
    "desc": "<p><code>records</code>는 <code>[로트 번호, 불량 수]</code> 쌍의 리스트입니다. <b>불량 수가 많은 순</b>으로, 불량 수가 같으면 <b>로트 번호 오름차순</b>으로 정렬해 로트 번호만 리스트로 반환하세요.</p><pre>[[\"A3\", 7], [\"A1\", 25], [\"A2\", 7]] → [\"A1\", \"A2\", \"A3\"]</pre><p><code>reverse=True</code>만 쓰면 로트 번호까지 거꾸로 정렬되니 주의하세요.</p>",
    "starter": "def solution(records):\n    answer = []\n    return answer\n",
    "solution": "def solution(records):\n    ranked = sorted(records, key=lambda r: (-r[1], r[0]))\n    return [r[0] for r in ranked]\n",
    "hints": [
      "key가 튜플을 돌려주면 첫 값으로 비교하고, 같으면 둘째 값으로 비교합니다.",
      "숫자에 마이너스를 붙이면 그 기준만 내림차순이 됩니다: key=lambda r: (-r[1], r[0])"
    ],
    "tests": [
      {
        "args": [
          [
            [
              "A3",
              7
            ],
            [
              "A1",
              25
            ],
            [
              "A2",
              7
            ]
          ]
        ],
        "expected": [
          "A1",
          "A2",
          "A3"
        ]
      },
      {
        "args": [
          [
            [
              "L2-09",
              0
            ],
            [
              "L1-03",
              4
            ],
            [
              "L1-01",
              4
            ],
            [
              "L2-01",
              9
            ]
          ]
        ],
        "expected": [
          "L2-01",
          "L1-01",
          "L1-03",
          "L2-09"
        ]
      },
      {
        "args": [
          [
            [
              "C5",
              3
            ],
            [
              "C1",
              3
            ],
            [
              "C3",
              3
            ],
            [
              "C2",
              8
            ],
            [
              "C4",
              1
            ]
          ]
        ],
        "expected": [
          "C2",
          "C1",
          "C3",
          "C5",
          "C4"
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "22-5",
    "unit": 22,
    "domain": "mfg",
    "title": "표기가 섞인 생산 수량 합계",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "try / except",
        "변환 실패 잡기"
      ],
      [
        "replace · strip",
        "쉼표·공백 정리"
      ],
      [
        "리스트 반환",
        "[합계, 실패 수]"
      ]
    ],
    "origin": "예외 처리 · 데이터 정제",
    "desc": "<p>작업자가 입력한 생산 수량 문자열 리스트 <code>texts</code>가 주어집니다. <code>\"1,250\"</code>처럼 쉼표나 앞뒤 공백이 섞인 값은 정리해서 숫자로 바꾸고, <code>\"N/A\"</code>나 빈 문자열처럼 숫자로 바꿀 수 없는 값은 건너뜁니다.</p><p><code>[정수로 바꾼 값의 합계, 건너뛴 개수]</code>를 리스트로 반환하세요.</p><pre>[\"1,250\", \" 980 \", \"N/A\", \"\"] → [2230, 2]</pre>",
    "starter": "def solution(texts):\n    total = 0\n    failed = 0\n    return [total, failed]\n",
    "solution": "def solution(texts):\n    total = 0\n    failed = 0\n    for t in texts:\n        try:\n            total += int(t.replace(\",\", \"\").strip())\n        except ValueError:\n            failed += 1\n    return [total, failed]\n",
    "hints": [
      "t.replace(\",\", \"\").strip() 으로 쉼표와 공백을 지운 뒤 int()로 바꿉니다.",
      "try를 for 안에 두어야 한 값이 실패해도 다음 값으로 넘어갑니다. int('')와 int('N/A')는 ValueError입니다."
    ],
    "tests": [
      {
        "args": [
          [
            "1,250",
            " 980 ",
            "N/A",
            ""
          ]
        ],
        "expected": [
          2230,
          2
        ]
      },
      {
        "args": [
          [
            "100",
            "200",
            "300"
          ]
        ],
        "expected": [
          600,
          0
        ]
      },
      {
        "args": [
          [
            "12a",
            "1,000,000",
            " 5",
            "-",
            "3.5"
          ]
        ],
        "expected": [
          1000005,
          3
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "22-6",
    "unit": 22,
    "domain": "mfg",
    "title": "계산할 수 없는 검사 기록 찾기",
    "type": "function",
    "level": 3,
    "uses": [
      [
        "반복 안 try",
        "한 행씩 따로 처리"
      ],
      [
        "except (A, B, C)",
        "여러 에러 한 번에"
      ],
      [
        "실패 목록",
        "로트 번호 모으기"
      ]
    ],
    "origin": "예외 처리 · 실패 목록",
    "desc": "<p><code>rows</code>는 검사 기록 딕셔너리의 리스트입니다. 각 행은 <code>\"lot\"</code>과 문자열 <code>\"qty\"</code>, <code>\"defects\"</code>를 갖지만, 일부 행은 값이 숫자가 아니거나(<code>\"ERR\"</code>), 검사 수가 <code>\"0\"</code>이거나, <code>\"defects\"</code> 칸이 아예 없습니다.</p><p>불량률(<code>int(defects) / int(qty)</code>)을 <b>계산할 수 없는</b> 행의 로트 번호를 원래 순서대로 리스트로 반환하세요.</p><pre>[{\"lot\": \"A1\", \"qty\": \"100\", \"defects\": \"2\"},\n {\"lot\": \"A2\", \"qty\": \"0\", \"defects\": \"0\"}] → [\"A2\"]</pre>",
    "starter": "def solution(rows):\n    failed = []\n    return failed\n",
    "solution": "def solution(rows):\n    failed = []\n    for row in rows:\n        try:\n            int(row[\"defects\"]) / int(row[\"qty\"])\n        except (ValueError, ZeroDivisionError, KeyError):\n            failed.append(row[\"lot\"])\n    return failed\n",
    "hints": [
      "숫자 아님은 ValueError, 0으로 나누기는 ZeroDivisionError, 칸 없음은 KeyError입니다.",
      "except (ValueError, ZeroDivisionError, KeyError): 처럼 괄호로 묶어 한 번에 잡을 수 있습니다."
    ],
    "tests": [
      {
        "args": [
          [
            {
              "lot": "A1",
              "qty": "100",
              "defects": "2"
            },
            {
              "lot": "A2",
              "qty": "0",
              "defects": "0"
            }
          ]
        ],
        "expected": [
          "A2"
        ]
      },
      {
        "args": [
          [
            {
              "lot": "A0915",
              "qty": "1250",
              "defects": "18"
            },
            {
              "lot": "A0916",
              "qty": "980",
              "defects": "ERR"
            },
            {
              "lot": "A0919",
              "qty": "1310"
            },
            {
              "lot": "A0920",
              "qty": "1200",
              "defects": "9"
            }
          ]
        ],
        "expected": [
          "A0916",
          "A0919"
        ]
      },
      {
        "args": [
          [
            {
              "lot": "B1",
              "qty": "50",
              "defects": "1"
            },
            {
              "lot": "B2",
              "qty": "",
              "defects": "1"
            },
            {
              "lot": "B3",
              "qty": "0",
              "defects": "x"
            },
            {
              "lot": "B4",
              "defects": "3"
            }
          ]
        ],
        "expected": [
          "B2",
          "B3",
          "B4"
        ],
        "hidden": true
      }
    ]
  },
  {
    "id": "22-7",
    "unit": 22,
    "domain": "mfg",
    "title": "깨진 설정 파일이면 기본 규격으로 판정",
    "type": "function",
    "level": 3,
    "uses": [
      [
        "json.loads",
        "JSON 문자열 → 딕셔너리"
      ],
      [
        "except (ValueError, KeyError)",
        "깨진 JSON · 빠진 항목"
      ],
      [
        "기본값",
        "9.5 ~ 10.5"
      ]
    ],
    "origin": "예외 처리 · JSON",
    "desc": "<p>설비 설정 JSON 문자열 <code>config_text</code>와 측정값 리스트 <code>values</code>가 주어집니다. 설정은 보통 <code>{\"spec\": {\"low\": 9.5, \"high\": 10.5}}</code> 모양입니다.</p><p>설정에서 하한·상한을 읽어 <b>규격 밖</b>(하한 미만 또는 상한 초과) 값의 개수를 반환하세요. 다만 JSON이 깨져 있거나(<code>json.loads</code>가 ValueError) <code>spec</code>, <code>low</code>, <code>high</code> 중 하나라도 없으면(KeyError) <b>기본 규격 9.5 ~ 10.5</b>를 씁니다.</p><pre>'{\"spec\": {\"low\": 9.8, \"high\": 10.2}}', [10.1, 9.7, 10.3] → 2\n'{\"spec\": ', [10.1, 9.7, 10.3] → 0</pre>",
    "starter": "import json\n\ndef solution(config_text, values):\n    low, high = 9.5, 10.5\n    return 0\n",
    "solution": "import json\n\ndef solution(config_text, values):\n    try:\n        spec = json.loads(config_text)[\"spec\"]\n        low, high = spec[\"low\"], spec[\"high\"]\n    except (ValueError, KeyError):\n        low, high = 9.5, 10.5\n    return len([v for v in values if v < low or v > high])\n",
    "hints": [
      "json.loads가 깨진 문자열에서 내는 JSONDecodeError는 ValueError의 한 종류라 except ValueError로 잡힙니다.",
      "설정 읽기만 try 안에 두고, 실패하면 except에서 기본값을 담습니다. 개수 세기는 try 밖에서 합니다."
    ],
    "tests": [
      {
        "args": [
          "{\"spec\": {\"low\": 9.8, \"high\": 10.2}}",
          [
            10.1,
            9.7,
            10.3
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          "{\"spec\": ",
          [
            10.1,
            9.7,
            10.3
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          "{\"spec\": {\"low\": 9.8}}",
          [
            9.4,
            10.6,
            10
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          "{\"line\": \"L2\"}",
          [
            9.49,
            10.5,
            9.5,
            10.51
          ]
        ],
        "expected": 2,
        "hidden": true
      },
      {
        "args": [
          "{\"spec\": {\"low\": 2.0, \"high\": 2.5}}",
          [
            2.31,
            2.05,
            2.6,
            1.99,
            2.5
          ]
        ],
        "expected": 2,
        "hidden": true
      }
    ]
  }
];

export const PB_QUIZZES = [
  {
    "id": "21-Q",
    "unit": 21,
    "title": "컴프리헨션 · 람다 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "리스트 컴프리헨션으로 nums의 각 값을 제곱한 리스트를 출력하는 코드를 작성하세요.",
        "given": "nums = [1, 2, 3, 4]",
        "expect": "[1, 4, 9, 16]",
        "must": [
          "\\[.+\\bfor\\b.+\\bin\\b.+\\]"
        ],
        "solution": "nums = [1, 2, 3, 4]\nprint([n ** 2 for n in nums])",
        "explain": "[식 for 변수 in 반복] 은 각 원소에 식을 적용한 새 리스트입니다."
      },
      {
        "kind": "write",
        "q": "sorted와 lambda로 words를 글자 수가 짧은 순서대로 정렬해 출력하는 코드를 작성하세요.",
        "given": "words = ['banana', 'kiwi', 'apple']",
        "expect": "['kiwi', 'apple', 'banana']",
        "must": [
          "sorted\\(",
          "lambda"
        ],
        "solution": "words = ['banana', 'kiwi', 'apple']\nprint(sorted(words, key=lambda w: len(w)))",
        "explain": "key=lambda w: len(w) 는 각 단어의 길이를 기준으로 정렬합니다. key=len 으로 줄여 쓸 수도 있습니다."
      },
      {
        "kind": "choice",
        "q": "[x for x in range(5) if x % 2 == 0] 의 결과는?",
        "options": [
          "[0, 2, 4]",
          "[1, 3]",
          "[0, 1, 2, 3, 4]",
          "[2, 4]"
        ],
        "answer": 0,
        "explain": "0부터 4까지 중 짝수만 남습니다. 0도 짝수입니다."
      },
      {
        "kind": "ox",
        "q": "lambda x: x * 2 는 def로 만든 함수처럼 호출할 수 있는 이름 없는 함수다.",
        "answer": true,
        "explain": "lambda 인자: 식 은 한 줄짜리 이름 없는 함수입니다. 주로 sorted의 key 처럼 잠깐 쓰는 자리에 넣습니다."
      },
      {
        "kind": "ox",
        "q": "sorted(a, reverse=True)를 실행하면 a 자체가 내림차순으로 바뀐다.",
        "answer": false,
        "explain": "sorted는 정렬된 새 리스트를 돌려주고 a는 그대로입니다. 원본을 바꾸려면 a.sort(reverse=True)."
      }
    ]
  },
  {
    "id": "22-Q",
    "unit": 22,
    "title": "예외 처리 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "try / except로 int('abc')에서 나는 에러를 잡아 '숫자가 아닙니다'를 출력하는 코드를 작성하세요.",
        "expect": "숫자가 아닙니다",
        "must": [
          "\\btry\\s*:",
          "\\bexcept\\b"
        ],
        "solution": "try:\n    int('abc')\nexcept ValueError:\n    print('숫자가 아닙니다')",
        "explain": "int('abc')는 ValueError를 냅니다. except ValueError: 블록이 실행됩니다."
      },
      {
        "kind": "write",
        "q": "d에 없는 키 'C'를 읽을 때 나는 에러를 except로 잡아, 그 에러 이름을 출력하는 코드를 작성하세요. (힌트: except 에러이름 as e: 후 type(e).__name__)",
        "given": "d = {'A': 1, 'B': 2}",
        "expect": "KeyError",
        "must": [
          "\\btry\\s*:",
          "\\bexcept\\b"
        ],
        "solution": "d = {'A': 1, 'B': 2}\ntry:\n    d['C']\nexcept KeyError as e:\n    print(type(e).__name__)",
        "explain": "딕셔너리에 없는 키를 [ ]로 읽으면 KeyError입니다. 에러 없이 읽으려면 d.get('C')."
      },
      {
        "kind": "choice",
        "q": "10 / 0 을 실행하면 나는 에러는?",
        "options": [
          "ValueError",
          "ZeroDivisionError",
          "TypeError",
          "KeyError"
        ],
        "answer": 1,
        "explain": "0으로 나누면 ZeroDivisionError입니다."
      },
      {
        "kind": "ox",
        "q": "finally 블록은 try 안에서 에러가 났든 안 났든 항상 실행된다.",
        "answer": true,
        "explain": "finally는 파일 닫기처럼 반드시 해야 하는 정리 작업에 씁니다."
      },
      {
        "kind": "choice",
        "q": "try 블록에서 에러가 나지 않았을 때만 실행되는 블록은?",
        "options": [
          "except",
          "else",
          "finally",
          "raise"
        ],
        "answer": 1,
        "explain": "try → (에러 나면) except / (안 나면) else → finally 순서입니다."
      }
    ]
  }
];
