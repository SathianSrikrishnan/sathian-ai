import { StoryConfig } from './types'

const tanda: StoryConfig = {
  id: 'tanda',
  title: 'The First Night',
  region: 'North America',
  emoji: '\u{1FAB6}',
  color: '#D4A574',
  description: 'A hummingbird fairy discovers why every tooth carries a story',
  characterName: 'Tanda',
  available: true,
  crossReferences: ['hyena-story', 'anka-story'],
  colors: {
    accent: '#D4A574',
    secondary: '#6B7DB3',
  },
  effects: {
    particles: {
      count: 15,
      color: '#D4A574',
      sizeMin: 2,
      sizeMax: 4,
      durationMin: 8,
      durationMax: 15,
      drift: 20,
      glow: true,
    },
  },
  scenes: [
    // COVER
    {
      id: 'tanda-cover',
      layout: 'cover',
      background: '/story-assets/tanda/f01-satchel.png',
      dialogue: {
        text: 'The First Night',
        subtext: 'A Tooth Fairy Network Origin Story',
      },
    },
    // FRAME 1 - THE SATCHEL
    {
      id: 'tanda-01',
      layout: 'prose',
      background: '/story-assets/tanda/f01-satchel.png',
      dialogue: {
        text: "There is a satchel that has crossed the Atlantic Ocean four hundred times.\n\nIt was stitched by a woman in Iceland eleven centuries ago from the hide of a goat her daughter had named. She carved counting marks along the strap. One for each year she'd been alive. She was twenty-three.\n\nThe satchel belongs now to a creature the size of a hummingbird with wings the color of old paper.\n\nHer name is Tanda. It comes from the Old Norse tannf\u00e9: the tooth fee. A thousand years ago, when a child lost their first tooth, the parents paid a fee. Not to the child. To the tooth. Because in those days, a child's tooth was worth something real. Warriors wore them on leather cords around their necks and went to war with a child's luck against their chest.",
      },
    },
    // FRAME 2 - THE WIRE
    {
      id: 'tanda-02',
      layout: 'prose',
      background: '/story-assets/tanda/f02-wire.png',
      dialogue: {
        text: "Tonight Tanda sits on a telephone wire in Minneapolis and she is so tired her wings have dimmed to almost nothing.\n\nForty-seven teeth are waiting across six cities before sunrise. Her team is scattered. Flicker to Chicago. Brume to Detroit. Clink took the overnight to DC because Clink likes trains and because Tanda stopped questioning Clink's methods two hundred years ago.\n\nThat leaves Philadelphia, Baltimore, and New York for Tanda alone.\n\nShe opens the satchel. Nineteen teeth collected so far tonight. She should feel good about nineteen.\n\nShe does not feel good about nineteen.",
      },
    },
    // FRAME 3 - THE MAP
    {
      id: 'tanda-03',
      layout: 'prose',
      background: '/story-assets/tanda/f03-map.png',
      dialogue: {
        text: "She carries a map that shows every family in her territory that still tells the story. Every house where a child loses a tooth and something happens. A coin. A whisper about the fairy who comes.\n\nThe map used to glow so thickly she couldn't read the street names through the gold. That was 1952.\n\nNow there are dark patches. Whole neighborhoods where children lose teeth and the tooth goes in the trash and nobody thinks twice. The patches are growing. And at their edges, something moves that Tanda does not look at directly.\n\nShe folds the map. She has work to do.\n\nAnd she has been skipping the most important part.",
      },
    },
    // FRAME 4 - MAREN'S KITCHEN
    {
      id: 'tanda-04',
      layout: 'prose',
      background: '/story-assets/tanda/f04-maren-kitchen.png',
      dialogue: {
        text: "Maren's tooth came out yesterday while she was eating an apple, which she thought was hilarious and her mother thought was horrifying and her little brother thought was the single greatest event in human history.\n\n\"DO IT AGAIN,\" he said.\n\nMaren is six. She takes it seriously. Being six means she walks to the mailbox alone. She is learning words with two chunks. And she is the only person in her family who knows the real name of every bug in the garden.\n\nThe big beetle is General. She named him that because he walks like he's in charge of something.\n\nThe caterpillar on the basil plant is Sleeping Steven. He never moves, but every morning the basil has one less leaf.\n\nAnd the ant who always carries the biggest piece of everything, who drops it and picks it up and never stops: her name is Try Again.\n\nMaren doesn't know why she named her that. It just seemed right.",
      },
    },
    // FRAME 5 - JAR NOTE
    {
      id: 'tanda-05',
      layout: 'prose',
      background: '/story-assets/tanda/f05-jar-note.png',
      dialogue: {
        text: "That night Maren puts the tooth in a jar because she doesn't trust the pillow method. Pillows move. You roll over. The tooth falls between the mattress and the wall. Then the whole thing is ruined.\n\nMaren is practical about these things.\n\nShe writes a note. She spells \"tooth\" wrong twice. She will be embarrassed about this later, but the misspelling is the most important detail of this entire story, because the note is now part of what the tooth carries.\n\nShe does not know this.\n\nShe turns off the frog lamp. She tries to stay awake.\n\nShe lasts eleven minutes.",
      },
    },
    // FRAME 6 - TANDA AT THE WINDOW
    {
      id: 'tanda-06',
      layout: 'prose',
      background: '/story-assets/tanda/f06-tanda-window.png',
      dialogue: {
        text: "Tanda arrives at 3:47 AM.\n\nShe has already collected six teeth since Minneapolis. She did not read any of them.\n\nThis is the thing that has been growing for the last three years: she has been going faster. Collecting more. Skipping the readings. A tooth reading takes four minutes. You hold it to the moonlight, you let the story unspool, you watch the child's life play in miniature. Four minutes. That is the whole point of collecting.\n\nBut four minutes times forty-seven teeth is three hours. And she does not have three hours.\n\nSo she has started doing what she swore she would never do. She takes the tooth. She leaves the coin. She moves on. Nineteen teeth tonight. One read. Eighteen skipped.\n\nShe slips through the window.\n\nShe sees the jar. She sees the note.\n\nShe stops.",
      },
    },
    // FRAME 7 - THE NOTE
    {
      id: 'tanda-07',
      layout: 'prose',
      background: '/story-assets/tanda/f07-toth-note.png',
      dialogue: {
        text: "DEAR TOTH FAIRY, THIS IS MY TOTH.\n\nShe reads the note three times. Not because it's complicated. Because this child named the tooth. Cloud, because it is wite. Most children don't write notes anymore. Most parents say \"put it under your pillow\" and the child does and in the morning there's a dollar and by Tuesday nobody remembers which tooth it was.\n\nBut this child wrote a note. This child named the tooth. This child cared enough to say: this happened to ME, and I want you to know about it.\n\nTanda takes the tooth from the jar. She is behind schedule. Philadelphia has eleven teeth waiting.\n\nShe holds the tooth to the window where the moonlight comes through.\n\nShe reads it.",
      },
    },
    // FRAME 8 - THE TOOTH READING
    {
      id: 'tanda-08',
      layout: 'prose',
      background: '/story-assets/tanda/f08-tooth-reading.png',
      dialogue: {
        text: "The tooth shows her the garden first.\n\nA beetle crossing the patio. And behind it, a girl in sneakers. Not chasing. Following. There is a difference when you are six.\n\nThe beetle has a scratch on its left wing-case. The child noticed this. Every tooth remembers what the child paid attention to. Not what they were told to care about. Not what was on the test. What they actually, privately, for no reason at all, chose to watch.\n\nMaren watched General cross the patio every day for three weeks. She never picked him up. She never told anyone about him. He was hers in the way that something is yours when you're the only one who knows its name.",
      },
    },
    // FRAMES 9+10 - BASIL + TRY AGAIN
    {
      id: 'tanda-09',
      layout: 'prose',
      background: '/story-assets/tanda/f10-try-again.png',
      dialogue: {
        text: "Then the basil plant. The caterpillar who never moved but ate a leaf every night. Maren pressed her face against the glass every morning and checked. Still there. Still fat. Still sleeping.\n\nShe drew a smiley face in her breath-fog on the window at 6 AM and she laughed and nobody heard her laugh because she was the only one awake.\n\nAnd then the ant.\n\nThe one who carries the biggest piece of everything. Who drops it and picks it up and drops it and picks it up. The one Maren named Try Again.\n\nThe tooth doesn't explain why she chose that name. Teeth don't explain. But Tanda has read enough teeth in eleven centuries to know what a name like that means. It means a six-year-old saw something in an ant that she needed. Not understood. Needed. And she gave the feeling a word so she wouldn't lose it.\n\nTanda holds the tooth for a long time after the story ends.\n\nShe is standing on a nightstand in St. Paul, Minnesota, holding a tooth that contains a beetle, a caterpillar, and an ant, and she is crying. Not because the story is sad.\n\nBecause the story will be gone.",
      },
    },
    // FRAME 11 - DARKEST MOMENT
    {
      id: 'tanda-10',
      layout: 'prose',
      background: '/story-assets/tanda/f11-darkest.png',
      dialogue: {
        text: "Tomorrow Maren will tell her mother about the coin. Her mother will smile and say \"the tooth fairy came!\" and Maren will say \"I wrote her a note!\" and her mother will say \"that's so sweet\" and the note will go in a drawer and the jar will go back in the cupboard. In two weeks Maren won't remember which tooth it was, or that she named it Cloud, or that she spelled it TOTH because she was six and she tried so hard.\n\nAnd General and Sleeping Steven and Try Again will be sealed in a satchel, read by one creature, remembered by no one else.\n\nMaren will never know her tooth was read. She will never know that the smallest story in the world was beautiful enough to make an eleven-hundred-year-old fairy cry in the middle of the night.",
      },
    },
    // FRAME 12 - GLIMPSES
    {
      id: 'tanda-11',
      layout: 'prose',
      background: '/story-assets/tanda/f12-glimpses.png',
      dialogue: {
        text: "She picks up another tooth. Holds it to the window. A boy who taught his dog to shake. One second of the story: the dog's paw in the boy's hand, both of them proud. She puts it back. No time.\n\nAnother. A girl who whispered secrets to a tree in her backyard. One second: her mouth close to the bark, breath fogging the cold wood. Back in the satchel.\n\nEighteen lives. Eighteen Try-Again-level stories. And Tanda collected them the way you collect mail.\n\nShe did the job. She missed the point.",
      },
    },
    // FRAME 13 - THE MESSAGES
    {
      id: 'tanda-12',
      layout: 'prose',
      background: '/story-assets/tanda/f13-messages.png',
      dialogue: {
        text: "Tanda cannot collect every tooth herself. She has known this for decades. She has refused to admit it because admitting it means trusting strangers with children's stories.\n\nBut tonight she held Maren's tooth and felt what it carried. And she looked at the eighteen she didn't hold. And she understood: alone means stories get skipped. Skipped means lost.\n\nShe tears three pieces of parchment from the back of her map.\n\nShe writes to a magpie in Korea. She's never met this bird. She's heard she's loud and never stops talking. Loud is better than absent.\n\nShe writes to a mouse in Madrid. He is old. He is proud. He hasn't missed a tooth in a hundred and thirty years. He will think she is ridiculous for writing to him.\n\nShe writes to a hyena in East Africa. She doesn't know his name. She knows only this: children throw their teeth into the dark for him, and he comes. Every time.\n\nShe folds the three messages.",
      },
    },
    // FRAME 14 - TRIPTYCH
    {
      id: 'tanda-13',
      layout: 'prose',
      background: '/story-assets/tanda/f14-triptych.png',
      dialogue: {
        text: "She gives one to Flicker. \"Korea. The magpie.\"\n\nFlicker's wings sputter. \"You don't even know her\u2014\"\n\n\"Go.\"\n\nShe throws the second into the wind. A trick from the Irish keepers, who swear the wind always delivers. The message spirals east toward Spain.\n\nThe third she places under a stone on Maren's windowsill, scratched with the old mark that means for the one who comes at night.",
      },
    },
    // FRAME 15 - COIN IN JAR
    {
      id: 'tanda-14',
      layout: 'prose',
      background: '/story-assets/tanda/f15-coin-jar.png',
      dialogue: {
        text: "She places the coin in the jar. Not under the pillow. Maren used a jar. Systems matter. Children who build systems are children who care how things work, and the least Tanda can do is honor that.\n\nShe looks at Maren one more time.\n\nShe will not reach all forty-seven teeth tonight. Nineteen families will wake to find the tooth still under the pillow and decide, quietly, that the story doesn't matter.\n\nBut she read Maren's tooth. She read it fully. She knows about General and Sleeping Steven and Try Again. And that one tooth, read completely, is worth more than forty collected in silence.\n\nShe doesn't know if the magpie, the mouse, or the hyena will answer.\n\nShe sent the messages anyway.",
      },
    },
    // FRAME 16 - MORNING NOTE
    {
      id: 'tanda-15',
      layout: 'prose',
      background: '/story-assets/tanda/f16-morning-note.png',
      dialogue: {
        text: "Maren wakes up. The coin is in the jar. She holds it up. Looks at it. Puts it down.\n\nShe picks up the note.\n\nShe stares at it for a while. Runs her thumb over the place where she erased and rewrote the TH. She wonders if the tooth fairy read it. She wonders if the tooth fairy knows about General.\n\nShe folds the note carefully, the way you fold something you plan to keep, and puts it in the drawer where she keeps the things she is not ready to explain to anyone.",
      },
    },
    // FRAME 17 - KKACHI ON THE WIRE
    {
      id: 'tanda-16',
      layout: 'prose',
      background: '/story-assets/tanda/f17-kkachi-wire.png',
      dialogue: {
        text: "One week later, a magpie lands on the telephone wire.\n\nShe is loud. She has not stopped talking since she arrived from Seoul three hours ago.\n\nHer name is Kkachi.\n\n\"I got your message. Well, first I sang your message, because I sing everything, and then I read it, and then I sang it again with better notes, and THEN I decided to come, and what is this about a network? Because I've been doing rooftop collections in Korea for four hundred years and nobody has EVER written to me, which is frankly\u2014\"\n\nTanda holds up Maren's tooth.\n\n\"Let me show you something.\"\n\nShe holds it to the moonlight. The story plays.\n\nA beetle named General. A caterpillar named Sleeping Steven. An ant named Try Again.\n\nKkachi goes quiet.\n\nIt is the first time Kkachi has been quiet in four hundred years.\n\n\"That's hers,\" the magpie says softly. \"That child's. That's her whole\u2014\"\n\n\"Yes.\"\n\n\"And every tooth carries\u2014\"\n\n\"Every tooth. Every child. Every name they gave to something nobody else noticed.\"\n\nKkachi is quiet for almost ten seconds, which is a record.\n\n\"What happens to the stories?\" she asks.\n\n\"Right now? They disappear.\"\n\nThe magpie looks at the tooth for a long time. Her feathers flatten. Sleek. Not performing. Listening.\n\n\"What if they didn't?\" Kkachi says. \"What if the child could keep their own story?\"",
      },
    },
    // FRAME 18 - FINALE
    {
      id: 'tanda-17',
      layout: 'prose',
      background: '/story-assets/tanda/f18-finale.png',
      dialogue: {
        text: "Tanda's wings glow. Not the steady gold of a century ago. But warm. The kind that means something just started.\n\nIn three days, the mouse in Madrid will write back with a fourteen-page letter about his organizational methods.\n\nThe hyena will not write back at all. But the stone on Maren's windowsill will be moved, just slightly, by something large that came in the night. A claw-mark next to her scratch. It means yes.\n\nTanda knows about Maren. She knows about an ant named Try Again.\n\nRight now that is enough to begin.",
      },
    },
    // EPILOGUE
    {
      id: 'tanda-18',
      layout: 'narrative',
      background: '/story-assets/tanda/f18-finale.png',
      dialogue: {
        text: "In the morning, Maren goes to the garden.\n\nGeneral is on the patio. Sleeping Steven has eaten another leaf. Try Again is carrying something enormous across the concrete, struggling, dropping it, picking it up.\n\nMaren sits on the porch step. She watches the ant.\n\nTry Again drops the crumb. Picks it up. Keeps going.\n\nMaren smiles.",
      },
    },
    // CTA
    {
      id: 'tanda-cta',
      layout: 'cta',
      background: '/story-assets/tanda/f18-finale.png',
      dialogue: {
        text: 'Every tooth carries a story. Every story deserves to be kept.',
      },
      isChoice: true,
      choiceText: 'Draw a tooth for this story',
      choiceHref: '/toothfairy/app/draw?from=story&slug=tanda',
    },
  ],
}

export default tanda
