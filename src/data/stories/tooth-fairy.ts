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
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'tf-01',
      background: '/story-assets/tooth-fairy/tf-01-bedroom.jpg',
      dialogue: {
        text: "It's nighttime. The house is quiet. Everyone is fast asleep.",
      },
    },
    {
      id: 'tf-02',
      background: '/story-assets/tooth-fairy/tf-01-bedroom.jpg',
      dialogue: {
        text: "But under your pillow, something special is waiting. A tiny tooth — YOUR tooth.",
      },
    },
    {
      id: 'tf-03',
      background: '/story-assets/tooth-fairy/tf-01-bedroom.jpg',
      dialogue: {
        text: "You wiggled it and wiggled it, and today it finally came out!",
      },
    },
    {
      id: 'tf-04',
      background: '/story-assets/tooth-fairy/tf-01-bedroom.jpg',
      dialogue: {
        text: "Have you ever wondered what happens next?",
      },
    },
    // ACT 2: THE REVEAL
    {
      id: 'tf-05',
      background: '/story-assets/tooth-fairy/tf-02-fairy-window.jpg',
      dialogue: {
        text: "A shimmer of gold dances through the window...",
      },
    },
    {
      id: 'tf-06',
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
      },
    },
    {
      id: 'tf-07',
      background: '/story-assets/shared/shared-night-sky.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "I'm the Tooth Fairy. I've been visiting children for thousands of years.",
      },
    },
    {
      id: 'tf-08',
      background: '/story-assets/shared/shared-night-sky.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "Every night, all around the world, collectors like me visit children just like you.",
      },
    },
    {
      id: 'tf-09',
      background: '/story-assets/tooth-fairy/tf-03-lifting-tooth.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
        exit: 'top',
      },
      dialogue: {
        text: "The Fairy reaches under the pillow... and your tooth begins to glow.",
      },
    },
    {
      id: 'tf-10',
      background: '/story-assets/tooth-fairy/tf-04-stardust-trail.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "I carry your tooth up, up, up through the sky...",
      },
    },
    {
      id: 'tf-11',
      background: '/story-assets/tooth-fairy/tf-04-stardust-trail.jpg',
      dialogue: {
        text: "A trail of stardust follows the Fairy across the night...",
      },
    },
    {
      id: 'tf-12',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "Welcome to the Tooth Fairy Network!",
      },
    },
    {
      id: 'tf-13',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "This is where every tooth from every child in the world becomes something special.",
      },
    },
    {
      id: 'tf-14',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "We turn your tooth into a keepsake — a treasure that can never be lost.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'tf-15',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "I'm not the only one. Did you know in Spain, a little mouse collects teeth? In Finland, a fairy battles a troll! And in Jamaica, children shake tin cans to scare away a bull!",
      },
    },
    {
      id: 'tf-16',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "Now here's the best part. You can show your keepsake to everyone who loves you.",
      },
    },
    {
      id: 'tf-17',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "Grandparents, aunts, uncles — each of them can add a little bit of love to your treasure.",
      },
    },
    {
      id: 'tf-18',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "It grows and grows, safe inside the Network, year after year...",
      },
    },
    {
      id: 'tf-19',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "And one day, when you're all grown up... all that love comes back to you.",
      },
    },
    {
      id: 'tf-20',
      background: '/story-assets/tooth-fairy/tf-05-fairy-facing.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-fairy.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Tooth Fairy',
        speakerColor: '#F0C456',
        text: "Ready to start? Take a photo of your smile, and let's make YOUR keepsake.",
      },
    },
    {
      id: 'tf-cta',
      background: '/story-assets/tooth-fairy/tf-05-fairy-facing.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/toothfairy/app",
    },
  ],
}

export default toothFairy
