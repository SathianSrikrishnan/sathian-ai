import { StoryConfig } from './types'

const ireland: StoryConfig = {
  id: 'ireland',
  title: 'Anna Bogle',
  region: 'Ireland',
  emoji: '🍀',
  color: '#2ECC71',
  description: 'A gap-toothed leprechaun with a heart of gold',
  characterName: 'Anna Bogle',
  available: true,
  crossReferences: ['tooth-fairy', 'ratoncito-perez', 'cherokee'],
  colors: {
    accent: '#2ECC71',
  },
  effects: {
    particles: {
      count: 12,
      color: '#2ECC71',
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 6,
      durationMax: 10,
      drift: 20,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'ir-01',
      layout: 'cover',
      background: '/story-assets/ireland/ir-01-bedroom.jpg',
      dialogue: {
        text: 'Anna Bogle',
        subtext: 'A gap-toothed leprechaun with a heart of gold',
      },
    },
    {
      id: 'ir-02',
      background: '/story-assets/ireland/ir-01-bedroom.jpg',
      dialogue: {
        text: "In Ireland, when a tooth falls out, someone very special comes to visit. Not a fairy with wings. Not a mouse. Something much more... Irish.",
      },
    },
    // ACT 2: ANNA'S VISIT
    {
      id: 'ir-03',
      layout: 'character',
      background: '/story-assets/ireland/ir-02-anna-arrives.jpg',
      character: {
        image: '/story-assets/characters/char-anna-bogle.jpg',
        position: 'right',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "Top o' the evenin'! I'm Anna Bogle. And before you ask — YES, I'm a leprechaun.",
        subtext: 'Gap-toothed leprechaun who gave her own tooth away — trades gold for children\'s teeth',
      },
    },
    {
      id: 'ir-04',
      layout: 'dramatic',
      background: '/story-assets/ireland/ir-02-anna-arrives.jpg',
      character: {
        image: '/story-assets/characters/char-anna-bogle.jpg',
        position: 'right',
      },
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "And YES, I know I'm missing a tooth. Don't laugh! I gave mine away. Long time ago. To a child who needed it more than me.",
      },
      secondDialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "That's what we do. We trade leprechaun gold for children's teeth. Fair deal, if you ask me.",
      },
    },
    {
      id: 'ir-05',
      background: '/story-assets/ireland/ir-03-anna-gap-tooth.jpg',
      character: {
        image: '/story-assets/characters/char-anna-bogle.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "Ohhh, this is a LOVELY tooth. Look at it! Much nicer than the one I gave away, I'll admit.",
      },
    },
    {
      id: 'ir-06',
      background: '/story-assets/ireland/ir-04-anna-inspects.jpg',
      character: {
        image: '/story-assets/characters/char-anna-bogle.jpg',
        position: 'center',
      },
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "Now here's what I do with it. I could keep it — fill my gap, look proper again... But no. YOUR tooth deserves better than my old mouth. It deserves to last forever.",
      },
    },
    {
      id: 'ir-07',
      background: '/story-assets/ireland/ir-05-anna-flying.jpg',
      character: {
        image: '/story-assets/characters/char-anna-bogle.jpg',
        position: 'left',
        exit: 'top',
      },
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "So I take it to the Network. The only place even leprechaun gold can't buy.",
      },
    },
    {
      id: 'ir-08',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-anna-bogle.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "The Tooth Fairy Network! Where your tooth becomes a keepsake. Better than any pot of gold.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'ir-09',
      layout: 'dramatic',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "I'm not the only one, you know! In North America, a fairy does this. In Spain, a mouse named Perez sneaks through palaces.",
      },
      secondDialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "And in Cherokee country, a beaver builds with teeth!",
      },
    },
    {
      id: 'ir-10',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "Your family can see your keepsake. Each of them can add their own gold to it. Not leprechaun gold — REAL love. Which, between you and me, is worth a lot more.",
      },
    },
    {
      id: 'ir-11',
      layout: 'victory',
      background: '/story-assets/ireland/ir-05-anna-flying.jpg',
      character: {
        image: '/story-assets/characters/char-anna-bogle.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "It grows and grows. And one day, every bit of love comes back to you.",
      },
      secondDialogue: {
        speaker: 'Anna',
        speakerColor: '#2ECC71',
        text: "So! Show me that smile. Even if there's a gap — ESPECIALLY if there's a gap!",
      },
    },
    {
      id: 'ir-cta',
      layout: 'cta',
      background: '/story-assets/ireland/ir-05-anna-flying.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Now make yours ✦",
      choiceHref: '/toothfairy/app/draw?from=story&slug=ireland',
    },
  ],
}

export default ireland
