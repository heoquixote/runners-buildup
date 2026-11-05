## 학습 목표

- 머신러닝 프로젝트의 기본 흐름을 단계별로 설명할 수 있습니다.
- `fit`, `predict`, `score`의 의미를 이해할 수 있습니다.
- baseline 모델을 먼저 만드는 이유를 설명할 수 있습니다.
- 결측치 처리, 범주형 인코딩, 스케일링 순서를 Pipeline으로 관리해야 하는 이유를 설명할 수 있습니다.
- 모델링보다 평가 설계가 먼저라는 감각을 익힐 수 있습니다.

## 초심자용 한 줄 요약

좋은 머신러닝 실습은 `복잡한 모델을 빨리 쓰는 것`이 아니라 `작은 baseline을 정확한 절차로 검증하는 것`에서 시작합니다.

## 오늘의 목표

오늘은 scikit-learn 기준으로 머신러닝의 기본 작업 흐름을 익힙니다.

- 문제 정의부터 평가까지 전체 흐름을 한 번에 봅니다.
- 가장 작은 동작 예제를 직접 실행할 수 있게 합니다.
- 결측치 처리 같은 기본 전처리도 같은 흐름 안에서 이해합니다.
- 초보자가 자주 하는 실수도 함께 정리합니다.

## 머신러닝 기본 파이프라인

입문 단계에서는 아래 순서를 몸에 익히는 것이 중요합니다.

1. 문제 정의
2. 데이터 준비
3. feature/label 분리
4. train/test 분리
5. baseline 모델 학습
6. 예측
7. 평가
8. 개선

많은 분이 5번 `모델 학습`부터 시작하지만, 실제 실패는 보통 1번, 2번, 7번에서 많이 납니다.

## `fit`과 `predict`

scikit-learn 모델은 대체로 같은 패턴을 따릅니다.

- `fit(X_train, y_train)`: 학습
- `predict(X_test)`: 예측값 생성
- `predict_proba(X_test)`: 클래스 확률 예측

즉, 라이브러리를 바꿔도 기본 사고 흐름은 크게 달라지지 않습니다.

## 작은 분류 예제

```python
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

iris = load_iris(as_frame=True)
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)

print(f"accuracy: {acc:.3f}")
```

이 코드는 짧지만 머신러닝의 핵심 흐름을 모두 담고 있습니다.

- 데이터를 준비합니다.
- 학습용과 평가용으로 나눕니다.
- 모델을 학습시킵니다.
- 새로운 데이터에 대해 예측합니다.
- 실제 정답과 비교해 성능을 확인합니다.

## baseline이 왜 중요한가

baseline은 `비교 기준이 되는 가장 단순한 모델`입니다.

예:

- 회귀: 평균값만 예측하는 모델
- 분류: 가장 많이 등장한 클래스를 계속 예측하는 모델
- 간단한 선형모델 또는 얕은 트리

baseline이 필요한 이유는 다음과 같습니다.

- 복잡한 모델이 정말 나아졌는지 판단할 수 있습니다.
- 데이터와 지표가 정상인지 빠르게 점검할 수 있습니다.
- 과도한 모델 탐색을 줄일 수 있습니다.

복잡한 모델이 baseline보다 조금만 좋아진다면,  
운영 복잡도와 해석 비용을 생각했을 때 오히려 baseline이 더 나은 선택일 수 있습니다.

## 평가를 먼저 정해야 하는 이유

같은 모델도 어떤 지표를 쓰느냐에 따라 좋아 보이기도 하고 나빠 보이기도 합니다.

예:

- 사기 탐지: `recall`이 더 중요할 수 있음
- 광고 클릭 예측: `log loss`나 `AUC`가 더 유용할 수 있음
- 매출 예측: `MAE`, `RMSE` 해석이 중요할 수 있음

그래서 모델을 고르기 전에 먼저 아래를 정해야 합니다.

- 어떤 오류가 더 비싼가
- 어떤 지표가 그 비용 구조를 반영하는가
- 운영에서는 확률 예측이 필요한가, 최종 클래스만 필요할까

## 데이터 전처리는 왜 pipeline으로 묶는가

