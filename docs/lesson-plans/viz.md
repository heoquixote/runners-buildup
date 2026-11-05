# 데이터 시각화 트랙 레슨 기획안

작성 기준은 [README.md](README.md). 기호: `S` 설명, `F` 그림, `C` 실행 셀, `T` 직접 해보기, `R` 결과 해석.

원본은 진성 님의 Python 기초 원고 7장(`docs/sources/python/07-4-visualization-libraries`, `07-6-matplotlib-basics`, `07-7-seaborn-plotly`)입니다. 원고는 차트별 "언제 적합한가 / 질문 / 자주 하는 실수"가 잘 정리돼 있어 그 틀을 그대로 가져오고, 고등학생~대학 초년생 눈높이로 **그래프의 구조(뼈대)부터** 다시 풀어 씁니다. plotly·자동 EDA 도구는 브라우저 파이썬에서 돌리기 어렵고 이 트랙 목표(정적 차트를 읽고 그리기)와 거리가 있어 da-11에서 "다음에 배울 것"으로 한 줄만 소개합니다.

## 왜 개편하나

기존 트랙은 코스 2개 × 레슨 1개(긴 실행 셀 2개씩)라서 ① 그래프 코드의 기본 뼈대가 무엇인지, ② matplotlib · seaborn으로 **어떤 차트를 그릴 수 있는지**가 한눈에 정리되지 않았습니다. 개편 후에는 다음을 목표로 합니다.

1. 어떤 차트든 같은 **4단계 뼈대**(데이터 → 판 만들기 → 그리기 → 다듬기)로 그린다는 감각
2. 라이브러리별 **차트 카탈로그**: 차트마다 "무슨 질문에 답하나 → 코드 한 줄 → 읽는 법 → 흔한 실수"
3. 마지막에 질문 → 차트 → 함수로 이어지는 **차트 지도**로 정리

## 트랙 구성

| DAY | 코스 (id 유지) | 레슨 | 한 문장 목표 | 데이터 | 마무리 |
| --- | --- | --- | --- | --- | --- |
| 01 | matplotlib 기본 (da-09, 유닛 30) | da-09-1 그래프의 뼈대: fig와 ax | 4단계 뼈대로 그래프를 그리고 제목·축·범례를 달 수 있다 | 직접 만든 작은 리스트, flights | 퀴즈 2 |
| | | da-09-2 추이와 비교: 선 · 막대 · 영역 | 시간 변화는 선, 크기 비교는 막대(가로·묶음·누적)로 그릴 수 있다 | flights, titanic | 레슨 완료 (T 셀) |
| | | da-09-3 분포와 관계: 히스토그램 · 상자 · 산점도 · 파이 | 값이 퍼진 모양과 두 값의 관계를 그리고 읽을 수 있다 | titanic, penguins | 퀴즈 2 |
| | | da-09-4 여러 그래프 배치와 다듬기 | 한 그림에 여러 칸을 배치하고 주석·스타일·저장까지 할 수 있다 | flights, tips, penguins | 레슨 완료 → 유닛 30 실습 |
| 02 | seaborn 통계 시각화 (da-10, 유닛 31) | da-10-1 seaborn의 기본 구조: data · x · y · hue | 열 이름만 넘겨 그리고, matplotlib으로 다듬을 수 있다 | tips | 퀴즈 2 |
| | | da-10-2 분포 그래프: hist · kde · ecdf · displot | 그룹별 분포를 겹치지 않게 비교할 수 있다 | penguins, titanic | 레슨 완료 (T 셀) |
| | | da-10-3 범주 비교: count · bar · box · violin · strip · point | 범주별로 개수·평균·분포를 알맞은 그래프로 비교할 수 있다 | tips, titanic | 퀴즈 2 |
| | | da-10-4 관계와 상관: scatter · line · reg · heatmap · pairplot | 두 변수, 여러 변수의 관계를 그리고 상관을 바르게 해석할 수 있다 | tips, flights, penguins | 레슨 완료 → 유닛 31 실습 |
| 03 | 차트 고르기 (da-11, 새 코스, 유닛 없음) | da-11-1 질문에 맞는 차트 고르기 | 질문을 보고 차트와 함수를 고르고, 흔한 왜곡을 피할 수 있다 | tips, titanic | 퀴즈 3 |

