import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"

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
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")

  assert.doesNotMatch(homepage, /\/toothfairy\/story\/japan/)
  assert.doesNotMatch(homepage, /\/toothfairy\/story\/korea/)
})

test("homepage keeps the top nav simple and uses the approved hero assets", () => {
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")
  const header = read("src/components/toothfairy/nav/tfn-header.tsx")
  const footer = read("src/components/toothfairy/nav/tfn-footer.tsx")

  assert.match(header, /label:\s*"How it works"/)
  assert.match(header, /label:\s*"Stories"/)
  assert.doesNotMatch(header, /label:\s*"Safety"/)
  assert.doesNotMatch(header, /brand-kicker/)
  assert.doesNotMatch(header, /Storybook Toothlights|Time Capsule Network/)
  assert.match(header, /Solana-backed/)
  assert.match(homepage, /\/toothlight\/start\?from=home/)
  assert.match(header, /\/toothlight\/start\?from=nav/)
  assert.match(footer, /\/toothlight\/start\?from=footer/)
  assert.match(footer, /\/toothfairy\/privacy/)
  assert.match(footer, /\/toothfairy\/terms/)
  assert.match(footer, /\/toothfairy\/support/)
  assert.doesNotMatch(homepage, /\/toothfairy\/app\?from=home/)
  assert.doesNotMatch(header, /\/toothfairy\/app\?from=nav/)
  assert.doesNotMatch(footer, /\/toothfairy\/app\?from=footer/)
  assert.match(homepage, /hero-family-v1-no-spark\.png/)
  assert.match(homepage, /toothlight-keepsake-current\.jpg/)
  assert.match(homepage, /className=\{styles\.memoryArt\}/)
  assert.match(homepage, /toothlightGalleryMemories/)
  assert.match(homepage, /liveMemories\.map/)
  assert.doesNotMatch(homepage, /\[\.\.\.liveMemories,\s*\.\.\.liveMemories\]/)
  assert.match(homepage, /Toothlight memory preview/)
  assert.doesNotMatch(homepage, /href=\{memory\.href\}/)
  assert.match(read("src/data/toothfairy/toothlight-gallery.ts"), /toothlight-28-sia-s-tooth-3\.png/)
  assert.match(homepage, /Toothlight time capsules/)
  assert.match(homepage, /Toothlight gallery/)
  assert.doesNotMatch(homepage, /sampleToothlights/)
  assert.doesNotMatch(homepage, /Sample Toothlight studies/)
  assert.doesNotMatch(homepage, /Procedural samples/)
  assert.match(homepage, /smile-dashboard-v1\.png/)
  assert.match(homepage, /invite-family-v1\.png/)
  assert.match(homepage, /watch-grow-v1\.png/)
})

test("procedural sample Toothlights are archived but not visible on launch pages", () => {
  const sampleData = read("src/data/toothfairy/sample-toothlights.ts")
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")
  const stories = read("src/app/toothfairy/stories/page.tsx")
  const dataIndex = read("src/data/toothfairy/index.ts")
  const sampleFiles = readdirSync(new URL("../public/toothfairy/sample-toothlights", import.meta.url))
    .filter((file) => file.endsWith(".svg"))

  assert.equal(sampleFiles.length, 50)
  assert.match(sampleData, /sample-toothlight-050/)
  assert.match(sampleData, /"label": "Sample Toothlight"/)
  assert.match(sampleData, /"seed": 41000/)
  assert.match(read("public/toothfairy/sample-toothlights/sample-toothlight-001.svg"), /SAMPLE TOOTHLIGHT - PROCEDURAL/)
  assert.doesNotMatch(dataIndex, /sample-toothlights/)
  assert.doesNotMatch(homepage, /Sample TL-S|sampleToothlights|sampleStudies/)
  assert.doesNotMatch(stories, /sampleToothlights|storySampleCards|These procedural samples are not live mints/)
})

