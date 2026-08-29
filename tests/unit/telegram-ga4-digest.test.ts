import { describe, expect, it } from 'vitest'

import {
  buildSathianAnalyticsRequests,
  createAssertionClaims,
  getGoogleAccessToken,
  getSathianWebsiteTraffic,
  parseSathianAnalyticsResponse,
  parseServiceAccountJson,
} from '../../workers/telegram-delivery/src/website-analytics'

const analyticsPayload = {
  reports: [
    {
      rows: [
        {
          dimensionValues: [{ value: 'current7' }],
          metricValues: [{ value: '19' }, { value: '57' }, { value: '35' }],
        },
        {
          dimensionValues: [{ value: 'previous7' }],
          metricValues: [{ value: '14' }, { value: '42' }, { value: '21' }],
        },
        {
          dimensionValues: [{ value: 'current28' }],
          metricValues: [{ value: '50' }, { value: '117' }, { value: '72' }],
        },
      ],
    },
    {
      rows: [
        {
          dimensionValues: [{ value: '(direct)' }, { value: '(none)' }],
          metricValues: [{ value: '35' }],
        },
        {
          dimensionValues: [{ value: 'luma' }, { value: 'referral' }],
          metricValues: [{ value: '14' }],
        },
      ],
    },
    {
      rows: [
        {
          dimensionValues: [{ value: '/writings?utm_source=luma' }],
          metricValues: [{ value: '26' }],
        },
      ],
    },
    {
      rows: [{ metricValues: [{ value: '1' }] }],
    },
  ],
}

describe('Sathian.ai GA4 digest query', () => {
  it('uses complete reporting windows and only content-free dimensions', () => {
    const requests = buildSathianAnalyticsRequests()

    expect(requests[0].dateRanges).toEqual([
      { startDate: '8daysAgo', endDate: '2daysAgo', name: 'current7' },
      { startDate: '15daysAgo', endDate: '9daysAgo', name: 'previous7' },
      { startDate: '29daysAgo', endDate: '2daysAgo', name: 'current28' },
    ])
    expect(requests[0].metrics).toEqual([
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'engagedSessions' },
    ])
    expect(requests[1].dimensions).toEqual([{ name: 'sessionSource' }, { name: 'sessionMedium' }])
    expect(requests[2].dimensions).toEqual([{ name: 'landingPagePlusQueryString' }])
    expect(requests[3].dimensions).toEqual([{ name: 'eventName' }])
    for (const request of requests) {
      expect(JSON.stringify(request.dimensionFilter)).toContain('hostName')
      expect(JSON.stringify(request.dimensionFilter)).toContain('sathian.ai')
    }
    expect(JSON.stringify(requests[3].dimensionFilter)).toContain('agent_note_sent')
    expect(JSON.stringify(requests)).not.toMatch(/userId|email|message|city/i)
  })

  it('prefers a named source over direct traffic and maps the leading page', () => {
    const result = parseSathianAnalyticsResponse(analyticsPayload)

    expect(result).toEqual({
      last7Users: 19,
      last7Sessions: 57,
      last7EngagedSessions: 35,
      previous7Users: 14,
      previous7Sessions: 42,
      last28Users: 50,
      last28Sessions: 117,
      last7AgentNotes: 1,
      leadingSourceMedium: 'luma / referral',
      leadingSourceSessions: 14,
      leadingLandingPage: '/writings',
      leadingLandingPageSessions: 26,
    })
  })

  it('requests only the configured Sathian property with a bearer token', async () => {
    let requestedUrl = ''
    let requestedInit: RequestInit | undefined
    const result = await getSathianWebsiteTraffic(
      '546120838',
      'read-only-token',
      async (input, init) => {
        requestedUrl = String(input)
        requestedInit = init
        return Response.json(analyticsPayload)
      },
    )

    expect(requestedUrl).toBe(
      'https://analyticsdata.googleapis.com/v1beta/properties/546120838:batchRunReports',
    )
    expect(new Headers(requestedInit?.headers).get('authorization')).toBe('Bearer read-only-token')
    const requests = JSON.parse(String(requestedInit?.body)).requests
    expect(requests).toHaveLength(4)
    expect(requests.every((request: { dimensionFilter?: unknown }) => (
      JSON.stringify(request.dimensionFilter).includes('sathian.ai')
    ))).toBe(true)
    expect(result.leadingSourceMedium).toBe('luma / referral')
  })
})

describe('read-only Google authentication', () => {
  it('creates a one-hour analytics-readonly assertion', () => {
    const claims = createAssertionClaims('reporter@example.com', 1_700_000_000)
    expect(claims.iss).toBe('reporter@example.com')
    expect(claims.scope).toBe('https://www.googleapis.com/auth/analytics.readonly')
    expect(claims.exp - claims.iat).toBe(3600)
  })

  it('extracts only the service-account email and private key', () => {
    expect(parseServiceAccountJson(JSON.stringify({
      client_email: 'reporter@example.com',
      private_key: 'private-key',
      project_id: 'ignored',
    }))).toEqual({
      email: 'reporter@example.com',
      privateKey: 'private-key',
    })
  })

  it('exchanges a signed assertion without exposing the private key', async () => {
    const pair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify'],
    )
    const keyBytes = new Uint8Array(await crypto.subtle.exportKey('pkcs8', pair.privateKey))
    const keyBase64 = Buffer.from(keyBytes).toString('base64').match(/.{1,64}/g)?.join('\n') ?? ''
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${keyBase64}\n-----END PRIVATE KEY-----`
    let requestBody = ''

    const token = await getGoogleAccessToken(
      'reporter@example.com',
      privateKey,
      async (_input, init) => {
        requestBody = String(init?.body)
        return Response.json({ access_token: 'read-only-token' })
      },
    )

    const form = new URLSearchParams(requestBody)
    expect(token).toBe('read-only-token')
    expect(form.get('grant_type')).toBe('urn:ietf:params:oauth:grant-type:jwt-bearer')
    expect(form.get('assertion')?.split('.')).toHaveLength(3)
    expect(requestBody).not.toContain(keyBase64)
  })
})
