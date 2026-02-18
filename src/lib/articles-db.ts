import { supabase, supabaseAdmin } from './supabase'
import type { Article, ArticleTheme } from './articles'

interface ArticleRow {
  id: string
  title: string
  title_highlight: string | null
  slug: string
  date: string
  author: string
  domains: string[]
  description: string
  read_time: string
  body: string
  pull_quotes: string[]
  theme: ArticleTheme
  media: Article['media'] | null
  section_headings: string[] | null
  section_tints: string[] | null
  special_elements: Article['specialElements'] | null
  text_highlights: Article['textHighlights'] | null
  hidden_signal: string | null
  status: 'draft' | 'published'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ArticleWithMeta extends Article {
  id: string
  status: 'draft' | 'published'
  sortOrder: number
  createdAt: string
  updatedAt: string
}

function toArticle(row: ArticleRow): ArticleWithMeta {
  return {
    id: row.id,
    title: row.title,
    titleHighlight: row.title_highlight || undefined,
    slug: row.slug,
    date: row.date,
    author: row.author,
    domains: row.domains,
    description: row.description,
    readTime: row.read_time,
    body: row.body,
    pullQuotes: row.pull_quotes,
    theme: row.theme,
    media: row.media || undefined,
    sectionHeadings: row.section_headings || undefined,
    sectionTints: row.section_tints || undefined,
    specialElements: row.special_elements || undefined,
    textHighlights: row.text_highlights || undefined,
    hiddenSignal: row.hidden_signal || undefined,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toRow(article: Partial<ArticleWithMeta>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (article.title !== undefined) row.title = article.title
  if (article.titleHighlight !== undefined) row.title_highlight = article.titleHighlight || null
  if (article.slug !== undefined) row.slug = article.slug
  if (article.date !== undefined) row.date = article.date
  if (article.author !== undefined) row.author = article.author
  if (article.domains !== undefined) row.domains = article.domains
  if (article.description !== undefined) row.description = article.description
  if (article.readTime !== undefined) row.read_time = article.readTime
  if (article.body !== undefined) row.body = article.body
  if (article.pullQuotes !== undefined) row.pull_quotes = article.pullQuotes
  if (article.theme !== undefined) row.theme = article.theme
  if (article.media !== undefined) row.media = article.media || []
  if (article.sectionHeadings !== undefined) row.section_headings = article.sectionHeadings || []
  if (article.sectionTints !== undefined) row.section_tints = article.sectionTints || []
  if (article.specialElements !== undefined) row.special_elements = article.specialElements || []
  if (article.textHighlights !== undefined) row.text_highlights = article.textHighlights || []
  if (article.hiddenSignal !== undefined) row.hidden_signal = article.hiddenSignal || null
  if (article.status !== undefined) row.status = article.status
  if (article.sortOrder !== undefined) row.sort_order = article.sortOrder
  return row
}

// === PUBLIC (anon client, respects RLS — only published) ===

export async function getPublishedArticles(): Promise<ArticleWithMeta[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }
  return (data as ArticleRow[]).map(toArticle)
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithMeta | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) return null
  return toArticle(data as ArticleRow)
}

// === ADMIN (service_role client, bypasses RLS) ===

export async function getAllArticlesAdmin(): Promise<ArticleWithMeta[]> {
  if (!supabaseAdmin) throw new Error('Admin client only available server-side')
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw new Error(`Error fetching articles: ${error.message}`)
  return (data as ArticleRow[]).map(toArticle)
}

export async function getArticleBySlugAdmin(slug: string): Promise<ArticleWithMeta | null> {
  if (!supabaseAdmin) throw new Error('Admin client only available server-side')
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return toArticle(data as ArticleRow)
}

export async function getArticleByIdAdmin(id: string): Promise<ArticleWithMeta | null> {
  if (!supabaseAdmin) throw new Error('Admin client only available server-side')
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return toArticle(data as ArticleRow)
}

export async function updateArticle(id: string, updates: Partial<ArticleWithMeta>): Promise<ArticleWithMeta> {
  if (!supabaseAdmin) throw new Error('Admin client only available server-side')
  const row = toRow(updates)
  row.updated_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('articles')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Error updating article: ${error.message}`)
  return toArticle(data as ArticleRow)
}

export async function createArticle(article: Partial<ArticleWithMeta>): Promise<ArticleWithMeta> {
  if (!supabaseAdmin) throw new Error('Admin client only available server-side')
  const row = toRow(article)

  const { data, error } = await supabaseAdmin
    .from('articles')
    .insert(row)
    .select()
    .single()

  if (error) throw new Error(`Error creating article: ${error.message}`)
  return toArticle(data as ArticleRow)
}

export async function deleteArticle(id: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Admin client only available server-side')
  const { error } = await supabaseAdmin
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Error deleting article: ${error.message}`)
}

export async function togglePublish(id: string, status: 'draft' | 'published'): Promise<ArticleWithMeta> {
  return updateArticle(id, { status } as Partial<ArticleWithMeta>)
}
