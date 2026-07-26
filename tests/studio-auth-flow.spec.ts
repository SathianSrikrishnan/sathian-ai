import { expect, test } from 'playwright/test'

test.describe('Studio secure entrance', () => {
  test('presents the two-step passwordless entrance and a non-enumerating receipt', async ({ page }) => {
    await page.route('**/api/studio/auth', async (route) => {
      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          message: 'If this address is approved, a secure sign-in link is on its way.',
        }),
      })
    })

    await page.goto('/studio/login')

    await expect(page.getByRole('heading', { name: 'Open the control room' })).toBeVisible()
    await expect(page.getByLabel('Studio sign-in progress')).toContainText('Email link')
    await expect(page.getByLabel('Studio sign-in progress')).toContainText('Authenticator')
    await expect(page.locator('input[type="password"]')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'New Article' })).toHaveCount(0)

    await page.getByLabel('Approved email').fill('unknown@example.com')
    await page.getByRole('button', { name: 'Send secure link' }).click()

    await expect(
      page.getByText('If this address is approved, a secure sign-in link is on its way.'),
    ).toBeVisible()
  })

  test('redirects private Studio pages and rejects private APIs without a session', async ({ page }) => {
    await page.goto('/studio')
    await expect(page).toHaveURL(/\/studio\/login$/)

    const response = await page.request.get('/api/studio/articles')
    expect(response.status()).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'unauthorized' })
  })
})
