## 학습 목표

- Python의 변수는 객체를 가리키는 이름이라는 점을 이해할 수 있습니다.
- 가변 객체와 불변 객체의 차이를 설명할 수 있습니다.
- 얕은 복사와 참조 공유 때문에 생기는 버그를 피할 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: `copy`
- 외부 라이브러리: 없음

## 왜 이 주제가 어렵고 중요한가

Python 초보자가 가장 자주 막히는 지점 중 하나가 바로 `왜 내 값이 같이 바뀌었지?`입니다.

예를 들어:

```python
a = [1, 2, 3]
b = a
b.append(4)

print(a)
```

많은 분들이 `a`는 그대로이고 `b`만 바뀔 것이라고 예상합니다. 하지만 실제로는 `a`도 같이 바뀝니다.

이 문제를 이해하려면 Python의 참조 모델을 알아야 합니다.

## 변수는 값을 직접 담는가

입문 단계에서는 `변수는 값을 저장하는 상자`라고 비유하지만, Python은 실제로 `이름이 객체를 가리키는 구조`에 가깝습니다.

```python
a = [1, 2, 3]
b = a
```

이 코드는 다음 뜻입니다.

- 리스트 객체 `[1, 2, 3]`가 하나 만들어지고
- `a`가 그 객체를 가리키고
- `b`도 같은 객체를 가리킵니다

그래서 `b`를 통해 리스트를 바꾸면 `a`로 봐도 바뀐 상태가 보입니다.

## 가변 객체와 불변 객체

### 불변 객체 immutable

대표 예:

- `int`
- `float`
- `str`
- `tuple`

불변 객체는 한 번 만들어지면 내부 값을 직접 바꿀 수 없습니다.

```python
x = 10
y = x
y = 20

print(x)
print(y)
```

여기서 `y = 20`은 `x`를 바꾸는 것이 아니라, `y`가 새 값 `20`을 가리키게 만드는 것입니다.

### 가변 객체 mutable

대표 예:

- `list`
- `dict`
- `set`

가변 객체는 내부 내용을 직접 수정할 수 있습니다.

```python
items = [1, 2, 3]
items.append(4)
print(items)
```

## 참조 공유가 일어나는 예

```python
original = ["python", "sql"]
copied = original

copied.append("tableau")

print(original)
print(copied)
```

둘 다 `["python", "sql", "tableau"]`가 됩니다.

이유는 복사가 아니라 `같은 리스트를 두 이름이 함께 보고 있기 때문`입니다.

## 복사가 필요할 때

같은 객체를 공유하지 않고, 별도의 리스트가 필요하다면 복사를 해야 합니다.

### 얕은 복사 shallow copy

```python
original = [1, 2, 3]
copied = original.copy()

copied.append(4)

print(original)
print(copied)
```

이 경우:

- `original`은 `[1, 2, 3]`
- `copied`는 `[1, 2, 3, 4]`

가 됩니다.

얕은 복사 방법:

```python
copied = original.copy()
copied = list(original)
copied = original[:]
```

## 얕은 복사의 한계

얕은 복사는 바깥쪽 컨테이너만 새로 만들고, 내부에 들어 있는 중첩 객체는 여전히 공유합니다.

```python
original = [[1, 2], [3, 4]]
copied = original.copy()

copied[0].append(99)

print(original)
print(copied)
```

여기서는 `original`도 같이 바뀝니다.

이유는 바깥 리스트는 복사했지만, 안쪽 리스트들은 같은 객체를 공유하고 있기 때문입니다.

## 깊은 복사 deep copy

중첩된 내부 객체까지 완전히 분리하려면 깊은 복사가 필요합니다.

```python
import copy

original = [[1, 2], [3, 4]]
copied = copy.deepcopy(original)

copied[0].append(99)

print(original)
print(copied)
```

이 경우에는 `original`이 바뀌지 않습니다.

## 함수와 가변 객체

함수에 리스트나 딕셔너리를 넘길 때도 같은 문제가 발생할 수 있습니다.

```python
def add_item(items):
    items.append("new")

my_list = ["a", "b"]
add_item(my_list)

print(my_list)
```

함수 안에서 원본 리스트가 직접 수정됩니다.

이것이 나쁜 것은 아니지만, `함수가 원본을 바꾸는지 아닌지`를 의도적으로 설계해야 합니다.

원본을 보존하고 싶다면:

```python
def add_item_safely(items):
    copied = items.copy()
    copied.append("new")
    return copied
```

## 실무에서 언제 문제가 되는가

### 1. 데이터 전처리 중 원본이 함께 오염될 때

```python
clean_df = raw_df
```

이런 식으로 두 변수를 만들면 복사본처럼 보이지만, 실제로는 같은 객체를 볼 수 있습니다.

### 2. 함수가 입력값을 몰래 바꿔 버릴 때

이 경우 디버깅이 매우 어려워집니다. 특히 긴 파이프라인에서는 어느 함수에서 값이 바뀌었는지 추적하기 힘들어집니다.

### 3. 중첩 구조 복사에서 부분 공유가 남아 있을 때

JSON 비슷한 구조, 설정 딕셔너리, 리스트 안의 딕셔너리 등을 다룰 때 자주 발생합니다.

## 추천 예제

### 참조 공유 예제

```python
config = {"theme": "light", "language": "ko"}
backup = config

backup["theme"] = "dark"

print(config)
print(backup)
```

### 안전한 복사 예제

```python
config = {"theme": "light", "language": "ko"}
backup = config.copy()

backup["theme"] = "dark"

print(config)
print(backup)
```

## 실무에서 기억하면 좋은 기준

- 값이 바뀌지 않는 타입인지 먼저 본다
- 리스트, 딕셔너리, 집합은 공유 여부를 의심한다
- 중첩 구조면 얕은 복사로 충분한지 확인한다
- 함수가 원본을 바꾸는지 문서화하거나 이름으로 드러낸다

## 정리

이번 페이지의 핵심은 다음입니다.

- Python 변수는 객체를 가리키는 이름입니다.
- 가변 객체는 참조 공유 때문에 함께 바뀔 수 있습니다.
- 복사에는 얕은 복사와 깊은 복사가 있으며, 중첩 구조에서는 차이가 매우 중요합니다.

이 개념을 정확히 이해하면 이후 리스트, 딕셔너리, 함수, 클래스, 데이터 전처리 코드에서 생기는 많은 혼란을 줄일 수 있습니다.
