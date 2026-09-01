import Link from 'next/link'

import { personalSocialLinks } from '@/lib/social-links'

export function WorkshopFooter() {
  return (
    <footer className="relaunch-footer">
      <div className="relaunch-content">
        <div>
          <span className="hub-mono">sathian.ai</span>
          <span>© {new Date().getFullYear()} Sathian</span>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/#now">Projects</Link>
          <Link href="/hackathons">Hackathons</Link>
          <Link href="/writings">Writing</Link>
          <Link href="/about">About</Link>
          <Link href="/agents">For agents</Link>
          {personalSocialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
