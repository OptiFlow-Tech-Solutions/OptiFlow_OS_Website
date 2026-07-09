## Why

The 16-page static HTML site injects nav and footer via build-time `<!-- INCLUDE -->` directives — every page copy-pastes the same 66 lines of markup. The React SPA needs these layout components to become a functional shell for the page migration pipeline. Porting them now as true React components creates a single source of truth for navigation with shared state management (theme, active page, scroll behavior) instead of duplicate vanilla JS across pages.

## What Changes

- Create **Nav** component: desktop links (8 items), Resources dropdown, Book Demo CTA, mobile hamburger + slide-in drawer, scroll blur/border behavior, active page highlighting
- Create **Footer** component: 5-column grid (brand, product, solutions, resources, contact), social icons (LinkedIn, X, YouTube), theme toggle
- Create **PageLayout** component: nav + scrollable `<main>` slot + footer, wraps all page routes
- Create **ScrollTop** component: floating button that appears after scrolling 400px
- Create **StickyCTA** component: fixed bottom CTA bar visible only when scrolled past hero
- Port all nav JS behaviors to React idioms: scroll listener with `.scrolled` class, drawer open/close/overlay/Escape, `useTheme()` integration for toggle buttons
- Read nav link data from `site.json` (`nav.links`, `nav.dropdown`, `nav.cta`) as the single source of truth
- Map CSS custom properties (`--nav-h`, `--z-nav`, `--z-drawer`, etc.) from existing design tokens; nav/footer visual styles live in dedicated CSS files imported by components
- Add `<PageLayout>` as a React Router layout route in App.tsx, replacing the flat single-route structure

## Capabilities

### New Capabilities

- `react-nav`: Navigation bar component with desktop links, Resources dropdown (CSS hover reveal), Book Demo CTA, mobile hamburger button, slide-in drawer with overlay, scroll-triggered background blur/border, active page highlight via `useLocation`, keyboard Escape to close drawer, and theme toggle button consuming `useTheme()`. All link data sourced from `site.json.nav`.
- `react-footer`: Footer component with 5-column responsive grid (brand tagline, Product links, Solutions links, Resources links, Contact info), social media icon links (LinkedIn, X, YouTube), theme toggle button, and `{{YEAR}}` dynamic year. Company data sourced from `site.json` via import.
- `react-page-layout`: PageLayout wrapper component composing Nav + `<main>` outlet + Footer. Renders as a React Router layout route with `<Outlet />` for page content. Ensures footer stays at bottom via flex layout. Includes `ScrollTop` and `StickyCTA` global UI elements.

### Modified Capabilities

- `shared-components`: Add Nav, Footer, PageLayout, ScrollTop, and StickyCTA to the shared components registry. Add requirements for scroll behavior, drawer animation, active page detection, and visual parity with static HTML equivalents at all breakpoints.

## Impact

- **New files**: `frontend/src/components/Nav.tsx`, `frontend/src/components/Nav.css`, `frontend/src/components/Footer.tsx`, `frontend/src/components/Footer.css`, `frontend/src/components/PageLayout.tsx`, `frontend/src/components/ScrollTop.tsx`, `frontend/src/components/StickyCTA.tsx`
- **Modified files**: `frontend/src/App.tsx` (replace flat route with layout route), `frontend/src/components/index.ts` (add exports), `frontend/src/main.tsx` (no changes needed — ThemeProvider already wraps)
- **Dependencies**: `react-router-dom` v7.5 (already installed), `site.json` (already exists, nav data section previously unused)
- **No backend, database, or API changes** — `SiteSetting` model and `GET /api/site-settings/` deferred to future dynamic nav feature
- **Legacy untouched**: `src/partials/nav.html`, `src/partials/footer.html`, `assets/css/core.css`, `assets/js/core.js`, `scripts/assemble.mjs` remain unchanged until full React migration complete
