import type { FamilyNodeKind, FutureNoteStatus } from '@/lib/toothlight/toothlight-states'

export const TOOTHLIGHT_DRAFT_STORAGE_KEY = 'toothlight:v4:draft'
const SAVED_TOOTHLIGHT_STORAGE_PREFIX = 'toothlight:v4:saved:'
const FUTURE_NOTE_STORAGE_PREFIX = 'toothlight:v4:future-note:'
const FAMILY_STORAGE_PREFIX = 'toothlight:v4:family:'
const DRAFT_MEDIA_DB_NAME = 'toothlight-v4-draft-media'
const DRAFT_MEDIA_DB_VERSION = 1
const DRAFT_MEDIA_STORE = 'media'
const DRAFT_AI_RENDER_OPTIONS_FIELD = 'aiRenderOptions'
const DRAFT_AI_RENDER_OPTION_MEDIA_PREFIX = 'aiRenderOption:'
const DRAFT_MEDIA_FIELDS = [
  'sourceImageSrc',
  'photoImageSrc',
  'artworkImageSrc',
  'drawingLayerImageSrc',
  'renderedImageSrc',
  'aiRenderedImageSrc',
] as const

type DraftMediaField = (typeof DRAFT_MEDIA_FIELDS)[number]
type DraftLike = Record<string, unknown>
type DraftAiRenderOptionLike = Record<string, unknown> & {
  id?: unknown
  imageSrc?: unknown
}

export type LocalToothlight = {
  toothlightId: string
  childName: string
  toothName: string
  caption: string
  imageSrc: string | null
  sourceImageSrc?: string | null
  artworkImageSrc?: string | null
  drawingLayerImageSrc?: string | null
  renderedImageSrc?: string | null
  aiRenderedImageSrc?: string | null
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

export async function saveToothlightDraftToBrowser<TDraft extends DraftLike>(draft: TDraft) {
  if (typeof window === 'undefined') return

  await persistDraftMedia(draft)
  const compactDraft = stripDraftMediaForLocalStorage(draft)

  try {
    window.localStorage.setItem(TOOTHLIGHT_DRAFT_STORAGE_KEY, JSON.stringify(compactDraft))
  } catch {
    try {
      window.localStorage.setItem(
        TOOTHLIGHT_DRAFT_STORAGE_KEY,
        JSON.stringify(stripDraftMediaForLocalStorage(compactDraft)),
      )
    } catch {
      // Draft persistence should never crash the creation flow.
    }
  }
}

export async function readToothlightDraftFromBrowser<TDraft extends DraftLike>() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(TOOTHLIGHT_DRAFT_STORAGE_KEY)
    if (!raw) return null

    const storedDraft = JSON.parse(raw) as Partial<TDraft>
    const mediaDraft = await readDraftMedia<TDraft>(storedDraft)
    return { ...storedDraft, ...mediaDraft }
  } catch {
    window.localStorage.removeItem(TOOTHLIGHT_DRAFT_STORAGE_KEY)
    return null
  }
}

function stripDraftMediaForLocalStorage<TDraft extends DraftLike>(draft: TDraft) {
  const compactDraft = { ...draft } as Partial<TDraft>
  for (const field of DRAFT_MEDIA_FIELDS) {
    const value = compactDraft[field as keyof TDraft]
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      compactDraft[field as keyof TDraft] = null as TDraft[keyof TDraft]
    }
  }
  const aiRenderOptions = compactDraft[DRAFT_AI_RENDER_OPTIONS_FIELD as keyof TDraft]
  compactDraft[DRAFT_AI_RENDER_OPTIONS_FIELD as keyof TDraft] =
    stripDraftAiRenderOptionsForLocalStorage(aiRenderOptions) as TDraft[keyof TDraft]
  return compactDraft
}

