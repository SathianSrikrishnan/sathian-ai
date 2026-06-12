import type { Metadata } from 'next'

import { SathianLegalPage, type LegalSection } from '@/components/legal/SathianLegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy - Sathian AI',
  description:
    'How Sathian AI handles information across its websites, WhatsApp messaging, automations, and product experiments.',
}

const sections: LegalSection[] = [
  {
    title: 'Who this policy covers',
    body: [
      'This policy covers Sathian AI, Sathian AI Consulting, and related product experiments operated from sathian.ai, including Tooth Fairy Network and automation workflows connected to Meta or WhatsApp.',
      'Some projects may also provide project-specific privacy notes. If a project-specific notice is more specific, it applies to that project experience.',
    ],
  },
  {
    title: 'Information we collect',
    body: [
      'We may collect contact details you provide, messages you send, website form submissions, support requests, newsletter signups, basic analytics, and technical information such as browser, device, page, referrer, and security logs.',
      'For Tooth Fairy Network, parents or guardians may choose to provide family memories, uploaded images, written notes, names, email addresses, phone numbers, and other details needed to create, recover, or share a Toothlight.',
    ],
  },
  {
    title: 'WhatsApp and messaging data',
    body: [
      'If you message us through WhatsApp or another connected channel, we may receive and store your phone number, profile name, message contents, message timestamps, delivery status, and related metadata so we can reply, route the request, and improve the service.',
      'WhatsApp and Meta also process messaging information under their own terms and policies. We do not control Meta systems, carrier delivery, or WhatsApp account behavior.',
    ],
  },
  {
    title: 'How we use information',
    body: [
      'We use information to respond to messages, provide requested services, operate websites and automations, improve product flows, detect misuse, keep records, measure marketing performance, and communicate about relevant projects or services.',
      'We may use aggregated or de-identified information to understand product performance, ad funnels, and customer needs.',
    ],
  },
  {
    title: 'Service providers and sharing',
    body: [
      'We use service providers for hosting, databases, analytics, messaging, email, payments, AI features, security, and operational tooling. These may include providers such as Vercel, Supabase, Cloudflare, Meta, WhatsApp, OpenAI, email providers, and payment providers when applicable.',
      'We do not sell personal information. We may share information if required by law, to protect rights and safety, to complete a requested transaction, or with vendors that help operate the service.',
    ],
  },
  {
    title: 'Children and family content',
    body: [
      'Tooth Fairy Network is designed for parent or guardian-led use. Children should not create accounts or submit personal information without a parent or guardian.',
      'Parents and guardians are responsible for deciding what family information, images, names, and notes they provide or share with relatives.',
    ],
  },
  {
    title: 'Retention and deletion',
    body: [
      'We keep information only as long as reasonably needed for the purpose collected, product operation, security, legal obligations, dispute handling, or business records.',
      'You can request deletion or correction by using the Data Deletion page or emailing hi@sathian.ai. Some records may be retained where required for legal, security, payment, or audit reasons.',
    ],
  },
  {
    title: 'Security and international processing',
    body: [
      'We use reasonable technical and organizational safeguards, including restricted access and hosted infrastructure providers. No internet service can be guaranteed completely secure.',
      'Information may be processed in Canada, the United States, or other locations where our providers operate.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <SathianLegalPage
      eyebrow="Privacy Policy"
      title="How Sathian AI handles data."
      intro="This page gives Meta, customers, and site visitors a clear public privacy policy for Sathian AI websites, WhatsApp messaging, automations, and related product experiments."
      sections={sections}
    />
  )
}
