## 1. 한 문장으로 이해하기

Gaussian Mixture Model은 데이터가 여러 개의 Gaussian 분포가 섞여 만들어졌다고 가정하고, 각 샘플이 각 군집에 속할 확률을 추정하는 생성 확률 모델입니다.

## 2. 왜 필요한가

K-Means는 각 샘플을 반드시 딱 하나의 군집에 배정합니다.

예:

- 샘플 A -> 군집 1

이 방식은 단순하고 빠르지만, 경계에 걸쳐 있는 샘플을 다룰 때는 거칠 수 있습니다.

현실 데이터에서는 종종 이런 상황이 있습니다.

- 두 고객군 특성이 일부 겹친다
- 군집 모양이 원형이 아니라 타원형이다
- 한 샘플이 한 군집에만 완전히 속한다고 보기 어렵다

이럴 때 GMM이 유용합니다.

K-Means가 `Hard Clustering`이라면:

```text
샘플 A -> 군집 1
```

GMM은 `Soft Clustering`입니다:

```text
샘플 A -> 군집 1일 확률 70%
         군집 2일 확률 30%
```

즉, GMM은 "어느 군집이냐"만 묻지 않고  
"어느 군집일 가능성이 얼마나 크냐"를 함께 봅니다.

## 3. 직관적으로 이해하기

사람을 성향별로 분류한다고 생각해 보겠습니다.

- 아주 명확한 사람은 "거의 확실히 A 그룹"
- 애매한 사람은 "A 같기도 하고 B 같기도 함"

K-Means는 이 애매한 사람에게도 하나의 라벨만 줍니다.  
반면 GMM은 "A일 확률 60%, B일 확률 40%"처럼 말합니다.

또한 GMM은 군집 모양을 타원형으로 볼 수 있습니다.  
즉, 어떤 군집은 길게 늘어난 형태, 어떤 군집은 둥근 형태로 표현할 수 있습니다.

![Gaussian Mixture Model 전체 흐름](../assets/ch11-unsupervised-images/gmm-overview.png)

*그림: 여러 Gaussian component를 가정하고, 각 샘플의 소속 확률을 계산한 뒤 EM 알고리즘으로 분포 파라미터를 반복 학습해 soft clustering 결과를 얻는 흐름입니다.*

![K-Means와 GMM의 군집 할당 방식 비교](../assets/ch11-unsupervised-images/gmm-hard-vs-soft-example.png)

*그림: 왼쪽 K-Means는 모든 포인트를 하나의 군집에 강하게 할당하고, 오른쪽 GMM은 겹치는 영역의 포인트에 대해 여러 군집 소속 확률을 함께 부여하는 방식을 보여줍니다. 즉, K-Means는 hard clustering, GMM은 soft clustering이라는 차이를 직관적으로 확인할 수 있습니다.*

> 이미지 제안: K-Means의 hard clustering과 GMM의 soft clustering을 나란히 비교한 그림  
> 위치: `3. 직관적으로 이해하기` 바로 아래  
> 핵심 개념: 한 샘플을 하나의 군집으로 단정하는 방식과 확률로 표현하는 방식의 차이  
> 주요 객체와 배치: 왼쪽에는 원형 군집과 hard label, 오른쪽에는 겹치는 타원 군집과 확률값  
> 추천 색상 구분: 군집 A는 파랑, 군집 B는 보라, 겹치는 영역은 청록  
> AI 프롬프트: "Educational comparison of K-Means hard clustering versus Gaussian Mixture Model soft clustering with overlapping ellipses and probability labels, clean Korean data science infographic"

## 4. 핵심 개념과 용어

| 용어 | 의미 | 결과에 미치는 영향 |
| --- | --- | --- |
| Gaussian distribution | 평균과 분산으로 정의되는 정규분포 | 군집 모양을 확률분포로 설명합니다. |
| mixture component | 혼합된 Gaussian 분포 하나하나 | 군집 하나에 대응한다고 보면 이해하기 쉽습니다. |
| mean \(\mu\) | 각 component의 중심 | 군집 위치를 결정합니다. |
| covariance \(\Sigma\) | 분산과 방향성, 퍼짐 | 군집이 둥근지 타원형인지 결정합니다. |
| mixture weight \(\pi_k\) | 각 component가 전체에서 차지하는 비중 | 큰 군집과 작은 군집 비율을 반영합니다. |
| likelihood | 현재 파라미터로 데이터가 관측될 가능도 | 학습 과정에서 최대화하려는 값입니다. |
| posterior probability | 샘플이 각 component에 속할 사후확률 | soft clustering 결과로 해석됩니다. |
| responsibility | 한 샘플을 각 component가 얼마나 설명하는지 | E-step에서 계산되는 핵심 값입니다. |
| soft clustering | 하나의 샘플이 여러 군집에 확률적으로 속하는 방식 | 경계 샘플을 부드럽게 표현할 수 있습니다. |
| EM 알고리즘 | E-step과 M-step을 반복하는 최적화 방식 | GMM 파라미터를 학습하는 핵심 절차입니다. |
| local optimum | 지역 최적해 | 초기값에 따라 다른 결과가 나올 수 있습니다. |

