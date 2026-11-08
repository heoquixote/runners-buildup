# 라이브러리 소개 레슨 기획안 (2026-11-07)

작성 기준은 [README.md](README.md). 기호: `S` 설명, `F` 그림, `C` 실행 셀, `T` 직접 해보기, `R` 결과 해석.

진성 님 요청: "넘파이 / 판다스 / 맷플랏립 / 씨본 / 사이킷런 / 파이토치 등 각 소개 페이지를 각 구분(PART)의 첫 페이지에." 형식 · 톤은 기존 소개 레슨(파이썬 시작하기의 라이브러리 허브 그림과 역사, pandas Series · DataFrame 레슨의 pandas 도입부)을 따른다.

## 배치

| 트랙 · PART | 새 레슨 (id) | 들어가는 코스 |
| --- | --- | --- |
| 데이터 분석 · PART NumPy | NumPy 소개: 숫자를 한꺼번에 계산하는 도구 (da-01-0) | NumPy 배열과 연산 (맨 앞) |
| 데이터 분석 · PART pandas 기초 | pandas 소개: 표를 코드로 다루는 도구 (da-03-0) | pandas Series · DataFrame (맨 앞) |
| 데이터 시각화 · PART matplotlib | matplotlib 소개: 파이썬 그래프의 바탕 (da-09-0) | matplotlib 기본 구조 (맨 앞) |
| 데이터 시각화 · PART seaborn | seaborn 소개: 표를 넘기면 통계 그래프가 나온다 (da-10-0) | seaborn 기본 구조 (맨 앞) |
| 머신러닝 · PART 지도학습 기본 | scikit-learn 소개: 머신러닝 공구 상자 (ml-01-0) | ML 워크플로와 데이터 준비 (맨 앞) |
| 딥러닝 · PART 신경망 기초 | PyTorch 소개: 딥러닝을 만드는 도구 (dl-01-0) | 퍼셉트론과 활성화 함수 (맨 앞) |

- 데이터 시각화 트랙의 '도구 익히기' PART는 matplotlib · seaborn 두 PART로 나눠, 두 소개 레슨이 각각 PART 첫 페이지가 되게 한다(데이터 분석 트랙이 NumPy / pandas로 나뉜 것과 같은 모양).
- 새 코스를 만들지 않고 기존 코스 맨 앞에 레슨(`-0`)을 넣는다. DAY 번호 · 유닛 · 연습문제 연결은 그대로.
- pandas 활용 PART(groupby · merge · 시계열)는 pandas 기초 PART와 같은 라이브러리라 따로 소개하지 않는다.

## 공통 틀

모든 소개 레슨은 같은 순서로 쓴다. 학생이 여섯 페이지를 지나며 "도구 하나를 소개받는 방법"에 익숙해지게 한다.

1. **시작하기 전에**: 이 도구가 없으면 무엇이 불편한지 (문제 먼저)
2. **X는 무엇인가**: 한 문장 정의, 이름의 뜻, 불러오는 관례(`import numpy as np`)
3. **F 데이터 파이썬 지도**(공통 그림): 파이썬 위에 라이브러리가 쌓인 구조에서 이 도구 위치를 강조. 여섯 레슨 모두 같은 지도에 강조만 바뀐다.
4. **핵심 아이디어 2~3개**: 설명 → 작은 실행 셀 → 결과 해석 교차(PyTorch는 읽기 전용 코드)
5. **짧은 역사**: 누가, 왜 만들었나 (연도 · 사람 2~3줄 + 표)
6. **다른 도구와 비교**: 엑셀 · SQL · 다른 라이브러리와 무엇이 다른가
7. **이 PART에서 배우는 것**: 코스 제목 링크 목록
8. **정리**

- 퀴즈 없음: 소개 페이지는 판단할 거리가 적고, 바로 다음 레슨에 실습 · 체크 퀴즈가 있다. '다 읽었어요 · 레슨 완료' 버튼으로 끝낸다.
- 분량: 읽기 10~12분. 실행 셀은 레슨당 3~5개, 셀 하나에 개념 하나, import는 맨 위.
- 다음 레슨과 겹치지 않게: 소개 레슨은 "무엇이고 왜 쓰나"까지만, 문법 자세히는 다음 레슨에 맡긴다.
- 그림 글자는 한글(SVG, 시스템 글꼴). 실행 셀 그래프의 글자는 영어.

