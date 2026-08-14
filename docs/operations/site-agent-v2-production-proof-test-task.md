# Read-only Site Agent production proof task

## Objective

Independently verify the current production Site Agent evidence without consuming another public question, sending a note, changing a secret, or changing production. Produce one concise receipt that separates what is proven from what cannot be guaranteed.

## Frozen inputs

- Local receipt commit: `74d8989519b767efa1e8e21313460d8d9362f865`
- Deployed application commit: `fbc5652c701f111acd5c834c9492e911979cacdb`
- Deployment: `dpl_JALSanni9R8w5hLc62NPkr2x7vRg`
- Production URL: `https://sathian.ai`
- Dataset: `tests/fixtures/site-agent-evals.json` (`site-agent-evals/v2`)
- Existing independent live receipt: `docs/analytics/site-agent-evals/2026-08-13-2151-phase-4-live-receipt.md`
- Existing production receipt: `docs/analytics/site-agent-evals/2026-08-13-2213-phase-4-production-receipt.md`
- Authorized questions: zero
- Authorized notes: zero

Read first:

- `docs/operations/site-agent-v2-tester-contract.md`
- `docs/analytics/site-agent-evals/README.md`
- `docs/plans/2026-08-13-site-agent-evaluation-flywheel.md`
- both existing receipts named above

## Required protocol

1. Confirm local `HEAD` equals the local receipt commit and the worktree is clean except for this task file and the one receipt you will write.
2. Confirm the Vercel deployment is `READY`, targets production, aliases `sathian.ai`, and identifies the deployed application commit.
3. Create a disposable temporary output directory and run the complete 60-case offline evaluator into it. Do not write generated evaluator output into the repository. Record case counts, KPI gates, recommendation, and sanitized gap count.
4. Reconcile the existing 10-case independent live receipt and the production receipt with the current deployment. Do not rerun the live question set because production has no protected tester secret and recent visitor traffic may share the hourly quota.
5. Query Vercel logs for the current deployment using a declared window and maximum record count. Aggregate only coarse evidence: `/api/agent/message` request count, response statuses, completed turns, model failures, 429s, error/fatal records, and 5xx records. Do not record prompts, answers, IPs, trace IDs, or visitor identifiers.
6. In a fresh browser context, inspect `https://sathian.ai` at 1440 x 1000 and 390 x 844. Verify meaningful content, the visible Site Agent panel, no horizontal overflow, no framework overlay, and no relevant console exception. Click the note suggestion once, verify note mode opens without an `/api/agent/message` request or receipt, cancel it, and verify question mode returns. Do not type or submit anything.
7. Write exactly one receipt under `docs/analytics/site-agent-evals/YYYY-MM-DD-HHMM-phase-4-production-proof.md`. Include the frozen commits/deployment, offline gates, prior independent live gate, observed production-log window and counts, browser findings, limitations, severity counts, and a plain-English conclusion.

## Boundaries

- Remain read-only except for the single receipt file.
- Do not submit a question, note, contact detail, file, or feedback event.
- Do not change Vercel/Supabase settings, secrets, analytics, databases, source, tests, fixtures, branches, or deployments.
- Do not expose `.vercel` environment values or any secret.
- Do not claim the chatbot can never fail. State exactly what the evidence supports.

## Expected final message

Return only:

- receipt path;
- recommendation;
- offline and observed production counts;
- severity counts;
- any blocking condition.

## Stop and ask for help when

- the commit, deployment, or alias does not match;
- the offline evaluator fails;
- browser inspection would submit a question or note;
- logs expose unexpected private content;
- any action would change production or exceed the one-receipt boundary.
