# Site-agent signature sound production receipt

Release date: 2026-08-16

## Production artifact

- Website: https://sathian.ai
- Branch: `main`
- Feature commit: `905fbb6a1e1f2f8e290692507b480e1b66e39b45`
- Vercel deployment: `dpl_AUFiBDC3v9caGNo1SMi8ozGsSVEH`
- Deployment URL: https://sathian-bcyeiepn3-sathiansrikrishnans-projects.vercel.app
- Vercel target/status: `production` / `Ready`

## Released behavior

- A 2.35-second sting plays after the first intentional site-agent wake in a browser tab.
- Homepage auto-render remains silent; reopening the homepage agent or opening the floating agent is the user gesture.
- The complete 6.42-second signature is primed during a note-send gesture for mobile compatibility and plays only after the API returns a durable note receipt.
- Ordinary questions do not trigger the complete signature.
- A visible speaker control persists the visitor's sound preference in local storage and stops active playback when muted.
- The visual receipt remains the authoritative confirmation; sound is never the only success signal.

## Audio artifacts

- `public/audio/site-agent-wake-sting.mp3` — 2.350 seconds / 38,670 bytes.
- `public/audio/site-agent-note-signature.mp3` — 6.420 seconds / 129,837 bytes.

The source reference is Fabolous's “Quiet Storm Freestyle” with DJ Clue. These files use the recognizable master recording requested for this release; public-use clearance is not documented in the repository and remains a rights-management follow-up.

## Verification evidence

- Local unit suite: 55 files / 383 tests passed.
- Local production build: `npm run build` completed successfully with type and lint validation.
- TDD receipt: each wake, receipt, and mute contract was observed failing before implementation and passing afterward.
- Local production-browser proof: desktop 1440×1000 and mobile 390×844 passed asset, playback-event, once-per-tab, persisted-mute, note-receipt, overflow, and agent-scoped Axe checks.
- Real mobile playback proof: headless mobile Chromium decoded both MP3s and advanced the wake clock to 0.537 seconds and the receipt-signature clock to 0.513 seconds.
- Live production-browser proof: desktop and mobile passed the same checks against `https://sathian.ai`; real mobile playback advanced the wake clock to 0.474 seconds and the receipt-signature clock to 0.483 seconds.
- Live route checks: `/`, `/projects/tooth-fairy-network/draw-with-tanda`, `/projects/clinicalguard`, `/writings`, `/hackathons`, `/robots.txt`, `/sitemap.xml`, and both audio URLs returned HTTP 200.
- Vercel inspection: deployment status `Ready`, production alias active, and the error-level one-hour log scan returned no entries.
- GitHub Site Agent Quality: [run 31958876767](https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/31958876767) completed successfully, including 383 unit tests, the 60-case offline quality gate, production build, frozen preview, protected 10-case canary, and browser verifier.

## Known unrelated finding

The broad homepage Axe audit still reports the pre-existing rust-on-paper contrast issue (`#b84e1a` on `#ead9bb`) outside the site-agent panel. The agent-scoped desktop/mobile Axe checks for this release passed with no violations.
