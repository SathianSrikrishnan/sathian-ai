# Colosseum Final Cleanup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution. Use subagent-driven development only if the user explicitly asks for parallel agents. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a safe, inspectable report of every live Tooth Fairy Network test record across Solana and Supabase, reset selected personal Magic Studio credits, clean only explicitly chosen off-chain test data, and finish the parent/technical copy sweep before external friend review.

**Architecture:** Treat this as a two-stage cleanup: first read-only reporting, then opt-in mutations. The Colosseum-ready source of truth is the `sathian-ai` repo; the Tooth Fairy Network site is the `/toothfairy` product surface inside it and still deploys under the broader Sathian site/project setup. On-chain ledger/cNFT history is never deleted. Supabase rows, storage objects, and AI credit balances may be reset only from an explicit allowlist.

**Tech Stack:** Next.js 14 app in `tfnv2/repos/sathian-ai`, Supabase, Solana Web3/Anchor, existing escrow IDL, Node scripts run with `.env.local`.

---

## Source Of Truth

Active app repo:
`C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai`

Product surface in that repo:
`src/app/toothfairy`, `src/components/toothfairy`, `src/lib/toothfairy`, `src/data/stories`

Smart contract repo:
`C:\Users\sathi\Documents\New project 2\tfnv2\repos\toothfairy-contracts`

Production escrow program:
`FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`

Important existing files:
- `src/app/api/toothfairy/escrow-viewer/route.ts` already reads on-chain profiles, deposits, treasury, and config.
- `src/app/toothfairy/admin/escrow-viewer/page.tsx` already displays the on-chain viewer.
- `src/app/api/toothfairy/mint/route.ts` creates cNFTs, child profiles, milestones, `tfn_children`, and `tfn_tooth_stories`.
- `supabase/migrations/20260325_tfn_children.sql` defines `tfn_children`.
- `supabase/migrations/20260413_add_tooth_story.sql` defines `tfn_tooth_stories`.
- `supabase/migrations/20260506_tfn_magic_studio.sql` defines `tfn_magic_credits`, `tfn_magic_generations`, and credit RPCs.
- `src/lib/toothfairy/magic-credits.ts` also has a fallback credit store in Supabase auth app metadata.
- `src/lib/toothfairy/magic-studio.ts` sets `STARTER_MAGIC_CREDITS = 3`.
- `src/app/toothfairy/faq/page.tsx` and `src/app/toothfairy/architecture/page.tsx` are the parent and technical pages needing copy polish.
- `tests/launch-readiness.test.mjs` locks in a lot of parent-facing wording, so copy edits must update tests.

Local env status:
- `sathian-ai/.env.local` has the needed app-side keys, including Supabase, Solana RPC, FAL, Resend, `TFN_MINT_SECRET_KEY`, and `TFN_MERKLE_TREE`.
- `toothfairy-contracts` only has `.env.example`; contract cleanup scripts need either local env setup or app-side env reuse.

## Safety Rules

- [ ] Default every cleanup script to dry-run.
- [ ] Never delete, close, claim, refund, early-withdraw, or transfer anything on-chain without an explicit `--apply` plus a row-level target.
- [ ] Never print private keys, service role keys, OAuth secrets, or wallet seed material.
- [ ] Keep the first report immutable: save it before any cleanup, then save an after-cleanup report.
- [ ] Keep cNFT and ledger history intact. Cleanup can remove dashboard clutter by deleting/offboarding Supabase rows, but the on-chain record remains public.
- [ ] Reset Magic Studio credits by email allowlist only.

---

## Phase 1: Build The Read-Only Cleanup Report

**Files:**
- Create: `scripts/tfn-cleanup-report.mjs`
- Create output directory on demand: `docs/reports/`
- Read: `src/lib/toothfairy/escrow-idl.json`
- Read: `supabase/migrations/*.sql`

- [ ] **Step 1: Create the read-only report script**

The script should load `.env.local`, create a Supabase admin client, create a read-only Anchor program, and fetch:
- Solana `childProfile.all()`
- Solana `milestone.all()`
- Solana `deposit.all()`
- Solana `treasury.all()`
- Solana `config.all()`
- Supabase `tfn_children`
- Supabase `tfn_tooth_stories`
- Supabase `tfn_magic_credits`
- Supabase `tfn_magic_generations`
- Supabase `tooth_states` if present
- Optional storage listing under `tfn-photos`

