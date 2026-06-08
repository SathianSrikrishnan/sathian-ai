# Toothlight V4 First 50 Visitor Test Plan

Date: 2026-06-07
Status: local-ready, protected-preview ready through auth handoff, authenticated pass pending

## Purpose

This pass is for the first 20 to 50 trusted visitors. The goal is to learn whether the Toothlight ritual is understandable and stable:

1. Make the memory.
2. Preview an AI Toothlight.
3. Save the Toothlight.
4. Seal one parent note.
5. Invite family to add a note and optional gift.

Not production. Do not merge or launch broadly until the mobile checklist below passes on real phones and one signed-in parent completes the protected preview from make through family invite.

## Test routes

Local browser:

- `http://localhost:3000/toothlight`
- `http://localhost:3000/toothlight/make`

Phone on the same Wi-Fi:

- `http://<LAN-IP>:3000/toothlight`
- `http://<LAN-IP>:3000/toothlight/make`

Current same-Wi-Fi phone link from the latest checkpoint:

- `http://192.168.1.104:3000/toothlight/make`

Use PowerShell to confirm the current LAN IP:

```powershell
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -like '192.168.*' -and $_.PrefixOrigin -ne 'WellKnown' } |
  Select-Object -First 1 IPAddress
```

Generated flow routes:

- `/toothlight/t/[id]`
- `/toothlight/t/[id]/note?handoff=1`
- `/toothlight/t/[id]/family`

Protected preview:

- Alias: `https://toothlight-preview.sathian.ai`
- Make route: `https://toothlight-preview.sathian.ai/toothlight/make`
- Use the shareable protected-preview link from the chat when testing outside the local machine. The Vercel share token is intentionally not written into this repository.
- Current clean preview deployment id: `dpl_Ce9ngWuGatRriQjUx1XbZszh2NHn`.
- Current preview checkpoint commit: `13af986979d2e781ca2d798210e1e42d8f72daff`.

## Mobile checklist

Run this on at least one iPhone Safari session and one Chrome Android or Chrome desktop mobile-emulation session before inviting external testers.

- Entry page loads and the first screen explains `Photo + drawing`, `AI Toothlight`, `Sealed note`, and `Family note + gift`.
- `Create a Toothlight` opens `/toothlight/make`.
- Choose photo opens the photo picker.
- Camera opens the camera path or a browser-supported camera picker.
- The selected image appears in the memory editor.
- Open the drawing studio.
- finger drawing works on top of the photo.
- Brush colors stay reachable.
- Done closes the drawing studio and preserves the drawing.
- Selecting each Light Style updates the preview card and the style picker shows six rendered v4 Toothlight object images.
- `Make it a Toothlight` creates or displays a usable AI Toothlight final; this is the AI preview action.
- Saved AI options remain visible after multiple previews.
- Child story fields are visible and the Mic control is usable when supported.
- Save this Toothlight creates a saved Toothlight and hands off to the note route.
- Seal the note accepts one private parent note.
- Mic on the note page either transcribes, records for transcription, or gives clear permission recovery copy.
- Saved Toothlight page opens by direct link.
- Invite family opens the family route.
- Family note + gift shows the saved Toothlight image, not a placeholder.
- Family Mic is visible for the family note field.
- Add family note creates a node and returns a visible completion state.

## Authenticated preview checklist

Run this once in a normal signed-in browser and once on a real phone before inviting the full first-50 group.

- Open the protected-preview make link from the chat.
- Confirm `/toothlight/make` loads without a runtime overlay.
- Choose or capture a photo.
- Draw one simple mark on the memory.
- Choose one Light Style.
- Tap `Make it a Toothlight`.
- Add child name, Toothlight name, and one short memory line.
- Tap `Save this Toothlight`.
- If Google sign-in appears, sign in and confirm the flow returns to the saved Toothlight handoff.
- Seal one private parent note.
- Open the saved Toothlight page by its direct link.
- Tap `Invite family`.
- Add one family note. Treat the optional gift/Smile Fund as part of this same family contribution step, not a separate first-50 requirement.
- Confirm the family page shows the saved Toothlight image, not a placeholder or unrelated object.

