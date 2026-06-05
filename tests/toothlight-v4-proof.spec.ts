import { expect, test } from 'playwright/test'

test('Toothlight V4 first proof mobile path', async ({ page }) => {
  await page.goto('/toothlight', { waitUntil: 'load' })

  await expect(page.getByLabel(/Product Entry Read/i)).toBeVisible()
  await page.getByRole('link', { name: /Create a Toothlight/i }).first().click()

  await expect(page).toHaveURL(/\/toothlight\/make/)
  await expect(page.getByRole('heading', { name: /Add the tooth/i })).toHaveCount(0)
  await expect(page.getByText(/Start with a photo of your tooth/i)).toBeVisible()
  await expect(page.locator('article[data-treatment="golden-locket"]')).toBeVisible()

  const fileInput = page.locator('input[type="file"]').first()
  await fileInput.setInputFiles({
    name: 'toothlight-test.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axJ2DkAAAAASUVORK5CYII=',
      'base64',
    ),
  })

  await page.getByRole('button', { name: /Moon Window/i }).click()
  await expect(page.locator('article[data-treatment="moon-window"]')).toBeVisible()
  await page.getByPlaceholder('Kai').fill('Kai')
  await page.getByPlaceholder('First Tooth').fill('First Tooth')
  await page.getByPlaceholder(/Say the memory/i).fill('Lost after breakfast and showed everyone.')

  await page.getByRole('button', { name: /Save this Toothlight/i }).click()
  await expect(page.getByText(/Saved\. Seal the parent note next/i)).toBeVisible()

  await page.waitForURL(/\/toothlight\/t\/demo-toothlight\/note\?handoff=1/, { timeout: 8_000 })
  await expect(page.getByRole('heading', { name: /Seal the note/i }).first()).toBeVisible()
  await expect(page.getByText(/Small note starter/i)).toHaveCount(0)
  await page.getByPlaceholder(/receive later/i).fill('One day, I hope this reminds you how loved you were.')
  await page.getByRole('button', { name: /Seal the note/i }).click()
  await expect(page.getByText(/Sealed for later/i).first()).toBeVisible()
  await page.getByRole('link', { name: /View saved Toothlight/i }).click()
  await page.waitForURL(/\/toothlight\/t\/demo-toothlight$/, { timeout: 8_000 })
  await expect(page.getByText(/Review note/i).first()).toBeVisible()

  await page.getByRole('link', { name: /Invite family/i }).first().click()
  await page.waitForURL(/\/toothlight\/t\/demo-toothlight\/family$/, { timeout: 8_000 })
  await expect(page.getByRole('heading', { name: /Invite family/i }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /Family note \+ gift/i })).toBeVisible()
  await page.getByPlaceholder('Nana').fill('Nana')
  await page.getByPlaceholder(/how loved/i).fill('I am saving this little note for your future smile.')
  await page.getByRole('button', { name: /Add family note/i }).click()
  await expect(page.getByText(/Family note added/i)).toBeVisible()
  await expect(page.getByRole('link', { name: /View saved Toothlight/i })).toBeVisible()
})
