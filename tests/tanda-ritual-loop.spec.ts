import { expect, test } from 'playwright/test';

test.describe('Tanda ritual animation preview', () => {
  test('renders the ritual loop preview with accessible still-frame semantics', async ({ page }) => {
    await page.goto('/animation/tanda-ritual', { waitUntil: 'load' });

    await expect(
      page.getByRole('region', { name: /Tanda ritual loop preview/i })
    ).toBeVisible();
    await expect(page.getByAltText(/Tanda carries a glowing tooth/i)).toBeVisible();
    await expect(page.getByText(/Memory saved/i)).toBeVisible();
    await expect(page.getByText(/Smile Fund started/i)).toBeVisible();
  });
});
