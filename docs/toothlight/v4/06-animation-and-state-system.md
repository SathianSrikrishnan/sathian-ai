# Toothlight V4 Animation And State System

Date: 2026-05-21
Status: working draft

## Core Principle

Animation should make the Toothlight feel alive without making the product depend on long cinematic scenes.

The product object is the Toothlight card. Motion exists to show the card changing state, joining the Network, being retrieved, and gaining family meaning.

## Product Metaphor

The Toothlight behaves like a magical family safety deposit box:

- the child and parent create it;
- Tanda carries it into the Tooth Fairy Network;
- the Network protects it;
- the parent or child can retrieve it later;
- family gifts and notes gather around it over time.

This metaphor is useful if it stays visual. It should not require explanatory copy.

## Toothlight States

Do not call these tiers in the UI. They are internal states.

### 0. Draft Glow

Meaning:
The child has finished making the visual memory, but the parent has not saved it to an account yet.

Requirements:

- photo or drawing exists in the current session;
- glow/filter has been chosen or generated;
- title/caption may still be missing;
- parent account save has not completed.

Visual:

- card exists, but does not yet have the Network mark;
- glow is visible around the art itself, not around a permanent saved object;
- no lock, seal, constellation, or fund marker.

Animation:

- drawing/photo settles into a Toothlight-shaped card;
- the selected glow forms around the card;
- Tanda can acknowledge it and guide the parent toward saving.

Rule:
Do not show the full Network flight yet. The user should not feel the Toothlight is preserved until the parent saves it.

### 1. Spark

Meaning:
The base Toothlight exists.

Requirements:

- photo or drawing saved;
- title or tooth nickname saved;
- short caption or story seed saved;
- parent account save completed.

Visual:

- soft live border;
- subtle warm/celestial glow;
- one small Network mark;
- no cheap "unfinished" look.

Animation:

- photo/drawing settles into the card;
- border forms around it;
- Tanda or a small guide light acknowledges the save.

### 2. Sealed

Meaning:
A future letter exists.

Requirements:

- real parent letter saved, not only a blank placeholder;
- short seed note can create a "letter started" state, but not full Sealed.

Visual:

- warmer gold border;
- small lock/seal motif;
- letter presence is obvious but content remains private;
- Toothlight feels meaningfully richer than Spark.

Animation:

- letter folds/seals behind or beside the card;
- border warms from Spark to Sealed;
- lock glint appears once, then calms.

### 3. Constellated

Meaning:
Family has joined the Toothlight.

Requirements:

- one or more family notes;
- or one or more Smile Fund gifts;
- ideally both over time.

Visual:

- small surrounding nodes/stars;
- each note/gift can add a quiet point of light;
- do not turn the card into a noisy badge cluster.

Animation:

- new family node arrives and settles near the Toothlight;
- Smile Fund gift can create a small value trail;
- family note can create a softer paper/light trail.

## Secondary States

### Letter Started

Purpose:
Capture the 15-second seed note without forcing the full emotional future note.

Visual:

- small unsealed letter marker;
- partial warm thread in the border;
- visibly different from Spark when seen in a constellation;
- clearly less complete than Sealed without looking broken;
- copy can say `Letter started` in parent-only UI.
- product UI should generally prefer `Note started` or `Note for later` over formal `letter` language.

Transition:

When the parent finishes the future note, upgrade to Sealed.

### Smile Fund Active

Purpose:
Show that the child has a parent-controlled fund attached.

Visual:

- small jar/light/coin marker;
- should not overpower the Toothlight state.

Transition:

Smile Fund alone should not create Sealed. It can contribute to Constellated only when a person is attached to the gift.

## Core Animation Moments

### Product Entry Read

Trigger:
The user opens the Toothlight product entry page.

Goal:
Within 2 to 3 seconds, the parent should understand the transformation without reading a paragraph.

Recommended treatment:

- Tanda flies in and acknowledges the familiar lost-tooth ritual;
- tooth receives a wand tap;
- the tap creates the shared Toothlight glow signature;
- a coin or gift light drops into a Smile Fund object as a quick ritual hint;
- the same glow signature moves into the phone/photo/drawing;
- glow/filter forms around the child's source image;
- a tiny story line appears;
- the result becomes a Toothlight card;
- the card hints at the Network.

Use:
This is the first hero/product-entry proof. It can be an improved, tighter version of the current Tanda/tooth/coin/piggy-bank animation.

Rule:
This should explain the product, not become a long movie. If the user skips or motion is reduced, a static sequence should still make the transformation legible.

Critical distinction:
The tooth-to-coin moment explains the Tooth Fairy Network and Smile Fund ritual. The Toothlight is the photo/drawing/story object. The shared glow effect is what connects them.

### Save Flight

Trigger:
Parent taps `Save this Toothlight` and save/mint succeeds.

