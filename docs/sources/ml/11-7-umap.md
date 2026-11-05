## 1. 한 문장으로 이해하기

UMAP은 고차원 데이터가 낮은 차원의 manifold 위에 놓여 있다고 보고, 이웃 관계를 그래프로 표현한 뒤 저차원에서도 비슷한 구조가 유지되도록 임베딩하는 비선형 차원축소 방법입니다.

## 2. 왜 필요한가

t-SNE는 고차원 시각화에 강력하지만, 실무에서는 이런 고민이 생깁니다.

- 국소 구조뿐 아니라 일부 전체 구조도 함께 보고 싶다
- 속도가 더 빠른 대안이 필요하다
- 학습 후 새로운 데이터를 같은 임베딩 공간으로 보내고 싶다

UMAP은 이런 요구에서 자주 등장합니다.

즉, UMAP은 "가까운 이웃 관계를 잘 보존하면서도,  
일부 전체 구조와 후속 활용성까지 조금 더 챙겨 보자"는 방향의 도구로 이해하면 좋습니다.

이 페이지에서도 다시 강조하지만, UMAP 역시 `군집화 알고리즘`이 아니라  
주로 `차원축소 및 임베딩` 알고리즘입니다.

## 3. 직관적으로 이해하기

구겨진 지도를 펼친다고 생각해 보겠습니다.

- 원래 고차원 데이터는 접히고 꼬인 manifold 위에 놓여 있습니다.
- 가까운 이웃 관계를 잃지 않으면서 지도를 펼쳐야 합니다.
- 너무 꽉 누르면 지역 구조만 남고, 너무 느슨하면 전체 구조가 흐려집니다.

UMAP은 바로 이 "구겨진 지도를 펼치되,  
가까운 길과 동네 구조를 최대한 유지하는 작업"에 가깝습니다.

여기서 `fuzzy simplicial set`은 너무 어렵게 생각하지 마시고,  
"점과 점 사이 연결 강도를 가진 이웃 그래프" 정도로 이해하시면 충분합니다.

![UMAP 전체 흐름](../assets/ch11-unsupervised-images/umap-overview.jpeg)

*그림: 고차원 manifold에서 가까운 이웃 그래프를 만들고, 그 연결 구조가 저차원에서도 비슷하게 유지되도록 임베딩하는 UMAP의 전체 흐름입니다.*

> 이미지 제안: 구겨진 고차원 manifold가 이웃 그래프를 거쳐 2D 임베딩으로 펼쳐지는 과정  
> 위치: `3. 직관적으로 이해하기` 바로 아래  
> 핵심 개념: manifold, nearest-neighbor graph, low-dimensional embedding  
> 주요 객체와 배치: 왼쪽은 꼬인 리본 모양 manifold, 가운데는 그래프, 오른쪽은 2D 점 배치  
> 추천 색상 구분: 국소 이웃은 파랑, 서로 다른 구역은 보라·청록·주황  
> AI 프롬프트: "Educational UMAP infographic showing high-dimensional manifold, nearest-neighbor graph construction, and low-dimensional embedding, clean Korean textbook style"

## 4. 핵심 개념과 용어

| 용어 | 의미 | 결과에 미치는 영향 |
| --- | --- | --- |
| manifold | 고차원 데이터가 실제로 놓여 있는 더 낮은 차원의 구조 | UMAP의 핵심 가정입니다. |
| manifold learning | manifold 구조를 학습하는 접근 | 비선형 차원축소의 이론적 배경이 됩니다. |
| local neighborhood | 각 점 주변의 가까운 이웃 | 국소 구조 보존의 핵심입니다. |
| nearest-neighbor graph | 가까운 이웃을 연결한 그래프 | UMAP이 학습의 출발점으로 삼는 구조입니다. |
| fuzzy simplicial set | 연결 강도를 가진 이웃 그래프 표현 | 점 사이 관계를 부드럽게 표현합니다. |
| embedding | 저차원 좌표 표현 | 최종 시각화나 저차원 feature가 됩니다. |
| local structure | 가까운 관계 | `n_neighbors`가 크게 영향을 줍니다. |
| global structure | 더 넓은 배치 감각 | 파라미터와 데이터에 따라 일부 반영됩니다. |
| `n_neighbors` | 고려할 이웃 규모 | local vs broader structure 균형에 영향 |
| `min_dist` | 임베딩에서 점 간 최소 거리 성향 | 군집이 얼마나 촘촘하게 보일지 바꿉니다. |
| `metric` | 원래 공간 거리 기준 | 어떤 점이 이웃인지 달라집니다. |
| `random_state` | 재현성 제어 | 결과 비교와 보고서 재현성을 높입니다. |

