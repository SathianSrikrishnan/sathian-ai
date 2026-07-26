import { evaluateAgentPolicy } from '@/lib/agent/policy'
import { parseClassifierDecision } from '@/lib/agent/schemas'
import type {
  AgentPolicyInput,
  AgentRoutingDecision,
  ClassifierDecision,
} from '@/lib/agent/types'

type Classifier = (input: {
  message: string
  deterministicRoute: AgentRoutingDecision['route']
}) => Promise<unknown>

interface RouterOptions {
  classifierEnabled?: boolean
  classifier?: Classifier
}

export function shouldUseOptionalClassifier(
  environment: Record<string, string | undefined> = process.env,
): boolean {
  return environment.AGENT_CLASSIFIER_ENABLED?.toLowerCase() === 'true'
}

function mergeClassifierDecision(
  deterministic: AgentRoutingDecision,
  classifier: ClassifierDecision,
): AgentRoutingDecision {
  return {
    ...deterministic,
    route: classifier.route,
    reasonCodes: Array.from(
      new Set([...deterministic.reasonCodes, ...classifier.reasonCodes, 'OPTIONAL_CLASSIFIER_USED']),
    ),
    classifierUsed: true,
  }
}

export async function routeAgentRequest(
  input: AgentPolicyInput,
  options: RouterOptions = {},
): Promise<AgentRoutingDecision> {
  const deterministic = evaluateAgentPolicy(input)
  const baseDecision: AgentRoutingDecision = {
    ...deterministic,
    classifierUsed: false,
  }

  if (baseDecision.route === 'block') return baseDecision

  const classifierEnabled =
    options.classifierEnabled ?? shouldUseOptionalClassifier(process.env)
  if (!classifierEnabled || !options.classifier) return baseDecision

  const rawDecision = await options.classifier({
    message: baseDecision.normalizedMessage,
    deterministicRoute: baseDecision.route,
  })

  return mergeClassifierDecision(baseDecision, parseClassifierDecision(rawDecision))
}
