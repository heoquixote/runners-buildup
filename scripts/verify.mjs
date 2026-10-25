// 모든 문제의 모범답안이 채점을 통과하고, 시작 코드는 통과하지 않는지 확인한다.
// 사용법: node scripts/verify.mjs   (python3 와 numpy 필요)
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PROBLEMS } from "../problems.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
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
const quizzes = PROBLEMS.filter((p) => p.type === "quiz");
for (const q of quizzes) {
  const bad = q.questions.filter((x) =>
    !x.q || !x.explain ||
    (x.kind === "ox" && typeof x.answer !== "boolean") ||
    (x.kind === "choice" && !(Number.isInteger(x.answer) && x.options?.[x.answer] !== undefined)) ||
    (x.kind === "short" && !(typeof x.answer === "string" || (Array.isArray(x.answer) && x.answer.length))) ||
    !["ox", "choice", "short"].includes(x.kind));
  if (bad.length) failed++;
  console.log(`${bad.length ? "FAIL" : "PASS"}  ${q.id}  퀴즈 ${q.questions.length}문항${bad.length ? "  형식 오류: " + bad.map((x) => x.q).join(" / ") : ""}`);
}
const ids = PROBLEMS.map((p) => p.id);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dup.length) { failed++; console.log("FAIL  중복 id: " + dup.join(", ")); }

const results = JSON.parse(
  execFileSync("python3", ["-c", py], { input: JSON.stringify(PROBLEMS.filter((p) => p.type !== "quiz")), encoding: "utf8" })
);
for (const r of results) {
  const s = r.solution;
  const ok = s.passed && !r.starter_passed;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.id}  모범답안 ${s.passed_count}/${s.total_count}${r.starter_passed ? "  (시작 코드가 통과함!)" : ""}`);
  if (!s.passed) for (const c of s.cases.filter((c) => !c.passed)) console.log("      ", JSON.stringify(c));
}
console.log(failed ? `\n${failed}개 문제 확인 필요` : `\n코딩 ${results.length}개 · 퀴즈 ${quizzes.length}개 모두 정상`);
process.exit(failed ? 1 : 0);
