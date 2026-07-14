import { defineConfig, devices } from 'playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://127.0.0.1:3121',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'Agent desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'Agent mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'node tests/browser/run-agent-dev-with-env.cjs',
    url: 'http://127.0.0.1:3121',
    env: {
      NODE_ENV: 'production',
      PORT: '3121',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA',
    },
    timeout: 180_000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
