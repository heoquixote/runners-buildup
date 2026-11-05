## 1. 한 문장으로 이해하기

Agglomerative Clustering은 처음에 각 샘플을 하나의 군집으로 두고, 가장 가까운 군집끼리 차례대로 합치면서 계층 구조를 만드는 상향식 군집화 알고리즘입니다.

## 2. 왜 필요한가

K-Means는 빠르고 직관적이지만 아래 한계가 있습니다.

- 군집 중심을 가정합니다.
- 군집 수 `K`를 미리 정해야 합니다.
- 군집이 어떻게 합쳐지는지 과정 자체는 보여주지 않습니다.

실무에서는 종종 이런 질문이 생깁니다.

- 고객 세그먼트가 3개인지 4개인지 아직 모르겠다.
- 묶이는 과정을 단계별로 보고 싶다.
- 작은 그룹이 큰 그룹 안에 포함되는 계층 구조를 보고 싶다.

이럴 때 계층적 군집화가 유용합니다.

특히 Agglomerative Clustering은 아래처럼 생각하면 쉽습니다.

`각 데이터가 하나의 군집`  
`-> 가장 가까운 군집 병합`  
`-> 병합된 군집끼리 다시 비교`  
`-> 원하는 개수의 군집이 될 때까지 반복`

K-Means가 "중심점을 기준으로 나누기"라면, 계층적 군집화는 "가까운 것끼리 합쳐서 나무 구조 만들기"에 가깝습니다.

## 3. 직관적으로 이해하기

친구 모임을 만든다고 생각해 보겠습니다.

1. 처음에는 모든 사람이 혼자 서 있습니다.
2. 가장 친한 두 사람이 먼저 짝을 이룹니다.
3. 그다음 가장 비슷한 사람이나 모임끼리 다시 합쳐집니다.
4. 이 과정을 반복하면 작은 모임이 큰 모임 안에 들어가는 구조가 생깁니다.

즉, Agglomerative Clustering은 "가까운 친구끼리 묶고, 다시 비슷한 모임끼리 합치는 과정"입니다.

여기서 중요한 점은 최종 결과만 보는 것이 아니라, `어떤 순서로 묶였는지`까지 본다는 것입니다.

```text
[A] [B] [C] [D] [E]
 -> [AB] [C] [D] [E]
 -> [AB] [CD] [E]
 -> [ABCD] [E]
 -> [ABCDE]
```

위 구조를 그림처럼 보여주는 것이 `덴드로그램(dendrogram)`입니다.

![계층적 군집화 전체 흐름](../assets/ch11-unsupervised-images/agglomerative-clustering-overview.png)

*그림: 각 데이터가 개별 군집에서 시작해 가장 가까운 군집부터 차례대로 병합되고, 마지막에는 덴드로그램으로 계층 구조를 해석하는 흐름입니다.*

> 이미지 제안: 데이터 점들이 하나씩 병합되어 더 큰 군집으로 합쳐지는 4단계 그림  
> 위치: `3. 직관적으로 이해하기` 바로 아래  
> 핵심 개념: 상향식 병합과 계층 구조 형성  
> 주요 객체와 배치: 왼쪽에는 개별 점, 오른쪽으로 갈수록 점들이 타원 군집으로 묶이는 흐름  
> 추천 색상 구분: 초기 점은 파란색, 병합된 군집은 연한 청록색과 보라색  
> AI 프롬프트: "Educational diagram of agglomerative clustering showing individual points merging step by step into larger clusters, clean white background, Korean data science infographic style"

## 4. 핵심 개념과 용어

| 용어 | 의미 | 결과에 미치는 영향 |
| --- | --- | --- |
| 계층적 군집화 | 군집을 나누거나 합치며 계층 구조를 만드는 방법 | 최종 군집뿐 아니라 병합 과정까지 해석할 수 있습니다. |
| 상향식 병합 | 각 샘플에서 시작해 가까운 군집을 계속 합치는 방식 | Agglomerative Clustering의 핵심 흐름입니다. |
| 거리 행렬 | 모든 샘플 또는 군집 사이 거리를 정리한 표 | 어떤 군집이 먼저 합쳐질지 결정합니다. |
| 덴드로그램 | 병합 과정을 나무 구조로 시각화한 그림 | 어느 높이에서 자를지에 따라 군집 수가 달라집니다. |
| linkage | 군집 간 거리를 계산하는 규칙 | 같은 데이터라도 군집 모양과 병합 순서가 달라질 수 있습니다. |
| metric | 샘플 간 거리를 계산하는 방식 | Euclidean, Manhattan 등에 따라 가까움의 정의가 달라집니다. |
| n_clusters | 최종적으로 만들 군집 수 | 명시하면 그 개수에서 병합을 멈춥니다. |
| distance_threshold | 이 거리 이상으로는 병합하지 않겠다는 기준 | 군집 수를 직접 지정하지 않고 덴드로그램 높이 기준으로 자를 수 있습니다. |

