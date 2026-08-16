const { chromium } = require('playwright')

const baseUrl = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const axePath = require.resolve('axe-core/axe.min.js')

async function verifyViewport(browser, label, viewport) {
  const context = await browser.newContext({ viewport })
  await context.addInitScript(() => {
    window.__siteAgentSoundPlays = []
    HTMLMediaElement.prototype.play = function play() {
      window.__siteAgentSoundPlays.push({
        muted: this.muted,
        src: this.src,
        volume: this.volume,
      })
      return Promise.resolve()
    }
  })

  const page = await context.newPage()
  page.setDefaultTimeout(10_000)
  await page.route('**/api/agent/message', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        receipt: {
          code: 'SOUND-TEST',
          message: 'Synthetic browser receipt.',
        },
      }),
    })
  })

  console.log(`${label}: inner-page wake flow`)
  await page.goto(`${baseUrl}/writings`, { waitUntil: 'domcontentloaded' })
  const wakeAssetStatus = await page.evaluate(async () => {
    const response = await fetch('/audio/site-agent-wake-sting.mp3')
    return response.status
  })
  if (wakeAssetStatus !== 200) throw new Error(`${label}: wake asset returned ${wakeAssetStatus}`)

  await page.getByRole('button', { name: 'Open chat' }).click()
  await page.waitForTimeout(200)
  const wakePlays = await page.evaluate(() => window.__siteAgentSoundPlays)
  if (wakePlays.length === 0) {
    const diagnostics = await page.evaluate(() => ({
      buttons: Array.from(document.querySelectorAll('button')).map((button) => button.getAttribute('aria-label') || button.textContent?.trim()).filter(Boolean),
      panelOpen: Boolean(document.querySelector('[data-chat-panel]')),
      wakeMarkedPlayed: sessionStorage.getItem('sathian-agent-wake-sound-played'),
    }))
    throw new Error(`${label}: no wake playback was attempted: ${JSON.stringify(diagnostics)}`)
  }
  const audibleWake = wakePlays.filter((play) => !play.muted && play.src.includes('/audio/site-agent-wake-sting.mp3'))
  if (audibleWake.length !== 1) throw new Error(`${label}: expected one audible wake sting, saw ${audibleWake.length}`)

  await page.locator('[data-chat-panel]').getByRole('button', { name: 'Close chat' }).click()
  await page.getByRole('button', { name: 'Open chat' }).click()
  const repeatWakePlays = await page.evaluate(() => window.__siteAgentSoundPlays)
  const audibleWakeAfterReopen = repeatWakePlays.filter((play) => !play.muted && play.src.includes('/audio/site-agent-wake-sting.mp3'))
  if (audibleWakeAfterReopen.length !== 1) throw new Error(`${label}: wake sting repeated in the same tab`)

  await page.waitForTimeout(650)
  await page.addScriptTag({ path: axePath })
  const agentViolations = await page.evaluate(async () => {
    const panel = document.querySelector('[data-chat-panel]')
    if (!panel) return [{ id: 'missing-agent-panel' }]
    const results = await window.axe.run(panel, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] },
    })
    return results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    }))
  })
  if (agentViolations.length > 0) {
    throw new Error(`${label}: site-agent accessibility violations: ${JSON.stringify(agentViolations)}`)
  }

  const soundToggle = page.locator('[data-agent-sound-toggle]')
  await soundToggle.click()
  if (await soundToggle.getAttribute('aria-label') !== 'Turn on agent sounds') {
    throw new Error(`${label}: sound toggle did not expose the muted state`)
  }
  const storedMutedPreference = await page.evaluate(() => localStorage.getItem('sathian-agent-sound-enabled'))
  if (storedMutedPreference !== 'false') throw new Error(`${label}: muted preference was not persisted`)
  await soundToggle.click()

  console.log(`${label}: homepage note-receipt flow`)
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' })
  const signatureAssetStatus = await page.evaluate(async () => {
    const response = await fetch('/audio/site-agent-note-signature.mp3')
    return response.status
  })
  if (signatureAssetStatus !== 200) throw new Error(`${label}: signature asset returned ${signatureAssetStatus}`)

  await page.getByRole('button', { name: 'I want to leave Sathian a note' }).click()
  await page.getByRole('textbox', { name: 'Write your note to Sathian' }).fill('Synthetic sound verification; do not deliver.')
  await page.getByRole('button', { name: 'Send note' }).click()
  await page.getByText(/Receipt SOUND-TEST/).waitFor()

  const notePlays = await page.evaluate(() => window.__siteAgentSoundPlays)
  const primedSignature = notePlays.some((play) => play.muted && play.src.includes('/audio/site-agent-note-signature.mp3'))
  const audibleSignature = notePlays.some((play) => !play.muted && play.src.includes('/audio/site-agent-note-signature.mp3'))
  if (!primedSignature) throw new Error(`${label}: note signature was not primed during the send gesture`)
  if (!audibleSignature) throw new Error(`${label}: note signature did not play after the receipt`)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (overflow) throw new Error(`${label}: site-agent interaction introduced horizontal overflow`)

  await context.close()
  console.log(`${label}: verified`)
  return { label, wakeAssetStatus, signatureAssetStatus }
}

async function verifyActualMobilePlayback(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  page.setDefaultTimeout(10_000)
  await page.route('**/api/agent/message', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        receipt: { code: 'DECODE-TEST', message: 'Synthetic browser receipt.' },
      }),
    })
  })

  await page.goto(`${baseUrl}/writings`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Open chat' }).click()
  await page.waitForTimeout(550)
  const wakeState = await page.locator('audio').evaluate((audio) => ({
    currentTime: audio.currentTime,
    error: audio.error?.message || null,
    paused: audio.paused,
    src: audio.src,
  }))
  if (wakeState.error || wakeState.paused || wakeState.currentTime <= 0.05 || !wakeState.src.includes('/audio/site-agent-wake-sting.mp3')) {
    throw new Error(`mobile-real-playback: wake sting did not decode and advance: ${JSON.stringify(wakeState)}`)
  }

  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'I want to leave Sathian a note' }).click()
  await page.getByRole('textbox', { name: 'Write your note to Sathian' }).fill('Synthetic decode verification; do not deliver.')
  await page.getByRole('button', { name: 'Send note' }).click()
  await page.getByText(/Receipt DECODE-TEST/).waitFor()
  await page.waitForTimeout(550)
  const signatureState = await page.locator('audio').evaluate((audio) => ({
    currentTime: audio.currentTime,
    error: audio.error?.message || null,
    muted: audio.muted,
    paused: audio.paused,
    src: audio.src,
  }))
  if (signatureState.error || signatureState.paused || signatureState.muted || signatureState.currentTime <= 0.05 || !signatureState.src.includes('/audio/site-agent-note-signature.mp3')) {
    throw new Error(`mobile-real-playback: note signature did not decode and advance: ${JSON.stringify(signatureState)}`)
  }

  await context.close()
  return { label: 'mobile-real-playback', signatureSeconds: signatureState.currentTime, wakeSeconds: wakeState.currentTime }
}

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const results = []
    results.push(await verifyViewport(browser, 'desktop', { width: 1440, height: 1000 }))
    results.push(await verifyViewport(browser, 'mobile', { width: 390, height: 844 }))
    results.push(await verifyActualMobilePlayback(browser))
    console.log(JSON.stringify({ baseUrl, results }, null, 2))
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
