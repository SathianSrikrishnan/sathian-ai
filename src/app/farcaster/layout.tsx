import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import styles from './farcaster.module.css'

export default function FarcasterLayout({children}:{children:React.ReactNode}) {
  return <div className="relaunch-shell minimal-site minimal-inner-page" data-theme="workshop">
    <SiteNav />
    <main className={`minimal-container ${styles.main}`}>
      <nav aria-label="Farcaster project" className={styles.nav}>
        <Link href="/farcaster">The project</Link>
        <Link href="/farcaster/setup">Setup</Link>
        <Link href="/farcaster/library">Explanations</Link>
      </nav>
      {children}
      <p className={`${styles.section} ${styles.muted}`}>An independent project by <Link href="/about">Sathian</Link>. <a href="https://farcaster.xyz/sathian">Find me on Farcaster</a> or <Link href="/links">get in touch</Link>.</p>
    </main>
    <SiteFooter />
  </div>
}
