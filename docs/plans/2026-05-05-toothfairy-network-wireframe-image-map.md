# Tooth Fairy Network Wireframe And Image Map

Current-state image and layout planning map for `toothfairy.network`, captured 2026-05-05.

## Scope

This is the working image replacement ledger. It maps visible page slots, current assets, and recommended review status.

Primary source files:

- `src/app/toothfairy/page.tsx`
- `src/app/toothfairy/stories/page.tsx`
- `src/app/toothfairy/story/[tradition]/page.tsx`
- `src/app/toothfairy/app/page.tsx`
- `src/app/toothfairy/app/gift/[milestone]/page.tsx`
- `src/app/toothfairy/keepsake/[id]/page.tsx`
- `src/app/toothfairy/visual-system/page.tsx`
- `src/data/stories/*`
- `src/data/wall-cards/*`
- `public/toothfairy/*`
- `public/story-assets/*`

Legend:

- `Keep` - usable as-is for now.
- `Review` - visually acceptable but should be judged in the next design pass.
- `Replace` - should be swapped or regenerated.
- `Missing` - referenced by code but not present in `public`.
- `Generated` - user-uploaded, canvas, minted, or API-sourced content.

## Homepage Wireframe

Route: `/` on `toothfairy.network`

Internal source: `src/app/toothfairy/page.tsx`

```text
[Sticky header]
  brand
  How it works | Stories | FAQ
  Parent controlled pill | Create a memory CTA

[Hero]
  Left:
    headline
    supporting copy
    Create their memory CTA
    See how it works CTA
  Right:
    large family-frame image
    tooth SVG overlay
    live memory mini-card
    Smile Fund mini-card
    decorative network lines

[Proof strip]
  3 cards: wallet, gift, tooth

[How it works]
  intro
  3 image cards:
    1. A tooth comes out
    2. Make it theirs
    3. Share the Smile Fund

[Smile Fund]
  copy block
  dashboard mock:
    CSS mini chart
    balance
    stats
    family giver list

[Story world band]
  full-width background image
  story copy
  3 story cards
  Read a story together CTA

[Footer]
  product links
  story links
  company links
  email signup
```

## Homepage Image Slots

| Slot | Current asset | Source | Status | Notes / next action |
| --- | --- | --- | --- | --- |
| Hero family frame | `/toothfairy/visual-system/hero-family-v1.png` | `src/app/toothfairy/page.tsx` | Review | Primary above-the-fold product image. Judge crop, missing-tooth clarity, parent-child warmth, and whether it feels too generated. |
| Live memory mini-card | `https://gateway.irys.xyz/Z9_aFKhX6xpU1cZvw0h4u3zfJwhfJ1wiBf72KQWGF5k` | `src/app/toothfairy/page.tsx` | Review | Remote asset outside repo. Decide whether to keep as a real minted memory or replace with a local branded keepsake render. |
| Tooth badge overlay | Inline SVG | `src/app/toothfairy/page.tsx` | Keep | Code-drawn, not an image replacement slot. |
| Hero network lines | Inline SVG/CSS | `src/app/toothfairy/page.tsx` | Keep | Decorative structure only. |
| Step 1: save moment | `/toothfairy/visual-system/save-moment-v1.png` | `src/app/toothfairy/page.tsx` | Review | Should read as camera/tooth/drawing in a small card. |
| Step 2: make it theirs | Same remote Irys memory as hero mini-card | `src/app/toothfairy/page.tsx` | Review | This repeats the remote asset. Decide whether repetition is intentional or whether step 2 needs its own image. |
| Step 3: watch grow | `/toothfairy/visual-system/watch-grow-v1.png` | `src/app/toothfairy/page.tsx` | Review | Also used by the Smile Fund page. |
| Smile Fund dashboard | CSS/UI mock | `src/app/toothfairy/page.tsx` | Review | Visual-system folder has `/toothfairy/visual-system/smile-dashboard-v1.png`, but homepage currently uses a live CSS mock instead. |
| Story band background | `/fairy-assets/fairy-network-sky.jpg` | `src/app/toothfairy/page.tsx` | Replace | Existing visual-system plan already marks the network banner as a P1 replacement candidate. |
| Story card: Tanda | `/story-assets/tanda/tf-05-tanda.png` | `src/app/toothfairy/page.tsx` | Review | Featured story thumbnail. |
| Story card: Viking | `/story-assets/viking-origin/vo-01-village.png` | `src/app/toothfairy/page.tsx` | Review | Featured story thumbnail. |
| Story card: Perez | `/story-assets/ratoncito-perez/rp-02-mouse.png` | `src/app/toothfairy/page.tsx` | Review | Featured story thumbnail. |

