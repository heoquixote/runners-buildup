// 데이터 저장소. config.js 에 Supabase 주소가 있으면 Supabase RPC, 없으면
// 이 브라우저 localStorage 에 저장하는 데모 모드로 동작한다. 두 구현의
// 메서드와 반환 모양은 같다 (supabase/schema.sql 의 함수와 1:1).
import { CONFIG } from "./config.js";

class ApiError extends Error {
  constructor(code, extra = {}) {
    super(code);
    this.code = code;
    Object.assign(this, extra);
  }
}

function unwrap(res) {
  if (!res || res.ok === false) throw new ApiError(res?.error || "unknown", res || {});
  return res;
}

class SupabaseApi {
  constructor(url, key) {
    this.base = url.replace(/\/$/, "") + "/rest/v1/rpc/";
    this.key = key;
    this.mode = "supabase";
    // 레거시 anon 키(JWT)는 Authorization 에도 넣고, 새 publishable 키는 apikey 헤더만 쓴다
    this.headers = { apikey: key, "Content-Type": "application/json" };
    if (key.startsWith("eyJ")) this.headers.Authorization = `Bearer ${key}`;
  }
  async call(fn, args) {
    let response;
    try {
      response = await fetch(this.base + fn, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(args),
      });
    } catch {
      throw new ApiError("network");
    }
    if (!response.ok) throw new ApiError("server", { status: response.status });
    return unwrap(await response.json());
  }
  login(name, pin) { return this.call("student_login", { p_name: name, p_pin: pin }); }
  signup(name, pin, joinCode) { return this.call("student_signup", { p_name: name, p_pin: pin, p_join_code: joinCode }); }
  signupInfo() { return this.call("signup_info", {}); }
  me(token) { return this.call("student_me", { p_token: token }); }
  submit(token, problemId, code, result) {
    return this.call("student_submit", {
      p_token: token,
      p_problem_id: problemId,
      p_code: code,
      p_passed: result.passed,
      p_passed_count: result.passed_count,
      p_total_count: result.total_count,
      p_case_results: slimCases(result.cases),
    });
  }
  history(token, problemId) { return this.call("student_history", { p_token: token, p_problem_id: problemId }); }
  adminLogin(password) { return this.call("admin_login", { p_password: password }); }
  roster(token) { return this.call("admin_roster", { p_token: token }); }
  addStudents(token, names) { return this.call("admin_add_students", { p_token: token, p_names: names }); }
  resetPin(token, id) { return this.call("admin_reset_pin", { p_token: token, p_student_id: id }); }
  deleteStudent(token, id) { return this.call("admin_delete_student", { p_token: token, p_student_id: id }); }
  matrix(token) { return this.call("admin_matrix", { p_token: token }); }
  getJoinCode(token) { return this.call("admin_get_join_code", { p_token: token }); }
  setJoinCode(token, code) { return this.call("admin_set_join_code", { p_token: token, p_code: code }); }
  submissions(token, studentId, problemId) {
    return this.call("admin_submissions", { p_token: token, p_student_id: studentId, p_problem_id: problemId });
  }
}

// 어드민이 볼 실패 원인만 남겨 저장 용량을 줄인다
function slimCases(cases) {
  return (cases || []).map((c) => ({
    input: String(c.input ?? "").slice(0, 300),
    passed: c.passed,
    actual: String(c.actual ?? "").slice(0, 300),
    error: c.error ? `${c.error.type}: ${c.error.message}` : null,
    note: c.note || null,
  }));
}

// ── 데모 모드: 이 브라우저 안에서만 저장 ─────────────────────────
const DEMO_KEY = "qaqc-demo-db-v1";
const DEMO_ADMIN_PASSWORD = "demo1234";

