# Sathian search identity production receipt

Date: 2026-09-01

## Release

- Production site: `https://sathian.ai`
- Source commit: `aef0d7ede8de6789ae11fd5b05433ce3025dd942`
- Deployment: `dpl_7FguWoCABKWXLJEpvoRLjnaE6hEB`
- Deployment URL: `https://sathian-435t7u3j3-sathiansrikrishnans-projects.vercel.app`
- GitHub quality run: `https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/33513030494`

## What changed

- `Sathian` is the visible site name, homepage identity, About title, footer identity, and writing byline.
- `Sathian Srikrishnan` remains the canonical Person name in structured data and appears naturally on the About page.
- Substack and GitHub now join the shared maintained-profile registry and Person `sameAs` graph.
- No CSS or visual-system file changed.
- The excluded-URL audit and weekly organic-growth scorecard are recorded in `docs/audits/2026-09-01-search-console-excluded-url-ledger.md`.

## Verification

- Local release gate: PASS — 415 unit/contract tests, 60/60 offline agent evaluation, critical dependency threshold, production build, four-viewport public-surface checks, and desktop/mobile sound playback.
- GitHub `Site Agent Quality`: PASS — offline gate plus frozen protected preview, 10-case canary, chat UI, public surfaces, security headers, mobile layout, and real sound playback.
- Vercel deployment state: `READY`, target `production`, alias `https://sathian.ai`.
- Live public-surface verifier: PASS at desktop, compact desktop, wide desktop, and mobile for `/`, `/about`, `/links`, `/writings`, `/hackathons`, `/writings/inside-monkedao`, and `/projects/solana-observatory`.
- Live site-agent sound verifier: PASS on desktop and mobile; wake and signature assets returned HTTP 200 and mobile playback advanced.
- Vercel production error scan after deployment: no error logs found.
- Existing untracked `tmp/substack-visuals/` files were preserved and not deployed.

## Google indexing requests

Search Console property: `sc-domain:sathian.ai`

- `https://sathian.ai/`: already indexed; fresh indexing requested and confirmed added to the priority crawl queue.
- `https://sathian.ai/about`: already indexed; fresh indexing requested and confirmed added to the priority crawl queue.

Google states that repeated requests do not increase priority and that inclusion or ranking changes are not guaranteed. The weekly measurement heartbeat should now track branded `sathian` impressions, clicks, and average position.

## Known separate backlog

The established high/moderate dependency-upgrade backlog remains separate. The release passed the configured critical stop-ship threshold; this receipt does not claim the broader dependency backlog is closed.
