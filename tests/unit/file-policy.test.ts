import { describe, expect, it } from 'vitest'

import {
  MAX_AGENT_FILE_BYTES,
  canProcessAttachment,
  canSurfaceAttachmentMetadata,
  createQuarantineObjectPath,
  inspectAgentFile,
  validateAgentFileDeclaration,
} from '@/lib/agent/file-policy'

const pdf = new TextEncoder().encode('%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj')
const text = new TextEncoder().encode('A short note for Sathian.\n')
const markdown = new TextEncoder().encode('# Build note\n\nA safe Markdown file.\n')
const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46])
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00])
const webp = Uint8Array.from([
  0x52, 0x49, 0x46, 0x46, 0x0c, 0x00, 0x00, 0x00,
  0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20,
])

describe('agent file policy', () => {
  it.each([
    ['brief.pdf', 'application/pdf', pdf, 'pdf'],
    ['note.txt', 'text/plain', text, 'text'],
    ['update.md', 'text/markdown', markdown, 'markdown'],
    ['photo.jpg', 'image/jpeg', jpeg, 'jpeg'],
    ['diagram.png', 'image/png', png, 'png'],
    ['reference.webp', 'image/webp', webp, 'webp'],
  ])('allows %s only when its declaration and bytes agree', (filename, contentType, bytes, kind) => {
    const result = inspectAgentFile({ filename, contentType, byteSize: bytes.byteLength }, bytes)

    expect(result).toMatchObject({ ok: true, kind })
  })

  it.each([
    ['archive.zip', 'application/zip'],
    ['program.exe', 'application/octet-stream'],
    ['script.js', 'text/javascript'],
    ['page.html', 'text/html'],
    ['drawing.svg', 'image/svg+xml'],
    ['report.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['sheet.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['slides.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ])('blocks prohibited declaration %s', (filename, contentType) => {
    expect(validateAgentFileDeclaration({ filename, contentType, byteSize: 200 })).toMatchObject({
      ok: false,
      code: 'file_type_not_allowed',
    })
  })

  it('blocks a file whose bytes do not match its declared type', () => {
    expect(inspectAgentFile({
      filename: 'actually-a-jpeg.png',
      contentType: 'image/png',
      byteSize: jpeg.byteLength,
    }, jpeg)).toMatchObject({ ok: false, code: 'file_type_mismatch' })
  })

  it.each([
    ['page.txt', '<!doctype html><html><body>hello</body></html>'],
    ['vector.txt', '<svg xmlns="http://www.w3.org/2000/svg"></svg>'],
    ['payload.md', '<script>alert(1)</script>'],
    ['shell.txt', '#!/bin/sh\necho unsafe'],
  ])('blocks active content disguised as %s', (filename, content) => {
    const bytes = new TextEncoder().encode(content)
    expect(inspectAgentFile({
      filename,
      contentType: filename.endsWith('.md') ? 'text/markdown' : 'text/plain',
      byteSize: bytes.byteLength,
    }, bytes)).toMatchObject({ ok: false, code: 'active_content_not_allowed' })
  })

  it('blocks encrypted PDFs', () => {
    const encrypted = new TextEncoder().encode('%PDF-1.7\n<< /Encrypt 4 0 R >>')
    expect(inspectAgentFile({
      filename: 'locked.pdf',
      contentType: 'application/pdf',
      byteSize: encrypted.byteLength,
    }, encrypted)).toMatchObject({ ok: false, code: 'encrypted_pdf_not_allowed' })
  })

  it('enforces the launch size limit', () => {
    expect(validateAgentFileDeclaration({
      filename: 'too-large.pdf',
      contentType: 'application/pdf',
      byteSize: MAX_AGENT_FILE_BYTES + 1,
    })).toMatchObject({ ok: false, code: 'file_too_large' })
  })

  it('rejects an empty file and an actual-size mismatch', () => {
    expect(validateAgentFileDeclaration({
      filename: 'empty.txt',
      contentType: 'text/plain',
      byteSize: 0,
    })).toMatchObject({ ok: false, code: 'file_empty' })

    expect(inspectAgentFile({
      filename: 'note.txt',
      contentType: 'text/plain',
      byteSize: text.byteLength + 1,
    }, text)).toMatchObject({ ok: false, code: 'file_size_mismatch' })
  })

  it('uses generated identifiers in object paths rather than visitor filenames', () => {
    const path = createQuarantineObjectPath(
      '7c087b75-c227-4e24-afc1-18c77c67b2d4',
      '7dc4691b-b769-4875-b61a-f20c0bb70ea8',
    )

    expect(path).toBe('intakes/7c087b75-c227-4e24-afc1-18c77c67b2d4/7dc4691b-b769-4875-b61a-f20c0bb70ea8')
    expect(path).not.toMatch(/brief|pdf|\.txt|\.png/i)
  })

  it('never processes pending, quarantined, blocked, or rejected objects', () => {
    for (const status of ['pending', 'quarantined', 'blocked', 'rejected']) {
      expect(canProcessAttachment(status)).toBe(false)
    }
    expect(canProcessAttachment('approved')).toBe(true)
  })

  it('surfaces metadata only after byte checks clear pending state', () => {
    expect(canSurfaceAttachmentMetadata('pending')).toBe(false)
    expect(canSurfaceAttachmentMetadata('blocked')).toBe(false)
    expect(canSurfaceAttachmentMetadata('rejected')).toBe(false)
    expect(canSurfaceAttachmentMetadata('quarantined')).toBe(true)
    expect(canSurfaceAttachmentMetadata('approved')).toBe(true)
  })
})
