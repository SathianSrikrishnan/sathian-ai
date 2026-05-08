# Storyboard Architecture

This is the production backend for the Colosseum videos.

## Source Of Truth

The editable video structure now lives in:

- `src/remotion/colosseum/storyboards.ts`
- `src/remotion/colosseum/types.ts`

Each scene has:

- scene id
- title
- duration
- speaker
- approval status
- objective
- narration
- visual plan
- capture direction
- production notes
- asset slots

This lets us approve and replace scenes one by one without losing the whole edit.

## Remotion Compositions

The Remotion root now exposes two review compositions:

- `Colosseum-Pitch-Storyboard`
- `Colosseum-Technical-Storyboard`

Both render as 16:9 storyboard videos. They currently show the intended timing, narration, production notes, and missing asset slots. Tanda scenes use the current v32 Tanda loop and `tanda-v2-reference.jpg` as placeholder visual material.

Render helper:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/render-colosseum-storyboards.ps1 -Mode pitch
```

Current environment note: TypeScript passes, but the Remotion CLI currently hits a local `spawn EPERM` while starting its bundler and warns that `zod` is installed as 3.22.4 while Remotion expects 3.22.3. The storyboard code is ready; final rendering may need that local Remotion environment issue cleared.

## Asset Folders

Project-bound production assets should land here:

- `public/colosseum-frontier-2026/captures/`
- `public/colosseum-frontier-2026/avatar/`
- `public/colosseum-frontier-2026/audio/`
- `public/colosseum-frontier-2026/exports/`

Use stable filenames. Good examples:

- `pitch-p03-product-flow-screen-v1.mp4`
- `pitch-p04-gift-link-screen-v1.mp4`
- `technical-t03-pda-model-v1.png`
- `avatar-tanda-opening-v1.mp4`
- `founder-soundbite-why-solana-take-02.wav`

## Approval Flow

1. Approve the scene objective and narration.
2. Capture or generate the scene's asset slots.
3. Drop the assets into `public/colosseum-frontier-2026/...`.
4. Update the matching slot path/status in `storyboards.ts`.
5. Render the storyboard again.
6. When the scene feels right, mark it `approved`.

## Next Evolution

The current compositions are review boards. Once enough assets are captured, the next layer is a final-edit composition that uses the same scene data but swaps the review layout for real full-screen video, captions, Tanda avatar clips, and proof overlays.
