## 1. Setup — CSS and shared hooks

- [x] 1.1 Create `frontend/src/components/Nav.css` with nav component styles using `var(--*)` design tokens (fixed header, desktop nav, dropdown, hamburger, mobile drawer, overlay, `.scrolled` state, responsive breakpoints at 1024px/768px/480px)
- [x] 1.2 Create `frontend/src/components/Footer.css` with footer component styles using `var(--*)` design tokens (dark background, 5-column grid, typography, social icons, bottom bar, responsive breakpoints)
- [x] 1.3 Create `frontend/src/hooks/useScrollPosition.ts` — a custom hook returning `scrollY` state from a single passive scroll event listener, to be shared by Nav, ScrollTop, and StickyCTA

## 2. Footer component

- [x] 2.1 Create `frontend/src/components/Footer.tsx` — stateless component rendering: brand column (logo + tagline), 4 link columns sourced from `site.json.footer.columns`, contact column (phone/email/location from site.json), social icon links (LinkedIn, X, YouTube with inline SVG), theme toggle button via `useTheme()`, dynamic copyright year via `new Date().getFullYear()`
- [x] 2.2 Import `Footer.css` in Footer.tsx

## 3. Nav component

- [x] 3.1 Create `frontend/src/components/Nav.tsx` — component with: logo link, desktop nav links sourced from `site.json.nav.links` with active state via `useLocation()`, Resources hover dropdown sourced from `site.json.nav.dropdown`, theme toggle button via `useTheme()`, Book Demo CTA using `<Button variant="primary" glow as={Link}>`
- [x] 3.2 Add hamburger button and mobile drawer state — `useState` for `drawerOpen`, hamburger click toggles state, drawer renders all nav links + CTA, overlay element with click-to-close, keyboard Escape listener to close drawer
- [x] 3.3 Add scroll behavior — consume `useScrollPosition()`, apply `.scrolled` CSS class to header when `scrollY > 20`
- [x] 3.4 Import `Nav.css` in Nav.tsx

## 4. PageLayout, ScrollTop, and StickyCTA

- [x] 4.1 Create `frontend/src/components/ScrollTop.tsx` — floating button using `useScrollPosition()`, visible when `scrollY > 400`, smooth-scrolls to top on click, `aria-label="Scroll to top"`
- [x] 4.2 Create `frontend/src/components/StickyCTA.tsx` — fixed bottom bar using `useScrollPosition()`, visible when `scrollY > window.innerHeight`, contains Book Demo CTA using `<Button variant="primary" as={Link} to="/os/demo-booking/">`
- [x] 4.3 Create `frontend/src/components/PageLayout.tsx` — wrapper component rendering: skip-link anchor, `<Nav />`, `<main id="content" role="main">` with `<Outlet />`, `<Footer />`, `<ScrollTop />`, `<StickyCTA />`; CSS flex layout for sticky footer (`min-height: 100vh`, `display: flex`, `flex-direction: column`)

## 5. Integration

- [x] 5.1 Update `frontend/src/components/index.ts` — add exports for Nav, Footer, PageLayout, ScrollTop, StickyCTA
- [x] 5.2 Update `frontend/src/App.tsx` — replace flat single-route structure with layout route using `<Route element={<PageLayout />}>` wrapping all page routes
- [x] 5.3 Update `frontend/src/pages/Home.tsx` — wrap existing content in shared components (Container, Section) instead of raw div with inline padding

## 6. Validation

- [x] 6.1 Run `cd frontend && npm run build` — verify TypeScript compiles and Vite builds without errors
- [x] 6.2 Run `cd frontend && npm run dev` — manually verify nav renders at 1920px, 1024px, 768px, 480px, 375px; drawer opens/closes; scroll adds blur; theme toggle works in both nav and footer; footer stays at bottom
- [x] 6.3 Verify visual parity with static HTML — compare React nav/footer rendering against `dist/` output from `npm run build` (root) at matching breakpoints
- [x] 6.4 Verify accessibility — nav uses semantic `<nav>` and `<header>`, drawer has `aria-expanded` on hamburger, skip-link is first focusable element, theme toggle has `aria-label`
