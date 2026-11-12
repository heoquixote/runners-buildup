// 업적 · 메달: 목록, 달성 조건, 메달 SVG.
// 조건은 화면이 이미 가진 진도(state.progress · state.lessons · state.activity)로 계산한다.
// 한 번 받은 메달은 서버(student_medals)에 저장되어 진도가 바뀌어도 사라지지 않는다.

export const TIERS = {
  bronze: { label: "브론즈", rim: ["#f0b27a", "#a8622e"], ink: "#f0b27a" },
  silver: { label: "실버", rim: ["#eef3f7", "#8d9aa6"], ink: "#dfe7ee" },
  gold: { label: "골드", rim: ["#ffe58a", "#d79a12"], ink: "#ffcf4a" },
  special: { label: "스페셜", rim: ["#e4ff9a", "#86b51a"], ink: "#c8ff3d" },
};

export const CATEGORIES = [
  { id: "start", label: "첫걸음", en: "First Steps" },
  { id: "streak", label: "꾸준함", en: "Consistency" },
  { id: "lesson", label: "레슨", en: "Lessons" },
  { id: "problem", label: "문제 풀이", en: "Problems" },
  { id: "day", label: "DAY 완주", en: "Days" },
  { id: "track", label: "트랙 완주", en: "Tracks" },
  { id: "hidden", label: "숨은 업적", en: "Secret" },
];

// 아이콘: 24×24 선 그림
export const GLYPHS = {
  step: '<circle cx="15.2" cy="4.6" r="2.1" fill="currentColor" stroke="none"/><path d="M13.6 7.9 11 13.3M13 9.4l3.4 1 2.3-2.3M13 9.4l-3.6-.4-2.3 2.5M11 13.3l3.8 1.7.2 5M11 13.3l-2.1 3.8-4 .8"/>',
  check: '<circle cx="12" cy="12" r="8"/><path d="m8.2 12.3 2.6 2.6 5-5.4"/>',
  flag: '<path d="M6 21V4"/><path d="M6.8 4.5h11l-2.6 3.6 2.6 3.6h-11z" fill="currentColor" fill-opacity=".25"/>',
  list: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="m8 9 1.4 1.4L12 8M8 14.5l1.4 1.4 2.6-2.4M14 9.2h2.4M14 14.8h2.4"/>',
  flame: '<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 2.6-5 3.4-8.4 1.9 1.2 2.6 3 2.6 4.4 1-.6 1.7-1.8 1.8-3.2 2.2 1.8 4.2 4.4 4.2 7.2 0 3.2-2.4 5.6-6 5.6z"/><path d="M12 21c-1.5 0-2.6-1-2.6-2.5 0-1.6 1.4-2.4 1.8-4 1.6 1 3.4 2.4 3.4 4 0 1.5-1.1 2.5-2.6 2.5z"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/><path d="m9 15 2 2 4-4"/>',
  book: '<path d="M12 6.5C10 5 7.4 4.6 4 5v13.5c3.4-.4 6 0 8 1.5 2-1.5 4.6-1.9 8-1.5V5c-3.4-.4-6 0-8 1.5z"/><path d="M12 6.5V20"/>',
  code: '<path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13"/>',
  bolt: '<path d="M13.5 3 6 13.5h5.2L10.5 21 18 10.5h-5.2z"/>',
  star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  crown: '<path d="M4.5 17.5 3.5 8l4.6 3.6L12 5.5l3.9 6.1L20.5 8l-1 9.5z"/><path d="M5 20.5h14"/>',
  repeat: '<path d="M17 3.5 20 6.5 17 9.5"/><path d="M4 11.5v-1a4 4 0 0 1 4-4h12M7 20.5 4 17.5l3-3"/><path d="M20 12.5v1a4 4 0 0 1-4 4H4"/>',
  mountain: '<path d="M2.5 19.5 9 8.5l3.6 6 2.4-3.6 6.5 8.6z"/><path d="M9 8.5V3.5h4.2l-1 1.6 1 1.6H9"/>',
  trophy: '<path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z"/><path d="M7.5 6H4.5v1.2A3.3 3.3 0 0 0 7.8 10.5M16.5 6h3v1.2a3.3 3.3 0 0 1-3.3 3.3M12 13.5v3.5M8 20.5h8M9.5 17h5"/>',
  moon: '<path d="M19 14.6A7.6 7.6 0 1 1 9.4 5a6 6 0 0 0 9.6 9.6z"/><path d="M16.5 4v3M15 5.5h3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.6 8.4-2.2 5-5 2.2 2.2-5z"/>',
  lock: '<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"/>',
  question: '<path d="M9.2 9.2a2.9 2.9 0 1 1 4.1 2.6c-.8.4-1.3 1-1.3 1.9v.6"/><circle cx="12" cy="17.6" r=".6" fill="currentColor"/>',
};

