## 학습 목표

- `pickle`과 `joblib`이 모델 저장에서 어떻게 다른지 설명할 수 있습니다.
- `API`가 왜 모델 배포의 기본 인터페이스가 되는지 이해할 수 있습니다.
- `FastAPI`로 간단한 예측 API를 만드는 흐름을 설명할 수 있습니다.
- `Docker`가 배포 환경을 왜 안정화하는지 말할 수 있습니다.
- 모델 학습, 저장, API 서빙, 컨테이너 배포를 하나의 흐름으로 연결할 수 있습니다.

## 초심자용 한 줄 요약

모델 배포는 `학습한 모델 파일을 저장하고, API로 감싸고, Docker로 같은 실행 환경을 묶는 과정`으로 이해하시면 됩니다.

## 왜 배포를 따로 배워야 하나

노트북에서 모델 성능이 잘 나왔다고 해서  
바로 실무에서 쓸 수 있는 것은 아닙니다.

실무에서는 아래 질문이 따라옵니다.

- 이 모델을 어떻게 다시 불러오지
- 다른 시스템이 어떻게 예측을 요청하지
- 내 로컬 말고 다른 서버에서도 똑같이 돌까
- 라이브러리 버전이 달라도 괜찮을까

즉, `모델 학습`과 `모델 사용` 사이에는  
`저장`, `서빙`, `환경 고정`이라는 추가 단계가 있습니다.

## 전체 흐름을 먼저 보면

입문 단계에서는 아래 흐름으로 이해하시면 충분합니다.

1. 전처리 + 모델을 함께 학습한다
2. 그 결과를 파일로 저장한다
3. API 서버가 파일을 불러온다
4. 요청이 오면 예측을 수행한다
5. Docker로 실행 환경을 묶는다

즉, 배포는 `모델을 파일로 남기고 네트워크로 호출 가능하게 만드는 일`입니다.

## API란 무엇인가

API는 다른 프로그램이 내 모델에 예측을 요청할 수 있게 해주는 `입구`입니다.

예를 들어:

- 웹 서비스가 고객 정보를 보낸다
- API가 모델 예측을 수행한다
- 결과로 이탈 확률을 돌려준다

즉, 사람이 노트북에서 `predict()`를 직접 실행하는 대신  
다른 시스템이 HTTP 요청으로 모델을 쓰게 만드는 방식입니다.

## `pickle`은 무엇인가

`pickle`은 Python 객체를 바이트 스트림으로 직렬화하고  
다시 Python 객체로 복원하는 표준 라이브러리입니다.

즉, 학습한 모델 객체를 파일로 저장했다가  
나중에 다시 불러올 수 있게 해줍니다.

## 작은 코드 예시: `pickle`

```python
import pickle
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

model = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(max_iter=1000)),
    ]
)

model.fit(X_train, y_train)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("model.pkl", "rb") as f:
    loaded_model = pickle.load(f)
```

핵심은 `전처리 + 모델`을 같이 저장하는 것입니다.  
그래야 추론 시점에도 학습 때와 같은 흐름이 유지됩니다.

## `pickle`을 쓸 때 주의할 점

- 신뢰하지 않는 파일을 로드하면 안 됩니다.
- Python 버전, 라이브러리 버전 차이가 문제를 만들 수 있습니다.
- 모델만 저장하고 전처리를 빼면 운영에서 입력 형식이 어긋날 수 있습니다.

즉, `pickle`은 편리하지만  
환경과 보안까지 자동으로 해결해주지는 않습니다.

## `joblib`은 무엇인가

`joblib`도 Python 객체를 저장하고 불러오는 도구입니다.  
특히 큰 `numpy` 배열을 포함한 객체를 다룰 때 자주 쓰입니다.

scikit-learn 예제에서도 모델 저장에 많이 등장합니다.

직관적으로는 아래처럼 보시면 됩니다.

- `pickle`: Python 표준 라이브러리
- `joblib`: 과학계산/머신러닝 객체 저장에 자주 쓰는 실무 도구

## 작은 코드 예시: `joblib`

```python
import joblib

joblib.dump(model, "model.joblib")
loaded_model = joblib.load("model.joblib")
```

## `pickle` vs `joblib`

| 항목 | `pickle` | `joblib` |
| --- | --- | --- |
| 기본 성격 | Python 표준 라이브러리 | 외부 라이브러리 |
| 사용 맥락 | 일반 객체 저장 | sklearn / numpy 큰 객체 저장에 자주 사용 |
| 장점 | 바로 사용 가능 | 큰 배열 포함 객체에서 실무 사용이 많음 |
| 공통 주의점 | 신뢰하지 않는 파일 로드 금지 | 신뢰하지 않는 파일 로드 금지 |

입문 단계에서는 아래처럼 생각하시면 됩니다.

- 빠르게 기본 개념 이해 -> `pickle`
- sklearn 파이프라인 실무 저장 -> `joblib`

## 왜 `FastAPI`를 많이 쓰나

