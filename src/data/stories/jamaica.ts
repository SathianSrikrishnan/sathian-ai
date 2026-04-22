import { StoryConfig } from './types'

const jamaica: StoryConfig = {
  id: 'jamaica',
  title: 'The Rolling Calf',
  region: 'Jamaica / Caribbean',
  emoji: '🐂',
  color: '#E74C3C',
  description: 'Shake your tin can and scare the bull!',
  characterName: 'Granny',
  available: true,
  crossReferences: ['ratoncito-perez', 'romania', 'north-africa'],
  colors: {
    accent: '#E74C3C',
  },
  effects: {
    particles: {
      count: 15,
      color: '#4FD1C5',
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 3,
      durationMax: 7,
      drift: 25,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // COVER
    {
      id: 'jm-01',
      layout: 'cover',
      background: '/story-assets/jamaica/jm-01-bedroom.jpg',
      dialogue: {
        text: 'The Rolling Calf',
        subtext: 'A bedtime story from Jamaica',
      },
    },
    // ACT 1: THE FAMILIAR
    {
      id: 'jm-02',
      layout: 'character',
      background: '/story-assets/jamaica/jm-01-bedroom.jpg',
      character: {
        image: '/story-assets/characters/char-granny-jamaica.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "So! Your tooth fell out! Well, well, well...",
        subtext: 'Keeper of Jamaican folk wisdom and protector of children',
      },
    },
    {
      id: 'jm-03',
      background: '/story-assets/jamaica/jm-01-bedroom.jpg',
      character: {
        image: '/story-assets/characters/char-granny-jamaica.jpg',
        position: 'right',
      },
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "Let me tell you something, child. In Jamaica, we don't just put a tooth under a pillow. Because something is coming. Something BIG.",
      },
    },
    // ACT 2: THE ROLLING CALF
    {
      id: 'jm-04',
      layout: 'dramatic',
      background: '/story-assets/jamaica/jm-02-rolling-calf.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: 'The Rolling Calf. A bull with fire in its eyes and chains dragging behind it.',
      },
      secondDialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: 'It wants your tooth. If it gets your tooth, it gets POWER over you.',
      },
    },
    {
      id: 'jm-05',
      background: '/story-assets/jamaica/jm-03-shaking-can.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "But HERE is what you do. You grab a tin can — any tin can — and you SHAKE IT! RATTA RATTA RATTA! The Rolling Calf HATES that sound!",
      },
    },
    {
      id: 'jm-06',
      background: '/story-assets/jamaica/jm-04-roof-throw.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "See? It's running! That big scary bull, scared of a little tin can! Now QUICK — throw your tooth to the roof! High as you can!",
      },
    },
    {
      id: 'jm-07',
      background: '/story-assets/jamaica/jm-05-granny.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: 'And say: Ratta ratta, take my tooth, bring me one that tells the truth!',
      },
    },
    // THE NETWORK
    {
      id: 'jm-08',
      layout: 'victory',
      background: '/story-assets/shared/shared-network-station.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "And where does it go? UP. Past the stars. To the Tooth Fairy Network — where every tooth from every brave child is kept safe.",
      },
      secondDialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "No Rolling Calf can reach it there. It's YOURS forever.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'jm-09',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "Children everywhere are brave like you! In Spain, a little mouse sneaks past CATS. In Egypt, children throw their tooth at the SUN! Your whole family can see your keepsake — your cousins, your aunties, your grandad too. It grows and grows, and one day, all that love comes RIGHT back to you.",
      },
    },
    {
      id: 'jm-10',
      background: '/story-assets/jamaica/jm-05-granny.jpg',
      character: {
        image: '/story-assets/characters/char-granny-jamaica.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: 'So what are you waiting for? Show me that smile!',
      },
    },
    // CTA
    {
      id: 'jm-cta',
      layout: 'cta',
      background: '/story-assets/jamaica/jm-05-granny.jpg',
      dialogue: {
        text: '',
      },
      isChoice: true,
      choiceText: 'Now make yours ✦',
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default jamaica
