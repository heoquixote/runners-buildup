# 예제 데이터셋

레슨 · 문제 코드에 파일 이름이 보이면 브라우저(worker.js)가 이 폴더에서 받아 작업 폴더에 둔다. 그래서 `pd.read_csv("seoul_bike.csv")`처럼 이름만으로 읽힌다.
새 파일을 넣으면 `worker.js`의 `DATASETS`(SQL DB면 `sql.js`의 `SQL_SEEDS`도)에 이름을 더한다. 파일 하나는 1MB 이하로 둔다.

| 파일 | 행 × 열 | 내용 | 출처 · 라이선스 |
|---|---|---|---|
| titanic.csv | 891 × 15 | 타이타닉 승객 생존 | seaborn-data |
| ai4i2020.csv | 10,000 × 7 | 설비 고장(AI4I 2020) | UCI #601, CC BY 4.0 |
| tips.csv | 244 × 7 | 식당 팁 | seaborn-data (Bryant & Smith 1995) |
| penguins.csv | 344 × 7 | 파머 펭귄 | Palmer Penguins, CC0 |
| flights.csv | 144 × 3 | 월별 항공 승객(1949~1960) | seaborn-data (Box & Jenkins) |
| seoul_bike.csv | 8,760 × 12 | 서울 따릉이 시간대별 대여 수(2017-12 ~ 2018-11)와 날씨 | UCI #560 Seoul Bike Sharing Demand, CC BY 4.0 |
| gapminder.csv | 1,704 × 6 | 142개 나라 5년 간격 기대수명 · 인구 · 1인당 GDP(1952~2007) | Gapminder (R gapminder 패키지), CC0 |
| galton.csv | 934 × 8 | 골턴의 부모 · 자녀 키(인치 → cm로 바꿈) | HistData::GaltonFamilies, 1886년 자료(퍼블릭 도메인) |
| datasaurus.csv | 1,846 × 3 | 요약 통계가 같은 13개 점 묶음(Datasaurus Dozen) | datasauRus 패키지, MIT |
| steel_faults.csv | 1,941 × 27 | 강판 표면 결함 7종과 형상 · 밝기 특성 | UCI #198 Steel Plates Faults, CC BY 4.0 |
| sql_company.sql | emp · dept · salgrade | 회사 직원 DB | 오라클 SCOTT 예제 |
| sql_shop.sql | users · orders · events | 가상 쇼핑몰 | 자체 생성(scripts/build_sql_data.py) |
| chinook.sql | 11개 테이블 | 음원 판매 DB(artist · album · track · genre · media_type · playlist · playlist_track · employee · customer · invoice · invoice_line) | Chinook Database 1.4.5 (Luis Rocha), MIT · 이름을 snake_case로 바꿈 |

sklearn 내장 데이터(`load_iris`, `load_wine`, `load_breast_cancer`, `load_diabetes`, `load_digits`)는 패키지 안에 있어 파일 없이 쓴다.

## 열 설명 (새로 넣은 데이터)

- **seoul_bike**: date, rented_bikes(그 시간 대여 수), hour(0~23), temp(°C), humidity(%), wind_speed(m/s), solar_rad(MJ/m²), rainfall(mm), snowfall(cm), season, holiday(Yes/No), functioning_day(운영한 날 Yes/No, No인 날은 대여 0)
- **gapminder**: country, continent, year, life_exp(기대수명, 세), pop(인구), gdp_per_cap(1인당 GDP, 물가를 반영한 달러)
- **galton**: family, father, mother, midparent(부모 평균 키 = (아버지 + 1.08 × 어머니) / 2), children(자녀 수), child_num, gender, child(자녀 키) — 키는 모두 cm
- **datasaurus**: dataset(dino, star, circle 등 13종), x, y
- **steel_faults**: steel_type(A300/A400), 결함 위치(x_min ~ y_max), 크기(pixels_areas, 둘레), 밝기(sum/min/max_luminosity), conveyer_length, thickness, 모양 지수들(…_index, log_…, sigmoid_areas), fault(Pastry · Z_Scratch · K_Scratch · Stains · Dirtiness · Bumps · Other_Faults)

## 다시 만들기

새 공개 데이터 5종과 chinook.sql은 `scripts/build_open_data.py <원본 폴더> datasets`로 만든다. 원본 파일: SeoulBikeData.csv, 08_gap-every-five-years.tsv(jennybc/gapminder), GaltonFamilies.csv(Rdatasets), DatasaurusDozen-Long.tsv(jumpingrivers/datasauRus), Faults.NNA(UCI), Chinook_Sqlite.sql(lerocha/chinook-database).
