# 데이터 분석 트랙(NumPy · pandas) 레슨 기획안

작성 기준은 [README.md](README.md). 기호: `S` 설명, `F` 그림, `C` 실행 셀, `T` 직접 해보기, `R` 결과 해석.

원본은 진성 님의 Python 기초 원고 7장(`docs/sources/python/07-3-numpy-arrays`, `07-3-pandas-dataframe`, `07-4-pandas-basics`, `07-5-pandas-practical`)입니다. 시각화 코스(da-09~16)는 [viz.md](viz.md)에 따로 있습니다.

## 범위와 원칙 (2026-11-06)

- **과정**: QAQC · 기본 데이터 두 과정이 **같은 내용**으로 공부한다(진성 님 결정). 그래서 예제 소재를 섞는다. 제조 소재는 셀 안에서 만든 로트 · 센서 표와 `ai4i2020.csv`(설비 고장), 일반 소재는 `titanic.csv` · `tips.csv` · `penguins.csv` · `flights.csv`.
- **우선순위**: 파이썬 기초 다음 순서. 코스 8개(da-01~08) × 레슨 1개를 코스마다 레슨 2개씩 더해 **레슨 24개**로 만든다.
- **기존 레슨과 겹치지 않게**: 기존 레슨(xx-1)은 코스 전체를 한 번 훑는 개요라, 새 레슨은 개요에서 한 줄로 지나간 부분을 깊게 다루거나 개요에 없는 실무 동작을 다룬다. 기존 id · 퀴즈 · 영상 위치는 그대로 둔다.
- **실행 셀**: 셀 하나에 개념 하나. import는 맨 위, 셀마다 짧은 print, 본문 숫자는 실제 출력과 맞춘다. 에러 예시는 읽기 전용 블록(```python)으로 보여 준다.
- **버전**: 브라우저 Pyodide의 pandas는 로컬보다 낮을 수 있다. 버전마다 출력이 달라지는 기능(경고 문구, 새 키워드)은 본문에서 출력 모양을 단정하지 않는다.
- **연습문제**: 유닛 10, 23~29의 기존 문제를 그대로 쓴다.

## 트랙 구성

| DAY | 코스 (id, 유닛) | 레슨 | 한 문장 목표 | 마무리 |
| --- | --- | --- | --- | --- |
| 01 | NumPy 배열과 연산 (da-01, 10) | da-01-1 반복문 없이 배열을 한 번에 계산하기 (기존) | 배열 연산 · 통계량 · 불리언 인덱싱 | 퀴즈 2 (기존) |
| | | da-01-2 배열 만들기와 자료형 | arange · linspace · zeros · full · 난수로 배열을 만들고 dtype을 확인 · 변환한다 | 퀴즈 2 |
| | | da-01-3 조건으로 바꾸고 세기 | np.where · clip으로 값을 바꾸고 unique · cumsum · argsort로 세고 순서를 본다 | 퀴즈 2 → 유닛 10 실습 |
| 02 | 인덱싱과 브로드캐스팅 (da-02, 23) | da-02-1 모양이 다른 배열끼리 계산하는 규칙 (기존) | 2차원 인덱싱 · 브로드캐스팅 | 퀴즈 2 (기존) |
| | | da-02-2 2차원 집계와 표준화 | 로트 × 센서 표를 axis로 집계하고 열마다 z-score로 표준화한다 | 퀴즈 2 |
| | | da-02-3 배열 모양 바꾸기 | reshape · ravel · T · newaxis · 이어 붙이기를 쓰고 view와 copy를 구분한다 | 퀴즈 2 → 유닛 23 실습 |
| 03 | pandas Series · DataFrame (da-03, 24) | da-03-1 표 데이터를 불러와 첫인상 잡기 (기존) | 불러오기 · describe · info | 퀴즈 2 (기존) |
| | | da-03-2 DataFrame 만들고 열 다루기 | 딕셔너리 · 레코드 리스트로 표를 만들고 열을 추가 · 이름 변경 · 삭제한다 | 퀴즈 2 |
| | | da-03-3 인덱스 이해하기 | set_index · reset_index를 쓰고 Series 연산이 인덱스로 맞춰진다는 점을 안다 | 퀴즈 2 → 유닛 24 실습 |
| 04 | 선택과 필터 (da-04, 25) | da-04-1 원하는 행과 열만 골라내기 (기존) | 조건 필터 · loc · iloc · isin · query | 퀴즈 2 (기존) |
| | | da-04-2 문자열 · 범위 · 결측 조건 | str.contains · between · isna · ~ 로 말로 된 조건을 코드로 옮긴다 | 퀴즈 2 |
| | | da-04-3 필터 결과로 새 열 만들기 | copy와 loc 대입, np.where · np.select로 라벨 열을 만들고 여러 단계 질문을 나눠 푼다 | 퀴즈 2 → 유닛 25 실습 |
| 05 | 결측치와 전처리 (da-05, 26) | da-05-1 (기존) | 결측 · 중복 · 형변환 개요 | 퀴즈 2 (기존) |
| | | da-05-2 문자열 열 깊게 정리하기 | strip · replace · split(expand) · extract · to_numeric(errors='coerce')로 지저분한 열을 숫자로 만든다 | 퀴즈 2 |
| | | da-05-3 이상치 · 구간 · 중복 | IQR 규칙과 clip, cut · qcut 구간화, drop_duplicates(subset, keep)를 쓴다 | 퀴즈 2 → 유닛 26 실습 |
| 06 | groupby와 pivot_table (da-06, 27) | da-06-1 (기존) | groupby · agg · transform · pivot_table | 퀴즈 2 (기존) |
| | | da-06-2 그룹 안에서 고르고 순위 매기기 | 직접 만든 집계 함수 · 그룹 필터 · 그룹별 상위 n개 · 그룹 안 순위와 누적을 쓴다 | 퀴즈 2 |
| | | da-06-3 넓은 표와 긴 표 | pivot_table(margins) · melt · stack · unstack으로 표 모양을 바꾼다 | 퀴즈 2 → 유닛 27 실습 |
| 07 | merge와 concat (da-07, 28) | da-07-1 (기존) | how · 행 증가 함정 · concat | 퀴즈 2 (기존) |
| | | da-07-2 여러 표 단계적으로 잇기 | 표 세 개를 차례로 잇고 validate · 행 수 확인 · 키 자료형 맞추기를 습관으로 만든다 | 퀴즈 2 |
| | | da-07-3 여러 파일 이어 붙이기 | 반복문으로 파일을 읽어 출처 열과 함께 concat하고 열 불일치 · 중복을 정리한다 | 퀴즈 2 → 유닛 28 실습 |
| 08 | 시계열 (da-08, 29) | da-08-1 (기존) | to_datetime · dt · resample · rolling | 퀴즈 2 (기존) |
| | | da-08-2 날짜 계산과 기간 자르기 | Timedelta로 경과 일수를 구하고 날짜 인덱스로 기간을 자른다 | 퀴즈 2 |
| | | da-08-3 센서 시계열 다듬기 | 빠진 시각을 asfreq로 드러내고 ffill · interpolate로 채운 뒤 diff로 급변을 찾는다 | 퀴즈 2 → 유닛 29 실습 |

개념 태그는 기존 `np.*` · `pd.*` 태그를 그대로 쓴다.

---

## 레슨별 설계 요약

### da-01-2 배열 만들기와 자료형
- S 왜 직접 만드나: 테스트 데이터, 기준값 배열, 시뮬레이션
- C `np.arange` · `np.linspace` 비교(끝 포함 여부) → C `zeros` · `ones` · `full` → C `default_rng(seed)`로 측정값 흉내
- C dtype: int와 float가 섞이면 float, `astype(int)`는 버림 → R "반올림이 필요하면 round 후 astype"
- T 10.0~10.5를 0.1 간격으로 만들기

### da-01-3 조건으로 바꾸고 세기
- C `np.where(조건, 참값, 거짓값)`으로 OK/NG 라벨 → C `clip`으로 센서 값 범위 제한
- C `np.unique(..., return_counts=True)`로 결과 세기 → C `cumsum`으로 누적 생산량
- C `sort` · `argsort`로 "가장 나쁜 로트 3개의 번호" 찾기

### da-02-2 2차원 집계와 표준화
- F 로트(행) × 센서(열) 표 그림, axis=0 · 1 화살표
- C 열 평균 · 행 평균 → C `argmax(axis=1)`로 로트마다 가장 높은 센서 → C 열마다 평균 빼기(브로드캐스팅) → C z-score, `keepdims`로 행 기준 계산
- R 단위가 다른 센서를 같은 잣대로 비교

### da-02-3 배열 모양 바꾸기
- C reshape(-1 자동 계산) → C ravel · T → C newaxis로 (3,)을 (3,1)로 → C concatenate · vstack · hstack
- C 슬라이스는 view(원본이 바뀜), copy()로 지키기. pb-04-3 참조와 연결

### da-03-2 DataFrame 만들고 열 다루기
- C 딕셔너리(열 단위) vs 레코드 리스트(행 단위) → C 계산으로 새 열, rename, drop
- C `assign`으로 여러 열 한 번에 → C dtypes, astype으로 열 자료형 바꾸기
- 실제 데이터: tips에 1인당 금액 · 팁 비율 열 만들기

### da-03-3 인덱스 이해하기
- S 인덱스 = 행 이름표
- C set_index로 로트 번호를 인덱스로 → loc로 이름 조회 → reset_index로 되돌리기
- C sort_index → C 인덱스가 다른 Series 두 개를 더하면 이름끼리 맞춰지고 없는 쪽은 NaN → `add(fill_value=0)`

### da-04-2 문자열 · 범위 · 결측 조건
- C `str.contains` · `startswith`(대소문자 · na 옵션) → C `between` → C `isna` · `notna`로 결측 행 고르기 → C `~`로 반대 조건
- 실제 데이터: titanic에서 나이를 모르는 승객, 운임 구간, penguins 섬 이름

### da-04-3 필터 결과로 새 열 만들기
- python 블록: 필터 결과에 바로 대입하면 원본이 바뀌지 않는 예(경고 문구는 버전마다 다름)
- C `.copy()` 후 수정 → C `np.where`로 두 갈래 라벨 → C `np.select`로 세 갈래 이상
- C 여러 단계 질문: ai4i에서 "L 등급 중 회전수 상위 10%의 고장률"을 단계별 변수로 나눠 풀기

### da-05-2 문자열 열 깊게 정리하기
- C 공백 · 대소문자 · 단위 제거 → C `str.split(expand=True)`로 열 나누기 → C `str.extract`로 숫자 뽑기
- C `pd.to_numeric(errors='coerce')`로 숫자로 못 바꾸는 값을 NaN으로 → 몇 개가 NaN이 됐는지 세기

### da-05-3 이상치 · 구간 · 중복
- C IQR(Q1 − 1.5·IQR, Q3 + 1.5·IQR) 경계 → C 이상치 개수 · clip
- C `pd.cut`(정한 경계) vs `pd.qcut`(같은 개수) 비교 → C 구간별 평균
- C `duplicated(subset, keep)` · `drop_duplicates`로 마지막 측정만 남기기

### da-06-2 그룹 안에서 고르고 순위 매기기
- C lambda · def 집계 함수(폭, 상위 10% 경계)
- C `filter`로 표본이 적은 그룹 빼기 → C 정렬 후 `groupby().head(n)` → C `rank` · `cumsum` · `cumcount`

### da-06-3 넓은 표와 긴 표
- F 긴 표 ↔ 넓은 표 그림
- C pivot_table(margins, fill_value) → C melt로 되돌리기 → C stack · unstack
- 영상 dl-m17(pivot · melt)은 da-06-1에 그대로 두고, 이 레슨 melt 설명 뒤에도 넣는다

### da-07-2 여러 표 단계적으로 잇기
- C 주문 · 제품 · 공장 세 표를 차례로 merge, 단계마다 행 수 print
- C 키 자료형이 다르면(문자 '101' vs 숫자 101) 합쳐지지 않음 → astype으로 맞추기
- C `validate='many_to_one'`으로 키 중복을 미리 잡기(에러 예시는 python 블록) → C merge 후 집계

### da-07-3 여러 파일 이어 붙이기
- C 셀 안에서 CSV 3개를 쓰고 반복문으로 읽어 리스트에 담은 뒤 concat, 파일 이름을 source 열로
- C 열 이름이 하나 다르면 NaN 열이 생김 → rename으로 맞추기
- C `ignore_index` · `keys` → C 겹친 기간 drop_duplicates

### da-08-2 날짜 계산과 기간 자르기
- C 날짜끼리 빼면 Timedelta, `.dt.days` → C `pd.Timedelta(days=7)` 더하기 → C 날짜 인덱스로 `loc['2024-03']` 자르기
- C 요일 · 주차 파생 열, 평일 · 주말 비교(tips의 day 대신 셀 안 생산 일지)

### da-08-3 센서 시계열 다듬기
- C 빠진 시각이 있는 10분 간격 데이터 → `asfreq('10min')`으로 빈 시각 드러내기
- C ffill vs interpolate 비교 → C rolling 창 크기 비교 → C `diff().abs()`로 급변 시각 찾기
