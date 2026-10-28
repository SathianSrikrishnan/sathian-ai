import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { STORIES, getStory } from '../../src/lib/learn/storybook'
import films from '../../src/lib/learn/storybook/films.json'

describe('migrated story collection', () => {
  it('preserves seven distinct stories with readable pages and valid public illustration URLs', () => {
    expect(STORIES).toHaveLength(7)
    expect(new Set(STORIES.map(s => s.slug)).size).toBe(7)
    for (const story of STORIES) {
      expect(getStory(story.slug)).toBe(story)
      expect(story.frames.length).toBeGreaterThan(20)
      for (const frame of story.frames) {
        expect(frame.text.trim().length).toBeGreaterThan(0)
        const url = new URL(frame.image)
        expect(url.protocol).toBe('https:')
        expect(url.pathname).toContain('/storage/v1/object/public/')
      }
    }
    expect(getStory('unknown-story')).toBeUndefined()
  })
  it('maps seven films to their readers plus one clearly standalone earlier film, with local posters and captions', () => {
    expect(films).toHaveLength(8)
    expect(films.filter(f=>getStory(f.slug))).toHaveLength(7)
    expect(films.filter(f=>!getStory(f.slug)).map(f=>f.slug)).toEqual(['tanda-and-her-father'])
    for (const film of films) {
      for (const src of [film.src, film.poster, film.captions]) {
        expect(src.startsWith('/learn-story-media/')).toBe(true)
        expect(existsSync('public' + src)).toBe(true)
      }
      expect(readFileSync('public' + film.captions, 'utf8').startsWith('WEBVTT')).toBe(true)
    }
  })
})
