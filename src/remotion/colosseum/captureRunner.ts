export type CaptureClipKind =
  | 'tanda'
  | 'browser'
  | 'diagram'
  | 'proof'
  | 'hybrid';

export type CaptureClip = {
  id: string;
  title: string;
  kind: CaptureClipKind;
  durationSeconds: number;
  narration: string;
  lowerThird: string;
  browserPath?: string;
  scrollY?: number;
  assetPath?: string;
  audioPath?: string;
  operatorNote: string;
};

const tandaAsset =
  '/colosseum-frontier-2026/avatar/candidates/tanda-faye-ceo-still-v2.png';

export const pitchCaptureClips: CaptureClip[] = [
  {
    id: 'pitch-01-tanda-open',
    title: 'Tanda Opens',
    kind: 'tanda',
    durationSeconds: 12,
    assetPath: tandaAsset,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/pitch-p01-tanda-open-v1.mp3',
    lowerThird: 'Tanda Faye / CEO, Tooth Fairy Network',
    narration:
      'I am Tanda, CEO of the Tooth Fairy Network. For centuries, a lost tooth has brought families together around a tiny milestone.',
    operatorNote: 'Face and voice lock. This is the first emotional trust beat.',
  },
  {
    id: 'pitch-02-family-graph',
    title: 'Distributed Families',
    kind: 'diagram',
    durationSeconds: 12,
    assetPath: '/colosseum-frontier-2026/diagrams/diagram-family-network-v1.png',
    audioPath:
      '/colosseum-frontier-2026/audio/elevenlabs/pitch-p02-distributed-families-v1.mp3',
    lowerThird: 'Families are distributed. The ritual is still shared.',
    narration:
      'Families are more spread out than ever. Grandparents, co-parents, relatives, and friends are not always in the same room when the milestone happens.',
    operatorNote: 'Use this as the problem wedge before showing product UI.',
  },
  {
    id: 'pitch-03-homepage',
    title: 'Homepage To Product',
    kind: 'browser',
    durationSeconds: 14,
    browserPath: '/toothfairy',
    scrollY: 0,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/pitch-p03-product-ritual-v1.mp3',
    lowerThird: 'The product starts with the ritual, not a wallet prompt.',
    narration:
      'Tooth Fairy Network gives that family network one place to show up. A parent opens the app and starts with the memory.',
    operatorNote:
      'Browser frame shows the public product surface. Later we can replace with a real screen recording.',
  },
  {
    id: 'pitch-04-app-flow',
    title: 'Create The Keepsake',
    kind: 'hybrid',
    durationSeconds: 16,
    browserPath: '/toothfairy/app',
    scrollY: 0,
    assetPath: tandaAsset,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/pitch-p03-product-ritual-v1.mp3',
    lowerThird: 'Capture the smile, drawing, and story.',
    narration:
      'When a child loses a tooth, a parent captures the smile or drawing and turns the moment into a permanent digital keepsake.',
    operatorNote:
      'This is the core demo placeholder until a real clean product pass is recorded.',
  },
  {
    id: 'pitch-05-gift-link',
    title: 'Family Gift Link',
    kind: 'browser',
    durationSeconds: 14,
    browserPath: '/toothfairy/app',
    scrollY: 720,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/pitch-p04-family-gift-link-v1.mp3',
    lowerThird: 'One link lets family show up from anywhere.',
    narration:
      'Then the family can add a gift through a shareable link: parents, grandparents, co-parents, aunts, uncles, anyone who wants to be part of the story.',
    operatorNote:
      'Swap this for the actual gift page once a test milestone URL is ready.',
  },
  {
    id: 'pitch-06-solana-stack',
    title: 'Solana Under The Magic',
    kind: 'diagram',
    durationSeconds: 14,
    assetPath: '/colosseum-frontier-2026/diagrams/diagram-solana-stack-v1.png',
    audioPath:
      '/colosseum-frontier-2026/audio/elevenlabs/pitch-p05-solana-under-magic-v1.mp3',
    lowerThird: 'cNFTs, storage, escrow, Blinks, and mobile wallets.',
    narration:
      'The magic leads. Solana keeps the value, proof, and action alive underneath.',
    operatorNote: 'This is where judges see the product is Solana-native.',
  },
  {
    id: 'pitch-07-proof',
    title: 'Mainnet Proof',
    kind: 'proof',
    durationSeconds: 12,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/pitch-p06-mainnet-proof-v1.mp3',
    lowerThird: 'Mainnet program, Merkle tree, Phantom keepsake.',
    narration:
      'This is already live on mainnet. The program is deployed. The Merkle tree is live. Keepsakes display in Phantom.',
    operatorNote:
      'Replace this placeholder with explorer, Phantom, and metadata screen captures.',
  },
  {
    id: 'pitch-08-founder-gtm',
    title: 'Founder And GTM',
    kind: 'hybrid',
    durationSeconds: 16,
    browserPath: '/toothfairy/stories',
    scrollY: 0,
    assetPath: tandaAsset,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/pitch-p07-founder-gtm-v1.mp3',
    lowerThird: 'Parents, creators, culture, Solana Mobile, MoonPay after KYB.',
    narration:
      'Go-to-market is parents, family influencers, cultural tooth-story videos, Solana Mobile, MoonPay access after KYB, and the Solana community itself.',
    operatorNote: 'This keeps MoonPay present without implying live KYB approval.',
  },
  {
    id: 'pitch-09-close',
    title: 'Close',
    kind: 'tanda',
    durationSeconds: 12,
    assetPath: tandaAsset,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/pitch-p08-close-v1.mp3',
    lowerThird: 'Tooth Fairy Network turns milestones into sticky Solana accounts.',
    narration:
      'Tooth Fairy Network turns family milestones into sticky Solana accounts. The tooth fairy just got an upgrade.',
    operatorNote: 'Slow final line. End on URL and Tanda.',
  },
];

