# Toothlight V4 Repo Architecture Audit

Date: 2026-05-21
Status: initial audit after `MASTER_BUILD_BRIEF.md`

## Executive Recommendation

Build V4 as a new `/toothlight` product shell inside the current Next.js app, but do not rebuild the Solana/Supabase foundation from scratch.

Use the existing repo for:

- drawing/photo capture primitives;
- AI enhancement adapter;
- Google/Supabase auth;
- cNFT/Irys minting helpers;
- escrow/Smile Fund helpers;
- keepsake read model;
- email and receipt patterns;
- Tanda/current animation assets as reference and asset seeds.

Do not extend the current V3 pages directly into the final V4 product. They are mostly static/storytelling surfaces and should remain visual R&D.

## Current Stack

- Next.js App Router: `next@14.2.35`
- React 18
- Tailwind CSS plus CSS modules
- Supabase auth/storage/database
- Solana Web3, Anchor, wallet adapter
- Metaplex Bubblegum cNFTs and Irys uploads
- GSAP and `motion` available for animation work
- Fal-backed Magic Studio image enhancement
- Resend email
- Playwright E2E tests

## Current Route Map

### Existing Toothlight V3 Surface

Current files:

- `src/app/toothlight/page.tsx`
- `src/app/toothlight/make/page.tsx`
- `src/app/toothlight/filter-lab/page.tsx`
- `src/app/toothlight/network/page.tsx`
- `src/app/toothlight/stories/page.tsx`
- `src/app/toothlight/parents/page.tsx`
- `src/components/toothlight/*`

Assessment:

These pages are useful as visual references but are mostly static. They do not implement the V4 creation/save/future-note/family-node product loop.

Recommendation:

Replace `/toothlight` and `/toothlight/make` with V4. Keep static V3 pages only if they are moved or clearly treated as lab/reference pages. Do not let their information architecture drive V4.

### Existing Working App Surface

Current files:

- `src/app/toothfairy/app/draw/page.tsx`
- `src/app/toothfairy/app/draw/preview/page.tsx`
- `src/app/toothfairy/app/draw/result/page.tsx`
- `src/app/toothfairy/app/page.tsx`
- `src/app/toothfairy/app/gift/[milestone]/page.tsx`
- `src/app/toothfairy/keepsake/[id]/page.tsx`
- `src/app/toothfairy/app/dashboard/page.tsx`

Assessment:

This is where the real end-to-end product currently lives. It has drawing, photo upload, magic enhancement, parent details, Google auth, minting, keepsake page, and wallet gift testing.

Recommendation:

Reuse behavior and helpers, but do not reuse the whole route flow as V4. V4 needs a simpler mobile-first controller and a note/family state model.

## Routing And Middleware Risks

### `/toothlight` On Toothfairy.network

Current `src/middleware.ts` rewrites most public `toothfairy.network` paths into `/toothfairy/*`.

Risk:

If V4 is built at `/toothlight`, then `https://toothfairy.network/toothlight` may be rewritten to `/toothfairy/toothlight` unless middleware gets a specific exception.

Required V4 change:

- Add an explicit `/toothlight` passthrough or rewrite rule for the TFN domain.
- Include `/toothlight` and future `/api/toothlight/*` in the auth/session refresh logic if V4 uses Supabase sessions there.

### Robots And Sitemap

Current `src/app/robots.ts` references `/toothlight/` as disallowed.

Required V4 change:

- Keep `/toothlight` disallowed for private/provider demo.
- Remove the disallow and add sitemap entries only when public launch is intended.

## Reusable Frontend Pieces

### Strong Reuse

`src/components/toothfairy/app/drawing-canvas-v2.tsx`

- Good mobile drawing/photo primitive.
- Already has callbacks, export behavior, touch handling, undo, color/tools, reduced-motion awareness.
- Should be reused or lightly wrapped for V4 creation.

`src/lib/toothfairy/brush-tools.ts`

- Keep.

`src/lib/toothfairy/canvas-export.ts`

- Keep.

`src/components/toothlight/toothlight-memory-card.tsx`

- Useful visual seed for the Toothlight object.
- Should not be used as-is for V4 state because it is demo-data oriented.

Recommendation:

Create a new V4 card component that supports:

