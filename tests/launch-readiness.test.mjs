import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const checks = []
const test = (name, fn) => checks.push([name, fn])

test("server-funded card deposits are disabled until payment verification exists", () => {
  const serverDeposit = read("src/app/api/toothfairy/server-deposit/route.ts")
  const onramp = read("src/app/api/toothfairy/onramp/route.ts")

  assert.match(serverDeposit, /Card gifts are not enabled yet/)
  assert.doesNotMatch(serverDeposit, /program\.methods\s*\.\s*deposit/)
  assert.doesNotMatch(serverDeposit, /TFN_MINT_SECRET_KEY/)

  assert.match(onramp, /Card gifts are not enabled yet/)
  assert.doesNotMatch(onramp, /sessionToken/)
  assert.doesNotMatch(onramp, /serverWallet/)
})

test("operational, admin, and email endpoints require internal authorization", () => {
  const guardedRoutes = [
    "src/app/api/toothfairy/health/route.ts",
    "src/app/api/toothfairy/escrow-viewer/route.ts",
    "src/app/api/toothfairy/welcome-email/route.ts",
    "src/app/api/toothfairy/deposit-email/route.ts",
  ]

  for (const route of guardedRoutes) {
    assert.match(read(route), /requireToothFairyAdminRequest/, route)
  }
})

test("homepage does not link to unpublished Japan or Korea story pages", () => {
  const homepage = read("src/app/toothfairy/page.tsx")

  assert.doesNotMatch(homepage, /\/toothfairy\/story\/japan/)
  assert.doesNotMatch(homepage, /\/toothfairy\/story\/korea/)
})

test("homepage uses FAQ nav and a real minted memory preview", () => {
  const homepage = read("src/app/toothfairy/page.tsx")
  const header = read("src/components/toothfairy/nav/tfn-header.tsx")

  assert.match(header, /label:\s*"FAQ"/)
  assert.doesNotMatch(header, /label:\s*"Safety"/)
  assert.match(homepage, /gateway\.irys\.xyz\/Z9_aFKhX6xpU1cZvw0h4u3zfJwhfJ1wiBf72KQWGF5k/)
  assert.match(homepage, /className="real-tooth"/)
  assert.doesNotMatch(homepage, /nft-keepsake-v1\.png/)
})

test("preview page uses the latest real minted memory instead of static sample copy", () => {
  const preview = read("src/app/toothfairy/keepsake/preview/page.tsx")

  assert.match(preview, /_asoyYnN6mYDzOpC_tJ3taAONF_zkM7lFEgQdx7pbnk/)
  assert.match(preview, /F8pf5qkNMkSL5pBdrfk88piukq65MLTjsnYyXYBix62E/)
  assert.match(preview, /Jhonny/)
  assert.doesNotMatch(preview, /This is what Timmy got/)
})

test("gift flow is clear that card gifts are paused", () => {
  const giftPage = read("src/app/toothfairy/app/gift/[milestone]/page.tsx")
  const mintPage = read("src/app/toothfairy/app/page.tsx")

  assert.match(giftPage, /Card gifts are paused/)
  assert.match(mintPage, /Card gifts are paused/)
  assert.doesNotMatch(giftPage, /MoonPay/)
  assert.doesNotMatch(mintPage, /MoonPay/)
})

test("wallet gift receipts are sent only after server-side transaction verification", () => {
  const giftPage = read("src/app/toothfairy/app/gift/[milestone]/page.tsx")
  const receiptRoute = read("src/app/api/toothfairy/gift-receipt/route.ts")

  assert.match(giftPage, /\/api\/toothfairy\/gift-receipt/)
  assert.match(giftPage, /txSignature/)
  assert.doesNotMatch(giftPage, /x-tfn-admin-secret/)
  assert.match(receiptRoute, /isAllowedOrigin/)
  assert.match(receiptRoute, /getParsedTransaction|getTransaction/)
  assert.match(receiptRoute, /program\.account\.deposit\.all/)
  assert.match(receiptRoute, /tfn_children/)
  assert.match(receiptRoute, /renderGiftReceivedEmail/)
  assert.match(receiptRoute, /RESEND_API_KEY/)
  assert.doesNotMatch(receiptRoute, /requireToothFairyAdminRequest/)
})

test("AI polish remains visible unless it is explicitly disabled", () => {
  const drawingCanvas = read("src/components/toothfairy/app/drawing-canvas.tsx")

  assert.match(drawingCanvas, /NEXT_PUBLIC_TFN_ENABLE_AI_ENHANCE/)
  assert.match(drawingCanvas, /!==\s*"false"/)
  assert.match(drawingCanvas, /MAGIC_POLISH_ENABLED &&/)
  assert.match(drawingCanvas, /: "Magic polish"/)
  assert.doesNotMatch(drawingCanvas, /Magic polish \(\$\{enhanceRemaining\}\)/)
})

