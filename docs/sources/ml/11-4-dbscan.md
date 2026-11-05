## 1. 한 문장으로 이해하기

DBSCAN은 데이터가 빽빽하게 모여 있는 영역을 하나의 군집으로 보고, 주변에서 떨어진 점은 이상치로 분리하는 밀도 기반 군집화 알고리즘입니다.

## 2. 왜 필요한가

K-Means는 군집 수를 미리 정해야 하고, 원형에 가까운 군집을 더 잘 다루는 편입니다.  
하지만 현실 데이터는 종종 아래처럼 생깁니다.

- 반달 모양처럼 휘어진 군집
- 소수의 이상치가 섞인 데이터
- 군집 수를 미리 정하기 어려운 상황

이럴 때 DBSCAN이 유용합니다.

DBSCAN은 아래 질문에 답하려는 방식입니다.

- "이 점 주변이 충분히 붐비는가?"
- "이 붐비는 구역이 서로 연결되어 있는가?"

즉, K-Means가 `중심점 기준 분할`이라면, DBSCAN은 `밀집된 영역 확장`에 가깝습니다.

## 3. 직관적으로 이해하기

축제 현장을 떠올려 보겠습니다.

- 사람들이 많이 모여 있는 구역은 하나의 모임입니다.
- 모임 가장자리에서 살짝 붙어 있는 사람은 그 모임의 경계 인원입니다.
- 멀리 혼자 떨어져 있는 사람은 어느 모임에도 속하지 않는 이상치처럼 보입니다.

DBSCAN은 바로 이 관점으로 데이터를 읽습니다.

- 사람이 많고 가까우면 `Core Point`
- 모임 가장자리에 있으면 `Border Point`
- 어디에도 충분히 가깝지 않으면 `Noise Point`

```text
빽빽한 중심 구역 -> Core Point
중심 주변 가장자리 -> Border Point
멀리 혼자 떨어진 점 -> Noise Point
```

![DBSCAN 핵심 개념](../assets/ch11-unsupervised-images/dbscan-overview.png)

*그림: 데이터 분포를 보고 core point를 찾은 뒤, 밀도로 연결된 이웃을 따라 군집을 확장하고 마지막에 noise를 분리하는 DBSCAN의 전체 흐름입니다.*

![DBSCAN의 Core Point, Border Point, Noise Point 예시](../assets/ch11-unsupervised-images/dbscan-core-border-noise-example.png)

*그림: `eps` 반경 안에 충분한 이웃이 있는 core point, core의 이웃이지만 스스로는 밀도가 부족한 border point, 그리고 어느 군집에도 안정적으로 연결되지 않는 noise point를 한 화면에서 보여주는 예시입니다. 그림에 표시된 `minPts`는 scikit-learn의 `min_samples`와 같은 개념으로 이해하시면 됩니다.*

> 이미지 제안: Core Point, Border Point, Noise Point를 한 그림에서 비교한 2차원 산점도  
> 위치: `3. 직관적으로 이해하기` 바로 아래  
> 핵심 개념: core, border, noise의 차이  
> 주요 객체와 배치: 가운데 파란 core point와 원형 eps 반경, 가장자리 초록 border point, 멀리 회색 noise point  
> 추천 색상 구분: core는 진한 파랑, border는 청록, noise는 회색  
> AI 프롬프트: "Educational DBSCAN scatter plot showing one core point with epsilon circle, border points near cluster edge, and gray noise points far away, clean Korean textbook infographic"

## 4. 핵심 개념과 용어

