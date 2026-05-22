import { getGlowFilter } from '@/lib/toothlight/glow-filters'

export type ToothlightSaveDraft = {
  childName?: string
  toothName?: string
  caption?: string
  imageSrc?: string | null
  glowId?: string
}

export type ToothlightSaveResult = {
  success: boolean
  toothlightId: string
  milestonePda: string
  childProfilePda: string
  imageUri: string
  metadataUri: string
  shareUrl: string
  status: 'demo' | 'adapter_unavailable' | 'saved'
}

export type SaveToothlightAdapter = {
  save: (input: {
    userId: string
    draft: Required<Pick<ToothlightSaveDraft, 'childName' | 'toothName' | 'caption' | 'glowId'>> &
      Pick<ToothlightSaveDraft, 'imageSrc'>
  }) => Promise<ToothlightSaveResult>
}

export function validateToothlightDraft(draft: ToothlightSaveDraft) {
  const childName = cleanText(draft.childName, 40) || 'Your child'
  const toothName = cleanText(draft.toothName, 44) || 'Toothlight'
  const caption = cleanText(draft.caption, 180) || 'A small tooth became a bright memory.'
  const glow = getGlowFilter(draft.glowId)

  return {
    childName,
    toothName,
    caption,
    imageSrc: draft.imageSrc ?? null,
    glowId: glow.id,
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
    imageUri: validated.imageSrc ?? 'https://example.test/toothlight-image.png',
    metadataUri: 'https://example.test/toothlight-metadata.json',
    shareUrl: '/toothlight/t/demo-toothlight',
    status: 'demo',
  }
}

function cleanText(value: string | undefined, maxLength: number) {
  return value?.replace(/\s+/g, ' ').trim().slice(0, maxLength) ?? ''
}
