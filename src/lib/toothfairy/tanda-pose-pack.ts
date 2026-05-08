export type TandaPoseSpec = {
  id: string;
  title: string;
  filename: string;
  path: string;
  beat: string;
  prompt: string;
};

const poseRoot = '/toothfairy/animation/pose-pack';

export const tandaPoseSpecs: TandaPoseSpec[] = [
  {
    id: 'fly-in-tooth',
    title: 'Fly In Holding Tooth',
    filename: 'tanda-01-fly-in-tooth.png',
    path: `${poseRoot}/tanda-01-fly-in-tooth.png`,
    beat: 'Tanda enters on a graceful arc with the tiny glowing tooth still in hand.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda flying diagonally into frame, body tilted forward, holding a tiny glowing baby tooth carefully in her raised hand. Preserve her soft brown wavy hair, white airy dress, brown satchel, iridescent pastel wings, warm face, and premium 3D storybook style. Full-body centered transparent sprite, generous padding, no background, no text, no extra objects.',
  },
  {
    id: 'hover-tooth',
    title: 'Hover Over Base Holding Tooth',
    filename: 'tanda-02-hover-tooth.png',
    path: `${poseRoot}/tanda-02-hover-tooth.png`,
    beat: 'She slows above the keepsake base and looks down before placing the tooth.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda hovering upright above an invisible pedestal, still holding the tiny glowing tooth, looking down warmly where she will place it. Knees softly bent, wings open, parent-friendly premium 3D storybook render. Full-body centered transparent sprite, no background, no text.',
  },
  {
    id: 'reach-down-empty',
    title: 'Reach Down Empty Hand',
    filename: 'tanda-02b-reach-down-empty.png',
    path: `${poseRoot}/tanda-02b-reach-down-empty.png`,
    beat: 'She leans into the placement with her hand lowered; the renderer draws the tooth separately.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda leaning downward toward an unseen keepsake base, right arm lowered across her body with palm open and angled down, left arm naturally balancing. Hands are empty because the renderer will draw the tooth separately. Full-body transparent sprite, premium 3D storybook style, no background, no text, no objects.',
  },
  {
    id: 'drop-tooth',
    title: 'Drop Tooth',
    filename: 'tanda-03-drop-tooth.png',
    path: `${poseRoot}/tanda-03-drop-tooth.png`,
    beat: 'Her hand moves down and the tooth leaves her fingers.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda reaching downward and releasing a tiny glowing tooth from her hand into an unseen magical base below. Her hand must clearly be lower than in the reference image; the tooth is just leaving her fingers. Gentle careful expression, premium 3D storybook style, full-body transparent sprite, no card, no piggy bank, no text, no background.',
  },
  {
    id: 'hand-retract-empty',
    title: 'Hand Retracts Empty',
    filename: 'tanda-03b-hand-retract-empty.png',
    path: `${poseRoot}/tanda-03b-hand-retract-empty.png`,
    beat: 'After release, her placing hand retracts naturally instead of staying frozen in the air.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda immediately after placing the tooth, hands empty, placing hand retracting back toward her body at waist height, other hand softly balancing flight. She looks down warmly toward the unseen glow. Full-body transparent sprite, premium 3D storybook style, no tooth, no background, no text, no objects.',
  },
  {
    id: 'follow-through',
    title: 'Follow Through After Drop',
    filename: 'tanda-04-follow-through.png',
    path: `${poseRoot}/tanda-04-follow-through.png`,
    beat: 'The hand is empty; she rises from the completed memory placement.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda just after releasing the tooth, with her hand empty, floating upward with a satisfied gentle smile and looking toward the glow below. Wings catching lift, white dress and satchel preserved, premium 3D storybook style. Full-body centered transparent sprite, no tooth in hand, no background, no text.',
  },
  {
    id: 'guide-coin',
    title: 'Guide Coin',
    filename: 'tanda-05-guide-coin.png',
    path: `${poseRoot}/tanda-05-guide-coin.png`,
    beat: 'She guides the small starter gift toward the piggy bank.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda floating beside an unseen glowing story card and guiding a small gold dollar coin forward with her open hand. She looks toward the coin direction with a confident warm smile. Preserve character, dress, satchel, wings, and premium 3D storybook style. Full-body centered transparent sprite, no background, no text.',
  },
  {
    id: 'guide-down-to-pig',
    title: 'Guide Down To Pig',
    filename: 'tanda-05b-guide-down-to-pig.png',
    path: `${poseRoot}/tanda-05b-guide-down-to-pig.png`,
    beat: 'She guides the starter gift downward into the piggy bank slot.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda floating to the right and slightly downward, looking toward an unseen piggy bank below, one open hand guiding downward toward an invisible slot. Hands are empty because the renderer draws the coin separately. Premium 3D storybook style, full-body transparent sprite, no coin, no piggy bank, no background, no text.',
  },
  {
    id: 'celebrate-pig-glow',
    title: 'Celebrate Pig Glow',
    filename: 'tanda-05c-celebrate-pig-glow.png',
    path: `${poseRoot}/tanda-05c-celebrate-pig-glow.png`,
    beat: 'After the gift lands, she reacts to the warm Smile Fund glow.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda hovering near an unseen piggy bank, smiling proudly and looking downward, both hands open in a small celebratory gesture with warm golden light reflecting on her face and dress. Hands are empty. Premium 3D storybook style, full-body transparent sprite, no coin, no piggy bank, no background, no text.',
  },
  {
    id: 'celebrate-exit',
    title: 'Celebrate Exit',
    filename: 'tanda-06-celebrate-exit.png',
    path: `${poseRoot}/tanda-06-celebrate-exit.png`,
    beat: 'She glides away after the memory is saved and the gift has started.',
    prompt:
      'Use the approved Tanda reference as strict identity. Create Tanda gliding away with a small proud smile and a gentle celebratory open-hand sparkle glow, no tooth in hand. Body angled upward as if exiting the scene. Preserve premium 3D storybook style, white airy dress, brown satchel, iridescent wings. Full-body centered transparent sprite, no background, no text.',
  },
  {
    id: 'wing-overlay',
    title: 'Optional Wing Overlay',
    filename: 'tanda-wing-overlay.png',
    path: `${poseRoot}/tanda-wing-overlay.png`,
    beat: 'Optional overlay for more natural wing flutter.',
    prompt:
      'Use the approved Tanda reference as strict style reference. Create only Tanda iridescent pastel wings as a transparent overlay sprite, matching the reference wings exactly in color, translucency, and premium 3D storybook lighting. No body, no face, no text, no background.',
  },
];
