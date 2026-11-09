// Standalone: SITE_URL=http://127.0.0.1:3212 BROWSER_PROOF_DIR=<directory>
// node tests/browser/home_carousel_check.cjs
// Only /api/agent requests are mocked. Images, pages and navigation remain real.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { chromium } = require('playwright')
const catalog = require('../../src/content/home-artwork.json')
const base = (process.env.SITE_URL || 'http://127.0.0.1:3212').replace(/\/+$/, '')
const proof = path.resolve(process.env.BROWSER_PROOF_DIR || path.join(os.tmpdir(), 'home-carousel-proof'))
const interval = 1_000
const selector = '[role="region"][aria-roledescription="carousel"]'
const cases = [
  { key: 'hero', label: "A child's village" },
  { key: 'where', label: 'Where to begin' },
  { key: 'when', label: 'When to start' },
  { key: 'why', label: 'Why it matters' },
]
const contacts = {
  Farcaster: 'https://farcaster.xyz/sathian',
  Instagram: 'https://www.instagram.com/sathians/',
  X: 'https://x.com/Sathian',
  LinkedIn: 'https://www.linkedin.com/in/sathians',
  YouTube: 'https://www.youtube.com/@SathianSrikrishnan',
  Substack: 'https://sathians.substack.com',
  GitHub: 'https://github.com/SathianSrikrishnan',
}
const receipt = { site: base, startedAt: new Date().toISOString(), checks: [], mockedAgentRequests: 0,
  catalog: Object.fromEntries(cases.map(({ key }) => [key, catalog[key].map(slide => slide.src)])) }
let currentPage
let currentCheck = 'launch'
const realWait = ms => new Promise(resolve => setTimeout(resolve, ms))
const region = (page, item) => page.getByRole('region', { name: item.label, exact: true })

// Never use page.waitForTimeout: the application's clock is deliberately paused.
async function eventually(predicate, label, timeout = 20_000) {
  const deadline = Date.now() + timeout
  do {
    if (await predicate()) return
    await realWait(25)
  } while (Date.now() < deadline)
  throw new Error(`${label}: condition did not settle within ${timeout}ms`)
}

async function decodedImage(image, expected, label) {
  // React can update src/srcset before the browser has selected currentSrc.
  // Calling decode in that interval can reject even when the new image is
  // valid. Poll using Node's real clock: page.clock is deliberately paused.
  const deadline = Date.now() + 20_000
  let sourceChanges = 0
  let last
  while (Date.now() < deadline) {
    let timer
    try {
      last = await Promise.race([
        image.evaluate(async (img, expectedPath) => {
          const assetPath = value => {
            if (!value) return null
            const url = new URL(value, location.href)
            return url.pathname === '/_next/image' ? url.searchParams.get('url') : url.pathname
          }
          const snapshot = () => ({
            src: img.getAttribute('src'), currentSrc: img.currentSrc, srcset: img.srcset,
            asset: assetPath(img.getAttribute('src')), currentAsset: assetPath(img.currentSrc),
            connected: img.isConnected, complete: img.complete,
            width: img.naturalWidth, height: img.naturalHeight, alt: img.alt,
          })
          const ready = state => state.connected && state.complete && state.width > 0 && state.height > 0
            && state.asset === expectedPath && state.currentAsset === expectedPath
          const changed = (before, after) => !after.connected || before.src !== after.src
            || before.currentSrc !== after.currentSrc || before.srcset !== after.srcset
          const before = snapshot()
          if (!ready(before)) return { status: 'loading', state: before }
          try {
            await img.decode()
          } catch (error) {
            const after = snapshot()
            return { status: changed(before, after) ? 'source-changed' : 'decode-failed',
              before, state: after, error: `${error.name}: ${error.message}` }
          }
          const after = snapshot()
          if (changed(before, after)) return { status: 'source-changed', before, state: after }
          if (!ready(after)) return { status: 'invalid-after-decode', state: after }
          return { status: 'decoded', state: after }
        }, expected),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`${label}: timed out decoding ${expected}; last state ${JSON.stringify(last)}`)),
            Math.max(1, deadline - Date.now()))
        }),
      ])
    } finally { clearTimeout(timer) }
    if (last.status === 'decoded') return last.state
    if (last.status === 'source-changed') {
      assert(++sourceChanges <= 3, `${label}: image source repeatedly changed during decode: ${JSON.stringify(last)}`)
    } else {
      assert.equal(last.status, 'loading', `${label}: stable image failed to decode: ${JSON.stringify(last)}`)
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error(`${label}: image did not load and decode within 20000ms: ${JSON.stringify(last)}`)
}

