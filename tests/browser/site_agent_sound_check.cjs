const { chromium } = require('playwright')

const baseUrl = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const axePath = require.resolve('axe-core/axe.min.js')
const agentSessionKey = 'sathian-agent-session-id'
const automationBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

function contextOptions(viewport) {
  return {
    viewport,
    extraHTTPHeaders: automationBypassSecret
      ? { 'x-vercel-protection-bypass': automationBypassSecret }
      : undefined,
  }
}

async function gotoHydratedAgentPage(page, path) {
  await page.evaluate((key) => sessionStorage.removeItem(key), agentSessionKey).catch(() => undefined)
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.waitForFunction((key) => Boolean(sessionStorage.getItem(key)), agentSessionKey)
}

async function verifyViewport(browser, label, viewport) {
  const context = await browser.newContext(contextOptions(viewport))
  await context.addInitScript(() => {
    window.__siteAgentSoundPlays = []
    window.__siteAgentEvents = []
    window.gtag = (command, eventName, properties) => {
      if (command === 'event') window.__siteAgentEvents.push({ eventName, properties })
    }
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
  await gotoHydratedAgentPage(page, '/writings')
  const wakeAssetStatus = await page.evaluate(async () => {
    const response = await fetch('/audio/site-agent-wake-sting.mp3')
    return response.status
  })
  if (wakeAssetStatus !== 200) throw new Error(`${label}: wake asset returned ${wakeAssetStatus}`)

  await page.getByRole('button', { name: 'Open chat' }).click()
  await page.waitForTimeout(200)
  const architectureCounts = await page.evaluate(() => ({
    agentRoots: document.querySelectorAll('[data-site-agent-root]').length,
    audioElements: document.querySelectorAll('[data-site-agent-root] audio').length,
    chatPanels: document.querySelectorAll('[data-chat-panel]').length,
    replayControls: document.querySelectorAll('[data-agent-signature-replay]').length,
  }))
  if (Object.values(architectureCounts).some((count) => count !== 1)) {
    throw new Error(`${label}: duplicate or missing site-agent architecture: ${JSON.stringify(architectureCounts)}`)
  }
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

  const replaySignature = page.getByRole('button', { name: 'Replay complete signature' })
  await replaySignature.click()
  await replaySignature.click()
  const replayPlays = await page.evaluate(() => window.__siteAgentSoundPlays)
  const audibleReplays = replayPlays.filter((play) => !play.muted && play.src.includes('/audio/site-agent-note-signature.mp3'))
  if (audibleReplays.length !== 2) throw new Error(`${label}: expected two deliberate signature replays, saw ${audibleReplays.length}`)

  const replayEvents = await page.evaluate(() => {
    const queuedEvents = Array.isArray(window.dataLayer)
      ? window.dataLayer
        .map((entry) => Array.from(entry))
        .filter(([command]) => command === 'event')
        .map(([, eventName, properties]) => ({ eventName, properties }))
      : []
    return [...window.__siteAgentEvents, ...queuedEvents]
      .filter((event) => event.eventName === 'agent_signature_replayed')
  })
  if (replayEvents.length !== 2 || replayEvents.some((event) => event.properties?.placement !== 'agent_controls')) {
    throw new Error(`${label}: replay analytics were not recorded safely: ${JSON.stringify(replayEvents)}`)
  }

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
  if (!await replaySignature.isDisabled()) throw new Error(`${label}: signature replay remained enabled while sounds were muted`)
  await soundToggle.click()

  console.log(`${label}: homepage note-receipt flow`)
  await gotoHydratedAgentPage(page, '/')
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
  const context = await browser.newContext(contextOptions({ width: 390, height: 844 }))
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

  await gotoHydratedAgentPage(page, '/writings')
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

  await page.getByRole('button', { name: 'Replay complete signature' }).click()
  await page.waitForTimeout(550)
  const replayState = await page.locator('audio').evaluate((audio) => ({
    currentTime: audio.currentTime,
    error: audio.error?.message || null,
    muted: audio.muted,
    paused: audio.paused,
    src: audio.src,
  }))
  if (replayState.error || replayState.paused || replayState.muted || replayState.currentTime <= 0.05 || !replayState.src.includes('/audio/site-agent-note-signature.mp3')) {
    throw new Error(`mobile-real-playback: replay signature did not decode and advance: ${JSON.stringify(replayState)}`)
  }

  await gotoHydratedAgentPage(page, '/')
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
  return { label: 'mobile-real-playback', replaySeconds: replayState.currentTime, signatureSeconds: signatureState.currentTime, wakeSeconds: wakeState.currentTime }
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
