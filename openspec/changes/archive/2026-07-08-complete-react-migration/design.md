## Context

The React migration from the legacy static HTML frontend was initiated with F01 (React + Tailwind Project Scaffold). The scaffold set up Vite, Tailwind v4, design tokens, and React Router. A subsequent migration ported 15 pages from `src/pages/*.html` to `frontend/src/pages/*.jsx`. However, the migration was incomplete: two pages were left as stubs, two React pages have no routes, and the Docker pipeline still runs the obsolete static HTML build.

Current architecture:
- **React SPA**: Served by nginx at `/os/*`. Uses Vite with `base: '/os/'`. All 15+ routes are lazy-loaded with `<Suspense>`.
- **Old static HTML**: Still built by `scripts/assemble.mjs` in Docker Stage 1. Only 4 outputs are actually used: `dist/index.html` (root redirect), `dist/sitemap.xml`, `dist/robots.txt`, `dist/manifest.json`, and `dist/assets/img/*` (optimized images). The 16 assembled HTML pages at `dist/os/*/index.html` are built but never copied to the final image.
- **Nginx**: Brotli+gzip compression, legacy path redirects (e.g., `/pricing/` → `/os/pricing/`), SPA fallback for `/os/*`, security headers.
- **Shared components**: Button, Card, Section, SEOHead — used by 9 of 17 pages. 8 pages use raw HTML elements instead.

## Goals / Non-Goals

**Goals:**
- Migrate all remaining content from old HTML to React pages (Features: 10 missing sections, FeatureShowcase: 5 missing sections)
- Add routes for CompetitivePositioning and ServerError so those pages are reachable
- Remove the old static HTML build from Docker pipeline; extract image optimization as a standalone step
- Fix all hardcoded company data (emails, phones, WhatsApp) to use `data/site.js`
- Resolve pricing data conflict between Pricing.jsx and CompetitivePositioning.jsx
- Refactor all 8 raw-element pages to use shared Section/Card/Button components
- Delete legacy source files (`src/pages/`, `src/partials/`, `assets/css/`, `assets/js/`, `scripts/assemble.mjs`) once verified

**Non-Goals:**
- Adding new features or pages beyond what exists in old HTML
- Changing the visual design or redesigning pages
- Adding a CMS or content management system
- Backend API integration (pages remain static content)
- E2E or unit test coverage for migrated content (existing test coverage is sufficient)

## Decisions

### D1: Content migration strategy — inline JSX from old HTML

**Decision**: Copy text content, headings, and structure from old `src/pages/features.html` and `src/pages/feature-showcase.html` into the React components as JSX, following the existing pattern used for the already-migrated sections in each file.

**Rationale**: Features.jsx already has 1 complete section (Task Management) with `ProblemBox`, card grids, dashboard preview tables, and `FeatureCta` components. The 10 stub sections reference these same patterns — just with different feature names and content. The old HTML contains the complete content. There's no design decision to make; it's a direct content copy using the established JSX patterns.

**Alternatives considered**: 
- Fetch content from a CMS at runtime — overengineered for static marketing pages
- Generate React from HTML templates — the existing pattern works, the old HTML is already structured

### D2: Route architecture — consistent naming

**Decision**: Add routes with the same path names as the existing patterns:
- `competitive-positioning` → `/os/competitive-positioning` (already used by nginx redirect, line 90)
- `server-error` → `/os/server-error` (React catch-all `*` already handles true 404s; 500 needs a manual route for testing, but will be accessed by its component internally)

**Rationale**: The old nginx config already redirects `/competitive-positioning/` to `/os/competitive-positioning/` (line 90). The React route must match. For ServerError, all existing routes use kebab-case path segments matching file names.

### D3: Docker pipeline — extract image optimization, drop assembly

**Decision**: Replace the `static-builder` stage with a minimal image optimization stage. Move the root redirect page, sitemap, robots.txt, and manifest.json generation into a standalone script that doesn't depend on `src/pages/` or `src/partials/`.

**Rationale**: Stage 1 currently does:
1. `npm ci` (install all deps)
2. Run `assemble.mjs` (build 16 pages, generate sitemap/robots/manifest, optimize images)
3. The 16 pages are discarded; only redirect + SEO files + images survive

We can replace this with a lightweight stage that only:
1. Optimizes images with `sharp`
2. Generates the root redirect, sitemap, robots, manifest inline

This eliminates the `serve`, `eslint`, `html-validate`, `stylelint`, `husky`, `@playwright/test`, `@axe-core/playwright` dependencies from the Docker build, saving ~200MB of `node_modules` and ~30s build time.

**Alternatives considered**:
- Keep assembly as-is (no change) — wasteful, builds 8,500 lines of HTML for nothing
- Move images to frontend assets — the image optimization pipeline does WebP/AVIF conversion which is unrelated to the React build

### D4: Data consistency — single source of truth

**Decision**: All pages SHALL import company info from `data/site.js`. The `site.json` file remains as the canonical source for the old build pipeline and nginx config generation. `data/site.js` is the React-side mirror. This is a two-source pattern (not ideal) but the old pipeline still needs `site.json` for sitemap/robots/manifest generation.

**Rationale**: Eliminating `site.json` entirely would require rewriting sitemap/robots/manifest generation in the React build, which is out of scope. The practical fix is ensuring React pages don't duplicate data.

### D5: Shared component refactoring — minimal risk

**Decision**: Replace raw elements with shared components using the existing props interface. For pages that use custom CSS classes beyond what Section/Card/Button provide (e.g., FAQ's troubleshooting widget), leave custom classNames on the components — use the `className` prop passthrough that Section/Card/Button already support.

**Rationale**: The Section, Card, and Button components already accept `className` props and merge them with their defaults. Pages that use custom inline styles or complex layouts (like DemoBooking's calendar or FAQ's troubleshooting widget) won't break — they'll just get the shared component's base styles as well.

## Risks / Trade-offs

- **[Risk]** Deleting `src/pages/` and `src/partials/` before verifying React pages renders correctly → **Mitigation**: Only delete after docker build succeeds and pages are verified in browser
- **[Risk]** Features.jsx grows from 114 to ~600 lines → **Mitigation**: Acceptable; other pages (Pricing: 546, ProblemSolutions: 568, WhyOptiFlow: 560) are already this size
- **[Risk]** Image optimization script change breaks Docker build → **Mitigation**: Test `docker compose build` before committing
- **[Risk]** Two sources of truth for company data (`site.json` + `data/site.js`) could drift → **Mitigation**: Documented as known trade-off; full consolidation is out of scope for this change
