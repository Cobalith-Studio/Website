# Configuration Supabase pour l'espace équipe

## 1. Variables côté Vite

Créer un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://TON_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=TON_ANON_KEY
```

Ne jamais mettre de mot de passe, service role key ou secret dans ce fichier.

## 2. SQL à exécuter dans Supabase

Dans Supabase, ouvrir `SQL Editor`, créer une nouvelle query, puis exécuter :

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'team' check (role in ('admin', 'team')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, status)
  values (new.id, coalesce(new.email, ''), 'team', 'pending')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'approved'
  );
$$;

drop policy if exists "Profiles are viewable by owner or admins" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

create policy "Profiles are viewable by owner or admins"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin());

create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

## 3. Valider ton premier compte admin

Après avoir créé ton compte depuis `/inscription`, exécuter dans Supabase SQL Editor :

```sql
update public.profiles
set role = 'admin',
    status = 'approved'
where email = 'TON_EMAIL';
```

Pour valider un autre membre équipe :

```sql
update public.profiles
set role = 'team',
    status = 'approved'
where email = 'EMAIL_DU_MEMBRE';
```

Pour bloquer un compte :

```sql
update public.profiles
set status = 'blocked'
where email = 'EMAIL_A_BLOQUER';
```

## 4. URLs à autoriser dans Supabase

Dans `Authentication > URL Configuration` :

- Site URL en local : `http://localhost:5173`
- Redirect URL locale : `http://localhost:5173/#/connexion`
- Redirect URL production : `https://TON_DOMAINE/#/connexion`

Avec GitHub Pages en sous-chemin, utiliser :

- `https://TON_USER.github.io/TON_REPO/#/connexion`
