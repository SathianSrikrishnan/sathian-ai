export interface PublicSiteProject {
  id: string
  slug: string
  name: string
  label: string
  description: string
  agentSummary: string
  href: string
  cta: string
  image: string
  alt: string
  tags: string[]
}

export const AUTOQUOTE_AUTOMATOR_PROJECT: PublicSiteProject = {
  id: 'project-autoquote-automator',
  slug: 'autoquote-automator',
  name: 'AutoQuote Automator',
  label: 'RECENT HACKATHON / ACTIVE BUILD',
  description:
    'An evidence-first personal shopping agent for Ontario auto insurance, with private intake, human approval gates, and an honest result for every route.',
  agentSummary:
    'AutoQuote Automator, previously called Coverage Ledger, is Sathian’s active Ontario auto-insurance shopping-agent experiment. It uses private intake, evidence-first research, and human approval gates rather than pretending to issue a binding insurance quote.',
  href: 'https://ontario-all-quote-agent.vercel.app',
  cta: 'Open the current dashboard',
  image: '/projects/autoquote-automator-dashboard.png',
  alt: 'The public AutoQuote Automator evidence dashboard',
  tags: [
    'project',
    'active-build',
    'hackathon',
    'autoquote',
    'autoquote-automator',
    'auto-insurance-agent',
    'coverage-ledger',
    'ontario-insurance',
  ],
}

export const SOLANA_OBSERVATORY_PROJECT: PublicSiteProject = {
  id: 'project-solana-ecosystem-observatory',
  slug: 'solana-ecosystem-observatory',
  name: 'Solana Ecosystem Observatory',
  label: 'LIVE FOUNDATION / DIRECT RPC / SOURCE-VISIBLE',
  description:
    'A visual, source-visible introduction to the Solana ecosystem and the network characteristics behind Tooth Fairy Network.',
  agentSummary:
    'Solana Ecosystem Observatory is Sathian’s public visual dashboard for people who are new to Solana. It explains the ecosystem, shows a source-visible network snapshot, and connects those ideas to why Tooth Fairy Network is being built on Solana.',
  href: 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/SathianSrikrishnan/solana-ecosystem-dashboard/main/output/index.html',
  cta: 'Open the current public snapshot',
  image: '/projects/solana-ecosystem-observatory.png',
  alt: 'The source-visible Solana Ecosystem Observatory dashboard',
  tags: [
    'project',
    'active-build',
    'solana',
    'solana-dashboard',
    'ecosystem-observatory',
    'visual-learning',
    'tooth-fairy-network',
  ],
}
