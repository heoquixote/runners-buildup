## 학습 목표

- Label Encoding, One-Hot Encoding, Ordinal Encoding의 차이를 설명할 수 있습니다.
- 범주형 변수에 왜 숫자 변환이 필요한지 이해할 수 있습니다.
- 어떤 인코딩이 어떤 변수에 더 자연스러운지 구분할 수 있습니다.
- 결측치 처리, 이상치 점검, 인코딩, 스케일링, Feature Selection, SMOTE의 전처리 순서를 큰 흐름으로 설명할 수 있습니다.

## 초심자용 한 줄 요약

범주형 인코딩은 `문자열을 숫자로 바꾸는 작업`이 아니라 `모델이 오해하지 않도록 의미 구조를 보존해 주는 작업`입니다.

## 왜 범주형 변수 인코딩이 필요한가

머신러닝 모델은 보통 숫자를 입력으로 받습니다.

예를 들어 아래 같은 값은 그대로는 모델이 다루기 어렵습니다.

- `membership_grade = Gold`
- `channel = mobile_app`
- `region = Seoul`

그래서 범주형 변수는 숫자 형태로 바꿔야 합니다.  
하지만 이때 중요한 것은 `아무 숫자나 붙이면 안 된다`는 점입니다.

예를 들어

- `Seoul -> 0`
- `Busan -> 1`
- `Incheon -> 2`

처럼 바꾸면 모델은 `2가 0보다 크다`는 식의 관계를 오해할 수 있습니다.

## 1. Label Encoding

Label Encoding은 범주를 정수 하나로 바꾸는 방식입니다.

예:

- `spam -> 0`
- `normal -> 1`

## 언제 자연스러운가

가장 대표적인 용도는 `타깃 y 인코딩`입니다.

예:

- 이진 분류의 정답 라벨
- 다중 분류의 클래스 라벨

즉, `입력 feature X`보다 `정답 label y`에 더 자주 쓰입니다.

## 왜 주의해야 하나

입력 feature가 순서 없는 범주형인데 Label Encoding을 바로 쓰면  
모델이 없는 순서를 읽을 수 있습니다.

예를 들어

- `red -> 0`
- `blue -> 1`
- `green -> 2`

라고 바꾸면 선형모델이나 거리 기반 모델은  
`green`이 `red`보다 더 큰 값처럼 받아들일 수 있습니다.

## 작은 코드 예시

```python
from sklearn.preprocessing import LabelEncoder

y = ["churn", "stay", "stay", "churn"]

encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

print(y_encoded)
print(encoder.classes_)
```

## 2. One-Hot Encoding

One-Hot Encoding은 범주마다 별도의 컬럼을 만드는 방식입니다.

예를 들어 `channel`이 아래 셋 중 하나라면

- web
- app
- store

다음처럼 바뀝니다.

- `channel_web`
- `channel_app`
- `channel_store`

그리고 각 행에는 해당되는 위치만 `1`, 나머지는 `0`이 들어갑니다.

## 언제 자연스러운가

순서가 없는 nominal 범주형에 가장 기본적인 선택입니다.

예:

- 지역
- 유입 채널
- 결제 수단
- 직군

## 장점

- 가짜 순서를 만들지 않음
- 선형모델, 로지스틱 회귀, 거리 기반 모델과 궁합이 좋음
- 해석이 비교적 직관적임

## 단점

- 범주 수가 많으면 컬럼이 급격히 늘어남
- 희소 행렬이 커질 수 있음
- 드문 범주가 너무 많으면 일반화가 어려울 수 있음

## 작은 코드 예시

```python
import pandas as pd
from sklearn.preprocessing import OneHotEncoder

df = pd.DataFrame({"channel": ["web", "app", "store", "app"]})

encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
encoded = encoder.fit_transform(df[["channel"]])

print(encoded)
print(encoder.get_feature_names_out())
```

`handle_unknown="ignore"`는 실무에서 매우 중요합니다.  
학습 때 없던 범주가 추론 시점에 들어와도 파이프라인이 덜 깨지기 때문입니다.

## 3. Ordinal Encoding

Ordinal Encoding은 `순서가 있는 범주형`에 순서를 반영해 숫자를 부여하는 방식입니다.

예:

- `Bronze -> 0`
- `Silver -> 1`
- `Gold -> 2`
- `VIP -> 3`

## 언제 자연스러운가

범주 자체에 명확한 서열이 있을 때입니다.

예:

- 고객 등급
- 학력 단계
- 만족도 등급
- 위험도 구간

## 왜 조심해야 하나

순서만 있는 것이 아니라 `간격까지 같다고 모델이 받아들일 수 있다`는 점을 주의해야 합니다.

