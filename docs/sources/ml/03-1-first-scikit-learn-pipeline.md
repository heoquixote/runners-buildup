## 학습 목표

- scikit-learn의 기본 학습 흐름을 단계별로 설명할 수 있습니다.
- `fit`, `predict`, `predict_proba`의 차이를 이해할 수 있습니다.
- 첫 실습에서 무엇을 확인해야 하는지 알 수 있습니다.

## 초심자용 한 줄 요약

처음 실습할 때는 `복잡한 모델`보다 `문제 정의 -> split -> fit -> predict -> 평가` 흐름을 정확히 몸에 익히는 것이 더 중요합니다.

## scikit-learn 기본 흐름

scikit-learn 예제는 대부분 아래 순서를 따릅니다.

1. 데이터 준비
2. feature와 label 분리
3. train/test 분리
4. 모델 생성
5. `fit()`으로 학습
6. `predict()` 또는 `predict_proba()`로 예측
7. 지표로 평가

이 순서를 먼저 머리에 넣으면 모델이 바뀌어도 실습 흐름이 크게 흔들리지 않습니다.

## 핵심 메서드 3개

### `fit(X_train, y_train)`

학습 데이터로 모델 파라미터를 추정합니다.

### `predict(X_test)`

최종 예측값을 만듭니다.

- 회귀: 숫자
- 분류: 클래스

### `predict_proba(X_test)`

분류 문제에서 클래스 확률을 돌려줍니다.  
threshold 조정이나 ROC-AUC 계산에 자주 필요합니다.

## 가장 작은 예시

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
print("accuracy:", accuracy_score(y_test, pred))
```

이 코드에서 꼭 읽어야 할 포인트는 아래입니다.

- `X`와 `y`가 분리되었는가
- train/test가 나뉘었는가
- 예측 대상에 맞는 지표를 썼는가

## 첫 실습에서 자주 하는 실수

### 1. 전체 데이터로 학습하고 전체 데이터로 평가한다

점수는 좋아 보이지만 일반화 성능을 모릅니다.

### 2. feature와 label을 섞어 넣는다

label이 `X`에 남아 있으면 누수입니다.

### 3. 분류인데 `predict_proba()`를 보지 않는다

확률을 안 보면 threshold 조정과 AUC 해석이 어려워집니다.

### 4. 지표를 문제와 맞지 않게 쓴다

불균형 분류 문제에서 accuracy만 보면 위험할 수 있습니다.

## 무엇을 먼저 확인해야 하나

첫 실습에서는 아래 순서를 추천합니다.

1. 데이터 행 수와 열 수
2. label 분포
3. train/test 분리 결과
4. baseline 지표
5. 예측 샘플 몇 건 직접 보기

즉, 코드가 돌아갔다는 사실보다 `지금 무엇을 학습하고 있는가`를 해석하는 편이 중요합니다.

## 실무 연결 포인트

scikit-learn은 입문용일 뿐 아니라 실무 프로토타이핑에도 매우 강합니다.

장점:

- API 일관성
- 전처리와 모델을 Pipeline으로 묶기 쉬움
- baseline 비교가 빠름

즉, 첫 실습 도구로 배우기 좋고 실무 초안 검증에도 바로 쓸 수 있습니다.

## 정리

- 첫 실습의 핵심은 모델 종류보다 `흐름의 재현성`입니다.
- `fit -> predict -> evaluate`를 문제 정의와 함께 묶어 이해해야 합니다.

## 연습 문제

1. `fit`, `predict`, `predict_proba`의 차이를 각각 한 문장으로 적어보세요.
2. 첫 실습 코드에서 label 분포를 확인해야 하는 이유를 적어보세요.
3. 지금 바로 돌릴 수 있는 작은 공개 데이터셋 하나를 골라 위 흐름으로 정리해보세요.
