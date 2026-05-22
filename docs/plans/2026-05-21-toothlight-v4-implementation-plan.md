# Toothlight V4 First Proof Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the first Toothlight V4 proof: Product Entry Read, Draft Glow, parent save, Save Flight, saved Toothlight state page, Note Started/Sealed states, and family note/gift entry in provider-demo-safe mode.

**Architecture:** V4 lives under `/toothlight` and uses new Toothlight-specific components, state types, and API boundaries. It reuses existing drawing/canvas primitives, Tanda assets, auth/session helpers, and later wraps the existing cNFT/escrow minting path rather than replacing it.

**Tech Stack:** Next.js App Router, React 18, CSS modules, Tailwind where already used, Supabase, existing Solana/Irys helpers, Playwright, existing Tanda WebP assets.

---

## Implementation Assumptions

- First proof is provider-demo-safe: no real card payments.
- No smart contract fee changes.
- No new staking/yield/AUM behavior.
- No full voice agent.
- `/toothlight` replaces the current static V3 Toothlight landing as the V4 proof surface.
- Existing static V3 pages may remain as reference routes unless they block V4.
- Real minting can be connected through the adapter after the UI proof works; first proof may use test/demo save under `NEXT_PUBLIC_TEST_MODE=true`.
- UI labels use `note for later`, `Note Started`, and `Sealed for later`.
- First proof includes Product Entry Read + Draft Glow + Save Flight together.

---

### Task 1: Add V4 Routing Guardrails

**Files:**
- Modify: `src/middleware.ts`
- Modify: `src/lib/toothfairy/auth-redirect.ts`
- Create: `tests/toothlight-v4-routing.test.mjs`

**Step 1: Write source test**

Create `tests/toothlight-v4-routing.test.mjs` that reads `src/middleware.ts` and `src/lib/toothfairy/auth-redirect.ts`.

Assert:

- middleware has a `/toothlight` TFN-domain passthrough before the catch-all `/toothfairy${pathname}` rewrite;
- auth/session refresh includes `/toothlight` or `/api/toothlight`;
- safe auth redirect prefixes include `/toothlight`.

**Step 2: Run the test and verify it fails**

Run:

```powershell
node tests/toothlight-v4-routing.test.mjs
```

Expected:
FAIL because `/toothlight` routing is not fully handled yet.

**Step 3: Update middleware**

In `src/middleware.ts`:

- include `/toothlight` in the app/session refresh condition;
- include `/api/toothlight/` in API session refresh;
- add TFN-domain passthrough for `/toothlight` and `/toothlight/*` before the catch-all rewrite.

**Step 4: Update auth redirects**

In `src/lib/toothfairy/auth-redirect.ts`, add `/toothlight` to safe redirect prefixes.

**Step 5: Verify**

Run:

```powershell
node tests/toothlight-v4-routing.test.mjs
```

Expected:
PASS.

**Step 6: Commit**

```powershell
git add src/middleware.ts src/lib/toothfairy/auth-redirect.ts tests/toothlight-v4-routing.test.mjs
git commit -m "feat: add toothlight v4 routing guards"
```

---

### Task 2: Add Toothlight V4 State Types

**Files:**
- Create: `src/lib/toothlight/toothlight-states.ts`
- Create: `src/lib/toothlight/glow-filters.ts`
- Create: `tests/toothlight-v4-state.test.mjs`

**Step 1: Write source test**

Create a Node source test that imports/reads:

- `src/lib/toothlight/toothlight-states.ts`
- `src/lib/toothlight/glow-filters.ts`

Assert the files define:

- `draft_glow`
- `spark`
- `note_started`
- `sealed`
- `smile_fund_active`
- `constellated`
- at least 8 glow filter definitions
- a recommended/default glow

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-state.test.mjs
```

Expected:
FAIL because files do not exist.

**Step 3: Implement state module**

Create `src/lib/toothlight/toothlight-states.ts` with:

- `ToothlightState`
- `ToothlightVisualState`
- `FamilyNodeKind`
- `FutureNoteStatus`
- `getToothlightVisualState(input)`

Rules:

- full future note returns `sealed`;
- short seed note returns `note_started`;
- family note/gift returns `constellated` overlay;
- Smile Fund alone does not create `sealed`.

**Step 4: Implement glow filters**

Create `src/lib/toothlight/glow-filters.ts` with 8 to 10 deterministic glow filters.

Each filter:

- has `id`, `label`, `accent`, `previewClass`, `descriptionForInternalUse`;
- keeps labels short;
- avoids long primary-view text.

**Step 5: Verify**

```powershell
node tests/toothlight-v4-state.test.mjs
```

Expected:
PASS.

**Step 6: Commit**

```powershell
git add src/lib/toothlight tests/toothlight-v4-state.test.mjs
git commit -m "feat: add toothlight v4 state model"
```

---

### Task 3: Build The V4 Toothlight Card

**Files:**
- Create: `src/components/toothlight/v4/ToothlightCard.tsx`
- Create: `src/components/toothlight/v4/ToothlightCard.module.css`
- Create: `src/components/toothlight/v4/types.ts`
- Create: `tests/toothlight-v4-card.test.mjs`

**Step 1: Write source test**

Assert the card source includes:

- `draft_glow`
- `note_started`
- `sealed`
- `constellated`
- `aria-label`
- `prefers-reduced-motion`
- no dependency on demo memory arrays from `toothlight-data.ts`

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-card.test.mjs
```

