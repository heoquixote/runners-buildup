## 학습 목표

- `seaborn`과 `plotly`의 역할 차이를 설명할 수 있습니다.
- 통계 비교용 시각화와 인터랙티브 시각화를 각각 언제 쓰는지 판단할 수 있습니다.
- `scatterplot`, `countplot`, `barplot`, `boxplot`, `violinplot`, `heatmap`, `pairplot` 등의 대표 그래프를 사용할 수 있습니다.
- 자동 EDA 도구를 언제 보조적으로 활용하면 좋은지 이해할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `seaborn`: 외부 라이브러리
- `plotly`: 외부 라이브러리
- `ydata-profiling`: 외부 라이브러리
- `sweetviz`: 외부 라이브러리
- `pygwalker`: 외부 라이브러리

## 왜 `seaborn`과 `plotly`를 함께 배울까

`matplotlib`가 시각화의 기초라면, `seaborn`과 `plotly`는 목적이 조금 더 선명한 도구입니다.

- `seaborn`: 통계 비교와 탐색적 데이터 분석에 강함
- `plotly`: 상호작용이 필요한 시각화에 강함

즉, 둘은 경쟁 도구라기보다 질문과 활용 장면이 다른 도구입니다.

## `seaborn`이 강한 이유

`seaborn`은 `matplotlib` 위에서 동작하지만 더 높은 수준의 인터페이스를 제공합니다.

장점:

- `DataFrame`을 바로 넣기 쉬움
- 그룹별 비교가 편함
- 기본 스타일이 깔끔함
- 통계적 시각화에 강함

기본 import는 아래와 같습니다.

```python
import seaborn as sns
import matplotlib.pyplot as plt
```

## 스타일 설정

```python
sns.set_theme(style="whitegrid")
```

시각적으로 정돈된 기본 스타일을 빠르게 적용할 수 있습니다.

## 예제 데이터 불러오기

`seaborn`은 학습용 데이터셋을 쉽게 제공합니다.

```python
tips = sns.load_dataset("tips")
print(tips.head())
```

강의나 실습에서 매우 편리합니다.

## 산점도: `scatterplot`

```python
sns.scatterplot(
    data=tips,
    x="total_bill",
    y="tip",
    hue="smoker",
    style="sex",
    size="size",
)
plt.show()
```

왜 강력한가:

- `hue`: 색상으로 그룹 구분
- `style`: 마커 모양으로 추가 구분
- `size`: 점 크기로 또 다른 변수 표현

즉, 한 그래프 안에서 여러 차원을 함께 볼 수 있습니다.

언제 유용한가:

- 두 수치 변수 관계를 보면서 범주별 차이도 함께 확인하고 싶을 때

## 개수 비교: `countplot`

```python
sns.countplot(data=tips, x="day")
plt.show()
```

이 그래프는 각 범주별 행 개수를 보여 줍니다.

질문:

- 어느 요일 데이터가 가장 많은가
- 클래스 불균형이 있는가

## 평균 비교: `barplot`

```python
sns.barplot(data=tips, x="day", y="total_bill")
plt.show()
```

기본적으로 평균 같은 요약 통계를 보여 주는 경우가 많습니다.  
즉, 단순 개수 비교가 아니라 집계값 비교에 적합합니다.

## 분포 비교: `boxplot`

```python
sns.boxplot(data=tips, x="day", y="total_bill")
plt.show()
```

볼 수 있는 것:

- 중앙값
- 사분위수 범위
- 이상치

그룹 간 분포 비교에 매우 유용합니다.

## 분포 형태까지 더 자세히: `violinplot`

```python
sns.violinplot(data=tips, x="day", y="total_bill")
plt.show()
```

왜 `boxplot`만으로 부족할 수 있나:

- 분포의 모양까지는 잘 안 보임

대안:

- `violinplot`으로 밀도 형태까지 함께 보기

## 상관관계 시각화: `heatmap`

```python
corr = tips.corr(numeric_only=True)
sns.heatmap(corr, annot=True, cmap="Blues")
plt.show()
```

장점:

- 여러 수치 변수 관계를 한 번에 파악 가능

주의:

- 상관관계는 인과관계가 아님
- 색이 진하다고 해서 바로 중요한 변수라고 결론 내리면 안 됨

## 변수 조합을 한 번에 보기: `pairplot`

```python
sns.pairplot(tips, hue="sex")
plt.show()
```

여러 수치 변수 간 관계를 전체적으로 탐색할 때 매우 편리합니다.

언제 좋은가:

- 초반 EDA
- 변수 관계를 빠르게 스캔하고 싶을 때

언제 부담되나:

- 컬럼 수가 많으면 너무 무겁고 복잡해질 수 있음

## 회귀 경향 보기: `lmplot`

```python
sns.lmplot(data=tips, x="total_bill", y="tip", hue="sex")
plt.show()
```

산점도 위에 회귀 경향선을 함께 보여 줍니다.  
탐색 단계에서 관계의 방향성을 보는 데 유용합니다.

## 두 변수 관계를 더 깊게: `jointplot`

```python
sns.jointplot(data=tips, x="total_bill", y="tip", kind="scatter")
plt.show()
```

