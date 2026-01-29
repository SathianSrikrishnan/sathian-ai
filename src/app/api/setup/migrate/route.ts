import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

const KAI_CONTEXT_PATH = 'C:/Users/sathi/kai/context'

interface ContextEntry {
  category: string
  subcategory: string | null
  title: string
  content: string
  source_file: string
  importance: number
}

/**
 * Read a file safely
 */
function readFile(path: string): string | null {
  try {
    if (!existsSync(path)) return null
    return readFileSync(path, 'utf-8')
  } catch {
    return null
  }
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, filename: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) return match[1]
  return filename.replace('.md', '').replace(/-/g, ' ')
}

/**
 * Determine importance based on file location and content
 */
function determineImportance(path: string, content: string): number {
  // Universal files are highest importance
  if (path.includes('universal')) return 10

  // Biography, goals, preferences are very important
  if (path.includes('biography') || path.includes('goals') || path.includes('preferences')) return 9

  // TELOS and knowledge files
  if (path.includes('TELOS') || path.includes('knowledge')) return 8

  // Tools/fobs are important for capabilities
  if (path.includes('tools/fobs')) return 7

  // Projects and roadmaps
  if (path.includes('projects') || path.includes('roadmap')) return 6

  // Agents
  if (path.includes('agents')) return 5

  // Default
  return 5
}

/**
 * Categorize file based on path
 */
function categorizeFile(path: string): { category: string; subcategory: string | null } {
  const relativePath = path.replace(KAI_CONTEXT_PATH, '').replace(/^[/\\]/, '')

  if (relativePath.startsWith('knowledge')) {
    if (relativePath.includes('TELOS')) return { category: 'knowledge', subcategory: 'telos' }
    if (relativePath.includes('social-media')) return { category: 'knowledge', subcategory: 'social-media' }
    return { category: 'knowledge', subcategory: 'core' }
  }

  if (relativePath.startsWith('tools/fobs')) return { category: 'tools', subcategory: 'fobs' }
  if (relativePath.startsWith('tools')) return { category: 'tools', subcategory: 'commands' }

  if (relativePath.startsWith('agents')) return { category: 'agents', subcategory: null }

  if (relativePath.startsWith('projects')) return { category: 'projects', subcategory: 'planning' }

  if (relativePath.startsWith('roadmap')) return { category: 'roadmap', subcategory: null }

  if (relativePath.startsWith('telos')) return { category: 'telos', subcategory: null }

  if (relativePath.startsWith('substrate')) return { category: 'substrate', subcategory: null }

  if (relativePath.startsWith('storybook')) return { category: 'storybook', subcategory: null }

  if (relativePath.startsWith('fabric-workflows')) return { category: 'workflows', subcategory: 'fabric' }

  if (relativePath.startsWith('writings')) return { category: 'writings', subcategory: null }

  if (relativePath === 'universal.md') return { category: 'universal', subcategory: 'identity' }

  return { category: 'other', subcategory: null }
}

/**
 * Recursively get all markdown files in a directory
 */
function getAllMarkdownFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files

  const items = readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = join(dir, item.name)
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      getAllMarkdownFiles(fullPath, files)
    } else if (item.isFile() && item.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * POST /api/setup/migrate - Migrate kai/context to Supabase
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    errors: [] as string[],
  }

  try {
    // Check if tables exist
    const { error: tableCheck } = await supabaseAdmin
      .from('context')
      .select('id')
      .limit(1)

    if (tableCheck) {
      return NextResponse.json(
        {
          error: 'Database tables not created yet',
          details: tableCheck.message,
          instructions:
            'Run the SQL in scripts/setup-database.sql via Supabase Dashboard SQL Editor first',
        },
        { status: 400 }
      )
    }

    // Get all markdown files
    const files = getAllMarkdownFiles(KAI_CONTEXT_PATH)
    console.log(`[Migrate] Found ${files.length} markdown files`)

    // Process each file
    for (const filePath of files) {
      const content = readFile(filePath)
      if (!content || content.trim().length < 50) {
        results.skipped++
        continue
      }

      const { category, subcategory } = categorizeFile(filePath)
      const title = extractTitle(content, filePath.split(/[/\\]/).pop() || 'Unknown')
      const importance = determineImportance(filePath, content)

      const entry: ContextEntry = {
        category,
        subcategory,
        title,
        content: content.slice(0, 50000), // Limit content size
        source_file: filePath.replace(KAI_CONTEXT_PATH, '').replace(/^[/\\]/, ''),
        importance,
      }

      // Check if already exists
      const { data: existing } = await supabaseAdmin
        .from('context')
        .select('id')
        .eq('source_file', entry.source_file)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabaseAdmin
          .from('context')
          .update({
            content: entry.content,
            title: entry.title,
            importance: entry.importance,
          })
          .eq('source_file', entry.source_file)

        if (error) {
          results.failed++
          results.errors.push(`Update ${entry.source_file}: ${error.message}`)
        } else {
          results.success++
        }
      } else {
        // Insert new
        const { error } = await supabaseAdmin.from('context').insert(entry)

        if (error) {
          results.failed++
          results.errors.push(`Insert ${entry.source_file}: ${error.message}`)
        } else {
          results.success++
        }
      }
    }

    const totalTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      message: `Migration complete in ${totalTime}ms`,
      results,
      totalFiles: files.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/setup/migrate - Check migration status
 */
export async function GET() {
  try {
    const { data, error, count } = await supabaseAdmin
      .from('context')
      .select('category', { count: 'exact' })

    if (error) {
      return NextResponse.json({
        status: 'not_ready',
        message: 'Database tables not yet created',
        instructions:
          'Run the SQL in scripts/setup-database.sql via Supabase Dashboard',
      })
    }

    // Count by category
    const { data: categories } = await supabaseAdmin
      .from('context')
      .select('category')

    const categoryCounts: Record<string, number> = {}
    for (const row of categories || []) {
      categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1
    }

    return NextResponse.json({
      status: 'ready',
      totalRecords: count,
      byCategory: categoryCounts,
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      details: String(error),
    })
  }
}
