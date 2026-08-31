const { chromium } = require('playwright')
const { mkdirSync } = require('node:fs')
const { join } = require('node:path')

const baseUrl = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const canonicalOrigin = (process.env.CANONICAL_ORIGIN || 'https://sathian.ai').replace(/\/$/, '')
const automationBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
const proofDirectory = process.env.BROWSER_PROOF_DIR

const surfaces = [
  { path: '/', heading: 'Digital Experiments', title: 'Sathian Srikrishnan | Digital Experiments' },
  { path: '/about', heading: 'Sathian Srikrishnan', title: 'About Sathian Srikrishnan' },
  { path: '/writings', heading: 'Writing.', title: 'Writing | sathian.ai' },
  { path: '/hackathons', heading: 'Ideas meet the clock.', title: 'Hackathons | sathian.ai' },
  {
    path: '/writings/inside-monkedao',
    heading: 'InsideMonkeDAO',
    title: 'Inside MonkeDAO: A Firsthand Solana Field Report - sathian.ai',
    headingFont: /Bahnschrift|Franklin Gothic/,
    video: '/inside-monkedao/inside-monkedao-field-report-v1.9.0.mp4',
    videoDuration: 520.249,
  },
  {
    path: '/projects/solana-observatory',
    heading: 'SolanaObservatory',
    title: 'Solana Observatory — a source-visible ecosystem dashboard',
    headingFont: /Bahnschrift|Franklin Gothic/,
    video: '/projects/solana-observatory-demo.mp4',
    videoDuration: 183.175,
  },
]

const requiredSecurityHeaders = {
  'permissions-policy': 'geolocation=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function settleLazyMedia(page) {
  await page.evaluate(async () => {
    const step = Math.max(500, Math.floor(window.innerHeight * 0.8))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 35))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(300)
}

async function verifyViewport(browser, label, viewport) {
  const context = await browser.newContext({
    viewport,
    extraHTTPHeaders: automationBypassSecret
      ? { 'x-vercel-protection-bypass': automationBypassSecret }
      : undefined,
  })
  const page = await context.newPage()
  const results = []

  for (const surface of surfaces) {
    const response = await page.goto(`${baseUrl}${surface.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    })
    assert(response?.status() === 200, `${label} ${surface.path}: expected HTTP 200, received ${response?.status()}`)

    const headers = response.headers()
    for (const [name, expected] of Object.entries(requiredSecurityHeaders)) {
      assert(headers[name]?.includes(expected), `${label} ${surface.path}: missing or invalid ${name}`)
    }
    if (baseUrl.startsWith('https://')) {
      assert(headers['strict-transport-security']?.includes('max-age='), `${label} ${surface.path}: missing HSTS`)
    }

    if (surface.video) {
      await page.waitForFunction(
        () => {
          const video = document.querySelector('video')
          return Boolean(video && video.readyState >= 1 && Number.isFinite(video.duration))
        },
        { timeout: 30_000 },
      )
    }

    const state = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('main h1'))
      const heading = headings[0]
      const rect = heading?.getBoundingClientRect()
      const style = heading ? getComputedStyle(heading) : null
      return {
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
        heading: heading ? {
          className: heading.className,
          fontFamily: style?.fontFamily ?? '',
          height: rect?.height ?? 0,
          text: heading.textContent?.trim() ?? '',
          width: rect?.width ?? 0,
        } : null,
        headingCount: headings.length,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        misspelledSolana: /\bSlana\b/i.test(document.body.innerText),
        title: document.title,
        video: document.querySelector('video') ? {
          duration: document.querySelector('video').duration,
          source: document.querySelector('video source')?.getAttribute('src') ?? '',
        } : null,
      }
    })

    assert(state.title === surface.title, `${label} ${surface.path}: unexpected document title ${JSON.stringify(state.title)}`)
    assert(state.description.length >= 50, `${label} ${surface.path}: missing useful meta description`)
    assert(state.canonical === `${canonicalOrigin}${surface.path}`, `${label} ${surface.path}: unexpected canonical ${state.canonical}`)
    assert(state.headingCount === 1, `${label} ${surface.path}: expected one main h1, saw ${state.headingCount}`)
    assert(state.heading?.text === surface.heading, `${label} ${surface.path}: expected h1 ${JSON.stringify(surface.heading)}, saw ${JSON.stringify(state.heading?.text)}`)
    assert(!state.heading?.className.includes('sr-only'), `${label} ${surface.path}: primary title is screen-reader-only`)
    assert((state.heading?.width ?? 0) >= 120 && (state.heading?.height ?? 0) >= 40, `${label} ${surface.path}: primary title is not visually prominent`)
    const headingFont = surface.headingFont || /Iowan Old Style|Baskerville|Georgia/
    assert(headingFont.test(state.heading?.fontFamily ?? ''), `${label} ${surface.path}: primary title does not use the expected editorial display stack`)
    assert(!state.horizontalOverflow, `${label} ${surface.path}: horizontal overflow detected`)
    assert(!state.misspelledSolana, `${label} ${surface.path}: misspelled Solana is visible`)
    if (surface.video) {
      assert(state.video?.source === surface.video, `${label} ${surface.path}: unexpected video source ${state.video?.source}`)
      assert(Math.abs(Number(state.video?.duration) - surface.videoDuration) < 0.03, `${label} ${surface.path}: unexpected video duration ${state.video?.duration}`)
    }

    if (proofDirectory) {
      await settleLazyMedia(page)
      mkdirSync(proofDirectory, { recursive: true })
      const slug = surface.path === '/' ? 'home' : surface.path.slice(1).replaceAll('/', '-')
      await page.screenshot({ fullPage: true, path: join(proofDirectory, `${label}-${slug}.png`) })
    }

    results.push({ path: surface.path, heading: state.heading?.text, title: state.title })
  }

  await context.close()
  return { label, results }
}

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const results = [
      await verifyViewport(browser, 'desktop', { width: 1440, height: 1000 }),
      await verifyViewport(browser, 'mobile', { width: 390, height: 844 }),
    ]
    console.log(JSON.stringify({ baseUrl, results }, null, 2))
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
