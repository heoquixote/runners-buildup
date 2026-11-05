## 1. GROUP BY 개념 정의

- `GROUP BY`는 **특정 컬럼을 기준으로 데이터를 "그룹(묶음)"으로 묶는 절**입니다.
- 주로 `COUNT`, `SUM`, `AVG`, `MAX`, `MIN` 같은 **집계 함수와 함께 사용**합니다.
- "부서별 평균 급여", "카테고리별 매출" 같은 **요약 통계 분석의 핵심 구문**입니다.

## 2. 기본 문법 구조

```sql
SELECT 그룹기준컬럼, 집계함수(컬럼)
FROM 테이블명
GROUP BY 그룹기준컬럼;
```

## 3. 집계함수

| **함수** | **의미** | **사용 예** |
| --- | --- | --- |
| COUNT() | 개수 | 전체 인원 수 |
| SUM() | 합계 | 총 매출 |
| AVG() | 평균 | 평균 급여 |
| MAX() | 최댓값 | 최고 점수 |
| MIN() | 최솟값 | 최저 점수 |

## 4. HAVING 개념 정의

- `HAVING`은 **GROUP BY로 묶인 "그룹 결과에 조건을 거는 절"**입니다.
- `WHERE`는 "개별 행" 필터
- `HAVING`은 "그룹화된 결과" 필터

## 5. HAVING 기본 문법 구조

```sql
SELECT 그룹컬럼, 집계함수(컬럼)
FROM 테이블명
GROUP BY 그룹컬럼
HAVING 그룹조건;
```

## 6. 문제 풀이

**1. 각 부서별 인원 수를 계산해주세요.**

<details>
<summary>정답 보기</summary>

```sql
SELECT deptno, COUNT(*) AS 인원수
FROM employees
GROUP BY deptno;
```

</details>

**2. 평균 급여가 7000 이상인 직급만 조회하세요.**

| 직급 | 평균급여 |
| --- | --- |
| CEO | 80,000 |
| 부장 | 13,333.3333 |
| 상무 | 20,000 |
| 차장 | 10,000 |
| 과장 | 7,500 |

<details>
<summary>정답 보기</summary>

```sql
SELECT joblv, AVG(salary) AS 평균급여
FROM employees
GROUP BY joblv
HAVING AVG(salary) >= 7000;
```

</details>

**3. 부서별 최고 급여액, 최저 급여액, 평균 급여액을 구해주세요.**

| 부서번호 | 최고급여 | 최저급여 | 평균급여 |
| --- | --- | --- | --- |
|  | 80000 | 80000 | 80000 |
| 80 | 13000 | 5000 | 9000 |
| 10 | 20000 | 20000 | 20000 |
| 11 | 15000 | 4800 | 8160 |
| 12 | 12000 | 4500 | 8000 |
| 40 | 6000 | 6000 | 6000 |

<details>
<summary>정답 보기</summary>

```sql
SELECT deptno AS '부서번호'
     , MAX(sal) AS '최고급여'
     , MIN(sal) AS '최저급여'
     , AVG(sal) AS '평균급여'
FROM emp
GROUP BY deptno;
```

</details>
