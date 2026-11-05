## 학습 목표

- 산술, 비교, 논리 연산자의 역할을 설명할 수 있습니다.
- 표현식이 평가되어 하나의 값이 된다는 개념을 이해할 수 있습니다.
- 연산 우선순위 때문에 생기는 혼란을 줄일 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: 없음
- 외부 라이브러리: 없음

## 왜 이 주제가 중요한가

Python 문장은 결국 `값 + 연산 + 결과`의 조합으로 이루어집니다. 조건문도, 반복문도, 함수 호출도 자세히 보면 표현식 평가 위에 서 있습니다.

이 주제를 제대로 이해하면:

- 계산 결과가 왜 그렇게 나왔는지 설명할 수 있고
- 조건식이 왜 참 또는 거짓이 되었는지 추적할 수 있으며
- 복잡한 코드를 작은 단위로 나눠 읽을 수 있습니다

## 표현식이란 무엇인가

표현식(expression)은 `평가되면 하나의 값이 되는 코드 조각`입니다.

```python
10 + 20
"Py" + "thon"
age >= 20
```

위 코드는 각각 다음 값으로 평가됩니다.

- `10 + 20` -> `30`
- `"Py" + "thon"` -> `"Python"`
- `age >= 20` -> `True` 또는 `False`

즉, 표현식은 `결과를 만드는 단위`입니다.

## 산술 연산자

가장 기본적인 수치 계산 연산입니다.

```python
a = 10
b = 3

print(a + b)   # 덧셈
print(a - b)   # 뺄셈
print(a * b)   # 곱셈
print(a / b)   # 나눗셈
print(a // b)  # 몫
print(a % b)   # 나머지
print(a ** b)  # 거듭제곱
```

### `/`와 `//` 차이

```python
print(10 / 3)   # 3.333...
print(10 // 3)  # 3
```

- `/`는 실수 결과를 반환합니다.
- `//`는 몫만 반환합니다.

실무에서 날짜 구간 계산, 페이지 번호 계산, 배치 크기 계산 등에서 `//`가 자주 쓰입니다.

### `%` 연산자

나머지를 구하는 연산자입니다.

```python
print(10 % 2)  # 0
print(11 % 2)  # 1
```

주로 다음 상황에서 씁니다.

- 짝수/홀수 판별
- 주기성 계산
- 특정 간격마다 이벤트 실행

## 비교 연산자

두 값을 비교해 `True` 또는 `False`를 반환합니다.

```python
score = 85

print(score > 90)
print(score >= 80)
print(score == 85)
print(score != 70)
```

조건문은 결국 이 비교 결과를 바탕으로 분기합니다.

### `=`와 `==` 차이

초보자가 가장 많이 헷갈리는 부분입니다.

- `=`: 대입
- `==`: 비교

```python
age = 30
print(age == 30)
```

## 논리 연산자

여러 조건을 조합할 때 씁니다.

```python
age = 25
has_ticket = True

print(age >= 20 and has_ticket)
print(age < 20 or has_ticket)
print(not has_ticket)
```

- `and`: 둘 다 참일 때 참
- `or`: 하나라도 참이면 참
- `not`: 참/거짓 반전

실무에서는 필터 조건이 길어질수록 논리 연산자 해석이 중요해집니다.

예:

```python
is_adult = age >= 20
can_enter = is_adult and has_ticket
```

조건을 변수로 분리하면 훨씬 읽기 쉬워집니다.

## 연산 우선순위

Python도 수학과 비슷하게 `먼저 계산되는 순서`가 있습니다.

```python
print(2 + 3 * 4)
```

결과는 `20`이 아니라 `14`입니다. 곱셈이 덧셈보다 먼저 계산되기 때문입니다.

조건식에서도 비슷한 혼란이 생깁니다.

```python
score = 85
attendance = True

result = score >= 80 and attendance
```

우선순위를 외우는 것도 좋지만, 실무에서는 `괄호를 적극적으로 쓰는 습관`이 더 중요합니다.

```python
result = (score >= 80) and attendance
```

## 문자열에서도 연산이 가능하다

연산자는 숫자뿐 아니라 문자열에도 적용됩니다.

```python
print("Hello" + " Python")
print("-" * 20)
```

- `+`: 문자열 결합
- `*`: 반복

이 기능은 로그 출력, 콘솔 구분선, 리포트 텍스트 조합에 유용합니다.

## 비교의 결과는 불리언 값이다

```python
price = 12000
is_expensive = price > 10000

print(is_expensive)
print(type(is_expensive))
```

비교 결과는 결국 `bool`입니다. 이 값이 조건문, 반복문 종료 조건, 필터링 기준으로 이어집니다.

## 실무에서 자주 쓰는 패턴

### 범위 검사

```python
score = 75
is_pass = 60 <= score <= 100
```

Python은 비교 연산을 이렇게 연쇄적으로 쓸 수 있습니다.

### 복합 조건 검사

```python
age = 22
is_member = True

can_join = (age >= 20) and is_member
```

### 나머지를 이용한 규칙 처리

```python
row_number = 17
is_even_row = row_number % 2 == 0
```

## 자주 하는 실수

### 1. 문자열과 숫자를 섞어 계산

```python
price = "1000"
tax = 100
```

이 상태로 계산하면 오류가 나거나 기대와 다르게 동작합니다.

### 2. `=`와 `==` 혼동

```python
score == 90
```

비교인지 대입인지 항상 구분해야 합니다.

### 3. 괄호 없이 복잡한 조건식을 작성

```python
result = age >= 20 and score >= 80 or is_admin
```

이런 식은 읽는 사람도 헷갈리고, 나중에 수정도 어렵습니다.

### 4. `/`와 `//`를 구분하지 않음

페이지 수, 몫 계산, 배치 분할 등에서는 둘의 차이가 실제 결과를 바꿉니다.

## 추천 예제

```python
total_sales = 125000
target_sales = 100000
refund_count = 3

achievement_rate = total_sales / target_sales
is_target_met = total_sales >= target_sales
needs_warning = (refund_count >= 3) and is_target_met

print(achievement_rate)
print(is_target_met)
print(needs_warning)
```

이 예제는 숫자 계산, 비교, 논리 조합이 한 번에 어떻게 연결되는지 보여줍니다.

## 정리

이번 페이지의 핵심은 다음입니다.

- 표현식은 평가되면 하나의 값이 됩니다.
- 연산자는 숫자 계산뿐 아니라 비교와 조건 판단의 중심입니다.
- 복잡한 식은 괄호와 중간 변수로 읽기 쉽게 만드는 것이 중요합니다.

이 감각이 잡히면 조건문과 반복문을 단순 암기가 아니라 `값이 어떻게 계산되는가`의 관점에서 이해할 수 있습니다.
