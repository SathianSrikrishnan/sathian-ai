// A readiness deadline, not a click-to-sound UX latency budget. Keep the real
// media/source/playing/advancement assertions at the call site as well.
async function waitForAudioAdvance(page, expectedSource, { requireUnmuted = false, timeoutMs = 5000 } = {}) {
  try {
    await page.waitForFunction(({ expectedSource, requireUnmuted }) => {
      const audio = document.querySelector('audio')
      if (!audio) return false
      if (audio.error) return true // Return the decode error to the caller immediately.
      return audio.src.includes(expectedSource) && !audio.paused && audio.currentTime > 0.05 && (!requireUnmuted || !audio.muted)
    }, { expectedSource, requireUnmuted }, { polling: 50, timeout: timeoutMs })
  } catch (error) {
    const state = await page.locator('audio').evaluateAll(elements => elements.map(audio => ({
      currentTime: audio.currentTime,
      error: audio.error?.message || null,
      muted: audio.muted,
      paused: audio.paused,
      src: audio.src,
    })))
    throw new Error(`Real audio did not advance within ${timeoutMs}ms: ${JSON.stringify(state)}`, { cause: error })
  }
  return page.locator('audio').evaluate(audio => ({
    currentTime: audio.currentTime,
    error: audio.error?.message || null,
    muted: audio.muted,
    paused: audio.paused,
    src: audio.src,
  }))
}

module.exports = { waitForAudioAdvance }
