# Sathian.ai Daily Front-Door Report Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add optional contact capture, a content-free site-agent funnel, standardized private Telegram alerts, and an 8:00 AM Toronto daily Telegram digest to the proven `sathian.ai` intake system.

**Architecture:** Keep marketing measurement in the separate Vercel/GA4 tracker owned by the website-reporting task. This change records only the operational site-agent funnel in Supabase `audit_events`, extends the existing intake claim contract with contact metadata, and uses the existing private Cloudflare Telegram Worker for immediate alerts and a rolling 24-hour digest. The database remains the system of record; Telegram remains a private alert surface.

**Tech Stack:** Next.js 14, React, TypeScript, Vitest, Supabase/Postgres, Cloudflare Workers, Wrangler, Telegram Bot API.

---

### Task 1: Define the content-free funnel contract

**Files:**
- Modify: `tests/unit/agent-observability.test.ts`
- Modify: `src/lib/agent/observability.ts`
- Create: `tests/unit/agent-event-route.test.ts`
- Create: `src/lib/agent/event-handler.ts`
- Create: `src/app/api/agent/event/route.ts`

**Steps:**
1. Write failing tests for allowlisted `site_session_started` and `agent_widget_viewed` events containing only session UUID, page path and source.
2. Add tests proving arbitrary event names, message text and malformed session IDs are rejected.
3. Run the focused tests and confirm they fail because the event handler does not exist.
4. Implement the minimal validation and service-only audit insertion route with same-origin checks, no-store responses and a strict rate limit.
5. Run the focused tests and confirm they pass.

### Task 2: Add optional contact capture without changing the visual baseline

**Files:**
- Modify: `tests/unit/agent-message-route.test.ts`
- Create: `tests/unit/chat-widget-contact.test.ts`
- Modify: `src/lib/agent/message-handler.ts`
- Modify: `src/components/ChatWidget.tsx`

**Steps:**
1. Write failing route tests for trimmed optional name, normalized valid reply email and rejection of malformed supplied email.
2. Write a source-contract test requiring the widget's optional reply fields, clear consent copy and content-free funnel calls.
3. Run the focused tests and confirm the expected failures.
4. Add a compact disclosure control: `Want a reply? Add your name and email.` Keep both fields optional and preserve the approved panel composition.
5. Send `displayName` and `replyEmail` only when supplied; emit one session-start event and one widget-view event per browser session.
6. Run the focused tests and confirm they pass.

### Task 3: Standardize the immediate Telegram intake alert

**Files:**
- Modify: `tests/unit/telegram-payload.test.ts`
- Modify: `tests/unit/telegram-delivery.test.ts`
- Modify: `src/lib/agent/telegram-payload.ts`
- Modify: `workers/telegram-delivery/src/delivery.ts`
- Modify: `workers/telegram-delivery/src/index.ts`
- Create: `supabase/migrations/<generated>_agent_contact_and_daily_report.sql`

**Steps:**
1. Create the migration shell with `supabase migration new agent_contact_and_daily_report` after checking CLI help/version.
2. Write failing payload and delivery tests for alert title, receipt, page, intake kind, contact name/email, preview and Studio link.
3. Run the focused tests and confirm the existing alert contract fails them.
4. Extend the service-only delivery claim RPC to return `kind`, `display_name` and `reply_email`; retain RLS and revoke public/authenticated execution.
5. Extend TypeScript claim validation and Telegram formatting. Escape all contact data as untrusted HTML.
6. Run the focused tests and migration contract tests.

### Task 4: Build the 8:00 AM Toronto daily digest

**Files:**
- Create: `tests/unit/telegram-daily-report.test.ts`
- Create: `workers/telegram-delivery/src/daily-report.ts`
- Modify: `workers/telegram-delivery/src/index.ts`
- Modify: `workers/telegram-delivery/wrangler.jsonc`
- Modify: `workers/telegram-delivery/README.md`
- Modify: `supabase/migrations/<generated>_agent_contact_and_daily_report.sql`

**Steps:**
1. Write failing tests for the digest format and the two UTC cron triggers that resolve to 8:00 AM in Toronto across daylight and standard time.
2. Add a service-only aggregate RPC for the previous rolling 24 hours: site sessions, widget views, completed turns, intakes, contactable intakes, Telegram deliveries/failures, backlog and model errors.
3. Implement the daily Worker path using `ScheduledController.cron`; retain the minute delivery path unchanged.
4. Add `0 12 * * *` and `0 13 * * *`; send only when the scheduled instant formats to hour `08` in `America/Toronto`.
5. Run Worker type generation/checks and the focused tests.

### Task 5: Verify the complete local and preview path

**Files:**
- Modify: `docs/plans/2026-07-18-sathian-ai-daily-front-door-report.md` only if verification reveals a necessary plan correction.
- Create: `C:/Users/sathi/Projects/_ops/SATHIAN-AI-DAILY-FRONT-DOOR-PREVIEW-RECEIPT-2026-07-18.md`

**Steps:**
1. Run all unit tests, TypeScript, the Next.js production build and Worker checks.
2. Run database migration contract tests and Supabase security/performance advisors before any live schema change.
3. Create a protected Preview deployment without overwriting production.
4. Exercise desktop and mobile: session event, widget view, optional contact, synthetic note receipt and immediate Telegram alert.
5. Trigger the daily report handler with synthetic metrics and confirm that no chat content appears in the digest.
6. Record screenshots, test output, deployment identifiers and any remaining production gates in the receipt.
7. Stop before production Vercel deployment, production Supabase migration or live Worker replacement unless Sathian separately approves that release gate.