// 트랙 메달은 트랙 색을 쓴다 (content/index.js 의 color 이름)
export const COLOR_HEX = { violet: "#a896ff", cyan: "#66dbff", lime: "#c8ff3d", amber: "#ffcf4a", green: "#61db9c", orange: "#ff9a51", rose: "#ff8fcf", blue: "#7aa8ff" };

const TRACK_MEDAL = { "python-basic": "파이썬 기초", "python-da": "데이터 분석", "python-viz": "데이터 시각화", sql: "SQL", stats: "통계", ml: "머신러닝", ts: "시계열 분석", dl: "딥러닝" };

// goal 이 있는 메달은 진행 막대를 보여준다. stat(ctx) 는 지금 값.
// event: true 는 화면에서 그 순간에만 알 수 있는 업적 (예: 반에서 첫 정답)
export const MEDALS = [
  { id: "first-lesson", cat: "start", tier: "bronze", glyph: "step", name: "첫 발걸음", desc: "레슨을 처음으로 끝냈어요.", how: "레슨 1개 완료", goal: 1, stat: (x) => x.lessons },
  { id: "first-solve", cat: "start", tier: "bronze", glyph: "check", name: "첫 정답", desc: "연습문제를 처음으로 맞혔어요.", how: "문제 1개 정답", goal: 1, stat: (x) => x.solved },
  { id: "first-day", cat: "start", tier: "silver", glyph: "flag", name: "첫 DAY 완주", desc: "한 DAY의 레슨과 문제를 모두 끝냈어요.", how: "DAY 1개 완주", goal: 1, stat: (x) => x.days },
  { id: "daily-clear", cat: "start", tier: "bronze", glyph: "list", name: "오늘 할 일 끝", desc: "오늘의 학습 목록을 모두 끝냈어요.", how: "오늘의 학습 모두 완료", event: true },

  { id: "streak-3", cat: "streak", tier: "bronze", glyph: "flame", name: "불붙은 러너", desc: "3일 연속으로 학습했어요.", how: "3일 연속 학습", goal: 3, stat: (x) => x.bestStreak },
  { id: "streak-7", cat: "streak", tier: "silver", glyph: "flame", name: "일주일 러너", desc: "7일 연속으로 학습했어요.", how: "7일 연속 학습", goal: 7, stat: (x) => x.bestStreak },
  { id: "streak-14", cat: "streak", tier: "gold", glyph: "flame", name: "2주 마라토너", desc: "14일 연속으로 학습했어요.", how: "14일 연속 학습", goal: 14, stat: (x) => x.bestStreak },
  { id: "days-30", cat: "streak", tier: "gold", glyph: "calendar", name: "30일의 기록", desc: "학습한 날이 모두 30일이 됐어요.", how: "학습한 날 30일", goal: 30, stat: (x) => x.activeDays },

  { id: "lessons-10", cat: "lesson", tier: "bronze", glyph: "book", name: "개념 워밍업", desc: "레슨 10개를 끝냈어요.", how: "레슨 10개 완료", goal: 10, stat: (x) => x.lessons },
  { id: "lessons-50", cat: "lesson", tier: "silver", glyph: "book", name: "개념 러너", desc: "레슨 50개를 끝냈어요.", how: "레슨 50개 완료", goal: 50, stat: (x) => x.lessons },
  { id: "lessons-150", cat: "lesson", tier: "gold", glyph: "book", name: "개념 마스터", desc: "레슨 150개를 끝냈어요.", how: "레슨 150개 완료", goal: 150, stat: (x) => x.lessons },

  { id: "solve-10", cat: "problem", tier: "bronze", glyph: "code", name: "문제 사냥꾼", desc: "문제 10개를 맞혔어요.", how: "문제 10개 정답", goal: 10, stat: (x) => x.solved },
  { id: "solve-50", cat: "problem", tier: "silver", glyph: "code", name: "코드 러너", desc: "문제 50개를 맞혔어요.", how: "문제 50개 정답", goal: 50, stat: (x) => x.solved },
  { id: "solve-120", cat: "problem", tier: "gold", glyph: "code", name: "문제 해결사", desc: "문제 120개를 맞혔어요.", how: "문제 120개 정답", goal: 120, stat: (x) => x.solved },
  { id: "oneshot-10", cat: "problem", tier: "silver", glyph: "bolt", name: "원샷 원킬", desc: "첫 제출에 바로 맞힌 문제가 10개예요.", how: "첫 제출 정답 10개", goal: 10, stat: (x) => x.oneShot },
  { id: "challenge-1", cat: "problem", tier: "silver", glyph: "star", name: "도전자", desc: "도전 문제를 처음 맞혔어요.", how: "도전 문제 1개 정답", goal: 1, stat: (x) => x.challenge },
  { id: "challenge-5", cat: "problem", tier: "gold", glyph: "star", name: "도전 정복", desc: "도전 문제 5개를 맞혔어요.", how: "도전 문제 5개 정답", goal: 5, stat: (x) => x.challenge },
  { id: "first-runner", cat: "problem", tier: "gold", glyph: "crown", name: "퍼스트 러너", desc: "우리 반에서 가장 먼저 정답을 냈어요.", how: "반에서 1번째로 정답", event: true },

  { id: "days-5", cat: "day", tier: "silver", glyph: "flag", name: "다섯 구간 통과", desc: "DAY 5개를 완주했어요.", how: "DAY 5개 완주", goal: 5, stat: (x) => x.days },
  { id: "days-20", cat: "day", tier: "gold", glyph: "flag", name: "장거리 러너", desc: "DAY 20개를 완주했어요.", how: "DAY 20개 완주", goal: 20, stat: (x) => x.days },
  { id: "explorer", cat: "day", tier: "silver", glyph: "compass", name: "탐험가", desc: "서로 다른 3개 트랙에서 레슨을 끝냈어요.", how: "3개 트랙에서 레슨 완료", goal: 3, stat: (x) => x.tracksTouched },

  ...Object.entries(TRACK_MEDAL).map(([tid, label]) => ({
    id: `track-${tid}`, cat: "track", tier: "special", glyph: "mountain", track: tid,
    name: `${label} 완주`, desc: `${label} 트랙의 모든 레슨과 문제를 끝냈어요.`, how: `${label} 트랙 100%`, goal: 100, unit: "%", stat: (x) => x.trackPct[tid] || 0,
  })),
  { id: "grand-slam", cat: "track", tier: "gold", glyph: "trophy", name: "그랜드 슬램", desc: "모든 트랙을 완주했어요.", how: "8개 트랙 모두 완주", goal: 8, stat: (x) => x.tracksDone },

  { id: "grit", cat: "hidden", tier: "bronze", glyph: "repeat", hidden: true, name: "포기를 모르는 러너", desc: "5번 넘게 다시 시도한 끝에 정답을 냈어요.", how: "6번째 이후 제출에서 정답", goal: 1, stat: (x) => x.grit },
  { id: "night-owl", cat: "hidden", tier: "bronze", glyph: "moon", hidden: true, name: "올빼미 러너", desc: "자정이 넘은 새벽에 학습했어요.", how: "밤 0~4시에 레슨 완료 또는 정답", goal: 1, stat: (x) => x.night },
  { id: "early-bird", cat: "hidden", tier: "bronze", glyph: "sun", hidden: true, name: "얼리버드", desc: "이른 아침에 학습했어요.", how: "아침 5~7시에 레슨 완료 또는 정답", goal: 1, stat: (x) => x.morning },
];
export const medalById = Object.fromEntries(MEDALS.map((m) => [m.id, m]));

