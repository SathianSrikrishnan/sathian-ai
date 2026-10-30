import { permanentRedirect } from 'next/navigation'

// The page was renamed to The Village on Oct 30; keep old links (QR, Luma) and their UTM tags working.
export default async function FirstTwentyRedirect({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === 'string') params.set(key, value)
  }
  const query = params.toString()
  permanentRedirect(query ? `/village?${query}` : '/village')
}
