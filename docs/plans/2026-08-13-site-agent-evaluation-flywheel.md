# Site Agent Phase 4 evaluation flywheel implementation plan

Date: 2026-08-13
Owner: builder agent
Decision owner: Sathian Srikrishnan

## Goal

Turn site-agent quality checks into a repeatable release gate: at least fifty sanitized, versioned cases run locally without touching production data; a small live canary verifies the deployed HTTP/browser path; every run produces Markdown and JSON receipts plus a reviewable knowledge-gap queue.

## Quality contract

Primary KPIs:

1. Useful-answer rate: at least 90% for answer cases.
2. Correct-source rate: at least 95% for cases that require sources.
3. Trust-gate pass rate: 100% for privacy, action-confirmation, and invented-fact/URL checks.

Guardrails:

- No raw visitor questions, answers, emails, filenames, or note bodies enter analytics or the committed fixture.
- Honest unknowns pass when a case expects an unknown; supported questions that become unknowns enter the gap queue.
- The default evaluator never sends a note or writes to production.
- Live p95 latency remains below four seconds, excluding declared provider degradation.
- Any critical failure makes the release gate fail regardless of the aggregate score.

## Architecture

Use a hybrid gate:

- **Offline gate:** load the real policy, conversation, public registry, and answer code through Vite. Run the sanitized fixture with a deterministic fail-closed model adapter. This is fast, free of provider variance, and safe for every commit.
- **Live canary:** run a small tagged subset against a supplied candidate URL with a short-lived tester token. It verifies routing, serialization, citations, latency, and production-like middleware without spending fifty provider requests.
- **Scoring core:** one TypeScript module validates observations and computes useful-answer, source, trust, action, and latency gates.
- **Receipts:** write timestamped Markdown and JSON files. A latest JSON queue contains only fixture IDs, categories, expected public facts/sources, severity, and receipt provenance.
- **Studio intake:** an additive private table and AAL2 Studio screen receive only sanitized evaluation gaps. Sync is explicit and disabled by default.

## Implementation tasks

### Task 1: Write the failing contract tests

Files:

- Create `tests/unit/site-agent-evaluation.test.ts`.
- Create `tests/fixtures/site-agent-evals.json` with an initial schema sample.

Tests must require dataset versioning, at least fifty cases, category coverage, unique IDs, expected intent/outcome, public-safe fixtures, threshold behavior, critical fail-closed behavior, and sanitized gap records.

### Task 2: Implement the scoring core

Files:

- Create `src/lib/agent/evaluation.ts`.

Implement typed fixture validation, per-case checks, aggregate KPIs, release recommendation, latency calculation, gap extraction, and Markdown/JSON serialization. Keep this module pure and independent of the network and filesystem.

### Task 3: Grow the fixed dataset

Files:

- Complete `tests/fixtures/site-agent-evals.json` with at least fifty synthetic cases.

Cover current work, all project aliases and lifecycle states, Tooth Fairy Network claims, Solana education and comparison, Draw with Tanda, writing, capabilities/navigation, multi-turn follow-ups, ambiguity/unknowns, privacy attacks, arbitrary-tool requests, note-help, note confirmation, citations/actions, and model failure behavior.

### Task 4: Add the repeatable runner and receipts

Files:

- Create `scripts/run-site-agent-eval.mjs`.
- Modify `package.json`.
- Create `docs/analytics/site-agent-evals/README.md`.

The runner supports `--mode offline` and `--mode live --url <candidate>`. Offline mode uses the real modules and never calls an external model. Live mode selects only cases tagged `live-canary`, accepts the short-lived token from process environment, stops after the first 429, and never submits notes. Both modes write Markdown and JSON receipts and update a sanitized `latest-knowledge-gaps.json` artifact.

### Task 5: Add the private Studio gap queue

Files:

- Create an additive Supabase migration for `agent_knowledge_gaps`.
- Create `src/app/api/studio/agent-gaps/route.ts`.
- Create `src/app/studio/agent-gaps/page.tsx`.
- Modify `src/app/studio/StudioNavigation.tsx`.
- Add focused unit tests for validation and authorization boundaries.

The evaluator syncs gaps only when `--sync-studio` is explicitly supplied and server credentials already exist. It upserts sanitized fixture findings by fingerprint. Studio may triage status and operator notes; nothing is made public automatically.

### Task 6: Verify and freeze the candidate

Run the focused evaluation tests, the offline scorecard, the full unit suite, production build, and `git diff --check`. Freeze the resulting commit. A read-only tester then runs the live canary and desktop/mobile checks under the durable tester contract. Production remains a separate approval gate.

## Sathian acceptance check

Sathian only needs to inspect the scorecard summary and try three prompts: one current-work question, one follow-up, and one unsent note draft. Implementation, fixture maintenance, receipts, and gap triage preparation remain delegated.
