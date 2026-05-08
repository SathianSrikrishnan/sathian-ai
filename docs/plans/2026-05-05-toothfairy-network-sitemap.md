# Tooth Fairy Network Sitemap

Current-state map for `toothfairy.network`, captured 2026-05-05.

## Scope

This document maps the site as it exists in the current Next.js app:

- App root: `tfnv2/repos/sathian-ai`
- Tooth Fairy route root: `src/app/toothfairy`
- Clean production domain: `toothfairy.network`
- Domain routing source: `src/middleware.ts`
- XML sitemap source: `src/app/sitemap.ts`

It is a planning document, not a proposed navigation rewrite.

## Domain Routing

`toothfairy.network` is not a separate app. Middleware rewrites clean public paths into the `/toothfairy/*` route tree.

| Public path on toothfairy.network | Internal route | Current behavior |
| --- | --- | --- |
| `/` | `/toothfairy` | Homepage |
| `/app` | `/toothfairy/app` | Memory creation flow |
| `/dashboard` | `/toothfairy/app/dashboard` | Parent dashboard |
| `/gift/[milestone]` | `/toothfairy/app/gift/[milestone]` | Family gift link |
| `/about` | `/toothfairy/network/about` -> `/toothfairy/about` | About page through redirect |
| `/tooth/[name]` | `/tooth/[name]` | Child public page, pass-through |
| `/network` | `/` | Redirect to homepage |
| `/network/*` | `/toothfairy/network/*` | Network legacy routes |
| `/stories` and `/stories/*` | `/#stories` | Redirect to homepage story band |
| `/toothfairy/*` | `/toothfairy/*` | Passed through without double-prefixing |
| Any other non-API path | `/toothfairy${path}` | Fallback into the TFN route tree |

Note: the shared TFN header currently links to `/toothfairy/stories`, `/toothfairy/faq`, and `/toothfairy/app`. On the clean domain those paths still work, but they expose the internal prefix.

## Primary Public Map

These are the routes a parent or visitor is likely to encounter.

| Public URL | Internal file | Role | Image surface |
| --- | --- | --- | --- |
| `/` | `src/app/toothfairy/page.tsx` | Main conversion homepage | Hero family image, remote live memory, how-it-works cards, network story banner, story cards |
| `/#how-it-works` | `src/app/toothfairy/page.tsx` | Homepage anchor for three-step explanation | Three step images |
| `/#smile-fund` | `src/app/toothfairy/page.tsx` | Homepage anchor for Smile Fund explanation | CSS dashboard mock, no static bitmap |
| `/#stories` | `src/app/toothfairy/page.tsx` | Homepage anchor for story trilogy | Network banner plus three story thumbnails |
| `/app` | `src/app/toothfairy/app/page.tsx` | Create child memory flow | User uploads, drawing canvas, generated preview |
| `/dashboard` | `src/app/toothfairy/app/dashboard/page.tsx` | Parent control room | Child smile photos from Supabase if available |
| `/gift/[milestone]` | `src/app/toothfairy/app/gift/[milestone]/page.tsx` | Family contribution page | Keepsake drawing or smile photo preview |
| `/tooth/[name]` | `src/app/tooth/[name]/page.tsx` | Child profile / family page | Child photo, artwork, milestone images from local/Supabase/on-chain metadata |
| `/keepsake/[id]` | `src/app/toothfairy/keepsake/[id]/page.tsx` | Shareable keepsake page | Drawing URL in `KeepsakeCard` |
| `/keepsake/preview` | `src/app/toothfairy/keepsake/preview/page.tsx` | Static preview/demo keepsake | Demo drawing URL, currently points to a missing file |
| `/faq` | `src/app/toothfairy/faq/page.tsx` | Parent FAQ | Mostly text/CSS |
| `/about` | `src/app/toothfairy/about/page.tsx` | Mission/product story | Tanda guide image and network sky image |
| `/company` | `src/app/toothfairy/company/page.tsx` | Redirects to `/toothfairy/about` | No separate page body |
| `/smile-fund` | `src/app/toothfairy/smile-fund/page.tsx` | Smile Fund explanation | Watch-grow visual |
| `/recover` | `src/app/toothfairy/recover/page.tsx` | Access recovery landing | Mostly text/CSS |
| `/story` | `src/app/toothfairy/story/page.tsx` | Story selector | Character thumbnails |
| `/story/[tradition]` | `src/app/toothfairy/story/[tradition]/page.tsx` | Full story reader | Story scene backgrounds and character overlays |
| `/stories/[slug]` | `src/app/toothfairy/stories/[slug]/page.tsx` | Mini-story / coming-soon detail | Wall-card image or placeholder |
| `/visual-system` | `src/app/toothfairy/visual-system/page.tsx` | Internal image slot board | Contact sheet and slot previews |

