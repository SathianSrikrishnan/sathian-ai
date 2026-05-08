# TFN Hero-Integrated Ritual Animation V10

Date: 2026-05-05
Status: Safe preview implementation

## Goal

Move the Tanda ritual from a standalone video loop into the homepage hero product block. The hero itself becomes the stage: the child photo, tooth badge, live memory card, and Smile Fund card are real interface elements, while Tanda and the magical transition layer explain the product.

The animation should make the page need fewer words.

## Approved Direction

- Tanda flies into the hero product block.
- The visible tooth badge in the child photo becomes the source object.
- Tanda carries the tooth into a small magical save point.
- The save point creates two outcomes: the live memory card and the Smile Fund card.
- A small starter gift travels into the Smile Fund.
- The final resting state resembles the current homepage hero, not a separate explainer panel.

## Architecture

Use a hybrid web animation:

- Real HTML for the family image, tooth badge, memory card, and Smile Fund card.
- CSS motion layer for Tanda sprites, tooth handoff, save glow, trails, and coin.
- No production homepage wiring yet.
- Safe preview route: `/animation/tanda-hero-ritual`.

This keeps the asset interactive and responsive, and avoids baking homepage text/cards into video.

## V10 Preview Notes

Implemented:

- `src/components/toothfairy/home/tanda-hero-ritual-stage.tsx`
- `src/components/toothfairy/home/tanda-hero-ritual-stage.module.css`
- `src/app/animation/tanda-hero-ritual/page.tsx`

Current tradeoffs:

- The motion is still CSS/keyframe-based, not a rigged character animation.
- Tanda's body language uses the existing pose pack; more pose generation can improve the handoff.
- The hero cards are animated as UI elements, which is the right final architecture, but timing and exact paths will need another pass after visual review.

Next polish targets:

- Make Tanda's pickup from the child tooth badge more natural.
- Tune the generator/save point so it feels premium, not gadgety.
- Improve the split from save point into memory card and Smile Fund card.
- Decide whether the Smile Fund endpoint needs a visible piggy-bank object or whether the fund card itself is enough.

## V11 Direction Pass - 2026-05-05

User feedback:

- Tanda should enter from the text side of the page, not from the far right.
- The tooth pickup must be the first readable action.
- The save structure needs to be more obvious.
- The loop should feel like a short hero moment, closer to five seconds than a long explainer.
- Future quality depends on more Tanda flight/in-between poses.

Implemented in the safe preview:

- Retimed the CSS loop from 12 seconds to 5.8 seconds.
- Changed Tanda's entrance so she comes from the left/text side of the hero.
- Added a source-tooth pickup pulse/ring so the child-photo tooth reads as the object being collected.
- Moved the save station lower and made it more like a small premium capture tray with a glowing slot.
- Retimed the tooth, card split, coin path, and final Smile Fund reaction around the shorter loop.

Next pose-pack workflow:

- Generate 6-10 more Tanda in-between poses for the hero-specific movement path:
  - left-side entrance flying pose
  - braking/hover pose near the child tooth
  - reaching into the photo tooth badge
  - carrying tooth downward
  - placing tooth into the save station
  - looking at the memory/fund split
  - guiding starter gift toward the fund
  - celebratory exit

This should become a dedicated hero pose pack, separate from the standalone ritual video pose pack.

## V12 Hero Pose Pack Pass - 2026-05-05

Generated four hero-specific Tanda pose sprites from the approved Tanda reference:

- `public/toothfairy/animation/hero-pose-pack/tanda-hero-01-rainbow-entry.png`
- `public/toothfairy/animation/hero-pose-pack/tanda-hero-02-brake-hover.png`
- `public/toothfairy/animation/hero-pose-pack/tanda-hero-03-carry-down.png`
- `public/toothfairy/animation/hero-pose-pack/tanda-hero-04-place-save.png`

Notes:

- First generation pass had charming poses but baked in cream/rainbow backgrounds.
- Second pass used stricter green-screen prompts and produced usable transparent cutouts.
- Entry and carry poses are materially better for a fairy-like left-side descent.
- Hover/place poses are usable for this iteration, though future passes should further refine hand-to-tooth placement.

Preview changes:

- Slowed the hero loop from 5.8 seconds to 7.2 seconds.
- Replaced early Tanda movement with the new hero-specific sprites.
- Added a soft pickup trail from the text side toward the child tooth and down to the save station.
- Kept the current save/fund/card structure so the next review focuses on Tanda's motion and stage clarity.

