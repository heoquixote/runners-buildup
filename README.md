# 러너즈빌드업 (Runners Build-up)

개념 학습(레슨)과 문제 풀이를 한 곳에서 하는 학습 사이트입니다. 트랙(파이썬 기초 · 데이터 분석 · 데이터 시각화 · SQL · 통계 · 머신러닝 · 시계열 분석 · 딥러닝) > 코스 > 레슨 순서로 읽고, 레슨 안의 예제를 바로 실행하고, 체크 퀴즈를 통과한 뒤 연습문제를 풉니다. 데이터러너즈 유튜브의 개념 모션 영상은 제작되는 대로 레슨 안에 들어갑니다.

수강생은 브라우저에서 코드를 작성하고 바로 채점을 받고, 강사는 어드민 화면에서 제출 현황을 봅니다.

- **일일 학습**: 홈의 "오늘의 학습"이 매일 레슨 1개 + 연습문제로 3단계를 골라 줍니다(하루 동안 유지). 연속 학습일, 이번 주 학습한 날, 최근 16주 학습 잔디를 함께 보여주고, 트랙의 코스는 Day 1, Day 2 … 순서로 표시합니다.
- **과정**: 가입 코드 `QAQC8`로 들어오면 **QAQC 과정**(제조·품질 소재 문제), 그 외는 모두 **기본 데이터 과정**(일반 소재 문제). 화면에 과정 이름이나 전환 메뉴는 표시하지 않습니다.

