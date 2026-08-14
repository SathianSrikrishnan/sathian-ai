import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'
import { createViteServer } from 'vitest/node'

const root = process.cwd()
const fixturePath = resolve(root, 'tests/fixtures/site-agent-evals.json')

function parseArguments(argv) {
  const options = {
    mode: 'offline',
    url: null,
    outputDirectory: resolve(root, 'docs/analytics/site-agent-evals'),
    syncStudio: false,
  }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--mode') options.mode = argv[++index]
    else if (value === '--url') options.url = argv[++index]
    else if (value === '--output-dir') options.outputDirectory = resolve(argv[++index])
    else if (value === '--sync-studio') options.syncStudio = true
    else if (value === '--help') {
      process.stdout.write([
        'Site Agent evaluation runner',
        '',
        '  --mode offline|live',
        '  --url https://candidate.example   required for live mode',
        '  --output-dir <path>               defaults to docs/analytics/site-agent-evals',
        '  --sync-studio                     explicitly upsert sanitized failures',
        '',
      ].join('\n'))
      process.exit(0)
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!['offline', 'live'].includes(options.mode)) throw new Error('Mode must be offline or live.')
  if (options.mode === 'live' && !options.url) throw new Error('Live mode requires --url.')
  return options
}

function currentCommit() {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim() : 'unknown'
}

function receiptTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 13)
}

function safeString(value) {
  return typeof value === 'string' ? value : ''
}

function safeStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []
}

function safeAction(value) {
  return value
    && typeof value === 'object'
    && typeof value.label === 'string'
    && typeof value.href === 'string'
    ? { label: value.label, href: value.href }
    : null
}

function looksUnknown(answer) {
  return /i (?:don[^\s]{0,3}t|do not) have approved public information|could not answer that safely right now/i.test(answer)
}

async function createRuntime() {
  const vite = await createViteServer({
    root,
    configFile: resolve(root, 'vitest.config.ts'),
    appType: 'custom',
    server: { middlewareMode: true },
    logLevel: 'error',
  })
  const [evaluation, policyModule, answerModule, profileModule, constantsModule, handlerModule] = await Promise.all([
    vite.ssrLoadModule('/src/lib/agent/evaluation.ts'),
    vite.ssrLoadModule('/src/lib/agent/policy.ts'),
    vite.ssrLoadModule('/src/lib/agent/answer.ts'),
    vite.ssrLoadModule('/src/lib/public-profile.ts'),
    vite.ssrLoadModule('/src/lib/constants.ts'),
    vite.ssrLoadModule('/src/lib/agent/message-handler.ts'),
  ])
  return {
    vite,
    evaluation,
    evaluateAgentPolicy: policyModule.evaluateAgentPolicy,
    answerAgentQuestion: answerModule.answerAgentQuestion,
    getPublicProfileMemoryCards: profileModule.getPublicProfileMemoryCards,
    chatSuggestions: constantsModule.CHAT_SUGGESTIONS,
    createAgentMessageHandler: handlerModule.createAgentMessageHandler,
  }
}

