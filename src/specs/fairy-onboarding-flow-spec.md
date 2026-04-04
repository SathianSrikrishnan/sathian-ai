# CLI AGENT — Fairy Onboarding Flow Spec
# Build this as a multi-step wizard component in the existing Next.js app
# Route: /app (or /app/new)

---

## INSTALL FIRST
```bash
npm install gsap
```

## OVERVIEW

The onboarding is a 4-step wizard. A fairy character is present throughout 
as a small sprite in the corner/top of the screen. Between steps, the fairy 
performs a small animation (flies up, comes back). The fairy masks loading 
states and makes the experience feel alive.

The wizard lives inside the fairy world (deep navy background, floating 
particles, blockchain chain at top). It is NOT a separate white-background 
form page. The user never leaves the fairy world.

---

## STEP 1: "HELLO" — Fairy Greets, Gets Name + Birthday

### What the user sees:
- The fairy world background (deep navy, stars, blockchain chain at top)
- A fairy sprite hovering center-screen (use a static image for now, 
  we'll replace with animated sprite later)
- Below the fairy, a speech bubble or card with text:
  "Hi! I'm here to set up your child's digital keepsake collection. 
   What's their name?"
- A single input field: Child's name (large, friendly, auto-focused)
- Below that: Birthday picker (month / day / year dropdowns or a date input)
- A button: "Next ✨"

### Design:
- The input field should be glassmorphism style (semi-transparent dark bg, 
  gold glow border, white text)
- The fairy speech bubble should be a glassmorphism card with a small 
  triangle pointing up toward the fairy
- Background has floating particle animation (gold and teal dots drifting)
- The blockchain chain visualization runs across the top of the screen

### Technical:
```jsx
// State management for the wizard
const [step, setStep] = useState(1);
const [childName, setChildName] = useState('');
const [birthday, setBirthday] = useState('');
const [smilePhoto, setSmilePhoto] = useState(null);
const [toothPhoto, setToothPhoto] = useState(null);
const [toothArt, setToothArt] = useState(null);
```

### Transition to Step 2:
When user clicks "Next", the fairy does a small celebration animation 
(a quick bounce or sparkle burst), then the card content transitions 
to Step 2 (slide left or fade).

---

## STEP 2: "SMILE!" — Capture the Gap-Toothed Grin

### What the user sees:
- Same fairy world background
- Fairy now has a playful expression (or speech bubble says):
  "Now let's see that smile! Show me the gap where your tooth was! 😁"
- A large camera/upload area:
  - Tap to take a photo (opens camera on mobile)
  - Or upload from gallery
  - The upload area should be a large rounded rectangle with a dashed 
    gold border and a camera icon in the center
  - When photo is captured/uploaded, it shows as a preview with a 
    circular crop and gold glow border (like the wallet page photo)
- Below: "This will be [childName]'s profile photo"
- Button: "Got it! Now show me the tooth →"

### Design:
- The camera/upload area should feel fun and inviting, not clinical
- When the photo is captured, show it immediately with the gold glow 
  border treatment — the parent should think "oh that looks magical" 
  instantly
- The fairy could have a small reaction (sparkle burst) when the photo 
  appears

### Technical:
```jsx
// Camera access for mobile
const handleCapture = async () => {
  // Use input type="file" accept="image/*" capture="user" 
  // for front-facing camera on mobile
  // Fall back to file upload on desktop
};
```

---

## STEP 3: "THE TOOTH!" — Capture and Decorate the Tooth

### What the user sees:
- Same fairy world background
- Fairy speech bubble: 
  "Amazing! Now let's see that tooth! Take a photo of it, or draw it 
   — your child can make it into art!"
- Two options presented as cards:
  1. "📸 Photo the tooth" — opens camera/upload for the physical tooth
  2. "🎨 Draw the tooth" — opens a simple canvas drawing tool
- If they photograph: shows the tooth photo in a small preview
- If they draw: a simple drawing canvas with:
  - White circular canvas on dark background
  - A few color options (gold, teal, white, pink)
  - A brush size toggle (small, medium, large)
  - An undo button
  - The drawing canvas should feel magical — maybe the brush leaves 
    a slight sparkle trail
- After photo or drawing is complete:
  - Show a preview of the "keepsake card" — the tooth art/photo 
    centered in a glowing card frame with the child's name and 
    "Tooth #[number]" and today's date
  - Button: "Make it magic! ✨"

### Design:
- The drawing canvas is the creative moment — this is where the child 
  and parent bond. Make it fun, not complex.
- Keep the drawing tools minimal. 4 colors, 2 brush sizes, undo. 
  That's it. Don't build Photoshop.
- The keepsake card preview is critical — this is the moment the parent 
  sees what they're creating and feels emotional attachment. Use the 
  glassmorphism card style with gold glow border. The art/photo should 
  be the hero, name and date should be subtle.

---

## STEP 4: "MINTING" — The Fairy Takes It to the Chain

### What the user sees:
- The keepsake card is center screen
- The fairy flies down to the card, picks it up (the card shrinks and 
  attaches to the fairy)
- The fairy flies UPWARD toward the blockchain chain at the top
- She reaches a node — the node PULSES with golden light
- A ripple of light cascades along the chain (other nodes pulse in sequence)
- The fairy turns around and descends, now carrying a GLOWING version 
  of the card
- She releases the card — it floats to the center of the screen and 
  GROWS to full size
- Celebration: sparkle burst, subtle golden particle rain
- Text appears: "[childName]'s first digital keepsake!"
- Below: the wallet page content fades in — SOL balance, gallery, 
  share button

### Technical — GSAP Timeline:
```javascript
import { gsap } from 'gsap';

function playMintAnimation(fairyEl, cardEl, chainEl, onComplete) {
  const tl = gsap.timeline({ onComplete });
  
  // Card shrinks and moves to fairy position
  tl.to(cardEl, { 
    scale: 0.15, 
    y: -100, 
    duration: 0.6, 
    ease: "power2.in" 
  });
  
  // Fairy + card fly up together
  tl.to(fairyEl, { 
    y: -300, // up to the chain area
    duration: 1.5, 
    ease: "power2.inOut" 
  }, "-=0.2");
  
  // Chain node pulses
  tl.to(chainEl, { 
    boxShadow: "0 0 60px rgba(240,196,86,0.5)", 
    duration: 0.4, 
    yoyo: true, 
    repeat: 1 
  });
  
  // Fairy descends
  tl.to(fairyEl, { 
    y: 0, 
    duration: 1.2, 
    ease: "power2.out" 
  });
  
  // Card grows back to full size, now "minted"
  tl.to(cardEl, { 
    scale: 1, 
    y: 0, 
    duration: 0.8, 
    ease: "back.out(1.2)" 
  }, "-=0.5");
  
  // Sparkle burst
  tl.call(() => {
    // trigger sparkle particle effect
  });
  
  return tl;
}
```

### What's happening in the background during the animation:
```javascript
// While the animation plays (5-8 seconds), these run in parallel:
async function mintTooth(childName, birthday, smilePhoto, toothArt) {
  // 1. Upload images to Arweave/storage
  // 2. Call Solana program to mint cNFT
  // 3. Create the child's wallet page entry
  // 4. Generate the OG image for sharing
  
  // The animation duration should be >= the actual transaction time
  // If the transaction finishes early, the animation still completes
  // If the transaction takes longer, add a "fairy is working..." 
  // loop at the chain node until it resolves
}
```

---

## STEP 5: "YOUR WALLET" — The Fairy World Wallet

### What the user sees:
After the minting animation completes, the page transitions seamlessly 
into the wallet view. The fairy shrinks and moves to the background, 
joining the other fairies in the sky.

The wallet page is the fairy-network-world.jsx design:
- Child's photo with gold glow pulse
- Name in shimmering gold
- Birthday in enchanted calendar tile  
- SOL balance (starts at 0.00)
- Tooth gallery with the freshly minted keepsake as Tooth #1
- "Gift SOL to [name]" button
- "Share [name]'s page" button

The fairy remains subtly present — hovering in the background, 
occasionally drifting past. She's not gone, she's just doing her job.

---

## ROUTE STRUCTURE

```
/app              → Landing / step 1 (fairy greeting)
/app/new          → Onboarding wizard (steps 1-4)
/app/[childId]    → Wallet page (step 5, also the shared link destination)
```

The shared link that goes to grandma is /app/[childId] — she lands 
DIRECTLY on the wallet page, skipping all onboarding. She sees the 
child's keepsake, the SOL balance, and the Gift button immediately.

---

## CSS CLASSES NEEDED

Apply the Fairy Glow design tokens from tfn-fairy-glow-tokens.css.
Key classes to implement:

- .fairy-world — full page container with gradient bg and particles
- .fairy-card — glassmorphism card for all containers
- .fairy-input — styled form input with gold glow border
- .fairy-button — gold gradient CTA button
- .fairy-button-secondary — teal outline button
- .speech-bubble — glassmorphism card with upward-pointing triangle
- .camera-upload — dashed gold border upload area
- .drawing-canvas — the tooth art creation area
- .keepsake-preview — the minted card preview with glow effect

---

## WHAT TO BUILD FIRST

1. The route structure and basic wizard state machine (steps 1-5)
2. Step 1 (name + birthday) with fairy world background
3. Step 2 (smile photo capture)
4. Step 3 (tooth photo/draw)
5. The wallet page at /app/[childId] with fairy world aesthetic
6. Step 4 (mint animation) — this is the most complex, do it last
7. OG image generation for WhatsApp sharing

Start with steps 1-3 as simple forms inside the fairy world aesthetic.
Get the FLOW working before making the ANIMATIONS perfect.
