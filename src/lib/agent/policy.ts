import type {
  AgentPolicyDecision,
  AgentPolicyInput,
  AgentRoute,
} from '@/lib/agent/types'

export const POLICY_VERSION = 'public-agent-policy/1.0.0'

const SECRET_REQUEST =
  /(?:reveal|show|print|give|tell|expose|read|dump|steal|send)[\s\S]{0,100}(?:api[\s_-]*(?:key|token)|service[\s_-]*role|private[\s_-]*key|seed[\s_-]*phrase|password|credentials?|environment[\s_-]*variables?|\.env|secret|token)/i

const PRIVATE_FAMILY_REQUEST =
  /(?:children(?:'s)?|child(?:'s)?|kids?|family)[\s\S]{0,100}(?:school|birthday|birth date|home address|address|phone|custody|medical|daily schedule|where (?:they|he|she) live)/i

const CLIENT_DATA_REQUEST =
  /(?:clients?|customers?)[\s\S]{0,100}(?:list|data|records?|contracts?|files?|emails?|details|secrets?|private projects?)/i

const PRIVATE_MEMORY_REQUEST =
  /(?:reveal|show|print|give|tell|expose|read|dump|quote|extract|list)[\s\S]{0,100}(?:private|internal|non-public|persistent|second[\s-]+brain)[\s\S]{0,50}(?:memory|notes?|facts?|context)/i

const SHELL_ACCESS_REQUEST =
  /(?:open|use|run|execute|launch|access)[\s\S]{0,60}(?:powershell|command prompt|terminal|shell|bash|cmd\.exe|system command|server command)|(?:activate|enable|enter)[\s\S]{0,40}(?:administrator|admin|developer)[\s\S]{0,40}(?:mode|access)|(?:browse|inspect|read|modify)[\s\S]{0,60}(?:file[\s-]*system|server files?|local files?)/i

const ARBITRARY_TOOL_REQUEST =
  /(?:use|call|run|invoke)[\s\S]{0,40}(?:your|available|hidden|admin)[\s\S]{0,30}tools?|(?:send|post|publish|deploy|purchase|buy)[\s\S]{0,80}(?:telegram|email|message|social|code|site|production|for me)/i

const INTAKE_REQUEST =
  /(?:leave|send|pass|forward|share)[\s\S]{0,40}(?:a )?(?:note|message|feedback|idea)|(?:tell|ask|let)\s+sathian|(?:here is|here's)\s+my\s+(?:email|number)|contact\s+me/i

const NOTE_WORKFLOW_HELP =
  /^(?:(?:can|could)\s+i\s+(?:leave|send|write)\s+(?:sathian\s+)?(?:a\s+)?(?:note|message)(?:\s+(?:for|to)\s+sathian)?|(?:how|where)\s+(?:can|do)\s+i\s+(?:leave|send|write)\s+(?:sathian\s+)?(?:a\s+)?(?:note|message)(?:\s+(?:for|to)\s+sathian)?)\??$/i

const ANSWER_REQUEST =
  /\?|^(?:who|what|when|where|why|how|which|can|could|would|does|do|is|are|tell me|explain)\b/i

function normalizeMessage(message: string): string {
  return message
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000)
}

function hardDenyReason(message: string): string | null {
  if (SECRET_REQUEST.test(message)) return 'SECRET_REQUEST'
  if (PRIVATE_FAMILY_REQUEST.test(message)) return 'PRIVATE_FAMILY_REQUEST'
  if (CLIENT_DATA_REQUEST.test(message)) return 'CLIENT_DATA_REQUEST'
  if (PRIVATE_MEMORY_REQUEST.test(message)) return 'PRIVATE_MEMORY_REQUEST'
  if (SHELL_ACCESS_REQUEST.test(message)) return 'SHELL_ACCESS_REQUEST'
  if (ARBITRARY_TOOL_REQUEST.test(message) && !NOTE_WORKFLOW_HELP.test(message)) {
    return 'ARBITRARY_TOOL_REQUEST'
  }
  return null
}

function classifyIntent(message: string): { route: AgentRoute; reason: string } {
  const requestsAnswer = ANSWER_REQUEST.test(message)
  const requestsIntake = INTAKE_REQUEST.test(message) && !NOTE_WORKFLOW_HELP.test(message)

  if (requestsAnswer && requestsIntake) {
    return { route: 'answer_and_intake', reason: 'ANSWER_AND_INTAKE_REQUEST' }
  }
  if (requestsIntake) return { route: 'intake', reason: 'INTAKE_REQUEST' }
  return { route: 'answer', reason: 'ANSWER_REQUEST' }
}

export function evaluateAgentPolicy(input: AgentPolicyInput): AgentPolicyDecision {
  const normalizedMessage = normalizeMessage(input.message)
  const ignoredUntrustedContent = (input.untrustedContent ?? []).some(
    (content) => typeof content === 'string' && content.trim().length > 0,
  )
  const denyReason = hardDenyReason(normalizedMessage)

  if (denyReason) {
    return {
      route: 'block',
      allowed: false,
      policyVersion: POLICY_VERSION,
      reasonCodes: [
        denyReason,
        ...(ignoredUntrustedContent ? ['UNTRUSTED_INSTRUCTIONS_IGNORED'] : []),
      ],
      normalizedMessage,
    }
  }

  const intent = classifyIntent(normalizedMessage)
  return {
    route: intent.route,
    allowed: true,
    policyVersion: POLICY_VERSION,
    reasonCodes: [
      intent.reason,
      ...(ignoredUntrustedContent ? ['UNTRUSTED_INSTRUCTIONS_IGNORED'] : []),
    ],
    normalizedMessage,
  }
}
