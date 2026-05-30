import {
  TOOTHLIGHT_PRODUCT_RENDER_MODE_ID,
  toothlightProductRenderContract,
} from '@/lib/toothlight/product-render-mode'

export type ToothlightRenderModeId =
  | 'memory-polish'
  | 'story-artifact'
  | 'future-glow'
  | 'smile-wish'

export type ToothlightRenderMode = {
  id: ToothlightRenderModeId
  label: string
  shortLabel: string
  targetName: string
  intent: string
  visualThesis: string
  samsungReference: string
  providerStyleHint: string
  materialChangeTarget: string
  approvalQuestion: string
  prompt: string
  negativePrompt: string
  preservationRules: string[]
  evaluationChecks: string[]
  drawingRead: string
  transformSignature: string
  failureState: string
  identityRisk: 'low' | 'medium' | 'high'
}

export type ToothlightRenderSourceCandidate = {
  id: string
  label: string
  shortLabel: string
  sourcePhoto: string
  sourceAlt: string
  childName: string
  toothName: string
  caption: string
  plainSource: boolean
  sourceStatus: string
  mustKeep: string
  replacementAsk: string
}

export type ToothlightRenderRecommendation = {
  verdict: string
  title: string
  body: string
}

export type S24ReferenceFamily = {
  id: string
  label: string
  samsungStyles: string
  observedPattern: string
  toothlightUse: string
  rejectIf: string
}

export type RenderRoundStep = {
  step: string
  title: string
  status: string
  decision: string
}

export type RenderLabRoadmapStep = {
  time: string
  title: string
  yourJob: string
  myJob: string
  output: string
}

export type SamplePhotoAsk = {
  id: string
  label: string
  why: string
  requirements: string
}

export const renderLabSourceCandidates: ToothlightRenderSourceCandidate[] = [
  {
    id: 'plain-smile-stand-in',
    label: 'Plain smile close-up',
    shortLabel: 'Smile',
    sourcePhoto: '/story-assets/tooth-fairy/tf-02-wiggle.jpg',
    sourceAlt:
      'Temporary stand-in source image: a clean smile close-up without drawn-on annotations',
    childName: 'Kai',
    toothName: 'First Tooth',
    caption: 'Wiggly tooth smile close-up.',
    plainSource: true,
    sourceStatus:
      'Temporary stand-in. It is plain, but still illustrated; replace with a real child JPG before final approval.',
    mustKeep: 'Mouth shape, gap, face identity, room light, and the original photo crop.',
    replacementAsk:
      'Need real photo: front-facing smile close-up, no stickers, no filters, no drawing baked into the JPG.',
  },
  {
    id: 'parent-child-stand-in',
    label: 'Parent-child memory',
    shortLabel: 'Family',
    sourcePhoto: '/toothfairy/visual-system/hero-family-v1-no-spark.png',
    sourceAlt:
      'Temporary stand-in source image: parent and child portrait used only to test family-memory composition',
    childName: 'Kai',
    toothName: 'Family Toothlight',
    caption: 'Parent and child memory composition.',
    plainSource: false,
    sourceStatus:
      'Temporary stand-in. It contains a physical drawing in the scene, so it is not the clean approval source.',
    mustKeep: 'Both faces, relationship warmth, child expression, and photo composition.',
    replacementAsk: 'Need real photo: parent-child JPG with clear faces and no drawn layer baked in.',
  },
  {
    id: 'tooth-object-stand-in',
    label: 'Tooth object still',
    shortLabel: 'Object',
    sourcePhoto: '/toothfairy/visual-system/save-moment-v1.png',
    sourceAlt:
      'Temporary stand-in source image: tooth object and camera composition used only to test object-memory renders',
    childName: 'Kai',
    toothName: 'Tooth In Hand',
    caption: 'Object memory composition.',
    plainSource: false,
    sourceStatus:
      'Temporary stand-in. This is for object-composition testing, not child-identity approval.',
    mustKeep: 'Tooth location, keepsake object, and source composition.',
    replacementAsk: 'Need real photo: tooth in hand or tooth on pillow JPG, no filter, no annotations.',
  },
]

export const renderLabSource = renderLabSourceCandidates[0]

export const renderLabApprovedProductModeId = TOOTHLIGHT_PRODUCT_RENDER_MODE_ID
export const renderLabApprovedProductPromptGuardrails =
  toothlightProductRenderContract.promptGuardrails.join(' ')

