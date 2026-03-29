import { StoryConfig } from './types'

const babylonia: StoryConfig = {
  id: 'babylonia',
  title: 'The Tooth Worm',
  region: 'Babylonia (Ancient Mesopotamia)',
  emoji: '🪱',
  color: '#C0392B',
  description: 'The oldest tooth story ever told — 3,800 years old',
  characterName: 'The Tooth Worm',
  available: true,
  crossReferences: ['tooth-fairy', 'north-africa', 'japan'],
  scenes: [
    // ACT 1: THE OLDEST STORY
    {
      id: 'bb-01',
      background: '/story-assets/babylonia/bb-01-tablet.jpg',
      dialogue: {
        text: "This is the oldest tooth story in the world. 3,800 years old. Written on a clay tablet in ancient Babylon.",
      },
    },
    {
      id: 'bb-02',
      background: '/story-assets/babylonia/bb-01-tablet.jpg',
      dialogue: {
        text: "It's about a very tiny, very dramatic worm.",
      },
    },
    // ACT 2: THE WORM'S COMPLAINT
    {
      id: 'bb-03',
      background: '/story-assets/babylonia/bb-02-worm-home.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-worm.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Worm',
        speakerColor: '#C0392B',
        text: "It's dark in here! It's cramped! And what do they feed me? GUM. I hate gum!",
      },
    },
    {
      id: 'bb-04',
      background: '/story-assets/babylonia/bb-02-worm-home.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-worm.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Worm',
        speakerColor: '#C0392B',
        text: "I asked the god Ea — I said, Ea! Let me live among the TEETH! Let me drink the BLOOD!",
      },
    },
    {
      id: 'bb-05',
      background: '/story-assets/babylonia/bb-03-worm-complain.jpg',
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "No, little Worm. You cannot have the teeth. They belong to the child.",
      },
    },
    {
      id: 'bb-06',
      background: '/story-assets/babylonia/bb-03-worm-complain.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-worm.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Worm',
        speakerColor: '#C0392B',
        text: "But I'm HUNGRY!",
      },
    },
    {
      id: 'bb-07',
      background: '/story-assets/babylonia/bb-03-worm-complain.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-worm.jpg',
        position: 'left',
      },
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "Then you shall have figs and apricots. But NOT the teeth.",
      },
    },
    {
      id: 'bb-08',
      background: '/story-assets/babylonia/bb-04-transformation.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-worm.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Worm',
        speakerColor: '#C0392B',
        text: "Fine. FINE. But one day a tooth will fall out on its own — and THEN what?",
      },
    },
    {
      id: 'bb-09',
      background: '/story-assets/babylonia/bb-04-transformation.jpg',
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "Then it goes to the Network. Where it becomes a keepsake. Safe from worms, safe from time, safe forever.",
      },
    },
    {
      id: 'bb-10',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-worm.jpg',
        position: 'left',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Worm',
        speakerColor: '#C0392B',
        text: "...the Network gets EVERYTHING good.",
      },
    },
    {
      id: 'bb-11',
      background: '/story-assets/shared/shared-network-station.jpg',
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "Because the Network protects what matters. Every tooth. Every child. Every culture. For 3,800 years and counting.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'bb-12',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "In North America, a fairy guards the teeth. In North Africa, children throw them to the Sun. In Japan, a Kami keeps them in a shrine.",
      },
    },
    {
      id: 'bb-13',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "Your family sees your keepsake. And each of them adds their love.",
      },
    },
    {
      id: 'bb-14',
      background: '/story-assets/shared/shared-family-connected.jpg',
      character: {
        image: '/story-assets/characters/char-tooth-worm.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Worm',
        speakerColor: '#C0392B',
        text: "Even I have to admit... that's pretty nice.",
      },
    },
    {
      id: 'bb-15',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "It grows with you. And one day, all that love returns. That has been true since Babylon. It will be true forever.",
      },
    },
    {
      id: 'bb-16',
      background: '/story-assets/babylonia/bb-05-tablet-glowing.jpg',
      dialogue: {
        speaker: 'Ea',
        speakerColor: '#F0C456',
        text: "Now it's YOUR turn. Show your smile. Add your tooth to the oldest story ever told.",
      },
    },
    {
      id: 'bb-cta',
      background: '/story-assets/babylonia/bb-05-tablet-glowing.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/toothfairy/app",
    },
  ],
}

export default babylonia
