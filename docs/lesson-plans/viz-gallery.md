# 시각화 트랙: 차트 갤러리 · EDA 자동화 레슨 기획안 (2026-11-10)

작성 기준은 [README.md](README.md). 진성 님 요청: 데이터 시각화 도입부를 **① matplotlib 설명 → ② matplotlib 차트 → ③ seaborn 설명 → ④ seaborn 차트** 순서로, matplotlib 공식 Plot types 갤러리처럼 자주 쓰는 차트를 카드로 모아 설명. 추가 요청: **⑤ EDA 자동화 라이브러리 추천**(fasteda · YData Profiling · Sweetviz · PyGWalker).

## 배치

기존 PART를 그대로 쓰고, 소개(-0) 레슨 바로 뒤에 페이지를 끼운다. DAY 번호 · 다른 레슨 id는 바뀌지 않는다.

| PART | 순서 | 레슨 |
| --- | --- | --- |
| matplotlib | ① | da-09-0 matplotlib 소개 (기존) |
| | ② | **da-09-5 matplotlib 차트 갤러리** (새) |
| | | da-09-1 그래프의 뼈대, da-09-4 배치와 다듬기 (기존) |
| seaborn | ③ | da-10-0 seaborn 소개 (기존) |
| | ④ | **da-10-5 seaborn 차트 갤러리** (새) |
| | ⑤ | **da-10-6 EDA 자동화 라이브러리** (새) |
| | | da-10-1 seaborn의 기본 구조 (기존) |

id 끝 번호 5 · 6은 예전에 지운 da-09-2 · 3, da-10-2 · 3 · 4와 겹치지 않게 고른 것(옛 진도 기록과 섞이지 않게).

## 갤러리 카드 형식

`::chart{src name sig desc more}` 지시어. 이어진 카드는 한 격자로 묶인다(md.js, styles.css `.chart-gallery`).

| 칸 | 내용 |
| --- | --- |
| 그림 | `scripts/figures_gallery.py`가 matplotlib 3.8.4 · seaborn 0.13.2로 **실제 그 함수를 불러** 그린 PNG(사이트 다크 색). 공식 이미지는 쓰지 않음. matplotlib은 고정 시드 연습 숫자, seaborn은 사이트 데이터(tips · penguins · flights) |
| 이름 | 우리말 차트 이름. seaborn 그림 단위 함수는 "· 그림 단위" 표시 |
| 명령 | matplotlib은 공식 문서의 재료 이름(`ax.bar(x, height)`), seaborn은 배정 역할(`sns.boxplot(data, x, y, hue)`) |
| 언제 쓰나 | 답하는 질문 + 주의점 한 줄 |
| 자세히 | 질문별 차트 PART의 해당 레슨 제목 링크(있을 때만) |

## ② da-09-5 matplotlib 차트 갤러리 (16개)

1. 알아야 할 개념: 그래프 칸 `ax`, 명령과 재료(괄호 안), "질문 → 차트". 모두 소개 레슨에서 본 수준.
2. 배치: 시작하기 전에(메뉴판 비유) → 카드 읽는 법(표) → 공통 3단계 셀 → 질문별 5묶음(카드 격자 → 실행 셀 1개 → 해석) → 더 많은 차트(공식 Plot types · 갤러리 링크) → 정리 표.
   - 비교: bar · barh · errorbar / 셀: 요일별 계산서 수 세로 · 가로 막대
   - 추이: plot · step · fill_between / 셀: 연도별 승객 선 vs 계단
   - 분포: hist · boxplot · violinplot · ecdf / 셀: 계산 금액 히스토그램 + 상자그림
   - 관계: scatter · hexbin · imshow / 셀: 계산 금액 vs 팁 산점도, 상관계수
   - 구성: pie · 누적 막대(bottom) · stackplot / 셀: 점심 · 저녁 파이 + 요일별 누적 막대
3. 퀴즈 없음: 도감 성격이고 해석 퀴즈는 질문별 PART에 이미 있다. 셀마다 숫자 하나를 출력해 본문이 짚는다.
4. 그림: 카드 썸네일 16장.

## ④ da-10-5 seaborn 차트 갤러리 (19개)

1. 개념: 함수 가족(관계 · 분포 · 범주 · 회귀 · 행렬 + 여러 변수), 칸 단위 vs 그림 단위(`ax=` vs 새 도화지 · `col=`).
2. 배치: 시작하기 전에 → 카드 읽는 법 → 한 줄 histplot 셀 → 가족별 묶음(카드 → 셀 → 해석) → 더 많은 차트(공식 Example gallery · API) → 정리 표.
   - 관계: scatterplot · lineplot · relplot / 셀: 연도별 평균 승객 lineplot(띠 = 신뢰구간)
   - 분포: histplot · kdeplot · ecdfplot / 셀: 펭귄 종별 날개 길이 KDE
   - 범주(3무리): countplot · barplot · pointplot / boxplot · violinplot · boxenplot / stripplot · swarmplot / 셀: 같은 데이터 barplot vs boxplot(평균이 숨기는 튀는 값)
   - 회귀: regplot · lmplot / 셀: 펭귄 부리 길이 · 깊이(전체 -0.23 vs 종별 +0.39 ~ 0.65, 그룹을 섞으면 뒤집힘)
   - 행렬: heatmap / 셀: 월 × 연도 승객 표
   - 여러 변수: pairplot · jointplot / 셀: 펭귄 3열 pairplot
3. 퀴즈 없음(②와 같은 이유).

## ⑤ da-10-6 EDA 자동화 라이브러리

1. 개념: EDA(탐색적 데이터 분석)의 뜻, 자동화 보고서가 대신하는 일(shape · isna · describe · corr · 열별 그래프). 건강검진 결과지 비유.
2. 배치: 시작하기 전에 → 팁(브라우저에서는 설치 불가, Colab `!pip`) → 손으로 하는 기본 EDA 실행 셀 2개(penguins) → 라이브러리 4개(링크 · 설치 · 사용법 · 보여 주는 것 · 장점 · 추천 대상, 코드는 읽기 전용 ```python) → 비교 표 → 쓸 때 기억할 것 → 정리.
3. 확인한 사실(2026-11-10, 실제 설치 · 실행):
   - fasteda 1.0.1: IPython `display` 사용(노트북 전용), 불러올 때 `plt.style.use("fivethirtyeight")`, `applymap` 사용(최신 pandas 경고). `fast_eda(df, target=...)`.
   - ydata-profiling 4.18: 2026-04 `fg-data-profiling`(import `data_profiling`)으로 이름 변경, 옛 패키지는 업데이트 중단. 새 setuptools(81+)에서는 `pkg_resources` 오류 → `setuptools<81`. tips로 `to_file` 확인.
   - sweetviz 2.3.3: `analyze(target_feat=)`, `compare([df, 이름], [df, 이름])`, `show_html` · `show_notebook` 확인.
   - PyGWalker 0.5: `pyg.walk(df)` 노트북 위젯(설치 · 실행은 노트북 환경에서).
4. 퀴즈 없음.
