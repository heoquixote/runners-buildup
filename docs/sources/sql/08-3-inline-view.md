## 1. 개념 정리

- `FROM` 절 안에서 사용하는 서브쿼리로, 하나의 임시 테이블처럼 동작하는 서브쿼리입니다.
- `SELECT` 결과를 테이블처럼 사용합니다.
- `JOIN`, `GROUP BY`, 윈도우 함수와 결합할 때 가장 많이 사용합니다.
- 실무에서 서브쿼리 중 사용 빈도 1순위입니다.

## 2. 기본 구조

```sql
SELECT 바깥_컬럼들
FROM (
    SELECT 안쪽_컬럼들
    FROM 테이블
    WHERE 조건
) AS 별칭;
```

- **핵심 규칙**
- `FROM` 절 안에 위치합니다.
- 반드시 별칭(`AS`)을 붙여야 합니다.
- 바깥 쿼리는 이 별칭을 테이블처럼 사용합니다.

## 3. 문제 풀이

**1. 재직자만 조회하는 쿼리를 **인라인 뷰** 활용하여 작성하고 부서명을 왼쪽 조인하여 아래와 같이 데이터를 출력하시오.**

| 사번 | 이름 | 부서명 |
| --- | --- | --- |
| 1000 | 김대표 |  |
| 4001 | 최재혁 | ACT 인사팀 |
| 4002 | 남궁민수 | ACT 인사팀 |
| 7001 | 백정태 | ACT 영업본부 |
| 7002 | 김낙수 | ACT 영업1팀 |
| 7003 | 도진우 | ACT 영업2팀 |
| 7004 | 신준섭 | ACT 영업2팀 |
| 7006 | 송익현 | ACT 영업1팀 |
| 7007 | 정성구 | ACT 영업1팀 |
| 7008 | 이명헌 | ACT 영업2팀 |
| 7009 | 권송희 | ACT 영업1팀 |
| 7010 | 채소연 | ACT 영업2팀 |
| 8001 | 이주영 | ACT 아산공장 |

<details>
<summary>정답 보기</summary>

```sql
SELECT x.empno AS '사번'
     , x.ename_ko AS '이름'
     , d.dname AS '부서명'
FROM (
    SELECT empno
         , ename_ko
         , deptno
    FROM emp
    WHERE employed = 1
) AS x
LEFT JOIN dept d
  ON x.deptno = d.deptno;
```

</details>

**2. 부서별 급여 1등만 출력하는 서브쿼리를 **윈도우 함수와 인라인 뷰** 활용하여 아래와 같이 데이터를 출력하시오.**

| 사번 | 이름 | 급여 | 부서별급여순위 |
| --- | --- | --- | --- |
| 1000 | 김대표 | 80000 | 1 |
| 7001 | 백정태 | 20000 | 1 |
| 7002 | 김낙수 | 15000 | 1 |
| 7003 | 도진우 | 12000 | 1 |
| 8001 | 이주영 | 6000 | 1 |
| 4001 | 최재혁 | 13000 | 1 |

<details>
<summary>정답 보기</summary>

```sql
SELECT empno AS '사번'
     , ename_ko AS '이름'
     , sal AS '급여'
     , dept_rank AS '부서별 급여 순위'
FROM (
    SELECT empno
         , ename_ko
         , sal
         , RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS dept_rank
    FROM emp
) AS ranked_emp
WHERE dept_rank = 1;
```

</details>
