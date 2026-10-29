import { checkReadability, TARGET_GRADE, type PlainWordsResult } from '@/lib/plain-words'

// Owner rule, Oct 29: nothing goes public on sathian.ai unless it reads at grade 5 or below,
// has no very hard sentences, and makes none of the banned claims below.
// Essays published before the gate keep their recorded score; an edit may not make them worse.
export const PUBLISH_GATE_BASELINE: Record<string, { grade: number; veryHard: number }> = {
  'keep-the-internet-open': { grade: 8.3, veryHard: 7 },
  'inside-monkedao': { grade: 8.3, veryHard: 5 },
  'saraswati-lakshmi-and-the-ledger': { grade: 6.9, veryHard: 5 },
  'a-corporate-card-for-code': { grade: 7.7, veryHard: 3 },
  'the-gap-between-weeks': { grade: 6.1, veryHard: 2 },
  'cream-2-point-0': { grade: 6.5, veryHard: 8 },
  'the-yellow-box': { grade: 6.3, veryHard: 7 },
  'nine-pages': { grade: 6.5, veryHard: 11 },
  'yakkos-world': { grade: 6.9, veryHard: 14 },
}

// Claims the owner's copy rules forbid (TFN public copy, Grow framing, crypto honesty).
export const BANNED_CLAIMS: { pattern: RegExp; why: string }[] = [
  { pattern: /never been hacked/i, why: 'Unprovable safety claim' },
  { pattern: /guaranteed (returns?|growth|profit)/i, why: 'Promises returns' },
  { pattern: /risk[- ]free|no downside/i, why: 'Hides real risk' },
  { pattern: /\b(audited|fdic|insured deposits?)\b/i, why: 'Claims an audit or insurance we do not have' },
  { pattern: /\b\d+(\.\d+)?%\s*(apy|apr|yield|returns?)\b/i, why: 'Quotes a yield or return number' },
]

export interface GateInput { slug: string; title?: string; description?: string; body?: string }

export interface GateResult {
  ok: boolean
  reasons: string[]
  readability: PlainWordsResult
  baseline?: { grade: number; veryHard: number }
}

export function publishGate(article: GateInput): GateResult {
  const text = [article.title, article.description, article.body].filter(Boolean).join('\n\n')
  const readability = checkReadability(text)
  const baseline = PUBLISH_GATE_BASELINE[article.slug]
  const reasons: string[] = []

  if (baseline) {
    if (readability.grade > baseline.grade) reasons.push(`Reading grade rose to ${readability.grade} (was ${baseline.grade}). Edits may not make it harder to read.`)
    if (readability.veryHardSentences.length > baseline.veryHard) reasons.push(`Very hard sentences rose to ${readability.veryHardSentences.length} (was ${baseline.veryHard}).`)
  } else {
    if (readability.grade > TARGET_GRADE) reasons.push(`Reading grade ${readability.grade}. It must be ${TARGET_GRADE} or below.`)
    if (readability.veryHardSentences.length) reasons.push(`${readability.veryHardSentences.length} very hard sentence(s): ${readability.veryHardSentences.slice(0, 3).map((s) => `"${s.sentence}"`).join(' ')}`)
  }
  for (const { pattern, why } of BANNED_CLAIMS) {
    const m = text.match(pattern)
    if (m) reasons.push(`Banned claim "${m[0]}": ${why}.`)
  }
  return { ok: reasons.length === 0, reasons, readability, baseline }
}
