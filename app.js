import { CONFIG } from "./config.js";
import { UNITS, PROBLEMS } from "./problems.js";
import { api, ApiError, DEMO_ADMIN_PASSWORD, resetDemo } from "./api.js";
import { runCode, gradeCode, preload, onRunnerState } from "./runner.js";

// ── 작은 도우미 ───────────────────────────────────────────
const $app = document.getElementById("app");
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const byId = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
const TYPE_LABEL = { io: "입출력형", function: "함수형", steps: "단계 실습형" };

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
      ? `<span class="who"><b>${esc(state.session.student.name)}</b> 님</span><button class="btn ghost small" data-act="logout">로그아웃</button>`
      : "";
  return `<header class="topbar"><div class="topbar-inner">
    <a class="brand" href="${admin ? "#/admin" : "#/"}"><span class="brand-mark">Py</span>
      <span><span class="brand-name">파이썬 복습장${admin ? " · 어드민" : ""}</span><br><span class="brand-course">${esc(CONFIG.COURSE_NAME)}</span></span></a>
    ${demo}<span class="spacer"></span>${right}
  </div></header>`;
}

function bindTopbar() {
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
  if (!state.session) return viewLogin();
  if (!state.progressLoaded) await loadProgress();
  if (!state.session) return;
  const m = hash.match(/^#\/p\/([\w-]+)/);
  if (m && byId[m[1]]) return viewProblem(byId[m[1]]);
  return viewHome();
}
window.addEventListener("hashchange", route);

// ── 로그인 ───────────────────────────────────────────────
function viewLogin() {
  const demo = api.mode === "demo"
    ? `<div class="demo-note"><b>데모 모드</b>입니다. 기록은 이 브라우저에만 저장됩니다. 이름 <code>체험학생</code>, 번호 <code>1234</code>로 들어가 보세요.</div>`
    : "";
  $app.innerHTML = `<main class="login-wrap"><form class="login panel" id="login-form" novalidate>
    <div><div class="eyebrow">${esc(CONFIG.COURSE_NAME)}</div><h1>파이썬 복습장</h1>
    <p class="lead">강사님께 받은 이름과 4자리 번호로 들어오세요.</p></div>
    ${demo}
    <div class="field"><label for="login-name">이름</label><input id="login-name" autocomplete="username" required maxlength="40"></div>
    <div class="field"><label for="login-pin">4자리 번호</label><input id="login-pin" class="pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="current-password" required></div>
    <p class="form-error" id="login-error"></p>
    <button class="btn primary" type="submit" id="login-btn">들어가기</button>
    <div class="login-foot"><span class="muted">번호를 잊었다면 강사님께 재발급을 요청하세요.</span><a href="#/admin">강사 로그인</a></div>
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

// ── 홈 (단원 목록) ────────────────────────────────────────
function statusPill(pid) {
  const p = state.progress[pid];
  if (!p) return `<span class="status none">미제출</span>`;
  if (p.solved) return `<span class="status solved">정답</span>`;
  return `<span class="status tried">시도 ${p.attempts}회</span>`;
}

function viewHome() {
  const solved = PROBLEMS.filter((p) => state.progress[p.id]?.solved).length;
  const pct = Math.round((solved / PROBLEMS.length) * 100);
  const units = UNITS.map((u) => {
    const list = PROBLEMS.filter((p) => p.unit === u.id);
    const done = list.filter((p) => state.progress[p.id]?.solved).length;
    const rows = list
      .map(
        (p) => `<li><a class="prow" href="#/p/${p.id}">
          <span class="pid">${p.id}</span>
          <span class="ptitle">${esc(p.title)}<span class="porigin">${esc(p.origin)}</span></span>
          <span class="tags"><span class="tag">${TYPE_LABEL[p.type]}</span>${levelDots(p.level)}</span>
          ${statusPill(p.id)}
        </a></li>`
      )
      .join("");
    return `<section class="unit">
      <div class="unit-head"><span class="unit-num">UNIT ${u.id}</span><h2>${esc(u.title)}</h2><span class="muted">${esc(u.summary)}</span>
      <span class="unit-count">${done} / ${list.length}</span></div>
      <ul class="plist panel">${rows}</ul></section>`;
  }).join("");
  $app.innerHTML = `${topbar()}<main class="page">
    <div class="hero"><div><div class="eyebrow">복습 문제</div><h1>오늘도 한 문제씩, 현장 데이터로</h1>
    <p>문제를 고르고 브라우저에서 바로 코드를 실행하고 제출하세요. 설치할 것은 없습니다.</p></div>
    <div class="meter"><div class="meter-label"><span>해결한 문제</span><b>${solved} / ${PROBLEMS.length}</b></div>
    <div class="meter-bar"><span style="width:${pct}%"></span></div></div></div>
    ${units}
  </main>`;
  bindTopbar();
  preload();
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
  return `<div class="meta-line"><span class="tag">${TYPE_LABEL[p.type]}</span>${levelDots(p.level)}<span class="muted" style="font-size:13px">원본: ${esc(p.origin)}</span></div>
    <h1>${p.id}. ${esc(p.title)}</h1>
    <div class="note">${p.desc}</div>
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
  const fire = (ratio, opts) => window.confetti({ origin: { y: 0.65 }, zIndex: 70, particleCount: Math.floor(220 * ratio), ...opts });
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  if (rank <= 3) {
    const end = Date.now() + 1400;
    (function frame() {
      window.confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, zIndex: 70 });
      window.confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, zIndex: 70 });
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
    <nav class="crumb"><a href="#/">문제 목록</a><span class="sep">/</span><span class="muted">UNIT ${unit.id} ${esc(unit.title)}</span>
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
    <nav class="admin-tabs">${tabs.map(([k, l]) => `<a href="#/admin/${k}" ${k === section ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
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
  if (section === "roster") return adminRoster(body).catch(fail);
  if (section === "stats") return adminStats(body).catch(fail);
  return adminMatrix(body).catch(fail);
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

async function loadAdminData() {
  const [roster, matrix] = await Promise.all([api.roster(state.adminToken), api.matrix(state.adminToken)]);
  const cells = {};
  for (const c of matrix.cells) cells[c.student_id + "|" + c.problem_id] = c;
  return { students: roster.students, cells, raw: matrix.cells };
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
  const { students } = await api.roster(state.adminToken);
  body.innerHTML = `<div class="roster-grid">
    <section class="panel card-pad"><h3>수강생 등록</h3>
      <p class="muted" style="margin:0;font-size:14px">한 줄에 한 명씩 이름을 붙여넣으세요. 등록하면 4자리 번호가 자동으로 발급됩니다. 번호는 이 화면에서 <b>한 번만</b> 보이니 바로 복사해 두세요.</p>
      <div class="field"><label for="names">이름 목록</label><textarea id="names" placeholder="홍길동&#10;김품질&#10;이검사"></textarea></div>
      <div><button class="btn primary" id="add-btn">등록하고 번호 발급</button></div>
      <div id="new-pins"></div>
    </section>
    <section class="panel card-pad"><div class="toolbar"><h3>등록된 수강생 ${students.length}명</h3></div>
      ${students.length ? `<div class="table-scroll"><table class="pin-list"><thead><tr><th>이름</th><th>등록일</th><th></th></tr></thead><tbody>
      ${students.map((s) => `<tr data-id="${s.id}"><td>${esc(s.name)}${s.locked ? '<span class="lock-chip">잠김</span>' : ""}</td><td class="muted">${fmtTime(s.created_at)}</td>
        <td class="act"><span class="pin-slot"></span> <button class="btn small" data-reset>번호 재발급</button> <button class="btn small danger" data-del>삭제</button></td></tr>`).join("")}
      </tbody></table></div>` : `<div class="empty-state">아직 없습니다. 왼쪽에 이름을 붙여넣어 등록하세요.</div>`}
      ${api.mode === "demo" ? `<div><button class="btn small ghost" id="reset-demo">데모 데이터 초기화</button></div>` : ""}
    </section></div>`;

  body.querySelector("#add-btn").addEventListener("click", async (e) => {
    const names = body.querySelector("#names").value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (!names.length) return toast("이름을 한 줄에 한 명씩 입력하세요.");
    e.target.disabled = true;
    try {
      const res = await api.addStudents(state.adminToken, names);
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

route();
