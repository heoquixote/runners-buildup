## 학습 목표

- 불균형 데이터가 왜 분류 문제를 어렵게 만드는지 설명할 수 있습니다.
- `class_weight`, oversampling, undersampling, `SMOTE`의 차이를 이해할 수 있습니다.
- `SMOTE`를 언제 고려하고 언제 조심해야 하는지 판단할 수 있습니다.
- `SMOTE`를 train split 안에서만 적용해야 하는 이유를 설명할 수 있습니다.
- `SMOTE`를 전처리 순서 어디에 두는 것이 자연스러운지 말할 수 있습니다.

## 초심자용 한 줄 요약

불균형 데이터에서는 `정확도`가 쉽게 착시를 만들 수 있고, `SMOTE`는 적은 클래스를 인위적으로 보강하는 대표적인 방법이지만 `split 전에 적용하면` 검증이 왜곡될 수 있습니다.

## 불균형 데이터란 무엇인가

분류 문제에서 한 클래스가 매우 적은 경우를 말합니다.

예:

- 사기 거래 탐지: 사기 1%, 정상 99%
- 희귀 질환 판별: 양성 2%, 음성 98%
- 고객 이탈 예측: 이탈 5%, 유지 95%

이런 문제에서는 모델이 다수 클래스만 잘 맞혀도 겉보기 점수가 높아질 수 있습니다.

## 왜 문제가 되는가

예를 들어 양성이 5%뿐인 데이터에서  
모든 샘플을 그냥 음성이라고 예측해도 accuracy는 95%가 나올 수 있습니다.

하지만 이 모델은 실제 양성을 하나도 못 잡습니다.

즉, 불균형 데이터에서는 아래 문제가 자주 생깁니다.

- accuracy 착시
- minority class recall 저하
- 모델이 다수 클래스 패턴만 주로 학습
- threshold 기본값 0.5가 잘 안 맞을 수 있음

## 가장 먼저 할 일

불균형 문제가 보이면 바로 `SMOTE`부터 넣기보다 아래를 먼저 점검해야 합니다.

1. 어떤 오류가 더 비싼가
2. precision과 recall 중 무엇을 더 중시하는가
3. `PR-AUC`, `F2`, `F0.5` 같은 보조 지표가 필요한가
4. threshold 조정만으로 충분한가

즉, 불균형 데이터는 `데이터 처리 문제`이면서 동시에 `지표 설계 문제`입니다.

## 대표적인 대응 방법

### 1. class_weight

손실 함수에서 minority class 오분류에 더 큰 벌점을 주는 방식입니다.

장점:

- 원본 데이터를 그대로 유지
- 구현이 간단
- 로지스틱 회귀, 트리 계열 일부 모델에서 바로 적용 가능

단점:

- 모든 모델에서 똑같이 잘 듣는 것은 아님
- 극단적 불균형에서는 한계가 있을 수 있음

### 2. random oversampling

소수 클래스 샘플을 단순 복제해 수를 늘립니다.

장점:

- 간단함
- minority class 학습 기회를 늘림

단점:

- 같은 샘플을 반복 복제하므로 과적합 위험이 있음

### 3. random undersampling

다수 클래스 일부를 줄여 균형을 맞춥니다.

장점:

- 학습 속도가 빨라질 수 있음
- 간단함

단점:

- 정보 손실 가능성이 큼

### 4. SMOTE

`Synthetic Minority Over-sampling Technique`의 약자입니다.  
소수 클래스 샘플을 단순 복제하는 대신, 기존 minority 샘플 사이를 보간해 새로운 synthetic sample을 만듭니다.

즉, `있는 데이터를 조금 변형해 비슷한 새 소수 클래스 샘플을 만드는 방식`입니다.

## SMOTE는 어떻게 동작하나

직관적으로는 아래처럼 이해하시면 됩니다.

1. 소수 클래스 샘플 하나를 고른다
2. 가까운 소수 클래스 이웃을 찾는다
3. 두 점 사이 선분 어딘가에 새로운 샘플을 만든다

즉, minority class 공간을 조금 더 촘촘하게 채우는 방식입니다.

## 언제 유용할까

- minority class가 너무 적어 모델이 거의 학습하지 못한다
- 단순 복제보다 조금 더 일반화된 소수 클래스 보강이 필요하다
- 표 형태(tabular) 데이터에서 baseline을 빠르게 강화하고 싶다

예:

- 고객 이탈 예측
- 카드 사기 탐지
- 고장 탐지

## 언제 조심해야 할까

### 1. split 전에 전체 데이터에 먼저 적용하는 경우

가장 위험한 실수입니다.

이렇게 하면 test나 validation과 비슷한 synthetic 정보가 학습에 섞여  
점수가 비정상적으로 좋아질 수 있습니다.

원칙:

- 먼저 split
- 그다음 train에만 `SMOTE`
- validation/test는 원래 분포 유지

### 2. 범주형 변수 해석이 중요한 경우

기본 `SMOTE`는 연속형 공간에서 이웃을 만들기 때문에  
범주형 변수 구조가 많은 데이터에서는 주의가 필요합니다.

이 경우는 `SMOTENC` 같은 변형이나 다른 전략을 검토해야 합니다.

