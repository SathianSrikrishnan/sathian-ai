"use client"

import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { href: "/toothfairy#how-it-works", label: "How It Works" },
      { href: "/toothfairy/app", label: "Mint Keepsake" },
      { href: "/toothfairy/keepsake/preview", label: "Keepsake Preview" },
      { href: "/toothfairy/app/dashboard", label: "Family Dashboard" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/toothfairy/stories", label: "Cultural Tales" },
      { href: "/toothfairy/story/tanda", label: "Meet Tanda" },
      { href: "/toothfairy/network", label: "The Network" },
      { href: "/toothfairy/faq", label: "Parent FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/toothfairy/about", label: "About" },
      { href: "/toothfairy/company", label: "Company" },
      { href: "/toothfairy/faq", label: "FAQ" },
      { href: "/toothfairy/recover", label: "Recover Access" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/toothfairy/recover", label: "Recover" },
      { href: "/toothfairy/faq", label: "Security" },
      { href: "/toothfairy/faq", label: "Help Center" },
      { href: "/toothfairy/app", label: "Start" },
    ],
  },
]

export function TFNFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="tfn-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.9fr_0.9fr]">
        <div>
          <Link href="/toothfairy" className="footer-brand">
            <span className="footer-logo" aria-hidden>
              <svg viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 7.5c-3.4-3-8.7-3.3-12.2-.6C7.2 10.4 6.4 17.3 9.7 24.4c2 4.4 3.1 9.7 4.2 13.3.8 2.7 2 4.7 4.1 4.7 2.5 0 3.1-3.1 3.8-6.4.4-1.8.8-3.2 2.2-3.2s1.8 1.4 2.2 3.2c.7 3.3 1.3 6.4 3.8 6.4 2.1 0 3.3-2 4.1-4.7 1.1-3.6 2.2-8.9 4.2-13.3 3.3-7.1 2.5-14-2.1-17.5-3.5-2.7-8.8-2.4-12.2.6Z"
                  stroke="url(#footerToothGradient)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="footerToothGradient" x1="8" y1="8" x2="41" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C94BA8" />
                    <stop offset="0.55" stopColor="#6D45A8" />
                    <stop offset="1" stopColor="#D8A43C" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span>toothfairy.network</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6" style={{ color: "#23365f" }}>
            A child's first digital piggy bank, disguised as a magical family ritual.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="social-dot">X</span>
            <span className="social-dot">IG</span>
            <span className="social-dot">DC</span>
            <span className="social-dot">M</span>
          </div>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="footer-heading">{column.title}</h3>
              <div className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <Link key={`${column.title}-${link.label}`} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form className="newsletter" onSubmit={(event) => event.preventDefault()}>
          <p className="text-sm font-extrabold" style={{ color: "#11234a" }}>
            Stay in the loop
          </p>
          <p className="mt-2 text-sm leading-6" style={{ color: "#23365f" }}>
            Family-friendly stories, product updates, and early access notes.
          </p>
          <label className="sr-only" htmlFor="tfn-footer-email">
            Email address
          </label>
          <div className="email-row">
            <input id="tfn-footer-email" type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--tfn-ink-muted)" }}>
            No spam. Just useful updates while the Network grows.
          </p>
        </form>
      </div>

      <div className="footer-bottom">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Copyright {year} Tooth Fairy Network.</span>
          <span>Privacy, terms, and fee disclosures to be finalized before broad launch.</span>
        </div>
      </div>

      <style jsx>{`
        .tfn-footer {
          border-top: 1px solid var(--tfn-border);
          background:
            radial-gradient(circle at 86% 10%, oklch(72% 0.145 75 / 0.12), transparent 20rem),
            linear-gradient(180deg, #fffaf1, var(--tfn-surface-alt));
          color: var(--tfn-ink-muted);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.74rem;
          color: #11234a;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.35rem, 2vw, 1.65rem);
          font-weight: 900;
          text-decoration: none;
        }

        .footer-logo {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 999px;
          background: #fffaf1;
          box-shadow: 0 8px 22px oklch(37% 0.11 302 / 0.12);
        }

        .footer-logo svg {
          width: 34px;
          height: 34px;
        }

        .social-dot {
          display: inline-grid;
          min-width: 36px;
          height: 36px;
          place-items: center;
          border: 1px solid var(--tfn-border);
          border-radius: 999px;
          background: oklch(100% 0 0 / 0.52);
          color: #6d45a8;
          font-size: 0.76rem;
          font-weight: 900;
        }

        .footer-heading {
          color: #11234a;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer-link {
          color: #23365f;
          font-size: 0.92rem;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .footer-link:hover {
          color: #6d45a8;
        }

        .newsletter {
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
          background: oklch(100% 0 0 / 0.58);
          padding: 1rem;
          box-shadow: 0 18px 42px oklch(30% 0.035 65 / 0.06);
        }

        .email-row {
          display: grid;
          gap: 0.6rem;
          margin-top: 1rem;
        }

        .email-row input {
          min-height: 42px;
          width: 100%;
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
          background: #fffaf1;
          color: #11234a;
          padding: 0 0.9rem;
          outline: none;
        }

        .email-row button {
          min-height: 42px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #6d45a8, #8a5cc5);
          color: #fffaf1;
          font-weight: 900;
          cursor: pointer;
        }

        .footer-bottom {
          border-top: 1px solid var(--tfn-border);
          color: var(--tfn-ink-muted);
        }
      `}</style>
    </footer>
  )
}
