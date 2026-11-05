## 학습 목표

- `datetime`, `math`, `random`, `secrets`, `os`, `pathlib`의 역할을 구분할 수 있습니다.
- 날짜 계산, 수치 계산, 난수 생성, 파일 시스템 탐색에 맞는 표준 라이브러리를 선택할 수 있습니다.
- 표준 라이브러리만으로도 자동화와 전처리의 상당 부분을 처리할 수 있다는 감각을 익힐 수 있습니다.
- 언제 `os`를 쓰고 언제 `pathlib`를 쓰는 것이 더 읽기 좋은지 판단할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `datetime`: 표준 라이브러리
- `math`: 표준 라이브러리
- `random`: 표준 라이브러리
- `secrets`: 표준 라이브러리
- `os`: 표준 라이브러리
- `pathlib`: 표준 라이브러리

## 왜 이 라이브러리들을 함께 배울까

Python 입문을 지나면 "문법"보다 "어떤 도구를 꺼내 쓸 것인가"가 더 중요해집니다.

예를 들어 실무에서 자주 만나는 질문은 이런 것들입니다.

- 오늘 기준 7일 뒤 날짜는?
- 소수점 올림과 내림은 어떻게 할까?
- 샘플 데이터를 무작위로 뽑고 싶다
- 파일이 실제로 존재하는지 확인하고 싶다
- 폴더 안의 CSV 파일만 모으고 싶다

이런 작업은 외부 라이브러리 없이도 표준 라이브러리만으로 상당 부분 해결할 수 있습니다.

## `datetime`: 날짜와 시간 처리

날짜와 시간은 문자열로 다루기 시작하면 금방 복잡해집니다.  
가능하면 `datetime` 객체로 바꿔서 계산하는 편이 안전합니다.

```python
from datetime import datetime, timedelta

today = datetime.today()
next_week = today + timedelta(days=7)

print(today)
print(next_week)
```

여기서 핵심은 아래 두 가지입니다.

- `datetime`: 날짜와 시간 정보 자체를 담는 객체
- `timedelta`: 날짜 간 차이, 날짜 이동에 사용하는 객체

### 문자열 포맷 바꾸기: `strftime`

```python
from datetime import datetime

now = datetime.now()
formatted = now.strftime("%Y-%m-%d %H:%M:%S")
print(formatted)
```

자주 쓰는 포맷 코드는 다음과 같습니다.

- `%Y`: 4자리 연도
- `%m`: 월
- `%d`: 일
- `%H`: 시
- `%M`: 분
- `%S`: 초

### 문자열을 날짜로 바꾸기: `strptime`

```python
from datetime import datetime

text = "2026-06-23"
date_obj = datetime.strptime(text, "%Y-%m-%d")
print(date_obj)
```

실무에서는 CSV에서 읽은 날짜 문자열을 바로 비교하지 말고, 먼저 날짜 객체로 변환하는 습관이 중요합니다.

### 날짜 계산

```python
from datetime import datetime, timedelta

start = datetime.strptime("2026-06-01", "%Y-%m-%d")
end = datetime.strptime("2026-06-23", "%Y-%m-%d")

diff = end - start
print(diff.days)
```

이 방식이 중요한 이유는 문자열 비교보다 훨씬 안전하기 때문입니다.

## `math`: 수치 계산 보조 함수

기본 사칙연산은 Python 문법만으로도 되지만, 수학 함수는 `math` 모듈을 자주 사용합니다.

```python
import math

print(math.sqrt(16))
print(math.pow(2, 3))
print(math.ceil(3.2))
print(math.floor(3.8))
print(math.trunc(3.8))
```

각 함수의 의미는 다음과 같습니다.

- `sqrt`: 제곱근
- `pow`: 거듭제곱
- `ceil`: 올림
- `floor`: 내림
- `trunc`: 소수점 이하 버림

### 부동소수점 비교: `isclose`

실수 계산은 사람이 기대하는 값과 아주 조금 다를 수 있습니다.

```python
import math

result = 0.1 + 0.2
print(result)
print(math.isclose(result, 0.3))
```

왜 이런 문제가 생기나:

- 컴퓨터가 10진 소수를 2진수로 정확히 표현하지 못하는 경우가 있음

실무에서 언제 문제되나:

- 금액 계산
- 임계값 비교
- QAQC에서 허용 오차 판정

대안:

- `==` 대신 `math.isclose()` 사용
- 더 엄격한 금액 계산은 `decimal` 고려

## `random`: 일반적인 난수 생성

`random`은 샘플링, 시뮬레이션, 연습용 데이터 생성에 자주 씁니다.

```python
import random

print(random.randint(1, 10))
print(random.choice(["apple", "banana", "orange"]))
print(random.sample([1, 2, 3, 4, 5], 3))
```

자주 쓰는 함수:

- `randint(a, b)`: 정수 하나
- `choice(seq)`: 항목 하나 선택
- `sample(seq, k)`: 중복 없이 여러 개 선택
- `shuffle(seq)`: 리스트 자체를 섞음
- `choices(seq, k=n)`: 복원추출 방식으로 여러 개 선택

### 재현 가능한 난수: `seed`

```python
import random

random.seed(42)
print(random.randint(1, 100))
```

