# Real-audio verifier readiness

The real-mobile sound check verifies that the expected MP3 decodes, is playing,
and advances beyond 50ms. Replay and note-signature checks also require an
unmuted media element. The old fixed 550ms sleep was not a documented
click-to-sound latency requirement; it was introduced with the original decode
verifier, before the chat bundle became intent-loaded.

Two hosted runs sampled actively playing, error-free wake audio at 31ms and
14ms. A local native-media trace measured click → audio mount at 310–320ms and
click → `playing` at 350–373ms. Adding a controlled 400ms response delay moved
`playing` to 810ms; the same media then advanced normally. This reproduces how
a fixed click-relative sample can reject valid playback. The local trace does
not reconstruct the exact scheduling of the earlier hosted failures.

The verifier now polls readiness for at most five seconds. That is a test
completion deadline, not a new product latency target. The existing source,
decode, playing-state, unmuted-state and >50ms advancement assertions remain.
Decode errors return immediately to those assertions; a deadline failure
reports the actual media state. Application code and media files are unchanged.

A browser contract fixture uses the actual wake MP3 with native playback rate
zero. It proves that an unpaused, unmuted, error-free element whose clock does
not advance is rejected within a 300ms test deadline. Restoring rate one must
make the same native media pass. The positive app flows continue to use real
playback; no `play()` substitution is used in them.

Local verification passed desktop/mobile interaction and accessibility flows,
real wake/replay/note-signature decoding and advancement, and the stalled-media
rejection/recovery case. Browser speaker output was silenced only by a local
launch flag; media-element mute state and assertions were preserved. CI uses
its existing browser launch and must pass independently on the exact commit.
