import { createHash, createHmac, randomUUID } from 'node:crypto'

import type { SupabaseClient } from '@supabase/supabase-js'

import {
  agentDedupeKey,
  agentVisitorHash,
} from '@/lib/agent/message-handler'
import type {
  PendingAttachment,
  ReserveAttachmentInput,
} from '@/lib/agent/upload-handlers'

const QUARANTINE_BUCKET = 'agent-quarantine'

function rpcRow(data: unknown): Record<string, unknown> | null {
  const value = Array.isArray(data) ? data[0] : data
  return value && typeof value === 'object' ? value as Record<string, unknown> : null
}

function uploadSecret(): string {
  const secret = process.env.AGENT_UPLOAD_COMPLETION_SECRET
  if (!secret || secret.length < 32) throw new Error('agent_upload_completion_secret_missing')
  return secret
}

function completionToken(idempotencyKey: string): string {
  return createHmac('sha256', uploadSecret())
    .update(`agent-file:${idempotencyKey}`)
    .digest('base64url')
}

export function createAgentUploadRepository(client: SupabaseClient) {
  return {
    async consumeRateLimit(request: Request): Promise<boolean> {
      const visitor = agentVisitorHash(request)
      if (!visitor) throw new Error('agent_visitor_hash_unavailable')
      const { data, error } = await client.rpc('agent_consume_upload_rate_limit', {
        p_visitor_hash: visitor,
        p_limit: 3,
        p_window_seconds: 3600,
      })
      if (error || typeof data !== 'boolean') throw new Error('upload_rate_limit_failed')
      return data
    },

    async reserve(input: ReserveAttachmentInput) {
      const visitor = agentVisitorHash(input.request)
      if (!visitor) return { ok: false as const, code: 'unavailable' as const }

      const internalIdempotencyKey = agentDedupeKey(input.publicIdempotencyKey, visitor)
      const rawCompletionToken = completionToken(internalIdempotencyKey)
      const completionTokenHash = createHash('sha256').update(rawCompletionToken).digest('hex')
      const newAttachmentId = randomUUID()

      const { data, error } = await client.rpc('agent_reserve_attachment', {
        p_idempotency_key: internalIdempotencyKey,
        p_attachment_id: newAttachmentId,
        p_original_filename: input.filename.slice(0, 255),
        p_sanitized_filename: input.sanitizedFilename,
        p_declared_content_type: input.contentType,
        p_byte_size: input.byteSize,
        p_completion_token_hash: completionTokenHash,
      })
      if (error) {
        const code: 'file_already_reserved' | 'unavailable' = /already reserved|unique/i.test(error.message)
          ? 'file_already_reserved'
          : 'unavailable'
        return { ok: false as const, code }
      }

      const row = rpcRow(data)
      if (!row) return { ok: false as const, code: 'intake_not_found' as const }
      if (typeof row.attachment_id !== 'string' || typeof row.object_path !== 'string') {
        return { ok: false as const, code: 'unavailable' as const }
      }

      const signed = await client.storage
        .from(QUARANTINE_BUCKET)
        .createSignedUploadUrl(row.object_path, { upsert: false })
      if (signed.error || !signed.data?.token) {
        return { ok: false as const, code: 'unavailable' as const }
      }

      return {
        ok: true as const,
        attachmentId: row.attachment_id,
        signedUploadUrl: signed.data.signedUrl,
        completionToken: rawCompletionToken,
      }
    },

    async getReservation(attachmentId: string): Promise<PendingAttachment | null> {
      const { data, error } = await client
        .from('agent_attachments')
        .select('id, object_path, sanitized_filename, declared_content_type, content_type, byte_size, status, completion_token_hash')
        .eq('id', attachmentId)
        .maybeSingle()
      if (error) throw error
      if (!data) return null

      return {
        id: data.id,
        objectPath: data.object_path,
        filename: data.sanitized_filename,
        contentType: data.declared_content_type ?? data.content_type,
        byteSize: Number(data.byte_size),
        status: data.status,
        completionTokenHash: data.completion_token_hash,
      }
    },

    async download(objectPath: string): Promise<Uint8Array> {
      const { data, error } = await client.storage
        .from(QUARANTINE_BUCKET)
        .download(objectPath, {}, { cache: 'no-store' })
      if (error || !data) throw new Error('quarantine_download_failed')
      return new Uint8Array(await data.arrayBuffer())
    },

    async markQuarantined(input: {
      attachmentId: string
      completionTokenHash: string
      sha256: string
      detectedContentType: string
      scanResult: { policy: 'passed'; contentProcessing: 'disabled' }
    }): Promise<boolean> {
      const { data, error } = await client.rpc('agent_complete_attachment', {
        p_attachment_id: input.attachmentId,
        p_completion_token_hash: input.completionTokenHash,
        p_sha256: input.sha256,
        p_detected_content_type: input.detectedContentType,
        p_scan_result: input.scanResult,
        p_status: 'quarantined',
      })
      if (error) throw error
      return data === true
    },

    async markRejected(input: {
      attachmentId: string
      completionTokenHash: string
      reason: string
      sha256: string
    }): Promise<boolean> {
      const { data, error } = await client.rpc('agent_complete_attachment', {
        p_attachment_id: input.attachmentId,
        p_completion_token_hash: input.completionTokenHash,
        p_sha256: input.sha256,
        p_detected_content_type: 'application/octet-stream',
        p_scan_result: {
          policy: 'rejected',
          reason: input.reason,
          contentProcessing: 'disabled',
        },
        p_status: 'rejected',
      })
      if (error) throw error
      return data === true
    },
  }
}
