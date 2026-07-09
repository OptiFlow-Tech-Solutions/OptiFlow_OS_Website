## 1. Route Configuration

- [x] 1.1 Create `frontend/src/routes.ts` with the route configuration array (15 entries: 14 product pages + 1 catch-all 404)
- [x] 1.2 Each route entry includes: `path`, `title`, `description`, and a lazy `component` via `React.lazy(() => import('./pages/PageName'))`

## 2. Page Stubs

- [x] 2.1 Create stub page components for all 14 product pages in `frontend/src/pages/`
- [x] 2.2 Each stub renders a minimal placeholder: `<Section><Container><h1>Page Title</h1></Container></Section>` using existing shared components
- [x] 2.3 Create `NotFound.tsx` stub with 404 messaging, Home link, and suggested navigation links
- [x] 2.4 Create `PageLoader.tsx` component (spinner or skeleton) for Suspense fallback

## 3. App Router Wiring

- [x] 3.1 Update `frontend/src/App.tsx` to map over routes config and generate `<Route>` elements
- [x] 3.2 Wrap all lazy routes in a single `<Suspense fallback={<PageLoader />}>` boundary inside the layout route
- [x] 3.3 Ensure catch-all `*` route is last and maps to `NotFound` component

## 4. Meta Head Updates

- [x] 4.1 Create `MetaHead` component that updates `document.title` and `<meta name="description">` from route metadata
- [x] 4.2 Render `<MetaHead>` inside each route component or via a route wrapper, driven by `useLocation()` matching to route config

## 5. Scroll Restoration

- [x] 5.1 Create `ScrollToTop` component using `useLocation()` and `useNavigationType()` to distinguish PUSH vs POP navigation
- [x] 5.2 On PUSH/REPLACE actions: scroll to top. On POP actions: let browser handle naturally
- [x] 5.3 Mount `<ScrollToTop />` inside `PageLayout` (replaces or extends existing `ScrollTop.tsx` floating button)

## 6. Page Transitions

- [x] 6.1 Add View Transition API CSS in `frontend/src/styles/transitions.css`: `@view-transition { navigation: auto; }` with crossfade timing
- [x] 6.2 Add `prefers-reduced-motion` media query to disable transitions
- [x] 6.3 Import transitions CSS in `frontend/src/styles/index.css` or `App.tsx`

## 7. Breadcrumb Component

- [x] 7.1 Create `Breadcrumb.tsx` component that splits `useLocation().pathname` into segments
- [x] 7.2 Convert path segments to human-readable labels (capitalize, replace hyphens with spaces)
- [x] 7.3 Render as `<nav aria-label="Breadcrumb"><ol>` with linked segments and plain-text current page
- [x] 7.4 Include JSON-LD `BreadcrumbList` structured data script block
- [x] 7.5 Add breadcrumb to `PageLayout`, hidden when path is `/` (home)

## 8. Build Verification

- [x] 8.1 Run `npm run build` in `frontend/` — verify no errors, all chunks produced
- [x] 8.2 Verify all 15 routes load in dev server (`npm run dev`)
- [x] 8.3 Verify 404 catch-all renders for `/os/nonexistent`
- [x] 8.4 Verify browser back/forward navigation works and preserves scroll position
- [x] 8.5 Verify document title changes on each route navigation
- [x] 8.6 Verify breadcrumb renders correct labels for 3+ different path depths
