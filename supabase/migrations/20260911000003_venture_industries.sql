-- Tentmakers Network: venture industry coverage
-- Adds the per-venture industry list shown as icon chips on venture detail
-- pages (see Venture.industries in lib/ventures-data.ts, which is canonical).
-- Safe to re-run: additive column, keyed updates.
-- Run in Supabase Dashboard → SQL Editor.

alter table public.ventures
  add column if not exists industries text[] not null default '{}';

update public.ventures set
  industries = array['Web', 'App', 'Automation', 'E-commerce'],
  updated_at = now()
where slug = 'prime-digital-solutions';

update public.ventures set
  industries = array['Payments', 'Savings', 'Cashback'],
  updated_at = now()
where slug = 'thrifty-tribe';

update public.ventures set
  industries = array['Staffing', 'Labor'],
  updated_at = now()
where slug = 'icky';

update public.ventures set
  industries = array['Insurance', 'Road Safety', 'Education', '24/7 SOS'],
  updated_at = now()
where slug = 'prime-axis';

update public.ventures set
  industries = array['Community', 'Training', 'Mentorship'],
  updated_at = now()
where slug = 'tentmakers-network';
