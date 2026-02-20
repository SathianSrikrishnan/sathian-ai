interface MemoryContext {
  content: string
  sources: string[]
}

// Visibility levels:
// 'open'   — Claude can share freely, weave into any response
// 'on-ask' — Only surface when directly relevant to the question
type Visibility = 'open' | 'on-ask'

interface Fact {
  fact: string
  category: 'bio' | 'project' | 'writing' | 'philosophy' | 'collaboration'
  level: Visibility
}

const KNOWLEDGE_BASE: Fact[] = [
  // === BIO (open) ===
  { fact: 'Based in Toronto, Canada.', category: 'bio', level: 'open' },
  { fact: 'Father of twins — his kids are a big part of what drives everything he builds.', category: 'bio', level: 'open' },
  { fact: '20+ years building things — from startups to personal tools to creative projects. Self-taught, non-traditional path into tech.', category: 'bio', level: 'open' },
  { fact: 'Has conducted 100+ dinners with strangers in Toronto, ages 20-80.', category: 'bio', level: 'open' },

  // === BIO (on-ask) ===
  { fact: 'He builds creative storytelling tools for his children — that content is private out of respect for his family.', category: 'bio', level: 'on-ask' },

  // === PROJECTS (open) ===
  { fact: 'BTC Cultural Atlas (btc.sathian.ai) — 500+ cultural markers mapped to Bitcoin\'s price. Area codes, drum machines, error pages, history, sports — every number decoded. Visitors can claim numbers or suggest ones with good stories.', category: 'project', level: 'open' },
  { fact: 'Tooth Fairy Network (toothfairy.sathian.ai) — Digital childhood keepsakes. Every lost tooth becomes a permanent milestone. Built for his own children first. Parents can express interest in early access.', category: 'project', level: 'open' },
  { fact: 'Kai — His personal AI infrastructure. Model-agnostic. The public-facing version is what visitors are talking to right now.', category: 'project', level: 'open' },
  { fact: 'More projects are in the works — Sathian builds in public and shares progress on sathian.ai.', category: 'project', level: 'open' },

  // === WRITING (open) ===
  { fact: '4 published essays at sathian.ai/writings.', category: 'writing', level: 'open' },
  { fact: 'Yakko\'s World Was Already Wrong — 1993 as a hinge year: the cypherpunk manifesto, the web going free, borders dissolving, and the next hinge happening now. (sathian.ai/writings/yakkos-world)', category: 'writing', level: 'on-ask' },
  { fact: 'C.R.E.A.M. 2.0 — Wu-Tang Clan\'s journey from Staten Island to a corporate arena mirrors Bitcoin\'s path from cypherpunk whitepaper to institutional adoption. (sathian.ai/writings/cream-2-point-0)', category: 'writing', level: 'on-ask' },
  { fact: 'The Yellow Box — An Uber driver, No Name spaghetti, glasnost, and why institutions can\'t survive their citizens doing the math. (sathian.ai/writings/the-yellow-box)', category: 'writing', level: 'on-ask' },
  { fact: 'Nine Pages — Finally reading the Bitcoin whitepaper after years of borrowed conviction. (sathian.ai/writings/nine-pages)', category: 'writing', level: 'on-ask' },

  // === PHILOSOPHY (on-ask) ===
  { fact: 'Philosophy: personal sovereignty — individuals should control their own data, wealth, and digital identity.', category: 'philosophy', level: 'on-ask' },
  { fact: '"Digital tools should help us connect in person, safely."', category: 'philosophy', level: 'on-ask' },
  { fact: 'Principles: privacy first, local-first AI, model-agnostic, financial autonomy through Bitcoin.', category: 'philosophy', level: 'on-ask' },

  // === COLLABORATION (on-ask) ===
  { fact: 'Interested in connecting with people working on: open source AI, privacy tech, Bitcoin education, tools for human capability.', category: 'collaboration', level: 'on-ask' },
  { fact: 'Inspired by: Satoshi Nakamoto, Balaji Srinivasan, Daniel Miessler.', category: 'collaboration', level: 'on-ask' },
  { fact: 'The best way to reach Sathian is to leave a message right here with Kai — every message gets forwarded directly to him. Visitors can also subscribe for updates.', category: 'collaboration', level: 'open' },
]

// Build a compact knowledge context for the system prompt
// Instead of dumping raw content, we give Claude a structured facts list
function buildKnowledgeContext(): string {
  const open = KNOWLEDGE_BASE.filter(f => f.level === 'open')
  const onAsk = KNOWLEDGE_BASE.filter(f => f.level === 'on-ask')

  let context = '## Facts You Can Share Freely\n'
  for (const f of open) {
    context += `- ${f.fact}\n`
  }

  context += '\n## Facts to Share Only When Directly Relevant\n'
  for (const f of onAsk) {
    context += `- ${f.fact}\n`
  }

  return context
}

// Pre-build once — this doesn't change per request
const KNOWLEDGE_CONTEXT = buildKnowledgeContext()

export async function getMemoryContext(message: string): Promise<MemoryContext> {
  return {
    content: KNOWLEDGE_CONTEXT,
    sources: ['curated-knowledge-base'],
  }
}
