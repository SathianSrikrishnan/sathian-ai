# Marketing resource delivery

Keep the approved page content, art, native video/captions and analytics contracts intact. This change reduces unnecessary delivery; it does not claim a95+ score.

- `globals.css` remains canonical. Run `npm run styles:generate`; never hand-edit its generated stylesheets or dependency list.
- `tailwind.marketing.config.ts` reuses the same theme/plugins, but emits utilities only for the public landing-page import graph recorded in `scripts/marketing-style-dependencies.json`. Newly imported landing components must update that generated list.
- Secondary route layouts retain `secondary-surfaces.css`, including the complete original utility set. This shifts approximately1.6KB gzip onto secondary pages while removing approximately5.1KB from each landing page; do not drop secondary utilities to hide that tradeoff.
- The Village backdrop is the approved optimized Image element. The retired pseudo-element must have no background image; otherwise the browser downloads the original167KB image as well. Keep the original asset in the approved manifest.
- Secondary navigation and the Home brand link do not prefetch. The primary Home-to-Village conversion links still use their existing behavior.
- Compiled landing stylesheet budgets are14KB(Home) and15KB(Village), including all stylesheet requests. Keep deterministic asset hashes, resource-request guards, initial CTA and functional checks; do not replace them with a flaky absolute Lighthouse-score gate.

Use a fresh Chrome process for each measured variant. An unchanged baseline reproduces different optional-font fallback metrics when contexts share one browser, even after fonts.ready. Do not edit typography to correct that capture artifact. Preserve raw runs, ranges, host load and configuration. Keep simulated mobile timing separate from observed/unthrottled and applied-throttling diagnostics. Do not delete a negative run or report the fastest score as acceptance.

Local benchmark proxies block external collection while permitting the existing Google library GET. Those proxy headers are test-only and must not become a production security or measurement change. Synthetic form requests must be intercepted locally.

Required checks: production/type build; unit suite; marketing_performance_check.cjs; village_campaign_check.cjs; public_surface_check.cjs; analytics_delivery_preservation_check.cjs; desktop/mobile screenshots and computed-style/content comparison. A production release still requires the normal exact-source CI and served-asset checks.
