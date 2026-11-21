-- 러너즈빌드업 업데이트 (2026-11-21): 4자리 번호 → 비밀번호
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (google_login · optional_join_code 마이그레이션 다음에 실행합니다. 여러 번 실행해도 안전합니다)
--
-- · 새 회원가입: 비밀번호 6~72자 (영문 · 숫자 · 기호 자유)
-- · 로그인 · 구글 계정 연결: 4~72자를 받는다 → 예전 4자리 번호와 어드민이 발급한 번호도 그대로 쓸 수 있다
-- · 저장 방식(bcrypt 해시 pin_hash)과 5회 실패 잠금은 그대로. 기존 데이터는 바뀌지 않는다.

create or replace function public.student_login(p_name text, p_pin text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text := trim(p_name);
  v_student students;
  v_locked timestamptz;
  v_token uuid;
begin
  -- 비밀번호 4~72자 (예전 4자리 번호 · 어드민이 발급한 번호도 그대로 통과)
  if length(coalesce(p_pin, '')) not between 4 and 72 then
    return json_build_object('ok', false, 'error', 'pin_format');
  end if;

  select max(locked_until) into v_locked from students where name = v_name;
  if v_locked is not null and v_locked > now() then
    return json_build_object('ok', false, 'error', 'locked', 'until', v_locked);
  end if;

  select * into v_student from students
  where name = v_name and pin_hash = crypt(p_pin, pin_hash)
  limit 1;

  if v_student.id is null then
    -- 실패 5회면 5분 잠금 (같은 이름 전체)
    update students
      set failed_count = failed_count + 1,
          locked_until = case when failed_count + 1 >= 5 then now() + interval '5 minutes' else locked_until end
      where name = v_name;
    update students set failed_count = 0 where name = v_name and failed_count >= 5;
    return json_build_object('ok', false, 'error', 'invalid');
  end if;

  update students set failed_count = 0, locked_until = null where name = v_name;
  insert into sessions (student_id) values (v_student.id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_student.id, 'name', v_student.name,
      'org', v_student.join_code, 'org_label', _group_label(v_student.join_code)));
end;
$$;

create or replace function public.student_signup(p_name text, p_pin text, p_join_code text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text := regexp_replace(trim(coalesce(p_name, '')), '\s+', ' ', 'g');
  v_code text := nullif(upper(trim(coalesce(p_join_code, ''))), '');
  v_id uuid;
  v_token uuid;
begin
  if length(v_name) < 1 or length(v_name) > 40 then
    return json_build_object('ok', false, 'error', 'name_format');
  end if;
  -- 새 가입은 비밀번호 6~72자 (bcrypt 는 72바이트까지만 본다)
  if length(coalesce(p_pin, '')) not between 6 and 72 then
    return json_build_object('ok', false, 'error', 'password_format');
  end if;
  -- 가입 코드는 선택: 비우면 기본 데이터 과정(join_code null), 적었으면 등록된 그룹 코드여야 한다
  if v_code is not null and not exists (select 1 from groups where code = v_code) then
    perform pg_sleep(1);
    return json_build_object('ok', false, 'error', 'join_code');
  end if;
  if exists (select 1 from students where name = v_name) then
    return json_build_object('ok', false, 'error', 'name_taken');
  end if;
  insert into students (name, pin_hash, join_code)
    values (v_name, crypt(p_pin, gen_salt('bf', 8)), v_code)
    returning id into v_id;
  insert into sessions (student_id) values (v_id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_id, 'name', v_name, 'org', v_code, 'org_label', _group_label(v_code)));
end;
$$;

create or replace function public.google_link(p_name text, p_pin text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_uid uuid := auth.uid();
  v_name text := trim(coalesce(p_name, ''));
  v_student students;
  v_locked timestamptz;
  v_token uuid;
begin
  if v_uid is null then return json_build_object('ok', false, 'error', 'google_auth'); end if;
  if length(coalesce(p_pin, '')) not between 4 and 72 then
    return json_build_object('ok', false, 'error', 'pin_format');
  end if;
  if exists (select 1 from students where auth_user_id = v_uid) then
    return json_build_object('ok', false, 'error', 'already_linked');
  end if;

  select max(locked_until) into v_locked from students where name = v_name;
  if v_locked is not null and v_locked > now() then
    return json_build_object('ok', false, 'error', 'locked', 'until', v_locked);
  end if;

  select * into v_student from students
  where name = v_name and pin_hash is not null and pin_hash = crypt(p_pin, pin_hash)
  limit 1;

  if v_student.id is null then
    update students
      set failed_count = failed_count + 1,
          locked_until = case when failed_count + 1 >= 5 then now() + interval '5 minutes' else locked_until end
      where name = v_name;
    update students set failed_count = 0 where name = v_name and failed_count >= 5;
    return json_build_object('ok', false, 'error', 'invalid');
  end if;
  if v_student.auth_user_id is not null and v_student.auth_user_id <> v_uid then
    return json_build_object('ok', false, 'error', 'already_linked');
  end if;

  update students set failed_count = 0, locked_until = null where name = v_name;
  update students set auth_user_id = v_uid, email = auth.jwt() ->> 'email' where id = v_student.id;
  insert into sessions (student_id) values (v_student.id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_student.id, 'name', v_student.name,
      'org', v_student.join_code, 'org_label', _group_label(v_student.join_code)));
end;
$$;
