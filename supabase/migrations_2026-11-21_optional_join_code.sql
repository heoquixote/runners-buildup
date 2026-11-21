-- 러너즈빌드업 업데이트 (2026-11-21): 가입 코드를 선택 항목으로
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (migrations_2026-11-21_google_login.sql 을 먼저 실행한 뒤에 실행합니다. 여러 번 실행해도 안전합니다)
--
-- 가입 코드를 비우면 기본 데이터 과정(join_code null)으로 가입된다.
-- 코드를 적었다면 지금처럼 등록된 그룹 코드여야 한다 (QAQC8 → QAQC 과정).
-- 이름+번호 가입(student_signup)과 구글 가입(google_signup) 모두 같은 규칙.

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
  if coalesce(p_pin, '') !~ '^[0-9]{4}$' then
    return json_build_object('ok', false, 'error', 'pin_format');
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

create or replace function public.google_signup(p_name text, p_join_code text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_name text := regexp_replace(trim(coalesce(p_name, '')), '\s+', ' ', 'g');
  v_code text := nullif(upper(trim(coalesce(p_join_code, ''))), '');
  v_id uuid;
  v_token uuid;
begin
  if v_uid is null then return json_build_object('ok', false, 'error', 'google_auth'); end if;
  if exists (select 1 from students where auth_user_id = v_uid) then
    return json_build_object('ok', false, 'error', 'already_linked');
  end if;
  if length(v_name) < 1 or length(v_name) > 40 then
    return json_build_object('ok', false, 'error', 'name_format');
  end if;
  -- 가입 코드는 선택: 비우면 기본 데이터 과정(join_code null), 적었으면 등록된 그룹 코드여야 한다
  if v_code is not null and not exists (select 1 from groups where code = v_code) then
    perform pg_sleep(1);
    return json_build_object('ok', false, 'error', 'join_code');
  end if;
  if exists (select 1 from students where name = v_name) then
    return json_build_object('ok', false, 'error', 'name_taken');
  end if;
  insert into students (name, pin_hash, join_code, auth_user_id, email)
    values (v_name, null, v_code, v_uid, auth.jwt() ->> 'email')
    returning id into v_id;
  insert into sessions (student_id) values (v_id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_id, 'name', v_name, 'org', v_code, 'org_label', _group_label(v_code)));
end;
$$;
