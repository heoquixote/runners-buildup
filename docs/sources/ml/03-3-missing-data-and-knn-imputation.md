## 학습 목표

- 결측치가 왜 생기고 왜 위험한지 설명할 수 있습니다.
- 행 삭제, 열 삭제, 상수 대체, 평균/중앙값/최빈값 대체, 그룹별 대체, missing indicator, KNN, MICE/iterative 방식의 차이를 말할 수 있습니다.
- KNN imputation이 어떤 원리로 결측값을 채우는지 설명할 수 있습니다.
- 결측치 처리 전략을 모델과 데이터 특성에 맞춰 고를 수 있습니다.

## 초심자용 한 줄 요약

결측치 처리는 `비어 있는 칸을 아무 값으로 채우는 작업`이 아니라 `왜 비었는지와 어떤 왜곡을 감수할지 결정하는 작업`입니다.

## 결측치가 왜 중요한가

결측치가 많으면 모델이 아예 학습을 못 하거나  
억지로 채운 값 때문에 잘못된 패턴을 배울 수 있습니다.

예를 들어:

- 고객 소득 정보가 일부 비어 있다
- 설문 응답자가 민감한 문항을 건너뛴다
- 로그 수집 실패로 특정 시간대 데이터가 비어 있다

이때 중요한 질문은 아래입니다.

- 단순 누락인가
- 특정 집단에서만 많이 비는가
- 비어 있다는 사실 자체가 신호인가

즉, 결측치는 `데이터 품질 문제`이면서 때로는 `정보`이기도 합니다.

## 왜 비었는지를 구분해보면 좋다

실무에서는 엄밀한 통계 검정보다 먼저 아래 감각이 중요합니다.

### 1. 완전히 우연한 누락

관측 장비 오류나 임의 누락처럼  
다른 변수와 큰 관련 없이 비는 경우입니다.

### 2. 다른 변수와 관련된 누락

예를 들어 특정 고객군만 소득 정보를 덜 입력하는 경우처럼  
누락이 집단 특성과 연결될 수 있습니다.

### 3. 값 자체와 관련된 누락

예를 들어 소득이 매우 높은 사람이 소득 항목을 비워두는 경우처럼  
결측 자체가 값의 크기와 연결될 수도 있습니다.

이 경우 단순 평균 대체는 왜곡을 크게 만들 수 있습니다.

## 결측치 처리 방법들 한 번에 보기

### 1. 행 삭제

결측치가 있는 행을 통째로 제거합니다.

장점:

- 가장 단순함
- 가짜 값을 만들지 않음

단점:

- 표본 수가 줄어듦
- 특정 집단이 더 많이 빠지면 편향이 생길 수 있음

적합한 경우:

- 결측 비율이 매우 낮다
- 빠져도 손실이 크지 않다

### 2. 열 삭제

결측치가 너무 많은 컬럼을 아예 버립니다.

장점:

- 불안정한 컬럼을 제거할 수 있음

단점:

- 중요한 정보 자체를 잃을 수 있음

적합한 경우:

- 결측 비율이 너무 높다
- 비즈니스적으로도 활용도가 낮다

### 3. 상수값 대체

`0`, `-1`, `Unknown` 같은 값으로 채웁니다.

장점:

- 단순하고 구현이 쉽다
- 범주형에서는 `Unknown`이 직관적일 수 있음

단점:

- 실제로 존재하지 않는 패턴을 만들 수 있음
- 수치형에서는 왜곡이 클 수 있음

### 4. 평균 / 중앙값 / 최빈값 대체

가장 흔한 기본 전략입니다.

- 수치형: 평균 또는 중앙값
- 범주형: 최빈값

장점:

- 빠르고 재현 가능함
- baseline 전처리로 쓰기 좋음

단점:

- 분산을 줄여버릴 수 있음
- feature 관계 구조를 잘 살리지 못함

실무 감각:

- 이상치가 많으면 평균보다 중앙값이 안전한 경우가 많음
- 범주형은 최빈값만 쓰면 소수 범주가 더 약해질 수 있음

### 5. 그룹별 대체

전체 평균이 아니라 그룹별 통계로 채웁니다.

예:

- 고객 등급별 평균 구매금액
- 지역별 평균 소득
- 상품 카테고리별 평균 가격

장점:

- 전체 평균보다 구조를 더 잘 살릴 수 있음

단점:

- 그룹이 너무 작으면 불안정함
- 그룹 정의가 잘못되면 오히려 노이즈가 커질 수 있음

### 6. missing indicator 추가

결측 여부 자체를 `0/1` 컬럼으로 추가합니다.

예:

- `income_missing = 1`
- `signup_channel_missing = 0`

장점:

- 비어 있다는 사실 자체를 모델이 학습할 수 있음

단점:

