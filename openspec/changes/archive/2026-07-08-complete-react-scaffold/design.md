## Context

The `frontend/` directory contains a Vite + React 19 + Tailwind 4 + React Router 7 scaffold with:
- 15 route stubs (only Home.jsx has partial content)
- Working Navbar (111 lines), Layout, ThemeProvider, Footer
- Design tokens in `tokens.css` mirroring `core.css` via CSS custom properties
- `site.js` mirroring `site.json` for dynamic data consumption

This scaffold needs completion so it can serve as the foundation for all 29 remaining features. The static HTML site in `src/pages/` serves as the content reference.

**Constraints:**
- Routes must use `/os/` prefix per `os-route-prefix` spec
- Design tokens must match `core.css` and `DESIGN.md`
- Static site remains unchanged during migration
- No page content changes — just structural port from HTML to JSX
- Must pass existing build + validate pipeline (`npm run build && npm run validate`)

## Goals / Non-Goals

**Goals:**
- Complete all 15 page stubs with real content ported from static HTML
- Build shared components (Button, Card, Section, SEOHead) consumed by pages
- Align routes to `/os/` prefix
- Add Tailwind theme config for named utility classes
- Add Vitest + React Testing Library for component tests
- Add barrel exports for clean imports
- Dark mode toggle works across all pages
- Production build succeeds with bundle size <200KB JS / <50KB CSS gzipped

**Non-Goals:**
- Adding new page content or design changes beyond what's in static HTML
- Porting core.js interactivity (forms, FAQ accordion, pricing toggle) — that's page-level work in later features
- Django backend integration — forms will use Netlify Forms / CF Functions like the static site
- Analytics injection — already handled by existing partial
- SEO metadata (SEOHead component renders meta tags, but full SEO comes with each page's content port)

## Decisions

### D1: Use CSS custom properties over Tailwind theme redefinition
**Decision:** Keep `tokens.css` as the single source of truth for design tokens. Map tokens into Tailwind's `theme.extend.colors` using `var()` references rather than duplicating values.

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      accent: 'var(--color-accent)',
      teal: 'var(--color-teal)',
      // ...
    }
  }
}
```

**Rationale:** Single source of truth avoids drift. `tokens.css` is already battle-tested from the static site. If tokens change, only one file updates.

**Alternative considered:** Duplicate oklch values into Tailwind config. Rejected — two sources of truth will drift.

### D2: Shared components use class-variance or simple props
**Decision:** Plain React props with conditional classNames. No class-variance-authority or similar library.

**Rationale:** Only 6 variants across 4 components (Button: primary/secondary/outline, Card: default/hover, Section: default). A utility library adds a dependency for what a few ternaries handle.

**Alternative considered:** CVA library. Rejected — overkill for 4 components with simple variants.

### D3: Page stubs replaced in-place, not new files
**Decision:** Edit existing `frontend/src/pages/*.jsx` files. Do not create new files.

**Rationale:** Routes already wired. Page files already exist with correct names. Avoids routing regressions.

### D4: Route structure uses `/os/` prefix with Vite `base`
**Decision:** Set `base: '/os/'` in `vite.config.js` and use relative paths in Router. Routes defined as `/` (home), `/pricing`, etc. — Vite's base handles the prefix.

**Rationale:** Clean Router definitions without `/os/` noise on every `<Route path>`. Vite handles asset paths and the base URL transparently.

**Alternative considered:** Prefix every route with `/os/` in JSX. Rejected — noisy and error-prone. Vite's `base` option is the standard approach.

### D5: Test framework — Vitest + React Testing Library
**Decision:** Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` as dev dependencies. Tests live alongside components (`Component.test.jsx`).

**Rationale:** Vitest is Vite-native (same config, fast HMR). React Testing Library is the React ecosystem standard.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Route change (`/` → `/os/`) breaks existing Navbar links | Pages 404 | Audit all `to=` props in Navbar, Footer, App.jsx |
| Static HTML → JSX port misses content | Content gaps | Compare page-by-page output; validate against static site |
| Tailwind purge removes needed classes | Missing styles | Use `content: ['./index.html', './src/**/*.{js,jsx}']` |
| Vite `base: '/os/'` conflicts with dev server | Dev server breakage | Test `npm run dev` after config change |
| Tokens.css unused by Tailwind classes | Visual drift | Visual comparison: React build vs static site screenshots |
| Bundle size exceeds target | Performance regression | `vite build` reports sizes; add bundle-visualizer if needed |
