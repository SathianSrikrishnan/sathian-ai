const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const base = process.env.SITE_URL
const proof = process.env.BROWSER_PROOF_DIR || '/tmp/learn-family-proof'
const assert = (ok, message) => { if (!ok) throw new Error(message) }
;(async () => {
  fs.mkdirSync(proof, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET } : undefined })
  const page = await context.newPage(), errors = []
  page.on('pageerror', e => errors.push(e.message))
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(base + '/learn')
      await page.getByRole('heading', { name: 'Learn with Tanda', exact: true }).waitFor()
      assert(await page.locator('h1').count() === 1, 'one main heading')
      assert(await page.locator('.learn-collection video').count() === 3, 'three genuine Watch films')
      assert(await page.locator('video[autoplay]').count() === 0, 'no autoplay')
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'home fits viewport')
      await page.screenshot({ path: path.join(proof, `home-${width}.png`), fullPage: true })
      await page.goto(base + '/learn/stories')
      assert(await page.locator('.learn-story-card').count() === 7, 'seven stories')
      const links = await page.locator('.learn-story-card').evaluateAll(as => as.map(a => a.getAttribute('href')))
      for (const href of links) {
        await page.goto(base + href)
        const image = page.locator('.learn-story-reader figure > img')
        await image.evaluate(i => i.decode())
        assert(await image.evaluate(i => i.naturalWidth > 0), 'story illustration decoded')
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'reader fits viewport')
        await page.getByRole('button', { name: 'Next page', exact: true }).click()
        await page.locator('.learn-story-controls p').filter({ hasText: /^2 / }).waitFor()
        await page.keyboard.press('ArrowLeft')
        await page.locator('.learn-story-controls p').filter({ hasText: /^1 / }).waitFor()
        await page.getByRole('button', { name: 'Previous page', exact: true }).isDisabled().then(v => assert(v, 'first-page boundary'))
      }
      await page.screenshot({ path: path.join(proof, `reader-${width}.png`), fullPage: true })
    }
    for (const lesson of ['bitcoin', 'ethereum']) for (const answer of ['Yes', 'No']) {
      await page.goto(base + `/learn/${lesson}?mode=try`)
      await page.getByRole('button', { name: 'Start learning', exact: true }).click()
      for (let chapter = 0; chapter < 6; chapter++) {
        await page.locator('video').evaluate(v => { v.muted = true; v.playbackRate = 16 })
        const timer = setInterval(() => page.locator('video').evaluate(v => { v.muted = true; v.playbackRate = 16 }).catch(() => {}), 150)
        try {
          await page.getByRole('button', { name: answer, exact: true }).waitFor({ timeout: 30000 })
          assert(await page.locator('video').evaluate(v => v.paused), 'question stops naturally')
          await page.getByRole('button', { name: answer, exact: true }).click()
          await page.waitForFunction(a => document.querySelector('video').getAttribute('src').endsWith(`-${a}.mp4`), answer.toLowerCase())
          if (chapter < 5) await page.waitForFunction(n => document.querySelector('.learn-part-label').textContent.includes(`${n} / 6`), chapter + 2, { timeout: 30000 })
          else await page.getByText('Lesson complete', { exact: true }).waitFor({ timeout: 30000 })
        } finally { clearInterval(timer) }
      }
      await page.getByRole('button', { name: 'Play again', exact: true }).click()
      await page.waitForFunction(() => document.querySelector('.learn-part-label').textContent.includes('1 / 6'))
    }
    assert(errors.length === 0, errors.join('\n'))
    fs.writeFileSync(path.join(proof, 'receipt.json'), JSON.stringify({ status: 'passed', errors, note: 'Real decoded clips at 16x/muted for behavior; no subjective voice or creative approval claim.' }, null, 2))
  } finally { await context.close(); await browser.close() }
})().catch(e => { console.error(e); process.exitCode = 1 })
