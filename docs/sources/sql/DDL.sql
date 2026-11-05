-- 기존에 basic_sql 데이터베이스가 존재하면 삭제 (동일한 이름으로 다시 생성하기 위해 초기화하는 과정)
DROP DATABASE IF EXISTS basic_sql;

-- basic_sql 이라는 이름의 새로운 데이터베이스 생성
CREATE DATABASE basic_sql
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 앞으로 실행되는 모든 쿼리를 basic_sql 데이터베이스 기준으로 수행
USE basic_sql;

-- emp 테이블이 이미 존재하면 먼저 삭제
DROP TABLE IF EXISTS emp;

-- 사원 정보를 저장하는 emp 테이블 생성
CREATE TABLE basic_sql.emp (
  empno     INT PRIMARY KEY,
  ename_ko  VARCHAR(50),
  ename_en  VARCHAR(100),
  joblv     VARCHAR(50),
  mgr       INT,
  hiredate  DATE,
  sal       INT,
  comm      INT,
  deptno    INT,
  employed  BOOLEAN
);

-- dept 테이블이 이미 존재하면 먼저 삭제 (재실행 시 오류 방지 및 초기화 목적)
DROP TABLE IF EXISTS dept;

-- 부서 정보를 저장하는 dept 테이블 생성
CREATE TABLE basic_sql.dept (
  deptno   INT PRIMARY KEY,
  dname    VARCHAR(100),
  location VARCHAR(100)
);

-- emp 테이블에 기존 데이터가 있으면 모두 삭제 (초기화)
DELETE FROM emp;

-- 사원 데이터 신규 등록
INSERT INTO basic_sql.emp
(empno, ename_ko, ename_en, joblv, mgr, hiredate, sal, comm, deptno, employed)
VALUES
(1000, '김대표', 'Kim Daepyo', 'CEO', NULL, '1996-01-01', 80000, 0, NULL, TRUE),
(7001, '백정태', 'Baek Jeongtae', '상무', 1000, '1998-07-01', 20000, 10000, 10, TRUE),
(7002, '김낙수', 'Kim Naksu', '부장', 7001, '2000-03-15', 15000, 5000, 11, TRUE),
(4001, '최재혁', 'Choi Jaehyeok', '부장', 1000, '2003-08-19', 13000, 5000, 80, TRUE),
(7003, '도진우', 'Do Jinwoo', '부장', 7001, '2006-05-21', 12000, 7000, 12, TRUE),
(7004, '신준섭', 'Shin Junseop', '차장', 7003, '2017-11-10', 10000, 3000, 12, TRUE),
(7005, '허태환', 'Heo Taehwan', '과장', 7002, '2000-03-15', 8000, 2000, 11, FALSE),
(7006, '송익현', 'Song Ikhyun', '과장', 7002, '2015-04-03', 7000, 1500, 11, TRUE),
(7007, '정성구', 'Jung Sunggu', '대리', 7002, '2019-09-11', 6000, 0, 11, TRUE),
(7008, '이명헌', 'Lee Myungheon', '대리', 7003, '2020-06-08', 5500, 0, 12, TRUE),
(4002, '남궁민수', 'Namgung Minsu', '대리', 4001, '2021-07-08', 5000, 0, 80, TRUE),
(7009, '권송희', 'Kwon Songhee', '사원', 7002, '2022-01-03', 4800, 1000, 11, TRUE),
(7010, '채소연', 'Chae Soyeon', '사원', 7003, '2022-03-02', 4500, 1000, 12, TRUE),
(8001, '이주영', 'Lee Juyoung', '작업반장', NULL, '2015-04-03', 6000, 2000, 40, TRUE);

-- dept 테이블에 기존 데이터가 있으면 모두 삭제 (초기화)
DELETE FROM dept;

-- 부서 데이터 신규 등록
INSERT INTO dept (deptno, dname, location) VALUES
  (10, 'ACT 영업본부', '서울'),
  (11, 'ACT 영업1팀', '서울'),
  (12, 'ACT 영업2팀', '서울'),
  (40, 'ACT 아산공장', '아산'),
  (80, 'ACT 인사팀', '서울');
