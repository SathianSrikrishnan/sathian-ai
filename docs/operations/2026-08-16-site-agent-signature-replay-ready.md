# Site-agent signature replay readiness receipt

Date: 2026-08-16
State: Verified locally on canonical `main`; not pushed or deployed

## Prepared change

- Added a visibly labelled `Replay signature` control to the open site agent.
- Each deliberate press restarts the complete signature through the existing audio path.
- The control is disabled when the visitor's persisted sound preference is muted.
- Each press emits `agent_signature_replayed` with only the current page and `placement: agent_controls`.
- Existing automatic behavior is unchanged: the short wake sting remains once per browser tab and the complete signature remains attached to a durable note receipt.

## Verification evidence

- Red-green feature test: targeted site-agent sound suite, 4/4 passing after the expected missing-control failure.
- Full unit suite: 55 files, 384 tests, zero failures.
- Next.js optimized production build: exit 0.
- Production-server browser verification at desktop 1440 × 1000 and mobile 390 × 844: two deliberate presses produced two full-signature playback attempts and two privacy-safe analytics events.
- Muted-state disabling, audio asset HTTP 200 checks, same-tab wake limit, note-receipt playback, agent-scoped Axe, and horizontal-overflow checks passed.
- Real Chromium mobile playback decoded and advanced for wake, replay, and note-receipt audio.

## Release boundary

Production remains at the previously recorded sound release. A fresh explicit deploy request is required before this replay control is pushed or made live. The unrelated untracked publishing draft was preserved untouched.

The existing unresolved public-use clearance note for the DJ Clue master remains unchanged. This addition is treated as a measured site prototype, not advertising or a cross-platform asset.
