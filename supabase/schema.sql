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

-- 가입할 때 쓴 가입 코드 (예: QAQC8). 코드별로 기관 로고 표시에 쓴다.
alter table public.students add column if not exists join_code text;

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

-- ── 그룹 (가입 코드 = 그룹) ─────────────────────────────────
-- 수강생은 그룹 코드로 가입하고, 어드민은 그룹별로 현황을 본다.
create table if not exists public.groups (
  code text primary key check (code = upper(code) and length(code) between 1 and 30),
  label text not null check (length(label) between 1 and 60),
  created_at timestamptz not null default now()
);
alter table public.groups enable row level security;
revoke all on public.groups from anon, authenticated;

create or replace function public._group_label(p_code text)
returns text language sql stable security definer set search_path = public as $$
  select label from groups where code = p_code;
$$;

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
    json_build_object('id', v_student.id, 'name', v_student.name,
      'org', v_student.join_code, 'org_label', _group_label(v_student.join_code)));
end;
$$;

-- 회원가입: 등록된 그룹 코드로만 가입된다. 그룹이 하나도 없으면 코드 없이 가입.
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
  insert into students (name, pin_hash, join_code)
    values (v_name, crypt(p_pin, gen_salt('bf', 8)), v_code)
    returning id into v_id;
  insert into sessions (student_id) values (v_id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_id, 'name', v_name, 'org', v_code, 'org_label', _group_label(v_code)));
end;
$$;

