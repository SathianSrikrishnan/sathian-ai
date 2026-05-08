# Tanda Fae Image Production Pack

Status: first production prompt pack
Date: 2026-05-07

Story: **Tanda Fae and the Tooth Fee**

Goal: generate deploy-ready storybook images for Story 2 while preserving the strongest parts of the live site's existing visual direction, especially Tanda's father and the soft cinematic 3D storybook look.

## Current Generator Status

The local repo has the reference images and story assets.

The Gemini API key file exists locally at the user level, but the `nano-banana` command is not currently installed on this machine path. This pack is ready for generation once the generator is installed or connected.

Recommended model/settings once available:

- model: `gemini-3.1-flash-image-preview`
- size: `2K`
- story frames: `9:16`
- character expression sheet: `16:9`
- output format: PNG

## Approval Gates

### Gate 1: Character And Style Proofs

Generate and approve these first:

1. Young Tanda full-body reference.
2. Young Tanda expression sheet.
3. Tanda's father updated shipbuilder reference.
4. The boy across the water.
5. Shipyard world reference.

Decision criteria:

- Young Tanda must feel related to adult Tanda, not like a different franchise.
- Father should preserve the existing live-site father quality and warmth.
- The tooth-carrying object should be a carved oak tooth-keeper, not a bare tooth on string.
- The world should feel handmade: oak, wool, leather, rope, sailcloth, smoke, sea.

### Gate 2: Six Anchor Frames

Generate only these after Gate 1 approval:

1. Frame 02: shipyard world.
2. Frame 04: Tanda gets stuck in pine pitch.
3. Frame 10: father asks permission to carry the tooth.
4. Frame 19: father kneels to the boy across the water.
5. Frame 23: first Toothlight in the oak keeper.
6. Frame 29: adult Tanda with the first tooth pendant.

Decision criteria:

- The comedy reads without becoming slapstick.
- The mercy scene is clear without showing violence.
- Scenes 25-27 have the emotional object language needed for the final story.
- Magic starts small and earned, then expands.

### Gate 3: Full Story Set

Generate the remaining story frames in batches of 4 to 6. Each batch should reuse the approved references. Do not produce the full 30-frame set until the first six anchors feel right.

## Source References

Use these as source references for character and style consistency:

- `public/story-assets/refs/ref-01-tanda.jpg`
- `public/story-assets/refs/ref-03-father.jpg`
- `public/story-assets/viking-origin/vo-02-father.png`
- `public/story-assets/viking-origin/vo-08-promise.png`
- `public/story-assets/viking-origin/vo-09-transformation.png`

Optional mood-only references from older TFN art:

- `C:/Users/sathi/kai/context/projects/active/tfn-art/anchors/tanda-v3/05-reading-tooth.png`
- `C:/Users/sathi/kai/context/projects/active/tfn-art/frames/story-01/f14-triptych.png`

Use the optional older art only for restraint, softness, and storybook atmosphere. Do not let it override the current soft 3D character style.

## Global Style Lock

Every prompt should preserve:

- soft cinematic 3D storybook character design matching the supplied TFN references
- warm expressive faces and readable child emotions
- handmade Norse coastal world: rough oak, wool, leather, rope, sailcloth, pine pitch, smoke, salt air
- slate-blue sea shadows, hearth-amber warmth, restrained gold Toothlight
- mobile-safe composition with the emotional subject clear in the middle or lower third
- clean, text-free image with no labels, logos, or watermarks

Avoid:

- horned helmets
- battle glamour
- generic fantasy castles
- adult Tanda before the final transformation beat
- over-sparkled magic before the Toothlight moment
- visible phone or product UI inside the story images

## Gate 1 Prompts

### 1. Young Tanda Full Body

Output filename: `s2-ref-young-tanda-full.png`

Aspect: `9:16`

References:

- `ref-01-tanda.jpg`
- `vo-08-promise.png`

Prompt:

Create a full-body character reference of Young Tanda at age seven, before she has wings. She has warm brown eyes, chestnut-brown wavy hair with the same family resemblance as the supplied adult Tanda reference, a small gap where one front tooth has just come out, and a direct, stubborn, curious expression. She wears a practical rust-brown wool tunic dress over a cream underlayer, simple leather belt, scuffed child-sized boots, and small traces of wood dust from the shipyard.

She stands in a relaxed neutral pose on a simple warm gray studio floor, hands visible, body fully in frame, with enough space around her for use as a character reference. Use the current TFN soft cinematic 3D storybook style from the supplied references: warm expressive face, natural textile detail, subtle painterly softness in the lighting, and gentle amber highlights. The image is clean and text-free.

### 2. Young Tanda Expression Sheet

Output filename: `s2-ref-young-tanda-expressions.png`

Aspect: `16:9`

References:

- `s2-ref-young-tanda-full.png` after approved
- `ref-01-tanda.jpg`

Prompt:

Create an expression sheet for the same Young Tanda character, age seven, preserving her chestnut wavy hair, warm brown eyes, missing front tooth, rust wool tunic, and childlike proportions. Show four bust portraits side by side on one clean warm neutral background: proud helper, annoyed patience, secretly worried, and gap-toothed wonder.

