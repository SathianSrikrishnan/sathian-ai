// Plain Words: Hemingway-style readability check, no dependencies.
// Same rules as the owner's local tool (Projects/_ops/tools/plain-words/plain-words.mjs).
// Grade = Automated Readability Index (the score Hemingway reports); Flesch-Kincaid shown beside it.
// Hard = 14+ words at grade 10+, very hard = 14+ words at grade 14+.

export const TARGET_GRADE = 5

export interface GradedSentence { grade: number; sentence: string }

export interface PlainWordsResult {
  grade: number
  fleschKincaidGrade: number
  target: number
  pass: boolean
  words: number
  sentences: number
  veryHardSentences: GradedSentence[]
  hardSentences: GradedSentence[]
}

const words = (s: string) => s.match(/[A-Za-z0-9'’$%.-]+/g)?.filter((w) => /[A-Za-z0-9]/.test(w)) ?? []
const letters = (s: string) => (s.match(/[A-Za-z0-9]/g) ?? []).length

function syllables(word: string) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  if (w.length <= 3) return 1
  const m = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g)
  return Math.max(1, m ? m.length : 1)
}

const ari = (chars: number, w: number, s: number) => (w && s ? 4.71 * (chars / w) + 0.5 * (w / s) - 21.43 : 0)
const round1 = (n: number) => Math.max(0, Math.round(n * 10) / 10)

function clean(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*[#>*\-|]+\s*/gm, '')
    .replace(/[*_`|]/g, ' ')
}

export function sentencesOf(text: string) {
  return clean(text)
    .split(/(?<=[.!?])\s+|\n{1,}/)
    .map((s) => s.trim())
    .filter((s) => words(s).length > 0)
}

export function checkReadability(text: string, target = TARGET_GRADE): PlainWordsResult {
  const sents = sentencesOf(text)
  let W = 0, C = 0, SY = 0
  const hard: GradedSentence[] = [], veryHard: GradedSentence[] = []
  for (const s of sents) {
    const ws = words(s)
    const c = letters(s)
    W += ws.length; C += c; SY += ws.reduce((a, w) => a + syllables(w), 0)
    const g = ari(c, ws.length, 1)
    if (ws.length >= 14 && g >= 14) veryHard.push({ grade: round1(g), sentence: s })
    else if (ws.length >= 14 && g >= 10) hard.push({ grade: round1(g), sentence: s })
  }
  const S = sents.length || 1
  const grade = round1(ari(C, W, S))
  const fk = round1(W ? 0.39 * (W / S) + 11.8 * (SY / W) - 15.59 : 0)
  return {
    grade, fleschKincaidGrade: fk, target, pass: grade <= target && veryHard.length === 0,
    words: W, sentences: sents.length, veryHardSentences: veryHard, hardSentences: hard,
  }
}
