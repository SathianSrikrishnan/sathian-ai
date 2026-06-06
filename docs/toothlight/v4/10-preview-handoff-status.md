# Toothlight V4 Preview Handoff Status

Date: 2026-06-06
Status: local-ready; public preview access not yet ready

## Current checkpoint

- Branch: `codex/toothlight-v4-creation-ux`
- Pull request: `https://github.com/SathianSrikrishnan/sathian-ai/pull/7`
- Latest checkpoint commit: `418a7fe4d9670caa1f20de237e75b3f4f4f7a586`
- Commit label: `Add v4 Toothlight style object checkpoint`

## Local test links

- Browser entry: `http://localhost:3000/toothlight`
- Browser make flow: `http://localhost:3000/toothlight/make`
- Phone entry on same Wi-Fi: `http://192.168.1.102:3000/toothlight`
- Phone make flow on same Wi-Fi: `http://192.168.1.102:3000/toothlight/make`

Generated flow routes:

- `/toothlight/t/[id]`
- `/toothlight/t/[id]/note?handoff=1`
- `/toothlight/t/[id]/family`

## Verification evidence

- `/toothlight/make` returned `200` locally after the dev server was restarted.
- Focused checks passed:
  - `toothlight-v4-light-styles`
  - `toothlight-v4-ai-variations`
  - `toothlight-v4-make`
  - `toothlight-v4-ux-simplification`
  - `toothlight-v4-first-50-plan`
- Full Toothlight V4 source tests passed before the checkpoint commit.
- `npm run build` completed successfully before the checkpoint commit. The build still printed existing unrelated warnings around bigint bindings, article cache URL parsing, and a dynamic Tooth Fairy API route.

## Preview gap

The known preview domain is not ready for public first-50 testing:

- `https://toothlight-preview.sathian.ai/toothlight` returned `401 Unauthorized`.
- `https://toothlight-preview.sathian.ai/toothlight/make` returned `401 Unauthorized`.
- GitHub PR #7 has no Vercel bot comment and no status checks attached to the latest commit.
- The Vercel connector returned `403 Forbidden` for the project scope, so deployment inspection requires Vercel re-authentication or a token with access to the `sathiansrikrishnans-projects` scope.

## Environment gates

Before external preview testing:

- Set a non-empty `TFN_ADMIN_SECRET`, `TOOTHFAIRY_ADMIN_SECRET`, or `CRON_SECRET` so `/api/toothlight/health` can be checked.
- Keep `TOOTHLIGHT_NOTE_ENCRYPTION_KEY` configured as a 32-byte base64 server value before note sealing is treated as production-ready.
- Enable `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true` only when `OPENAI_API_KEY` is present and recording transcription should be active.
- Keep MoonPay, Coinbase, Smile Fund funding, and smart-contract mainnet work out of the first-50 visitor flow.

## Next handoff action

Use local phone testing now. Do not invite the full first-50 group until a preview deployment is reachable without a 401 or a temporary Vercel share/bypass link is created for the testing window.
