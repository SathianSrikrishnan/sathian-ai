# TFN Tanda Keepsake Studio Production Pack

Date: 2026-05-04

## Production Decision

Concept 1, **Tanda's Keepsake Studio**, is approved as the homepage hero animation story.

The approved flow lives here:

- `public/toothfairy/animation/tanda-keepsake-studio-storyboard-v2-approved.png`
- `public/toothfairy/animation/tanda-keepsake-studio-styleframes-v3-old-tanda.png`

The current motion-preview frame assets live here:

- `public/toothfairy/animation/keepsake-studio-frames/frame-clean-1.png`
- `public/toothfairy/animation/keepsake-studio-frames/frame-clean-2.png`
- `public/toothfairy/animation/keepsake-studio-frames/frame-clean-3.png`
- `public/toothfairy/animation/keepsake-studio-frames/frame-clean-4.png`
- `public/toothfairy/animation/keepsake-studio-frames/frame-clean-5.png`
- `public/toothfairy/animation/keepsake-studio-frames/frame-clean-6-v2.png`

The approved Tanda character model lives here:

- `public/toothfairy/animation/tanda-cartoon-mvp.png`

Use the storyboard for sequence, staging, glow language, vault moment, piggy payoff, and overall premium storybook feel. Do not use the storyboard fairy as the final Tanda model. Final frames should preserve the older Tanda reference: loose brown hair, soft white dress, iridescent wings, small pouch, warm expression, and delicate tooth-holding pose language.

The first viewable browser motion preview is wired at:

- `/animation/tanda-ritual`

The approved video export is wired at the same route and uses:

- `public/toothfairy/animation/tfn-tanda-hero-loop.webm`
- `public/toothfairy/animation/tfn-tanda-hero-loop.mp4`
- `public/toothfairy/animation/tfn-tanda-hero-poster.webp`
- `src/components/toothfairy/home/tanda-ritual-hero-video.tsx`

## Locked Story Beats

1. Tanda flutters in holding the tiny glowing tooth.
2. Tanda presents the tooth on a glowing keepsake pedestal. No piggy bank is visible.
3. A digital story card forms around a smaller tooth with tiny story text marks.
4. The story card becomes protected inside a warm memory vault.
5. The piggy appears for the first time as a dollar-sign coin arcs toward it.
6. Tanda, the vaulted story, and the piggy glow together. The gift is implied inside the piggy through a warm slot/body glow, not through a separate coin sitting above the pig.

## Shared Frame Prompt

Use this shared prompt prefix for all frame generation:

```text
Premium 3D storybook cartoon style for Tooth Fairy Network, warm cream celestial atmosphere, soft gold and lavender glow, polished parent-friendly product aesthetic. Use the approved Tanda character reference: young tooth fairy with loose brown hair, soft white dress, iridescent pastel wings, small pouch, warm expressive face, delicate hands, holding or guiding a tiny glowing tooth. Keep Tanda consistent across frames. No purple dress, no hair bun, no cheap clip art, no flat vector style, no blockchain jargon, no busy labels, no dark sci-fi styling.
```

## Individual Frame Prompts

### Frame 1 - Tanda Enters

```text
Tanda flutters in from the left holding a tiny glowing baby tooth carefully in both hands. She leaves a refined gold-lavender sparkle trail. The frame is airy, magical, and warm. No piggy bank, no card, no vault yet.
```

### Frame 2 - Tooth Ritual

```text
Tanda hovers above a small glowing moonstone keepsake pedestal, presenting the tooth as the emotional center of the scene. The tooth glows softly. Keep the frame intimate and precious. The piggy bank must not be visible.
```

### Frame 3 - Story Card Forms

```text
A premium translucent story card begins forming around the tooth. The tooth is smaller and centered near the top of the card. Add the tiny readable title "TOOTH STORY" and several short abstract story-line marks beneath it. The card feels like a saved family memory, not a trading card. No piggy bank visible.
```

### Frame 4 - Memory Vault

```text
The story card is now protected inside a glowing memory vault: warm gold rim, clear safe-shell, subtle lock detail, and a protective magical ring. Tanda gently guards or hugs the protected card. The feeling is safe, saved, parent-controlled, and premium. No piggy bank visible.
```

### Frame 5 - Smile Fund Starts

```text
The piggy bank appears for the first time on the right. Use a glossy pink smiling piggy bank with a Solana-style three-stripe side mark. A gold coin with a clear dollar-sign symbol emerges from the protected story card and arcs toward the piggy bank on a refined sparkle trail.
```

### Frame 6 - Resolved Glow

```text
The coin has landed in the piggy bank. Tanda hovers nearby, smiling. The protected story card / memory vault glows beside the piggy. Remove any separate floating dollar coin above the piggy. Make the piggy bank glow warmly gold around the coin slot and body so the value feels received inside the Smile Fund. Tanda, the vaulted keepsake story, and the piggy bank all glow clearly. The message is memory saved, tiny gift started, parent-controlled.
```

## Motion Target

Build the first production animation as a 6-8 second video-first hero loop, not a live CSS prototype.

Timing:

- 0.0-1.2s: Tanda enters with tooth.
- 1.2-2.3s: Tooth lands above pedestal and glows.
- 2.3-3.6s: Story card forms around the smaller tooth.
- 3.6-4.8s: Vault/safe-shell closes gently around the story.
- 4.8-6.2s: Dollar coin arcs to piggy bank.
- 6.2-7.4s: Piggy receives coin, the visible coin disappears into the slot, and all three elements glow.
- 7.4-8.0s: Sparkle reset for seamless loop.

## Homepage Integration Target

Final homepage asset should be:

- `public/toothfairy/animation/tfn-tanda-hero-loop.webm`
- `public/toothfairy/animation/tfn-tanda-hero-loop.mp4`
- `public/toothfairy/animation/tfn-tanda-hero-poster.webp`

The homepage should render the video with no controls, no sound, a poster image for first paint, and a reduced-motion fallback that shows the final glow still.

Export status:

- Complete for safe preview.
- Duration: about 7.7 seconds.
- Resolution: 1440x900.
- Audio: none.
- WebM is the primary browser source; MP4 is the fallback.

## Acceptance Checklist

- Tanda matches the older approved model.
- Frame 2 has no piggy bank.
- Frame 3 reads as a story/memory card, not a large tooth NFT card.
- Frame 4 clearly communicates protected/vaulted.
- Coin has a dollar sign.
- Piggy has the Solana-style side mark.
- Final frame does not show a separate floating dollar coin above the piggy.
- Tanda, story vault, and piggy all glow in the final moment, with the strongest payoff glow around the piggy slot/body.
- No heavy explanatory labels are needed.
