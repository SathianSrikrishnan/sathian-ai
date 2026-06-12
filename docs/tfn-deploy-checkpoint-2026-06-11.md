# TFN Deploy Checkpoint

Date: 2026-06-11

## Integrated State

This workspace now includes the finished acquisition/readiness sweep plus the WhatsApp Cloud API lead hook.

Active app folder:

`C:\Users\sathi\Documents\New project 2\toothlight-v4-preview-clean`

WhatsApp branch source:

`C:\Users\sathi\Documents\New project 2\tfn-whatsapp-webhook-20260611`

## WhatsApp Lead Hook

Added:

- `GET /api/whatsapp/webhook` for Meta webhook verification.
- `POST /api/whatsapp/webhook` for WhatsApp webhook delivery.
- Supabase migration `supabase/migrations/20260611_tfn_whatsapp_leads.sql`.
- Setup guide `docs/tfn-whatsapp-cloud-api-mvp.md`.

Meta screen values after deployment:

- Callback URL: `https://toothfairy.network/api/whatsapp/webhook`
- Verify token: the private value stored in Vercel as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

Do not paste Meta access tokens, app secrets, permanent tokens, or Supabase service keys into chat.

## Verification Run

Focused tests passed:

- `node tests/tfn-whatsapp-webhook.test.mjs`
- `node tests/toothlight-v4-events.test.mjs`
- `node tests/tfn-reporting.test.mjs`
- `node tests/launch-readiness.test.mjs`
- `node tests/toothlight-v4-entry-page.test.mjs`
- `node tests/toothlight-v4-front-door.test.mjs`
- `node tests/toothlight-v4-post-save-loop.test.mjs`
- `node tests/toothlight-v4-stitch-flow.test.mjs`
- `node tests/toothlight-v4-polish-pass.test.mjs`

Build passed:

- `npm run build`

Local production smoke passed after clearing stale `.next` artifacts and rebuilding:

- `/`
- `/toothlight/start`
- `/toothfairy/privacy`
- `/toothfairy/terms`
- WhatsApp verify GET with valid token returned the challenge.
- WhatsApp verify GET with invalid token returned `403`.
- WhatsApp POST accepted a local test payload.

## Remaining Pre-Deploy Tasks

1. Run the Supabase migration:

   `supabase/migrations/20260611_tfn_whatsapp_leads.sql`

2. Set Vercel environment variables:

   - `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
   - `WHATSAPP_APP_SECRET`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - keep `WHATSAPP_AUTO_ACK_ENABLED` unset or `false` until inbound storage is verified

3. Deploy the app.

4. In Meta WhatsApp Cloud API Configuration, paste the Callback URL and Verify token, then click Verify and save.

5. Subscribe to WhatsApp `messages` events.

6. Send one WhatsApp test message and confirm rows appear in:

   - `tfn_webhook_events`
   - `tfn_channel_contacts`
   - `tfn_channel_messages`

7. Only after receive/store is verified, decide whether to enable the acknowledgement reply.