export const technicalCaptureClips: CaptureClip[] = [
  {
    id: 'technical-01-stack',
    title: 'Stack Overview',
    kind: 'diagram',
    durationSeconds: 14,
    assetPath: '/colosseum-frontier-2026/diagrams/diagram-solana-stack-v1.png',
    audioPath:
      '/colosseum-frontier-2026/audio/elevenlabs/technical-t01-stack-overview-v1.mp3',
    lowerThird: 'Next.js app backed by Solana mainnet infrastructure.',
    narration:
      'Tooth Fairy Network is a Next.js consumer app backed by Solana mainnet infrastructure.',
    operatorNote: 'Technical video starts with implementation, not brand story.',
  },
  {
    id: 'technical-02-user-flow',
    title: 'User Flow',
    kind: 'browser',
    durationSeconds: 20,
    browserPath: '/toothfairy/app',
    scrollY: 0,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/technical-t02-user-flow-v1.mp3',
    lowerThird: 'Memory first. Wallet and minting after meaning is created.',
    narration:
      'The user flow starts with the emotional moment, then moves into wallet connection, minting, and family gift sharing.',
    operatorNote: 'Use a slower capture here than in the pitch video.',
  },
  {
    id: 'technical-03-pda-model',
    title: 'Anchor Account Model',
    kind: 'diagram',
    durationSeconds: 22,
    assetPath: '/colosseum-frontier-2026/diagrams/diagram-pda-model-v1.png',
    audioPath:
      '/colosseum-frontier-2026/audio/elevenlabs/technical-t03-anchor-program-v1.mp3',
    lowerThird: 'Child profile, milestone, deposit, and treasury PDAs.',
    narration:
      'The core is an Anchor escrow program. Deposits are enforced by Solana account state and program logic.',
    operatorNote: 'Add code/IDL crop later, but this diagram is enough for first rough cut.',
  },
  {
    id: 'technical-04-storage',
    title: 'cNFT And Storage',
    kind: 'proof',
    durationSeconds: 18,
    audioPath: '/colosseum-frontier-2026/audio/elevenlabs/technical-t04-cnft-storage-v1.mp3',
    lowerThird: 'Compressed NFTs keep consumer keepsakes practical.',
    narration:
      'Metaplex compressed NFTs keep cost practical, while Arweave and Irys store the image and metadata.',
    operatorNote: 'Replace placeholder with Phantom/explorer/metadata captures.',
  },
  {
    id: 'technical-05-actions',
    title: 'Actions And On-Ramps',
    kind: 'hybrid',
    durationSeconds: 18,
    browserPath: '/toothfairy/app',
    scrollY: 720,
    assetPath: '/colosseum-frontier-2026/diagrams/diagram-family-network-v1.png',
    audioPath:
      '/colosseum-frontier-2026/audio/elevenlabs/technical-t05-actions-onramp-mobile-v1.mp3',
    lowerThird: 'Gift links and Blinks are live paths. MoonPay is KYB-pending.',
    narration:
      'Gift pages and Blinks make the deposit action portable. MoonPay is prepared as the KYB-pending fiat on-ramp path.',
    operatorNote: 'This is the cleanest current MoonPay framing.',
  },
  {
    id: 'technical-06-why-solana',
    title: 'Why Solana',
    kind: 'diagram',
    durationSeconds: 18,
    assetPath: '/colosseum-frontier-2026/diagrams/diagram-why-solana-v1.png',
    audioPath:
      '/colosseum-frontier-2026/audio/elevenlabs/technical-t06-why-solana-v1.mp3',
    lowerThird: 'Instant, inexpensive, mobile-native, composable.',
    narration:
      'Solana is the right substrate because the experience needs to feel instant, inexpensive, mobile-native, and composable.',
    operatorNote: 'End with working product and technical rationale.',
  },
];

export const captureClipSets = {
  pitch: pitchCaptureClips,
  technical: technicalCaptureClips,
} as const;
