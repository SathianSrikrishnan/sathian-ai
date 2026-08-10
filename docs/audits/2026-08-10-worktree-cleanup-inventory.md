# Sathian.ai worktree and branch cleanup inventory

Captured: 2026-08-10 after fetching and pruning all remotes.

No worktree, branch, file, or deployment was deleted during this audit.

## Canonical active source

| Worktree | Branch | Decision |
| --- | --- | --- |
| `worktrees/hackathon-portfolio-release` | `main` | The only Sathian.ai production source. Keep. |

## Clean and fully merged — lowest-risk removal candidates

Each checked-out commit is already an ancestor of `main`, and the worktree has no uncommitted files:

- `C:\Users\sathi\Projects\_release\sathian-ai-front-door-fc01914` — detached release snapshot.
- `worktrees/feat-lex-garden` — `feat/lex-rooftop-garden`.
- `worktrees/hackathons-on-latest` — `fix/hackathons-on-latest`.
- `worktrees/tfn-wallet-build-log` — `codex/tfn-wallet-build-log`.
- `worktrees/tfn-wallet-build-log-live` — `codex/tfn-wallet-build-log-live`; the newer remote tip is also fully in `main`.
- `worktrees/workshop-site-system` — `feat/workshop-site-system`.

These six can be removed first after Sathian approves the exact destructive cleanup command.

## Fully merged but dirty — preserve until classified

- `C:\Users\sathi\Projects\sathian-ai\main` — historical `feat/hackathons-agenttab` worktree with 11 untracked Codex screenshots.
- `worktrees/public-agent-portal` — branch history is fully in `main`, but `src/app/sitemap.ts` and `tests/unit/site-indexing.test.ts` are modified. The branch is also four commits ahead of its remote branch, although those commits are already in `main`.
- `worktrees/tfn-v1-history` — detached historical snapshot with a capture script, two logs, and `ThemeOverride.tsx` untracked.
- `worktrees/warm-workshop-live` — fully merged branch with six untracked workshop screenshots.

These are archive candidates only after the uncommitted files are copied, committed deliberately, or declared disposable.

## Branches not merged into `main`

### Pushed remotely

- `codex/tfn-capsule-mvp` — 95 commits outside `main`, clean, and synchronized with `origin/codex/tfn-capsule-mvp`. This is TFN product history and should be reconciled with the canonical Tooth Fairy Network repository, not blindly merged into the portfolio.
- `toothfairy/v2-scroll` — one commit outside `main`, synchronized with `origin/toothfairy/v2-scroll`, and not checked out as a worktree.

### Local-only branch history

- `feat/aia-project-frame` — two clean local commits: the Auto Insurance Automator portfolio frame and its verification receipt. Review against the current AutoQuote presentation, then archive or cherry-pick only missing evidence.
- `feat/studio-control-room` — six clean local commits for the Studio control room. Preserve as a separate product line; do not merge automatically into the simplified public site.
- `codex/website-analytics-digest-20260719` — five clean local commits for the private analytics Worker. This is the most operationally relevant loose end because its event mapping predates the new chatbot funnel.
- `feat/warm-digital-workshop` — one local commit plus six untracked QA artifacts/directories. The design is superseded by `main`; preserve evidence before removal.
- `reskin/homepage-2026-07` — 100 divergent local commits plus one untracked article-insert script. This mixes old TFN and homepage history and must be archived, not merged wholesale.
- `migration/toothlight-v4-active-20260612` — the branch exists remotely, but two local commits (`Fix production site health checks` and `safety commit before homepage reskin`) were never pushed to its remote. Review them against the canonical TFN repository.

## Recommended cleanup sequence

1. Keep all new Sathian.ai releases on the canonical `main` worktree only.
2. Remove the six clean, fully merged worktrees after explicit approval.
3. Copy or classify the uncommitted files in the four dirty, fully merged worktrees, then remove those worktrees.
4. Reconcile `codex/website-analytics-digest-20260719` as a separate Worker release so the daily report uses the new chatbot event names.
5. Compare `feat/aia-project-frame` with the current AutoQuote page and preserve only missing evidence.
6. Route TFN-specific histories (`codex/tfn-capsule-mvp`, `toothfairy/v2-scroll`, `reskin/homepage-2026-07`, and `migration/toothlight-v4-active-20260612`) to the canonical Tooth Fairy Network repository or a read-only archive.
7. Archive the superseded warm-workshop and Studio branches only after their unique artifacts are accounted for.