- `draft_glow`
- `spark`
- `note_started`
- `sealed`
- `smile_fund_active`
- `constellated`

### Reference Only

`src/app/toothlight/*`

- Static V3 pages.
- Useful for copy, imagery, page mood, and route ideas.
- Not final architecture.

`src/components/toothfairy/home/tanda-live-ritual-hero.tsx`

- Good proof that pose-cutout animation can work.
- Too scene-specific to extend directly.
- Reuse the method and assets, not the component structure.

`src/components/toothfairy/home/tanda-live-ritual-hero.module.css`

- Good reference for timeline, trails, product glow, and reduced-motion concerns.
- Too large and scene-specific for the V4 animation system.

## Animation Assets

Existing Tanda pose assets:

- `public/toothfairy/animation/live-hero-v1/tanda-entry-up.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-entry-down.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-reach.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-grab.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-lift-tooth.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-phone.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-type.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-carry-coin.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-release-coin.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-wave.webp`
- `public/toothfairy/animation/live-hero-v1/tanda-exit.webp`

Other useful assets:

- `public/toothfairy/visual-system/toothlight-keepsake-current.jpg`
- `public/toothfairy/visual-system/hero-family-v1-no-spark.png`
- `public/v3/scenes/*`
- `public/v3/memories/*`
- `public/story-assets/characters/char-perez.jpg`
- `public/story-assets/characters/char-kkachi.png`
- `public/story-assets/ratoncito-perez/*`

Recommendation:

The first production proof should create new modular animation components rather than continue the existing homepage animation file:

- `ProductEntryRead`
- `DraftGlowSequence`
- `SaveFlightSequence`
- `ToothlightCard`

## Current Creation Flow

The current working flow is:

1. `/toothfairy/app/draw`
2. `/toothfairy/app/draw/preview`
3. `/toothfairy/app/draw/result`
4. `/toothfairy/app`
5. `/api/toothfairy/mint`
6. `/toothfairy/keepsake/[id]`
7. optional `/toothfairy/app/gift/[milestone]`

It uses localStorage/sessionStorage keys such as:

- `toothfairy-latest-drawing`
- `toothfairy-latest-enhanced`
- `toothfairy-final-drawing`
- `tfn-flow-state`
- `tfn-tell-text`
- `tfn-story-context`

Risk:

The handoff is functional but fragile and route-coupled. V4 should not add more product logic to these keys.

Recommendation:

Create V4-specific client state and storage keys under one namespace:

- `toothlight-v4-draft`
- `toothlight-v4-source-image`
- `toothlight-v4-selected-glow`
- `toothlight-v4-note-seed`

Better:

Keep most V4 creation state in a React reducer/controller and only use storage for auth round-trip recovery.

## AI Enhancement

Current pieces:

- `src/lib/toothfairy/magic-studio.ts`
- `src/lib/toothfairy/enhance-client.ts`
- `src/app/api/toothfairy/enhance/route.ts`
- `src/lib/toothfairy/ai-enhance.ts`
- `src/lib/toothfairy/magic-credits.ts`

Current behavior:

- Fal model: `fal-ai/flux-pro/kontext`
- Starter credits: `3`
- Estimated cost: `$0.04` per generation
- Auth required for enhancement
- Existing styles: `tanda-glow`, `storybook-ink`, `watercolor-memory`, `pencil-charm`, `cartoon-3d`, `tradition-magic`

V4 implication:

The V4 brief wants creation before account friction. Current AI enhancement requires auth, so the MVP should either:

- use deterministic glow/filter previews before sign-in; or
- ask for save/sign-in before AI generation; or
- intentionally allow limited unauthenticated generation with a stronger cost guard.

Recommendation:

For first V4 proof, use deterministic glows and animation. Keep AI enhancement as a post-auth optional enhancement until demand is proven.

## Minting And Save Path

Current API:

- `src/app/api/toothfairy/mint/route.ts`

Current behavior:

- verifies Supabase auth;
- checks origin and rate limits;
- uploads image/metadata to Irys;
- mints cNFT through Metaplex Bubblegum;
- creates child profile and milestone on the escrow contract;
- upserts `tfn_children`;
- upserts `tfn_tooth_stories`;
- sends a keepsake email;
- returns milestone and cNFT data.

