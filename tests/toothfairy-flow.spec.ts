import { test, expect, Page } from 'playwright/test';

/**
 * TFN mobile happy-path regression.
 *
 * Covers: stories page -> story detail -> draw entry point -> main app flow
 * (setup -> create -> tell -> preview -> mint) -> keepsake page.
 *
 * Relies on NEXT_PUBLIC_TEST_MODE=true:
 *  - /api/toothfairy/mint returns stub with milestonePda=test-pda
 *  - /api/toothfairy/keepsake/test-pda returns stub keepsake data
 *  - /toothfairy/app bypasses Supabase auth gate (isAuthenticated=true)
 *
 * Intentionally NOT tested: real on-chain mint, Arweave upload, AI enhance,
 * Phantom deep link, Web Speech API, OAuth flow.
 */

/** Navigate with retry — Next.js dev-server RSC prefetches can race the
 *  initial goto on mobile viewports and surface as "navigation interrupted". */
async function safeGoto(page: Page, url: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
      return;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!/interrupted/i.test(msg) || attempt === 3) throw err;
      await page.waitForTimeout(800);
    }
  }
}

async function simulateCanvasDraw(page: Page) {
  // Grab the first visible canvas on the page and dispatch pointer events
  // sufficient for the DrawingCanvas component to mark isPristine=false
  // and produce a non-empty dataURL on export.
  const canvas = page.locator('canvas').first();
  await canvas.waitFor({ state: 'visible', timeout: 10_000 });
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas has no bounding box');
  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.4;
  const endX = box.x + box.width * 0.7;
  const endY = box.y + box.height * 0.6;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  // Several intermediate moves so the stroke has length
  for (let i = 1; i <= 6; i++) {
    await page.mouse.move(
      startX + ((endX - startX) * i) / 6,
      startY + ((endY - startY) * i) / 6,
      { steps: 3 }
    );
  }
  await page.mouse.up();
}

test.describe('TFN mobile happy path', () => {
  test('story -> draw -> app flow -> keepsake', async ({ page }) => {
    // ── Step 1: Stories page ────────────────────────────────────────────
    await page.goto('/toothfairy/stories', { waitUntil: 'load' });
    await expect(
      page.getByRole('heading', { name: /Stories from Around the World/i })
    ).toBeVisible();

    // Tanda is an active story (linkedFullStory='tanda' in wall-cards/cards.ts).
    // The legend card links to /toothfairy/story/tanda.
    const tandaLink = page
      .locator('a[href^="/toothfairy/story/tanda"]')
      .first();
    await expect(tandaLink).toBeVisible();
    const tandaHref = await tandaLink.getAttribute('href');
    expect(tandaHref).toMatch(/\/toothfairy\/story\/tanda/);

    // ── Step 2: Story page ─────────────────────────────────────────────
    // StoryPlayer is an animation-heavy client component with 20 scenes before
    // the CTA. Walking through every scene is brittle (typewriter timing, motion).
    // Instead we assert the link points at the right place (covers the story
    // tile -> detail routing contract) then skip directly to the draw step the
    // CTA would navigate to. This still exercises the banner path the CTA
    // actually lands on (localStorage seed + /toothfairy/app/draw nav).
    //
    // We seed localStorage on a blank page first (origin must match), then
    // navigate to the draw page. Navigating directly from /toothfairy/stories
    // raced with Next.js's prefetch machinery on mobile viewports.
    await page.evaluate(() => {
      localStorage.setItem(
        'tfn-story-context',
        JSON.stringify({
          traditionSlug: 'tanda',
          storyId: 'tanda',
          storyTitle: 'Tanda',
        })
      );
    });
    // Wait for any pending Next router prefetches to settle before nav away
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(500);

    await safeGoto(page, '/toothfairy/app/draw');

    // ── Step 3: Assert story banner ────────────────────────────────────
    await expect(page.getByText(/Drawing a tooth for/i)).toBeVisible({
      timeout: 15_000,
    });
    // Let any pending RSC prefetches finish before we nav away
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1000);

    // ── Step 4: Main app flow ──────────────────────────────────────────
    // The /toothfairy/app/draw + preview + result flow ends back at
    // /toothfairy/app with no child context, so we'd still need to fill
    // setup afterwards. Skipping the V2 preview/enhance flow and driving
    // the main app's own state machine keeps the test deterministic and
    // avoids stubbing the enhance endpoint.
    //
    await safeGoto(page, '/toothfairy/app');

    // Setup step: fill child name + DOB
    const nameInput = page.locator('input[placeholder*="Luna"]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.click();
    await nameInput.fill('Testy');
    await expect(nameInput).toHaveValue('Testy');

    const dobInput = page.locator('input[type="date"]').first();
    await dobInput.click();
    await dobInput.fill('2018-06-15');
    await expect(dobInput).toHaveValue('2018-06-15');

    // Continue to create step
    const goBtn = page.getByRole('button', { name: /^Let's go!/i });
    await expect(goBtn).toBeEnabled({ timeout: 5_000 });
    await goBtn.click();

    // Create step: draw something on the canvas so previewImage is non-empty
    await expect(page.getByText(/Time to make your masterpiece/i)).toBeVisible();
    await simulateCanvasDraw(page);

    // Continue to tell step
    await page.getByRole('button', { name: /I'm proud of this!/i }).click();

    // ── Step 5: Tell step ──────────────────────────────────────────────
    await expect(
      page.getByRole('heading', { name: /Tell us about this tooth!/i })
    ).toBeVisible();
    const tellArea = page.getByRole('textbox', { name: /Tooth story/i });
    await tellArea.fill('Test tooth story');
    await page.getByRole('button', { name: /Save this story/i }).click();

    // ── Step 6: Preview step -> mint ───────────────────────────────────
    // Test mode bypasses Supabase auth — the mint CTA is shown directly.
    // In child mode the button text is "Send it to the fairies! ✦" (with a
    // unicode star). We match the loose prefix so locator matching is stable.
    await expect(
      page.getByRole('heading', { name: /Look what you made/i })
    ).toBeVisible();
    const mintBtn = page
      .locator('button', { hasText: /Send it to the fairies/i })
      .first();
    await expect(mintBtn).toBeVisible({ timeout: 10_000 });
    await mintBtn.click();

    // ── Step 7: Keepsake page ─────────────────────────────────────────
    await page.waitForURL(/\/toothfairy\/keepsake\/test-pda/, {
      timeout: 30_000,
    });

    // Assert drawing image rendered
    const drawing = page.getByAltText(/drawing/i).first();
    await expect(drawing).toBeVisible({ timeout: 15_000 });

    // Assert tell text rendered ("Test tooth story" wrapped in curly quotes)
    await expect(page.getByText(/Test tooth story/i)).toBeVisible();
  });
});
