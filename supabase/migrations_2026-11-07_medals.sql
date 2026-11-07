-- 러너즈빌드업 업데이트 (2026-11-07 #2): 업적 · 메달
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 SQL Editor 에 붙여넣고 Run 하세요.
-- (기존 수강생 · 제출 · 레슨 기록은 바뀌지 않습니다)
--
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
