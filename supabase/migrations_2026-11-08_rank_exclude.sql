-- 러너즈빌드업 업데이트 (2026-11-08): 테스트 계정을 반 순위에서 빼기
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (기존 수강생 · 제출 기록은 바뀌지 않습니다)
--
-- students.exclude_from_rank = true 인 계정은
--   · 다른 수강생의 'N명 중 M번째' 에서 분모(N)와 순위(M) 모두에 세지 않는다.
--   · 본인이 문제를 풀면 '자기가 끼었다면 몇 번째였을지'를 그대로 보여 준다 (화면 테스트용).
-- 어드민 > 명단 에서 '순위 제외' 버튼으로 켜고 끌 수 있다.

alter table public.students add column if not exists exclude_from_rank boolean not null default false;

-- 지금 있는 테스트 계정은 바로 제외
update public.students set exclude_from_rank = true where name = '허진성_테스트';

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
  -- 순위 제외 계정(exclude_from_rank)은 본인 말고는 세지 않는다
  select count(*) into v_rank from (
    select min(sub.created_at) as t
    from submissions sub join students st on st.id = sub.student_id
    where sub.problem_id = p_problem_id and sub.passed and st.join_code is not distinct from v_group
      and (not st.exclude_from_rank or st.id = v_sid)
    group by sub.student_id
  ) f
  where f.t <= (
    select min(created_at) from submissions
    where student_id = v_sid and problem_id = p_problem_id and passed
  );
  select count(*) into v_total from students
  where join_code is not distinct from v_group and (not exclude_from_rank or id = v_sid);

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
      'locked', locked_until is not null and locked_until > now(),
      'exclude_from_rank', exclude_from_rank
    ) order by name, created_at) from students
  ), '[]'::json));
end;
$$;

-- 어드민: 순위 제외 켜기 · 끄기
create or replace function public.admin_set_rank_exclude(p_token uuid, p_student_id uuid, p_exclude boolean)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  update students set exclude_from_rank = coalesce(p_exclude, false) where id = p_student_id;
  if not found then return json_build_object('ok', false, 'error', 'not_found'); end if;
  return json_build_object('ok', true, 'exclude_from_rank', coalesce(p_exclude, false));
end;
$$;

revoke execute on function public.admin_set_rank_exclude(uuid, uuid, boolean) from public;
grant execute on function public.admin_set_rank_exclude(uuid, uuid, boolean) to anon;
