## 학습 목표

- `describe`, `value_counts`, 왜도, 첨도, 상관계수 등을 통해 데이터를 더 입체적으로 탐색할 수 있습니다.
- 결측치와 중복값을 진단하고, 삭제/대체/보간 전략을 상황에 맞게 선택할 수 있습니다.
- `map`, `apply`, `merge`, `concat`, `groupby`를 연결해 실전 전처리 흐름을 구성할 수 있습니다.
- 전처리 과정에서 "왜 이 방법을 선택했는가"를 설명할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `pandas`: 외부 라이브러리
- `numpy`: 외부 라이브러리

## `pandas 기초` 다음 단계에서 중요한 것

기초 단계가 "읽고, 보고, 고르고, 정렬하는 것"이었다면, 실전 단계는 아래 질문으로 넘어갑니다.

- 결측치는 얼마나 많은가
- 분포가 한쪽으로 치우쳐 있는가
- 중복 데이터는 없는가
- 여러 테이블을 어떻게 결합할 것인가
- 그룹별 집계를 어떻게 해석할 것인가

즉, 실전 `pandas`는 문법 암기보다 데이터 상태를 진단하고 정리하는 판단력이 더 중요합니다.

## 기술 통계 다시 보기: `describe()`

```python
print(df.describe())
```

이 함수는 숫자형 컬럼의 기본 요약 통계를 보여 줍니다.

- 개수
- 평균
- 표준편차
- 최소/최대
- 사분위수

추가 백분위를 보고 싶다면:

```python
print(df.describe(percentiles=[0.1, 0.25, 0.5, 0.75, 0.9]))
```

이 정보가 중요한 이유는 단순히 숫자를 보는 것이 아니라 아래를 빠르게 판단하기 위해서입니다.

- 값이 너무 치우쳐 있는가
- 범위가 말이 되는가
- 이상치가 의심되는가

## 범주형 데이터 분포 보기

숫자형 요약만으로는 부족합니다.  
범주형 변수는 빈도 기반으로 보는 것이 중요합니다.

```python
print(df["category"].value_counts())
print(df["category"].value_counts(normalize=True))
```

`normalize=True`를 쓰면 비율로 볼 수 있어 해석이 쉬워집니다.

실무에서 자주 유용한 질문:

- 특정 상태값이 과도하게 많은가
- 클래스 불균형이 심한가
- 데이터 수집 편향이 있는가

## 평균과 중위수는 왜 함께 봐야 하나

```python
print(df["sales"].mean())
print(df["sales"].median())
```

평균과 중위수가 크게 다르면 분포가 비대칭일 가능성이 있습니다.

왜 그런가:

- 평균은 극단값의 영향을 크게 받음
- 중위수는 상대적으로 robust함

언제 문제되나:

- 매출, 소득, 처리 시간처럼 긴 꼬리를 가진 데이터
- 소수의 이상치가 전체 평균을 끌어올리는 데이터

대안:

- 평균만 보지 말고 중위수도 함께 보기
- 박스플롯, 히스토그램으로 분포 확인

## 왜도와 첨도

분포의 모양을 더 정량적으로 보고 싶다면:

```python
print(df["sales"].skew())
print(df["sales"].kurt())
```

해석의 감각:

- `skew()`: 분포가 어느 쪽으로 기울었는가
- `kurt()`: 꼬리와 뾰족함이 어떤가

처음에는 숫자 해석 자체보다 "분포가 대칭적인가 아닌가"를 보는 도구로 이해하면 충분합니다.

## 상관관계 보기

```python
print(df.corr(numeric_only=True))
```

이 값은 변수 간 선형 관계를 빠르게 탐색하는 데 유용합니다.

하지만 매우 중요한 주의점이 있습니다.

- 상관관계가 높다고 인과관계가 있는 것은 아님
- 이상치 하나가 상관계수를 왜곡할 수 있음
- 비선형 관계는 잘 드러나지 않을 수 있음

즉, 상관계수는 탐색 도구이지 결론 자체가 아닙니다.

## 결측치 탐색

