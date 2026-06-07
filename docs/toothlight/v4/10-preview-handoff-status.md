# Toothlight V4 Preview Handoff Status

Date: 2026-06-07
Status: local-ready, build-verified, and preview-deployed; external browser pass pending

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
- Phone entry on same Wi-Fi: `http://192.168.1.104:3000/toothlight`
- Phone make flow on same Wi-Fi: `http://192.168.1.104:3000/toothlight/make`

Generated flow routes:

- `/toothlight/t/[id]`
- `/toothlight/t/[id]/note?handoff=1`
- `/toothlight/t/[id]/family`

## Current Vercel preview

- Clean preview deployment: `https://sathian-ohhj6x5i9-sathiansrikrishnans-projects.vercel.app`
- Deployment id: `dpl_2Ukbu414HdviqRR5oFX1GTuLTpYE`
- Preview alias: `https://toothlight-preview.sathian.ai`
- Alias update: `toothlight-preview.sathian.ai` now points to the clean preview deployment from commit `8ad3beb2c9f964060c299f3133dea85019b633c9`.
- A Vercel shareable-link protection bypass was created for the preview alias. The bypass token is intentionally not committed to the repository.

## Verification evidence

- `/toothlight/make` returned `200` locally after the dev server was restarted.
- Continuation check on 2026-06-07 reconfirmed `http://localhost:3000/toothlight/make` and `http://192.168.1.104:3000/toothlight/make` both return `200 OK`.
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
- Continuation check on 2026-06-07 reran the focused Toothlight V4 checks, TypeScript compile check, and `npm.cmd run build`; all passed with the same known unrelated warnings.
- Clean Vercel preview build passed from an exported clean copy of commit `8ad3beb2c9f964060c299f3133dea85019b633c9`, avoiding unrelated local analytics/reporting work.
- Authenticated Vercel route checks passed:
  - `vercel curl /toothlight --deployment https://sathian-ohhj6x5i9-sathiansrikrishnans-projects.vercel.app` returned `200 OK`.
  - `vercel curl /toothlight/make --deployment https://toothlight-preview.sathian.ai` returned `200 OK`.
  - `vercel curl /toothlight/t/demo-toothlight --deployment https://sathian-ohhj6x5i9-sathiansrikrishnans-projects.vercel.app` returned `200 OK`.
- Continuation check on 2026-06-07 reconfirmed `vercel curl /toothlight/make --deployment https://toothlight-preview.sathian.ai` returns `200 OK`.

## Preview gap

The known preview domain is now updated, but one external-browser pass is still required before inviting the full first-50 group:

- GitHub PR #7 is open, merge state is `CLEAN`, and has no GitHub status checks attached to the latest commit.
- The Vercel connector still returns `token_expired`, but the local Vercel CLI is authenticated as `sathian` and was used for the clean preview deployment.
- Direct unauthenticated shell checks from the local Codex environment returned connection-level failures to Vercel edge URLs, while authenticated `vercel curl` checks returned `200 OK`. Verify the shareable preview link in a normal browser before broad sharing.
- A Playwright browser screenshot attempt against the share link launched successfully only with elevated permission, then failed with `ERR_INTERNET_DISCONNECTED`. Treat that as a Codex/browser-network limitation, not a Vercel build failure, because authenticated `vercel curl` returns `200 OK`.

## Environment gates

Before external preview testing:

- Set a non-empty `TFN_ADMIN_SECRET`, `TOOTHFAIRY_ADMIN_SECRET`, or `CRON_SECRET` so `/api/toothlight/health` can be checked.
- Keep `TOOTHLIGHT_NOTE_ENCRYPTION_KEY` configured as a 32-byte base64 server value before note sealing is treated as production-ready.
- Enable `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true` only when `OPENAI_API_KEY` is present and recording transcription should be active.
- Keep MoonPay, Coinbase, Smile Fund funding, and smart-contract mainnet work out of the first-50 visitor flow.

## Next handoff action

Use local phone testing and the protected-preview share link now. Do not invite the full first-50 group until one normal browser/mobile pass confirms the share link opens `/toothlight/make`, creates a Toothlight, seals the note, and reaches family invite.
