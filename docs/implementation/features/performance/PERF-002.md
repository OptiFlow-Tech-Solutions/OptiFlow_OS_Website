# PERF-002: Print Stylesheet
- **Status:** Pending | **Priority:** LOW | **Est. Hours:** 0.3
- **Category:** Performance | **Phase:** 10
- **Score Impact:** Perf +2

## Problem / Expected / Affected
No `@media print` styles exist in `core.css`. Printing any page renders the full web layout — navigation bars, CTA buttons, hero sections, and decorative elements waste ink/toner and make printed output unreadable on A4 paper.

Expected: A print media block that hides navigation, CTAs, hero sections, and large decorative elements while keeping the main content legible at a reasonable font size.

## Acceptance Criteria
- [ ] Navigation hidden in print output
- [ ] CTA buttons and call-to-action sections hidden
- [ ] Footer simplified (contact info preserved, decorative elements removed)
- [ ] Body text renders at readable size on A4 (black on white)

## Implementation
Add a single `@media print { ... }` block to `core.css` targeting `.nav`, `.cta`, `.hero`, and relevant footer decorative elements with `display: none`. Set body to black text on white background at a print-friendly size.

## Dependencies / Definition of Done
- **Depends on:** None
- **DoD:** Print Preview in browser shows clean, readable output without navigation or CTAs.
