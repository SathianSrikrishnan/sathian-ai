# TFN Hero Ritual Animation Rebuild

Date: 2026-05-05
Status: Rebuild in progress after V20 prototype

## Current Preview Path

Local desktop preview:

- `http://127.0.0.1:3000/animation/tanda-hero-ritual?iteration=v21`

Same-Wi-Fi mobile preview:

- `http://192.168.1.105:3000/animation/tanda-hero-ritual?iteration=v21`
- Forced-motion mobile preview:
  - `http://192.168.1.105:3000/animation/tanda-hero-ritual?iteration=v22&motion=force`
- Lightweight static mobile review page:
  - `http://192.168.1.105:3000/toothfairy/animation/tanda-hero-mobile-review-v22.html`
- Pose and asset review sheets:
  - `http://192.168.1.105:3000/toothfairy/animation/hero-pose-pack-v22-pre/tanda-hero-v22-pre-tooth-contact-sheet.png`
  - `http://192.168.1.105:3000/toothfairy/animation/hero-pose-pack-v21/tanda-hero-v21-contact-sheet-24.png`
  - `http://192.168.1.105:3000/toothfairy/animation/hero-support-assets-v22.png`

Public Vercel preview is the better long-term review path, but the current workspace blocked the repo upload step as an external-service safety guard. Until that permission path is cleared, same-Wi-Fi preview is the fastest way to test mobile load, scale, and readability.

## Decision Log

- Base direction approved: `capture-base-a-round-hologram`.
- Implementation asset selected: `capture-base-a-platform-cropped.png`, a platform-only version of A.
- Reason: the full A image has a floating tooth baked in, which causes duplicate-tooth confusion before Tanda drops the tooth. The platform-only asset lets the animation control exactly when the hologram tooth appears.
- Tanda pose target increased from 8-12 frames to a 24-frame performance pass.
- The phone beat now has distinct poses for photo, one-finger tap, two-thumb typing, and capture complete.
- The back half now has distinct poses for coin notice, pickup, carry, release, pig-glow reaction, wave, and exit.
- A new 8-frame pre-tooth pose pass was added after mobile review feedback. Tanda now enters without the tooth, searches, spots it, reaches, grabs it, lifts it close, and begins the wing-glow carry.
- The hero memory card language is now "Live Memory" / "Saved" instead of blunt NFT language. The NFT meaning can remain in the product system without making the hero feel technical.
- The safest mobile review path is the static HTML page above. It uses the same public assets but avoids the heavier Next route while we are still iterating.

## Why We Are Recalibrating

V20 proved the story direction, but it also proved the current method is near its ceiling. The animation is still choppy because we are asking a small number of mismatched still poses to behave like a character performance.

The right next step is not more tiny CSS tweaks. The right next step is a purpose-built asset pass:

- Static, polished hero anchors: the child photo, the blockchain capture base, and the Solana piggy bank.
- A deliberate Tanda pose sequence built for this exact path.
- A slower, readable pause at the base where the capture/mint moment happens.
- Only three outputs from the base: Tooth NFT, Smile Fund card, and coin.

The animation should feel like a short ritual, not a UI diagram.

## Target Final Loop

Length target: 8-10 seconds.

Story:

1. Tanda flutters in from off-screen with the tooth.
2. She approaches the child/photo tooth moment and slows down.
3. She pulls out or raises a phone.
4. She pauses over the base and captures the tooth.
5. The base glows and the tooth becomes a hologram.
6. Three outputs emerge: Tooth NFT, Smile Fund card, and a coin.
7. Tanda takes/guides the coin into the Solana piggy bank.
8. The pig glows.
9. Tanda turns toward the viewer, waves goodbye, and exits.

## Stage Architecture

Use the hero stage as a hybrid animation:

- HTML/CSS/React for layout, cards, trails, glow, reduced-motion state, and responsive sizing.
- Static raster assets for the polished base, piggy bank, Tanda frames, and any high-quality product-style objects.
- CSS or Motion timing for moving the selected Tanda frame stack along a single continuous path.
- No production homepage wiring until the preview loop is approved.

