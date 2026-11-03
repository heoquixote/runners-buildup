-- 러너즈빌드업 업데이트 (2026-11-03): 레슨 진도 저장
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (어드민 비밀번호, 가입 코드, 제출 기록은 바뀌지 않습니다)

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

-- 레슨 상태 저장. passed 는 viewed 로 되돌리지 않는다.
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

-- student_me 에 lessons 를 추가한다
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

-- 어드민: 레슨별 완료 인원 (그룹 필터는 화면에서)
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
