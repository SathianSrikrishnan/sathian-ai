# TFN Tanda Pose Pack For Ritual Animation

Date: 2026-05-05
Status: Production prompt pack and v5 asset contract

## Goal

Move the ritual loop from "one cutout moved through a scene" to character-led motion. V4 proves the story flow, but it is near the ceiling of what timing and procedural flutter can do with one Tanda pose. V5 should use a small, consistent transparent pose pack so Tanda has real body language.

The animation should still make the page need fewer words: Tanda carries the tooth, saves the memory, protects it, and guides the starter gift into the Smile Fund piggy bank.

## Character Lock

Use the approved older Tanda reference:

`public/toothfairy/animation/layered/tanda-cutout-soft.png`

Preserve:

- Young friendly tooth fairy, parent-safe and premium.
- Soft brown wavy hair, same face, same warm expression language.
- White airy dress, small brown satchel, iridescent pastel wings.
- Warm golden tooth glow.
- Premium 3D storybook illustration, not cheap flat clip art.

Avoid:

- Changing Tanda into the cartoony purple-dress fairy.
- Heavy makeup, teen/adult glam, sharp fantasy warrior styling.
- Text on the character art.
- Background scene details inside the transparent pose asset.
- Extra objects except the tooth or coin when specified.

## Asset Contract

Save final transparent PNGs here:

`public/toothfairy/animation/pose-pack/`

Expected filenames:

1. `tanda-01-fly-in-tooth.png`
2. `tanda-02-hover-tooth.png`
3. `tanda-03-drop-tooth.png`
4. `tanda-04-follow-through.png`
5. `tanda-05-guide-coin.png`
6. `tanda-06-celebrate-exit.png`
7. `tanda-wing-overlay.png` optional, only if useful

Recommended canvas:

- Square transparent PNG.
- 1536 x 1536 preferred, 1024 x 1024 acceptable.
- Tanda should be fully visible with generous padding.
- Same apparent character scale across every pose.
- No cast shadow baked into the PNG.

## Pose Prompts

Use the existing Tanda image as the primary identity and style reference in every generation. If generating with a chroma-key workflow, use a perfectly flat solid green background and remove it afterward.

### Shared Base Prompt

Use case: illustration-story
Asset type: transparent character animation sprite for a premium family fintech homepage
Input image: approved Tanda reference, use as strict character identity and style reference
Subject: the same small expressive tooth fairy named Tanda, soft brown wavy hair, warm brown eyes, white airy dress, small brown satchel, iridescent pastel wings, premium 3D storybook illustration
Style/medium: polished 3D storybook character render, warm magical lighting, parent-friendly, premium, consistent with the reference image
Composition/framing: full-body character sprite centered on a square canvas with generous padding, no background scene
Lighting/mood: warm tooth-fairy glow, gentle gold and lavender highlights
Constraints: preserve face, hairstyle, dress, satchel, wings, proportions, and character age from the reference; no text; no watermark; no extra characters; no cheap clip art; no busy background

### Pose 1: Fly In Holding Tooth

Primary request: Tanda flies diagonally into frame, body tilted forward in a graceful arc, holding a tiny glowing baby tooth carefully in her raised hand. Her expression is focused and delighted, like she has just found something precious.
Action detail: wings slightly open with motion energy; free arm trailing naturally for balance.
Output filename: `tanda-01-fly-in-tooth.png`

### Pose 2: Hover Over Base Holding Tooth

Primary request: Tanda hovers upright above an invisible keepsake pedestal, still holding the tiny glowing tooth. She looks down warmly toward where she will place it.
Action detail: knees softly bent, body buoyant, wings open, tooth clearly still in her hand.
Output filename: `tanda-02-hover-tooth.png`

### Pose 3: Drop Tooth

Primary request: Tanda reaches downward and releases the tiny glowing tooth from her hand, placing it into an unseen magical base below her. Her hand must clearly be lower than in the reference image.
Action detail: the tooth is just leaving her fingers; expression tender and careful; no piggy bank or card visible.
Output filename: `tanda-03-drop-tooth.png`

### Pose 4: Follow Through After Drop

Primary request: Tanda has just released the tooth, hand now empty, floating upward with a satisfied gentle smile. Her gaze follows the glow where the tooth was placed.
Action detail: no tooth in her hand; one hand relaxed from the completed placement; wings catching her lift.
Output filename: `tanda-04-follow-through.png`

### Pose 5: Guide Coin

Primary request: Tanda floats beside an unseen glowing story card and guides an unseen starter gift forward with her open hand, as if encouraging it toward a piggy bank off-screen.
Action detail: keep Tanda's hands empty; the renderer draws the coin separately so the timing and piggy-bank deposit stay controllable.
Output filename: `tanda-05-guide-coin.png`

### Pose 6: Celebrate Exit

Primary request: Tanda glides away with a small proud smile and a gentle celebratory gesture, hand open with a warm sparkle glow, no tooth in hand.
Action detail: body angled upward as if exiting the scene after the gift is started.
Output filename: `tanda-06-celebrate-exit.png`

### Optional Wing Overlay

Primary request: only Tanda's iridescent pastel wings, matching the reference image exactly in style and color, separated as a transparent overlay sprite. No body, no face, no text, no background.
Output filename: `tanda-wing-overlay.png`

## Generation Notes

For transparent output with a chroma key:

