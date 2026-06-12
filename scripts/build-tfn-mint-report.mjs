import fs from "node:fs/promises"
import crypto from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { AnchorProvider, Program } from "@coral-xyz/anchor"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")
const outDir = path.join(root, "artifacts", "tfn-minted-memory-report-2026-06-11")
const assetDir = path.join(outDir, "assets")
const escrowIdl = JSON.parse(
  await fs.readFile(path.join(root, "src", "lib", "toothfairy", "escrow-idl.json"), "utf8"),
)

const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")

function parseEnvFile(content) {
  const env = {}
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const match = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[match[1]] = value
  }
  return env
}

async function loadLocalEnv() {
  const envPath = path.join(root, ".env.local")
  try {
    const parsed = parseEnvFile(await fs.readFile(envPath, "utf8"))
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // Report still works from source-only data.
  }
}

function timeoutSignal(ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}

async function fetchJson(url, ms = 8000) {
  const timeout = timeoutSignal(ms)
  try {
    const res = await fetch(url, { signal: timeout.signal })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    timeout.clear()
  }
}

async function rpc(method, params) {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  if (!rpcUrl) return { ok: false, error: "No RPC URL configured" }
  const timeout = timeoutSignal(12000)
  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: timeout.signal,
      body: JSON.stringify({ jsonrpc: "2.0", id: method, method, params }),
    })
    const json = await res.json()
    if (json.error) return { ok: false, error: json.error.message || String(json.error) }
    return { ok: true, result: json.result }
  } catch (err) {
    return { ok: false, error: err?.message || String(err) }
  } finally {
    timeout.clear()
  }
}

async function withTimeout(promise, ms, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

function safeDate(value) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function getField(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*"([^"]*)"`, "m"))
  return match?.[1] ?? ""
}

async function readHomepageMemories() {
  const filePath = path.join(root, "src", "components", "toothfairy", "home", "tanda-live-ritual-hero.tsx")
  const source = await fs.readFile(filePath, "utf8")
  const start = source.indexOf("const liveMemories = [")
  const end = source.indexOf("] as const;", start)
  if (start === -1 || end === -1) return []
  const listSource = source.slice(start, end)
  const blocks = [...listSource.matchAll(/\{\s*label:[\s\S]*?\n\s*\}/g)].map((m) => m[0])
  return blocks
    .map((block, index) => ({
      key: `homepage-${index + 1}`,
      source: "Homepage hero",
      title: getField(block, "title"),
      story: getField(block, "story"),
      imageUrl: getField(block, "image"),
      alt: getField(block, "alt"),
      href: getField(block, "href"),
      dateLabel: getField(block, "date"),
    }))
    .filter((item) => item.imageUrl)
}

function numberFromAnchor(value) {
  if (value == null) return 0
  if (typeof value === "number") return value
  if (typeof value.toNumber === "function") return value.toNumber()
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function base58Encode(bytes) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  let value = BigInt(0)
  for (const byte of bytes) value = value * BigInt(256) + BigInt(byte)
  let encoded = ""
  while (value > BigInt(0)) {
    const remainder = Number(value % BigInt(58))
    encoded = alphabet[remainder] + encoded
    value /= BigInt(58)
  }
  for (const byte of bytes) {
    if (byte === 0) encoded = "1" + encoded
    else break
  }
  return encoded || "1"
}

function accountDiscriminator(name) {
  return crypto.createHash("sha256").update(`account:${name}`).digest().subarray(0, 8)
}

function prettyToothType(toothType) {
  const key = Object.keys(toothType ?? {})[0] ?? "unknown"
  const map = {
    upperRight: "Upper right tooth",
    upperLeft: "Upper left tooth",
    lowerRight: "Lower right tooth",
    lowerLeft: "Lower left tooth",
    frontUpper: "Upper front tooth",
    frontLower: "Lower front tooth",
    firstTooth: "First tooth",
    unknown: "A little tooth",
  }
  return map[key] || key.replace(/([A-Z])/g, " $1").toLowerCase().trim() || "A little tooth"
}

async function getProgram() {
  const rpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_RPC ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com"
  const connection = new Connection(rpcUrl, "confirmed")
  const dummyWallet = {
    publicKey: Keypair.generate().publicKey,
    signTransaction: async () => {
      throw new Error("Read-only wallet cannot sign")
    },
    signAllTransactions: async () => {
      throw new Error("Read-only wallet cannot sign")
    },
  }
  const provider = new AnchorProvider(connection, dummyWallet, { commitment: "confirmed" })
  return new Program(escrowIdl, provider)
}

