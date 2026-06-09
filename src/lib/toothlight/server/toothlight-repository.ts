import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { FamilyNodeKind, FutureNoteStatus } from '@/lib/toothlight/toothlight-states'
import type { FamilyContributionInput } from './family-contributions'
import { validateFamilyContribution } from './family-contributions'
import type { FutureNoteSaveInput } from './future-notes'
import { validateFutureNote } from './future-notes'
import { encryptPrivateNote } from './private-notes'
import type { ToothlightSaveDraft } from './save-toothlight'
import { validateToothlightDraft } from './save-toothlight'

type RepositoryClient = SupabaseClient<any, 'public', any>

const CURRENT_TOOTHLIGHT_SAVE_SELECT =
  'id, child_name, tooth_name, caption, glow_id, image_uri, source_image_uri, artwork_image_uri, drawing_layer_image_uri, rendered_image_uri, treatment_id, treatment_version, created_at'

const LEGACY_TOOTHLIGHT_SAVE_SELECT =
  'id, child_name, tooth_name, caption, glow_id, image_uri, source_image_uri, rendered_image_uri, treatment_id, treatment_version, created_at'

const CURRENT_TOOTHLIGHT_SELECT =
  'id, child_name, tooth_name, caption, glow_id, image_uri, source_image_uri, artwork_image_uri, drawing_layer_image_uri, rendered_image_uri, treatment_id, treatment_version, created_at, smile_fund_status'

const LEGACY_TOOTHLIGHT_SELECT =
  'id, child_name, tooth_name, caption, glow_id, image_uri, source_image_uri, rendered_image_uri, treatment_id, treatment_version, created_at, smile_fund_status'

export type PersistedToothlight = {
  toothlightId: string
  childName: string
  toothName: string
  caption: string
  imageSrc: string | null
  sourceImageSrc: string | null
  artworkImageSrc: string | null
  drawingLayerImageSrc: string | null
  renderedImageSrc: string | null
  glowId: string
  treatmentId: string
  treatmentVersion: string
  shareUrl: string
  savedAt: string
  futureNoteStatus: FutureNoteStatus
  unlockAge: number
  smileFundStatus: 'none' | 'pending' | 'active'
  familyNodes: Array<{
    id: string
    contributorName: string
    nodeKind: FamilyNodeKind
    noteOnly: boolean
    createdAt: string
  }>
}

export function createSupabaseToothlightRepository(client = createServiceClient()) {
  return {
    savePersistedToothlight(input: { userId: string; draft: ToothlightSaveDraft }) {
      return savePersistedToothlight(input, client)
    },
    getPersistedToothlight(toothlightId: string) {
      return getPersistedToothlight(toothlightId, client)
    },
    savePersistedFutureNote(input: FutureNoteSaveInput & { userId: string }) {
      return savePersistedFutureNote(input, client)
    },
    savePersistedFamilyContribution(input: FamilyContributionInput) {
      return savePersistedFamilyContribution(input, client)
    },
  }
}

export async function savePersistedToothlight(
  { userId, draft }: { userId: string; draft: ToothlightSaveDraft },
  client = createServiceClient(),
) {
  if (!client) return null

  const validated = validateToothlightDraft(draft)
  const sourceImageUri = persistableImageUri(validated.sourceImageSrc)
  const artworkImageUri = persistableImageUri(validated.artworkImageSrc)
  const drawingLayerImageUri = persistableImageUri(validated.drawingLayerImageSrc)
  const renderedImageUri = persistableImageUri(validated.renderedImageSrc ?? validated.imageSrc)
  const { data, error } = await client
    .from('tfn_toothlights')
    .insert({
      user_id: userId,
      child_name: validated.childName,
      tooth_name: validated.toothName,
      caption: validated.caption,
      glow_id: validated.glowId,
      image_uri: renderedImageUri ?? sourceImageUri,
      source_image_uri: sourceImageUri,
      artwork_image_uri: artworkImageUri,
      drawing_layer_image_uri: drawingLayerImageUri,
      rendered_image_uri: renderedImageUri,
      treatment_id: validated.treatmentId,
      treatment_version: validated.treatmentVersion,
      layer_manifest: {
        version: 1,
        hasSourcePhoto: Boolean(sourceImageUri),
        hasArtworkComposite: Boolean(artworkImageUri),
        hasDrawingLayer: Boolean(drawingLayerImageUri),
        source: sourceImageUri ? 'source_image_uri' : null,
        artwork: artworkImageUri ? 'artwork_image_uri' : null,
        drawingLayer: drawingLayerImageUri ? 'drawing_layer_image_uri' : null,
        rendered: renderedImageUri ? 'rendered_image_uri' : null,
      },
      smile_fund_status: 'none',
      share_status: 'family_link',
      unlock_age: 10,
    })
    .select(CURRENT_TOOTHLIGHT_SAVE_SELECT)
    .single()

  if (error && isMissingColumnError(error)) {
    return savePersistedToothlightLegacy(
      { userId, validated, sourceImageUri, renderedImageUri },
      client,
    )
  }

  if (error) throw new Error(error.message)

  return {
    success: true,
    toothlightId: data.id,
    milestonePda: '',
    childProfilePda: '',
    imageUri: data.rendered_image_uri ?? data.image_uri ?? '',
    sourceImageUri: data.source_image_uri ?? undefined,
    artworkImageUri: data.artwork_image_uri ?? undefined,
    drawingLayerImageUri: data.drawing_layer_image_uri ?? undefined,
    renderedImageUri: data.rendered_image_uri ?? undefined,
    metadataUri: '',
    shareUrl: `/toothlight/t/${data.id}`,
    treatmentId: data.treatment_id ?? validated.treatmentId,
    treatmentVersion: data.treatment_version ?? validated.treatmentVersion,
    status: 'saved' as const,
  }
}

