# Execution Control Plan

Purpose: make the Colosseum video build easy to supervise while allowing Codex to move quickly.

## Bulk Approval You Can Give

You can approve this whole packet by saying:

> Approved: proceed with the Colosseum production packet. Use Tanda Faye, current face lock v0, and the autonomy rules in `operating-model.md`.

That approval lets Codex proceed without stopping on:

- Drafting/revising scene copy.
- Generating Tanda still variants.
- Generating diagram/image prompt variants.
- Creating placeholder assets.
- Updating storyboard slots.
- Creating Remotion review compositions.
- Tightening timing and narration.
- Organizing files and manifests.

Codex will still stop for:

- Final Tanda face lock if a better image is supplied.
- Any real-money transaction, live wallet action, or MoonPay purchase.
- Public deployment or publishing.
- Final submitted Colosseum videos and form content.
- Claims that depend on MoonPay/Solana Mobile actually working.

## Production Steps

### 1. Tanda Faye Asset Sprint

Goal:

- Generate a CEO/talking-avatar still from the current face lock.
- Produce 2-4 candidate stills.
- Pick one for avatar testing.

Files:

- Input: `avatar/locked/tanda-face-lock-v0.jpg`
- Output: `public/colosseum-frontier-2026/avatar/`
- Tracking: `avatar/production-queue.md`

Needs approval:

- Final face choice.

### 2. Diagram Pack V1

Goal:

- Create first usable diagram assets for storyboard/final edit:
  - Distributed family graph.
  - Solana stack.
  - PDA model.
  - Why Solana.

Files:

- Prompts: `prompt-queue.md`
- Output: `public/colosseum-frontier-2026/diagrams/`

Needs approval:

- Scene-level feedback only: keep, revise, or discard.

### 3. Product Capture Prep

Goal:

- Prepare exact capture filenames and capture order.
- Confirm which app routes are ready.
- Create screen-recording placeholders in the storyboard.

Files:

- `capture-manifest.md`
- `product-demo-runbook.md`
- `src/remotion/colosseum/storyboards.ts`

Needs approval:

- Whether to keep MoonPay as KYB-pending, upgrade it after approval/testing, or cut it from final.
- Whether Solana Mobile is live proof or optional roadmap.

### 4. Product Capture Pass

Goal:

- Record:
  - Homepage.
  - Keepsake flow.
  - Gift link.
  - Phantom/cNFT proof.
  - Blink proof if stable.
  - MoonPay only if KYB approval lands and the widget test is clean.
  - Solana Mobile if ready.

Needs approval:

- Real wallet/MoonPay actions before execution.

### 5. Storyboard Assembly V1

Goal:

- Update Remotion scene slots with generated/captured assets.
- Produce a reviewable pitch storyboard and technical storyboard.

Needs approval:

- Scene-level feedback.

### 6. Avatar Motion And Voice

Goal:

- Turn approved still into short talking Tanda clips.
- Generate/record narration in short clips.
- Add Sathian soundbite only where it improves trust.

Needs approval:

- Final voice/tone.

### 7. Final Edit Pass

Goal:

- Build final pitch video and technical walkthrough.
- Add captions and proof labels.
- Export final files.

Needs approval:

- Final upload/submission.

## Roadblocks

### Known

- Remotion CLI currently hits local `spawn EPERM` while starting its bundler.
- Remotion also warns that `zod` is installed at 3.22.4 while it expects 3.22.3.
- TypeScript passes, so the storyboard code itself is sound.
- Starting a hidden local Next dev server from this sandbox was blocked by policy. Product capture can proceed once the app is opened in the normal local environment.

### Likely

- MoonPay KYB may land late; keep it as a pending fiat on-ramp point unless approval and a clean test both land.
- Solana Mobile Store packaging may be easy but still should not derail the submission.
- Tanda avatar lip-sync may not preserve the face perfectly; fallback is Tanda stills/loops plus voiceover.
- Live wallet recordings can expose sensitive info; all captures need a quick privacy pass.

## Permissions / Access Needed

No extra permission needed for:

- Editing repo files.
- Creating docs.
- Creating local Remotion/storyboard scaffolding.
- Generating image prompts.
- Organizing local assets.

May need explicit approval/access for:

- Network access if tools need to call external services.
- MoonPay testing after KYB approval, with the publishable API key, secret key, and feature flag in the environment.
- Real wallet transactions.
- Browser automation/capture if the app must be opened and recorded.
- Publishing to the website, Solana Mobile Store, YouTube, X, or Colosseum.

## Approximate Timeline

### Today

- Lock execution packet.
- Generate Tanda still candidates.
- Generate diagram pack v1 or placeholder diagrams.
- Prepare storyboard asset slots.

### Next 12-24 Hours

- Product capture pass.
- Avatar motion test.
- First pitch storyboard assembly.

### 24-48 Hours

- MoonPay/on-ramp test if KYB approval arrives.
- Solana Mobile proof if ready.
- Technical walkthrough storyboard assembly.

### 48-72 Hours

- Rough final videos.
- Caption and proof-label pass.
- Tighten scripts and remove weak claims.

### Final 24 Hours Before Submission

- No new feature dependency unless critical.
- Final renders.
- Upload and link audit.
- Colosseum form submission.

## Most Efficient Working Pattern

1. Sathian gives bulk approval for this execution packet.
2. Codex generates the first assets and updates the approval board.
3. Sathian reviews only the high-leverage decisions:
   - Tanda face.
   - Business claim accuracy.
   - Whether MoonPay/Solana Mobile is included.
   - Final scene approval.
4. Codex keeps producing scene-by-scene until both videos are assembled.
