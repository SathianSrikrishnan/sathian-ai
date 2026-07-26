# Public Agent Portal Implementation Plan

> **For Sathian:** Use the `executing-plans` skill to implement this plan task by task. Use `test-driven-development` for each behavior and `verification-before-completion` before any handoff or deploy request.

**Goal:** Replace the fragile public chat and limited Studio with a safe public answer agent, durable visitor intake, Telegram delivery, reviewed public memory, and a secure Studio control room.

**Architecture:** Keep local Markdown as the canonical second brain. Store only reviewed public memory and operational records in Supabase. Put a deterministic policy boundary in front of the answer model. Persist intake and an idempotent Telegram outbox in one transaction. Use private quarantine for constrained file uploads. Keep public, intake, and operator capabilities in separate trust zones.

**Stack:** Next.js 14, TypeScript, Supabase Postgres/Auth/Storage, Anthropic or model-gateway-compatible answer model, Vitest for unit and route tests, Playwright for browser verification, new Telegram Bot API bridge.

**Design reference:** `docs/plans/2026-07-14-public-agent-portal-design.md`

## Task 1: Add a real unit-test lane

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `tests/unit/smoke.test.ts`

**Steps:**

1. Write a failing smoke test that imports one pure TypeScript helper.
2. Run `npx vitest run tests/unit/smoke.test.ts` and confirm the expected import/configuration failure.
3. Install Vitest as a development dependency and add `test:unit` and `test:unit:watch` scripts.
4. Add the smallest Node-environment configuration needed for the `@/` alias.
5. Run the smoke test and the existing Node tests.
6. Commit as `test: add unit test lane for agent portal`.

## Task 2: Close the Studio cookie vulnerability

**Files:**

- Create: `src/lib/studio-token.ts`
- Create: `tests/unit/studio-token.test.ts`
- Modify: `src/app/api/studio/auth/route.ts`
- Modify: `src/middleware.ts`
- Remove after callers migrate: `src/lib/studio-auth.ts`

**Required tests first:**

- accepts a correctly signed, unexpired token;
- rejects a recent timestamp with a forged 64-character signature;
- rejects malformed, future-dated, and expired tokens;
- uses Web Crypto so verification works in middleware runtime.

**Steps:**

1. Write failing token tests.
2. Implement async HMAC sign and verify helpers with `crypto.subtle` and an injected clock.
3. Change the login route to await the signer.
4. Change middleware to await signature verification rather than checking format and age.
5. Run the unit tests, typecheck, and production build.
6. Commit as `fix: verify Studio authentication signature`.

## Task 3: Correct and simplify the existing chat request

**Files:**

- Create: `src/lib/chat-history.ts`
- Create: `tests/unit/chat-history.test.ts`
- Modify: `src/components/ChatWidget.tsx`
- Modify: `src/app/api/chat/route.ts`
- Modify: `src/lib/notifications.ts`

**Required tests first:**

- the newest message appears exactly once in the model request;
- malformed history entries are removed;
- history and message lengths are capped;
- no code path calls Notion.

**Steps:**

1. Extract request-history normalization into a pure helper and test the duplicate case.
2. Send prior messages as `history` and the new message as `message`.
3. Remove `logToNotion` and all Notion environment-variable reads from the route.
4. Keep existing Telegram notification behavior only until the durable outbox replaces it.
5. Add a short UI disclosure: messages may be stored and forwarded to Sathian; visitors should not submit secrets.
6. Run targeted unit tests, the relevant browser flow, typecheck, and build.
7. Commit as `fix: remove duplicate chat prompts and Notion logging`.

## Task 4: Create the agent data model and Row Level Security

**Files:**

- Create: `supabase/migrations/20260714090000_public_agent_portal.sql`
- Create: `tests/unit/agent-schema.test.ts`
- Create: `docs/security/public-agent-data-map.md`

**Schema:**

- `public_memory_cards`
- `agent_sessions`
- `agent_messages`
- `agent_intakes`
- `agent_attachments`
- `routing_decisions`
- `delivery_outbox`
- `audit_events`

**Required tests first:**

- migration declares RLS on every new table;
- anonymous roles cannot list, update, or delete intake rows;
- public-memory retrieval requires approved and in-date records;
- storage policy does not make quarantine objects public.

**Steps:**

1. Write a schema-contract test that fails against the missing migration.
2. Add enums, tables, indexes, retention fields, and constraints.
3. Enable RLS and add restrictive policies for Studio and service roles.
4. Add a private `agent-quarantine` bucket policy in the migration or a paired setup script.
5. Document which service can read each field.
6. Validate the migration locally before any remote apply.
7. Commit as `feat: add public agent and intake schema`.

## Task 5: Replace the hard-coded memory array with reviewed public cards

**Files:**

- Create: `src/lib/agent/public-memory.ts`
- Create: `src/lib/agent/types.ts`
- Create: `tests/unit/public-memory.test.ts`
- Modify: `src/lib/memory.ts`
- Create: `scripts/seed-public-memory.mjs`

**Required tests first:**

- only approved and currently valid cards are returned;
- unapproved, expired, private, and missing-provenance records are excluded;
- retrieval returns source references with each card;
- an empty result does not fall back to private data.

