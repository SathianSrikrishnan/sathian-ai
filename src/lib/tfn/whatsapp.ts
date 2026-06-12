import { createHmac, timingSafeEqual } from 'node:crypto'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type JsonRecord = Record<string, unknown>

type NormalizedContact = {
  providerContactId: string
  displayName: string | null
  rawProfile: JsonRecord
}

export type NormalizedWhatsAppMessage = {
  direction: 'inbound' | 'status'
  providerMessageId: string
  providerContactId: string | null
  contactName: string | null
  messageType: string
  messageText: string | null
  receivedAt: string | null
  payload: JsonRecord
}

type StoreResult = {
  stored: boolean
  inboundMessages: NormalizedWhatsAppMessage[]
  error?: string
}

const DEFAULT_BRAND = 'toothfairy_network'
const DEFAULT_ACK_MESSAGE =
  'Thanks for reaching out to Tooth Fairy Network. We got your message and a person will follow up soon.'

export function parseWhatsAppWebhookPayload(rawBody: string): JsonRecord | null {
  try {
    const parsed = JSON.parse(rawBody)
    return isRecord(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function verifyMetaWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) return true
  if (!signatureHeader?.startsWith('sha256=')) return false

  const providedSignature = signatureHeader.slice('sha256='.length)
  const expectedSignature = createHmac('sha256', appSecret).update(rawBody).digest('hex')
  const provided = Buffer.from(providedSignature, 'hex')
  const expected = Buffer.from(expectedSignature, 'hex')

  if (provided.length !== expected.length) return false
  return timingSafeEqual(provided, expected)
}

export async function storeWhatsAppWebhookPayload(
  payload: JsonRecord,
  headers: JsonRecord,
): Promise<StoreResult> {
  const { contacts, messages } = extractWhatsAppWebhookPayload(payload)
  const inboundMessages = messages.filter((message) => message.direction === 'inbound')
  const supabase = createSupabaseServiceClient()

  if (!supabase) {
    return {
      stored: false,
      inboundMessages,
      error: 'Supabase service environment variables are not configured.',
    }
  }

  const brand = process.env.TFN_WHATSAPP_BRAND || DEFAULT_BRAND
  const now = new Date().toISOString()
  const eventType = messages.length > 0 ? 'messages' : 'webhook'

  const { error: eventError } = await supabase.from('tfn_webhook_events').insert({
    channel: 'whatsapp',
    provider: 'meta',
    event_type: eventType,
    payload,
    headers,
    processing_status: 'received',
  })

  if (eventError) {
    return { stored: false, inboundMessages, error: eventError.message }
  }

  const contactIds = new Map<string, string>()

  for (const contact of contacts) {
    const { data, error } = await supabase
      .from('tfn_channel_contacts')
      .upsert(
        {
          brand,
          channel: 'whatsapp',
          provider_contact_id: contact.providerContactId,
          display_phone: contact.providerContactId,
          display_name: contact.displayName,
          raw_profile: contact.rawProfile,
          last_seen_at: now,
        },
        { onConflict: 'brand,channel,provider_contact_id' },
      )
      .select('id')
      .single()

    if (!error && data?.id) {
      contactIds.set(contact.providerContactId, data.id)
    }
  }

  if (messages.length > 0) {
    const rows = messages.map((message) => ({
      brand,
      channel: 'whatsapp',
      direction: message.direction,
      provider_message_id: message.providerMessageId,
      provider_contact_id: message.providerContactId,
      contact_id: message.providerContactId ? contactIds.get(message.providerContactId) ?? null : null,
      message_type: message.messageType,
      message_text: message.messageText,
      payload: message.payload,
      received_at: message.receivedAt,
    }))

    const { error: messageError } = await supabase
      .from('tfn_channel_messages')
      .upsert(rows, { onConflict: 'channel,direction,provider_message_id' })

    if (messageError) {
      return { stored: false, inboundMessages, error: messageError.message }
    }
  }

  return { stored: true, inboundMessages }
}

export async function maybeSendWhatsAppAcknowledgement(messages: NormalizedWhatsAppMessage[]) {
  if (process.env.WHATSAPP_AUTO_ACK_ENABLED !== 'true') {
    return { enabled: false, sent: 0 }
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!accessToken || !phoneNumberId) {
    return { enabled: true, sent: 0, error: 'WhatsApp send credentials are not configured.' }
  }

  const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION || 'v23.0'
  const ackMessage = process.env.WHATSAPP_ACK_MESSAGE || DEFAULT_ACK_MESSAGE
  const recipients = Array.from(
    new Set(messages.map((message) => message.providerContactId).filter(Boolean) as string[]),
  )
  let sent = 0

  for (const recipient of recipients) {
    const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: ackMessage,
        },
      }),
    })

    if (response.ok) sent += 1
  }

  return { enabled: true, sent }
}

function extractWhatsAppWebhookPayload(payload: JsonRecord) {
  const contacts = new Map<string, NormalizedContact>()
  const messages: NormalizedWhatsAppMessage[] = []
  const entry = Array.isArray(payload.entry) ? payload.entry : []

  for (const entryItem of entry) {
    if (!isRecord(entryItem)) continue
    const changes = Array.isArray(entryItem.changes) ? entryItem.changes : []

    for (const change of changes) {
      if (!isRecord(change)) continue
      const value = isRecord(change.value) ? change.value : {}

      for (const contact of Array.isArray(value.contacts) ? value.contacts : []) {
        if (!isRecord(contact) || typeof contact.wa_id !== 'string') continue
        const profile = isRecord(contact.profile) ? contact.profile : {}
        const displayName = typeof profile.name === 'string' ? profile.name : null
        contacts.set(contact.wa_id, {
          providerContactId: contact.wa_id,
          displayName,
          rawProfile: contact,
        })
      }

      for (const message of Array.isArray(value.messages) ? value.messages : []) {
        if (!isRecord(message) || typeof message.id !== 'string') continue
        const providerContactId = typeof message.from === 'string' ? message.from : null
        const contact = providerContactId ? contacts.get(providerContactId) : null
        messages.push({
          direction: 'inbound',
          providerMessageId: message.id,
          providerContactId,
          contactName: contact?.displayName ?? null,
          messageType: typeof message.type === 'string' ? message.type : 'unknown',
          messageText: getMessageText(message),
          receivedAt: getTimestamp(message.timestamp),
          payload: message,
        })
      }

      for (const status of Array.isArray(value.statuses) ? value.statuses : []) {
        if (!isRecord(status) || typeof status.id !== 'string') continue
        messages.push({
          direction: 'status',
          providerMessageId: status.id,
          providerContactId: typeof status.recipient_id === 'string' ? status.recipient_id : null,
          contactName: null,
          messageType: typeof status.status === 'string' ? status.status : 'status',
          messageText: null,
          receivedAt: getTimestamp(status.timestamp),
          payload: status,
        })
      }
    }
  }

  return { contacts: Array.from(contacts.values()), messages }
}

function createSupabaseServiceClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return null

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function getMessageText(message: JsonRecord): string | null {
  if (isRecord(message.text) && typeof message.text.body === 'string') return message.text.body
  if (typeof message.button === 'string') return message.button
  if (isRecord(message.interactive) && typeof message.interactive.type === 'string') return message.interactive.type
  return null
}

function getTimestamp(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const seconds = Number(value)
  if (!Number.isFinite(seconds)) return null
  return new Date(seconds * 1000).toISOString()
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}