- 원래 값 대체와 함께 설계하지 않으면 해석이 애매할 수 있음

실무에서는 `값 대체 + indicator` 조합이 꽤 자주 쓰입니다.

### 7. KNN Imputation

비슷한 샘플을 찾아 이웃 값으로 결측치를 채우는 방식입니다.

예를 들어 어떤 고객의 `avg_order_amount`가 비어 있더라도  
방문 수, 문의 수, 결제 빈도가 비슷한 고객들이 있다면  
그 이웃들의 값을 참고해 채우는 식입니다.

장점:

- 단순 평균보다 주변 구조를 더 반영할 수 있음
- 변수 간 관계를 일부 살릴 수 있음

단점:

- 계산량이 커질 수 있음
- 이상치와 스케일 차이에 민감함
- 보통 수치형 feature 중심으로 쓰는 편이 자연스러움

### 8. MICE 감각의 Iterative / 모델 기반 대체

다른 변수들을 이용해 결측 컬럼을 예측하는 방식입니다.

예:

- `IterativeImputer`
- 회귀 모델 기반 대체

여기서 자주 같이 언급되는 개념이 `MICE(Multiple Imputation by Chained Equations)`입니다.

MICE는 여러 변수의 관계를 번갈아 이용해 결측값을 채우는 사고방식으로 이해하시면 됩니다.  
다만 엄밀한 통계적 MICE와 scikit-learn의 `IterativeImputer`는 완전히 같은 것은 아닙니다.

입문 단계에서는 아래처럼 받아들이면 충분합니다.

- `SimpleImputer`: 빠르고 단순한 기본값
- `KNNImputer`: 주변 이웃 구조 반영
- `IterativeImputer`: 다른 feature로 번갈아 예측해 채움

즉, MICE는 `단순 평균 대체보다 변수 관계를 더 살리려는 방향`이라고 보시면 됩니다.

장점:

- 구조를 더 잘 살릴 수 있음

단점:

- 복잡하고 불안정할 수 있음
- 작은 데이터에서는 오히려 과한 경우가 있음

입문 단계에서는 `SimpleImputer -> KNN -> 더 복잡한 방식` 순서로 감각을 잡는 편이 좋습니다.

## MICE / Iterative 방식은 언제 고민할까

- 결측 컬럼이 다른 변수들과 꽤 강하게 연결돼 있다
- 단순 중앙값 대체가 너무 거칠어 보인다
- 데이터 수와 계산 비용을 감당할 수 있다

반대로 아래 상황에서는 과할 수 있습니다.

- 표본 수가 작다
- baseline도 아직 안정적으로 안 잡혔다
- 빠른 실험 반복이 더 중요하다

## KNN Imputation은 어떻게 동작하나

KNN imputation의 핵심은 거리 기반 유사도입니다.

1. 결측치가 없는 다른 샘플들과의 거리를 계산한다
2. 가장 가까운 이웃 `k`개를 찾는다
3. 그 이웃들의 값을 평균 또는 거리 가중 평균으로 사용한다

즉, `비슷한 사람의 값을 참고해서 비어 있는 값을 채운다`고 이해하시면 됩니다.

## KNN을 쓸 때 특히 주의할 점

### 1. 스케일 차이

`연소득`과 `방문 수`를 같이 쓰면  
큰 숫자 변수 쪽이 거리 계산을 지배할 수 있습니다.

그래서 KNN 계열은 보통 스케일 조정을 함께 고려합니다.

### 2. 차원이 너무 많을 때

feature 수가 많아질수록 “가까운 이웃” 개념이 흐려질 수 있습니다.

### 3. 결측이 너무 많을 때

비슷한 이웃을 찾는 자체가 불안정해질 수 있습니다.

### 4. 범주형 변수 처리

KNN은 기본적으로 수치 거리 개념에 더 잘 맞습니다.  
범주형은 최빈값, 별도 카테고리, 인코딩 전략을 함께 고민해야 합니다.

## 작은 코드 예시: SimpleImputer

```python
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer

df = pd.DataFrame(
    {
        "visits_last_30d": [2, 12, np.nan, 7, 15],
        "avg_order_amount": [12000, np.nan, 8000, 23000, 52000],
        "membership_grade": ["Silver", "Gold", np.nan, "Silver", "VIP"],
    }
)

num_imputer = SimpleImputer(strategy="median")
cat_imputer = SimpleImputer(strategy="most_frequent")

df[["visits_last_30d", "avg_order_amount"]] = num_imputer.fit_transform(
    df[["visits_last_30d", "avg_order_amount"]]
)
df[["membership_grade"]] = cat_imputer.fit_transform(df[["membership_grade"]])

print(df)
```

이 방식은 가장 단순하고 baseline 전처리로 매우 자주 쓰입니다.

## 작은 코드 예시: KNN Imputation

