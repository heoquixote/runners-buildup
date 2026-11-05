## 학습 목표

- MinMaxScaler와 MaxAbsScaler의 차이를 설명할 수 있습니다.
- 값 범위를 맞추는 스케일링이 왜 필요한지 이해할 수 있습니다.
- 이상치가 있을 때 MinMaxScaler가 왜 민감할 수 있는지 말할 수 있습니다.

## 초심자용 한 줄 요약

MinMaxScaler는 `값을 일정 범위로 압축`하고, MaxAbsScaler는 `부호를 유지한 채 절댓값 최대 기준으로 맞추는 방식`입니다.

## MinMaxScaler는 무엇을 하나

MinMaxScaler는 보통 값을 `0~1` 범위로 바꿉니다.

직관은 아래와 같습니다.

- 최소값 -> 0
- 최대값 -> 1
- 나머지 값 -> 그 사이 비율

즉, 컬럼마다 단위를 통일된 구간으로 맞추는 방식입니다.

## 언제 유용한가

- 각 feature를 비슷한 범위로 압축하고 싶다
- 입력 범위가 제한된 것이 직관적으로 보기 좋다
- 신경망 입력이나 거리 기반 모델 전처리로 쓸 수 있다

## MinMaxScaler의 한계

### 이상치에 민감하다

최소값과 최대값에 매우 의존하므로  
극단값 하나가 있으면 대부분의 데이터가 좁은 구간에 눌릴 수 있습니다.

예:

- 대부분 값: `10 ~ 100`
- 극단값: `10000`

이런 경우는 스케일링 후 일반 데이터가 거의 0 근처에 몰릴 수 있습니다.

## MaxAbsScaler는 무엇이 다를까

MaxAbsScaler는 각 컬럼을 `절댓값 최대치`로 나눕니다.

장점:

- 부호를 유지한다
- 희소(sparse) 데이터와 궁합이 좋은 편이다
- 0 중심 구조를 크게 훼손하지 않는다

즉, one-hot이나 sparse matrix가 있는 환경에서는  
MaxAbsScaler가 더 자연스러울 때가 있습니다.

## 작은 코드 예시

```python
from sklearn.preprocessing import MaxAbsScaler, MinMaxScaler
import pandas as pd

df = pd.DataFrame(
    {
        "income": [2500, 4200, 3900, 12000],
        "visits": [1, 5, 3, 7],
    }
)

minmax = MinMaxScaler()
maxabs = MaxAbsScaler()

print(minmax.fit_transform(df))
print(maxabs.fit_transform(df))
```

이 코드를 보면 둘 다 크기를 줄이지만  
기준이 서로 다르다는 점이 중요합니다.

## 언제 어떤 쪽을 먼저 볼까

### MinMaxScaler

- 일정 범위 `0~1` 또는 `-1~1`이 직관적이다
- 이상치가 아주 심하지 않다

### MaxAbsScaler

- 0 중심 데이터를 유지하고 싶다
- 희소 행렬과 함께 쓴다
- 절댓값 기준 압축이 더 자연스럽다

## 실무에서 자주 생기는 문제

### 1. 극단값이 있는데 MinMaxScaler를 바로 쓰는 경우

대부분 데이터가 너무 납작하게 눌릴 수 있습니다.

### 2. train/test를 따로 보지 않고 한 번에 스케일링하는 경우

전처리 누수가 됩니다.

### 3. 범위가 예쁘게 맞았다고 해서 분포 문제가 해결됐다고 생각하는 경우

범위만 줄어든 것이지  
왜도, 이상치, 다봉 구조가 사라진 것은 아닐 수 있습니다.

## 대안은 무엇인가

- 이상치가 많다 -> `RobustScaler`
- 평균/표준편차 기준이 더 자연스럽다 -> `StandardScaler`
- 분포 왜도가 심하다 -> 로그 변환, `QuantileTransformer`

## 정리

- MinMaxScaler는 값을 일정 범위로 압축하는 데 강점이 있습니다.
- MaxAbsScaler는 절댓값 기준 압축으로 sparse 데이터와 잘 맞는 편입니다.
- MinMaxScaler는 특히 이상치 영향에 민감하므로 데이터 분포를 먼저 보는 것이 중요합니다.

## 연습 문제

1. MinMaxScaler가 이상치에 민감한 이유를 설명해보세요.
2. MaxAbsScaler가 sparse 데이터에서 유리할 수 있는 이유를 적어보세요.
3. 대부분 값은 비슷한데 일부 극단값이 큰 데이터에서 어떤 스케일러를 먼저 의심해볼지 적어보세요.
