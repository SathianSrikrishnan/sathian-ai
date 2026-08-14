export type PublicProjectStatus = 'primary' | 'active' | 'archive'

export interface PublicSiteProject {
  id: string
  slug: string
  name: string
  label: string
  description: string
  approvedClaims: readonly string[]
  aliases: readonly string[]
  status: PublicProjectStatus
  reviewedAt: string
  href: string
  cta: string
  image: string
  alt: string
  topics: readonly string[]
}

export const TOOTH_FAIRY_NETWORK_PROJECT: PublicSiteProject = {
  id: 'project-tooth-fairy-network',
  slug: 'tooth-fairy-network',
  name: 'Tooth Fairy Network',
  label: 'PRIMARY BUILD / LIVE MAINNET FOUNDATION',
  description:
    'A private family time capsule with an optional, guardian-controlled future gift secured on Solana.',
  approvedClaims: [
    'Tooth Fairy Network turns a child\'s drawing and story into a private time capsule with an optional guardian-controlled future gift.',
    'Its deployed Solana Mainnet program is live and supports time-locked SOL and canonical USDC deposits.',
    'Verified founder-controlled canaries proved both rails.',
    'The public USDC and on-ramp checkout experience remains behind a release gate until the customer flow is approved.',
    'Private child content stays off-chain by default.',
  ],
  aliases: ['Tooth Fairy Network', 'TFN', 'Toothlight'],
  status: 'primary',
  reviewedAt: '2026-08-13',
  href: 'https://toothfairy.network',
  cta: 'Visit Tooth Fairy Network',
  image: '/projects/tooth-fairy-network/family-storybook-hero.webp',
  alt: 'Tanda in the Tooth Fairy Network storybook world',
  topics: [
    'project',
    'family-savings',
    'private-time-capsule',
    'solana',
    'mainnet',
    'ownership',
    'transparent-value-transfer',
  ],
}

export const AUTOQUOTE_AUTOMATOR_PROJECT: PublicSiteProject = {
  id: 'project-autoquote-automator',
  slug: 'autoquote-automator',
  name: 'AutoQuote Automator',
  label: 'RECENT HACKATHON / ACTIVE BUILD',
  description:
    'An evidence-first personal shopping agent for Ontario auto insurance, with private intake, human approval gates, and an honest result for every route.',
  approvedClaims: [
    "AutoQuote Automator, previously called Coverage Ledger, is Sathian's active Ontario auto-insurance shopping-agent experiment.",
    'It uses private intake, evidence-first research, and human approval gates rather than pretending to issue a binding insurance quote.',
  ],
  aliases: ['AutoQuote Automator', 'AutoQuote', 'Coverage Ledger', 'auto insurance agent'],
  status: 'active',
  reviewedAt: '2026-08-13',
  href: 'https://ontario-all-quote-agent.vercel.app',
  cta: 'Open AutoQuote Automator',
  image: '/projects/autoquote-automator-dashboard.png',
  alt: 'The public AutoQuote Automator evidence dashboard',
  topics: ['project', 'hackathon', 'ontario-insurance', 'shopping-agent'],
}

export const SOLANA_OBSERVATORY_PROJECT: PublicSiteProject = {
  id: 'project-solana-ecosystem-observatory',
  slug: 'solana-ecosystem-observatory',
  name: 'Solana Ecosystem Observatory',
  label: 'LIVE CONSUMER GUIDE / SOURCE-VISIBLE DATA',
  description:
    'A plain-English, interactive introduction to Solana with a live evidence layer and a verified Tooth Fairy Network example.',
  approvedClaims: [
    "Solana Ecosystem Observatory is Sathian's active public mini app for people who are new to Solana.",
    'It explains the shared ledger in plain English, shows why low-cost inspectable rails may matter, walks through one verified Tooth Fairy Network Mainnet deposit example, and then exposes a source-visible network dashboard.',
  ],
  aliases: ['Solana Ecosystem Observatory', 'Solana Observatory', 'Solana dashboard', 'Solana guide'],
  status: 'active',
  reviewedAt: '2026-08-13',
  href: 'https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/',
  cta: 'Open the Solana guide',
  image: '/projects/solana-ecosystem-observatory.png',
  alt: 'The source-visible Solana Ecosystem Observatory dashboard',
  topics: ['project', 'solana', 'ecosystem-observatory', 'visual-learning', 'tooth-fairy-network', 'source-visible-data'],
}

export const CLINICAL_GUARD_SITE_PROJECT: PublicSiteProject = {
  id: 'project-clinicalguard',
  slug: 'clinicalguard',
  name: 'ClinicalGuard',
  label: 'PRIOR HACKATHON',
  description:
    'A five-step clinical-coding validation pipeline that keeps weak or contradictory matches with a human reviewer.',
  approvedClaims: [
    'ClinicalGuard is an archived hackathon project from the U of T Healthcare AI Hackathon in March 2026.',
    'Its five-step LangGraph pipeline proposes ICD-9 codes, validates them against laboratory and prescription evidence, and sends weak or contradictory matches to a human reviewer.',
  ],
  aliases: ['ClinicalGuard', 'Clinical Guard'],
  status: 'archive',
  reviewedAt: '2026-08-13',
  href: '/projects/clinicalguard',
  cta: 'Open ClinicalGuard',
  image: '/projects/clinicalguard-dashboard.png',
  alt: 'ClinicalGuard clinical coding validation dashboard using synthetic patient information',
  topics: ['project', 'hackathon', 'healthcare-ai', 'langgraph', 'clinical-coding'],
}