test("public gallery avoids full family names and obvious test labels", () => {
  const gallery = read("src/data/toothfairy/toothlight-gallery.ts")

  assert.match(gallery, /Sia S\.'s Toothlight/)
  assert.match(gallery, /Rowan S\.'s Toothlight/)
  assert.match(gallery, /Isa S\.'s Toothlight/)
  assert.doesNotMatch(gallery, /Srikrishnan's Toothlight/)
  assert.doesNotMatch(gallery, /Srikrishnan's upper/)
  assert.doesNotMatch(gallery, /Baby Sath's Toothlight/)
  assert.doesNotMatch(gallery, /Michael Jordan's Toothlight/)
  assert.doesNotMatch(gallery, /Peter Miller's Toothlight/)
  assert.doesNotMatch(gallery, /Kate Ferreira's Toothlight/)
  assert.doesNotMatch(gallery, /Roberto Alomar's Toothlight/)
  assert.doesNotMatch(gallery, /Apr7again|April 6th test|FinalTest/)
  assert.doesNotMatch(gallery, /michael-jordan|peter-miller|kate-ferreira|roberto-alomar|apr7again|finaltest|srikrishnan|baby-sath|maggie-simpson/i)
})

test("public Solana Actions discovery is paused for parent acquisition launch", () => {
  const actions = read("public/actions.json")
  const depositAction = read("src/app/api/toothfairy/actions/deposit/route.ts")

  assert.match(actions, /"rules":\s*\[\]/)
  assert.match(depositAction, /NEXT_PUBLIC_TFN_ENABLE_BLINKS/)
  assert.match(depositAction, /Solana Actions are paused during controlled launch/)
})

test("draw polish preview can never block the mint path", () => {
  const preview = read("src/app/toothfairy/app/draw/preview/page.tsx")

  assert.match(preview, /Use original drawing/)
  assert.match(preview, /localStorage\.setItem\(FINAL_DRAWING_KEY,\s*drawing\)/)
  assert.match(preview, /localStorage\.setItem\(\s*FLOW_STORAGE_KEY/)
  assert.match(preview, /router\.push\('\/toothfairy\/app'\)/)
})

test("preview page uses the current real-memory sample instead of static Timmy copy", () => {
  const preview = read("src/app/toothfairy/keepsake/preview/page.tsx")

  assert.match(preview, /D2KhUfrDSs6ejGcfNEXfaYQMxPz4SH5Rd87h9ZUsGMSa/)
  assert.match(preview, /5MqKjoYrB96GubwaIZ48NqUGvvstgyVGsNHgsnRDe1s/)
  assert.match(preview, /William Wallace/)
  assert.match(preview, /robot dog/i)
  assert.match(preview, /Example locked Smile Fund gift/i)
  assert.match(preview, /0\.05 SOL/)
  assert.doesNotMatch(preview, /This is what Timmy got/)
  assert.doesNotMatch(preview, /The page should not feel like an NFT pitch/)
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

test("AI polish preserves parent-drawn marks over the provider image", () => {
  const drawingCanvas = read("src/components/toothfairy/app/drawing-canvas.tsx")
  const overlayHelper = read("src/lib/toothfairy/canvas-overlay.ts")

  assert.match(overlayHelper, /createChangedPixelOverlay/)
  assert.match(overlayHelper, /overlay\.data\[i \+ 3\] = 0/)
  assert.match(drawingCanvas, /baseCanvasSnapshotRef/)
  assert.match(drawingCanvas, /createChangedPixelOverlay/)
  assert.match(drawingCanvas, /manualOverlay/)
  assert.match(drawingCanvas, /ctx\.drawImage\(manualOverlay/)
})

test("dashboard and recovery are Google-first for returning parents", () => {
  const dashboard = read("src/app/toothfairy/app/dashboard/page.tsx")
  const recover = read("src/app/toothfairy/recover/page.tsx")
  const walletRecover = read("src/app/toothfairy/app/recover/page.tsx")

  assert.match(dashboard, /Continue with Google/)
  assert.match(dashboard, /\/api\/auth\/google\?next=/)
  assert.match(recover, /Continue with Google/)
  assert.match(recover, /\/api\/auth\/google\?next=/)
  assert.match(recover, /same Google account/i)
  assert.match(walletRecover, /same Google account/i)
  assert.match(walletRecover, /No memories found/i)
  assert.doesNotMatch(recover, /Find keepsakes/)
  assert.doesNotMatch(walletRecover, /keepsake/i)
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
  assert.match(emailTemplates, /Share the memory first/i)
  assert.match(emailTemplates, /gift receipt/i)
  assert.match(emailTemplates, /not investment advice/i)
  assert.doesNotMatch(emailTemplates, /payment path is ready/i)
})

test("footer email signup is wired to the subscribe endpoint", () => {
  const footer = read("src/components/toothfairy/nav/tfn-footer.tsx")

  assert.match(footer, /fetch\("\/api\/subscribe"/)
  assert.match(footer, /source:\s*"tfn-footer"/)
})

test("stories route uses the story-world gateway instead of the old globe page", () => {
  const stories = read("src/app/toothfairy/stories/page.tsx")
  const storiesLayout = read("src/app/toothfairy/stories/layout.tsx")
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")

  assert.match(homepage, /href="\/toothfairy\/stories"/)
  assert.match(storiesLayout, /Stories from Around the World/)
  assert.match(stories, /story-world-gateway-v1\.png/)
  assert.match(stories, /Join Tanda and the Keepers/)
  assert.match(stories, /toothlightGalleryMemories/)
  assert.match(stories, /toothlight-proof-layer/)
  assert.match(stories, /lore-flight-layer/)
  assert.match(stories, /Kkachi listens/)
  assert.match(stories, /Perez hurries/)
  assert.match(stories, /Real childhood moments become the light in each story/)
  assert.match(stories, /Open traditions/)
  assert.match(stories, /Start with Tanda, then follow each local promise/)
  assert.match(stories, /Wider world/)
  assert.match(stories, /openKeeperDoors/)
  assert.match(stories, /story-06-daga-site-portrait\.png/)
  assert.doesNotMatch(stories, /char-daga\.png/)
  assert.doesNotMatch(stories, /TfnGlobe/)
  assert.doesNotMatch(stories, /PhotoBorder/)
  assert.doesNotMatch(stories, /FEATURED_STORIES/)
})

test("parent-facing copy keeps the approved Toothlight spine", () => {
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")
  const footer = read("src/components/toothfairy/nav/tfn-footer.tsx")
  const keepsake = read("src/app/toothfairy/keepsake/[id]/page.tsx")
  const smileFund = read("src/app/toothfairy/smile-fund/page.tsx")

  assert.match(homepage, /Turn a lost tooth/)
  assert.match(homepage, /into a future asset/)
  assert.match(homepage, /A Toothlight keeps the photo, story, note, and gift together/)
  assert.match(homepage, /Four small steps/)
  assert.match(homepage, /toward their 10th birthday/)
  assert.match(homepage, /Time-lock your note and gift/)
  assert.match(homepage, /Invite their circle/)
  assert.match(homepage, /Help them grow into it/)
  assert.match(homepage, /Toothlight time capsules/)
  assert.match(homepage, /Tooth Fairy Moments saved for the Future/)
  assert.match(footer, /A Toothlight for every lost tooth/)
  assert.match(smileFund, /Smile Fund/)
  assert.doesNotMatch(homepage, /digital piggy bank/i)
  assert.doesNotMatch(footer, /digital piggy bank/i)
  assert.doesNotMatch(keepsake, /digital piggy bank/i)
  assert.doesNotMatch(smileFund, /digital piggy bank/i)
})

test("FAQ explains the Smile Fund as responsibility education without investment advice", () => {
  const faq = read("src/app/toothfairy/faq/page.tsx")
  const smileFund = read("src/app/toothfairy/smile-fund/page.tsx")

  assert.match(faq, /responsibility/)
  assert.match(faq, /saving/)
  assert.match(faq, /investment/)
  assert.match(faq, /digital ownership/)
  assert.match(faq, /not investment advice/i)
  assert.match(faq, /AI polish/i)
  assert.match(faq, /gift receipt/i)
  assert.match(faq, /same Google account/i)
  assert.match(faq, /Card gifts are paused/i)
  assert.match(faq, /not a bank/i)
  assert.doesNotMatch(faq, /email receipts, support language/)
  assert.match(smileFund, /responsibility/)
  assert.match(smileFund, /ownership/)
  assert.match(smileFund, /small fund/i)
  assert.match(smileFund, /locked gift/i)
  assert.match(smileFund, /Small Savings Add Up to Big Money/)
  assert.match(smileFund, /Young children and saving/)
  assert.match(smileFund, /card gifts are paused/i)
})

test("launch trust pages exist for paid parent traffic", () => {
  const privacy = read("src/app/toothfairy/privacy/page.tsx")
  const terms = read("src/app/toothfairy/terms/page.tsx")
  const support = read("src/app/toothfairy/support/page.tsx")
  const learn = read("src/app/toothlight/learn/page.tsx")

  assert.match(privacy, /Parent control/)
  assert.match(privacy, /AI polish is optional/)
  assert.match(privacy, /Solana is the ownership layer/)
  assert.match(terms, /Card gifts are paused/)
  assert.match(terms, /Wallet-based gifts and Solana actions are for controlled testing/)
  assert.match(support, /support@toothfairy\.network/)
  assert.match(learn, /Learning track/)
  assert.match(learn, /age 10/i)
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

test("draft animation work is excluded from local Vercel deploy packages", () => {
  const vercelIgnore = read(".vercelignore")

  assert.match(vercelIgnore, /src\/app\/animation\/tanda-hero-ritual\//)
  assert.match(vercelIgnore, /src\/remotion\/TandaRitualHero\.tsx/)
  assert.match(vercelIgnore, /docs\/plans\//)
  assert.doesNotMatch(vercelIgnore, /src\/components\/toothfairy\/home\//)
  assert.doesNotMatch(vercelIgnore, /public\/toothfairy\/visual-system\//)
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