결측치는 "있다/없다"보다 "얼마나, 어디에, 어떤 패턴으로 있는가"가 중요합니다.

```python
missing_count = df.isnull().sum()
missing_ratio = (df.isnull().sum() / len(df) * 100).round(2)

print(missing_count)
print(missing_ratio)
```

왜 비율이 중요한가:

- 결측 3개는 적어 보여도 행 수가 10개면 심각함
- 결측 100개도 전체가 100만 건이면 큰 문제가 아닐 수 있음

즉, 개수와 비율을 함께 보는 습관이 중요합니다.

## 결측치 처리 전략

결측치 처리에는 정답 하나가 없습니다.  
데이터 의미와 분석 목적에 따라 선택해야 합니다.

### 1. 삭제: `dropna()`

```python
df = df.dropna()
```

모든 결측이 있는 행을 삭제합니다.

부분 컬럼 기준으로만 삭제하고 싶다면:

```python
df = df.dropna(subset=["age", "sales"])
```

열 단위 삭제도 가능합니다.

```python
df = df.dropna(axis=1)
```

언제 적합한가:

- 결측 비율이 매우 낮을 때
- 해당 행이 핵심 분석 대상이 아닐 때

언제 위험한가:

- 중요한 표본이 사라질 수 있음
- 특정 그룹만 체계적으로 빠지면 편향이 생길 수 있음

### 2. 대체: `fillna()`

```python
df["age"] = df["age"].fillna(df["age"].median())
df["city"] = df["city"].fillna(df["city"].mode()[0])
```

대표적인 선택:

- 평균 대체: 간단하지만 분산을 줄일 수 있음
- 중위수 대체: 이상치에 덜 민감
- 최빈값 대체: 범주형에 적합

### 3. 이전 값으로 채우기: `ffill`

```python
df["temperature"] = df["temperature"].ffill()
```

시계열 데이터에서 이전 값 유지가 의미 있을 때 사용합니다.

### 4. 보간: `interpolate()`

```python
df["temperature"] = df["temperature"].interpolate()
```

연속형 수치 데이터에서 중간 값을 추정할 때 사용할 수 있습니다.

하지만 모든 데이터에 기계적으로 쓰면 안 됩니다.  
결측의 발생 이유를 모르면 오히려 왜곡될 수 있습니다.

## 중복값 처리

실무 데이터에는 완전 중복 행이 생각보다 자주 들어 있습니다.

```python
print(df.duplicated().sum())
df = df.drop_duplicates()
```

특정 컬럼 기준으로 중복을 볼 수도 있습니다.

```python
df = df.drop_duplicates(subset=["user_id"])
```

중복 제거 전에 꼭 생각해야 할 점:

- 진짜 중복인가
- 동일 고객의 반복 거래인가
- 최신값만 남겨야 하는가

즉, 중복은 문법 문제가 아니라 비즈니스 정의 문제인 경우가 많습니다.

## 날짜형 변환과 `.dt` 접근자

날짜 문자열을 그대로 두면 전처리가 제한됩니다.

```python
df["order_date"] = pd.to_datetime(df["order_date"])
```

이후 `.dt`를 통해 날짜 파생 컬럼을 만들 수 있습니다.

```python
df["year"] = df["order_date"].dt.year
df["month"] = df["order_date"].dt.month
df["weekday"] = df["order_date"].dt.day_name()
```

이런 파생 컬럼은 월별 집계, 요일별 분석, 시즌성 분석으로 자연스럽게 이어집니다.

## 값 치환: `map`

단순 코드값 변환에는 `map`이 매우 편합니다.

```python
gender_map = {"Male": "남성", "Female": "여성"}
df["gender_kr"] = df["sex"].map(gender_map)
```

왜 좋은가:

- 딕셔너리 기반 치환이 직관적임
- 코드가 짧고 읽기 쉬움

언제 한계가 있나:

- 복잡한 조건 분기
- 여러 컬럼을 함께 고려해야 하는 경우

## 사용자 정의 로직 적용: `apply`

```python
def classify_bill(x):
    if x >= 30:
        return "high"
    if x >= 15:
        return "medium"
    return "low"

df["bill_group"] = df["total_bill"].apply(classify_bill)
```

