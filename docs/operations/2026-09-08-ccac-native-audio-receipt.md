# CCAC: audible playback compatibility and River first

Owner reported Canon's timer moving without audible sound, requested River first, Canon second, Little Lanterns third, and asked about a simpler River learning view.

## Diagnosis and change

The existing in-app browser started Canon and reported a running Web Audio graph, 20 decoded samples and nonzero analyser signal. This does not prove sound reached the owner's speakers. The device-specific cause was not reproduced; it must not be described as conclusively diagnosed.

Canon and Little Lanterns now play deterministic 192 kbps MP3 renders through native browser audio. Their score visuals use the media element's actual playback position. Song playback no longer needs an AudioContext, sample downloads or thousands of scheduled live voices. Pointer-played keys still use Web Audio. The renders preserve the same credited Mutopia score / original melody and Salamander samples, normalized to a clear level; no River recording is copied.

River is the default and first link, Canon second, original Little Lanterns third. The existing River performance remains user-activated, with a visible half-speed instruction. Each rendered song has an audio-only link and visible loading/error feedback. Versioned app and catalog imports avoid stale-browser mixing.

## Verification

- Before change, deliberately disabling AudioContext made the old player fail. After change, actual in-app playback succeeds with AudioContext disabled, unmuted native media, readyState 4, no media error and moving synchronized keys.
- Local desktop/mobile regression passes start, seek, pause, half speed, replay, completion, original playback, River default/order, no unsolicited iframe, no overflow and no page errors. Evidence: `piano-community-studio/evidence/2026-09-08-candidate-native-verification.json`; dated desktop/mobile screenshots reviewed.
- The local server initially lacked byte-range responses, preventing native audio seeking. Added audio-only range support and reran successfully; production uses Vercel's static-file range support.
- Two music contract tests, syntax and eight local HTTP/source checks passed. Both complete MP3 files decode without errors. Canon: 5,892,640 bytes / 245.45 seconds; Little Lanterns: 961,767 bytes / 40 seconds. Deterministic renderer: `piano-community-studio/scripts/render-piano.mjs`; measurements: `evidence/rendered-piano.json`.
- Complete site gate and production readback pending below.

## River learning view

A child-oriented custom view would benefit from a simpler arrangement, one hand at a time, half-speed and short repeated phrases. A video embed cannot supply reliable individual-note data. An accurate score and documented permission for website reuse are needed before shipping that version; the owner called this optional. The current performance remains the main attraction.

Sources: [YouTube playback speed](https://support.google.com/youtube/answer/7509567), [publisher's Easy Piano catalogue](https://www.halleonard.com/search/search.action?dt=item&songNumber=207016&songTitle=River+Flows+In+You&sortBy=popularcategory), and prior source/provenance receipt `2026-09-07-ccac-two-songs-receipt.md`. No purchase, message or music-rights representation added.
