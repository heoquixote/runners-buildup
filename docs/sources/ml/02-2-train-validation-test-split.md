## 학습 목표

- train, validation, test의 역할을 구분할 수 있습니다.
- validation과 test를 왜 따로 두는지 설명할 수 있습니다.
- 랜덤 분할, 계층 분할, 시계열 분할, 그룹 분할을 언제 다르게 써야 하는지 이해할 수 있습니다.

## 초심자용 한 줄 요약

데이터 분할은 `모델 점수를 예쁘게 만드는 절차`가 아니라 `진짜 새 데이터에서 얼마나 버티는지 확인하는 절차`입니다.

## 왜 데이터를 나누는가

모델은 학습 데이터에서 패턴을 배웁니다.  
그래서 같은 데이터로 평가까지 하면 점수가 지나치게 좋게 보일 수 있습니다.

이를 막기 위해 보통 데이터를 나눕니다.

- train: 모델 학습
- validation: 모델 선택, threshold 조정, 튜닝
- test: 최종 성능 확인

핵심은 `한 번도 보지 않은 데이터에서 얼마나 잘 맞히는가`입니다.

## train / validation / test 역할

### train

모델 파라미터를 학습하는 구간입니다.

### validation

아래 의사결정에 사용합니다.

- 어떤 모델을 쓸지
- 어떤 하이퍼파라미터가 좋은지
- threshold를 어디에 둘지

### test

마지막에 딱 한 번, 최종 성적표처럼 확인합니다.

validation을 많이 만지다 보면 validation에도 맞춰지므로  
진짜 최종 평가는 test에서 보는 것이 안전합니다.

## validation과 test를 왜 따로 봐야 할까

입문 단계에서는 둘 다 “평가 데이터”처럼 보여 헷갈릴 수 있습니다.  
하지만 역할은 다릅니다.

- validation: 실험 중간의 의사결정용
- test: 실험이 끝난 뒤 최종 확인용

만약 test 점수를 보면서 threshold나 파라미터를 계속 바꾸면  
test도 사실상 validation처럼 사용한 것이 됩니다.

즉, `test는 마지막까지 아껴두는 데이터`라고 이해하시면 좋습니다.

## 랜덤 분할이 항상 정답은 아니다

입문 예제에서는 `train_test_split()`을 많이 쓰지만  
실무 데이터는 시간 순서를 고려해야 할 때가 많습니다.

### 랜덤 분할이 적합한 경우

- 샘플 간 순서 의미가 약하다
- iid 가정이 크게 깨지지 않는다

### 시간 기준 분할이 필요한 경우

- 이탈 예측
- 수요 예측
- 주간 매출 예측
- 로그 기반 행동 예측

예를 들어 2025년 데이터를 학습하고 2026년 데이터를 평가해야 하는데  
랜덤으로 섞어버리면 미래 패턴이 학습에 섞일 수 있습니다.

## 계층 분할(stratified split)은 왜 쓰나

이진 분류처럼 클래스 비율이 중요한 문제에서는  
train과 test의 양성 비율이 너무 달라지면 평가가 흔들릴 수 있습니다.

예를 들어 전체 데이터에서 양성이 5%인데  
test에는 우연히 1%만 들어가면 점수 해석이 왜곡될 수 있습니다.

그래서 분류 문제에서는 `stratify=y`를 자주 사용합니다.

## 그룹 분할(group split)은 언제 필요할까

고객 단위 일반화가 목표인데  
같은 고객의 여러 행이 train과 test에 모두 들어가면 평가가 과대해질 수 있습니다.

예:

- 한 고객의 여러 일자 로그
- 한 환자의 여러 검사 기록
- 한 상품의 여러 거래 이력

이때는 행 기준 랜덤 분할보다  
`고객/환자/상품 단위`로 묶어서 나누는 것이 더 맞습니다.

## 작은 코드 예시: 기본 분할과 계층 분할

```python
from sklearn.datasets import load_breast_cancer
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

print(y.value_counts(normalize=True))
print(y_train.value_counts(normalize=True))
print(y_test.value_counts(normalize=True))
```

이 코드에서 중요한 것은 아래입니다.

- 전체 클래스 비율과 train/test 비율이 크게 어긋나지 않는가
- 평가 데이터가 너무 작아 우연에 흔들리지 않는가
- 분할 방식이 문제 구조와 맞는가

## 시계열 분할은 어떻게 다를까

시계열에서는 보통 과거로 학습하고 미래로 평가합니다.

```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)

for train_idx, valid_idx in tscv.split(X):
    print(train_idx[:3], valid_idx[:3])
```

핵심은 `미래가 과거 학습에 섞이지 않게 하는 것`입니다.

## 분할에서 자주 쓰는 기준 정리

- 샘플 순서 의미가 약함 -> 랜덤 분할
- 분류 비율 유지가 중요함 -> 계층 분할
- 시간축이 중요함 -> 시계열 분할
- 같은 엔터티가 여러 번 등장함 -> 그룹 분할

## 실무에서 자주 생기는 문제

### 1. 같은 고객이 train과 test에 함께 들어가는 경우

고객 단위 일반화가 목표라면 점수가 과대평가될 수 있습니다.

### 2. 시간을 무시하고 랜덤으로 섞는 경우

실제 운영은 미래 예측인데  
평가가 과거-미래 구조를 반영하지 못할 수 있습니다.

### 3. test를 여러 번 열어보며 모델을 바꾸는 경우

이 경우는 test가 더 이상 최종 성적표가 아닙니다.

## 정리

- split의 목적은 `새 데이터 일반화 성능`을 보기 위한 것입니다.
- validation은 실험용, test는 최종 확인용으로 구분해야 합니다.
- 랜덤 분할이 기본이지만 시간축과 그룹 구조가 있으면 다른 분할을 써야 합니다.

## 연습 문제

1. validation과 test의 역할 차이를 한 문장씩 적어보세요.
2. 랜덤 분할보다 시계열 분할이 적합한 예시를 하나 설명해보세요.
3. 같은 고객 로그가 여러 행으로 있는 데이터에서 왜 그룹 분할이 필요할 수 있는지 적어보세요.
