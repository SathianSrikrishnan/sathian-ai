import type { Story } from './index'

const base =
  'https://tvujxgdwgvrunjvhseey.supabase.co/storage/v1/object/public/tfn-story-assets/stories/first-tooth-fee'

/**
 * Story 2 - Tanda Fae and the First Tooth Fee.
 * A Viking origin: ships, mercy, and the first Toothlight.
 *
 * Frame text adapted for read-aloud from the toothlight-v4 scene data.
 * Frame filenames follow the source scenes' `background` fields exactly
 * (scene numbering and frame filenames diverge in places, and several
 * frames use approved v3/v4 art revisions). The closing CTA frame is
 * skipped.
 */
const firstToothFee: Story = {
  slug: 'first-tooth-fee',
  title: 'Tanda Fae and the First Tooth Fee',
  hook: 'A Viking story about a coin, a promise, and kindness carried home.',
  keeper: 'Young Tanda',
  tradition: 'A Viking origin',
  cover: `${base}/s2-frame-01-cover-v3.png`,
  minutes: 6,
  frames: [
    {
      image: `${base}/s2-frame-01-cover-v3.png`,
      text: 'Tanda Fae and the First Tooth Fee. A story about one small tooth and a promise big enough to cross the sea.',
    },
    {
      image: `${base}/s2-frame-02-shipyard.png`,
      text: 'Long before Tanda had wings, she lived where waves slapped stones and ships grew rib by rib from oak. She was seven—or nearly, depending who asked.',
    },
    {
      image: `${base}/s2-frame-03-maker.png`,
      text: 'Her father built ships. He could tap a board and hear keel, oar, or firewood. Tanda tapped too. The boards kept their opinions private.',
    },
    {
      image: `${base}/s2-frame-04-pitch-v4.png`,
      text: 'She pressed a plank exactly where he asked. Sticky pitch promptly joined her sleeve to the ship. "It likes me." "It has poor judgment."',
    },
    {
      image: `${base}/s2-frame-05-wobble.png`,
      text: 'A tooth wobbled in her mouth like a loose peg. Tanda kept it secret. Grown-ups became terribly interested in teeth.',
    },
    {
      image: `${base}/s2-frame-06-point-loose.png`,
      text: 'At supper she bit dried fish to prove a point. The point came loose. So did the tooth.',
    },
    {
      image: `${base}/s2-frame-07-small-rude.png`,
      text: 'It sat in her palm, small and rude. Tanda did not feel older. She felt as if something had fallen out by mistake.',
    },
    {
      image: `${base}/s2-frame-08-tooth-fee.png`,
      text: 'Her father washed the tooth and placed a bright coin beside it. "A tooth fee," he said. "For the one who did the growing."',
    },
    {
      image: `${base}/s2-frame-09-still-mine.png`,
      text: 'Tanda covered the tooth. "If I take the coin, is it still mine?" "Always. A fee is not a purchase. It is a promise to notice."',
    },
    {
      image: `${base}/s2-frame-10-permission.png`,
      text: 'The ship left next morning. Her father held out a leather cord. "May I carry your tooth until I return?" Tanda agreed—with no losing, trading, or goat chewing.',
    },
    {
      image: `${base}/s2-frame-11-threading-v3.png`,
      text: 'He threaded the tooth onto the cord while Tanda held the other end. "Near my heart." "Until you come home."',
    },
    {
      image: `${base}/s2-frame-11-goat.png`,
      text: 'The goat tried immediately. Goats considered it their duty to make serious moments less majestic. Tanda stood guard.',
    },
    {
      image: `${base}/s2-frame-12-ship-leaves.png`,
      text: 'When the sail rose, Tanda\'s throat tightened. Her father touched the tooth at his heart. "I promised to carry what is yours." Then the ship took him away.',
    },
    {
      image: `${base}/s2-frame-15-across-water.png`,
      text: 'Across the water came wind, fog, and empty stores. Winter had been hard everywhere, and every shore needed something.',
    },
    {
      image: `${base}/s2-frame-16-barrel.png`,
      text: 'One morning, the crew found a boy hiding in a barrel with their rope. He smelled so strongly of herring that even the gulls kept away.',
    },
    {
      image: `${base}/s2-frame-18-easier-choice-v3.png`,
      text: "Tanda's father was tired and enormous. Frightening the boy would have been easy. Then the tooth tapped softly against his chest.",
    },
    {
      image: `${base}/s2-frame-19-tooth-taps-v4.png`,
      text: 'He remembered Tanda closing both hands around it. Still mine. A promise to notice had crossed the sea with him.',
    },
    {
      image: `${base}/s2-frame-19-eye-level.png`,
      text: 'He knelt to the boy\'s height. "What is the rope for?" The boy pointed toward shore.',
    },
    {
      image: `${base}/s2-frame-20-small-boat.png`,
      text: 'A cracked little boat waited there beside the boy\'s shivering sister. The rope was not treasure. It was their best idea for getting home.',
    },
    {
      image: `${base}/s2-frame-23-builder-understands-v3.png`,
      text: 'Her father understood broken boats. He brought tools, wool socks, and patience. By dusk the boat held; by morning both shores were trading help, not taking it.',
    },
    {
      image: `${base}/s2-frame-23-first-toothlight.png`,
      text: "That night, Tanda's tooth warmed near his heart. It had noticed the moment he listened before choosing.",
    },
    {
      image: `${base}/s2-frame-24-homecoming.png`,
      text: 'When the ship returned, Tanda ran before remembering she had legs. Her father knelt, laughing, as she crashed into him. "You brought it back."',
    },
    {
      image: `${base}/s2-frame-26-memory.png`,
      text: 'Tanda touched the glowing tooth. She smelled herring, heard waves tap a cracked boat, and saw a frightened boy relax when nobody shouted.',
    },
    {
      image: `${base}/s2-frame-27-promise-grows.png`,
      text: 'She placed it in her wooden box with a note and a drawing: ship, rope, two children, and Dad kneeling to listen. The full memory became a warm Toothlight.',
    },
    {
      image: `${base}/s2-frame-30-box-answers-v3.png`,
      text: 'The box answered with glimpses: a rainy rooftop, a mouse-sized door, a feather, a seed. One promise had found many possible paths.',
    },
    {
      image: `${base}/s2-frame-31-network-wings-v3.png`,
      text: "Light gathered around Tanda's shoulders and opened into wings. Somewhere, another child was letting go of something small.",
    },
    {
      image: `${base}/s2-frame-34-adult-tanda-v2.png`,
      text: 'Tanda grew, and so did the promise. She carried every borrowed tooth carefully and listened for the child inside its memory. What did your child notice today? Write and draw it together.',
    },
  ],
}

export default firstToothFee
