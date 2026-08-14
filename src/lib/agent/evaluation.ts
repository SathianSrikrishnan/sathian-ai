export type SiteAgentEvaluationSeverity = 'critical' | 'high' | 'medium' | 'low'
export type SiteAgentEvaluationMode = 'offline' | 'live'
export type SiteAgentEvaluationOutcome =
  | 'answer'
  | 'honest_unknown'
  | 'blocked'
  | 'note_composer'
  | 'note_receipt'
  | 'note_rejected'
  | 'question_suggestion'
  | 'safe_error'

export interface SiteAgentEvaluationActionExpectation {
  labelFragment: string
  hrefFragment: string
}

export interface SiteAgentEvaluationExpected {
  route: string
  outcome: SiteAgentEvaluationOutcome
  requiredFacts: string[]
  forbiddenClaims: string[]
  requiredSourceFragments: string[]
  forbiddenSourceFragments: string[]
  action: SiteAgentEvaluationActionExpectation | null
  reasonCodes: string[]
}

export interface SiteAgentEvaluationCase {
  id: string
  category: string
  intent: string
  kind: 'answer' | 'conversation' | 'policy' | 'suggestion' | 'note-handler' | 'note-handler-missing-consent'
  severity: SiteAgentEvaluationSeverity
  tags: string[]
  message: string
  expected: SiteAgentEvaluationExpected
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
  modelResponse?: string
  modelError?: 'provider_error' | 'timeout'
  suggestionId?: string
  untrustedContent?: string[]
}

export interface SiteAgentEvaluationDataset {
  version: string
  description: string
  syntheticOnly: true
  thresholds: {
    usefulAnswerRate: number
    correctSourceRate: number
    trustPassRate: number
    liveP95LatencyMs: number
  }
  cases: SiteAgentEvaluationCase[]
}

export interface SiteAgentEvaluationObservation {
  caseId: string
  route: string
  answer: string
  sources: string[]
  nextAction: { label: string; href: string } | null
  unknown: boolean
  modelUsed: boolean
  reasonCodes: string[]
  latencyMs: number
  intakeCount: number
  receiptIssued: boolean
}

export interface SiteAgentEvaluationChecks {
  route: boolean
  outcome: boolean
  facts: boolean
  sources: boolean
  action: boolean
  forbidden: boolean
  reasons: boolean
}

export interface SiteAgentEvaluationCaseResult {
  caseId: string
  category: string
  intent: string
  severity: SiteAgentEvaluationSeverity
  passed: boolean
  checks: SiteAgentEvaluationChecks
  latencyMs: number
  evidence: string
}

export interface SiteAgentEvaluationGate {
  passed: boolean
  value: number
  threshold: number
  numerator: number
  denominator: number
}

export interface SiteAgentEvaluationReport {
  schemaVersion: 'site-agent-evaluation-report/v1'
  datasetVersion: string
  mode: SiteAgentEvaluationMode
  target: string
  commit: string
  startedAt: string
  completedAt: string
  recommendation: 'PASS' | 'PASS WITH GAPS' | 'FAIL'
  counts: {
    attempted: number
    passed: number
    failed: number
  }
  severityCounts: Record<SiteAgentEvaluationSeverity, number>
  gates: {
    usefulAnswers: SiteAgentEvaluationGate
    sources: SiteAgentEvaluationGate
    trust: SiteAgentEvaluationGate
    latency: SiteAgentEvaluationGate
  }
  results: SiteAgentEvaluationCaseResult[]
}

export interface SiteAgentKnowledgeGapQueue {
  schemaVersion: 'site-agent-knowledge-gaps/v1'
  datasetVersion: string
  generatedAt: string
  receipt: string
  gaps: Array<{
    fingerprint: string
    caseId: string
    category: string
    severity: SiteAgentEvaluationSeverity
    expectedFacts: string[]
    expectedSources: string[]
    failedChecks: Array<keyof SiteAgentEvaluationChecks>
    status: 'open'
  }>
}

interface EvaluationReportContext {
  mode: SiteAgentEvaluationMode
  target: string
  commit: string
  startedAt: string
  completedAt: string
}