async function savePersistedToothlightLegacy(
  {
    userId,
    validated,
    sourceImageUri,
    renderedImageUri,
  }: {
    userId: string
    validated: ReturnType<typeof validateToothlightDraft>
    sourceImageUri: string | null
    renderedImageUri: string | null
  },
  client: RepositoryClient,
) {
  const { data, error } = await client
    .from('tfn_toothlights')
    .insert({
      user_id: userId,
      child_name: validated.childName,
      tooth_name: validated.toothName,
      caption: validated.caption,
      glow_id: validated.glowId,
      image_uri: renderedImageUri ?? sourceImageUri,
      source_image_uri: sourceImageUri,
      rendered_image_uri: renderedImageUri,
      treatment_id: validated.treatmentId,
      treatment_version: validated.treatmentVersion,
      smile_fund_status: 'none',
      share_status: 'family_link',
      unlock_age: 10,
    })
    .select(LEGACY_TOOTHLIGHT_SAVE_SELECT)
    .single()

  if (error) throw new Error(error.message)

  return {
    success: true,
    toothlightId: data.id,
    milestonePda: '',
    childProfilePda: '',
    imageUri: data.rendered_image_uri ?? data.image_uri ?? '',
    sourceImageUri: data.source_image_uri ?? undefined,
    artworkImageUri: undefined,
    drawingLayerImageUri: undefined,
    renderedImageUri: data.rendered_image_uri ?? undefined,
    metadataUri: '',
    shareUrl: `/toothlight/t/${data.id}`,
    treatmentId: data.treatment_id ?? validated.treatmentId,
    treatmentVersion: data.treatment_version ?? validated.treatmentVersion,
    status: 'saved' as const,
  }
}

