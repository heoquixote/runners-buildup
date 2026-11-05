## 학습 목표

- 함수를 정의하고 호출하는 기본 흐름을 이해할 수 있습니다.
- 매개변수, 인자, 반환값, 스코프의 차이를 설명할 수 있습니다.
- `*args`, `**kwargs`, `lambda`, `map`, `filter`가 각각 어떤 문제를 해결하는지 설명할 수 있습니다.
- "함수는 왜 재사용성과 유지보수에 중요한가"를 실무 관점에서 이해할 수 있습니다.

## 왜 함수가 중요한가

함수는 긴 코드를 `의미 있는 작업 단위`로 나누는 도구입니다.  
실무에서는 단순히 코드 길이를 줄이기보다 아래 목적 때문에 함수를 씁니다.

- 같은 로직을 여러 번 재사용하기 위해
- 테스트 가능한 작은 단위로 분리하기 위해
- 입력과 출력이 분명한 구조를 만들기 위해
- 나중에 수정할 때 영향 범위를 줄이기 위해

즉, 함수는 "짧게 쓰는 기술"이 아니라 `코드를 역할별로 나누는 설계 도구`에 가깝습니다.

## 함수란 무엇인가

가장 간단하게 말하면, 함수는 자주 쓰는 코드를 이름 붙여 묶은 것입니다.

```python
def say_hello():
    print("안녕하세요, 파이썬입니다!")

say_hello()
```

```text
안녕하세요, 파이썬입니다!
```

위 코드에서:

- `def`: 함수를 정의할 때 쓰는 키워드
- `say_hello`: 함수 이름
- `()`: 입력값을 받을 자리
- 들여쓴 부분: 함수가 실제로 수행할 일

## 함수의 기본 구조

```python
def 함수이름(매개변수):
    실행문
    return 결과값
```

예를 들어 두 수를 더하는 함수는 아래처럼 작성할 수 있습니다.

```python
def add(a, b):
    result = a + b
    return result

print(add(3, 5))
```

```text
8
```

## 매개변수와 인자

이 구분은 초반에 헷갈리기 쉽지만 꼭 정확히 잡아두는 편이 좋습니다.

- 매개변수(parameter): 함수를 정의할 때 받는 변수 이름
- 인자(argument): 함수를 호출할 때 실제로 전달하는 값

```python
def greet(name):
    print(f"안녕하세요, {name}님!")

greet("Hannah")
greet("민준")
```

여기서:

- `name`은 매개변수
- `"Hannah"`, `"민준"`은 인자

매개변수가 여러 개일 수도 있습니다.

```python
def introduce(name, age):
    print(f"안녕하세요, 제 이름은 {name}, 나이는 {age}살이에요!")

introduce("Hannah", 24)
```

## `return`이 중요한 이유

초보자는 함수 안에서 `print()`만 하고 끝내는 경우가 많습니다.  
하지만 실무에서는 화면 출력보다 `결과를 반환해서 다른 로직에서 이어 쓰는 것`이 훨씬 중요합니다.

```python
def add_print(a, b):
    print(a + b)

def add_return(a, b):
    return a + b

x = add_print(3, 4)
y = add_return(3, 4)

print("x:", x)
print("y:", y)
```

```text
7
x: None
y: 7
```

핵심 차이:

- `print()`: 화면에 보여주기
- `return`: 값을 바깥으로 돌려주기

분석 코드, 전처리 함수, 계산 함수는 대부분 `return` 중심으로 생각하는 편이 좋습니다.

## 기본값 매개변수

항상 같은 값이 자주 들어가는 경우 기본값을 둘 수 있습니다.

```python
def greet(name, prefix="안녕하세요"):
    return f"{prefix}, {name}"

print(greet("Hannah"))
print(greet("Hannah", "반갑습니다"))
```

기본값을 두면 호출이 더 간단해지지만, 함수 사용 방식이 너무 많아지지 않게 설계하는 것도 중요합니다.

## 스코프: 지역 변수와 전역 변수

스코프(scope)는 `변수가 살아 있는 범위`입니다.

- 지역 변수(local): 함수 내부에서 만든 변수
- 전역 변수(global): 함수 밖에서 만든 변수

```python
x = 10

def func():
    x = 5
    print("함수 안:", x)

func()
print("함수 밖:", x)
```

```text
함수 안: 5
함수 밖: 10
```

이름이 같아도 "함수 안의 x"와 "밖의 x"는 다른 변수입니다.  
그래서 전역 변수에 지나치게 의존하는 코드는 디버깅이 어려워집니다.

