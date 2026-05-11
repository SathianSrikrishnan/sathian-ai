import { StoryConfig } from './types'

const toothFairy: StoryConfig = {
  id: 'tooth-fairy',
  title: 'The Tooth Fairy',
  region: 'North America',
  emoji: '🧚',
  color: '#F0C456',
  description: 'The classic story',
  characterName: 'Tooth Fairy',
  available: true,
  crossReferences: ['ratoncito-perez', 'finland', 'jamaica'],
  colors: {
    accent: '#F0C456',
  },
  effects: {
    particles: {
      count: 20,
      color: '#F0C456',
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 4,
      durationMax: 8,
      drift: 20,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // COVER
    {
      id: 'tf-01',
      layout: 'cover',
      background: '/story-assets/tooth-fairy/tf-01-bedroom.jpg',
      dialogue: {
        text: 'The Tooth Fairy',
        subtext: 'A bedtime story from North America',
      },
    },
    // ACT 1: THE FAMILIAR
    {
      id: 'tf-02',
      background: '/story-assets/tooth-fairy/tf-01-bedroom.jpg',
      dialogue: {
        text: "It's nighttime. The house is quiet, everyone fast asleep. But under your pillow, something special is waiting — a tiny tooth, YOUR tooth. You wiggled it and wiggled it, and today it finally came out!",
      },
    },
    {
      id: 'tf-03',
      background: '/story-assets/tooth-fairy/tf-01-bedroom.jpg',
      dialogue: {
        text: 'Have you ever wondered what happens next?',
      },
    },
    // ACT 2: THE REVEAL
    {
      id: 'tf-04',
      background: '/story-assets/tooth-fairy/tf-02-fairy-window.jpg',
      dialogue: {
        text: 'A shimmer of gold dances through the window...',
      },
    },
    {
      id: 'tf-05',
      layout: 'character',
      background: '/story-assets/shared/shared-night-sky.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "Hello, little one. I've been waiting for this moment.",
        subtext: 'Guardian of children\'s teeth for thousands of years',
      },
    },
    {
      id: 'tf-06',
      layout: 'dramatic',
      background: '/story-assets/shared/shared-night-sky.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "I'm the Tooth Fairy. Every night, all around the world, collectors like me visit children just like you.",
      },
      secondDialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "And tonight... it's your turn.",
      },
    },
    // THE COLLECTION
    {
      id: 'tf-07',
      background: '/story-assets/tooth-fairy/tf-03-lifting-tooth.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
        exit: 'top',
      },
      dialogue: {
        text: 'The Fairy reaches under the pillow... and your tooth begins to glow.',
      },
    },
    {
      id: 'tf-08',
      background: '/story-assets/tooth-fairy/tf-04-stardust-trail.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: 'I carry your tooth up, up, up through the sky... a trail of stardust following us across the night.',
      },
    },
    // THE NETWORK
    {
      id: 'tf-09',
      layout: 'victory',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: 'Welcome to the Tooth Fairy Network!',
      },
      secondDialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: 'This is where every tooth from every child in the world becomes a keepsake — a treasure that can never be lost.',
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'tf-10',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "I'm not the only one. In Spain, a little mouse collects teeth. In Jamaica, children shake tin cans to scare away a bull! Every tooth tells a story. Every story becomes something you own forever.",
      },
    },
    {
      id: 'tf-11',
      background: '/story-assets/tooth-fairy/tf-05-fairy-facing.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: 'Ready to make yours?',
      },
    },
    // CTA
    {
      id: 'tf-cta',
      layout: 'cta',
      background: '/story-assets/tooth-fairy/tf-05-fairy-facing.jpg',
      dialogue: {
        text: '',
      },
      isChoice: true,
      choiceText: 'Now make yours ✦',
      choiceHref: '/toothfairy/app/draw?from=story&slug=tooth-fairy',
    },
  ],
}

export default toothFairy