Expected:
FAIL because card does not exist.

**Step 3: Implement component**

Build a presentational card that accepts:

- `imageSrc`
- `title`
- `caption`
- `createdLabel`
- `visualState`
- `familyNodes`
- `smileFundActive`
- `className`

Visual requirements:

- normal polished card shape, not tooth-shaped;
- Draft Glow has source glow only;
- Spark has Network mark;
- Note Started has partial warm thread;
- Sealed has private seal/lock visual;
- Constellated has small related nodes;
- no card-inside-card layout.

**Step 4: Implement CSS**

CSS module should include:

- stable aspect ratio;
- mobile-safe dimensions;
- state classes;
- reduced-motion rules;
- no text-overlap-prone absolute copy.

**Step 5: Verify**

```powershell
node tests/toothlight-v4-card.test.mjs
```

Expected:
PASS.

**Step 6: Commit**

```powershell
git add src/components/toothlight/v4 tests/toothlight-v4-card.test.mjs
git commit -m "feat: add stateful toothlight card"
```

---

### Task 4: Build Product Entry Read Animation

**Files:**
- Create: `src/components/toothlight/v4/ProductEntryRead.tsx`
- Create: `src/components/toothlight/v4/ProductEntryRead.module.css`
- Create: `tests/toothlight-v4-entry-read.test.mjs`

**Step 1: Write source test**

Assert:

- uses Tanda assets from `/toothfairy/animation/live-hero-v1/`;
- includes tooth-to-coin Smile Fund hint;
- includes shared wand/glow transfer;
- includes phone/photo/drawing to Toothlight transition;
- includes reduced-motion fallback;
- includes Product Entry Read wording in comments or labels for maintainability.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-entry-read.test.mjs
```

Expected:
FAIL because component does not exist.

**Step 3: Implement animation component**

Use layered HTML/CSS:

- tooth/ritual surface;
- Tanda pose layers;
- wand/glow pulse;
- coin/gift light;
- phone/source image;
- small story line;
- finished Toothlight card;
- Network hint.

Target:

- first meaning lands in 2 to 3 seconds;
- total loop can be longer but must not delay CTA;
- static reduced-motion frame still explains transformation.

**Step 4: Verify**

```powershell
node tests/toothlight-v4-entry-read.test.mjs
```

Expected:
PASS.

**Step 5: Commit**

```powershell
git add src/components/toothlight/v4/ProductEntryRead* tests/toothlight-v4-entry-read.test.mjs
git commit -m "feat: add toothlight product entry read"
```

---

### Task 5: Replace `/toothlight` With V4 Entry Page

**Files:**
- Modify: `src/app/toothlight/page.tsx`
- Modify: `src/app/toothlight/page.module.css`
- Create: `tests/toothlight-v4-entry-page.test.mjs`

**Step 1: Write source test**

Assert the page:

- imports `ProductEntryRead`;
- links primary CTA to `/toothlight/make`;
- does not use `Continue with Google` as the primary CTA;
- includes a visual How It Works strip;
- includes Tanda/Network language without long blockchain explanation.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-entry-page.test.mjs
```

Expected:
FAIL until page is updated.

**Step 3: Implement page**

Replace static V3 page with:

- Product Entry Read hero;
- concise CTA;
- visual four-step strip: Make, Save, Seal, Share;
- minimal parent trust line;
- no wallet-first copy.

**Step 4: Verify**

```powershell
node tests/toothlight-v4-entry-page.test.mjs
```

Expected:
PASS.

**Step 5: Commit**

```powershell
git add src/app/toothlight/page.tsx src/app/toothlight/page.module.css tests/toothlight-v4-entry-page.test.mjs
git commit -m "feat: launch toothlight v4 entry page"
```