| 용어 | 의미 | 결과에 미치는 영향 |
| --- | --- | --- |
| 밀도 기반 군집화 | 점이 얼마나 빽빽하게 모여 있는지로 군집을 정의 | 비정형 군집과 이상치 분리에 유리합니다. |
| `eps` | 이웃으로 볼 반경 \(\varepsilon\) | 너무 작으면 noise가 많아지고, 너무 크면 다른 군집이 합쳐질 수 있습니다. |
| `min_samples` | 반경 안에 있어야 하는 최소 샘플 수 | 군집 인정 기준의 엄격함을 결정합니다. |
| \(\varepsilon\)-neighborhood | 한 점에서 `eps` 반경 안에 있는 이웃 집합 | 어떤 점이 core인지 판정하는 기준입니다. |
| Core Point | 주변 이웃 수가 `min_samples` 이상인 점 | 군집 확장의 출발점이 됩니다. |
| Border Point | core는 아니지만 core의 이웃인 점 | 군집 가장자리에 포함됩니다. |
| Noise Point | 어느 군집에도 충분히 연결되지 않은 점 | 라벨 `-1`로 분리됩니다. |
| density reachable | core point를 따라 밀도로 연결 가능한 상태 | 군집이 어떻게 확장되는지 설명합니다. |
| density connected | 서로 같은 밀도 경로로 이어지는 상태 | 두 점이 같은 군집인지 이해하는 개념입니다. |

## 5. 알고리즘 동작 과정

1. 임의의 샘플 하나를 선택합니다.
2. 그 점을 중심으로 `eps` 반경 안 이웃을 찾습니다.
3. 이웃 수가 `min_samples` 이상이면 core point로 지정합니다.
4. core point의 이웃 중 또 다른 core point를 따라 군집을 확장합니다.
5. core point는 아니지만 core의 반경 안에 있는 점은 border point로 포함합니다.
6. 어느 군집에도 연결되지 않는 점은 noise point로 남깁니다.

여기서 중요한 점은 `min_samples`를 셀 때 자기 자신도 포함된다는 것입니다.

예를 들어 `min_samples=5`라면:

- 자기 자신 1개
- 반경 안 이웃 4개

를 포함해 총 5개 이상이어야 core point가 됩니다.

```text
점 선택
 -> eps 반경 안 이웃 확인
 -> 이웃 수 >= min_samples ?
    -> 예: Core Point, 군집 확장
    -> 아니오: 일단 보류
 -> 어느 군집에도 못 들어가면 Noise
```

## 6. 핵심 수식과 의미

어떤 점 \(x_i\)의 \(\varepsilon\)-이웃은 아래처럼 씁니다.

\[
N_{\varepsilon}(x_i) = \{x_j \mid d(x_i, x_j) \le \varepsilon\}
\]

의미:

- 점 \(x_i\)에서 거리 \(\varepsilon\) 안에 있는 모든 점의 집합입니다.

Core point 조건은 아래처럼 쓸 수 있습니다.

\[
|N_{\varepsilon}(x_i)| \ge \text{min\_samples}
\]

의미:

- 반경 안 이웃 수가 충분히 많으면 그 점은 밀집 구역의 중심으로 봅니다.

핵심은 복잡한 수식보다 아래입니다.

- `eps`는 "가깝다"의 기준
- `min_samples`는 "충분히 붐빈다"의 기준

## 7. 주요 파라미터

| 파라미터 | 역할 | 값이 작을 때 | 값이 클 때 | 실무 선택 기준 |
| --- | --- | --- | --- | --- |
| `eps` | 이웃으로 볼 반경 | noise가 많아질 수 있음 | 다른 군집이 합쳐질 수 있음 | k-distance plot, 스케일링 후 거리 분포를 같이 봅니다. |
| `min_samples` | core point가 되기 위한 최소 샘플 수 | 작은 묶음도 쉽게 군집이 됨 | 더 엄격한 밀도 기준 적용 | 차원 수, noise 수준, 기대 군집 크기를 함께 봅니다. |
| `metric` | 거리 계산 방식 | 데이터 형태에 따라 민감 | 데이터 형태에 따라 민감 | 수치형 기본은 Euclidean, 문서/텍스트는 Cosine도 검토합니다. |
| `algorithm` | 이웃 탐색 방법 | 탐색 방식 차이 | 탐색 방식 차이 | 큰 데이터에서는 계산 효율도 고려합니다. |

파라미터를 잘못 잡으면 이런 현상이 나타납니다.

- `eps`가 너무 작다 -> 대부분이 `-1` noise
- `eps`가 너무 크다 -> 서로 다른 군집이 하나로 합쳐짐
- `min_samples`가 너무 작다 -> 작은 잡음 덩어리도 군집으로 인식
- `min_samples`가 너무 크다 -> 진짜 군집도 noise가 될 수 있음

