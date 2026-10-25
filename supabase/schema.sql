-- 러너즈빌드업 · Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run 하세요.
-- 마지막 줄의 어드민 비밀번호는 꼭 바꿔서 실행하세요.
--
-- 구조: 테이블은 RLS로 잠그고 정책을 두지 않는다. 브라우저(anon 키)는
-- 아래 security definer 함수(RPC)만 호출할 수 있고, 함수가 세션 토큰과
-- 4자리 번호를 검증한다. Supabase Auth는 쓰지 않는다.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 40),
  pin_hash text not null,
  failed_count int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  token uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  problem_id text not null,
  code text not null check (length(code) <= 20000),
  passed boolean not null,
  passed_count int not null default 0,
  total_count int not null default 0,
  case_results jsonb,
  created_at timestamptz not null default now()
);
create index if not exists submissions_problem_student on public.submissions (problem_id, student_id);
create index if not exists submissions_student on public.submissions (student_id);

create table if not exists public.app_settings (
  key text primary key,
  value text not null
);

alter table public.students enable row level security;
alter table public.sessions enable row level security;
alter table public.submissions enable row level security;
alter table public.app_settings enable row level security;
revoke all on public.students, public.sessions, public.submissions, public.app_settings from anon, authenticated;

-- ── 내부 도우미 ───────────────────────────────────────────