**Steps:**

1. Write failing repository tests with an injected Supabase client.
2. Implement the exact filtered query.
3. Add a seed script for the currently curated public facts with explicit provenance.
4. Make the existing `getMemoryContext` adapter read the new repository.
5. Run unit tests and verify a prompt asking for private data receives no context.
6. Commit as `feat: retrieve reviewed public memory cards`.

## Task 6: Build the deterministic policy and router contract

**Files:**

- Create: `src/lib/agent/policy.ts`
- Create: `src/lib/agent/router.ts`
- Create: `src/lib/agent/schemas.ts`
- Create: `tests/unit/agent-policy.test.ts`
- Create: `tests/fixtures/agent-red-team.json`

**Required tests first:**

- classifies answer, intake, and answer-plus-intake requests;
- blocks requests for secrets, private family details, client data, shell access, and arbitrary tools;
- treats uploaded or retrieved instructions as untrusted content;
- rejects router output that does not match the schema;
- deterministic blocks override optional model labels.

**Steps:**

1. Build a fixture set from ordinary questions and adversarial prompts.
2. Implement deterministic normalization, intent, and hard-deny rules.
3. Define a small JSON contract for an optional classifier.
4. Keep the classifier behind a feature flag and default it off.
5. Record policy version and reason codes for later auditing.
6. Commit as `feat: add deterministic public agent policy`.

## Task 7: Add durable text sessions, messages, and receipts

**Files:**

- Create: `src/lib/agent/intake.ts`
- Create: `src/lib/agent/receipts.ts`
- Create: `tests/unit/agent-intake.test.ts`
- Create: `src/app/api/agent/message/route.ts`
- Create: `tests/unit/agent-message-route.test.ts`

**Required tests first:**

- persistence failure returns no receipt;
- successful intake creates the intake and outbox row atomically;
- repeated idempotency keys return the same receipt and no duplicate outbox event;
- receipt response never exposes database identifiers or internal errors;
- retention deadline is assigned at creation.

**Steps:**

1. Implement the transaction boundary through a Supabase RPC function.
2. Return a short public receipt code and clear delivery status.
3. Store consent-policy version and page context.
4. Add request size and content validation.
5. Commit as `feat: persist agent intake and receipts`.

## Task 8: Build the bounded answer service

**Files:**

- Create: `src/lib/agent/answer.ts`
- Create: `src/lib/agent/prompt.ts`
- Create: `tests/unit/agent-answer.test.ts`
- Modify: `src/app/api/agent/message/route.ts`

**Required tests first:**

- the prompt includes only returned public cards;
- the agent identifies itself as Sathian's site agent;
- unknown personal questions produce an honest unknown response and intake offer;
- model failures can still preserve a valid intake and receipt;
- model output cannot alter routing or delivery state.

**Steps:**

1. Add an injected model adapter with a hard token limit and timeout.
2. Build the prompt from policy result, page, and reviewed public cards.
3. Return structured answer, sources, receipt, and capability flags.
4. Preserve the existing model provider initially; keep the adapter model-agnostic.
5. Commit as `feat: answer from public-safe memory only`.

## Task 9: Add durable Telegram delivery

**Files:**

- Create: `src/lib/agent/telegram-payload.ts`
- Create: `tests/unit/telegram-payload.test.ts`
- Create: `workers/telegram-delivery/README.md`
- Create in the selected worker home: delivery consumer and service definition
- Modify: `docs/security/public-agent-data-map.md`

**Required tests first:**

- one outbox event produces one Telegram message;
- duplicate processing with the same idempotency key does not repost;
- transient errors retry with backoff;
- permanent errors are visible and do not loop forever;
- Telegram payload contains a short preview and Studio link, not raw attachment bytes.

**Steps:**

1. Define the worker contract in the repository before choosing its host.
2. Create a new bot with minimum permissions only after Sathian approves the Telegram configuration action.
3. Put the token in the worker secret store, never in Vercel client variables or Supabase rows.
4. Implement claim, send, success, and retry state transitions.
5. Prove idempotency against a private test topic before connecting the real intake group.
6. Commit as `feat: deliver agent intakes through outbox`.

## Task 10: Move Studio to Supabase Auth plus TOTP

**Files:**

- Create: `src/app/studio/auth/confirm/route.ts`
- Create: `src/app/studio/mfa/page.tsx`
- Modify: `src/app/studio/login/page.tsx`
- Modify: `src/middleware.ts`
- Modify: `src/lib/supabase-auth.ts`
- Create: `tests/unit/studio-authorization.test.ts`
- Create: `tests/studio-auth-flow.spec.ts`

**Required tests first:**

- unknown emails cannot create an account;
- allowlisted account at AAL1 is redirected to MFA;
- only AAL2 reaches Studio pages and Studio APIs;
- server routes and database policies enforce the same boundary;
- redirect URLs are fixed to approved origins.

**Steps:**

1. Implement passwordless sign-in with `shouldCreateUser: false`.
2. Add the email allowlist on the server.
3. Add TOTP enrollment and challenge flow.
4. Enforce AAL2 in middleware, server routes, and RLS.
5. Remove the custom cookie login after the new path passes browser tests.
6. Commit as `feat: secure Studio with allowlisted MFA auth`.