실무에서는 결측치 처리, 이상치 점검, 인코딩, 스케일링이 학습/예측 단계에서 일관되게 적용되어야 합니다.  
이때 `Pipeline`을 쓰면 학습 과정과 예측 과정이 같은 순서로 재현됩니다.

간단한 예시는 아래와 같습니다.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

pipeline = Pipeline(
    steps=[
        ("scaler", StandardScaler()),
        ("model", LogisticRegression(max_iter=1000)),
    ]
)

pipeline.fit(X_train, y_train)
pred = pipeline.predict(X_test)
```

입문 단계에서는 “왜 굳이 pipeline을 쓰지?” 싶을 수 있지만,  
전처리와 모델을 따로 관리하면 재현성과 누수 관리가 어려워집니다.

실제 전처리 순서는 보통 아래 흐름으로 보는 편이 안전합니다.

1. train/test split
2. 결측치 처리
3. 이상치와 분포 점검
4. 범주형 인코딩
5. 수치형 스케일링
6. 모델 학습

이 구체적인 비교는 `03-3. 결측치 데이터 처리와 KNN Imputation`,  
`03-4. 범주형 변수 인코딩과 데이터 전처리 순서`,  
`04. 데이터 스케일링과 feature 변환`에서 이어서 다룹니다.

## 초보자가 자주 하는 실수

### 1. test 데이터를 계속 보면서 모델을 바꾸는 경우

이렇게 되면 test가 사실상 validation처럼 오염됩니다.  
최종 성능을 믿기 어려워집니다.

### 2. baseline 없이 복잡한 모델부터 시도하는 경우

성능이 좋아 보여도 정말 개선인지 판단하기 어렵습니다.

### 3. feature engineering보다 모델 바꾸기에만 집중하는 경우

현업에서는 모델 교체보다 데이터 정리와 feature 개선이 더 큰 차이를 만드는 경우가 많습니다.

### 4. 지표 하나만 보고 끝내는 경우

정확도가 높아도 특정 클래스는 거의 못 맞힐 수 있습니다.  
그래서 분류는 혼동행렬, precision, recall도 함께 봐야 합니다.

## 실무에서 언제 문제가 되는가

### 1. 개발 환경에서는 잘 되는데 운영 데이터에서 깨지는 경우

컬럼 순서, 인코딩 방식, 결측치 처리 규칙이 다르면 운영 예측이 흔들립니다.  
Pipeline과 전처리 저장은 이런 문제를 줄여줍니다.

### 2. 데이터 양이 적은데 성능 수치만 과신하는 경우

표본이 작으면 분할에 따라 점수가 크게 흔들릴 수 있습니다.  
이때는 교차검증이나 반복 실험이 더 중요해집니다.

### 3. 문제 정의가 모호한 경우

예측 성능보다 “이 예측을 어디에 쓸 것인가”가 불명확하면 프로젝트가 끝까지 가기 어렵습니다.

## 대안은 무엇인가

모든 상황에서 scikit-learn 파이프라인이 정답은 아닙니다.

- 룰 기반 baseline
- 통계 모델링
- 시계열 전용 라이브러리
- 딥러닝 프레임워크

다만 입문 단계에서는 scikit-learn이 가장 좋은 이유가 있습니다.

- API가 일관적이다
- 회귀/분류/클러스터링을 넓게 다룰 수 있다
- 실험 흐름을 배우기에 좋다

## 연습 문제

1. `fit`과 `predict`의 역할 차이를 설명해보세요.
2. baseline 모델이 없는 상태에서 모델 성능을 평가하면 어떤 문제가 생길 수 있는지 적어보세요.
3. 현재 업무 문제 하나를 골라 `문제 정의 -> label -> 지표` 순으로 한 줄씩 적어보세요.

## 과제

- `★` scikit-learn 내장 데이터셋 하나를 골라 train/test split부터 accuracy 또는 MAE 계산까지 실행해보세요.
- `★★` baseline 모델과 다른 모델 하나를 비교해 점수 차이를 적어보세요.
- `★★★` 그 차이가 운영 복잡도를 감수할 만큼 의미 있는지 본인 기준으로 설명해보세요.
