import { StoryConfig } from './types'

const kkachiBlue = '#70C7D8'
const featherGreen = '#5AC6A0'
const tandaGold = '#E8B77A'
const jiyoonRose = '#F3A7B5'
const grandmotherWarmth = '#F0C987'

/**
 * Story 4 - Kkachi and the Roof Song.
 * Final production draft: 45 frames with frame-specific v2 story art.
 */
const korea: StoryConfig = {
  id: 'korea',
  title: 'Kkachi and the Roof Song',
  region: 'South Korea',
  emoji: '\u{1F426}',
  color: kkachiBlue,
  description: "A rooftop story about a child, a grandmother's song, and a magpie who listens for memory.",
  characterName: 'Kkachi the Magpie',
  available: true,
  crossReferences: ['tanda', 'viking-origin', 'ratoncito-perez'],
  colors: {
    accent: kkachiBlue,
    accentGlow: `${kkachiBlue}80`,
    secondary: tandaGold,
    secondaryGlow: `${tandaGold}80`,
  },
  effects: {
    particles: {
      count: 20,
      color: kkachiBlue,
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 9,
      durationMax: 16,
      drift: 24,
      glow: true,
    },
    aurora: {
      colors: [kkachiBlue, featherGreen, tandaGold],
      bands: 2,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    {
      id: 'kkachi-01-cover',
      layout: 'cover',
      background: '/story-assets/korea/v2/s4-frame-01-cover.png',
      dialogue: {
        text: 'Kkachi and the Roof Song',
        subtext: 'A Korean story of a magpie, a lost tooth, and the old words that knew the way home.',
      },
    },
    {
      id: 'kkachi-02-wobble-beat',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-02-loose-tooth.png',
      dialogue: {
        text: "Jiyoon's tooth had been wobbling all week.",
        subtext: 'Not a little wobble. A tap-tap, twist-twist, please-stop-thinking-about-me wobble.',
      },
    },
    {
      id: 'kkachi-03-the-pop',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-03-grandmother-enters.png',
      dialogue: {
        text: 'At supper, Jiyoon bit into a pear slice to prove the tooth was not ready.',
        subtext: 'The tooth disagreed. It popped into her mouth like a tiny announcement.',
      },
    },
    {
      id: 'kkachi-04-small-and-strange',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-04-first-roof-song.png',
      dialogue: {
        text: 'Grandmother held out a folded tissue. Jiyoon placed the tooth on it carefully.',
        subtext: 'It was smaller than she expected. It was also stranger. A piece of Jiyoon had come loose, and everyone seemed happy about it.',
      },
    },
    {
      id: 'kkachi-05-grandmothers-smile',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-05-jiyoon-listens.png',
      dialogue: {
        text: 'Grandmother washed the tooth in a little bowl.',
        subtext: 'The water moved around it in one bright circle. "When I was small," she said, "we knew who to call."',
      },
    },
    {
      id: 'kkachi-06-old-roof-song',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-05-jiyoon-listens.png',
      dialogue: {
        text: 'Then Grandmother sang. Softly. So softly the window seemed to lean in.',
        subtext: '"Kkachi-ya, Kkachi-ya..." The roof song lifted like steam.',
      },
    },
    {
      id: 'kkachi-07-what-it-means',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-06-explanation.png',
      dialogue: {
        text: '"It means old tooth, new tooth," Grandmother said.',
        subtext: '"Take what is finished. Help what is growing."',
      },
      secondDialogue: {
        speaker: 'Jiyoon',
        speakerColor: jiyoonRose,
        text: 'Jiyoon nodded as if she had heard every word. Mostly, she had heard the beat.',
      },
    },
    {
      id: 'kkachi-08-better-idea',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-07-first-choice.png',
      dialogue: {
        text: 'The song was sweet. The song was old. The song was also, in Jiyoon\'s professional opinion, very slow.',
        subtext: 'She had an idea. A very good idea. Possibly the best idea a person with one missing tooth had ever had.',
      },
    },
    {
      id: 'kkachi-09-remix-table',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-08-phone-opens.png',
      dialogue: {
        text: 'Jiyoon opened her recorder. She tapped the desk. She clapped the beat.',
        subtext: 'She made the roof song bounce.',
      },
    },
    {
      id: 'kkachi-10-loop-loop-loop',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-09-remix-begins.png',
      dialogue: {
        text: 'Loop. Tap. Clap. Again.',
        subtext: 'The old song became faster. Then brighter. Then clickier. Much more roof-worthy.',
      },
    },
    {
      id: 'kkachi-11-cut-that-part',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-11-roofline-wakes.png',
      dialogue: {
        text: 'One line was too slow. One pause was too quiet.',
        subtext: 'One little piece sounded exactly like Grandmother. So Jiyoon trimmed it out.',
      },
    },
    {
      id: 'kkachi-12-grandmother-hears',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-10-grandmother-pauses.png',
      dialogue: {
        text: 'Grandmother listened from the doorway. She smiled.',
        subtext: 'It was not her whole smile.',
      },
      secondDialogue: {
        speaker: 'Jiyoon',
        speakerColor: jiyoonRose,
        text: '"I made it cooler!"',
      },
    },
    {
      id: 'kkachi-13-not-scolding',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-10-grandmother-pauses.png',
      dialogue: {
        speaker: 'Grandmother',
        speakerColor: grandmotherWarmth,
        text: '"That is very clever."',
        subtext: 'Her voice stayed gentle. "It still needs to know where it came from."',
      },
      secondDialogue: {
        speaker: 'Jiyoon',
        speakerColor: jiyoonRose,
        text: '"It knows. I saved the best parts."',
      },
    },
    {
      id: 'kkachi-14-tandas-invitation',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-12-tanda-arrives.png',
      dialogue: {
        text: 'Far above the city, Tanda unfolded a small bright letter.',
        subtext: "It hummed with roof tiles, bird feet, and a child's almost-song.",
      },
    },
    {
      id: 'kkachi-15-first-korean-song',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-14-first-rooftop-step.png',
      dialogue: {
        text: "The roof did not glow like Tanda's Toothlight. It listened differently.",
        subtext: 'It held the sound in its tiles. It waited for the right voice. Tanda folded her light close and landed softly.',
      },
    },
    {
      id: 'kkachi-16-roofline-guardian',
      layout: 'character',
      background: '/story-assets/korea/v2/s4-frame-17-kkachi-arrives.png',
      character: {
        image: '/story-assets/characters/char-kkachi.png',
        position: 'right',
        enter: 'top',
      },
      dialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: 'If this is about the shiny noise, I heard it three chimneys ago.',
        subtext: 'Kkachi swept onto the roofline in black, white, and blue-green shine.',
      },
    },
    {
      id: 'kkachi-17-kkachis-opinions',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-17-kkachi-arrives.png',
      character: {
        image: '/story-assets/characters/char-kkachi.png',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        text: 'Kkachi was beautiful. Kkachi was important.',
        subtext: 'Kkachi had never met a rhythm she did not have an opinion about.',
      },
      secondDialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"The claps are early. But the confidence is enormous."',
      },
    },
    {
      id: 'kkachi-18-the-invitation',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-18-kkachi-and-tanda.png',
      dialogue: {
        text: 'Tanda bowed and held out the invitation.',
        subtext: '"A child is calling."',
      },
      secondDialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"A child is performing. There is a difference."',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: tandaGold,
        text: '"Then I will listen before I bring the Network near."',
      },
    },
    {
      id: 'kkachi-19-shiny-sound',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-16-shiny-rhythm.png',
      dialogue: {
        text: "The remix flew up from Jiyoon's room in bright loops.",
        subtext: 'It sparkled. It spun. It nearly knocked over a wind chime.',
      },
      secondDialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"Well. It is not boring."',
      },
    },
    {
      id: 'kkachi-20-first-throw',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-15-roof-call-starts.png',
      dialogue: {
        text: 'That evening, Jiyoon stepped onto the rooftop terrace. Grandmother came with her.',
        subtext: 'The city lights blinked on, one by one. Jiyoon held the tooth tight in her fingers.',
      },
    },
    {
      id: 'kkachi-21-big-performance',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-19-tooth-thrown.png',
      dialogue: {
        text: 'Jiyoon sang fast. She sang bright.',
        subtext: 'She sang as if the sky had asked for a show and she had brought one. The tooth lifted from her palm.',
      },
    },
    {
      id: 'kkachi-22-approves-almost',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-20-echo-breaks.png',
      character: {
        image: '/story-assets/characters/char-kkachi.png',
        position: 'right',
        enter: 'right',
      },
      dialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"Interesting tempo. Risky middle. Terrible respect for silence."',
        subtext: 'Then she stopped moving.',
      },
    },
    {
      id: 'kkachi-23-no-echo',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-20-echo-breaks.png',
      dialogue: {
        text: 'The tooth rose, glittered, and waited.',
        subtext: 'The roof gave back an echo. But the echo was thin. It had no warm bowl. No pear slice. No Grandmother.',
      },
    },
    {
      id: 'kkachi-24-the-crack',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-21-missing-line.png',
      dialogue: {
        text: 'A roof tile made a sound like a tiny cough.',
        subtext: 'Tik. A dark little crack opened where the missing line should have landed.',
      },
    },
    {
      id: 'kkachi-25-not-accepted',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-25-hollow-echo.png',
      character: {
        image: '/story-assets/characters/char-kkachi.png',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"Pretty."',
        subtext: 'Jiyoon smiled, just a little. Kkachi lowered her head. "Empty."',
      },
    },
    {
      id: 'kkachi-26-jiyoons-heat',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-22-jiyoon-defends-song.png',
      dialogue: {
        speaker: 'Jiyoon',
        speakerColor: jiyoonRose,
        text: '"I practiced."',
        subtext: 'Her face went hot.',
      },
      secondDialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"I heard."',
      },
      thirdDialogue: {
        text: 'That made it worse. Grandmother did not say anything. Somehow that was worse too.',
      },
    },
    {
      id: 'kkachi-27-toothlight-temptation',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-26-tanda-raises-light.png',
      dialogue: {
        text: 'Tanda lifted one hand. Toothlight gathered, soft and ready.',
        subtext: 'She could have wrapped the tooth in glow. She could have made the moment easier.',
      },
      secondDialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"Careful, bright one. A louder light can still miss a song."',
      },
    },
    {
      id: 'kkachi-28-grandmothers-choice',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-23-grandmother-waits.png',
      dialogue: {
        text: 'Tanda saw Grandmother listening, and lowered her hand.',
        subtext: 'Grandmother sat beside Jiyoon on the roof. She could have said, I told you. She did not.',
      },
    },
    {
      id: 'kkachi-29-missing-piece',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-28-jiyoon-chooses-listening.png',
      dialogue: {
        speaker: 'Grandmother',
        speakerColor: grandmotherWarmth,
        text: '"Which part did you cut?"',
        subtext: 'Jiyoon looked down. She knew. Of course she knew.',
      },
      secondDialogue: {
        text: 'It was the part that sounded slow because it was carrying someone.',
      },
    },
    {
      id: 'kkachi-30-who-taught-you',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-30-call-and-response.png',
      dialogue: {
        speaker: 'Jiyoon',
        speakerColor: jiyoonRose,
        text: '"Who taught it to you?"',
      },
      secondDialogue: {
        speaker: 'Grandmother',
        speakerColor: grandmotherWarmth,
        text: '"My grandmother. In a yard with persimmon leaves."',
      },
    },
    {
      id: 'kkachi-31-family-voice',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-29-grandmother-memory.png',
      dialogue: {
        speaker: 'Grandmother',
        speakerColor: grandmotherWarmth,
        text: '"I had lost my tooth, and I was sure the new one would never come."',
        subtext: 'Grandmother touched Jiyoon\'s cheek. "I was very dramatic."',
      },
      secondDialogue: {
        text: 'Jiyoon laughed. It came out small, but it came out true.',
      },
    },
    {
      id: 'kkachi-32-kkachi-listens',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-32-toothlight-listens.png',
      dialogue: {
        text: 'Kkachi tucked her wings close.',
        subtext: 'Even her tail stopped giving advice. That was how Tanda knew the next part mattered.',
      },
    },
    {
      id: 'kkachi-33-jiyoon-listens',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-35-true-song.png',
      dialogue: {
        text: 'Grandmother sang again.',
        subtext: 'This time Jiyoon did not count the beat. She did not plan the claps. She listened for the hand that had handed it down.',
      },
    },
    {
      id: 'kkachi-34-true-call-begins',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-35-true-song.png',
      dialogue: {
        text: 'Then Jiyoon took a breath.',
        subtext: "Not a performance breath. A listening breath. She let Grandmother's voice stand beside hers.",
      },
    },
    {
      id: 'kkachi-35-old-tooth-new-tooth',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-35-true-song.png',
      dialogue: {
        speaker: 'Jiyoon',
        speakerColor: jiyoonRose,
        text: '"Kkachi-ya, Kkachi-ya."',
        subtext: 'Slowly enough for the words to find their way.',
      },
      secondDialogue: {
        text: 'Old tooth. New tooth. Take what is finished. Help what is growing.',
      },
    },
    {
      id: 'kkachi-36-roof-answers',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-36-new-tooth-promise.png',
      dialogue: {
        text: 'The roof did not sparkle first. It remembered first.',
        subtext: 'The tiles warmed under the song. The crack stopped spreading. The tooth began to shine.',
      },
    },
    {
      id: 'kkachi-37-echoes-with-names',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-31-neighborhood-echo.png',
      dialogue: {
        text: 'The echo came back full.',
        subtext: "It carried pear sweetness. Warm water. Grandmother's hands. A yard of persimmon leaves Jiyoon had never seen. A voice that had reached her anyway.",
      },
    },
    {
      id: 'kkachi-38-kkachi-accepts',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-34-kkachi-softens.png',
      character: {
        image: '/story-assets/characters/char-kkachi.png',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        text: 'Kkachi stepped forward. No joke. No opinion. Only care.',
      },
      secondDialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"There. Now the song has somewhere to land."',
      },
    },
    {
      id: 'kkachi-39-the-carry',
      layout: 'victory',
      background: '/story-assets/korea/v2/s4-frame-45-what-tanda-learned.png',
      dialogue: {
        text: 'Kkachi took the tooth gently.',
        subtext: 'It shone silver-blue in her care. Not louder. Truer.',
      },
      secondDialogue: {
        text: 'Her feathers shimmered like the roof had breathed through them.',
      },
    },
    {
      id: 'kkachi-40-toothlight-waits',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-40-network-listens.png',
      dialogue: {
        text: 'Only then did Tanda let Toothlight touch the air.',
        subtext: 'It did not change the call. It did not cover the song. It made room around it.',
      },
      secondDialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"So the Network can listen without taking over?"',
      },
      thirdDialogue: {
        speaker: 'Tanda',
        speakerColor: tandaGold,
        text: '"Yes. The Network listens before it glows."',
      },
    },
    {
      id: 'kkachi-41-feather-song-mark',
      layout: 'victory',
      background: '/story-assets/korea/v2/s4-frame-38-charm-forms.png',
      dialogue: {
        text: "On Jiyoon's drawing, three tiny feathers appeared.",
        subtext: 'A roofline. A line of song so faint it looked like listening.',
      },
      secondDialogue: {
        speaker: 'Grandmother',
        speakerColor: grandmotherWarmth,
        text: '"Ah. It remembered."',
      },
    },
    {
      id: 'kkachi-42-kkachis-promise',
      layout: 'dramatic',
      background: '/story-assets/korea/v2/s4-frame-41-grandmother-and-jiyoon.png',
      character: {
        image: '/story-assets/characters/char-kkachi.png',
        position: 'center',
        enter: 'bottom',
      },
      dialogue: {
        speaker: 'Kkachi',
        speakerColor: kkachiBlue,
        text: '"I will carry this with excellent posture and no unnecessary improvisation."',
        subtext: 'She paused. "Almost no unnecessary improvisation."',
      },
      secondDialogue: {
        text: 'Jiyoon laughed again. This time, Grandmother did too.',
      },
    },
    {
      id: 'kkachi-43-tile-heals',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-33-crack-closes.png',
      dialogue: {
        text: 'The crack in the tile closed.',
        subtext: 'It did not disappear. It became a small roofline mark, tucked into the pattern as if it had learned the song too.',
      },
    },
    {
      id: 'kkachi-44-morning-voice',
      layout: 'narrative',
      background: '/story-assets/korea/v2/s4-frame-43-roof-morning.png',
      dialogue: {
        text: 'The next morning, Jiyoon recorded the roof song again.',
        subtext: 'She kept the slow part. She kept the quiet part. She kept Grandmother laughing at the end.',
      },
    },
    {
      id: 'kkachi-45-what-tanda-learned',
      layout: 'cta',
      background: '/story-assets/korea/v2/s4-frame-45-what-tanda-learned.png',
      dialogue: {
        text: 'Kkachi carried the tooth over the brightening roofs. Tanda carried the lesson back to the Network. Before Toothlight, listen. Because a song is not only how it sounds. It is who loved you enough to teach it.',
      },
      isChoice: true,
      choiceText: 'Create Your Tooth Keepsake',
      choiceHref: '/toothfairy/app/draw?from=story&slug=korea',
    },
  ],
}

export default korea
