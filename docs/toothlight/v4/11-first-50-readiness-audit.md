# Toothlight V4 First 50 Readiness Audit

Date: 2026-06-08
Status: local-ready and build-verified; preview deployed with environment health proof, protected make-page browser proof, family-demo image proof, save-auth boundary proof, and authenticated end-to-end pass pending

## Decision

The local Toothlight MVP is ready for Sathian-led testing on browser and phone. A clean Vercel preview is deployed, the Preview environment is health-checked, the preview alias has a shareable-link bypass, and the protected make page works through the parent-auth save boundary. It is not ready to send to the full first-50 visitor group until one authenticated normal browser/mobile pass confirms the share link end to end.

## What is ready

| Area | Status | Evidence |
| --- | --- | --- |
| Entry route | Ready locally | `http://localhost:3000/toothlight` returned `200 OK`. |
| Make route | Ready locally | `http://localhost:3000/toothlight/make` returned `200 OK`. |
| Phone same-Wi-Fi route | Ready locally | Current LAN route is `http://192.168.1.104:3000/toothlight/make`. |
| Visual-first make flow | Ready for first testing | Six generated Toothlight object images are committed in `public/toothlight/style-objects/product-renders/v4/`. |
| Simplified make UI | Ready locally | Style tiles now use short visible names, keeper image chips, and an image-led carousel/grid; the mobile next-action strip is hidden, the child story step keeps one talk/type memory field and says `Tell it.`, and the visible save panel is reduced to the primary save button. |
| AI Toothlight preview | Ready for first testing | `Make it a Toothlight` flow is covered by Toothlight V4 source tests. |
| Parent note handoff | Ready locally | Mobile proof covered parent note route and saved status. |
| Family invite handoff | Ready locally and preview-demo verified | Mobile proof covered family route and family contribution; protected preview demo family route now renders the Moon Window Toothlight image instead of a placeholder. |
| Mobile proof | Ready locally | Playwright passed on `Mobile Chrome` and `Mobile Safari`, including the combined make-to-family proof plus voice-assist suite rerun on 2026-06-07. |
| Source checks | Ready locally | Full `tests/toothlight-v4-*.test.mjs` suite passed after checkpoint work. |
| TypeScript compile | Ready locally | `npx.cmd tsc --noEmit --pretty false --incremental false` passed after the visual simplification pass. |
| Production build | Ready locally | `npm.cmd run build` passed after the generated `.next` cache was rebuilt with write access, and passed again in the 2026-06-07 continuation check. |
| Clean Vercel preview | Ready for Sathian pass | `dpl_254uYk49yxhAF6sBWMw414Kgufgb` is `READY`, built from clean commit `3fc7daa5a0c715d32bdc876c6522c4b66f5f2c2c`, and is aliased to `https://toothlight-preview.sathian.ai`. |
| Preview environment health | Ready for Sathian pass | `/api/toothlight/health` returned healthy with note encryption, voice transcription, OpenAI, Supabase tables, `tfn_product_events`, and `toothlight-images` all `ok`. |
| Protected preview bypass | Created | A Vercel shareable-link protection bypass exists for `toothlight-preview.sathian.ai`; the bypass token is intentionally not committed. |
| Protected make-page browser proof | Ready | Ordinary HTTP returned `200 OK` with the Toothlight make-page title, and a headless mobile-sized Playwright browser loaded the protected `/toothlight/make` page on 2026-06-07. |
| Protected save-auth boundary proof | Ready | Headless mobile-sized Playwright uploaded a test image, selected a style, filled the story fields, clicked save, saw `/api/toothlight/save` return `401`, and landed on Google sign-in. |

## Latest continuation proof

