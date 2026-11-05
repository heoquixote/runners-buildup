## 학습 목표

- Feature Selection이 왜 필요한지 설명할 수 있습니다.
- filter, wrapper, embedded 방식의 큰 차이를 이해할 수 있습니다.
- 변수 선택이 성능뿐 아니라 해석과 운영 비용에도 영향을 준다는 점을 말할 수 있습니다.
- 어떤 변수를 제거할지 결정할 때 주의할 함정을 구분할 수 있습니다.
- Feature Selection을 전처리 순서 어디에 두는 것이 자연스러운지 설명할 수 있습니다.

## 초심자용 한 줄 요약

Feature Selection은 `많은 변수 중 예측에 도움이 되는 변수만 더 신중하게 남기는 작업`입니다.

## 왜 Feature Selection이 필요한가

변수가 많다고 항상 좋은 것은 아닙니다.

변수가 너무 많으면:

- 과적합 위험 증가
- 학습 속도 저하
- 해석 어려움 증가
- 운영 비용 증가
- 중복 정보 증가

특히 표본 수보다 변수 수가 너무 많아지면  
모델이 우연한 패턴까지 외울 가능성이 커집니다.

## 언제 selection이 더 중요해질까

- 파생변수를 많이 만들었다
- one-hot 이후 컬럼 수가 크게 늘었다
- 선형모델 해석이 중요하다
- 운영에서 feature 계산 비용이 크다

즉, selection은 단순 성능 튜닝이 아니라  
`모델을 더 단순하고 신뢰 가능하게 만드는 작업`이기도 합니다.

## Feature Selection의 대표 방식

### 1. Filter 방식

모델 학습 전에 통계 기준으로 먼저 거르는 방식입니다.

예:

- 분산이 거의 없는 변수 제거
- 상관계수 기준 제거
- 카이제곱 검정
- mutual information

장점:

- 빠르다
- baseline 단계에서 쓰기 좋다

단점:

- 모델 구조를 직접 반영하지 못한다

### 2. Wrapper 방식

변수 조합을 바꿔가며 실제 모델 성능으로 비교하는 방식입니다.

예:

- forward selection
- backward elimination
- recursive feature elimination(RFE)

장점:

- 모델 성능 기준으로 볼 수 있다

단점:

- 계산량이 크다
- 데이터가 적으면 불안정할 수 있다

### 3. Embedded 방식

모델 학습 과정 안에서 변수 선택이 함께 일어나는 방식입니다.

예:

- Lasso
- 트리 기반 중요도

장점:

- 비교적 실무적이다
- 모델 구조를 반영한다

단점:

- 특정 모델 편향이 있다

## Feature Selection은 파이프라인 어디에 둘까

초심자가 자주 헷갈리는 부분이 바로 이것입니다.

기본 원칙은 아래입니다.

- split 전에 하지 않는다
- train 데이터 기준으로만 선택한다
- 보통 기본 전처리 뒤, 모델 학습 전에 둔다

즉, 보통은 아래 순서가 자연스럽습니다.

1. split
2. 결측치 처리
3. 인코딩 / 스케일링
4. Feature Selection
5. 모델 학습

왜냐하면 selection은 대개  
`모델이 실제로 받는 입력 형태`를 기준으로 해야 하기 때문입니다.

예를 들어 one-hot encoding 이후 컬럼 수가 500개로 늘었다면  
그 뒤에 selection을 해야 정말 줄여야 할 입력 차원을 다루게 됩니다.

## 언제 예외가 있을까

모든 선택이 꼭 맨 마지막은 아닙니다.

### 1. 도메인 기반 수동 제거

아래처럼 명백한 컬럼은 초반에 먼저 뺄 수 있습니다.

- ID 컬럼
- 후행 처리 상태 컬럼
- 정책상 사용 불가 컬럼

이것은 `통계적 selection`보다 `설계 정리`에 가깝습니다.

### 2. 스케일에 민감한 selection

선형계수 기반, 거리 기반 성격이 있는 방식은  
스케일링 뒤에 두는 편이 더 자연스럽습니다.

반대로 단순 분산 제거 같은 filter는  
상황에 따라 더 앞쪽에서도 가능할 수 있습니다.

즉, rigid한 절대 순서보다  
`이 selection이 무엇을 기준으로 변수 중요도를 읽는가`를 보는 것이 중요합니다.

## 교차검증에서는 어떻게 생각할까

실무에서는 Feature Selection도 교차검증 fold 안에서 돌아야 합니다.

즉:

1. train fold 안에서 selection 기준 학습
2. validation fold에는 같은 기준만 적용

이 흐름이 아니면 validation 정보를 미리 본 것과 비슷해질 수 있습니다.

## 작은 코드 예시: VarianceThreshold

```python
from sklearn.feature_selection import VarianceThreshold

selector = VarianceThreshold(threshold=0.0)
X_selected = selector.fit_transform(X)
```

이 방식은 거의 변하지 않는 컬럼을 먼저 제거하는 가장 단순한 selection입니다.

## 작은 코드 예시: RFE

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=1000)
selector = RFE(estimator=model, n_features_to_select=5)
X_selected = selector.fit_transform(X, y)
```

핵심은 `무조건 적게 남기는 것`이 아니라  
`정말 도움이 되는 정보를 남기는 것`입니다.

## selection을 어떻게 판단할까

아래 질문을 같이 보는 편이 좋습니다.

- 성능이 실제로 좋아졌는가
- 성능이 비슷하다면 더 단순한 쪽이 나은가
- 비즈니스 설명이 더 쉬워졌는가
- 운영 계산 비용이 줄었는가

즉, selection의 목표는 최고 점수만이 아닐 수 있습니다.

## 실무에서 자주 생기는 문제

### 1. 전체 데이터 기준으로 선택하는 경우

변수 선택도 전처리의 일부이므로  
train 데이터 기준으로 해야 합니다.

### 2. 중요도 높은 변수만 남기면 끝이라고 생각하는 경우

중요도는 모델마다 달라질 수 있습니다.

### 3. 도메인상 중요한 변수를 너무 빨리 제거하는 경우

단기 점수만 보면 빠지지만  
현업 설명이나 정책 설계에는 꼭 필요한 변수가 있을 수 있습니다.

### 4. selection과 다중공선성을 같은 것으로 보는 경우

겹치는 부분은 있지만 완전히 같은 문제는 아닙니다.

## 대안은 무엇인가

- 빠른 baseline이 필요하다 -> filter 방식부터 시작
- 선형모델과 해석이 중요하다 -> L1, 상관계수, VIF 점검
- 트리모델 중심이다 -> importance와 permutation importance를 함께 본다
- 변수 수가 매우 많다 -> 희소성, 비용, 중복성 기준도 같이 본다

## 정리

- Feature Selection은 성능 향상뿐 아니라 과적합 완화, 해석성, 운영 단순화에도 중요합니다.
- filter, wrapper, embedded는 서로 다른 장단점을 가집니다.
- selection도 누수 없이 train 기준으로 설계해야 합니다.
- 보통은 `인코딩/스케일링 뒤 -> selection -> 모델` 흐름으로 이해하면 안전합니다.

## 연습 문제

1. 변수가 많을수록 왜 과적합 위험이 커질 수 있는지 설명해보세요.
2. filter 방식과 wrapper 방식의 차이를 적어보세요.
3. 점수는 비슷한데 변수가 절반으로 줄었다면 왜 실무적으로 가치가 있을 수 있는지 적어보세요.
