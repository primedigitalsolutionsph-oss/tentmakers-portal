-- Tentmakers contact inquiries (public insert, no PII exposure).
-- Apply via Supabase SQL Editor / migration workflow.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 255),
  inquiry_type text not null check (inquiry_type in ('member', 'partner', 'general')),
  message text not null check (char_length(message) between 10 and 5000),
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

revoke all on public.inquiries from anon, authenticated;
grant insert on public.inquiries to anon, authenticated;

drop policy if exists inquiries_insert_public on public.inquiries;
create policy inquiries_insert_public
  on public.inquiries
  for insert
  to anon, authenticated
  with check (
    char_length(name) between 2 and 100
    and char_length(email) between 5 and 255
    and inquiry_type in ('member', 'partner', 'general')
    and char_length(message) between 10 and 5000
  );
