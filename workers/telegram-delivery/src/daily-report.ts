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

export interface WebsiteTrafficMetrics {
  last7Users: number
  last7Sessions: number
  last7EngagedSessions: number
  previous7Users: number
  previous7Sessions: number
  last28Users: number
  last28Sessions: number
  last7AgentNotes: number
  leadingSourceMedium: string | null
  leadingSourceSessions: number
  leadingLandingPage: string | null
  leadingLandingPageSessions: number
}

interface DailyReportDependencies {
  scheduledAt: Date
  getMetrics: (since: Date, until: Date) => Promise<DailyReportMetrics>
  getWebsiteTraffic: () => Promise<WebsiteTrafficMetrics>
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function percentage(numerator: number, denominator: number): string {
  if (denominator <= 0) return '0%'
  return `${Math.round((numerator / denominator) * 100)}%`
}

function periodChange(current: number, previous: number): string {
  if (previous <= 0) return current > 0 ? 'new from 0' : '0%'
  const change = Math.round(((current - previous) / previous) * 100)
  return `${change >= 0 ? '+' : ''}${change}%`
}

export function buildDailyReportMessage(
  metrics: DailyReportMetrics,
  windowEndsAt: Date,
  websiteTraffic: WebsiteTrafficMetrics | null = null,
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
      '',
      '<b>Website reach</b>',
      ...(websiteTraffic ? [
        '<i>Google Analytics · complete through two days ago</i>',
        `<b>7 complete days:</b> ${websiteTraffic.last7Users} GA4 active users · ${websiteTraffic.last7Sessions} sessions`,
        `<b>Engaged sessions:</b> ${websiteTraffic.last7EngagedSessions} (${percentage(websiteTraffic.last7EngagedSessions, websiteTraffic.last7Sessions)})`,
        `<b>vs prior 7 days:</b> active users ${periodChange(websiteTraffic.last7Users, websiteTraffic.previous7Users)} · sessions ${periodChange(websiteTraffic.last7Sessions, websiteTraffic.previous7Sessions)}`,
        `<b>28 complete days:</b> ${websiteTraffic.last28Users} GA4 active users · ${websiteTraffic.last28Sessions} sessions`,
        `<b>Notes sent:</b> ${websiteTraffic.last7AgentNotes}`,
        `<b>Top named source:</b> ${escapeHtml(websiteTraffic.leadingSourceMedium ?? 'not enough data')} · ${websiteTraffic.leadingSourceSessions} sessions`,
        `<b>Top landing page:</b> ${escapeHtml(websiteTraffic.leadingLandingPage ?? 'not enough data')} · ${websiteTraffic.leadingLandingPageSessions} sessions`,
        `<b>Production hostname:</b> sathian.ai only`,
        `<b>Internal/test traffic:</b> GA4 filter status not verified`,
        '<i>Known bots are filtered by GA4 when recognized; active users are estimates, not verified people.</i>',
      ] : [
        '<b>Website reach:</b> temporarily unavailable',
      ]),
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
  const [metrics, websiteTraffic] = await Promise.all([
    dependencies.getMetrics(since, dependencies.scheduledAt),
    dependencies.getWebsiteTraffic().catch(() => null),
  ])
  await dependencies.sendMessage(buildDailyReportMessage(
    metrics,
    dependencies.scheduledAt,
    websiteTraffic,
  ))
  return { status: 'sent' }
}
