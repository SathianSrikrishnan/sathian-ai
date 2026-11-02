const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const base = (process.env.SITE_URL || 'http://127.0.0.1:3317').replace(/\/$/, '')
const publicBuild = process.env.PUBLIC_MARKETING_BUILD === 'true'
const out = process.env.BROWSER_PROOF_DIR || '../nov2-speed-browser'
const assert = (ok, message) => { if (!ok) throw new Error(message) }
const loadable = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../.next/react-loadable-manifest.json'), 'utf8'))
const chatFiles = Object.entries(loadable).filter(([key]) => key.includes('-> ./ChatWidget')).flatMap(([, value]) => value.files)
assert(chatFiles.length > 0, 'Chat bundle must be identifiable for the intent-loading check')

;(async () => {
  fs.mkdirSync(out, { recursive: true })
  const browser = await chromium.launch({ headless: true, args: ['--mute-audio'], executablePath: process.env.MARKETING_BROWSER_EXECUTABLE || undefined })
  const receipt = []
  try {
    for (const [width, height] of [[1440, 1000], [390, 844], [320, 740]]) {
      const context = await browser.newContext({ viewport: { width, height }, extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET } : {} })
      await context.addInitScript(() => localStorage.setItem('sathian-agent-sound-enabled', 'false'))
      await context.route('**/api/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }))
      await context.route(/googletagmanager|google-analytics|posthog/, route => route.abort())
      const page = await context.newPage()
      const requested = []
      const servedScripts = []
      const servedStyles = []
      const chatLoaded = async () => publicBuild ? (await Promise.all(servedScripts)).some(text => text.includes('Ask a question')) : requested.some(url => chatFiles.some(file => url.includes(file)))
      page.on('request', request => requested.push(request.url()))
      page.on('response', response => { if (/\/_next\/static\/css\//.test(response.url())) servedStyles.push(response.text().catch(() => '')); })
      if (publicBuild) page.on('response', response => { if (/\/_next\/static\/chunks\/.*\.js(?:\?|$)/.test(response.url())) servedScripts.push(response.text().catch(() => '')); })
      for (const route of ['/', '/village']) {
        requested.length = 0
        servedScripts.length = 0
        servedStyles.length = 0
        const response = await page.goto(base + route, { waitUntil: 'networkidle' })
        assert(response.status() === 200, `${route}: intended page must load`)
        await page.waitForTimeout(1200)
        if (route === '/') assert(await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('/api/agent/event') && entry.responseEnd > 0)), 'Session receipt response must finish without loading chat')
        assert(!(await Promise.all(servedStyles)).some(text => text.includes('--secondary-surface-styles')), `${route}: secondary styles downloaded speculatively before navigation`)
        assert(!(await chatLoaded()), `${route}: closed chat downloaded its full bundle`)
        assert(!requested.some(url => url.includes('founder-film-final.mp4')), `${route}: film downloaded before play`)
        const cta = page.locator(route === '/' ? '.village-home-hero .about-button--primary' : '.village-vsl-next .about-button--primary').first()
        const box = await cta.boundingBox()
        assert(box && box.y >= 0 && box.y + box.height <= height, `${route} ${width}: primary CTA must be in the initial viewport`)
        if (route === '/village') {
          assert(await page.locator('link[rel=preload][as=image][href="/village/performance-nov2/founder-film-poster.webp"]').count() === 1, 'Video poster should be discovered before decorative art')
          assert(await page.locator('img.village-vsl-backdrop[fetchpriority=low]').count() === 1, 'Approved backdrop must remain without competing with the poster')
        }
        assert((await page.locator('link[rel=canonical]').getAttribute('href')).replace(/\/$/, '') === `https://sathian.ai${route === '/' ? '' : route}`, `${route}: canonical changed`)
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: overflow`)
        if (route === '/village') {
          const video = page.locator('video.village-vsl-film')
          assert(await video.getAttribute('preload') === 'none', 'Founder film must wait for play')
          assert(await video.getAttribute('autoplay') === null, 'No video autoplay')
          assert(await video.locator('track[kind=captions]').count() === 1, 'Captions retained')
          for (const asset of ['/village/performance-nov2/founder-film-poster.webp', '/village/performance-nov2/parent-vault-background.webp', '/village/performance-nov2/real-proof-fathers-day.webp', '/village/performance-nov2/real-proof-my-tooth.webp']) {
            const raw = await page.request.get(base + asset)
            assert(raw.status() === 200 && raw.headers()['content-type']?.includes('image/webp'), `Missing deployed image ${asset}`)
          }
          assert(await page.locator('.village-printed-examples img').count() === 2, 'Printed examples must remain visible')
        }
        // Reveal lazy pictures only for the full-page review capture, after intent/budget assertions.
        await page.locator('main img').evaluateAll(images => images.forEach(image => { image.loading = 'eager' }))
        await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(image => image.complete && image.naturalWidth > 0), undefined, { timeout: 60000 })
        await page.screenshot({ path: path.join(out, `marketing-${route === '/' ? 'home' : 'village'}-${width}.png`), fullPage: true })
        if (route === '/') {
          await page.getByRole('button', { name: /Ask Sathian/ }).click()
          await page.getByRole('textbox', { name: 'Ask a question', exact: true }).waitFor()
          assert(await chatLoaded(), 'Chat bundle must load after opening')
          await page.getByRole('button', { name: 'Close chat', exact: true }).click()
          await page.getByRole('button', { name: /Ask Sathian/ }).waitFor()
        }
        receipt.push({ route, width, height, ctaInViewport: true, chatAndVideoWaitForIntent: true })
      }
      await context.close()
    }
  } finally { await browser.close() }
  fs.writeFileSync(path.join(out, 'marketing-performance.json'), JSON.stringify(receipt, null, 2))
  console.log(JSON.stringify(receipt))
})().catch(error => { console.error(error); process.exit(1) })
