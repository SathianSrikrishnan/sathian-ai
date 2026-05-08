# TFN Hero Animation Production Roadmap

Date: 2026-05-04

## Recommendation

Do not go straight to a full dedicated 3D hero generator workflow yet.

For MVP, build a custom **premium cartoon storybook hero loop** first:

- Use generated/approved still assets for Tanda, tooth, keepsake, piggy bank, and background.
- Animate them with a real video pipeline, not a live webpage CSS prototype.
- Export a polished 6-8 second `webm/mp4` loop for the homepage.
- Add a poster still and reduced-motion fallback.

This gives the site a real storytelling asset without requiring the full cost/risk of consistent Pixar-style 3D production. If customers respond to the story and the product framing, upgrade the same concept into a 3D storybook render later.

## Why This Path

The current CSS/PNG prototype proves the idea, but it does not meet homepage quality. The failure is structural: cropped static images sliding around a webpage will not create believable character motion.

Marketplace Rive/Lottie assets are also not enough. They are too generic, and Tooth Fairy Network needs custom story meaning:

- Tanda is the guide.
- The tooth becomes a saved memory.
- A tiny gift becomes the Smile Fund.
- Parent control should feel implicit and safe.

The MVP should therefore be a **custom mini-loop**, but not a fully interactive 3D system yet.

## Production Options

### Option A - MVP Cartoon Storybook Loop

Recommended now.

What it is:

- A short pre-rendered hero loop using approved cartoon/storybook assets.
- Built in HyperFrames or Remotion.
- Exported as `webm`, `mp4`, and poster image.

Pros:

- Fastest path to something website-worthy.
- Good enough to test homepage comprehension.
- Consistent because we control the asset pack.
- Easy to integrate and performance-optimize.
- Repeatable for other TFN story moments.

Cons:

- Not truly interactive.
- Tanda will not be fully rigged.
- Quality depends on approved source art.

### Option B - Dedicated 3D Storybook Hero Film

Save for the next sweep.

What it is:

- A high-polish 3D render pipeline with consistent character/style frames.
- More like a premium product film than a web animation.

Pros:

- Highest visual upside.
- Best parent-trust/premium feel.
- Could define the whole brand system.

Cons:

- Harder to guarantee consistency.
- More iteration cost.
- More dependent on external generation/render quality.
- Slower to get to homepage feedback.

### Option C - Custom Rive/Spline Tanda System

Good downstream, not first.

What it is:

- A rigged Tanda that can fly, hover, point, sparkle, and react across the site.
- Could become an interactive site companion during scroll/hover.

Pros:

- Best for the long-term “Tanda lives on the site” idea.
- Lightweight and interactive.
- Reusable across pages.

Cons:

- Requires proper character rigging and art prep.
- Not the fastest way to make the homepage hero feel premium.
- If rushed, it will look toy-like in the wrong way.

## MVP Concept Choices

### Concept 1 - Tanda's Keepsake Studio

Approved for production direction.

Approved reference board:

- `public/toothfairy/animation/tanda-keepsake-studio-storyboard-v2-approved.png`
- `public/toothfairy/animation/tanda-keepsake-studio-styleframes-v3-old-tanda.png`

Important art-direction lock:

- The six-frame story flow is approved.
- The v3 styleframe sheet uses the older approved Tanda direction and is the current motion-preview source.
- Final production frames should preserve the older approved Tanda reference from `public/toothfairy/animation/tanda-cartoon-mvp.png`: softer loose brown hair, white dress, iridescent wings, small pouch, warm expression, and tooth-holding pose language.
- The glossy pink piggy bank keeps the Solana-style side mark.
- The visible coin should use a clear dollar sign while it travels toward the piggy.
- In the final resolved frame, the separate coin should disappear into the slot. The piggy should glow warmly gold around the slot/body so the gift feels received inside the Smile Fund.

Story:

Tanda enters a warm magical studio. A glowing tooth rises on a pedestal, becomes a keepsake, then a coin of light travels into a glossy piggy bank. The final frame shows both the memory and Smile Fund gently glowing.

Why it works:

- Very clear product story.
- Fewer moving environments.
- Easier to make premium with still assets.
- Works well as a homepage hero beside copy.

Approved loop beats:

1. Tanda glides in.
2. Tanda presents the tooth on a glowing keepsake pedestal with no piggy bank visible.
3. A premium story card forms around a smaller tooth with a tiny "TOOTH STORY" title and short story-line marks.
4. The story card becomes visibly protected in a warm memory vault or safe-shell.
5. The piggy bank appears for the first time as a dollar-sign coin arcs from the protected story into the piggy.
6. Tanda, the protected keepsake story, and the piggy bank glow together, with the gift implied inside the piggy rather than sitting above it.
7. Sparkle reset loops back to the start without adding extra labels.

