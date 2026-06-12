# Toothlight V4 Stitch Flow First-50 Roadmap

Date: 2026-06-09
Status: implemented locally; ready for first-50 mobile preview retest

## Decision

The first-50 Toothlight onboarding loop now starts with the Toothlight itself, not the technical mint/save flow. A Toothlight is an activity a parent and child do together to preserve a tooth memory as an AI-enhanced time capsule.

The revised create flow supports three first visuals:

1. A photo of finished school artwork.
2. A drawing made on screen.
3. A photo, with optional drawing and AI enhancement.

The parent gate has moved earlier. A child can choose or create the first visual, then a parent signs in before the app makes the glow, saves the AI-enhanced Toothlight, or seals the memory.

## Route Flow

The mobile path now routes through these screens:

1. `/toothlight/start` - choose school drawing or create now.
2. `/toothlight/add-school-drawing` - photograph a physical drawing.
3. `/toothlight/create-source` - choose draw on screen or start with photo.
4. `/toothlight/draw` - use the existing drawing canvas.
5. `/toothlight/add-photo` - upload or capture the first photo.
6. `/toothlight/parent-check` - Google parent gate, with no-cost reassurance.
7. `/toothlight/glow` - keep original, soft glow, or storybook magic.
8. `/toothlight/story` - child story by typing or voice assist.
9. `/toothlight/preview` - review the memory capsule before sealing.
10. `/toothlight/parent-note` - parent writes the future note.
11. `/toothlight/seal` - seal memory only or optionally add a parent-controlled gift.
12. `/toothlight/saved` - saved confirmation and family handoff.

`/toothlight/make` now redirects into `/toothlight/start`.

## Product Rules

- The original uploaded or drawn image stays separate from the enhanced Toothlight image.
- The enhanced image becomes the reusable Toothlight material for the site, storybook lore, and future Ratoncito, Tanda, and Daga scenes.
- The child-facing flow avoids wallet and payment language.
- Solana appears only in the parent-facing seal/saved trust layer.
- Gift remains optional and parent-controlled.
- Local preview can use the explicit test flag on localhost to complete the parent gate without real Google OAuth; deployed production keeps the real Google gate.

## First-50 Retest

Use this loop for the next small tester pass:

1. Ask each family to complete one school-artwork Toothlight or one photo Toothlight.
2. Watch for friction at the early parent gate.
3. Confirm the first visual remains recognizable after glow.
4. Confirm the child can tell the story without needing parent help for every field.
5. Confirm the parent note and optional gift feel like a later-time capsule action, not a checkout.
6. Confirm the saved Toothlight image feels like a physical object that can appear elsewhere in the Network.

## Verification

Local production-style preview:

```powershell
$env:NEXT_PUBLIC_TEST_MODE='true'
npm run build
npm start -- -H 0.0.0.0 -p 3002
```

Main local test URL:

```text
http://localhost:3002/toothlight/start
```

Focused source checks:

```powershell
node tests\toothlight-v4-stitch-flow.test.mjs
node tests\toothlight-v4-draft-storage.test.mjs
node tests\toothlight-v4-routing.test.mjs
node tests\toothlight-v4-save-api.test.mjs
node tests\toothlight-v4-auth-return.test.mjs
```
