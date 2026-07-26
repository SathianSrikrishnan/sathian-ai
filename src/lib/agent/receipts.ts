import { createHash } from 'node:crypto'

export type PublicDeliveryStatus = 'queued' | 'delivered' | 'failed'

export interface PublicReceipt {
  code: string
  deliveryStatus: PublicDeliveryStatus
  message: string
}

const STATUS_MESSAGES: Record<PublicDeliveryStatus, string> = {
  queued: 'Your note is stored and queued for delivery.',
  delivered: 'Your note was delivered.',
  failed: 'Your note is stored, but delivery needs attention.',
}

export function createPublicReceipt(input: {
  receiptToken: string
  deliveryStatus: PublicDeliveryStatus
}): PublicReceipt {
  const code = createHash('sha256')
    .update(input.receiptToken)
    .digest('base64url')
    .replace(/[-_]/g, '')
    .slice(0, 10)
    .toUpperCase()

  return {
    code: `SA-${code}`,
    deliveryStatus: input.deliveryStatus,
    message: STATUS_MESSAGES[input.deliveryStatus],
  }
}
