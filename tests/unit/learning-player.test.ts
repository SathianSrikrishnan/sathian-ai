import { describe, expect, it } from 'vitest'
import { initialState, transition } from '@/lib/learn/player-machine'
import lessons from '@/lib/learn/lessons.json'
describe('learning playback contract', () => {
  it('does not accept early answers or duplicate response events', () => {
    const initial = initialState('try'); expect(transition(initial, { type: 'choose', answer: 'yes' })).toBe(initial)
    const playing = transition(initial, { type: 'start' }); expect(transition(playing, { type: 'choose', answer: 'no' })).toBe(playing)
    const question = transition(playing, { type: 'ended', canonicalAnswer: 'yes', chapters: 6 }); expect(question.phase).toBe('choice')
    const response = transition(question, { type: 'choose', answer: 'no' }); expect(response.part).toBe('no'); expect(response.answers[0]).toBe('no')
    expect(transition(response, { type: 'choose', answer: 'yes' })).toBe(response)
  })
  it.each(['yes', 'no'] as const)('plays the %s response, closing and next chapter without Continue', answer => {
    let s = transition(initialState('try'), { type: 'start' })
    for (let i = 0; i < 6; i++) {
      expect(s.chapter).toBe(i); expect(s.part).toBe('question')
      s = transition(s, { type: 'ended', canonicalAnswer: 'no', chapters: 6 }); expect(s.phase).toBe('choice')
      s = transition(s, { type: 'choose', answer }); expect(s.part).toBe(answer)
      s = transition(s, { type: 'ended', canonicalAnswer: 'no', chapters: 6 }); expect(s.part).toBe('close')
      s = transition(s, { type: 'ended', canonicalAnswer: 'no', chapters: 6 })
    }
    expect(s.phase).toBe('finished')
  })
  it('Watch uses the declared explanatory branch and never waits for an answer', () => {
    let s = transition(initialState('watch'), { type: 'start' })
    s = transition(s, { type: 'ended', canonicalAnswer: 'no', chapters: 6 }); expect(s.part).toBe('no'); expect(s.phase).toBe('playing')
    expect(transition(s, { type: 'choose', answer: 'yes' })).toBe(s)
    s = transition(s, { type: 'ended', canonicalAnswer: 'no', chapters: 6 }); s = transition(s, { type: 'ended', canonicalAnswer: 'no', chapters: 6 }); expect(s.chapter).toBe(1)
  })
  it('back/replay reset the question and changing modes requires a fresh start', () => {
    const s = { ...initialState(), chapter: 3, part: 'close' as const, phase: 'playing' as const }
    expect(transition(s, { type: 'back' })).toMatchObject({ chapter: 2, part: 'question', phase: 'playing' })
    expect(transition(s, { type: 'replay' })).toMatchObject({ chapter: 3, part: 'question' })
    expect(transition(s, { type: 'mode', mode: 'watch' })).toEqual(initialState('watch'))
  })
  it('has genuine complete clip mappings for six Bitcoin and six Ethereum chapters; PoH stays Watch-only', () => {
    for (const id of ['bitcoin', 'ethereum']) {
      const lesson = lessons.find(x => x.id === id)!; expect(lesson.chapters).toHaveLength(6)
      for (const c of lesson.chapters) { expect(c.answer).toMatch(/^(yes|no)$/); for (const part of ['question', 'yes', 'no', 'close'] as const) { expect(c.clips[part].sha256).toMatch(/^[a-f0-9]{64}$/); expect(c.clips[part].transcript.length).toBeGreaterThan(10) } }
    }
    expect(lessons.find(x => x.id === 'solana')?.chapters).toHaveLength(0)
    expect(lessons.find(x => x.id === 'ethereum')?.chapters[0].title).toBe('Shared rules')
    expect(lessons.map(x => x.id)).toEqual(['bitcoin', 'ethereum', 'solana'])
  })
})
