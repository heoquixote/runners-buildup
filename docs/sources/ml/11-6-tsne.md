## 1. 한 문장으로 이해하기

t-SNE는 고차원 공간에서 가까웠던 샘플들이 저차원에서도 가깝게 배치되도록 임베딩을 최적화하는 비선형 차원축소 및 시각화 기법입니다.

## 2. 왜 필요한가

PCA는 빠르고 유용하지만 선형 변환입니다.  
즉, 전체 분산을 잘 보존하는 방향은 잘 찾지만, `가까운 이웃 관계`를 세밀하게 보여주는 데는 한계가 있을 수 있습니다.

예를 들어 이미지나 임베딩 벡터처럼 고차원 데이터에서는 이런 질문이 많습니다.

- 비슷한 숫자 이미지끼리 실제로 뭉쳐 보이는가
- 국소 이웃 관계가 어떻게 보이는가
- 사람이 눈으로 볼 수 있게 2차원 지도처럼 펼치면 어떤 구조가 보이는가

t-SNE는 이 목적에 강합니다.

중요한 점은 t-SNE가 `군집화 알고리즘`이 아니라  
`고차원 데이터 시각화를 위한 비선형 차원축소 및 임베딩 기법`이라는 것입니다.

## 3. 직관적으로 이해하기

학생들 사이 친구 관계를 2차원 운동장 지도에 배치한다고 생각해 보겠습니다.

- 서로 친한 학생은 가깝게 놓습니다.
- 친하지 않은 학생은 멀어질 수 있습니다.
- 하지만 모든 거리 비율을 완벽하게 유지하기는 어렵습니다.

t-SNE는 "고차원에서 가까운 친구 관계를 2차원에서도 최대한 유지하자"에 가깝습니다.

즉, t-SNE의 핵심은 `국소 구조(local structure)`입니다.

하지만 아래 오해는 매우 흔합니다.

- 군집 사이 거리가 멀다고 원래 공간에서도 반드시 멀다는 뜻은 아닙니다.
- 군집 크기가 크다고 원래 데이터 분산이 더 크다는 뜻은 아닙니다.
- 빈 공간이 크다고 실제로 의미 있는 경계라고 단정하면 안 됩니다.
- t-SNE 결과만 보고 실제 군집 수를 확정하면 안 됩니다.
- t-SNE 축은 원래 feature처럼 직접 해석할 수 없습니다.

![t-SNE 전체 흐름](../assets/ch11-unsupervised-images/tsne-overview.jpeg)

*그림: 고차원 데이터의 이웃 관계를 유사도 확률로 바꾼 뒤, 저차원 임베딩에서 가까운 이웃이 유지되도록 배치하는 t-SNE의 개념도입니다.*

![t-SNE의 이웃 관계 보존 예시](../assets/ch11-unsupervised-images/tsne-neighbor-preservation-example.png)

*그림: 왼쪽 고차원 공간에서 가까운 점들 사이의 이웃 관계를 계산하고, 오른쪽 2D 임베딩에서도 그 국소 이웃 구조가 최대한 유지되도록 배치하는 t-SNE의 핵심 아이디어를 보여줍니다. 즉, t-SNE는 전체 거리를 그대로 복사하는 것이 아니라 가까운 이웃 관계를 시각화하기 좋게 보존하는 데 집중합니다.*

> 이미지 제안: 고차원 점 구름에서 가까운 이웃 관계가 2차원으로 펼쳐지는 과정 그림  
> 위치: `3. 직관적으로 이해하기` 바로 아래  
> 핵심 개념: 고차원 이웃 관계 보존과 저차원 임베딩  
> 주요 객체와 배치: 왼쪽에는 고차원 구름, 가운데는 유사도 그래프, 오른쪽에는 2차원 클러스터 배치  
> 추천 색상 구분: 서로 다른 레이블은 파랑·청록·보라·주황  
> AI 프롬프트: "Educational t-SNE infographic showing high-dimensional neighbors converted to a 2D embedding while preserving local neighborhoods, clean white background, Korean textbook style"

## 4. 핵심 개념과 용어

