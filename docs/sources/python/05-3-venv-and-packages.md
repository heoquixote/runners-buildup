## 학습 목표

- `pip`이 무엇을 하는 도구인지 설명할 수 있습니다.
- 가상환경이 왜 필요한지, 어떤 문제를 예방하는지 이해할 수 있습니다.
- 프로젝트별 실행 환경을 만드는 기본 절차를 따라 할 수 있습니다.
- `requirements.txt`, `.gitignore`, VSCode 인터프리터 설정까지 실무형 기본 습관을 익힐 수 있습니다.

## `pip`이란 무엇인가

Python의 대부분의 외부 라이브러리는 `pip`를 통해 설치하고 관리합니다.  
`pip`는 Python Package Index(PyPI)에서 패키지를 검색, 다운로드, 설치, 제거, 업그레이드하는 도구입니다.

데이터 분석을 하게 되면 거의 모든 라이브러리를 Python 위에서 사용하게 됩니다.  
그런데 실무에서는 오히려 `코드`보다 `설치`, `버전`, `환경` 문제로 시간을 더 많이 쓰는 경우도 많습니다.

그래서 `pip`와 가상환경은 문법 부가 지식이 아니라, 개발을 실제로 가능하게 만드는 기본기입니다.

## 자주 쓰는 `pip` 명령어

```bash
pip --version
pip list
pip show pandas
pip install numpy
pip install pandas==2.2.2
pip install --upgrade numpy
pip uninstall matplotlib
pip freeze
```

실무에서 특히 자주 쓰는 흐름은 아래입니다.

```bash
python -m pip install --upgrade pip
python -m pip install pandas
python -m pip install numpy
pip list
```

`python -m pip` 형태를 쓰면 현재 사용 중인 Python 환경 기준으로 설치된다는 점에서 더 안전합니다.

## 왜 가상환경이 필요한가

프로젝트마다 사용하는 라이브러리 버전이 다르면 충돌이 생길 수 있습니다.

예를 들어:

```text
프로젝트 A -> pandas 1.x 필요
프로젝트 B -> pandas 2.x 필요
```

같은 컴퓨터에서 하나의 Python 환경만 사용하면 버전 충돌로 에러가 날 수 있습니다.  
가상환경(`venv`)은 프로젝트마다 독립적인 Python 환경을 만들어 주기 때문에 다음 이점이 있습니다.

- 프로젝트별 라이브러리 버전 분리
- 팀원 간 동일 환경 유지
- 배포와 협업 시 재현성 확보
- "내 컴퓨터에서는 되는데 다른 곳에서는 안 됨" 문제 완화

## 가상환경 생성부터 활성화까지

### 1. Python 설치 확인

```bash
python --version
```

정상 예시:

```text
Python 3.12.5
```

만약 아래 같은 에러가 나면 Python PATH 설정부터 점검해야 합니다.

```text
'python' is not recognized ...
```

### 2. 가상환경 생성

프로젝트 폴더 내부에서 실행합니다.

```bash
python -m venv .venv
```

생성 후에는 보통 아래 같은 구조가 됩니다.

```text
my_project/
├── .venv/
├── app.py
└── requirements.txt
```

### 3. 가상환경 활성화

Windows:

```bash
.venv\Scripts\activate
```

macOS / Linux:

```bash
source .venv/bin/activate
```

정상적으로 활성화되면 터미널 앞에 보통 `(.venv)` 같은 표시가 붙습니다.

## 패키지 설치와 확인

가상환경을 활성화한 뒤 필요한 라이브러리를 설치합니다.

```bash
pip install pandas
pip install numpy
pip install matplotlib
pip install seaborn
```

설치가 끝났으면 목록을 확인합니다.

```bash
pip list
```

## VSCode와 Notebook에서 특히 중요한 점

가상환경을 만들었다고 해서 에디터가 자동으로 그 환경을 쓰는 것은 아닙니다.  
VSCode에서는 어떤 인터프리터를 사용할지 별도로 지정해야 합니다.

### VSCode 인터프리터 설정

- `Ctrl + Shift + P`
- `Python: Select Interpreter`
- `.venv` 선택

또는 우측 하단의 Python 버전을 클릭해서 프로젝트 가상환경을 선택할 수 있습니다.

Jupyter Notebook도 마찬가지입니다.  
Notebook이 다른 Python 커널을 바라보면, 분명 설치했는데 `ModuleNotFoundError`가 나는 상황이 자주 생깁니다.

## 환경 기록하기: `requirements.txt`

현재 설치된 패키지와 버전을 파일로 저장해 두면 다른 사람도 같은 환경을 재현할 수 있습니다.

```bash
pip freeze > requirements.txt
```

예시:

```text
pandas==2.2.2
numpy==1.26.4
matplotlib==3.9.0
```

다른 PC나 팀원이 동일 환경을 설치할 때는 아래처럼 사용합니다.

```bash
pip install -r requirements.txt
```

## 가상환경 종료

작업이 끝나면 아래 명령으로 빠져나올 수 있습니다.

```bash
deactivate
```

## `.gitignore` 설정

가상환경 폴더는 Git에 올리지 않는 것이 원칙입니다.

```text
.venv/
__pycache__/
.ipynb_checkpoints/
.env
```

이유는 단순합니다.

- 용량이 큼
- 운영체제마다 다름
- `requirements.txt`로 다시 만들 수 있음

## 자주 겪는 문제

### 1. `pip install` 했는데 import가 안 되는 경우

대부분은 `다른 Python 환경에 설치했기 때문`입니다.  
이럴 때는 아래를 확인합니다.

- 현재 터미널이 어떤 가상환경인지
- VSCode 인터프리터가 무엇인지
- Notebook 커널이 무엇인지

### 2. `pip`와 `python`이 서로 다른 환경을 보는 경우

이 문제를 줄이려면 아래 형식이 안전합니다.

```bash
python -m pip install pandas
```

### 3. 버전 충돌

어제 되던 코드가 오늘 안 되는 경우, 패키지 버전이 바뀌었을 가능성이 큽니다.  
그래서 `requirements.txt` 기록 습관이 중요합니다.

## 실무 팁

- 프로젝트 시작 시 `python -m venv .venv`로 먼저 환경을 만듭니다.
- 설치 패키지는 `requirements.txt`로 기록해 둡니다.
- VSCode 인터프리터와 Notebook 커널을 반드시 같은 환경으로 맞춥니다.
- `python -m pip` 형태를 우선 사용하면 환경 혼선을 줄일 수 있습니다.
- 팀 프로젝트에서는 설치 순서와 실행 방법을 `README`에 함께 적어두는 편이 좋습니다.
