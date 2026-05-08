import type { ColosseumStoryboard } from './types';

export const COLOSSEUM_FPS = 30;
export const COLOSSEUM_WIDTH = 1920;
export const COLOSSEUM_HEIGHT = 1080;

const pitch: ColosseumStoryboard = {
  kind: 'pitch',
  title: 'Tooth Fairy Network',
  subtitle: 'Colosseum Frontier pitch storyboard',
  targetSeconds: 175,
  scenes: [
    {
      id: 'p01-tanda-opens',
      title: 'Tanda Opens The Arena',
      durationSeconds: 14,
      speaker: 'tanda',
      approval: 'needs-assets',
      objective: 'Make the pitch instantly memorable and establish Tanda as CEO-host.',
      narration:
        'I am Tanda, CEO of the Tooth Fairy Network. For centuries, a lost tooth has brought families together around a tiny milestone.',
      visualPlan:
        'Talking Tanda Faye waist-up, then quick b-roll of the existing Tanda hero loop.',
      captureDirection:
        'Use the first approved avatar test here. Until then, use the v32 Tanda loop as placeholder.',
      productionNotes: [
        'This is the face-lock scene. If Tanda feels off, fix the avatar before anything else.',
        'Keep the tone founder-like, not bedtime-story cute.',
      ],
      slots: [
        {
          id: 'avatar-tanda-open',
          label: 'Tanda opening avatar clip',
          kind: 'avatar',
          status: 'queued',
          path: 'colosseum-frontier-2026/avatar/candidates/tanda-faye-ceo-still-v2.png',
          notes:
            'Use Tanda Faye visual lock; still candidate is ready, talking clip remains queued.',
        },
      ],
    },
    {
      id: 'p02-family-distance',
      title: 'Distributed Families',
      durationSeconds: 18,
      speaker: 'tanda',
      approval: 'outline',
      objective:
        'Show the emotional problem: family members are spread across cities and households.',
      narration:
        'But families are more spread out than ever. Grandparents, co-parents, relatives, and friends are not always in the same room when the milestone happens.',
      visualPlan:
        'Soft map/family-node diagram plus app footage hinting at a gift link traveling through the family.',
      captureDirection:
        'Capture gift page and share UI; later add simple animated family graph.',
      productionNotes: [
        'This replaces generic market math with the actual social wedge.',
        'Avoid making divorce/co-parenting feel heavy; frame it as distance and connection.',
      ],
      slots: [
        {
          id: 'screen-gift-share',
          label: 'Gift/share page screen recording',
          kind: 'screen-recording',
          status: 'needed',
          notes: 'Record from parent view into shareable gift page.',
        },
        {
          id: 'diagram-family-network',
          label: 'Distributed family graph',
          kind: 'diagram',
          status: 'captured',
          path: 'colosseum-frontier-2026/diagrams/diagram-family-network-v1.png',
          notes:
            'Parent, child, grandparent, co-parent, aunt/uncle nodes around one milestone.',
        },
      ],
    },
    {
      id: 'p03-product-flow',
      title: 'The Product Ritual',
      durationSeconds: 28,
      speaker: 'tanda',
      approval: 'outline',
      objective: 'Walk through the product in human terms before mentioning technical proof.',
      narration:
        'When a child loses a tooth, a parent opens the app, captures the smile or drawing, and turns the moment into a permanent digital keepsake.',
      visualPlan:
        'Browser screen recording: landing page, app entry, capture/draw, keepsake preview.',
      captureDirection:
        'Record one clean silent desktop pass through the core app flow.',
      productionNotes: [
        'This is the pitch video product proof, not the technical demo.',
        'Keep cuts fast but legible; no failed wallet or loading states in this pass.',
      ],
      slots: [
        {
          id: 'screen-app-entry',
          label: 'App entry and keepsake creation',
          kind: 'screen-recording',
          status: 'needed',
          notes: 'Start at /toothfairy, click into /toothfairy/app, show capture/draw/preview.',
        },
      ],
    },
    {
      id: 'p04-family-gift',
      title: 'Family Gift Link',
      durationSeconds: 20,
      speaker: 'tanda',
      approval: 'outline',
      objective: 'Show the viral loop and why relatives can participate from anywhere.',
      narration:
        'Then the family can add a gift through a shareable link. Parents, grandparents, co-parents, aunts, uncles, anyone who wants to be part of the story.',
      visualPlan:
        'Gift page, deposit CTA, optional Blink preview, warm family overlay.',
      captureDirection:
        'Capture the milestone gift page and one deposit route; use Blink if stable.',
      productionNotes: [
        'This is the customer distribution hook.',
        'Mention fiat on-ramp as KYB-pending unless MoonPay is approved and tested before final edit.',
      ],
      slots: [
        {
          id: 'screen-gift-deposit',
          label: 'Gift page deposit route',
          kind: 'screen-recording',
          status: 'needed',
          notes: 'Capture a tiny test amount or a staged deposit view.',
        },
        {
          id: 'proof-blink',
          label: 'Blink or Solana Action proof',
          kind: 'proof',
          status: 'needed',
          notes: 'Use only if the Blink path is clean enough to show.',
        },
      ],
    },
    {
      id: 'p05-solana-magic',
      title: 'Solana Under The Magic',
      durationSeconds: 24,
      speaker: 'tanda',
      approval: 'outline',
      objective: 'Connect the magical UX to Solana-specific infrastructure.',
      narration:
        'The magic leads. Solana keeps the value, proof, and action alive underneath: compressed NFTs, permanent storage, escrow, Blinks, and mobile wallet flows.',
      visualPlan:
        'Architecture overlay: cNFT, Arweave/Irys, Anchor escrow, gift link, Phantom.',
      captureDirection:
        'Use a diagram first, then quick proof shots from Phantom and explorer.',
      productionNotes: [
        'This must satisfy Colosseum without becoming the technical walkthrough.',
        'Keep one strong technical claim per visual beat.',
      ],
      slots: [
        {
          id: 'diagram-solana-stack',
          label: 'Solana stack diagram',
          kind: 'diagram',
          status: 'captured',
          path: 'colosseum-frontier-2026/diagrams/diagram-solana-stack-v1.png',
          notes: 'Simple layered map: UX, API, cNFT, storage, escrow, wallet.',
        },
        {
          id: 'proof-phantom-cnft',
          label: 'Phantom cNFT proof',
          kind: 'proof',
          status: 'needed',
          notes: 'Show the keepsake in Phantom or explorer.',
        },
      ],
    },
    {
      id: 'p06-mainnet-proof',
      title: 'Already Live',
      durationSeconds: 18,
      speaker: 'tanda',
      approval: 'outline',
      objective: 'Establish that this is not vaporware.',
      narration:
        'This is already live on mainnet. The program is deployed. The Merkle tree is live. Keepsakes display in Phantom.',
      visualPlan:
        'Explorer program page, Merkle tree proof, Phantom proof, app URL.',
      captureDirection:
        'Record short proof clips with sensitive data hidden.',
      productionNotes: [
        'Use real proof, but avoid overwhelming the pitch viewer.',
        'If explorer pages are visually noisy, crop and label only the meaningful parts.',
      ],
      slots: [
        {
          id: 'proof-program',
          label: 'Mainnet program proof',
          kind: 'proof',
          status: 'needed',
          notes: 'Program ID FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC.',
        },
      ],
    },
    {
      id: 'p07-founder-gtm',
      title: 'Founder And GTM',
      durationSeconds: 24,
      speaker: 'tanda',
      approval: 'outline',
      objective: 'Add founder-market fit and business path.',
      narration:
        'Sathian built this as a father first, then as a founder. Go-to-market is parents, family creators, cultural tooth-story videos, Solana Mobile, MoonPay on-ramp access after KYB, and the Solana community.',
      visualPlan:
        'Tanda host plus optional Sathian soundbite, social/content montage, Solana Mobile placeholder if ready.',
      captureDirection:
        'Record Sathian soundbite only if it improves trust; otherwise Tanda can carry it.',
      productionNotes: [
        'Keep this personal but not sentimental.',
        'Solana Mobile only appears if there is a real proof shot.',
      ],
      slots: [
        {
          id: 'audio-founder-soundbite',
          label: 'Founder soundbite',
          kind: 'audio',
          status: 'queued',
          notes: 'Use one 8 to 12 second Sathian clip if recorded.',
        },
        {
          id: 'proof-solana-mobile',
          label: 'Solana Mobile proof',
          kind: 'proof',
          status: 'needed',
          notes: 'Optional. Include only if packaging/store progress is accurate.',
        },
      ],
    },
    {
      id: 'p08-close',
      title: 'Sticky Solana Accounts',
      durationSeconds: 14,
      speaker: 'tanda',
      approval: 'outline',
      objective: 'Land the tagline and leave judges with a single remembered claim.',
      narration:
        'Tooth Fairy Network turns family milestones into sticky Solana accounts. The tooth fairy just got an upgrade.',
      visualPlan:
        'Tanda returns. App URL and final montage.',
      captureDirection:
        'Use approved avatar close clip plus app URL.',
      productionNotes: [
        'This line should be slow enough to remember.',
        'End cleanly; no extra feature list after the tagline.',
      ],
      slots: [
        {
          id: 'avatar-tanda-close',
          label: 'Tanda closing avatar clip',
          kind: 'avatar',
          status: 'queued',
          path: 'colosseum-frontier-2026/avatar/candidates/tanda-faye-ceo-still-v2.png',
          notes: 'Use the final two lines with confident delivery.',
        },
      ],
    },
  ],
};