| 용어 | 의미 | 결과에 미치는 영향 |
| --- | --- | --- |
| high-dimensional space | 원래 feature가 많은 공간 | 시각화가 어렵고 이웃 관계 해석이 복잡합니다. |
| embedding | 저차원 좌표로 다시 표현한 결과 | 시각화용 좌표를 제공합니다. |
| pairwise similarity | 샘플 쌍의 유사도 | 가까운 점을 어떻게 유지할지 결정합니다. |
| local structure | 가까운 이웃 관계 | t-SNE가 가장 강하게 보존하려는 대상입니다. |
| Gaussian similarity | 고차원 유사도 계산 방식 | 원래 공간의 이웃 확률을 만듭니다. |
| Student’s t-distribution | 저차원 유사도 계산 방식 | crowding problem 완화에 도움을 줍니다. |
| perplexity | 유효 이웃 규모에 해당하는 파라미터 | 너무 작거나 크면 구조가 왜곡될 수 있습니다. |
| learning rate | 좌표 업데이트 크기 | 너무 작으면 수렴이 느리고, 너무 크면 배치가 불안정할 수 있습니다. |
| initialization | 초기 좌표 설정 방식 | 최종 결과가 달라질 수 있습니다. |
| KL divergence | 고차원과 저차원 유사도 차이 | t-SNE가 최소화하려는 손실입니다. |
| non-convex optimization | 비볼록 최적화 | 초기값에 따라 다른 해에 도달할 수 있습니다. |
| random_state | 난수 시드 | 결과 재현성을 높입니다. |

## 5. 알고리즘 동작 과정

1. 고차원에서 샘플 간 유사도를 계산합니다.
2. 가까운 샘플일수록 높은 확률을 주도록 `p_{ij}`를 만듭니다.
3. 저차원 좌표를 임의로 초기화합니다.
4. 저차원에서도 샘플 간 유사도 `q_{ij}`를 계산합니다.
5. `p_{ij}`와 `q_{ij}` 차이가 작아지도록 좌표를 반복 업데이트합니다.
6. 최종적으로 2D 또는 3D 임베딩을 얻습니다.

```text
고차원 데이터
 -> 샘플 간 유사도 확률 변환
 -> 저차원 좌표 초기화
 -> 저차원 유사도 계산
 -> KL divergence 최소화 반복
 -> 2D/3D 임베딩 생성
```

## 6. 핵심 수식과 의미

고차원에서 점 \(i\), \(j\)의 유사도는 확률 \(p_{ij}\)로 표현됩니다.

직관적으로는:

- 고차원에서 가까우면 \(p_{ij}\)가 큼
- 멀면 \(p_{ij}\)가 작음

저차원에서는 Student’s t-distribution을 써서 \(q_{ij}\)를 만듭니다.

\[
q_{ij} =
\frac{(1 + \|y_i - y_j\|^2)^{-1}}
{\sum_{k \ne l}(1 + \|y_k - y_l\|^2)^{-1}}
\]

의미:

- 저차원에서 가까운 점은 큰 \(q_{ij}\)를 가집니다.
- 꼬리가 두꺼운 t-distribution을 써서 멀리 떨어진 점들도 너무 눌려붙지 않게 합니다.

t-SNE의 목표는 아래 KL divergence를 최소화하는 것입니다.

\[
KL(P \parallel Q)
=
\sum_{i \ne j}
p_{ij}
\log
\frac{p_{ij}}{q_{ij}}
\]

직관:

- 고차원에서 가까웠던 점이 저차원에서 멀어지면 큰 손실을 줍니다.
- 즉, `가까운 이웃을 잃어버리는 것`을 특히 싫어하는 손실입니다.

### Student’s t-distribution을 쓰는 이유

저차원으로 줄이면 많은 점이 좁은 공간에 몰려야 합니다.  
이때 Gaussian만 쓰면 점들이 너무 가운데에 몰리는 `crowding problem`이 생기기 쉽습니다.

Student’s t-distribution은 꼬리가 두꺼워서:

- 가까운 점은 가깝게 유지하고
- 멀리 떨어질 점은 좀 더 넓게 퍼질 수 있게 도와줍니다.

## 7. 주요 파라미터

