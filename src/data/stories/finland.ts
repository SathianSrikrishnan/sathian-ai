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
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'fi-01',
      background: '/story-assets/finland/fi-01-bedroom.jpg',
      dialogue: {
        text: "Deep in Finland, where the northern lights paint the sky, a tooth just fell out.",
      },
    },
    {
      id: 'fi-02',
      background: '/story-assets/finland/fi-01-bedroom.jpg',
      dialogue: {
        text: "Under the pillow it goes. But in Finland, it's not just ONE visitor who comes tonight...",
      },
    },
    {
      id: 'fi-03',
      background: '/story-assets/finland/fi-01-bedroom.jpg',
      dialogue: {
        text: "It's TWO. And they're racing.",
      },
    },
    // ACT 2: THE CHASE
    {
      id: 'fi-04',
      background: '/story-assets/finland/fi-02-troll-forest.jpg',
      character: {
        image: '/story-assets/characters/char-finnish-troll.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Troll',
        speakerColor: '#8B3A62',
        text: "Heheheh... I smell a fresh tooth!",
      },
    },
    {
      id: 'fi-05',
      background: '/story-assets/finland/fi-02-troll-forest.jpg',
      character: {
        image: '/story-assets/characters/char-finnish-troll.jpg',
        position: 'left',
      },
      dialogue: {
        text: "The Hammaspeikko — the Tooth Troll. He LOVES dirty teeth. The dirtier, the better.",
      },
    },
    {
      id: 'fi-06',
      background: '/story-assets/finland/fi-02-troll-forest.jpg',
      character: {
        image: '/story-assets/characters/char-finnish-troll.jpg',
        position: 'left',
        exit: 'right',
      },
      dialogue: {
        speaker: 'Troll',
        speakerColor: '#8B3A62',
        text: "If I get there first, I'll drill little holes in the next one. Cavities are my FAVORITE!",
      },
    },
    {
      id: 'fi-07',
      background: '/story-assets/finland/fi-03-fairy-aurora.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "Not tonight, Troll.",
      },
    },
    {
      id: 'fi-08',
      background: '/story-assets/finland/fi-03-fairy-aurora.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'right',
      },
      dialogue: {
        text: "The Hammaskeiju — the Tooth Fairy of Finland! She's fast, she's brave, and she NEVER lets the Troll win.",
      },
    },
    {
      id: 'fi-09',
      background: '/story-assets/finland/fi-03-fairy-aurora.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'right',
      },
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "This child brushed every single night. That tooth is MINE.",
      },
    },
    {
      id: 'fi-10',
      background: '/story-assets/finland/fi-04-the-race.jpg',
      dialogue: {
        speaker: 'Troll',
        speakerColor: '#8B3A62',
        text: "Catch me if you can, Fairy!",
      },
    },
    {
      id: 'fi-11',
      background: '/story-assets/finland/fi-04-the-race.jpg',
      dialogue: {
        text: "They race across the frozen sky — over pine trees, under the northern lights...",
      },
    },
    {
      id: 'fi-12',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        text: "The Fairy reaches the pillow first!",
      },
    },
    {
      id: 'fi-13',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "Got it! A perfect, clean tooth.",
      },
    },
    {
      id: 'fi-14',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      character: {
        image: '/story-assets/characters/char-finnish-troll.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Troll',
        speakerColor: '#8B3A62',
        text: "Grrrr... FINE. But tell that child — if they ever SKIP brushing...",
      },
    },
    {
      id: 'fi-15',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "They won't. Because children who brush always win.",
      },
    },
    // ACT 2B: THE NETWORK
    {
      id: 'fi-16',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "I carry the tooth to the Tooth Fairy Network — safe from trolls forever.",
      },
    },
    {
      id: 'fi-17',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "Your tooth becomes a keepsake. The Troll can never reach it here.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'fi-18',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "We're not alone. In Spain, a brave little mouse does this! In Egypt, children throw their tooth to the SUN! And in Jamaica, there's a demon bull — but the children outsmart it every time!",
      },
    },
    {
      id: 'fi-19',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "Your family can see your keepsake — and each of them can add their love to it.",
      },
    },
    {
      id: 'fi-20',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "It grows, safe from trolls, year after year...",
      },
    },
    {
      id: 'fi-21',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "And one day, all that love comes back to you. The Troll never wins.",
      },
    },
    {
      id: 'fi-22',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      character: {
        image: '/story-assets/characters/char-finish-fairy.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Fairy',
        speakerColor: '#7CC6FE',
        text: "Ready? Take your photo, and let me carry YOUR tooth to the Network!",
      },
    },
    {
      id: 'fi-cta',
      background: '/story-assets/finland/fi-05-fairy-wins.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/app",
    },
  ],
}

export default finland
