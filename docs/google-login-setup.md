# 구글 로그인 설정 가이드

러너즈빌드업에 "Google로 계속하기" 버튼을 켜기 위한 설정입니다. 코드는 이미 들어가 있고, 아래 4단계만 직접 하시면 됩니다. 순서대로 하시는 게 안전합니다 (1 → 2 → 3 → 4).

> 버튼은 Supabase에서 Google Provider를 켜야만 화면에 나타납니다. 설정 전에 PR을 머지해도 지금 화면은 그대로입니다.

## 한눈에 보는 입력값

| 어디에 | 무엇을 | 값 |
|---|---|---|
| Google Cloud · 승인된 리디렉션 URI | 1개 | `https://wffcaraiaoliwpmyqmmq.supabase.co/auth/v1/callback` |
| Google Cloud · 승인된 JavaScript 원본 | 3개 | `https://www.data-learners.com`<br>`https://data-learners.com`<br>`https://heoquixote.github.io` |
| Supabase · Site URL | 1개 | `https://www.data-learners.com/runners-buildup/` |
| Supabase · Redirect URLs | 3개 | `https://www.data-learners.com/runners-buildup/**`<br>`https://data-learners.com/runners-buildup/**`<br>`https://heoquixote.github.io/runners-buildup/**` |

구글이 돌려보내는 곳은 사이트가 아니라 **Supabase 주소 하나**(`.../auth/v1/callback`)입니다. 그다음 Supabase가 학생이 처음 있던 사이트(github.io 또는 data-learners.com)로 다시 보내 주는데, 그 목록이 Supabase의 Redirect URLs입니다. 그래서 배포 주소 2곳은 Google이 아니라 Supabase 쪽에 넣습니다.

---

## 1단계. SQL 실행 (1분)

1. Supabase 대시보드 → 프로젝트 `wffcaraiaoliwpmyqmmq` → **SQL Editor** → **New query**
2. 저장소의 `supabase/migrations_2026-11-21_google_login.sql` 전체를 붙여넣고 **Run**
3. 이어서 `supabase/migrations_2026-11-21_optional_join_code.sql`(가입 코드 선택), `supabase/migrations_2026-11-21_password.sql`(4자리 번호 → 비밀번호)도 같은 방법으로 차례로 실행합니다.
4. `Success. No rows returned`가 나오면 끝입니다. 여러 번 실행해도 안전합니다.

이 SQL이 하는 일: 학생 표에 구글 계정 연결 칸(`auth_user_id`, `email`)을 추가하고, 구글 로그인용 함수 3개(`google_login`, `google_signup`, `google_link`)를 만듭니다. 기존 학생과 기록은 바뀌지 않습니다.

## 2단계. Google Cloud에서 OAuth 클라이언트 만들기 (10분)

1. https://console.cloud.google.com 접속 → 왼쪽 위 프로젝트 선택 → **새 프로젝트** (이름 예: `runners-buildup`) → 만들기
2. 검색창에 **Google Auth Platform** 입력 → 들어가서 **시작하기**
   - 앱 이름: `러너즈빌드업`
   - 사용자 지원 이메일: 본인 메일
   - 대상(Audience): **외부(External)**
   - 연락처 이메일: 본인 메일 → 동의 → 만들기
3. 왼쪽 **대상(Audience)** 메뉴 → **앱 게시(Publish app)** → 확인
   - 이걸 안 하면 "테스트 사용자"로 등록한 계정만 로그인됩니다.
   - 이메일 · 이름 · 프로필 사진만 쓰므로 구글 심사는 필요 없습니다.
4. 왼쪽 **클라이언트(Clients)** → **클라이언트 만들기**
   - 애플리케이션 유형: **웹 애플리케이션**
   - 이름: `runners-buildup web`
   - **승인된 JavaScript 원본** → URI 추가 3번
     - `https://www.data-learners.com`
     - `https://data-learners.com`
     - `https://heoquixote.github.io`
   - **승인된 리디렉션 URI** → URI 추가 1번
     - `https://wffcaraiaoliwpmyqmmq.supabase.co/auth/v1/callback`
   - **만들기**
5. 뜨는 창의 **클라이언트 ID**와 **클라이언트 보안 비밀번호(Client secret)**를 복사해 둡니다.
   - 보안 비밀번호는 Supabase 대시보드에만 붙여넣고, 저장소·채팅·config.js에는 넣지 마세요.

## 3단계. Supabase에서 Google 켜기 (3분)

1. Supabase 대시보드 → **Authentication** → **Sign In / Providers** (예전 화면은 Providers)
2. 목록에서 **Google** → **Enable Sign in with Google** 켜기
3. **Client IDs**에 2단계의 클라이언트 ID, **Client Secret (for OAuth)**에 보안 비밀번호 붙여넣기 → **Save**
   - 화면에 보이는 Callback URL이 `https://wffcaraiaoliwpmyqmmq.supabase.co/auth/v1/callback`인지 확인합니다 (2단계에 넣은 값과 같아야 합니다).
