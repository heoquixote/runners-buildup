// Pyodide를 Web Worker에서 돌린다. 무한 루프는 메인 스레드가 이 Worker를 종료해 끊는다.
const params = new URL(self.location.href).searchParams;
const PYODIDE_URL = params.get("pyodide");
importScripts(PYODIDE_URL + "pyodide.js");

const ready = (async () => {
  const py = await loadPyodide({ indexURL: PYODIDE_URL });
  const harness = await (await fetch(new URL("harness.py", self.location.href))).text();
  py.runPython(harness);
  return py;
})();

ready.then(
  () => postMessage({ type: "ready" }),
  (err) => postMessage({ type: "fatal", error: String(err) })
);

self.onmessage = async (event) => {
  const { id, kind, problem, code, stdin } = event.data;
  try {
    const py = await ready;
    postMessage({ type: "started", id });
    // numpy 등은 코드나 검사식에서 필요할 때만 내려받는다 (첫 로딩 약 수 초)
    const checksUseNp = (problem.checks || []).some((c) => /\bnp\./.test(c.expr));
    await py.loadPackagesFromImports(code + "\n" + (checksUseNp ? "import numpy" : ""));
    const fn = py.globals.get(kind === "grade" ? "grade_json" : "run_json");
    const json = kind === "grade" ? fn(JSON.stringify(problem), code) : fn(JSON.stringify(problem), code, stdin || "");
    fn.destroy();
    postMessage({ type: "result", id, result: JSON.parse(json) });
  } catch (err) {
    postMessage({ type: "result", id, error: String(err) });
  }
};
