## 학습 목표

- `Series`와 `DataFrame`의 차이를 설명할 수 있습니다.
- `read_csv`, `read_excel`로 데이터를 읽고 기본 구조를 빠르게 탐색할 수 있습니다.
- 열 선택, 행 선택, 조건 필터링, 정렬, 새 컬럼 생성의 기본 흐름을 익힐 수 있습니다.
- `loc`, `iloc`, `dtypes`, `info()`를 통해 초반 데이터 점검을 체계적으로 수행할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `pandas`: 외부 라이브러리
- `numpy`: 외부 라이브러리

## 왜 `pandas`를 배우는가

데이터 분석에서 자주 만나는 입력은 대부분 표 형태입니다.

- CSV
- Excel
- SQL 조회 결과
- 로그 집계 결과
- 업무 시스템 추출 데이터

이런 데이터를 Python에서 가장 널리 다루는 도구가 `pandas`입니다.

엑셀처럼 보이지만 실제로는 더 강력합니다.

- 타입 정보를 유지할 수 있음
- 필터링과 집계가 코드로 재현 가능함
- 전처리 과정을 문서화하고 반복 실행할 수 있음

즉, `pandas`는 "분석용 테이블 조작 도구"라고 생각하면 좋습니다.

## 설치와 import

`pandas`는 표준 라이브러리가 아니므로 별도 설치가 필요합니다.

```bash
python -m pip install pandas
```

보통은 아래처럼 import합니다.

```python
import pandas as pd
```

새 컬럼 생성이나 조건 분기에서 `numpy`를 함께 쓰는 경우도 많습니다.

```python
import numpy as np
import pandas as pd
```

## 핵심 데이터 구조

### `Series`

1차원 데이터 구조입니다.

```python
import pandas as pd

s = pd.Series([10, 20, 30], name="score")
print(s)
```

한 개의 열처럼 생각하면 이해하기 쉽습니다.

### `DataFrame`

2차원 테이블 구조입니다.

```python
import pandas as pd

df = pd.DataFrame(
    {
        "name": ["김철수", "이영희", "박민수"],
        "age": [25, 30, 35],
        "city": ["서울", "부산", "대구"],
    }
)

print(df)
```

실무에서 대부분의 분석 작업은 결국 `DataFrame` 중심으로 이루어집니다.

## 데이터를 읽어오는 함수

### CSV 읽기

```python
df = pd.read_csv("data.csv", encoding="utf-8")
```

### Excel 읽기

```python
df = pd.read_excel("sales.xlsx", sheet_name="Sheet1")
```

자주 쓰는 옵션:

- `encoding`: 한글 CSV 인코딩 처리
- `sep`: 구분자 지정
- `header`: 헤더 위치 지정
- `index_col`: 특정 컬럼을 인덱스로 지정
- `na_values`: 특정 문자열을 결측치로 처리

예를 들어:

```python
df = pd.read_csv(
    "users.csv",
    encoding="utf-8",
    sep=",",
    na_values=["NA", "NULL", "-"],
)
```

실무에서 중요한 포인트는 "불러오기 성공"이 끝이 아니라는 점입니다.  
불러온 직후 구조와 타입이 기대와 맞는지 반드시 확인해야 합니다.

## 처음 데이터를 받으면 가장 먼저 볼 것들

### `shape`

```python
print(df.shape)
```

행과 열의 개수를 확인합니다.

- 예상보다 행 수가 적으면 필터가 잘못 적용되었을 수 있음
- 열 수가 다르면 구분자나 헤더 인식이 잘못되었을 수 있음

### `columns`

```python
print(df.columns)
```

컬럼명 오타, 공백, 예상치 못한 접두/접미가 있는지 점검합니다.

### `index`

```python
print(df.index)
```

인덱스가 기본 숫자인지, 특정 컬럼이 인덱스로 들어갔는지 확인합니다.

### `dtypes`

```python
print(df.dtypes)
```

왜 중요한가:

- 숫자여야 할 컬럼이 문자열로 들어오는 경우가 많음
- 날짜 컬럼이 문자열이면 시계열 연산이 불편해짐

언제 문제되나:

- 정렬이 숫자처럼 안 됨
- 평균 계산이 안 됨
- 날짜 파생 컬럼 생성이 안 됨

### `head()`, `tail()`

```python
print(df.head())
print(df.tail())
```

앞과 뒤를 함께 보면 데이터 품질을 더 입체적으로 확인할 수 있습니다.

### `info()`

```python
df.info()
```

`info()`는 매우 중요합니다.  
단순 미리보기보다 더 많은 정보를 줍니다.

- 각 컬럼의 non-null 개수
- 데이터 타입
- 메모리 사용량

즉, `head()`만 보는 습관은 부족하고, `info()`까지 봐야 데이터 진단이 제대로 시작됩니다.

### `describe()`

```python
print(df.describe())
```

숫자형 컬럼의 요약 통계를 확인합니다.

- 평균
- 표준편차
- 최소/최대
- 사분위수

이 정보를 통해 값 범위가 말이 되는지 빠르게 검토할 수 있습니다.

## 컬럼명 다루기

컬럼명을 정리하는 작업은 생각보다 중요합니다.

```python
df.columns = ["name", "age", "city"]
```

또는 일부 컬럼만 바꾸려면:

```python
df = df.rename(columns={"total_bill": "total_sales", "tip": "bonus"})
```

