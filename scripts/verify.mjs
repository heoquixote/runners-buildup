// 모든 문제의 모범답안이 채점을 통과하고, 시작 코드는 통과하지 않는지 확인한다.
// 사용법: node scripts/verify.mjs   (python3 와 numpy 필요)
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { PROBLEMS, UNITS } from "../problems.js";
import { TRACKS, COURSES, LESSONS, lessonPath } from "../content/index.js";
import { VIDEOS } from "../content/videos.js";
import { CONCEPTS } from "../content/concepts.js";
import { extract } from "../md.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// 예제 데이터셋(titanic.csv 등): 하네스가 작업 폴더에 연결한다 (브라우저에서는 worker.js 가 받아 둔다)
const DATASETS = path.join(root, "datasets");
const pyEnv = { ...process.env, RB_DATASETS: DATASETS, MPLBACKEND: "Agg" };
const py = `
import json, sys
sys.path.insert(0, ${JSON.stringify(root)})
import harness
problems = json.load(sys.stdin)
out = []
for p in problems:
    spec = {k: p.get(k) for k in ("type", "tests", "checks", "tolerance", "files") if p.get(k) is not None}
    good = harness.grade(spec, p["solution"])
    bad = harness.grade(spec, p["starter"])
    out.append({"id": p["id"], "solution": good, "starter_passed": bad["passed"]})
print(json.dumps(out, ensure_ascii=False))
`;
// 개념 퀴즈는 브라우저에서 채점하므로 형식만 확인한다.
let failed = 0;
const badQuestions = (questions) => questions.filter((x) =>
  !x.q || !x.explain ||
  (x.kind === "ox" && typeof x.answer !== "boolean") ||
  (x.kind === "choice" && !(Number.isInteger(x.answer) && x.options?.[x.answer] !== undefined)) ||
  (x.kind === "short" && !(typeof x.answer === "string" || (Array.isArray(x.answer) && x.answer.length))) ||
  (x.kind === "write" && !(x.solution && (typeof x.expect === "string" || (Array.isArray(x.expect) && x.expect.length)))) ||
  !["ox", "choice", "short", "write"].includes(x.kind));
