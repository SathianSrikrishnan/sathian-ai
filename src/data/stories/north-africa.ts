import { StoryConfig } from './types'

const northAfrica: StoryConfig = {
  id: 'north-africa',
  title: 'The Sun Prayer',
  region: 'North Africa / MENA',
  emoji: '☀️',
  color: '#F39C12',
  description: 'Throw your tooth to the Sun',
  characterName: 'The Sun',
  available: true,
  crossReferences: ['tooth-fairy', 'finland', 'korea'],
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'na-01',
      background: '/story-assets/north-africa/na-01-bedroom.jpg',
      dialogue: {
        text: "In North Africa, when a tooth falls out, you don't put it under your pillow.",
      },
    },
    {
      id: 'na-02',
      background: '/story-assets/north-africa/na-01-bedroom.jpg',
      dialogue: {
        text: "You wait for the sun to rise. Because the Sun has been listening for a very long time.",
      },
    },
    {
      id: 'na-03',
      background: '/story-assets/north-africa/na-02-child-at-dawn.jpg',
      dialogue: {
        text: "You wrap your tooth in cloth, stand facing the east, and say the ancient words...",
      },
    },
    // ACT 2: THE PRAYER
    {
      id: 'na-04',
      background: '/story-assets/north-africa/na-03-tooth-to-sun.jpg',
      dialogue: {
        text: "\"Ya shams, ya shams... Take my donkey tooth, and give me a gazelle's tooth!\"",
      },
    },
    {
      id: 'na-05',
      background: '/story-assets/north-africa/na-03-tooth-to-sun.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "Ahh... I hear you, little one.",
      },
    },
    {
      id: 'na-06',
      background: '/story-assets/north-africa/na-04-sun-transforms.jpg',
      dialogue: {
        text: "You throw the tooth as high as you can — toward the great eye of the Sun.",
      },
    },
    {
      id: 'na-07',
      background: '/story-assets/north-africa/na-05-sunrise.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "I've been catching teeth since the pharaohs were children. Every single one.",
      },
    },
    {
      id: 'na-08',
      background: '/story-assets/north-africa/na-05-sunrise.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "Your donkey tooth — clumsy, wobbly, wonderful — I take it.",
      },
    },
    {
      id: 'na-09',
      background: '/story-assets/north-africa/na-04-sun-transforms.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "And I turn it into something strong. Something beautiful. A gazelle's tooth.",
      },
    },
    {
      id: 'na-10',
      background: '/story-assets/north-africa/na-04-sun-transforms.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "But I also do something else. Something new.",
      },
    },
    // ACT 2B: THE NETWORK
    {
      id: 'na-11',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "I send your tooth to the Network — where it becomes a keepsake that lasts forever.",
      },
    },
    {
      id: 'na-12',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "The Network has been here as long as I have. Fairies, mice, crows, all working together.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'na-13',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "In North America, a fairy carries teeth through the night. In Finland, a fairy races a troll! In South Korea, a magpie sings for each tooth!",
      },
    },
    {
      id: 'na-14',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "Your family sees your keepsake — and each of them can add their warmth to it.",
      },
    },
    {
      id: 'na-15',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "Like sunlight growing a garden, their love grows your treasure.",
      },
    },
    {
      id: 'na-16',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "And one day, when you are strong like a gazelle, all that warmth comes back to you.",
      },
    },
    {
      id: 'na-17',
      background: '/story-assets/north-africa/na-05-sunrise.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "Face the east. Show me your smile. Let's begin.",
      },
    },
    {
      id: 'na-cta',
      background: '/story-assets/north-africa/na-05-sunrise.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/toothfairy/app",
    },
  ],
}

export default northAfrica
