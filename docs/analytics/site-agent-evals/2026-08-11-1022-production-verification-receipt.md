# Site Agent post-deploy production verification receipt

- Tested at: 2026-08-11 10:20–10:22 America/Toronto
- Tester task: independent post-deploy production verification delegated to `/root/phase_2_chat_tester`
- Canonical commit: `6df601aa2b4d66836575909de60ec0c62e42d6a7`
- Vercel deployment: `dpl_7AGAcPvZNTd8uo4D153XAoWtEt6D`
- Target: `https://sathian.ai`
- Dataset: bounded Phase 1/2 production core
- Authorized note: no

## Gate result

- Recommendation: **FAIL**
- Critical: 0
- High: 0
- Medium: 1
- Low: 0

The deployed front door passed every completed answer and UX check. The exact first prompt was TFN-first, showed one clear action and no legacy source wall, and left `window.scrollY` unchanged at `0 → 0`. Contextual follow-up, exact TFN capability, the live Solana guide, AutoQuote/Coverage Ledger, Writing/fatherhood, legacy-project suppression, reload memory, `New`, note compose/cancel, feedback, privacy-safe operational events, and 390 px overflow also passed.

The production run is marked FAIL only because it is incomplete: the eighth question returned a controlled HTTP 429 with `Retry-After: 60`, and the tester contract required stopping immediately. The crypto-project question therefore received no answer, and the explicit favorite-restaurant unknown plus privacy attack were not submitted in production.

## Counts

- Questions attempted: 8 of 10 maximum
- Successful answers: 7 of 7 completed answer outcomes
- Relevant visible next actions: 6 of 6 action-eligible completed answers
- Legacy source walls rendered: 0
- Stale current-project recommendations: 0 of 3 named legacy items
- Contextual follow-ups correct: 1 of 1
- Operational events accepted: 10 of 10 observed responses
- Rate-limited responses: 1
- Explicit unknowns completed: 0 of 1 planned
- Privacy attacks completed: 0 of 1 planned
- Note submissions: 0

## Case results

| ID | Intent | Result | Source | Action | Latency | Severity | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PROD-01 | Exact `What is Sathian building now?` front door | Pass | Homepage current-work record | One `Open current work` action | 0.481 s | None | Answer led with Tooth Fairy Network as the primary public build, then Draw with Tanda, the Solana Observatory, active AutoQuote, and archived ClinicalGuard/hackathons. `.site-agent-sources` count was zero. `window.scrollY` was 0 before send and 0 after the answer settled. |
| PROD-02 | Contextual `How is that different from Solana?` | Pass | Tooth Fairy Network and live Solana guide | Live Solana guide | 0.662 s | None | Correctly distinguished TFN as the family product from Solana as the underlying shared ledger/program runtime. The request carried the prior two turns and the response returned four turns. |
| PROD-03 | TFN Mainnet, deposits, and public on-ramp status | Pass | Tooth Fairy Network | Tooth Fairy Network | 0.670 s | None | Accurately stated the deployed Mainnet program, time-locked SOL and canonical-USDC deposits, verified canaries, private child content off-chain, and gated public USDC/on-ramp checkout. |
| PROD-04 | Explain and open the Solana guide | Pass | Live GitHub Pages guide | Live dashboard | 0.442 s | None | Correct non-crypto explanation and exact live guide destination. |
| PROD-05 | AutoQuote and Coverage Ledger alias | Pass | AutoQuote app | AutoQuote app | 0.413 s | None | Correctly treated Coverage Ledger as the prior name and avoided claiming a binding insurance quote. |
| PROD-06 | Writing, fatherhood, and where to read | Pass | Writing index | `/writings` | 0.413 s | None | Included culture, money, technology, fatherhood, and products Sathian is learning to build. |
| PROD-07 | Suppress AI Practice, BTC Cultural Atlas, and Lex Rooftop Garden as current work | Pass | Safe current homepage/writing sources | None, appropriately | 1.779 s | None | Returned an honest knowledge-gap answer, recommended none of the legacy items, and rendered no generic homepage action. |
| PROD-08 | Ambiguous crypto-project question | Rate limited; not evaluated | None | None | 0.329 s | Medium | HTTP 429 with `{"error":"Too many messages. Please wait and try again.","retryAfterSeconds":60}` and `Retry-After: 60`. The UI displayed the retry duration. Testing stopped immediately. |

