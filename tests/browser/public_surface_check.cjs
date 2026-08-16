const { chromium } = require('playwright')
const { mkdirSync } = require('node:fs')
const { join } = require('node:path')

const baseUrl = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const canonicalOrigin = (process.env.CANONICAL_ORIGIN || 'https://sathian.ai').replace(/\/$/, '')
const automationBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
const proofDirectory = process.env.BROWSER_PROOF_DIR

const surfaces = [
  { path: '/', heading: 'Digital Experiments', title: 'Digital Experiments | Sathian Srikrishnan' },
  { path: '/writings', heading: 'Writing.', title: 'Writing | sathian.ai' },
  { path: '/hackathons', heading: 'Ideas meet the clock.', title: 'Hackathons | sathian.ai' },
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
        title: document.title,
      }
    })

    assert(state.title === surface.title, `${label} ${surface.path}: unexpected document title ${JSON.stringify(state.title)}`)
    assert(state.description.length >= 50, `${label} ${surface.path}: missing useful meta description`)
    assert(state.canonical === `${canonicalOrigin}${surface.path}`, `${label} ${surface.path}: unexpected canonical ${state.canonical}`)
    assert(state.headingCount === 1, `${label} ${surface.path}: expected one main h1, saw ${state.headingCount}`)
    assert(state.heading?.text === surface.heading, `${label} ${surface.path}: expected h1 ${JSON.stringify(surface.heading)}, saw ${JSON.stringify(state.heading?.text)}`)
    assert(!state.heading?.className.includes('sr-only'), `${label} ${surface.path}: primary title is screen-reader-only`)
    assert((state.heading?.width ?? 0) >= 120 && (state.heading?.height ?? 0) >= 40, `${label} ${surface.path}: primary title is not visually prominent`)
    assert(/Iowan Old Style|Baskerville|Georgia/.test(state.heading?.fontFamily ?? ''), `${label} ${surface.path}: primary title does not use the editorial display stack`)
    assert(!state.horizontalOverflow, `${label} ${surface.path}: horizontal overflow detected`)

    if (proofDirectory) {
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