Each expression should be clear enough for a parent and child to read instantly. Keep the same soft cinematic 3D storybook character style as the TFN references, with warm skin shading, soft catchlights in the eyes, and natural wool texture. The image is clean and text-free, with no labels above the portraits.

### 3. Tanda's Father Shipbuilder Reference

Output filename: `s2-ref-father-shipbuilder.png`

Aspect: `9:16`

References:

- `ref-03-father.jpg`
- `vo-02-father.png`

Prompt:

Create a full-body character reference of Tanda's father, preserving the face, warmth, broad build, kind eyes, brown hair and beard quality, leather work vest, cream wool shirt, and shipbuilder presence from the supplied father references. He is a maker first: rope-callused hands, practical leather bracers, shipwright tools at his belt, wool trousers, sturdy boots, and wood dust on his hands. He should feel strong but gentle, with the kind of adult who kneels to a child's eye level.

Update the tooth-carrying detail: instead of a bare tooth on a string, he has a tiny carved oak tooth-keeper, shaped like a curved ship rib, tucked into a small inside-chest pouch near his heart. It may be visible only as a small carved object in his open palm or partly tucked into the vest. He stands in a simple shipyard reference pose, full body centered, in the current TFN soft cinematic 3D storybook style with amber shipyard light and slate-blue sea shadows. The image is clean and text-free.

### 4. The Boy Across The Water

Output filename: `s2-ref-boy-across-water.png`

Aspect: `9:16`

References:

- `s2-ref-young-tanda-full.png` after approved, for child scale only
- `s2-ref-father-shipbuilder.png` after approved, for story style only

Prompt:

Create a full-body character reference of the boy across the water, age seven or eight, from another northern coastal village. He has wind-tossed dark blond hair, wary eyes, a practical patched wool tunic in muted blue-gray, short cloak, bare cold ankles, and hands that look like he has been helping repair boats. He is frightened but not pitiful: his posture says he might run, but his face says he is trying to be brave.

Place him on a simple neutral studio background with a faint suggestion of cold shore light. Preserve the same soft cinematic 3D storybook style as the approved Story 2 references, with readable child emotion, natural wool and leather textures, and gentle sea-blue shadows. The image is clean and text-free.

### 5. Shipyard World Reference

Output filename: `s2-ref-shipyard-world.png`

Aspect: `9:16`

References:

- `vo-01-village.png`
- `vo-02-father.png`
- optional mood-only: `f14-triptych.png`

Prompt:

Create a vertical environment reference for a Viking-age coastal shipyard where Tanda's childhood story begins. Curved oak ship ribs rise from the beach beside rough planks, rope coils, hand tools, pine pitch pots, a small fire, stacked wool blankets, and a cold slate-blue sea beyond. The place feels handmade and working, not royal or ceremonial.

Frame the shipyard as a mobile storybook establishing image, with a clear path through the foreground where a small child could walk and warm amber light catching the oak. Use the same current TFN soft cinematic 3D storybook visual style as the supplied Viking-origin references, with a touch of painterly softness in fog and sky. The image is clean and text-free.

## Gate 2 Anchor Prompts

### A1. Frame 02 - Ships Grow From Oak

Output filename: `s2-a1-frame-02-shipyard.png`

Aspect: `9:16`

References:

- approved `s2-ref-young-tanda-full.png`
- approved `s2-ref-father-shipbuilder.png`
- approved `s2-ref-shipyard-world.png`

Prompt:

Young Tanda, age seven, ducks under a broad oak plank in the shipyard while her father works in the background near the ribs of a half-built ship. She is small in the frame but clearly visible, curious and slightly too confident, with chestnut wavy hair, rust wool tunic, and scuffed boots. The ship ribs rise behind her like a handmade skeleton, with rope coils, wood shavings, pitch pots, and a cold slate-blue sea beyond.

Compose this as a vertical mobile storybook establishing frame, wide enough to show the working shipyard but with Tanda's face readable in the lower third. Use the approved TFN soft cinematic 3D storybook style, warm amber light on oak, sea-blue shadows, natural wool and leather texture, and a clean text-free image.

### A2. Frame 04 - Tanda Helps

Output filename: `s2-a2-frame-04-pitch-comedy.png`

Aspect: `9:16`

References:

- approved `s2-ref-young-tanda-full.png`
- approved `s2-ref-father-shipbuilder.png`
- approved `s2-ref-shipyard-world.png`

Prompt:

Young Tanda stands proudly beside a ship plank, one sleeve accidentally stuck to sticky pine pitch. She is trying to look useful and dignified while clearly realizing she cannot move her arm. Her father, the broad kind shipbuilder from the approved reference, notices from behind the plank with amused concern, holding a hand plane and leaning forward.

Frame it as a medium vertical storybook shot with Tanda in the lower center and her father slightly behind her, enough visual comedy for a child to chuckle without making either character foolish. Keep the current TFN soft cinematic 3D style, amber shipyard light, tactile oak, wool, leather, and a clean text-free image.

