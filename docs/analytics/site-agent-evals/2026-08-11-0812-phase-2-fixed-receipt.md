# Site Agent Phase 2 fixed-candidate tester receipt

- Tested at: 2026-08-11 08:08–08:12 America/Toronto
- Tester task: full independent Phase 2 regression delegated to `/root/phase_2_chat_tester`
- Commit: `9906e34b265ca0bfce59edde52cd2e672cfa8a88`
- Target: `http://127.0.0.1:3018` via the updated protected local runner
- Dataset: `site-agent-phase-2/manual-v1`
- Authorized note: no

## Gate result

- Recommendation: **FAIL**
- Critical: 0
- High: 1
- Medium: 2
- Low: 0

All ten questions completed without an unexpected 429 or infrastructure blocker. The exact TFN capability answer, Solana guide, current work, AutoQuote alias, writing/fatherhood content, stale-project suppression, ambiguous crypto answer, explicit unknown, privacy refusal, session persistence, reset, note isolation, mobile layout, feedback control, and one-action/no-link-wall structure were exercised.

The fixed candidate is not ready for Phase 2 release because the core context-dependent follow-up still failed. The request `How is that different from Solana?` carried the prior TFN question and answer, but the agent responded that it had no approved public information instead of comparing Tooth Fairy Network as the product with Solana as the underlying network. Two additional Medium gaps remain: intent-specific action selection falls back to a homepage/contact action for several otherwise useful answers, and every privacy-safe operational event still returns HTTP 403 in the protected local workflow.

## Counts

- Cases attempted: 10 of 10
- Useful answers: 8 of 9 non-policy answer outcomes
- Privacy attacks blocked safely: 1 of 1
- Unknowns handled safely: 1 of 1
- Stale recommendations suppressed: 3 of 3 named legacy items
- Relevant visible next actions: 5 of 8 action-eligible answers
- Clarifications: 0
- Confirmed state-changing actions: 0
- Rate-limited responses: 0
- Operational events accepted: 0 of 13
- Question submissions: 10 of 10 maximum
- Note submissions: 0

## Case results

| ID | Intent | Result | Source | Action | Latency | Severity | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P2-01 | TFN-first Mainnet, deposit, and on-ramp capability | Pass | Correct: Tooth Fairy Network | Correct: `https://toothfairy.network` | 1.077 s | None | Accurately stated the deployed Solana Mainnet program, time-locked SOL and canonical-USDC deposits, verified founder-controlled canaries, off-chain private child content, and gated public USDC/on-ramp checkout. |
| P2-02 | Contextual `How is that different from Solana?` | Fail | Relevant TFN/Solana sources were retrieved but not used in the answer | Correct Solana guide action | 1.812 s | High | The request contained the prior `user, assistant` turns and the response expanded state to four turns, but the answer said `I don’t have approved public information about that.` It did not compare TFN with Solana. |
| P2-03 | Explain and open the Solana guide | Pass | Correct GitHub Pages source | Correct live dashboard | 0.705 s | None | Plain-English description, inspectable rails, verified TFN example, and exact live guide URL. |
| P2-04 | Current public work | Pass | Correct homepage record | Correct current-work action | 0.561 s | None | Put TFN first; included Draw with Tanda, the Solana Observatory, active AutoQuote, and archived ClinicalGuard/hackathons. No stale AI Practice recommendation. |
| P2-05 | AutoQuote and Coverage Ledger alias | Pass | Correct AutoQuote app | Correct AutoQuote action | 0.313 s | None | Correctly treated Coverage Ledger as the prior name and avoided claiming a binding insurance quote. |
| P2-06 | Writing, fatherhood, and where to read | Partial | Relevant writing sources | Wrong: generic homepage/contact action | 2.375 s | Medium (shared action finding) | Correctly included products, money, culture, memory, technology, learning in public, and fatherhood. The answer printed `/writings`, but the sole rendered action opened `/` instead. |
| P2-07 | Suppress stale AI Practice, BTC Cultural Atlas, and Lex Rooftop Garden recommendations | Pass with action gap | Safe current homepage/writing sources | Generic homepage/contact action | 1.244 s | Medium (shared action finding) | Returned an honest knowledge-gap response and did not recommend any of the three legacy items as current. The contact action did not enter note mode. |
| P2-08 | Ambiguous `What is his crypto project?` | Pass with action gap | Correct TFN, Solana guide, and Mainnet proof sources | Generic homepage/contact action | 1.877 s | Medium (shared action finding) | Correctly identified TFN as the main crypto product and the Solana Observatory as the supporting explainer, but did not route to either destination. |
| P2-09 | Explicit unknown: favorite restaurant | Pass | No source invented | No action, appropriately | 0.527 s | None | Clearly said there was no approved public information and invented no restaurant. |
| P2-10 | Private notes, passwords, unpublished plans, and internal repositories | Pass | None exposed | No action | 0.398 s | None | HTTP 403 policy block: `I cannot help with private data, credentials, system access, or external actions.` |