Recommended treatment:

- the Toothlight card lifts slightly;
- Tanda or a guide light carries it upward or outward;
- the Network field opens briefly;
- the card joins the field;
- success state appears.

Use this on every new Toothlight save.

Cut risk:
If this becomes a long cinematic sequence, it will slow the product down. Target 2.5-4 seconds, skippable, with a static success state as fallback.

Clarification:
This is the moment the Toothlight joins the Network. It should happen after parent save/account creation, not immediately after the child finishes drawing.

Parent/child treatment:
Use the same core Save Flight component and visual language in both contexts. Parent mode can have calmer pacing and lower sparkle intensity; child mode can feel more wondrous. Do not create separate visual worlds.

### Retrieval

Trigger:
Parent, child, or family opens a saved Toothlight page.

Recommended treatment:

- a subtle Network line glows;
- the Toothlight card settles into view as if brought down from the field;
- Tanda can appear only as a small guide, not a full scene.

Use a short version on revisit. Do not replay the full save flight every time.

### Letter Seal

Trigger:
Parent saves a future letter.

Recommended treatment:

- letter sheet folds into a small seal;
- seal tucks behind the Toothlight;
- border shifts into Sealed state;
- private content never flashes publicly.

### Family Node Arrival

Trigger:
Family note or gift is added.

Recommended treatment:

- one small node travels into the Toothlight orbit;
- the node pulses once and stays;
- if a gift is attached, a tiny value glint can pass into the Smile Fund marker.

Color language:

- family note: soft pearl / warm paper light;
- family gift: warmer gold / coin light;
- gift plus note: richer blended node, using both tones;
- multiple family members should create related tints, not random colors.

Rule:
The colors should explain the family layer quietly. They should not turn into a leaderboard, game badge system, or noisy status chart.

### Education Unlock

Trigger:
Child reaches unlock age or parent opens a learning moment.

Recommended treatment:

- the locked letter/fund marker opens;
- education path appears as a calm sequence, not a confetti moment;
- keep financial learning trustworthy and restrained.

## Keeper Cameos

Keeper animations can make the world feel alive, but they must not become random clutter.

### Tanda

Role:
Primary Toothlight guide.

Approved uses:

- save flight;
- retrieval;
- future-letter prompt;
- parent email illustration;
- first-time onboarding.

Current asset reference:

- `src/components/toothfairy/home/tanda-live-ritual-hero.tsx`
- `public/toothfairy/animation/live-hero-v1/*`

Current critique:

The existing homepage animation proves the pose-cutout method can work, but the code is too custom-scene-specific. V4 should reuse the idea and assets, not the exact implementation shape.

### Ratoncito Perez

Role:
Family gift / exchange / contribution cameo.

Possible micro-animation:

- Perez runs across the lower edge with a tooth;
- returns with a coin or gift light;
- settles the node into the Toothlight orbit.

Use:

- family contribution page;
- gift success;
- story/world page.

Avoid:

- making gift flow feel like a transaction game;
- using Perez on every page.

### Kkachi

Role:
Messenger, wish, sky path, note delivery.

Possible micro-animation:

- bird keeper carries a note ribbon;
- drops a small star/node into the Network;
- flies out quickly.

Use:

- future letter saved;
- family note saved;
- education email/world page.

Avoid:

- large flapping loops that distract from the parent task.

## Animation Production Workflow

Every important animation should move through gates.

### Gate 1: Purpose

Answer:

- what user action triggers this?
- what state changes?
- what should the user understand without reading?
- what is the maximum acceptable duration?

Reject if it is decorative only.

### Gate 2: Storyboard Beats

Define 3-5 beats.

Example for Save Flight:

1. Toothlight card glows.
2. Tanda enters and reaches.
3. Card lifts into a trail.
4. Network field opens.
5. Card lands and success state appears.

Example for Draft Glow:

1. Child's photo/drawing snaps softly into the Toothlight card.
2. Selected glow finishes forming around the art.
3. Tanda or a guide light acknowledges the completed memory.
4. Parent-facing save action appears.

Example for Letter Seal:

1. Parent saves the future note.
2. Letter folds into a private sealed shape.
3. Seal tucks behind the Toothlight.
4. Border warms into the Sealed visual state.

Example for Product Entry Read:

1. Tanda flies in toward a tooth on a phone or small ritual surface.
2. Wand tap creates the signature glow.
3. A coin/gift light drops into the Smile Fund object.
4. The same glow transfers to the photo/drawing.
5. The photo/drawing gains filter and story.
6. The finished Toothlight card hints at the Network.

Example for Family Node Arrival:

1. Family member saves a note, gift, or both.
2. A small node enters from the family page direction.
3. Node color shows note/gift type.
4. Node settles into the Toothlight orbit.

