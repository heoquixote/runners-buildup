// 파이썬 기초 2026-11-10 보강 문제: 클래스와 객체(pb-14, 유닛 52) + 유닛 8(*args · **kwargs) · 유닛 50(Counter · defaultdict) 추가 문제.
// scratchpad build_oop.py 로 생성(모범답안을 실행해 함수형 기대값을 채움).
// domain: "mfg" = QAQC 과정(제조), "general" = 데이터 과정(일반). 개념 퀴즈(52-Q)는 두 과정이 함께 쓴다.
export const PBO_UNITS = [
  {
    "id": 52,
    "title": "클래스와 객체",
    "summary": "객체 · 속성 · 메서드, class · __init__ · self, 상태를 바꾸는 메서드, fit · predict",
    "note": "<h4>속성과 메서드</h4><p><code>made.year</code>처럼 괄호 없이 꺼내면 <b>속성</b>(가진 값), <code>made.weekday()</code>처럼 괄호를 붙이면 <b>메서드</b>(시키는 일)입니다. <code>sort()</code> · <code>append()</code>처럼 원본을 바꾸는 메서드는 <code>None</code>을 돌려줍니다.</p><h4>클래스 만들기</h4><pre>class Lot:\n    def __init__(self, lot_id, qty, defects):\n        self.lot_id = lot_id      # 만들 때 속성 채우기\n        self.qty = qty\n        self.defects = defects\n\n    def rate(self):               # 메서드: 첫 매개변수는 self\n        return round(self.defects / self.qty * 100, 2)\n\na = Lot('A0915', 1250, 18)\nprint(a.rate())                   # Lot.rate(a) 와 같다</pre><h4>fit과 predict</h4><p>모델 객체는 <code>fit</code>에서 배운 결과를 끝에 밑줄 붙은 속성(<code>mean_</code>, <code>coef_</code>)에 저장하고, <code>predict</code>에서 그 값을 꺼내 답합니다. <code>fit</code>이 <code>return self</code>를 하면 <code>Model().fit(X, y).predict(new_X)</code>처럼 이어 쓸 수 있습니다.</p><p class=\"qc\">메서드에 self를 빠뜨리면 TypeError(… takes 0 positional arguments but 1 was given), 속성 앞에 self.를 빠뜨리면 NameError가 납니다.</p>"
  }
];

