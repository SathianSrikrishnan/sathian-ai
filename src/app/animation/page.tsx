'use client';

import { useRouter } from 'next/navigation';
import ChainOfTeeth from '@/components/toothfairy/chain-of-teeth';

export default function AnimationPage() {
  const router = useRouter();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ChainOfTeeth
        onDepositClick={() => router.push('/toothfairy/app/draw?from=animation')}
        onStoriesClick={() => router.push('/toothfairy/stories')}
      />
    </div>
  );
}
