<!-- 2026-11-10 진성 님이 프로젝트 스레드에 붙여 준 원고(노션 형식). 데이터 분석 트랙 PART 1(pip과 가상환경, da-00)의 주 원본.
     원고의 스크린샷 1장(pip 설명 그림)은 없어서 레슨에서는 자체 SVG로 대체했다. 보조 원본: 05-3-venv-and-packages.md -->

## 1. pip

### 1-1. pip이란?

(스크린샷: pip 설명 그림)

Python의 대부분의 라이브러리는 **pip**이라는 도구를 통해 설치하고 관리할 수 있습니다.
pip은 "**Python Installer Package**"의 약자로, PyPI(Python Package Index)에서 패키지를 검색, 다운로드, 설치, 제거, 업그레이드하는 기능을 제공합니다.

이번 글에서는 pip의 주요 명령어를 중심으로, 설치된 패키지의 **버전 확인, 제거, 업그레이드, 다운그레이드**까지 전반적인 사용법을 정리합니다.

> 💡 앞으로 데이터 분석을 하게 되면 거의 모든 라이브러리를 Python 위에서 사용하게 됩니다.
> 그런데 실제 현업에서는 라이브러리 설치 문제, 버전 충돌, 환경 문제 때문에 개발보다 환경 설정으로 시간을 더 쓰는 경우도 많습니다.

### 1-2. pip 설치

- pip 설치

```bash
python -m pip install --upgrade pip
```

- pip 버전 확인

```bash
pip --version
```

- pip list 설치된 패키지 확인

```bash
pip list
```

### 1-3. pip 명령어

| **명령어** | **설명** | **예시** |
| --- | --- | --- |
| pip --version | 설치된 pip 버전 확인 | pip --version |
| **pip list** | 설치된 패키지 목록 조회 | pip list |
| pip list \| findstr py | 특정 문자열 포함 패키지 검색 (Windows) | pip list \| findstr py |
| pip show 패키지명 | 패키지 상세 정보 확인 | pip show pandas |
| **pip install 패키지명** | 패키지 설치 | pip install numpy |
| **pip install 패키지명==버전** | 특정 버전 설치 | pip install pandas==2.2.2 |
| pip install --upgrade 패키지명 | 패키지 최신 버전 업그레이드 | pip install --upgrade numpy |
| pip install --upgrade pip | pip 자체 업그레이드 | pip install --upgrade pip |
| pip uninstall 패키지명 | 패키지 삭제 | pip uninstall matplotlib |
| pip freeze | 설치 패키지 버전 목록 출력 | pip freeze |
| pip freeze > requirements.txt | 현재 환경 패키지 저장 | pip freeze > requirements.txt |
| pip install -r requirements.txt | requirements 파일 기반 설치 | pip install -r requirements.txt |
| pip search 패키지명 | 패키지 검색 (현재는 deprecated) | pip search tensorflow |
| pip cache dir | pip 캐시 경로 확인 | pip cache dir |
| pip cache purge | pip 캐시 삭제 | pip cache purge |
| python -m pip install 패키지명 | 특정 Python 환경 기준 설치 | python -m pip install scikit-learn |
| python -m ensurepip | pip 복구/초기 설치 | python -m ensurepip |

## 2. Python 가상환경(venv) 생성

**왜 가상환경을 사용할까?**

Python 프로젝트를 진행하다 보면 라이브러리 버전 충돌이 자주 발생합니다.

```text
프로젝트 A → pandas 1.x 필요
프로젝트 B → pandas 2.x 필요
```

같은 컴퓨터에서 하나의 Python 환경만 사용하면 버전 충돌로 에러가 발생할 수 있습니다.

가상환경(`venv`)은 프로젝트마다 독립적인 Python 환경을 만들어 주기 때문에:

- 프로젝트별 라이브러리 버전 관리 가능
- 팀원 간 동일 환경 유지 가능
- 배포/협업 시 재현성 확보 가능

실무에서는 거의 필수로 사용합니다.

### 2-1. Python 설치 확인

- 실행 위치: cmd, PowerShell, Mac Terminal, VSCode Terminal
- 명령어: `python --version`
- 정상 결과 예시: `Python 3.12.5`
- 문제 발생 시: `'python' is not recognized ...` → Python 환경변수(PATH) 설정 필요
  (참고: [윈도우(Windows) 10 에서 파이썬(Python) 환경변수(Path) 설정](https://wxmin.tistory.com/121))

### 2-2. 가상환경 생성

- 실행 위치: 프로젝트 폴더 내부 터미널
- 명령어: `python -m venv venv`
- 결과: 현재 폴더에 `venv/` 디렉토리 생성

```text
my_project/
 ├── venv/
 ├── app.py
 └── requirements.txt
```

### 2-3. 가상환경 실행 (활성화)

- Windows: `.\venv\Scripts\activate`
- Mac / Linux: `source venv/bin/activate`
- 정상 상태: 터미널 앞에 `(venv)` 표시됨 — `(venv) C:\project>` (현재 Python 환경 = 프로젝트 전용 환경)

### 2-4. VSCode 인터프리터 설정 (중요)

가상환경 activate만으로는 부족합니다. VSCode가 어떤 Python을 사용할지 별도로 지정해야 합니다.

- 방법 1: `Ctrl + Shift + P` → `Python: Select Interpreter` → venv 선택
- 방법 2: 우측 하단 Python 버전 클릭 후 `venv` 선택

### 2-5. 패키지 설치

- 실행 위치: 가상환경 활성화된 터미널
- `pip install 패키지명` (예: `pip install pandas`, `pip install numpy`, `pip install matplotlib`)

### 2-6. 설치된 패키지 확인

`pip list`

### 2-7. 환경 저장 (requirements.txt)

현재 설치된 라이브러리 목록 저장: `pip freeze > requirements.txt`

```text
pandas==2.2.2
numpy==1.26.4
matplotlib==3.9.0
```

### 2-8. 환경 복원

다른 PC / 팀원이 동일 환경 설치 시 사용: `pip install -r requirements.txt` (requirements.txt 기반으로 동일 환경 구성)

### 2-9. 가상환경 종료

`deactivate` → `(venv)` 표시 제거

### .gitignore 설정 (매우 중요)

가상환경 폴더는 Git에 올리지 않습니다.

```text
venv/
__pycache__/
.ipynb_checkpoints/
.env
```

이유: 용량 큼 / OS마다 다름 / requirements.txt로 복원 가능