create or replace function public._student_of(p_token uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select student_id from sessions
  where token = p_token and not is_admin and created_at > now() - interval '60 days';
$$;

create or replace function public._is_admin(p_token uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from sessions
    where token = p_token and is_admin and created_at > now() - interval '7 days'
  );
$$;

create or replace function public._new_pin(p_name text)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare
  v_pin text;
begin
  -- 같은 이름의 학생과 번호가 겹치지 않게 만든다 (이름 + 번호 조합이 로그인 키)
  loop
    v_pin := lpad(floor(random() * 10000)::int::text, 4, '0');
    exit when not exists (
      select 1 from students where name = p_name and pin_hash = crypt(v_pin, pin_hash)
    );
  end loop;
  return v_pin;
end;
$$;

-- ── 수강생 ───────────────────────────────────────────────

create or replace function public.student_login(p_name text, p_pin text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text := trim(p_name);
  v_student students;
  v_locked timestamptz;
  v_token uuid;
begin
  if p_pin !~ '^[0-9]{4}$' then
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
    json_build_object('id', v_student.id, 'name', v_student.name));
end;
$$;

-- 회원가입: 수강생이 이름과 4자리 번호를 직접 정한다.
-- 가입 코드가 설정돼 있으면 코드가 맞아야 가입된다 (외부인 가입 방지).
create or replace function public.student_signup(p_name text, p_pin text, p_join_code text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text := regexp_replace(trim(coalesce(p_name, '')), '\s+', ' ', 'g');
  v_code text;
  v_id uuid;
  v_token uuid;
begin
  if length(v_name) < 1 or length(v_name) > 40 then
    return json_build_object('ok', false, 'error', 'name_format');
  end if;
  if coalesce(p_pin, '') !~ '^[0-9]{4}$' then
    return json_build_object('ok', false, 'error', 'pin_format');
  end if;
  select value into v_code from app_settings where key = 'join_code';
  if coalesce(v_code, '') <> '' and upper(trim(coalesce(p_join_code, ''))) <> upper(v_code) then
    perform pg_sleep(1);
    return json_build_object('ok', false, 'error', 'join_code');
  end if;
  if exists (select 1 from students where name = v_name) then
    return json_build_object('ok', false, 'error', 'name_taken');
  end if;
  insert into students (name, pin_hash) values (v_name, crypt(p_pin, gen_salt('bf', 8)))
    returning id into v_id;
  insert into sessions (student_id) values (v_id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student', json_build_object('id', v_id, 'name', v_name));
end;
$$;

create or replace function public.signup_info()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object('ok', true, 'join_code_required',
    coalesce((select value from app_settings where key = 'join_code'), '') <> '');
$$;

create or replace function public.student_me(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  return (
    select json_build_object(
      'ok', true,
      'student', json_build_object('id', s.id, 'name', s.name),
      'progress', coalesce((
        select json_object_agg(problem_id, json_build_object('attempts', attempts, 'solved', solved))
        from (
          select problem_id, count(*) as attempts, bool_or(passed) as solved
          from submissions where student_id = v_sid group by problem_id
        ) p
      ), '{}'::json)
    )
    from students s where s.id = v_sid
  );
end;
$$;

create or replace function public.student_submit(
  p_token uuid, p_problem_id text, p_code text,
  p_passed boolean, p_passed_count int, p_total_count int, p_case_results jsonb
)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
  v_already boolean;
  v_rank int;
  v_total int;
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;

  select exists (
    select 1 from submissions where student_id = v_sid and problem_id = p_problem_id and passed
  ) into v_already;

  insert into submissions (student_id, problem_id, code, passed, passed_count, total_count, case_results)
  values (v_sid, p_problem_id, p_code, p_passed, p_passed_count, p_total_count, p_case_results);

  if not p_passed or v_already then
    return json_build_object('ok', true, 'first_solve', false);
  end if;

  -- 순위 = 이 문제를 처음 맞힌 시각 기준으로 나보다 같거나 빨랐던 학생 수
  select count(*) into v_rank from (
    select min(created_at) as t from submissions
    where problem_id = p_problem_id and passed group by student_id
  ) f
  where f.t <= (
    select min(created_at) from submissions
    where student_id = v_sid and problem_id = p_problem_id and passed
  );
  select count(*) into v_total from students;

  return json_build_object('ok', true, 'first_solve', true, 'rank', v_rank, 'total', v_total);
end;
$$;

create or replace function public.student_history(p_token uuid, p_problem_id text)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'items', coalesce((
    select json_agg(row_to_json(x) order by x.created_at desc) from (
      select id, code, passed, passed_count, total_count, created_at
      from submissions where student_id = v_sid and problem_id = p_problem_id
      order by created_at desc limit 30
    ) x
  ), '[]'::json));
end;
$$;

-- ── 어드민 ───────────────────────────────────────────────

create or replace function public.admin_login(p_password text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_hash text;
  v_token uuid;
begin
  select value into v_hash from app_settings where key = 'admin_password_hash';
  if v_hash is null or v_hash <> crypt(p_password, v_hash) then
    perform pg_sleep(1);  -- 무차별 대입 속도를 늦춘다
    return json_build_object('ok', false, 'error', 'invalid');
  end if;
  insert into sessions (is_admin) values (true) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token);
end;
$$;

create or replace function public.admin_roster(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'students', coalesce((
    select json_agg(json_build_object(
      'id', id, 'name', name, 'created_at', created_at,
      'locked', locked_until is not null and locked_until > now()
    ) order by name, created_at) from students
  ), '[]'::json));
end;
$$;

create or replace function public.admin_add_students(p_token uuid, p_names text[])
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text;
  v_pin text;
  v_id uuid;
  v_out json[] := '{}';
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  foreach v_name in array p_names loop
    v_name := trim(v_name);
    continue when v_name = '';
    v_pin := _new_pin(v_name);
    insert into students (name, pin_hash) values (v_name, crypt(v_pin, gen_salt('bf', 8)))
      returning id into v_id;
    v_out := v_out || json_build_object('id', v_id, 'name', v_name, 'pin', v_pin);
  end loop;
  return json_build_object('ok', true, 'created', array_to_json(v_out));
end;
$$;

create or replace function public.admin_reset_pin(p_token uuid, p_student_id uuid)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text;
  v_pin text;
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  select name into v_name from students where id = p_student_id;
  if v_name is null then return json_build_object('ok', false, 'error', 'not_found'); end if;
  v_pin := _new_pin(v_name);
  update students
    set pin_hash = crypt(v_pin, gen_salt('bf', 8)), failed_count = 0, locked_until = null
    where id = p_student_id;
  delete from sessions where student_id = p_student_id;
  return json_build_object('ok', true, 'name', v_name, 'pin', v_pin);
end;
$$;

create or replace function public.admin_delete_student(p_token uuid, p_student_id uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  delete from students where id = p_student_id;
  return json_build_object('ok', true);
end;
$$;

create or replace function public.admin_matrix(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'cells', coalesce((
    select json_agg(row_to_json(c)) from (
      select student_id, problem_id,
             count(*) as attempts,
             bool_or(passed) as solved,
             min(created_at) filter (where passed) as first_solved_at,
             max(created_at) as last_at
      from submissions group by student_id, problem_id
    ) c
  ), '[]'::json));
end;
$$;

create or replace function public.admin_submissions(p_token uuid, p_student_id uuid, p_problem_id text)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'items', coalesce((
    select json_agg(row_to_json(x) order by x.created_at desc) from (
      select id, code, passed, passed_count, total_count, case_results, created_at
      from submissions where student_id = p_student_id and problem_id = p_problem_id
      order by created_at desc limit 50
    ) x
  ), '[]'::json));
end;
$$;

create or replace function public.admin_get_join_code(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'join_code', coalesce((select value from app_settings where key = 'join_code'), ''));
end;
$$;

create or replace function public.admin_set_join_code(p_token uuid, p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  if length(v_code) > 30 then return json_build_object('ok', false, 'error', 'code_format'); end if;
  insert into app_settings (key, value) values ('join_code', v_code)
  on conflict (key) do update set value = excluded.value;
  return json_build_object('ok', true, 'join_code', v_code);
end;
$$;

-- SQL Editor 전용 (브라우저에서 호출 불가)
create or replace function public.set_admin_password(p_password text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if length(p_password) < 8 then raise exception '비밀번호는 8자 이상으로 정하세요'; end if;
  insert into app_settings (key, value) values ('admin_password_hash', crypt(p_password, gen_salt('bf', 10)))
  on conflict (key) do update set value = excluded.value;
  delete from sessions where is_admin;
end;
$$;

-- ── 실행 권한: 브라우저(anon)는 아래 함수만 ───────────────────

grant usage on schema public to anon;
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function
  public.student_login(text, text),
  public.student_signup(text, text, text),
  public.signup_info(),
  public.admin_get_join_code(uuid),
  public.admin_set_join_code(uuid, text),
  public.student_me(uuid),
  public.student_submit(uuid, text, text, boolean, int, int, jsonb),
  public.student_history(uuid, text),
  public.admin_login(text),
  public.admin_roster(uuid),
  public.admin_add_students(uuid, text[]),
  public.admin_reset_pin(uuid, uuid),
  public.admin_delete_student(uuid, uuid),
  public.admin_matrix(uuid),
  public.admin_submissions(uuid, uuid, text)
to anon;

-- ↓ 어드민 비밀번호를 바꿔서 실행하세요 (8자 이상)
select public.set_admin_password('여기에-어드민-비밀번호');

-- ↓ 회원가입 코드 (수업 첫날 화면에 띄워 주세요). 빈 문자열이면 누구나 가입 가능.
--   나중에 어드민 > 명단 화면에서도 바꿀 수 있습니다.
insert into app_settings (key, value) values ('join_code', 'QAQC8')
on conflict (key) do update set value = excluded.value;
