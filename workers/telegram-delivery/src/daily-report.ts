import type { TelegramIntakeMessage } from '../../../src/lib/agent/telegram-payload'

export interface DailyReportMetrics {
  siteSessions: number
  widgetViews: number
  completedTurns: number
  intakes: number
  replyEnabledIntakes: number
  telegramDelivered: number
  telegramDeadLetters: number
  deliveryBacklog: number
  modelErrors: number
}

interface DailyReportDependencies {
  scheduledAt: Date
  getMetrics: (since: Date, until: Date) => Promise<DailyReportMetrics>
  sendMessage: (message: TelegramIntakeMessage) => Promise<{ messageId: number }>
}

function torontoParts(date: Date): Record<string, string> {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date).map((part) => [part.type, part.value]))
}

export function isTorontoDigestTime(date: Date): boolean {
  return torontoParts(date).hour === '08'
}

export function buildDailyReportMessage(
  metrics: DailyReportMetrics,
  windowEndsAt: Date,
): TelegramIntakeMessage {
  const parts = torontoParts(windowEndsAt)
  const dateLabel = `${parts.year}-${parts.month}-${parts.day}`
  return {
    text: [
      '<b>Sathian.ai daily front-door report</b>',
      `${dateLabel} · rolling 24 hours`,
      '',
      `<b>Site sessions:</b> ${metrics.siteSessions}`,
      `<b>Widget views:</b> ${metrics.widgetViews}`,
      `<b>Agent turns:</b> ${metrics.completedTurns}`,
      `<b>Intakes:</b> ${metrics.intakes}`,
      `<b>Reply-enabled:</b> ${metrics.replyEnabledIntakes}`,
      '',
      `<b>Telegram delivered:</b> ${metrics.telegramDelivered}`,
      `<b>Telegram dead letters:</b> ${metrics.telegramDeadLetters}`,
      `<b>Delivery backlog:</b> ${metrics.deliveryBacklog}`,
      `<b>Model errors:</b> ${metrics.modelErrors}`,
    ].join('\n'),
    parseMode: 'HTML',
    disableWebPagePreview: true,
  }
}

export async function processDailyReport(
  dependencies: DailyReportDependencies,
): Promise<{ status: 'sent' | 'skipped' }> {
  if (!isTorontoDigestTime(dependencies.scheduledAt)) return { status: 'skipped' }

  const since = new Date(dependencies.scheduledAt.getTime() - 24 * 60 * 60 * 1000)
  const metrics = await dependencies.getMetrics(since, dependencies.scheduledAt)
  await dependencies.sendMessage(buildDailyReportMessage(metrics, dependencies.scheduledAt))
  return { status: 'sent' }
}