### A3. Frame 10 - May I Carry It?

Output filename: `s2-a3-frame-10-permission.png`

Aspect: `9:16`

References:

- approved `s2-ref-young-tanda-full.png`
- approved `s2-ref-father-shipbuilder.png`
- approved `s2-ref-shipyard-world.png`

Prompt:

Tanda's father kneels on the beach at Young Tanda's eye level on the morning the ship is leaving. In his large careful palm is her tiny lost tooth wrapped in a sliver of sailcloth beside a small carved oak tooth-keeper shaped like the curved rib of a ship. Tanda stands close, serious and protective, one hand half-reaching as if deciding whether to trust him with it.

Compose this as an intimate vertical medium close-up, with the tooth-keeper and both faces clearly readable. The sail and ship preparation blur softly in the background. Use the approved TFN soft cinematic 3D storybook style, warm morning amber on faces, cool sea-blue background, restrained emotional lighting, and a clean text-free image.

### A4. Frame 19 - Eye Level

Output filename: `s2-a4-frame-19-eye-level.png`

Aspect: `9:16`

References:

- approved `s2-ref-father-shipbuilder.png`
- approved `s2-ref-boy-across-water.png`

Prompt:

On a cold foreign shore, Tanda's father kneels all the way down to the frightened boy's eye level. The boy stands near a rope coil and a cracked small boat, wary but listening. The father is broad and tired from the voyage, but his hands are open and low, showing he is choosing care instead of force. A few crew members remain in the soft background, watching with uncertainty.

Compose this as a vertical storybook frame focused on the two faces and the father's lowered posture. The cracked boat should be visible enough to explain the boy's need. Keep the scene calm and child-safe, with no active violence. Use the approved TFN soft cinematic 3D style, cold slate-blue shore light, warm human highlights on faces, tactile wool and rope detail, and a clean text-free image.

### A5. Frame 23 - First Toothlight

Output filename: `s2-a5-frame-23-first-toothlight.png`

Aspect: `9:16`

References:

- approved `s2-ref-father-shipbuilder.png`
- approved `s2-ref-young-tanda-full.png` for memory glow only

Prompt:

Night aboard the ship. Tanda's father sits alone under a dark sail, cupping the opened carved oak tooth-keeper in both rough hands. Inside it, the sailcloth-wrapped tooth glows like a small warm gold star. In the soft glow above the tooth, only faintly visible, is the memory of Young Tanda's gap-toothed face and closed protective hands.

Compose this as an intimate vertical close-up, with the tooth-keeper and father's hands in the lower center and his face partially lit by the gold glow. The ship deck and sea are dark blue and quiet around him. Use the approved TFN soft cinematic 3D storybook style, restrained gold Toothlight, tactile hands, oak, sailcloth, and a clean text-free image.

### A6. Frame 29 - What She Carries

Output filename: `s2-a6-frame-29-adult-tanda.png`

Aspect: `9:16`

References:

- `ref-01-tanda.jpg`
- `vo-09-transformation.png`
- approved `s2-ref-young-tanda-full.png`

Prompt:

Adult Tanda stands by the quiet sea under early stars, visually matching the supplied adult Tanda reference: warm brown eyes, chestnut-brown wavy hair, soft white-silver dress, gentle fairy-scale presence, and luminous iridescent wings. Near her heart is the first tooth pendant, now transformed from the childhood tooth into a simple golden-white tooth charm. Beside her on the dock rests Young Tanda's carved wooden tooth box.

Compose this as a vertical final storybook frame with Tanda centered and calm, not triumphant. The sea and sky behind her are slate blue, the tooth pendant and wings glow softly in warm gold and pearl colors. Use the current TFN soft cinematic 3D style from the supplied adult Tanda reference, polished enough for the live site, with a clean text-free image.

## Production Notes For Scenes 25-27

Scenes 25, 26, and 27 should visually hinge on the same object:

1. Father opens the carved oak tooth-keeper in his palm.
2. Tanda touches the glowing tooth and sees the memory it carried.
3. Tanda places the tooth with her drawing in her own wooden box, making the first Toothlight.

The core image language:

- the tooth belongs to Tanda
- the father was entrusted with it
- mercy is the memory carried inside it
- Tanda adds her drawing and promise
- the Toothlight is born from tooth plus child-added meaning, not tooth alone

## Draft Commands For First Gate

These are ready once `nano-banana` is installed. The first run should generate only Gate 1.

```powershell
# Example shape. Use each prompt above as the prompt string.
nano-banana "<PROMPT>" -m flash -s 2K -a 9:16 -d "C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai\public\story-assets\viking-origin\_proofs" -o "s2-ref-young-tanda-full" -r "C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai\public\story-assets\refs\ref-01-tanda.jpg" -r "C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai\public\story-assets\viking-origin\vo-08-promise.png"
```

Once Gate 1 images exist, review them in this order:

1. Young Tanda face and age.
2. Father continuity with live-site father.
3. Tooth-keeper object.
4. Story 2 world texture.
5. Whether this looks deploy-ready beside the current homepage stories.