중앙에는 관계 그래프, 주변에는 각 변수의 분포가 함께 표시됩니다.

## 겹침이 많은 범주형 데이터: `swarmplot`

```python
sns.swarmplot(data=tips, x="day", y="total_bill")
plt.show()
```

각 관측치를 가능한 겹치지 않게 배치해 실제 데이터 포인트를 보여 줍니다.

## 여러 패널로 비교: `relplot`

```python
sns.relplot(
    data=tips,
    x="total_bill",
    y="tip",
    hue="smoker",
    col="time",
)
plt.show()
```

이 방식은 "조건별로 나누어 같은 관계를 비교"할 때 좋습니다.

예를 들어:

- 점심과 저녁을 나눠서 보기
- 남녀를 나눠서 보기
- 지역별로 패널 분할하기

## `plotly`가 강한 이유

`plotly`는 상호작용이 필요한 시각화에 매우 강합니다.

장점:

- 마우스 오버 툴팁
- 확대/축소
- 범례 on/off
- 웹 공유와 대시보드 확장성

즉, 정적 보고서보다 탐색형 결과 공유에 더 잘 맞습니다.

기본적으로 많이 쓰는 모듈은 `plotly.express`입니다.

```python
import plotly.express as px
```

## 인터랙티브 산점도

```python
fig = px.scatter(
    tips,
    x="total_bill",
    y="tip",
    color="day",
    symbol="sex",
    size="size",
    hover_data=["smoker"],
)
fig.show()
```

왜 좋은가:

- 데이터 포인트를 직접 탐색할 수 있음
- 발표 중에도 설명이 쉬움
- 필터링과 강조가 직관적임

## 계층 구조 시각화: `treemap`

```python
fig = px.treemap(
    tips,
    path=["day", "time"],
    values="total_bill",
)
fig.show()
```

언제 적합한가:

- 계층 구조별 비중 비교
- 대분류/중분류 구성 파악

## 계층형 원형 구조: `sunburst`

```python
fig = px.sunburst(
    tips,
    path=["day", "time", "sex"],
    values="total_bill",
)
fig.show()
```

트리맵과 비슷하지만 원형 계층 구조로 표현합니다.

## 시간 변화 애니메이션

`plotly`는 애니메이션 기반 탐색도 지원합니다.

```python
fig = px.scatter(
    df,
    x="x",
    y="y",
    animation_frame="year",
    size="sales",
    color="region",
)
fig.show()
```

이런 기능은 발표용, 탐색용 데모에서 특히 인상적입니다.

## `seaborn`과 `plotly`는 언제 무엇을 쓸까

### `seaborn`이 잘 맞는 경우

- 빠른 EDA
- 통계 비교
- 분포 해석
- 노트북 환경에서 분석

### `plotly`가 잘 맞는 경우

- 인터랙티브 탐색
- 발표 자료
- 웹 공유
- 대시보드 확장

즉, 해석 중심 탐색에는 `seaborn`, 상호작용 중심 전달에는 `plotly`가 자주 더 잘 맞습니다.

## 자동 EDA 도구

노션 수업 내용처럼 자동 탐색 도구도 함께 알아두면 좋습니다.

### `ydata-profiling`

데이터셋 전체 요약 리포트를 빠르게 생성합니다.

### `sweetviz`

비교와 시각 요약에 강점이 있습니다.

### `pygwalker`

드래그 앤 드롭 방식 탐색 감각을 Python 환경에서 가져올 수 있습니다.

이 도구들이 유용한 이유:

- 초반 데이터 진단 속도를 높여 줌
- 놓친 컬럼 이슈를 빠르게 찾을 수 있음
- 요약 리포트 초안을 만드는 데 좋음

하지만 매우 중요한 주의점이 있습니다.

- 자동 리포트는 출발점이지 결론이 아님
- 수치와 차트가 왜 그렇게 나왔는지 직접 검증해야 함
- 이상치, 결측치, 편향을 비즈니스 맥락 없이 해석하면 오판할 수 있음

## 실무에서 자주 하는 실수

### 1. 시각화 도구를 목적보다 먼저 고른다

좋은 흐름은 "질문 -> 차트 -> 도구"입니다.

### 2. 상관계수와 히트맵을 곧바로 결론으로 받아들인다

탐색 결과와 인과 해석은 다릅니다.

### 3. 인터랙티브 차트를 너무 많이 써서 메시지가 흐려진다

상호작용은 장점이지만, 전달 메시지가 분명해야 합니다.

### 4. 자동 EDA를 믿고 직접 검증하지 않는다

자동 도구는 빠르지만, 판단 책임까지 대신해 주지는 않습니다.

## 정리

- `seaborn`은 통계 시각화와 빠른 비교에 강합니다.
- `plotly`는 상호작용과 공유에 강합니다.
- 같은 데이터라도 질문이 다르면 차트와 도구 선택이 달라집니다.
- 자동 EDA 도구는 초기 탐색 가속기로는 훌륭하지만 최종 해석 도구는 아닙니다.
- 좋은 시각화는 코드보다 질문 설계, 차트 선택, 해석력에서 완성됩니다.