| 파라미터 | 역할 | 값이 작을 때 | 값이 클 때 | 실무 선택 기준 |
| --- | --- | --- | --- | --- |
| `n_components` | 임베딩 차원 수 | 정보 표현이 더 제한됨 | 시각화 복잡도 증가 | 보통 2D, 필요하면 3D를 사용합니다. |
| `perplexity` | 유효 이웃 규모 | 매우 국소 구조만 강조 | 더 넓은 이웃 구조 반영 | 데이터 수에 비해 너무 작거나 크지 않게 시도합니다. |
| `learning_rate` | 좌표 업데이트 크기 | 수렴이 느리거나 뭉침 가능 | 불안정한 배치 가능 | 기본값 또는 `auto`부터 시작합니다. |
| `max_iter` | 반복 횟수 | 수렴 전 종료 가능 | 계산 시간 증가 | 보통 1000 이상에서 안정성 확인합니다. |
| `init` | 초기 좌표 방식 | 랜덤이면 변동성 큼 | `pca`는 비교적 안정적 | 교육용 예시는 `pca`가 무난합니다. |
| `metric` | 원래 공간 거리 기준 | 거리 정의가 바뀜 | 거리 정의가 바뀜 | 이미지/수치형은 Euclidean, 텍스트는 Cosine도 검토합니다. |
| `early_exaggeration` | 초기 군집 간 분리 강조 | 분리 강조가 약함 | 초기 분리가 과도할 수 있음 | 기본값부터 시작하고 과하게 손대지 않는 편이 좋습니다. |
| `random_state` | 재현성 | 결과 비교 어려움 | 결과 비교 쉬움 | 교육/분석 재현을 위해 고정합니다. |

여기서 `perplexity`는 군집 수가 아니라,  
"각 점이 몇 명 정도의 이웃을 중요하게 본다고 생각할 것인가"에 가까운 값입니다.

## 8. Python 실습

### 8.1 라이브러리 불러오기

```python
import numpy as np
import matplotlib.pyplot as plt

from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.preprocessing import StandardScaler
```

결과 해석:

- `load_digits`는 8x8 손글씨 숫자 이미지 데이터입니다.
- t-SNE 전에 `StandardScaler`와 `PCA`를 함께 쓰는 실무 패턴을 보여줄 예정입니다.

### 8.2 예제 데이터 생성 또는 불러오기

```python
digits = load_digits()
X = digits.data
y = digits.target

print("X shape:", X.shape)
print("y shape:", y.shape)
```

결과 해석:

- `X.shape = (1797, 64)`라면 64차원 feature를 가진 샘플 1797개라는 뜻입니다.
- 바로 2D로 보기는 어려우므로 차원축소가 필요합니다.

### 8.3 데이터 시각화

원본 숫자 이미지를 일부만 확인합니다.

```python
fig, axes = plt.subplots(2, 5, figsize=(10, 4))

for ax, image, label in zip(axes.ravel(), digits.images[:10], y[:10]):
    ax.imshow(image, cmap="gray_r")
    ax.set_title(f"digit = {label}")
    ax.set_xlabel("pixel_x")
    ax.set_ylabel("pixel_y")

plt.tight_layout()
plt.show()
```

결과 해석:

- 사람 눈에는 숫자처럼 보이지만, 모델 입장에서는 64개의 픽셀 값입니다.
- t-SNE는 이 고차원 픽셀 패턴의 가까운 관계를 2D로 펼치는 역할을 합니다.

### 8.4 모델 학습 또는 변환

대규모 고차원 데이터에서는 t-SNE 전에 PCA로 30~50차원 정도까지 줄인 뒤 적용하는 실무 패턴이 많습니다.

```python
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 실무에서는 t-SNE 전에 PCA로 30~50차원까지 줄이는 경우가 많습니다.
pca = PCA(n_components=30, random_state=42)
X_pca = pca.fit_transform(X_scaled)

tsne_model = TSNE(
    n_components=2,
    perplexity=30,
    learning_rate="auto",
    init="pca",
    max_iter=1000,   # 일부 구버전 scikit-learn에서는 n_iter 이름을 사용합니다.
    random_state=42,
)

X_tsne = tsne_model.fit_transform(X_pca)
print("t-SNE embedding shape:", X_tsne.shape)
```

