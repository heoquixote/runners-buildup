## 학습 목표

- 파일 입출력의 핵심 구성요소인 `경로`, `모드`, `인코딩`을 설명할 수 있습니다.
- `with open(...)` 패턴을 사용해 안전하게 파일을 읽고 쓸 수 있습니다.
- `read`, `readline`, `readlines`, 반복문 순회의 차이를 상황에 맞게 선택할 수 있습니다.
- 큰 파일, 한글 파일, 상대경로 문제처럼 실무에서 자주 만나는 오류를 예방할 수 있습니다.

## 이 페이지에서 다루는 라이브러리

- `open`, 파일 객체: Python 기본 문법 수준에서 바로 사용할 수 있는 내장 기능
- `pathlib`: 표준 라이브러리

## 왜 파일 입출력이 중요한가

실무에서 Python이 하는 일의 상당수는 결국 데이터를 읽고, 가공하고, 다시 저장하는 작업입니다.

- 로그 파일 읽기
- CSV, TXT, JSON 결과 저장
- 크롤링 결과 저장
- 모델 예측 결과 내보내기
- 자동화 보고서 생성

즉, 파일 입출력은 별도 주제가 아니라 거의 모든 자동화와 분석 작업의 시작점입니다.

문제는 문법보다도 아래 항목에서 자주 발생합니다.

- 경로를 잘못 적어서 파일을 못 찾는 경우
- 한글 파일을 읽다가 인코딩 오류가 나는 경우
- 쓰기 모드를 잘못 써서 기존 파일을 덮어쓰는 경우
- 큰 파일을 한 번에 읽어 메모리를 과도하게 쓰는 경우

## 파일 열기: `open()`

파일 입출력의 기본 형태는 아래와 같습니다.

```python
f = open("sample.txt", "r", encoding="utf-8")
```

`open()`은 보통 다음 세 요소를 함께 생각하면 됩니다.

- 첫 번째 인자: 파일 경로
- 두 번째 인자: 모드
- 세 번째 인자: 인코딩

예를 들어:

