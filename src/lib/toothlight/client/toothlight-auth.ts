export const TOOTHLIGHT_PENDING_SAVE_STORAGE_KEY = 'toothlight:v4:pending-save'

export function buildToothlightParentAuthUrl(nextPath: string) {
  return `/api/auth/google?next=${encodeURIComponent(nextPath)}`
}

export function isParentAuthRequired(status: number) {
  return status === 401
}

export function markToothlightSavePending() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOOTHLIGHT_PENDING_SAVE_STORAGE_KEY, 'true')
}

export function clearToothlightSavePending() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOOTHLIGHT_PENDING_SAVE_STORAGE_KEY)
}

export function hasToothlightSavePending() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(TOOTHLIGHT_PENDING_SAVE_STORAGE_KEY) === 'true'
}

export function redirectToToothlightParentAuth(nextPath: string) {
  if (typeof window === 'undefined') return
  markToothlightSavePending()
  window.location.assign(buildToothlightParentAuthUrl(nextPath))
}

export function shouldResumeToothlightSave(search: string) {
  const params = new URLSearchParams(search)
  return params.get('save') === '1' && params.get('returning') === 'auth'
}
