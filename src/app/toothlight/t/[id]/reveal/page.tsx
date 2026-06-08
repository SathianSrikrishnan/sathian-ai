import { FutureRevealClient } from '@/components/toothlight/v4/FutureRevealClient'
import styles from '../detail.module.css'

type FutureRevealPageProps = {
  params: {
    id: string
  }
  searchParams?: {
    preview?: string
  }
}

export default function FutureRevealPage({ params, searchParams }: FutureRevealPageProps) {
  return (
    <main className={styles.page}>
      <FutureRevealClient toothlightId={params.id} preview={searchParams?.preview === '1'} />
    </main>
  )
}
