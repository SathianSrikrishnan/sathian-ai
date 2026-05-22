# Toothlight V4 Master Build Brief

Date: 2026-05-21
Status: correction-dump draft
Owner: Tooth Fairy Network

## How To Use This Brief

This is the controlling document for Toothlight V4. Future product planning, repo audits, implementation plans, and Codex execution should start here before reading the supporting documents.

Use this draft for one large correction dump. Correct names, flows, product priorities, exclusions, business assumptions, animation choices, and anything that feels off. After that correction pass, the next step is a repo architecture audit and then a detailed implementation plan.

Supporting docs:

- `docs/toothlight/v4/00-v4-decision-brief.md`
- `docs/toothlight/v4/01-product-requirements.md`
- `docs/toothlight/v4/02-ux-and-page-flow.md`
- `docs/toothlight/v4/03-technical-requirements.md`
- `docs/toothlight/v4/04-business-model-and-costs.md`
- `docs/toothlight/v4/05-open-questions.md`
- `docs/toothlight/v4/06-animation-and-state-system.md`

## One-Sentence Product Definition

Toothlight turns a lost tooth into a glowing family time capsule: a child-made memory, a private future letter, and an optional Smile Fund gift saved for later.

## Product Thesis

The product should create an easy, meaningful tradition around losing a tooth in the digital age.

The child makes the magic. The parent preserves the memory. The family adds meaning for later. The Smile Fund turns the moment into a future gift without making the experience crypto-first.

The first screen must prove the product visually before the parent reads. In the first 2 to 3 seconds, the parent should understand the basic transformation:

> lost tooth moment -> photo/drawing -> glow/filter -> tiny story -> Toothlight -> saved future gift.

This can happen through the first loading image, a short hero animation, or a tightly staged product-entry sequence. It cannot depend on the word `Toothlight` alone.

Important distinction:
The opening may use the classic Tooth Fairy ritual of tooth -> magic tap -> coin -> piggy bank, but that beat explains the Smile Fund and the Tooth Fairy Network ritual. It does not define the Toothlight by itself. The visual bridge is the shared wand/glow effect: the same magic that turns the tooth ritual into a gift also turns the photo/drawing/story into a Toothlight.

## World And Product Language

### Tooth Fairy Network

The Tooth Fairy Network is the world. It is the visual and narrative system where Toothlights live.

It can include Tanda, Keepers, storybook imagery, education journeys, and the broader constellation of saved Toothlights. It should make the product feel alive, but it should not create friction in the core creation flow.

### Toothlight

A Toothlight is the product object.

It is an AI-enhanced lost-tooth memory that can include:

- the child's photo, drawing, or decorated image;
- selected glow/filter;
- tooth nickname;
- short memory caption;
- private future letter;
- optional voice note in a later phase;
- optional family notes;
- optional Smile Fund connection;
- public-safe on-chain record after parent save.

### Smile Fund

The Smile Fund is the parent-controlled digital piggy bank for the child.

One child Smile Fund should support many Toothlights. A deposit can be associated with a specific Toothlight, but the fund belongs to the child profile, not to one tooth.

## Strategic Positioning

Parent-facing:

> Make the memory together now. Save a letter for later. Let family add gifts and notes that grow with the child.

Grandparent-facing:

> Add a gift and a note for later, so the child receives more than money when the Toothlight opens.

Child-facing:

> Make your tooth glow.

Product positioning:

> A Toothlight is a glowing time capsule for a lost tooth, saved with a future letter and optional Smile Fund.

## Non-Negotiable Guardrails

- Do not lead with wallets, blockchain, NFTs, or crypto mechanics.
- Do not imply private letters or voice notes are fully on-chain.
- Do not use yield, staking, portfolio, managed assets, or investment-return language in V4 launch copy.
- Do not force the parent to write a full emotional letter before the child can finish the creation experience.
- Do not replay long cinematic animations on routine page visits.
- Do not replace the current live site until V4 is tested.
- Do not let V3's current architecture dictate V4's information architecture.

## MVP Golden Path

This is the first build slice.