test("dashboard and recovery are Google-first for returning parents", () => {
  const dashboard = read("src/app/toothfairy/app/dashboard/page.tsx")
  const recover = read("src/app/toothfairy/recover/page.tsx")

  assert.match(dashboard, /Continue with Google/)
  assert.match(dashboard, /\/api\/auth\/google\?next=/)
  assert.match(recover, /Continue with Google/)
  assert.match(recover, /\/api\/auth\/google\?next=/)
})

test("Google auth and mint flow send the core parent emails", () => {
  const googleCallback = read("src/app/api/auth/google/callback/route.ts")
  const authCallback = read("src/app/api/auth/callback/route.ts")
  const mintRoute = read("src/app/api/toothfairy/mint/route.ts")
  const welcomeEmail = read("src/app/api/toothfairy/welcome-email/route.ts")
  const depositEmail = read("src/app/api/toothfairy/deposit-email/route.ts")
  const emailTemplates = read("src/lib/toothfairy/email-templates.ts")

  assert.match(googleCallback, /welcome-email/)
  assert.match(googleCallback, /internalToothFairyHeaders/)
  assert.match(authCallback, /welcome-email/)
  assert.match(mintRoute, /renderMemoryCreatedEmail/)
  assert.match(welcomeEmail, /renderWelcomeEmail/)
  assert.match(depositEmail, /renderGiftReceivedEmail/)
  assert.match(emailTemplates, /renderWelcomeEmail/)
  assert.match(emailTemplates, /renderMemoryCreatedEmail/)
  assert.match(emailTemplates, /renderGiftReceivedEmail/)
  assert.match(emailTemplates, /escapeHtml/)
  assert.match(emailTemplates, /\/toothfairy\/recover/)
  assert.match(emailTemplates, /same Google account/i)
})

test("footer email signup is wired to the subscribe endpoint", () => {
  const footer = read("src/components/toothfairy/nav/tfn-footer.tsx")

  assert.match(footer, /fetch\("\/api\/subscribe"/)
  assert.match(footer, /source:\s*"tfn-footer"/)
})

test("parent-facing copy leads with first forever memory instead of bank language", () => {
  const homepage = read("src/app/toothfairy/page.tsx")
  const footer = read("src/components/toothfairy/nav/tfn-footer.tsx")
  const keepsake = read("src/app/toothfairy/keepsake/[id]/page.tsx")
  const smileFund = read("src/app/toothfairy/smile-fund/page.tsx")

  assert.match(homepage, /first forever memory/)
  assert.match(footer, /first forever memory/)
  assert.match(keepsake, /first forever memory/)
  assert.match(smileFund, /Smile Fund/)
  assert.doesNotMatch(homepage, /digital piggy bank/i)
  assert.doesNotMatch(footer, /digital piggy bank/i)
  assert.doesNotMatch(smileFund, /digital piggy bank/i)
})

test("FAQ explains the Smile Fund as responsibility education without investment advice", () => {
  const faq = read("src/app/toothfairy/faq/page.tsx")
  const smileFund = read("src/app/toothfairy/smile-fund/page.tsx")

  assert.match(faq, /responsibility/)
  assert.match(faq, /saving/)
  assert.match(faq, /investing/)
  assert.match(faq, /self-sovereignty/)
  assert.match(faq, /not investment advice/i)
  assert.match(smileFund, /responsibility/)
  assert.match(smileFund, /self-sovereignty/)
  assert.match(smileFund, /practice portfolio/i)
  assert.match(smileFund, /card gifts are paused/i)
})

test("keepsake data can return stored smile photos", () => {
  const keepsakeData = read("src/lib/toothfairy/keepsake-data.ts")

  assert.match(keepsakeData, /smile_photo_url/)
  assert.doesNotMatch(keepsakeData, /smilePhotoUrl:\s*undefined/)
})

test("claiming a profile keeps the original child profile PDA", () => {
  const claimProfile = read("src/app/api/toothfairy/claim-profile/route.ts")

  assert.match(claimProfile, /child\.child_profile_pda/)
  assert.match(claimProfile, /childProfilePda:\s*childProfilePda\.toBase58\(\)/)
  assert.doesNotMatch(claimProfile, /newProfilePda/)
  assert.doesNotMatch(claimProfile, /newChildWallet/)
})

test("public sitemap and robots use the Tooth Fairy Network domain", () => {
  const sitemap = read("src/app/sitemap.ts")
  const robots = read("src/app/robots.ts")

  assert.match(sitemap, /https:\/\/toothfairy\.network/)
  assert.match(robots, /https:\/\/toothfairy\.network\/sitemap\.xml/)
  assert.doesNotMatch(sitemap, /https:\/\/sathian\.ai/)
  assert.doesNotMatch(robots, /https:\/\/sathian\.ai/)
})

let failures = 0

for (const [name, fn] of checks) {
  try {
    fn()
    console.log(`ok - ${name}`)
  } catch (error) {
    failures += 1
    console.error(`not ok - ${name}`)
    console.error(error.message)
  }
}

if (failures > 0) {
  process.exitCode = 1
}
