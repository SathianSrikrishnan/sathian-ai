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
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'jm-01',
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
      },
    },
    {
      id: 'jm-02',
      background: '/story-assets/jamaica/jm-01-bedroom.jpg',
      character: {
        image: '/story-assets/characters/char-granny-jamaica.jpg',
        position: 'right',
      },
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "Let me tell you something, child. In Jamaica, we don't just put a tooth under a pillow.",
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
        text: "Because something is coming. Something BIG.",
      },
    },
    // ACT 2: THE ROLLING CALF
    {
      id: 'jm-04',
      background: '/story-assets/jamaica/jm-02-rolling-calf.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "The Rolling Calf. A bull with fire in its eyes and chains dragging behind it.",
      },
    },
    {
      id: 'jm-05',
      background: '/story-assets/jamaica/jm-02-rolling-calf.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "It wants your tooth. If it gets your tooth, it gets POWER over you.",
      },
    },
    {
      id: 'jm-06',
      background: '/story-assets/jamaica/jm-03-shaking-can.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "But HERE is what you do. You grab a tin can — any tin can — and you SHAKE IT!",
      },
    },
    {
      id: 'jm-07',
      background: '/story-assets/jamaica/jm-03-shaking-can.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "RATTA RATTA RATTA! The Rolling Calf HATES that sound!",
      },
    },
    {
      id: 'jm-08',
      background: '/story-assets/jamaica/jm-04-roof-throw.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "See? It's running! That big scary bull, scared of a little tin can!",
      },
    },
    {
      id: 'jm-09',
      background: '/story-assets/jamaica/jm-04-roof-throw.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "Now QUICK — throw your tooth to the roof! High as you can!",
      },
    },
    {
      id: 'jm-10',
      background: '/story-assets/jamaica/jm-05-granny.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "And say: Ratta ratta, take my tooth, bring me one that tells the truth!",
      },
    },
    // ACT 2B: THE NETWORK
    {
      id: 'jm-11',
      background: '/story-assets/jamaica/jm-05-granny.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "And where does it go? UP. Past the stars. To the Network.",
      },
    },
    {
      id: 'jm-12',
      background: '/story-assets/shared/shared-network-station.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "The Tooth Fairy Network — where every tooth from every brave child is kept safe.",
      },
    },
    {
      id: 'jm-13',
      background: '/story-assets/shared/shared-network-station.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "No Rolling Calf can reach it there. It's YOURS forever.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'jm-14',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "Children everywhere are brave like you! In Spain, a little mouse sneaks past CATS. In Romania, a crow flies to the IRON MOUNTAIN. In Egypt, children throw their tooth at the SUN!",
      },
    },
    {
      id: 'jm-15',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "Now your whole family can see your keepsake — your cousins, your aunties, your grandad too.",
      },
    },
    {
      id: 'jm-16',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "And each of them can add a little something to your treasure.",
      },
    },
    {
      id: 'jm-17',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "It grows and grows. And one day, when you're big and strong... all that love comes RIGHT back to you.",
      },
    },
    {
      id: 'jm-18',
      background: '/story-assets/jamaica/jm-05-granny.jpg',
      character: {
        image: '/story-assets/characters/char-granny-jamaica.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Granny',
        speakerColor: '#E74C3C',
        text: "So what are you waiting for? Show me that smile!",
      },
    },
    {
      id: 'jm-cta',
      background: '/story-assets/jamaica/jm-05-granny.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/toothfairy/app",
    },
  ],
}

export default jamaica
