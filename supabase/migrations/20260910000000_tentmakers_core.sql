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
    'Website and app development plus business automation — affordable, branded online presence that turns foot traffic into digital traffic.',
    'An established web and app development business — the technology backbone of the ecosystem, building and hosting the Tentmakers platform with discounted dev services for member founders.',
    array[
      '99.5% of Philippine businesses are MSMEs; they generate 63% of employment',
      '90.8% own computers and 81% have internet, yet real digital-tool adoption lags far behind',
      'National e-commerce market of roughly $20–24 billion and growing fast'
    ],
    array[
      'MSMEs make up 99.5% of all Philippine businesses. With basic connectivity widespread but real digital-tool adoption lagging, Prime Digital Solutions sells the websites, apps, and automation that close the gap.'
    ],
    '57,469',
    'MSMEs in Western Visayas (DTI)'
  ),
  (
    'thrifty-tribe',
    'Thrifty Tribe',
    'Early',
    'The Savings Gap',
    'A smart savings membership — structured savings, QR-code deals, and cashback at partner merchants, built into Tentmakers membership from day one.',
    'Thrifty Tribe is a smart savings membership: members save on everyday spending while member businesses become partner-merchants.',
    array[
      'Digital payments reached 57.4% of retail volume in 2024 — QR spending is the norm',
      '43% of adults hold e-money accounts; 58% have a formal financial account',
      'Member businesses become partner-merchants, compounding the network'
    ],
    array[
      'Thrifty Tribe rides the QR-payments wave with member deals and cashback, turning member businesses into partner-merchants.'
    ],
    'Members-only',
    'QR deals & cashback at partner merchants'
  ),
  (
    'icky',
    'ICKY',
    'Early',
    'The Staffing Gap',
    'A general and specialized labor marketplace — staffing for Tentmakers events today, and a hiring resource for members’ growing businesses.',
    'ICKY is a labor marketplace for skilled and general talent — staffing network events now, and growing into the hiring resource for members’ businesses.',
    array[
      '41% of SMEs increased headcount in 2024; 57% planned further hiring in 2025',
      'MSMEs generate ~63% of national employment and keep formalizing',
      'No Panay-specific labor-market sizing exists — demand is validated via SME hiring data'
    ],
    array[
      'ICKY supplies flexible skilled and general labor against proven SME hiring demand, earning placement margin including network event staffing.'
    ],
    '41%',
    'of SMEs increased headcount in 2024'
  ),
  (
    'prime-axis',
    'Prime Axis',
    'Early',
    'The Protection Gap',
    'Driver protection and road-safety education — insurance literacy, 3D driving simulation, and 24/7 SOS for the people who keep Panay Island moving.',
    'Prime Axis combines insurance literacy, road-safety education, 3D driving simulation, and 24/7 SOS — with discounted plans for members and their riders.',
    array[
      'Insurance penetration only ~1.79% in 2025, below the 2% national target',
      '31,000+ road accidents in 2024, 2,747 deaths — 87% from reckless driving',
      'Masa and Iskolar plans plus discounted cover for members and their riders'
    ],
    array[
      'Prime Axis targets the exact risk behind 31,000+ annual accidents with literacy, simulation training, SOS response, and the Masa and Iskolar plans.'
    ],
    '~1.79%',
    'insurance penetration (2025)'
  ),
  (
    'tentmakers-network',
    'Tentmakers Network',
    'Early',
    'The Trust Gap',
    'A member network with a Readiness Score gating three readiness tiers — Foundation, Building, Established — plus an Anchor band for mentor-track candidates.',
    'Tentmakers Network is a member network with a Readiness Score, three training tiers, and real venture access — the connective tissue across all ventures.',
    array[
      '300-member target: Iloilo HQ 150, Capiz 60, Aklan 50, Antique 40',
      'Three readiness tiers: Foundation, Building, Established — plus Anchor band for mentor-track candidates',
      'Readiness Score blends training, savings, site engagement, protection, and mentorship'
    ],
    array[
      'Tentmakers Network is launching across Panay Island with a Readiness Score that blends training completion, savings consistency, site engagement, protection enrollment, and mentorship participation.'
    ],
    '300',
    'member target by Q4 2026'
  )
on conflict (slug) do nothing;
