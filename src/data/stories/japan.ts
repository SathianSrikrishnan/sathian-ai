import { StoryConfig } from './types'

const japan: StoryConfig = {
  id: 'japan',
  title: 'The Tooth Kami',
  region: 'Japan',
  emoji: '⛩️',
  color: '#F8C8DC',
  description: 'A spirit at the only tooth shrine in the world',
  characterName: 'Tooth Kami',
  available: true,
  crossReferences: ['ratoncito-perez', 'jamaica', 'romania'],
  colors: {
    accent: '#F8C8DC',
  },
  effects: {
    particles: {
      count: 25,
      color: '#F8C8DC',
      sizeMin: 3,
      sizeMax: 6,
      durationMin: 6,
      durationMax: 12,
      drift: 40,
      glow: false,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'jp-01',
      layout: 'cover',
      background: '/story-assets/japan/jp-01-bedroom.jpg',
      dialogue: {
        text: 'The Tooth Kami',
        subtext: 'A spirit at the only tooth shrine in the world',
      },
    },
    {
      id: 'jp-02',
      background: '/story-assets/japan/jp-01-bedroom.jpg',
      dialogue: {
        text: "In Japan, when a bottom tooth falls out, you throw it UP toward the roof. When a top tooth falls out, you throw it DOWN under the floor — so the new tooth grows straight and true.",
      },
    },
    {
      id: 'jp-03',
      background: '/story-assets/japan/jp-02-tooth-shrine.jpg',
      dialogue: {
        text: "But there is somewhere even more special your tooth can go...",
      },
    },
    // ACT 2: THE SHRINE
    {
      id: 'jp-04',
      layout: 'character',
      background: '/story-assets/japan/jp-02-tooth-shrine.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Welcome. I am the Tooth Kami. I live in the only tooth shrine in all the world.",
        subtext: 'Guardian of the sacred tooth shrine — keeper of children\'s milestones for centuries',
      },
    },
    {
      id: 'jp-05',
      background: '/story-assets/japan/jp-03-kami-interior.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "For hundreds of years, families have brought their children's teeth to me. They bring soybeans as an offering. And I keep their teeth safe.",
      },
    },
    {
      id: 'jp-06',
      background: '/story-assets/japan/jp-04-tooth-altar.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Each tooth is precious. Each one marks a moment of growing up. I turn each tooth into a keepsake — a memory that cannot fade.",
      },
    },
    // ACT 3: THE NETWORK
    {
      id: 'jp-07',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "And I send it to the Network — where keepsakes from every child, in every country, are protected.",
      },
    },
    {
      id: 'jp-08',
      layout: 'dramatic',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "In Spain, a mouse carries teeth through midnight streets.",
      },
      secondDialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "In Jamaica, children shake tin cans at a bull demon! In Romania, a crow flies teeth to a mountain forge!",
      },
    },
    // ACT 4: THE INVITATION
    {
      id: 'jp-09',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Your family sees your keepsake. Each person who loves you adds their blessing. Like rings in a tree, their love grows around your treasure, year after year.",
      },
    },
    {
      id: 'jp-10',
      layout: 'victory',
      background: '/story-assets/japan/jp-05-shrine-gate.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "And one day, when you are grown, all those blessings return to you.",
      },
      secondDialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Let us begin. Show me your smile, and together we will make something beautiful.",
      },
    },
    {
      id: 'jp-cta',
      layout: 'cta',
      background: '/story-assets/japan/jp-05-shrine-gate.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Now make yours ✦",
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default japan
