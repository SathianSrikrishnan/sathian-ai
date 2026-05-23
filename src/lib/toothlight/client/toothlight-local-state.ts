import type { FamilyNodeKind, FutureNoteStatus } from '@/lib/toothlight/toothlight-states'

export const TOOTHLIGHT_DRAFT_STORAGE_KEY = 'toothlight:v4:draft'
const SAVED_TOOTHLIGHT_STORAGE_PREFIX = 'toothlight:v4:saved:'
const FUTURE_NOTE_STORAGE_PREFIX = 'toothlight:v4:future-note:'
const FAMILY_STORAGE_PREFIX = 'toothlight:v4:family:'

export type LocalToothlight = {
  toothlightId: string
  childName: string
  toothName: string
  caption: string
  imageSrc: string | null
  sourceImageSrc?: string | null
  renderedImageSrc?: string | null
  glowId: string
  treatmentId?: string
  treatmentVersion?: string
  shareUrl: string
  savedAt: string
}

export type LocalFutureNote = {
  toothlightId: string
  status: FutureNoteStatus
  unlockAge: number
  updatedAt: string
}

export type LocalFamilyContribution = {
  id: string
  toothlightId: string
  contributorName: string
  nodeKind: FamilyNodeKind
  noteOnly: boolean
  createdAt: string
}

export function saveLocalToothlight(toothlight: LocalToothlight) {
  writeJson(`${SAVED_TOOTHLIGHT_STORAGE_PREFIX}${toothlight.toothlightId}`, toothlight)
}

export function readLocalToothlight(toothlightId: string): LocalToothlight | null {
  return readJson<LocalToothlight>(`${SAVED_TOOTHLIGHT_STORAGE_PREFIX}${toothlightId}`)
}

export function saveLocalFutureNote(note: LocalFutureNote) {
  writeJson(`${FUTURE_NOTE_STORAGE_PREFIX}${note.toothlightId}`, note)
}

export function readLocalFutureNote(toothlightId: string): LocalFutureNote | null {
  return readJson<LocalFutureNote>(`${FUTURE_NOTE_STORAGE_PREFIX}${toothlightId}`)
}

export function saveLocalFamilyContribution(contribution: LocalFamilyContribution) {
  const key = `${FAMILY_STORAGE_PREFIX}${contribution.toothlightId}`
  const current = readLocalFamilyContributions(contribution.toothlightId)
  writeJson(key, [...current.filter((item) => item.id !== contribution.id), contribution])
}

export function readLocalFamilyContributions(toothlightId: string): LocalFamilyContribution[] {
  return readJson<LocalFamilyContribution[]>(`${FAMILY_STORAGE_PREFIX}${toothlightId}`) ?? []
}

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    window.localStorage.removeItem(key)
    return null
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}
