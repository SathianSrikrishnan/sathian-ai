# TFN UNIFIED VISUAL STYLE GUIDE — "FAIRY GLOW"
## Connects: Video content, Product UI, Brand identity
## Date: March 2026

---

## THE CORE IDEA

Everything in the Tooth Fairy Network universe glows from within. Teeth glow. Fairies glow. Keepsakes glow. The network nodes glow. The child's wallet page glows. The savings balance glows. This is the visual through-line that connects a 45-second fairy tale video to the product interface a parent actually uses. Same world, same light, same magic.

---

## COLOR PALETTE

### Primary (the sky / backgrounds):
- **Deep Navy:** #0B1026 — the darkest background, the night sky
- **Midnight Purple:** #1A1040 — secondary background, depth layers
- **Twilight Blue:** #162447 — card backgrounds, UI panels

### Accent (the magic / interactive elements):
- **Fairy Gold:** #F0C456 — primary accent, SOL balance, CTA buttons, fairy glow
- **Stardust Teal:** #4FD1C5 — secondary accent, links, network threads, hover states
- **Moonlight White:** #F5F0FF — text, highlights, sparkle particles

### Warm (the human / emotional moments):
- **Tooth Pearl:** #FFF8F0 — the tooth itself, keepsake card backgrounds
- **Blush Pink:** #FFB8B8 — children's cheeks, warmth accents
- **Ember Orange:** #FF8C42 — small highlights, notification dots

### The Rule:
Backgrounds are ALWAYS deep (navy/purple). Light ALWAYS comes from objects and characters, not from the environment. The world is dark. The magic is bright. This creates instant visual drama and makes everything feel precious and glowing.

---

## TYPOGRAPHY

### Headlines / Display:
**Font: "Recoleta" or "Nunito"**
- Recoleta: soft serif, warm, premium, storybook feel — use for marketing/video text
- Nunito: rounded sans-serif, friendly, readable — use for product UI

### Body / Data:
**Font: "Plus Jakarta Sans" or "DM Sans"**
- Clean, modern, readable at small sizes
- Used for wallet balances, dates, contribution amounts

### The Rule:
Rounded letterforms only. Nothing sharp, nothing geometric, nothing techy. The typography should feel like it belongs in a children's book that adults also enjoy reading.

---

## DESIGN ELEMENTS

### Glow Borders
Every card, button, and interactive element has a subtle glow border — a 1-2px border with a soft box-shadow that matches the Fairy Gold or Stardust Teal. This is the signature TFN UI element.

CSS pattern:
```css
.fairy-card {
  background: rgba(22, 36, 71, 0.7);
  border: 1px solid rgba(240, 196, 86, 0.3);
  box-shadow: 0 0 20px rgba(240, 196, 86, 0.1), 0 0 60px rgba(240, 196, 86, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(20px);
}
```

### Particle Effects
Floating light particles appear in both video content and the product UI. In video, they're fairy dust. In the UI, they're ambient atmosphere. Same visual, different context.

For the web product, use tsParticles or a simple CSS animation with small glowing dots drifting upward slowly.

### Glassmorphism
UI panels use frosted glass over the deep background — semi-transparent with blur. This is the "Cosmic Fairy Network" aesthetic from the original design direction, refined.

### Rounded Everything
Border radius minimum 12px on cards, 8px on buttons, 24px on containers. No sharp corners anywhere. The world is soft and safe.

---

## CHARACTER DESIGN — THE FAIRY

### Physical Description (paste into every AI prompt):
```
A tiny luminous fairy, approximately 6 inches tall. Simple rounded body proportions — slightly oversized head, small body, giving a determined purposeful appearance. Soft warm golden light emanates from her skin, creating a gentle glow halo. Translucent iridescent dragonfly-style wings, always in subtle motion. Short practical hair that glows faintly. Simple flowing garment made of light-fabric, not a princess dress. Large expressive eyes with determination and focus. She is a worker, a courier, a network operator — not a princess. Her movement style is fast and darting, like a hummingbird. Color: warm gold body glow against deep navy/purple backgrounds.
```

