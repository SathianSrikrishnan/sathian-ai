const encoder = new TextEncoder()

export const STUDIO_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000

async function importHmacKey(secret: string) {
  return globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(hex: string) {
  return Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16))
}

export async function signStudioToken(secret: string, now = Date.now()): Promise<string> {
  const timestamp = now.toString()
  const key = await importHmacKey(secret)
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(timestamp))

  return `${timestamp}.${bytesToHex(signature)}`
}

export async function verifyStudioToken(
  token: string,
  secret: string,
  now = Date.now(),
): Promise<boolean> {
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [timestamp, signature] = parts
  if (!/^\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/.test(signature)) return false

  const issuedAt = Number(timestamp)
  const age = now - issuedAt
  if (!Number.isSafeInteger(issuedAt) || age < 0 || age >= STUDIO_TOKEN_TTL_MS) return false

  const key = await importHmacKey(secret)
  return globalThis.crypto.subtle.verify(
    'HMAC',
    key,
    hexToBytes(signature),
    encoder.encode(timestamp),
  )
}
