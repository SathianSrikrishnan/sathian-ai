// Standalone: SITE_URL=http://127.0.0.1:3212 BROWSER_PROOF_DIR=<directory>
// node tests/browser/home_carousel_check.cjs
// Only /api/agent requests are mocked. Images, pages and navigation remain real.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { chromium } = require('playwright')

const base = (process.env.SITE_URL || 'http://127.0.0.1:3212').replace(/\/+$/, '')
const proof = path.resolve(process.env.BROWSER_PROOF_DIR || path.join(os.tmpdir(), 'home-carousel-proof'))
const interval = 180_000
const selector = '[role="region"][aria-roledescription="carousel"]'
const images = [
  '/village/review-oct31/proof-and-certificate-usdc.webp',
  '/village/process-oct31/family-gives-again.webp',
  '/village/network-oct31/01-network-circle.webp',
  '/village/network-oct31/02-network-picnic.webp',
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
const receipt = { site: base, startedAt: new Date().toISOString(), checks: [], mockedAgentRequests: 0 }
let currentPage
let currentCheck = 'launch'

async function checkSlide(page, number, label) {
  const carousel = page.locator(selector)
  await carousel.locator(`[aria-roledescription="slide"][aria-label="${number} of 4"]`).waitFor()
  assert.equal(await carousel.getAttribute('data-slide'), String(number), `${label}: slide number`)
  assert.equal(await carousel.locator('img').count(), 1, `${label}: exactly one carousel image`)
  assert.equal(await carousel.locator('[aria-roledescription="slide"]').count(), 1, `${label}: only one rendered slide`)
  const image = carousel.locator('img')
  const data = await image.evaluate(async img => {
    await img.decode()
    const url = new URL(img.currentSrc, location.href)
    return {
      src: url.pathname === '/_next/image' ? url.searchParams.get('url') : url.pathname,
      width: img.naturalWidth, height: img.naturalHeight, alt: img.alt,
    }
  })
  assert.equal(data.src, images[number - 1], `${label}: approved artwork ${number}`)
  assert(data.width > 0 && data.height > 0, `${label}: image ${number} decoded`)
  assert(data.alt.trim().length > 20, `${label}: meaningful alternative text`)
}

async function noOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }))
  assert(dimensions.document <= dimensions.width + 1 && dimensions.body <= dimensions.width + 1,
    `${label}: horizontal overflow ${JSON.stringify(dimensions)}`)
}

async function screenshot(page, name, fullPage = false) {
  await page.screenshot({ path: path.join(proof, `${name}.png`), fullPage, animations: 'disabled' })
}

async function setup(browser, viewport, reducedMotion = 'no-preference', useClock = false) {
  const context = await browser.newContext({ viewport, reducedMotion })
  // Preview bypass is only sent to this site's origin, never to analytics or
  // external media. This continues real requests; it is not a response mock.
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
  // Install before application code creates timers so clearTimeout and the
  // carousel's initial timeout always belong to the same clock.
  if (useClock) await page.clock.install()
  const response = await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  assert(response && response.ok(), `Homepage response: ${response?.status()}`)
  const carousel = page.locator(selector)
  await carousel.waitFor()
  assert.equal(await carousel.count(), 1, 'One hero carousel, not a second gallery')
  assert.equal(await page.locator('.village-home-hero img').count(), 1, 'Only one image in the hero')
  assert.equal(await carousel.getAttribute('aria-label'), "A child's village", 'Carousel accessible name')
  await carousel.getByRole('button', { name: reducedMotion === 'reduce'
    ? 'Automatic rotation off: reduced motion' : 'Pause automatic rotation', exact: true }).waitFor()
  await checkSlide(page, 1, 'initial')
  await carousel.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  return { page, context, carousel, errors }
}