export const PBO_PROBLEMS = [
  {
    "id": "52-1",
    "unit": 52,
    "domain": "mfg",
    "title": "온도 한계로 판정하는 설비 객체",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "class",
        "설계도 만들기"
      ],
      [
        "__init__(self, …)",
        "만들 때 속성 채우기"
      ],
      [
        "self.속성",
        "메서드 안에서 자기 값 쓰기"
      ],
      [
        "객체.메서드()",
        "객체에게 일 시키기"
      ]
    ],
    "origin": "클래스와 객체",
    "desc": "<p>설비마다 이름과 온도 상한이 다릅니다. 설비 객체가 스스로 측정 온도를 판정하게 만드세요.</p>\n<ol><li><code>Equipment</code> 클래스: <code>Equipment(name, limit)</code>로 만들면 속성 <code>name</code>, <code>limit</code>를 가진다</li><li>메서드 <code>check(temp)</code>: temp가 limit <b>초과</b>면 <code>'NG'</code>, 아니면 <code>'OK'</code>를 돌려준다</li><li><code>eq</code>: 이름 <code>'EQ-01'</code>, 상한 <code>25.0</code>인 설비 객체</li><li><code>results</code>: <code>eq.check</code>로 temps를 순서대로 판정한 리스트</li></ol>",
    "starter": "class Equipment:\n    # 1. __init__ 으로 name, limit 속성 저장\n    def __init__(self, name, limit):\n        pass\n\n    # 2. temp 가 limit 초과면 'NG', 아니면 'OK'\n    def check(self, temp):\n        return\n\ntemps = [24.1, 25.0, 25.6, 23.9]\n\n# 3. 이름 'EQ-01', 상한 25.0 인 설비 객체\neq = \n\n# 4. temps 를 순서대로 판정한 리스트\nresults = \n\nprint(eq.name, eq.limit)\nprint(results)\n",
    "solution": "class Equipment:\n    # 1. __init__ 으로 name, limit 속성 저장\n    def __init__(self, name, limit):\n        self.name = name\n        self.limit = limit\n\n    # 2. temp 가 limit 초과면 'NG', 아니면 'OK'\n    def check(self, temp):\n        return 'NG' if temp > self.limit else 'OK'\n\ntemps = [24.1, 25.0, 25.6, 23.9]\n\n# 3. 이름 'EQ-01', 상한 25.0 인 설비 객체\neq = Equipment('EQ-01', 25.0)\n\n# 4. temps 를 순서대로 판정한 리스트\nresults = [eq.check(t) for t in temps]\n\nprint(eq.name, eq.limit)\nprint(results)\n",
    "hints": [
      "__init__ 안에서 self.name = name, self.limit = limit 처럼 self. 를 붙여야 객체에 저장됩니다.",
      "check 안에서는 self.limit 으로 상한을 꺼냅니다. 25.0은 초과가 아니므로 'OK'입니다.",
      "eq = Equipment('EQ-01', 25.0), results = [eq.check(t) for t in temps]"
    ],
    "checks": [
      {
        "label": "1단계 name · limit 속성",
        "expr": "Equipment('X', 1.0).name == 'X' and Equipment('X', 1.0).limit == 1.0",
        "hint": "__init__ 안에서 self.name = name, self.limit = limit 로 저장하세요."
      },
      {
        "label": "2단계 check 메서드 (초과만 NG)",
        "expr": "Equipment('X', 10).check(10.5) == 'NG' and Equipment('X', 10).check(10) == 'OK' and Equipment('X', 10).check(9) == 'OK'",
        "hint": "temp > self.limit 이면 'NG', 아니면 'OK'를 return 하세요. 같으면 OK입니다."
      },
      {
        "label": "3단계 eq 객체",
        "expr": "isinstance(eq, Equipment) and eq.name == 'EQ-01' and eq.limit == 25.0",
        "hint": "eq = Equipment('EQ-01', 25.0)"
      },
      {
        "label": "4단계 results",
        "expr": "results == ['OK', 'OK', 'NG', 'OK']",
        "hint": "temps 의 값마다 eq.check(t) 를 순서대로 담으세요."
      }
    ]
  },
  {
    "id": "52-2",
    "unit": 52,
    "domain": "mfg",
    "title": "라인별 평균 두께로 예측하는 모델",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "fit(X, y)",
        "배운 결과를 속성에 저장"
      ],
      [
        "self.means_",
        "학습 결과 속성 (끝에 밑줄)"
      ],
      [
        "predict(X)",
        "저장한 값으로 답하기"
      ],
      [
        "dict.get(key, 기본값)",
        "처음 보는 라인은 전체 평균"
      ]
    ],
    "origin": "클래스와 객체 · fit/predict",
    "desc": "<p>도금 두께를 예측하는 아주 단순한 모델을 만듭니다. 학습 데이터는 생산 라인 <code>X</code>와 측정 두께 <code>y</code>입니다.</p>\n<ol><li><code>LineMeanModel</code> 클래스의 <code>fit(X, y)</code>: 라인별 평균 두께 딕셔너리를 <code>self.means_</code>에, 전체 평균을 <code>self.overall_</code>에 저장하고 <code>self</code>를 돌려준다</li><li><code>predict(X)</code>: X의 라인마다 그 라인 평균을 소수점 2자리로 반올림해 리스트로 돌려준다. 학습 때 없던 라인은 전체 평균(역시 2자리)</li><li><code>model</code>: X_train, y_train으로 학습한 모델</li><li><code>pred</code>: <code>['L2', 'L1', 'L3']</code>에 대한 예측</li></ol>",
    "starter": "class LineMeanModel:\n    def fit(self, X, y):\n        # 1. 라인별 평균(self.means_)과 전체 평균(self.overall_) 저장, self 반환\n        return self\n\n    def predict(self, X):\n        # 2. 라인 평균(없으면 전체 평균)을 소수점 2자리로\n        return []\n\nX_train = ['L1', 'L2', 'L1', 'L2', 'L1', 'L2']\ny_train = [12.1, 11.4, 12.5, 11.8, 12.3, 11.6]\n\n# 3. 학습한 모델\nmodel = \n\n# 4. ['L2', 'L1', 'L3'] 예측\npred = \n\nprint(model.means_, model.overall_)\nprint(pred)\n",
    "solution": "class LineMeanModel:\n    def fit(self, X, y):\n        # 1. 라인별 평균(self.means_)과 전체 평균(self.overall_) 저장, self 반환\n        groups = {}\n        for line, v in zip(X, y):\n            groups.setdefault(line, []).append(v)\n        self.means_ = {line: sum(vs) / len(vs) for line, vs in groups.items()}\n        self.overall_ = sum(y) / len(y)\n        return self\n\n    def predict(self, X):\n        # 2. 라인 평균(없으면 전체 평균)을 소수점 2자리로\n        return [round(self.means_.get(line, self.overall_), 2) for line in X]\n\nX_train = ['L1', 'L2', 'L1', 'L2', 'L1', 'L2']\ny_train = [12.1, 11.4, 12.5, 11.8, 12.3, 11.6]\n\n# 3. 학습한 모델\nmodel = LineMeanModel().fit(X_train, y_train)\n\n# 4. ['L2', 'L1', 'L3'] 예측\npred = model.predict(['L2', 'L1', 'L3'])\n\nprint(model.means_, model.overall_)\nprint(pred)\n",
    "hints": [
      "fit 안에서 라인별로 값을 모은 뒤(딕셔너리 + setdefault, 또는 defaultdict(list)) 평균을 self.means_ 에 담으세요.",
      "self.overall_ = sum(y) / len(y). fit 의 마지막 줄은 return self 입니다.",
      "predict 에서는 self.means_.get(line, self.overall_) 을 round(…, 2) 하세요.",
      "model = LineMeanModel().fit(X_train, y_train) 처럼 이어 쓸 수 있습니다."
    ],
    "checks": [
      {
        "label": "1단계 fit 이 means_ · overall_ 저장, self 반환",
        "expr": "(lambda m: m.fit(['a', 'a', 'b'], [1.0, 3.0, 5.0]) is m and m.means_ == {'a': 2.0, 'b': 5.0} and m.overall_ == 3.0)(LineMeanModel())",
        "hint": "라인별 평균 딕셔너리를 self.means_, 전체 평균을 self.overall_ 에 담고 return self."
      },
      {
        "label": "2단계 predict (없는 라인은 전체 평균)",
        "expr": "LineMeanModel().fit(['a', 'a', 'b'], [1.0, 2.0, 5.0]).predict(['b', 'a', 'z']) == [5.0, 1.5, 2.67]",
        "hint": "self.means_.get(line, self.overall_) 를 소수점 2자리로 반올림합니다."
      },
      {
        "label": "3단계 model 학습",
        "expr": "isinstance(model, LineMeanModel) and {k: round(v, 2) for k, v in model.means_.items()} == {'L1': 12.3, 'L2': 11.6}",
        "hint": "model = LineMeanModel().fit(X_train, y_train)"
      },
      {
        "label": "4단계 pred",
        "expr": "pred == [11.6, 12.3, 11.95]",
        "hint": "model.predict(['L2', 'L1', 'L3']). L3은 학습 때 없던 라인이라 전체 평균입니다."
      }
    ]
  },
  {
    "id": "52-3",
    "unit": 52,
    "domain": "general",
    "title": "담을수록 쌓이는 장바구니 객체",
    "type": "steps",
    "level": 1,
    "uses": [
      [
        "__init__",
        "빈 장바구니로 시작"
      ],
      [
        "self.items.append",
        "상태 바꾸기"
      ],
      [
        "메서드 안 for",
        "자기 속성으로 계산"
      ],
      [
        "객체.메서드()",
        "객체에게 일 시키기"
      ]
    ],
    "origin": "클래스와 객체",
    "desc": "<p>온라인 쇼핑몰 장바구니를 객체로 만듭니다. 장바구니는 담은 상품을 기억하고, 합계를 스스로 계산합니다.</p>\n<ol><li><code>Cart</code> 클래스: <code>Cart()</code>로 만들면 속성 <code>items</code>가 빈 리스트</li><li>메서드 <code>add(name, price, count)</code>: <code>(name, price, count)</code> 튜플을 items에 추가</li><li>메서드 <code>total()</code>: 모든 상품의 가격 × 수량 합계를 돌려준다</li><li><code>cart</code>: 새 장바구니에 <code>('노트', 1500, 3)</code>, <code>('펜', 1200, 2)</code>, <code>('파일', 800, 5)</code>를 차례로 담은 것. <code>amount</code>: 그 합계</li></ol>",
    "starter": "class Cart:\n    def __init__(self):\n        # 1. 빈 items 리스트\n        pass\n\n    def add(self, name, price, count):\n        # 2. (name, price, count) 를 items 에 추가\n        pass\n\n    def total(self):\n        # 3. 가격 × 수량 합계\n        return 0\n\n# 4. 장바구니 만들고 세 상품 담기\ncart = \n\namount = \nprint(cart.items)\nprint(amount)\n",
    "solution": "class Cart:\n    def __init__(self):\n        # 1. 빈 items 리스트\n        self.items = []\n\n    def add(self, name, price, count):\n        # 2. (name, price, count) 를 items 에 추가\n        self.items.append((name, price, count))\n\n    def total(self):\n        # 3. 가격 × 수량 합계\n        return sum(price * count for name, price, count in self.items)\n\n# 4. 장바구니 만들고 세 상품 담기\ncart = Cart()\ncart.add('노트', 1500, 3)\ncart.add('펜', 1200, 2)\ncart.add('파일', 800, 5)\n\namount = cart.total()\nprint(cart.items)\nprint(amount)\n",
    "hints": [
      "__init__ 에서 self.items = [] 로 시작합니다.",
      "add 안에서 self.items.append((name, price, count)). 튜플이라 괄호가 두 겹입니다.",
      "total 은 self.items 를 돌며 price * count 를 더합니다.",
      "cart = Cart() 다음 줄부터 cart.add(...) 를 세 번 부르세요."
    ],
    "checks": [
      {
        "label": "1단계 빈 items",
        "expr": "Cart().items == []",
        "hint": "__init__ 안에서 self.items = []"
      },
      {
        "label": "2단계 add 가 튜플 추가",
        "expr": "(lambda c: (c.add('a', 100, 2), c.items)[1] == [('a', 100, 2)])(Cart())",
        "hint": "self.items.append((name, price, count))"
      },
      {
        "label": "3단계 total",
        "expr": "(lambda c: (c.add('a', 100, 2), c.add('b', 50, 3), c.total())[2] == 350)(Cart())",
        "hint": "items 의 price * count 를 모두 더해 return 하세요."
      },
      {
        "label": "4단계 cart · amount",
        "expr": "isinstance(cart, Cart) and len(cart.items) == 3 and amount == 10900",
        "hint": "Cart() 를 만들고 add 를 세 번 부른 뒤 amount = cart.total()"
      }
    ]
  },
  {
    "id": "52-4",
    "unit": 52,
    "domain": "general",
    "title": "카테고리 평균으로 가격을 예측하는 모델",
    "type": "steps",
    "level": 2,
    "uses": [
      [
        "fit(X, y)",
        "배운 결과를 속성에 저장"
      ],
      [
        "self.means_",
        "학습 결과 속성 (끝에 밑줄)"
      ],
      [
        "predict(X)",
        "저장한 값으로 답하기"
      ],
      [
        "dict.get(key, 기본값)",
        "처음 보는 카테고리는 전체 평균"
      ]
    ],
    "origin": "클래스와 객체 · fit/predict",
    "desc": "<p>중고 거래 앱에서 새 물건의 적정 가격을 추천하는 아주 단순한 모델을 만듭니다. 학습 데이터는 카테고리 <code>X</code>와 거래 가격 <code>y</code>(원)입니다.</p>\n<ol><li><code>CategoryMeanModel</code> 클래스의 <code>fit(X, y)</code>: 카테고리별 평균 가격 딕셔너리를 <code>self.means_</code>에, 전체 평균을 <code>self.overall_</code>에 저장하고 <code>self</code>를 돌려준다</li><li><code>predict(X)</code>: X의 카테고리마다 평균 가격을 <b>정수(원 단위 반올림, round)</b>로 돌려준다. 학습 때 없던 카테고리는 전체 평균</li><li><code>model</code>: X_train, y_train으로 학습한 모델</li><li><code>pred</code>: <code>['book', 'shoes', 'phone']</code>에 대한 예측</li></ol>",
    "starter": "class CategoryMeanModel:\n    def fit(self, X, y):\n        # 1. 카테고리별 평균(self.means_)과 전체 평균(self.overall_) 저장, self 반환\n        return self\n\n    def predict(self, X):\n        # 2. 카테고리 평균(없으면 전체 평균)을 정수로 반올림\n        return []\n\nX_train = ['book', 'shoes', 'book', 'shoes', 'book']\ny_train = [8000, 35000, 12000, 41000, 9500]\n\n# 3. 학습한 모델\nmodel = \n\n# 4. ['book', 'shoes', 'phone'] 예측\npred = \n\nprint(model.means_, model.overall_)\nprint(pred)\n",
    "solution": "class CategoryMeanModel:\n    def fit(self, X, y):\n        # 1. 카테고리별 평균(self.means_)과 전체 평균(self.overall_) 저장, self 반환\n        groups = {}\n        for cat, v in zip(X, y):\n            groups.setdefault(cat, []).append(v)\n        self.means_ = {cat: sum(vs) / len(vs) for cat, vs in groups.items()}\n        self.overall_ = sum(y) / len(y)\n        return self\n\n    def predict(self, X):\n        # 2. 카테고리 평균(없으면 전체 평균)을 정수로 반올림\n        return [round(self.means_.get(cat, self.overall_)) for cat in X]\n\nX_train = ['book', 'shoes', 'book', 'shoes', 'book']\ny_train = [8000, 35000, 12000, 41000, 9500]\n\n# 3. 학습한 모델\nmodel = CategoryMeanModel().fit(X_train, y_train)\n\n# 4. ['book', 'shoes', 'phone'] 예측\npred = model.predict(['book', 'shoes', 'phone'])\n\nprint(model.means_, model.overall_)\nprint(pred)\n",
    "hints": [
      "fit 안에서 카테고리별로 값을 모은 뒤(딕셔너리 + setdefault, 또는 defaultdict(list)) 평균을 self.means_ 에 담으세요.",
      "self.overall_ = sum(y) / len(y). fit 의 마지막 줄은 return self 입니다.",
      "predict 에서는 round(self.means_.get(cat, self.overall_)) 처럼 자리수 없이 round 하면 정수가 됩니다.",
      "model = CategoryMeanModel().fit(X_train, y_train)"
    ],
    "checks": [
      {
        "label": "1단계 fit 이 means_ · overall_ 저장, self 반환",
        "expr": "(lambda m: m.fit(['a', 'a', 'b'], [10, 30, 50]) is m and m.means_ == {'a': 20.0, 'b': 50.0} and m.overall_ == 30.0)(CategoryMeanModel())",
        "hint": "카테고리별 평균 딕셔너리를 self.means_, 전체 평균을 self.overall_ 에 담고 return self."
      },
      {
        "label": "2단계 predict (정수, 없는 카테고리는 전체 평균)",
        "expr": "CategoryMeanModel().fit(['a', 'a', 'b'], [10, 21, 50]).predict(['b', 'a', 'z']) == [50, 16, 27]",
        "hint": "round(self.means_.get(cat, self.overall_)) 로 정수를 만드세요."
      },
      {
        "label": "3단계 model 학습",
        "expr": "isinstance(model, CategoryMeanModel) and {k: round(v, 2) for k, v in model.means_.items()} == {'book': 9833.33, 'shoes': 38000.0}",
        "hint": "model = CategoryMeanModel().fit(X_train, y_train)"
      },
      {
        "label": "4단계 pred",
        "expr": "pred == [9833, 38000, 21100]",
        "hint": "model.predict(['book', 'shoes', 'phone']). phone은 학습 때 없던 카테고리라 전체 평균입니다."
      }
    ]
  },
  {
    "id": "8-8",
    "unit": 8,
    "domain": "mfg",
    "title": "측정값 몇 개든 받아 산포 판정",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "def f(lot, *values)",
        "남은 값을 튜플로 모으기"
      ],
      [
        "max · min",
        "범위(최대 - 최소)"
      ],
      [
        "round",
        "소수 오차 정리"
      ]
    ],
    "origin": "*args",
    "desc": "<p>로트마다 측정 횟수가 다릅니다. <code>solution(lot, limit, *values)</code>는 로트 이름, 허용 범위, 그리고 <b>몇 개든</b> 측정값을 받습니다.</p><p>측정값의 범위(최댓값 − 최솟값, 소수점 2자리 반올림)가 limit 이하면 <code>'로트: OK (범위)'</code>, 넘으면 <code>'로트: NG (범위)'</code> 문자열을 반환하세요. 측정값이 2개 미만이면 <code>'로트: 측정 부족'</code>을 반환합니다.</p><p>예: <code>solution('A0915', 0.5, 10.1, 9.8, 10.4)</code> → <code>'A0915: NG (0.6)'</code></p>",
    "starter": "def solution(lot, limit, *values):\n    answer = ''\n    return answer\n",
    "solution": "def solution(lot, limit, *values):\n    if len(values) < 2:\n        return f'{lot}: 측정 부족'\n    spread = round(max(values) - min(values), 2)\n    result = 'OK' if spread <= limit else 'NG'\n    return f'{lot}: {result} ({spread})'\n",
    "hints": [
      "values 는 튜플입니다. len(values) 로 개수를 먼저 확인하세요.",
      "범위는 round(max(values) - min(values), 2) 입니다. 소수 오차 때문에 반올림이 필요합니다.",
      "f'{lot}: {result} ({spread})' 모양으로 돌려주세요."
    ],
    "tests": [
      {
        "args": [
          "A0915",
          0.5,
          10.1,
          9.8,
          10.4
        ],
        "expected": "A0915: NG (0.6)"
      },
      {
        "args": [
          "A0916",
          0.5,
          10.1,
          10.3
        ],
        "expected": "A0916: OK (0.2)"
      },
      {
        "args": [
          "A0917",
          0.3,
          10.0
        ],
        "hidden": true,
        "expected": "A0917: 측정 부족"
      },
      {
        "args": [
          "A0918",
          0.4,
          9.9,
          10.3,
          10.1,
          10.0,
          9.95
        ],
        "hidden": true,
        "expected": "A0918: OK (0.4)"
      },
      {
        "args": [
          "A0919",
          1.0
        ],
        "hidden": true,
        "expected": "A0919: 측정 부족"
      }
    ]
  },
  {
    "id": "8-9",
    "unit": 8,
    "domain": "general",
    "title": "할인 설정 딕셔너리를 풀어 넣기",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "def f(price, rate=0, coupon=0)",
        "기본값 매개변수"
      ],
      [
        "f(**설정)",
        "딕셔너리를 키워드 인자로 풀어 넣기"
      ],
      [
        "int",
        "원 단위 버림"
      ]
    ],
    "origin": "*args · **kwargs",
    "desc": "<p>쇼핑몰마다 할인 설정이 딕셔너리로 저장되어 있습니다. 미리 만들어 둔 함수 <code>final_price(price, rate=0, coupon=0)</code>는 가격에서 rate(%) 할인을 먼저 하고, 쿠폰 금액을 뺀 뒤 원 단위 아래를 버립니다(0원 아래로는 내려가지 않음).</p><p><code>solution(prices, setting)</code>은 가격 리스트와 설정 딕셔너리(<code>{'rate': 10, 'coupon': 1000}</code> 같은 모양, 일부 key만 있을 수도 있음)를 받습니다. 각 가격에 설정을 <code>**</code>로 풀어 <code>final_price</code>를 적용한 <b>리스트</b>를 반환하세요.</p><p>예: <code>solution([20000, 5000], {'rate': 10, 'coupon': 1000})</code> → <code>[17000, 3500]</code></p>",
    "starter": "def final_price(price, rate=0, coupon=0):\n    p = price * (100 - rate) / 100 - coupon\n    return max(int(p), 0)\n\ndef solution(prices, setting):\n    answer = []\n    return answer\n",
    "solution": "def final_price(price, rate=0, coupon=0):\n    p = price * (100 - rate) / 100 - coupon\n    return max(int(p), 0)\n\ndef solution(prices, setting):\n    return [final_price(p, **setting) for p in prices]\n",
    "hints": [
      "final_price(p, **setting) 은 final_price(p, rate=10, coupon=1000) 과 같습니다.",
      "setting 에 없는 key는 기본값(0)이 쓰입니다.",
      "가격마다 적용한 결과를 리스트로 모아 return 하세요."
    ],
    "tests": [
      {
        "args": [
          [
            20000,
            5000
          ],
          {
            "rate": 10,
            "coupon": 1000
          }
        ],
        "expected": [
          17000,
          3500
        ]
      },
      {
        "args": [
          [
            12000,
            8000,
            300
          ],
          {
            "coupon": 500
          }
        ],
        "expected": [
          11500,
          7500,
          0
        ]
      },
      {
        "args": [
          [
            9900,
            15000
          ],
          {
            "rate": 25
          }
        ],
        "hidden": true,
        "expected": [
          7425,
          11250
        ]
      },
      {
        "args": [
          [
            1000
          ],
          {}
        ],
        "hidden": true,
        "expected": [
          1000
        ]
      },
      {
        "args": [
          [
            3333,
            700
          ],
          {
            "rate": 30,
            "coupon": 600
          }
        ],
        "hidden": true,
        "expected": [
          1733,
          0
        ]
      }
    ]
  },
  {
    "id": "50-5",
    "unit": 50,
    "domain": "mfg",
    "title": "불량 유형 파레토 상위 n개",
    "type": "function",
    "level": 1,
    "uses": [
      [
        "Counter(목록)",
        "값마다 개수 세기"
      ],
      [
        "most_common(n)",
        "많은 순 상위 n개"
      ],
      [
        "strip · lower",
        "표기 통일"
      ]
    ],
    "origin": "collections",
    "desc": "<p>검사원이 입력한 불량 유형 목록 <code>logs</code>에는 대소문자와 앞뒤 공백이 섞여 있습니다(<code>' Scratch'</code>, <code>'scratch '</code>는 같은 유형).</p><p>표기를 소문자 · 공백 없음으로 통일한 뒤, 많은 순서로 상위 <code>n</code>개를 <code>[(유형, 건수), …]</code> 리스트로 반환하세요. 건수가 같으면 먼저 나온 유형이 앞입니다(<code>Counter.most_common</code>의 기본 동작).</p><p>예: <code>solution(['scratch', ' Dent', 'SCRATCH ', 'crack', 'dent', 'scratch'], 2)</code> → <code>[('scratch', 3), ('dent', 2)]</code></p>",
    "starter": "from collections import Counter\n\ndef solution(logs, n):\n    answer = []\n    return answer\n",
    "solution": "from collections import Counter\n\ndef solution(logs, n):\n    counts = Counter(s.strip().lower() for s in logs)\n    return counts.most_common(n)\n",
    "hints": [
      "먼저 [s.strip().lower() for s in logs] 로 표기를 통일하세요.",
      "Counter(통일한 목록).most_common(n) 이 답입니다.",
      "most_common 은 (값, 개수) 튜플의 리스트를 돌려줍니다."
    ],
    "tests": [
      {
        "args": [
          [
            "scratch",
            " Dent",
            "SCRATCH ",
            "crack",
            "dent",
            "scratch"
          ],
          2
        ],
        "expected": [
          [
            "scratch",
            3
          ],
          [
            "dent",
            2
          ]
        ]
      },
      {
        "args": [
          [
            "Void",
            "void",
            "crack",
            "VOID ",
            "Crack",
            "dent"
          ],
          1
        ],
        "expected": [
          [
            "void",
            3
          ]
        ]
      },
      {
        "args": [
          [
            "dent",
            "crack",
            "dent",
            "crack",
            "burr"
          ],
          3
        ],
        "hidden": true,
        "expected": [
          [
            "dent",
            2
          ],
          [
            "crack",
            2
          ],
          [
            "burr",
            1
          ]
        ]
      },
      {
        "args": [
          [
            "a"
          ],
          2
        ],
        "hidden": true,
        "expected": [
          [
            "a",
            1
          ]
        ]
      },
      {
        "args": [
          [
            " Burr",
            "burr",
            "BURR",
            "dent "
          ],
          2
        ],
        "hidden": true,
        "expected": [
          [
            "burr",
            3
          ],
          [
            "dent",
            1
          ]
        ]
      }
    ]
  },
  {
    "id": "50-6",
    "unit": 50,
    "domain": "general",
    "title": "동아리 신청서를 학과별로 모으기",
    "type": "function",
    "level": 2,
    "uses": [
      [
        "defaultdict(list)",
        "없는 key는 빈 리스트부터"
      ],
      [
        "d[k].append(v)",
        "그룹별로 모으기"
      ],
      [
        "sorted",
        "이름 순 정렬"
      ]
    ],
    "origin": "collections",
    "desc": "<p>동아리 신청서 <code>forms</code>는 <code>'이름,학과'</code> 문자열 목록입니다.</p><p>학과별로 신청자 이름을 모아 <b>딕셔너리</b>를 반환하세요. 각 학과의 이름 목록은 가나다(문자열) 순으로 정렬하고, 같은 사람이 같은 학과로 두 번 신청했으면 한 번만 넣습니다. 딕셔너리의 key 순서는 상관없습니다.</p><p>예: <code>solution(['민지,통계', '서준,컴공', '하린,통계'])</code> → <code>{'통계': ['민지', '하린'], '컴공': ['서준']}</code></p>",
    "starter": "from collections import defaultdict\n\ndef solution(forms):\n    answer = {}\n    return answer\n",
    "solution": "from collections import defaultdict\n\ndef solution(forms):\n    groups = defaultdict(set)\n    for f in forms:\n        name, major = f.split(',')\n        groups[major].add(name)\n    return {major: sorted(names) for major, names in groups.items()}\n",
    "hints": [
      "f.split(',') 로 이름과 학과를 나눕니다.",
      "중복을 없애려면 defaultdict(set) 에 add 하고, 마지막에 sorted 로 리스트를 만드세요.",
      "돌려줄 때는 {학과: sorted(이름들) for ...} 처럼 일반 딕셔너리로 만드세요."
    ],
    "tests": [
      {
        "args": [
          [
            "민지,통계",
            "서준,컴공",
            "하린,통계"
          ]
        ],
        "expected": {
          "통계": [
            "민지",
            "하린"
          ],
          "컴공": [
            "서준"
          ]
        }
      },
      {
        "args": [
          [
            "지우,경영",
            "지우,경영",
            "도윤,경영",
            "가은,컴공"
          ]
        ],
        "expected": {
          "경영": [
            "도윤",
            "지우"
          ],
          "컴공": [
            "가은"
          ]
        }
      },
      {
        "args": [
          [
            "하준,수학"
          ]
        ],
        "hidden": true,
        "expected": {
          "수학": [
            "하준"
          ]
        }
      },
      {
        "args": [
          [
            "다온,통계",
            "가람,통계",
            "나래,통계",
            "가람,통계"
          ]
        ],
        "hidden": true,
        "expected": {
          "통계": [
            "가람",
            "나래",
            "다온"
          ]
        }
      },
      {
        "args": [
          []
        ],
        "hidden": true,
        "expected": {}
      }
    ]
  }
];

