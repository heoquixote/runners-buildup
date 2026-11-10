# 데이터 분석 PART 1 · 개발 환경(pip · 가상환경) 기획안 (2026-11-10)

작성 기준은 [README.md](README.md). 기호: `S` 설명, `F` 그림, `C` 실행 셀, `T` 직접 해보기, `R` 결과 해석.

진성 님 요청: "데이터 분석 부분에 pip · 가상환경(venv) 내용을 파트 1으로 빼서 넣자." 원고는 [docs/sources/python/00-pip-venv.md](../sources/python/00-pip-venv.md)(주 원본, 번호 체계를 1 · 2장으로 정리해 옮김)와 [05-3-venv-and-packages.md](../sources/python/05-3-venv-and-packages.md)(보조: 노트북 커널, 자주 겪는 문제, 실무 팁).

## 배치

| 트랙 · PART | 코스 (id) | 레슨 |
| --- | --- | --- |
| 데이터 분석 · **PART 1 개발 환경** (새로) | pip과 가상환경 (da-00, DAY 01) | da-00-1 pip: 라이브러리를 설치하고 관리하는 도구 |
| | | da-00-2 가상환경(venv): 프로젝트마다 따로 쓰는 파이썬 |
| | | da-00-3 requirements.txt로 환경 저장하고 되살리기 |
| PART 2 NumPy (기존 PART 1) | da-01 · da-02 | 그대로 (DAY 02 · 03) |
| PART 3 pandas 기초 (기존 PART 2) | da-03 · da-04 · da-05 | 그대로 (DAY 04~06) |
| PART 4 pandas 활용 (기존 PART 3) | da-06 · da-07 · da-08 | 그대로 (DAY 07~09) |

