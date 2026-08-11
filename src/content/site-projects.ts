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

export const TOOTH_FAIRY_NETWORK_PROJECT: PublicSiteProject = {
  id: 'project-tooth-fairy-network',
  slug: 'tooth-fairy-network',
  name: 'Tooth Fairy Network',
  label: 'PRIMARY BUILD / LIVE MAINNET FOUNDATION',
  description:
    'A private family time capsule with an optional, guardian-controlled future gift secured on Solana.',
  agentSummary:
    'Tooth Fairy Network turns a child\'s drawing and story into a private time capsule with an optional guardian-controlled future gift. Its deployed Solana Mainnet program is live and supports time-locked SOL and canonical USDC deposits. Verified founder-controlled canaries proved both rails. The public USDC and on-ramp checkout experience remains behind a release gate until the customer flow is approved. Private child content stays off-chain by default.',
  href: 'https://toothfairy.network',
  cta: 'Visit Tooth Fairy Network',
  image: '/projects/tooth-fairy-network/family-storybook-hero.webp',
  alt: 'Tanda in the Tooth Fairy Network storybook world',
  tags: [
    'project',
    'primary-build',
    'tooth-fairy-network',
    'toothlight',
    'solana',
    'mainnet',
    'family-savings',
    'private-time-capsule',
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
  label: 'LIVE CONSUMER GUIDE / SOURCE-VISIBLE DATA',
  description:
    'A plain-English, interactive introduction to Solana with a live evidence layer and a verified Tooth Fairy Network example.',
  agentSummary:
    'Solana Ecosystem Observatory is Sathian’s public mini app for people who are new to Solana. It explains the shared ledger in plain English, shows why low-cost inspectable rails may matter, walks through one verified Tooth Fairy Network Mainnet deposit example, and then exposes a source-visible network dashboard.',
  href: 'https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/',
  cta: 'Open the Solana guide',
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
