import Link from 'next/link'

import { FutureNotePanel } from '@/components/toothlight/v4/FutureNotePanel'
import styles from '../detail.module.css'

type FutureNotePageProps = {
  params: {
    id: string
  }
}

export default function FutureNotePage({ params }: FutureNotePageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.copy}>
          <Link href={`/toothlight/t/${params.id}`} className={styles.backLink}>
            Saved Toothlight
          </Link>
          <p className={styles.eyebrow}>Parent note</p>
          <h1>Write a note for later.</h1>
          <p>
            Start short, then seal it when it feels right. The public page can
            show the status without revealing the private note.
          </p>
        </section>
        <FutureNotePanel toothlightId={params.id} />
      </div>
    </main>
  )
}
