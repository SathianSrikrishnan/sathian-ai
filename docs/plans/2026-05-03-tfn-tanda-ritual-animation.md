# TFN Tanda Ritual Homepage Animation

Date: 2026-05-03

## Product Intent

Tooth Fairy Network is a child's first digital piggy bank disguised as a magical family ritual.

The homepage animation should make that sentence visually obvious. Tanda should not be decoration. She should perform the core product ritual:

1. A lost tooth is found.
2. The tooth becomes a saved keepsake.
3. A tiny gift appears.
4. The gift moves into the Smile Fund.
5. The final state reads as parent-controlled, warm, and safe without needing a text explainer.

## Current Placeholder Audit

Files audited:

- `src/app/animation/page.tsx`
- `src/components/toothfairy/chain-of-teeth.tsx`

Recommendation: replace for homepage use, keep temporarily as an archived experiment.

Why:

- The current `/animation` route is a full-screen canvas network demo. It is technically ambitious, but it tells a broader "chain of teeth" story instead of the V2 parent ritual.
- `ChainOfTeeth` generates cards, names, stars, network threads, multiple fairies, CTAs, counters, and overlay copy. That makes it feel like an explainer page rather than a refined hero asset.
- The placeholder leans on network/blockchain metaphor. V2 needs the product to feel like memory first, Smile Fund second, technology quietly underneath.
- The current component owns the whole viewport and navigation CTA behavior. A homepage asset should be composable inside the hero and should not decide routing.
- The canvas approach gives high control, but it makes art direction, responsive tuning, reduced motion, and static fallback harder than needed for this specific story.

Reuse:

- Reuse the celestial warmth, golden nodes, and magical motion language.
- Reuse the idea of a fairy depositing value into a larger system.

Do not reuse:

- The generated keepsake grid, counter, full-screen CTA overlay, and "chain" framing for the V2 homepage hero.

Archive path after the new loop is approved:

- Keep `/animation` as an internal preview for now.
- Later rename or move `chain-of-teeth.tsx` into an experiments folder, or remove it after screenshots/video capture if it no longer supports a live route.

## Recommended Architecture

Use a React component with layered HTML/CSS animation, not canvas.

Reasoning:

- The ritual has a fixed seven-beat story, so declarative layers are easier to art-direct than a procedural canvas scene.
- Existing TFN images can be used directly through `next/image`.
- CSS keyframes keep the component dependency-light and simple to pause for reduced motion.
- The hero can render a static final state if animations are disabled or fail.
- HTML elements give better accessible semantics than canvas without duplicating the whole scene in offscreen text.

Component target:

- `src/components/toothfairy/home/tanda-ritual-loop.tsx`

Preview route:

- `src/app/animation/tanda-ritual/page.tsx`

Do not wire to production homepage yet.

## Visual Direction

North-star assets:

- `public/fairy-assets/fairy-network-rays.jpg`
- `public/fairy-assets/fairy-network-sky.jpg`
- `public/fairy-assets/fairy-hover-alt.png`
- `public/toothfairy/tanda.png`
- `public/story-assets/tanda/tf-05-tanda.png`

Preferred first implementation:

- Use the celestial banner/rays as the stage background.
- Use `fairy-hover-alt.png` as the animated Tanda layer because it already reads as small, expressive, tooth-carrying, and night-sky compatible.
- Use refined CSS/SVG objects for the vault, saved keepsake, coin, and Smile Fund piggy bank. These should feel like premium interface-symbol props, not clip art.

Palette:

- Deep night: `#0a1024`, `#111a36`
- Warm cream: `#fbf7ee`
- Fairy gold: `#d8a43c`, `#efcf7c`
- Soft aqua accent: `#6ed9d0`, used sparingly as inherited celestial network light
- Parent-safe ink: `#11234a`

Avoid:

- Busy labels
- Blockchain terms
- Token/ledger UI
- Cartoonish outlined icons
- Purple-blue gradient dominance

## Storyboard

Runtime target: 12 to 14 seconds, infinite loop.

Beat 1 - Entrance, 0.0s to 1.7s:

- Tanda drifts in from the lower-left edge with a soft gold dust trail.
- Her tooth glow is visible before her full body settles, so the eye understands what she carries.

Beat 2 - Discovery/carry, 1.7s to 3.2s:

- The glowing tooth lifts slightly from Tanda's hands and hovers between Tanda and the vault.
- Tanda tilts toward the vault rather than flying randomly.

Beat 3 - Memory vault, 3.2s to 5.4s:

- A small keepsake chest or memory vault opens with a warm inner glow.
- The tooth travels into the vault.
- A thin ring closes around the tooth, implying "saved" without words.

Beat 4 - Keepsake saved, 5.4s to 6.8s:

- The vault resolves into a small keepsake card/window with the tooth silhouette protected inside.
- Sparkles become calmer and more ordered. This is the emotional "memory saved" moment.

Beat 5 - Gift appears, 6.8s to 8.1s:

- A tiny gold coin/light appears above the saved keepsake.
- The coin should feel like a byproduct of the ritual, not the main object.

Beat 6 - Smile Fund, 8.1s to 10.8s:

- Tanda guides the coin along a curved stardust path to a piggy bank / Smile Fund object.
- The path should be one clean arc, not a network diagram.

Beat 7 - Final state, 10.8s to 13.2s:

- Vault and piggy bank both glow softly.
- Tanda hovers between them in a quiet guardian pose.
- Optional tiny status marks can appear in preview: "Memory saved" and "Smile Fund started." For homepage use, these can be hidden if the surrounding hero copy already says enough.

## Reduced Motion

For `prefers-reduced-motion: reduce`:

- Disable all looping keyframes.
- Show a static final frame: Tanda, saved tooth vault, coin glow, and Smile Fund.
- Keep no flashing pulse. Use a single low-opacity glow.

## Responsive Behavior

Desktop:

- Use a wide cinematic panel, approximately 16:10.
- Max width around 900 to 980px when used inside the hero.
- Tanda should occupy 22 to 30 percent of the panel width.

Mobile:

- Use a taller 4:5 composition.
- Keep Tanda centered above the action path.
- Stack the vault and Smile Fund diagonally from lower-left to lower-right so the story still reads in one glance.
- Avoid tiny labels below 360px wide.

## Static Fallback

The component should be meaningful even if animation is not running:

- Background renders.
- Tanda image renders.
- Tooth appears saved in the vault.
- A coin/light sits near or inside the Smile Fund.
- Accessible labels describe the still frame.

## Implementation Notes

- Keep the component self-contained and prop-light for the preview.
- No homepage import until the preview is reviewed.
- No route navigation or CTA ownership inside the component.
- Avoid runtime randomness so screenshots and visual regression checks are stable.
- Add a small E2E guard that ensures the preview route renders the visual semantics.

## Homepage Integration Path

After approval, the component can replace the current static product preview area in `src/app/toothfairy/page.tsx` hero.

Suggested integration:

- Put the ritual loop in the right side of the hero where the current family/product collage lives.
- Keep one headline and one short lede only.
- Let the loop carry the "save memory, start fund" explanation so the hero can remove supporting chips like "Built on Solana" from the first viewport.

Open decision before production:

- Whether the final hero uses the tiny "Memory saved" / "Smile Fund started" status marks, or whether those stay preview-only.
