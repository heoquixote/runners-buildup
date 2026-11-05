## 학습 목표

- `numpy`가 왜 데이터 분석의 기초 체력인지 설명할 수 있습니다.
- Python 리스트와 `ndarray`의 차이를 구조와 연산 방식 관점에서 구분할 수 있습니다.
- 배열 생성, 형태 확인, 인덱싱, 불리언 인덱싱, 브로드캐스팅, 축 기반 집계를 수행할 수 있습니다.
- `view`와 `copy` 차이를 이해해 원본 데이터가 의도치 않게 바뀌는 문제를 피할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `numpy`: 외부 라이브러리

## 왜 `numpy`가 중요한가

데이터 분석에서 중요한 전환점 중 하나는 "값 하나씩 처리하는 사고"에서 "배열 전체를 한 번에 처리하는 사고"로 넘어가는 것입니다.

예를 들어 Python 리스트는 이렇게 다루기 쉽습니다.

```python
scores = [10, 20, 30, 40]
```

하지만 데이터 분석에서는 다음 같은 작업이 훨씬 많습니다.

- 모든 값에 같은 보정값 더하기
- 여러 센서 값을 한 번에 정규화하기
- 행렬 곱으로 특성 변환하기
- 조건에 맞는 값만 빠르게 추출하기

이럴 때 `numpy`는 매우 강력합니다.  
핵심은 단순히 "빠르다"가 아니라, "배열 전체를 한 번에 계산하는 사고방식"을 제공한다는 점입니다.

## 설치와 import

`numpy`는 Python 표준 라이브러리가 아닙니다.  
즉, 별도 설치가 필요한 외부 라이브러리입니다.

```bash
python -m pip install numpy
```

보통은 아래처럼 `np`라는 별칭으로 import합니다.

```python
import numpy as np

print(np.__version__)
```

## `ndarray`란 무엇인가

`numpy`의 핵심 객체는 `ndarray`입니다.

- `n-dimensional array`
- 같은 타입 데이터를 효율적으로 담는 배열 객체

예를 들어:

```python
import numpy as np

arr = np.array([1, 2, 3, 4])
print(type(arr))
```

이 객체는 단순한 리스트가 아니라, 배열 연산에 최적화된 자료구조입니다.

## 리스트와 배열의 차이

### Python 리스트

- 서로 다른 타입도 함께 담을 수 있음
- 유연하지만 수치 계산용 구조는 아님

```python
data = [1, "hello", 3.14]
```

### NumPy 배열

- 같은 타입 데이터를 다루는 데 적합
- 수치 계산, 벡터 연산, 행렬 연산에 강함

```python
arr = np.array([1, 2, 3, 4])
```

예를 들어 리스트는 `* 2`를 하면 반복이 됩니다.

```python
values = [1, 2, 3]
print(values * 2)
```

결과:

```python
[1, 2, 3, 1, 2, 3]
```

반면 배열은 원소별 곱셈이 됩니다.

```python
arr = np.array([1, 2, 3])
print(arr * 2)
```

결과:

```python
[2 4 6]
```

즉, `numpy`는 데이터 분석에서 기대하는 수치 계산 방식에 훨씬 자연스럽습니다.

## 배열 만들기

가장 기본은 `np.array()`입니다.

```python
import numpy as np

arr = np.array([1, 2, 3, 4])
matrix = np.array([[1, 2], [3, 4]])
```

### 자주 쓰는 생성 함수

```python
import numpy as np

zeros = np.zeros((2, 3))
ones = np.ones((2, 2))
full = np.full((2, 2), 7)
empty = np.empty((2, 3))
identity = np.identity(3)
eye = np.eye(3)
```

각 함수의 의미는 다음과 같습니다.

- `zeros`: 0으로 채운 배열
- `ones`: 1로 채운 배열
- `full`: 특정 값으로 채운 배열
- `empty`: 초기화되지 않은 값이 들어갈 수 있는 배열
- `identity`, `eye`: 단위행렬 생성

`empty`는 빠르게 메모리만 잡는 개념이므로, 처음 배우는 단계에서는 값이 예측되지 않을 수 있다는 점을 기억하면 충분합니다.

## 무작위 배열 만들기

연습 데이터나 시뮬레이션에 자주 사용합니다.

```python
import numpy as np

print(np.random.rand(2, 3))
print(np.random.randn(2, 3))
print(np.random.randint(1, 10, size=(2, 3)))
```

차이는 다음과 같습니다.

- `rand`: 0과 1 사이 균등분포
- `randn`: 평균 0, 표준편차 1의 정규분포
- `randint`: 정수 난수

## 배열의 기본 속성 보기

배열을 만들었다면 먼저 구조를 보는 습관이 중요합니다.

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.shape)
print(arr.ndim)
print(arr.size)
print(arr.dtype)
```

각 속성의 의미:

- `shape`: 각 차원의 길이
- `ndim`: 차원 수
- `size`: 전체 원소 수
- `dtype`: 데이터 타입

분석에서 실수하기 쉬운 부분은 값만 보는 것입니다.  
배열은 구조가 중요하므로 `shape`를 먼저 확인하는 습관이 매우 중요합니다.

## `np.array`와 `np.asarray`

둘 다 배열로 바꿔 주지만 차이가 있습니다.

```python
import numpy as np

lst = [1, 2, 3]
a = np.array(lst)
b = np.asarray(lst)
```

입문 단계에서는 아래 정도로 이해하면 충분합니다.

- `np.array`: 새 배열을 만든다는 의도가 강함
- `np.asarray`: "이미 배열이면 굳이 복사하지 않고 쓰겠다"는 성격이 있음

실무에서는 불필요한 복사를 줄이는 데 도움이 될 수 있습니다.

## 인덱싱과 슬라이싱

배열도 기본 인덱싱 개념은 리스트와 비슷합니다.

```python
arr = np.array([10, 20, 30, 40, 50])