### Why This Design Is AI-Forgiving:
- **Glowing skin** means soft edges — AI doesn't need to render perfect skin texture
- **Simple proportions** means fewer details to get wrong
- **Oversized head** means expressions read clearly even at small sizes
- **Wings in motion** means blur is expected, not a flaw
- **Light-fabric clothing** means no complex fabric folds to mess up
- **Dark backgrounds** mean the fairy pops without needing a detailed environment
- **Particle effects** mean any stray AI artifacts look like fairy dust

---

## PRODUCT UI — CHILD'S WALLET PAGE

### Layout (mobile-first, 9:16):

```
┌─────────────────────────────────┐
│                                 │
│     ✨ floating particles ✨     │
│                                 │
│    ┌───────────────────────┐    │
│    │                       │    │
│    │   [Child's Photo]     │    │
│    │   circular, glow      │    │
│    │   border, large       │    │
│    │                       │    │
│    └───────────────────────┘    │
│                                 │
│         SOPHIE                  │
│      Born May 3, 2019           │
│                                 │
│    ┌───────────────────────┐    │
│    │  ◎ 2.4 SOL            │    │
│    │  Locked until 2037     │    │
│    │  ≈ $340 USD            │    │
│    │  ████████░░ 12/20      │    │
│    │  teeth collected       │    │
│    └───────────────────────┘    │
│                                 │
│    ── Tooth Gallery ──          │
│                                 │
│    ┌──────┐ ┌──────┐ ┌──────┐  │
│    │ 🦷 #1│ │ 🦷 #2│ │ 🦷 #3│  │
│    │ glow │ │ glow │ │ glow │  │
│    │ card │ │ card │ │ card │  │
│    │      │ │      │ │      │  │
│    │ $10  │ │ $15  │ │ $10  │  │
│    │ Mom  │ │Nana  │ │ Dad  │  │
│    └──────┘ └──────┘ └──────┘  │
│                                 │
│    ┌──────┐ ┌──────┐           │
│    │ 🦷 #4│ │ 🦷 #5│  + Add    │
│    │ glow │ │ glow │  Tooth    │
│    │ card │ │ card │           │
│    └──────┘ └──────┘           │
│                                 │
│    ── Family Contributors ──    │
│                                 │
│    ◎ Mom — 1.2 SOL             │
│    ◎ Nana — 0.8 SOL            │
│    ◎ Dad — 0.4 SOL             │
│                                 │
│   [ Share Family Link 🔗 ]     │
│   [ Add New Tooth ✨ ]          │
│                                 │
└─────────────────────────────────┘

Background: Deep navy (#0B1026) with subtle
radial gradient to midnight purple at edges.
Floating particle animation throughout.
```

### Each Tooth Card:
- The child's photo or drawing as the hero image
- Glow border in Fairy Gold
- Tooth number and date
- Who contributed (which family member deposited)
- Amount deposited
- Glassmorphism card on deep background

### The Key Insight:
This page IS the child's first digital art gallery. Each tooth card is a piece of art — their gap-toothed photo, their crayon drawing, their silly face. The SOL balance and family contributions are secondary information. The GALLERY is primary. The money grows quietly in the background while the memories are front and center.

---

## HOW VIDEO AND PRODUCT CONNECT VISUALLY

