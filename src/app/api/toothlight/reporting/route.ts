import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import { requireToothFairyAdminRequest } from '@/lib/toothfairy/admin-guard'

export const dynamic = 'force-dynamic'

type ProductEventRow = {
  id: string
  user_id: string | null
  toothlight_id: string | null
  event_name: string
  properties: Record<string, unknown> | null
  created_at: string
}

const LAUNCH_FUNNEL_EVENTS = [
  ['Landing view', 'landing_view'],
  ['CTA click', 'cta_click'],
  ['Start flow', 'start_flow'],
  ['Source added', 'source_added'],
  ['Google parent auth', 'google_parent_auth'],
  ['Story completed', 'story_completed'],
  ['Parent note saved', 'parent_note_saved'],
  ['Toothlight sealed', 'toothlight_sealed'],
  ['Invite clicked', 'invite_clicked'],
  ['Learn clicked', 'learn_clicked'],
] as const

export async function GET(request: NextRequest) {
  const unauthorized = requireToothFairyAdminRequest(request)
  if (unauthorized) return unauthorized

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase reporting is not configured.' }, { status: 500 })
  }

  const days = clampDays(Number(request.nextUrl.searchParams.get('days') || 7))
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const [{ data: events, error }, v4Saved, mintedRange, mintedAllTime] = await Promise.all([
    supabase
      .from('tfn_product_events')
      .select('id,user_id,toothlight_id,event_name,properties,created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(10000),
    countRows(supabase, 'tfn_toothlights', since),
    countMintedNfts(supabase, since),
    countMintedNfts(supabase),
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = (events ?? []) as ProductEventRow[]
  const summary = summarizeEvents(rows)

  const report = {
    generatedAt: new Date().toISOString(),
    range: { days, since },
    totals: {
      events: rows.length,
      pageViews: rows.filter((event) => event.event_name === 'page_view').length,
      uniqueVisitors: summary.uniqueVisitors,
      uniqueSessions: summary.uniqueSessions,
      signedInUsers: summary.signedInUsers,
      v4SavedToothlights: v4Saved,
      mintedNfts: {
        range: mintedRange,
        allTime: mintedAllTime,
      },
    },
    botBreakdown: summary.botBreakdown,
    trafficSources: summary.trafficSources,
    topPages: summary.topPages,
    topClicks: summary.topClicks,
    funnel: summary.funnel,
    recentEvents: rows.slice(0, 25).map((event) => ({
      eventName: event.event_name,
      createdAt: event.created_at,
      visitorId: event.properties?.visitorId ?? null,
      sessionId: event.properties?.sessionId ?? null,
      userId: event.user_id,
      path: event.properties?.path ?? null,
      botCategory: event.properties?.botCategory ?? inferBotCategory(event.properties?.userAgent),
      country: event.properties?.country ?? null,
    })),
  }

  if (request.nextUrl.searchParams.get('format') === 'html') {
    return new NextResponse(renderHtmlReport(report), {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }

  return NextResponse.json(report)
}

function summarizeEvents(events: ProductEventRow[]) {
  const visitors = new Set<string>()
  const sessions = new Set<string>()
  const users = new Set<string>()
  const botBreakdown = new Map<string, number>()
  const trafficSources = new Map<string, number>()
  const pages = new Map<string, number>()
  const clicks = new Map<string, number>()

  for (const event of events) {
    const props = event.properties ?? {}
    const visitorId = stringValue(props.visitorId)
    const sessionId = stringValue(props.sessionId)
    if (visitorId) visitors.add(visitorId)
    if (sessionId) sessions.add(sessionId)
    if (event.user_id) users.add(event.user_id)

    const botCategory = stringValue(props.botCategory) || inferBotCategory(props.userAgent)
    increment(botBreakdown, botCategory)

    const referrer = stringValue(props.referrer)
    increment(trafficSources, referrer ? safeHost(referrer) : 'direct_or_unknown')

    if (event.event_name === 'page_view') {
      increment(pages, stringValue(props.path) || 'unknown')
    }

    if (event.event_name === 'ui_click') {
      const label = stringValue(props.label) || 'unlabeled'
      const href = stringValue(props.href)
      increment(clicks, href ? `${label} -> ${safePath(href)}` : label)
    }
  }

  return {
    uniqueVisitors: visitors.size,
    uniqueSessions: sessions.size,
    signedInUsers: users.size,
    botBreakdown: topEntries(botBreakdown, 10),
    trafficSources: topEntries(trafficSources, 10),
    topPages: topEntries(pages, 20),
    topClicks: topEntries(clicks, 20),
    funnel: summarizeLaunchFunnel(events),
  }
}

function summarizeLaunchFunnel(events: ProductEventRow[]) {
  const rows = LAUNCH_FUNNEL_EVENTS.map(([label, eventName], index) => ({
    step: index + 1,
    label,
    eventName,
    events: events.filter((event) => event.event_name === eventName).length,
    uniqueVisitors: uniqueVisitorsFor(events, eventName),
    conversionFromPrevious: null as number | null,
  }))

  return rows.map((row, index) => {
    if (index === 0) return row
    const previous = rows[index - 1]
    return {
      ...row,
      conversionFromPrevious:
        previous.uniqueVisitors > 0
          ? Number((row.uniqueVisitors / previous.uniqueVisitors).toFixed(4))
          : null,
    }
  })
}

async function countRows(client: any, table: string, since?: string) {
  let query = client.from(table).select('id', { count: 'exact', head: true })
  if (since) query = query.gte('created_at', since)
  const { count } = await query
  return count ?? 0
}

async function countMintedNfts(client: any, since?: string) {
  let query = client
    .from('tfn_children')
    .select('id', { count: 'exact', head: true })
    .not('cnft_signature', 'is', null)
  if (since) query = query.gte('created_at', since)
  const { count } = await query
  return count ?? 0
}

function uniqueVisitorsFor(events: ProductEventRow[], eventName: string) {
  const visitors = new Set<string>()
  for (const event of events) {
    if (event.event_name !== eventName) continue
    const visitorId = stringValue(event.properties?.visitorId)
    if (visitorId) visitors.add(visitorId)
  }
  return visitors.size
}

function inferBotCategory(userAgent: unknown) {
  const value = stringValue(userAgent)
  if (!value) return 'unknown'
  if (/headlesschrome|playwright|puppeteer|selenium|codex/i.test(value)) return 'codex_agent'
  if (/gptbot|chatgpt-user|oai-searchbot|claudebot|claude-searchbot|anthropic-ai|perplexitybot|bytespider|ccbot/i.test(value)) {
    return 'ai_bot'
  }
  if (/bot|crawler|spider|slurp|facebookexternalhit|slackbot|discordbot/i.test(value)) return 'crawler'
  return 'human_like'
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1)
}

function topEntries(map: Map<string, number>, limit: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function safeHost(value: string) {
  try {
    return new URL(value).hostname
  } catch {
    return value.slice(0, 80)
  }
}

function safePath(value: string) {
  try {
    const url = new URL(value)
    return url.pathname
  } catch {
    return value.slice(0, 80)
  }
}

function clampDays(days: number) {
  if (!Number.isFinite(days)) return 7
  return Math.min(90, Math.max(1, Math.floor(days)))
}

function renderHtmlReport(report: any) {
  const totals = report.totals
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TFN Reporting</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f7f3ea; color: #201a14; }
    main { max-width: 1040px; margin: 0 auto; padding: 32px 18px 56px; }
    h1, h2 { margin: 0; }
    h1 { font-size: 32px; }
    h2 { font-size: 18px; margin-bottom: 12px; }
    .muted { color: #6b6258; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 24px 0; }
    .card { background: #fffaf1; border: 1px solid #e2d7c4; border-radius: 8px; padding: 16px; }
    .metric { font-size: 30px; font-weight: 800; margin-top: 8px; }
    section { margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; background: #fffaf1; border: 1px solid #e2d7c4; border-radius: 8px; overflow: hidden; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #eee3d1; text-align: left; font-size: 14px; }
    th { color: #6b4f19; background: #f1e7d5; }
    tr:last-child td { border-bottom: 0; }
  </style>
</head>
<body>
  <main>
    <h1>TFN Reporting</h1>
    <p class="muted">Last ${escapeHtml(String(report.range.days))} days. Generated ${escapeHtml(report.generatedAt)}.</p>
    <div class="grid">
      ${metricCard('Unique visitors', totals.uniqueVisitors)}
      ${metricCard('Unique sessions', totals.uniqueSessions)}
      ${metricCard('Page views', totals.pageViews)}
      ${metricCard('Saved Toothlights', totals.v4SavedToothlights)}
      ${metricCard('NFTs minted', `${totals.mintedNfts.range} / ${totals.mintedNfts.allTime} all-time`)}
    </div>
    ${tableSection('Launch Funnel', report.funnel, ['step', 'label', 'events', 'uniqueVisitors', 'conversionFromPrevious'])}
    ${tableSection('Bot Breakdown', report.botBreakdown, ['label', 'count'])}
    ${tableSection('Top Pages', report.topPages, ['label', 'count'])}
    ${tableSection('Top Clicks', report.topClicks, ['label', 'count'])}
    ${tableSection('Traffic Sources', report.trafficSources, ['label', 'count'])}
  </main>
</body>
</html>`
}

function metricCard(label: string, value: unknown) {
  return `<div class="card"><div class="muted">${escapeHtml(label)}</div><div class="metric">${escapeHtml(String(value))}</div></div>`
}

function tableSection(title: string, rows: Array<Record<string, unknown>>, columns: string[]) {
  return `<section><h2>${escapeHtml(title)}</h2><table><thead><tr>${columns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${columns.map((column) => `<td>${escapeHtml(String(row[column] ?? ''))}</td>`).join('')}</tr>`,
    )
    .join('')}</tbody></table></section>`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
