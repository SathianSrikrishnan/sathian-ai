export type ReleaseStatus = 'published' | 'next'

export interface SiteRelease {
  id: string
  slug: string
  series: string
  episode: number
  title: string
  shortTitle: string
  description: string
  agentSummary: string
  status: ReleaseStatus
  publishedAt: string | null
  pageHref: string
  image: string
  imageAlt: string
  youtubeVideoId: string | null
  youtubeHref: string | null
  tags: string[]
}

export const DRAW_WITH_TANDA_CHANNEL_HREF = '/projects/tooth-fairy-network/draw-with-tanda'

export const DRAW_WITH_TANDA_EPISODES: SiteRelease[] = [
  {
    id: 'draw-with-tanda-finn-2026-08-08',
    slug: 'finn-the-shark',
    series: 'Draw with Tanda',
    episode: 1,
    title: 'Draw Finn the shark with Tanda',
    shortTitle: 'Finn the shark',
    description: 'A parent-and-child guided drawing lesson about a shark that can replace lost teeth throughout its life.',
    agentSummary: 'The latest public release is Draw Finn the shark with Tanda, the first Draw with Tanda episode from Tooth Fairy Network. Families can watch the guided lesson and draw Finn together.',
    status: 'published',
    publishedAt: '2026-08-08',
    pageHref: `${DRAW_WITH_TANDA_CHANNEL_HREF}#finn-the-shark`,
    image: '/projects/tooth-fairy-network/draw-finn-thumbnail.jpg',
    imageAlt: 'Draw Finn Together episode artwork with Tanda and the finished shark drawing',
    youtubeVideoId: 'ZoY1ZEzJymY',
    youtubeHref: 'https://youtu.be/ZoY1ZEzJymY',
    tags: ['latest-release', 'draw-with-tanda', 'tooth-fairy-network', 'video', 'family'],
  },
  {
    id: 'draw-with-tanda-nori-2026-08-10',
    slug: 'nori-the-narwhal',
    series: 'Draw with Tanda',
    episode: 2,
    title: 'Draw Nori the Narwhal Together | Easy Silhouette Drawing for Kids',
    shortTitle: 'Nori the narwhal',
    description: 'A guided family drawing lesson about Nori and the narwhal tooth that grows into a tusk.',
    agentSummary: 'The latest public release is Draw Nori the Narwhal Together, the second Draw with Tanda episode from Tooth Fairy Network. Families can watch the two-minute guided lesson and draw Nori together.',
    status: 'published',
    publishedAt: '2026-08-10',
    pageHref: `${DRAW_WITH_TANDA_CHANNEL_HREF}#nori-the-narwhal`,
    image: '/projects/tooth-fairy-network/nori-narwhal-next.png',
    imageAlt: 'Tanda presenting Nori the narwhal in an icy storybook drawing world',
    youtubeVideoId: 'D0I_6me_WcU',
    youtubeHref: 'https://youtu.be/D0I_6me_WcU',
    tags: ['latest-release', 'draw-with-tanda', 'tooth-fairy-network', 'video', 'family'],
  },
]

export const LATEST_RELEASE = [...DRAW_WITH_TANDA_EPISODES]
  .filter((release) => release.status === 'published' && release.publishedAt)
  .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))[0] as SiteRelease

export const CLINICAL_GUARD_PROJECT = {
  title: 'ClinicalGuard',
  tagline: 'Five checks. One human decision.',
  description:
    'A five-step LangGraph pipeline that proposes ICD-9 codes, validates them against laboratory and prescription evidence, and sends weak or contradictory matches to a human reviewer.',
  event: 'U of T Healthcare AI Hackathon / March 2026',
  pageHref: '/projects/clinicalguard',
  githubHref: 'https://github.com/SathianSrikrishnan/ClinicalGuard',
  submissionHref: 'https://www.linkedin.com/posts/activity-7437509764399640577-86Rt',
  image: '/projects/clinicalguard-dashboard.png',
  imageAlt: 'ClinicalGuard clinical coding validation dashboard using synthetic patient information',
  pipeline: [
    ['01', 'Parse note', 'Extract diagnoses, symptoms, procedures, and medications with supporting text.'],
    ['02', 'Match codes', 'Compare clinical concepts with a 2,390-code ICD-9 dictionary.'],
    ['03', 'Check labs', 'Test proposed codes against 841,507 de-identified laboratory records.'],
    ['04', 'Check prescriptions', 'Look for medication evidence that supports or weakens each code.'],
    ['05', 'Human review', 'Return confirmed, needs-review, or inconsistent results to a clinical coder.'],
  ],
  stats: [
    ['Admissions', '2,000'],
    ['Assigned diagnoses', '23,428'],
    ['Lab records', '841,507'],
    ['Prescriptions', '153,433'],
  ],
} as const
