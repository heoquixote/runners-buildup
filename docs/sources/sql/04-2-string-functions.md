## 1. 함수

| **함수** | **의미** | **예시** |
| --- | --- | --- |
| UPPER() | 대문자 변환 | UPPER(name) |
| LOWER() | 소문자 변환 | LOWER(name) |
| LENGTH() | 바이트 길이 | LENGTH(name) |
| LEFT() | 왼쪽(앞)부터 지정한 개수만큼 문자를 잘라서 반환 | LEFT('BIGDATA', 3) |
| RIGHT() | 오른쪽(뒤)부터 지정한 개수만큼 문자를 잘라서 반환 | RIGHT('BIGDATA', 4) |
| SUBSTRING() | 부분 추출 | SUBSTRING(name, 1, 2) |
| REPLACE() | 문자 치환 | REPLACE(name, '김', '이') |
| LTRIM() | 왼쪽부터 해당 문자 제거, 인자 값 없을 시 공백 제거 | LTRIM('ABCD', 'A') |
| RTRIM() | LTRIM과 달리 오른쪽부터 수행 | RTRIM('ABCD', 'A') |
| TRIM() | 양쪽 공백 제거 | TRIM(name) |
| CONCAT() | 문자열 결합 | CONCAT(name, deptno) |
| LPAD() | 첫째 인자에서 셋째 인자를 둘째 인자 길이가 될 때까지 왼쪽부터 채움 | LPAD(ename, 8, '*') |
| RPAD() | LPAD와 달리 오른쪽부터 채움 | RPAD(ename, 8, '*') |
| POSITION() | 문자열에서 특정 문자의 위치를 리턴, 찾는 값이 없으면 0 리턴 | POSITION('D' IN 'BIGDATA') |

> ❗ 한글 길이를 셀 때는 **`CHAR_LENGTH` 사용**

## 2. 문제

**1. `EMP` 테이블에서 다음과 같이 데이터를 출력하시오.**

| 이름 [직급] |
| --- |
| 김대표 [CEO] |
| 최재혁 [부장] |
| 남궁민수 [대리] |
| 백정태 [상무] |
| 김낙수 [부장] |
| 도진우 [부장] |
| 신준섭 [차장] |
| 허태환 [과장] |
| 송익현 [과장] |
| 정성구 [대리] |
| 이명헌 [대리] |
| 권송희 [사원] |
| 채소연 [사원] |
| 이주영 [작업반장] |

<details>
<summary>정답 보기</summary>

```sql
SELECT CONCAT(ename_ko, ' [', joblv, ']') AS '이름 [직급]'
FROM emp;
```

</details>

**2. `EMP` 테이블에서 이름 글자수 별 카운트를 출력하시오.**

| 이름길이 | 카운트 |
| --- | --- |
| 3 | 13 |
| 4 | 1 |

<details>
<summary>정답 보기</summary>

```sql
SELECT CHAR_LENGTH(ename_ko) AS '이름길이'
     , COUNT(*) AS '카운트'
FROM emp
GROUP BY 이름길이;
```

</details>

**3. `EMP` 테이블에서 이름의 마지막 글자가 `수`로 끝나는 사원정보를 아래와 같이 출력하는 SQL을 작성하시오.**

(영문명은 대문자로 표기하시오)

| 이름 | 영문명 |
| --- | --- |
| 남궁민수 | NAMGUNG MINSU |
| 김낙수 | KIM NAKSU |

<details>
<summary>정답 보기</summary>

```sql
SELECT ename_ko AS '이름'
     , UPPER(ename_en) AS '영문명'
FROM emp
WHERE RIGHT(ename_ko, 1) = '수';
```

</details>

**4. `EMP` 테이블에서 이름이 김낙수인 사원정보를 `REPLACE` 함수를 활용하여 아래와 같이 바꾸는 SQL 쿼리를 작성하시오.**

| 이름 | 현 직급 | 승진 직급 |
| --- | --- | --- |
| 김낙수 | 부장 | 상무 |

![문자열 함수 예시](../assets/04-2/04-2-string-function-example.png)

<details>
<summary>정답 보기</summary>

```sql
SELECT ename_ko AS '이름'
     , joblv AS '현직급'
     , REPLACE(joblv, '부장', '상무') AS '승진 직급'
FROM emp
WHERE ename_ko = '김낙수';
```

</details>

**5. 이름을 익명 처리 후 연봉과 성과금 관련된 정보를 전달해달라는 요청을 받았습니다.**

아래 출력 결과와 동일한 형태로 조회하는 SQL문을 작성하시오.

(성을 제외한 이름은 가명 처리 시 글자수와 상관없이 `**`로 처리)

| 직급 | 이름 | 연봉 | 성과금 |
| --- | --- | --- | --- |
| CEO | 김** | 80000 | 0 |
| 부장 | 최** | 13000 | 5000 |
| 대리 | 남** | 5000 | 0 |
| 상무 | 백** | 20000 | 10000 |
| 부장 | 김** | 15000 | 5000 |
| 부장 | 도** | 12000 | 7000 |
| 차장 | 신** | 10000 | 3000 |
| 과장 | 허** | 8000 | 2000 |
| 과장 | 송** | 7000 | 1500 |
| 대리 | 정** | 6000 | 0 |
| 대리 | 이** | 5500 | 0 |
| 사원 | 권** | 4800 | 1000 |
| 사원 | 채** | 4500 | 1000 |
| 작업반장 | 이** | 6000 | 2000 |

<details>
<summary>정답 보기</summary>

```sql
SELECT joblv AS '직급'
     , CONCAT(LEFT(ename_ko, 1), '**') AS '이름'
     , sal AS '연봉'
     , comm AS '성과금'
FROM emp;
```

</details>
