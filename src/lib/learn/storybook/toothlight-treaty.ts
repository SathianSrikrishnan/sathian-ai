import type { Story } from './index'

const base =
  'https://tvujxgdwgvrunjvhseey.supabase.co/storage/v1/object/public/tfn-story-assets/stories/toothlight-treaty'

/**
 * Story 3 - The Toothlight Treaty.
 * A Madrid story about two tooth traditions learning to share one child.
 *
 * Frame text adapted for read-aloud from the toothlight-v4 scene data
 * (source scene ids rp3-01 through rp3-28; frames 18 and 20 do not exist
 * in the source data). The final frame keeps its narrative text with the
 * CTA subtext dropped.
 */
const toothlightTreaty: Story = {
  slug: 'toothlight-treaty',
  title: 'The Toothlight Treaty',
  hook: 'A Madrid story about two tooth traditions learning to share one child with care.',
  keeper: 'Ratoncito Perez',
  tradition: 'Spain and mixed family traditions',
  cover: `${base}/rp3-frame-01-two-doors.png`,
  minutes: 6,
  frames: [
    {
      image: `${base}/rp3-frame-01-two-doors.png`,
      text: 'The Toothlight Treaty. A Ratoncito Perez story about two true tooth traditions.',
    },
    {
      image: `${base}/rp3-frame-02-wobble-merienda.png`,
      text: "At merienda, Lucia's tooth wobbled every time she smiled, swallowed, or tried very hard not to think about it. Papa said Perez loved a brave tooth. Mom said the Tooth Fairy loved one too.",
    },
    {
      image: `${base}/rp3-frame-03-finally-falls.png`,
      text: "Then the tooth popped free into Lucia's palm, small and bright and suddenly important. Papa reached for the old coin box. Mom reached for an old folded note.",
    },
    {
      image: `${base}/rp3-frame-04-two-true-stories.png`,
      text: 'Papa told how Perez had come through the walls when he was little. Mom told how a fairy had left a note by her pillow when she was little.',
    },
    {
      image: `${base}/rp3-frame-05-question.png`,
      text: 'Lucia liked both stories. That was the trouble. If she chose one, would the other story feel left outside?',
    },
    {
      image: `${base}/rp3-frame-06-note-under-pillow.png`,
      text: 'So Lucia wrote the smallest note she could manage and tucked it beside the tooth. It said, "Can both of you come? Please do not make me choose."',
    },
    {
      image: `${base}/rp3-frame-07-ledger-room.png`,
      text: 'Behind the bakery wall, Ratoncito Perez checked his ledger, polished his stamp, and counted his coins twice. Perez was not merely quick. He was exact.',
    },
    {
      image: `${base}/rp3-frame-08-mouse-code.png`,
      text: 'His family code was older than the bakery ovens. Enter quietly. Take respectfully. Leave the coin. Keep the local promise. A mouse collected because a house had trusted him.',
    },
    {
      image: `${base}/rp3-frame-09-tooth-calls-twice.png`,
      text: "Lucia's tooth glowed in Perez's ledger. Far away, the same glow woke Tanda's pendant.",
    },
    {
      image: `${base}/rp3-frame-10-tanda-arrives.png`,
      text: 'Perez opened his tiny door and found Tanda trying very hard to look small. This was difficult. She had wings. "That is not knocking," said Perez. "That is sunrise with manners."',
    },
    {
      image: `${base}/rp3-frame-11-professional-offense.png`,
      text: 'Tanda said she had come because Lucia\'s tooth called through Toothlight. Perez held his coin tray a little higher. "Madrid is not a branch office," said Perez. "I did not come to take Madrid," said Tanda.',
    },
    {
      image: `${base}/rp3-frame-12-old-claim.png`,
      text: "Perez showed her the routes, the names, the old seals, the teeth kept safe since his great-grandfather's night. His pride was not vanity. It was a promise with whiskers. \"A house gives a mouse its trust,\" he said. \"I do not misplace that.\"",
    },
    {
      image: `${base}/rp3-frame-13-wide-claim.png`,
      text: "Tanda opened her hands, and Toothlight showed what the tooth was holding: Mom's old pillow, Papa's old coin, Lucia's worried little note. Perez stopped tapping his stamp. \"She is not asking which story is true,\" said Tanda. \"She is asking whether both can love her.\"",
    },
    {
      image: `${base}/rp3-frame-14-first-argument.png`,
      text: "On the roof, the night wind lifted Tanda's hair and Perez's whiskers. They were both right enough to be annoying. \"Big magic has a habit of making small doors disappear,\" said Perez. \"And small doors can become locks if no one listens through them,\" said Tanda.",
    },
    {
      image: `${base}/rp3-frame-15-race-to-room.png`,
      text: 'Perez took the pipes. Tanda took the sky. Neither called it a race, which was how both of them knew it was one.',
    },
    {
      image: `${base}/rp3-frame-16-mouse-work.png`,
      text: "Perez slipped under Lucia's door, past the squeaky toy, past the sleeping cat's tail, past the one floorboard that betrayed amateurs. Every inch of the room had a sound, and Perez knew which ones not to make.",
    },
    {
      image: `${base}/rp3-frame-17-fairy-work.png`,
      text: "At the window, Tanda folded her wings and softened the Toothlight until it was no brighter than a sleeping child's breath. Her work was not to dazzle. Her work was to notice.",
    },
    {
      image: `${base}/rp3-frame-19-split-light.png`,
      text: 'Perez reached under the pillow as Tanda softened the room. The tooth glowed in two colors: bakery gold and pearly fairy light. One light held bread and old Madrid stone. One held the hush of a pillow in another country. For one breath, each keeper thought the other was closing the tooth around one answer.',
    },
    {
      image: `${base}/rp3-frame-21-lucia-dream.png`,
      text: 'Then Lucia turned in her sleep, and the tooth showed them her dream. She stood between two bedtime doors, holding one small tooth with both hands.',
    },
    {
      image: `${base}/rp3-frame-22-collectors-fear.png`,
      text: 'Perez looked very small in the glow. For a moment, Tanda saw what he had been guarding: not the route, but the right to matter. "When big stories arrive," said Perez, "little ones are asked to be charming and quiet."',
    },
    {
      image: `${base}/rp3-frame-23-tanda-apology.png`,
      text: "Tanda folded her wings until the room felt like Perez's size again. She dimmed the Toothlight, stepped back from the pillow, and bowed lower than the mouse door. \"I should have asked how to enter your house,\" she said.",
    },
    {
      image: `${base}/rp3-frame-24-perez-apology.png`,
      text: 'Perez opened his ledger and stared at Lucia\'s note. There was no box for "Can both of you come?" "My code kept the tooth safe," he said. "It did not leave room for the child."',
    },
    {
      image: `${base}/rp3-frame-25-treaty.png`,
      text: "Perez stamped a tiny receipt with the authority of Madrid's hidden walls. Tanda threaded Toothlight through it without changing the mouse seal. \"Your path carries the tooth,\" said Tanda. \"Your light carries the question,\" said Perez.",
    },
    {
      image: `${base}/rp3-frame-26-double-carry.png`,
      text: "Below the rooftops, Perez carried the tooth through Madrid's mouse roads. Above the rooftops, Tanda carried the memory through Toothlight.",
    },
    {
      image: `${base}/rp3-frame-27-morning-proof.png`,
      text: "Morning found Lucia with a coin, a tiny stamped receipt, and a glow that held both parents' stories. Nobody's tradition had lost. Lucia had gained a bigger home.",
    },
    {
      image: `${base}/rp3-frame-28-treaty-partners.png`,
      text: 'At dawn, Perez tucked a new page into his ledger. Tanda did not sign above his name. She signed beside it.',
    },
  ],
}

export default toothlightTreaty
