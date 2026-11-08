# 공개 데이터 원본 → datasets/ 의 정리본을 만든다.  python3 scripts/build_open_data.py <원본 폴더> datasets
# 원본 파일 이름과 받은 곳은 datasets/README.md 에 적어 두었다. 열 이름은 소문자 snake_case, 그래프 글자가 영어이므로 값도 영어 그대로 둔다.
import csv, sqlite3, re, sys, os
import pandas as pd
RAW, OUT = sys.argv[1], sys.argv[2]

# 1) 서울 따릉이
s = pd.read_csv(f"{RAW}/seoul_a.csv", encoding="latin-1")
s.columns = ["date","rented_bikes","hour","temp","humidity","wind_speed","visibility","dew_point","solar_rad","rainfall","snowfall","season","holiday","functioning_day"]
s["date"] = pd.to_datetime(s["date"], format="%d/%m/%Y").dt.strftime("%Y-%m-%d")
s["holiday"] = s["holiday"].map({"Holiday":"Yes","No Holiday":"No"})
s = s.drop(columns=["visibility","dew_point"])
s.to_csv(f"{OUT}/seoul_bike.csv", index=False)

# 2) Gapminder
g = pd.read_csv(f"{RAW}/08_gap-every-five-years.tsv", sep="\t")
g = g.rename(columns={"lifeExp":"life_exp","gdpPercap":"gdp_per_cap"})[["country","continent","year","life_exp","pop","gdp_per_cap"]]
g["life_exp"] = g["life_exp"].round(1); g["gdp_per_cap"] = g["gdp_per_cap"].round(1)
g.to_csv(f"{OUT}/gapminder.csv", index=False)

# 3) Galton (인치 → cm)
ga = pd.read_csv(f"{RAW}/GaltonFamilies.csv").drop(columns=["rownames"])
for c in ["father","mother","midparentHeight","childHeight"]:
    ga[c] = (ga[c]*2.54).round(1)
ga = ga.rename(columns={"midparentHeight":"midparent","childNum":"child_num","childHeight":"child"})
ga["family"] = ga["family"].astype(str)
ga.to_csv(f"{OUT}/galton.csv", index=False)

# 4) Datasaurus
d = pd.read_csv(f"{RAW}/DatasaurusDozen-Long.tsv", sep="\t")
d.columns = ["dataset","x","y"]
d.to_csv(f"{OUT}/datasaurus.csv", index=False)

# 5) Steel plates (원본 Faults.NNA: 27 특성 + 7 결함 원-핫)
feat = ["x_min","x_max","y_min","y_max","pixels_areas","x_perimeter","y_perimeter","sum_luminosity","min_luminosity","max_luminosity",
        "conveyer_length","steel_a300","steel_a400","thickness","edges_index","empty_index","square_index","outside_x_index",
        "edges_x_index","edges_y_index","outside_global_index","log_areas","log_x_index","log_y_index","orientation_index",
        "luminosity_index","sigmoid_areas"]
faults = ["Pastry","Z_Scratch","K_Scratch","Stains","Dirtiness","Bumps","Other_Faults"]
st = pd.read_csv(f"{RAW}/Faults.NNA", sep=r"\s+", header=None)
assert st.shape == (1941, 34), st.shape
st.columns = feat + faults
assert (st[faults].sum(axis=1) == 1).all()
st["fault"] = st[faults].idxmax(axis=1)
st["steel_type"] = st["steel_a300"].map({1:"A300",0:"A400"})
st = st.drop(columns=faults+["steel_a300","steel_a400"])
cols = ["steel_type"] + [c for c in st.columns if c not in ("steel_type","fault")] + ["fault"]
st[cols].to_csv(f"{OUT}/steel_faults.csv", index=False)

# 6) Chinook → snake_case 소문자 테이블
src = sqlite3.connect(":memory:")
src.executescript(open(f"{RAW}/Chinook_Sqlite.sql", encoding="utf-8-sig").read())
snake = lambda n: re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "_", n).lower()
tables = ["Artist","Album","Genre","MediaType","Track","Playlist","PlaylistTrack","Employee","Customer","Invoice","InvoiceLine"]
out = ["-- Chinook 음원 판매 DB (Luis Rocha, MIT 라이선스) · 러너즈빌드업용으로 테이블 · 열 이름을 소문자 snake_case 로 바꿈", "PRAGMA foreign_keys = OFF;"]
for t in tables:
    info = src.execute(f'PRAGMA table_info("{t}")').fetchall()
    fks = src.execute(f'PRAGMA foreign_key_list("{t}")').fetchall()
    pk = [r[1] for r in sorted(info, key=lambda r: r[5]) if r[5]]
    defs = []
    for cid, name, typ, notnull, dflt, ispk in info:
        typ = re.sub(r"\(.*\)", "", typ).upper()
        typ = {"NVARCHAR":"TEXT","VARCHAR":"TEXT","DATETIME":"TEXT","NUMERIC":"REAL"}.get(typ, typ)
        defs.append(f"  {snake(name)} {typ}" + (" NOT NULL" if notnull else ""))
    defs.append(f"  PRIMARY KEY ({', '.join(snake(p) for p in pk)})")
    for fk in fks:
        defs.append(f"  FOREIGN KEY ({snake(fk[3])}) REFERENCES {snake(fk[2])} ({snake(fk[4])})")
    out.append(f"CREATE TABLE {snake(t)} (\n" + ",\n".join(defs) + "\n);")
    rows = src.execute(f'SELECT * FROM "{t}"').fetchall()
    def lit(v):
        if v is None: return "NULL"
        if isinstance(v, (int, float)): return repr(v)
        if isinstance(v, str) and re.fullmatch(r"\d{4}-\d\d-\d\d 00:00:00", v): v = v[:10]
        return "'" + str(v).replace("'", "''") + "'"
    for i in range(0, len(rows), 200):
        chunk = rows[i:i+200]
        out.append(f"INSERT INTO {snake(t)} VALUES\n" + ",\n".join("(" + ",".join(lit(v) for v in r) + ")" for r in chunk) + ";")
open(f"{OUT}/chinook.sql", "w", encoding="utf-8").write("\n".join(out) + "\n")
print("tables:", [snake(t) for t in tables])
