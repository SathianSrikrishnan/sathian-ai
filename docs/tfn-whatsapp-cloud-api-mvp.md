# TFN WhatsApp Cloud API MVP

Date: 2026-06-11

## What This Adds

This branch adds the first WhatsApp lead hook for Tooth Fairy Network:

- `GET /api/whatsapp/webhook` verifies the webhook with Meta.
- `POST /api/whatsapp/webhook` receives WhatsApp webhook events.
- Supabase stores raw webhook payloads, normalized contacts, and normalized messages.
- A conservative acknowledgement reply is available, but it is off unless explicitly enabled.

## What To Put Into Meta

After this branch is deployed to Vercel, use these values on the Meta WhatsApp Business Cloud API Configuration screen:

- Callback URL: `https://toothfairy.network/api/whatsapp/webhook`
- Verify token: the exact value stored in Vercel as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

Meta does not generate the Callback URL or Verify token. We choose the Verify token, store it in Vercel, then paste the same value into Meta.

Leave "Attach a client certificate" off for the first MVP.

## Vercel Environment Variables

Required for webhook verification:

- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

Required for storing leads/messages:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Recommended for webhook signature verification:

- `WHATSAPP_APP_SECRET`

Required only if the acknowledgement reply is enabled:

- `WHATSAPP_AUTO_ACK_ENABLED=true`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

Optional:

- `WHATSAPP_GRAPH_API_VERSION`, default `v23.0`
- `WHATSAPP_ACK_MESSAGE`
- `TFN_WHATSAPP_BRAND`, default `toothfairy_network`

Security rule: do not paste access tokens, app secrets, service role keys, or permanent tokens into chat. Store them directly in Vercel, Supabase, Cloudflare, or Meta.

## Supabase Migration

Run `supabase/migrations/20260611_tfn_whatsapp_leads.sql` before expecting live messages to store.

It creates:

- `tfn_webhook_events`: raw Meta webhook payloads.
- `tfn_channel_contacts`: one row per WhatsApp sender/contact.
- `tfn_channel_messages`: inbound messages and message status events.

Row-level security is enabled. The server writes with the Supabase service role key.

## First Test

1. Deploy this branch to a Vercel preview or production after the active site sweep is ready.
2. Add the required Vercel environment variables.
3. Run the Supabase migration.
4. In Meta, paste the Callback URL and Verify token.
5. Click "Verify and save".
6. Subscribe to WhatsApp `messages` webhook events.
7. Send a message to the test or production WhatsApp number.
8. Confirm a row appears in `tfn_webhook_events` and `tfn_channel_messages`.

Keep `WHATSAPP_AUTO_ACK_ENABLED` unset or `false` until the receive/store path is verified.
