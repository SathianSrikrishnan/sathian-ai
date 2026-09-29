#!/usr/bin/env node
// Put a draft into Studio for Sathian to review. Used by any agent (Claude, Codex, Hermes).
// It can only create or update DRAFTS: it never publishes and never touches a published article.
//
//   node --env-file=.env.local scripts/studio-draft.mjs path/to/draft.md [--dry-run]
//
// draft.md = a small header, then the body (Markdown). Photo slots are lines like
//   [photo: a child's crayon drawing of the Tooth Fairy, full width]
// which show in the Studio editor as "📷 Photo:" placeholders for Sathian to fill.
//
//   ---
//   title: Network effects for a six-year-old
//   description: One line for cards and previews.
//   domains: Tooth Fairy Network, network effects, parenting
//   agent: claude
//   ---
//   Body...

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const [file, flag] = process.argv.slice(2)
if (!file) {
  console.error('Usage: node --env-file=.env.local scripts/studio-draft.mjs draft.md [--dry-run]')
  process.exit(2)
}

const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw)
if (!m) throw new Error('The draft needs a --- header --- with at least a title.')
const head = Object.fromEntries(m[1].split('\n').filter(l => l.includes(':')).map(l => {
  const i = l.indexOf(':')
  return [l.slice(0, i).trim().toLowerCase(), l.slice(i + 1).trim()]
}))
if (!head.title) throw new Error('title is required')

const body = m[2].trim()
  .replace(/^\[photo:\s*(.+?)\]\s*$/gim, (_, what) => `> 📷 **Photo:** ${what}`)
const words = body.split(/\s+/).filter(Boolean).length
const agent = (head.agent || 'agent').toLowerCase()
const slug = (head.slug || head.title).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

const row = {
  title: head.title,
  slug,
  date: new Date().toISOString().slice(0, 10),
  author: 'Sathian',
  domains: (head.domains || '').split(',').map(s => s.trim()).filter(Boolean),
  description: `[${agent} draft] ${head.description || 'Ready for your review.'}`,
  read_time: `${Math.max(1, Math.round(words / 220))} min`,
  body,
  pull_quotes: [],
  theme: { accent: '#2f7d4f', accentGlow: 'rgba(47,125,79,0.25)', background: 'grid', mood: 'contemplative' },
  status: 'draft',
}

if (flag === '--dry-run') {
  console.log(JSON.stringify({ ...row, body: `${body.slice(0, 160)}…`, words }, null, 2))
  process.exit(0)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Run with --env-file=.env.local (needs the Supabase URL and service key).')
const db = createClient(url, key, { auth: { persistSession: false } })

const existing = await db.from('articles').select('id,status').eq('slug', slug).maybeSingle()
if (existing.error) throw existing.error
if (existing.data?.status === 'published') {
  throw new Error(`"${slug}" is already published. Agents never overwrite a published article; use a new title or slug.`)
}
const q = existing.data
  ? db.from('articles').update(row).eq('id', existing.data.id).eq('status', 'draft')
  : db.from('articles').insert(row)
const res = await q.select('id,slug,status').single()
if (res.error) throw res.error
console.log(`${existing.data ? 'Updated' : 'Added'} draft "${row.title}" → https://studio.sathian.ai/studio/${res.data.slug}`)