export const renderLabDrawingLayer = {
  drawingName: 'Sun, tooth-heart, cloud, roof, tree',
  sourceRule:
    'Input 2 must be a separate transparent drawing layer or clean drawing image. It should not be baked into Input 1.',
}

export const s24ReferenceFamilies: S24ReferenceFamily[] = [
  {
    id: 'three-d-charm',
    label: '3D Toothlight Charm',
    samsungStyles: '3D cartoon, 3D drawing, soft studio depth',
    observedPattern:
      'The strong S24 examples use whole scene/object reconstruction: a rough sketch becomes a finished 3D object with new lighting, material, shadows, and camera depth.',
    toothlightUse:
      'Best fit for Story Artifact. The photo becomes a polished keepsake object and the tooth drawing becomes raised enamel, glass, paper, or charm detail.',
    rejectIf:
      'Reject if it is a no overlay pass failure: raw child lines are merely sitting on top of the photo or the face is replaced.',
  },
  {
    id: 'pop-keepsake',
    label: 'Pop Keepsake',
    samsungStyles: 'Pop art, insta-toon, webtoon',
    observedPattern:
      'The best pop outputs rebuild color, edge language, poster rhythm, and background shape across the whole frame instead of tinting the old picture.',
    toothlightUse:
      'Use as a high-contrast comparison candidate for parents who want an obvious transformation while keeping the child recognizable.',
    rejectIf:
      'Reject if it looks like a social filter, avatar, sticker pack, or generic comic effect.',
  },
  {
    id: 'soft-storybook',
    label: 'Soft Storybook',
    samsungStyles: 'Soft illustration, illustration, watercolor, oil painting',
    observedPattern:
      'The good illustration outputs translate the input into a complete material system: paper, paint, clean shapes, surface texture, and softened light.',
    toothlightUse:
      'Best fit for Smile Wish and safer Memory Polish variants, especially when the source is intimate or emotionally tender.',
    rejectIf:
      'Reject if it blurs identity, smooths the tooth moment away, or becomes a generic storybook portrait.',
  },
  {
    id: 'time-capsule-glow',
    label: 'Time Capsule Glow',
    samsungStyles: 'Art nouveau, oil painting, cinematic illustration',
    observedPattern:
      'The more magical S24-style outputs work when light and material imply a new object, not when sparkles are placed over the existing photo.',
    toothlightUse:
      'Best fit for Future Glow. The child stays present-day while the unlock date is represented by glass, reflection, calendar geometry, and sealed-note light.',
    rejectIf:
      'Reject if it predicts a future face, ages the child, adds a career/life outcome, or turns into sci-fi wallpaper.',
  },
]

export const samplePhotoAsks: SamplePhotoAsk[] = [
  {
    id: 'smile-closeup',
    label: 'Smile close-up',
    why: 'This is the highest-trust test for identity and the lost tooth moment.',
    requirements: 'Plain JPG, natural light, no annotations, visible gap or loose tooth, face not heavily cropped.',
  },
  {
    id: 'face-memory',
    label: 'Face memory',
    why: 'This shows whether the render can preserve the child beyond the mouth area.',
    requirements: 'Plain JPG portrait or candid, clear face, real room context, no stickers or beauty filters.',
  },
  {
    id: 'tooth-object',
    label: 'Tooth object',
    why: 'This tests whether Story Artifact can become a magical object without identity risk.',
    requirements: 'Tooth in hand, tooth on pillow, or tooth beside a note. No prior AI treatment.',
  },
  {
    id: 'parent-child',
    label: 'Parent-child',
    why: 'This tests the emotional keepsake value and whether the mode can keep family context intact.',
    requirements: 'Plain JPG with both faces visible and no drawing baked into the image.',
  },
]

export const renderRoundPlan: RenderRoundStep[] = [
  {
    step: '01',
    title: 'Load clean inputs',
    status: 'Ready in lab',
    decision:
      'Use a plain local JPG for Input 1 and a separate child drawing layer for Input 2. The phone reference images stay private and are not committed.',
  },
  {
    step: '02',
    title: 'Generate real round',
    status: 'Next provider pass',
    decision:
      'Run four real images from the same source/drawing pair: Memory Polish, Story Artifact, Future Glow, and Smile Wish.',
  },
  {
    step: '03',
    title: 'Reject overlay failures',
    status: 'Approval gate',
    decision:
      'Reject any image where the whole frame does not materially change, the drawing is pasted unchanged, or the child is no longer recognizable.',
  },
  {
    step: '04',
    title: 'Pick product winner',
    status: 'Decision',
    decision:
      'Approve the mode that a parent immediately understands as worth saving, then reconnect only that path to /toothlight/make.',
  },
]

