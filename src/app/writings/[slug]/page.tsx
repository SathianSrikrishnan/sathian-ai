'use client'

import { useParams, useRouter } from 'next/navigation'
import { getArticle } from '@/lib/articles'

function renderBody(body: string) {
  const sections = body.split('\n---\n')
  return sections.map((section, i) => {
    const paragraphs = section.trim().split('\n\n')
    return (
      <div key={i}>
        {i > 0 && (
          <div className="my-12 flex justify-center">
            <div className="w-16 h-px bg-gray-700" />
          </div>
        )}
        {paragraphs.map((p, j) => {
          // Handle italic text with asterisks
          const parts = p.split(/(\*[^*]+\*)/g)
          return (
            <p key={j} className="mb-6 leading-relaxed">
              {parts.map((part, k) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  return <em key={k} className="text-gray-300">{part.slice(1, -1)}</em>
                }
                return <span key={k}>{part}</span>
              })}
            </p>
          )
        })}
      </div>
    )
  })
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const article = getArticle(slug)

  if (!article) {
    return (
      <main className="min-h-screen bg-[#0D1117] text-[#F0F6FC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Article not found.</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Back to chat
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-mono"
          >
            sathian.ai
          </button>
          <span className="text-gray-600 text-sm font-mono">{article.date}</span>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-6 py-16">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#F0F6FC] mb-4 font-serif leading-tight">
          {article.title}
        </h1>

        {/* Domains */}
        <div className="flex flex-wrap gap-2 mb-12">
          {article.domains.map((domain, i) => (
            <span key={i} className="text-xs font-mono text-gray-500 border border-gray-800 rounded-full px-3 py-1">
              {domain}
            </span>
          ))}
        </div>

        {/* Body */}
        <div className="text-lg text-[#C9D1D9] font-body">
          {renderBody(article.body)}
        </div>

        {/* Media placeholders */}
        {article.media && article.media.some(m => m.placeholder) && (
          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-600 font-mono mb-4">Media (coming soon)</p>
            <div className="space-y-3">
              {article.media.map((m, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-500">
                  {m.alt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden signal easter egg */}
        {article.hiddenSignal && (
          <div className="mt-16 pt-8 border-t border-gray-800">
            <details className="text-sm">
              <summary className="text-gray-600 cursor-pointer hover:text-gray-400 transition-colors font-mono">
                Hidden Signal
              </summary>
              <p className="mt-3 text-gray-500 italic">{article.hiddenSignal}</p>
            </details>
          </div>
        )}

        {/* Back to chat */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            Back to conversation
          </button>
        </div>
      </article>
    </main>
  )
}
