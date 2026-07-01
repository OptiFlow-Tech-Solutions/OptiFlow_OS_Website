# Tasks: QA-001 — Accessibility Compliance

- [x] 1. Add `checkContrast()` to `scripts/validate.mjs` — parse oklch tokens from core.css, compute WCAG 2.2 contrast ratios, report violations
- [x] 2. Add `aria-controls` to admin.html tab buttons and matching `id` attributes to tab panels
- [x] 3. Add `axe-core` page-level accessibility scans to Playwright E2E test suite (added feature-showcase + competitive-positioning)
- [x] 4. Run `npm run build && npm run validate` — 0 errors, 0 contrast violations (teal was at 4.33:1, fixed to 4.5+:1)
- [x] 5. Fix teal color contrast: `oklch(55% 0.10 210)` → `oklch(52% 0.10 210)` to pass WCAG AA 4.5:1
- [x] 6. Fix 2 pre-existing stylelint errors (redundant shorthand values in admin login card margins)
- [x] 7. Run `npm run lint:js` — 0 new errors (46 pre-existing, none from changes)
- [x] 8. Run `npm run lint:all` — stylelint clean, 18 pre-existing html-validate errors (contact.html, product-overview.html)