async function focused(locator, label) {
  assert(await locator.evaluate(el => el === document.activeElement), `${label}: keyboard focus`)
  const outline = await locator.evaluate(el => {
    const style = getComputedStyle(el)
    return { width: parseFloat(style.outlineWidth), style: style.outlineStyle }
  })
  assert(outline.width >= 2 && outline.style !== 'none', `${label}: visible keyboard focus`)
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
  const { page, context, carousel, errors } = await setup(browser, { width, height })
  try {
    assert.equal(await page.getByRole('link', { name: 'Meet Sathian', exact: true }).count(), 1, `${width}: no repeated Meet Sathian CTA`)
    const previous = carousel.getByRole('button', { name: 'Previous image', exact: true })
    const next = carousel.getByRole('button', { name: 'Next image', exact: true })
    for (const button of await carousel.getByRole('button').all()) {
      const box = await button.boundingBox()
      assert(box && box.width >= 44 && box.height >= 44, `${width}: 44px carousel control targets`)
    }
    await screenshot(page, `home-carousel-${width}-slide-1`)
    for (const number of [2, 3, 4, 1]) {
      await next.click()
      await checkSlide(page, number, `${width}: next including wrap`)
      await noOverflow(page, `Home ${width}, slide ${number}`)
      if (number !== 1) await screenshot(page, `home-carousel-${width}-slide-${number}`)
    }
    await previous.click()
    await checkSlide(page, 4, `${width}: previous wraps to last`)
    await next.click()
    await checkSlide(page, 1, `${width}: next wraps back to first`)
    assert.equal(await carousel.locator('[aria-live]').getAttribute('aria-live'), 'polite', `${width}: manual navigation announced`)
    await carousel.getByRole('link').focus()
    await page.keyboard.press('Tab')
    await focused(previous, `${width}: previous`)
    await page.keyboard.press('Enter')
    await checkSlide(page, 4, `${width}: keyboard previous`)
    await page.keyboard.press('Tab')
    await focused(carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }), `${width}: rotation control`)
    await page.keyboard.press('Tab')
    await focused(next, `${width}: next`)
    await page.keyboard.press('Space')
    await checkSlide(page, 1, `${width}: keyboard next`)
    await page.keyboard.press('Tab')
    assert(await carousel.evaluate(el => !el.contains(document.activeElement)), `${width}: no keyboard trap`)
    await checkAbout(page, width)
    assert.deepEqual(errors, [], `${width}: no uncaught browser errors`)
    receipt.checks.push({ name: currentCheck, passed: true, slides: 4, about: true, contacts: true })
    console.log(`PASS ${width}px: one carousel, four decoded slides, wrap, keyboard, no overflow, About and contacts`)
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}

async function freezeTime(page) {
  const now = await page.evaluate(() => Date.now())
  await page.clock.pauseAt(new Date(now + 1_000))
}

async function restart(page, carousel) {
  // Focusing stops rotation. Explicit keyboard activation then starts a fresh
  // interval without leaving a pointer hovering over the carousel.
  const rotation = carousel.getByRole('button', { name: /(?:Start|Pause) automatic rotation/ })
  await rotation.focus()
  await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).waitFor()
  await page.mouse.move(0, 0)
  await page.keyboard.press('Enter')
  await carousel.getByRole('button', { name: 'Pause automatic rotation', exact: true }).waitFor()
}