4. 같은 Authentication 메뉴에서 **URL Configuration**
   - **Site URL**: `https://www.data-learners.com/runners-buildup/`
   - **Redirect URLs** → **Add URL**로 3개 추가
     - `https://www.data-learners.com/runners-buildup/**`
     - `https://data-learners.com/runners-buildup/**`
     - `https://heoquixote.github.io/runners-buildup/**`
   - **Save**
5. 같은 Authentication 설정에서 **Allow new users to sign up**이 켜져 있는지 확인합니다 (기본값 켜짐). 꺼져 있으면 처음 오는 구글 사용자가 막힙니다.

## 4단계. 머지 후 확인 (3분)

1. PR 머지 → GitHub Actions 배포가 끝날 때까지 1~2분 기다립니다.
2. 시크릿 창으로 `https://www.data-learners.com/runners-buildup/#/login` 접속 → **Google로 계속하기** 버튼이 보이면 3단계까지 정상입니다.
3. 버튼을 눌러 구글 계정 선택 → 사이트로 돌아와 **가입 마무리** 화면(이름 · 가입 코드)이 나오면 정상입니다.
4. `heoquixote.github.io/runners-buildup/`에서도 한 번 해 봅니다.
5. 어드민 → 명단에서 구글로 가입한 학생 이름 옆에 파란 **Google** 표시가 붙습니다 (마우스를 올리면 이메일).

---

## 학생 입장에서 어떻게 동작하나요

| 상황 | 흐름 |
|---|---|
| 처음 구글로 온 학생 | Google 버튼 → 구글 계정 선택 → **가입 마무리** 화면에서 이름 입력, 가입 코드는 선택 → 가입 완료. 코드를 비우면 기본 데이터 과정, QAQC8이면 QAQC 과정 (이름 + 비밀번호 회원가입도 같은 규칙) |
| 이미 이름 + 비밀번호로 가입한 학생 | Google 버튼 → 가입 마무리 화면 아래 **기존 계정에 구글 연결하기** → 이름 + 비밀번호 → 연결. 기록은 그대로이고, 다음부터는 구글 버튼만 누르면 됩니다 |
| 구글로 가입한 뒤 다시 올 때 | Google 버튼 → 바로 로그인 (보던 문제가 있었다면 그 문제로 돌아갑니다) |
| 구글 가입자가 비밀번호 로그인도 원할 때 | 어드민 → 명단 → **비밀번호 재발급**을 누르면 임시 비밀번호가 생겨 두 방식 모두 쓸 수 있습니다 |

이름은 지금처럼 사이트 전체에서 겹칠 수 없습니다. 이미 있는 이름을 쓰면 "이미 가입된 이름" 안내가 나오고, 본인이면 아래 "기존 계정에 구글 연결하기"를 쓰면 됩니다.

## 자주 생기는 문제

| 증상 | 원인 · 해결 |
|---|---|
| Google 버튼이 안 보임 | 3단계의 Google Provider가 꺼져 있거나 저장이 안 됨 |
| 구글 화면에 `redirect_uri_mismatch` | 2단계 리디렉션 URI 오타. `https://wffcaraiaoliwpmyqmmq.supabase.co/auth/v1/callback` 정확히 (끝에 `/` 없음) |
| 로그인 뒤 엉뚱한 주소(Site URL)로 감 | 3단계 Redirect URLs에 그 배포 주소가 빠짐 |
| "이 앱은 테스트 중" / 특정 계정만 됨 | 2단계 3번 **앱 게시**를 안 함 |
| 돌아온 뒤 "서버 오류" | 1단계 SQL을 실행하지 않음 (`migrations_2026-11-21_password.sql` 포함) |
| "구글 인증 시간이 지났습니다" | 가입 마무리 화면을 1시간 넘게 열어 둠. Google 버튼을 다시 누르면 됩니다 |

## 구조 메모 (개발용)

- 구글 인증만 Supabase Auth(PKCE)에 맡기고, 돌아오면 받은 access token으로 `google_login()`을 불러 **기존과 같은 `sessions` 토큰**을 받습니다. 이후 진도 · 제출 · 메달 · 어드민은 이름 + 비밀번호 로그인과 완전히 같은 경로를 탑니다. Supabase Auth 세션은 저장하지 않습니다.
- `students.auth_user_id`(unique)가 구글 계정 ↔ 학생 행을 1:1로 잇습니다. 구글 가입자는 `pin_hash`가 null이라 비밀번호 로그인이 되지 않습니다.
- 구글 함수는 `authenticated` 역할(구글 JWT)에만 열려 있고 anon 키로는 부를 수 없습니다.
- 버튼 표시 여부는 `GET /auth/v1/settings`의 `external.google`로 판단합니다. 데모 모드(Supabase 미설정)에서는 숨깁니다.
- 어드민에서 학생을 삭제해도 Supabase Auth 사용자는 남습니다. 그 구글 계정으로 다시 오면 가입 마무리 화면부터 다시 시작합니다.