## Pass criteria

A test pass is valid when:

- no page shows a Next.js runtime overlay;
- no primary button is unreachable on phone;
- no text overlaps core controls;
- the original memory remains visible or preserved in the saved Toothlight;
- the saved Toothlight can be opened by direct link;
- the parent note page does not ask for two notes;
- the family route carries forward the saved Toothlight image;
- a tester can complete the loop without needing wallet, MoonPay, Coinbase, or on-ramp setup.
- the protected preview save step reaches Google sign-in when unauthenticated and resumes correctly when authenticated.

## Known limits

- AI object quality is good enough for early feedback but not final.
- The six Light Style object images are source-controlled generated v4 product renders in `public/toothlight/style-objects/product-renders/v4/`. They are ready for first-50 testing, but not final brand/commerce artwork.
- Style tiles are deliberately image-led for this test. Replace the generated keeper/style images later only after the core loop is stable.
- Voice Assist is assistive input, not a live Tanda voice agent.
- Browser speech recognition depends on the browser. Recording fallback uses `/api/toothlight/voice-transcribe`.
- Production voice transcription requires `OPENAI_API_KEY` and `TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE=true`.
- `/api/toothlight/health` reports whether production voice transcription is enabled, disabled, or missing its OpenAI key.
- Parent note sealing requires `TOOTHLIGHT_NOTE_ENCRYPTION_KEY` as a 32-byte base64 server value.
- Preview health checks require `TFN_ADMIN_SECRET`, `TOOTHFAIRY_ADMIN_SECRET`, or `CRON_SECRET`; without one, the health route intentionally returns 404.
- MoonPay, Coinbase, and other on-ramp/provider funding paths are deferred for this visitor test.
- Smart contract audit, mainnet minting, and production Smile Fund funding are deferred.
- The first-50 family step is `invite family to add a note, with an optional gift later`; do not split Smile Fund into a separate tester task.

## Bug report

Use this shape for every tester issue:

```text
Tester:
Device and browser:
URL:
Step:
Expected:
Actual:
Screenshot or screen recording:
Can reproduce? yes/no
Severity: blocker / confusing / visual / nice-to-have
```

Severity guide:

- blocker: cannot create, save, seal, or invite family;
- confusing: tester can continue but does not understand what to do;
- visual: layout, crop, overlap, image quality, or text polish issue;
- nice-to-have: not needed for the first 50.

## Verification commands

Run source checks:

```powershell
Get-ChildItem tests -Filter "toothlight-v4-*.test.mjs" |
  Sort-Object Name |
  ForEach-Object {
    node $_.FullName
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
```

Run build:

```powershell
npm run build
```

Run the preview health check after Vercel is ready:

```powershell
Invoke-WebRequest -UseBasicParsing "https://<preview-domain>/api/toothlight/health" `
  -Headers @{ "x-tfn-admin-secret" = "<admin secret>" }
```

Run the mobile proof path:

```powershell
$env:PLAYWRIGHT_PORT = '3100'
npx playwright test tests/toothlight-v4-proof.spec.ts --project="Mobile Chrome"
npx playwright test tests/toothlight-v4-proof.spec.ts --project="Mobile Safari"
Remove-Item Env:\PLAYWRIGHT_PORT
```

Run the protected preview public save boundary check:

```text
Open the protected preview link from the chat, create a Toothlight, and tap Save.
Expected unauthenticated result: Google sign-in.
Expected authenticated result: note handoff, then saved Toothlight, then family invite.
```

## Release rule

Do not merge, deploy broadly, or invite the full first-50 group until:

- the local mobile checklist passes;
- the preview deployment is ready;
- one clean signed-in parent flow is completed on the protected preview;
- one clean phone flow is completed on the protected preview or same-Wi-Fi local link;
- open blocker issues are fixed or explicitly deferred.
