# Chat-first Sathian.ai relaunch

Date: 2026-08-10

## Scope

- Relaunch the personal site as a minimal Home, Hackathons, and Writing system.
- Make the existing production site agent the first substantive interaction on Home.
- Position Sathian S. as an agent manager and orchestrator.
- Feature Tooth Fairy Network with official artwork, AutoQuote Automator with the current evidence dashboard, and the source-backed Solana Ecosystem Observatory.
- Move older projects into a quiet archive while preserving their live destinations.
- Redirect `/about` to `/` and `/automation` to `/#agent`.
- Limit the public crawler map to the three main pages and published writing.

## Source

- Release commit: `8773abf` (`feat: relaunch chat-first portfolio`)
- Branch: `main`
- Remote: `origin/main`

## Production deployment

- Production: https://sathian.ai
- Vercel deployment: `dpl_Xrzsw3KBbVhQqeomLJhXWDor7JQk`
- Deployment URL: https://sathian-4ahcwkn0j-sathiansrikrishnans-projects.vercel.app
- Inspector: https://vercel.com/sathiansrikrishnans-projects/sathian-ai/Xrzsw3KBbVhQqeomLJhXWDor7JQk

## Stable project destinations

- Tooth Fairy Network: https://toothfairy.network
- AutoQuote Automator: https://ontario-all-quote-agent.vercel.app
- Solana Ecosystem Observatory: https://htmlpreview.github.io/?https://raw.githubusercontent.com/SathianSrikrishnan/solana-ecosystem-dashboard/main/output/index.html

The AutoQuote destination remains attached to its existing Vercel project. The Solana destination renders `output/index.html` from the source repository's `main` branch, so future source pushes update the public snapshot without requiring another Sathian.ai release.

## Verification

- TDD red-to-green coverage added for the new public contract and simplified sitemap.
- Unit suite: 40 files / 258 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Next.js local production build passed.
- Vercel production build completed successfully.
- Desktop and mobile Home, Hackathons, and Writing layouts inspected in the selected in-app browser.
- Same-width mockup/implementation comparisons passed visual QA.
- Mobile navigation and the site-agent close/reopen flow passed.
- Production Home, Hackathons, Writing, and sitemap returned HTTP 200.
- Production `/about` redirects to `/`; `/automation` redirects to `/#agent`.
- Tooth Fairy Network, AutoQuote Automator, and Solana public destinations returned HTTP 200.
- Production browser console showed no application errors.

## Preserved work

- No changes were made to the active AutoQuote Automator or Solana source worktrees.
- Unrelated untracked Sathian.ai audit screenshots were left untouched for the later worktree and branch cleanup.

## Evidence

- `docs/audits/2026-08-10-chat-first-site-design-qa.md`
- `docs/plans/2026-08-10-chat-first-site-relaunch.md`

