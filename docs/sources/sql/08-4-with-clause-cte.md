## 1. WITH 절(CTE)이란?

- 서브쿼리에 이름(별칭)을 붙여서 임시 테이블처럼 사용하는 문법
- 기존 SUB QUERY의 가독성 문제를 해결하기 위한 고급 구조화 기법
- 즉, 서브쿼리를 변수처럼 저장해서, 다음 쿼리에서 재사용하는 방식

## 2. WITH 절 사용 이유

| **구분** | **설명** |
| --- | --- |
| 사용 이유 | • 복잡한 서브쿼리를 재사용하기 위해 사용 • 중첩 서브쿼리 가독성 문제 해결 • 집계 -> 필터 -> 랭킹 같은 단계별 분석 구조 설계 가능 |
| 실행 순서 | • WITH 절이 가장 먼저 실행됨 • 그 다음 메인 SELECT 실행 |
| 특징 | • 하나 이상의 임시 테이블 정의 가능 • 각 CTE는 콤마(,)로 구분 • SELECT 문 바로 앞에 위치해야 함 |
| 수명(Life Cycle) | • 해당 쿼리 1회 실행 동안만 유지 • 실제 물리 테이블로 저장되지 않음 |

## 3. WITH 절 기본 문법

```sql
WITH cte_name AS (
    SELECT ...
)
SELECT *
FROM cte_name;
```

> ❗ **Bind 함수**
>
> ```sql
> SET @deptno = 10;
>
> SELECT *
> FROM emp
> WHERE deptno = @deptno;
> ```
>
> `SET` 뒤에 변수를 선언하는 것으로 WITH절처럼 특정 값을 변수에 넣고 활용하는 문법도 있음
>
> 실행 방법은 두 쿼리 같이 잡고 `Alt + X`로 실행

## 4. 문제 풀이

**1. CTE를 사용하여 **사원의 총급여(sal + comm)** 를 먼저 계산한 뒤, 아래와 같이 데이터를 출력하시오.**

| 사원번호 | 이름 | 총급여 | 부서명 |
| --- | --- | --- | --- |
| 4001 | 최재혁 | 18000 | ACT 인사팀 |
| 4002 | 남궁민수 | 5000 | ACT 인사팀 |
| 7001 | 백정태 | 30000 | ACT 영업본부 |
| 7002 | 김낙수 | 20000 | ACT 영업1팀 |
| 7003 | 도진우 | 19000 | ACT 영업2팀 |
| 7004 | 신준섭 | 13000 | ACT 영업2팀 |
| 7005 | 허태환 | 10000 | ACT 영업1팀 |
| 7006 | 송익현 | 8500 | ACT 영업1팀 |
| 7007 | 정성구 | 6000 | ACT 영업1팀 |
| 7008 | 이명헌 | 5500 | ACT 영업2팀 |
| 7009 | 권송희 | 5800 | ACT 영업1팀 |
| 7010 | 채소연 | 5500 | ACT 영업2팀 |
| 8001 | 이주영 | 8000 | ACT 아산공장 |

<details>
<summary>정답 보기</summary>

```sql
WITH emp_base AS (
    SELECT empno
         , ename_ko
         , deptno
         , sal + comm AS total_pay
    FROM emp
)
SELECT e.empno AS '사원번호'
     , e.ename_ko AS '이름'
     , e.total_pay AS '총급여'
     , d.dname AS '부서명'
FROM emp_base e
JOIN dept d
  ON e.deptno = d.deptno;
```

</details>

**2. CTE를 사용하여 **부서별 급여 순위**를 먼저 계산한 뒤, 아래와 같이 각 부서별 1등에 해당하는 데이터만 출력하는 SQL 쿼리를 작성하시오.**

| 사원번호 | 이름 | 부서번호 | 급여 |
| --- | --- | --- | --- |
| 1000 | 김대표 |  | 80000 |
| 7001 | 백정태 | 10 | 20000 |
| 7002 | 김낙수 | 11 | 15000 |
| 7003 | 도진우 | 12 | 12000 |
| 8001 | 이주영 | 40 | 6000 |
| 4001 | 최재혁 | 80 | 13000 |

<details>
<summary>정답 보기</summary>

```sql
WITH ranked_emp AS (
    SELECT empno
         , ename_ko
         , deptno
         , sal
         , RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS dept_rank
    FROM emp
)
SELECT empno AS '사원번호'
     , ename_ko AS '이름'
     , deptno AS '부서번호'
     , sal AS '급여'
FROM ranked_emp
WHERE dept_rank = 1;
```

</details>
