import { createHash } from 'node:crypto'

import { describe, expect, it, vi } from 'vitest'

import {
  createUploadCompleteHandler,
  createUploadReserveHandler,
  type PendingAttachment,
} from '@/lib/agent/upload-handlers'

const attachmentId = '7dc4691b-b769-4875-b61a-f20c0bb70ea8'
const objectPath = 'intakes/7c087b75-c227-4e24-afc1-18c77c67b2d4/7dc4691b-b769-4875-b61a-f20c0bb70ea8'
const idempotencyKey = 'visitor-idempotency-1234567890'

function reserveRequest(overrides: Record<string, unknown> = {}) {
  return new Request('https://sathian.ai/api/agent/upload/reserve', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'idempotency-key': idempotencyKey,
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify({
      filename: 'brief.pdf',
      contentType: 'application/pdf',
      byteSize: 45,
      consent: true,
      turnstileToken: 'verified-human-token',
      ...overrides,
    }),
  })
}

describe('agent upload reservation', () => {
  it('reserves exactly one generated object after verification and durable rate limiting', async () => {
    const verifyHuman = vi.fn(async () => true)
    const consumeRateLimit = vi.fn(async () => true)
    const reserve = vi.fn(async () => ({
      ok: true as const,
      attachmentId,
      signedUploadUrl: 'https://uploads.sathian.ai/object?token=signed-upload-token',
      completionToken: 'completion-secret',
    }))
    const handler = createUploadReserveHandler({ verifyHuman, consumeRateLimit, reserve })

    const response = await handler(reserveRequest())
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(verifyHuman).toHaveBeenCalledOnce()
    expect(consumeRateLimit).toHaveBeenCalledOnce()
    expect(reserve).toHaveBeenCalledWith(expect.objectContaining({
      publicIdempotencyKey: idempotencyKey,
      filename: 'brief.pdf',
      sanitizedFilename: 'brief.pdf',
      contentType: 'application/pdf',
      byteSize: 45,
    }))
    expect(body).toEqual({
      upload: {
        attachmentId,
        url: 'https://uploads.sathian.ai/object?token=signed-upload-token',
        completionToken: 'completion-secret',
        expiresInSeconds: 7200,
      },
      file: { name: 'brief.pdf', maxBytes: 5 * 1024 * 1024 },
    })
    expect(JSON.stringify(body)).not.toContain('agent-quarantine')
  })

  it('fails closed without a valid Turnstile token', async () => {
    const reserve = vi.fn()
    const handler = createUploadReserveHandler({
      verifyHuman: vi.fn(async () => false),
      consumeRateLimit: vi.fn(async () => true),
      reserve,
    })

    const response = await handler(reserveRequest({ turnstileToken: 'invalid-token' }))

    expect(response.status).toBe(403)
    expect(reserve).not.toHaveBeenCalled()
  })

  it('fails closed when durable upload capacity has been consumed', async () => {
    const reserve = vi.fn()
    const handler = createUploadReserveHandler({
      verifyHuman: vi.fn(async () => true),
      consumeRateLimit: vi.fn(async () => false),
      reserve,
    })

    const response = await handler(reserveRequest())

    expect(response.status).toBe(429)
    expect(reserve).not.toHaveBeenCalled()
  })

  it('enforces one file per intake at the repository boundary', async () => {
    const handler = createUploadReserveHandler({
      verifyHuman: vi.fn(async () => true),
      consumeRateLimit: vi.fn(async () => true),
      reserve: vi.fn(async () => ({ ok: false as const, code: 'file_already_reserved' as const })),
    })

    const response = await handler(reserveRequest())

    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toEqual({ error: 'One file is allowed per note.' })
  })
})

const pending: PendingAttachment = {
  id: attachmentId,
  objectPath,
  filename: 'brief.pdf',
  contentType: 'application/pdf',
  byteSize: 45,
  status: 'pending',
  completionTokenHash: createHash('sha256').update('completion-secret').digest('hex'),
}

function completeRequest(overrides: Record<string, unknown> = {}) {
  return new Request('https://sathian.ai/api/agent/upload/complete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      attachmentId,
      completionToken: 'completion-secret',
      ...overrides,
    }),
  })
}

describe('agent upload completion', () => {
  it('hashes and quarantines a byte-checked object without processing its contents', async () => {
    const bytes = new TextEncoder().encode('%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj')
    const getReservation = vi.fn(async () => ({ ...pending, byteSize: bytes.byteLength }))
    const download = vi.fn(async () => bytes)
    const markQuarantined = vi.fn(async () => true)
    const handler = createUploadCompleteHandler({
      getReservation,
      download,
      markQuarantined,
      markRejected: vi.fn(async () => true),
    })

    const response = await handler(completeRequest())
    const body = await response.json()

    expect(response.status).toBe(202)
    expect(download).toHaveBeenCalledWith(objectPath)
    expect(markQuarantined).toHaveBeenCalledWith(expect.objectContaining({
      attachmentId,
      detectedContentType: 'application/pdf',
      sha256: createHash('sha256').update(bytes).digest('hex'),
      scanResult: { policy: 'passed', contentProcessing: 'disabled' },
    }))
    expect(body).toEqual({ status: 'quarantined', file: { name: 'brief.pdf' } })
  })

  it('marks a mismatched object rejected and never processes it', async () => {
    const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])
    const markRejected = vi.fn(async () => true)
    const handler = createUploadCompleteHandler({
      getReservation: vi.fn(async () => ({ ...pending, byteSize: bytes.byteLength })),
      download: vi.fn(async () => bytes),
      markQuarantined: vi.fn(async () => true),
      markRejected,
    })

    const response = await handler(completeRequest())

    expect(response.status).toBe(415)
    expect(markRejected).toHaveBeenCalledWith({
      attachmentId,
      completionTokenHash: pending.completionTokenHash,
      reason: 'file_type_mismatch',
      sha256: createHash('sha256').update(bytes).digest('hex'),
    })
  })

  it.each(['blocked', 'quarantined', 'approved', 'rejected'])('does not download an object in %s state', async (status) => {
    const download = vi.fn()
    const handler = createUploadCompleteHandler({
      getReservation: vi.fn(async () => ({ ...pending, status })),
      download,
      markQuarantined: vi.fn(async () => true),
      markRejected: vi.fn(async () => true),
    })

    const response = await handler(completeRequest())

    expect(response.status).toBe(409)
    expect(download).not.toHaveBeenCalled()
  })
})