## Stories Index Wireframe

Route: `/toothfairy/stories`

Internal source: `src/app/toothfairy/stories/page.tsx`

```text
[Back nav]

[Header]
  Stories from around the world
  Every tooth tells a story.
  total traditions count

[Active stories]
  3 cards:
    Tanda
    The First Tooth
    El Ratoncito Perez

[Explore the world]
  50 tradition globe
  rotating/photo-border thumbnail ring

[Local footer]
```

## Stories Index Image Slots

| Slot | Current asset source | Status | Notes / next action |
| --- | --- | --- | --- |
| Active story card covers | Hardcoded `COVERS` map in `src/app/toothfairy/stories/page.tsx` | Review | Uses the same trilogy assets as homepage. Good for consistency, but all three should be judged as a set. |
| Globe markers | `allTraditionsForGlobe()` from `src/data/wall-cards/index.ts` | Keep | Data/3D visualization, no static image replacement needed. |
| Photo border thumbnails | `allTraditionImages()` from `src/data/wall-cards/index.ts` | Review | Mixes active story images plus `/story-assets/placeholder-gold.svg` for 40 coming-soon items. |
| Coming-soon thumbnail placeholder | `/story-assets/placeholder-gold.svg` | Replace | Functional placeholder, but it makes the 50-tradition wall feel unfinished. |

Active wall-card thumbnail assets:

| Tradition | Asset | Linked full story |
| --- | --- | --- |
| Ireland | `/story-assets/ireland/ir-01-bedroom.jpg` | `ireland` not registered in `ALL_STORIES` |
| South Korea | `/story-assets/korea/kr-01-bedroom.jpg` | `korea` registered |
| Cherokee Nation | `/story-assets/cherokee/ch-01-home.jpg` | `cherokee` not registered |
| Ethiopia | `/story-assets/ethiopia/et-01-bedroom.jpg` | `ethiopia` not registered |
| Finland | `/story-assets/finland/fi-01-bedroom.jpg` | `finland` not registered |
| Romania | `/story-assets/romania/ro-01-bedroom.jpg` | `romania` not registered |
| Spain | `/story-assets/perez/pz-01-bedroom.jpg` | `ratoncito-perez` registered |
| North America / Tanda | `/story-assets/tooth-fairy/tf-03-lifting-tooth.jpg` | `tanda` registered |
| Japan | `/story-assets/japan/jp-01-bedroom.jpg` | `japan` registered |
| Mongolia | `/story-assets/placeholder-gold.svg` | no full story |

## Full Story Reader Wireframe

Routes:

- `/toothfairy/story/[tradition]`
- `/toothfairy/stories/[slug]` for mini-story and coming-soon pages

Internal sources:

- `src/app/toothfairy/story/[tradition]/page.tsx`
- `src/components/toothfairy/story/StoryPlayer.tsx`
- `src/app/toothfairy/stories/[slug]/page.tsx`
- `src/data/stories/*`
- `src/data/wall-cards/*`

```text
[Story player]
  scene background image
  optional character/card overlay image
  title / narration
  progress / navigation
  final CTA to create memory

[Mini-story / coming-soon page]
  back nav
  square hero image
  region
  title
  character
  story text
  CTA block
  related traditions
```

Full story assets are data-driven. The five registered story IDs are:

| Story | Main asset family | Status | Notes |
| --- | --- | --- | --- |
| `tanda` | `/story-assets/tanda/*.png` plus `/story-assets/characters/char-tooth-fairy.jpg` | Review | Most important child-facing canon. Needs consistency pass before broad launch. |
| `viking-origin` | `/story-assets/viking-origin/*.png` | Review | Strong lore route; judge as a complete sequence. |
| `ratoncito-perez` | `/story-assets/ratoncito-perez/*.png` plus `/story-assets/characters/char-perez.jpg` | Review | Featured and sitemap-visible. |
| `japan` | `/story-assets/japan/*.jpg` plus `/story-assets/characters/char-tooth-kami.jpg` | Review | Registered in `ALL_STORIES` but not currently featured on homepage. |
| `korea` | `/story-assets/korea/*.jpg` plus `/story-assets/characters/char-magpie.jpg` | Review | Registered in `ALL_STORIES` but not currently featured on homepage. |