`FastAPI`는 Python으로 API 서버를 빠르게 만들 수 있는 프레임워크입니다.

모델 배포 입문에서 자주 쓰는 이유는 아래와 같습니다.

- 문법이 비교적 단순함
- 타입 힌트 기반으로 입력 구조를 명확히 적기 쉬움
- JSON API 만들기가 편함
- 문서 화면도 자동 생성됨

즉, `모델 예측 함수를 HTTP API로 감싸기 좋은 도구`입니다.

## 작은 코드 예시: FastAPI 예측 서버

```python
import joblib
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
model = joblib.load("model.joblib")


class PredictRequest(BaseModel):
    visits_last_30d: int
    days_since_last_login: int
    avg_order_amount: float
    support_tickets: int


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(request: PredictRequest):
    X = [[
        request.visits_last_30d,
        request.days_since_last_login,
        request.avg_order_amount,
        request.support_tickets,
    ]]
    proba = model.predict_proba(X)[0][1]
    pred = int(proba >= 0.5)
    return {"prediction": pred, "probability": float(proba)}
```

이 흐름은 매우 중요합니다.

- 서버 시작 시 모델을 한 번 로드한다
- 요청이 오면 입력을 검증한다
- 같은 전처리/모델 흐름으로 예측한다
- JSON으로 결과를 돌려준다

## 실행 예시

보통은 아래처럼 실행합니다.

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

그다음 다른 시스템은 `/predict`에 HTTP 요청을 보내 예측 결과를 받습니다.

## `Docker`는 왜 필요한가

내 로컬에서는 잘 되는데  
서버에서는 안 되는 문제가 아주 흔합니다.

예:

- Python 버전이 다르다
- 라이브러리 버전이 다르다
- 시스템 패키지가 없다

`Docker`는 이런 문제를 줄이기 위해  
실행 환경 자체를 이미지로 묶는 도구입니다.

즉, `내 머신에서 되던 환경`을  
`서버에서도 비슷하게 재현`하기 쉽게 해줍니다.

## 작은 코드 예시: Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

이 Dockerfile은 아래 의미를 가집니다.

1. Python 3.11 환경을 고른다
2. 필요한 패키지를 설치한다
3. 코드와 모델 파일을 복사한다
4. FastAPI 서버를 실행한다

## 전체 배포 흐름 예시

실무 입문 버전으로는 아래 정도를 기억하시면 충분합니다.

1. `Pipeline`으로 전처리 + 모델 학습
2. `joblib.dump()`로 저장
3. `FastAPI`에서 `joblib.load()`로 불러오기
4. `/predict` API 만들기
5. `Dockerfile`로 환경 고정
6. 서버나 클라우드에 컨테이너 실행

즉, `모델 객체 -> API 서비스 -> 컨테이너` 흐름입니다.

## 실무에서 자주 생기는 문제

### 1. 전처리와 모델을 따로 저장하는 경우

운영 입력이 학습 입력과 달라져 예측이 깨질 수 있습니다.

### 2. 학습 때와 다른 라이브러리 버전

로드 실패나 예측 차이가 생길 수 있습니다.

### 3. 신뢰하지 않는 pickle/joblib 파일 로드

직렬화 파일 로드는 보안 위험이 있습니다.

### 4. 요청 스키마가 불명확한 경우

입력 컬럼 순서나 타입이 어긋나면 조용히 잘못된 예측이 나올 수 있습니다.

### 5. health check가 없는 경우

서버가 떠 있는지, 모델이 정상 로드됐는지 빠르게 확인하기 어렵습니다.

## 대안은 무엇인가

- 내부 분석용이면 굳이 API 없이 batch scoring으로 끝낼 수 있습니다.
- 아주 단순한 공유면 CSV 입출력 기반 배치 예측도 가능합니다.
- 서비스 연동이 필요하면 `FastAPI` 같은 API 서버가 자연스럽습니다.
- 환경 재현이 중요하면 `Docker`를 함께 가져가는 편이 안전합니다.

즉, 모든 프로젝트가 꼭 실시간 API일 필요는 없지만,  
`다른 시스템이 모델을 호출해야 한다면 API + 컨테이너`가 가장 흔한 기본 구조입니다.

## 정리

- `pickle`과 `joblib`은 학습한 모델 객체를 저장하고 다시 불러오는 데 쓰입니다.
- `FastAPI`는 모델을 HTTP API로 감싸기 좋은 Python 프레임워크입니다.
- `Docker`는 실행 환경을 고정해 배포 재현성을 높입니다.
- 배포에서 가장 중요한 것은 `전처리 포함 저장`, `입력 스키마 명확화`, `버전 재현`, `신뢰하지 않는 파일 로드 금지`입니다.

## 연습 문제

1. `pickle`과 `joblib`의 공통점과 차이를 적어보세요.
2. 왜 모델만 저장하지 말고 전처리까지 함께 저장하는 편이 좋은지 설명해보세요.
3. FastAPI와 Docker가 각각 배포 흐름에서 어떤 역할을 하는지 적어보세요.
