# Site-agent signature replay design

## Decision

Add one compact `Replay` control to the open site agent, with the explicit accessible name `Replay complete signature`. It is an explicit visitor action, not an additional automatic trigger. Each press restarts the complete signature; the existing automatic wake sound remains limited to once per browser tab.

## Interaction and data flow

- Place the secondary action with the agent controls so it remains available without competing with the composer.
- Disable it while the persisted sound preference is muted. The existing sound toggle remains the single way to re-enable audio.
- Route playback through the existing audio element and `playAgentSound('noteDelivered')` path so volume, interruption, and browser handling stay consistent.
- Emit `agent_signature_replayed` with only `page` and `placement: agent_controls`. Do not include identity, chat text, contact details, or filenames.

## Failure behavior

Browser playback rejection remains silent and does not block the agent. The visible interface never treats sound as confirmation of a message or note.

## Verification

Use a red-green unit test for the control, complete-signature playback path, mute state, and analytics event. Then run the full unit suite, production build, and desktop/mobile browser checks for playback, accessibility, and horizontal overflow.
