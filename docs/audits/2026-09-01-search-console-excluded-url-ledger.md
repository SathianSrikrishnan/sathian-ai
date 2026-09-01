# Sathian.ai Search Console cleanup ledger

Date: 2026-09-01

Search Console snapshot: last updated 2026-08-27

Scope: read-only review. No Search Console setting or production route was changed.

## Simple truth

- **63 URLs are indexed. 173 are not indexed.** The prior heartbeat showed 66 and 169, so the latest report is down 3 indexed and up 4 excluded.
- This is **not 173 useful pages failing**. At least 138 rows are old deployment files or retired URLs: 46 reported 404s and 92 crawled-but-not-indexed URLs.
- The report shows **zero server-error (5xx) URLs**. No penalty signal was found in this indexing report.
- Google does not need to index old JavaScript, CSS, image variants, private tools, duplicate URLs, or retired Tooth Fairy pages.

## Filtered exclusion ledger

| Search Console group | Count | What it mostly contains | Decision |
|---|---:|---|---|
| Crawled, not indexed | 92 | Old Next.js assets, retired Tooth Fairy surfaces, image/OG endpoints, and subdomain assets | Intentional exclusion for assets/retired surfaces; review only a future current content URL if one appears |
| Not found (404) | 46 | 19 stale deployment assets, 20 retired Tooth Fairy URLs, 7 obsolete root routes | Let assets and obsolete roots remain 404; retired Tooth Fairy pages now redirect where an equivalent exists |
| Google chose another canonical | 12 | Tooth Fairy keepsake URL variants | Intentional duplicate consolidation |
| Alternate page with canonical | 9 | Tooth Fairy query-string and keepsake variants | Intentional duplicate consolidation |
| Page with redirect | 7 | HTTP/www variants, `/automation`, and old Tooth Fairy stories | Intentional |
| Blocked by robots.txt | 5 | Private/retired Tooth Fairy routes and `/studio` | Intentional |
| Excluded by `noindex` | 1 | Retired garden lab page | Intentional |
| Duplicate without user canonical | 1 | Retired `/toothfairy/about` | Already covered by the Tooth Fairy retirement; wait for recrawl |
| Server error (5xx) | 0 | None | Healthy |

## Live route checks

- Retired content such as `/toothfairy/story/quiet-key` and `/toothfairy/privacy` now returns a permanent `308` to `https://toothfairy.network/`.
- A retired static directory such as `/toothfairy/animation/live-hero-v1/` returns `404`, which is correct because there is no equivalent page.
- `/app`, `/app/new`, `/story`, `/network/technical`, `/network/market`, `/terms`, and `/privacy` return `404`. They are not in the sitemap and have no current personal-site equivalent, so redirecting them to the homepage would be misleading.
- The personal sitemap contains only current canonical pages. Robots rules keep private and legacy product areas out of the personal-site crawl surface.

## Organic baseline

Complete periods from the 2026-08-31 measurement receipt:

- Last 7 complete days: 13 active people, 29 visits, 8 engaged visits (27.59%).
- Previous 7 complete days: 40 active people, 51 visits, 13 engaged visits (25.49%).
- Last 28 complete days: 69 active people, 138 visits, 53 engaged visits (38.41%).
- Luma: 6 visits in the current 7-day period versus 7 previously.
- Instagram-tagged social: 5 visits versus 1 previously.
- `Inside MonkeDAO`: 3 visits, 1 active person, about 46 seconds average engagement.
- Site-agent notes: 0 in the last 7 complete days.
- Search Console, last 28 complete days: 3 clicks, 119 impressions, 2.5% click-through rate, average position 19.7.
- Search query `sathian`: 7 impressions and 0 clicks. This is the branded-search starting line.

## Weekly scorecard

Track only five numbers each week:

1. Google impressions, clicks, and average position for `sathian`.
2. Engaged visits from organic social.
3. Independent sites that send a visit.
4. Visits and engagement time on the newest writing or project.
5. Completed site-agent notes (`agent_note_sent`).

## One-action growth loop

Publish or improve one useful public item each week, then distribute that same item through one primary channel. Use tagged links so GA4 can name the source:

- Instagram: `utm_source=instagram&utm_medium=social`
- Substack: `utm_source=substack&utm_medium=referral`
- Luma: `utm_source=luma&utm_medium=referral`
- Stanley bot: `utm_source=stanley&utm_medium=agent`

Measure the landing page, engaged visits, and any agent notes one week later. No ads or Meta Pixel are needed for this loop.

## Next release action

After the identity changes are deployed, inspect the live homepage and About page, then request indexing for those two URLs. Do not request indexing for asset URLs, retired product routes, duplicates, or private pages. The weekly heartbeat should watch the counts rather than reacting to every excluded row.
