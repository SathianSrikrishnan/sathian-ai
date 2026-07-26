import { createHash, timingSafeEqual } from 'node:crypto'

import {
  MAX_AGENT_FILE_BYTES,
  inspectAgentFile,
  validateAgentFileDeclaration,
} from '@/lib/agent/file-policy'

interface ReserveBody {
  filename?: unknown
  contentType?: unknown
  byteSize?: unknown
  consent?: unknown
  turnstileToken?: unknown
}

export interface ReserveAttachmentInput {
  request: Request
  publicIdempotencyKey: string
  filename: string
  sanitizedFilename: string
  contentType: string
  byteSize: number
}

type ReserveAttachmentResult =
  | {
      ok: true
      attachmentId: string
      signedUploadUrl: string
      completionToken: string
    }
  | { ok: false; code: 'intake_not_found' | 'file_already_reserved' | 'unavailable' }

interface ReserveDependencies {
  verifyHuman(input: {
    token: string
    request: Request
    idempotencyKey: string
  }): Promise<boolean>
  consumeRateLimit(request: Request): Promise<boolean>
  reserve(input: ReserveAttachmentInput): Promise<ReserveAttachmentResult>
}

export interface PendingAttachment {
  id: string
  objectPath: string
  filename: string
  contentType: string
  byteSize: number
  status: string
  completionTokenHash: string
}

interface CompleteDependencies {
  getReservation(attachmentId: string): Promise<PendingAttachment | null>
  download(objectPath: string): Promise<Uint8Array>
  markQuarantined(input: {
    attachmentId: string
    completionTokenHash: string
    sha256: string
    detectedContentType: string
    scanResult: { policy: 'passed'; contentProcessing: 'disabled' }
  }): Promise<boolean>
  markRejected(input: {
    attachmentId: string
    completionTokenHash: string
    reason: string
    sha256: string
  }): Promise<boolean>
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function validIdempotencyKey(value: string): boolean {
  return /^[A-Za-z0-9._:-]{16,128}$/.test(value)
}

export function createUploadReserveHandler(dependencies: ReserveDependencies) {
  return async function handleUploadReserve(request: Request): Promise<Response> {
    let body: ReserveBody
    try {
      body = (await request.json()) as ReserveBody
    } catch {
      return json({ error: 'A valid JSON body is required.' }, 400)
    }

    const publicIdempotencyKey = request.headers.get('idempotency-key') ?? ''
    if (!validIdempotencyKey(publicIdempotencyKey)) {
      return json({ error: 'A valid note receipt key is required.' }, 400)
    }
    if (body.consent !== true) {
      return json({ error: 'Consent is required before a file can be stored.' }, 400)
    }
    if (
      typeof body.filename !== 'string' ||
      typeof body.contentType !== 'string' ||
      typeof body.byteSize !== 'number'
    ) {
      return json({ error: 'Valid file metadata is required.' }, 400)
    }

    const declaration = validateAgentFileDeclaration({
      filename: body.filename,
      contentType: body.contentType,
      byteSize: body.byteSize,
    })
    if (!declaration.ok) {
      return json({ error: declaration.code }, declaration.code === 'file_too_large' ? 413 : 415)
    }
    if (typeof body.turnstileToken !== 'string' || !body.turnstileToken) {
      return json({ error: 'Human verification is required for file intake.' }, 403)
    }

    let verified = false
    try {
      verified = await dependencies.verifyHuman({
        token: body.turnstileToken,
        request,
        idempotencyKey: publicIdempotencyKey,
      })
    } catch {
      return json({ error: 'File verification is temporarily unavailable.' }, 503)
    }
    if (!verified) return json({ error: 'Human verification failed.' }, 403)

    let capacity = false
    try {
      capacity = await dependencies.consumeRateLimit(request)
    } catch {
      return json({ error: 'File intake is temporarily unavailable.' }, 503)
    }
    if (!capacity) return json({ error: 'The file intake limit has been reached. Please try later.' }, 429)

    let reserved: ReserveAttachmentResult
    try {
      reserved = await dependencies.reserve({
        request,
        publicIdempotencyKey,
        filename: body.filename,
        sanitizedFilename: declaration.sanitizedFilename,
        contentType: declaration.contentType,
        byteSize: body.byteSize,
      })
    } catch {
      return json({ error: 'The private upload could not be reserved.' }, 503)
    }

    if (!reserved.ok) {
      if (reserved.code === 'file_already_reserved') {
        return json({ error: 'One file is allowed per note.' }, 409)
      }
      if (reserved.code === 'intake_not_found') {
        return json({ error: 'Send the note before attaching its file.' }, 409)
      }
      return json({ error: 'The private upload could not be reserved.' }, 503)
    }

    return json({
      upload: {
        attachmentId: reserved.attachmentId,
        url: reserved.signedUploadUrl,
        completionToken: reserved.completionToken,
        expiresInSeconds: 7200,
      },
      file: { name: declaration.sanitizedFilename, maxBytes: MAX_AGENT_FILE_BYTES },
    }, 201)
  }
}

function completionHash(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function hashesMatch(expected: string, actual: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(expected) || !/^[a-f0-9]{64}$/i.test(actual)) return false
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(actual, 'hex'))
}

export function createUploadCompleteHandler(dependencies: CompleteDependencies) {
  return async function handleUploadComplete(request: Request): Promise<Response> {
    let body: { attachmentId?: unknown; completionToken?: unknown }
    try {
      body = await request.json() as { attachmentId?: unknown; completionToken?: unknown }
    } catch {
      return json({ error: 'A valid JSON body is required.' }, 400)
    }

    if (
      typeof body.attachmentId !== 'string' ||
      !/^[a-f0-9-]{36}$/i.test(body.attachmentId) ||
      typeof body.completionToken !== 'string' ||
      body.completionToken.length < 16 ||
      body.completionToken.length > 256
    ) {
      return json({ error: 'A valid upload completion receipt is required.' }, 400)
    }

    let attachment: PendingAttachment | null
    try {
      attachment = await dependencies.getReservation(body.attachmentId)
    } catch {
      return json({ error: 'The upload receipt could not be checked.' }, 503)
    }
    if (!attachment || attachment.status !== 'pending') {
      return json({ error: 'This upload is not pending.' }, 409)
    }

    const tokenHash = completionHash(body.completionToken)
    if (!hashesMatch(attachment.completionTokenHash, tokenHash)) {
      return json({ error: 'The upload completion receipt is invalid.' }, 403)
    }

    let bytes: Uint8Array
    try {
      bytes = await dependencies.download(attachment.objectPath)
    } catch {
      return json({ error: 'The uploaded object could not be read safely.' }, 409)
    }

    const inspection = inspectAgentFile({
      filename: attachment.filename,
      contentType: attachment.contentType,
      byteSize: attachment.byteSize,
    }, bytes)
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    if (!inspection.ok) {
      await dependencies.markRejected({
        attachmentId: attachment.id,
        completionTokenHash: attachment.completionTokenHash,
        reason: inspection.code,
        sha256,
      })
      return json({ error: inspection.code }, 415)
    }

    const updated = await dependencies.markQuarantined({
      attachmentId: attachment.id,
      completionTokenHash: attachment.completionTokenHash,
      sha256,
      detectedContentType: inspection.detectedContentType,
      scanResult: { policy: 'passed', contentProcessing: 'disabled' },
    })
    if (!updated) return json({ error: 'This upload is no longer pending.' }, 409)

    return json({
      status: 'quarantined',
      file: { name: attachment.filename },
    }, 202)
  }
}
