# Toothlight Signed-In Validation Receipt

Date: pending
Status: pending signed-in browser/mobile pass

This receipt is the final proof artifact for the first-50 gate. Fill it after one real signed-in parent completes the protected preview on a normal browser and one real phone pass confirms the same flow is usable.

## Preview Under Test

- Preview alias: `https://toothlight-preview.sathian.ai`
- Protected make route: `https://toothlight-preview.sathian.ai/toothlight/make`
- Current deployment id: `dpl_XMjGkH348MtpFZss8M55CWXBjCZT`
- Current checkpoint commit: `8c334acab0f09a1a8204b724f043bee862bb0b57`
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

- None recorded yet.

## Decision

Status remains `pending` until both the browser pass and phone pass are filled in with real signed-in evidence.

- First-50 invite decision: hold
- Reason: signed-in browser/mobile validation evidence pending