// ── 메달 그림 ─────────────────────────────────────────────
// 위: 리본 두 갈래 / 아래: 테두리(티어 색) + 어두운 원판 + 아이콘. 잠긴 메달은 회색 + 자물쇠.
let gid = 0;
export function medalSvg(m, { locked = false, size = 72, trackColor = null } = {}) {
  const t = TIERS[m.tier];
  const id = `md${++gid}`;
  const [hi, lo] = locked ? ["#3a4043", "#202526"] : trackColor ? [trackColor, trackColor] : t.rim;
  const ink = locked ? "#5d6669" : trackColor || t.ink;
  const ribbon = locked ? ["#262b2d", "#1b1f20"] : trackColor ? [trackColor, trackColor] : [t.rim[1], t.rim[0]];
  const glyph = locked ? (m.hidden ? GLYPHS.question : GLYPHS[m.glyph]) : GLYPHS[m.glyph];
  return `<svg class="medal-svg${locked ? " locked" : ""}" width="${size}" height="${size * 1.18}" viewBox="0 0 64 76" aria-hidden="true">
    <defs><linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="1" stop-color="${lo}" stop-opacity="${trackColor && !locked ? 0.45 : 1}"/></linearGradient>
    <radialGradient id="${id}d" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#1e2325"/><stop offset="1" stop-color="#0b0d0e"/></radialGradient></defs>
    <path d="M18 2h11l6 22H24z" fill="${ribbon[0]}" opacity="${locked ? 1 : 0.85}"/><path d="M46 2H35l-6 22h11z" fill="${ribbon[1]}" opacity="${locked ? 1 : 0.65}"/>
    <circle cx="32" cy="46" r="26" fill="url(#${id}r)"/>
    <circle cx="32" cy="46" r="21.5" fill="url(#${id}d)"/>
    <circle cx="32" cy="46" r="21.5" fill="none" stroke="${ink}" stroke-opacity=".28" stroke-width="1"/>
    ${m.tier === "gold" || m.tier === "special" ? `<g fill="${hi}" opacity="${locked ? 0.4 : 0.9}"><circle cx="32" cy="21.6" r="1.4"/><circle cx="10.6" cy="58" r="1.1"/><circle cx="53.4" cy="58" r="1.1"/></g>` : ""}
    <g transform="translate(20 34)" fill="none" stroke="${ink}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="color:${ink}">${glyph}</g>
    ${locked && !m.hidden ? `<g transform="translate(43 58) scale(.55)" fill="#0b0d0e" stroke="#7d878a" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="13" r="12" stroke="none"/>${GLYPHS.lock}</g>` : ""}
  </svg>`;
}

