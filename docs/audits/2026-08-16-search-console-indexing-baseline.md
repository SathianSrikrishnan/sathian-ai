# Search Console indexing baseline

Date inspected: 2026-08-16  
Search Console data last updated: 2026-08-09  
Property: `sc-domain:sathian.ai`

## Executive summary

The headline totals do not represent 136 useful pages that need deleting or restoring.

| Search Console group | Total | Classification | Decision |
| --- | ---: | --- | --- |
| Not found (404) | 48 | 19 expired Next.js build assets; 29 old page-like paths | No bulk action. The assets and pages are already absent. Keep a real 404 where there is no exact replacement. |
| Crawled, currently not indexed | 88 | 63 transient Next.js assets; 11 generated images/manifests; 14 page-like URLs | 74/88 are not normal search-result pages. The 14 page-like URLs are predominantly Tooth Fairy/prototype surfaces intentionally excluded from the personal sitemap. |

No repository file, public content, Search Console record, or route was deleted during this audit. Search Console is reporting historical crawl observations; deleting local files cannot erase those observations.

## The 48 not-found URLs

All 29 page-like examples still return HTTP 404 in production on 2026-08-16.

### Retired/unpublished Tooth Fairy story paths (16)

- `/toothfairy/story/true-mark`
- `/toothfairy/story/quiet-key`
- `/toothfairy/story/rootlight-lesson`
- `/toothfairy/story/first-keeper-to-say-no`
- `/toothfairy/story/first-rule-light`
- `/toothfairy/stories/ethiopian-hyena`
- `/toothfairy/story/hyena-story`
- `/toothfairy/story/north-africa`
- `/toothfairy/story/jamaica`
- `/toothfairy/story/babylonia`
- `/toothfairy/story/finland`
- `/toothfairy/story/ireland`
- `/toothfairy/story/japan`
- `/toothfairy/story/ethiopia`
- `/toothfairy/story/cherokee`
- `/toothfairy/story/tooth-fairy`

These are not in the current seven-story public shelf. Their source material can remain preserved without reopening the URLs. Redirecting all of them to a generic homepage would create misleading soft redirects.

### Missing policy paths (4)

- `/privacy`
- `/terms`
- `/toothfairy/privacy`
- `/toothfairy/terms`

This is a privacy/content-governance decision, not “SEO junk.” Before adding Meta or broader advertising tracking, create a truthful personal-site privacy notice and consent choice. The current separate Tooth Fairy site already serves `/privacy` and `/terms`; any cross-domain redirects should be added only after confirming the desired ownership boundary.

### Retired navigation/app/prototype paths (8)

- `/app`
- `/app/new`
- `/story`
- `/network/market`
- `/network/technical`
- `/toothfairy/network/market`
- `/toothfairy/network/technical`
- `/toothfairy/animation/live-hero-v1/`

### Old subdomain path (1)

- `https://toothfairy.sathian.ai/toothfairy/network/market`

### Expired framework assets (19)

Nineteen examples are old `/_next/static/` font or CSS build URLs. Each deployment produces hashed asset names. These historical hashes are already absent and should age out of Google's crawl history; they are not content pages and there is nothing useful to restore or delete.

## The 88 crawled-but-not-indexed URLs

### Non-page assets (74)

- 63 old `/_next/static/` CSS/font URLs.
- 11 Open Graph image, keepsake image, or manifest URLs.

Google declining to index these as search-result pages is expected and harmless.

### Page-like examples (14)

- `https://agenttab.sathian.ai/`
- `/toothfairy/stories/hungarian-kiseger`
- `/toothfairy/visual-system`
- `/toothfairy/story/tanda`
- `/toothfairy/faq`
- `/toothfairy/stories/italian-topolino`
- `/toothfairy/app/dashboard`
- `/toothfairy/stories`
- two dynamic `/toothfairy/keepsake/<id>` URLs
- `/toothfairy/stories/salvadoran-rabbit`
- `/toothfairy/stories/vietnamese-roof-bed`
- `https://toothfairy.sathian.ai/`
- `https://toothfairy.sathian.ai/market`

The personal-domain robots policy excludes `/toothfairy/*`, and the personal sitemap intentionally contains only the portfolio, writings, hackathons, and two project pages. Most of this group is therefore working as designed rather than failing to rank.

## Safe cleanup baseline

1. Do not bulk-delete or redirect these groups.
2. Keep an intentional 404/410 when retired content has no close replacement.
3. Add a permanent redirect only when one old URL has one genuinely equivalent live destination.
4. Keep old source/assets in the repository or archive until the separate preservation-first asset migration.
5. Recheck Search Console after 30 days. The useful success signal is that legacy groups shrink while the current sitemap pages gain impressions—not that every non-page asset becomes indexed.

Google's official guidance supports real 404/410 responses for removed content and warns against irrelevant redirects: https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors. Search Console's crawled-not-indexed state should be investigated on representative valuable pages using URL Inspection, not treated as a bulk-deletion list: https://support.google.com/webmasters/answer/9012289.
