import { StoryConfig } from './types'

const finland: StoryConfig = {
  id: 'finland',
  title: 'Hammaskeiju vs. Hammaspeikko',
  region: 'Finland',
  emoji: '❄️',
  color: '#7CC6FE',
  description: 'The Tooth Fairy battles the Tooth Troll',
  characterName: 'Hammaskeiju',
  available: true,
  crossReferences: ['ratoncito-perez', 'north-africa', 'jamaica'],
  colors: {
    accent: '#7CC6FE',
    accentGlow: '#7CC6FE80',
    secondary: '#8B3A62',
    secondaryGlow: '#8B3A6280',
  },
  effects: {
    particles: {
      color: '#FFFFFF',
      count: 40,
      sizeMin: 2,
      sizeMax: 6,
      durationMin: 5,
      durationMax: 13,
      drift: 30,
    },
    aurora: {
      colors: ['#00FF88', '#7CC6FE', '#A855F7'],
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // Scene 1 — Cover
    {
      id: 'fi-01',
      layout: 'cover',
      background: '/story-assets/finland/fi-01-bedroom.jpg',
      dialogue: {
        text: 'Hammaskeiju\nvs.\nHammaspeikko',
        subtext: 'A Finnish Tooth Fairy Tale',
      },
    },

    // Scene 2 — Setting the stage
    {
      id: 'fi-02',
      layout: 'narrative',
      background: '/story-assets/finland/fi-01-bedroom.jpg',
      dialogue: {
        text: 'Deep in Finland, where the northern lights paint the sky, a tooth just fell out.',
      },
    },

    // Scene 3 — The twist: two visitors
    {
      id: 'fi-03',
      layout: 'narrative',
      background: '/story-assets/finland/fi-01-bedroom.jpg',
      dialogue: {
        text: "Pop! Under the pillow it goes.\n\nBut in Finland, it's not just ONE visitor who comes tonight.\n\nIt's TWO.\n\nAnd they're racing.",
      },
    },

    // Scene 4 — Troll introduction
    {
      id: 'fi-04',
      layout: 'character',
      background: '/story-assets/finland/fi-02-troll-forest.jpg',
      character: {
        image: '/story-assets/characters/char-finnish-troll.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Hammaspeikko',
        speakerColor: '#8B3A62',
        text: 'Heheheh... I smell a fresh tooth!',
        subtext: 'The Tooth Troll. He LOVES dirty teeth. The dirtier, the better. If he gets there first, he drills little holes in the next one.',
      },
    },

    // Scene 5 — Fairy introduction
    {
      id: 'fi-05',
      layout: 'character',
      background: '/story-assets/finland/fi-03-fairy-aurora.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Hammaskeiju',
        speakerColor: '#7CC6FE',
        text: 'Not tonight, Troll.',
        subtext: "The Tooth Fairy of Finland. She's fast, she's brave, and she NEVER lets the Troll win.",
      },
    },

    // Scene 6 — The race (dramatic: two dialogue bubbles)
    {
      id: 'fi-06',
      layout: 'dramatic',
      background: '/story-assets/finland/fi-04-the-race.jpg',
      dialogue: {
        speaker: 'Troll',
        speakerColor: '#8B3A62',
        text: 'Catch me if you can, Fairy!',
      },
      secondDialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: 'This child brushed every single night. That tooth is MINE.',
      },
    },

    // Scene 7 — Fairy wins (victory: dialogue exchange)
    {
      id: 'fi-07',
      layout: 'victory',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        text: 'The Fairy reaches the pillow first!',
      },
      secondDialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: 'Got it! A perfect, clean tooth.',
      },
      thirdDialogue: {
        speaker: 'Troll',
        speakerColor: '#8B3A62',
        text: "Grrrr... FINE. But tell that child \u2014 if they ever SKIP brushing...",
      },
    },

    // Scene 8 — Network station
    {
      id: 'fi-08',
      layout: 'narrative',
      background: '/story-assets/shared/shared-network-station.jpg',
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: 'Your tooth becomes a keepsake in the Tooth Fairy Network \u2014 safe from trolls forever.',
      },
    },

    // Scene 9 — CTA
    {
      id: 'fi-cta',
      layout: 'cta',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        text: 'Ready? Let the Fairy carry YOUR tooth to the Network!',
      },
      isChoice: true,
      choiceText: 'Now make yours',
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default finland