async function executeOfflineCase(testCase, runtime) {
  const started = performance.now()
  const policy = runtime.evaluateAgentPolicy({
    message: testCase.message,
    untrustedContent: testCase.untrustedContent,
  })
  const base = {
    caseId: testCase.id,
    route: policy.route,
    answer: '',
    sources: [],
    nextAction: null,
    unknown: false,
    modelUsed: false,
    reasonCodes: [...policy.reasonCodes],
    latencyMs: 0,
    intakeCount: 0,
    receiptIssued: false,
  }

  if (testCase.kind === 'policy') {
    return {
      ...base,
      answer: policy.route === 'block'
        ? 'I cannot help with private data, credentials, system access, or external actions.'
        : '',
      latencyMs: Math.round(performance.now() - started),
    }
  }

  if (testCase.kind === 'suggestion') {
    const suggestion = runtime.chatSuggestions.find((candidate) => candidate.id === testCase.suggestionId)
    return {
      ...base,
      route: suggestion?.action ?? 'missing_suggestion',
      answer: suggestion?.label ?? '',
      latencyMs: Math.round(performance.now() - started),
    }
  }

  if (testCase.kind === 'note-handler' || testCase.kind === 'note-handler-missing-consent') {
    let intakeCount = 0
    const handler = runtime.createAgentMessageHandler({
      persistIntake: async () => {
        intakeCount += 1
        return {
          ok: true,
          receiptToken: 'synthetic-evaluation-receipt',
          deliveryStatus: 'queued',
          created: true,
          retentionUntil: '2026-09-12T00:00:00.000Z',
        }
      },
      isRateLimited: () => false,
    })
    const response = await handler(new Request('http://127.0.0.1/api/agent/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `evaluation-${testCase.id}-0001`,
      },
      body: JSON.stringify({
        message: testCase.message,
        intent: 'note',
        page: '/',
        consent: testCase.kind === 'note-handler',
      }),
    }))
    const body = await response.json()
    return {
      ...base,
      route: safeString(body.route) || 'intake',
      answer: safeString(body.answer) || safeString(body.error),
      reasonCodes: [...policy.reasonCodes, 'EXPLICIT_NOTE_INTENT'],
      latencyMs: Math.round(performance.now() - started),
      intakeCount,
      receiptIssued: Boolean(body.receipt?.code),
    }
  }

  if (policy.route === 'block') {
    return {
      ...base,
      answer: 'I cannot help with private data, credentials, system access, or external actions.',
      latencyMs: Math.round(performance.now() - started),
    }
  }

  const model = {
    async generate() {
      if (testCase.modelError === 'provider_error') throw new Error('synthetic_provider_failure')
      if (testCase.modelError === 'timeout') return new Promise(() => undefined)
      return testCase.modelResponse ?? "I don't have approved public information about that."
    },
  }
  const answer = await runtime.answerAgentQuestion({
    message: policy.normalizedMessage,
    page: '/',
    policy,
    cards: runtime.getPublicProfileMemoryCards(),
    history: testCase.history,
  }, {
    model,
    timeoutMs: testCase.modelError === 'timeout' ? 5 : 1000,
  })
  return {
    ...base,
    route: 'answer',
    answer: answer.answer,
    sources: answer.sources,
    nextAction: answer.nextAction ?? null,
    unknown: answer.unknown,
    modelUsed: answer.modelUsed,
    latencyMs: Math.round(performance.now() - started),
  }
}

async function executeLiveCase(testCase, runtime, baseUrl, testerToken) {
  const started = performance.now()
  const target = new URL('/api/agent/message', baseUrl)
  const policy = runtime.evaluateAgentPolicy({
    message: testCase.message,
    untrustedContent: testCase.untrustedContent,
  })
  const headers = {
    'Content-Type': 'application/json',
    Origin: new URL(baseUrl).origin,
  }
  if (testerToken) headers['x-site-agent-test-token'] = testerToken
  const response = await fetch(target, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: testCase.message,
      intent: 'question',
      page: '/',
      consent: true,
      conversation: testCase.history
        ? { updatedAt: Date.now(), turns: testCase.history }
        : undefined,
    }),
  })
  const body = await response.json().catch(() => ({}))
  const answer = safeString(body.answer) || safeString(body.message) || safeString(body.error)
  return {
    status: response.status,
    retryAfter: response.headers.get('retry-after'),
    observation: {
      caseId: testCase.id,
      route: safeString(body.route) || (response.status === 429 ? 'rate_limited' : 'unknown'),
      answer,
      sources: safeStringArray(body.sources),
      nextAction: safeAction(body.nextAction),
      unknown: looksUnknown(answer),
      modelUsed: false,
      reasonCodes: safeStringArray(body.reasonCodes).length > 0
        ? safeStringArray(body.reasonCodes)
        : [...policy.reasonCodes],
      latencyMs: Math.round(performance.now() - started),
      intakeCount: body.capabilities?.intakeStored === true ? 1 : 0,
      receiptIssued: Boolean(body.receipt?.code),
    },
  }
}

