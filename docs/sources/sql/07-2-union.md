## 1. 개념

- 서로 다른 두 개 이상의 `SELECT` 결과를 "위로 붙여서 하나의 결과셋으로 만드는 연산자"

![UNION과 JOIN 차이](../assets/07-2/07-2-union-vs-join.png)

- `UNION` → **행(ROW)을 아래로 붙임**
- `JOIN` → **열(컬럼)을 옆으로 붙임**

## 2. UNION 기본 문법

```sql
SELECT 컬럼들 FROM 테이블1
UNION (ALL)
SELECT 컬럼들 FROM 테이블2;
```

**조건**

- 컬럼 개수 동일
- 컬럼 데이터 타입 호환
- 컬럼 순서 동일

> ❗ **UNION vs UNION ALL 차이**
>
> | **구분** | **중복 제거** | **속도** |
> | --- | --- | --- |
> | UNION | 제거함 | 느림 |
> | UNION ALL | 제거 안 함 | 빠름 |

> ❗ **ORDER BY는 맨 마지막에만 가능**
>
> ```sql
> SELECT empno FROM emp
> UNION
> SELECT empno FROM emp
> ORDER BY empno;   -- 여기만 가능
> ```

## 3. 문제

**1. 아래와 같이 부서 번호가 11인 직원 목록을 조회한 테이블과 12인 직원 목록을 조회한 테이블을 `UNION ALL`로 결합하시오.**

| empno | ename_ko | deptno |
| --- | --- | --- |
| 7002 | 김낙수 | 11 |
| 7005 | 허태환 | 11 |
| 7006 | 송익현 | 11 |
| 7007 | 정성구 | 11 |
| 7009 | 권송희 | 11 |
| 7003 | 도진우 | 12 |
| 7004 | 신준섭 | 12 |
| 7008 | 이명헌 | 12 |
| 7010 | 채소연 | 12 |

<details>
<summary>정답 보기</summary>

```sql
SELECT empno, ename_ko, deptno
FROM emp
WHERE deptno = 11
UNION ALL
SELECT empno, ename_ko, deptno
FROM emp
WHERE deptno = 12;
```

</details>

**2. 아래와 같이 재직 중인 직원 목록을 조회한 테이블과 퇴사한 직원을 조회한 테이블을 `UNION`으로 결합하시오.**

(`employed`가 1이면 재직중, 0이면 퇴사로 표시)

| 사번 | 이름 | 재직여부 |
| --- | --- | --- |
| 1000 | 김대표 | 재직중 |
| 4001 | 최재혁 | 재직중 |
| 4002 | 남궁민수 | 재직중 |
| 7001 | 백정태 | 재직중 |
| 7002 | 김낙수 | 재직중 |
| 7003 | 도진우 | 재직중 |
| 7004 | 신준섭 | 재직중 |
| 7006 | 송익현 | 재직중 |
| 7007 | 정성구 | 재직중 |
| 7008 | 이명헌 | 재직중 |
| 7009 | 권송희 | 재직중 |
| 7010 | 채소연 | 재직중 |
| 8001 | 이주영 | 재직중 |
| 7005 | 허태환 | 퇴사 |

<details>
<summary>정답 보기</summary>

```sql
SELECT empno AS '사번'
     , ename_ko AS '이름'
     , IF(employed = 1, '재직중', '퇴사') AS '재직여부'
FROM emp
WHERE employed = 1
UNION
SELECT empno AS '사번'
     , ename_ko AS '이름'
     , IF(employed = 1, '재직중', '퇴사') AS '재직여부'
FROM emp
WHERE employed = 0;
```

</details>
