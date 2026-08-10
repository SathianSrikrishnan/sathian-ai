# Sathian.ai worktree cleanup inventory

Captured: 2026-08-10 before the simplified-site production release.

No worktree, branch, file, or deployment was deleted during this audit.

## Canonical active worktree

| Worktree | Branch | State |
| --- | --- | --- |
| `worktrees/hackathon-portfolio-release` | `main` | Active production source. Keep. |

## Clean and already merged — removal candidates

These are the lowest-risk candidates, subject to Sathian approving their exact deletion after the production release:

- `C:\Users\sathi\Projects\_release\sathian-ai-front-door-fc01914`
- `worktrees/feat-lex-garden`
- `worktrees/hackathons-on-latest`
- `worktrees/tfn-wallet-build-log`
- `worktrees/tfn-wallet-build-log-live`
- `worktrees/workshop-site-system`

## Dirty and already merged — inspect before removal

These contain uncommitted files even though their checked-out commits are ancestors of `main`:

- `C:\Users\sathi\Projects\sathian-ai\main` — 11 status entries; historical worktree despite its misleading name.
- `worktrees/aia-project-frame` — 7 status entries.
- `worktrees/public-agent-portal` — 2 status entries.
- `worktrees/tfn-v1-history` — 4 status entries.
- `worktrees/warm-workshop-live` — 6 status entries.

Their uncommitted files must be classified as archive, duplicate, or active before any deletion.

## Unmerged — protect

Clean but not merged into `main`:

- `worktrees/studio-control-room`
- `worktrees/tfn-capsule-mvp`
- `worktrees/website-analytics-digest`

Dirty and not merged into `main`:

- `worktrees/toothlight-v4-active` — 1 status entry.
- `worktrees/warm-digital-workshop` — 6 status entries.

These may contain unique work and are not cleanup candidates yet.

## Recommended cleanup sequence

1. Release and verify the canonical `main` worktree.
2. Remove only the six clean, merged worktrees after explicit approval.
3. Review and archive the dirty, merged worktrees one at a time.
4. Reconcile the analytics digest branch separately so the new chatbot event names can appear in the Telegram report.
5. Re-audit unmerged TFN and Studio branches against their canonical project repositories before deciding their fate.