- [ ] **Step 2: Add reconciliation rules**

Classify rows into:
- `ledger-live`: on-chain profile/milestone/deposit exists.
- `dashboard-live`: Supabase row exists and points at an on-chain profile.
- `db-only`: Supabase row exists but the referenced profile/milestone is missing or invalid.
- `chain-only`: on-chain row exists but no Supabase child/story record points to it.
- `credit-empty`: account has `remaining_credits = 0`.
- `credit-reserved`: account has stuck `reserved_credits > 0`.
- `safe-hide-candidate`: Supabase-only or dashboard-only row that can be removed from the app without touching chain.
- `manual-chain-review`: any unclaimed deposit with nonzero SOL.

- [ ] **Step 3: Include suggested actions, not automatic actions**

For each on-chain deposit:
- `claimed`: eligible for later rent-close review.
- `refundable`: original depositor may refund within 7 days.
- `matured`: guardian may claim to child wallet.
- `active`: time-locked; leave unless intentionally early-withdrawing.
- `unfunded/fake`: no SOL attached; candidate for dashboard hide if only Supabase clutter.

For each Supabase row:
- `keep`: real demo or desired memory.
- `hide-dashboard`: delete `tfn_children` and linked `tfn_tooth_stories`, leaving ledger/cNFT untouched.
- `delete-db-only`: remove rows that never made it on-chain.
- `review-photo`: storage object is reachable but dashboard row will be deleted.

- [ ] **Step 4: Output human and machine files**

Run:

```powershell
cd "C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai"
node --env-file=.env.local scripts/tfn-cleanup-report.mjs --out docs/reports/tfn-cleanup-2026-05-11
```

Expected output:
- `docs/reports/tfn-cleanup-2026-05-11.md`
- `docs/reports/tfn-cleanup-2026-05-11.deposits.csv`
- `docs/reports/tfn-cleanup-2026-05-11.children.csv`
- `docs/reports/tfn-cleanup-2026-05-11.credits.csv`
- `docs/reports/tfn-cleanup-2026-05-11.actions.json`

---

## Phase 2: Reset Personal Magic Studio Credits

**Files:**
- Create: `scripts/tfn-reset-magic-credits.mjs`
- Read: `src/lib/toothfairy/magic-credits.ts`
- Read: `src/lib/toothfairy/magic-studio.ts`
- Test: `tests/magic-studio.test.mjs`

- [ ] **Step 1: Create the credit reset script**

Inputs:
- `--emails path/to/emails.txt` or repeated `--email name@example.com`
- `--credits 3`
- dry-run default
- `--apply` required for mutation
- optional `--clear-generations` for test-only accounts

Behavior:
- Find matching users in `tfn_magic_credits.user_email`.
- Also inspect Supabase auth users by email because `magic-credits.ts` can fall back to `auth.users.app_metadata.tfn_magic_credits`.
- Reset selected accounts to:

```sql
lifetime_credits = 3
remaining_credits = 3
reserved_credits = 0
used_credits = 0
updated_at = now()
```

- If fallback metadata exists, set:

```json
{
  "tfn_magic_credits": {
    "lifetimeCredits": 3,
    "remainingCredits": 3,
    "reservedCredits": 0,
    "usedCredits": 0
  }
}
```

- [ ] **Step 2: Run dry-run first**

```powershell
node --env-file=.env.local scripts/tfn-reset-magic-credits.mjs --emails .codex-temp/tfn-credit-reset-emails.txt
```

Expected:
- Shows each matched email, user id, current credit state, next credit state.
- Shows unmatched emails separately.
- No database writes.

- [ ] **Step 3: Apply only after reviewing the dry-run**

```powershell
node --env-file=.env.local scripts/tfn-reset-magic-credits.mjs --emails .codex-temp/tfn-credit-reset-emails.txt --apply
```

- [ ] **Step 4: Verify credits from the app route**

Use one reset Gmail account:
- Sign in with Google.
- Open `/toothfairy/app/draw/preview`.
- Confirm it displays 3 starter credits.
- Generate one AI polish result.
- Confirm the UI drops to 2 credits.
- Confirm a provider failure refunds the reserved credit.

