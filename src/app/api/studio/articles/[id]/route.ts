import { NextRequest, NextResponse } from 'next/server'
import { getArticleByIdAdmin, updateArticle, deleteArticle } from '@/lib/articles-db'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    const article = await getArticleByIdAdmin((await params).id)
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(article)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    const data = await request.json()
    const article = await updateArticle((await params).id, data)
    return NextResponse.json(article)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    await deleteArticle((await params).id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
