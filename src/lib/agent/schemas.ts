import type { ClassifierDecision, ClassifierRoute } from '@/lib/agent/types'

const CLASSIFIER_ROUTES = new Set<ClassifierRoute>(['answer', 'intake', 'answer_and_intake'])
const CLASSIFIER_KEYS = new Set(['route', 'reasonCodes'])
const REASON_CODE = /^[A-Z][A-Z0-9_]{0,63}$/

function invalidClassifierOutput(): never {
  throw new Error('Invalid classifier output')
}

export function parseClassifierDecision(value: unknown): ClassifierDecision {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalidClassifierOutput()
  }

  const record = value as Record<string, unknown>
  if (Object.keys(record).some((key) => !CLASSIFIER_KEYS.has(key))) {
    return invalidClassifierOutput()
  }

  if (typeof record.route !== 'string' || !CLASSIFIER_ROUTES.has(record.route as ClassifierRoute)) {
    return invalidClassifierOutput()
  }

  if (
    !Array.isArray(record.reasonCodes) ||
    record.reasonCodes.length > 8 ||
    !record.reasonCodes.every((reason) => typeof reason === 'string' && REASON_CODE.test(reason))
  ) {
    return invalidClassifierOutput()
  }

  return {
    route: record.route as ClassifierRoute,
    reasonCodes: [...record.reasonCodes] as string[],
  }
}
