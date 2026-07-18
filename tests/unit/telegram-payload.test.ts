import { describe, expect, it } from 'vitest'

import { buildTelegramIntakeMessage } from '@/lib/agent/telegram-payload'

describe('Telegram intake payload', () => {
  it('contains a short escaped preview and a Studio link', () => {
    const payload = buildTelegramIntakeMessage({
      receiptCode: 'SA-4F9Q2M7K8D',
      kind: 'contact',
      displayName: 'Ada <Lovelace>',
      replyEmail: 'ada@example.com',
      message: `<script>alert('secret')</script>${' longer context'.repeat(50)}`,
      pageContext: '/writing/tooth-fairy-network',
      attachmentCount: 1,
      studioBaseUrl: 'https://sathian.ai',
    })

    expect(payload.parseMode).toBe('HTML')
    expect(payload.text).toContain('SA-4F9Q2M7K8D')
    expect(payload.text).toContain('Contact request')
    expect(payload.text).toContain('Ada &lt;Lovelace&gt;')
    expect(payload.text).toContain('ada@example.com')
    expect(payload.text).toContain('&lt;script&gt;')
    expect(payload.text).not.toContain('<script>')
    expect(payload.text).toContain('https://sathian.ai/studio/inbox?receipt=SA-4F9Q2M7K8D')
    expect(payload.text).toContain('1 quarantined attachment')
    expect(payload.text.length).toBeLessThan(900)
  })

  it('does not include attachment bytes, object paths, or credentials', () => {
    const payload = buildTelegramIntakeMessage({
      receiptCode: 'SA-4F9Q2M7K8D',
      kind: 'note',
      displayName: null,
      replyEmail: null,
      message: 'Here is the project note.',
      pageContext: '/',
      attachmentCount: 2,
      studioBaseUrl: 'https://sathian.ai/',
    })
    const serialized = JSON.stringify(payload)

    expect(serialized).not.toContain('attachmentBytes')
    expect(serialized).not.toContain('objectPath')
    expect(serialized).not.toContain('botToken')
    expect(serialized).toContain('2 quarantined attachments')
  })

  it('surfaces cleared attachment metadata without object paths or file bytes', () => {
    const message = buildTelegramIntakeMessage({
      receiptCode: 'SA-ABC123',
      kind: 'mixed',
      displayName: null,
      replyEmail: null,
      message: 'Please review the attached brief.',
      pageContext: '/',
      attachmentCount: 1,
      attachments: [{ filename: 'brief.pdf', contentType: 'application/pdf', byteSize: 2048 }],
      studioBaseUrl: 'https://sathian.ai',
    })

    expect(message.text).toContain('brief.pdf')
    expect(message.text).toContain('PDF')
    expect(message.text).toContain('2 KB')
    expect(message.text).not.toContain('intakes/')
    expect(message.text).not.toContain('agent-quarantine')
  })
})
