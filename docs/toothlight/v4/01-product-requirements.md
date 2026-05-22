# Toothlight V4 Product Requirements

Date: 2026-05-21
Status: working draft

## One-Sentence Product Direction

Toothlight turns a lost tooth into a glowing family time capsule, with a future letter and optional Smile Fund gift saved for later.

## Target Users

### Child

The child helps make the Toothlight. They should feel ownership of the photo, drawing, glow, name, and simple story.

### Parent

The parent saves the Toothlight, controls privacy, writes the future letter, manages the Smile Fund, and decides what family can see.

### Grandparent / Family

Family members open the Toothlight page, understand the memory, and can add a gift and note for later without needing crypto knowledge.

## Core Product Objects

### Toothlight

A Toothlight is the saved lost-tooth memory. It can include:

- child display name;
- tooth nickname;
- photo or drawing;
- selected glow/filter;
- short story caption;
- date created;
- public-safe share page;
- on-chain mint/provenance link after parent save;
- connection to a child Smile Fund.

### Locked Letter

A private future message attached to a Toothlight. It can include:

- parent-written text;
- optional AI-assisted draft;
- optional voice note in a later phase;
- unlock date;
- visibility status on the Toothlight page;
- edit/delete/export controls before unlock.

### Smile Fund

A parent-controlled digital piggy bank attached to the child profile, not a separate fund for every tooth. Many Toothlights can point into the same Smile Fund.

### Family Note

A lightweight future note from a grandparent or family member. It can exist with or without a gift, but the default invitation is gift plus note.

## Creation Flow

1. Child and parent make the Toothlight before login friction.
2. Parent taps `Save this Toothlight`.
3. Account creation/sign-in happens as part of saving.
4. The public-safe Toothlight is minted and stored.
5. Parent receives a saved-memory email.
6. Email and Toothlight page invite the parent to write the future letter, start the Smile Fund, and invite family.

## Unlock Model

Default recommendation:

- age 10 as the recommended first learning unlock;
- age 12 as a more mature learning option;
- age 18 as adult handoff;
- custom date for parent choice.

Product rule:

The Toothlight can be revisited before unlock. The private letter content stays locked until the chosen unlock date unless the parent changes it.

## Grandparent Flow

The grandparent experience should be its own stream.

Initial direction:

- open the Toothlight memory;
- see that a locked letter or future gift exists;
- add a gift and note for later;
- avoid wallet-first language;
- show payment fees clearly only when payment starts.

## Education Layer

The education layer begins before unlock and prepares the child for the Smile Fund.

Initial topics:

- saving;
- waiting;
- ownership;
- digital ownership;
- networks;
- fees;
- risk;
- parent-controlled access.

The education layer should feel like a family learning journey, not a conversion sequence.

## Success Metrics

North-star metric:

- family invites sent per saved Toothlight.

Supporting metrics:

- Toothlights saved;
- future letters created;
- family notes created;
- Smile Fund starts;
- Smile Fund deposits;
- education opt-ins;
- child return visits before unlock.
