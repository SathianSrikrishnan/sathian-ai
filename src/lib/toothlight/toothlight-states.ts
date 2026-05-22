export const TOOTHLIGHT_VISUAL_STATES = [
  'draft_glow',
  'spark',
  'note_started',
  'sealed',
  'smile_fund_active',
  'constellated',
] as const

export type ToothlightVisualState = (typeof TOOTHLIGHT_VISUAL_STATES)[number]

export type FutureNoteStatus = 'none' | 'seed' | 'started' | 'sealed'

export type FamilyNodeKind = 'family_note' | 'family_gift' | 'family_note_gift'

export type SmileFundStatus = 'none' | 'pending' | 'active'

export type ToothlightStateInput = {
  hasSourcePhoto?: boolean
  hasGlow?: boolean
  hasShortSeedNote?: boolean
  hasFullFutureNote?: boolean
  futureNoteStatus?: FutureNoteStatus
  smileFundStatus?: SmileFundStatus
  familyNodes?: FamilyNodeKind[]
}

export type ToothlightState = {
  visualState: ToothlightVisualState
  overlayState: ToothlightVisualState | null
  futureNoteStatus: FutureNoteStatus
  familyNodeKinds: FamilyNodeKind[]
  smileFundActive: boolean
  isConstellated: boolean
}

export function getToothlightVisualState(input: ToothlightStateInput = {}): ToothlightState {
  const familyNodeKinds = input.familyNodes ?? []
  const futureNoteStatus = resolveFutureNoteStatus(input)
  const smileFundActive = input.smileFundStatus === 'active'

  let visualState: ToothlightVisualState = 'draft_glow'

  if (futureNoteStatus === 'sealed') {
    visualState = 'sealed'
  } else if (futureNoteStatus === 'seed' || futureNoteStatus === 'started') {
    visualState = 'note_started'
  } else if (smileFundActive) {
    visualState = 'smile_fund_active'
  } else if (input.hasGlow || input.hasSourcePhoto) {
    visualState = 'spark'
  }

  return {
    visualState,
    overlayState: familyNodeKinds.length > 0 ? 'constellated' : null,
    futureNoteStatus,
    familyNodeKinds,
    smileFundActive,
    isConstellated: familyNodeKinds.length > 0,
  }
}

function resolveFutureNoteStatus(input: ToothlightStateInput): FutureNoteStatus {
  if (input.hasFullFutureNote || input.futureNoteStatus === 'sealed') {
    return 'sealed'
  }

  if (
    input.hasShortSeedNote ||
    input.futureNoteStatus === 'seed' ||
    input.futureNoteStatus === 'started'
  ) {
    return input.futureNoteStatus === 'started' ? 'started' : 'seed'
  }

  return 'none'
}
