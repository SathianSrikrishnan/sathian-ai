import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="minimal-site-footer">
      <div className="minimal-site-footer__inner">
        <div className="minimal-site-footer__identity">
          <Link href="/" className="minimal-site-footer__brand">sathian.ai</Link>
          <span>Agent manager + orchestrator</span>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/hackathons">Hackathons</Link>
          <Link href="/writings">Writing</Link>
          <Link href="/#agent">Ask the site agent</Link>
        </nav>
      </div>
    </footer>
  )
}
