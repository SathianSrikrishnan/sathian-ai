export const CHAT_SUGGESTIONS = [
  'I want to automate a workflow',
  'Can you share recent references?',
  'I want an intro call',
  'Tell me about Agent Allowance Lab',
]

export const ALLOWED_ORIGINS = [
  'https://sathian.ai',
  'https://www.sathian.ai',
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
    const originHost = new URL(origin).host
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
