const { chromium } = require('playwright')

const baseUrl = (process.env.PORTAL_BASE_URL || 'http://127.0.0.1:3120').replace(/\/$/, '')
const axePath = require.resolve('axe-core/axe.min.js')

async function audit(page, label) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' })

  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const viewportHeight = page.viewportSize().height
  for (let y = 0; y < height; y += Math.max(300, Math.floor(viewportHeight / 2))) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(90)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)

  await page.addScriptTag({ path: axePath })

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

  await page.locator('button[aria-label="Open chat"]').click()
  await page.locator('button[aria-label="Close chat"]').first().waitFor()
  await page.waitForTimeout(500)

  const openAgentResults = await page.evaluate(async () => {
    return window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] },
    })
  })
  const openAgentViolations = openAgentResults.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
  }))

  if (openAgentViolations.length > 0) {
    console.error(JSON.stringify({ label: `${label}-agent-open`, violations: openAgentViolations }, null, 2))
    throw new Error(
      `${label} open-agent accessibility violations: ${openAgentViolations.map((item) => item.id).join(', ')}`,
    )
  }
}

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    await audit(await browser.newPage({ viewport: { width: 1440, height: 1000 } }), 'desktop')
    await audit(await browser.newPage({ viewport: { width: 390, height: 844 } }), 'mobile')
  } finally {
    await browser.close()
  }

  console.log('homepage accessibility verification passed: desktop and mobile')
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
