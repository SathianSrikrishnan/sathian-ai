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
  colors: {
    accent: '#3498DB',
  },
  effects: {
    particles: {
      count: 20,
      color: '#F0C456',
      sizeMin: 1,
      sizeMax: 2,
      durationMin: 5,
      durationMax: 9,
      drift: 20,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // COVER
    {
      id: 'kr-01',
      layout: 'cover',
      background: '/story-assets/korea/kr-01-bedroom.jpg',
      dialogue: {
        text: 'The Magpie Song',
        subtext: 'A bedtime story from South Korea',
      },
    },
    // ACT 1: THE FAMILIAR
    {
      id: 'kr-02',
      background: '/story-assets/korea/kr-01-bedroom.jpg',
      dialogue: {
        text: "In Korea, when a tooth falls out, you don't put it under your pillow. You climb up to the rooftop. Because someone special is listening.",
      },
    },
    {
      id: 'kr-03',
      background: '/story-assets/korea/kr-02-rooftop-singing.jpg',
      dialogue: {
        text: 'You hold your tooth up high and sing: "까치야 까치야 — Magpie, magpie, take my old tooth, bring me a new one!"',
      },
    },
    // ACT 2: THE MAGPIE COMES
    {
      id: 'kr-04',
      layout: 'character',
      background: '/story-assets/korea/kr-03-magpie-descends.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'right',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: 'Did someone call? I HEARD a tooth!',
        subtext: 'Korea\'s beloved bringer of good fortune and new teeth',
      },
    },
    {
      id: 'kr-05',
      layout: 'dramatic',
      background: '/story-assets/korea/kr-04-magical-nest.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: 'Oh my... what a LOVELY tooth. Every tooth tells me a story. This one says: you ate your vegetables. Am I right?',
      },
      secondDialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: 'I carry it to my nest — where old teeth become new ones. Where baby teeth become FOREVER teeth.',
      },
    },
    {
      id: 'kr-06',
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
    // THE NETWORK
    {
      id: 'kr-07',
      layout: 'victory',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-magpie.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: 'The Tooth Fairy Network! Every collector in the world brings their teeth here.',
      },
      secondDialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: 'Your tooth becomes a keepsake. A treasure that even I — with all my jewels — cannot match.',
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'kr-08',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Magpie',
        speakerColor: '#3498DB',
        text: "I'm not the only singer! In Jamaica, children shake tin cans to scare a demon bull! In Egypt, they sing to the SUN! Your family can see your beautiful keepsake, and each of them can add their own sparkle. It grows, like a nest being built twig by twig, and one day every twig of love comes back to you.",
      },
    },
    {
      id: 'kr-09',
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
    // CTA
    {
      id: 'kr-cta',
      layout: 'cta',
      background: '/story-assets/korea/kr-05-magpie-facing.jpg',
      dialogue: {
        text: '',
      },
      isChoice: true,
      choiceText: 'Now make yours ✦',
      choiceHref: '/toothfairy/app/draw?from=story&slug=korea',
    },
  ],
}

export default korea
