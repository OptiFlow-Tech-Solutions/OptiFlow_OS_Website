# Proposal: Interactive Runtime (SYS-003)

## Why

The current interactive layer has significant quality debt:

1. **Dead code** — `motion.mjs` (47 lines) ships to zero pages. It's a ghost module.
2. **Widespread duplication** — 4 pages duplicate sticky CTA logic, 3 duplicate scroll-to-top, 3 duplicate stagger animation, 2 duplicate counters. core.js does it already.
3. **Two FAQ systems** — `.faq-q` (demo-booking, pricing) vs `.faq-question` (core.js). The former lacks `aria-expanded`.
4. **Two counter systems** — `data-count` (core.js) vs `data-target` (page scripts). Pricing's `data-target` counters have no JS — broken.
5. **Accessibility gaps** — calendar not keyboard-accessible, no Escape for drawer, no `aria-invalid` on forms, no focus trap in drawer.
6. **Performance issues** — unthrottled mousemove (home, why-optiflow), continuous typewriters (never pause on blur), unbounded intervals, scroll listeners without `{passive: true}`.

## What Changes

| Area | Change | Impact |
|------|--------|--------|
| `assets/js/motion.mjs` | Delete | Dead code removal |
| `assets/js/core.js` | Add: Escape key for drawer, focus trap, smooth scroll, `aria-invalid` on forms, typewriter pause on blur, debounced mousemove helpers | Accessibility + perf |
| `src/pages/home.html` | Delete duplicate sticky-CTA/scroll-top listeners, throttle mousemove, pause typewriter on blur | `/home/` |
| `src/pages/demo-booking.html` | Unify FAQ to `.faq-question`, make calendar keyboard-accessible, add `aria-invalid` to form, remove duplicate counter/stagger/reveal | `/demo-booking/` |
| `src/pages/pricing.html` | Unify FAQ to `.faq-question`, fix broken counters (use `data-count`), remove duplicate sticky-CTA/scroll-top | `/pricing/` |
| `src/pages/why-optiflow.html` | Throttle mousemove, pause typewriter on blur | `/why-optiflow/` |
| `src/pages/privacy-policy.html`, `terms.html` | Remove duplicate sticky CTA listeners, add `{passive: true}` | `/privacy/`, `/terms/` |
| `src/pages/product-overview.html` | Remove duplicate reveal observer | `/product-overview/` |
| `src/pages/newsletter.html` | Remove duplicate stagger observer | `/newsletter/` |
| `src/pages/problem-solutions.html` | Pause pain-point rotator on blur, cleanup on unload | `/problem-solutions/` |
| `src/pages/contact.html` | Add `aria-invalid` to form | `/contact/` |
| `src/pages/faq.html` | Debounce search input | `/faq/` |
| `src/partials/nav.html` | No change needed (core.js handles Escape + focus trap) | Shared |

## What Stays

- All visual interactions preserved (typewriters, mousemove effects, counters, accordions)
- No new dependencies
- All current behavior intact — just cleaner, faster, more accessible
- Page-specific effects (mouse glow, magnetic buttons, parallax) stay — only performance tuned

## Risks

- **Low risk**: Dead code deletion is zero-impact
- **Low risk**: Deduplication — core.js already handles these features; removing duplicates can't regress
- **Medium risk**: Calendar keyboard rework — need to verify all calendar interactions still work
- **No risk**: Performance tweaks (throttle, passive, visibilitychange) are additive
