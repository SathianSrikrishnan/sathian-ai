begin;
create table if not exists public.proof_family_interest (
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique,
 adult_name text not null, contact text not null, child_age smallint not null check(child_age between 0 and 17),
 relationship text not null check(relationship in ('caregiver','network')), updates_consent boolean not null,
 consent_version text not null default 'proof-pilot/2026-10-04', source text not null,
 visitor_hash text not null, created_at timestamptz not null default now()
);
alter table public.proof_family_interest enable row level security;
revoke all on public.proof_family_interest from anon, authenticated;
create index if not exists proof_interest_visitor_time on public.proof_family_interest(visitor_hash,created_at);
create or replace function public.proof_register_interest(p_request_id uuid,p_name text,p_contact text,p_child_age integer,p_relationship text,p_updates boolean,p_source text,p_visitor text)
returns table(receipt uuid) language plpgsql security definer set search_path=public,pg_temp as $$
declare existing_id uuid;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_visitor,0));
 select id into existing_id from public.proof_family_interest where request_id=p_request_id and contact=p_contact;
 if existing_id is not null then return query select existing_id; return; end if;
 if (select count(*) from public.proof_family_interest where visitor_hash=p_visitor and created_at>now()-interval '1 hour')>=5 then raise exception 'proof_rate_limit'; end if;
 if length(p_name) not between 1 and 100 or length(p_contact) not between 7 and 320 or length(p_source)>64 or length(p_visitor)<>64 then raise exception 'invalid_input'; end if;
 insert into public.proof_family_interest(request_id,adult_name,contact,child_age,relationship,updates_consent,source,visitor_hash)
 values(p_request_id,p_name,p_contact,p_child_age,p_relationship,p_updates,p_source,p_visitor) returning id into existing_id;
 return query select existing_id;
end $$;
revoke all on function public.proof_register_interest(uuid,text,text,integer,text,boolean,text,text) from public,anon,authenticated;
grant execute on function public.proof_register_interest(uuid,text,text,integer,text,boolean,text,text) to service_role;
commit;
