# Telegram delivery worker

This Cloudflare Worker delivers the site agent's durable Supabase outbox to one private Telegram topic. It has no public HTTP route. A UTC cron trigger claims up to ten ready rows once per minute, sends a short preview and Studio link, and records success, retry, or dead-letter state.

## Security boundary

- `TELEGRAM_BOT_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` are Cloudflare Worker secrets. They never enter Vercel client variables, browser code, Supabase rows, or logs.
- The Worker sends message text, page context, a public receipt, and a quarantined-file count. It never sends attachment bytes or private object paths.
- Supabase functions are `SECURITY DEFINER`, revoked from public, anonymous, and authenticated roles, and granted only to `service_role`.
- Logs contain batch status counts only, not visitor content or credentials.

The database claim is idempotent for normal retries: delivered and dead-letter rows cannot be claimed again, and concurrent claims use `FOR UPDATE SKIP LOCKED`. Telegram's Bot API does not accept a caller idempotency key, so a narrow ambiguity remains if Telegram accepts a message but the success write to Supabase fails. The stale lease will eventually retry and may produce a duplicate. The public receipt makes that rare case recognizable in the private topic.

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

## Approval-gated activation

Do not run these steps until Sathian approves the bot, private test topic, secrets, migration, and Worker deployment:

1. Create a dedicated Telegram bot with no group-admin rights.
2. Add it only to a private test topic and record the chat/topic identifiers.
3. Apply the reviewed Supabase migration.
4. Put `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `TELEGRAM_TOPIC_ID` into the Worker secret store.
5. Run one idempotency test in the private topic before connecting the intended intake group.
6. Deploy the Worker and confirm its content-minimized delivery logs.
