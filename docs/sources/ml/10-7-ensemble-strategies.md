## 학습 목표

- 앙상블이 왜 단일 모델보다 자주 강한 성능을 내는지 설명할 수 있습니다.
- `Bagging`, `Boosting`, `Stacking`, `Voting`의 차이를 구조적으로 구분할 수 있습니다.
- 랜덤포레스트와 Gradient Boosting이 각각 어떤 앙상블 계열인지 연결할 수 있습니다.
- `Voting`와 `Stacking`이 트리 전용이 아니라 여러 모델 조합 전략이라는 점을 이해할 수 있습니다.
- `Stacking`에서 데이터 누수가 왜 특히 위험한지 설명할 수 있습니다.

## 초심자용 한 줄 요약

앙상블은 `여러 모델을 합쳐 더 안정적이거나 더 강한 예측을 만들려는 방법`이며, 대표 구조가 `Bagging`, `Boosting`, `Stacking`, `Voting`입니다.

## 왜 앙상블을 쓰나

단일 모델은 아래 한계가 자주 있습니다.

- 특정 split에 너무 민감하다
- 일부 패턴은 잘 잡지만 다른 패턴은 놓친다
- 예측이 흔들리거나 편향이 있다

앙상블은 이런 문제를 줄이기 위해  
여러 모델의 판단을 결합합니다.

직관적으로는 아래처럼 생각하시면 됩니다.

- 한 명의 판단보다 여러 판단이 더 안정적일 수 있다
- 서로 다른 관점을 합치면 놓치는 패턴이 줄 수 있다
- 잘못된 편향을 평균 내거나 보완할 수 있다

## 큰 구조를 먼저 보면

앙상블은 보통 아래 4가지 질문으로 구분할 수 있습니다.

1. 같은 모델을 여러 번 만들어 평균 내는가
2. 앞 모델의 오차를 뒤 모델이 계속 보완하는가
3. 서로 다른 모델의 최종 답만 단순히 합치는가
4. 여러 모델의 예측을 다시 다른 모델이 학습하는가

각 질문에 대응하는 대표 방식이 아래입니다.

- `Bagging`
- `Boosting`
- `Voting`
- `Stacking`

## Bagging

`Bagging = Bootstrap Aggregating`

핵심 아이디어:

- 데이터를 조금씩 다르게 뽑아 여러 모델을 학습
- 각 모델 예측을 평균 또는 투표로 합침

직관:

- 여러 사람이 각자 조금 다른 표본을 보고 판단
- 마지막에는 다수결 또는 평균으로 정리

무엇을 줄이려 하나:

- 주로 `variance`, 즉 모델의 흔들림

대표 예:

- `Random Forest`

장점:

- 성능이 비교적 안정적
- 과적합을 줄이는 데 도움이 됨
- 튜닝 부담이 boosting보다 덜한 편

한계:

- 강한 편향 자체를 크게 줄이지는 못할 수 있음
- 모델이 커질 수 있음

## Boosting

핵심 아이디어:

- 모델을 순서대로 추가
- 앞 단계가 틀린 부분을 뒤 단계가 보완

직관:

- 틀린 문제를 복습하면서 점점 나아지는 방식

무엇을 줄이려 하나:

- 주로 `bias`와 잔여 오차를 줄이려는 방향

대표 예:

- `Gradient Boosting`
- `XGBoost`
- `LightGBM`
- `CatBoost`

장점:

- tabular 데이터에서 매우 강한 성능을 내는 경우가 많음
- 비선형성과 상호작용을 잘 잡음

한계:

- 튜닝 민감도가 큼
- 과적합과 학습 시간에 더 주의해야 함
- 운영 복잡도가 bagging보다 커질 수 있음

## Voting

`Voting`은 서로 다른 여러 모델의 최종 예측을  
비교적 단순한 방식으로 합치는 전략입니다.

예:

- 로지스틱 회귀
- 랜덤포레스트
- XGBoost

세 모델이 각각 예측한 뒤,  
최종적으로 다수결 또는 평균 확률로 결론을 냅니다.

### Hard Voting

- 각 모델의 최종 클래스 라벨로 다수결

예:

- 모델 A: 1
- 모델 B: 0
- 모델 C: 1
- 최종: 1

### Soft Voting

- 각 모델의 예측 확률 평균을 사용

예:

- 모델 A: 0.80
- 모델 B: 0.40
- 모델 C: 0.70
- 평균: 0.63

보통 확률 품질이 어느 정도 괜찮다면  
`Soft Voting`이 더 유연하게 쓰이는 편입니다.

다만 soft voting은 각 모델 확률이 너무 왜곡되어 있으면  
평균값도 함께 흔들릴 수 있습니다.

장점:

- 구현이 단순함
- 서로 다른 모델 장점을 쉽게 섞을 수 있음
- baseline보다 약간 더 안정적일 수 있음

한계:

- 모델별 신뢰도를 자동으로 잘 학습하는 것은 아님
- 나쁜 모델을 같이 넣으면 오히려 성능이 흐려질 수 있음

## Stacking

`Stacking`은 여러 모델의 예측값을  
다시 새로운 모델의 입력으로 넣는 방식입니다.

즉, 구조가 아래처럼 한 단계 더 복잡합니다.

1. 1차 모델 여러 개를 학습한다
2. 각 모델의 예측값을 만든다
3. 그 예측값들을 모아 2차 모델이 최종 판단한다

예:

- 1차 모델: 로지스틱 회귀, 랜덤포레스트, LightGBM
- 2차 모델: 로지스틱 회귀

직관:

- 각 전문가의 의견을 그대로 평균 내지 않고
- 어떤 전문가를 언제 더 믿을지 별도 조정 모델이 배우는 구조

장점:

- 서로 다른 모델의 강점을 더 정교하게 결합할 수 있음
- 잘 설계하면 voting보다 더 좋은 성능이 나올 수 있음

한계:

- 구조가 복잡함
- 검증 설계를 잘못하면 누수가 생기기 쉬움
- 디버깅과 운영이 더 어려움

## Stacking에서 왜 누수가 특히 위험한가

Stacking에서 가장 중요한 주의점은  
`meta model`이 본인이 학습에 쓴 데이터의 예측값을 그대로 받으면 안 된다는 점입니다.

예를 들어:

- base model을 전체 train에 학습
- 그 같은 train 데이터에 대한 예측값을 다시 meta model에 사용

이렇게 하면 meta model은  
실전보다 훨씬 낙관적인 예측값을 보고 학습하게 됩니다.

안전한 원칙:

1. cross validation으로 fold를 나눈다
2. 각 validation fold에 대해 out-of-fold prediction을 만든다
3. 이 예측값으로 meta model을 학습한다

즉, stacking은 `누수 방지가 설계의 핵심`입니다.

## 4가지 방식을 표로 비교하면

| 방식 | 결합 방식 | 대표 예 | 주된 강점 | 주의점 |
| --- | --- | --- | --- | --- |
| `Bagging` | 여러 모델 평균/투표 | Random Forest | 흔들림 감소 | 편향 자체는 크게 안 줄 수 있음 |
| `Boosting` | 오차를 순차 보완 | XGBoost, LightGBM | 높은 성능 | 튜닝 민감 |
| `Voting` | 서로 다른 모델의 최종 답 결합 | VotingClassifier | 단순하고 빠름 | 가중 학습이 단순 |
| `Stacking` | 모델 예측을 다시 모델에 입력 | StackingClassifier | 조합 유연성 | 누수, 운영 복잡도 |

## 작은 코드 예시: Voting

```python
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

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

voting_model = VotingClassifier(
    estimators=[
        ("lr", Pipeline([
            ("scaler", StandardScaler()),
            ("model", LogisticRegression(max_iter=1000)),
        ])),
        ("rf", RandomForestClassifier(n_estimators=200, random_state=42)),
        ("gb", GradientBoostingClassifier(random_state=42)),
    ],
    voting="soft",
)

voting_model.fit(X_train, y_train)
proba = voting_model.predict_proba(X_test)[:, 1]

print("Voting ROC-AUC:", roc_auc_score(y_test, proba))
```

## 작은 코드 예시: Stacking

```python
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier

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

stacking_model = StackingClassifier(
    estimators=[
        ("rf", RandomForestClassifier(n_estimators=200, random_state=42)),
        ("gb", GradientBoostingClassifier(random_state=42)),
    ],
    final_estimator=LogisticRegression(max_iter=1000),
    cv=5,
)

stacking_model.fit(X_train, y_train)
proba = stacking_model.predict_proba(X_test)[:, 1]

print("Stacking ROC-AUC:", roc_auc_score(y_test, proba))
```

이 코드에서 중요한 것은  
`StackingClassifier`가 내부적으로 교차검증 기반 예측 흐름을 사용한다는 점입니다.

## 실무에서 언제 어떤 방식을 먼저 보나

### Bagging을 먼저 볼 때

- 단일 트리가 너무 흔들린다
- 안정적인 baseline 다음 단계가 필요하다
- 튜닝 복잡도를 너무 높이고 싶지 않다

### Boosting을 먼저 볼 때

- tabular 성능이 중요하다
- 비선형성과 상호작용이 강하다
- 튜닝과 검증 시간을 어느 정도 확보할 수 있다

### Voting을 먼저 볼 때

- 이미 성격이 다른 모델 후보가 몇 개 있다
- 복잡한 메타 모델 없이 조합 효과를 보고 싶다
- 빠르게 앙상블 baseline을 만들고 싶다

### Stacking을 먼저 볼 때

- 서로 다른 모델의 강점이 뚜렷하다
- 검증 체계를 엄격히 설계할 수 있다
- 운영 복잡도를 감당할 수 있다

## 실무에서 자주 생기는 문제

### 1. 앙상블이면 무조건 좋아질 거라고 생각하는 경우

비슷한 모델만 많이 묶으면 정보가 크게 늘지 않을 수 있습니다.

### 2. Voting에 약한 모델까지 무작정 넣는 경우

성능이 나쁜 모델은 평균을 흐릴 수 있습니다.

### 3. Stacking에서 누수를 만든 경우

겉보기 점수는 아주 좋아 보여도  
실전 성능은 급격히 떨어질 수 있습니다.

### 4. 운영 복잡도를 과소평가하는 경우

모델이 많아질수록 학습, 저장, API 응답, 디버깅, 모니터링도 복잡해집니다.

## 정리

- `Bagging`은 여러 모델 평균으로 흔들림을 줄이는 방식입니다.
- `Boosting`은 오차를 순차적으로 줄이며 강한 성능을 노리는 방식입니다.
- `Voting`은 여러 모델의 최종 답을 단순 결합하는 전략입니다.
- `Stacking`은 여러 모델 예측을 다시 학습해 더 정교하게 결합하는 전략입니다.
- 실무에서는 성능뿐 아니라 누수 위험, 해석, 운영 복잡도까지 함께 봐야 합니다.

## 연습 문제

1. `Bagging`과 `Boosting`의 차이를 `안정성`과 `성능 강화` 관점에서 설명해보세요.
2. `Hard Voting`과 `Soft Voting`이 어떻게 다른지 예측 확률 관점에서 설명해보세요.
3. `Stacking`에서 왜 out-of-fold prediction이 중요한지 적어보세요.
4. 본인 업무 데이터에서 Voting과 Stacking 중 무엇이 더 현실적인지 이유와 함께 적어보세요.