async function syncStudioGaps(queue) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('--sync-studio requires existing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY values.')
  }
  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  if (queue.gaps.length === 0) return
  const rows = queue.gaps.map((gap) => ({
    fingerprint: gap.fingerprint,
    eval_case_id: gap.caseId,
    dataset_version: queue.datasetVersion,
    category: gap.category,
    severity: gap.severity,
    expected_facts: gap.expectedFacts,
    expected_sources: gap.expectedSources,
    failed_checks: gap.failedChecks,
    source_receipt: queue.receipt,
    status: 'open',
    last_seen_at: queue.generatedAt,
  }))
  const { error } = await client
    .from('agent_knowledge_gaps')
    .upsert(rows, { onConflict: 'fingerprint' })
  if (error) throw new Error('Studio knowledge-gap sync failed.')
}

const options = parseArguments(process.argv.slice(2))
const rawFixture = JSON.parse(readFileSync(fixturePath, 'utf8'))
const runtime = await createRuntime()
let report
try {
  const validation = runtime.evaluation.validateEvaluationDataset(rawFixture)
  if (validation.errors.length > 0 || !validation.dataset) {
    throw new Error(`Invalid evaluation fixture:\n${validation.errors.join('\n')}`)
  }
  const dataset = validation.dataset
  const started = new Date()
  const candidateCases = options.mode === 'offline'
    ? dataset.cases.filter((testCase) => testCase.tags.includes('offline'))
    : dataset.cases.filter((testCase) => testCase.tags.includes('live-canary'))
  const observations = []
  for (const testCase of candidateCases) {
    if (options.mode === 'offline') {
      observations.push(await executeOfflineCase(testCase, runtime))
      continue
    }
    if (testCase.kind === 'suggestion' || testCase.kind.startsWith('note-handler')) continue
    const live = await executeLiveCase(
      testCase,
      runtime,
      options.url,
      process.env.SITE_AGENT_TEST_TOKEN,
    )
    observations.push(live.observation)
    if (live.status === 429) break
  }
  const results = observations.map((observation) => {
    const testCase = dataset.cases.find((candidate) => candidate.id === observation.caseId)
    if (!testCase) throw new Error(`Missing case ${observation.caseId}.`)
    return runtime.evaluation.evaluateSiteAgentObservation(testCase, observation)
  })
  const completed = new Date()
  report = runtime.evaluation.buildEvaluationReport(dataset, results, {
    mode: options.mode,
    target: options.mode === 'offline' ? 'local source modules' : options.url,
    commit: currentCommit(),
    startedAt: started.toISOString(),
    completedAt: completed.toISOString(),
  })

  mkdirSync(options.outputDirectory, { recursive: true })
  const stamp = receiptTimestamp(completed)
  const prefix = `${stamp}-phase-4-${options.mode}-receipt`
  const markdownPath = join(options.outputDirectory, `${prefix}.md`)
  const jsonPath = join(options.outputDirectory, `${prefix}.json`)
  const latestMarkdownPath = join(options.outputDirectory, `latest-${options.mode}-receipt.md`)
  const latestJsonPath = join(options.outputDirectory, `latest-${options.mode}-receipt.json`)
  const gapPath = join(options.outputDirectory, 'latest-knowledge-gaps.json')
  const receiptReference = relative(root, jsonPath).replace(/\\/g, '/')
  const queue = runtime.evaluation.buildKnowledgeGapQueue(dataset, results, {
    receipt: receiptReference,
    generatedAt: completed.toISOString(),
  })
  const markdown = runtime.evaluation.evaluationReportToMarkdown(report)
  const json = `${JSON.stringify(report, null, 2)}\n`
  const queueJson = `${JSON.stringify(queue, null, 2)}\n`
  writeFileSync(markdownPath, markdown, 'utf8')
  writeFileSync(jsonPath, json, 'utf8')
  writeFileSync(latestMarkdownPath, markdown, 'utf8')
  writeFileSync(latestJsonPath, json, 'utf8')
  writeFileSync(gapPath, queueJson, 'utf8')
  if (options.syncStudio) await syncStudioGaps(queue)

  process.stdout.write([
    `Recommendation: ${report.recommendation}`,
    `Cases: ${report.counts.passed}/${report.counts.attempted}`,
    `Receipt: ${basename(markdownPath)}`,
    `Knowledge gaps: ${queue.gaps.length}`,
    '',
  ].join('\n'))
} finally {
  await runtime.vite.close()
}

if (report?.recommendation === 'FAIL') process.exitCode = 1