- 코스·레슨 id는 그대로 두고(da-09, da-10, da-09-1, da-10-1), 레슨만 늘립니다. 기존 연습문제(유닛 30·31)는 각 코스 마지막 레슨 아래에 그대로 붙습니다.
- 새 데이터셋 3개를 `datasets/`에 추가합니다(모두 seaborn 예제 데이터 원본 CSV, `pd.read_csv('이름.csv')`로 바로 읽힘). `sns.load_dataset()`은 인터넷에서 받아 오므로 브라우저 실습에서는 쓰지 않고, 로컬에서는 쓸 수 있다고 한 줄 안내합니다.
  - `tips.csv` 식당 계산서 244건(금액·팁·요일·시간·인원) — 범주 비교, 관계
  - `flights.csv` 1949~1960 월별 항공 승객 수 144행 — 추이(선), 히트맵
  - `penguins.csv` 펭귄 3종 344마리 신체 치수 — 분포, 산점도, pairplot
- **중복 정리**: 상자그림 읽는 법(중앙값·사분위·수염·이상치)은 da-09-3에서 그림으로 정식으로 배우고, da-10-3에서는 "da-09-3에서 본 상자"로 연결만 합니다. 상관계수의 의미는 통계 트랙(st-01) 몫이므로 da-10-4에서는 "1에 가까우면 같이 오르고, −1이면 반대"까지만, 대신 "상관 ≠ 인과" 판단을 퀴즈로 확인합니다. 차트 고르기 표는 da-09-1에 짧은 버전, da-11-1에 완전한 버전을 둡니다.

## 공통 규칙

- 셀 하나 = 개념 하나, 1~4줄(데이터 읽기와 import 제외). 셀 바로 앞에 무엇을 보는 셀인지 한두 문장.
- 셀은 각자 독립 실행되므로 import·데이터 읽기를 셀마다 반복합니다(맨 위).
- 모든 셀은 그림과 함께 짧은 숫자를 `print`합니다(막대 개수, 평균 등). 본문은 그 숫자를 짚습니다.
- 그래프 글자는 영어(브라우저에 한글 글꼴 없음). 한글 글꼴 설정은 da-09-1에 '내 컴퓨터에서' 팁으로.
- 차트마다 같은 틀로 설명합니다: **무슨 질문에 답하나 → 코드 → 읽는 법 → 흔한 실수**.

---

## da-09-1 그래프의 뼈대: fig와 ax

- **목표**: `fig, ax = plt.subplots()` → `ax.그리기()` → `ax.set_...()` 순서로 어떤 그래프든 그릴 수 있다.
- **전제 개념**: 리스트, pandas로 CSV 읽기(데이터 분석 트랙). 그래프는 처음.
- **알아야 할 개념**
  1. 시각화가 왜 필요한가: 숫자 표 12줄 vs 선 하나 (같은 데이터를 print와 그림으로 비교)
  2. Figure(도화지)와 Axes(그 위의 그래프 한 칸) — 액자와 그림 비유
  3. 그래프의 부품: 제목, x축·y축 이름, 눈금, 범례, 격자
  4. 4단계 뼈대: 데이터 → 판 만들기 → 그리기 → 다듬기
  5. `plt.plot` 짧은 방식 vs `ax.plot` 방식 — 이 트랙은 ax 방식을 기본으로 쓰는 이유
  6. 색·선 모양·마커 (color, linestyle, marker)
  7. 범례(label + legend), 축 범위(set_ylim), 격자(grid), 기준선(axhline)
  8. 크기(figsize)와 저장(savefig), 한글 글꼴(내 컴퓨터)
