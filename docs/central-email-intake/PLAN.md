# Central email-only intake — local proposal, not deployed

## Current implemented repository wiring (live schema not queried)
1. Proof currently in production submits family details to POST /api/proof-interest. That route invokes proof_register_interest_v2, stores proof_family_interest and calls notifyProofInterest. Resend notification goes only to info@toothfairy.network; no registrant confirmation is implemented. Age/relationship/name are required by API/table. Existing clients, RPC, records, notifications and privacy link remain unchanged in this draft.
2. Newsletter: POST /api/subscribe invokes newsletter_subscribe with normalized email and source sathian-home or tfn-footer. newsletter_subscribers is unique by email_normalized; newsletter_signup_events record sources; RPC may create an agent intake receipt; route sends optional checked Resend registrant confirmation and records delivery status. /api/studio/subscribers and /studio/subscribers already provide private owner review using existing Studio authorization. Current repo schema has a SINGLE subscribed/unsubscribed/bounced status, source fields and metadata. Historical July governance wording about distinct TFN/personal preferences is not proof those preferences are separately implemented or present in live DB. Do not infer two preference flags from the two source labels. No live subscription state was read or changed.
3. Generic /api/waitlist uses optional fire-and-forget Telegram/Notion and unconditional success, with no durable receipt. Not reused or modified.

## Proposed centralized model
Use the existing Supabase project and service-side backend; no new provider/list/spreadsheet. Add audience_contacts as shared normalized-email identity, linking existing newsletter_subscribers by nullable unique ID. Keep newsletter_subscribers authoritative for newsletter state; never call newsletter_subscribe to register a tester, never set subscribed or clear unsubscribed_at from tester intake. Proposed backfill links existing newsletter identities, without creating any tester interest or changing consent. A proposed invoker-security trigger syncs future newsletter identities. No existing family-interest import is automatic: old email-vs-phone contacts and ambiguous historical consent require separate reconciliation.

Add early_tester_interests (one per contact) and immutable-purpose early_tester_signup_events (one per request UUID). Case/whitespace normalization only; do not strip plus-addresses or Gmail dots. Each event records source site/page, server consent timestamp, exact consent snapshot/version, purpose=upcoming_experience_availability and marketing_opt_in=false. No child name/age/relationship, grant amount, purchaser eligibility, wallet or financial operation fields. Existing newsletter subscription and withdrawal remain independent.

SQL is docs/central-email-intake/proposed-schema.sql, NOT a migration and NOT applied. It drafts RLS, service-role-only tables/RPC, search_path restrictions, grants and newsletter identity backfill/trigger. These are explicit future schema/permission/data changes requiring approval, not actions already taken. After approval create a migration through installed Supabase CLI, verify exact remote schema/version and duplicate migration history, then test locally before remote action. Do not execute this draft as-is on production.

## New endpoint and safety contract
POST /api/early-testing (disabled unless CENTRAL_SIGNUP_ENABLED=true) accepts only email, sourceSite, sourcePage, availabilityConsent=true, requestId UUIDv4 and empty honeypot company. Rejects all other fields, including child data or marketingOptIn. Same-origin JSON,2048-byte bound, conservative server email validation,max254chars, bounded source paths and hashed visitor. Only HMAC hash of visitor IP is stored, not raw IP. Source is supplied by local page code and validated against allowed site/path patterns; it is attribution, not verified identity or authorization.

Service-role RPC register_early_tester performs transactional normalized-email dedupe, request idempotency and locked five/hour visitor rate limit. Multiple Proof/Learn signup events attach to one contact and one testing-interest record. Reply success only after committed receipt matches client request UUID. Errors return generic unsaved state,503 for disabled/missing config,429 for rate limit,502 for persistence failure; retries retain input/request UUID, changed email gets a new UUID. A repeated explicit signup can reactivate withdrawn testing interest, preserving a new consent event; it does not reactivate newsletter consent.

No confirmation email, invitation, marketing subscription, owner notification or financial grant is automatically sent in new flow. Email ownership and eligibility remain unverified. Existing Resend remains available for a later separately approved invitation/confirmation workflow; no new provider. No API or public-agent claim of an invitation already sent.

## Public integration and exact copy
Proof's local one-field form now posts /api/early-testing. Learn's local parent area mounts shared EarlyTesterSignup sourceSite=learn; no form inside lesson readers/questions. Proof raw HTML uses same reviewed consent text, API and payload contract. Learn integration currently targets old main cd268046 and MUST be reapplied as a small component mount into the independently released final Learn layout, not overwrite its entire page.

Learn kicker: For parents and grown-ups.
Heading: Help shape what comes next.
Introduction: Join the early testing list for our upcoming Meta-connected experience. We’ll email you when it’s ready, with setup details and what participating families can try.
Field: Your email.
Consent: By signing up, you ask us to email you when our upcoming experience is ready, with setup details and early-testing information. This does not subscribe you to marketing.
Terms: The upcoming experience is not ready yet. Signing up does not give immediate access or confirm a testing place.
Button: Keep me posted.
Saving: Saving.
Success: Thank you. Your email is saved. We’ll email you when the upcoming experience is ready, with early-testing details.
Failure: Your email was not saved. Please try again.
Disabled endpoint: Early-testing signup is not available yet.
Privacy: existing https://toothfairy.network/privacy; policy must be reviewed/updated for this purpose and retention before release. Email-only intake is not an email ownership check or eligibility approval.

