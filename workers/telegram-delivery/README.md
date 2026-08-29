# Telegram delivery worker

This Cloudflare Worker delivers the site agent's durable Supabase outbox to one private Telegram topic. It has no public HTTP route. A UTC cron trigger claims up to ten ready rows once per minute, sends a standardized intake alert and Studio link, and records success, retry, or dead-letter state.

Two additional UTC triggers provide one private daily report at 8:00 AM Toronto time. Both 12:00 and 13:00 UTC are configured so daylight-saving changes are handled safely; the Worker sends only when the scheduled instant is actually in Toronto's 08 hour. The report combines the rolling 24-hour operational funnel with a compact, read-only GA4 scorecard for the current 7 complete days, previous 7 complete days, and current 28 complete days. It reports GA4 active users, sessions, engaged sessions, week-over-week change, meaningful agent notes, source, and landing page. Every GA4 query is restricted to hostname `sathian.ai`. It contains no chat content or contact details. If GA4 is temporarily unavailable, the operational report still sends and labels only the reach section unavailable.

## Security boundary

- `TELEGRAM_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` are Cloudflare Worker secrets. They never enter Vercel client variables, browser code, Supabase rows, or logs.
- Immediate alerts send message text, optional contact details, page context, a public receipt, and byte-cleared attachment metadata (safe filename, detected type, and size) to the approved private topic. They never send attachment bytes or private object paths.
- Daily reports use only aggregate counts returned by the service-only `agent_get_daily_report` function.
- GA4 access is read-only and restricted at runtime to the Sathian.ai property and the exact production hostname. The report requests only aggregate active users, sessions, engaged sessions, the exact `agent_note_sent` event count, source/medium, and landing-page paths. It labels active users as estimates rather than verified people and does not infer a human/bot percentage.
- Tooth Fairy Network and Homeland property IDs are not configured in this Worker.
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
# Telegram delivery Worker in the canonical Sathian.ai worktree

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release\workers\telegram-delivery"

# Commands:
npm install
npm run check
```

Unit tests run from the site repository root and use injected fake Supabase and Telegram adapters. They do not need credentials or send messages.

## Release boundary

The minute delivery path, daily aggregate report, private destination, and required Supabase contract are already live. Future Worker changes require focused unit tests, `npm run check`, a Wrangler dry run, explicit production approval, deployment from the canonical worktree, and a post-deploy schedule/secret-name/log check. Never print secret values or send a synthetic visitor message unless that exact live proof is separately approved.
