import Link from 'next/link'

import { FutureNotePanel } from '@/components/toothlight/v4/FutureNotePanel'
import styles from '../detail.module.css'

type FutureNotePageProps = {
  params: {
    id: string
  }
  searchParams?: {
    handoff?: string
  }
}

export default function FutureNotePage({ params, searchParams }: FutureNotePageProps) {
  const handoff = searchParams?.handoff === '1'

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.copy}>
          <Link href={`/toothlight/t/${params.id}`} className={styles.backLink}>
            Saved Toothlight
          </Link>
          <p className={styles.eyebrow}>Parent note</p>
          <h1>{handoff ? 'Seal the future note.' : 'Write a note for later.'}</h1>
          <p>
            {handoff
              ? 'The Toothlight is saved. This parent-only step seals the private note before the child-facing memory is shared.'
              : 'Start short, then seal it when it feels right. The public page can show the status without revealing the private note.'}
          </p>
        </section>
        <FutureNotePanel toothlightId={params.id} handoff={handoff} />
      </div>
    </main>
  )
}
