# Site Agent Phase 4 production proof

- Tested at: 2026-08-14T10:47:57-04:00
- Tester task: `docs/operations/site-agent-v2-production-proof-test-task.md`
- Local receipt commit: `74d8989519b767efa1e8e21313460d8d9362f865`
- Deployed application commit: `fbc5652c701f111acd5c834c9492e911979cacdb`
- Deployment: `dpl_JALSanni9R8w5hLc62NPkr2x7vRg`
- Production URL: `https://sathian.ai`
- Dataset: `site-agent-evals/v2`
- Authorized questions: 0
- Authorized notes: 0

## Gate result

- Recommendation: **PASS**
- Critical: 0
- High: 0
- Medium: 0
- Low: 0

Plain English: the evidence supports that the current production Site Agent is deployed from the expected code, its fixed 60-case safety and answer gate passes, recent observed production turns completed successfully, and its initial desktop/mobile and unsent-note interfaces work without sending anything. This does not mean the chatbot can never fail or that every future provider response will be correct.

## Deployment identity

- Local `HEAD` matched `74d8989519b767efa1e8e21313460d8d9362f865` at preflight.
- The worktree was clean at preflight except for the delegated production-proof task file.
- Vercel reported deployment `dpl_JALSanni9R8w5hLc62NPkr2x7vRg` as `READY`, target `production`, branch `main`, and application commit `fbc5652c701f111acd5c834c9492e911979cacdb`.
- The deployment aliases include `sathian.ai`.
- The independent Site Agent candidate commit `99b66a3267b401fc69a47cb637e832269dbf25cd` is an ancestor of the deployed commit.
- Between the candidate and deployed commits, the only application-code change was the unrelated dynamic SOL-price route fix; no Site Agent runtime file changed.
- Between the deployed commit and the local receipt commit, only the existing production receipt was added.

Concurrent unrelated source and public-asset changes appeared in the shared worktree after preflight. They were not touched, staged, committed, tested as part of production, or included in this proof.

## Fresh offline gate

The complete evaluator ran into a disposable temporary directory and wrote nothing generated into the repository.

| Gate | Result | Observed | Threshold |
| --- | --- | ---: | ---: |
| Cases | PASS | 60/60 | all cases attempted |
| Useful-answer rate | PASS | 100.0% (48/48) | at least 90% |
| Correct-source rate | PASS | 100.0% (41/41) | at least 95% |
| Trust-case pass rate | PASS | 100.0% (21/21) | 100% |
| Sanitized knowledge gaps | PASS | 0 | 0 critical gaps |

- Recommendation: `PASS`
- Failed cases: 0
- Critical: 0
- High: 0
- Medium: 0
- Low: 0

## Reconciled independent and production evidence

- Existing independent protected live receipt: `2026-08-13-2151-phase-4-live-receipt.md`.
- Protected live result: 10/10 passed, 9/9 useful answers, 8/8 correct sources, 2/2 trust cases, 340 ms p95, no 429, and no note.
- Existing production receipt: `2026-08-13-2213-phase-4-production-receipt.md`.
- That receipt records one production answer request at the deployed commit: HTTP 200, route `answer`, one source, one relevant next action, no receipt, and no stored intake.
- No live question set was rerun against production because the current production deployment has no protected tester secret and the task authorizes zero questions.

## Observed production logs

- Deployment: `dpl_JALSanni9R8w5hLc62NPkr2x7vRg`
- Declared window: `2026-08-14T02:10:03.237Z` through `2026-08-14T14:40:48.999Z`
- Maximum ceiling: 500 records per query; final filtered count queries used a 100-record sublimit and none reached it.

| Coarse observation | Count |
| --- | ---: |
| `/api/agent/message` requests | 3 |
| HTTP 200 agent-message responses | 3 |
| Completed-turn events | 3 |
| Completed `answer` routes | 3 |
| Model-failure events | 0 |
| HTTP 429 records | 0 |
| HTTP 5xx records | 0 |
| Fatal records | 0 |
| Error-level records, all routes | 3 |
| Error-level records on `/api/agent/message` | 0 |

The three error-level records were edge-middleware records for `/`, each with HTTP 200. They were not Site Agent requests and did not coincide with a 5xx response. No log message body was retained in this receipt.

Only paths, status codes, event names, route labels, levels, and counts were aggregated. Prompts, answers, IP addresses, trace IDs, and visitor identifiers were not recorded.

## Production browser proof

### Desktop — 1440 × 1000

- Meaningful homepage content rendered.
- The inline Site Agent panel, title, capability introduction, and note suggestion were visible and readable.
- The 1,440 px page and 1,084 px panel had no horizontal overflow.
- The panel stayed within the viewport horizontally.
- No framework error overlay or page-level JavaScript exception appeared.

### Mobile — 390 × 844

- Meaningful homepage content rendered.
- The inline Site Agent panel, title, capability introduction, and note suggestion were visible and readable.
- The 390 px page and 336 px panel had no horizontal overflow.
- The panel stayed within the viewport horizontally.
- No framework error overlay, console exception, or page-level JavaScript exception appeared.

The desktop context reported a non-blocking browser permissions-policy message for `compute-pressure`. Both contexts also ended with an aborted Google Analytics collection request when the disposable browser context closed. Neither affected the Site Agent UI, but this browser run does not prove analytics delivery.

### Unsent note flow

- The `I want to leave Sathian a note` suggestion was clicked exactly once.
- Note mode opened.
- `/api/agent/message` requests before and after opening note mode: 0.
- Receipts before and during note mode: 0.
- Cancel restored question mode.
- Text typed: no.
- Question submitted: no.
- Note submitted: no.

## Limitations

- No new production answer was requested, so this proof does not independently rescore current provider-generated production text.
- The independent 10-case protected live gate ran against the frozen candidate; ancestry and file reconciliation establish that its Site Agent runtime code is the code now deployed.
- The deterministic 60-case gate proves fixed policy, source, action, and trust behavior, not future model availability or every possible visitor phrasing.
- Production logs prove only the declared observation window and retained records. They cannot guarantee future uptime or zero errors outside the window.
- The browser run proves UI behavior and absence of a note submission; it does not prove GA4 or Vercel Analytics ingestion.

## Evidence paths

- Fresh offline evidence directory: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb`
- Offline JSON: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb\20260814-1438-phase-4-offline-receipt.json`
- Offline Markdown: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb\20260814-1438-phase-4-offline-receipt.md`
- Sanitized gap artifact: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb\latest-knowledge-gaps.json`
- Browser JSON: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb\production-browser-proof.json`
- Desktop screenshot: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb\production-desktop-1440x1000-initial.png`
- Mobile screenshot: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb\production-mobile-390x844-initial.png`
- Unsent-note screenshot: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-production-proof-96d83b9231c74c0cb67360a402ca3dfb\production-desktop-note-mode.png`