No first20, dollar amount, free-deposit-for-all or guaranteed gift claim is published in this draft. Owner has now removed financial incentives entirely; no grant workflow or eligibility term is part of this release.

## One private review surface
New read-only /studio/early-testers + /api/studio/early-testers reuse requireStudioAal2 (current implementation verifies existing Cloudflare Access JWT/allowed owner email), same middleware and private Studio shell. No new authentication method, user grant or public policy. Page displays each normalized email, source/consent history, testing-request status and separate existing newsletter status, with bounded pagination. It says email/eligibility unverified and issues no invitations/benefits. /studio/subscribers remains unchanged. New list is gated off with same server flag until schema is enabled.

## Migration, verification, release and rollback plan
1. Confirm upcoming-app positioning and purpose-specific consent, privacy/retention/deletion/withdrawal handling. Keep feature off.
2. Fetch final Learn production main, preserve owner source and exact Proof media. Apply only Proof scope/new shared intake files and tiny Learn parent-area mount. Rebuild exact final tree; current local base remains cd268046 until remote main advances.
3. Read-only live schema/introspection and migration-history check: newsletter/proof tables, functions, constraints, RLS/grants, indexes and existing consent model. No authority to apply remote changes currently.
4. With schema approval, generate proper migration via supabase migration new; provision disposable LOCAL schema and run local-contract-tests.sql (transaction rollback), concurrent-email/idempotency races, effective anon/auth denials, missing-schema failures, newsletter old-client regressions and trigger rollback. Run advisors against approved environment. SQL has not been executed here.
5. Parent cloud visual/keyboard/mobile/error/success tests using mocked endpoint, with no external signup submission. Test source/consent correctness and no child collection. Do not launch local browser/audio.
6. After explicit remote schema/config/deploy approval, apply reviewed migration and enable route only after schema gates; use existing hosted Site Agent Quality. Read-only production route/config checks; no signup or grant test without separate authorization.
7. Rollback public UI/server flag first; preserve new contact/consent records. If reverting identity sync, drop only new trigger/function after review; do not drop data or change old newsletter/family consent. No automatic copying old pilot contacts to marketing/testing lists. No credentials or permissions changed remotely.

## Tests and limitations
Mocked route tests cover off/missing config, normalization, honeypot, malformed/oversized/cross-origin requests, forbidden PII/marketing fields, shared Proof/Learn payload, source filtering, persist-before-success, missing receipt, RPC/network failure, rate limit, private Studio authorization, bounded pagination and generic errors. Existing family API remains tested (including rejection of email-only payload on OLD route). All remote fetches mocked in tests.

local-contract-tests.sql is prepared but NOT RUN: cross-site normalized dedupe, receipt idempotency, newsletter unsubscribed preservation, source/consent timestamps and no marketing, sixth-request rate limit and effective public permissions, with rollback. Additional concurrent transaction race tests remain required. No live DB or signup was touched.

References: https://supabase.com/docs/guides/database/functions ; https://supabase.com/docs/guides/database/postgres/row-level-security . Changelog.md fetch unsupported by web reader; the current HTML changelog and function/RLS pages were consulted. Current schema statements above are repository facts, not live schema verification.


## Latest owner direction — supersedes earlier incentive discussion
No deposit or other financial incentive is part of this signup. No amount, free-for-all, first20, price or guaranteed access language. The current wallet/keepsake product stays separate from the upcoming capture experience. Public copy is now: “Help shape what comes next.” / “Join the early testing list for our upcoming Meta-connected experience. We’ll email you when it’s ready, with setup details and what participating families can try.” Button: “Keep me posted”. The experience is explicitly not ready; immediate access/testing place not confirmed. “Our” identifies this as our upcoming experience, not an official Meta product. Compatibility claims about particular glasses are withheld until verified.

Purpose is upcoming_experience_availability, consent version upcoming-experience-notice/2026-10-27, and availabilityConsent=true. Consent text: “By signing up, you ask us to email you when our upcoming experience is ready, with setup details and early-testing information. This does not subscribe you to marketing.” Marketing remains false and existing newsletter preferences untouched. No recipient email or automatic notification job is sent/created now. The private queue supports later manually reviewed availability outreach. No financial eligibility decision is needed for this release; schema, privacy/retention, cloud acceptance and final Learn source reconciliation still need review.


## Current local verification checkpoint
Full suite:72files/495tests PASS; offline agent60/60PASS; exact latest build PASS (exit0),160pages, with fake closed-localhost backend settings. Consent/fields/media invariants and script syntax pass. SQL draft and local SQL test script remain unexecuted; this is not a verified live persistence path. Source snapshot is still cd268046, with independent Learn release reconciliation pending. No remote schema, permission, deployment, notification or signup action.


## Source reconciliation completed
A new isolated worktree proof-central-current was created at released Learn main b195e9aaa72b42d6949a49be7f95ff7bc5572142. Applied scoped tracked Proof/Studio/test edits and new intake files; DID NOT copy the old Learn page. Added only one EarlyTesterSignup import and one parent-area mount before parent-context to the newly released Learn page. All new classroom/guide/story/film gates and asset records from PR21 remain intact. Old draft preserved. Exact new-base verification follows in current review receipt.
