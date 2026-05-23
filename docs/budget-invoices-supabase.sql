-- Budget invoice PDF uploads only.
-- Run this once in Supabase SQL Editor after the existing admin setup.
-- Requires public.is_admin() from docs/supabase-setup.md.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-invoices',
  'admin-invoices',
  false,
  15728640,
  array['application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read admin invoice files" on storage.objects;
drop policy if exists "Admins can upload admin invoice files" on storage.objects;
drop policy if exists "Admins can update admin invoice files" on storage.objects;
drop policy if exists "Admins can delete admin invoice files" on storage.objects;

create policy "Admins can read admin invoice files"
on storage.objects
for select
to authenticated
using (bucket_id = 'admin-invoices' and public.is_admin());

create policy "Admins can upload admin invoice files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'admin-invoices' and public.is_admin());

create policy "Admins can update admin invoice files"
on storage.objects
for update
to authenticated
using (bucket_id = 'admin-invoices' and public.is_admin())
with check (bucket_id = 'admin-invoices' and public.is_admin());

create policy "Admins can delete admin invoice files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'admin-invoices' and public.is_admin());

-- Optional verification:
-- select id, public, file_size_limit, allowed_mime_types
-- from storage.buckets
-- where id = 'admin-invoices';
