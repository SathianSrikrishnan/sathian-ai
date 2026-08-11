import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const runner = readFileSync(
  new URL('../browser/run-agent-dev-with-env.cjs', import.meta.url),
  'utf8',
)

describe('protected local site-agent runner', () => {
  it('binds and declares one exact loopback origin for production-mode tests', () => {
    expect(runner).toContain('SITE_AGENT_TEST_HOST')
    expect(runner).toContain("process.env.VERCEL_URL = `${testHost}:${testPort}`")
    expect(runner).toContain("'--hostname'")
    expect(runner).toContain('testHost')
  })
})