class DemoApi {
  constructor() {
    this.mode = "demo";
  }
  load() {
    try {
      const raw = localStorage.getItem(DEMO_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seedDemo();
  }
  save(db) {
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(db));
    } catch {}
  }
  async login(name, pin) {
    const db = this.load();
    name = name.trim();
    if (!/^\d{4}$/.test(pin)) throw new ApiError("pin_format");
    const same = db.students.filter((s) => s.name === name);
    const lockedUntil = Math.max(0, ...same.map((s) => s.locked_until || 0));
    if (lockedUntil > Date.now()) throw new ApiError("locked", { until: new Date(lockedUntil).toISOString() });
    const student = same.find((s) => s.pin === pin);
    if (!student) {
      for (const s of same) {
        s.failed = (s.failed || 0) + 1;
        if (s.failed >= 5) {
          s.locked_until = Date.now() + 5 * 60 * 1000;
          s.failed = 0;
        }
      }
      this.save(db);
      throw new ApiError("invalid");
    }
    same.forEach((s) => { s.failed = 0; s.locked_until = null; });
    const token = crypto.randomUUID();
    db.sessions[token] = { student_id: student.id };
    this.save(db);
    return { ok: true, token, student: { id: student.id, name: student.name } };
  }
  async signupInfo() {
    return { ok: true, join_code_required: !!this.load().join_code };
  }
  async signup(name, pin, joinCode) {
    const db = this.load();
    name = name.trim().replace(/\s+/g, " ");
    if (!name || name.length > 40) throw new ApiError("name_format");
    if (!/^\d{4}$/.test(pin)) throw new ApiError("pin_format");
    if (db.join_code && (joinCode || "").trim().toUpperCase() !== db.join_code) throw new ApiError("join_code");
    if (db.students.some((s) => s.name === name)) throw new ApiError("name_taken");
    const id = crypto.randomUUID();
    db.students.push({ id, name, pin, created_at: new Date().toISOString() });
    const token = crypto.randomUUID();
    db.sessions[token] = { student_id: id };
    this.save(db);
    return { ok: true, token, student: { id, name } };
  }
  async getJoinCode(token) {
    const db = this.load();
    this.requireAdmin(db, token);
    return { ok: true, join_code: db.join_code || "" };
  }
  async setJoinCode(token, code) {
    const db = this.load();
    this.requireAdmin(db, token);
    db.join_code = (code || "").trim().toUpperCase().slice(0, 30);
    this.save(db);
    return { ok: true, join_code: db.join_code };
  }
  studentOf(db, token) {
    const s = db.sessions[token];
    if (!s || s.admin) throw new ApiError("session");
    return s.student_id;
  }
  async me(token) {
    const db = this.load();
    const sid = this.studentOf(db, token);
    const student = db.students.find((s) => s.id === sid);
    if (!student) throw new ApiError("session");
    const progress = {};
    for (const sub of db.submissions.filter((x) => x.student_id === sid)) {
      const p = (progress[sub.problem_id] ||= { attempts: 0, solved: false });
      p.attempts++;
      p.solved ||= sub.passed;
    }
    return { ok: true, student: { id: sid, name: student.name }, progress };
  }
  async submit(token, problemId, code, result) {
    const db = this.load();
    const sid = this.studentOf(db, token);
    const mine = db.submissions.filter((x) => x.student_id === sid && x.problem_id === problemId);
    const already = mine.some((x) => x.passed);
    const now = new Date().toISOString();
    db.submissions.push({
      id: Date.now() + Math.random(),
      student_id: sid,
      problem_id: problemId,
      code,
      passed: result.passed,
      passed_count: result.passed_count,
      total_count: result.total_count,
      case_results: slimCases(result.cases),
      created_at: now,
    });
    this.save(db);
    if (!result.passed || already) return { ok: true, first_solve: false };
    const firsts = {};
    for (const s of db.submissions.filter((x) => x.problem_id === problemId && x.passed)) {
      if (!firsts[s.student_id] || s.created_at < firsts[s.student_id]) firsts[s.student_id] = s.created_at;
    }
    const rank = Object.values(firsts).filter((t) => t <= firsts[sid]).length;
    return { ok: true, first_solve: true, rank, total: db.students.length };
  }
  async history(token, problemId) {
    const db = this.load();
    const sid = this.studentOf(db, token);
    const items = db.submissions
      .filter((x) => x.student_id === sid && x.problem_id === problemId)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 30);
    return { ok: true, items };
  }
  async adminLogin(password) {
    if (password !== DEMO_ADMIN_PASSWORD) throw new ApiError("invalid");
    const db = this.load();
    const token = crypto.randomUUID();
    db.sessions[token] = { admin: true };
    this.save(db);
    return { ok: true, token };
  }
  requireAdmin(db, token) {
    if (!db.sessions[token]?.admin) throw new ApiError("session");
  }
  async roster(token) {
    const db = this.load();
    this.requireAdmin(db, token);
    const students = db.students
      .map((s) => ({ id: s.id, name: s.name, created_at: s.created_at, locked: (s.locked_until || 0) > Date.now() }))
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return { ok: true, students };
  }
  newPin(db, name) {
    let pin;
    do pin = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    while (db.students.some((s) => s.name === name && s.pin === pin));
    return pin;
  }
  async addStudents(token, names) {
    const db = this.load();
    this.requireAdmin(db, token);
    const created = [];
    for (let name of names) {
      name = name.trim();
      if (!name) continue;
      const pin = this.newPin(db, name);
      const id = crypto.randomUUID();
      db.students.push({ id, name, pin, created_at: new Date().toISOString() });
      created.push({ id, name, pin });
    }
    this.save(db);
    return { ok: true, created };
  }
  async resetPin(token, id) {
    const db = this.load();
    this.requireAdmin(db, token);
    const s = db.students.find((x) => x.id === id);
    if (!s) throw new ApiError("not_found");
    s.pin = this.newPin(db, s.name);
    s.failed = 0;
    s.locked_until = null;
    for (const [t, v] of Object.entries(db.sessions)) if (v.student_id === id) delete db.sessions[t];
    this.save(db);
    return { ok: true, name: s.name, pin: s.pin };
  }
  async deleteStudent(token, id) {
    const db = this.load();
    this.requireAdmin(db, token);
    db.students = db.students.filter((s) => s.id !== id);
    db.submissions = db.submissions.filter((s) => s.student_id !== id);
    this.save(db);
    return { ok: true };
  }
  async matrix(token) {
    const db = this.load();
    this.requireAdmin(db, token);
    const cells = {};
    for (const s of db.submissions) {
      const key = s.student_id + "|" + s.problem_id;
      const c = (cells[key] ||= { student_id: s.student_id, problem_id: s.problem_id, attempts: 0, solved: false, first_solved_at: null, last_at: null });
      c.attempts++;
      if (s.passed) {
        c.solved = true;
        if (!c.first_solved_at || s.created_at < c.first_solved_at) c.first_solved_at = s.created_at;
      }
      if (!c.last_at || s.created_at > c.last_at) c.last_at = s.created_at;
    }
    return { ok: true, cells: Object.values(cells) };
  }
  async submissions(token, studentId, problemId) {
    const db = this.load();
    this.requireAdmin(db, token);
    const items = db.submissions
      .filter((x) => x.student_id === studentId && x.problem_id === problemId)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return { ok: true, items };
  }
}

