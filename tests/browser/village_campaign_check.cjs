const { chromium } = require('playwright')
const { mkdirSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const base = (process.env.SITE_URL || 'http://127.0.0.1:3317').replace(/\/$/, '')
const out = process.env.BROWSER_PROOF_DIR || '../village-review-proof'
const assert = (ok, reason) => { if (!ok) throw new Error(reason) }

;(async () => {
  mkdirSync(out, { recursive: true })
  const browser = await chromium.launch({ headless: true, args: ['--mute-audio'] })
  const results = []
  const { checkReadability } = await import('../../src/lib/plain-words.ts')
  try {
    for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['small', 320, 740]]) {
      const context = await browser.newContext({ viewport: { width, height }, extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET } : {} })
      await context.addInitScript(() => { localStorage.setItem('sathian-agent-sound-enabled', 'false'); HTMLMediaElement.prototype.play = async function () {} })
      await context.route(/google-analytics|googletagmanager|vercel-insights|vitals\.vercel|posthog/, r => r.abort())
      await context.route('**/api/agent/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }))
      const page = await context.newPage()
      page.setDefaultTimeout(15000)
      page.setDefaultNavigationTimeout(30000)
      const errors = []
      page.on('pageerror', e => errors.push(e.message))
      for (const path of ['/', '/village']) {
        console.log(label, path, 'navigation')
        const response = await page.goto(base + path, { waitUntil: 'load' })
        assert(response.ok(), `${label} ${path}: HTTP ${response.status()}`)
        assert(await page.locator('h1').count() === 1, `${label} ${path}: one H1`)
        assert(await page.locator('link[rel="canonical"]').getAttribute('href') === 'https://sathian.ai' + (path === '/' ? '' : path), `${label} ${path}: canonical`)
        assert(!/noindex|nofollow/.test(await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(n => n.content).join(','))), `${label} ${path}: indexable`)
        // Request offscreen lazy images for the full-page proof as well.
        await page.locator('main img').evaluateAll(images => images.forEach(image => { image.loading = 'eager' }))
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo({ top:y, behavior:"instant" }); await new Promise(r => setTimeout(r, 40)) } scrollTo({ top:0, behavior:"instant" }) })
        await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(i => i.complete && i.naturalWidth > 0)).catch(async () => { throw new Error('Unloaded images: ' + JSON.stringify(await page.locator('main img').evaluateAll(images => images.filter(i => !i.complete || !i.naturalWidth).map(i => ({src:i.currentSrc || i.src, complete:i.complete})))) ) })
        assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${label} ${path}: overflow`)
        if (path === '/village') {
          const reading = checkReadability(await page.locator('main').innerText())
          assert(reading.pass, `${label}: Village reading grade ${reading.grade}, very hard sentences ${reading.veryHardSentences.length}`)
          console.log(`${label}: Village reading grade ${reading.grade}`)
        }
        await page.screenshot({ path: join(out, `${label}-${path === '/' ? 'home' : 'village'}.png`), fullPage: true })
        if (path === '/') {
          console.log(label, 'chat checks')
          const opener = page.getByRole('button', { name: /Ask Sathian/ })
          await opener.waitFor()
          assert(await page.locator('[data-chat-panel]').count() === 0, 'chat starts collapsed')
          await opener.focus(); await page.keyboard.press('Enter')
          await page.locator('[data-chat-panel]').waitFor()
          await page.getByRole('button', { name: 'Close chat', exact: true }).click()
          await opener.waitFor()
          await page.waitForFunction(() => document.activeElement?.classList.contains('site-agent-reopen'))
          await opener.press('Enter'); await page.locator('[data-chat-panel]').waitFor()
          await page.getByRole('button', { name: 'Close chat', exact: true }).click()
          assert(await page.getByRole('link', { name: 'See the Village gift', exact: true }).getAttribute('href') === '/village', 'home campaign link')
        }
      }
      console.log(label, 'form checks')
      let calls = 0
      await page.route('**/api/proof-interest', async r => {
        calls++
        const data = r.request().postDataJSON()
        assert(data.source === 'village' && data.feedback.startsWith('[Village]'), 'Village source preserved')
        assert(!data.updates, 'updates opt-in stays unchecked')
        await r.fulfill({ status: calls === 1 ? 500 : 200, contentType: 'application/json', body: JSON.stringify(calls === 1 ? { error: 'Please try again.' } : { receipt: 'LOCAL-TEST' }) })
      })
      const form = page.locator('.first20-form')
      await form.getByRole('button', { name: 'Ask for a free gift' }).click()
      assert(calls === 0, 'required fields prevent empty request')
      await form.getByLabel('Your name', { exact: true }).fill('Synthetic local check')
      await form.getByLabel('Email or phone').fill('local@example.invalid')
      await form.getByLabel(/The child.s age/).fill('7')
      await form.getByLabel('Who are you to the child?').selectOption('network')
      await form.getByRole('button', { name: 'Ask for a free gift' }).click()
      await form.getByRole('status').filter({ hasText: 'Please try again.' }).waitFor()
      assert(await form.getByLabel('Your name', { exact: true }).inputValue() === 'Synthetic local check', 'error keeps input')
      await form.getByRole('button', { name: 'Ask for a free gift' }).click()
      await form.getByRole('status').filter({ hasText: 'Thank you.' }).waitFor()
      assert(calls === 2, 'one failure and one successful mocked request')
      assert(errors.length === 0, `${label}: browser errors: ${errors.join('; ')}`)
      results.push({ label, width, height, checks: 'layout, images, canonical, indexability, chat keyboard and repeated navigation, mocked form validation/error/retry/success', pass: true })
      await context.close()
    }
    writeFileSync(join(out, 'checks.json'), JSON.stringify(results, null, 2))
    console.log(JSON.stringify(results, null, 2))
  } finally { await browser.close() }
})().catch(e => { console.error(e); process.exit(1) })