## Task 11: Turn Studio into a typed control room

**Files:**

- Modify: `src/app/studio/page.tsx`
- Create: `src/app/studio/inbox/page.tsx`
- Create: `src/app/studio/memory/page.tsx`
- Create: `src/app/studio/homepage/page.tsx`
- Create: `src/app/studio/build-notes/page.tsx`
- Create matching `src/app/api/studio/**` routes
- Create reusable components under `src/components/studio/`
- Create: `tests/studio-control-room.spec.ts`

**Required browser behaviors:**

- dashboard shows writing, build notes, homepage, public memory, and inbox;
- public-memory cards show source, approval, and expiry;
- inbox shows receipt, delivery state, retention, and attachment quarantine state;
- reordering homepage sections uses typed records and keyboard-accessible controls;
- no page offers arbitrary HTML or free-form widget insertion.

**Steps:**

1. Build the navigation shell and empty states.
2. Add read-only inbox and public-memory views.
3. Add approval and expiry editing with audit events.
4. Add build-note and homepage-section editing.
5. Run desktop and mobile Playwright checks with no console errors.
6. Commit as `feat: expand Studio control room`.

## Task 12: Add constrained file intake

**Files:**

- Create: `src/lib/agent/file-policy.ts`
- Create: `tests/unit/file-policy.test.ts`
- Create: `src/app/api/agent/upload/reserve/route.ts`
- Create: `src/app/api/agent/upload/complete/route.ts`
- Modify: `src/components/ChatWidget.tsx` or its replacement
- Modify the delivery worker to surface cleared attachment metadata
- Create: `tests/agent-file-intake.spec.ts`

**Required tests first:**

- allows only PDF, text, Markdown, JPEG, PNG, and WebP;
- blocks archives, executables, scripts, HTML, SVG, Office files, and file-type mismatches;
- enforces one file and the launch size limit;
- generates object keys rather than using visitor filenames;
- never processes an object in `pending` or `blocked` state;
- signed operator URLs expire and cannot list the bucket.

**Steps:**

1. Implement byte-signature detection and the strict allowlist.
2. Reserve a generated private object key after Turnstile and rate-limit checks.
3. Upload directly to quarantine with a short-lived signed upload token.
4. Complete by hashing, detecting, and setting scan state.
5. Keep summarization, embeddings, and Telegram file forwarding disabled in the first release.
6. Commit as `feat: add quarantined agent file intake`.

## Task 13: Add retention, observability, and red-team verification

**Files:**

- Create: `src/lib/agent/retention.ts`
- Create: `tests/unit/retention.test.ts`
- Create: `docs/security/public-agent-runbook.md`
- Modify: `tests/fixtures/agent-red-team.json`
- Create: `tests/public-agent-red-team.spec.ts`

**Required tests:**

- expired anonymous sessions and quarantined objects are selected for deletion;
- successful cleanup writes an audit event;
- failures retry without silently extending retention;
- dashboards expose model errors, delivery backlog, and blocked uploads without message content in logs;
- red-team prompts cannot retrieve private facts or invoke tools.

**Steps:**

1. Add dry-run cleanup and review its report.
2. Add the scheduled cleanup only after dry-run evidence is approved.
3. Add structured, content-minimized logs and delivery backlog metrics.
4. Run the full adversarial fixture set and browser tests.
5. Commit as `test: verify public agent privacy and retention`.

## Task 14: Release candidate and explicit deploy gate

**Files:**

- Create: `docs/launch-readiness/public-agent-portal.md`
- Update: `C:\Users\sathi\Projects\_ops\SATHIAN-AI-TFN-HOMEPAGE-CHAT-ARTICLE-INTAKE-2026-07-14.md`
- Update: `C:\Users\sathi\Projects\_memory\TASKS.md`

**Verification commands:**

```powershell
# Source / context:
# Public Agent Portal release candidate in the dedicated worktree

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\public-agent-portal"

# Commands:
npm run test:unit
node --test tests/*.test.mjs
npx tsc --noEmit
npm run build
npx playwright test tests/studio-auth-flow.spec.ts tests/studio-control-room.spec.ts tests/agent-file-intake.spec.ts tests/public-agent-red-team.spec.ts
```

**Release gate:**

1. Record exact test counts, build result, screenshot paths, migration status, and known limitations.
2. Demonstrate forged-cookie rejection, public-memory filtering, one idempotent Telegram delivery, and one blocked file.
3. Keep the feature off behind a server flag until Sathian reviews the release candidate.
4. Ask explicitly before applying production migrations, creating or adding the Telegram bot, changing secrets, or deploying to production.

## Recommended execution slices

- **Slice A, immediate repair:** Tasks 1 to 3.
- **Slice B, text-only useful agent:** Tasks 4 to 9.
- **Slice C, operator control room:** Tasks 10 and 11.
- **Slice D, safe files and hardening:** Tasks 12 to 14.

Do not collapse these into one deploy. Each slice should end with an inspectable local or preview receipt.