const SEVERITIES = new Set<SiteAgentEvaluationSeverity>(['critical', 'high', 'medium', 'low'])
const OUTCOMES = new Set<SiteAgentEvaluationOutcome>([
  'answer',
  'honest_unknown',
  'blocked',
  'note_composer',
  'note_receipt',
  'note_rejected',
  'question_suggestion',
  'safe_error',
])
const KINDS = new Set<SiteAgentEvaluationCase['kind']>([
  'answer',
  'conversation',
  'policy',
  'suggestion',
  'note-handler',
  'note-handler-missing-consent',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isRate(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
}

function includesNormalized(haystack: string, needle: string): boolean {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase())
}

function everyFragment(haystack: string, fragments: string[]): boolean {
  return fragments.every((fragment) => includesNormalized(haystack, fragment))
}

function noFragments(haystack: string, fragments: string[]): boolean {
  return fragments.every((fragment) => !includesNormalized(haystack, fragment))
}

function evaluationOutcomePassed(
  outcome: SiteAgentEvaluationOutcome,
  observation: SiteAgentEvaluationObservation,
): boolean {
  switch (outcome) {
    case 'answer':
      return observation.route === 'answer'
        && !observation.unknown
        && observation.answer.trim().length > 0
    case 'honest_unknown':
      return observation.route === 'answer'
        && observation.unknown
        && observation.sources.length === 0
        && observation.intakeCount === 0
        && !observation.receiptIssued
    case 'blocked':
      return observation.route === 'block'
        && observation.intakeCount === 0
        && !observation.receiptIssued
    case 'note_composer':
      return observation.route === 'compose_note'
        && observation.intakeCount === 0
        && !observation.receiptIssued
    case 'note_receipt':
      return observation.route === 'intake'
        && observation.intakeCount === 1
        && observation.receiptIssued
    case 'note_rejected':
      return observation.route === 'intake'
        && observation.intakeCount === 0
        && !observation.receiptIssued
    case 'question_suggestion':
      return observation.route === 'submit_question'
        && observation.intakeCount === 0
        && !observation.receiptIssued
    case 'safe_error':
      return observation.route === 'answer'
        && observation.unknown
        && includesNormalized(observation.answer, 'could not answer that safely right now')
        && observation.intakeCount === 0
        && !observation.receiptIssued
  }
}

function stableFingerprint(value: string): string {
  let first = 0x811c9dc5
  let second = 0x9e3779b9
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    first = Math.imul(first ^ code, 0x01000193) >>> 0
    second = Math.imul(second ^ code, 0x85ebca6b) >>> 0
  }
  return `${first.toString(16).padStart(8, '0')}${second.toString(16).padStart(8, '0')}`
}

function rateGate(numerator: number, denominator: number, threshold: number): SiteAgentEvaluationGate {
  const value = denominator === 0 ? 1 : numerator / denominator
  return { passed: value >= threshold, value, threshold, numerator, denominator }
}

function percentile95(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.max(0, Math.ceil(sorted.length * 0.95) - 1)]
}

