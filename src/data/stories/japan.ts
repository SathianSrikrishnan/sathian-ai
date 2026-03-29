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
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'jp-01',
      background: '/story-assets/japan/jp-01-bedroom.jpg',
      dialogue: {
        text: "In Japan, when a bottom tooth falls out, you throw it UP toward the roof.",
      },
    },
    {
      id: 'jp-02',
      background: '/story-assets/japan/jp-01-bedroom.jpg',
      dialogue: {
        text: "When a top tooth falls out, you throw it DOWN under the floor.",
      },
    },
    {
      id: 'jp-03',
      background: '/story-assets/japan/jp-01-bedroom.jpg',
      dialogue: {
        text: "Why? So the new tooth grows in the right direction. Straight and true.",
      },
    },
    {
      id: 'jp-04',
      background: '/story-assets/japan/jp-02-tooth-shrine.jpg',
      dialogue: {
        text: "But there is somewhere even more special your tooth can go...",
      },
    },
    // ACT 2: THE SHRINE
    {
      id: 'jp-05',
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
      },
    },
    {
      id: 'jp-06',
      background: '/story-assets/japan/jp-02-tooth-shrine.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "For hundreds of years, families have brought their children's teeth to me.",
      },
    },
    {
      id: 'jp-07',
      background: '/story-assets/japan/jp-03-kami-interior.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "They bring soybeans as an offering. And I keep their teeth safe.",
      },
    },
    {
      id: 'jp-08',
      background: '/story-assets/japan/jp-04-tooth-altar.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Each tooth is precious. Each one marks a moment of growing up.",
      },
    },
    {
      id: 'jp-09',
      background: '/story-assets/japan/jp-04-tooth-altar.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "I turn each tooth into a keepsake. A memory that cannot fade.",
      },
    },
    {
      id: 'jp-10',
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
    // ACT 3: THE INVITATION
    {
      id: 'jp-11',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "In Spain, a mouse carries teeth through midnight streets. In Jamaica, children shake tin cans at a bull demon! In Romania, a crow flies teeth to a mountain forge!",
      },
    },
    {
      id: 'jp-12',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Your family sees your keepsake. And each person who loves you can add their blessing.",
      },
    },
    {
      id: 'jp-13',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Like rings in a tree, their love grows around your treasure, year after year.",
      },
    },
    {
      id: 'jp-14',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "And one day, when you are grown, all those blessings return to you.",
      },
    },
    {
      id: 'jp-15',
      background: '/story-assets/japan/jp-05-shrine-gate.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-kami.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Kami',
        speakerColor: '#F8C8DC',
        text: "Let us begin. Show me your smile, and together we will make something beautiful.",
      },
    },
    {
      id: 'jp-cta',
      background: '/story-assets/japan/jp-05-shrine-gate.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/toothfairy/app",
    },
  ],
}

export default japan