예를 들어 `Silver -> Gold`와 `Gold -> VIP`의 차이가  
실제 비즈니스 의미상 같지 않을 수 있는데  
숫자로 바꾸면 비슷한 간격처럼 보일 수 있습니다.

## 작은 코드 예시

```python
import pandas as pd
from sklearn.preprocessing import OrdinalEncoder

df = pd.DataFrame({"grade": ["Silver", "Gold", "VIP", "Bronze"]})

encoder = OrdinalEncoder(
    categories=[["Bronze", "Silver", "Gold", "VIP"]]
)
encoded = encoder.fit_transform(df[["grade"]])

print(encoded)
```

핵심은 `자동 알파벳 순서`가 아니라 `도메인 순서`를 직접 넣는 것입니다.

## 어떤 인코딩을 먼저 선택할까

### Label Encoding

- 주로 `y` 라벨 인코딩
- `X`의 순서 없는 범주형에는 기본 선택으로 권장하지 않음

### One-Hot Encoding

- 순서 없는 범주형 `X`
- 가장 무난한 기본 선택

### Ordinal Encoding

- 실제 서열이 있는 범주형
- 순서를 직접 정의할 수 있을 때

## 데이터 전처리 순서는 어떻게 잡을까

입문 단계에서는 아래 순서를 기본값으로 잡으면 실수가 줄어듭니다.

1. 문제 정의와 타깃 확정
2. train/validation/test 분리
3. 컬럼 역할 구분
4. 결측치 처리
5. 이상치와 분포 점검
6. 범주형 인코딩 / 수치형 스케일링
7. Feature Selection
8. 불균형 분류라면 train fold 안에서만 `SMOTE`
9. 모델 학습과 평가

## 자주 헷갈리는 위치를 한 번에 정리하면

아래 표처럼 이해하시면 실무에서 덜 꼬입니다.

| 항목 | 보통 어디에 두나 | 왜 그 위치인가 | 주의할 점 |
| --- | --- | --- | --- |
| Encoding | split 후, 범주형 결측치 처리 다음 | 문자열을 모델 입력 형태로 바꿔야 하기 때문 | 전체 데이터 기준으로 fit하면 전처리 누수 |
| Scaling | split 후, 수치형 결측치 처리 다음 | 스케일 기준을 train 데이터로만 배워야 하기 때문 | 트리모델에는 불필요할 수 있음 |
| Feature Selection | 기본 전처리 뒤, 모델 학습 전 | 실제 모델 입력 기준으로 변수를 줄여야 하기 때문 | 전체 데이터 기준 선택은 누수 |
| SMOTE | split 후, train fold 전처리 뒤, 모델 직전 | synthetic sample을 train 안에서만 만들어야 하기 때문 | validation/test에는 절대 적용하지 않음 |

핵심은 `split 이후`, `train 기준`, `Pipeline 안`입니다.

## 왜 이 순서가 자연스러운가

### 1. split을 먼저 해야 한다

전처리 기준을 train 데이터로만 학습해야  
validation/test 정보를 미리 보지 않게 됩니다.

### 2. 결측치 처리가 인코딩보다 앞서는 경우가 많다

범주형에서 `Unknown`을 넣거나 최빈값을 채운 뒤 인코딩하는 흐름이 더 일반적입니다.

수치형도 보통 결측을 먼저 다룬 뒤  
그다음 스케일링이나 변환을 적용합니다.

### 3. 이상치와 분포 점검은 스케일링 전에 의미가 크다

이상치가 심한데 바로 StandardScaler를 쓰면  
평균과 표준편차가 크게 흔들릴 수 있습니다.

그래서 아래 같은 판단이 먼저 필요합니다.

- 오류 데이터인가
- 유지해야 하는 실제 이벤트인가
- 로그 변환이 더 자연스러운가
- RobustScaler가 더 적합한가

### 4. 인코딩과 스케일링은 컬럼별로 다르게 가야 한다

보통은 아래처럼 분리합니다.

- 수치형: 결측치 처리 -> 스케일링
- 범주형: 결측치 처리 -> 인코딩

즉, 모든 컬럼에 같은 전처리를 일괄 적용하는 것이 아니라  
`컬럼 타입별 파이프라인`을 따로 가져가는 편이 실무적으로 안전합니다.

중요한 점은 `인코딩 다음 스케일링`처럼 전역 순서를 하나로 외우기보다  
`수치형 가지`와 `범주형 가지`를 분리해 이해하는 것입니다.

즉:

- 수치형 가지: 결측치 처리 -> 스케일링
- 범주형 가지: 결측치 처리 -> 인코딩

그다음 두 결과를 합쳐 모델에 넣는다고 생각하시면 됩니다.

### 5. Feature Selection은 전처리 뒤에 두는 경우가 많다

데이터 기반 Feature Selection은 보통  
모델이 실제로 받게 될 입력 행렬 기준으로 이루어집니다.