- Use a flat solid #00ff00 background.
- No floor plane, shadow, gradient, reflection, or texture.
- Do not use #00ff00 in the subject.
- Remove the green locally with soft matte and despill.

If native transparency is available, use native transparent PNG instead.

## V5 Animation Plan

Replace the single Tanda cutout in the renderer with pose selection by story beat:

- 0-25 percent: `tanda-01-fly-in-tooth.png`
- 25-36 percent: `tanda-02-hover-tooth.png`
- 36-43 percent: `tanda-03-drop-tooth.png`
- 43-70 percent: `tanda-04-follow-through.png`
- 70-90 percent: `tanda-05-guide-coin.png`
- 90-100 percent: `tanda-06-celebrate-exit.png`

Keep:

- Quiet opening.
- No piggy bank until after tooth becomes story.
- Tooth must disappear from Tanda's hand after the drop.
- Story card/vault moment remains central.
- Coin and piggy bank stay simple and delayed.

## V5 Render Pass - 2026-05-05

Generated the six required Tanda pose PNGs with the approved `tanda-cutout-soft.png` reference, using Nano Banana/Gemini Pro with a chroma-key workflow and local matte removal.

Saved assets:

- `public/toothfairy/animation/pose-pack/tanda-01-fly-in-tooth.png`
- `public/toothfairy/animation/pose-pack/tanda-02-hover-tooth.png`
- `public/toothfairy/animation/pose-pack/tanda-03-drop-tooth.png`
- `public/toothfairy/animation/pose-pack/tanda-04-follow-through.png`
- `public/toothfairy/animation/pose-pack/tanda-05-guide-coin.png`
- `public/toothfairy/animation/pose-pack/tanda-06-celebrate-exit.png`

Rendered preview exports:

- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v5.webm`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v5.mp4`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-poster-v5.webp`

Notes for the next polish pass:

- Tanda's identity is materially more consistent than the single-cutout v4 loop.
- Pose 3 now gives the tooth-drop beat a clearer body-language change.
- The coin remains renderer-controlled, not baked into the Tanda sprite.
- Next refinements should focus on smoother pose blending, reducing residual green-edge glow, and making the hand-to-tooth anchor more exact during frames 36-43.

## V6 Polish Pass - 2026-05-05

Updated the drop and follow-through poses so the tooth is no longer baked into the drop sprite. The renderer now owns the tooth motion from Tanda's hand into the keepsake base, which makes hand-to-tooth alignment adjustable without regenerating the whole character.

Renderer changes:

- Added short crossfades between Tanda poses instead of hard pose switches.
- Shifted the procedural tooth hand anchor to the updated right-hand area.
- Delayed the background sparkle field until after the tooth-drop beat begins, keeping the opening calmer.
- Preserved the same story timing and safe preview-only wiring.

Rendered preview exports:

- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v6.webm`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v6.mp4`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-poster-v6.webp`

Remaining creative risk:

- The pose crossfades are smoother, but they are still sprite crossfades rather than true limb animation.
- Further improvement would require either additional in-between poses for the hand/arm or a rigged character workflow.

## V7/V8 Handoff Polish - 2026-05-05

Added two in-between pose sprites for the tooth handoff:

- `public/toothfairy/animation/pose-pack/tanda-02b-reach-down-empty.png`
- `public/toothfairy/animation/pose-pack/tanda-03b-hand-retract-empty.png`

Renderer changes:

- Added the two new in-between sprites to the pose sequence.
- Mostly bypassed the older drop pose because its raised hand made the drop feel frozen.
- Let Tanda crossfade from hover to reach-down, then to hand-retract, then to follow-through.
- Kept the tooth procedural, but in v8 delayed its visibility until the actual release moment so it no longer floats around too early.

Rendered preview exports:

- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v8.webm`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v8.mp4`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-poster-v8.webp`

V8 is preferred over V7 because V7 introduced an early floating-tooth read. V8 keeps the improved arm recovery while hiding the procedural tooth until the drop beat.

## V9 Second-Half Polish - 2026-05-05

Added two second-half Tanda pose sprites:

- `public/toothfairy/animation/pose-pack/tanda-05b-guide-down-to-pig.png`
- `public/toothfairy/animation/pose-pack/tanda-05c-celebrate-pig-glow.png`

Renderer changes:

- Added a gift-pulse beat from the secured tooth story before the coin appears.
- Changed the coin delivery into a graceful guided arc toward the piggy bank slot.
- Drew the coin and arc above Tanda during the delivery so the starter-gift path remains readable.
- Delayed the piggy bank entrance until after the memory card/vault beat.
- Added slot anticipation, impact glow, and a subtle piggy-bank bounce when the gift lands.
- Dimmed the ambient sparkle field during the piggy-bank moment so the second-half action is cleaner.

Rendered preview exports:

- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v9.webm`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v9.mp4`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-poster-v9.webp`

Static review page:

- `public/toothfairy/animation/tanda-ritual-review-v9.html`

V9 focuses on the weaker second half from v8. The first half is intentionally left close to the approved tooth-placement flow.

## Approval Criteria

The pose pack is approved only if:

- All poses read as the same Tanda.
- The tooth continuity is obvious before and after the drop.
- No pose feels cheaper or more cartoonish than the approved reference.
- Tanda feels expressive without adding explainer text.
- The assets can be cut out cleanly and animate without visible background artifacts.