- **배치**: S(왜 그림) → C(print로 본 승객 수) → C(같은 값 선 하나) → R → S(Figure·Axes) → **F1** → C(빈 판) → R → S(4단계 뼈대 표) → C(뼈대 4줄) → S(plt vs ax) → C(plt 방식) → S(색·선·마커) → C → **T**(marker·linestyle 바꾸기) → S(범례) → C(선 두 개 + legend) → S(축 범위·격자·기준선) → C → S(크기·저장) → C(figsize) → S(한글 글꼴 팁) → S(차트 미리 보기 표: 이 트랙에서 배울 차트)
- **퀴즈 vs 코드**: **퀴즈 2문항**. 기존 write 문항(ax.plot 후 선 개수) 유지 + choice "Axes란?"(도화지 vs 그래프 한 칸 오개념 확인). 뼈대 순서는 실습 문제 유닛 30이 맡는다.
- **그림**: F1 그래프 해부도(Figure 안의 Axes, 제목·축 이름·눈금·범례·격자·선에 이름표와 해당 코드)
- **데이터**: 직접 만든 리스트(5개 값), flights.csv(1949년 월별 승객)
- **영상**: 없음
- **원본 원고**: 07-6 "왜 matplotlib", "pyplot 방식과 객체 지향 방식", "포맷 문자열", "기본 커스터마이징", "한글 폰트 문제"를 가져옴. 포맷 문자열(`'ro-'`)은 "알아만 두기"로 한 줄, 실무에서는 인자를 명시하라는 원고 문장 반영.

## da-09-2 추이와 비교: 선 · 막대 · 영역

- **목표**: 시간 변화는 선 그래프, 크기 비교는 막대 그래프(세로·가로·묶음·누적)로 그리고 읽을 수 있다.
- **전제 개념**: da-09-1 뼈대, pandas groupby (da-06) 한 줄로 다시 짚기
- **알아야 할 개념**
  1. 선 그래프 = 순서가 있는 x(시간)에서 값의 변화. 점을 잇는 이유
  2. 여러 선 비교(연도별), 선이 너무 많으면 읽기 어렵다
  3. 영역 그래프(fill_between): 선 아래를 칠해 양을 강조
  4. 막대 그래프 = 범주별 크기 비교. 막대는 0에서 시작해야 하는 이유
  5. 가로 막대(barh): 범주 이름이 길거나 많을 때, 정렬해서 그리기
  6. 막대 위에 값 쓰기(bar_label)
  7. 묶음 막대(나란히)와 누적 막대(bottom=) — 구성 비교
  8. pandas `.plot()`으로 빠르게 그리기(ax= 넘기기)
- **배치**: S(선 = 시간) → C(flights 연도별 합계 선) → R(1949 1,520 → 1960 5,714) → S(월별, 여러 선) → C(3개 연도 비교) → **T**(연도 바꾸기) → S(영역) → C(fill_between) → S(막대) → **F1** → C(객실 등급별 승객 수 bar) → R → S(가로·정렬) → C(barh + sort) → S(값 쓰기) → C(bar_label) → S(묶음 막대) → C(등급×성별 생존율) → R → S(누적 막대) → C(bottom=) → S(pandas plot) → C → S(정리 표)
- **퀴즈 vs 코드**: **레슨 완료 (T 셀)**. 이 레슨의 핵심은 "그려 보기"라 퀴즈보다 값을 바꿔 보는 T 셀이 효과적. 선/막대 선택 판단은 da-11에서 퀴즈로 모아서 확인한다.
- **그림**: F1 막대 축을 0에서 자르지 않은 경우 vs 자른 경우(같은 데이터가 2배 차이처럼 보이는 함정)
- **데이터**: flights.csv, titanic.csv
- **원본 원고**: 07-6 "선 그래프(언제 적합/부적합)", "막대 그래프(질문)", "pandas와 함께 그리기". 묶음·누적 막대, bar_label, fill_between은 새로 보탬.

## da-09-3 분포와 관계: 히스토그램 · 상자 · 산점도 · 파이