그래서 아래 흐름이 자연스럽습니다.

1. 결측치 처리
2. 인코딩 / 스케일링
3. Feature Selection
4. 모델 학습

예를 들어 one-hot encoding 뒤 컬럼 수가 급증했다면  
그 상태에서 selection을 해야 실제 입력 기준으로 줄일 수 있습니다.

다만 도메인상 명백히 제거해야 하는 컬럼은  
이보다 앞에서 수동으로 빼도 됩니다.

### 6. SMOTE는 전처리 끝난 train 쪽에만 둔다

불균형 분류에서 `SMOTE`를 쓴다면 보통 아래처럼 이해하시면 됩니다.

1. 먼저 split
2. train 쪽 전처리 기준 학습
3. train 변환 결과에만 `SMOTE`
4. 그 결과로 모델 학습
5. validation/test는 원래 분포 그대로 평가

즉, `SMOTE는 데이터 준비 단계 전체에 뿌리는 공통 전처리`가 아니라  
`train 데이터 안에서만 쓰는 학습용 보강 단계`입니다.

기본 `SMOTE`는 거리 기반으로 synthetic sample을 만들기 때문에  
스케일 차이가 큰 수치형에서는 전처리 뒤에 두는 편이 더 자연스럽습니다.

## 작은 파이프라인 예시

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric_features = ["age", "income"]
categorical_features = ["channel", "grade"]

preprocess = ColumnTransformer(
    transformers=[
        (
            "num",
            Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="median")),
                    ("scaler", StandardScaler()),
                ]
            ),
            numeric_features,
        ),
        (
            "cat",
            Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="most_frequent")),
                    ("encoder", OneHotEncoder(handle_unknown="ignore")),
                ]
            ),
            categorical_features,
        ),
    ]
)

model = Pipeline(
    steps=[
        ("preprocess", preprocess),
        ("classifier", LogisticRegression(max_iter=1000)),
    ]
)
```

이 구조의 장점은 `전처리 순서가 코드로 고정된다`는 점입니다.

## 초심자가 외우기 좋은 한 줄 순서

실무형 기본값으로는 아래 정도를 기억하시면 충분합니다.

`문제 정의 -> split -> 결측치 처리 -> 수치형 스케일링 / 범주형 인코딩 -> Feature Selection -> train 안에서만 SMOTE -> 모델 학습`

물론 모든 프로젝트가 완전히 같지는 않지만,  
이 순서를 기본값으로 두면 `누수`와 `순서 꼬임`을 많이 줄일 수 있습니다.

## 실무에서 자주 생기는 문제

### 1. feature X에 Label Encoding을 무심코 쓰는 경우

존재하지 않는 순서를 모델에 주입할 수 있습니다.

### 2. One-Hot Encoding 후 컬럼 수가 너무 많아지는 경우

고유값이 매우 많은 ID성 컬럼은 원-핫 인코딩 전에  
정말 feature로 쓸지부터 다시 봐야 합니다.

### 3. 결측치 처리 전에 인코딩부터 하는 경우

의도한 범주 구조가 깨지거나  
`Unknown` 처리 전략이 꼬일 수 있습니다.

### 4. train/test split 전에 전체 데이터로 인코딩을 맞추는 경우

전처리 누수와 운영 불일치가 생길 수 있습니다.

### 5. Feature Selection이나 SMOTE를 split 전에 하는 경우

둘 다 train 정보만 써야 하는 단계이므로  
평가가 과하게 좋아질 수 있습니다.

## 대안은 무엇인가

- 범주 수가 적고 순서가 없다 -> `One-Hot Encoding`
- 순서가 분명하다 -> `Ordinal Encoding`
- 분류 타깃 라벨이다 -> `Label Encoding`
- 범주 수가 너무 많다 -> 희귀 범주 통합, 다른 모델 선택, feature 재설계 검토

## 정리

- Label Encoding, One-Hot Encoding, Ordinal Encoding은 서로 대체재가 아니라 `데이터 의미가 다를 때 쓰는 다른 도구`입니다.
- 순서 없는 범주형 `X`에는 보통 One-Hot Encoding이 가장 안전한 기본 선택입니다.
- 전처리 순서는 보통 `split -> 결측치 처리 -> 이상치/분포 점검 -> 인코딩/스케일링 -> Feature Selection -> train 안에서만 SMOTE -> 모델 학습` 흐름으로 잡으면 안정적입니다.

## 연습 문제

1. `membership_grade`와 `region` 중 어떤 변수에 Ordinal Encoding이 더 자연스러운지 설명해보세요.
2. 입력 feature에 Label Encoding을 잘못 쓰면 어떤 문제가 생길 수 있는지 적어보세요.
3. 본인이 다루는 데이터에서 전처리 순서를 한 줄씩 적어보세요.
