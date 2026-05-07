import { StoryConfig } from './types'

/**
 * Story 2 — The First Tooth: Viking Origin (10 scenes).
 * The lore story. Father-daughter. How Tanda became what she is.
 *
 * Expanded to 10 scenes from the bible's 8:
 *  - Scene 2b: Father kneels, really sees what she's holding (warmth beat).
 *  - Scene 10: Tanda's transformation — the folkloric origin moment that
 *    bridges the girl on the cliff to the fairy at the window tonight.
 *
 * Color: cooler than Story 1 — slate blues, hearth amber, sea mist.
 */
const vikingOrigin: StoryConfig = {
  id: 'viking-origin',
  title: 'The First Tooth',
  region: 'A Viking origin',
  emoji: '\u{2693}',
  color: '#8FB4D4',
  description: 'A thousand years ago, a girl and her father made a promise.',
  characterName: 'Young Tanda',
  available: true,
  crossReferences: ['tanda', 'ratoncito-perez'],
  colors: {
    accent: '#8FB4D4',
    accentGlow: '#8FB4D480',
    secondary: '#E8B77A',
    secondaryGlow: '#E8B77A80',
  },
  effects: {
    particles: {
      color: '#CFE1EF',
      count: 16,
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 12,
      durationMax: 22,
      drift: 18,
      glow: false,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    /* ─── COVER ───────────────────────────────────────────────────── */
    {
      id: 'viking-cover',
      layout: 'cover',
      background: '/story-assets/viking-origin/vo-01-village.png',
      dialogue: {
        text: 'The First Tooth',
        subtext: 'A Viking story. How Tanda became who she is.',
      },
    },

    /* ─── Scene 1 · A LONG TIME AGO ──────────────────────────────── */
    {
      id: 'vo-01-village',
      layout: 'narrative',
      background: '/story-assets/viking-origin/vo-01-village.png',
      dialogue: {
        text: "A thousand years ago, in a village by the sea,\n\nthere lived a girl named Tanda,\n\nand her father, who built ships.",
      },
    },

    /* ─── Scene 2 · THE FATHER ───────────────────────────────────── */
    {
      id: 'vo-02-father',
      layout: 'narrative',
      background: '/story-assets/viking-origin/vo-02-father.png',
      dialogue: {
        text: "Her father’s hands were rough from rope and salt.\n\nBut when he held something small — a bird’s feather, a carved boat, a loose tooth —\n\nhe held it like it was the most important thing in the world.",
      },
    },

    /* ─── Scene 2b · THE KNEELING ────────────────────────────────── */
    {
      id: 'vo-02b-kneeling',
      layout: 'dramatic',
      background: '/story-assets/viking-origin/vo-02b-kneeling.png',
      dialogue: {
        text: "Tanda ran to him with her hand closed tight.",
        subtext: "He knelt down — all the way down, to her eyes — so he wouldn’t miss a thing.",
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: "“It fell out at breakfast.”",
      },
      thirdDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: "“Show me.”",
      },
    },

    /* ─── Scene 3 · THE TOOTH ────────────────────────────────────── */
    {
      id: 'vo-03-tooth',
      layout: 'dramatic',
      background: '/story-assets/viking-origin/vo-03-tooth.png',
      dialogue: {
        text: "She opened her palm.",
        subtext: "A tiny white tooth. His weathered hand reached toward it — slow, careful, like touching an egg.",
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: "“Do you know what this is?”",
      },
      thirdDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: "“It’s proof. Proof that you’re growing. Proof that right now, today, you are exactly this old and no older.”",
      },
    },

    /* ─── Scene 4 · THE TALISMAN ─────────────────────────────────── */
    {
      id: 'vo-04-talisman',
      layout: 'narrative',
      background: '/story-assets/viking-origin/vo-04-talisman.png',
      dialogue: {
        text: "He threaded the tooth onto a leather cord and tied it around his own neck.\n\n“Where you go, a part of me goes,” Tanda said.\n\n“No,” her father said. “Where I go, a part of you goes.\n\nYour courage. Your smallness. Your laugh. I carry it so I never forget who I’m coming home to.”",
      },
    },

    /* ─── Scene 5 · THE DEPARTURE ────────────────────────────────── */
    {
      id: 'vo-05-departure',
      layout: 'narrative',
      background: '/story-assets/viking-origin/vo-05-departure.png',
      dialogue: {
        text: "He sailed the next morning.\n\nTanda watched until the ship was smaller than her thumbnail.\n\nShe didn’t cry. She knew he carried something of hers — and that meant he’d come back.",
      },
    },

    /* ─── Scene 6 · THE WAITING ──────────────────────────────────── */
    {
      id: 'vo-06-waiting',
      layout: 'narrative',
      background: '/story-assets/viking-origin/vo-06-waiting.png',
      dialogue: {
        text: "Weeks became months.\n\nTanda lost another tooth. And another. She kept each one in a small wooden box her father had carved.\n\n“When he comes back,” she thought, “I’ll show him how much I’ve grown.”",
      },
    },

    /* ─── Scene 7 · THE RETURN ───────────────────────────────────── */
    {
      id: 'vo-07-return',
      layout: 'victory',
      background: '/story-assets/viking-origin/vo-07-return.png',
      dialogue: {
        text: 'The ship came home.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: "She ran so fast she lost a sandal. Her father knelt, arms open, the tooth pendant still at his neck.",
      },
      thirdDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: "“You grew.” “I grew,” she said. And for a moment they both held something small and important and didn’t say anything at all.",
      },
    },

    /* ─── Scene 8 · THE PROMISE ──────────────────────────────────── */
    {
      id: 'vo-08-promise',
      layout: 'dramatic',
      background: '/story-assets/viking-origin/vo-08-promise.png',
      dialogue: {
        text: "Years passed. Tanda turned ten.",
        subtext: "She sat alone on a cliff above the sea, the leather cord around her neck now, her box of teeth full on her lap.",
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: "“It matters,” she whispered to the stars. “Every one of them. And I’ll make sure no one ever forgets.”",
      },
    },

    /* ─── Scene 9 · THE TRANSFORMATION ───────────────────────────── */
    {
      id: 'vo-09-transformation',
      layout: 'dramatic',
      background: '/story-assets/viking-origin/vo-09-transformation.png',
      dialogue: {
        text: "That promise was the beginning.",
        subtext: "At the edges of her, something golden began to form. Not magic she had asked for — magic the promise had called forward.",
      },
      secondDialogue: {
        text: "Wings. A pouch at her hip. Eyes that would grow kind and tired over a thousand years.",
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "She stood up as someone new.\n\nAnd somewhere, far from that cliff, a child’s tooth fell out — and Tanda knew exactly where to go.",
      },
    },

    /* ─── CTA ────────────────────────────────────────────────────── */
    {
      id: 'viking-cta',
      layout: 'cta',
      background: '/story-assets/viking-origin/vo-09-transformation.png',
      dialogue: {
        text: 'Your child’s tooth is proof they’re growing.',
        subtext: 'Keep it somewhere nothing can fade. Start their keepsake tonight.',
      },
      isChoice: true,
      choiceText: 'Start the keepsake →',
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default vikingOrigin