export async function getPersistedToothlight(
  toothlightId: string,
  client = createServiceClient(),
): Promise<PersistedToothlight | null> {
  if (!client) return null

  const currentResult = await client
    .from('tfn_toothlights')
    .select(CURRENT_TOOTHLIGHT_SELECT)
    .eq('id', toothlightId)
    .maybeSingle()
  let toothlight: any = currentResult.data
  let error = currentResult.error

  if (error && isMissingColumnError(error)) {
    const legacyResult = await client
      .from('tfn_toothlights')
      .select(LEGACY_TOOTHLIGHT_SELECT)
      .eq('id', toothlightId)
      .maybeSingle()

    toothlight = legacyResult.data
    error = legacyResult.error
  }

  if (error) throw new Error(error.message)
  if (!toothlight) return null

  const [{ data: futureNote }, { data: familyNodes }] = await Promise.all([
    client
      .from('tfn_future_notes')
      .select('status, unlock_age, updated_at')
      .eq('toothlight_id', toothlightId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    client
      .from('tfn_family_contributions')
      .select('id, contributor_name, node_kind, gift_amount_cents, created_at')
      .eq('toothlight_id', toothlightId)
      .order('created_at', { ascending: true }),
  ])

  return {
    toothlightId: toothlight.id,
    childName: toothlight.child_name ?? 'Your child',
    toothName: toothlight.tooth_name ?? 'Toothlight',
    caption: toothlight.caption ?? 'A small tooth became a bright memory.',
    imageSrc: toothlight.rendered_image_uri ?? toothlight.image_uri ?? null,
    sourceImageSrc: toothlight.source_image_uri ?? toothlight.image_uri ?? null,
    artworkImageSrc: toothlight.artwork_image_uri ?? null,
    drawingLayerImageSrc: toothlight.drawing_layer_image_uri ?? null,
    renderedImageSrc: toothlight.rendered_image_uri ?? toothlight.image_uri ?? null,
    glowId: toothlight.glow_id ?? 'golden-locket',
    treatmentId: toothlight.treatment_id ?? toothlight.glow_id ?? 'golden-locket',
    treatmentVersion: toothlight.treatment_version ?? 'legacy-glow-v0',
    shareUrl: `/toothlight/t/${toothlight.id}`,
    savedAt: toothlight.created_at ?? new Date().toISOString(),
    futureNoteStatus: coerceFutureNoteStatus(futureNote?.status),
    unlockAge: Number(futureNote?.unlock_age ?? 10),
    smileFundStatus: coerceSmileFundStatus(toothlight.smile_fund_status),
    familyNodes: (familyNodes ?? []).map((node: any) => ({
      id: node.id,
      contributorName: node.contributor_name ?? 'Family',
      nodeKind: coerceFamilyNodeKind(node.node_kind),
      noteOnly: Number(node.gift_amount_cents ?? 0) <= 0,
      createdAt: node.created_at ?? new Date().toISOString(),
    })),
  }
}

export async function savePersistedFutureNote(
  input: FutureNoteSaveInput & { userId: string },
  client = createServiceClient(),
) {
  if (!client) return null

  const validated = validateFutureNote(input)
  const now = new Date().toISOString()
  const encryptedNote = encryptPrivateNote(validated.sealedText || validated.seedNote)
  const { data, error } = await client
    .from('tfn_future_notes')
    .upsert(
      {
        toothlight_id: input.toothlightId,
        user_id: input.userId,
        status: validated.status,
        seed_note: null,
        note_body_encrypted: encryptedNote,
        unlock_age: validated.unlockAge,
        sealed_at: validated.status === 'sealed' ? now : null,
        updated_at: now,
      },
      { onConflict: 'toothlight_id,user_id' },
    )
    .select('status, unlock_age')
    .single()

  if (error) throw new Error(error.message)

  return {
    success: true,
    status: coerceFutureNoteStatus(data.status),
    unlockAge: Number(data.unlock_age ?? validated.unlockAge),
  }
}

export async function savePersistedFamilyContribution(
  input: FamilyContributionInput,
  client = createServiceClient(),
) {
  if (!client) return null

  const validated = validateFamilyContribution(input)
  const encryptedNote = encryptPrivateNote(validated.noteText)
  const { data, error } = await client
    .from('tfn_family_contributions')
    .insert({
      toothlight_id: validated.toothlightId,
      contributor_name: validated.contributorName,
      node_kind: validated.nodeKind,
      note_status: validated.noteText ? 'seed' : 'none',
      note_body_encrypted: encryptedNote,
      gift_amount_cents: validated.giftAmountCents || null,
      gift_currency: 'USD',
      payment_status: validated.payment_status,
    })
    .select('id, contributor_name, node_kind, gift_amount_cents, payment_status, created_at')
    .single()

  if (error) throw new Error(error.message)

  return {
    success: true,
    contributionId: data.id,
    toothlightId: validated.toothlightId,
    contributorName: data.contributor_name ?? validated.contributorName,
    noteText: validated.noteText,
    giftAmountCents: Number(data.gift_amount_cents ?? 0),
    nodeKind: coerceFamilyNodeKind(data.node_kind),
    noteOnly: Number(data.gift_amount_cents ?? 0) <= 0,
    payment_status: data.payment_status ?? 'demo',
    createdAt: data.created_at ?? new Date().toISOString(),
  }
}

function createServiceClient(): RepositoryClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function persistableImageUri(imageSrc: string | null | undefined) {
  if (!imageSrc) return null
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc
  if (imageSrc.length < 180_000) return imageSrc
  return null
}

function isMissingColumnError(error: unknown) {
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: unknown }).message ?? '')
      : String(error ?? '')

  return /column .* does not exist|could not find .* column/i.test(message)
}

function coerceFutureNoteStatus(value: unknown): FutureNoteStatus {
  return value === 'sealed' || value === 'seed' || value === 'started' ? value : 'none'
}

function coerceFamilyNodeKind(value: unknown): FamilyNodeKind {
  return value === 'family_gift' || value === 'family_note_gift' ? value : 'family_note'
}

function coerceSmileFundStatus(value: unknown): 'none' | 'pending' | 'active' {
  return value === 'pending' || value === 'active' ? value : 'none'
}
