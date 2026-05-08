# Render Log

Created: 2026-05-06

## Existing Render Assets Found

Latest existing integrated Tanda render:

- `public/toothfairy/animation/tfn-tanda-hero-integrated-loop-v32.mp4`
- `public/toothfairy/animation/tfn-tanda-hero-integrated-poster-v32.webp`
- `public/toothfairy/animation/tfn-tanda-hero-integrated-v32-review-strip.jpg`

Other available loops:

- `public/toothfairy/animation/tfn-tanda-hero-loop.mp4`
- `public/toothfairy/animation/tfn-tanda-hero-layered-loop.mp4`
- `public/toothfairy/animation/tfn-tanda-ritual-layered-loop-v9.mp4`

## Next Render Step

Generate a pitch-specific Tanda CEO source still or short test clip, then produce one 10 to 15 second avatar proof before committing to the final avatar style.

## Colosseum Packet Assets

- `public/colosseum-frontier-2026/avatar/candidates/tanda-faye-ceo-still-v2.png` - current Tanda Faye CEO still candidate.
- `public/colosseum-frontier-2026/diagrams/diagram-family-network-v1.png` - distributed family graph.
- `public/colosseum-frontier-2026/diagrams/diagram-solana-stack-v1.png` - Solana stack diagram.
- `public/colosseum-frontier-2026/diagrams/diagram-pda-model-v1.png` - Anchor/PDA model diagram.
- `public/colosseum-frontier-2026/diagrams/diagram-why-solana-v1.png` - Why Solana overlay.

## Preview Frame Generated

- `renders/tanda-hero-preview-frame-480/frames/frame_0480.png`
- Generated from `scripts/render-tanda-hero-integrated-video.ps1` with `-OnlyFrame 480`.
- Purpose: first concrete visual handoff for the pitch workspace.
- Note: Windows script execution policy blocked a direct run, so the frame was generated with a one-time process-level execution-policy bypass.

## Storyboard Render Status

- TypeScript check passed with `node_modules/.bin/tsc.cmd --noEmit --pretty false` after wiring the packet assets.
- Remotion composition listing currently fails locally before rendering with `spawn EPERM` from esbuild and a Remotion warning about `zod` 3.22.4 vs expected 3.22.3.
- The storyboard compositions are wired in code, but video export needs the local Remotion CLI environment unblocked.

## Render Acceptance Checklist

- Tanda face is stable and readable at mobile size.
- Mouth movement does not distort the character.
- Wings do not flicker over the face.
- Audio is intelligible without music.
- Captions do not cover app UI or Tanda's face.
- Shot can be cut cleanly after 8 to 18 seconds.
