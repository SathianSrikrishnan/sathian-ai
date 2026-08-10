# Production chatbot measurement report

Date: 2026-08-10
Target: `https://sathian.ai/`
Method: fresh production browser tab, seven typed questions, three suggested-prompt interactions, one source click, and GA4 Realtime verification. No contact information or attachment was submitted.

## Result at a glance

- Exactly 10 chatbot submissions were recorded in GA4 Realtime.
- GA4 showed 10 `agent_question_submitted`, 8 `agent_answer_received`, 3 `agent_prompt_selected`, 1 `agent_source_opened`, and 1 `agent_note_sent` event.
- Manual answer quality: 4 pass, 2 partial, 4 fail.
- Privacy check passed for the visible custom question-event fields. GA4 showed `hasAttachment`, `hasContact`, `inputMethod`, and `page`; it did not show question text, an email address, or a filename.
- `agent_note_sent` is **not** currently a key event: the Realtime Key events card showed no data.
- One source link opened successfully and GA4 recorded the source event.

## Ten-submission run

| # | Input | Type | Response/result | Accuracy | Source or next action | Visible issue |
|---:|---|---|---|---|---|---|
| 1 | What is Tooth Fairy Network and who is it for? | Typed | Explained it as Sathian's flagship family-memory project, built for his children first. | Pass | Multiple sources and `Open the source` | None |
| 2 | Who is Nori the Narwhal, and where can I watch the latest episode? | Typed | Identified Nori as the newest Draw with Tanda release and described the guided drawing episode. | Pass | `Open the latest release` | None |
| 3 | What does AutoQuote Automator do, and what is its current status? | Typed | Returned the approved-information fallback. | Fail | Generic source list and note suggestion | The homepage contains an AutoQuote project card, but the agent could not answer from it. |
| 4 | What does Sathian's Solana dashboard teach a newcomer? | Typed | Returned the approved-information fallback. | Fail | Solana Explorer source and note suggestion | It did not explain the public dashboard that is featured on the homepage. |
| 5 | What subjects does Sathian write about, and where can I read them? | Typed | `Too many requests. Please slow down.` | Fail | None | The fifth rapid request hit the production rate limit. |
| 6 | What problem does ClinicalGuard solve, and can I view the project? | Typed | Correctly summarized the five-step ICD-9 review pipeline. | Partial | General sources and note suggestion | It said it lacked an approved public project page even though `/projects/clinicalguard` is live. |
| 7 | What is the best way to contact Sathian through this site? | Typed | Correctly directed the visitor to leave a note and explained the receipt and delivery limitations. | Pass | Note flow offered | None |
| 8 | Show me the latest release | Suggested prompt | Correctly returned the Nori release. | Pass | `Open the latest release` | None |
| 9 | What is Sathian building now? | Suggested prompt | Mentioned AI agents, Solana, Web3, product building, and Tooth Fairy Network. | Partial | Sources and note suggestion | Too conservative: it said there was no approved current-build detail despite the visible active project cards. |
| 10 | I want to leave Sathian a note | Suggested prompt | The literal prompt was immediately stored and a receipt was returned. | Fail as UX | Receipt returned | Critical: clicking this prompt sends a note immediately, without letting the visitor compose or confirm it. This also prevented adding the requested `AUTOMATED TEST` label without creating an 11th submission. |

## GA4 evidence

Realtime eventually reported:

| Event | Count |
|---|---:|
| `agent_question_submitted` | 10 |
| `agent_answer_received` | 8 |
| `agent_prompt_selected` | 3 |
| `agent_source_opened` | 1 |
| `agent_note_sent` | 1 |

The question-event drilldown showed 12 parameter keys. The six custom/page keys visible on its second page were:

- `hasAttachment`
- `hasContact`
- `inputMethod`
- `page`
- `page_location`
- `page_title`

No question content, contact information, or filename appeared among the event keys. The run intentionally used no contact details and no attachment.

## Recommended fixes, in order

1. Change the `I want to leave Sathian a note` prompt so it opens a compose state; only the explicit Send action should create `agent_note_sent`.
2. Add the public AutoQuote Automator, Solana dashboard, and ClinicalGuard page to the agent's approved retrieval context, and test those three answers as release gates.
3. Make the measurement exercise rate-limit aware: either allow at least ten test requests in a short session or document a required delay/batching cadence.
4. Mark `agent_note_sent` as the GA4 key event, then build the funnel `agent_question_submitted -> agent_answer_received -> agent_source_opened or agent_note_sent`.
5. Keep the current privacy-safe question-event contract. Do not add raw prompts, note bodies, emails, or attachment names to analytics.

## Exercise limitation

The requested clearly labeled automated note was not sent as an additional message. The third suggested prompt itself created the one note immediately. Sending a corrected labeled note would have exceeded the hard limit of exactly ten chatbot submissions, so the run stopped at ten and records that behavior as a product defect.