---

### Task 6: Build V4 Creation Shell

**Files:**
- Modify: `src/app/toothlight/make/page.tsx`
- Create: `src/components/toothlight/v4/ToothlightMakeClient.tsx`
- Create: `src/components/toothlight/v4/ToothlightMakeClient.module.css`
- Create: `src/components/toothlight/v4/GlowPicker.tsx`
- Create: `src/components/toothlight/v4/GlowPicker.module.css`
- Create: `tests/toothlight-v4-make.test.mjs`

**Step 1: Write source test**

Assert:

- `/toothlight/make` uses V4 client component;
- creation happens before Google/account CTA;
- imports or wraps `DrawingCanvasV2`;
- uses `GlowPicker`;
- stores V4 draft under Toothlight-specific keys only;
- primary save CTA says `Save this Toothlight`.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-make.test.mjs
```

Expected:
FAIL until route is rebuilt.

**Step 3: Implement make client**

Build a mobile-first creation shell:

- source image/drawing step;
- glow picker step;
- short caption/tooth nickname fields;
- Draft Glow preview using `ToothlightCard`;
- parent save CTA.

Reuse:

- `DrawingCanvasV2` where possible;
- V4 draft reducer/local storage for auth recovery.

**Step 4: Verify**

```powershell
node tests/toothlight-v4-make.test.mjs
```

Expected:
PASS.

**Step 5: Commit**

```powershell
git add src/app/toothlight/make/page.tsx src/components/toothlight/v4 tests/toothlight-v4-make.test.mjs
git commit -m "feat: add toothlight v4 creation shell"
```

---

### Task 7: Add Draft Glow And Save Flight Components

**Files:**
- Create: `src/components/toothlight/v4/DraftGlowSequence.tsx`
- Create: `src/components/toothlight/v4/DraftGlowSequence.module.css`
- Create: `src/components/toothlight/v4/SaveFlightSequence.tsx`
- Create: `src/components/toothlight/v4/SaveFlightSequence.module.css`
- Create: `tests/toothlight-v4-sequences.test.mjs`

**Step 1: Write source test**

Assert:

- Draft Glow is separate from Save Flight;
- Save Flight only runs after save success;
- reduced-motion fallback exists for both;
- Save Flight references Network and Tanda/guide layer;
- parent/child treatment uses one component with intensity/pacing props.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-sequences.test.mjs
```

Expected:
FAIL until components exist.

**Step 3: Implement components**

`DraftGlowSequence`:

- card settles;
- selected glow forms;
- save CTA becomes available.

`SaveFlightSequence`:

- card lifts;
- Tanda/guide light carries it;
- Network aperture opens;
- success state appears.

Props:

- `mode?: "child" | "parent"`
- `intensity?: "calm" | "wonder"`
- `onComplete?: () => void`

**Step 4: Verify**

```powershell
node tests/toothlight-v4-sequences.test.mjs
```

Expected:
PASS.

**Step 5: Commit**

```powershell
git add src/components/toothlight/v4/DraftGlowSequence* src/components/toothlight/v4/SaveFlightSequence* tests/toothlight-v4-sequences.test.mjs
git commit -m "feat: add toothlight state transition animations"
```

---

### Task 8: Add V4 Data Model Migration

**Files:**
- Create: `supabase/migrations/20260521_tfn_toothlight_v4.sql`
- Create: `tests/toothlight-v4-schema.test.mjs`

**Step 1: Write schema test**

Assert migration includes:

- `tfn_toothlights`
- `tfn_future_notes`
- `tfn_family_contributions`
- `tfn_product_events`
- RLS enabled on private tables;
- future notes are not public-read;
- indexes on `user_id`, `toothlight_id`, and `child_id` or `child_profile_pda`.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-schema.test.mjs
```

Expected:
FAIL until migration exists.

**Step 3: Implement migration**

Create tables with conservative fields from `MASTER_BUILD_BRIEF.md`.

Privacy rules:

- `tfn_future_notes`: user-owned private access only plus service role;
- `tfn_family_contributions`: insert through service route, public read avoided for private note text;
- `tfn_toothlights`: owner read, plus share status support;
- `tfn_product_events`: service/owner insert.

**Step 4: Verify**

```powershell
node tests/toothlight-v4-schema.test.mjs
```

Expected:
PASS.

**Step 5: Commit**

```powershell
git add supabase/migrations/20260521_tfn_toothlight_v4.sql tests/toothlight-v4-schema.test.mjs
git commit -m "feat: add toothlight v4 database schema"
```

---

### Task 9: Add V4 Save API Boundary

**Files:**
- Create: `src/app/api/toothlight/save/route.ts`
- Create: `src/lib/toothlight/server/save-toothlight.ts`
- Create: `src/lib/toothlight/server/product-events.ts`
- Create: `tests/toothlight-v4-save-api.test.mjs`

**Step 1: Write source test**

Assert:

- route exists under `/api/toothlight/save`;
- requires auth unless `NEXT_PUBLIC_TEST_MODE=true`;
- returns deterministic demo data in test mode;
- does not store future note body in cNFT metadata;
- references the existing cNFT/escrow helpers through an adapter boundary, not directly from UI.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-save-api.test.mjs
```

