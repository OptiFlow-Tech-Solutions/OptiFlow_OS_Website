## 1. Tailwind Theme Configuration

- [x] 1.1 Create `tailwind.config.js` with `theme.extend.colors` mapping all tokens from `tokens.css` via `var()` references (accent, teal, green, lime, bg, surface, fg, muted, border + soft variants) — **adapted for Tailwind 4: `@theme` in `theme.css`**
- [x] 1.2 Configure `darkMode: ['selector', '[data-theme="dark"]']` for `dark:` variant support — **Tailwind 4: `@custom-variant dark`**
- [x] 1.3 Extend spacing scale with `--gap-*` tokens (xs, sm, md, lg, xl, 2xl)
- [x] 1.4 Extend `fontFamily` with display, body, mono stacks from tokens.css
- [x] 1.5 Verify `npm run dev` starts without Tailwind config warnings

## 2. Shared Components

- [x] 2.1 Build Button component with `primary`, `secondary`, `outline` variants, `as` prop for Link/button polymorphism, `icon` prop, and `size` prop (sm/md/lg)
- [x] 2.2 Build Card component with `hover` variant, `padding` prop (sm/md/lg), and optional header/footer slots
- [x] 2.3 Build Section component with `heading`, `lead` props for header block, `background` prop (default/surface/alt), and `width` prop (default/narrow/wide)
- [x] 2.4 Build SEOHead component rendering `<title>`, `<meta description>`, `<meta og:*>`, and `<link canonical>` tags (use `react-helmet-async` or `document.title` approach)
- [x] 2.5 Write unit tests for Button (renders all variants, as Link, click handler fires)
- [x] 2.6 Write unit tests for Card (renders content, hover class applied, padding variants)
- [x] 2.7 Write unit tests for Section (renders heading/lead, background class, width class)
- [x] 2.8 Write unit tests for SEOHead (title format, meta tags present, og tags present)
- [x] 2.9 Run `npm run test` — all component tests pass

## 3. Barrel Exports

- [x] 3.1 Create `src/components/index.js` exporting Button, Card, Section, SEOHead
- [x] 3.2 Create `src/pages/index.js` exporting all 15 page components
- [x] 3.3 Update `App.jsx` lazy imports to use `../pages` barrel (optional — keep if cleaner)

## 4. Route Structure — /os Prefix

- [x] 4.1 Set `base: '/os/'` in `vite.config.js`
- [x] 4.2 Update `index.html` asset paths if needed for base change
- [x] 4.3 Verify `npm run dev` serves at `localhost:5173/os/`
- [x] 4.4 Verify all Navbar links work with new base (NavLink `to` props should be relative)
- [x] 4.5 Verify Footer links work with new base
- [x] 4.6 Add SPA fallback redirect (`_redirects` for Netlify or equivalent) for `/os/*` → `/os/index.html`

## 5. Test Infrastructure

- [x] 5.1 Add dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [x] 5.2 Create `vitest.config.js` with jsdom environment and React plugin
- [x] 5.3 Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
- [x] 5.4 Run `npm run test` — verifies test infrastructure works (even if no tests yet)

## 6. Page Migration — Main Marketing Pages

- [x] 6.1 Port Home page (`home.html` → `Home.jsx`): hero, dashboard mockup, trust section, modules preview, CTA sections
- [x] 6.2 Port Product Overview page (`product-overview.html` → `ProductOverview.jsx`): 8 modules, onboarding steps
- [x] 6.3 Port Features page (`features.html` → `Features.jsx`): feature breakdown with cards
- [x] 6.4 Port Feature Showcase page (`feature-showcase.html` → `FeatureShowcase.jsx`): before/after transformations
- [x] 6.5 Port Pricing page (`pricing.html` → `Pricing.jsx`): 3 plan cards, feature lists, CTA

## 7. Page Migration — Positioning Pages

- [x] 7.1 Port Problem Solutions page (`problem-solutions.html` → `ProblemSolutions.jsx`): 6 operational challenges
- [x] 7.2 Port Why OptiFlow page (`why-optiflow.html` → `WhyOptiFlow.jsx`): comparison vs alternatives
- [x] 7.3 Port Competitive Positioning page (`competitive-positioning.html` → `CompetitivePositioning.jsx`): feature comparison table

## 8. Page Migration — Conversion Pages

- [x] 8.1 Port Contact page (`contact.html` → `Contact.jsx`): form with name, email, phone, company, message fields
- [x] 8.2 Port Demo Booking page (`demo-booking.html` → `DemoBooking.jsx`): booking form with date/time
- [x] 8.3 Port Newsletter page (`newsletter.html` → `Newsletter.jsx`): signup form and past issues

## 9. Page Migration — Info & Error Pages

- [x] 9.1 Port FAQ page (`faq.html` → `FAQ.jsx`): questions grouped by category
- [x] 9.2 Port About page (create `About.jsx` if not exists — new page from site.json nav)
- [x] 9.3 Port Privacy Policy page (`privacy-policy.html` → `PrivacyPolicy.jsx`): legal text
- [x] 9.4 Port Terms page (`terms.html` → `Terms.jsx`): legal text
- [x] 9.5 Port 404 page (`404.html` → `NotFound.jsx`): improved error page
- [x] 9.6 Port 500 page (create `ServerError.jsx` from `500.html`)

## 10. Integration & Polish

- [x] 10.1 Add `<SEOHead>` to every page with unique title and description
- [x] 10.2 Verify dark mode toggle works on all pages (no broken colors)
- [x] 10.3 Verify mobile drawer navigation works on all routes
- [x] 10.4 Verify Layout component (scroll-to-top, skip-link, Navbar, Outlet, Footer) renders correctly on all routes

## 11. Build & Validate

- [x] 11.1 Run `npm run build` in `frontend/` — verify zero errors
- [x] 11.2 Check bundle size: JS <200KB gzipped, CSS <50KB gzipped (78KB JS gzip, 4.6KB CSS gzip)
- [x] 11.3 Run `npm run lint` — verify zero errors (13 warnings, 0 errors)
- [x] 11.4 Run `npm run test` — verify all tests pass (27/27)
- [x] 11.5 Run `npm run preview` — verify production build serves correctly
- [x] 11.6 Verify static site build still passes (`npm run build` from root)
