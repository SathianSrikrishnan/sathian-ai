import {
  LIGHT_STYLE_VERSION,
  getLightStyle,
} from '@/lib/toothlight/visual-treatments'

export type ToothlightSaveDraft = {
  childName?: string
  toothName?: string
  caption?: string
  imageSrc?: string | null
  sourceImageSrc?: string | null
  artworkImageSrc?: string | null
  drawingLayerImageSrc?: string | null
  renderedImageSrc?: string | null
  aiRenderedImageSrc?: string | null
  glowId?: string
  treatmentId?: string
  treatmentVersion?: string
}

export type ToothlightSaveResult = {
  success: boolean
  toothlightId: string
  milestonePda: string
  childProfilePda: string
  imageUri: string
  sourceImageUri?: string
  artworkImageUri?: string
  drawingLayerImageUri?: string
  renderedImageUri?: string
  metadataUri: string
  shareUrl: string
  treatmentId?: string
  treatmentVersion?: string
  status: 'demo' | 'adapter_unavailable' | 'saved'
}

export type SaveToothlightAdapter = {
  save: (input: {
    userId: string
    draft: Required<Pick<ToothlightSaveDraft, 'childName' | 'toothName' | 'caption' | 'glowId'>> &
      Pick<
        ToothlightSaveDraft,
        | 'imageSrc'
        | 'sourceImageSrc'
        | 'artworkImageSrc'
        | 'drawingLayerImageSrc'
        | 'renderedImageSrc'
        | 'aiRenderedImageSrc'
        | 'treatmentId'
        | 'treatmentVersion'
      >
  }) => Promise<ToothlightSaveResult>
}

export function validateToothlightDraft(draft: ToothlightSaveDraft) {
  const childName = cleanText(draft.childName, 40) || 'Your child'
  const toothName = cleanText(draft.toothName, 44) || 'Toothlight'
  const caption = cleanText(draft.caption, 180) || 'A small tooth became a bright memory.'
  const treatment = getLightStyle(draft.treatmentId ?? draft.glowId)
  const sourceImageSrc = draft.sourceImageSrc ?? draft.imageSrc ?? null
  const artworkImageSrc = draft.artworkImageSrc ?? null
  const drawingLayerImageSrc = draft.drawingLayerImageSrc ?? null
  const renderedImageSrc = draft.aiRenderedImageSrc ?? draft.renderedImageSrc ?? draft.imageSrc ?? sourceImageSrc
  const treatmentVersion = cleanText(draft.treatmentVersion, 40) || LIGHT_STYLE_VERSION

  return {
    childName,
    toothName,
    caption,
    imageSrc: renderedImageSrc,
    sourceImageSrc,
    artworkImageSrc,
    drawingLayerImageSrc,
    renderedImageSrc,
    glowId: treatment.id,
    treatmentId: treatment.id,
    treatmentVersion,
  }
}

export async function saveToothlightDraft({
  userId,
  draft,
  adapter,
}: {
  userId: string
  draft: ToothlightSaveDraft
  adapter?: SaveToothlightAdapter
}) {
  const validated = validateToothlightDraft(draft)

  if (!adapter) {
    return {
      success: false,
      toothlightId: 'adapter-unavailable',
      milestonePda: '',
      childProfilePda: '',
      imageUri: '',
      metadataUri: '',
      shareUrl: '',
      status: 'adapter_unavailable' as const,
    }
  }

  return adapter.save({ userId, draft: validated })
}

export function demoSaveToothlight(draft: ToothlightSaveDraft): ToothlightSaveResult {
  const validated = validateToothlightDraft(draft)
  return {
    success: true,
    toothlightId: 'demo-toothlight',
    milestonePda: 'demo-milestone-pda',
    childProfilePda: 'demo-child-profile-pda',
    imageUri: validated.renderedImageSrc ?? 'https://example.test/toothlight-image.png',
    sourceImageUri: validated.sourceImageSrc ?? undefined,
    artworkImageUri: validated.artworkImageSrc ?? undefined,
    drawingLayerImageUri: validated.drawingLayerImageSrc ?? undefined,
    renderedImageUri: validated.renderedImageSrc ?? undefined,
    metadataUri: 'https://example.test/toothlight-metadata.json',
    shareUrl: '/toothlight/t/demo-toothlight',
    treatmentId: validated.treatmentId,
    treatmentVersion: validated.treatmentVersion,
    status: 'demo',
  }
}

function cleanText(value: string | undefined, maxLength: number) {
  return value?.replace(/\s+/g, ' ').trim().slice(0, maxLength) ?? ''
}