## 8. Python 실습

### 8.1 라이브러리 불러오기

```python
import numpy as np
import matplotlib.pyplot as plt

from sklearn.cluster import DBSCAN, KMeans
from sklearn.datasets import make_moons
from sklearn.metrics import davies_bouldin_score, silhouette_score
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
```

결과 해석:

- `NearestNeighbors`는 k-distance plot을 그릴 때 사용합니다.
- `silhouette_score`, `davies_bouldin_score`는 군집 품질 참고용 지표입니다.

### 8.2 예제 데이터 생성 또는 불러오기

DBSCAN의 장점이 잘 드러나도록 `make_moons`를 사용합니다.  
그리고 스케일링의 중요성을 보여주기 위해 한 축을 일부러 늘린 버전도 함께 만듭니다.

```python
X, y_true = make_moons(n_samples=500, noise=0.07, random_state=42)

# 스케일 차이의 영향을 보기 위해 x축을 인위적으로 늘립니다.
X_stretched = X.copy()
X_stretched[:, 0] = X_stretched[:, 0] * 4.0

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_stretched)

print("원본 데이터 shape:", X.shape)
```

결과 해석:

- `y_true`는 비교 시각화용일 뿐, 학습에는 사용하지 않습니다.
- 실제 실무 데이터는 변수 단위가 제각각이므로 `X_stretched` 같은 상황이 자주 생깁니다.

### 8.3 데이터 시각화

스케일링 전후에 어떤 데이터 모양을 보게 되는지 먼저 확인합니다.

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].scatter(X_stretched[:, 0], X_stretched[:, 1], s=25, c="steelblue", alpha=0.8, label="raw")
axes[0].set_title("Stretched Data Before Scaling")
axes[0].set_xlabel("feature_1")
axes[0].set_ylabel("feature_2")
axes[0].legend()

axes[1].scatter(X_scaled[:, 0], X_scaled[:, 1], s=25, c="darkorange", alpha=0.8, label="scaled")
axes[1].set_title("Data After StandardScaler")
axes[1].set_xlabel("scaled_feature_1")
axes[1].set_ylabel("scaled_feature_2")
axes[1].legend()

plt.tight_layout()
plt.show()
```

결과 해석:

- 스케일링 전에는 한 축이 과장되어 거리 구조가 왜곡됩니다.
- DBSCAN처럼 거리 반경을 직접 쓰는 알고리즘에서는 이 왜곡이 결과에 크게 영향을 줍니다.

### 8.4 모델 학습 또는 변환

먼저 비교용으로 K-Means와 DBSCAN을 각각 학습합니다.

```python
kmeans_model = KMeans(n_clusters=2, random_state=42, n_init=10)
kmeans_labels = kmeans_model.fit_predict(X_scaled)

dbscan_model = DBSCAN(
    eps=0.25,         # 반경 크기
    min_samples=5,    # 자기 자신 포함 최소 샘플 수
    metric="euclidean",
)
dbscan_labels = dbscan_model.fit_predict(X_scaled)

print("K-Means labels:", np.unique(kmeans_labels))
print("DBSCAN labels:", np.unique(dbscan_labels))
```

결과 해석:

- DBSCAN 결과에 `-1`이 보이면 noise point가 분리된 것입니다.
- K-Means는 모든 점을 반드시 어떤 군집에 넣지만, DBSCAN은 그렇지 않습니다.

### 8.5 결과 시각화

원본 데이터, K-Means 결과, DBSCAN 결과를 비교합니다.

```python
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

axes[0].scatter(X_scaled[:, 0], X_scaled[:, 1], s=25, c="gray", alpha=0.8, label="samples")
axes[0].set_title("Original Data (Scaled)")
axes[0].set_xlabel("scaled_feature_1")
axes[0].set_ylabel("scaled_feature_2")
axes[0].legend()

for cluster_id in np.unique(kmeans_labels):
    mask = kmeans_labels == cluster_id
    axes[1].scatter(
        X_scaled[mask, 0],
        X_scaled[mask, 1],
        s=25,
        alpha=0.85,
        label=f"cluster {cluster_id}",
    )
