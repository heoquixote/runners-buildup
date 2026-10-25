-- 러너즈빌드업 업데이트 (2026-10-25): 가입 코드별 로고 표시 + 오늘의 과제
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (어드민 비밀번호와 가입 코드는 바뀌지 않습니다)

alter table public.students add column if not exists join_code text;
-- 지금까지 가입한 계정은 모두 QAQC8 코드로 가입했으므로 표시해 둔다
update public.students set join_code = 'QAQC8' where join_code is null;

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
    json_build_object('id', v_student.id, 'name', v_student.name, 'org', v_student.join_code));
end;
$$;

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
  insert into students (name, pin_hash, join_code)
    values (v_name, crypt(p_pin, gen_salt('bf', 8)), nullif(upper(trim(coalesce(p_join_code, ''))), ''))
    returning id into v_id;
  insert into sessions (student_id) values (v_id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_id, 'name', v_name, 'org', nullif(upper(trim(coalesce(p_join_code, ''))), '')));
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
      'student', json_build_object('id', s.id, 'name', s.name, 'org', s.join_code),
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

create or replace function public.get_today()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object('ok', true, 'ids',
    coalesce((select value::json from app_settings where key = 'today_problems'), '[]'::json));
$$;

create or replace function public.admin_set_today(p_token uuid, p_ids text[])
returns json language plpgsql security definer set search_path = public as $$
declare
  v_ids json := to_json(coalesce(p_ids, '{}')::text[]);
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  if coalesce(array_length(p_ids, 1), 0) > 20 then return json_build_object('ok', false, 'error', 'too_many'); end if;
  insert into app_settings (key, value) values ('today_problems', v_ids::text)
  on conflict (key) do update set value = excluded.value;
  return json_build_object('ok', true, 'ids', v_ids);
end;
$$;

revoke execute on function public.get_today(), public.admin_set_today(uuid, text[]) from public;
grant execute on function public.get_today(), public.admin_set_today(uuid, text[]) to anon;