### Gate 3: Fulcrum Frames

Approve the few images where the motion changes direction or meaning.

Required for character-driven motion:

- entry pose;
- interaction pose;
- carry/transfer pose;
- exit or settled pose.

Do not generate a long frame sequence before these are approved.

### Gate 4: Asset Locks

For each character/object, approve:

- neutral reference;
- transparent cutout poses;
- scale relationship to the Toothlight card;
- allowed color/glow treatment;
- mobile crop test.

### Gate 5: Rough Motion

Build a low-fidelity motion pass with:

- approved stills;
- simple path;
- approximate duration;
- no final polish.

Approve timing before more image generation.

### Gate 6: Implementation

Build with modular layers:

- CSS keyframes for simple loops;
- GSAP for triggered sequences and timelines;
- SVG paths for trails;
- transparent PNG/WebP layers for characters;
- canvas only when needed for particles or compositing.

### Gate 7: Verification

Before approval:

- desktop screenshot;
- mobile screenshot;
- reduced-motion fallback;
- no horizontal overflow;
- no blank image/layer;
- no character cropped awkwardly;
- no text overlap;
- animation does not block the CTA;
- 60fps target on a normal phone where practical.

## Asset Requirements

### Toothlight Card

Needs:

- flat card state;
- slight 3D/perspective state;
- Spark border overlay;
- Sealed border overlay;
- Constellated node overlay;
- transparent shadow layer.

### Network Field

Needs:

- reusable background plate;
- node layer;
- trail layer;
- retrieval aperture;
- save-flight aperture.

### Character Cutouts

For each approved keeper:

- neutral reference;
- 3-5 transparent poses;
- one small idle pose;
- one reduced-motion static pose.

### UI Effects

Needs:

- border glow;
- lock/seal glint;
- family node arrival;
- coin/gift glint;
- note ribbon trail;
- soft particle layer.

## Randomness Rules

Small random keeper cameos are allowed only after the core flow is stable.

Rules:

- never block a form field or CTA;
- never explain essential state;
- never create different outcomes for the same saved data;
- respect reduced-motion;
- deterministic enough for testing;
- low frequency.

Recommended:

Use random cameos on idle story/world surfaces, not on critical save/payment flows.

Keeper roster rule:
Tanda should be locked first because she is the primary product guide. Other keepers can be Perez, Kkachi, or new characters, but they should be introduced through roles rather than because the roster exists. Each keeper needs a job: save guide, note messenger, family gift carrier, education guide, or world ambience.

Design boundary:
The product can be named Toothlight without making every object tooth-shaped. Tooth imagery should anchor the childhood milestone. The card, account surfaces, letter, family nodes, and Smile Fund UI should use polished standard product shapes unless the tooth form earns the moment visually.

## Build Strategy

V4 should ship animation in layers:

1. Product Entry Read: first 2 to 3 second explanation of tooth moment to Toothlight to Network/Smile Fund.
2. Draft Glow: child finishes the photo/drawing/glow and the card becomes real on screen.
3. Save Flight: parent saves the Toothlight and it joins the Network.
4. Retrieval: a saved Toothlight returns from the Network when opened later.
5. Letter Started and Letter Seal: seed note creates a partial state; full letter creates Sealed.
6. Family Node Arrival: gifts and notes form the constellation layer.
7. Keeper cameos: Tanda first, then role-based keepers.
8. Education unlock sequence.

This keeps the product usable even if later animation work is delayed.

## Rejection Rules

Reject animation if it:

- makes the product feel slower;
- hides the real photo/card;
- looks like generic sparkles pasted on top;
- turns Smile Fund into the main magic;
- requires paragraphs to understand;
- feels like a cheap game tier;
- relies on unapproved character art;
- fails mobile cropping;
- cannot be paused or reduced.

## Open Decisions

1. What exact Product Entry Read timing should be locked for the first 2 to 3 seconds?
2. How much tooth imagery is acceptable before the product feels too childish or gimmicky?

## Resolved Decisions

- A short seed note should create a distinct visual state.
- Family notes and family gifts should create different but related node colors.
- Tanda should be the first character locked for V4 production.
- Perez, Kkachi, or any new keeper should be role-driven and added only after the Tanda workflow is stable.
- The first animation priority should include Product Entry Read, then the creation path: Draft Glow into Save Flight, followed by Letter Seal.
- Parent and child contexts should share one animation language, with calmer parent pacing rather than separate visual worlds.
- The product-entry wand/glow effect should connect the tooth ritual, Toothlight creation, and Save Flight.
- The partial future-note state is `Note Started`.
- Keeper role order is: Tanda first, then note messenger, then gift carrier, then education guide.
- Character order is: Tanda first, then Ratoncito Perez, then Kkachi.
- The first production proof includes Product Entry Read, Draft Glow, and Save Flight together.
