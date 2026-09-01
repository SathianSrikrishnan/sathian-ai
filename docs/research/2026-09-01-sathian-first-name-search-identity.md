# “Sathian” as the public search identity

Date: 2026-09-01

Scope: first-party Google Search guidance and a read-only repository inspection. No production code, configuration, or account setting was changed.

## Decision

Use **Sathian** as the visible public brand and site name. Keep **Sathian Srikrishnan** on the dedicated About/ProfilePage and in the underlying Person entity so Google has enough information to distinguish this Sathian from other people.

This does not require repeating the full name across every page. It requires one coherent identity graph:

```text
Sathian (public site name and byline)
  -> Sathian Srikrishnan (canonical Person on /about)
  -> sathian.ai (canonical home)
  -> maintained social, event, publication, and project profiles
```

Google does not offer a mechanism to reserve a first name, guarantee first position, or force a particular title, site name, crawl, or index result. The practical goal is to give Google consistent, corroborating signals until `Sathian` becomes strongly associated with this person and domain.

## Recommended identity pattern

### 1. Make “Sathian” the site-level preference

On the home page, align the visible identity, prominent heading, `<title>`, `og:site_name`, and home-page `WebSite` structured data around **Sathian**. Keep `sathian.ai` as a fallback `alternateName`; “Digital Experiments” can remain an editorial descriptor, not a competing site name.

Google creates site names automatically from the home page, references elsewhere on the web, and especially `WebSite` structured data. It recommends a unique, concise, commonly recognized name used consistently on the home page, and allows ordered `alternateName` values. A preference is not a command. ([Google: site names](https://developers.google.com/search/docs/appearance/site-names))

Per-page title links should stay descriptive and distinct—for example, `Inside MonkeDAO — Sathian`—with one visually clear main heading. Google may form title links from `<title>`, the visible main title, headings, Open Graph title, anchor text, inbound-link text, and other page content. ([Google: title links](https://developers.google.com/search/docs/appearance/title-link))

### 2. Keep the full identity once, clearly and visibly

Keep `/about` as the canonical profile page. Its main visible identity can say **Sathian**, while a natural sentence or secondary line makes **Sathian Srikrishnan** explicit. Its `ProfilePage.mainEntity` should reuse one stable Person `@id` site-wide.

For the Person entity, the strongest disambiguation pattern is:

- `name`: `Sathian Srikrishnan`
- `alternateName`: `Sathian` and any genuinely used public variant
- `url`: the canonical `/about` URL
- `sameAs`: only maintained profiles that actually represent Sathian
- stable `@id`: reused by the home page, About page, and writings

Google recommends a real name in `Person.name`, an alternate public identifier in `alternateName`, and external identity URLs in `sameAs`. It recognizes an About Me page focused on one person as a valid `ProfilePage`. Structured data must match the page’s visible subject; it should not be hidden or misleading. ([Google: ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [Google: structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies))

### 3. Make every authored work resolve to that Person

Visible bylines may say **Sathian** if that is the chosen public byline, but each byline should link to `/about`. Article structured data should use a `Person` author and the profile URL or the same stable Person `@id`. Do not mix unrelated identities such as `Sathian`, `Sathian S.`, and the full name without making their relationship explicit.

Google strongly recommends `author.@type` plus an author `url` or `sameAs` to clarify who wrote an article. ([Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article))

## Cleanup and consolidation

1. **One preferred URL per useful page.** Put a self-referencing canonical on the preferred page, link internally to that URL, and list that URL—not duplicates—in the sitemap. Redirects and `rel="canonical"` are strong canonical signals; sitemap inclusion is weaker. ([Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls))
2. **Moved page with a real replacement:** use a permanent server-side `301` or `308` redirect to the closest equivalent. ([Google: redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects))
3. **Retired page with no replacement:** return a real `404` or `410`; remove it from internal links and the sitemap. Do not send unrelated retired URLs to the home page, which can create soft-404 behavior. ([Google: crawling errors and soft 404s](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors))
4. **Important current page:** ensure at least one contextual internal link points to it. Use descriptive anchor text such as `Sathian’s Solana field research`, not `click here`. Google says every important page should be linked from another page and that descriptive anchors help people and Google understand the destination. ([Google: link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable))
5. **Sitemap:** include only canonical, indexable pages worth finding. A sitemap helps discovery, particularly for a new site with few external links, but does not guarantee crawling or indexing. ([Google: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview))

## What adds evidence beyond social profile links

The next gains are not more self-authored identity claims. They are independent, relevant references:

- event and speaker pages that identify **Sathian** and link to `sathian.ai`;
- collaborator, community, interview, podcast, and project pages that use the same public name and point to the most relevant Sathian.ai page;
- original writings and working projects that other people have a reason to cite;
- contextual links among Sathian’s own essays, projects, About page, and homepage.

This follows Google’s documented use of web references and inbound-link text when generating site names and title links. It is evidence-building, not a backlink-volume exercise.

## Repository baseline and next implementation pass

The repository already provides one stable Person `@id`, full `name`, `Sathian` alternate names, social `sameAs` URLs, an indexable `/about` ProfilePage, article-author markup, canonical metadata, and a generated sitemap. The next implementation pass should be narrow:

1. change the site-level preference from `Sathian Srikrishnan` to `Sathian` while retaining the full Person identity;
2. normalize visible bylines and author references so they all resolve to `/about` and the same Person `@id`;
3. export the Search Console excluded-URL list and classify each URL as **keep/improve**, **redirect**, **404/410**, or **duplicate/canonical** before editing routes;
4. verify the home, About page, representative writings, canonicals, sitemap, and internal links after the change; then request recrawling for the home and About pages.

## Limits

Google says it does not guarantee that it will crawl, index, or serve a page, even when the page follows Search Essentials. Correct structured data only makes a page eligible for supported treatments; it does not guarantee display. Search results also vary with relevance and context such as location, language, and device. ([Google: how Search works](https://developers.google.com/search/docs/fundamentals/how-search-works), [Google: structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies))

The measurable success condition is therefore not “Google guarantees Sathian.” It is that branded searches for `Sathian` increasingly show Sathian.ai and corroborating maintained profiles, while Search Console records more branded impressions, clicks, and indexed high-value pages over time.
