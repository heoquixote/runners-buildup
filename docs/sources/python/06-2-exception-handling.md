## 학습 목표

- `try`, `except`, `else`, `finally`의 역할을 설명할 수 있습니다.
- 예상 가능한 실패를 코드에서 다루는 이유를 이해할 수 있습니다.
- `except:` 남용이 왜 위험한지 설명할 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: 없음
- 외부 라이브러리: 없음

## 왜 예외 처리가 중요한가

실무 코드는 항상 성공만 하지 않습니다.

- 파일이 없을 수 있습니다
- 숫자로 바꿀 수 없는 값이 들어올 수 있습니다
- 네트워크 요청이 실패할 수 있습니다
- 사용자가 잘못된 입력을 넣을 수 있습니다

예외 처리는 이런 실패를 `프로그램 전체 중단`이 아니라 `관리 가능한 흐름`으로 바꾸는 도구입니다.

## 예외란 무엇인가

예외(exception)는 프로그램 실행 중 발생한 오류 상황입니다.

예:

```python
int("abc")
```

이 코드는 `ValueError`를 발생시킵니다.

즉, 예외는 `문제가 생겼다`는 신호입니다.

## 기본 구조: `try`와 `except`

```python
try:
    age = int(input("나이를 입력하세요: "))
except ValueError:
    print("숫자만 입력해주세요.")
```

의미는 다음과 같습니다.

- `try`: 실패 가능성이 있는 코드를 실행
- `except`: 특정 예외가 발생했을 때 대처

이 구조를 사용하면 오류가 나더라도 사용자가 이해할 수 있는 메시지를 보여줄 수 있습니다.

## 왜 특정 예외를 잡아야 할까

다음과 같이 쓰는 것은 좋지 않습니다.

```python
try:
    age = int(input("나이: "))
except:
    print("오류 발생")
```

이 방식이 위험한 이유:

- 어떤 오류가 났는지 숨깁니다
- 버그와 사용자 입력 오류를 구분하지 못합니다
- 디버깅이 어려워집니다

가능하면 구체적으로 잡아야 합니다.

```python
except ValueError:
    ...
```

## 자주 보는 예외 종류

- `ValueError`: 값 형식이 잘못됨
- `TypeError`: 타입이 맞지 않음
- `KeyError`: 딕셔너리에 키가 없음
- `IndexError`: 리스트 인덱스 범위 초과
- `FileNotFoundError`: 파일이 없음
- `ZeroDivisionError`: 0으로 나눔

예외 이름을 읽을 수 있으면 문제를 훨씬 빨리 좁힐 수 있습니다.

## `else`

예외가 발생하지 않았을 때만 실행되는 블록입니다.

```python
try:
    number = int(input("숫자 입력: "))
except ValueError:
    print("잘못된 입력")
else:
    print(number * 2)
```

이 구조의 장점은:

- 성공 로직과 실패 로직이 분리되어 읽기 쉽습니다

## `finally`

예외 발생 여부와 관계없이 항상 실행됩니다.

```python
try:
    file = open("sample.txt", "r", encoding="utf-8")
    content = file.read()
except FileNotFoundError:
    print("파일이 없습니다.")
finally:
    print("작업 종료")
```

주로:

- 자원 정리
- 종료 메시지
- 연결 해제

같은 작업에 사용합니다.

다만 파일은 보통 `with open(...)` 구조가 더 안전하고 간단합니다.

## 여러 예외 처리

서로 다른 오류를 다르게 처리할 수 있습니다.

```python
try:
    value = input("숫자 입력: ")
    result = 10 / int(value)
except ValueError:
    print("숫자 형식이 아닙니다.")
except ZeroDivisionError:
    print("0으로 나눌 수 없습니다.")
```

이렇게 하면 사용자에게 더 정확한 피드백을 줄 수 있습니다.

## 예외를 다시 발생시키기 `raise`

필요하다면 직접 예외를 발생시킬 수도 있습니다.

```python
age = -1

if age < 0:
    raise ValueError("나이는 음수가 될 수 없습니다.")
```

이 패턴은 데이터 검증, 함수 입력 체크, 비즈니스 규칙 위반 검출에 유용합니다.

## 실무에서 좋은 예외 처리 기준

### 1. 실패 가능성이 있는 부분만 감싼다

```python
try:
    value = int(user_input)
except ValueError:
    ...
```

너무 큰 블록을 한 번에 감싸면 어느 줄에서 문제가 났는지 파악하기 어렵습니다.

### 2. 예외를 숨기지 않는다

무조건 `"오류 발생"`만 출력하면 원인을 찾기 어렵습니다.

### 3. 사용자 메시지와 디버깅 정보는 구분한다

사용자에게는 이해 가능한 설명이 필요하고, 개발자에게는 실제 오류 정보가 필요합니다.

### 4. 예외를 남용해 일반 흐름을 만들지 않는다

예외는 예외 상황을 위한 도구입니다. 평범한 분기까지 예외로 처리하면 코드가 읽기 어려워집니다.

## 실무에서 자주 만나는 패턴

### 파일 읽기

```python
try:
    with open("data.csv", "r", encoding="utf-8") as file:
        content = file.read()
except FileNotFoundError:
    print("data.csv 파일을 찾을 수 없습니다.")
```

### 사용자 입력 검증

```python
try:
    age = int(input("나이: "))
except ValueError:
    print("정수를 입력해주세요.")
```

### 딕셔너리 키 접근

```python
user = {"name": "Jinseong"}

try:
    print(user["email"])
except KeyError:
    print("email 키가 없습니다.")
```

다만 이 경우는 `get()`으로 더 자연스럽게 해결할 수 있는지도 함께 판단해야 합니다.

## 자주 하는 실수

### 1. `except:`만 쓰기

가장 흔하고 위험한 실수입니다.

### 2. 예외를 잡고 아무것도 하지 않기

```python
try:
    ...
except ValueError:
    pass
```

이렇게 하면 문제를 숨겨 버립니다.

### 3. 너무 넓은 범위를 `try`로 감싸기

실패 지점이 불분명해집니다.

### 4. 에러 메시지를 읽지 않고 무조건 예외 처리부터 추가하기

먼저 왜 실패했는지 이해하는 것이 중요합니다.

## 추천 예제

```python
raw_price = input("가격을 입력하세요: ").strip()

try:
    price = int(raw_price)
except ValueError:
    print("숫자 형식이 아닙니다.")
else:
    if price < 0:
        print("가격은 음수가 될 수 없습니다.")
    else:
        print(f"입력된 가격: {price}")
finally:
    print("입력 처리 종료")
```

이 예제는:

- 형변환 오류 처리
- 정상 흐름 분리
- 후처리 메시지

를 한 번에 보여줍니다.

## 정리

이번 페이지의 핵심은 다음입니다.

- 예외 처리는 실패를 관리 가능한 흐름으로 바꾸는 도구입니다.
- 구체적인 예외를 잡는 것이 중요합니다.
- `try`, `except`, `else`, `finally`는 각각 역할이 다릅니다.

예외 처리를 잘하면 프로그램이 더 안전해질 뿐 아니라, 디버깅과 사용자 경험도 함께 좋아집니다.
