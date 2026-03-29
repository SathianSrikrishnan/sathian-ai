import { StoryConfig } from './types'

const romania: StoryConfig = {
  id: 'romania',
  title: 'The Crow',
  region: 'Romania / Eastern Europe',
  emoji: '🪶',
  color: '#9B59B6',
  description: 'A crow carries your tooth through the mountains',
  characterName: 'The Crow',
  available: true,
  crossReferences: ['ratoncito-perez', 'tooth-fairy', 'korea'],
  scenes: [
    // ACT 1: THE FAMILIAR
    {
      id: 'ro-01',
      background: '/story-assets/romania/ro-01-bedroom.jpg',
      dialogue: {
        text: "In the mountains of Romania, when a tooth falls out, you go outside.",
      },
    },
    {
      id: 'ro-02',
      background: '/story-assets/romania/ro-02-child-shouting.jpg',
      dialogue: {
        text: "You hold your tooth to the sky and shout: \"Take my milk tooth — bring me a STEEL one!\"",
      },
    },
    {
      id: 'ro-03',
      background: '/story-assets/romania/ro-02-child-shouting.jpg',
      dialogue: {
        text: "And from the darkness... a shadow appears.",
      },
    },
    // ACT 2: THE QUEST
    {
      id: 'ro-04',
      background: '/story-assets/romania/ro-03-crow-catches.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "I am The Crow. I have been catching teeth since before your great-grandmother was born.",
      },
    },
    {
      id: 'ro-05',
      background: '/story-assets/romania/ro-03-crow-catches.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'center',
      },
      dialogue: {
        text: "The Crow snatches the tooth from the sky — mid-flight, in total darkness.",
      },
    },
    {
      id: 'ro-06',
      background: '/story-assets/romania/ro-04-mountains.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'left',
        enter: 'left',
      },
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "Now I must fly. Through the mountains. Through the clouds. Higher than any bird has ever flown.",
      },
    },
    {
      id: 'ro-07',
      background: '/story-assets/romania/ro-04-mountains.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'left',
      },
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "Your milk tooth becomes something else in my talons. I can feel it changing. Growing stronger.",
      },
    },
    {
      id: 'ro-08',
      background: '/story-assets/romania/ro-04-mountains.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'left',
      },
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "By the time I reach the Network, it will be as strong as steel. That is the promise.",
      },
    },
    {
      id: 'ro-09',
      background: '/story-assets/romania/ro-04-mountains.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "And I ALWAYS keep my promise.",
      },
    },
    {
      id: 'ro-10',
      background: '/story-assets/shared/shared-network-station.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'center',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "To the Network. Where your tooth becomes a keepsake — forged in iron, kept forever.",
      },
    },
    // ACT 3: THE INVITATION
    {
      id: 'ro-11',
      background: '/story-assets/shared/shared-multiple-collectors.jpg',
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "Other collectors fear the journey. But we ALL make it. A mouse in Spain. A fairy in Finland who fights TROLLS. A magpie in Korea who SINGS. We are ALL part of the Network.",
      },
    },
    {
      id: 'ro-12',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "Your family sees your keepsake — forged strong, kept safe.",
      },
    },
    {
      id: 'ro-13',
      background: '/story-assets/shared/shared-family-connected.jpg',
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "And each of them adds their own strength to it. Like iron, it only gets stronger.",
      },
    },
    {
      id: 'ro-14',
      background: '/story-assets/shared/shared-finale-teenager.jpg',
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "One day, when you are strong as steel... all that strength comes back to you.",
      },
    },
    {
      id: 'ro-15',
      background: '/story-assets/romania/ro-05-crow-facing.jpg',
      character: {
        image: '/story-assets/characters/char-crow.jpg',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Crow',
        speakerColor: '#9B59B6',
        text: "Shout it to the sky! Show me your tooth! Let the quest begin!",
      },
    },
    {
      id: 'ro-cta',
      background: '/story-assets/romania/ro-05-crow-facing.jpg',
      dialogue: {
        text: "",
      },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/toothfairy/app",
    },
  ],
}

export default romania
