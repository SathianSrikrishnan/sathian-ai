/**
 * Read-only keepsake data fetching — no wallet required.
 *
 * This module fetches on-chain data using a bare Connection (no wallet, no AnchorProvider
 * in the tx-sending sense). Used by the keepsake view page, which family members open
 * without Phantom installed.
 */
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { createClient } from '@supabase/supabase-js';
import idl from './escrow-idl.json';
import { PROGRAM_ID } from './escrow';

export interface KeepsakeDepositView {
  name: string;
  amount: number;
  locked: boolean;
}

export interface KeepsakeData {
  childName: string;
  toothType: string;
  storyOrigin?: string;
  drawingUrl?: string;
  smilePhotoUrl?: string;
  mintDate: Date;
  deposits: KeepsakeDepositView[];
  message?: string;
  totalEscrowed: number;
  milestoneIndex: number;
  // The Tell — child's narrative about this specific tooth.
  // Stored off-chain in Supabase tfn_tooth_stories (see migration 20260413_add_tooth_story.sql).
  // Nullable: older keepsakes + skipped tells have no story.
  toothStory: string | null;
}

/**
 * Build a read-only Anchor program. We pass a throwaway Keypair as the "wallet"
 * since Program<IDL> requires a wallet type, but we never sign or send transactions.
 * Account fetches (`program.account.*.fetch`) only need a Connection.
 */
function getReadOnlyProgram(): { program: any; connection: Connection } {
  const rpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_RPC ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    'https://api.mainnet-beta.solana.com';

  const connection = new Connection(rpcUrl, 'confirmed');

  const dummyWallet = {
    publicKey: Keypair.generate().publicKey,
    signTransaction: async () => {
      throw new Error('Read-only wallet cannot sign');
    },
    signAllTransactions: async () => {
      throw new Error('Read-only wallet cannot sign');
    },
  };

  const provider = new AnchorProvider(connection, dummyWallet as any, {
    commitment: 'confirmed',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const program = new Program(idl as any, provider as any) as any;

  return { program, connection };
}

async function fetchDrawingFromMetadata(
  metadataUri: string,
  childName?: string
): Promise<{ drawingUrl?: string; storyOrigin?: string; message?: string }> {
  if (!metadataUri || metadataUri.trim().length === 0) {
    return {};
  }
  try {
    const res = await fetch(metadataUri, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return {};
    const json = (await res.json()) as {
      image?: string;
      attributes?: Array<{ trait_type?: string; value?: string }>;
      description?: string;
    };

    const attrs = json.attributes ?? [];
    const storyOriginAttr = attrs.find(
      (a) =>
        a.trait_type === 'story_origin' ||
        a.trait_type === 'tradition' ||
        a.trait_type === 'Story Origin'
    );

    // Legacy keepsakes baked a dental-heavy description into immutable Arweave
    // metadata ("Tooth #1 (UpperRightCentralIncisor) — A childhood milestone
    // recorded..."). TFN is a time capsule, not a dental chart — rewrite the
    // legacy description on read so older keepsakes render with the same
    // time-capsule fallback copy as new ones.
    let message = json.description;
    if (message && /^Tooth #\d+\s*\(/i.test(message)) {
      message = childName
        ? `A childhood milestone from ${childName}'s journey, preserved on the Tooth Fairy Network.`
        : 'A childhood milestone preserved on the Tooth Fairy Network.';
    }

    return {
      drawingUrl: json.image,
      storyOrigin: storyOriginAttr?.value,
      message,
    };
  } catch {
    return {};
  }
}

/**
 * Fetch the Tell (toothStory) for a milestone from Supabase.
 * Returns null on any failure — the keepsake still renders without a Tell.
 */
async function fetchToothStory(milestonePda: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const client = createClient(url, anonKey);
    const { data, error } = await client
      .from('tfn_tooth_stories')
      .select('tooth_story')
      .eq('milestone_pda', milestonePda)
      .maybeSingle();
    if (error) return null;
    const story = data?.tooth_story;
    if (typeof story === 'string' && story.trim().length > 0) {
      return story;
    }
    return null;
  } catch {
    return null;
  }
}

function prettyToothType(key: string): string {
  const map: Record<string, string> = {
    upperRight: 'Upper right tooth',
    upperLeft: 'Upper left tooth',
    lowerRight: 'Lower right tooth',
    lowerLeft: 'Lower left tooth',
    frontUpper: 'Upper front tooth',
    frontLower: 'Lower front tooth',
    firstTooth: 'First tooth',
    unknown: 'A little tooth',
  };
  return map[key] || key.replace(/([A-Z])/g, ' $1').toLowerCase().trim() || 'A little tooth';
}

export async function getKeepsakeData(
  milestoneId: string
): Promise<KeepsakeData | null> {
  let milestonePubkey: PublicKey;
  try {
    milestonePubkey = new PublicKey(milestoneId);
  } catch {
    return null;
  }

  try {
    const { program } = getReadOnlyProgram();

    const milestone: any = await program.account.milestone.fetch(milestonePubkey);
    if (!milestone) return null;

    const childProfilePda: PublicKey = milestone.childProfile;
    const childProfile: any = await program.account.childProfile.fetch(
      childProfilePda
    );

    const toothTypeKey = Object.keys(milestone.toothType ?? {})[0] ?? 'unknown';

    const now = Math.floor(Date.now() / 1000);
    const allDeposits: any[] = await program.account.deposit.all([
      { memcmp: { offset: 8, bytes: milestonePubkey.toBase58() } },
    ]);

    const deposits: KeepsakeDepositView[] = allDeposits.map((d) => {
      const a = d.account;
      const lockUntil = (a.lockUntil as BN).toNumber();
      const amountLamports = (a.amountLamports as BN).toNumber();
      return {
        name: a.depositorName as string,
        amount: amountLamports / LAMPORTS_PER_SOL,
        locked: lockUntil > 0 && now < lockUntil,
      };
    });

    const totalEscrowedLamports = (milestone.totalDeposits as BN).toNumber();
    const createdAt = (milestone.createdAt as BN).toNumber();

    const childNameFromChain =
      (childProfile.childName as string) || 'A little one';

    const metadataUri: string = milestone.metadataUri ?? '';
    const [metadata, toothStory] = await Promise.all([
      fetchDrawingFromMetadata(metadataUri, childNameFromChain),
      fetchToothStory(milestonePubkey.toBase58()),
    ]);

    return {
      childName: childNameFromChain,
      toothType: prettyToothType(toothTypeKey),
      storyOrigin: metadata.storyOrigin,
      drawingUrl: metadata.drawingUrl,
      smilePhotoUrl: undefined,
      mintDate: new Date(createdAt * 1000),
      deposits,
      message: metadata.message,
      totalEscrowed: totalEscrowedLamports / LAMPORTS_PER_SOL,
      milestoneIndex: milestone.milestoneIndex as number,
      toothStory,
    };
  } catch {
    return null;
  }
}

// Keep PROGRAM_ID reachable from this module for consumers that want to verify
// a milestone PDA without importing from escrow.ts directly.
export { PROGRAM_ID };
