# 레슨 원본 자료 (저작자 본인 교재)

러너즈빌드업 레슨을 작성할 때 바탕으로 쓰는 원본입니다. 모두 진성 님이 쓴 위키독스 교재(러너스 스쿨)의 원고이므로 **문장·표·예제를 그대로 가져와도 됩니다.** 다만 레슨 기준(고등학생~대학 초년생, 기초 전제부터, 쉬운 말, 설명→코드 교차, import 맨 위)에 맞게 다시 풀어 씁니다. 원본은 실무자·BI 독자 기준이라 용어를 바로 쓰는 곳이 많으니, 전제 개념을 한 단계 앞에 추가하세요.

## 어디서 가져왔나

| 폴더 | 원본 (옵시디언 볼트 `~/Desktop/Project/Obsidian`) | 깃허브 |
| --- | --- | --- |
| `python/` | `raw/books/02-데이터 분석/Python 기초/pages` (8장 41쪽) | 볼트에만 있음 |
| `stats/` | `raw/books/02-데이터 분석/통계 기초/pages` (8장 31쪽) | heoquixote/statistics-book |
| `ml/` | `raw/books/02-데이터 분석/머신러닝 기초/pages` (12장 66쪽) | heoquixote/machine-learning-book |
| `dl/` | 딥러닝 단독 교재는 없음. `wiki/concepts/*.md`(개념 노트) + 빅데이터분석기사 3과목 2-1-4 인공신경망, 2-2-5 딥러닝 분석(`raw-*.md`) | - |
| `dl/figures/` | 빅데이터분석기사 `assets/` SVG 4개 (활성화 함수, 딥러닝 계보, 옵티마이저, AI·ML·DL 분류) | - |

- 볼트는 2026-07-27 로컬 저장소 사본입니다. machine-learning-book 저장소는 2026-10-26까지 갱신됐으니 최신 문구가 필요하면 저장소 쪽이 더 새것일 수 있습니다.
- `ml/11-3~11-7`이 참조하는 PNG(`../assets/ch11-unsupervised-images/`)는 용량(17MB) 때문에 복사하지 않았습니다. 레슨 그림은 규칙대로 자체 SVG로 새로 그립니다.
- 각 장의 `NN-<slug>.md`(번호 하나)는 장 소개, `NN-M-<slug>.md`는 절 본문입니다. `TOC.md`에 원본 목차가 있습니다.

## 코스별 매핑

### 파이썬 기초 (python-basic)

| 코스 | 주 원본 | 보조 |
| --- | --- | --- |
| pb-00 파이썬 시작하기 | python/01-1-why-python, 01-2-how-python-runs, 01-3-development-environment | 01-python-and-programming |
| pb-01 변수와 사칙연산 | python/02-1-variables-and-basic-types, 02-2-operators-and-expressions | |
| pb-02 문자열 기초 | python/02-3-strings-and-input-output | 02-4-type-conversion-and-truthiness |
| pb-03 문자열 메서드 | python/02-3-strings-and-input-output | |
| pb-04 리스트 기초 | python/03-1-list-and-tuple | 03-3-reference-mutation-copy |
| pb-05 리스트 정렬과 에러 읽기 | python/03-1-list-and-tuple, 08-2-debugging-and-error-reading | |
| pb-06 딕셔너리와 Set | python/03-2-dict-and-set | |
| pb-07 제어문 | python/04-1-conditional-statements, 04-2-loops | 02-4 (truthiness) |
| pb-08 문자열 활용 (함수) | python/04-4-functions-and-scope | |
| pb-09 알고리즘 (함수형) | python/04-4-functions-and-scope | 직접 대응하는 절 없음 |
| pb-10 파일 입출력 | python/06-1-file-input-and-output, 06-3-csv-and-json | 06-4-pathlib-datetime-collections |
| pb-11 컴프리헨션과 람다 | python/04-3-comprehensions, 04-4-functions-and-scope | |
| pb-12 예외 처리 | python/06-2-exception-handling | 08-2-debugging-and-error-reading |

교재에는 있지만 사이트에 코스가 없는 내용: 형변환·참/거짓(02-4), 참조와 복사(03-3), 모듈·클래스·가상환경(05장), pathlib·datetime·collections(06-4), requests API(07-2), 자동화 스크립트·프로젝트 구조(08-1, 08-3).

### 데이터 분석 (python-da: da-01~08) · 데이터 시각화 (python-viz: da-09·da-10)

| 코스 | 주 원본 | 보조 |
| --- | --- | --- |
| da-01 NumPy 배열과 연산 | python/07-3-numpy-arrays | 07-1-what-is-external-library |
| da-02 인덱싱과 브로드캐스팅 | python/07-3-numpy-arrays | |
| da-03 pandas Series · DataFrame | python/07-4-pandas-basics (핵심 데이터 구조, 데이터 읽기, 처음 볼 것) | 07-3-pandas-dataframe |
| da-04 선택과 필터 | python/07-4-pandas-basics (열 선택, loc/iloc, 조건 필터링, 정렬) | |
| da-05 결측치와 전처리 | python/07-5-pandas-practical (결측치 탐색·처리, 중복값, map, apply) | ml/03-3-missing-data-and-knn-imputation |
| da-06 groupby와 pivot_table | python/07-5-pandas-practical (groupby, 실무 예제) | |
| da-07 merge와 concat | python/07-5-pandas-practical (merge, concat, 사용자·주문 결합 예제) | |
| da-08 시계열 | python/07-5-pandas-practical (날짜형 변환과 .dt) | python/06-4-pathlib-datetime-collections (datetime) |
| da-09 matplotlib 기본 | python/07-6-matplotlib-basics | 07-4-visualization-libraries |
| da-10 seaborn 통계 시각화 | python/07-7-seaborn-plotly | stats/02-3-shape-and-outlier |

