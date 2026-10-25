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
    spec = {k: p.get(k) for k in ("type", "tests", "checks", "tolerance") if p.get(k) is not None}
    good = harness.grade(spec, p["solution"])
    bad = harness.grade(spec, p["starter"])
    out.append({"id": p["id"], "solution": good, "starter_passed": bad["passed"]})
print(json.dumps(out, ensure_ascii=False))
`;
const results = JSON.parse(
  execFileSync("python3", ["-c", py], { input: JSON.stringify(PROBLEMS), encoding: "utf8" })
);
let failed = 0;
for (const r of results) {
  const s = r.solution;
  const ok = s.passed && !r.starter_passed;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.id}  모범답안 ${s.passed_count}/${s.total_count}${r.starter_passed ? "  (시작 코드가 통과함!)" : ""}`);
  if (!s.passed) for (const c of s.cases.filter((c) => !c.passed)) console.log("      ", JSON.stringify(c));
}
console.log(failed ? `\n${failed}개 문제 확인 필요` : `\n${results.length}개 문제 모두 정상`);
process.exit(failed ? 1 : 0);
