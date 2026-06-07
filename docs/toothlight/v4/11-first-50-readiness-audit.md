# Toothlight V4 First 50 Readiness Audit

Date: 2026-06-07
Status: local-ready and build-verified; preview deployed with protected make-page browser proof, save-auth boundary proof, and authenticated end-to-end pass pending

## Decision

The local Toothlight MVP is ready for Sathian-led testing on browser and phone. A clean Vercel preview is deployed, the preview alias has a shareable-link bypass, and the protected make page works through the parent-auth save boundary in a mobile-sized browser. It is not ready to send to the full first-50 visitor group until one authenticated normal browser/mobile pass confirms the share link end to end.

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
| Family invite handoff | Ready locally | Mobile proof covered family route and family contribution. |
| Mobile proof | Ready locally | Playwright passed on `Mobile Chrome` and `Mobile Safari`, including the combined make-to-family proof plus voice-assist suite rerun on 2026-06-07. |
| Source checks | Ready locally | Full `tests/toothlight-v4-*.test.mjs` suite passed after checkpoint work. |
| TypeScript compile | Ready locally | `npx.cmd tsc --noEmit --pretty false --incremental false` passed after the visual simplification pass. |
| Production build | Ready locally | `npm.cmd run build` passed after the generated `.next` cache was rebuilt with write access, and passed again in the 2026-06-07 continuation check. |
| Clean Vercel preview | Ready for Sathian pass | `dpl_7HFSNTrLkQs1tT6gHK2vrjDRbCwZ` is `READY`, built from clean commit `ca18b61bd1b56ef57500e6b29650c72f8b488d17`, and is aliased to `https://toothlight-preview.sathian.ai`. |
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
- Fresh clean preview deployment `dpl_7HFSNTrLkQs1tT6gHK2vrjDRbCwZ` was deployed from commit `ca18b61bd1b56ef57500e6b29650c72f8b488d17`; the preview alias now points to it.
- Protected preview share link returned `200 OK` through ordinary HTTP and loaded in a headless mobile-sized Playwright browser on 2026-06-07.
- Protected preview browser interaction reached the expected parent-auth boundary on 2026-06-07: save returned `401`, then redirected to Google sign-in.
- After the make-flow polish commit, focused make-flow checks passed, TypeScript passed, `npm run build` passed, fresh desktop/mobile screenshots were captured, and the combined Playwright mobile proof plus voice-assist suite passed again with `8 passed`.

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
- Parent note sealing still depends on `TOOTHLIGHT_NOTE_ENCRYPTION_KEY` being configured in the target environment.
- Voice transcription still depends on `OPENAI_API_KEY` and `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true` in the target environment.

## Next action

1. Keep local testing active at `http://localhost:3000/toothlight/make`.
2. Open the Vercel share link for `https://toothlight-preview.sathian.ai/toothlight/make`.
3. Run one authenticated normal browser/mobile preview pass: make, save, seal note, invite family.
4. Only then invite the first small outside group.
