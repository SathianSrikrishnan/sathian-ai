import { defineConfig, devices } from 'playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: 'studio-auth-flow.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:3122',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Studio Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 3122',
    url: 'http://localhost:3122/studio/login',
    timeout: 180_000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
