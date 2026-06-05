export type AiRenderStyleId =
  | 'tanda-glow'
  | 'storybook-ink'
  | 'watercolor-memory'
  | 'pencil-charm'
  | 'cartoon-3d'
  | 'tradition-magic'

export type VisualTreatment = {
  id: string
  label: string
  shortLabel: string
  accent: string
  secondaryAccent: string
  deepAccent: string
  cssClass: string
  effectClass: string
  swatchClass: string
  aiStyleId: AiRenderStyleId
  visualPromise: string
  preservationRule: string
  texture: string
  photoEffect: string
  drawingEffect: string
  aiTransformationBrief: string
  objectForm: string
  compositionDirective: string
  drawingIntegration: string
  storyMotifs: readonly string[]
  fairyCarryCue: string
  keeperName: string
  keeperObject: string
  keeperCue: string
  keeperImageSrc: string
  keeperImageAlt: string
  keeperImageFocus: string
  objectImageSrc: string
  objectImageAlt: string
  objectImageFocus: string
  storyHref: string
  renderIntensity: number
  storySymbol: string
  cssFilter: string
  canvasFilter: string
  brushAccent: string
  brushSecondaryAccent: string
  descriptionForInternalUse: string
}

export const LIGHT_STYLE_VERSION = 'product-renders-v3'
export const DEFAULT_VISUAL_TREATMENT_ID = 'golden-locket'

