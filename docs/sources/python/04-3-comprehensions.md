## 학습 목표

- 리스트와 딕셔너리 컴프리헨션의 기본 구조를 설명할 수 있습니다.
- `for`문으로 작성하던 단순 변환과 필터링을 더 간결하게 표현할 수 있습니다.
- `if`, `if-else`, `enumerate`, 중첩 반복과 함께 컴프리헨션을 읽고 쓸 수 있습니다.
- 컴프리헨션이 코드 품질을 높이는 경우와 오히려 가독성을 해치는 경우를 구분할 수 있습니다.

## 왜 컴프리헨션을 배우는가

컴프리헨션은 Python에서 매우 자주 보이는 문법입니다.  
특히 데이터 전처리처럼 `값을 변환하고`, `조건으로 걸러내고`, `새로운 리스트나 딕셔너리를 만드는` 작업에서 반복적으로 등장합니다.

핵심은 "짧게 쓰는 기술"이 아니라 `의도가 분명한 데이터 가공 문법`이라는 점입니다.  
실무에서는 다음과 같은 작업을 정말 자주 합니다.

- 공백 제거 후 소문자로 통일하기
- 특정 점수 이상만 추리기
- 딕셔너리에서 조건에 맞는 항목만 남기기
- 2차원 리스트를 납작하게 펼치기

이런 작업을 매번 `for`문과 `append()`로만 작성하면 코드가 길어지고, 반대로 너무 복잡한 로직을 컴프리헨션에 억지로 밀어 넣으면 읽기 어려워집니다.  
따라서 컴프리헨션은 `짧지만 읽히는 코드`를 만들기 위한 균형 감각이 중요합니다.

## 기본 문법 읽는 법

리스트 컴프리헨션의 가장 기본 형태는 아래와 같습니다.

```python
[표현식 for 변수 in iterable]
```

조건을 추가하면 다음처럼 읽습니다.

```python
[표현식 for 변수 in iterable if 조건]
```

예를 들어:

```python
numbers = [1, 2, 3, 4, 5]
squared = [n * n for n in numbers]
even_squares = [n * n for n in numbers if n % 2 == 0]
```

- `n * n`: 각 원소를 어떻게 바꿀지
- `for n in numbers`: 어떤 데이터를 순회할지
- `if n % 2 == 0`: 어떤 원소만 남길지

즉, `무엇을 만들지 -> 무엇을 돌지 -> 어떤 조건일지` 순서로 읽으면 이해가 쉬워집니다.

## 리스트 컴프리헨션

### 단순 변환

```python
numbers = [1, 2, 3, 4]
result = [n * 2 for n in numbers]
print(result)
```

```text
[2, 4, 6, 8]
```

### 조건 필터링

```python
numbers = [1, 2, 3, 4, 5, 6]
even_numbers = [n for n in numbers if n % 2 == 0]
print(even_numbers)
```

```text
[2, 4, 6]
```

### 조건에 따라 다른 값 넣기

노션 실습처럼 짝수와 홀수를 서로 다른 문자열로 바꾸는 패턴도 자주 등장합니다.

```python
data = [1, 2, 3, 4]
labels = ["even" if n % 2 == 0 else "odd" for n in data]
print(labels)
```

```text
['odd', 'even', 'odd', 'even']
```

문법 위치가 헷갈리기 쉬운데, `if-else`가 표현식 자리로 들어간다는 점이 핵심입니다.

```python
[참일 때 값 if 조건 else 거짓일 때 값 for 변수 in iterable]
```

## 딕셔너리 컴프리헨션

딕셔너리 컴프리헨션은 리스트 컴프리헨션과 구조는 비슷하지만, `key: value`를 함께 만듭니다.

```python
scores = {"jin": 80, "seo": 92, "min": 75}
passed = {name: score for name, score in scores.items() if score >= 80}
print(passed)
```

```text
{'jin': 80, 'seo': 92}
```

이 패턴은 다음 상황에서 특히 유용합니다.

- 조건에 맞는 `key-value`만 남기기
- 값을 가공해서 새 딕셔너리 만들기
- 특정 컬럼을 키, 다른 컬럼을 값으로 변환하기

노션 실습의 QAQC 예시처럼 리스트 안 딕셔너리에서 필요한 정보만 뽑을 수도 있습니다.

```python
defect = [
    {"product": "A10", "code": 101, "type": "외관 손상", "severity": 3},
    {"product": "B25", "code": 205, "type": "기능 불량", "severity": 5},
    {"product": "C30", "code": 101, "type": "외관 손상", "severity": 3},
]

product_type_map = {item["product"]: item["type"] for item in defect}
print(product_type_map)
```

