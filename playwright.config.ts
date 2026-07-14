import { defineConfig, devices } from 'playwright/test';

/**
 * Playwright config for TFN E2E mobile regression tests.
 *
 * Runs the full story → keepsake happy path on mobile Safari (webkit iPhone 13)
 * and mobile Chrome (chromium Pixel 5). Relies on NEXT_PUBLIC_TEST_MODE=true
 * which stubs the mint + keepsake API routes and bypasses Supabase auth in
 * the app page — so no real Solana / Arweave / Supabase calls happen.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    // Cross-platform: cross-env-style inline isn't available, so we set the
    // env both via Playwright's webServer.env (passed to the child process)
    // and ALSO via process.env.NEXT_PUBLIC_TEST_MODE so Next.js bundles the
    // value into the client during dev compilation.
    command: 'npm run dev',
    url: 'http://localhost:3000',
    env: {
      NEXT_PUBLIC_TEST_MODE: 'true',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA',
      // Next inlines NEXT_PUBLIC_* at compile time — make absolutely sure it's
      // present in the child process env when bundling happens.
      NODE_ENV: process.env.NODE_ENV ?? 'development',
    },
    timeout: 180_000,
    // Force a fresh dev server so the test-mode env var is guaranteed to be
    // bundled into the client. Reusing a stale server compiled without the
    // var leaves the auth bypass dead on the page.
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
