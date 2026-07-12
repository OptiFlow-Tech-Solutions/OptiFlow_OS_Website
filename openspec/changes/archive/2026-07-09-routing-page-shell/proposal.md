## Why

The React SPA scaffold is in place (Vite + React Router + PageLayout shell) but `App.tsx` has only a single Home route. To enable client-side navigation across the site with preserved UX, all 15 SPA routes need to be wired up with scroll restoration, page transitions, lazy loading, and breadcrumbs. The static HTML site already has CSS-based page transition animations — porting these to SPA navigation preserves the visual polish users expect.

## What Changes

- Wire all 15 SPA routes into React Router: 14 product pages + 1 catch-all 404
- Create a route configuration module (`routes.ts`) as the single source of truth for path, component, title, and description metadata
- Implement automatic scroll-to-top on route navigation (preserving browser back/forward scroll position)
- Add route-level code splitting via `React.lazy()` with `<Suspense>` boundaries
- Build a dynamic `<Breadcrumb>` component that derives trail from the current URL path
- Port CSS page transition animations to SPA navigation using the View Transition API with a CSS-only fallback
- Each route renders title + meta description (via document head updates)

## Capabilities

### New Capabilities
- `react-router-config`: Centralized route configuration module with path → component mapping, titles, descriptions, and lazy loading declarations for all 15 SPA routes
- `scroll-restoration`: Automatic scroll-to-top on forward navigation while preserving scroll position for browser back/forward
- `page-transitions`: SPA page transition animations using CSS View Transition API with graceful degradation
- `lazy-loading-routes`: Route-level code splitting via `React.lazy()` with `<Suspense>` fallback boundaries
- `breadcrumb-navigation`: Dynamic breadcrumb component that derives navigation trail from the current URL path segments

### Modified Capabilities
- `react-scaffold`: The react-scaffold spec requires "15 routes render content" and "unknown route shows 404" — this change completes that implementation. No requirement changes, only fulfillment.

## Impact

- `frontend/src/App.tsx` — replaced with multi-route configuration
- `frontend/src/routes.ts` — new route config module
- `frontend/src/components/Breadcrumb.tsx` — new breadcrumb component
- `frontend/src/components/MetaHead.tsx` — new document head management
- `frontend/src/pages/` — 15 page components (created as stubs here, content filled by page-migration)
- `frontend/src/styles/` — transition animations CSS
- No backend, database, or API changes
- No new npm dependencies required (React Router 7 already installed)