axes[1].set_title("K-Means Result")
axes[1].set_xlabel("scaled_feature_1")
axes[1].set_ylabel("scaled_feature_2")
axes[1].legend()

for cluster_id in np.unique(dbscan_labels):
    mask = dbscan_labels == cluster_id
    if cluster_id == -1:
        axes[2].scatter(
            X_scaled[mask, 0],
            X_scaled[mask, 1],
            s=25,
            c="black",
            alpha=0.9,
            label="noise (-1)",
        )
    else:
        axes[2].scatter(
            X_scaled[mask, 0],
            X_scaled[mask, 1],
            s=25,
            alpha=0.85,
            label=f"cluster {cluster_id}",
        )
axes[2].set_title("DBSCAN Result")
axes[2].set_xlabel("scaled_feature_1")
axes[2].set_ylabel("scaled_feature_2")
axes[2].legend()

plt.tight_layout()
plt.show()
```

결과 해석:

- K-Means는 초승달 구조를 직선 경계처럼 나누기 쉽습니다.
- DBSCAN은 휘어진 두 반달 모양을 더 자연스럽게 찾을 수 있습니다.
- 이상치가 있다면 `-1`로 분리됩니다.

### 8.6 결과 해석

이 실습에서 봐야 할 핵심은 아래입니다.

1. 군집 수를 미리 주지 않았는데도 두 개의 반달 구조를 찾는가
2. noise point를 별도로 분리하는가
3. 스케일링 전후에 같은 `eps`라도 전혀 다른 결과가 나오는가

## 9. 파라미터 변화 비교

### 9.1 k-distance plot으로 `eps` 후보 찾기

`min_samples`가 5라면, 각 점의 5번째 최근접 이웃 거리 분포를 보고 `eps` 후보를 탐색할 수 있습니다.

```python
k = 5  # DBSCAN의 min_samples와 맞춥니다. 자기 자신도 포함된다는 점을 기억합니다.
neighbors = NearestNeighbors(n_neighbors=k)
neighbors.fit(X_scaled)

distances, indices = neighbors.kneighbors(X_scaled)
kth_distances = np.sort(distances[:, -1])

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(kth_distances, color="royalblue", label=f"{k}-distance")
ax.set_title("k-distance Plot for eps Candidate Search")
ax.set_xlabel("sorted sample index")
ax.set_ylabel(f"distance to {k}-th nearest neighbor")
ax.legend()
plt.show()
```

결과 해석:

- 그래프가 완만하다가 갑자기 꺾이는 지점이 `eps` 후보가 될 수 있습니다.
- 절대 정답은 아니지만, `eps`를 감으로 고르는 것보다 훨씬 낫습니다.

### 9.2 `eps` 값 변화 비교

```python
eps_values = [0.15, 0.25, 0.40]
x_min, x_max = X_scaled[:, 0].min() - 0.5, X_scaled[:, 0].max() + 0.5
y_min, y_max = X_scaled[:, 1].min() - 0.5, X_scaled[:, 1].max() + 0.5

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