1. Parent and child see the product transformation in the first 2 to 3 seconds.
2. Tanda is present as the primary guide into the world.
3. Child and parent enter the Toothlight creation flow.
4. Child uploads or takes a photo, or starts from a drawing.
5. Child optionally adds marks or decorations.
6. Child chooses a glow/filter.
7. The finished visual memory becomes a Toothlight card on screen.
8. Draft Glow animation plays.
9. Parent adds or confirms missing basics: child display name, tooth nickname, short caption.
10. Parent taps `Save this Toothlight`.
11. Account creation/sign-in happens as part of saving.
12. The public-safe Toothlight record is saved and minted only after parent save succeeds.
13. Save Flight animation plays: Tanda carries the Toothlight into the Network.
14. Parent lands on the saved Toothlight page.
15. Parent can start a short seed note or complete the future letter.
16. Letter Started creates a partial visual state.
17. Full letter save creates Letter Seal and upgrades the Toothlight to Sealed.
18. Parent can invite family.
19. Family page defaults to `Add a gift and a note for later`.
20. Family note/gift creates Family Node Arrival and upgrades the Toothlight toward Constellated.

## MVP Exclusions

These can be designed, but should not block the first V4 proof.

- Full education drip system.
- Managed yield, staking, AUM products, or Smile Fund Plus.
- Full parent dashboard with every possible account feature.
- Full voice agent.
- Broad story world pages.
- Random keeper cameos throughout the app.
- Advanced AI image transformations that risk changing the child's original photo identity.
- Real card-payment launch before provider approval, fee disclosure, webhook, receipt, refund, and support paths are ready.

Important:
The broad story world can be deferred, but the story wrapper cannot be absent. Tanda and the idea of the Tooth Fairy Network need to appear in MVP enough for the child and parent to understand where Toothlights live.

## Core User Roles

### Child

The child helps create the visual memory. The child should feel ownership over the photo/drawing, glow, tooth name, and simple story.

The child can revisit the saved Toothlight before unlock, but cannot see private locked letter content before the unlock rule allows it.

### Parent

The parent saves the Toothlight, controls the account, manages privacy, writes the future letter, chooses unlock timing, manages the Smile Fund, and decides what family can access.

The parent should feel they are preserving a future gift, not onboarding into a wallet product.

### Grandparent / Family

Family members open a parent-shared Toothlight page and can add a gift and note for later. They should not need to understand crypto, wallet custody, or NFT mechanics.

## Primary Route Map

Recommended initial V4 routes:

- `/toothlight` - product entry and ritual start.
- `/toothlight/make` - mobile-first creation flow.
- `/toothlight/save` - parent save/account step.
- `/toothlight/t/[id]` - saved Toothlight share page.
- `/toothlight/t/[id]/letter` - parent future-letter editor.
- `/toothlight/t/[id]/family` - family contribution page.
- `/toothlight/dashboard` - lightweight parent shelf for children and Toothlights.
- `/toothlight/parents` - trust, privacy, and Smile Fund explanation.

Defer:

- `/toothlight/network` - story/world layer.
- full education journey routes.
- deep reporting dashboards beyond basic internal metrics.

## Page Requirements

### 1. Product Entry

Job:
Start the ritual quickly and make the product legible before explanation.

Requirements:

- mobile-first;
- visually show Toothlight as a real object;
- communicate the full transformation in the first 2 to 3 seconds;
- avoid long explanation;
- CTA should lead into making the Toothlight;
- Tanda should be present as the guide;
- the page should not feel like a landing-page essay.

First-read visual sequence:

1. A lost tooth moment appears on a phone or in the child's hand.
2. Tanda flies in and performs the familiar ritual: tooth, wand tap, coin/gift light, Smile Fund hint.
3. The exact same wand/glow signature transfers into the Toothlight explanation.
4. Tanda photographs or reveals the child's tooth moment on the phone.
5. The photo/drawing gains the same glow/filter.
6. A tiny story line appears or forms beside it.
7. The memory becomes a finished Toothlight card.
8. The Toothlight hints at joining the Network.

This can be an improved version of the current homepage animation idea: Tanda reviews the tooth/photo, the memory transforms into a Toothlight, the Toothlight rises toward the Network, and a coin drops into a Solana-themed piggy bank or Smile Fund object.

Design rule:
The product can be called Toothlight without making every UI element tooth-shaped. The UI should feel polished, standard, and parent-trustworthy. Teeth are the childhood milestone and entry point, not the shape language for every component.

Primary copy:

- `Make your tooth glow.`
- `Create a Toothlight`

How-it-works section:

Use a visual strip with minimal words:

1. Make it: child photo/drawing plus glow.
2. Save it: the Toothlight card joins the Network.
3. Seal it: parent letter upgrades the Toothlight.
4. Share it: family note/gift lights a node.

