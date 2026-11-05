## 학습 목표

- Gradient Boosting이 이전 오차를 어떻게 순차적으로 줄이는지 설명할 수 있습니다.
- boosting과 bagging의 차이를 분류 문제 기준으로 비교할 수 있습니다.
- `learning_rate`와 `n_estimators`의 균형이 왜 중요한지 말할 수 있습니다.

## 초심자용 한 줄 요약

Gradient Boosting은 `앞선 트리가 틀린 부분을 뒤의 트리가 계속 보완해 가는 분류 모델`입니다.

## Gradient Boosting을 어떻게 이해하면 좋을까

랜덤포레스트가 여러 트리를 병렬로 만들어 평균을 내는 방식이라면,  
Gradient Boosting은 트리를 순서대로 추가하면서 오차를 줄입니다.

직관은 아래와 같습니다.

1. 첫 번째 트리가 예측을 한다
2. 어디서 많이 틀렸는지 본다
3. 다음 트리가 그 오차를 줄이도록 학습한다
4. 이 과정을 여러 번 반복한다

즉, `여러 약한 트리를 차례대로 더해 강한 모델을 만든다`고 보시면 됩니다.

## 왜 성능이 잘 나오는가

- 이전 단계 오차에 집중하므로 어려운 샘플을 계속 보완함
- 비선형 패턴과 변수 간 상호작용을 잘 잡음
- tabular 데이터에서 강한 성능을 내는 경우가 많음

특히 선형모델이 놓치는 `복합 규칙`을 잘 잡는 편입니다.

## 분류 문제에서 자주 보는 하이퍼파라미터

- `n_estimators`: 추가할 트리 수
- `learning_rate`: 각 트리가 반영되는 강도
- `max_depth`: 개별 약한 트리의 복잡도
- `subsample`: 일부 데이터만 써서 학습할지 여부

실무 감각으로 보면:

- `learning_rate`를 낮추면 더 천천히 학습
- 대신 보통 `n_estimators`를 더 많이 써야 함
- 트리를 너무 깊게 만들면 boosting도 쉽게 과적합됨

## 작은 코드 예시: Gradient Boosting 분류

```python
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split

data = load_breast_cancer(as_frame=True)
X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

model = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=2,
    random_state=42,
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
proba = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, pred))
print("ROC-AUC:", roc_auc_score(y_test, proba))
```

이 코드에서 먼저 확인할 것은 아래입니다.

- `learning_rate`를 낮췄다면 트리 수를 충분히 늘렸는가
- 개별 트리 깊이를 너무 크게 주지 않았는가
- train 점수만 높고 test 점수가 꺾이지 않는가

## 랜덤포레스트와 무엇이 다를까

### 랜덤포레스트

- 병렬적으로 여러 트리를 만든다
- 평균으로 흔들림을 줄인다
- 튜닝 부담이 비교적 덜하다

### Gradient Boosting

- 순차적으로 트리를 추가한다
- 이전 오차를 계속 보완한다
- 성능은 강하지만 튜닝 민감도가 더 크다

즉, 랜덤포레스트는 `안정성`, Gradient Boosting은 `성능 확장성` 쪽에 조금 더 가깝습니다.

## 언제 유리한가

- tabular 분류에서 baseline보다 더 높은 성능이 필요하다
- 변수 간 비선형 상호작용이 강하다
- 어느 정도 튜닝과 검증 시간을 확보할 수 있다

## 실무에서 언제 문제가 되는가

### 1. learning_rate와 n_estimators를 같이 보지 않는 경우

둘은 서로 연결되어 있어서  
하나만 크게 바꾸면 학습이 너무 거칠거나 너무 느려질 수 있습니다.

### 2. 작은 데이터에 복잡한 boosting을 과하게 쓰는 경우

train 성능은 빠르게 좋아지지만 validation 성능은 흔들릴 수 있습니다.

### 3. 성능 차이가 작아도 무조건 boosting으로 가는 경우

운영 복잡도와 설명 가능성 비용까지 함께 봐야 합니다.

## 대안은 무엇인가

- 튜닝 부담을 줄이고 싶다 -> 랜덤포레스트
- 해석이 더 중요하다 -> 로지스틱 회귀, 얕은 결정트리
- 더 큰 데이터와 더 빠른 boosting이 필요하다 -> XGBoost, LightGBM
- 범주형 변수가 많다 -> CatBoost

## 정리

- Gradient Boosting은 오차를 순차적으로 줄이는 boosting 계열 분류 모델입니다.
- `learning_rate`와 `n_estimators`를 함께 조절하는 감각이 중요합니다.
- 랜덤포레스트보다 더 강한 성능을 낼 수 있지만 검증과 튜닝이 더 중요합니다.

## 연습 문제

1. Gradient Boosting을 “오답 보완” 관점으로 설명해보세요.
2. `learning_rate`를 낮추면 왜 `n_estimators`를 같이 봐야 하는지 적어보세요.
3. 랜덤포레스트보다 boosting을 먼저 고려할 상황을 하나 적어보세요.
