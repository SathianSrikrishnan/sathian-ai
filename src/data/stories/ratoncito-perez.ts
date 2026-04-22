import { StoryConfig } from './types'

const ratoncitoPerez: StoryConfig = {
  id: 'ratoncito-perez',
  title: 'Ratoncito Pérez',
  region: 'Spain & Latin America',
  emoji: '🐭',
  color: '#E8A820',
  description: 'The Tooth Mouse of Spain',
  characterName: 'Ratoncito Pérez',
  available: true,
  crossReferences: ['tooth-fairy', 'romania', 'korea'],
  colors: {
    accent: '#E8A820',
  },
  effects: {
    particles: {
      count: 15,
      color: '#E8A820',
      sizeMin: 1,
      sizeMax: 2,
      durationMin: 6,
      durationMax: 10,
      drift: 15,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // COVER
    {
      id: 'pz-01',
      layout: 'cover',
      background: '/story-assets/perez/pz-01-bedroom.jpg',
      dialogue: {
        text: 'Ratoncito Pérez',
        subtext: 'A bedtime story from Spain & Latin America',
      },
    },
    // ACT 1: THE FAMILIAR
    {
      id: 'pz-02',
      background: '/story-assets/perez/pz-01-bedroom.jpg',
      dialogue: {
        text: "In a little house in Madrid, a tooth has been wobbling all day long. And tonight... it finally fell out! Under the pillow it goes.",
      },
    },
    {
      id: 'pz-03',
      background: '/story-assets/perez/pz-01-bedroom.jpg',
      dialogue: {
        text: "But in Spain, it's not a fairy who comes for your tooth...",
      },
    },
    // ACT 2: THE REVEAL
    {
      id: 'pz-04',
      layout: 'character',
      background: '/story-assets/perez/pz-02-madrid-bakery.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "¡Buenas noches! I am Ratoncito Pérez — the Tooth Mouse of Spain.",
        subtext: "Royal tooth collector since 1894, living behind the walls of a Madrid bakery",
      },
    },
    {
      id: 'pz-05',
      layout: 'dramatic',
      background: '/story-assets/perez/pz-02-madrid-bakery.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'left',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I've been doing this since the young King of Spain lost his first tooth and asked for ME.",
      },
      secondDialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I live behind the walls of a bakery on Calle del Arenal. Very cozy. Very secret.",
      },
    },
    // THE MISSION
    {
      id: 'pz-06',
      background: '/story-assets/perez/pz-03-sneaking-palace.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Every night, I squeeze through tiny cracks... past sleeping cats... under creaky doors... I must be VERY quiet. A mouse on a mission!",
      },
    },
    {
      id: 'pz-07',
      background: '/story-assets/perez/pz-04-at-pillow.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I find the tooth. I inspect it carefully — yes, this is a good one. I leave a shiny coin. And then I run — fast as my little legs can carry me!",
      },
    },
    {
      id: 'pz-08',
      background: '/story-assets/perez/pz-05-rooftop.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Up through the rooftops of Madrid, past the stars, to a place you won't believe...",
      },
    },
    // THE NETWORK
    {
      id: 'pz-09',
      layout: 'victory',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "The Tooth Fairy Network! Where ALL of us deliver — fairies, mice, crows, even a beaver!",
      },
      secondDialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Your tooth becomes a keepsake here. A treasure no one can ever take.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'pz-10',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I'm not the only collector, you know. In North America, a fairy does this. In Romania, a crow carries teeth through the Carpathian Mountains! Your family — abuela, tío, prima — everyone who loves you can add their love to your keepsake. And one day, all that love comes back to you. That is the magic of Ratoncito Pérez!",
      },
    },
    {
      id: 'pz-11',
      background: '/story-assets/perez/pz-05-rooftop.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Now then — shall we begin? Show me your smile!",
      },
    },
    // CTA
    {
      id: 'pz-cta',
      layout: 'cta',
      background: '/story-assets/perez/pz-05-rooftop.jpg',
      dialogue: {
        text: '',
      },
      isChoice: true,
      choiceText: 'Now make yours ✦',
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default ratoncitoPerez
