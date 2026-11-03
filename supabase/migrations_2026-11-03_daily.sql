-- 러너즈빌드업 업데이트 (2026-11-03 #2): 일일 학습 (오늘의 학습 · 연속 학습일 · 학습 잔디)
-- migrations_2026-11-03_lessons.sql 을 실행한 뒤, 이 파일을 SQL Editor 에 붙여넣고 Run 하세요.
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
