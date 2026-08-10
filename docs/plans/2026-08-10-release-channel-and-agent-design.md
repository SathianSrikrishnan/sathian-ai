# Release channel and site-agent design

Date: 2026-08-10

## Decision

Use one source-controlled public release registry as the durable contract for Sathian's homepage, Draw with Tanda channel, project pages, and site agent. The existing editorial workshop aesthetic remains the visual source of truth. Tooth Fairy Network keeps its approved mark, storybook artwork, episode art, and complete official social-link set.

## Architecture

- `src/content/site-releases.ts` owns public release facts, state, links, images, dates, and chatbot language.
- The homepage reads `LATEST_RELEASE` for a compact current-work module immediately after the site agent.
- `/projects/tooth-fairy-network/draw-with-tanda` is the portfolio-side TFN channel page. It shows only verified public episodes as playable and clearly labels approved unpublished episodes as next releases.
- `/projects/clinicalguard` gives the hackathon build a durable project page with its five-step workflow, synthetic dashboard visual, public evidence, and source links.
- `getPublicProfileMemoryCards()` derives release/project cards from the registry, so the site agent receives the same public facts shown on the page.
- A deterministic latest-release answer handles direct latest-release questions without depending on a model call. Every normal answer can still return its approved source links.
- The chat UI renders source links and one next action, and records suggestion, answer, source-click, and note events without storing message contents.

## Draw with Tanda release truth

- Episode 1, Finn the shark: public on YouTube at `ZoY1ZEzJymY`.
- Episode 2, Nori the narwhal: public on YouTube at `D0I_6me_WcU` as of 2026-08-10.
- Future episodes must not render a player or imply publication until the registry has a verified public video ID and `status: 'published'`.

## Preservation contract

Regression tests lock the five official TFN social destinations, approved logo/art paths, the two known Draw with Tanda releases, ClinicalGuard facts, sitemap entries, and the shared latest-release/chatbot source. Future redesigns should change layout around this content contract rather than re-entering or deleting it.

## Error and update behavior

- Missing public video IDs render an honest next-release state, never a broken iframe.
- Chat answers without approved evidence continue to fail closed.
- Updating the latest release or publishing Narwhal requires one registry edit, followed by the existing test/build/deploy workflow.

## Verification

- Unit tests prove the registry, agent response, content preservation, routes, sitemap, and chat source rendering.
- Type-check and production build cover the complete Next.js surface.
- Browser QA covers homepage, Draw with Tanda, ClinicalGuard, chat latest-release prompt, source link, navigation, and mobile layout.