## 5. 알고리즘 동작 과정

1. 먼저 Gaussian component 개수 \(K\)를 정합니다.
2. 각 component의 초기 평균, 공분산, 혼합 가중치를 대략 잡습니다.
3. 각 샘플이 각 component에 속할 확률을 계산합니다. (`E-step`)
4. 계산된 확률을 이용해 평균, 공분산, 혼합 가중치를 다시 추정합니다. (`M-step`)
5. likelihood가 충분히 수렴할 때까지 반복합니다.

```text
초기 파라미터 설정
 -> E-step: 소속 확률 계산
 -> M-step: 평균/공분산/가중치 업데이트
 -> likelihood 수렴까지 반복
```

핵심은 "군집 경계를 딱 자르는 것"이 아니라  
"어떤 분포가 이 샘플을 얼마나 설명하는가"를 반복적으로 업데이트하는 것입니다.

## 6. 핵심 수식과 의미

GMM의 혼합분포는 아래처럼 씁니다.

\[
p(x)=\sum_{k=1}^{K}\pi_k \mathcal{N}(x \mid \mu_k,\Sigma_k)
\]

각 기호의 의미는 아래와 같습니다.

| 기호 | 의미 |
| --- | --- |
| \(K\) | Gaussian component 수 |
| \(\pi_k\) | \(k\)번째 component의 혼합 가중치 |
| \(\mu_k\) | \(k\)번째 component의 평균 벡터 |
| \(\Sigma_k\) | \(k\)번째 component의 공분산 행렬 |
| \(\mathcal{N}\) | Gaussian 확률밀도함수 |

이 수식은 "각 데이터가 여러 Gaussian 분포의 섞임에서 나왔다"는 뜻입니다.

### 6.1 E-step

현재 파라미터를 기준으로 각 샘플이 각 component에 속할 확률을 계산합니다.

\[
\gamma(z_{ik}) =
\frac{\pi_k \mathcal{N}(x_i \mid \mu_k, \Sigma_k)}
{\sum_{j=1}^{K}\pi_j \mathcal{N}(x_i \mid \mu_j, \Sigma_j)}
\]

의미:

- \(\gamma(z_{ik})\)는 샘플 \(x_i\)가 component \(k\)에 속할 책임도(responsibility)입니다.

### 6.2 M-step

방금 구한 책임도를 바탕으로 평균, 공분산, 혼합 가중치를 다시 계산합니다.

의미:

- component 중심 \(\mu_k\)가 재조정됩니다.
- component 퍼짐 \(\Sigma_k\)가 재조정됩니다.
- component 크기 비중 \(\pi_k\)가 재조정됩니다.

즉, E-step은 "누가 누구를 얼마나 설명하는가"를 계산하고,  
M-step은 "그 결과로 분포 모양을 다시 그린다"입니다.

## 7. 주요 파라미터

| 파라미터 | 역할 | 값이 작을 때 | 값이 클 때 | 실무 선택 기준 |
| --- | --- | --- | --- | --- |
| `n_components` | Gaussian component 수 | 너무 단순한 모델 | 과하게 복잡한 모델 | AIC, BIC와 해석 가능성을 함께 봅니다. |
| `covariance_type` | 공분산 구조 가정 | 표현력 제한 가능 | 표현력 증가 가능 | 데이터 모양과 계산량 균형을 봅니다. |
| `reg_covar` | 공분산 안정화를 위한 작은 값 | 너무 작으면 불안정 가능 | 너무 크면 분포가 과하게 단순화 | 공분산이 불안정할 때 조정합니다. |
| `n_init` | 서로 다른 초기화 횟수 | local optimum 위험 | 계산량 증가 | 결과가 흔들리면 늘립니다. |
| `max_iter` | EM 최대 반복 횟수 | 수렴 전 종료 가능 | 계산 시간 증가 | 경고 메시지와 수렴 상태를 같이 봅니다. |
| `init_params` | 초기화 방식 | 초기 품질에 영향 | 초기 품질에 영향 | 보통 `kmeans`가 시작점으로 무난합니다. |
| `random_state` | 재현성 제어 | 결과 비교 어려움 | 결과 비교 쉬움 | 교육/실험 재현을 위해 고정합니다. |

