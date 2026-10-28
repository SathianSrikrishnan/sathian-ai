const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const base = process.env.SITE_URL
const proof = process.env.BROWSER_PROOF_DIR || '/tmp/learn-family-proof'
const assert = (ok, message) => { if (!ok) throw new Error(message) }
;(async () => {
  fs.mkdirSync(proof, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  // Scope test authentication to this preview. Public story art and YouTube
  // embeds must never receive the preview bypass credential.
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    const previewOrigin = new URL(base).origin
    await context.route('**/*', route => {
      const request = route.request()
      const headers = { ...request.headers() }
      if (new URL(request.url()).origin === previewOrigin) headers['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      else delete headers['x-vercel-protection-bypass']
      return route.continue({ headers })
    })
  }
  const page = await context.newPage(), errors = [], performanceMetrics = []
  await page.addInitScript(() => {
    window.learnVitals = { lcp: null, cls: 0 }
    try { new PerformanceObserver(list => { for (const entry of list.getEntries()) window.learnVitals.lcp = entry.startTime }).observe({ type: 'largest-contentful-paint', buffered: true }) } catch {}
    try { new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.learnVitals.cls += entry.value }).observe({ type: 'layout-shift', buffered: true }) } catch {}
  })
  page.on('pageerror', e => errors.push(e.message))
  try {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: width === 390 ? 'reduce' : 'no-preference' })
      await page.goto(base + '/learn')
      await page.getByRole('heading', { name: 'Learn with Tanda', exact: true }).waitFor()
      assert(await page.locator('h1').count() === 1, 'one main heading')
      assert(await page.locator('.learn-collection video').count() === 3, 'three genuine Watch films')
      assert(await page.locator('video[autoplay]').count() === 0, 'no autoplay')
      assert(await page.locator('video[src*="/welcome-r2/dad-welcome-review"], video[src*="stablecoins"], video[src*="planet-v2"], video[src*="recovered-review"]').count() === 0, 'held or rejected review media must not appear publicly')
      assert(await page.locator('.border-earth, .border-venus').count() === 0, 'no decorative top planets')
      assert(await page.locator('.learn-proof-hub').getAttribute('href') === 'https://proof.sathian.ai', 'simple Proof link retained')
      const hero = page.locator('.learn-classroom-art')
      await hero.evaluate(i => i.decode())
      assert(await hero.evaluate(i => i.naturalWidth === 1672), 'approved complete hero decoded')
      performanceMetrics.push({ page: 'learn', width, ...await page.evaluate(() => ({ ...window.learnVitals, responseMs: performance.getEntriesByType('navigation')[0]?.responseEnd, transferredBytes: performance.getEntriesByType('resource').reduce((sum, r) => sum + r.transferSize, 0), initialIframes: document.querySelectorAll('iframe').length })) })
      const storyFilms = page.locator('.learn-room-stories video')
      assert(await storyFilms.count() === 8, 'eight full story films retained')
      for (const video of await storyFilms.all()) {
        assert(await video.getAttribute('preload') === 'none', 'story film does not preload on arrival')
        const track = video.locator('track[kind="captions"]')
        assert(await track.count() === 1, 'each full story has captions')
        const captionPath = await track.getAttribute('src')
        assert(await page.evaluate(async src => { const response = await fetch(src); return response.ok && (await response.text()).startsWith('WEBVTT') }, captionPath), 'caption route returns WebVTT')
        await video.evaluate(v => new Promise((resolve, reject) => { v.onloadedmetadata = () => resolve(true); v.onerror = () => reject(new Error('Story metadata failed')); v.preload = 'metadata'; v.load(); if (v.readyState >= 1) resolve(true) }))
        assert(await video.evaluate(v => v.duration > 100 && v.paused), 'full story metadata decodes without playback')
      }
      assert(await page.locator('.learn-drawing-launch').count() === 6, 'six drawing choices')
      assert(await page.locator('.learn-drawing-shelf iframe').count() === 0, 'drawing embeds wait for a user action')
      assert(await page.locator('.learn-drawing-shelf a[href^="https://www.youtube.com/watch"]').count() === 6, 'direct drawing fallbacks')
      assert(await page.locator('.learn-hero-zoom').getAttribute('target') === '_blank', 'complete illustration can be enlarged')
      const guides = page.locator('.learn-meet-controls video')
      assert(await guides.count() === 2, 'both approved guide players visible')
      assert(await page.locator('.learn-meet-controls details').count() === 0, 'no collapsed welcome')
      assert(await guides.nth(1).getAttribute('src') === '/learn-media/cartoon-dad-welcome-20261028/learn-with-tanda-coherent-welcome.mp4', 'approved cartoon Dad welcome only')
      for (const video of await guides.all()) {
        assert(await video.isVisible(), 'guide player immediately visible')
        await video.evaluate(async v => { v.muted = true; await v.play() })
        await page.waitForFunction(() => [...document.querySelectorAll('.learn-meet-controls video')].some(v => v.currentTime > 0.1))
      }
      assert(await guides.first().evaluate(v => v.paused), 'starting another guide pauses the first')
      await guides.nth(1).evaluate(v => v.pause())
      assert(await page.locator('.learn-collection details').count() === 0, 'no full transcript disclosure in learner flow')
      assert(await page.locator('.proof-family-wall').evaluate(e => getComputedStyle(e).position === 'fixed'), 'drawing wall continues at every scroll position')
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'home fits viewport')
      await page.screenshot({ path: path.join(proof, `home-${width}.png`), fullPage: true })
      await page.goto(base + '/proof')
      assert(await page.locator('[data-film]').count() === 7, 'seven approved Proof chapters')
      assert(await page.locator('video[autoplay]').count() === 0, 'Proof no autoplay')
      assert(await page.locator('.proof-family-wall').evaluate(e => getComputedStyle(e).position === 'fixed'), 'Proof wall continues')
      await page.getByText('Why no subscription?', { exact: true }).click()
      assert(await page.getByText(/Future tools or network activity/).isVisible(), 'one-time purchase scope explained')
      assert(await page.locator('input[name="email"]').count() === 0, 'inactive signup is removed from the sales page')
      assert(await page.locator('a[href="mailto:info@toothfairy.network"]').count() > 0, 'working email fallback retained')
      if (await page.locator('#proof-question').count()) {
        let mockedQuestions = 0
        // This route is fulfilled in the browser: no real inquiry, database write or notification.
        await page.route('**/api/proof-question', async route => {
          const body = route.request().postDataJSON()
          assert(body.consent === true && body.sourcePage === '/proof', 'purpose-specific consent and source')
          assert(!('marketing' in body) && !('childName' in body), 'no marketing or child fields')
          mockedQuestions++
          await route.fulfill({ status: mockedQuestions === 1 ? 503 : 202, contentType: 'application/json', body: JSON.stringify(mockedQuestions === 1 ? { error: 'Your question was not saved. Please email us.' } : { ok: true, receipt: { code: 'SA-ABCDEFGHIJ', deliveryStatus: 'queued' } }) })
        })
        await page.locator('[name="question"]').fill('Mocked browser question; never submitted to server')
        await page.locator('[name="replyEmail"]').fill('adult@example.invalid')
        await page.locator('[name="consent"]').check()
        await page.getByRole('button', { name: 'Send question', exact: true }).click()
        await page.getByRole('status').filter({ hasText: 'not saved' }).waitFor()
        assert(await page.locator('[name="question"]').inputValue() !== '', 'failed question retained for retry')
        await page.getByRole('button', { name: 'Send question', exact: true }).click()
        await page.getByRole('status').filter({ hasText: 'saved and queued' }).waitFor()
        assert(await page.locator('[name="question"]').inputValue() === '', 'confirmed stored question resets')
        assert(mockedQuestions === 2, 'both question cases intercepted without server submission')
        await page.unroute('**/api/proof-question')
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Proof fits viewport')
      await page.screenshot({ path: path.join(proof, `proof-${width}.png`), fullPage: true })
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
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(base + '/learn/stablecoin')
      assert(await page.locator('video').count() === 0, 'stablecoin is an honest interactive lesson without a fake film')
      for (let mask = 0; mask < 16; mask++) {
        for (let step = 0; step < 4; step++) {
          assert(await page.getByRole('button', { name: 'Continue', exact: true }).count() === 0, 'answer before continuing')
          const answer = page.getByRole('button', { name: (mask >> step) & 1 ? 'Yes' : 'No', exact: true })
          if (width === 1440) { await answer.focus(); await page.keyboard.press('Enter') } else await answer.click()
          await page.getByRole('button', { name: 'Continue', exact: true }).click()
        }
        await page.getByRole('heading', { name: 'You explored USDC.', exact: true }).waitFor()
        await page.getByRole('button', { name: 'Try again', exact: true }).click()
        await page.getByRole('heading', { name: 'Create', exact: true }).waitFor()
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'stablecoin fits viewport')
      await page.screenshot({ path: path.join(proof, `stablecoin-${width}.png`), fullPage: true })
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
    fs.writeFileSync(path.join(proof, 'receipt.json'), JSON.stringify({ status: 'passed', errors, performanceMetrics, note: 'Lab timings from hosted Chromium without mobile network throttling, not field Core Web Vitals or Ads approval. Real decoded lesson clips at 16x/muted; story metadata only; no subjective voice or creative approval claim.' }, null, 2))
  } finally { await context.close(); await browser.close() }
})().catch(e => { console.error(e); process.exitCode = 1 })
