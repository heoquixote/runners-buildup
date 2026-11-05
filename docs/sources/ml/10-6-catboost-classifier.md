## 학습 목표

- CatBoost가 범주형 변수가 많은 분류 문제에서 왜 강한지 설명할 수 있습니다.
- CatBoost가 전처리 부담을 어떻게 줄여주는지 큰 그림에서 이해할 수 있습니다.
- CatBoost를 언제 XGBoost나 LightGBM보다 먼저 고려할지 판단할 수 있습니다.

## 초심자용 한 줄 요약

CatBoost는 `범주형 변수가 많은 tabular 분류에서 전처리 부담을 줄이며 강한 성능을 내기 쉬운 boosting 모델`입니다.

## CatBoost는 왜 따로 많이 보나

실무 tabular 데이터에는 문자열 범주형 변수가 많습니다.

예:

- 고객 등급
- 가입 채널
- 지역 코드
- 상품 카테고리

이런 변수는 보통 one-hot encoding이나 label encoding을 고민해야 하는데,  
CatBoost는 범주형 처리 경험을 상당 부분 내장하고 있어서 편리한 경우가 많습니다.

## 어떤 점이 실무에서 편한가

- 범주형 feature 인덱스를 직접 지정할 수 있음
- 전처리 파이프라인이 비교적 단순해질 수 있음
- tabular 분류에서 성능이 잘 나오는 경우가 많음

즉, `범주형이 많은 고객/거래/CRM 데이터`에서 특히 매력적입니다.

## 자주 보는 하이퍼파라미터

- `iterations`: boosting 단계 수
- `learning_rate`: 학습 속도
- `depth`: 트리 깊이
- `l2_leaf_reg`: 규제 강도
- `eval_metric`: 검증 지표

직관적으로 보면:

- `depth`가 크면 더 복잡한 규칙을 배움
- `iterations`가 많고 `learning_rate`가 크면 과하게 맞출 수 있음
- 규제를 적절히 주어야 안정성이 생김

## 작은 코드 예시: CatBoost 분류

먼저 설치가 필요합니다.

```bash
pip install catboost
```

아래 예시는 범주형 열이 있는 경우를 가정한 형태입니다.

```python
import pandas as pd
from catboost import CatBoostClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

df = pd.DataFrame(
    {
        "signup_channel": ["ads", "organic", "ads", "referral", "organic", "ads"],
        "customer_grade": ["A", "B", "B", "C", "A", "C"],
        "monthly_spend": [120, 80, 95, 40, 150, 30],
        "is_churn": [0, 1, 0, 1, 0, 1],
    }
)

X = df[["signup_channel", "customer_grade", "monthly_spend"]]
y = df["is_churn"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.33,
    random_state=42,
    stratify=y,
)

cat_features = [0, 1]

model = CatBoostClassifier(
    iterations=200,
    learning_rate=0.05,
    depth=4,
    loss_function="Logloss",
    verbose=0,
    random_state=42,
)
model.fit(X_train, y_train, cat_features=cat_features)

pred = model.predict(X_test)

print(classification_report(y_test, pred))
```

이 코드에서 중요한 점은 아래입니다.

- 범주형 열을 문자열 그대로 둘 수 있다는 점
- `cat_features`로 범주형 열 위치를 명시한다는 점
- 별도 one-hot encoding 없이도 빠르게 baseline을 만들 수 있다는 점

## 언제 유리한가

- 범주형 변수가 많다
- 전처리 파이프라인을 너무 복잡하게 만들고 싶지 않다
- 고객/마케팅/CRM 같은 tabular 분류 문제를 다룬다

즉, `범주형이 많다 -> CatBoost를 먼저 떠올린다`는 판단은  
초기 모델 후보를 고를 때 꽤 실용적인 기준입니다.

## 실무에서 언제 문제가 되는가

### 1. 데이터가 아주 작아 예시 코드 수준으로만 판단하는 경우

간단히 잘 돌아간다고 해서  
항상 다른 boosting보다 더 좋은 것은 아닙니다.

### 2. 범주형 지정이 잘못된 경우

문자열 ID나 의미 없는 식별자를  
좋은 범주형 feature처럼 착각하면 성능이 왜곡될 수 있습니다.

### 3. 성능이 좋다고 전처리 검토를 생략하는 경우

CatBoost가 편하다고 해도  
누수와 잘못된 feature 설계를 자동으로 해결해주지는 않습니다.

## 대안은 무엇인가

- 수치형 중심이고 전통적인 boosting 레퍼런스를 원한다 -> XGBoost
- 큰 데이터에서 더 빠른 학습이 중요하다 -> LightGBM
- 더 단순하고 튜닝 부담이 적은 모델이 좋다 -> 랜덤포레스트

## 정리

- CatBoost는 범주형 변수가 많은 분류 문제에서 특히 편리한 boosting 모델입니다.
- 전처리 부담을 줄이면서도 강한 성능을 낼 수 있는 경우가 많습니다.
- 다만 범주형 지정과 데이터 설계는 여전히 신중해야 합니다.

## 연습 문제

1. CatBoost가 범주형 데이터에서 편한 이유를 적어보세요.
2. 범주형 feature와 단순 식별자 컬럼을 왜 구분해야 하는지 설명해보세요.
3. CatBoost를 XGBoost보다 먼저 시도할 상황을 하나 적어보세요.
