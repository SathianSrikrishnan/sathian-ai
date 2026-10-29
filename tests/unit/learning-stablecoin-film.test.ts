import { expect,it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import film from '../../src/lib/learn/stablecoin-film.json'
it('binds the exact supplied USDC R4 film and matching captions',()=>{
 expect(createHash('sha256').update(readFileSync('public'+film.src)).digest('hex')).toBe('6e234b2947eebf5f72c0ce8215c4a76d71529d2b1a8a37bdb0906a4f5961d536')
 expect(createHash('sha256').update(readFileSync('public'+film.captions)).digest('hex')).toBe(film.captionSha256)
 expect(film.durationSeconds).toBe(41.043)
 const source=readFileSync('src/components/learn/StablecoinFilm.tsx','utf8')
 expect(source).toContain('preload="none"');expect(source).not.toContain('autoPlay');expect(source).toContain('<track kind="captions"')
})
it('preserves the question flow and makes the overview optional',()=>{
 const collection=readFileSync('src/components/learn/LessonCollection.tsx','utf8')
 expect(collection).toContain('<StablecoinFilm />');expect(collection).toContain('Start the USDC lesson')
 expect(collection).toContain('<StablecoinLesson key=')
 const quiz=readFileSync('src/components/learn/StablecoinLesson.tsx','utf8')
 expect(quiz).not.toContain('<video');expect(quiz).not.toContain('useLayoutEffect')
})
