# Toothlight V4 Preview Handoff Status

Date: 2026-06-07
Status: local-ready, build-verified, preview-deployed, protected make-page browser verified, family-demo image verified, and save-auth boundary verified; authenticated end-to-end pass pending

## Current checkpoint

- Branch: `codex/toothlight-v4-creation-ux`
- Pull request: `https://github.com/SathianSrikrishnan/sathian-ai/pull/7`
- Readiness handoff checkpoint commit: `6b6601bf41fda67fc7a13716390ee7f4c98f3d30`
- Visual simplification checkpoint commit: `beceb341d5ef415cfedbbbaf551e2c7c9f17ab9f`
- First-50 readiness audit commit: `02362827ad7e20cac67c2012a49738ea6f1a99b0`
- Preview auth blocker commit: `bfb78d1c61ab0b2371d4510400334eda360c1f40`
- Preview handoff doc commit: `690c4426eff796f861ad487d06f470bb80345647`
- Style object checkpoint commit: `418a7fe4d9670caa1f20de237e75b3f4f4f7a586`
- Continuation proof commit: `269b618df94b51b4c5f292c333a92df81e65af42`
- Mobile proof stabilization commit: `caece212b50aa12844245fc35fcc76fa27867a35`
- First-50 auth gate doc commit: `890ecf13c9123a9e958f93b7057bd74957421d60`
- Make-flow polish commit: `1e4ade85edaf5718327e7bc24d34be7ca97dc576`
- Family demo image fallback commit: `13af986979d2e781ca2d798210e1e42d8f72daff`

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

- Clean preview deployment: `https://sathian-ktjvg9kt3-sathiansrikrishnans-projects.vercel.app`
- Deployment id: `dpl_Ce9ngWuGatRriQjUx1XbZszh2NHn`
- Preview alias: `https://toothlight-preview.sathian.ai`
- Alias update: `toothlight-preview.sathian.ai` now points to the clean preview deployment from commit `13af986979d2e781ca2d798210e1e42d8f72daff`.
- A Vercel shareable-link protection bypass exists for the preview alias. The bypass token is intentionally not committed to the repository.

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
- Continuation check on 2026-06-07 updated the mobile proof for the simplified story labels and reran the combined Playwright mobile proof plus voice-assist suite; `8 passed` across `Mobile Safari` and `Mobile Chrome`.
- Desktop and mobile Playwright screenshots of `/toothlight/make` were captured after the visual simplification pass.
- Full production build passed with `npm.cmd run build` after the local `.next` cache was rebuilt with write access. The build generated `/toothlight`, `/toothlight/make`, `/toothlight/t/[id]`, `/toothlight/t/[id]/note`, and `/toothlight/t/[id]/family`.
- The previous build timeout is retired as a local environment/cache issue. After the generated cache was moved, non-elevated startup showed `EPERM` creating `.next`; the elevated build completed successfully. The build still prints existing unrelated warnings around bigint bindings, article cache URL parsing, and a dynamic Tooth Fairy API route.
- Continuation check on 2026-06-07 reran the focused Toothlight V4 checks, TypeScript compile check, and `npm.cmd run build`; all passed with the same known unrelated warnings.
- Clean Vercel preview build passed from an exported clean copy of commit `ca18b61bd1b56ef57500e6b29650c72f8b488d17`, avoiding unrelated local analytics/reporting work.
- Authenticated Vercel route checks passed:
  - `vercel curl /toothlight --deployment https://sathian-7yqevxpl6-sathiansrikrishnans-projects.vercel.app` returned `200 OK`.
  - `vercel curl /toothlight/make --deployment https://toothlight-preview.sathian.ai` returned `200 OK`.
  - `vercel curl /toothlight/t/demo-toothlight --deployment https://sathian-7yqevxpl6-sathiansrikrishnans-projects.vercel.app` returned `200 OK`.
