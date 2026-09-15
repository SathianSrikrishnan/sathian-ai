# Writing publication contract

Publishing an article row is only one step. A writing release is complete when the public reading, discovery, chatbot and distribution surfaces agree.

1. Publish the owner-reviewed article and illustrations through the existing Studio/database flow. Verify the public website and Substack URLs; keep a clear Substack link in the website article.
2. Promote `src/content/latest-writing.ts` with the reviewed title, date, summary, public site path, direct Substack URL and approved feature image. The homepage feature and public-agent latest-writing memory both consume this record. Retain older featured work without calling it latest.
3. Run `npm run release:verify`, preserving unrelated changes. Push only the approved release files and require the existing Site Agent Quality protected-preview checks. Deploy the exact reviewed commit under the owner's production authorization.
4. On the actual live homepage, verify the card image, summary and quick link. Ask the actual chatbot for the latest writing and check its title and article action. Follow the website article's Substack link.
5. Before social release, verify the exact copy, direct Substack URL/preview and requested platform mention entities. A plain name or raw @text is not a working tag. If the publishing connector cannot encode mentions, use a supported native editor under the same authorization; never silently publish without requested tags.
6. Read back the native social post and its actual profile/company links. Supply those verified URLs to Stanley. Record the exact communication channel and delivery receipt; web delivery is not Telegram delivery.

An API application existing or synthetic connector tests passing does not prove account sign-in or successful messaging. Keep derivative posts held if any owner-required release component is incomplete. Do not make new anecdotes, product claims or offers from background context.

The shared latest-writing record removes separate homepage/agent edits. Updating the article database does not yet automatically promote this reviewed record or authorize public social posts. This workflow is supervised, not fully unattended.
