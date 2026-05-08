"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { href: "/toothfairy#how-it-works", label: "How it works" },
      { href: "/toothfairy/app/draw?from=footer", label: "Create a memory" },
      { href: "/toothfairy/keepsake/preview", label: "Preview" },
      { href: "/toothfairy/smile-fund", label: "Smile Fund" },
    ],
  },
  {
    title: "Stories",
    links: [
      { href: "/toothfairy/stories", label: "Cultural Tales" },
      { href: "/toothfairy/story/tanda", label: "Meet Tanda" },
    ],
  },
  {
    title: "Parents",
    links: [
      { href: "/toothfairy/about", label: "About" },
      { href: "/toothfairy/faq", label: "Parent FAQ" },
      { href: "/toothfairy/recover", label: "Recover Access" },
    ],
  },
]

export function TFNFooter() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [signupState, setSignupState] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return

    setSignupState("loading")
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "tfn-footer",
        }),
      })

      if (!response.ok) throw new Error("Subscribe failed")
      setEmail("")
      setSignupState("success")
    } catch {
      setSignupState("error")
    }
  }

  return (
    <footer className="tfn-footer">
      <div className="footer-grid">
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
          <p className="footer-tagline">
            A child's first forever memory, guided by story and protected by parents.
          </p>
        </div>

        <div className="footer-columns">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="footer-heading">{column.title}</h3>
              <div className="footer-link-list">
                {column.links.map((link) => (
                  <Link key={`${column.title}-${link.label}`} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form className="newsletter" onSubmit={handleSubscribe}>
          <p className="newsletter-title">
            Stay in the loop
          </p>
          <p className="newsletter-copy">
            Story lessons, Smile Fund notes, product updates, and early access.
          </p>
          <label className="sr-only" htmlFor="tfn-footer-email">
            Email address
          </label>
          <div className="email-row">
            <input
              id="tfn-footer-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (signupState !== "idle") setSignupState("idle")
              }}
            />
            <button type="submit" disabled={signupState === "loading"}>
              {signupState === "loading" ? "Saving..." : "Subscribe"}
            </button>
          </div>
          <p className="newsletter-state">
            {signupState === "success"
              ? "You are on the list."
              : signupState === "error"
                ? "That did not save. Try again in a moment."
                : "No spam. Just useful updates while the Network grows."}
          </p>
        </form>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>Copyright {year} Tooth Fairy Network.</span>
          <span>Privacy, terms, and fee disclosures will be finalized before broad launch.</span>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tfn-footer {
          border-top: 1px solid var(--tfn-border);
          background:
            radial-gradient(circle at 86% 10%, oklch(72% 0.145 75 / 0.12), transparent 20rem),
            linear-gradient(180deg, #fffaf1, var(--tfn-surface-alt));
          color: var(--tfn-ink-muted);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .footer-grid {
          display: grid;
          width: min(100% - 40px, 1280px);
          grid-template-columns: 1fr;
          gap: 2.5rem;
          margin: 0 auto;
          padding: 3rem 0;
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

        .footer-tagline {
          max-width: 20rem;
          margin: 1rem 0 0;
          color: #23365f;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .footer-columns {
          display: grid;
          gap: 1.75rem;
        }

        .footer-heading {
          margin: 0;
          color: #11234a;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer-link-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
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

        .newsletter-title {
          margin: 0;
          color: #11234a;
          font-size: 0.9rem;
          font-weight: 900;
        }

        .newsletter-copy {
          margin: 0.5rem 0 0;
          color: #23365f;
          font-size: 0.9rem;
          line-height: 1.55;
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

        .email-row button:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .newsletter-state {
          margin: 0.75rem 0 0;
          color: var(--tfn-ink-muted);
          font-size: 0.75rem;
        }

        .footer-bottom {
          border-top: 1px solid var(--tfn-border);
          color: var(--tfn-ink-muted);
        }

        .footer-bottom-inner {
          display: flex;
          width: min(100% - 40px, 1280px);
          flex-direction: column;
          gap: 0.75rem;
          margin: 0 auto;
          padding: 1.25rem 0;
          font-size: 0.75rem;
        }

        @media (min-width: 640px) {
          .footer-columns {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer-bottom-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        @media (min-width: 980px) {
          .footer-grid {
            grid-template-columns: 0.95fr 1.45fr 0.9fr;
          }

          .footer-columns {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .footer-grid,
          .footer-bottom-inner {
            width: min(100% - 28px, 1280px);
          }
        }
      `,
        }}
      />
    </footer>
  )
}