## 그림 목록 (`scripts/figures_libs.py` → `content/img/libs/`)

| 파일 | 내용 | 쓰는 레슨 |
| --- | --- | --- |
| lib-map-numpy · lib-map-pandas · lib-map-matplotlib · lib-map-seaborn · lib-map-sklearn · lib-map-pytorch | 데이터 파이썬 지도: 파이썬 바닥 → NumPy → pandas · matplotlib → seaborn, 옆에 scikit-learn · PyTorch. 해당 도구만 강조 | 각 레슨 |
| np-list-vs-array | 리스트(여기저기 흩어진 상자를 가리키는 쪽지) vs 배열(같은 종류 칸이 한 줄로 붙음) | NumPy |
| np-loop-vs-vector | for 반복(하나씩 5번) vs 벡터 연산(한 번에) | NumPy |
| pd-anatomy | DataFrame 해부: index · columns · Series 한 열 · 속은 NumPy 배열 | pandas |
| pd-workflow | 읽기 → 살펴보기 → 고르기 → 정리하기 → 묶기 → 합치기 → 저장하기, 각 단계 코드와 코스 | pandas |
| mpl-layers | 내 코드(pandas .plot · seaborn · plt) → matplotlib(Figure · Axes) → 화면 · PNG | matplotlib |
| mpl-gallery | matplotlib이 그리는 기본 차트 6종 미리 보기 | matplotlib |
| sns-vs-mpl | 같은 그래프: matplotlib은 묶기 · 반복 · 색 · 범례를 직접, seaborn은 열 이름 배정 한 줄 | seaborn |
| sns-families | seaborn 함수 가족: 관계 · 분포 · 범주 · 회귀 · 행렬 | seaborn |
| sk-api | 리모컨 비유: 모델이 달라도 버튼은 fit · predict · score 세 개 | scikit-learn |
| sk-modules | 모듈 지도: preprocessing · model_selection · 모델들 · metrics · pipeline과 배울 코스 | scikit-learn |
| pt-tensor | NumPy 배열 vs 텐서: 같은 숫자 격자 + GPU에 올리기 + 계산 기록(기울기) | PyTorch |
| pt-loop | 학습 반복 네 줄: 예측 → 손실 → 역전파 → 업데이트 | PyTorch |

---

## da-01-0 NumPy 소개: 숫자를 한꺼번에 계산하는 도구

- **목표**: NumPy가 "같은 종류 숫자를 한 줄로 붙여 담고 한 번에 계산하는 도구"임을 설명하고, pandas · scikit-learn이 그 위에 있다는 것을 안다.
- **전제 개념**: 파이썬 리스트, for 반복, import.
- **알아야 할 개념**: ① 리스트로 숫자 계산할 때의 불편(반복문) ② NumPy · ndarray 정의, 이름(Numerical Python), `np` 관례 ③ 왜 빠른가: 같은 종류 · 붙어 있는 칸 · C로 짠 반복 ④ 벡터 연산 ⑤ NumPy가 숨어 있는 곳(pandas 열, 이미지, scikit-learn 입력) ⑥ 역사 ⑦ 이 PART 지도
- **배치**: S(시작하기 전에: 100만 개 값에 1.1 곱하기) → C(리스트 * 2 는 반복, for로 곱하기) → S(NumPy 정의 · 이름) → **F** lib-map-numpy → C(np.array, * 1.1, shape · dtype) → R → S(왜 빠른가) → **F** np-list-vs-array → **F** np-loop-vs-vector → **T**(100만 개 for vs 배열 시간 재기, 몇 배인지) → R(환경마다 다르지만 수십 배) → S(숨어 있는 NumPy) → C(pandas 열 `.to_numpy()` 타입) → R → S(역사 표) → S(엑셀 · 리스트와 비교 표) → S(PART 지도) → S(정리)
- **퀴즈 vs 코드**: 퀴즈 없음(소개). 시간 재기 T 셀이 "왜 쓰는지"를 몸으로 느끼게 한다.
- **데이터**: 셀 안에서 만든 숫자, `titanic.csv`(fare 열).
- **원본**: docs/sources/python/07-3-numpy-arrays("값 하나씩 처리하는 사고 → 배열 전체", 설치와 import), 07-1-what-is-external-library(표준 vs 외부 라이브러리).

