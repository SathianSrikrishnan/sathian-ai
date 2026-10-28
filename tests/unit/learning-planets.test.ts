import { expect,it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import films from '../../src/lib/learn/planets.json'
it('ships only the three corrected final Planet films with unique posters and exact captions',()=>{
 expect(films.map(f=>f.slug)).toEqual(['earth-mars','venus-earth','jupiter-saturn'])
 expect(new Set(films.map(f=>f.poster)).size).toBe(3)
 for(const f of films){
  expect(createHash('sha256').update(readFileSync('public'+f.src)).digest('hex')).toBe(f.sha256)
  expect(createHash('sha256').update(readFileSync('public'+f.captions,'utf8').replace(/\r\n/g,'\n')).digest('hex')).toBe(f.captionSha256)
  expect(f.durationSeconds).toBeGreaterThan(40);expect(f.durationSeconds).toBeLessThan(52)
 }
 const source=readFileSync('src/components/learn/PlanetShelf.tsx','utf8')
 expect(source).toContain('preload="none"');expect(source).not.toContain('autoPlay');expect(source).toContain('srikrishnan.work/planet-patterns')
})
it('preserves every new release media asset in the manifest',()=>{
 const manifest=JSON.parse(readFileSync('docs/releases/proof-learn-polish-review-assets-20261028.json','utf8'))
 const visit=(value:unknown)=>{if(!value||typeof value!=='object')return;const item=value as Record<string,unknown>;if(typeof item.path==='string'&&typeof item.sha256==='string'){const bytes=item.path.endsWith('.vtt')?readFileSync(item.path,'utf8').replace(/\r\n/g,'\n'):readFileSync(item.path);expect(createHash('sha256').update(bytes).digest('hex')).toBe(item.sha256)}for(const v of Object.values(item))if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')visit(v)}
 visit(manifest)
})
