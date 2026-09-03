# Stan Launchpad application page — production receipt

Date: 2026-09-03
Status: `LIVE / SATHIAN SUBMITTING`

## Release

- Application URL: https://sathian.ai/launchpad
- Production commit: `23189b1920c494a47eea4cf72505bde21bb953b3`
- Vercel deployment: `dpl_6x5kFy8R8vUS4HPiEkwRLmLo6mMS`
- Vercel URL: https://sathian-km2qmygpj-sathiansrikrishnans-projects.vercel.app
- Vercel inspector: https://vercel.com/sathiansrikrishnans-projects/sathian-ai/6x5kFy8R8vUS4HPiEkwRLmLo6mMS

## What shipped

- A standalone `/launchpad` founder-application page using the current sathian.ai paper-and-ink editorial system.
- Sathian's raw 2:27 first take as the primary object, with a poster and English captions.
- A six-question founder prospectus covering who, what, where, when, why, and how, followed by the market and fourteen-day customer-acquisition objective.
- A prominent proof bar above the video linking to https://toothfairy.network and the verified Solana Mainnet program at https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC.
- No Binance/Coinbase name-dropping, unsupported “150 traditions” claim, pitch-deck language, or site-agent overlay.

## Source integrity

- Preserved source: `C:\Users\sathi\Projects\_second-brain\raw\voice-recordings\2026-09-03-stan-launchpad-application-video\audio\2026-09-03-stan-launchpad-application-take.mp4`
- Shipped file: `public/media/launchpad/sathian-launchpad-application.mp4`
- Size: `30,169,940` bytes
- Duration: `147.329` seconds
- SHA-256: `81082A4B7E92F6B7DB01641B246067AF84536CB8249AE0CA7CFC75A19D5FB4D4`
- The shipped MP4 is an exact copy of the preserved source; it was not re-encoded.

## Verification evidence

- Fresh local launchpad checks: PASS.
  - Unit and contract tests: `424/424` across `62/62` files.
  - Offline site-agent evaluation: `60/60`, zero knowledge gaps.
  - Production build: PASS; `/launchpad` generated at `509 B` with `97.4 kB` first load JS.
  - Launchpad-specific desktop/mobile link, layout, playback, and keyboard checks: PASS.
  - The final sitewide browser phase stopped on an existing `/projects/solana-observatory` wide-desktop headline-overlap assertion outside this change; no unrelated page was modified.
- Live HTTP checks:
  - `/launchpad`: `200`, expected title and `noindex, nofollow` metadata.
  - MP4: `200`, `video/mp4`, `30,169,940` bytes, byte ranges enabled.
  - MP4 range probe: `206 Partial Content`, `bytes 0-1023/30169940`.
  - Poster: `200`, `image/jpeg`, `74,107` bytes.
  - Captions: `200`, `text/vtt`.
  - `/launchpad` absent from the homepage and sitemap.
- Live Playwright verification:
  - Desktop `1440x1000`: duration `147.329`, playback advanced to `0.850`, zero overflow, zero console errors.
  - Mobile `390x844`: duration `147.329`, playback advanced to `0.937`, zero overflow, zero console errors.
  - Product link, Solscan program proof, captions, poster, keyboard order, hidden site agent, and origin-essay link verified.

Screenshots:

- `docs/operations/2026-09-03-launchpad-proof-links-production-review/desktop-1440x1000.png`
- `docs/operations/2026-09-03-launchpad-proof-links-production-review/mobile-390x844.png`

The dependency audit still reports the site's documented high/moderate upgrade backlog. The configured critical stop-ship gate passed; this release does not claim that backlog is closed.

## Privacy and remaining human action

The page is unlisted and excluded from search indexing, but it is link-accessible rather than password-protected. Anyone who receives the URL can view it.

Sathian said he is submitting the Stan form and sending the personal follow-up himself. This receipt does not claim that either external action completed; preserve the status-link or sent-message confirmation separately once available.
