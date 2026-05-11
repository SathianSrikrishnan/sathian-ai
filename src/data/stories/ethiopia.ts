import { StoryConfig } from './types'

const ethiopia: StoryConfig = {
  id: 'ethiopia',
  title: "The Hyena's Bargain",
  region: 'Ethiopia / East Africa',
  emoji: '🦴',
  color: '#E67E22',
  description: 'Face the hyena and prove your bravery',
  characterName: 'Hyena',
  available: true,
  crossReferences: ['ratoncito-perez', 'finland', 'korea'],
  colors: {
    accent: '#E67E22',
  },
  effects: {
    particles: {
      count: 10,
      color: '#E67E22',
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 8,
      durationMax: 15,
      drift: 15,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'et-01',
      layout: 'cover',
      background: '/story-assets/ethiopia/et-01-bedroom.jpg',
      dialogue: {
        text: "The Hyena's Bargain",
        subtext: 'Face the hyena and prove your bravery',
      },
    },
    {
      id: 'et-02',
      background: '/story-assets/ethiopia/et-01-bedroom.jpg',
      dialogue: {
        text: "In Ethiopia, when a tooth falls out, you don't hide it under a pillow. You take it outside. Into the evening. Where something is waiting.",
      },
    },
    {
      id: 'et-03',
      background: '/story-assets/ethiopia/et-02-eyes-in-dark.jpg',
      dialogue: {
        text: "Because in Ethiopia, you give your tooth to the hyena.",
      },
    },
    // ACT 2: THE BARGAIN
    {
      id: 'et-04',
      layout: 'character',
      background: '/story-assets/ethiopia/et-03-hynea-emerges.jpg',
      character: {
        image: '/story-assets/characters/char-hyena.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "Heheheh... another brave one. Come closer. Let me see.",
        subtext: 'Night prowler with jaws that crush bone — collector of brave children\'s teeth',
      },
    },
    {
      id: 'et-05',
      layout: 'dramatic',
      background: '/story-assets/ethiopia/et-03-hynea-emerges.jpg',
      character: {
        image: '/story-assets/characters/char-hyena.jpg',
        position: 'left',
      },
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "So. You lost a tooth. And you want a strong one? Stronger than mine? My teeth can crush BONE.",
      },
      secondDialogue: {
        text: "You hold out your tooth and say: \"Hyena, take my weak tooth — give me a strong one!\"",
      },
    },
    {
      id: 'et-06',
      background: '/story-assets/ethiopia/et-04-taking-tooth.jpg',
      character: {
        image: '/story-assets/characters/char-hyena.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "Heh. Brave. I like brave. This is a good tooth. You took care of it. I can tell.",
      },
    },
    {
      id: 'et-07',
      background: '/story-assets/ethiopia/et-05-hyena-running.jpg',
      character: {
        image: '/story-assets/characters/char-hyena.jpg',
        position: 'right',
        exit: 'right',
      },
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "I'm taking it somewhere safe. Somewhere even I can't go. The Network.",
      },
    },
    {
      id: 'et-08',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-hyena.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "The Tooth Fairy Network. Where your tooth becomes a keepsake that even a hyena's jaws cannot break.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'et-09',
      layout: 'dramatic',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "I'm not the only collector. A mouse sneaks through palaces in Spain. A fairy fights trolls in Finland.",
      },
      secondDialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "A magpie sings in Korea. We're all part of the same pack.",
      },
    },
    {
      id: 'et-10',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "Your family sees your keepsake. Each of them adds their strength to it. Like a pack protecting its young — everyone who loves you makes it stronger.",
      },
    },
    {
      id: 'et-11',
      layout: 'victory',
      background: '/story-assets/ethiopia/et-05-hyena-running.jpg',
      character: {
        image: '/story-assets/characters/char-hyena.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "And one day, when you're strong enough to run with the pack yourself... all that strength comes back to you.",
      },
      secondDialogue: {
        speaker: 'Hyena',
        speakerColor: '#E67E22',
        text: "So? Are you brave enough? Show me your tooth.",
      },
    },
    {
      id: 'et-cta',
      layout: 'cta',
      background: '/story-assets/ethiopia/et-05-hyena-running.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Now make yours ✦",
      choiceHref: '/toothfairy/app/draw?from=story&slug=ethiopia',
    },
  ],
}

export default ethiopia