- **목표**: 값이 퍼진 모양(히스토그램·상자)과 두 값의 관계(산점도), 전체 중 비율(파이)을 그리고 읽을 수 있다.
- **전제 개념**: 평균·중앙값(통계 st-01, 몰라도 이 레슨에서 한 줄 설명)
- **알아야 할 개념**
  1. 분포 = 값들이 어디에 몰려 있고 얼마나 퍼졌나
  2. 히스토그램: 구간(bin)마다 개수. bins를 바꾸면 모양이 달라 보인다
  3. 긴 꼬리(fare)와 평균·중앙값 차이
  4. 상자그림: 중앙값, Q1·Q3(가운데 50%), 수염, 이상치 점
  5. 여러 그룹 상자 나란히
  6. 산점도: 점 하나 = 행 하나, 방향(양·음), 덩어리, 튀는 점
  7. 점 색(c)·크기(s)로 세 번째 정보 더하기, 겹침은 alpha
  8. 파이(원) 그래프: 전체 중 비율, 조각은 5개 이하, 비교에는 막대가 낫다
- **배치**: S(분포란) → C(titanic age hist) → R → **T**(bins 5 / 30) → S(꼬리) → C(fare hist + 평균·중앙값 선) → R(평균 32.2 vs 중앙값 14.5) → S(상자그림) → **F1** → C(fare boxplot) → R → C(등급별 상자) → R → S(산점도) → C(penguins flipper vs mass) → R → S(색으로 종 구분) → C(종마다 scatter + legend) → S(alpha) → C → S(파이) → C(승선 항구 비율 pie) → S(파이의 함정) → S(정리 표)
- **퀴즈 vs 코드**: **퀴즈 2문항**. 상자그림은 "읽는 법"이 핵심이라 그림 읽기 판단 퀴즈가 효과적.
  - choice: 상자 안의 가운데 선이 뜻하는 것(중앙값) / choice: 항목이 12개인 비율 비교에 알맞은 차트(정렬된 막대)
- **그림**: F1 상자그림 해부도(최솟값 쪽 수염, Q1, 중앙값, Q3, 수염, 이상치 점 + 히스토그램과 위아래로 맞대어 같은 데이터임을 보여 줌)
- **데이터**: titanic.csv(age, fare, pclass, embark_town), penguins.csv
- **원본 원고**: 07-6 "산점도(볼 수 있는 것)", "히스토그램(질문)", "박스플롯(언제 유용)". 파이 그래프는 새로 보탬.

## da-09-4 여러 그래프 배치와 다듬기

- **목표**: subplots로 여러 칸을 배치하고, 주석·두 번째 y축·스타일을 적용해 저장할 수 있다.
- **전제 개념**: da-09-1~3의 차트들
- **알아야 할 개념**
  1. `plt.subplots(행, 열)` → axes 배열, `axes[0, 1]`로 칸 고르기
  2. 반복문으로 칸 채우기(`axes.flat`)
  3. 축 공유(sharey)로 공정하게 비교
  4. 겹침 정리: `fig.tight_layout()`, 전체 제목 `fig.suptitle`
  5. 주석(annotate): 화살표로 "여기 보세요"
  6. 두 번째 y축(twinx): 단위가 다른 두 값, 오해 위험
  7. 스타일(plt.style.use)과 색 지도(cmap)
  8. 저장(savefig dpi, bbox_inches)
- **배치**: S(왜 여러 칸) → **F1** → C(2×2 빈 판 + 칸 이름) → C(2×2 채우기) → S(반복문) → C(penguins 종별 히스토그램 3칸) → S(sharey) → C(sharey 비교) → **T**(sharey 끄기) → S(suptitle·tight_layout) → C → S(annotate) → C(flights 최고점 화살표) → S(twinx) → C(tips 인원별 평균 금액·건수) → S(주의) → S(스타일) → C(style.context) → S(저장) → C(savefig) → S(정리: 보고서 체크리스트)
- **퀴즈 vs 코드**: **레슨 완료**. 배치·주석은 API 사용법이라 바로 이어지는 유닛 30 실습 문제(선·막대·산점도·서브플롯)가 맡는다.
- **그림**: F1 `plt.subplots(2, 2)`의 칸 번호 지도(axes[0, 0] … axes[1, 1])
- **데이터**: flights.csv, tips.csv, penguins.csv
- **연결 실습**: 유닛 30 (30-1~30-4 + 개념 퀴즈)
- **원본 원고**: 07-6 "여러 그래프 배치: subplots", "자주 하는 실수(한 그림에 너무 많이)". annotate·twinx·style은 새로 보탬.

