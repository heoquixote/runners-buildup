## 학습 목표

- AutoML이 무엇을 자동화하고 무엇은 자동화하지 못하는지 설명할 수 있습니다.
- `AutoGluon`, `PyCaret`, `H2O AutoML`, `AutoSklearn`의 차이를 큰 그림에서 비교할 수 있습니다.
- 어떤 상황에서 어떤 AutoML 도구를 먼저 시도할지 판단할 수 있습니다.
- AutoML을 써도 데이터 누수, 지표 선택, 검증 구조는 여전히 사람이 책임져야 한다는 점을 말할 수 있습니다.

## 초심자용 한 줄 요약

AutoML은 `모델 선택과 튜닝을 많이 자동화해 주는 도구`이지만, 문제 정의와 데이터 설계까지 대신 해주지는 않습니다.

## AutoML이란 무엇인가

AutoML은 사람이 직접 모델을 하나씩 고르고  
하이퍼파라미터를 하나씩 바꾸는 작업을 상당 부분 자동화하는 접근입니다.

보통 아래 일을 많이 대신합니다.

- 여러 모델 후보 학습
- 하이퍼파라미터 탐색
- 성능 비교와 리더보드 생성
- 일부 자동 전처리
- 앙상블 생성

즉, `어떤 모델이 잘 맞는지 빠르게 확인하는 자동 실험실`에 가깝습니다.

## 왜 유용한가

실무에서 아래 상황이 자주 있습니다.

- baseline은 빨리 만들어야 한다
- 후보 모델이 너무 많아 손으로 다 돌리기 어렵다
- 첫 번째 강한 기준점을 빨리 잡고 싶다
- 수동 튜닝 전에 탐색 범위를 줄이고 싶다

이럴 때 AutoML은 꽤 강력합니다.

특히 tabular 데이터에서는  
`생각보다 강한 baseline`을 빠르게 만드는 데 자주 도움이 됩니다.

## 하지만 AutoML이 해결하지 못하는 것

AutoML이 있다고 해서 아래 문제가 사라지지는 않습니다.

- target leakage
- split 설계 오류
- metric 잘못 선택
- 잘못된 label 정의
- 운영 제약 무시

즉, AutoML은 `실험 속도`를 높여주지만  
`문제 정의 책임`까지 대신해주지는 않습니다.

## 1. AutoGluon

AutoGluon은 적은 코드로 강한 tabular 성능을 빠르게 얻는 데 자주 언급되는 AutoML 도구입니다.

특징:

- `TabularPredictor` 중심 사용
- 자동 feature handling
- 여러 모델 학습 후 앙상블
- 짧은 코드로 강한 baseline을 만들기 쉬움

실무 감각으로는 아래 상황에 잘 맞습니다.

- tabular 정확도가 중요하다
- 전처리를 많이 수동으로 짜고 싶지 않다
- 빠르게 강한 baseline을 만들고 싶다

## 작은 코드 예시: AutoGluon

```python
from autogluon.tabular import TabularPredictor

predictor = TabularPredictor(label="target").fit(
    train_data,
    time_limit=60,
)
pred = predictor.predict(test_data)
```

핵심은 `fit()` 한 번으로 여러 모델과 앙상블을 자동으로 시도할 수 있다는 점입니다.

## 2. PyCaret

PyCaret은 `저코드(low-code)` 성격이 강한 실험 프레임워크입니다.

특징:

- `setup()`으로 실험 환경을 빠르게 잡음
- `compare_models()`로 여러 모델 비교
- `automl()`로 현재 세션 기준 최적 모델 선택
- 실험 속도와 생산성을 높이기 좋음

즉, PyCaret은 `복잡한 AutoML 엔진`이라기보다  
`실험 자동화와 생산성 향상` 쪽 색깔이 더 강합니다.

특히 아래 상황에서 편합니다.

- 여러 모델을 빨리 비교하고 싶다
- low-code 실험 흐름이 좋다
- 보고서/데모용 반복 실험을 빠르게 돌리고 싶다

## 작은 코드 예시: PyCaret

```python
from pycaret.classification import setup, compare_models, automl

setup(data=train_df, target="target")
top_models = compare_models(n_select=3)
best_model = automl(optimize="AUC")
```

핵심은 `한 세션 안에서 모델 비교 -> 선택` 흐름이 매우 빠르다는 점입니다.

## 3. H2O AutoML

H2O AutoML은 시간 제한이나 모델 수 제한을 두고  
여러 모델을 자동 학습하고 리더보드를 만드는 방식으로 많이 쓰입니다.

특징:

- `max_runtime_secs` 또는 `max_models`로 탐색 범위 제어
- 리더보드 제공
- explainability 연계
- 비교적 엔터프라이즈/대규모 워크플로우에서 자주 언급

즉, `시간 예산 안에서 자동으로 꽤 넓게 돌려보는 방식`에 강합니다.

## 작은 코드 예시: H2O AutoML

```python
import h2o
from h2o.automl import H2OAutoML

h2o.init()

aml = H2OAutoML(max_models=20, seed=42)
aml.train(x=x, y="target", training_frame=train_h2o)

leaderboard = aml.leaderboard
```