function stripDraftAiRenderOptionsForLocalStorage(options: unknown) {
  if (!Array.isArray(options)) return options
  return options.map((option) => {
    if (!isRecord(option)) return option
    if (typeof option.imageSrc === 'string' && option.imageSrc.startsWith('data:image/')) {
      return { ...option, imageSrc: null }
    }
    return option
  })
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
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Local backups are useful, but must not block the primary server-backed flow.
  }
}

async function persistDraftMedia<TDraft extends DraftLike>(draft: TDraft) {
  const db = await openDraftMediaDb()
  if (!db) return

  try {
    const transaction = db.transaction(DRAFT_MEDIA_STORE, 'readwrite')
    const store = transaction.objectStore(DRAFT_MEDIA_STORE)

    for (const field of DRAFT_MEDIA_FIELDS) {
      const value = draft[field]
      if (typeof value === 'string' && value.startsWith('data:image/')) {
        store.put(value, field)
      } else if (value == null) {
        store.delete(field)
      }
    }

    for (const option of readDraftAiRenderOptions(draft)) {
      if (typeof option.id !== 'string') continue
      if (typeof option.imageSrc === 'string' && option.imageSrc.startsWith('data:image/')) {
        store.put(option.imageSrc, getDraftAiRenderOptionMediaKey(option.id))
      }
    }

    await waitForTransaction(transaction)
  } catch {
    // If IndexedDB is unavailable, the compact localStorage fallback still prevents crashes.
  } finally {
    db.close()
  }
}

async function readDraftMedia<TDraft extends DraftLike>(storedDraft: Partial<TDraft>) {
  const db = await openDraftMediaDb()
  const mediaDraft: Partial<TDraft> = {}
  if (!db) return mediaDraft

  try {
    const transaction = db.transaction(DRAFT_MEDIA_STORE, 'readonly')
    const store = transaction.objectStore(DRAFT_MEDIA_STORE)
    const entries = await Promise.all(
      DRAFT_MEDIA_FIELDS.map(async (field) => {
        const value = await requestResult<string>(store.get(field))
        return [field, value] as const
      }),
    )

    for (const [field, value] of entries) {
      if (typeof value === 'string') {
        mediaDraft[field as keyof TDraft] = value as TDraft[keyof TDraft]
      }
    }

    const restoredOptions = await Promise.all(
      readDraftAiRenderOptions(storedDraft as DraftLike).map(async (option) => {
        if (typeof option.id !== 'string') return option
        if (typeof option.imageSrc === 'string' && option.imageSrc.startsWith('data:image/')) {
          return option
        }
        const imageSrc = await requestResult<string>(
          store.get(getDraftAiRenderOptionMediaKey(option.id)),
        )
        return typeof imageSrc === 'string' ? { ...option, imageSrc } : option
      }),
    )

    if (restoredOptions.length > 0) {
      mediaDraft[DRAFT_AI_RENDER_OPTIONS_FIELD as keyof TDraft] =
        restoredOptions as TDraft[keyof TDraft]
    }

    await waitForTransaction(transaction)
  } catch {
    return {}
  } finally {
    db.close()
  }

  return mediaDraft
}

function readDraftAiRenderOptions(draft: DraftLike) {
  const options = draft[DRAFT_AI_RENDER_OPTIONS_FIELD]
  if (!Array.isArray(options)) return []
  return options.filter(isRecord) as DraftAiRenderOptionLike[]
}

function getDraftAiRenderOptionMediaKey(id: string) {
  return `${DRAFT_AI_RENDER_OPTION_MEDIA_PREFIX}${id}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function openDraftMediaDb() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null)
  }

  return new Promise<IDBDatabase | null>((resolve) => {
    const request = window.indexedDB.open(DRAFT_MEDIA_DB_NAME, DRAFT_MEDIA_DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(DRAFT_MEDIA_STORE)) {
        db.createObjectStore(DRAFT_MEDIA_STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null)
    request.onblocked = () => resolve(null)
  })
}

function requestResult<TValue>(request: IDBRequest<TValue>) {
  return new Promise<TValue | null>((resolve) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null)
  })
}

function waitForTransaction(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}
