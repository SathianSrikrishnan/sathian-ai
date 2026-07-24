export const STUDIO_ADMIN_ROLE = 'studio_admin'

export type StudioAal = 'aal1' | 'aal2' | null

type StudioAccessInput = {
  pathname: string
  hasUser?: boolean
  emailAllowed?: boolean
  hasStudioRole?: boolean
  aal?: StudioAal
}

export type StudioAccessDecision =
  | { kind: 'allow' }
  | { kind: 'redirect'; location: string }
  | { kind: 'deny'; status: 401 | 403; code: 'unauthorized' | 'forbidden' | 'mfa_required' }

type MagicLinkRequest = {
  email: string
}

type MagicLinkDependencies = {
  allowedEmails: ReadonlySet<string>
  publicOrigin: string
  signInWithOtp: (input: {
    email: string
    options: {
      shouldCreateUser: false
      emailRedirectTo: string
    }
  }) => Promise<{ error: unknown }>
}

const PRODUCTION_ORIGIN = 'https://studio.sathian.ai'
const LOCAL_STUDIO_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3120',
  'http://127.0.0.1:3120',
  'http://localhost:3121',
  'http://127.0.0.1:3121',
])

const PUBLIC_STUDIO_PATHS = new Set([
  '/studio/login',
  '/studio/auth/confirm',
  '/api/studio/auth',
])

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function isValidEmail(value: string) {
  return value.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeOrigin(value: string) {
  try {
    const url = new URL(value)
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      return null
    }
    return url.origin
  } catch {
    return null
  }
}

export function parseStudioAllowedEmails(value: string | undefined) {
  return new Set(
    (value ?? '')
      .split(',')
      .map(normalizeEmail)
      .filter(Boolean),
  )
}

export function isStudioEmailAllowed(
  email: string | null | undefined,
  allowedEmails: ReadonlySet<string>,
) {
  return Boolean(email && allowedEmails.has(normalizeEmail(email)))
}

export function hasStudioAdminRole(appMetadata: Record<string, unknown> | null | undefined) {
  return appMetadata?.role === STUDIO_ADMIN_ROLE
}

export function resolveStudioPublicOrigin({
  configuredOrigin,
  nodeEnv = process.env.NODE_ENV,
}: {
  configuredOrigin?: string
  nodeEnv?: string
} = {}) {
  if (nodeEnv === 'production') {
    if (!configuredOrigin) return PRODUCTION_ORIGIN
    return normalizeOrigin(configuredOrigin) === PRODUCTION_ORIGIN ? PRODUCTION_ORIGIN : null
  }

  if (!configuredOrigin) return 'http://localhost:3000'
  const normalized = normalizeOrigin(configuredOrigin)
  if (normalized === PRODUCTION_ORIGIN || (normalized && LOCAL_STUDIO_ORIGINS.has(normalized))) {
    return normalized
  }
  return null
}

export async function requestStudioMagicLink(
  request: MagicLinkRequest,
  dependencies: MagicLinkDependencies,
): Promise<{ kind: 'accepted' } | { kind: 'invalid_email' }> {
  const email = normalizeEmail(request.email)
  if (!isValidEmail(email)) return { kind: 'invalid_email' }

  // Return the same public result for allowed and unknown addresses so the
  // endpoint cannot be used to enumerate the private operator allowlist.
  if (!isStudioEmailAllowed(email, dependencies.allowedEmails)) {
    return { kind: 'accepted' }
  }

  await dependencies.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${dependencies.publicOrigin}/studio/auth/confirm`,
    },
  })

  return { kind: 'accepted' }
}

export function decideStudioAccess(input: StudioAccessInput): StudioAccessDecision {
  const isApi = input.pathname.startsWith('/api/studio/')
  if (PUBLIC_STUDIO_PATHS.has(input.pathname)) return { kind: 'allow' }

  if (!input.hasUser) {
    return isApi
      ? { kind: 'deny', status: 401, code: 'unauthorized' }
      : { kind: 'redirect', location: '/studio/login' }
  }

  if (!input.emailAllowed) {
    return isApi
      ? { kind: 'deny', status: 403, code: 'forbidden' }
      : { kind: 'redirect', location: '/studio/login?error=not_authorized' }
  }

  if (input.aal !== 'aal2') {
    if (input.pathname === '/studio/mfa') return { kind: 'allow' }
    return isApi
      ? { kind: 'deny', status: 403, code: 'mfa_required' }
      : { kind: 'redirect', location: '/studio/mfa' }
  }

  if (!input.hasStudioRole) {
    return isApi
      ? { kind: 'deny', status: 403, code: 'forbidden' }
      : { kind: 'redirect', location: '/studio/login?error=not_authorized' }
  }

  if (input.pathname === '/studio/mfa') {
    return { kind: 'redirect', location: '/studio' }
  }

  return { kind: 'allow' }
}
