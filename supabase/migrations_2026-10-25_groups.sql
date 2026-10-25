-- 러너즈빌드업 업데이트: 가입 코드별 그룹
-- SQL Editor 에 이 파일 전체를 붙여넣고 Run 하세요. 앞의 업데이트를 실행하지 않았어도 됩니다.
-- (어드민 비밀번호는 바뀌지 않습니다)

alter table public.students add column if not exists join_code text;

drop function if exists public.get_today();
drop function if exists public.admin_set_today(uuid, text[]);
drop function if exists public.admin_add_students(uuid, text[]);
drop function if exists public.admin_get_join_code(uuid);
drop function if exists public.admin_set_join_code(uuid, text);

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

-- 기존 데이터 옮기기: 지금까지 가입한 계정은 QAQC8 그룹
insert into groups (code, label) values ('QAQC8', 'Team Sparta · QAQC 8기')
on conflict (code) do nothing;
update students set join_code = 'QAQC8' where join_code is null;
insert into app_settings (key, value)
  select 'today_problems:QAQC8', value from app_settings where key = 'today_problems'
on conflict (key) do nothing;
delete from app_settings where key in ('today_problems', 'join_code');

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
