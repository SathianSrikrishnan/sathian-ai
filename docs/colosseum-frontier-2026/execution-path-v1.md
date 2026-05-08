# Colosseum Video Execution Path V1

Purpose: get both Colosseum videos from current packet to final export without making MoonPay, Solana Mobile, or avatar perfection block the whole submission.

## North Star

- Pitch video: Tanda Faye sells the story, product, business wedge, and Solana value in under 3 minutes.
- Technical video: narrator shows working implementation, account model, cNFT/storage proof, gift flow, and why Solana.
- MoonPay: mention as KYB-pending fiat on-ramp path. Upgrade to live proof only if KYB approval and test both land before edit lock.

## Current State

Done:

- Tanda Faye still candidate v2.
- Diagram pack v1.
- Remotion storyboard data.
- Human storyboard v1.
- App review hub at `/toothfairy/colosseum`.
- Watchable rough-cut theater at `/toothfairy/colosseum/theater`.
- Autonomous capture runner at `/toothfairy/colosseum/run`.
- Capture manifest and route map.
- MoonPay code path is env-gated, but final video should not imply it is live until KYB completes.

Blocked:

- Local dev server could not be started from this sandbox.
- Remotion export still hits local bundler `spawn EPERM`.
- Product proof footage has not been captured yet.
- Avatar lip-sync has not been tested.
- MoonPay KYB is pending.

## Execution Lanes

### Lane A - Product Capture

Owner: Sathian starts app / Codex guides and organizes footage.

Goal: collect enough real product footage that both videos can be assembled even if MoonPay and Solana Mobile slip.

Capture order:

1. `pitch-p03-product-flow-screen-v1.mp4`
   - `/toothfairy` to `/toothfairy/app`.
   - Show ritual, drawing/photo, preview.

2. `technical-t02-user-flow-screen-v1.mp4`
   - Slower version of the same flow.
   - Pause on important states.

3. `pitch-p04-gift-link-screen-v1.mp4`
   - Gift page.
   - Share link.
   - Deposit CTA.

4. `proof-program-explorer-v1.mp4`
   - Program ID proof.
   - Keep crop tight.

5. `proof-phantom-cnft-v1.mp4`
   - Keepsake/cNFT in Phantom or explorer.

6. `proof-blink-v1.mp4`
   - Include only if stable.

7. `proof-moonpay-v1.mp4`
   - Only if KYB approval lands and widget test is clean.
   - Otherwise use a static overlay: `MoonPay fiat on-ramp: KYB pending`.

8. `proof-solana-mobile-v1.mp4`
   - Only if packaging/store/mobile flow is accurate.

### Lane B - Avatar And Voice

Owner: Codex prepares prompts/assets; Sathian approves face/tone if needed.

Goal: create enough Tanda presence for the pitch without betting everything on lip-sync.

Steps:

1. Use current `tanda-faye-ceo-still-v2.png` for storyboard assembly.
2. Produce opening, Solana, and closing talking-avatar tests.
3. If lip-sync changes the face too much, use still/loop with Tanda voiceover.
4. Optional Sathian soundbite only if it adds trust.

### Lane C - Storyboard Assembly

Owner: Codex.

Goal: turn captured assets into reviewable scene boards, then final videos.

Steps:

1. Update `src/remotion/colosseum/storyboards.ts` with captured file paths.
2. Mark scenes `draft-ready` as footage arrives.
3. Assemble pitch rough cut.
4. Assemble technical rough cut.
5. Add proof labels and captions.
6. Tighten runtime.
7. Export final files after Remotion/local export blocker is resolved.

### Lane D - Claims And Risk Control

Owner: Codex tracks; Sathian confirms high-stakes claims.

Rules:

- Live mainnet claims require explorer/Phantom proof.
- MoonPay remains KYB-pending unless approved and tested.
- Solana Mobile appears only if the mobile packaging proof is real.
- No private wallet keys, API keys, card details, identity screens, or admin secrets in final footage.

## What Sathian Needs To Do

### To Unlock Product Capture

1. Open a normal terminal outside this sandbox.
2. Run:

```bash
cd "C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai"
npm run dev
```

3. Open `http://localhost:3000/toothfairy`.
4. Confirm the app loads.
5. Open `http://localhost:3000/toothfairy/colosseum` to review the storyboard hub.
6. Open `http://localhost:3000/toothfairy/colosseum/theater` to watch the loose pitch/technical shell with Tanda, scratch voice, and browser frames.
7. Record a clean product pass or tell Codex the app is running so Codex can help organize the capture plan.

### To Unlock Proof Capture

1. Have a test milestone/keepsake ready.
2. Have Phantom connected to the test wallet.
3. Have the program/explorer page ready:
   - `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`
4. Keep private keys and wallet seed phrases off screen.

### To Unlock MoonPay Later

1. Wait for KYB approval.
2. Add env values only after approval:

```bash
NEXT_PUBLIC_TFN_FIAT_ONRAMP_ENABLED=true
MOONPAY_API_KEY=...
MOONPAY_SECRET_KEY=...
```

3. Restart the app.
4. Test widget open.
5. Record only non-private screens.

## Production Timeline

### Pass 1 - Now

- Finish storyboard v1.
- Keep MoonPay as KYB-pending.
- Capture product route if app can run locally.
- Generate first avatar motion test.

### Pass 2 - After Product Capture

- Create pitch rough cut.
- Create technical rough cut.
- Replace placeholders with proof clips.
- Decide whether founder soundbite is needed.

### Pass 3 - After KYB / Mobile Updates

- If MoonPay KYB lands, capture widget proof and upgrade line.
- If Solana Mobile proof lands, add 3-5 seconds.
- If either slips, keep the video strong without them.

### Final Pass

- Captions.
- Proof labels.
- Runtime check.
- Export.
- Upload and submission link audit.

## Definition Of Ready For Final Render

- Tanda face approved or fallback chosen.
- Core app flow captured.
- Gift link captured.
- Program/explorer proof captured.
- Phantom/cNFT proof captured.
- Technical script no longer depends on unproven claims.
- MoonPay and Solana Mobile labels match reality as of final edit.
