# Site-agent signature replay readiness receipt

Date: 2026-08-16
State: Verified locally on canonical `main`; explicitly authorized for production deployment

## Prepared change

- Added a compact `Replay` control to the open site agent, with an explicit screen-reader label.
- Each deliberate press restarts the complete signature through the existing audio path.
- The control is disabled when the visitor's persisted sound preference is muted.
- Each press emits `agent_signature_replayed` with only the current page and `placement: agent_controls`.
- Existing automatic behavior is unchanged: the short wake sting remains once per browser tab and the complete signature remains attached to a durable note receipt.

## Existing architecture integration

| Existing path | Replay contribution | Parallel architecture added |
| --- | --- | --- |
| One `ChatWidget` mounted once from the root layout | One compact control inside the existing panel | No |
| One `agentAudioRef` element plus `playAgentSound` | Calls `playAgentSound('noteDelivered')` | No |
| One `SITE_AGENT_SOUNDS` registry with two existing MP3s | Reuses `noteDelivered`; adds no asset | No |
| One persisted `soundEnabled` preference | Disables replay while muted | No |
| One `trackSiteEvent` wrapper for Vercel Analytics and GA4 | Adds the privacy-safe `agent_signature_replayed` event | No |

The audit found no new component provider, API route, dependency, storage key, audio element, or analytics client.

## Verification evidence

- Red-green feature test: targeted site-agent sound suite, 4/4 passing after the expected missing-control failure.
- Full unit suite: 55 files, 384 tests, zero failures.
- Offline site-agent evaluation: 60/60, zero knowledge gaps.
- Next.js optimized production build: exit 0.
- Production-server browser verification at desktop 1440 × 1000 and mobile 390 × 844: two deliberate presses produced two full-signature playback attempts and two privacy-safe analytics events.
- Muted-state disabling, audio asset HTTP 200 checks, same-tab wake limit, note-receipt playback, agent-scoped Axe, and horizontal-overflow checks passed.
- Real Chromium mobile playback decoded and advanced for wake, replay, and note-receipt audio.

## Release boundary

Production remains at the previously recorded sound release until the authorized push and deployment complete. The unrelated untracked publishing draft was preserved untouched.

The existing unresolved public-use clearance note for the DJ Clue master remains unchanged. This addition is treated as a measured site prototype, not advertising or a cross-platform asset.
