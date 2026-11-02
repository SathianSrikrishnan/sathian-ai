# Session receipt load completion — November 2, 2026

A live Chromium CDP diagnostic found `loadEventFired` and `document.readyState=complete`, but `/api/agent/event` remained without `Network.loadingFinished` after returning 202. A diagnostic that consumed its response completed the request. Normal and diagnostic traces are retained outside the repository in `nov2-load-warning-diagnostic.json`.

The client now consumes the small response body. It still sends the same event, source, page and UUID exactly once per tab at the same time, with keepalive enabled. Analytics, consent, endpoint security and chat loading are unchanged.

Regression protection checks both the exact operational event contract and response consumption, plus completion of the browser resource timing entry before chat opens. All six desktop/mobile marketing viewports remain required. The hosted post-release Lighthouse runs must be checked for incomplete-load warnings before their score is treated as acceptance.

Do not hide this warning by increasing timeouts, filtering analytics, changing the page under test or removing the operational event.


Village's reported LCP element is its video poster. The candidate explicitly preloads that same approved26KB WebP at high priority; the22.2-second MP4 continues to wait for play. The approved parent-and-vault backdrop, omitted from the first pass's markup while its CSS remained, is restored at20%opacity with low fetch priority. Regression checks require both the poster preload and actual backdrop element, along with final loaded-image screenshots.