## da-03-0 pandas 소개: 표를 코드로 다루는 도구

- **목표**: pandas가 "엑셀 표를 코드로 다루는 도구"이고 DataFrame = 이름표 붙은 NumPy 열 묶음임을 설명하고, pandas로 하는 일의 흐름을 안다.
- **전제 개념**: NumPy 배열(앞 PART), 딕셔너리.
- **알아야 할 개념**: ① 엑셀로 하던 일(필터 · 피벗 · VLOOKUP)을 반복해야 할 때의 불편 ② pandas 정의, 이름(panel data), `pd` 관례 ③ DataFrame · Series · index · columns ④ 한 줄로 요약하기(엑셀 피벗 = groupby) ⑤ pandas로 하는 일의 흐름 ⑥ 역사(웨스 매키니, 2008) ⑦ 엑셀 · SQL과 비교 ⑧ 이 PART 지도
- **배치**: S(시작하기 전에: 매주 같은 엑셀 작업) → S(정의) → **F** lib-map-pandas → C(read_csv 타이타닉, head) → R → **F** pd-anatomy → C(열 하나 = Series, type, to_numpy) → R → S(한 줄 요약) → C(groupby sex 생존율) → R(여성 0.742, 남성 0.189) → T(sex 대신 pclass로 바꿔 보기) → **F** pd-workflow → S(역사) → S(엑셀 · SQL · pandas 비교 표) → S(PART 지도: pandas 기초 3코스 + pandas 활용 3코스) → S(정리)
- **퀴즈 vs 코드**: 퀴즈 없음.
- **데이터**: `titanic.csv`.
- **원본**: docs/sources/python/07-3-pandas-dataframe("SQL 결과, Excel, CSV를 후처리"), 07-4-pandas-basics.
- **기존 레슨과 관계**: pandas Series · DataFrame 레슨의 첫 문단(“엑셀 표를 코드로 다루는 도구가 pandas”)은 그대로 두고, 소개 레슨은 그 앞에서 "왜 · 무엇 · 어디까지"를 넓게 보여 준다.

## da-09-0 matplotlib 소개: 파이썬 그래프의 바탕

- **목표**: matplotlib이 파이썬 그래프의 바탕 도구이고, pandas `.plot`과 seaborn도 결국 matplotlib으로 그린다는 것을 안다.
- **전제 개념**: pandas DataFrame 기초.
- **알아야 할 개념**: ① 엑셀 차트 vs 코드 차트(같은 그래프를 100번, 데이터가 바뀌어도) ② 정의, 이름(MATLAB + plot + lib), `plt` 관례 ③ 층 구조: 내 코드 → matplotlib → 화면 · 파일 ④ 가장 짧은 그래프 3줄 ⑤ pandas `.plot`도 matplotlib ⑥ 그릴 수 있는 것(갤러리) ⑦ 역사(존 헌터, 2003, 뇌전증 연구) ⑧ 다른 시각화 도구와 비교 ⑨ PART 지도
- **배치**: S(시작하기 전에) → S(정의 · 이름) → **F** lib-map-matplotlib → C(plt.plot 3줄) → R → **F** mpl-layers → C(pandas `.plot()`이 돌려주는 것이 Axes) → R → **F** mpl-gallery → C(한 도화지에 막대 · 산점도, 같은 4단계) → S(역사) → S(비교 표: 엑셀 · 태블로 · matplotlib · seaborn · plotly) → S(PART 지도) → S(정리)
- **데이터**: `flights.csv`.
- **원본**: docs/sources/python/07-4-visualization-libraries, 07-6-matplotlib-basics.

## da-10-0 seaborn 소개: 표를 넘기면 통계 그래프가 나온다

- **목표**: seaborn이 matplotlib 위의 통계 그래프 도구이고, "표 + 열 이름 배정"만으로 묶기 · 색 구분 · 범례를 대신해 준다는 것을 안다.
- **전제 개념**: matplotlib fig · ax(앞 PART), groupby 개념.
- **알아야 할 개념**: ① matplotlib으로 그룹별 색 그래프를 그릴 때의 수고 ② 정의, `sns` 별명 유래 ③ 같은 그래프 두 방식 비교 ④ 함수 가족 5개 ⑤ 테마 한 줄 ⑥ 역사(마이클 워스컴, 2012) ⑦ matplotlib과 언제 무엇을 쓰나 ⑧ PART 지도
- **배치**: S(시작하기 전에) → S(정의) → **F** lib-map-seaborn → C(matplotlib으로 성별 색 산점도: 반복문 · 색 · 범례 직접) → C(seaborn 한 줄) → R → **F** sns-vs-mpl → **F** sns-families → C(같은 data · x로 함수만 바꾸기: boxplot) → S(테마) → S(역사 · 이름 유래) → S(언제 무엇을 쓰나 표) → S(PART 지도: seaborn 기본 구조 + 질문별 차트) → S(정리)
- **데이터**: `tips.csv`.
- **원본**: docs/sources/python/07-7-seaborn-plotly.