Supporting helpers:

- `src/lib/toothfairy/cnft.ts`
- `src/lib/toothfairy/escrow.ts`
- `src/lib/toothfairy/keepsake-data.ts`

Assessment:

This is valuable and should be reused. The problem is the route and data shape are still dental/milestone oriented (`toothType`, `toothNumber`, `note`, `toothStory`) and not yet V4 Toothlight oriented.

Recommendation:

Do not duplicate the mint route. Extract or wrap it behind a V4 save adapter:

- `src/lib/toothlight/server/save-toothlight.ts`
- `src/app/api/toothlight/save/route.ts`

The adapter should translate V4 concepts into current chain requirements:

- Toothlight name -> metadata name;
- child display name -> child profile;
- glow/source image -> image upload;
- caption/story seed -> public-safe story;
- unlock age/date -> milestone/deposit context where applicable;
- private future note -> off-chain V4 table, not cNFT metadata.

## Current On-Chain Model

Current escrow helper:

- Program ID: `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`
- Platform fee: `200` bps / 2%
- Lock options include immediate, timestamp, 3/5/7/10/15 years.
- `calculateUnlockBirthday(dob, 10)` already supports age-10 default.
- Deposits are milestone-scoped on-chain.

V4 implication:

The product wants one Smile Fund per child with many Toothlights attached. The current contract stores deposits against milestones, not a child-level fund account in the UX sense.

Recommended V4 wording:

Treat the Smile Fund as a product-level child fund that aggregates milestone deposits. Technically, deposits can remain milestone-associated for MVP while the dashboard aggregates them by child profile.

Do not change the smart contract for the first V4 proof unless the product requires true child-level pooled deposits.

## Current Supabase Model

Existing migrations:

- `supabase/migrations/20260325_tfn_children.sql`
- `supabase/migrations/20260413_add_tooth_story.sql`
- `supabase/migrations/20260414_add_tradition_slug.sql`

Existing tables:

- `tfn_children`
- `tfn_tooth_stories`

Current privacy issue:

`tfn_tooth_stories` has public read policy because keepsake pages are public by milestone PDA.

V4 implication:

Do not store private future notes in `tfn_tooth_stories`.

Required V4 migrations:

- `tfn_toothlights`
- `tfn_future_notes`
- `tfn_family_contributions`
- `tfn_product_events`

Recommended privacy:

- `tfn_future_notes` should be user-owned and private by default.
- Shared pages can show note state but not content.
- Consider application-level encryption before storing full voice notes or highly sensitive parent text.

## Current Keepsake And Family Gift Flow

Current keepsake:

- `src/app/toothfairy/keepsake/[id]/page.tsx`
- `src/app/api/toothfairy/keepsake/[id]/route.ts`
- `src/lib/toothfairy/keepsake-data.ts`

Current family gift:

- `src/app/toothfairy/app/gift/[milestone]/page.tsx`
- wallet-oriented SOL deposit;
- defaults age-10 hold;
- no V4 note-first flow;
- no provider card checkout because card gifts are intentionally paused.

Paused provider routes:

- `src/app/api/toothfairy/onramp/route.ts`
- `src/app/api/toothfairy/server-deposit/route.ts`

Recommendation:

V4 should build a new family page:

- `/toothlight/t/[id]/family`

It can reuse deposit calculation and wallet deposit logic, but its UX should start with:

- `Add a gift and a note for later`
- note composer first or alongside gift amount;
- payment/gift path hidden behind provider-demo mode until provider flow is ready.

## Email And Auth

Current auth:

- `src/app/api/auth/google/route.ts`
- `src/app/api/auth/google/callback/route.ts`
- `src/lib/supabase-auth.ts`
- `src/lib/toothfairy/auth-redirect.ts`

Current email:

- `src/lib/toothfairy/email-templates.ts`
- `src/app/api/toothfairy/welcome-email/route.ts`
- `src/app/api/toothfairy/deposit-email/route.ts`
- `src/app/api/toothfairy/gift-receipt/route.ts`

Assessment:

The auth/email foundation is usable, but redirect paths are Tooth Fairy app specific.

Required V4 changes:

- allow `/toothlight/*` as safe auth redirect paths;
- ensure Google save flow returns to the V4 save/letter step;
- add V4 saved-Toothlight email copy with future-note CTA.

