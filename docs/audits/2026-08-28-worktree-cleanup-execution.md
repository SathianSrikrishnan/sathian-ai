# Sathian.ai worktree cleanup execution receipt

Date: August 28, 2026
Authorization: Sathian explicitly approved deleting the obsolete personal-site worktrees, branches, and loose artifacts after reviewing the cleanup-and-growth report.
Canonical source: `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release` on `main`.

## Safety boundary

This cleanup removes superseded personal-site worktrees, disposable QA artifacts, fully merged branch labels, and four explicitly superseded local-only personal-site histories. It does **not** delete the unique TFN/Toothlight histories or the two open TFN draft pull requests.

Preserved worktrees:

- `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release` — canonical `main`.
- `C:\Users\sathi\Projects\sathian-ai\main` — Git's primary administrative worktree and owner of the shared `.git` database. It cannot be removed without breaking every linked worktree. Its 11 disposable screenshots were deleted, it was detached at canonical commit `d4a1750`, and `ACTIVE-WORKTREE.md` continues to prohibit deployment from it.
- `C:\Users\sathi\Projects\sathian-ai\worktrees\tfn-capsule-mvp` — pushed TFN product history at `0a373f9c31bbe6628ed594512e89a5604f91329e`.
- `C:\Users\sathi\Projects\sathian-ai\worktrees\tfn-v1-history` — detached TFN preservation source with untracked capture evidence.
- `C:\Users\sathi\Projects\sathian-ai\worktrees\toothlight-v4-active` — divergent Toothlight history at `ccd5c5821441ab8ca6d1afd36d46276350516786` with an untracked article script.

Preserved open pull requests:

- PR #7, `[codex] rebuild Toothlight creation flow`.
- PR #5, `Codex/tfnv2`.

## Worktrees approved for removal

| Exact path | Tip | State before removal | Reason |
| --- | --- | --- | --- |
| `C:\Users\sathi\Projects\_release\sathian-ai-front-door-fc01914` | `fc01914f6da3d590dc35716eb31dedf261d10b8f` | Clean detached snapshot; fully merged | Superseded release snapshot. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\aia-project-frame` | `76adf06696aff4c2c1ff608a7d3f35090027b91f` | Clean; two commits outside `main` | Superseded AutoQuote framing. Current `main` now carries the approved truthful private-research representation. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\bitcoinbay-private-proposal` | `227f9ffc63e41ec95d9958b9bccc8dbf61417eaa` | Clean; fully merged | Redundant checkout. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\feat-lex-garden` | `005f408f40be97e38271561897fc8b9e2019bb73` | Clean; fully merged | Redundant checkout. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathons-on-latest` | `ffdd43a55b9d5d0fc888f8b4700f558a317d4a4e` | Clean; fully merged | Redundant checkout. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\public-agent-portal` | `fc01914f6da3d590dc35716eb31dedf261d10b8f` | Fully merged; two modified sitemap/test files | The duplicate-writing sitemap fix is in `main`; the remaining broader old crawl-surface patch is superseded by the new identity release. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\site-agent-v2-local-20260811` | `291e4395644a2da51d4ef50f899843d055145a2b` | Clean; fully merged | Redundant checkout. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\studio-control-room` | `51dd0d8c284b20d9676bf3fdfb794df3ca056a25` | Clean; six commits outside `main` | Superseded private Studio architecture, explicitly declared unnecessary for this site. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\tfn-wallet-build-log` | `005f408f40be97e38271561897fc8b9e2019bb73` | Clean; fully merged | Redundant checkout; no unique branch history. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\tfn-wallet-build-log-live` | `2a74e357883602e66ebe8fefaa7382fa9e332e01` | Clean; fully merged | Redundant checkout; newer remote tip is also in `main`. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\warm-digital-workshop` | `04a5fe98b5eaea2e7b74012f510cd64a134e8a76` | One commit outside `main`; two partial dependency folders and four screenshots untracked | Superseded visual direction and disposable QA artifacts. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\warm-workshop-live` | `eae33c1426e83e0403926aefbdc5aa3c3e9fbc32` | Fully merged; six untracked screenshots | Redundant checkout and disposable QA artifacts. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\website-analytics-digest` | `78548601b3b018c7abef4534bd5b47893d506282` | Clean; five commits outside `main` | Separate reporting architecture is superseded by the integrated Telegram-delivery Worker. |
| `C:\Users\sathi\Projects\sathian-ai\worktrees\workshop-site-system` | `8f19c3cea6b1b79d9bbe256f9cb8b832ad3ff3ef` | Clean; fully merged | Redundant checkout. |

The untracked third-party résumé at `docs/audits/2026-08-17-aravindh-portfolio-inspiration/Aravindh_Palaniguru_AI_CV.pdf` is also approved for permanent local deletion. It is not in Git and has no repository rollback path.

## Local-only histories approved for branch-label removal

These tips are recorded so the decision remains auditable even after their branch labels are deleted. Git object recovery is not guaranteed after garbage collection.

- `feat/aia-project-frame` → `76adf06696aff4c2c1ff608a7d3f35090027b91f`
- `feat/studio-control-room` → `51dd0d8c284b20d9676bf3fdfb794df3ca056a25`
- `feat/warm-digital-workshop` → `04a5fe98b5eaea2e7b74012f510cd64a134e8a76`
- `codex/website-analytics-digest-20260719` → `78548601b3b018c7abef4534bd5b47893d506282`

All other local and remote branch labels removed by this batch are already ancestors of canonical `main`. Their commits remain reachable from `main`.

## Result

Completed August 28, 2026.

- Registered worktrees reduced from 19 to 5. The five are canonical `main`, the unavoidable detached primary administrative worktree, and three preserved TFN/Toothlight sources.
- Fourteen obsolete linked worktrees were removed. Two left only broken `node_modules` junctions after Git unregistered them; the exact junctions and now-empty parent folders were removed without following their targets, then the worktree registry was pruned.
- Nineteen obsolete local branch labels were removed. Four of those were the superseded local-only histories whose exact tips are recorded above; every other removed local branch was already reachable from `main`.
- Sixteen fully merged remote branch labels were deleted from GitHub. All of their commits remain reachable from `main`.
- Eleven screenshots in the primary administrative worktree, the obsolete worktree QA artifacts/partial dependency folders, and the untracked third-party résumé PDF were permanently deleted. They were not in Git and have no repository rollback path.
- The canonical worktree is clean except for the intended release changes and this receipt. Both open TFN draft pull requests remain unchanged.
