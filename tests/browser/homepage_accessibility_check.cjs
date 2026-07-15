const { chromium } = require('playwright')

const baseUrl = (process.env.PORTAL_BASE_URL || 'http://127.0.0.1:3120').replace(/\/$/, '')
const axePath = require.resolve('axe-core/axe.min.js')

async function runAxe(page, label) {
  const results = await page.evaluate(async () => {
    return window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] },
    })
  })

  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
  }))

  if (violations.length > 0) {
    console.error(JSON.stringify({ label, violations }, null, 2))
    throw new Error(`${label} accessibility violations: ${violations.map((item) => item.id).join(', ')}`)
  }
}

async function openAgent(page) {
  const panel = page.locator('[data-chat-panel]')
  if (await panel.isVisible().catch(() => false)) return panel

  const floatingButton = page.locator('button[aria-label="Open chat"]')
  if (await floatingButton.isVisible().catch(() => false)) {
    await floatingButton.click()
  } else {
    await page.getByRole('button', { name: 'Open the site agent' }).click()
  }

  await panel.waitFor()
  return panel
}

async function audit(page, path, label) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' })

  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const viewportHeight = page.viewportSize().height
  for (let y = 0; y < height; y += Math.max(300, Math.floor(viewportHeight / 2))) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(90)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)

  await page.addScriptTag({ path: axePath })
  await runAxe(page, label)

  const panel = await openAgent(page)
  if (path === '/' && (await panel.count()) !== 1) {
    throw new Error('Homepage must render exactly one site-agent panel')
  }
  await page.waitForTimeout(500)
  await runAxe(page, `${label}-agent-open`)
}

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    await audit(await browser.newPage({ viewport: { width: 1440, height: 1000 } }), '/', 'home-desktop')
    await audit(await browser.newPage({ viewport: { width: 390, height: 844 } }), '/', 'home-mobile')
    await audit(await browser.newPage({ viewport: { width: 1440, height: 1000 } }), '/about', 'about-desktop')
    await audit(await browser.newPage({ viewport: { width: 1440, height: 1000 } }), '/automation', 'automation-desktop')
  } finally {
    await browser.close()
  }

  console.log('site accessibility verification passed: Home desktop/mobile, About, and Automation')
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
