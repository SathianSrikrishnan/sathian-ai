import { createHash } from 'node:crypto'

export const PUBLIC_AGENT_REQUESTS_PER_HOUR = 10
export const PUBLIC_AGENT_MODEL_CALLS_PER_DAY = 100

const GLOBAL_MODEL_QUOTA_HASH = createHash('sha256')
  .update('sathian-ai:public-agent:global-model-quota')
  .digest('hex')

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