## V13 Flight Rig Pass - 2026-05-05

User feedback:

- The new pose is promising, but the motion still reads as choppy.
- Tanda appears to enter backwards.
- This hero animation is now considered a launch-critical product surface, not a decorative asset.

Implemented in the safe preview:

- Moved Tanda's pose sprites into one shared `tandaFlight` wrapper so the character follows a single continuous rainbow arc.
- Flipped the entry sprite so Tanda faces into the hero as she comes from the text side.
- Changed pose animations to crossfade and locally rotate/scale inside the flight wrapper instead of each pose having its own position path.
- Added a subtle wing/aura pulse to make the movement feel more fairy-like without adding visual clutter.
- Kept the story beats unchanged so this review isolates movement smoothness.

Next quality step:

- Generate a larger hero-only Tanda pose pack with turn frames and hand states: entry-facing-right, braking, reaching, carrying, placing, hand-empty-after-drop, guiding, and celebrate. This will reduce the remaining "paper doll" feeling that CSS alone cannot fully solve.

## V14 Pickup And Coin Timing Pass - 2026-05-05

User feedback:

- V13 is better, but the highest-value polish is still Tanda's flow.
- The tooth pickup, tooth drop-off, and coin transition need smoother in-between motion.

Implemented in the safe preview:

- Added a small carried-tooth layer inside Tanda's flight wrapper so the tooth stays attached to her through pickup and vanishes at the save point.
- Reduced the separate floating tooth to a brief deposit shimmer, making the handoff less busy.
- Extended the pose crossfades around hover, carry, and place so fewer transitions pop.
- Retimed the coin trail and coin flight so the Smile Fund beat follows the save/memory beat more clearly.

Next quality step:

- Continue with a generated hero pose pack, especially a natural reach pose, a hand-empty-after-drop pose, and a turn toward the Smile Fund. Those poses are the difference between "pleasant prototype" and launch-quality character performance.

## V15 Transformation And Piggy Endpoint Pass - 2026-05-05

User feedback:

- The tooth-to-digital transformation is not clear enough yet.
- After Tanda's flow is improved, the piggy bank needs to be visible as part of the Smile Fund outcome.
- The transformation should slow down enough for the viewer to understand it.

Implemented in the safe preview:

- Added a glowing story-chip layer that forms around the tooth after the save/drop moment, with a small tooth mark and story-line marks inside the tile.
- Retimed the memory-card reveal so the story chip travels toward the card before the full card resolves.
- Added the approved soft piggy-bank cutout as the visible Smile Fund endpoint.
- Retimed the coin path so it travels into the piggy bank slot instead of disappearing into the abstract chart panel.
- Added a gentle piggy-bank glow on deposit so the starter-gift beat reads more clearly.

Next quality step:

- Keep Tanda motion as the top priority, but now evaluate the whole product story: tooth source, save/digital card, piggy-bank fund endpoint. The transformation can be slowed further if the v15 read still feels rushed.

## V16 Story Clarity Cleanup - 2026-05-05

User feedback:

- The piggy bank should stay on screen as part of the hero composition, not appear only at the end.
- The old NFT-card style is confusing now that the hero story is memory plus Smile Fund.
- Tanda should visibly hold or guide the coin before it deposits, instead of the coin floating beside her.
- The transformation base needs to read more like a secure lock/vault.

Implemented in the safe preview:

- Made the piggy bank persistent in the bottom-right hero area and kept its deposit glow as the animated reaction.
- Replaced the old image/hash-like memory card with a simpler live-memory card showing a protected tooth keepsake.
- Added a visible lock/latch to the save base so the drop-off reads as a secure memory vault.
- Slowed the story-chip transformation and memory-card resolve so the digitization beat has more time.
- Added a held-coin layer inside Tanda's flight wrapper, then retimed the separate coin to appear only as the final transfer into the piggy bank.

Next quality step:

- Resume the larger Tanda pose-pack generation. The stage now has clearer endpoints, so new reach/turn/hand-empty/coin-guide poses can be judged against the correct hero composition.

## V17 Recalibration To Hologram Base - 2026-05-05

User feedback:

- The lock/vault structure was the wrong transformation object; the original direction was a hologram tooth on a base.
- There were too many tooth objects during pickup, making the action feel choppy and confusing.
- The hero should have two stationary endpoints: the transformation base near the child/photo side and the piggy bank in the opposite bottom corner.
- Only two outputs should come out of the transformation base: the live memory/NFT placeholder and the Smile Fund card.

