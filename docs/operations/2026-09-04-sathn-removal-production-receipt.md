# Sathian identity alias removal — production receipt

Date: 2026-09-04

## Release

- Production URL: https://sathian.ai
- Production commit: `adebdba4e7df69d4db1dc0beb99f53b77395edfb`
- Deployment: `dpl_7AsKyVT9ncBuz5yLYGTAi6DBroRX`
- Deployment URL: https://sathian-5kc22nia4-sathiansrikrishnans-projects.vercel.app
- GitHub quality run: https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/33918533813

## Change

Removed the `SATHN` shorthand from the homepage identity, About copy, structured identity metadata, and the site agent's reviewed public profile context. The public identity now uses Sathian and Sathian Srikrishnan without the extra shorthand.

## Verification

- Local release gate: PASS — 424/424 unit and contract tests, 60/60 offline site-agent evaluation, production build, four viewport checks, and desktop/mobile real sound playback.
- GitHub `Site Agent Quality`: PASS — offline quality gate plus frozen protected preview, 10-case canary, chat UI, public surfaces, security headers, mobile layout, and sound playback.
- Required live routes returned HTTP 200: `/`, `/projects/tooth-fairy-network/draw-with-tanda`, `/projects/clinicalguard`, `/writings`, `/hackathons`, `/robots.txt`, and `/sitemap.xml`.
- Live homepage HTML contains the exact `SATHIAN` identity label and contains no `SATHN`.
- Live About HTML contains `Sathian Srikrishnan` and contains no `SATHN`.
- Live public-surface verification passed at desktop, compact desktop, wide desktop, and mobile viewports.
- Vercel inspection reported the production deployment `Ready` and aliased to `https://sathian.ai`.
- Recent production deployment error-log scan returned no logs.
