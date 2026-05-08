# TFN Magic Studio Strategy

Date: 2026-05-06

## Live Product Update - 2026-05-07

The working MVP now treats Magic Studio as the front-door aha moment. The child draws first, the parent signs in before provider cost, the account receives three starter credits, and the chosen transformed artwork is carried into the saved keepsake.

The post-mint flow should stay memory-first. After a memory is saved, the best default next action is to open and share the keepsake. Smile Fund setup remains optional and behind an advanced panel until card checkout, receipts, fee disclosures, and MoonPay readiness are fully verified.

Credit language for MVP: three starter credits per parent account. More credit bundles are coming soon. Paid bundles should wait until the on-ramp and checkout surface are ready.

## Product Bet

Magic Studio is the missing bridge between a child's handmade tooth drawing and a valuable TFN keepsake. The AI output should transform the drawing while preserving the child's composition, roughness, color choices, handwriting, and emotional fingerprint.

The MVP should not depend on Samsung Drawing Assist. Samsung's experience is useful as a product reference, but the reliable implementation path is TFN-owned prompts, TFN-owned credits, and a provider-backed image edit flow.

## MVP Flow

1. Child draws for free.
2. Parent reaches Magic Studio preview.
3. Parent chooses up to three evergreen TFN styles.
4. Google sign-in happens before provider cost is incurred.
5. Signed-in account receives three starter magic credits.
6. Each successful generation spends one credit.
7. Failed provider calls refund the reserved credit.
8. Child/parent chooses the keepsake result.
9. Existing mint, save, share, and deposit paths continue after selection.

## MVP Styles

- Tanda Glow
- Storybook Ink
- Watercolor Memory
- Pencil Charm
- 3D Cartoon
- Tradition Magic

Mother's Day and other seasonal cards should wait until the evergreen style engine is working well.

## Cost Model

Current working assumption: one provider edit costs about $0.04.

- 1 generated result: about $0.04
- 3 starter credits: about $0.12 per signed-in account
- 10,000 accounts using all 3 credits: about $1,200 provider cost

This is reasonable as an acquisition cost if Magic Studio becomes the aha moment. Extra credits can later be bundled into minting, deposits, or paid generation packs.

## Revenue Path

- Free: drawing and original preview
- Signed in: three starter Magic Studio credits
- Paid or minting: high-res keepsake, mint/cNFT, premium export, extra credits
- Later bundle: 10 extra magic generations, likely $2.99 to $4.99 or included with a milestone/deposit product

## Risks

- Prompt drift: the AI may over-polish and erase the child's hand. Mitigation: prompts explicitly preserve composition, marks, handwriting, and imperfect childlike proportion.
- Provider cost abuse: anonymous generation is blocked. Credits require Google auth and are reserved before provider work.
- Failed calls: reserved credits are refunded after provider failure.
- Supabase dependency: the migration must be applied before this feature can run in production.
- Seasonal scope creep: seasonal card styles should stay out of MVP until the evergreen styles prove quality.

## Snapchat Roadmap

Snapchat should be presented as a next-stage distribution layer, not part of the first Magic Studio build.

Phase 1: share finished keepsake images outward.

Phase 2: prototype TFN AR lens concepts around the chosen keepsake.

Phase 3: evaluate Snap Camera Kit or Hosted WebAR for parent-controlled AR sharing.
