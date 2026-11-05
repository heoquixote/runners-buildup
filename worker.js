// Pyodide를 Web Worker에서 돌린다. 무한 루프는 메인 스레드가 이 Worker를 종료해 끊는다.
const params = new URL(self.location.href).searchParams;
const PYODIDE_URL = params.get("pyodide");
importScripts(PYODIDE_URL + "pyodide.js");

const ready = (async () => {
  const py = await loadPyodide({ indexURL: PYODIDE_URL });
  // 배포 직후 옛 하네스가 캐시에서 읽히지 않도록 매번 서버에 재검증한다(ETag라 변경 없으면 가볍다)
  const harness = await (await fetch(new URL("harness.py", self.location.href), { cache: "no-cache" })).text();
  py.runPython(harness);
  return py;
})();

ready.then(
  () => postMessage({ type: "ready" }),
  (err) => postMessage({ type: "fatal", error: String(err) })
);

// 예제 데이터셋: 코드에 파일 이름이 보이면 사이트의 datasets/ 에서 한 번 받아 /datasets 에 둔다.
// 하네스가 실행할 때마다 작업 폴더에 연결해 pd.read_csv('titanic.csv') 처럼 이름만으로 읽힌다.
const DATASETS = ["titanic.csv", "ai4i2020.csv"];
async function loadDatasets(py, code) {
  const need = DATASETS.filter((name) => code.includes(name));
  if (!need.length) return;
  if (!py.FS.analyzePath("/datasets").exists) py.FS.mkdir("/datasets");
  for (const name of need) {
    const path = "/datasets/" + name;
    if (py.FS.analyzePath(path).exists) continue;
    const res = await fetch(new URL("datasets/" + name, self.location.href));
    if (!res.ok) throw new Error(`데이터셋 ${name}을(를) 불러오지 못했습니다 (${res.status}).`);
    py.FS.writeFile(path, new Uint8Array(await res.arrayBuffer()));
  }
}

self.onmessage = async (event) => {
  const { id, kind, problem, code, stdin } = event.data;
  try {
    const py = await ready;
    postMessage({ type: "started", id });
    // numpy 등은 코드나 검사식에서 필요할 때만 내려받는다 (첫 로딩 약 수 초)
    const checksUseNp = (problem.checks || []).some((c) => /\bnp\./.test(c.expr));
    await py.loadPackagesFromImports(code + "\n" + (checksUseNp ? "import numpy" : ""));
    // seaborn은 Pyodide 기본 패키지에 없을 수 있어 처음 한 번 micropip으로 설치한다
    if (/^\s*(import|from)\s+seaborn\b/m.test(code)) {
      try { py.pyimport("seaborn"); }
      catch { await py.loadPackage("micropip"); await py.pyimport("micropip").install("seaborn"); }
    }
    await loadDatasets(py, code);
    const fn = py.globals.get(kind === "grade" ? "grade_json" : "run_json");
    const json = kind === "grade" ? fn(JSON.stringify(problem), code) : fn(JSON.stringify(problem), code, stdin || "");
    fn.destroy();
    postMessage({ type: "result", id, result: JSON.parse(json) });
  } catch (err) {
    postMessage({ type: "result", id, error: String(err) });
  }
};
