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
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'pz-01',
      background: '/story-assets/perez/pz-01-bedroom.jpg',
      dialogue: {
        text: "In a little house in Madrid, a tooth has been wobbling all day long.",
      },
    },
    {
      id: 'pz-02',
      background: '/story-assets/perez/pz-01-bedroom.jpg',
      dialogue: {
        text: "And tonight... it finally fell out! Under the pillow it goes.",
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
      },
    },
    {
      id: 'pz-05',
      background: '/story-assets/perez/pz-02-madrid-bakery.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'left',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I live behind the walls of a bakery on Calle del Arenal. Very cozy. Very secret.",
      },
    },
    {
      id: 'pz-06',
      background: '/story-assets/perez/pz-02-madrid-bakery.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'left',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I've been doing this since 1894 — when the young King of Spain lost his first tooth and asked for ME.",
      },
    },
    {
      id: 'pz-07',
      background: '/story-assets/perez/pz-03-sneaking-palace.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Every night, I squeeze through tiny cracks... past sleeping cats... under creaky doors...",
      },
    },
    {
      id: 'pz-08',
      background: '/story-assets/perez/pz-03-sneaking-palace.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I must be VERY quiet. A mouse on a mission!",
      },
    },
    {
      id: 'pz-09',
      background: '/story-assets/perez/pz-04-at-pillow.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I find the tooth. I inspect it carefully — yes, this is a good one.",
      },
    },
    {
      id: 'pz-10',
      background: '/story-assets/perez/pz-04-at-pillow.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'right',
        exit: 'top',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I leave a shiny coin. And then I run — fast as my little legs can carry me!",
      },
    },
    {
      id: 'pz-11',
      background: '/story-assets/perez/pz-05-rooftop.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Up through the rooftops of Madrid, past the stars, to a place you won't believe...",
      },
    },
    {
      id: 'pz-12',
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
    },
    {
      id: 'pz-13',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-perez.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Your tooth becomes a keepsake here. A treasure no one can ever take.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'pz-14',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "I'm not the only collector, you know. In North America, a fairy does this. In Romania, a crow carries teeth through the Carpathian Mountains! And in Korea, a magpie sings for them!",
      },
    },
    {
      id: 'pz-15',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "And the best part? Your family gets to see your keepsake.",
      },
    },
    {
      id: 'pz-16',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "Abuela, tío, prima — everyone who loves you can add their own love to it.",
      },
    },
    {
      id: 'pz-17',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "It grows bigger and bigger, safe in the Network...",
      },
    },
    {
      id: 'pz-18',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Pérez',
        speakerColor: '#E8A820',
        text: "And one day, when you are big and tall, all that love comes back to you. That is the magic of Ratoncito Pérez!",
      },
    },
    {
      id: 'pz-19',
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
    {
      id: 'pz-cta',
      background: '/story-assets/perez/pz-05-rooftop.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/toothfairy/app",
    },
  ],
}

export default ratoncitoPerez
