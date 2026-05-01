"use client"

import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { href: "/toothfairy#how-it-works", label: "How It Works" },
      { href: "/toothfairy/app", label: "Mint Keepsake" },
      { href: "/toothfairy/app/dashboard", label: "Smile Fund" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/toothfairy/stories", label: "Cultural Tales" },
      { href: "/toothfairy/story/tanda", label: "Meet Tanda" },
      { href: "/toothfairy/network", label: "The Network" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/toothfairy/network/about", label: "About" },
      { href: "/toothfairy/architecture", label: "Security" },
      { href: "/toothfairy/app/recover", label: "Recover" },
    ],
  },
]

export function TFNFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="tfn-footer">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.1fr_1.5fr_0.9fr]">
        <div>
          <Link href="/toothfairy" className="footer-brand">
            <span className="footer-logo" aria-hidden>
              T
            </span>
            <span>toothfairy.network</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6" style={{ color: "var(--tfn-ink-soft)" }}>
            Where tooth fairy magic meets family savings, story, and early digital ownership.
          </p>
          <p className="mt-6 text-xs" style={{ color: "var(--tfn-ink-muted)" }}>
            Built on Solana. Parent-controlled for launch.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="footer-heading">{column.title}</h3>
              <div className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-note">
          <p className="text-sm font-extrabold" style={{ color: "var(--tfn-ink)" }}>
            Ready for the first memory?
          </p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--tfn-ink-soft)" }}>
            Start with one tooth, one story, and one small lesson in how value can grow.
          </p>
          <Link href="/toothfairy/app" className="footer-cta">
            Mint a memory
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Copyright {year} Tooth Fairy Network.</span>
          <span>Privacy, terms, and fee disclosures to be finalized before broad launch.</span>
        </div>
      </div>

      <style jsx>{`
        .tfn-footer {
          border-top: 1px solid var(--tfn-border);
          background:
            radial-gradient(circle at 86% 10%, oklch(72% 0.145 75 / 0.12), transparent 20rem),
            var(--tfn-surface-alt);
          color: var(--tfn-ink-muted);
          font-family: var(--font-body), "Alegreya Sans", system-ui, sans-serif;
        }

        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          color: var(--tfn-ink);
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-size: 1.45rem;
          font-weight: 900;
          text-decoration: none;
        }

        .footer-logo {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border: 2px solid #6d45a8;
          border-radius: 999px;
          color: #6d45a8;
          background: #fffaf1;
          font-size: 1rem;
        }

        .footer-heading {
          color: var(--tfn-ink);
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer-link {
          color: var(--tfn-ink-soft);
          font-size: 0.92rem;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .footer-link:hover {
          color: #6d45a8;
        }

        .footer-note {
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
          background: oklch(100% 0 0 / 0.45);
          padding: 1rem;
        }

        .footer-cta {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          border-radius: 999px;
          padding: 0 1.1rem;
          background: linear-gradient(135deg, #6d45a8, #8a5cc5);
          color: #fffaf1;
          font-size: 0.9rem;
          font-weight: 900;
          text-decoration: none;
        }

        .footer-bottom {
          border-top: 1px solid var(--tfn-border);
          color: var(--tfn-ink-muted);
        }
      `}</style>
    </footer>
  )
}
