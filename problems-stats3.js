// 통계 트랙 유닛 48(확률 기초) · 49(통계 해석 실수 피하기) 문제. scripts/build_stats3.py 로 생성.
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(N-Q)는 두 과정이 함께 쓴다.
export const ST3_UNITS = [
  {
    "id": 48,
    "title": "확률 기초",
    "summary": "교차표로 구하는 조건부확률, 베이즈 정리, 시뮬레이션으로 확률 확인",
    "note": "<h4>조건부확률은 분모를 바꾸는 계산</h4><p>P(A | B) = P(A 그리고 B) ÷ P(B). 교차표에서는 조건에 해당하는 <b>행(또는 열) 합계</b>를 분모로 씁니다. <code>pd.crosstab(df['행'], df['열'], normalize='index')</code>는 행마다 비율을 구해 줍니다.</p><h4>베이즈 정리</h4><p>P(원인 | 결과) = P(결과 | 원인) × P(원인) ÷ P(결과). 분모 P(결과)는 원인이 있을 때와 없을 때를 더해서 구합니다(전확률). 원인이 드물면(사전확률이 작으면) 검사가 정확해도 양성 중 진짜는 적을 수 있습니다.</p><h4>시뮬레이션</h4><p><code>rng = np.random.default_rng(시드)</code>, <code>rng.random(n) &lt; p</code>로 확률 p인 사건을 n번 흉내 냅니다. 많이 반복할수록 비율이 참 확률에 가까워집니다(큰 수의 법칙).</p>"
  },
  {
    "id": 49,
    "title": "통계 해석 실수 피하기",
    "summary": "심슨의 역설과 층별 비교, 교란변수 통제, 다중비교 보정",
    "note": "<h4>합친 결과와 나눈 결과가 다를 때</h4><p>그룹 구성이 다르면 전체 비율 비교가 뒤집힐 수 있습니다(심슨의 역설). 의심되는 변수로 나눠 <code>groupby([층, 그룹])</code>으로 비교하고, 같은 구성으로 맞춘 <b>표준화 비율</b>을 함께 봅니다.</p><h4>교란변수 걸러 내기</h4><p>X와 Y를 각각 교란변수 Z로 회귀한 뒤 남은 잔차끼리 상관을 구하면(편상관), Z의 영향을 뺀 X와 Y의 관계를 볼 수 있습니다.</p><h4>여러 번 검정하면</h4><p>검정 m개를 각각 α로 하면 하나라도 헛경보가 날 확률은 1 − (1 − α)<sup>m</sup>입니다. 본페로니 보정은 기준을 α ÷ m으로 낮춥니다.</p>"
  }
];
export const ST3_PROBLEMS = [
  {
    "id": "48-1",
    "unit": 48,
    "domain": "mfg",
    "title": "라인별 불량률: 교차표로 조건부확률 구하기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.crosstab(행, 열)",
        "두 범주의 교차표"
      ],
      [
        "P(A | B)",
        "B에 해당하는 것만 분모로"
      ],
      [
        "P(B | A)",
        "방향을 바꾸면 분모도 바뀜"
      ]
    ],
    "origin": "통계",
    "desc": "<p>A·B 두 라인에서 나온 제품 1,000개의 불량 여부입니다. 교차표를 만들고, 전체 불량률과 라인별 불량률, 그리고 불량품이 B라인에서 나왔을 확률을 구합니다.</p>\n<ol><li><code>table</code>: line(행) × defect(열) 교차표</li><li><code>p_def</code>: 전체 불량률 P(불량)</li><li><code>p_def_B</code>: B라인일 때 불량률 P(불량 | B)</li><li><code>p_B_def</code>: 불량품이 B라인 것일 확률 P(B | 불량)</li><li><code>ratio</code>: B라인 불량률 ÷ A라인 불량률</li></ol>",
    "starter": "import pandas as pd\n\ndf = pd.DataFrame({\n    'line': ['A'] * 400 + ['B'] * 600,\n    'defect': ['불량'] * 12 + ['양품'] * 388 + ['불량'] * 36 + ['양품'] * 564,\n})\n\n# 1. line(행) × defect(열) 교차표\ntable = \n# 2. 전체 불량률 P(불량)\np_def = \n# 3. B라인일 때 불량률 P(불량 | B)\np_def_B = \n# 4. 불량품이 B라인 것일 확률 P(B | 불량)\np_B_def = \n# 5. B라인 불량률 ÷ A라인 불량률\nratio = \n\nprint(table)\nprint(round(p_def, 3), round(p_def_B, 3), round(p_B_def, 3), round(ratio, 2))\n",
    "solution": "import pandas as pd\n\ndf = pd.DataFrame({\n    'line': ['A'] * 400 + ['B'] * 600,\n    'defect': ['불량'] * 12 + ['양품'] * 388 + ['불량'] * 36 + ['양품'] * 564,\n})\n\n# 1. line(행) × defect(열) 교차표\ntable = pd.crosstab(df['line'], df['defect'])\n# 2. 전체 불량률 P(불량)\np_def = (df['defect'] == '불량').mean()\n# 3. B라인일 때 불량률 P(불량 | B)\np_def_B = table.loc['B', '불량'] / table.loc['B'].sum()\n# 4. 불량품이 B라인 것일 확률 P(B | 불량)\np_B_def = table.loc['B', '불량'] / table['불량'].sum()\n# 5. B라인 불량률 ÷ A라인 불량률\nratio = p_def_B / (table.loc['A', '불량'] / table.loc['A'].sum())\n\nprint(table)\nprint(round(p_def, 3), round(p_def_B, 3), round(p_B_def, 3), round(ratio, 2))\n",
    "hints": [
      "pd.crosstab(df['line'], df['defect'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 line(행) × defect(열) 교차표",
        "expr": "int(table.loc['B', '불량']) == 36 and int(table.values.sum()) == 1000",
        "hint": "pd.crosstab(df['line'], df['defect'])"
      },
      {
        "label": "2단계 전체 불량률 P(불량)",
        "expr": "abs(p_def - 0.048) < 1e-6",
        "hint": "(df['defect'] == '불량').mean()"
      },
      {
        "label": "3단계 B라인일 때 불량률 P(불량 | B)",
        "expr": "abs(p_def_B - 0.06) < 1e-6",
        "hint": "table.loc['B', '불량'] / table.loc['B'].sum()"
      },
      {
        "label": "4단계 불량품이 B라인 것일 확률 P(B | 불량)",
        "expr": "abs(p_B_def - 0.75) < 1e-6",
        "hint": "table.loc['B', '불량'] / table['불량'].sum()"
      },
      {
        "label": "5단계 B라인 불량률 ÷ A라인 불량률",
        "expr": "abs(ratio - 2.0) < 1e-6",
        "hint": "p_def_B / (table.loc['A', '불량'] / table.loc['A'].sum())"
      }
    ]
  },
  {
    "id": "48-2",
    "unit": 48,
    "domain": "mfg",
    "title": "비전 검사기 알람을 믿어도 될까 (베이즈 정리)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "P(알람) = P(알람|불량)P(불량) + P(알람|양품)P(양품)",
        "전확률"
      ],
      [
        "P(불량|알람) = P(알람|불량)P(불량) ÷ P(알람)",
        "베이즈 정리"
      ]
    ],
    "origin": "통계",
    "desc": "<p>불량률은 2%입니다. 비전 검사기는 불량품의 95%에서 알람을 울리고(검출률), 양품에서도 3%는 잘못 알람을 울립니다. 알람이 울린 제품이 정말 불량일 확률을 구합니다.</p>\n<ol><li><code>p_alarm</code>: 알람이 울릴 확률 P(알람)</li><li><code>post</code>: 알람일 때 진짜 불량일 확률 P(불량 | 알람)</li><li><code>true_alarms</code>: 10,000개 중 진짜 불량에서 울린 알람 수</li><li><code>false_alarms</code>: 10,000개 중 양품에서 울린 알람 수</li><li><code>post2</code>: 독립인 두 번째 검사기도 알람을 울렸을 때 P(불량 | 알람 두 번)</li></ol>",
    "starter": "prior = 0.02    # P(불량)\nsens = 0.95     # P(알람 | 불량)\nfalse_alarm = 0.03   # P(알람 | 양품)\n\n# 1. 알람이 울릴 확률 P(알람)\np_alarm = \n# 2. 알람일 때 진짜 불량일 확률 P(불량 | 알람)\npost = \n# 3. 10,000개 중 진짜 불량에서 울린 알람 수\ntrue_alarms = \n# 4. 10,000개 중 양품에서 울린 알람 수\nfalse_alarms = \n# 5. 독립인 두 번째 검사기도 알람을 울렸을 때 P(불량 | 알람 두 번)\npost2 = \n\nprint(round(p_alarm, 4), round(post, 3), true_alarms, false_alarms, round(post2, 3))\n",
    "solution": "prior = 0.02    # P(불량)\nsens = 0.95     # P(알람 | 불량)\nfalse_alarm = 0.03   # P(알람 | 양품)\n\n# 1. 알람이 울릴 확률 P(알람)\np_alarm = sens * prior + false_alarm * (1 - prior)\n# 2. 알람일 때 진짜 불량일 확률 P(불량 | 알람)\npost = sens * prior / p_alarm\n# 3. 10,000개 중 진짜 불량에서 울린 알람 수\ntrue_alarms = round(10000 * prior * sens)\n# 4. 10,000개 중 양품에서 울린 알람 수\nfalse_alarms = round(10000 * (1 - prior) * false_alarm)\n# 5. 독립인 두 번째 검사기도 알람을 울렸을 때 P(불량 | 알람 두 번)\npost2 = sens * post / (sens * post + false_alarm * (1 - post))\n\nprint(round(p_alarm, 4), round(post, 3), true_alarms, false_alarms, round(post2, 3))\n",
    "hints": [
      "sens * prior + false_alarm * (1 - prior)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 알람이 울릴 확률 P(알람)",
        "expr": "abs(p_alarm - 0.0484) < 1e-6",
        "hint": "sens * prior + false_alarm * (1 - prior)"
      },
      {
        "label": "2단계 알람일 때 진짜 불량일 확률 P(불량 | 알람)",
        "expr": "abs(post - 0.3925619834710744) < 1e-6",
        "hint": "sens * prior / p_alarm"
      },
      {
        "label": "3단계 10,000개 중 진짜 불량에서 울린 알람 수",
        "expr": "true_alarms == 190",
        "hint": "round(10000 * prior * sens)"
      },
      {
        "label": "4단계 10,000개 중 양품에서 울린 알람 수",
        "expr": "false_alarms == 294",
        "hint": "round(10000 * (1 - prior) * false_alarm)"
      },
      {
        "label": "5단계 독립인 두 번째 검사기도 알람을 울렸을 때 P(불량 | 알람 두 번)",
        "expr": "abs(post2 - 0.9534122121276146) < 1e-6",
        "hint": "sens * post / (sens * post + false_alarm * (1 - post))"
      }
    ]
  },
  {
    "id": "48-3",
    "unit": 48,
    "domain": "general",
    "title": "운영체제별 구독률: 교차표로 조건부확률 구하기",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "pd.crosstab(행, 열)",
        "두 범주의 교차표"
      ],
      [
        "P(A | B)",
        "B에 해당하는 것만 분모로"
      ],
      [
        "향상도(lift) = P(A | B) ÷ P(A)",
        "조건이 확률을 몇 배로 바꾸나"
      ]
    ],
    "origin": "통계",
    "desc": "<p>앱 사용자 500명의 운영체제(<code>os</code>)와 유료 구독 여부(<code>sub</code>)입니다. 전체 구독률, iOS 사용자의 구독률, 구독자 중 iOS 비율을 구합니다.</p>\n<ol><li><code>table</code>: os(행) × sub(열) 교차표</li><li><code>p_sub</code>: 전체 구독률 P(구독)</li><li><code>p_sub_ios</code>: iOS일 때 구독률 P(구독 | iOS)</li><li><code>p_ios_sub</code>: 구독자가 iOS일 확률 P(iOS | 구독)</li><li><code>lift</code>: 향상도 P(구독 | iOS) ÷ P(구독)</li></ol>",
    "starter": "import pandas as pd\n\ndf = pd.DataFrame({\n    'os': ['iOS'] * 200 + ['Android'] * 300,\n    'sub': ['구독'] * 50 + ['무료'] * 150 + ['구독'] * 30 + ['무료'] * 270,\n})\n\n# 1. os(행) × sub(열) 교차표\ntable = \n# 2. 전체 구독률 P(구독)\np_sub = \n# 3. iOS일 때 구독률 P(구독 | iOS)\np_sub_ios = \n# 4. 구독자가 iOS일 확률 P(iOS | 구독)\np_ios_sub = \n# 5. 향상도 P(구독 | iOS) ÷ P(구독)\nlift = \n\nprint(table)\nprint(round(p_sub, 3), round(p_sub_ios, 3), round(p_ios_sub, 3), round(lift, 3))\n",
    "solution": "import pandas as pd\n\ndf = pd.DataFrame({\n    'os': ['iOS'] * 200 + ['Android'] * 300,\n    'sub': ['구독'] * 50 + ['무료'] * 150 + ['구독'] * 30 + ['무료'] * 270,\n})\n\n# 1. os(행) × sub(열) 교차표\ntable = pd.crosstab(df['os'], df['sub'])\n# 2. 전체 구독률 P(구독)\np_sub = (df['sub'] == '구독').mean()\n# 3. iOS일 때 구독률 P(구독 | iOS)\np_sub_ios = table.loc['iOS', '구독'] / table.loc['iOS'].sum()\n# 4. 구독자가 iOS일 확률 P(iOS | 구독)\np_ios_sub = table.loc['iOS', '구독'] / table['구독'].sum()\n# 5. 향상도 P(구독 | iOS) ÷ P(구독)\nlift = p_sub_ios / p_sub\n\nprint(table)\nprint(round(p_sub, 3), round(p_sub_ios, 3), round(p_ios_sub, 3), round(lift, 3))\n",
    "hints": [
      "pd.crosstab(df['os'], df['sub'])",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 os(행) × sub(열) 교차표",
        "expr": "int(table.loc['iOS', '구독']) == 50 and int(table.values.sum()) == 500",
        "hint": "pd.crosstab(df['os'], df['sub'])"
      },
      {
        "label": "2단계 전체 구독률 P(구독)",
        "expr": "abs(p_sub - 0.16) < 1e-6",
        "hint": "(df['sub'] == '구독').mean()"
      },
      {
        "label": "3단계 iOS일 때 구독률 P(구독 | iOS)",
        "expr": "abs(p_sub_ios - 0.25) < 1e-6",
        "hint": "table.loc['iOS', '구독'] / table.loc['iOS'].sum()"
      },
      {
        "label": "4단계 구독자가 iOS일 확률 P(iOS | 구독)",
        "expr": "abs(p_ios_sub - 0.625) < 1e-6",
        "hint": "table.loc['iOS', '구독'] / table['구독'].sum()"
      },
      {
        "label": "5단계 향상도 P(구독 | iOS) ÷ P(구독)",
        "expr": "abs(lift - 1.5625) < 1e-6",
        "hint": "p_sub_ios / p_sub"
      }
    ]
  },
  {
    "id": "48-4",
    "unit": 48,
    "domain": "general",
    "title": "'무료'가 들어간 메일은 스팸일까 (베이즈 + 시뮬레이션)",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "P(스팸|단어) = P(단어|스팸)P(스팸) ÷ P(단어)",
        "베이즈 정리"
      ],
      [
        "rng.random(n) < p",
        "확률 p인 사건을 n번 흉내"
      ],
      [
        "배열[조건].mean()",
        "조건에 맞는 것만 골라 비율"
      ]
    ],
    "origin": "통계",
    "desc": "<p>메일의 20%가 스팸입니다. '무료'라는 단어는 스팸의 40%, 정상 메일의 5%에 들어 있습니다. 베이즈 정리로 계산하고, 메일 100,000통을 시뮬레이션해서 같은 값이 나오는지 확인합니다.</p>\n<ol><li><code>p_word</code>: '무료'가 들어 있을 확률 P(단어)</li><li><code>post</code>: '무료'가 있을 때 스팸일 확률 P(스팸 | 단어)</li><li><code>spam</code>: 메일 100,000통의 스팸 여부 (True/False 배열)</li><li><code>word</code>: 각 메일에 '무료'가 있는지 (스팸이면 0.4, 아니면 0.05 확률)</li><li><code>sim_post</code>: 시뮬레이션으로 구한 P(스팸 | 단어)</li></ol>",
    "starter": "import numpy as np\n\nprior, p_word_spam, p_word_ham = 0.2, 0.4, 0.05\nrng = np.random.default_rng(0)\n\n# 1. '무료'가 들어 있을 확률 P(단어)\np_word = \n# 2. '무료'가 있을 때 스팸일 확률 P(스팸 | 단어)\npost = \n# 3. 메일 100,000통의 스팸 여부 (True/False 배열)\nspam = \n# 4. 각 메일에 '무료'가 있는지 (스팸이면 0.4, 아니면 0.05 확률)\nword = \n# 5. 시뮬레이션으로 구한 P(스팸 | 단어)\nsim_post = \n\nprint(round(p_word, 3), round(post, 3), round(float(sim_post), 3))\n",
    "solution": "import numpy as np\n\nprior, p_word_spam, p_word_ham = 0.2, 0.4, 0.05\nrng = np.random.default_rng(0)\n\n# 1. '무료'가 들어 있을 확률 P(단어)\np_word = p_word_spam * prior + p_word_ham * (1 - prior)\n# 2. '무료'가 있을 때 스팸일 확률 P(스팸 | 단어)\npost = p_word_spam * prior / p_word\n# 3. 메일 100,000통의 스팸 여부 (True/False 배열)\nspam = rng.random(100_000) < prior\n# 4. 각 메일에 '무료'가 있는지 (스팸이면 0.4, 아니면 0.05 확률)\nword = rng.random(100_000) < np.where(spam, p_word_spam, p_word_ham)\n# 5. 시뮬레이션으로 구한 P(스팸 | 단어)\nsim_post = spam[word].mean()\n\nprint(round(p_word, 3), round(post, 3), round(float(sim_post), 3))\n",
    "hints": [
      "p_word_spam * prior + p_word_ham * (1 - prior)",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 '무료'가 들어 있을 확률 P(단어)",
        "expr": "abs(p_word - 0.12000000000000002) < 1e-6",
        "hint": "p_word_spam * prior + p_word_ham * (1 - prior)"
      },
      {
        "label": "2단계 '무료'가 있을 때 스팸일 확률 P(스팸 | 단어)",
        "expr": "abs(post - 0.6666666666666666) < 1e-6",
        "hint": "p_word_spam * prior / p_word"
      },
      {
        "label": "3단계 메일 100,000통의 스팸 여부 (True/False 배열)",
        "expr": "len(spam) == 100000 and abs(spam.mean() - 0.2) < 0.01",
        "hint": "rng.random(100_000) < prior"
      },
      {
        "label": "4단계 각 메일에 '무료'가 있는지 (스팸이면 0.4, 아니면 0.05 확률)",
        "expr": "len(word) == 100000 and abs(word.mean() - 0.12) < 0.01",
        "hint": "rng.random(100_000) < np.where(spam, p_word_spam, p_word_ham)"
      },
      {
        "label": "5단계 시뮬레이션으로 구한 P(스팸 | 단어)",
        "expr": "abs(sim_post - 0.6666666666666666) < 0.02",
        "hint": "spam[word].mean()"
      }
    ]
  },
  {
    "id": "49-1",
    "unit": 49,
    "domain": "mfg",
    "title": "어느 라인이 더 나은가: 심슨의 역설",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "groupby(열)[값].mean()",
        "그룹별 비율"
      ],
      [
        "groupby([층, 그룹])[값].mean().unstack()",
        "층별로 나눈 비율 표"
      ],
      [
        "pd.crosstab(..., normalize='index')",
        "그룹별 구성비"
      ]
    ],
    "origin": "통계",
    "desc": "<p>A·B 라인에서 소형·대형 제품을 1,000개씩 만들었습니다(<code>defect</code> 1 = 불량). 전체 불량률로 보면 A가 낫지만, 크기별로 나눠 보면 결론이 바뀝니다. 그 이유를 숫자로 확인합니다.</p>\n<ol><li><code>overall</code>: 라인별 전체 불량률 Series</li><li><code>by_size</code>: 크기(행) × 라인(열) 불량률 표</li><li><code>mix</code>: 라인(행)별 크기 구성비 (행 합 = 1)</li><li><code>std_rate</code>: 소형·대형을 반반 만든다고 맞춘 라인별 표준화 불량률 Series</li><li><code>better</code>: 표준화 불량률이 더 낮은 라인 이름</li></ol>",
    "starter": "import pandas as pd\n\ndef make(line, size, n, bad):\n    return pd.DataFrame({'line': line, 'size': size, 'defect': [1] * bad + [0] * (n - bad)})\n\ndf = pd.concat([\n    make('A', '소형', 800, 24), make('A', '대형', 200, 24),\n    make('B', '소형', 200, 4), make('B', '대형', 800, 80),\n], ignore_index=True)\n\n# 1. 라인별 전체 불량률 Series\noverall = \n# 2. 크기(행) × 라인(열) 불량률 표\nby_size = \n# 3. 라인(행)별 크기 구성비 (행 합 = 1)\nmix = \n# 4. 소형·대형을 반반 만든다고 맞춘 라인별 표준화 불량률 Series\nstd_rate = \n# 5. 표준화 불량률이 더 낮은 라인 이름\nbetter = \n\nprint(overall.round(3).to_dict())\nprint(by_size.round(3))\nprint(mix.round(2))\nprint(std_rate.round(3).to_dict(), better)\n",
    "solution": "import pandas as pd\n\ndef make(line, size, n, bad):\n    return pd.DataFrame({'line': line, 'size': size, 'defect': [1] * bad + [0] * (n - bad)})\n\ndf = pd.concat([\n    make('A', '소형', 800, 24), make('A', '대형', 200, 24),\n    make('B', '소형', 200, 4), make('B', '대형', 800, 80),\n], ignore_index=True)\n\n# 1. 라인별 전체 불량률 Series\noverall = df.groupby('line')['defect'].mean()\n# 2. 크기(행) × 라인(열) 불량률 표\nby_size = df.groupby(['size', 'line'])['defect'].mean().unstack()\n# 3. 라인(행)별 크기 구성비 (행 합 = 1)\nmix = pd.crosstab(df['line'], df['size'], normalize='index')\n# 4. 소형·대형을 반반 만든다고 맞춘 라인별 표준화 불량률 Series\nstd_rate = by_size.mean()\n# 5. 표준화 불량률이 더 낮은 라인 이름\nbetter = std_rate.idxmin()\n\nprint(overall.round(3).to_dict())\nprint(by_size.round(3))\nprint(mix.round(2))\nprint(std_rate.round(3).to_dict(), better)\n",
    "hints": [
      "df.groupby('line')['defect'].mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 라인별 전체 불량률 Series",
        "expr": "abs(overall['A'] - 0.048) < 1e-9 and abs(overall['B'] - 0.084) < 1e-9",
        "hint": "df.groupby('line')['defect'].mean()"
      },
      {
        "label": "2단계 크기(행) × 라인(열) 불량률 표",
        "expr": "abs(by_size.loc['소형', 'B'] - 0.02) < 1e-9 and abs(by_size.loc['대형', 'A'] - 0.12) < 1e-9",
        "hint": "df.groupby(['size', 'line'])['defect'].mean().unstack()"
      },
      {
        "label": "3단계 라인(행)별 크기 구성비 (행 합 = 1)",
        "expr": "abs(mix.loc['A', '소형'] - 0.8) < 1e-9 and abs(mix.loc['B', '대형'] - 0.8) < 1e-9",
        "hint": "pd.crosstab(df['line'], df['size'], normalize='index')"
      },
      {
        "label": "4단계 소형·대형을 반반 만든다고 맞춘 라인별 표준화 불량률 Series",
        "expr": "abs(std_rate['A'] - 0.075) < 1e-9 and abs(std_rate['B'] - 0.06) < 1e-9",
        "hint": "by_size.mean()"
      },
      {
        "label": "5단계 표준화 불량률이 더 낮은 라인 이름",
        "expr": "better == 'B'",
        "hint": "std_rate.idxmin()"
      }
    ]
  },
  {
    "id": "49-2",
    "unit": 49,
    "domain": "mfg",
    "title": "개선 전후 결과를 보고 문장으로 만들기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "stats.ttest_ind(a, b, equal_var=False)",
        "Welch t검정"
      ],
      [
        "결과.confidence_interval(0.95)",
        "평균 차이의 95% 신뢰구간 (.low, .high)"
      ],
      [
        "Cohen's d = 차이 ÷ 합동 표준편차",
        "효과 크기"
      ]
    ],
    "origin": "통계",
    "desc": "<p>도금 두께 편차(μm)를 개선 전 12개 로트, 개선 후 12개 로트에서 쟀습니다. 보고에 필요한 네 가지(차이 · 신뢰구간 · p-value · 효과 크기)를 계산합니다.</p>\n<ol><li><code>diff</code>: 평균 차이 (개선 후 − 개선 전)</li><li><code>res</code>: Welch t검정 결과 (after, before 순서)</li><li><code>ci</code>: 평균 차이의 95% 신뢰구간</li><li><code>p</code>: p-value</li><li><code>d</code>: Cohen's d (차이 ÷ 두 그룹 표준편차(ddof=1)의 제곱평균 제곱근)</li></ol>",
    "starter": "import numpy as np\nfrom scipy import stats\n\nbefore = np.array([2.9, 3.4, 3.1, 2.7, 3.6, 3.2, 3.0, 3.5, 2.8, 3.3, 3.1, 3.4])\nafter = np.array([2.6, 2.9, 2.7, 3.0, 2.5, 2.8, 3.1, 2.6, 2.9, 2.7, 3.0, 2.8])\n\n# 1. 평균 차이 (개선 후 − 개선 전)\ndiff = \n# 2. Welch t검정 결과 (after, before 순서)\nres = \n# 3. 평균 차이의 95% 신뢰구간\nci = \n# 4. p-value\np = \n# 5. Cohen's d (차이 ÷ 두 그룹 표준편차(ddof=1)의 제곱평균 제곱근)\nd = \n\nprint(f'편차가 {diff:.2f}μm 바뀜 (95% CI {ci.low:.2f} ~ {ci.high:.2f}, p = {p:.4f}, d = {d:.2f})')\n",
    "solution": "import numpy as np\nfrom scipy import stats\n\nbefore = np.array([2.9, 3.4, 3.1, 2.7, 3.6, 3.2, 3.0, 3.5, 2.8, 3.3, 3.1, 3.4])\nafter = np.array([2.6, 2.9, 2.7, 3.0, 2.5, 2.8, 3.1, 2.6, 2.9, 2.7, 3.0, 2.8])\n\n# 1. 평균 차이 (개선 후 − 개선 전)\ndiff = after.mean() - before.mean()\n# 2. Welch t검정 결과 (after, before 순서)\nres = stats.ttest_ind(after, before, equal_var=False)\n# 3. 평균 차이의 95% 신뢰구간\nci = res.confidence_interval(0.95)\n# 4. p-value\np = float(res.pvalue)\n# 5. Cohen's d (차이 ÷ 두 그룹 표준편차(ddof=1)의 제곱평균 제곱근)\nd = diff / np.sqrt((before.std(ddof=1) ** 2 + after.std(ddof=1) ** 2) / 2)\n\nprint(f'편차가 {diff:.2f}μm 바뀜 (95% CI {ci.low:.2f} ~ {ci.high:.2f}, p = {p:.4f}, d = {d:.2f})')\n",
    "hints": [
      "after.mean() - before.mean()",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 평균 차이 (개선 후 − 개선 전)",
        "expr": "abs(diff - -0.36666666666666714) < 1e-6",
        "hint": "after.mean() - before.mean()"
      },
      {
        "label": "2단계 Welch t검정 결과 (after, before 순서)",
        "expr": "abs(res.pvalue - stats.ttest_ind(after, before, equal_var=False).pvalue) < 1e-12",
        "hint": "stats.ttest_ind(after, before, equal_var=False)"
      },
      {
        "label": "3단계 평균 차이의 95% 신뢰구간",
        "expr": "abs(ci.low - -0.5717223788987753) < 1e-6 and abs(ci.high - -0.16161095443455892) < 1e-6",
        "hint": "res.confidence_interval(0.95)"
      },
      {
        "label": "4단계 p-value",
        "expr": "abs(p - 0.0013811604972311204) < 1e-6",
        "hint": "float(res.pvalue)"
      },
      {
        "label": "5단계 Cohen's d (차이 ÷ 두 그룹 표준편차(ddof=1)의 제곱평균 제곱근)",
        "expr": "abs(d - -1.528099381355235) < 1e-6",
        "hint": "diff / np.sqrt((before.std(ddof=1) ** 2 + after.std(ddof=1) ** 2) / 2)"
      }
    ]
  },
  {
    "id": "49-3",
    "unit": 49,
    "domain": "general",
    "title": "아이스크림과 물놀이 사고: 기온의 영향 빼기",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "np.corrcoef(x, y)[0, 1]",
        "상관계수"
      ],
      [
        "np.polyfit(z, x, 1) / np.polyval",
        "z로 x를 예측하는 직선"
      ],
      [
        "잔차 = 실제 − 예측",
        "z로 설명되지 않고 남은 부분"
      ]
    ],
    "origin": "통계",
    "desc": "<p>어느 해 여름 60일의 기온(℃), 아이스크림 판매량, 물놀이 사고 건수입니다. 판매량과 사고는 강하게 함께 움직이지만, 기온의 영향을 빼면(편상관) 관계가 거의 사라지는 것과, 30℃ 이상만 골라내는 식으로 거칠게 나누면 기온 차이가 남아 상관도 남는 것을 확인합니다.</p>\n<ol><li><code>r_all</code>: 판매량 · 사고 상관계수</li><li><code>ice_res</code>: 기온으로 판매량을 예측하고 남은 잔차 배열</li><li><code>acc_res</code>: 기온으로 사고를 예측하고 남은 잔차 배열</li><li><code>r_partial</code>: 두 잔차끼리의 상관계수 (기온을 뺀 편상관)</li><li><code>r_hot</code>: 기온 30℃ 이상인 날만 골라 구한 판매량 · 사고 상관계수</li></ol>",
    "starter": "import numpy as np\n\nrng = np.random.default_rng(1)\ntemp = rng.uniform(22, 36, 60).round(1)\nice = (temp * 30 + rng.normal(0, 25, 60)).round()\nacc = (temp * 0.5 + rng.normal(0, 1.2, 60)).round(1)\n\n# 1. 판매량 · 사고 상관계수\nr_all = \n# 2. 기온으로 판매량을 예측하고 남은 잔차 배열\nice_res = \n# 3. 기온으로 사고를 예측하고 남은 잔차 배열\nacc_res = \n# 4. 두 잔차끼리의 상관계수 (기온을 뺀 편상관)\nr_partial = \n# 5. 기온 30℃ 이상인 날만 골라 구한 판매량 · 사고 상관계수\nr_hot = \n\nprint(round(r_all, 3), round(r_partial, 3), round(r_hot, 3))\n",
    "solution": "import numpy as np\n\nrng = np.random.default_rng(1)\ntemp = rng.uniform(22, 36, 60).round(1)\nice = (temp * 30 + rng.normal(0, 25, 60)).round()\nacc = (temp * 0.5 + rng.normal(0, 1.2, 60)).round(1)\n\n# 1. 판매량 · 사고 상관계수\nr_all = np.corrcoef(ice, acc)[0, 1]\n# 2. 기온으로 판매량을 예측하고 남은 잔차 배열\nice_res = ice - np.polyval(np.polyfit(temp, ice, 1), temp)\n# 3. 기온으로 사고를 예측하고 남은 잔차 배열\nacc_res = acc - np.polyval(np.polyfit(temp, acc, 1), temp)\n# 4. 두 잔차끼리의 상관계수 (기온을 뺀 편상관)\nr_partial = np.corrcoef(ice_res, acc_res)[0, 1]\n# 5. 기온 30℃ 이상인 날만 골라 구한 판매량 · 사고 상관계수\nr_hot = np.corrcoef(ice[temp >= 30], acc[temp >= 30])[0, 1]\n\nprint(round(r_all, 3), round(r_partial, 3), round(r_hot, 3))\n",
    "hints": [
      "np.corrcoef(ice, acc)[0, 1]",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 판매량 · 사고 상관계수",
        "expr": "abs(r_all - 0.8588274058472035) < 1e-6",
        "hint": "np.corrcoef(ice, acc)[0, 1]"
      },
      {
        "label": "2단계 기온으로 판매량을 예측하고 남은 잔차 배열",
        "expr": "len(ice_res) == 60 and abs(ice_res.mean()) < 1e-6",
        "hint": "ice - np.polyval(np.polyfit(temp, ice, 1), temp)"
      },
      {
        "label": "3단계 기온으로 사고를 예측하고 남은 잔차 배열",
        "expr": "len(acc_res) == 60 and abs(acc_res.mean()) < 1e-6",
        "hint": "acc - np.polyval(np.polyfit(temp, acc, 1), temp)"
      },
      {
        "label": "4단계 두 잔차끼리의 상관계수 (기온을 뺀 편상관)",
        "expr": "abs(r_partial - 0.002060276450361297) < 1e-6",
        "hint": "np.corrcoef(ice_res, acc_res)[0, 1]"
      },
      {
        "label": "5단계 기온 30℃ 이상인 날만 골라 구한 판매량 · 사고 상관계수",
        "expr": "abs(r_hot - 0.5720734298461475) < 1e-6",
        "hint": "np.corrcoef(ice[temp >= 30], acc[temp >= 30])[0, 1]"
      }
    ]
  },
  {
    "id": "49-4",
    "unit": 49,
    "domain": "general",
    "title": "지표 20개 중 '유의한' 것은 몇 개일까: 다중비교",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "(배열 < 기준).sum()",
        "기준보다 작은 개수"
      ],
      [
        "1 − (1 − α)^m",
        "하나라도 헛경보가 날 확률"
      ],
      [
        "α ÷ m",
        "본페로니 보정 기준"
      ]
    ],
    "origin": "통계",
    "desc": "<p>A/B 테스트에서 지표 20개를 각각 검정해 얻은 p-value입니다. 보정 없이 볼 때와 본페로니 보정을 했을 때 유의한 지표 수를 비교합니다.</p>\n<ol><li><code>n_sig</code>: 보정 없이 p < 0.05인 지표 수</li><li><code>fwer</code>: 효과가 전혀 없어도 20개 중 하나라도 유의하게 나올 확률</li><li><code>bonf</code>: 본페로니 보정 기준</li><li><code>n_sig_bonf</code>: 보정 후 유의한 지표 수</li><li><code>sig_names</code>: 보정 후에도 유의한 지표 이름 리스트</li></ol>",
    "starter": "import numpy as np\n\nnames = [f'지표{i:02d}' for i in range(1, 21)]\npvals = np.array([0.41, 0.032, 0.77, 0.0012, 0.25, 0.048, 0.66, 0.12, 0.91, 0.019,\n                  0.53, 0.35, 0.0021, 0.84, 0.072, 0.29, 0.61, 0.044, 0.18, 0.97])\nalpha = 0.05\n\n# 1. 보정 없이 p < 0.05인 지표 수\nn_sig = \n# 2. 효과가 전혀 없어도 20개 중 하나라도 유의하게 나올 확률\nfwer = \n# 3. 본페로니 보정 기준\nbonf = \n# 4. 보정 후 유의한 지표 수\nn_sig_bonf = \n# 5. 보정 후에도 유의한 지표 이름 리스트\nsig_names = \n\nprint(n_sig, round(fwer, 3), bonf, n_sig_bonf, sig_names)\n",
    "solution": "import numpy as np\n\nnames = [f'지표{i:02d}' for i in range(1, 21)]\npvals = np.array([0.41, 0.032, 0.77, 0.0012, 0.25, 0.048, 0.66, 0.12, 0.91, 0.019,\n                  0.53, 0.35, 0.0021, 0.84, 0.072, 0.29, 0.61, 0.044, 0.18, 0.97])\nalpha = 0.05\n\n# 1. 보정 없이 p < 0.05인 지표 수\nn_sig = int((pvals < alpha).sum())\n# 2. 효과가 전혀 없어도 20개 중 하나라도 유의하게 나올 확률\nfwer = 1 - (1 - alpha) ** len(pvals)\n# 3. 본페로니 보정 기준\nbonf = alpha / len(pvals)\n# 4. 보정 후 유의한 지표 수\nn_sig_bonf = int((pvals < bonf).sum())\n# 5. 보정 후에도 유의한 지표 이름 리스트\nsig_names = [n for n, p in zip(names, pvals) if p < bonf]\n\nprint(n_sig, round(fwer, 3), bonf, n_sig_bonf, sig_names)\n",
    "hints": [
      "int((pvals < alpha).sum())",
      "변수 이름은 그대로 두고 = 오른쪽만 채우세요. 위에서 만든 변수를 이어서 써도 됩니다."
    ],
    "checks": [
      {
        "label": "1단계 보정 없이 p < 0.05인 지표 수",
        "expr": "n_sig == 6",
        "hint": "int((pvals < alpha).sum())"
      },
      {
        "label": "2단계 효과가 전혀 없어도 20개 중 하나라도 유의하게 나올 확률",
        "expr": "abs(fwer - 0.6415140775914581) < 1e-6",
        "hint": "1 - (1 - alpha) ** len(pvals)"
      },
      {
        "label": "3단계 본페로니 보정 기준",
        "expr": "abs(bonf - 0.0025) < 1e-6",
        "hint": "alpha / len(pvals)"
      },
      {
        "label": "4단계 보정 후 유의한 지표 수",
        "expr": "n_sig_bonf == 2",
        "hint": "int((pvals < bonf).sum())"
      },
      {
        "label": "5단계 보정 후에도 유의한 지표 이름 리스트",
        "expr": "list(sig_names) == ['지표04', '지표13']",
        "hint": "[n for n, p in zip(names, pvals) if p < bonf]"
      }
    ]
  }
];
export const ST3_QUIZZES = [
  {
    "id": "48-Q",
    "unit": 48,
    "title": "확률 기초 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "교차표 t에서 '여성일 때 생존할 확률' P(생존 | 여성)을 소수 셋째 자리까지 출력하는 코드를 작성하세요.",
        "given": "import pandas as pd\nt = pd.DataFrame({'사망': [81, 468], '생존': [233, 109]}, index=['여성', '남성'])",
        "expect": [
          "0.742"
        ],
        "must": [
          "t\\.loc|t\\["
        ],
        "solution": "import pandas as pd\nt = pd.DataFrame({'사망': [81, 468], '생존': [233, 109]}, index=['여성', '남성'])\nprint(round(t.loc['여성', '생존'] / t.loc['여성'].sum(), 3))",
        "explain": "조건(여성)에 맞는 행의 합계 314가 분모입니다. 233 ÷ 314 = 0.742."
      },
      {
        "kind": "ox",
        "q": "P(A | B)와 P(B | A)는 항상 같다.",
        "answer": false,
        "explain": "분모가 다릅니다. P(양성 | 병)이 90%여도 P(병 | 양성)은 15%일 수 있습니다."
      },
      {
        "kind": "choice",
        "q": "유병률 1%, 검출률 90%, 위양성률 5%인 검사에서 양성이 나왔다. 진짜 병일 확률에 가장 가까운 것은?",
        "options": [
          "90%",
          "50%",
          "15%",
          "1%"
        ],
        "answer": 2,
        "explain": "0.9 × 0.01 ÷ (0.9 × 0.01 + 0.05 × 0.99) ≈ 0.154. 병 없는 사람이 워낙 많아 위양성이 진짜 양성보다 많습니다."
      },
      {
        "kind": "short",
        "q": "공정한 주사위를 한 번 던질 때 '짝수이면서 4 이상'일 확률은? (분수 또는 소수)",
        "answer": [
          "1/3",
          "0.333",
          ".333",
          "2/6"
        ],
        "explain": "짝수 {2, 4, 6}과 4 이상 {4, 5, 6}의 겹침은 {4, 6}, 2/6 = 1/3."
      },
      {
        "kind": "ox",
        "q": "동전을 5번 던져 모두 앞면이 나왔다면, 6번째는 뒷면이 나올 확률이 0.5보다 크다.",
        "answer": false,
        "explain": "각 던지기는 독립입니다. 큰 수의 법칙은 '많이 던지면 비율이 0.5에 가까워진다'는 뜻이지, 앞의 결과를 메워 준다는 뜻이 아닙니다."
      }
    ]
  },
  {
    "id": "49-Q",
    "unit": 49,
    "title": "통계 해석 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "write",
        "q": "지표 5개를 함께 판단할 때 본페로니 보정 기준(α = 0.05)을 출력하는 코드를 작성하세요.",
        "given": "alpha, m = 0.05, 5",
        "expect": [
          "0.01"
        ],
        "must": [
          "alpha"
        ],
        "solution": "alpha, m = 0.05, 5\nprint(alpha / m)",
        "explain": "본페로니 보정은 α를 검정 수로 나눕니다. 0.05 ÷ 5 = 0.01."
      },
      {
        "kind": "ox",
        "q": "두 변수의 상관계수가 0.9라면 한쪽이 다른 쪽의 원인이다.",
        "answer": false,
        "explain": "교란변수, 역인과, 우연 때문에도 강한 상관이 나올 수 있습니다."
      },
      {
        "kind": "choice",
        "q": "각 학과에서는 여학생 합격률이 더 높은데, 대학 전체로는 남학생 합격률이 더 높았다. 가장 그럴듯한 설명은?",
        "options": [
          "계산 실수",
          "여학생이 경쟁률 높은 학과에 더 많이 지원했다",
          "표본이 너무 크다",
          "p-value가 작다"
        ],
        "answer": 1,
        "explain": "그룹(학과) 구성이 달라 합친 비율이 뒤집히는 심슨의 역설입니다."
      },
      {
        "kind": "choice",
        "q": "결과를 보고할 때 p-value와 함께 꼭 적어야 할 것은?",
        "options": [
          "검정 통계량의 이름만",
          "차이의 크기와 신뢰구간",
          "사용한 파이썬 버전",
          "유의하지 않은 지표는 빼기"
        ],
        "answer": 1,
        "explain": "p-value는 '우연이 아니다'만 말합니다. 얼마나 다른지(효과 크기)와 얼마나 확실한지(신뢰구간)를 함께 적습니다."
      },
      {
        "kind": "short",
        "q": "효과가 전혀 없는 지표 10개를 각각 α = 0.05로 검정할 때, 하나라도 유의하게 나올 확률은? (소수 둘째 자리)",
        "answer": [
          "0.40",
          "0.4",
          ".40",
          ".4"
        ],
        "explain": "1 − 0.95¹⁰ ≈ 0.401."
      }
    ]
  }
];
