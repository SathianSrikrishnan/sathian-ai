import { StoryConfig } from './types'

/**
 * Story 1 — Tanda: Tonight (10 scenes + CTA).
 * The converter. Set in the child's bedroom tonight.
 * Scene 8 is the interactive Tell prompt — captures the child's answer,
 * pre-fills the keepsake flow, then story continues to 9–10 payoff.
 *
 * Narration adapted from the TFN Story Bible, polished for read-aloud rhythm
 * at ages 4–8. Theme: preservation, not value creation. The tooth is a piece
 * of childhood that's disappearing; Tanda's job is to make sure it isn't lost.
 */
const tanda: StoryConfig = {
  id: 'tanda',
  title: 'Tanda',
  region: 'Tonight',
  emoji: '\u{1FAB6}',
  color: '#F0C456',
  description: 'The night the Tooth Fairy pauses at your window.',
  characterName: 'Tanda',
  available: true,
  crossReferences: ['viking-origin', 'ratoncito-perez'],
  colors: {
    accent: '#F0C456',
    accentGlow: '#F0C45680',
    secondary: '#E0A830',
    secondaryGlow: '#E0A83080',
  },
  effects: {
    particles: {
      color: '#F0C456',
      count: 22,
      sizeMin: 2,
      sizeMax: 5,
      durationMin: 10,
      durationMax: 18,
      drift: 24,
      glow: true,
    },
    aurora: {
      colors: ['#F0C456', '#E0A830', '#D4A843'],
      bands: 3,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    /* ─── COVER ───────────────────────────────────────────────────── */
    {
      id: 'tanda-cover',
      layout: 'cover',
      background: '/story-assets/tanda/tf-05-tanda.png',
      dialogue: {
        text: 'Tanda',
        subtext: 'A bedtime story about the night your tooth was kept.',
      },
    },

    /* ─── Scene 1 · TONIGHT ──────────────────────────────────────── */
    {
      id: 'tanda-01-tonight',
      layout: 'narrative',
      background: '/story-assets/tanda/tf-01-tonight.png',
      dialogue: {
        text: "Tonight is different. You can feel it.\n\nRight there on your bed — so tiny you almost can’t believe it was ever inside you — is your tooth.",
      },
    },

    /* ─── Scene 2 · THE WIGGLE MEMORY ────────────────────────────── */
    {
      id: 'tanda-02-wiggle',
      layout: 'narrative',
      background: '/story-assets/tanda/tf-02-wiggle.png',
      dialogue: {
        text: "You wiggled it for days. At breakfast. During math. In the bath.\n\nAnd then — pop — there it was in your hand.\n\nSo small. So yours.",
      },
    },

    /* ─── Scene 3 · UNDER THE PILLOW ─────────────────────────────── */
    {
      id: 'tanda-03-pillow',
      layout: 'narrative',
      background: '/story-assets/tanda/tf-03-pillow.png',
      dialogue: {
        text: "You tuck it under your pillow because that’s what you’re supposed to do.\n\nBut tonight, you peek one more time before you close your eyes.\n\nYou don’t really want to let it go.",
      },
    },

    /* ─── Scene 4 · THE FLICKER ──────────────────────────────────── */
    {
      id: 'tanda-04-flicker',
      layout: 'dramatic',
      background: '/story-assets/tanda/tf-04-flicker.png',
      dialogue: {
        text: "A light outside your window.",
        subtext: "Quick, like someone running late.",
      },
    },

    /* ─── Scene 5 · TANDA ARRIVES ────────────────────────────────── */
    {
      id: 'tanda-05-tanda',
      layout: 'narrative',
      background: '/story-assets/tanda/tf-05-tanda.png',
      characterAvatar: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        alt: 'Tanda',
      },
      dialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "Her name is Tanda.\n\nShe’s been doing this for a very, very long time. Longer than your grandma. Longer than your grandma’s grandma.\n\nShe looks a little tired tonight — but she always comes.",
      },
    },

    /* ─── Scene 6 · THE PROBLEM ──────────────────────────────────── */
    {
      id: 'tanda-06-problem',
      layout: 'dramatic',
      background: '/story-assets/tanda/tf-06-problem.png',
      characterAvatar: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        alt: 'Tanda',
      },
      dialogue: {
        text: "She pauses at your window and looks out at the sky.",
        subtext: "Out there, faint teeth drift like lost balloons. One of them winks out.",
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "“There are so many I couldn’t get to,” she says quietly. “Teeth nobody kept. And when nobody keeps them, the little things inside start to slip away.",
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "What it felt like to be five. The sound of your laugh at six. Gone — like they were never there.”",
      },
    },

    /* ─── Scene 7 · YOUR TOOTH ───────────────────────────────────── */
    {
      id: 'tanda-07-your-tooth',
      layout: 'dramatic',
      background: '/story-assets/tanda/tf-07-your-tooth.png',
      characterAvatar: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        alt: 'Tanda',
      },
      dialogue: {
        text: "She lifts your tooth from under the pillow.",
        subtext: "In her hand, it begins to glow — warm and gold, like a tiny ember.",
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "“But yours — yours is still warm. That means someone cares about it.”",
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "“That means there’s still time.”",
      },
    },

    /* ─── Scene 8 · THE QUESTION (INTERACTIVE) ───────────────────── */
    {
      id: 'tanda-08-question',
      layout: 'interactive',
      background: '/story-assets/tanda/tf-08-question.png',
      characterAvatar: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        alt: 'Tanda',
      },
      dialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "She looks at you — really looks — and asks:",
        subtext: "“What do you want to remember about this tooth? The day it fell out? The meal that loosened it? The face you made? Tell me — and I’ll make sure you never forget.”",
      },
      interactive: {
        prompt: 'Write a little about this tooth — for the keepsake',
        placeholder: 'e.g. It fell out eating an apple at lunch. Everyone laughed but I didn’t cry.',
        storageKey: 'tfn-tell-text',
        contextKey: 'tfn-story-context',
        ctaLabel: 'Tell Tanda →',
        skipLabel: 'Keep reading',
      },
    },

    /* ─── Scene 9 · THE KEEPING ──────────────────────────────────── */
    {
      id: 'tanda-09-keeping',
      layout: 'dramatic',
      background: '/story-assets/tanda/tf-09-keeping.png',
      characterAvatar: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        alt: 'Tanda',
      },
      dialogue: {
        text: "Tanda carries your tooth — and your words — to a place where nothing fades.",
        subtext: "Every tooth there holds a story. Every story belongs to the child who lived it.",
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "“This is you. Right now. At this exact age.",
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "One day you’ll be taller. Your voice will change. You’ll forget what this year felt like. But this? This remembers.”",
      },
    },

    /* ─── Scene 10 · THE RETURN ──────────────────────────────────── */
    {
      id: 'tanda-10-return',
      layout: 'victory',
      background: '/story-assets/tanda/tf-10-return.png',
      characterAvatar: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        alt: 'Tanda',
      },
      dialogue: {
        text: 'Dawn is coming.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "“I’ll be back for the next one. And I won’t be the only one — there are collectors all over the world. You’ll meet them.”",
      },
      thirdDialogue: {
        text: "She slips through the window and is gone.\n\nBut under your pillow, where your tooth used to be, something glows.",
      },
    },

    /* ─── CTA ────────────────────────────────────────────────────── */
    {
      id: 'tanda-cta',
      layout: 'cta',
      background: '/story-assets/tanda/tf-10-return.png',
      dialogue: {
        text: 'Keep your child’s first tooth forever.',
        subtext: 'Make the keepsake tonight — photo, story, signed by the people who love them.',
      },
      isChoice: true,
      choiceText: 'Join the Tooth Fairy Network →',
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default tanda
