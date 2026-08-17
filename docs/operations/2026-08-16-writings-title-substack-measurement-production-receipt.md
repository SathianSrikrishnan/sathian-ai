# Writings, Substack, and measurement production receipt

Release date: 2026-08-16

## Production artifact

- Website: https://sathian.ai
- Branch: `main`
- Feature commit: `14141e48ee4ac6af67b5119e0c9a53be9dd6a0f5`
- Vercel deployment: `dpl_CbaXMu1f9t7jyYDpb78GgZX7s997`
- Deployment URL: https://sathian-odetp6e7m-sathiansrikrishnans-projects.vercel.app
- Vercel target/status: `production` / `Ready`

## Released behavior

- Restored the visible `/writings` heading to the site's editorial title treatment as `Writing.`
- Added one visible `Read and subscribe on Substack` link to `/writings` and one Substack entry to `/links`.
- Strengthened the existing `Site Agent Quality` workflow instead of creating a second release pipeline.
- Preserved the existing site-agent sound, replay, analytics, and accessibility architecture.

## Measurement and indexing baseline

- Recorded a source-backed GA4, Search Console, Telegram, Substack, Luma, Meta, consent, and privacy recommendation in `docs/research/2026-08-16-sathian-ai-measurement-growth-baseline.md`.
- Recorded an exact Search Console classification in `docs/audits/2026-08-16-search-console-indexing-baseline.md`.
- No production analytics-account setting, Meta integration, Search Console removal, redirect, route deletion, or worktree deletion was performed.
- The unrelated untracked social-launch draft was preserved and excluded from the release.

## Verification evidence

- Local unit suite: 56 files / 385 tests passed.
- Offline site-agent evaluation: 60/60 with zero knowledge gaps.
- Local optimized production build: exit 0.
- Production dependency gate: zero critical vulnerabilities; known non-critical dependency findings remain tracked separately.
- GitHub Site Agent Quality: [run 31981676380](https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/31981676380) completed successfully, including the offline gate, frozen protected preview, 10-case canary, chat UI, public surfaces, security headers, mobile layout, and real sound playback.
- Live desktop and mobile checks confirmed the expected title, H1, canonical URLs, security headers, no horizontal overflow, and one visible Substack link.
- Live mobile Chromium decoded and advanced the wake sting, Replay signature, and note signature.
- Live route checks: `/`, `/writings`, `/links`, `/hackathons`, `/robots.txt`, `/sitemap.xml`, and both audio URLs returned HTTP 200.
- Vercel inspection reported `Ready` with the production alias active. The post-deploy error-level log scan returned no entries.

