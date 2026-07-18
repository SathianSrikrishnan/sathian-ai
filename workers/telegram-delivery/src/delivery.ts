import {
  buildTelegramIntakeMessage,
  type TelegramIntakeMessage,
} from '../../../src/lib/agent/telegram-payload'

export interface ClaimedDelivery {
  outboxId: string
  idempotencyKey: string
  receiptCode: string
  kind: 'note' | 'contact' | 'file' | 'mixed'
  displayName: string | null
  replyEmail: string | null
  message: string
  pageContext: string
  attachmentCount: number
  attachments: Array<{
    filename: string
    contentType: string
    byteSize: number
  }>
  attempts: number
  maxAttempts: number
}

export interface DeliveryFailure {
  errorCode: string
  permanent: boolean
  nextAttemptAt: string | null
}

export interface DeliveryRepository {
  claimBatch(limit?: number): Promise<ClaimedDelivery[]>
  markDelivered(outboxId: string, providerMessageId: number): Promise<void>
  markFailed(outboxId: string, failure: DeliveryFailure): Promise<void>
}

export interface DeliveryDependencies {
  repository: DeliveryRepository
  sendMessage(message: TelegramIntakeMessage): Promise<{ messageId: number }>
  studioBaseUrl: string
  now?: () => Date
}

export type DeliveryResult =
  | { status: 'delivered' }
  | { status: 'retrying' }
  | { status: 'dead_letter' }

function getErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== 'object' || !('status' in error)) return null
  const status = Number(error.status)
  return Number.isInteger(status) ? status : null
}

function classifyFailure(error: unknown, delivery: ClaimedDelivery): {
  errorCode: string
  permanent: boolean
} {
  const status = getErrorStatus(error)
  const exhausted = delivery.attempts >= delivery.maxAttempts
  const permanentStatus = status !== null
    && status >= 400
    && status < 500
    && status !== 408
    && status !== 429

  return {
    errorCode: status === null ? 'telegram_network' : `telegram_${status}`,
    permanent: exhausted || permanentStatus,
  }
}

function nextAttemptAt(now: Date, attempts: number): string {
  const delaySeconds = Math.min(60 * (2 ** attempts), 3600)
  return new Date(now.getTime() + delaySeconds * 1000).toISOString()
}

export async function processClaimedDelivery(
  delivery: ClaimedDelivery,
  dependencies: DeliveryDependencies,
): Promise<DeliveryResult> {
  const message = buildTelegramIntakeMessage({
    receiptCode: delivery.receiptCode,
    kind: delivery.kind,
    displayName: delivery.displayName,
    replyEmail: delivery.replyEmail,
    message: delivery.message,
    pageContext: delivery.pageContext,
    attachmentCount: delivery.attachmentCount,
    attachments: delivery.attachments,
    studioBaseUrl: dependencies.studioBaseUrl,
  })

  let sent: { messageId: number }
  try {
    sent = await dependencies.sendMessage(message)
  } catch (error) {
    const failure = classifyFailure(error, delivery)
    await dependencies.repository.markFailed(delivery.outboxId, {
      errorCode: failure.errorCode,
      permanent: failure.permanent,
      nextAttemptAt: failure.permanent
        ? null
        : nextAttemptAt((dependencies.now ?? (() => new Date()))(), delivery.attempts),
    })
    return { status: failure.permanent ? 'dead_letter' : 'retrying' }
  }

  await dependencies.repository.markDelivered(delivery.outboxId, sent.messageId)
  return { status: 'delivered' }
}

export async function processDeliveryBatch(
  dependencies: DeliveryDependencies,
  limit = 10,
): Promise<DeliveryResult[]> {
  const deliveries = await dependencies.repository.claimBatch(limit)
  const results: DeliveryResult[] = []

  for (const delivery of deliveries) {
    results.push(await processClaimedDelivery(delivery, dependencies))
  }

  return results
}
