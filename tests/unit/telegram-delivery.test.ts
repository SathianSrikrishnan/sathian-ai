import { describe, expect, it, vi } from 'vitest'

import {
  processClaimedDelivery,
  processDeliveryBatch,
  type ClaimedDelivery,
} from '../../workers/telegram-delivery/src/delivery'

const delivery: ClaimedDelivery = {
  outboxId: 'cfcda43d-afc4-418f-aaf0-cd11db33f2ca',
  idempotencyKey: 'telegram:idem_1234567890abcdef',
  receiptCode: 'SA-4F9Q2M7K8D',
  message: 'Please pass this along to Sathian.',
  pageContext: '/',
  attachmentCount: 0,
  attachments: [],
  attempts: 1,
  maxAttempts: 8,
}

function createRepository() {
  return {
    claimBatch: vi.fn(async () => [delivery]),
    markDelivered: vi.fn(async () => undefined),
    markFailed: vi.fn(async () => undefined),
  }
}

describe('Telegram outbox delivery', () => {
  it('sends one message and marks the claimed event delivered', async () => {
    const repository = createRepository()
    const sendMessage = vi.fn(async () => ({ messageId: 91 }))

    const result = await processClaimedDelivery(delivery, {
      repository,
      sendMessage,
      studioBaseUrl: 'https://sathian.ai',
      now: () => new Date('2026-07-14T16:00:00.000Z'),
    })

    expect(result).toEqual({ status: 'delivered' })
    expect(sendMessage).toHaveBeenCalledOnce()
    expect(repository.markDelivered).toHaveBeenCalledWith(delivery.outboxId, 91)
    expect(repository.markFailed).not.toHaveBeenCalled()
  })

  it('does not repost an idempotency key after its outbox row is delivered', async () => {
    const repository = createRepository()
    repository.claimBatch
      .mockResolvedValueOnce([delivery])
      .mockResolvedValueOnce([])
    const sendMessage = vi.fn(async () => ({ messageId: 91 }))
    const dependencies = {
      repository,
      sendMessage,
      studioBaseUrl: 'https://sathian.ai',
      now: () => new Date('2026-07-14T16:00:00.000Z'),
    }

    await processDeliveryBatch(dependencies)
    await processDeliveryBatch(dependencies)

    expect(sendMessage).toHaveBeenCalledOnce()
  })

  it('retries transient errors with bounded exponential backoff', async () => {
    const repository = createRepository()
    const sendMessage = vi.fn(async () => {
      throw Object.assign(new Error('rate limited'), { status: 429 })
    })

    const result = await processClaimedDelivery(delivery, {
      repository,
      sendMessage,
      studioBaseUrl: 'https://sathian.ai',
      now: () => new Date('2026-07-14T16:00:00.000Z'),
    })

    expect(result).toEqual({ status: 'retrying' })
    expect(repository.markFailed).toHaveBeenCalledWith(delivery.outboxId, {
      errorCode: 'telegram_429',
      permanent: false,
      nextAttemptAt: '2026-07-14T16:02:00.000Z',
    })
  })

  it('makes permanent errors visible without an infinite retry loop', async () => {
    const repository = createRepository()
    const sendMessage = vi.fn(async () => {
      throw Object.assign(new Error('forbidden'), { status: 403 })
    })

    const result = await processClaimedDelivery(delivery, {
      repository,
      sendMessage,
      studioBaseUrl: 'https://sathian.ai',
      now: () => new Date('2026-07-14T16:00:00.000Z'),
    })

    expect(result).toEqual({ status: 'dead_letter' })
    expect(repository.markFailed).toHaveBeenCalledWith(delivery.outboxId, {
      errorCode: 'telegram_403',
      permanent: true,
      nextAttemptAt: null,
    })
  })
})