// ── 조건 계산 ─────────────────────────────────────────────
// h: app.js 가 넘겨주는 도우미 {TRACKS, coursesOf, isReady, coreLessons, courseProblems, lessonDone, solved, byId, lessonById, courseById}
const seoulHour = (iso) => Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", hourCycle: "h23" }).format(new Date(iso)));
export function medalContext(st, h) {
  const lessonIds = Object.keys(st.lessons).filter((id) => st.lessons[id]?.status === "passed" && h.lessonById[id]);
  const probs = Object.entries(st.progress).filter(([id, p]) => p?.solved && h.byId[id]);
  const x = {
    lessons: lessonIds.length,
    solved: probs.length,
    oneShot: probs.filter(([, p]) => p.attempts === 1).length,
    challenge: probs.filter(([id]) => h.byId[id].challenge).length,
    grit: probs.some(([, p]) => p.attempts >= 6) ? 1 : 0,
    night: 0, morning: 0,
    days: 0, trackPct: {}, tracksDone: 0, tracksTouched: 0,
    bestStreak: 0, activeDays: 0,
  };
  const times = [...lessonIds.map((id) => st.lessons[id].passed_at), ...probs.map(([, p]) => p.solved_at)].filter(Boolean);
  for (const t of times) { const hr = seoulHour(t); if (hr < 5) x.night = 1; else if (hr < 8) x.morning = 1; }
  const touched = new Set(lessonIds.map((id) => h.courseById[h.lessonById[id].course]?.track).filter(Boolean));
  x.tracksTouched = touched.size;
  for (const t of h.TRACKS.filter((t) => t.ready)) {
    let total = 0, done = 0;
    for (const c of h.coursesOf(t.id).filter(h.isReady)) {
      const ls = h.coreLessons(c), ps = h.courseProblems(c);
      const ld = ls.filter((l) => h.lessonDone(l.id)).length, pd = ps.filter((p) => h.solved(p.id)).length;
      total += ls.length + ps.length; done += ld + pd;
      if (ls.length + ps.length > 0 && ld === ls.length && pd === ps.length) x.days++;
    }
    x.trackPct[t.id] = total ? Math.floor((done / total) * 100) : 0;
    if (total && done === total) x.tracksDone++;
  }
  // 연속 학습일: 날짜 키(YYYY-MM-DD)를 정렬해 가장 긴 연속 구간
  const days = Object.keys(st.activity || {}).filter((d) => st.activity[d] > 0).sort();
  x.activeDays = days.length;
  let run = 0, prev = null;
  for (const d of days) {
    const cur = Date.parse(d + "T00:00:00Z");
    run = prev !== null && cur - prev === 86400000 ? run + 1 : 1;
    x.bestStreak = Math.max(x.bestStreak, run);
    prev = cur;
  }
  return x;
}

// 지금 조건을 만족하는 메달 id 목록 (이벤트형 제외)
export function qualifiedMedals(ctx) {
  return MEDALS.filter((m) => !m.event && m.stat && m.stat(ctx) >= m.goal).map((m) => m.id);
}
