import Link from 'next/link'

import { FamilyContributionForm } from '@/components/toothlight/v4/FamilyContributionForm'
import { ToothlightCard } from '@/components/toothlight/v4/ToothlightCard'
import styles from '../detail.module.css'

type FamilyPageProps = {
  params: {
    id: string
  }
}

export default function FamilyPage({ params }: FamilyPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.copy}>
          <Link href={`/toothlight/t/${params.id}`} className={styles.backLink}>
            Saved Toothlight
          </Link>
          <p className={styles.eyebrow}>Family</p>
          <h1>Add a gift and a note for later.</h1>
          <p>
            Family can join the memory with a short future message. The gift
            path is demo-safe in this first proof.
          </p>
          <ToothlightCard
            title="Kai's Toothlight"
            caption="First tooth. Big smile."
            createdLabel="Family view"
            visualState="constellated"
            familyNodes={[
              { id: 'note-node', kind: 'family_note' },
              { id: 'gift-node', kind: 'family_gift' },
            ]}
          />
        </section>
        <FamilyContributionForm toothlightId={params.id} />
      </div>
    </main>
  )
}