const quizzes = PROBLEMS.filter((p) => p.type === "quiz");
for (const q of quizzes) {
  const bad = badQuestions(q.questions);
  if (bad.length) failed++;
  console.log(`${bad.length ? "FAIL" : "PASS"}  ${q.id}  퀴즈 ${q.questions.length}문항${bad.length ? "  형식 오류: " + bad.map((x) => x.q).join(" / ") : ""}`);
}
// 코드 작성형 문항: 예시 답안을 실제로 돌려 기대 출력과 같은지, 요구 문법(must)을 쓰는지, 처음 코드(given)는 통과하지 않는지
const normAnswer = (v) => String(v ?? "").trim().replace(/^(['"])(.*)\1$/s, "$2").replace(/\s+/g, "");
const writeQs = [
  ...quizzes.flatMap((p) => p.questions.map((q, i) => ({ where: `${p.id} Q${i + 1}`, q }))),
  ...LESSONS.flatMap((l) => (l.quiz || []).map((q, i) => ({ where: `${l.id} Q${i + 1}`, q }))),
].filter((x) => x.q.kind === "write");
const pyRun = `
import json, sys, io, contextlib
out = []
for code in json.load(sys.stdin):
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(code, {"__name__": "__main__"})
        out.append({"stdout": buf.getvalue()})
    except Exception as e:
        out.append({"stdout": buf.getvalue(), "error": repr(e)})
print(json.dumps(out, ensure_ascii=False))
`;
const codes = writeQs.flatMap(({ q }) => [q.solution, q.given ? q.given + "\n" : ""]);
const ran = JSON.parse(execFileSync("python3", ["-c", pyRun], { input: JSON.stringify(codes), encoding: "utf8", cwd: DATASETS, env: pyEnv }));
writeQs.forEach(({ where, q }, k) => {
  const expects = Array.isArray(q.expect) ? q.expect : [q.expect];
  const match = (r, code) => !r.error && expects.some((x) => normAnswer(x) === normAnswer(r.stdout)) && (q.must || []).every((re) => new RegExp(re).test(code));
  const good = ran[2 * k], bad = ran[2 * k + 1];
  const problems = [];
  if (!match(good, q.solution)) problems.push(`예시 답안 실패 (출력 ${JSON.stringify(good.stdout)}${good.error ? " " + good.error : ""})`);
  if (match(bad, q.given ? q.given + "\n" : "")) problems.push("처음 코드가 그대로 정답 처리됨");
  if (problems.length) { failed++; console.log(`FAIL  ${where}  코드 작성: ${problems.join(", ")}`); }
});
console.log(`PASS  코드 작성 문항 ${writeQs.length}개 확인`);
for (const p of PROBLEMS) {
  if (p.domain && !["mfg", "general"].includes(p.domain)) { failed++; console.log(`FAIL  ${p.id}  domain 값이 이상함: ${p.domain}`); }
}

// 커리큘럼: 코스 → 유닛, 레슨 파일, 개념 태그, 영상 참조, 실행 셀, 체크 퀴즈
const trackIds = new Set(TRACKS.map((t) => t.id));
const videoIds = new Set(VIDEOS.map((v) => v.id));
const unitIds = new Set(UNITS.map((u) => u.id));
const checkConcepts = (where, list) => {
  const bad = (list || []).filter((k) => !CONCEPTS[k]);
  if (bad.length) { failed++; console.log(`FAIL  ${where}  모르는 개념 태그: ${bad.join(", ")}`); }
};
for (const c of COURSES) {
  if (!trackIds.has(c.track)) { failed++; console.log(`FAIL  ${c.id}  모르는 트랙: ${c.track}`); }
  if (c.unit && !unitIds.has(c.unit)) { failed++; console.log(`FAIL  ${c.id}  unit ${c.unit} 에 해당하는 문제 유닛이 없음`); }
  if (c.status !== "planned" && !c.lessons.length) { failed++; console.log(`FAIL  ${c.id}  열린 코스인데 레슨이 없음`); }
  checkConcepts(c.id, c.concepts);
}
const dupUnit = COURSES.filter((c) => c.unit).map((c) => c.unit).filter((u, i, a) => a.indexOf(u) !== i);
if (dupUnit.length) { failed++; console.log(`FAIL  한 유닛이 여러 코스에 연결됨: ${dupUnit.join(", ")}`); }
for (const v of VIDEOS) {
  if (!trackIds.has(v.track)) { failed++; console.log(`FAIL  ${v.id}  모르는 트랙: ${v.track}`); }
  checkConcepts(v.id, v.concepts);
  if (v.status === "published" && !v.youtube_id) { failed++; console.log(`FAIL  ${v.id}  공개 상태인데 youtube_id 가 없음`); }
}
const lessonIds = LESSONS.map((l) => l.id);
const dupLesson = lessonIds.filter((id, i) => lessonIds.indexOf(id) !== i);
if (dupLesson.length) { failed++; console.log("FAIL  중복 레슨 id: " + dupLesson.join(", ")); }
const runCells = [];
for (const l of LESSONS) {
  const file = path.join(root, lessonPath(l));
  checkConcepts(l.id, l.concepts);
  const badQ = badQuestions(l.quiz || []);
  if (badQ.length) { failed++; console.log(`FAIL  ${l.id}  체크 퀴즈 형식 오류: ${badQ.map((x) => x.q).join(" / ")}`); }
  if (!fs.existsSync(file)) { failed++; console.log(`FAIL  ${l.id}  레슨 파일 없음: ${lessonPath(l)}`); continue; }
  const { runs, videos, figures } = extract(fs.readFileSync(file, "utf8"));
  const badV = videos.filter((v) => !videoIds.has(v.ref));
  if (badV.length) { failed++; console.log(`FAIL  ${l.id}  모르는 영상 참조: ${badV.map((v) => v.ref).join(", ")}`); }
  const badF = figures.filter((f) => !f.src || !fs.existsSync(path.join(root, f.src)) || !f.alt);
  if (badF.length) { failed++; console.log(`FAIL  ${l.id}  그림 파일 없음 또는 alt 없음: ${badF.map((f) => f.src).join(", ")}`); }
  runs.forEach((code, i) => runCells.push({ id: `${l.id}#${i + 1}`, code }));
  console.log(`PASS  ${l.id}  레슨 (실행 셀 ${runs.length}, 영상 ${videos.length}, 그림 ${figures.length}, 퀴즈 ${(l.quiz || []).length}문항)`);
}
// 레슨 실행 셀은 그 자체로 돌아가고 무언가 출력해야 한다 (학생이 ▶ 실행을 눌렀을 때 빈 화면이 나오지 않도록)
if (runCells.length) {
  const cellPy = `
import json, sys, io, os, tempfile, contextlib
cells = json.load(sys.stdin)
out = []
for c in cells:
    buf = io.StringIO()
    err = None
    d = tempfile.mkdtemp()
    for name in os.listdir(os.environ["RB_DATASETS"]):
        os.symlink(os.path.join(os.environ["RB_DATASETS"], name), os.path.join(d, name))
    cwd = os.getcwd(); os.chdir(d)
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(c["code"], c["id"], "exec"), {"__name__": "__main__"})
    except BaseException as e:
        err = type(e).__name__ + ": " + str(e)
    finally:
        os.chdir(cwd)
    out.append({"id": c["id"], "stdout": buf.getvalue(), "error": err})
print(json.dumps(out, ensure_ascii=False))
`;
  const cellRes = JSON.parse(execFileSync("python3", ["-c", cellPy], { input: JSON.stringify(runCells), encoding: "utf8", env: pyEnv }));
  for (const r of cellRes) {
    const ok = !r.error && r.stdout.trim();
    if (!ok) { failed++; console.log(`FAIL  실행 셀 ${r.id}  ${r.error || "출력이 없음"}`); }
  }
  console.log(`${cellRes.some((r) => r.error || !r.stdout.trim()) ? "FAIL" : "PASS"}  레슨 실행 셀 ${cellRes.length}개 실행`);
}
// import · from 문은 코드 맨 위에만 (시작 코드 · 모범답안 · 레슨 예제)
const lateImport = (code) => { let seen = false; for (const l of String(code || "").split("\n")) { if (/^(import |from \S+ import )/.test(l)) { if (seen) return true; } else if (l.trim() && !l.startsWith("#")) seen = true; } return false; };
const lateImports = [
  ...PROBLEMS.flatMap((p) => ["starter", "solution"].filter((k) => lateImport(p[k])).map((k) => `${p.id}.${k}`)),
  ...LESSONS.flatMap((l) => { const f = path.join(root, lessonPath(l)); return fs.existsSync(f) ? extract(fs.readFileSync(f, "utf8")).runs.flatMap((c, i) => (lateImport(c) ? [`${l.id} 예제 ${i + 1}`] : [])) : []; }),
];
if (lateImports.length) { failed++; console.log("FAIL  import가 코드 중간에 있음: " + lateImports.join(", ")); }
else console.log("PASS  import · from 문은 모두 코드 맨 위");
const ids = PROBLEMS.map((p) => p.id);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dup.length) { failed++; console.log("FAIL  중복 id: " + dup.join(", ")); }

const results = JSON.parse(
  execFileSync("python3", ["-c", py], { input: JSON.stringify(PROBLEMS.filter((p) => p.type !== "quiz")), encoding: "utf8", env: pyEnv })
);
for (const r of results) {
  const s = r.solution;
  const ok = s.passed && !r.starter_passed;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.id}  모범답안 ${s.passed_count}/${s.total_count}${r.starter_passed ? "  (시작 코드가 통과함!)" : ""}`);
  if (!s.passed) for (const c of s.cases.filter((c) => !c.passed)) console.log("      ", JSON.stringify(c));
}
console.log(failed ? `\n${failed}개 확인 필요` : `\n코딩 ${results.length}개 · 퀴즈 ${quizzes.length}개 · 레슨 ${LESSONS.length}개 모두 정상`);
process.exit(failed ? 1 : 0);
