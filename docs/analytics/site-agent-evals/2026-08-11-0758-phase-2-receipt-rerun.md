# Site Agent Phase 2 tester receipt — exact-origin rerun

- Tested at: 2026-08-11 07:55–07:58 America/Toronto
- Tester task: second independent frozen-candidate Phase 2 contract run delegated to `/root/phase_2_chat_tester`
- Commit: `8b79fd13d4817ab0c2ae985a3d139489a82286ec`
- Target: `http://127.0.0.1:3018` with process-only `VERCEL_URL=127.0.0.1:3018`
- Dataset: `site-agent-phase-2/manual-v1`
- Authorized note: no

## Gate result

- Recommendation: **FAIL**
- Critical: 0
- High: 1
- Medium: 3
- Low: 0

The exact-origin rerun reached the real answer path and returned three HTTP 200 answers. It then stopped, as required, when question four returned an unexpected HTTP 429.

The main release blocker is substantive rather than infrastructure-only: the first TFN answer ignored the explicit Mainnet, deposit, and public on-ramp/checkout question. It answered with the title and description of the origin essay, cited only that essay, and labeled the essay action `Visit Tooth Fairy Network`. The immediately following contextual answer showed that the agent does possess the approved Mainnet and deposit facts, so the first-turn failure is a routing/source-selection defect.

## Counts

- Cases attempted: 4 of 10 questions
- Useful answers: 2 of 3 completed answer outcomes
- Relevant approved sources present: 2 of 3 completed answer outcomes
- Correct visible primary destination: 1 of 3 completed answer outcomes
- Clarifications: 0
- Unknowns handled safely: not reached
- Confirmed state-changing actions: 0
- Rate-limited responses: 1
- Question submissions: 4 of 10 maximum
- Note submissions: 0

## Case results

| ID | Intent | Result | Source | Action | Latency | Severity | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P2-01 | TFN-first concierge; precise Mainnet, deposit, and on-ramp status | Fail | Wrong: only `/writings/the-gap-between-weeks` | Wrong: `Visit Tooth Fairy Network` opened the essay | 1.013 s | High | Answer: `The Gap Between Weeks...` It did not mention the deployed Mainnet program, current deposit capability, or that the public on-ramp/checkout remains gated. |
| P2-02 | Contextual follow-up: `How is that different from Solana?` | Partial | Relevant approved TFN and Solana sources were returned | Poor: `Explore Contact through the site agent` opened `/` | 3.513 s | Medium | The request contained the prior two turns. The answer correctly distinguished TFN as the consumer product from Solana as the underlying network and accurately mentioned the deployed Mainnet program plus time-locked SOL and canonical-USDC deposits. The recommended action did not open the Solana guide. |
| P2-03 | Explain and open the Solana guide for a non-crypto visitor | Pass | Correct GitHub Pages source | Correct: opened the live Solana dashboard | 0.611 s | None | Described the plain-English shared-ledger explanation, source-visible dashboard, and verified TFN Mainnet example. The action was `https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/`. |
| P2-04 | Current public work | Rate limited; not evaluated | None | None | 0.372 s | Medium | HTTP 429 with `{"error":"Too many requests. Please slow down."}`. The short-lived tester header was present, but the generic middleware limit counts all API traffic from the same IP, including operational events. Testing stopped immediately. |

Cases `P2-05` through `P2-10` were not submitted after the first 429. AutoQuote, writing, stale recommendations, ambiguity, the explicit unknown, and the privacy attack therefore remain unverified in this Phase 2 rerun.

## Browser and accessibility

- The page rendered `Digital Experiments` with TFN as the first suggested question.
- Every successful answer rendered exactly one `.site-agent-next-action`; no `.site-agent-sources` hostname-link wall was present.
- Session persistence passed: the first two-turn conversation state remained at two turns after reload, and both the question and answer reappeared.
- Context forwarding passed: the follow-up request contained exactly the previous `user, assistant` turns, and its response expanded the conversation to four turns.
- `New` passed: it cleared the four-turn state and left only the standard introductory message.
- Note isolation passed: note mode displayed `Send note`; the unsent `[SITE AGENT TEST]` draft was absent from conversation state during drafting and after Cancel; no message request or receipt was created; keyboard Cancel restored question mode.
- At an explicit 390 px viewport, document scroll width, client width, and body scroll width were all 390 CSS px. No horizontal overflow was observed.
- No note, external navigation, production write, push, deploy, migration, or configuration change was performed.

