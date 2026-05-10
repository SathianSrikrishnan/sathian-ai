export type VoiceoverKind = 'pitch' | 'technical';

export type VoiceoverChunk = {
  id: string;
  sceneId: string;
  speaker: 'tanda' | 'sathian' | 'narrator';
  targetSeconds: number;
  filename: string;
  direction: string;
  text: string;
};

export const voiceoverChunks: Record<VoiceoverKind, VoiceoverChunk[]> = {
  pitch: [
    {
      id: 'p-vo-01-open',
      sceneId: 'p01-tanda-opens',
      speaker: 'tanda',
      targetSeconds: 14,
      filename: 'pitch-p01-tanda-open-v1.mp3',
      direction: 'Warm CEO, not bedtime story. Smile on the first line, then settle.',
      text:
        'I am Tanda, CEO of the Tooth Fairy Network. For centuries, a lost tooth has brought families together around a tiny milestone.',
    },
    {
      id: 'p-vo-02-family',
      sceneId: 'p02-family-distance',
      speaker: 'tanda',
      targetSeconds: 18,
      filename: 'pitch-p02-distributed-families-v1.mp3',
      direction: 'Empathetic and modern. Do not make split households sound sad.',
      text:
        'But families are more spread out than ever. Grandparents live in different cities. Parents co-parent across households. People who love a child are not always in the same room when the milestone happens.',
    },
    {
      id: 'p-vo-03-product',
      sceneId: 'p03-product-flow',
      speaker: 'tanda',
      targetSeconds: 28,
      filename: 'pitch-p03-product-ritual-v1.mp3',
      direction: 'Clear product demo voice. Let the verbs carry the flow.',
      text:
        'Tooth Fairy Network gives that family network one place to show up. When a child loses a tooth, a parent opens the app, captures the smile or drawing, and turns the moment into a permanent digital keepsake.',
    },
    {
      id: 'p-vo-04-gift',
      sceneId: 'p04-family-gift',
      speaker: 'tanda',
      targetSeconds: 20,
      filename: 'pitch-p04-family-gift-link-v1.mp3',
      direction: 'Inviting and simple. Emphasize one link.',
      text:
        'Then the family can add a gift through a shareable link: parents, grandparents, co-parents, aunts, uncles, anyone who wants to be part of the story. Those gifts can stay on Solana in escrow until the child grows up.',
    },
    {
      id: 'p-vo-05-solana',
      sceneId: 'p05-solana-magic',
      speaker: 'tanda',
      targetSeconds: 24,
      filename: 'pitch-p05-solana-under-magic-v1.mp3',
      direction: 'Founder-grade confidence. Keep it crisp.',
      text:
        'The magic leads. Solana keeps the value, proof, and action alive underneath. Compressed NFTs make keepsakes cheap enough for a consumer family product. Arweave and Irys preserve the memory. Anchor escrow, gift links, Blinks, and mobile wallet flows make the ritual portable.',
    },
    {
      id: 'p-vo-06-proof',
      sceneId: 'p06-mainnet-proof',
      speaker: 'tanda',
      targetSeconds: 18,
      filename: 'pitch-p06-mainnet-proof-v1.mp3',
      direction: 'Matter-of-fact proof. No hype.',
      text:
        'This is already live on mainnet. The program is deployed. The Merkle tree is live. Keepsakes display in Phantom. Gift links and Solana-native deposits are part of the flow.',
    },
    {
      id: 'p-vo-07-founder',
      sceneId: 'p07-founder-gtm',
      speaker: 'tanda',
      targetSeconds: 24,
      filename: 'pitch-p07-founder-gtm-v1.mp3',
      direction: 'Personal, but controlled. Strong on distribution.',
      text:
        'Sathian built this as a father first, then as a founder. He is building for his daughters, Isa and Sia, and for parents who want a child’s first digital asset to feel like love, not speculation. Go-to-market is parents, family influencers, cultural tooth-story videos, Solana Mobile, MoonPay access after KYB, and the Solana community itself.',
    },
    {
      id: 'p-vo-08-close',
      sceneId: 'p08-close',
      speaker: 'tanda',
      targetSeconds: 14,
      filename: 'pitch-p08-close-v1.mp3',
      direction: 'Slow down for the tagline. Leave a beat before the final sentence.',
      text:
        'This is not just a tooth fairy app. It is a new consumer doorway into Solana, built from a ritual families already understand. Tooth Fairy Network turns family milestones into sticky Solana accounts. The tooth fairy just got an upgrade.',
    },
  ],
  technical: [
    {
      id: 't-vo-01-stack',
      sceneId: 't01-stack-overview',
      speaker: 'narrator',
      targetSeconds: 18,
      filename: 'technical-t01-stack-overview-v1.mp3',
      direction: 'Builder voice. Direct and calm.',
      text:
        'Tooth Fairy Network is a Next.js consumer app backed by Solana mainnet infrastructure: Anchor escrow, compressed NFTs, Arweave/Irys storage, wallet flows, and shareable gift actions.',
    },
    {
      id: 't-vo-02-flow',
      sceneId: 't02-user-flow',
      speaker: 'narrator',
      targetSeconds: 28,
      filename: 'technical-t02-user-flow-v1.mp3',
      direction: 'Walkthrough pace. Leave space for screen labels.',
      text:
        'The user flow starts with the emotional moment. A parent creates a tooth memory, adds a drawing or photo, previews the keepsake, then moves into wallet connection, minting, and family gift sharing.',
    },
    {
      id: 't-vo-03-anchor',
      sceneId: 't03-anchor-program',
      speaker: 'narrator',
      targetSeconds: 34,
      filename: 'technical-t03-anchor-program-v1.mp3',
      direction: 'Technical clarity. Slow down on PDA names.',
      text:
        'On chain, the core is an Anchor escrow program deployed at FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC. A child profile PDA stores the guardian, child wallet, milestone count, totals, and deposit count. A milestone PDA represents a specific tooth. Each deposit PDA holds SOL for a family contribution.',
    },
    {
      id: 't-vo-04-storage',
      sceneId: 't04-cnft-storage',
      speaker: 'narrator',
      targetSeconds: 26,
      filename: 'technical-t04-cnft-storage-v1.mp3',
      direction: 'Proof-oriented. Avoid overpromising permanence.',
      text:
        'The important design choice is that the family savings primitive is not a database balance. Deposits are enforced by Solana account state and program logic. For the keepsake, Metaplex compressed NFTs keep cost practical, while Arweave and Irys store the image and metadata.',
    },
    {
      id: 't-vo-05-actions',
      sceneId: 't05-actions-onramp-mobile',
      speaker: 'narrator',
      targetSeconds: 27,
      filename: 'technical-t05-actions-onramp-mobile-v1.mp3',
      direction: 'Separate live proof from roadmap. Say KYB clearly.',
      text:
        'For distribution, each milestone can produce a shareable gift page, and the deposit path can be exposed through Solana Actions and Blinks. MoonPay is prepared as the KYB-pending fiat on-ramp path for non-crypto parents. Solana Mobile becomes the mobile proof point if packaging is ready.',
    },
    {
      id: 't-vo-06-why-solana',
      sceneId: 't06-why-solana',
      speaker: 'narrator',
      targetSeconds: 22,
      filename: 'technical-t06-why-solana-v1.mp3',
      direction: 'Confident closer. End on working product.',
      text:
        'We chose Solana because this experience needs to feel instant, inexpensive, mobile-native, and composable. Compressed NFTs, low fees, mobile wallet support, and portable actions make this possible. The result is a working product where a childhood ritual creates a permanent keepsake and a real family escrow account on Solana.',
    },
  ],
};

export const voiceoverTotals = (kind: VoiceoverKind) =>
  voiceoverChunks[kind].reduce((total, chunk) => total + chunk.targetSeconds, 0);
