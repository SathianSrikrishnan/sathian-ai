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
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'ch-01',
      background: '/story-assets/cherokee/ch-01-home.jpg',
      dialogue: {
        text: "A tooth fell out today. And in the Cherokee tradition, this is not a quiet moment.",
      },
    },
    {
      id: 'ch-02',
      background: '/story-assets/cherokee/ch-01-home.jpg',
      dialogue: {
        text: "This is a RUNNING moment.",
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
        text: "Run! Around the house! First lap — face the rising sun!",
      },
    },
    {
      id: 'ch-05',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "Shout as loud as you can: \"BEAVER! Put a new tooth in my jaw!\"",
      },
    },
    {
      id: 'ch-06',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "Second lap! Past the warm south wind!",
      },
    },
    {
      id: 'ch-07',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "\"BEAVER! Put a new tooth in my jaw!\"",
      },
    },
    {
      id: 'ch-08',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "Third lap! Past where the sun goes to sleep!",
      },
    },
    {
      id: 'ch-09',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "\"BEAVER! Put a new tooth in my jaw!\"",
      },
    },
    {
      id: 'ch-10',
      background: '/story-assets/cherokee/ch-02-running.jpg',
      dialogue: {
        text: "FOURTH lap! The final one! Past the cold north!",
      },
    },
    {
      id: 'ch-11',
      background: '/story-assets/cherokee/ch-03-finished.jpg',
      dialogue: {
        text: "\"BEAVER! PUT A NEW TOOTH IN MY JAW!\"",
      },
    },
    {
      id: 'ch-12',
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
      },
    },
    {
      id: 'ch-13',
      background: '/story-assets/cherokee/ch-04-beaver-on-roof.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'right',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "I've been building things since the world was young. Dams, lodges, rivers. But teeth? Teeth are my favorite.",
      },
    },
    {
      id: 'ch-14',
      background: '/story-assets/cherokee/ch-05-beaver-tooth.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'center',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "I take your tooth. And I build something with it — something that lasts.",
      },
    },
    {
      id: 'ch-15',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'center',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "I carry it to the Network. Where every tooth, from every tradition, is kept strong.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'ch-16',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "Other collectors work differently. A mouse sneaks. A crow flies. A fairy races. But me? I BUILD. That's what beavers do.",
      },
    },
    {
      id: 'ch-17',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "Your family sees what I built from your tooth. And each of them adds a piece.",
      },
    },
    {
      id: 'ch-18',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "Log by log. Year by year. It grows into something strong.",
      },
    },
    {
      id: 'ch-19',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "And one day, when you are strong enough to build your OWN life... everything I kept comes back to you.",
      },
    },
    {
      id: 'ch-20',
      background: '/story-assets/cherokee/ch-04-beaver-on-roof.jpg',
      character: {
        image: '/story-assets/characters/char-beaver.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Beaver',
        speakerColor: '#8B4513',
        text: "So? Ready to run? Show me your tooth. Let's build.",
      },
    },
    {
      id: 'ch-cta',
      background: '/story-assets/cherokee/ch-04-beaver-on-roof.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/app",
    },
  ],
}

export default cherokee