결과 해석:

- PCA는 계산량을 줄이고 노이즈를 약간 정리하는 전처리 역할을 합니다.
- t-SNE는 그다음 국소 구조를 2D 임베딩으로 시각화합니다.

### 8.5 결과 시각화

```python
fig, ax = plt.subplots(figsize=(8, 6))

scatter = ax.scatter(
    X_tsne[:, 0],
    X_tsne[:, 1],
    c=y,
    cmap="tab10",
    s=18,
    alpha=0.8,
    label="digit samples",
)

legend = ax.legend(*scatter.legend_elements(), title="digit", loc="best")
ax.add_artist(legend)
ax.set_title("t-SNE Embedding of Digits Data")
ax.set_xlabel("t-SNE component 1")
ax.set_ylabel("t-SNE component 2")
plt.show()
```

결과 해석:

- 같은 숫자끼리 비교적 가까이 모이는 경향을 볼 수 있습니다.
- 하지만 이 그림만 보고 "실제 군집 개수가 10개로 완벽히 분리된다"고 단정하면 안 됩니다.

### 8.6 결과 해석

이 실습에서 관찰해야 할 포인트는 아래입니다.

1. 같은 숫자가 가까운 지역에 모이는가
2. 비슷한 숫자끼리 경계가 일부 겹치는가
3. 좌표축 자체에는 원래 pixel feature 의미가 없다는 점을 기억하는가

## 9. 파라미터 변화 비교

### 9.1 `perplexity` 값별 결과 비교

```python
perplexity_values = [5, 30, 50]
embeddings = []

for perplexity_value in perplexity_values:
    model = TSNE(
        n_components=2,
        perplexity=perplexity_value,
        learning_rate="auto",
        init="pca",
        max_iter=1000,
        random_state=42,
    )
    embeddings.append(model.fit_transform(X_pca))

all_x = np.concatenate([embedding[:, 0] for embedding in embeddings])
all_y = np.concatenate([embedding[:, 1] for embedding in embeddings])
x_min, x_max = all_x.min() - 5, all_x.max() + 5
y_min, y_max = all_y.min() - 5, all_y.max() + 5

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

for ax, perplexity_value, embedding in zip(axes, perplexity_values, embeddings):
    scatter = ax.scatter(
        embedding[:, 0],
        embedding[:, 1],
        c=y,
        cmap="tab10",
        s=15,
        alpha=0.8,
        label="digit samples",
    )
    ax.set_title(f"perplexity = {perplexity_value}")
    ax.set_xlabel("t-SNE component 1")
    ax.set_ylabel("t-SNE component 2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)

legend = axes[-1].legend(*scatter.legend_elements(), title="digit", loc="best")
axes[-1].add_artist(legend)
plt.tight_layout()
plt.show()
```

결과 해석:

- `perplexity`가 작으면 매우 국소 구조에 민감해 잘게 나뉘는 느낌이 날 수 있습니다.
- 값이 커지면 더 넓은 이웃 구조를 반영하려 하지만, 너무 크면 국소 분리가 약해질 수 있습니다.

### 9.2 `random_state` 변화에 따른 결과 비교

```python
random_states = [0, 42]
embeddings = []

for seed in random_states:
    model = TSNE(
        n_components=2,
        perplexity=30,
        learning_rate="auto",
        init="pca",
        max_iter=1000,
        random_state=seed,
    )
    embeddings.append(model.fit_transform(X_pca))

all_x = np.concatenate([embedding[:, 0] for embedding in embeddings])
all_y = np.concatenate([embedding[:, 1] for embedding in embeddings])
x_min, x_max = all_x.min() - 5, all_x.max() + 5
y_min, y_max = all_y.min() - 5, all_y.max() + 5

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

for ax, seed, embedding in zip(axes, random_states, embeddings):
    scatter = ax.scatter(
        embedding[:, 0],
        embedding[:, 1],
        c=y,
        cmap="tab10",
        s=15,
        alpha=0.8,
        label="digit samples",
    )
    ax.set_title(f"random_state = {seed}")
    ax.set_xlabel("t-SNE component 1")
    ax.set_ylabel("t-SNE component 2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)

legend = axes[-1].legend(*scatter.legend_elements(), title="digit", loc="best")
axes[-1].add_artist(legend)
plt.tight_layout()
plt.show()
```

