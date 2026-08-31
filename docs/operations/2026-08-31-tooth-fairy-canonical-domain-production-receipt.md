# Tooth Fairy Network canonical domain — production receipt

Date: 2026-08-31 EDT  
Production commit: `873ed41a9bf6bfdfeceaaec4f4911c63f8fe3bdf`  
Deployment: `dpl_B6cYkhWAcGDXK3R3iafMYiUHaS4H`  
Deployment URL: `https://sathian-51teqmdan-sathiansrikrishnans-projects.vercel.app`  
Canonical product domain: https://toothfairy.network  
Personal-site domain: https://sathian.ai

## Root cause and correction

- `https://sathian.ai/toothfairy` was still rendering the historical Tooth Fairy application embedded in the personal-site repository.
- The current product is the independently hosted `https://toothfairy.network` site.
- Permanent redirects now retire the old personal-site route, every nested path below it, and the legacy `toothfairy.sathian.ai` subdomain.
- All legacy URLs deliberately land on the canonical homepage. The current product does not expose a complete one-to-one set of legacy nested paths, so preserving arbitrary suffixes would create avoidable 404s.

## Verification

- `npm run release:verify`: PASS.
- Unit and contract tests: 412/412 passed across 61 files.
- Offline site-agent evaluation: 60/60 passed.
- Production build: passed.
- Desktop/mobile public-surface and real sound-playback checks: passed.
- Patch hygiene: passed.
- `https://sathian.ai/toothfairy` returned HTTP 308 to `https://toothfairy.network/`.
- `https://sathian.ai/toothfairy/app` and `/toothfairy/network/about` returned HTTP 308 to the same canonical homepage.
- `https://toothfairy.sathian.ai` and an arbitrary nested path returned HTTP 308 to the same canonical homepage.
- `https://toothfairy.network`, `https://sathian.ai`, the Solana Observatory page, and the Inside MonkeDAO report each returned HTTP 200 after deployment.
- Local `HEAD` and `origin/main` matched at the production commit above.

## Explicitly not performed

- No legacy source files or deployment history were deleted.
- No Substack, X, LinkedIn, YouTube, Telegram, bounty, email, or community post was published or submitted as part of this redirect release.
