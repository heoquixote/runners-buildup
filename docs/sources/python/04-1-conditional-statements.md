## 학습 목표

- `if`, `elif`, `else`를 사용해 분기 로직을 작성할 수 있습니다.
- 조건식이 `True` 또는 `False`로 평가되는 방식을 이해할 수 있습니다.
- 조건 순서가 결과에 미치는 영향을 설명할 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: 없음
- 외부 라이브러리: 없음

## 왜 조건문이 중요한가

조건문은 프로그램이 항상 같은 길만 따라가지 않도록 만드는 첫 번째 도구입니다.

예를 들어:

- 점수가 60점 이상이면 합격
- 파일이 있으면 읽고 없으면 생성
- 로그인 상태면 대시보드로 보내고 아니면 로그인 페이지로 보냄

이 모든 것이 조건문입니다.

즉, 조건문은 코드에 `판단`을 넣는 방법입니다.

## `if`의 기본 구조

```python
score = 85

if score >= 60:
    print("합격")
```

조건식 `score >= 60`이 참이면 들여쓴 코드가 실행됩니다.

중요한 점:

- 조건식은 `True` 또는 `False`로 평가됩니다.
- 들여쓰기가 블록의 범위를 결정합니다.

## `if` `elif` `else`

여러 경우 중 하나를 선택하려면 다음 구조를 씁니다.

```python
score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("재도전")
```

### 동작 원리

위에서부터 순서대로 검사합니다.

- 첫 번째로 참이 되는 조건이 실행됩니다.
- 나머지는 검사하지 않습니다.

그래서 `조건의 순서`가 매우 중요합니다.

## 조건 순서가 중요한 이유

```python
score = 95

if score >= 60:
    print("합격")
elif score >= 90:
    print("우수 합격")
```

이 코드는 `우수 합격`이 아니라 `합격`이 출력됩니다. 왜냐하면 첫 번째 조건이 이미 참이기 때문입니다.

더 구체적인 조건을 앞에 두는 것이 보통 안전합니다.

```python
if score >= 90:
    print("우수 합격")
elif score >= 60:
    print("합격")
```

## 조건식에 들어가는 값

조건식에는 비교식뿐 아니라 참/거짓처럼 평가되는 값도 올 수 있습니다.

```python
name = "Python"

if name:
    print("이름이 있습니다.")
```

문자열이 비어 있지 않으므로 참으로 평가됩니다.

이 패턴은 실무에서 매우 자주 쓰입니다.

```python
email = ""

if not email:
    print("이메일이 비어 있습니다.")
```

## 비교 연산자와 함께 쓰기

```python
age = 25

if age >= 20:
    print("성인")
else:
    print("미성년")
```

비교 연산자는 조건문의 가장 기본 재료입니다.

## 논리 연산자와 함께 쓰기

```python
age = 22
has_ticket = True

if age >= 20 and has_ticket:
    print("입장 가능")
```

복합 조건이 필요할 때는:

- `and`
- `or`
- `not`

을 사용합니다.

실무 팁:

조건이 길어지면 중간 변수를 만드는 것이 좋습니다.

```python
is_adult = age >= 20
can_enter = is_adult and has_ticket

if can_enter:
    print("입장 가능")
```

## 중첩 조건문

조건문 안에 또 조건문을 넣을 수도 있습니다.

```python
age = 25
membership = "vip"

if age >= 20:
    if membership == "vip":
        print("VIP 성인 회원")
```

하지만 중첩이 깊어질수록 읽기 어려워집니다. 가능하면 조건을 합치거나, 함수로 분리하는 편이 좋습니다.

## 실무에서 자주 쓰는 분기 패턴

### 1. 유효성 검사

```python
name = input("이름: ").strip()

if not name:
    print("이름은 필수입니다.")
```

### 2. 범위 분류

```python
temperature = 28

if temperature >= 30:
    print("매우 더움")
elif temperature >= 20:
    print("적당함")
else:
    print("쌀쌀함")
```

### 3. 예외 상황 먼저 처리

```python
file_path = ""

if not file_path:
    print("파일 경로가 없습니다.")
else:
    print("파일을 읽습니다.")
```

이 방식은 `가드 절`처럼 코드를 더 읽기 쉽게 만들어 줍니다.

## 삼항 표현식

아주 간단한 분기라면 한 줄로도 쓸 수 있습니다.

```python
age = 18
status = "성인" if age >= 20 else "미성년"
print(status)
```

다만 조건이 복잡하면 오히려 가독성이 나빠집니다.

## 자주 하는 실수

### 1. 조건 순서를 잘못 배치

더 넓은 조건을 먼저 쓰면 뒤의 더 구체적인 조건이 영원히 실행되지 않을 수 있습니다.

### 2. 문자열 `"False"`를 거짓으로 착각

문자열은 비어 있지 않으면 참처럼 평가됩니다.

### 3. 들여쓰기 실수

Python은 들여쓰기가 곧 문법입니다. 같은 깊이의 코드만 같은 블록으로 인식됩니다.

### 4. 조건이 너무 길어지는 문제

`if` 한 줄에 모든 조건을 몰아넣으면 디버깅이 어려워집니다.

## 추천 예제

```python
sales = 120000
refund_count = 1

if sales >= 150000:
    level = "Top"
elif sales >= 100000:
    level = "Good"
else:
    level = "Normal"

if refund_count >= 3:
    print("환불 관리 필요")

print(level)
```

이 예제는 등급 분류와 별도 경고 조건이 함께 존재하는, 실제 업무형 분기 구조입니다.

## 정리

이번 페이지의 핵심은 다음입니다.

- 조건문은 코드에 판단을 넣는 구조입니다.
- `if`, `elif`, `else`는 위에서부터 순서대로 평가됩니다.
- 조건 순서와 가독성은 결과만큼 중요합니다.

조건문을 잘 쓰게 되면 이후 반복문, 함수, 예외 처리, 데이터 필터링까지 훨씬 쉽게 연결할 수 있습니다.
