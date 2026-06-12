import Link from 'next/link'

export type LegalSection = {
  title: string
  body: string[]
}

type SathianLegalPageProps = {
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
  updatedAt?: string
}

export function SathianLegalPage({
  eyebrow,
  title,
  intro,
  sections,
  updatedAt = 'June 12, 2026',
}: SathianLegalPageProps) {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <p className="legal-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        <p className="legal-updated">Last updated: {updatedAt}</p>
      </section>

      <section className="legal-content" aria-label={title}>
        {sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>

      <section className="legal-contact" aria-label="Contact">
        <h2>Contact</h2>
        <p>
          Questions or requests can be sent to{' '}
          <a href="mailto:hi@sathian.ai">hi@sathian.ai</a>.
        </p>
        <div className="legal-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/data-deletion">Data Deletion</Link>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .legal-page {
          min-height: 100vh;
          background: #080b12;
          color: #f5f7fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .legal-hero,
        .legal-content,
        .legal-contact {
          width: min(100% - 40px, 980px);
          margin: 0 auto;
        }
        .legal-hero {
          padding: 84px 0 34px;
        }
        .legal-eyebrow,
        .legal-updated {
          color: #9aa7bd;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .legal-updated {
          margin-top: 1rem;
          letter-spacing: 0;
          text-transform: none;
        }
        h1,
        h2,
        p {
          margin: 0;
        }
        h1 {
          max-width: 820px;
          margin-top: 0.7rem;
          font-size: clamp(2.5rem, 7vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: 0;
        }
        .legal-hero > p:not(.legal-eyebrow):not(.legal-updated) {
          max-width: 760px;
          margin-top: 1.25rem;
          color: #cbd5e1;
          font-size: 1.08rem;
          line-height: 1.7;
        }
        .legal-content {
          display: grid;
          gap: 1rem;
          padding: 20px 0 28px;
        }
        article,
        .legal-contact {
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.72);
          padding: 1.2rem;
        }
        article h2,
        .legal-contact h2 {
          color: #ffffff;
          font-size: 1.25rem;
          line-height: 1.2;
        }
        article p,
        .legal-contact p {
          margin-top: 0.75rem;
          color: #cbd5e1;
          font-size: 0.98rem;
          line-height: 1.65;
        }
        a {
          color: #7dd3fc;
        }
        .legal-contact {
          margin-bottom: 72px;
        }
        .legal-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1rem;
        }
        .legal-links a {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          border: 1px solid rgba(125, 211, 252, 0.24);
          border-radius: 999px;
          padding: 0 1rem;
          color: #e0f2fe;
          text-decoration: none;
        }
        @media (min-width: 780px) {
          .legal-content {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .legal-content article:first-child,
          .legal-content article:last-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 640px) {
          .legal-hero,
          .legal-content,
          .legal-contact {
            width: min(100% - 28px, 980px);
          }
        }
      `,
        }}
      />
    </main>
  )
}
