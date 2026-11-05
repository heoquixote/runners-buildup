## 학습 목표

- `matplotlib`가 어떤 역할을 하는 라이브러리인지 설명할 수 있습니다.
- `plt` 방식과 `fig, ax` 방식의 차이를 이해하고 적절히 선택할 수 있습니다.
- 선 그래프, 막대 그래프, 산점도, 히스토그램, 박스플롯 등 기본 차트를 그릴 수 있습니다.
- 제목, 축, 범례, 눈금, 격자, 크기, 폰트 설정 등 시각화 기본 커스터마이징을 적용할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `matplotlib`: 외부 라이브러리
- `pandas.plot()`: 외부 라이브러리 `pandas`의 시각화 래퍼

## 왜 `matplotlib`를 배워야 하나

시각화는 데이터를 예쁘게 꾸미는 작업이 아니라, 데이터를 더 빨리 이해하기 위한 도구입니다.

예를 들어 차트를 통해 아래 질문에 답할 수 있습니다.

- 시간에 따라 값이 어떻게 변하는가
- 그룹 간 차이가 있는가
- 이상치가 존재하는가
- 두 변수 사이에 관계가 있는가

`matplotlib`는 Python 시각화 생태계의 기초입니다.  
`seaborn`도 내부적으로 `matplotlib` 위에서 동작하므로 기본 구조를 이해해 두면 확장이 쉬워집니다.

## 설치와 import

`matplotlib`는 표준 라이브러리가 아니므로 설치가 필요합니다.

```bash
python -m pip install matplotlib
```

기본 import는 아래와 같습니다.

```python
import matplotlib.pyplot as plt
```

## 가장 기본적인 선 그래프

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
plt.show()
```

여기서 중요한 흐름은 매우 단순합니다.

1. 그린다
2. 보여 준다

처음에는 이 단순한 패턴으로 시작해도 충분합니다.

## `pyplot` 방식과 객체 지향 방식

### `pyplot` 방식

```python
plt.plot([1, 2, 3], [2, 4, 8])
plt.title("기본 선 그래프")
plt.show()
```

장점:

- 짧고 빠름
- 입문자가 접근하기 쉬움

한계:

- 그래프가 여러 개가 되면 관리가 복잡해짐

### 객체 지향 방식: `fig, ax`

```python
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot([1, 2, 3], [2, 4, 8], marker="o")
ax.set_title("기본 선 그래프")
ax.set_xlabel("x")
ax.set_ylabel("y")
plt.show()
```

왜 이 방식이 중요한가:

- 여러 그래프를 구성하기 쉬움
- 코드 구조가 명확함
- 실무 리포트, 대시보드, 반복 출력에 더 안정적임

따라서 입문은 `plt`, 실전은 `ax` 방식으로 이어진다고 이해하면 좋습니다.

## 선 그래프

시간의 흐름이나 순서가 있는 데이터를 볼 때 자주 사용합니다.

```python
days = [1, 2, 3, 4, 5]
sales = [100, 120, 90, 140, 160]

plt.plot(days, sales, marker="o")
plt.title("일별 매출")
plt.xlabel("day")
plt.ylabel("sales")
plt.show()
```

언제 적합한가:

- 시계열 데이터
- 순차적 변화 추이

언제 부적합한가:

- 범주 간 단순 비교만 필요할 때

## 막대 그래프

그룹 간 크기 비교에 적합합니다.

```python
categories = ["A", "B", "C"]
values = [30, 45, 20]

plt.bar(categories, values)
plt.title("카테고리별 건수")
plt.show()
```

질문:

- 어떤 그룹이 가장 큰가
- 그룹 간 차이가 얼마나 나는가

## 산점도

두 변수의 관계를 볼 때 가장 자주 사용하는 그래프 중 하나입니다.

```python
x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 6]

plt.scatter(x, y)
plt.title("산점도")
plt.xlabel("x")
plt.ylabel("y")
plt.show()
```

이 그래프를 통해 볼 수 있는 것:

- 양의 관계인지
- 음의 관계인지
- 선형 경향이 있는지
- 이상치가 있는지

## 히스토그램

값의 분포를 볼 때 사용합니다.

```python
scores = [65, 70, 72, 72, 75, 80, 82, 85, 90, 92]

plt.hist(scores, bins=5)
plt.title("점수 분포")
plt.show()
```

질문:

- 값이 어디에 몰려 있는가
- 분포가 대칭적인가
- 긴 꼬리가 있는가

## 박스플롯

이상치와 분포를 요약해서 볼 수 있는 그래프입니다.

```python
scores = [65, 70, 72, 72, 75, 80, 82, 85, 90, 120]

