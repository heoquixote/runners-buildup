## 학습 목표

- Normalizer와 column-wise scaling의 차이를 설명할 수 있습니다.
- 로그 변환이 왜도 큰 데이터를 왜 다루기 쉽게 만드는지 이해할 수 있습니다.
- QuantileTransformer와 PowerTransformer가 어떤 상황에서 쓰이는지 큰 그림을 설명할 수 있습니다.

## 초심자용 한 줄 요약

Normalizer와 분포 변환은 `숫자 크기만 맞추는 것`을 넘어 `행의 방향`이나 `분포 모양` 자체를 바꾸는 전처리입니다.

## Normalizer는 무엇이 다를까

앞에서 본 `StandardScaler`, `MinMaxScaler`, `RobustScaler`는  
보통 `컬럼 단위`로 값을 바꿉니다.

반면 `Normalizer`는 `행 단위`로 벡터 길이를 맞춥니다.

즉, 한 샘플 내부에서 각 feature 비율은 유지하면서  
전체 크기를 1로 만드는 느낌에 가깝습니다.

## 언제 Normalizer가 유용한가

- 텍스트 벡터
- TF-IDF
- 코사인 유사도 기반 비교
- 방향성이 중요하고 절대 크기는 덜 중요한 경우

즉, “이 샘플이 얼마나 크냐”보다  
“어느 방향의 조합이냐”가 더 중요할 때 자주 씁니다.

## 로그 변환은 왜 자주 쓰나

금액, 시간, 횟수 데이터는 오른쪽 꼬리가 긴 경우가 많습니다.

예:

- 구매 금액
- 세션 길이
- 체류 시간
- 소득

이때 `log1p` 같은 변환을 쓰면

- 극단적으로 큰 값 압축
- 분포 왜도 완화
- 선형모델이 관계를 더 다루기 쉬워질 수 있음

## 작은 로그 변환 예시

```python
import numpy as np
import pandas as pd

df = pd.DataFrame({"amount": [1000, 2000, 5000, 20000, 300000]})
df["amount_log1p"] = np.log1p(df["amount"])

print(df)
```

이 변환은 “값을 작게 만든다”기보다  
`큰 값의 차이를 압축해서 분포를 더 다루기 쉽게 만든다`고 이해하시면 됩니다.

## QuantileTransformer는 무엇인가

QuantileTransformer는 순위 기반으로 값을 다시 매핑합니다.

직관적으로는:

- 값의 절대 크기보다 순서를 먼저 본다
- 극단값 영향을 완화할 수 있다
- 분포를 균등분포나 정규분포 비슷하게 바꾸는 데 쓸 수 있다

장점:

- 이상치에 비교적 강할 수 있음
- 비선형 분포를 다루는 데 도움될 수 있음

주의:

- 원래 값 간 거리 해석이 달라질 수 있음
- 작은 데이터에서는 과하게 변형될 수 있음

## PowerTransformer는 무엇인가

PowerTransformer는 분포 왜도를 줄이기 위한 변환입니다.

대표적으로:

- Yeo-Johnson
- Box-Cox

장점:

- 로그 변환보다 더 유연할 수 있음
- 연속형 수치 분포를 정규성에 가깝게 만들고 싶을 때 유용할 수 있음

주의:

- 해석이 다소 추상적일 수 있음
- 변환 후 값 자체의 직관은 줄어들 수 있음

## 작은 코드 예시

```python
from sklearn.preprocessing import Normalizer, PowerTransformer, QuantileTransformer

normalizer = Normalizer()
quantile = QuantileTransformer(output_distribution="normal", random_state=42)
power = PowerTransformer()
```

실무에서는 이 변환들을 무조건 쓰기보다  
분포를 보고 “정말 왜도가 문제인가”, “순위 기반 재매핑이 필요한가”를 먼저 판단하는 편이 좋습니다.

## 언제 어떤 쪽을 먼저 볼까

### Normalizer

- 행 벡터 방향이 중요하다
- 텍스트, 코사인 유사도, sparse 표현과 잘 맞는다

### 로그 변환

- 오른쪽 꼬리가 길다
- 금액/시간/횟수 데이터다

### QuantileTransformer

- 극단값과 비선형 분포가 강하다
- 순위 기반 재매핑이 더 자연스럽다

### PowerTransformer

- 연속형 분포 왜도를 완화하고 싶다
- 로그보다 조금 더 유연한 변환이 필요하다

## 실무에서 자주 생기는 문제

### 1. scaling과 distribution transform을 같은 것으로 보는 경우

하나는 크기를 맞추는 것이고  
다른 하나는 분포 자체를 바꾸는 것입니다.

### 2. 해석이 중요한데 변환을 너무 많이 겹치는 경우

성능은 조금 좋아져도 비즈니스 설명이 어려워질 수 있습니다.

### 3. 음수나 0이 있는 데이터에 로그 변환을 무심코 적용하는 경우

이때는 `log1p`, shift, 또는 다른 변환을 더 신중히 봐야 합니다.

## 대안은 무엇인가

- 단순 크기 보정이면 충분하다 -> `StandardScaler`, `MinMaxScaler`, `RobustScaler`
- 행 방향 정규화가 필요하다 -> `Normalizer`
- 왜도 완화가 필요하다 -> 로그 변환, `PowerTransformer`
- 순위 기반 재매핑이 더 자연스럽다 -> `QuantileTransformer`

## 정리

- Normalizer는 행 단위, 스케일러는 보통 열 단위로 본다는 점이 핵심 차이입니다.
- 로그 변환과 Power/Quantile 변환은 분포 모양 자체를 다루는 전처리입니다.
- 성능만이 아니라 해석 가능성과 데이터 의미 보존도 함께 봐야 합니다.

## 연습 문제

1. Normalizer와 StandardScaler의 차이를 설명해보세요.
2. 로그 변환이 금액 데이터에서 자주 쓰이는 이유를 적어보세요.
3. QuantileTransformer를 썼을 때 원래 값 해석이 왜 달라질 수 있는지 설명해보세요.