export const LIGHT_STYLE_TREATMENTS = [
  {
    id: 'golden-locket',
    label: 'Golden Locket',
    shortLabel: 'Locket',
    accent: '#F2BE4A',
    secondaryAccent: '#80D6C4',
    deepAccent: '#5E3A14',
    cssClass: 'goldenLocket',
    effectClass: 'effectLocketGlass',
    swatchClass: 'swatchLocket',
    aiStyleId: 'tanda-glow',
    visualPromise: 'Golden glass, warm bloom, keepsake shine.',
    preservationRule: 'Keep the real face, tooth moment, photo angle, and handmade meaning recognizable.',
    texture: 'soft locket glass, warm paper grain, tiny gold flecks',
    photoEffect:
      'Warm the full photo, lift highlights around the tooth/smile area, add translucent locket glass, golden edge shine, and subtle film grain.',
    drawingEffect:
      'Turn child strokes into raised gold-and-mint enamel lines with soft glow and tiny flecks, not raw marker pasted back.',
    aiTransformationBrief:
      'A polished memory-locket edit: golden glass over the whole photo, recognizable family moment, child marks remade as luminous enamel keepsake details.',
    objectForm:
      'round gold locket pendant with a visible bail, domed glass face, tiny rivets, and the real photo sealed under the glass',
    compositionDirective:
      'Center one round pendant at a three-quarter angle with real depth, cast shadow, and a clear rim; the source memory lives inside the locket window.',
    drawingIntegration:
      'Use the child drawing layer as structural information: turn large strokes into raised enamel paths around the rim and smaller marks into glowing inlay inside the glass.',
    storyMotifs: ['Tanda pouch stitch', 'moonlit tooth glint', 'keeper map dot'],
    fairyCarryCue:
      'Designed as the first Toothlight Tanda can hook onto her satchel and carry into the Network.',
    keeperName: 'Tanda',
    keeperObject: 'Corn drawing Toothlight',
    keeperCue: 'Satchel stitch and first Network light.',
    keeperImageSrc: '/story-assets/tanda/tf-05-tanda.png',
    keeperImageAlt: 'Tanda, the Tooth Fairy Network guide',
    keeperImageFocus: '50% 34%',
    objectImageSrc: '/toothlight/style-objects/product-renders/golden-locket-product.jpg',
    objectImageAlt: 'Rendered round golden locket Toothlight object',
    objectImageFocus: '50% 52%',
    storyHref: '/toothfairy/story/tanda',
    renderIntensity: 0.72,
    storySymbol: 'locket-halo',
    cssFilter: 'saturate(1.32) contrast(1.16) sepia(0.22) brightness(1.06)',
    canvasFilter: 'saturate(1.32) contrast(1.16) sepia(0.22) brightness(1.06)',
    brushAccent: '#E3A42F',
    brushSecondaryAccent: '#5CC8B2',
    descriptionForInternalUse:
      'Default memory-first treatment: a warm gold halo, subtle locket glass, and polished edge light without replacing the photo.',
  },
  {
    id: 'moon-window',
    label: 'Moon Window',
    shortLabel: 'Moon',
    accent: '#83BDF2',
    secondaryAccent: '#E7F7FF',
    deepAccent: '#17324D',
    cssClass: 'moonWindow',
    effectClass: 'effectMoonGlass',
    swatchClass: 'swatchMoon',
    aiStyleId: 'watercolor-memory',
    visualPromise: 'Blue night glass, silver marks, soft hush.',
    preservationRule: 'Keep skin tones, pose, room shape, and photo lighting recognizable.',
    texture: 'cool window light, faint frost, silver dust',
    photoEffect:
      'Cool the full scene into blue moonlight, deepen shadows, add frosted glass texture, faint window streaks, and silver light around bright details.',
    drawingEffect:
      'Convert child strokes into moonlit chalk, icy neon, and translucent silver-blue trails that feel drawn into the glass.',
    aiTransformationBrief:
      'A bedtime moon-window edit: the same photo becomes cool, glassy, hushed, and night-lit while child marks become silver-blue light drawings.',
    objectForm:
      'frosted moon-window nightlight with an arched silver frame, translucent glass pane, hanging loop, and quiet blue backlight',
    compositionDirective:
      'Build an arched window object, not a pendant: the photo appears as moonlit glass behind the frame, with visible frame bars and soft night shadow.',
    drawingIntegration:
      'Use the child drawing layer as structural information: convert strokes into frost etching, moonlit lead lines, and silver-blue trails on the glass surface.',
    storyMotifs: ['Kkachi magpie feather', 'rooftop sky path', 'small moon bead'],
    fairyCarryCue:
      'Designed as a window-light Kkachi could carry by a note ribbon across the rooftops.',
    keeperName: 'Kkachi',
    keeperObject: 'Feather-song line',
    keeperCue: 'Magpie feather, roof song, silver route.',
    keeperImageSrc: '/story-assets/characters/char-kkachi.png',
    keeperImageAlt: 'Kkachi, the magpie keeper',
    keeperImageFocus: '70% 42%',
    objectImageSrc: '/toothlight/style-objects/product-renders/moon-window-product.jpg',
    objectImageAlt: 'Rendered arched moon window Toothlight object',
    objectImageFocus: '50% 54%',
    storyHref: '/toothfairy/story/korea',
    renderIntensity: 0.76,
    storySymbol: 'moon-window',
    cssFilter: 'saturate(0.74) contrast(1.24) brightness(0.92) hue-rotate(188deg)',
    canvasFilter: 'saturate(0.74) contrast(1.24) brightness(0.92) hue-rotate(188deg)',
    brushAccent: '#5EA9E8',
    brushSecondaryAccent: '#CFF4FF',
    descriptionForInternalUse:
      'Bedtime treatment with silver-blue window light, quiet atmosphere, and a gentle tooth-focused glow.',
  },
  {
    id: 'storybook-velvet',
    label: 'Storybook Velvet',
    shortLabel: 'Velvet',
    accent: '#C16C8D',
    secondaryAccent: '#F0D79A',
    deepAccent: '#263D41',
    cssClass: 'storybookVelvet',
    effectClass: 'effectStorybookInk',
    swatchClass: 'swatchVelvet',
    aiStyleId: 'storybook-ink',
    visualPromise: 'Ink wash, paper tooth, picture-book grain.',
    preservationRule: 'Do not redraw the child or turn the moment into a new illustration.',
    texture: 'paper tooth, velvet vignette, hand-ink warmth',
    photoEffect:
      'Push the photo toward an ink-wash plate with lifted whites, graphite edges, paper tooth, softened color, and a hand-printed storybook surface.',
    drawingEffect:
      'Restyle child marks as imperfect ink, colored-pencil fill, and soft stamped lettering that belongs to the page.',
    aiTransformationBrief:
      'A picture-book plate edit: the real photo is visibly translated into paper, ink, and wash while keeping the person and scene recognizable.',
    objectForm:
      'storybook page charm with deckled paper edges, a velvet ribbon tab, pressed ink texture, and a small hanging cord',
    compositionDirective:
      'Make a tactile page object laid at a slight angle on paper, with the source memory printed into the page rather than placed in a round charm.',
    drawingIntegration:
      'Use the child drawing layer as structural information: transform marks into ink gutters, stamped page ornaments, margin creatures, and printed linework.',
    storyMotifs: ['Anna Bogle clover leaf', 'shelf-map line', 'keeper margin mark'],
    fairyCarryCue:
      'Designed as a page from the Toothlight story shelf that a keeper can fold, carry, and tuck into a book world.',
    keeperName: 'Anna Bogle',
    keeperObject: 'Clover-gold proof',
    keeperCue: 'Clover wrap, gold beside the memory.',
    keeperImageSrc: '/story-assets/characters/char-anna-bogle-v2.png',
    keeperImageAlt: 'Anna Bogle, the Irish keeper',
    keeperImageFocus: '50% 34%',
    objectImageSrc: '/toothlight/style-objects/product-renders/storybook-velvet-product.jpg',
    objectImageAlt: 'Rendered storybook page charm Toothlight object',
    objectImageFocus: '50% 52%',
    storyHref: '/toothfairy/story/anna-bogle',
    renderIntensity: 0.86,
    storySymbol: 'storybook-frame',
    cssFilter: 'saturate(0.58) contrast(1.34) sepia(0.38) brightness(1.04)',
    canvasFilter: 'saturate(0.58) contrast(1.34) sepia(0.38) brightness(1.04)',
    brushAccent: '#B75B7F',
    brushSecondaryAccent: '#F0D79A',
    descriptionForInternalUse:
      'A richer storybook finish with paper texture and velvet contrast while preserving the real memory underneath.',
  },
  {
    id: 'rainbow-room',
    label: 'Rainbow Room',
    shortLabel: 'Rainbow',
    accent: '#FF7862',
    secondaryAccent: '#62B8FF',
    deepAccent: '#27495A',
    cssClass: 'rainbowRoom',
    effectClass: 'effectPrismPop',
    swatchClass: 'swatchRainbow',
    aiStyleId: 'cartoon-3d',
    visualPromise: 'Prism pop, poster color, gel-marker shine.',
    preservationRule: 'Keep identity and composition; add color around the moment, not over the face.',
    texture: 'prism bloom, tiny confetti sparks, satin highlight',
    photoEffect:
      'Posterize color gently, add prism splits, saturated gel highlights, subtle halftone dots, and a bright studio-pop surface across the whole image.',
    drawingEffect:
      'Turn child marks into glossy gel-marker stickers with color-separated edges, inner shine, and playful dimensional lift.',
    aiTransformationBrief:
      'A high-energy prism-pop edit: the original photo becomes color-rich and graphic, with child marks remade as glossy dimensional gel shapes.',
    objectForm:
      'transparent tooth-shaped acrylic charm with candy-clear edges, thick gel highlights, and a small keyring loop',
    compositionDirective:
      'Use a bold tooth-shaped acrylic silhouette with the source memory visible through the clear center; avoid round locket framing.',
    drawingIntegration:
      'Use the child drawing layer as structural information: extrude strokes into neon tubes, gel ridges, prism seams, and color-separated acrylic inlays.',
    storyMotifs: ['Ratoncito Perez mouse seal', 'two-light receipt', 'confetti orbit'],
    fairyCarryCue:
      'Designed as a bright acrylic Toothlight token that can flash as fairies fly it through the Network.',
    keeperName: 'Ratoncito Perez',
    keeperObject: 'Stamped receipt',
    keeperCue: 'Mouse seal, two lights, proof of care.',
    keeperImageSrc: '/story-assets/ratoncito-perez/rp-02-mouse.png',
    keeperImageAlt: 'Ratoncito Perez, the mouse keeper',
    keeperImageFocus: '42% 72%',
    objectImageSrc: '/toothlight/style-objects/product-renders/rainbow-room-product.jpg',
    objectImageAlt: 'Rendered transparent acrylic tooth charm Toothlight object',
    objectImageFocus: '50% 55%',
    storyHref: '/toothfairy/story/ratoncito-perez',
    renderIntensity: 0.82,
    storySymbol: 'rainbow-orbit',
    cssFilter: 'saturate(1.58) contrast(1.17) brightness(1.05) hue-rotate(-12deg)',
    canvasFilter: 'saturate(1.58) contrast(1.17) brightness(1.05) hue-rotate(-12deg)',
    brushAccent: '#FF694F',
    brushSecondaryAccent: '#4CA8F0',
    descriptionForInternalUse:
      'A higher-energy child-facing treatment with rainbow bloom and small celebratory accents that do not cover faces.',
  },
  {
    id: 'pillow-spark',
    label: 'Pillow Spark',
    shortLabel: 'Spark',
    accent: '#F7D873',
    secondaryAccent: '#B08AF3',
    deepAccent: '#3B2B66',
    cssClass: 'pillowSpark',
    effectClass: 'effectPencilSpark',
    swatchClass: 'swatchSpark',
    aiStyleId: 'pencil-charm',
    visualPromise: 'Pencil charm, stitched texture, star dust.',
    preservationRule: 'Keep the child line placement recognizable while sparkle can recolor and polish the marks.',
    texture: 'stitched pillow light, pencil charm, star pinpricks',
    photoEffect:
      'Reduce the photo into soft colored-pencil contrast, add paper fibers, stitched pillow texture, warm star dust, and a handmade sketchbook finish.',
    drawingEffect:
      'Make child strokes look like layered colored pencil, stitched thread, and small star-pinned charm marks.',
    aiTransformationBrief:
      'A sketchbook charm edit: the real image turns tactile and pencil-textured while child marks become stitched, sparkling keepsake lines.',
    objectForm:
      'stitched pillow badge with quilted fabric, embroidered border, soft stuffed depth, and a small satin loop',
    compositionDirective:
      'Make a plush badge or pillow patch, not glass: the source memory is printed on fabric and slightly curved by stuffing.',
    drawingIntegration:
      'Use the child drawing layer as structural information: stitch the marks as thread, star knots, pencil embroidery, and tactile seams that visibly follow the drawing.',
    storyMotifs: ['Waraba threshold paw', 'amber edge light', 'bedtime sparkle pin'],
    fairyCarryCue:
      'Designed as a soft threshold badge a child could imagine resting beside the tooth before Waraba guards the edge of light.',
    keeperName: 'Waraba',
    keeperObject: 'Threshold stone',
    keeperCue: 'Amber paw-light at the border.',
    keeperImageSrc: '/story-assets/characters/char-waraba.png',
    keeperImageAlt: 'Waraba, the threshold keeper',
    keeperImageFocus: '50% 32%',
    objectImageSrc: '/toothlight/style-objects/product-renders/pillow-spark-product.jpg',
    objectImageAlt: 'Rendered stitched pillow badge Toothlight object',
    objectImageFocus: '50% 52%',
    storyHref: '/toothfairy/story/waraba-edge-light',
    renderIntensity: 0.78,
    storySymbol: 'pillow-star',
    cssFilter: 'saturate(1.2) contrast(1.24) brightness(1.1) sepia(0.14)',
    canvasFilter: 'saturate(1.2) contrast(1.24) brightness(1.1) sepia(0.14)',
    brushAccent: '#F3C94D',
    brushSecondaryAccent: '#A77BE8',
    descriptionForInternalUse:
      'A focused sparkle treatment for drawings and tooth closeups, with small sigil-like stars that frame rather than replace.',
  },
  {
    id: 'family-lantern',
    label: 'Family Lantern',
    shortLabel: 'Lantern',
    accent: '#E98A4B',
    secondaryAccent: '#67C99F',
    deepAccent: '#294B37',
    cssClass: 'familyLantern',
    effectClass: 'effectLanternPaper',
    swatchClass: 'swatchLantern',
    aiStyleId: 'tradition-magic',
    visualPromise: 'Lantern paper, mint shadow, future-note glow.',
    preservationRule: 'Keep the memory inspectable; make the time-capsule glow feel added by family.',
    texture: 'lantern paper, mint shadow, gift-note warmth',
    photoEffect:
      'Wrap the photo in warm lantern paper, amber falloff, mint shadow, vellum texture, and soft note-card depth.',
    drawingEffect:
      'Transform child marks into wax-pencil lantern light, paper-cut edges, and glowing note accents for later.',
    aiTransformationBrief:
      'A family-lantern edit: the same memory becomes warm, paper-lit, and time-capsule-like, with drawings remade as waxy lantern marks.',
    objectForm:
      'folded family lantern with vellum windows, warm inner light, note ribbon, sealed corner, and small family-node beads',
    compositionDirective:
      'Build a small paper lantern or folded keepsake cube with translucent sides; the photo glows from one vellum panel, not from a pendant.',
    drawingIntegration:
      'Use the child drawing layer as structural information: cut marks into glowing paper paths, wax-pencil edges, window seams, and tiny note-ribbon symbols.',
    storyMotifs: ['Daga mouse tracks', 'moon calendar square', 'family note ribbon'],
    fairyCarryCue:
      'Designed as the family-note Toothlight that Daga or Tanda can carry without opening before its time.',
    keeperName: 'Daga',
    keeperObject: 'Moon-calendar pawprints',
    keeperCue: 'One-year wish tracks and note ribbon.',
    keeperImageSrc: '/story-assets/daga-one-year-wish/site/story-06-daga-site-portrait.png',
    keeperImageAlt: 'Daga, the family-note keeper',
    keeperImageFocus: '68% 38%',
    objectImageSrc: '/toothlight/style-objects/product-renders/family-lantern-product.jpg',
    objectImageAlt: 'Rendered folded family lantern Toothlight object',
    objectImageFocus: '50% 54%',
    storyHref: '/toothfairy/story/daga-one-year-wish',
    renderIntensity: 0.74,
    storySymbol: 'family-lantern',
    cssFilter: 'saturate(1.28) contrast(1.14) sepia(0.28) brightness(1.03) hue-rotate(-8deg)',
    canvasFilter: 'saturate(1.28) contrast(1.14) sepia(0.28) brightness(1.03) hue-rotate(-8deg)',
    brushAccent: '#DD7C38',
    brushSecondaryAccent: '#51B885',
    descriptionForInternalUse:
      'A family-note and Smile Fund friendly treatment with lantern warmth, green shadow, and gentle future-facing polish.',
  },
] as const satisfies readonly VisualTreatment[]

export type VisualTreatmentId = (typeof LIGHT_STYLE_TREATMENTS)[number]['id']

const LEGACY_TREATMENT_ALIASES: Record<string, VisualTreatmentId> = {
  'keepsake-glow': 'golden-locket',
  nightlight: 'moon-window',
  'storybook-ink': 'storybook-velvet',
  'lucky-penny': 'family-lantern',
  'confetti-light': 'rainbow-room',
}

export const defaultVisualTreatment =
  LIGHT_STYLE_TREATMENTS.find((treatment) => treatment.id === DEFAULT_VISUAL_TREATMENT_ID) ??
  LIGHT_STYLE_TREATMENTS[0]

export function getRecommendedLightStyle() {
  return defaultVisualTreatment
}

export function getLightStyle(id: string | null | undefined) {
  const resolvedId = id ? LEGACY_TREATMENT_ALIASES[id] ?? id : undefined
  return LIGHT_STYLE_TREATMENTS.find((treatment) => treatment.id === resolvedId) ?? defaultVisualTreatment
}
