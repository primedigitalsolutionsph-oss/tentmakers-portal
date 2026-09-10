-- Tentmakers Network: newsletter subscriptions
-- Run in Supabase Dashboard → SQL Editor, after 0001_profiles.sql.

create extension if not exists citext;

create table if not exists public.newsletter_subscriptions (
  id bigint generated always as identity primary key,
  email citext not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscriptions enable row level security;

-- Public signup: anyone may insert their own email. No select/update/delete
-- for anon; manage subscribers from the Supabase dashboard (service role).
drop policy if exists "newsletter_insert_public" on public.newsletter_subscriptions;
create policy "newsletter_insert_public" on public.newsletter_subscriptions
  for insert to anon, authenticated with check (true);