async function checkSlide(carousel, key, number, label) {
  const slides = catalog[key]
  await eventually(async () => await carousel.getAttribute('data-slide') === String(number), `${label}: slide ${number}`)
  assert.equal(await carousel.getAttribute('data-image-count'), String(slides.length), `${label}: catalog size`)
  assert.equal(await carousel.locator('img').count(), 1, `${label}: exactly one active image`)
  assert.equal(await carousel.locator('[aria-roledescription="slide"]').count(), 1, `${label}: exactly one rendered slide`)
  assert.equal(await carousel.locator('[aria-roledescription="slide"]').getAttribute('aria-label'), `${number} of ${slides.length}`)
  const expected = slides[number - 1]
  const image = carousel.locator('img')
  const data = await decodedImage(image, expected.src, label)
  assert.equal(data.asset, expected.src, `${label}: exact approved src`)
  assert.equal(data.currentAsset, expected.src, `${label}: exact approved selected source`)
  assert.equal(data.alt, expected.alt, `${label}: exact meaningful alternative text`)
  assert(data.alt.trim().length > 20, `${label}: meaningful alternative text`)
}

async function noOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth,
    document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
  assert(dimensions.document <= dimensions.width + 1 && dimensions.body <= dimensions.width + 1,
    `${label}: horizontal overflow ${JSON.stringify(dimensions)}`)
}

async function screenshot(page, name, fullPage = false) {
  await page.screenshot({ path: path.join(proof, `${name}.png`), fullPage, animations: 'disabled' })
}

async function setup(browser, viewport, reducedMotion = 'no-preference', slowNetwork = false, contextOptions = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, ...contextOptions })
  // Preview bypass is sent only to the site's origin, never external services.
  // All non-agent responses are real; no image, page, or asset is fulfilled.
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    const origin = new URL(base).origin
    await context.route(url => url.origin === origin, route => route.continue({
      headers: { ...route.request().headers(), 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET },
    }))
  }
  await context.route(url => url.pathname === '/api/agent' || url.pathname.startsWith('/api/agent/'), async route => {
    receipt.mockedAgentRequests++
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      ok: true, answer: 'Browser regression fixture. No question was sent to the live agent.', sources: [],
    }) })
  })
  const page = await context.newPage()
  currentPage = page
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.setDefaultTimeout(20_000)
  page.setDefaultNavigationTimeout(90_000)
  // Freeze before navigation, not after first render: one-second autoplay must
  // not race initial image decoding or mobile scrolling in the test itself.
  await page.clock.install({ time: new Date('2026-11-09T12:00:00Z') })
  await page.clock.pauseAt(new Date('2026-11-09T12:00:00Z'))
  let cdp
  if (slowNetwork) {
    cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 1600,
      downloadThroughput: 250_000, uploadThroughput: 250_000, connectionType: 'cellular3g' })
  }
  const response = await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  assert(response && response.ok(), `Homepage response: ${response?.status()}`)
  await eventually(async () => await page.locator(selector).count() === 4, 'One hero and three mini carousels')
  assert.equal(await page.locator('.village-home-hero img').count(), 1, 'One hero image')
  assert.equal(await page.locator('.founder-quick-questions').locator(selector).count(), 3, 'Three question mini carousels')
  const hero = region(page, cases[0])
  await hero.getByRole('button', { name: reducedMotion === 'reduce'
    ? 'Automatic rotation off: reduced motion' : 'Pause automatic rotation', exact: true }).waitFor()
  await hero.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await checkSlide(hero, 'hero', 1, 'Initial hero')
  return { page, context, hero, errors, cdp }
}

async function focused(locator, label) {
  assert(await locator.evaluate(el => el === document.activeElement), `${label}: keyboard focus`)
  const outline = await locator.evaluate(el => {
    const style = getComputedStyle(el)
    return { width: parseFloat(style.outlineWidth), style: style.outlineStyle }
  })
  assert(outline.width >= 2 && outline.style !== 'none', `${label}: visible keyboard focus`)
}

