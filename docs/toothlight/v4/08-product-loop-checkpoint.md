# Toothlight V4 Product Loop Checkpoint

Date: 2026-05-30
Status: local preview checkpoint for first visitor testing

## Locked product thesis

Toothlight V4 is an AI-enhanced time capsule around the lost-tooth moment.

The first product loop is intentionally small:

1. Parent and child make a Toothlight from a real memory photo.
2. The child can draw on it.
3. AI turns the memory plus drawing into a story object.
4. The original memory remains preserved.
5. The parent saves the Toothlight.
6. The parent can seal one private future note.
7. Family can add a note, with gifting and Smile Fund treated as optional follow-on layers.

The render quality is good enough for the first 20 to 50 visitor tests. It is not the final long-term creative system. The immediate product value is the end-to-end ritual: make something together, save it, seal a note for later, and invite family around the memory.

## Current core flow

### 1. Make

Route: `/toothlight/make`

The parent starts with a photo, camera capture, or drawing. The child drawing layer is treated as input to the Toothlight object, not as a separate sticker product.

The default render action is the 3D/story-object Toothlight direction. The Light Style options remain available because they give the system enough variety for testing and can map back to fairy-world story objects later.

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

The saved page uses a checklist:

- memory saved;
- future note;
- family invite;
- Smile Fund optional.

The next user action should be contextual. If no private note is sealed, the page should guide to the note step. If the note exists, it should guide to family invite. Smile Fund stays optional until the product proves the emotional loop.

### 4. Future note

Route: `/toothlight/t/[id]/note?handoff=1`

The note step is parent-only and now has one private note field. The earlier small starter note was removed because it created confusion and friction.

Required behavior:

- one note field;
- unlock age selector;
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

- family can add one note for later;
- gift amount remains optional;
- the form shows a clear completion state;
- completion links back to the saved Toothlight.

### 6. Saved time capsule

Route: `/toothlight/t/[id]`

The saved page is the current audit page for the end-to-end loop. It should show the saved Toothlight, note status, family status, and Smile Fund status without exposing crypto or database details.

Current limitation:

There is still too much explanatory copy. The next UX pass should reduce wording and make the saved state more visual.

## What is intentionally deferred

- MoonPay, Coinbase, and other payment/provider integrations.
- Smart contract audit and mainnet minting.
- Smile Fund funding UX beyond the optional placeholder state.
- C2PA or formal AI-content credentials.
- Render Lab as a parent-facing product.
- Large homepage replacement or V3 visual merge before the core loop is stable.

## Voice Assist layer

Voice should enter as assistive input, not a full real-time Tanda agent. The first implementation target is the parent future note: the parent can tap a mic button, speak the note, review the transcript in the same text field, edit it, then seal it. Approved text remains the saved source of truth.

The first fast path should use browser speech recognition where available, with the normal text field always visible as the fallback. Server transcription, Tanda read-aloud, original audio storage, and open-ended character conversation remain later phases.

## First-testing acceptance bar

The local preview is ready for the next review when:

- `/toothlight/make` can create and save a Toothlight;
- a saved Toothlight opens by direct link;
- the parent note page seals one private note without throwing a runtime error;
- the family page accepts a note and returns to the saved Toothlight;
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

## Next priorities

1. UX simplification pass:
   Initial pass applied after the checkpoint: saved, note, and family pages now use shorter copy, fewer explanatory panels, and clearer primary actions.

2. Production readiness pass:
   Confirm Vercel env vars, Supabase schema, Supabase storage, auth callback URLs, and image generation keys.

3. Fresh end-to-end QA:
   Test from a clean browser session, then test again as a signed-in parent using a real save.

4. Preview deployment:
   Push the checkpoint branch and use the Vercel preview URL for mobile testing before any production merge.