## da-10-1 seaborn의 기본 구조: data · x · y · hue

- **목표**: `sns.함수(data=df, x='열', y='열', hue='열', ax=ax)` 한 줄로 그리고, matplotlib의 ax로 다듬을 수 있다.
- **전제 개념**: da-09의 fig·ax, DataFrame 열 이름
- **알아야 할 개념**
  1. seaborn = matplotlib 위에 지은 집. 표(DataFrame)를 통째로 넣고 열 이름만 고르면 집계·색·범례를 알아서
  2. 같은 그래프를 matplotlib vs seaborn으로 비교(코드 길이)
  3. data · x · y · hue 네 칸 = 그래프의 "역할 배정"
  4. 긴 표(long, tidy) — 한 행에 관측 하나여야 hue가 동작한다
  5. seaborn 함수는 ax를 돌려준다 → set_title 등 da-09 문법 그대로
  6. ax= 로 원하는 칸에 그리기(서브플롯과 섞기)
  7. 테마(set_theme, style), 팔레트(palette)
  8. 축 단위(axes-level) vs 그림 단위(figure-level: displot·catplot·relplot) 함수
- **배치**: S(seaborn이란) → C(matplotlib으로 요일별 평균 — groupby 필요) → C(seaborn 한 줄) → R(같은 결과, 오차 막대까지) → S(네 칸 역할) → **F1** → C(hue) → S(긴 표) → **F2** → C(넓은 표 → melt) → S(ax 돌려받기) → C(set_title) → S(ax=) → C(1×2) → S(테마·팔레트) → C → **T**(palette 바꾸기) → S(두 종류 함수) → **F3** → C(catplot col=) → R → S(카탈로그 미리 보기 표) → S(load_dataset 안내)
- **퀴즈 vs 코드**: **퀴즈 2문항**. 기존 write(countplot 막대 개수) 유지 + choice "그림 단위 함수는?"(displot) — 왜 ax=를 못 받는지 오개념 확인.
- **그림**: F1 data/x/y/hue 역할 배정(표의 열 → 그래프 위치·색 화살표), F2 넓은 표 vs 긴 표, F3 axes-level(한 칸에 그림) vs figure-level(그림 전체를 새로, col=로 칸 나누기)
- **데이터**: tips.csv
- **원본 원고**: 07-7 "seaborn이 강한 이유", "스타일 설정", "예제 데이터 불러오기". load_dataset은 브라우저에서 인터넷 접근이 안 되므로 CSV로 대체하고 로컬 사용법만 안내.

## da-10-2 분포 그래프: hist · kde · ecdf · displot

- **목표**: 한 변수의 분포를 그리고, 그룹별 분포를 겹치지 않게(나란히·쌓기·칸 나누기) 비교할 수 있다.
- **전제 개념**: da-09-3 히스토그램
- **알아야 할 개념**
  1. histplot: bins, binwidth
  2. hue로 그룹 겹치기, multiple='layer'/'stack'/'dodge'
  3. stat='density'와 common_norm=False: 그룹 크기가 다를 때 공정한 비교
  4. kde(부드러운 곡선): 히스토그램을 매끈하게, bw_adjust
  5. ecdf: "이 값 이하가 몇 %"
  6. rugplot(바닥 눈금), 
  7. displot(col=)로 칸 나누기 (figure-level)
