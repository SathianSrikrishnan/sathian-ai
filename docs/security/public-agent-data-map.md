# Public Agent Data Map

Last reviewed: 2026-07-14
Schema: `supabase/migrations/20260714090000_public_agent_portal.sql` plus `supabase/migrations/20260714114500_agent_file_intake.sql`

## Boundary

The public site agent has three separate trust zones:

1. **Public answer zone** reads only approved, currently valid `public_memory_cards` with provenance.
2. **Intake zone** writes conversations, notes, receipts, routing decisions, and quarantined upload metadata through a server-side service-role client.
3. **Operator zone** is Studio. It requires Supabase Auth, the `studio_admin` app-metadata role, and AAL2 before it may inspect or manage private records.

Local Markdown remains the canonical second brain. Supabase receives a deliberately reviewed public projection, never an automatic dump of private notes.

## Access map

| Data | Main fields | Public browser | Site-agent API | Delivery worker | Studio operator |
| --- | --- | --- | --- | --- | --- |
| `public_memory_cards` | body, tags, source reference, approval and validity | Read approved and in-date cards only | Read approved and in-date cards | None | Read and manage all cards at AAL2 |
| `agent_sessions` | pseudonymous visitor hash, policy and notice versions, expiry | None | Create and update | Read by referenced intake only | Read and manage at AAL2 |
| `agent_messages` | visitor and agent text, intent, model metadata | None | Create and read within the active server session | None | Read and manage at AAL2 |
| `agent_intakes` | note, optional name/email, consent, receipt, delivery state | None | Create and return opaque receipt | Read only through a claimed outbox item; update delivery state through service-only RPCs | Read and manage at AAL2 |
| `agent_attachments` | private object path, safe filename, declared and detected MIME type, hash, scan state | One signed upload URL for the generated object only; no read or list | Reserve, byte-check, hash, and transition state | Include byte-cleared metadata only; never read bytes | Inspect at AAL2 through a 60-second one-object URL |
| `routing_decisions` | route, policy version, reason codes, optional classifier output | None | Create | None | Read and manage at AAL2 |
| `delivery_outbox` | destination alias, minimal payload, idempotency key, lease, retry and provider receipt state | None | Create atomically with intake | Claim and update through service-only RPCs | Read and manage at AAL2 |
| `audit_events` | actor type, event, policy version, redacted details | None | Append | Append | Read only at AAL2 |
| `agent_message_rate_limits` | keyed visitor hash, window, count | None | Consume through a service-only RPC | None | None |
| `agent-quarantine` | untrusted uploaded object bytes | Signed write to one generated key; no read or list policy | Reserve and verify through service role | None | Server-issued 60-second signed read after AAL2; no bucket listing policy |

The Supabase service role is server-only and bypasses RLS. It must never be exposed through a `NEXT_PUBLIC_` variable or sent to the browser.

The Telegram delivery service is a cron-only Cloudflare Worker with no public route. `agent_claim_delivery_batch` atomically leases ready rows with `FOR UPDATE SKIP LOCKED`; `agent_mark_delivery_succeeded` and `agent_mark_delivery_failed` accept transitions only from the active lease owner. Delivered and dead-letter rows are not reclaimed. Stale processing leases become eligible after five minutes so a crashed invocation cannot strand an intake.

## Sensitive fields

- `visitor_hash` is a keyed, rotating pseudonymous value. Do not store a raw IP address.
- `reply_email`, `display_name`, message content, object paths, filenames, and hashes are private intake data.
- `destination_key` is an internal routing alias, not a Telegram token or chat identifier.
- Telegram bot credentials, the Supabase service-role key, and private chat/topic identifiers exist only as Worker secrets.
- `AGENT_UPLOAD_COMPLETION_SECRET`, `AGENT_VISITOR_HASH_KEY`, and `TURNSTILE_VERIFY_URL` are server-only. The completion token is returned only to the reserving browser and stored as a hash.
- `payload`, `metadata`, classifier output, scan results, and audit details must not contain credentials or raw environment values.
- Uploaded or retrieved instructions are untrusted content. They are never promoted to system instructions.
- Delivery logs contain event identifiers and state counts only. They do not contain visitor message previews, email addresses, filenames, tokens, or provider response bodies.

## Retention defaults

| Record | Default retention | Notes |
| --- | --- | --- |
| Session and message | 90 days | Close sooner when the visitor explicitly ends a session. |
| Intake | 180 days | May be retained longer only after deliberate operator review. |
| Quarantined attachment | 30 days | Delete rejected, expired, and orphaned objects through a scheduled server workflow. |
| Audit event | 365 days | Store reason codes and redacted metadata, not message bodies. |
| Public memory | Until retired or validity expires | A card must retain its source reference. |

Retention columns declare the intended lifecycle; a later scheduled workflow must perform the actual deletions.

## Public-memory publishing rule

A card is retrievable only when all of the following are true:

- `status = 'approved'`;
- `source_ref` is present;
- `valid_from` is empty or has passed;
- `valid_until` is empty or is still in the future.

An empty public-memory result stays empty. The answer layer must not fall back to local private notes, private Supabase tables, Telegram history, or user-uploaded content.

## Upload quarantine rule

`agent-quarantine` is a private bucket. The browser has no storage policy and cannot list or read it. After Turnstile and a durable three-per-hour visitor limit pass, the API may issue Supabase's two-hour signed upload URL for one generated key. The application launch limit is 5 MB; the bucket's 10 MB ceiling remains a second guardrail.

The allowlist is PDF, plain text, Markdown, JPEG, PNG, and WebP. The completion route downloads the object with the service role, compares the declared and actual size, detects type from bytes, rejects active or mismatched content, hashes the object, and moves a passing object from `pending` to `quarantined`. It does not render, summarize, embed, or forward file bytes. Telegram may receive the safe filename, detected type, size, and Studio link only after the object leaves `pending`. File contents remain unavailable to the answer model until a future scanner and explicit approval state exist.

Turnstile activation needs `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in the site build, a server-only `TURNSTILE_VERIFY_URL` for the managed verification Worker, and `TURNSTILE_ALLOWED_HOSTNAMES`. The reserve route validates the Spin action marker `turnstile-spin-v1` and fails closed when verification or upload secrets are unavailable. File intake additionally requires `AGENT_FILE_INTAKE_ENABLED=true` on the server and `NEXT_PUBLIC_AGENT_FILE_INTAKE_ENABLED=true` in the built client. Both default off.

## Operational checks before remote apply

- Run the schema-contract unit test.
- Start the local Supabase stack and reset the local database when Docker is available.
- Inspect RLS as anonymous, ordinary authenticated, AAL1 Studio, AAL2 Studio, and service-role clients.
- Verify the quarantine bucket reports `public = false` and has no anonymous storage policy.
- Verify an ordinary browser cannot list or read the bucket, a signed upload cannot overwrite another key, and an AAL2 download redirects through a 60-second URL.
- Verify the service-only message limiter persists across requests and rejects attempt 31 in the one-hour window.
- Apply remotely only from a reviewed migration commit with a backup and rollback plan.
