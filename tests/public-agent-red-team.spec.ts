import { readFileSync } from 'node:fs'

import { expect, test } from 'playwright/test'

import { createAgentMessageHandler } from '@/lib/agent/message-handler'

interface RedTeamFixture {
  name: string
  message: string
  expectedRoute: 'answer' | 'intake' | 'answer_and_intake' | 'block'
  expectedReason: string
}

const fixtures = JSON.parse(
  readFileSync('tests/fixtures/agent-red-team.json', 'utf8'),
) as RedTeamFixture[]
const blockedFixtures = fixtures.filter((fixture) => fixture.expectedRoute === 'block')
const BLOCKED_RESPONSE = 'I cannot help with private data, credentials, system access, or external actions.'
const PRIVATE_CANARY = 'PRIVATE_CANARY_SHOULD_NEVER_RENDER'

test.describe('public agent privacy red team', () => {
  test('blocks private-fact extraction and tool requests before model or intake access', async ({ page }) => {
    let answerCalls = 0
    let persistCalls = 0
    const consoleErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })

    const handler = createAgentMessageHandler({
      persistIntake: async () => {
        persistCalls += 1
        throw new Error('blocked prompts must not be persisted')
      },
      answerQuestion: async () => {
        answerCalls += 1
        return {
          answer: PRIVATE_CANARY,
          sources: ['private://source'],
          unknown: false,
          modelUsed: true,
        }
      },
    })

    await page.route('**/api/agent/message', async (route) => {
      const intercepted = route.request()
      const response = await handler(new Request(intercepted.url(), {
        method: intercepted.method(),
        headers: intercepted.headers(),
        body: intercepted.postData(),
      }))
      expect(response.status).toBe(403)
      await route.fulfill({
        // Keep the browser console quiet after verifying the real handler's 403.
        status: 200,
        headers: Object.fromEntries(response.headers.entries()),
        body: await response.text(),
      })
    })

    await page.goto('/')
    await page.getByRole('button', { name: 'Open chat' }).click()
    const panel = page.locator('[data-chat-panel]')
    const input = panel.locator('input[name="message"]')

    for (const fixture of blockedFixtures) {
      const existingBlockedResponses = await panel.getByText(BLOCKED_RESPONSE, { exact: true }).count()
      await input.fill(fixture.message)
      await panel.getByRole('button', { name: 'Send message' }).click()
      await expect(panel.getByText(BLOCKED_RESPONSE, { exact: true })).toHaveCount(existingBlockedResponses + 1)
    }

    await expect(panel.getByText(PRIVATE_CANARY, { exact: true })).toHaveCount(0)
    expect(answerCalls).toBe(0)
    expect(persistCalls).toBe(0)
    expect(consoleErrors).toEqual([])
  })
})
