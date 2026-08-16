const { mkdirSync } = require('node:fs')
const { resolve } = require('node:path')
const { chromium } = require('playwright')

const baseUrl = (process.env.PORTAL_BASE_URL || 'http://127.0.0.1:3120').replace(/\/$/, '')
const outputDir = resolve('docs/audits/2026-08-14-flagship-article-release')
const axePath = require.resolve('axe-core/axe.min.js')
mkdirSync(outputDir, { recursive: true })

async function assertPageClean(page, label, include) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow > 1) throw new Error(`${label}: horizontal overflow ${overflow}px`)

  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(async (selector) => window.axe.run(
    selector ? { include: [[selector]] } : document,
    { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } },
  ), include)
  if (results.violations.length) {
    const details = results.violations.flatMap((item) =>
      item.nodes.map((node) => `${item.id} ${node.target.join(' ')}`),
    )
    throw new Error(`${label}: ${details.join(' | ')}`)
  }
}

async function inspect(viewport, suffix) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const text = message.text()
    if (text.startsWith('Failed to load resource:')) return
    if (text.includes('/_vercel/insights/script.js')) return
    if (text.includes('compute-pressure is not allowed')) return
    errors.push(text)
  })
  page.on('pageerror', (error) => errors.push(error.message))

  try {
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
    const agent = page.locator('#agent')
    const featured = page.locator('#featured-work')
    const firstFeatured = page.locator('.minimal-featured-list article').first()
    if (!await firstFeatured.getByRole('heading', { name: 'The Polytheistic Test' }).count()) {
      throw new Error(`${suffix}: flagship essay is not first in Featured Work`)
    }
    const agentBox = await agent.boundingBox()
    const featuredBox = await featured.boundingBox()
    if (!agentBox || !featuredBox || agentBox.y >= featuredBox.y) {
      throw new Error(`${suffix}: site agent no longer precedes Featured Work`)
    }
    await assertPageClean(page, `home-${suffix}`, '.minimal-featured-project--article')
    await page.screenshot({ path: resolve(outputDir, `home-${suffix}.png`), fullPage: true })

    await page.goto(`${baseUrl}/writings`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    const firstWriting = page.locator('main a[href^="/writings/"]').first()
    if (!await firstWriting.getByText('The Polytheistic Test').count()) {
      throw new Error(`${suffix}: flagship essay is not first in Writing`)
    }
    await assertPageClean(
      page,
      `writings-${suffix}`,
      'main a[href="/writings/saraswati-lakshmi-and-the-ledger"]',
    )

    const response = await page.goto(
      `${baseUrl}/writings/saraswati-lakshmi-and-the-ledger`,
      { waitUntil: 'domcontentloaded' },
    )
    await page.waitForTimeout(1000)
    if (!response || response.status() !== 200) throw new Error(`${suffix}: essay did not return 200`)
    await page.getByRole('heading', { name: 'The Polytheistic Test' }).waitFor()
    await page.waitForFunction(
      () => Array.from(document.images).every((image) => image.complete),
      undefined,
      { timeout: 30000 },
    )
    const failedImages = await page.locator('img').evaluateAll(
      (images) => images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
    )
    if (failedImages.length) throw new Error(`${suffix}: failed images ${failedImages.join(', ')}`)
    const authorAlignment = await page.evaluate(() => {
      const reading = document.querySelector('#origin .reading')?.getBoundingClientRect()
      const author = document.querySelector('.author-note')?.getBoundingClientRect()
      return reading && author
        ? { left: Math.abs(reading.left - author.left), width: Math.abs(reading.width - author.width) }
        : null
    })
    if (!authorAlignment || authorAlignment.left > 2 || authorAlignment.width > 2) {
      throw new Error(`${suffix}: author byline is not aligned to the reading column`)
    }
    const firstFrameFit = await page.locator('.reel-card').first().locator('img').evaluate(
      (image) => getComputedStyle(image).objectFit,
    )
    if (firstFrameFit !== 'contain') {
      throw new Error(`${suffix}: first visual frame still crops the paired image`)
    }
    if (suffix === 'mobile') {
      const heroFit = await page.locator('.hero-art img').evaluate(
        (image) => ({ fit: getComputedStyle(image).objectFit, ratio: getComputedStyle(image).aspectRatio }),
      )
      if (heroFit.fit !== 'contain' || heroFit.ratio !== 'auto') {
        throw new Error(`${suffix}: hero image still crops instead of showing the complete composition`)
      }
    }
    await page.locator('input[type="checkbox"]').first().check()
    if (await page.locator('[data-saraswati-score]').textContent() !== '1') {
      throw new Error(`${suffix}: interactive test did not update`)
    }
    await assertPageClean(page, `essay-${suffix}`)
    await page.screenshot({ path: resolve(outputDir, `essay-${suffix}.png`), fullPage: true })

    if (errors.length) throw new Error(`${suffix}: browser errors: ${errors.join(' | ')}`)
  } finally {
    await browser.close()
  }
}

Promise.resolve()
  .then(() => inspect({ width: 1440, height: 1000 }, 'desktop'))
  .then(() => inspect({ width: 390, height: 844 }, 'mobile'))
  .then(() => console.log('Flagship release passed desktop/mobile order, images, interaction, overflow, and Axe checks.'))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
