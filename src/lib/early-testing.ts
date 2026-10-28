/** Shared public contract. Marketing and financial eligibility are separate decisions. */
export const EARLY_TESTING = {
  endpoint: '/api/early-testing',
  consentVersion: 'upcoming-experience-notice/2026-10-27',
  heading: 'Help shape what comes next.',
  introduction: 'Join the early testing list for our upcoming Meta-connected experience. We’ll email you when it’s ready, with setup details and what participating families can try.',
  consent: 'By signing up, you ask us to email you when our upcoming experience is ready, with setup details and early-testing information. This does not subscribe you to marketing.',
  terms: 'The upcoming experience is not ready yet. Signing up does not give immediate access or confirm a testing place.',
  button: 'Keep me posted',
  success: 'Thank you. Your email is saved. We’ll email you when the upcoming experience is ready, with early-testing details.',
  failure: 'Your email was not saved. Please try again.',
} as const

export type EarlyTestingSite = 'proof' | 'learn'

export function normalizedSignupEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i.test(email)) return null
  const [local, domain] = email.split('@')
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null
  if (domain.split('.').some(label => !label || label.length > 63 || label.startsWith('-') || label.endsWith('-'))) return null
  return email
}

export function validSignupSource(site: unknown, page: unknown): site is EarlyTestingSite {
  if (typeof page !== 'string' || page.length > 160) return false
  return site === 'proof' ? /^\/(?:proof\/?)?$/.test(page)
    : site === 'learn' && /^\/learn(?:\/[a-z0-9-]+)*\/?$/.test(page)
}

export interface EarlyTesterContact {
  id: string
  email_normalized: string
  created_at: string
  newsletter_subscribers: { status: string } | null
  early_tester_interests: Array<{
    status: string
    early_tester_signup_events: Array<{
      source_site: EarlyTestingSite
      source_page: string
      consented_at: string
      consent_copy_version: string
      marketing_opt_in: false
    }>
  }>
}