## 5. 알고리즘 동작 과정

1. 각 샘플을 하나의 독립된 군집으로 시작합니다.
2. 모든 군집 사이 거리를 계산합니다.
3. 가장 가까운 두 군집을 찾습니다.
4. 두 군집을 하나의 더 큰 군집으로 합칩니다.
5. 병합된 새 군집을 기준으로 군집 간 거리를 다시 계산합니다.
6. 원하는 `n_clusters`가 될 때까지, 또는 `distance_threshold`를 넘기 전까지 반복합니다.

```text
초기 상태
[1] [2] [3] [4] [5]

가장 가까운 군집 병합
[12] [3] [4] [5]

다시 가장 가까운 군집 병합
[12] [34] [5]

반복
[1234] [5]
```

핵심은 `샘플 간 거리`가 아니라, 병합 이후에는 `군집 간 거리`를 어떤 규칙으로 계산하느냐입니다.  
이 규칙이 바로 `linkage`입니다.

## 6. 핵심 수식과 의미

### 6.1 군집 간 거리의 기본 개념

두 군집 \(A\), \(B\) 사이 거리를 \(d(A, B)\)라고 쓰면, linkage 방식에 따라 이 값을 계산하는 공식이 달라집니다.

### 6.2 Single Linkage

\[
d_{\text{single}}(A, B) = \min_{x \in A, y \in B} d(x, y)
\]

의미:

- 두 군집에서 가장 가까운 두 점만 봅니다.
- 한 점만 가까워도 두 군집이 빨리 이어질 수 있습니다.

### 6.3 Complete Linkage

\[
d_{\text{complete}}(A, B) = \max_{x \in A, y \in B} d(x, y)
\]

의미:

- 두 군집에서 가장 먼 두 점까지 고려합니다.
- 군집 전체가 충분히 조밀해야 병합되기 쉽습니다.

### 6.4 Average Linkage

\[
d_{\text{average}}(A, B) =
\frac{1}{|A||B|}
\sum_{x \in A}\sum_{y \in B} d(x, y)
\]

의미:

- 두 군집의 모든 점 쌍 평균 거리를 봅니다.
- single과 complete의 중간 성향으로 생각하면 됩니다.

### 6.5 Ward Linkage

Ward 방식은 단순히 두 군집 사이 거리 하나를 보는 대신,  
두 군집을 합쳤을 때 `군집 내 제곱합(within-cluster sum of squares)`이 얼마나 늘어나는지를 봅니다.

\[
\Delta(A, B) = SSE(A \cup B) - SSE(A) - SSE(B)
\]

의미:

- 병합 후 군집 내부 분산 증가량이 가장 작은 쌍을 우선 합칩니다.
- 즉, `군집 내 분산 최소화` 관점입니다.

Ward가 Euclidean distance를 필요로 하는 이유는  
이 방식이 결국 평균과 제곱거리 기반 분산 개념에 기대고 있기 때문입니다.  
Manhattan 같은 거리에서는 같은 방식의 분산 최소화 해석이 자연스럽지 않습니다.

## 7. 주요 파라미터

| 파라미터 | 역할 | 값이 작을 때 | 값이 클 때 | 실무 선택 기준 |
| --- | --- | --- | --- | --- |
| `n_clusters` | 최종 군집 수 | 더 거친 큰 군집이 만들어질 수 있음 | 더 잘게 나뉜 군집이 유지됨 | 비즈니스에서 해석 가능한 세그먼트 수와 함께 봅니다. |
| `distance_threshold` | 이 거리 이하까지만 병합 | 병합이 빨리 멈춰 군집 수가 많아질 수 있음 | 더 멀리 있는 군집까지 합쳐짐 | 덴드로그램 절단 높이와 같이 봅니다. |
| `linkage` | 군집 간 거리 계산 규칙 | 방식마다 결과가 다름 | 방식마다 결과가 다름 | 데이터 모양과 해석 목적에 따라 바꿔 봅니다. |
| `metric` | 샘플 간 거리 계산 방식 | 거리 개념이 민감해질 수 있음 | 거리 개념이 달라짐 | 수치 스케일, 도메인 거리 해석과 맞는지 봅니다. |
| `compute_distances` | 병합 거리 기록 여부 | 덴드로그램 정보가 제한될 수 있음 | 병합 거리 해석이 쉬워짐 | 덴드로그램을 보려면 켜 두는 편이 편합니다. |