print(arr[0])
print(arr[-1])
print(arr[1:4])
```

2차원 배열에서는 행과 열을 함께 지정합니다.

```python
matrix = np.array([[1, 2, 3], [4, 5, 6]])

print(matrix[0, 1])
print(matrix[:, 1])
print(matrix[1, :])
```

이 문법은 이후 `pandas`, 이미지 처리, 머신러닝 데이터 전처리까지 이어집니다.

## 불리언 인덱싱

조건에 맞는 값만 골라내는 방식으로, 데이터 분석에서 매우 중요합니다.

```python
arr = np.array([10, 20, 30, 40, 50])
mask = arr >= 30

print(mask)
print(arr[mask])
```

이 방식이 좋은 이유는 반복문보다 표현력이 좋고, 배열 중심 사고와 잘 맞기 때문입니다.

실무 예시:

- 기준치 이상 센서 값만 추출
- 결측치가 아닌 값만 선택
- 이상치 후보만 점검

## 원소별 연산

`numpy`는 배열 전체에 연산을 한 번에 적용할 수 있습니다.

```python
arr = np.array([1, 2, 3, 4])

print(arr + 10)
print(arr * 2)
print(arr ** 2)
```

두 배열 간 연산도 원소별로 수행됩니다.

```python
a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

print(a + b)
print(a * b)
```

이 방식은 데이터 정규화, 보정, 스케일링, 피처 엔지니어링에서 매우 자주 쓰입니다.

## 축 기준 집계: `axis`

배열 연산에서는 "어느 방향으로 계산할 것인가"가 중요합니다.

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.sum())
print(arr.sum(axis=0))
print(arr.sum(axis=1))
```

해석:

- `sum()`: 전체 합
- `axis=0`: 열 방향 집계
- `axis=1`: 행 방향 집계

처음에는 이 부분이 헷갈리기 쉬운데, "축을 따라 접는다"는 감각으로 익히면 도움이 됩니다.

## 브로드캐스팅

브로드캐스팅은 크기가 다른 배열끼리도 규칙에 맞으면 연산할 수 있게 해 주는 개념입니다.

```python
arr = np.array([1, 2, 3, 4])
print(arr * 10)
```

스칼라와 배열 간 연산뿐 아니라, 일부 차원이 맞으면 확장되어 계산되기도 합니다.

```python
matrix = np.array([[1, 2, 3], [4, 5, 6]])
bias = np.array([10, 20, 30])

print(matrix + bias)
```

왜 중요한가:

- 반복문 없이 열 단위 보정 가능
- 전처리 코드가 짧고 빠름

언제 문제가 되나:

- shape를 정확히 모르고 연산하면 예상과 다른 결과가 나올 수 있음

대안:

- 연산 전 `shape` 확인
- 필요하면 `reshape()`로 명시적 구조 조정

## 행렬 곱

원소별 곱셈과 행렬 곱셈은 다릅니다.

```python
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

print(a * b)
print(a @ b)
```

차이:

- `*`: 원소별 곱셈
- `@` 또는 `np.matmul()`: 행렬 곱셈

머신러닝이나 선형대수 기반 계산에서는 이 차이가 매우 중요합니다.

## `view`와 `copy`

NumPy는 메모리 효율을 위해 원본 데이터를 공유하는 경우가 있습니다.

```python
arr = np.array([1, 2, 3, 4, 5])
sub = arr[1:4]
sub[0] = 999

print(arr)
```

왜 이런 일이 생기나:

- 슬라이싱 결과가 복사본이 아니라 원본을 바라보는 뷰일 수 있기 때문

언제 문제되나:

- 일부 전처리를 했는데 원본 데이터까지 함께 바뀌는 경우

대안:

```python
safe_sub = arr[1:4].copy()
```

즉, 원본 보존이 중요하면 `.copy()`를 명시적으로 사용하는 편이 안전합니다.

## 실무 예제: 센서 데이터 보정

```python
import numpy as np

sensor = np.array([98.2, 101.4, 99.8, 102.1, 97.9])
corrected = sensor - 0.5

high_values = corrected[corrected >= 100]

print("보정값:", corrected)
print("임계치 이상:", high_values)
print("평균:", corrected.mean())
```

이 예제에서 중요한 포인트는 아래와 같습니다.

- 배열 전체 보정이 한 줄로 가능함
- 조건 필터링이 직관적임
- 집계까지 한 흐름으로 이어짐

## 실무 예제: 불량률 계산용 배열 연산

```python
import numpy as np

total = np.array([100, 120, 90, 110])
defects = np.array([3, 4, 1, 5])

defect_rate = defects / total * 100

print(defect_rate)
print("평균 불량률:", defect_rate.mean())
```

이런 계산은 Python 리스트만으로도 가능하지만, `numpy`로 작성하면 더 명확하고 이후 확장도 쉽습니다.

## 정리

- `numpy`의 핵심은 빠른 계산 자체보다 `배열 중심 사고방식`입니다.
- `shape`, `dtype`, `axis`는 수시로 확인해야 하는 기본 정보입니다.
- 불리언 인덱싱과 브로드캐스팅은 데이터 분석에서 특히 자주 쓰입니다.
- 슬라이싱 결과가 `view`인지 `copy`인지 모르면 원본 훼손 문제가 생길 수 있습니다.
- 이후 `pandas`, `matplotlib`, 머신러닝 라이브러리를 이해하는 데 `numpy` 감각이 큰 기반이 됩니다.