The section should explain mostly through images, state changes, and motion. Copy should label the steps, not teach the whole product.

### 2. Make Toothlight

Job:
Let the child and parent create the visual memory.

Inputs:

- photo upload/camera;
- optional drawing marks;
- tooth nickname;
- short caption or story seed;
- selected glow/filter.

Rules:

- creation can happen before account friction;
- original image remains recoverable;
- child marks remain visibly child-made;
- AI should preserve identity and composition;
- the interface should be visual, not copy-heavy.

### 3. Draft Glow

Job:
Make the child feel the creation has become a Toothlight card before it is saved.

Trigger:
The child finishes the photo/drawing/glow.

Animation:

- art settles into a Toothlight-shaped card;
- selected glow forms around the art;
- Tanda or a guide light acknowledges the memory;
- parent save action appears.

Rule:
Do not show the full Network flight before parent save/account creation.

### 4. Parent Save

Job:
Turn the session creation into a parent-controlled saved Toothlight.

CTA:

- `Save this Toothlight`

Supporting copy:

- `Google keeps it in your parent account.`

Rules:

- `Continue with Google` is not the emotional CTA;
- save/account happens only when parent chooses to preserve the Toothlight;
- minting/storage costs begin after parent save succeeds;
- if unauthenticated, the save CTA starts account sign-in.

### 5. Save Flight

Job:
Show that the Toothlight has joined the Tooth Fairy Network.

Trigger:
Parent save and mint/store operation succeeds.

Animation:

- Toothlight card lifts;
- Tanda or a guide light carries it upward/outward;
- Network field opens briefly;
- Toothlight joins the field;
- saved state appears.

Performance rule:
Target 2.5 to 4 seconds, skippable, with a static success fallback and reduced-motion mode.

### 6. Saved Toothlight Page

Job:
Make the saved object feel worth returning to and sharing.

Visible elements:

- photo/glow/story;
- on-chain record status in public-safe language;
- Smile Fund summary if active;
- locked letter status;
- family note/gift constellation;
- share/invite action.

Important:
If a locked letter exists, the Toothlight should look meaningfully richer. It should not be hidden behind a tiny badge.

### 7. Future Letter

Job:
Create the emotional value layer.

Inputs:

- unlock date;
- short seed note;
- full future letter;
- optional AI draft help;
- optional voice note later.

Recommended behavior:

- do not force the full letter before save;
- encourage a fast seed note immediately after save;
- use email and saved page to bring the parent back to finish the full letter;
- AI helps the parent write, but never pretends to be the parent.

Naming direction:
The product can talk about this as a `note for later` or `future note` in simple UI, while the state uses the stronger sealed-object metaphor. It is emotionally a message to the child's future older self, not a formal letter-writing task.

Recommended labels:

- CTA: `Write a note for later`
- Saved state: `Sealed for later`
- Internal object: `future_note`
- Avoid making the primary UI say `letter` if that makes the task feel too formal.

Prompt examples:

- `What do you want Kai to remember about today?`
- `What are you proud of?`
- `What do you hope they understand when they read this?`

### 8. Family Page

Job:
Convert sharing into notes and Smile Fund gifts.

Default CTA:

- `Add a gift and a note for later`

Secondary CTA:

- `Add a note only`

Rules:

- show the memory first;
- explain that the child receives the note later;
- avoid wallet-first language;
- show payment fees clearly only when payment starts;
- family notes should be lightweight and editable before submission.

### 9. Parent Dashboard

Job:
Give parents a simple way to find children, Smile Funds, and Toothlights.

MVP version:

- child profiles;
- Toothlight shelf;
- letter status;
- family invite status;
- Smile Fund status;
- next suggested action.

Not MVP:

- complex analytics UI;
- full financial account center;
- education timeline management.

## Toothlight Visual States

These are internal states. Do not call them tiers in the product UI.

### Draft Glow

Meaning:
The child finished the visual memory, but the parent has not saved it yet.

Visual:

- Toothlight-shaped card exists;
- glow surrounds the art;
- no permanent Network mark;
- no lock, seal, constellation, or fund marker.

### Spark

Meaning:
The base Toothlight exists after parent save.

Visual:

- soft live border;
- subtle warm/celestial glow;
- small Network mark;
- no cheap unfinished look.

### Letter Started

Meaning:
The parent captured a short seed note but has not completed the full future letter.

Visual:

- small unsealed letter marker;
- partial warm thread in the border;
- visibly different from Spark when seen in a constellation;
- less complete than Sealed without looking broken.

