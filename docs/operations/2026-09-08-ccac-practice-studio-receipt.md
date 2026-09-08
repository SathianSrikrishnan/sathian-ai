# CCAC Piano Practice Studio

Owner explicitly requested building and featuring a reusable song-to-piano experiment, keeping River's performance beside the game, and researching existing free/commercial alternatives.

## Delivered scope

- New static page `/ccac-vibe-piano/practice.html`, featured prominently on `/ccac`. Existing River/Canon/Lanterns playback remains intact.
- Side-by-side River reference video and piano exercise on desktop; stacked mobile layout. Video connects to YouTube only after Load performance. Starting a lesson sends a pause command to that known video player.
- Local MIDI format 0/1 import with tempo-map and sustain handling, bounded parsing, percussion omission and clear range/format errors. File bytes are not uploaded, stored or published.
- Short phrases, speed, repeat, upper/lower pitch split, sampled piano audio and a correct-key-following game using pointer/computer keys. Chord pitches can be tapped sequentially. No microphone, connected-MIDI-keyboard input, verified hands/fingers or student records.
- Little Lanterns and Canon are named demo exercises. River's MIDI is not bundled: a supplied file can load into this exact game. No unrelated melody is labeled River.
- Phrase audio is rendered locally, then played through native audio with the visual clock tied to media position. Original Mutopia and Salamander attribution is linked from the studio.

## Evidence

- Eight focused music/import tests pass: complete Canon import retains 1,956 notes, running status, header bounds, tempo changes, sustain, phrase clipping, chord grouping, pitch range and WAV sample/header checks.
- Candidate desktop 1440×1050 and mobile 390×844 browser tests pass: incorrect key holds position, correct key advances, complete imported phrase succeeds, local Canon file loads, malformed file reports an error without losing the prior lesson, native audio is unmuted with a measured nonzero rendered waveform, half-speed works, previous/next phrase works, no page errors, no document overflow and no network writes.
- Screenshots inspected. Evidence: `piano-community-studio/evidence/2026-09-08-candidate-practice-verification.json` and dated practice screenshots. Repeatable browser verifier: `scripts/verify-practice.cjs`.
- Reusable `$song-to-piano-practice` skill initialized and passed the official validator; installed at `C:\Users\sathi\.agents\skills\song-to-piano-practice\SKILL.md`, with source in `piano-community-studio/skills/song-to-piano-practice`.
- Full site release gate and production readback recorded below after completion.

## Background and next scope

This category already exists. [Synthesia](https://www.synthesiagame.com/) offers a paid unlock; [PianoBooster](https://www.pianobooster.org/) is free/open source. [Sightread](https://github.com/sightread/sightread) provides a free open-source snapshot but moved new development private in March 2026. [Basic Pitch](https://basicpitch.spotify.com/) is a free upstream audio-to-MIDI tool that recommends correcting its output.

Detailed context and resume contract: `piano-community-studio/docs/2026-09-08-practice-studio-brief.md`. The shipped conversion is MIDI → practice, not a claim that any recording produces an accurate lesson automatically. Teacher feedback, a supplied River MIDI, physical-keyboard input and transcription are separate next steps. No purchases, teacher messages, student data collection or monetization added.
