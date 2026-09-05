-- Brahmi AI — Supabase schema
-- Run this in Supabase → SQL Editor once to enable cloud mode.
-- Tables are auto-created for you; this just defines structure & policies.

-- 1. Patient profiles (one row per saved patient setup)
create table if not exists public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patient_profiles_owner_idx on public.patient_profiles (owner_id);

-- 2. Storage bucket for memory photos
insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', true)
on conflict (id) do nothing;

-- RLS: authenticated users manage their own rows
alter table public.patient_profiles enable row level security;

drop policy if exists "owners read own profiles" on public.patient_profiles;
create policy "owners read own profiles"
  on public.patient_profiles for select
  using (auth.uid()::text = owner_id);

drop policy if exists "owners insert own profiles" on public.patient_profiles;
create policy "owners insert own profiles"
  on public.patient_profiles for insert
  with check (auth.uid()::text = owner_id);

drop policy if exists "owners update own profiles" on public.patient_profiles;
create policy "owners update own profiles"
  on public.patient_profiles for update
  using (auth.uid()::text = owner_id);

-- Storage policies for the photos bucket
drop policy if exists "public read memory photos" on storage.objects;
create policy "public read memory photos"
  on storage.objects for select
  using (bucket_id = 'memory-photos');

drop policy if exists "authenticated upload memory photos" on storage.objects;
create policy "authenticated upload memory photos"
  on storage.objects for insert
  with check (bucket_id = 'memory-photos' and auth.role() = 'authenticated');
