'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './studio-navigation.module.css'

export function StudioNavigation() {
  const pathname = usePathname()
  const isEntrance =
    pathname === '/studio/login' ||
    pathname === '/studio/mfa' ||
    pathname.startsWith('/studio/auth/')

  if (isEntrance) return null

  return (
    <nav className={styles.navigation} aria-label="Studio navigation">
      <div className={styles.identity}>
        <Link href="/" className={styles.siteLink}>sathian.ai</Link>
        <span aria-hidden="true">/</span>
        <Link href="/studio" className={styles.studioLink}>Studio</Link>
      </div>
      <div className={styles.resourceLinks}>
        <Link href="/studio">Writing</Link>
        <Link href="/studio/build-notes">Build notes</Link>
        <Link href="/studio/homepage">Homepage</Link>
        <Link href="/studio/memory">Memory</Link>
        <Link href="/studio/agent-gaps">Agent gaps</Link>
        <Link href="/studio/inbox">Inbox</Link>
        <Link href="/studio/subscribers">Subscribers</Link>
      </div>
      <div className={styles.actions}>
        <span className={styles.securityState}>AAL2 session</span>
        <Link href="/studio/new" className={styles.newArticle}>+ New Article</Link>
      </div>
    </nav>
  )
}
