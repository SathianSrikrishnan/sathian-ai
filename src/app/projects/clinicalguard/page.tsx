import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { CLINICAL_GUARD_PROJECT } from '@/content/site-releases'

export const metadata: Metadata = {
  title: 'ClinicalGuard | Sathian S.',
  description: 'An evidence-validation pipeline for clinical coding, built at the U of T Healthcare AI Hackathon.',
  openGraph: {
    title: 'ClinicalGuard | Five checks. One human decision.',
    description: CLINICAL_GUARD_PROJECT.description,
    images: [CLINICAL_GUARD_PROJECT.image],
  },
}

export default function ClinicalGuardPage() {
  return (
    <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
      <SiteNav />
      <main>
        <header className="minimal-clinical-hero minimal-container">
          <div className="minimal-clinical-hero__copy">
            <p className="minimal-kicker">{CLINICAL_GUARD_PROJECT.event}</p>
            <h1>ClinicalGuard</h1>
            <h2>{CLINICAL_GUARD_PROJECT.tagline}</h2>
            <p>{CLINICAL_GUARD_PROJECT.description}</p>
            <div className="minimal-record-links">
              <a href={CLINICAL_GUARD_PROJECT.githubHref} target="_blank" rel="noopener noreferrer" className="minimal-button-link">
                Inspect the source
              </a>
              <a href={CLINICAL_GUARD_PROJECT.submissionHref} target="_blank" rel="noopener noreferrer" className="minimal-text-link">
                Read the submission
              </a>
            </div>
          </div>
          <div className="minimal-clinical-hero__visual">
            <Image
              src="/projects/clinicalguard-dashboard.png"
              alt={CLINICAL_GUARD_PROJECT.imageAlt}
              fill
              sizes="(max-width: 760px) 100vw, 58vw"
              priority
            />
          </div>
        </header>

        <section className="minimal-clinical-pipeline minimal-container" aria-labelledby="clinical-pipeline-title">
          <div className="minimal-section-heading minimal-section-heading--stacked">
            <div>
              <p className="minimal-kicker">THE PIPELINE</p>
              <h2 id="clinical-pipeline-title">Evidence before billing.</h2>
            </div>
            <p>The model proposes. The evidence challenges. A human decides.</p>
          </div>
          <ol>
            {CLINICAL_GUARD_PROJECT.pipeline.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="minimal-clinical-proof minimal-container" aria-labelledby="clinical-proof-title">
          <div>
            <p className="minimal-kicker">PUBLIC PROOF</p>
            <h2 id="clinical-proof-title">A hackathon build with inspectable boundaries.</h2>
            <p>
              ClinicalGuard was tested against a de-identified MIMIC-III subset. It does not replace a medical coder or make an autonomous billing decision; it turns each proposed code into an evidence-backed review item.
            </p>
          </div>
          <dl>
            {CLINICAL_GUARD_PROJECT.stats.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="minimal-clinical-footer minimal-container">
          <p>The dashboard image uses synthetic patient details to show the real five-step product logic safely.</p>
          <Link href="/hackathons" className="minimal-text-link">Back to all hackathons</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