### 통계 (stats)

| 코스 | 주 원본 | 보조 |
| --- | --- | --- |
| st-01 기술통계 | stats/02-1-central-tendency, 02-2-dispersion, 02-3-shape-and-outlier | 01-1, 01-2 (모집단·표본·척도), 01-3 |
| st-02 확률분포 | stats/03-1-event-and-probability, 03-3-random-variable-and-distribution | 03-2-conditional-probability-and-bayes |
| st-03 표본분포와 중심극한정리 | stats/04-1-sampling-and-bias, 04-2-sampling-distribution-and-clt | |
| st-04 신뢰구간 | stats/04-3-confidence-interval | |
| st-05 가설검정과 t검정 | stats/05-1-hypothesis-pvalue, 05-3-t-test-and-chi-square | 05-2-type1-type2-power |
| st-06 카이제곱 · ANOVA | stats/05-3-t-test-and-chi-square, 07-2-anova | |
| st-07 상관과 회귀 | stats/06-1-covariance-and-correlation, 06-2-simple-linear-regression | 06-3-regression-diagnostics, 08-1-correlation-vs-causation |
| st-08 A/B 테스트와 검정력 | stats/07-1-ab-test-basics, 05-2-type1-type2-power | 07-3-practical-decision-making, 08-2-reporting-and-communication |

### 머신러닝 (ml)

| 코스 | 주 원본 | 보조 |
| --- | --- | --- |
| ml-01 ML 워크플로와 데이터 분할 | ml/01-1-ml-vs-rule-based, 01-2, 02-1-dataset-feature-label, 02-2-train-validation-test-split | 02-3-data-leakage, 03-1-first-scikit-learn-pipeline |
| ml-02 선형 · 로지스틱 회귀 | ml/06-1-linear-regression-and-loss, 07-1-logistic-regression-and-probability | 06-3-ridge-and-lasso-regression |
| ml-03 평가지표 | ml/06-2-regression-metrics-and-interpretation, 07-2-threshold-confusion-matrix, 08-1-precision-recall-f1, 08-2-roc-auc-pr-auc | 08-3-fbeta-f2-f05 |
| ml-04 트리와 앙상블 | ml/10-1-decision-tree-basics, 10-2-random-forest-classifier, 10-3-gradient-boosting-classifier | 10-4~10-6 (XGBoost·LightGBM·CatBoost), 10-7-ensemble-strategies |
| ml-05 교차검증과 하이퍼파라미터 | ml/09-1-overfitting-underfitting, 09-2-cross-validation-and-regularization, 09-4-hyperparameter-tuning | 09-5-automl-tools |
| ml-06 피처 엔지니어링과 Pipeline | ml/03-2-baseline-and-pipeline, 03-4-categorical-encoding, 04-1-standard-scaling, 05-1-what-is-derived-features | 03-3, 04-2~04-4, 05-2, 05-4 |
| ml-07 비지도 학습 | ml/11-1-clustering-basics, 11-2-pca-and-dimensionality-reduction | 11-3~11-7 (계층·DBSCAN·GMM·t-SNE·UMAP) |
| ml-08 불균형 데이터 | ml/09-3-imbalanced-data-and-smote | 08-3-fbeta-f2-f05 |
| ml-09 모델 해석 | ml/05-3-feature-importance, 05-5-shap-and-pdp | 05-4-multicollinearity |

교재에는 있지만 사이트에 코스가 없는 내용: 미니 프로젝트·모델 저장과 배포(12장).

### 딥러닝 (dl, 개념 레슨)

| 코스 | 주 원본 | 보조 |
| --- | --- | --- |
| dl-01 퍼셉트론과 활성화 함수 | dl/raw-2-1-4-neural-network (발전사, XOR, 구조, 활성화 함수, 출력값 계산 예), dl/activation-function | dl/neural-network, figures/activation-functions.svg, figures/ai-ml-dl-taxonomy.svg |
| dl-02 손실함수와 경사하강법 | dl/loss-function, dl/gradient-descent | dl/optimizer, figures/optimizers.svg |
| dl-03 순전파와 역전파 | dl/raw-2-1-4-neural-network (학습의 흐름, 주요 설정값, 기울기 소실) | dl/vanishing-gradient |
| dl-04 MLP 학습과 과적합 | dl/raw-2-1-4-neural-network (과대적합 방지), dl/raw-2-2-5-deep-learning (과적합을 막는 장치) | dl/overfitting, dl/dropout |
| dl-05 CNN | dl/cnn, raw-2-1-4 (CNN이 이미지에 적합한 이유) | |
| dl-06 RNN과 시퀀스 | dl/rnn, raw-2-1-4 (RNN과 LSTM) | dl/vanishing-gradient |
| dl-07 임베딩과 어텐션 | dl/embedding, dl/transformer, raw-2-2-5 (트랜스포머) | dl/deep-learning, figures/deeplearning.svg |

딥러닝 원본은 자격증 교재 기준이라 설명이 압축돼 있습니다. 다른 트랙보다 비유·그림을 더 보태야 합니다.