```python
import numpy as np
import pandas as pd
from sklearn.impute import KNNImputer

df_num = pd.DataFrame(
    {
        "visits_last_30d": [2, 12, np.nan, 7, 15],
        "avg_order_amount": [12000, np.nan, 8000, 23000, 52000],
        "support_tickets": [3, 0, 4, np.nan, 0],
    }
)

imputer = KNNImputer(n_neighbors=3, weights="distance")
filled = pd.DataFrame(
    imputer.fit_transform(df_num),
    columns=df_num.columns,
)

print(filled)
```

이 코드는 결측치가 있는 행을 주변 이웃과 비교해 값을 채웁니다.

## 작은 코드 예시: IterativeImputer

```python
import numpy as np
import pandas as pd
from sklearn.experimental import enable_iterative_imputer  # noqa: F401
from sklearn.impute import IterativeImputer

df_num = pd.DataFrame(
    {
        "visits_last_30d": [2, 12, np.nan, 7, 15],
        "avg_order_amount": [12000, np.nan, 8000, 23000, 52000],
        "support_tickets": [3, 0, 4, np.nan, 0],
    }
)

imputer = IterativeImputer(random_state=42, max_iter=10)
filled = pd.DataFrame(
    imputer.fit_transform(df_num),
    columns=df_num.columns,
)

print(filled)
```

이 방식은 각 컬럼을 다른 컬럼으로 예측해가며  
결측값을 반복적으로 보정하는 흐름입니다.

## 모델 파이프라인 안에서 결측치 처리하기

실무에서는 결측치 처리도 train 데이터 기준으로만 학습돼야 하므로  
Pipeline 안에 넣는 편이 안전합니다.

```python
from sklearn.impute import KNNImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

model = Pipeline(
    steps=[
        ("scaler", StandardScaler()),
        ("imputer", KNNImputer(n_neighbors=5)),
        ("classifier", LogisticRegression(max_iter=5000)),
    ]
)
```

핵심은 `split 이후 fit`입니다.  
그래야 validation/test 정보를 미리 보지 않게 됩니다.

## 어떤 방법을 먼저 고르면 좋을까

처음에는 아래 순서가 실무적으로 안전합니다.

1. 결측 비율과 패턴을 본다
2. baseline으로 `중앙값/최빈값` 대체를 먼저 만든다
3. missing indicator 추가가 도움이 되는지 본다
4. 필요하면 그룹별 대체나 KNN을 비교한다
5. 성능 차이가 충분할 때만 더 복잡한 방법으로 간다

즉, `무조건 KNN이 더 고급이라서 더 좋다`고 보면 안 됩니다.

## 실무에서 자주 생기는 문제

### 1. 전체 데이터로 먼저 대체값을 계산하는 경우

이건 전처리 누수로 이어질 수 있습니다.

### 2. 결측 비율만 보고 무조건 삭제하는 경우

빠르긴 하지만 중요한 집단 정보까지 함께 버릴 수 있습니다.

### 3. KNN을 썼는데 스케일을 전혀 고려하지 않는 경우

거리 기반이라 특정 큰 숫자 컬럼에 끌려갈 수 있습니다.

### 4. 범주형에도 KNN을 그대로 적용하려는 경우

범주형은 수치 거리와 다른 성질을 가지므로  
단순 적용이 늘 적절하지는 않습니다.

## 대안은 무엇인가

- 빠른 baseline이 필요하다 -> 중앙값/최빈값 대체
- 비어 있다는 사실 자체가 중요하다 -> indicator 추가
- 그룹 구조가 분명하다 -> 그룹별 대체
- 수치형 구조를 더 살리고 싶다 -> KNN
- 더 복잡한 상호작용까지 반영하고 싶다 -> `MICE`, iterative / 모델 기반 대체

## 정리

- 결측치 처리는 값 채우기 자체보다 `누락 원인`과 `왜곡 비용`을 같이 보는 작업입니다.
- 가장 흔한 기본 전략은 `중앙값/최빈값` 대체입니다.
- KNN imputation은 주변 구조를 더 반영할 수 있지만 스케일, 계산량, 데이터 구조에 민감합니다.
- MICE 감각의 iterative 방식은 변수 관계를 더 살릴 수 있지만 baseline보다 항상 낫지는 않습니다.
- 항상 단순 baseline과 비교해서 복잡한 대체가 정말 가치 있는지 확인하는 편이 좋습니다.

## 연습 문제

1. 평균 대체보다 중앙값 대체가 더 안전할 수 있는 상황을 하나 적어보세요.
2. 결측 indicator를 추가하면 도움이 될 수 있는 사례를 하나 설명해보세요.
3. KNN imputation을 쓸 때 스케일링을 왜 함께 고려해야 하는지 설명해보세요.