### 7.1 `covariance_type` 비교

| 옵션 | 의미 | 표현 가능한 군집 모양 | 계산 복잡도 |
| --- | --- | --- | --- |
| `full` | component마다 독립 공분산 행렬 | 일반 타원형 | 가장 큼 |
| `tied` | 모든 component가 같은 공분산 공유 | 비슷한 방향의 타원형 | 중간 |
| `diag` | 대각 성분만 사용 | 축에 평행한 타원형 | 더 작음 |
| `spherical` | 각 component가 하나의 분산값 사용 | 구형/원형 | 가장 단순 |

실무적으로는 이렇게 보면 편합니다.

- `full`: 가장 유연하지만 계산량이 큼
- `tied`: 모든 군집이 비슷한 모양일 때
- `diag`: 상관관계는 단순화하되 축별 분산은 반영
- `spherical`: K-Means와 비슷한 단순 군집 가정

## 8. Python 실습

### 8.1 라이브러리 불러오기

```python
import numpy as np
import matplotlib.pyplot as plt

from matplotlib.patches import Ellipse
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
```

결과 해석:

- `Ellipse`는 학습된 Gaussian component의 공분산 방향과 퍼짐을 시각화할 때 사용합니다.

### 8.2 예제 데이터 생성 또는 불러오기

타원형이고 일부가 겹치는 군집을 직접 생성합니다.

```python
rng = np.random.default_rng(42)

component_1 = rng.multivariate_normal(
    mean=[-4.5, 0.0],
    cov=[[2.5, 1.4], [1.4, 1.2]],
    size=180,
)
component_2 = rng.multivariate_normal(
    mean=[0.5, 2.5],
    cov=[[1.4, -0.8], [-0.8, 1.2]],
    size=160,
)
component_3 = rng.multivariate_normal(
    mean=[3.8, -1.8],
    cov=[[1.8, 0.7], [0.7, 1.0]],
    size=160,
)

X = np.vstack([component_1, component_2, component_3])
y_true = np.array([0] * len(component_1) + [1] * len(component_2) + [2] * len(component_3))

print("데이터 shape:", X.shape)
```

결과 해석:

- `y_true`는 학습용이 아니라 시각화 비교용입니다.
- 일부 군집이 겹치도록 만들어 soft clustering 특성을 보기 좋게 했습니다.

### 8.3 데이터 시각화

```python
fig, ax = plt.subplots(figsize=(6, 5))

for label_id in np.unique(y_true):
    mask = y_true == label_id
    ax.scatter(X[mask, 0], X[mask, 1], s=25, alpha=0.75, label=f"true group {label_id}")

ax.set_title("Original Elliptical Data")
ax.set_xlabel("feature_1")
ax.set_ylabel("feature_2")
ax.legend()
plt.show()
```

결과 해석:

- 군집이 타원형이고 일부가 겹칩니다.
- 이런 구조는 K-Means보다 GMM이 더 자연스럽게 설명할 가능성이 있습니다.

### 8.4 모델 학습 또는 변환

```python
gmm_model = GaussianMixture(
    n_components=3,
    covariance_type="full",
    n_init=10,
    random_state=42,
)

gmm_model.fit(X)
gmm_labels = gmm_model.predict(X)
gmm_proba = gmm_model.predict_proba(X)

print("군집 라벨:", np.unique(gmm_labels))
print("소속 확률 shape:", gmm_proba.shape)
```

결과 해석:

- `predict()`는 최종 군집 라벨을 줍니다.
- `predict_proba()`는 각 샘플이 각 component에 속할 확률을 줍니다.

### 8.5 결과 시각화

먼저 최종 군집과 Gaussian 타원을 함께 그립니다.