- Latest proof commit: `caece212b50aa12844245fc35fcc76fa27867a35`.
- Latest make-flow polish commit: `1e4ade85edaf5718327e7bc24d34be7ca97dc576`.
- Local make route still returns `200 OK` at `http://localhost:3000/toothlight/make`.
- Same-Wi-Fi phone make route still returns `200 OK` at `http://192.168.1.104:3000/toothlight/make`.
- Focused Toothlight V4 checks, TypeScript compile, and production build passed on 2026-06-07.
- Combined Playwright mobile proof plus voice-assist suite passed on 2026-06-07 with `8 passed`.
- Authenticated Vercel check still returns `200 OK` for `/toothlight/make` on `https://toothlight-preview.sathian.ai`.
- Fresh clean preview deployment `dpl_EsSBZZdoyyC5mtVTSMk2adz5rqZT` was deployed from commit `5ce0ed0033c5df06fdf7a5f0eacef2c67106dc56`; the preview alias now points to it.
- Protected preview share link returned `200 OK` through ordinary HTTP and loaded in a headless mobile-sized Playwright browser on 2026-06-07.
- Protected preview browser interaction reached the expected parent-auth boundary on 2026-06-07: save returned `401`, then redirected to Google sign-in.
- After the make-flow polish commit, focused make-flow checks passed, TypeScript passed, `npm run build` passed, fresh desktop/mobile screenshots were captured, and the combined Playwright mobile proof plus voice-assist suite passed again with `8 passed`.
- After the fresh alias update, authenticated Vercel curl returned `200 OK` for `/toothlight/make`, the protected preview share link returned `200 OK` by ordinary HTTP, and a mobile-sized protected preview screenshot showed the polished make page.
- A fresh protected-preview save-boundary probe uploaded a test image, selected `Moon Window`, filled the story fields, clicked `Save this Toothlight`, saw `/api/toothlight/save` return `401`, and landed on Google sign-in with state `/toothlight/make?save=1`.
- Latest family demo image fallback commit: `13af986979d2e781ca2d798210e1e42d8f72daff`.
- Fresh family-fix preview deployment `dpl_Ce9ngWuGatRriQjUx1XbZszh2NHn` was deployed from commit `13af986979d2e781ca2d798210e1e42d8f72daff`; the preview alias now points to it.
- Protected preview route checks returned `200 OK` for make, saved Toothlight, note handoff, and family invite demo routes.
- Protected demo Toothlight API check returned the Moon Window product image in both `imageSrc` and `renderedImageSrc`.
- A mobile-sized protected preview screenshot showed `/toothlight/t/demo-toothlight/family` rendering the Moon Window Toothlight card instead of the old placeholder.
- Protected preview family action probe confirmed the Moon Window image and card were visible, `/api/toothlight/demo-toothlight/family-contribution` returned `200`, and the family completion link appeared.
- Post-fix mobile proof rerun passed with `8 passed` across `Mobile Safari` and `Mobile Chrome`, covering make, save, note, saved Toothlight, family invite, family contribution, and voice-assist recovery.
- Continuation check on 2026-06-08 created a clean verification worktree at commit `8ad68ecdf25e0ce92632526b1121d215cb21dedf` and ran every `toothlight-v4-*.test.mjs` source check; all passed.
- Latest clean PR checkpoint `ddbe5bc4e1203401ee42341a029d72a373b917b6` deployed as `dpl_A8YB51btAAbcj97dh8fAHuCv4ugC`; the preview alias now points to `https://sathian-lelc70gmv-sathiansrikrishnans-projects.vercel.app`.
- Latest protected preview route checks returned `200 OK` for make, saved Toothlight, note handoff, and family invite demo routes.
- Latest protected-preview save-boundary probe uploaded a test image, selected `Moon Window`, filled the story fields, clicked `Save this Toothlight`, saw `/api/toothlight/save` return `401`, and landed on Google sign-in.
- Preview environment readiness on 2026-06-08 added `TOOTHLIGHT_NOTE_ENCRYPTION_KEY`, `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true`, and `TFN_ADMIN_SECRET` to the Vercel Preview environment.
- Fresh environment-enabled preview deployment `dpl_B149cSDk8vDGzUaJapLrhSv5ekAk` was deployed from commit `e506e7c3dca708c52ebaf7008e99838d60f2bbde`; the preview alias now points to `https://sathian-ght6ohr72-sathiansrikrishnans-projects.vercel.app`.
- Protected Vercel curl checks returned `200 OK` for make, saved Toothlight, note handoff, family invite demo, and demo Toothlight API routes.
- `/api/toothlight/health` returned healthy with `TOOTHLIGHT_NOTE_ENCRYPTION_KEY`, `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE`, `OPENAI_API_KEY`, Supabase tables, `tfn_product_events`, and `toothlight-images` all `ok`.
- Minimal protected-deployment save boundary check posted `{}` to `/api/toothlight/save` and returned `401`, confirming parent auth is still required before persistence.
- Local retest after the checkpoint fast-forward confirmed `http://localhost:3000/toothlight/make` and `http://192.168.1.104:3000/toothlight/make` both return `200 OK`, with the dev server listening on `0.0.0.0:3000` for same-Wi-Fi phone testing.
- Desktop and mobile screenshots confirmed the current make page is visual-first: photo/draw first, six product object Light Style images with keeper portrait chips, and the mobile style carousel visible before the saved preview.
- Latest clean PR checkpoint `3fc7daa5a0c715d32bdc876c6522c4b66f5f2c2c` deployed as `dpl_254uYk49yxhAF6sBWMw414Kgufgb`; the preview alias now points to `https://sathian-5hjfgksag-sathiansrikrishnans-projects.vercel.app`.
- Latest protected Vercel curl checks returned `200 OK` for make, saved Toothlight, note handoff, family invite demo, and demo Toothlight API routes; unauthenticated save still returns `401`.
- Latest `/api/toothlight/health` check returned healthy with note encryption, voice transcription, OpenAI, Supabase tables, product events, and image bucket all `ok`.

## What is blocked

| Area | Status | Why |
| --- | --- | --- |
| Vercel connector | Blocked | The MCP connector still returns `token_expired`; local Vercel CLI is authenticated and was used instead. |
| Authenticated end-to-end browser proof | Hold | The protected make page now works through the parent-auth save boundary, but a logged-in browser/mobile pass through make, note, saved Toothlight, and family invite is still required. |
| First-50 external invite | Hold | Needs one confirmed authenticated share-link pass through make, note, saved Toothlight, and family invite. |

## Open product limits

- AI object quality is good enough for first feedback, not final brand art.
- Voice is an assistive input path, not a live Tanda guide.
- Smile Fund funding, MoonPay, Coinbase, wallet handoff, and contract/mainnet work stay outside this first-50 product loop.
- Parent note sealing is configured in Preview; production promotion must recheck `TOOTHLIGHT_NOTE_ENCRYPTION_KEY`.
- Voice transcription is configured in Preview; production promotion must recheck `OPENAI_API_KEY` and `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true`.

## Next action

1. Keep local testing active at `http://localhost:3000/toothlight/make`.
2. Open the Vercel share link for `https://toothlight-preview.sathian.ai/toothlight/make`.
3. Run one authenticated normal browser/mobile preview pass: make, save, seal note, invite family.
4. Only then invite the first small outside group.
