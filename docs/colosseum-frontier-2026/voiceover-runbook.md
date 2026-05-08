# Voiceover Runbook V1

Purpose: make recording or ElevenLabs generation fast and editable.

## Recommended Setup

Use two voices:

- Pitch: Tanda Faye. Either ElevenLabs/HeyGen-style generated voice or Sathian scratch read transformed later.
- Technical walkthrough: Sathian or a neutral narrator. A real founder/builder read is strongest here.

Do not record either video as one long take. Use the chunks in the Colosseum hub or `src/remotion/colosseum/voiceover.ts`.

## Folder Structure

- Raw recordings: `public/colosseum-frontier-2026/audio/raw/`
- Processed final voice clips: `public/colosseum-frontier-2026/audio/processed/`
- ElevenLabs exports: `public/colosseum-frontier-2026/audio/elevenlabs/`

## Recording Rules

- Record in a quiet room, no music.
- Leave half a second of silence before and after each take.
- Use the exact filename shown in the production hub.
- One chunk per file.
- If a take feels wrong, record another with `-take2` before the extension.
- MP3 is the default for ElevenLabs. WAV is fine for raw Sathian recordings.

## Filename Examples

- `pitch-p01-tanda-open-v1.mp3`
- `pitch-p05-solana-under-magic-v1.mp3`
- `technical-t03-anchor-program-v1.mp3`

## ElevenLabs Path

If using ElevenLabs:

1. Add `ELEVENLABS_API_KEY` and `VOICE_PIN` to `.env.local`.
2. Optional: add `TANDA_ELEVENLABS_VOICE_ID` to avoid typing the voice ID each time. If this is missing, the generator uses the app's existing default ElevenLabs voice for scratch timing only.
3. Restart the dev server after changing env values.
4. Open `/toothfairy/colosseum/run`.
5. Enter the Tanda voice ID and Voice PIN.
6. Click `Generate pitch clips`.
7. Generated MP3s land in `public/colosseum-frontier-2026/audio/elevenlabs/`.
8. Keep the technical walkthrough in Sathian's real voice unless there is a strong reason not to.

The local generation endpoint is:

```text
POST /api/toothfairy/colosseum/voiceover
```

It accepts:

```json
{
  "kind": "pitch",
  "voiceId": "ELEVENLABS_VOICE_ID",
  "limit": 6
}
```

Send the voice PIN in the `x-voice-pin` header.

PowerShell helper:

```powershell
.\scripts\generate-colosseum-voiceovers.ps1 -Kind pitch -Limit 6
.\scripts\generate-colosseum-voiceovers.ps1 -Kind technical -Limit 6
```

To force a specific Tanda voice:

```powershell
.\scripts\generate-colosseum-voiceovers.ps1 -Kind pitch -VoiceId "ELEVENLABS_VOICE_ID" -Limit 6
```

Direct ElevenLabs helper, useful when the local dev server is stale:

```powershell
node .\scripts\generate-colosseum-voiceovers-direct.mjs --kind pitch --limit all
node .\scripts\generate-colosseum-voiceovers-direct.mjs --kind technical --limit all
```

## Sathian Recording Path

If recording yourself:

1. Record the technical walkthrough chunks first.
2. Record a scratch pitch read second, even if Tanda will be generated later.
3. Use the scratch pitch read to lock timing and edit rhythm.
4. Replace with Tanda voice after the visual cut feels right.

## What Codex Needs

Minimum to assemble timing:

- `technical-t01` through `technical-t06`, even as scratch audio.
- `pitch-p01` through `pitch-p08`, either scratch Sathian read or generated Tanda voice.

Minimum to make the submission feel polished:

- Final Tanda opening and close.
- Final technical narration.
- Captions generated from the final script.
