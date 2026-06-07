# Toothlight V4 First 50 Readiness Audit

Date: 2026-06-07
Status: local-ready and build-verified; preview deployed with external browser pass pending

## Decision

The local Toothlight MVP is ready for Sathian-led testing on browser and phone. A clean Vercel preview is deployed and the preview alias has a shareable-link bypass. It is not ready to send to the full first-50 visitor group until one normal browser/mobile pass confirms the share link end to end.

## What is ready

| Area | Status | Evidence |
| --- | --- | --- |
| Entry route | Ready locally | `http://localhost:3000/toothlight` returned `200 OK`. |
| Make route | Ready locally | `http://localhost:3000/toothlight/make` returned `200 OK`. |
| Phone same-Wi-Fi route | Ready locally | Current LAN route is `http://192.168.1.102:3000/toothlight/make`. |
| Visual-first make flow | Ready for first testing | Six generated Toothlight object images are committed in `public/toothlight/style-objects/product-renders/v4/`. |
| Simplified make UI | Ready locally | Style tiles now use short visible names, keeper image chips, and an image-led carousel/grid; the child story step is reduced to child, Toothlight, and one talk/type memory field. |
| AI Toothlight preview | Ready for first testing | `Make it a Toothlight` flow is covered by Toothlight V4 source tests. |
| Parent note handoff | Ready locally | Mobile proof covered parent note route and saved status. |
| Family invite handoff | Ready locally | Mobile proof covered family route and family contribution. |
| Mobile proof | Ready locally | Playwright passed on `Mobile Chrome` and `Mobile Safari`. |
| Source checks | Ready locally | Full `tests/toothlight-v4-*.test.mjs` suite passed after checkpoint work. |
| TypeScript compile | Ready locally | `npx.cmd tsc --noEmit --pretty false --incremental false` passed after the visual simplification pass. |
| Production build | Ready locally | `npm.cmd run build` passed after the generated `.next` cache was rebuilt with write access. |
| Clean Vercel preview | Ready for Sathian pass | `dpl_2Ukbu414HdviqRR5oFX1GTuLTpYE` is `READY`, built from clean commit `8ad3beb2c9f964060c299f3133dea85019b633c9`, and is aliased to `https://toothlight-preview.sathian.ai`. |
| Protected preview bypass | Created | A Vercel shareable-link protection bypass was created for `toothlight-preview.sathian.ai`; the bypass token is intentionally not committed. |

## What is blocked

| Area | Status | Why |
| --- | --- | --- |
| Vercel connector | Blocked | The MCP connector still returns `token_expired`; local Vercel CLI is authenticated and was used instead. |
| Unauthenticated browser proof | Hold | Authenticated `vercel curl` checks return `200 OK`, but a normal browser/mobile pass against the share link is still required. |
| First-50 external invite | Hold | Needs one confirmed share-link pass through make, note, saved Toothlight, and family invite. |

## Open product limits

- AI object quality is good enough for first feedback, not final brand art.
- Voice is an assistive input path, not a live Tanda guide.
- Smile Fund funding, MoonPay, Coinbase, wallet handoff, and contract/mainnet work stay outside this first-50 product loop.
- Parent note sealing still depends on `TOOTHLIGHT_NOTE_ENCRYPTION_KEY` being configured in the target environment.
- Voice transcription still depends on `OPENAI_API_KEY` and `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true` in the target environment.

## Next action

1. Keep local testing active at `http://localhost:3000/toothlight/make`.
2. Open the Vercel share link for `https://toothlight-preview.sathian.ai/toothlight/make`.
3. Run one normal browser/mobile preview pass: make, save, seal note, invite family.
4. Only then invite the first small outside group.
