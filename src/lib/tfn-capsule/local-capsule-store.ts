import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type LocalCapsuleRecord = {
  capsuleId: string
  parentEmail: string
  consentAccepted: boolean
  childNickname: string
  toothDate: string
  toothType: string
  parentNote: string
  childPromptAnswer: string
  capsuleStyle: string
  fairyStamp: string
  unlockDate: string
  photoPreviewUrl: string | null
  savedAt: string
  storageMode: 'local_file_mvp'
}

const CAPSULE_ID_PATTERN = /^capsule-[a-zA-Z0-9-]{4,64}$/
const STORE_DIR = path.join(process.cwd(), '.data', 'tfn-capsules')

export function isValidCapsuleId(value: unknown): value is string {
  return typeof value === 'string' && CAPSULE_ID_PATTERN.test(value)
}

export async function saveLocalCapsule(input: unknown) {
  const record = normalizeCapsuleRecord(input)
  await mkdir(STORE_DIR, { recursive: true })
  await writeFile(capsulePath(record.capsuleId), JSON.stringify(record, null, 2), 'utf8')
  return record
}

export async function readLocalCapsule(capsuleId: string) {
  if (!isValidCapsuleId(capsuleId)) return null

  try {
    const raw = await readFile(capsulePath(capsuleId), 'utf8')
    return normalizeCapsuleRecord(JSON.parse(raw))
  } catch {
    return null
  }
}

function normalizeCapsuleRecord(input: unknown): LocalCapsuleRecord {
  const value = isRecord(input) ? input : {}
  const capsuleId = value.capsuleId
  if (!isValidCapsuleId(capsuleId)) {
    throw new Error('Invalid capsule id')
  }

  return {
    capsuleId,
    parentEmail: truncateText(value.parentEmail, 160),
    consentAccepted: value.consentAccepted === true,
    childNickname: truncateText(value.childNickname, 80),
    toothDate: truncateText(value.toothDate, 24),
    toothType: truncateText(value.toothType, 60),
    parentNote: truncateText(value.parentNote, 800),
    childPromptAnswer: truncateText(value.childPromptAnswer, 800),
    capsuleStyle: truncateText(value.capsuleStyle, 60),
    fairyStamp: truncateText(value.fairyStamp, 60),
    unlockDate: truncateText(value.unlockDate, 24),
    photoPreviewUrl: normalizePhotoPreview(value.photoPreviewUrl),
    savedAt: truncateText(value.savedAt, 40) || new Date().toISOString(),
    storageMode: 'local_file_mvp',
  }
}

function capsulePath(capsuleId: string) {
  return path.join(STORE_DIR, `${capsuleId}.json`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function truncateText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function normalizePhotoPreview(value: unknown) {
  if (typeof value !== 'string') return null
  if (!value.startsWith('data:image/')) return null
  return value.slice(0, 1_500_000)
}
