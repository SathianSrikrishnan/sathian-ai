const path = require('node:path')
const { createHmac } = require('node:crypto')
const { chromium } = require('playwright')

const baseUrl = (process.env.PORTAL_BASE_URL || 'http://127.0.0.1:3017').replace(/\/$/, '')
const output = path.resolve(
  __dirname,
  '../../docs/analytics/site-agent-evals/2026-08-13-chatbot-focus-browser.png',
)

async function waitForReady(page) {
  await page.goto(baseUrl, { waitUntil: 'commit', timeout: 90_000 })
  const panel = page.locator('[data-chat-panel]')
  await panel.waitFor({ state: 'visible', timeout: 90_000 })
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
  return panel
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const testerSecret = process.env.SITE_AGENT_TESTER_SECRET
  const expiresAt = Math.floor(Date.now() / 1000) + 600
  const runId = 'chatfocus20260813'
  const signature = testerSecret
    ? createHmac('sha256', testerSecret)
      .update(`site-agent-test:v1:${expiresAt}:${runId}`)
      .digest('hex')
    : null
  const testerToken = process.env.SITE_AGENT_TEST_TOKEN
    || (signature ? `v1.${expiresAt}.${runId}.${signature}` : null)
  if (testerToken) {
    await context.addInitScript((token) => {
      window.sessionStorage.setItem('sathian-agent-test-token', token)
    }, testerToken)
  }
  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  const panel = await waitForReady(page)
  const intro = await panel.locator('.site-agent-message--bot').first().innerText()
  if (!intro.includes('explain and compare Sathian') || !intro.includes('projects')) {
    throw new Error(`Incomplete intro: ${intro}`)
  }
  if (!intro.includes('latest Draw with Tanda release')) throw new Error(`Incomplete intro: ${intro}`)

  const messageResponses = []
  page.on('response', (response) => {
    if (response.url().endsWith('/api/agent/message')) messageResponses.push(response)
  })

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(100)
  const scrollBefore = await page.evaluate(() => window.scrollY)
  const composer = page.getByRole('textbox', { name: 'Ask a question' })

  await composer.fill('What can you do and how can you help me use this site?')
  const capabilityResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/agent/message'),
    { timeout: 30_000 },
  )
  await page.getByRole('button', { name: 'Send question' }).click()
  const capabilityResponse = await capabilityResponsePromise
  if (capabilityResponse.status() !== 200) {
    throw new Error(`Capability request failed (${capabilityResponse.status()}): ${await capabilityResponse.text()}`)
  }
  const capabilityAnswer = panel.locator('.site-agent-message--bot').last()
  await capabilityAnswer.getByText('explain and compare', { exact: false }).waitFor({ timeout: 30_000 })
  await page.waitForTimeout(500)
  const capabilityAction = capabilityAnswer.locator('.site-agent-next-action')
  if (await capabilityAction.count() !== 1) throw new Error('Capability answer did not render exactly one action')
  const capabilityActionText = (await capabilityAction.innerText()).trim()
  if (capabilityActionText.toLowerCase() !== 'browse featured work') {
    throw new Error(`Wrong capability action: ${JSON.stringify(capabilityActionText)}`)
  }
  if (Math.abs(await page.evaluate(() => window.scrollY) - scrollBefore) > 1) {
    throw new Error('Capability answer moved the homepage viewport')
  }

  await composer.fill('Can I leave Sathian a note?')
  const noteHelpResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/agent/message'),
    { timeout: 30_000 },
  )
  await page.getByRole('button', { name: 'Send question' }).click()
  const noteHelpResponse = await noteHelpResponsePromise
  if (noteHelpResponse.status() !== 200) {
    throw new Error(`Note-help request failed (${noteHelpResponse.status()}): ${await noteHelpResponse.text()}`)
  }
  const noteHelpAnswer = panel.locator('.site-agent-message--bot').last()
  await noteHelpAnswer.getByText('actual message', { exact: false }).waitFor({ timeout: 30_000 })
  await page.waitForTimeout(500)
  const noteAction = noteHelpAnswer.locator('.site-agent-next-action')
  if (await noteAction.count() !== 1) throw new Error('Note help did not render exactly one action')
  const noteActionText = (await noteAction.innerText()).trim()
  if (noteActionText.toLowerCase() !== 'write a note') {
    throw new Error(`Wrong note action: ${JSON.stringify(noteActionText)}`)
  }
  if (messageResponses.length !== 2) throw new Error(`Expected 2 answer requests; got ${messageResponses.length}`)
  if (messageResponses.some((response) => response.status() !== 200)) {
    throw new Error(`Non-200 answer response: ${messageResponses.map((response) => response.status()).join(', ')}`)
  }
  if (Math.abs(await page.evaluate(() => window.scrollY) - scrollBefore) > 1) {
    throw new Error('Note help answer moved the homepage viewport')
  }

  await noteAction.click()
  await page.getByRole('textbox', { name: 'Write your note to Sathian' }).waitFor()
  if (await page.getByText('Write your note to Sathian', { exact: true }).count() !== 1) {
    throw new Error('Note composer did not open')
  }
  if (messageResponses.length !== 2) throw new Error('Opening note compose submitted or stored a note')
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.getByRole('textbox', { name: 'Ask a question' }).waitFor()

  await composer.fill('What is Sathian building now?')
  const currentWorkResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/agent/message'),
    { timeout: 30_000 },
  )
  await page.getByRole('button', { name: 'Send question' }).click()
  const currentWorkResponse = await currentWorkResponsePromise
  if (currentWorkResponse.status() !== 200) {
    throw new Error(`Current-work request failed (${currentWorkResponse.status()}): ${await currentWorkResponse.text()}`)
  }
  const currentWorkAnswer = panel.locator('.site-agent-message--bot').last()
  await currentWorkAnswer.getByText('primary public build is Tooth Fairy Network', { exact: false }).waitFor({ timeout: 30_000 })
  const currentWorkText = await currentWorkAnswer.innerText()
  if (!currentWorkText.includes('AutoQuote Automator') || !currentWorkText.includes('Solana Ecosystem Observatory')) {
    throw new Error(`Current-work answer omitted an active project: ${currentWorkText}`)
  }
  if (/AI Practice/i.test(currentWorkText)) throw new Error(`Current-work answer revived retired AI Practice copy: ${currentWorkText}`)
  if (Math.abs(await page.evaluate(() => window.scrollY) - scrollBefore) > 1) {
    throw new Error('Current-work answer moved the homepage viewport')
  }

  await composer.fill('Are BTC Cultural Atlas and Lex Rooftop Garden still current?')
  const archiveResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/agent/message'),
    { timeout: 30_000 },
  )
  await page.getByRole('button', { name: 'Send question' }).click()
  const archiveResponse = await archiveResponsePromise
  if (archiveResponse.status() !== 200) {
    throw new Error(`Archive-status request failed (${archiveResponse.status()}): ${await archiveResponse.text()}`)
  }
  const archiveAnswer = panel.locator('.site-agent-message--bot').last()
  await archiveAnswer.getByText('archived projects, not current active builds', { exact: false }).waitFor({ timeout: 30_000 })
  const archiveAction = archiveAnswer.locator('.site-agent-next-action')
  if ((await archiveAction.innerText()).trim().toLowerCase() !== 'browse more projects') {
    throw new Error(`Wrong archive action: ${JSON.stringify(await archiveAction.innerText())}`)
  }
  if (messageResponses.length !== 4) throw new Error(`Expected 4 answer requests; got ${messageResponses.length}`)
  if (Math.abs(await page.evaluate(() => window.scrollY) - scrollBefore) > 1) {
    throw new Error('Archive-status answer moved the homepage viewport')
  }

  await page.screenshot({ path: output, fullPage: true })

  const redirectPage = await context.newPage()
  const redirectResponse = await redirectPage.goto(`${baseUrl}/voice/about`, {
    waitUntil: 'commit',
    timeout: 90_000,
  })
  await redirectPage.waitForURL(`${baseUrl}/#agent`, { timeout: 30_000 })
  const redirectedFrom = redirectResponse?.request().redirectedFrom()
  const redirectStatus = redirectedFrom ? (await redirectedFrom.response())?.status() : undefined
  if (![301, 307, 308].includes(redirectStatus)) throw new Error(`Missing permanent voice redirect: ${redirectStatus}`)
  await redirectPage.locator('[data-chat-panel]').waitFor({ state: 'visible', timeout: 30_000 })

  const mobilePage = await context.newPage()
  await mobilePage.setViewportSize({ width: 390, height: 844 })
  const mobilePanel = await waitForReady(mobilePage)
  const box = await mobilePanel.boundingBox()
  if (!box || box.x < 0 || box.x + box.width > 390) throw new Error(`Mobile panel overflow: ${JSON.stringify(box)}`)
  if (!await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)) {
    throw new Error('390px page has horizontal overflow')
  }

  const relevantConsoleErrors = consoleErrors.filter((error) => {
    const lowered = error.toLowerCase()
    return !lowered.includes('favicon') && !lowered.includes('analytics')
  })
  if (relevantConsoleErrors.length) throw new Error(`Console errors: ${relevantConsoleErrors.join(' | ')}`)

  await context.close()
  await browser.close()
  console.log(
    'chatbot focus check passed: capability guide, answer-only note help, deliberate compose, '
      + 'fresh current/archive status, stable page scroll, retired voice redirect, and 390px layout',
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