plt.boxplot(scores)
plt.title("점수 박스플롯")
plt.show()
```

언제 특히 유용한가:

- 이상치 점검
- 그룹 간 분포 비교

## 포맷 문자열

아주 간단한 스타일 지정은 포맷 문자열로도 가능합니다.

```python
plt.plot([1, 2, 3], [2, 4, 8], "ro-")
plt.show()
```

예를 들어:

- `r`: red
- `o`: 원형 마커
- `-`: 실선

다만 실무에서는 가독성을 위해 인자를 명시적으로 적는 편이 더 나을 때가 많습니다.

```python
plt.plot([1, 2, 3], [2, 4, 8], color="red", marker="o", linestyle="-")
```

## 기본 커스터마이징

### 크기 조정

```python
plt.figure(figsize=(8, 4))
```

### 제목과 축 라벨

```python
plt.title("월별 매출")
plt.xlabel("month")
plt.ylabel("sales")
```

### 범례

```python
plt.plot([1, 2, 3], [2, 4, 8], label="team A")
plt.legend()
```

### 축 범위

```python
plt.xlim(0, 5)
plt.ylim(0, 10)
```

### 격자

```python
plt.grid(True)
```

이 요소들은 단순 장식이 아니라 읽기 쉬운 차트를 만드는 핵심 요소입니다.

## 한글 폰트 문제

한국어 환경에서는 폰트 깨짐과 마이너스 기호 깨짐이 매우 흔합니다.

```python
import platform
import matplotlib.pyplot as plt

if platform.system() == "Darwin":
    plt.rc("font", family="AppleGothic")
elif platform.system() == "Windows":
    plt.rc("font", family="Malgun Gothic")

plt.rc("axes", unicode_minus=False)
```

왜 이런 설정이 필요한가:

- 기본 폰트가 한글을 지원하지 않을 수 있음
- 음수 기호가 네모 박스로 깨질 수 있음

실무에서 언제 문제되나:

- 보고서용 한글 차트
- 강의 자료
- 고객 공유 이미지

## 여러 그래프 배치: `subplots`

```python
fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].plot([1, 2, 3], [2, 4, 8])
axes[0].set_title("선 그래프")

axes[1].bar(["A", "B", "C"], [3, 5, 2])
axes[1].set_title("막대 그래프")

plt.tight_layout()
plt.show()
```

이 방식이 중요한 이유는 비교가 쉬워지기 때문입니다.

- 전/후 비교
- 그룹별 비교
- 여러 지표 동시 확인

## `pandas`와 함께 그리기

`pandas` DataFrame에서도 간단한 차트를 바로 그릴 수 있습니다.

```python
import pandas as pd

df = pd.DataFrame(
    {
        "month": ["Jan", "Feb", "Mar"],
        "sales": [100, 120, 140],
    }
)

df.plot(x="month", y="sales", kind="line", marker="o")
plt.show()
```

이 방식은 빠른 탐색에 좋습니다.  
다만 세밀한 제어가 필요하면 결국 `matplotlib` 객체 방식으로 돌아오게 됩니다.

## 어떤 차트를 골라야 할까

- 시간 흐름: 선 그래프
- 그룹 비교: 막대 그래프
- 변수 관계: 산점도
- 분포 확인: 히스토그램
- 이상치 및 그룹 분포: 박스플롯

즉, 차트 선택은 "무엇을 보여 주고 싶은가"에 대한 답입니다.

## 자주 하는 실수

### 1. 차트를 그리기 전에 질문이 없다

차트는 목적이 있어야 합니다.  
예쁜 차트보다 "무엇을 검증하려는가"가 먼저입니다.

### 2. 축과 단위를 적지 않는다

축 라벨이 없으면 해석이 모호해집니다.

### 3. 한글 폰트 설정을 미리 점검하지 않는다

수업이나 발표 직전에 깨지면 매우 번거롭습니다.

### 4. 너무 많은 정보를 한 그림에 욱여넣는다

한 차트에는 한 질문이 더 잘 맞습니다.

## 정리

- `matplotlib`는 Python 시각화의 기초입니다.
- 입문 단계에서는 `plt`, 실전 단계에서는 `fig, ax` 방식이 특히 중요합니다.
- 선 그래프, 막대 그래프, 산점도, 히스토그램, 박스플롯은 가장 기본이 되는 차트입니다.
- 폰트, 범례, 축, 제목, 크기 같은 설정은 해석 가능한 차트를 만드는 핵심 요소입니다.
- 좋은 시각화는 코드보다 질문 설계와 해석에서 결정됩니다.
