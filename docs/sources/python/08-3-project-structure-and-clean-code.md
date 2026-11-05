## 학습 목표

- 작은 스크립트와 프로젝트형 코드의 차이를 설명할 수 있습니다.
- 파일 분리, 이름 짓기, 함수 크기 같은 기본 구조 원칙을 이해할 수 있습니다.
- 나중에 다시 읽어도 이해되는 코드를 만드는 기준을 세울 수 있습니다.

## 사용 라이브러리

- 표준 라이브러리: `pathlib`
- 외부 라이브러리: 없음

## 왜 프로젝트 구조가 중요한가

입문 단계에서는 코드가 돌아가기만 하면 만족하기 쉽습니다. 하지만 실제 업무나 협업에서는 `나중에 다시 읽고 수정할 수 있는 코드`가 훨씬 중요합니다.

한 번 실행하고 끝나는 코드와 반복해서 관리해야 하는 코드는 설계 기준이 다릅니다.

## 스크립트와 프로젝트의 차이

### 작은 스크립트

- 파일 1개
- 일회성 실행
- 빠르게 결과 확인

### 프로젝트형 코드

- 여러 파일로 분리
- 재사용 가능
- 수정과 확장이 자주 발생
- 협업 가능성 존재

즉, 코드 규모가 커질수록 `구조`가 중요해집니다.

## 유지보수 가능한 코드의 기본 원칙

### 1. 이름이 의미를 드러내야 한다

```python
result = 120000
```

보다

```python
total_sales = 120000
```

이 훨씬 좋습니다.

변수명, 함수명, 파일명은 모두 문서 역할을 합니다.

### 2. 한 함수는 한 가지 일을 하게 한다

좋지 않은 예:

```python
def process_data():
    # 파일 읽기
    # 전처리
    # 저장
    # 로그 출력
```

더 나은 예:

```python
def load_data():
    ...

def transform_data():
    ...

def save_data():
    ...
```

## 파일 분리 기준

파일을 너무 잘게 쪼개는 것도, 모든 코드를 한 파일에 몰아넣는 것도 좋지 않습니다.

입문 단계에서는 보통 다음 정도가 자연스럽습니다.

```text
project/
  main.py
  utils.py
  data/
  output/
```

예를 들어:

- `main.py`: 실행 진입점
- `utils.py`: 공통 함수
- `data/`: 입력 파일
- `output/`: 결과 파일

## `if __name__ == "__main__"`의 역할

```python
def main():
    print("실행 시작")


if __name__ == "__main__":
    main()
```

이 구조의 장점:

- 파일을 직접 실행할 수도 있고
- 다른 파일에서 함수만 가져다 쓸 수도 있습니다

재사용성과 실행 구조를 분리하는 기본 패턴입니다.

## 좋은 함수의 특징

- 이름만 봐도 역할이 보입니다
- 입력과 출력이 분명합니다
- 너무 길지 않습니다
- 부수효과가 적습니다

예:

```python
def calculate_total_sales(sales_list):
    total = 0
    for sales in sales_list:
        total += sales
    return total
```

이 함수는:

- 입력: `sales_list`
- 출력: 총합

이 명확합니다.

## 주석은 어떻게 써야 하나

좋은 주석은 `코드가 왜 필요한지`를 설명합니다.

좋지 않은 주석:

```python
# total에 sales를 더한다
total += sales
```

이건 코드가 이미 말하고 있습니다.

더 좋은 주석:

```python
# 환불된 주문은 매출에서 제외한다
if not order["is_refunded"]:
    total += order["amount"]
```

즉, 코드 자체보다 `의도`를 설명하는 쪽이 가치가 큽니다.

## 하드코딩 줄이기

좋지 않은 예:

```python
file_path = "/Users/name/Desktop/report.csv"
```

더 나은 예:

```python
from pathlib import Path

base_dir = Path("data")
file_path = base_dir / "report.csv"
```

경로, 날짜, 설정값, 임계값은 가능한 한 코드 여기저기에 흩뿌리지 않는 것이 좋습니다.

## 프로젝트 구조 예시

```text
sales_report_project/
  main.py
  report_utils.py
  data/
    sales.csv
  output/
    summary.txt
```

### `main.py`

- 실행 흐름 제어

### `report_utils.py`

- 데이터 읽기
- 변환
- 저장 함수

이 정도만 지켜도 코드의 재사용성과 가독성이 크게 좋아집니다.

## Notebook만으로 끝내면 생기는 한계

분석 입문에서는 Notebook이 매우 유용하지만, Notebook만으로 학습하면 다음 지점에서 막히기 쉽습니다.

- 함수 재사용
- 파일 분리
- 배포
- 스크립트 자동화
- 협업 버전 관리

그래서 실무형 Python에서는 `스크립트 구조`를 같이 익히는 것이 중요합니다.

## 코드 냄새를 알아보는 기준

다음 신호가 보이면 구조를 다시 점검할 필요가 있습니다.

- 함수가 너무 길다
- 같은 코드가 여러 번 반복된다
- 파일 하나에 모든 로직이 몰려 있다
- 변수명이 `a`, `x`, `tmp`처럼 의미가 없다
- 어디서 값이 바뀌는지 추적하기 어렵다

## 실무에서 자주 하는 실수

### 1. 처음부터 완벽한 구조를 만들려 함

초보 단계에서는 과도한 아키텍처보다 `단순하지만 읽히는 구조`가 더 중요합니다.

### 2. 모든 코드를 한 파일에 넣음

처음에는 편하지만 조금만 커져도 수정이 어려워집니다.

### 3. 너무 이른 추상화

아직 반복 패턴이 확인되지 않았는데 과하게 일반화하면 오히려 복잡해집니다.

### 4. 함수 이름이 모호함

`process()`, `run()`, `do_task()` 같은 이름은 역할을 잘 드러내지 못합니다.

## 추천 정리 방식

작은 프로젝트를 만들 때는 다음 흐름을 추천합니다.

1. 먼저 한 파일에서 동작하게 만든다
2. 반복되는 코드를 함수로 뽑는다
3. 역할이 분리되면 파일을 나눈다
4. 경로와 설정값을 정리한다
5. 실행 진입점 `main()`을 만든다

## 추천 예제

```python
from pathlib import Path


def load_lines(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.readlines()


def count_non_empty_lines(lines):
    return sum(1 for line in lines if line.strip())


def main():
    file_path = Path("data") / "notes.txt"
    lines = load_lines(file_path)
    line_count = count_non_empty_lines(lines)
    print(f"비어 있지 않은 줄 수: {line_count}")


if __name__ == "__main__":
    main()
```

작은 예제지만 구조적으로 좋은 습관이 담겨 있습니다.

- 역할 분리
- 의미 있는 이름
- 경로 관리
- 실행 진입점 분리

## 정리

이번 페이지의 핵심은 다음입니다.

- 코드가 돌아가는 것과 유지보수 가능한 것은 다릅니다.
- 좋은 구조는 이름, 함수 분리, 파일 분리에서 시작됩니다.
- 작은 스크립트도 프로젝트처럼 생각하는 습관이 쌓이면 실무 전환이 훨씬 부드러워집니다.

이 기준을 익혀 두면 이후 자동화 스크립트, 데이터 분석 코드, API 연동 코드도 훨씬 안정적으로 확장할 수 있습니다.
