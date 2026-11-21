-- 러너즈빌드업 업데이트 (2026-11-21): 구글 로그인
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (기존 수강생 · 제출 기록은 바뀌지 않습니다. 여러 번 실행해도 안전합니다)
--
-- 구조
--   · 구글 인증은 Supabase Auth 가 맡고, 브라우저는 받은 access token(JWT)으로 아래 함수를 부른다.
--     함수는 auth.uid() 로 구글 사용자를 확인한 뒤, 지금과 같은 sessions 토큰을 발급한다.
--     → 로그인 이후 동작(진도 · 제출 · 어드민)은 이름+번호 로그인과 완전히 같다.
--   · students.auth_user_id 로 구글 계정과 학생 행을 1:1 로 잇는다.
--   · 처음 온 구글 사용자는 이름 + 가입 코드를 입력해야 학생 행이 생긴다 (student_signup 과 같은 검증).
--   · 이미 이름+번호로 가입한 학생은 google_link 로 기존 계정에 구글을 연결할 수 있다.
--   · 구글로 가입한 학생은 번호가 없다(pin_hash null). 어드민 '번호 재발급'을 누르면 번호 로그인도 같이 쓸 수 있다.

alter table public.students add column if not exists auth_user_id uuid unique;
alter table public.students add column if not exists email text;
alter table public.students alter column pin_hash drop not null;

-- 구글 로그인: 연결된 학생이 있으면 세션 발급, 없으면 need_signup
create or replace function public.google_login()
returns json language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_meta jsonb := coalesce(auth.jwt() -> 'user_metadata', '{}'::jsonb);
  v_student students;
  v_token uuid;
begin
  if v_uid is null then return json_build_object('ok', false, 'error', 'google_auth'); end if;
  select * into v_student from students where auth_user_id = v_uid;
  if v_student.id is null then
    return json_build_object('ok', false, 'error', 'need_signup',
      'email', auth.jwt() ->> 'email',
      'name', coalesce(v_meta ->> 'full_name', v_meta ->> 'name'),
      'join_code_required', exists (select 1 from groups));
  end if;
  update students set email = coalesce(auth.jwt() ->> 'email', email) where id = v_student.id;
  insert into sessions (student_id) values (v_student.id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_student.id, 'name', v_student.name,
      'org', v_student.join_code, 'org_label', _group_label(v_student.join_code)));
end;
$$;

-- 구글 첫 가입: 이름 + 가입 코드 (student_signup 과 같은 규칙, 번호만 없음)
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
  if exists (select 1 from groups) then
    if v_code is null or not exists (select 1 from groups where code = v_code) then
      perform pg_sleep(1);
      return json_build_object('ok', false, 'error', 'join_code');
    end if;
  else
    v_code := null;
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

-- 기존 이름+번호 계정에 구글 연결 (student_login 과 같은 잠금 규칙)
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
  if coalesce(p_pin, '') !~ '^[0-9]{4}$' then
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

-- 어드민 명단: 구글 연결 여부 · 이메일 추가
create or replace function public.admin_roster(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'students', coalesce((
    select json_agg(json_build_object(
      'id', id, 'name', name, 'created_at', created_at, 'group', join_code,
      'locked', locked_until is not null and locked_until > now(),
      'exclude_from_rank', exclude_from_rank,
      'google', auth_user_id is not null, 'email', email
    ) order by name, created_at) from students
  ), '[]'::json));
end;
$$;

-- 구글 함수는 로그인한 사용자(authenticated 역할, 구글 JWT)만 부를 수 있다
revoke execute on function public.google_login() from public, anon;
revoke execute on function public.google_signup(text, text) from public, anon;
revoke execute on function public.google_link(text, text) from public, anon;
grant usage on schema public to authenticated;
grant execute on function public.google_login(), public.google_signup(text, text), public.google_link(text, text) to authenticated;
revoke execute on function public.admin_roster(uuid) from public;
grant execute on function public.admin_roster(uuid) to anon;
