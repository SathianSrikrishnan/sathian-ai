import { StoryConfig } from './types'

const korea: StoryConfig = {
  id: 'korea',
  title: 'The Magpie Song',
  region: 'South Korea',
  emoji: '🐦',
  color: '#3498DB',
  description: 'Sing to the magpie on the rooftop',
  characterName: 'Magpie',
  available: true,
  crossReferences: ['finland', 'jamaica', 'north-africa'],
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'kr-01',
      background: '/story-assets/korea/kr-01-bedroom.jpg',
      dialogue: {
        text: "In Korea, when a tooth falls out, you don't put it under your pillow.",
      },
    },
    {
      id: 'kr-02',
      background: '/story-assets/korea/kr-01-bedroom.jpg',
      dialogue: {
        text: "You climb up to the rooftop. Because someone special is listening.",
      },
    },
    {
      id: 'kr-03',
      background: '/story-assets/korea/kr-02-rooftop-singing.jpg',
      dialogue: {
        text: "You hold your tooth up high and sing: \"까치야 까치야 — Magpie, magpie, take my old tooth, bring me a new one!\"",
      },
    },
    // ACT 2: THE MAGPIE COMES
    {
      id: 'kr-04',
      background: '/story-assets/korea/kr-03-magpie-descends.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'right',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "Did someone call? I HEARD a tooth!",
      },
    },
    {
      id: 'kr-05',
      background: '/story-assets/korea/kr-03-magpie-descends.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'right',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "Oh my... what a LOVELY tooth. Look at it shine!",
      },
    },
    {
      id: 'kr-06',
      background: '/story-assets/korea/kr-04-magical-nest.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "Every tooth tells me a story. This one says: you ate your vegetables. Am I right?",
      },
    },
    {
      id: 'kr-07',
      background: '/story-assets/korea/kr-05-magpie-facing.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'center',
        exit: 'top',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "I carry it to my nest — but not just any nest...",
      },
    },
    {
      id: 'kr-08',
      background: '/story-assets/korea/kr-04-magical-nest.jpg',
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "My nest is where old teeth become new ones. Where baby teeth become FOREVER teeth.",
      },
    },
    {
      id: 'kr-09',
      background: '/story-assets/korea/kr-05-magpie-facing.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "But first, I fly it to the Network. Because YOUR tooth deserves to last forever.",
      },
    },
    {
      id: 'kr-10',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "The Tooth Fairy Network! Every collector in the world brings their teeth here.",
      },
    },
    {
      id: 'kr-11',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "Your tooth becomes a keepsake. A treasure that even I — with all my jewels — cannot match.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'kr-12',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "I'm not the only singer! In Finland, a fairy sings to defeat a troll. In Jamaica, children shake tin cans to scare a demon bull! In Egypt, they sing to the SUN!",
      },
    },
    {
      id: 'kr-13',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "Your family can see your beautiful keepsake. And each of them can add their own sparkle.",
      },
    },
    {
      id: 'kr-14',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "It grows, like a nest being built twig by twig, year after year...",
      },
    },
    {
      id: 'kr-15',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "And one day, when you're all grown up, every twig of love comes back to you.",
      },
    },
    {
      id: 'kr-16',
      background: '/story-assets/korea/kr-05-magpie-facing.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "Now sing with me! Show me your smile, and let's make your keepsake shine!",
      },
    },
    {
      id: 'kr-cta',
      background: '/story-assets/korea/kr-05-magpie-facing.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/app",
    },
  ],
}

export default korea
