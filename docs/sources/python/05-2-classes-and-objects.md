## 학습 목표

- 클래스와 객체의 차이를 설명할 수 있습니다.
- 속성과 메서드의 역할을 이해할 수 있습니다.
- 모든 문제를 클래스로 풀 필요는 없다는 점을 설명할 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: `dataclasses`
- 외부 라이브러리: 없음

## 왜 클래스가 필요한가

Python 입문자는 종종 `언제 클래스를 써야 하는지`에서 막힙니다. 함수와 리스트, 딕셔너리로도 많은 문제를 해결할 수 있기 때문입니다.

클래스는 보통 `상태 + 동작`이 함께 움직이는 대상을 다룰 때 유용합니다.

예:

- 고객
- 주문
- 보고서 설정
- 게임 캐릭터

즉, `관련된 데이터와 그 데이터를 다루는 동작을 하나로 묶고 싶을 때` 클래스가 등장합니다.

## 클래스와 객체

### 클래스

설계도 또는 타입입니다.

### 객체

클래스를 바탕으로 실제로 만들어진 개별 인스턴스입니다.

```python
class Student:
    pass

s1 = Student()
s2 = Student()
```

여기서:

- `Student`는 클래스
- `s1`, `s2`는 객체입니다

## 속성과 메서드

### 속성 attribute

객체가 가진 데이터입니다.

### 메서드 method

객체가 수행하는 동작입니다.

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def introduce(self):
        print(f"{self.name}의 점수는 {self.score}점입니다.")
```

```python
student = Student("Jinseong", 95)
student.introduce()
```

여기서:

- `name`, `score`는 속성
- `introduce()`는 메서드입니다

## `__init__`과 `self`

### `__init__`

객체가 생성될 때 자동으로 호출되는 초기화 메서드입니다.

```python
def __init__(self, name, score):
    self.name = name
    self.score = score
```

### `self`

현재 객체 자기 자신을 가리킵니다.

초보자는 `self`가 낯설지만, 실제로는 `이 객체의 속성에 접근하기 위한 표기`라고 이해하면 됩니다.

```python
self.name
self.score
```

## 클래스가 유용한 상황

### 1. 관련 데이터와 동작이 함께 움직일 때

```python
class Order:
    def __init__(self, product_name, quantity, unit_price):
        self.product_name = product_name
        self.quantity = quantity
        self.unit_price = unit_price

    def total_price(self):
        return self.quantity * self.unit_price
```

이 구조는:

- 주문 데이터
- 총액 계산 로직

을 한 곳에 묶습니다.

### 2. 같은 구조의 객체를 여러 개 만들 때

학생, 고객, 주문처럼 비슷한 형태의 개체가 여러 개 생긴다면 클래스가 코드 중복을 줄여 줍니다.

### 3. 상태를 중심으로 동작을 묶고 싶을 때

함수만 사용하면 매번 관련 값을 별도로 전달해야 하지만, 클래스는 상태를 내부에 보관하고 메서드가 그 상태를 사용합니다.

## 클래스가 필요하지 않은 상황

모든 문제를 클래스로 풀 필요는 없습니다.

### 함수 중심 구조가 더 좋은 경우

- 단순 계산
- 짧은 스크립트
- 상태를 오래 보관할 필요가 없는 경우

### 딕셔너리만으로 충분한 경우

- 임시 레코드 하나를 담는 경우
- 구조가 매우 단순한 경우

### `dataclass`가 더 적합한 경우

데이터 보관이 주목적이라면 `dataclass`가 더 간결할 수 있습니다.

```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    score: int
```

## 클래스와 함수의 차이를 감으로 이해하기

### 함수 중심

```python
def calc_total_price(quantity, unit_price):
    return quantity * unit_price
```

### 클래스 중심

```python
class Order:
    def __init__(self, quantity, unit_price):
        self.quantity = quantity
        self.unit_price = unit_price

    def total_price(self):
        return self.quantity * self.unit_price
```

둘 다 맞습니다. 다만:

- 상태가 한 번 계산하고 끝나는가 -> 함수
- 상태가 객체로서 계속 살아 있는가 -> 클래스

라는 기준으로 보면 선택이 쉬워집니다.

## 실무에서 자주 하는 실수

### 1. 모든 것을 클래스로 만들기

작은 스크립트까지 무리하게 객체지향 구조로 만들면 오히려 읽기 어려워집니다.

### 2. 속성과 메서드의 책임이 불분명함

무엇이 데이터이고 무엇이 동작인지 섞이면 코드가 복잡해집니다.

### 3. 클래스 이름은 있는데 실제로는 딕셔너리처럼만 사용

구조만 있고 행위가 없으면 정말 클래스가 필요한지 다시 생각해 볼 수 있습니다.

### 4. 공용으로 쓰이는 가변 값을 클래스 변수로 두는 실수

이 경우 인스턴스 간 상태가 의도치 않게 공유될 수 있습니다.

## 추천 예제

```python
class Report:
    def __init__(self, title, row_count):
        self.title = title
        self.row_count = row_count

    def summary(self):
        return f"{self.title} 보고서에는 {self.row_count}개의 행이 있습니다."


report = Report("매출", 120)
print(report.summary())
```

이 예제는:

- 보고서 제목과 행 수라는 상태
- 요약 문장을 만드는 동작

을 함께 묶은 간단한 객체 예시입니다.

## 정리

이번 페이지의 핵심은 다음입니다.

- 클래스는 설계도, 객체는 실제 인스턴스입니다.
- 속성은 데이터, 메서드는 동작입니다.
- 클래스는 강력하지만 모든 문제의 기본 해답은 아닙니다.

함수와 클래스 중 무엇이 더 자연스러운지 판단하는 감각이 생기면, 이후 프로젝트 구조를 설계할 때 훨씬 안정적으로 선택할 수 있습니다.
