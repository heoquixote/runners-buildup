import { CONFIG } from "./config.js";
import { UNITS, PROBLEMS, TRACKS, PARTS } from "./problems.js";
import { api, ApiError, DEMO_ADMIN_PASSWORD, resetDemo } from "./api.js";
import { runCode, gradeCode, preload, onRunnerState } from "./runner.js";

// ── 작은 도우미 ───────────────────────────────────────────
const $app = document.getElementById("app");
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const byId = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
const TYPE_LABEL = { io: "입출력형", function: "함수형", steps: "단계 실습형", quiz: "개념 퀴즈" };

const store = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set(key, value) {
    try { value == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};
const SESSION_KEY = "qaqc-session";
const ADMIN_KEY = "qaqc-admin";
const draftKey = (sid, pid) => `qaqc-draft:${sid}:${pid}`;

// 코드 편집기 글자 크기
const FONT_STEPS = [0.9, 1, 1.15, 1.3, 1.5];
let fontScale = FONT_STEPS.includes(store.get("rb-font")) ? store.get("rb-font") : 1;
function applyFontScale() {
  document.documentElement.style.setProperty("--fs", fontScale);
  document.querySelectorAll("[data-font-label]").forEach((el) => (el.textContent = Math.round(fontScale * 100) + "%"));
  editor?.refresh();
}
function changeFont(dir) {
  const i = FONT_STEPS.indexOf(fontScale) + dir;
  if (i < 0 || i >= FONT_STEPS.length) return;
  fontScale = FONT_STEPS[i];
  store.set("rb-font", fontScale);
  applyFontScale();
}

let toastTimer;
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2600);
}

function fmtTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function pyRepr(v) {
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "string") return "'" + v.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
  if (Array.isArray(v)) return "[" + v.map(pyRepr).join(", ") + "]";
  if (typeof v === "object") return "{" + Object.entries(v).map(([k, x]) => `${pyRepr(k)}: ${pyRepr(x)}`).join(", ") + "}";
  return String(v);
}