for ax, eps_value in zip(axes, eps_values):
    model = DBSCAN(eps=eps_value, min_samples=5)
    labels = model.fit_predict(X_scaled)

    for cluster_id in np.unique(labels):
        mask = labels == cluster_id
        if cluster_id == -1:
            ax.scatter(
                X_scaled[mask, 0],
                X_scaled[mask, 1],
                s=25,
                c="black",
                alpha=0.9,
                label="noise (-1)",
            )
        else:
            ax.scatter(
                X_scaled[mask, 0],
                X_scaled[mask, 1],
                s=25,
                alpha=0.85,
                label=f"cluster {cluster_id}",
            )

    ax.set_title(f"DBSCAN with eps={eps_value}")
    ax.set_xlabel("scaled_feature_1")
    ax.set_ylabel("scaled_feature_2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)
    ax.legend(fontsize=8)

plt.tight_layout()
plt.show()
```

결과 해석:

- `eps`가 너무 작으면 많은 점이 noise가 됩니다.
- `eps`가 커지면 끊어져 있던 부분이 연결되면서 군집이 커집니다.
- 너무 크면 서로 다른 군집이 하나로 이어질 수 있습니다.

### 9.3 `min_samples` 값 변화 비교

```python
min_samples_values = [3, 5, 10]

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

for ax, min_samples_value in zip(axes, min_samples_values):
    model = DBSCAN(eps=0.25, min_samples=min_samples_value)
    labels = model.fit_predict(X_scaled)

    for cluster_id in np.unique(labels):
        mask = labels == cluster_id
        if cluster_id == -1:
            ax.scatter(
                X_scaled[mask, 0],
                X_scaled[mask, 1],
                s=25,
                c="black",
                alpha=0.9,
                label="noise (-1)",
            )
        else:
            ax.scatter(
                X_scaled[mask, 0],
                X_scaled[mask, 1],
                s=25,
                alpha=0.85,
                label=f"cluster {cluster_id}",
            )

    ax.set_title(f"DBSCAN with min_samples={min_samples_value}")
    ax.set_xlabel("scaled_feature_1")
    ax.set_ylabel("scaled_feature_2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)
    ax.legend(fontsize=8)

plt.tight_layout()
plt.show()
```

결과 해석:

- `min_samples`가 작으면 작은 밀집 덩어리도 군집으로 인정됩니다.
- 값이 커질수록 core point 조건이 엄격해져 noise가 늘 수 있습니다.

### 9.4 StandardScaler 적용 전후 비교

```python
labels_before_scaling = DBSCAN(eps=0.8, min_samples=5).fit_predict(X_stretched)
labels_after_scaling = DBSCAN(eps=0.25, min_samples=5).fit_predict(X_scaled)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

for cluster_id in np.unique(labels_before_scaling):
    mask = labels_before_scaling == cluster_id
    color = "black" if cluster_id == -1 else None
    label = "noise (-1)" if cluster_id == -1 else f"cluster {cluster_id}"
    axes[0].scatter(X_stretched[mask, 0], X_stretched[mask, 1], s=25, c=color, alpha=0.85, label=label)

axes[0].set_title("DBSCAN Before Scaling")
axes[0].set_xlabel("feature_1 (stretched)")
axes[0].set_ylabel("feature_2")
axes[0].legend(fontsize=8)

for cluster_id in np.unique(labels_after_scaling):
    mask = labels_after_scaling == cluster_id
    color = "black" if cluster_id == -1 else None
    label = "noise (-1)" if cluster_id == -1 else f"cluster {cluster_id}"
    axes[1].scatter(X_scaled[mask, 0], X_scaled[mask, 1], s=25, c=color, alpha=0.85, label=label)

axes[1].set_title("DBSCAN After StandardScaler")
axes[1].set_xlabel("scaled_feature_1")
axes[1].set_ylabel("scaled_feature_2")
axes[1].legend(fontsize=8)

plt.tight_layout()
plt.show()
```

결과 해석:

- DBSCAN은 거리 반경을 직접 쓰므로, 스케일이 바뀌면 `eps`의 의미가 완전히 달라집니다.
- 그래서 거리 기반 알고리즘에서는 스케일링 여부가 성능 이전에 `알고리즘 정의 자체`에 영향을 줍니다.

## 10. 언제 사용하는가

### 적합한 상황

- 군집 수를 미리 정하기 어렵다
- 군집 모양이 원형이 아니라 비정형이다
- 이상치나 noise를 따로 분리하고 싶다
- 공간 데이터, 좌표 데이터, 행동 패턴처럼 밀도 개념이 중요한 경우

### 주의하거나 피해야 하는 상황

- 군집별 밀도 차이가 매우 크다
- 고차원이라 거리 개념이 희미하다
- `eps`를 해석할 수 있는 거리 스케일이 없다

## 11. 장점과 한계

### 장점

- 군집 수를 사전에 정하지 않아도 됩니다.
- 비정형 모양 군집을 자연스럽게 찾을 수 있습니다.
- 이상치를 `-1`로 분리해 실무 해석이 명확해집니다.

### 한계

- 데이터 밀도가 크게 다르면 한 파라미터로 모두 설명하기 어렵습니다.
- `eps`, `min_samples`에 매우 민감할 수 있습니다.
- 고차원 데이터에서는 이웃 거리 자체가 불안정해질 수 있습니다.

## 12. 다른 알고리즘과 비교

| 비교 기준 | K-Means | DBSCAN |
| --- | --- | --- |
| 군집 수 사전 지정 | 필요 | 불필요 |
| 군집 모양 | 구형에 유리 | 비정형 구조 가능 |
| 이상치 처리 | 모든 점을 군집에 배정 | Noise로 분리 |
| 주요 파라미터 | `K` | `eps`, `min_samples` |
| 밀도 차이가 큰 데이터 | 제한적 | 어려울 수 있음 |

### 군집 품질 지표 해석

- `Silhouette Score`

\[
s = \frac{b-a}{\max(a, b)}
\]

여기서 \(a\)는 같은 군집 안 평균 거리, \(b\)는 가장 가까운 다른 군집까지 평균 거리입니다.

- `Davies-Bouldin Index`

군집 내부 퍼짐은 작고, 군집 사이 거리는 멀수록 더 좋은 점수를 받습니다.  
값이 낮을수록 더 좋습니다.

실습에서는 DBSCAN의 noise 라벨 `-1`을 포함하면 해석이 꼬일 수 있으므로,  
아래처럼 `noise`를 제외한 점들만 참고 지표로 계산하는 편이 낫습니다.

```python
valid_mask = dbscan_labels != -1
valid_labels = dbscan_labels[valid_mask]

if len(np.unique(valid_labels)) >= 2:
    sil_score = silhouette_score(X_scaled[valid_mask], valid_labels)
    db_index = davies_bouldin_score(X_scaled[valid_mask], valid_labels)
    print(f"Silhouette Score (noise 제외): {sil_score:.3f}")
    print(f"Davies-Bouldin Index (noise 제외): {db_index:.3f}")
else:
    print("유효한 군집이 2개 미만이라 Silhouette Score를 계산할 수 없습니다.")
```

결과 해석:

- Silhouette Score는 직관적이지만, DBSCAN의 noise와 비정형 군집 품질을 완벽하게 대변하지는 못합니다.
- 따라서 점수 하나보다 시각화, noise 비율, 파라미터 안정성을 함께 봐야 합니다.

> 이미지 제안: `eps`가 작을 때와 클 때, `min_samples`가 작을 때와 클 때를 4칸으로 비교한 그림  
> 위치: `9. 파라미터 변화 비교` 섹션 안  
> 핵심 개념: `eps`와 `min_samples`가 군집 크기와 noise 양을 바꾼다는 점  
> 주요 객체와 배치: 2x2 패널, 같은 데이터에 다른 파라미터 결과를 비교  
> 추천 색상 구분: 군집은 파랑·청록·주황, noise는 검정  
> AI 프롬프트: "Four-panel DBSCAN parameter comparison infographic showing how eps and min_samples change clusters and noise points on the same moon-shaped dataset"

## 13. 실무 체크리스트

- 스케일 차이가 큰 변수에 StandardScaler 같은 전처리를 적용했는가
- `eps` 후보를 k-distance plot으로 탐색했는가
- `min_samples`를 차원 수와 noise 수준을 고려해 정했는가
- `-1` noise 비율이 너무 높거나 너무 낮지 않은가
- 군집 결과를 시각화로 직접 확인했는가

## 14. 핵심 요약

핵심 정리

- 핵심 원리: 밀도가 충분히 높은 core point에서 시작해 연결된 이웃으로 군집을 확장합니다.
- 주요 파라미터: `eps`, `min_samples`
- 적합한 데이터: 비정형 군집, 이상치가 섞인 거리 기반 데이터
- 중요한 주의사항: 스케일링이 매우 중요하고, 밀도 차이가 크면 한 번에 잘 안 맞을 수 있습니다.

다음에는 한 점이 하나의 군집에만 속한다고 단정하지 않고, 여러 군집에 속할 확률로 표현하는 [Gaussian Mixture Model: 군집 소속을 확률로 표현하기](11-5-gaussian-mixture-model.md)를 학습합니다.
