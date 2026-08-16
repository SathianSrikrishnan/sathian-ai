import { spawn, spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const nodeCommand = process.execPath
const npmCli = process.env.npm_execpath
const port = process.env.RELEASE_VERIFY_PORT || '3100'
const siteUrl = `http://127.0.0.1:${port}`
const receiptDirectory = join(tmpdir(), 'sathian-ai-site-agent-release')

function run(command, args, label, env = process.env) {
  console.log(`\n[release gate] ${label}`)
  const result = spawnSync(command, args, { env, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status || 1)
}

function runNpm(args, label) {
  if (!npmCli) throw new Error('npm_execpath is unavailable; run this gate through npm run release:verify')
  run(nodeCommand, [npmCli, ...args], label)
}

async function waitForServer(url) {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Timed out waiting for ${url}`)
}

runNpm(['run', 'test:unit'], 'unit and contract tests')
runNpm(['run', 'agent:eval', '--', '--output-dir', receiptDirectory], '60-case site-agent evaluation')
runNpm(['audit', '--omit=dev', '--audit-level=critical'], 'critical production dependency audit')
runNpm(['run', 'build'], 'production build')

console.log('\n[release gate] desktop/mobile browser and sound verification')
const server = spawn(nodeCommand, ['node_modules/next/dist/bin/next', 'start', '-p', port], {
  env: process.env,
  stdio: 'inherit',
})

try {
  await waitForServer(siteUrl)
  const browserEnv = { ...process.env, SITE_URL: siteUrl }
  run(nodeCommand, ['tests/browser/public_surface_check.cjs'], 'public surfaces', browserEnv)
  run(nodeCommand, ['tests/browser/site_agent_sound_check.cjs'], 'site-agent sound', browserEnv)
} finally {
  server.kill()
}

run('git', ['diff', '--check'], 'patch hygiene')
console.log('\n[release gate] PASS')
