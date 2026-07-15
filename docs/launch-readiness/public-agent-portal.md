# sathian.ai Public Agent Portal — Release Candidate

Last updated: 2026-07-15
Branch: `feat/public-agent-portal`
Production: unchanged
Decision state: **protected preview and database foundation exist; OpenAI provider repair passes local proof; preview redeploy and production activation still require separate approval gates**

## Read this first

### The goal

Turn `sathian.ai` into a public field notebook with Tooth Fairy Network as the flagship and one useful, tightly bounded agent doorway. The agent can answer from reviewed public material, accept a note, return a receipt, and route that note to Sathian without gaining access to his private second brain or arbitrary tools.

### Where we are

1. **The new site and agent are built on the candidate branch.** The homepage, TFN origin essay, build notes, reviewed public memory, receipt-backed intake, private Studio, one-file quarantine, and Telegram delivery worker are present.
2. **The additive database foundation is live.** The reviewed migrations were applied to the mapped production Supabase project, eight public-memory cards were seeded, and the existing `sathians@gmail.com` Auth user received the `studio_admin` application role.
3. **A protected Vercel preview exists.** `https://sathian-ai-agent-review-20260714.vercel.app` is access-protected and currently reflects commit `e51a66c` until the OpenAI provider repair is verified and redeployed.
4. **The current Anthropic credential is invalid.** The candidate branch is switching the public answer adapter to the already-approved `OPENAI_API_KEY`; OpenRouter remains outside this launch.
5. **Production web traffic has not changed.** Vercel still serves the July 12 deployment. Turnstile, Telegram delivery, file activation, TOTP enrollment, production Vercel deployment, Substack publication, and public posting remain incomplete or approval-gated.

### What this goal does not include

- importing the full Notion export into the second brain;
- publishing the TFN essay to Substack;
- enabling destructive retention cleanup or a cleanup schedule;
- giving the public agent direct access to private Markdown, Telegram history, files, shell access, or arbitrary tools.

Those remain separate, deliberate workstreams.

## Plain-language readiness

| Area | Current state | What remains live |
| --- | --- | --- |
| Homepage and project imagery | Present in protected candidate | Final review, then approved production deploy |
| TFN origin essay | Ready in site code | Final copy review and separate Substack publication decision |
| Public answer agent | OpenAI provider repair passes local proof | Redeploy protected preview, then run answer/privacy matrix |
| Notes and receipts | Database foundation live | Verify one synthetic protected-preview receipt |
| Telegram delivery | Worker code ready; Worker does not exist in Cloudflare | Approve bot/topic setup, secrets, deploy, and one private-topic proof |
| Private Studio | Existing user and role configured | Sathian enrolls TOTP and proves AAL2 |
| File intake | Ready locally and independently default-off | Create Turnstile, configure both flags, and prove one benign file plus one blocked file |
| Retention | Read-only dry run ready | Review a real report later; destructive cleanup and scheduling stay disabled |
| Production | July 12 Vercel deployment remains live | Explicit activation approval |

## Current production and external-state audit

Verified on 2026-07-14:

