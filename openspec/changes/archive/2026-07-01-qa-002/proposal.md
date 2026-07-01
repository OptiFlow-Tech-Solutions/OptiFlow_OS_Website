# QA-002: Testing Suite

## Summary

Define and systematize the QA testing layer for the OptiFlow OS static marketing website. The testing suite covers all 12+ pages across 5 test dimensions: accessibility, SEO, navigation, responsive layout, and core asset loading.

## Scope

- **E2E tests** — 5 Playwright spec files covering all marketing pages across 4 browser configurations (Chrome, Firefox, WebKit desktop + Chrome mobile)
- **Accessibility** — axe-core WCAG 2.1/2.2 AA scans on all pages; critical/serious violations block deploy
- **SEO** — Title, meta description, OG tags, canonical URLs, structured data (BreadcrumbList, Article), single h1 per page
- **Navigation** — All nav links clickable, mobile drawer functional, theme toggle persistence, FAQ accordion behavior
- **Responsive** — No horizontal overflow at 6 breakpoints, hamburger/desktop-nav visibility correct
- **Core assets** — core.css, core.js, footer present on all pages; logo loads with valid dimensions
- **CI integration** — Tests run via GitHub Actions on PR/merge, integrated into quality gates (GATE_TEST)

## Affected Specs

- `build-pipeline` — CI/CD pipeline must include `npm test` step
- `accessibility` — E2E a11y tests enforce zero critical/serious violations
- `seo` — SEO tests validate metadata injection from build pipeline
- `testing-suite` (new) — Defines test organization, coverage requirements, and quality gate criteria
