## 1. 함수

| **함수** | **의미** | **예시 (MySQL)** |
| --- | --- | --- |
| CAST(값 AS CHAR) | 숫자 → 문자열, 날짜 → 문자열 변환 | CAST(100 AS CHAR) |
| FORMAT(숫자, 자리수) | 숫자 → 콤마 포함 문자열 변환 | FORMAT(9999.9, 1) |
| DATE_FORMAT(날짜, 포맷) | 날짜 → 지정된 문자열 포맷으로 변환 | DATE_FORMAT(NOW(), '%Y%m%d') |
| STR_TO_DATE(문자열, 포맷) | 문자열 → DATE 타입으로 변환 | STR_TO_DATE('20230301', '%Y%m%d') |
| STR_TO_DATE(문자열, 포맷) | 문자열 → DATETIME(TIMESTAMP 역할) | STR_TO_DATE('20230301133025', '%Y%m%d%H%i%s') |
| CAST(문자 AS SIGNED) | 문자열 → 정수형 숫자로 변환 | CAST('100' AS SIGNED) |
| CAST(문자 AS DECIMAL) | 문자열 → 실수형 숫자로 변환 | CAST('100.5' AS DECIMAL(10,2)) |
| CONVERT(값, CHAR) | 타입 변환 (CAST와 동일 역할) | CONVERT(100, CHAR) |
| CONVERT_TZ(날짜, from, to) | 시간대(TimeZone) 변환 | CONVERT_TZ(NOW(), '+00:00', '+09:00') |

## 2. 문제

**1. 재직 중인 직원의 총급여(연봉 + 성과금)를 `만원` 단위로 계산하고 총급여순 내림차순으로 출력하시오.**

| 이름 | 총급여 |
| --- | --- |
| 김대표 | 80,000만원 |
| 백정태 | 30,000만원 |
| 김낙수 | 20,000만원 |
| 도진우 | 19,000만원 |
| 최재혁 | 18,000만원 |
| 신준섭 | 13,000만원 |
| 송익현 | 8,500만원 |
| 이주영 | 8,000만원 |
| 정성구 | 6,000만원 |
| 권송희 | 5,800만원 |
| 이명헌 | 5,500만원 |
| 채소연 | 5,500만원 |
| 남궁민수 | 5,000만원 |

<details>
<summary>정답 보기</summary>

```sql
SELECT ename_ko AS '이름'
     , CONCAT(FORMAT(sal + comm, 0), '만원') AS total_pay
FROM emp
WHERE employed = 1
ORDER BY sal + comm DESC;
```

```sql
SELECT ename_ko AS '이름'
     , CONCAT(CAST(sal + comm AS CHAR), '만원') AS total_pay
FROM emp
WHERE employed = 1
ORDER BY sal + comm DESC;
```

</details>

**2. 현재 MySQL 서버의 시간은 UTC(+00:00) 기준으로 설정되어 있다. 동일한 시간을 **한국 시간(KST, +09:00)** 으로 변환하여 아래와 같이 두 개의 값을 한 번에 함께 출력하는 SQL문을 작성하시오.**

| utc_time | kst_time |
| --- | --- |
| 12/8/25 3:08 | 12/8/25 12:08 |

<details>
<summary>정답 보기</summary>

```sql
SELECT NOW() AS 'utc_time'
     , CONVERT_TZ(NOW(), '+00:00', '+09:00') AS 'kst_time';
```

</details>