Important distinction: many additional story files on disk have `available: true`, but they are not surfaced by `/toothfairy/story/[tradition]` unless imported into `ALL_STORIES` in `src/data/stories/index.ts`.

## App Flow Wireframe

Route: `/app` on `toothfairy.network`

Internal source: `src/app/toothfairy/app/page.tsx`

```text
[Step: setup]
  child name
  date of birth
  child smile photo upload slot
  start button

[Step: create]
  tooth photo upload slot
  drawing canvas
  continue button

[Step: tell]
  optional child note/story

[Step: preview]
  combined memory preview image
  summary cards
  mint/save options

[Step: deposit]
  preview repeat
  share link
  Smile Fund setup / wallet path

[Step: minting]
  progress state

[Step: done]
  final preview repeat
  share actions
```

App image slots are not static brand assets. They are user-generated:

| Slot | Source | Status | Notes |
| --- | --- | --- | --- |
| Child smile photo | File upload stored as data URL and/or Supabase URL | Generated | Appears in setup, dashboard, child page, and possibly gift page. |
| Tooth photo | File upload stored as data URL | Generated | Used as input to drawing canvas. |
| Drawing canvas output | Canvas/data URL | Generated | Becomes `previewImage` and may be minted. |
| Enhanced preview | API/enhancement result or original drawing | Generated | Reused in preview, deposit, done states. |
| Minted image URI | API/on-chain metadata | Generated | Stored in localStorage and fetched later by child/keepsake pages. |

## Dashboard, Gift, Child, And Keepsake Pages

| Route | Wireframe image slots | Status | Notes |
| --- | --- | --- | --- |
| `/dashboard` | Child avatar thumbnails from `smile_photo_url`; profile/milestone/deposit UI | Generated | No static replacement needed except empty states if desired. |
| `/gift/[milestone]` | Memory preview from `keepsakeData.drawingUrl` or `keepsakeData.smilePhotoUrl` | Generated | This is the family-facing image slot after sharing. |
| `/tooth/[name]` | Child photo, artwork URL, milestone metadata images | Generated | Pulls from localStorage, Supabase, and metadata URIs. |
| `/keepsake/[id]` | `KeepsakeCard` renders `drawingUrl` | Generated | `smilePhotoUrl` exists in props but is not currently rendered by `KeepsakeCard`. |
| `/keepsake/preview` | Demo `drawingUrl` | Missing | References `/story-assets/tanda/frame-07.png`, which is not present in `public/story-assets/tanda`. |
| `/story` | Story selector character cards | Missing | `StorySelector` maps `tanda` to `/story-assets/characters/char-tanda.png`, but that file is not present. |

Missing asset to fix:

```text
/story-assets/tanda/frame-07.png
/story-assets/characters/char-tanda.png
```

Referenced by:

```text
src/app/toothfairy/keepsake/preview/page.tsx
src/components/toothfairy/story/StorySelector.tsx
```

Available nearby alternatives:

```text
/story-assets/tanda/tf-07-your-tooth.png
/story-assets/tanda/tf-05-tanda.png
/story-assets/characters/char-tooth-fairy.jpg
```

## Back Pages

| Route | Current image slots | Status | Notes |
| --- | --- | --- | --- |
| `/about` | `/toothfairy/visual-system/tanda-guide-v1.png`, `/fairy-assets/fairy-network-sky.jpg` | Review / Replace | Tanda guide is reviewable. Network sky is same replacement candidate as homepage story band. |
| `/smile-fund` | `/toothfairy/visual-system/watch-grow-v1.png` | Review | Should stay consistent with homepage Step 3. |
| `/faq` | None major | Keep | Mostly text and CSS. |
| `/recover` | None major | Keep | Mostly text and CSS. |
| `/company` | None | Keep | Redirects to `/toothfairy/about`; no separate image surface. |
| `/architecture` | None major | Keep | Internal/security explainer. |
| `/concept-b` | `/toothfairy/concept-b/hero-bg.png`, `/toothfairy/concept-b/hero.png`, `/toothfairy/concept-b/traditions-banner.png`, `/toothfairy/concept-b/keepsake-mockup.png` | Archive / Reference | Older concept route. Do not update until deciding whether it remains public. |
| `/visual-system` | `/toothfairy/visual-system/p0-contact-sheet-v1.png` plus slot previews | Keep as planning board | Useful companion to this document. Some slot metadata still references older `concept-b` assets while the live homepage uses `visual-system` assets. |

