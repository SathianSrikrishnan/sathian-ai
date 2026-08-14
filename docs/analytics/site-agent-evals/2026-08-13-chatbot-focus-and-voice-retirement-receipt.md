# Site agent focus and voice retirement receipt

Date: 2026-08-13  
Candidate base: `86adee65035fd82e4e17cca9ddccb11235e4fbed`  
Worktree: `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release`  
Release state: local candidate only; not committed, pushed, or deployed

## Scope

- Retire the unused private `/voice` page and its three private API routes.
- Preserve the separate Tooth Fairy Network Colosseum voiceover endpoint.
- Make the homepage agent explain what it can do.
- Make note-help questions answer-only until the visitor deliberately opens and sends a note.
- Keep the homepage viewport stable when answers arrive.

## Verified results

### Automated unit suite

Command: `npm run test:unit`

- 49 test files passed.
- 349 tests passed.
- 0 failed.

The new coverage verifies the retired voice files, redirect, shared TFN voiceover preservation, capability knowledge, note-help policy, no accidental note persistence, one-action answers, and indexing cleanup.

### Production build

Command: `npm run build`

- Exit code 0.
- TypeScript passed.
- 145 pages generated.
- `/voice` and `/api/voice/*` are absent from the generated route table.
- `/api/toothfairy/colosseum/voiceover` remains present.

The build still emits existing environment/dependency warnings: stale `caniuse-lite`, the bigint JavaScript fallback, edge-runtime static-generation notices, and a localhost `revalidateTag` URL warning. They did not fail the build and were not part of this change.

### Real local browser/API check

Command: `node tests/browser/chatbot_focus_check.cjs`, run through a temporary local Next server with the existing short-lived tester-token mechanism.

- Real `/api/agent/message` requests returned HTTP 200.
- Question 1: `What can you do and how can you help me use this site?`
  - Explained the supported capabilities.
  - Rendered one next action: `Browse featured work`.
- Question 2: `Can I leave Sathian a note?`
  - Explained the deliberate note workflow.
  - Returned no intake receipt and stored no note.
  - Rendered one next action: `Write a note`.
- Clicking `Write a note` opened note compose without sending another request or storing a note.
- Cancel returned the composer to question mode.
- Question 3: `What is Sathian building now?`
  - Identified Tooth Fairy Network as the primary build.
  - Identified AutoQuote Automator and Solana Ecosystem Observatory as active public builds.
  - Did not revive the retired AI Practice copy.
- Question 4: `Are BTC Cultural Atlas and Lex Rooftop Garden still current?`
  - Identified both as archived portfolio projects, not current active builds.
  - Rendered one next action: `Browse more projects`.
- The outer homepage scroll position stayed unchanged after all four answers.
- `/voice/about` permanently redirected to `/#agent`.
- The agent stayed within a 390 px mobile viewport with no page-level horizontal overflow.
- The temporary tester token existed only in the test process/browser session and was removed when those processes closed.
- The temporary local server was stopped and port 3017 was released.

Screenshot: `docs/analytics/site-agent-evals/2026-08-13-chatbot-focus-browser.png`

## What this proves—and does not prove

This proves the local release candidate behaves correctly for the new capability, note-help, current-work, and archive-status paths, including the previously reported page-jump condition. It does not prove every possible project or follow-up answer is current. It also does not change the production site until the candidate is reviewed, committed, pushed, and deployed.

## Next milestones

1. **Freshness contract:** complete. Seven public project records now own lifecycle status, approved claims, aliases, links, and last-reviewed dates for the homepage and agent.
2. **Concierge depth:** add explicit TFN-first comparison, Solana education, writing discovery, latest-release, and honest-unknown evaluation sets with follow-up questions.
3. **Useful memory:** keep short session context by default; add longer-lived memory only with explicit visitor consent and visible reset/delete controls.
4. **Learning loop:** record privacy-safe intent, success, feedback, unresolved topic, latency, and selected action; turn failed questions into a review queue.
5. **Release gate:** require unit, build, and browser receipts on the exact candidate before every production deployment.

Recommended next gate after this release: expand and pass the broader fixed evaluation set before calling the chatbot tier one.
