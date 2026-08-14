import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, describe, expect, it } from 'vitest'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('site-agent evaluation runner', () => {
  it('runs the full offline fixture and writes privacy-safe Markdown and JSON receipts', () => {
    const outputDirectory = mkdtempSync(join(tmpdir(), 'site-agent-eval-'))
    temporaryDirectories.push(outputDirectory)

    const run = spawnSync(process.execPath, [
      'scripts/run-site-agent-eval.mjs',
      '--mode',
      'offline',
      '--output-dir',
      outputDirectory,
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 120_000,
    })

    expect(run.status, `${run.stdout}\n${run.stderr}`).toBe(0)
    const report = JSON.parse(readFileSync(join(outputDirectory, 'latest-offline-receipt.json'), 'utf8'))
    const markdown = readFileSync(join(outputDirectory, 'latest-offline-receipt.md'), 'utf8')
    const gaps = JSON.parse(readFileSync(join(outputDirectory, 'latest-knowledge-gaps.json'), 'utf8'))

    expect(report.datasetVersion).toBe('site-agent-evals/v2')
    expect(report.counts.attempted).toBeGreaterThanOrEqual(50)
    expect(report.recommendation).toBe('PASS')
    expect(report.gates.trust.value).toBe(1)
    expect(markdown).toContain('Privacy receipt')
    expect(gaps.gaps).toEqual([])
    expect(JSON.stringify({ report, gaps })).not.toMatch(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)
  }, 120_000)
})
