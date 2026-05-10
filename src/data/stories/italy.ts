import { StoryConfig } from './types'

const italy: StoryConfig = {
  id: 'italy',
  title: 'The Venice Triple',
  region: 'Italy',
  emoji: '🎭',
  color: '#27AE60',
  description: 'Three collectors arrive by gondola',
  characterName: 'Apollonia, Fatina & Topolino',
  available: true,
  crossReferences: ['romania', 'finland', 'ethiopia'],
  colors: {
    accent: '#27AE60',
  },
  effects: {
    particles: {
      count: 15,
      color: '#27AE60',
      sizeMin: 1,
      sizeMax: 2,
      durationMin: 5,
      durationMax: 9,
      drift: 15,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'it-01',
      layout: 'cover',
      background: '/story-assets/italy/it-01-bedroom.jpg',
      dialogue: {
        text: 'The Venice Triple',
        subtext: 'Three collectors arrive by gondola',
      },
    },
    {
      id: 'it-02',
      background: '/story-assets/italy/it-01-bedroom.jpg',
      dialogue: {
        text: "In Venice, Italy, when a tooth falls out, THREE visitors come. Not one. Not two. THREE. And they arrive by gondola.",
      },
    },
    // ACT 2: THE TRIO
    {
      id: 'it-03',
      layout: 'character',
      background: '/story-assets/italy/it-02-gondola.jpg',
      character: {
        image: '/story-assets/characters/char-venice-trio.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Apollonia',
        speakerColor: '#27AE60',
        text: "Steady, Topolino. We're almost there.",
        subtext: 'Saint, fairy, and mouse — Venice\'s triple tooth collectors for 1,700 years',
      },
    },
    {
      id: 'it-04',
      layout: 'dramatic',
      background: '/story-assets/italy/it-02-gondola.jpg',
      character: {
        image: '/story-assets/characters/char-venice-trio.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Topolino',
        speakerColor: '#27AE60',
        text: "I don't like water, Signora! What if a cat is waiting?",
      },
      secondDialogue: {
        speaker: 'Fatina',
        speakerColor: '#27AE60',
        text: "There are no cats on the water, silly mouse! Now which window is it?",
      },
    },
    {
      id: 'it-05',
      background: '/story-assets/italy/it-03-teamwork.jpg',
      character: {
        image: '/story-assets/characters/char-venice-trio.jpg',
        position: 'right',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Apollonia',
        speakerColor: '#27AE60',
        text: "That one. Third floor. I can feel the tooth. I have felt every tooth in Venice for 1,700 years.",
      },
    },
    {
      id: 'it-06',
      layout: 'dramatic',
      background: '/story-assets/italy/it-03-teamwork.jpg',
      character: {
        image: '/story-assets/characters/char-venice-trio.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Fatina',
        speakerColor: '#27AE60',
        text: "I'll get it! I'm the fastest!",
      },
      secondDialogue: {
        speaker: 'Topolino',
        speakerColor: '#27AE60',
        text: "No, I'll get it! Mice are QUIET! Fairies sparkle too much!",
      },
      thirdDialogue: {
        speaker: 'Apollonia',
        speakerColor: '#27AE60',
        text: "BOTH of you. Together. Like always.",
      },
    },
    {
      id: 'it-07',
      background: '/story-assets/italy/it-04-flying-venice.jpg',
      character: {
        image: '/story-assets/characters/char-venice-trio.jpg',
        position: 'center',
        exit: 'top',
      },
      dialogue: {
        speaker: 'Fatina',
        speakerColor: '#27AE60',
        text: "Got it!",
      },
    },
    {
      id: 'it-08',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-venice-trio.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Apollonia',
        speakerColor: '#27AE60',
        text: "Now we take it where it belongs. The Tooth Fairy Network — where every tooth, from every child, is kept safe by collectors from all over the world.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'it-09',
      layout: 'dramatic',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Apollonia',
        speakerColor: '#27AE60',
        text: "In Romania, a crow flies teeth through the mountains. In Finland, a fairy battles a troll.",
      },
      secondDialogue: {
        speaker: 'Apollonia',
        speakerColor: '#27AE60',
        text: "In Ethiopia, children give their teeth to hyenas!",
      },
    },
    {
      id: 'it-10',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Fatina',
        speakerColor: '#27AE60',
        text: "Your family can see your keepsake! Everyone who loves you can add something to it. Even aunts. Even CATS. Well, maybe not cats.",
      },
    },
    {
      id: 'it-11',
      layout: 'victory',
      background: '/story-assets/italy/it-05-trio-waving.jpg',
      character: {
        image: '/story-assets/characters/char-venice-trio.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Apollonia',
        speakerColor: '#27AE60',
        text: "It grows with you. And one day, all the love in it comes back to you. That is the Venetian promise.",
      },
      secondDialogue: {
        text: "\"Ready?\" \"Show us your tooth!\" \"Let the magic begin.\"",
      },
    },
    {
      id: 'it-cta',
      layout: 'cta',
      background: '/story-assets/italy/it-05-trio-waving.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Now make yours ✦",
      choiceHref: '/toothfairy/app/draw?from=story&slug=italy',
    },
  ],
}

export default italy
