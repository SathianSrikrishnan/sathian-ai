import { createHmac } from 'node:crypto'

const version = 'v1'
const runId = process.argv[2]
const requestedMinutes = Number(process.argv[3] ?? '15')
const secret = process.env.SITE_AGENT_TESTER_SECRET

if (!runId || !/^[A-Za-z0-9_-]{8,64}$/.test(runId)) {
  throw new Error('Provide a tester run ID containing 8-64 letters, numbers, underscores, or hyphens.')
}
if (!Number.isFinite(requestedMinutes) || requestedMinutes <= 0 || requestedMinutes > 60) {
  throw new Error('Token lifetime must be between 1 and 60 minutes.')
}
if (!secret || secret.length < 24) {
  throw new Error('SITE_AGENT_TESTER_SECRET must be set to at least 24 characters.')
}

const expiresAtSeconds = Math.floor(Date.now() / 1000) + Math.ceil(requestedMinutes * 60)
const payload = `site-agent-test:${version}:${expiresAtSeconds}:${runId}`
const signature = createHmac('sha256', secret).update(payload).digest('hex')

process.stdout.write(`${version}.${expiresAtSeconds}.${runId}.${signature}\n`)
