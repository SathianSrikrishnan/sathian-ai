import { defineConfig, devices } from 'playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: ['studio-auth-flow.spec.ts', 'studio-control-room.spec.ts'],
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
    {
      name: 'Studio Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: [
    {
      command: 'node tests/fixtures/studio-auth-server.mjs',
      url: 'http://localhost:54321/health',
      timeout: 30_000,
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev -- --port 3122',
      url: 'http://localhost:3122/studio/login',
      env: {
        NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'studio-test-anon-key',
        STUDIO_ALLOWED_EMAILS: 'operator@example.com',
        STUDIO_PUBLIC_ORIGIN: 'http://localhost:3122',
      },
      timeout: 180_000,
      reuseExistingServer: false,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
})
