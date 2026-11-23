create extension if not exists pg_net;

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  event_table text not null check (event_table in ('qr_events','interest_signups')),
  event_id uuid not null,
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (event_table, event_id)
);

alter table public.notification_deliveries enable row level security;
revoke all on table public.notification_deliveries from anon, authenticated;
grant all on table public.notification_deliveries to service_role;

create or replace function public.notify_rumbo_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://jcomekpaqinpgmkwrffg.supabase.co/functions/v1/notify-rumbo-event',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'sb_publishable_z3ald0CIUQr-646ovTpQlQ_1Qs45Epw'
    ),
    body := jsonb_build_object('table', TG_TABLE_NAME, 'id', NEW.id::text),
    timeout_milliseconds := 5000
  );
  return NEW;
end;
$$;

drop trigger if exists notify_rumbo_qr_page_view on public.qr_events;
create trigger notify_rumbo_qr_page_view
after insert on public.qr_events
for each row
when (NEW.event_type = 'page_view' and lower(NEW.source) = 'qr')
execute function public.notify_rumbo_activity();

drop trigger if exists notify_rumbo_signup on public.interest_signups;
create trigger notify_rumbo_signup
after insert on public.interest_signups
for each row
execute function public.notify_rumbo_activity();
