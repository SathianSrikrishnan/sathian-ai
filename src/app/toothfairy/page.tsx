'use client';

import { useRouter } from 'next/navigation';
import ChainOfTeeth from '@/components/toothfairy/chain-of-teeth';

export default function ToothFairyLanding() {
  const router = useRouter();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ChainOfTeeth
        onDepositClick={() => router.push('/toothfairy/app')}
        onStoriesClick={() => router.push('/toothfairy/story')}
      />
    </div>
  );
}
