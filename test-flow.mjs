import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

// Navigate to the app (fresh user, no cookies)
await page.goto('http://localhost:3000/toothfairy/app', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'test-step1-setup.png', fullPage: true });
console.log('Step 1 (Setup): Screenshot taken');

const heading = await page.textContent('h2');
console.log('Heading:', heading);

// Fill in child name and DOB
await page.fill('input[type="text"]', 'TestChild');
await page.fill('input[type="date"]', '2020-03-15');
console.log('Filled name and DOB');

// Click Next button
await page.click('button:has-text("Next")');
await page.waitForTimeout(500);
await page.screenshot({ path: 'test-step2-draw.png', fullPage: true });
console.log('Step 2 (Draw): Screenshot taken');

// Click to go to preview (skip drawing)
const previewBtn = page.locator('button:has-text("Make it permanent")');
if (await previewBtn.count() > 0) {
  await previewBtn.click();
} else {
  // Try the other button text
  await page.click('button:has-text("Next")');
}
await page.waitForTimeout(500);
await page.screenshot({ path: 'test-step3-preview.png', fullPage: true });
console.log('Step 3 (Preview): Screenshot taken');

// Check for key UI elements
const googleBtn = await page.locator('button:has-text("Continue with Google")').count();
const saveBtn = await page.locator('button:has-text("Save")').count();
const walletBtn = await page.locator('button:has-text("Connect Wallet")').count();
const phantomBtn = await page.locator('a:has-text("Open in Phantom")').count();

console.log('\n=== FLOW VERIFICATION ===');
console.log('Google sign-in button:', googleBtn > 0 ? 'PRESENT ✓' : 'MISSING ✗');
console.log('Save Keepsake button:', saveBtn > 0 ? 'PRESENT (user is authenticated)' : 'NOT SHOWN (correct for unauthenticated)');
console.log('Connect Wallet button:', walletBtn > 0 ? 'PRESENT ✗ (should not be here)' : 'NOT SHOWN ✓');
console.log('Open in Phantom link:', phantomBtn > 0 ? 'PRESENT ✗ (should not be here)' : 'NOT SHOWN ✓');

// Get all visible text on the preview step
const bodyText = await page.textContent('body');
const hasSignIn = bodyText.includes('Sign in to save');
const hasNoWallet = bodyText.includes('No wallet or crypto knowledge needed');
console.log('Shows "Sign in to save":', hasSignIn ? '✓' : '✗');
console.log('Shows "No wallet needed":', hasNoWallet ? '✓' : '✗');

await browser.close();
console.log('\nDone! Check test-step*.png files');
