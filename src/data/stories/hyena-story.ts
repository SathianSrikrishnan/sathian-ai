import { StoryConfig } from './types'

const hyenaStory: StoryConfig = {
  id: 'hyena-story',
  title: 'Into the Dark',
  region: 'Ethiopia',
  emoji: '\u{1F319}',
  color: '#D4944A',
  description: 'A boy learns that courage means going back after you fail',
  characterName: 'The Hyena',
  available: true,
  crossReferences: ['tanda', 'anka-story'],
  colors: {
    accent: '#D4944A',
    secondary: '#8B7355',
  },
  effects: {
    particles: {
      count: 12,
      color: '#D4944A',
      sizeMin: 2,
      sizeMax: 5,
      durationMin: 10,
      durationMax: 18,
      drift: 15,
      glow: true,
    },
  },
  scenes: [
    // Scene 1: Cover
    {
      id: 'hyena-cover',
      layout: 'cover',
      background: '/story-assets/hyena-story/f01-amber-eyes.png',
      dialogue: {
        text: 'Into the Dark',
        subtext: 'An Ethiopian Tradition',
      },
    },
    // Scene 2: Frame 1
    {
      id: 'hyena-01',
      layout: 'prose',
      background: '/story-assets/hyena-story/f01-amber-eyes.png',
      dialogue: {
        text: `He has no name that humans say correctly.\n\nThe children call him "the hyena." The grandmothers call him waraabe, which is closer. His mother called him something else, a sound that lived in the back of the throat, but that word is gone now. Names are for creatures who need to be found. He has never needed to be found.\n\nThe children come to him.\n\nEvery night, for six hundred years.`,
      },
    },
    // Scene 3: Frame 2
    {
      id: 'hyena-02',
      layout: 'prose',
      background: '/story-assets/hyena-story/f02-ridge.png',
      dialogue: {
        text: `He lies on the ridge above the town and listens.\n\nHe can hear the dog that barks at the same hour every night. He can hear the generator at the mobile shop that hums until midnight. He can hear, seven streets east, a woman washing pots and singing something her mother sang, and her mother\u2019s mother before that, a song about rain older than the houses it echoes against.\n\nAnd he can hear, at the house with the blue fence and the acacia tree, a child who has been arguing with his tooth for twenty minutes.`,
      },
    },
    // Scene 4: Frame 3
    {
      id: 'hyena-03',
      layout: 'prose',
      background: '/story-assets/hyena-story/f03-breath-stories.png',
      dialogue: {
        text: `This is how he reads teeth. Not with moonlight, like the fairy in the north. Not with song, like the bird in Korea. He breathes on them. One long, warm breath. The story lifts out of the enamel and rises as mist, and he watches, and it enters him.\n\nHe carries six hundred years of stories in his lungs.\n\nThe first one is still in there. A girl, barefoot, who threw her tooth with both hands because she was so scared she thought throwing harder would make it less frightening. He feels her sometimes when he exhales in the cold. Her shape rises for a moment, then dissolves.\n\nThat was the night he understood what he was for. Not to collect. Not to keep. To receive.`,
      },
    },
    // Scene 5: Frame 4
    {
      id: 'hyena-04',
      layout: 'prose',
      background: '/story-assets/hyena-story/f04-dawit-kitchen.png',
      dialogue: {
        text: `Dawit\u2019s tooth fell out during mathematics, which was terrible timing because it landed on his workbook and there was blood on the long division and his teacher looked at him the way adults look when they\u2019re deciding whether something is an emergency.\n\nIt was not an emergency. It was a tooth.\n\nHe wrapped it in the bloodstained page and put it in his pocket and felt it there all day. Small and hard and strange. A piece of himself that was no longer part of himself.\n\nAt dinner he eats on one side. The gap feels enormous. Hana keeps looking at his mouth.\n\n\u201CStop looking.\u201D\n\n\u201CYou look funny.\u201D\n\n\u201CStop.\u201D\n\n\u201CCan I SEE?\u201D\n\n\u201CNO.\u201D\n\nHis mother sets down the coffee pot. \u201CAfter dinner,\u201D she says. Not to Hana. To Dawit.\n\nHe knows what she means.`,
      },
    },
    // Scene 6: Frame 5
    {
      id: 'hyena-05',
      layout: 'prose',
      background: '/story-assets/hyena-story/f05-threshold.png',
      dialogue: {
        text: `His mother told him the story when he was five. Her mother told her when she was six. It goes back further than anyone can trace, which is how you know it\u2019s real.\n\nYou take the tooth. You go outside. Into the dark. You throw the tooth. You say: Take my baby tooth and bring me a grown-up one. And the hyena comes.\n\n\u201CWhat does the hyena look like?\u201D Dawit asked when he was five.\n\n\u201CBig.\u201D\n\n\u201CHow big?\u201D\n\n\u201CBig.\u201D\n\nShe was not being mysterious. She was being accurate.\n\nDawit stands at the back door. He unwraps the tooth from the exercise page. Small and white. A little blood still on the root.\n\nHe takes a breath.\n\nHe throws the tooth.`,
      },
    },
    // Scene 7: Frame 6
    {
      id: 'hyena-06',
      layout: 'prose',
      background: '/story-assets/hyena-story/f06-short-throw.png',
      dialogue: {
        text: `It lands two feet from the door. On the packed earth. In the kitchen light. He could pick it up without bending down if he stretched.\n\nHe says the words fast, mumbled, like checking a box: \u201CTakemybabytoothandgivemeastrongone.\u201D\n\nHe steps back inside. Closes the door. Stands there with his heart going hard and his hands cold.\n\nHis father has just come home. \u201CDid you do it?\u201D\n\n\u201CYes.\u201D\n\nHis father nods. His mother says nothing. She pours the coffee the way she pours when she is thinking, which is slowly, with the pot higher than it needs to be, watching the stream fall.`,
      },
    },
    // Scene 8: Frame 7
    {
      id: 'hyena-07',
      layout: 'prose',
      background: '/story-assets/hyena-story/f07-morning-tooth.png',
      dialogue: {
        text: `Morning.\n\nThe tooth is on the ground. Right where he threw it. An ant walks past without stopping.\n\nDawit picks it up. He holds it in his palm and feels the thing he doesn\u2019t have a word for yet. Not embarrassment. Not shame. The feeling you get when you know you didn\u2019t really try and the world noticed.\n\nThe hyena didn\u2019t come.\n\nNot because Dawit did the words wrong. Not because the tradition is broken. Because the tooth was in the light. The tradition says the dark. Not near the dark. Not toward it. Into the part of the night where you can\u2019t see your own hand. The part where something lives that you have to trust without seeing.\n\nDawit threw the tooth two feet from safety and said the words with his foot on the threshold. He performed the tradition the way you perform a chore.\n\nAnd the hyena, who has waited in the dark for six hundred years, who cannot come to the light because the light is not where he lives, did not move.`,
      },
    },
    // Scene 9: Frame 8
    {
      id: 'hyena-08',
      layout: 'prose',
      background: '/story-assets/hyena-story/f08-day-passes.png',
      dialogue: {
        text: `He carries the tooth all day. Through mathematics and Amharic reading and lunch, where Yonas asks what happened and Dawit says \u201CI threw it out last night,\u201D which is technically true and completely false.\n\nHe carries it home. Kicks a stone along the road. The ridge is visible against the afternoon sky. Something up there catches the light for a moment and he looks away.\n\nAt dinner, he is quiet. Hana talks for both of them, describing, in detail, a bug she found under a rock that had \u201Ca million legs, Mama, a MILLION.\u201D\n\nThen his mother says: \u201CThe hyena always comes. You didn\u2019t go to where it lives.\u201D\n\nShe takes another bite. She does not say anything else about it.`,
      },
    },
    // Scene 10: Frame 9
    {
      id: 'hyena-09',
      layout: 'prose',
      background: '/story-assets/hyena-story/f09-fathers-shirt.png',
      dialogue: {
        text: `He puts on his father\u2019s shirt.\n\nIt reaches his knees. It smells like soap and engine grease and the warm fabric smell of someone who has worn the same shirt to work for a year. He doesn\u2019t put it on because his father told him to. He puts it on because tonight he is going into the dark and he would like to smell like someone who isn\u2019t afraid.\n\nHe holds the tooth in his fist. No wrapping this time. The tooth against his palm, where he can feel the hard edge of it. This piece of him that grew with him for seven years, that chewed injera and bit sugar cane and held shut when he was trying not to cry at the movie where the dog dies.\n\nHe opens the back door.`,
      },
    },
    // Scene 11: Frame 10
    {
      id: 'hyena-10',
      layout: 'prose',
      background: '/story-assets/hyena-story/f10-shadow-grows.png',
      dialogue: {
        text: `One step past the light.\n\nThe packed earth is cool through his sandals. He can still feel the kitchen warmth on his back.\n\nTwo steps. Three. The acacia tree is closer. In the morning it\u2019s just a tree. He\u2019s climbed it, scratched his initials in the bark with a nail. At night it\u2019s something else. Not alive. But present, the way very old things are present.\n\nFour steps. Five. The kitchen light thins behind him. His shadow stretches ahead.\n\nHe notices his shadow.\n\nIt\u2019s larger than he is. Wider than his shoulders, wider than the too-big shirt. This is what happens when you walk away from a light source. The angle changes. The shadow grows. Physics.\n\nBut Dawit is seven and he is standing in the dark in his father\u2019s shirt with a tooth in his fist and his shadow is enormous, and something about that makes him take the sixth step.`,
      },
    },
    // Scene 12: Frame 11
    {
      id: 'hyena-11',
      layout: 'prose',
      background: '/story-assets/hyena-story/f11-fence.png',
      dialogue: {
        text: `Seven steps. Eight. The fence.\n\nHe puts his hand on the painted wood. The last solid thing between him and the open dark.\n\nBehind the fence is scrub grass and packed earth rising toward the ridge. There are no lights. Sounds: crickets, something rustling, a bird making a noise he can\u2019t name. And underneath, silence. The deep silence of a place that is itself at night.\n\nHe lets go of the fence.\n\nNine steps. Ten. Eleven.\n\nHis shadow is gone. Not enough light to cast one. He is the same size as the dark now. Just in it.\n\nHe opens his fist. The tooth is there. He throws it. Not short. Not scared. The way you throw something you mean to give away. The tooth flies. He hears it land somewhere ahead, in the dark, where he can\u2019t see.\n\nHe says the words. Not fast. Not mumbled. The way his mother says them when she means what she says:\n\n\u201CTake my baby tooth. And bring me a strong one.\u201D`,
      },
    },
    // Scene 13: Frame 12
    {
      id: 'hyena-12',
      layout: 'prose',
      background: '/story-assets/hyena-story/f12-hyena-appears.png',
      dialogue: {
        text: `The dark answers.\n\nNot from far away. From fifteen feet ahead. The grass shifts. A head rises from the earth. Two amber eyes open like lamps lit from inside.\n\nHe was there the whole time. Lying in the grass when Dawit threw the tooth from the doorway last night. Lying here while the tooth sat on the ground all day. Waiting through mathematics and lunch and the walk home and dinner.\n\nHe does not stand. He raises his head, and that is enough. His jaw is the length of Dawit\u2019s forearm. His shoulders are wider than Dawit\u2019s father\u2019s. His coat catches starlight: spotted, silver-black, each spot a different shape, like a map of something only he can read.\n\nHe is the largest living thing Dawit has ever been close to.\n\nDawit does not run.`,
      },
    },
    // Scene 14: Frame 13
    {
      id: 'hyena-13',
      layout: 'prose',
      background: '/story-assets/hyena-story/f13-breath-reading.png',
      dialogue: {
        text: `The Hyena finds the tooth. He breathes.\n\nOne breath. The story lifts out of the enamel and rises as golden mist between them.\n\nDawit sees himself.\n\nThe first night. The doorway. The tooth two feet from safety. The mumbled words. The closed door.\n\nAnd then the second night. The father\u2019s shirt. The back door opening again. The steps, one by one. The fence. The open hand. The real throw.\n\nThe mist shows both nights. The cheat and the try. Side by side.\n\nDawit watches his own story played back in the breath of an animal the size of a motorcycle under a sky packed with stars. His face goes hot. He wants to look away. He doesn\u2019t.\n\nThe courage isn\u2019t in the throw. He understands that now. The courage is in coming back after you know what it costs to fail.`,
      },
    },
    // Scene 15: Frame 14
    {
      id: 'hyena-14',
      layout: 'prose',
      background: '/story-assets/hyena-story/f14-stone.png',
      dialogue: {
        text: `The Hyena takes the tooth. His tongue lifts it from the earth. Gentle, precise. It disappears. The mist folds inward, and Dawit\u2019s story joins six hundred years of other children in the lungs of a creature who will carry them until he stops breathing.\n\nThe Hyena\u2019s eyes glow brighter. The difference a single candle makes in a room with a fire. Dawit\u2019s story is in there now. His long division blood, his doorway failure, his father\u2019s shirt, his real throw. Kept.\n\nAt his feet: a stone. Black. Smooth. Warm. It fits in his palm exactly where the tooth used to be.`,
      },
    },
    // Scene 16: Frames 15+16 combined
    {
      id: 'hyena-15-16',
      layout: 'prose',
      background: '/story-assets/hyena-story/f16-walk-back.png',
      dialogue: {
        text: `The Hyena stands. He is bigger than his mother\u2019s word could hold. He turns and walks into the dark. Toward the ridge. His gait is rolling and there is no hurry in it, because there is no hurry in a creature who has all night, every night, forever.\n\nAs he walks, he breathes, and in the cold air his breath shows shapes. Dawit doesn\u2019t know what they are. Hundreds of children. Hundreds of nights. Hundreds of teeth thrown into the dark by small hands.\n\nHe walks back. Not running. Past the fence. Past the acacia tree. Over the line where the kitchen light starts.\n\nHis mother is in the kitchen. Coffee\u2019s done.\n\n\u201CWere you scared?\u201D\n\n\u201CYes.\u201D\n\nShe nods. That\u2019s the right answer.`,
      },
    },
    // Scene 17: Frame 17
    {
      id: 'hyena-17',
      layout: 'prose',
      background: '/story-assets/hyena-story/f17-schoolyard.png',
      dialogue: {
        text: `In the morning, Hana asks to see the stone.\n\n\u201CCan I have it?\u201D\n\n\u201CNo.\u201D\n\n\u201CPlease?\u201D\n\n\u201CNo. Get your own.\u201D\n\nShe looks in the mirror. She wiggles a tooth experimentally. Someday. Maybe soon.\n\nAt school, Yonas asks about it.\n\n\u201CDid the hyena come?\u201D\n\n\u201CYeah.\u201D\n\n\u201CWere you scared?\u201D\n\nDawit thinks about it. The first night. The second.\n\n\u201CBoth times,\u201D he says.\n\nYonas doesn\u2019t ask what that means. He\u2019s seven. He\u2019ll find out when his own tooth falls.`,
      },
    },
    // Scene 18: Epilogue
    {
      id: 'hyena-epilogue',
      layout: 'narrative',
      background: '/story-assets/hyena-story/f17-schoolyard.png',
      dialogue: {
        text: `Dawit puts the stone on his nightstand that evening. If you hold it up to the window and look closely, there\u2019s a shape inside. Tooth-shaped. As if something was held in the stone for a long time, and the stone grew around it, and kept it.\n\nOn the ridge, the Hyena sleeps. Near his paw, a flat stone with a scratch-mark. A message from someone he\u2019s never met. A fairy from the north. Something about a network.\n\nHe hasn\u2019t replied. He doesn\u2019t write.\n\nBut the stone has been moved. And next to the fairy\u2019s mark, a new one. Deep. Made by a claw.\n\nIt means yes.`,
      },
    },
    // Scene 19: CTA
    {
      id: 'hyena-cta',
      layout: 'cta',
      background: '/story-assets/hyena-story/f17-schoolyard.png',
      dialogue: {
        text: 'Every tooth carries a story. Every story deserves to be kept.',
      },
      isChoice: true,
      choiceText: 'Draw a tooth for this story',
      choiceHref: '/toothfairy/app/draw?from=story&slug=hyena-story',
    },
  ],
}

export default hyenaStory
