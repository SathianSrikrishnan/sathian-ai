import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const PUBLIC_AGENT_REQUESTS_PER_HOUR = 10
export const PUBLIC_AGENT_MODEL_CALLS_PER_DAY = 100
export const AGENT_TESTER_TOKEN_HEADER = 'x-site-agent-test-token'

const AGENT_TESTER_TOKEN_VERSION = 'v1'
const AGENT_TESTER_TOKEN_MAX_LIFETIME_SECONDS = 3_600
const AGENT_TESTER_RUN_ID = /^[A-Za-z0-9_-]{8,64}$/
const AGENT_TESTER_SIGNATURE = /^[a-f0-9]{64}$/

const GLOBAL_MODEL_QUOTA_HASH = createHash('sha256')
  .update('sathian-ai:public-agent:global-model-quota')
  .digest('hex')

function agentTesterPayload(runId: string, expiresAtSeconds: number): string {
  return `site-agent-test:${AGENT_TESTER_TOKEN_VERSION}:${expiresAtSeconds}:${runId}`
}

export function createAgentTesterToken(input: {
  runId: string
  expiresAtSeconds: number
  secret: string
}): string {
  if (!AGENT_TESTER_RUN_ID.test(input.runId)) throw new Error('invalid_agent_tester_run_id')
  if (!Number.isSafeInteger(input.expiresAtSeconds) || input.expiresAtSeconds <= 0) {
    throw new Error('invalid_agent_tester_expiry')
  }
  if (input.secret.length < 24) throw new Error('invalid_agent_tester_secret')

  const signature = createHmac('sha256', input.secret)
    .update(agentTesterPayload(input.runId, input.expiresAtSeconds))
    .digest('hex')
  return `${AGENT_TESTER_TOKEN_VERSION}.${input.expiresAtSeconds}.${input.runId}.${signature}`
}

export function isAuthorizedAgentTesterRequest(
  request: Request,
  nowMs = Date.now(),
): boolean {
  const secret = process.env.SITE_AGENT_TESTER_SECRET
  const token = request.headers.get(AGENT_TESTER_TOKEN_HEADER)
  if (!secret || secret.length < 24 || !token) return false

  const [version, expiresRaw, runId, signature, ...extra] = token.split('.')
  if (
    extra.length > 0
    || version !== AGENT_TESTER_TOKEN_VERSION
    || !/^\d{1,12}$/.test(expiresRaw ?? '')
    || !AGENT_TESTER_RUN_ID.test(runId ?? '')
    || !AGENT_TESTER_SIGNATURE.test(signature ?? '')
  ) return false

  const expiresAtSeconds = Number(expiresRaw)
  const nowSeconds = Math.floor(nowMs / 1000)
  if (
    !Number.isSafeInteger(expiresAtSeconds)
    || expiresAtSeconds < nowSeconds
    || expiresAtSeconds > nowSeconds + AGENT_TESTER_TOKEN_MAX_LIFETIME_SECONDS
  ) return false

  const expected = createHmac('sha256', secret)
    .update(agentTesterPayload(runId, expiresAtSeconds))
    .digest()
  const supplied = Buffer.from(signature, 'hex')
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

export interface AgentRateLimitRpcClient {
  rpc(
    name: 'agent_consume_message_rate_limit',
    input: {
      p_visitor_hash: string
      p_limit: number
      p_window_seconds: number
    },
  ): PromiseLike<{ data: boolean | null; error: unknown }>
}

export function globalModelQuotaHash(): string {
  return GLOBAL_MODEL_QUOTA_HASH
}

export async function consumeGlobalModelQuota(
  client: AgentRateLimitRpcClient,
  limit = PUBLIC_AGENT_MODEL_CALLS_PER_DAY,
): Promise<boolean> {
  try {
    const { data, error } = await client.rpc('agent_consume_message_rate_limit', {
      p_visitor_hash: globalModelQuotaHash(),
      p_limit: limit,
      p_window_seconds: 86_400,
    })
    return !error && data === true
  } catch {
    return false
  }
}
