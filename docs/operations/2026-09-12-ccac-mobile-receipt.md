# Samsung phone piano repair

Owner explicitly requested urgent production deployment after reporting a keyboard cut off on Samsung Galaxy S24. Scope: responsive piano/lesson usability; preserve all songs and desktop experience.

## Cause and fix

The native piano forced a 585px minimum (961px for Canon, larger for Für Elise). A 384px phone viewport exposed only 350px of Canon's 961px keyboard. Default mobile rendering now fits the entire keyboard and note lanes to available width. An explicit Larger keys / Show full piano toggle provides a readable/tappable expanded keyboard, horizontal touch panning and automatic melody following. Landscape uses a shorter roll/keyboard and compact header spacing. Controls can wrap. River's frame stays within the viewport. Desktop above1000px retains its existing piano sizing.

No notes, recordings, songs, tempo or audio transport changed. Pending September9 badge removal, request link, agent-memory, workflow and evaluation drafts were preserved but excluded from the committed HTML/deployment. Only cache versions were staged from the current published HTML.

## Proof

- Frozen source `58dafb78393a7df2e35214e1488364c7f3f0485a`, main; preceding production commit `2e1f8e3cf371a1f442e25a86619c4ca5dac94d74`.
- All four modes checked at360×780,384×832,412×915,832×384,915×412 and desktop1280×1000. All native keys and lanes fit at phone sizes; no page overflow. River iframe fits. Native audio advances without errors and note transforms change. Toggle expands, allows reaching the right end and restores the full view. These are Chromium phone viewport/touch simulations, not a physical S24 test.
- Touch event test: 205px actual swipe scroll in expanded mode; after rotation the full keyboard measured776px within776px available. Before screenshot proves350px available versus961px content.
- Local full release gate PASS:429 tests,60/60 agent evaluation, production audit, build and shared browser/sound checks. Frozen GitHub source checks: https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/34693909894 (PASS: offline gate, protected 10-case canary and all preview browser/sound checks).
- Browser verifier: canonical `tests/browser/ccac_mobile_check.cjs`. Screenshots/JSON: canonical `tmp/ccac-mobile-proof/`. Full gate log: `tmp/ccac-mobile-gate.log`.

Production build prepared from exact Git source with `autoAssignCustomDomains:false`, avoiding upload of unrelated dirty files and keeping the existing public domain until checks pass. Deployment `dpl_Aqk8AocEpeJXBh3Sq1oZMDKD9q1o`, https://sathian-648vjwp7r-sathiansrikrishnans-projects.vercel.app . Current state: LIVE at https://sathian.ai/ccac. Promotion succeeded with explicit team scope after the default CLI scope failed. All four modes passed all six viewports again on the public domain. Live touch swipe moved205px; rotation showed776px content in776px available. Eight required routes returned HTTP200; the live HTML references20260912-mobile assets. Deployment error-log query returned no logs. The direct pre-promotion deployment URL verifier timed out at its protected page; verification was repeated successfully on the public domain after promotion. Rollback: `dpl_5U9GBMPHtZuRcYpFUBAgJhqmYQKK`. Stop condition met: live tests pass and receipt completed. No further engineering work pending for this mobile repair. Physical Samsung speaker/touch confirmation remains owner feedback, not a claim made by simulated checks.

Durable proof: docs/operations/2026-09-12-ccac-mobile-proof/ (live/candidate measurements, touch rotation, HTTP routes and before/after screenshots). Temporary full screenshots remain in tmp/ccac-mobile-proof/.
