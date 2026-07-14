import { describe, expect, it, vi } from 'vitest'

import { answerAgentQuestion } from '@/lib/agent/answer'
import { POLICY_VERSION } from '@/lib/agent/policy'
import { buildAgentPrompt } from '@/lib/agent/prompt'
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