async function checkTiming(browser) {
  currentCheck = 'clock-timing'
  const { page, context, carousel, errors } = await setup(browser, { width: 1440, height: 1000 }, 'no-preference', true)
  try {
    await freezeTime(page)
    await restart(page, carousel)
    assert.equal(await carousel.locator('[aria-live]').getAttribute('aria-live'), 'off', 'Automatic changes are not announced')
    await page.clock.fastForward(interval - 1)
    await checkSlide(page, 1, 'No rotation before 180000ms')
    await page.clock.fastForward(1)
    await checkSlide(page, 2, 'Rotation at exactly 180000ms')
    for (const number of [3, 4, 1]) {
      await page.clock.fastForward(interval)
      await checkSlide(page, number, 'Automatic rotation and wrap')
    }

    await carousel.hover()
    await page.clock.fastForward(interval * 2)
    await checkSlide(page, 1, 'Hover pauses automatic rotation')
    await page.mouse.move(0, 0)
    await page.clock.fastForward(interval - 1)
    await checkSlide(page, 1, 'Leaving hover starts a fresh interval')
    await page.clock.fastForward(1)
    await checkSlide(page, 2, 'Leaving hover resumes rotation')

    await carousel.getByRole('button', { name: 'Next image', exact: true }).focus()
    await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).waitFor()
    await page.clock.fastForward(interval * 2)
    await checkSlide(page, 2, 'Keyboard focus stops rotation')
    await page.keyboard.press('Tab')
    assert(await carousel.evaluate(el => !el.contains(document.activeElement)), 'Focus left carousel')
    await page.clock.fastForward(interval * 2)
    await checkSlide(page, 2, 'Rotation stays stopped after focus leaves')

    await restart(page, carousel)
    // Focus elsewhere first: pointerdown must remember Pause intent before
    // focus capture stops the carousel, rather than accidentally restarting it.
    await page.getByRole('link', { name: 'Meet Sathian', exact: true }).focus()
    await carousel.getByRole('button', { name: 'Pause automatic rotation', exact: true }).click()
    await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).waitFor()
    await page.mouse.move(0, 0)
    await page.clock.fastForward(interval * 2)
    await checkSlide(page, 2, 'Pointer Pause remains paused after leaving hover')
    await carousel.getByRole('button', { name: 'Start automatic rotation', exact: true }).click()
    await page.mouse.move(0, 0)
    await page.clock.fastForward(interval)
    await checkSlide(page, 3, 'Pointer Play explicitly restarts rotation')
    assert.deepEqual(errors, [], 'No uncaught errors during clock checks')
    receipt.checks.push({ name: currentCheck, passed: true, intervalMs: interval, hover: true, focus: true, pauseAndPlay: true })
    console.log('PASS clock: exact 180000ms, automatic wrap, hover pause, persistent focus stop, pointer Pause/Play')
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}

async function checkReducedMotion(browser) {
  currentCheck = 'reduced-motion'
  const { page, context, carousel, errors } = await setup(browser, { width: 390, height: 844 }, 'reduce', true)
  try {
    const rotation = carousel.getByRole('button', { name: 'Automatic rotation off: reduced motion', exact: true })
    assert(await rotation.isDisabled(), 'Reduced motion disables automatic rotation control')
    assert.equal(await carousel.locator('[aria-live]').getAttribute('aria-live'), 'polite', 'Reduced motion manual changes announced')
    await freezeTime(page)
    await page.clock.fastForward(interval * 3)
    await checkSlide(page, 1, 'Reduced motion never auto-advances')
    await carousel.getByRole('button', { name: 'Next image', exact: true }).click()
    await checkSlide(page, 2, 'Reduced motion permits manual next')
    await carousel.getByRole('button', { name: 'Previous image', exact: true }).click()
    await checkSlide(page, 1, 'Reduced motion permits manual previous')
    await page.clock.fastForward(interval * 2)
    await checkSlide(page, 1, 'Manual navigation does not enable reduced-motion rotation')
    await noOverflow(page, 'Reduced-motion mobile')
    await screenshot(page, 'home-carousel-reduced-motion')
    assert.deepEqual(errors, [], 'No uncaught errors with reduced motion')
    receipt.checks.push({ name: currentCheck, passed: true, automaticDisabled: true, manualEnabled: true })
    console.log('PASS reduced motion: automatic rotation disabled, manual browsing works')
  } catch (error) {
    await screenshot(page, `failure-${currentCheck}`, true).catch(() => {})
    throw error
  } finally { await context.close() }
}

;(async () => {
  assert(['http:', 'https:'].includes(new URL(base).protocol), 'SITE_URL must be an HTTP(S) URL')
  fs.mkdirSync(proof, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  try {
    for (const [width, height] of [[1440, 1000], [390, 844], [320, 740]]) await checkViewport(browser, width, height)
    await checkTiming(browser)
    await checkReducedMotion(browser)
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
