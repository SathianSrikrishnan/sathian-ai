import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/memory - Load memories from database
 * Query params:
 *   - category: filter by category
 *   - limit: max results (default 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabaseAdmin
      .from('memory')
      .select('*')
      .order('importance', { ascending: false })
      .order('last_used', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to load memories', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ memories: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load memories', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST /api/memory - Save or update a memory
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, category, importance } = body

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Missing required fields: key, value' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('memory')
      .upsert(
        {
          key,
          value,
          category: category || 'general',
          importance: importance || 5,
          last_used: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save memory', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, memory: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save memory', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/memory - Delete a memory by key
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Missing required param: key' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('memory').delete().eq('key', key)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete memory', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete memory', details: String(error) },
      { status: 500 }
    )
  }
}
