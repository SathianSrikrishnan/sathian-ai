# TFN Hero Ritual Animation Maintenance

Status: V34 approved for deployment testing

## What Is Stored Where

The deployable hero animation is stored as static video assets:

- MP4: `public/toothfairy/animation/tfn-tanda-hero-integrated-loop-v34.mp4`
- WebM: `public/toothfairy/animation/tfn-tanda-hero-integrated-loop-v34.webm`
- Poster fallback: `public/toothfairy/animation/tfn-tanda-hero-integrated-poster-v34.webp`
- Static review page: `public/toothfairy/animation/tfn-tanda-hero-integrated-v34-review.html`

The website reads those files through:

- `src/components/toothfairy/home/tanda-ritual-assets.ts`
- `src/components/toothfairy/home/tanda-ritual-hero-video.tsx`
- Preview page: `src/app/animation/tanda-hero-ritual/page.tsx`
- Homepage-style review page: `src/app/toothfairy/ritual/page.tsx`

The editable source timeline is:

- `scripts/render-tanda-hero-integrated-video.ps1`
- Remotion mirror: `src/remotion/TandaHeroIntegratedRitual.tsx`

Supporting art is stored under:

- `public/toothfairy/animation/hero-pose-pack-v21`
- `public/toothfairy/animation/hero-pose-pack-v22-pre`
- `public/toothfairy/animation/layered`
- `public/toothfairy/visual-system`

## How To Upgrade Later

1. Make visual or timing edits in `scripts/render-tanda-hero-integrated-video.ps1`.
2. Keep the Remotion mirror in `src/remotion/TandaHeroIntegratedRitual.tsx` in sync if the React animation source still matters for future video tooling.
3. Render a new version number, for example V35.
4. Update `TANDA_RITUAL_ASSET_VERSION` in `src/components/toothfairy/home/tanda-ritual-assets.ts`.
5. Verify the preview route and the static review page.
6. Deploy only after mobile playback and load feel acceptable.

## Known V34 Follow-Up

There is one tooth-holding beat around the 9-11 second area that can be refined later. It is acceptable for deployment testing, but the next polish pass should simplify that beat so Tanda moves from phone work to the coin transition with less visual ambiguity.

## Deployment Testing Path

Use these before making the animation the default homepage hero:

- Full hero-style route: `/toothfairy/ritual`
- Clean animation route: `/animation/tanda-hero-ritual?v=34`
- Static review file: `/toothfairy/animation/tfn-tanda-hero-integrated-v34-review.html`

The animation is designed to be lightweight enough for hero testing. Current V34 sizes are roughly:

- MP4: 792 KB
- WebM: 496 KB
- Poster: 27 KB

Reduced-motion users receive the poster image instead of the autoplaying video.