async function readMilestones() {
  try {
    const program = await getProgram()
    const milestoneDisc = base58Encode(accountDiscriminator("Milestone"))
    const response = await rpc("getProgramAccounts", [
      PROGRAM_ID.toBase58(),
      {
        encoding: "base64",
        filters: [{ memcmp: { offset: 0, bytes: milestoneDisc } }],
      },
    ])
    if (!response.ok) throw new Error(response.error)

    const milestones = (response.result ?? []).map((item) => {
      const data = Buffer.from(item.account.data[0], "base64")
      return {
        publicKey: new PublicKey(item.pubkey),
        account: program.coder.accounts.decode("milestone", data),
      }
    })

    const childKeys = [
      ...new Set(
        milestones
          .map((item) => item.account.childProfile?.toBase58?.() || String(item.account.childProfile))
          .filter(Boolean),
      ),
    ]
    const childCache = new Map(childKeys.map((key) => [key, null]))
    for (let i = 0; i < childKeys.length; i += 100) {
      const chunk = childKeys.slice(i, i + 100)
      const childResponse = await rpc("getMultipleAccounts", [
        chunk,
        { encoding: "base64" },
      ])
      if (!childResponse.ok) continue
      const values = childResponse.result?.value ?? []
      values.forEach((account, index) => {
        if (!account?.data?.[0]) return
        try {
          const data = Buffer.from(account.data[0], "base64")
          childCache.set(chunk[index], program.coder.accounts.decode("childProfile", data))
        } catch {
          childCache.set(chunk[index], null)
        }
      })
    }

    const rows = []
    for (const item of milestones) {
      const account = item.account
      const childProfileKey = account.childProfile?.toBase58?.() || String(account.childProfile)
      const child = childCache.get(childProfileKey)

      const createdAt = numberFromAnchor(account.createdAt)
      const totalDeposits = numberFromAnchor(account.totalDeposits) / LAMPORTS_PER_SOL
      const metadataUri = account.metadataUri || ""
      const imageUrl = ""

      rows.push({
        key: `milestone-${item.publicKey.toBase58()}`,
        source: "Escrow milestone",
        title:
          `${child?.childName || "Child"} milestone ${account.milestoneIndex ?? ""}`.trim(),
        story: "",
        imageUrl,
        metadataUri,
        href: `/toothfairy/keepsake/${item.publicKey.toBase58()}`,
        milestonePda: item.publicKey.toBase58(),
        childProfilePda: childProfileKey,
        childName: child?.childName || "",
        toothType: prettyToothType(account.toothType),
        mintDate: createdAt ? new Date(createdAt * 1000).toISOString() : "",
        totalDeposits,
        milestoneIndex: account.milestoneIndex ?? "",
      })
    }
    rows.sort((a, b) => String(b.mintDate).localeCompare(String(a.mintDate)))
    return { rows, error: null }
  } catch (err) {
    return { rows: [], error: err?.message || String(err) }
  }
}

function serverPublicKey() {
  const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY
  if (!secretKeyBase64) return null
  try {
    const secretKey = Buffer.from(secretKeyBase64, "base64")
    return Keypair.fromSecretKey(new Uint8Array(secretKey)).publicKey.toBase58()
  } catch {
    return null
  }
}

async function readDasAssets() {
  const creator = serverPublicKey()
  if (!creator) return { rows: [], error: "No server public key available" }

  const calls = [
    ["getAssetsByCreator", { creatorAddress: creator, onlyVerified: true, page: 1, limit: 100 }],
    ["getAssetsByOwner", { ownerAddress: creator, page: 1, limit: 100 }],
    ["getAssetsByAuthority", { authorityAddress: creator, page: 1, limit: 100 }],
  ]

  const byId = new Map()
  const errors = []
  for (const [method, params] of calls) {
    const response = await rpc(method, params)
    if (!response.ok) {
      errors.push(`${method}: ${response.error}`)
      continue
    }
    for (const asset of response.result?.items ?? []) {
      if (!asset?.id) continue
      const current = byId.get(asset.id) || {}
      byId.set(asset.id, { ...current, ...asset, discoveredBy: [...(current.discoveredBy ?? []), method] })
    }
  }

  const rows = [...byId.values()].map((asset) => ({
    key: `das-${asset.id}`,
    source: "DAS asset",
    title: asset.content?.metadata?.name || asset.content?.json_uri || asset.id,
    story: asset.content?.metadata?.description || "",
    imageUrl: asset.content?.links?.image || "",
    metadataUri: asset.content?.json_uri || "",
    assetId: asset.id,
    owner: asset.ownership?.owner || "",
    compressed: Boolean(asset.compression?.compressed),
    discoveredBy: asset.discoveredBy?.join(", ") || "",
  }))

  rows.sort((a, b) => a.title.localeCompare(b.title))
  return { rows, error: errors.length ? errors.join("; ") : null, creator }
}

