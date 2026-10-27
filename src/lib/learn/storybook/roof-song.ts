import type { Story } from './index'

const base =
  'https://tvujxgdwgvrunjvhseey.supabase.co/storage/v1/object/public/tfn-story-assets/stories/roof-song'

/**
 * Story 4 - Kkachi and the Roof Song.
 * A Korean story of a magpie, a lost tooth, and the old words that knew the way home.
 *
 * Frame text adapted for read-aloud from the gen-2 korea scene data
 * (source scene ids kkachi-01 through kkachi-45; 45 scenes over 38 unique
 * frame images). Frame filenames follow the source scenes' `background`
 * fields exactly. Consecutive scenes that share one background are merged
 * into a single frame (scenes 05+06, 12+13, 16+17, 22+23, and 33+34+35),
 * giving 39 frames. The closing CTA scene keeps its narrative text as the
 * final frame (its art deliberately reprises the frame used at the carry),
 * with the choice link dropped.
 */
const roofSong: Story = {
  slug: 'roof-song',
  title: 'Kkachi and the Roof Song',
  hook: "A rooftop story about a grandmother's song and the slow line that carries it.",
  keeper: 'Kkachi',
  tradition: 'South Korean rooftop tradition',
  cover: `${base}/s4-frame-01-cover.png`,
  minutes: 6,
  frames: [
    {
      image: `${base}/s4-frame-01-cover.png`,
      text: 'Kkachi and the Roof Song. A story about a lost tooth, a shiny remix, and the slow line that knew the way home.',
    },
    {
      image: `${base}/s4-frame-02-loose-tooth.png`,
      text: "Jiyoon's tooth had wobbled all week: tap-tap, twist-twist, please-stop-thinking-about-me.",
    },
    {
      image: `${base}/s4-frame-03-grandmother-enters.png`,
      text: 'At supper, Jiyoon bit a pear slice to prove the tooth was not ready. The tooth disagreed and popped free like a tiny announcement.',
    },
    {
      image: `${base}/s4-frame-04-first-roof-song.png`,
      text: 'Grandmother held out a folded tissue. The tooth looked smaller and stranger than Jiyoon expected. A piece of her had come loose, and everyone seemed delighted.',
    },
    {
      image: `${base}/s4-frame-05-jiyoon-listens.png`,
      text: 'Grandmother washed the tooth in a little bowl. "When I was small, we knew who to call." Then she sang so softly the window leaned closer. "Kkachi-ya, Kkachi-ya..."',
    },
    {
      image: `${base}/s4-frame-06-explanation.png`,
      text: '"Old tooth, new tooth," Grandmother explained. "Take what is finished. Help what is growing." Jiyoon nodded. Mostly, she heard the beat.',
    },
    {
      image: `${base}/s4-frame-07-first-choice.png`,
      text: "The song was sweet, old, and, in Jiyoon's professional opinion, very slow. She had the best idea anyone with one missing tooth had ever had.",
    },
    {
      image: `${base}/s4-frame-08-phone-opens.png`,
      text: 'Jiyoon opened her recorder. Tap. Clap. Loop. The old song became faster, brighter, and much more roof-worthy.',
    },
    {
      image: `${base}/s4-frame-11-roofline-wakes.png`,
      text: 'One line was too slow. One pause was too quiet. One piece sounded exactly like Grandmother. Jiyoon trimmed it out.',
    },
    {
      image: `${base}/s4-frame-10-grandmother-pauses.png`,
      text: 'Grandmother listened from the doorway and gave half a smile. "I made it cooler!" said Jiyoon. "Clever," Grandmother said. "It still needs to know where it came from."',
    },
    {
      image: `${base}/s4-frame-14-first-rooftop-step.png`,
      text: "Far above Seoul, Tanda followed a bright letter humming with roof tiles and bird feet. The roof listened differently, so she folded her glow close and landed softly.",
    },
    {
      image: `${base}/s4-frame-17-kkachi-arrives.png`,
      text: 'Kkachi swept onto the roof in black, white, and blue-green shine. "If this is about the shiny noise, I heard it three chimneys ago. The confidence is enormous."',
    },
    {
      image: `${base}/s4-frame-18-kkachi-and-tanda.png`,
      text: 'Tanda bowed. "A child is calling." Kkachi tilted her head. "A child is performing. There is a difference." "Then we listen first," said Tanda.',
    },
    {
      image: `${base}/s4-frame-15-roof-call-starts.png`,
      text: 'That evening, Jiyoon and Grandmother stepped onto the rooftop terrace. City lights blinked on while Jiyoon held the tooth tight.',
    },
    {
      image: `${base}/s4-frame-19-tooth-thrown.png`,
      text: 'Jiyoon sang fast and bright, as if the sky had asked for a show. The tooth lifted from her palm.',
    },
    {
      image: `${base}/s4-frame-20-echo-breaks.png`,
      text: '"Interesting tempo. Terrible respect for silence," said Kkachi. The tooth glittered and waited. Its echo returned thin, with no warm bowl, pear slice, or Grandmother.',
    },
    {
      image: `${base}/s4-frame-21-missing-line.png`,
      text: 'A roof tile gave a tiny cough. Tik. A dark little crack opened where the missing line should have landed.',
    },
    {
      image: `${base}/s4-frame-22-jiyoon-defends-song.png`,
      text: 'Jiyoon\'s cheeks warmed. "I practiced." Kkachi nodded. "I heard." Grandmother stayed quiet, giving the song room to answer.',
    },
    {
      image: `${base}/s4-frame-23-grandmother-waits.png`,
      text: 'Tanda raised one hand, then noticed Grandmother listening and lowered it. Grandmother sat beside Jiyoon without saying, "I told you."',
    },
    {
      image: `${base}/s4-frame-28-jiyoon-chooses-listening.png`,
      text: '"Which part did you cut?" asked Grandmother. Jiyoon knew. It was the part that sounded slow because it was carrying someone.',
    },
    {
      image: `${base}/s4-frame-30-call-and-response.png`,
      text: '"Who taught it to you?" Jiyoon asked. "My grandmother, in a yard with persimmon leaves."',
    },
    {
      image: `${base}/s4-frame-29-grandmother-memory.png`,
      text: '"I had lost my tooth and was sure the new one would never come," said Grandmother. "I was very dramatic." Jiyoon\'s small laugh came out true.',
    },
    {
      image: `${base}/s4-frame-35-true-song.png`,
      text: 'Grandmother sang again. Jiyoon stopped counting beats and listened for the hand that had passed it down. Their voices stood side by side: "Kkachi-ya, Kkachi-ya." Old tooth. New tooth. Take what is finished. Help what is growing.',
    },
    {
      image: `${base}/s4-frame-36-new-tooth-promise.png`,
      text: 'The roof remembered before it sparkled. Tiles warmed under the song, the crack stopped, and the tooth began to shine.',
    },
    {
      image: `${base}/s4-frame-31-neighborhood-echo.png`,
      text: "The echo came back full: pear sweetness, warm water, Grandmother's hands, and persimmon leaves Jiyoon had never seen.",
    },
    {
      image: `${base}/s4-frame-34-kkachi-softens.png`,
      text: 'Kkachi stepped forward with no joke and no opinion. "There," she said. "Now the song has somewhere to land."',
    },
    {
      image: `${base}/s4-frame-45-what-tanda-learned.png`,
      text: 'Kkachi took the tooth gently. It shone silver-blue in her care—not louder, but truer.',
    },
    {
      image: `${base}/s4-frame-40-network-listens.png`,
      text: 'Only then did Tanda let a gold thread touch the air. It made room around the song. "The Network listens before it glows," she said.',
    },
    {
      image: `${base}/s4-frame-38-charm-forms.png`,
      text: 'Jiyoon wrote the slow line beside her roof drawing. Tooth, words, picture, and Grandmother\'s persimmon-yard detail gathered into a warm Toothlight.',
    },
    {
      image: `${base}/s4-frame-41-grandmother-and-jiyoon.png`,
      text: '"I will carry this with excellent posture and no unnecessary improvisation," said Kkachi. She paused. "Almost none." Jiyoon and Grandmother laughed.',
    },
    {
      image: `${base}/s4-frame-43-roof-morning.png`,
      text: 'The next morning, Jiyoon recorded the roof song again. She kept the slow part, the quiet part, and Grandmother laughing at the end. What family song could you and a grown-up record together today?',
    },
  ],
}

export default roofSong
