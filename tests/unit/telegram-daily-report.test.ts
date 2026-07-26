import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

import {
  buildDailyReportMessage,
  isTorontoDigestTime,
  processDailyReport,
  type DailyReportMetrics,
} from '../../workers/telegram-delivery/src/daily-report'

const metrics: DailyReportMetrics = {
  siteSessions: 24,
  widgetViews: 13,
  completedTurns: 7,
  intakes: 3,
  replyEnabledIntakes: 2,
  telegramDelivered: 3,
  telegramDeadLetters: 0,
  deliveryBacklog: 1,
  modelErrors: 0,
}

const workerSource = readFileSync(
  new URL('../../workers/telegram-delivery/src/index.ts', import.meta.url),
  'utf8',
)
const workerConfig = readFileSync(
  new URL('../../workers/telegram-delivery/wrangler.jsonc', import.meta.url),
  'utf8',
)

describe('private Telegram daily front-door report', () => {
  it('fires at 8am Toronto through both daylight and standard time', () => {
    expect(isTorontoDigestTime(new Date('2026-07-18T12:00:00.000Z'))).toBe(true)
    expect(isTorontoDigestTime(new Date('2026-07-18T13:00:00.000Z'))).toBe(false)
    expect(isTorontoDigestTime(new Date('2026-01-18T13:00:00.000Z'))).toBe(true)
    expect(isTorontoDigestTime(new Date('2026-01-18T12:00:00.000Z'))).toBe(false)
  })

  it('formats a content-free 24-hour funnel and health summary', () => {
    const message = buildDailyReportMessage(metrics, new Date('2026-07-18T12:00:00.000Z'))
    expect(message.text).toContain('Sathian.ai daily front-door report')
    expect(message.text).toContain('Site sessions:</b> 24')
    expect(message.text).toContain('Widget views:</b> 13')
    expect(message.text).toContain('Reply-enabled:</b> 2')
    expect(message.text).toContain('Delivery backlog:</b> 1')
    expect(JSON.stringify(message)).not.toMatch(/message|email|visitor content/i)
  })

  it('loads and sends exactly one rolling report when the Toronto gate is open', async () => {
    const getMetrics = vi.fn(async () => metrics)
    const sendMessage = vi.fn(async () => ({ messageId: 92 }))
    const result = await processDailyReport({
      scheduledAt: new Date('2026-07-18T12:00:00.000Z'),
      getMetrics,
      sendMessage,
    })

    expect(result).toEqual({ status: 'sent' })
    expect(getMetrics).toHaveBeenCalledWith(
      new Date('2026-07-17T12:00:00.000Z'),
      new Date('2026-07-18T12:00:00.000Z'),
    )
    expect(sendMessage).toHaveBeenCalledOnce()
  })

  it('skips the alternate UTC trigger outside the Toronto 8am hour', async () => {
    const getMetrics = vi.fn(async () => metrics)
    const sendMessage = vi.fn(async () => ({ messageId: 92 }))
    const result = await processDailyReport({
      scheduledAt: new Date('2026-07-18T13:00:00.000Z'),
      getMetrics,
      sendMessage,
    })
    expect(result).toEqual({ status: 'skipped' })
    expect(getMetrics).not.toHaveBeenCalled()
    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('wires both DST-safe UTC triggers to the service-only report RPC', () => {
    expect(workerConfig).toContain('0 12 * * *')
    expect(workerConfig).toContain('0 13 * * *')
    expect(workerSource).toContain("'agent_get_daily_report'")
    expect(workerSource).toContain('controller.cron')
    expect(workerSource).toContain('processDailyReport')
  })
})
