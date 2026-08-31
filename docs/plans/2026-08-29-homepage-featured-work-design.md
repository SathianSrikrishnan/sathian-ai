# Homepage Featured Work Design

Date: 2026-08-29
Status: approved for implementation

## Outcome

Make `Inside MonkeDAO` the first item under Featured work on sathian.ai while
keeping `The Polytheistic Test` immediately beneath it. Preserve the current
minimal editorial system and every project that already follows the writing.

## Editorial order

1. `Inside MonkeDAO` — label it as a film and firsthand field report. Use the
   approved opening cover and a CTA that promises both watching and reading.
2. `The Polytheistic Test` — retain its existing visual, description, and
   interactive-test CTA.
3. Existing featured site projects — retain their current order and behavior.

The order is intentional and explicit in code. It must not depend on article
dates or array position.

## Public context

Update the site agent's reviewed memory so `Inside MonkeDAO` is the newest
featured writing. Keep a separate memory card for `The Polytheistic Test` so a
visitor can still discover and compare the two pieces.

## Constraints

- No new homepage component system or decorative treatment.
- No changes to the site agent placement.
- No changes to the existing project order.
- No private interview material or surname may enter the public site.
- Desktop and mobile must retain readable image crops and link order.

## Verification

- Unit test locks the two writing slugs, order, labels, CTAs, and public memory.
- Existing site tests and production build pass.
- Browser QA confirms the homepage order and both article destinations on
  desktop and mobile.

