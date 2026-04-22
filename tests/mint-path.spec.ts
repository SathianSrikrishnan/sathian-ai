import { test, expect } from 'playwright/test';

/**
 * Isolated test: /toothfairy/app → setup → create → tell → preview → mint → keepsake.
 * Skips /toothfairy/stories entry point to isolate the post-mint regression
 * Sathian is hitting on production. Runs under NEXT_PUBLIC_TEST_MODE=true.
 */

test('app flow -> mint -> keepsake (isolated)', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`PAGE ERROR: ${err.message}`));

  await page.goto('/toothfairy/app', { waitUntil: 'load' });

  // Setup step
  const nameInput = page.locator('input[placeholder*="Luna"]').first();
  await expect(nameInput).toBeVisible({ timeout: 15_000 });
  await nameInput.fill('Testy');

  const dobInput = page.locator('input[type="date"]').first();
  await dobInput.fill('2018-06-15');

  await page.getByRole('button', { name: /^Let's go!/i }).click();

  // Create step — draw
  await expect(page.getByText(/Time to make your masterpiece/i)).toBeVisible();
  const canvas = page.locator('canvas').first();
  await canvas.waitFor({ state: 'visible' });
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas missing');
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.4);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(
      box.x + box.width * (0.3 + 0.4 * i / 6),
      box.y + box.height * (0.4 + 0.2 * i / 6),
      { steps: 3 }
    );
  }
  await page.mouse.up();

  await page.getByRole('button', { name: /I'm proud of this!/i }).click();

  // Tell step
  await expect(page.getByRole('heading', { name: /Tell us about this tooth!/i })).toBeVisible();
  await page.getByRole('textbox', { name: /Tooth story/i }).fill('Test tooth story');
  await page.getByRole('button', { name: /Save this story/i }).click();

  // Preview step — TEST_MODE bypasses auth so mint CTA shows immediately
  await expect(page.getByRole('heading', { name: /Look what you made/i })).toBeVisible();
  const mintBtn = page.locator('button', { hasText: /Send it to the fairies/i }).first();
  await expect(mintBtn).toBeVisible({ timeout: 15_000 });
  await mintBtn.click();

  // Keepsake redirect
  await page.waitForURL(/\/toothfairy\/keepsake\/test-pda/, { timeout: 30_000 });

  await expect(page.getByAltText(/drawing/i).first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/Test tooth story/i)).toBeVisible();

  console.log('CONSOLE ERRORS:', consoleErrors);
});