실무에서는 `leaderboard`를 보고  
어떤 계열이 잘 나왔는지 빠르게 파악하는 식으로 많이 씁니다.

## 4. AutoSklearn

AutoSklearn은 scikit-learn 생태계와 가까운 AutoML 도구로  
베이지안 최적화, 메타러닝, 앙상블 쪽이 핵심 색깔입니다.

특징:

- scikit-learn 스타일 인터페이스
- `time_left_for_this_task`, `per_run_time_limit` 같은 시간 중심 제어
- 메타러닝 기반 초기 탐색
- 후처리 앙상블

즉, `sklearn 느낌을 유지하면서 자동화된 모델 탐색`을 하고 싶을 때 떠올릴 수 있습니다.

## 작은 코드 예시: AutoSklearn

```python
import autosklearn.classification

automl = autosklearn.classification.AutoSklearnClassifier(
    time_left_for_this_task=300,
    per_run_time_limit=30,
)
automl.fit(X_train, y_train)
pred = automl.predict(X_test)
```

주의할 점은 공식 문서 기준으로 `Linux` 지원이 중심이라는 점입니다.  
환경 제약을 먼저 확인해야 합니다.

## 어떤 도구를 먼저 볼까

| 상황 | 먼저 볼 도구 | 이유 |
| --- | --- | --- |
| tabular 정확도를 빠르게 끌어올리고 싶다 | `AutoGluon` | 강한 자동 앙상블과 간단한 사용 흐름 |
| low-code로 여러 모델을 빠르게 비교하고 싶다 | `PyCaret` | 실험 생산성이 높고 비교 흐름이 빠름 |
| 시간 예산/리더보드 중심 자동 탐색이 필요하다 | `H2O AutoML` | `max_runtime_secs`, `max_models`, leaderboard 구조 |
| sklearn 스타일에 가까운 AutoML이 필요하다 | `AutoSklearn` | sklearn 친화적 인터페이스와 자동 탐색 구조 |

이 표는 절대 규칙이 아니라  
`첫 후보를 빠르게 고르는 실무형 출발점`입니다.

## AutoML을 쓸 때도 검증 원칙은 그대로다

가장 중요한 점은 아래입니다.

1. 먼저 split을 한다
2. target leakage를 점검한다
3. metric을 정한다
4. 그다음 AutoML을 돌린다
5. 마지막 test는 한 번만 본다

즉, AutoML은 `검증을 대체하는 도구`가 아니라  
`검증 구조 안에서 자동 실험을 더 빨리 돌려주는 도구`입니다.

## 실무에서 자주 생기는 문제

### 1. AutoML 결과를 그대로 진실처럼 믿는 경우

리더보드 1등 모델이 항상 운영 최적 모델은 아닙니다.

### 2. metric을 대충 두고 돌리는 경우

`accuracy` 기준 최적 모델과 `recall` 기준 최적 모델은 다를 수 있습니다.

### 3. 전처리와 누수 점검 없이 바로 돌리는 경우

AutoML도 잘못된 feature를 넣으면 잘못된 답을 더 빨리 찾을 뿐입니다.

### 4. 너무 짧은 시간 제한을 주는 경우

시간 예산이 너무 작으면  
충분한 후보 탐색이나 앙상블이 이루어지지 않을 수 있습니다.

### 5. 배포 복잡도를 무시하는 경우

성능은 좋아도 의존성, 모델 크기, 추론 속도, 운영 환경이 더 복잡해질 수 있습니다.

## 대안은 무엇인가

- 해석이 최우선이다 -> 수동 baseline + 단순 모델 비교
- 환경 제약이 크다 -> scikit-learn + `GridSearchCV` / `Optuna`
- 데이터가 아주 작고 설명 책임이 크다 -> 로지스틱 회귀, 얕은 트리부터 시작
- AutoML 결과를 더 다듬고 싶다 -> AutoML로 strong baseline 생성 후 수동 튜닝

즉, AutoML은 `수동 모델링의 대체재`라기보다  
`강한 출발점` 또는 `탐색 가속기`로 보는 편이 실무적으로 자연스럽습니다.

## 정리

- AutoML은 모델 선택, 튜닝, 일부 전처리, 앙상블을 자동화해 줍니다.
- `AutoGluon`은 tabular 성능 baseline, `PyCaret`은 low-code 실험 생산성, `H2O AutoML`은 리더보드/시간예산 탐색, `AutoSklearn`은 sklearn 친화형 자동화로 보면 이해가 쉽습니다.
- 하지만 데이터 누수, 지표 선택, split 설계는 여전히 사람이 책임져야 합니다.

## 연습 문제

1. `AutoGluon`과 `PyCaret`의 차이를 `성능 baseline`과 `실험 생산성` 관점에서 설명해보세요.
2. `H2O AutoML`에서 `max_runtime_secs`와 `max_models`가 왜 중요한지 적어보세요.
3. AutoML을 쓰더라도 target leakage를 먼저 점검해야 하는 이유를 설명해보세요.
