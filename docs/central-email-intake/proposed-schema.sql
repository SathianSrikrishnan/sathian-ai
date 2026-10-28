-- REVIEW DRAFT ONLY. Not a migration; not applied to any database.
-- After approval, verify the live schema and use `supabase migration new`.
-- Existing newsletter and Proof records, RPCs and consent remain intact.
begin;

create table public.audience_contacts (
  id uuid primary key default gen_random_uuid(),
  email_normalized text not null unique check (email_normalized = lower(btrim(email_normalized))),
  newsletter_subscriber_id uuid unique references public.newsletter_subscribers(id) on delete set null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  check (length(email_normalized) between 3 and 320)
);
create table public.early_tester_interests (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null unique references public.audience_contacts(id) on delete cascade,
  status text not null default 'requested' check (status in ('requested','withdrawn')),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create table public.early_tester_signup_events (
  request_id uuid primary key,
  interest_id uuid not null references public.early_tester_interests(id) on delete cascade,
  source_site text not null check (source_site in ('proof','learn')),
  source_page text not null check (length(source_page) <= 160),
  consented_at timestamptz not null default now(),
  consent_copy_version text not null,
  consent_copy text not null,
  consent_purpose text not null default 'upcoming_experience_availability' check (consent_purpose = 'upcoming_experience_availability'),
  marketing_opt_in boolean not null default false check (marketing_opt_in = false),
  visitor_hash text not null check (visitor_hash ~ '^[0-9a-f]{64}$')
);
create index early_tester_signup_rate on public.early_tester_signup_events(visitor_hash,consented_at);
create index early_tester_signup_interest on public.early_tester_signup_events(interest_id,consented_at desc);
alter table public.audience_contacts enable row level security;
alter table public.early_tester_interests enable row level security;
alter table public.early_tester_signup_events enable row level security;
revoke all on public.audience_contacts, public.early_tester_interests, public.early_tester_signup_events from public, anon, authenticated;
grant select,insert,update,delete on public.audience_contacts, public.early_tester_interests, public.early_tester_signup_events to service_role;

-- Reuse newsletter identities without subscribing, resubscribing or changing them.
-- Existing newsletter identity limit is preserved; new signup validation is stricter.
insert into public.audience_contacts(email_normalized,newsletter_subscriber_id,created_at,last_seen_at)
select email_normalized,id,created_at,last_seen_at from public.newsletter_subscribers
on conflict(email_normalized) do nothing;

-- Keep a single contact identity when the existing newsletter intake adds a row.
-- Invoker security; existing service-side newsletter path already has privileges.
create function public.sync_newsletter_contact_identity() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  update public.audience_contacts set newsletter_subscriber_id=null
    where newsletter_subscriber_id=new.id and email_normalized<>new.email_normalized;
  insert into public.audience_contacts(email_normalized,newsletter_subscriber_id)
    values(new.email_normalized,new.id)
    on conflict(email_normalized) do update set newsletter_subscriber_id=excluded.newsletter_subscriber_id;
  return new;
end $$;
revoke all on function public.sync_newsletter_contact_identity() from public,anon,authenticated;
grant execute on function public.sync_newsletter_contact_identity() to service_role;
create trigger newsletter_contact_identity after insert or update of email_normalized
on public.newsletter_subscribers for each row execute function public.sync_newsletter_contact_identity();

create function public.register_early_tester(
  p_email text, p_request_id uuid, p_source_site text, p_source_page text,
  p_visitor_hash text, p_consent_copy_version text, p_consent_copy text
) returns table(receipt uuid)
language plpgsql security invoker set search_path = '' as $$
declare
  v_email text := lower(btrim(p_email));
  v_contact uuid;
  v_interest uuid;
  v_existing_email text;
begin
  if p_email is null or length(v_email) not between 3 and 254
    or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or p_request_id is null or p_source_site is null or p_source_page is null
    or not ((p_source_site='proof' and p_source_page ~ '^/(proof/?)?$')
      or (p_source_site='learn' and p_source_page ~ '^/learn(/[a-zA-Z0-9-]+)*/?$'))
    or length(p_source_page)>160 or p_visitor_hash is null or p_visitor_hash !~ '^[0-9a-f]{64}$'
    or p_consent_copy_version is distinct from 'upcoming-experience-notice/2026-10-27'
    or p_consent_copy is distinct from 'By signing up, you ask us to email you when our upcoming experience is ready, with setup details and early-testing information. This does not subscribe you to marketing.'
    then raise exception 'early_tester_invalid'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text,0));
  select c.email_normalized into v_existing_email
    from public.early_tester_signup_events e
    join public.early_tester_interests i on i.id=e.interest_id
    join public.audience_contacts c on c.id=i.contact_id where e.request_id=p_request_id;
  if found then
    if v_existing_email<>v_email then raise exception 'early_tester_invalid'; end if;
    return query select p_request_id; return;
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_visitor_hash,1));
  if (select count(*) from public.early_tester_signup_events
    where visitor_hash=p_visitor_hash and consented_at>now()-interval '1 hour')>=5
    then raise exception 'early_tester_rate_limit'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_email,2));
  insert into public.audience_contacts(email_normalized,newsletter_subscriber_id)
    values(v_email,(select n.id from public.newsletter_subscribers n where n.email_normalized=v_email))
    on conflict(email_normalized) do update set last_seen_at=now(),
      newsletter_subscriber_id=coalesce(public.audience_contacts.newsletter_subscriber_id,excluded.newsletter_subscriber_id)
    returning id into v_contact;
  insert into public.early_tester_interests(contact_id) values(v_contact)
    on conflict(contact_id) do update set last_seen_at=now(),status='requested'
    returning id into v_interest;
  insert into public.early_tester_signup_events(request_id,interest_id,source_site,source_page,visitor_hash,consent_copy_version,consent_copy)
    values(p_request_id,v_interest,p_source_site,p_source_page,p_visitor_hash,p_consent_copy_version,p_consent_copy);
  return query select p_request_id;
end $$;
revoke all on function public.register_early_tester(text,uuid,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.register_early_tester(text,uuid,text,text,text,text,text) to service_role;
commit;
