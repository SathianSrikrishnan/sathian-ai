import { StoryConfig } from './types'

const v2 = '/story-assets/ratoncito-perez/v2'

const perezGold = '#E8A820'
const tandaGold = '#E8B77A'
const luciaBlue = '#9FC1D0'

/**
 * Story 3 - The Toothlight Treaty.
 * Final draft: 26 frames, with one unique full-frame image per scene.
 */
const ratoncitoPerez: StoryConfig = {
  id: 'ratoncito-perez',
  title: 'The Toothlight Treaty',
  region: 'Spain and mixed family traditions',
  emoji: '\u{1F42D}',
  color: perezGold,
  description: 'A Madrid story about two tooth traditions learning to share one child with care.',
  characterName: 'Ratoncito Perez',
  available: true,
  crossReferences: ['viking-origin', 'tanda', 'tooth-fairy'],
  colors: {
    accent: perezGold,
    accentGlow: `${perezGold}80`,
    secondary: tandaGold,
    secondaryGlow: `${tandaGold}80`,
  },
  effects: {
    particles: {
      count: 16,
      color: perezGold,
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 10,
      durationMax: 18,
      drift: 16,
      glow: true,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    {
      id: 'rp3-01-two-doors',
      layout: 'cover',
      background: `${v2}/rp3-frame-01-two-doors.png`,
      dialogue: {
        text: 'The Toothlight Treaty',
        subtext: 'A Ratoncito Perez story about two true tooth traditions.',
      },
    },
    {
      id: 'rp3-02-wobble-merienda',
      layout: 'narrative',
      background: `${v2}/rp3-frame-02-wobble-merienda.png`,
      dialogue: {
        text: "At merienda, Lucia's tooth wobbled every time she smiled, swallowed, or tried very hard not to think about it.",
        subtext: 'Papa said Perez loved a brave tooth. Mom said the Tooth Fairy loved one too.',
      },
    },
    {
      id: 'rp3-03-finally-falls',
      layout: 'narrative',
      background: `${v2}/rp3-frame-03-finally-falls.png`,
      dialogue: {
        text: "Then the tooth popped free into Lucia's palm, small and bright and suddenly important.",
        subtext: 'Papa reached for the old coin box. Mom reached for an old folded note.',
      },
    },
    {
      id: 'rp3-04-two-true-stories',
      layout: 'narrative',
      background: `${v2}/rp3-frame-04-two-true-stories.png`,
      dialogue: {
        text: 'Papa told how Perez had come through the walls when he was little.',
        subtext: 'Mom told how a fairy had left a note by her pillow when she was little.',
      },
    },
    {
      id: 'rp3-05-question',
      layout: 'narrative',
      background: `${v2}/rp3-frame-05-question.png`,
      dialogue: {
        text: 'Lucia liked both stories.',
        subtext: 'That was the trouble. If she chose one, would the other story feel left outside?',
      },
    },
    {
      id: 'rp3-06-note-under-pillow',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-06-note-under-pillow.png`,
      dialogue: {
        text: 'So Lucia wrote the smallest note she could manage and tucked it beside the tooth.',
        subtext: 'It said, Can both of you come?',
      },
      secondDialogue: {
        speaker: 'Lucia',
        speakerColor: luciaBlue,
        text: 'Please do not make me choose.',
      },
    },
    {
      id: 'rp3-07-ledger-room',
      layout: 'narrative',
      background: `${v2}/rp3-frame-07-ledger-room.png`,
      dialogue: {
        text: 'Behind the bakery wall, Ratoncito Perez checked his ledger, polished his stamp, and counted his coins twice.',
        subtext: 'Perez was not merely quick. He was exact.',
      },
    },
    {
      id: 'rp3-08-mouse-code',
      layout: 'narrative',
      background: `${v2}/rp3-frame-08-mouse-code.png`,
      dialogue: {
        text: 'His family code was older than the bakery ovens.',
        subtext: 'Enter quietly. Take respectfully. Leave the coin. Keep the local promise. A mouse collected because a house had trusted him.',
      },
    },
    {
      id: 'rp3-09-tooth-calls-twice',
      layout: 'narrative',
      background: `${v2}/rp3-frame-09-tooth-calls-twice.png`,
      dialogue: {
        text: "Lucia's tooth glowed in Perez's ledger.",
        subtext: "Far away, the same glow woke Tanda's pendant.",
      },
    },
    {
      id: 'rp3-10-tanda-arrives',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-10-tanda-arrives.png`,
      dialogue: {
        text: 'Perez opened his tiny door and found Tanda trying very hard to look small.',
        subtext: 'This was difficult. She had wings.',
      },
      secondDialogue: {
        speaker: 'Perez',
        speakerColor: perezGold,
        text: 'That is not knocking. That is sunrise with manners.',
      },
    },
    {
      id: 'rp3-11-professional-offense',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-11-professional-offense.png`,
      dialogue: {
        text: "Tanda said she had come because Lucia's tooth called through Toothlight.",
        subtext: 'Perez held his coin tray a little higher.',
      },
      secondDialogue: {
        speaker: 'Perez',
        speakerColor: perezGold,
        text: 'Madrid is not a branch office.',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: tandaGold,
        text: 'I did not come to take Madrid.',
      },
    },
    {
      id: 'rp3-12-old-claim',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-12-old-claim.png`,
      dialogue: {
        text: "Perez showed her the routes, the names, the old seals, the teeth kept safe since his great-grandfather's night.",
        subtext: 'His pride was not vanity. It was a promise with whiskers.',
      },
      secondDialogue: {
        speaker: 'Perez',
        speakerColor: perezGold,
        text: 'A house gives a mouse its trust. I do not misplace that.',
      },
    },
    {
      id: 'rp3-13-wide-claim',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-13-wide-claim.png`,
      dialogue: {
        text: "Tanda opened her hands, and Toothlight showed what the tooth was holding: Mom's old pillow, Papa's old coin, Lucia's worried little note.",
        subtext: 'Perez stopped tapping his stamp.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: tandaGold,
        text: 'She is not asking which story is true. She is asking whether both can love her.',
      },
    },
    {
      id: 'rp3-14-first-argument',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-14-first-argument.png`,
      dialogue: {
        text: "On the roof, the night wind lifted Tanda's hair and Perez's whiskers.",
        subtext: 'They were both right enough to be annoying.',
      },
      secondDialogue: {
        speaker: 'Perez',
        speakerColor: perezGold,
        text: 'Big magic has a habit of making small doors disappear.',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: tandaGold,
        text: 'And small doors can become locks if no one listens through them.',
      },
    },
    {
      id: 'rp3-15-race-to-room',
      layout: 'narrative',
      background: `${v2}/rp3-frame-15-race-to-room.png`,
      dialogue: {
        text: 'Perez took the pipes. Tanda took the sky.',
        subtext: 'Neither called it a race, which was how both of them knew it was one.',
      },
    },
    {
      id: 'rp3-16-mouse-work',
      layout: 'narrative',
      background: `${v2}/rp3-frame-16-mouse-work.png`,
      dialogue: {
        text: "Perez slipped under Lucia's door, past the squeaky toy, past the sleeping cat's tail, past the one floorboard that betrayed amateurs.",
        subtext: 'Every inch of the room had a sound, and Perez knew which ones not to make.',
      },
    },
    {
      id: 'rp3-17-fairy-work',
      layout: 'narrative',
      background: `${v2}/rp3-frame-17-fairy-work.png`,
      dialogue: {
        text: "At the window, Tanda folded her wings and softened the Toothlight until it was no brighter than a sleeping child's breath.",
        subtext: 'Her work was not to dazzle. Her work was to notice.',
      },
    },
    {
      id: 'rp3-19-split-light',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-19-split-light.png`,
      dialogue: {
        text: 'Perez reached under the pillow as Tanda softened the room.',
        subtext: 'The tooth glowed in two colors: bakery gold and pearly fairy light.',
      },
      secondDialogue: {
        text: 'One light held bread and old Madrid stone. One held the hush of a pillow in another country. For one breath, each keeper thought the other was closing the tooth around one answer.',
      },
    },
    {
      id: 'rp3-21-lucia-dream',
      layout: 'narrative',
      background: `${v2}/rp3-frame-21-lucia-dream.png`,
      dialogue: {
        text: 'Then Lucia turned in her sleep, and the tooth showed them her dream.',
        subtext: 'She stood between two bedtime doors, holding one small tooth with both hands.',
      },
    },
    {
      id: 'rp3-22-collectors-fear',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-22-collectors-fear.png`,
      dialogue: {
        text: 'Perez looked very small in the glow.',
        subtext: 'For a moment, Tanda saw what he had been guarding: not the route, but the right to matter.',
      },
      secondDialogue: {
        speaker: 'Perez',
        speakerColor: perezGold,
        text: 'When big stories arrive, little ones are asked to be charming and quiet.',
      },
    },
    {
      id: 'rp3-23-tanda-apology',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-23-tanda-apology.png`,
      dialogue: {
        text: "Tanda folded her wings until the room felt like Perez's size again.",
        subtext: 'She dimmed the Toothlight, stepped back from the pillow, and bowed lower than the mouse door.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: tandaGold,
        text: 'I should have asked how to enter your house.',
      },
    },
    {
      id: 'rp3-24-perez-apology',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-24-perez-apology.png`,
      dialogue: {
        text: "Perez opened his ledger and stared at Lucia's note.",
        subtext: 'There was no box for Can both of you come?',
      },
      secondDialogue: {
        speaker: 'Perez',
        speakerColor: perezGold,
        text: 'My code kept the tooth safe. It did not leave room for the child.',
      },
    },
    {
      id: 'rp3-25-treaty',
      layout: 'dramatic',
      background: `${v2}/rp3-frame-25-treaty.png`,
      dialogue: {
        text: "Perez stamped a tiny receipt with the authority of Madrid's hidden walls.",
        subtext: 'Tanda threaded Toothlight through it without changing the mouse seal.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: tandaGold,
        text: 'Your path carries the tooth.',
      },
      thirdDialogue: {
        speaker: 'Perez',
        speakerColor: perezGold,
        text: 'Your light carries the question.',
      },
    },
    {
      id: 'rp3-26-double-carry',
      layout: 'narrative',
      background: `${v2}/rp3-frame-26-double-carry.png`,
      dialogue: {
        text: "Below the rooftops, Perez carried the tooth through Madrid's mouse roads.",
        subtext: 'Above the rooftops, Tanda carried the memory through Toothlight.',
      },
    },
    {
      id: 'rp3-27-morning-proof',
      layout: 'victory',
      background: `${v2}/rp3-frame-27-morning-proof.png`,
      dialogue: {
        text: "Morning found Lucia with a coin, a tiny stamped receipt, and a glow that held both parents' stories.",
        subtext: "Nobody's tradition had lost. Lucia had gained a bigger home.",
      },
    },
    {
      id: 'rp3-28-treaty-partners',
      layout: 'cta',
      background: `${v2}/rp3-frame-28-treaty-partners.png`,
      dialogue: {
        text: 'At dawn, Perez tucked a new page into his ledger. Tanda did not sign above his name. She signed beside it.',
        subtext: 'Create a Toothlight from the tooth, the story, and the people who helped your child feel held.',
      },
      isChoice: true,
      choiceText: 'Create Your Tooth Keepsake',
      choiceHref: '/toothfairy/app/draw?from=story&slug=ratoncito-perez',
    },
  ],
}

export default ratoncitoPerez