export const renderLabRoadmap: RenderLabRoadmapStep[] = [
  {
    time: '0-10 min',
    title: 'Load the clean pair',
    yourJob:
      'Pick one plain source photo and one separate drawing layer. Start with a smile close-up if you have it.',
    myJob:
      'Keep the lab focused on source, drawing, target mode, prompt, and output readiness.',
    output: 'A clean input pair we can judge without baked-in annotations.',
  },
  {
    time: '10-25 min',
    title: 'Choose the first serious target',
    yourJob:
      'Look at Story Artifact / 3D Toothlight Charm first, then Memory Polish as the trust control.',
    myJob:
      'Tune the prompt contract toward whole-image material transformation, not overlay treatment.',
    output: 'One primary direction and one control direction for real generation.',
  },
  {
    time: '25-45 min',
    title: 'Run or stage the real render round',
    yourJob:
      'Approve which source pair to render first. Do not worry about save, auth, or family notes yet.',
    myJob:
      'Wire the selected mode to the provider path or stage the exact generation payload if credentials block it.',
    output: 'A real output attempt or a generation-ready payload with no product-flow distractions.',
  },
  {
    time: '45-60 min',
    title: 'Decide what becomes product',
    yourJob:
      'Approve, reject, or request one prompt correction based on whether the parent would save it.',
    myJob:
      'Record the winning mode, failure cases, and the reconnect plan back into /toothlight/make.',
    output: 'A concrete product decision instead of another open-ended design loop.',
  },
]

export const renderLabGlobalRules = [
  'Preserve child identity, expression, skin tone, pose, tooth moment, and original memory context.',
  'The whole image must change materially through light, surface, depth, texture, and composition.',
  'The drawing is interpreted into the image language instead of being pasted unchanged.',
  'Reject generic filters, stickers, simple overlays, watermarks, unreadable text, or unrelated fantasy objects.',
]

export const recommendedDecisionPath: ToothlightRenderRecommendation[] = [
  {
    verdict: 'Approve first',
    title: 'Story Artifact / 3D Toothlight Charm',
    body:
      'This is the strongest product-value bet because it turns the memory into a Tooth Fairy Network object, not a decorated photo.',
  },
  {
    verdict: 'Run as control',
    title: 'Memory Polish / Pop Keepsake',
    body:
      'This keeps parent trust high and gives us a baseline for how much visible transformation is enough without losing the original photo.',
  },
  {
    verdict: 'Keep guarded',
    title: 'Future Glow / Time Capsule Glow',
    body:
      'Use only as a symbolic sealed-memory treatment. It must never age the child or imply a real future face.',
  },
  {
    verdict: 'Test gently',
    title: 'Smile Wish / Soft Storybook',
    body:
      'Worth testing for emotion, but reject anything that reads like dental prediction, tooth correction, or a clinical before-after.',
  },
]

