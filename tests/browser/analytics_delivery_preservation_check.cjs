const { chromium } = require('playwright')
const fs = require('node:fs')
const base = (process.env.SITE_URL || 'http://127.0.0.1:3337').replace(/\/$/, '')
const check = (value, message) => { if (!value) throw new Error(message) }
;(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--mute-audio'], executablePath: process.env.MARKETING_BROWSER_EXECUTABLE || undefined })
  let release
  const held = new Promise(resolve => { release = resolve })
  let requests = 0, requestedId
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await page.route('**/api/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }))
    await page.route(/google-analytics|_vercel\/insights/, route => route.abort())
    await page.route('https://www.googletagmanager.com/gtag/js?*', async route => {
      requests++; requestedId = new URL(route.request().url()).searchParams.get('id')
      await held
      await route.fulfill({ status: 200, contentType: 'text/javascript', body: 'window.__gaDeliverySnapshot = (window.dataLayer || []).map(args => Array.from(args));' })
    })
    const response = await page.goto(base + '/?gclid=qa-synthetic-not-an-ad-click', { waitUntil: 'domcontentloaded' })
    const html = await response.text()
    check([...html.matchAll(/<link\b[^>]*>/g)].some(match => /rel="preload"/.test(match[0]) && /googletagmanager/.test(match[0])), 'Existing analytics delivery priority changed')
    await page.waitForFunction(() => (window.dataLayer || []).some(args => args[0] === 'event' && args[1] === 'page_view'))
    check(await page.evaluate(() => !window.__gaDeliverySnapshot), 'Library should still be held for the early-event queue test')
    check(await page.evaluate(() => sessionStorage.getItem('sathian-ad-click-gclid') === 'qa-synthetic-not-an-ad-click'), 'First-touch click identity was lost')
    await page.getByRole('link', { name: 'See the Tooth Fairy Network gift', exact: true }).click()
    await page.waitForURL('**/village')
    await page.waitForFunction(() => (window.dataLayer || []).some(args => args[0] === 'event' && args[1] === 'page_view' && args[2]?.page_path === '/village'))
    const queued = await page.evaluate(() => window.dataLayer.map(args => Array.from(args)))
    const config = queued.filter(args => args[0] === 'config')
    check(config.length === 1 && config[0][1] === requestedId, 'Analytics configuration changed or duplicated')
    check(config[0][2].anonymize_ip === true && config[0][2].send_page_view === false, 'Existing analytics policy changed')
    const views = queued.filter(args => args[0] === 'event' && args[1] === 'page_view')
    check(views.length === 2 && views[0][2].page_path === '/' && views[1][2].page_path === '/village', 'Initial or navigation page view was lost/duplicated')
    check(views[0][2].page_location === base + '/?gclid=qa-synthetic-not-an-ad-click' && views[1][2].page_location === base + '/village', 'Page locations or attribution changed')
    check(queued.filter(args => args[0] === 'event' && args[1] === 'village_opened').length === 1, 'The early CTA event was lost/duplicated')
    release()
    await page.waitForFunction(() => Array.isArray(window.__gaDeliverySnapshot))
    check(requests === 1, 'Analytics library fetched more than once')
    check(await page.evaluate(() => sessionStorage.getItem('sathian-ad-click-gclid') === 'qa-synthetic-not-an-ad-click'), 'Click identity did not survive navigation')
    await page.goto(base + '/learn', { waitUntil: 'networkidle' })
    check(requests === 1, 'Learning pages started loading the Google library')
    check(await page.evaluate(() => typeof window.gtag === 'undefined'), 'Learning route analytics exclusion changed')
    const receipt = { existingSSRPreloadPreserved: true, analyticsLibraryRequested: true, initialAndNavigationViews: 2, earlyCTAEventPreserved: true, singleConfigAndLibrary: true, clickIdentityPreserved: true, learningExclusionPreserved: true, externalAnalyticsCalls: 'intercepted; no real collection or purchase' }
    fs.writeFileSync(process.env.ANALYTICS_PROOF_FILE || '../nov2-analytics-delivery-check.json', JSON.stringify(receipt, null, 2)); console.log(JSON.stringify(receipt))
  } finally { release(); await browser.close() }
})().catch(error => { console.error(error); process.exit(1) })
