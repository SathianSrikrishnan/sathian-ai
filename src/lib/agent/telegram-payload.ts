export interface TelegramIntakeMessageInput {
  receiptCode: string
  message: string
  pageContext: string
  attachmentCount: number
  studioBaseUrl: string
}

export interface TelegramIntakeMessage {
  text: string
  parseMode: 'HTML'
  disableWebPagePreview: true
}

const PREVIEW_LIMIT = 360

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
  const attachmentLine = input.attachmentCount > 0
    ? `\n<b>Files:</b> ${input.attachmentCount} quarantined attachment${input.attachmentCount === 1 ? '' : 's'}`
    : ''
  const studioLink = makeStudioLink(input.studioBaseUrl, input.receiptCode)

  return {
    text: [
      '<b>New site-agent intake</b>',
      `<b>Receipt:</b> ${escapeHtml(input.receiptCode)}`,
      `<b>Page:</b> ${escapeHtml(input.pageContext.slice(0, 256))}${attachmentLine}`,
      '',
      escapeHtml(makePreview(input.message)),
      '',
      `<a href="${escapeHtml(studioLink)}">Open in Studio</a>`,
    ].join('\n'),
    parseMode: 'HTML',
    disableWebPagePreview: true,
  }
}