function extensionFromContentType(contentType) {
  if (contentType?.includes("png")) return ".png"
  if (contentType?.includes("webp")) return ".webp"
  if (contentType?.includes("gif")) return ".gif"
  if (contentType?.includes("svg")) return ".svg"
  return ".jpg"
}

async function downloadImage(url, name) {
  if (!url || !/^https?:\/\//i.test(url)) return ""
  const timeout = timeoutSignal(15000)
  try {
    const res = await fetch(url, { signal: timeout.signal })
    if (!res.ok) return ""
    const contentType = res.headers.get("content-type") || ""
    const ext = extensionFromContentType(contentType)
    const fileName = `${name}${ext}`
    const outputPath = path.join(assetDir, fileName)
    const buffer = Buffer.from(await res.arrayBuffer())
    await fs.writeFile(outputPath, buffer)
    return `assets/${fileName}`
  } catch {
    return ""
  } finally {
    timeout.clear()
  }
}

function dedupeRows(rows) {
  const merged = new Map()
  for (const row of rows) {
    const key = row.metadataUri || row.imageUrl || row.milestonePda || row.assetId || row.key
    const existing = merged.get(key)
    if (!existing) {
      merged.set(key, { ...row, sources: [row.source].filter(Boolean) })
      continue
    }
    merged.set(key, {
      ...existing,
      ...Object.fromEntries(Object.entries(row).filter(([, value]) => value !== "" && value != null)),
      sources: [...new Set([...(existing.sources ?? []), row.source].filter(Boolean))],
    })
  }
  return [...merged.values()]
}

function renderHtml(rows, diagnostics) {
  const cards = rows
    .map((item, index) => {
      const src = item.localImage || item.imageUrl
      const links = [
        item.href ? `<a href="${htmlEscape(item.href)}">Keepsake route</a>` : "",
        item.metadataUri ? `<a href="${htmlEscape(item.metadataUri)}">Metadata</a>` : "",
        item.imageUrl ? `<a href="${htmlEscape(item.imageUrl)}">Image</a>` : "",
        item.assetId ? `<a href="https://solscan.io/token/${htmlEscape(item.assetId)}">Asset</a>` : "",
        item.milestonePda ? `<a href="https://solscan.io/account/${htmlEscape(item.milestonePda)}">Milestone</a>` : "",
      ]
        .filter(Boolean)
        .join("")

      return `
        <article class="card">
          <div class="image">${src ? `<img src="${htmlEscape(src)}" alt="${htmlEscape(item.alt || item.title)}" loading="lazy">` : `<span>No image found</span>`}</div>
          <div class="body">
            <div class="meta"><span>#${index + 1}</span><span>${htmlEscape((item.sources ?? [item.source]).join(" + "))}</span><span>${htmlEscape(safeDate(item.mintDate) || item.dateLabel || "")}</span></div>
            <h2>${htmlEscape(item.title || "Untitled memory")}</h2>
            ${item.childName ? `<p class="child">${htmlEscape(item.childName)}${item.toothType ? ` · ${htmlEscape(item.toothType)}` : ""}</p>` : ""}
            ${item.story ? `<p>${htmlEscape(item.story)}</p>` : ""}
            ${typeof item.totalDeposits === "number" && item.totalDeposits > 0 ? `<p class="deposit">${item.totalDeposits.toFixed(4)} SOL attached</p>` : ""}
            <div class="links">${links}</div>
          </div>
        </article>`
    })
    .join("\n")

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TFN Minted Memory Report</title>
  <style>
    :root { color-scheme: light; --ink:#17213c; --muted:#6c7285; --line:#d9c9a9; --paper:#fffaf0; --gold:#c88a24; --blue:#24477f; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background: #f6efe1; color: var(--ink); }
    header { padding: 44px min(6vw, 64px) 24px; border-bottom: 1px solid var(--line); background: linear-gradient(135deg, #fff9ec, #efe1c6); }
    h1 { margin: 0; font-family: Georgia, serif; font-size: clamp(2.2rem, 5vw, 4.5rem); line-height: .95; letter-spacing: 0; }
    .lede { max-width: 880px; color: #405074; font-size: 1.05rem; line-height: 1.6; }
    .stats { display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; }
    .stats span { border:1px solid var(--line); background:rgba(255,255,255,.55); border-radius:999px; padding:8px 12px; font-weight:800; }
    main { width: min(100% - 32px, 1320px); margin: 28px auto 64px; }
    .notice { margin: 0 0 18px; padding: 14px 16px; border:1px solid var(--line); border-radius:8px; background: rgba(255,255,255,.55); color: var(--muted); }
    .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .card { overflow:hidden; border:1px solid var(--line); border-radius:8px; background: var(--paper); box-shadow: 0 16px 42px rgba(67,49,23,.08); }
    .image { position:relative; display:grid; place-items:center; aspect-ratio: 4 / 3; background:#eadfca; color: var(--muted); }
    .image img { width:100%; height:100%; object-fit:cover; display:block; }
    .body { padding:16px; }
    .meta { display:flex; flex-wrap:wrap; gap:8px; color: var(--gold); font-size:.72rem; font-weight:900; letter-spacing:.06em; text-transform:uppercase; }
    h2 { margin: 10px 0 8px; font-size:1.15rem; line-height:1.2; letter-spacing:0; }
    p { color:#405074; line-height:1.5; margin: 0 0 10px; }
    .child, .deposit { font-weight:800; color:var(--blue); }
    .links { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    .links a { color:var(--blue); border:1px solid rgba(36,71,127,.22); border-radius:999px; padding:6px 9px; text-decoration:none; font-size:.78rem; font-weight:800; }
  </style>
</head>
<body>
  <header>
    <h1>TFN Minted Memory Report</h1>
    <p class="lede">Inventory generated from the current source, the read-only TFN escrow program account scan, and DAS asset lookup when supported by the configured RPC. Secrets are not included.</p>
    <div class="stats">
      <span>${rows.length} unique report rows</span>
      <span>${diagnostics.homepageCount} homepage memories</span>
      <span>${diagnostics.milestoneCount} escrow milestones</span>
      <span>${diagnostics.dasCount} DAS assets</span>
    </div>
  </header>
  <main>
    ${diagnostics.messages.map((message) => `<p class="notice">${htmlEscape(message)}</p>`).join("\n")}
    <section class="grid">${cards}</section>
  </main>
</body>
</html>`
}

function renderMarkdown(rows, diagnostics) {
  const lines = [
    "# TFN Minted Memory Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    `- Unique report rows: ${rows.length}`,
    `- Homepage memories: ${diagnostics.homepageCount}`,
    `- Escrow milestones: ${diagnostics.milestoneCount}`,
    `- DAS assets: ${diagnostics.dasCount}`,
    "",
    ...diagnostics.messages.map((message) => `- Note: ${message}`),
    "",
    "## Memories",
    "",
  ]

  rows.forEach((item, index) => {
    lines.push(`### ${index + 1}. ${item.title || "Untitled memory"}`)
    lines.push("")
    lines.push(`- Source: ${(item.sources ?? [item.source]).join(" + ")}`)
    if (item.childName) lines.push(`- Child: ${item.childName}`)
    if (item.toothType) lines.push(`- Tooth type: ${item.toothType}`)
    if (safeDate(item.mintDate) || item.dateLabel) lines.push(`- Date: ${safeDate(item.mintDate) || item.dateLabel}`)
    if (item.localImage) lines.push(`- Local image: ${item.localImage}`)
    if (item.imageUrl) lines.push(`- Image: ${item.imageUrl}`)
    if (item.metadataUri) lines.push(`- Metadata: ${item.metadataUri}`)
    if (item.href) lines.push(`- Keepsake route: ${item.href}`)
    if (item.milestonePda) lines.push(`- Milestone PDA: ${item.milestonePda}`)
    if (item.assetId) lines.push(`- Asset ID: ${item.assetId}`)
    if (item.story) lines.push(`- Story: ${item.story}`)
    lines.push("")
  })

  return lines.join("\n")
}

async function main() {
  await loadLocalEnv()
  await fs.mkdir(assetDir, { recursive: true })

  const homepage = await readHomepageMemories()
  const milestoneResult = await readMilestones()
  const dasResult = await readDasAssets()

  const rows = dedupeRows([...homepage, ...milestoneResult.rows, ...dasResult.rows])

  for (let index = 0; index < rows.length; index++) {
    rows[index].localImage = await downloadImage(rows[index].imageUrl, `memory-${String(index + 1).padStart(2, "0")}`)
  }

  const diagnostics = {
    homepageCount: homepage.length,
    milestoneCount: milestoneResult.rows.length,
    dasCount: dasResult.rows.length,
    messages: [
      milestoneResult.error ? `Escrow milestone scan failed: ${milestoneResult.error}` : "",
      dasResult.error ? `DAS lookup note: ${dasResult.error}` : "",
      dasResult.creator ? `DAS creator/owner checked: ${dasResult.creator}` : "",
    ].filter(Boolean),
  }

  await fs.writeFile(path.join(outDir, "report-data.json"), JSON.stringify({ diagnostics, rows }, null, 2))
  await fs.writeFile(path.join(outDir, "index.html"), renderHtml(rows, diagnostics))
  await fs.writeFile(path.join(outDir, "report.md"), renderMarkdown(rows, diagnostics))

  console.log(JSON.stringify({ outDir, rows: rows.length, diagnostics }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
