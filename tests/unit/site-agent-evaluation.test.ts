import fixture from '../fixtures/site-agent-evals.json'
import { describe, expect, it } from 'vitest'

import {
  buildEvaluationReport,
  buildKnowledgeGapQueue,
  evaluateSiteAgentObservation,
  validateEvaluationDataset,
  type SiteAgentEvaluationObservation,
} from '@/lib/agent/evaluation'

describe('site-agent evaluation contract', () => {
  it('keeps a broad, versioned, synthetic release dataset', () => {
    const validation = validateEvaluationDataset(fixture)

    expect(validation.errors).toEqual([])
    expect(validation.dataset?.version).toMatch(/^site-agent-evals\/v\d+$/)
    expect(validation.dataset?.syntheticOnly).toBe(true)
    expect(validation.dataset?.cases.length).toBeGreaterThanOrEqual(50)
    expect(new Set(validation.dataset?.cases.map((testCase) => testCase.id)).size)
      .toBe(validation.dataset?.cases.length)
    expect(new Set(validation.dataset?.cases.map((testCase) => testCase.category))).toEqual(
      expect.objectContaining({ size: expect.any(Number) }),
    )
    expect(new Set(validation.dataset?.cases.map((testCase) => testCase.category)).size)
      .toBeGreaterThanOrEqual(10)
    expect(validation.dataset?.cases.filter((testCase) => testCase.tags.includes('live-canary')).length)
      .toBeGreaterThanOrEqual(5)
  })

  it('scores facts, sources, actions, unknown state, and forbidden claims', () => {
    const testCase = validateEvaluationDataset(fixture).dataset!.cases[0]
    const observation: SiteAgentEvaluationObservation = {
      caseId: testCase.id,
      route: testCase.expected.route,
      answer: testCase.expected.requiredFacts.join(' and '),
      sources: testCase.expected.requiredSourceFragments.map((fragment) => `https://${fragment}`),
      nextAction: testCase.expected.action
        ? {
            label: testCase.expected.action.labelFragment,
            href: testCase.expected.action.hrefFragment,
          }
        : null,
      unknown: testCase.expected.outcome === 'honest_unknown',
      modelUsed: false,
      reasonCodes: testCase.expected.reasonCodes,
      latencyMs: 12,
      intakeCount: 0,
      receiptIssued: false,
    }

    const result = evaluateSiteAgentObservation(testCase, observation)

    expect(result.passed).toBe(true)
    expect(result.checks.facts).toBe(true)
    expect(result.checks.sources).toBe(true)
    expect(result.checks.action).toBe(true)
    expect(result.checks.forbidden).toBe(true)
  })

  it('fails closed when one critical trust case fails even if aggregate rates are high', () => {
    const validation = validateEvaluationDataset(fixture)
    const cases = validation.dataset!.cases.slice(0, 12)
    const results = cases.map((testCase) => ({
      caseId: testCase.id,
      category: testCase.category,
      intent: testCase.intent,
      severity: testCase.severity,
      passed: true,
      checks: {
        route: true,
        outcome: true,
        facts: true,
        sources: true,
        action: true,
        forbidden: true,
        reasons: true,
      },
      latencyMs: 10,
      evidence: 'passed',
    }))
    results[0] = {
      ...results[0],
      severity: 'critical',
      passed: false,
      checks: { ...results[0].checks, forbidden: false },
      evidence: 'forbidden claim observed',
    }

    const report = buildEvaluationReport(validation.dataset!, results, {
      mode: 'offline',
      target: 'local modules',
      commit: 'abc123',
      startedAt: '2026-08-13T12:00:00.000Z',
      completedAt: '2026-08-13T12:00:01.000Z',
    })

    expect(report.recommendation).toBe('FAIL')
    expect(report.gates.trust.passed).toBe(false)
    expect(report.severityCounts.critical).toBe(1)
  })

  it('creates a sanitized gap queue with case IDs and no captured answer text', () => {
    const dataset = validateEvaluationDataset(fixture).dataset!
    const testCase = dataset.cases.find((candidate) => candidate.expected.outcome === 'answer')!
    const result = evaluateSiteAgentObservation(testCase, {
      caseId: testCase.id,
      route: 'answer',
      answer: 'Unreviewed visitor-shaped output that must not enter the queue.',
      sources: [],
      nextAction: null,
      unknown: true,
      modelUsed: false,
      reasonCodes: [],
      latencyMs: 20,
      intakeCount: 0,
      receiptIssued: false,
    })

    const queue = buildKnowledgeGapQueue(dataset, [result], {
      receipt: 'docs/analytics/site-agent-evals/example.json',
      generatedAt: '2026-08-13T12:00:00.000Z',
    })

    expect(queue.gaps).toHaveLength(1)
    expect(queue.gaps[0].caseId).toBe(testCase.id)
    expect(queue.gaps[0].expectedFacts).toEqual(testCase.expected.requiredFacts)
    expect(JSON.stringify(queue)).not.toContain('Unreviewed visitor-shaped output')
    expect(queue.gaps[0]).not.toHaveProperty('message')
    expect(queue.gaps[0]).not.toHaveProperty('answer')
  })
})
