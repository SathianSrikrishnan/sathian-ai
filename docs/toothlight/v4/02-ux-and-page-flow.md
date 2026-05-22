# Toothlight V4 UX And Page Flow

Date: 2026-05-21
Status: working draft

## UX Principle

The child makes the magic. The parent saves the memory. The family adds meaning for later.

The product entry must explain the transformation visually in the first 2 to 3 seconds:

> lost tooth moment -> photo/drawing -> glow/filter -> short story -> Toothlight -> Network / Smile Fund hint.

This should happen through animation, first-load imagery, or a very tight visual sequence. It should not depend on long explanatory copy.

## Primary Mobile Flow

### 1. Make The Toothlight

Purpose:
Capture the child's real lost-tooth moment.

Inputs:

- photo or drawing;
- child display name if missing;
- tooth nickname;
- simple caption by text or prompted voice;
- optional drawing marks.

Copy direction:

- `Make your tooth glow.`
- `What should we call this Toothlight?`
- `Tell Tanda what happened.`

### 2. Choose The Glow

Purpose:
Make the output feel magical while preserving the real photo.

Requirements:

- original always recoverable;
- visual previews, no paragraphs;
- deterministic filters first;
- AI enhancement only when it preserves identity;
- child drawing stays visibly child-made.

### 3. Save This Toothlight

Purpose:
Convert the creation into a saved, parent-controlled object.

Primary CTA:

- `Save this Toothlight`

Supporting copy:

- `Google keeps it in your parent account.`

Rule:

Do not make `Continue with Google` the emotional CTA.

### 4. Saved Toothlight Page

Purpose:
Show a richer, sharper memory object that feels worth sharing.

Visible states:

- photo/glow/story;
- on-chain record status;
- Smile Fund summary;
- locked letter status;
- family notes/gifts;
- share/invite action.

If a locked letter exists, the page should look more meaningful, not merely show a small badge.

### 5. Parent Email

Purpose:
Bring the parent back into the deeper product after the child creation flow.

Email jobs:

- confirm the Toothlight is saved;
- invite the parent to write a future letter;
- explain the unlock date in concrete terms;
- invite family sharing;
- introduce Smile Fund as optional.

### 6. Future Letter

Purpose:
Create the emotional value layer.

Flow:

- choose unlock date;
- write short note;
- optionally ask AI for a draft;
- preview locked-letter status;
- save privately.

Voice direction:

Use controlled prompts first:

- `What do you want Kai to remember about today?`
- `What are you proud of?`
- `What do you hope they understand when they read this?`

### 7. Family / Grandparent Page

Purpose:
Convert sharing into notes and gifts.

Default action:

- `Add a gift and a note for later`

Secondary action:

- `Add a note only`

Rules:

- show the memory first;
- hide crypto complexity;
- explain fees at payment time;
- show the note as part of the future capsule.

## V4 Pages

Recommended route map:

- `/toothlight` - product home / ritual entry with first-read transformation.
- `/toothlight/make` - mobile-first creation flow.
- `/toothlight/save` - parent save/account step.
- `/toothlight/t/[id]` - saved Toothlight share page.
- `/toothlight/t/[id]/letter` - parent future-letter editor.
- `/toothlight/t/[id]/family` - family contribution page.
- `/toothlight/dashboard` - parent dashboard.
- `/toothlight/parents` - trust, privacy, and Smile Fund explanation.
- `/toothlight/network` - story/world layer after product clarity.

## V3 Assets To Reuse

Potential keepers:

- ritual animation;
- memory card component;
- Network aperture/Atlas field;
- Tanda as guided prompt character;
- filter lab;
- parent trust sections.

V3 should not determine the V4 information architecture.

## Product Entry Requirements

The first view of `/toothlight` should make the parent understand the product before reading.

Required visual beats:

1. Tanda flies in and acknowledges the familiar lost-tooth ritual.
2. Tanda taps the tooth with a wand and creates the shared Toothlight glow signature.
3. A coin/gift light drops into a Smile Fund object as a quick ritual hint.
4. The same glow transfers into the phone/photo/drawing.
5. The photo or drawing gains a glow/filter.
6. A tiny story line forms.
7. The result becomes a finished Toothlight card.
8. The Toothlight hints at joining the Network.

This can reuse the concept behind the current homepage animation, but V4 should tighten it into a cleaner product explanation.

Important:
The tooth-to-coin moment explains the Tooth Fairy Network ritual and the Smile Fund hint. The Toothlight itself is the photo/drawing/story object. The shared glow is what connects those ideas.

Design rule:
The Toothlight product does not require every UI element to be shaped like a tooth. Use normal, polished mobile UI components. Tooth imagery should explain the milestone, not dominate the interface.

The story/world layer is part of MVP in a light form: Tanda and the Network should be present enough to seed the world, while broad story pages remain deferred.
