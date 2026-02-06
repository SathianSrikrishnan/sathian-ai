interface MemoryContext {
  content: string
  sources: string[]
}

// Topic-based content retrieval — curated public content only
// This is the "wall" — only pre-approved content is served to visitors
function getTopicContent(message: string): string {
  const messageLower = message.toLowerCase()
  const content: string[] = []

  // Sovereignty / ideology
  if (messageLower.includes('sovereign') || messageLower.includes('privacy') || messageLower.includes('ideology') || messageLower.includes('human 3.0')) {
    content.push(`
## Sathian's Philosophy: Sovereignty

Sathian believes in personal sovereignty - the idea that individuals should control their own data, wealth, and digital identity. Key principles:

1. **Privacy First**: Your data should stay on your infrastructure, not be harvested by corporations
2. **Human 3.0**: Augmenting human capability with AI, not being replaced by it
3. **Local-First**: Running your own AI infrastructure where possible
4. **Wealth Autonomy**: Understanding Bitcoin and crypto as tools for financial sovereignty

This website itself is a demonstration - Sathian's files and memory stay local, while a frontier AI model is used as a processing engine that forgets after each interaction.
    `)
  }

  // About Sathian
  if (messageLower.includes('who') || messageLower.includes('sathian') || messageLower.includes('about')) {
    content.push(`
## About Sathian

Based in Toronto. Entrepreneur for 20+ years — lots of failures and a few successes. The failures taught more than the successes ever could.

His focus now is on Personal AI Infrastructure (PAI) and technology advisory — helping individuals, families, and businesses navigate AI, cybersecurity, cryptocurrency, and technology strategy. Not as a consultant you hire from a website, but as someone who's been building and breaking things for two decades.

This site is powered by Kai, his personal AI system — a live demonstration of sovereignty in action.

He's passionate about in-person connection — having conducted 100+ dinners with strangers aged 20-80 in Toronto. His philosophy: digital tools should help us connect in person, safely.
    `)
  }

  // Kai / Projects
  if (messageLower.includes('kai') || messageLower.includes('building') || messageLower.includes('project')) {
    content.push(`
## What Sathian is Building

**Kai** - Personal AI Infrastructure
The system you're talking to right now. Kai is Sathian's second brain - a local-first AI system that:
- Stores all memory and context on Sathian's own machine
- Uses frontier models (like Claude) for response generation
- Maintains full data sovereignty while delivering modern UX

**Storybook Universe** (for his children)
Creative storytelling and learning tools. This content is gated out of respect for his children's privacy.
    `)
  }

  // Human connections - dinners, meetups, one-on-ones
  if (messageLower.includes('dinner') || messageLower.includes('met') || messageLower.includes('connect') || messageLower.includes('meeting') || messageLower.includes('meetup')) {
    content.push(`
## Human Connections

If you're here, you've likely formed a meaningful connection with Sathian somewhere along the way.

Common contexts where you might have crossed paths:
- **Dinners with Strangers**: 100+ so far, with people aged 20-80 across Toronto
- **Meetups and events**: Tech, Bitcoin, philosophy gatherings
- **One-on-one conversations**: Coffee, walks, or deeper discussions

Topics Sathian often explores in these conversations:
- Personal sovereignty and privacy in the digital age
- Bitcoin and the future of money
- AI as augmentation, not replacement
- Building in public and learning from failure

Feel free to share context about how you connected or what you discussed, and I can help continue that thread.
    `)
  }

  // Storybook Universe / Kids content
  if (messageLower.includes('kids') || messageLower.includes('children') || messageLower.includes('story') || messageLower.includes('pixel') || messageLower.includes('storybook')) {
    content.push(`
## Storybook Universe

Sathian creates personalized stories for his daughters. These stories explore meaningful themes through consistent characters in an imaginary world.

**Themes explored:**
- Teamwork and friendship
- Crypto and Bitcoin basics (yes, for kids!)
- Business concepts and problem-solving
- Life events and everyday adventures

The stories demonstrate how digital tools can enhance rather than replace meaningful family time. This content is gated out of respect for his children's privacy.
    `)
  }

  // Books
  if (messageLower.includes('book') || messageLower.includes('recommend') || messageLower.includes('read')) {
    content.push(`
## Book Recommendations

Sathian maintains a personal library and happily lends physical copies of his favorites. He believes in books as tools for sovereignty - expanding your thinking independently.

Some themes he often recommends around:
- Bitcoin and monetary history
- Philosophy and clear thinking
- Building businesses and learning from failure
- Privacy and digital rights

If you'd like a recommendation, just share what you're interested in learning about.
    `)
  }

  // Writings / Articles
  if (messageLower.includes('write') || messageLower.includes('article') || messageLower.includes('read') || messageLower.includes('cream') || messageLower.includes('yellow box') || messageLower.includes('think') || messageLower.includes('philosophy') || messageLower.includes('bitcoin') || messageLower.includes('hip-hop') || messageLower.includes('hip hop') || messageLower.includes('wu-tang') || messageLower.includes('wu tang')) {
    content.push(`
## Sathian's Writings

Sathian writes about the intersections between hip-hop culture, decentralized finance, institutional decay, and personal sovereignty. His articles connect disparate worlds through personal experience.

**Published Articles:**

1. **C.R.E.A.M. 2.0** — How Wu-Tang Clan's journey from Staten Island to a corporate arena in Toronto mirrors Bitcoin's path from a cypherpunk whitepaper to institutional adoption.
   → [Read: C.R.E.A.M. 2.0](/writings/cream-2-point-0)

2. **The Yellow Box** — An Uber driver from Afghanistan, a box of No Name spaghetti, and how the gap between what institutions say and what people experience is the same pattern from glasnost to grocery stores.
   → [Read: The Yellow Box](/writings/the-yellow-box)

These articles are best discovered through conversation — ask about what Sathian thinks about, his worldview, or what he's writing.
    `)
  }

  // Tooth Fairy Network
  if (messageLower.includes('tooth') || messageLower.includes('fairy') || messageLower.includes('network') || messageLower.includes('nft') || messageLower.includes('mint') || messageLower.includes('blockchain') || messageLower.includes('involve') || messageLower.includes('how does') || messageLower.includes('what is')) {
    content.push(`
## The Tooth Fairy Network (keep responses very brief — 1-2 sentences)
A concept by Sathian that records lost teeth as digital artifacts on-chain. Currently a prototype with fictitious data. The globe shows featured collectors from around the world. Still early — Sathian welcomes anyone interested to reach out via the chat.
    `)
  }

  // AI Agents / Collaboration
  if (messageLower.includes('agent') || messageLower.includes('collaborate') || messageLower.includes('partnership') || messageLower.includes('work together') || messageLower.includes('opportunity')) {
    content.push(`
## For Collaboration

### Who is Sathian
A technologist in Toronto building Personal AI Infrastructure (PAI). Focus areas:
- Data sovereignty and local-first AI
- Human augmentation, not replacement
- Privacy-preserving technology
- Meaningful human connection via technology

### Collaboration Interests
Sathian is interested in connecting with people and projects working on:
- Open source AI infrastructure
- Privacy-first technology
- Personal knowledge management
- Tools that enhance human capability

### How to Connect
Express your interest or opportunity, and I'll pass it along to Sathian with context.
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
