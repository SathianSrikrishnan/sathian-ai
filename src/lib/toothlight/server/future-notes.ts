export type FutureNoteSaveInput = {
  toothlightId: string
  seedNote?: string
  sealedText?: string
  unlockAge?: number
}

export type FutureNotePublicStatus = {
  toothlightId: string
  status: 'none' | 'seed' | 'started' | 'sealed'
  unlockAge: number
}

export function getDemoFutureNoteStatus(toothlightId: string): FutureNotePublicStatus {
  return {
    toothlightId,
    status: toothlightId === 'demo-toothlight' ? 'sealed' : 'none',
    unlockAge: 10,
  }
}

export function validateFutureNote(input: FutureNoteSaveInput) {
  const seedNote = clean(input.seedNote, 220)
  const sealedText = clean(input.sealedText, 2400)
  const unlockAge = [10, 12, 18].includes(Number(input.unlockAge)) ? Number(input.unlockAge) : 10
  const status: FutureNotePublicStatus['status'] = sealedText ? 'sealed' : seedNote ? 'seed' : 'none'

  return {
    toothlightId: input.toothlightId,
    seedNote,
    sealedText,
    unlockAge,
    status,
  }
}

export function getPublicFutureNoteStatus(input: FutureNoteSaveInput): FutureNotePublicStatus {
  const validated = validateFutureNote(input)
  return {
    toothlightId: validated.toothlightId,
    status: validated.status,
    unlockAge: validated.unlockAge,
  }
}

function clean(value: string | undefined, maxLength: number) {
  return value?.replace(/\s+/g, ' ').trim().slice(0, maxLength) ?? ''
}
