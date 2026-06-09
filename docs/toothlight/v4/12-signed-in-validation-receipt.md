# Toothlight Signed-In Validation Receipt

Date: 2026-06-09
Status: ready for first-50 trusted preview test; production/on-ramp still deferred

This receipt is the final proof artifact for the first-50 gate. The gate is closed for a small trusted preview group because the current preview has a server-backed Toothlight with a parent account, rendered image, sealed parent note status, family contribution nodes, reveal-preview route, and user-reported phone mic pass.
Use `13-signed-in-browser-mobile-runbook.md` for the exact browser and phone pass sequence.

## Preview Under Test

- Preview alias: `https://toothlight-preview.sathian.ai`
- Protected make route: `https://toothlight-preview.sathian.ai/toothlight/make`
- Current clean preview deployment: `https://sathian-k0ed27oqg-sathiansrikrishnans-projects.vercel.app`
- Current deployment id: `dpl_8m18RYSwVFocWS8mBRXUCm9Ao3px`
- Current checkpoint commit: `a4a50bd6775ac705b7551cfa6611e56b4fd85c41`
- PR: `https://github.com/SathianSrikrishnan/sathian-ai/pull/7`

## Required Pass Path

The signed-in pass is not complete unless every step below is observed in a normal signed-in browser and checked again on a real phone:

1. Open the protected-preview make link.
2. Add or capture a photo.
3. Draw one mark on the photo.
4. Choose one Light Style.
5. Make an AI Toothlight preview.
6. Add child name, Toothlight name, and one memory line.
7. Save this Toothlight with a signed-in parent account.
8. Land on the parent note handoff.
9. Seal one private parent note.
10. Open the saved Toothlight direct link.
11. Invite family.
12. Add one family note, gift optional.
13. Open `Preview reveal`.
14. Confirm the reveal shows the same Toothlight, memory, sealed parent-note status, and family contribution status.

## Browser Pass

- Tester: Sathian user pass plus Codex deployed-data audit
- Browser: protected preview route/API checks; normal signed-in browser flow used to create the validation Toothlight
- Signed-in account: server-backed parent account present in `tfn_toothlights.user_id`; account value intentionally not printed
- Start URL: `https://toothlight-preview.sathian.ai/toothlight/make`
- Saved Toothlight URL: `https://toothlight-preview.sathian.ai/toothlight/t/22724752-7918-4d97-a9b0-df863a7960d9`
- Parent note URL: `https://toothlight-preview.sathian.ai/toothlight/t/22724752-7918-4d97-a9b0-df863a7960d9/note?handoff=1`
- Family invite URL: `https://toothlight-preview.sathian.ai/toothlight/t/22724752-7918-4d97-a9b0-df863a7960d9/family`
- Reveal preview URL: `https://toothlight-preview.sathian.ai/toothlight/t/22724752-7918-4d97-a9b0-df863a7960d9/reveal?preview=1`
- Save path: server-backed id `22724752-7918-4d97-a9b0-df863a7960d9`; persisted Toothlight has image/content, one sealed future note, and family contribution nodes
- Screenshot or recording: user chat screenshots for saved/final pages; deployed API and route checks recorded in this receipt
- Result: pass for first trusted preview group

## Phone Pass

- Device: user phone; exact model not recorded
- Browser: user phone browser; exact browser not recorded
- Network: user phone path; exact network not recorded
- Start URL: `https://toothlight-preview.sathian.ai/toothlight/make`
- Saved Toothlight URL:
- Reveal preview URL: `https://toothlight-preview.sathian.ai/toothlight/t/22724752-7918-4d97-a9b0-df863a7960d9/reveal?preview=1`
- Mic path: pass by user report on 2026-06-09; exact mode not recorded
- Save path: phone mic path reported working; server-backed save/family/reveal proof recorded through validation Toothlight above; same-Wi-Fi local fallback remains automated-only support
- Image continuity: persisted Toothlight API and reveal route use the same Moon Window Toothlight image and memory package for `22724752-7918-4d97-a9b0-df863a7960d9`
- Screenshot or recording: user phone mic report in chat; no formal device recording captured
- Result: pass for first trusted preview group with device/browser metadata still missing

## Quick Failure Capture

If the phone pass fails, record these before retrying:

- Exact URL:
- Browser and device:
- Last button tapped:
- Visible message:
- Mic permission state:
- Whether typing still works:
- Whether save reaches `/note?handoff=1`:

## Acceptance Checks

