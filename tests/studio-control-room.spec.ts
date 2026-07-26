import { expect, test, type BrowserContext, type Page } from 'playwright/test'

const FIRST_ID = '11111111-1111-4111-8111-111111111111'
const SECOND_ID = '22222222-2222-4222-8222-222222222222'

const operator = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'operator@example.com',
  app_metadata: { provider: 'email', providers: ['email'], role: 'studio_admin' },
  user_metadata: {},
  factors: [
    {
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      factor_type: 'totp',
      status: 'verified',
      created_at: '2026-07-14T12:00:00.000Z',
      updated_at: '2026-07-14T12:00:00.000Z',
    },
  ],
  identities: [],
  created_at: '2026-07-14T12:00:00.000Z',
  updated_at: '2026-07-14T12:00:00.000Z',
}

function base64Url(value: unknown) {
  return Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url')
}

function studioSessionCookie() {
  const now = Math.floor(Date.now() / 1000)
  const accessToken = [
    base64Url({ alg: 'HS256', typ: 'JWT' }),
    base64Url({
      sub: operator.id,
      email: operator.email,
      role: 'authenticated',
      aal: 'aal2',
      amr: [{ method: 'otp', timestamp: now }],
      app_metadata: operator.app_metadata,
      iat: now,
      exp: now + 3600,
    }),
    'test-signature',
  ].join('.')
  const session = {
    access_token: accessToken,
    refresh_token: 'studio-test-refresh-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    user: operator,
  }
  return `base64-${base64Url(session)}`
}

async function addStudioSession(context: BrowserContext) {
  await context.addCookies([
    {
      name: 'sb-localhost-auth-token',
      value: studioSessionCookie(),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ])
}

const homepageSections = [
  {
    id: FIRST_ID,
    key: 'hero',
    type: 'hero',
    label: 'Currently building',
    heading: 'Proof of work, in public.',
    description: 'Products and notes from the workbench.',
    ctaLabel: 'See the work',
    ctaHref: '/#now',
    enabled: true,
    position: 0,
    updatedAt: '2026-07-14T12:00:00.000Z',
  },
  {
    id: SECOND_ID,
    key: 'projects',
    type: 'projects',
    label: 'Now',
    heading: 'Three things with a pulse.',
    description: 'The projects receiving real attention.',
    ctaLabel: null,
    ctaHref: null,
    enabled: true,
    position: 1,
    updatedAt: '2026-07-14T12:00:00.000Z',
  },
]

async function mockControlRoomApi(page: Page, homepageMutations: unknown[] = []) {
  await page.route('**/api/studio/**', async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    if (request.method() === 'PATCH' || request.method() === 'POST') {
      homepageMutations.push(request.postDataJSON())
      await route.fulfill({ status: request.method() === 'POST' ? 201 : 200, contentType: 'application/json', body: JSON.stringify({ ok: true, id: FIRST_ID }) })
      return
    }

    const fixtures: Record<string, unknown> = {
      '/api/studio/overview': {
        writing: 4,
        buildNotes: 2,
        homepageSections: 7,
        publicMemory: 3,
        inbox: 1,
        operations: {
          completedTurns24h: 11,
          intakes24h: 3,
          modelErrors24h: 2,
          deliveryBacklog: 4,
          blockedUploads: 3,
          windowStartsAt: '2026-07-13T12:00:00.000Z',
        },
      },
      '/api/studio/articles': [
        { id: FIRST_ID, title: 'The Gap Between Weeks', slug: 'the-gap-between-weeks', date: '2026-07-14', status: 'published', readTime: '8 min' },
      ],
      '/api/studio/memory': [
        {
          id: FIRST_ID,
          slug: 'tooth-fairy-network',
          title: 'Tooth Fairy Network',
          summary: 'A family memory ritual.',
          tags: ['project'],
          sourceRef: 'Projects/_knowledge/tooth-fairy-network.md',
          sourceKind: 'local_markdown',
          visibility: 'public',
          status: 'approved',
          validFrom: '2026-07-14T12:00:00.000Z',
          validUntil: '2026-12-31T23:59:00.000Z',
          approvedAt: '2026-07-14T12:00:00.000Z',
          updatedAt: '2026-07-14T12:00:00.000Z',
        },
      ],
      '/api/studio/inbox': [
        {
          id: FIRST_ID,
          receipt: 'A4E76C62',
          kind: 'mixed',
          displayName: 'A visitor',
          replyEmail: 'visitor@example.com',
          message: 'I would like to share a project note.',
          status: 'queued',
          createdAt: '2026-07-14T12:00:00.000Z',
          retentionUntil: '2027-01-10T12:00:00.000Z',
          delivery: { status: 'pending', attempts: 0, deliveredAt: null, nextAttemptAt: '2026-07-14T12:01:00.000Z' },
          attachments: [
            { id: SECOND_ID, filename: 'project-note.pdf', contentType: 'application/pdf', byteSize: 24576, status: 'quarantined', retentionUntil: '2026-08-13T12:00:00.000Z' },
          ],
        },
      ],
      '/api/studio/homepage': homepageSections,
      '/api/studio/build-notes': [
        {
          id: FIRST_ID,
          title: 'The chatbot becomes a doorway',
          slug: 'the-chatbot-becomes-a-doorway',
          project: 'sathian.ai',
          date: '2026-07-14',
          whatChanged: 'Removed the shared password.',
          whatLearned: 'Boundaries come before tools.',
          nextStep: 'Connect reviewed public memory.',
          status: 'published',
          publishedAt: '2026-07-14T12:00:00.000Z',
          updatedAt: '2026-07-14T12:00:00.000Z',
        },
      ],
    }
    const body = fixtures[path]
    await route.fulfill({ status: body ? 200 : 404, contentType: 'application/json', body: JSON.stringify(body ?? { error: 'not found' }) })
  })
}

