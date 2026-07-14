export const MAX_AGENT_FILE_BYTES = 5 * 1024 * 1024

export type AgentFileKind = 'pdf' | 'text' | 'markdown' | 'jpeg' | 'png' | 'webp'

export interface AgentFileDeclaration {
  filename: string
  contentType: string
  byteSize: number
}

export type AgentFilePolicyCode =
  | 'file_empty'
  | 'file_too_large'
  | 'file_type_not_allowed'
  | 'file_size_mismatch'
  | 'file_type_mismatch'
  | 'active_content_not_allowed'
  | 'encrypted_pdf_not_allowed'

type DeclarationResult =
  | { ok: true; kind: AgentFileKind; sanitizedFilename: string; contentType: string }
  | { ok: false; code: AgentFilePolicyCode }

export type AgentFileInspection =
  | {
      ok: true
      kind: AgentFileKind
      sanitizedFilename: string
      detectedContentType: string
    }
  | { ok: false; code: AgentFilePolicyCode }

const EXTENSION_KIND: Readonly<Record<string, AgentFileKind>> = {
  pdf: 'pdf',
  txt: 'text',
  md: 'markdown',
  markdown: 'markdown',
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png',
  webp: 'webp',
}

const KIND_CONTENT_TYPES: Readonly<Record<AgentFileKind, readonly string[]>> = {
  pdf: ['application/pdf'],
  text: ['text/plain'],
  markdown: ['text/markdown', 'text/plain'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
}

const DETECTED_CONTENT_TYPE: Readonly<Record<AgentFileKind, string>> = {
  pdf: 'application/pdf',
  text: 'text/plain',
  markdown: 'text/markdown',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

function extension(filename: string): string {
  const safeName = filename.replaceAll('\\', '/').split('/').pop() ?? ''
  const dot = safeName.lastIndexOf('.')
  return dot > 0 ? safeName.slice(dot + 1).toLowerCase() : ''
}

export function sanitizeVisitorFilename(filename: string): string {
  const basename = filename.replaceAll('\\', '/').split('/').pop() ?? 'attachment'
  const normalized = basename
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[^A-Za-z0-9\u00C0-\u024F._() -]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
  return (normalized || 'attachment').slice(0, 180)
}

export function validateAgentFileDeclaration(
  declaration: AgentFileDeclaration,
): DeclarationResult {
  if (!Number.isSafeInteger(declaration.byteSize) || declaration.byteSize <= 0) {
    return { ok: false, code: 'file_empty' }
  }
  if (declaration.byteSize > MAX_AGENT_FILE_BYTES) {
    return { ok: false, code: 'file_too_large' }
  }

  const kind = EXTENSION_KIND[extension(declaration.filename)]
  const normalizedContentType = declaration.contentType.toLowerCase().split(';', 1)[0].trim()
  if (!kind || !KIND_CONTENT_TYPES[kind].includes(normalizedContentType)) {
    return { ok: false, code: 'file_type_not_allowed' }
  }

  return {
    ok: true,
    kind,
    sanitizedFilename: sanitizeVisitorFilename(declaration.filename),
    contentType: normalizedContentType,
  }
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte)
}

function ascii(bytes: Uint8Array): string {
  return new TextDecoder('latin1').decode(bytes)
}

function hasForbiddenBinarySignature(bytes: Uint8Array): boolean {
  return (
    startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    startsWith(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
    startsWith(bytes, [0x4d, 0x5a]) ||
    startsWith(bytes, [0x7f, 0x45, 0x4c, 0x46]) ||
    startsWith(bytes, [0xca, 0xfe, 0xba, 0xbe]) ||
    startsWith(bytes, [0xcf, 0xfa, 0xed, 0xfe]) ||
    startsWith(bytes, [0xfe, 0xed, 0xfa, 0xcf])
  )
}

function detectImageOrPdf(bytes: Uint8Array): Exclude<AgentFileKind, 'text' | 'markdown'> | null {
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'pdf'
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'jpeg'
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png'
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'webp'
  return null
}

function inspectText(bytes: Uint8Array): 'safe' | 'binary' | 'active' {
  let content: string
  try {
    content = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return 'binary'
  }

  if (/\u0000|[\u0001-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(content)) return 'binary'

  const normalized = content.replace(/^\uFEFF/, '').trimStart().toLowerCase()
  if (
    normalized.startsWith('<!doctype html') ||
    normalized.startsWith('<html') ||
    normalized.startsWith('<svg') ||
    normalized.startsWith('#!') ||
    /<script(?:\s|>)/i.test(content)
  ) return 'active'

  return 'safe'
}

export function inspectAgentFile(
  declaration: AgentFileDeclaration,
  bytes: Uint8Array,
): AgentFileInspection {
  const declared = validateAgentFileDeclaration(declaration)
  if (!declared.ok) return declared
  if (bytes.byteLength !== declaration.byteSize) return { ok: false, code: 'file_size_mismatch' }
  if (hasForbiddenBinarySignature(bytes)) return { ok: false, code: 'file_type_mismatch' }

  const binaryKind = detectImageOrPdf(bytes)
  if (binaryKind) {
    if (binaryKind !== declared.kind) return { ok: false, code: 'file_type_mismatch' }
    if (binaryKind === 'pdf' && /\/Encrypt\b/.test(ascii(bytes))) {
      return { ok: false, code: 'encrypted_pdf_not_allowed' }
    }
  } else if (declared.kind === 'text' || declared.kind === 'markdown') {
    const textState = inspectText(bytes)
    if (textState === 'active') return { ok: false, code: 'active_content_not_allowed' }
    if (textState === 'binary') return { ok: false, code: 'file_type_mismatch' }
  } else {
    return { ok: false, code: 'file_type_mismatch' }
  }

  return {
    ok: true,
    kind: declared.kind,
    sanitizedFilename: declared.sanitizedFilename,
    detectedContentType: DETECTED_CONTENT_TYPE[declared.kind],
  }
}

export function createQuarantineObjectPath(intakeId: string, attachmentId: string): string {
  return `intakes/${intakeId}/${attachmentId}`
}

export function canProcessAttachment(status: string): boolean {
  return status === 'approved'
}

export function canSurfaceAttachmentMetadata(status: string): boolean {
  return status === 'quarantined' || status === 'approved'
}