export const AGENTTAB_SITE_PROJECT: PublicSiteProject = {
  id: 'project-agenttab',
  slug: 'agenttab',
  name: 'AgentTab',
  label: 'PRIOR HACKATHON',
  description: 'A payment firewall that gives autonomous agents a bounded allowance and purchase policy.',
  approvedClaims: [
    'AgentTab is an archived Monad Blitz Toronto hackathon project from July 2026.',
    "A human sets an agent's allowance and purchase boundaries; over-limit requests fail before payment while approved x402 purchases produce public receipts on Monad Testnet.",
  ],
  aliases: ['AgentTab', 'Agent Tab', 'corporate card for agents'],
  status: 'archive',
  reviewedAt: '2026-08-13',
  href: 'https://agenttab.sathian.ai',
  cta: 'Open AgentTab',
  image: '/media/a-corporate-card-for-code-agenttab.png',
  alt: 'AgentTab allowance and payment-policy dashboard',
  topics: ['project', 'hackathon', 'ai-agents', 'payments', 'x402', 'monad'],
}

export const BTC_CULTURAL_ATLAS_SITE_PROJECT: PublicSiteProject = {
  id: 'project-btc-cultural-atlas',
  slug: 'btc-cultural-atlas',
  name: 'BTC Cultural Atlas',
  label: 'CULTURE / HOBBY PROJECT',
  description: 'A public cultural data project for exploring Bitcoin through people, places, and stories.',
  approvedClaims: [
    "BTC Cultural Atlas is an archived culture and hobby project in Sathian's public portfolio.",
    'Its public site remains available as a visual exploration of Bitcoin culture.',
  ],
  aliases: ['BTC Cultural Atlas', 'Bitcoin Cultural Atlas', 'BTC Atlas'],
  status: 'archive',
  reviewedAt: '2026-08-13',
  href: 'https://btc.sathian.ai',
  cta: 'Open BTC Cultural Atlas',
  image: '/projects/btc-cultural-atlas-hero.png',
  alt: 'BTC Cultural Atlas project artwork',
  topics: ['project', 'culture', 'hobby-project', 'bitcoin', 'data-visualization'],
}

export const LEX_ROOFTOP_GARDEN_SITE_PROJECT: PublicSiteProject = {
  id: 'project-lex-rooftop-garden',
  slug: 'lex-rooftop-garden',
  name: 'Lex Rooftop Garden',
  label: 'COMMUNITY / HOBBY PROJECT',
  description: 'A public companion for a resident-led Toronto rooftop garden.',
  approvedClaims: [
    "Lex Rooftop Garden is an archived community and hobby project in Sathian's public portfolio.",
    'Its public site remains available as a companion to the resident-led rooftop garden.',
  ],
  aliases: ['Lex Rooftop Garden', 'Lex Garden', 'rooftop garden'],
  status: 'archive',
  reviewedAt: '2026-08-13',
  href: 'https://garden.sathian.ai',
  cta: 'Open Lex Rooftop Garden',
  image: '/projects/lex-rooftop-aerial.jpg',
  alt: 'Aerial view of the Lex rooftop garden',
  topics: ['project', 'community', 'hobby-project', 'garden', 'toronto'],
}

export const SITE_PROJECTS: readonly PublicSiteProject[] = [
  TOOTH_FAIRY_NETWORK_PROJECT,
  AUTOQUOTE_AUTOMATOR_PROJECT,
  SOLANA_OBSERVATORY_PROJECT,
  CLINICAL_GUARD_SITE_PROJECT,
  AGENTTAB_SITE_PROJECT,
  BTC_CULTURAL_ATLAS_SITE_PROJECT,
  LEX_ROOFTOP_GARDEN_SITE_PROJECT,
]

export const FEATURED_SITE_PROJECTS: readonly PublicSiteProject[] = [
  TOOTH_FAIRY_NETWORK_PROJECT,
  AUTOQUOTE_AUTOMATOR_PROJECT,
]

export const ACTIVE_SITE_PROJECTS: readonly PublicSiteProject[] = SITE_PROJECTS
  .filter((project) => project.status === 'primary' || project.status === 'active')

export const ARCHIVE_SITE_PROJECTS: readonly PublicSiteProject[] = [
  LEX_ROOFTOP_GARDEN_SITE_PROJECT,
  BTC_CULTURAL_ATLAS_SITE_PROJECT,
  AGENTTAB_SITE_PROJECT,
  CLINICAL_GUARD_SITE_PROJECT,
]

function normalizeAlias(value: string): string {
  return value.toLowerCase().trim()
}

export function projectAliasTag(value: string): string {
  return normalizeAlias(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function findSiteProjectsByAlias(message: string): PublicSiteProject[] {
  const normalizedMessage = normalizeAlias(message)
  const matches = SITE_PROJECTS.flatMap((project, projectIndex) => {
    const aliases = Array.from(new Set([project.name, ...project.aliases]))
      .sort((left, right) => right.length - left.length)
    const match = aliases
      .map((alias) => ({ alias, index: normalizedMessage.indexOf(normalizeAlias(alias)) }))
      .filter((candidate) => candidate.index >= 0)
      .sort((left, right) => left.index - right.index || right.alias.length - left.alias.length)[0]
    return match ? [{ project, projectIndex, ...match }] : []
  })

  return matches
    .sort((left, right) => left.index - right.index || right.alias.length - left.alias.length || left.projectIndex - right.projectIndex)
    .map((match) => match.project)
}
