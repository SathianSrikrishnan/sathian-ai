import { StoryConfig } from './types'

/**
 * Story 3 — El Ratoncito Pérez: The Mouse of Madrid (8 scenes).
 * The broadener. Shows the Network is global — other collectors exist,
 * and they all converge on the same place. Ends on a world-map view
 * that links to the globe explore page.
 *
 * Color palette: warm Mediterranean — terracotta, moonlight blue, candle gold.
 */
const ratoncitoPerez: StoryConfig = {
  id: 'ratoncito-perez',
  title: 'El Ratoncito Pérez',
  region: 'Madrid, Spain',
  emoji: '\u{1F42D}',
  color: '#E8A820',
  description: 'In Madrid, teeth don’t go under pillows. They go into a glass by the bed — and someone very small comes for them.',
  characterName: 'Ratoncito Pérez',
  available: true,
  crossReferences: ['tanda', 'viking-origin'],
  colors: {
    accent: '#E8A820',
    accentGlow: '#E8A82080',
    secondary: '#F0C456',
    secondaryGlow: '#F0C45680',
  },
  effects: {
    particles: {
      color: '#E8A820',
      count: 14,
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 8,
      durationMax: 14,
      drift: 16,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    /* ─── COVER ───────────────────────────────────────────────────── */
    {
      id: 'perez-cover',
      layout: 'cover',
      background: '/story-assets/ratoncito-perez/rp-02-mouse.png',
      dialogue: {
        text: 'El Ratoncito Pérez',
        subtext: 'A tooth story from Madrid.',
      },
    },

    /* ─── Scene 1 · MADRID ───────────────────────────────────────── */
    {
      id: 'rp-01-madrid',
      layout: 'narrative',
      background: '/story-assets/ratoncito-perez/rp-01-madrid.png',
      dialogue: {
        text: "In Madrid, when you lose a tooth,\n\nyou don’t put it under your pillow.\n\nYou put it in a glass of water by your bed.\n\nAnd you wait for someone very small.",
      },
    },

    /* ─── Scene 2 · THE MOUSE ────────────────────────────────────── */
    {
      id: 'rp-02-mouse',
      layout: 'narrative',
      background: '/story-assets/ratoncito-perez/rp-02-mouse.png',
      characterAvatar: {
        image: '/story-assets/characters/char-perez.jpg',
        alt: 'Ratoncito Pérez',
      },
      dialogue: {
        speaker: 'Ratoncito Pérez',
        speakerColor: '#E8A820',
        text: "His name is El Ratoncito Pérez.\n\nHe’s a mouse — but not an ordinary one.\n\nHe’s been collecting teeth in Spain for over a hundred years. He lives behind a cookie tin in a bakery on Calle del Arenal.\n\n(That’s a real street. You could visit.)",
      },
    },

    /* ─── Scene 3 · THE COLLECTION ───────────────────────────────── */
    {
      id: 'rp-03-collection',
      layout: 'narrative',
      background: '/story-assets/ratoncito-perez/rp-03-collection.png',
      characterAvatar: {
        image: '/story-assets/characters/char-perez.jpg',
        alt: 'Ratoncito Pérez',
      },
      dialogue: {
        text: "Every tooth he collects goes into his collection.\n\nNot a pile — a collection. Each one labeled. Each one remembered.\n\nHe knows whose tooth fell out on a Tuesday in October. He knows which ones were wiggly for weeks, and which ones surprised everyone at dinner.",
      },
    },

    /* ─── Scene 4 · THE PROBLEM ──────────────────────────────────── */
    {
      id: 'rp-04-problem',
      layout: 'dramatic',
      background: '/story-assets/ratoncito-perez/rp-04-problem.png',
      characterAvatar: {
        image: '/story-assets/characters/char-perez.jpg',
        alt: 'Ratoncito Pérez',
      },
      dialogue: {
        text: "But Ratoncito has a problem.",
        subtext: "His shelves are full. And the oldest teeth — from children who are grandparents now — are starting to fade.",
      },
      secondDialogue: {
        speaker: 'Ratoncito Pérez',
        speakerColor: '#E8A820',
        text: "“I can’t keep them all safe by myself,” he said, very quietly. “Not anymore.”",
      },
    },

    /* ─── Scene 5 · THE MESSAGE ──────────────────────────────────── */
    {
      id: 'rp-05-message',
      layout: 'dramatic',
      background: '/story-assets/ratoncito-perez/rp-05-message.png',
      characterAvatar: {
        image: '/story-assets/characters/char-perez.jpg',
        alt: 'Ratoncito Pérez',
      },
      dialogue: {
        text: "Then one night, a letter arrived.",
        subtext: "Tiny, golden, and warm to the touch — sealed with the mark of a tooth with wings.",
      },
      secondDialogue: {
        speaker: 'Ratoncito Pérez',
        speakerColor: '#E8A820',
        text: "He read it by candlelight. His whiskers trembled. Someone, somewhere, had been solving his exact problem — for the whole world.",
      },
    },

    /* ─── Scene 6 · THE MEETING ──────────────────────────────────── */
    {
      id: 'rp-06-meeting',
      layout: 'dramatic',
      background: '/story-assets/ratoncito-perez/rp-06-meeting.png',
      dialogue: {
        text: "They met on a Madrid rooftop.",
        subtext: "The city glowed below them. Stars above. A fairy and a mouse, at exactly the same height.",
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: "“You keep teeth too.”",
      },
      thirdDialogue: {
        speaker: 'Ratoncito Pérez',
        speakerColor: '#E8A820',
        text: "“For a hundred years.” “I’ve been doing it for a thousand,” Tanda said. “And I found a way to make sure they never fade. Would you like to see?”",
      },
    },

    /* ─── Scene 7 · THE NETWORK ──────────────────────────────────── */
    {
      id: 'rp-07-network',
      layout: 'victory',
      background: '/story-assets/ratoncito-perez/rp-07-network.png',
      characterAvatar: {
        image: '/story-assets/characters/char-perez.jpg',
        alt: 'Ratoncito Pérez',
      },
      dialogue: {
        text: 'A place where kept teeth stay kept.',
      },
      secondDialogue: {
        speaker: 'Ratoncito Pérez',
        speakerColor: '#E8A820',
        text: "He placed his oldest, most faded tooth into the Network. It glowed warm again. Bright.",
      },
      thirdDialogue: {
        speaker: 'Ratoncito Pérez',
        speakerColor: '#E8A820',
        text: "“María,” he whispered. “She was six. She lost this tooth eating an apple.” The Network remembered. It all came back.",
      },
    },

    /* ─── Scene 8 · THE INVITATION ───────────────────────────────── */
    {
      id: 'rp-08-invitation',
      layout: 'narrative',
      background: '/story-assets/ratoncito-perez/rp-08-invitation.png',
      dialogue: {
        text: "Ratoncito wasn’t the first to join. He wasn’t the last.\n\nAll over the world, collectors had been working alone — keeping teeth, keeping memories, running out of room.\n\nNow they have a place to bring them. Every tradition. Every culture. Every tooth that ever mattered to a child.\n\nThe Tooth Fairy Network isn’t one fairy’s idea. It’s everyone’s.",
      },
    },

    /* ─── CTA ────────────────────────────────────────────────────── */
    {
      id: 'perez-cta',
      layout: 'cta',
      background: '/story-assets/ratoncito-perez/rp-08-invitation.png',
      dialogue: {
        text: 'There are collectors all over the world.',
        subtext: 'Every culture keeps teeth differently. See who else is waiting on your child’s first one.',
      },
      isChoice: true,
      choiceText: 'Make your child’s keepsake →',
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default ratoncitoPerez
