// SQL 실행 셀: 브라우저 파이썬(Pyodide)에 들어 있는 SQLite(sqlite3 모듈)로 쿼리를 돌린다.
// 따로 SQL 엔진을 받지 않고 기존 파이썬 Worker를 그대로 쓴다. 로컬 검증(scripts/verify.mjs)도 같은 코드를 CPython으로 돌린다.
//  - 실행할 때마다 메모리에 새 DB를 만들고, 쿼리에 나온 테이블의 실습 데이터만 넣는다 (CREATE · INSERT · DELETE 를 해도 원본은 그대로).
//  - 결과는 표시용 JSON 한 줄로 출력하고, 화면에서 HTML 표로 바꿔 보여 준다.
// 브라우저(Pyodide 0.27)의 SQLite는 3.39 버전이다. CONCAT() 같은 3.44 이후 함수는 없으므로 레슨에서는 || 를 쓴다.

export const SQL_MARK = "\u001eRBSQL";
const MAX_ROWS = 100;

// 테이블 이름 → 실습 데이터 파일 (datasets/ 안). titanic 은 CSV 를 읽어 테이블로 만든다.
export const SQL_SEEDS = [
  { file: "sql_company.sql", tables: ["emp", "dept", "salgrade"] },
  { file: "sql_shop.sql", tables: ["users", "orders", "events"] },
];
export const SQL_TABLES = [...SQL_SEEDS.flatMap((s) => s.tables), "titanic"];

const PY = String.raw`
def _rb_sql(src, seeds, titanic, max_rows):
    import csv, json, sqlite3
    # 자동 커밋 모드: 문장마다 바로 반영하고, BEGIN · COMMIT · ROLLBACK 은 학생이 쓴 그대로 동작한다 (DBeaver 기본값과 같음)
    db = sqlite3.connect(":memory:", isolation_level=None)
    for f in seeds:
        with open(f, encoding="utf-8") as fh:
            db.executescript(fh.read())
    if titanic:
        db.execute("CREATE TABLE titanic (passenger_id INTEGER PRIMARY KEY, survived INTEGER, pclass INTEGER, sex TEXT, age REAL, sibsp INTEGER, parch INTEGER, fare REAL, embarked TEXT, deck TEXT, embark_town TEXT)")
        num = lambda v, t: t(v) if v != "" else None
        with open(titanic, encoding="utf-8") as fh:
            rows = [(i, int(r["survived"]), int(r["pclass"]), r["sex"], num(r["age"], float), int(r["sibsp"]), int(r["parch"]),
                     round(float(r["fare"]), 2), r["embarked"] or None, r["deck"] or None, r["embark_town"] or None)
                    for i, r in enumerate(csv.DictReader(fh), 1)]
        db.executemany("INSERT INTO titanic VALUES (?,?,?,?,?,?,?,?,?,?,?)", rows)
    # 세미콜론으로 문장을 나눈다 (문자열 안의 ; 는 complete_statement 가 걸러 준다)
    stmts, buf = [], ""
    for part in src.split(";"):
        buf += part + ";"
        if sqlite3.complete_statement(buf):
            stmts.append(buf)
            buf = ""
    if buf.strip(" \t\r\n;"):
        stmts.append(buf)
    def only_comments(s):
        return not "\n".join(l.split("--")[0] for l in s.split("\n")).strip(" \t\r\n;")
    out = {"sets": []}
    for n, s in enumerate(x for x in stmts if not only_comments(x)):
        try:
            cur = db.execute(s)
        except sqlite3.Error as e:
            out["error"] = {"message": str(e), "statement": n + 1}
            break
        if cur.description:
            rows = cur.fetchall()
            out["sets"].append({"columns": [d[0] for d in cur.description],
                                "rows": [list(r) for r in rows[:max_rows]], "total": len(rows)})
        else:
            out["sets"].append({"message": "실행 완료" + (f" · {cur.rowcount}행 변경" if cur.rowcount >= 0 else "")})
    print(${JSON.stringify(SQL_MARK)} + json.dumps(out, ensure_ascii=False, default=str))
`;

const uses = (sql, name) => new RegExp(`\\b${name}\\b`, "i").test(sql);

