# Toothlight V4 Decision Brief

Date: 2026-05-21
Status: working planning packet, no implementation approved

## Core Decision

Build Toothlight V4 as a clean `/toothlight` product app inside the current site, with mobile-app readiness as a design constraint.

Do not replace the live Tooth Fairy Network experience until V4 has passed product, mobile, payment, and parent-trust testing.

## Product Spine

Toothlight turns a lost tooth into a family time capsule: the photo, glow, story, future letter, and optional Smile Fund gift saved for later.

## Business Loop

V4 has two loops.

### Loop 1: Free Toothlight Creation

The child and parent make the Toothlight:

- capture a photo or drawing;
- choose a glow;
- name the Toothlight;
- capture a short memory caption;
- save it to the parent account;
- mint the public-safe memory record only after parent save/account creation.

This loop is the acquisition product.

### Loop 2: Future Gift Layer

After the Toothlight is saved, the parent receives a follow-up surface by email and on the Toothlight page:

- write or record a future letter;
- start or attach the child's Smile Fund;
- invite grandparents and family;
- allow family to add a gift and note for later;
- opt into gentle education emails before the unlock age.

This loop is the conversion and retention product.

## V3 Disposition

V3 becomes the visual and interaction lab, not the final product.

Keep harvesting:

- ritual animation ideas;
- real memory card visual system;
- Network/Atlas imagery;
- Tanda and Keepers;
- deterministic filter lab;
- parent trust copy.

Stop spending polish time on V3 as the final product until V4 decides what survives.

## Launch Posture

Recommended sequence:

1. Build V4 in isolation under `/toothlight`.
2. Use V4 as a provider-application demo.
3. Test with real families.
4. Open a limited public beta.
5. Replace the live site only after the core metrics and payment path are credible.

## Current Defaults

- Parent account is required before minting.
- Smile Fund belongs to the child profile, with many Toothlights attached.
- The default unlock age is 10.
- Age 12, age 18, and custom dates are available.
- The child can revisit the Toothlight before unlock.
- The locked letter is visible as an object/status, but the content is private until unlock.
- Grandparents always see both actions: add a gift and add a note.
- The primary V4 success metric is family invites sent per saved Toothlight.

## Strategic Guardrails

- Do not use yield, staking, return, portfolio, or investment language in V4 launch copy.
- Keep private letters and voice notes off-chain.
- Use on-chain records for public-safe provenance and Smile Fund escrow.
- Show fees clearly before payment.
- Treat staking, managed crypto, and AUM expansion as a later regulated product stream.
