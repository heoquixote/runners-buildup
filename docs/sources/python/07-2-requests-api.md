## 학습 목표

- `requests`를 사용해 HTTP 요청을 보내는 흐름을 이해할 수 있습니다.
- API 응답을 JSON으로 읽는 기본 패턴을 익힐 수 있습니다.
- 네트워크 요청에서 예외 처리가 왜 중요한지 설명할 수 있습니다.

## 왜 `requests`가 좋은 입문 예시인가

`requests`는 외부 라이브러리의 가치를 가장 빠르게 체감하게 해 주는 도구 중 하나입니다.  
웹 API에서 데이터를 가져오면, 그 결과를 `JSON`, `CSV`, `pandas`, 시각화로 자연스럽게 이어 갈 수 있기 때문입니다.

## 기본 요청

```python
import requests

response = requests.get("https://jsonplaceholder.typicode.com/users")
data = response.json()
print(data[0]["name"])
```

## 자주 쓰는 옵션

```python
response = requests.get(
    "https://api.example.com/items",
    params={"page": 1, "limit": 10},
    timeout=5,
)
```

- `params`: 쿼리스트링 전달
- `timeout`: 무한 대기 방지

## 예외 처리가 중요한 이유

네트워크 요청은 파일 읽기보다 더 자주 실패합니다.

- 서버가 응답하지 않을 수 있음
- 인증이 틀릴 수 있음
- 응답 형식이 예상과 다를 수 있음

```python
import requests

try:
    response = requests.get("https://api.example.com/items", timeout=5)
    response.raise_for_status()
    data = response.json()
except requests.RequestException as e:
    print("요청 실패:", e)
```