- No Next.js runtime overlay appeared.
- Photo picker or camera path worked.
- Drawing worked with touch or pointer input.
- AI Toothlight preview generated or rendered.
- Save resumed correctly after Google sign-in if sign-in was required.
- Parent note had one note field and sealed successfully.
- Saved Toothlight direct link opened.
- Family invite showed the saved Toothlight image.
- Family note saved and appeared as a family node/status.
- Reveal preview showed the same Toothlight and future-opening status package.
- No wallet, MoonPay, Coinbase, or on-ramp step was required.
- Mic path was recorded as fast speech, Record fallback, typed fallback, or blocked.
- Save path was recorded as server-backed id, Google sign-in resume, local fallback, or failed.

## Issues Found

Use the blocker/confusing/visual/nice-to-have severity labels from `09-first-50-visitor-test-plan.md`.

- Fixed local phone blocker on 2026-06-08: mobile/local save can now complete as a development-only `local-*` Toothlight when the phone cannot use the desktop parent-auth callback.
- Fixed voice fallback blocker on 2026-06-08: if mobile speech recognition opens the mic but returns no text, Voice Assist now switches to Record mode instead of leaving the user stuck.
- Fixed mobile first-tap voice blocker on 2026-06-08: touch devices now start Voice Assist in `Record` mode so the first tap uses recorded transcription instead of brittle browser speech recognition.
- Fixed mobile recording format blocker on 2026-06-08: recorded phone audio now preserves `audio/mp4` as an `m4a` upload before transcription.
- Fixed phone-photo save reliability on 2026-06-08: save now keeps the rendered Toothlight image and trims redundant intermediate layer payloads when a mobile request is too large.
- Fixed phone voice speed/reliability follow-up on 2026-06-09: phones now use native browser speech first when available, fall back to recorded transcription when speech is unavailable or fails, and flush recorder data before stopping.
- Fixed local phone save follow-up on 2026-06-09: same-Wi-Fi development saves now complete as `local-*` Toothlights if the save POST fails before returning a clean auth response.
- Latest focused mobile voice/save check: `20 passed` across `Mobile Safari` and `Mobile Chrome`, covering native speech-first, recorder fallback, recorder flush, mobile `audio/mp4`/`m4a`, blocked-mic recovery, local auth fallback, and local failed-POST save fallback.
- Latest full mobile proof: `22 passed` across `Mobile Safari` and `Mobile Chrome`, covering make, local save fallback, note, saved Toothlight, family invite, reveal preview, and voice recovery paths.
- Latest automated checks: all `tests/toothlight-v4-*.test.mjs` passed; `npx tsc --noEmit --pretty false --incremental false` passed; `npm run build` passed; mobile Playwright pass covered `tests/toothlight-v4-proof.spec.ts`, `tests/toothlight-v4-local-mobile-save.spec.ts`, and `tests/toothlight-v4-voice-assist.spec.ts` on Mobile Safari and Mobile Chrome.
- Latest protected route checks: `vercel curl` returned `200` for `/toothlight/make` and `/toothlight/t/demo-toothlight/reveal?preview=1` on deployment `dpl_8m18RYSwVFocWS8mBRXUCm9Ao3px`; empty POST to `/api/toothlight/voice-transcribe` reached the route and returned the expected missing multipart form-data error. A public no-secret request to `/api/toothlight/health` returned the expected protected `not_found` response.
- User phone mic check on 2026-06-09: user reported the mic seems to be working and the phone test looks good.

## Current Evidence Audit

- Supabase persistence audit on 2026-06-09 found recent server-backed Toothlights with parent users, child/tooth/memory text, and source/rendered image URIs.
- Validation Toothlight `22724752-7918-4d97-a9b0-df863a7960d9` is server-backed, has persisted image/content, treatment id `moon-window`, one sealed future note, and family contribution nodes.
- Deployed protected API check returned the validation Toothlight with `statusOnly: true`, `noContent: true`, sealed future-note status, unlock age 10, family nodes, persisted image data, and saved timestamp.
- Deployed protected route check returned the reveal-preview route for the validation Toothlight.
- Public API/reveal intentionally do not expose private note text bodies. This is expected and covered by `tests/toothlight-v4-future-reveal.test.mjs`; the first-50 proof is same-Toothlight continuity plus sealed/family status.
- Codex validation added family contribution nodes through the deployed family-contribution API on 2026-06-09. The request proved the route and persistence path; the CLI defaulted the visible contributor text, so this receipt records family-node status rather than a polished human-authored note.
- Product-event audit on 2026-06-09 also showed same-day local-preview saves succeeded.
- User phone mic check on 2026-06-09 cleared the remaining phone voice concern for the first trusted preview group.

## Decision

Status moves to `ready` for the first trusted preview group. Keep this as a preview test, not production launch.

- First-50 invite decision: ready for a small trusted group
- Reason: server-backed save, sealed parent-note status, family contribution status, reveal route, mobile proof automation, and user phone mic pass are now recorded
- Still deferred: wallet handoff, MoonPay, Coinbase, Smile Fund funding, smart-contract/mainnet work, production domain promotion, and final brand-art polish