파라미터를 잘못 잡으면 이런 현상이 생깁니다.

- `n_clusters`가 너무 작으면 다른 성격의 집단이 한 군집으로 뭉칩니다.
- `n_clusters`가 너무 크면 해석하기 어려운 자잘한 군집이 많아집니다.
- `single linkage`는 `chaining effect` 때문에 길게 연결된 하나의 군집을 만들기 쉽습니다.
- `complete linkage`는 조밀한 군집을 선호해 넓게 퍼진 구조를 과하게 쪼갤 수 있습니다.

### 7.1 linkage 방식 비교

| linkage | 군집 간 거리 계산 | 유리한 경우 | 불리한 경우 |
| --- | --- | --- | --- |
| `single` | 가장 가까운 점 기준 | 길게 연결된 구조를 놓치지 않음 | chaining effect로 원치 않는 연결이 생길 수 있음 |
| `complete` | 가장 먼 점 기준 | 조밀하고 분리된 군집을 선호 | 넓게 퍼진 군집을 과하게 분리할 수 있음 |
| `average` | 모든 점 쌍 평균 거리 | single과 complete 사이에서 균형 | 데이터 밀도 차이가 크면 애매할 수 있음 |
| `ward` | 병합 후 분산 증가량 최소화 | 구형에 가까운 조밀한 군집, 해석 안정성 | 비구형 군집이나 Euclidean이 부적절한 거리에는 덜 자연스러움 |

## 8. Python 실습

### 8.1 라이브러리 불러오기

아래 코드는 계층적 군집화와 덴드로그램을 그리는 데 필요한 라이브러리를 불러옵니다.

```python
import numpy as np
import matplotlib.pyplot as plt

from scipy.cluster.hierarchy import dendrogram, linkage
from sklearn.cluster import AgglomerativeClustering, KMeans
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
```

결과 해석:

- `linkage`, `dendrogram`은 SciPy에서 계층 구조를 시각화할 때 사용합니다.
- `AgglomerativeClustering`은 scikit-learn의 실제 군집 모델입니다.

### 8.2 예제 데이터 생성 또는 불러오기

계층 구조가 보이도록 `make_blobs`로 4개 중심을 가진 데이터를 만듭니다.

```python
# 작은 군집과 큰 군집이 함께 보이도록 중심과 분산을 조금 다르게 설정합니다.
X, y_true = make_blobs(
    n_samples=240,
    centers=[(-6, -2), (-2, 0), (2, 2), (6, -1)],
    cluster_std=[0.8, 1.1, 0.7, 1.0],
    random_state=42,
)

# 거리 기반 알고리즘이므로 표준화를 적용합니다.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("데이터 shape:", X.shape)
```

결과 해석:

- `y_true`는 시각화 비교용일 뿐, 모델 학습에는 사용하지 않습니다.
- 거리 기반 군집화는 변수 스케일 차이에 영향을 받으므로 표준화 습관이 중요합니다.

### 8.3 데이터 시각화

원본 데이터 분포를 먼저 확인합니다.

```python
fig, ax = plt.subplots(figsize=(6, 5))
ax.scatter(X[:, 0], X[:, 1], s=35, c="steelblue", alpha=0.8, label="samples")
ax.set_title("Original Blob Data")
ax.set_xlabel("feature_1")
ax.set_ylabel("feature_2")
ax.legend()
plt.show()
```

결과 해석:

- 점들이 여러 묶음처럼 보이지만, 어디까지를 하나의 군집으로 볼지는 아직 정하지 않았습니다.
- 계층적 군집화는 이 묶임이 어떤 순서로 커지는지까지 보여줍니다.

### 8.4 모델 학습 또는 변환

Ward linkage로 4개 군집을 만들겠습니다.

```python
agg_model = AgglomerativeClustering(
    n_clusters=4,
    linkage="ward",
    metric="euclidean",
    compute_distances=True,  # 병합 거리 기록
)

agg_labels = agg_model.fit_predict(X_scaled)
print("예측된 군집 라벨:", np.unique(agg_labels))
```

