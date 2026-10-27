import type { Story } from './index'

const base =
  'https://tvujxgdwgvrunjvhseey.supabase.co/storage/v1/object/public/tfn-story-assets/stories/gap-in-the-gold'

/**
 * Story 7 - Anna Bogle and the Gap in the Gold.
 * An Irish story of rain, bargains, old promises, and the gift that was
 * not for sale.
 *
 * Frame text adapted for read-aloud from the anna-bogle scene data
 * (source scene ids anna-01 through anna-46; 46 scenes with 46 unique
 * frames from the v2 finals art, mapped 1:1 by each scene's `background`
 * field). The closing CTA scene keeps its narrative text as the final
 * frame, with the choice link dropped.
 */
const gapInTheGold: Story = {
  slug: 'gap-in-the-gold',
  title: 'Anna Bogle and the Gap in the Gold',
  hook: 'An Irish story of rain, bargains, and the gold that proves somebody noticed.',
  keeper: 'Anna Bogle',
  tradition: 'Irish gold tradition',
  cover: `${base}/story7-frame-01-cover.png`,
  minutes: 6,
  frames: [
    {
      image: `${base}/story7-frame-01-cover.png`,
      text: 'Anna Bogle and the Gap in the Gold. An Irish story about rain, one bright coin, and a memory that was never for sale.',
    },
    {
      image: `${base}/story7-frame-02-loose-tooth-kitchen.png`,
      text: "Ryan's tooth wobbled through breakfast, spelling, and one serious argument with an apple. By supper, it hung on through pure stubbornness.",
    },
    {
      image: `${base}/story7-frame-03-tooth-in-palm.png`,
      text: 'Then Ryan bit his toast and the tooth gave up. It landed in his palm, suddenly much more important than breakfast.',
    },
    {
      image: `${base}/story7-frame-04-gold-joke.png`,
      text: 'Ryan grinned through the new gap. "How much gold is this worth?" Grandad nearly choked on his tea. "Who told you gold was the point?"',
    },
    {
      image: `${base}/story7-frame-06-older-version-begins.png`,
      text: 'Grandad leaned back. "When I was small, I heard an older, stranger version. There was a keeper named Anna Bogle."',
    },
    {
      image: `${base}/story7-frame-07-missing-story-gap.png`,
      text: '"She came for a child\'s tooth and left gold, but the gold was for..." Grandad stopped. The middle of the story had gone missing.',
    },
    {
      image: `${base}/story7-frame-09-bedtime-tooth-setup.png`,
      text: 'Ryan folded his tooth in paper beside his pillow. Under it went a drawing of himself, Grandad, and a coin as big as a biscuit.',
    },
    {
      image: `${base}/story7-frame-11-anna-hideaway.png`,
      text: 'Under a field wall, Anna Bogle\'s gold pouch gave a sour little clink. Anna narrowed her eyes. "Oh no. Not that shine."',
    },
    {
      image: `${base}/story7-frame-13-anna-umbrella-entrance.png`,
      text: 'The curtain sneezed rain. Anna Bogle burst through with an umbrella twice her size, landed in a sock drawer, and said, "I meant to do that."',
    },
    {
      image: `${base}/story7-frame-15-are-you-anna-bogle.png`,
      text: 'Ryan sat up. "Are you Anna Bogle?" "Depends who asks." "Ryan." "Then yes. For anyone else, I am a hat."',
    },
    {
      image: `${base}/story7-frame-16-tooth-and-coin-drawing.png`,
      text: "Anna lifted the tooth and softened for one breath. Then she saw the biscuit-sized coin in Ryan's drawing and snapped her mouth shut.",
    },
    {
      image: `${base}/story7-frame-18-shadow-near-gold.png`,
      text: "Anna's pouch gave another cold clink. Beside it, a thread of shadow curled where no shadow should fit.",
    },
    {
      image: `${base}/story7-frame-19-tanda-at-windowsill.png`,
      text: 'A soft light touched the sill. "Anna, I came to ask," said Tanda. Anna hugged her pouch. "Ask, then. Do not turn this tooth into something to count."',
    },
    {
      image: `${base}/story7-frame-21.png`,
      text: 'Tanda lowered her hands. "Then I should listen first." Anna had prepared several insults and now had nowhere tidy to put them.',
    },
    {
      image: `${base}/story7-frame-22.png`,
      text: 'Grandad woke in the chair and stared at Anna, the tooth, then Tanda. "Well," he said, "my mother was not making you up."',
    },
    {
      image: `${base}/story7-frame-23.png`,
      text: 'Grandad tried again. "The gold was not for buying the tooth. It was for..." The missing part of the story thinned like paper in rain.',
    },
    {
      image: `${base}/story7-frame-24.png`,
      text: 'The shadow near the pouch lifted its head. Anna snapped the gold shut. "Do not feed that." Ryan whispered, "Feed what?" "A fussy little thief of forgotten details."',
    },
    {
      image: `${base}/story7-frame-26.png`,
      text: 'Anna turned to Tanda. "You say your Tooth Fee is not a price. Show me the difference." A memory opened between them.',
    },
    {
      image: `${base}/story7-frame-28.png`,
      text: 'Young Tanda covered her tooth. "If I take the coin, is it still mine?" Her father knelt. "Always. A fee is not a purchase. It is a promise to notice."',
    },
    {
      image: `${base}/story7-frame-31.png`,
      text: 'The cottage returned. "My father did not buy my tooth," Tanda said. "He noticed my growing and carried it with care."',
    },
    {
      image: `${base}/story7-frame-33.png`,
      text: 'Ryan frowned. "So gold is bad?" Anna looked horrified. "Gold is grand. It must stand beside the story, never on top. What should it prove?"',
    },
    {
      image: `${base}/story7-frame-36.png`,
      text: 'Grandad\'s eyes brightened. "That someone noticed you were growing." The missing part of the old story clicked into place.',
    },
    {
      image: `${base}/story7-frame-37.png`,
      text: "The coin in Anna's pouch warmed. Not brighter than the tooth or bigger than the story. Just warm enough to say: yes, that.",
    },
    {
      image: `${base}/story7-frame-38.png`,
      text: 'Ryan turned over his drawing and wrote carefully, "Grandad remembered Anna Bogle when my tooth fell out."',
    },
    {
      image: `${base}/story7-frame-39.png`,
      text: 'Anna wrapped the tooth in clover cloth. "This one is not for sale," she said. "This one is for keeping."',
    },
    {
      image: `${base}/story7-frame-40.png`,
      text: 'She placed a small gold piece beside the drawing, never on top. "There. Proof that somebody noticed."',
    },
    {
      image: `${base}/story7-frame-41.png`,
      text: "Tooth, note, drawing, and Ryan's exact Grandad detail gathered into a warm Toothlight. Gold flecks curled around the page, and the little shadow slipped away unfed.",
    },
    {
      image: `${base}/story7-frame-44.png`,
      text: 'Tanda bowed. "Then help me ask better." Anna\'s gap-toothed smile appeared. "A terrible name, Network. We will discuss it."',
    },
    {
      image: `${base}/story7-frame-45-network-alliance.png`,
      text: 'The rain thinned. Gold threads reached toward other keepers and promises. Anna kept her pouch. Tanda did not ask for it. They stood watch together.',
    },
    {
      image: `${base}/story7-frame-46-morning-close.png`,
      text: 'Morning found Ryan with a gold piece, a glowing drawing, and Grandad\'s whole story. The gold was lovely. Remembering was better. What did a grown-up notice when your tooth fell out? Write and draw it together.',
    },
  ],
}

export default gapInTheGold
