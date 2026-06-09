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
          <h1>{handoff ? 'Parent note.' : 'Note for later.'}</h1>
          <p>
            {handoff
              ? 'Say or type the private note.'
              : 'The private note stays closed.'}
          </p>
        </section>
        <FutureNotePanel toothlightId={params.id} handoff={handoff} />
      </div>
    </main>
  )
}
