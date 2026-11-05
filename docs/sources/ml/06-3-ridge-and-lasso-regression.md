## 학습 목표

- `Ridge`와 `Lasso`가 왜 선형회귀의 대안으로 등장하는지 설명할 수 있습니다.
- `L2` 정규화와 `L1` 정규화의 차이를 이해할 수 있습니다.
- `alpha`가 커질수록 모델이 어떻게 달라지는지 해석할 수 있습니다.
- 다중공선성, feature 수 증가, 과적합 상황에서 어떤 모델을 먼저 검토할지 판단할 수 있습니다.
- `StandardScaler + Ridge/Lasso` 실습 흐름을 코드로 연결할 수 있습니다.

## 초심자용 한 줄 요약

`Ridge`와 `Lasso`는 선형회귀가 feature에 너무 과하게 맞추지 않도록 계수에 벌점을 주는 회귀 모델입니다.

## 왜 선형회귀 다음에 Ridge와 Lasso를 배우나

선형회귀는 해석이 쉽고 baseline으로 좋지만  
feature가 많아지거나 서로 강하게 겹치면 계수가 불안정해질 수 있습니다.

예:

- 비슷한 의미의 컬럼이 많다
- 데이터 수보다 변수 수가 많아진다
- train 점수는 괜찮은데 test 점수가 흔들린다
- 계수가 지나치게 커지거나 부호가 자주 바뀐다

이때 쓰는 대표 대안이 `Ridge`와 `Lasso`입니다.

## 핵심 아이디어: 계수에 벌점을 준다

선형회귀는 기본적으로 오차를 줄이는 방향으로 계수를 찾습니다.

`Ridge`와 `Lasso`는 여기서 한 걸음 더 나아가  
`계수가 너무 커지는 것` 자체에도 벌점을 줍니다.

즉, 목표는 단순히 학습 데이터를 잘 맞히는 것이 아니라  
`새 데이터에서도 덜 흔들리는 계수 구조`를 만드는 것입니다.

## Ridge는 무엇인가

`Ridge Regression`은 `L2 정규화`를 붙인 선형회귀입니다.

개념식:

`손실 = RSS + alpha * Σ(bj^2)`

- `RSS`: 예측 오차 제곱합
- `bj`: 각 feature의 계수
- `alpha`: 벌점 강도

직관:

- 계수를 0에 가깝게 부드럽게 줄입니다
- 하지만 대부분의 계수를 완전히 0으로 만들지는 않습니다
- 비슷한 feature가 많을 때 계수를 안정화하는 데 유리합니다

즉, Ridge는 `변수는 많이 쓰되 계수 폭주를 막는 모델`에 가깝습니다.

## Lasso는 무엇인가

`Lasso Regression`은 `L1 정규화`를 붙인 선형회귀입니다.

개념식:

`손실 = RSS + alpha * Σ|bj|`

직관:

- 계수에 절댓값 벌점을 줍니다
- 일부 계수를 실제로 0으로 만들 수 있습니다
- 그래서 feature 선택 효과가 생길 수 있습니다

즉, Lasso는 `불필요한 변수를 일부 꺼버리는 모델`처럼 동작할 수 있습니다.

## Ridge vs Lasso를 한 번에 비교하면

| 항목 | Ridge | Lasso |
| --- | --- | --- |
| 정규화 방식 | `L2` | `L1` |
| 계수 효과 | 전체적으로 줄임 | 일부를 0으로 만들 수 있음 |
| 강점 | 다중공선성, 안정적 일반화 | 변수 선택 효과 |
| 약점 | 변수 제거 효과는 약함 | 상관된 변수 중 하나만 고르는 식으로 불안정할 수 있음 |
| 자주 쓰는 상황 | 변수는 유지하고 싶다 | 변수 수를 줄이고 싶다 |

## `alpha`는 무엇을 조절하나

`alpha`는 벌점의 세기입니다.

- `alpha`가 작다 -> 선형회귀와 비슷해짐
- `alpha`가 크다 -> 계수를 더 강하게 줄임

너무 작으면 과적합을 충분히 못 막을 수 있고,  
너무 크면 계수를 지나치게 눌러 underfitting이 생길 수 있습니다.

즉, `alpha`는 bias-variance trade-off를 조절하는 손잡이라고 보시면 됩니다.

## 왜 스케일링이 중요하나

Ridge와 Lasso는 `계수 크기`에 벌점을 줍니다.  
그래서 feature 스케일이 제각각이면 벌점이 불공정해집니다.

예:

- `연봉`: 수백만 단위
- `클릭률`: 0~1

이 상태에서 정규화를 걸면  
큰 스케일 feature가 벌점 구조에 더 큰 영향을 줄 수 있습니다.

그래서 보통은 아래 흐름을 권장합니다.

1. 결측치 처리
2. 인코딩
3. 스케일링
4. Ridge 또는 Lasso 학습

즉, `Pipeline 안에서 StandardScaler와 같이 묶는 것`이 안전합니다.

## 작은 코드 예시

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Lasso, Ridge
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

data = load_diabetes(as_frame=True)
X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