function levelDots(n) {
  return `<span class="level" title="난이도 ${n}">${[1, 2, 3].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
}

function errorMessage(err) {
  const code = err instanceof ApiError ? err.code : "unknown";
  return (
    {
      invalid: "이름 또는 번호가 맞지 않습니다.",
      pin_format: "번호는 숫자 4자리입니다.",
      name_format: "이름은 1~40자로 입력하세요.",
      name_taken: "이미 가입된 이름입니다. 본인이면 로그인하고, 동명이인이면 이름 뒤에 숫자를 붙여 주세요 (예: 김민수2).",
      join_code: "가입 코드가 맞지 않습니다. 강사님이 알려 준 코드를 확인하세요.",
      code_format: "그룹 코드는 영문·숫자 30자 이내, 이름은 60자 이내로 입력하세요.",
      group_in_use: "이 그룹에 수강생이 있어 삭제할 수 없습니다. 수강생을 먼저 삭제하세요.",
      not_found: "대상을 찾을 수 없습니다. 새로고침 후 다시 시도하세요.",
      locked: "5번 틀려서 잠시 잠겼습니다. 5분 뒤에 다시 시도하거나 강사님께 번호 재발급을 요청하세요.",
      session: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
      network: "서버에 연결할 수 없습니다. 인터넷 연결을 확인하세요.",
      server: "서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.",
    }[code] || "알 수 없는 오류가 발생했습니다."
  );
}

// ── 상태 ─────────────────────────────────────────────────
const state = {
  session: store.get(SESSION_KEY), // {token, student:{id,name}}
  adminToken: store.get(ADMIN_KEY),
  progress: {},
  progressLoaded: false,
  adminGroup: store.get("rb-admin-group") ?? "", // "" 전체, "-" 그룹 없음, 그 외 그룹 코드
  groups: [],
  today: [],
  track: TRACKS.some((t) => t.id === store.get("rb-track")) ? store.get("rb-track") : "python",
  runner: "idle",
};
let editor = null;
let cleanupView = null;

onRunnerState((s) => {
  state.runner = s;
  const el = document.querySelector(".engine");
  if (el) renderEngine(el);
});

function renderEngine(el) {
  const label = { idle: "파이썬 준비 전", loading: "파이썬 불러오는 중… (처음 한 번만)", ready: "파이썬 준비됨", error: "파이썬을 불러오지 못했습니다. 새로고침해 주세요." }[state.runner];
  el.className = "engine " + (state.runner === "ready" ? "ready" : state.runner === "error" ? "error" : "");
  el.innerHTML = `<span class="dot"></span>${label}`;
}

async function loadProgress() {
  if (!state.session) return;
  try {
    const res = await api.me(state.session.token);
    state.progress = res.progress || {};
    if (res.student) {
      state.session.student = res.student;
      store.set(SESSION_KEY, state.session);
    }
    try { state.today = (await api.getToday(state.session.token)).ids || []; } catch { state.today = []; }
    state.progressLoaded = true;
  } catch (err) {
    if (err.code === "session") logout(true);
    else toast(errorMessage(err));
  }
}

function logout(expired) {
  state.session = null;
  state.progress = {};
  state.progressLoaded = false;
  store.set(SESSION_KEY, null);
  if (expired) toast("로그인이 만료되었습니다. 다시 로그인해 주세요.");
  location.hash = "#/";
  route();
}

// ── 공통 레이아웃 ─────────────────────────────────────────
function topbar({ admin = false } = {}) {
  const demo = api.mode === "demo" ? `<span class="mode-chip" title="이 브라우저에만 저장됩니다">데모 모드</span>` : "";
  const right = admin
    ? `<a class="btn ghost small" href="#/">수강생 화면</a><button class="btn small" data-act="admin-logout">어드민 로그아웃</button>`
    : state.session
      ? `<a class="btn ghost small" href="#/guide">사용 방법</a><span class="who"><b>${esc(state.session.student.name)}</b> 님</span><button class="btn ghost small" data-act="logout">로그아웃</button>`
      : `<a class="btn ghost small" href="#/guide">사용 방법</a>`;
  return `<header class="topbar"><div class="topbar-inner">
    <div class="brand-block">
      <a class="brand" href="${admin ? "#/admin" : "#/"}"><img class="brand-mark" src="assets/dl-logo.png" alt="Data Learners" width="40" height="35">
        <span><span class="brand-name">DATA LEARNERS${admin ? " · ADMIN" : ""}</span><br>${brandSub(admin)}</span></a>
    </div>
    ${demo}<span class="spacer"></span>${right}
  </div></header>`;
}

// 가입 코드별 표시: QAQC8 코드로 가입한 수강생은 로고 아래 줄이 기관·기수로 바뀐다
const GROUP_LOGOS = { QAQC8: "assets/sparta.png" };
function brandSub(admin) {
  const st = admin ? null : state.session?.student;
  if (!st?.org_label) return `<span class="brand-course">Runners Build-up · Python Track</span>`;
  const logo = GROUP_LOGOS[st.org] ? `<img src="${GROUP_LOGOS[st.org]}" alt="" width="14" height="14">` : "";
  return `<span class="brand-course org">${logo}${esc(st.org_label)}</span>`;
}

function bindTopbar() {
  $app.querySelectorAll("[data-font]").forEach((b) => b.addEventListener("click", () => changeFont(Number(b.dataset.font))));
  $app.querySelector('[data-act="logout"]')?.addEventListener("click", () => logout(false));
  $app.querySelector('[data-act="admin-logout"]')?.addEventListener("click", () => {
    state.adminToken = null;
    store.set(ADMIN_KEY, null);
    location.hash = "#/admin";
  });
}

// ── 라우팅 ───────────────────────────────────────────────
async function route() {
  if (cleanupView) { cleanupView(); cleanupView = null; }
  window.confetti?.reset?.();
  document.querySelector(".overlay, .drawer")?.remove();
  editor = null;
  const hash = location.hash || "#/";
  window.scrollTo(0, 0);
  if (hash.startsWith("#/admin")) return routeAdmin(hash);
  if (hash.startsWith("#/guide")) return viewGuide();
  if (!state.session) return hash.startsWith("#/signup") ? viewSignup() : viewLogin();
  if (!state.progressLoaded) await loadProgress();
  if (!state.session) return;
  const m = hash.match(/^#\/p\/([\w-]+)/);
  if (m && byId[m[1]]) return byId[m[1]].type === "quiz" ? viewQuiz(byId[m[1]]) : viewProblem(byId[m[1]]);
  const u = hash.match(/^#\/u\/(\d+)/);
  return viewHome(u ? Number(u[1]) : null);
}
window.addEventListener("hashchange", route);

// ── 로그인 ───────────────────────────────────────────────
function viewLogin() {
  const demo = api.mode === "demo"
    ? `<div class="demo-note"><b>데모 모드</b>입니다. 기록은 이 브라우저에만 저장됩니다. 이름 <code>체험학생</code>, 번호 <code>1234</code>로 들어가 보세요.</div>`
    : "";
  $app.innerHTML = `<main class="login-wrap"><form class="login panel lime" id="login-form" novalidate>
    ${authHead("login")}
    ${demo}
    <div class="field"><label for="login-name">이름</label><input id="login-name" autocomplete="username" required maxlength="40"></div>
    <div class="field"><label for="login-pin">4자리 번호</label><input id="login-pin" class="pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="current-password" required></div>
    <p class="form-error" id="login-error"></p>
    <button class="btn primary block" type="submit" id="login-btn">들어가기</button>
    <div class="login-foot"><span>번호를 잊었다면 강사님께 재발급을 요청하세요.</span><a href="#/admin">강사 로그인</a></div>
  </form></main>`;
  const form = $app.querySelector("#login-form");
  const pinInput = form.querySelector("#login-pin");
  pinInput.addEventListener("input", () => (pinInput.value = pinInput.value.replace(/\D/g, "").slice(0, 4)));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#login-name").value.trim();
    const pin = pinInput.value;
    const errEl = form.querySelector("#login-error");
    if (!name) return (errEl.textContent = "이름을 입력하세요.");
    if (!/^\d{4}$/.test(pin)) return (errEl.textContent = "번호는 숫자 4자리입니다.");
    const btn = form.querySelector("#login-btn");
    btn.disabled = true;
    errEl.textContent = "";
    try {
      const res = await api.login(name, pin);
      state.session = { token: res.token, student: res.student };
      store.set(SESSION_KEY, state.session);
      state.progressLoaded = false;
      preload();
      route();
    } catch (err) {
      errEl.textContent = errorMessage(err);
      btn.disabled = false;
    }
  });
  form.querySelector("#login-name").focus();
}

function authHead(active) {
  return `<div><img src="assets/dl-logo.png" alt="Data Learners" width="56" height="49" class="auth-mark"><div class="eyebrow">Data Learners · Python Track</div><h1>러너즈빌드업</h1>
    <p class="lead">QA/QC 실무 예제로 파이썬을 복습하고 바로 채점받으세요.</p></div>
    <nav class="login-switch" aria-label="로그인 또는 회원가입">
      <a href="#/" ${active === "login" ? 'aria-current="page"' : ""}>로그인</a>
      <a href="#/signup" ${active === "signup" ? 'aria-current="page"' : ""}>회원가입</a>
    </nav>`;
}

// ── 사용 방법 · 코드 작성법 ───────────────────────────────
const codeBlock = (code) => `<pre class="guide-code"><code>${esc(code)}</code></pre>`;
function viewGuide() {
  const back = state.session ? `<a class="btn small" href="#/">문제 목록으로</a>` : `<a class="btn small" href="#/">로그인하러 가기</a>`;
  $app.innerHTML = `${topbar()}<main class="page guide">
    <div class="hero"><div><div class="eyebrow">Guide</div><h1>사용 방법과 코드 작성법</h1>
      <p>문제는 세 가지 유형이 있습니다. 유형마다 답을 내는 방법이 다르니 처음 한 번만 읽어 보세요.</p></div>${back}</div>

    <nav class="guide-toc panel flat" aria-label="목차">
      <a href="#/guide" data-jump="g-use">사이트 사용법</a>
      <a href="#/guide" data-jump="g-io">입출력형</a>
      <a href="#/guide" data-jump="g-fn">함수형</a>
      <a href="#/guide" data-jump="g-steps">단계 실습형</a>
      <a href="#/guide" data-jump="g-mistakes">자주 하는 실수</a>
    </nav>

    <section class="panel lime guide-sec" id="g-use"><div class="eyebrow">01 · Basics</div><h2>사이트 사용법</h2>
      <div class="guide-grid">
        <div><h3>실행과 제출의 차이</h3>
          <ul><li><b>실행</b>: 코드를 돌려 출력만 보여 줍니다. 채점도 기록도 하지 않습니다.</li>
          <li><b>제출</b>: 공개 예시와 숨은 테스트로 채점하고, 결과가 강사님 화면에 기록됩니다.</li>
          <li>제출은 몇 번을 해도 괜찮습니다. 처음 정답을 맞힌 시각으로 순위가 정해집니다.</li></ul></div>
        <div><h3>입력값 넣어 보기</h3>
          <ul><li>입출력형은 편집기 아래 <b>실행할 때 넣을 입력값</b> 칸에 값을 적고 실행하면 <code>input()</code>이 그 값을 읽습니다.</li>
          <li><code>input()</code>을 여러 번 쓰면 한 줄에 하나씩 적으세요.</li></ul></div>
        <div><h3>단축키</h3>
          <ul><li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> 실행</li><li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> 제출</li>
          <li>Mac은 <kbd>Ctrl</kbd> 대신 <kbd>Cmd</kbd>도 됩니다.</li></ul></div>
        <div><h3>작성 중인 코드</h3>
          <ul><li>코드는 이 브라우저에 자동 저장됩니다. 다른 컴퓨터에서는 처음 코드로 보입니다.</li>
          <li><b>초기화</b>를 두 번 누르면 처음 코드로 돌아갑니다.</li></ul></div>
      </div>
    </section>

    <section class="panel guide-sec" id="g-io"><div class="eyebrow">02 · Input / Output</div><h2>입출력형: <code>input()</code>으로 읽고 <code>print()</code>로 출력</h2>
      <p>채점기가 입력값을 넣어 주고, 내 코드가 <b>화면에 출력한 글자</b>를 정답과 비교합니다.</p>
      <div class="guide-grid">
        <div><h3>정답 예시</h3>${codeBlock(`lot = int(input("로트 번호: "))   # 문자열 → 정수

if lot % 2 == 0:
    print("A라인 배정")
else:
    print("B라인 배정")`)}</div>
        <div><h3>꼭 지킬 것</h3>
          <ul><li><code>input()</code>은 항상 <b>문자열</b>을 돌려줍니다. 숫자로 계산하려면 <code>int()</code>나 <code>float()</code>로 바꾸세요.</li>
          <li>출력 문구는 문제의 <b>출력 형식과 글자 하나까지 같아야</b> 합니다. 띄어쓰기, 단위, 마침표를 확인하세요.</li>
          <li><code>input("안내 문구")</code>의 안내 문구는 채점에 포함되지 않으니 자유롭게 써도 됩니다.</li>
          <li>한 줄에 값이 여러 개면 <code>input().split()</code>으로 나눕니다.</li></ul>
          ${codeBlock(`a, b = map(int, input().split())   # "3 5" → 3, 5`)}</div>
      </div>
    </section>

    <section class="panel guide-sec" id="g-fn"><div class="eyebrow">03 · Function</div><h2>함수형: <code>solution</code> 함수가 답을 <code>return</code></h2>
      <p>프로그래머스와 같은 방식입니다. 채점기가 <code>solution(...)</code>을 여러 값으로 호출하고 <b>돌려준 값(return)</b>을 정답과 비교합니다.</p>
      <div class="guide-grid">
        <div><h3>정답 예시</h3>${codeBlock(`def solution(codes):
    # codes 예: ["OK", "NG", "OK"]
    count = 0
    for c in codes:
        if c == "NG":
            count += 1
    return count          # print가 아니라 return`)}</div>
        <div><h3>꼭 지킬 것</h3>
          <ul><li>함수 이름 <code>solution</code>과 매개변수는 <b>바꾸지 마세요</b>.</li>
          <li><code>print()</code>는 확인용일 뿐 채점되지 않습니다. 답은 반드시 <code>return</code>하세요.</li>
          <li><code>input()</code>은 쓰지 않습니다. 값은 매개변수로 들어옵니다.</li>
          <li>돌려주는 <b>자료형</b>도 맞아야 합니다. 리스트를 원하면 리스트로, 정수를 원하면 정수로 돌려주세요. 실수는 아주 작은 오차까지 허용합니다.</li>
          <li><b>실행</b>을 누르면 공개 예시 값으로 <code>solution</code>을 호출해 돌려준 값을 보여 줍니다.</li></ul></div>
      </div>
    </section>

    <section class="panel guide-sec" id="g-steps"><div class="eyebrow">04 · Steps</div><h2>단계 실습형: 정해진 <b>변수</b>에 값을 담기</h2>
      <p>NumPy 실습 문제입니다. 코드가 끝난 뒤 채점기가 <b>변수 이름으로 값을 꺼내</b> 단계별로 확인합니다. 출력 모양은 채점하지 않습니다.</p>
      <div class="guide-grid">
        <div><h3>정답 예시</h3>${codeBlock(`import numpy as np

defects = np.array([12, 8, 15, 10, 5])
production = np.array([1000, 1050, 980, 1020, 950])

total_defects = np.sum(defects)            # 1단계
daily_defect_rate = np.round(
    defects / production * 100, 2)         # 3단계`)}</div>
        <div><h3>꼭 지킬 것</h3>
          <ul><li>문제에 적힌 <b>변수 이름을 그대로</b> 쓰세요. <code>total_defect</code>처럼 한 글자만 달라도 오답입니다.</li>
          <li>처음 코드의 <code>0</code>, <code>None</code> 자리를 계산식으로 바꾸면 됩니다.</li>
          <li>단계마다 따로 채점되니, 맞힌 단계와 틀린 단계를 결과에서 확인하세요.</li>
          <li>NumPy는 처음 실행할 때 불러오느라 10초 정도 걸릴 수 있습니다.</li></ul></div>
      </div>
    </section>

    <section class="panel guide-sec" id="g-mistakes"><div class="eyebrow">05 · Troubleshooting</div><h2>자주 하는 실수</h2>
      <div class="table-scroll"><table class="ex-table guide-table"><thead><tr><th>오류 · 증상</th><th>원인</th><th>고치는 법</th></tr></thead><tbody>
        <tr><td><code>TypeError</code> ... str and int</td><td>input()으로 받은 문자열을 바로 계산</td><td><code>int(input())</code>로 변환</td></tr>
        <tr><td><code>ValueError</code> invalid literal</td><td><code>int("10.5")</code>처럼 소수를 정수로 변환</td><td><code>float()</code> 사용</td></tr>
        <tr><td><code>IndentationError</code></td><td>들여쓰기 칸 수가 맞지 않음</td><td><code>if</code>, <code>for</code>, <code>def</code> 아래는 스페이스 4칸</td></tr>
        <tr><td><code>EOFError</code></td><td>입력값보다 <code>input()</code>을 더 많이 호출</td><td>실행 입력값 칸에 줄 수를 맞추기</td></tr>
        <tr><td>출력은 맞는데 오답</td><td>띄어쓰기·단위·문장부호 차이</td><td>결과의 기대값과 내 출력을 한 글자씩 비교</td></tr>
        <tr><td>함수형인데 결과가 <code>None</code></td><td><code>return</code> 없이 <code>print</code>만 함</td><td>마지막에 <code>return 답</code></td></tr>
        <tr><td>6초가 지나 중단됨</td><td>반복문이 끝나지 않음</td><td><code>while</code> 조건이 언젠가 거짓이 되는지 확인</td></tr>
      </tbody></table></div>
    </section>
  </main>`;
  bindTopbar();
  $app.querySelectorAll("[data-jump]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );
}

// ── 회원가입 ─────────────────────────────────────────────
async function viewSignup() {
  $app.innerHTML = `<main class="login-wrap"><form class="login panel lime" id="signup-form" novalidate>
    ${authHead("signup")}
    <div class="field"><label for="su-name">이름</label><input id="su-name" autocomplete="name" required maxlength="40" placeholder="실명으로 입력하세요">
      <p class="hint-text">강사님이 제출 현황을 이 이름으로 확인합니다.</p></div>
    <div class="field"><label for="su-pin">4자리 번호 정하기</label><input id="su-pin" class="pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="new-password" required>
      <p class="hint-text">로그인할 때 쓰는 번호입니다. 잊지 않을 숫자로 정하세요.</p></div>
    <div class="field"><label for="su-pin2">번호 확인</label><input id="su-pin2" class="pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="new-password" required></div>
    <div class="field" id="su-code-field" hidden><label for="su-code">가입 코드</label><input id="su-code" autocomplete="off" maxlength="30" placeholder="수업 시간에 안내받은 코드">
      ${api.mode === "demo" ? '<p class="hint-text">데모 모드의 가입 코드는 <code>QAQC8</code>입니다.</p>' : ""}</div>
    <p class="form-error" id="su-error"></p>
    <button class="btn primary block" type="submit" id="su-btn">가입하고 시작하기</button>
    <div class="login-foot"><span>이미 가입했다면 로그인 탭에서 들어가세요.</span><a href="#/admin">강사 로그인</a></div>
  </form></main>`;
  const form = $app.querySelector("#signup-form");
  const pins = [form.querySelector("#su-pin"), form.querySelector("#su-pin2")];
  pins.forEach((el) => el.addEventListener("input", () => (el.value = el.value.replace(/\D/g, "").slice(0, 4))));
  form.querySelector("#su-name").focus();
  let needCode = true;
  api.signupInfo().then((res) => {
    needCode = !!res.join_code_required;
    form.querySelector("#su-code-field").hidden = !needCode;
  }).catch(() => (form.querySelector("#su-code-field").hidden = false));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = form.querySelector("#su-error");
    const name = form.querySelector("#su-name").value.trim();
    const [pin, pin2] = pins.map((el) => el.value);
    const code = form.querySelector("#su-code").value.trim();
    if (!name) return (errEl.textContent = "이름을 입력하세요.");
    if (!/^\d{4}$/.test(pin)) return (errEl.textContent = "번호는 숫자 4자리로 정하세요.");
    if (pin !== pin2) return (errEl.textContent = "번호 확인이 일치하지 않습니다.");
    if (needCode && !form.querySelector("#su-code-field").hidden && !code) return (errEl.textContent = "가입 코드를 입력하세요.");
    const btn = form.querySelector("#su-btn");
    btn.disabled = true;
    errEl.textContent = "";
    try {
      const res = await api.signup(name, pin, code);
      state.session = { token: res.token, student: res.student };
      store.set(SESSION_KEY, state.session);
      state.progressLoaded = false;
      preload();
      toast(`${res.student.name} 님, 가입을 환영합니다.`);
      location.hash = "#/";
      route();
    } catch (err) {
      errEl.textContent = errorMessage(err);
      btn.disabled = false;
    }
  });
}

// ── 홈 (단원 목록) ────────────────────────────────────────
function statusPill(pid) {
  const p = state.progress[pid];
  if (!p) return `<span class="status none">미제출</span>`;
  if (p.solved) return `<span class="status solved">정답</span>`;
  return `<span class="status tried">시도 ${p.attempts}회</span>`;
}

function todayHtml() {
  const picked = (state.today || []).filter((id) => byId[id]);
  // 강사가 정하지 않았으면 아직 안 푼 문제 5개를 순서대로 추천
  const ids = picked.length ? picked : PROBLEMS.filter((p) => !state.progress[p.id]?.solved).slice(0, 5).map((p) => p.id);
  if (!ids.length) return "";
  const done = ids.filter((id) => state.progress[id]?.solved).length;
  return `<section class="today" aria-labelledby="today-title">
    <div class="today-head"><div><div class="eyebrow">Today</div><h2 id="today-title">오늘 해야 할 과제입니다</h2>
      <p class="muted">${picked.length ? "강사님이 오늘 풀 문제로 골랐습니다." : "아직 풀지 않은 문제를 순서대로 골랐습니다."}</p></div>
      <div class="today-count"><b>${done}</b> / ${ids.length} 완료</div></div>
    <ol class="today-list">${ids.map((id, i) => {
      const p = byId[id];
      const solved = state.progress[id]?.solved;
      return `<li><a class="today-card panel${solved ? " done" : ""}" href="#/p/${id}">
        <span class="today-no">${String(i + 1).padStart(2, "0")}</span>
        <span class="pid">${id} · ${TYPE_LABEL[p.type]}</span>
        <span class="today-title">${esc(p.title)}</span>
        ${statusPill(id)}</a></li>`;
    }).join("")}</ol>
  </section>`;
}

const unitDone = (u) => {
  const list = PROBLEMS.filter((p) => p.unit === u.id);
  return [list.filter((p) => state.progress[p.id]?.solved).length, list.length];
};

// 왼쪽 내비게이션: 트랙(과목) 선택 + 회차별 유닛 바로가기
function sideNav() {
  const tracks = TRACKS.map((t) => `<button class="track-btn" role="tab" aria-selected="${t.id === state.track}" data-track="${t.id}">${esc(t.label)}${t.ready ? "" : '<span class="soon">준비 중</span>'}</button>`).join("");
  const parts = PARTS.filter((pt) => pt.track === state.track).map((pt) => {
    const units = UNITS.filter((u) => u.part === pt.id).map((u) => {
      const [done, total] = unitDone(u);
      return `<li><a href="#/u/${u.id}" data-unit="${u.id}"${done === total ? ' class="complete"' : ""}>
        <span class="side-no">${String(u.id).padStart(2, "0")}</span><span class="side-title">${esc(u.title)}</span><span class="side-count">${done}/${total}</span></a></li>`;
    }).join("");
    return `<div class="side-part">${esc(pt.label)}</div><ol class="side-units">${units}</ol>`;
  }).join("");
  return `<aside class="side-nav" aria-label="트랙과 유닛">
    <div class="track-switch" role="tablist" aria-label="트랙 선택">${tracks}</div>
    ${state.track === "python" ? `<a class="side-today" href="#/" data-jump="today">오늘의 과제</a>${parts}` : ""}
  </aside>`;
}

function unitSection(u) {
  const list = PROBLEMS.filter((p) => p.unit === u.id);
  const [done] = unitDone(u);
  const row = (p) => `<li><a class="prow${p.challenge ? " challenge" : ""}${p.type === "quiz" ? " quiz" : ""}" href="#/p/${p.id}">
        <span class="pid">${p.id}</span>
        <span class="ptitle">${esc(p.title)}<span class="porigin">${esc(p.type === "quiz" ? `${p.questions.length}문항 · ${p.origin}` : p.origin)}</span></span>
        <span class="tags">${p.challenge ? '<span class="tag challenge-tag">도전</span>' : ""}<span class="tag">${TYPE_LABEL[p.type]}</span>${levelDots(p.level)}</span>
        ${statusPill(p.id)}
      </a></li>`;
  const quiz = list.filter((p) => p.type === "quiz");
  const basic = list.filter((p) => p.type !== "quiz" && !p.challenge);
  const hard = list.filter((p) => p.challenge);
  const rows = (quiz.length ? `<li class="plist-sep quiz">개념 퀴즈 · 코드 없이 먼저 확인</li>${quiz.map(row).join("")}` : "")
    + `<li class="plist-sep">기본 문제</li>${basic.map(row).join("")}`
    + (hard.length ? `<li class="plist-sep challenge">도전 문제 · 단원을 마무리하는 어려운 문제</li>${hard.map(row).join("")}` : "");
  return `<section class="unit" id="unit-${u.id}">
    <div class="unit-head"><span class="unit-num">UNIT ${u.id}</span><h2>${esc(u.title)}</h2><span class="muted">${esc(u.summary)}</span>
    <span class="unit-count">${done} / ${list.length}</span></div>
    <ul class="plist panel">${rows}</ul></section>`;
}

function viewHome(focusUnit = null) {
  const track = TRACKS.find((t) => t.id === state.track);
  const solved = PROBLEMS.filter((p) => state.progress[p.id]?.solved).length;
  const pct = Math.round((solved / PROBLEMS.length) * 100);
  const body = state.track === "python"
    ? `${todayHtml()}${PARTS.filter((pt) => pt.track === "python").map((pt) =>
        `<div class="part-head"><span class="eyebrow">Part</span><h2>${esc(pt.label)}</h2></div>${UNITS.filter((u) => u.part === pt.id).map(unitSection).join("")}`).join("")}`
    : `<section class="panel soon-panel"><div class="eyebrow">${esc(track.label)} Track</div><h2>${esc(track.label)} 트랙은 준비 중입니다</h2>
        <p class="muted">문제가 준비되면 이곳에 유닛이 열립니다. 지금은 Python 트랙에서 빌드업을 이어 가세요.</p>
        <button class="btn primary" data-track="python">Python 트랙으로</button></section>`;
  $app.innerHTML = `${topbar()}<main class="page home-layout">
    ${sideNav()}
    <div class="home-main">
      <div class="hero"><div><div class="eyebrow">${esc(track.label)} Track</div><h1>${esc(state.session.student.name)}님, 오늘의 빌드업을 시작해 볼까요?</h1>
      <p>한 문제씩 쌓이면 실력이 됩니다. 현장 데이터로 만든 문제를 풀고 바로 채점받으세요.</p></div>
      <div class="meter"><div class="meter-label"><span>나의 빌드업</span><b>${solved} / ${PROBLEMS.length}</b></div>
      <div class="meter-bar"><span style="width:${pct}%"></span></div></div></div>
      ${body}
    </div>
  </main>`;
  bindTopbar();

  $app.querySelectorAll("[data-track]").forEach((b) => b.addEventListener("click", () => {
    state.track = b.dataset.track;
    store.set("rb-track", state.track);
    viewHome();
  }));
  const smooth = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const jump = (el) => el?.scrollIntoView({ behavior: smooth, block: "start" });
  $app.querySelectorAll(".side-nav [data-unit]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    jump(document.getElementById(`unit-${a.dataset.unit}`));
  }));
  $app.querySelector('[data-jump="today"]')?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: smooth });
  });

  // 지금 보고 있는 유닛을 왼쪽 메뉴에 표시
  const links = new Map([...$app.querySelectorAll(".side-nav [data-unit]")].map((a) => [`unit-${a.dataset.unit}`, a]));
  if (links.size && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((en) => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!hit) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      const a = links.get(hit.target.id);
      a?.setAttribute("aria-current", "true");
      a?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, { rootMargin: "-90px 0px -60% 0px" });
    $app.querySelectorAll(".unit[id]").forEach((el) => io.observe(el));
    cleanupView = () => io.disconnect();
  }
  if (focusUnit) requestAnimationFrame(() => document.getElementById(`unit-${focusUnit}`)?.scrollIntoView({ block: "start" }));
  preload();
}

// ── 개념 퀴즈 ────────────────────────────────────────────
const quizKey = (sid, pid) => `rb-quiz:${sid}:${pid}`;
// 단답형은 앞뒤 따옴표와 공백 차이를 무시하고 비교한다
const normAnswer = (v) => String(v ?? "").trim().replace(/^(['"])(.*)\1$/s, "$2").replace(/\s+/g, "");
function quizCorrect(q, a) {
  if (a === undefined || a === null || a === "") return false;
  if (q.kind === "ox") return a === q.answer;
  if (q.kind === "choice") return a === q.answer;
  const ok = Array.isArray(q.answer) ? q.answer : [q.answer];
  return ok.some((x) => normAnswer(x) === normAnswer(a));
}

function viewQuiz(p) {
  const unit = UNITS.find((u) => u.id === p.unit);
  const idx = PROBLEMS.indexOf(p);
  const prev = PROBLEMS[idx - 1];
  const next = PROBLEMS[idx + 1];
  const sid = state.session.student.id;
  let answers = store.get(quizKey(sid, p.id)) || {};
  let graded = false;

  $app.innerHTML = `${topbar()}<main class="page quiz-page">
    <nav class="crumb"><a href="#/u/${unit.id}">문제 목록</a><span class="sep">/</span><span class="muted">UNIT ${unit.id} ${esc(unit.title)}</span>
      <span class="nav">${prev ? `<a class="btn small" href="#/p/${prev.id}">← ${prev.id}</a>` : ""}${next ? `<a class="btn small" href="#/p/${next.id}">${next.id} →</a>` : ""}</span></nav>
    <header class="quiz-head">
      <div class="meta-line"><span class="tag">개념 퀴즈</span><span class="muted" style="font-size:13px">${esc(p.origin)}</span>${state.progress[p.id]?.solved ? '<span class="status solved">정답</span>' : ""}</div>
      <h1>${p.id}. ${esc(p.title)}</h1>
      <p class="muted">코드를 짜기 전에 개념을 확인합니다. 모두 맞히면 정답으로 기록되고, 틀린 문항은 해설을 보고 다시 풀 수 있습니다.</p>
      <details class="hint"><summary>개념 노트 보기</summary><div class="note">${unit.note}</div></details>
    </header>
    <ol class="quiz-list" id="quiz-list"></ol>
    <div class="quiz-actions panel"><span id="quiz-progress" class="muted"></span><span class="spacer"></span>
      <button class="btn" id="quiz-reset">다시 풀기</button><button class="btn primary" id="quiz-submit">채점하기</button></div>
  </main>`;
  bindTopbar();
  const listEl = $app.querySelector("#quiz-list");
  const progressEl = $app.querySelector("#quiz-progress");
  const submitBtn = $app.querySelector("#quiz-submit");

  const save = () => store.set(quizKey(sid, p.id), answers);
  const answered = () => p.questions.filter((_, i) => answers[i] !== undefined && answers[i] !== "").length;
  const updateProgress = () => {
    if (graded) return;
    progressEl.textContent = `${answered()} / ${p.questions.length} 문항 답함`;
  };

  function questionHtml(q, i) {
    const a = answers[i];
    const ok = graded ? quizCorrect(q, a) : null;
    let input;
    if (q.kind === "ox") {
      input = `<div class="ox" role="radiogroup">${[[true, "O"], [false, "X"]].map(([v, l]) =>
        `<button type="button" class="ox-btn" role="radio" aria-checked="${a === v}" data-i="${i}" data-v="${v}" ${graded ? "disabled" : ""}>${l}</button>`).join("")}</div>`;
    } else if (q.kind === "choice") {
      input = `<div class="choices">${q.options.map((o, k) =>
        `<label class="choice${graded && k === q.answer ? " right" : ""}${graded && a === k && k !== q.answer ? " wrong" : ""}"><input type="radio" name="q${i}" value="${k}" data-i="${i}" ${a === k ? "checked" : ""} ${graded ? "disabled" : ""}><span class="choice-no">${k + 1}</span><span>${esc(o)}</span></label>`).join("")}</div>`;
    } else {
      input = `<input class="short" type="text" data-i="${i}" value="${esc(a ?? "")}" placeholder="답을 입력하세요 (공백 차이는 무시)" autocomplete="off" spellcheck="false" ${graded ? "disabled" : ""}>`;
    }
    const answerText = q.kind === "ox" ? (q.answer ? "O" : "X") : q.kind === "choice" ? `${q.answer + 1}. ${q.options[q.answer]}` : (Array.isArray(q.answer) ? q.answer[0] : q.answer);
    const feedback = graded
      ? `<div class="quiz-feedback ${ok ? "ok" : "no"}"><b>${ok ? "✓ 정답" : `✗ 정답: ${esc(answerText)}`}</b><span>${esc(q.explain)}</span></div>`
      : "";
    return `<li class="quiz-q panel${graded ? (ok ? " ok" : " no") : ""}">
      <div class="quiz-q-head"><span class="quiz-no">Q${i + 1}</span><span class="tag">${{ ox: "OX", choice: "객관식", short: q.code ? "출력 예측" : "단답" }[q.kind]}</span></div>
      <p class="quiz-text">${esc(q.q)}</p>
      ${q.code ? `<pre class="guide-code"><code>${esc(q.code)}</code></pre>` : ""}
      ${input}${feedback}</li>`;
  }

  function render() {
    listEl.innerHTML = p.questions.map(questionHtml).join("");
    listEl.querySelectorAll(".ox-btn").forEach((b) => b.addEventListener("click", () => {
      answers[b.dataset.i] = b.dataset.v === "true";
      save();
      listEl.querySelectorAll(`.ox-btn[data-i="${b.dataset.i}"]`).forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      updateProgress();
    }));
    listEl.querySelectorAll('input[type="radio"]').forEach((r) => r.addEventListener("change", () => {
      answers[r.dataset.i] = Number(r.value);
      save();
      updateProgress();
    }));
    listEl.querySelectorAll("input.short").forEach((t) => {
      t.addEventListener("input", () => { answers[t.dataset.i] = t.value; save(); updateProgress(); });
      t.addEventListener("keydown", (e) => { if (e.key === "Enter") submitBtn.click(); });
    });
    updateProgress();
  }

  submitBtn.addEventListener("click", async () => {
    if (graded || submitBtn.disabled) return;
    const left = p.questions.length - answered();
    if (left && !submitBtn.dataset.confirm) {
      submitBtn.dataset.confirm = "1";
      submitBtn.textContent = `${left}문항이 비었어요. 그래도 채점`;
      return;
    }
    graded = true;
    const cases = p.questions.map((q, i) => ({ hidden: false, input: `Q${i + 1}. ${q.q}`, passed: quizCorrect(q, answers[i]) }));
    const passedCount = cases.filter((c) => c.passed).length;
    const result = { passed: passedCount === cases.length, passed_count: passedCount, total_count: cases.length, cases };
    render();
    progressEl.innerHTML = `<span class="verdict ${result.passed ? "pass" : "fail"}">${result.passed ? "모두 정답" : "다시 도전"}</span> <b>${passedCount} / ${cases.length}</b> 맞힘`;
    submitBtn.disabled = true;
    submitBtn.textContent = "채점 완료";
    listEl.querySelector(".quiz-q.no")?.scrollIntoView({ behavior: "smooth", block: "center" });
    try {
      const saved = await api.submit(state.session.token, p.id, JSON.stringify(answers), result);
      const prog = (state.progress[p.id] ||= { attempts: 0, solved: false });
      prog.attempts++;
      prog.solved ||= result.passed;
      if (saved.first_solve) celebrate(p, saved);
      else if (result.passed) toast("모두 맞혔습니다. 이미 맞힌 퀴즈라 순위는 그대로입니다.");
    } catch (err) {
      if (err.code === "session") return logout(true);
      toast("채점은 됐지만 기록을 저장하지 못했습니다. " + errorMessage(err));
    }
  });
  $app.querySelector("#quiz-reset").addEventListener("click", () => {
    graded = false;
    answers = {};
    save();
    submitBtn.disabled = false;
    delete submitBtn.dataset.confirm;
    submitBtn.textContent = "채점하기";
    render();
    window.scrollTo({ top: 0 });
  });
  render();
}

// ── 문제 풀이 ────────────────────────────────────────────
function examplesHtml(p) {
  const pub = (p.tests || []).filter((t) => !t.hidden);
  if (p.type === "io") {
    return `<div class="table-scroll"><table class="ex-table"><thead><tr><th>입력</th><th>출력</th></tr></thead><tbody>
      ${pub.map((t) => `<tr><td><pre>${esc(t.stdin) || '<span class="muted">(없음)</span>'}</pre></td><td><pre>${esc(t.expected) || '<span class="muted">(출력 없음)</span>'}</pre></td></tr>`).join("")}
      </tbody></table></div>`;
  }
  if (p.type === "function") {
    return `<div class="table-scroll"><table class="ex-table"><thead><tr><th>호출</th><th>반환값</th></tr></thead><tbody>
      ${pub.map((t) => `<tr><td><pre>solution(${esc(t.args.map(pyRepr).join(", "))})</pre></td><td><pre>${esc(pyRepr(t.expected))}</pre></td></tr>`).join("")}
      </tbody></table></div>`;
  }
  return `<div class="table-scroll"><table class="ex-table"><thead><tr><th>채점 단계</th></tr></thead><tbody>
    ${p.checks.map((c) => `<tr><td>${esc(c.label)}</td></tr>`).join("")}</tbody></table></div>`;
}

function problemTab(p) {
  const hidden = (p.tests || []).filter((t) => t.hidden).length;
  const solved = state.progress[p.id]?.solved;
  const hints = p.hints
    .map((h, i) => `<details class="hint"><summary>힌트 ${i + 1}</summary>${esc(h)}</details>`)
    .join("");
  const answer = solved
    ? `<details class="hint"><summary>모범 답안</summary><pre>${esc(p.solution)}</pre></details>`
    : `<div class="locked-answer">모범 답안은 정답을 맞히면 열립니다.</div>`;
  return `<div class="meta-line">${p.challenge ? '<span class="tag challenge-tag">도전 문제</span>' : ""}<span class="tag">${TYPE_LABEL[p.type]}</span>${levelDots(p.level)}<span class="muted" style="font-size:13px">원본: ${esc(p.origin)}</span></div>
    <h1>${p.id}. ${esc(p.title)}</h1>
    <div class="note">${p.desc}</div>
    ${p.uses?.length ? `<div class="uses"><h4>이 문제에서 쓰는 함수 · 문법</h4><dl>${p.uses.map(([k, v]) => `<div><dt><code>${esc(k)}</code></dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>` : ""}
    ${p.files ? `<div class="note files-box"><h4>제공 파일</h4><p class="muted" style="font-size:13px">코드를 실행하면 아래 파일이 같은 폴더에 준비됩니다. 비공개 테스트에서는 내용이 다른 파일로 채점합니다.</p>${Object.entries(p.files).map(([name, text]) => `<div class="file-card"><div class="file-name mono">${esc(name)}</div><pre>${esc(text)}</pre></div>`).join("")}</div>` : ""}
    <div class="note"><h4>${p.type === "steps" ? "채점 방식" : "입출력 예"}</h4>${examplesHtml(p)}
    ${hidden ? `<p class="muted" style="font-size:13px">제출하면 비공개 테스트 ${hidden}개가 더 채점됩니다.</p>` : ""}
    ${p.type === "io" ? `<p class="muted" style="font-size:13px">input()의 안내 문구는 채점에 영향을 주지 않습니다.</p>` : ""}</div>
    ${hints}${answer}`;
}

async function historyTab(p, body) {
  body.innerHTML = `<p class="muted">불러오는 중…</p>`;
  try {
    const res = await api.history(state.session.token, p.id);
    if (!res.items.length) {
      body.innerHTML = `<div class="empty-state">아직 제출 기록이 없습니다.<br>코드를 작성하고 제출하면 여기에 쌓입니다.</div>`;
      return;
    }
    body.innerHTML = res.items
      .map(
        (s, i) => `<div class="sub"><div class="sub-head">
          <span class="verdict ${s.passed ? "pass" : "fail"}">${s.passed ? "정답" : "오답"}</span>
          <span class="score">${s.passed_count}/${s.total_count}</span>
          <button class="btn ghost small" data-load="${i}">에디터로 불러오기</button>
          <span class="when">${fmtTime(s.created_at)}</span></div>
          <pre>${esc(s.code)}</pre></div>`
      )
      .join("");
    body.querySelectorAll("[data-load]").forEach((b) =>
      b.addEventListener("click", () => {
        editor?.setValue(res.items[+b.dataset.load].code);
        toast("에디터에 불러왔습니다.");
      })
    );
  } catch (err) {
    body.innerHTML = `<p class="form-error">${esc(errorMessage(err))}</p>`;
    if (err.code === "session") logout(true);
  }
}

function errorBox(e) {
  if (!e) return "";
  return `<div class="err-box"><div><span class="err-type">${esc(e.type)}</span>${e.line ? ` <span class="muted">· ${e.line}번째 줄</span>` : ""}</div>
    <div class="mono" style="font-size:13px">${esc(e.message)}</div>${e.hint ? `<div>${esc(e.hint)}</div>` : ""}</div>`;
}

function renderRun(res) {
  if (res.timeout) return timeoutHtml();
  const calls = (res.calls || [])
    .map((c) => `${c.call} → ${c.error ? c.error.type + ": " + c.error.message : c.result}`)
    .join("\n");
  const out = res.stdout || "";
  return `<div class="result-head"><h3>실행 결과</h3><span class="muted" style="font-size:13px">채점 없이 실행만 했습니다</span></div>
    <div class="result-body">
      <pre class="console ${out ? "" : "empty"}">${out ? esc(out) : "(출력 없음)"}</pre>
      ${calls ? `<div><div class="eyebrow" style="margin-bottom:4px">공개 예시로 solution 호출</div><pre class="console">${esc(calls)}</pre></div>` : ""}
      ${errorBox(res.error)}
    </div>`;
}

function timeoutHtml() {
  return `<div class="result-head"><h3>시간 초과</h3></div><div class="result-body"><div class="err-box">
    <div class="err-type">TimeoutError</div><div>실행이 너무 오래 걸려 멈췄습니다. 반복문이 끝나는 조건(break, range 범위)을 확인하세요.</div></div></div>`;
}

function renderGrade(res, p) {
  if (res.timeout) return timeoutHtml();
  const isStep = p.type === "steps";
  const cases = res.cases
    .map((c, i) => {
      const title = c.hidden ? `비공개 테스트 ${i + 1}` : `테스트 ${i + 1}`;
      let detail = "";
      if (!c.hidden && !isStep) {
        detail = `<div class="io-grid">
          <div><div class="k">입력</div><pre>${esc(c.input) || "(없음)"}</pre></div>
          <div><div class="k">기대 결과</div><pre>${esc(c.expected) || "(출력 없음)"}</pre></div>
          <div><div class="k">내 결과</div><pre>${esc(c.actual) || "(출력 없음)"}</pre></div></div>`;
      }
      const label = isStep ? esc(c.input) : title;
      return `<div class="case ${c.passed ? "ok" : "no"}"><div class="case-head"><span class="mark">${c.passed ? "✓" : "✗"}</span><span>${label}</span></div>
        ${!c.passed ? `<div class="case-body">${detail}${errorBox(c.error)}${c.note ? `<div class="case-note">${esc(c.note)}</div>` : ""}${c.hidden && !c.passed && !c.error && !c.note ? `<div class="muted">입력과 기대값은 공개되지 않습니다. 경계값(0, 같은 값, 빈 입력)을 생각해 보세요.</div>` : ""}</div>` : ""}
      </div>`;
    })
    .join("");
  const out = res.stdout ? `<details class="hint"><summary>출력 보기</summary><pre class="console">${esc(res.stdout)}</pre></details>` : "";
  return `<div class="result-head"><h3>채점 결과</h3><span class="verdict ${res.passed ? "pass" : "fail"}">${res.passed ? "정답" : "오답"}</span>
    <span class="score">${res.passed_count} / ${res.total_count} 통과</span></div>
    <div class="result-body">${errorBox(res.error)}<div class="cases">${cases}</div>${out}</div>`;
}

function celebrate(p, info) {
  const rank = info.rank;
  const total = Math.max(info.total, rank);
  const medal = rank <= 3 ? `r${rank}` : "";
  const sub =
    rank === 1 ? "가장 먼저 풀었습니다. 현장 감각이 좋네요." :
    rank <= 3 ? "상위권으로 통과했습니다." :
    `벌써 ${rank}명이 통과했습니다. 함께 완주해요.`;
  const idx = PROBLEMS.indexOf(p);
  const next = PROBLEMS[idx + 1];
  const wrap = document.createElement("div");
  wrap.className = "overlay";
  wrap.innerHTML = `<div class="celebrate" role="dialog" aria-modal="true" aria-labelledby="cel-title">
    <div class="medal ${medal}">${rank}</div>
    <h2 id="cel-title">정답입니다!</h2>
    <div class="rank-line"><b>${total}명</b> 중 <b>${rank}번째</b>로 맞혔어요</div>
    <p>${esc(sub)}</p>
    <div class="btns">${next ? `<a class="btn primary" href="#/p/${next.id}" data-close>다음 문제 ${next.id}</a>` : ""}<button class="btn" data-close>계속 보기</button></div>
  </div>`;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.addEventListener("click", (e) => { if (e.target === wrap || e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", function onKey(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); } });
  wrap.querySelector("[data-close]").focus();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || typeof window.confetti !== "function") return;
  const colors = ["#c8ff3d", "#a896ff", "#66dbff", "#61db9c", "#ffcf4a", "#f5f7f2"];
  const fire = (ratio, opts) => window.confetti({ origin: { y: 0.65 }, zIndex: 70, colors, particleCount: Math.floor(220 * ratio), ...opts });
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  if (rank <= 3) {
    const end = Date.now() + 1400;
    (function frame() {
      window.confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, zIndex: 70, colors });
      window.confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, zIndex: 70, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}

function viewProblem(p) {
  const unit = UNITS.find((u) => u.id === p.unit);
  const idx = PROBLEMS.indexOf(p);
  const prev = PROBLEMS[idx - 1];
  const next = PROBLEMS[idx + 1];
  const sid = state.session.student.id;
  const draft = store.get(draftKey(sid, p.id));
  const firstStdin = p.type === "io" ? (p.tests.find((t) => !t.hidden)?.stdin ?? "") : "";

  $app.innerHTML = `${topbar()}<main class="solve">
    <nav class="crumb"><a href="#/u/${unit.id}">문제 목록</a><span class="sep">/</span><span class="muted">UNIT ${unit.id} ${esc(unit.title)}</span>
      <span class="nav">${prev ? `<a class="btn small" href="#/p/${prev.id}">← ${prev.id}</a>` : ""}${next ? `<a class="btn small" href="#/p/${next.id}">${next.id} →</a>` : ""}</span></nav>
    <div class="solve-grid">
      <section class="read panel">
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" aria-selected="true" data-tab="problem">문제</button>
          <button class="tab" role="tab" aria-selected="false" data-tab="note">개념 노트</button>
          <button class="tab" role="tab" aria-selected="false" data-tab="history">내 제출</button>
        </div>
        <div class="read-body" id="read-body"></div>
      </section>
      <section class="write">
        <div class="panel editor-wrap">
          <div class="editor-head"><span class="mono">main.py</span><span class="spacer"></span>
            <span class="engine"></span>
            <div class="font-ctl" role="group" aria-label="코드 글자 크기"><button class="btn ghost small" data-font="-1" aria-label="코드 글자 작게">가−</button><span data-font-label>${Math.round(fontScale * 100)}%</span><button class="btn ghost small" data-font="1" aria-label="코드 글자 크게">가+</button></div>
            <button class="btn ghost small" id="reset-btn" title="시작 코드로 되돌리기">초기화</button></div>
          <textarea id="code"></textarea>
        </div>
        <div class="actions">
          ${p.type === "io" ? `<div class="stdin"><label for="stdin">실행할 때 넣을 입력값 (한 줄에 하나)</label><textarea id="stdin" spellcheck="false">${esc(firstStdin)}</textarea></div>` : `<div class="stdin"><span class="muted" style="font-size:13px">${p.type === "function" ? "실행하면 공개 예시로 solution을 호출해 봅니다." : "실행하면 print 출력을 확인할 수 있습니다."}</span></div>`}
          <div class="btns"><button class="btn" id="run-btn">▶ 실행</button><button class="btn primary" id="submit-btn">제출</button></div>
        </div>
        <section class="panel result" id="result"><div class="result-body"><p class="muted">실행은 결과만 보여주고 기록되지 않습니다. 제출하면 채점되고 기록이 남습니다. <span class="mono" style="font-size:12px">Ctrl+Enter</span> 실행 · <span class="mono" style="font-size:12px">Ctrl+Shift+Enter</span> 제출</p></div></section>
      </section>
    </div>
  </main>`;
  bindTopbar();
  renderEngine($app.querySelector(".engine"));

  const readBody = $app.querySelector("#read-body");
  const showTab = (name) => {
    $app.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
    if (name === "problem") readBody.innerHTML = problemTab(p);
    else if (name === "note") readBody.innerHTML = `<div class="eyebrow">UNIT ${unit.id}</div><h1>${esc(unit.title)}</h1><div class="note">${unit.note}</div>`;
    else historyTab(p, readBody);
  };
  $app.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));
  showTab("problem");

  editor = window.CodeMirror.fromTextArea($app.querySelector("#code"), {
    mode: "python",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity,
    extraKeys: {
      Tab: (cm) => (cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    ", "end")),
      "Shift-Tab": (cm) => cm.indentSelection("subtract"),
      "Ctrl-Enter": () => doRun(),
      "Cmd-Enter": () => doRun(),
      "Shift-Ctrl-Enter": () => doSubmit(),
      "Shift-Cmd-Enter": () => doSubmit(),
    },
  });
  editor.setValue(draft ?? p.starter);
  editor.setCursor(editor.lineCount(), 0);
  let saveTimer;
  editor.on("change", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.set(draftKey(sid, p.id), editor.getValue()), 400);
  });
  cleanupView = () => {
    clearTimeout(saveTimer);
    if (editor) store.set(draftKey(sid, p.id), editor.getValue());
  };

  const resultEl = $app.querySelector("#result");
  const runBtn = $app.querySelector("#run-btn");
  const submitBtn = $app.querySelector("#submit-btn");
  const resetBtn = $app.querySelector("#reset-btn");
  let resetArmed = false;
  resetBtn.addEventListener("click", () => {
    if (!resetArmed) {
      resetArmed = true;
      resetBtn.textContent = "정말 초기화?";
      setTimeout(() => { resetArmed = false; resetBtn.textContent = "초기화"; }, 3000);
      return;
    }
    editor.setValue(p.starter);
    resetArmed = false;
    resetBtn.textContent = "초기화";
    toast("시작 코드로 되돌렸습니다.");
  });

  const busy = (on, label) => {
    runBtn.disabled = submitBtn.disabled = on;
    if (on) resultEl.innerHTML = `<div class="result-body"><p class="muted">${label}</p></div>`;
  };

  async function doRun() {
    if (runBtn.disabled) return;
    busy(true, state.runner === "ready" ? "실행 중…" : "파이썬을 불러오는 중입니다. 처음 한 번은 몇 초 걸립니다…");
    try {
      const stdin = $app.querySelector("#stdin")?.value ?? "";
      resultEl.innerHTML = renderRun(await runCode(p, editor.getValue(), stdin));
    } catch (err) {
      resultEl.innerHTML = `<div class="result-body"><p class="form-error">실행하지 못했습니다: ${esc(err.message)}</p></div>`;
    } finally {
      busy(false);
    }
  }

  async function doSubmit() {
    if (submitBtn.disabled) return;
    busy(true, state.runner === "ready" ? "채점 중…" : "파이썬을 불러오는 중입니다. 처음 한 번은 몇 초 걸립니다…");
    const code = editor.getValue();
    try {
      const res = await gradeCode(p, code);
      resultEl.innerHTML = renderGrade(res, p);
      const result = res.timeout ? { passed: false, passed_count: 0, total_count: (p.tests || p.checks).length, cases: [] } : res;
      try {
        const saved = await api.submit(state.session.token, p.id, code, result);
        const prog = (state.progress[p.id] ||= { attempts: 0, solved: false });
        prog.attempts++;
        prog.solved ||= result.passed;
        if (saved.first_solve) {
          celebrate(p, saved);
          if ($app.querySelector('.tab[data-tab="problem"]')?.getAttribute("aria-selected") === "true") showTab("problem");
        } else if (result.passed) toast("정답입니다. 이미 맞힌 문제라 순위는 그대로입니다.");
      } catch (err) {
        if (err.code === "session") return logout(true);
        toast("채점은 됐지만 기록을 저장하지 못했습니다. " + errorMessage(err));
      }
    } catch (err) {
      resultEl.innerHTML = `<div class="result-body"><p class="form-error">채점하지 못했습니다: ${esc(err.message)}</p></div>`;
    } finally {
      busy(false);
    }
  }
  runBtn.addEventListener("click", doRun);
  submitBtn.addEventListener("click", doSubmit);
  preload();
}

// ── 어드민 ───────────────────────────────────────────────
function routeAdmin(hash) {
  if (!state.adminToken) return viewAdminLogin();
  const section = hash.split("/")[2] || "matrix";
  const tabs = [["matrix", "제출 현황"], ["roster", "명단 · 번호"], ["stats", "문제 통계"]];
  $app.innerHTML = `${topbar({ admin: true })}<main class="page wide">
    <div class="admin-bar"><nav class="admin-tabs">${tabs.map(([k, l]) => `<a href="#/admin/${k}" ${k === section ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
      <label class="group-select"><span>그룹</span><select id="group-select"><option value="">전체</option></select></label></div>
    <div id="admin-body"><p class="muted">불러오는 중…</p></div></main>`;
  bindTopbar();
  const body = $app.querySelector("#admin-body");
  const fail = (err) => {
    if (err.code === "session") {
      state.adminToken = null;
      store.set(ADMIN_KEY, null);
      toast("어드민 로그인이 만료되었습니다.");
      return viewAdminLogin();
    }
    body.innerHTML = `<p class="form-error">${esc(errorMessage(err))}</p>`;
  };
  const sel = $app.querySelector("#group-select");
  const run = () => {
    if (section === "roster") return adminRoster(body).catch(fail);
    if (section === "stats") return adminStats(body).catch(fail);
    return adminMatrix(body).catch(fail);
  };
  api.groups(state.adminToken).then((res) => {
    state.groups = res.groups || [];
    sel.innerHTML = `<option value="">전체</option>${state.groups.map((g) => `<option value="${esc(g.code)}">${esc(g.label)} (${esc(g.code)})</option>`).join("")}<option value="-">그룹 없음</option>`;
    if (state.adminGroup && ![...sel.options].some((o) => o.value === state.adminGroup)) state.adminGroup = "";
    sel.value = state.adminGroup;
    run();
  }).catch(fail);
  sel.addEventListener("change", () => {
    state.adminGroup = sel.value;
    store.set("rb-admin-group", sel.value);
    run();
  });
}

function viewAdminLogin() {
  const demo = api.mode === "demo" ? `<div class="demo-note"><b>데모 모드</b> 어드민 비밀번호는 <code>${DEMO_ADMIN_PASSWORD}</code>입니다.</div>` : "";
  $app.innerHTML = `<main class="login-wrap"><form class="login panel" id="admin-form" novalidate>
    <div><div class="eyebrow">강사 전용</div><h1>어드민 로그인</h1><p class="lead">제출 현황을 보고 수강생 번호를 관리합니다.</p></div>
    ${demo}
    <div class="field"><label for="admin-pw">어드민 비밀번호</label><input id="admin-pw" type="password" autocomplete="current-password"></div>
    <p class="form-error" id="admin-error"></p>
    <button class="btn primary" type="submit" id="admin-btn">로그인</button>
    <div class="login-foot"><a href="#/">수강생 로그인으로</a></div></form></main>`;
  const form = $app.querySelector("#admin-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("#admin-btn");
    btn.disabled = true;
    try {
      const res = await api.adminLogin(form.querySelector("#admin-pw").value);
      state.adminToken = res.token;
      store.set(ADMIN_KEY, res.token);
      route();
    } catch (err) {
      form.querySelector("#admin-error").textContent = err.code === "invalid" ? "비밀번호가 맞지 않습니다." : errorMessage(err);
      btn.disabled = false;
    }
  });
  form.querySelector("#admin-pw").focus();
}

const inGroup = (s) => !state.adminGroup || (state.adminGroup === "-" ? !s.group : s.group === state.adminGroup);
const groupLabel = (code) => state.groups.find((g) => g.code === code)?.label || code || "그룹 없음";

async function loadAdminData() {
  const [roster, matrix] = await Promise.all([api.roster(state.adminToken), api.matrix(state.adminToken)]);
  const students = roster.students.filter(inGroup);
  const ids = new Set(students.map((s) => s.id));
  const raw = matrix.cells.filter((c) => ids.has(c.student_id));
  const cells = {};
  for (const c of raw) cells[c.student_id + "|" + c.problem_id] = c;
  return { students, cells, raw };
}

function downloadCsv(filename, rows) {
  const csv = "﻿" + rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function adminMatrix(body) {
  const { students, cells, raw } = await loadAdminData();
  const today = new Date().toDateString();
  const todaySubs = raw.filter((c) => c.last_at && new Date(c.last_at).toDateString() === today).length;
  const solvedBy = (sid) => PROBLEMS.filter((p) => cells[sid + "|" + p.id]?.solved).length;
  const avgSolved = students.length ? (students.reduce((a, s) => a + solvedBy(s.id), 0) / students.length).toFixed(1) : "0";
  const active = new Set(raw.map((c) => c.student_id)).size;

  if (!students.length) {
    body.innerHTML = `<div class="panel empty-state"><b>아직 등록된 수강생이 없습니다.</b>명단 · 번호 탭에서 이름을 붙여넣으면 4자리 번호가 발급됩니다.<a class="btn primary" href="#/admin/roster">명단 등록하기</a></div>`;
    return;
  }
  const head = PROBLEMS.map((p, i) => `<th class="${i && PROBLEMS[i - 1].unit !== p.unit ? "unit-sep" : ""}" title="${esc(p.title)}">${p.id}</th>`).join("");
  const rows = students
    .map((s) => {
      const tds = PROBLEMS.map((p, i) => {
        const c = cells[s.id + "|" + p.id];
        const cls = c ? (c.solved ? "solved" : "tried") : "";
        const label = c ? (c.solved ? (c.attempts > 1 ? `✓${c.attempts}` : "✓") : c.attempts) : "·";
        const title = c ? `${s.name} · ${p.id} · ${c.solved ? "정답" : "미통과"} · 시도 ${c.attempts}회 · 최근 ${fmtTime(c.last_at)}` : `${s.name} · ${p.id} · 미제출`;
        return `<td class="${i && PROBLEMS[i - 1].unit !== p.unit ? "unit-sep" : ""}"><button class="cell ${cls}" title="${esc(title)}" data-s="${s.id}" data-p="${p.id}" ${c ? "" : "disabled"}>${label}</button></td>`;
      }).join("");
      return `<tr><th class="sname" scope="row">${esc(s.name)}</th><td class="ssum">${solvedBy(s.id)}</td>${tds}</tr>`;
    })
    .join("");

  body.innerHTML = `<div style="display:grid;gap:16px">
    <div class="kpis">
      <div class="panel kpi"><span class="k">수강생</span><span class="v">${students.length}명</span></div>
      <div class="panel kpi"><span class="k">한 번이라도 제출</span><span class="v">${active}명</span></div>
      <div class="panel kpi"><span class="k">1인 평균 해결</span><span class="v">${avgSolved} / ${PROBLEMS.length}</span></div>
      <div class="panel kpi"><span class="k">오늘 제출이 있었던 칸</span><span class="v">${todaySubs}</span></div>
    </div>
    <div class="toolbar"><div class="legend"><span><i style="background:var(--pass-soft);border:1px solid var(--pass)"></i>정답 (숫자 = 시도 횟수)</span>
      <span><i style="background:var(--fail-soft);border:1px solid var(--fail)"></i>미통과 (숫자 = 시도 횟수)</span><span>· 미제출</span></div>
      <span class="spacer"></span><button class="btn small" id="refresh">새로고침</button><button class="btn small" id="csv">CSV 내보내기</button></div>
    <div class="panel matrix-scroll"><table class="matrix"><thead><tr><th class="sname">이름</th><th>해결</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <p class="muted" style="font-size:13px">칸을 누르면 그 학생의 제출 코드와 실패한 케이스를 볼 수 있습니다.</p></div>`;

  body.querySelector("#refresh").addEventListener("click", () => routeAdmin("#/admin/matrix"));
  body.querySelector("#csv").addEventListener("click", () => {
    const header = ["이름", "해결 수", ...PROBLEMS.map((p) => `${p.id} ${p.title}`)];
    const lines = students.map((s) => [
      s.name,
      solvedBy(s.id),
      ...PROBLEMS.map((p) => {
        const c = cells[s.id + "|" + p.id];
        return c ? `${c.solved ? "정답" : "미통과"}(${c.attempts}회)` : "";
      }),
    ]);
    downloadCsv(`제출현황_${new Date().toISOString().slice(0, 10)}.csv`, [header, ...lines]);
  });
  body.querySelectorAll(".cell[data-s]").forEach((b) =>
    b.addEventListener("click", () => openSubmissionDrawer(students.find((s) => s.id === b.dataset.s), byId[b.dataset.p]))
  );
}

async function openSubmissionDrawer(student, p) {
  document.querySelector(".drawer")?.remove();
  const el = document.createElement("aside");
  el.className = "drawer";
  el.setAttribute("aria-label", "제출 상세");
  el.innerHTML = `<div class="drawer-head"><div><div class="eyebrow">${p.id} · ${esc(p.title)}</div><h3>${esc(student.name)}의 제출</h3></div><span class="spacer"></span><button class="btn small" data-close>닫기</button></div>
    <div class="drawer-body"><p class="muted">불러오는 중…</p></div>`;
  document.body.appendChild(el);
  const close = () => { el.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = (e) => e.key === "Escape" && close();
  document.addEventListener("keydown", onKey);
  el.querySelector("[data-close]").addEventListener("click", close);
  el.querySelector("[data-close]").focus();
  const bodyEl = el.querySelector(".drawer-body");
  try {
    const res = await api.submissions(state.adminToken, student.id, p.id);
    bodyEl.innerHTML = res.items
      .map((s, i) => {
        const fails = (s.case_results || []).filter((c) => !c.passed);
        return `<div class="sub"><div class="sub-head"><span class="mono">#${res.items.length - i}</span>
          <span class="verdict ${s.passed ? "pass" : "fail"}">${s.passed ? "정답" : "오답"}</span><span class="score">${s.passed_count}/${s.total_count}</span>
          <span class="when">${fmtTime(s.created_at)}</span></div><pre>${esc(s.code)}</pre>
          ${fails.length ? `<div class="fails">${fails.map((c) => `<div>✗ ${esc(c.input)}${c.error ? " → " + esc(c.error) : c.note ? " → " + esc(c.note) : c.actual ? " → 실제: " + esc(c.actual) : ""}</div>`).join("")}</div>` : ""}</div>`;
      })
      .join("") || `<p class="muted">제출이 없습니다.</p>`;
  } catch (err) {
    bodyEl.innerHTML = `<p class="form-error">${esc(errorMessage(err))}</p>`;
  }
}

async function adminRoster(body) {
  const students = (await api.roster(state.adminToken)).students.filter(inGroup);
  const g = state.adminGroup;
  const groupName = g ? (g === "-" ? "그룹 없음" : groupLabel(g)) : "";
  const pickGroup = `<p class="muted" style="margin:0;font-size:14px">위쪽 <b>그룹</b>에서 그룹을 먼저 고르세요.</p>`;
  body.innerHTML = `<div class="roster-grid"><div style="display:grid;gap:16px;align-content:start">
    <section class="panel lime card-pad"><h3>그룹 관리</h3>
      <p class="muted" style="margin:0;font-size:14px">그룹 코드가 곧 회원가입 코드입니다. 수강생이 가입할 때 넣은 코드로 그룹이 나뉘고, 로고 아래에 그룹 이름이 보입니다. 순위('n명 중 k번째')도 같은 그룹 안에서 매깁니다.</p>
      <div class="table-scroll"><table class="pin-list"><thead><tr><th>코드</th><th>표시 이름</th><th class="num">수강생</th><th></th></tr></thead><tbody>
      ${state.groups.map((x) => `<tr data-code="${esc(x.code)}"><td class="pin">${esc(x.code)}</td><td>${esc(x.label)}</td><td class="num">${x.count}명</td>
        <td class="act"><button class="btn small" data-edit-group>이름 수정</button> <button class="btn small danger" data-del-group>삭제</button></td></tr>`).join("") || `<tr><td colspan="4" class="muted">그룹이 없으면 누구나 코드 없이 가입할 수 있습니다.</td></tr>`}
      </tbody></table></div>
      <div class="toolbar group-form"><div class="field"><input id="g-code" maxlength="30" autocomplete="off" placeholder="코드 (예: QAQC9)" aria-label="그룹 코드"></div>
        <div class="field" style="flex:1"><input id="g-label" maxlength="60" autocomplete="off" placeholder="표시 이름 (예: Team Sparta · QAQC 9기)" aria-label="그룹 표시 이름"></div>
        <button class="btn primary" id="g-save">그룹 추가</button></div>
    </section>
    <section class="panel card-pad"><h3>오늘의 과제${groupName ? ` · ${esc(groupName)}` : ""}</h3>
      ${g ? `<p class="muted" style="margin:0;font-size:14px">이 그룹 수강생의 홈 맨 위에 '오늘 해야 할 과제'로 보입니다. 5문제를 권장하고, 하나도 고르지 않으면 각자 안 푼 문제 5개가 자동으로 보입니다.</p>` : pickGroup}
      <div class="today-pick">${UNITS.map((u) => `<fieldset><legend>UNIT ${u.id} ${esc(u.title)}</legend>${PROBLEMS.filter((p) => p.unit === u.id).map((p) => `<label><input type="checkbox" value="${p.id}"> <span class="mono">${p.id}</span> ${esc(p.title)}</label>`).join("")}</fieldset>`).join("")}</div>
      <div class="toolbar"><span class="muted" id="today-n" style="font-size:14px"></span><span class="spacer"></span><button class="btn small ghost" id="today-clear">모두 해제</button><button class="btn primary" id="today-save" ${g ? "" : "disabled"}>저장</button></div>
    </section>
    <section class="panel card-pad"><h3>수강생 직접 등록${groupName ? ` · ${esc(groupName)}` : ""}</h3>
      <p class="muted" style="margin:0;font-size:14px">한 줄에 한 명씩 이름을 붙여넣으세요. 등록하면 4자리 번호가 자동으로 발급되고 ${g && g !== "-" ? "이 그룹에 들어갑니다" : "그룹 없이 등록됩니다"}. 번호는 이 화면에서 <b>한 번만</b> 보이니 바로 복사해 두세요.</p>
      <div class="field"><label for="names">이름 목록</label><textarea id="names" placeholder="홍길동&#10;김품질&#10;이검사"></textarea></div>
      <div><button class="btn primary" id="add-btn">등록하고 번호 발급</button></div>
      <div id="new-pins"></div>
    </section></div>
    <section class="panel card-pad"><div class="toolbar"><h3>${groupName ? esc(groupName) + " · " : ""}등록된 수강생 ${students.length}명</h3></div>
      ${students.length ? `<div class="table-scroll"><table class="pin-list"><thead><tr><th>이름</th><th>그룹</th><th>등록일</th><th></th></tr></thead><tbody>
      ${students.map((s) => `<tr data-id="${s.id}"><td>${esc(s.name)}${s.locked ? '<span class="lock-chip">잠김</span>' : ""}</td><td class="muted">${esc(s.group || "–")}</td><td class="muted">${fmtTime(s.created_at)}</td>
        <td class="act"><span class="pin-slot"></span> <button class="btn small" data-reset>번호 재발급</button> <button class="btn small danger" data-del>삭제</button></td></tr>`).join("")}
      </tbody></table></div>` : `<div class="empty-state">아직 없습니다. 왼쪽에 이름을 붙여넣어 등록하세요.</div>`}
      ${api.mode === "demo" ? `<div><button class="btn small ghost" id="reset-demo">데모 데이터 초기화</button></div>` : ""}
    </section></div>`;

  const boxes = [...body.querySelectorAll(".today-pick input")];
  const countToday = () => {
    const n = boxes.filter((b) => b.checked).length;
    body.querySelector("#today-n").textContent = `${n}문제 선택${n > 5 ? " (5문제 권장)" : ""}`;
  };
  boxes.forEach((b) => b.addEventListener("change", countToday));
  const todayKey = g === "-" ? "" : g;
  if (!g) boxes.forEach((b) => (b.disabled = true));
  else api.adminGetToday(state.adminToken, todayKey).then((res) => { boxes.forEach((b) => (b.checked = (res.ids || []).includes(b.value))); countToday(); }).catch(() => {});
  countToday();
  body.querySelector("#today-clear").addEventListener("click", () => { boxes.forEach((b) => (b.checked = false)); countToday(); });
  body.querySelector("#today-save").addEventListener("click", async (e) => {
    e.target.disabled = true;
    try {
      const ids = boxes.filter((b) => b.checked).map((b) => b.value);
      await api.setToday(state.adminToken, ids, todayKey);
      toast(ids.length ? `오늘의 과제 ${ids.length}문제를 저장했습니다.` : "오늘의 과제를 비웠습니다. 수강생마다 안 푼 문제가 자동으로 보입니다.");
    } catch (err) {
      toast(errorMessage(err));
    } finally {
      e.target.disabled = false;
    }
  });

  body.querySelector("#g-save").addEventListener("click", async (e) => {
    const code = body.querySelector("#g-code").value;
    const label = body.querySelector("#g-label").value;
    e.target.disabled = true;
    try {
      const res = await api.saveGroup(state.adminToken, code, label);
      toast(`${res.label} (${res.code}) 그룹을 저장했습니다. 가입 코드는 ${res.code}입니다.`);
      routeAdmin("#/admin/roster");
    } catch (err) {
      toast(errorMessage(err));
      e.target.disabled = false;
    }
  });
  body.querySelectorAll("tr[data-code]").forEach((tr) => {
    const code = tr.dataset.code;
    tr.querySelector("[data-edit-group]").addEventListener("click", async () => {
      const cur = state.groups.find((x) => x.code === code);
      const label = prompt(`${code} 그룹의 표시 이름`, cur?.label || "");
      if (label == null) return;
      try {
        await api.saveGroup(state.adminToken, code, label);
        toast("그룹 이름을 바꿨습니다.");
        routeAdmin("#/admin/roster");
      } catch (err) {
        toast(errorMessage(err));
      }
    });
    const del = tr.querySelector("[data-del-group]");
    let armed = false;
    del.addEventListener("click", async () => {
      if (!armed) {
        armed = true;
        del.textContent = "정말 삭제?";
        setTimeout(() => { armed = false; del.textContent = "삭제"; }, 3000);
        return;
      }
      try {
        await api.deleteGroup(state.adminToken, code);
        toast(`${code} 그룹을 삭제했습니다.`);
        routeAdmin("#/admin/roster");
      } catch (err) {
        toast(errorMessage(err));
      }
    });
  });

  body.querySelector("#add-btn").addEventListener("click", async (e) => {
    const names = body.querySelector("#names").value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (!names.length) return toast("이름을 한 줄에 한 명씩 입력하세요.");
    e.target.disabled = true;
    try {
      const res = await api.addStudents(state.adminToken, names, g && g !== "-" ? g : null);
      const text = res.created.map((c) => `${c.name}\t${c.pin}`).join("\n");
      body.querySelector("#names").value = "";
      body.querySelector("#new-pins").innerHTML = `<div class="new-pins"><b>${res.created.length}명 등록 완료. 번호를 지금 복사해 두세요.</b>
        <table class="pin-list"><tbody>${res.created.map((c) => `<tr><td>${esc(c.name)}</td><td class="pin">${c.pin}</td></tr>`).join("")}</tbody></table>
        <div class="toolbar"><button class="btn small" id="copy-pins">이름·번호 복사</button><button class="btn small" id="csv-pins">CSV로 받기</button><a class="btn small ghost" href="#/admin/roster" id="done-pins">목록 새로고침</a></div></div>`;
      body.querySelector("#copy-pins").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(text); toast("복사했습니다. 엑셀에 붙여넣으면 두 칸으로 나뉩니다."); }
        catch { toast("복사하지 못했습니다. 표를 드래그해서 복사하세요."); }
      });
      body.querySelector("#csv-pins").addEventListener("click", () =>
        downloadCsv(`수강생번호_${new Date().toISOString().slice(0, 10)}.csv`, [["이름", "번호"], ...res.created.map((c) => [c.name, c.pin])])
      );
      body.querySelector("#done-pins").addEventListener("click", (ev) => { ev.preventDefault(); routeAdmin("#/admin/roster"); });
    } catch (err) {
      toast(errorMessage(err));
    } finally {
      e.target.disabled = false;
    }
  });

  body.querySelectorAll("tr[data-id]").forEach((tr) => {
    const id = tr.dataset.id;
    tr.querySelector("[data-reset]").addEventListener("click", async (e) => {
      e.target.disabled = true;
      try {
        const res = await api.resetPin(state.adminToken, id);
        tr.querySelector(".pin-slot").innerHTML = `<span class="pin">${res.pin}</span>`;
        tr.querySelector(".lock-chip")?.remove();
        toast(`${res.name} 님의 새 번호는 ${res.pin}입니다.`);
      } catch (err) {
        toast(errorMessage(err));
      } finally {
        e.target.disabled = false;
      }
    });
    const del = tr.querySelector("[data-del]");
    let armed = false;
    del.addEventListener("click", async () => {
      if (!armed) {
        armed = true;
        del.textContent = "제출까지 삭제됩니다. 확인";
        setTimeout(() => { armed = false; del.textContent = "삭제"; }, 4000);
        return;
      }
      try {
        await api.deleteStudent(state.adminToken, id);
        tr.remove();
        toast("삭제했습니다.");
      } catch (err) {
        toast(errorMessage(err));
      }
    });
  });

  body.querySelector("#reset-demo")?.addEventListener("click", () => {
    resetDemo();
    state.adminToken = null;
    store.set(ADMIN_KEY, null);
    toast("데모 데이터를 처음 상태로 되돌렸습니다.");
    route();
  });
}

async function adminStats(body) {
  const { students, raw } = await loadAdminData();
  const n = students.length || 1;
  const rows = PROBLEMS.map((p) => {
    const cs = raw.filter((c) => c.problem_id === p.id);
    const solved = cs.filter((c) => c.solved);
    return {
      p,
      tried: cs.length,
      solved: solved.length,
      rate: solved.length / n,
      avg: solved.length ? solved.reduce((a, c) => a + c.attempts, 0) / solved.length : null,
      stuck: cs.filter((c) => !c.solved).length,
    };
  }).sort((a, b) => a.rate - b.rate || b.stuck - a.stuck);
  body.innerHTML = `<div style="display:grid;gap:12px">
    <p class="muted" style="margin:0">정답률이 낮은 문제부터 보여줍니다. 정답률은 제출 건수가 아니라 <b>수강생 기준</b>(맞힌 학생 수 ÷ 전체 ${students.length}명)입니다. 평균 시도는 맞힌 학생이 정답까지 제출한 횟수입니다.</p>
    <div class="panel table-scroll"><table class="stats-table"><thead><tr><th>문제</th><th>정답률</th><th class="num">시도한 학생</th><th class="num">막힌 학생</th><th class="num">정답까지 평균 시도</th></tr></thead><tbody>
    ${rows.map((r) => `<tr><td><span class="mono muted">${r.p.id}</span> ${esc(r.p.title)}</td>
      <td><div class="rate"><div class="bar"><span class="${r.rate < 0.4 ? "low" : r.rate < 0.7 ? "mid" : ""}" style="width:${Math.round(r.rate * 100)}%"></span></div><b>${Math.round(r.rate * 100)}%</b></div></td>
      <td class="num">${r.tried}명</td><td class="num">${r.stuck}명</td><td class="num">${r.avg == null ? "–" : r.avg.toFixed(1) + "회"}</td></tr>`).join("")}
    </tbody></table></div></div>`;
}

applyFontScale();
route();
