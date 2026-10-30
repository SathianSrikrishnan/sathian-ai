# Village and homepage review candidate — October 30, 2026

Writer: Codex. Isolated checkout: `C:/Users/sathi/Documents/Codex/2026-10-30/task/village-review`. Branch: `feat/village-home-review-20261030`. Base: `6821b625a21d25a5291f26daccdfaec386e9e8fa` (PR #44 production). The canonical checkout is behind and dirty; it was preserved. No merge or production promotion is part of this candidate.

## Direction and source checks

Owner asked to revise Village and the homepage, use more drawings/product views, keep plain language, and check Google discoverability. The earlier page-by-page proposal was approved in chat.

Read the project routing/release instructions and the latest Claude handoff. Local research found in `Projects/_ops/2026-10-30-SESSION-HANDOFF.md`, `2026-10-30-VILLAGE-STRATEGY-BRIEF.md`, `HALO-VOICE-OF-CUSTOMER.md`, and the First 20 video/photo brief. The Halo bank explicitly names Sabri Suby and warns that extracted quotes need checking against live sources. This candidate uses the themes of distance, meaningful keepsakes and drawings; it publishes no customer quotes or testimonial/traction claims.

## Changes

- Village shows a concrete gift first, three product panels, parent/giver/child roles, four steps, an example of deposits adding up, a drawing spread, founder note and request form. Future app plans are a small disclosure with no launch or access promise. Public reviews remain optional, honest and disclosed as a free gift.
- Homepage leads with Village and a real printed Proof, followed by a compact chat opener. Projects/writing remain available. Chat opens with keyboard focus and returns focus to its opener when closed.
- Keep the existing free printed Proof plus US$10 offer. No quantity limit, deadline, shipping promise, new financial commitment, price or payment-flow change. The wallet is called digital money on Solana; no guaranteed return, lifetime custody or insured-bank claim.
- Village becomes indexable and gets canonical/OG/Twitter metadata. Sitemap adds Village, `/learn/stablecoin` and the Pluto article. Farcaster explicitly says test build and has deliberate noindex: remove it from sitemap rather than exposing the test. Add a canonical and OG URL to the older rewritten static Polytheistic Test essay. Studio, API and other private routes are not added.
- Existing hosted Site Agent Quality workflow gains a mocked Village campaign browser check. Existing chat checks open the newly collapsed homepage chat deliberately.

## Asset provenance

Existing hero/map illustrations remain labeled marker-style illustrations, not actual children's artwork. Added `proof-in-hand.webp` and `proof-detail.webp` are the existing sanitized public-product photos documented in `Projects/_ops/proof-product-shots-2026-10-30/NOTES.md`: adult hand, no faces, personal name/QR blurred, earlier printed cover design. `sample-inside-love.webp`, `sample-inside-wallet.webp` and `sample-certificate.webp` come from `tooth-fairy-network/design/money-relationships-2026-10-27/book-no2-example/` and are explicitly fictional/sample designs. The certificate itself says sandbox/no real gift. They are not live-wallet screenshots. No private child media, paid generation or new media upload service was used.

## Verification and limits

Local final results: 546/546 unit checks, 60/60 offline agent cases, production build/type/lint checks, and critical production-dependency threshold all pass. The dependency audit still reports 57 existing lower-severity issues (15 low, 23 moderate, 19 high); no dependency change was made.

Quiet headless campaign check passes at 1440×1000, 390×844 and 320×740. It covers one H1, correct canonical/indexability, all page images, zero horizontal overflow, collapsed chat and repeated keyboard opening/closing with returned focus, required form validation, mocked failure/input preservation/retry/success, Village source fields and unchecked updates opt-in. Village passes the existing plain-language checker (below grade 5, no very hard sentences). Desktop and 390px screenshots were inspected. A lazy optimized founder portrait stalled in Chromium; using the original static 42 KB portrait resolved it. The nested headings and paragraph spacing were corrected after visual inspection.

Local public sitemap audit: all 36 listed URLs return 200, have the expected canonical, and allow indexing. This uses built-in article fallback, so configured preview must also verify database-published writing. Intentional noindex test surfaces remain excluded.

Evidence in `C:/Users/sathi/Documents/Codex/2026-10-30/task/`: `village-build.log`, `village-unit.log`, `village-eval/`, `village-audit.log`, `village-browser.log`, `village-seo-audit.json`, and `village-review-proof/` (six final screenshots plus `checks.json`).

Draft review: https://github.com/SathianSrikrishnan/sathian-ai/pull/45. Hosted quality/canary and Vercel preview checks were pending at the local handoff; inspect the final head's status before release. Production is unchanged.

The first build failed because this isolated checkout had no environment configuration. Automatic approval review denied copying `.env.local` from another worktree due to possible secret duplication; that copy did not execute and was not retried. Local checks instead use explicit non-secret Supabase placeholders at an unused localhost port and built-in article fallback. They do not validate the live database or delivery integration. Protected CI must validate configured preview behavior.

No local media playback, production form submission, ad click, purchase, registration, external message or Luma change. Local browser checks block analytics and mock submission endpoints. The full local `release:verify` playback step is intentionally not run under the quiet-PC restriction; equivalent hosted quality/canary/mobile-playback checks remain required before release.

Indexability is not confirmation of Google's index status. Search Console inspection/submission remains after approved production release. Google says recrawling can take days to weeks and inclusion is not guaranteed: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl.

## Remaining owner/product inputs

The short founder video and new current-edition product photos would improve the next revision; this candidate does not block on them. Giveaway count and exact fulfillment terms remain unanswered, so none were invented. Claude's notes name Tanda but do not define a separate second fairy's commercial role; no new character/function is invented.
