# Sathian.ai measurement and growth baseline

Date: 2026-08-16  
Scope: read-only research and recommendations; no account, tag, consent, or reporting settings were changed.

## The simple picture

Sathian.ai already records visits. The missing layer is a small operating system that says:

1. **Where did people come from?**
2. **What useful page did they reach?**
3. **Did they do the one action that matters?**
4. **Is that improving versus the previous week?**

Right now, GA4 can answer some of the first two questions, but the property has **zero key events**, many visits have no useful campaign label, and the personal Telegram report is not yet an active, decision-oriented report. That is why 321 events can still feel like “no intelligence”: most events are routine interactions, not 321 visitors or 321 valuable outcomes.

## What each tool is for

| Tool | Plain-English job | What it does not tell you |
|---|---|---|
| GA4 | What visitors did on the site and the channel/source/medium that brought the session. A **source** is the specific place, such as Google or Substack; a **medium** is the type, such as organic, email, referral, or social; a **channel** is Google's broader grouping. | Who most anonymous visitors are, why they cared, or the real source when the referring link lost its label. `(direct) / (none)` means GA4 has no clear referral source, not necessarily that the person typed the address. ([Google: traffic-source dimensions](https://support.google.com/analytics/answer/15612152), [(direct)/(none)](https://support.google.com/analytics/answer/15258820)) |
| GA4 key events | Marks a small number of actions as outcomes. GA4 can then show which channels led to those outcomes. | A normal event is not automatically meaningful. An event should become a key event only when the action matters to the site's success. ([Google: key events](https://support.google.com/analytics/answer/9267568)) |
| Search Console | What happened before a Google visit: queries, impressions, clicks, average position, indexing, and Google-selected canonical URLs. Linking it to GA4 joins search discovery with on-site behavior. | Instagram, email, Substack, or Luma traffic. ([Google: connect Search Console to Analytics](https://support.google.com/analytics/answer/10737381)) |
| Substack | Email distribution and subscriber growth. It reports opens, link clicks, traffic sources, subscriber sources, and recommendation-driven subscriptions. | Perfect cross-platform attribution. Substack says `Direct` can include sources that did not pass referral data, sources below 1% can become `Other`, and `Direct to App` can hide the exact external source. ([Substack metrics](https://support.substack.com/hc/en-us/articles/5320347155860-A-guide-to-Substack-metrics), [post sources](https://support.substack.com/hc/en-us/articles/4415094770964-Where-can-I-see-how-readers-got-to-my-Substack-post)) |
| Luma | Event demand and attendance: page views, source, registration, referrals, and check-in/show-up. | General behavior across Sathian.ai unless the links between the event and site are tagged and, for deeper registration attribution, cross-domain measurement is configured. ([Luma Event Insights](https://help.luma.com/p/event-insights), [Luma GA measurement](https://help.luma.com/p/google-analytics-measurement-id)) |
| Meta Pixel + Conversions API | Measures and optimizes **Meta advertising** and can support retargeting. Pixel is browser-side; Conversions API sends events directly from a server or other system and is less affected by browser failures and blockers. Meta recommends using them together for website events. | Organic growth, a reason to advertise, or a consent/privacy exemption. Meta explicitly says Conversions API is not a way to bypass privacy policies. ([Meta Pixel setup](https://www.facebook.com/help/messenger-app/952192354843755/), [Conversions API](https://www.facebook.com/business/help/AboutConversionsAPI)) |

## Baseline today

The verified local measurement receipt reports:

- **Last 7 days in GA4:** 17 active users, 14 new users, 321 events, and zero key events.
- **Sessions by broad channel:** Direct 33, Referral 13, Organic Search 2, Organic Social 1.
- **Visible sources:** `luma / referral`, `google / organic`, and `m.facebook.com / referral`.
- **Complete 28-day Google Search window:** 90 impressions, 1 click, 1.1% click-through rate, average position 18.
- **Indexing snapshot:** 67 indexed URLs and 168 not indexed, including 48 not-found URLs and 88 crawled-currently-not-indexed URLs.

Source: [personal-site closeout audit](../operations/2026-08-16-personal-site-closeout-audit.md).

This is an early, low-volume baseline—not zero traction, but too little signal for daily tactical decisions. Use daily reporting for operational awareness and a rolling 7- and 28-day view for decisions. GA4 warns that standard reports can take 24–48 hours to process, so a morning report should not treat yesterday's incomplete numbers as final. ([Google: data-processing delay](https://support.google.com/analytics/answer/9333790))

## Minimum viable measurement system

Do these before Meta Pixel or paid advertising:

1. **Choose one primary outcome:** mark `agent_note_sent` as the first GA4 key event. It means a visitor made a real attempt to contact Sathian. Keep `agent_question_submitted`, `agent_source_opened`, and content clicks as diagnostic events, not equal-weight goals. Google recommends marking actions that are important to success, rather than ordinary page views. ([Google: mark key events](https://support.google.com/analytics/answer/13128484))
2. **Tag every link Sathian controls:** use lowercase `utm_source`, `utm_medium`, and `utm_campaign`. Google says those parameters populate Session source/medium/campaign in Traffic acquisition, and inconsistent capitalization fragments reporting. ([Google: custom campaign URLs](https://support.google.com/analytics/answer/10917952))
3. **Link Search Console to GA4:** this adds Google Organic Search Queries and Google Organic Search Traffic reports. It requires GA4 Editor access and verified ownership of the Search Console property. This is an account link, not another site tag. ([Google: Search Console link](https://support.google.com/analytics/answer/10737381))
4. **Turn the Telegram message into a scorecard:** report one completed data window, one trend, one outcome, one source table, and one recommended action. Do not dump raw event counts.
5. **Run one 30-day distribution experiment:** one useful Substack post per week, each with one relevant Sathian.ai link, plus at most one genuine Luma event. Compare visits and key events by campaign after four weeks.

### Simple UTM convention

Use the existing private UTM builder; do not create another one.

| Placement | Suggested values |
|---|---|
| Instagram profile | `utm_source=instagram&utm_medium=organic_social&utm_campaign=profile` |
| A specific Instagram post/story | `utm_source=instagram&utm_medium=organic_social&utm_campaign=polytheistic_test&utm_content=story_01` |
| Substack article linking to Sathian.ai | `utm_source=substack&utm_medium=email&utm_campaign=polytheistic_test` |
| Luma event page linking to Sathian.ai | `utm_source=luma&utm_medium=referral&utm_campaign=ai_build_session_01` |

Do not put names, email addresses, note text, or other personal information in UTM values. Google prohibits sending personally identifiable information to Analytics, including through campaign fields. ([Google: avoid PII](https://support.google.com/analytics/answer/6366371))

For a manual check in GA4, open **Reports → Acquisition → Traffic acquisition**, then use **Session source / medium** as the table dimension. Traffic acquisition answers where each visit came from; User acquisition is the separate first-touch report and will legitimately show different totals. ([Google: the two acquisition reports](https://support.google.com/analytics/answer/14731736))

### What the morning Telegram report should say

Use a completed window—preferably through two days ago—plus comparisons:

> **Sathian.ai — morning pulse**  
> 7-day users: 17 (vs prior 7 days)  
> Meaningful outcomes: 1 note sent  
> Best source/medium: `substack / email` — 6 sessions, 1 note  
> Best landing page: `/writings/...`  
> Google, 28 days: 90 impressions, 1 click, average position 18  
> **Action:** Repeat the Substack topic that produced the note.

When volume is too low, the honest insight should be: **“No meaningful change; keep the experiment running.”** That is better than inventing a story from one visitor.

## Substack: use it as distribution, not a second homepage

Recommended boundary:

- **Sathian.ai is the durable base:** identity, portfolio, projects, agent, and selected writing archive.
- **Substack is the publishing and subscriber channel:** recurring essays, email delivery, conversation, and audience growth.
- Add a clear “Read/subscribe on Substack” link from the Writings surface. Substack officially recommends linking a publication from a personal site or embedding its signup form. ([Substack SEO guidance](https://support.substack.com/hc/en-us/articles/4407702258836-How-can-I-optimize-my-Substack-publication-for-SEO))
- Add a tagged Sathian.ai link to the Substack navigation so the cross-link is permanent, not dependent on a reader finding one old post. Substack supports external navigation links. ([Substack navigation](https://support.substack.com/hc/en-us/articles/20512194655892-How-do-I-organize-the-navigation-bar-on-my-Substack-publication))
- Put one tagged, context-relevant Sathian.ai link in each Substack post. Substack reports link clicks; GA4 then reports the resulting site sessions and outcomes.
- Use Recommendations with a few genuinely adjacent writers. Recommendations appear in the subscribe flow, on the publication homepage, and in recommendation digest emails; Substack reports how many free subscriptions each recommendation generated. ([Substack Recommendations](https://support.substack.com/hc/en-us/articles/5036794583828-How-can-I-recommend-other-publications-on-Substack))

Do not judge Substack only by clicks back to the site. Subscriber growth and direct replies can be the valuable outcome while Sathian.ai remains the credibility and project base. Treat open rate as directional: Substack explains that image blocking can hide an open while previews can create one. ([Substack: how opens are captured](https://support.substack.com/hc/en-us/articles/360044139052-How-are-Opens-captured-on-Substack))

Optional later: Substack supports adding a GA4 measurement ID and says page views, signups, and paid subscriptions should appear after processing. Native Substack stats plus tagged outbound links are enough for the first experiment; add this only if Sathian needs a combined cross-property analysis. ([Substack: connect GA4](https://support.substack.com/hc/en-us/articles/15955098199444-How-do-I-connect-Google-Analytics-4-to-my-Substack-publication))

## Luma: host an event only if the event is valuable on its own

A small monthly event could be a good growth experiment—for example, an AI build session, product teardown, or practical office hour—but it should not exist merely to manufacture page views.

For one event:

1. Define the audience and promised outcome.
2. Give the event one Luma registration page.
3. Use different Luma links such as `?utm_source=instagram`, `?utm_source=substack`, and `?utm_source=sathian_site`. Luma's direct-event referral reporting explicitly supports `utm_source`. ([Luma referrals](https://help.luma.com/p/event-referrals))
4. Add one tagged link from the Luma description or follow-up to the most relevant Sathian.ai project/article.
5. Evaluate the funnel: event-page views → registrations → attendees/check-ins → Sathian.ai sessions → notes or repeat engagement.

Luma's Insights tab tracks traffic, registrations, and attendance. Its embedded registration button can also forward standard campaign parameters and send a `purchase` event to the site's Google tag, including value `0` for a free registration. That deeper integration is optional; start with direct links and Luma Insights. ([Luma embed and campaign tracking](https://help.luma.com/p/embed-luma-on-your-website))

## Privacy boundary for the GA4 already in use

GA4 is less intrusive than a retargeting system only when its purpose and configuration stay limited. Google's default implementation stores a first-party `_ga` client identifier and collects session, approximate-location, browser, and device information. Google says site owners must inform visitors about stored information and give them the opportunity to grant or deny consent; it also prohibits customers from sending personally identifiable information. ([Google: data collection](https://support.google.com/analytics/answer/11593727), [Google: safeguarding data](https://support.google.com/analytics/answer/6004245))

The conservative baseline is:

- publish a short, plain-language privacy notice naming GA4 and Vercel Analytics, purpose, data categories, recipients, retention, and how to withdraw;
- provide an equally clear analytics accept/reject choice and remember it;
- keep advertising storage and personalization disabled unless a later advertising decision specifically enables them;
- continue the current rule that analytics never receives chat questions, note text, contact details, filenames, or user identifiers.

Google Consent Mode can make tags respect a visitor's choice, but it does not provide the banner itself. Its `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` states are separate controls. ([Google: Consent Mode](https://support.google.com/analytics/answer/10000067), [consent types](https://support.google.com/analytics/answer/12334711))

## Meta Pixel: defer until there is a paid campaign

Installing Meta now would add privacy and governance cost without solving the present problem. The current need is consistent publishing, labeled links, one key event, and a useful report.

Before any future Meta launch:

1. Define the exact campaign and conversion. Do not send all site behavior “just in case.”
2. Create the Meta dataset/pixel in Events Manager; decide whether browser Pixel alone or Pixel + Conversions API is justified.
3. Publish a prominent privacy notice explaining that Meta receives event data for measurement/targeting and provide an effective choice. Meta's own Business Tools Terms require clear notice and an opt-out mechanism. ([Meta Business Tools Terms](https://www.facebook.com/legal/terms/businesstools/preview))
4. Implement consent before advertising tracking, with a persistent way to change the choice. Meta CAPI remains subject to privacy/data-sharing rules. ([Meta CAPI](https://www.facebook.com/business/help/AboutConversionsAPI))
5. Never send note bodies, questions, email addresses in URLs, child data, health information, or other sensitive content to Meta or GA4.
6. Keep Meta advertising tracking off child-oriented Tooth Fairy surfaces and health-related/sensitive pages. The Canadian privacy regulator says organizations should avoid knowingly tracking children or child-directed sites for behavioural advertising and limit profiling to non-sensitive information. ([OPC behavioural-advertising position](https://www.priv.gc.ca/en/privacy-topics/technology/online-privacy-tracking-cookies/tracking-and-ads/bg_ba_1206/))

For an Ontario commercial site, PIPEDA is the general private-sector baseline because Ontario's substantially similar provincial law is limited to personal health information. PIPEDA requires meaningful consent, clear purposes, collection limitation, safeguards, openness, and the ability to withdraw consent. Express consent is generally required for sensitive information, uses outside reasonable expectations, or meaningful residual risk. ([OPC: PIPEDA in brief](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief), [OPC: meaningful consent](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/))

This is an operational privacy boundary, not legal advice.

## What the search cleanup numbers mean

- **48 not found:** Google requested URLs that returned `404`. This is not automatically a defect. If a page was intentionally retired and has no replacement, Google recommends a real `404` or `410`. If it moved to a clear replacement, use a `301`. Do not redirect every old URL to the homepage; Google warns irrelevant mass redirects can be treated as soft 404s. ([Google: crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors), [site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes))
- **88 crawled, currently not indexed:** Google fetched the URLs but did not include them in the index snapshot. This can include duplicates, feeds/assets, thin pages, or pages Google did not select. The right next step is to export and classify the exact URLs, not bulk-delete 88 things. Use URL Inspection on representative real pages to review rendered content and the Google-selected canonical. ([Google: URL Inspection](https://support.google.com/webmasters/answer/9012289))

Use four buckets for the cleanup:

1. **Moved/replaced:** exact 301 to the closest equivalent.
2. **Intentionally retired, no equivalent:** keep real 404/410; remove internal links and sitemap entries.
3. **Broken internal link or typo:** fix the referring link; redirect when a useful destination exists.
4. **Valuable current page not indexed:** improve uniqueness/internal linking, confirm canonical/rendering, then request indexing after the material change.

## Recommended 30-day scorecard

Keep the scorecard small:

- Active users and engaged sessions, 7-day and 28-day trend.
- Sessions by `source / medium`.
- Top landing pages by engaged sessions.
- `agent_note_sent` key events and key-event rate by source/medium.
- Substack: new subscribers, open rate, link clicks, subscriber source.
- Luma when used: page views, registrations, attendance, and source.
- Search Console: impressions, clicks, click-through rate, average position, plus indexed/not-indexed deltas.

The success criterion for the first month is not “go viral.” It is: **Sathian can point to one channel, one content/event experiment, and one meaningful visitor action with enough evidence to decide what to repeat.**
