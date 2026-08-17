import type { TelegramIntakeMessage } from '../../../src/lib/agent/telegram-payload'

import {
  processDeliveryBatch,
  type ClaimedDelivery,
  type DeliveryFailure,
  type DeliveryRepository,
} from './delivery'
import {
  processDailyReport,
  type DailyReportMetrics,
} from './daily-report'
import {
  getGoogleAccessToken,
  getSathianWebsiteTraffic,
  parseServiceAccountJson,
} from './website-analytics'

interface ClaimRow {
  outbox_id: string
  idempotency_key: string
  receipt_token: string
  kind: 'note' | 'contact' | 'file' | 'mixed'
  display_name: string | null
  reply_email: string | null
  message: string
  page_context: string
  attachment_count: number
  attachment_metadata: unknown
  attempts: number
  max_attempts: number
}

interface TelegramResponse {
  ok: true
  result: { message_id: number }
}

interface DailyReportRow {
  site_sessions: number
  widget_views: number
  completed_turns: number
  intakes: number
  reply_enabled_intakes: number
  telegram_delivered: number
  telegram_dead_letters: number
  delivery_backlog: number
  model_errors: number
}

interface ClearedAttachment {
  filename: string
  contentType: string
  byteSize: number
}

function clearedAttachments(value: unknown): ClearedAttachment[] | null {
  if (!Array.isArray(value)) return null
  const attachments: ClearedAttachment[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') return null
    const row = item as Record<string, unknown>
    if (
      typeof row.filename !== 'string' ||
      typeof row.content_type !== 'string' ||
      typeof row.byte_size !== 'number'
    ) return null
    attachments.push({
      filename: row.filename,
      contentType: row.content_type,
      byteSize: row.byte_size,
    })
  }
  return attachments
}

class ProviderError extends Error {
  constructor(readonly status: number) {
    super(`Provider request failed with status ${status}`)
    this.name = 'ProviderError'
  }
}

function isClaimRow(value: unknown): value is ClaimRow {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return (
    typeof row.outbox_id === 'string'
    && typeof row.idempotency_key === 'string'
    && typeof row.receipt_token === 'string'
    && ['note', 'contact', 'file', 'mixed'].includes(String(row.kind))
    && (row.display_name === null || typeof row.display_name === 'string')
    && (row.reply_email === null || typeof row.reply_email === 'string')
    && typeof row.message === 'string'
    && typeof row.page_context === 'string'
    && typeof row.attachment_count === 'number'
    && clearedAttachments(row.attachment_metadata) !== null
    && typeof row.attempts === 'number'
    && typeof row.max_attempts === 'number'
  )
}

function isTelegramResponse(value: unknown): value is TelegramResponse {
  if (!value || typeof value !== 'object') return false
  const response = value as Record<string, unknown>
  if (response.ok !== true || !response.result || typeof response.result !== 'object') return false
  return typeof (response.result as Record<string, unknown>).message_id === 'number'
}

function isDailyReportRow(value: unknown): value is DailyReportRow {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return [
    'site_sessions',
    'widget_views',
    'completed_turns',
    'intakes',
    'reply_enabled_intakes',
    'telegram_delivered',
    'telegram_dead_letters',
    'delivery_backlog',
    'model_errors',
  ].every((key) => typeof row[key] === 'number' && Number.isFinite(row[key]))
}

async function makeReceiptCode(receiptToken: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(receiptToken),
  )
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
  const code = base64.replace(/[+/=]/g, '').slice(0, 10).toUpperCase()
  return `SA-${code}`
}

function rpcUrl(env: Env, functionName: string): string {
  const url = new URL(`/rest/v1/rpc/${functionName}`, env.SUPABASE_URL)
  if (url.protocol !== 'https:') throw new Error('SUPABASE_URL must use HTTPS')
  return url.toString()
}

