# Ten-question chatbot measurement exercise

Use this after the release reaches production.

1. Open a fresh private browser window and visit the homepage.
2. Ask seven typed questions: one each about Tooth Fairy Network, Nori, AutoQuote Automator, Solana, Sathian's writing, ClinicalGuard, and contacting Sathian.
3. Click three different suggested prompts. This brings the total to exactly ten chatbot submissions.
4. Open one cited source.
5. Leave one clearly labeled automated test note. Contact details are optional; never invent or expose an email address for a test.
6. In GA4 Realtime, confirm ten `agent_question_submitted` events, answer events for successful replies, one `agent_source_opened`, and one `agent_note_sent`.
7. Confirm that event parameters contain routes, labels, booleans, and counts—but no question text, email address, or filename.

Mark `agent_note_sent` as the primary key event. Use `agent_question_submitted -> agent_answer_received -> agent_source_opened or agent_note_sent` as the first conversion funnel.

## Signature replay check

1. Open the agent with sounds enabled and press `Replay` once.
2. Confirm one `agent_signature_replayed` event with `placement: agent_controls` and the current page. No chat text, identity, contact detail, or filename should be present.
3. Mute agent sounds and confirm the replay control becomes unavailable. Turn sounds back on before continuing.
4. Review `agent_signature_replayed / agent_widget_viewed` weekly as an optional engagement ratio. Do not mark replay as a conversion or optimize the site around it until there is a useful baseline.