async function controlsInsideFrame(carousel, label) {
  const imageBox = await carousel.locator('img').boundingBox()
  assert(imageBox, `${label}: image has bounds`)
  const buttons = await carousel.getByRole('button').all()
  const boxes = []
  assert.equal(buttons.length, 3, `${label}: only two arrows and one pause control`)
  for (const button of buttons) {
    const box = await button.boundingBox()
    assert(box && box.width >= 44 && box.height >= 44, `${label}: 44px targets`)
    assert(box.x >= imageBox.x - 1 && box.y >= imageBox.y - 1
      && box.x + box.width <= imageBox.x + imageBox.width + 1
      && box.y + box.height <= imageBox.y + imageBox.height + 1,
    `${label}: controls remain inside artwork ${JSON.stringify({ imageBox, box })}`)
    boxes.push({ name: await button.getAttribute('aria-label'), ...box })
    assert.equal(await button.evaluate(el => !!el.parentElement.closest('button,a,summary,details')), false,
      `${label}: no nested interactive controls or details`)
  }
  for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
    const first = boxes[a], second = boxes[b]
    const overlapX = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x)
    const overlapY = Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y)
    assert(overlapX <= 0.5 || overlapY <= 0.5, `${label}: distinct non-overlapping 44px targets ${JSON.stringify({ first, second })}`)
  }
  const previous = await carousel.getByRole('button', { name: 'Previous image', exact: true }).boundingBox()
  const next = await carousel.getByRole('button', { name: 'Next image', exact: true }).boundingBox()
  assert(previous.x < imageBox.x + imageBox.width / 2 && next.x > imageBox.x + imageBox.width / 2,
    `${label}: arrows sit on opposite sides`)
  const pauseIcon = await carousel.locator('button svg').boundingBox()
  assert(pauseIcon && pauseIcon.width <= 30 && pauseIcon.height <= 30, `${label}: small pause icon`)
  assert.equal(await carousel.locator('figcaption').count(), 0, `${label}: no caption`)
  assert.equal((await carousel.innerText()).replace(/\s/g, ''), '‹›', `${label}: no visible counter or wordy controls`)
  const regionBox = await carousel.boundingBox()
  assert(regionBox.height <= imageBox.height + 2, `${label}: no bottom control bar`)
}

async function detailsState(carousel) {
  return carousel.evaluate(el => el.closest('article')?.querySelector('details')?.open ?? null)
}

async function clickWithoutTogglingDetails(button, carousel, label) {
  const before = await detailsState(carousel)
  await button.click()
  assert.equal(await detailsState(carousel), before, `${label}: control did not toggle adjacent details`)
}

async function checkStaticCards(page, label) {
  const cards = page.locator('.founder-question-row > article')
  assert.equal(await cards.count(), 5, `${label}: original five question cards`)
  for (const [index, title, src] of [
    [0, 'Who I am.', '/village/review-oct31/who-dad.webp'],
    [1, 'What I build.', '/village/review-oct31/what-gift.webp'],
  ]) {
    const card = cards.nth(index)
    assert((await card.locator('summary').innerText()).includes(title), `${label}: ${title}`)
    assert.equal(await card.locator(selector).count(), 0, `${label}: ${title} remains static`)
    assert.equal(await card.getByRole('button').count(), 0, `${label}: no controls on ${title}`)
    assert.equal(await card.locator('img').count(), 1, `${label}: one static ${title} image`)
    await card.scrollIntoViewIfNeeded()
    await decodedImage(card.locator('img'), src, `${label}: ${title}`)
  }
  assert.equal(await page.locator('summary button, summary a, button button, a button').count(), 0,
    `${label}: no interactive nesting`)
}

