import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const checks = []
const test = (name, fn) => checks.push([name, fn])

test('chapter 1 combines the repeated window beat and clarifies morning proof', () => {
  const story = read('src/data/stories/tanda.ts')

  assert.match(story, /scenes:\s*\[[\s\S]*?id: 's1-13-another-window-calls'[\s\S]*?"I will read it after\."/)
  assert.doesNotMatch(story, /id: 's1-14-read-it-after'/)
  assert.match(story, /where no fairy was looking/)
  assert.match(story, /Elias found the coin first/)
  assert.match(story, /She kept the corn part\./)
})

test('chapter 2 uses the stronger origin title and a tighter mercy sequence', () => {
  const story = read('src/data/stories/viking-origin.ts')

  assert.match(story, /title: 'Tanda Fae and the First Tooth Fee'/)
  assert.match(story, /text: 'Tanda Fae\\nand the First Tooth Fee'/)
  assert.doesNotMatch(story, /id: 's2-15-waiting-work'/)
  assert.doesNotMatch(story, /id: 's2-21-boy-shows'/)
  assert.doesNotMatch(story, /id: 's2-24-mercy-does'/)
  assert.doesNotMatch(story, /id: 's2-26-slower-than-taking'/)
  assert.match(story, /The boy led him down the stones to a cracked little boat/)
  assert.match(story, /It was slower than taking\. It was better\./)
})

test('chapter 3 leads with the treaty title and compresses the bedroom conflict', () => {
  const story = read('src/data/stories/ratoncito-perez.ts')

  assert.match(story, /title: 'The Toothlight Treaty'/)
  assert.match(story, /text: 'The Toothlight Treaty'/)
  assert.match(story, /subtext: 'A Ratoncito Perez story about two true tooth traditions\.'/)
  assert.doesNotMatch(story, /id: 'rp3-18-both-hands-reach'/)
  assert.doesNotMatch(story, /id: 'rp3-20-perez-offense'/)
  assert.match(story, /Perez reached under the pillow as Tanda softened the room/)
  assert.match(story, /Tanda did not sign above his name\. She signed beside it\./)
})

test('homepage and stories atlas use the updated trilogy titles', () => {
  const home = read('src/components/toothfairy/home/tanda-live-ritual-hero.tsx')
  const stories = read('src/app/toothfairy/stories/page.tsx')
  const combined = `${home}\n${stories}`

  assert.match(combined, /Tanda Fae and the First Tooth Fee/)
  assert.match(combined, /The Toothlight Treaty/)
  assert.doesNotMatch(combined, /title:\s*["']Tanda Fae and the Tooth Fee["']/)
  assert.doesNotMatch(combined, /title:\s*["']Ratoncito Perez and the Toothlight Treaty["']/)
})

let failed = 0
for (const [name, fn] of checks) {
  try {
    fn()
    console.log(`ok - ${name}`)
  } catch (error) {
    failed += 1
    console.error(`not ok - ${name}`)
    console.error(error.message)
  }
}

if (failed > 0) {
  process.exitCode = 1
}
