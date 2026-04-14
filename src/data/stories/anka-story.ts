import { StoryConfig } from './types'

const ankaStory: StoryConfig = {
  id: 'anka-story',
  title: 'The Still One',
  region: 'Brazil',
  emoji: '\u{1F33F}',
  color: '#2D8B46',
  description: 'A girl learns that stillness brings what trying never could',
  characterName: 'Anka',
  available: true,
  crossReferences: ['tanda', 'hyena-story'],
  colors: {
    accent: '#2D8B46',
    secondary: '#8B6B2D',
  },
  effects: {
    particles: {
      count: 18,
      color: '#4ADE80',
      sizeMin: 2,
      sizeMax: 5,
      durationMin: 6,
      durationMax: 12,
      drift: 25,
      glow: true,
    },
  },
  scenes: [
    // COVER
    {
      id: 'anka-cover',
      layout: 'cover',
      background: '/story-assets/anka-story/f01-green-eyes.png',
      dialogue: {
        text: 'The Still One',
        subtext: 'A Brazilian Tradition',
      },
    },
    // FRAME 1
    {
      id: 'anka-01',
      layout: 'prose',
      background: '/story-assets/anka-story/f01-green-eyes.png',
      dialogue: {
        text: "Anka has not moved in three hours.\n\nThis is not unusual. She once waited four days for a child in a village upriver to decide she was ready. The child was five and had lost her tooth eating guava and she was not scared of the forest but she was scared of the dark, so Anka sat in a ceiba tree and waited four days while the child worked up her nerve.\n\nFour days. Anka did not mind.\n\nTime is different for a jaguar who has been alive since before the river changed its course. She remembers the first tooth she ever collected. A boy, very small. He placed his tooth on a leaf at the water's edge and sat behind it and said nothing because in those days the tradition had no words. The jaguar came. She took the tooth. She looked at the boy and the boy looked at her, and for a breath her eyes showed him what the tooth carried: his mother's hands. The river's sound. A fish he caught that was too small to eat but too beautiful to throw back, so he held it until it stopped fighting and let it go and never told anyone about the fish, because some things are not stories you tell. They're stories you keep.\n\nThat was a long time ago.",
      },
    },
    // FRAME 2
    {
      id: 'anka-02',
      layout: 'prose',
      background: '/story-assets/anka-story/f02-forest-life.png',
      dialogue: {
        text: "She sits in the ceiba tree and watches the house with the tin roof and the wooden porch.\n\nThe forest around her is never still. Leaf-cutter ants carry their green sails across root systems. A poison dart frog adjusts its grip on a vine. Army ants pass below in an organized column. A beetle with wings the color of gasoline navigates a root.\n\nEverything moves.\n\nAnka is the only still thing in it.\n\nShe has learned, over centuries, that stillness is not the absence of motion. It is the refusal of it. She is a jaguar. She can sprint at eighty kilometers per hour, drag a caiman twice her weight from a river, bite through a skull. She can do all of this. She does none of it. She sits in a tree and waits for children to bring her their teeth.\n\nThis is the hardest thing she does.",
      },
    },
    // FRAME 3
    {
      id: 'anka-03',
      layout: 'prose',
      background: '/story-assets/anka-story/f03-cartwheel.png',
      dialogue: {
        text: "Luisa's tooth came out in the middle of a cartwheel and she thought it was the funniest thing that had ever happened to anyone.\n\nShe was upside down. The river was above her, which was confusing. Her hands were on the grass and her mouth was open because she was laughing at the upside-down river, and that is when the tooth decided it had had enough of Luisa's mouth and it left.\n\nIt flew.\n\nNot far. About a meter. But for one moment it was in the air, a tiny white thing against the green, and Luisa saw it go, and she shouted \"MY TOOTH!\" and tipped over sideways and lay on the grass laughing and spitting a little blood and feeling the gap with her tongue, which was enormous, which was a CANYON, which was the most interesting thing her mouth had ever done.",
      },
    },
    // FRAME 4
    {
      id: 'anka-04',
      layout: 'prose',
      background: '/story-assets/anka-story/f04-avo-porch.png',
      dialogue: {
        text: "Her grandmother picked it up while Luisa was still laughing.\n\n\"Avo! MY TOOTH!\"\n\n\"I know. I have it.\"\n\n\"GIVE IT.\"\n\n\"I'm holding it for you.\"\n\n\"GIVE IT I want to SEE it.\"\n\nShe held it in her palm. Small. White. A tiny brown mark at the root. Warm. Hers. No longer in her.\n\n\"Is there a story in it?\" she asked.\n\nAvo shelled a bean. Pop. Into the bowl. \"You know there is.\"\n\n\"I know you SAY there is.\"\n\n\"Mm.\"\n\n\"Can you SEE it?\"\n\n\"I can't. She can.\"\n\n\"The jaguar.\"\n\n\"The jaguar.\"\n\nLuisa looked at the forest. Still daylight. Just trees. Nothing watching. Nothing waiting.\n\nShe was wrong about both things.",
      },
    },
    // FRAME 5
    {
      id: 'anka-05',
      layout: 'prose',
      background: '/story-assets/anka-story/f05-supplies.png',
      dialogue: {
        text: "Luisa is not a child who waits well.\n\nShe is a child who, when told that bath time is in ten minutes, spends those ten minutes constructing an argument for why it should be fifteen, complete with diagrams. She is a child who runs everywhere, including to the bathroom. She once tried to speed up the growth of a papaya tree by pouring warm water on it every hour for two days, which did not speed up the tree but did attract an astonishing number of mosquitoes.\n\nWhen her grandmother told her the tradition \u2014 place the tooth at the forest's edge, sit, wait, the jaguar comes when you are still \u2014 Luisa heard: place the tooth, do things until the jaguar comes.\n\nShe assembles her supplies:\n\nThe tooth. A piece of chicken from dinner, because jaguars are carnivores and she did a project on them at school. A flashlight, so the jaguar can find her. Rafael's baby tooth from last year, taken from the drawer in his room without asking, because two teeth are better than one. And a sign, hand-drawn on cardboard, that says ONCA VENHA AQUI. Jaguar Come Here. She drew spots around the border.\n\nHer grandmother looks at the supplies.\n\n\"Mm,\" she says.\n\nThis is a woman who has said \"mm\" to three generations of children and each one has interpreted it as approval.",
      },
    },
    // FRAME 6
    {
      id: 'anka-06',
      layout: 'prose',
      background: '/story-assets/anka-story/f06-yard-sale.png',
      dialogue: {
        text: "She carries everything to the flat stone at the forest's edge.\n\nTooth in the center. Chicken to the left. Rafael's tooth to the right. Flashlight aimed into the trees. Sign propped against a fern, facing the forest.\n\nShe sits. She waits.\n\nOne minute. She counts the seconds on her fingers.\n\n\"Ok I'm ready,\" she announces to the forest.\n\nThe forest does not respond.",
      },
    },
    // FRAME 7
    {
      id: 'anka-07',
      layout: 'prose',
      background: '/story-assets/anka-story/f07-yelling.png',
      dialogue: {
        text: "Two minutes. She stands up.\n\n\"ONCA!\" she yells. \"ONCA, VENHA AQUI! I HAVE A TOOTH!\"\n\nNothing.\n\n\"I HAVE TWO TEETH!\"\n\nA bird erupts from a tree. An iguana on a branch opens one eye, decides against this location, and relocates.\n\nShe sits. Waits another minute. The forest is quieter now.",
      },
    },
    // FRAMES 8+9 COMBINED
    {
      id: 'anka-08',
      layout: 'prose',
      background: '/story-assets/anka-story/f09-shaking-branch.png',
      dialogue: {
        text: "She moves the chicken into the tree line. She crouches behind a bush. This is her trap: jaguar smells chicken, comes to eat, sees teeth, collects them. Done.\n\nShe waits behind the bush for five minutes. During those five minutes, ants find the chicken. A lot of ants. The chicken is covered in ants. No jaguar.\n\nShe grabs a branch and shakes it. She hits a tree trunk with a stick. She stomps. She claps. She says \"Here, kitty kitty,\" which is what her cousin in the city says to the cat behind the supermarket, and which is the bravest and most misguided thing Luisa has ever said.\n\nThe forest empties.\n\nShe doesn't notice it happening. But it happens. The crickets stop. The frogs stop. A monkey in the canopy relocates four trees away. The owl settles somewhere else. The leaf-cutter ants reroute away from the stomping and clapping.\n\nThe forest doesn't run from Luisa. It withdraws. Quietly. One creature at a time. The way a tide goes out.",
      },
    },
    // FRAME 10
    {
      id: 'anka-09',
      layout: 'prose',
      background: '/story-assets/anka-story/f10-split-defeat.png',
      dialogue: {
        text: "Luisa stops.\n\nShe looks around. She notices the silence for the first time. Not quiet. Empty. The crickets that were singing when she sat down are gone. The frog is gone. The million small noises that make a forest a forest at night: gone.\n\nShe drove them away. All of them.\n\nShe sits on the ground. The flashlight flickers. The sign has blown over. The ants are eating the chicken. Rafael's tooth sits in its bottle cap looking exactly like what it is: stolen property.\n\n\"Avo,\" she calls. Her voice is smaller now. \"I messed it up.\"",
      },
    },
    // FRAME 11
    {
      id: 'anka-10',
      layout: 'prose',
      background: '/story-assets/anka-story/f11-avo-cleanup.png',
      dialogue: {
        text: "Her grandmother walks over. No hurry.\n\nShe picks up the chicken. Drops it in the tall grass.\n\nShe picks up Rafael's tooth. Apron pocket. That goes back in the drawer tomorrow. That boy will notice.\n\nShe picks up the sign. ONCA VENHA AQUI. Folds it. Tucks it under her arm. She'll keep it. Years from now she'll find it in a box and laugh so hard the neighbors hear.\n\nShe turns off the flashlight.\n\nShe leaves one thing: Luisa's tooth. On the flat stone. In the dark.\n\nThen she says:\n\n\"The forest was full before you started trying.\"\n\nShe walks back to the porch. Sits. Picks up her cup. Drinks something that has been steeping since before Luisa made her sign.",
      },
    },
    // FRAME 12
    {
      id: 'anka-11',
      layout: 'prose',
      background: '/story-assets/anka-story/f12-deflated-still.png',
      dialogue: {
        text: "Luisa sits.\n\nNot because she's figured out the secret. Because she is out of ideas. She has tried calling, baiting, advertising, and percussive summoning, and all of it failed, and there is nothing left to do.\n\nThis is not wisdom. This is exhaustion.\n\nShe sits with her hands in her lap and the tooth faintly glowing on the stone. She notices the glow for the first time now that the flashlight is off. She thinks about the tooth. Nine days of wiggling. The cartwheel. The river upside down. The gap that was a canyon.\n\nShe stops thinking about the jaguar.",
      },
    },
    // FRAME 13
    {
      id: 'anka-12',
      layout: 'prose',
      background: '/story-assets/anka-story/f13-forest-returns.png',
      dialogue: {
        text: "The first cricket starts up again. Far away. Tentative.\n\nLuisa doesn't notice.\n\nA frog returns to the vine near her head. A tiny wet sound, the size of a breath.\n\nShe doesn't notice.\n\nThe ants reroute back. Their green sails cross the root system, reestablishing the highway she stomped through.\n\nA firefly blinks. Green. Then another. Then a third, deeper in the trees.\n\nShe notices the fireflies. She watches one. It blinks: one... two... three. Dark. One... two... three.\n\nShe counts the pauses between blinks. Her breathing slows to match. One, two, three, dark.\n\nShe is still. Not performing stillness. Still in the way you are when you forget yourself. When you're watching a firefly or lying in grass or looking at a sky that doesn't need anything from you.",
      },
    },
    // FRAME 14
    {
      id: 'anka-13',
      layout: 'prose',
      background: '/story-assets/anka-story/f14-anka-descends.png',
      dialogue: {
        text: "In the ceiba tree, Anka's eyes open fully.\n\nGreen so vivid it casts light on the leaves around her. Green like the floor of the river she remembers, green like the underside of a leaf held to the sun.\n\nThe child is still. The forest is back. The tooth hums.\n\nAnka descends from the tree the way water runs down rock. Each paw knows the bark. Her claws retract. Her coat ripples, rosettes shifting over muscle. She weighs ninety kilos and does not disturb a single leaf.\n\nThe mushrooms on the log glow brighter as she passes. The fireflies pulse faster. A column of ants crosses her path and does not deviate.\n\nEverything Luisa scattered, Anka's stillness has called back. The jaguar is not the predator of this forest. She is its nervous system.",
      },
    },
    // FRAMES 15+16 COMBINED
    {
      id: 'anka-14',
      layout: 'prose',
      background: '/story-assets/anka-story/f16-luisa-sees.png',
      dialogue: {
        text: "Three steps from the child, Anka stops.\n\nThe child hasn't seen her. The child is watching a firefly.\n\nThis is how it has always worked. The children who search for Anka don't find her. The children who sit still long enough to forget what they're waiting for are the ones she comes to.\n\nThe firefly blinks. One, two, three.\n\nLuisa turns her head.\n\nThe jaguar is right there.\n\nLuisa does not scream. She is not brave. She is still, and stillness and bravery are not the same thing, but they live close together, like houses on the same street.\n\nAnka is the largest living thing Luisa has ever seen this close. Her eyes are the most beautiful things Luisa has ever looked into, and she has looked into a river and a sky and her grandmother's face, and none of them were this.\n\nLuisa breathes. Anka breathes. The forest breathes.\n\nFor one moment, everything is one thing, breathing together.",
      },
    },
    // FRAME 17
    {
      id: 'anka-15',
      layout: 'prose',
      background: '/story-assets/anka-story/f17-tooth-reflection.png',
      dialogue: {
        text: "Anka looks at the tooth. Her eyes pass over it slowly.\n\nIn those green eyes, Luisa sees her own life reflected.\n\nThe cartwheel. The river upside down. The tooth in the air. Her own face, laughing and bleeding.\n\nBut deeper. The nine days of wiggling. The tooth moving under her tongue during mathematics. And deeper still: the tooth during prayers. Her eyes closed, her hands folded, her tongue on the tooth, pushing, counting how many pushes until it moved. Forty-seven pushes. She counted. Nobody knew she counted.\n\nThe tooth carries all of it. Not just the milestone. The nine days of small attention that led to it. The private counting. The forty-seven pushes.\n\nAnka sees it all. Her eyes glow brighter with each layer.\n\nShe takes the tooth. Her mouth, capable of crushing bone, lifts it from the stone with the precision of a jeweler picking up a diamond. Her jaw closes. Two warm pulses in her eyes, like a heartbeat. The newest story settles into place alongside hundreds of others.\n\nShe looks at Luisa. Luisa looks back.\n\nThe jaguar turns and walks into the forest. The trees don't part for her. They include her. Her rosettes blend into the dappled shadow until she is not a jaguar in a forest but a forest with a jaguar-shaped piece that moves.",
      },
    },
    // FRAME 18
    {
      id: 'anka-16',
      layout: 'prose',
      background: '/story-assets/anka-story/f18-carved-jaguar.png',
      dialogue: {
        text: "On the flat stone: a small carved jaguar. Wood, dark, smooth. The size of her thumb. Two tiny green stone eyes that catch the starlight and glow, just a little, the way Anka's did.\n\nShe picks it up. It's warm.\n\nShe walks to the porch. Slowly. Not because she's been told to. Because the night is beautiful and the crickets are back and the firefly is blinking one-two-three and there is no reason to rush through this.",
      },
    },
    // FRAME 19
    {
      id: 'anka-17',
      layout: 'prose',
      background: '/story-assets/anka-story/f19-eventually.png',
      dialogue: {
        text: "\"Did she come?\"\n\n\"Yes.\"\n\n\"Were you still?\"\n\nLuisa looks at the small jaguar in her hand. She looks at the forest.\n\n\"Eventually,\" she says.\n\nHer grandmother laughs. Short. From the belly. The kind of laugh that means: that is the right answer and I've been sitting here drinking cold tea for an hour waiting for you to find it.",
      },
    },
    // EPILOGUE
    {
      id: 'anka-epilogue',
      layout: 'narrative',
      background: '/story-assets/anka-story/f19-eventually.png',
      dialogue: {
        text: "In the morning, Rafael notices his tooth is missing. \"LUISA!\" She puts it back. She does not explain.\n\nAt school she tells Beatriz about the jaguar. Beatriz says \"was it big?\" and Luisa says \"bigger\" and Beatriz says \"bigger than what?\" and Luisa thinks for a moment and says \"bigger than everything I did to make it come.\"\n\nBeatriz does not understand this. But it is exactly right.\n\nOn the nightstand that evening: the carved jaguar. And next to it, folded, kept, the sign. ONCA VENHA AQUI. The failure is the souvenir. That is the most Luisa thing possible.",
      },
    },
    // CTA
    {
      id: 'anka-cta',
      layout: 'cta',
      background: '/story-assets/anka-story/f19-eventually.png',
      dialogue: {
        text: 'Every tooth carries a story. Every story deserves to be kept.',
      },
      isChoice: true,
      choiceText: 'Draw a tooth for this story',
      choiceHref: '/toothfairy/app/draw?from=story&slug=anka-story',
    },
  ],
}

export default ankaStory
