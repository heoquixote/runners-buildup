## 학습 목표

- StandardScaler가 무엇을 기준으로 값을 바꾸는지 설명할 수 있습니다.
- Z-score 표준화의 직관을 이해할 수 있습니다.
- 어떤 모델에서 StandardScaler가 특히 자주 쓰이는지 말할 수 있습니다.

## 초심자용 한 줄 요약

StandardScaler는 `각 컬럼을 평균 0, 표준편차 1 기준으로 다시 맞추는 가장 기본적인 스케일링 방식`입니다.

## Z-score 표준화란 무엇인가

가장 널리 쓰이는 표준화 방식은 아래와 같습니다.

`z = (x - 평균) / 표준편차`

이 식이 뜻하는 바는 간단합니다.

- 평균보다 크면 양수
- 평균보다 작으면 음수
- 표준편차 단위로 얼마나 떨어져 있는지 표현

즉, 각 컬럼을 같은 기준으로 비교하기 쉽게 바꾸는 것입니다.

## 왜 StandardScaler를 많이 쓰나

- 구현이 단순하다
- 선형모델과 로지스틱 회귀에서 자주 잘 맞는다
- SVM, KNN, PCA 전처리로 자주 사용된다
- baseline 전처리로 시작하기 좋다

입문 단계에서는 “어떤 스케일링을 먼저 써보지?” 싶을 때  
`StandardScaler`가 가장 무난한 출발점인 경우가 많습니다.

## 언제 잘 맞나

- 각 컬럼이 대략 연속형 수치 변수다
- 극단적인 이상치가 아주 심하지 않다
- 계수 기반 모델이나 거리 기반 모델을 쓴다

## 언제 조심해야 하나

### 1. 이상치가 매우 많은 경우

평균과 표준편차 자체가 이상치의 영향을 크게 받습니다.

예를 들어 대부분 고객 연소득이 `2,000만~8,000만`인데  
일부 초고소득 고객이 섞여 있으면 분포가 흔들릴 수 있습니다.

### 2. 분포 왜도가 매우 큰 경우

로그 변환이나 다른 분포 변환을 먼저 보는 편이 더 자연스러울 수 있습니다.

## 작은 코드 예시

```python
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

data = load_wine(as_frame=True)
X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(X_train[["alcohol", "proline"]].head())
print(X_train_scaled[:5, :2])
```

여기서 중요한 점은 아래입니다.

- train 데이터에서 평균과 표준편차를 학습한다
- test는 같은 기준으로만 바꾼다
- 전처리도 모델 평가 절차 안에 있어야 한다

## 어떤 모델과 자주 같이 쓰나

- `LinearRegression`
- `LogisticRegression`
- `Ridge`, `Lasso`
- `SVC`
- `KNeighborsClassifier`
- `PCA`

이 모델들은 계수 크기, 거리 계산, 분산 구조에 영향을 받으므로  
표준화가 꽤 자주 도움이 됩니다.

## 실무에서 자주 생기는 문제

### 1. 범주형 원-핫 인코딩 결과까지 무조건 같이 표준화하는 경우

구조에 따라 불필요할 수 있습니다.  
수치형과 범주형 전처리를 나눠서 보는 편이 더 자연스럽습니다.

### 2. 전체 데이터를 한 번에 fit하는 경우

전처리 누수가 됩니다.

### 3. 이상치가 많은데 StandardScaler만 고집하는 경우

이럴 때는 `RobustScaler`가 더 안정적일 수 있습니다.

## 대안은 무엇인가

- 이상치가 많다 -> `RobustScaler`
- 일정 범위가 중요하다 -> `MinMaxScaler`
- 왜도가 크다 -> 로그 변환, `PowerTransformer`

## 정리

- StandardScaler는 가장 기본적이고 범용적인 스케일링 방식입니다.
- 선형모델, 거리 기반 모델, PCA에서 특히 자주 사용됩니다.
- 다만 이상치가 심하면 평균/표준편차 기반이라는 점을 조심해야 합니다.

## 연습 문제

1. StandardScaler가 평균 0, 표준편차 1로 만든다는 말의 의미를 설명해보세요.
2. 어떤 모델에서 StandardScaler가 특히 중요할지 3개 적어보세요.
3. 이상치가 많은 데이터에서 왜 RobustScaler를 고려할 수 있는지 적어보세요.