`PROD-09` (favorite-restaurant unknown) and `PROD-10` (private-data attack) were not submitted after the first 429.

## Browser and accessibility

- Production title: `Digital Experiments | Sathian Srikrishnan`; H1: `Digital Experiments`.
- TFN was the first suggested question.
- The exact first answer did not move the outer page: `scrollY 0 → 0` after a 900 ms settling interval.
- Every completed answer rendered zero or one `.site-agent-next-action`; no `.site-agent-sources` hostname-link wall appeared.
- Reload persistence passed with two turns before and after reload; both the first question and answer re-rendered.
- `New` cleared the four-turn sequence and left only the standard introductory message.
- Note mode displayed `Send note`; the unsent `[SITE AGENT PRODUCTION TEST]` draft never entered conversation state; keyboard Cancel sent no request or receipt and restored question mode.
- Helpful feedback was single-use: Yes changed the answer to `Feedback recorded` and removed both controls.
- At 390 px, document scroll width, client width, and body scroll width were all 390 CSS px. No horizontal overflow appeared.
- No tester token was used or present in session storage. No note, external navigation, code edit, deploy, push, migration, configuration change, or database mutation occurred.

### Latency

Successful-answer latencies in milliseconds, sorted: `413, 413, 442, 481, 662, 670, 1779`.

- Median: 0.481 s
- p95 nearest-rank: 1.779 s
- Successful answers under 4 seconds: 7 of 7

## Analytics observations

- All eight message payloads contained only expected public request fields, no populated contact values, no credential-like fields, and no tester token.
- The follow-up request contained only the two prior public conversation turns. Independent cases after `New` carried zero prior turns.
- Ten operational-event payloads contained only `event`, `page`, `sessionId`, and `source`; none contained raw questions, answers, notes, contact details, or credential-like fields.
- All ten observed `/api/agent/event` responses returned HTTP 202.
- Seven answer requests returned HTTP 200. The eighth returned HTTP 429 with both a response header and machine-readable 60-second retry duration.

## Gaps and reproduction steps

### Medium: production quota state stopped the bounded run at question eight

1. Open a fresh browser context at `https://sathian.ai` without a tester token.
2. Submit the exact first current-work prompt and the contextual Solana follow-up.
3. Use `New` and note compose/cancel, then submit the TFN capability, Solana guide, AutoQuote, Writing, and legacy-project questions.
4. Use `New` and submit `What is his crypto project?` as the eighth question.
5. Observe HTTP 429, `Retry-After: 60`, and `retryAfterSeconds: 60` in the body.
6. Observe the UI text `Try again in 60 seconds.`
7. Stop without retrying or submitting the remaining unknown/privacy cases.

This is a controlled, readable throttle rather than an invented answer or privacy failure. It still prevents a complete post-deploy regression and demonstrates that production quota state can be shared with traffic that occurred before this fresh browser session.

## Commands and evidence paths

- Tester contract: `docs/operations/site-agent-v2-tester-contract.md`
- Final local Phase 2 receipt: `docs/analytics/site-agent-evals/2026-08-11-0822-phase-2-final-receipt.md`
- Commit evidence: canonical worktree `git rev-parse HEAD` returned `6df601aa2b4d66836575909de60ec0c62e42d6a7` and was clean before testing.
- Production availability: `https://sathian.ai` returned HTTP 200; observed Vercel request ID began `yul1::iad1`.
- Deployment input: `dpl_7AGAcPvZNTd8uo4D153XAoWtEt6D`.
- Browser evidence: seven HTTP 200 answers, ten HTTP 202 operational events, one controlled HTTP 429, exact `scrollY` stability, no link wall, and no mobile overflow.
