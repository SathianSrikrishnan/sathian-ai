import { StoryConfig } from './types'

/**
 * Tanda — The Origin (impeccable, April 2026)
 * 14 Pixar frames. Mixed layouts (cover, narrative, prose, character, dramatic, victory, cta).
 * Aurora on Network reveal. Sparkles on morning victory.
 */
const tanda: StoryConfig = {
  id: 'tanda',
  title: 'Tanda',
  region: 'The Origin',
  emoji: '\u{1FAB6}',
  color: '#F3C57A',
  description: 'The origin of the Tooth Fairy Network — a boy, a tooth, and a sky full of gold',
  characterName: 'Tanda',
  available: true,
  crossReferences: ['hyena-story', 'anka-story', 'ratoncito-perez', 'korea'],
  colors: {
    accent: '#F3C57A',
    accentGlow: '#F3C57A80',
    secondary: '#E8A867',
    secondaryGlow: '#E8A86780',
  },
  effects: {
    particles: {
      color: '#F3C57A',
      count: 26,
      sizeMin: 2,
      sizeMax: 5,
      durationMin: 8,
      durationMax: 16,
      drift: 28,
      glow: true,
    },
    aurora: {
      colors: ['#F3C57A', '#E8A867', '#D4A574'],
      bands: 3,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    /* ─── COVER ────────────────────────────────────────────────────── */
    {
      id: 'tanda-cover',
      layout: 'cover',
      background: '/story-assets/tanda/frame-04.png',
      dialogue: {
        text: 'Tanda',
        subtext: 'The Origin of the Tooth Fairy Network',
      },
    },

    /* ─── ACT 1 · THE TOOTH ────────────────────────────────────────── */
    {
      id: 'tanda-01-open',
      layout: 'narrative',
      background: '/story-assets/tanda/frame-01.png',
      dialogue: {
        text: "Every night, while you\u2019re asleep, someone is working.",
      },
    },
    {
      id: 'tanda-01-intro',
      layout: 'prose',
      background: '/story-assets/tanda/frame-01.png',
      dialogue: {
        text: "Her name is Tanda. She\u2019s the Tooth Fairy. And she\u2019s been doing this job for a very, very long time.\n\nTonight, she has eleven stops. But one of them is special.\n\nA boy named Timmy just lost his first tooth \u2014 and word travels fast on the playground.",
      },
    },
    {
      id: 'tanda-02-note',
      layout: 'prose',
      background: '/story-assets/tanda/frame-02.png',
      dialogue: {
        text: "Timmy\u2019s friend Marcus had told him something at recess.\n\n\u201CWhen your tooth falls out, don\u2019t just put it under your pillow. Draw a picture of it. Write the story of how it fell out. The Tooth Fairy has this NETWORK, and if you do that, she keeps it forever. Like, FOREVER forever.\u201D\n\nTimmy wasn\u2019t sure he believed Marcus. But he wasn\u2019t sure he didn\u2019t.\n\nSo he sat at his desk. Drew his tooth \u2014 wobbly lines, a little lopsided, perfect. And underneath, he wrote:\n\n\u201CDear Tooth Fairy. My tooth fell out eating an apple at lunch. Everyone laughed but I didn\u2019t cry. Please keep this safe. I want to remember this day when I\u2019m old. \u2014 Timmy, age 6\u201D",
      },
    },
    {
      id: 'tanda-03-sleep',
      layout: 'dramatic',
      background: '/story-assets/tanda/frame-03.png',
      dialogue: {
        text: "He put the tooth on top of the drawing, tucked the note underneath, and slid the whole thing under his pillow.",
        subtext: "Eyes shut. Too tight. The kind of shut where you\u2019re trying so hard to sleep that your whole face scrunches up.",
      },
      secondDialogue: {
        text: "Five minutes later, he was actually asleep.\n\nThat\u2019s when the window opened.",
      },
    },

    /* ─── ACT 2 · TANDA ARRIVES ────────────────────────────────────── */
    {
      id: 'tanda-04-arrival',
      layout: 'character',
      background: '/story-assets/tanda/frame-04.png',
      character: {
        image: '/story-assets/tanda/frame-06.png',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Tanda',
        speakerColor: '#F3C57A',
        text: "She always came through windows. Never doors.",
        subtext: "Tanda slipped through the glass like she was made of moonlight. She\u2019d done this a thousand times. Ten thousand. But she never rushed the entrance. The entrance mattered.",
      },
    },
    {
      id: 'tanda-05-drift',
      layout: 'prose',
      background: '/story-assets/tanda/frame-05.png',
      dialogue: {
        text: "She hovered above Timmy\u2019s bed. He was drooling slightly. One sock on, one sock off. A stuffed dinosaur wedged under his arm.\n\nShe smiled. They were always the same, and always completely different.\n\nShe drifted down. Slow. The sparkle trail behind her wasn\u2019t for show \u2014 every particle was a piece of a previous tooth\u2019s story, still glowing. She carried them everywhere. Thousands of children\u2019s moments, floating in her wake.\n\nShe reached the pillow. Lifted the edge.\n\nAnd stopped.",
      },
    },
    {
      id: 'tanda-06-memories',
      layout: 'dramatic',
      background: '/story-assets/tanda/frame-06.png',
      dialogue: {
        text: "The tooth was there. Small. White. Still warm.",
        subtext: "She picked it up and held it close. And everything opened.",
      },
      secondDialogue: {
        speaker: 'Memories',
        speakerColor: '#E8A867',
        text: "First apple. Lunchroom laughter. Timmy\u2019s face going red, then realizing they were laughing WITH him. His first bike ride. The word \u201Cdinosaur\u201D \u2014 the first big word he ever learned. A bedtime song his mother sang so many times the tooth had memorized it too.",
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F3C57A',
        text: "\u201COh. You held a LOT, little one.\u201D",
      },
    },
    {
      id: 'tanda-07-note',
      layout: 'dramatic',
      background: '/story-assets/tanda/frame-07.png',
      dialogue: {
        text: "Then she saw it. Under the tooth. A drawing.",
        subtext: "Wobbly crayon lines. A tooth with a smiley face on it.",
      },
      secondDialogue: {
        speaker: "Timmy\u2019s note",
        speakerColor: '#6B8CAE',
        text: "\u201CPlease keep this safe. I want to remember this day when I\u2019m old.\u201D",
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F3C57A',
        text: "\u201CMarcus told you about the Network, didn\u2019t he? Smart kid, that Marcus.\u201D",
      },
    },
    {
      id: 'tanda-08-seal',
      layout: 'dramatic',
      background: '/story-assets/tanda/frame-08.png',
      dialogue: {
        text: "She held the tooth up. And it began to change.",
        subtext: "Not the tooth itself \u2014 what was AROUND it. Timmy\u2019s drawing wrapped itself in light. His words burned golden at the edges.",
      },
      secondDialogue: {
        text: "The drawing, the note, the tooth, the memories \u2014 all of it fusing together into something that couldn\u2019t be deleted, couldn\u2019t be lost, couldn\u2019t fade.\n\nA keepsake. Permanent. Timmy\u2019s first chapter, sealed in light.",
      },
    },

    /* ─── ACT 3 · THE NETWORK ──────────────────────────────────────── */
    {
      id: 'tanda-09-chain',
      layout: 'prose',
      background: '/story-assets/tanda/frame-09.png',
      dialogue: {
        text: "She carried it up. Through the ceiling. Through the sky. To the chain.\n\nThe chain isn\u2019t a place. It\u2019s a thread of golden light that stretches across the whole sky. Thousands of tiny glowing points \u2014 each one a tooth, each one a child\u2019s story, each one connected to the one before it and the one after it.\n\nSome glow warm gold. Some glow cool silver. Some pulse gently, like heartbeats. And the ones with drawings and notes? Those glow the brightest of all.\n\nTanda placed Timmy\u2019s tooth on the chain. It found its spot. Connected. And the glow spread \u2014 in both directions, lighting up teeth from children Timmy would never meet but was now permanently linked to.",
      },
    },
    {
      id: 'tanda-10-weight',
      layout: 'prose',
      background: '/story-assets/tanda/frame-10.png',
      dialogue: {
        text: "She paused at Timmy\u2019s window on the way back. Looked out at the sky. The chain was beautiful tonight.\n\nBut something weighed on her.\n\nEleven stops tonight. Tomorrow, eleven more. Every night, more children. More teeth. More moments that deserved to be kept. And she was carrying all of it \u2014 alone.\n\nNot because she had to. Because she always had. One fairy. One satchel. One sky.\n\nBut looking at Timmy\u2019s tooth glowing on the chain, she felt something shift. One tooth glowing alone is beautiful. A tooth connected to others \u2014 linked, permanent, part of something bigger \u2014 that was something else entirely.",
      },
    },
    {
      id: 'tanda-11-network',
      layout: 'dramatic',
      background: '/story-assets/tanda/frame-11.png',
      dialogue: {
        text: "She wasn\u2019t the only one doing this. She\u2019d never been the only one.",
        subtext: "She\u2019d known it for a long time. But she\u2019d never acted on it.",
      },
      secondDialogue: {
        speaker: 'Every continent',
        speakerColor: '#E8A867',
        text: "In Spain, a mouse named P\u00e9rez had been collecting teeth since 1894. In Korea, a magpie sang children\u2019s teeth off rooftops. In Ethiopia, children handed their teeth to a hyena in the dark. In Romania, a crow forged milk teeth into steel. In India, a peacock danced for the ones it deemed worthy.",
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F3C57A',
        text: "\u201CWhat if every tooth, from every tradition, from every child in the world, was connected? Not the same \u2014 connected. Each one glowing brighter because of the ones beside it.\u201D",
      },
    },

    /* ─── ACT 4 · MORNING ──────────────────────────────────────────── */
    {
      id: 'tanda-12-coin',
      layout: 'dramatic',
      background: '/story-assets/tanda/frame-12.png',
      dialogue: {
        text: "She floated back to Timmy\u2019s bed. Looked at him one more time. Sock still off. Dinosaur still wedged.",
        subtext: "She placed a coin beside his pillow. Not under \u2014 beside. Where he\u2019d see it first thing. And next to the coin, a note. Tiny. Golden handwriting.",
      },
      secondDialogue: {
        speaker: 'Tanda\u2019s note',
        speakerColor: '#F3C57A',
        text: "\u201CDear Timmy. Your tooth was one of the brightest I\u2019ve ever carried. Your drawing made it glow even brighter. I\u2019m keeping it safe on the chain \u2014 forever, like you asked. And Timmy? Tell Marcus he was right. The Network is real. \u2014 Tanda\u201D",
      },
    },
    {
      id: 'tanda-13-wake',
      layout: 'victory',
      background: '/story-assets/tanda/frame-13.png',
      dialogue: {
        text: "Timmy woke up.",
        subtext: "Reached under his pillow. The tooth was gone. The drawing was gone.\n\nBut beside his pillow: a coin. And a note. In handwriting so small and golden it looked like it was written with a sunbeam.",
      },
      secondDialogue: {
        speaker: 'Timmy',
        speakerColor: '#E8A867',
        text: "\u201CMOM! MOM! She wrote BACK! She said Marcus was RIGHT! She said my drawing made it GLOW!\u201D",
      },
      thirdDialogue: {
        text: "His mother came in. Read the note. Something in her face changed. She wasn\u2019t playing along anymore. This felt real.\n\nShe took a photo of Timmy\u2019s gap-toothed grin. And then she saw something on her phone \u2014 a page. Timmy\u2019s tooth. His drawing. His note. All of it, saved. Permanent. Glowing.\n\nShe sent it to Timmy\u2019s grandmother before she even finished her coffee.",
      },
    },
    {
      id: 'tanda-14-onward',
      layout: 'narrative',
      background: '/story-assets/tanda/frame-14.png',
      dialogue: {
        text: "Somewhere above the rooftops, Tanda was already moving. Ten more stops tonight. Three blank letters in her pocket \u2014 to a mouse, a magpie, a leprechaun who\u2019d been doing this longer than anyone.\n\nThe Network was already out there. It was time to connect it.",
      },
    },

    /* ─── CTA ─────────────────────────────────────────────────────── */
    {
      id: 'tanda-cta',
      layout: 'cta',
      background: '/story-assets/tanda/frame-14.png',
      dialogue: {
        text: 'Deposit your tooth, your photo, and your story.',
        subtext: "Your child\u2019s first tooth is more than a tooth. Keep it forever.",
      },
      isChoice: true,
      choiceText: 'See the keepsake \u2192',
      choiceHref: '/toothfairy/keepsake/preview',
    },
  ],
}

export default tanda
