## 1. ORDER BY 개념 정의

- `ORDER BY`는 **조회된 데이터를 "정렬(Sort)"하는 절**입니다.
- 숫자, 문자열, 날짜를 기준으로 **오름차순 또는 내림차순 정렬 가능**합니다.
- **SELECT 결과의 "보는 순서"만 바꾸는 기능**이며, 데이터 자체는 변경되지 않습니다.

## 2. ORDER BY 기본 문법 구조

```sql
SELECT 컬럼명
FROM 테이블명
ORDER BY 컬럼명 [ASC | DESC];
```

- `ASC`: 오름차순 (기본값, 생략 가능)
- `DESC`: 내림차순

> ❗ **ORDER BY에서 알리아스 사용 가능**
>
> ```sql
> SELECT salary * 12 AS annual_salary
> FROM employees
> ORDER BY annual_salary DESC;
> ```
>
> - `SELECT`에서 만든 **알리아스는 ORDER BY에서 사용 가능**
> - `WHERE`에서는 사용 불가

## 3. LIMIT 개념 정의

- `LIMIT`는 **조회되는 데이터의 "행 개수"를 제한하는 절**입니다.
- 상위 N개 데이터 조회, 페이징 처리에 사용합니다.
- **MySQL에서 TOP 역할을 대신하는 구문**입니다.

## 4. LIMIT 기본 문법 구조

```sql
SELECT 컬럼명
FROM 테이블명
LIMIT 개수;
```

> ❗ **LIMIT + OFFSET (페이징 처리)**
>
> ```sql
> SELECT *
> FROM employees
> ORDER BY empno
> LIMIT 5 OFFSET 5;
> ```
>
> → **6번째부터 5개 행 조회**

## 5. 문제 풀이

**1. `EMP` 테이블에서 급여가 5000 이상인 데이터를 급여가 높은 순으로 3건만 출력하시오.**

<details>
<summary>정답 보기</summary>

```sql
SELECT *
FROM EMP
WHERE SAL >= 5000
ORDER BY SAL DESC
LIMIT 3;
```

</details>

**2. `EMP` 테이블에서 급여가 5000 이상인 데이터를 급여가 높은 순으로 5건만 출력하시오.**

(앞의 예제 결과 3건을 건너뛰고 이어서 5건을 출력)

<details>
<summary>정답 보기</summary>

```sql
SELECT *
FROM EMP
WHERE SAL >= 5000
LIMIT 5 OFFSET 3;
```

</details>
