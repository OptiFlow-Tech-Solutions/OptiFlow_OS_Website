# Analytics (Plausible)
- **Status:** partial | **Used On:** all 16 pages
- **Priority:** medium

## Feature IDs
- FE-003 — cookie consent gates analytics until accepted

## Pending Improvements
- [ ] Consent-gated loading under FE-003

## Dependencies / Implementation Notes
Injected via `src/partials/analytics.html` (3 lines). Uses Plausible Analytics — privacy-first, no cookies, no PII. DNS prefetch configured (`<link rel="dns-prefetch">`) for `plausible.io`. Currently loads unconditionally on all pages. Under FE-003, analytics script should be deferred until cookie consent is accepted.
