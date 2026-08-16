# Site-agent signature replay production receipt

Release date: 2026-08-16

## Production artifact

- Website: https://sathian.ai
- Branch: `main`
- Feature commit: `d25657ddd71cc6a6958e0beb0162edf08a4ff3c0`
- Vercel deployment: `dpl_6zKmgFVimrjP3BpGPVctK2Syv9Fg`
- Deployment URL: https://sathian-5rxqs6w01-sathiansrikrishnans-projects.vercel.app
- Vercel target/status: `production` / `Ready`

## Released behavior

- The open site agent now has one compact `Replay` control with the accessible name `Replay complete signature`.
- Each deliberate press restarts the existing 6.42-second complete signature.
- The control is disabled while the existing persisted sound preference is muted.
- Each press emits `agent_signature_replayed` with only the page and `placement: agent_controls`.
- Existing automatic behavior remains unchanged: the short wake sting plays once per tab and the complete signature still follows a durable note receipt.

## Existing architecture integration

| Existing layer | Replay contribution | Duplicate layer added |
| --- | --- | --- |
| Root-mounted `ChatWidget` | One control inside the existing panel | No |
| `agentAudioRef` and `playAgentSound` | Calls `playAgentSound('noteDelivered')` | No |
| `SITE_AGENT_SOUNDS` registry | Reuses the existing complete-signature MP3 | No |
| Persisted `soundEnabled` preference | Disables replay while muted | No |
| `trackSiteEvent` wrapper | Adds one privacy-safe event name | No |

Source and live-DOM audits found exactly one site-agent root, one open panel, one Replay control, and one audio element. No component provider, API route, dependency, storage key, audio asset, audio element, or analytics client was added.

## Verification evidence

- Local unit suite: 55 files / 384 tests passed.
- Offline site-agent evaluation: 60/60 with zero knowledge gaps.
- Local optimized production build: exit 0.
- Local production-browser proof passed desktop 1440×1000, mobile 390×844, two deliberate replays, persisted mute, once-per-tab wake, note-receipt playback, horizontal overflow, and agent-scoped Axe checks.
- GitHub Site Agent Quality: [run 31971289604](https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/31971289604) completed successfully, including unit tests, the 60-case gate, production build, frozen preview, protected 10-case canary, and browser proof.
- Live production-browser proof passed the same desktop and mobile checks. Real mobile Chromium decoded and advanced replay to 0.448 seconds, note-receipt signature to 0.447 seconds, and wake audio to 0.447 seconds.
- Live analytics proof observed `agent_signature_replayed` reaching the existing GA4 queue with only `/writings` and `agent_controls`; no visitor content was included.
- Live route checks: `/`, `/projects/tooth-fairy-network/draw-with-tanda`, `/projects/clinicalguard`, `/writings`, `/hackathons`, `/robots.txt`, `/sitemap.xml`, and both audio URLs returned HTTP 200.
- Vercel inspection reported `Ready` with the production alias active. The error-level one-hour log scan returned no entries.

## Rights boundary

The existing unresolved public-use clearance note for the DJ Clue master remains unchanged. This release is a measured personal-site prototype, not an advertisement or cross-platform asset.