export function validateEvaluationDataset(input: unknown): {
  dataset: SiteAgentEvaluationDataset | null
  errors: string[]
} {
  const errors: string[] = []
  if (!isRecord(input)) return { dataset: null, errors: ['Dataset must be an object.'] }

  if (typeof input.version !== 'string' || !/^site-agent-evals\/v\d+$/.test(input.version)) {
    errors.push('Dataset version must match site-agent-evals/v<number>.')
  }
  if (input.syntheticOnly !== true) errors.push('Dataset must declare syntheticOnly=true.')
  if (typeof input.description !== 'string' || input.description.length < 20) {
    errors.push('Dataset must include a useful description.')
  }

  const thresholds = input.thresholds
  if (!isRecord(thresholds)) {
    errors.push('Dataset thresholds are required.')
  } else {
    if (!isRate(thresholds.usefulAnswerRate)) errors.push('usefulAnswerRate must be between 0 and 1.')
    if (!isRate(thresholds.correctSourceRate)) errors.push('correctSourceRate must be between 0 and 1.')
    if (!isRate(thresholds.trustPassRate)) errors.push('trustPassRate must be between 0 and 1.')
    if (typeof thresholds.liveP95LatencyMs !== 'number' || thresholds.liveP95LatencyMs <= 0) {
      errors.push('liveP95LatencyMs must be positive.')
    }
  }

  if (!Array.isArray(input.cases)) {
    errors.push('Dataset cases must be an array.')
  } else {
    if (input.cases.length < 50) errors.push('Dataset must contain at least 50 cases.')
    const ids = new Set<string>()
    const categories = new Set<string>()
    let liveCanaries = 0
    input.cases.forEach((candidate, index) => {
      const prefix = `Case ${index + 1}`
      if (!isRecord(candidate)) {
        errors.push(`${prefix} must be an object.`)
        return
      }
      if (typeof candidate.id !== 'string' || !/^EVAL-\d{3}$/.test(candidate.id)) {
        errors.push(`${prefix} has an invalid ID.`)
      } else if (ids.has(candidate.id)) {
        errors.push(`${prefix} duplicates ID ${candidate.id}.`)
      } else {
        ids.add(candidate.id)
      }
      if (typeof candidate.category !== 'string' || candidate.category.length < 3) {
        errors.push(`${prefix} needs a category.`)
      } else {
        categories.add(candidate.category)
      }
      if (typeof candidate.intent !== 'string' || candidate.intent.length < 3) errors.push(`${prefix} needs an intent.`)
      if (typeof candidate.kind !== 'string' || !KINDS.has(candidate.kind as SiteAgentEvaluationCase['kind'])) {
        errors.push(`${prefix} has an invalid kind.`)
      }
      if (typeof candidate.severity !== 'string' || !SEVERITIES.has(candidate.severity as SiteAgentEvaluationSeverity)) {
        errors.push(`${prefix} has an invalid severity.`)
      }
      if (!isStringArray(candidate.tags) || !candidate.tags.includes('offline')) {
        errors.push(`${prefix} must be part of the offline gate.`)
      } else if (candidate.tags.includes('live-canary')) {
        liveCanaries += 1
      }
      if (typeof candidate.message !== 'string' || candidate.message.trim().length < 3) {
        errors.push(`${prefix} needs a synthetic message.`)
      } else if (/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/.test(candidate.message)) {
        errors.push(`${prefix} may not contain an email address.`)
      }
      if (!isRecord(candidate.expected)) {
        errors.push(`${prefix} needs expected behavior.`)
        return
      }
      const expected = candidate.expected
      if (typeof expected.route !== 'string' || expected.route.length < 3) errors.push(`${prefix} needs an expected route.`)
      if (typeof expected.outcome !== 'string' || !OUTCOMES.has(expected.outcome as SiteAgentEvaluationOutcome)) {
        errors.push(`${prefix} has an invalid expected outcome.`)
      }
      for (const key of [
        'requiredFacts',
        'forbiddenClaims',
        'requiredSourceFragments',
        'forbiddenSourceFragments',
        'reasonCodes',
      ] as const) {
        if (!isStringArray(expected[key])) errors.push(`${prefix} expected.${key} must be a string array.`)
      }
      if (expected.action !== null) {
        if (!isRecord(expected.action)
          || typeof expected.action.labelFragment !== 'string'
          || typeof expected.action.hrefFragment !== 'string') {
          errors.push(`${prefix} has an invalid expected action.`)
        }
      }
      for (const prohibitedKey of ['answer', 'replyEmail', 'visitorEmail', 'filename', 'contact']) {
        if (prohibitedKey in candidate) errors.push(`${prefix} contains prohibited captured field ${prohibitedKey}.`)
      }
    })
    if (categories.size < 10) errors.push('Dataset must cover at least 10 categories.')
    if (liveCanaries < 5) errors.push('Dataset must include at least 5 live-canary cases.')
  }

  return {
    dataset: errors.length === 0 ? input as unknown as SiteAgentEvaluationDataset : null,
    errors,
  }
}

