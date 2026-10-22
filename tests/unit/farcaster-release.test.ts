import {describe,it,expect} from 'vitest'
import {FARCASTER_QUICKSTART_PROJECT,findSiteProjectsByAlias} from '@/content/site-projects'
import {getPublicProfileMemoryCards} from '@/lib/public-profile'
describe('Farcaster release knowledge',()=>{
 it('resolves to the short gateway with honest prototype limits',()=>{
  expect(findSiteProjectsByAlias('Farcaster')[0]).toBe(FARCASTER_QUICKSTART_PROJECT)
  expect(FARCASTER_QUICKSTART_PROJECT.href).toBe('/farcaster')
  const memory=JSON.stringify(getPublicProfileMemoryCards())
  expect(memory).toContain('fresh independent installation')
  expect(memory).toContain('/farcaster')
 })
})
