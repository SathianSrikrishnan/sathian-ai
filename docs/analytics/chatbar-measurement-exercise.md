# Ten-question chatbot measurement exercise

Use this after the release reaches production.

1. Open a fresh private browser window and visit the homepage.
2. Ask five typed questions: one each about Tooth Fairy Network, Nori, AutoQuote Automator, Solana, and Sathian's writing.
3. Click three suggested prompts.
4. Open one cited source.
5. Leave one test note with an email address you control.
6. In GA4 Realtime, confirm ten `agent_question_submitted` events, answer events for successful replies, one `agent_source_opened`, and one `agent_note_sent`.
7. Confirm that event parameters contain routes, labels, booleans, and counts—but no question text, email address, or filename.

Mark `agent_note_sent` as the primary key event. Use `agent_question_submitted → agent_answer_received → agent_source_opened or agent_note_sent` as the first conversion funnel.
