import { SavedToothlightClient } from '@/components/toothlight/v4/SavedToothlightClient'
import styles from './detail.module.css'

type SavedToothlightPageProps = {
  params: {
    id: string
  }
}

export default function SavedToothlightPage({ params }: SavedToothlightPageProps) {
  return (
    <main className={styles.page}>
      <SavedToothlightClient toothlightId={params.id} />
    </main>
  )
}
