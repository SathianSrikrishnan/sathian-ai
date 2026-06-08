import { expect, test, type Page } from 'playwright/test'

async function useBrowserSpeechFirst(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: 0,
    })
  })
}

test('Voice Assist appends spoken text into the parent note field', async ({ page }) => {
  await useBrowserSpeechFirst(page)
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

test('Voice Assist falls back to recording when browser speech fails', async ({ page }) => {
  await useBrowserSpeechFirst(page)
  await page.addInitScript(() => {
    class FakeSpeechRecognition {
      continuous = false
      interimResults = false
      lang = 'en-US'
      onresult: null | ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) = null
      onend: null | (() => void) = null
      onerror: null | ((event: { error?: string }) => void) = null

      start() {
        setTimeout(() => {
          this.onerror?.({ error: 'network' })
          this.onend?.()
        }, 30)
      }

      stop() {
        this.onend?.()
      }
    }

    class FakeMediaRecorder {
      static isTypeSupported() {
        return true
      }
    }

    Object.assign(window, {
      SpeechRecognition: FakeSpeechRecognition,
      webkitSpeechRecognition: FakeSpeechRecognition,
      MediaRecorder: FakeMediaRecorder,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => new MediaStream(),
      },
    })
  })

  await page.goto('/toothlight/t/demo-toothlight/note?handoff=1', { waitUntil: 'load' })

  await page.getByRole('button', { name: /start voice input/i }).click()
  await expect(page.getByText(/Browser voice failed\. Try Record instead\./)).toBeVisible()
  await expect(page.getByRole('button', { name: /start recorded voice input/i })).toBeVisible()
})

test('Voice Assist offers recording when mobile speech ends without text', async ({ page }) => {
  await useBrowserSpeechFirst(page)
  await page.addInitScript(() => {
    class FakeSpeechRecognition {
      continuous = false
      interimResults = false
      lang = 'en-US'
      onresult: null | ((event: { resultIndex: number; results: Array<Array<{ transcript: string }>> }) => void) = null
      onend: null | (() => void) = null
      onerror: null | ((event: { error?: string }) => void) = null

      start() {
        setTimeout(() => {
          this.onend?.()
        }, 30)
      }

      stop() {
        this.onend?.()
      }
    }

    class FakeMediaRecorder {
      static isTypeSupported() {
        return true
      }
    }

    Object.assign(window, {
      SpeechRecognition: FakeSpeechRecognition,
      webkitSpeechRecognition: FakeSpeechRecognition,
      MediaRecorder: FakeMediaRecorder,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => new MediaStream(),
      },
    })
  })

  await page.goto('/toothlight/t/demo-toothlight/note?handoff=1', { waitUntil: 'load' })

  await page.getByRole('button', { name: /start voice input/i }).click()
  await expect(page.getByText(/No speech heard\. Try Record instead\./)).toBeVisible()
  await expect(page.getByRole('button', { name: /start recorded voice input/i })).toBeVisible()
})

test('Voice Assist starts in recorded mode on touch devices', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeMediaRecorder {
      static isTypeSupported() {
        return true
      }
    }

    Object.assign(window, {
      MediaRecorder: FakeMediaRecorder,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => new MediaStream(),
      },
    })
  })

  await page.goto('/toothlight/t/demo-toothlight/note?handoff=1', { waitUntil: 'load' })

  await expect(page.getByRole('button', { name: /start recorded voice input/i })).toBeVisible()
  await expect(page.locator('button[aria-label="Start recorded voice input"]').filter({ hasText: 'Record' })).toBeVisible()
})

test('Voice Assist uploads mobile mp4 recordings with an m4a filename', async ({ page }) => {
  let uploadedBody = ''

  await page.route('**/api/toothlight/voice-transcribe', async (route) => {
    uploadedBody = route.request().postDataBuffer()?.toString('latin1') ?? ''
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, text: 'Recorded mobile note.' }),
    })
  })

  await page.addInitScript(() => {
    class FakeMediaRecorder {
      mimeType = 'audio/mp4'
      ondataavailable: null | ((event: { data: Blob }) => void) = null
      onstop: null | (() => void) = null

      static isTypeSupported(mimeType: string) {
        return mimeType.startsWith('audio/mp4')
      }

      constructor(_stream: MediaStream, options?: { mimeType?: string }) {
        this.mimeType = options?.mimeType ?? 'audio/mp4'
      }

      start() {}

      stop() {
        this.ondataavailable?.({
          data: new Blob(['mobile recording sample '.repeat(40)], { type: this.mimeType }),
        })
        this.onstop?.()
      }
    }

    Object.assign(window, {
      MediaRecorder: FakeMediaRecorder,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => ({
          getTracks: () => [{ stop: () => undefined }],
        }),
      },
    })
  })

  await page.goto('/toothlight/t/demo-toothlight/note?handoff=1', { waitUntil: 'load' })

  const noteField = page.getByPlaceholder(/receive later/i)
  await page.getByRole('button', { name: /start recorded voice input/i }).click()
  await page.getByRole('button', { name: /stop voice input/i }).click()
  await expect(noteField).toHaveValue(/Recorded mobile note\./)
  expect(uploadedBody).toContain('filename="toothlight-note.m4a"')
  expect(uploadedBody).toContain('Content-Type: audio/mp4')
})

test('Voice Assist explains how to recover when the microphone is already blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, {
      SpeechRecognition: undefined,
      webkitSpeechRecognition: undefined,
    })

    class FakeMediaRecorder {
      static isTypeSupported() {
        return true
      }
    }

    Object.assign(window, {
      MediaRecorder: FakeMediaRecorder,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => {
          throw new DOMException('Permission denied', 'NotAllowedError')
        },
      },
    })
    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: {
        query: async () => ({ state: 'denied' }),
      },
    })
  })

  await page.goto('/toothlight/t/demo-toothlight/note?handoff=1', { waitUntil: 'load' })

  await page.getByRole('button', { name: /start recorded voice input/i }).click()
  await expect(page.getByText(/If no prompt appeared/i)).toBeVisible()
  await expect(page.getByText(/address bar/i)).toBeVisible()
  await expect(page.getByText(/Microphone to Allow/i)).toBeVisible()
})
