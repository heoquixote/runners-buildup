## 학습 목표

- 하이퍼파라미터와 모델 파라미터의 차이를 설명할 수 있습니다.
- Grid Search, Random Search, Optuna의 차이를 이해할 수 있습니다.
- 왜 하이퍼파라미터 튜닝에서 Cross Validation이 함께 쓰이는지 설명할 수 있습니다.
- 튜닝 과정에서도 누수와 과적합이 생길 수 있다는 점을 구분할 수 있습니다.

## 초심자용 한 줄 요약

하이퍼파라미터 튜닝은 `모델이 잘 배우도록 설정값을 조정하는 과정`이고, Cross Validation은 `그 설정값이 우연히 좋은 건 아닌지 확인하는 장치`입니다.

## 하이퍼파라미터란 무엇인가

모델에는 크게 두 종류의 값이 있습니다.

### 1. 모델이 학습해서 얻는 값

예:

- 선형회귀 계수
- 결정트리 분기 기준
- 로지스틱 회귀 가중치

이런 값은 데이터를 보고 모델이 스스로 배웁니다.

### 2. 사람이 미리 정해주는 값

예:

- 트리 최대 깊이 `max_depth`
- 로지스틱 회귀 규제 강도 `C`
- 랜덤포레스트 트리 개수 `n_estimators`
- LightGBM 학습률 `learning_rate`

이런 값이 하이퍼파라미터입니다.

즉, 하이퍼파라미터는 `모델 학습 방식을 정하는 설정값`입니다.

## 왜 튜닝이 필요한가

같은 모델이라도 설정값에 따라 결과가 꽤 달라질 수 있습니다.

예:

- 트리 깊이가 너무 얕다 -> 과소적합
- 트리 깊이가 너무 깊다 -> 과적합
- 규제가 너무 강하다 -> 패턴을 충분히 못 배움
- 규제가 너무 약하다 -> 잡음까지 외울 수 있음

즉, 튜닝은 더 복잡한 모델을 찾는 작업이 아니라  
`현재 모델이 과하게 단순한지, 과하게 복잡한지 조정하는 작업`에 가깝습니다.

## 왜 Cross Validation을 같이 쓰나

하이퍼파라미터 조합 하나를 평가할 때  
한 번의 validation split만 보면 우연히 점수가 좋게 나올 수 있습니다.

그래서 보통 아래처럼 합니다.

1. 하이퍼파라미터 후보를 정한다
2. 각 후보를 Cross Validation으로 평가한다
3. 평균 점수가 좋은 조합을 고른다
4. 마지막 test는 한 번만 본다

즉, Cross Validation은 튜닝의 `심판` 역할을 합니다.

## Grid Search란 무엇인가

Grid Search는 사람이 정한 후보 조합을 `전부 다` 시도하는 방식입니다.

예:

- `max_depth = [3, 5, 7]`
- `min_samples_leaf = [1, 3, 5]`

이면 가능한 조합을 모두 평가합니다.

장점:

- 단순하고 직관적임
- 작은 탐색 공간에서는 해석이 쉬움

단점:

- 조합 수가 빠르게 폭증함
- 중요하지 않은 축까지 모두 탐색함

## 작은 코드 예시: Grid Search

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(random_state=42)

param_grid = {
    "n_estimators": [100, 200],
    "max_depth": [3, 5, 7],
}

search = GridSearchCV(
    estimator=model,
    param_grid=param_grid,
    scoring="f1",
    cv=5,
    n_jobs=-1,
)

search.fit(X_train, y_train)

print(search.best_params_)
print(search.best_score_)
```

핵심은 `best_score_`가 test 점수가 아니라  
Cross Validation 평균 점수라는 점입니다.

## Random Search란 무엇인가

Random Search는 후보 공간 전체를 다 보지 않고  
일정 횟수만 무작위로 뽑아 평가하는 방식입니다.

장점:

- 넓은 탐색 공간에서 효율적일 수 있음
- 덜 중요한 축에 시간을 덜 낭비할 수 있음

단점:

- 운에 따라 좋은 조합을 놓칠 수 있음
- 반복 횟수 설계가 필요함

## 작은 코드 예시: Random Search

```python
from sklearn.model_selection import RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(random_state=42)

param_dist = {
    "n_estimators": [100, 200, 300, 500],
    "max_depth": [3, 5, 7, 10, None],
    "min_samples_leaf": [1, 2, 4, 8],
}

search = RandomizedSearchCV(
    estimator=model,
    param_distributions=param_dist,
    n_iter=10,
    scoring="f1",
    cv=5,
    random_state=42,
    n_jobs=-1,
)

search.fit(X_train, y_train)

