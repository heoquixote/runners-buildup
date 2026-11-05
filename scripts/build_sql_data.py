# SQL 트랙 실습 데이터를 만든다. 결과 파일은 datasets/ 에 둔다 (브라우저 worker 가 필요할 때 받아 간다).
#  - sql_company.sql : 진성 님 SQL 기초 교재의 실습 데이터(emp · dept · salgrade)를 SQLite 문법으로 옮긴 것
#  - sql_shop.sql    : 가상 쇼핑몰 데이터(users · orders · events). 리텐션 · 퍼널 · 코호트 실습용, 시드 고정
# 타이타닉(titanic 테이블)은 datasets/titanic.csv 를 실행할 때 바로 읽어 만든다 (sql.js 참고).
# 사용법: python3 scripts/build_sql_data.py
import datetime as dt
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "datasets")


def q(v):
    if v is None:
        return "NULL"
    if isinstance(v, (int, float)):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"


def inserts(table, cols, rows, chunk=200):
    out = []
    for i in range(0, len(rows), chunk):
        body = ",\n".join("(" + ", ".join(q(v) for v in r) + ")" for r in rows[i:i + chunk])
        out.append(f"INSERT INTO {table} ({', '.join(cols)}) VALUES\n{body};")
    return "\n".join(out)


# ── 회사 데이터 (교재 DDL2.sql) ───────────────────────────
EMP = [
    (1000, "김대표", "Kim Daepyo", "CEO", None, "1996-01-01", 80000, 0, None, 1),
    (7001, "백정태", "Baek Jeongtae", "상무", 1000, "1998-07-01", 20000, 10000, 10, 1),
    (7002, "김낙수", "Kim Naksu", "부장", 7001, "2000-03-15", 15000, 5000, 11, 1),
    (4001, "최재혁", "Choi Jaehyeok", "부장", 1000, "2003-08-19", 13000, 5000, 80, 1),
    (7003, "도진우", "Do Jinwoo", "부장", 7001, "2006-05-21", 12000, 7000, 12, 1),
    (7004, "신준섭", "Shin Junseop", "차장", 7003, "2017-11-10", 10000, 3000, 12, 1),
    (7005, "허태환", "Heo Taehwan", "과장", 7002, "2000-03-15", 8000, 2000, 11, 0),
    (7006, "송익현", "Song Ikhyun", "과장", 7002, "2015-04-03", 7000, 1500, 11, 1),
    (7007, "정성구", "Jung Sunggu", "대리", 7002, "2019-09-11", 6000, 0, 11, 1),
    (7008, "이명헌", "Lee Myungheon", "대리", 7003, "2020-06-08", 5500, 0, 12, 1),
    (4002, "남궁민수", "Namgung Minsu", "대리", 4001, "2021-07-08", 5000, 0, 80, 1),
    (7009, "권송희", "Kwon Songhee", "사원", 7002, "2022-01-03", 4800, 1000, 11, 1),
    (7010, "채소연", "Chae Soyeon", "사원", 7003, "2022-03-02", 4500, 1000, 12, 1),
    (8001, "이주영", "Lee Juyoung", "작업반장", None, "2015-04-03", 6000, 2000, 40, 1),
]
DEPT = [(10, "ACT 영업본부", "서울"), (11, "ACT 영업1팀", "서울"), (12, "ACT 영업2팀", "서울"),
        (40, "ACT 아산공장", "아산"), (80, "ACT 인사팀", "서울")]
SALGRADE = [("E", 0, 5000), ("D", 5001, 10000), ("C", 10001, 20000), ("B", 20001, 30000), ("A", 30001, 99999)]

company = f"""-- 회사 실습 데이터: 사원(emp) · 부서(dept) · 급여 등급(salgrade)
CREATE TABLE emp (
  empno    INTEGER PRIMARY KEY,  -- 사번
  ename_ko TEXT,                 -- 이름(한글)
  ename_en TEXT,                 -- 이름(영문)
  joblv    TEXT,                 -- 직급
  mgr      INTEGER,              -- 상사 사번
  hiredate TEXT,                 -- 입사일 (YYYY-MM-DD)
  sal      INTEGER,              -- 연봉 (만원)
  comm     INTEGER,              -- 성과급 (만원)
  deptno   INTEGER,              -- 부서 번호
  employed INTEGER               -- 재직 여부 (1 재직, 0 퇴사)
);
CREATE TABLE dept (
  deptno   INTEGER PRIMARY KEY,  -- 부서 번호
  dname    TEXT,                 -- 부서 이름
  location TEXT                  -- 위치
);
CREATE TABLE salgrade (
  grade TEXT,                    -- 급여 등급
  losal INTEGER,                 -- 등급 최소 총급여
  hisal INTEGER                  -- 등급 최대 총급여
);
{inserts("emp", ["empno", "ename_ko", "ename_en", "joblv", "mgr", "hiredate", "sal", "comm", "deptno", "employed"], EMP)}
{inserts("dept", ["deptno", "dname", "location"], DEPT)}
{inserts("salgrade", ["grade", "losal", "hisal"], SALGRADE)}
"""