### Concept 2 - Bedtime Tooth Visit

Story:

Tanda enters a child bedroom, finds a tooth near a pillow, lifts it into a glowing keepsake, then sends a little gift into the Smile Fund.

Why it works:

- Most emotionally tied to the tooth fairy ritual.
- Strong parent/child context.

Risk:

- More background detail can make the hero busy.
- Harder to keep readable at small sizes.

### Concept 3 - Celestial Smile Fund Delivery

Story:

Tanda flies through a soft celestial path carrying the tooth. The tooth becomes a star-keepsake, then a coin-light lands in the piggy bank under a warm sky.

Why it works:

- Matches the existing celestial TFN banner language.
- Feels magical and expansive.

Risk:

- Can drift too far from the product if the piggy/keepsake are not grounded enough.

## Approval Workflow

### Milestone 1 - Pick Concept

User chooses one of the three concepts above.

Default recommendation: Concept 1, Tanda's Keepsake Studio.

### Milestone 2 - Approve Styleframes

Create six still frames for the selected concept:

- Frame 1: Tanda enters with the glowing tooth.
- Frame 2: Tooth-only ritual moment, no piggy visible.
- Frame 3: Story card forms with smaller tooth and tiny story marks.
- Frame 4: Story card is protected in a memory vault.
- Frame 5: Dollar-sign coin arcs into the piggy bank.
- Frame 6: Final glow with Tanda, vault, and piggy.

Approval question:

Does this look good enough to define the homepage hero?

Status:

Approved for story flow on 2026-05-04. The old-Tanda styleframe pass is approved to move into a viewable motion preview.

### Milestone 3 - Build Motion

Use approved assets to build a 6-8 second loop.

Target motion quality:

- Soft, floaty Tanda entrance.
- One clean magical trail, not many busy effects.
- Tooth glow timed as the emotional center.
- Coin motion feels intentional and satisfying.
- Piggy bank receives coin with a small bounce/glow.

### Milestone 4 - Integrate Into Site

Homepage component should include:

- `webm` source
- `mp4` fallback
- poster image
- reduced-motion still
- mobile crop behavior
- no visible video controls
- no sound

### Milestone 5 - Future Interactive Tanda

If MVP works, build a site companion version:

- Tanda scrolls/floats subtly across key sections.
- Tanda points to the keepsake or Smile Fund.
- Tanda reacts to hover/CTA.
- Built as Rive/Spline/Three only after the character style is locked.

## Needed Assets

For the MVP loop:

- Tanda full-body flying pose
- Tanda guiding/pointing pose
- Glowing tooth
- Keepsake pedestal/card/vault
- Glossy pink piggy bank
- Coin/light
- Warm cream/storybook background

For video integration:

- `tfn-tanda-hero-loop.webm`
- `tfn-tanda-hero-loop.mp4`
- `tfn-tanda-hero-poster.webp`

Export status:

- Safe preview export created at `public/toothfairy/animation/tfn-tanda-hero-loop.webm`.
- MP4 fallback created at `public/toothfairy/animation/tfn-tanda-hero-loop.mp4`.
- Poster/reduced-motion still created at `public/toothfairy/animation/tfn-tanda-hero-poster.webp`.
- Preview component created at `src/components/toothfairy/home/tanda-ritual-hero-video.tsx`.
- Smooth layered export created at `public/toothfairy/animation/tfn-tanda-hero-layered-loop.webm`.
- Smooth layered MP4 fallback created at `public/toothfairy/animation/tfn-tanda-hero-layered-loop.mp4`.
- Smooth layered poster/reduced-motion still created at `public/toothfairy/animation/tfn-tanda-hero-layered-poster.webp`.
- Repeatable local renderer created at `scripts/render-tanda-layered-video.ps1`.

## Implementation Notes

Use a video-first homepage asset for MVP. Do not animate source PNGs directly in the production homepage as the final experience.

The current `/animation/tanda-ritual` route should remain a storyboard sandbox only. It is not the production strategy.

Preferred build stack:

- HyperFrames for HTML/GSAP video composition, or Remotion if React composition fits better.
- Next.js hero component renders the finished video.

Performance rules:

- Keep final loop under roughly 2-4 MB if possible.
- Use `webm` first, `mp4` fallback.
- Use a high-quality poster image for first paint.
- Respect reduced motion by showing the poster/still only.

## Default Next Step

Proceed with **Concept 1 - Tanda's Keepsake Studio**.

Create individual production styleframes from the approved six-frame board, using the older approved Tanda model as the character reference. After those are approved, build the 6-8 second video-first hero loop.
