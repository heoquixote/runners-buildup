// 데이터러너즈 채널의 최신 업로드(RSS)를 읽어, content/videos.js 에서 아직 영상이 없는 항목과 제목 키워드로 맞춘다.
// 맞으면 youtube_id · release_url · status 를 채우고, 결과 요약을 출력한다(GitHub Actions 가 PR 본문으로 쓴다).
//
//   node scripts/sync-youtube.mjs                 # 채널 RSS 를 직접 읽음
//   node scripts/sync-youtube.mjs --feed feed.xml # 저장해 둔 RSS 파일로 시험
//   node scripts/sync-youtube.mjs --dry-run       # 파일은 고치지 않고 결과만 출력
//
// RSS 는 최근 15편만 담는다. 새 영상이 키워드에 안 맞으면 "매칭 안 됨"으로 보고만 하고, 사람이 MATCH 에 키워드를 더하거나 직접 채운다.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const CHANNEL_ID = "UCbiosyXlVcv8X4aBFbsNCNg";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
// RSS 가 404·500 을 줄 때(GitHub 러너 IP 에서 자주 발생) 쓰는 대체 경로: 채널 동영상 탭 HTML 의 ytInitialData.
const CHANNEL_VIDEOS_URL = `https://www.youtube.com/channel/${CHANNEL_ID}/videos`;
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const VIDEOS_FILE = new URL("../content/videos.js", import.meta.url);

// 영상 id → 채널 제목에 들어 있으면 그 영상으로 보는 키워드(공백·대소문자 무시, 하나만 맞아도 됨).
// 새 대기열 항목을 추가하면 여기에도 키워드를 넣는다.
export const MATCH = {
  "dl-m01": ["브로드캐스팅", "broadcast"],
  "dl-m03": ["groupby", "그룹화"],
  "dl-m04": ["join"],
  "dl-m05": ["실행순서", "executionorder"],
  "dl-m06": ["중심극한", "표본분포", "clt"],
  "dl-m07": ["신뢰구간", "confidenceinterval"],
  "dl-m08": ["p-value", "pvalue", "p값", "가설검정"],
  "dl-m11": ["roc", "precision", "recall", "임계값"],
  "dl-m12": ["역전파", "backprop"],
  "dl-m13": ["cnn", "합성곱"],
  "dl-m14": ["객체참조", "변수와객체", "얕은복사"],
  "dl-m15": ["반복문"],
  "dl-m16": ["스코프", "scope"],
  "dl-m17": ["pivot", "melt"],
  "dl-m18": ["merge"],
  "dl-m19": ["rolling", "resample"],
  "dl-m20": ["윈도우함수", "partitionby", "windowfunction"],
  "dl-m21": ["검정력", "제1종", "1종오류", "2종오류"],
  "dl-m23": ["결정트리", "의사결정나무", "앙상블", "decisiontree", "randomforest", "랜덤포레스트"],
  "dl-m24": ["교차검증", "k-fold", "kfold"],
  "dl-m25": ["k-means", "kmeans", "군집"],
  "dl-m26": ["pca", "주성분"],
  "dl-m27": ["rnn", "순환신경망"],
  "dl-m28": ["어텐션", "attention", "transformer", "트랜스포머"],
  "dl-m35": ["히스토그램", "histogram", "bins", "밀도곡선", "kde"],
  "dl-m36": ["상자그림", "박스플롯", "boxplot", "iqr"],
  "dl-m37": ["앤스콤", "anscombe", "심슨", "simpson"],
  "dl-m38": ["결측치", "fillna", "interpolate", "보간"],
  "dl-m39": ["그래프왜곡", "축자르기", "차트왜곡", "misleading"],
};

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, "");
const unxml = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: e.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1],
    title: unxml(e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""),
    published: e.match(/<published>([^<]+)<\/published>/)?.[1] ?? "",
  })).filter((v) => v.id);
}

// 채널 동영상 탭 HTML 에서 영상 id·제목을 뽑는다(최신순). 게시일은 상대 표기("1일 전")만 있어 비워 둔다.
export function parseChannelPage(html) {
  const m = html.match(/ytInitialData\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (!m) return [];
  const out = [], seen = new Set();
  const text = (t) => t?.simpleText ?? t?.runs?.map((r) => r.text).join("") ?? t?.content ?? "";
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);
    const vr = o.videoRenderer || o.gridVideoRenderer;
    if (vr?.videoId && !seen.has(vr.videoId)) { seen.add(vr.videoId); out.push({ id: vr.videoId, title: text(vr.title), published: "" }); }
    const lv = o.lockupViewModel;
    if (lv?.contentId && /^[\w-]{11}$/.test(lv.contentId) && !seen.has(lv.contentId)) {
      seen.add(lv.contentId);
      out.push({ id: lv.contentId, title: text(lv.metadata?.lockupMetadataViewModel?.title), published: "" });
    }
    for (const v of Object.values(o)) walk(v);
  };
  walk(JSON.parse(m[1]));
  return out.filter((v) => v.title);
}

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "ko,en;q=0.8" } });
  return { status: res.status, body: await res.text() };
}