async function callSupabaseRpc(
  env: Env,
  functionName: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  const response = await fetch(rpcUrl(env, functionName), {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw new ProviderError(response.status)
  return response.json<unknown>()
}

class SupabaseDeliveryRepository implements DeliveryRepository {
  constructor(
    private readonly env: Env,
    private readonly workerId: string,
  ) {}

  async claimBatch(limit = 10): Promise<ClaimedDelivery[]> {
    const result = await callSupabaseRpc(this.env, 'agent_claim_delivery_batch', {
      p_worker_id: this.workerId,
      p_limit: limit,
    })
    if (!Array.isArray(result) || !result.every(isClaimRow)) {
      throw new Error('Delivery claim returned an invalid contract')
    }

    return Promise.all(result.map(async (row) => ({
      outboxId: row.outbox_id,
      idempotencyKey: row.idempotency_key,
      receiptCode: await makeReceiptCode(row.receipt_token),
      kind: row.kind,
      displayName: row.display_name,
      replyEmail: row.reply_email,
      message: row.message,
      pageContext: row.page_context,
      attachmentCount: row.attachment_count,
      attachments: clearedAttachments(row.attachment_metadata) ?? [],
      attempts: row.attempts,
      maxAttempts: row.max_attempts,
    })))
  }

  async markDelivered(outboxId: string, providerMessageId: number): Promise<void> {
    const result = await callSupabaseRpc(this.env, 'agent_mark_delivery_succeeded', {
      p_outbox_id: outboxId,
      p_worker_id: this.workerId,
      p_provider_message_id: String(providerMessageId),
    })
    if (result !== true) throw new Error('Delivery success transition was rejected')
  }

  async markFailed(outboxId: string, failure: DeliveryFailure): Promise<void> {
    const result = await callSupabaseRpc(this.env, 'agent_mark_delivery_failed', {
      p_outbox_id: outboxId,
      p_worker_id: this.workerId,
      p_error_code: failure.errorCode,
      p_permanent: failure.permanent,
      p_next_attempt_at: failure.nextAttemptAt,
    })
    if (result !== true) throw new Error('Delivery failure transition was rejected')
  }
}

async function getDailyReportMetrics(
  env: Env,
  since: Date,
  until: Date,
): Promise<DailyReportMetrics> {
  const result = await callSupabaseRpc(env, 'agent_get_daily_report', {
    p_since: since.toISOString(),
    p_until: until.toISOString(),
  })
  const row = Array.isArray(result) ? result[0] : result
  if (!isDailyReportRow(row)) throw new Error('Daily report returned an invalid contract')
  return {
    siteSessions: row.site_sessions,
    widgetViews: row.widget_views,
    completedTurns: row.completed_turns,
    intakes: row.intakes,
    replyEnabledIntakes: row.reply_enabled_intakes,
    telegramDelivered: row.telegram_delivered,
    telegramDeadLetters: row.telegram_dead_letters,
    deliveryBacklog: row.delivery_backlog,
    modelErrors: row.model_errors,
  }
}

function telegramSender(env: Env) {
  const topicId = Number(env.TELEGRAM_TOPIC_ID)

  return async (message: TelegramIntakeMessage): Promise<{ messageId: number }> => {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          message_thread_id: Number.isInteger(topicId) && topicId > 0 ? topicId : undefined,
          text: message.text,
          parse_mode: message.parseMode,
          link_preview_options: { is_disabled: message.disableWebPagePreview },
        }),
      },
    )

    if (!response.ok) throw new ProviderError(response.status)
    const result: unknown = await response.json()
    if (!isTelegramResponse(result)) throw new ProviderError(502)
    return { messageId: result.result.message_id }
  }
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    _context: ExecutionContext,
  ): Promise<void> {
    const sendMessage = telegramSender(env)
    if (controller.cron === '0 12 * * *' || controller.cron === '0 13 * * *') {
      const report = await processDailyReport({
        scheduledAt: new Date(controller.scheduledTime),
        getMetrics: (since, until) => getDailyReportMetrics(env, since, until),
        getWebsiteTraffic: async () => {
          const credential = parseServiceAccountJson(env.GA_SERVICE_ACCOUNT_JSON)
          const accessToken = await getGoogleAccessToken(credential.email, credential.privateKey)
          return getSathianWebsiteTraffic(env.SATHIAN_GA4_PROPERTY_ID, accessToken)
        },
        sendMessage,
      })
      console.log(JSON.stringify({ event: 'telegram_daily_report', status: report.status }))
      return
    }

    const workerId = `telegram:${crypto.randomUUID()}`
    const results = await processDeliveryBatch({
      repository: new SupabaseDeliveryRepository(env, workerId),
      sendMessage,
      studioBaseUrl: env.STUDIO_BASE_URL,
    })
    const counts = results.reduce<Record<string, number>>((summary, result) => {
      summary[result.status] = (summary[result.status] ?? 0) + 1
      return summary
    }, {})

    console.log(JSON.stringify({ event: 'telegram_delivery_batch', count: results.length, counts }))
  },
} satisfies ExportedHandler<Env>