- **설치 없음**: 파이썬은 [Pyodide](https://pyodide.org)로 브라우저 안에서 실행됩니다 (numpy 포함).
- **로그인**: 이름 + 4자리 번호. 5번 틀리면 5분 잠금.
- **정답 순위**: 처음 맞힌 순간 "n명 중 k번째" 알림과 폭죽. 전체 순위표는 공개하지 않습니다.
- **어드민**: 실시간 수업 모니터링(학습 중 · 지금 위치 · 막힌 문제), 학생별 전체 · 트랙별 진도율, 제출 코드와 실패 케이스, 문제별 정답률, 명단 등록과 번호 발급, CSV 내보내기.
- **서버 없음**: 정적 파일(GitHub Pages) + Supabase(무료 티어) 조합입니다.

## 구조

| 파일 | 역할 |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | 화면 (빌드 과정 없는 ES 모듈) |
| `content/index.js` | 트랙 · 코스 · 레슨 메타데이터, 과정(QAQC / 기본 데이터) 정의. 코스는 `unit` 번호로 문제와 이어진다 |
| `content/<track>/<lesson>.md` | 레슨 본문 (Markdown). ```` ```run ```` 펜스는 실행 셀, `::video{ref="dl-m01"}`은 영상 자리 |
| `content/videos.js`, `content/concepts.js` | 모션 영상 카탈로그(28편, `youtube_id`를 채우고 `status: "published"`로 바꾸면 레슨에 표시), 개념 태그 |
| `md.js` | 레슨 Markdown 렌더러 (외부 라이브러리 없음) |
| `problems.js` | 단원, 개념 노트, 문제(`domain: "mfg" | "general"`), 테스트케이스, 모범답안 |
| `problems-stats-ml.js` | 통계(유닛 12~16) · 머신러닝(유닛 17~20) 문제. scipy · scikit-learn 은 import 할 때 브라우저가 내려받습니다 (첫 실행 10~30초) |
| `problems-pb-more.js` | 파이썬 기초 추가 코스 문제: 컴프리헨션과 람다(유닛 21) · 예외 처리(유닛 22), 제조 문제 5개씩 |
| `problems-pb-general.js` | 파이썬 기초 1~11회차의 데이터 과정(일반 소재) 문제, 회차마다 N-6 · N-7 |
| `problems-da.js` | 파이썬 데이터분석 문제 (유닛 23~31: 브로드캐스팅 · pandas · 시계열 · matplotlib · seaborn). 그래프는 실행 결과에 이미지로 표시되고, seaborn은 처음 import 할 때 브라우저가 설치합니다 |
| `problems-stats-ml2.js` | 통계(유닛 32~34: 카이제곱 · ANOVA, 상관과 회귀, A/B 테스트) · 머신러닝(35~39: 교차검증, Pipeline, 비지도, 불균형, 모델 해석) 문제와 딥러닝(40~46) 개념 퀴즈. 딥러닝은 실습 문제 없이 개념 퀴즈만 있습니다 |
| `harness.py` | 채점기 (입출력형 / 함수형 / 단계 실습형) |
| `worker.js`, `runner.js` | Pyodide를 Web Worker에서 실행, 6초 넘으면 중단 |
| `api.js` | Supabase RPC 호출, 설정이 없으면 데모 모드(이 브라우저에만 저장) |
| `config.js` | Supabase 주소와 공개 키 |
| `supabase/schema.sql` | 테이블과 RPC 함수 |
| `supabase/migrations_*.sql` | 이미 운영 중인 프로젝트에 추가로 실행하는 변경분 |
| `scripts/verify.mjs` | 모범답안·시작 코드 검사 + 레슨 파일·영상 참조·실행 셀·체크 퀴즈 검사 |

## 처음 설정 (한 번만)

1. **Supabase 프로젝트 만들기**: supabase.com에서 New project.
2. **스키마 넣기**: 대시보드 > SQL Editor > New query에 `supabase/schema.sql` 전체를 붙여넣습니다. 맨 아래 `set_admin_password('...')`의 비밀번호를 바꾼 뒤 Run 합니다.
3. **키 복사**: Project Settings > API에서 Project URL과 `anon` `public` 키를 `config.js`에 넣습니다. `service_role` 키는 절대 넣지 마세요.
4. **배포**: 저장소 Settings > Pages > Source를 **GitHub Actions**로 바꾸면, `main`에 push할 때마다 검증 후 자동 배포됩니다.
5. **수강생 등록**: 사이트 하단 "강사 로그인" > 명단 · 번호 탭에서 이름을 붙여넣으면 번호가 발급됩니다. 번호는 그 화면에서 한 번만 보이니 CSV로 받아 두세요.

이미 운영 중인 프로젝트에 업데이트를 반영할 때는 `supabase/migrations_*.sql`을 날짜순으로 SQL Editor에서 실행합니다 (2026-11-03: 레슨 진도 `lesson_progress` → 일일 학습 `daily`).

어드민 비밀번호를 바꾸려면 SQL Editor에서 `select public.set_admin_password('새-비밀번호');`를 실행합니다.

## 로컬에서 보기

```bash
python3 -m http.server 8000   # http://localhost:8000
```

`config.js`가 비어 있으면 데모 모드입니다. 수강생 `체험학생` / `1234`, 어드민 비밀번호 `demo1234`.

## 레슨 추가

1. `content/index.js`의 코스에 레슨 항목(`id`, `title`, `minutes`, `concepts`, `quiz`)을 넣습니다. 코스가 `status: "planned"`이면 지웁니다.
2. `content/<track>/<lesson-id>.md`에 본문을 씁니다. 실행 셀은 그 자체로 돌아가고 `print()`로 무언가 출력해야 합니다 (검증 스크립트가 확인).
0. 먼저 `docs/lesson-plans/<track>.md`에 페이지 기획안을 씁니다 (작성 기준: `docs/lesson-plans/README.md`, 원본 원고: `docs/sources/`).
3. 영상은 관련 설명 바로 뒤에 `::video{ref="dl-mNN"}`로 넣습니다. 제작 전이면 화면에 표시되지 않고, `content/videos.js`에 `release_url`(유튜브 주소)이나 `youtube_id`를 채우면 그 자리에서 재생됩니다. `start`, `end`(초)로 구간을 지정할 수 있습니다.
4. 그림은 `::figure{src="content/img/<track>/<name>.svg" alt="..." caption="..."}`로 넣습니다. ML 도식은 `python3 scripts/figures_ml.py`로 다시 만듭니다.
5. 예제 데이터는 `pd.read_csv("titanic.csv")`처럼 파일 이름만 쓰면 됩니다. 브라우저에서는 코드에 이름이 보이면 `datasets/`에서 자동으로 받아 둡니다.

### 예제 데이터셋 (`datasets/`)

| 파일 | 내용 | 출처 · 라이선스 |
| --- | --- | --- |
| `titanic.csv` | 타이타닉 승객 891명 (생존 여부 등 15열) | seaborn-data 저장소 (mwaskom/seaborn-data) |
| `ai4i2020.csv` | 설비 1만 건의 센서 값과 고장 여부 (열 이름을 짧게 바꾸고 고장 유형 열은 뺌) | AI4I 2020 Predictive Maintenance Dataset, UCI Machine Learning Repository, CC BY 4.0 |

## 문제 추가

`problems.js`에 항목을 추가하고 `node scripts/verify.mjs`로 확인합니다 (python3, numpy · scipy · scikit-learn · pandas 필요). 기본 데이터 과정용 일반 소재 문제는 같은 `unit`에 `domain: "general"`로 넣습니다. 아직 없는 유닛은 제조 문제가 대신 보입니다.

- `type: "io"`: `tests: [{ stdin, expected, hidden? }]`. 출력은 줄 단위로 비교하고 줄 끝 공백은 무시합니다. `input()`의 안내 문구는 출력에 섞이지 않습니다.
- `type: "function"`: `tests: [{ args: [...], expected, hidden? }]`. `solution(*args)`의 반환값을 비교하고, 실수는 `tolerance`(기본 1e-6) 오차를 허용합니다.
- `type: "steps"`: `checks: [{ label, expr, hint }]`. 학생 코드를 실행한 뒤 변수로 검사식을 평가합니다. NumPy 배열은 출력 문자열 대신 `np.allclose`로 검사합니다.

## 알아둘 점

- 채점은 학생 브라우저에서 합니다. 비공개 테스트의 기대값도 내려받은 파일 안에 있어 마음먹으면 볼 수 있습니다. 성적에 반영하지 않는 복습용이라 이렇게 정했고, 평가용으로 쓰려면 서버 채점(예: Judge0)이 필요합니다.
- 4자리 번호는 경우의 수가 10,000개라 강한 비밀번호가 아닙니다. 잠금(5회 실패 시 5분)으로 대입을 늦추는 정도입니다.
- 수강생은 회원가입 탭에서 이름·4자리 번호·가입 코드로 직접 가입할 수 있습니다. 가입 코드는 어드민 > 명단에서 바꾸고, 비우면 누구나 가입할 수 있습니다.
- 기수가 바뀌면 Supabase 프로젝트를 새로 만들거나 `students` 테이블을 비우세요.