// RSS → (실패 시) 채널 동영상 탭 순서로 시도하고, 각 시도의 HTTP 상태를 남긴다.
async function loadFeed() {
  const tried = [];
  for (let i = 0; i < 2; i++) {
    const r = await get(FEED_URL);
    const feed = r.status === 200 ? parseFeed(r.body) : [];
    tried.push(`RSS ${r.status} (${feed.length}편)`);
    if (feed.length) return { feed, source: "RSS", tried };
    await new Promise((ok) => setTimeout(ok, 3000));
  }
  const r = await get(CHANNEL_VIDEOS_URL);
  const feed = r.status === 200 ? parseChannelPage(r.body) : [];
  tried.push(`채널 페이지 ${r.status} (${feed.length}편)`);
  return { feed, source: "채널 페이지", tried };
}

// 아직 영상이 없는 항목(videos.js 의 youtube_id: null 줄)만 후보로 삼는다.
export function plan(feed, src) {
  const known = new Set([...src.matchAll(/youtube_id: "([\w-]{11})"|watch\?v=([\w-]{11})/g)].map((m) => m[1] || m[2]));
  const open = new Set([...src.matchAll(/id: "(dl-m\d+)"[^\n]*youtube_id: null/g)].map((m) => m[1]));
  const fills = [], unmatched = [], ambiguous = [];
  const taken = new Set();
  for (const v of feed) {
    if (known.has(v.id)) continue;
    const hits = Object.entries(MATCH).filter(([id, kws]) => open.has(id) && !taken.has(id) && kws.some((k) => norm(v.title).includes(norm(k)))).map(([id]) => id);
    if (hits.length === 1) { fills.push({ ref: hits[0], ...v }); taken.add(hits[0]); }
    else if (hits.length > 1) ambiguous.push({ ...v, hits });
    else unmatched.push(v);
  }
  return { fills, unmatched, ambiguous };
}

export function apply(src, fills) {
  for (const f of fills) {
    const re = new RegExp(`(\\{ id: "${f.ref}",[^\\n]*?)youtube_id: null, status: "[a-z]+"`);
    src = src.replace(re, `$1youtube_id: "${f.id}", release_url: "https://www.youtube.com/watch?v=${f.id}", status: "published"`);
  }
  return src;
}

async function main() {
  const args = process.argv.slice(2);
  const feedArg = args.indexOf("--feed");
  const { feed, source, tried } = feedArg >= 0
    ? { feed: parseFeed(readFileSync(args[feedArg + 1], "utf8")), source: "파일", tried: [] }
    : await loadFeed();
  console.error(`영상 목록: ${source}에서 ${feed.length}편 (${tried.join(" → ") || "-"})`);
  if (!feed.length) throw new Error(`유튜브에서 영상 목록을 읽지 못했습니다: ${tried.join(" → ")}`);
  const src = readFileSync(VIDEOS_FILE, "utf8");
  const { fills, unmatched, ambiguous } = plan(feed, src);
  if (fills.length && !args.includes("--dry-run")) writeFileSync(VIDEOS_FILE, apply(src, fills));

  const lines = [];
  if (fills.length) lines.push("### 영상 연결", ...fills.map((f) => `- \`${f.ref}\` ← [${f.title}](https://www.youtube.com/watch?v=${f.id})${f.published ? ` (${f.published.slice(0, 10)})` : ""}`), "");
  if (ambiguous.length) lines.push("### 후보가 여럿이라 보류", ...ambiguous.map((v) => `- [${v.title}](https://www.youtube.com/watch?v=${v.id}) → ${v.hits.join(", ")}`), "");
  if (unmatched.length) lines.push("### 대기열과 매칭 안 됨 (직접 확인)", ...unmatched.map((v) => `- [${v.title}](https://www.youtube.com/watch?v=${v.id})${v.published ? ` (${v.published.slice(0, 10)})` : ""}`), "");
  const summary = lines.join("\n") || "새로 연결할 영상이 없습니다.";
  console.log(summary);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `filled=${fills.length}\n`);
  if (process.env.SYNC_SUMMARY) writeFileSync(process.env.SYNC_SUMMARY, summary + "\n");
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
