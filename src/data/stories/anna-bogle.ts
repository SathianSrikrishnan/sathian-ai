import { StoryConfig } from './types'

const frames = '/story-assets/anna/v2/finals'

const annaGreen = '#57B66F'
const oldGold = '#D7A64A'

/**
 * Story 7 - Anna Bogle and the Gap in the Gold.
 * Production story data: 46 full-frame scenes from the deployment preview manifest.
 */
const annaBogle: StoryConfig = {
  id: 'anna-bogle',
  title: 'Anna Bogle and the Gap in the Gold',
  region: 'Ireland',
  emoji: '\u{1F340}',
  color: annaGreen,
  description: 'An Irish story of rain, bargains, old promises, and the gift that was not for sale.',
  characterName: 'Anna Bogle',
  available: true,
  crossReferences: ['tanda', 'viking-origin', 'ratoncito-perez', 'korea'],
  colors: {
    accent: annaGreen,
    accentGlow: `${annaGreen}80`,
    secondary: oldGold,
    secondaryGlow: `${oldGold}80`,
  },
  effects: {
    particles: {
      count: 16,
      color: oldGold,
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 10,
      durationMax: 18,
      drift: 18,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    {
      id: "anna-01-title-and-cover",
      layout: "cover",
      background: `${frames}/story7-frame-01-cover.png`,
      dialogue: {
        text: "Anna Bogle and the Gap in the Gold",
        subtext: "An Irish story of rain, bargains, old promises, and the gift that was not for sale.",
      },
    },
    {
      id: "anna-02-the-loose-tooth",
      layout: "narrative",
      background: `${frames}/story7-frame-02-loose-tooth-kitchen.png`,
      dialogue: {
        text: "Ryan's tooth had wobbled through breakfast, through spelling, and through one very serious argument with an apple.",
        subtext: "By supper, it was hanging on from pure stubbornness.",
      },
    },
    {
      id: "anna-03-more-important-than-toast",
      layout: "narrative",
      background: `${frames}/story7-frame-03-tooth-in-palm.png`,
      dialogue: {
        text: "Then Ryan bit his toast and the tooth gave up.",
        subtext: "It landed in his palm, tiny and white and suddenly much more important than toast.",
      },
    },
    {
      id: "anna-04-how-much-gold",
      layout: "narrative",
      background: `${frames}/story7-frame-04-gold-joke.png`,
      dialogue: {
        text: "Ryan grinned through the new gap.",
        subtext: "\"So,\" he said, \"how much gold is this worth?\"\nGrandad nearly choked on his tea.",
      },
    },
    {
      id: "anna-05-everyone-is-noisy",
      layout: "narrative",
      background: `${frames}/story7-frame-05-everyone-is-noisy.png`,
      dialogue: {
        text: "\"Who told you gold was the point?\" Grandad asked.",
        subtext: "\"Everyone,\" said Ryan.\n\"Everyone is a noisy person,\" said Grandad. \"Often wrong.\"",
      },
    },
    {
      id: "anna-06-the-older-version",
      layout: "narrative",
      background: `${frames}/story7-frame-06-older-version-begins.png`,
      dialogue: {
        text: "Grandad leaned back in his chair.",
        subtext: "\"When I was small, I heard an older version. Stranger, too. There was a keeper named Anna Bogle.\"",
      },
    },
    {
      id: "anna-07-a-thin-place-in-the-story",
      layout: "narrative",
      background: `${frames}/story7-frame-07-missing-story-gap.png`,
      dialogue: {
        text: "\"She came for a child's tooth and left gold behind, but only if the gold was...\"",
        subtext: "Grandad stopped.\nThe middle of the story seemed to go thin.",
      },
    },
    {
      id: "anna-08-older-than-expensive",
      layout: "narrative",
      background: `${frames}/story7-frame-08-lost-word.png`,
      dialogue: {
        text: "\"Expensive?\" Ryan guessed.",
        subtext: "\"No,\" said Grandad. \"Older than expensive.\"\nHe tapped his cup, trying to find the lost word.\n\"It was for something.\"",
      },
    },
    {
      id: "anna-09-bedtime-setup",
      layout: "narrative",
      background: `${frames}/story7-frame-09-bedtime-tooth-setup.png`,
      dialogue: {
        text: "Ryan placed his tooth in a folded bit of paper beside his pillow.",
        subtext: "Under it, he tucked a drawing of himself, Grandad, and a coin as big as a biscuit.",
      },
    },
    {
      id: "anna-10-tanda-feels-the-cold-fleck",
      layout: "narrative",
      background: `${frames}/story7-frame-10-tanda-cold-spot.png`,
      dialogue: {
        text: "Far away and not far at all, Tanda felt a cold fleck appear on her map.",
        subtext: "Ireland glimmered, then dimmed at one small cottage.",
      },
    },
    {
      id: "anna-11-not-that-shine",
      layout: "narrative",
      background: `${frames}/story7-frame-11-anna-hideaway.png`,
      dialogue: {
        text: "In a place under a field wall, Anna Bogle's gold pouch gave a sour little clink.",
        subtext: "Anna narrowed her eyes.\n\"Oh no. Not that shine.\"",
      },
    },
    {
      id: "anna-12-the-curtain-sneezed-rain",
      layout: "narrative",
      background: `${frames}/story7-frame-12-window-click.png`,
      dialogue: {
        text: "Ryan tried to stay awake.",
        subtext: "He lasted seven minutes, which he considered heroic.\nThen the window clicked.\nThen the curtain sneezed rain.",
      },
    },
    {
      id: "anna-13-anna-arrives",
      layout: "narrative",
      background: `${frames}/story7-frame-13-anna-umbrella-entrance.png`,
      dialogue: {
        text: "Anna Bogle burst through the gap in the curtains, wrestling an umbrella twice her size.",
        subtext: "She landed in a sock drawer and said, \"I meant to do that.\"",
      },
    },
    {
      id: "anna-14-a-witness",
      layout: "narrative",
      background: `${frames}/story7-frame-14-witness.png`,
      dialogue: {
        text: "She shook rain from her coat, spotted Ryan's open eye, and sighed.",
        subtext: "\"Excellent. A witness. I do my best work with supervision.\"",
      },
    },
    {
      id: "anna-15-are-you-anna-bogle",
      layout: "narrative",
      background: `${frames}/story7-frame-15-are-you-anna-bogle.png`,
      dialogue: {
        text: "Ryan sat up.",
        subtext: "\"Are you Anna Bogle?\"\n\"Depends who is asking.\"\n\"Ryan.\"\n\"Then yes. If a tax collector asks, I am a hat.\"",
      },
    },
    {
      id: "anna-16-the-drawing",
      layout: "narrative",
      background: `${frames}/story7-frame-16-tooth-and-coin-drawing.png`,
      dialogue: {
        text: "Anna lifted the tooth.",
        subtext: "Her face softened for one breath.\nThen she saw the huge coin in Ryan's drawing, and her mouth snapped shut again.",
      },
    },
    {
      id: "anna-17-trouble-in-pajamas",
      layout: "narrative",
      background: `${frames}/story7-frame-17-trouble-in-pajamas.png`,
      dialogue: {
        text: "\"Ah,\" she said. \"The tooth has brought friends. Expectation. Arithmetic. Trouble in pajamas.\"",
        subtext: "Ryan looked down at his pajamas.\n\"They are good pajamas.\"",
      },
    },
    {
      id: "anna-18-the-shadow-near-gold",
      layout: "narrative",
      background: `${frames}/story7-frame-18-shadow-near-gold.png`,
      dialogue: {
        text: "The gold in Anna's pouch gave another cold clink.",
        subtext: "Beside it, a thread of shadow curled where no shadow should fit.\nAnna's eyes went flat.",
      },
    },
    {
      id: "anna-19-tanda-at-the-sill",
      layout: "narrative",
      background: `${frames}/story7-frame-19-tanda-at-windowsill.png`,
      dialogue: {
        text: "A soft light touched the sill.",
        subtext: "Tanda hovered there, wings folded small against the rain.\n\"Anna,\" she said, \"I came to ask.\"",
      },
    },
    {
      id: "anna-20-the-shining-net",
      layout: "narrative",
      background: `${frames}/story7-frame-20-anna-challenges-tanda.png`,
      dialogue: {
        text: "\"I know what you came with,\" Anna said.",
        subtext: "\"A grand idea. A shining net. A place where every small thing can become one more thing to count.\"",
      },
    },
    {
      id: "anna-21-listen-first",
      layout: "narrative",
      background: `${frames}/story7-frame-21.png`,
      dialogue: {
        text: "Tanda lowered her hands.",
        subtext: "\"Then I should listen first.\"\nAnna blinked.\nShe had prepared several insults and now had nowhere tidy to put them.",
      },
    },
    {
      id: "anna-22-grandad-wakes",
      layout: "narrative",
      background: `${frames}/story7-frame-22.png`,
      dialogue: {
        text: "Grandad woke in the chair by the door.",
        subtext: "He stared at Anna, then at the tooth, then at Tanda.\n\"Well,\" he said softly, \"my mother was not making you up.\"",
      },
    },
    {
      id: "anna-23-the-missing-part-returns",
      layout: "narrative",
      background: `${frames}/story7-frame-23.png`,
      dialogue: {
        text: "The room hushed.",
        subtext: "Grandad tried again.\n\"The gold was not for buying the tooth. It was for...\"\nThe missing part of the old story thinned like paper in rain.",
      },
    },
    {
      id: "anna-24-do-not-feed-that",
      layout: "narrative",
      background: `${frames}/story7-frame-24.png`,
      dialogue: {
        text: "The shadow near the pouch lifted its head.",
        subtext: "Anna snapped the gold shut.\n\"Do not feed that,\" she said.\nRyan whispered, \"Feed what?\"",
      },
    },
    {
      id: "anna-25-a-bad-habit-with-a-long-body",
      layout: "narrative",
      background: `${frames}/story7-frame-25.png`,
      dialogue: {
        text: "\"A bad habit with a long body,\" Anna said.",
        subtext: "\"And I will not name it in a child's bedroom.\"",
      },
    },
    {
      id: "anna-26-show-me-the-difference",
      layout: "narrative",
      background: `${frames}/story7-frame-26.png`,
      dialogue: {
        text: "Anna turned to Tanda.",
        subtext: "\"You say your Tooth Fee is not a price. Show me the difference.\"\nTanda looked at Ryan's tooth, and memory opened.",
      },
    },
    {
      id: "anna-27-young-tanda-s-question",
      layout: "narrative",
      background: `${frames}/story7-frame-27.png`,
      dialogue: {
        text: "Young Tanda stood in a shipyard with one tooth missing and one bright coin beside her hand.",
        subtext: "\"If I take the coin,\" she asked, \"is it still mine?\"",
      },
    },
    {
      id: "anna-28-a-promise-to-notice",
      layout: "narrative",
      background: `${frames}/story7-frame-28.png`,
      dialogue: {
        text: "Her father knelt so his eyes were level with hers.",
        subtext: "\"Yes. A fee is not a purchase. It is a promise to notice.\"",
      },
    },
    {
      id: "anna-29-may-i-carry-what-is-yours",
      layout: "narrative",
      background: `${frames}/story7-frame-29.png`,
      dialogue: {
        text: "The next morning he threaded her tooth onto a leather cord.",
        subtext: "\"May I carry what is yours?\" he asked.\nYoung Tanda held the cord until the knot was done.",
      },
    },
    {
      id: "anna-30-near-his-heart",
      layout: "narrative",
      background: `${frames}/story7-frame-30.png`,
      dialogue: {
        text: "Later, across cold water, that tooth tapped near his heart when anger would have been easy.",
        subtext: "It reminded him whose promise he carried.",
      },
    },
    {
      id: "anna-31-back-in-the-cottage",
      layout: "narrative",
      background: `${frames}/story7-frame-31.png`,
      dialogue: {
        text: "The cottage returned.",
        subtext: "Tanda's wings glowed low and warm.\n\"My father did not buy my tooth,\" she said. \"He carried my growing with care.\"",
      },
    },
    {
      id: "anna-32-still-learning",
      layout: "narrative",
      background: `${frames}/story7-frame-32.png`,
      dialogue: {
        text: "Anna studied her.",
        subtext: "\"You remembered him before you defended yourself.\"\nTanda nodded.\n\"I am trying to build something that helps people remember. But I still have to be taught.\"",
      },
    },
    {
      id: "anna-33-gold-is-grand",
      layout: "narrative",
      background: `${frames}/story7-frame-33.png`,
      dialogue: {
        text: "Ryan frowned at the pouch.",
        subtext: "\"So gold is bad?\"\nAnna looked horrified.\n\"Gold? Bad? Wash your mouth with rainwater. Gold is grand.\"",
      },
    },
    {
      id: "anna-34-a-fine-servant",
      layout: "narrative",
      background: `${frames}/story7-frame-34.png`,
      dialogue: {
        text: "She held up one finger.",
        subtext: "\"Gold is a fine servant and a dreadful boss.\"\nShe held up a second.\n\"And if you let it boss a tooth, the tooth gets lonely.\"",
      },
    },
    {
      id: "anna-35-a-damp-half",
      layout: "narrative",
      background: `${frames}/story7-frame-35.png`,
      dialogue: {
        text: "\"Then what should the gold prove?\" Ryan asked.",
        subtext: "\"That you lost a tooth?\"\nAnna made a face.\n\"Half a point. A damp half.\"",
      },
    },
    {
      id: "anna-36-someone-noticed",
      layout: "narrative",
      background: `${frames}/story7-frame-36.png`,
      dialogue: {
        text: "Grandad's eyes brightened.",
        subtext: "\"That someone noticed you were growing.\"\nThe missing part of the old story clicked back into place.",
      },
    },
    {
      id: "anna-37-yes-that",
      layout: "narrative",
      background: `${frames}/story7-frame-37.png`,
      dialogue: {
        text: "The coin in Anna's pouch warmed.",
        subtext: "Not brighter than the tooth.\nNot bigger than the story.\nJust warm enough to say: yes, that.",
      },
    },
    {
      id: "anna-38-ryan-writes-the-memory",
      layout: "narrative",
      background: `${frames}/story7-frame-38.png`,
      dialogue: {
        text: "Ryan took his drawing and turned it over.",
        subtext: "On the back he wrote, very carefully, \"Grandad remembered Anna Bogle when my tooth fell out.\"",
      },
    },
    {
      id: "anna-39-for-keeping",
      layout: "narrative",
      background: `${frames}/story7-frame-39.png`,
      dialogue: {
        text: "Anna wrapped the tooth in a clover cloth.",
        subtext: "\"This one is not for sale,\" she said.\n\"This one is for keeping.\"",
      },
    },
    {
      id: "anna-40-proof-that-somebody-noticed",
      layout: "narrative",
      background: `${frames}/story7-frame-40.png`,
      dialogue: {
        text: "She placed a small gold piece beside the drawing, not on top of it.",
        subtext: "\"There,\" she said. \"Proof that somebody noticed.\"",
      },
    },
    {
      id: "anna-41-the-gold-trust-glimmer",
      layout: "narrative",
      background: `${frames}/story7-frame-41.png`,
      dialogue: {
        text: "A few gold flecks appeared at the corner of Ryan's drawing.",
        subtext: "A clover glow curled around the edge.\nOne glimmer settled beside Grandad's name.",
      },
    },
    {
      id: "anna-42-the-shadow-pulls-back",
      layout: "narrative",
      background: `${frames}/story7-frame-42.png`,
      dialogue: {
        text: "The shadow by the pouch pulled back into a stone crack, thinner than a thread.",
        subtext: "Anna saw it go.\nSo did Tanda.\nNeither of them smiled.",
      },
    },
    {
      id: "anna-43-old-promises",
      layout: "narrative",
      background: `${frames}/story7-frame-43.png`,
      dialogue: {
        text: "At the window, Anna spoke low.",
        subtext: "\"When old promises go quiet, something comes to eat the quiet. I will help you watch. I will not be managed.\"",
      },
    },
    {
      id: "anna-44-ask-better",
      layout: "victory",
      background: `${frames}/story7-frame-44.png`,
      dialogue: {
        text: "Tanda bowed her head.",
        subtext: "\"Then help me ask better.\"\nAnna's gap-toothed smile finally appeared.\n\"A terrible name, Network. We will discuss it.\"",
      },
    },
    {
      id: "anna-45-they-stood-watch-together",
      layout: "victory",
      background: `${frames}/story7-frame-45-network-alliance.png`,
      dialogue: {
        text: "The rain thinned.",
        subtext: "Beyond the cottage, small threads of Toothlight reached toward other keepers, other windows, other promises.\nAnna did not let go of her pouch.\nTanda did not ask her to.\nThey stood watch together.",
      },
    },
    {
      id: "anna-46-the-remembering-was-better",
      layout: "cta",
      background: `${frames}/story7-frame-46-morning-close.png`,
      dialogue: {
        text: "Morning found Ryan with a gold piece, a glimmering drawing, and a story Grandad could remember whole.",
        subtext: "The gold was lovely.\nThe remembering was better.",
      },
      isChoice: true,
      choiceText: "Create Your Gold-Trust Glimmer",
      choiceHref: "/toothfairy/app/draw?from=story&slug=anna-bogle",
    },
  ],
}

export default annaBogle
