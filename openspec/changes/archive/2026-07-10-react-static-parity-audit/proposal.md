## Why

The React frontend has reached structural parity (all 15 pages exist with section components) but functional, visual, and data consistency gaps remain against the static HTML baseline. Without a systematic audit and reconciliation, these regressions ship to production — broken interactions, incorrect content, hardcoded data, and missing behaviors that erode trust and confuse users.

## What Changes

- **Systematic audit** of all 15 React pages against static HTML counterparts across content, visuals, interactions, responsiveness, and accessibility
- **Fix every regression** — missing content, broken interactions, visual mismatches, responsive breakpoints
- **Centralize site data** — Nav and Footer components read from `site.json` (or a shared config module) instead of hardcoding links
- **Add 500 error page** as a dedicated route with proper error handling, not falling through to 404
- **Verify core.js parity** — every static JS behavior (form submission, FAQ toggle, theme, scroll reveal, exit intent, sticky CTA, scroll-to-top, typewriter, parallax, mobile drawer) has a working React equivalent
- **Remove dead code** — unused components, duplicate styles, orphaned files
- **Validate all 16 pages** pass the same lint/validate pipeline as the static site

## Capabilities

### New Capabilities
- `parity-audit-framework`: Structured comparison methodology covering content, visual, functional, responsive, and accessibility dimensions per page, producing a traceable mismatch report
- `site-data-centralization`: Shared site configuration module that Nav, Footer, and page components consume to eliminate hardcoded company data and navigation links

### Modified Capabilities
- `page-migration`: 500 error page route and component added; ArticleDetail page verified as additive (not a regression)
- `react-nav`: Nav component reads from centralized site config instead of embedded link arrays
- `react-footer`: Footer component reads from centralized site config
- `style-consistency-enforcement`: Extended to cover parity of per-page CSS files with static `<style>` blocks meaning "no visual regression" not just "no inline styles"
- `react-ui-audit`: Scope narrowed — this change executes the audit and reconciliation that the audit spec defined the framework for

## Impact

- Affected: All 15 React page components, Nav, Footer, shared section components
- Data: New `frontend/src/data/siteConfig.ts` module; `site.json` remains canonical source (manual sync until API is live)
- Routes: New `/500` route, existing catch-all remains for true 404s
- Testing: All existing Playwright E2E tests must pass; new parity-focused tests added
- No breaking changes to backend or deployment pipeline
