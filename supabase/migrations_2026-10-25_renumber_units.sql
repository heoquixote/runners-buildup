-- 2026-10-25 유닛 번호 변경: 1회차 교안 유닛 1~6을 새로 넣고, 기존 유닛 1~5는 7~11로 옮겼다.
-- 기존 제출 기록과 오늘의 과제를 새 번호로 바꾼다. 한 번만 적용되도록 표시를 남긴다 (두 번 실행해도 안전).
-- 처음 설치(schema.sql만 실행)한 DB에는 필요 없습니다. 기존 DB에 한 번만 실행하세요.
do $$
begin
  if exists (select 1 from app_settings where key = 'migration:renumber_units_v2') then
    raise notice '이미 적용됨';
    return;
  end if;

  update submissions
     set problem_id = (split_part(problem_id, '-', 1)::int + 6)::text || '-' || split_part(problem_id, '-', 2)
   where problem_id ~ '^[1-5]-';

  update app_settings s
     set value = coalesce((
       select json_agg(case when x ~ '^[1-5]-'
                            then (split_part(x, '-', 1)::int + 6)::text || '-' || split_part(x, '-', 2)
                            else x end)
         from json_array_elements_text(s.value::json) as x
     ), '[]'::json)::text
   where key like 'today_problems:%';

  insert into app_settings (key, value) values ('migration:renumber_units_v2', now()::text);
end;
$$;
