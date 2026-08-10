# Nori, analytics, and search release

Date: 2026-08-10

## Approved direction

- Use one homepage Draw with Tanda feature inside the Tooth Fairy Network project.
- Remove the duplicate latest-release banner.
- Use the canonical TFN profile master—Tanda's face—where the site identifies Tooth Fairy Network.
- Make the homepage heading exactly `Welcome to Sathian's Digital Workshop`.
- Publish the owner-approved Nori V5 master, then let the release registry update the homepage, channel page, structured data, and site agent from the real YouTube ID.
- Measure the chat funnel without sending message text, contact details, or filenames to analytics.
- Reduce search noise from legacy prototypes before deleting any route.

## Release architecture

The release registry remains the only publication record. A Draw with Tanda episode is rendered as a player only when it has all three public facts: `status: published`, a publication date, and a real YouTube video ID. The homepage always selects the newest published episode by date.

## Measurement contract

GA4 and Vercel Analytics receive the same privacy-safe event names:

- `agent_question_submitted`
- `agent_answer_received`
- `agent_prompt_selected`
- `agent_source_opened`
- `agent_contact_started`
- `agent_note_sent`
- `draw_with_tanda_opened`
- `draw_with_tanda_watch_started`
- `tfn_social_opened`

The site never sends chat text, names, email addresses, file names, or file contents to either analytics destination.

## Search identity

The homepage publishes a `Person` entity for Sathian Srikrishnan, alternate names `Sathian` and `Sathian S.`, canonical social profiles, and a matching `WebSite` entity. The visible H1 contains Sathian's first name. This creates consistent evidence for search engines but does not guarantee a particular ranking.

## Publication receipt

Nori was verified public on the official Tooth Fairy Network YouTube channel on 2026-08-10:

- Video: `https://www.youtube.com/watch?v=D0I_6me_WcU`
- Title: `Draw Nori the Narwhal Together | Easy Silhouette Drawing for Kids`
- Site release status: `published`

The approved master is:

`C:\Users\sathi\Projects\character-studio\productions\tfn-short-content-factory-v1\activities\DWT-A03-NARWHAL\endpoint-selection-v1\video-draft-v5\build\DWT-A03-NARWHAL-DRAFT-V5.mp4`

SHA-256: `8c4a27012390b0c324720f26463760b2d7a2adcf6aa4579d30ac2ed9c8e093bb`
