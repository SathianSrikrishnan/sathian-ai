import { expect,it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import film from '../../src/lib/learn/solana-overview-film.json'
it('keeps the exact modern Solana film distinct from the preserved historical lesson',()=>{
 expect(createHash('sha256').update(readFileSync('public'+film.src)).digest('hex')).toBe('2a269dd2987900055cafae9a25c2f50598b2918c1e51c3733831f5110bff2081')
 expect(createHash('sha256').update(readFileSync('public'+film.captions)).digest('hex')).toBe(film.captionSha256)
 const source=readFileSync('src/components/learn/SolanaOverview.tsx','utf8')
 expect(source).toContain('Solana and SOL');expect(source).toContain('preload="none"');expect(source).not.toContain('autoPlay')
 const collection=readFileSync('src/components/learn/LessonCollection.tsx','utf8');expect(collection).toContain('<SolanaOverview />');expect(collection).toContain('Historical Solana film')
})