Expected:
FAIL until API exists.

**Step 3: Implement route**

For first proof:

- parse V4 draft payload;
- validate child name, toothlight name, caption, image/glow fields;
- in test mode, return deterministic `toothlightId`, `milestonePda`, `imageUri`, `metadataUri`;
- in non-test mode, return a clear `501` if real V4 save adapter is not enabled yet, or call the extracted save service if ready.

Do not wire real provider payment.

**Step 4: Implement event helper**

Create a small server helper to log product events when Supabase service key is configured. It should fail open for the first proof.

**Step 5: Verify**

```powershell
node tests/toothlight-v4-save-api.test.mjs
```

Expected:
PASS.

**Step 6: Commit**

```powershell
git add src/app/api/toothlight/save src/lib/toothlight/server tests/toothlight-v4-save-api.test.mjs
git commit -m "feat: add toothlight v4 save boundary"
```

---

### Task 10: Add Saved Toothlight Page And Future Note UI

**Files:**
- Create: `src/app/toothlight/t/[id]/page.tsx`
- Create: `src/app/toothlight/t/[id]/note/page.tsx`
- Create: `src/components/toothlight/v4/FutureNotePanel.tsx`
- Create: `src/components/toothlight/v4/FutureNotePanel.module.css`
- Create: `src/app/api/toothlight/[id]/future-note/route.ts`
- Create: `src/lib/toothlight/server/future-notes.ts`
- Create: `tests/toothlight-v4-note.test.mjs`

**Step 1: Write source test**

Assert:

- page shows `Note Started` and `Sealed for later`;
- UI copy uses `note for later`, not formal letter-first language;
- note API does not expose note body publicly;
- saved page can show note status without content.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-note.test.mjs
```

Expected:
FAIL until note UI/API exists.

**Step 3: Implement saved page**

Build a V4 saved page with:

- Toothlight card;
- on-chain record status placeholder;
- future note status;
- Smile Fund status;
- family invite CTA;
- no private note content.

**Step 4: Implement future note panel**

States:

- no note;
- Note Started;
- Sealed for later.

Fields:

- short seed note;
- full future note;
- unlock age/date selector, default age 10;
- save action.

**Step 5: Implement API route**

Test mode:

- returns deterministic status.

Real mode:

- require authenticated user;
- write to `tfn_future_notes`;
- do not expose note body on public GET.

**Step 6: Verify**

```powershell
node tests/toothlight-v4-note.test.mjs
```

Expected:
PASS.

**Step 7: Commit**

```powershell
git add src/app/toothlight/t src/components/toothlight/v4/FutureNotePanel* src/app/api/toothlight src/lib/toothlight/server/future-notes.ts tests/toothlight-v4-note.test.mjs
git commit -m "feat: add toothlight future note flow"
```

---

### Task 11: Add Family Note/Gift Entry Page

**Files:**
- Create: `src/app/toothlight/t/[id]/family/page.tsx`
- Create: `src/components/toothlight/v4/FamilyContributionForm.tsx`
- Create: `src/components/toothlight/v4/FamilyContributionForm.module.css`
- Create: `src/components/toothlight/v4/FamilyNodeOrbit.tsx`
- Create: `src/components/toothlight/v4/FamilyNodeOrbit.module.css`
- Create: `src/app/api/toothlight/[id]/family-contribution/route.ts`
- Create: `src/lib/toothlight/server/family-contributions.ts`
- Create: `tests/toothlight-v4-family.test.mjs`

**Step 1: Write source test**

Assert:

- default CTA/copy is `Add a gift and a note for later`;
- note-only path exists;
- gift path is provider-demo-safe and does not call paused real card payment endpoints;
- family note and family gift have different related node colors;
- family page does not require crypto knowledge in primary copy.

**Step 2: Run and verify failure**

```powershell
node tests/toothlight-v4-family.test.mjs
```

Expected:
FAIL until family flow exists.

**Step 3: Implement family page**

Build:

- memory preview;
- short contribution form;
- note tone chips;
- optional gift amount placeholder;
- fee disclosure placeholder only when gift mode starts;
- Family Node Arrival visual through `FamilyNodeOrbit`.

**Step 4: Implement API route**

Test mode:

- return deterministic contribution and node kind.

Real mode:

- authenticated parent moderation can be deferred;
- write contribution intent to Supabase if configured;
- do not process real card payment.

**Step 5: Verify**

```powershell
node tests/toothlight-v4-family.test.mjs
```

Expected:
PASS.

**Step 6: Commit**

```powershell
git add src/app/toothlight/t src/components/toothlight/v4/Family* src/app/api/toothlight src/lib/toothlight/server/family-contributions.ts tests/toothlight-v4-family.test.mjs
git commit -m "feat: add toothlight family contribution flow"
```

---

### Task 12: Add V4 Playwright Proof Test

**Files:**
- Create: `tests/toothlight-v4-proof.spec.ts`
- Modify: `package.json` if adding a named script is desired

**Step 1: Write Playwright test**

Test mobile happy path:

1. Open `/toothlight`.
2. Verify Product Entry Read area is visible.
3. Tap `Create a Toothlight`.
4. Create or use a test fixture image/drawing.
5. Choose a glow.
6. Verify Draft Glow preview appears.
7. Tap `Save this Toothlight`.
8. In test mode, verify Save Flight/success.
9. Open saved Toothlight page.
10. Start note.
11. Seal note.
12. Open family page.
13. Add note-only contribution.
14. Verify family node appears.

**Step 2: Run only V4 test**

```powershell
npx playwright test tests/toothlight-v4-proof.spec.ts --project="Mobile Chrome"
```

Expected:
PASS.

**Step 3: Run source tests**

```powershell
node tests/toothlight-v4-routing.test.mjs
node tests/toothlight-v4-state.test.mjs
node tests/toothlight-v4-card.test.mjs
node tests/toothlight-v4-entry-read.test.mjs
node tests/toothlight-v4-entry-page.test.mjs
node tests/toothlight-v4-make.test.mjs
node tests/toothlight-v4-sequences.test.mjs
node tests/toothlight-v4-schema.test.mjs
node tests/toothlight-v4-save-api.test.mjs
node tests/toothlight-v4-note.test.mjs
node tests/toothlight-v4-family.test.mjs
```

Expected:
All PASS.

**Step 4: Run build**

```powershell
npm run build
```

Expected:
PASS.

**Step 5: Commit**

```powershell
git add tests/toothlight-v4-proof.spec.ts package.json
git commit -m "test: add toothlight v4 proof coverage"
```

---

### Task 13: Visual Verification Checkpoint

**Files:**
- No source files unless fixes are needed.

**Step 1: Start local server**

```powershell
npm run dev
```

**Step 2: Verify in browser**

Open:

- `http://localhost:3000/toothlight`
- `http://localhost:3000/toothlight/make`

Check:

- Product Entry Read is legible within 2 to 3 seconds;
- no horizontal overflow on mobile;
- CTA remains accessible;
- Draft Glow and Save Flight do not block controls;
- text does not overlap;
- reduced motion is acceptable;
- page does not feel wallet-first.

**Step 3: Fix issues**

If screenshots show broken crop, blank assets, or text overlap, patch only the V4 files.

**Step 4: Re-run verification**

```powershell
npx playwright test tests/toothlight-v4-proof.spec.ts --project="Mobile Chrome"
npm run build
```

Expected:
PASS.

**Step 5: Commit fixes**

```powershell
git add src/app/toothlight src/components/toothlight/v4 tests/toothlight-v4-proof.spec.ts
git commit -m "fix: polish toothlight v4 first proof"
```

---

## Final Verification Before Handoff

Run:

```powershell
npm run build
npx playwright test tests/toothlight-v4-proof.spec.ts --project="Mobile Chrome"
```

Optional broader regression:

```powershell
npx playwright test
```

Report:

- build status;
- V4 proof test status;
- screenshots or browser observations;
- known exclusions;
- whether real save/mint is demo-mode only or connected.

## Known Exclusions After First Proof

- Real card payment provider.
- Full voice note.
- Full education drip.
- Contract fee changes.
- Yield/staking/AUM behavior.
- Full parent dashboard.
- Random keeper cameo system.
- Full public SEO launch for `/toothlight`.
