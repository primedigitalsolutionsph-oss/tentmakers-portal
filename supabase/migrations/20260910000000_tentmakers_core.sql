-- Tentmakers core Supabase schema and row-level security.
-- Review and apply through the Supabase migration workflow, preferably in staging first.
-- This migration does not contain credentials and must not be paired with a service-role key in client code.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'member' check (role in ('member', 'operator', 'partner')),
  requested_role text check (requested_role in ('member', 'operator', 'partner')),
  training_tier text not null default 'basic' check (training_tier in ('basic', 'intermediate', 'advanced')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ventures (
  slug text primary key,
  name text not null,
  stage text not null check (stage in ('Active', 'Scaling', 'Early')),
  gap text not null,
  offering text not null,
  description text not null,
  market_signals text[] not null default '{}',
  full_description text[] not null default '{}',
  metric text not null,
  metric_label text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.ventures enable row level security;

revoke all on public.profiles from anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
revoke all on public.ventures from anon, authenticated;
grant select on public.ventures to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check (
    auth.uid() = id
    and role = 'member'
    and training_tier = 'basic'
  );

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = 'member'
    and training_tier in ('basic', 'intermediate', 'advanced')
  );

drop policy if exists ventures_select_authenticated on public.ventures;
create policy ventures_select_authenticated
  on public.ventures
  for select
  to authenticated
  using (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_ventures_updated_at on public.ventures;
create trigger set_ventures_updated_at
  before update on public.ventures
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role_value text := nullif(new.raw_user_meta_data ->> 'requested_role', '');
begin
  if requested_role_value not in ('member', 'operator', 'partner') then
    requested_role_value := 'member';
  end if;

  insert into public.profiles (id, full_name, phone, role, requested_role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    'member',
    case when requested_role_value = 'member' then null else requested_role_value end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone,
    requested_role = excluded.requested_role,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for accounts created before this trigger existed.
-- New accounts always receive the least-privileged member role.
insert into public.profiles (id, full_name, phone, role, requested_role)
select
  users.id,
  nullif(users.raw_user_meta_data ->> 'full_name', ''),
  nullif(users.raw_user_meta_data ->> 'phone', ''),
  'member',
  case
    when users.raw_user_meta_data ->> 'requested_role' in ('operator', 'partner')
      then users.raw_user_meta_data ->> 'requested_role'
    else null
  end
from auth.users as users
on conflict (id) do nothing;

insert into public.ventures (
  slug,
  name,
  stage,
  gap,
  offering,
  description,
  market_signals,
  full_description,
  metric,
  metric_label
)
values
  (
    'prime-digital-solutions',
    'Prime Digital Solutions',
    'Active',
    'The Storefront Gap',
    'Digital storefronts for MSMEs — affordable, branded online presence that turns foot traffic into digital traffic.',
    'Most MSMEs on Panay Island still rely on word-of-mouth and physical foot traffic. Prime Digital Solutions gives them a professional digital storefront — affordably.',
    array[
      '57.4% of retail transactions are digital',
      '57,469 MSME establishments on Panay Island',
      'Under 15% of MSMEs have a meaningful online presence'
    ],
    array[
      'Panay Island has over 57,000 MSMEs, yet fewer than 15% have a meaningful online presence. Prime Digital Solutions provides affordable, mobile-first storefronts integrated with the channels MSMEs already use.'
    ],
    '57,469',
    'MSME establishments'
  ),
  (
    'thrifty-tribe',
    'Thrifty Tribe',
    'Scaling',
    'The Discount Gap',
    'A member subscription that unlocks everyday discounts at partner merchants across Panay Island.',
    'Thrifty Tribe members pay one subscription and save every day — exclusive member-only discounts at partner stores, services, and eateries across Panay Island.',
    array[
      'Rising everyday prices squeeze household budgets',
      'MSMEs want loyal, repeat customers',
      'Members save from day one'
    ],
    array[
      'Thrifty Tribe is a discount subscription platform: one membership unlocks exclusive prices at partner merchants, saving members money on everyday purchases while driving loyal customers to local businesses.'
    ],
    'Members-only',
    'discounts at partner merchants'
  ),
  (
    'icky',
    'ICKY',
    'Scaling',
    'The Protection Gap',
    'Driver protection and micro-insurance designed for the people who keep Panay Island moving.',
    'With under 2% insurance penetration and over 31,000 road accidents in 2024, Panay Island''s drivers are dangerously unprotected. ICKY changes that.',
    array[
      'Under 2% insurance penetration',
      '31,000+ road accidents in 2024',
      'Growing ride-hailing and delivery sector'
    ],
    array[
      'ICKY provides affordable, micro-insurance products for gig workers, tricycle drivers, and delivery riders, distributed through trusted Tentmakers network relationships.'
    ],
    '<2%',
    'insurance penetration'
  ),
  (
    'prime-axis',
    'Prime Axis',
    'Active',
    'The Staffing Gap',
    'A staffing pipeline that connects growing SMEs with vetted, trained talent — fast.',
    'Growing SMEs need talent but lack the hiring infrastructure of large corporations. Prime Axis provides a vetted, trained staffing pipeline built for speed.',
    array[
      '41% of SMEs increased headcount in 2024',
      'High youth unemployment in Western Visayas',
      'Limited structured hiring platforms for SMEs'
    ],
    array[
      'Prime Axis maintains a pipeline of vetted, trained candidates matched to SME needs, reducing time-to-hire from weeks to days while creating employment pathways for trained members.'
    ],
    '41%',
    'of SMEs increased headcount in 2024'
  ),
  (
    'tentmakers-network',
    'Tentmakers Network',
    'Active',
    'The Trust Gap',
    'The connective tissue — a training hub that turns members into operators and ventures into an ecosystem.',
    'Tentmakers Network is the operating system — the training hub that turns individual members into operators and individual ventures into a connected ecosystem.',
    array[
      '3-tier training progression',
      'Members get value from day one',
      'Franchise pipeline for top performers'
    ],
    array[
      'The Basic, Intermediate, and Advanced progression gives members increasing access to tools, training, and opportunities across all five ventures.'
    ],
    '3',
    'tier training progression'
  )
on conflict (slug) do nothing;
