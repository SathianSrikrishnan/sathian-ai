# CCAC: Canon in D and River Flows in You

Owner authorized both high-quality songs, with Little Lanterns preserved as a secondary choice. This release extends the existing `/ccac` page.

## Shipped design

- Canon in D: default interactive player; complete four-voice Pachelbel score, 1,956 note events, 4:05 at 55 BPM; sampled Yamaha grand piano, synchronized falling notes and keys, seek, pause/resume, speed, and mobile scrolling.
- River Flows in You: Kassia's complete published performance of Yiruma's composition, with its original falling-note visuals and audio, through a user-activated YouTube player. It uses the video controls, not the custom playable keyboard.
- Little Lanterns: original 40-second CCAC melody retained as a secondary song link, upgraded to sampled grand piano.
- Song links: `/ccac?song=canon`, `/ccac?song=river`, `/ccac?song=little-lanterns`.
- No YouTube connection before the visitor selects River and presses Load performance. Source links remain available if YouTube blocks playback for a visitor.

## Sources and attribution

- Canon score: https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2047 — Michael Fischer v. Mollard, CC BY 4.0. Converted MIDI events and rendered original string parts on piano. Complete source archive and converter are in the owning `piano-community-studio` project.
- Piano samples: https://github.com/Tonejs/audio/tree/master/salamander — Alexander Holm, Salamander Grand Piano / Yamaha C5, CC BY 3.0. Twenty MP3 samples totaling 1,336,361 bytes; pitch-shifted between sample roots. Attribution and adaptation disclosed in the page's Music & piano credits.
- River: https://www.youtube.com/watch?v=owl5oyzchKk — Kassia Official Artist Channel; Yiruma composition. Metadata says public and embeddable. No video or recording copied to the site.
- Yiruma's performance: https://www.youtube.com/watch?v=7maJOI3QMu0.

## Candidate verification

- Full `npm run release:verify`: PASS; 63 files / 427 tests, 60/60 site-agent evaluation, production build, public surfaces, site-agent sound, critical audit threshold, and patch hygiene.
- Existing dependency backlog: 64 advisories (15 low, 30 moderate, 19 high), no critical findings; no dependency changes in this release.
- Two additional music-contract tests passed. Local syntax and eight HTTP/source checks passed.
- Browser: desktop 1280×1000 and mobile 390×844, using local release files under an intercepted canonical origin. This is candidate proof, not production proof.
- Canon: 20 samples loaded; real click starts nonzero audio; no note mismatch in 20 sampled checks away from boundaries. Maximum measured display lag: desktop 11.6 ms, mobile 6.7 ms. Pause clears all scheduled voices and signal. Seek, speed, ending, and original-song navigation passed.
- River: real click loads and plays unmuted; duration 237.641 s; 70/73 decoded frames during desktop/mobile capture; 1280×720 desktop and 640×360 mobile adaptive video. Actual video-control pause passed.
- Both viewport checks: zero document overflow, zero page errors. Screenshots reviewed.
- Evidence: `piano-community-studio/evidence/candidate-music-verification.json` and candidate desktop/mobile screenshots; verifier `scripts/verify-music-browser.cjs`.
- Diagnosis: YouTube rejected the localhost origin with an auth error, but returned OK and played under the canonical origin. Use the public URL for River review.

## Production verification

Pending deployment and fresh live-domain checks.
