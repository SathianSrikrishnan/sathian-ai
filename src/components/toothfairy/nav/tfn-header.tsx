"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TFNGlowingToothLogo } from "@/components/toothfairy/brand/tfn-glowing-tooth-logo"

const LINKS = [
  { href: "/toothfairy#how-it-works", label: "How it works" },
  { href: "/toothfairy/stories", label: "Stories" },
] as const

export function TFNHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="tfn-header"
      style={{
        background: scrolled
          ? "rgba(5, 12, 24, 0.9)"
          : "rgba(5, 12, 24, 0.74)",
        backdropFilter: "blur(16px) saturate(150%)",
        WebkitBackdropFilter: "blur(16px) saturate(150%)",
        borderBottom: `1px solid ${scrolled ? "rgba(255, 250, 241, 0.14)" : "rgba(255, 250, 241, 0.07)"}`,
      }}
    >
      <div className="tfn-header-inner">
        <Link href="/toothfairy" className="brand no-underline">
          <TFNGlowingToothLogo size={40} />
          <span className="brand-copy">
            <span className="brand-name">
              Tooth Fairy <b>Network</b>
            </span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Tooth Fairy Network">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="solana-pill">
            <span aria-hidden />
            Solana-backed
          </span>
          <Link href="/toothlight/start?from=nav" className="header-cta">
            Create a Toothlight
            <span aria-hidden className="cta-arrow" />
          </Link>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        body {
          margin: 0;
        }

        .tfn-header {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          box-sizing: border-box;
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .tfn-header-inner {
          display: flex;
          width: min(100% - 40px, 1280px);
          height: 72px;
          align-items: center;
          justify-content: space-between;
          margin: 0 auto;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 0.68rem;
          min-width: 0;
          text-decoration: none;
        }

        .brand-copy {
          display: block;
          min-width: 0;
          line-height: 1.05;
        }

        .brand-name {
          position: relative;
          display: block;
          color: #fffaf1;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.02rem, 1.46vw, 1.3rem);
          font-weight: 900;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .brand-name b {
          background: linear-gradient(100deg, #fff7c4, #f0c456 64%, #ffdca8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-left: clamp(0.85rem, 2vw, 2rem);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.18rem;
          margin-left: auto;
        }

        .nav-link {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0 0.64rem;
          color: rgba(255, 250, 241, 0.72);
          font-size: 0.78rem;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
          transition: background 160ms ease, color 160ms ease;
        }

        .nav-link:hover {
          background: rgba(255, 250, 241, 0.08);
          color: #fff7c4;
        }

        .solana-pill {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          gap: 0.58rem;
          border: 1px solid rgba(255, 250, 241, 0.14);
          border-radius: 999px;
          padding: 0 0.86rem;
          color: rgba(255, 250, 241, 0.76);
          background: rgba(255, 250, 241, 0.06);
          font-size: 0.78rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .solana-pill span {
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255, 250, 241, 0.18);
          border-radius: 999px;
          background:
            linear-gradient(135deg, rgba(20, 241, 149, 0.78), rgba(153, 69, 255, 0.72) 56%, rgba(255, 215, 106, 0.7));
          box-shadow: 0 6px 16px rgba(20, 241, 149, 0.14);
        }

        .header-cta {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          gap: 0.55rem;
          border-radius: 999px;
          padding: 0 1.15rem;
          border: 1px solid rgba(40, 185, 154, 0.28);
          background: linear-gradient(135deg, #ffd76a, #f0c456 52%, #f7b75b);
          color: #081123;
          font-size: 0.84rem;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 12px 28px rgba(240, 196, 86, 0.2);
          white-space: nowrap;
        }

        .cta-arrow {
          display: inline-block;
          width: 0.46rem;
          height: 0.46rem;
          border-top: 2px solid currentColor;
          border-right: 2px solid currentColor;
          transform: rotate(45deg);
        }

        @media (min-width: 980px) {
          .solana-pill {
            display: inline-flex;
          }
        }

        @media (max-width: 979px) {
          .desktop-nav,
          .solana-pill {
            display: none;
          }

          .nav-actions {
            margin-left: auto;
          }

          .header-cta {
            min-height: 38px;
            padding: 0 0.88rem;
            font-size: 0.76rem;
          }
        }

        @media (max-width: 680px) {
          .brand-name b {
            display: none;
          }

          .brand-name {
            max-width: 8rem;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        @media (max-width: 420px) {
          .brand {
            gap: 0.46rem;
          }

          .brand-name {
            font-size: 0.96rem;
          }

          .desktop-nav {
            gap: 0.08rem;
          }

          .nav-link {
            min-height: 32px;
            padding: 0 0.38rem;
            font-size: 0.7rem;
          }
        }

        @media (max-width: 680px) {
          .tfn-header-inner {
            width: min(100% - 28px, 1280px);
          }
        }
      `,
        }}
      />
    </header>
  )
}
