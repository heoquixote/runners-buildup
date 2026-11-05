## 학습 목표

- Feature Importance와 Permutation Importance가 무엇을 보여주고 무엇을 보여주지 않는지 설명할 수 있습니다.
- 선형계수, 트리 기반 중요도, permutation importance의 차이를 이해할 수 있습니다.
- 중요도를 인과관계로 오해하면 왜 위험한지 말할 수 있습니다.
- 중요도 해석을 실무 문장으로 바꾸는 방법을 익힐 수 있습니다.

## 초심자용 한 줄 요약

Feature Importance와 Permutation Importance는 `모델이 어떤 변수에 얼마나 기대고 있는지 읽는 첫 해석 도구`이지, 그 자체로 진실 전체는 아닙니다.

## Feature Importance란 무엇인가

변수 중요도는 모델이 예측을 만들 때  
어떤 feature를 상대적으로 더 많이 활용했는지 보는 지표입니다.

하지만 중요도는 아래와 다릅니다.

- 인과 효과
- 정책 우선순위
- 변수의 절대적 가치

즉, 중요도는 해석의 출발점입니다.

실무에서는 보통 아래 순서로 많이 봅니다.

1. 기본 feature importance
2. permutation importance
3. 더 세밀한 해석이 필요하면 `SHAP`, `PDP`

즉, 이번 페이지는 `가장 먼저 보는 해석 도구`를 다루고,  
다음 페이지 `05-5. SHAP과 PDP로 모델 해석하기`에서 더 깊게 이어집니다.

## 대표적인 중요도 해석 방식

### 1. 선형모델 계수

선형회귀나 로지스틱 회귀에서는  
계수 부호와 크기를 통해 방향성과 상대적 영향을 봅니다.

주의:

- 스케일링 여부에 따라 크기 비교가 왜곡될 수 있음
- 다중공선성이 있으면 해석이 흔들릴 수 있음

### 2. 트리 기반 중요도

결정트리, 랜덤포레스트, boosting 계열에서는  
분할에 얼마나 자주 기여했는지로 중요도를 볼 수 있습니다.

장점:

- 계산이 쉽다
- 비선형 관계를 반영할 수 있다

주의:

- 연속형 변수나 분할 기회가 많은 변수에 유리하게 보일 수 있음

### 3. Permutation Importance

특정 변수 값을 섞어서 성능이 얼마나 떨어지는지 보는 방식입니다.

직관:

1. 원래 성능을 측정한다
2. 한 변수만 섞는다
3. 성능이 많이 떨어지면 그 변수 의존도가 크다고 본다

장점:

- 모델 종류에 덜 묶인다
- 실제 성능 변화 기준이라 직관적이다

주의:

- 상관 높은 변수가 많으면 해석이 애매해질 수 있다
- 계산량이 커질 수 있다

## 작은 코드 예시: 트리 기반 중요도

```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

importance = pd.Series(model.feature_importances_, index=X_train.columns)
print(importance.sort_values(ascending=False))
```

## 작은 코드 예시: Permutation Importance

```python
import pandas as pd
from sklearn.inspection import permutation_importance

result = permutation_importance(
    model,
    X_test,
    y_test,
    n_repeats=10,
    random_state=42,
)

importance = pd.Series(result.importances_mean, index=X_test.columns)
print(importance.sort_values(ascending=False))
```

## 중요도를 어떻게 읽으면 좋을까

초심자는 처음에 아래 순서로 읽으면 좋습니다.

1. 상위 변수 몇 개를 본다
2. 도메인 상식과 맞는지 본다
3. 누수 가능성이 없는지 본다
4. 변수들이 서로 너무 비슷하지 않은지 본다

예를 들어 고객 이탈 모델에서

- `days_since_last_login`
- `recent_30d_orders`
- `support_tickets`

가 높게 나온다면  
활동 감소와 불만 신호가 중요한 힌트라는 가설을 세울 수 있습니다.

## 중요도 해석에서 자주 생기는 오해

### 1. 중요도가 높으니 원인이라고 생각하는 경우

중요도는 예측에 유용했다는 뜻이지  
원인이라는 뜻은 아닙니다.

### 2. 중요도가 낮으니 제거해도 된다고 바로 판단하는 경우

다른 변수와 함께 있을 때만 의미가 드러나는 feature도 있습니다.

### 3. 한 모델의 중요도를 절대 기준으로 보는 경우

선형모델과 트리모델은 중요도 구조가 다르게 보일 수 있습니다.

### 4. 누수 변수가 중요하게 나왔는데 좋은 발견이라고 착각하는 경우

오히려 위험 신호일 수 있습니다.

## 실무에서 언제 유용한가

- 현업 설명 자료를 만들 때
- 파생변수 아이디어를 다시 얻고 싶을 때
- selection 후보를 줄일 때
- 점검용으로 누수 의심 변수를 찾을 때

즉, 중요도는 결과 해석과 다음 실험 설계 모두에 도움이 됩니다.

## 대안은 무엇인가

- 선형계수 해석이 중요하다 -> 스케일링 + 다중공선성 점검과 함께 본다
- 트리모델을 쓴다 -> 기본 중요도 + permutation importance 비교
- 국소 설명이 필요하다 -> SHAP 같은 추가 도구 검토
- 변수와 예측값 관계 곡선을 보고 싶다 -> PDP 검토

## 정리

- Feature Importance는 모델이 어떤 변수에 의존했는지 보는 힌트입니다.
- 중요도는 인과관계가 아니며, 누수와 상관 구조를 함께 봐야 합니다.
- 한 가지 중요도만 보지 말고 모델 구조와 해석 목적에 맞춰 비교하는 편이 안전합니다.
- 더 세밀한 개별 예측 해석은 `SHAP`, 변수와 예측 관계를 평균적으로 보려면 `PDP`가 자주 쓰입니다.

## 연습 문제

1. 중요도와 인과관계의 차이를 설명해보세요.
2. permutation importance가 직관적인 이유를 적어보세요.
3. 중요도가 높게 나온 변수가 누수일 수 있는 예시를 하나 적어보세요.
