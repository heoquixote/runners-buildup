# 러너즈빌드업 (Runners Build-up)

과목별 트랙으로 실력을 쌓는 문제 풀이 사이트입니다. 첫 트랙은 파이썬(QAQC 8기)입니다.

QA/QC 실무 예제로 파이썬을 복습하는 문제 풀이 사이트입니다. 수강생은 브라우저에서 코드를 작성하고 바로 채점을 받고, 강사는 어드민 화면에서 제출 현황을 봅니다.

- **설치 없음**: 파이썬은 [Pyodide](https://pyodide.org)로 브라우저 안에서 실행됩니다 (numpy 포함).
- **로그인**: 이름 + 4자리 번호. 5번 틀리면 5분 잠금.
- **정답 순위**: 처음 맞힌 순간 "n명 중 k번째" 알림과 폭죽. 전체 순위표는 공개하지 않습니다.
- **어드민**: 명단 등록과 번호 발급, 학생 × 문제 제출 현황, 제출 코드와 실패 케이스, 문제별 정답률, CSV 내보내기.
- **서버 없음**: 정적 파일(GitHub Pages) + Supabase(무료 티어) 조합입니다.

## 구조

| 파일 | 역할 |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | 화면 (빌드 과정 없는 ES 모듈) |
| `problems.js` | 단원, 개념 노트, 문제, 테스트케이스, 모범답안 |
| `harness.py` | 채점기 (입출력형 / 함수형 / 단계 실습형) |
| `worker.js`, `runner.js` | Pyodide를 Web Worker에서 실행, 6초 넘으면 중단 |
| `api.js` | Supabase RPC 호출, 설정이 없으면 데모 모드(이 브라우저에만 저장) |
| `config.js` | Supabase 주소와 공개 키 |
| `supabase/schema.sql` | 테이블과 RPC 함수 |
| `scripts/verify.mjs` | 모든 모범답안이 통과하고 시작 코드는 통과하지 않는지 검사 |

## 처음 설정 (한 번만)

1. **Supabase 프로젝트 만들기**: supabase.com에서 New project.
2. **스키마 넣기**: 대시보드 > SQL Editor > New query에 `supabase/schema.sql` 전체를 붙여넣습니다. 맨 아래 `set_admin_password('...')`의 비밀번호를 바꾼 뒤 Run 합니다.
3. **키 복사**: Project Settings > API에서 Project URL과 `anon` `public` 키를 `config.js`에 넣습니다. `service_role` 키는 절대 넣지 마세요.
4. **배포**: 저장소 Settings > Pages > Source를 **GitHub Actions**로 바꾸면, `main`에 push할 때마다 검증 후 자동 배포됩니다.
5. **수강생 등록**: 사이트 하단 "강사 로그인" > 명단 · 번호 탭에서 이름을 붙여넣으면 번호가 발급됩니다. 번호는 그 화면에서 한 번만 보이니 CSV로 받아 두세요.

어드민 비밀번호를 바꾸려면 SQL Editor에서 `select public.set_admin_password('새-비밀번호');`를 실행합니다.

## 로컬에서 보기

```bash
python3 -m http.server 8000   # http://localhost:8000
```

`config.js`가 비어 있으면 데모 모드입니다. 수강생 `체험학생` / `1234`, 어드민 비밀번호 `demo1234`.

## 문제 추가

`problems.js`에 항목을 추가하고 `node scripts/verify.mjs`로 확인합니다 (python3, numpy 필요).

- `type: "io"`: `tests: [{ stdin, expected, hidden? }]`. 출력은 줄 단위로 비교하고 줄 끝 공백은 무시합니다. `input()`의 안내 문구는 출력에 섞이지 않습니다.
- `type: "function"`: `tests: [{ args: [...], expected, hidden? }]`. `solution(*args)`의 반환값을 비교하고, 실수는 `tolerance`(기본 1e-6) 오차를 허용합니다.
- `type: "steps"`: `checks: [{ label, expr, hint }]`. 학생 코드를 실행한 뒤 변수로 검사식을 평가합니다. NumPy 배열은 출력 문자열 대신 `np.allclose`로 검사합니다.

## 알아둘 점

- 채점은 학생 브라우저에서 합니다. 비공개 테스트의 기대값도 내려받은 파일 안에 있어 마음먹으면 볼 수 있습니다. 성적에 반영하지 않는 복습용이라 이렇게 정했고, 평가용으로 쓰려면 서버 채점(예: Judge0)이 필요합니다.
- 4자리 번호는 경우의 수가 10,000개라 강한 비밀번호가 아닙니다. 잠금(5회 실패 시 5분)으로 대입을 늦추는 정도입니다.
- 기수가 바뀌면 Supabase 프로젝트를 새로 만들거나 `students` 테이블을 비우세요.