// SQL 문자열 → 실행할 파이썬 코드. 쓰는 데이터 파일 이름이 코드에 들어가야 worker 가 그 파일을 받아 둔다.
export function sqlProgram(sql, maxRows = MAX_ROWS) {
  const seeds = SQL_SEEDS.filter((s) => s.tables.some((t) => uses(sql, t))).map((s) => s.file);
  const titanic = uses(sql, "titanic");
  return `${PY.trim()}\n\n_rb_sql(${JSON.stringify(sql)}, ${JSON.stringify(seeds)}, ${titanic ? '"titanic.csv"' : "None"}, ${maxRows})\n`;
}

// 실행 결과(stdout) → { sets, error } (표시용). 표시 줄을 못 찾으면 null.
export function parseSqlOutput(stdout) {
  const line = String(stdout || "").split("\n").find((l) => l.startsWith(SQL_MARK));
  if (!line) return null;
  try { return JSON.parse(line.slice(SQL_MARK.length)); } catch { return null; }
}

// 자주 만나는 SQLite 오류 → 쉬운 말 안내
const HINTS = [
  [/no such column: (\S+)/i, (m) => `${m[1]}라는 열이 없습니다. 열 이름 철자를 확인하세요. SELECT에서 붙인 별칭은 WHERE에서 쓸 수 없습니다(실행 순서상 아직 만들어지지 않았습니다).`],
  [/no such table: (\S+)/i, (m) => `${m[1]}라는 테이블이 없습니다. 이 사이트에서 쓸 수 있는 테이블: ${SQL_TABLES.join(", ")}.`],
  [/no such function: (concat|concat_ws)/i, () => "이 사이트의 SQLite에는 CONCAT()이 없습니다. 문자열은 || 로 이어 붙이세요. 예: ename_ko || ' [' || joblv || ']'"],
  [/no such function: if\b/i, () => "MySQL의 IF()는 SQLite에서 IIF(조건, 참일 때, 거짓일 때)이거나 CASE WHEN으로 씁니다."],
  [/no such function: (left|right)\b/i, () => "LEFT()/RIGHT() 대신 SUBSTR(문자열, 시작, 길이)를 씁니다. 끝에서 자를 때는 SUBSTR(문자열, -1)."],
  [/no such function: (\w+)/i, (m) => `${m[1]}() 함수가 SQLite에 없습니다. 레슨에 나온 SQLite 함수 이름을 확인하세요.`],
  [/misuse of aggregate/i, () => "WHERE에는 COUNT · SUM · AVG 같은 집계 함수를 쓸 수 없습니다. 묶은 뒤의 조건은 HAVING에 씁니다."],
  [/must appear in the GROUP BY|not an aggregate/i, () => "GROUP BY로 묶었다면 SELECT에는 묶은 열이나 집계 함수만 씁니다."],
  [/ambiguous column name: (\S+)/i, (m) => `${m[1]} 열이 두 테이블에 다 있습니다. e.${m[1]}처럼 테이블 별칭을 앞에 붙이세요.`],
  [/syntax error/i, () => "문법 오류입니다. 쉼표(,) 빠짐 · 따옴표 짝 · 절 순서(SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT)를 확인하세요."],
  [/incomplete input/i, () => "문장이 끝나지 않았습니다. 괄호나 따옴표가 닫혔는지 확인하세요."],
  [/NOT NULL constraint failed: (\S+)/i, (m) => `${m[1]} 열은 비워 둘 수 없습니다(NOT NULL). 값을 넣어 주세요.`],
  [/UNIQUE constraint failed: (\S+)/i, (m) => `${m[1]}에 이미 같은 값이 있습니다. 기본키(PRIMARY KEY) · UNIQUE 열은 값이 겹치면 안 됩니다.`],
  [/FOREIGN KEY constraint failed/i, () => "외래키 규칙에 걸렸습니다. 참조하는 표에 없는 값을 넣었거나, 다른 행이 가리키고 있는 행을 지우려고 했습니다."],
  [/CHECK constraint failed/i, () => "CHECK 제약조건에 걸렸습니다. 이 열에 허용된 범위 밖의 값입니다."],
  [/cannot store (\w+) value in (\w+) column/i, (m) => `STRICT 표라서 ${m[2]} 열에 ${m[1]} 값을 넣을 수 없습니다. 자료형을 맞춰 주세요.`],
  [/table (\S+) already exists/i, (m) => `${m[1]} 테이블이 이미 있습니다. 실습 데이터 테이블(${SQL_TABLES.join(", ")})과 같은 이름은 쓰지 말고, 필요하면 CREATE TABLE IF NOT EXISTS를 씁니다.`],
  [/cannot (start|commit|rollback)[a-z ]*transaction/i, () => "트랜잭션 순서를 확인하세요. BEGIN 다음에 COMMIT 또는 ROLLBACK을 한 번만 씁니다."],
  [/SELECTs to the left and right of (UNION|INTERSECT|EXCEPT)/i, () => "UNION으로 붙이는 두 SELECT는 열 개수가 같아야 합니다."],
];
export function sqlHint(message) {
  for (const [re, fn] of HINTS) { const m = String(message || "").match(re); if (m) return fn(m); }
  return "";
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const cell = (v) => (v === null ? '<td class="null">NULL</td>' : typeof v === "number" ? `<td class="num">${esc(fmtNum(v))}</td>` : `<td>${esc(v)}</td>`);
const fmtNum = (v) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 1e6) / 1e6));

