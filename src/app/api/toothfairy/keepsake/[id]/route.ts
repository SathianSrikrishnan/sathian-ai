import { NextRequest, NextResponse } from 'next/server';
import { getKeepsakeData } from '@/lib/toothfairy/keepsake-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // ── Test mode short-circuit (E2E tests only) ──
  // Gated by NEXT_PUBLIC_TEST_MODE=true — returns a deterministic keepsake
  // record matching KeepsakeData shape so the client renders without hitting
  // Solana/Arweave/Supabase.
  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true' && params.id === 'test-pda') {
    return NextResponse.json({
      childName: 'Test Child',
      toothType: 'Upper right tooth',
      storyOrigin: 'tanda',
      drawingUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      smilePhotoUrl: undefined,
      mintDate: new Date().toISOString(),
      deposits: [],
      message: 'A childhood milestone preserved on the Tooth Fairy Network.',
      totalEscrowed: 0,
      milestoneIndex: 0,
      toothStory: 'Test tooth story',
    });
  }

  const data = await getKeepsakeData(params.id);
  if (!data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json(data);
}
