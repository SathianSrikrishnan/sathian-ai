# Read-only Site Agent Phase 4 tester task

## Objective

Independently evaluate the frozen Site Agent Phase 4 candidate as a skeptical visitor. Verify that the 10-case live canary passes through the protected HTTP route and that the initial desktop/mobile browser surface remains usable without submitting any extra questions or notes. Produce exactly one repository receipt; do not fix findings.

## Frozen inputs

- Commit: `99b66a3267b401fc69a47cb637e832269dbf25cd`
- Target: `http://127.0.0.1:3134`
- Dataset: `tests/fixtures/site-agent-evals.json` (`site-agent-evals/v2`)
- Live runner: `scripts/run-site-agent-eval.mjs`
- Temporary short-lived token: `C:\Users\sathi\AppData\Local\Temp\sathian-site-agent-phase4\phase4-tester-token.txt`
- Expected analytics environment: local candidate; inspect event shape only, not GA4 delivery
- Authorized note: no
- Question limit: exactly the 10 cases tagged `live-canary`

Read first:

- `docs/plans/2026-08-10-site-agent-v2-design.md`
- `docs/plans/2026-08-13-site-agent-evaluation-flywheel.md`
- `docs/operations/site-agent-v2-tester-contract.md`
- `docs/analytics/site-agent-evals/README.md`
- `docs/analytics/site-agent-evals/latest-offline-receipt.md`

## Required protocol

1. Confirm `git rev-parse HEAD` equals the frozen commit. Stop if it does not.
2. Confirm the target returns HTTP 200 and the token file exists. Never print or copy the token into a command transcript or receipt.
3. Create a disposable output directory under the current user's temporary folder.
4. In the same PowerShell process, load the token into `SITE_AGENT_TEST_TOKEN`, run:

   ```powershell
   node scripts/run-site-agent-eval.mjs --mode live --url "http://127.0.0.1:3134" --output-dir <temporary-output-directory>
   ```

   Then immediately remove `SITE_AGENT_TEST_TOKEN` from that PowerShell process.
5. Inspect the temporary JSON/Markdown result. Confirm exactly 10 attempted cases, zero notes, the recommendation, gate values, latency, and whether a 429 occurred. Stop after the first 429 if one occurs.
6. With a fresh browser context and no additional question submission, inspect the initial homepage at 1440x1000 and 390x844. Verify the panel is visible, the intro/capability framing is readable, the page and panel do not overflow horizontally, and no relevant console error appears.
7. Click the `I want to leave Sathian a note` suggestion once. Verify note composition opens, no `/api/agent/message` request occurs, no receipt appears, and Cancel returns to question mode. Do not type or send a note.
8. Inspect the client analytics source or browser event payload shape and confirm only coarse keys/labels are present; do not claim GA4 delivery.
9. Write exactly one new receipt under `docs/analytics/site-agent-evals/YYYY-MM-DD-HHMM-phase-4-live-receipt.md` using the durable tester-contract format. Include the frozen commit, target, dataset, 10-case counts, KPI scorecard, p95 latency, browser findings, analytics-shape finding, severity counts, exact temporary evidence paths, and release recommendation.

## Boundaries

- Remain read-only except for the single receipt file.
- Do not modify code, tests, fixtures, documentation, configuration, database state, branches, deployments, environment files, or analytics settings.
- Do not push, commit, merge, deploy, migrate, delete, or repair anything.
- Do not submit a note, file, email, contact detail, secret, or real personal information.
- Do not run more than the 10 tagged live-canary questions.
- Do not put the tester token in logs, source, a receipt, a URL, local storage, or a persistent browser profile.
- Do not use `--sync-studio`.

## Expected final message

Return only:

- receipt path;
- recommendation;
- severity counts;
- any condition that prevented completion.

## Stop and ask for help when

- HEAD or target does not match;
- the token is absent/expired;
- the first 429 occurs;
- the target returns repeated infrastructure errors;
- a test would submit a note or exceed the 10-question limit;
- anything requires a state-changing action beyond the one receipt.
