## 1. 개념 정의

- 둘 이상의 테이블을 공통 컬럼을 기준으로 연결해서 하나의 결과로 조회하는 방식
- 예를 들어 사원 정보 테이블과 부서 정보 테이블이 있다고 가정할 때 사원의 이름 + 부서명을 같이 보고 싶을 때 `JOIN`이 필요

## 2. 기본 구조

```sql
SELECT 컬럼들
FROM 테이블A
JOIN 테이블B
  ON 테이블A.공통컬럼 = 테이블B.공통컬럼;
```

## 3. 조인 종류

### 3-1. INNER JOIN (가장 기본, 가장 중요)

```sql
SELECT e.empno
     , e.ename_ko
     , d.dname
FROM emp e
INNER JOIN dept d
  ON e.deptno = d.deptno;
```

- 결과 의미: **부서에 소속된 직원만 출력됨**

### 3-2. LEFT JOIN (기준 테이블은 전부 나오게)

```sql
SELECT e.empno
     , e.ename_ko
     , d.dname
FROM emp e
LEFT JOIN dept d
  ON e.deptno = d.deptno;
```

- 부서가 없는 직원 → `dname = NULL`

### 3-3. RIGHT JOIN

```sql
SELECT e.empno
     , e.ename_ko
     , d.dname
FROM emp e
RIGHT JOIN dept d
  ON e.deptno = d.deptno;
```

- 실무에서는 보통 `LEFT JOIN`으로 대체

### 3-4. SELF JOIN (셀프 조인 = 자기 자신과 조인)

```sql
SELECT *
FROM emp e1
JOIN emp e2
  ON e1.mgr = e2.empno;
```

- 하나의 테이블을 자기 자신과 조인하는 방식
- 주로 상사-부하 관계, 추천인, 조직도 구조에서 사용

| **직원명** | **상사명** |
| --- | --- |
| 김낙수 | 백정태 |
| 도진우 | 김대표 |
| 김대표 | NULL |

> ❗ **Join 조건을 안 써줘도 쿼리가 실행되나요?**
>
> 조인 조건을 안 써주면 **카티시안 곱(Cartesian Product)**으로 계산됩니다.
>
> **카티시안 곱(Cartesian Product)**: 두 테이블의 모든 행을 서로 전부 곱해서 조합하는 결과
>
> ```sql
> SELECT *
> FROM emp, dept;
> ```
>
> 사용 예시:
>
> - 기준 마스터 × 기준 마스터 전체 조합 생성
> - 테스트 데이터 자동 생성
> - 모든 경우의 수 시뮬레이션

## 4. 문제 풀이

**1. 2022년 1월부터 3월까지 입사한 사원의 이름, 부서 번호, 부서 이름을 표시하는 SQL 쿼리문을 작성하시오.**

| 이름 | 부서번호 | 부서명 |
| --- | --- | --- |
| 권송희 | 11 | ACT 영업1팀 |
| 채소연 | 12 | ACT 영업2팀 |

<details>
<summary>정답 보기</summary>

```sql
SELECT a.ename_ko AS '이름'
     , a.deptno AS '부서번호'
     , b.dname AS '부서명'
FROM emp a
JOIN dept b
  ON a.deptno = b.deptno
WHERE a.hiredate >= STR_TO_DATE('2022-01-01', '%Y-%m-%d')
  AND a.hiredate < STR_TO_DATE('2022-04-01', '%Y-%m-%d');
```

</details>

**2. 연봉이 6000만원인 사원의 직급, 부서명, 지역을 출력하는 SQL 쿼리문을 작성하시오.**

| 직급 | 부서명 | 지역 |
| --- | --- | --- |
| 대리 | ACT 영업1팀 | 서울 |
| 작업반장 | ACT 아산공장 | 아산 |

<details>
<summary>정답 보기</summary>

```sql
SELECT a.joblv AS '직급'
     , b.dname AS '부서명'
     , b.location AS '지역'
FROM emp a
JOIN dept b
  ON a.deptno = b.deptno
WHERE a.sal = 6000;
```

</details>

**3. 지역별 평균급여를 구하는 SQL 쿼리문을 작성하시오.**

(평균급여는 소수점 0자리로 반올림해주세요)

| 지역 | 평균급여 |
| --- | --- |
| 서울 | 9233 |
| 아산 | 6000 |

