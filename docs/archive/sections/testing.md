# Testing — Implementation Documentation
- **Current Score:** 58/100 | **Target Score:** 80/100 | **Gap:** 22 | **Last Updated:** 2026-07-06

## Overview / Current State
The project has a focused E2E test suite using Playwright with 5 spec files covering 14 pages across 4 browser projects (`chromium-desktop`, `chromium-mobile`, `firefox`, `webkit`). The E2E specs cover accessibility (axe-core), SEO metadata validation, navigation behavior, responsive breakpoints, and core asset loading (CSS/JS/favicon). Lighthouse CI is configured with performance, accessibility, SEO, and best-practice thresholds but is not yet integrated into the CI pipeline for automated enforcement.

No unit tests, API tests, integration tests, visual regression tests, or load tests exist. Test coverage is entirely end-to-end.

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|---|---|---|---|---|
| TEST-001 | Unit tests (utilities, validation functions) | High | 4 | Not Started |
| TEST-002 | API/integration tests (form endpoints, redirects) | Medium | 3 | Not Started |
| TEST-003 | Visual regression tests (Percy/Playwright screenshots) | Medium | 2 | Not Started |
| TEST-004 | Load testing (k6/Artillery) | Low | 2 | Not Started |

## Implementation Order
1. **TEST-001** — Write unit tests for `validate.mjs`, `assemble.mjs`, and any shared utility modules. Use Node's built-in `node:test` or Vitest.
2. **TEST-002** — Add integration tests for form submissions, redirect chains, and API endpoints (health check, sitemap).
3. **TEST-003** — Integrate visual regression testing (Playwright screenshot comparison or Percy) to catch unintended visual changes.
4. **TEST-004** — Add load testing with k6 or Artillery to establish baseline performance under concurrent users.

## Dependencies
- TEST-001 has no dependencies; test framework choice is the only decision.
- TEST-002 may depend on a running dev server; already available via `npm run dev`.
- TEST-003 depends on stable baselines; should run after TEST-001 and TEST-002 are in CI.
- TEST-004 is fully independent.

## Key Files
| File | Purpose |
|---|---|
| `tests/e2e/a11y.spec.ts` | Axe-core accessibility checks on all pages |
| `tests/e2e/seo.spec.ts` | SEO metadata validation |
| `tests/e2e/navigation.spec.ts` | Navigation and routing tests |
| `tests/e2e/responsive.spec.ts` | Responsive breakpoint tests |
| `tests/e2e/core-assets.spec.ts` | CSS, JS, and favicon loading tests |
| `playwright.config.ts` | Playwright configuration (4 browser projects) |
| `.lighthouserc.json` | Lighthouse CI thresholds |
| `scripts/validate.mjs` | Build-time validation (untested at unit level) |
| `scripts/assemble.mjs` | Build script (untested at unit level) |

## Acceptance Criteria
- [ ] Unit test coverage ≥ 80% on all build scripts and utility modules
- [ ] E2E test suite passes on all 4 browser projects in CI
- [ ] Lighthouse CI is integrated into CI workflow and enforces thresholds
- [ ] Visual regression tests run on every PR and flag visual diffs
- [ ] Load test establishes baseline: ≥ 100 concurrent users on `/` with p95 < 500ms
- [ ] All test commands are documented in `DEVELOPER.md`
- [ ] Test suite completes in under 5 minutes in CI
