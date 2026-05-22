import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const encryptionPath = resolve(root, 'src/lib/toothlight/server/private-notes.ts')
const repositoryPath = resolve(root, 'src/lib/toothlight/server/toothlight-repository.ts')
const healthPath = resolve(root, 'src/app/api/toothlight/health/route.ts')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(encryptionPath), 'private note encryption helper must exist')

const encryption = existsSync(encryptionPath) ? readFileSync(encryptionPath, 'utf8') : ''
const repository = readFileSync(repositoryPath, 'utf8')
const health = readFileSync(healthPath, 'utf8')

assert(encryption.includes('TOOTHLIGHT_NOTE_ENCRYPTION_KEY'), 'encryption helper must use dedicated note key env var')
assert(encryption.includes('aes-256-gcm'), 'private notes must use authenticated encryption')
assert(encryption.includes('randomBytes(12)'), 'private note encryption must use a fresh GCM nonce')
assert(encryption.includes('base64-encoded 32-byte key'), 'private note key must require 32 bytes')
assert(repository.includes('encryptPrivateNote'), 'repository must encrypt private note bodies before persistence')
assert(!/note_body_encrypted:\s*validated\.sealedText/.test(repository), 'future notes must not store sealedText directly')
assert(!/note_body_encrypted:\s*validated\.noteText/.test(repository), 'family notes must not store noteText directly')
assert(!/seed_note:\s*validated\.seedNote/.test(repository), 'seed note text must not be stored directly')
assert(health.includes('TOOTHLIGHT_NOTE_ENCRYPTION_KEY'), 'health route must check private note encryption key')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-note-encryption: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-note-encryption')
