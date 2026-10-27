import type { Answer, Mode, Part } from './types'
export interface PlayerState { chapter: number; part: Part; phase: 'idle' | 'playing' | 'choice' | 'finished'; mode: Mode; answers: Record<number, Answer> }
export type PlayerEvent = { type: 'start' } | { type: 'ended'; canonicalAnswer: Answer; chapters: number } | { type: 'choose'; answer: Answer } | { type: 'replay' } | { type: 'back' } | { type: 'restart' } | { type: 'mode'; mode: Mode }
export const initialState = (mode: Mode = 'try'): PlayerState => ({ chapter: 0, part: 'question', phase: 'idle', mode, answers: {} })
export function transition(s: PlayerState, e: PlayerEvent): PlayerState {
  switch (e.type) {
    case 'start': return s.phase === 'idle' ? { ...s, phase: 'playing' } : s
    case 'choose': return s.phase === 'choice' && s.mode === 'try' ? { ...s, part: e.answer, phase: 'playing', answers: { ...s.answers, [s.chapter]: e.answer } } : s
    case 'ended':
      if (s.phase !== 'playing') return s
      if (s.part === 'question') return s.mode === 'try' ? { ...s, phase: 'choice' } : { ...s, part: e.canonicalAnswer }
      if (s.part === 'yes' || s.part === 'no') return { ...s, part: 'close' }
      return s.chapter + 1 < e.chapters ? { ...s, chapter: s.chapter + 1, part: 'question' } : { ...s, phase: 'finished' }
    case 'replay': return { ...s, part: 'question', phase: 'playing' }
    case 'back': return { ...s, chapter: Math.max(0, s.chapter - 1), part: 'question', phase: 'playing' }
    case 'restart': return { ...initialState(s.mode), phase: 'playing' }
    case 'mode': return initialState(e.mode)
  }
}
