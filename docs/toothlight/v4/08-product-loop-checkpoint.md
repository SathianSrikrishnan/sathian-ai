# Toothlight V4 Product Loop Checkpoint

Date: 2026-05-30
Status: local preview checkpoint for first 20 to 50 visitor testing

## Locked product thesis

Toothlight V4 is an AI-enhanced time capsule around the lost-tooth moment.

The first product loop is intentionally small:

1. Parent and child make a Toothlight from a real memory photo.
2. The child can draw on it.
3. AI turns the memory plus drawing into a story object.
4. The original memory remains preserved.
5. The parent saves the Toothlight.
6. The parent can seal one private future note.
7. Family can add a note and optional gift for later; Smile Fund language stays folded into this family invite path.

The render quality is good enough for the first 20 to 50 visitor tests. It is not the final long-term creative system. The immediate product value is the end-to-end ritual: make something together, save it, seal a note for later, and invite family around the memory.

## Current core flow

### 0. Entry

Route: `/toothlight`

The entry page now introduces the product loop as `Photo + drawing`, `AI Toothlight`, `Sealed note`, and `Family note + gift`. Smile Fund language should not appear as a separate first-visit step on this page; the first tester read is family can add a note and optional gift later.

### 1. Make

Route: `/toothlight/make`

The parent starts with a photo, camera capture, or drawing. The child drawing layer is treated as input to the Toothlight object, not as a separate sticker product.

The memory step now keeps the intro minimal: one helper sentence before the photo, camera, and drawing controls.

The default render action is the 3D/story-object Toothlight direction. The Light Style options remain available because they give the system enough variety for testing and can map back to fairy-world story objects later.

The style and render section is now visual-first: six rendered object image tiles, real keeper portrait chips in the tile corners, short style/keeper labels, and one `Make it a Toothlight` action. The current v4 product renders live in `public/toothlight/style-objects/product-renders/v4/` and cover Golden Locket, Moon Window, Storybook Velvet, Rainbow Room, Pillow Spark, and Family Lantern. The generated contact sheet source is preserved in the same folder for auditability. Longer lore remains in accessible labels and prompt metadata rather than visible explanatory copy.

The latest image pass makes the object images the dominant control surface and keeps the keeper images as compact visual context, similar to a phone-style filter tray. It intentionally avoids sourcing outside artwork for the first-50 test; the six visible style objects and keeper portraits come from generated/source-controlled Toothlight and story assets already in the repo.

### 2. AI final

The current render direction is a Toothlight object, not a pure photo filter.

Required behavior:

- preserve the original source memory;
- keep the child recognizable when a child is present;
- interpret the drawing as object detail, edge, seam, engraving, glow, thread, paper cut, or charm structure;
- generate distinct object families across the six default Light Styles;
- keep multiple saved AI final options visible so the parent can compare.

Current limitation:

The drawing translation is still inconsistent and can look repetitive. This is acceptable for first testing because the original memory and saved product loop now work.

### 3. Save

After the parent saves, the saved page should frame the Toothlight as a time capsule rather than a finished financial product.

The saved page uses a three-item checklist:

- Memory;
- Parent note;
- Family note + gift.

The next user action should be contextual. If no private note is sealed, the page should guide to `Seal note`. If the note exists, it should guide to `Invite family`. Smile Fund stays folded into the family note + optional gift path until the product proves the emotional loop.

### 4. Future note

Route: `/toothlight/t/[id]/note?handoff=1`

The note step is parent-only and now has one private note field. The earlier small starter note was removed because it created confusion and friction.

Required behavior:

- one note field;
- unlock age selector;
- short voice-first prompt: `Tap mic. Talk. Seal.`;
- clear seal action;
- safe JSON error handling;
- demo route works in local preview;
- missing encryption config returns a readable message instead of a broken page.

Production requirement:

`TOOTHLIGHT_NOTE_ENCRYPTION_KEY` must be configured as a 32-byte base64 server environment variable before deploying note sealing.

### 5. Family invite

Route: `/toothlight/t/[id]/family`

The family step should read as optional support around the memory, not as a required checkout flow.

Current behavior:

- family can add a note for later;
- a gift can travel with that note, but the note remains the default path;
- visitor-facing language is `Family note + gift`, `Note first. Gift optional.`, and `Add family note`;
- the note field supports the same mic-assisted capture pattern as the child story and parent note;
- the family invite page carries forward the saved Toothlight image, title, caption, and family nodes;
- the form shows a clear completion state;
- completion links back to the saved Toothlight.

### 6. Saved time capsule

Route: `/toothlight/t/[id]`

The saved page is the current end-to-end loop status page. It should show the saved Toothlight, note status, and family invite status without exposing crypto, payment-provider, or database details.

Current limitation:

There is still some explanatory copy across the full loop, but the post-save pages have started moving toward shorter status language:

- saved page uses a short next-action label and helper;
- note handoff leads with one parent note and the fast mic/text prompt;
- note review restores sealed status from local preview storage or the saved Toothlight API;
- family page shows one primary visual object: the saved Toothlight;
- family invite and gift now read as one `Family note + gift` step rather than a separate Smile Fund flow.

### 7. Future reveal preview

Route: `/toothlight/t/[id]/reveal?preview=1`

The reveal page is the parent audit view for the future-opening moment. It lets the parent confirm that the same Toothlight image, child-facing memory, sealed parent note, and family notes will come together later without exposing private note bodies on the normal saved Toothlight page.

Current behavior:

- saved, note, and family surfaces link to `Preview reveal`;
- the reveal page carries forward the saved Toothlight card and image;
- the opened preview shows the child memory, parent note, and family notes when local preview text exists;
- the non-preview route stays in a locked future state;
- the public Toothlight API remains status-only and does not expose private note text;
- local-only preview text is stored in browser state after parent note sealing or family note submission so the creator can test the three-year reveal moment immediately.

## What is intentionally deferred

- MoonPay, Coinbase, and other payment/provider integrations.
- Smart contract audit and mainnet minting.
- Smile Fund funding UX beyond the optional placeholder state.
- C2PA or formal AI-content credentials.
- Render Lab as a parent-facing product.
- Large homepage replacement or V3 visual merge before the core loop is stable.

## Voice Assist layer

Voice should enter as assistive input, not a full real-time Tanda agent. The first implementation targets are the child's public memory line in `/toothlight/make`, the parent future note, and the family note: the user can tap a mic button, speak, review the transcript in the same text field, edit it, then save or seal it. Approved text remains the saved source of truth.

The first fast path uses browser speech recognition where available, with the normal text field always visible as the fallback. If browser speech fails in local preview, the mic control switches to a short Record mode and transcribes through `/api/toothlight/voice-transcribe`.

Mobile speech recognition can open the microphone and still end with no transcript. The field now treats that as a failed fast path, shows `No speech heard. Try Record instead.`, and exposes the recorded fallback without requiring a page reload. Touch devices now start in `Record` mode so the first tap uses recorded transcription instead of brittle browser speech recognition. The recorded fallback now preserves mobile `audio/mp4` as an `m4a` upload before transcription, which covers the iPhone-style recording format instead of forcing every recording through a `.webm` filename.

Real phone microphone testing should happen on the HTTPS protected preview. Same-Wi-Fi local IP testing can still prove the visual flow and local save fallback, but phone browsers may refuse microphone capture on plain HTTP; in that case the app now says `Recording needs HTTPS on a phone. Open the preview link or type instead.`

Production voice transcription is intentionally opt-in. It requires `OPENAI_API_KEY` plus `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true`; Tanda read-aloud, original audio storage, and open-ended character conversation remain later phases.

The make flow story step now treats the story as a thumb-first capture card: two short fields for child and Toothlight name, one voice-assisted memory field, and a stripped save panel beside it. The story card now includes a small keeper-to-Toothlight visual cue so the child story feels connected to the selected object style without adding explanatory copy. The mic action remains visible even when a browser does not expose speech or recorder support; unsupported environments fall back to a typed-note message instead of hiding the control. The family invite uses the same assistive pattern with `Tap mic. Talk. Add note.` while keeping gifts optional.

## Local phone testing

When testing from a real phone on the local Wi-Fi address, Google auth callbacks can fail because the phone is not using the desktop `localhost` session. In development only, a 401 save response on `localhost`, `127.0.0.1`, or private LAN hostnames now creates a `local-*` Toothlight in browser storage and continues to the parent note handoff. The deployed preview and production bundle still require the normal parent account save path.

The save request now has a mobile payload budget. If a phone photo plus drawing creates a large request, the client keeps the final rendered Toothlight image and trims redundant intermediate layer images before posting, so the save is less likely to fail on request-size limits.

The matching local note fallback is also development-only and only applies to `local-*` Toothlight ids. This lets a phone test complete make -> note -> saved page without changing the server-backed first-50 visitor path.

## First-testing acceptance bar

The local preview is ready for the next review when:

- `/toothlight/make` can create and save a Toothlight;
- a saved Toothlight opens by direct link;
- the parent note page seals one private note without throwing a runtime error;
- the family page accepts a note and returns to the saved Toothlight;
- the reveal preview shows the same Toothlight plus the future memory/note/family package;
- demo routes work without signed-in browser state;
- build and Toothlight V4 tests pass.

## Verification commands

Run these from the active preview repo:

```powershell
$tests = Get-ChildItem -LiteralPath 'tests' -Filter 'toothlight-v4-*.test.mjs' | Sort-Object Name
foreach ($test in $tests) {
  node $test.FullName
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
```

```powershell
npm run build
```

```powershell
$env:PLAYWRIGHT_PORT = '3100'
npx playwright test tests/toothlight-v4-proof.spec.ts --project="Mobile Chrome"
Remove-Item Env:\PLAYWRIGHT_PORT
```

```powershell
$env:PLAYWRIGHT_PORT = '3106'
npx playwright test tests/toothlight-v4-proof.spec.ts tests/toothlight-v4-local-mobile-save.spec.ts tests/toothlight-v4-voice-assist.spec.ts
Remove-Item Env:\PLAYWRIGHT_PORT
```

## Next priorities

1. Object-image quality pass:
   The style picker now uses source-controlled generated product renders instead of abstract SVG swatches. The next visual upgrade is producing final per-style hero renders once the six object forms are approved through real tester feedback.

2. UX simplification pass:
   Initial pass applied after the checkpoint: saved, note, and family pages now use shorter copy, fewer explanatory panels, and clearer primary actions.

3. Production readiness pass:
   Confirm Vercel env vars, Supabase schema, Supabase storage, auth callback URLs, and image generation keys.

4. Fresh end-to-end QA:
   Test from a clean browser session, then test again as a signed-in parent using a real save.

5. Preview deployment:
   Push the checkpoint branch and use the Vercel preview URL for mobile testing before any production merge.
