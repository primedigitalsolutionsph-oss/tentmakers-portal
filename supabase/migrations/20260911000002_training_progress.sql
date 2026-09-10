-- Tentmakers Network: training activity progress
-- Self-serve tier progression: members mark unlocked activities complete;
-- the app promotes training_tier when a tier's activities are all done.
-- Run in Supabase Dashboard → SQL Editor.

alter table public.profiles
  add column if not exists completed_activities text[] not null default '{}';

-- Existing profiles_update_own policy already covers the new column
-- (row-owner updates); no policy change required.