왜 중요한가:

- 공백이 많은 컬럼명은 코드 작성이 불편함
- 한글/영문 혼용이 심하면 팀 작업에서 일관성이 떨어짐

대안:

- 초반에 명시적으로 컬럼명을 정리
- 팀 규칙에 맞춰 snake_case 등으로 통일

## 열 선택

### 한 개 컬럼 선택

```python
print(df["age"])
```

결과는 `Series`입니다.

### 여러 컬럼 선택

```python
print(df[["name", "age"]])
```

결과는 `DataFrame`입니다.

하나 선택할 때와 여러 개 선택할 때 괄호 구조가 다르므로 처음에 자주 헷갈릴 수 있습니다.

## 행 선택: `loc`와 `iloc`

### `loc`

라벨 기반 선택입니다.

```python
print(df.loc[0])
print(df.loc[0:2, ["name", "age"]])
```

### `iloc`

위치 기반 선택입니다.

```python
print(df.iloc[0])
print(df.iloc[0:3, 0:2])
```

이 둘의 차이는 실무에서도 매우 중요합니다.

- `loc`: 인덱스 이름 기준
- `iloc`: 순서 번호 기준

특히 인덱스를 재설정하거나 특정 컬럼을 인덱스로 두는 경우 혼동하기 쉽습니다.

## 조건 필터링

### 단일 조건

```python
adult_df = df[df["age"] >= 30]
```

### 여러 조건 결합

```python
filtered = df[(df["age"] >= 30) & (df["city"] == "서울")]
```

주의할 점:

- 조건마다 괄호를 둘러싸는 편이 안전함
- Python의 `and`, `or` 대신 `&`, `|`를 사용

### `isin`

```python
selected = df[df["city"].isin(["서울", "부산"])]
```

목록 기반 필터링에 매우 자주 쓰입니다.

### 결측치 여부

```python
valid_age = df[df["age"].notna()]
missing_age = df[df["age"].isna()]
```

즉, 필터링은 단순 문법이 아니라 "분석 기준을 코드로 표현하는 작업"입니다.

## 인덱스 다루기

### 특정 컬럼을 인덱스로 설정

```python
df = df.set_index("name")
print(df)
```

### 인덱스 초기화

```python
df = df.reset_index()
```

인덱스는 화면상 번호처럼 보여도 실제 분석 흐름에 영향을 줍니다.  
특히 join, selection, export 과정에서 의도한 인덱스인지 점검하는 습관이 좋습니다.

## 새 컬럼 만들기

간단한 계산은 바로 할 수 있습니다.

```python
df["age_plus_10"] = df["age"] + 10
```

조건 기반 분류는 `np.where()`가 자주 쓰입니다.

```python
import numpy as np

df["age_group"] = np.where(df["age"] >= 30, "30대 이상", "20대")
```

왜 이 방식이 편한가:

- 배열 연산 기반이라 빠름
- 조건 분기를 한 줄로 표현 가능

언제 복잡해지나:

- 조건이 여러 겹으로 많아질 때

대안:

- `np.select()`
- `apply()`
- 조건 마스크를 단계별로 분리

## 정렬

```python
sorted_df = df.sort_values("age", ascending=False)
```

여러 컬럼 기준 정렬도 가능합니다.

```python
sorted_df = df.sort_values(["city", "age"], ascending=[True, False])
```

실무에서 자주 하는 실수는 문자열 숫자 컬럼을 정렬하는 경우입니다.  
`dtypes`를 먼저 확인하지 않으면 정렬 결과가 이상하게 보일 수 있습니다.

## 간단한 실습 예제

```python
import numpy as np
import pandas as pd

df = pd.DataFrame(
    {
        "name": ["A", "B", "C", "D"],
        "score": [88, 72, 95, 60],
        "team": ["red", "blue", "red", "blue"],
    }
)

df["grade"] = np.where(df["score"] >= 80, "pass", "fail")

result = df[df["team"] == "red"].sort_values("score", ascending=False)
print(result)
```

이 예제에는 입문 이후 자주 쓰는 흐름이 거의 다 들어 있습니다.

- 데이터 생성
- 새 컬럼 생성
- 조건 필터링
- 정렬

## 처음 분석할 때의 권장 루틴

새로운 파일을 받았다면 아래 순서를 권장합니다.

1. `read_csv` 또는 `read_excel`
2. `shape`, `columns`, `dtypes` 확인
3. `head()`, `tail()`, `info()`, `describe()` 확인
4. 필요한 컬럼명 정리
5. 필터링과 새 컬럼 생성 시작

이 루틴을 익히면 "일단 열어 보고 감으로 진행"하는 습관보다 훨씬 안정적인 분석을 할 수 있습니다.

## 정리

- `pandas`의 핵심 객체는 `Series`와 `DataFrame`입니다.
- 데이터를 읽은 직후에는 `head()`만이 아니라 `shape`, `dtypes`, `info()`까지 함께 봐야 합니다.
- `loc`와 `iloc`, `isin`, `notna`, `sort_values`는 초반에 매우 자주 쓰는 기본 도구입니다.
- 새 컬럼 생성과 필터링은 분석 로직을 코드로 표현하는 시작점입니다.
- 테이블처럼 보이더라도 실제로는 타입과 인덱스를 가진 객체라는 점을 잊지 않는 것이 중요합니다.