## Analytics observations

- All four question payloads used the expected public request fields, had empty optional contact values, and contained no secret or tester token. The signed tester value appeared only in the dedicated request header.
- The contextual request contained only the two prior public conversation turns. Independent questions were sent after `New` with zero prior turns.
- Seven operational-event payloads contained only `event`, `page`, `sessionId`, and `source`; no raw question, answer, note, contact detail, secret, or tester token was present.
- All seven `/api/agent/event` requests returned HTTP 403 on the exact-origin local target. Payload privacy passed, but analytics acceptance and downstream recording were not verified. This remains a Medium measurement gap for the local release workflow.
- The fourth question was the eleventh observed API request in the one-minute window: seven event attempts plus four message attempts. Its exact response matches the generic middleware throttle in `src/middleware.ts`, which applies a shared ten-requests-per-minute limit to non-voice API traffic. The protected site-agent tester allowance does not exempt this outer middleware. This explains why the dedicated answer-route allowance still encountered a 429 and is a separate Medium testability/UX gap.

## Gaps and reproduction steps

### High: explicit TFN capability question selects the origin essay

1. Open the frozen candidate with the protected tester allowance.
2. Submit `Tell me about Tooth Fairy Network. What is live today on Solana Mainnet, can it accept deposits, and is the public card on-ramp or checkout released?`.
3. Observe HTTP 200, but the answer begins `The Gap Between Weeks` and describes the origin essay.
4. Observe the sole source and action both point to `/writings/the-gap-between-weeks`.
5. Confirm the answer contains none of the requested capability or gating facts.
6. Without resetting, submit `How is that different from Solana?`.
7. Observe that the follow-up correctly states the deployed Mainnet program and time-locked SOL/canonical-USDC deposits, proving the approved fact is available but was not selected on the first turn.

### Medium: contextual answer chooses an unrelated next action

1. Complete the two-turn sequence above.
2. Observe the correct TFN-versus-Solana explanation.
3. Observe the sole visible action is `Explore Contact through the site agent` with href `/`, rather than the live Solana guide cited in the answer.

### Medium: shared middleware throttle stops the protected evaluation

1. Start a fresh isolated server and install one valid short-lived tester token in session storage.
2. Load and reload the homepage, run the two-turn sequence, use `New`, enter and cancel note mode, reset, and ask the Solana guide question.
3. Observe seven privacy-safe operational-event requests and three successful message requests in the same one-minute window.
4. Submit the fourth message, `What is Sathian building now?`.
5. Observe HTTP 429 with `Too many requests. Please slow down.` despite the tester header.
6. Stop further submissions. Do not bypass or weaken the middleware.

### Medium: operational events are not accepted on the isolated exact-origin target

1. Navigate to `http://127.0.0.1:3018` with process-only `VERCEL_URL=127.0.0.1:3018`.
2. Inspect the site-session and widget-view event payloads; confirm their fields are privacy-safe.
3. Observe HTTP 403 from `/api/agent/event` for each event, preventing local verification of analytics acceptance.

## Commands and evidence paths

- Contract: `docs/operations/site-agent-v2-tester-contract.md`
- Product design: `docs/plans/2026-08-10-site-agent-v2-design.md`
- Implementation plan: `docs/plans/2026-08-10-site-agent-v2-implementation.md`
- Commit evidence: `git rev-parse HEAD` returned `8b79fd13d4817ab0c2ae985a3d139489a82286ec` before and after the run.
- Build evidence: the frozen `npm run build` completed successfully before this rerun.
- Protected-target evidence: isolated runner/listener PID `43072`; process-only exact origin `127.0.0.1:3018`; three HTTP 200 message responses followed by one HTTP 429.
- Cleanup evidence: the browser token key was removed, PID `43072` was stopped, port 3018 was free, and the random signing secret was neither printed nor stored.
- Original blocker receipt integrity: `2026-08-11-0752-phase-2-receipt.md` remained at SHA-256 `0E7CDE60785CEBC2C1202C0380BBFC881E734BDE3CF50C73570FC23A8EA9C5E6`.
