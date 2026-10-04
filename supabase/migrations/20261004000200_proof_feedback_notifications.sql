begin;
alter table public.proof_family_interest add column if not exists feedback text check (length(feedback) <= 1500);
alter table public.proof_family_interest add column if not exists notification_id text;
alter table public.proof_family_interest add column if not exists notification_status text not null default 'pending' check (notification_status in ('pending','accepted'));
alter table public.proof_family_interest add column if not exists notification_attempted_at timestamptz;
create or replace function public.proof_register_interest_v2(p_request_id uuid,p_name text,p_contact text,p_child_age integer,p_relationship text,p_updates boolean,p_source text,p_visitor text,p_feedback text)
returns table(receipt uuid) language plpgsql security definer set search_path=public,pg_temp as $$
declare saved_id uuid;
begin
 if length(p_feedback)>1500 then raise exception 'invalid_feedback'; end if;
 select r.receipt into saved_id from public.proof_register_interest(p_request_id,p_name,p_contact,p_child_age,p_relationship,p_updates,p_source,p_visitor) r;
 update public.proof_family_interest set feedback=coalesce(feedback,p_feedback) where id=saved_id;
 return query select saved_id;
end $$;
revoke all on function public.proof_register_interest_v2(uuid,text,text,integer,text,boolean,text,text,text) from public,anon,authenticated;
grant execute on function public.proof_register_interest_v2(uuid,text,text,integer,text,boolean,text,text,text) to service_role;
commit;
