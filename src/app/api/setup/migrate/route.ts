import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface ContextEntry {
  category: string
  subcategory: string | null
  title: string
  content: string
  source_file: string
  importance: number
}

/**
 * POST /api/setup/migrate - Import context entries to Supabase
 * Accepts an array of context entries in the request body
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

    // Get entries from request body
    const body = await request.json()
    const entries: ContextEntry[] = body.entries || []

    if (entries.length === 0) {
      return NextResponse.json(
        {
          error: 'No entries provided',
          instructions:
            'Run the local migration script: node scripts/migrate-context.js',
        },
        { status: 400 }
      )
    }

    console.log(`[Migrate] Processing ${entries.length} entries`)

    // Process each entry
    for (const entry of entries) {
      if (!entry.content || entry.content.trim().length < 50) {
        results.skipped++
        continue
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
            content: entry.content.slice(0, 50000),
            title: entry.title,
            importance: entry.importance,
            category: entry.category,
            subcategory: entry.subcategory,
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
        const { error } = await supabaseAdmin.from('context').insert({
          ...entry,
          content: entry.content.slice(0, 50000),
        })

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
      totalEntries: entries.length,
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
    const { error, count } = await supabaseAdmin
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