async function checkAbout(page, width) {
  await page.evaluate(() => window.scrollTo(0, 0))
  let nav = page.getByRole('navigation', { name: 'Primary navigation', exact: true })
  const menu = nav.getByRole('button', { name: 'Open menu', exact: true })
  if (await menu.isVisible()) {
    await menu.focus()
    await page.keyboard.press('Enter')
    nav = page.getByRole('navigation', { name: 'Mobile navigation', exact: true })
    await nav.waitFor()
  }
  const about = nav.getByRole('link', { name: 'About', exact: true })
  assert(await about.isVisible(), `${width}: About is discoverable in navigation`)
  assert.equal(await about.getAttribute('href'), '/about', `${width}: About points to its own page`)
  await about.focus()
  await page.keyboard.press('Enter')
  await page.waitForURL(url => /^\/about\/?$/.test(url.pathname))
  await page.getByRole('heading', { name: "Hi, I'm Sathian.", exact: true }).waitFor()
  assert.equal(await page.locator('h1').count(), 1, `${width}: About has one main heading`)
  assert.equal(await page.locator('#minimal-mobile-menu').count(), 0, `${width}: mobile menu closes on navigation`)
  await page.getByRole('heading', { name: 'How You Connect', exact: true }).waitFor()
  const profiles = page.getByRole('navigation', { name: 'Find Sathian online', exact: true })
  for (const [name, href] of Object.entries(contacts)) {
    const link = profiles.getByRole('link', { name: new RegExp(`^${name}(?:\\s|$)`) })
    assert.equal(await link.count(), 1, `${width}: one ${name} contact link`)
    assert.equal(await link.getAttribute('href'), href, `${width}: correct ${name} destination`)
    assert(await link.isVisible(), `${width}: ${name} contact visible`)
    assert.match(await link.getAttribute('rel'), /noopener/, `${width}: safe external contact link`)
  }
  assert.equal(await page.getByRole('link', { name: /^Follow on Luma/ }).getAttribute('href'), 'https://lu.ma/sath', `${width}: Luma contact`)
  assert.equal(await page.getByRole('navigation', { name: 'Footer navigation', exact: true })
    .getByRole('link', { name: 'Connect with Sathian', exact: true }).getAttribute('href'), '/about#follow', `${width}: footer contact route`)
  await noOverflow(page, `About ${width}`)
  await page.locator('#follow').scrollIntoViewIfNeeded()
  await screenshot(page, `about-contacts-${width}`)
}

async function checkViewport(browser, width, height) {
  currentCheck = `viewport-${width}`
  const { page, context, errors } = await setup(browser, { width, height })
  try {
    assert.equal(await page.getByRole('link', { name: 'Meet Sathian', exact: true }).count(), 1, `${width}: no repeated Meet Sathian CTA`)
    for (const item of cases) {
      const carousel = region(page, item)
      const label = `${width}: ${item.key}`
      const previous = carousel.getByRole('button', { name: 'Previous image', exact: true })
      const next = carousel.getByRole('button', { name: 'Next image', exact: true })
      await carousel.scrollIntoViewIfNeeded()
      await page.mouse.move(0, 0)
      await waitRunning(carousel, true, label + ': automatic rotation starts on visibility')
      await next.focus() // User focus stops autoplay; elapsed real time cannot race these checks.
      await checkSlide(carousel, item.key, 1, `${label}: initial`)
      await controlsInsideFrame(carousel, label)
      await screenshot(page, `home-${item.key}-${width}-slide-1`)
      for (const number of [2, 3, 4, 1]) {
        await clickWithoutTogglingDetails(next, carousel, label)
        await checkSlide(carousel, item.key, number, `${label}: next including wrap`)
        await noOverflow(page, `${label}: slide ${number}`)
        if (number !== 1) await screenshot(page, `home-${item.key}-${width}-slide-${number}`)
      }
      await clickWithoutTogglingDetails(previous, carousel, label)
      await checkSlide(carousel, item.key, 4, `${label}: previous wraps`)
      await clickWithoutTogglingDetails(next, carousel, label)
      await checkSlide(carousel, item.key, 1, `${label}: next wraps`)
      assert.equal(await carousel.locator('[aria-live]').getAttribute('aria-live'), 'polite', `${label}: manual changes announced`)
      await next.focus()
      await page.keyboard.press('Shift+Tab')
      await focused(previous, `${label}: keyboard previous`)
      await page.keyboard.press('Enter')
      await checkSlide(carousel, item.key, 4, `${label}: keyboard previous wrap`)
      await page.keyboard.press('Tab')
      await focused(next, `${label}: keyboard next`)
      await page.keyboard.press('Space')
      await checkSlide(carousel, item.key, 1, `${label}: keyboard next wrap`)
      await page.keyboard.press('Tab')
      const rotation = carousel.getByRole('button', { name: 'Start automatic rotation', exact: true })
      await focused(rotation, `${label}: keyboard rotation control`)
      const detailsBefore = await detailsState(carousel)
      await page.keyboard.press('Space')
      await carousel.getByRole('button', { name: 'Pause automatic rotation', exact: true }).waitFor()
      assert.equal(await detailsState(carousel), detailsBefore, `${label}: keyboard play leaves details unchanged`)
      await page.keyboard.press('Space')
      await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).waitFor()
      await page.keyboard.press('Tab')
      assert(await carousel.evaluate(el => !el.contains(document.activeElement)), `${label}: no keyboard trap`)
      if (item.key !== 'hero') {
        const card = carousel.locator('xpath=..')
        const summary = card.locator('summary')
        assert.equal(await detailsState(carousel), false, `${label}: initially collapsed details`)
        await summary.click()
        assert.equal(await detailsState(carousel), true, `${label}: summary opens details`)
        await clickWithoutTogglingDetails(next, carousel, `${label}: open details`)
        await checkSlide(carousel, item.key, 2, `${label}: open details next`)
        await clickWithoutTogglingDetails(previous, carousel, `${label}: open details`)
        await checkSlide(carousel, item.key, 1, `${label}: open details previous`)
        await summary.click()
        assert.equal(await detailsState(carousel), false, `${label}: summary closes details`)
      }
    }
    await checkStaticCards(page, String(width))
    await checkAbout(page, width)
    assert.deepEqual(errors, [], `${width}: no uncaught browser errors`)
    receipt.checks.push({ name: currentCheck, passed: true, carousels: 4, decodedSlides: 16,
      staticCards: 2, controlsInsideFrames: true, detailsIndependent: true, about: true, contacts: true })
    console.log(`PASS ${width}px: 4 carousels, 16 decoded exact-source slides, 2 static cards, wrap, keyboard, in-frame controls, details, overflow, About/contacts`)
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}