## 5. 알고리즘 동작 과정

1. 고차원 데이터에서 각 샘플의 가까운 이웃을 찾습니다.
2. 이웃 간 연결 강도를 가진 그래프를 만듭니다.
3. 이 그래프를 `fuzzy simplicial set` 관점으로 표현합니다.
4. 저차원 공간에 점들을 배치합니다.
5. 저차원 그래프가 고차원 그래프와 비슷해지도록 반복 최적화합니다.
6. 최종적으로 2D, 3D 또는 그 이상의 임베딩을 얻습니다.

```text
고차원 데이터
 -> 각 샘플의 가까운 이웃 탐색
 -> 이웃 간 연결 강도를 가진 그래프 생성
 -> 저차원에서도 비슷한 그래프가 되도록 최적화
 -> 2D / 3D / 저차원 feature 생성
```

## 6. 핵심 수식과 의미

UMAP은 고차원 이웃 그래프와 저차원 이웃 그래프가 비슷해지도록 최적화합니다.

수학적으로는 연결 강도 \(w_{ij}\)와 저차원 연결 \(\hat{w}_{ij}\) 사이의 차이를 줄이는 방향으로 볼 수 있습니다.

\[
L =
\sum_{i \ne j}
\left[
w_{ij}\log\frac{w_{ij}}{\hat{w}_{ij}}
 + (1-w_{ij})\log\frac{1-w_{ij}}{1-\hat{w}_{ij}}
\right]
\]

이 수식을 아주 직관적으로 읽으면:

- 고차원에서 강하게 연결된 점은 저차원에서도 가깝게 두고
- 원래 멀었던 점은 저차원에서도 너무 붙지 않게 하자는 뜻입니다.

즉, UMAP은 "연결 강도가 비슷한 그래프"를 저차원에서도 재구성하려는 방식입니다.

## 7. 주요 파라미터

| 파라미터 | 역할 | 값이 작을 때 | 값이 클 때 | 실무 선택 기준 |
| --- | --- | --- | --- | --- |
| `n_neighbors` | 고려할 이웃 수 | 매우 국소 구조 강조 | 더 넓은 구조도 고려 | 국소 패턴 탐색이면 작게, 전체 배치 감각도 보고 싶으면 크게 시도합니다. |
| `min_dist` | 임베딩에서 점들이 얼마나 붙을지 | 군집이 더 조밀해짐 | 점이 더 넓게 퍼짐 | 시각화 밀집도와 군집 분리감을 보며 조정합니다. |
| `n_components` | 임베딩 차원 수 | 정보 표현 제한 | 더 다양한 저차원 표현 가능 | 2D 시각화, 3D 탐색, 또는 저차원 feature 생성 목적에 따라 정합니다. |
| `metric` | 원래 공간 거리 기준 | 이웃 정의가 바뀜 | 이웃 정의가 바뀜 | 수치형은 Euclidean, sparse/text는 Cosine도 검토합니다. |
| `random_state` | 재현성 | 결과 비교 어려움 | 결과 비교 쉬움 | 교육과 보고서에는 고정합니다. |

### 7.1 핵심 파라미터 해석

#### `n_neighbors`

- 작은 값: 매우 가까운 지역 구조를 강하게 봅니다.
- 큰 값: 더 넓은 범위와 전체적인 구조를 함께 보려 합니다.

#### `min_dist`

