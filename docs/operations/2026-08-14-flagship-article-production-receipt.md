# Flagship article production receipt

Date: 2026-08-14

## Release

- Production commit: `4975f7e8d329a2c6d20be80fe659bd04a0cdfe6c`
- Deployment: `dpl_AJCAiR6n8EMGs7btUd3P3vjo6nuU`
- Deployment URL: `https://sathian-c2aob5udg-sathiansrikrishnans-projects.vercel.app`
- Production alias: `https://sathian.ai`
- Article: `https://sathian.ai/writings/saraswati-lakshmi-and-the-ledger`

## What changed

- The homepage site agent remains above Featured Work.
- *Saraswati, Lakshmi, and the Ledger* is the first Featured Work item.
- Tooth Fairy Network and AutoQuote Automator remain below it.
- The essay is the newest item on the homepage Writing preview and `/writings`.
- The interactive editorial experience, six image assets, two tests, visual reel,
  source links, and real Sathian profile photograph are published at the
  canonical writing URL.
- Reviewed public-agent context identifies it as the newest featured writing
  without replacing the separate latest Draw with Tanda release.

## Verification evidence

- `npm run test:unit`: 53 files and 377 tests passed.
- `npm run build`: production build and type checks passed locally.
- Vercel production build: ready and aliased to `sathian.ai`.
- `tests/browser/flagship_article_release_check.cjs`: passed against local
  production and `https://sathian.ai` at desktop and mobile sizes.
- Browser proof covered homepage order, Writing order, all article images,
  checkbox interaction, horizontal overflow, and WCAG 2 A/AA checks for the
  new featured card, writing entry, and complete essay.
- `/`, `/writings`, the article, `/sitemap.xml`, and `/robots.txt` returned 200.
- A live site-agent question — “What is Sathian's newest featured writing?” —
  returned the correct essay title and the Writing next action.
- Screenshots: `docs/audits/2026-08-14-flagship-article-release/`.

## Known inherited issue

The existing homepage rust utility color (`#B84E1A`) does not meet AA contrast
at its smallest text sizes on the paper background. This predates the release
and affects multiple old homepage elements. The new featured card and newest
Writing entry use a local darker rust override. A global palette adjustment is
deferred to a separate visual review so an article release does not silently
change the established sitewide theme.

## Review cadence

This is deployment one of the planned three-pass editorial review. The next
pass should evaluate copy density, the homepage crop, the personal-photo
placement, and whether the bridge to Solana Observatory is obvious enough.

## Deployment two

- Production commit: `889c86cdce07a8d20a4b70ef874af28405f8eaca`
- Deployment: `dpl_Cq8br3SVkSs5bWxqcMboSwrSPwrR`
- Deployment URL: `https://sathian-ju77hld2h-sathiansrikrishnans-projects.vercel.app`
- Production alias: `https://sathian.ai`
- The author photograph is retained in a quieter byline aligned to the reading column.
- The first visual-reel frame now preserves the complete paired image instead of cropping it.
- The reel reports the current frame and retains swipe and arrow navigation.
- Both Observatory calls to action now resolve to the live dashboard.
- `npm run test:unit`: 54 files and 380 tests passed.
- `npm run build`: production build and type checks passed locally and on Vercel.
- Live desktop and 390px mobile checks passed image loading, alignment, interaction,
  horizontal-overflow, and scoped Axe accessibility checks.
