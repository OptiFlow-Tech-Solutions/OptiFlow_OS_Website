# Accessibility — Implementation Documentation
- **Current Score:** 62/100 | **Target Score:** 85/100 | **Gap:** 23 | **Last Updated:** 2026-07-06

## Overview / Current State
Accessibility is partially implemented with attention to keyboard navigation and reduced-motion preferences. All pages include a skip-to-content link as the first focusable element. The `prefers-reduced-motion` media query is respected globally — all animations and transitions are disabled when the user indicates this preference. Focus-visible outlines are styled consistently across all interactive elements using `:focus-visible`.

WCAG 2.2 AA color contrast validation is enforced at build time via `validate.mjs`, which uses the Oklch color space for perceptually accurate contrast ratio calculations. Axe-core is integrated into the Playwright E2E test suite and runs against all 14 pages, flagging only `critical` and `serious` violations. Interactive FAQ items use `aria-expanded` to communicate toggle state. Navigation elements carry `aria-label` attributes. The mobile drawer closes on `Escape` key press.

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|---|---|---|---|---|
| ACC-001 | `aria-hidden="true"` on decorative SVGs | High | 2 | Not Started |
| ACC-002 | Consistent skip-to-content across all pages | Medium | 1 | Not Started |
| ACC-003 | ARIA labels on interactive components | High | 4 | Not Started |

## Implementation Order
1. **ACC-002** — Audit and standardize the skip-to-content link on every page template. Small scope, immediate impact.
2. **ACC-001** — Add `aria-hidden="true"` to all decorative/icon SVGs. Prevent screen readers from announcing redundant icon markup.
3. **ACC-003** — Add `aria-label` or `aria-labelledby` to buttons, form controls, and custom interactive widgets that lack visible text labels.

## Dependencies
- All three features are independent and can be worked on in parallel.

## Key Files
| File | Purpose |
|---|---|
| `assets/css/core.css` | Skip-to-content, focus-visible, reduced-motion styles |
| `scripts/validate.mjs` | Oklch-based WCAG 2.2 AA contrast validation |
| `tests/e2e/a11y.spec.ts` | Axe-core E2E tests for all 14 pages |
| `src/pages/*.html` | Skip-to-content links on individual pages |
| `src/includes/nav.html` | Navigation with `aria-label` attributes |
| `src/pages/faq.html` | FAQ items with `aria-expanded` |

## Acceptance Criteria
- [ ] Axe-core reports zero `critical` and zero `serious` violations on all 14 pages
- [ ] All decorative SVGs have `aria-hidden="true"` (screen readers ignore them)
- [ ] Skip-to-content link is present, functional, and consistent on every page
- [ ] All interactive elements lacking visible text have descriptive `aria-label` attributes
- [ ] Keyboard navigation: all focusable elements are reachable via `Tab`, drawer closes on `Escape`
- [ ] Color contrast ratio ≥ 4.5:1 for all text (AA) and ≥ 3:1 for large text
- [ ] `prefers-reduced-motion` is respected on all animations and transitions
- [ ] Form inputs have associated `<label>` elements or `aria-labelledby`
