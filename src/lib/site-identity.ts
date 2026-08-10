import { personalSocialLinks } from '@/lib/social-links'

export const SATHIAN_PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://sathian.ai/#sathian',
  name: 'Sathian Srikrishnan',
  alternateName: ['Sathian', 'Sathian S.'],
  url: 'https://sathian.ai',
  image: 'https://sathian.ai/sathian-profile.png',
  jobTitle: 'Agent Manager and Orchestrator',
  homeLocation: {
    '@type': 'Place',
    name: 'Toronto, Ontario, Canada',
  },
  sameAs: personalSocialLinks.map((link) => link.href),
} as const
export const SATHIAN_WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://sathian.ai/#website',
  name: "Sathian's Digital Workshop",
  alternateName: 'sathian.ai',
  url: 'https://sathian.ai',
  publisher: { '@id': SATHIAN_PERSON_SCHEMA['@id'] },
  description:
    'Projects and notes by Sathian Srikrishnan on agents, technology, money, culture, and fatherhood.',
} as const