- Continuation check on 2026-06-07 reconfirmed `vercel curl /toothlight/make --deployment https://toothlight-preview.sathian.ai` returns `200 OK`.
- Fresh preview check on 2026-06-07 confirmed the alias points to `dpl_7HFSNTrLkQs1tT6gHK2vrjDRbCwZ` and `vercel curl /toothlight/make --deployment https://toothlight-preview.sathian.ai` returns `200 OK`.
- Protected preview share-link check on 2026-06-07 returned `200 OK` through an ordinary HTTP request with page title `Create a Toothlight | Tooth Fairy Network`.
- Protected preview share-link check on 2026-06-07 loaded `/toothlight/make` in a headless mobile-sized Playwright browser and captured a valid make-page screenshot. The bypass token is not committed.
- Protected preview browser interaction probe on 2026-06-07 uploaded a test image, selected `Moon Window`, filled the child story fields, clicked `Save this Toothlight`, received `401` from `/api/toothlight/save`, and redirected to Google sign-in. That confirms the public make flow works up to the expected parent-auth save boundary.
- Make-flow polish on 2026-06-07 hid the mobile next-action strip, reduced the empty memory placeholder to `Add photo`, changed the story prompt to `Tell it.`, and removed the redundant visible save heading while keeping the accessible save label.
- Focused make-flow checks passed after the polish commit:
  - `toothlight-v4-make`
  - `toothlight-v4-ux-simplification`
  - `toothlight-v4-light-styles`
- TypeScript compile, `npm run build`, desktop screenshot, mobile screenshot, and the combined Playwright mobile proof plus voice-assist suite all passed after the make-flow polish commit.
- Fresh Vercel preview deployment `dpl_EsSBZZdoyyC5mtVTSMk2adz5rqZT` was created from clean checkpoint commit `5ce0ed0033c5df06fdf7a5f0eacef2c67106dc56`; `toothlight-preview.sathian.ai` was reassigned to it.
- Authenticated Vercel curl returned `200 OK` for `/toothlight/make` on the updated alias.
- The protected preview share link returned `200 OK` by ordinary HTTP after the alias update, and a mobile-sized Playwright screenshot confirmed the deployed protected make page shows the polished UI.
- Fresh protected-preview save-boundary probe on 2026-06-07 uploaded a test image, selected `Moon Window`, filled the story fields, clicked `Save this Toothlight`, saw `/api/toothlight/save` return `401`, and landed on Google sign-in with state `/toothlight/make?save=1`.
- Family demo image fallback fix on 2026-06-07 deployed clean checkpoint `13af986979d2e781ca2d798210e1e42d8f72daff` as `dpl_Ce9ngWuGatRriQjUx1XbZszh2NHn`; `toothlight-preview.sathian.ai` was reassigned to it.
- Protected preview route checks returned `200 OK` for `/toothlight/make`, `/toothlight/t/demo-toothlight`, `/toothlight/t/demo-toothlight/note?handoff=1`, and `/toothlight/t/demo-toothlight/family`.
- Protected demo Toothlight API check returned `imageSrc` and `renderedImageSrc` as `/toothlight/style-objects/product-renders/v4/moon-window-product.jpg`.
- A mobile-sized protected preview screenshot of `/toothlight/t/demo-toothlight/family` confirmed the family page shows the Moon Window Toothlight image instead of a placeholder.
- Protected preview family action probe confirmed the Moon Window image and card were visible, `/api/toothlight/demo-toothlight/family-contribution` returned `200`, and the family completion link appeared.
- Post-fix mobile proof rerun passed with `8 passed` across `Mobile Safari` and `Mobile Chrome`, covering make, save, note, saved Toothlight, family invite, family contribution, and voice-assist recovery.

## Preview gap

The known preview domain is now updated and the protected make page works through the parent-auth save boundary, but one authenticated external end-to-end browser/mobile pass is still required before inviting the full first-50 group:

- GitHub PR #7 is open, merge state is `CLEAN`, and has no GitHub status checks attached to the latest commit.
- The Vercel connector still returns `token_expired`, but the local Vercel CLI is authenticated as `sathian` and was used for the clean preview deployment.
- Direct unelevated shell checks from the local Codex environment returned connection-level failures to Vercel edge URLs, while elevated ordinary HTTP, elevated Playwright screenshot, elevated browser interaction, and authenticated `vercel curl` checks returned expected results. Verify the full shareable preview flow in an authenticated normal browser before broad sharing.

## Environment gates

Before external preview testing:

- Set a non-empty `TFN_ADMIN_SECRET`, `TOOTHFAIRY_ADMIN_SECRET`, or `CRON_SECRET` so `/api/toothlight/health` can be checked.
- Keep `TOOTHLIGHT_NOTE_ENCRYPTION_KEY` configured as a 32-byte base64 server value before note sealing is treated as production-ready.
- Enable `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true` only when `OPENAI_API_KEY` is present and recording transcription should be active.
- Keep MoonPay, Coinbase, Smile Fund funding, and smart-contract mainnet work out of the first-50 visitor flow.

## Next handoff action

Use local phone testing and the protected-preview share link now. Do not invite the full first-50 group until one authenticated browser/mobile pass confirms the share link opens `/toothlight/make`, creates a Toothlight, seals the note, and reaches family invite.
