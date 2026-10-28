/**
 * Carries a Google Ads click id from a sathian.ai landing to the Tooth Fairy Network
 * gift site, so a purchase there can be credited to the ad click. Ids only; no visitor data.
 */
const AD_CLICK_KEYS = ['gclid', 'gbraid', 'wbraid'] as const
const STORAGE_PREFIX = 'sathian-ad-click-'
const GIFT_HOSTS = new Set([
  'toothfairy.money',
  'www.toothfairy.money',
  'toothfairy.network',
  'www.toothfairy.network',
])

export function rememberAdClick(search: string) {
  try {
    const params = new URLSearchParams(search)
    for (const key of AD_CLICK_KEYS) {
      const value = params.get(key)
      if (value) window.sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, value)
    }
  } catch {
    // Storage can be unavailable (private mode); attribution is best-effort.
  }
}

export function withAdClick(href: string, search = '', storage?: Pick<Storage, 'getItem'>): string {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return href
  }
  if (!GIFT_HOSTS.has(url.hostname)) return href

  const params = new URLSearchParams(search)
  for (const key of AD_CLICK_KEYS) {
    if (url.searchParams.has(key)) continue
    let value = params.get(key)
    if (!value) {
      try {
        value = storage?.getItem(`${STORAGE_PREFIX}${key}`) ?? null
      } catch {
        value = null
      }
    }
    if (value) url.searchParams.set(key, value)
  }
  return url.toString()
}

/** Click handler helper: rewrites the anchor's href just before navigation. */
export function applyAdClick(anchor: HTMLAnchorElement) {
  if (typeof window === 'undefined') return
  let storage: Storage | undefined
  try {
    storage = window.sessionStorage
  } catch {
    storage = undefined
  }
  const next = withAdClick(anchor.href, window.location.search, storage)
  if (next !== anchor.href) anchor.href = next
}
