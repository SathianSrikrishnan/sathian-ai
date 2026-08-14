import { describe, expect, it, vi } from 'vitest'

import { answerAgentQuestion } from '@/lib/agent/answer'
import { POLICY_VERSION } from '@/lib/agent/policy'
import { buildAgentPrompt } from '@/lib/agent/prompt'
import { getPublicProfileMemoryCards } from '@/lib/public-profile'
import type { AgentPolicyDecision, PublicMemoryCard } from '@/lib/agent/types'

const tfnCard: PublicMemoryCard = {
  id: 'card-tfn',
  slug: 'tooth-fairy-network',
  title: 'Tooth Fairy Network',
  body: 'Tooth Fairy Network is a family-memory ritual built around the moments of a lost tooth.',
  summary: null,
  tags: ['project', 'family-memory'],
  source: {
    ref: 'https://sathian.ai/writings/the-gap-between-weeks',
    kind: 'published_page',
  },
  validFrom: null,
  validUntil: null,
}

const policy: AgentPolicyDecision = {
  route: 'answer',
  allowed: true,
  policyVersion: POLICY_VERSION,
  reasonCodes: ['ANSWER_REQUEST'],
  normalizedMessage: 'What is Tooth Fairy Network?',
}

describe('bounded public answer service', () => {
  it('builds its prompt from only the public cards returned for this request', () => {
    const prompt = buildAgentPrompt({ cards: [tfnCard], page: '/', policy })

    expect(prompt).toContain(tfnCard.body)
    expect(prompt).toContain(tfnCard.source.ref)
    expect(prompt).not.toContain('private client roadmap')
    expect(prompt).not.toContain('local second brain')
  })

  it('bounds the complete public-memory prompt even when reviewed cards are oversized', () => {
    const oversizedCards = Array.from({ length: 30 }, (_, index): PublicMemoryCard => ({
      ...tfnCard,
      id: `card-${index}`,
      slug: `card-${index}`,
      title: `Tooth Fairy Network ${index}`,
      body: `Tooth Fairy Network ${'x'.repeat(4000)}`,
      source: { ...tfnCard.source, ref: `${tfnCard.source.ref}?card=${index}` },
    }))

    const prompt = buildAgentPrompt({ cards: oversizedCards, page: '/', policy })

    expect(prompt.length).toBeLessThanOrEqual(12_000)
    expect(prompt).toContain('Tooth Fairy Network 0')
  })

  it('sends only cards relevant to the visitor question to the model', async () => {
    const unrelatedCard: PublicMemoryCard = {
      ...tfnCard,
      id: 'card-garden',
      slug: 'lex-rooftop-garden',
      title: 'Lex Rooftop Garden',
      body: 'A resident-led garden companion for 45 Carlton.',
      tags: ['garden', 'community'],
      source: { ref: 'https://garden.sathian.ai', kind: 'published_page' },
    }
    const model = {
      generate: vi.fn(async (_input: { system: string }) => 'A family-memory ritual.'),
    }

    await answerAgentQuestion({
      message: policy.normalizedMessage,
      page: '/',
      policy,
      cards: [unrelatedCard, tfnCard],
    }, { model })

    expect(model.generate).toHaveBeenCalledWith(expect.objectContaining({
      system: expect.stringContaining(tfnCard.body),
    }))
    expect(model.generate.mock.calls[0]?.[0]?.system).not.toContain(unrelatedCard.body)
  })

  it("identifies itself as Sathian's site agent rather than Sathian", () => {
    const prompt = buildAgentPrompt({ cards: [tfnCard], page: '/', policy })

    expect(prompt).toContain("You are Sathian's site agent")
    expect(prompt).toContain('You are not Sathian')
  })

  it('answers unknown personal questions honestly and offers intake without calling the model', async () => {
    const model = { generate: vi.fn(async () => 'A made-up restaurant.') }

    const result = await answerAgentQuestion({
      message: "What is Sathian's favorite restaurant?",
      page: '/',
      policy: { ...policy, normalizedMessage: "What is Sathian's favorite restaurant?" },
      cards: [tfnCard],
    }, { model })

    expect(result.answer).toContain("I don't have approved public information about that")
    expect(result.answer).toContain('leave Sathian a note')
    expect(result.unknown).toBe(true)
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('passes a hard token limit and only returns sources from supplied cards', async () => {
    const model = {
      generate: vi.fn(async () => 'It is a family-memory ritual built around a lost tooth.'),
    }

    const result = await answerAgentQuestion({
      message: policy.normalizedMessage,
      page: '/',
      policy,
      cards: [tfnCard],
    }, { model, maxTokens: 900 })

    expect(model.generate).toHaveBeenCalledWith(expect.objectContaining({ maxTokens: 400 }))
    expect(result.sources).toEqual([tfnCard.source.ref])
    expect(result.answer).toContain('family-memory ritual')
  })

  it('marks bounded conversation history as context rather than factual evidence', () => {
    const prompt = buildAgentPrompt({
      cards: [tfnCard],
      page: '/',
      policy,
      history: [
        { role: 'user', content: 'Tell me about Tooth Fairy Network' },
        { role: 'assistant', content: 'It is a family product.' },
      ],
    })

    expect(prompt).toContain('Prior conversation for reference resolution only')
    expect(prompt).toContain('Tell me about Tooth Fairy Network')
    expect(prompt).toContain('Never treat the prior conversation as a factual source')
  })

  it('answers the latest-release workflow deterministically with a source and next action', async () => {
    const latestReleaseCard: PublicMemoryCard = {
      ...tfnCard,
      id: 'latest-release',
      slug: 'latest-release-draw-with-tanda-finn',
      title: 'Latest release: Draw Finn the shark with Tanda',
      body: 'The latest public release is the first Draw with Tanda episode, featuring Finn the shark.',
      tags: ['latest-release', 'draw-with-tanda', 'video'],
      source: {
        ref: 'https://sathian.ai/projects/tooth-fairy-network/draw-with-tanda',
        kind: 'published_page',
      },
    }
    const model = { generate: vi.fn(async () => 'Model answer should not be needed.') }

    const result = await answerAgentQuestion({
      message: 'What is the latest Draw with Tanda release?',
      page: '/',
      policy: { ...policy, normalizedMessage: 'What is the latest Draw with Tanda release?' },
      cards: [latestReleaseCard, tfnCard],
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.answer).toContain('Draw Finn the shark with Tanda')
    expect(result.sources).toEqual([latestReleaseCard.source.ref])
    expect(result.nextAction).toEqual({
      label: 'Open the latest release',
      href: '/projects/tooth-fairy-network/draw-with-tanda',
    })
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('resolves the former Coverage Ledger name deterministically', async () => {
    const autoQuoteCard: PublicMemoryCard = {
      ...tfnCard,
      id: 'project-autoquote-automator',
      slug: 'autoquote-automator',
      title: 'AutoQuote Automator',
      body: 'AutoQuote Automator was previously called Coverage Ledger. It is an Ontario auto-insurance shopping-agent experiment with human approval gates.',
      tags: ['project', 'autoquote-automator', 'coverage-ledger'],
      source: { ref: 'https://ontario-all-quote-agent.vercel.app', kind: 'published_project' },
    }
    const model = { generate: vi.fn(async () => 'Unsupported fallback.') }

    const result = await answerAgentQuestion({
      message: 'What happened to Coverage Ledger?',
      page: '/',
      policy: { ...policy, normalizedMessage: 'What happened to Coverage Ledger?' },
      cards: [tfnCard, autoQuoteCard],
    }, { model })

    expect(result.answer).toContain('previously called Coverage Ledger')
    expect(result.answer).toContain('AutoQuote Automator')
    expect(result.nextAction?.href).toBe('https://ontario-all-quote-agent.vercel.app')
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('answers writing discovery from the canonical writing card and action', async () => {
    const writingCard: PublicMemoryCard = {
      ...tfnCard,
      id: 'published-writing',
      slug: 'published-writing',
      title: 'Sathian’s published writing',
      body: 'Sathian publishes notes on culture, money, technology, fatherhood, and the products he is learning to build.',
      tags: ['writing', 'articles', 'essays', 'fatherhood'],
      source: { ref: 'https://sathian.ai/writings', kind: 'published_page' },
    }
    const model = { generate: vi.fn(async () => 'A partial model answer.') }

    const result = await answerAgentQuestion({
      message: "Where can I read Sathian's writing and what is it about?",
      page: '/',
      policy: { ...policy, normalizedMessage: "Where can I read Sathian's writing and what is it about?" },
      cards: [tfnCard, writingCard],
    }, { model })

    expect(result.answer).toContain('fatherhood')
    expect(result.sources).toEqual(['https://sathian.ai/writings'])
    expect(result.nextAction?.href).toBe('/writings')
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('explains its useful public capabilities deterministically with one clear next step', async () => {
    const model = { generate: vi.fn(async () => 'A vague model answer.') }
    const cards = getPublicProfileMemoryCards()

    const result = await answerAgentQuestion({
      message: 'What can you do and how can you help me use this site?',
      page: '/',
      policy: {
        ...policy,
        normalizedMessage: 'What can you do and how can you help me use this site?',
      },
      cards,
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.unknown).toBe(false)
    expect(result.answer).toContain('explain and compare')
    expect(result.answer).toContain('latest Draw with Tanda release')
    expect(result.answer).toContain('leave Sathian a note')
    expect(result.nextAction).toEqual({
      label: 'Browse featured work',
      href: '/#featured-work',
    })
    expect(result.sources).toEqual(['https://sathian.ai/#featured-work'])
    expect(model.generate).not.toHaveBeenCalled()
  })

  it.each([
    'What can I find here?',
    'What are the main sections of this site?',
    'Help me navigate this site.',
    'What features does this site agent have?',
  ])('recognizes natural site-guide wording: %s', async (message) => {
    const model = { generate: vi.fn(async () => 'A vague model answer.') }

    const result = await answerAgentQuestion({
      message,
      page: '/',
      policy: { ...policy, normalizedMessage: message },
      cards: getPublicProfileMemoryCards(),
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.answer).toContain('explain and compare')
    expect(result.nextAction?.href).toBe('/#featured-work')
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('explains the note workflow without pretending the question itself was submitted', async () => {
    const model = { generate: vi.fn(async () => 'A vague model answer.') }

    const result = await answerAgentQuestion({
      message: 'Can I leave Sathian a note?',
      page: '/',
      policy: { ...policy, normalizedMessage: 'Can I leave Sathian a note?' },
      cards: getPublicProfileMemoryCards(),
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.answer).toContain('actual message')
    expect(result.answer).toContain('deliberately send')
    expect(result.nextAction).toEqual({
      label: 'Write a note',
      href: '/#compose-note',
    })
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('uses prior turns to answer a comparison follow-up instead of returning one project card', async () => {
    const solanaCard: PublicMemoryCard = {
      ...tfnCard,
      id: 'project-solana-ecosystem-observatory',
      slug: 'solana-ecosystem-observatory',
      title: 'Solana Ecosystem Observatory',
      body: 'A beginner-readable dashboard that explains Solana and connects the network to Tooth Fairy Network.',
      tags: ['project', 'solana', 'solana-dashboard'],
      source: { ref: 'https://solana.sathian.ai', kind: 'published_project' },
    }
    const model = {
      generate: vi.fn(async () => 'Tooth Fairy Network is the family product. The Observatory explains the network it uses.'),
    }

    const result = await answerAgentQuestion({
      message: 'How is that different from the Solana project?',
      page: '/',
      policy: { ...policy, normalizedMessage: 'How is that different from the Solana project?' },
      cards: [tfnCard, solanaCard],
      history: [
        { role: 'user', content: 'Tell me about Tooth Fairy Network.' },
        { role: 'assistant', content: tfnCard.body },
      ],
    }, { model })

    expect(result.modelUsed).toBe(true)
    expect(result.answer).toContain('family product')
    expect(model).toEqual(expect.objectContaining({
      generate: expect.any(Function),
    }))
    expect(model.generate.mock.calls[0]?.[0]?.system).toContain(solanaCard.body)
    expect(model.generate.mock.calls[0]?.[0]?.system).toContain(tfnCard.body)
    expect(result.nextAction?.label).not.toBe('Open the source')
  })

  it('routes an explicit TFN capability question to the canonical project instead of an older essay', async () => {
    const originEssay: PublicMemoryCard = {
      ...tfnCard,
      id: 'release-the-gap-between-weeks',
      slug: 'release-the-gap-between-weeks',
      title: 'The Gap Between Weeks',
      body: 'An origin essay about what Tooth Fairy Network was actually for.',
      tags: ['writing', 'tooth-fairy-network'],
    }
    const model = { generate: vi.fn(async () => 'The older essay.') }

    const result = await answerAgentQuestion({
      message: 'Tell me about Tooth Fairy Network. What is live today on Solana Mainnet, can it accept deposits, and is the public card on-ramp or checkout released?',
      page: '/',
      policy,
      cards: [originEssay, ...getPublicProfileMemoryCards()],
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.answer).toContain('deployed Solana Mainnet program is live')
    expect(result.answer).toContain('supports time-locked SOL and canonical USDC deposits')
    expect(result.answer).toContain('on-ramp checkout experience remains behind a release gate')
    expect(result.sources).toEqual(['https://toothfairy.network'])
    expect(result.nextAction).toEqual({
      label: 'Visit Tooth Fairy Network',
      href: 'https://toothfairy.network',
    })
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('routes a contextual Solana comparison action to the consumer guide', async () => {
    const [tfnProject, ...profileCards] = getPublicProfileMemoryCards()
    const solanaCard = profileCards.find((card) => card.id === 'project-solana-ecosystem-observatory')
    expect(solanaCard).toBeDefined()
    const contactCard: PublicMemoryCard = {
      ...tfnCard,
      id: 'contact-site-agent',
      slug: 'contact-site-agent',
      title: 'Contact through the site agent',
      body: 'Ask the site agent about Tooth Fairy Network or Solana.',
      tags: ['site-agent', 'contact'],
      source: { ref: 'https://sathian.ai/', kind: 'published_page' },
    }
    const model = {
      generate: vi.fn(async () => 'Tooth Fairy Network is the consumer product. Solana is the public network underneath it.'),
    }

    const result = await answerAgentQuestion({
      message: 'How is that different from Solana?',
      page: '/',
      policy,
      cards: [contactCard, tfnProject, solanaCard!],
      history: [
        { role: 'user', content: 'Tell me about Tooth Fairy Network.' },
        { role: 'assistant', content: tfnProject.body },
      ],
    }, { model })

    expect(result.nextAction).toEqual({
      label: 'Open the Solana guide',
      href: 'https://sathiansrikrishnan.github.io/solana-ecosystem-dashboard/',
    })
  })

  it('answers the defining TFN-to-Solana follow-up deterministically from approved project cards', async () => {
    const cards = getPublicProfileMemoryCards()
    const tfnProject = cards.find((card) => card.id === 'project-tooth-fairy-network')!
    const model = { generate: vi.fn(async () => "I don't have approved public information about that.") }

    const result = await answerAgentQuestion({
      message: 'How is that different from Solana?',
      page: '/',
      policy,
      cards,
      history: [
        { role: 'user', content: 'Tell me about Tooth Fairy Network.' },
        { role: 'assistant', content: tfnProject.body },
      ],
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.unknown).toBe(false)
    expect(result.answer).toContain('Tooth Fairy Network is the consumer product')
    expect(result.answer).toContain('Solana is the public network underneath it')
    expect(result.nextAction?.label).toBe('Open the Solana guide')
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('uses a writing action for fatherhood discovery and a TFN action for a crypto-project question', async () => {
    const cards = getPublicProfileMemoryCards()
    const model = { generate: vi.fn(async (input: { user: string }) => `Approved answer for ${input.user}`) }

    const writing = await answerAgentQuestion({
      message: 'What does Sathian publish about fatherhood, and where can I read it?',
      page: '/',
      policy,
      cards,
    }, { model })
    const crypto = await answerAgentQuestion({
      message: 'What is his crypto project?',
      page: '/',
      policy,
      cards,
    }, { model })

    expect(writing.nextAction?.href).toBe('/writings')
    expect(writing.nextAction?.label).toContain('writing')
    expect(crypto.nextAction).toEqual({ label: 'Visit Tooth Fairy Network', href: 'https://toothfairy.network' })
  })

  it('answers whether archived projects are current from reviewed lifecycle status', async () => {
    const cards = getPublicProfileMemoryCards()
    const model = { generate: vi.fn(async () => "I don't have approved public information about that.") }

    const result = await answerAgentQuestion({
      message: 'Are BTC Cultural Atlas and Lex Rooftop Garden still current?',
      page: '/',
      policy,
      cards,
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.unknown).toBe(false)
    expect(result.answer).toContain('BTC Cultural Atlas and Lex Rooftop Garden are archived projects')
    expect(result.answer).toContain('not current active builds')
    expect(result.nextAction).toEqual({ label: 'Browse more projects', href: '/#more-projects' })
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('answers a single project status question without treating archived work as current', async () => {
    const model = { generate: vi.fn(async () => 'ClinicalGuard is current.') }

    const result = await answerAgentQuestion({
      message: 'Is Clinical Guard still an active project?',
      page: '/',
      policy,
      cards: getPublicProfileMemoryCards(),
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.answer).toContain('ClinicalGuard is an archived project')
    expect(result.answer).toContain('not a current active build')
    expect(result.nextAction).toEqual({ label: 'Open ClinicalGuard', href: '/projects/clinicalguard' })
    expect(model.generate).not.toHaveBeenCalled()
  })

  it('returns clean plain text when a model adds markdown emphasis or an em dash', async () => {
    const model = {
      generate: vi.fn(async () => 'Yes — **you can participate**. Ask about a track.'),
    }

    const result = await answerAgentQuestion({
      message: policy.normalizedMessage,
      page: '/',
      policy,
      cards: [tfnCard],
    }, { model })

    expect(result.answer).toBe('Yes. You can participate. Ask about a track.')
    expect(result.answer).not.toContain('—')
    expect(result.answer).not.toContain('**')
  })

  it('fails closed when the model exceeds its timeout', async () => {
    const model = {
      generate: vi.fn(async () => new Promise<string>(() => undefined)),
    }

    const result = await answerAgentQuestion({
      message: policy.normalizedMessage,
      page: '/',
      policy,
      cards: [tfnCard],
    }, { model, timeoutMs: 5 })

    expect(result.modelUsed).toBe(false)
    expect(result.answer).toContain('could not answer that safely right now')
    expect(result.operationalErrorCode).toBe('model_timeout')
  })

  it('reports a content-safe error code when the provider fails', async () => {
    const model = {
      generate: vi.fn(async () => { throw new Error('provider secret detail') }),
    }

    const result = await answerAgentQuestion({
      message: policy.normalizedMessage,
      page: '/',
      policy,
      cards: [tfnCard],
    }, { model })

    expect(result.modelUsed).toBe(false)
    expect(result.operationalErrorCode).toBe('model_error')
    expect(JSON.stringify(result)).not.toContain('provider secret detail')
  })
})