결과 해석:

- `compute_distances=True`는 병합 높이 해석에 도움이 됩니다.
- Ward는 군집 내 분산을 작게 유지하려는 방식이라 비교적 안정적인 군집을 만드는 편입니다.

### 8.5 결과 시각화

먼저 최종 군집 결과를 그립니다.

```python
fig, ax = plt.subplots(figsize=(6, 5))

for cluster_id in np.unique(agg_labels):
    mask = agg_labels == cluster_id
    ax.scatter(
        X[mask, 0],
        X[mask, 1],
        s=35,
        alpha=0.85,
        label=f"cluster {cluster_id}",
    )

ax.set_title("Agglomerative Clustering Result (Ward Linkage)")
ax.set_xlabel("feature_1")
ax.set_ylabel("feature_2")
ax.legend()
plt.show()
```

결과 해석:

- 같은 데이터라도 linkage를 바꾸면 경계가 달라질 수 있습니다.
- Ward는 비교적 둥글고 조밀한 군집을 선호하는 경향이 있습니다.

이번에는 SciPy로 덴드로그램을 그립니다.

```python
# SciPy linkage 함수로 병합 구조를 계산합니다.
linkage_matrix = linkage(X_scaled, method="ward", metric="euclidean")

fig, ax = plt.subplots(figsize=(10, 5))
dendrogram(linkage_matrix, ax=ax, truncate_mode="lastp", p=20)
ax.axhline(y=8.0, color="crimson", linestyle="--", label="cut height = 8.0")
ax.set_title("Dendrogram (Ward Linkage)")
ax.set_xlabel("merged node index")
ax.set_ylabel("merge distance")
ax.legend()
plt.show()
```

결과 해석:

- 덴드로그램의 세로축은 병합 거리입니다.
- 위쪽에서 병합될수록 서로 덜 비슷한 군집이 늦게 합쳐졌다는 뜻입니다.
- 빨간 선처럼 특정 높이에서 자르면 군집 수를 탐색할 수 있습니다.

### 8.6 결과 해석

이 실습에서 봐야 할 포인트는 아래입니다.

1. 데이터는 자연스럽게 몇 개의 큰 묶음처럼 보이는가
2. 덴드로그램에서 갑자기 병합 높이가 커지는 지점이 있는가
3. 그 높이 아래에서 자를 때 해석 가능한 군집 수가 나오는가

즉, 계층적 군집화는 `최종 레이블`뿐 아니라  
`어디서 잘라야 자연스러운가`를 함께 판단하는 도구입니다.

## 9. 파라미터 변화 비교

### 9.1 linkage별 결과 비교

동일한 데이터에 대해 linkage를 바꿔 보겠습니다.

```python
linkage_options = ["single", "complete", "average", "ward"]
x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

for ax, linkage_name in zip(axes.ravel(), linkage_options):
    model = AgglomerativeClustering(
        n_clusters=4,
        linkage=linkage_name,
        metric="euclidean",
    )
    labels = model.fit_predict(X_scaled)

    for cluster_id in np.unique(labels):
        mask = labels == cluster_id
        ax.scatter(
            X[mask, 0],
            X[mask, 1],
            s=25,
            alpha=0.85,
            label=f"cluster {cluster_id}",
        )

    ax.set_title(f"Linkage = {linkage_name}")
    ax.set_xlabel("feature_1")
    ax.set_ylabel("feature_2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)
    ax.legend(fontsize=8)

plt.tight_layout()
plt.show()
```

결과 해석:

- `single`은 멀리 떨어진 점들이 사슬처럼 이어지는 `chaining effect`가 나타날 수 있습니다.
- `complete`는 군집 내부가 더 조밀해 보이는 결과를 선호합니다.
- `average`는 그 중간 성향을 보입니다.
- `ward`는 군집 내 분산 증가를 최소화해 비교적 안정적인 덩어리를 만들기 쉽습니다.

### 9.2 덴드로그램 절단 높이에 따른 군집 수 변화

`distance_threshold`를 바꿔서 병합을 어디서 멈출지 바꿔 보겠습니다.