create or replace function public.signup_info()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object('ok', true, 'join_code_required', exists (select 1 from groups));
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
      'student', json_build_object('id', s.id, 'name', s.name, 'org', s.join_code, 'org_label', _group_label(s.join_code)),
      'progress', coalesce((
        select json_object_agg(problem_id, json_build_object('attempts', attempts, 'solved', solved))
        from (
          select problem_id, count(*) as attempts, bool_or(passed) as solved
          from submissions where student_id = v_sid group by problem_id
        ) x
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
  v_group text;
  v_already boolean;
  v_rank int;
  v_total int;
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  select join_code into v_group from students where id = v_sid;

  select exists (
    select 1 from submissions where student_id = v_sid and problem_id = p_problem_id and passed
  ) into v_already;

  insert into submissions (student_id, problem_id, code, passed, passed_count, total_count, case_results)
  values (v_sid, p_problem_id, p_code, p_passed, p_passed_count, p_total_count, p_case_results);

  if not p_passed or v_already then
    return json_build_object('ok', true, 'first_solve', false);
  end if;

  -- 순위 = 같은 그룹 안에서 이 문제를 처음 맞힌 시각이 나보다 같거나 빨랐던 학생 수
  select count(*) into v_rank from (
    select min(sub.created_at) as t
    from submissions sub join students st on st.id = sub.student_id
    where sub.problem_id = p_problem_id and sub.passed and st.join_code is not distinct from v_group
    group by sub.student_id
  ) f
  where f.t <= (
    select min(created_at) from submissions
    where student_id = v_sid and problem_id = p_problem_id and passed
  );
  select count(*) into v_total from students where join_code is not distinct from v_group;

  return json_build_object('ok', true, 'first_solve', true, 'rank', v_rank, 'total', v_total);
end;
$$;

create or replace function public.admin_roster(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'students', coalesce((
    select json_agg(json_build_object(
      'id', id, 'name', name, 'created_at', created_at, 'group', join_code,
      'locked', locked_until is not null and locked_until > now()
    ) order by name, created_at) from students
  ), '[]'::json));
end;
$$;

create or replace function public.admin_add_students(p_token uuid, p_names text[], p_group text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text;
  v_pin text;
  v_id uuid;
  v_group text := nullif(upper(trim(coalesce(p_group, ''))), '');
  v_out json[] := '{}';
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  if v_group is not null and not exists (select 1 from groups where code = v_group) then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  foreach v_name in array p_names loop
    v_name := trim(v_name);
    continue when v_name = '';
    v_pin := _new_pin(v_name);
    insert into students (name, pin_hash, join_code) values (v_name, crypt(v_pin, gen_salt('bf', 8)), v_group)
      returning id into v_id;
    v_out := v_out || json_build_object('id', v_id, 'name', v_name, 'pin', v_pin);
  end loop;
  return json_build_object('ok', true, 'created', array_to_json(v_out));
end;
$$;

create or replace function public.admin_groups(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'groups', coalesce((
    select json_agg(json_build_object('code', g.code, 'label', g.label,
      'count', (select count(*) from students s where s.join_code = g.code)) order by g.created_at)
    from groups g
  ), '[]'::json));
end;
$$;

create or replace function public.admin_save_group(p_token uuid, p_code text, p_label text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  v_label text := trim(coalesce(p_label, ''));
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  if v_code !~ '^[A-Z0-9_-]{1,30}$' or length(v_label) not between 1 and 60 then
    return json_build_object('ok', false, 'error', 'code_format');
  end if;
  insert into groups (code, label) values (v_code, v_label)
  on conflict (code) do update set label = excluded.label;
  return json_build_object('ok', true, 'code', v_code, 'label', v_label);
end;
$$;

create or replace function public.admin_delete_group(p_token uuid, p_code text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  if exists (select 1 from students where join_code = p_code) then
    return json_build_object('ok', false, 'error', 'group_in_use');
  end if;
  delete from groups where code = p_code;
  delete from app_settings where key = 'today_problems:' || p_code;
  return json_build_object('ok', true);
end;
$$;

-- 오늘의 과제: 그룹별로 저장 (키 today_problems:<코드>, 그룹 없음은 today_problems:)
create or replace function public.get_today(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
  v_group text;
  v_val text;
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  select join_code into v_group from students where id = v_sid;
  select value into v_val from app_settings where key = 'today_problems:' || coalesce(v_group, '');
  return json_build_object('ok', true, 'ids', coalesce(v_val::json, '[]'::json));
end;
$$;

create or replace function public.admin_get_today(p_token uuid, p_group text)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_val text;
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  select value into v_val from app_settings where key = 'today_problems:' || coalesce(p_group, '');
  return json_build_object('ok', true, 'ids', coalesce(v_val::json, '[]'::json));
end;
$$;

create or replace function public.admin_set_today(p_token uuid, p_ids text[], p_group text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_ids json := to_json(coalesce(p_ids, '{}')::text[]);
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  if coalesce(array_length(p_ids, 1), 0) > 20 then return json_build_object('ok', false, 'error', 'too_many'); end if;
  insert into app_settings (key, value) values ('today_problems:' || coalesce(p_group, ''), v_ids::text)
  on conflict (key) do update set value = excluded.value;
  return json_build_object('ok', true, 'ids', v_ids);
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
  public.student_me(uuid),
  public.student_submit(uuid, text, text, boolean, int, int, jsonb),
  public.student_history(uuid, text),
  public.get_today(uuid),
  public.admin_login(text),
  public.admin_roster(uuid),
  public.admin_add_students(uuid, text[], text),
  public.admin_reset_pin(uuid, uuid),
  public.admin_delete_student(uuid, uuid),
  public.admin_matrix(uuid),
  public.admin_submissions(uuid, uuid, text),
  public.admin_groups(uuid),
  public.admin_save_group(uuid, text, text),
  public.admin_delete_group(uuid, text),
  public.admin_get_today(uuid, text),
  public.admin_set_today(uuid, text[], text)
to anon;

-- ↓ 어드민 비밀번호를 바꿔서 실행하세요 (8자 이상)

-- ↓ 첫 그룹 (가입 코드 = 그룹 코드). 어드민 > 명단 화면에서 추가·수정할 수 있습니다.
insert into groups (code, label) values ('QAQC8', 'Team Sparta · QAQC 8기')
on conflict (code) do nothing;

-- ── 레슨 진도 (2026-11-03) ─────────────────────────────────
-- 레슨마다 한 줄: 읽기 시작(viewed) → 체크 퀴즈 통과(passed)
create table if not exists public.lesson_progress (
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_id text not null,
  status text not null default 'viewed' check (status in ('viewed', 'passed')),
  quiz_score int,
  updated_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);
alter table public.lesson_progress enable row level security;
revoke all on public.lesson_progress from anon, authenticated;

create or replace function public.lesson_progress_set(p_token uuid, p_lesson_id text, p_status text, p_quiz_score int)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  if p_status not in ('viewed', 'passed') or p_lesson_id !~ '^[a-z0-9-]{1,40}$' then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  insert into lesson_progress (student_id, lesson_id, status, quiz_score)
  values (v_sid, p_lesson_id, p_status, p_quiz_score)
  on conflict (student_id, lesson_id) do update set
    status = case when lesson_progress.status = 'passed' then 'passed' else excluded.status end,
    quiz_score = coalesce(excluded.quiz_score, lesson_progress.quiz_score),
    updated_at = now();
  return json_build_object('ok', true);
end;
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
      'student', json_build_object('id', s.id, 'name', s.name, 'org', s.join_code, 'org_label', _group_label(s.join_code)),
      'progress', coalesce((
        select json_object_agg(problem_id, json_build_object('attempts', attempts, 'solved', solved))
        from (
          select problem_id, count(*) as attempts, bool_or(passed) as solved
          from submissions where student_id = v_sid group by problem_id
        ) x
      ), '{}'::json),
      'lessons', coalesce((
        select json_object_agg(lesson_id, json_build_object('status', status, 'quiz_score', quiz_score, 'updated_at', updated_at))
        from lesson_progress where student_id = v_sid
      ), '{}'::json)
    )
    from students s where s.id = v_sid
  );
end;
$$;

create or replace function public.admin_lessons(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'rows', coalesce((
    select json_agg(json_build_object('student_id', student_id, 'lesson_id', lesson_id, 'status', status, 'updated_at', updated_at))
    from lesson_progress
  ), '[]'::json));
end;
$$;

-- 러너즈빌드업 업데이트 (2026-11-03 #2): 일일 학습 (오늘의 학습 · 연속 학습일 · 학습 잔디)
-- 기존 기록은 지우지 않습니다. 날짜는 한국 시간(Asia/Seoul) 기준입니다.

-- 레슨을 처음 통과한 시각 (다시 열어 봐도 바뀌지 않음)
alter table public.lesson_progress add column if not exists passed_at timestamptz;
update public.lesson_progress set passed_at = updated_at where status = 'passed' and passed_at is null;

create or replace function public.lesson_progress_set(p_token uuid, p_lesson_id text, p_status text, p_quiz_score int)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  if p_status not in ('viewed', 'passed') or p_lesson_id !~ '^[a-z0-9-]{1,40}$' then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  insert into lesson_progress (student_id, lesson_id, status, quiz_score, passed_at)
  values (v_sid, p_lesson_id, p_status, p_quiz_score, case when p_status = 'passed' then now() end)
  on conflict (student_id, lesson_id) do update set
    status = case when lesson_progress.status = 'passed' then 'passed' else excluded.status end,
    quiz_score = coalesce(excluded.quiz_score, lesson_progress.quiz_score),
    passed_at = coalesce(lesson_progress.passed_at, excluded.passed_at),
    updated_at = now();
  return json_build_object('ok', true);
end;
$$;

-- student_me: 문제별 처음 맞힌 시각(solved_at), 레슨 통과 시각(passed_at), 날짜별 학습 횟수(activity, 최근 200일)
create or replace function public.student_me(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  return (
    select json_build_object(
      'ok', true,
      'student', json_build_object('id', s.id, 'name', s.name, 'org', s.join_code, 'org_label', _group_label(s.join_code)),
      'progress', coalesce((
        select json_object_agg(problem_id, json_build_object('attempts', attempts, 'solved', solved, 'solved_at', solved_at))
        from (
          select problem_id, count(*) as attempts, bool_or(passed) as solved,
                 min(created_at) filter (where passed) as solved_at
          from submissions where student_id = v_sid group by problem_id
        ) x
      ), '{}'::json),
      'lessons', coalesce((
        select json_object_agg(lesson_id, json_build_object('status', status, 'quiz_score', quiz_score, 'updated_at', updated_at, 'passed_at', passed_at))
        from lesson_progress where student_id = v_sid
      ), '{}'::json),
      'activity', coalesce((
        select json_object_agg(d, n) from (
          select (t at time zone 'Asia/Seoul')::date::text as d, count(*) as n
          from (
            select created_at as t from submissions where student_id = v_sid and created_at > now() - interval '200 days'
            union all
            select updated_at from lesson_progress where student_id = v_sid and updated_at > now() - interval '200 days'
            union all
            select passed_at from lesson_progress where student_id = v_sid and passed_at > now() - interval '200 days'
          ) e
          group by 1
        ) a
      ), '{}'::json)
    )
    from students s where s.id = v_sid
  );
end;
$$;

-- ── DAY 만족도 조사 (2026-11-07) ─────────────────────────

-- DAY(코스)마다 수강생 한 줄. 다시 평가하면 덮어쓴다.
create table if not exists public.day_feedback (
  student_id uuid not null references public.students(id) on delete cascade,
  course_id text not null,
  score int not null check (score between 1 and 5),
  reasons text[] not null default '{}',
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, course_id)
);
alter table public.day_feedback enable row level security;
revoke all on public.day_feedback from anon, authenticated;

-- 수강생: 만족도 저장 (1~5점, 1~2점이면 불만 선택지 · 자유 입력)
create or replace function public.day_feedback_set(p_token uuid, p_course_id text, p_score int, p_reasons text[], p_comment text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  if p_course_id !~ '^[a-z0-9-]{1,40}$' or p_score is null or p_score not between 1 and 5 then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  insert into day_feedback (student_id, course_id, score, reasons, comment)
  values (
    v_sid, p_course_id, p_score,
    coalesce((select array_agg(left(r, 40)) from unnest(p_reasons[1:10]) r where r <> ''), '{}'),
    nullif(left(trim(coalesce(p_comment, '')), 1000), '')
  )
  on conflict (student_id, course_id) do update set
    score = excluded.score, reasons = excluded.reasons, comment = excluded.comment, updated_at = now();
  return json_build_object('ok', true);
end;
$$;

-- 어드민: 전체 응답 (그룹 필터 · DAY별 집계는 화면에서)
create or replace function public.admin_day_feedback(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'rows', coalesce((
    select json_agg(json_build_object(
      'student_id', f.student_id, 'course_id', f.course_id, 'score', f.score,
      'reasons', f.reasons, 'comment', f.comment, 'updated_at', f.updated_at
    ) order by f.updated_at desc)
    from day_feedback f
  ), '[]'::json));
end;
$$;

revoke execute on function public.day_feedback_set(uuid, text, int, text[], text) from public;
revoke execute on function public.admin_day_feedback(uuid) from public;
grant execute on function
  public.day_feedback_set(uuid, text, int, text[], text),
  public.admin_day_feedback(uuid)
to anon;

-- ── 업적 · 메달 (2026-11-07) ──
-- 메달 조건은 화면이 진도 기록으로 계산하고, 받은 메달과 획득 시각만 여기에 저장한다.
-- 한 번 받은 메달은 지워지지 않는다 (같은 메달을 다시 보내도 처음 시각이 유지됨).

create table if not exists public.student_medals (
  student_id uuid not null references public.students(id) on delete cascade,
  medal_id text not null,
  earned_at timestamptz not null default now(),
  primary key (student_id, medal_id)
);
alter table public.student_medals enable row level security;
revoke all on public.student_medals from anon, authenticated;

-- 내 메달 목록: {"medals": {"first-lesson": "2026-11-07T…", …}}
create or replace function public.student_medals_get(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'medals', coalesce((
    select json_object_agg(medal_id, earned_at) from student_medals where student_id = v_sid
  ), '{}'::json));
end;
$$;

-- 메달 받기: 새로 받은 것만 저장하고 전체 목록을 돌려준다
create or replace function public.student_medals_award(p_token uuid, p_ids text[])
returns json language plpgsql security definer set search_path = public as $$
declare
  v_sid uuid := _student_of(p_token);
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  insert into student_medals (student_id, medal_id)
  select v_sid, m from unnest(p_ids[1:60]) m where m ~ '^[a-z0-9-]{1,40}$'
  on conflict (student_id, medal_id) do nothing;
  return student_medals_get(p_token);
end;
$$;

-- 어드민: 수강생별 메달 (명단 · 통계에서 쓸 수 있게)
create or replace function public.admin_medals(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'rows', coalesce((
    select json_agg(json_build_object('student_id', student_id, 'medal_id', medal_id, 'earned_at', earned_at))
    from student_medals
  ), '[]'::json));
end;
$$;

revoke execute on function public.student_medals_get(uuid) from public;
revoke execute on function public.student_medals_award(uuid, text[]) from public;
revoke execute on function public.admin_medals(uuid) from public;
grant execute on function
  public.student_medals_get(uuid),
  public.student_medals_award(uuid, text[]),
  public.admin_medals(uuid)
to anon;

-- 마지막: 어드민 비밀번호 (꼭 바꾸세요)
select public.set_admin_password('여기에-어드민-비밀번호');
