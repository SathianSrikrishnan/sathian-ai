# Toothlight Signed-In Validation Receipt

Date: pending
Status: pending signed-in browser/mobile pass

This receipt is the final proof artifact for the first-50 gate. Fill it after one real signed-in parent completes the protected preview on a normal browser and one real phone pass confirms the same flow is usable.

## Preview Under Test

- Preview alias: `https://toothlight-preview.sathian.ai`
- Protected make route: `https://toothlight-preview.sathian.ai/toothlight/make`
- Current clean preview deployment: `https://sathian-5op825thb-sathiansrikrishnans-projects.vercel.app`
- Current deployment id: `dpl_djSqxwotyhttyxq6yekc1zPs59Me`
- Current checkpoint commit: `0238aa12e86a8fa1ac638a577b8bf2e0b9a17183`
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
14. Confirm the reveal shows the same Toothlight, memory, parent note preview, and family note preview.

## Browser Pass

- Tester:
- Browser:
- Signed-in account:
- Start URL:
- Saved Toothlight URL:
- Parent note URL:
- Family invite URL:
- Reveal preview URL:
- Screenshot or recording:
- Result: pending

## Phone Pass

- Device:
- Browser:
- Network:
- Start URL:
- Saved Toothlight URL:
- Reveal preview URL:
- Screenshot or recording:
- Result: pending

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
- Reveal preview showed the same Toothlight and future-opening package.
- No wallet, MoonPay, Coinbase, or on-ramp step was required.

## Issues Found

Use the blocker/confusing/visual/nice-to-have severity labels from `09-first-50-visitor-test-plan.md`.

- Fixed local phone blocker on 2026-06-08: mobile/local save can now complete as a development-only `local-*` Toothlight when the phone cannot use the desktop parent-auth callback.
- Fixed voice fallback blocker on 2026-06-08: if mobile speech recognition opens the mic but returns no text, Voice Assist now switches to Record mode instead of leaving the user stuck.
- Fixed mobile first-tap voice blocker on 2026-06-08: touch devices now start Voice Assist in `Record` mode so the first tap uses recorded transcription instead of brittle browser speech recognition.
- Latest automated checks: all `tests/toothlight-v4-*.test.mjs` passed; `npm run build` passed; mobile Playwright pass covered `tests/toothlight-v4-proof.spec.ts`, `tests/toothlight-v4-local-mobile-save.spec.ts`, and `tests/toothlight-v4-voice-assist.spec.ts` on Mobile Safari and Mobile Chrome.

## Decision

Status remains `pending` until both the browser pass and phone pass are filled in with real signed-in evidence.

- First-50 invite decision: hold
- Reason: signed-in browser/mobile validation evidence pending
