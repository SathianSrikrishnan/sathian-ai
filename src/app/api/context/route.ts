import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/context - Load context from database
 * Query params:
 *   - category: filter by category
 *   - topic: search by topic (text search)
 *   - importance: minimum importance level (1-10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const topic = searchParams.get('topic')
    const minImportance = parseInt(searchParams.get('importance') || '0')

    let query = supabaseAdmin
      .from('context')
      .select('*')
      .order('importance', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (minImportance > 0) {
      query = query.gte('importance', minImportance)
    }

    if (topic) {
      query = query.textSearch('content', topic, { type: 'websearch' })
    }

    const { data, error } = await query.limit(20)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to load context', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ context: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load context', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST /api/context - Add new context to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, subcategory, title, content, source_file, importance } = body

    if (!category || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: category, title, content' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('context')
      .insert({
        category,
        subcategory,
        title,
        content,
        source_file,
        importance: importance || 5,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save context', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, context: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save context', details: String(error) },
      { status: 500 }
    )
  }
}
