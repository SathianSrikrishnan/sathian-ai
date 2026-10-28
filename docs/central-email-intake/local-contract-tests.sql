-- NOT RUN. Local disposable Postgres only, after proposed-schema.sql is approved
-- and applied locally. Never point this script at production. Always rolls back.
begin;
set local role service_role;
do $$
declare
  v_a uuid := gen_random_uuid(); v_b uuid := gen_random_uuid(); v_contact uuid;
  v_version text := 'upcoming-experience-notice/2026-10-27';
  v_copy text := 'By signing up, you ask us to email you when our upcoming experience is ready, with setup details and early-testing information. This does not subscribe you to marketing.';
  v_receipt uuid; v_count integer;
begin
  select receipt into v_receipt from public.register_early_tester(' Central.Contract@Example.invalid ',v_a,'proof','/',repeat('a',64),v_version,v_copy);
  if v_receipt<>v_a then raise exception 'receipt mismatch'; end if;
  perform * from public.register_early_tester('central.contract@example.invalid',v_a,'proof','/',repeat('a',64),v_version,v_copy);
  perform * from public.register_early_tester('CENTRAL.CONTRACT@example.invalid',v_b,'learn','/learn',repeat('b',64),v_version,v_copy);
  select id into v_contact from public.audience_contacts where email_normalized='central.contract@example.invalid';
  if (select count(*) from public.audience_contacts where email_normalized='central.contract@example.invalid')<>1
    or (select count(*) from public.early_tester_interests where contact_id=v_contact)<>1
    or (select count(*) from public.early_tester_signup_events where request_id in(v_a,v_b))<>2
    then raise exception 'normalization, cross-site dedupe or retry idempotency failed'; end if;
  if exists(select 1 from public.early_tester_signup_events where request_id in(v_a,v_b)
    and (marketing_opt_in or consented_at is null or consent_copy_version<>v_version or consent_copy<>v_copy))
    then raise exception 'purpose/consent snapshot mismatch'; end if;
  insert into public.newsletter_subscribers(email,email_normalized,status,first_source,last_source,consent_notice_version,unsubscribed_at)
    values('central.newsletter@example.invalid','central.newsletter@example.invalid','unsubscribed','sathian-home','sathian-home','local-test-only',now());
  perform * from public.register_early_tester('central.newsletter@example.invalid',gen_random_uuid(),'learn','/learn',repeat('c',64),v_version,v_copy);
  if (select status from public.newsletter_subscribers where email_normalized='central.newsletter@example.invalid')<>'unsubscribed'
    then raise exception 'tester signup changed newsletter preference'; end if;
  if (select count(*) from public.audience_contacts where email_normalized='central.newsletter@example.invalid')<>1
    then raise exception 'newsletter contact identity not shared'; end if;
  for v_count in 1..5 loop
    perform * from public.register_early_tester('central.rate@example.invalid',gen_random_uuid(),'proof','/',repeat('d',64),v_version,v_copy);
  end loop;
  begin
    perform * from public.register_early_tester('central.rate@example.invalid',gen_random_uuid(),'proof','/',repeat('d',64),v_version,v_copy);
    raise exception 'rate limit did not reject sixth request';
  exception when raise_exception then
    if sqlerrm<>'early_tester_rate_limit' then raise; end if;
  end;
  if has_function_privilege('anon','public.register_early_tester(text,uuid,text,text,text,text,text)','EXECUTE')
    or has_table_privilege('anon','public.audience_contacts','SELECT')
    or has_table_privilege('authenticated','public.audience_contacts','SELECT')
    then raise exception 'public access unexpectedly granted'; end if;
end $$;
rollback;
