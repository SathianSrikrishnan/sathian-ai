const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_URL || ""

/**
 * Resolve a media path. When NEXT_PUBLIC_MEDIA_URL is set (e.g. https://media.sathian.ai),
 * paths are prefixed with the CDN URL. Otherwise falls back to local /public paths.
 */
export const media = (path: string) =>
  MEDIA_BASE ? `${MEDIA_BASE}/${path.replace(/^\//, "")}` : `/${path.replace(/^\//, "")}`