```python
threshold_values = [3.0, 5.0, 7.0, 9.0]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

for ax, threshold in zip(axes.ravel(), threshold_values):
    model = AgglomerativeClustering(
        n_clusters=None,                 # 군집 수를 직접 주지 않음
        distance_threshold=threshold,    # 이 거리보다 멀면 병합 중단
        linkage="ward",
        metric="euclidean",
    )
    labels = model.fit_predict(X_scaled)

    for cluster_id in np.unique(labels):
        mask = labels == cluster_id
        ax.scatter(
            X[mask, 0],
            X[mask, 1],
            s=25,
            alpha=0.85,
            label=f"cluster {cluster_id}",
        )

    ax.set_title(f"distance_threshold = {threshold:.1f}")
    ax.set_xlabel("feature_1")
    ax.set_ylabel("feature_2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)
    ax.legend(fontsize=8)

plt.tight_layout()
plt.show()
```

결과 해석:

- `distance_threshold`가 작으면 병합이 일찍 멈춰 군집 수가 많아집니다.
- 값이 커지면 더 큰 군집으로 합쳐집니다.
- 덴드로그램을 보며 "어디서 자를지" 판단하는 감각이 중요합니다.

> 이미지 제안: 덴드로그램 위에 서로 다른 절단 높이 두세 개를 표시한 그림  
> 위치: `9.2 덴드로그램 절단 높이에 따른 군집 수 변화` 바로 위  
> 핵심 개념: 절단 높이에 따라 군집 수가 달라진다는 점  
> 주요 객체와 배치: 세로축이 병합 거리인 덴드로그램, 빨간/주황/초록 절단선 3개  
> 추천 색상 구분: 가지는 남색, 절단선은 빨강·주황·초록  
> AI 프롬프트: "Educational dendrogram for hierarchical clustering with three colored cut lines at different heights showing different cluster counts, clean textbook infographic"

## 10. 언제 사용하는가

### 적합한 상황

- 군집이 어떤 계층 구조로 묶이는지 보고 싶을 때
- 군집 수를 바로 정하기보다 탐색하고 싶을 때
- 고객 세그먼트, 문서 묶음, 유전자 데이터처럼 계층적 해석이 중요한 경우

### 주의하거나 피해야 하는 상황

- 샘플 수가 매우 많아 거리 행렬 계산이 부담될 때
- 군집 경계를 아주 빠르게 반복 계산해야 할 때
- linkage 선택에 따른 결과 변화를 감당하기 어려울 때

## 11. 장점과 한계

### 장점

- 병합 과정을 보여주므로 최종 군집만 보는 것보다 해석 폭이 넓습니다.
- 덴드로그램 덕분에 군집 수를 탐색적으로 정할 수 있습니다.
- 중심점 가정이 없어 K-Means와 다른 시각을 제공합니다.

### 한계

- 샘플 수가 커질수록 계산 비용이 빠르게 증가합니다.
- linkage와 metric 선택에 따라 결과가 꽤 달라질 수 있습니다.
- 한 번 병합된 군집은 다시 되돌리지 않기 때문에 초반 병합이 결과에 영향을 줄 수 있습니다.

## 12. 다른 알고리즘과 비교

| 비교 기준 | K-Means | 계층적 군집화 |
| --- | --- | --- |
| 군집 중심 | 사용 | 사용하지 않음 |
| 군집 수 지정 | 일반적으로 필요 | 덴드로그램으로 탐색 가능 |
| 계층 구조 | 제공하지 않음 | 제공 |
| 대규모 데이터 | 상대적으로 유리 | 계산 비용 증가 |
| 결과 해석 | 중심점 기반 | 병합 구조 기반 |

## 13. 실무 체크리스트

- 거리 기반 군집화에 앞서 스케일링이 필요한지 확인했는가
- `single`, `complete`, `average`, `ward`를 최소 두세 개는 비교했는가
- 덴드로그램에서 절단 높이를 해석 가능한 수준으로 골랐는가
- 군집 수가 비즈니스 액션으로 이어질 수 있는가
- 표본 수가 커서 계층적 군집화 비용이 과도하지 않은가

## 14. 핵심 요약

핵심 정리

- 핵심 원리: 각 샘플에서 시작해 가까운 군집을 차례대로 합치며 계층 구조를 만듭니다.
- 주요 파라미터: `linkage`, `metric`, `n_clusters`, `distance_threshold`
- 적합한 데이터: 계층 구조 해석이 중요한 군집 데이터
- 중요한 주의사항: `single`의 chaining effect, `ward`의 Euclidean 필요성, 큰 데이터에서의 계산 비용

다음에는 밀도 기반으로 군집을 찾고 이상치를 따로 분리할 수 있는 [DBSCAN: 밀도가 높은 영역을 군집으로 찾기](11-4-dbscan.md)를 학습합니다.