- PART 번호와 DAY 번호는 화면에서 순서로 매기므로(`SECTIONS` 순서, `dayNo`) 데이터에 번호를 적지 않는다. 새 PART를 `SECTIONS["python-da"]` 맨 앞에, 새 코스를 `COURSES`의 데이터 분석 첫 코스 앞에 넣으면 기존 PART · DAY가 하나씩 밀린다. 코스 id · 진도 · 유닛 · DAY 만족도 기록은 코스 id 기준이라 영향 없다.
- 데이터 분석 본문에 "PART n", "DAY n"을 적은 곳이 없어 고칠 문장은 없다(데이터 시각화 트랙의 "PART 3~7" 표기는 다른 트랙이라 그대로).
- **라이브러리 소개 레슨과의 관계**: NumPy 소개(da-01-0)는 계속 "NumPy PART의 첫 페이지"다. 새 PART는 라이브러리가 아니라 **환경**을 다루므로 `-0` 소개 레슨을 따로 두지 않고, 코스의 첫 레슨(da-00-1)이 그 역할을 한다. NumPy 소개의 "`pip install numpy`로 설치합니다" 문장에 pip 레슨 링크만 단다.
- **intro 코스**(`intro: true`): 연습문제(유닛) 없음. 레슨마다 판단 확인 퀴즈 2문항.
- **파이썬 기초 설치 가이드와 관계**: [설치 가이드 ③ python.org + VS Code](#/l/pb-00-4)의 "가상환경 만들고 pandas 설치"는 따라 하기 4줄짜리 맛보기다. 이 PART는 그 **이유와 원리, 전체 명령어, 팀 협업(requirements · .gitignore)** 까지 다룬다. 겹치는 Windows 실행 정책 · `python -m pip` 해결법은 링크로 연결만 하고 짧게 다시 짚는다.

## 공통 원칙

- **터미널 명령은 실행 셀이 아니다.** 브라우저 파이썬(Pyodide)에는 터미널이 없어 `pip` · `python -m venv`가 돌지 않는다. 명령과 화면 결과는 읽기 전용 블록(```bash, ```text)으로 보여 주고, 레슨 맨 앞에 "이 페이지 명령은 내 컴퓨터 터미널에서" 안내 상자를 둔다.
- **실행 셀은 '파이썬 안에서 확인하기'에만** 쓴다: 설치된 버전(`__version__`, `importlib.metadata`), 지금 파이썬 위치(`sys.executable`, `sys.prefix`), requirements 파일 읽고 비교. 버전 숫자는 환경마다 달라 본문에서 단정하지 않는다.
- **프롬프트 구분**: 학생이 가장 많이 틀리는 것은 "`pip install`을 파이썬 안(>>> · 노트북 셀)에 치는 것"이다. 터미널(`$`, `C:\>`) / 파이썬(`>>>`) / 노트북(`%pip`, `!pip`) 세 곳을 그림으로 먼저 구분한다.
- **원고 정정**: pip은 "Python Installer Package"가 아니라 **"pip installs packages"**(재귀 약자)로 알려져 있다. `pip search`는 2021년부터 PyPI 쪽에서 막혀 **에러가 난다** → pypi.org 검색으로 안내. 가상환경 폴더 이름은 원고대로 `venv`를 쓰되, 실무에서 많이 쓰는 `.venv`도 같은 뜻이라고 한 줄 덧붙인다.
- 원고의 스크린샷(pip 설명 그림)은 자체 SVG로 대체.

---

## da-00-1 pip: 라이브러리를 설치하고 관리하는 도구

- **목표**: 터미널에서 pip으로 패키지를 설치 · 확인 · 업그레이드 · 다운그레이드 · 삭제할 수 있고, `python -m pip`을 왜 쓰는지 설명한다.
- **전제 개념**: import, 표준 라이브러리 vs 외부 라이브러리([표준 라이브러리 코스](#/l/pb-13-1)에서 배움 → 한 줄로 다시 짚기).
- **알아야 할 개념**: ① 외부 라이브러리는 따로 설치해야 한다 ② pip · PyPI(앱 스토어 비유) ③ 명령을 치는 곳: 터미널 vs 파이썬 vs 노트북 ④ pip 준비: 버전 확인 · 업그레이드 · ensurepip ⑤ 설치 · 버전 지정 · 업그레이드 · 다운그레이드 · 삭제 ⑥ 버전 번호 읽기(주.부.수) ⑦ 목록 · 상세 정보(list, show, 문자열로 거르기) ⑧ `python -m pip`: 어떤 파이썬에 설치할지 ⑨ 명령어 한눈에 표 ⑩ 현업에서 환경 문제가 많은 이유(원고 aside)
- **배치**: S(시작하기 전에: import numpy가 되는 이유, 내 PC에선 ModuleNotFoundError) → C(이 사이트에서 numpy · pandas 버전 출력) → R → S(pip · PyPI 정의) → **F** pip-pypi → S(명령 치는 곳) → **F** pip-where → S(pip 준비 명령 + 결과 예시) → S(설치 · 버전 지정) → S(버전 번호 읽기) → S(업그레이드 · 다운그레이드 · 삭제) → S(list · show · findstr/grep) → C(`importlib.metadata`로 show와 같은 정보 보기) → T(패키지 이름 바꿔 보기) → S(`python -m pip`) → **F** pip-which-python → C(`sys.executable` = 지금 파이썬 위치) → S(명령어 표) → S(현업 팁 상자) → S(정리)
- **퀴즈 vs 코드**: 명령은 브라우저에서 칠 수 없어 코드 실습이 불가능하고, 배울 것이 "어디에 무엇을 치나"라는 판단이라 퀴즈 2문항(choice: 노트북 셀에서 설치하려면, choice: pandas 2.2.2로 맞추는 명령).
- **그림**: pip-pypi(PyPI 창고 → pip → 내 컴퓨터 site-packages, install/uninstall 화살표), pip-where(터미널 · 파이썬 · 노트북 세 창과 각각 맞는 입력), pip-which-python(컴퓨터에 파이썬이 둘일 때 `pip`과 `python -m pip`이 가는 곳).

## da-00-2 가상환경(venv): 프로젝트마다 따로 쓰는 파이썬

- **목표**: 프로젝트 폴더에 가상환경을 만들고, 켜고(activate), VS Code에 연결하고, 끌(deactivate) 수 있다. 왜 필요한지 버전 충돌 예로 설명한다.
- **전제 개념**: pip 설치(앞 레슨), 터미널 열기, 폴더.
- **알아야 할 개념**: ① 버전 충돌(프로젝트 A pandas 1.x, B 2.x) ② 가상환경 = 프로젝트별 패키지 보관함(필통 비유) ③ 0단계 python --version, PATH 오류 ④ 만들기 `python -m venv venv`(앞 venv는 도구, 뒤 venv는 폴더 이름) ⑤ 폴더 구조 ⑥ 켜기(Windows · macOS), `(venv)` 표시, PowerShell 실행 정책 ⑦ VS Code 인터프리터 선택 ⑧ 켠 상태에서 설치 · 확인 ⑨ 지금 가상환경 안인지 확인하는 코드 ⑩ 끄기 ⑪ 하루 작업 흐름
- **배치**: S(시작하기 전에: 버전 충돌 이야기) → **F** venv-conflict → S(가상환경 정의 · 비유 · 장점 3가지) → S(1단계 python --version, 결과 · 오류) → S(2단계 만들기) → **F** venv-folder → S(3단계 켜기, 결과 프롬프트) → S(4단계 VS Code 인터프리터) → S(5 · 6단계 설치 · 확인) → C(`sys.prefix != sys.base_prefix`로 가상환경 판별) → R(이 사이트는 False인 이유) → S(7단계 끄기) → **F** venv-workflow → S(자주 막히는 문제 표) → S(정리)
- **퀴즈 vs 코드**: 판단 퀴즈 2문항(ox: activate만 하면 VS Code ▶도 venv를 쓴다 → X, choice: (venv) 표시가 없는 터미널에서 pip install 하면 어디에 설치되나).
- **그림**: venv-conflict(한 파이썬에 두 프로젝트 → 충돌 / 가상환경 둘 → 각자 버전), venv-folder(my_project 폴더 트리, venv 안 Scripts · bin · Lib/site-packages), venv-workflow(폴더 열기 → 켜기 → 설치 · 코딩 → freeze → 끄기, 처음 한 번만 하는 단계 구분).

## da-00-3 requirements.txt로 환경 저장하고 되살리기

- **목표**: `pip freeze > requirements.txt`로 환경을 저장하고, 다른 PC에서 `pip install -r`로 되살리며, 가상환경 폴더를 Git에서 빼는 이유를 설명한다.
- **전제 개념**: 가상환경 켜기(앞 레슨), 텍스트 파일.
- **알아야 할 개념**: ① "내 컴퓨터에선 되는데" 문제 ② freeze와 requirements.txt(장보기 목록 비유) ③ `>` 는 화면 대신 파일로 보내기 ④ 파일 모양 `이름==버전` ⑤ 되살리기 `-r` ⑥ `==` vs `>=` ⑦ .gitignore와 venv를 올리지 않는 이유 ⑧ 새 팀원이 받는 전체 순서
- **배치**: S(시작하기 전에) → S(freeze 명령 · 결과) → **F** requirements-flow → C(requirements.txt 파일을 써 보고 읽기) → C(한 줄을 이름 · 버전으로 나누기) → T(내 환경 버전과 비교, 버전 하나 바꿔 보기) → R → S(되살리기 `-r`) → S(`==` vs `>=` 표) → S(.gitignore 예시 · 이유) → **F** gitignore-share → S(새 팀원 순서 6줄) → S(PART 정리 표: 명령 한 장) → S(다음 PART 안내: NumPy 소개 링크)
- **퀴즈 vs 코드**: T 셀(파일 읽고 비교)로 requirements 형식을 몸으로 익히고, 퀴즈 2문항(ox: venv 폴더도 Git에 올려야 팀원이 같은 환경 → X, choice: 팀원 PC에서 환경을 맞추는 명령).
- **그림**: requirements-flow(내 PC venv → freeze → requirements.txt → Git → 팀원 PC 새 venv → install -r), gitignore-share(저장소에 올라가는 것 / 올리지 않는 것).

## 그림 목록 (`scripts/figures_env.py` → `content/img/env/`)

| 파일 | 쓰는 레슨 |
| --- | --- |
| pip-pypi | da-00-1 |
| pip-where | da-00-1 |
| pip-which-python | da-00-1 |
| venv-conflict | da-00-2 |
| venv-folder | da-00-2 |
| venv-workflow | da-00-2 |
| requirements-flow | da-00-3 |
| gitignore-share | da-00-3 |