## Important Unused Or Underused Assets

These exist in `public` and appear intentional, but are not all used on the live homepage.

| Asset | Current use | Recommendation |
| --- | --- | --- |
| `/toothfairy/visual-system/invite-family-v1.png` | Available in `public`, not live homepage | Consider replacing the repeated remote memory in Step 2. |
| `/toothfairy/visual-system/nft-keepsake-v1.png` | Available in `public`, not live homepage | Consider for live memory / keepsake slot if remote Irys image is replaced. |
| `/toothfairy/visual-system/smile-dashboard-v1.png` | Available in `public`, not live homepage | Compare against current CSS Smile Fund dashboard. |
| `/toothfairy/visual-system/p0-contact-sheet-v1.png` | Visual-system page only | Keep as review board/reference. |
| `/toothfairy/tanda-v2-reference.jpg` | Referenced by visual-system slot metadata | Archive/reference unless promoted. |
| `/toothfairy/animation/tfn-tanda-ritual-layered-loop-v6.mp4` and `.webm` | Animation routes/components | Keep in animation production stream. |
| `/toothfairy/animation/tfn-tanda-ritual-layered-poster-v6.webp` | Animation poster | Keep in animation production stream. |

## Replacement Queue

### P0 - Decide Before Next Visual Pass

| Slot | Decision needed |
| --- | --- |
| Homepage hero family image | Keep current V1, crop differently, or regenerate? |
| Remote live memory image | Keep real minted artifact, replace with local keepsake render, or use `nft-keepsake-v1.png`? |
| How-it-works Step 2 | Keep remote repeat or swap to `invite-family-v1.png` / custom invitation image? |
| Keepsake preview missing image | Replace `/story-assets/tanda/frame-07.png` with an existing file or add the missing asset. |
| Story selector missing Tanda thumbnail | Replace `char-tanda.png` mapping with `char-tooth-fairy.jpg`, add `char-tanda.png`, or move to a canonical Tanda portrait. |
| `KeepsakeCard` smile photo | Decide whether `smilePhotoUrl` should actually render on keepsake pages. |

### P1 - Story And Brand Consistency

| Slot | Decision needed |
| --- | --- |
| Network story band | Replace `/fairy-assets/fairy-network-sky.jpg` with a TFN-specific network banner. |
| Trilogy thumbnails | Review Tanda, Viking, and Perez as a matched set. |
| Story wall thumbnails | Decide whether 10 active wall-card thumbnails need consistent crop/style. |
| Coming-soon placeholders | Replace 40 placeholder thumbnails or design a stronger intentional placeholder state. |
| Japan/Korea visibility | Decide whether registered full stories should be featured or kept secondary. |

### P2 - Internal / Legacy

| Slot | Decision needed |
| --- | --- |
| Concept B route images | Archive, hide, or bring forward? |
| Animation route assets | Keep separate from homepage static-image plan unless animation becomes homepage hero. |
| Architecture/admin/support routes | Leave mostly text/CSS unless promoted. |

## Image Audit Notes

- The live homepage now uses the `public/toothfairy/visual-system` image family rather than the older `concept-b` hero assets.
- `/fairy-assets/fairy-network-sky.jpg` appears in multiple TFN pages and is the clearest repeated replacement candidate.
- The story system is image-heavy and data-driven; changing story imagery should happen through `src/data/stories/*` and `src/data/wall-cards/*`, not by editing the page components one at a time.
- Generated family content is the main product image layer. Static site imagery should frame that content, not compete with it.
- The clean domain currently redirects `/stories` to the homepage story band, while internal `/toothfairy/stories` still renders the full stories index.
- Card gifts appear paused in the live app flow, while wallet/Solana gift paths remain present for controlled testing.
