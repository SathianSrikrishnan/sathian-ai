# Toothlight V4 Preview Handoff Status

Date: 2026-06-07
Status: local-ready and build-verified; public preview access not yet ready

## Current checkpoint

- Branch: `codex/toothlight-v4-creation-ux`
- Pull request: `https://github.com/SathianSrikrishnan/sathian-ai/pull/7`
- Readiness handoff checkpoint commit: `6b6601bf41fda67fc7a13716390ee7f4c98f3d30`
- Visual simplification checkpoint commit: `beceb341d5ef415cfedbbbaf551e2c7c9f17ab9f`
- First-50 readiness audit commit: `02362827ad7e20cac67c2012a49738ea6f1a99b0`
- Preview auth blocker commit: `bfb78d1c61ab0b2371d4510400334eda360c1f40`
- Preview handoff doc commit: `690c4426eff796f861ad487d06f470bb80345647`
- Style object checkpoint commit: `418a7fe4d9670caa1f20de237e75b3f4f4f7a586`

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
- Full Toothlight V4 source tests passed again after the preview handoff checkpoint.
- Full Toothlight V4 source tests passed again after the visual-first make-flow simplification.
- TypeScript compile check passed with `npx.cmd tsc --noEmit --pretty false --incremental false`.
- Mobile proof passed on both Playwright projects:
  - `Mobile Chrome`
  - `Mobile Safari`
- The mobile proof covered entry, make, save, parent note, saved Toothlight, family invite, and family contribution on the local test server.
- Desktop and mobile Playwright screenshots of `/toothlight/make` were captured after the visual simplification pass.
- Full production build passed with `npm.cmd run build` after the local `.next` cache was rebuilt with write access. The build generated `/toothlight`, `/toothlight/make`, `/toothlight/t/[id]`, `/toothlight/t/[id]/note`, and `/toothlight/t/[id]/family`.
- The previous build timeout is retired as a local environment/cache issue. After the generated cache was moved, non-elevated startup showed `EPERM` creating `.next`; the elevated build completed successfully. The build still prints existing unrelated warnings around bigint bindings, article cache URL parsing, and a dynamic Tooth Fairy API route.

## Preview gap

The known preview domain is not ready for public first-50 testing:

- `https://toothlight-preview.sathian.ai/toothlight` returned `401 Unauthorized`.
- `https://toothlight-preview.sathian.ai/toothlight/make` returned `401 Unauthorized`.
- GitHub PR #7 is open, merge state is `CLEAN`, and has no Vercel bot comment or status checks attached to the latest commit.
- The Vercel connector returned `403 Forbidden` for the project scope, so deployment inspection requires Vercel re-authentication or a token with access to the `sathiansrikrishnans-projects` scope.
- A later attempt to create a temporary Vercel access link returned `token_expired`, so the connector must be signed in again before it can create a protected-preview bypass link.

## Environment gates

Before external preview testing:

- Set a non-empty `TFN_ADMIN_SECRET`, `TOOTHFAIRY_ADMIN_SECRET`, or `CRON_SECRET` so `/api/toothlight/health` can be checked.
- Keep `TOOTHLIGHT_NOTE_ENCRYPTION_KEY` configured as a 32-byte base64 server value before note sealing is treated as production-ready.
- Enable `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true` only when `OPENAI_API_KEY` is present and recording transcription should be active.
- Keep MoonPay, Coinbase, Smile Fund funding, and smart-contract mainnet work out of the first-50 visitor flow.

## Next handoff action

Use local phone testing now. Do not invite the full first-50 group until Vercel is re-authenticated and a preview deployment is reachable without a 401, or a temporary Vercel share/bypass link is created for the testing window.