const technical: ColosseumStoryboard = {
  kind: 'technical',
  title: 'Tooth Fairy Network',
  subtitle: 'Technical walkthrough storyboard',
  targetSeconds: 165,
  scenes: [
    {
      id: 't01-stack-overview',
      title: 'Stack Overview',
      durationSeconds: 18,
      speaker: 'narrator',
      approval: 'outline',
      objective: 'State what was built and orient judges technically.',
      narration:
        'Tooth Fairy Network is a Next.js consumer app backed by Solana mainnet infrastructure: Anchor escrow, compressed NFTs, Arweave/Irys storage, and wallet flows.',
      visualPlan: 'Architecture diagram plus a quick app landing page pass.',
      captureDirection: 'Capture app landing and prepare static architecture diagram.',
      productionNotes: [
        'No market story here. Start with implementation.',
        'Tanda can appear only as a small bumper if useful.',
      ],
      slots: [
        {
          id: 'diagram-tech-stack',
          label: 'Technical stack diagram',
          kind: 'diagram',
          status: 'captured',
          path: 'colosseum-frontier-2026/diagrams/diagram-solana-stack-v1.png',
          notes: 'Next.js, API routes, Anchor, Bubblegum, Arweave/Irys, Phantom, Blinks.',
        },
      ],
    },
    {
      id: 't02-user-flow',
      title: 'User Flow',
      durationSeconds: 28,
      speaker: 'narrator',
      approval: 'outline',
      objective: 'Show the app flow from keepsake creation to gift link.',
      narration:
        'The user flow starts with the emotional moment, then wallet connection, permanent keepsake, and family gift link.',
      visualPlan: 'Screen recording of /toothfairy/app through keepsake preview and gift page.',
      captureDirection: 'Use same raw product pass as pitch, with slower cuts.',
      productionNotes: [
        'Show interaction states clearly.',
        'Use captions to label steps rather than narrating every click.',
      ],
      slots: [
        {
          id: 'screen-tech-user-flow',
          label: 'Technical user-flow capture',
          kind: 'screen-recording',
          status: 'needed',
          notes: 'Record a clean end-to-end user path.',
        },
      ],
    },
    {
      id: 't03-anchor-program',
      title: 'Anchor Program',
      durationSeconds: 34,
      speaker: 'narrator',
      approval: 'outline',
      objective: 'Explain the on-chain account model and instructions.',
      narration:
        'The core is an Anchor escrow program. Child profile, milestone, deposit, and treasury PDAs model the family savings state on chain.',
      visualPlan: 'PDA diagram, instruction list, maybe short code crop.',
      captureDirection:
        'Capture program file or use a diagram generated from product spec; avoid scrolling code too long.',
      productionNotes: [
        'Judges want reasoning, not code theater.',
        'Use the program ID as proof, but explain why the design matters.',
      ],
      slots: [
        {
          id: 'diagram-pda-model',
          label: 'PDA account model diagram',
          kind: 'diagram',
          status: 'captured',
          path: 'colosseum-frontier-2026/diagrams/diagram-pda-model-v1.png',
          notes: 'Guardian, child wallet, child profile, milestone, deposit PDA, treasury.',
        },
        {
          id: 'proof-anchor-code',
          label: 'Anchor code proof',
          kind: 'proof',
          status: 'needed',
          notes: 'Short crop of instructions or IDL, no secrets.',
        },
      ],
    },
    {
      id: 't04-cnft-storage',
      title: 'cNFT And Storage',
      durationSeconds: 26,
      speaker: 'narrator',
      approval: 'outline',
      objective: 'Show why compressed NFTs and permanent storage fit the product.',
      narration:
        'Metaplex compressed NFTs make the keepsake cost practical. Arweave/Irys preserves the image and metadata beyond the current web app.',
      visualPlan: 'Merkle tree, metadata proof, Phantom cNFT proof.',
      captureDirection: 'Capture cNFT proof and metadata URL if available.',
      productionNotes: [
        'Be explicit: cheap enough for consumer milestones.',
        'Do not overpromise permanence beyond what Arweave/Irys actually provides.',
      ],
      slots: [
        {
          id: 'proof-cnft-storage',
          label: 'cNFT and metadata proof',
          kind: 'proof',
          status: 'needed',
          notes: 'Phantom/explorer plus Arweave/Irys metadata.',
        },
      ],
    },
    {
      id: 't05-actions-onramp-mobile',
      title: 'Actions, On-Ramp, Mobile',
      durationSeconds: 27,
      speaker: 'narrator',
      approval: 'outline',
      objective: 'Show portable distribution and family-friendly entry points.',
      narration:
        'Gift pages and Blinks make the deposit action portable. The MoonPay path is prepared for non-crypto parents and will move from planned proof to live proof after KYB approval.',
      visualPlan: 'Gift page, Blink proof, KYB-pending MoonPay on-ramp overlay, optional Solana Mobile.',
      captureDirection: 'Capture stable proof only; show MoonPay as pending unless KYB approval lands and the flow is tested.',
      productionNotes: [
        'MoonPay is a strategic point, not live proof until KYB is approved and verified.',
        'Separate live proof from near-term roadmap visually.',
      ],
      slots: [
        {
          id: 'proof-actions',
          label: 'Solana Action or Blink proof',
          kind: 'proof',
          status: 'needed',
          notes: 'Show deposit route portability.',
        },
        {
          id: 'proof-moonpay',
          label: 'MoonPay KYB-pending on-ramp point',
          kind: 'proof',
          status: 'queued',
          notes: 'Mention as KYB-pending. Upgrade to live proof only after approval and a clean test capture.',
        },
      ],
    },
    {
      id: 't06-why-solana',
      title: 'Why Solana',
      durationSeconds: 22,
      speaker: 'narrator',
      approval: 'outline',
      objective: 'Close with technical reasoning.',
      narration:
        'Solana is the right substrate because the experience needs to feel instant, inexpensive, mobile-native, and composable.',
      visualPlan: 'Four-part decision overlay with app/proof montage.',
      captureDirection: 'Use polished overlays over proof footage.',
      productionNotes: [
        'This is the technical closer, not another pitch closer.',
        'End with working product, not roadmap.',
      ],
      slots: [
        {
          id: 'diagram-why-solana',
          label: 'Why Solana decision overlay',
          kind: 'diagram',
          status: 'captured',
          path: 'colosseum-frontier-2026/diagrams/diagram-why-solana-v1.png',
          notes: 'Speed, cost, cNFT scale, mobile wallets, portable actions.',
        },
      ],
    },
  ],
};

export const colosseumStoryboards = {
  pitch,
  technical,
} as const;

export const framesForSeconds = (seconds: number) =>
  Math.round(seconds * COLOSSEUM_FPS);

export const framesForStoryboard = (kind: keyof typeof colosseumStoryboards) =>
  colosseumStoryboards[kind].scenes.reduce(
    (total, scene) => total + framesForSeconds(scene.durationSeconds),
    0,
  );
