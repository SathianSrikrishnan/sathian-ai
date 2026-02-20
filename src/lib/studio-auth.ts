import crypto from 'crypto'

export function signToken(secret: string): string {
  const timestamp = Date.now().toString()
  const hmac = crypto.createHmac('sha256', secret).update(timestamp).digest('hex')
  return `${timestamp}.${hmac}`
}

export function verifyToken(token: string, secret: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [timestamp, signature] = parts
  const expected = crypto.createHmac('sha256', secret).update(timestamp).digest('hex')
  if (signature !== expected) return false
  // Token valid for 30 days
  const age = Date.now() - parseInt(timestamp, 10)
  return age < 30 * 24 * 60 * 60 * 1000
}