<details>
<summary>정답 보기</summary>

```sql
SELECT b.location AS '지역'
     , ROUND(AVG(a.sal)) AS '평균급여'
FROM emp a
JOIN dept b
  ON a.deptno = b.deptno
GROUP BY b.location;
```

</details>

**4. 사원의 이름 및 사원 번호를 관리자의 이름 및 관리자 번호와 함께 표시하고 각각의 컬럼 이름을 사원번호, 사원명, 매니저번호, 매니저명을 출력해주세요.**

| 사원번호 | 사원명 | 매니저번호 | 매니저명 |
| --- | --- | --- | --- |
| 4001 | 최재혁 | 1000 | 김대표 |
| 4002 | 남궁민수 | 4001 | 최재혁 |
| 7001 | 백정태 | 1000 | 김대표 |
| 7002 | 김낙수 | 7001 | 백정태 |
| 7003 | 도진우 | 7001 | 백정태 |
| 7004 | 신준섭 | 7003 | 도진우 |
| 7005 | 허태환 | 7002 | 김낙수 |
| 7006 | 송익현 | 7002 | 김낙수 |
| 7007 | 정성구 | 7002 | 김낙수 |
| 7008 | 이명헌 | 7003 | 도진우 |
| 7009 | 권송희 | 7002 | 김낙수 |
| 7010 | 채소연 | 7003 | 도진우 |

<details>
<summary>정답 보기</summary>

```sql
SELECT e1.empno AS '사원번호'
     , e1.ename_ko AS '사원명'
     , e1.mgr AS '매니저번호'
     , e2.ename_ko AS '매니저명'
FROM emp e1
JOIN emp e2
  ON e1.mgr = e2.empno;
```

</details>

**5. 아래와 같이 사원별 총급여(연봉 + 성과금)를 기준으로 부서명과 급여등급을 함께 조회하는 SQL 쿼리를 작성하시오. (*LEFT 조인 사용)**

| 사원번호 | 이름 | 총급여 | 부서번호 | 부서명 | 등급 |
| --- | --- | --- | --- | --- | --- |
| 1000 | 김대표 | 80000 |  |  | A |
| 7001 | 백정태 | 30000 | 10 | ACT 영업본부 | B |
| 7002 | 김낙수 | 20000 | 11 | ACT 영업1팀 | C |
| 7005 | 허태환 | 10000 | 11 | ACT 영업1팀 | D |
| 7006 | 송익현 | 8500 | 11 | ACT 영업1팀 | D |
| 7007 | 정성구 | 6000 | 11 | ACT 영업1팀 | D |
| 7009 | 권송희 | 5800 | 11 | ACT 영업1팀 | D |
| 7003 | 도진우 | 19000 | 12 | ACT 영업2팀 | C |
| 7004 | 신준섭 | 13000 | 12 | ACT 영업2팀 | C |
| 7008 | 이명헌 | 5500 | 12 | ACT 영업2팀 | D |
| 7010 | 채소연 | 5500 | 12 | ACT 영업2팀 | D |
| 8001 | 이주영 | 8000 | 40 | ACT 아산공장 | D |
| 4001 | 최재혁 | 18000 | 80 | ACT 인사팀 | C |
| 4002 | 남궁민수 | 5000 | 80 | ACT 인사팀 | E |

<details>
<summary>정답 보기</summary>

```sql
SELECT a.empno AS '사원번호'
     , a.ename_ko AS '이름'
     , a.sal + a.comm AS '총급여'
     , a.deptno AS '부서번호'
     , b.dname AS '부서명'
     , c.grade AS '등급'
FROM emp a
LEFT JOIN salgrade c
  ON a.sal + comm BETWEEN c.losal AND c.hisal
LEFT JOIN dept b
  ON b.deptno = a.deptno;
```

```sql
SELECT a.empno AS '사원번호'
     , a.ename_ko AS '이름'
     , a.sal + a.comm AS '총급여'
     , a.deptno AS '부서번호'
     , b.dname AS '부서명'
     , c.grade AS '등급'
FROM emp a
LEFT JOIN dept b
  ON a.deptno = b.deptno
LEFT JOIN salgrade c
  ON a.sal + a.comm >= c.losal
 AND a.sal + a.comm <= c.hisal
ORDER BY 3 DESC;
```

</details>