export const renderLabModes: ToothlightRenderMode[] = [
  {
    id: 'memory-polish',
    label: 'Memory Polish',
    shortLabel: 'Polish',
    targetName: 'Polished Memory Relic',
    intent:
      'A Samsung/Galaxy-style AI photo edit that preserves the real photo but visibly transforms the whole image.',
    visualThesis:
      'Keep the source recognizable, but rebuild the frame with finished light, depth, surface texture, and tooth-focused material polish.',
    samsungReference: 'Pop Keepsake + soft illustration control',
    providerStyleHint: 'photo-preserving whole-frame remaster',
    materialChangeTarget:
      'Balanced exposure, dimensional light, locket-glass finish, subtle paper grain, and drawing marks converted into enamel reflections.',
    approvalQuestion:
      'Does this look like the same real memory transformed into something worth saving, or just a prettier filter?',
    drawingRead:
      'The child marks become raised enamel glints, soft rim light, and tiny memory reflections that follow the original idea without copying marker texture.',
    transformSignature:
      'real photo preserved; full-frame remaster; tooth area clarified; child drawing converted to enamel light',
    failureState:
      'Fails if it looks like a preset filter, leaves raw drawing lines pasted on top, or smooths away the tooth moment.',
    identityRisk: 'low',
    prompt:
      'Transform the real lost-tooth photo into a premium Toothlight keepsake while preserving child identity, expression, skin tone, camera angle, smile gap, tooth position, hand pose, room context, and the original memory. Make a full-image Galaxy-style edit: rebuild light across the whole frame, add soft depth, locket-glass material, warm paper grain, refined tooth highlights, and a finished keepsake surface. Interpret the separate child drawing layer as raised enamel, mint-gold reflections, tiny memory glints, and polished hand-made marks that belong to the image surface. The output must feel visibly AI-transformed and worth saving, not like a generic photo filter.',
    negativePrompt:
      'Do not replace the child, change facial features, hide the tooth, add stickers, paste the drawing unchanged, create a cartoon avatar, use generic filters, add text, add watermarks, or make the photo look unrelated to the original.',
    preservationRules: [
      'Keep the real child recognizable.',
      'Keep the original memory readable.',
      'Keep the tooth and smile gap visible.',
    ],
    evaluationChecks: [
      'Parent can still inspect the real photo.',
      'Whole frame feels materially polished.',
      'Drawing feels integrated as enamel light.',
    ],
  },
  {
    id: 'story-artifact',
    label: 'Story Artifact',
    shortLabel: 'Artifact',
    targetName: '3D Toothlight Charm',
    intent:
      'The child photo and drawing become a magical Tooth Fairy Network object or story-world artifact.',
    visualThesis:
      'This is the leading recommendation: the memory becomes a found object with material depth, not a photo with decorations.',
    samsungReference: '3D cartoon + 3D drawing + art nouveau object treatment',
    providerStyleHint: 'object reconstruction with identity-anchored photo surface',
    materialChangeTarget:
      'The source photo is transformed into an embedded surface inside a polished charm, field map, vellum relic, or toothlight glass object.',
    approvalQuestion:
      'Would a parent instantly understand this as the saved Toothlight object, not just an edited image?',
    drawingRead:
      'The child marks become map paths, etched charm lines, paper-cut geometry, enamel inlay, and small object details inside the artifact material.',
    transformSignature:
      'photo becomes artifact surface; drawing becomes network-map craft; memory reads as a story-world object',
    failureState:
      'Fails if the artifact ignores the real photo, hides the child, pastes raw drawings, or becomes an unrelated fantasy item.',
    identityRisk: 'medium',
    prompt:
      'Turn the source photo and separate child drawing layer into a Tooth Fairy Network story artifact. Preserve child identity, expression, tooth moment, photo composition, and the emotional source memory. Rebuild the entire image as a finished magical object: layered vellum, toothlight glass, paper-map edges, polished enamel, etched gold, soft mint-blue network paths, and tactile keepsake depth. The real photo should feel embedded into the object surface or memory relic, not pasted flat. Interpret the child drawing as crafted artifact details, map routes, raised ink, enamel inlay, paper cuts, and charm lines. Keep the lost-tooth moment central and emotionally clear.',
    negativePrompt:
      'Do not make a separate fantasy poster, do not replace the child, do not paste unchanged drawings, do not use stickers, generic filters, fake UI labels, heavy text, unreadable symbols, unrelated characters, or anything that obscures the tooth.',
    preservationRules: [
      'Keep the child and photo composition recognizable.',
      'Keep drawing meaning present through artifact materials.',
      'Keep the memory specific to the lost tooth.',
    ],
    evaluationChecks: [
      'Reads as a Tooth Fairy Network object.',
      'Drawing becomes part of the artifact language.',
      'Feels more valuable than a filter.',
    ],
  },
  {
    id: 'future-glow',
    label: 'Future Glow',
    shortLabel: 'Future',
    targetName: 'Time Capsule Glow',
    intent:
      'A symbolic time-capsule render that suggests the child growing into the unlock date without claiming to predict their real future face.',
    visualThesis:
      'The present child stays unchanged while sealed light, reflections, and date geometry make the memory feel stored for later.',
    samsungReference: 'Art nouveau + cinematic illustration + oil-painting light',
    providerStyleHint: 'symbolic time capsule, no age progression',
    materialChangeTarget:
      'Glass depth, sealed-note reflections, unlock-date glow, soft calendar geometry, and drawing marks converted into constellations.',
    approvalQuestion:
      'Does it feel like a sealed memory for the future without pretending to know who the child becomes?',
    drawingRead:
      'The child marks become constellation-like date paths, sealed note folds, gentle reflection lines, and future-window light.',
    transformSignature:
      'present child preserved; future is symbolic; unlock-date glow and capsule depth carry the transformation',
    failureState:
      'Fails if it ages the child, predicts a face, implies a career or outcome, or becomes generic sci-fi.',
    identityRisk: 'medium',
    prompt:
      'Create a symbolic Toothlight time-capsule render. Preserve child identity and the original memory exactly as the present-day source: face, expression, skin tone, smile gap, tooth moment, camera angle, and setting. Do not create or imply a future face prediction. Transform the whole image with sealed-glass depth, gentle time-capsule light, future-note reflections, soft calendar geometry, warm unlock-date glow, and layered surfaces that feel like a memory kept safe. Interpret the child drawing layer as constellations, folded-note paths, reflection lines, and signal marks that suggest growing memories without predicting appearance, personality, career, or life outcome.',
    negativePrompt:
      'Not a future face prediction. Do not age the child, change the face, imply a career, show an adult version, create a prophecy, add text, use stickers, paste drawings unchanged, or turn the image into a generic sci-fi filter.',
    preservationRules: [
      'Keep the present-day child unchanged.',
      'Show future only as symbolic light and capsule material.',
      'Keep parent trust clear.',
    ],
    evaluationChecks: [
      'No predicted future face appears.',
      'Unlock-date feeling is emotionally clear.',
      'Photo remains the real memory.',
    ],
  },
  {
    id: 'smile-wish',
    label: 'Smile Wish',
    shortLabel: 'Smile',
    targetName: 'Soft Storybook Smile',
    intent:
      'A gentle storybook full-smile/tooth-return visualization, not a medical or dental prediction.',
    visualThesis:
      'The real lost-tooth smile remains visible while the image becomes a warm picture-book wish about the tooth returning.',
    samsungReference: 'Soft illustration + watercolor + gentle webtoon',
    providerStyleHint: 'storybook transformation, no anatomy correction',
    materialChangeTarget:
      'Paper bloom, picture-book light, tiny symbolic tooth shapes, hand-made wish rays, and drawing marks converted into soft illustrated texture.',
    approvalQuestion:
      'Does it make the parent feel the tenderness of the wish without looking like dentistry or a fake repaired smile?',
    drawingRead:
      'The child marks become storybook rays, tooth-wish shapes, stitched smile arcs, and warm pencil glow around the real moment.',
    transformSignature:
      'smile hope visualized as story; no dental prediction; drawing becomes wish-light around the real moment',
    failureState:
      'Fails if it changes dental anatomy, fills the gap realistically, creates a medical before-after, or hides the lost-tooth memory.',
    identityRisk: 'high',
    prompt:
      'Make a gentle Storybook Smile Wish render from the lost-tooth photo. Preserve child identity, expression, real smile, smile gap, tooth moment, camera angle, and the original memory. Do not correct teeth or predict a medical outcome. Transform the whole image into a soft illustrated keepsake with warm paper bloom, picture-book light, hand-made wish rays, tiny symbolic tooth highlights, and tender full-smile symbolism around the real moment. Interpret the child drawing layer as pencil glow, stitched arcs, storybook rays, and soft painted marks that support the memory without replacing teeth or changing anatomy.',
    negativePrompt:
      'Not a dental prediction. Do not generate a medically accurate future smile, do not alter dental anatomy, do not fill the tooth gap realistically, do not promise tooth growth, do not paste stickers or raw drawing marks, do not add orthodontic imagery, do not change the child face, and do not hide the original lost-tooth memory.',
    preservationRules: [
      'Keep the real smile and gap visible.',
      'Make the wish symbolic and storybook.',
      'Avoid medical or dental prediction language.',
    ],
    evaluationChecks: [
      'Feels tender rather than clinical.',
      'Does not claim a real future smile.',
      'Parent understands the emotional save value.',
    ],
  },
]

export function getRenderLabMode(id: string | null | undefined) {
  return renderLabModes.find((mode) => mode.id === id) ?? renderLabModes[0]
}
