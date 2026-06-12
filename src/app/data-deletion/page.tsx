import type { Metadata } from 'next'

import { SathianLegalPage, type LegalSection } from '@/components/legal/SathianLegalPage'

export const metadata: Metadata = {
  title: 'Data Deletion - Sathian AI',
  description:
    'Instructions for requesting deletion of personal data from Sathian AI websites, messaging workflows, and product experiments.',
}

const sections: LegalSection[] = [
  {
    title: 'How to request deletion',
    body: [
      'Email hi@sathian.ai with the subject line "Data deletion request". Include the email address, phone number, WhatsApp number, or project name you used so we can locate the relevant records.',
      'If the request relates to Tooth Fairy Network, include enough detail for a parent or guardian to identify the Toothlight, family account, or support conversation.',
    ],
  },
  {
    title: 'Identity check',
    body: [
      'We may ask you to confirm control of the email address, phone number, or account connected to the request before deleting data. This protects other users from unauthorized deletion requests.',
    ],
  },
  {
    title: 'What we delete',
    body: [
      'When verified, we will delete or anonymize personal information we control, including eligible contact records, lead records, support messages, submitted content, and related profile details.',
      'Some records may be retained where required for legal obligations, payment records, fraud prevention, platform security, backups, or legitimate business records.',
    ],
  },
  {
    title: 'Third-party platforms',
    body: [
      'If your information also exists in Meta, WhatsApp, email providers, payment providers, ad platforms, or other third-party services, you may need to use those services deletion tools as well. We can only delete information under our control.',
    ],
  },
  {
    title: 'Timing',
    body: [
      'We aim to respond to deletion requests within a reasonable period after verification. Complex requests, legal holds, backups, or third-party dependencies may take longer.',
    ],
  },
]

export default function DataDeletionPage() {
  return (
    <SathianLegalPage
      eyebrow="Data Deletion"
      title="Request deletion of your data."
      intro="Use this page as the public deletion instructions URL for Meta and for anyone who wants personal information removed from Sathian AI systems where possible."
      sections={sections}
    />
  )
}
