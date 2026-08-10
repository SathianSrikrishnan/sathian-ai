export type ChatSuggestion = {
  id: string
  label: string
  action: 'submit_question'
  message: string
} | {
  id: string
  label: string
  action: 'compose_note'
}

export const CHAT_SUGGESTIONS: readonly ChatSuggestion[] = [
  {
    id: 'latest-release',
    label: 'Show me the latest release',
    action: 'submit_question',
    message: 'Show me the latest release',
  },
  {
    id: 'current-work',
    label: 'What is Sathian building now?',
    action: 'submit_question',
    message: 'What is Sathian building now?',
  },
  {
    id: 'tooth-fairy-network',
    label: 'Tell me about Tooth Fairy Network',
    action: 'submit_question',
    message: 'Tell me about Tooth Fairy Network',
  },
  {
    id: 'leave-note',
    label: 'I want to leave Sathian a note',
    action: 'compose_note',
  },
]

export const ALLOWED_ORIGINS = [
  'https://sathian.ai',
  'https://www.sathian.ai',
  'https://studio.sathian.ai',
  'https://btc.sathian.ai',
  'https://toothfairy.sathian.ai',
  'https://toothfairy.network',
  'https://www.toothfairy.network',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'] : []),
]

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true
  if (ALLOWED_ORIGINS.includes(origin)) return true

  try {
    const parsedOrigin = new URL(origin)
    const originHost = parsedOrigin.host
    if (
      process.env.NODE_ENV !== 'production' &&
      parsedOrigin.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(parsedOrigin.hostname)
    ) {
      return true
    }
    const currentDeploymentHost = process.env.VERCEL_URL
    const currentBranchHost = process.env.VERCEL_BRANCH_URL

    // Vercel preview URLs are unique per deployment. Allow only this project
    // account's current preview/branch hosts, not every vercel.app origin.
    return Boolean(
      originHost === currentDeploymentHost ||
        originHost === currentBranchHost ||
        originHost.endsWith('-sathiansrikrishnans-projects.vercel.app')
    )
  } catch {
    return false
  }
}
