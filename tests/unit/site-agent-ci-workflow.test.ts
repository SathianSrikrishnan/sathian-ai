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
    const runner = readFileSync('scripts/run-site-agent-eval.mjs', 'utf8')
    const browserCheck = readFileSync('tests/browser/chat_memory_check.py', 'utf8')
    const publicSurfaceCheck = readFileSync('tests/browser/public_surface_check.cjs', 'utf8')
    const releaseGate = readFileSync('scripts/verify-site-release.mjs', 'utf8')
    const soundCheck = readFileSync('tests/browser/site_agent_sound_check.cjs', 'utf8')
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))

    expect(workflow).toContain('branches: [main]')
    expect(workflow).toContain("cron: '17 13 * * *'")
    expect(workflow).toContain('cancel-in-progress: true')
    expect(workflow).toContain('npm install --global npm@10.8.2')
    expect(workflow).toContain('vercel env pull .env.local --environment=preview')
    expect(workflow).toContain('npm run agent:eval')
    expect(workflow).toContain('npm run test:unit')
    expect(workflow).toContain('npm audit --omit=dev --audit-level=critical')
    expect(workflow).toContain('npm run build')
    expect(workflow).toContain('vercel deploy --prebuilt')
    expect(workflow).toContain('SITE_AGENT_TESTER_SECRET: ${{ secrets.SITE_AGENT_TESTER_SECRET }}')
    expect(workflow).toContain('VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}')
    expect(workflow).toContain('npm run agent:eval:live')
    expect(workflow).toContain('--tag daily-smoke')
    expect(workflow).toContain('tests/browser/chat_memory_check.py')
    expect(workflow).toContain('tests/browser/public_surface_check.cjs')
    expect(workflow).toContain('tests/browser/site_agent_sound_check.cjs')
    expect(workflow).toContain('actions/upload-artifact@v4')
    expect(workflow).not.toContain('--sync-studio')
    expect(runner).toContain("headers['x-vercel-protection-bypass'] = automationBypassSecret")
    expect(browserCheck).toContain('"x-vercel-protection-bypass": AUTOMATION_BYPASS_SECRET')
    expect(browserCheck).toContain('page.reload(wait_until="commit", timeout=90_000)')
    expect(browserCheck).not.toContain('page.reload(wait_until="networkidle")')
    expect(publicSurfaceCheck).toContain("className.includes('sr-only')")
    expect(publicSurfaceCheck).toContain("'x-content-type-options': 'nosniff'")
    expect(publicSurfaceCheck).toContain("'x-vercel-protection-bypass': automationBypassSecret")
    expect(soundCheck).toContain('verifyActualMobilePlayback')
    expect(soundCheck).toContain("'x-vercel-protection-bypass': automationBypassSecret")
    expect(packageJson.scripts['release:verify']).toBe('node scripts/verify-site-release.mjs')
    expect(releaseGate).toContain("['audit', '--omit=dev', '--audit-level=critical']")
    expect(releaseGate).toContain("['tests/browser/public_surface_check.cjs']")
    expect(releaseGate).toContain("['tests/browser/site_agent_sound_check.cjs']")
  })
})
