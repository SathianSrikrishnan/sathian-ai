# Source notes — personal-site cleanup and growth report

Audience: product stakeholder / owner.
Delivery mode: portable HTML.
Snapshot date: August 28, 2026.

## Report structure mapping

- Title → `title`
- Executive Summary → `executive-summary`
- Key findings and evidence → `cleanup-findings`, `health-and-measurement`, `ga-trust`, `search-growth`, `content-loop`
- Recommended next steps → `next-steps`
- Further questions → `further-questions`
- Caveats and assumptions → `caveats`

No required role was omitted or merged away.

## Evidence inventory

- Local Git worktree, branch, status, history, and GitHub pull-request inspection.
- Codex task listing and targeted task reads for personal-site work that created local files.
- Current GitHub `Site Agent Quality` workflow history.
- Vercel production error and HTTP 500 log inspection.
- Cloudflare Worker deployment state and a live scheduled tail.
- Supabase project status, recent API/database logs, and the aggregate daily-report RPC.
- Release gate executed on the exact local release candidate.
- Live web search snapshot for full-name, first-name, and site queries.
- Primary Google, OpenAI, Anthropic, Bing, IndexNow, and Vercel guidance linked in the supporting audit.

## Chart map and visualization decision

| Segment | Question | Family / type | Fields | Supported claim | Palette | Delivery |
| --- | --- | --- | --- | --- | --- | --- |
| Repository cleanup | How many worktrees are ready for low-risk cleanup versus requiring preservation or a decision? | Comparison / horizontal bar | bucket, count, decision | Eight of 19 registered worktrees are clean and fully merged; the remainder still need preservation or judgment. | Single-root preferred; no color grouping or legend | Native report chart in `artifact.json` |

Five non-overlapping disposition rows are sufficient for a category comparison. Horizontal bars keep the labels readable at desktop and narrow widths, use a zero baseline, and avoid a redundant legend. The source is the reviewed worktree inventory in the supporting audit.

The user supplied only one aggregate GA4 pair (35 active users, 42 sessions), without a time-series, segment cut, hostname split, engagement rows, or bot-request dataset. A traffic chart would imply a trend or decomposition that the evidence cannot support, so the report does not visualize those two values.

## Limitations

- The live search snapshot is point-in-time and not a rank guarantee.
- The GA4 values are not sufficient to estimate a human/bot share.
- The canonical artifact and self-contained HTML passed validation and exact-payload structural verification (11 blocks, 1 chart). The packaged browser verifier rendered the report and chart correctly but failed its Windows desktop overflow check because the reader's `100vw` sticky header and classic vertical scrollbar add a few horizontal pixels on a long page. Generated HTML was not hand-edited; deeper desktop/narrow interaction QA remains a renderer-level limitation for this artifact.
- No production mutation, push, deployment, external publication, deletion, or pull-request closure was authorized or performed.
