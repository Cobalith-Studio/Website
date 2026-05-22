-- Cloud admin setup for Assets, Notes, Kanban, Budget and shared admin settings.
-- Run this in Supabase SQL Editor after the profiles/is_admin setup from docs/supabase-setup.md.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_records (
  collection text not null,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

drop trigger if exists admin_records_set_updated_at on public.admin_records;

create trigger admin_records_set_updated_at
before update on public.admin_records
for each row
execute function public.set_updated_at();

alter table public.admin_records enable row level security;

drop policy if exists "Admins can read admin records" on public.admin_records;
drop policy if exists "Admins can insert admin records" on public.admin_records;
drop policy if exists "Admins can update admin records" on public.admin_records;
drop policy if exists "Admins can delete admin records" on public.admin_records;

create policy "Admins can read admin records"
on public.admin_records
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert admin records"
on public.admin_records
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update admin records"
on public.admin_records
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete admin records"
on public.admin_records
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-assets',
  'admin-assets',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin asset files are publicly readable" on storage.objects;
drop policy if exists "Admins can upload admin asset files" on storage.objects;
drop policy if exists "Admins can update admin asset files" on storage.objects;
drop policy if exists "Admins can delete admin asset files" on storage.objects;

create policy "Admin asset files are publicly readable"
on storage.objects
for select
to public
using (bucket_id = 'admin-assets');

create policy "Admins can upload admin asset files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'admin-assets' and public.is_admin());

create policy "Admins can update admin asset files"
on storage.objects
for update
to authenticated
using (bucket_id = 'admin-assets' and public.is_admin())
with check (bucket_id = 'admin-assets' and public.is_admin());

create policy "Admins can delete admin asset files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'admin-assets' and public.is_admin());

insert into public.admin_records (collection, id, payload)
values
  (
    'admin_preferences',
    'default',
    '{"targetPhase":"vertical_slice"}'::jsonb
  ),
  (
    'kanban_settings',
    'default',
    '{
      "priorities": [
        { "id": "urgent", "label": "Urgent", "color": "#ef4444" },
        { "id": "important", "label": "Important", "color": "#f97316" },
        { "id": "normal", "label": "Normal", "color": "#3b82f6" },
        { "id": "low", "label": "Basse", "color": "#64748b" },
        { "id": "watch", "label": "À suivre", "color": "#8b5cf6" },
        { "id": "optional", "label": "Optionnel", "color": "#10b981" }
      ],
      "tags": [
        { "id": "system", "label": "Système", "color": "#9b6a3d" },
        { "id": "environment", "label": "Environnement", "color": "#6f716b" },
        { "id": "shop", "label": "Shop", "color": "#8b5bb0" },
        { "id": "progression", "label": "Progression", "color": "#b56799" },
        { "id": "ui", "label": "UI", "color": "#a18443" },
        { "id": "simulation", "label": "Simulation", "color": "#b66a34" },
        { "id": "assets", "label": "Assets", "color": "#4a9a72" },
        { "id": "items", "label": "Items", "color": "#477da5" },
        { "id": "models_sprites", "label": "Modèles & Sprites", "color": "#c26464" },
        { "id": "player", "label": "Player", "color": "#8d735c" }
      ]
    }'::jsonb
  )
on conflict (collection, id) do nothing;

-- Optional verification:
-- select collection, id, updated_at from public.admin_records order by collection, id;
-- select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'admin-assets';
