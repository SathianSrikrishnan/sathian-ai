import { expect,it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import films from '../../src/lib/learn/planets.json'
it('preserves three corrected Planet films and adds the captioned Mercury Pluto review',()=>{
 expect(films.map(f=>f.slug)).toEqual(['earth-mars','venus-earth','jupiter-saturn','mercury-pluto'])
 expect(new Set(films.map(f=>f.poster)).size).toBe(4)
 for(const f of films){
  expect(createHash('sha256').update(readFileSync('public'+f.src)).digest('hex')).toBe(f.sha256)
  expect(createHash('sha256').update(readFileSync('public'+f.captions,'utf8').replace(/\r\n/g,'\n')).digest('hex')).toBe(f.captionSha256)
  expect(f.durationSeconds).toBeGreaterThan(40);expect(f.durationSeconds).toBeLessThan(f.slug==='mercury-pluto'?55:52)
 }
 const source=readFileSync('src/components/learn/PlanetShelf.tsx','utf8')
 expect(source).toContain('preload="none"');expect(source).not.toContain('autoPlay');expect(source).toContain('srikrishnan.work/planet-patterns')
})
it('keeps the companion article truthful, readable and linked to its film',()=>{
 const article=JSON.parse(readFileSync('src/lib/learn/mercury-pluto.json','utf8'))
 const text=JSON.stringify(article)
 expect(text).toContain('dwarf planet');expect(text).toContain('88 Earth days');expect(text).toContain('248 Earth years')
 expect(text).toContain('1776');expect(text).not.toContain('2024');expect(text).toContain('about as long as the United States has existed');expect(text).toContain('not physical connections or orbital tracks')
 expect(article.sources).toHaveLength(4);expect(text).not.toContain('Production status')
 expect(text).not.toContain('R4 restores');expect(text).not.toContain('â');expect(text).toContain('1823 Stone engraving')
 expect(article.historicalImage.source).toBe('https://www.archives.gov/founding-docs/downloads')
 expect(article.transcript).toMatch(/^Hey explorers! Can two worlds help us draw\?/)
 expect(article.transcript).not.toContain('Dad here')
 const film=films.find(f=>f.slug==='mercury-pluto')!
 expect(film.article).toBe('/learn/planet-patterns/mercury-pluto')
 const manifest=JSON.parse(readFileSync('docs/releases/planet-mercury-pluto-review-20261029-assets.json','utf8'))
 for(const asset of manifest.assets)expect(createHash('sha256').update(readFileSync(asset.path)).digest('hex')).toBe(asset.sha256)
})
it('preserves every new release media asset in the manifest',()=>{
 const manifest=JSON.parse(readFileSync('docs/releases/proof-learn-polish-review-assets-20261028.json','utf8'))
 const visit=(value:unknown)=>{if(!value||typeof value!=='object')return;const item=value as Record<string,unknown>;if(typeof item.path==='string'&&typeof item.sha256==='string'){const bytes=item.path.endsWith('.vtt')?readFileSync(item.path,'utf8').replace(/\r\n/g,'\n'):readFileSync(item.path);expect(createHash('sha256').update(bytes).digest('hex')).toBe(item.sha256)}for(const v of Object.values(item))if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')visit(v)}
 visit(manifest)
})
