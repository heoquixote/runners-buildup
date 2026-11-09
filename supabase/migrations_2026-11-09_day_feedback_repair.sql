-- 러너즈빌드업 복구 (2026-11-09): 어드민 > 만족도 탭 '서버 오류'
-- 2026-11-07 만족도 마이그레이션을 다시 실행해도 안전하게(있으면 건너뛰고 함수는 덮어씀) 묶고,
-- 마지막에 PostgREST 함수 목록 캐시를 새로 읽게 한다. SQL Editor 에 붙여넣고 Run 하세요.
-- (기존 수강생 · 제출 · 만족도 응답은 바뀌지 않습니다)

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

-- PostgREST 가 새 함수를 바로 보도록 스키마 캐시 새로고침
notify pgrst, 'reload schema';

-- 확인: 아래 결과가 day_feedback 테이블 1개 + 함수 2개면 정상
select 'table' as kind, to_regclass('public.day_feedback')::text as name, null as args
union all
select 'function', p.proname, pg_get_function_identity_arguments(p.oid)
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('day_feedback_set', 'admin_day_feedback');
