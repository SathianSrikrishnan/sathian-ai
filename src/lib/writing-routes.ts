// Dedicated App Router pages must not also be emitted by /writings/[slug].
// Duplicate prerender paths can make the generic article replace the feature page.
const DEDICATED_WRITING_SLUGS = new Set(['inside-monkedao'])

export function genericWritingParams(articles: readonly { slug: string }[]) {
  return articles.filter(({ slug }) => !DEDICATED_WRITING_SLUGS.has(slug)).map(({ slug }) => ({ slug }))
}