print(search.best_params_)
print(search.best_score_)
```

직관적으로는 `전수조사` 대신 `표본조사`에 가깝습니다.

## Optuna는 무엇이 다른가

Optuna는 이전 실험 결과를 바탕으로  
다음 시도 조합을 더 똑똑하게 고르려는 최적화 도구입니다.

즉, Grid Search처럼 전부 다 보지도 않고  
Random Search처럼 완전히 무작위로만 뽑지도 않습니다.

초심자용 감각으로는 아래처럼 보면 됩니다.

- Grid Search: 격자 전체 탐색
- Random Search: 무작위 샘플 탐색
- Optuna: 이전 결과를 참고하며 더 유망한 쪽을 집중 탐색

## 작은 코드 예시: Optuna

```python
import optuna
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score


def objective(trial):
    model = RandomForestClassifier(
        n_estimators=trial.suggest_int("n_estimators", 100, 500),
        max_depth=trial.suggest_int("max_depth", 3, 12),
        min_samples_leaf=trial.suggest_int("min_samples_leaf", 1, 8),
        random_state=42,
    )

    scores = cross_val_score(model, X_train, y_train, cv=5, scoring="f1")
    return scores.mean()


study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=30)

print(study.best_params)
print(study.best_value)
```

Optuna는 특히 탐색 범위가 넓고  
시도 비용이 꽤 클 때 실무적으로 매력적일 수 있습니다.

## 언제 무엇을 먼저 쓸까

### Grid Search

- 탐색 범위가 작다
- 후보를 사람이 명확히 정할 수 있다
- 입문 단계에서 이해하기 쉽다

### Random Search

- 탐색 범위가 넓다
- 전부 돌리기엔 비싸다
- baseline보다 조금 더 실용적인 탐색이 필요하다

### Optuna

- 탐색 공간이 크고 복잡하다
- 여러 모델/파라미터를 더 효율적으로 보고 싶다
- 반복 실험을 체계적으로 관리하고 싶다

## AutoML과는 무엇이 다를까

여기까지 나온 `Grid Search`, `Random Search`, `Optuna`는  
기본적으로 `어떤 모델을 쓸지`와 `어떤 전처리/실험 구조를 쓸지`를 사람이 먼저 정한 뒤  
그 안에서 설정값을 더 잘 찾는 도구입니다.

반면 `AutoML`은 보통 아래 범위를 더 넓게 자동화합니다.

- 여러 모델 후보 비교
- 하이퍼파라미터 탐색
- 일부 전처리 자동화
- 앙상블 / 리더보드 생성

즉, 튜닝 도구가 `모델 안쪽 설정`을 더 많이 다룬다면,  
AutoML은 `모델 선택 + 튜닝`을 한 단계 더 넓게 묶은 접근에 가깝습니다.

다음 페이지 `09-5. AutoML 도구: AutoGluon, PyCaret, H2O AutoML, AutoSklearn`에서  
대표적인 오픈소스 AutoML 도구들을 비교해 보겠습니다.

## 실무에서 자주 생기는 문제

### 1. test 데이터로 튜닝하는 경우

가장 흔한 실수 중 하나입니다.  
test는 마지막 한 번만 봐야 합니다.

### 2. 탐색 범위를 너무 넓게 시작하는 경우

시간은 오래 걸리고 해석은 어려워질 수 있습니다.

### 3. metric을 명확히 정하지 않고 튜닝하는 경우

`accuracy`를 올린 건지, `recall`을 올린 건지, `PR-AUC`를 올린 건지에 따라  
결론이 달라질 수 있습니다.

### 4. validation 성능만 보고 계속 반복하는 경우

validation에도 점점 과적합될 수 있습니다.

### 5. 전처리와 튜닝을 분리해 놓는 경우

전처리도 함께 pipeline 안에서 검증되어야  
실험이 재현 가능해집니다.

## 대안은 무엇인가

- 먼저 baseline이 없다 -> 튜닝보다 baseline부터 만든다
- 파라미터 수가 적다 -> `GridSearchCV`
- 탐색 범위가 넓다 -> `RandomizedSearchCV`
- 더 효율적인 최적화가 필요하다 -> `Optuna`
- 시간축 문제다 -> 일반 K-Fold 대신 time-based split 검토

## 정리

- 하이퍼파라미터는 모델이 학습하는 값이 아니라 사람이 정하는 설정값입니다.
- 튜닝에서는 `Cross Validation`이 각 설정값을 공정하게 비교하는 핵심 장치입니다.
- Grid Search는 단순하고, Random Search는 넓은 탐색에 효율적이며, Optuna는 더 똑똑한 탐색을 지향합니다.
- 튜닝에서도 test 오염, metric 혼선, validation 과적합을 조심해야 합니다.
- 더 넓은 자동화를 원한다면 다음 단계로 `AutoML` 도구를 검토할 수 있습니다.

## 연습 문제

1. 하이퍼파라미터와 모델 파라미터의 차이를 설명해보세요.
2. Grid Search보다 Random Search가 더 자연스러운 상황을 하나 적어보세요.
3. 왜 Optuna에서도 Cross Validation을 함께 쓰는 경우가 많은지 설명해보세요.
