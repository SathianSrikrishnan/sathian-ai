import { StoryConfig } from './types'

const v2 = '/story-assets/viking-origin/v2'

/**
 * Story 2 - Tanda Fae and the Tooth Fee.
 * Final approval draft: 35 frames, with unique approved/revised v2 art.
 */
const vikingOrigin: StoryConfig = {
  id: 'viking-origin',
  title: 'Tanda Fae and the Tooth Fee',
  region: 'A Viking origin',
  emoji: '\u{2693}',
  color: '#8FB4D4',
  description: 'A Viking story of ships, mercy, and the first Toothlight.',
  characterName: 'Young Tanda',
  available: true,
  crossReferences: ['tanda', 'ratoncito-perez'],
  colors: {
    accent: '#8FB4D4',
    accentGlow: '#8FB4D480',
    secondary: '#E8B77A',
    secondaryGlow: '#E8B77A80',
  },
  effects: {
    particles: {
      color: '#CFE1EF',
      count: 16,
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 12,
      durationMax: 22,
      drift: 18,
      glow: false,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    {
      id: 's2-01-cover',
      layout: 'cover',
      background: `${v2}/s2-frame-01-cover-v3.png`,
      dialogue: {
        text: 'Tanda Fae\nand the Tooth Fee',
        subtext: 'A Viking story of ships, mercy, and the first Toothlight.',
      },
    },
    {
      id: 's2-02-ships-grow',
      layout: 'narrative',
      background: `${v2}/s2-frame-02-shipyard.png`,
      dialogue: {
        text: 'Long before Tanda had wings, she lived where the sea slapped the stones and ships grew rib by rib from oak.',
        subtext: 'She was seven, or almost seven, depending on who was asking.',
      },
    },
    {
      id: 's2-03-maker',
      layout: 'narrative',
      background: `${v2}/s2-frame-03-maker.png`,
      dialogue: {
        text: 'Her father built ships.',
        subtext: 'He could tap a board and know if it wanted to be a keel, an oar, or firewood. Tanda thought this was unfair. The boards never answered her when she tapped them.',
      },
    },
    {
      id: 's2-04-tanda-helps',
      layout: 'dramatic',
      background: `${v2}/s2-frame-04-pitch-v4.png`,
      dialogue: {
        text: 'Tanda wanted to help.',
        subtext: 'She pressed one plank exactly where he told her, then discovered the sticky pitch had joined her sleeve to the ship.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"The ship likes me."',
      },
      thirdDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"The ship has poor judgment."',
      },
    },
    {
      id: 's2-05-wobble',
      layout: 'narrative',
      background: `${v2}/s2-frame-05-wobble.png`,
      dialogue: {
        text: 'That morning, a tooth had been wobbling in her mouth like a loose peg.',
        subtext: 'Tanda kept it secret. Grown-ups became very interested in teeth, and interest was tiring.',
      },
    },
    {
      id: 's2-06-point-comes-loose',
      layout: 'narrative',
      background: `${v2}/s2-frame-06-point-loose.png`,
      dialogue: {
        text: 'At supper she bit a strip of dried fish to prove a point.',
        subtext: 'The point came loose. So did the tooth.',
      },
    },
    {
      id: 's2-07-small-rude-thing',
      layout: 'narrative',
      background: `${v2}/s2-frame-07-small-rude.png`,
      dialogue: {
        text: 'It sat in her palm, small and wet and rude.',
        subtext: 'Tanda did not feel older. She felt as if a piece of herself had fallen out by mistake.',
      },
    },
    {
      id: 's2-08-tooth-fee',
      layout: 'dramatic',
      background: `${v2}/s2-frame-08-tooth-fee.png`,
      dialogue: {
        text: 'Her father cleaned the tooth in warm water.',
        subtext: 'Then he set a bright coin beside it.',
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"A tooth fee. For the one who did the growing."',
      },
    },
    {
      id: 's2-09-still-mine',
      layout: 'dramatic',
      background: `${v2}/s2-frame-09-still-mine.png`,
      dialogue: {
        text: 'Tanda covered the tooth with both hands.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"If I take the coin, is it still mine?"',
      },
      thirdDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"Yes. A fee is not a purchase. It is a promise to notice."',
      },
    },
    {
      id: 's2-10-may-i-carry-it',
      layout: 'dramatic',
      background: `${v2}/s2-frame-10-permission.png`,
      dialogue: {
        text: 'The next morning, the ship was leaving.',
        subtext: 'Her father knelt with a leather cord and a tiny carved keeper, waiting for her answer.',
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"May I carry your tooth until I come home?"',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"You may carry it. But you may not lose it, trade it, or let the goat chew it."',
      },
    },
    {
      id: 's2-11-threading',
      layout: 'dramatic',
      background: `${v2}/s2-frame-11-threading-v3.png`,
      dialogue: {
        text: 'So he threaded the tooth onto the cord.',
        subtext: 'Tanda held the other end until the knot was done. That was her way of saying yes.',
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"Near my heart, then."',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"Until you come home."',
      },
    },
    {
      id: 's2-12-goat-tries',
      layout: 'narrative',
      background: `${v2}/s2-frame-11-goat.png`,
      dialogue: {
        text: 'The goat tried immediately.',
        subtext: 'After a moment like that, goats believed it was their duty to make things less majestic.',
      },
      secondDialogue: {
        text: 'Tanda stood guard until the tooth was tucked safely where her father could feel it.',
      },
    },
    {
      id: 's2-13-ship-leaves',
      layout: 'narrative',
      background: `${v2}/s2-frame-12-ship-leaves.png`,
      dialogue: {
        text: 'When the sail rose, Tanda\'s throat went tight.',
        subtext: 'The ship she had helped build now did the one thing she hated. It took him away.',
      },
    },
    {
      id: 's2-14-promises',
      layout: 'dramatic',
      background: `${v2}/s2-frame-13-promises.png`,
      dialogue: {
        text: '"You promised," she had said.',
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"I promised to carry what is yours."',
      },
      thirdDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"I cannot promise the sea will ask less of me."',
      },
    },
    {
      id: 's2-15-waiting-work',
      layout: 'narrative',
      background: `${v2}/s2-frame-14-waiting-work.png`,
      dialogue: {
        text: 'So Tanda waited.',
        subtext: 'She swept the shipyard. She counted gulls. She named the wood shavings. There were too many shavings. That was exactly why they needed names.',
      },
    },
    {
      id: 's2-16-across-water',
      layout: 'narrative',
      background: `${v2}/s2-frame-15-across-water.png`,
      dialogue: {
        text: 'Across the water, the ship found wind, fog, and empty stores.',
        subtext: 'Winter had been hard everywhere. The men wanted to bring home what their village needed.',
      },
    },
    {
      id: 's2-17-barrel',
      layout: 'narrative',
      background: `${v2}/s2-frame-16-barrel.png`,
      dialogue: {
        text: 'One morning, they found a boy in a barrel.',
        subtext: 'He was holding one of their rope coils and smelled so strongly of herring that even the gulls kept their distance.',
      },
      secondDialogue: {
        text: '"A thief," someone said.',
      },
    },
    {
      id: 's2-18-easier-choice',
      layout: 'narrative',
      background: `${v2}/s2-frame-18-easier-choice-v3.png`,
      dialogue: {
        text: 'Her father was big enough to frighten him.',
        subtext: 'He was tired enough to want to. Taking the rope back would have been easy. Making the boy afraid would have been easier.',
      },
    },
    {
      id: 's2-19-tooth-taps',
      layout: 'dramatic',
      background: `${v2}/s2-frame-19-tooth-taps-v4.png`,
      dialogue: {
        text: 'Then the tooth tapped against his chest.',
        subtext: 'Not loudly. Just enough.',
      },
      secondDialogue: {
        text: 'He remembered Tanda\'s hands closing around it.',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"Still mine."',
      },
    },
    {
      id: 's2-20-eye-level',
      layout: 'dramatic',
      background: `${v2}/s2-frame-19-eye-level.png`,
      dialogue: {
        text: 'He knelt all the way down, to the boy\'s eyes.',
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"What is the rope for?"',
      },
      thirdDialogue: {
        text: 'The boy pointed to shore.',
      },
    },
    {
      id: 's2-21-boy-shows',
      layout: 'narrative',
      background: `${v2}/s2-frame-21-boy-shows-v4.png`,
      dialogue: {
        text: 'The boy led him down the stones.',
        subtext: 'He did not ask for treasure. He pointed to a cracked little boat and a sister trying very hard not to shiver.',
      },
    },
    {
      id: 's2-22-small-boat',
      layout: 'narrative',
      background: `${v2}/s2-frame-20-small-boat.png`,
      dialogue: {
        text: 'On the stones lay a little boat with a split side.',
        subtext: 'Beside it stood the boy\'s sister, barefoot in the cold. The rope was not treasure. It was what he thought might hold their boat together.',
      },
    },
    {
      id: 's2-23-builder-understands',
      layout: 'narrative',
      background: `${v2}/s2-frame-23-builder-understands-v3.png`,
      dialogue: {
        text: 'A broken boat was different from a stolen rope.',
        subtext: 'Her father knew what broken things asked for. Not shouting. Not punishment. Time, tools, and someone willing to be late.',
      },
    },
    {
      id: 's2-24-mercy-does',
      layout: 'narrative',
      background: `${v2}/s2-frame-21-mercy-repair.png`,
      dialogue: {
        text: 'Tanda\'s father took back the rope.',
        subtext: 'Then he took up his tools.',
      },
      secondDialogue: {
        text: 'By dusk, the little boat held together, the boy\'s sister had socks from the ship\'s spare wool, and nobody had been hit.',
      },
    },
    {
      id: 's2-25-shores-meet',
      layout: 'narrative',
      background: `${v2}/s2-frame-25-shores-meet-v4.png`,
      dialogue: {
        text: 'When the little boat held, he did not hurry back to his own ship.',
        subtext: 'He called the two sides closer: the ones with tools, the ones with wool, the ones with fish, the ones with rope.',
      },
      secondDialogue: {
        text: 'It took longer to talk. It also left everyone with more than they had before.',
      },
    },
    {
      id: 's2-26-slower-than-taking',
      layout: 'narrative',
      background: `${v2}/s2-frame-22-trade.png`,
      dialogue: {
        text: 'The next day, the two villages traded.',
        subtext: 'Work for food. Nails for wool. Rope for fish. It was slower than taking. It was better.',
      },
    },
    {
      id: 's2-27-first-toothlight',
      layout: 'narrative',
      background: `${v2}/s2-frame-23-first-toothlight.png`,
      dialogue: {
        text: 'That night, the tooth glowed near his heart like a star that had chosen a small place to live.',
        subtext: 'Her father did not understand it. But he knew what had called it forward.',
      },
    },
    {
      id: 's2-28-homecoming',
      layout: 'narrative',
      background: `${v2}/s2-frame-24-homecoming.png`,
      dialogue: {
        text: 'When the ship came home, Tanda ran before she remembered she had legs.',
        subtext: 'Her father came down the plank and knelt in the sand, laughing as she crashed into him.',
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"I came home."',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"You brought it back."',
      },
    },
    {
      id: 's2-29-it-carried-me-home',
      layout: 'dramatic',
      background: `${v2}/s2-frame-25-home-glow.png`,
      dialogue: {
        text: 'The tooth shone in his palm, bright as dawn.',
      },
      secondDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"It carried me home."',
      },
      thirdDialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"But not the way I expected."',
      },
    },
    {
      id: 's2-30-what-it-held',
      layout: 'narrative',
      background: `${v2}/s2-frame-26-memory.png`,
      dialogue: {
        text: 'Tanda touched it.',
        subtext: 'She smelled herring, heard waves knocking a cracked boat, and saw a boy blink hard because someone had been kind when he expected shouting.',
      },
      secondDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"It remembers."',
      },
    },
    {
      id: 's2-31-promise-grows',
      layout: 'dramatic',
      background: `${v2}/s2-frame-27-promise-grows.png`,
      dialogue: {
        speaker: 'Father',
        speakerColor: '#8FB4D4',
        text: '"You remembered first."',
      },
      secondDialogue: {
        text: 'Tanda placed the tooth in her wooden box with her drawing: a ship, a rope, two children on opposite shores.',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: '#E8B77A',
        text: '"Then I will remember for others."',
      },
    },
    {
      id: 's2-32-box-answers',
      layout: 'victory',
      background: `${v2}/s2-frame-30-box-answers-v3.png`,
      dialogue: {
        text: 'The box answered.',
        subtext: 'Not with words. With little places: a rooftop under rain, a mouse-sized door, a feather, a seed pressing up through soil.',
      },
      secondDialogue: {
        text: 'The tooth had not kept only a memory. It had kept a way.',
      },
    },
    {
      id: 's2-33-network-wings',
      layout: 'victory',
      background: `${v2}/s2-frame-31-network-wings-v3.png`,
      dialogue: {
        text: 'Light gathered around Tanda\'s shoulders.',
        subtext: 'It did not make her less herself. It made room for everywhere she might be needed.',
      },
      secondDialogue: {
        text: 'Somewhere, another child was letting go of something small.',
      },
    },
    {
      id: 's2-34-what-she-carries',
      layout: 'victory',
      background: `${v2}/s2-frame-34-adult-tanda-v2.png`,
      dialogue: {
        text: 'Tanda grew after that, and so did the promise.',
        subtext: 'When children lost what they had outgrown, she could feel the bright place it belonged.',
      },
      secondDialogue: {
        text: 'The first tooth stayed near her heart, where all good borrowed things should be carried.',
      },
    },
    {
      id: 's2-35-cta',
      layout: 'cta',
      background: `${v2}/s2-frame-35-toothlight-cta-v4.png`,
      dialogue: {
        text: 'Your child\'s tooth is one small sign of a big change.',
        subtext: 'Create a Toothlight from the tooth, their words, and the memory you want to keep.',
      },
      isChoice: true,
      choiceText: 'Create Your Tooth Keepsake',
      choiceHref: '/toothfairy/app/draw?from=story&slug=viking-origin',
    },
  ],
}

export default vikingOrigin
