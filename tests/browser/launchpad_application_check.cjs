const { mkdirSync } = require('node:fs')
const { join, resolve } = require('node:path')
const { chromium } = require('playwright')

const BASE_URL = `${(process.env.SITE_URL || 'http://127.0.0.1:3013').replace(/\/$/, '')}/launchpad`
const ROOT = resolve(__dirname, '../..')
const OUTPUT = join(ROOT, 'docs', 'operations', '2026-09-03-launchpad-local-review')
mkdirSync(OUTPUT, { recursive: true })

async function inspectViewport(page, name, width, height) {
  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  await page.setViewportSize({ width, height })
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 })

  const heading = page.getByRole('heading', { name: 'Tooth Fairy Network', exact: true })
  await heading.waitFor({ state: 'visible' })
  const video = page.locator('video')
  await video.waitFor({ state: 'visible' })
  await page.waitForFunction(
    () => document.querySelector('video')?.readyState >= 1,
    null,
    { timeout: 30_000 },
  )

  const media = await video.evaluate((element) => ({
    readyState: element.readyState,
    duration: element.duration,
    controls: element.controls,
    playsInline: element.playsInline,
    tracks: element.textTracks.length,
    trackMode: element.textTracks[0]?.mode || null,
    poster: element.poster,
  }))
  if (media.readyState < 1) throw new Error(`Video metadata unavailable: ${JSON.stringify(media)}`)
  if (!(media.duration > 146 && media.duration < 149)) throw new Error(`Unexpected duration: ${media.duration}`)
  if (!media.controls || !media.playsInline || media.tracks !== 1 || media.trackMode !== 'showing') {
    throw new Error(`Video contract failed: ${JSON.stringify(media)}`)
  }
  if (!media.poster.endsWith('/media/launchpad/sathian-launchpad-poster.jpg')) {
    throw new Error(`Unexpected poster: ${media.poster}`)
  }

  await video.evaluate((element) => element.play())
  await page.waitForTimeout(900)
  const currentTime = await video.evaluate((element) => element.currentTime)
  await video.evaluate((element) => element.pause())
  if (currentTime <= 0.2) throw new Error(`Playback did not advance: ${currentTime}`)

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow > 1) throw new Error(`Horizontal overflow: ${overflow}px`)
  const robots = await page.locator('meta[name="robots"]').getAttribute('content')
  if (robots !== 'noindex, nofollow') throw new Error(`Unexpected robots metadata: ${robots}`)
  if (!(await page.locator('[data-site-agent-root]').isHidden())) {
    throw new Error('Site agent is visible on the application page')
  }
  if (!(await page.getByRole('link', { name: 'Tooth Fairy Network ↗' }).isVisible())) {
    throw new Error('Project link is not visible')
  }

  await page.locator('body').click({ position: { x: 4, y: 4 } })
  await page.keyboard.press('Tab')
  const firstFocus = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    href: document.activeElement?.getAttribute('href'),
  }))
  await page.keyboard.press('Tab')
  const secondFocus = await page.evaluate(() => document.activeElement?.tagName)
  if (firstFocus.tag !== 'A' || firstFocus.href !== '/' || secondFocus !== 'VIDEO') {
    throw new Error(`Unexpected keyboard order: ${JSON.stringify({ firstFocus, secondFocus })}`)
  }

  const screenshot = join(OUTPUT, `${name}.png`)
  await page.screenshot({ path: screenshot, fullPage: true })
  if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`)

  return {
    viewport: `${width}x${height}`,
    duration: Number(media.duration.toFixed(3)),
    playbackAdvancedTo: Number(currentTime.toFixed(3)),
    overflowPixels: overflow,
    consoleErrors,
    screenshot,
  }
}

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const desktop = await browser.newPage()
    const mobile = await browser.newPage()
    await mobile.emulateMedia({ reducedMotion: 'reduce' })
    const results = [
      await inspectViewport(desktop, 'desktop-1440x1000', 1440, 1000),
      await inspectViewport(mobile, 'mobile-390x844', 390, 844),
    ]
    for (const result of results) console.log(result)
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
