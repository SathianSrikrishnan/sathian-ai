import { FamilyInviteClient } from '@/components/toothlight/v4/FamilyInviteClient'
import styles from '../detail.module.css'

type FamilyPageProps = {
  params: {
    id: string
  }
}

export default function FamilyPage({ params }: FamilyPageProps) {
  return (
    <main className={styles.page}>
      <FamilyInviteClient toothlightId={params.id} />
    </main>
  )
}