async function waitRunning(carousel, running, label) {
  await eventually(async () => await carousel.getAttribute('data-running') === String(running), `${label}: running=${running}`)
}

async function ready(carousel, label) {
  await eventually(async () => await carousel.getAttribute('data-ready') === 'true', `${label}: next image preloaded and decoded`)
}

async function restart(page, carousel) {
  // Explicit keyboard Play restarts after focus has stopped rotation.
  const rotation = carousel.getByRole('button', { name: /(?:Start|Pause) automatic rotation/ })
  await rotation.focus()
  // Moving focus within a carousel still fires onFocusCapture. If it already
  // held focus, move to Next first to guarantee an intentional fresh start.
  await carousel.getByRole('button', { name: 'Next image', exact: true }).focus()
  await rotation.focus()
  await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).waitFor()
  await page.mouse.move(0, 0)
  await page.keyboard.press('Enter')
  await carousel.getByRole('button', { name: 'Pause automatic rotation', exact: true }).waitFor()
  await waitRunning(carousel, true, 'Restart')
}

async function installTimerProbe(page) {
  // Installed after Playwright's clock, before the timers under test are made.
  // Record actual callbacks and cancellation without changing timing or behavior.
  await page.evaluate(() => {
    const originalSet = window.setTimeout.bind(window)
    const originalClear = window.clearTimeout.bind(window)
    const records = []
    window.__carouselTimerProbe = records
    window.setTimeout = (callback, delay, ...args) => {
      if (Number(delay) !== 1000 || typeof callback !== 'function') return originalSet(callback, delay, ...args)
      const record = { id: 0, source: callback.toString(), fired: 0, cleared: false }
      record.id = originalSet((...values) => { record.fired++; return callback(...values) }, delay, ...args)
      records.push(record)
      return record.id
    }
    window.clearTimeout = id => {
      const record = records.find(item => item.id === id)
      if (record) record.cleared = true
      return originalClear(id)
    }
  })
}

async function timerSnapshot(page) {
  return page.evaluate(() => window.__carouselTimerProbe.map(record => ({ ...record })))
}

