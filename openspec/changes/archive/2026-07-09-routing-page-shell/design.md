## Context

The React SPA is scaffolded with Vite 6, React 19, React Router 7, and Tailwind CSS 4. The `App.tsx` currently has a single route (Home). The `PageLayout` component wraps pages with Nav, Footer, ScrollTop, and StickyCTA via `<Outlet />`. The nginx config already has SPA fallback for `/os/*` paths. The static HTML site uses CSS `@keyframes` animations for page transitions.

F-ARCH-001 (scaffold) and F-LAY-001 (layout) are complete — the routing layer sits on top of both.

## Goals / Non-Goals

**Goals:**
- Centralize all 15 route definitions in a single `routes.ts` config module
- Lazy-load all page components via `React.lazy()` with a shared `<Suspense>` boundary
- Automatically scroll to top on forward navigation, restore position on back/forward
- Port CSS page transitions to SPA navigation using the View Transition API
- Provide a `<Breadcrumb>` component derived from URL path segments
- Update `<title>` and `<meta name="description">` on every route change
- Render a 404 page for any unknown `/os/*` path

**Non-Goals:**
- Page content migration (handled by `page-migration` spec)
- SSR / server-side rendering
- Route guards or authentication
- Animated breadcrumb transitions
- Nested breadcrumb beyond URL path depth (no custom hierarchy mapping)

## Decisions

### 1. BrowserRouter with `/os` basename (already set, kept)

The existing `BrowserRouter basename="/os"` stays. HashRouter was considered for zero-config static hosting but rejected — clean URLs are essential for SEO across 14 indexable pages. Netlify (`netlify.toml`) and nginx (`nginx.conf:127-130`) already have SPA fallback rules.

### 2. Single routes.ts config file as source of truth

All route metadata lives in one module:

```
routes.ts → [
  { path, component (lazy), title, description },
  ...
]
```

This avoids scattering route info across components. The `App.tsx` Maps over this array to generate `<Route>` elements. Title/meta updates happen via a `<MetaHead>` component or a `useEffect` in a route wrapper.

### 3. View Transition API for page transitions (CSS-first, progressive)

```css
@view-transition {
  navigation: auto;
}
/* or programmatic: */
document.startViewTransition(() => updateDOM());
```

The View Transition API (`document.startViewTransition`) is natively supported in Chromium browsers. For non-supporting browsers, navigation just has no animation — a graceful degradation. No JS animation library dependency.

Alternatives considered:
- **Framer Motion** — powerful but adds a 30KB+ dependency for a simple crossfade. Overkill.
- **CSS classes on route change** — manual class toggling with `setTimeout`. Fragile timing.
- **View Transition API** — zero JS for basic crossfade, one CSS rule. Progressive. Chosen.

### 4. <Suspense> at router level, not per-route

A single `<Suspense fallback={<PageLoader />}>` wrapping all routes, not individual boundaries per route. For 14 static marketing pages with small bundles, per-route spinners create unnecessary visual flicker. A single top-level loader shows once on first visit to any lazy page.

### 5. Scroll restoration: save/restore by path key

```
ScrollToTop component:
  - On route change (useLocation):
    - If POP action (back/forward): let browser handle it naturally
    - If PUSH/REPLACE (forward navigation): window.scrollTo(0, 0)
```

React Router 7 passes the navigation `action` via `useNavigationType()` or location state — this lets us distinguish back/forward (POP) from programmatic navigation (PUSH). The browser natively remembers scroll position for history entries; we only interfere on new navigations.

### 6. Breadcrumbs: path-derived, not config-mapped

The `<Breadcrumb>` component splits the current path by `/`, filters empty segments, and maps each to a human-readable label. No need for a separate breadcrumb hierarchy config — URL paths already encode the structure:

```
/os/pricing/  →  Home  >  Pricing
/os/features/ →  Home  >  Features
```

Labels are derived by capitalizing the segment and replacing hyphens with spaces. Edge case: the root `/os/` shows no breadcrumbs.

## Risks / Trade-offs

- [BrowserRouter needs server-side fallback] → Already configured in nginx, Netlify, and Cloudflare Pages
- [View Transition API is Chromium-only at time of writing] → Graceful degradation: no animation in Firefox/Safari, content still works. Acceptable for a marketing site.
- [Lazy loading may cause layout shift during first load] → Mitigated by shared `<Suspense>` with a skeleton/loader that matches PageLayout structure
- [15 route stubs needed before page content exists] → Stub components render `<Section><Container><h1>Page Name</h1></Container></Section>` as placeholders. Content filled later by page-migration tasks.
