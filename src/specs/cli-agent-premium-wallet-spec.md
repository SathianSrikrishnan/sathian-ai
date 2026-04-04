# CLI AGENT — Premium Wallet Page Technical Spec
# This replaces the previous instructions. This is the 9/10 version.

---

## DEPENDENCIES TO INSTALL

```bash
# Animation library — handles micro-interactions, scroll triggers, timeline sequences
npm install gsap

# Lottie for pre-built fairy animations (optional, if we create Lottie files)
npm install lottie-web

# Fonts
# Add to HTML head or import in CSS:
# https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap
```

GSAP is the only hard requirement. It handles:
- The fairy firefly animations (custom path movement)
- Scroll-triggered reveals (elements fade/float in as you scroll)
- The "fairy taps the balance" micro-animation
- Number counting animations (SOL balance ticks up on load)
- Sparkle burst effects on interactions

---

## ASSET STRATEGY — REPLACE ALL EMOJIS

Every emoji on the page must be replaced with a real asset. Here's the mapping:

| Current (emoji) | Replace with | How to get it |
|---|---|---|
| 👧🏽 (child photo placeholder) | Actual child photo from parent upload | Already exists in product |
| ✨ (sparkle) | Custom SVG sparkle with glow filter | Create as inline SVG (spec below) |
| 🧚 (fairy icon) | AI-generated fairy avatar image | Generate on Fal.ai, save as PNG, serve as static asset |
| 🦷 (tooth) | Illustrated tooth icon SVG | Create as inline SVG (spec below) |
| 💛 (heart) | Custom heart SVG in fairy gold | Create as inline SVG |
| 🔓 (lock) | Custom lock icon SVG in teal | Create as inline SVG |
| 🔗 (link) | Custom share/link icon SVG | Create as inline SVG |

### Custom Sparkle SVG (replace all ✨ usage):
```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z" fill="url(#sparkle-grad)"/>
  <defs>
    <radialGradient id="sparkle-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF8F0"/>
      <stop offset="100%" stop-color="#F0C456"/>
    </radialGradient>
  </defs>
  <filter id="sparkle-glow">
    <feGaussianBlur stdDeviation="1.5" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</svg>
```

### Custom Tooth Icon SVG:
```svg
<svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C7.5 2 4 5 4 9C4 13 6 16 7 20C7.5 22 8 26 9.5 26C11 26 11 22 12 22C13 22 13 26 14.5 26C16 26 16.5 22 17 20C18 16 20 13 20 9C20 5 16.5 2 12 2Z" 
        fill="url(#tooth-grad)" stroke="rgba(240,196,86,0.3)" stroke-width="0.5"/>
  <defs>
    <linearGradient id="tooth-grad" x1="12" y1="2" x2="12" y2="26">
      <stop offset="0%" stop-color="#FFF8F0"/>
      <stop offset="100%" stop-color="#E8DDD0"/>
    </linearGradient>
  </defs>
</svg>
```

---

## THE NAME — Large and Magical

The child's name is the HERO text of the entire page. It should feel like a title card from a fairy tale.

```css
.child-name {
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 40px; /* LARGE — this is the biggest text on the page */
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #F0C456 0%, #FFE0A0 40%, #F0C456 60%, #FFD700 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-name 4s ease-in-out infinite;
  text-align: center;
  margin: 0;
  /* Add a subtle text glow behind it */
  filter: drop-shadow(0 0 12px rgba(240, 196, 86, 0.25));
}

@keyframes shimmer-name {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

The name should have a slow, subtle golden shimmer animation — the gradient shifts gently, making it look like the text is made of living gold.

---

## THE BIRTHDAY — Decorative Calendar Element

Don't just display the date as text. Make it a VISUAL ELEMENT. Think: a small decorative card that looks like an enchanted calendar page.

```jsx
function MagicalBirthday({ date }) {
  // Parse: "March 24, 2019"
  const month = "March";
  const day = "24";
  const year = "2019";
  
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(22, 36, 71, 0.6)',
      border: '1px solid rgba(240, 196, 86, 0.2)',
      borderRadius: 12,
      padding: '8px 20px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 0 15px rgba(240, 196, 86, 0.06)',
    }}>
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: '#4FD1C5',
      }}>
        {month} {year}
      </span>
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 28,
        fontWeight: 800,
        color: '#F5F0FF',
        lineHeight: 1.1,
        textShadow: '0 0 15px rgba(245, 240, 255, 0.15)',
      }}>
        {day}
      </span>
      <span style={{
        fontSize: 9,
        color: 'rgba(245, 240, 255, 0.35)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        born
      </span>
    </div>
  );
}
```

This creates a small enchanted calendar tile — month and year in small teal caps, the day number large and glowing, "born" tiny below. It feels like a keepsake, not metadata.

---

## FAIRY FIREFLY BACKGROUND — Canvas Animation

This replaces the CSS particle dots with actual animated fairy sprites that move like fireflies — drifting, pausing, darting, glowing.

```javascript
// Initialize after page loads
// This creates a transparent canvas layer over the background
// with 8-12 tiny glowing fairy sprites that drift around

import { gsap } from 'gsap';

