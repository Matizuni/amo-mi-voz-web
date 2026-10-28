-- AMV Vocal Engine: campos persistentes para evaluación integral.
-- Reversible/additive: conserva scores y observations existentes.
alter table public.vocal_teacher_evaluations
  add column if not exists strengths text,
  add column if not exists priorities text,
  add column if not exists exercise_plan text,
  add column if not exists integrated_result jsonb;

comment on column public.vocal_teacher_evaluations.integrated_result is
  'Snapshot trazable de la evaluación integral AMV; no reemplaza las fuentes originales.';
