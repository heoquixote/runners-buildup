// Worker를 감싸 실행/채점 요청을 Promise로 만든다. 제한 시간을 넘기면 Worker를 새로 띄운다.
import { CONFIG } from "./config.js";

const TIME_LIMIT_MS = 6000;
let worker = null;
let readyPromise = null;
let seq = 0;
const pending = new Map();
const listeners = new Set();

export function onRunnerState(fn) {
  listeners.add(fn);
}
function emit(state) {
  for (const fn of listeners) fn(state);
}

function boot() {
  emit("loading");
  worker = new Worker(`worker.js?pyodide=${encodeURIComponent(CONFIG.PYODIDE_URL)}`);
  readyPromise = new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "ready") {
        emit("ready");
        resolve();
      } else if (msg.type === "fatal") {
        emit("error");
        reject(new Error(msg.error));
      } else if (msg.type === "started") {
        const p = pending.get(msg.id);
        if (p) p.timer = setTimeout(() => timeout(msg.id), TIME_LIMIT_MS + (p.extra || 0));
      } else if (msg.type === "result") {
        const p = pending.get(msg.id);
        if (!p) return;
        clearTimeout(p.timer);
        pending.delete(msg.id);
        msg.error ? p.reject(new Error(msg.error)) : p.resolve(msg.result);
      }
    };
    worker.onerror = (e) => {
      emit("error");
      reject(new Error(e.message || "worker error"));
    };
  });
  return readyPromise;
}

function timeout(id) {
  const p = pending.get(id);
  if (!p) return;
  pending.delete(id);
  worker.terminate();
  worker = null;
  for (const other of pending.values()) other.reject(new Error("restart"));
  pending.clear();
  p.resolve({ timeout: true });
  boot().catch(() => {});
}

export function preload() {
  if (!worker) boot().catch(() => {});
  return readyPromise;
}

function send(kind, problem, code, stdin) {
  if (!worker) boot().catch(() => {});
  const id = ++seq;
  // numpy를 쓰는 문제는 첫 실행 때 패키지를 내려받으므로 여유 시간을 더 준다
  const usesNp = /\bnumpy\b/.test(code) || (problem.checks || []).some((c) => /\bnp\./.test(c.expr));
  const extra = usesNp ? 15000 : 0;
  return readyPromise.then(
    () =>
      new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject, extra });
        worker.postMessage({ id, kind, problem, code, stdin });
      })
  );
}

const spec = (p) => ({ type: p.type, tests: p.tests, checks: p.checks, tolerance: p.tolerance, files: p.files });
export const runCode = (problem, code, stdin) => send("run", spec(problem), code, stdin);
export const gradeCode = (problem, code) => send("grade", spec(problem), code);
