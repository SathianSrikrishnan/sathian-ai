import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAdmin, getArticleBySlugAdmin, createArticle, PublishGateError } from '@/lib/articles-db'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    const slug = request.nextUrl.searchParams.get('slug')
    if (slug) {
      const article = await getArticleBySlugAdmin(slug)
      if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(article)
    }
    const articles = await getAllArticlesAdmin()
    return NextResponse.json(articles)
  } catch (err) {
    if (err instanceof PublishGateError) return NextResponse.json({ error: err.message, gate: err.gate }, { status: 422 })
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    const data = await request.json()
    const article = await createArticle(data)
    return NextResponse.json(article, { status: 201 })
  } catch (err) {
    if (err instanceof PublishGateError) return NextResponse.json({ error: err.message, gate: err.gate }, { status: 422 })
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
