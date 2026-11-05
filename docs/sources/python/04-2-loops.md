## 학습 목표

- `for`와 `while`의 차이를 설명할 수 있습니다.
- 반복문 안에서 누적, 필터링, 변환 패턴을 구현할 수 있습니다.
- 무한 루프나 불필요한 중첩 반복을 피할 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: 없음
- 외부 라이브러리: 없음

## 왜 반복문이 중요한가

프로그램은 같은 작업을 한 번만 하는 경우보다 여러 번 처리하는 경우가 훨씬 많습니다.

- 여러 줄의 CSV 데이터 읽기
- 여러 고객 레코드 순회
- 여러 파일 처리
- 조건이 만족될 때까지 반복 실행

반복문은 이런 작업을 자동화하는 가장 기본적인 문법입니다.

## `for` 반복문

`for`는 `반복 가능한 객체`를 하나씩 순회할 때 사용합니다.

```python
numbers = [10, 20, 30]

for num in numbers:
    print(num)
```

여기서 `numbers`는 리스트이고, `num`은 매 반복마다 하나씩 꺼낸 값입니다.

## `range()`와 함께 쓰기

숫자 범위를 반복하고 싶을 때는 `range()`를 많이 사용합니다.

```python
for i in range(5):
    print(i)
```

출력은 `0, 1, 2, 3, 4`입니다.

### `range(start, stop, step)`

```python
for i in range(1, 10, 2):
    print(i)
```

- 시작값 포함
- 끝값 미포함
- 증가 간격 지정 가능

## `while` 반복문

`while`은 조건이 참인 동안 반복합니다.

```python
count = 0

while count < 3:
    print(count)
    count += 1
```

`for`가 `정해진 대상을 순회`하는 데 강하다면, `while`은 `조건이 바뀔 때까지 반복`하는 데 적합합니다.

## `for`와 `while`의 차이

### `for`가 적합한 경우

- 리스트, 튜플, 문자열 순회
- 반복 횟수가 대체로 정해져 있을 때
- 데이터 컬렉션 전체를 처리할 때

### `while`이 적합한 경우

- 사용자 입력이 올바를 때까지 반복
- 특정 상태가 될 때까지 반복
- 종료 조건이 실행 중에 결정될 때

## 반복문의 대표 패턴

### 1. 누적

```python
numbers = [10, 20, 30, 40]
total = 0

for num in numbers:
    total += num

print(total)
```

합계, 평균, 개수 계산의 기본 패턴입니다.

### 2. 필터링

```python
numbers = [3, 8, 11, 14, 17]
even_numbers = []

for num in numbers:
    if num % 2 == 0:
        even_numbers.append(num)

print(even_numbers)
```

특정 조건에 맞는 값만 골라내는 패턴입니다.

### 3. 변환

```python
prices = [1000, 2000, 3000]
prices_with_tax = []

for price in prices:
    prices_with_tax.append(price * 1.1)

print(prices_with_tax)
```

원본 값을 다른 값으로 바꾸어 새 결과를 만드는 패턴입니다.

## `enumerate()`로 인덱스와 값 함께 받기

```python
fruits = ["apple", "banana", "orange"]

for idx, fruit in enumerate(fruits):
    print(idx, fruit)
```

리스트를 순회하면서 번호도 함께 보고 싶을 때 매우 유용합니다.

## `break`와 `continue`

### `break`

반복을 즉시 종료합니다.

```python
for num in [1, 2, 3, 4, 5]:
    if num == 3:
        break
    print(num)
```

### `continue`

이번 반복만 건너뛰고 다음 반복으로 넘어갑니다.

```python
for num in [1, 2, 3, 4, 5]:
    if num == 3:
        continue
    print(num)
```

실무에서는 잘못된 행 건너뛰기, 특정 조건 제외, 조기 종료 등에 자주 씁니다.

## 무한 루프 주의

`while`에서 조건이 바뀌지 않으면 무한 루프가 됩니다.

```python
# while True:
#     print("끝나지 않음")
```

무한 루프 자체가 항상 나쁜 것은 아니지만, 종료 조건이 명확해야 합니다.

예:

```python
while True:
    answer = input("종료하려면 q 입력: ")
    if answer == "q":
        break
```

## 중첩 반복문

반복문 안에 또 반복문을 넣을 수 있습니다.

```python
for i in range(3):
    for j in range(2):
        print(i, j)
```

이 방식은 표 형태 데이터, 조합 생성, 2차원 구조 순회에 유용합니다.

하지만 실무에서는 중첩 반복이 많아질수록:

- 성능이 떨어질 수 있고
- 가독성이 낮아질 수 있습니다

특히 데이터 양이 클 때는 `pandas`, `set`, `dict` 기반 접근이 더 적절할 수도 있습니다.

## 실무에서 자주 만나는 반복 문제

### 파일 여러 개 처리

```python
file_names = ["a.csv", "b.csv", "c.csv"]

for file_name in file_names:
    print(f"{file_name} 처리 중")
```

### 입력 검증 반복

```python
while True:
    value = input("숫자를 입력하세요: ")
    if value.isdigit():
        break
    print("숫자만 입력해주세요.")
```

### 데이터 집계

```python
sales = [120000, 90000, 150000]
high_sales_count = 0

for amount in sales:
    if amount >= 100000:
        high_sales_count += 1

print(high_sales_count)
```

## 자주 하는 실수

### 1. 반복 변수 이름을 너무 모호하게 짓기

```python
for x in data:
    ...
```

간단한 예제에서는 괜찮지만, 실제 코드에서는 `user`, `row`, `file_name`처럼 의미 있는 이름이 더 좋습니다.

### 2. `while`에서 조건 갱신을 빼먹기

카운터 증가나 상태 변경이 없으면 무한 루프가 됩니다.

### 3. 리스트를 순회하면서 동시에 구조를 과하게 바꾸기

반복 대상 자체를 순회 중에 수정하면 예상 밖 동작이 생길 수 있습니다.

### 4. 중첩 반복을 습관적으로 쓰기

문제가 자료구조 선택으로 더 쉽게 풀리는 경우도 많습니다.

## 추천 예제

```python
orders = [12000, 18000, 9000, 25000]
filtered_orders = []
total = 0

for order in orders:
    if order >= 10000:
        filtered_orders.append(order)
        total += order

print(filtered_orders)
print(total)
```

이 예제에는 반복, 필터링, 누적이 함께 들어 있습니다. 실무 데이터 처리의 가장 기본 패턴입니다.

## 정리

이번 페이지의 핵심은 다음입니다.

- `for`는 순회 대상이 있을 때
- `while`은 조건 기반 반복이 필요할 때
- 반복문 안에서는 누적, 필터링, 변환 패턴이 반복적으로 등장합니다

반복문을 익히면 이후 컴프리헨션, 파일 처리, 데이터 전처리, 자동화 스크립트가 훨씬 자연스럽게 느껴집니다.