Possible internal names:

- `Letter Started`
- `Kindled`
- `Seeded`

### Sealed

Meaning:
A real future letter exists.

Visual:

- warmer gold border;
- small lock/seal motif;
- letter presence is obvious;
- letter content remains private;
- Toothlight feels meaningfully richer than Spark.

### Smile Fund Active

Meaning:
The child has a parent-controlled Smile Fund attached.

Visual:

- small jar/light/coin marker;
- should not overpower the Toothlight state;
- Smile Fund alone should not create Sealed.

### Constellated

Meaning:
Family has joined the Toothlight.

Requirements:

- one or more family notes;
- or one or more Smile Fund gifts;
- ideally both over time.

Visual:

- small surrounding nodes/stars;
- family note nodes use soft pearl / warm paper light;
- family gift nodes use warmer gold / coin light;
- gift plus note uses a richer blended node;
- multiple family members should create related tints, not random colors.

Rule:
The colors should communicate the family layer quietly. They should not become a leaderboard or game-badge system.

## Animation System

### Principle

Animation exists to show state changes, not to decorate the page.

The product object is the Toothlight card. Motion should show the card becoming real, joining the Network, being retrieved, receiving a private letter, and gathering family meaning.

### Core Animation Moments

1. Draft Glow: child finishes the visual creation.
2. Save Flight: parent saves and the Toothlight joins the Network.
3. Retrieval: a saved Toothlight returns from the Network when opened later.
4. Letter Seal: parent saves a full future letter.
5. Family Node Arrival: family adds a note, gift, or both.
6. Education Unlock: future reveal or learning moment.

### Keeper Rules

Tanda is the first character to lock for V4.

Other keepers can be Ratoncito Perez, Kkachi, or new characters, but they should be introduced by product role:

- save guide;
- note messenger;
- family gift carrier;
- education guide;
- world ambience.

Do not add random keeper cameos to critical save/payment flows until the core animation language is stable.

MVP story wrapper:
Tanda and the Network must be present enough to seed the world. Keepers should guide or mark specific product moments, but they should not turn the MVP into a broad storybook site before the creation loop works.

Parent/child consistency recommendation:
Use the same animation language and the same underlying Save Flight component for both child and parent contexts. Adjust intensity, pacing, and copy rather than creating separate worlds. Child mode can feel more wondrous; parent mode should feel calmer and more trustworthy. This avoids the current V3 problem where pages feel like different products.

### Production Workflow

Every major animation moves through these gates:

1. Purpose: what action triggers it, what state changes, and how long it can be.
2. Storyboard beats: 3 to 5 beats.
3. Fulcrum frames: key images where motion changes direction or meaning.
4. Asset locks: transparent poses, scale, crop, color, and mobile test.
5. Rough motion: low-fidelity timing pass.
6. Implementation: modular layers using CSS, GSAP, SVG paths, WebP/PNG cutouts, or canvas when needed.
7. Verification: desktop, mobile, reduced motion, no overflow, no bad crop, no blocked CTA.

First production proof:
Product Entry Read plus Draft Glow plus Save Flight together.

Second:
Letter Seal.

Third:
Family Node Arrival.

## AI Behavior

### AI Is A Helper, Not The Parent

AI can help draft, summarize, clean up, and prompt. It should never pretend to be the parent or replace the parent's emotional voice.

### AI Use Cases

1. Future Letter Helper
   - Inputs: child name, tooth nickname, memory caption, tone.
   - Output: short editable draft.
   - Parent owns final text.

2. Child Story Capture
   - Turns voice or typed fragments into a simple memory caption.
   - Example: `Kai lost this tooth after breakfast and showed everyone with a huge smile.`
   - This is not the private future letter.

3. Family Note Helper
   - Tone choices: proud, funny, blessing, short and sweet.
   - Draft is editable before submission.

4. Magic Trace
   - Optional later feature.
   - Turns a rough child mark into a gentle accent while preserving the child's hand.
   - Should feel like Tanda helped the mark glow, not like the app cleaned it away.

### Voice Direction

MVP should test controlled voice prompts before a full voice agent.

Required capabilities:

- record short audio;
- transcribe;
- draft caption or letter;
- parent approves text before saving;
- original voice note optional.

Do not make a full real-time voice agent a blocker for V4 MVP.

## Privacy And Unlock Rules

Defaults:

- parent controls the account;
- private letters and voice notes are off-chain;
- shared Toothlight pages can show that a locked letter exists;
- the child can revisit the Toothlight before unlock without seeing private letter content;
- parent can preview, edit, delete, or export private letters before unlock;
- family notes require safe defaults or parent moderation before child reveal.

Unlock options:

- age 10 recommended;
- age 12 optional;
- age 18 optional;
- custom date available.

Recommended product stance:
Age 10 is the default learning unlock. Age 18 is the adult handoff option.

## On-Chain Versus Off-Chain

Honest product wording:

> The Toothlight has an on-chain record. Private letters and voice notes stay in the parent-controlled account.

On-chain / permanent public-safe layer:

- cNFT mint/provenance record;
- metadata URI;
- child profile reference;
- milestone/lock date;
- Smile Fund deposits;
- escrow state.

Off-chain private/product layer:

- private future letters;
- voice notes;
- edit history;
- family note moderation;
- analytics;
- education drip state;
- parent dashboard state.

## Technical Direction

Architecture:
Use the current Next.js app and existing Solana/Supabase plumbing through clean adapters. Build V4 as an isolated `/toothlight` product surface before replacing the live `/toothfairy` surface.

Current tables to preserve:

- `tfn_children`
- `tfn_tooth_stories`

Proposed V4 tables:

- `tfn_toothlights`
- `tfn_future_letters`
- `tfn_family_contributions`
- `tfn_product_events`

Minting rule:
Mint only after parent save/account creation.

Reason:

- prevents mint/storage costs on abandoned sessions;
- anchors the Toothlight to a parent-controlled account;
- keeps sign-in framed as saving.

Encryption decision:
Account-level privacy is acceptable for first planning, but V4 should review application-level encryption before storing highly personal letters or original voice notes.

## Business Model

Primary model:
Free Toothlight creation drives trust and family sharing. Smile Fund contributions create revenue through a transparent platform fee.

Current contract reality:
The deployed escrow program and frontend references use a 2% platform fee and a 10% early withdrawal penalty.

Decision needed:
If V4 wants a 1% fee, that requires a contract and business-model decision. It should not be changed in copy alone.

Provider fee rule:
Do not hard-code "3%" or "4%" in product copy. Every checkout must show total amount, provider fee, platform fee, network fee if applicable, and saved amount before payment.

Future AUM:
Assets under management and staking/yield can be a later strategic workstream, but they are outside V4 MVP and require legal, custody, tax, disclosure, provider approval, contract, and support planning.

## Analytics And Reporting

North-star metric:

- family invites sent per saved Toothlight.

MVP events:

- Toothlight creation started;
- Draft Glow completed;
- save CTA clicked;
- sign-in started;
- Toothlight saved;
- mint/storage success;
- save abandonment;
- future letter seed started;
- future letter completed;
- family invite sent;
- family page opened;
- family note submitted;
- gift intent started;
- deposit completed;
- education opt-in.

Reporting goal:
Know where users drop off and whether the saved Toothlight creates family sharing.

## V3 Disposition

V3 is now the visual and interaction lab, not the final product.

Harvest from V3:

- ritual animation ideas;
- Tanda and Keeper assets;
- memory card visual language;
- Network/Atlas imagery;
- filter lab;
- parent trust copy;
- mobile interaction experiments.

Do not do:

- continue polishing V3 as if it were the final V4 architecture;
- add more one-off animation code without the V4 animation workflow;
- let old route/page structure define V4.

Current homepage animation disposition:
The existing Tanda/tooth/coin/piggy-bank animation is a useful seed for the V4 product-entry read. V4 should improve the idea so it explains the transformation from tooth moment to Toothlight to Network to Smile Fund in the first few seconds.

## Launch Sequence

1. Build V4 in isolation under `/toothlight`.
2. Use V4 as the provider-application demo.
3. Test with real families.
4. Open a limited public beta.
5. Replace the live site only after the product, payment path, mobile UX, and parent-trust metrics are credible.

## Acceptance Criteria For First V4 Proof

The first proof is not the whole business. It is the minimum slice that proves the new product language works.

It must show:

- the product transformation is clear in the first 2 to 3 seconds;
- Tanda/world wrapper is present without requiring long copy;
- a child can create a Toothlight visually;
- Draft Glow makes the card feel real;
- parent save is emotionally framed;
- Save Flight shows the Toothlight joining the Network;
- saved Toothlight page is rich enough to share;
- seed note or full letter changes the Toothlight state;
- family invite path is obvious;
- mobile layout works without text overlap;
- reduced-motion fallback exists;
- no crypto-first language appears in the primary flow.