Static anchors:

- Family/photo hero image: current asset is acceptable for now.
- Blockchain capture base: needs a real generated asset, not the current CSS proxy.
- Solana piggy bank: current cutout is good enough for layout, but final may need one more clean render with better scale and grounding.

## Frame Budget

Current state:

- Legacy Tanda PNG poses in repo: 14.
- V21 generated hero ritual poses: 24.
- V22 generated pre-tooth poses: 8.
- Current review frame budget: 32 Tanda poses total before optimization.
- Remaining risk: the V21 and V22 pose packs are visually close, but the final hero pass still needs timing, scale, and hand/coin alignment refinement.

Target final:

- 32-36 Tanda frames total if the pre-tooth pickup remains in the homepage loop.
- Use alpha WebP/PNG source assets, then optimize before homepage use.
- The active first viewport can load a smaller subset first, then lazy-load optional exit/wave frames if needed.

This is acceptable for performance if we:

- Convert large PNGs to alpha WebP or AVIF where supported.
- Keep rendered frame dimensions consistent, likely around 512-768 px square before responsive scaling.
- Use a sprite sheet or stable preloaded image list instead of many layout-shifting individual images.
- Avoid autoplay video as the only source of truth, because we want responsive, layered hero composition.

## Tanda Pose List

Generate a new hero-specific pose pack using the approved Tanda identity.

### Entry And Flutter

1. `tanda-hero-01-entry-left-glide`
   - Tanda enters from left/off-screen, body angled forward, wings open, smiling softly.

2. `tanda-hero-02-entry-wing-up`
   - Same path, wing-up flutter in-between, tooth visible in right hand.

3. `tanda-hero-03-entry-wing-down`
   - Wing-down flutter in-between, body still moving forward.

4. `tanda-hero-04-slowing-near-photo`
   - Tanda brakes near child/photo tooth, expression focused and delighted.

### Tooth And Phone

5. `tanda-hero-05-holding-tooth-clear`
   - Tooth clearly in right hand, no phone yet or phone hidden near satchel.

6. `tanda-hero-06-left-hand-to-satchel`
   - Left hand reaching to satchel, right hand still holding tooth.

7. `tanda-hero-07-phone-emerging`
   - Phone partially out of satchel in left hand.

8. `tanda-hero-08-phone-ready`
   - Phone clearly held in left hand, right hand holds tooth.

### Capture Base Pause

9. `tanda-hero-09-descend-to-base`
   - Tanda lowers toward the base, phone left, tooth right.

10. `tanda-hero-10-place-tooth-over-base`
    - Right hand lowers tooth into the hologram area.

11. `tanda-hero-11-photo-pose`
    - Tanda pauses, phone up, taking a photo/capture of the tooth.

12. `tanda-hero-12-photo-flash-reaction`
    - Small delighted face change as the tooth glows.

13. `tanda-hero-13-magic-pause`
    - Tanda hovers still, both hands visible, watching the base transform.

14. `tanda-hero-14-hand-empty-after-drop`
    - Right hand now empty, phone still in left hand or being lowered.

### Coin And Pig

15. `tanda-hero-15-notices-coin`
    - Tanda turns toward coin emerging from base.

16. `tanda-hero-16-picks-up-coin`
    - Tanda reaches for coin with right hand.

17. `tanda-hero-17-carries-coin`
    - Coin clearly in right hand, body angled toward pig.

18. `tanda-hero-18-guides-coin-to-pig`
    - Arm extended toward piggy bank slot.

19. `tanda-hero-19-coin-release`
    - Coin just leaving hand, pig slot below.

20. `tanda-hero-20-pig-glow-reaction`
    - Tanda smiles at the pig glow.

### Goodbye Loop

21. `tanda-hero-21-turn-front`
    - Tanda rotates toward viewer/audience.

22. `tanda-hero-22-wave-start`
    - Friendly wave begins.

23. `tanda-hero-23-wave-open`
    - Clear wave pose, smile, wings softly open.

