import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import fixture from '../fixtures/site-agent-evals.json'

describe('site-agent CI contract', () => {
  it('keeps the daily production smoke focused on projects, writing, and releases', () => {
    const dailyCases = fixture.cases.filter((testCase) => testCase.tags.includes('daily-smoke'))

    expect(dailyCases.map((testCase) => testCase.id)).toEqual([
      'EVAL-001',
      'EVAL-004',
      'EVAL-005',
    ])
    expect(dailyCases.every((testCase) => testCase.tags.includes('live-canary'))).toBe(true)
  })

  it('runs an offline gate, protected preview canary, browser proof, and bounded daily smoke', () => {
    const workflow = readFileSync('.github/workflows/site-agent-quality.yml', 'utf8')

    expect(workflow).toContain('branches: [main]')
    expect(workflow).toContain("cron: '17 13 * * *'")
    expect(workflow).toContain('npm install --global npm@10.8.2')
    expect(workflow).toContain('vercel env pull .env.local --environment=preview')
    expect(workflow).toContain('npm run agent:eval')
    expect(workflow).toContain('npm run test:unit')
    expect(workflow).toContain('npm run build')
    expect(workflow).toContain('vercel deploy --prebuilt')
    expect(workflow).toContain('SITE_AGENT_TESTER_SECRET: ${{ secrets.SITE_AGENT_TESTER_SECRET }}')
    expect(workflow).toContain('npm run agent:eval:live')
    expect(workflow).toContain('--tag daily-smoke')
    expect(workflow).toContain('tests/browser/chat_memory_check.py')
    expect(workflow).toContain('actions/upload-artifact@v4')
    expect(workflow).not.toContain('--sync-studio')
  })
})