## Repo Architecture Audit Goals

After this brief is corrected, audit the repo to answer:

1. What existing routes, components, hooks, APIs, database utilities, and Solana helpers can V4 reuse?
2. Which V3 components should be copied, adapted, or discarded?
3. Where should the isolated V4 route tree live?
4. What adapter layer is needed for Toothlight save/mint/store?
5. What data model changes are required before implementation?
6. What test coverage already exists?
7. What local commands verify build, typecheck, lint, and app behavior?
8. What needs to be mocked for a provider-demo build?
9. What assets are production-ready versus reference-only?
10. What is the smallest implementation plan that produces the first V4 proof?

## Implementation Plan Goals

The implementation plan should be written only after the repo audit.

It should include:

- exact route files;
- exact component boundaries;
- exact schema/migration plan;
- exact adapter/API boundaries;
- exact animation proof tasks;
- exact analytics events;
- exact verification commands;
- mobile screenshot checkpoints;
- reduced-motion checks;
- provider-demo mode;
- known exclusions.

## Correction Dump Checklist

Use this checklist for the next pass. Shorthand is fine.

### Product

- Is the one-sentence definition right?
- Is Toothlight definitely the product name?
- Is Tooth Fairy Network definitely the world name?
- Is Smile Fund correctly framed as one fund per child with many Toothlights?
- Is the MVP golden path right?
- What should be removed from MVP?

### UX

- Does the flow order feel right?
- Does the first 2 to 3 second product-entry transformation feel right?
- Should the future letter appear immediately after save, email-first, or both?
- Should seed note be required, recommended, or optional?
- Should family invite happen before or after the parent letter prompt?
- Does the parent dashboard need to be in the first proof?

### Animation

- Is Product Entry Read plus Draft Glow plus Save Flight the right first proof?
- Should parent mode use the same Save Flight or a calmer variant?
- What should the partial-letter state be called?
- Should Tanda be the first locked character?
- Which keeper role should come second: gift carrier, note messenger, or education guide?

### Business

- Should the MVP keep the current 2% fee or plan toward 1%?
- What deposit sizes should the product optimize around?
- Should the first provider demo support real money, sandbox money, or read-only flows?
- Is family invite still the north-star metric?

### Technical

- Is account-level privacy acceptable for MVP letters?
- Should application-level encryption be required before storing letters?
- Should a hash of the private letter be stored on-chain for tamper evidence?
- Should voice notes be MVP, fast-follow, or later?
- Should USDC/stablecoin support be planned now or deferred?

### Launch

- Is the provider-application demo the first external target?
- What does "ready for real families" require?
- What would make you comfortable replacing the live site?

## Current Open Decisions

1. MVP privacy level for future notes.
2. MVP voice scope.
3. Fee posture: current 2%, future 1%, or configurable fee.
4. Provider demo mode: real, sandbox, or read-only.
5. Whether full parent dashboard is first proof or fast-follow.
6. Exact first 2 to 3 second product-entry timing: how much ritual-to-coin happens before the Toothlight transformation begins.
7. Exact visual design boundary: how much tooth imagery is acceptable before it starts feeling childish or gimmicky.

## Newly Resolved Decisions

- The product entry should include a tooth-to-coin Smile Fund ritual hint.
- The wand/glow effect should visually connect the ritual, Toothlight creation, and Save Flight.
- The Toothlight itself should still be explained as photo/drawing plus glow plus story, not as a coin.
- Parent and child contexts should share the same animation language, with calmer parent pacing rather than separate visual worlds.
- The future-letter feature should be framed in UI as a note for later / future note, with sealed visual treatment when complete.
- The partial future-note state should start simple as `Note Started`.
- Keeper role order should be: Tanda first, then note messenger, then gift carrier, then education guide.
- Character order should be: Tanda first, then Ratoncito Perez, then Kkachi, with later Keepers added by role.
- The first production proof should include Product Entry Read, Draft Glow, and Save Flight together.

## Next Step After Correction Dump

After the correction dump is incorporated:

1. Run repo architecture audit.
2. Produce `docs/toothlight/v4/REPO_ARCHITECTURE_AUDIT.md`.
3. Produce `docs/plans/YYYY-MM-DD-toothlight-v4-implementation-plan.md`.
4. Set up an isolated V4 worktree or branch.
5. Execute the first proof in batches with visual checkpoints.
