import type { Story } from './index'

const base =
  'https://tvujxgdwgvrunjvhseey.supabase.co/storage/v1/object/public/tfn-story-assets/stories/edge-of-the-light'

/**
 * Story 5 - Waraba at the Edge of the Light.
 * A Harar-region story of a tooth, a doorway, and the courage that walks
 * beside fear.
 *
 * Frame text adapted for read-aloud from the waraba-edge-light scene data
 * (source scene ids waraba-01 through waraba-43; the source numbering skips
 * ids, giving 32 scenes with 32 unique frames, mapped 1:1 by each scene's
 * `background` field). The closing CTA scene keeps its narrative text as
 * the final frame, with the choice link dropped.
 */
const edgeOfTheLight: Story = {
  slug: 'edge-of-the-light',
  title: 'Waraba at the Edge of the Light',
  hook: 'A Harar story about one tooth, one brave step, and the keeper who waits beside fear.',
  keeper: 'Waraba',
  tradition: 'Ethiopian threshold tradition',
  cover: `${base}/s5-frame-01-cover.png`,
  minutes: 6,
  frames: [
    {
      image: `${base}/s5-frame-01-cover.png`,
      text: 'Waraba at the Edge of the Light. A story about one tooth, one brave step, and a keeper who waited beside fear.',
    },
    {
      image: `${base}/s5-frame-02-place-that-listens.png`,
      text: "Night outside Ilyas's house held cooling stones, dry grass, and old paths his mother knew. Beyond the kitchen lamp, Waraba listened.",
    },
    {
      image: `${base}/s5-frame-03-tooth-trouble.png`,
      text: 'Ilyas\'s tooth had been loose for four days. He named it Captain Wobble. "Captain Wobble fears no soup." Captain Wobble feared soup a little.',
    },
    {
      image: `${base}/s5-frame-04-announcement.png`,
      text: 'At supper, the tooth slipped free and landed in his palm. "Mutiny," said Ilyas. His mother laughed into her hand.',
    },
    {
      image: `${base}/s5-frame-06-old-way.png`,
      text: 'His mother rinsed the tooth. "Our family steps beyond the light, offers the tooth, and asks Waraba for a strong new one." Ilyas\'s smile paused for one blink.',
    },
    {
      image: `${base}/s5-frame-08-how-big-is-waraba.png`,
      text: '"How big is Waraba?" Ilyas asked. "Bigger than a joke." Ilyas frowned. "That is not a measurement." "No," said his mother. "It is an honest answer."',
    },
    {
      image: `${base}/s5-frame-11-door-opens.png`,
      text: 'Ilyas stood at the open door. "I will throw from here. Efficient. Aerodynamic. Nearly ancient." His mother smiled. "The old way asks for your feet too." "My feet send their respects."',
    },
    {
      image: `${base}/s5-frame-14-tooth-in-the-light.png`,
      text: 'Ilyas flicked the tooth into the bright rectangle on the ground. It glowed, dimmed, and left a thin crack in the threshold dust. "Delivered," he said.',
    },
    {
      image: `${base}/s5-frame-16-tanda-at-the-edge.png`,
      text: 'After the door closed, Tanda came to the edge of the light and folded her glow small. She could stand beside this ritual. She could not finish it for Ilyas.',
    },
    {
      image: `${base}/s5-frame-17-waraba-does-not-move.png`,
      text: 'Far out in the dark, Waraba opened one amber eye and waited. A gift not truly given could not yet be received.',
    },
    {
      image: `${base}/s5-frame-18-morning-proof.png`,
      text: 'In the morning, the tooth still waited in the light. "Waraba must be busy," said Ilyas. His mother placed it back in his palm. It felt heavier.',
    },
    {
      image: `${base}/s5-frame-20-near-is-not-given.png`,
      text: '"I came near," said Ilyas. "Near is a doorway, not a gift," his mother answered gently. "You do not have to try again. But the tooth will know."',
    },
    {
      image: `${base}/s5-frame-21-what-she-remembered.png`,
      text: '"When I was little, I stood there too," his mother said. "Were you scared?" "The whole way. The dark stayed big. My mother waited. Waraba waited. I stepped."',
    },
    {
      image: `${base}/s5-frame-23-tandas-advice.png`,
      text: 'That evening, Tanda sat at the edge. "Can you make the dark less dark?" Ilyas asked. "No. I can stand where the light ends. You are not alone, but the step must be yours."',
    },
    {
      image: `${base}/s5-frame-26-first-step.png`,
      text: 'Ilyas stepped over the threshold. One whole foot stood in the dark. Nothing grabbed him. "That is rude," he whispered. "I prepared several heroic noises."',
    },
    {
      image: `${base}/s5-frame-30-warm-stone.png`,
      text: 'Ilyas walked farther. Fear came beside him instead of blocking the way. A warm stone waited under his sandal. He breathed until his jokes stopped bumping into one another.',
    },
    {
      image: `${base}/s5-frame-31-past-the-light.png`,
      text: 'The doorway became a small amber shape behind him. Ilyas opened his palm. "Waraba, this is my tooth. Please give me a strong new one."',
    },
    {
      image: `${base}/s5-frame-32-true-throw.png`,
      text: 'This time, Ilyas threw from beyond the kitchen light. The tooth made a white arc and vanished. He did not chase it with a joke. He waited.',
    },
    {
      image: `${base}/s5-frame-34-the-eyes.png`,
      text: 'Two amber eyes opened low to the ground. Ilyas felt every joke go quiet at once. For once, they wanted to listen too.',
    },
    {
      image: `${base}/s5-frame-35-waraba-revealed.png`,
      text: 'Waraba stepped nearer, enormous but unhurried. His spotted coat held night and dust. His amber eyes were warm and steady.',
    },
    {
      image: `${base}/s5-frame-36-the-breath.png`,
      text: 'Waraba breathed over the tooth. In that warm breath lived the first throw, the joke, and the real step. Then he took the tooth as gently as Mother had held it.',
    },
    {
      image: `${base}/s5-frame-39-threshold-glow.png`,
      text: "Beside Ilyas's foot, an amber-warm stone appeared with one tiny eye-shaped mark. It was small enough for a pocket: proof that fear had company.",
    },
    {
      image: `${base}/s5-frame-41-back-to-kitchen.png`,
      text: 'Ilyas walked back. Fear came too, but now it knew the way. His shadow followed behind him. Mother held the door open, and Tanda waited at the edge.',
    },
    {
      image: `${base}/s5-frame-42-right-answer.png`,
      text: '"Were you scared?" Mother asked. "Yes," said Ilyas, holding up the warm stone. "Very professionally." Mother and Tanda laughed softly.',
    },
    {
      image: `${base}/s5-frame-43-shelf-opens.png`,
      text: "At dawn, Tanda set the warm stone beside Ilyas's note and drawing. Beyond the kitchen light, Waraba slept with one new story in his breath. What brave step did you take together today? Draw it side by side.",
    },
  ],
}

export default edgeOfTheLight
