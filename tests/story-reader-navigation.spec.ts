import { expect, test } from 'playwright/test'

test.describe('published story reader navigation', () => {
  test('right and left screen clicks advance and rewind the full-frame reader', async ({ page }) => {
    await page.goto('/toothfairy/story/tanda', { waitUntil: 'load' })

    await expect(page.getByText('1 / 31')).toBeVisible()

    const viewport = page.viewportSize()
    if (!viewport) throw new Error('Expected a browser viewport')

    await page.mouse.click(viewport.width * 0.75, viewport.height * 0.5)
    await expect(page.getByText('2 / 31')).toBeVisible()

    await page.mouse.click(viewport.width * 0.25, viewport.height * 0.5)
    await expect(page.getByText('1 / 31')).toBeVisible()
  })
})