# ── 가상 쇼핑몰 (2025-01 ~ 2025-07) ───────────────────────
rnd = random.Random(2025)
CHANNELS = [("검색", 0.45), ("SNS", 0.35), ("추천", 0.20)]
CITIES = [("서울", 0.40), ("경기", 0.30), ("부산", 0.12), ("대구", 0.10), ("광주", 0.08)]
CATS = {"의류": (19000, 89000), "식품": (8000, 45000), "생활": (5000, 39000), "전자": (49000, 390000)}
# 채널별: 첫 구매 확률, 다음 달 다시 살 확률
CH_PARAM = {"검색": (0.72, 0.62), "SNS": (0.64, 0.50), "추천": (0.84, 0.74)}
END = dt.date(2025, 7, 31)


def pick(pairs):
    r, acc = rnd.random(), 0
    for v, w in pairs:
        acc += w
        if r < acc:
            return v
    return pairs[-1][0]


def amount(cat):
    lo, hi = CATS[cat]
    return int(rnd.uniform(lo, hi) / 100) * 100


users, orders = [], []
uid = 0
for month in range(1, 7):
    n = [38, 42, 45, 40, 47, 44][month - 1]
    for _ in range(n):
        uid += 1
        day = rnd.randint(1, 28)
        signup = dt.date(2025, month, day)
        ch = pick(CHANNELS)
        users.append((uid, signup.isoformat(), ch, pick(CITIES)))
        first_p, keep_p = CH_PARAM[ch]
        if rnd.random() > first_p:
            continue  # 가입만 하고 한 번도 사지 않은 고객
        d = signup + dt.timedelta(days=rnd.randint(0, 9))
        k = 0
        while d <= END:
            cat = pick([("의류", 0.35), ("식품", 0.30), ("생활", 0.25), ("전자", 0.10)])
            orders.append([None, uid, d.isoformat(), cat, amount(cat)])
            k += 1
            if rnd.random() > keep_p * (0.96 ** k):
                break
            d = d + dt.timedelta(days=rnd.randint(14, 40))
orders.sort(key=lambda r: (r[2], r[1]))
for i, r in enumerate(orders, 1):
    r[0] = 10000 + i

events = []
sid = 0
for _ in range(620):
    sid += 1
    day = dt.date(2025, 7, rnd.randint(1, 31)).isoformat()
    u = rnd.randint(1, len(users)) if rnd.random() < 0.6 else None
    events.append((sid, u, day, "visit"))
    if rnd.random() < 0.55:
        events.append((sid, u, day, "view"))
        if rnd.random() < 0.32:
            events.append((sid, u, day, "cart"))
            if rnd.random() < 0.48:
                events.append((sid, u, day, "purchase"))

shop = f"""-- 가상 쇼핑몰 실습 데이터 (2025-01 ~ 2025-07). 실제 회사 데이터가 아닙니다.
CREATE TABLE users (
  user_id     INTEGER PRIMARY KEY, -- 고객 번호
  signup_date TEXT,                -- 가입일 (YYYY-MM-DD)
  channel     TEXT,                -- 가입 경로: 검색 · SNS · 추천
  city        TEXT                 -- 지역
);
CREATE TABLE orders (
  order_id   INTEGER PRIMARY KEY,  -- 주문 번호
  user_id    INTEGER,              -- 고객 번호 (users.user_id)
  order_date TEXT,                 -- 주문일 (YYYY-MM-DD)
  category   TEXT,                 -- 상품 분류
  amount     INTEGER               -- 결제 금액 (원)
);
CREATE TABLE events (
  session_id INTEGER,              -- 방문 번호
  user_id    INTEGER,              -- 고객 번호 (로그인 안 했으면 NULL)
  event_date TEXT,                 -- 날짜 (YYYY-MM-DD)
  step       TEXT                  -- visit → view → cart → purchase
);
{inserts("users", ["user_id", "signup_date", "channel", "city"], users)}
{inserts("orders", ["order_id", "user_id", "order_date", "category", "amount"], orders)}
{inserts("events", ["session_id", "user_id", "event_date", "step"], events)}
"""

for name, text in [("sql_company.sql", company), ("sql_shop.sql", shop)]:
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(text)
    print(name, len(text.encode()), "bytes")
print("users", len(users), "orders", len(orders), "events", len(events))
