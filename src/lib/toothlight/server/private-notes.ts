import { createCipheriv, randomBytes } from 'crypto'

const NOTE_KEY_ENV = 'TOOTHLIGHT_NOTE_ENCRYPTION_KEY'
const ENVELOPE_VERSION = 'v1'

export function encryptPrivateNote(plainText: string) {
  const text = plainText.trim()
  if (!text) return null

  const key = readEncryptionKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [
    ENVELOPE_VERSION,
    iv.toString('base64'),
    authTag.toString('base64'),
    ciphertext.toString('base64'),
  ].join(':')
}

export function readEncryptionKey() {
  const encoded = process.env[NOTE_KEY_ENV]?.trim()
  if (!encoded) {
    throw new Error(`${NOTE_KEY_ENV} is required before saving private notes.`)
  }

  const key = Buffer.from(encoded, 'base64')
  if (key.byteLength !== 32) {
    throw new Error(`${NOTE_KEY_ENV} must be a base64-encoded 32-byte key.`)
  }

  return key
}
