interface MemoryContext {
  content: string
  sources: string[]
}

// Topic-based content retrieval — curated public content only
// This is the "wall" — only pre-approved content is served to visitors
function getTopicContent(message: string): string {
  const messageLower = message.toLowerCase()
  const content: string[] = []

  // Sovereignty / philosophy
  if (messageLower.includes('sovereign') || messageLower.includes('privacy') || messageLower.includes('ideology') || messageLower.includes('human 3.0') || messageLower.includes('philosophy')) {
    content.push(`
## Sathian's Philosophy

Sathian believes in personal sovereignty — individuals should control their own data, wealth, and digital identity.

Core principles:
1. Privacy first — your data stays on your infrastructure
2. Local-first — run your own AI where possible
3. Model-agnostic — don't get locked into any single vendor
4. Financial autonomy — understand Bitcoin and crypto as tools for sovereignty

This website itself is a demonstration: Sathian's memory and context stay local, while a frontier AI model processes conversations statelessly.
    `)
  }

  // About Sathian
  if (messageLower.includes('who') || messageLower.includes('sathian') || messageLower.includes('about') || messageLower.includes('tell me')) {
    content.push(`
## About Sathian

Based in Toronto. Technologist, builder, digital anthropologist, historian. Entrepreneur for 20+ years — lots of failures and a few successes. The failures taught more than the successes ever could.

Non-traditional path into tech. Late bloomer. Self-taught. Father of twins — his children are a big part of his life and what drives the tools he builds.

His focus now is on personal AI infrastructure and technology advisory — helping individuals, families, and businesses navigate AI, cybersecurity, cryptocurrency, and technology strategy.

He's passionate about in-person connection — having conducted 100+ dinners with strangers aged 20-80 in Toronto. His philosophy: digital tools should help us connect in person, safely.
    `)
  }

  // Kai / Projects
  if (messageLower.includes('kai') || messageLower.includes('building') || messageLower.includes('project')) {
    content.push(`
## What Sathian is Building

**Kai** — Personal Digital Assistant
The system you're talking to right now. Kai is Sathian's second brain — a model-agnostic AI system that stores all intelligence locally. This public version helps visitors learn about his work.

**Tooth Fairy Network** — Childhood Milestones On-Chain
A concept that records lost teeth as digital artifacts. Currently a prototype with fictitious data. The globe on the site shows featured collectors from around the world.

**Cultural Atlas** — Mapping Culture Through Data
Exploring how culture, data, and technology intersect.

**Storybook Universe** — For His Children
Creative storytelling and learning tools. This content is private out of respect for his family.

**Writings** — Crypto Philosophy and Essays
Long-form explorations of technology, culture, and sovereignty.
    `)
  }

  // Human connections - dinners, meetups, one-on-ones
  if (messageLower.includes('dinner') || messageLower.includes('met') || messageLower.includes('connect') || messageLower.includes('meeting') || messageLower.includes('meetup')) {
    content.push(`
## Human Connections

Common contexts where you might have crossed paths with Sathian:
- Dinners with Strangers: 100+ so far, with people aged 20-80 across Toronto
- Meetups and events: Tech, Bitcoin, philosophy gatherings
- One-on-one conversations: Coffee, walks, or deeper discussions

Topics Sathian often explores in these conversations:
- Personal sovereignty and privacy in the digital age
- Bitcoin and the future of money
- AI as augmentation, not replacement
- Building in public and learning from failure

Feel free to share context about how you connected or what you discussed.
    `)
  }

  // Storybook / Kids content — gated, minimal info
  if (messageLower.includes('kids') || messageLower.includes('children') || messageLower.includes('story') || messageLower.includes('storybook')) {
    content.push(`
## Storybook Universe

Sathian creates personalized stories for his children. These stories explore meaningful themes through consistent characters in an imaginary world — teamwork, friendship, problem-solving, and even Bitcoin basics for kids.

This content is private out of respect for his family. If you'd like to learn more, reach out to Sathian directly.
    `)
  }

  // Books
  if (messageLower.includes('book') || messageLower.includes('recommend') || messageLower.includes('read')) {
    content.push(`
## Book Recommendations

Sathian maintains a personal library and happily lends physical copies. He believes in books as tools for expanding thinking independently.

Themes he often recommends around:
- Bitcoin and monetary history
- Philosophy and clear thinking
- Building businesses and learning from failure
- Privacy and digital rights

If you'd like a recommendation, share what you're interested in learning about.
    `)
  }

  // Writings / Articles
  if (messageLower.includes('write') || messageLower.includes('article') || messageLower.includes('cream') || messageLower.includes('yellow box') || messageLower.includes('nine pages') || messageLower.includes('bitcoin') || messageLower.includes('hip-hop') || messageLower.includes('hip hop') || messageLower.includes('wu-tang') || messageLower.includes('wu tang') || messageLower.includes('essay')) {
    content.push(`
## Sathian's Writings

Sathian writes about the intersections between culture, decentralized finance, and personal sovereignty. His articles connect disparate worlds through personal experience.

**Published Articles:**

1. **Nine Pages** — "I was around Bitcoin for years before I actually read the whitepaper. Nine pages changed everything."
   → /writings/nine-pages

2. **C.R.E.A.M. 2.0** — How Wu-Tang Clan's journey from Staten Island to a corporate arena in Toronto mirrors Bitcoin's path from a cypherpunk whitepaper to institutional adoption.
   → /writings/cream-2-point-0

3. **The Yellow Box** — An Uber driver from Afghanistan, a box of No Name spaghetti, and how the gap between what institutions say and what people experience follows the same pattern from glasnost to grocery stores.
   → /writings/the-yellow-box
    `)
  }

  // Tooth Fairy Network
  if (messageLower.includes('tooth') || messageLower.includes('fairy') || messageLower.includes('network') || messageLower.includes('nft') || messageLower.includes('mint') || messageLower.includes('blockchain') || messageLower.includes('involve') || messageLower.includes('how does') || messageLower.includes('what is')) {
    content.push(`
## The Tooth Fairy Network (keep responses very brief — 1-2 sentences)
A concept by Sathian that records lost teeth as digital artifacts on-chain. Currently a prototype with fictitious data. The globe shows featured collectors from around the world. Still early — Sathian welcomes anyone interested to reach out via the chat.
    `)
  }

  // Inspiration
  if (messageLower.includes('inspir') || messageLower.includes('influence') || messageLower.includes('mentor') || messageLower.includes('satoshi') || messageLower.includes('balaji') || messageLower.includes('miessler') || messageLower.includes('daniel')) {
    content.push(`
## Inspiration

Sathian draws inspiration from a growing list:
- **Satoshi Nakamoto** — Nine pages that changed money forever.
- **Balaji Srinivasan** — Network School: rethinking education and governance.
- **Daniel Miessler** — Unsupervised Learning: security, AI, and personal infrastructure.

These are current inspirations. The list grows over time.
    `)
  }

  // Collaboration
  if (messageLower.includes('agent') || messageLower.includes('collaborate') || messageLower.includes('partnership') || messageLower.includes('work together') || messageLower.includes('opportunity') || messageLower.includes('hire') || messageLower.includes('consult')) {
    content.push(`
## Collaboration

Sathian is a technologist in Toronto building personal AI infrastructure. He's interested in connecting with people and projects working on:
- Open source AI infrastructure
- Privacy-first technology
- Personal knowledge management
- Tools that enhance human capability
- Bitcoin and cryptocurrency education

Express your interest or opportunity, and Kai will pass it along to Sathian with context.
    `)
  }

  return content.join('\n\n')
}

export async function getMemoryContext(message: string): Promise<MemoryContext> {
  // Only return curated, pre-approved public content
  const topicContent = getTopicContent(message)

  return {
    content: topicContent,
    sources: ['curated-content'],
  }
}
