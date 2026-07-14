# Public Agent Data Map

Last reviewed: 2026-07-14
Schema: `supabase/migrations/20260714_public_agent_portal.sql`

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
| `agent_intakes` | note, optional name/email, consent, receipt, delivery state | None | Create and return opaque receipt | Read queued items and update delivery state | Read and manage at AAL2 |
| `agent_attachments` | private object path, safe filename, MIME type, hash, scan state | None | Create metadata after server-side checks | Include approved metadata only | Inspect and manage at AAL2 |
| `routing_decisions` | route, policy version, reason codes, optional classifier output | None | Create | None | Read and manage at AAL2 |
| `delivery_outbox` | destination key, payload, idempotency key, retry state | None | Create atomically with intake | Claim and update | Read and manage at AAL2 |
| `audit_events` | actor type, event, policy version, redacted details | None | Append | Append | Read only at AAL2 |
| `agent-quarantine` | untrusted uploaded object bytes | None | Write through service role | None | Read or remove at AAL2 |

The Supabase service role is server-only and bypasses RLS. It must never be exposed through a `NEXT_PUBLIC_` variable or sent to the browser.

## Sensitive fields

- `visitor_hash` is a keyed, rotating pseudonymous value. Do not store a raw IP address.
- `reply_email`, `display_name`, message content, object paths, filenames, and hashes are private intake data.
- `destination_key` is an internal routing alias, not a Telegram token or chat identifier.
- `payload`, `metadata`, classifier output, scan results, and audit details must not contain credentials or raw environment values.
- Uploaded or retrieved instructions are untrusted content. They are never promoted to system instructions.

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

`agent-quarantine` is a private bucket. The browser has no direct object policy. The API may accept only the migration allowlist and 10 MB maximum, create a randomized object path, preserve only a sanitized display filename, hash the bytes, and mark the attachment `pending` or `quarantined`. No answer model or delivery worker should read the object until a later scanner marks it approved.

## Operational checks before remote apply

- Run the schema-contract unit test.
- Start the local Supabase stack and reset the local database when Docker is available.
- Inspect RLS as anonymous, ordinary authenticated, AAL1 Studio, AAL2 Studio, and service-role clients.
- Verify the quarantine bucket reports `public = false` and has no anonymous storage policy.
- Apply remotely only from a reviewed migration commit with a backup and rollback plan.
