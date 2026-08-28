# Sathian.ai human-traffic confidence, search, and AI-discovery upgrade

Date: 2026-08-28
Scope: primary-source research plus a read-only inspection of the canonical worktree. No application, analytics, crawler, or account setting was changed.

## Decision brief

1. **Treat “35 people / 42 visits” as directional, not literal.** The accurate label is **35 GA4 active users / 42 sessions**. GA4 automatically excludes traffic from known bots and spiders, but Google says this works only “to the extent possible,” does not expose the excluded count, and cannot prove that every remaining user is human. An anonymous personal site normally identifies a web user through a browser client ID, so one person can become several users across devices or cookie resets, while blocked or denied analytics can make people disappear. ([Google: known bot exclusion](https://support.google.com/analytics/answer/9888366), [reporting identity](https://support.google.com/analytics/answer/10976610), [device ID](https://support.google.com/analytics/answer/9356035))
2. **The reporting spine is already good.** The repository already has a daily operational report plus GA4 active users, sessions, notes, a named source, and a landing page over complete windows. The next upgrade is confidence and decisions: production-host filtering, internal/test exclusion, engaged sessions, a previous-period comparison, search visibility, content outcomes, and bot-request evidence.
3. **The largest search opportunity is identity consistency, not a new SEO tool.** The site already has `Person`, `WebSite`, and `Article` JSON-LD, a sitemap, canonical metadata, and a public robots policy. However, the visible home heading and `WebSite.name` say “Digital Experiments,” Open Graph calls the site `sathian.ai`, the title contains the full name, and article authorship uses “Sathian S.” Google explicitly uses home-page content, headings, titles, references from the web, and especially `WebSite` structured data to infer a site name. ([Google: site names](https://developers.google.com/search/docs/appearance/site-names))
4. **AIEO is mostly excellent SEO plus crawler access.** Google’s July 2026 guidance says generative AI visibility uses the same crawlability, indexability, page-experience, and people-first content foundations as Search. It specifically says Google does not use `llms.txt`, requires no special AI markup, and does not require artificial “chunking” or AI-specific rewriting. ([Google: generative AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide))
5. **Build recognition through a body of first-hand work.** Sathian’s essay-plus-mini-app format is a strong fit for Google’s current preference for non-commodity, original, experience-led material. Make Sathian.ai the canonical identity and archive, then use Substack and social profiles as distribution and corroborating identity surfaces rather than publishing a cloud of thin keyword pages.

## What the current repository already provides

- The home page emits one stable `Person` entity with the full name `Sathian Srikrishnan`, a site-wide `@id`, profile image, Toronto location, and `sameAs` links to Instagram, X, Luma, LinkedIn, and YouTube: [`src/lib/site-identity.ts`](../../src/lib/site-identity.ts).
- It also emits `WebSite` structured data, while each dynamic writing emits `Article` structured data and normal title/description/Open Graph metadata: [`src/app/writings/[slug]/page.tsx`](../../src/app/writings/%5Bslug%5D/page.tsx).
- Public personal-site pages and published writings are in the generated sitemap; private, API, studio, and legacy Tooth Fairy paths are excluded from the personal domain’s crawler policy: [`src/app/sitemap.ts`](../../src/app/sitemap.ts), [`src/app/robots.ts`](../../src/app/robots.ts).
- The site sends privacy-safe events to GA4 and Vercel for questions, answers, prompt selections, source opens, answer feedback, notes, and operational errors without sending prompt text, contact details, or filenames: [`src/lib/site-analytics.ts`](../../src/lib/site-analytics.ts), [`src/components/ChatWidget.tsx`](../../src/components/ChatWidget.tsx).
- The morning Worker currently queries GA4 for active users and sessions across 7 and 28 complete days, the exact `agent_note_sent` event, top named source/medium, and top landing page. It deliberately ends the window two days ago and lets the operational report survive a GA4 outage: [`workers/telegram-delivery/src/website-analytics.ts`](../../workers/telegram-delivery/src/website-analytics.ts), [`workers/telegram-delivery/src/daily-report.ts`](../../workers/telegram-delivery/src/daily-report.ts).

This is a useful baseline. The recommendations below extend it rather than replace it.

## Can the 35 users and 42 sessions be trusted?

### What can be trusted

- They are valid **GA4 measurements under the property’s current identity, consent, filter, and tagging configuration**.
- Known bots and spiders on Google/IAB lists are automatically excluded. This reduces ordinary crawler pollution. ([Google](https://support.google.com/analytics/answer/9888366))
- A session is a group of interactions, not a person. An engaged session lasts longer than 10 seconds, has a key event, or has at least two page/screen views. ([Google: sessions](https://support.google.com/analytics/answer/12798876))

### What cannot be inferred

- GA4 cannot disclose how many bots it excluded, and it does not certify that the remainder is human.
- “Active user” is not a verified individual. On the web, the default device identity comes from the `_ga` browser client ID. Cross-device use, cookie clearing, consent, ad blockers, and browser restrictions can split or omit real people. ([Google: reporting identity](https://support.google.com/analytics/answer/10976610), [device ID](https://support.google.com/analytics/answer/9356035))
- Direct traffic is not a synonym for a bot. `(direct) / (none)` means GA4 has no clear referral; untagged links, redirects, offline documents, and blockers can all cause it. ([Google: direct traffic](https://support.google.com/analytics/answer/15258820))
- Engaged sessions are a better signal of attention than raw sessions, but a sophisticated automated browser can still generate them.

### Sathian.ai-specific contamination checks

Before estimating a human share, verify these four items:

1. **Production host only.** The site loads GA4 wherever `NEXT_PUBLIC_GA_MEASUREMENT_ID` is present, and the Worker does not currently filter by hostname. Confirm previews do not inherit the production measurement ID, or filter the reporting query to `sathian.ai`. Vercel Web Analytics can also be filtered to the Production environment. ([Vercel: using Web Analytics](https://vercel.com/docs/analytics/using-web-analytics))
2. **Sathian and collaborators.** Define internal traffic, put the GA4 filter in `Testing` first, and activate it only after validation because active exclusion permanently prevents that incoming data from being processed. ([Google: internal filters](https://support.google.com/analytics/answer/10104470), [filter effects](https://support.google.com/analytics/answer/12996377))
3. **Automated production QA.** This repository has receipts for live browser and GA4 verification runs. Keep those proofs, but label or exclude their analytics traffic so tests do not masquerade as audience growth.
4. **Server-request comparison.** Use Vercel Edge Requests to inspect search, AI-crawler, and other bot categories. Vercel documents bot/category breakdowns in Edge Request observability; detailed filtering is plan-dependent. Do not subtract raw edge requests from GA4 sessions because assets and one visit can create many requests. Use it as a separate bot ledger. ([Vercel: Observability insights](https://vercel.com/docs/observability/insights), [bot management](https://vercel.com/docs/bot-management))

Recommended wording in Telegram:

> 7 complete days: 35 GA4 active users · 42 sessions
> 24 engaged sessions (57%) · 4 meaningful agent actions
> Bot requests are reported separately; users are estimates, not verified people.

## Search plan for owning the Sathian identity

No search engine guarantees first position or exclusive ownership of a first name. The achievable objective is stronger: make `sathian.ai` the clearest, most internally consistent result for **Sathian Srikrishnan**, then expand the evidence associated with **Sathian** through distinctive published work and consistent public profiles.

### P0 — unify the entity and authorship

1. Choose one public identity string: **Sathian Srikrishnan**. Use `Sathian` and `Sathian S.` only as alternate names.
2. Align the home page’s prominent identity, `<title>`, `og:site_name`, and `WebSite.name`. “Digital Experiments” can remain the editorial/workshop title, but it should not compete with the person’s name as the site identity. Google’s site-name system uses all of these signals and external references. ([Google: site names](https://developers.google.com/search/docs/appearance/site-names), [title links](https://developers.google.com/search/docs/appearance/title-link))
3. Restore an indexable `/about` page, or clearly make the home page the profile page. A dedicated `/about` is cleaner because `/about` currently redirects to `/`. Mark it as `ProfilePage` whose `mainEntity` reuses `https://sathian.ai/#sathian`, and make it the stable author URL. Google says ProfilePage is suitable for an “About Me” page whose primary focus is one person. ([Google: ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [Schema.org: Person](https://schema.org/Person))
4. On every writing, display and link a visible **By Sathian Srikrishnan** byline. Reuse the same Person `@id` in `Article.author`; add applicable `dateModified` and representative `image` fields. Google strongly recommends `author.@type` plus `author.url` or `sameAs` to disambiguate authors. ([Google: Article markup](https://developers.google.com/search/docs/appearance/structured-data/article))
5. Add stable identity destinations such as Substack to `sameAs` only when they genuinely represent Sathian. Keep full-name, bio, portrait, and `sathian.ai` backlink consistent on LinkedIn, YouTube, Substack, X, and other maintained profiles.

### P1 — publish a recognizable body of work

Use a repeatable **essay + artifact + distribution** loop:

1. Publish one original, first-hand thesis or build note on Sathian.ai with a descriptive title, summary, visible author/date, sources, and real evidence: screenshots, experiments, code, data, or what changed in Sathian’s own thinking.
2. Add a small companion artifact when it materially helps: interactive test, calculator, visualization, annotated prototype, or reproducible demo. Link the essay and artifact in both directions.
3. Choose one canonical home for the full piece. If Sathian.ai owns the durable version, use Substack for the newsletter framing, excerpt, discussion, and a tagged link back; avoid two unmanaged copies competing as the canonical URL.
4. Distribute with consistent UTM values. Continue lowercase source/medium/campaign naming and do not place names, email addresses, or other personal information in campaign parameters.
5. After 28 days, use query/page evidence to decide what to deepen. Expand a successful concept with a genuinely new case study or artifact, not multiple pages targeting trivial wording variations.

Google recommends original reporting and analysis, clear authorship, first-hand expertise, and content made for an existing audience. Its 2026 AI-search guide contrasts this with generic “commodity” content and warns against mass-producing query variations. ([Google: people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [generative AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide))

### P1 — broaden discovery beyond Google

1. Add and verify Sathian.ai in Bing Webmaster Tools; Bing supports importing an existing Google Search Console property. Its Search Performance report now separates contribution from Web and Chat and reports queries, pages, impressions, clicks, CTR, position, crawl requests/errors, and indexed pages. ([Bing Webmaster Help](https://www.bing.com/webmasters/help), [Bing Search Performance](https://www.bing.com/webmasters/help/search-performance-c680da36))
2. Submit the existing sitemap and inspect new high-value URLs with Bing URL Inspection, including its SEO and markup cards. ([Bing URL Inspection](https://www.bing.com/webmasters/help/URL-Inspection-55a30305))
3. Add IndexNow at the publishing boundary so a new, updated, or deleted URL is sent when its state changes. IndexNow is a notification, not a ranking guarantee; an HTTP 200 only confirms receipt. ([IndexNow protocol](https://www.indexnow.org/documentation))
4. Keep Google Search Console as the source of truth for Google queries, pages, impressions, clicks, CTR, position, indexing, and the new Generative AI performance report. GA4 remains the source of truth for behavior after arrival. The numbers will not match exactly because sessions and clicks are different systems. ([Google: Search Console + Analytics](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console))

## AI-search and machine-readable content

### What to do

- Keep public content server-readable, indexable, canonical, internally linked, and available without login or a client-only interaction.
- Keep the existing `Person`, `WebSite`, and `Article` JSON-LD, but make the identity relationships consistent. Structured data helps search engines understand eligible features; it is not an AI-ranking switch.
- Use descriptive headings, plain HTML links, accessible controls, meaningful image alt text, and ARIA labels/states for interactive mini apps. OpenAI says its Atlas agent uses ARIA information to interpret interactive elements. ([OpenAI: publisher/developer FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq))
- Allow `OAI-SearchBot` if ChatGPT discovery is desired and verify that robots, Vercel bot protection, and the public URL return a successful response. OpenAI says ChatGPT referrals add `utm_source=chatgpt.com`, which makes them measurable in GA4. `GPTBot` is a separate training preference. ([OpenAI](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq))
- If Claude visibility is desired, allow `Claude-SearchBot` for search indexing and `Claude-User` for user-directed retrieval. `ClaudeBot` is the separate model-training crawler. Anthropic says all three respect robots.txt. ([Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler))

The current wildcard robots rule allows these crawlers on public personal-site paths unless a Vercel firewall or bot rule blocks them. Verify access; do not add redundant crawler-specific `Allow` rules unless an observed block requires them.

### What not to do

- Do not create `llms.txt` for Google visibility; Google explicitly ignores it.
- Do not create thin FAQ/query pages, repeat keywords, split essays into artificial chunks, or rewrite prose for imagined model preferences.
- Do not conflate crawler permission with model-training permission. Search/user-retrieval bots and training bots have separate controls at OpenAI and Anthropic.
- Do not treat schema validation as a guarantee of indexing, ranking, a rich result, or an AI citation.

## Reporting upgrade

Keep the 8:00 AM Telegram report, but separate operational truth from growth truth.

### Daily: short operational pulse

| Block | Report | Why |
| --- | --- | --- |
| Site agent health, rolling 24h | questions, answers, answer completion rate, model errors/error rate, notes sent, Telegram delivered, dead letters, backlog | Confirms the chatbot and delivery path are healthy. |
| Reach, 7 complete days | **GA4 active users** (not “people”), sessions, engaged sessions, engagement rate, change versus previous 7 complete days | Shows direction with less noise than yesterday-only reporting. GA4 exposes all of these through the Data API. ([Google Data API schema](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)) |
| Traffic confidence | production-host filter status, internal/test filter status, verified bot-request trend from Vercel | Prevents a small dataset from being overinterpreted. |
| Outcome | `agent_note_sent`, source opens, helpful/not-helpful feedback, session key-event rate | Measures useful action rather than page loading. |
| One action | a deterministic recommendation or “No meaningful change; keep the experiment running.” | Makes the report operational instead of decorative. |

The existing GA4 batch uses four report requests. Add engagement metrics and current/prior date ranges to existing requests where possible; Google currently permits up to five reports in one `batchRunReports` call. ([Google Data API: batchRunReports](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports))

The client currently records successful answers but no matching analytics event for a failed request. Add one privacy-safe `agent_request_failed` event with only `page`, `error_class` (`timeout`, `network`, `4xx`, `5xx`, or `invalid_response`), and coarse duration; never include the question or contact data. Pair it with server-side route latency/error metrics so the weekly review can show answer success rate and p50/p95 latency. Google prohibits sending personally identifiable information to Analytics. ([Google: avoid PII](https://support.google.com/analytics/answer/6366371), [Vercel Observability](https://vercel.com/docs/observability))

### Weekly: growth and visibility review

Add this once per week rather than crowding every morning:

- Google: 28-day clicks, impressions, CTR, average position, indexed/not-indexed deltas, and the Generative AI performance report.
- Branded query group: `sathian srikrishnan`, `sathian`, and known handle variants; keep it separate from non-branded discovery queries.
- Bing: Web and Chat clicks/impressions plus indexed pages and crawl errors.
- AI referrals: `chatgpt.com` and any separately observed referral domains; do not invent a source when the referrer is absent.
- Content: top writings by engaged sessions, organic landing sessions, returning users, average engagement, and meaningful agent actions.
- Distribution: sessions and outcomes by `utm_campaign` across Substack, social, Luma, and direct referrals.
- Bot ledger: search crawler, AI crawler, other verified bot, and suspected automated request trends from Vercel—reported as requests, never mislabeled as GA4 users.

## Priority sequence

1. **Reporting truth:** rename “people” to “GA4 active users,” filter to production hostname, verify preview/internal/test handling, add engaged sessions and previous-7 comparison.
2. **Identity release:** align full-name signals, add a real profile/about destination, and unify visible + structured article authorship around one Person `@id`.
3. **Search data:** link or separately query Search Console for the weekly block; add Bing Webmaster Tools and the existing sitemap.
4. **Publishing loop:** release one first-hand essay/mini-app package at a sustainable cadence and tag every controlled distribution link.
5. **AI discovery:** verify OAI-SearchBot, Claude-SearchBot, and Claude-User can fetch representative public pages; separately decide training-bot policy.
6. **Fast indexing:** add IndexNow only after the publishing workflow is stable enough to send correct add/update/delete notifications.

Success after 90 days is not “own every result for Sathian.” It is evidence that: the full-name query consistently resolves to Sathian.ai and maintained profiles; branded and non-branded impressions are rising; at least one content theme creates engaged visits or meaningful agent actions; AI and Bing discovery are measurable; and the morning report can distinguish audience, test activity, bot requests, and outcomes without pretending to know more than the data proves.