## Testing And Verification

Current test setup:

- `playwright.config.ts`
- `tests/toothfairy-flow.spec.ts`
- `tests/mint-path.spec.ts`
- multiple source-level `.mjs` readiness tests

Current limitation:

`package.json` has no `test` script, only:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

Recommendation:

V4 implementation plan should add or document explicit commands:

- Playwright V4 happy path;
- mobile viewport screenshot tests;
- source tests for middleware route exceptions;
- source tests that V4 does not use wallet-first language in the primary flow;
- reduced-motion checks for Product Entry Read, Draft Glow, and Save Flight.

## Recommended V4 File Boundaries

### Routes

- `src/app/toothlight/page.tsx`
- `src/app/toothlight/make/page.tsx`
- `src/app/toothlight/save/page.tsx`
- `src/app/toothlight/t/[id]/page.tsx`
- `src/app/toothlight/t/[id]/note/page.tsx`
- `src/app/toothlight/t/[id]/family/page.tsx`
- `src/app/toothlight/dashboard/page.tsx`
- `src/app/toothlight/parents/page.tsx`

### Components

- `src/components/toothlight/v4/ProductEntryRead.tsx`
- `src/components/toothlight/v4/ToothlightCard.tsx`
- `src/components/toothlight/v4/ToothlightStateFrame.tsx`
- `src/components/toothlight/v4/DraftGlowSequence.tsx`
- `src/components/toothlight/v4/SaveFlightSequence.tsx`
- `src/components/toothlight/v4/FutureNotePanel.tsx`
- `src/components/toothlight/v4/FamilyNodeOrbit.tsx`
- `src/components/toothlight/v4/FamilyContributionForm.tsx`
- `src/components/toothlight/v4/GlowPicker.tsx`
- `src/components/toothlight/v4/V4Shell.tsx`

### Client State

- `src/lib/toothlight/v4-draft-state.ts`
- `src/lib/toothlight/toothlight-states.ts`
- `src/lib/toothlight/glow-filters.ts`

### Server/API

- `src/app/api/toothlight/save/route.ts`
- `src/app/api/toothlight/[id]/route.ts`
- `src/app/api/toothlight/[id]/future-note/route.ts`
- `src/app/api/toothlight/[id]/family-contribution/route.ts`
- `src/app/api/toothlight/events/route.ts`
- `src/lib/toothlight/server/save-toothlight.ts`
- `src/lib/toothlight/server/future-notes.ts`
- `src/lib/toothlight/server/family-contributions.ts`
- `src/lib/toothlight/server/product-events.ts`

### Database

- `supabase/migrations/YYYYMMDD_tfn_toothlight_v4.sql`

## First Proof Scope

The first implementation proof should include:

1. Product Entry Read.
2. Make Toothlight visual creation shell.
3. Draft Glow.
4. Parent save CTA.
5. Provider-demo/test save path.
6. Save Flight.
7. Saved Toothlight page with state frame.
8. Note Started and Sealed state UI.

It should not include:

- real card payments;
- full education stream;
- new smart contract behavior;
- full parent dashboard;
- full voice agent;
- random keeper cameos.

## Highest-Risk Decisions Before Implementation

1. Provider demo mode: read-only, sandbox, or real money.
2. Private note encryption: account-level privacy for MVP or app-level encryption now.
3. Whether V4 save should call a wrapped legacy mint path or first refactor minting into a shared service.
4. Whether existing `/toothlight` static pages are replaced immediately or moved under a lab/reference route.
5. Whether first proof needs real Supabase migrations or a demo-mode local fixture first.

## Audit Conclusion

The repo is ready for a V4 build without a full backend rewrite.

The clean path is:

1. Add middleware/auth routing support for `/toothlight`.
2. Build V4 product shell and animation proof under `/toothlight`.
3. Reuse `DrawingCanvasV2`, canvas export, deterministic glows, and the existing Tanda assets.
4. Add V4 Supabase tables for Toothlight state, future notes, family contributions, and product events.
5. Wrap the existing cNFT/escrow mint path behind a V4 save adapter.
6. Build family note/gift as a new V4 route that reuses escrow deposit logic but changes the UX.
