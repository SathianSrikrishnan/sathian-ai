export interface PublicBuildNote {
  date: string
  status: string
  project: string
  title: string
  changed: string
  learned: string
  next: string
  href: string
  external?: boolean
  proofHref?: string
  proofLabel?: string
}

export const publicBuildNotes: PublicBuildNote[] = [
  {
    date: '2026-07-24',
    status: 'PROVEN',
    project: 'TOOTH FAIRY NETWORK',
    title: 'Six wallets, one evidence ledger',
    changed: 'Tested Phantom, Solflare, Backpack, Jupiter Wallet, Trust Wallet, and MetaMask with synthetic Solana devnet assets. Five completed owner-signed outbound cNFT transfers; Solflare, Backpack, and Jupiter Wallet completed the full escrow lifecycle.',
    learned: '“Supports Solana” is not one capability. Connection, signing, asset receipt, transfer, display, escrow, cancellation, and mobile behavior each need their own receipt.',
    next: 'Trust and MetaMask still have documented escrow limitations. Resolve those paths, then run the mobile and native-display matrix before publishing any support logos.',
    href: 'https://toothfairy.network/wallets',
    external: true,
    proofHref: 'https://toothfairy.network/wallets',
    proofLabel: 'Open the wallet verification ledger',
  },
  {
    date: '2026-07-22',
    status: 'EXPERIMENTING',
    project: 'AI-NATIVE INFRASTRUCTURE',
    title: 'Giving agents context without giving them the keys',
    changed: 'I am assembling the working layer behind my own projects: agent-driven workflows, persistent memory, retrieval and data architecture, and small harnesses for bounded actions.',
    learned: 'The useful part is not a more autonomous agent. It is a better-defined system around it: what the agent can remember, retrieve, do, and prove afterward.',
    next: 'Keep testing the pattern in my own work, with friends, and in a small number of client settings before describing it as a repeatable practice.',
    href: '/about#automation',
  },
  {
    date: '2026-07-15',
    status: 'PROVEN',
    project: 'TOOTH FAIRY NETWORK',
    title: 'Making a childhood memory ownable without making it public',
    changed: 'Minted one synthetic private-provenance Toothlight on Solana devnet to a disposable guardian wallet. Metaplex DAS independently verified the asset, owner, tree, and metadata. No production or mainnet configuration changed.',
    learned: 'A guardian-owned digital keepsake can provide verifiable ownership and provenance while the child’s artwork and the parent’s future letter remain private.',
    next: 'Build the parent-facing wallet experience and compare the current Bubblegum V1 proof with the recommended V2 path before choosing a production standard.',
    href: 'https://toothfairy.network',
    external: true,
    proofHref: 'https://explorer.solana.com/tx/2gWn6Jd1avq5pvvUBqBjELSxGKQEpbk5MeMamAQLzMpKeW8xieij4ZHR4iwJ7kchhjjZcAK4fcSaSNw7D8JP3Gke?cluster=devnet',
    proofLabel: 'Inspect the devnet transaction',
  },
  {
    date: '2026-07-14',
    status: 'BUILDING',
    project: 'SITE AGENT',
    title: 'The chatbot becomes a doorway',
    changed: 'Closed the Studio cookie gap, removed duplicate prompts, retired Notion logging, and made message forwarding visible.',
    learned: 'A useful agent needs clearer boundaries before it needs more tools.',
    next: 'Reviewed public memory, durable receipts, and one-way Telegram delivery.',
    href: '/#agent',
  },
  {
    date: '2026-07-11',
    status: 'ITERATING',
    project: 'TOOTH FAIRY NETWORK',
    title: 'Back to the ritual',
    changed: 'Moved the product away from technical spectacle and toward drawings, stories, and the words children attach to them.',
    learned: 'The memory is the product. The technical rails should stay underneath it.',
    next: 'Find the first hundred families willing to tell me what feels meaningful and what should disappear.',
    href: '/writings/the-gap-between-weeks',
  },
  {
    date: '2026-07-02',
    status: 'SHIPPED',
    project: 'AGENT ALLOWANCE LAB',
    title: 'Bounded budgets for agents',
    changed: 'Shipped a small Solana demo and a receipt-backed technical write-up for agent spending limits.',
    learned: 'A useful agent wallet starts with explicit authority, not a bigger balance.',
    next: 'Carry the same bounded-authority idea into the public site agent.',
    href: '/writings/agent-allowance-lab',
  },
]
