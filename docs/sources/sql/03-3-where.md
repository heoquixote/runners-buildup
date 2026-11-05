## 1. 개념 정의

![WHERE 개념 예시](../assets/03-3/03-3-where-example.png)

- `WHERE`는 **조회할 데이터의 "조건(Filter)"을 지정하는 절**입니다.
- **전체 데이터 중에서 필요한 데이터만 걸러서 조회하기 위한 필수 구문**입니다.

## 2. 기본 문법 구조

```sql
SELECT 컬럼명
FROM 테이블명
WHERE 조건식;
```

## 3. WHERE절에서 사용하는 주요 연산자

### 3-1. 산술 연산자

| **연산자** | **의미** | **예시** |
| --- | --- | --- |
| + | 더하기 | 10 + 3 |
| - | 빼기 | 10 - 3 |
| * | 곱하기 | 10 * 3 |
| / | 나누기 | 10 / 3 |
| % | 나머지 | 10 % 3 |

### 3-2. 비교 연산자

| **연산자** | **의미** | **예시** |
| --- | --- | --- |
| = | 같다 | salary = 3000 |
| !=, <> | 같지 않다 | deptno != 10 |
| > | 크다 | salary > 3000 |
| < | 작다 | salary < 3000 |
| >= | 이상 | salary >= 3000 |
| <= | 이하 | salary <= 3000 |

## 4. WHERE + AND / OR (복합 조건)

- **AND: 모든 조건을 동시에 만족**

```sql
SELECT *
FROM employees
WHERE deptno = 10
  AND sal >= 3000;
```

→ **10번 부서이면서 급여 3000 이상**

- **OR: 둘 중 하나만 만족해도 조회**

```sql
SELECT *
FROM employees
WHERE deptno = 10
   OR deptno = 20;
```

→ **10번 또는 20번 부서**

## 5. WHERE + BETWEEN (범위 조건)

![BETWEEN 예시](../assets/03-3/03-3-between-example.png)

```sql
-- 부장님 가방을 골라줍시다
SELECT bag_name, price
FROM item
WHERE price BETWEEN 2500000 AND 3000000;
```

- 숫자, 날짜 모두 사용 가능

```sql
WHERE hiredate BETWEEN '2023-01-01' AND '2023-12-31'
```

> ❗ **DATETIME / TIMESTAMP 타입일 경우 (함정 발생)**
>
> 실제 해석은 `2023-01-01 00:00:00 ~ 2023-12-31 00:00:00`으로 됩니다.
>
> 이 경우:
>
> - `2023-12-31 00:00:00` 는 포함
> - `2023-12-31 13:00:00` 은 **포함 안 됨**
> - `2023-12-31 23:59:59` 도 **포함 안 됨**

## 6. WHERE + IN (목록 조건)

```sql
SELECT *
FROM employees
WHERE deptno IN (10, 20, 30);
```

→ `deptno`가 **10, 20, 30 중 하나라도 해당되면 조회**

- `OR` 여러 개 쓰는 것보다 가독성이 훨씬 좋음

## 7. WHERE + LIKE (문자 패턴 검색)

| **패턴** | **의미** |
| --- | --- |
| %A% | A가 포함 |
| A% | A로 시작 |
| %A | A로 끝 |
| _A | 두 번째 글자가 A |
| A_ | A로 시작하는 두 글자 |

```sql
SELECT *
FROM employees
WHERE name LIKE '김%';
```

→ **김으로 시작하는 이름 검색**

## 8. WHERE + IS NULL

| **구문** | **의미** |
| --- | --- |
| IS NULL | 값이 없는 행 조회 |
| IS NOT NULL | 값이 존재하는 행 조회 |

- `EMP` 테이블에서 성과급이 있는 사원정보를 출력하시오.

```sql
SELECT *
FROM EMP
WHERE COMM IS NOT NULL;
```

→ **성과급이 있는 사람 조회**

> ❗ **NULL이란?**
>
> NULL은 "값이 없다(없음, 미정, 알 수 없음)"를 의미하는 상태입니다.
>
> 즉, 0도 아니고, 빈 문자열도 아니며, 어떤 값도 아직 존재하지 않는 상태입니다.

## 9. 문제 풀이

**1. `EMP` 테이블에서 직급(`joblv`)이 `차장`인 사원정보를 출력하시오.**

<details>
<summary>정답 보기</summary>

```sql
SELECT *
FROM EMP
WHERE joblv = '차장';
```

</details>

**2. `EMP` 테이블에서 부서번호가 11번이 아닌 사원정보를 출력하시오.**

<details>
<summary>정답 보기</summary>

```sql
SELECT *
FROM EMP
WHERE deptno != 11;
```

```sql
SELECT *
FROM EMP
WHERE deptno <> 11;
```

</details>

**3. `EMP` 테이블에서 부서번호가 11인 사원 중에 직급이 과장 또는 대리인 사원정보를 출력하시오.**

<details>
<summary>정답 보기</summary>

```sql
SELECT *
FROM EMP
WHERE deptno = 11
  AND joblv IN ('과장', '대리');
```

```sql
SELECT *
FROM EMP
WHERE deptno = 11
  AND (joblv = '과장' OR joblv = '대리');
```

</details>

**4. `EMP` 테이블에서 성과급이 없는 사원정보를 출력하시오.**

<details>
<summary>정답 보기</summary>

```sql
SELECT *
FROM EMP
WHERE COMM IS NULL;
```

</details>

**5. `EMP` 테이블에서 이름의 두 번째 글자에 `정`이 들어가는 사원 정보를 출력하시오.**

<details>
<summary>정답 보기</summary>

```sql
SELECT *
FROM EMP
WHERE ename_ko LIKE '_정%';
```

</details>