| Video Element | Product UI Element |
|---|---|
| Deep navy night sky | Page background (#0B1026) |
| Fairy's golden glow | Fairy Gold accent color, CTA buttons |
| Network light threads | Glow borders on cards |
| Floating sparkle particles | tsParticles ambient animation |
| Tooth transforming into keepsake | Tooth card in the gallery |
| Golden value flowing downward | SOL balance display with gold numerals |
| Network nodes pulsing | Family contributor avatars with subtle pulse |
| Vast constellation structure | The gallery grid layout, connected by light |

A parent watches the fairy video → visits toothfairy.network → sees the SAME visual language on the product page. The fairy world from the video IS the product. No cognitive gap. No "oh this looks different than the ad." Seamless.

---

## STYLE TEST PROMPTS — GENERATE THESE FIRST

### 1. The Fairy (character lock):
```
A tiny luminous fairy hovering in mid-air, approximately 6 inches tall, against a deep navy night sky full of stars. Rounded simple body proportions with a slightly oversized head. Soft warm golden light emanates from her skin creating a gentle glow halo. Translucent iridescent dragonfly-style wings in subtle motion blur. Short practical glowing hair. Simple flowing light-fabric garment. Large expressive determined eyes. She holds a tiny glowing white tooth in both hands against her chest. Golden sparkle particles drift around her. Style: luminous soft 3D illustration, warm like Pixar lighting, ethereal like Ghibli spirits, rounded and friendly but not childish. Deep navy and purple background with warm gold and teal accents. Soft bokeh. NOT photorealistic. 9:16 vertical.
```

### 2. The Network (environment lock):
```
A vast ethereal luminous network structure floating in the upper atmosphere. Deep navy star-filled sky. The network is made of rounded nodes of concentrated warm golden-white light connected by shimmering teal threads that pulse with soft energy. Hundreds of tiny glowing fairy-like beings stream toward it from below, each trailing golden sparkle dust. The structure looks like a living constellation, organic and rounded, not geometric or techy. The overall impression is ancient, magical, warm, and awe-inspiring. Style: luminous soft 3D illustration, warm Pixar-quality lighting, rich particle effects, volumetric light rays, deep jewel-tone colors. NOT photorealistic, NOT cold or technological. 9:16 vertical.
```

### 3. The Tooth Card / Keepsake (product element lock):
```
A single luminous keepsake card floating in a dark navy void, surrounded by gentle golden sparkle particles. The card has rounded corners with a soft golden glow border. Inside the card: a child's gap-toothed smiling face rendered in warm luminous illustrated style, with the text "Tooth #3" and a date below. The card itself glows softly from within, like a precious magical artifact. Behind it, very faintly, other similar cards float in the distance, suggesting a gallery. Style: luminous soft 3D illustration, glassmorphism card effect, warm golden and teal accents against deep navy background. Premium, magical, precious. NOT photorealistic. 9:16 vertical.
```

### 4. The Child's Wallet Page (UI reference):
```
A mobile phone screen mockup showing a magical child's digital wallet interface. Deep navy background with floating golden sparkle particles. At top: a circular photo of a smiling child with a glowing gold border. Below: the name "SOPHIE" in warm rounded serif font. A glassmorphism card shows "2.4 SOL" in golden numerals with "Locked until 2037" below. Further down: a grid of small glowing keepsake cards, each showing a different tooth memory. The overall UI style is magical, warm, luminous — like a fairy's treasure interface. Rounded corners everywhere, soft glow effects, deep jewel-tone colors. NOT a typical fintech app — this looks like a portal into a magical world. 9:16 vertical.
```

---

## EXECUTION PLAN — NEXT 2-3 HOURS

### Hour 1: Lock the Style
1. Generate all 4 test prompts above on Fal.ai (Flux 2 Pro, 9:16, 4 variations each)
2. Pick the best version of each
3. These become your PERMANENT style references for everything going forward

### Hour 2: Feed CLI Agent
4. Take the style guide CSS (colors, fonts, glow borders, glassmorphism) from this document
5. Feed it to your Claude Code CLI agent as the design system for the product UI
6. Have CLI update the child's wallet page to match the Fairy Glow aesthetic
7. Screenshot the updated product page and compare it to the video style frames

### Hour 3: Start the Fairy Network Video
8. Use the locked fairy character image as reference
9. Generate all 15 key frames on Fal.ai using the shot descriptions from the concept doc
10. Feed the best key frames into Fal.ai's image-to-video (Kling or Veo)
11. Download clips, assemble in CapCut, use AI edit pilot for transitions and audio

### The Result:
By end of session you have:
- A unified visual style that works across all TFN content
- A product UI that looks like it belongs in the same world as the video
- The first frames of your hero fairy network video
- A repeatable process for generating more content in this style
