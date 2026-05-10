import { StoryConfig } from './types'

const frames = '/story-assets/daga-one-year-wish/v1/frames'

const dagaMoon = '#D8A24A'
const roofNight = '#2F6E79'

/**
 * Story 6 - Daga and the One-Year Wish.
 * Production story data: 44 full-frame scenes from the approved deployment preview.
 */
const dagaOneYearWish: StoryConfig = {
  id: 'daga-one-year-wish',
  title: 'Daga and the One-Year Wish',
  region: 'Philippines',
  emoji: '\u{1F42D}',
  color: dagaMoon,
  description: 'A Philippines story of a roof mouse, a hidden tooth, and the magic that does not hurry.',
  characterName: 'Daga',
  available: true,
  crossReferences: ['korea', 'waraba-edge-light', 'tanda', 'ratoncito-perez'],
  colors: {
    accent: dagaMoon,
    accentGlow: `${dagaMoon}80`,
    secondary: roofNight,
    secondaryGlow: `${roofNight}80`,
  },
  effects: {
    particles: {
      count: 18,
      color: dagaMoon,
      sizeMin: 1,
      sizeMax: 3,
      durationMin: 12,
      durationMax: 22,
      drift: 18,
      glow: true,
    },
    aurora: {
      colors: [dagaMoon, roofNight, '#F5DFA8'],
      bands: 2,
    },
    sparkleOn: ['victory'],
  },
  scenes: [
    {
      id: "daga-01-cover",
      layout: "cover",
      background: `${frames}/frame-01-draft.png`,
      dialogue: {
        text: "Daga and the One-Year Wish",
        subtext: "A Philippines story of a roof mouse, a hidden tooth, and the magic that does not hurry.",
      },
    },
    {
      id: "daga-02-the-high-hook",
      layout: "narrative",
      background: `${frames}/frame-02-draft.png`,
      dialogue: {
        text: "Every December, Lola's house grew strings, stars, and careful knots.",
        subtext: "The parol came out of its box.\nThe cousins came out of everywhere.\nMaya's older cousins were tall enough to help near the eave.\nMaya was tall enough to point at what they were doing wrong.\nThis was also important work.",
      },
    },
    {
      id: "daga-03-next-year",
      layout: "narrative",
      background: `${frames}/frame-03-draft.png`,
      dialogue: {
        text: "\"I can tie the high hook,\" Maya said.",
        subtext: "She stood on her toes until her tsinelas gave up.\nLola caught the string before it escaped.\n\"Next year, maybe.\"\n\"Next year is too far.\"\n\"The high hook needs patient hands.\"\nMaya looked at her hands.\nThey looked available immediately.",
      },
    },
    {
      id: "daga-04-the-wobble-at-merienda",
      layout: "narrative",
      background: `${frames}/frame-04-draft.png`,
      dialogue: {
        text: "At merienda, Maya's loose tooth wobbled against warm bread and sweet crumbs.",
        subtext: "It had been wobbling all week.\nAt breakfast, it leaned left.\nAt lunch, it leaned right.\nBy merienda, it seemed to be making an announcement.",
      },
    },
    {
      id: "daga-05-a-small-click",
      layout: "narrative",
      background: `${frames}/frame-05-draft.png`,
      dialogue: {
        text: "Maya bit down carefully.",
        subtext: "There was a small click.\nThen something tiny and white sat in her palm.\nMaya stared at it.\nHer cousins leaned in.\nLola leaned in too.\nThe tooth looked too small to have caused so much drama.",
      },
    },
    {
      id: "daga-06-lola-remembers",
      layout: "narrative",
      background: `${frames}/frame-06-draft.png`,
      dialogue: {
        text: "Lola rinsed the tooth and wrapped it in a square of tissue.",
        subtext: "\"When I was small,\" she said, \"we did not give a tooth only to the night.\"\nMaya held very still.\nLola's remembering voice was different from her where-did-I-put-the-scissors voice.\n\"We gave it time.\"",
      },
    },
    {
      id: "daga-07-the-family-version",
      layout: "narrative",
      background: `${frames}/frame-07-draft.png`,
      dialogue: {
        text: "\"We asked the roof mouse to hide it well,\" Lola said.",
        subtext: "Maya glanced at the window.\n\"A mouse?\"\n\"A very quick one.\"\n\"How quick?\"\n\"Quick enough that children mostly see the place where the mouse was.\"\nFrom the eave came one soft tick.\nProbably the roof.\nMaybe not.",
      },
    },
    {
      id: "daga-08-one-whole-year",
      layout: "narrative",
      background: `${frames}/frame-08-draft.png`,
      dialogue: {
        text: "\"If we found the tooth after one year,\" Lola said, \"we could make another wish.\"",
        subtext: "Maya stopped chewing.\n\"One real year?\"\n\"One real year.\"\n\"That has twelve months.\"\n\"It does.\"\n\"And each month has too many mornings.\"\nLola nodded.\n\"That is why the wish has room to grow.\"",
      },
    },
    {
      id: "daga-09-the-first-wish",
      layout: "narrative",
      background: `${frames}/frame-09-draft.png`,
      dialogue: {
        text: "Maya sat at her desk and drew herself tying the high hook.",
        subtext: "She drew the string.\nShe drew the parol.\nShe drew herself very tall.\nUnder the picture she wrote her wish in careful letters.\nI wish to be big enough now.\nThen she folded the paper as small as a secret.",
      },
    },
    {
      id: "daga-10-showing-the-roof",
      layout: "narrative",
      background: `${frames}/frame-10-draft.png`,
      dialogue: {
        text: "Lola opened the window screen.",
        subtext: "Maya stood safely inside and tossed the tiny bundle onto the low awning under the roof.\nIt landed with a soft tap.\nThe house seemed to blink.\n\"Now,\" Lola said, \"we wait.\"\nMaya nodded.\nShe was already thinking about how to wait faster.",
      },
    },
    {
      id: "daga-11-a-tail-in-the-moonlight",
      layout: "narrative",
      background: `${frames}/frame-11-draft.png`,
      dialogue: {
        text: "Something small crossed the awning.",
        subtext: "Maya saw whiskers.\nA folded ear.\nA flash of silver feet.\nA tail with the attitude of someone leaving before questions began.\nThen the tooth was gone.\nOn the roof dust, three tiny pawprints glowed and went out.",
      },
    },
    {
      id: "daga-12-no-peeking",
      layout: "narrative",
      background: `${frames}/frame-12-draft.png`,
      dialogue: {
        text: "\"That was Daga,\" Lola said.",
        subtext: "\"You saw Daga?\"\n\"I saw the place where Daga was.\"\nMaya leaned toward the window.\nLola closed it gently.\n\"No peeking.\"\nMaya nodded in the serious way children nod when they have already begun planning the opposite.",
      },
    },
    {
      id: "daga-13-morning-search",
      layout: "narrative",
      background: `${frames}/frame-13-draft.png`,
      dialogue: {
        text: "At sunrise, Maya checked the awning.",
        subtext: "Then the windowsill.\nThen the pencil box.\nEveryone knew mysterious mice liked office supplies.\nInside the pencil box, one pencil rolled by itself.\nMaya opened the lid.\nNothing was there except pencil shavings, eraser crumbs, and the strong feeling of being laughed at.",
      },
    },
    {
      id: "daga-14-the-drawer-shadow",
      layout: "narrative",
      background: `${frames}/frame-14-draft.png`,
      dialogue: {
        text: "In the desk drawer, Maya found one silver pawprint.",
        subtext: "She found a crumb of roof dust.\nShe found a shadow shaped like a question.\nFor one breath, the hiding place looked empty enough to feel forgotten.\nThen another silver pawprint crossed the shadow.\nThe shadow pulled back.",
      },
    },
    {
      id: "daga-15-calendar-shortcut",
      layout: "narrative",
      background: `${frames}/frame-15-draft.png`,
      dialogue: {
        text: "Maya looked at the family calendar.",
        subtext: "One page.\nTwo pages.\nEleven pages.\n\"There,\" she whispered. \"One year.\"\nThe calendar swung crooked on its nail.\nThe room did not believe her.",
      },
    },
    {
      id: "daga-16-the-house-moves-the-secret",
      layout: "narrative",
      background: `${frames}/frame-16-draft.png`,
      dialogue: {
        text: "The drawer clicked shut.",
        subtext: "The calendar flapped backward.\nThe pencil box sneezed out a crumb of roof dust.\nMaya jumped.\nThe hidden place would not stay where impatience pointed.\nUp near the eave, something tiny made a sound that was almost a cough.\nOr possibly a laugh.",
      },
    },
    {
      id: "daga-17-toothlight-at-the-window",
      layout: "narrative",
      background: `${frames}/frame-17-draft.png`,
      dialogue: {
        text: "A warm gold glow brushed the window.",
        subtext: "Tanda folded her wings small so she would not wake the whole house.\nHer satchel rested at her side.\nHer tooth pendant caught the light.\n\"Someone is pulling on a promise before its date,\" she whispered.\nMaya looked at the calendar.\nThe calendar looked innocent.\nBadly.",
      },
    },
    {
      id: "daga-18-tanda-tries-gently",
      layout: "narrative",
      background: `${frames}/frame-18-draft.png`,
      dialogue: {
        text: "Tanda touched the silver pawprint.",
        subtext: "Toothlight opened around it.\nGold met silver.\nThe map began to wake.\nThen the light stopped at one tiny square of moon.\nTanda tried once more, very gently.\nThe square stayed closed.\n\"I can see the path,\" Tanda said. \"I cannot shorten it.\"",
      },
    },
    {
      id: "daga-19-behind-tanda",
      layout: "narrative",
      background: `${frames}/frame-19-draft.png`,
      dialogue: {
        text: "\"Then who can?\" Maya asked.",
        subtext: "Behind Tanda, a tiny mouse stood on the pencil box.\nDaga wore a scrap of calendar paper tied like a kerchief, soft as a secret and dusty at the edges.\nOne ear folded like a page corner.\nDaga looked at Maya.\nDaga looked at Tanda.\nDaga looked at the calendar, as if everyone should have been paying better attention.\nThen Daga vanished.",
      },
    },
    {
      id: "daga-20-roof-beam-road",
      layout: "narrative",
      background: `${frames}/frame-20-draft.png`,
      dialogue: {
        text: "Daga ran up the curtain cord.",
        subtext: "Across the wall seam.\nBehind the calendar.\nThrough a space no mouse should have fit inside.\nOnly after Daga vanished did the silver tracks appear.\nMaya tried to follow them with her finger.\nThe tracks were faster than fingers.",
      },
    },
    {
      id: "daga-21-the-one-year-map",
      layout: "narrative",
      background: `${frames}/frame-21-draft.png`,
      dialogue: {
        text: "Tanda held her Toothlight low.",
        subtext: "Daga's tracks answered in silver.\nTogether, they drew a map across the room.\nWindow.\nDrawer.\nCalendar.\nRoofline.\nMoon.\nThe house had been keeping the path all along.",
      },
    },
    {
      id: "daga-22-twelve-small-doors",
      layout: "narrative",
      background: `${frames}/frame-22-draft.png`,
      dialogue: {
        text: "The months appeared as twelve small paper doors.",
        subtext: "Eleven were pictures of waiting.\nRain.\nSchool shoes.\nNew pencils.\nA moon cut thin as a fingernail.\nThe twelfth door had a soft light behind it.\nIt would not open.",
      },
    },
    {
      id: "daga-23-not-lost",
      layout: "narrative",
      background: `${frames}/frame-23-draft.png`,
      dialogue: {
        text: "Maya's throat went tight.",
        subtext: "\"What if waiting means it forgets me?\"\nHigh near the ceiling, Daga's whiskers shone.\nThe little mouse's voice came from somewhere above the calendar.\n\"Waiting is not forgetting.\"\nIt was a very small voice.\nIt still filled the room.",
      },
    },
    {
      id: "daga-24-the-choice",
      layout: "narrative",
      background: `${frames}/frame-24-draft.png`,
      dialogue: {
        text: "The first door glowed.",
        subtext: "The twelfth door glowed.\nMaya could grab at both and lose the map.\nOr she could let one stay closed.\nHer fingers curled.\nUncurled.\nThen rested in her lap.\nNo one clapped.\nThat made it feel more important.",
      },
    },
    {
      id: "daga-25-a-promise-that-waits",
      layout: "narrative",
      background: `${frames}/frame-25-draft.png`,
      dialogue: {
        text: "\"All right,\" Maya said.",
        subtext: "It came out smaller than she meant.\n\"Hide it where one year can find it.\"\nThe calendar straightened.\nThe drawer sighed.\nThe pencil box settled down.\nThe room became a room again.\nDaga's tracks shone once near the eave, then disappeared.",
      },
    },
    {
      id: "daga-26-daga-s-true-hiding-place",
      layout: "narrative",
      background: `${frames}/frame-26-draft.png`,
      dialogue: {
        text: "High above the window, under the eave, Daga worked.",
        subtext: "Daga did not work with stamps or speeches.\nDaga did not work by making the night brighter.\nDaga worked with roof dust, moonlight, and the exact place a child would forget until she was ready to remember.\nThe tooth bundle slipped into a patient splinter of wood.\nThe splinter closed.",
      },
    },
    {
      id: "daga-27-first-month",
      layout: "narrative",
      background: `${frames}/frame-27-draft.png`,
      dialogue: {
        text: "The first month passed with rain ticking on the roof.",
        subtext: "Maya counted the ticks.\nThen she counted the spaces between the ticks.\nThen counting became boring.\nThis was a kind of mercy.",
      },
    },
    {
      id: "daga-28-school-days",
      layout: "narrative",
      background: `${frames}/frame-28-draft.png`,
      dialogue: {
        text: "Then came school days.",
        subtext: "Packed lunches.\nMissing pencils.\nNew words.\nOld slippers.\nOne grown-up tooth pushing in exactly when it felt like it.\nMaya checked the calendar less often.\nThe calendar did not brag.",
      },
    },
    {
      id: "daga-29-hot-afternoon",
      layout: "narrative",
      background: `${frames}/frame-29-draft.png`,
      dialogue: {
        text: "On a hot afternoon, the pencil box wiggled.",
        subtext: "Maya put her hand on the lid.\nThen she took her hand away.\n\"I know,\" she said.\nThe pencil box became very still.\nInside, something tiny was pretending not to be pleased.",
      },
    },
    {
      id: "daga-30-nina-s-tooth",
      layout: "narrative",
      background: `${frames}/frame-30-draft.png`,
      dialogue: {
        text: "Maya's little cousin Nina came to visit.",
        subtext: "Nina's tooth was loose.\nNina was not interested in this development.\n\"It's easy,\" Maya almost said.\nThen she remembered the drawer shadow.\nThe calendar.\nThe twelfth door.\nSo she sat beside Nina and said, \"It feels weird at first.\"",
      },
    },
    {
      id: "daga-31-halfway-moon",
      layout: "narrative",
      background: `${frames}/frame-31-draft.png`,
      dialogue: {
        text: "Half a year later, the moon looked like a fingernail clipping.",
        subtext: "Maya laughed.\n\"I used to want the whole year to disappear.\"\nLola sat beside her at the window.\n\"And now?\"\nMaya thought about it.\n\"Now I only want it to hurry politely.\"",
      },
    },
    {
      id: "daga-32-the-high-hook-again",
      layout: "narrative",
      background: `${frames}/frame-32-draft.png`,
      dialogue: {
        text: "When the parol box came out of storage again, Maya was taller.",
        subtext: "That helped.\nBut it was not the biggest thing.\nThe biggest thing was that she could hold the string without yanking it.\nThe high hook looked less like a prize.\nIt looked like a job someone had trusted her with.",
      },
    },
    {
      id: "daga-33-lola-does-not-remind-her",
      layout: "narrative",
      background: `${frames}/frame-33-draft.png`,
      dialogue: {
        text: "Lola looked at the calendar.",
        subtext: "Then she looked at Maya.\nShe did not say a word.\nThis was difficult for Lola, who had many excellent words.\nMaya saw the circled date by herself.\nHer heart gave one hard knock.\nOne real year.",
      },
    },
    {
      id: "daga-34-anniversary-night",
      layout: "narrative",
      background: `${frames}/frame-34-draft.png`,
      dialogue: {
        text: "That night, Maya did not run to the window.",
        subtext: "She washed her hands.\nShe found her old drawing.\nShe sat at her desk and waited until the house sounded ready.\nThe fan hummed.\nThe roof settled.\nThe calendar held still.",
      },
    },
    {
      id: "daga-35-the-place-opens",
      layout: "narrative",
      background: `${frames}/frame-35-draft.png`,
      dialogue: {
        text: "Under the eave, the patient splinter lifted like a tiny door.",
        subtext: "The tooth bundle waited inside.\nIt was smaller than Maya remembered.\nIt was brighter than she expected.\nDaga stood beside it.\nFor once, Daga did not run.\nTanda watched from the window with her light lowered.",
      },
    },
    {
      id: "daga-36-the-old-wish",
      layout: "narrative",
      background: `${frames}/frame-36-draft.png`,
      dialogue: {
        text: "Maya unfolded the paper.",
        subtext: "There was her drawing.\nThere was the high hook.\nThere was herself, very tall and very sure.\nI wish to be big enough now.\nMaya read the word now.\nThen she smiled at it as if it belonged to a younger cousin.",
      },
    },
    {
      id: "daga-37-how-it-answered",
      layout: "narrative",
      background: `${frames}/frame-37-draft.png`,
      dialogue: {
        text: "She was big enough to tie the parol string.",
        subtext: "She was big enough to wait.\nShe was big enough to sit with Nina and not steal the brave part from her.\nThe wish had not arrived all at once.\nIt had come back in pieces.\nHands.\nDays.\nChoices.",
      },
    },
    {
      id: "daga-38-the-second-wish",
      layout: "victory",
      background: `${frames}/frame-38-draft.png`,
      dialogue: {
        text: "Maya held the tooth in both hands.",
        subtext: "\"For my next wish,\" she said, \"let Nina's wish have a hiding place that remembers her.\"\nLola's smile went soft.\nTanda looked at Daga.\nDaga looked away first, which is how very serious mice sometimes admit they are moved.",
      },
    },
    {
      id: "daga-39-daga-stands-still",
      layout: "victory",
      background: `${frames}/frame-39-draft.png`,
      dialogue: {
        text: "Daga stepped onto Maya's drawing.",
        subtext: "One tiny paw touched the roofline Maya had drawn a year before.\nThe calendar-paper kerchief lifted in the night air.\nDaga's whiskers shone.\nFor the first time, Maya could see the whole mouse and not only the place where Daga had been.",
      },
    },
    {
      id: "daga-40-the-charm-appears",
      layout: "narrative",
      background: `${frames}/frame-40-draft.png`,
      dialogue: {
        text: "A small moon curled into the corner of the drawing.",
        subtext: "A calendar square glowed.\nThree mouse tracks crossed the roofline.\nThe marks did not cover Maya's picture.\nThey settled into it.\nAs if the drawing had always been saving a place.",
      },
    },
    {
      id: "daga-41-tanda-learns-the-lock",
      layout: "narrative",
      background: `${frames}/frame-41-draft.png`,
      dialogue: {
        text: "Tanda raised one hand.",
        subtext: "Then she lowered it again.\nThe charm was already complete.\nSome magic did not need more light.\n\"Some memories,\" Tanda said softly, \"are kept by not opening them too soon.\"\nDaga gave her a look that said, Finally.\nTanda bowed her head.",
      },
    },
    {
      id: "daga-42-lola-s-smile",
      layout: "narrative",
      background: `${frames}/frame-42-draft.png`,
      dialogue: {
        text: "Lola tied the last knot on the parol.",
        subtext: "Then she handed Maya the high hook.\nMaya took it with careful hands.\nLola did not say, \"I told you.\"\nThis was one of Lola's finest magic tricks.",
      },
    },
    {
      id: "daga-43-a-new-keeper",
      layout: "victory",
      background: `${frames}/frame-43-draft.png`,
      dialogue: {
        text: "When Nina's tooth finally fell, Maya brought a square of tissue, a pencil, and her most serious face.",
        subtext: "Nina held the tooth like it might jump.\n\"First,\" Maya said, \"the wish needs room.\"\nNear the pencil box, one tiny silver pawprint appeared.\nThen another.\nThen none at all.",
      },
    },
    {
      id: "daga-44-the-shelf-mark",
      layout: "cta",
      background: `${frames}/frame-44-draft.png`,
      dialogue: {
        text: "Far above the roof, Tanda's shelf-map opened.",
        subtext: "There were mouse roads.\nFeather songs.\nThreshold shadows.\nToothlight promises.\nNow a tiny moon-calendar mark appeared between them, with three small mouse tracks walking around its edge.\nNo road told Daga where to go.\nNo light opened Daga's hidden place.\nThe Network simply made room.\nBelow, Maya helped Nina fold her wish.\nAbove, Daga vanished before anyone could say thank you.\nWhich was how everyone knew Daga had been listening.",
      },
      isChoice: true,
      choiceText: "Create Your One-Year Wish",
      choiceHref: "/toothfairy/app/draw?from=story&slug=daga-one-year-wish",
    },
  ],
}

export default dagaOneYearWish
