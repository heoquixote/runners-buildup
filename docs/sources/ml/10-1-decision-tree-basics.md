## 학습 목표

- 결정트리가 어떻게 분기하는지 설명할 수 있습니다.
- 분류 트리와 회귀 트리의 차이를 큰 그림에서 이해할 수 있습니다.
- 주요 하이퍼파라미터가 어떤 과적합 위험을 조절하는지 설명할 수 있습니다.
- 결정트리의 장점과 한계를 말할 수 있습니다.

## 초심자용 한 줄 요약

결정트리는 `질문을 하나씩 던지며 데이터를 갈라가는 모델`입니다.

## 결정트리는 어떻게 동작하나

결정트리는 데이터를 여러 조건으로 나눠가며 예측합니다.

예:

1. 최근 30일 방문 수가 3회 이하인가
2. 최근 결제 금액이 2만 원 이하인가
3. 고객 등급이 VIP인가

이렇게 분기를 반복해 마지막 노드에서 예측을 만듭니다.

## 무엇을 기준으로 나눌까

트리는 `어떻게 나누면 더 잘 구분되는가`를 기준으로 분기합니다.

분류에서는 보통:

- Gini impurity
- entropy

회귀에서는 보통:

- 분산 감소
- MSE 감소

같은 기준을 사용합니다.

입문 단계에서는 공식보다  
`나누기 전보다 나눈 뒤가 더 순수해지도록 분기한다`고 이해하면 충분합니다.

## 분류 트리에서 자주 보는 하이퍼파라미터

- `max_depth`: 트리 최대 깊이
- `min_samples_split`: 한 번 더 분기하기 위한 최소 샘플 수
- `min_samples_leaf`: 말단 노드에 남아야 하는 최소 샘플 수
- `criterion`: `gini` 또는 `entropy`
- `class_weight`: 불균형 데이터에서 클래스 가중치 조정

직관적으로 보면:

- 트리가 너무 깊으면 복잡한 규칙까지 외우기 쉬움
- leaf에 샘플이 너무 적으면 노이즈까지 규칙처럼 학습하기 쉬움

즉, 결정트리 튜닝은 대부분 `트리를 어디까지 자라게 할 것인가` 문제입니다.

## 왜 직관적인가

- 조건문 형태라 사람이 읽기 쉽다
- 비선형 관계를 자연스럽게 다룬다
- 변수 간 상호작용을 자동으로 반영한다

즉, 선형모델이 어려워하는 `조건 조합`을 비교적 쉽게 다룹니다.

## 장점

- 전처리 부담이 상대적으로 적음
- 해석이 비교적 쉬움
- 수치형/범주형 관계를 직관적으로 다룸

## 한계

### 1. 쉽게 흔들린다

데이터가 조금만 바뀌어도 트리 구조가 달라질 수 있습니다.

### 2. 깊어지면 과적합되기 쉽다

작은 패턴과 잡음까지 외우기 쉬운 구조입니다.

### 3. 단일 트리 성능이 불안정할 수 있다

그래서 실무에서는 랜덤포레스트나 부스팅 같은 앙상블을 더 자주 씁니다.

## 언제 유용한가

- baseline 이후 비선형 패턴을 보고 싶다
- feature 간 복합 조건이 중요하다
- 설명 가능한 규칙 흐름이 어느 정도 필요하다

## 작은 코드 예시: 분류 결정트리

```python
from sklearn.datasets import load_breast_cancer
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

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

model = DecisionTreeClassifier(
    max_depth=4,
    min_samples_leaf=5,
    random_state=42,
)
model.fit(X_train, y_train)

pred = model.predict(X_test)

print(classification_report(y_test, pred))
```

이 코드에서 먼저 볼 것은 아래입니다.

- `max_depth=4`로 트리 복잡도를 제한했는가
- `min_samples_leaf=5`로 너무 작은 leaf를 막았는가
- 정확도 하나보다 `precision`, `recall`, `f1-score`를 함께 보는가

## 트리 규칙을 직접 보는 예시

결정트리는 다른 트리 앙상블보다 규칙을 직접 보기 쉽습니다.

```python
from sklearn.tree import export_text

rules = export_text(model, feature_names=list(X.columns))
print(rules)
```

이 출력은 완벽한 비즈니스 규칙 문서가 아니라  
`모델이 어떤 feature와 cutoff를 기준으로 나눴는지`를 읽는 용도라고 보시면 됩니다.

## 실무에서 언제 문제가 되는가

### 1. 깊이가 큰데 표본이 적은 경우

train 성능은 높아도 test에서 쉽게 무너질 수 있습니다.

### 2. 작은 cutoff 차이를 규칙처럼 과신하는 경우

예를 들어 `방문 수 <= 3.5` 같은 분기는  
현실 세계의 절대 법칙이 아니라 학습 데이터 기준 분할일 뿐입니다.

### 3. 데이터 분포가 자주 바뀌는 경우

트리 규칙도 학습 시점의 패턴에 묶이므로  
운영 중 분포 변화가 크면 규칙이 금방 낡을 수 있습니다.

## 정리

- 결정트리는 질문을 던지며 데이터를 나누는 모델입니다.
- 직관적이지만 흔들리기 쉬워 단일 트리만으로는 한계가 있습니다.
- `max_depth`, `min_samples_leaf` 같은 설정으로 복잡도를 조절해야 합니다.
- 그래서 보통 앙상블의 출발점으로 이해하는 편이 좋습니다.

## 연습 문제

1. 결정트리를 한 문장 비유로 설명해보세요.
2. 선형모델보다 트리가 더 잘 맞을 수 있는 예시를 하나 적어보세요.
3. 단일 결정트리의 한계를 2가지 적어보세요.
