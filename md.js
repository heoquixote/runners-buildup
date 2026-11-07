// 레슨 본문용 작은 Markdown 렌더러. 외부 라이브러리 없이 레슨에 필요한 문법만 지원한다.
//  - 제목(#~####), 문단, 목록(-, 1.), 인용(>), 표(| a | b |), 구분선(---)
//  - 강조 **굵게** *기울임*, `코드`, [링크](url)
//  - 코드 펜스 ```python (읽기 전용) / ```run (파이썬 실행 셀) / ```sqlrun (SQL 실행 셀, sql.js)
//  - 영상 블록 ::video{ref="dl-m03" start="312" end="540"}
//  - 그림 블록 ::figure{src="content/img/ml/split.svg" alt="..." caption="..."}
//  - 팁 상자 :::tip 제목 … ::: (전구 아이콘이 붙은 "알아 두면 좋은 지식" 상자, 안에 문단 · 코드 · 표 모두 가능)
//  - 한 줄이 <로 시작하면 HTML 블록으로 그대로 둔다 (표 등 저작자가 쓴 HTML)

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function inline(text) {
  // 코드 스팬 먼저 떼어 두어 안쪽은 꾸미지 않는다
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*\w])\*([^*\n]+)\*/g, "$1<i>$2</i>")
    .replace(/\[([^\]]+)\]\((#[^)\s]+|https?:\/\/[^)\s]+)\)/g, (_, t, u) => `<a href="${u}"${u.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
    .replace(/  \n/g, "<br>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}

const TIP_ICON = '<svg class="md-tip-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>';

export function parseDirective(line) {
  const m = line.match(/^::(\w+)\{(.*)\}\s*$/);
  if (!m) return null;
  const attrs = {};
  for (const a of m[2].matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g)) attrs[a[1]] = a[2] ?? a[3] ?? a[4];
  return { name: m[1], attrs };
}

export function figureHtml(a) {
  const cap = a.caption ? `<figcaption>${inline(a.caption)}</figcaption>` : "";
  return `<figure class="md-fig"><img src="${esc(a.src)}" alt="${esc(a.alt || a.caption || "")}" loading="lazy">${cap}</figure>`;
}

// renderers: { run(code, index, lang) -> html, video(attrs, index) -> html }  lang: "python" | "sql"
export function render(md, renderers = {}) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0, runIdx = 0, videoIdx = 0;
  const para = [];
  const flush = () => {
    if (para.length) { out.push(`<p>${inline(para.join("\n"))}</p>`); para.length = 0; }
  };
  while (i < lines.length) {
    const line = lines[i];
    // 코드 펜스
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flush();
      const lang = fence[1];
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++;
      const code = buf.join("\n");
      if ((lang === "run" || lang === "sqlrun") && renderers.run) out.push(renderers.run(code, runIdx++, lang === "sqlrun" ? "sql" : "python"));
      else out.push(`<pre class="md-code"><code>${esc(code)}</code></pre>`);
      continue;
    }
    if (!line.trim()) { flush(); i++; continue; }
    // 팁 상자: 여는 줄과 닫는 줄만 바꾸고 안쪽은 평소대로 렌더링한다 (실행 셀 번호가 이어지도록)
    const tip = line.match(/^:::tip(?:\s+(.*))?$/);
    if (tip) { flush(); out.push(`<aside class="md-tip"><div class="md-tip-head">${TIP_ICON}<span>${inline(tip[1] || "알아 두면 좋아요")}</span></div>`); i++; continue; }
    if (/^:::\s*$/.test(line)) { flush(); out.push("</aside>"); i++; continue; }
    const directive = parseDirective(line);
    if (directive) {
      flush();
      if (directive.name === "video" && renderers.video) out.push(renderers.video(directive.attrs, videoIdx++));
      if (directive.name === "figure") out.push(figureHtml(directive.attrs));
      i++;
      continue;
    }
    if (/^<\w/.test(line)) { // HTML 블록: 빈 줄까지 그대로
      flush();
      const buf = [];
      while (i < lines.length && lines[i].trim()) buf.push(lines[i++]);
      out.push(buf.join("\n"));
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flush(); out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`); i++; continue; }
    if (/^---+\s*$/.test(line)) { flush(); out.push("<hr>"); i++; continue; }
    if (/^>\s?/.test(line)) {
      flush();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${inline(buf.join("\n"))}</blockquote>`);
      continue;
    }
    if (/^\|.*\|\s*$/.test(line)) {
      flush();
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().slice(1, -1).split("|").map((c) => c.trim());
      const body = rows.filter((r) => !/^\|\s*:?-{2,}/.test(r));
      const [head, ...rest] = body.map(cells);
      out.push(`<div class="table-scroll"><table class="ex-table"><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rest.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    const li = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (li) {
      flush();
      const ordered = /\d/.test(li[2]);
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        if (m) { items.push(m[3]); i++; }
        else if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) { items[items.length - 1] += "\n" + lines[i].trim(); i++; }
        else break;
      }
      out.push(`<${ordered ? "ol" : "ul"}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    para.push(line);
    i++;
  }
  flush();
  return out.join("\n");
}

// 레슨 본문에서 실행 셀(파이썬 runs · SQL sqlRuns)과 영상 참조만 뽑는다 (검증 스크립트용)
export function extract(md) {
  const runs = [], sqlRuns = [], videos = [], figures = [];
  for (const line of md.split("\n")) { const d = parseDirective(line); if (d && d.name === "figure") figures.push(d.attrs); }
  render(md, { run: (code, i, lang) => { (lang === "sql" ? sqlRuns : runs).push(code); return ""; }, video: (attrs) => { videos.push(attrs); return ""; } });
  return { runs, sqlRuns, videos, figures };
}
