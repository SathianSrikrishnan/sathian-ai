import { StoryConfig } from './types'

const cherokee: StoryConfig = {
  id: 'cherokee',
  title: 'The Beaver Circuit',
  region: 'Cherokee Nation / Indigenous Americas',
  emoji: '🦫',
  color: '#8B4513',
  description: 'Run four laps and call the Beaver',
  characterName: 'Beaver',
  available: true,
  crossReferences: ['ratoncito-perez', 'romania', 'tooth-fairy'],
  colors: {
    accent: '#8B4513',
  },
  effects: {
    particles: {
      count: 15,
      color: '#8B4513',
      sizeMin: 3,
      sizeMax: 5,
      durationMin: 7,
      durationMax: 13,
      drift: 35,
      glow: false,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'ch-01',
      layout: 'cover',
      background: '/story-assets/cherokee/ch-01-home.jpg',
      dialogue: {
        text: 'The Beaver Circuit',
        subtext: 'Run four laps and call the Beaver',
      },
    },
    {
      id: 'ch-02',
      background: '/story-assets/cherokee/ch-01-home.jpg',
      dialogue: {
        text: "A tooth fell out today. And in the Cherokee tradition, this is not a quiet moment. This is a RUNNING moment.",
      },
    },
    {
      id: 'ch-03',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "You hold your tooth. You face your home. And you get ready.",
      },
    },
    // ACT 2: THE CIRCUIT
    {
      id: 'ch-04',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "Run! Around the house! First lap — face the rising sun! Shout as loud as you can: \"BEAVER! Put a new tooth in my jaw!\"",
      },
    },
    {
      id: 'ch-05',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "Second lap! Past the warm south wind! Third lap! Past where the sun goes to sleep! \"BEAVER! Put a new tooth in my jaw!\"",
      },
    },
    {
      id: 'ch-06',
      background: '/story-assets/cherokee/ch-03-finished.jpg',
      dialogue: {
        text: "FOURTH lap! The final one! Past the cold north! \"BEAVER! PUT A NEW TOOTH IN MY JAW!\"",
      },
    },
    {
      id: 'ch-07',
      layout: 'character',
      background: '/story-assets/cherokee/ch-04-beaver-on-roof.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'right',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "I heard you. All four times.",
        subtext: 'Master builder since the world was young — teeth are his favorite material',
      },
    },
    {
      id: 'ch-08',
      background: '/story-assets/cherokee/ch-05-beaver-tooth.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "I've been building things since the world was young. Dams, lodges, rivers. But teeth? Teeth are my favorite. I take your tooth and build something with it — something that lasts.",
      },
    },
    // ACT 3: THE NETWORK
    {
      id: 'ch-09',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "I carry it to the Network. Where every tooth, from every tradition, is kept strong. Other collectors work differently — a mouse sneaks, a crow flies, a fairy races. But me? I BUILD.",
      },
    },
    {
      id: 'ch-10',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "Your family sees what I built from your tooth. Each of them adds a piece. Log by log. Year by year. It grows into something strong.",
      },
    },
    {
      id: 'ch-11',
      layout: 'victory',
      background: '/story-assets/cherokee/ch-04-beaver-on-roof.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "And one day, when you are strong enough to build your OWN life... everything I kept comes back to you.",
      },
      secondDialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "So? Ready to run? Show me your tooth. Let's build.",
      },
    },
    {
      id: 'ch-cta',
      layout: 'cta',
      background: '/story-assets/cherokee/ch-04-beaver-on-roof.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Now make yours ✦",
      choiceHref: '/toothfairy/app',
    },
  ],
}

export default cherokee