test.describe('Studio typed control room', () => {
  test.beforeEach(async ({ context }) => {
    await addStudioSession(context)
  })

  test('shows all five work areas and recent writing without console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    await mockControlRoomApi(page)

    await page.goto('/studio')
    await expect(page.getByRole('heading', { name: 'One place to run the public site.' })).toBeVisible()
    for (const name of ['Writing', 'Build notes', 'Homepage', 'Public memory', 'Inbox']) {
      await expect(page.getByRole('heading', { name })).toBeVisible()
    }
    await expect(page.getByRole('heading', { name: 'Recent articles' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Agent operations' })).toBeVisible()
    await expect(page.getByText('Agent turns (24h)')).toBeVisible()
    await expect(page.getByText('Notes received (24h)')).toBeVisible()
    await expect(page.getByText('Model errors (24h)')).toBeVisible()
    await expect(page.getByText('Delivery backlog')).toBeVisible()
    await expect(page.getByText('Blocked uploads')).toBeVisible()
    await expect(page.getByTestId('agent-turns-24h')).toHaveText('11')
    await expect(page.getByTestId('intakes-24h')).toHaveText('3')
    await expect(page.getByTestId('model-errors-24h')).toHaveText('2')
    await expect(page.getByTestId('delivery-backlog')).toHaveText('4')
    await expect(page.getByTestId('blocked-uploads')).toHaveText('3')
    expect(consoleErrors).toEqual([])
    if (process.env.STUDIO_SCREENSHOT_PATH) {
      await page.screenshot({ path: process.env.STUDIO_SCREENSHOT_PATH, fullPage: true })
    }
  })

  test('shows public-memory provenance and review state', async ({ page }) => {
    await mockControlRoomApi(page)

    await page.goto('/studio/memory')
    await expect(page.getByText('Projects/_knowledge/tooth-fairy-network.md')).toBeVisible()
    await expect(page.getByText('approved', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Expiry', { exact: true })).toBeVisible()
  })

  test('shows inbox delivery and attachment quarantine state', async ({ page }) => {
    await mockControlRoomApi(page)

    await page.goto('/studio/inbox')
    await expect(page.getByText('Receipt A4E76C62')).toBeVisible()
    await expect(page.getByText('Delivery state')).toBeVisible()
    await expect(page.getByText('Attachment quarantine')).toBeVisible()
    await expect(page.getByText('quarantined', { exact: true })).toBeVisible()
  })

  test('reorders known homepage sections through buttons', async ({ page }) => {
    const mutations: unknown[] = []
    await mockControlRoomApi(page, mutations)

    await page.goto('/studio/homepage')
    await page.getByRole('button', { name: 'Move Proof of work, in public. down' }).click()
    await expect.poll(() => mutations.length).toBe(1)
    expect(mutations[0]).toEqual({ kind: 'order', ids: [SECOND_ID, FIRST_ID] })
  })

  test('keeps build notes in the three-part editorial structure', async ({ page }) => {
    await mockControlRoomApi(page)

    await page.goto('/studio/build-notes')
    const publishedNote = page.getByRole('article').filter({ hasText: 'The chatbot becomes a doorway' })
    await expect(publishedNote.getByText('What changed', { exact: true })).toBeVisible()
    await expect(publishedNote.getByText('What I learned', { exact: true })).toBeVisible()
    await expect(publishedNote.getByText('Next', { exact: true })).toBeVisible()
  })
})
