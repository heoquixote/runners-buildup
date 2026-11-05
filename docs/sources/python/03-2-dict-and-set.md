## 학습 목표

- 딕셔너리와 집합의 역할을 설명할 수 있습니다.
- 키 기반 조회와 중복 제거 문제에 맞는 구조를 선택할 수 있습니다.
- 실무 데이터 레코드를 딕셔너리로 표현하는 감각을 익힐 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: 없음
- 외부 라이브러리: 없음

## 왜 딕셔너리와 집합이 중요한가

리스트는 순서가 있는 데이터를 다루는 데 좋지만, 모든 문제를 순서로 해결할 수는 없습니다.

실무에서는 더 자주 이런 문제가 등장합니다.

- 고객 ID로 고객 정보를 찾고 싶다
- 컬럼 이름으로 값을 가져오고 싶다
- 중복된 값을 제거하고 싶다
- 어떤 값이 포함되어 있는지 빠르게 확인하고 싶다

이때 핵심이 되는 자료구조가 딕셔너리와 집합입니다.

## 딕셔너리 `dict`

딕셔너리는 `키(key)와 값(value)`의 쌍으로 이루어진 자료구조입니다.

```python
user = {
    "name": "Jinseong",
    "age": 30,
    "city": "Seoul",
}
```

리스트가 `순서`로 값을 찾는다면, 딕셔너리는 `이름`으로 값을 찾습니다.

```python
print(user["name"])
print(user["age"])
```

## 딕셔너리가 잘 맞는 상황

- 한 레코드 안에 의미가 다른 값이 여러 개 있을 때
- 컬럼명 기반으로 값을 다룰 때
- 설정값이나 옵션을 묶을 때
- 빠른 조회가 필요할 때

예를 들어 학생 정보를 리스트로 표현하면:

```python
student = ["Kim", 95, "Seoul"]
```

각 위치의 의미를 기억해야 합니다.

반면 딕셔너리는:

```python
student = {
    "name": "Kim",
    "score": 95,
    "city": "Seoul",
}
```

이렇게 쓰면 읽는 순간 의미가 드러납니다.

## 딕셔너리 기본 조작

### 값 조회

```python
user = {"name": "Jinseong", "age": 30}
print(user["name"])
```

### 값 추가와 수정

```python
user["job"] = "Data Analyst"
user["age"] = 31
```

### 값 삭제

```python
del user["job"]
```

## `get()`을 쓰는 이유

딕셔너리에서 없는 키에 바로 접근하면 오류가 납니다.

```python
# print(user["email"])  # KeyError
```

이럴 때 `get()`을 쓰면 더 안전합니다.

```python
print(user.get("email"))
print(user.get("email", "없음"))
```

실무에서는 외부 데이터가 항상 완전하지 않기 때문에 `get()`을 많이 사용합니다.

## 딕셔너리 순회

```python
user = {"name": "Jinseong", "age": 30, "city": "Seoul"}

for key in user:
    print(key, user[key])
```

키와 값을 함께 보고 싶다면 `items()`가 더 편합니다.

```python
for key, value in user.items():
    print(key, value)
```

그 외에도:

- `keys()`: 키 목록
- `values()`: 값 목록
- `items()`: 키-값 쌍

## 집합 `set`

집합은 `중복 없는 값들의 모음`입니다.

```python
tags = {"python", "sql", "python", "tableau"}
print(tags)
```

`"python"`이 두 번 들어가도 하나만 남습니다.

## 집합이 잘 맞는 상황

- 중복 제거
- 포함 여부 확인
- 공통 요소/차집합 계산

예:

```python
names = ["Kim", "Lee", "Kim", "Park", "Lee"]
unique_names = set(names)
print(unique_names)
```

## 집합의 장점: 빠른 포함 여부 확인

```python
valid_codes = {"A01", "A02", "B10"}

print("A01" in valid_codes)
print("Z99" in valid_codes)
```

대량 데이터에서 포함 여부를 반복 확인할 때 리스트보다 집합이 훨씬 유리한 경우가 많습니다.

## 집합 연산

```python
a = {"python", "sql", "tableau"}
b = {"sql", "python", "ml"}

print(a | b)  # 합집합
print(a & b)  # 교집합
print(a - b)  # 차집합
```

실무에서 유용한 예:

- 두 시스템에 공통으로 있는 고객 찾기
- 새로 추가된 코드 찾기
- 제거된 항목 찾기

## 딕셔너리와 집합의 차이

- 딕셔너리: `키 -> 값` 매핑
- 집합: `값 자체의 모음`

쉽게 말하면:

- `고객 ID로 고객 정보 찾기` -> 딕셔너리
- `중복 고객 ID 제거하기` -> 집합

## 실무에서 자주 하는 실수

### 1. 딕셔너리 키가 항상 존재한다고 가정

외부 데이터는 누락이 자주 있습니다. `[]` 접근보다 `get()`이 더 안전한 경우가 많습니다.

### 2. 집합은 순서가 없다는 점을 잊음

집합은 중복 제거에는 좋지만, 입력 순서 자체가 중요한 문제에는 적합하지 않습니다.

### 3. 리스트로도 가능한 일을 무조건 딕셔너리로 바꾸지 않기

자료구조는 문제에 맞춰 선택해야 합니다. 예를 들어 단순 순차 데이터는 리스트가 더 자연스럽습니다.

## 추천 예제

### 딕셔너리 예제

```python
employee = {
    "name": "Heo",
    "department": "BI",
    "salary": 5500,
}

print(employee["department"])
employee["salary"] = 6000
print(employee)
```

### 집합 예제

```python
visited_pages = ["home", "about", "home", "contact", "about"]
unique_pages = set(visited_pages)

print(unique_pages)
print("home" in unique_pages)
```

## 정리

이번 페이지의 핵심은 다음입니다.

- 딕셔너리는 이름으로 조회하는 구조입니다.
- 집합은 중복 제거와 포함 여부 확인에 강합니다.
- 어떤 자료구조를 쓰느냐에 따라 코드의 읽기 쉬움과 성능이 달라질 수 있습니다.

이 개념이 익숙해지면 이후 JSON, API 응답, 설정값, 데이터 전처리 코드를 훨씬 자연스럽게 읽을 수 있습니다.
