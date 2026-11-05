## 학습 목표

- CSV와 JSON의 구조적 차이를 설명할 수 있습니다.
- `csv.reader`, `csv.DictReader`, `csv.writer`, `json.load`, `json.dump`를 사용할 수 있습니다.
- 어떤 상황에서 CSV를 쓰고, 어떤 상황에서 JSON을 쓰는 것이 적절한지 판단할 수 있습니다.
- 인코딩, 헤더, 타입 변환, 줄바꿈 처리 같은 실무 이슈를 예방할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `csv`: 표준 라이브러리
- `json`: 표준 라이브러리

## 왜 CSV와 JSON을 함께 배워야 할까

파일 포맷은 데이터를 어떻게 표현하느냐의 문제입니다.

- CSV는 `행과 열` 중심
- JSON은 `키와 값`, 그리고 `중첩 구조` 중심

현업에서는 이 두 포맷이 가장 자주 등장합니다.

- SQL 결과 저장
- Excel과 데이터 교환
- API 응답 저장
- 설정 파일 관리
- 중간 전처리 산출물 기록

즉, CSV와 JSON을 이해하면 표 형태 데이터와 계층형 데이터를 모두 다룰 수 있습니다.

## CSV란 무엇인가

CSV는 `Comma-Separated Values`의 약자입니다.  
이름은 쉼표 구분이지만, 실제로는 탭이나 세미콜론을 쓰는 변형도 많습니다.

예를 들어 아래 데이터는:

```text
name,age,city
jin,30,Seoul
seo,28,Busan
```

다음과 같은 구조입니다.

- 첫 줄: 보통 헤더
- 이후 줄: 각 행 데이터

CSV는 구조가 단순해서 거의 모든 도구와 잘 호환됩니다.

## CSV의 장점과 한계

장점:

- 가볍고 단순함
- 엑셀, 데이터베이스, Python, BI 도구와 호환성이 높음
- 사람이 열어 봐도 이해하기 쉬움

한계:

- 숫자, 문자열, 날짜 같은 타입 정보가 명시적으로 보존되지 않음
- 중첩 구조 표현이 어려움
- 컬럼 안에 쉼표, 줄바꿈, 따옴표가 있으면 처리 규칙을 알아야 함

즉, CSV는 표 데이터에는 강하지만 구조가 복잡해질수록 한계가 명확해집니다.

## CSV 읽기: `csv.reader`

가장 기본적인 방식은 `csv.reader`입니다.

```python
import csv

with open("users.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
```

결과는 보통 리스트 단위로 나옵니다.

```python
["name", "age", "city"]
["jin", "30", "Seoul"]
["seo", "28", "Busan"]
```

여기서 중요한 점이 있습니다.  
CSV에서 읽은 값은 기본적으로 문자열입니다.

즉:

```python
row[1]
```

은 숫자처럼 보여도 실제로는 `"30"`일 가능성이 큽니다.  
계산하려면 `int()`나 `float()`로 변환해야 합니다.

## CSV 읽기: `csv.DictReader`

실무에서는 컬럼명을 기준으로 다루는 편이 훨씬 읽기 쉽습니다.

```python
import csv

with open("users.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"], row["city"])
```

각 행은 딕셔너리처럼 다룰 수 있습니다.

```python
{"name": "jin", "age": "30", "city": "Seoul"}
```

이 방식의 장점은 다음과 같습니다.

- 인덱스 번호를 외울 필요가 없음
- 컬럼 순서가 바뀌어도 비교적 안전함
- 코드 가독성이 좋아짐

분석, QAQC, 데이터 검증 로직에서는 `DictReader`가 특히 실용적입니다.

## CSV 쓰기: `csv.writer`

리스트 형태의 데이터를 저장할 때 가장 기본적인 방법입니다.

```python
import csv

rows = [
    ["name", "age", "city"],
    ["jin", 30, "Seoul"],
    ["seo", 28, "Busan"],
]

with open("result.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)
```

여기서 `newline=""`가 중요합니다.  
특히 Windows 환경에서는 이것을 빼면 빈 줄이 하나씩 더 들어가는 문제가 생길 수 있습니다.

즉, `csv.writer`를 쓸 때는 거의 습관처럼 `newline=""`를 같이 적는 편이 좋습니다.

## CSV 쓰기: `csv.DictWriter`

딕셔너리 데이터를 컬럼명 기준으로 저장하고 싶을 때 사용합니다.

```python
import csv

rows = [
    {"name": "jin", "age": 30, "city": "Seoul"},
    {"name": "seo", "age": 28, "city": "Busan"},
]

with open("result.csv", "w", encoding="utf-8", newline="") as f:
    fieldnames = ["name", "age", "city"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
```

이 방식은 아래와 같은 상황에서 좋습니다.

- 데이터가 딕셔너리 구조일 때
- 컬럼 순서를 명확하게 제어하고 싶을 때
- 일부 컬럼만 골라 내보내고 싶을 때

## 구분자가 쉼표가 아닐 수도 있다

모든 CSV가 진짜 쉼표를 쓰는 것은 아닙니다.  
실무에서는 탭, 세미콜론 등도 자주 등장합니다.

예를 들어 탭 구분 파일이라면:

```python
import csv

with open("users.tsv", "r", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter="\t")
    for row in reader:
        print(row)
```

즉, 파일 확장자보다 실제 구분 문자가 무엇인지 확인하는 습관이 중요합니다.

## JSON이란 무엇인가

JSON은 `JavaScript Object Notation`의 약자이지만, 지금은 거의 모든 언어에서 쓰는 범용 포맷입니다.