```python
def draw_gmm_ellipse(mean, covariance, ax, color):
    eigenvalues, eigenvectors = np.linalg.eigh(covariance)
    order = eigenvalues.argsort()[::-1]
    eigenvalues = eigenvalues[order]
    eigenvectors = eigenvectors[:, order]

    angle = np.degrees(np.arctan2(eigenvectors[1, 0], eigenvectors[0, 0]))

    for scale in [1.0, 2.0]:
        width, height = 2 * scale * np.sqrt(eigenvalues)
        ellipse = Ellipse(
            xy=mean,
            width=width,
            height=height,
            angle=angle,
            edgecolor=color,
            facecolor="none",
            linewidth=2,
            alpha=0.8,
        )
        ax.add_patch(ellipse)


fig, ax = plt.subplots(figsize=(7, 6))

for cluster_id in np.unique(gmm_labels):
    mask = gmm_labels == cluster_id
    ax.scatter(X[mask, 0], X[mask, 1], s=25, alpha=0.75, label=f"component {cluster_id}")
    draw_gmm_ellipse(gmm_model.means_[cluster_id], gmm_model.covariances_[cluster_id], ax, color=f"C{cluster_id}")

ax.set_title("Gaussian Mixture Model Result")
ax.set_xlabel("feature_1")
ax.set_ylabel("feature_2")
ax.legend()
plt.show()
```

결과 해석:

- 타원은 각 Gaussian component의 평균과 공분산을 시각화합니다.
- 원형이 아닌 비스듬한 타원까지 표현할 수 있다는 점이 GMM의 장점입니다.

경계에 있는 샘플의 소속 확률도 확인해 보겠습니다.

```python
sorted_proba = np.sort(gmm_proba, axis=1)
uncertainty = sorted_proba[:, -1] - sorted_proba[:, -2]  # 가장 큰 확률과 두 번째 확률 차이
boundary_indices = np.argsort(uncertainty)[:5]

for idx in boundary_indices:
    print(f"index={idx}, point={X[idx]}, proba={np.round(gmm_proba[idx], 3)}")
```

결과 해석:

- 확률 차이가 작을수록 경계에 있는 샘플일 가능성이 큽니다.
- 이런 샘플은 "딱 하나의 군집"보다 "두 군집 사이 애매한 점"으로 읽는 편이 자연스럽습니다.

### 8.6 결과 해석

이 실습에서 중요한 것은 아래입니다.

1. 타원형 군집을 GMM이 자연스럽게 설명하는가
2. 겹치는 영역에서 확률 기반 해석이 가능한가
3. hard clustering과 soft clustering이 해석 방식에서 어떻게 다른가

## 9. 파라미터 변화 비교

### 9.1 K-Means 결과와 비교

```python
kmeans_model = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans_labels = kmeans_model.fit_predict(X)

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1

for cluster_id in np.unique(kmeans_labels):
    mask = kmeans_labels == cluster_id
    axes[0].scatter(X[mask, 0], X[mask, 1], s=25, alpha=0.75, label=f"cluster {cluster_id}")
axes[0].set_title("K-Means Result")
axes[0].set_xlabel("feature_1")
axes[0].set_ylabel("feature_2")
axes[0].set_xlim(x_min, x_max)
axes[0].set_ylim(y_min, y_max)
axes[0].legend()

for cluster_id in np.unique(gmm_labels):
    mask = gmm_labels == cluster_id
    axes[1].scatter(X[mask, 0], X[mask, 1], s=25, alpha=0.75, label=f"component {cluster_id}")
    draw_gmm_ellipse(gmm_model.means_[cluster_id], gmm_model.covariances_[cluster_id], axes[1], color=f"C{cluster_id}")
axes[1].set_title("GMM Result")
axes[1].set_xlabel("feature_1")
axes[1].set_ylabel("feature_2")
axes[1].set_xlim(x_min, x_max)
axes[1].set_ylim(y_min, y_max)
axes[1].legend()

plt.tight_layout()
plt.show()
```

결과 해석:

- K-Means는 중심까지 거리 기준이라 타원형과 겹침 구조를 부드럽게 설명하기 어렵습니다.
- GMM은 공분산 구조를 포함하므로 더 유연한 경계를 가질 수 있습니다.

### 9.2 `covariance_type`별 결과 비교

