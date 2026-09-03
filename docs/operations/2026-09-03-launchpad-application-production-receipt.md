# Stan Launchpad application page — production receipt

Date: 2026-09-03  
Status: `LIVE / READY FOR SATHIAN TO SUBMIT`

## Release

- Application URL: https://sathian.ai/launchpad
- Production commit: `71225df3eda72f6eba9e0fa49670eaddb9f5ceb1`
- Vercel deployment: `dpl_5f5bGmqU8p6tuWkZXnz1qbiBoM4K`
- Vercel URL: https://sathian-1iykdg9nz-sathiansrikrishnans-projects.vercel.app
- GitHub release gate: https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/33775231893

## What shipped

- A standalone `/launchpad` founder-application page using the current sathian.ai paper-and-ink editorial system.
- Sathian's raw 2:27 first take as the primary object, with a poster and English captions.
- About 140 words of supporting copy: parent-led product, current toll-free-call / keepsake / guardian-owned-wallet test, larger parent-child direction, and a concrete two-week customer-acquisition objective.
- No Binance/Coinbase name-dropping, unsupported “150 traditions” claim, pitch-deck language, or site-agent overlay.

## Source integrity

- Preserved source: `C:\Users\sathi\Projects\_second-brain\raw\voice-recordings\2026-09-03-stan-launchpad-application-video\audio\2026-09-03-stan-launchpad-application-take.mp4`
- Shipped file: `public/media/launchpad/sathian-launchpad-application.mp4`
- Size: `30,169,940` bytes
- Duration: `147.329` seconds
- SHA-256: `81082A4B7E92F6B7DB01641B246067AF84536CB8249AE0CA7CFC75A19D5FB4D4`
- The shipped MP4 is an exact copy of the preserved source; it was not re-encoded.

## Verification evidence

- Fresh local `npm run release:verify`: PASS.
  - Unit and contract tests: `419/419` across `62/62` files.
  - Offline site-agent evaluation: `60/60`, zero knowledge gaps.
  - Production build: PASS; `/launchpad` generated at `437 B` with `97.3 kB` first load JS.
  - Shared desktop/mobile public-surface and real sound-playback checks: PASS.
- GitHub `Site Agent Quality` for the production commit: PASS.
  - Offline quality gate: PASS.
  - Protected preview 10-case canary: PASS.
  - Public surfaces, security headers, mobile layout, and real playback: PASS.
- Live HTTP checks:
  - `/launchpad`: `200`, expected title and `noindex, nofollow` metadata.
  - MP4: `200`, `video/mp4`, `30,169,940` bytes, byte ranges enabled.
  - MP4 range probe: `206 Partial Content`, `bytes 0-1023/30169940`.
  - Poster: `200`, `image/jpeg`, `74,107` bytes.
  - Captions: `200`, `text/vtt`.
  - `/launchpad` absent from the homepage and sitemap.
- Live Playwright verification:
  - Desktop `1440x1000`: duration `147.329`, playback advanced to `0.851`, zero overflow, zero console errors.
  - Mobile `390x844`: duration `147.329`, playback advanced to `0.849`, zero overflow, zero console errors.
  - Captions, poster, keyboard order, hidden site agent, and project link verified.
- Vercel post-deploy scan: no error-level logs and no HTTP 500 logs found for the production deployment.

Screenshots:

- `docs/operations/2026-09-03-launchpad-local-review/desktop-1440x1000.png`
- `docs/operations/2026-09-03-launchpad-local-review/mobile-390x844.png`

The dependency audit still reports the site's documented high/moderate upgrade backlog. The configured critical stop-ship gate passed; this release does not claim that backlog is closed.

## Privacy and remaining human action

The page is unlisted and excluded from search indexing, but it is link-accessible rather than password-protected. Anyone who receives the URL can view it.

The Stan form has **not** been submitted, no terms have been accepted, and no message has been sent to Jay. Sathian's remaining action is to review the live page, paste the URL into the application, accept the terms, submit, save the private status link, and then send the personally reviewed Jay follow-up.
