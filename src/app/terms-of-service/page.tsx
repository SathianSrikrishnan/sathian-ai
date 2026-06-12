import type { Metadata } from 'next'

import { SathianLegalPage, type LegalSection } from '@/components/legal/SathianLegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service - Sathian AI',
  description:
    'Terms for using Sathian AI websites, automations, messaging channels, and controlled product experiments.',
}

const sections: LegalSection[] = [
  {
    title: 'Acceptance',
    body: [
      'By using Sathian AI websites, messaging channels, automations, or product experiments, you agree to these terms. If you are using a project on behalf of a business, you confirm you have authority to do so.',
    ],
  },
  {
    title: 'Services and experiments',
    body: [
      'Sathian AI builds and operates consulting workflows, websites, automations, and product experiments, including Tooth Fairy Network. Some features are in controlled testing and may change, pause, or be removed.',
      'We may use third-party tools for hosting, messaging, analytics, AI processing, payments, and customer support.',
    ],
  },
  {
    title: 'Messaging',
    body: [
      'If you contact us through WhatsApp, email, forms, or social channels, you authorize us to reply through those channels and to store conversation records needed for follow-up and service delivery.',
      'Message delivery, availability, account rules, and platform limits may be controlled by Meta, WhatsApp, carriers, or other third-party platforms.',
    ],
  },
  {
    title: 'Acceptable use',
    body: [
      'You may not misuse the services, attempt unauthorized access, interfere with systems, submit unlawful content, infringe others rights, or use the services to send spam, deceptive messages, or harmful material.',
    ],
  },
  {
    title: 'No professional advice',
    body: [
      'Information provided through these sites and automations is for general business and product purposes. It is not legal, financial, medical, or professional advice.',
    ],
  },
  {
    title: 'Payments and third-party services',
    body: [
      'Where payments, on-ramps, wallets, advertising platforms, or messaging providers are used, their own terms and fees may apply. We are not responsible for third-party outages, policy decisions, or account restrictions.',
    ],
  },
  {
    title: 'Intellectual property',
    body: [
      'Sathian AI and related project names, content, designs, code, workflows, and materials are owned by Sathian AI or its licensors unless otherwise stated. You retain rights to content you submit, but grant us permission to process it to provide the requested service.',
    ],
  },
  {
    title: 'Limits of liability',
    body: [
      'The services are provided as is and as available. To the fullest extent allowed by law, Sathian AI is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost data, or platform interruptions.',
    ],
  },
  {
    title: 'Changes',
    body: [
      'We may update these terms as products, workflows, or legal requirements change. The updated date on this page indicates the latest version.',
    ],
  },
]

export default function TermsOfServicePage() {
  return (
    <SathianLegalPage
      eyebrow="Terms of Service"
      title="Terms for using Sathian AI services."
      intro="These terms cover Sathian AI websites, WhatsApp and social messaging workflows, consulting automations, and controlled product experiments."
      sections={sections}
    />
  )
}
