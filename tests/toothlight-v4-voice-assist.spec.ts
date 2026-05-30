import { expect, test } from 'playwright/test'

test('Voice Assist appends spoken text into the parent note field', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeSpeechRecognition {
      continuous = false
      interimResults = false
      lang = 'en-US'
      onresult: null | ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) = null
      onend: null | (() => void) = null
      onerror: null | (() => void) = null

      start() {
        setTimeout(() => {
          this.onresult?.({
            resultIndex: 0,
            results: [[{ transcript: 'I love this small tooth memory.' }]],
          })
          this.onend?.()
        }, 30)
      }

      stop() {
        this.onend?.()
      }
    }

    Object.assign(window, {
      SpeechRecognition: FakeSpeechRecognition,
      webkitSpeechRecognition: FakeSpeechRecognition,
    })
  })

  await page.goto('/toothlight/t/demo-toothlight/note?handoff=1', { waitUntil: 'load' })

  const noteField = page.getByPlaceholder(/receive later/i)
  await expect(noteField).toBeVisible()
  await page.getByRole('button', { name: /start voice input/i }).click()
  await expect(noteField).toHaveValue(/I love this small tooth memory\./)
  await expect(page.getByText(/Added\. You can edit it before sealing\./)).toBeVisible()
})

