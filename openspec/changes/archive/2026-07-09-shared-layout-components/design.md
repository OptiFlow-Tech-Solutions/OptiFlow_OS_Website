## Context

The React SPA (`frontend/`) currently has a flat single-route structure in `App.tsx` — no layout wrapping, no nav, no footer. The 16-page static HTML site uses `src/partials/nav.html` and `footer.html` injected at build time via `<!-- INCLUDE -->` directives with `{{ACTIVE_PAGE}}` template expressions for active state. The React app needs equivalent components that work client-side with React Router for page transitions.

Existing foundation is in place: `ThemeProvider` / `useTheme()` (dark mode context), `design-tokens.css` (all CSS custom properties), `GlobalStyles` (base reset), and 6 shared components (Button, Card, Section, Container, Input). The static nav consumes these same design tokens from `core.css`.

## Goals / Non-Goals

**Goals:**
- Exact visual parity with static HTML nav, drawer, and footer at all breakpoints (320px–1920px+)
- Scroll-triggered nav styling (`.scrolled` class with backdrop-blur + border)
- Mobile drawer with same slide animation as original (`right: -320px → 0`, cubic-bezier easing)
- Active page highlighting driven by current route, not build-time template
- Theme toggle in both nav and footer, consuming existing `useTheme()` hook
- Footer always at page bottom via flex layout in PageLayout
- ScrollToTop floating button, StickyCTA bottom bar

**Non-Goals:**
- Backend `SiteSetting` model or API for dynamic nav (deferred to future feature)
- Removing static HTML nav/footer or modifying `assemble.mjs` (legacy system untouched)
- Animating page transitions (handled separately in future migration features)
- i18n or multi-language nav links

## Decisions

### Decision 1: CSS strategy — dedicated `.css` files, not inline styles

**Rationale**: The existing Button component uses inline `style={{}}` objects for visual properties — that works for simple, stateless components. The nav has complex state-driven styles: `.scrolled` (scroll > 20px), `.open` (drawer), `.active` (current page), `.nav-dropdown:hover` (CSS-only dropdown), and responsive breakpoints (`@media max-width: 1024px` to hide desktop nav). Inline styles would require `useState` + `useEffect` for every visual state and can't express `:hover` or `@media` queries at all.

**Alternatives considered:**
- CSS Modules (`.module.css`): Vite-native scoping. Rejected — over-engineering for components that will never have naming collisions (only one Nav, one Footer).
- Tailwind-only: Would work for layout but can't express `backdrop-filter`, `cubic-bezier` easings, or complex pseudo-states cleanly. Also the Button pattern already uses `var()` references for tokens — Tailwind can't replace that.
- Importing core.css: Would pull 513 lines of static-site styles, most of which don't apply to React. Two divergent sources of truth.

**Chosen**: Create `Nav.css` and `Footer.css` with visual styles scoped under component-specific class names. Use `var(--*)` for all design tokens (colors, spacing, transitions, z-index). This exactly mirrors how `core.css` structures nav/footer styles, but isolated to the React components.

### Decision 2: Link data from site.json

**Rationale**: `site.json` already contains structured `nav.links`, `nav.dropdown`, and `nav.cta` arrays. The build script ignores them, but they're perfectly structured for React component consumption. Using them as the data source means zero duplication of link data and a clear path to future API-driven nav (just swap the data import for a fetch call).

**Mapping**:
```
site.json.nav.links[i]      → Nav desktop + drawer links
site.json.nav.dropdown       → Resources dropdown (label + items)
site.json.nav.cta[0]         → Book Demo CTA button
site.json.footer.columns[]   → Footer link columns
site.json.company/phone/email/location/year → Footer text content
```

**Alternatives considered:**
- Hardcode links in JSX: Exact parity with nav.html but duplicates data already in site.json. More work to change links later.
- Fetch from API: Future-proof but blocks this feature on backend work that's not scoped.

### Decision 3: PageLayout as React Router layout route

**Rationale**: React Router v7's `<Outlet />` is the idiomatic way to wrap pages in a shared shell. All page content renders inside `<main>` between Nav and Footer, with footer pushed to bottom via CSS flex.

```
<BrowserRouter basename="/os">
  <Routes>
    <Route element={<PageLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      {/* ...future pages */}
    </Route>
  </Routes>
</BrowserRouter>
```

The layout is a single route wrapping all pages. No per-page `<PageLayout>` wrapping needed — pages just render their content.

**Alternatives considered:**
- Per-page wrapping: `<Home>` renders `<PageLayout><HomeContent/></PageLayout>`. Rejected — every page must remember to wrap, defeats "single source of truth."
- Higher-order component: `withLayout(Home)`. Rejected — less readable than route nesting, harder to type with TypeScript.

### Decision 4: Component structure — one file per top-level component

**Rationale**: Nav is one React component file regardless of its internal complexity (desktop links, dropdown, drawer, CTA). Sub-pieces stay as internal helper functions or variables in the same file. This matches the ponytail principle: "one Nav, one Footer, one PageLayout."

- `Nav.tsx`: Hamburger state, scroll listener, drawer open/close, keyboard Escape, theme toggle
- `Footer.tsx`: Stateless rendering — all data from imports
- `PageLayout.tsx`: Structural wrapper, imports Nav and Footer, contains ScrollTop + StickyCTA

**Alternatives considered:**
- Split into `NavDesktop.tsx`, `NavMobile.tsx`, `NavDrawer.tsx`: Cleaner separation but 5 files for what is conceptually one nav bar. Complexity cost of prop drilling and State management across files > benefit of smaller files.
- Single `Layout.tsx` containing everything: Too big (~300+ lines). The Nav alone is complex enough to justify its own file.

### Decision 5: ScrollTop and StickyCTA as separate lightweight components

**Rationale**: These are independent UI elements with their own visibility logic (scroll position thresholds). They're not coupled to Nav or Footer logic. Small, self-contained components with a single `useEffect` each.

- **ScrollTop**: Appears at scrollY > 400px, smooth-scrolls to top on click
- **StickyCTA**: Fixed bottom bar, visible only when scrolled past viewport height (hero section scrolled past)

Both use `useState` + scroll event listener (passive). No external dependencies.

## Risks / Trade-offs

- **[CSS specificity conflicts]** → Use component-specific class names (`.react-nav`, `.react-footer`) rather than generic names that might collide with core.css when both are loaded in transition period
- **[Drawer animation jank]** → The original uses `right: -320px → 0` with `cubic-bezier(0.22, 1, 0.36, 1)`. Use CSS transition on `transform: translateX()` instead — better GPU compositing, same visual feel
- **[Scroll performance]** → Scroll listener on `window` for nav blur + ScrollTop + StickyCTA = 3 listeners. Use a single scroll handler in a custom `useScrollPosition` hook that all three components share to avoid redundant event listeners
- **[site.json import in client bundle]** → Importing the full site.json exposes all page metadata to the client. Acceptable since this is a public marketing site with no secrets. If this becomes a concern later, extract just nav/footer data to a separate file.
- **[Double theme toggle]** → Nav and Footer both have theme toggle buttons. Both consume `useTheme().toggleTheme` — no risk of state desync since they share the same context.
- **[Static site coexistence]** → During migration, both the static HTML site and React SPA exist. Nav/footer might briefly appear duplicated if both are served. Handled by deployment configuration (nginx routes), not component code.
