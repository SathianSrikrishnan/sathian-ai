import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

import {
  buildDailyReportMessage,
  isTorontoDigestTime,
  processDailyReport,
  type DailyReportMetrics,
  type WebsiteTrafficMetrics,
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

const websiteTraffic: WebsiteTrafficMetrics = {
  last7Users: 19,
  last7Sessions: 57,
  last28Users: 50,
  last28Sessions: 117,
  last7AgentNotes: 1,
  leadingSourceMedium: 'luma / referral',
  leadingSourceSessions: 14,
  leadingLandingPage: '/writings',
  leadingLandingPageSessions: 26,
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
    const message = buildDailyReportMessage(
      metrics,
      new Date('2026-07-18T12:00:00.000Z'),
      websiteTraffic,
    )
    expect(message.text).toContain('Sathian.ai daily front-door report')
    expect(message.text).toContain('Site sessions:</b> 24')
    expect(message.text).toContain('Widget views:</b> 13')
    expect(message.text).toContain('Reply-enabled:</b> 2')
    expect(message.text).toContain('Delivery backlog:</b> 1')
    expect(message.text).toContain('Website reach')
    expect(message.text).toContain('7 complete days:</b> 19 people · 57 visits')
    expect(message.text).toContain('28 complete days:</b> 50 people · 117 visits')
    expect(message.text).toContain('Notes sent:</b> 1')
    expect(message.text).toContain('Top named source:</b> luma / referral · 14 visits')
    expect(message.text).toContain('Top landing page:</b> /writings · 26 visits')
    expect(JSON.stringify(message)).not.toMatch(/message|email|visitor content/i)
  })

  it('escapes analytics labels before inserting them into Telegram HTML', () => {
    const message = buildDailyReportMessage(
      metrics,
      new Date('2026-07-18T12:00:00.000Z'),
      {
        ...websiteTraffic,
        leadingSourceMedium: 'partner <launch> / referral',
        leadingLandingPage: '/writing?a=1&b=2',
      },
    )

    expect(message.text).toContain('partner &lt;launch&gt; / referral')
    expect(message.text).toContain('/writing?a=1&amp;b=2')
    expect(message.text).not.toContain('<launch>')
  })

  it('loads and sends exactly one rolling report when the Toronto gate is open', async () => {
    const getMetrics = vi.fn(async () => metrics)
    const getWebsiteTraffic = vi.fn(async () => websiteTraffic)
    const sendMessage = vi.fn(async () => ({ messageId: 92 }))
    const result = await processDailyReport({
      scheduledAt: new Date('2026-07-18T12:00:00.000Z'),
      getMetrics,
      getWebsiteTraffic,
      sendMessage,
    })

    expect(result).toEqual({ status: 'sent' })
    expect(getMetrics).toHaveBeenCalledWith(
      new Date('2026-07-17T12:00:00.000Z'),
      new Date('2026-07-18T12:00:00.000Z'),
    )
    expect(getWebsiteTraffic).toHaveBeenCalledOnce()
    expect(sendMessage).toHaveBeenCalledOnce()
  })

  it('still sends the operational report when Google Analytics is unavailable', async () => {
    const sendMessage = vi.fn(async (
      _message: ReturnType<typeof buildDailyReportMessage>,
    ) => ({ messageId: 93 }))
    await processDailyReport({
      scheduledAt: new Date('2026-07-18T12:00:00.000Z'),
      getMetrics: async () => metrics,
      getWebsiteTraffic: async () => { throw new Error('temporary GA failure') },
      sendMessage,
    })

    expect(sendMessage).toHaveBeenCalledOnce()
    expect(sendMessage.mock.calls[0][0].text).toContain('Website reach:</b> temporarily unavailable')
  })

  it('skips the alternate UTC trigger outside the Toronto 8am hour', async () => {
    const getMetrics = vi.fn(async () => metrics)
    const getWebsiteTraffic = vi.fn(async () => websiteTraffic)
    const sendMessage = vi.fn(async () => ({ messageId: 92 }))
    const result = await processDailyReport({
      scheduledAt: new Date('2026-07-18T13:00:00.000Z'),
      getMetrics,
      getWebsiteTraffic,
      sendMessage,
    })
    expect(result).toEqual({ status: 'skipped' })
    expect(getMetrics).not.toHaveBeenCalled()
    expect(getWebsiteTraffic).not.toHaveBeenCalled()
    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('wires both DST-safe UTC triggers to the service-only report RPC', () => {
    expect(workerConfig).toContain('0 12 * * *')
    expect(workerConfig).toContain('0 13 * * *')
    expect(workerSource).toContain("'agent_get_daily_report'")
    expect(workerSource).toContain('controller.cron')
    expect(workerSource).toContain('processDailyReport')
    expect(workerSource).toContain('getSathianWebsiteTraffic')
    expect(workerConfig).toContain('SATHIAN_GA4_PROPERTY_ID')
    expect(workerConfig).toContain('GA_SERVICE_ACCOUNT_JSON')
    expect(workerConfig).not.toContain('TOOTH_FAIRY_GA4_PROPERTY_ID')
    expect(workerConfig).not.toContain('HOMELAND_GA4_PROPERTY_ID')
  })
})