`apply`는 유연하지만, 무조건 먼저 쓰는 것은 좋지 않습니다.

왜 그런가:

- 단순 연산은 벡터화 연산이 더 빠르고 읽기 쉬움

대안:

- 산술 연산
- `np.where`
- `map`

즉, `apply`는 강력하지만 "마지막 선택지"처럼 생각하는 습관이 성능과 가독성에 유리할 때가 많습니다.

## 테이블 결합 1: `merge`

관계형 데이터 사고와 가장 비슷한 도구입니다.

```python
merged = pd.merge(df_orders, df_users, on="user_id", how="left")
```

핵심 요소:

- `on`: 결합 키
- `how`: 결합 방식

주요 방식:

- `inner`
- `left`
- `right`
- `outer`

실무에서 자주 발생하는 문제:

- 키 타입이 다름
- 공백, 대소문자 차이
- 중복 키로 인해 행이 예상보다 폭증함

따라서 merge 전에는 아래를 확인하는 편이 좋습니다.

```python
print(df_orders["user_id"].dtype)
print(df_users["user_id"].dtype)
```

## 테이블 결합 2: `concat`

구조가 같은 데이터를 위아래로 쌓을 때 자주 사용합니다.

```python
stacked = pd.concat([df_jan, df_feb, df_mar], ignore_index=True)
```

또는 열 방향 결합도 가능합니다.

```python
combined = pd.concat([df_left, df_right], axis=1)
```

정리하면:

- `merge`: 키 기준 결합
- `concat`: 행 또는 열 방향 이어 붙이기

## 집계의 핵심: `groupby`

```python
summary = df.groupby("day")["tip"].mean()
print(summary)
```

여러 컬럼으로 그룹화도 가능합니다.

```python
summary = df.groupby(["day", "smoker"])["tip"].agg(["mean", "sum", "count"])
print(summary)
```

왜 중요한가:

- 그룹별 평균, 합계, 건수, 비율은 거의 모든 분석의 출발점임

실무 질문 예시:

- 요일별 평균 매출은?
- 부서별 불량 건수는?
- 채널별 전환율 차이는?

즉, `groupby`는 SQL의 `GROUP BY`와 같은 감각으로 이해하면 좋습니다.

## 실무 예제: 결측치 처리 후 그룹 집계

```python
import pandas as pd

df = pd.DataFrame(
    {
        "team": ["A", "A", "B", "B", "B"],
        "score": [80, None, 90, 70, None],
    }
)

df["score"] = df["score"].fillna(df["score"].median())

result = df.groupby("team")["score"].agg(["mean", "count"])
print(result)
```

이 예제에서 중요한 포인트:

- 결측치를 먼저 다룸
- 그다음 집계 수행
- 전처리와 분석이 하나의 흐름으로 연결됨

## 실무 예제: 사용자 정보와 주문 정보 결합

```python
import pandas as pd

df_users = pd.DataFrame(
    {
        "user_id": [1, 2, 3],
        "name": ["Kim", "Lee", "Park"],
    }
)

df_orders = pd.DataFrame(
    {
        "user_id": [1, 1, 2, 4],
        "amount": [100, 150, 80, 200],
    }
)

merged = pd.merge(df_orders, df_users, on="user_id", how="left")
print(merged)
```

여기서 `user_id=4`는 사용자 정보가 없으므로 `NaN`이 생깁니다.  
이런 결과를 보고 데이터 누락인지 정상 상황인지 해석하는 것이 실무 판단입니다.

## 정리

- 실전 `pandas`의 핵심은 결측치, 중복, 결합, 집계입니다.
- 평균 하나만 보지 말고 중위수, 분포, 비율까지 함께 봐야 해석이 안정적입니다.
- `map`은 단순 치환, `apply`는 복잡한 사용자 정의 로직에 적합합니다.
- `merge` 전에는 키 타입과 중복 여부를 꼭 확인해야 합니다.
- `groupby`는 거의 모든 분석 흐름의 중심 도구입니다.
