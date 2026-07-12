## Context

The React frontend (React 19 + Vite 6 + TypeScript + Tailwind 4) has been scaffolded with 15 page components, 33 shared components, and CSS design tokens ported from `assets/css/core.css`. The static HTML site (16 pages in `src/pages/`) built by `scripts/assemble.mjs` is the canonical baseline. Site data (nav links, footer columns, company info) lives in `site.json` and is injected during static build — the React counterpart hardcodes this data in Nav.tsx and Footer.tsx.

The scope is 15 pages, 16 static counterparts (one new: ArticleDetail; one missing: 500.html), shared layout components (Nav, Footer, PageLayout), and interactive behaviors ported from `assets/js/core.js` (356 lines of vanilla JS).

## Goals / Non-Goals

**Goals:**
- Achieve pixel-level visual parity at 4 breakpoints (480, 768, 1024, 1440px)
- Achieve functional parity for all interactive behaviors (forms, accordions, modals, scroll effects)
- Eliminate all hardcoded site data in favor of a single `siteConfig.ts` module derived from `site.json`
- Add dedicated 500 error route with proper error boundary page
- Verify all 15 pages pass parity checks before closing

**Non-Goals:**
- New features or UI enhancements beyond static baseline
- Backend API integration (Netlify Functions, Django) — forms still use existing `/api/` endpoints only if the static site already calls them
- Dark mode enhancements or new theme variants
- Performance optimization beyond parity matching
- SEO/meta tag audit (handled by `article-seo` and `analytics-injection` specs)

## Decisions

### D1: Audit methodology — automated visual + manual content

**Choice**: Automated visual diff via Playwright screenshot comparison for layout/spacing/colors, plus manual content comparison for text/image parity.
**Alternatives considered**: 
- Pure manual audit (too slow for 15 pages × 4 breakpoints)
- Pure automated (can't verify content correctness)
**Rationale**: Screenshots catch visual regressions instantly; manual content review catches text drift.

### D2: Site data centralization — `siteConfig.ts` module

**Choice**: Create `frontend/src/data/siteConfig.ts` with a typed export of nav, footer, and company data, manually synced from `site.json`. Nav and Footer consume this module via imports.
**Alternatives considered**:
- Import `site.json` directly (JSON imports work but lose TypeScript types; also `site.json` is at repo root, outside `frontend/`)
- Build-time injection via Vite plugin (overengineered for static data)
**Rationale**: A TS module gives type safety, lives in the React source tree, and is trivially updatable. When the Django API is live, this module becomes a thin wrapper around an API call.

### D3: 500 page — dedicated route with error boundary

**Choice**: Add `/500` route in `routes.ts` pointing to a new `ServerError.tsx` page component. Wrap `App.tsx` with a React error boundary that navigates to `/500` on unhandled errors.
**Alternatives considered**:
- Use catch-all `*` route for 500 (semantically wrong — a server error isn't a "page not found")
- Omit 500 page (static site has it; parity requires it)
**Rationale**: Dedicated route matches static site behavior and provides correct HTTP semantics.

### D4: Page-by-page reconciliation order

**Choice**: Audit all pages first (produce mismatch report), then fix by severity: critical → major → minor. Pages ordered by traffic priority: Home, Pricing, Demo Booking, Contact, Features, then remaining pages.
**Rationale**: Fix critical issues first; high-traffic pages deliver the most value earliest.

## Risks / Trade-offs

- **[Visual drift from Tailwind]**: Tailwind utility classes may not map 1:1 to core.css custom properties. → **Mitigation**: All page-specific styles stay in dedicated `.css` files using CSS variables (same as static site); Tailwind only supplements layout utilities (flex, grid, spacing).
- **[siteConfig.ts sync drift]**: If `site.json` is updated but `siteConfig.ts` is not, the React site will show stale data. → **Mitigation**: Document the sync requirement; add a validate script check comparing both files.
- **[500 page rarely tested]**: Error boundary paths are hard to test manually. → **Mitigation**: Include Playwright test that intentionally triggers an error and verifies the 500 page renders.
- **[Scope creep]**: Temptation to "improve while fixing" will delay parity. → **Mitigation**: Strict rule — any improvement beyond parity moves to a follow-up change. This change is reconciliation only.

## Open Questions

- None at proposal stage. All technical decisions are resolved above.
