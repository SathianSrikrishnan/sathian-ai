import { type NextRequest, NextResponse } from 'next/server'

import {
  maybeSendWhatsAppAcknowledgement,
  parseWhatsAppWebhookPayload,
  storeWhatsAppWebhookPayload,
  verifyMetaWebhookSignature,
} from '@/lib/tfn/whatsapp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const verifyToken = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  const expectedVerifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

  if (mode === 'subscribe' && challenge && expectedVerifyToken && verifyToken === expectedVerifyToken) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  return NextResponse.json(
    { success: false, error: 'Invalid WhatsApp webhook verification.' },
    { status: 403 },
  )
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  if (!verifyMetaWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { success: false, error: 'Invalid WhatsApp webhook signature.' },
      { status: 403 },
    )
  }

  const payload = parseWhatsAppWebhookPayload(rawBody)
  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Invalid WhatsApp webhook payload.' },
      { status: 400 },
    )
  }

  const storage = await storeWhatsAppWebhookPayload(payload, {
    'x-hub-signature-256': signature,
    'user-agent': request.headers.get('user-agent'),
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
  })
  const acknowledgement = await maybeSendWhatsAppAcknowledgement(storage.inboundMessages)

  return NextResponse.json({
    success: true,
    received: true,
    stored: storage.stored,
    acknowledgement,
  })
}