Implemented in the safe preview:

- Removed the extra held-tooth overlay from Tanda's flight rig to reduce duplicate-tooth confusion.
- Removed the intermediate story-chip layer from the DOM.
- Reworked the save object back into a stationary hologram platform with a glowing tooth projection instead of a locked chest/vault.
- Moved the transformation base lower and closer to the child/photo side.
- Retimed Tanda's path so she drops toward the platform and pauses there before moving to the fund/piggy-bank beat.
- Retuned the output trails so only the memory card and Smile Fund card emerge from the base.
- Kept the piggy bank persistent as the Smile Fund endpoint.

Next quality step:

- Review the simplified story read first. If the base placement and two-output structure are approved, return to the expanded pose-pack generation for smoother reach, drop, pause, coin pickup, and coin guide frames.

## V18 Capture Base And Three Outputs - 2026-05-05

User feedback:

- The reference base from the “Capture & Mint” image is the clearest transformation object.
- The base should stay near the bottom-left of the photo/product stage while the Solana pig stays in the bottom-right.
- Tanda may need a phone/camera beat, either flying in with it or pulling it out during capture.
- From the base, only three things should emerge: the NFT/live memory, the Smile Fund card, and a coin that Tanda guides into the piggy bank.

Implemented in the safe preview:

- Removed the separate travel-tooth element from the DOM to avoid the double-tooth read.
- Added a temporary phone/camera overlay inside Tanda's flight wrapper during the capture beat.
- Shifted the hologram base further toward the lower-left of the stage.
- Retuned Tanda's arc so she descends closer to the base before moving toward the piggy-bank beat.
- Changed the memory card copy to read as the NFT/live keepsake output.
- Kept the base and piggy bank as persistent stage anchors, with only the NFT card, Smile Fund card, and coin emerging from the base.

Next quality step:

- If the phone/camera concept reads well, generate a real Tanda phone/camera pose rather than relying on the overlay. Also generate dedicated in-between poses for pickup, drop, pause at base, coin pickup, and coin guide.

## V19 Bottom-Row Anchor And Phone Timing Pass - 2026-05-05

User feedback:

- The base and pig should be aligned along the bottom of the photo/hero stage.
- The base needs to sit lower and read as the symbolic blockchain object.
- The phone should appear later as Tanda approaches the base, and she should seem to hold it deliberately.
- The Smile Fund card and NFT card should rise while the pig and base remain visible.

Implemented in the safe preview:

- Lowered the hologram base and piggy bank into a shared bottom band.
- Added a subtle Solana-colored glyph treatment to the platform so it reads more like a blockchain base, not just a generic glow.
- Shifted and narrowed the Smile Fund card so the pig remains visible in the final state.
- Delayed the phone overlay until Tanda nears the base and held it on screen longer during the capture beat.
- Retuned output trails and card movement from the lower base position.

Next quality step:

- Generate a real base image/asset pack and a real Tanda phone pose. The CSS base is now a placement/timing proxy; it should be replaced with a polished rendered base once the layout is approved.

## V20 Expanded Existing Pose Rig - 2026-05-05

User feedback:

- Tanda's v19 path bends backward after pickup and needs a cleaner left-to-right arc.
- The phone should appear in her hand during the approach/pause at the base.
- The animation needs 3-4x more Tanda frames for pickup, phone/photo, magic pause, coin guide, and wave exit.
- Tanda should wave goodbye before leaving the loop.

Frame count:

- Active in v19: 6 Tanda poses.
- Available in repo before new generation: 14 usable Tanda PNG poses.
- Active in v20: 11 Tanda poses.
- Target for final hero animation: roughly 22-30 Tanda frames, including real phone/camera hand poses and smoother flight in-betweens.

Implemented in the safe preview:

- Added five existing Tanda poses to the hero rig: reach, hand-retract, follow-through, coin guide, and exit.
- Extended the loop from 7.2s to 8.6s to create a readable pause at the base.
- Reworked Tanda's flight path so it no longer moves forward and then visibly backs up.
- Retimed pose crossfades around pickup, base pause, coin guide, and wave/exit.
- Added a wave/exit pose at the end of the loop using the existing `tanda-06-celebrate-exit` frame.

Next quality step:

- Generate a new hero-specific pose pack with 12-16 additional frames: phone in left hand, tooth in right hand, reach/pickup, lowering to base, photo pause, magic pause, coin pickup, coin carry, front-facing wave, and exit.
