export interface TelegramIntakeMessageInput {
  receiptCode: string
  kind: 'note' | 'contact' | 'file' | 'mixed'
  displayName: string | null
  replyEmail: string | null
  message: string
  pageContext: string
  attachmentCount: number
  attachments?: Array<{
    filename: string
    contentType: string
    byteSize: number
  }>
  studioBaseUrl: string
}

export interface TelegramIntakeMessage {
  text: string
  parseMode: 'HTML'
  disableWebPagePreview: true
}

const PREVIEW_LIMIT = 360

function intakeLabel(kind: TelegramIntakeMessageInput['kind']): string {
  const labels: Record<TelegramIntakeMessageInput['kind'], string> = {
    note: 'Note',
    contact: 'Contact request',
    file: 'File intake',
    mixed: 'Note + file',
  }
  return labels[kind]
}

function displayContentType(contentType: string): string {
  const labels: Record<string, string> = {
    'application/pdf': 'PDF',
    'text/plain': 'Text',
    'text/markdown': 'Markdown',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
  }
  return labels[contentType] ?? 'File'
}

function displayByteSize(byteSize: number): string {
  if (byteSize < 1024) return `${byteSize} B`
  if (byteSize < 1024 * 1024) return `${Math.round(byteSize / 1024)} KB`
  return `${(byteSize / (1024 * 1024)).toFixed(1)} MB`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function makePreview(message: string): string {
  const normalized = message.replace(/\s+/g, ' ').trim()
  if (normalized.length <= PREVIEW_LIMIT) return normalized
  return `${normalized.slice(0, PREVIEW_LIMIT - 1).trimEnd()}…`
}

function makeStudioLink(baseUrl: string, receiptCode: string): string {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const url = new URL('studio/inbox', normalizedBaseUrl)
  url.searchParams.set('receipt', receiptCode)
  return url.toString()
}

export function buildTelegramIntakeMessage(
  input: TelegramIntakeMessageInput,
): TelegramIntakeMessage {
  const clearedAttachments = (input.attachments ?? []).slice(0, 1)
  const attachmentLine = clearedAttachments.length > 0
    ? `\n<b>File held in Studio:</b> ${clearedAttachments.map((attachment) => (
        `${escapeHtml(attachment.filename)} / ${displayContentType(attachment.contentType)} / ${displayByteSize(attachment.byteSize)}`
      )).join(', ')}`
    : input.attachmentCount > 0
      ? `\n<b>Files:</b> ${input.attachmentCount} quarantined attachment${input.attachmentCount === 1 ? '' : 's'}`
      : ''
  const studioLink = makeStudioLink(input.studioBaseUrl, input.receiptCode)
  const contactLines = [
    input.displayName ? `<b>From:</b> ${escapeHtml(input.displayName)}` : null,
    input.replyEmail ? `<b>Reply:</b> ${escapeHtml(input.replyEmail)}` : null,
  ].filter((line): line is string => Boolean(line))

  return {
    text: [
      '<b>New site-agent intake</b>',
      `<b>Type:</b> ${intakeLabel(input.kind)}`,
      `<b>Receipt:</b> ${escapeHtml(input.receiptCode)}`,
      `<b>Page:</b> ${escapeHtml(input.pageContext.slice(0, 256))}${attachmentLine}`,
      ...contactLines,
      '',
      escapeHtml(makePreview(input.message)),
      '',
      `<a href="${escapeHtml(studioLink)}">Open in Studio</a>`,
    ].join('\n'),
    parseMode: 'HTML',
    disableWebPagePreview: true,
  }
}
