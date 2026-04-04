# Design System Specification

## 1. Overview & Creative North Star: "The Celestial Ledger"

This design system is built to bridge the gap between the cold, technical precision of high-end fintech and the soft, emotive warmth of a childhood bedtime story. We are moving beyond the "generic crypto dashboard" to create an experience that feels like a magical heirloom—a digital vault tucked away in a star-drenched sky.

**The Creative North Star: The Celestial Ledger.**
Design here is not about grids and boxes; it is about light and depth. We utilize intentional asymmetry to mimic the natural drift of stardust, overlapping elements to create a sense of physical layering, and high-contrast typography scales that feel more like editorial storytelling than a data sheet. The goal is "Linear meets Bedtime Story"—extreme technical polish wrapped in a dreamlike atmosphere.

---

## 2. Colors & Surface Philosophy

The palette is rooted in the deep reaches of space, punctuated by the warm glow of a nursery nightlight.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions. To separate a section, transition from `surface` (#0d1228) to `surface-container-low` (#151a31). This creates a sophisticated, "borderless" UI that feels like a continuous, fluid environment rather than a series of disconnected boxes.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass. 
- **Base Layer:** `surface` (#0d1228) for the main application background.
- **Parent Sections:** `surface-container` (#191e35) or `surface-container-low` (#151a31).
- **Embedded Content:** Use `surface-container-high` (#242940) to create a subtle lift for interactive widgets.
- **Glass & Gradient Rule:** For floating elements (modals, popovers), use Glassmorphism. Apply `surface-variant` (#2f334b) at 60% opacity with a 20px-40px `backdrop-blur`.

### Signature Textures
Main CTAs and Hero sections should never be flat. Use a "Stardust Gradient" transitioning from `primary` (#ffe3a5) to `primary-container` (#f0c456) at a 135-degree angle. This provides a metallic, gold-leaf "soul" to the interface.

---

## 3. Typography: Editorial Authority

We use a dual-typeface system to balance technical clarity with approachable warmth.

*   **Display & Headlines (Plus Jakarta Sans):** These are your "Narrators." Use `display-lg` (3.5rem) and `headline-md` (1.75rem) with tight letter-spacing (-0.02em) to create a premium, editorial feel. These should feel authoritative yet modern.
*   **Body & Titles (Manrope):** This is your "Guide." Manrope’s geometric but friendly structure ensures legibility at small scales. Use `title-md` (1.125rem) for section headers and `body-md` (0.875rem) for standard text.
*   **Hierarchical Contrast:** Always pair a `display` size headline with a `body-sm` or `label-md` subtext to create high-contrast layouts that feel "designed" rather than "templated."

---

## 4. Elevation & Depth: The Layering Principle

Forget drop shadows that look like "fuzz." We use light and tone to define space.

*   **Tonal Layering:** Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural "recessed" look.
*   **Ambient Shadows:** When a float is required (e.g., a primary action button), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow color must never be pure black; it should be a deep navy tint.
*   **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the "Ghost Border": `outline-variant` (#4e4636) at 15% opacity. 
*   **Firefly Glow:** To highlight active states, use a soft outer glow of `secondary` (#5adace) at 10% opacity, mimicking the soft light of a firefly.

---

## 5. Components

### Buttons
*   **Primary:** "The Gold Coin." Uses the `primary` to `primary-container` gradient. Border-radius `xl` (1.5rem). Text color: `on-primary` (#3e2e00).
*   **Secondary:** Glassmorphic. `surface-variant` at 20% opacity with a "Ghost Border" of `primary` at 15% opacity.
*   **Tertiary:** Text-only in `primary-fixed-dim` (#edc153) with a subtle underline on hover.

### Cards & Lists
*   **Constraint:** Forbid divider lines. Use `spacing-6` (2rem) or a shift from `surface-container` to `surface-container-high` to separate items.
*   **Interactive Cards:** Should use `rounded-xl` (1.5rem) and a subtle `outline-variant` border at 0.15 opacity. When hovered, the border should transition to `primary` (#f0c456) at 0.3 opacity.

### Input Fields
*   **Visual Style:** Minimalist. No solid backgrounds. Use a bottom-only "Ghost Border" that transforms into a full `secondary` (#5adace) glow when focused.
*   **Micro-copy:** Labels should use `label-sm` in `soft-grey` (#9ca3af), floating above the input to maintain breathing room.

### Special Component: The "Treasure Progress" Bar
For savings goals, use a thick track of `surface-container-highest` with a progress fill of the `secondary` stardust teal. Add a single "sparkle" (a 4px white dot) at the leading edge of the progress fill.

---

## 6. Do’s and Don’ts

### Do:
*   **Do use asymmetrical padding.** Give more breathing room to the top of a section than the bottom to create a "drifting" feel.
*   **Do use Glassmorphism for overlays.** It keeps the "starry" background visible, maintaining the immersive atmosphere.
*   **Do embrace "The Pearl White" (#FFF8F0).** Use this for secondary text that needs to feel high-contrast but warmer than pure white.

### Don’t:
*   **Don’t use pure black (#000000).** It kills the depth of the deep navy theme.
*   **Don’t use sharp corners.** Everything must feel safe and "held." Use `rounded-lg` (1rem) as your absolute minimum.
*   **Don’t use generic icons.** Use "stardust" icons—thin-line icons (1.5pt stroke) with slightly rounded terminals and a soft glow on key nodes.
*   **Don't clutter the grid.** If a screen feels full, increase the spacing tokens. Magical experiences require "breathing room" to feel premium.