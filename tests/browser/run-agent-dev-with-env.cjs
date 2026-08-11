const path = require('node:path')
const { loadEnvConfig } = require('@next/env')

const envSource = process.env.TFN_ENV_SOURCE
  || path.resolve(__dirname, '../../../toothlight-v4-active')

loadEnvConfig(envSource)

const testHost = process.env.SITE_AGENT_TEST_HOST || '127.0.0.1'
const testPort = process.env.PORT || '3121'

// `next start` applies production origin policy. Declare and bind the same
// exact loopback origin so protected local tests exercise the real route
// without broadening the public allowlist.
process.env.VERCEL_URL = `${testHost}:${testPort}`

process.argv = [
  process.execPath,
  require.resolve('next/dist/bin/next'),
  'start',
  '--hostname',
  testHost,
  '--port',
  testPort,
]

require('next/dist/bin/next')