```python
covariance_types = ["full", "tied", "diag", "spherical"]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

for ax, cov_type in zip(axes.ravel(), covariance_types):
    model = GaussianMixture(
        n_components=3,
        covariance_type=cov_type,
        n_init=10,
        random_state=42,
    )
    labels = model.fit_predict(X)

    for cluster_id in np.unique(labels):
        mask = labels == cluster_id
        ax.scatter(X[mask, 0], X[mask, 1], s=20, alpha=0.75, label=f"component {cluster_id}")

    ax.set_title(f"covariance_type = {cov_type}")
    ax.set_xlabel("feature_1")
    ax.set_ylabel("feature_2")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)
    ax.legend(fontsize=8)

plt.tight_layout()
plt.show()
```

결과 해석:

- `full`이 가장 유연하게 타원형을 표현합니다.
- `spherical`은 원형 가정이 강해 복잡한 모양을 충분히 담기 어렵습니다.
- `diag`는 축에 평행한 타원형까지만 표현합니다.

### 9.3 component 수 선택: AIC와 BIC

```python
component_range = range(1, 11)
aic_scores = []
bic_scores = []

for n_components in component_range:
    model = GaussianMixture(
        n_components=n_components,
        covariance_type="full",
        n_init=10,
        random_state=42,
    )
    model.fit(X)
    aic_scores.append(model.aic(X))
    bic_scores.append(model.bic(X))

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(list(component_range), aic_scores, marker="o", label="AIC")
ax.plot(list(component_range), bic_scores, marker="s", label="BIC")
ax.set_title("AIC and BIC for Component Selection")
ax.set_xlabel("number of components")
ax.set_ylabel("score")
ax.legend()
plt.show()
```

결과 해석:

- AIC와 BIC는 둘 다 낮을수록 상대적으로 더 적합한 모델을 뜻합니다.
- BIC는 모델 복잡도에 더 강한 패널티를 주는 경향이 있어 더 보수적으로 component 수를 고를 때가 많습니다.
- 단, 지표 최저점 하나만 맹신하지 말고 해석 가능성도 함께 봐야 합니다.

## 10. 언제 사용하는가

### 적합한 상황

- 한 샘플의 군집 소속을 확률로 보고 싶다
- 군집 모양이 타원형이거나 겹칠 수 있다
- K-Means보다 유연한 확률 모델이 필요하다

### 주의하거나 피해야 하는 상황

- component 수를 전혀 추정할 단서가 없다
- 데이터가 너무 적어 공분산 추정이 불안정하다
- local optimum에 민감한 결과를 감당하기 어렵다

## 11. 장점과 한계

### 장점

- soft clustering이 가능해 경계 샘플 해석이 자연스럽습니다.
- 공분산 구조를 통해 타원형 군집을 표현할 수 있습니다.
- `predict_proba()`로 확률 기반 의사결정이 가능합니다.

### 한계

- component 수를 직접 정하거나 탐색해야 합니다.
- 초기값과 local optimum의 영향을 받을 수 있습니다.
- 공분산 추정이 불안정하면 결과가 흔들릴 수 있습니다.

## 12. 다른 알고리즘과 비교

| 비교 기준 | K-Means | GMM |
| --- | --- | --- |
| 군집 배정 | Hard | Soft |
| 군집 모양 | 주로 구형 | 타원형 가능 |
| 분산 구조 | 직접 반영하지 않음 | 공분산으로 반영 |
| 결과 | 군집 레이블 | 레이블과 소속 확률 |
| 최적화 | 중심까지 거리 최소화 | likelihood 최대화 |

## 13. 실무 체크리스트

- soft clustering이 정말 필요한 문제인지 확인했는가
- `n_components`를 AIC/BIC와 해석 가능성으로 함께 봤는가
- `covariance_type`을 최소 두세 개는 비교했는가
- 결과가 초기값에 민감하지 않은지 `n_init`을 늘려 봤는가
- 경계 샘플 확률이 해석 가능한 수준인지 확인했는가

## 14. 핵심 요약

핵심 정리

- 핵심 원리: 데이터가 여러 Gaussian 분포의 혼합에서 생성되었다고 보고 소속 확률을 추정합니다.
- 주요 파라미터: `n_components`, `covariance_type`, `n_init`
- 적합한 데이터: 타원형, 겹침 가능성, 확률 해석이 필요한 군집 데이터
- 중요한 주의사항: local optimum, 공분산 추정 불안정성, component 수 선택 문제

다음에는 군집화가 아니라 고차원 데이터의 가까운 이웃 관계를 2차원 시각화로 펼치는 [t-SNE: 고차원 데이터의 가까운 이웃을 2차원에 펼치기](11-6-tsne.md)를 학습합니다.
