import { expect, test } from 'playwright/test'

test('local mobile preview can save through a local Toothlight when auth is unavailable', async ({ page }) => {
  await page.route('**/api/toothlight/save', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Parent account required to save this Toothlight.' }),
    })
  })

  await page.goto('/toothlight/make', { waitUntil: 'load' })

  const fileInput = page.locator('input[type="file"]').first()
  await fileInput.setInputFiles({
    name: 'mobile-local-toothlight.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axJ2DkAAAAASUVORK5CYII=',
      'base64',
    ),
  })

  await page.getByLabel('Child name').fill('Mobile Test')
  await page.getByLabel('Toothlight name').fill('First Tooth')
  await page.getByLabel('Memory note').fill('A local phone save should still reach the note step.')
  await page.getByRole('button', { name: /Save this Toothlight/i }).click()

  await expect(page.getByText(/Saved on this device\. Seal the parent note next\./i)).toBeVisible()
  await page.waitForURL(/\/toothlight\/t\/local-[^/]+\/note\?handoff=1/, { timeout: 8_000 })
  await expect(page.getByRole('heading', { name: /Seal the note/i }).first()).toBeVisible()
})

test('local mobile preview can save on-device when the save request fails', async ({ page }) => {
  await page.route('**/api/toothlight/save', async (route) => {
    await route.abort('failed')
  })

  await page.goto('/toothlight/make', { waitUntil: 'load' })

  const fileInput = page.locator('input[type="file"]').first()
  await fileInput.setInputFiles({
    name: 'mobile-local-fallback.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axJ2DkAAAAASUVORK5CYII=',
      'base64',
    ),
  })

  await page.getByLabel('Child name').fill('Phone Test')
  await page.getByLabel('Toothlight name').fill('Pool Tooth')
  await page.getByLabel('Memory note').fill('The phone should still keep this Toothlight.')
  await page.getByRole('button', { name: /Save this Toothlight/i }).click()

  await expect(page.getByText(/Saved on this device\. Seal the parent note next\./i)).toBeVisible()
  await page.waitForURL(/\/toothlight\/t\/local-[^/]+\/note\?handoff=1/, { timeout: 8_000 })
  await expect(page.getByRole('heading', { name: /Seal the note/i }).first()).toBeVisible()
})
