-- Cobalith Studio — consent-based first-party audience measurement.
-- Run after docs/supabase-setup.md so public.is_admin() exists.

create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  event_type text not null check (event_type in ('page_view', 'page_end', 'web_vital')),
  path text not null check (char_length(path) between 1 and 80),
  title text check (title is null or char_length(title) <= 140),
  visitor_id uuid not null,
  session_id uuid not null,
  is_session_start boolean not null default false,
  entry_path text check (entry_path is null or char_length(entry_path) <= 80),
  duration_seconds integer check (duration_seconds between 0 and 1800),
  scroll_depth smallint check (scroll_depth between 0 and 100),
  engaged boolean,
  referrer_source text check (referrer_source is null or char_length(referrer_source) <= 100),
  utm_source text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 100),
  device_type text check (device_type in ('mobile', 'tablette', 'ordinateur')),
  browser text check (browser in ('Chrome', 'Firefox', 'Safari', 'Edge', 'Autre')),
  os text check (os in ('Windows', 'Android', 'iOS', 'macOS', 'Linux', 'Autre')),
  viewport text check (viewport in ('≤375', '376–430', '431–768', '769–1024', '1025–1440', '1441–1920', '>1920')),
  language text check (language is null or char_length(language) <= 12),
  timezone text check (timezone is null or char_length(timezone) <= 64),
  connection text check (connection is null or connection in ('slow-2g', '2g', '3g', '4g')),
  metric_name text check (metric_name is null or metric_name in ('LCP', 'CLS')),
  metric_value double precision check (metric_value is null or metric_value between 0 and 600000)
);

create index if not exists analytics_events_occurred_at_idx on public.analytics_events (occurred_at desc);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id, occurred_at);
create index if not exists analytics_events_visitor_idx on public.analytics_events (visitor_id, occurred_at);
create index if not exists analytics_events_path_idx on public.analytics_events (path, occurred_at desc);

alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon, authenticated;
grant select on public.analytics_events to authenticated;

drop policy if exists "Admins can read audience events" on public.analytics_events;
create policy "Admins can read audience events"
on public.analytics_events for select to authenticated
using (public.is_admin());

-- The public site can only call this constrained function. It cannot read,
-- update or delete rows, or choose server timestamps/row identifiers.
create or replace function public.record_analytics_event(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if payload is null
     or payload->>'event_type' not in ('page_view', 'page_end', 'web_vital')
     or coalesce(char_length(payload->>'path'), 0) not between 1 and 80
     or payload->>'path' like '/equipe%'
     or payload->>'path' like '/admin%'
  then raise exception 'invalid analytics payload'; end if;

  insert into public.analytics_events (
    event_type, path, title, visitor_id, session_id, is_session_start, entry_path,
    duration_seconds, scroll_depth, engaged, referrer_source, utm_source, utm_medium,
    utm_campaign, device_type, browser, os, viewport, language, timezone, connection,
    metric_name, metric_value
  ) values (
    payload->>'event_type', payload->>'path', left(payload->>'title', 140),
    (payload->>'visitor_id')::uuid, (payload->>'session_id')::uuid,
    coalesce((payload->>'is_session_start')::boolean, false), left(payload->>'entry_path', 80),
    least(1800, greatest(0, (payload->>'duration_seconds')::integer)),
    least(100, greatest(0, (payload->>'scroll_depth')::smallint)),
    (payload->>'engaged')::boolean, left(payload->>'referrer_source', 100),
    left(payload->>'utm_source', 100), left(payload->>'utm_medium', 100),
    left(payload->>'utm_campaign', 100), payload->>'device_type', payload->>'browser',
    payload->>'os', payload->>'viewport', left(payload->>'language', 12),
    left(payload->>'timezone', 64), payload->>'connection', payload->>'metric_name',
    (payload->>'metric_value')::double precision
  );
exception when invalid_text_representation or numeric_value_out_of_range or check_violation then
  raise exception 'invalid analytics payload';
end;
$$;

revoke all on function public.record_analytics_event(jsonb) from public;
grant execute on function public.record_analytics_event(jsonb) to anon, authenticated;

create or replace function public.purge_expired_analytics_events()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare deleted_count integer;
begin
  delete from public.analytics_events where occurred_at < now() - interval '25 months';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
revoke all on function public.purge_expired_analytics_events() from public, anon, authenticated;

-- Automatic retention. If pg_cron is unavailable on the current Supabase plan,
-- enable Supabase Cron first, then rerun these last two statements.
create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'purge-cobalith-analytics';
select cron.schedule('purge-cobalith-analytics', '17 3 * * *', $$select public.purge_expired_analytics_events();$$);

-- Verification:
-- select event_type, count(*) from public.analytics_events group by event_type;
-- select public.purge_expired_analytics_events(); -- call from SQL Editor only