- **배치**: S → C(histplot) → **T**(binwidth) → S(hue) → C → S(multiple) → C(stack) → **T**(dodge·fill) → S(그룹 크기 차이) → C(density + common_norm=False) → R → S(kde) → C → **T**(bw_adjust) → S(ecdf) → C → R(중앙값 읽기) → S(rug) → C(kde+rug) → S(displot) → C(col=) → S(정리 표: 분포 함수 고르기)
- **퀴즈 vs 코드**: **레슨 완료 (T 셀)**. 분포 그래프는 설정값(bins·bw·multiple)의 효과를 눈으로 보는 게 핵심이라 T 셀이 가장 효과적.
- **그림**: 없음(실행 결과 그래프가 곧 그림). 대신 정리 표.
- **데이터**: penguins.csv(flipper_length_mm, body_mass_g, species), titanic.csv(age, sex)
- **원본 원고**: 07-7에는 분포 함수가 없어 새로 씀. stats/02-3-shape-and-outlier의 "꼬리·봉우리" 표현을 빌림.

## da-10-3 범주 비교: count · bar · box · violin · strip · point

- **목표**: 범주별로 "몇 개(count)", "평균(bar·point)", "분포(box·violin·strip)" 중 질문에 맞는 그래프를 고를 수 있다.
- **전제 개념**: da-09-3 상자그림 읽기(연결만)
- **알아야 할 개념**
  1. 범주형 그래프 3가족: 개수 / 요약값 / 분포
  2. countplot: 행 개수, order=
  3. barplot: 막대 높이 = **평균**, 검은 선 = 오차 막대(평균이 이 정도 흔들릴 수 있음). estimator='sum'
  4. pointplot: 점 + 선으로 평균 변화, hue와 함께 비교
  5. boxplot: 중앙값·사분위·이상치
  6. violinplot: 상자 + 분포 모양(봉우리)
  7. stripplot / swarmplot: 점 하나하나 다 보기, 상자와 겹쳐 그리기
  8. catplot(kind=, col=)으로 칸 나누기
- **배치**: S(3가족) → **F1** → C(countplot) → R → S(barplot=평균) → C → R(토 20.44, 일 21.41) → S(오차 막대) → C(errorbar=None vs 기본) → S(합계로) → C(estimator='sum') → S(pointplot) → C(hue=sex) → S(boxplot) → C → S(violin) → C → **T**(inner·split) → S(strip·swarm) → C(swarm) → S(겹쳐 그리기) → C(box + strip) → S(catplot) → C(titanic 생존율 kind='bar' col) → R → S(정리 표)
- **퀴즈 vs 코드**: **퀴즈 2문항**. "막대 높이는 평균"과 "이상치를 보려면 상자"는 자주 틀리는 판단이라 퀴즈로 확인.
  - ox: barplot 막대 높이는 기본으로 합계다(X) / choice: 요일별 계산 금액에 이상치가 있는지 보려면(boxplot)
- **그림**: F1 범주형 그래프 3가족 지도(개수: countplot / 요약: barplot·pointplot / 분포: boxplot·violinplot·stripplot·swarmplot)
- **데이터**: tips.csv, titanic.csv
- **원본 원고**: 07-7 "countplot", "barplot", "boxplot", "violinplot(왜 boxplot만으로 부족)", "swarmplot". pointplot·catplot·estimator·errorbar는 새로 보탬.

## da-10-4 관계와 상관: scatter · line · reg · heatmap · pairplot

- **목표**: 두 변수의 관계(산점도·추세선), 시간에 따른 변화(lineplot), 여러 변수의 상관(heatmap·pairplot)을 그리고 바르게 해석할 수 있다.
- **전제 개념**: da-09-3 산점도, da-10-1 hue
- **알아야 할 개념**
  1. scatterplot: hue · size · style 로 정보 더하기 (너무 많이 넣지 않기)
  2. regplot / lmplot: 추세선과 신뢰 구간 띠
  3. lineplot: 같은 x에 값이 여러 개면 평균 + 띠를 자동으로
  4. relplot(col=): 조건별로 칸 나누기
  5. heatmap ① 상관 행렬 — 1, 0, −1 읽기, annot, vmin/vmax, center
  6. heatmap ② 피벗 표(연도×월 승객 수) — 상관이 아니어도 표를 색으로
  7. pairplot: 모든 쌍을 한 번에(열이 많으면 무겁다)
  8. jointplot: 산점도 + 양옆 분포
  9. 상관 ≠ 인과
