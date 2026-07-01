# Design: QA-002 Testing Suite

## Architecture

```
tests/e2e/
├── a11y.spec.js        — axe-core scans, WCAG 2.1/2.2 AA, all 14 pages
├── seo.spec.js         — title, meta desc, OG tags, h1 count, 12 pages
├── navigation.spec.js  — page loads, desktop nav clicks, mobile drawer, theme toggle, FAQ accordion
├── responsive.spec.js  — viewport breakpoints, hamburger visibility, horizontal overflow
├── core-assets.spec.js — CSS/JS/footer presence, logo load verification
└── playwright.config.js — 4 browser projects, serve dist on port 3000
```

## Decisions

1. **Playwright over Cypress** — Playwright is already a devDependency; supports Chromium, Firefox, WebKit, and mobile emulation in one package.
2. **axe-core integration** — `@axe-core/playwright` provides WCAG-compliant accessibility auditing directly in test assertions.
3. **Page list deduplication** — Each spec maintains its own PAGES array for clarity; tradeoff is minor duplication for test independence.
4. **`expect.soft` for a11y** — Accessibility tests use soft assertions so all page violations are reported, not just the first failure.
5. **4 browser projects** — chromium-desktop, chromium-mobile (iPhone 12), firefox-desktop, webkit-desktop. Full cross-browser coverage.
6. **`reuseExistingServer: true`** — Dev server on port 3000 is reused across test runs for speed.
7. **No unit tests** — Static HTML site with no client-side logic beyond core.js; E2E tests cover all meaningful behavior.

## Quality Gate: GATE_TEST

The test gate passes when all 5 spec files pass across all browser projects with 0 failures.
