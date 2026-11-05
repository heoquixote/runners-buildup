## 학습 목표

- LightGBM이 왜 빠른 boosting 모델로 많이 쓰이는지 설명할 수 있습니다.
- leaf-wise 성장 방식이 성능과 과적합에 어떤 영향을 주는지 큰 그림에서 이해할 수 있습니다.
- 큰 tabular 분류 데이터에서 LightGBM을 언제 고려할지 판단할 수 있습니다.

## 초심자용 한 줄 요약

LightGBM은 `큰 데이터에서 빠르고 강한 성능을 내기 쉬운 boosting 분류 모델`입니다.

## LightGBM은 어떤 점이 강할까

LightGBM은 boosting 계열 중에서도  
속도와 메모리 효율을 강하게 의식한 구현으로 많이 알려져 있습니다.

특히 아래 상황에서 자주 언급됩니다.

- 데이터 행 수가 많다
- feature 수가 많다
- 빠른 학습과 반복 실험이 중요하다

## leaf-wise 성장이라는 말은 무슨 뜻일까

직관적으로 보면 LightGBM은  
가장 손실을 많이 줄일 수 있는 leaf를 우선적으로 더 깊게 키우는 편입니다.

이 방식은 성능상 유리할 수 있지만  
작은 데이터에서는 특정 영역을 과하게 파고들어 과적합되기 쉽습니다.

즉, LightGBM은 `빠르고 강한 대신 복잡도를 잘 제어해야 하는 모델`로 볼 수 있습니다.

## 자주 보는 하이퍼파라미터

- `n_estimators`: 트리 수
- `learning_rate`: 학습 속도
- `num_leaves`: 한 트리의 leaf 수
- `max_depth`: 최대 깊이 제한
- `min_child_samples`: leaf에 필요한 최소 샘플 수
- `subsample`, `colsample_bytree`: 샘플/feature 비율

입문 단계에서는 특히 아래를 같이 보시면 됩니다.

- `num_leaves`가 너무 크지 않은가
- 작은 데이터인데 `max_depth` 제한이 없는가
- `learning_rate`와 `n_estimators` 균형이 맞는가

## 작은 코드 예시: LightGBM 분류

먼저 설치가 필요합니다.

```bash
pip install lightgbm
```

```python
from lightgbm import LGBMClassifier
from sklearn.datasets import load_breast_cancer
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

model = LGBMClassifier(
    n_estimators=300,
    learning_rate=0.05,
    num_leaves=31,
    max_depth=6,
    min_child_samples=20,
    random_state=42,
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
proba = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, pred))
print("ROC-AUC:", roc_auc_score(y_test, proba))
```

## 언제 유리한가

- tabular 분류 데이터가 크다
- 실험 반복 속도가 중요하다
- boosting 계열 성능을 원하지만 학습 시간을 줄이고 싶다

## 실무에서 언제 문제가 되는가

### 1. 작은 데이터에 leaf를 너무 크게 키우는 경우

LightGBM은 빠르게 강해지지만  
작은 표본에서는 특정 구간을 과하게 학습할 수 있습니다.

### 2. 속도만 보고 검증을 약하게 하는 경우

빨리 학습된다고 해서  
평가 기준이 느슨해지면 validation 과적합을 놓치기 쉽습니다.

### 3. 범주형 처리 전략을 애매하게 가져가는 경우

환경에 따라 전처리 방식이 달라질 수 있으므로  
실험 설계를 일관되게 유지하는 편이 중요합니다.

## 대안은 무엇인가

- 더 안정적인 레퍼런스가 많고 보수적 선택이 좋다 -> XGBoost
- 범주형 전처리를 더 줄이고 싶다 -> CatBoost
- 튜닝 부담이 적은 강한 baseline이 좋다 -> 랜덤포레스트

## 정리

- LightGBM은 빠르고 강한 boosting 분류 모델입니다.
- 큰 데이터에서 특히 매력적이지만 leaf-wise 성장 때문에 과적합 제어가 중요합니다.
- `num_leaves`, `max_depth`, `min_child_samples`를 함께 보는 습관이 중요합니다.

## 연습 문제

1. LightGBM이 큰 데이터에서 자주 언급되는 이유를 적어보세요.
2. `num_leaves`가 너무 크면 어떤 문제가 생길 수 있는지 설명해보세요.
3. XGBoost 대신 LightGBM을 먼저 고려할 상황을 하나 적어보세요.