- 작은 값: 군집 내부 점이 더 촘촘하게 붙습니다.
- 큰 값: 점이 더 넓게 퍼집니다.

#### `n_components`

- 2차원 시각화뿐 아니라
- 3차원 시각화
- 또는 5차원, 10차원 같은 저차원 feature 생성에도 쓸 수 있습니다.

#### `metric`

- `euclidean`
- `manhattan`
- `cosine`

처럼 데이터 성격에 따라 거리 기준을 바꿀 수 있습니다.

## 8. Python 실습

### 8.1 라이브러리 불러오기

UMAP은 기본 scikit-learn에 포함되지 않으므로 `umap-learn` 설치가 필요합니다.

```bash
pip install umap-learn
```

Jupyter Notebook이나 Google Colab에서는 설치 후 커널 재시작이 필요할 수 있습니다.

```python
import time
import numpy as np
import matplotlib.pyplot as plt

import umap

from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
```

결과 해석:

- 이 환경에서는 `umap-learn` 패키지를 별도로 설치해야 합니다.
- 이후 실습은 t-SNE와 같은 `load_digits` 데이터를 사용해 직접 비교가 가능하도록 구성합니다.

### 8.2 예제 데이터 생성 또는 불러오기

```python
digits = load_digits()
X = digits.data
y = digits.target

print("X shape:", X.shape)
print("y shape:", y.shape)
```

결과 해석:

- 64차원 숫자 이미지 데이터를 UMAP으로 2차원에 펼쳐 봅니다.

### 8.3 데이터 시각화

먼저 스케일링을 적용합니다.

```python
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

결과 해석:

- 픽셀 스케일 차이가 크진 않지만, 거리 기반 이웃 그래프를 안정적으로 만들기 위해 표준화를 적용했습니다.

### 8.4 모델 학습 또는 변환

```python
umap_model = umap.UMAP(
    n_neighbors=15,
    min_dist=0.1,
    n_components=2,
    metric="euclidean",
    random_state=42,
)

X_umap = umap_model.fit_transform(X_scaled)
print("UMAP embedding shape:", X_umap.shape)
```

결과 해석:

- `n_neighbors=15`는 지역 구조와 어느 정도 넓은 구조의 균형을 보는 기본값입니다.
- `min_dist=0.1`은 군집을 적당히 조밀하게 보여주는 편입니다.

### 8.5 결과 시각화

```python
fig, ax = plt.subplots(figsize=(8, 6))

scatter = ax.scatter(
    X_umap[:, 0],
    X_umap[:, 1],
    c=y,
    cmap="tab10",
    s=18,
    alpha=0.8,
    label="digit samples",
)

legend = ax.legend(*scatter.legend_elements(), title="digit", loc="best")
ax.add_artist(legend)
ax.set_title("UMAP Embedding of Digits Data")
ax.set_xlabel("UMAP component 1")
ax.set_ylabel("UMAP component 2")
plt.show()
```

결과 해석:

- 같은 숫자들이 비교적 가까운 위치에 모이는 경향을 볼 수 있습니다.
- 다만 UMAP 축 역시 원래 feature 의미를 그대로 가지지 않습니다.

### 8.6 결과 해석

이 실습에서 봐야 할 포인트는 아래입니다.

1. 같은 숫자가 어느 정도 구분되어 보이는가
2. 너무 뭉치거나 지나치게 퍼지지 않는가
3. UMAP도 시각화 도구이지, 이 그림만으로 군집 개수를 확정할 수 없다는 점을 기억하는가

## 9. 파라미터 변화 비교

### 9.1 `n_neighbors` 값 비교

```python
n_neighbors_values = [5, 15, 50]
embeddings = []

for n_neighbors_value in n_neighbors_values:
    model = umap.UMAP(
        n_neighbors=n_neighbors_value,
        min_dist=0.1,
        n_components=2,
        metric="euclidean",
        random_state=42,
    )
    embeddings.append(model.fit_transform(X_scaled))

