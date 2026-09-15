-- Results feedback: optional, anonymous, insert-only.
-- Run once in Supabase → SQL Editor (project hrqjxfebvocezcfrhexm).
--
-- Access model
--   * anon + authenticated: INSERT only, one row per quiz attempt.
--   * nobody can SELECT/UPDATE/DELETE through the client API — RLS has no such
--     policies, so the anon key can never read other people's feedback. Owners
--     read it in the Supabase dashboard / SQL editor (service role).
--   * Free text is capped at 500 chars and is the ONLY free field; everything
--     else is an enum or a short category key, validated by CHECK constraints.

create table if not exists public.results_feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  attempt_id  text not null,
  user_id     uuid references auth.users (id) on delete set null,
  helped      text not null check (helped in ('yes', 'somewhat', 'no')),
  wants       text[] not null default '{}'
              check (
                cardinality(wants) <= 7
                and wants <@ array[
                  'choosing_between_majors', 'universities', 'costs_scholarships',
                  'applications', 'career_outlook', 'talking_to_family', 'other'
                ]::text[]
              ),
  note        text check (note is null or char_length(note) <= 500),
  lang        text not null check (lang in ('en', 'tr', 'de')),
  quiz_mode   text check (quiz_mode is null or quiz_mode in ('quick', 'detailed')),
  top_major   text check (top_major is null or char_length(top_major) <= 80),
  constraint results_feedback_attempt_len check (char_length(attempt_id) between 8 and 64)
);

-- One submission per quiz attempt: blocks accidental double-submits and replay.
create unique index if not exists results_feedback_attempt_uidx
  on public.results_feedback (attempt_id);

create index if not exists results_feedback_created_idx
  on public.results_feedback (created_at desc);

alter table public.results_feedback enable row level security;

revoke all on public.results_feedback from anon, authenticated;
grant insert on public.results_feedback to anon, authenticated;

drop policy if exists results_feedback_insert on public.results_feedback;
create policy results_feedback_insert
  on public.results_feedback
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Convenience view for reading in the dashboard: "what do students want help with?"
create or replace view public.results_feedback_summary as
  select
    date_trunc('week', created_at)::date as week,
    helped,
    unnest(wants)                        as wants,
    quiz_mode,
    lang,
    count(*)                             as n
  from public.results_feedback
  group by 1, 2, 3, 4, 5
  order by 1 desc, 6 desc;

revoke all on public.results_feedback_summary from anon, authenticated;
