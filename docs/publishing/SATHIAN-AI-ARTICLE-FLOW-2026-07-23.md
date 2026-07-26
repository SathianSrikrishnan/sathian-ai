# Sathian.ai Article Publishing Flow

Date: 2026-07-23

## What already works

1. Open `/studio/new`.
2. Create the draft with title, slug, date, domains, description, reading time, body, theme, and optional media.
3. Edit and preview it at `/studio/<slug>`.
4. Publish from Studio.
5. The article becomes readable at `/writings/<slug>`.
6. The Writing index and homepage fetch published articles from Supabase and refresh within 60 seconds.
7. The sitemap also includes published database articles.

Studio is protected by Google authentication, the operator allowlist, the `studio_admin` role, and AAL2/MFA for mutations.

## End-of-day article checklist

- Create as `draft`.
- Check title and description at mobile and desktop widths.
- Confirm all links and image credits.
- Confirm the date, domains, reading time, and slug.
- Publish from Studio.
- Wait up to 60 seconds.
- Verify the article, Writing index, homepage feature, Open Graph image, and sitemap.
- Send distribution only after the newsletter consent/unsubscribe layer is complete.

## Next automation

The next safe step is one explicit “Publish and distribute” workflow in Studio:

1. Publish the article.
2. Revalidate the article, Writing index, homepage, and sitemap immediately.
3. Create an immutable publication receipt.
4. Generate a reviewed email preview and social snippets.
5. Require one operator approval.
6. Send only to active, consented subscribers with an unsubscribe link.
7. Record delivery, bounce, complaint, and unsubscribe events.

This keeps editorial publishing fast while leaving external distribution as an approved action.