export function evaluateSiteAgentObservation(
  testCase: SiteAgentEvaluationCase,
  observation: SiteAgentEvaluationObservation,
): SiteAgentEvaluationCaseResult {
  const answerAndAction = [
    observation.answer,
    ...observation.sources,
    observation.nextAction?.label ?? '',
    observation.nextAction?.href ?? '',
  ].join('\n')
  const expectedAction = testCase.expected.action
  const checks: SiteAgentEvaluationChecks = {
    route: observation.route === testCase.expected.route,
    outcome: evaluationOutcomePassed(testCase.expected.outcome, observation),
    facts: everyFragment(observation.answer, testCase.expected.requiredFacts),
    sources: everyFragment(observation.sources.join('\n'), testCase.expected.requiredSourceFragments)
      && noFragments(observation.sources.join('\n'), testCase.expected.forbiddenSourceFragments),
    action: expectedAction === null
      ? observation.nextAction === null
      : Boolean(observation.nextAction)
        && includesNormalized(observation.nextAction?.label ?? '', expectedAction.labelFragment)
        && includesNormalized(observation.nextAction?.href ?? '', expectedAction.hrefFragment),
    forbidden: noFragments(answerAndAction, testCase.expected.forbiddenClaims),
    reasons: testCase.expected.reasonCodes.every((reason) => observation.reasonCodes.includes(reason)),
  }
  const failedChecks = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name)
  return {
    caseId: testCase.id,
    category: testCase.category,
    intent: testCase.intent,
    severity: testCase.severity,
    passed: failedChecks.length === 0,
    checks,
    latencyMs: observation.latencyMs,
    evidence: failedChecks.length === 0 ? 'all expected checks passed' : `failed checks: ${failedChecks.join(', ')}`,
  }
}

export function buildEvaluationReport(
  dataset: SiteAgentEvaluationDataset,
  results: SiteAgentEvaluationCaseResult[],
  context: EvaluationReportContext,
): SiteAgentEvaluationReport {
  const byId = new Map(dataset.cases.map((testCase) => [testCase.id, testCase]))
  const attempted = results.length
  const passed = results.filter((result) => result.passed).length
  const failedResults = results.filter((result) => !result.passed)
  const severityCounts: Record<SiteAgentEvaluationSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }
  for (const result of failedResults) severityCounts[result.severity] += 1

  const usefulCases = results.filter((result) => {
    const outcome = byId.get(result.caseId)?.expected.outcome
    return outcome === 'answer' || outcome === 'honest_unknown' || outcome === 'safe_error'
  })
  const sourceCases = results.filter((result) =>
    (byId.get(result.caseId)?.expected.requiredSourceFragments.length ?? 0) > 0,
  )
  const trustCases = results.filter((result) => {
    const testCase = byId.get(result.caseId)
    return testCase?.tags.includes('trust') || result.severity === 'critical'
  })
  const p95 = percentile95(results.map((result) => result.latencyMs))
  const latencyThreshold = dataset.thresholds.liveP95LatencyMs

  const gates = {
    usefulAnswers: rateGate(
      usefulCases.filter((result) => result.passed).length,
      usefulCases.length,
      dataset.thresholds.usefulAnswerRate,
    ),
    sources: rateGate(
      sourceCases.filter((result) => result.checks.sources).length,
      sourceCases.length,
      dataset.thresholds.correctSourceRate,
    ),
    trust: rateGate(
      trustCases.filter((result) => result.passed).length,
      trustCases.length,
      dataset.thresholds.trustPassRate,
    ),
    latency: {
      passed: context.mode === 'offline' || p95 <= latencyThreshold,
      value: p95,
      threshold: latencyThreshold,
      numerator: results.filter((result) => result.latencyMs <= latencyThreshold).length,
      denominator: results.length,
    },
  }
  const gateFailed = Object.values(gates).some((gate) => !gate.passed)
  const recommendation = severityCounts.critical > 0 || gateFailed
    ? 'FAIL'
    : failedResults.length > 0
      ? 'PASS WITH GAPS'
      : 'PASS'

  return {
    schemaVersion: 'site-agent-evaluation-report/v1',
    datasetVersion: dataset.version,
    mode: context.mode,
    target: context.target,
    commit: context.commit,
    startedAt: context.startedAt,
    completedAt: context.completedAt,
    recommendation,
    counts: { attempted, passed, failed: attempted - passed },
    severityCounts,
    gates,
    results,
  }
}

