const path = require('node:path')
const { loadEnvConfig } = require('@next/env')

const envSource = process.env.TFN_ENV_SOURCE
  || path.resolve(__dirname, '../../../toothlight-v4-active')

loadEnvConfig(envSource)

process.argv = [
  process.execPath,
  require.resolve('next/dist/bin/next'),
  'start',
  '--port',
  process.env.PORT || '3121',
]

require('next/dist/bin/next')
