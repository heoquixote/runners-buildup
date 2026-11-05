## 학습 목표

- 모듈, 패키지, 라이브러리의 차이를 설명할 수 있습니다.
- `import`가 실제로 무엇을 불러오는지 이해할 수 있습니다.
- 표준 라이브러리와 외부 라이브러리의 경계를 구분할 수 있습니다.
- 코드를 왜 여러 파일과 폴더로 나누는지 구조적 관점에서 설명할 수 있습니다.

## 모듈, 패키지, 라이브러리

노션 강의 흐름을 그대로 정리하면, 이 세 개는 "코드를 묶는 단위의 크기"가 다릅니다.

- 모듈(module): 하나의 `.py` 파일
- 패키지(package): 여러 모듈을 폴더 구조로 묶은 단위
- 라이브러리(library): 특정 문제를 해결하기 위한 코드 묶음 전체

예를 들어:

- `math`, `datetime`: Python에 기본 포함된 표준 라이브러리 모듈
- `pandas`, `numpy`, `matplotlib`: 별도 설치가 필요한 외부 라이브러리

비유하면:

- 모듈: 작은 도구 상자 한 개
- 패키지: 관련 도구 상자를 모아둔 서랍장
- 라이브러리: 특정 업무를 위한 공구 세트 전체

## 왜 이런 구조가 필요한가

모든 코드를 한 파일에 몰아넣으면 처음에는 편하지만, 프로젝트가 커질수록 문제가 생깁니다.

- 어디에 어떤 기능이 있는지 찾기 어려움
- 같은 코드를 복사해서 여러 번 쓰게 됨
- 수정할 때 영향 범위를 파악하기 어려움
- 다른 사람과 협업할 때 역할 분리가 어려움

그래서 보통은 아래 기준으로 파일을 나누기 시작합니다.

- 데이터 읽기 함수
- 전처리 함수
- 시각화 함수
- 실행 진입점(`main`)
- 공통 설정값

## `import`는 무엇을 하나

`import`는 이미 만들어진 코드를 현재 파일에서 재사용할 수 있게 연결해 줍니다.

```python
import math
from datetime import datetime
```

위 예시는 다음을 의미합니다.

- `import math`: `math` 모듈 전체를 가져와 `math.sqrt()`, `math.pi`처럼 사용
- `from datetime import datetime`: `datetime` 모듈 안의 `datetime`만 직접 가져와 사용

즉, `import`는 "다른 파일에 있는 기능을 지금 이 파일에서 쓰겠다"는 선언입니다.

## 모듈 만들어 보기

노션 예시처럼 직접 모듈을 만드는 감각도 중요합니다.

`qaqc.py`

```python
def my_func(a, b):
    return a + b
```

`test.py`

```python
import qaqc

print(qaqc.my_func(1, 2))
```

```text
3
```

이 구조를 통해:

- 기능 정의와 실행 코드를 분리할 수 있고
- 다른 파일에서도 같은 함수를 재사용할 수 있습니다

## 패키지는 어떻게 생기나

패키지는 보통 아래처럼 폴더 구조를 가집니다.

```text
my_project/
├── app.py
├── utils/
│   ├── __init__.py
│   ├── io.py
│   └── transform.py
└── viz/
    ├── __init__.py
    └── charts.py
```

여기서:

- `utils/io.py`: 파일 읽기/쓰기 관련 함수
- `utils/transform.py`: 데이터 변환 함수
- `viz/charts.py`: 시각화 함수

처럼 역할을 분리하면 구조가 훨씬 명확해집니다.

## 표준 라이브러리 vs 외부 라이브러리

이 구분은 초보자에게 매우 중요합니다.

### 표준 라이브러리

Python 설치 시 기본으로 포함됩니다.

- `math`
- `datetime`
- `json`
- `csv`
- `os`
- `pathlib`

따라서 별도 설치 없이 바로 `import` 할 수 있습니다.

### 외부 라이브러리

별도 설치가 필요합니다.

- `numpy`
- `pandas`
- `matplotlib`
- `seaborn`
- `plotly`

이들은 보통 `pip install`로 설치합니다.

```bash
pip install pandas
```

## 왜 라이브러리를 쓰는가

노션 강의의 핵심 메시지는 "모든 것을 직접 만들 필요는 없다"는 점입니다.

- 코드 재사용
- 개발 속도 향상
- 복잡한 기능을 짧은 코드로 해결
- 검증된 도구를 활용해 안정성 확보

예를 들어 제곱근 계산을 직접 구현하기보다 `math.sqrt()`를 쓰는 편이 더 정확하고 빠릅니다.

```python
import math

result = math.sqrt(25)
print(result)
```

## 자주 쓰는 import 형태

```python
import math
import pandas as pd
from datetime import datetime
from pathlib import Path
```

실무에서는 별칭(alias)도 많이 씁니다.

- `numpy as np`
- `pandas as pd`
- `matplotlib.pyplot as plt`

이는 업계에서 거의 관례처럼 굳어져 있기 때문에, 오히려 이렇게 써야 다른 사람이 읽기 쉽습니다.

## 실무 팁

- 모듈은 역할별로 나누고, 파일명이 곧 책임을 설명하게 만드는 편이 좋습니다.
- `import *`는 어디서 무엇이 들어왔는지 흐려지므로 보통 피합니다.
- 표준 라이브러리와 외부 라이브러리의 경계를 알면 설치 문제를 훨씬 덜 겪습니다.
- 순환 import가 생기면 대개 파일 책임이 잘못 나뉜 신호입니다.
- "이 코드를 다른 파일에서도 다시 쓸 수 있을까?"를 기준으로 함수와 모듈을 나누면 구조가 좋아집니다.