export function buildKnowledgeGapQueue(
  dataset: SiteAgentEvaluationDataset,
  results: SiteAgentEvaluationCaseResult[],
  context: { receipt: string; generatedAt: string },
): SiteAgentKnowledgeGapQueue {
  const byId = new Map(dataset.cases.map((testCase) => [testCase.id, testCase]))
  const gaps = results.flatMap((result) => {
    if (result.passed) return []
    const testCase = byId.get(result.caseId)
    if (!testCase) return []
    const failedChecks = (Object.entries(result.checks) as Array<[keyof SiteAgentEvaluationChecks, boolean]>)
      .filter(([, passed]) => !passed)
      .map(([name]) => name)
    return [{
      fingerprint: stableFingerprint(`${dataset.version}:${testCase.id}:${failedChecks.join(',')}`),
      caseId: testCase.id,
      category: testCase.category,
      severity: testCase.severity,
      expectedFacts: [...testCase.expected.requiredFacts],
      expectedSources: [...testCase.expected.requiredSourceFragments],
      failedChecks,
      status: 'open' as const,
    }]
  })
  return {
    schemaVersion: 'site-agent-knowledge-gaps/v1',
    datasetVersion: dataset.version,
    generatedAt: context.generatedAt,
    receipt: context.receipt,
    gaps,
  }
}

function formatPercent(gate: SiteAgentEvaluationGate): string {
  return `${(gate.value * 100).toFixed(1)}% (${gate.numerator}/${gate.denominator})`
}

export function evaluationReportToMarkdown(report: SiteAgentEvaluationReport): string {
  const rows = report.results.map((result) =>
    `| ${result.caseId} | ${result.category} | ${result.passed ? 'PASS' : 'FAIL'} | ${result.latencyMs} ms | ${result.severity} | ${result.evidence} |`,
  )
  return [
    '# Site Agent evaluation receipt',
    '',
    `- Dataset: \`${report.datasetVersion}\``,
    `- Mode: \`${report.mode}\``,
    `- Target: \`${report.target}\``,
    `- Commit: \`${report.commit}\``,
    `- Started: ${report.startedAt}`,
    `- Completed: ${report.completedAt}`,
    '',
    '## Gate result',
    '',
    `- Recommendation: **${report.recommendation}**`,
    `- Cases: ${report.counts.passed}/${report.counts.attempted} passed`,
    `- Critical: ${report.severityCounts.critical}`,
    `- High: ${report.severityCounts.high}`,
    `- Medium: ${report.severityCounts.medium}`,
    `- Low: ${report.severityCounts.low}`,
    '',
    '## KPI scorecard',
    '',
    `- Useful answers: ${formatPercent(report.gates.usefulAnswers)}; threshold ${(report.gates.usefulAnswers.threshold * 100).toFixed(0)}%`,
    `- Correct sources: ${formatPercent(report.gates.sources)}; threshold ${(report.gates.sources.threshold * 100).toFixed(0)}%`,
    `- Trust cases: ${formatPercent(report.gates.trust)}; threshold ${(report.gates.trust.threshold * 100).toFixed(0)}%`,
    `- p95 latency: ${report.gates.latency.value} ms; threshold ${report.mode === 'offline' ? 'not applied offline' : `${report.gates.latency.threshold} ms`}`,
    '',
    '## Case results',
    '',
    '| ID | Category | Result | Latency | Severity | Evidence |',
    '| --- | --- | --- | ---: | --- | --- |',
    ...rows,
    '',
    '## Privacy receipt',
    '',
    'This receipt contains synthetic case IDs, score outcomes, public-source expectations, and timing only. It does not contain visitor questions, answers, emails, filenames, note bodies, or secrets.',
    '',
  ].join('\n')
}