24. `tanda-hero-24-exit-right`
    - Tanda exits up/right, still warm and playful.

Optional in-betweens if the first batch still feels choppy:

- Extra wing-up/wing-down alternates for frames 1-4.
- Extra phone transition frame between 7 and 8.
- Extra coin handoff frame between 18 and 19.
- Extra wave frame between 22 and 23.

## Base Asset Pack

The base is symbolically important. It should read as the magical blockchain/capture device without looking like technical jargon.

Generate three base options:

1. `capture-base-a-round-hologram`
   - Round lavender/gold platform, glowing tooth hologram, subtle Solana-colored inlay, premium 3D storybook style.

2. `capture-base-b-keepsake-plinth`
   - Small elegant keepsake plinth with glassy top, hologram tooth, warm gold glow, Solana-colored accent lines.

3. `capture-base-c-memory-vault-pad`
   - Low rounded rectangular pad, premium toy-like finish, tooth hologram, soft magical particles, child-friendly but not cheesy.

Base requirements:

- No text baked into the image.
- No blockchain jargon.
- Transparent cutout or green-screen source that can be keyed cleanly.
- Camera angle should match the piggy bank: three-quarter front, grounded on the hero stage.
- Must still look good when small in the bottom-left of the photo/product area.

## Prompt Direction

### Master Tanda Prompt

Use this as the base for each pose:

```text
Create a transparent character sprite of Tanda, the same small expressive tooth fairy from the provided reference. Premium 3D storybook illustration, warm parent-friendly magical tone, soft brown wavy hair, warm brown eyes, delicate iridescent pastel wings, white airy dress, small brown satchel, gentle smile, high-quality polished render. Full body visible, centered with generous padding, consistent face, hair, wings, dress, satchel, proportions, and lighting across all poses.

The sprite must be on a perfectly flat solid #00FF00 chroma-key background for removal. No floor, no cast shadow, no scene background, no text, no watermark, no extra characters, no piggy bank, no card, no base unless explicitly requested.
```

Each pose prompt should add only the exact body action and hand state.

### Master Base Prompt

```text
Create a premium 3D storybook magical capture base for Tooth Fairy Network. A small elegant platform that symbolizes a child-friendly blockchain memory capture device: lavender and warm gold materials, subtle Solana-colored accent inlays, a glowing hologram tooth projection above the surface, soft magical light, parent-friendly, premium, playful but not cheap. Three-quarter front view, isolated object, no text, no labels, no characters.

Place the object on a perfectly flat solid #00FF00 chroma-key background for removal. No floor, no cast shadow, no reflection, no scene background, no watermark.
```

## Loading And Performance

Tripling the number of images is fine if we treat this like a real hero asset pipeline.

Rules:

- Generate source assets at high quality.
- Process transparent PNGs into optimized alpha WebP/AVIF versions.
- Keep one consistent visual size for Tanda frames so the wrapper does not shift.
- Preload the first 8-12 frames needed for the entry/capture moment.
- Lazy-load later wave/exit frames after initial render if needed.
- Provide a static fallback frame for reduced motion and slow connections.
- Keep the animation in a safe preview route until the final asset budget is measured.

Risk:

- If we ship 30 full-size PNGs unoptimized, page weight will be too high.

Mitigation:

- Use optimized WebP sprites or frame sheets for production. The source PNGs can stay in the repo for editing, but the homepage should use optimized versions.

## Proposed Next Work Order

1. Generate the base asset pack first, 3 options.
2. Choose one base direction.
3. Generate the first 12 Tanda frames: entry through photo/magic pause.
4. Wire those into a new V21 preview to test the front half.
5. Generate the coin/pig/wave frames.
6. Wire full V22 preview.
7. Optimize assets and measure page weight.
8. Only then discuss replacing the production homepage hero.

## Recommendation

Proceed with the rebuild. The current V20 prototype has done its job: it found the story, the stage anchors, and the missing frame coverage. The next quality leap requires a designed pose pack and a real base asset, not more incremental CSS patching.