이 방식이 중요한 이유는 실습 자료나 테스트에서 결과를 재현할 수 있기 때문입니다.

## `secrets`: 보안이 필요한 난수

`random`은 일반적인 난수에는 충분하지만, 보안 토큰 같은 용도로는 적절하지 않습니다.

```python
import secrets

token = secrets.token_hex(8)
print(token)
```

언제 문제가 되나:

- 인증 토큰
- 임시 비밀번호
- URL용 비밀 키

대안:

- 일반 샘플링은 `random`
- 보안 목적은 `secrets`

즉, "무작위"라고 다 같은 무작위가 아닙니다.

## `os`: 운영체제와 상호작용

`os`는 운영체제 수준 정보나 환경변수, 폴더 순회 등에 자주 사용합니다.

```python
import os

print(os.getcwd())
print(os.listdir("."))
```

자주 쓰는 기능:

- `os.getcwd()`: 현재 작업 폴더
- `os.listdir(path)`: 폴더 안 파일 목록
- `os.environ`: 환경변수
- `os.walk(path)`: 하위 폴더까지 순회

예를 들어:

```python
import os

for root, dirs, files in os.walk("data"):
    for file in files:
        if file.endswith(".csv"):
            print(root, file)
```

하위 폴더까지 모두 탐색하는 배치 작업에서 매우 유용합니다.

## `pathlib`: 경로를 객체처럼 다루기

최근 Python 코드에서는 `os.path`보다 `pathlib`를 더 선호하는 경우가 많습니다.

```python
from pathlib import Path

base_dir = Path("data")
file_path = base_dir / "sales.csv"

print(file_path.exists())
print(file_path.name)
print(file_path.suffix)
```

왜 `pathlib`가 좋은가:

- 경로 결합이 직관적임
- 문자열 붙이기보다 실수가 적음
- 메서드 이름이 읽기 쉬움

예를 들어 경로 결합은 이렇게 할 수 있습니다.

```python
from pathlib import Path

path = Path("data") / "raw" / "users.csv"
print(path)
```

### 자주 쓰는 `Path` 메서드

- `Path.cwd()`: 현재 작업 폴더
- `exists()`: 존재 여부
- `is_file()`: 파일인지 여부
- `is_dir()`: 폴더인지 여부
- `glob("*.csv")`: 패턴 검색
- `mkdir(parents=True, exist_ok=True)`: 폴더 생성

예를 들어:

```python
from pathlib import Path

output_dir = Path("output")
output_dir.mkdir(parents=True, exist_ok=True)
```

## `os`와 `pathlib`는 어떻게 선택할까

### `pathlib`가 더 좋은 경우

- 파일 경로를 읽기 쉽게 다루고 싶을 때
- 새 코드 작성
- 경로 결합, 존재 여부, 패턴 탐색을 자주 할 때

### `os`가 자주 쓰이는 경우

- 환경변수 접근
- 기존 코드와의 호환
- 운영체제 관련 기능 전반
- `os.walk()` 기반 폴더 순회

즉, 둘 중 하나만 쓰는 것이 아니라 목적에 따라 조합하는 편이 실용적입니다.

## 실무 예제 1: 오늘 날짜로 결과 파일명 만들기

```python
from datetime import datetime
from pathlib import Path

today = datetime.today().strftime("%Y%m%d")
output_path = Path("output") / f"report_{today}.txt"

output_path.parent.mkdir(parents=True, exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    f.write("일일 점검 결과\n")
```

이 패턴은 자동화 리포트, 로그 파일, 일별 백업 파일 생성에 매우 자주 쓰입니다.

## 실무 예제 2: 폴더 안 CSV 파일 개수 세기

```python
from pathlib import Path

data_dir = Path("data")
csv_files = list(data_dir.glob("*.csv"))

print(f"CSV 파일 개수: {len(csv_files)}")
for path in csv_files:
    print(path.name)
```

이 예제는 파일 배치 처리의 시작점으로 매우 자주 사용됩니다.

## 실무 예제 3: 샘플 데이터 만들기

```python
import random

random.seed(42)
scores = [random.randint(60, 100) for _ in range(10)]
print(scores)
```

재현 가능한 실습 자료를 만들 때 `seed`는 특히 유용합니다.

## 추가로 알아두면 좋은 표준 라이브러리

이번 페이지의 핵심은 아니지만, 표준 라이브러리를 확장해서 보면 아래도 자주 사용합니다.

- `collections.Counter`: 빈도 계산
- `collections.defaultdict`: 키 초기화 자동화
- `decimal.Decimal`: 금액처럼 정밀도가 중요한 계산

즉, 외부 라이브러리 없이도 Python 표준 라이브러리만으로 꽤 많은 작업을 처리할 수 있습니다.

## 정리

- 날짜 계산은 문자열이 아니라 `datetime` 객체로 처리하는 편이 안전합니다.
- 수치 계산 보조 함수는 `math`가 기본입니다.
- 일반 난수는 `random`, 보안 목적 난수는 `secrets`를 사용합니다.
- 파일 경로 처리는 새 코드라면 `pathlib`가 특히 읽기 좋습니다.
- 표준 라이브러리를 잘 쓰면 자동화와 전처리의 기초 체력을 빠르게 올릴 수 있습니다.