async function stopAndCheckTimers(page, carousel, item, timerSources, mode) {
  const allBefore = await page.locator(selector).evaluateAll(elements => elements.map(el => el.getAttribute('data-slide')))
  if (mode === 'offscreen') {
    await page.getByRole('navigation', { name: 'Footer navigation', exact: true }).scrollIntoViewIfNeeded()
    await eventually(async () => (await page.locator(selector).evaluateAll(elements => elements.every(el => el.dataset.running === 'false'))),
      'All carousel timers stopped offscreen')
  } else {
    // The browser automation remains foreground. Exercise the real app's
    // visibilitychange handler with a controlled document.hidden signal.
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await waitRunning(carousel, false, 'Hidden page')
  }
  const recordsBefore = await timerSnapshot(page)
  const relevant = recordsBefore.filter(record => timerSources.has(record.source))
  assert(relevant.length > 0, `${mode}: recorded carousel timers`)
  assert(relevant.every(record => record.cleared || record.fired > 0), `${mode}: no live scheduled carousel callback remains`)
  const callbacksBefore = relevant.reduce((sum, record) => sum + record.fired, 0)
  await page.clock.fastForward(interval * 3)
  const recordsAfter = (await timerSnapshot(page)).filter(record => timerSources.has(record.source))
  assert.equal(recordsAfter.reduce((sum, record) => sum + record.fired, 0), callbacksBefore, `${mode}: no carousel callbacks fired`)
  assert.deepEqual(await page.locator(selector).evaluateAll(elements => elements.map(el => el.getAttribute('data-slide'))), allBefore,
    `${mode}: no carousel advances`)
  if (mode === 'hidden') await page.evaluate(() => {
    delete document.hidden
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await carousel.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await waitRunning(carousel, true, `${mode}: resumed when visible`)
  await ready(carousel, `${mode}: resumed preload`)
  const before = Number(await carousel.getAttribute('data-slide'))
  await page.clock.fastForward(interval)
  await checkSlide(carousel, item.key, before % 4 + 1, `${mode}: resumed after one fresh second`)
}

async function checkTiming(browser) {
  currentCheck = 'clock-timing'
  const { page, context, errors } = await setup(browser, { width: 1440, height: 1000 })
  try {
    // Isolate each timer under test; focus stops each carousel through its real UX.
    for (const item of cases) await region(page, item).getByRole('button', { name: 'Next image', exact: true }).focus()
    await installTimerProbe(page)
    const timerSources = new Set()
    for (const item of cases) {
      const carousel = region(page, item)
      await carousel.scrollIntoViewIfNeeded()
      // Other visible mini carousels can have advanced during earlier cases.
      await carousel.getByRole('button', { name: 'Next image', exact: true }).focus()
      while (await carousel.getAttribute('data-slide') !== '1') {
        const before = Number(await carousel.getAttribute('data-slide'))
        await carousel.getByRole('button', { name: 'Next image', exact: true }).click()
        await checkSlide(carousel, item.key, before % 4 + 1, `${item.key}: reset via normal controls`)
      }
      const timerCountBefore = (await timerSnapshot(page)).length
      await restart(page, carousel)
      await ready(carousel, `${item.key}: preload before exact clock checks`)
      const scheduled = (await timerSnapshot(page)).slice(timerCountBefore).filter(record => !record.cleared)
      assert.equal(scheduled.length, 1, `${item.key}: one scheduled rotation timeout after restart`)
      timerSources.add(scheduled[0].source)
      assert.equal(await carousel.locator('[aria-live]').getAttribute('aria-live'), 'off', `${item.key}: automatic changes not announced`)
      await page.clock.fastForward(interval - 1)
      await checkSlide(carousel, item.key, 1, `${item.key}: no rotation before 1000ms`)
      await page.clock.fastForward(1)
      await checkSlide(carousel, item.key, 2, `${item.key}: exactly 1000ms when preloaded`)
      for (const number of [3, 4, 1]) {
        await ready(carousel, `${item.key}: next preloaded`)
        await page.clock.fastForward(interval)
        await checkSlide(carousel, item.key, number, `${item.key}: automatic wrap`)
      }
      await carousel.hover()
      await waitRunning(carousel, false, `${item.key}: hover`)
      await page.clock.fastForward(interval * 2)
      await checkSlide(carousel, item.key, 1, `${item.key}: hover pauses`)
      await page.mouse.move(0, 0)
      await waitRunning(carousel, true, `${item.key}: hover exit`)
      await ready(carousel, `${item.key}: hover exit preload`)
      await page.clock.fastForward(interval - 1)
      await checkSlide(carousel, item.key, 1, `${item.key}: hover exit fresh interval`)
      await page.clock.fastForward(1)
      await checkSlide(carousel, item.key, 2, `${item.key}: hover exit resumes`)
      await carousel.getByRole('button', { name: 'Next image', exact: true }).focus()
      await waitRunning(carousel, false, `${item.key}: focus`)
      await page.clock.fastForward(interval * 2)
      await checkSlide(carousel, item.key, 2, `${item.key}: focus stops`)
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      assert(await carousel.evaluate(el => !el.contains(document.activeElement)), `${item.key}: focus left carousel`)
      await page.clock.fastForward(interval * 2)
      await checkSlide(carousel, item.key, 2, `${item.key}: focus stop persists`)
      await restart(page, carousel)
      await page.keyboard.press('Tab') // Focus outside the carousel before pointer Pause.
      await clickWithoutTogglingDetails(carousel.getByRole('button', { name: 'Pause automatic rotation', exact: true }), carousel, item.key)
      await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).waitFor()
      await page.mouse.move(0, 0)
      await page.clock.fastForward(interval * 2)
      await checkSlide(carousel, item.key, 2, `${item.key}: pointer Pause remains stopped`)
      await clickWithoutTogglingDetails(carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }), carousel, item.key)
      await page.mouse.move(0, 0)
      await waitRunning(carousel, true, `${item.key}: pointer Play`)
      await ready(carousel, `${item.key}: pointer Play preload`)
      await page.clock.fastForward(interval)
      await checkSlide(carousel, item.key, 3, `${item.key}: pointer Play resumes`)
      await stopAndCheckTimers(page, carousel, item, timerSources, 'offscreen')
      await stopAndCheckTimers(page, carousel, item, timerSources, 'hidden')
      await carousel.getByRole('button', { name: 'Next image', exact: true }).focus()
    }
    assert.deepEqual(errors, [], 'No uncaught timing errors')
    receipt.checks.push({ name: currentCheck, passed: true, carousels: 4, intervalMs: interval,
      exactWhenPreloaded: true, hover: true, focus: true, pauseAndPlay: true,
      offscreenCallbacks: 0, hiddenCallbacks: 0, hiddenSignal: 'simulated document.hidden + real visibilitychange handler' })
    console.log('PASS clock: all 4 carousels at exactly 1000ms preloaded, automatic wrap, hover, focus, Pause/Play, no offscreen/hidden callbacks')
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}