export const PBO_QUIZZES = [
  {
    "id": "52-Q",
    "unit": 52,
    "title": "클래스와 객체 개념 퀴즈",
    "type": "quiz",
    "level": 1,
    "origin": "코드 작성 · 객관식 · OX",
    "questions": [
      {
        "kind": "choice",
        "q": "made = datetime(2026, 11, 7) 일 때 괄호를 붙여야 하는(메서드인) 것은?",
        "options": [
          "made.year",
          "made.month",
          "made.weekday",
          "made.day"
        ],
        "answer": 2,
        "explain": "year · month · day는 객체가 가진 값(속성)이라 괄호 없이 꺼냅니다. weekday는 요일을 계산하는 일(메서드)이라 made.weekday()로 불러야 합니다."
      },
      {
        "kind": "write",
        "q": "Lot 클래스에 불량률(%)을 소수점 2자리로 돌려주는 rate 메서드를 만들고 Lot('A0915', 1250, 18).rate() 를 출력하세요.",
        "given": "class Lot:\n    def __init__(self, lot_id, qty, defects):\n        self.lot_id = lot_id\n        self.qty = qty\n        self.defects = defects\n",
        "expect": "1.44",
        "must": [
          "def\\s+rate\\s*\\(\\s*self",
          "self\\.defects",
          "self\\.qty"
        ],
        "solution": "class Lot:\n    def __init__(self, lot_id, qty, defects):\n        self.lot_id = lot_id\n        self.qty = qty\n        self.defects = defects\n\n    def rate(self):\n        return round(self.defects / self.qty * 100, 2)\n\nprint(Lot('A0915', 1250, 18).rate())",
        "explain": "메서드 안에서는 self.defects, self.qty로 자기 속성을 꺼냅니다. 18 / 1250 × 100 = 1.44입니다."
      },
      {
        "kind": "ox",
        "q": "__init__ 안에서 self.qty = qty 대신 qty = qty 라고 쓰면, 나중에 a.qty 로 값을 꺼낼 수 있다.",
        "answer": false,
        "explain": "self. 없이 쓴 qty는 __init__ 안에서만 사는 지역 변수라 함수가 끝나면 사라집니다. 객체에 저장하려면 self.qty = qty."
      },
      {
        "kind": "choice",
        "q": "fit 메서드 끝에 return self 를 두는 가장 큰 이유는?",
        "options": [
          "fit 을 두 번 못 부르게 하려고",
          "model.fit(X, y).predict(new_X) 처럼 이어 쓰려고",
          "학습 결과를 지우려고",
          "self 를 쓰지 않으면 에러가 나서"
        ],
        "answer": 1,
        "explain": "fit이 객체 자신을 돌려주면 그 결과에 바로 점을 찍어 다른 메서드를 부를 수 있습니다. scikit-learn의 fit도 self를 돌려줍니다."
      },
      {
        "kind": "choice",
        "q": "같은 MeanModel 클래스로 m1, m2 두 객체를 만들어 서로 다른 데이터로 fit 했다. 맞는 설명은?",
        "options": [
          "m2 를 fit 하면 m1 의 mean_ 도 바뀐다",
          "두 객체는 각자 자기 mean_ 을 따로 기억한다",
          "클래스 하나로는 객체를 하나만 만들 수 있다",
          "두 번째 fit 은 에러가 난다"
        ],
        "answer": 1,
        "explain": "self는 각 객체 자신이라 self.mean_ = …은 그 객체에만 저장됩니다. 같은 설계도로 만든 객체도 상태는 따로입니다."
      }
    ]
  }
];