- **배치**: S → C(scatterplot) → R → C(hue+size) → S(추세선) → C(regplot) → R → S(lmplot hue) → C → S(lineplot) → C(flights 월별 평균 + 띠) → R → S(relplot) → C(col=time) → S(상관 히트맵) → **F1** → C(penguins corr heatmap) → R(지느러미-몸무게 0.87) → **T**(cmap·center) → S(피벗 히트맵) → C(flights pivot) → R(여름 피크, 해마다 증가) → S(pairplot) → C → S(jointplot) → C → S(상관 ≠ 인과: 아이스크림·익사 비유) → S(정리 표)
- **퀴즈 vs 코드**: **레슨 완료**. 바로 이어지는 유닛 31 실습(상자그림·히트맵·barplot·산점도)과 개념 퀴즈가 확인을 맡는다. 상관≠인과 판단은 da-11 퀴즈에서 다룬다.
- **그림**: F1 상관계수 눈금(−1 반대로 / 0 관계 없음 / +1 함께) 위에 작은 점 구름 세 개
- **데이터**: tips.csv, flights.csv, penguins.csv
- **연결 실습**: 유닛 31 (31-1~31-4 + 개념 퀴즈)
- **원본 원고**: 07-7 "scatterplot(hue/style/size)", "heatmap(주의: 상관 ≠ 인과)", "pairplot(언제 부담)", "lmplot", "jointplot", "relplot".

## da-11-1 질문에 맞는 차트 고르기

- **목표**: 보여 주고 싶은 질문을 보고 차트 종류와 matplotlib·seaborn 함수를 고르고, 흔한 왜곡을 피할 수 있다.
- **전제 개념**: DAY 01·02 전체 (요약 페이지)
- **알아야 할 개념**
  1. 순서: 질문 → 차트 → 도구 (원고 문장)
  2. 질문 6가지: 비교 · 추이 · 분포 · 관계 · 구성 · 상관
  3. 차트 지도 표: 질문 → 차트 → matplotlib → seaborn → 읽는 법
  4. 흔한 실수 ① 막대 축을 0에서 자르기 ② 조각 많은 파이 ③ 한 그림에 너무 많이 ④ 두 y축 ⑤ 정렬 안 한 막대 ⑥ 의미 없는 무지개 색
  5. 같은 데이터, 나쁜 그림 vs 좋은 그림 비교
  6. 그래프 보고서 체크리스트(제목에 결론, 축 이름·단위, 출처)
  7. 다음 단계: plotly(인터랙티브), 자동 EDA 도구 — 이름만
- **배치**: S(질문 먼저) → **F1** → S(차트 지도 표) → C(같은 tips를 6가지 질문으로 6칸) → R → S(실수 ①) → C(축 자르기 vs 0부터) → S(실수 ②) → C(파이 vs 정렬 막대) → S(③~⑥ 설명) → S(체크리스트) → C(결론을 제목에 쓴 최종 그래프) → S(다음 단계)
- **퀴즈 vs 코드**: **퀴즈 3문항**. 이 페이지의 핵심은 "어떤 상황에 어떤 차트"라는 판단이라 상황형 choice가 가장 효과적.
  - choice: 반별 키 분포를 비교하고 이상치도 보고 싶다(상자그림) / choice: 공부 시간과 점수의 관계(산점도) / ox: 아이스크림 판매량과 익사 사고의 상관이 높으니 아이스크림이 원인이다(X)
- **그림**: F1 차트 지도(질문 6개 → 대표 차트 아이콘 → 함수 이름)
- **데이터**: tips.csv, titanic.csv
- **원본 원고**: 07-6 "어떤 차트를 골라야 할까", "자주 하는 실수", 07-7 "실무에서 자주 하는 실수(도구를 목적보다 먼저 고른다, 상관=결론)", "자동 EDA 도구(출발점이지 결론이 아님)".
