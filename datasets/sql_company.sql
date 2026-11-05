-- 회사 실습 데이터: 사원(emp) · 부서(dept) · 급여 등급(salgrade)
CREATE TABLE emp (
  empno    INTEGER PRIMARY KEY,  -- 사번
  ename_ko TEXT,                 -- 이름(한글)
  ename_en TEXT,                 -- 이름(영문)
  joblv    TEXT,                 -- 직급
  mgr      INTEGER,              -- 상사 사번
  hiredate TEXT,                 -- 입사일 (YYYY-MM-DD)
  sal      INTEGER,              -- 연봉 (만원)
  comm     INTEGER,              -- 성과급 (만원)
  deptno   INTEGER,              -- 부서 번호
  employed INTEGER               -- 재직 여부 (1 재직, 0 퇴사)
);
CREATE TABLE dept (
  deptno   INTEGER PRIMARY KEY,  -- 부서 번호
  dname    TEXT,                 -- 부서 이름
  location TEXT                  -- 위치
);
CREATE TABLE salgrade (
  grade TEXT,                    -- 급여 등급
  losal INTEGER,                 -- 등급 최소 총급여
  hisal INTEGER                  -- 등급 최대 총급여
);
INSERT INTO emp (empno, ename_ko, ename_en, joblv, mgr, hiredate, sal, comm, deptno, employed) VALUES
(1000, '김대표', 'Kim Daepyo', 'CEO', NULL, '1996-01-01', 80000, 0, NULL, 1),
(7001, '백정태', 'Baek Jeongtae', '상무', 1000, '1998-07-01', 20000, 10000, 10, 1),
(7002, '김낙수', 'Kim Naksu', '부장', 7001, '2000-03-15', 15000, 5000, 11, 1),
(4001, '최재혁', 'Choi Jaehyeok', '부장', 1000, '2003-08-19', 13000, 5000, 80, 1),
(7003, '도진우', 'Do Jinwoo', '부장', 7001, '2006-05-21', 12000, 7000, 12, 1),
(7004, '신준섭', 'Shin Junseop', '차장', 7003, '2017-11-10', 10000, 3000, 12, 1),
(7005, '허태환', 'Heo Taehwan', '과장', 7002, '2000-03-15', 8000, 2000, 11, 0),
(7006, '송익현', 'Song Ikhyun', '과장', 7002, '2015-04-03', 7000, 1500, 11, 1),
(7007, '정성구', 'Jung Sunggu', '대리', 7002, '2019-09-11', 6000, 0, 11, 1),
(7008, '이명헌', 'Lee Myungheon', '대리', 7003, '2020-06-08', 5500, 0, 12, 1),
(4002, '남궁민수', 'Namgung Minsu', '대리', 4001, '2021-07-08', 5000, 0, 80, 1),
(7009, '권송희', 'Kwon Songhee', '사원', 7002, '2022-01-03', 4800, 1000, 11, 1),
(7010, '채소연', 'Chae Soyeon', '사원', 7003, '2022-03-02', 4500, 1000, 12, 1),
(8001, '이주영', 'Lee Juyoung', '작업반장', NULL, '2015-04-03', 6000, 2000, 40, 1);
INSERT INTO dept (deptno, dname, location) VALUES
(10, 'ACT 영업본부', '서울'),
(11, 'ACT 영업1팀', '서울'),
(12, 'ACT 영업2팀', '서울'),
(40, 'ACT 아산공장', '아산'),
(80, 'ACT 인사팀', '서울');
INSERT INTO salgrade (grade, losal, hisal) VALUES
('E', 0, 5000),
('D', 5001, 10000),
('C', 10001, 20000),
('B', 20001, 30000),
('A', 30001, 99999);