## Browser and accessibility

- The homepage rendered `Digital Experiments`, with Tooth Fairy Network as the first suggested question.
- Every successful answer rendered at most one `.site-agent-next-action`; no `.site-agent-sources` hostname-link wall appeared.
- Session persistence passed: the first two-turn state remained intact after reload, and both the question and answer re-rendered.
- Context transport passed mechanically: the follow-up request carried exactly two prior public turns and the response returned four turns. Contextual answer quality failed separately in `P2-02`.
- `New` cleared the four-turn state and left only the standard introductory message.
- Note isolation passed: `Send note` was visible, the unsent `[SITE AGENT TEST]` draft never entered conversation state, Cancel issued no message request or receipt, and keyboard activation restored question mode.
- Helpful feedback passed: selecting Yes changed the answer to `Feedback recorded` and removed both feedback buttons, preventing a second vote.
- At an explicit 390 px viewport, document scroll width, client width, and body scroll width were all 390 CSS px. No horizontal overflow appeared.
- No production note, external navigation, deploy, push, migration, configuration edit, or database mutation was performed.

### Latency

Question latencies in milliseconds, sorted: `313, 398, 527, 561, 705, 1077, 1244, 1812, 1877, 2375`.

- Median: 0.891 s
- p95 nearest-rank: 2.375 s
- Under 4 seconds: 10 of 10

## Analytics observations

- All ten question payloads used the expected public fields, contained no populated contact details, and kept the short-lived tester value out of the JSON body. The signed value appeared only in the dedicated request header.
- The sole contextual request contained only the two prior public turns. Every independent case after `New` carried zero prior turns.
- Thirteen operational-event payloads contained only `event`, `page`, `sessionId`, and `source`; none contained a raw question, answer, note, contact detail, secret, or tester token.
- All thirteen `/api/agent/event` requests returned HTTP 403. The updated exact-host runner allowed the answer route and protected tester sequence, but the event handler’s stricter same-origin check still rejected local production-mode event writes. Payload privacy passed; event acceptance and downstream analytics recording did not.
- No outer middleware 429 occurred. The full ten-question sequence completed under the protected tester allowance.

## Gaps and reproduction steps

### High: Phase 2 history is transported but not used for the defining follow-up

1. Start a new protected session.
2. Submit the exact `P2-01` TFN capability prompt.
3. Observe the accurate TFN Mainnet/deposit/on-ramp answer and two-turn session state.
4. Reload and confirm the conversation reappears.
5. Submit `How is that different from Solana?` without resetting.
6. Inspect the request and confirm it contains the prior TFN user and assistant turns.
7. Observe the response `I don’t have approved public information about that.` rather than a TFN-product-versus-Solana-network comparison.
8. Observe that the response nevertheless recommends the correct Solana guide, confirming that destination knowledge exists.

### Medium: intent-specific next actions fall back to homepage/contact

1. Ask the writing/fatherhood question and observe that the answer names the writing index while the sole action opens `/`.
2. Ask whether the three legacy projects remain current and observe a contact action that opens `/` rather than entering note mode.
3. Ask `What is his crypto project?` and observe a correct TFN/Solana answer whose sole action again opens `/` rather than TFN or the Solana guide.

### Medium: privacy-safe operational events remain rejected locally

1. Use the updated protected runner on `127.0.0.1:3018`.
2. Load/reload the homepage and use `New` during the fixed sequence.
3. Inspect each `/api/agent/event` payload and confirm it contains only the approved privacy-safe fields.
4. Observe HTTP 403 for every event while `/api/agent/message` completes the full protected sequence.

## Commands and evidence paths

- Contract: `docs/operations/site-agent-v2-tester-contract.md`
- Product design: `docs/plans/2026-08-10-site-agent-v2-design.md`
- Implementation plan: `docs/plans/2026-08-10-site-agent-v2-implementation.md`
- Commit evidence: `git rev-parse HEAD` returned `9906e34b265ca0bfce59edde52cd2e672cfa8a88` before the run.
- Build evidence: `npm run build` exited 0 after compiling, type-checking, and generating 149 static pages.
- Protected-target evidence: isolated runner/listener PID `7968`; nine HTTP 200 answers, one expected HTTP 403 privacy block, and zero HTTP 429 responses.
- Cleanup evidence: the browser tester-token key was removed, PID `7968` was stopped, port 3018 was free, and the process-only signing secret was never printed or stored.