## 가변 인자: `*args`

입력 개수가 정해지지 않은 값을 받을 때 `*args`를 씁니다.  
함수 내부에서는 튜플처럼 다뤄집니다.

```python
def add_all(*args):
    print(args)
    return sum(args)

print(add_all(1, 2, 3))
print(add_all(10, 20, 30, 40, 50))
```

```text
(1, 2, 3)
6
(10, 20, 30, 40, 50)
150
```

고정 인자와 함께 쓸 수도 있습니다.

```python
def greet_all(greeting, *names):
    for name in names:
        print(f"{greeting}, {name}님!")

greet_all("안녕하세요", "Hannah", "Yumi", "Minji")
```

## 키워드 인자 묶기: `**kwargs`

이름이 붙은 여러 인자를 받을 때는 `**kwargs`를 씁니다.  
함수 내부에서는 딕셔너리처럼 다뤄집니다.

```python
def user_info(**kwargs):
    print(kwargs)

user_info(name="Hannah", age=25, major="Data Science")
```

```text
{'name': 'Hannah', 'age': 25, 'major': 'Data Science'}
```

반복문으로도 쉽게 순회할 수 있습니다.

```python
def introduce(title, **kwargs):
    print(f"[{title}]")
    for key, value in kwargs.items():
        print(f"{key}: {value}")

introduce("학생 정보", name="Hannah", age=25, major="AI")
```

이 구조는:

- 로그 출력
- 설정값 전달
- API 응답 재구성

같은 작업에서 특히 자주 보입니다.

## `lambda`: 이름 없는 짧은 함수

`lambda`는 한 번 쓰고 지나갈 짧은 함수를 만들 때 사용합니다.

```python
add = lambda a, b: a + b
print(add(1, 2))
```

```text
3
```

다만 `lambda`는 복잡한 로직을 넣는 용도가 아닙니다.  
짧은 계산, 정렬 기준, 간단한 변환에 적합합니다.

노션 예시처럼 `sorted()`와 함께 많이 씁니다.

```python
data = [
    {"product": "A", "total": 100, "failed": 5, "fail_rate": 0.05},
    {"product": "B", "total": 200, "failed": 2, "fail_rate": 0.01},
    {"product": "C", "total": 50, "failed": 3, "fail_rate": 0.06},
]

sorted_by_rate = sorted(data, key=lambda x: x["fail_rate"])

for item in sorted_by_rate:
    print(f"제품 {item['product']}: 불량률 {item['fail_rate']:.2%}")
```

## `map()`과 `filter()`

### `map()`

`map(function, iterable)`은 각 원소에 같은 변환을 적용할 때 씁니다.

```python
numbers = [1, 2, 3, 4]
squares = list(map(lambda x: x**2, numbers))
print(squares)
```

```text
[1, 4, 9, 16]
```

### `filter()`

`filter(function, iterable)`은 조건이 참인 원소만 남길 때 씁니다.

```python
numbers = [1, 2, 3, 4, 5, 6]
odds = list(filter(lambda x: x % 2 == 1, numbers))
print(odds)
```

```text
[1, 3, 5]
```

### 함께 쓰기

```python
data = [1, 2, 3, 4, 5, 6]
tripled_odds = list(map(lambda x: x * 3, filter(lambda x: x % 2 != 0, data)))
print(tripled_odds)
```

```text
[3, 9, 15]
```

## 컴프리헨션과 비교

Python에서는 아래처럼 컴프리헨션이 더 읽기 쉬운 경우도 많습니다.

```python
double_numbers = [x * 2 for x in numbers]
even_numbers = [x for x in numbers if x % 2 == 0]
```

따라서 실무에서는:

- 간단한 변환/필터링: 컴프리헨션 선호
- 함수 전달이 자연스러운 경우: `map`, `filter`
- 정렬 기준처럼 짧은 계산: `lambda`

정도로 생각하면 무난합니다.

## 실무 팁

- 함수 이름은 `무엇을 하는지`가 바로 드러나야 합니다.
- 한 함수가 너무 많은 일을 하면 테스트와 디버깅이 어려워집니다.
- 전역 변수에 의존하는 함수보다 필요한 값을 매개변수로 받는 함수가 더 안전합니다.
- `print()`보다 `return` 중심으로 함수를 설계하면 재사용성이 훨씬 좋아집니다.
- `lambda`는 짧을 때만 좋습니다. 길어지면 `def` 함수로 꺼내는 편이 낫습니다.
