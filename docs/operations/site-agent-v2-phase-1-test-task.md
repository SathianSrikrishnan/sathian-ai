# Independent test task: Site Agent v2 Phase 1

## Assignment

Act only as the independent tester described in `docs/operations/site-agent-v2-tester-contract.md`. Evaluate the frozen Phase 1 candidate and issue a receipt. Do not fix any finding.

## Frozen inputs

- Candidate commit: `bec8371`
- Local target: `http://127.0.0.1:3017` running with the development server so the existing production origin allowlist is not weakened
- Phase: `Phase 1 — trust and coverage`
- Dataset: `site-agent-phase-1/v1`
- Fixture: `tests/fixtures/site-agent-phase-1-evals.json`
- Product design: `docs/plans/2026-08-10-site-agent-v2-design.md`
- Implementation plan: `docs/plans/2026-08-10-site-agent-v2-implementation.md`
- Owner acceptance check: `docs/operations/site-agent-v2-sathian-checklist.md`
- Analytics environment: local candidate; analytics verification is observational only and must not be treated as a gate.
- Authorized note: **no**. Entering note mode is authorized; submitting a note is not.
- Tester allowance: the delegating agent may supply one short-lived `x-site-agent-test-token`. It bypasses only the per-visitor hourly quota and must not appear in the receipt.

This task is the complete rerun after the first production-mode local server was correctly blocked by the production origin allowlist, the second run proved the normal visitor quota was already exhausted, and the third run proved the browser driver could not inject a raw CDP header. Preserve all blocker receipts. Write a new receipt for this run and evaluate all cases from the beginning using only the supplied short-lived tester token.

Install the token with a browser evaluation that calls `sessionStorage.setItem('sathian-agent-test-token', suppliedToken)`, then reload the page. Do not use raw CDP header injection. Remove the session-storage key after the run.

## Limits

- Run each of the ten fixture cases once.
- Make no more than nine question submissions.
- Make zero note submissions.
- If the candidate returns a 429, record the response and Retry-After behavior and stop further question submissions.
- Test the homepage at desktop width and 390-pixel mobile width.

## Required checks beyond the fixture

- Confirm the homepage still presents the same simple visual hierarchy.
- Confirm the note suggestion enters note mode without storing or sending its label.
- Confirm Cancel exits note mode.
- Confirm an answer can be marked Helpful or Not helpful, at most once in that rendered answer.
- Inspect browser console and failed network requests.
- Record that Phase 1 has no session-aware follow-up guarantee; do not fail Phase 1 solely for that known Phase 2 scope.

## Output and stop conditions

Write exactly one new receipt under `docs/analytics/site-agent-evals/` using the tester contract format. The receipt is the only repository file you may change. Include exact reproduction steps for every finding and distinguish a product defect from a missing local credential or external dependency.

Stop and report without improvising if the target is unavailable, the checked-out runtime code does not match `bec8371`, or testing would require a production note, secret, deployment, configuration change, or more submissions than the declared limit.
