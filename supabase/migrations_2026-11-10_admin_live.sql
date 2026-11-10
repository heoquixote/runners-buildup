-- 러너즈빌드업 업데이트 (2026-11-10): 어드민 '실시간' 탭용 활동 기록
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (테이블 · 기존 기록은 바뀌지 않고, 읽기 함수만 추가 · 교체합니다)
--
-- admin_activity(p_token, p_since)
--   p_since 이후의 제출을 한 건씩 돌려준다 (코드 본문은 빼고, 실패한 첫 케이스의 오류 한 줄만).
--   admin_matrix 는 학생 × 문제로 묶은 값이라 '오늘 몇 번 제출했는지', '연속으로 몇 번 틀렸는지',
--   '방금 무엇을 했는지' 를 알 수 없어서 따로 둔다.
-- admin_lessons
--   레슨 통과 시각(passed_at) · 퀴즈 점수를 함께 돌려준다. updated_at 은 레슨을 다시 열 때마다 바뀌어서
--   '오늘 끝낸 레슨' 을 셀 때는 passed_at 을 써야 한다.

create or replace function public.admin_activity(p_token uuid, p_since timestamptz)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'items', coalesce((
    select json_agg(row_to_json(x) order by x.created_at) from (
      select s.student_id, s.problem_id, s.passed, s.passed_count, s.total_count, s.created_at,
             case when not s.passed and jsonb_typeof(s.case_results) = 'array' then (
               select left(coalesce(nullif(e->>'error', ''), nullif(e->>'note', ''), ''), 160)
               from jsonb_array_elements(s.case_results) e
               where coalesce((e->>'passed')::boolean, false) = false
               limit 1
             ) end as error
      from submissions s
      where s.created_at >= coalesce(p_since, now() - interval '1 day')
      order by s.created_at desc
      limit 5000
    ) x
  ), '[]'::json));
end;
$$;

create or replace function public.admin_lessons(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not _is_admin(p_token) then return json_build_object('ok', false, 'error', 'session'); end if;
  return json_build_object('ok', true, 'rows', coalesce((
    select json_agg(json_build_object('student_id', student_id, 'lesson_id', lesson_id, 'status', status,
                                      'quiz_score', quiz_score, 'passed_at', passed_at, 'updated_at', updated_at))
    from lesson_progress
  ), '[]'::json));
end;
$$;

revoke execute on function public.admin_activity(uuid, timestamptz) from public;
grant execute on function public.admin_activity(uuid, timestamptz) to anon;
grant execute on function public.admin_lessons(uuid) to anon;
