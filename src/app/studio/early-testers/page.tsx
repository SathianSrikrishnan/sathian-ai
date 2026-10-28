'use client'

import { useEffect, useState } from 'react'
import { LoadState, StudioPage, StudioPageHeader, formatStudioDate } from '@/components/studio/ControlRoom'
import styles from '@/components/studio/control-room.module.css'
import type { EarlyTesterContact } from '@/lib/early-testing'

export default function EarlyTestersPage() {
  const [page, setPage] = useState(0)
  const [items, setItems] = useState<EarlyTesterContact[]>([])
  const [more, setMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    setLoading(true); setError(false)
    fetch(`/api/studio/early-testers?page=${page}`, { cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => { if (active) { setItems(data.items); setMore(data.hasMore) } })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page])
  return <StudioPage>
    <StudioPageHeader eyebrow="Audience" title="Early-testing interest" description="One email identity across Proof and Learn. Read-only review; emails and eligibility are unverified. No invitations, subscriptions or financial benefits are issued here." />
    {loading && <LoadState>Loading early-testing interest.</LoadState>}
    {error && <LoadState>Records are unavailable. No signup or consent state has changed.</LoadState>}
    {!loading && !error && <>
      {!items.length && <LoadState>No early-testing interest on this page.</LoadState>}
      <div className={styles.dataList}>{items.map(item => <article className={styles.dataRow} key={item.id}>
        <h2>{item.email_normalized}</h2>
        <p>Recorded {formatStudioDate(item.created_at)}. Newsletter status: {item.newsletter_subscribers?.status || 'No newsletter subscription'} (unchanged by testing signup).</p>
        {item.early_tester_interests.map((interest, i) => <div key={i}><p>Testing interest: {interest.status}.</p><ul>
          {[...interest.early_tester_signup_events].sort((a, b) => b.consented_at.localeCompare(a.consented_at)).map((event, j) => <li key={j}>
            {event.source_site} · {event.source_page} · {formatStudioDate(event.consented_at)} · {event.consent_copy_version} · Marketing opt-in: no
          </li>)}
        </ul></div>)}
      </article>)}</div>
      <nav aria-label="Early-testing pages"><button disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</button> <span>Page {page + 1}</span> <button disabled={!more} onClick={() => setPage(value => value + 1)}>Next</button></nav>
    </>}
  </StudioPage>
}
