-- Admin cloud storage for assets, notes and future admin tools.
-- Run this in the Supabase SQL editor for the project.

create table if not exists public.admin_records (
  collection text not null,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

create index if not exists admin_records_collection_updated_at_idx
  on public.admin_records (collection, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_records_set_updated_at on public.admin_records;

create trigger admin_records_set_updated_at
before update on public.admin_records
for each row
execute function public.set_updated_at();

alter table public.admin_records enable row level security;

drop policy if exists "Approved team can read admin records" on public.admin_records;
drop policy if exists "Approved team can write admin records" on public.admin_records;

create policy "Approved team can read admin records"
on public.admin_records
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.status = 'approved'
      and profiles.role in ('team', 'admin')
  )
);

create policy "Approved team can write admin records"
on public.admin_records
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.status = 'approved'
      and profiles.role in ('team', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.status = 'approved'
      and profiles.role in ('team', 'admin')
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-assets',
  'admin-assets',
  true,
  2097152,
  array['image/webp', 'image/png', 'image/jpeg', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Approved team can upload admin assets" on storage.objects;
drop policy if exists "Approved team can update admin assets" on storage.objects;
drop policy if exists "Approved team can delete admin assets" on storage.objects;

create policy "Approved team can upload admin assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'admin-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.status = 'approved'
      and profiles.role in ('team', 'admin')
  )
);

create policy "Approved team can update admin assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'admin-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.status = 'approved'
      and profiles.role in ('team', 'admin')
  )
)
with check (
  bucket_id = 'admin-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.status = 'approved'
      and profiles.role in ('team', 'admin')
  )
);

create policy "Approved team can delete admin assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'admin-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.status = 'approved'
      and profiles.role in ('team', 'admin')
  )
);