## ml-01-0 scikit-learn 소개: 머신러닝 공구 상자

- **목표**: scikit-learn이 머신러닝 모델 · 전처리 · 평가를 같은 사용법(fit · predict · score)으로 모아 둔 도구임을 설명한다.
- **전제 개념**: 머신러닝 시작하기(학습 → 예측, X와 y). pandas 기초.
- **알아야 할 개념**: ① 모델마다 사용법이 다르면 생기는 일 ② 정의, 이름(SciPy Toolkit), `sklearn` 관례(설치 이름과 불러오는 이름이 다름) ③ 같은 버튼 세 개: fit · predict · score ④ 모델 갈아 끼우기 ⑤ 모듈 지도 ⑥ 역사(2007 구글 여름 코드 → 2010 INRIA) ⑦ 잘하는 것 · 못하는 것(표 데이터 O, 딥러닝 X) ⑧ PART 지도
- **배치**: S(시작하기 전에) → S(정의 · 이름) → **F** lib-map-sklearn → **F** sk-api → C(타이타닉 숫자 열, 트리 fit · score) → R → C(predict 새 승객 2명) → R → C(로지스틱 회귀로 import 한 줄만 바꿔 같은 세 줄) → R → T(KNN으로 바꿔 보기) → **F** sk-modules → S(역사) → S(잘하는 것 · 못하는 것 표) → S(PART 지도) → S(정리)
- **데이터**: `titanic.csv`(pclass · age · fare · sibsp · parch, age 결측 행 제외).
- **원본**: docs/sources/ml/03-1-first-scikit-learn-pipeline, 03-ml-workflow-with-scikit-learn.

## dl-01-0 PyTorch 소개: 딥러닝을 만드는 도구

- **목표**: PyTorch가 "GPU에서 돌고 계산 기록으로 기울기를 자동으로 구하는 NumPy 같은 배열(텐서) + 신경망 부품"이라는 것을 설명하고, 짧은 PyTorch 코드를 읽을 때 무엇을 보면 되는지 안다.
- **전제 개념**: 딥러닝 시작하기. NumPy 배열(없어도 됨: 숫자 격자라고 한 줄로 짚음).
- **알아야 할 개념**: ① 신경망을 손으로 짜면 힘든 두 가지: 엄청난 곱셈, 기울기 계산 ② 정의, `torch` 이름(루아 Torch에서) ③ 텐서 = 배열 + GPU + 계산 기록 ④ 자동 미분(autograd): "어느 쪽으로 고치면 되는지"를 자동으로 ⑤ 층을 레고처럼 쌓기(nn) ⑥ 학습 반복 네 줄 ⑦ 역사(2016 페이스북 AI 연구소, 2022 PyTorch 재단) ⑧ TensorFlow · Keras와 비교 ⑨ PART 지도
- **배치**: S(시작하기 전에) → S(정의) → **F** lib-map-pytorch → S(텐서) → 읽기 코드(torch.tensor, shape, .to("cuda")) → **F** pt-tensor → S(자동 미분, 손 계산 예: y = 3x, x=2) → 읽기 코드(requires_grad, backward, grad) → S(층 쌓기) → 읽기 코드(nn.Sequential) → S(학습 반복) → **F** pt-loop → 읽기 코드(5줄 루프) → S(역사) → S(비교 표) → S(PART 지도: 각 줄을 어느 코스에서 배우나) → S(자주 하는 오해) → S(정리)
- **퀴즈 vs 코드**: 실행 셀 없음(딥러닝 트랙 규칙). 코드는 ```python 읽기 전용, 줄마다 주석.
- **원본**: docs/sources/dl/deep-learning, neural-network, gradient-descent.