결과 해석:

- t-SNE는 비볼록 최적화라 초기 조건과 난수에 따라 배치가 달라질 수 있습니다.
- 그래서 재현 가능한 교육 자료나 보고서에서는 `random_state` 고정이 중요합니다.

## 10. 언제 사용하는가

### 적합한 상황

- 고차원 데이터를 2D로 시각화하고 싶다
- 가까운 이웃 구조가 어떻게 보이는지 탐색하고 싶다
- 이미지, 임베딩, 텍스트 벡터처럼 feature가 많은 데이터를 직관적으로 보고 싶다

### 주의하거나 피해야 하는 상황

- 신규 데이터가 계속 들어와 일반적인 `transform()`이 필요한 운영 환경
- 대시보드에서 항상 동일한 고정 좌표가 필요한 경우
- t-SNE 결과만으로 실제 군집 수를 확정하려는 경우

## 11. 장점과 한계

### 장점

- 고차원 데이터의 국소 구조를 시각적으로 잘 드러내는 경우가 많습니다.
- 같은 클래스가 어떤 식으로 가까운지 직관적으로 보여주기 좋습니다.
- 탐색적 데이터 분석과 교육용 시각화에 강합니다.

### 한계

- 축 자체는 직접 해석할 수 없습니다.
- 결과 배치의 거리, 크기, 빈 공간을 과해석하면 위험합니다.
- 일반적인 scikit-learn t-SNE는 학습 후 새 데이터에 대해 일반적인 `transform()`을 바로 쓰는 구조가 아닙니다.

## 12. 다른 알고리즘과 비교

| 비교 기준 | PCA | t-SNE |
| --- | --- | --- |
| 방식 | 선형 | 비선형 |
| 주요 보존 대상 | 전체 분산 | 국소 이웃 관계 |
| 축 해석 | 상대적으로 가능 | 직접 해석 어려움 |
| 신규 데이터 변환 | 가능 | 일반적으로 제한적 |
| 주요 용도 | 전처리, 압축, 시각화 | 고차원 시각화 |

## 13. 실무 체크리스트

- t-SNE를 군집화가 아니라 시각화 도구로 이해하고 있는가
- 스케일링이나 PCA 전처리가 필요한지 확인했는가
- `perplexity`를 두세 값 이상 비교했는가
- `random_state`를 고정해 결과 재현성을 확보했는가
- 결과 거리와 군집 크기를 과해석하지 않도록 주석이나 설명을 남겼는가

## 14. 핵심 요약

핵심 정리

- 핵심 원리: 고차원에서 가까운 이웃 관계가 저차원에서도 유지되도록 KL divergence를 최소화합니다.
- 주요 파라미터: `perplexity`, `learning_rate`, `init`, `random_state`
- 적합한 데이터: 고차원 시각화가 필요한 이미지·임베딩·복잡한 수치 데이터
- 중요한 주의사항: 축과 거리, 군집 크기를 직접 해석하면 안 되고, 새 데이터 일반 변환에는 제한이 있습니다.

> 이미지 제안: 올바른 t-SNE 해석과 잘못된 해석을 좌우 비교한 그림  
> 위치: `11. 장점과 한계` 바로 위  
> 핵심 개념: t-SNE 군집 거리와 크기를 과해석하면 안 된다는 점  
> 주요 객체와 배치: 왼쪽은 "좋은 해석" 체크 표시, 오른쪽은 "나쁜 해석" 경고 표시  
> 추천 색상 구분: 올바른 해석은 파랑·초록, 잘못된 해석은 빨강·주황 경고색  
> AI 프롬프트: "Educational comparison graphic showing correct versus incorrect interpretation of t-SNE plots, emphasizing local neighborhood preservation and warning against overinterpreting cluster distance and size"

다음에는 비슷한 시각화 계열이지만, manifold structure와 이웃 그래프를 이용해 일부 전체 구조까지 함께 보려는 [UMAP: 데이터의 이웃과 매니폴드 구조를 저차원에 표현하기](11-7-umap.md)를 학습합니다.