// 데모용 예시 명단. 실제 수강생 데이터가 아니다.
function seedDemo() {
  const names = ["체험학생", "예시 김품질", "예시 이검사", "예시 박공정"];
  const pins = ["1234", "1111", "2222", "3333"];
  const now = Date.now();
  const students = names.map((name, i) => ({
    id: "demo-" + i,
    name,
    pin: pins[i],
    created_at: new Date(now - 86400000).toISOString(),
  }));
  const submissions = [];
  const add = (sid, pid, passed, minsAgo) =>
    submissions.push({
      id: submissions.length + 1,
      student_id: sid,
      problem_id: pid,
      code: "# 예시 제출",
      passed,
      passed_count: passed ? 4 : 2,
      total_count: 4,
      case_results: [],
      created_at: new Date(now - minsAgo * 60000).toISOString(),
    });
  add("demo-1", "1-1", true, 50);
  add("demo-2", "1-1", false, 48);
  add("demo-2", "1-1", true, 45);
  add("demo-3", "1-1", true, 40);
  add("demo-1", "1-2", true, 35);
  add("demo-3", "1-5", false, 30);
  add("demo-3", "1-5", false, 28);
  return { students, sessions: {}, submissions, join_code: "QAQC8" };
}

export function resetDemo() {
  try {
    localStorage.removeItem(DEMO_KEY);
  } catch {}
}

export const api = CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY
  ? new SupabaseApi(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : new DemoApi();

export { ApiError, DEMO_ADMIN_PASSWORD };
