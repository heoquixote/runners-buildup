## 1. IF 조건문 (MySQL 전용)

- 조건이 참이면 A, 거짓이면 B를 반환하는 단일 분기 조건문
- 간단한 조건에 적합

```sql
IF(조건, 참일 때 값, 거짓일 때 값)
```

## 2. CASE 조건문 (표준 SQL)

- 여러 조건을 순차적으로 비교하여 서로 다른 값을 반환하는 다중 분기 조건문

```sql
CASE
    WHEN 조건1 THEN 결과1
    WHEN 조건2 THEN 결과2
    ELSE 기본값
END
```

## 3. 문제

**1. 아래와 같이 `employed` 값이 1이면 `재직중`, 0이면 `퇴사`로 출력하는 SQL 쿼리를 작성하시오. (`IF` 조건문 사용)**

| **이름** | 재직여부 |
| --- | --- |
| 김대표 | 재직중 |
| 최재혁 | 재직중 |
| 남궁민수 | 재직중 |
| 백정태 | 재직중 |
| 김낙수 | 재직중 |
| 도진우 | 재직중 |
| 신준섭 | 재직중 |
| 허태환 | 퇴사 |
| 송익현 | 재직중 |
| 정성구 | 재직중 |
| 이명헌 | 재직중 |
| 권송희 | 재직중 |
| 채소연 | 재직중 |
| 이주영 | 재직중 |

<details>
<summary>정답 보기</summary>

```sql
SELECT ename_ko AS '이름'
     , IF(employed = 1, '재직중', '퇴사') AS '재직여부'
FROM emp;
```

</details>

**2. 부서 번호를 참고하여 아래 기준에 따라 직군을 분류하는 SQL 쿼리를 작성하시오. (`CASE`문 사용)**

```sql
1% -> '영업'
4% -> '생산'
8% -> '인사'
그 외 -> '기타'
```

| **이름** | **직군** |
| --- | --- |
| 김대표 | 기타 |
| 최재혁 | 인사 |
| 남궁민수 | 인사 |
| 백정태 | 영업 |
| 김낙수 | 영업 |
| 도진우 | 영업 |
| 신준섭 | 영업 |
| 허태환 | 영업 |
| 송익현 | 영업 |
| 정성구 | 영업 |
| 이명헌 | 영업 |
| 권송희 | 영업 |
| 채소연 | 영업 |
| 이주영 | 생산 |

<details>
<summary>정답 보기</summary>

```sql
SELECT ename_ko
     , CASE
           WHEN CAST(deptno AS CHAR) LIKE '1%' THEN '영업'
           WHEN CAST(deptno AS CHAR) LIKE '4%' THEN '생산'
           WHEN CAST(deptno AS CHAR) LIKE '8%' THEN '인사'
           ELSE '기타'
       END AS '직군'
FROM emp;
```

</details>
