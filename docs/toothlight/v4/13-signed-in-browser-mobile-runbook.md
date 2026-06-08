# Toothlight Signed-In Browser and Mobile Runbook

Date: 2026-06-08
Status: ready for Sathian validation; first-50 invite still on hold

Use this as the single run sheet for the last gate before the first 20 to 50 visitors. The product loop is deployed and automated checks are green, but the gate is not closed until one signed-in browser pass and one real phone pass are recorded in `12-signed-in-validation-receipt.md`.

## Links

Local desktop:

- `http://localhost:3000/toothlight/make`

Local phone on same Wi-Fi:

- `http://192.168.1.104:3000/toothlight/make`

Protected preview:

- Alias: `https://toothlight-preview.sathian.ai`
- Make route: `https://toothlight-preview.sathian.ai/toothlight/make`
- Use the protected-preview share link from the chat when opening the preview outside the local machine. The Vercel share token is intentionally not committed.

Current deployed preview under test:

- Deployment: `https://sathian-5op825thb-sathiansrikrishnans-projects.vercel.app`
- Deployment id: `dpl_djSqxwotyhttyxq6yekc1zPs59Me`
- Deployed code checkpoint: `0238aa12e86a8fa1ac638a577b8bf2e0b9a17183`
- Documentation checkpoint: `9dde812b88c477b4979b25782a25a5933f2513cb`

## Pass 1: Local Phone Sanity

Purpose: confirm the phone can use the visual flow even if it cannot reuse the desktop Google session.

1. Open `http://192.168.1.104:3000/toothlight/make` on the phone.
2. Add or capture a photo.
3. Draw one visible mark.
4. Pick one Light Style.
5. Tap `Make it a Toothlight` or use the instant preview if AI is skipped.
6. In the story area, confirm the mic button starts as `Record` on the phone.
7. Tap `Record`, speak one short memory line, tap `Stop`, and wait for text.
8. If transcription does not return text, type the memory line and log the issue.
9. Tap `Save this Toothlight`.
10. Expected local result: either a normal saved Toothlight or a development-only `local-*` Toothlight that moves to `/note?handoff=1`.
11. Seal one parent note.
12. Open the saved Toothlight, invite family, add one family note, and open `Preview reveal`.

This pass proves same-Wi-Fi phone ergonomics. It does not replace the protected signed-in preview pass.

## Pass 2: Signed-In Browser Preview

Purpose: confirm the server-backed parent-account save path works.

1. Open the protected-preview make link from the chat in a normal browser.
2. Add or capture a photo.
3. Draw one visible mark.
4. Choose one Light Style.
5. Tap `Make it a Toothlight`.
6. Add child name, Toothlight name, and one short memory line.
7. Tap `Save this Toothlight`.
8. If Google sign-in appears, sign in and confirm the flow returns to the Toothlight handoff.
9. Expected preview result: a server-backed Toothlight id, not a `local-*` id.
10. Seal one private parent note.
11. Open the saved Toothlight direct link.
12. Tap `Invite family`.
13. Add one family note. Gift or Smile Fund remains optional and part of this same family contribution idea.
14. Open `Preview reveal`.

Pass criteria:

- no runtime overlay;
- no dead primary button;
- photo, drawing, style, story, save, note, family, and reveal all complete;
- saved Toothlight image carries into family and reveal;
- no wallet, MoonPay, Coinbase, or on-ramp step appears.

## Pass 3: Real Phone Protected Preview

Purpose: confirm the same protected-preview flow is usable on the device a parent is likely to use.

1. Open the protected-preview share link from the chat on the phone.
2. Repeat the same flow as Pass 2.
3. Confirm the mic button starts as `Record`.
4. Test one recorded note on either the child story, parent note, or family note.
5. Confirm the saved Toothlight and reveal preview show the same image.

If the phone cannot complete the protected signed-in save because of account/session constraints, record the exact failure and keep the first-50 invite on hold.

## Evidence To Record

Fill `12-signed-in-validation-receipt.md` with:

- tester name;
- browser and device;
- signed-in account used;
- start URL;
- saved Toothlight URL;
- parent note URL;
- family invite URL;
- reveal preview URL;
- screenshot or screen recording;
- result: pass, blocker, confusing, visual, or nice-to-have.

## Stop Rules

Do not invite the full first-50 group if any of these happen:

- save cannot reach the parent note handoff;
- parent note cannot seal;
- family invite does not show the saved Toothlight image;
- reveal preview does not show the same Toothlight;
- the phone mic path has no Record fallback and no usable typed fallback;
- a wallet, MoonPay, Coinbase, or on-ramp step blocks the loop.

## Decision Rule

When Pass 1, Pass 2, and Pass 3 have evidence in `12-signed-in-validation-receipt.md`, the first-50 gate can move from hold to ready. Until then, the product is ready for Sathian validation, not external visitor invites.
