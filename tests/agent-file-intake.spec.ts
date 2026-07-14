import { expect, test } from 'playwright/test'

const PDF_BYTES = Buffer.from('%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj')

async function mockTurnstile(page: import('playwright/test').Page) {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `window.turnstile = {
        render: function (_element, options) {
          setTimeout(function () { options.callback('browser-turnstile-token') }, 0)
          return 'test-widget'
        },
        remove: function () {},
        reset: function () {}
      }`,
    })
  })
}

test.describe('constrained public file intake', () => {
  test('holds one byte-checked PDF privately and gives the visitor an opaque receipt', async ({ page }) => {
    await mockTurnstile(page)
    const calls: string[] = []
    const consoleErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })

    await page.route('**/api/agent/message', async (route) => {
      calls.push('message')
      expect(route.request().postDataJSON()).toMatchObject({
        consent: true,
        attachmentIntent: true,
      })
      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({
          route: 'answer_and_intake',
          answer: 'That note can be passed along safely.',
          sources: [],
          receipt: {
            code: 'SA-FILE12345',
            deliveryStatus: 'queued',
            message: 'Your note is stored and queued for delivery.',
          },
          capabilities: { answered: true, intakeStored: true, deliveryConfirmed: false },
        }),
      })
    })
    await page.route('**/api/agent/upload/reserve', async (route) => {
      calls.push('reserve')
      const body = route.request().postDataJSON()
      expect(body).toMatchObject({
        filename: 'brief.pdf',
        contentType: 'application/pdf',
        byteSize: PDF_BYTES.byteLength,
        consent: true,
        turnstileToken: 'browser-turnstile-token',
      })
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          upload: {
            attachmentId: '7dc4691b-b769-4875-b61a-f20c0bb70ea8',
            url: 'http://localhost:3000/__test-private-upload?token=opaque',
            completionToken: 'completion-secret-123456',
            expiresInSeconds: 7200,
          },
          file: { name: 'brief.pdf', maxBytes: 5 * 1024 * 1024 },
        }),
      })
    })
    await page.route('**/__test-private-upload?token=opaque', async (route) => {
      calls.push('upload')
      expect(route.request().method()).toBe('PUT')
      expect(route.request().postDataBuffer()).toEqual(PDF_BYTES)
      await route.fulfill({ status: 200, body: '{}' })
    })
    await page.route('**/api/agent/upload/complete', async (route) => {
      calls.push('complete')
      expect(route.request().postDataJSON()).toEqual({
        attachmentId: '7dc4691b-b769-4875-b61a-f20c0bb70ea8',
        completionToken: 'completion-secret-123456',
      })
      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'quarantined', file: { name: 'brief.pdf' } }),
      })
    })

    await page.goto('/')
    await page.getByRole('button', { name: 'Open chat' }).click()
    const panel = page.locator('[data-chat-panel]')
    const picker = panel.locator('[data-agent-file-input]')
    await expect(picker).not.toHaveAttribute('multiple')
    await picker.setInputFiles({
      name: 'brief.pdf',
      mimeType: 'application/pdf',
      buffer: PDF_BYTES,
    })
    await expect(panel.getByText('brief.pdf', { exact: true })).toBeVisible()
    await expect(panel.getByText('Human check complete.')).toBeVisible()
    if (process.env.FILE_INTAKE_SCREENSHOT_PATH) {
      await panel.screenshot({ path: process.env.FILE_INTAKE_SCREENSHOT_PATH })
    }

    await panel.locator('input[name="message"]').fill('Please review this project brief.')
    await panel.getByRole('button', { name: 'Send message' }).click()

    await expect(panel.getByText('Receipt SA-FILE12345', { exact: false })).toBeVisible()
    await expect(panel.getByText('brief.pdf is held privately for Sathian in Studio.', { exact: false })).toBeVisible()
    expect(calls).toEqual(['message', 'reserve', 'upload', 'complete'])
    expect(consoleErrors).toEqual([])
  })

  test('rejects an oversized selection before any upload request', async ({ page }) => {
    await mockTurnstile(page)
    let uploadCalls = 0
    await page.route('**/api/agent/upload/**', async (route) => {
      uploadCalls += 1
      await route.abort()
    })

    await page.goto('/')
    await page.getByRole('button', { name: 'Open chat' }).click()
    const panel = page.locator('[data-chat-panel]')
    await panel.locator('[data-agent-file-input]').setInputFiles({
      name: 'too-large.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 0x20),
    })

    await expect(panel.getByText('Files must be 5 MB or smaller.', { exact: true })).toBeVisible()
    expect(uploadCalls).toBe(0)
  })
})
