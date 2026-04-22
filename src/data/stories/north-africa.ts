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
  colors: {
    accent: '#F39C12',
  },
  effects: {
    aurora: {
      colors: [
        'oklch(0.7 0.15 60 / 0.15)',
        'oklch(0.75 0.12 40 / 0.2)',
        'oklch(0.65 0.1 80 / 0.15)',
      ],
      bands: 2,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // COVER
    {
      id: 'na-01',
      layout: 'cover',
      background: '/story-assets/north-africa/na-01-bedroom.jpg',
      dialogue: {
        text: 'The Sun Prayer',
        subtext: 'A bedtime story from North Africa',
      },
    },
    // ACT 1: THE FAMILIAR
    {
      id: 'na-02',
      background: '/story-assets/north-africa/na-01-bedroom.jpg',
      dialogue: {
        text: "In North Africa, when a tooth falls out, you don't put it under your pillow. You wait for the sun to rise. Because the Sun has been listening for a very long time.",
      },
    },
    {
      id: 'na-03',
      background: '/story-assets/north-africa/na-02-child-at-dawn.jpg',
      dialogue: {
        text: 'You wrap your tooth in cloth, stand facing the east, and say the ancient words...',
      },
    },
    // ACT 2: THE PRAYER
    {
      id: 'na-04',
      background: '/story-assets/north-africa/na-03-tooth-to-sun.jpg',
      dialogue: {
        text: '"Ya shams, ya shams... Take my donkey tooth, and give me a gazelle\'s tooth!"',
      },
    },
    {
      id: 'na-05',
      layout: 'character',
      background: '/story-assets/north-africa/na-03-tooth-to-sun.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: 'Ahh... I hear you, little one.',
        subtext: 'Ancient collector of teeth since the age of the pharaohs',
      },
    },
    {
      id: 'na-06',
      background: '/story-assets/north-africa/na-04-sun-transforms.jpg',
      dialogue: {
        text: 'You throw the tooth as high as you can — toward the great eye of the Sun.',
      },
    },
    // THE TRANSFORMATION
    {
      id: 'na-07',
      layout: 'dramatic',
      background: '/story-assets/north-africa/na-05-sunrise.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "I've been catching teeth since the pharaohs were children. Your donkey tooth — clumsy, wobbly, wonderful — I take it.",
      },
      secondDialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: 'And I turn it into something strong. Something beautiful. A gazelle\'s tooth.',
      },
    },
    // THE NETWORK
    {
      id: 'na-08',
      layout: 'victory',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-sun-spirit.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: 'I send your tooth to the Network — where it becomes a keepsake that lasts forever.',
      },
      secondDialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: 'The Network has been here as long as I have. Fairies, mice, crows, all working together.',
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'na-09',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Sun',
        speakerColor: '#F39C12',
        text: "In North America, a fairy carries teeth through the night. In South Korea, a magpie sings for each tooth! Your family sees your keepsake — and like sunlight growing a garden, their love grows your treasure. One day, when you are strong like a gazelle, all that warmth comes back to you.",
      },
    },
    {
      id: 'na-10',
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
    // CTA
    {
      id: 'na-cta',
      layout: 'cta',
      background: '/story-assets/north-africa/na-05-sunrise.jpg',
      dialogue: {
        text: '',
      },
      isChoice: true,
      choiceText: 'Now make yours ✦',
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default northAfrica
