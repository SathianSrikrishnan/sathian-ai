# Toothlight Signed-In Browser and Mobile Runbook

Date: 2026-06-09
Status: ready for first-50 trusted preview test

Use this as the single run sheet for the first 20 to 50 trusted visitors. The product loop is deployed, automated checks are green, the phone mic concern is cleared by user report, and `12-signed-in-validation-receipt.md` now records the server-backed save, sealed-note status, family contribution status, and reveal-preview continuity proof.

## Do This Now

For the next validation pass, use the HTTPS protected preview first. Local Wi-Fi is useful for layout and save fallback testing, but phone microphone behavior is most reliable on HTTPS.

1. Open the protected-preview share link on desktop or phone and complete one signed-in save.
2. Prefer phone for parent-style testing; use desktop if the tester needs easier photo/file handling.
3. On the phone, test one mic field and record whether it used fast speech-to-text, switched to `Record`, or required typing.
4. Copy any new saved Toothlight, parent note, family invite, and reveal preview URLs into the feedback notes if a bug appears.
5. If a blocker appears, stop and record the exact screen, URL, browser, and message.

Expected final screen: `Preview reveal` shows the same Toothlight image, the memory line, sealed-note status, and family contribution status. Public routes intentionally do not expose private note bodies.

## Links

Local desktop:

- `http://localhost:3000/toothlight/make`

Local phone on same Wi-Fi:

- `http://192.168.1.104:3000/toothlight/make`

Protected preview:

- Alias: `https://toothlight-preview.sathian.ai`
- Make route: `https://toothlight-preview.sathian.ai/toothlight/make`
- Use the protected-preview share link from the chat when opening the preview outside the local machine. The Vercel share token is intentionally not committed.

If Vercel protection appears, sign in to Vercel or use the protected share link. If Google sign-in appears after `Save this Toothlight`, sign in with the parent account and confirm the flow returns to the Toothlight handoff.

Current deployed preview under test:

- Deployment: `https://sathian-k0ed27oqg-sathiansrikrishnans-projects.vercel.app`
- Deployment id: `dpl_8m18RYSwVFocWS8mBRXUCm9Ao3px`
- Deployed code checkpoint: `a4a50bd6775ac705b7551cfa6611e56b4fd85c41`
- Documentation checkpoint: latest pushed branch head. This runbook is guarded by `tests/toothlight-v4-signed-in-runbook.test.mjs` so the validation links and stop rules stay pinned without making the file stale after each documentation commit.

## Pass 1: Local Phone Sanity

Purpose: confirm the phone can use the visual flow even if it cannot reuse the desktop Google session.

1. Open `http://192.168.1.104:3000/toothlight/make` on the phone.
2. Add or capture a photo.
3. Draw one visible mark.
4. Pick one Light Style.
5. Tap `Make it a Toothlight` or use the instant preview if AI is skipped.
6. In the story area, confirm the mic button uses fast speech-to-text when the phone supports it, or switches to `Record` when speech is unavailable.
7. Tap the mic action, speak one short memory line, stop if needed, and wait for text.
8. If the local IP page says `Recording needs HTTPS on a phone`, type the line for this local sanity pass and test voice on the HTTPS protected preview.
9. If HTTPS transcription does not return text, type the memory line and log the issue.
10. Tap `Save this Toothlight`.
11. Expected local result: either a normal saved Toothlight or a development-only `local-*` Toothlight that moves to `/note?handoff=1`.
12. Seal one parent note.
13. Open the saved Toothlight, invite family, add one family note, and open `Preview reveal`.

This pass proves same-Wi-Fi phone ergonomics. It does not replace the protected signed-in preview pass.

Expected local result:

- `local-*` Toothlight ids are acceptable only for same-Wi-Fi local testing.
- A `local-*` id is not enough to open the first-50 gate.
- Use HTTPS preview to judge real phone microphone behavior.

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
3. Confirm the mic button uses fast speech-to-text when available and still has a `Record` fallback if speech misses.
4. Test one spoken or recorded note on either the child story, parent note, or family note.
5. Confirm the saved Toothlight and reveal preview show the same image.

If the phone cannot complete the protected signed-in save because of account/session constraints, record the exact failure and have that tester switch to desktop. Treat a repeated save or mic failure as a blocker.

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

Also record:

- mic path: fast speech, Record fallback, typed fallback, or blocked;
- save path: server-backed id, Google sign-in resume, local fallback, or failed;
- image continuity: same Toothlight image in saved, family, and reveal pages.

## Stop Rules

Do not invite the full first-50 group if any of these happen:

- save cannot reach the parent note handoff;
- parent note cannot seal;
- family invite does not show the saved Toothlight image;
- reveal preview does not show the same Toothlight;
- the phone mic path has no Record fallback and no usable typed fallback;
- a wallet, MoonPay, Coinbase, or on-ramp step blocks the loop.

## Decision Rule

The first-50 gate is ready after the 2026-06-09 validation receipt. Continue only as a trusted preview test. Do not promote to production, add wallet/on-ramp requirements, or merge broadly until the first real tester issues are reviewed.
