import { expect, test } from 'playwright/test'

test('Toothlight V4 first proof mobile path', async ({ page }) => {
  await page.goto('/toothlight', { waitUntil: 'load' })

  await expect(page.getByLabel(/Product Entry Read/i)).toBeVisible()
  await page.getByRole('link', { name: /Create a Toothlight/i }).first().click()

  await expect(page).toHaveURL(/\/toothlight\/make/)
  await expect(page.getByRole('heading', { name: /Create the glow first/i })).toBeVisible()

  const fileInput = page.locator('input[type="file"]').first()
  await fileInput.setInputFiles({
    name: 'toothlight-test.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axJ2DkAAAAASUVORK5CYII=',
      'base64',
    ),
  })

  await page.getByRole('button', { name: /Moon/i }).click()
  await page.getByPlaceholder('Kai').fill('Kai')
  await page.getByPlaceholder('First Tooth').fill('First Tooth')
  await page.getByPlaceholder(/Lost after breakfast/i).fill('Lost after breakfast and showed everyone.')

  await page.getByRole('button', { name: /Save this Toothlight/i }).click()
  await expect(page.getByText(/Saved\. Now add the parent note for later/i)).toBeVisible()

  await page.waitForURL(/\/toothlight\/t\/demo-toothlight/, { timeout: 8_000 })
  await expect(page.getByText(/Saved for later/i).first()).toBeVisible()
  await expect(page.getByText(/Kai's First Tooth/i).first()).toBeVisible()

  await page.getByRole('link', { name: /Write a note for later/i }).click()
  await expect(page).toHaveURL(/\/toothlight\/t\/demo-toothlight\/note/)
  await page.getByPlaceholder(/proud/i).fill('I was so proud of you today.')
  await page.getByPlaceholder(/receive later/i).fill('One day, I hope this reminds you how loved you were.')
  await page.getByRole('button', { name: /Seal the note/i }).click()
  await expect(page.getByText(/Sealed for later/i).first()).toBeVisible()

  await page.goto('/toothlight/t/demo-toothlight/family', { waitUntil: 'load' })
  await expect(page.getByRole('heading', { name: /Add a gift and a note for later/i }).first()).toBeVisible()
  await page.getByPlaceholder('Nana').fill('Nana')
  await page.getByPlaceholder(/how loved/i).fill('I am saving this little note for your future smile.')
  await page.getByRole('button', { name: /Add note only/i }).click()
  await expect(page.getByText(/Note added for later/i)).toBeVisible()
})
