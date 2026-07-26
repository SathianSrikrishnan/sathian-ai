# Telegram delivery worker

This Cloudflare Worker delivers the site agent's durable Supabase outbox to one private Telegram topic. It has no public HTTP route. A UTC cron trigger claims up to ten ready rows once per minute, sends a standardized intake alert and Studio link, and records success, retry, or dead-letter state.

Two additional UTC triggers provide one private daily report at 8:00 AM Toronto time. Both 12:00 and 13:00 UTC are configured so daylight-saving changes are handled safely; the Worker sends only when the scheduled instant is actually in Toronto's 08 hour. The report is a rolling 24-hour count of sessions, widget views, turns, intakes, reply-enabled requests, delivery health, backlog, and model errors. It contains no chat content or contact details.

## Security boundary

- `TELEGRAM_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` are Cloudflare Worker secrets. They never enter Vercel client variables, browser code, Supabase rows, or logs.
- Immediate alerts send message text, optional contact details, page context, a public receipt, and byte-cleared attachment metadata (safe filename, detected type, and size) to the approved private topic. They never send attachment bytes or private object paths.
- Daily reports use only aggregate counts returned by the service-only `agent_get_daily_report` function.
- Supabase functions are `SECURITY DEFINER`, revoked from public, anonymous, and authenticated roles, and granted only to `service_role`.
- Logs contain batch status counts only, not visitor content or credentials.

The intake claim is idempotent for normal retries: delivered and dead-letter rows cannot be claimed again, and concurrent claims use `FOR UPDATE SKIP LOCKED`. Telegram's Bot API does not accept a caller idempotency key, so a narrow ambiguity remains if Telegram accepts a message but the success write to Supabase fails. The stale lease will eventually retry and may produce a duplicate. The public receipt makes that rare case recognizable in the private topic.

Cloudflare recommends current compatibility dates, generated binding types, secret bindings, and awaited Promises. The worker follows those practices and keeps its cron in `wrangler.jsonc` as the configuration source of truth:

- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://developers.cloudflare.com/workers/configuration/cron-triggers/
- https://developers.cloudflare.com/workers/wrangler/configuration/

## Local verification

```powershell
# Source / context:
# Telegram delivery Worker in the Public Agent Portal worktree

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\public-agent-portal\workers\telegram-delivery"

# Commands:
npm install
npm run check
```

Unit tests run from the site repository root and use injected fake Supabase and Telegram adapters. They do not need credentials or send messages.

## Approval-gated changes

The minute delivery path and private topic are already live. Do not apply the contact/daily-report migration, replace the live Worker, or deploy the matching site changes until Sathian approves that release gate.

1. Apply `20260718133830_agent_contact_and_daily_report.sql` to production Supabase.
2. Deploy the matching Worker so its claim contract changes atomically with the database contract.
3. Deploy the matching sathian.ai application revision.
4. Send one synthetic contact request and verify its receipt, normalized reply email, private Telegram alert, and Studio row.
5. Invoke the daily path once with a controlled scheduled instant and verify that the private report contains counts only.
