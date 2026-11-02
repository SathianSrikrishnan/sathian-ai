# Session receipt load completion — November 2, 2026

A live Chromium CDP diagnostic found `loadEventFired` and `document.readyState=complete`, but `/api/agent/event` remained without `Network.loadingFinished` after returning 202. A diagnostic that consumed its response completed the request. Normal and diagnostic traces are retained outside the repository in `nov2-load-warning-diagnostic.json`.

The client now consumes the small response body. It still sends the same event, source, page and UUID exactly once per tab at the same time, with keepalive enabled. Analytics, consent, endpoint security and chat loading are unchanged.

Regression protection checks both the exact operational event contract and response consumption, plus completion of the browser resource timing entry before chat opens. All six desktop/mobile marketing viewports remain required. The hosted post-release Lighthouse runs must be checked for incomplete-load warnings before their score is treated as acceptance.

Do not hide this warning by increasing timeouts, filtering analytics, changing the page under test or removing the operational event.
