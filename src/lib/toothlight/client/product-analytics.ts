'use client'

export const TOOTHLIGHT_VISITOR_ID_KEY = 'toothlight:visitor-id'
export const TOOTHLIGHT_SESSION_ID_KEY = 'toothlight:session-id'
export const TOOTHLIGHT_VISITOR_COOKIE = 'tfn_visitor_id'

type AnalyticsProperties = Record<string, unknown>

const CRAWLER_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /discordbot/i,
]

const AI_CRAWLER_PATTERNS = [
  /gptbot/i,
  /chatgpt-user/i,
  /oai-searchbot/i,
  /claudebot/i,
  /claude-searchbot/i,
  /anthropic-ai/i,
  /perplexitybot/i,
  /bytespider/i,
  /ccbot/i,
]

const AGENT_PATTERNS = [/headlesschrome/i, /playwright/i, /puppeteer/i, /selenium/i, /codex/i]

export function getOrCreateToothlightVisitorId() {
  return getOrCreateStoredId(TOOTHLIGHT_VISITOR_ID_KEY, 'v')
}

export function getOrCreateToothlightSessionId() {
  return getOrCreateStoredId(TOOTHLIGHT_SESSION_ID_KEY, 's', true)
}

export function classifyBrowserForAnalytics(userAgent = browserUserAgent()) {
  const webdriver = typeof navigator !== 'undefined' && navigator.webdriver
  if (webdriver || AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) return 'codex_agent'
  if (AI_CRAWLER_PATTERNS.some((pattern) => pattern.test(userAgent))) return 'ai_bot'
  if (CRAWLER_PATTERNS.some((pattern) => pattern.test(userAgent))) return 'crawler'
  return 'human_like'
}

export function buildToothlightAnalyticsProperties(properties: AnalyticsProperties = {}) {
  if (typeof window === 'undefined') return properties

  const visitorId = getOrCreateToothlightVisitorId()
  const sessionId = getOrCreateToothlightSessionId()
  const botCategory = classifyBrowserForAnalytics()
  setAnalyticsCookie(visitorId)

  return {
    ...properties,
    path: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer || null,
    title: document.title || null,
    userAgent: browserUserAgent(),
    screen: screenSize(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    visitorId,
    sessionId,
    botCategory,
  }
}

export function trackToothlightEvent(eventName: string, properties: AnalyticsProperties = {}) {
  if (typeof window === 'undefined') return
  if (!shouldTrackCurrentPage()) return

  const enrichedProperties = buildToothlightAnalyticsProperties(properties)
  const payload = {
    eventName,
    visitorId: enrichedProperties.visitorId,
    sessionId: enrichedProperties.sessionId,
    botCategory: enrichedProperties.botCategory,
    properties: enrichedProperties,
  }

  const body = JSON.stringify(payload)
  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon('/api/toothlight/events', new Blob([body], { type: 'application/json' }))
    if (sent) return
  }

  void fetch('/api/toothlight/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}

function getOrCreateStoredId(key: string, prefix: string, session = false) {
  const storage = session ? window.sessionStorage : window.localStorage
  const existing = storage.getItem(key)
  if (existing) return existing
  const id = `${prefix}_${createToothlightAnalyticsId()}`
  storage.setItem(key, id)
  return id
}

function createToothlightAnalyticsId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 12)
  return `${timestamp}-${random}`
}

function setAnalyticsCookie(visitorId: string) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${TOOTHLIGHT_VISITOR_COOKIE}=${encodeURIComponent(visitorId)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
}

function shouldTrackCurrentPage() {
  const { hostname, pathname } = window.location
  return (
    hostname.includes('toothfairy') ||
    pathname === '/' ||
    pathname === '/certificate' ||
    pathname === '/create' ||
    pathname === '/pricing' ||
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname.startsWith('/capsule') ||
    pathname.startsWith('/family-note') ||
    pathname.startsWith('/toothlight') ||
    pathname.startsWith('/toothfairy')
  )
}

function browserUserAgent() {
  return typeof navigator === 'undefined' ? '' : navigator.userAgent || ''
}

function screenSize() {
  if (typeof window === 'undefined') return null
  return {
    width: window.screen?.width ?? null,
    height: window.screen?.height ?? null,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  }
}
