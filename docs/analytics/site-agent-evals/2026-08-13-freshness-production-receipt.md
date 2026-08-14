# Site agent freshness production receipt

Date: 2026-08-13  
Production commit: `04058803fc26330d2911ecc3e6e998755d7190fe`  
Branch: `main`  
Canonical site: `https://sathian.ai`  
Deployment ID: `dpl_EYJPpG3Yk1T7xpTJ9jTbXcdPYxJa`  
Deployment URL: `https://sathian-fzutjzcls-sathiansrikrishnans-projects.vercel.app`  
Vercel state: `READY` / production

## Released

- Removed the unused private `/voice` page and its three private API routes.
- Added a permanent `/voice/:path*` redirect to `/#agent`.
- Preserved the separate Tooth Fairy Network Colosseum voiceover endpoint.
- Added a concise chatbot capability guide.
- Changed note-help questions into answer-only guidance; the visitor must deliberately open, write, and send a note.
- Added one canonical reviewed registry for seven public projects. Each record owns lifecycle status, approved claims, aliases, public destination, imagery, and review date.
- Made the homepage and chatbot use the same featured/archive project records.
- Added deterministic current-versus-archived project answers and registry-owned next actions.
- Preserved the existing no-page-jump behavior for new chatbot answers.

## Candidate gates

### Unit tests

Command: `npm run test:unit`

- 49 files passed.
- 360 tests passed.
- 0 failed.

The registry change followed a red-green cycle: 12 expected focused failures before implementation, then 66/66 focused tests passed.

### Production build

Command: `npm run build`

- Exit code 0.
- Compilation and TypeScript passed.
- 145 local pages generated.
- `/voice` and `/api/voice/*` were absent from the generated route table.
- `/api/toothfairy/colosseum/voiceover` remained present.

Existing non-fatal warnings remain: stale `caniuse-lite`, bigint JavaScript fallback, edge-runtime static-generation notices, peer-dependency warnings in Vercel, and a localhost `revalidateTag` URL warning during static generation. Both local and Vercel builds completed despite them.

### Local real-browser/API gate

The protected local browser test used the existing short-lived process/session tester mechanism. It sent four question requests and zero notes. It passed capability guidance, deliberate note compose/cancel, current-work status, archive status, stable outer-page scroll, the retired voice redirect, and 390 px mobile containment. The temporary server and tester credentials were removed afterward.

## Live production verification

### Route health

All returned HTTP 200:

- `/`
- `/projects/tooth-fairy-network/draw-with-tanda`
- `/projects/clinicalguard`
- `/writings`
- `/hackathons`
- `/robots.txt`
- `/sitemap.xml`

`/voice/about` returned HTTP 308 with `Location: /#agent`.

Every external destination in the project registry returned HTTP 200 before release: Tooth Fairy Network, AutoQuote Automator, Solana Ecosystem Observatory, AgentTab, BTC Cultural Atlas, and Lex Rooftop Garden.

### Live chatbot/browser gate

Target: `https://sathian.ai`

- No production tester token was used.
- Four live `/api/agent/message` requests returned HTTP 200.
- `What can you do and how can you help me use this site?`
  - Explained supported capabilities.
  - Returned one `Browse featured work` action.
- `Can I leave Sathian a note?`
  - Explained that an actual message must be deliberately sent.
  - Opening note compose sent no additional request and stored no note.
  - Cancel returned to question mode.
- `What is Sathian building now?`
  - Identified Tooth Fairy Network as the primary build.
  - Identified AutoQuote Automator and Solana Ecosystem Observatory as active public builds.
  - Did not mention the retired AI Practice page.
- `Are BTC Cultural Atlas and Lex Rooftop Garden still current?`
  - Identified both as archived portfolio projects, not current active builds.
  - Returned one `Browse more projects` action.
- The outer page position remained stable after every answer.
- The chatbot stayed inside a 390 px viewport without page-level horizontal overflow.
- The production voice redirect ended at the visible homepage agent.

Screenshot: `docs/analytics/site-agent-evals/2026-08-13-freshness-production-browser.png`

### Vercel inspection

`vercel inspect` reported deployment `dpl_EYJPpG3Yk1T7xpTJ9jTbXcdPYxJa` as Ready, target production, with the `sathian.ai` alias. `vercel logs --level error --since 1h` returned no log entries for the new deployment. This is evidence of no returned error entries, not evidence that long-term monitoring is complete.

## Release recommendation and remaining work

Recommendation: **PASS** for this production milestone.

The chatbot is now a useful, source-controlled portfolio concierge for its tested paths. It is not yet a broad tier-one assistant. The next milestone is the evaluation flywheel: a versioned 50-plus-case suite, unresolved-question queue, privacy-safe outcome metrics, and a release threshold report. Longer-lived visitor memory remains deferred until it has explicit consent and visible reset/delete controls.

GA4 event delivery was not independently read back in this release. The browser exercised the existing analytics calls, but conversion reporting remains a separate measurement check.