- `https://sathian.ai` currently leads with **“AI-native systems for real work.”** It is not the new “Proof of work, in public” candidate.
- Vercel production deployment `dpl_9fz7eufZGkZPmF3559gtN1z9N3VR` is **Ready**, created July 12, 2026, and owns `sathian.ai`, `www.sathian.ai`, and the existing aliases.
- The candidate is on the isolated `feat/public-agent-portal` worktree; the protected preview currently points to commit `e51a66c`.
- the reviewed Supabase migrations, eight public-memory cards, and the existing Studio user's application role are live;
- the existing Vercel `OPENAI_API_KEY` is available in Production, Preview, and Development scopes, without exposing its value;
- Cloudflare authentication works, but `sathian-ai-telegram-delivery` does not exist and therefore has no deployed version or secrets;
- the Anthropic credential returns 401 and is no longer the chosen public-agent path;
- the candidate branch uses OpenAI GPT-5.4 mini for the public answer adapter. OpenAI documents GPT-5.4 mini as a fast model for high-volume workloads with Chat Completions support: [OpenAI model page](https://developers.openai.com/api/docs/models/gpt-5.4-mini).

## Local database proof

An isolated Supabase 2.109.1 stack replayed all migrations against local Postgres 17.6.1 without touching production.

Applied in order:

1. `20260325_tfn_children.sql`
2. `20260413_add_tooth_story.sql`
3. `20260414_add_tradition_slug.sql`
4. `20260506_tfn_magic_studio.sql`
5. `20260714090000_public_agent_portal.sql`
6. `20260714103000_studio_control_room.sql`
7. `20260714114500_agent_file_intake.sql`
8. `20260714130000_agent_message_rate_limit.sql`

The replay confirmed:

- 12 expected new or extended public tables are present;
- `agent-quarantine` reports `public = false`;
- the durable message limiter allows attempts 1 through 30 in the one-hour window and rejects attempt 31;
- migration IDs are unique and the base agent schema precedes every dependent migration.

Remote preflight must still run `supabase migration list` and `supabase db push --dry-run`. If remote history differs, stop. Do not use `migration repair` or apply SQL manually without a reviewed reconciliation.

## Required configuration — names only

No secret values belong in this document or chat.

### Vercel site

| Variable | Purpose | Initial state |
| --- | --- | --- |
| `PUBLIC_AGENT_ENABLED` | Master server-side agent gate | `false` until protected-preview proof |
| `AGENT_FILE_INTAKE_ENABLED` | Server-side file-only kill switch | `false` until file proof |
| `NEXT_PUBLIC_AGENT_FILE_INTAKE_ENABLED` | Shows file controls in the built client | `false` until file proof |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser Auth/public-memory client | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only intake and Studio operations | Required; never public |
| `OPENAI_API_KEY` | Bounded public answer model | Existing scoped variable; intake fallback remains safe |
| `STUDIO_ALLOWED_EMAILS` | Existing approved operator accounts | Required |
| `STUDIO_PUBLIC_ORIGIN` | Fixed magic-link callback origin | `https://sathian.ai` in production |
| `AGENT_VISITOR_HASH_KEY` | Pseudonymous durable rate-limit key | Required; independent server secret |
| `AGENT_IDEMPOTENCY_SECRET` | Receipt/outbox deduplication key | Required; independent server secret |
| `AGENT_UPLOAD_COMPLETION_SECRET` | One-file completion-token binding | Required for files; independent server secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser Turnstile widget identifier | Required for files; not a secret |
| `TURNSTILE_VERIFY_URL` | Managed Spin siteverify Worker URL | Required for files |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Accepted production hostnames | `sathian.ai,www.sathian.ai` |
| `AGENT_CLASSIFIER_ENABLED` | Optional advisory classifier | Keep `false` for launch |

### Cloudflare Telegram delivery Worker

| Setting | Storage |
| --- | --- |
| `SUPABASE_URL` | Worker secret |
| `SUPABASE_SERVICE_ROLE_KEY` | Worker secret |
| `TELEGRAM_BOT_TOKEN` | Worker secret |
| `TELEGRAM_CHAT_ID` | Worker secret |
| `TELEGRAM_TOPIC_ID` | Worker secret |
| `STUDIO_BASE_URL` | Non-secret Worker variable, `https://sathian.ai` |

The Turnstile secret belongs only in the managed siteverify Worker. The Telegram token and destination identifiers belong only in the delivery Worker. Neither belongs in a `NEXT_PUBLIC_` variable, Supabase row, log, or receipt.

## Exact activation order

Each numbered phase has a stop point. Do not collapse them into one deploy.

### Phase 0 — approval, identity, and rollback receipt

Before changing a live system:

1. Sathian approves the staged activation.
2. Confirm the existing Supabase project and existing Auth email to use for Studio.
3. Confirm the private Telegram test chat/topic and whether a new minimum-permission bot may be created or added.
4. Confirm Turnstile domains: `localhost`, `127.0.0.1`, `sathian.ai`, and `www.sathian.ai`.
5. Record the current Vercel deployment ID above and the final candidate commit.
6. Confirm a current database backup or point-in-time recovery position.

**Stop if:** the project/account is ambiguous, the Auth user does not already exist, the backup is unavailable, or the candidate branch is not clean and freshly verified.

### Phase 1 — remote database preflight and additive migration

1. Link the repository to the confirmed Supabase project.
2. Run the remote/local migration comparison.
3. Run a dry-run push and confirm only the reviewed pending versions are listed.
4. Apply the pending additive migrations in timestamp order.
5. Verify RLS, service-only RPC grants, the private quarantine bucket, and the two durable rate-limit functions.
6. Run the reviewed public-memory seed script and inspect the exact cards before insertion.
7. Leave `PUBLIC_AGENT_ENABLED=false` and both file flags false.

**Stop if:** history diverges, any policy grants anonymous private-table access, the quarantine bucket is public, or the seed contains private/unreviewed material.

**Rollback posture:** do not drop the additive tables during an incident. Keep the feature flags off and prepare a forward repair migration if needed.

### Phase 2 — existing Studio operator, magic link, and TOTP

1. Confirm Supabase email Auth and TOTP are enabled.
2. Confirm the chosen user already exists; the application has `shouldCreateUser: false`.
3. Set `app_metadata.role=studio_admin` for that existing user.
4. Set `STUDIO_ALLOWED_EMAILS` and `STUDIO_PUBLIC_ORIGIN`.
5. Prove an unknown email receives the same non-enumerating response but no account.
6. Prove the approved account at AAL1 is redirected to MFA.
7. Sathian enrolls TOTP and proves AAL2 reaches Studio and its APIs.

**Stop if:** a new account is created, a redirect can leave the approved origin, AAL1 reaches Studio data, or the database and application disagree on the role.

### Phase 3 — Turnstile for file intake

Follow the managed Turnstile Spin flow with its own confirmations:

1. Probe Cloudflare token scope and select the exact account.
2. Confirm the four hostnames above.
3. Create one managed widget.
4. Deploy the stock managed siteverify Worker in the same account.
5. Put the Turnstile secret into that Worker only.
6. Set the public site key, Worker URL, and allowed hostnames in the protected preview.
7. Validate `data-action="turnstile-spin-v1"`, hostname checks, success, expiry, and failure.
8. Keep both file flags false until Phase 5.

**Stop if:** scopes are insufficient, the account differs, hostname validation fails, the secret appears on disk/in chat, or siteverify is called directly from the browser.

### Phase 4 — Telegram private-topic proof

1. Create or add the minimum-permission bot only after approval.
2. Point all Worker secrets at the private test chat/topic.
3. Deploy `sathian-ai-telegram-delivery` with its one-minute cron.
4. Generate one synthetic intake through the protected preview.
5. Confirm one Telegram message contains only a short preview, receipt context, and cleared metadata.
6. Confirm the outbox item becomes delivered.
7. Re-run the worker and confirm the same idempotency key does not post again.
8. Keep the destination on the private test topic until Sathian approves the final group/topic.

**Stop if:** the message posts twice, bytes/object paths/secrets appear, retries loop, or the wrong chat/topic receives anything.

### Phase 5 — protected Vercel preview

1. Add branch-scoped preview variables without printing values.
2. Keep production variables unchanged.
3. Deploy the exact candidate commit to a protected preview.
4. Set `PUBLIC_AGENT_ENABLED=true` in preview only.
5. Verify ordinary answers, unknown-answer behavior, hard denies, notes, opaque receipts, and Telegram delivery.
6. Set both file flags true in preview, rebuild, upload one benign small text file, and confirm private quarantine.
7. Prove an executable/mismatched file is blocked.
8. Verify Studio unknown-email, AAL1, and AAL2 behavior.

**Stop if:** the preview is publicly exposed without protection, a secret appears client-side, private memory leaks, receipt creation is not atomic, or any required test fails.

### Phase 6 — atomic production release

1. Copy only the reviewed values into Production scope.
2. Keep the classifier disabled.
3. Set the master agent flag and file flags only after the protected preview passes.
4. Build and deploy the exact verified commit.
5. Confirm the production aliases remain on the intended Vercel project.
6. Run the post-activation matrix below immediately.
7. Observe model errors, delivery backlog, blocked uploads, and Vercel runtime errors for the first hour.

**Stop and roll back if:** homepage navigation breaks, the legacy endpoint is not 410, the agent fails closed incorrectly, hard-deny prompts reach the model, receipts duplicate, Telegram misroutes, AAL1 reaches Studio, or file quarantine is not private.

### Phase 7 — later, separate approval

After real traffic exists:

- review a real AAL2 retention dry-run report;
- decide whether to wire the destructive cleanup adapter and schedule;
- decide whether to repoint Telegram from the private test topic;
- review and publish the TFN essay to Substack;
- run the separate Notion-export classification and second-brain ingestion plan.

None of these is implied by the website activation approval.

## Post-activation verification matrix

| Surface | Proof | Expected |
| --- | --- | --- |
| Production identity | Vercel inspect + homepage | Intended commit and “Proof of work, in public” |
| Legacy chat | `POST /api/chat` with an empty safe request | HTTP 410; no model or Telegram call |
| Master gate | Temporarily verified in protected preview | Off returns 503 before storage/model |
| Public memory | Ask a known and unknown biographical question | Reviewed sources only; honest unknown |
| Privacy boundary | Secret/family/client/filesystem prompts | 403; no model, persistence, or tools |
| Durable message limit | Controlled test visitor | Attempts 1–30 allowed; 31 rejected in window |
| Intake | Leave one synthetic note | One opaque `SA-` receipt and one outbox row |
| Telegram | Run delivery twice | One post only; delivered state visible |
| Studio unknown user | Request magic link | Same public response; no account creation |
| Studio AAL1 | Approved magic link before TOTP | Redirect to MFA |
| Studio AAL2 | Complete TOTP | Studio and APIs available |
| File allowed | Small benign TXT/PDF/image | One generated private object, quarantined |
| File blocked | Executable/mismatch/archive | Rejected, not rendered or forwarded |
| Quarantine | Anonymous/browser list/read | Denied; bucket remains private |
| Observability | Studio operations + logs | Counts/reason codes only; no message content |
| Retention | AAL2 dry run | Counts/IDs only; zero deletion and zero audit write |

## Rollback order

1. Roll Vercel back to deployment `dpl_9fz7eufZGkZPmF3559gtN1z9N3VR` or the newly recorded immediate predecessor.
2. Keep `PUBLIC_AGENT_ENABLED=false` in the next build if the site code remains deployed.
3. Set both file flags false to stop uploads while preserving text intake when appropriate.
4. Leave the Telegram Worker pointed at the private test topic; with the site gate off it receives no new outbox rows.
5. If delivery itself is unsafe, remove the cron in a reviewed Worker deployment. Do not delete the Worker or credentials impulsively.
6. Remove the Studio allowlist/role only if the authentication boundary is uncertain.
7. Do not drop the additive database tables during incident response. Preserve content-minimized audit records and repair forward.

## Known launch limitations

- File checks are strict byte/type quarantine, not a full malware scanner. File contents are not opened, rendered, summarized, embedded, modeled, or forwarded.
- The answer model is provider-specific at launch, though the adapter remains replaceable and OpenRouter evaluation is deferred.
- Public memory is a reviewed projection, not the live second brain.
- The retention execution adapter and schedule are intentionally absent.
- The protected preview will need approved access to the real Supabase project unless a separate staging project is created.
- Existing local build output can include non-fatal `revalidateTag` IPC URL noise after a successful build; treat any new production runtime error separately.

## Visual receipts

- Homepage: `C:\Users\sathi\Projects\_ops\reskin-previews\2026-07-14\batch2-home-desktop.png`
- Mobile homepage: `C:\Users\sathi\Projects\_ops\reskin-previews\2026-07-14\batch2-home-mobile.png`
- TFN article: `C:\Users\sathi\Projects\_ops\reskin-previews\2026-07-14\batch2-article-desktop.png`
- Agent chat: `C:\Users\sathi\Projects\_ops\reskin-previews\2026-07-14\batch1-chat-desktop.png`
- File intake: `C:\Users\sathi\.codex\visualizations\2026\07\14\019f6046-338b-7f51-8e7c-0cb229456440\agent-file-intake-desktop.png`
- Studio operations: `C:\Users\sathi\.codex\visualizations\2026\07\14\019f6046-338b-7f51-8e7c-0cb229456440\studio-agent-operations-desktop.png`

## Fresh final verification

Completed on 2026-07-14 against candidate commit `fc07969`, before the later rate-limit and OpenAI provider changes:

- 189 unit tests passed across 26 files;
- 27 legacy launch/readiness checks passed;
- application TypeScript passed;
- Telegram Worker type generation and TypeScript passed;
- Telegram Worker deployment dry-run passed at 10.77 KiB upload / 3.48 KiB gzip;
- the Next.js production build compiled, typechecked, and generated all 143 static pages plus dynamic routes;
- 6 production-server agent checks passed across desktop and mobile Chrome;
- 10 Studio checks passed across desktop and mobile Chrome;
- a focused 42-test release proof passed forged-cookie rejection, reviewed public-memory filtering, Telegram idempotency, and blocked-file policy;
- the isolated Supabase replay applied all 8 migrations, exposed all 12 expected tables, kept quarantine private, and rejected message attempt 31;
- `git diff --check` passed.

The build used the existing approved sibling environment source in memory because the clean worktree intentionally has no local secrets. No value was copied or printed. A no-environment build fails during collection of an existing Studio route with `supabaseUrl is required`, so complete Supabase configuration is a hard deployment prerequisite.

Expected non-blocking local warnings:

- stale Browserslist data;
- pure-JavaScript bigint bindings;
- the existing post-build `revalidateTag` IPC URL noise after the successful build exit.

Fresh 2026-07-15 local proof for the OpenAI provider change:

- the focused provider-selection test was observed failing against the Anthropic implementation, then passing after the OpenAI change;
- all 190 unit tests passed across 26 files;
- application TypeScript passed;
- the production build compiled, typechecked, and generated all 143 static pages;
- `git diff --check` passed, with line-ending notices only.

Protected-preview answer/privacy verification is still required before production activation.
