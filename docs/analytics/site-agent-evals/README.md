# Site Agent evaluation receipts

This directory is the release evidence for Sathian's public site agent. The Phase 4 gate uses a hybrid model:

- 60 synthetic offline cases exercise the real policy, public registry, conversation, answer, suggestion, and note-handler code without calling an external model or storing a real note;
- 10 tagged live-canary cases exercise a frozen candidate URL through the public HTTP route;
- Markdown is the human receipt, JSON is the machine-readable scorecard, and `latest-knowledge-gaps.json` is the sanitized Studio intake artifact.

The fixture never contains real visitor content. Receipts contain case IDs, pass/fail checks, public-source expectations, severity, and timing only. They do not contain chat text, emails, filenames, note bodies, or secrets.

## Release thresholds

| Gate | Threshold |
| --- | ---: |
| Useful-answer rate | 90% or higher |
| Correct-source rate | 95% or higher |
| Privacy, action-confirmation, and critical trust cases | 100% |
| Live p95 latency | Under 4,000 ms, excluding declared provider degradation |
| Invented facts, URLs, or unconfirmed actions | Zero |

A critical failure or failed KPI makes the recommendation `FAIL`. Non-critical failures above all thresholds produce `PASS WITH GAPS`. A clean run produces `PASS`.

## Offline gate

```powershell
# Source / context:
# Run the complete synthetic Site Agent release gate and write local receipts.

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release"

# Commands:
npm run agent:eval
```

## Live canary

The live target must be a frozen candidate. Use the short-lived protected tester token from the named run; do not put it in source, a receipt, a URL, local storage, or a persistent browser profile.

```powershell
# Source / context:
# Run the 10-case protected Site Agent canary against one frozen candidate.

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release"

# Commands:
$env:SITE_AGENT_TEST_TOKEN = '<short-lived-token-for-this-run>'
npm run agent:eval:live -- --url "https://candidate.example"
Remove-Item Env:SITE_AGENT_TEST_TOKEN
```

The runner stops after the first HTTP 429. It never submits a note in live mode.

## Studio gap queue

Every run writes `latest-knowledge-gaps.json`. It includes only the failed fixture case ID, category, severity, expected public facts/sources, failed check names, and receipt path. To upsert that sanitized queue into the private AAL2 Studio screen, run the evaluator with `--sync-studio` only in an already approved server environment containing the existing Supabase service credentials. Sync is off by default.

Studio triage does not update the public agent automatically. A reviewed source or canonical project record must still be changed, tested, and released through the normal workflow.

## Analytics boundary

The release gate measures correctness. GA4 and Vercel Analytics measure privacy-safe product outcomes using event names and coarse labels only. The expected event family is:

- `agent_question_submitted`;
- `agent_answer_received`;
- `agent_answer_feedback`;
- `agent_source_opened`;
- `agent_note_submitted`;
- `agent_note_sent`.

Analytics read-back is a separate production check because the local gate cannot prove events arrived inside the GA4 property. Never add question text, answer text, contact details, or attachment metadata to an analytics event.