예를 들어:

```json
{
  "name": "jin",
  "age": 30,
  "skills": ["python", "sql"],
  "is_active": true
}
```

JSON은 CSV와 달리 다음 구조를 표현할 수 있습니다.

- 딕셔너리 구조
- 리스트 구조
- 중첩 객체
- 배열 안의 객체 목록

즉, API 응답, 설정 파일, 복합 데이터 저장에는 JSON이 더 자연스럽습니다.

## JSON과 Python 자료형 대응

JSON을 Python에서 다룰 때는 보통 아래처럼 대응됩니다.

- JSON 객체 `{}` -> Python 딕셔너리 `dict`
- JSON 배열 `[]` -> Python 리스트 `list`
- 문자열 -> `str`
- 숫자 -> `int`, `float`
- `true` / `false` -> `True` / `False`
- `null` -> `None`

이 대응 관계를 이해하면 `json.load()` 결과를 훨씬 쉽게 읽을 수 있습니다.

## JSON 읽기: `json.load`

파일에서 JSON 데이터를 읽어 Python 객체로 바꿉니다.

```python
import json

with open("config.json", "r", encoding="utf-8") as f:
    config = json.load(f)

print(config["name"])
print(config["skills"])
```

반환 결과는 대개 딕셔너리 또는 리스트입니다.

## JSON 쓰기: `json.dump`

Python 객체를 JSON 파일로 저장할 때 사용합니다.

```python
import json

data = {
    "name": "jin",
    "skills": ["python", "sql"],
    "project": {"title": "QAQC automation", "status": "active"},
}

with open("config.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

여기서 자주 쓰는 옵션은 다음과 같습니다.

- `ensure_ascii=False`: 한글이 `\uXXXX` 형태로 이스케이프되지 않게 함
- `indent=2`: 사람이 읽기 좋게 들여쓰기 적용

한글이 포함된 JSON을 저장한다면 `ensure_ascii=False`를 거의 기본값처럼 생각해도 좋습니다.

## 문자열 기반 처리: `loads`, `dumps`

파일이 아니라 문자열을 직접 다루는 경우도 있습니다.

```python
import json

text = '{"name": "jin", "age": 30}'
data = json.loads(text)

json_text = json.dumps(data, ensure_ascii=False)
```

정리하면:

- `load`, `dump`: 파일 기준
- `loads`, `dumps`: 문자열 기준

## CSV와 JSON 중 무엇을 선택해야 할까

### CSV가 더 적합한 경우

- 행과 열이 명확한 표 데이터
- 엑셀과 주고받아야 하는 경우
- SQL 결과를 저장하는 경우
- pandas로 바로 읽어 분석할 데이터

### JSON이 더 적합한 경우

- API 응답 저장
- 설정 파일
- 중첩 구조 데이터
- 한 레코드 안에 리스트나 딕셔너리가 들어가는 경우

즉, 구조가 단순하고 표 중심이면 CSV, 구조가 유연하고 계층적이면 JSON이 자연스럽습니다.

## 실무 예제 1: CSV 읽어서 조건에 맞는 행만 저장

```python
import csv

adult_rows = []

with open("users.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        if int(row["age"]) >= 20:
            adult_rows.append(row)

with open("adult_users.csv", "w", encoding="utf-8", newline="") as f:
    fieldnames = ["name", "age", "city"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(adult_rows)
```

이 예제는 분석 전처리에서 매우 흔한 흐름입니다.

- 읽고
- 조건을 걸고
- 다시 저장

## 실무 예제 2: 설정 파일을 JSON으로 관리

```python
import json

config = {
    "database": {
        "host": "localhost",
        "port": 5432,
    },
    "paths": {
        "input": "data/raw",
        "output": "data/output",
    },
}

with open("settings.json", "w", encoding="utf-8") as f:
    json.dump(config, f, ensure_ascii=False, indent=2)
```

이 구조를 CSV로 표현하려 하면 매우 어색해집니다.  
이처럼 중첩 구조는 JSON이 훨씬 자연스럽습니다.

## 자주 발생하는 문제

### CSV는 숫자도 문자열로 읽힌다

CSV는 타입 정보를 엄격하게 보존하지 않습니다.

```python
age = row["age"]
print(type(age))
```

보통 `str`이므로 계산 전 형 변환이 필요합니다.

### 쉼표가 포함된 컬럼

주소, 설명문처럼 쉼표가 들어간 텍스트는 따옴표 처리 규칙이 중요합니다.  
직접 문자열로 CSV를 만들기보다 `csv.writer`를 쓰는 편이 안전합니다.

### JSON은 주석을 공식 지원하지 않는다

설정 파일처럼 쓰다 보면 주석을 달고 싶어질 수 있지만 표준 JSON은 주석을 허용하지 않습니다.

### JSON은 사람이 읽기 쉽게 저장하는 옵션이 중요하다

`indent` 없이 저장하면 한 줄로 길게 붙어 가독성이 떨어질 수 있습니다.

## 정리

- CSV는 표 형태 데이터에 적합하고, JSON은 계층형 데이터에 적합합니다.
- `csv.DictReader`와 `csv.DictWriter`는 실무에서 특히 자주 쓰입니다.
- JSON 저장 시에는 `ensure_ascii=False`, `indent=2` 조합이 매우 유용합니다.
- CSV의 핵심 실수 포인트는 `타입`, `구분자`, `newline`, `인코딩`입니다.
- JSON의 핵심 실수 포인트는 `구조 이해`, `한글 처리`, `파일 기준과 문자열 기준 함수 구분`입니다.