all_x = np.concatenate([embedding[:, 0] for embedding in embeddings])
all_y = np.concatenate([embedding[:, 1] for embedding in embeddings])
x_min, x_max = all_x.min() - 1, all_x.max() + 1
y_min, y_max = all_y.min() - 1, all_y.max() + 1

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

for ax, n_neighbors_value, embedding in zip(axes, n_neighbors_values, embeddings):
    scatter = ax.scatter(
        embedding[:, 0],
        embedding[:, 1],
        c=y,
        cmap="tab10",
        s=15,
        alpha=0.8,
        label="digit samples",
    )
    ax.set_title(f"n_neighbors = {n_neighbors_value}")
    ax.set_xlabel("UMAP component 1")
    ax.set_ylabel("UMAP component 2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)

legend = axes[-1].legend(*scatter.legend_elements(), title="digit", loc="best")
axes[-1].add_artist(legend)
plt.tight_layout()
plt.show()
```

결과 해석:

- 작은 `n_neighbors`는 매우 국소 구조에 집중합니다.
- 큰 값은 더 넓은 구조를 보려 하기 때문에 전체 배치가 달라질 수 있습니다.

### 9.2 `min_dist` 값 비교

```python
min_dist_values = [0.0, 0.1, 0.5]
embeddings = []

for min_dist_value in min_dist_values:
    model = umap.UMAP(
        n_neighbors=15,
        min_dist=min_dist_value,
        n_components=2,
        metric="euclidean",
        random_state=42,
    )
    embeddings.append(model.fit_transform(X_scaled))

all_x = np.concatenate([embedding[:, 0] for embedding in embeddings])
all_y = np.concatenate([embedding[:, 1] for embedding in embeddings])
x_min, x_max = all_x.min() - 1, all_x.max() + 1
y_min, y_max = all_y.min() - 1, all_y.max() + 1

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

for ax, min_dist_value, embedding in zip(axes, min_dist_values, embeddings):
    scatter = ax.scatter(
        embedding[:, 0],
        embedding[:, 1],
        c=y,
        cmap="tab10",
        s=15,
        alpha=0.8,
        label="digit samples",
    )
    ax.set_title(f"min_dist = {min_dist_value}")
    ax.set_xlabel("UMAP component 1")
    ax.set_ylabel("UMAP component 2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)

legend = axes[-1].legend(*scatter.legend_elements(), title="digit", loc="best")
axes[-1].add_artist(legend)
plt.tight_layout()
plt.show()
```

결과 해석:

- `min_dist`가 작으면 점들이 더 조밀하게 모입니다.
- 값이 커지면 같은 군집 안 점들도 더 넓게 퍼집니다.

### 9.3 t-SNE와 실행 시간 비교 예시

```python
start = time.perf_counter()
umap_embedding = umap.UMAP(
    n_neighbors=15,
    min_dist=0.1,
    n_components=2,
    random_state=42,
).fit_transform(X_scaled)
umap_time = time.perf_counter() - start

start = time.perf_counter()
tsne_embedding = TSNE(
    n_components=2,
    perplexity=30,
    learning_rate="auto",
    init="pca",
    max_iter=1000,
    random_state=42,
).fit_transform(X_scaled)
tsne_time = time.perf_counter() - start

print(f"UMAP time: {umap_time:.2f} seconds")
print(f"t-SNE time: {tsne_time:.2f} seconds")
```

결과 해석:

- 데이터와 환경에 따라 다르지만, UMAP이 더 빠른 경우가 많습니다.
- 그러나 "항상 UMAP이 더 우수하다"는 뜻은 아닙니다.

### 9.4 신규 데이터 `transform()` 예시

UMAP은 학습된 모델로 새로운 데이터를 변환할 수 있습니다.

```python
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

umap_model = umap.UMAP(
    n_neighbors=15,
    min_dist=0.1,
    n_components=2,
    random_state=42,
)

X_train_umap = umap_model.fit_transform(X_train)
X_test_umap = umap_model.transform(X_test)

print("train embedding shape:", X_train_umap.shape)
print("test embedding shape:", X_test_umap.shape)
```

결과 해석:

- UMAP은 학습된 임베딩 모델을 기준으로 새 데이터를 보낼 수 있다는 장점이 있습니다.
- 다만 새 데이터 분포가 학습 데이터와 크게 다르면 결과를 그대로 믿기 어렵습니다.

## 10. 언제 사용하는가

### 적합한 상황

- 고차원 데이터를 2D/3D로 시각화하고 싶다
- 국소 구조와 일부 전체 구조를 함께 보고 싶다
- 새 데이터를 같은 임베딩 공간으로 보내는 기능도 원한다

### 주의하거나 피해야 하는 상황

- 임베딩 좌표를 원래 feature처럼 직접 해석해야 하는 경우
- 분포가 자주 크게 바뀌는 신규 데이터에 대해 안정적 좌표를 강하게 요구하는 경우
- UMAP 그림만 보고 군집 수나 정책을 확정하려는 경우

## 11. 장점과 한계

### 장점

- 유연한 비선형 차원축소가 가능합니다.
- 시각화 품질이 좋아 exploratory analysis에 유용합니다.
- `transform()`을 지원해 새로운 데이터 활용성이 t-SNE보다 좋은 편입니다.

### 한계

- 파라미터에 따라 모양이 꽤 달라질 수 있습니다.
- 축과 거리 자체를 원래 데이터 의미처럼 해석하면 안 됩니다.
- t-SNE보다 항상 더 좋다고 일반화할 수는 없습니다.

## 12. 다른 알고리즘과 비교

| 비교 기준 | t-SNE | UMAP |
| --- | --- | --- |
| 핵심 목적 | 국소 구조 시각화 | 국소 구조와 일부 전체 구조 표현 |
| 주요 파라미터 | `perplexity` | `n_neighbors`, `min_dist` |
| 실행 속도 | 큰 데이터에서 느릴 수 있음 | 상대적으로 빠른 경우가 많음 |
| 신규 데이터 변환 | 일반적으로 제한적 | `transform` 지원 |
| 임베딩 차원 | 주로 2D, 3D 시각화 | 다양한 차원 가능 |
| 결과 해석 주의 | 거리와 크기 과해석 금지 | 거리와 축 의미 과해석 금지 |

## 13. 실무 체크리스트

- `umap-learn` 설치와 실행 환경을 확인했는가
- `n_neighbors`, `min_dist`를 두세 값 이상 비교했는가
- `transform()`이 필요한 문제인지 먼저 분명히 했는가
- 새 데이터 분포가 학습 데이터와 얼마나 다른지 점검했는가
- 결과 좌표와 거리 해석을 과장하지 않도록 주석을 남겼는가

## 14. 핵심 요약

핵심 정리

- 핵심 원리: 고차원 이웃 그래프와 저차원 이웃 그래프가 비슷해지도록 manifold 구조를 임베딩합니다.
- 주요 파라미터: `n_neighbors`, `min_dist`, `metric`
- 적합한 데이터: 고차원 시각화, manifold 구조 탐색, 새 데이터 transform이 필요한 경우
- 중요한 주의사항: 축 해석 금지, 파라미터 민감도, 분포가 다른 신규 데이터에 대한 과신 금지

> 이미지 제안: `n_neighbors`와 `min_dist`를 바꿨을 때 임베딩이 어떻게 달라지는지 4칸 비교 그림  
> 위치: `9. 파라미터 변화 비교` 섹션 안  
> 핵심 개념: 국소 구조 강조와 점 간 간격 조절의 차이  
> 주요 객체와 배치: 같은 digits 임베딩을 2x2 패널로 배치해 UMAP 모양 차이 비교  
> 추천 색상 구분: 숫자 클래스는 파랑·청록·보라·주황·초록 팔레트  
> AI 프롬프트: "Four-panel educational UMAP parameter comparison showing changes in n_neighbors and min_dist on the same digits embedding, clean Korean data science infographic"

UMAP 다음에는 종합 프로젝트 장으로 넘어가, 지금까지 배운 비지도학습과 차원축소 결과를 실제 분석 흐름 속에서 어떻게 활용할지 연결해 봅니다.
