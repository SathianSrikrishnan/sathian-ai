import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

// Path to Kai's memory (local PAI structure)
const KAI_MEMORY_PATH = process.env.KAI_MEMORY_PATH || 'C:/Users/sathi/kai/MEMORY'
const KAI_CONTEXT_PATH = process.env.KAI_CONTEXT_PATH || 'C:/Users/sathi/kai/context'

interface MemoryContext {
  content: string
  sources: string[]
}

// Simple keyword extraction for context matching
function extractKeywords(message: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'what', 'who', 'how', 'why', 'when', 'where', 'about', 'tell', 'me', 'your', 'you', 'i', 'my'])
  return message
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
}

// Search for relevant files based on keywords
function searchMemoryFiles(keywords: string[], basePath: string): string[] {
  const matches: string[] = []

  function searchDir(dir: string) {
    if (!existsSync(dir)) return

    try {
      const items = readdirSync(dir, { withFileTypes: true })
      for (const item of items) {
        const fullPath = join(dir, item.name)
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          searchDir(fullPath)
        } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.txt'))) {
          const nameLower = item.name.toLowerCase()
          const dirLower = dir.toLowerCase()
          for (const keyword of keywords) {
            if (nameLower.includes(keyword) || dirLower.includes(keyword)) {
              matches.push(fullPath)
              break
            }
          }
        }
      }
    } catch (e) {
      // Ignore permission errors
    }
  }

  searchDir(basePath)
  return matches.slice(0, 5) // Limit to 5 most relevant files
}

// Read and combine content from matched files
function readMemoryFiles(paths: string[]): string {
  const contents: string[] = []

  for (const filePath of paths) {
    try {
      const content = readFileSync(filePath, 'utf-8')
      const fileName = filePath.split(/[/\\]/).pop() || filePath
      contents.push(`--- From: ${fileName} ---\n${content.slice(0, 2000)}`) // Limit each file
    } catch (e) {
      // Skip unreadable files
    }
  }

  return contents.join('\n\n')
}

// Topic-based content retrieval
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

43 years old, based in Toronto. A budding technologist.

Sathian has built both successful and unsuccessful businesses - the kind of experience that teaches you more about what decisions lead to outcomes than any course could. He reflects on these lessons in his writing.

His focus now is on Personal AI Infrastructure (PAI) - building tools that augment human capability while maintaining privacy and sovereignty. This site is powered by Kai, his personal AI system.

He's passionate about in-person connection - having conducted 100+ dinners with strangers aged 20-80 in Toronto. His philosophy: digital tools should help us connect in person, safely.
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
Creative storytelling and learning tools covering math, crypto, computers, and life philosophy. This content is gated out of respect for his children's privacy.

Sathian is also planning to contribute to the Fabric open source project - sharing prompts and workflows that demonstrate the PAI philosophy in action.
    `)
  }

  // Human connections - dinners, meetups, one-on-ones
  if (messageLower.includes('dinner') || messageLower.includes('met') || messageLower.includes('connect') || messageLower.includes('meeting') || messageLower.includes('meetup')) {
    content.push(`
## Human Connections

If you're here, you've likely formed a meaningful connection with Sathian somewhere along the way. This site isn't publicly shared - you have to know his name to find it.

Common contexts where you might have crossed paths:
- **Dinners with Strangers**: 100+ so far, with people aged 20-80 across Toronto
- **Meetups and events**: Tech, Bitcoin, philosophy gatherings
- **One-on-one conversations**: Coffee, walks, or deeper discussions
- **Group settings**: Where ideas flow and connections form

Topics Sathian often explores in these conversations:
- Personal sovereignty and privacy in the digital age
- Bitcoin and the future of money
- AI as augmentation, not replacement
- Building in public and learning from failure
- Parenting and passing values to the next generation

Feel free to share context about how you connected or what you discussed, and I can help continue that thread.
    `)
  }

  // Storybook Universe / Kids content
  if (messageLower.includes('kids') || messageLower.includes('children') || messageLower.includes('story') || messageLower.includes('pixel') || messageLower.includes('storybook')) {
    content.push(`
## Storybook Universe

Sathian creates personalized stories for his daughters Isa and Sia. These stories explore meaningful themes through consistent characters in an imaginary world.

**Themes explored:**
- Teamwork and friendship
- Crypto and Bitcoin basics (yes, for kids!)
- Business concepts and problem-solving
- Life events (losing teeth, doctor visits, trying new foods)

**Key characters:**
- **Pixel the Digital Dragon** - A problem-solver who speaks in rhyme, helps navigate challenges
- **Tux (Tuxedo)** - A penguin friend
- **Peanut** - Another penguin companion
- **Whisker the Cat** - Appears across both girls' story worlds

The stories demonstrate how Sathian approaches parenting: making complex ideas accessible, building consistent worlds, and using narrative to teach values.

This is a window into how digital tools can enhance rather than replace meaningful family time.
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

If you'd like a recommendation, just share what you're interested in learning about. Sathian can arrange to lend or recommend specific titles.
    `)
  }

  return content.join('\n\n')
}

export async function getMemoryContext(message: string): Promise<MemoryContext> {
  const keywords = extractKeywords(message)

  // Get topic-based content first (curated responses)
  const topicContent = getTopicContent(message)

  // Search local memory files for additional context
  const memoryMatches = searchMemoryFiles(keywords, KAI_MEMORY_PATH)
  const contextMatches = searchMemoryFiles(keywords, KAI_CONTEXT_PATH)
  const allMatches = [...memoryMatches, ...contextMatches]

  // Read matched files
  const fileContent = readMemoryFiles(allMatches)

  return {
    content: topicContent + (fileContent ? '\n\n## Additional Context from Memory\n' + fileContent : ''),
    sources: allMatches.map(p => p.split(/[/\\]/).pop() || p),
  }
}