---

## Phase 3: Clean Supabase Dashboard Clutter

**Files:**
- Create: `scripts/tfn-clean-test-data.mjs`
- Consume: `docs/reports/tfn-cleanup-2026-05-11.actions.json`
- Output: `docs/reports/tfn-cleanup-2026-05-11-cleanup-applied.md`

- [ ] **Step 1: Create the off-chain cleanup script**

Inputs:
- `--actions docs/reports/tfn-cleanup-2026-05-11.actions.json`
- `--emails .codex-temp/tfn-cleanup-emails.txt`
- `--slugs .codex-temp/tfn-cleanup-slugs.txt`
- dry-run default
- `--apply` required

Allowed mutations:
- Delete selected `tfn_tooth_stories` rows by `milestone_pda`, `child_profile_pda`, or `user_id`.
- Delete selected `tfn_children` rows by `id`, `child_slug`, or `user_id`.
- Delete selected `tooth_states` rows if they are tied to known test child names.
- Optionally remove selected `tfn-photos` storage objects after listing them.

Not allowed in this script:
- No auth user deletion.
- No on-chain transactions.
- No broad table truncation.

- [ ] **Step 2: Dry-run selected dashboard cleanup**

```powershell
node --env-file=.env.local scripts/tfn-clean-test-data.mjs --actions docs/reports/tfn-cleanup-2026-05-11.actions.json --emails .codex-temp/tfn-cleanup-emails.txt
```

- [ ] **Step 3: Apply after row review**

```powershell
node --env-file=.env.local scripts/tfn-clean-test-data.mjs --actions docs/reports/tfn-cleanup-2026-05-11.actions.json --emails .codex-temp/tfn-cleanup-emails.txt --apply
```

- [ ] **Step 4: Re-run report**

```powershell
node --env-file=.env.local scripts/tfn-cleanup-report.mjs --out docs/reports/tfn-cleanup-2026-05-11-after
```

Expected:
- Dashboard rows for selected test accounts are gone.
- On-chain deposit/profile counts remain unchanged.
- Credit rows show reset balances for selected personal emails.

---

## Phase 4: On-Chain Review And Loose SOL Recovery

**Files:**
- Use report from Phase 1.
- Optional later create: `scripts/tfn-onchain-action.mjs`
- Contract reference: `../toothfairy-contracts/programs/toothfairy-escrow/src/lib.rs`

- [ ] **Step 1: Review nonzero unclaimed deposits**

From the report, manually inspect each `manual-chain-review` row:
- deposit PDA
- milestone PDA
- child profile PDA
- guardian
- depositor
- amount SOL
- status
- created date
- lock/maturity
- recommended action

- [ ] **Step 2: Decide row-level action**

Use contract rules:
- `refundable`: original depositor can refund inside the 7-day grace window.
- `matured` or immediate: guardian can claim to the child wallet.
- `active`: leave alone unless the guardian intentionally early-withdraws and accepts the 10% penalty.
- `claimed/refunded`: can later close deposit accounts to reclaim rent.
- empty profiles/milestones: can close only when contract constraints allow it.

- [ ] **Step 3: Do not batch chain mutations tonight**

The first pass should stop at the report unless the row clearly contains personal test SOL and the required signing wallet is available. Chain cleanup is where mistakes are expensive.

---

## Phase 5: Tighten AI Filters And Credit Tests

**Files:**
- Modify: `src/app/api/toothfairy/enhance/route.ts`
- Modify if needed: `src/lib/toothfairy/magic-studio.ts`
- Modify if needed: `src/lib/toothfairy/ai-enhance.ts`
- Test: `tests/magic-studio.test.mjs`
- Test: `tests/magic-mint-image.test.mjs`
- Test: `tests/launch-readiness.test.mjs`

- [ ] **Step 1: Review current filter behavior**

Current behavior already includes:
- Google-auth required for credits.
- 10 AI calls per hour per IP.
- data URL validation.
- max image size guard.
- allowed tradition set.
- allowed charm set.
- allowed style set.
- credit reservation before provider call.
- credit refund on provider failure.
- moderation/provider/timeout-specific fallback responses.

- [ ] **Step 2: Add tests for failure accounting**

