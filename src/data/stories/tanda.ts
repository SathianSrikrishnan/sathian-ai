import { StoryConfig } from './types'

const v2 = '/story-assets/tanda/v2'

/**
 * Story 1 - Tanda and the Night the Network Woke.
 * Modern Network origin: why Tanda's old promise now needs many guardians.
 */
const tanda: StoryConfig = {
  id: 'tanda',
  title: 'Tanda and the Night the Network Woke',
  region: 'Network origin',
  emoji: '\u{1FAB6}',
  color: '#F0C456',
  description: 'The night one skipped note taught Tanda that every tooth needs its story, and every story needs the right keeper.',
  characterName: 'Tanda',
  available: true,
  crossReferences: ['viking-origin', 'ratoncito-perez'],
  colors: {
    accent: '#F0C456',
    accentGlow: '#F0C45680',
    secondary: '#E8B77A',
    secondaryGlow: '#E8B77A80',
  },
  effects: {
    particles: {
      color: '#F0C456',
      count: 24,
      sizeMin: 2,
      sizeMax: 5,
      durationMin: 10,
      durationMax: 18,
      drift: 24,
      glow: true,
    },
    aurora: {
      colors: ['#F0C456', '#E8B77A', '#8FB4D4'],
      bands: 3,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    {
      id: 's1-01-cover',
      layout: 'cover',
      background: `${v2}/s1-frame-01-cover.png`,
      dialogue: {
        text: 'Tanda and the Night the Network Woke',
        subtext: 'A story about the tooth, the corn, and the first call to the keepers.',
      },
    },
    {
      id: 's1-02-dinner-late',
      layout: 'narrative',
      background: `${v2}/s1-frame-02-dinner-late.png`,
      dialogue: {
        text: 'Dinner was already late.',
        subtext: 'Elias was six, wearing space pajamas at the table, because sometimes bedtime and dinner had to share a chair.',
      },
      secondDialogue: {
        text: 'His dad had said, "Just three more bites." Elias had decided this was unfair, because one of the bites was corn, and corn had too many small parts.',
      },
    },
    {
      id: 's1-03-tooth-comes-out',
      layout: 'dramatic',
      background: `${v2}/s1-frame-03-tooth-comes-out.png`,
      dialogue: {
        text: 'On the second bite, something clicked.',
      },
      secondDialogue: {
        speaker: 'Elias',
        speakerColor: '#8FB4D4',
        text: '"I meant to do that."',
      },
      thirdDialogue: {
        text: 'His tooth sat on the table, tiny and white and looking very pleased with itself.',
      },
    },
    {
      id: 's1-04-tooth-words',
      layout: 'dramatic',
      background: `${v2}/s1-frame-04-tooth-words.png`,
      dialogue: {
        text: 'After dinner, Dad put the tooth in a little blue dish.',
        subtext: 'Then he slid over a pencil.',
      },
      secondDialogue: {
        speaker: 'Dad',
        speakerColor: '#8FB4D4',
        text: '"Want help spelling surprised?"',
      },
      thirdDialogue: {
        speaker: 'Elias',
        speakerColor: '#E8B77A',
        text: '"No. Then it will be your surprise."',
      },
    },
    {
      id: 's1-05-bad-spelling-note',
      layout: 'dramatic',
      background: `${v2}/s1-frame-05-bad-spelling-note.png`,
      dialogue: {
        text: 'So Elias wrote it himself.',
        subtext: 'The letters leaned. The tooth drawing had too many roots. The corn was mostly yellow scribble.',
      },
      secondDialogue: {
        speaker: "Elias's note",
        speakerColor: '#E8B77A',
        text: '"I lost it on corn. I was brave. Also surprised."',
      },
    },
    {
      id: 's1-06-under-pillow',
      layout: 'narrative',
      background: `${v2}/s1-frame-06-under-pillow.png`,
      dialogue: {
        text: 'He tucked the tooth, the note, and the drawing under his pillow.',
        subtext: 'Then he checked once. Then twice. Then one more time, because pillows were suspicious.',
      },
      secondDialogue: {
        text: 'Dad kissed his hair and left the door open exactly one hand wide.',
      },
    },
    {
      id: 's1-07-tandas-route',
      layout: 'narrative',
      background: `${v2}/s1-frame-07-tandas-route.png`,
      dialogue: {
        text: 'Above the roofs, Tanda was already flying.',
        subtext: 'She knew every loose tooth by its small gold call. She knew which windows stuck, which dogs barked, and which children pretended to sleep with both eyes open.',
      },
    },
    {
      id: 's1-08-coin-and-done',
      layout: 'narrative',
      background: `${v2}/s1-frame-08-coin-and-done.png`,
      dialogue: {
        text: 'She was very good at the work.',
        subtext: 'Tooth lifted. Coin left. Pillow smoothed. Window closed. On to the next glow.',
      },
      secondDialogue: {
        text: 'From the outside, every visit looked perfect.',
      },
    },
    {
      id: 's1-09-unread-pocket',
      layout: 'dramatic',
      background: `${v2}/s1-frame-09-unread-pocket.png`,
      dialogue: {
        text: 'But Tanda had made one small habit.',
        subtext: 'When a note was long, or a drawing was folded, or a memory felt tangled, she tucked it into the side pocket of her satchel.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: '"I will read it after the route."',
      },
    },
    {
      id: 's1-10-dull-glow',
      layout: 'dramatic',
      background: `${v2}/s1-frame-10-dull-glow.png`,
      dialogue: {
        text: 'After was getting crowded.',
        subtext: 'In the side pocket, some teeth still glowed. Some only shimmered. One had gone pale at the edges, like a story told too quickly.',
      },
    },
    {
      id: 's1-11-professional-entrance',
      layout: 'dramatic',
      background: `${v2}/s1-frame-11-professional-entrance.png`,
      dialogue: {
        text: 'Tanda reached Elias just after midnight.',
        subtext: 'She slipped through the window in her most professional way, tapped one hanging planet with her wing, caught it, and bowed to absolutely no one.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: '"No one saw that."',
      },
    },
    {
      id: 's1-12-warm-tooth',
      layout: 'narrative',
      background: `${v2}/s1-frame-12-warm-tooth.png`,
      dialogue: {
        text: 'The tooth was warm when she lifted it.',
        subtext: 'Not warm like soup. Warm like a laugh that had just happened.',
      },
      secondDialogue: {
        text: 'Corn. A blue dish. Dad trying not to smile. A boy feeling braver than he expected.',
      },
    },
    {
      id: 's1-13-another-window-calls',
      layout: 'dramatic',
      background: `${v2}/s1-frame-13-another-window-calls.png`,
      dialogue: {
        text: 'Then another window flashed across town.',
        subtext: 'A new tooth. A nervous child. Dawn moving closer.',
      },
      secondDialogue: {
        text: 'Tanda looked from the glow outside to the folded note near Elias\'s pillow.',
      },
    },
    {
      id: 's1-14-read-it-after',
      layout: 'dramatic',
      background: `${v2}/s1-frame-14-read-it-after.png`,
      dialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: '"I will read it after."',
      },
      secondDialogue: {
        text: 'She meant it. That was the trouble with after. It sounded almost as good as now.',
      },
    },
    {
      id: 's1-15-note-slips',
      layout: 'narrative',
      background: `${v2}/s1-frame-15-note-slips.png`,
      dialogue: {
        text: 'The note slipped from under the pillow.',
        subtext: 'It turned once in the moonlight and landed where Tanda had not looked.',
      },
    },
    {
      id: 's1-16-first-nibble',
      layout: 'dramatic',
      background: `${v2}/s1-frame-16-first-nibble.png`,
      dialogue: {
        text: 'At the edge of the Toothlight, something small noticed.',
        subtext: 'A curl of shadow. A bite in the gold. A very old, very fussy little hunger.',
      },
    },
    {
      id: 's1-17-corn-part',
      layout: 'dramatic',
      background: `${v2}/s1-frame-17-corn-part.png`,
      dialogue: {
        text: 'Elias stirred in his sleep.',
      },
      secondDialogue: {
        speaker: 'Elias',
        speakerColor: '#E8B77A',
        text: '"Do not forget the corn part."',
      },
      thirdDialogue: {
        text: 'Tanda stopped moving.',
      },
    },
    {
      id: 's1-18-too-plain',
      layout: 'narrative',
      background: `${v2}/s1-frame-18-too-plain.png`,
      dialogue: {
        text: 'The tooth still glowed, but not enough.',
        subtext: 'It remembered a child. A dinner. A tooth. But it was forgetting Elias.',
      },
    },
    {
      id: 's1-19-the-voice',
      layout: 'dramatic',
      background: `${v2}/s1-frame-19-the-voice.png`,
      dialogue: {
        text: 'A tiny voice cleared its tiny throat.',
      },
      secondDialogue: {
        speaker: 'The Old Forgetting',
        speakerColor: '#4A3328',
        text: '"Unread things are unattended things."',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: '"That is not yours."',
      },
    },
    {
      id: 's1-20-memory-opens',
      layout: 'narrative',
      background: `${v2}/s1-frame-20-memory-opens.png`,
      dialogue: {
        text: 'Tanda opened the memory properly.',
        subtext: 'There was the corn. There was Dad\'s worried face. There was Elias checking for blood, finding none, and becoming proud all at once.',
      },
    },
    {
      id: 's1-21-missing-bit',
      layout: 'dramatic',
      background: `${v2}/s1-frame-21-missing-bit.png`,
      dialogue: {
        text: 'The Old Forgetting pulled at the funniest part first.',
        subtext: 'Not the tooth. Not the coin. The exact bit. The Elias bit.',
      },
    },
    {
      id: 's1-22-tanda-gives-chase',
      layout: 'narrative',
      background: `${v2}/s1-frame-22-tanda-gives-chase.png`,
      dialogue: {
        text: 'Tanda dove after it through the Toothlight.',
        subtext: 'Past breakfast smells, sock arguments, bedtime songs, and half-remembered jokes from children she had promised to read later.',
      },
    },
    {
      id: 's1-23-exact-words',
      layout: 'dramatic',
      background: `${v2}/s1-frame-23-exact-words.png`,
      dialogue: {
        text: 'Then she found Elias\'s note.',
        subtext: 'She read every uneven letter. She read the brave part. She read the surprised part. She read the corn part twice.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: '"There you are."',
      },
    },
    {
      id: 's1-24-forgetting-retreats',
      layout: 'dramatic',
      background: `${v2}/s1-frame-24-forgetting-retreats.png`,
      dialogue: {
        text: 'The Old Forgetting spat out the little gold piece.',
      },
      secondDialogue: {
        speaker: 'The Old Forgetting',
        speakerColor: '#4A3328',
        text: '"Too much corn."',
      },
      thirdDialogue: {
        text: 'It curled itself thin and slipped back where neglected things wait.',
      },
    },
    {
      id: 's1-25-first-toothlight',
      layout: 'victory',
      background: `${v2}/s1-frame-25-first-toothlight.png`,
      dialogue: {
        text: 'The tooth brightened.',
        subtext: 'The note, the drawing, the dinner laugh, the proud little gap in Elias\'s smile - all of it gathered into one warm Toothlight.',
      },
    },
    {
      id: 's1-26-real-wound',
      layout: 'dramatic',
      background: `${v2}/s1-frame-26-real-wound.png`,
      dialogue: {
        text: 'Tanda opened her satchel.',
        subtext: 'The side pocket was full. Too full. Tiny teeth. Folded notes. Drawings waiting for after.',
      },
      secondDialogue: {
        text: 'She had not missed the teeth. She had missed the listening.',
      },
    },
    {
      id: 's1-27-old-promise',
      layout: 'dramatic',
      background: `${v2}/s1-frame-27-old-promise.png`,
      dialogue: {
        text: 'Her pendant warmed against her heart.',
        subtext: 'Long ago, a tooth fee had become a promise: what a child outgrows is still worth carrying carefully.',
      },
      secondDialogue: {
        text: 'A promise to carry was also a promise to notice.',
      },
    },
    {
      id: 's1-28-first-rule',
      layout: 'victory',
      background: `${v2}/s1-frame-28-first-rule.png`,
      dialogue: {
        text: 'So Tanda made the first rule.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: '"No tooth without its story."',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#F0C456',
        text: '"And no story left for after."',
      },
    },
    {
      id: 's1-29-letter-to-perez',
      layout: 'narrative',
      background: `${v2}/s1-frame-29-letter-to-perez.png`,
      dialogue: {
        text: 'A rule needed keepers.',
        subtext: 'The first letter went to Madrid. It arrived at a mouse-sized desk, where Ratoncito Perez was already sorting three teeth, two receipts, and what he called professional crumbs.',
      },
      secondDialogue: {
        text: 'He looked offended before he even opened it, which Tanda would later learn meant he was interested.',
      },
    },
    {
      id: 's1-30-letters-elsewhere',
      layout: 'victory',
      background: `${v2}/s1-frame-30-letters-elsewhere.png`,
      dialogue: {
        text: 'Then Tanda tuned the Network.',
        subtext: 'She sent gold threads to Kkachi, the rooftop magpie in Korea; to mouse doors, sunlit thresholds, seed-keepers, night-runners, and quiet paths where brave children left small things in the dark.',
      },
      secondDialogue: {
        text: 'She did not make every keeper the same. She helped their different songs answer one another.',
      },
    },
    {
      id: 's1-31-morning-proof',
      layout: 'narrative',
      background: `${v2}/s1-frame-31-morning-proof.png`,
      dialogue: {
        text: 'In the morning, the Network had its first proof.',
        subtext: 'Then he found the tiny glow beside it.',
      },
      secondDialogue: {
        speaker: 'Elias',
        speakerColor: '#E8B77A',
        text: '"She kept the corn part."',
      },
    },
    {
      id: 's1-32-cta',
      layout: 'cta',
      background: `${v2}/s1-frame-32-network-begins-cta.png`,
      dialogue: {
        text: 'The Network began because one child wrote the exact thing only he could write.',
        subtext: 'Create a Toothlight from the tooth, their words, and the memory you want to keep.',
      },
      isChoice: true,
      choiceText: 'Create Your Tooth Keepsake',
      choiceHref: '/toothfairy/app/draw?from=story&slug=tanda',
    },
  ],
}

export default tanda
