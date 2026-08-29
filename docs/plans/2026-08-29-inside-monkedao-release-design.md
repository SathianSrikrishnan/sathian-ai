# Inside MonkeDAO Release Design

Date: 2026-08-29 EDT  
Status: APPROVED FOR IMPLEMENTATION AND SITE DEPLOYMENT

## Decision

Publish `Inside MonkeDAO` as a custom editorial feature at
`/writings/inside-monkedao` inside the existing `sathian.ai` application. Preserve the
approved forest/ivory/Solana visual language and video-first reading order. Add a normal
published-article registry entry so the feature appears as the newest writing without
changing the approved homepage structure.

The public page will use only the verified V1.9 film, the compact field report, the owner
Monke image, official credited marks, and bounded first-hand claims. Private source media,
private transcripts, edit ledgers, phone metadata, and private working labels are excluded.

## Options considered

1. **Custom route in the existing site — selected.** Preserves the approved feature layout,
   gives the film and report one canonical URL, and fits the current deployment system.
2. **Generic article-renderer entry.** Faster, but loses the approved video-first composition
   and the distinctive opening cover.
3. **Separate microsite.** Offers maximum freedom, but fragments the existing audience and
   creates a second hosting and analytics surface.

## Release architecture

```text
verified V1.9 film ──> approved public media host ─┐
compact report ───────────────────────────────────┼─> custom Next.js feature route
approved images + source credits ────────────────┘                │
                                                                  ├─> homepage newest-writing entry
                                                                  └─> canonical URL for Substack/submission
```

The Substack version is a channel adaptation of the canonical site feature, not a second
source of truth. It will be prepared locally; saving or publishing it on Substack remains a
separate representational action.

## Visual and editorial contract

- Keep the approved opening cover and forest/ivory/Solana accent system.
- Lead with the film and a plain-English premise for crypto-curious readers.
- Keep the report in the approved compact range; preserve first-hand versus desk-research
  labels and direct timestamp links where the player permits them.
- Use `Benny` only. Never expose a surname or any private source/transcript path.
- Identify the owner asset as `SMB Gen3 #13769`; do not state a purchase price because the
  supplied screenshot does not establish it.
- Frame MonkeDAO as one investigated community, not as proof of a universal claim.
- Link the future Solana dashboard as a related field-note surface only after its separate
  review; do not silently edit that project in this release.

## Validation and rollback

- Caption sweep must prove zero selected occurrences of `Slana` and correct all rendered
  instances to `Solana` before public upload.
- Film gates: duration/stream/hash/loudness checks, privacy scan, caption scan, and frame
  inspection around the corrected captions.
- Site gates: unit tests, production build, release verification, keyboard/contrast/overflow
  checks, and desktop/mobile screenshots.
- Production deployment must leave the previous deployment intact if verification fails.
- No Substack publication, social posting, bounty submission, or external messaging is
  authorized by this design.

