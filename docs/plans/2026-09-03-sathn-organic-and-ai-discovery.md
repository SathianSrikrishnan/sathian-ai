# SATHN organic and AI discovery plan

Date: 2026-09-03
Scope: `sathian.ai` only. Homeland Contractors and Tooth Fairy Network are explicitly out of scope for this release.

## Objective

Build a durable public identity graph so that `Sathian`, `Sathian Srikrishnan`, `SATHN`, and `sathian.ai` consistently refer to the same person and body of work. Improve discovery through useful original work and independent references, without ads, keyword stuffing, or claims that search placement can be guaranteed.

The realistic order of operations is:

1. Own the full-name result and canonical profile.
2. Strengthen the association between the first name, full name, site, and maintained profiles.
3. Seed `SATHN` as a deliberate public search handle and earn corroborating references over time.

## What the first Analytics email establishes

Google Analytics reported the period August 6 to September 2, 2026:

- 70 active users, up 133.33% from the previous period.
- 66 new users, up 120%.
- 826 events, up 129.44%.
- 1 minute 34 seconds average engagement time, down 31.31%.
- The homepage, Writing, Hackathons, Inside MonkeDAO, and Studio all received traffic.

This proves that the measurement layer is collecting activity. It does not prove that all 70 identifiers were separate humans, nor does it establish that search or AI engines already understand the `SATHN` identity. GA4 user counts may include returning devices, internal visits, automated traffic that passed collection, and modeled data. The 12 Studio users with a 100% bounce rate are a specific segment to investigate before treating the total as an audience count.

## Baseline already in place

The September 1 identity release established:

- One canonical `Person` entity at `https://sathian.ai/#sathian`.
- A real `/about` ProfilePage.
- A `WebSite` entity and consistent visible Sathian bylines.
- Maintained social/profile links connected with `sameAs`.
- Search Console indexing requests for `/` and `/about`.

The August 31 Search Console baseline was 3 clicks, 119 impressions, 2.5% click-through rate, and average position 19.7 over 28 days. The query `sathian` had 7 impressions and no clicks. These are starting measurements, not evidence of an established branded-search position.

## Release 1 — implemented locally

- Add `SATHN` as a visible, truthful short search handle on the homepage and About page.
- Add `SATHN` to the canonical Person and WebSite alternate names.
- Give the public site agent a reviewed identity card so “Who is SATHN?” resolves to Sathian Srikrishnan and `/about`.
- Add `/agents`, `/links`, and `/projects/solana-observatory` to the sitemap.
- Add `CreativeWork` authorship and `VideoObject` markup to Solana Observatory.
- Add `VideoObject` markup to the existing Inside MonkeDAO Article.
- Preserve the existing crawler policy: search and reference access are allowed while training crawlers are separately restricted.

Release 1 deliberately does not add an `llms.txt` ranking claim. Google says its normal crawl, index, content, and structured-data requirements also apply to AI features and that no new AI text file or special schema is required.

## Release 2 — after production approval

1. Deploy only after the full site release gate is green and explicit production approval is given.
2. Verify the live HTML, canonical URLs, JSON-LD, sitemap, robots response, desktop/mobile layout, and both playable videos.
3. Request Search Console recrawls for:
   - `/about`
   - `/agents`
   - `/projects/solana-observatory`
   - `/writings/inside-monkedao`
4. Inspect real edge logs or verified-bot controls before concluding that OAI-SearchBot, Claude-SearchBot, or PerplexityBot is blocked. A locally spoofed crawler user agent is not proof of real crawler access.

## The repeatable content loop

Every one to two weeks, publish one canonical original work on `sathian.ai`:

1. **Make:** a useful artifact, experiment, field report, dataset, mini app, or clearly argued essay.
2. **Explain:** add first-person evidence, named sources, limitations, author/date metadata, and one canonical URL.
3. **Connect:** link the work to `/about`, the relevant project, related writing, and a public proof source where one exists.
4. **Distribute:** publish a shorter Substack edition and native social posts that point back to the canonical page. Avoid cloning the entire article across uncontrolled URLs.
5. **Corroborate:** ask relevant communities, events, repositories, or collaborators to link to the canonical work when it is genuinely useful. Independent references are the part the site's own schema cannot manufacture.
6. **Measure:** review branded queries, landing pages, referring domains, engagement, and conversions one week and four weeks after publication.

Use consistent campaign tags for outbound distribution, for example:

```text
utm_source=substack|linkedin|x|instagram|luma
utm_medium=newsletter|organic_social|community
utm_campaign=<canonical-content-slug>
```

## 90-day scorecard

Track weekly, compare monthly:

| Outcome | Primary measure | Diagnostic measures |
| --- | --- | --- |
| Identity recognition | Search Console impressions/clicks for `sathian`, `sathian srikrishnan`, and `sathn` | Average position, result URL, branded CTR |
| Content discovery | Organic entrances to new writing/project pages | Indexed status, impressions by page, referring domains |
| Human attention | Engaged sessions and average engagement by landing page | New/returning split, geography, device, obvious internal/test traffic |
| AI referrals | Sessions with AI referrers or campaign parameters | Landing page, engagement, note/contact events |
| Distribution effectiveness | Qualified entrances per channel | Substack, LinkedIn, X, Instagram, Luma, direct |
| Site-agent usefulness | Successful questions and deliberate note receipts | Errors, fallback rate, unanswered themes |

ChatGPT referral links include `utm_source=chatgpt.com`, which should be preserved in Analytics reporting.

## Content priorities

1. A second firsthand field report or build retrospective with a concrete artifact.
2. A mini app paired with an indexable explanation of what it tests and what was learned.
3. A short “Now” update that keeps the current-work graph accurate.
4. A substantive profile/bio refresh across maintained external profiles using the same name, short descriptor, image, and canonical About link.
5. One useful external contribution or collaboration per month that can earn an independent reference rather than a self-created backlink.

## Guardrails

- Do not publish scaled generic pages merely to capture keywords.
- Do not add schema that is not supported by visible page content.
- Do not count GA4 users as verified people without bot/internal-traffic analysis.
- Do not promise first position in search or inclusion in an AI answer.
- Do not change crawler, DNS, billing, production, or analytics-account settings without the appropriate approval.

## Primary guidance

- Google, helpful and reliable people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google, AI features and the website: https://developers.google.com/search/docs/appearance/ai-features
- Google, generative AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google, ProfilePage structured data: https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google, structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- OpenAI, publisher and crawler FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- Perplexity, crawler documentation: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- Anthropic, web crawler controls: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
