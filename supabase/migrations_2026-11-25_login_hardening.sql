-- 러너즈빌드업 업데이트 (2026-11-25): 로그인 보안 강화
-- password · google_login 마이그레이션 다음에 SQL Editor 에 붙여넣고 Run 하세요. 여러 번 실행해도 안전합니다.
--
-- · 점진적 잠금: 5번 틀릴 때마다 잠금 5분 → 10분 → 20분 → 40분 → 최대 1시간. 로그인에 성공하면 초기화
--   (예전에는 5분 고정이라 4자리 번호는 하루 1,440번 시도로 평균 3.5일이면 맞힐 수 있었다)
-- · 4~5자 비밀번호(예전 4자리 번호)로 로그인하면 must_change = true 를 돌려주고, 앱이 새 비밀번호를 받는다
-- · student_change_password: 로그인한 학생이 현재 비밀번호를 확인한 뒤 6~72자 새 비밀번호로 바꾼다
-- · 어드민이 발급하는 임시 비밀번호: 4자리 숫자 → 영문 소문자·숫자 8자리 (헷갈리는 글자 제외)

alter table public.students add column if not exists lock_strikes int not null default 0;

create or replace function public._new_pin(p_name text)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare
  v_alpha constant text := 'abcdefghjkmnpqrstuvwxyz23456789';
  v_bytes bytea;
  v_pin text;
begin
  -- 같은 이름의 학생과 비밀번호가 겹치지 않게 만든다 (이름 + 비밀번호 조합이 로그인 키)
  loop
    v_bytes := gen_random_bytes(8);
    v_pin := '';
    for i in 0..7 loop
      v_pin := v_pin || substr(v_alpha, (get_byte(v_bytes, i) % length(v_alpha)) + 1, 1);
    end loop;
    exit when not exists (
      select 1 from students where name = p_name and pin_hash = crypt(v_pin, pin_hash)
    );
  end loop;
  return v_pin;
end;
$$;

-- 로그인 실패 기록: 5번째 실패마다 잠금, 잠금 시간은 회차마다 두 배 (최대 1시간)
create or replace function public._login_failed(p_name text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update students
    set failed_count = failed_count + 1,
        lock_strikes = case when failed_count + 1 >= 5 then lock_strikes + 1 else lock_strikes end,
        locked_until = case when failed_count + 1 >= 5
          then now() + least(interval '5 minutes' * power(2, least(lock_strikes, 4))::int, interval '1 hour')
          else locked_until end
    where name = p_name;
  update students set failed_count = 0 where name = p_name and failed_count >= 5;
end;
$$;

create or replace function public.student_login(p_name text, p_pin text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text := trim(p_name);
  v_student students;
  v_locked timestamptz;
  v_token uuid;
begin
  -- 비밀번호 4~72자 (예전 4자리 번호도 로그인은 되지만 바로 바꾸게 한다)
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
    perform _login_failed(v_name);
    return json_build_object('ok', false, 'error', 'invalid');
  end if;

  update students set failed_count = 0, lock_strikes = 0, locked_until = null where name = v_name;
  insert into sessions (student_id) values (v_student.id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'must_change', length(p_pin) < 6, 'student',
    json_build_object('id', v_student.id, 'name', v_student.name,
      'org', v_student.join_code, 'org_label', _group_label(v_student.join_code)));
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
    perform _login_failed(v_name);
    return json_build_object('ok', false, 'error', 'invalid');
  end if;
  if v_student.auth_user_id is not null and v_student.auth_user_id <> v_uid then
    return json_build_object('ok', false, 'error', 'already_linked');
  end if;

  update students set failed_count = 0, lock_strikes = 0, locked_until = null where name = v_name;
  update students set auth_user_id = v_uid, email = auth.jwt() ->> 'email' where id = v_student.id;
  insert into sessions (student_id) values (v_student.id) returning token into v_token;
  return json_build_object('ok', true, 'token', v_token, 'student',
    json_build_object('id', v_student.id, 'name', v_student.name,
      'org', v_student.join_code, 'org_label', _group_label(v_student.join_code)));
end;
$$;

create or replace function public.student_change_password(p_token uuid, p_old text, p_new text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_sid uuid := _student_of(p_token);
  v_student students;
begin
  if v_sid is null then return json_build_object('ok', false, 'error', 'session'); end if;
  if length(coalesce(p_new, '')) not between 6 and 72 then
    return json_build_object('ok', false, 'error', 'password_format');
  end if;
  if p_new = p_old then
    return json_build_object('ok', false, 'error', 'same_password');
  end if;
  select * into v_student from students where id = v_sid;
  if v_student.pin_hash is null or v_student.pin_hash <> crypt(coalesce(p_old, ''), v_student.pin_hash) then
    perform pg_sleep(1);
    return json_build_object('ok', false, 'error', 'invalid');
  end if;
  -- 동명이인과 같은 비밀번호면 로그인 대상이 섞이므로 막는다
  if exists (select 1 from students where name = v_student.name and id <> v_sid and pin_hash = crypt(p_new, pin_hash)) then
    return json_build_object('ok', false, 'error', 'same_password');
  end if;
  update students set pin_hash = crypt(p_new, gen_salt('bf', 8)) where id = v_sid;
  return json_build_object('ok', true);
end;
$$;

revoke execute on function public._new_pin(text), public._login_failed(text) from public, anon, authenticated;
revoke execute on function public.student_change_password(uuid, text, text) from public;
grant execute on function public.student_change_password(uuid, text, text) to anon;
