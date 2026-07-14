import { describe, expect, it, vi } from 'vitest'

import { createOperatorAttachmentUrl } from '@/lib/agent/operator-files'

describe('operator attachment access', () => {
  it('creates a one-object URL that expires after sixty seconds without listing the bucket', async () => {
    const createSignedUrl = vi.fn(async () => ({
      data: { signedUrl: 'https://storage.example/object?token=short-lived' },
      error: null,
    }))
    const list = vi.fn()
    const storage = { createSignedUrl, list }

    const result = await createOperatorAttachmentUrl(storage, 'intakes/a/b', 'brief.pdf')

    expect(result).toEqual({
      url: 'https://storage.example/object?token=short-lived',
      expiresInSeconds: 60,
    })
    expect(createSignedUrl).toHaveBeenCalledWith('intakes/a/b', 60, { download: 'brief.pdf' })
    expect(list).not.toHaveBeenCalled()
  })
})
