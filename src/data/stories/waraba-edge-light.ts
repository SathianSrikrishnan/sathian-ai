import { StoryConfig } from './types'

const frames = '/story-assets/waraba-edge-light/v1/frames'

const warabaAmber = '#F0B766'
const thresholdShadow = '#7A4A2B'

/**
 * Story 5 - Waraba at the Edge of the Light.
 * Production story data: 32 full-frame scenes from the approved V2 reader draft.
 */
const warabaEdgeLight: StoryConfig = {
  "id": "waraba-edge-light",
  "title": "Waraba at the Edge of the Light",
  "region": "Ethiopia / Harar",
  "emoji": "\u{1F43E}",
  "color": warabaAmber,
  "description": "A Harar-region story of a tooth, a doorway, and the courage that walks beside fear.",
  "characterName": "Waraba",
  "available": true,
  "crossReferences": [
    "korea",
    "tanda",
    "ratoncito-perez"
  ],
  "colors": {
    "accent": warabaAmber,
    "accentGlow": `${warabaAmber}80`,
    "secondary": thresholdShadow,
    "secondaryGlow": `${thresholdShadow}80`
  },
  "effects": {
    "particles": {
      "count": 18,
      "color": warabaAmber,
      "sizeMin": 1,
      "sizeMax": 3,
      "durationMin": 11,
      "durationMax": 20,
      "drift": 14,
      "glow": true
    },
    "sparkleOn": [
      "victory"
    ]
  },
  "scenes": [
    {
      "id": "waraba-01-cover",
      "layout": "cover",
      "background": `${frames}/s5-frame-01-cover.png`,
      "dialogue": {
        "text": "Waraba at the Edge of the Light",
        "subtext": "A Tooth Fairy Network story of a tooth, a doorway, and the courage that walks beside fear."
      }
    },
    {
      "id": "waraba-02-place-that-listens",
      "layout": "narrative",
      "background": `${frames}/s5-frame-02-place-that-listens.png`,
      "dialogue": {
        "text": "The dark outside Ilyas's house, near Harar, was not empty.\nIt held cooling stones, dry grass, and the warm breath of night.",
        "subtext": "It held old paths his mother knew without naming.\nAnd somewhere beyond the kitchen light, Waraba listened."
      }
    },
    {
      "id": "waraba-03-tooth-trouble",
      "layout": "narrative",
      "background": `${frames}/s5-frame-03-tooth-trouble.png`,
      "dialogue": {
        "text": "Ilyas's tooth had been loose for four days.\nHe named it Captain Wobble.",
        "subtext": "\"Captain Wobble fears no soup,\" he told his mother.\nCaptain Wobble feared soup a little."
      }
    },
    {
      "id": "waraba-04-announcement",
      "layout": "narrative",
      "background": `${frames}/s5-frame-04-announcement.png`,
      "dialogue": {
        "text": "At supper, Ilyas bit down carefully.\nThe tooth slipped free and landed in his palm.",
        "subtext": "\"Mutiny,\" said Ilyas.\nHis mother laughed into her hand."
      }
    },
    {
      "id": "waraba-06-old-way",
      "layout": "narrative",
      "background": `${frames}/s5-frame-06-old-way.png`,
      "dialogue": {
        "text": "His mother rinsed the tooth and set it back in his palm.\n\"In our family,\" she said, \"there is an old way. You step beyond the light. You offer the tooth to the dark. You ask Waraba for a strong new one.\"",
        "subtext": "\"Step beyond the light?\" said Ilyas.\n\"Only if the tooth wants a dramatic ending.\"\nBut his smile disappeared for one blink."
      }
    },
    {
      "id": "waraba-08-how-big-is-waraba",
      "layout": "narrative",
      "background": `${frames}/s5-frame-08-how-big-is-waraba.png`,
      "dialogue": {
        "text": "\"How big is Waraba?\" Ilyas asked.\n\"Bigger than a joke,\" his mother said.",
        "subtext": "Ilyas frowned.\n\"That is not a measurement.\"\n\"No,\" she said. \"It is a warning.\""
      }
    },
    {
      "id": "waraba-10-old-invitation",
      "layout": "narrative",
      "background": `${frames}/s5-frame-10-old-invitation.png`,
      "dialogue": {
        "text": "Far from Ilyas's kitchen, Tanda noticed a warm mark stir on the Network shelf.\nIt was not an order and not a road.",
        "subtext": "Waraba's places did not like roads.\nIt was an old invitation: Come to the edge. Remember what is witnessed. Do not take what is not yours.\nTanda put the marked stone in her satchel and went."
      }
    },
    {
      "id": "waraba-11-door-opens",
      "layout": "narrative",
      "background": `${frames}/s5-frame-11-door-opens.png`,
      "dialogue": {
        "text": "Ilyas stood at the open door with the tooth in his fist.\nHis mother waited behind him, calm as the lamp.",
        "subtext": "\"I have an excellent plan,\" said Ilyas. \"I will throw from here. Efficient. Aerodynamic. Nearly ancient.\"\n\"The old way asks for your feet too,\" his mother said.\n\"My feet send their respects.\""
      }
    },
    {
      "id": "waraba-14-tooth-in-the-light",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-14-tooth-in-the-light.png`,
      "dialogue": {
        "text": "Ilyas flicked the tooth into the bright rectangle on the ground.\nIt landed in the kitchen light, not in the dark.",
        "subtext": "The little white tooth glowed, then dimmed.\nA thin crack appeared in the dust at the threshold.\n\"There,\" said Ilyas. \"Delivered.\"\nHis mother did not scold him. She only watched."
      }
    },
    {
      "id": "waraba-16-tanda-at-the-edge",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-16-tanda-at-the-edge.png`,
      "dialogue": {
        "text": "After the door closed, Tanda arrived at the exact edge of the light.\nShe saw the tooth near the threshold.",
        "subtext": "She saw the crack in the dust.\nThen she folded her own glow small.\nThis was Waraba's territory. Tanda could carry news. She could not finish the ritual for a child."
      }
    },
    {
      "id": "waraba-17-waraba-does-not-move",
      "layout": "narrative",
      "background": `${frames}/s5-frame-17-waraba-does-not-move.png`,
      "dialogue": {
        "text": "Far out in the dark, Waraba opened one amber eye.\nThen he closed it again.",
        "subtext": "Waraba was not refusing Ilyas.\nHe simply could not receive a gift that had not truly been given.\nHis silence was so complete it almost sounded like a joke."
      }
    },
    {
      "id": "waraba-18-morning-proof",
      "layout": "narrative",
      "background": `${frames}/s5-frame-18-morning-proof.png`,
      "dialogue": {
        "text": "In the morning, the tooth still waited where the light had touched it.\n\"Waraba must be busy,\" said Ilyas.",
        "subtext": "The joke came out smaller than he meant it to.\nHis mother placed the tooth in his palm.\nIt felt heavier than yesterday."
      }
    },
    {
      "id": "waraba-20-near-is-not-given",
      "layout": "narrative",
      "background": `${frames}/s5-frame-20-near-is-not-given.png`,
      "dialogue": {
        "text": "\"I came near,\" said Ilyas.\n\"Near is a doorway,\" his mother said. \"It is not a gift.\"",
        "subtext": "Her voice stayed gentle.\n\"You do not have to try again because I say so.\"\nShe let that line rest between them.\n\"But the tooth will know.\""
      }
    },
    {
      "id": "waraba-21-what-she-remembered",
      "layout": "narrative",
      "background": `${frames}/s5-frame-21-what-she-remembered.png`,
      "dialogue": {
        "text": "\"When I was little,\" his mother said, \"I stood where you stood.\"\n\"Were you scared?\"",
        "subtext": "\"The whole way.\"\n\"Did the dark get smaller?\"\n\"No. I stepped anyway. My mother waited. Waraba waited. The dark did not need to become smaller for me to walk.\""
      }
    },
    {
      "id": "waraba-23-tandas-advice",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-23-tandas-advice.png`,
      "dialogue": {
        "text": "That evening, Tanda sat at the edge of the light.\n\"Are you here to collect?\" Ilyas asked.",
        "subtext": "\"No,\" said Tanda. \"This one belongs to Waraba.\"\n\"Can you make the dark less dark?\"\n\"No,\" said Tanda. \"I can stand where the light ends and remind you that you are not alone.\""
      }
    },
    {
      "id": "waraba-25-the-question",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-25-the-question.png`,
      "dialogue": {
        "text": "His mother touched his shoulder.\n\"Before the jokes,\" she said, \"answer one question.\"",
        "subtext": "Ilyas looked at the dark.\n\"Do you want your joke to protect you,\" she asked, \"or keep you from going?\"\nIlyas almost said, \"Both.\"\nThe word did not come out."
      }
    },
    {
      "id": "waraba-26-first-step",
      "layout": "narrative",
      "background": `${frames}/s5-frame-26-first-step.png`,
      "dialogue": {
        "text": "Ilyas stepped over the threshold.\nOne whole foot stood in the dark.",
        "subtext": "The ground was warm from the day.\nNothing grabbed him.\n\"That is rude,\" he whispered. \"I prepared several heroic noises.\""
      }
    },
    {
      "id": "waraba-27-shadow-grows",
      "layout": "narrative",
      "background": `${frames}/s5-frame-27-shadow-grows.png`,
      "dialogue": {
        "text": "His shadow stretched ahead of him, bigger than he was.\nA tiny burrow-shaped mark opened in the dust, then vanished.",
        "subtext": "The dark seemed to listen for courage and leave behind the part made only of show.\nIlyas swallowed.\nThis time, he did not make the swallow into a joke."
      }
    },
    {
      "id": "waraba-28-tanda-stays",
      "layout": "narrative",
      "background": `${frames}/s5-frame-28-tanda-stays.png`,
      "dialogue": {
        "text": "Ilyas looked back once.\nTanda folded her hands over her satchel.",
        "subtext": "\"I can witness,\" she said softly. \"I cannot walk it for you.\"\nHis mother stayed inside the light.\nShe did not rescue the moment."
      }
    },
    {
      "id": "waraba-30-warm-stone",
      "layout": "narrative",
      "background": `${frames}/s5-frame-30-warm-stone.png`,
      "dialogue": {
        "text": "Ilyas walked farther.\nHis jokes grew quiet.",
        "subtext": "Fear walked beside him.\nIt did not leave, but it stopped standing in front.\nUnder his sandal, a sun-warmed stone held one last breath of day.\nHe stood there until his own breath slowed."
      }
    },
    {
      "id": "waraba-31-past-the-light",
      "layout": "narrative",
      "background": `${frames}/s5-frame-31-past-the-light.png`,
      "dialogue": {
        "text": "The doorway became a small amber shape behind him.\nIlyas opened his palm.",
        "subtext": "The tooth looked tiny.\nHis fear looked huge.\nBoth had come along.\n\"Waraba,\" he whispered, \"this is my tooth. Please give me a strong new one.\""
      }
    },
    {
      "id": "waraba-32-true-throw",
      "layout": "narrative",
      "background": `${frames}/s5-frame-32-true-throw.png`,
      "dialogue": {
        "text": "This time, Ilyas threw from beyond the kitchen light.\nThe tooth made a little white arc and vanished into the dark.",
        "subtext": "He did not run after it with a joke.\nHe waited."
      }
    },
    {
      "id": "waraba-34-the-eyes",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-34-the-eyes.png`,
      "dialogue": {
        "text": "Two amber lights opened low to the ground.\nNot lamps.",
        "subtext": "Not fire.\nEyes.\nIlyas forgot every joke he had ever known.\nThen one came back and decided not to say itself."
      }
    },
    {
      "id": "waraba-35-waraba-revealed",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-35-waraba-revealed.png`,
      "dialogue": {
        "text": "Waraba lifted his enormous head.\nHis spotted coat held night and dust.",
        "subtext": "His ears were torn like old paper.\nHis eyes were warm as coals buried under ash.\nHe was not smaller than fear.\nHe was older than it."
      }
    },
    {
      "id": "waraba-36-the-breath",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-36-the-breath.png`,
      "dialogue": {
        "text": "Waraba lowered his muzzle to the tooth.\nHis breath moved over the ground, warm and slow.",
        "subtext": "Inside that breath, Ilyas saw the first throw, the crack in the threshold, the joke he had used like a shield, and the step he had taken anyway."
      }
    },
    {
      "id": "waraba-37-looking-anyway",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-37-looking-anyway.png`,
      "dialogue": {
        "text": "Ilyas wanted to look away from the scared part.\nWaraba kept all of it.",
        "subtext": "Not to shame him.\nTo witness him.\nCourage, Waraba seemed to say, was not fear disappearing.\nCourage was walking with fear until it belonged to the story."
      }
    },
    {
      "id": "waraba-38-received",
      "layout": "victory",
      "background": `${frames}/s5-frame-38-received.png`,
      "dialogue": {
        "text": "Waraba took the tooth gently.\nThe dark around him softened.",
        "subtext": "Ilyas felt the place where the new tooth would grow.\nIt did not feel empty.\nIt felt like a place preparing."
      }
    },
    {
      "id": "waraba-39-threshold-glow",
      "layout": "victory",
      "background": `${frames}/s5-frame-39-threshold-glow.png`,
      "dialogue": {
        "text": "On the stone near Ilyas's foot, a glow gathered.\nAmber on one edge.",
        "subtext": "Earth-shadow on the other.\nOne far protective eye.\nIt was warm enough to carry and small enough for a pocket.\nWaraba had left the Threshold Glow."
      }
    },
    {
      "id": "waraba-40-warabas-mark",
      "layout": "victory",
      "background": `${frames}/s5-frame-40-warabas-mark.png`,
      "dialogue": {
        "text": "Waraba looked toward the doorway.\nTanda bowed before he moved.",
        "subtext": "Waraba breathed once.\nA new claw mark lit beside the old scratch on Tanda's stone.\nNot a road.\nPermission to remember this threshold."
      }
    },
    {
      "id": "waraba-41-back-to-kitchen",
      "layout": "dramatic",
      "background": `${frames}/s5-frame-41-back-to-kitchen.png`,
      "dialogue": {
        "text": "Ilyas walked back.\nThe fear came too, but now it knew the way.",
        "subtext": "His shadow followed behind him, where shadows are supposed to be.\nHis mother waited with the door open.\nTanda stood small at the edge, exactly where she had promised."
      }
    },
    {
      "id": "waraba-42-right-answer",
      "layout": "victory",
      "background": `${frames}/s5-frame-42-right-answer.png`,
      "dialogue": {
        "text": "\"Were you scared?\" his mother asked.\n\"Yes,\" said Ilyas.",
        "subtext": "Then he held up the warm stone.\n\"Very professionally.\"\nHis mother laughed softly.\nTanda laughed too, but softly, because the dark was still listening."
      }
    },
    {
      "id": "waraba-43-shelf-opens",
      "layout": "cta",
      "background": `${frames}/s5-frame-43-shelf-opens.png`,
      "dialogue": {
        "text": "At dawn, Tanda placed the marked stone on the Network shelf.\nThe shelf did not open into Waraba's dark.",
        "subtext": "It opened beside it, like a respectful doorway.\nOn Ilyas's drawing, a warm shadow settled at the border: amber edge, soft earth wash, one far eye.\nAnd beyond the kitchen light, Waraba slept with one new story in his breath."
      },
      "isChoice": true,
      "choiceText": "Create Your Threshold Glow",
      "choiceHref": "/toothfairy/app/draw?from=story&slug=waraba-edge-light"
    }
  ]
}

export default warabaEdgeLight