ridge_model = Pipeline(
    steps=[
        ("scaler", StandardScaler()),
        ("model", Ridge(alpha=1.0)),
    ]
)

lasso_model = Pipeline(
    steps=[
        ("scaler", StandardScaler()),
        ("model", Lasso(alpha=0.1)),
    ]
)

ridge_model.fit(X_train, y_train)
lasso_model.fit(X_train, y_train)

ridge_pred = ridge_model.predict(X_test)
lasso_pred = lasso_model.predict(X_test)

print("Ridge MAE:", mean_absolute_error(y_test, ridge_pred))
print("Ridge R2:", r2_score(y_test, ridge_pred))
print("Lasso MAE:", mean_absolute_error(y_test, lasso_pred))
print("Lasso R2:", r2_score(y_test, lasso_pred))
```

입문 단계에서는 점수 숫자 하나보다 아래를 같이 보면 좋습니다.

- 어떤 모델이 test 점수를 더 안정적으로 내는가
- 계수가 얼마나 줄었는가
- Lasso에서 0이 된 계수가 있는가

## 계수 해석은 어떻게 달라지나

Ridge와 Lasso도 여전히 선형모델이라  
기본적으로는 `계수 방향성`을 읽을 수 있습니다.

하지만 plain linear regression과 달리  
정규화가 계수를 인위적으로 줄였다는 점을 기억해야 합니다.

즉, 해석은 가능하지만  
`이 값이 순수한 상관관계의 크기`라고 단정하면 안 됩니다.

## 언제 Ridge를 먼저 볼까

- 변수 수가 많다
- 비슷한 변수들이 함께 움직인다
- 다중공선성이 의심된다
- 변수는 많이 유지하고 싶다
- 설명력보다 예측 안정성이 중요하다

예를 들어 금융, CRM, 센서 데이터처럼  
유사 feature가 여러 개 만들어지는 경우 Ridge가 자연스럽습니다.

## 언제 Lasso를 먼저 볼까

- 변수 수가 많고 일부는 정말 불필요해 보인다
- 더 단순한 모델을 만들고 싶다
- feature selection 효과를 같이 얻고 싶다
- 배포 전에 입력 컬럼 수를 줄이고 싶다

다만 상관된 feature가 많으면  
Lasso가 그중 하나만 남기고 나머지를 0으로 보내는 식으로  
조금 불안정하게 보일 수 있습니다.

## 실무에서 언제 문제가 되나

### 1. 스케일링 없이 바로 학습하는 경우

정규화 강도가 feature마다 다르게 먹어 결과 해석이 왜곡될 수 있습니다.

### 2. `alpha`를 감으로만 정하는 경우

Ridge와 Lasso는 `alpha`에 매우 민감할 수 있으므로  
cross validation으로 비교하는 습관이 중요합니다.

### 3. Lasso 결과를 곧바로 진실로 받아들이는 경우

어떤 변수가 0이 되었다고 해서  
그 변수가 본질적으로 무의미하다고 단정하면 위험합니다.  
상관된 다른 변수에 정보가 흡수됐을 수도 있습니다.

### 4. 다중공선성을 무시한 채 계수 해석을 강하게 하는 경우

정규화를 넣었더라도  
상관된 변수 구조 자체가 완전히 사라지는 것은 아닙니다.

## 대안은 무엇인가

- `Elastic Net`: L1과 L2를 함께 쓰는 절충형
- 트리 기반 회귀: 비선형 관계가 강할 때
- 차원축소 후 선형모델: feature 수가 너무 많을 때

즉, Ridge와 Lasso는 `선형 해석력은 유지하면서 일반화를 조금 더 챙기고 싶을 때` 좋은 중간 선택지입니다.

## 정리

- Ridge는 계수를 전체적으로 줄여 일반화와 안정성을 높이려는 모델입니다.
- Lasso는 일부 계수를 0으로 만들어 변수 선택 효과까지 기대할 수 있습니다.
- 두 모델 모두 `alpha`와 `스케일링`이 핵심입니다.
- 다중공선성이 강하면 Ridge가 더 안정적일 때가 많고, 변수 수를 줄이고 싶으면 Lasso가 유리할 수 있습니다.

## 연습 문제

1. Ridge와 Lasso의 가장 큰 차이를 한 문장으로 적어보세요.
2. 스케일링 없이 Lasso를 적용하면 왜 해석이 위험해질 수 있는지 설명해보세요.
3. 고객 행동 feature가 수십 개 있는 이탈 예측 회귀 문제라면 Ridge와 Lasso 중 무엇을 먼저 볼지 이유와 함께 적어보세요.

## 과제

- `★` 같은 데이터에 Linear Regression, Ridge, Lasso를 각각 학습시키고 test MAE를 비교해보세요.
- `★★` `alpha` 값을 여러 개 바꿔 보면서 계수 크기가 어떻게 달라지는지 표로 정리해보세요.
- `★★★` Lasso에서 0이 된 계수와 남은 계수를 보고 어떤 feature 선택 효과가 나타났는지 해석해보세요.
