import { NextRequest, NextResponse } from 'next/server'
import { getArticleByIdAdmin, updateArticle, deleteArticle } from '@/lib/articles-db'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await getArticleByIdAdmin(params.id)
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
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const article = await updateArticle(params.id, data)
    return NextResponse.json(article)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteArticle(params.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
