## 학습 목표

- 랜덤포레스트가 왜 단일 트리보다 안정적인지 설명할 수 있습니다.
- bagging이 무엇을 줄이기 위한 접근인지 이해할 수 있습니다.
- 랜덤포레스트를 분류 문제에서 언제 고려하면 좋은지 판단할 수 있습니다.

## 초심자용 한 줄 요약

랜덤포레스트는 `여러 결정트리를 평균 내서 단일 트리의 흔들림을 줄이는 분류 모델`입니다.

## 랜덤포레스트

랜덤포레스트는 여러 결정트리를 만들고 결과를 평균 또는 투표로 합칩니다.

핵심 아이디어:

- 데이터 샘플을 조금씩 다르게 뽑는다
- feature도 일부만 골라 트리를 만든다
- 여러 트리 결과를 합쳐 안정성을 높인다

즉, 단일 트리의 흔들림을 줄이기 위한 `bagging` 계열 접근입니다.

## 왜 안정성이 좋아질까

- 한 트리가 과하게 반응한 패턴을 다른 트리들이 평균 내줌
- 데이터 샘플과 feature를 나눠 쓰기 때문에 특정 컬럼에 덜 과도하게 매달림
- 개별 트리는 약해도 합치면 예측이 더 안정적임

즉, 랜덤포레스트는 `한 명의 예민한 판단`보다  
`여러 명의 조금씩 다른 판단을 평균 내는 구조`에 가깝습니다.

## 분류 문제에서 자주 보는 하이퍼파라미터

- `n_estimators`: 트리 개수
- `max_depth`: 각 트리 최대 깊이
- `max_features`: 각 분기에서 볼 feature 수
- `min_samples_leaf`: leaf 최소 샘플 수
- `class_weight`: 불균형 분류에서 가중치 조정

보통은 `트리 수를 늘리고`, `깊이를 너무 깊지 않게 제한하며`,  
검증 점수로 과적합 여부를 확인합니다.

## 작은 코드 예시: 랜덤포레스트 분류

```python
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
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

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=6,
    min_samples_leaf=3,
    random_state=42,
    n_jobs=-1,
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
proba = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, pred))
print("ROC-AUC:", roc_auc_score(y_test, proba))
```

이 코드에서 핵심은 아래입니다.

- `n_estimators`를 늘려도 무조건 좋아지지는 않는가
- `max_depth`를 너무 크게 잡아 개별 트리를 과하게 복잡하게 만들지 않았는가
- 확률 출력까지 함께 보고 있는가

## feature importance는 어떻게 볼까

```python
import pandas as pd

importance = pd.Series(model.feature_importances_, index=X.columns)
print(importance.sort_values(ascending=False).head(10))
```

다만 이 값은 아래처럼 읽는 편이 안전합니다.

- 모델이 자주 참고한 변수
- 현재 데이터 분포에서 분기에 도움을 준 변수

즉, `진짜 원인 변수`라고 단정하면 안 됩니다.

## feature importance 해석 주의

트리 앙상블은 feature importance를 쉽게 보여주지만  
이를 곧바로 인과관계로 읽으면 위험합니다.

주의:

- 중요도가 높다고 원인은 아님
- 상관된 변수끼리 중요도가 나뉠 수 있음
- 데이터 분포가 바뀌면 중요도도 달라질 수 있음

## 실무에서 자주 생기는 문제

### 1. 트리 개수만 늘리면 무조건 좋아질 것이라고 생각한다

트리 수를 늘리면 계산량은 커지지만  
데이터 품질 한계까지 해결되지는 않습니다.

### 2. validation 없이 하이퍼파라미터만 많이 만진다

점점 validation에도 과적합될 수 있습니다.

### 3. importance를 business causal story로 과장한다

importance는 `모델이 참고한 정도`로 먼저 읽는 편이 안전합니다.

### 4. 아주 큰 데이터에서 학습 시간이 길어진다

랜덤포레스트는 안정적이지만  
아주 큰 데이터에서는 boosting 계열보다 느리거나 메모리를 더 쓸 수 있습니다.

## 정리

- 랜덤포레스트는 여러 트리 평균으로 안정성을 높이는 분류 모델입니다.
- 단일 결정트리보다 과적합이 덜하고 baseline 다음 단계로 좋습니다.
- 다만 importance 해석과 검증 체계는 여전히 조심해야 합니다.

## 연습 문제

1. 랜덤포레스트가 단일 결정트리보다 안정적인 이유를 적어보세요.
2. `n_estimators`와 `max_depth`가 각각 무엇을 조절하는지 적어보세요.
3. feature importance를 해석할 때 왜 조심해야 하는지 적어보세요.
