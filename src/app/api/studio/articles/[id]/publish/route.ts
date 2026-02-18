import { NextRequest, NextResponse } from 'next/server'
import { togglePublish } from '@/lib/articles-db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    if (status !== 'draft' && status !== 'published') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const article = await togglePublish(params.id, status)
    return NextResponse.json(article)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