```text
{'A10': '외관 손상', 'B25': '기능 불량', 'C30': '외관 손상'}
```

## `enumerate()`와 함께 쓰기

인덱스와 값을 함께 다뤄야 할 때는 `enumerate()`와의 조합이 자주 나옵니다.

```python
text = "abcde"
index_map = {idx: letter for idx, letter in enumerate(text)}
print(index_map)
```

```text
{0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e'}
```

이 패턴은:

- 순번 붙이기
- 인덱스를 키로 저장하기
- 화면 표시용 번호 만들기

같은 작업에 유용합니다.

## 중첩 컴프리헨션

중첩 컴프리헨션은 강력하지만 읽기 어려워지기 쉬운 구간입니다.  
그렇기 때문에 "가능한가"보다 "읽히는가"를 먼저 따져야 합니다.

### 2차원 리스트를 열 기준으로 바꾸기

```python
row_list = [[1, 2], [3, 4], [5, 6]]
column_list = [[row[i] for row in row_list] for i in range(2)]
print(column_list)
```

```text
[[1, 3, 5], [2, 4, 6]]
```

### 평탄화하기

```python
row_list = [[1, 2], [3, 4], [5, 6]]
flatten_list = [row[i] for i in range(2) for row in row_list]
print(flatten_list)
```

```text
[1, 3, 5, 2, 4, 6]
```

이 정도부터는 초보자에게는 오히려 일반 `for`문이 더 명확할 수 있습니다.

## 일반 반복문과 비교

아래 두 코드는 같은 결과를 만듭니다.

```python
result = []
for n in numbers:
    if n % 2 == 0:
        result.append(n * n)
```

```python
result = [n * n for n in numbers if n % 2 == 0]
```

차이는 성능보다 `표현 방식`에 있습니다.

- 일반 `for`문: 단계별로 읽기 쉽다
- 컴프리헨션: 의도가 단순하면 훨씬 간결하다

따라서 다음처럼 판단하면 됩니다.

- 로직이 짧고 단순하면 컴프리헨션
- 조건이 여러 겹이거나 설명이 필요하면 일반 `for`문

## `map`, `filter`와의 관계

노션 실습처럼 `map`, `filter`, `lambda`와 함께 비교하면 개념이 더 잘 잡힙니다.

```python
numbers = [1, 2, 3, 4, 5, 6]

tripled_odds_1 = [n * 3 for n in numbers if n % 2 != 0]
tripled_odds_2 = list(map(lambda x: x * 3, filter(lambda x: x % 2 != 0, numbers)))
```

둘 다 맞는 코드지만, 많은 경우 첫 번째가 더 읽기 쉽습니다.  
즉, Python에서는 `map/filter`보다 컴프리헨션이 더 자주 선호되는 경우가 많습니다.

## 언제 쓰면 좋은가

- 단순 변환: 문자열 소문자 변환, 제곱, 길이 계산
- 단순 필터링: 합격 점수만 추리기, 결측치 제거 후보 만들기
- 짧은 데이터 가공: 공백 제거, 태그 추출, 불량 항목 목록 만들기
- 딕셔너리 재구성: 제품코드와 결함유형 매핑하기

## 언제 피하는 편이 좋은가

- 조건이 여러 개 겹칠 때
- 내부 로직이 함수 호출 여러 개를 포함할 때
- 예외 처리까지 넣고 싶을 때
- 한 줄을 읽는 데 설명이 필요할 때

이런 경우에는 일반 `for`문으로 풀어 쓰는 편이 더 안전합니다.

## 바로 써보는 코드

```python
names = ["  Alice", "Bob  ", " Charlie "]
clean_names = [name.strip().lower() for name in names]

scores = [65, 82, 91, 58, 77]
passed_scores = [score for score in scores if score >= 70]

quality_labels = ["Pass" if count <= 3 else "Fail" for count in [5, 1, 8, 3, 2]]
```

## 실무 포인트

- 컴프리헨션은 `파이썬답게` 보이지만, 복잡하면 오히려 설명이 더 필요해집니다.
- 리스트 컴프리헨션은 결과를 새 리스트로 만들 때 강력합니다.
- 딕셔너리 컴프리헨션은 매핑 테이블을 빠르게 만들 때 특히 유용합니다.
- 중첩 컴프리헨션은 가능하면 한 번 더 멈추고, `for`문이 더 읽기 쉬운지 확인하는 습관이 좋습니다.