// 결과 → HTML (실행 결과 칸 안에 넣는다)
export function sqlResultHtml(res) {
  if (!res) return '<p class="sql-msg">결과를 읽지 못했습니다.</p>';
  const parts = [];
  const many = res.sets.length > 1;
  res.sets.forEach((s, k) => {
    if (s.message) { parts.push(`<p class="sql-msg">${many ? `문장 ${k + 1} · ` : ""}${esc(s.message)}</p>`); return; }
    const more = s.total > s.rows.length ? ` · 앞의 ${s.rows.length}행만 표시` : "";
    parts.push(`<div class="sql-set"><div class="sql-cap">${many ? `문장 ${k + 1} · ` : ""}${s.total}행 × ${s.columns.length}열${more}</div>
      <div class="sql-scroll"><table class="sql-table"><thead><tr>${s.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${s.rows.map((r) => `<tr>${r.map(cell).join("")}</tr>`).join("") || `<tr><td class="null" colspan="${s.columns.length}">조건에 맞는 행이 없습니다 (0행)</td></tr>`}</tbody></table></div></div>`);
  });
  if (res.error) {
    const hint = sqlHint(res.error.message);
    parts.push(`<div class="sql-err"><b>오류${res.sets.length || res.error.statement > 1 ? ` (문장 ${res.error.statement})` : ""}</b> <span class="mono">${esc(res.error.message)}</span>${hint ? `<span>${esc(hint)}</span>` : ""}</div>`);
  }
  if (!parts.length) parts.push('<p class="sql-msg">실행할 문장이 없습니다.</p>');
  return parts.join("");
}

// 텍스트 요약 (코드 작성 퀴즈의 비교 · 로그용)
export function sqlResultText(res) {
  if (!res) return "";
  if (res.error) return "오류: " + res.error.message;
  const s = [...res.sets].reverse().find((x) => x.columns);
  if (!s) return res.sets.map((x) => x.message).join("\n");
  return [s.columns.join(" | "), ...s.rows.map((r) => r.map((v) => (v === null ? "NULL" : typeof v === "number" ? fmtNum(v) : v)).join(" | "))].join("\n");
}

// 두 결과의 마지막 표가 같은가. 열 이름은 보지 않고 값만 비교한다.
// ordered 가 false 면 행 순서는 무시한다 (정답 쿼리에 ORDER BY 가 없을 때).
export function sameSqlResult(a, b, ordered) {
  const last = (r) => (r && !r.error ? [...r.sets].reverse().find((x) => x.columns) : null);
  const x = last(a), y = last(b);
  if (!x || !y || x.total !== y.total || x.columns.length !== y.columns.length) return false;
  const key = (row) => JSON.stringify(row.map((v) => (typeof v === "number" ? Math.round(v * 1e4) / 1e4 : v)));
  const ka = x.rows.map(key), kb = y.rows.map(key);
  if (!ordered) { ka.sort(); kb.sort(); }
  return ka.every((v, i) => v === kb[i]);
}
// 정답 쿼리의 바깥(마지막 닫는 괄호 뒤)에 ORDER BY 가 있으면 행 순서까지 비교한다
export const sqlOrdered = (sql) => { const s = String(sql); return /\border\s+by\b/i.test(s.slice(s.lastIndexOf(")") + 1)); };
