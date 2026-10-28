import { expect,it } from 'vitest'
import { lessonEntryMode } from '../../src/lib/learn/selection'
import data from '../../src/lib/learn/lessons.json'
import { stablecoinLesson } from '../../src/lib/learn/stablecoin'
it('normalizes legacy Solana try links to the accepted watch-only film',()=>{
 const lesson=data.find(l=>l.id==='solana')!;expect(lesson.chapters).toHaveLength(0)
 expect(lessonEntryMode(lesson,'try')).toBe('watch');expect(lessonEntryMode(lesson,'watch')).toBe('watch')
})
it('opens the real stablecoin interaction without inventing watch media',()=>{
 expect(lessonEntryMode(stablecoinLesson,'watch')).toBe('try');expect(lessonEntryMode(stablecoinLesson,'try')).toBe('try')
 expect(stablecoinLesson.watch).toBeUndefined()
})
it('preserves watch and question modes for the accepted interactive film lessons',()=>{
 for(const lesson of data.filter(l=>l.chapters.length)){expect(lessonEntryMode(lesson,'try')).toBe('try');expect(lessonEntryMode(lesson,'watch')).toBe('watch')}
})
