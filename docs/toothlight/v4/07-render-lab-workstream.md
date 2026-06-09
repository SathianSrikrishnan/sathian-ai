# Toothlight Render Lab Workstream

Date: 2026-05-26
Status: product winner wired into Make, lab remains internal
Route: `/toothlight/render-lab`

## Current implementation decision

Date: 2026-05-27

Story Artifact / 3D Toothlight Charm is the approved first product render path for `/toothlight/make`. Memory Polish remains the trust-control lane for comparison and prompt tuning, but it is not the default parent-facing AI action.

The product path now uses a shared render contract in `src/lib/toothlight/product-render-mode.ts`. The Make flow sends the approved product render mode id to the enhance route, and the server builds the product prompt from that validated mode id. This avoids depending on arbitrary client prompt text for signed-in production users while still allowing the internal preview lab to stage prompt overrides in protected preview contexts.

Review path:

1. Open `/toothlight/make`.
2. Add one plain source photo.
3. Draw a small mark or upload a drawing layer.
4. Keep the default Light Style for the first pass.
5. Render AI final image.
6. Confirm the child remains recognizable and the original memory remains available.
7. Save the Toothlight.
8. Open the saved share page.

## Style-specific object push

Date: 2026-05-27

The first multi-render review showed the correct product loop, but the outputs were too close to one another. The next iteration makes each Light Style a distinct object family rather than a color treatment over the same charm:

- Golden Locket: round gold locket pendant, Tanda pouch stitch, keeper map dot.
- Moon Window: frosted moon-window nightlight, Kkachi magpie feather, rooftop sky path.
- Storybook Velvet: storybook page charm, Anna Bogle clover leaf, shelf-map line.
- Rainbow Room: transparent tooth-shaped acrylic charm, network prism node, confetti orbit.
- Pillow Spark: stitched pillow badge, Tanda wing stitch, bedtime sparkle pin.
- Family Lantern: folded family lantern, Daga mouse tracks, moon calendar square, note ribbon.

The server now validates the selected Toothlight Light Style and builds the production prompt from that style's object form, composition directive, drawing integration rule, story motifs, and fairy-world carry cue. The drawing layer is explicitly treated as structural information for the object: edge, seam, inlay, embroidery, etching, paper cut, or neon tube. This should reduce repeated locket outputs and make abstract drawings matter more.

## Research takeaways

Samsung Galaxy AI positions Generative edit as object move/delete plus background fill, with original comparison and AI watermarking. It also has Sketch to image, where drawn input is generated into the photo rather than treated as a raw sticker.

Google Photos Magic Editor and newer conversational editing emphasize complex edits from simple gestures or prompts, including subject/background changes, multi-step requests, and transparency through C2PA/IPTC/SynthID metadata.

For Toothlight, the relevant lesson is not the exact feature set. The saved render should make a real memory feel materially changed while preserving who and what the parent recognizes. The product also needs transparent AI-edit posture later, especially if final images are saved or minted.

Local S24 sample review added a stronger rule: the good outputs are not overlays. They perform whole scene/object reconstruction. A sketch becomes a finished 3D object, poster, soft illustration, watercolor, or material painting with changed lighting, surface, background, and depth. Toothlight should use that pattern while anchoring the child's real identity and the original memory.

The current CSS mock is rejected as final output. It is useful only as a layout placeholder because it still reads like a photo with marks over it. The next approval round must use real generated images from the same plain source plus separate drawing layer.

Sources:

- Samsung Photo Assist support: https://www.samsung.com/ca/support/mobile-devices/how-to-use-photo-assist-to-edit-photos-on-samsung-galaxy-devices/
- Google Photos conversational editing and C2PA support: https://blog.google/products-and-platforms/products/photos/ai-photo-editing-google-photos/
- Google Photos AI edit transparency: https://blog.google/products-and-platforms/products/photos/ai-editing-transparency/
- Google Photos Content Credentials help: https://support.google.com/photos/answer/16496549

## Mode design

Memory Polish:
The Galaxy-style direction. The photo remains inspectable, but the whole frame gets remastered with locket glass, tooth focus, material grain, and interpreted enamel drawing marks.

Story Artifact:
The photo and drawing become a Tooth Fairy Network object: a found memory relic with paper, glass, map paths, and keeper-world material. This is the strongest world-building candidate. The S24 reference family is 3D Toothlight Charm: a complete object treatment, not a sticker pass.

Future Glow:
A symbolic time capsule. It must be explicitly not a prediction. The child remains present-day; future is shown through sealed-date glow, reflections, and note/capsule material.

Smile Wish:
A gentle full-smile wish visualization. It must be explicitly not a medical or dental prediction. The smile hope is storybook symbolism around the real lost-tooth moment.

Additional S24-inspired comparison families:

- Pop Keepsake: high-contrast poster/webtoon lane for obvious transformation.
- Soft Storybook: soft illustration, watercolor, and oil-painting lane for emotional warmth.
- Time Capsule Glow: glass, calendar geometry, and sealed-note symbolism for unlock-date memory.

## Controlled approval round

Use local-only browser inputs in `/toothlight/render-lab`:

- Input 1: one plain source JPG with no annotations, filters, stickers, or previous Toothlight treatment.
- Input 2: one separate child drawing layer or drawing image.
- Output: four real generated images from the exact same pair.

Recommended source set:

- Smile close-up: highest-trust identity and lost-tooth test.
- Face memory: confirms the child stays recognizable beyond the mouth.
- Tooth object: tests Story Artifact without identity risk.
- Parent-child memory: tests emotional keepsake value and family context.

Approval rule: reject any output where the whole image does not materially change, the child drawing is pasted unchanged, the child is not recognizable, or the parent cannot immediately understand why the image is worth saving.

## Evaluation checklist

- Preserve child identity, source memory, pose, tooth, and family context.
- The whole image changes materially, not just a border or sparkle pass.
- Child drawing is interpreted into the render language instead of pasted unchanged.
- Parent can immediately understand why the saved image is more valuable than the source.
- The final image avoids generic filters, stickers, watermarks, fake UI text, and unrelated fantasy additions.
- Future Glow remains not a prediction of the child's future face.
- Smile Wish remains not a prediction of dental or medical outcome.

## Next connection point

Keep this isolated from save/auth/family note flow until a render direction wins. Once selected, the Make flow should pass:

- source photo;
- transparent drawing layer;
- flattened composition;
- chosen render mode;
- final prompt and negative prompt;
- metadata flag for AI edit transparency, including C2PA-compatible posture when provider support is available.
