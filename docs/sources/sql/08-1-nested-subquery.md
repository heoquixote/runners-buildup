## 1. 개념 정리

- `WHERE` 절에서 사용합니다.
- 조건 비교용 서브쿼리입니다.
- 중첩 서브쿼리는 비상관 서브쿼리와 상관 서브쿼리로 나뉩니다.

| **구분** | **설명** |
| --- | --- |
| **비상관 서브쿼리** | 메인 쿼리와 독립적으로 먼저 1회 실행 |
| **상관 서브쿼리** | 메인 쿼리의 컬럼을 참조하여 각 행마다 반복 실행 |

## 2. 기본 구조

```sql
SELECT 컬럼1, 컬럼2, 컬럼3
FROM 테이블A
WHERE 컬럼A 비교연산자 (
    SELECT 집계함수(컬럼B)
    FROM 테이블B
);
```

## 3. 문제 풀이

**1. emp 테이블에서 중첩 서브쿼리를 사용하여 아래와 같이 전체 평균 급여보다 많이 받는 직원을 조회하는 SQL 쿼리를 작성하시오. (비상관 쿼리)**

| 이름 | 직급 | 급여 |
| --- | --- | --- |
| 김대표 | CEO | 80000 |
| 백정태 | 상무 | 20000 |
| 김낙수 | 부장 | 15000 |

<details>
<summary>정답 보기</summary>

```sql
SELECT ename_ko AS '이름'
     , joblv AS '직급'
     , sal AS '급여'
FROM emp
WHERE sal > (
    SELECT AVG(sal)
    FROM emp
);
```

</details>

**2. emp 테이블에서 중첩 서브쿼리를 사용하여 아래와 같이 부서 평균 급여보다 많이 받는 직원을 조회하는 SQL 쿼리를 작성하시오. (상관 쿼리)**

| 이름 | 직급 | 급여 |
| --- | --- | --- |
| 최재혁 | 부장 | 13000 |
| 김낙수 | 부장 | 15000 |
| 도진우 | 부장 | 12000 |
| 신준섭 | 차장 | 10000 |

<details>
<summary>정답 보기</summary>

```sql
SELECT e1.ename_ko AS '이름'
     , e1.joblv AS '직급'
     , e1.sal AS '급여'
FROM emp e1
WHERE e1.sal > (
    SELECT AVG(e2.sal)
    FROM emp e2
    WHERE e2.deptno <=> e1.deptno
);
```

</details>