Cover:
- unauthenticated request returns `auth_required` without reserving credit.
- no credits returns `no_credits`.
- invalid drawing data returns `invalid_input`.
- invalid style falls back to default style.
- provider failure after reservation calls refund path.
- successful generation spends exactly one credit.

- [ ] **Step 3: Keep friend-test behavior simple**

Expected tester account behavior:
- first Gmail sign-in creates/reads a 3-credit account.
- each successful AI polish spends 1 credit.
- failed provider calls do not burn a credit.
- UI clearly offers original drawing fallback.

---

## Phase 6: Parent FAQ And Technical Page Copy Sweep

**Files:**
- Modify: `src/app/toothfairy/faq/page.tsx`
- Modify: `src/app/toothfairy/architecture/page.tsx`
- Likely leave unused: `src/components/toothfairy/technical-content.tsx`
- Update: `tests/launch-readiness.test.mjs`

- [ ] **Step 1: Rewrite FAQ around parent decisions and crypto translation**

Keep the tests' safety intent, but make the copy more human:
- What is this?
- What happens tonight when a tooth is lost?
- What does my child see?
- What do I control?
- How do I get back in?
- What is the Smile Fund?
- Are card gifts live?
- What happens with AI polish?
- What child data is used?
- What is not ready yet?
- Is this financial advice?

The FAQ is the one parent-facing place that may translate technical terms directly:
- `blockchain`
- `smart contract`
- `self-sovereignty`
- `crypto wallet`

Use those terms only when explaining them in calm parent language. The FAQ should also explain the ideology: permanence, ownership, learning together, family activity, and independent financial rails with parent control. Other parent pages should continue to keep these terms quiet.

- [ ] **Step 2: Rewrite architecture page for judges/builders**

Keep it technical enough for Colosseum, but clean:
- Product layer: parent account, Toothlight memory, shareable keepsake.
- Data layer: Supabase for recovery/story/profile support.
- Asset layer: cNFT plus durable metadata/image URL.
- Escrow layer: Anchor program, multi-depositor deposits, time locks, refund/claim rules.
- Launch truth: card gifts gated; wallet gifts controlled-test only; health route before demo.

- [ ] **Step 3: Run copy-safety tests**

```powershell
node tests/launch-readiness.test.mjs
```

Expected:
- Existing parent-safety assertions either still pass or are intentionally updated to match better copy.

---

## Phase 7: Friend Review Packet

**Files:**
- Create: `docs/launch-readiness/2026-05-11-friend-review-packet.md`

- [ ] **Step 1: Create a short tester checklist**

Include:
- Best URL to start.
- Use a real Gmail account.
- Create a Toothlight memory.
- Try one AI polish result.
- Use original drawing fallback.
- Save the memory.
- Open dashboard with Google.
- Open the public keepsake link.
- Optional: inspect gift page, but do not send real money unless explicitly invited.
- Report issues with screenshot, device, browser, and rough step.

- [ ] **Step 2: Add reviewer boundaries**

Say clearly:
- card gifts are paused.
- wallet gift path is controlled testing.
- they should not add real SOL unless you explicitly ask.
- the goal is emotional clarity, friction, mobile bugs, and trust questions.

---

## Final Verification Gate

Run from `sathian-ai`:

```powershell
node tests/magic-studio.test.mjs
node tests/magic-mint-image.test.mjs
node tests/launch-readiness.test.mjs
npm run build
```

Admin/live checks:
- `/api/toothfairy/health` with admin secret returns healthy or known warnings only.
- `/api/toothfairy/escrow-viewer` with admin secret returns current on-chain totals.
- One personal Gmail account shows 3 credits after reset.
- One test mint creates a keepsake and dashboard entry.
- Re-running the cleanup report after test shows only expected new rows.

## What Can Happen While Sathian Sleeps

Safe to do without further input:
- Implement read-only cleanup report.
- Implement dry-run reset script.
- Implement dry-run Supabase cleanup script.
- Rewrite FAQ/architecture drafts in code and update tests.
- Run local tests/build if dependencies are present.

Needs explicit row/email approval before applying:
- Resetting real Supabase credit balances.
- Deleting Supabase child/story/photo records.
- Any on-chain claim, refund, early withdrawal, close, or treasury withdrawal.
