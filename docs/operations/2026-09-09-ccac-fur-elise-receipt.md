# CCAC four-song release

## Authorized change

Owner explicitly requested Für Elise in the existing piano playground, “For students of Mary Ann Hawkes”, removal of the redundant Practice Studio promotion, credits in Excel, and production deployment when ready. Existing River video, Canon and Little Lanterns remain. No new original replacement, teacher message, student data or purchased music.

## Delivered assets

- `/ccac?song=fur-elise`: 905 notes, 72 BPM, 131.667 seconds, source MIDI from the public-domain Mutopia edition https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=931 (Beethoven, typeset by Stelios Samelis).
- Shared sampled piano and native MP3 transport with synchronized falling notes and active keys; short Für Elise bars keep note names visible. Controls and visual design retained.
- Four links: River Flows in You, Canon in D, Für Elise, Little Lanterns. River remains an external video, not a native score tutorial.
- `/ccac-vibe-piano/music-credits.xlsx`: composer/contributor/source/licence/transformation register. Excel export visually checked, download validated. Practice route remains accessible; only its landing-page promotion was removed.

## Required security compatibility update

The normal release gate discovered critical Next.js vulnerabilities and refused release. Minimum patched version 15.5.24 is pinned. Sources: https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4 and https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36 . No audit suppression or gate weakening.

Compatibility changes await cookies, headers and dynamic route parameters; retain existing authentication checks and responses; move native external packages to the current config key; constrain tracing to this worktree; use Next's ES2017 TypeScript target. Remove the experimental worker-thread override because Next 15 static generation cannot clone this site's webpack function. React stays at 18.3 and unrelated direct dependencies are unchanged. Existing high/moderate dependency backlog is not represented as resolved.

## Evidence and release state

- Focused music/import suite: 9 passed.
- Four-song verifier on desktop 1280×1000 and mobile 390×844: actual moving transforms, score/key synchronization, native audio ready/unmuted, pause/resume, half speed, seek/replay/ending, no overflow/JS errors, dedication and Excel download all pass. AudioContext deliberately disabled to catch the previous silent-Web-Audio failure. Piano asset is non-silent (peak 0.89, RMS 0.1106). This does not measure the user's physical speakers.
- Local screenshot/JSON proof and complete provenance: `C:\Users\sathi\Projects\piano-community-studio\evidence\2026-09-09-candidate-*` and project `docs/2026-09-09-fur-elise-release.md`.
- Full `npm run release:verify`: PASS — 427 tests, 60/60 evaluation, no critical production dependency findings, production build, public surface/metadata/security checks and desktop/mobile sound checks. Local log: `tmp/ccac-fur-elise-release-gate-final.log`. Earlier failed logs are retained. Security compatibility commit: `ab55d1e`.
- The first online run failed at clean install due to three missing lock entries. Regenerated with the workflow's npm 10.8.2, verified a clean-install dry run, and reran the complete local gate successfully. Correction commit `968cc71`; no existing dependency versions changed in the correction. Final full log: `tmp/ccac-fur-elise-release-gate-lockfile.log`.
- Protected preview: PASS, including clean install, dependency audit, unit tests, 60-case evaluation, build, 10-case canary, public surfaces and mobile sound. https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/34416476248
- **Production source:** `968cc710a46a8cef8d12dd9f4c05c245b1c050cd`. Deployment `dpl_4LaR7koGwuVLM4SxyAGmVt2UScpM`, https://sathian-5eawohwwa-sathiansrikrishnans-projects.vercel.app , aliased to https://sathian.ai . Status READY.
- **Live verification: PASS.** All three native songs on desktop/mobile: advancing audio clock, changing note transforms, exact score/key synchronization, pause/resume, half speed, seek/replay/ending, no overflow or JS errors. Actual in-app browser and live screenshots confirmed Für Elise and the dedication. `evidence/2026-09-09-live-four-songs-verification.json` in the piano project.
- Required public routes, retained Practice Studio route, exact SHA-256 matches for score/MP3/workbook, and unauthenticated Studio 401 protection passed. `evidence/2026-09-09-live-release-http.json`. Deployment-scoped error log query returned no errors; `tmp/ccac-live-error-logs.txt`.

This release is complete. Resume on owner/teacher feedback. River's native tutorial remains an open separate music-source task; this release does not claim it has been converted.

Preflight: canonical main and origin/main both `0e3249dac1d83f0ed9b1093229258173e091d085`. Unrelated untracked launchpad folders and tmp data preserved. Prior deployment remains rollback reference in ACTIVE-WORKTREE.md until verification completes.