### 3. 노이즈와 이상치가 많은 경우

나쁜 minority 샘플 주변으로 synthetic sample을 더 만들면  
오히려 경계를 더 흐릴 수 있습니다.

### 4. 시계열 문제

시간 순서가 중요한 문제에서는  
단순 이웃 기반 synthetic sample 생성이 현실 구조를 잘 반영하지 못할 수 있습니다.

## class_weight와 SMOTE는 어떻게 다를까

### class_weight

- 데이터는 그대로
- 손실 함수에서 minority 실수에 더 큰 벌점

### SMOTE

- 데이터 자체를 변형
- 소수 클래스 샘플을 synthetic하게 늘림

즉, 하나는 `학습 비용 조정`, 다른 하나는 `학습 데이터 재구성`에 가깝습니다.

실무에서는 둘 중 하나만 고집하기보다

- baseline + threshold 조정
- baseline + class_weight
- baseline + SMOTE

를 나눠 비교하는 편이 더 안전합니다.

## SMOTE는 정확히 어디에 둬야 할까

실무에서는 아래 순서로 이해하시면 가장 안전합니다.

1. 문제 정의와 지표 결정
2. train/validation/test split
3. train 쪽 결측치 처리, 인코딩, 스케일링
4. 전처리된 train 데이터에만 `SMOTE`
5. 그 결과로 모델 학습
6. validation/test는 원래 분포 그대로 평가

즉, `SMOTE는 split 다음`, `모델 직전`, `train 안에서만` 들어갑니다.

## 왜 이 위치가 중요한가

### 1. split 전에 하면 안 된다

synthetic sample이 validation/test 정보와 비슷한 구조를 만들 수 있어  
평가가 과하게 좋아질 수 있습니다.

### 2. 수치형 거리 구조를 보기 때문이다

기본 `SMOTE`는 가까운 이웃을 찾아 샘플을 만들기 때문에  
수치형 스케일 차이가 크다면 전처리 뒤에 두는 편이 더 자연스럽습니다.

### 3. validation/test 분포는 현실 그대로 남겨야 한다

실제 운영 데이터는 원래 불균형한 경우가 많습니다.  
평가 데이터까지 인위적으로 바꾸면 운영 성능을 제대로 가늠하기 어렵습니다.

## 범주형이 많으면 무엇이 달라질까

기본 `SMOTE`는 연속형 공간을 가정하는 편이라  
범주형 변수가 많으면 바로 적용하기 애매할 수 있습니다.

이 경우는 아래를 함께 검토하는 편이 좋습니다.

- `SMOTENC`
- `class_weight`
- threshold 조정
- CatBoost 같은 모델 기반 대안

즉, `불균형이면 무조건 기본 SMOTE`가 아니라  
`데이터 타입에 맞는 보강 방식인가`를 같이 봐야 합니다.

## 작은 코드 예시

```python
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

model = Pipeline(
    steps=[
        ("smote", SMOTE(random_state=42)),
        ("classifier", LogisticRegression(max_iter=1000)),
    ]
)

model.fit(X_train, y_train)
pred = model.predict(X_test)

print(classification_report(y_test, pred))
```

핵심은 `SMOTE`가 `X_train`, `y_train`에 대해서만 동작해야 한다는 점입니다.

한 줄로 적으면 아래 순서입니다.

`split -> train 전처리 -> train에만 SMOTE -> 모델 학습 -> 원본 validation/test 평가`

## 평가할 때 무엇을 봐야 하나

`SMOTE`를 넣었다고 해서 무조건 좋은 것은 아닙니다.  
아래를 같이 봐야 합니다.

- recall이 실제로 개선됐는가
- precision이 지나치게 무너지지 않았는가
- `PR-AUC`, `F2`, `F0.5`가 더 적절한가
- validation/test에서도 개선이 유지되는가

즉, `minority를 더 많이 잡았다`와 `실제로 더 좋은 모델이다`는 다른 이야기입니다.

## 실무에서 자주 하는 실수

### 1. accuracy만 좋아진 것을 개선으로 착각한다

불균형 문제에서는 거의 의미 없을 수 있습니다.

### 2. SMOTE를 split 전에 적용한다

검증이 왜곡되는 대표 실수입니다.

### 3. SMOTE만 넣고 threshold는 그대로 둔다

실제 운영 의사결정은 여전히 threshold와 비용 구조에 달려 있습니다.

### 4. class_weight와 비교도 안 해본다

더 단순한 방법으로 충분할 수 있습니다.

## 정리

- 불균형 데이터에서는 정확도 착시가 매우 흔합니다.
- `SMOTE`는 소수 클래스를 synthetic하게 늘리는 대표 기법입니다.
- 하지만 `split 이후 train fold 안에서만 적용`해야 하며, `class_weight`나 threshold 조정과 비교해서 판단해야 합니다.

## 연습 문제

1. 고객 이탈 예측에서 accuracy가 왜 쉽게 착시를 만들 수 있는지 설명해보세요.
2. `class_weight`와 `SMOTE`의 차이를 한 문장씩 적어보세요.
3. `SMOTE`를 split 전에 적용하면 왜 위험한지 설명해보세요.