```python
with open("sample.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

여기서 의미는 다음과 같습니다.

- `"sample.txt"`: 현재 작업 폴더 안에 있는 파일
- `"r"`: 읽기 모드
- `"utf-8"`: UTF-8 인코딩으로 읽기

## 파일 모드 정리

가장 자주 쓰는 모드는 아래와 같습니다.

- `"r"`: 읽기
- `"w"`: 쓰기, 기존 파일이 있으면 덮어쓰기
- `"a"`: 이어쓰기, 기존 파일 끝에 내용 추가
- `"b"`: 바이너리 모드
- `"t"`: 텍스트 모드, 기본값

자주 보이는 조합 예시는 아래와 같습니다.

- `"rb"`: 이미지, 엑셀, PDF 같은 바이너리 파일 읽기
- `"wb"`: 바이너리 파일 쓰기
- `"rt"`: 텍스트 파일 읽기

실무에서 특히 주의할 점은 `"w"`입니다.  
파일이 이미 있어도 경고 없이 내용을 덮어쓸 수 있습니다.

## 왜 `with open(...)`을 써야 하나

가장 권장되는 패턴은 `with` 문을 사용하는 방식입니다.

```python
with open("sample.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

이 패턴이 중요한 이유는 파일 사용이 끝났을 때 자동으로 닫아 주기 때문입니다.

만약 직접 열고 닫는다면 아래처럼 작성해야 합니다.

```python
f = open("sample.txt", "r", encoding="utf-8")
text = f.read()
f.close()
```

이 방식은 아래와 같은 문제가 있습니다.

- 예외가 중간에 발생하면 `close()`가 실행되지 않을 수 있음
- 코드가 길어질수록 파일을 닫는 시점을 놓치기 쉬움

따라서 실무에서는 특별한 이유가 없으면 `with open(...)`을 기본 습관으로 두는 편이 안전합니다.

## 읽기 방식 1: `read()`

파일 전체를 한 번에 문자열로 읽어 옵니다.

```python
with open("sample.txt", "r", encoding="utf-8") as f:
    text = f.read()

print(text)
```

이 방식은 다음 상황에서 편합니다.

- 파일 크기가 작을 때
- 전체 내용을 한 번에 처리해야 할 때
- 문서 전체를 문자열로 다뤄야 할 때

하지만 큰 파일에 대해서는 조심해야 합니다.  
파일 전체를 메모리에 올리기 때문에 로그 파일이나 대용량 텍스트에는 비효율적일 수 있습니다.

## 읽기 방식 2: `readline()`

한 줄씩 읽습니다.

```python
with open("sample.txt", "r", encoding="utf-8") as f:
    first_line = f.readline()
    second_line = f.readline()

print(first_line)
print(second_line)
```

한 줄 단위 구조를 가진 파일에서 특정 위치를 순차적으로 읽을 때 유용합니다.

## 읽기 방식 3: `readlines()`

모든 줄을 리스트로 반환합니다.

```python
with open("sample.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(lines)
```

반환 결과는 보통 아래와 비슷합니다.

```python
["첫째 줄\n", "둘째 줄\n", "셋째 줄\n"]
```

즉, 각 줄 끝의 줄바꿈 문자 `\n`도 함께 들어온다는 점을 기억해야 합니다.

## 읽기 방식 4: 파일 객체를 직접 순회하기

큰 파일을 다룰 때 가장 실용적인 패턴 중 하나입니다.

```python
with open("app.log", "r", encoding="utf-8") as f:
    for line in f:
        if "ERROR" in line:
            print(line.strip())
```

이 방식의 장점은 아래와 같습니다.

- 한 줄씩 순차 처리 가능
- 메모리 부담이 작음
- 로그, 텍스트, 라인 단위 포맷에 잘 맞음

실무에서 대용량 파일을 다룬다면 `read()`보다 이 패턴을 먼저 고려하는 편이 좋습니다.

## 줄바꿈 문자 제거: `strip()`

파일을 줄 단위로 읽으면 보통 각 줄 끝에 `\n`이 붙어 있습니다.

```python
with open("sample.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())
```

`strip()`은 앞뒤 공백과 줄바꿈을 제거합니다.  
다만 공백 자체가 의미 있는 데이터라면 무조건 쓰기 전에 확인이 필요합니다.

## 쓰기: `write()`

텍스트를 파일에 저장할 때는 `write()`를 사용합니다.

```python
with open("result.txt", "w", encoding="utf-8") as f:
    f.write("첫 번째 줄\n")
    f.write("두 번째 줄\n")
```

여기서 `"w"` 모드는 다음처럼 동작합니다.

- 파일이 없으면 새로 생성
- 파일이 있으면 기존 내용을 지우고 새로 작성

즉, 결과 파일을 새로 만드는 작업에는 편하지만, 원본을 보존해야 하는 상황에서는 조심해야 합니다.

## 이어쓰기: `a`

기존 파일 뒤에 내용을 추가하려면 `"a"` 모드를 사용합니다.

```python
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("2026-06-23 15:00:00, process finished\n")
```

이 패턴은 아래 같은 경우에 자주 사용합니다.

- 작업 로그 누적
- 실행 이력 저장
- 간단한 텍스트 기반 결과 append

## 여러 줄 쓰기: `writelines()`

문자열 리스트를 한 번에 쓸 수 있습니다.

```python
lines = ["A\n", "B\n", "C\n"]

with open("alphabet.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)
```

다만 `writelines()`는 줄바꿈을 자동으로 넣어 주지 않습니다.  
리스트 원소 안에 `\n`을 직접 포함해야 합니다.

## 인코딩이 중요한 이유

한글 환경에서는 인코딩이 가장 흔한 문제 중 하나입니다.

```python
with open("korean.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

가능하면 `encoding="utf-8"`을 명시적으로 적는 습관이 좋습니다.

이유는 다음과 같습니다.

- 운영체제별 기본 인코딩이 다를 수 있음
- 파일 생성 도구에 따라 `cp949`, `euc-kr`, `utf-8-sig` 등이 섞일 수 있음
- 내 컴퓨터에서는 되는데 다른 환경에서는 깨질 수 있음

실무에서 자주 보는 오류는 아래와 같습니다.

- `UnicodeDecodeError`: 읽는 인코딩이 실제 파일 인코딩과 다를 때
- 글자가 깨져 보이는 현상: 저장 인코딩과 읽기 인코딩이 맞지 않을 때

예를 들어 엑셀에서 저장된 CSV는 종종 `cp949` 계열로 저장되기도 합니다.

```python
with open("legacy_korean.csv", "r", encoding="cp949") as f:
    text = f.read()
```

따라서 인코딩 문제는 문법 실수라기보다 파일 생성 환경 차이에서 자주 생긴다고 이해하는 편이 정확합니다.

## 상대경로와 절대경로

파일을 못 읽는 가장 흔한 이유는 사실 문법보다 경로 문제입니다.

```python
with open("data/sample.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

이 경로는 "현재 작업 디렉토리"를 기준으로 해석됩니다.  
즉, 코드 파일이 어디 있는지가 아니라 프로그램이 어느 폴더 기준으로 실행되느냐가 중요합니다.

Notebook이나 IDE에서는 특히 이 차이 때문에 혼란이 자주 생깁니다.

작업 위치를 확인하고 싶다면:

```python
from pathlib import Path

print(Path.cwd())
```

## 자주 발생하는 오류

### `FileNotFoundError`

원인:

- 파일명이 틀림
- 폴더 위치가 다름
- 상대경로 기준이 예상과 다름

대응:

- 현재 작업 폴더 확인
- `Path.cwd()` 확인
- 파일 존재 여부 먼저 체크

```python
from pathlib import Path

path = Path("data/sample.txt")
print(path.exists())
```

### `UnicodeDecodeError`

원인:

- 잘못된 인코딩으로 읽음

대응:

- `utf-8`, `cp949`, `utf-8-sig` 등을 확인
- 파일이 어디서 생성됐는지 확인

### `PermissionError`

원인:

- 읽기/쓰기 권한이 없음
- 다른 프로그램이 파일을 점유 중

대응:

- 경로와 권한 확인
- 열려 있는 엑셀, 메모장, 다른 프로세스 확인

## 실무 예제: 오류 로그만 추출하기

```python
from pathlib import Path

log_path = Path("app.log")
error_lines = []

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        if "ERROR" in line:
            error_lines.append(line.strip())

with open("error_only.txt", "w", encoding="utf-8") as f:
    for line in error_lines:
        f.write(line + "\n")
```

이 예제에서 핵심은 단순히 문법이 아닙니다.

- 큰 파일이면 한 줄씩 읽는 것이 안전함
- 결과 저장은 별도 파일로 남기는 편이 검토에 유리함
- 원본 파일은 건드리지 않고, 가공 결과만 새 파일로 저장하는 것이 추적에 좋음

## 어떤 읽기 방식을 선택해야 할까

- 파일 전체가 작고, 전체 문자열이 필요하다면 `read()`
- 몇 줄만 순차적으로 읽는다면 `readline()`
- 줄 단위 리스트가 필요하다면 `readlines()`
- 파일이 크거나 실무 로그 처리라면 `for line in f`

즉, 정답은 하나가 아니라 파일 크기와 처리 목적에 따라 달라집니다.

## 정리

- 파일 입출력의 핵심은 `경로`, `모드`, `인코딩`입니다.
- `with open(...)`은 거의 기본값처럼 사용해도 좋습니다.
- 텍스트 파일은 가능한 한 `encoding="utf-8"`을 명시하는 습관이 좋습니다.
- 큰 파일은 한 줄씩 읽는 방식이 더 안전합니다.
- 실무에서 자주 터지는 문제는 문법보다 경로와 인코딩입니다.
