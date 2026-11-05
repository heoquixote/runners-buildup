## 학습 목표

- 반복 업무를 입력, 처리, 출력 구조로 바꿔 생각할 수 있습니다.
- 자동화 스크립트의 기본 설계 단계를 설명할 수 있습니다.
- 파일명, 날짜, 예외 처리 같은 운영 포인트를 놓치지 않을 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: `pathlib`, `datetime`, `csv`, `json`, `shutil`
- 외부 라이브러리: 상황에 따라 `pandas`, `requests`

## 왜 자동화 스크립트가 중요한가

실무에서 Python이 가장 빠르게 가치를 만드는 순간은 거창한 시스템을 만들 때가 아니라 `반복 업무를 줄일 때`인 경우가 많습니다.

예:

- 매일 같은 CSV를 정리해서 저장
- 여러 파일 이름을 규칙에 맞게 변경
- API에서 데이터를 받아 리포트로 저장
- 특정 폴더의 파일을 조건별로 분류

자동화의 핵심은 어려운 기술보다 `사람이 하던 절차를 분해하는 사고방식`입니다.

## 자동화는 입력, 처리, 출력으로 나눈다

대부분의 자동화 스크립트는 이 세 단계로 생각할 수 있습니다.

### 입력

- 파일
- 폴더
- 사용자 입력
- API 응답

### 처리

- 필터링
- 변환
- 집계
- 이름 변경
- 형식 통일

### 출력

- 새 파일 저장
- 콘솔 로그 출력
- 요약 리포트 생성
- 다른 시스템으로 전송

이 구조로 나누면 복잡한 작업도 설계가 쉬워집니다.

## 좋은 자동화 스크립트의 기본 흐름

```python
from pathlib import Path

input_dir = Path("input")
output_dir = Path("output")
output_dir.mkdir(exist_ok=True)

for file_path in input_dir.glob("*.csv"):
    print(f"{file_path.name} 처리 중")
    # 읽기
    # 가공
    # 저장
```

자동화 스크립트는 보통 다음 요소를 가집니다.

- 입력 위치
- 처리 규칙
- 출력 위치
- 예외 처리
- 실행 로그

## 자동화 전에 먼저 해야 할 질문

### 1. 사람이 지금 어떤 순서로 작업하는가

작업 순서를 명확히 적어보면 자동화 포인트가 보입니다.

### 2. 입력 데이터는 항상 같은 형식인가

형식이 매번 다르면 예외 처리가 중요해집니다.

### 3. 결과물이 어디에 저장되어야 하는가

자동화는 처리만이 아니라 `운영 가능한 출력 구조`가 중요합니다.

### 4. 실패했을 때 어떻게 알릴 것인가

무조건 멈출지, 일부만 건너뛸지 기준이 필요합니다.

## 파일 자동화에서 자주 쓰는 도구

### `pathlib`

경로를 더 안전하게 다룰 수 있습니다.

```python
from pathlib import Path

base_dir = Path("data")
csv_files = list(base_dir.glob("*.csv"))
```

### `datetime`

실행 날짜를 파일명에 넣거나 로그에 남길 때 유용합니다.

```python
from datetime import datetime

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
print(timestamp)
```

### `csv`, `json`

표준 포맷을 읽고 저장할 때 자주 사용합니다.

## 예제 1: 파일 이름 일괄 변경

```python
from pathlib import Path

folder = Path("reports")

for idx, file_path in enumerate(folder.glob("*.txt"), start=1):
    new_name = f"report_{idx:03d}.txt"
    new_path = file_path.with_name(new_name)
    file_path.rename(new_path)
    print(f"{file_path.name} -> {new_name}")
```

이런 자동화는 사람이 하면 실수하기 쉽고, Python이 하면 정확합니다.

## 예제 2: CSV 읽어서 요약 저장

```python
import csv
from pathlib import Path

input_file = Path("sales.csv")
output_file = Path("summary.txt")

total = 0

with input_file.open("r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        total += int(row["sales"])

with output_file.open("w", encoding="utf-8") as file:
    file.write(f"총 매출: {total}\n")
```

이 구조는 작은 ETL의 축소판이라고 볼 수 있습니다.

## 운영 관점에서 중요한 포인트

### 1. 원본 파일을 덮어쓸지 여부

원본을 직접 수정하면 복구가 어렵습니다. 가능하면 `output` 폴더를 따로 두는 편이 안전합니다.

### 2. 파일명 규칙

날짜, 버전, 배치 번호를 파일명에 넣으면 나중에 추적하기 쉽습니다.

```python
report_name = f"sales_summary_{timestamp}.txt"
```

### 3. 로그 출력

자동화는 사람이 손으로 하나하나 확인하지 않기 때문에, 어떤 파일이 처리되었는지 로그가 매우 중요합니다.

### 4. 예외 처리

한 개 파일 오류 때문에 전체 작업이 멈춰야 하는지, 아니면 해당 파일만 건너뛸지 정책이 필요합니다.

## 실무에서 자주 하는 실수

### 1. 절차를 분해하지 않고 바로 코드를 쓰기

입력, 처리, 출력을 먼저 나누지 않으면 코드가 금방 복잡해집니다.

### 2. 원본 파일을 바로 덮어쓰기

실수 시 복구가 어렵습니다.

### 3. 로그 없이 자동화하기

성공했는지 실패했는지 나중에 알 수 없습니다.

### 4. 예외 상황을 전혀 고려하지 않기

빈 파일, 잘못된 형식, 없는 폴더 같은 현실적인 문제가 항상 존재합니다.

## 추천 자동화 사고 흐름

1. 사람이 수동으로 하는 절차를 적는다
2. 입력과 출력 형식을 정의한다
3. 작은 샘플 데이터로 먼저 검증한다
4. 원본 훼손 없이 결과를 따로 저장한다
5. 마지막에 로그와 예외 처리를 추가한다

## 정리

이번 페이지의 핵심은 다음입니다.

- 자동화는 거창한 기술보다 절차 분해가 먼저입니다.
- 입력, 처리, 출력 구조로 보면 설계가 쉬워집니다.
- 운영 환경에서는 파일명, 로그, 예외 처리까지 포함해야 자동화가 완성됩니다.

이 감각이 생기면 이후 작은 스크립트도 단순 연습용이 아니라 실제 업무 도구처럼 설계할 수 있게 됩니다.