function initFairyFireflies(container) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 1;
  `;
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const fairies = Array.from({ length: 10 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 1.5 + Math.random() * 2,
    baseAlpha: 0.2 + Math.random() * 0.4,
    alpha: 0,
    hue: Math.random() > 0.3 ? 45 : 175, // gold or teal
    vx: 0,
    vy: 0,
    targetX: Math.random() * canvas.width,
    targetY: Math.random() * canvas.height,
    speed: 0.3 + Math.random() * 0.7,
    pulseSpeed: 0.02 + Math.random() * 0.03,
    pulsePhase: Math.random() * Math.PI * 2,
  }));
  
  function updateFairy(fairy, time) {
    // Move toward target with easing (firefly drift)
    const dx = fairy.targetX - fairy.x;
    const dy = fairy.targetY - fairy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 20) {
      // Pick new target (firefly pauses, then darts)
      fairy.targetX = Math.random() * canvas.width;
      fairy.targetY = Math.random() * canvas.height;
      fairy.speed = 0.3 + Math.random() * 0.7;
    }
    
    fairy.x += (dx / dist) * fairy.speed;
    fairy.y += (dy / dist) * fairy.speed;
    
    // Pulse glow
    fairy.alpha = fairy.baseAlpha + Math.sin(time * fairy.pulseSpeed + fairy.pulsePhase) * 0.15;
  }
  
  function drawFairy(fairy) {
    const gradient = ctx.createRadialGradient(
      fairy.x, fairy.y, 0,
      fairy.x, fairy.y, fairy.size * 6
    );
    
    if (fairy.hue === 45) {
      // Gold fairy
      gradient.addColorStop(0, `rgba(240, 196, 86, ${fairy.alpha})`);
      gradient.addColorStop(0.3, `rgba(240, 196, 86, ${fairy.alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(240, 196, 86, 0)`);
    } else {
      // Teal fairy
      gradient.addColorStop(0, `rgba(79, 209, 197, ${fairy.alpha})`);
      gradient.addColorStop(0.3, `rgba(79, 209, 197, ${fairy.alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(79, 209, 197, 0)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(fairy.x, fairy.y, fairy.size * 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Bright core
    ctx.fillStyle = `rgba(255, 255, 255, ${fairy.alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(fairy.x, fairy.y, fairy.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 1;
    fairies.forEach(f => {
      updateFairy(f, time);
      drawFairy(f);
    });
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
```

These are NOT static dots. They MOVE — drifting gently, pausing, then darting to a new position (like real fireflies). Each one pulses between brighter and dimmer. Gold and teal mix. The effect is subtle but alive.

---

## MICRO-ANIMATIONS WITH GSAP

### SOL Balance Count-Up on Load:
```javascript
import { gsap } from 'gsap';

// When the balance element enters viewport:
function animateBalance(element, targetValue) {
  const counter = { value: 0 };
  gsap.to(counter, {
    value: targetValue,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = counter.value.toFixed(2);
    }
  });
}
```

### Scroll-Triggered Section Reveals:
```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Each section fades and floats in from below as you scroll
document.querySelectorAll('.fairy-section').forEach(section => {
  gsap.from(section, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
    }
  });
});
```

### Sparkle Burst on Button Tap:
```javascript
function sparkleBurst(x, y, container) {
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: absolute; width: 4px; height: 4px; border-radius: 50%;
      background: #F0C456; left: ${x}px; top: ${y}px; pointer-events: none;
      box-shadow: 0 0 6px rgba(240, 196, 86, 0.5);
    `;
    container.appendChild(spark);
    
    const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
    const distance = 30 + Math.random() * 40;
    
    gsap.to(spark, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0,
      duration: 0.6 + Math.random() * 0.3,
      ease: "power2.out",
      onComplete: () => spark.remove()
    });
  }
}
```

### Photo Glow Breathing:
```javascript
// Gentle pulsing glow on the child's photo circle
gsap.to('.child-photo', {
  boxShadow: '0 0 45px rgba(240, 196, 86, 0.3), 0 0 110px rgba(240, 196, 86, 0.1)',
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});
```

---

## FAIRY AVATAR IMAGE — How to Create

Generate this on Fal.ai and save as a static asset:

```
A tiny circular avatar portrait of a luminous fairy against a dark navy background. The fairy has a warm golden glow emanating from her skin, short practical glowing hair, large determined expressive eyes, and translucent iridescent wings. She looks directly at the viewer with a friendly, purposeful expression. Circular crop, centered face, soft golden glow border effect. Style: luminous soft 3D illustration, warm Pixar-like lighting. The avatar should work at 36x36 pixels as well as 200x200. Simple, clear, iconic. NOT photorealistic.
```

Generate this, crop it circular, save as `/public/fairy-avatar.png`. Use it wherever the 🧚 emoji currently appears.

---

## PRIORITY ORDER FOR CLI AGENT

1. **Replace all emojis** with inline SVGs and real images (biggest quality jump)
2. **Install GSAP** and add the fairy firefly canvas animation (biggest "wow" factor)
3. **Name shimmer animation** — make it golden and alive
4. **Birthday calendar component** — replace plain text with decorative element
5. **SOL balance count-up animation** on page load
6. **Scroll-triggered section reveals** — elements float in as you scroll
7. **Sparkle burst** on button taps
8. **Photo glow breathing** animation
9. **Generate fairy avatar** on Fal.ai and replace emoji

---

## WHAT THIS PAGE SHOULD FEEL LIKE

When grandma opens this link on her phone:
- The page loads with a deep navy sky and tiny golden fireflies drifting
- The child's photo pulses with a warm golden glow
- The name shimmers in living gold
- The birthday sits in a small enchanted calendar tile
- The SOL balance counts up smoothly to its number
- As she scrolls, each section floats in gently
- The tooth gallery cards glow when she hovers
- She taps "Gift SOL" and golden sparkles burst from the button
- She thinks: "This is the most beautiful thing anyone has ever sent me about my grandchild"

That is a 9/10.