async function checkReducedMotion(browser) {
  currentCheck = 'reduced-motion'
  const { page, context, errors } = await setup(browser, { width: 390, height: 844 }, 'reduce')
  try {
    for (const item of cases) {
      const carousel = region(page, item)
      await carousel.scrollIntoViewIfNeeded()
      const rotation = carousel.getByRole('button', { name: 'Automatic rotation off: reduced motion', exact: true })
      assert(await rotation.isDisabled(), `${item.key}: reduced motion disables rotation`)
      assert.equal(await carousel.locator('[aria-live]').getAttribute('aria-live'), 'polite', `${item.key}: manual changes announced`)
      await page.clock.fastForward(interval * 3)
      await checkSlide(carousel, item.key, 1, `${item.key}: reduced motion never advances`)
      await clickWithoutTogglingDetails(carousel.getByRole('button', { name: 'Next image', exact: true }), carousel, item.key)
      await checkSlide(carousel, item.key, 2, `${item.key}: reduced motion manual next`)
      await clickWithoutTogglingDetails(carousel.getByRole('button', { name: 'Previous image', exact: true }), carousel, item.key)
      await checkSlide(carousel, item.key, 1, `${item.key}: reduced motion manual previous`)
      await page.clock.fastForward(interval * 2)
      await checkSlide(carousel, item.key, 1, `${item.key}: manual use does not enable autoplay`)
      await noOverflow(page, `${item.key}: reduced motion mobile`)
      await screenshot(page, `home-${item.key}-reduced-motion`)
    }
    assert.deepEqual(errors, [], 'No uncaught reduced-motion errors')
    receipt.checks.push({ name: currentCheck, passed: true, carousels: 4, automaticDisabled: true, manualEnabled: true })
    console.log('PASS reduced motion: all 4 carousels disable automatic rotation and permit manual browsing')
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}

async function checkTouch(browser) {
  currentCheck = 'touch-pause-resume'
  const { page, context, errors } = await setup(browser, { width: 390, height: 844 }, 'no-preference', false,
    { isMobile: true, hasTouch: true })
  try {
    assert(await page.evaluate(() => navigator.maxTouchPoints > 0), 'True touch-enabled browser context')
    // Adjacent mini cards share the viewport; stop them so each touch case has a known initial slide.
    for (const item of cases) await region(page, item).getByRole('button', { name: 'Next image', exact: true }).focus()
    for (const item of cases) {
      const carousel = region(page, item)
      await carousel.scrollIntoViewIfNeeded()
      await checkSlide(carousel, item.key, 1, `${item.key}: touch initial`)
      await carousel.getByRole('button', { name: 'Next image', exact: true }).tap()
      await checkSlide(carousel, item.key, 2, `${item.key}: touch manual next`)
      await waitRunning(carousel, false, `${item.key}: touch manual navigation pauses`)
      await page.clock.fastForward(interval * 2)
      await checkSlide(carousel, item.key, 2, `${item.key}: touch manual pause persists`)
      await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).tap()
      // No synthetic mouse move: a touchscreen has no hover-exit gesture.
      await waitRunning(carousel, true, `${item.key}: touchscreen Play really resumes`)
      await ready(carousel, `${item.key}: touch Play preload`)
      await page.clock.fastForward(interval)
      await checkSlide(carousel, item.key, 3, `${item.key}: touch Play advances at 1000ms`)
      await carousel.getByRole('button', { name: 'Pause automatic rotation', exact: true }).tap()
      await waitRunning(carousel, false, `${item.key}: touch Pause really stops`)
      await page.clock.fastForward(interval * 2)
      await checkSlide(carousel, item.key, 3, `${item.key}: touch Pause persists`)
    }
    assert.deepEqual(errors, [], 'No uncaught touch errors')
    receipt.checks.push({ name: currentCheck, passed: true, carousels: 4, isMobile: true, hasTouch: true,
      manualNavigationPauses: true, explicitPlayActuallyRotates: true, pausePersists: true })
    console.log('PASS touch: all four carousels pause on manual taps, resume on Play without hover exit, and pause explicitly')
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}
async function checkSlowNetwork(browser) {
  currentCheck = 'slow-network'
  const { page, context, hero, errors } = await setup(browser, { width: 1440, height: 1000 }, 'no-preference', true)
  try {
    await waitRunning(hero, true, 'Slow network autoplay starts')
    // The first slide is decoded. Its successor must still use a real uncached
    // image request; only the browser's network latency is emulated.
    assert.equal(await hero.getAttribute('data-ready'), 'false', 'Slow network: successor still downloading')
    await page.clock.fastForward(interval)
    await checkSlide(hero, 'hero', 1, 'Slow network holds last decoded image after one second')
    await eventually(async () => await hero.getAttribute('data-slide') === '2', 'Slow successor eventually decodes', 30_000)
    await checkSlide(hero, 'hero', 2, 'Slow successor swaps only after decode')
    await screenshot(page, 'home-carousel-slow-network')
    assert.deepEqual(errors, [], 'No uncaught slow-network errors')
    receipt.checks.push({ name: currentCheck, passed: true, latencyMs: 1600, downloadBytesPerSecond: 250000,
      heldDecodedImagePastDeadline: true, eventualRealImageDecoded: true })
    console.log('PASS slow real network: current image retained past 1000ms, successor shown only after decode')
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}

;(async () => {
  assert(['http:', 'https:'].includes(new URL(base).protocol), 'SITE_URL must be HTTP(S)')
  for (const { key } of cases) assert.equal(catalog[key].length, 4, `${key}: exact expected catalog size`)
  fs.mkdirSync(proof, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  try {
    for (const [width, height] of [[1440, 1000], [390, 844], [320, 740]]) await checkViewport(browser, width, height)
    await checkTiming(browser)
    await checkReducedMotion(browser)
    await checkTouch(browser)
    await checkSlowNetwork(browser)
    receipt.passed = true
  } catch (error) {
    receipt.passed = false
    receipt.failure = { check: currentCheck, message: error.message }
    if (currentPage && !currentPage.isClosed()) await screenshot(currentPage, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally {
    receipt.finishedAt = new Date().toISOString()
    fs.writeFileSync(path.join(proof, 'home-carousel-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`)
    await browser.close()
  }
  console.log(`Home carousel regression passed. Evidence: ${proof}`)
})().catch(error => { console.error(error); process.exitCode = 1 })