## Header Navigation

Source: `src/components/toothfairy/nav/tfn-header.tsx`

| Label | Href | Type |
| --- | --- | --- |
| Tooth Fairy Network brand | `/toothfairy` | Route |
| How it works | `/toothfairy#how-it-works` | Homepage anchor |
| Stories | `/toothfairy/stories` | Route, but clean-domain `/stories` redirects to homepage |
| FAQ | `/toothfairy/faq` | Route |
| Create a memory | `/toothfairy/app` | App route |

## Footer Navigation

Source: `src/components/toothfairy/nav/tfn-footer.tsx`

| Group | Links |
| --- | --- |
| Product | `/toothfairy#how-it-works`, `/toothfairy/app`, `/toothfairy/keepsake/preview`, `/toothfairy/smile-fund` |
| Stories | `/toothfairy/stories`, `/toothfairy/story/tanda`, `/toothfairy/faq` |
| Company | `/toothfairy/about`, `/toothfairy/company`, `/toothfairy/faq`, `/toothfairy/recover` |
| Newsletter form | Posts to `/api/subscribe` with source `tfn-footer` |

## XML Sitemap

Source: `src/app/sitemap.ts`

The generated sitemap currently exposes a smaller route set than the actual route tree:

| Sitemap URL | Notes |
| --- | --- |
| `/` | Homepage |
| `/toothfairy/app` | Internal-prefix URL, not clean `/app` |
| `/toothfairy/smile-fund` | Back page |
| `/toothfairy/stories` | Stories index |
| `/toothfairy/story/tanda` | Full story |
| `/toothfairy/story/viking-origin` | Full story |
| `/toothfairy/story/ratoncito-perez` | Full story |
| `/toothfairy/keepsake/preview` | Static preview |
| `/toothfairy/faq` | Parent FAQ |
| `/toothfairy/recover` | Recovery landing |

Potential follow-up: decide whether the sitemap should use clean domain paths (`/app`, `/faq`, etc.) or internal-prefix paths (`/toothfairy/app`, `/toothfairy/faq`, etc.).

## Story System

The story system has two overlapping layers.

### Full Story Reader

Source:

- `src/app/toothfairy/story/[tradition]/page.tsx`
- `src/data/stories/index.ts`
- `src/components/toothfairy/story/StoryPlayer.tsx`

`ALL_STORIES` currently registers these full-story routes:

| Story ID | Title | Visible from |
| --- | --- | --- |
| `tanda` | Tanda | Homepage, stories page, story selector |
| `viking-origin` | The First Tooth | Homepage, stories page, story selector |
| `ratoncito-perez` | El Ratoncito Perez | Homepage, stories page, story selector |
| `japan` | The Tooth Kami | Story selector / dynamic route |
| `korea` | The Magpie Song | Story selector / dynamic route |

`FEATURED_STORIES` contains only the homepage/stories trilogy: `tanda`, `viking-origin`, and `ratoncito-perez`.

### Stories Index And Globe

Source:

- `src/app/toothfairy/stories/page.tsx`
- `src/data/wall-cards/cards.ts`
- `src/data/wall-cards/coming-soon.ts`
- `src/data/wall-cards/index.ts`

