import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const approvedAt = new Date().toISOString()
const validFrom = '2026-07-14T00:00:00.000Z'

const cards = [
  {
    slug: 'sathian-public-bio',
    title: 'Sathian in brief',
    body: 'Sathian is a builder, student, and father based in Toronto. He uses writing and code to examine money, culture, memory, and how people adapt to new systems.',
    summary: 'Builder, student, and father in Toronto.',
    tags: ['bio', 'toronto'],
    source_ref: 'https://sathian.ai/',
    source_kind: 'published_page',
  },
  {
    slug: 'tooth-fairy-network',
    title: 'Tooth Fairy Network',
    body: 'Tooth Fairy Network is Sathian’s flagship family-memory project. It grew from drawings, stories, and the moments around a lost tooth, and was built for his own children first.',
    summary: 'A family-memory ritual around the moments of a lost tooth.',
    tags: ['project', 'family-memory', 'building-in-public'],
    source_ref: 'https://sathian.ai/writings/the-gap-between-weeks',
    source_kind: 'published_page',
  },
  {
    slug: 'btc-cultural-atlas',
    title: 'BTC Cultural Atlas',
    body: 'BTC Cultural Atlas maps cultural stories to Bitcoin price numbers, turning figures into a browsable atlas of technology, history, music, sports, and internet culture.',
    summary: 'A cultural map built around Bitcoin price numbers.',
    tags: ['project', 'bitcoin', 'culture'],
    source_ref: 'https://btc.sathian.ai/',
    source_kind: 'published_project',
  },
  {
    slug: 'lex-rooftop-garden',
    title: 'Lex Rooftop Garden',
    body: 'Lex Rooftop Garden is a living Toronto rooftop-garden project that Sathian is documenting as it develops.',
    summary: 'A living rooftop-garden project in Toronto.',
    tags: ['project', 'toronto', 'garden'],
    source_ref: 'https://garden.sathian.ai/',
    source_kind: 'published_project',
  },
  {
    slug: 'the-gap-between-weeks',
    title: 'The Gap Between Weeks',
    body: 'The Gap Between Weeks is the Tooth Fairy Network origin essay. It connects a missed childhood ritual to the failed product versions that clarified what the project was for.',
    summary: 'The origin essay for Tooth Fairy Network.',
    tags: ['writing', 'tooth-fairy-network', 'fatherhood'],
    source_ref: 'https://sathian.ai/writings/the-gap-between-weeks',
    source_kind: 'published_page',
  },
  {
    slug: 'sathian-writing',
    title: 'Writing',
    body: 'Sathian publishes essays and build notes about products, money, culture, memory, technology, and the things he is learning in public.',
    summary: 'Essays and build notes from Sathian.',
    tags: ['writing', 'building-in-public'],
    source_ref: 'https://sathian.ai/writings',
    source_kind: 'published_page',
  },
  {
    slug: 'sathian-ai-practice',
    title: 'AI practice',
    body: 'Sathian builds small, useful AI systems with clear data boundaries, human review, and model choice kept open. The focus is practical capability rather than broad claims.',
    summary: 'Useful AI systems with explicit boundaries and human review.',
    tags: ['ai', 'privacy', 'automation'],
    source_ref: 'https://sathian.ai/#practice',
    source_kind: 'published_page',
  },
  {
    slug: 'site-agent-contact',
    title: 'Contact through the site agent',
    body: 'Visitors may ask the site agent about Sathian’s approved public projects and writing or leave a note. Accepted notes receive an opaque receipt and are routed to Sathian, but the agent is not an emergency or guaranteed real-time channel.',
    summary: 'Ask about public work or leave a receipt-backed note for Sathian.',
    tags: ['contact', 'site-agent'],
    source_ref: 'https://sathian.ai/',
    source_kind: 'published_page',
  },
].map((card) => ({
  ...card,
  visibility: 'public',
  status: 'approved',
  approved_at: approvedAt,
  valid_from: validFrom,
  valid_until: null,
}))

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data, error } = await supabase
  .from('public_memory_cards')
  .upsert(cards, { onConflict: 'slug' })
  .select('slug,status,visibility,source_ref')

if (error) {
  console.error(`Public-memory seed failed: ${error.message}`)
  process.exit(1)
}

console.log(`Seeded ${data?.length ?? 0} reviewed public-memory cards.`)
