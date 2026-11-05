## 학습 목표

- XGBoost가 일반 Gradient Boosting보다 왜 자주 선택되는지 설명할 수 있습니다.
- 규제와 subsampling이 분류 성능에 어떤 도움을 주는지 큰 그림에서 이해할 수 있습니다.
- XGBoost를 tabular 분류 문제에서 언제 고려할지 판단할 수 있습니다.

## 초심자용 한 줄 요약

XGBoost는 `데이터가 커지고 정확도 경쟁력이 중요해질 때 자주 떠올리는 실무형 boosting 분류 모델`입니다.

## XGBoost는 왜 유명할까

Gradient Boosting의 기본 아이디어는 좋지만  
실무에서는 속도, 규제, 결측치 처리, 튜닝 편의성이 더 중요해집니다.

XGBoost는 이런 요구를 잘 반영해  
tabular 데이터 대회와 실무에서 오랫동안 강한 선택지로 쓰여 왔습니다.

주로 아래 이유 때문에 많이 언급됩니다.

- boosting 성능이 강한 편
- 규제 옵션이 다양함
- 결측치 처리에 비교적 유연함
- 예제와 레퍼런스가 많음

## Gradient Boosting과 무엇이 다른가

- 더 강한 정규화 옵션을 제공
- 학습 최적화가 잘 되어 있음
- `subsample`, `colsample_bytree` 같은 설정으로 과적합 제어를 세밀하게 함

즉, 단순 boosting보다 `더 세밀하게 통제 가능한 실무형 버전`에 가깝습니다.

## 자주 보는 하이퍼파라미터

- `n_estimators`: 트리 수
- `learning_rate`: 학습 속도
- `max_depth`: 각 트리 깊이
- `subsample`: 각 단계에서 사용할 데이터 비율
- `colsample_bytree`: 각 트리에서 사용할 feature 비율
- `reg_lambda`: L2 규제 강도

실무에서는 보통 아래를 먼저 봅니다.

- 깊이를 너무 키우지 않았는가
- subsample과 feature sampling으로 과적합을 줄였는가
- learning rate를 낮춘 만큼 트리 수를 충분히 주었는가

## 작은 코드 예시: XGBoost 분류

먼저 설치가 필요합니다.

```bash
pip install xgboost
```

```python
from sklearn.datasets import load_breast_cancer
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

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

model = XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1.0,
    random_state=42,
    eval_metric="logloss",
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
proba = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, pred))
print("ROC-AUC:", roc_auc_score(y_test, proba))
```

## 언제 유리한가

- 데이터가 어느 정도 크고 tabular 분류 정확도가 중요하다
- tabular 분류에서 성능 경쟁력이 중요하다
- baseline과 랜덤포레스트보다 한 단계 더 높은 성능을 노린다
- 결측치와 비선형 패턴이 함께 있는 편이다

즉, `데이터가 크다 -> XGBoost를 먼저 떠올린다`는 감각은  
실무에서 꽤 자주 맞는 출발점입니다.

다만 아주 큰 데이터에서 학습 속도가 특히 중요하면  
LightGBM이 더 먼저 검토될 수도 있습니다.

## 실무에서 자주 생기는 문제

### 1. 파라미터를 많이 만지기만 하고 검증 체계가 약한 경우

XGBoost는 튜닝 자유도가 크지만  
그만큼 validation set에도 과적합되기 쉽습니다.

### 2. 작은 데이터에 너무 복잡한 설정을 쓰는 경우

깊은 트리와 많은 단계는 작은 데이터에서 오히려 불안정할 수 있습니다.

### 3. importance를 인과처럼 해석하는 경우

성능이 높아도  
feature importance는 여전히 `모델 기준 중요도`일 뿐입니다.

## 대안은 무엇인가

- 더 단순하고 빠른 baseline이 필요하다 -> 랜덤포레스트
- 큰 데이터에서 더 빠른 학습이 중요하다 -> LightGBM
- 범주형 전처리를 줄이고 싶다 -> CatBoost
- 해석이 더 중요하다 -> 로지스틱 회귀

## 정리

- XGBoost는 boosting을 실무적으로 강화한 대표적인 분류 모델입니다.
- 성능과 안정성 사이 균형이 좋아 많이 쓰입니다.
- 다만 파라미터가 많아서 검증 체계를 함께 가져가는 것이 중요합니다.

## 연습 문제

1. XGBoost가 일반 Gradient Boosting보다 실무에서 자주 언급되는 이유를 적어보세요.
2. `subsample`과 `colsample_bytree`가 왜 과적합 완화에 도움이 되는지 설명해보세요.
3. 랜덤포레스트 대신 XGBoost를 택할 상황을 하나 적어보세요.
