## 학습 목표

- baseline이 왜 필요한지 설명할 수 있습니다.
- 전처리와 모델 학습을 Pipeline으로 묶는 이유를 이해할 수 있습니다.
- 재현 가능한 실험 흐름이 왜 중요한지 말할 수 있습니다.

## 초심자용 한 줄 요약

머신러닝 실습의 첫 목표는 `최고 성능`이 아니라 `비교 가능한 기준선과 재현 가능한 절차`를 만드는 것입니다.

## baseline은 왜 필요한가

baseline은 가장 단순한 비교 기준입니다.

예:

- 회귀: 평균값만 예측
- 분류: 가장 많은 클래스만 예측
- 단순 로지스틱 회귀
- 얕은 결정트리

baseline이 있으면 아래 질문에 답할 수 있습니다.

- 복잡한 모델이 정말 더 나은가
- 지금 데이터와 지표가 정상인가
- 과도한 튜닝을 하고 있지는 않은가

## baseline이 없는 실험의 문제

baseline 없이 모델을 하나 돌리면 점수 해석이 어렵습니다.

예를 들어 accuracy `0.84`가 나왔다고 해도

- 원래 다수 클래스 비율이 `0.82`인지
- 단순 선형모델도 `0.85`가 나오는지

를 모르면 그 점수의 의미를 판단하기 어렵습니다.

## 전처리를 Pipeline으로 묶는 이유

실무에서는 아래 작업이 거의 항상 들어갑니다.

- 결측치 처리
- 스케일링
- 원-핫 인코딩
- 모델 학습

이 과정이 학습과 예측에서 동일하게 재현되어야 합니다.  
그래서 scikit-learn에서는 `Pipeline`을 많이 사용합니다.

결측치 처리 자체는 아래처럼 여러 전략이 있습니다.

- 평균/중앙값/최빈값 대체
- 상수값 대체
- KNN 기반 대체
- indicator 추가

이 전략 비교는 다음 페이지 `03-3. 결측치 데이터 처리와 KNN Imputation`에서 더 자세히 다룹니다.

범주형 변수 인코딩과 전처리 순서 정리는  
`03-4. 범주형 변수 인코딩과 데이터 전처리 순서`에서 이어서 설명합니다.

## 작은 예시

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric_features = ["visits_last_30d", "avg_order_amount"]
categorical_features = ["membership_grade"]

preprocess = ColumnTransformer(
    transformers=[
        (
            "num",
            Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="median")),
                    ("scaler", StandardScaler()),
                ]
            ),
            numeric_features,
        ),
        (
            "cat",
            Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="most_frequent")),
                    ("encoder", OneHotEncoder(handle_unknown="ignore")),
                ]
            ),
            categorical_features,
        ),
    ]
)

model = Pipeline(
    steps=[
        ("preprocess", preprocess),
        ("classifier", LogisticRegression(max_iter=1000)),
    ]
)
```

이 구조의 장점은 `전처리와 모델이 한 덩어리로 움직인다`는 점입니다.

## Pipeline이 중요한 이유

### 1. 누수 방지

전처리를 train 데이터 기준으로만 학습하고 test에 적용하기 쉬워집니다.

### 2. 재현성 확보

같은 객체로 학습과 추론을 반복할 수 있습니다.

### 3. 실험 비교가 쉬움

모델만 바꿔 끼우며 비교하기 좋습니다.

예:

- Logistic Regression
- Random Forest
- Gradient Boosting

## 실무에서 자주 생기는 문제

### 1. 노트북 셀 순서에 따라 전처리가 달라지는 경우

Pipeline이 없으면 이런 문제가 자주 생깁니다.

### 2. 운영 추론 코드에서 학습 때 쓴 전처리가 빠지는 경우

모델 자체보다 더 자주 발생하는 장애입니다.

### 3. baseline 없이 복잡한 모델만 비교하는 경우

복잡한 모델에 과도한 시간을 쓰고도 실제 개선 폭은 작을 수 있습니다.

## 정리

- baseline은 성능 비교의 기준선입니다.
- Pipeline은 실험을 재현 가능하게 만드는 기본 장치입니다.
- 입문 단계부터 이 두 가지를 습관으로 만들면 이후 모델이 복잡해져도 흔들리지 않습니다.

## 연습 문제

1. 본인이 다루는 문제에서 baseline으로 쓸 수 있는 가장 단순한 모델을 적어보세요.
2. 현재 사용하는 전처리 단계 중 Pipeline으로 묶을 수 있는 항목을 적어보세요.
3. baseline보다 1~2%만 좋아진 복잡한 모델이 정말 가치 있는지 판단 기준을 적어보세요.