The stories page renders:

- 3 active story cards at the top, from `FEATURED_STORIES`
- 10 active wall-card traditions from `wallCards`
- 40 coming-soon traditions from `comingSoonTraditions`
- 50 total globe markers and photo-border thumbnails

When a `/toothfairy/stories/[slug]` wall-card links to a full story that is registered in `ALL_STORIES`, it redirects to `/toothfairy/story/[id]`. Otherwise, it renders a mini-story or coming-soon page.

## App Flow Map

Source: `src/app/toothfairy/app/page.tsx`

The main app is a single-page wizard with these internal steps:

1. `setup` - child name, date of birth, child smile photo
2. `create` - tooth photo upload and drawing canvas
3. `tell` - optional child story/note
4. `preview` - memory preview, wallet/server mint path
5. `deposit` - post-mint sharing and Smile Fund setup
6. `minting` - progress state
7. `done` - final share state

Related app routes:

| Route | Purpose |
| --- | --- |
| `/toothfairy/app/dashboard` | Parent dashboard |
| `/toothfairy/app/gift/[milestone]` | Family gift page |
| `/toothfairy/app/recover` | Wallet/on-chain recovery tool |
| `/toothfairy/app/draw` | Drawing sub-flow |
| `/toothfairy/app/draw/preview` | Drawing preview/enhancement |
| `/toothfairy/app/draw/result` | Enhanced drawing result |

## Internal, Legacy, Or Support Routes

These are present in the route tree but should be treated as internal, support, or legacy until intentionally promoted.

| Route | Source | Notes |
| --- | --- | --- |
| `/toothfairy/network` | `src/app/toothfairy/network/page.tsx` | Redirects to `/toothfairy` |
| `/toothfairy/network/about` | `src/app/toothfairy/network/about/page.tsx` | Redirects to `/toothfairy/about` |
| `/toothfairy/network/technical` | none found | Linked from older `TfnNav`, but no route exists |
| `/toothfairy/network/market` | none found | Linked from older `TfnNav`, but no route exists |
| `/toothfairy/architecture` | `src/app/toothfairy/architecture/page.tsx` | Security/architecture explainer |
| `/toothfairy/concept-b` | `src/app/toothfairy/concept-b/page.tsx` | Older concept landing |
| `/toothfairy/admin/escrow-viewer` | `src/app/toothfairy/admin/escrow-viewer/page.tsx` | Admin/test utility |
| `/animation/*` | `src/app/animation/*` | Tanda animation/prototype routes |
| `/studio/*` | `src/app/studio/*` | Auth-gated writing studio |
| `/btc-atlas`, `/voice`, `/writings`, `/links`, `/about` | `src/app/*` | Sathian.ai routes, not TFN-specific |

## Bird's-Eye Tree

```text
toothfairy.network
  /
    #how-it-works
    #smile-fund
    #stories
  /app
    /dashboard
    /draw
      /preview
      /result
    /gift/[milestone]
    /recover
  /tooth/[name]
  /keepsake
    /preview
    /[id]
  /story
    /[tradition]
  /stories
    /[slug]
  /faq
  /about
  /company
  /smile-fund
  /recover
  /visual-system
  /architecture
  /concept-b
```

## Cleanup Questions

- Should public navigation use clean-domain paths (`/app`, `/faq`, `/about`) instead of `/toothfairy/*` paths?
- Should `/stories` remain redirected to the homepage story band, or should it expose the full stories index on the clean domain?
- Should the XML sitemap include only launch-safe pages, or the full public route tree?
- Should `/visual-system`, `/architecture`, `/concept-b`, and `/admin/*` be hidden from the public sitemap/navigation until final?
- Should `ALL_STORIES` intentionally include Japan and Korea while the homepage only features the trilogy?
- Should older `TfnNav` links to `/toothfairy/network/technical` and `/toothfairy/network/market` be removed or replaced, since those pages are not present?
