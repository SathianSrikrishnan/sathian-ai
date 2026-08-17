import type { WebsiteTrafficMetrics } from './daily-report'

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'

export interface AnalyticsBatchResponse {
  reports?: Array<{
    rows?: Array<{
      dimensionValues?: Array<{ value?: string }>
      metricValues?: Array<{ value?: string }>
    }>
  }>
}

interface AnalyticsRequest {
  dateRanges: Array<{ startDate: string; endDate: string; name?: string }>
  metrics: Array<{ name: string }>
  dimensions?: Array<{ name: string }>
  dimensionFilter?: {
    filter: {
      fieldName: string
      stringFilter: { matchType: 'EXACT'; value: string }
    }
  }
  orderBys?: Array<{ metric: { metricName: string }; desc: boolean }>
  limit?: string
}

export function createAssertionClaims(email: string, issuedAt: number) {
  return {
    iss: email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: GOOGLE_TOKEN_ENDPOINT,
    iat: issuedAt,
    exp: issuedAt + 3600,
  }
}

export function parseServiceAccountJson(value: string): { email: string; privateKey: string } {
  const parsed = JSON.parse(value) as { client_email?: string; private_key?: string }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Google service account credential is incomplete')
  }
  return { email: parsed.client_email, privateKey: parsed.private_key }
}

function metric(name: string): { name: string } {
  return { name }
}

function dimension(name: string): { name: string } {
  return { name }
}

function descendingMetric(name: string) {
  return { metric: { metricName: name }, desc: true }
}

export function buildSathianAnalyticsRequests(): AnalyticsRequest[] {
  const complete7 = [{ startDate: '8daysAgo', endDate: '2daysAgo' }]
  return [
    {
      metrics: [metric('activeUsers'), metric('sessions')],
      dateRanges: [
        { startDate: '8daysAgo', endDate: '2daysAgo', name: 'current7' },
        { startDate: '29daysAgo', endDate: '2daysAgo', name: 'baseline28' },
      ],
    },
    {
      dimensions: [dimension('sessionSource'), dimension('sessionMedium')],
      metrics: [metric('sessions')],
      dateRanges: complete7,
      orderBys: [descendingMetric('sessions')],
      limit: '8',
    },
    {
      dimensions: [dimension('landingPagePlusQueryString')],
      metrics: [metric('sessions')],
      dateRanges: complete7,
      orderBys: [descendingMetric('sessions')],
      limit: '8',
    },
    {
      dimensions: [dimension('eventName')],
      metrics: [metric('eventCount')],
      dateRanges: complete7,
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: { matchType: 'EXACT', value: 'agent_note_sent' },
        },
      },
    },
  ]
}

function numberAt(values: Array<{ value?: string }> | undefined, index: number): number {
  const value = Number(values?.[index]?.value ?? 0)
  return Number.isFinite(value) ? value : 0
}

function isNamedSource(source: string, medium: string): boolean {
  return !['(direct)', '(not set)', ''].includes(source)
    && !['(none)', '(not set)', ''].includes(medium)
}

export function parseSathianAnalyticsResponse(
  payload: AnalyticsBatchResponse,
): WebsiteTrafficMetrics {
  const reports = payload.reports ?? []
  const windows = new Map<string, { users: number; sessions: number }>()
  for (const row of reports[0]?.rows ?? []) {
    const name = row.dimensionValues?.[0]?.value
    if (!name) continue
    windows.set(name, {
      users: numberAt(row.metricValues, 0),
      sessions: numberAt(row.metricValues, 1),
    })
  }

  const namedSource = (reports[1]?.rows ?? []).find((row) => isNamedSource(
    row.dimensionValues?.[0]?.value ?? '',
    row.dimensionValues?.[1]?.value ?? '',
  ))
  const source = namedSource?.dimensionValues?.[0]?.value ?? null
  const medium = namedSource?.dimensionValues?.[1]?.value ?? null
  const landingPage = (reports[2]?.rows ?? []).find((row) => {
    const path = row.dimensionValues?.[0]?.value ?? ''
    return path !== '' && path !== '(not set)'
  })
  const current7 = windows.get('current7') ?? { users: 0, sessions: 0 }
  const baseline28 = windows.get('baseline28') ?? { users: 0, sessions: 0 }
  const landingPagePath = landingPage?.dimensionValues?.[0]?.value
    ?.split('?', 1)[0]
    .slice(0, 200) ?? null

  return {
    last7Users: current7.users,
    last7Sessions: current7.sessions,
    last28Users: baseline28.users,
    last28Sessions: baseline28.sessions,
    last7AgentNotes: numberAt(reports[3]?.rows?.[0]?.metricValues, 0),
    leadingSourceMedium: source && medium ? `${source} / ${medium}`.slice(0, 160) : null,
    leadingSourceSessions: numberAt(namedSource?.metricValues, 0),
    leadingLandingPage: landingPagePath,
    leadingLandingPageSessions: numberAt(landingPage?.metricValues, 0),
  }
}

function base64Url(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input
  let binary = ''
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index])
  }
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

function pemToBytes(pem: string): ArrayBuffer {
  const base64 = pem.replace(
    /-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,
    '',
  )
  const binary = atob(base64)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer
}

async function createSignedAssertion(email: string, privateKeyPem: string): Promise<string> {
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const issuedAt = Math.floor(Date.now() / 1000)
  const claims = base64Url(JSON.stringify(createAssertionClaims(email, issuedAt)))
  const unsigned = `${header}.${claims}`
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToBytes(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned),
  )
  return `${unsigned}.${base64Url(new Uint8Array(signature))}`
}

export async function getGoogleAccessToken(
  email: string,
  privateKeyPem: string,
  request: typeof fetch = fetch,
): Promise<string> {
  const assertion = await createSignedAssertion(email, privateKeyPem.replaceAll('\\n', '\n'))
  const response = await request(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!response.ok) throw new Error(`Google token request failed (${response.status})`)
  const payload: unknown = await response.json()
  if (
    !payload
    || typeof payload !== 'object'
    || typeof (payload as { access_token?: unknown }).access_token !== 'string'
  ) {
    throw new Error('Google token response did not include an access token')
  }
  return (payload as { access_token: string }).access_token
}

function isAnalyticsBatchResponse(value: unknown): value is AnalyticsBatchResponse {
  if (!value || typeof value !== 'object') return false
  const reports = (value as { reports?: unknown }).reports
  return reports === undefined || Array.isArray(reports)
}

export async function getSathianWebsiteTraffic(
  propertyId: string,
  accessToken: string,
  request: typeof fetch = fetch,
): Promise<WebsiteTrafficMetrics> {
  if (!/^\d{6,20}$/.test(propertyId)) throw new Error('Invalid GA4 property identifier')
  const response = await request(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ requests: buildSathianAnalyticsRequests() }),
    },
  )
  if (!response.ok) throw new Error(`GA4 query failed (${response.status})`)
  const payload: unknown = await response.json()
  if (!isAnalyticsBatchResponse(payload)) throw new Error('GA4 returned an invalid report contract')
  return parseSathianAnalyticsResponse(payload)
}
