# OptiFlow OS Website — Feature Inventory & Vertical Slice Roadmap

**Version:** 1.0.0  
**Date:** 2026-07-09  
**Status:** Single Source of Truth for All Future Development

---

## Part A — Deep Codebase Analysis

### A.1 Current Architecture

| Aspect | Current State |
|--------|---------------|
| **Type** | Custom static site generator (16 HTML pages) |
| **Frontend** | Pure HTML/CSS/JS, no framework, no bundler |
| **Backend** | None (Cloudflare Workers API stub for form submission) |
| **Database** | None (all data is hardcoded in HTML) |
| **Build** | Custom Node.js ESM pipeline (`scripts/assemble.mjs`) |
| **CSS** | Single file (`assets/css/core.css`, 513 lines), Oklch color space, CSS custom properties |
| **JS** | Single file (`assets/js/core.js`, 356 lines), vanilla IIFE |
| **Deployment** | Docker (3-stage nginx+brotli), Nixpacks, Netlify, Cloudflare Pages |
| **Testing** | Playwright E2E + a11y, Lighthouse CI |
| **Linting** | stylelint, html-validate, eslint |
| **Total Pages** | 16 (home, features, feature-showcase, pricing, product-overview, problem-solutions, why-optiflow, competitive-positioning, demo-booking, contact, faq, newsletter, privacy-policy, terms, 404, 500) |
| **Partials** | 3 (nav, footer, analytics) |
| **Placeholders** | `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}`, `{{LOCATION}}`, `{{WHATSAPP}}`, `{{COMPANY}}` |
| **Analytics** | Plausible (privacy-first, cookieless) |
| **Forms** | 3 (demo-booking, contact, newsletter) — client-side JS + Netlify data attribute |

### A.2 Assets & Media

| Resource | Path | Details |
|----------|------|---------|
| Logo | `assets/img/OptiFlow.Logo.png` | Single PNG, no multi-size variants |
| CSS | `assets/css/core.css` | 513 lines, all styles in one file |
| JavaScript | `assets/js/core.js` | 356 lines, all JS in one file |
| Favicon | Same logo PNG | No dedicated ico/svg favicon |
| SVGs | Inline in HTML | Charts, icons, social media — all embedded |
| Fonts | System font stack | No external fonts loaded |

### A.3 Design System (from core.css)

**Color Palette (Oklch):**
- Background: `oklch(97.5% 0.005 240)` — near-white
- Surface: `oklch(100% 0 0)` — pure white
- Foreground: `oklch(15% 0.02 250)` — dark navy
- Accent (Blue): `oklch(33% 0.09 255)` — `#1B4D81` equivalent
- Teal: `oklch(52% 0.10 210)` — `#278D9F` equivalent
- Green: `oklch(72% 0.12 145)` — `#54B89A` equivalent
- Lime: `oklch(82% 0.14 125)` — `#99D271` equivalent
- Dark theme overrides shift palette to dark background/light foreground

**Typography:** System font stack (SF Pro / Segoe UI) with clamp-based scale: h1 36-68px, h2 28-46px, h3 20px, body 16px.

**Spacing:** 8px base scale: xs(8px), sm(12px), md(20px), lg(32px), xl(56px), 2xl(96px).

**Components:** Navigation (topnav, hamburger, drawer), buttons (primary/secondary/glow/size variants), cards, FAQ accordion, comparison table, testimonials, sticky CTA, scroll-to-top, forms (submitting/success/error states), error pages, CTA section (gradient).

**Animations:** Scroll reveal (IntersectionObserver), counter (requestAnimationFrame), page transitions (CSS), staggered delays, reduced-motion support.

### A.4 JavaScript Architecture (core.js)

| Module | Function | Trigger |
|--------|----------|---------|
| Theme | `swapTheme()` | Click on `.theme-toggle` |
| Nav | scroll listener | `scrollY > 20` adds `.scrolled` |
| Drawer | `openDrawer()` / `closeDrawer()` | Hamburger click, overlay click, link click |
| Reveal | IntersectionObserver | `.reveal` elements |
| Stagger | Stagger delay calculation | `[class*="stagger-"]` parents |
| Counter | `countUp(el)` | IntersectionObserver on `[data-count]` |
| FAQ | Toggle accordion | `.faq-question` click |
| Sticky CTA | Scroll listener | Show/hide `.sticky-cta` |
| Scroll Top | Scroll listener | Show/hide `.scroll-top` |
| Form | `submitForm(form)` | Form submit events |
| Analytics | `trackEvent()` | CTA click, form success |
| UTM | `getUTMParams()` | Page load |
| Transitions | Page enter/exit | Internal link clicks |
| Keyboard | Escape key | Close drawer |

### A.5 Build Pipeline (assemble.mjs)

1. Clean `dist/`
2. Copy `assets/` to `dist/assets/`
3. For each page: inject partials, resolve nav active states, replace placeholders, inject SEO meta
4. Generate `sitemap.xml`, `robots.txt`, `manifest.json`
5. Inject JSON-LD structured data (Organization, BreadcrumbList, FAQPage, WebSite, Article)
6. Minify CSS and JS
7. Optimize images to WebP + AVIF via sharp

### A.6 Validation Pipeline (validate.mjs)

11 checks: broken links, hardcoded hex colors, dark mode coverage, SEO tags, description length, canonical/OG URLs, structured data, WCAG 2.2 AA contrast ratios, company data consistency, source contact hardcoding.

---

## Part B — Architecture Review & Gap Analysis

### B.1 Strengths

- Complete design system with CSS custom properties
- WCAG 2.2 AA compliant (contrast, skip-link, focus indicators, aria attributes)
- Dark/light theme support
- SEO foundation (OG tags, canonical URLs, structured data, sitemap, robots.txt)
- Privacy-first analytics (Plausible, cookieless)
- Performance-optimized (Brotli, WebP/AVIF, lazy loading, minification)
- Multi-platform deployment (5 targets)
- Comprehensive build/validation pipeline
- Production-grade nginx config (security headers, caching, CSP)
- All 16 pages fully implemented with consistent design language

### B.2 Critical Gaps

| Category | Gap | Impact |
|----------|-----|--------|
| Architecture | No component framework — all HTML hand-authored | Poor maintainability, copy-paste code |
| Architecture | Monolithic CSS (513 lines) — no module scoping | CSS collisions, hard to maintain |
| Architecture | Monolithic JS (356 lines) — no module system | Hard to test, hard to extend |
| Backend | No database — all content is hardcoded | Cannot update content without deployment |
| Backend | No API layer — form 503 on Docker | Broken forms in production |
| Backend | No CMS — content changes require code changes | Non-technical users cannot manage content |
| Features | No admin dashboard | Cannot manage leads, content, analytics |
| Features | No blog/article management | Newsletter page is static |
| Features | No lead management | Form submissions go to Netlify only |
| Features | No email automation | No SMTP, no campaign management |
| Features | No WhatsApp integration | WhatsApp float is hardcoded, no automation |
| Features | No chatbot | No rule-based chatbot |
| Features | No full-text search | FAQ search is browser-side only |
| Features | No payment integration | Pricing page is static, no gateway |
| Features | No testimonial management | Testimonials are hardcoded |
| Features | No career page | Not in the current site |
| Features | No download center | Resources section is static |
| Features | No cookie consent | GDPR/DPDP Act compliance missing |
| Features | No announcement banner | No site-wide notification system |
| Security | No authentication | All admin features would be public |
| Ops | No monitoring | No APM, error tracking |
| Ops | No logging | No structured logging system |

### B.3 Technical Debt Registry

| ID | Debt | Severity | Fix Complexity |
|----|------|----------|---------------|
| TD-01 | Duplicated inline `<style>` blocks on all 16 pages | High | Medium |
| TD-02 | Embedded JS copy-pasted (typewriter, sticky nav) | High | Medium |
| TD-03 | Monolithic CSS file — no module boundaries | High | High |
| TD-04 | No package/module system for JS | High | High |
| TD-05 | Hardcoded content across all 16 pages | Critical | Very High |
| TD-06 | Form submission broken on Docker (503 placeholder) | High | Medium |
| TD-07 | No error tracking/monitoring | Medium | Low |
| TD-08 | Images not optimized at source — only at build | Low | Low |
| TD-09 | Logo used as favicon — no dedicated favicon | Low | Low |
| TD-10 | No TypeScript — all JS is untyped | Medium | High |
| TD-11 | Custom build system — no standard tooling | Medium | Medium |
| TD-12 | Page-specific JS embedded in HTML — no testability | Medium | Medium |

---

## Part C — Component & Navigation Map

### C.1 Reusable Components (currently duplicated)

| Component | Occurs On | Current Status |
|-----------|-----------|---------------|
| Navigation Bar | All 16 pages | Partial (injected at build) |
| Footer | All 16 pages | Partial (injected at build) |
| CTA Section (gradient) | 11 pages | Copy-pasted inline |
| Hero Section | 16 pages | Copy-pasted with variations |
| Trust Bar (stats + logos) | 5 pages | Copy-pasted inline |
| FAQ Accordion | 4 pages | Copy-pasted inline |
| Comparison Table | 3 pages | Copy-pasted inline |
| Testimonial Card | 2 pages | Copy-pasted inline |
| Sticky CTA | 8 pages | Copy-pasted inline |
| Scroll-to-Top | 8 pages | Copy-pasted inline |
| Feature Card | 4 pages | Copy-pasted inline |
| Pricing Card | 1 page | Single implementation |
| Form (contact/demo/newsletter) | 3 pages | Copy-pasted |
| Timeline | 3 pages | Copy-pasted inline |
| Search Bar | 1 page (FAQ) | Single implementation |
| Calendar Widget | 1 page (demo-booking) | Single implementation |
| Reading Progress Bar | 2 pages | Copy-pasted inline |
| Cookie Consent | None | Missing |
| Announcement Banner | None | Missing |

### C.2 Navigation Flow

```
/os/  (Home)
  ├── /os/problem-solutions/
  ├── /os/product-overview/
  ├── /os/features/
  ├── /os/feature-showcase/
  ├── /os/why-optiflow/
  ├── /os/pricing/
  ├── /os/demo-booking/   ← primary CTA target
  ├── /os/contact/
  ├── /os/newsletter/     (Resources dropdown)
  ├── /os/faq/            (Resources dropdown)
  ├── /os/competitive-positioning/  (Resources dropdown)
  ├── /os/privacy-policy/ (footer only)
  ├── /os/terms/          (footer only)
  ├── /404.html
  └── /500.html
```

All pages link to `/os/demo-booking/` as primary conversion target. Secondary nav flows converge through footer links and in-page CTAs.

---

## Part D — Audits

### D.1 Responsive Audit

| Breakpoint | Status | Issues |
|------------|--------|--------|
| Desktop (>1024px) | Good | Architecture diagram not fully responsive |
| Tablet (768-1024px) | Adequate | Missing 3-col grid transitions |
| Mobile (<768px) | Fair | Hero text too long, comparison tables overflow, dashboard mockups not mobile-friendly |
| Small Mobile (<480px) | Needs Work | Trust bar logos overflow, architecture diagram unusable |

### D.2 SEO Audit

| Factor | Score | Notes |
|--------|-------|-------|
| Title tags | 100% | All pages have unique titles |
| Meta descriptions | 100% | All within 120-160 char range |
| Canonical URLs | 100% | Proper canonical on all pages |
| OpenGraph tags | 100% | OG + Twitter cards on all pages |
| Structured data | 90% | Organization + BreadcrumbList on all, FAQPage/WebSite/Article on relevant |
| Sitemap | 100% | All non-noindex pages included |
| Robots.txt | 100% | Properly configured |
| Heading hierarchy | 85% | Some pages skip heading levels |
| Image alt text | 70% | Many inline SVGs missing descriptive labels |

### D.3 Accessibility Audit

| Factor | Score | Notes |
|--------|-------|-------|
| Skip link | 100% | Present on all pages |
| Focus indicators | 100% | `:focus-visible` with 2px teal outline |
| Keyboard navigation | 90% | FAQ accordion, drawer all keyboard-accessible |
| ARIA attributes | 85% | Nav, drawer, theme-toggle, FAQ have aria attributes |
| Color contrast | 100% | WCAG 2.2 AA verified via build validator |
| Screen reader | 80% | Some inline SVGs missing descriptive labels |
| Reduced motion | 100% | `prefers-reduced-motion` respected |
| Form labels | 90% | All visible inputs have labels |
| Language | 100% | `lang="en"` on all pages |

### D.4 Performance Audit

| Factor | Status |
|--------|--------|
| CSS (unminified) | ~12KB |
| CSS (minified) | ~8KB |
| JS (unminified) | ~8KB |
| JS (minified) | ~5KB |
| Total assets (no images) | ~13KB gzipped |
| Image optimization | WebP + AVIF at build |
| Caching | 1-year for assets, no-cache for HTML |
| Compression | Brotli level 6 (Docker), Gzip level 6 |
| Lighthouse target | Perf 80+, A11y 90+, Best Practices 80+, SEO 90+ |

---

## Part E — Migration Strategy

### E.1 Guiding Principles

1. **Preserve**: Brand colors, typography, layout, UX, navigation, animations
2. **Improve**: Code quality, responsiveness, accessibility, SEO, performance, maintainability
3. **Never redesign**: The current visual design IS the specification
4. **Vertical slice first**: Each feature is complete, independently deployable
5. **Progressive migration**: Static site functional until React app replaces it

### E.2 Target Architecture Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Framework | React | 19.x |
| Build Tool | Vite | 6.x |
| CSS Strategy | CSS Modules + core.css variables | — |
| State Management | React Context + custom hooks | — |
| Routing | React Router | 7.x |
| Backend Framework | Django | 5.x |
| API Framework | Django REST Framework | 3.x |
| Database | PostgreSQL | 16.x |
| Auth | JWT (Simple JWT) + Django sessions | — |
| Mail | SMTP (Resend/Brevo) | — |
| Payment | Razorpay (India-focused) | — |
| Search | PostgreSQL full-text search | — |
| Cache | Redis | 7.x |
| Task Queue | Celery | 5.x |
| Container Runtime | Docker + Docker Compose | — |
| Web/Proxy Server | Nginx | 1.27+ |
| App Servers | Vite dev server + Gunicorn/uWSGI | — |

### E.3 Architecture Diagram

```
Client:  React SPA (Vite) → Nginx
                              ├─ /        → React app (SPA)
                              ├─ /api/    → Django (Gunicorn)
                              ├─ /admin/  → Django Admin
                              ├─ /static/ → Django static files
                              ├─ /media/  → Django media uploads
                              
Backend: Django 5.x + DRF
         ├─ Apps: cms, blog, leads, forms, newsletter, analytics, seo, core
         ├─ Auth: JWT + Django sessions
         └─ API: REST endpoints (DRF)

Database: PostgreSQL 16
          ├─ All domain entity models
          └─ Django migrations managed

Cache/Queue: Redis 7 + Celery 5
             ├─ Session cache
             ├─ Celery task broker
              └─ Rate limiting storage

---

## Part F — 60 Vertical Slice Features

---

### Feature 01 — Project Architecture & Monorepo Setup

| Field | Detail |
|-------|--------|
| **Feature Number** | 01 |
| **Feature ID** | `F-ARCH-001` |
| **Feature Name** | Project Architecture & Monorepo Setup |
| **Objective** | Set up monorepo structure with React frontend, Django backend, shared config, and Docker dev environment |
| **Business Value** | Foundation for all features; ensures consistent development workflow |
| **Current Codebase Status** | Single-repo static HTML; no backend; no frontend framework |
| **Scope** | New |
| **Frontend Tasks** | Initialize Vite+React in `frontend/`; configure TypeScript; ESLint/Prettier matching existing config; create `.env` |
| **Backend Tasks** | Initialize Django project in `backend/`; create app skeletons (`cms`, `blog`, `leads`, `core`); configure settings; set up DRF |
| **Database Tasks** | Configure PostgreSQL; create initial migrations; `docker-compose` with PostgreSQL service |
| **API Tasks** | Create `/api/health/` endpoint; configure CORS for dev |
| **Validation Rules** | All services start without errors; health endpoint returns 200 |
| **Acceptance Criteria** | `docker compose up` starts React (port 5173), Django (8000), PostgreSQL (5432), Nginx (80); health endpoint <200ms |
| **Test Cases** | 1. Docker compose up all services 2. Frontend accessible 3. Health endpoint returns JSON 4. PostgreSQL accepts connections 5. Django admin accessible |
| **Dependencies** | None |
| **Risks** | Docker Desktop availability on team machines |
| **Estimated Complexity** | Medium (3-5 days) |

---

### Feature 02 — Design System Foundation

| Field | Detail |
|-------|--------|
| **Feature Number** | 02 |
| **Feature ID** | `F-DS-001` |
| **Feature Name** | Design System Foundation |
| **Objective** | Port CSS custom properties from core.css to React design token system with reusable base components |
| **Business Value** | Consistent UI across all features; prevents design drift |
| **Current Codebase Status** | 513-line `core.css` with CSS variables, typography, spacing, components |
| **Scope** | Migration + Enhancement |
| **Frontend Tasks** | Extract CSS variables to `design-tokens.css`; create `GlobalStyles`; port component classes to React: `Button`, `Card`, `Input`, `Container`, `Section`; port typography; port grid system; port animations and reduced-motion support |
| **Backend Tasks** | None |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | All colors use `var(--*)`; no hardcoded hex; all components pass TypeScript |
| **Acceptance Criteria** | Design system renders at 5 breakpoints; tokens match `core.css` values; dark mode toggle works; animations ported; reduced-motion support |
| **Test Cases** | 1. Visual comparison: Button vs original 2. Dark mode preserves colors 3. Typography scale matches 4. Spacing matches 5. Responsive grid matches 6. Focus indicators match 7. CSS variables accessible in React |
| **Dependencies** | F-ARCH-001 |
| **Risks** | Oklch color space rendering differences across browsers |
| **Estimated Complexity** | Medium (3-4 days) |

---

### Feature 03 — Shared Layout Components (Nav, Footer, Layout)

| Field | Detail |
|-------|--------|
| **Feature Number** | 03 |
| **Feature ID** | `F-LAY-001` |
| **Feature Name** | Shared Layout Components |
| **Objective** | Port navigation bar, mobile drawer, and footer to React with exact visual parity |
| **Business Value** | Single source of truth for navigation; eliminates copy-paste |
| **Current Codebase Status** | `nav.html` (39 lines) + `footer.html` (27 lines); injected at build via INCLUDE directives |
| **Scope** | Migration |
| **Frontend Tasks** | Create `Nav` (desktop links, dropdown, CTA, mobile hamburger+drawer); `Footer` (5-column grid, social icons, theme toggle); `PageLayout` (nav+main+footer); port scroll behavior, drawer open/close, theme toggle context, keyboard Escape, `ScrollTop`, `StickyCTA` |
| **Backend Tasks** | Create `SiteSetting` model for dynamic nav (future) |
| **Database Tasks** | `SiteSetting`: key, value, type fields |
| **API Tasks** | `GET /api/site-settings/` for dynamic nav data |
| **Validation Rules** | Nav in semantic `<nav>`; CTA matches site.json; footer matches site.json footer columns |
| **Acceptance Criteria** | Nav identical to original at all breakpoints; drawer opens/closes with same animation; scroll blur+border; Escape closes drawer; active page highlighted; theme toggle works in nav and footer; footer always at bottom |
| **Test Cases** | 1. Desktop nav renders 8 links + dropdown + CTA 2. Mobile hamburger opens drawer 3. Drawer close on link/overlay/Escape 4. Scroll adds `.scrolled` class 5. Theme toggle switches `data-theme` 6. Footer renders all columns 7. Social icons link correctly 8. Nav CTA to demo-booking |
| **Dependencies** | F-ARCH-001, F-DS-001 |
| **Risks** | CSS specificity conflicts during migration |
| **Estimated Complexity** | Medium (3-4 days) |

---

### Feature 04 — Routing & Page Shell

| Field | Detail |
|-------|--------|
| **Feature Number** | 04 |
| **Feature ID** | `F-ROUTE-001` |
| **Feature Name** | Routing & Page Shell |
| **Objective** | Set up React Router with all 16 routes, error pages, scroll restoration, and page transitions |
| **Business Value** | Client-side navigation with preserved UX; SEO-friendly routes |
| **Current Codebase Status** | Static HTML via nginx; internal-link page transitions via CSS animations |
| **Scope** | New |
| **Frontend Tasks** | Configure React Router with all 16 routes; create route config; scroll restoration on navigation; port page transitions; `Suspense` boundaries; route-level code splitting (`React.lazy`); breadcrumb component |
| **Backend Tasks** | None |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | All routes match current URLs; 404 catch-all returns 404; all routes have title + meta description |
| **Acceptance Criteria** | All 16 routes load; back/forward works; scroll resets on navigation; page transitions match original; 404 renders for unknown routes; breadcrumbs reflect path; lazy loading splits code per route |
| **Test Cases** | 1. Navigate to each of 16 routes 2. URL matches 3. Browser back/forward 4. Scroll to top on route change 5. 404 for /nonexistent 6. Transition animation 7. Breadcrumb depth matches path |
| **Dependencies** | F-ARCH-001, F-LAY-001 |
| **Risks** | BrowserRouter vs HashRouter for static deployment |
| **Estimated Complexity** | Medium (2-3 days) |

---

### Feature 05 — Home Page Migration

| Field | Detail |
|-------|--------|
| **Feature Number** | 05 |
| **Feature ID** | `F-MIG-HOME-001` |
| **Feature Name** | Home Page Migration to React |
| **Objective** | Migrate `home.html` (677 lines, 13 sections) to React with exact visual parity |
| **Business Value** | Most-visited page; establishes migration pattern; conversion optimization |
| **Current Codebase Status** | 13 sections: hero (typewriter, mouse glow, dashboard parallax), trust bar, 6 problem cards, cost of inaction (card tilt), solution flow, 8 module cards, how it works, 8 feature cards, 7 industry cards, comparison table, 3 testimonials, CTA section, 5 FAQ items |
| **Scope** | Migration |
| **Frontend Tasks** | Create Home page + section components: `HeroSection`, `TrustBar`, `ProblemSection`, `CostOfInaction`, `SolutionFlow`, `ProductSnapshot`, `HowItWorks`, `FeatureSection`, `IndustrySection`, `WhyOptiflowComparison`, `TestimonialSection`, `CTASection`, `FAQPreview`; port all JS to hooks: `useTypewriter`, `useMouseGlow`, `useCardTilt`, `useParallax`; port `WhatsAppFloat`, `ExitOverlay` |
| **Backend Tasks** | None (static for migration phase) |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | All sections match pixel-for-pixel at 5 breakpoints; animations identical timing/easing |
| **Acceptance Criteria** | Side-by-side comparison shows no visual differences; typewriter cycles 5 phrases; mouse glow follows cursor; dashboard responds to mouse; card tilt 3D works; exit overlay on mouse-leaving; WhatsApp float clickable; all CTAs to demo-booking |
| **Test Cases** | 1. Visual regression vs original 2. Typewriter cycles 5 phrases 3. Mouse glow updates position 4. Card tilt transforms on hover 5. Scroll reveal animations fire 6. Counter animations count up 7. FAQ accordion opens/closes 8. Mobile layout matches |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001 |
| **Risks** | Complex animations hard to reproduce; SVG chart rendering differences |
| **Estimated Complexity** | High (7-10 days) |

---

### Feature 06 — Features Page Migration

| Field | Detail |
|-------|--------|
| **Feature Number** | 06 |
| **Feature ID** | `F-MIG-FEAT-001` |
| **Feature Name** | Features Page Migration to React |
| **Objective** | Migrate `features.html` (626 lines): 11 feature deep-dives with sticky sub-navigation and dashboard previews |
| **Business Value** | Key product detail page; establishes pattern for long-form content |
| **Current Codebase Status** | Hero with ecosystem hub; 11 feature sections (Tasks, Checklists, Delegation, Worklists, Attendance, Leave, SOPs, Training, Helpdesk, Reports, Notifications, Mobile), each with dashboard preview; sticky nav with IntersectionObserver |
| **Scope** | Migration |
| **Frontend Tasks** | Create Features page; `FeatureSection` (2-col: content + dashboard preview); `FeatureNav` (sticky bar with IntersectionObserver); `EcosystemHub` (center + 8 orbiting modules); `DashboardPreview` (configurable data); `PhoneFrame`; port scroll-spy to React hook; click-to-scroll tabs |
| **Backend Tasks** | None |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | All 11 sections rendered; nav tabs highlight correctly on scroll; tab click scrolls to section |
| **Acceptance Criteria** | All 11 feature sections present; sticky nav correct active tab; tab-click scrolls; ecosystem hub 8 modules; dashboard previews correct data; mobile single-column |
| **Test Cases** | 1. All 11 sections render 2. Active tab updates on scroll 3. Click tab scrolls correctly 4. Dashboard preview data matches 5. Phone frame on mobile |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001 |
| **Risks** | IntersectionObserver in React vs vanilla JS; SVG architecture complexity |
| **Estimated Complexity** | High (5-7 days) |

---

### Feature 07 — Pricing Page Migration

| Field | Detail |
|-------|--------|
| **Feature Number** | 07 |
| **Feature ID** | `F-MIG-PRICING-001` |
| **Feature Name** | Pricing Page Migration to React |
| **Objective** | Migrate `pricing.html` (1043 lines): largest page with ROI calculator, pricing cards, comparison matrix |
| **Business Value** | Revenue-critical page; ROI calculator is primary conversion tool |
| **Current Codebase Status** | Hero with ROI dashboard (bar chart, tooltips, connector lines, savings badges); 3 pricing cards; feature comparison matrix; interactive ROI calculator (sliders: team 5-200, cost ₹199-5000); 5-step timeline; 7 FAQ items |
| **Scope** | Migration |
| **Frontend Tasks** | Create Pricing page; `ROIDashboard` (bar chart, tooltips, connector lines, animated badges); `PricingCard` (featured/standard); `ComparisonMatrix` (checkmarks); `ROICalculator` (2 sliders, real-time); `ImplementationTimeline` (5 steps); `PricingFAQ`; port calculator math to React hooks |
| **Backend Tasks** | None |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | Calculator: Traditional = teamSize * perUserCost * 12, OptiFlow = planPrice + setupFee; plan thresholds match |
| **Acceptance Criteria** | ROI bar chart proportional; tooltips on hover; savings badges animate with correct values; 3 pricing cards correct; plan selection works; calculator updates real-time; comparison matrix correct checkmarks; timeline all 5 steps |
| **Test Cases** | 1. ROI chart bar proportions 2. Hover tooltips correct 3. Team slider 5→200 plan changes Starter→Growth→Scale 4. Per-user cost ₹199→₹5000 savings increase 5. Savings never negative 6. "Most Popular" badge on Growth 7. Feature matrix marks 8. FAQ accordion |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001 |
| **Risks** | Complex calculator math edge cases; chart precision; tooltip at boundaries |
| **Estimated Complexity** | High (5-7 days) |

---

### Feature 08 — Product Overview Page Migration

| Field | Detail |
|-------|--------|
| **Feature Number** | 08 |
| **Feature ID** | `F-MIG-PROD-001` |
| **Feature Name** | Product Overview Page Migration |
| **Objective** | Migrate `product-overview.html` (973 lines): interactive demo tabs, architecture diagram, admin/captain/doer panels, workflow engine |
| **Business Value** | Primary product education page; architecture diagram is key technical differentiator |
| **Current Codebase Status** | 4 demo tabs, transformation flow, 6 vision cards, SVG architecture diagram (12 nodes + tooltips), 12 module cards (6 expandable), Admin/Captain/Doer panels, 5-step workflow, 6 report cards, permissions matrix, 3 security cards |
| **Scope** | Migration |
| **Frontend Tasks** | Create Product Overview page; `DemoTabs` (4 tabs with live data); `TransformationFlow`; `VisionCard`; `ArchitectureDiagram` (12 SVG nodes + tooltips); `ModuleSpotlight` (expandable 6+6 grid); `PanelLayout` (features + dashboard, alternating); `WorkflowEngine` (5-step); `PermissionsMatrix` (checkmarks); `ReportingEngine` (4 KPIs + 6 cards) |
| **Backend Tasks** | None |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | All 12 architecture nodes have tooltips; tab switching preserves state; expand/collapse shows all 12 |
| **Acceptance Criteria** | Demo tabs switch content; architecture diagram 12 nodes + connectors; tooltips on hover; modules expand/collapse 6↔12; panels alternate layout; workflow 5 connected steps; permissions matrix correct |
| **Test Cases** | 1. All 4 demo tabs switch content 2. Hover 12 nodes → tooltips 3. "Show all 12" → 12 visible 4. "Show less" → 6 5. Panel alternates (rtl on Captain) 6. Permission matrix checkmarks 7. Workflow count 5 |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001 |
| **Risks** | SVG 12 nodes + connectors complexity; tooltip at viewport edges |
| **Estimated Complexity** | High (7-9 days) |

---

### Feature 09 — Problem Solutions & Why Optiflow Pages

| Field | Detail |
|-------|--------|
| **Feature Number** | 09 |
| **Feature ID** | `F-MIG-PS-WHY-001` |
| **Feature Name** | Problem Solutions & Why Optiflow Pages Migration |
| **Objective** | Migrate `problem-solutions.html` (607 lines) and `why-optiflow.html` (637 lines) |
| **Business Value** | Conviction pages for problem-awareness and solution-awareness buyer stages |
| **Current Codebase Status** | Problem-solutions: pain carousel, chaos map, 6 industry problem cards, WhatsApp mockup, People vs Process, Before/After. Why-Optiflow: typewriter, 6 problem cards, 3 designer cards, 4-step timeline, 8 ROI stats, comparison table, 3 testimonials, trust elements |
| **Scope** | Migration |
| **Frontend Tasks** | Create both pages with all sections; `PainPointCarousel` (auto-rotating 3s); `ChaosMap` (6 sources→chaos→solution); `WhatsAppChatMockup` (7 messages); `PeopleVsProcess`; `BeforeAfterCompare`; `ROIStatsGrid` (8 cards with counters); `ComparisonTable` (5-col, 11-row); `TrustElementCard`; port typewriter and mouse glow hooks |
| **Backend Tasks** | None |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | Carousel cycles 8 items; typewriter cycles 5 phrases; comparison table 5 cols, 11 rows |
| **Acceptance Criteria** | Problem Solutions: All 10 sections; pain points auto-rotate 3s; WhatsApp 7 messages; People vs Process 7 rows; Before/After 7 rows. Why Optiflow: All 10 sections; typewriter cycles; mouse glow; ROI stats count up; comparison table checkmarks/crosses |
| **Test Cases** | 1. Carousel auto-rotates 2. Typewriter all phrases 3. Mouse glow tracks cursor 4. Counter animations finish 5. Comparison all rows 6. Tabs pause on blur |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001 |
| **Risks** | Carousel interval management in React; typewriter timing |
| **Estimated Complexity** | Medium-High (4-6 days) |

---

### Feature 10 — Feature Showcase & Competitive Positioning Migration

| Field | Detail |
|-------|--------|
| **Feature Number** | 10 |
| **Feature ID** | `F-MIG-FSCP-001` |
| **Feature Name** | Feature Showcase & Competitive Positioning Migration |
| **Objective** | Migrate `feature-showcase.html` (535 lines) and `competitive-positioning.html` (391 lines) |
| **Business Value** | Differentiation pages for consideration-stage buyers |
| **Current Codebase Status** | Showcase: 6 before/after transformations with problem-cost-solution-metrics, dual device previews. Competitive: 2x2 quadrant grid, 13-row feature matrix, 4 cost cards, standout cards |
| **Scope** | Migration |
| **Frontend Tasks** | Create both pages; `ShowcaseTransform` (problem→solution→metrics→visual); `ShowcaseMetrics` (3 stats); `QuadrantGrid` (2x2 + center); `FeatureMatrix` (4-col, 13-row scrollable); `CostComparison` (4 cards with best-value); `StandoutCard` |
| **Backend Tasks** | None |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | Each showcase: cost + 2 solutions + 3 metrics; quadrant has center + 4; matrix 13 rows |
| **Acceptance Criteria** | Showcase: 6 transformations each with cost/2 solutions/3 metrics; sticky nav. Competitive: 2x2 quadrant renders; matrix indicators (check/cross/Limited/Manual); cost comparison shows 4 cards with OptiFlow as best value |
| **Test Cases** | 1. 6 transformations 2. Cost pills in each 3. 3 metrics per transformation 4. Quadrant layout 5. 13 matrix rows 6. Cost ordering 7. Best value badge |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001 |
| **Risks** | Matrix horizontal overflow on mobile; quadrant responsiveness |
| **Estimated Complexity** | Medium (3-5 days) |

---

### Feature 11 — Demo Booking Page Migration

| Field | Detail |
|-------|--------|
| **Feature Number** | 11 |
| **Feature ID** | `F-MIG-DEMO-001` |
| **Feature Name** | Demo Booking Page Migration |
| **Objective** | Migrate `demo-booking.html` (614 lines): form, calendar widget, timeline, benefit cards |
| **Business Value** | Primary conversion page; calendar widget is highest-value interaction |
| **Current Codebase Status** | Hero with dashboard, 6 benefit cards, 4 trust stats, 6-step timeline, 6 benefit cards, booking form (7 fields + honeypot), calendar widget (month nav, day grid, time slots, confirm), 8 FAQ items |
| **Scope** | Migration + API integration |
| **Frontend Tasks** | Create DemoBooking page; `BookingForm` (7 fields + honeypot); `CalendarWidget` (month nav, day grid, time slots, selection, confirm); `BenefitCard`; `TimelineSteps`; `DashboardMockup` (reusable); port form validation; port calendar logic; time slot availability (weekdays 9-7, weekends 4 slots) |
| **Backend Tasks** | Create `DemoBooking` model; `POST /api/demo-bookings/`; email notification on booking |
| **Database Tasks** | `DemoBooking`: name, company_name, mobile, email, team_size, industry, challenges, preferred_date, preferred_time_slot, status (PENDING/CONFIRMED/COMPLETED/CANCELLED), timestamps |
| **API Tasks** | `POST /api/demo-bookings/` (validate, save, send email); `GET /api/demo-bookings/slots/?date=` (available slots) |
| **Validation Rules** | Name: required 3-100 chars; Company: required 2+; Mobile: valid Indian (10 digits, 6-9 start); Email: valid format; Team Size: valid option; Industry: valid option; Date: weekday, >= tomorrow; Time: available, within hours |
| **Acceptance Criteria** | Form 7 fields; field-level errors on invalid submit; calendar current month + day grid; click date shows available slots; click slot selects it; confirm activates when date+slot selected; submitting→success state; email sent to customer+admin; booking saved to DB |
| **Test Cases** | 1. Empty submit → required errors 2. Invalid mobile → error 3. Invalid email → error 4. Past date → not allowed 5. Sunday → no slots 6. Tomorrow weekday → slots shown 7. Select slot → confirm activates 8. Valid submit → API called, success shown 9. Already-booked slot → unavailable 10. Email integration test |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001, F-ARCH-001 |
| **Risks** | Calendar timezone handling; concurrent slot booking race condition |
| **Estimated Complexity** | High (6-8 days) |

---

### Feature 12 — Contact Page Migration

| Field | Detail |
|-------|--------|
| **Feature Number** | 12 |
| **Feature ID** | `F-MIG-CONTACT-001` |
| **Feature Name** | Contact Page Migration |
| **Objective** | Migrate `contact.html` (623 lines): contact form, sales/support channels, office info, response promises |
| **Business Value** | Key inbound lead generation page |
| **Current Codebase Status** | Hero with chat SVG, contact form (7 fields + honeypot), 3 sales channels, 3 support channels, office info card, 4 response promises, 4 trust stats, 7 FAQ items |
| **Scope** | Migration + API integration |
| **Frontend Tasks** | Create Contact page; `ContactForm` (7 fields + honeypot); `ChannelCard` (sales/support); `OfficeInfo`; `ResponsePromiseCard`; port form validation with regex; form states (submitting/success/error) |
| **Backend Tasks** | Create `Enquiry` model; `POST /api/enquiries/`; email notification |
| **Database Tasks** | `Enquiry`: name, company, phone, email, team_size, industry, challenges, type (SALES/SUPPORT/PARTNERSHIP), status (NEW/REPLIED/RESOLVED), timestamps |
| **API Tasks** | `POST /api/enquiries/` (validate, save, notify); `GET /api/enquiries/` (list, admin) |
| **Validation Rules** | Name: required 3+; Company: required; Phone: valid Indian mobile; Email: valid; Honeypot: must be empty; Type: must be valid |
| **Acceptance Criteria** | Form validates all fields; submit to API; success "expect response in 24 hours"; sales channels correct phone/email/WhatsApp; office info card address+hours; response promises correct timeframes |
| **Test Cases** | 1. Valid submit → 201 2. Missing name → 400 3. Invalid phone → 400 4. Honeypot filled → silent rejection 5. Email notification sent 6. Visual comparison with original |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001, F-ARCH-001 |
| **Risks** | Spam submissions; rate limiting needed |
| **Estimated Complexity** | Medium (3-5 days) |

---

### Feature 13 — FAQ Page Migration & FAQ System

| Field | Detail |
|-------|--------|
| **Feature Number** | 13 |
| **Feature ID** | `F-MIG-FAQ-001` |
| **Feature Name** | FAQ Page Migration & FAQ System |
| **Objective** | Migrate `faq.html` (658 lines): search, 42 FAQ items, troubleshooting wizard, escalation channels |
| **Business Value** | Self-service support reduces inbound queries; SEO-rich content hub |
| **Current Codebase Status** | Search with 6 suggestion chips, 4 help cards, 4 categories (42 total: Product 12, Pricing 10, Security 10, Implementation 10), micro-CTAs, 3-tier troubleshooting wizard (5 categories, 15 paths), escalation cards, feedback with localStorage |
| **Scope** | Migration + dynamic content |
| **Frontend Tasks** | Create FAQ page; `FAQSearch` (highlight matching terms); `FAQCategoryTabs` (All/Product/Pricing/Security/Implementation); `FAQAccordion` (shared component); `HelpCard`; `TroubleshootingWizard` (3 cascading selects + resolution tree); `EscalationCard`; `FAQFeedback` (thumbs + localStorage); port search highlighting, category filtering, related questions |
| **Backend Tasks** | Create `FAQItem`, `FAQCategory`, `FAQFeedback` models; seed 42 FAQs from original content |
| **Database Tasks** | `FAQCategory`: name, slug, order, is_active; `FAQItem`: question, answer, category (FK), order, is_active, timestamps; `FAQFeedback`: faq_item (FK), was_helpful, created_at |
| **API Tasks** | `GET /api/faq/` (grouped by category); `GET /api/faq/?search=` (search); `POST /api/faq/feedback/` (record vote) |
| **Validation Rules** | Question: required max 500; Answer: required max 5000; Category: valid; Search: sanitized <150 chars |
| **Acceptance Criteria** | 42 FAQs seeded from original; tabs filter correctly; search highlights matches; troubleshooting resolves 15 paths; feedback persists; category counts display |
| **Test Cases** | 1. Search "pricing" → pricing FAQs with highlights 2. "Pricing" tab → 10 pricing FAQs 3. "All" tab → all 42 4. Troubleshooting: Login→Forgot Password→reset instructions 5. Submit helpful feedback → count updates 6. All 42 match original content |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001, F-ARCH-001 |
| **Risks** | Search performance with large FAQ pool; troubleshooting data tree maintenance |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 14 — Newsletter Page & Blog System

| Field | Detail |
|-------|--------|
| **Feature Number** | 14 |
| **Feature ID** | `F-MIG-NEWS-001` |
| **Feature Name** | Newsletter Page & Blog System |
| **Objective** | Migrate newsletter page and build full blog/article management system |
| **Business Value** | Content marketing engine; SEO traffic generator; email list building |
| **Current Codebase Status** | `newsletter.html` (645 lines): Hero with floating cards, featured article, 6 category cards, filterable article grid, ranked popular list, signup form, 6 resource cards. All content static/hardcoded |
| **Scope** | Migration + new feature |
| **Frontend Tasks** | Create Newsletter/Blog page; `FeaturedArticle`; `ArticleCard` (category tag, read time, date); `CategoryFilterBar` (dynamic from API); `PopularArticles` (ranked list from API); `NewsletterSignup` (email + honeypot); `ResourceCard`; `ArticleDetail` page (new route `/os/newsletter/:slug/`) with progress bar; empty state for no-filter matches |
| **Backend Tasks** | Create `Article`, `ArticleCategory`, `Resource`, `NewsletterSubscriber` models; SEO slug generation; sitemap integration for articles |
| **Database Tasks** | `ArticleCategory`: name, slug, description, order; `Article`: title, slug, excerpt, content (rich text), category (FK), author, read_time, featured_image, is_published, published_at, view_count, timestamps; `Resource`: title, description, file_type, file_url, category, is_active, download_count; `NewsletterSubscriber`: email, is_active, timestamps, source |
| **API Tasks** | `GET /api/articles/` (paginated, filter by category); `GET /api/articles/:slug/` (detail); `GET /api/articles/popular/` (by views); `GET /api/resources/`; `POST /api/newsletter/subscribe/`; `POST /api/newsletter/unsubscribe/` |
| **Validation Rules** | Title: required max 200 unique; Slug: auto-gen unique max 200; Content: required, HTML sanitized; Email: valid, unique for subscription; Category: valid; Published: requires published_at |
| **Acceptance Criteria** | Blog loads from API; category filters dynamic; article detail with progress bar; signup stores email with source; popular sorted by views; empty state when no matches; pagination works; SEO meta per article |
| **Test Cases** | 1. GET /api/articles/ paginated 2. Filter by category correct 3. GET article slug returns full 4. View count increments 5. Subscribe valid → 201 6. Duplicate → 409 7. Invalid email → 400 8. Popular endpoint sorted 9. Empty filter message 10. Article OG tags dynamic |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001, F-ARCH-001 |
| **Risks** | Rich text XSS; image upload management; SEO dynamic meta generation |
| **Estimated Complexity** | High (7-9 days) |

---

### Feature 15 — Legal Pages Migration & CMS Page System

| Field | Detail |
|-------|--------|
| **Feature Number** | 15 |
| **Feature ID** | `F-MIG-LEGAL-001` |
| **Feature Name** | Legal Pages Migration & CMS Page System |
| **Objective** | Migrate privacy-policy and terms pages, build reusable CMS page management system |
| **Business Value** | Compliance pages; reusable CMS for any future static content pages |
| **Current Codebase Status** | `privacy-policy.html` (496 lines) + `terms.html` (545 lines): Reading progress bar, sticky side nav, content cards, info blocks, data flow diagrams. Both have identical layout pattern |
| **Scope** | Migration + new feature |
| **Frontend Tasks** | Create reusable `LegalPageTemplate` (progress bar, side nav, content sections, contact cards); PrivacyPolicy page; TermsAndConditions page; `ContentSection` (info blocks, data flow, grids, commitment badge, contact card); port reading progress bar; port side nav IntersectionObserver; `CMSPage` component for generic CMS pages (route: `/os/page/:slug/`) |
| **Backend Tasks** | Create `CMSPage`, `CMSSection`, `SiteSetting` models |
| **Database Tasks** | `CMSPage`: title, slug, description, is_published, timestamps; `CMSSection`: page (FK), section_type (HERO/INFO_BLOCK/DATA_FLOW/GRID/CONTACT/TEXT/SECURITY/CUSTOM), title, content (JSON), display_order; `SiteSetting`: key, value, type (STRING/JSON/MARKDOWN/HTML), description |
| **API Tasks** | `GET /api/cms/:slug/` (page with sections); `GET /api/cms/pages/` (list published); `GET /api/site-settings/` (all settings) |
| **Validation Rules** | Page title: required max 200; Slug: auto-gen unique max 200; Section content: valid JSON per type; Published: all mandatory sections |
| **Acceptance Criteria** | Privacy policy renders all sections identical to original; terms renders identical; progress bar updates on scroll; side nav highlights current section; CMS pages at `/os/page/:slug/`; site settings via API; admin CRUD for CMS pages |
| **Test Cases** | 1. Privacy policy visual comparison 2. Terms visual comparison 3. Progress bar 100% at bottom 4. Side nav highlights on scroll 5. Create CMS page via admin → at URL 6. Update setting → API returns updated |
| **Dependencies** | F-DS-001, F-LAY-001, F-ROUTE-001, F-ARCH-001 |
| **Risks** | Complex nested JSON content; admin editor UX for CMS sections |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 16 — Dynamic Navigation from API

| Field | Detail |
|-------|--------|
| **Feature Number** | 16 |
| **Feature ID** | `F-DYN-NAV-001` |
| **Feature Name** | Dynamic Navigation from API |
| **Objective** | Load nav links, dropdowns, and CTA config from backend API instead of hardcoded site.json |
| **Business Value** | Non-technical admin can restructure navigation without code deployment |
| **Current Codebase Status** | Navigation in `site.json` under `nav.links`, `nav.dropdown`, `nav.cta`; injected at build time |
| **Scope** | Enhancement |
| **Frontend Tasks** | Update Nav to fetch from `GET /api/site-settings/nav/`; loading skeleton while fetching; cache in React context; fallback to default if API unavailable |
| **Backend Tasks** | Create `NavItem` model; API for nav config; admin interface for managing nav |
| **Database Tasks** | `NavItem`: label, href, order, parent (self-FK for dropdown), is_active, is_cta, cta_class, timestamps |
| **API Tasks** | `GET /api/nav/` (structured tree); `PUT /api/nav/` (update, admin) |
| **Validation Rules** | Label: required max 50; Href: required valid path; Order: unique within parent; Dropdown items: must have parent |
| **Acceptance Criteria** | Nav from API; admin changes reflect immediately; loading shows skeleton; API failure falls back to default; dropdown items under parent |
| **Test Cases** | 1. GET /api/nav/ correct structure 2. Add nav item via admin → appears 3. Reorder → frontend reflects 4. Set inactive → hidden 5. API down → default nav |
| **Dependencies** | F-LAY-001, F-ARCH-001 |
| **Risks** | Nav is above-the-fold critical; loading delay impacts perceived performance |
| **Estimated Complexity** | Medium (3-4 days) |

---

### Feature 17 — Hero Section with CMS Content

| Field | Detail |
|-------|--------|
| **Feature Number** | 17 |
| **Feature ID** | `F-CMS-HERO-001` |
| **Feature Name** | Hero Section with CMS Content |
| **Objective** | Make hero section content (headline, lead, CTAs, trust badges, typewriter phrases) dynamically configurable from CMS per page |
| **Business Value** | Marketing can update hero messaging without code changes |
| **Current Codebase Status** | Hero content on all 16 pages hardcoded in HTML; typewriter phrases embedded in JS |
| **Scope** | New feature |
| **Frontend Tasks** | Create `DynamicHero` component accepting content from props (API); support variants: with/without typewriter, dashboard mockup, trust badges, ecosystem hub; support 1-3 CTAs; support background types |
| **Backend Tasks** | Add hero fields to `CMSPage` or new `PageContent` model; extend page API to include hero data |
| **Database Tasks** | Extend `CMSPage` or new `PageContent`: page (FK), hero_headline, hero_lead, hero_eyebrow, hero_cta_primary_text/link, hero_cta_secondary_text/link, hero_variant, hero_bg_type, hero_badge_text, hero_show_trust |
| **API Tasks** | `GET /api/page-content/:slug/` (all page content including hero) |
| **Validation Rules** | Headline: required max 150; Lead: max 300; Variant: valid type |
| **Acceptance Criteria** | Home page hero from API; admin changes reflect without rebuild; typewriter phrases editable; hero variant switchable |
| **Test Cases** | 1. Edit headline in admin → frontend updates 2. Change variant → correct variant 3. Add/remove trust badges → reflects 4. Change CTA text/link → updates |
| **Dependencies** | F-MIG-LEGAL-001, F-DYN-NAV-001 |
| **Risks** | Hero above-the-fold — API must resolve before paint or use SSR |
| **Estimated Complexity** | Medium (4-5 days) |

---

### Feature 18 — Dynamic Testimonial System

| Field | Detail |
|-------|--------|
| **Feature Number** | 18 |
| **Feature ID** | `F-DYN-TEST-001` |
| **Feature Name** | Dynamic Testimonial System |
| **Objective** | Build testimonial management with admin CRUD, frontend carousel, schema.org Review structured data |
| **Business Value** | Real-time social proof updates; SEO benefit from Review structured data |
| **Current Codebase Status** | 3 testimonials hardcoded on home and why-optiflow; 4 stat badges hardcoded |
| **Scope** | New feature |
| **Frontend Tasks** | Create `TestimonialCard` (quote, author, role, company, avatar initial, stat); `TestimonialCarousel` (auto-rotate, dots); `TestimonialGrid` (3-col desktop, 1-col mobile); `TestimonialSection` with configurable count/layout; implement schema.org Review structured data |
| **Backend Tasks** | Create `Testimonial` model; admin CRUD view |
| **Database Tasks** | `Testimonial`: author_name, author_role, company_name, quote, avatar_initials, stat_value, stat_label, rating (1-5), is_featured, is_published, display_order, timestamps |
| **API Tasks** | `GET /api/testimonials/` (published, ordered); `GET /api/testimonials/featured/`; `POST/PUT/DELETE /api/testimonials/` (admin) |
| **Validation Rules** | Author: required max 100; Quote: required max 1000; Company: required max 100; Rating: 1-5 integer; Published: boolean default false |
| **Acceptance Criteria** | Testimonials from API; featured on home; carousel auto-rotates 5s; admin CRUD; publish toggle makes live; Review JSON-LD injected |
| **Test Cases** | 1. GET published returns all 2. Featured returns subset 3. Create in admin → appears 4. Delete → removed 5. Toggle featured → moves 6. Review structured data in source |
| **Dependencies** | F-ARCH-001 |
| **Risks** | Structured data validation errors → Google Search Console warnings |
| **Estimated Complexity** | Medium (3-4 days) |

---

### Feature 19 — Lead Management System

| Field | Detail |
|-------|--------|
| **Feature Number** | 19 |
| **Feature ID** | `F-LEAD-001` |
| **Feature Name** | Lead Management System |
| **Objective** | Centralize all leads (demo bookings, enquiries, newsletter signups) into unified lead management with pipeline tracking |
| **Business Value** | Single view of all prospects; prevents lead leakage; enables follow-up automation |
| **Current Codebase Status** | Demo bookings go to Netlify Forms (broken locally); contact same; no lead consolidation |
| **Scope** | New feature |
| **Frontend Tasks** | Admin components: `LeadList` (filterable/sortable table), `LeadDetail` (full view with timeline), `LeadKanban` (drag-drop pipeline stages) |
| **Backend Tasks** | Create unified `Lead` model; update DemoBooking, Enquiry, NewsletterSubscriber to create/update Lead records; lead pipeline API; status transition logic |
| **Database Tasks** | `Lead`: source (DEMO_BOOKING/CONTACT_FORM/NEWSLETTER/WHATSAPP/MANUAL), source_id, name, company, phone, email, team_size, industry, challenges, status (NEW/CONTACTED/QUALIFIED/DEMO_SCHEDULED/NEGOTIATING/WON/LOST), assigned_to, notes, last_contacted_at, timestamps; `LeadActivity`: lead (FK), activity_type, description, date, created_by |
| **API Tasks** | `GET /api/leads/` (filtered: status/source/date); `GET /api/leads/:id/` (detail + activities); `PUT /api/leads/:id/` (update status/notes); `POST /api/leads/:id/activities/` (add activity) |
| **Validation Rules** | Name required; Email or phone at least one; Status valid transition; Assigned_to valid admin |
| **Acceptance Criteria** | Demo booking creates NEW lead; contact form creates NEW lead; newsletter creates lead; filter by status/source/date; status updates with activity log; duplicate email detection warns; kanban board by pipeline stage |
| **Test Cases** | 1. Demo booking → lead created 2. Contact form → lead 3. Newsletter → lead 4. Mark CONTACTED → activity logged 5. Filter by source shows correct 6. Duplicate email → warning 7. Kanban drag moves stage 8. Invalid status transition → error |
| **Dependencies** | F-MIG-DEMO-001, F-MIG-CONTACT-001, F-MIG-NEWS-001, F-ARCH-001 |
| **Risks** | DPDP Act compliance — consent tracking needed; duplicate detection accuracy |
| **Estimated Complexity** | High (6-8 days) |

---

### Feature 20 — Admin Dashboard

| Field | Detail |
|-------|--------|
| **Feature Number** | 20 |
| **Feature ID** | `F-ADMIN-001` |
| **Feature Name** | Admin Dashboard |
| **Objective** | Build comprehensive admin dashboard with KPI widgets, charts, recent activity feed, quick-action buttons |
| **Business Value** | Single pane of glass for operations; reduces need for separate analytics |
| **Current Codebase Status** | No admin interface exists; Django admin available but this is custom React admin |
| **Scope** | New feature |
| **Frontend Tasks** | Create Admin Layout (sidebar nav, header with user menu, main area); `AdminDashboard` page; KPI widgets: total leads, conversion rate, upcoming demos, subscribers, recent enquiries, avg response time; charts: leads over time (line), leads by source (pie), inquiries by day (bar); `RecentActivityFeed`; `QuickAction` bar; role-based widget visibility |
| **Backend Tasks** | Dashboard aggregation API; activity logging middleware; data aggregation with caching |
| **Database Tasks** | Database views for dashboard queries; `AdminActivityLog`: admin_user, action, resource_type, resource_id, description, created_at |
| **API Tasks** | `GET /api/admin/dashboard/stats/` (aggregated KPIs); `GET /api/admin/dashboard/charts/` (chart data with date range); `GET /api/admin/activity/` (recent feed); time period filter (7d/30d/90d/1y) |
| **Validation Rules** | All dashboard endpoints auth-required; stats cached max 5 minutes |
| **Acceptance Criteria** | Dashboard KPI cards with live data; charts with interactive tooltips; date range filter updates all widgets; activity feed last 50 actions; quick actions link to create pages; responsive on tablet; no N+1 queries |
| **Test Cases** | 1. Load → all KPIs populated 2. Change date range → widgets update 3. Create lead → KPI increments 4. No N+1 queries (Django debug toolbar) 5. Activity feed shows new record 6. Unauthenticated → 401 |
| **Dependencies** | F-LEAD-001, F-ARCH-001 |
| **Risks** | Complex aggregation query performance; chart library selection |
| **Estimated Complexity** | High (7-9 days) |

---

### Feature 21 — CMS: Blog Editor

| Field | Detail |
|-------|--------|
| **Feature Number** | 21 |
| **Feature ID** | `F-CMS-BLOG-001` |
| **Feature Name** | CMS: Blog Editor |
| **Objective** | Build rich text blog editor with image upload, SEO preview, scheduling, and versioning |
| **Business Value** | Content team creates and publishes articles without developer involvement |
| **Current Codebase Status** | Blog articles are hardcoded in `newsletter.html`; no editing interface |
| **Scope** | New feature |
| **Frontend Tasks** | Create `ArticleEditor` (rich text with TipTap/Slate, title/description/excerpt fields, category selector, featured image upload with drag-drop, SEO preview panel showing OG tags, publish/schedule controls, preview mode); `ArticleList` (admin view with search, status filter, batch actions); image upload component with preview and alt text |
| **Backend Tasks** | Update Article model for rich text (HTML sanitized); image upload endpoint; article versioning; scheduling with Celery task |
| **Database Tasks** | `ArticleImage`: article (FK), image, alt_text, is_featured, order; `ArticleVersion`: article (FK), title, content, excerpt, saved_at, saved_by; Update Article: add meta_keywords, meta_canonical, noindex fields |
| **API Tasks** | `POST /api/articles/` (create); `PUT /api/articles/:id/` (update); `POST /api/admin/images/upload/` (upload returns URL); `GET /api/articles/:id/versions/` (history); `POST /api/articles/:id/revert/:version_id/` (revert) |
| **Validation Rules** | Content: HTML sanitized (p, h2-h4, ul, ol, li, a, strong, em, img, blockquote, code); Images: max 5MB, jpg/png/webp; Schedules: future dates; Slug: unique across published |
| **Acceptance Criteria** | Rich text supports headings, lists, links, bold/italic, images; drag-drop image upload; SEO preview real-time; save as draft not published; schedule publishes via Celery; version history with diffs; revert restores old version |
| **Test Cases** | 1. Create article with rich text → saved and rendered 2. Upload image → URL returned 3. Save draft → not visible on frontend 4. Schedule for tomorrow → Celery publishes 5. Edit published → version saved 6. Revert → content restored 7. SEO preview correct 8. Script tags stripped |
| **Dependencies** | F-MIG-NEWS-001, F-ARCH-001, F-ADMIN-001 |
| **Risks** | Rich text XSS; image storage scaling; Celery beat scheduling reliability |
| **Estimated Complexity** | Very High (10-12 days) |

---

### Feature 22 — CMS: Page Builder

| Field | Detail |
|-------|--------|
| **Feature Number** | 22 |
| **Feature ID** | `F-CMS-PAGE-001` |
| **Feature Name** | CMS: Page Builder |
| **Objective** | Build visual page builder for creating and editing CMS pages with section-based layout |
| **Business Value** | Marketing creates landing pages without development; A/B testing capabilities |
| **Current Codebase Status** | CMS page model exists (F-015) but only API/CRUD; no visual builder |
| **Scope** | New feature |
| **Frontend Tasks** | Create `PageBuilder` (sidebar with available section types, main canvas with drag-drop reorder, section settings panel per type); section types: Hero, Text, Image, Info Grid, CTA, FAQ, Testimonial, Feature Grid, Comparison Table, Custom HTML; live preview mode; page settings panel (slug, SEO, published) |
| **Backend Tasks** | Extend CMSSection for all section type schemas; section type validation middleware |
| **Database Tasks** | Update `CMSSection`: settings (JSON), component_type (enum); `PageTemplate`: name, sections JSON |
| **API Tasks** | `GET /api/admin/page-builder/section-types/` (available with schema); `PUT /api/cms/:id/sections/` (batch update); `POST /api/cms/:id/publish/` (publish) |
| **Validation Rules** | Section must have valid component_type; Content validates against type schema; Published pages: at least one section; Slug: unique |
| **Acceptance Criteria** | Admin creates new CMS page; add sections via drag-drop; reorder in canvas; edit section content via settings; preview before publish; page renders at URL with all sections |
| **Test Cases** | 1. Create page from scratch → add Hero+Text+CTA 2. Reorder → renders new order 3. Edit Hero content → preview updates 4. Publish → accessible at URL 5. Duplicate → creates copy 6. Delete section → removed |
| **Dependencies** | F-MIG-LEGAL-001, F-ADMIN-001 |
| **Risks** | Complex drag-drop UX; JSON validation for 10+ section types; performance with many sections |
| **Estimated Complexity** | Very High (12-15 days) |

---

### Feature 23 — Newsletter Editor & Campaign Management

| Field | Detail |
|-------|--------|
| **Feature Number** | 23 |
| **Feature ID** | `F-NEWS-CAMPAIGN-001` |
| **Feature Name** | Newsletter Editor & Campaign Management |
| **Objective** | Build newsletter campaign creation, template editor, subscriber management, and send scheduling |
| **Business Value** | Email marketing automation; subscriber growth and engagement tracking |
| **Current Codebase Status** | Newsletter signup form exists but no backend; no campaign management |
| **Scope** | New feature |
| **Frontend Tasks** | Create `NewsletterCampaignList` (status/sent/opens); `CampaignEditor` (subject, preview text, rich email body, article selection, template selection, test send, send/schedule); `SubscriberManager` (import CSV, export, filter, add/unsubscribe); `TemplateEditor` (basic email templates); campaign analytics view (opens, clicks, unsubscribes) |
| **Backend Tasks** | Create `NewsletterCampaign`, `EmailTemplate`, `CampaignSend` models; email sending via Celery; unsubscribe webhook |
| **Database Tasks** | `NewsletterCampaign`: subject, body (rich HTML), preview_text, template (FK), status (DRAFT/SCHEDULED/SENDING/SENT/FAILED), scheduled_at, sent_at, recipient_count, open_count, click_count; `EmailTemplate`: name, subject_template, body_template, is_default; `CampaignSend`: campaign (FK), subscriber (FK), sent_at, opened_at, clicked_at, tracking_id (UUID), status; Update `NewsletterSubscriber`: add unsubscribed_at, source |
| **API Tasks** | `POST /api/admin/campaigns/` (create); `POST /api/admin/campaigns/:id/send/` (send/schedule); `POST /api/admin/campaigns/:id/test/` (test); `GET /api/admin/campaigns/:id/stats/` (analytics); `GET /api/newsletter/unsubscribe/:token/` (public); `GET /api/newsletter/track/open/:tracking_id/` (pixel); `GET /api/newsletter/track/click/:tracking_id/` (redirect) |
| **Validation Rules** | Subject: required max 200; Body: required HTML; Schedule: future date; Test: valid email; Subscriber email: unique valid |
| **Acceptance Criteria** | Campaign creation with rich text; blog articles selectable; test send delivers; send to all active; open/click tracking; unsubscribe link works; stats dashboard; CSV import |
| **Test Cases** | 1. Create campaign → save draft 2. Add blog article → content auto-populated 3. Test send → received 4. Schedule → Celery sends at time 5. Open email → tracking pixel fires 6. Click link → redirected 7. Unsubscribe → marked inactive 8. Import 100 CSV → all added 9. Duplicate email import → skipped |
| **Dependencies** | F-MIG-NEWS-001, F-ARCH-001, F-ADMIN-001 |
| **Risks** | Email deliverability (SPF/DKIM/DMARC); tracking pixel blocking; spam classification |
| **Estimated Complexity** | Very High (12-15 days) |

---

### Feature 24 — SMTP Email Integration

| Field | Detail |
|-------|--------|
| **Feature Number** | 24 |
| **Feature ID** | `F-EMAIL-001` |
| **Feature Name** | SMTP Email Integration |
| **Objective** | Set up transactional email via SMTP provider (Resend/Brevo) for all automated emails |
| **Business Value** | Reliable email delivery for forms, bookings, campaigns; professional handling |
| **Current Codebase Status** | `.env.example` has `RESEND_API_KEY` (Workers only); no Django email configured |
| **Scope** | New feature |
| **Frontend Tasks** | Create email templates (React Email for consistent rendering): Demo Booking Confirmation, Contact Enquiry Confirmation, Newsletter Welcome, Admin Notification; email preview in admin |
| **Backend Tasks** | Configure Django email backend (SMTP via Resend/Brevo); email service layer with template rendering; Celery email queue for async sending; email logging |
| **Database Tasks** | `EmailLog`: to_email, subject, template_name, context (JSON), status (QUEUED/SENT/FAILED/BOUNCED), sent_at, error_message, message_id, created_at |
| **API Tasks** | `POST /api/admin/email/test/` (test send); `GET /api/admin/email/logs/` (filtered logs) |
| **Validation Rules** | SMTP credentials required; From address verified domain; Max 100 emails/minute rate limit |
| **Acceptance Criteria** | Demo booking triggers confirmation; contact triggers notification; newsletter triggers welcome; all logged; failed retried 3x; bounce tracking via webhook; templates render in Gmail/Outlook/Apple Mail |
| **Test Cases** | 1. Demo booking → confirmation received 2. Contact → admin notified 3. Subscribe → welcome received 4. Email fails → retried 5. Logs record all 6. Template renders in major clients |
| **Dependencies** | F-MIG-DEMO-001, F-MIG-CONTACT-001, F-ARCH-001 |
| **Risks** | SMTP provider approval; deliverability (dedicated IP may be needed); template rendering cross-client |
| **Estimated Complexity** | Medium (4-5 days) |

---

### Feature 25 — WhatsApp Integration

| Field | Detail |
|-------|--------|
| **Feature Number** | 25 |
| **Feature ID** | `F-WHATSAPP-001` |
| **Feature Name** | WhatsApp Business Integration |
| **Objective** | Integrate WhatsApp Business API for automated notifications, demo reminders, and support chat |
| **Business Value** | WhatsApp is primary communication for Indian MSMEs; automated reminders reduce no-shows |
| **Current Codebase Status** | Static WhatsApp floating button linking to `wa.me/+917874677836`; no automation |
| **Scope** | New feature |
| **Frontend Tasks** | Update `WhatsAppFloat` to use dynamic number from API; add chat bubble with pre-defined quick replies; WhatsApp settings in admin (number, auto-reply messages, availability hours) |
| **Backend Tasks** | WhatsApp Business API setup (via Interakt, WATI, or Meta direct); webhook endpoint for incoming messages; message templates (demo reminder, follow-up); integrate WhatsApp numbers into lead communication |
| **Database Tasks** | `WhatsAppConfig`: phone_number_id, access_token (encrypted), business_account_id, webhook_verify_token, is_active; `WhatsAppMessage`: lead (FK), direction (INBOUND/OUTBOUND), message_type (TEXT/TEMPLATE), content, template_name, whatsapp_message_id, status, timestamps; `WhatsAppTemplate`: name, language, category, body (params), header, footer, status, meta_template_id |
| **API Tasks** | `GET/POST /api/admin/whatsapp/config/`; `POST /api/whatsapp/webhook/` (incoming); `POST /api/whatsapp/send-template/` (send); `GET /api/whatsapp/messages/` (conversation history) |
| **Validation Rules** | Template params: max 5; Auto-reply: max 500 chars; Webhook: must verify with hub.challenge |
| **Acceptance Criteria** | WhatsApp float works; demo booking triggers WhatsApp reminder 24h and 1h before; status updates send WhatsApp notifications; incoming messages appear in admin; admin can reply; webhook verifies and processes |
| **Test Cases** | 1. Demo booked → reminder WhatsApp sent 2. Admin replies → delivered 3. Incoming creates lead if new 4. Template with correct params 5. Webhook verification succeeds |
| **Dependencies** | F-MIG-DEMO-001, F-LEAD-001, F-EMAIL-001 |
| **Risks** | WhatsApp Business API approval process; template approval delays; message rate limits |
| **Estimated Complexity** | High (7-9 days) |

---

### Feature 26 — Rule-Based Chatbot

| Field | Detail |
|-------|--------|
| **Feature Number** | 26 |
| **Feature ID** | `F-CHATBOT-001` |
| **Feature Name** | Rule-Based Chatbot |
| **Objective** | Build rule-based chatbot with predefined conversation flows for lead qualification, FAQ, and demo booking |
| **Business Value** | 24/7 lead engagement; reduces manual response time; qualifies leads before human handoff |
| **Current Codebase Status** | Not present |
| **Scope** | New feature |
| **Frontend Tasks** | Create `ChatWidget` (floating button → chat window); chat message components (bot/user message, quick reply buttons, typing indicator, carousel cards); conversation flow engine with flows: qualification (5 questions → lead → demo booking), FAQ (keyword matching → answer), demo booking (collect details → submit); smooth scroll and auto-focus |
| **Backend Tasks** | Chatbot flow configuration model; conversation logging; human handoff trigger; keyword-intent matching engine |
| **Database Tasks** | `ChatFlow`: name, description, is_active, welcome_message, fallback_message; `ChatNode`: flow (FK), node_key, message, response_type (TEXT/QUICK_REPLY/CAROUSEL/FORM/WAIT/HANDOFF), options (JSON), validation (JSON for FORM); `ChatConversation`: visitor_id, lead (FK nullable), conversation_data (JSON), status (ACTIVE/COMPLETED/HANDED_OFF), timestamps |
| **API Tasks** | `POST /api/chat/start/` (welcome); `POST /api/chat/message/` (process, return response+options); `POST /api/chat/handoff/` (human); `GET /api/admin/chat/conversations/`; `GET /api/admin/chat/flows/` |
| **Validation Rules** | Flow must have welcome node; Node options valid JSON; Handoff requires available agent condition |
| **Acceptance Criteria** | Chat widget on all pages; welcome on open; quick replies navigate; FAQ keywords trigger answers; qualification captures lead; demo booking via chat creates lead+booking; conversation history in admin; human handoff triggers email |
| **Test Cases** | 1. Click widget → welcome 2. Select "Book Demo" → qualification starts 3. Answer 5 questions → booking created 4. Type "price" → FAQ pricing answer 5. Select "Talk to Human" → handoff 6. Conversation saved 7. No infinite loops |
| **Dependencies** | F-MIG-DEMO-001, F-LEAD-001 |
| **Risks** | Conversation flow complexity (many branches); fallback handling; performance with concurrent chats |
| **Estimated Complexity** | High (8-10 days) |

---

### Feature 27 — Career Page & Resume Upload

| Field | Detail |
|-------|--------|
| **Feature Number** | 27 |
| **Feature ID** | `F-CAREER-001` |
| **Feature Name** | Career Page & Resume Upload |
| **Objective** | Build career/jobs page with job listings, resume upload, and applicant tracking |
| **Business Value** | Talent acquisition channel; employer branding |
| **Current Codebase Status** | Not present |
| **Scope** | New feature |
| **Frontend Tasks** | Create `CareerPage` (company culture, benefits, open positions); `JobListing` (title, department, location, type, description, apply); `JobDetail` (full description, requirements, responsibilities, apply form); `ApplicationForm` (name, email, phone, resume upload drag-drop, cover letter, portfolio link) |
| **Backend Tasks** | Create `Job`, `JobApplication` models; resume file storage (Django FileField or S3); admin for job/applicant management |
| **Database Tasks** | `Job`: title, slug, department, location, type (FULL_TIME/PART_TIME/CONTRACT/INTERN), description (rich text), requirements, responsibilities, is_active, posted_at, closed_at, applications_count; `JobApplication`: job (FK), name, email, phone, resume_file, cover_letter, portfolio_url, status (RECEIVED/REVIEWING/SHORTLISTED/INTERVIEWED/REJECTED/HIRED), notes, timestamps |
| **API Tasks** | `GET /api/jobs/` (active); `GET /api/jobs/:slug/` (detail); `POST /api/jobs/:id/apply/` (submit); `GET /api/admin/applications/` (filtered); `PUT /api/admin/applications/:id/` (update status/notes) |
| **Validation Rules** | Resume: max 10MB, pdf/doc/docx; Name: required max 100; Email: valid; Phone: valid Indian mobile; Cover letter: max 5000 chars |
| **Acceptance Criteria** | Career page lists active jobs; job detail from API; apply uploads resume; application saved; admin views applications per job; admin changes status with logging; file validation for type/size |
| **Test Cases** | 1. Career page → active jobs 2. Click job → detail 3. Apply valid resume → created 4. Upload .exe → error 5. Upload >10MB → error 6. Admin changes status → logged 7. Closed job → not listed |
| **Dependencies** | F-ARCH-001, F-ADMIN-001 |
| **Risks** | File storage costs for resumes; virus scanning needed; GDPR/DPDP Act compliance for applicant data |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 28 — Resource Download Center

| Field | Detail |
|-------|--------|
| **Feature Number** | 28 |
| **Feature ID** | `F-RESOURCE-001` |
| **Feature Name** | Resource Download Center |
| **Objective** | Build gated download center with lead capture for PDFs, Excel templates, checklists, and guides |
| **Business Value** | Lead generation via content downloads; value-add for prospects |
| **Current Codebase Status** | 6 hardcoded resource cards in `newsletter.html` (2 PDF, 1 Excel); no actual files, no gating |
| **Scope** | New feature |
| **Frontend Tasks** | Create `ResourceCenter` (grid of resource cards with type badges); `ResourceCard` (title, description, type icon, download count); `ResourceGate` (popup form: name, email, company — lead capture); `ResourceCategories` (filter by type); download tracking with analytics |
| **Backend Tasks** | Extend `Resource` model; file storage for downloadables; download tracking with lead capture; admin for resource management |
| **Database Tasks** | Extend `Resource`: file (FileField), file_size, version, requires_gate (boolean), gated_until (nullable), shareable_url; `ResourceDownload`: resource (FK), lead (FK nullable), email, name, company, ip_address, user_agent, downloaded_at |
| **API Tasks** | `GET /api/resources/` (search/filter); `GET /api/resources/:id/download/` (track + return file); `POST /api/resources/:id/access/` (gate form, create lead, grant token); `GET /api/admin/resources/stats/` (analytics) |
| **Validation Rules** | File: max 50MB, pdf/xlsx/xls/docx/zip; Gate: name and email required; Access token: 30-day expiry |
| **Acceptance Criteria** | Resources with type badges; gated resource shows lead capture; submit form = download; subsequent skip form (cookie); download counts tracked; admin upload new; file type auto-detected; categories filter |
| **Test Cases** | 1. Click gated → gate form 2. Fill → download starts 3. Count increments 4. Click again → no gate 5. Filter PDF → only PDFs 6. Admin upload → appears 7. Unsupported type → error |
| **Dependencies** | F-MIG-NEWS-001, F-LEAD-001, F-ARCH-001 |
| **Risks** | File storage costs; CDN for downloads; cookie-based gating bypass |
| **Estimated Complexity** | Medium (4-5 days) |

---

### Feature 29 — Site-Wide Search

| Field | Detail |
|-------|--------|
| **Feature Number** | 29 |
| **Feature ID** | `F-SEARCH-001` |
| **Feature Name** | Site-Wide Search |
| **Objective** | Implement PostgreSQL full-text search across articles, FAQ, features, pages, resources |
| **Business Value** | Content discoverability; reduces support queries; improves UX |
| **Current Codebase Status** | FAQ page has browser-side search with term highlighting (client-side only); no server search |
| **Scope** | New feature |
| **Frontend Tasks** | Create `GlobalSearch` (nav search icon → input → results dropdown); search results page at `/os/search/?q=`; result card (title, excerpt with highlight, breadcrumb, type icon); debounced suggestions (300ms); keyboard navigation (arrows, Enter, Escape) |
| **Backend Tasks** | PostgreSQL full-text search (tsvector/tsquery); GIN indexes across models (Article, FAQItem, CMSPage, Resource); search API with relevance ranking; search logging |
| **Database Tasks** | GIN index on tsvector columns per model; `SearchLog`: query, results_count, user_id (nullable), ip_address, created_at |
| **API Tasks** | `GET /api/search/?q=&type=&page=` (full-text, type filter, paginated); `GET /api/search/suggestions/?q=` (autocomplete); Engine: `ts_rank` with dictionary weighting (article title > FAQ question > page content) |
| **Validation Rules** | Query: required, min 2 chars, max 200, sanitized; Results: max 50 per page |
| **Acceptance Criteria** | Search returns dropdown as user types; results page grouped by type; highlights matching terms; no results shows suggestions; terms logged; min 2 chars to trigger; results <300ms |
| **Test Cases** | 1. Type "pricing" → dropdown with page, FAQ, articles 2. Search "whatsapp" → articles + FAQ 3. "xy" (<2 chars) → no trigger 4. Empty results → message + suggestions 5. Result title links correctly 6. Search log recorded 7. GIN index used (EXPLAIN) 8. Special chars sanitized |
| **Dependencies** | F-MIG-FAQ-001, F-MIG-NEWS-001, F-MIG-LEGAL-001, F-ARCH-001 |
| **Risks** | PG full-text search English-only; GIN index overhead; relevance tuning complex |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 30 — Cookie Consent Banner

| Field | Detail |
|-------|--------|
| **Feature Number** | 30 |
| **Feature ID** | `F-COOKIE-001` |
| **Feature Name** | Cookie Consent Banner |
| **Objective** | Implement GDPR/DPDP Act 2023 compliant cookie consent banner with granular preferences |
| **Business Value** | Legal compliance for Indian (DPDP Act 2023) and EU (GDPR) visitors; trust building |
| **Current Codebase Status** | Not present — only Plausible (cookieless); will be needed for future features |
| **Scope** | New feature |
| **Frontend Tasks** | Create `CookieConsent` (bottom banner: message, Accept All, Reject All, Customize); `CookiePreferences` modal (categories: Essential, Analytics, Marketing, Preferences — each with toggle); localStorage consent storage; Google Consent Mode v2 integration if GA added; respect Do Not Track header |
| **Backend Tasks** | Create `CookieConsent` model (optional, for server-side recording for logged-in users); update analytics to respect consent |
| **Database Tasks** | `CookieConsent`: session_id/anonymous_id, consent_data (JSON categories), ip_address, user_agent, consented_at, updated_at |
| **API Tasks** | `POST /api/cookie-consent/` (record preferences) |
| **Validation Rules** | Consent: valid JSON with all categories; Essential always enabled |
| **Acceptance Criteria** | Banner on first visit; Accept All enables all; Reject All essential only; Customize opens modal; preferences in localStorage; no banner on return; consent updatable from footer; DNT respected; mobile responsive |
| **Test Cases** | 1. First visit → banner 2. Accept All → analytics enabled 3. Reject All → essential only 4. Customize → selected categories only 5. Reload → no banner 6. Footer "Cookie Settings" → modal 7. DNT → auto-reject non-essential 8. Consent in localStorage |
| **Dependencies** | F-LAY-001 |
| **Risks** | Jurisdiction-specific consent requirements (geo-detection); cookie classification accuracy |
| **Estimated Complexity** | Low-Medium (2-3 days) |

---

### Feature 31 — Announcement Banner

| Field | Detail |
|-------|--------|
| **Feature Number** | 31 |
| **Feature ID** | `F-BANNER-001` |
| **Feature Name** | Announcement Banner System |
| **Objective** | Build dismissible top-of-page announcement banner with scheduling, targeting, and multiple types |
| **Business Value** | Promote webinars, new features, offers; time-sensitive messaging |
| **Current Codebase Status** | Not present |
| **Scope** | New feature |
| **Frontend Tasks** | Create `AnnouncementBanner` (fixed top bar below nav: message + optional CTA + dismiss X); types: info, success, warning, promotion, critical; dismiss persistence (localStorage per-banner key); countdown timer variant; link variant (click-through) |
| **Backend Tasks** | Create `AnnouncementBanner` model; admin management; API for active banner |
| **Database Tasks** | `AnnouncementBanner`: message, type (INFO/SUCCESS/WARNING/PROMOTION/CRITICAL), cta_text, cta_url, is_dismissible, dismiss_key, starts_at, ends_at, is_active, targeting_page_slugs (JSON or "all"), created_at |
| **API Tasks** | `GET /api/announcement/active/` (active for current page); `POST/PUT /api/admin/announcement/` (CRUD) |
| **Validation Rules** | Message: required max 500; CTA with URL; ends_at after starts_at; Dismiss key auto-generated |
| **Acceptance Criteria** | Active banner on specified pages; type-based color scheme; dismiss persists; scheduled appear/disappear; CTA correct; only one per page; critical non-dismissible |
| **Test Cases** | 1. Create info → appears all pages 2. Target pricing only → only pricing 3. Dismiss → persists 4. starts_at tomorrow → not visible 5. ends_at yesterday → not visible 6. Critical → no dismiss 7. Multiple → most recent shown |
| **Dependencies** | F-LAY-001, F-ADMIN-001 |
| **Risks** | Banner shift causing CLS; fix with fixed positioning |
| **Estimated Complexity** | Low-Medium (2-3 days) |

---

### Feature 32 — SEO Management Dashboard

| Field | Detail |
|-------|--------|
| **Feature Number** | 32 |
| **Feature ID** | `F-SEO-001` |
| **Feature Name** | SEO Management Dashboard |
| **Objective** | Build SEO management interface for per-page meta titles, descriptions, OG tags, canonical URLs, structured data, and social images |
| **Business Value** | Marketing optimizes SEO per page without developer; better search rankings |
| **Current Codebase Status** | SEO meta tags injected at build from site.json; no per-page admin UI |
| **Scope** | New feature |
| **Frontend Tasks** | Create `SEOManager` (page list with scores, edit form per page, live OG preview showing Google/Facebook/Twitter appearance, character counter for title/description, slug editor, structured data selector, noindex toggle, canonical editor, sitemap priority/changefreq editor); `SEOScore` (basic health score per page) |
| **Backend Tasks** | Create `SEOMeta` model; API for per-page SEO; update sitemap generation to use dynamic SEO data |
| **Database Tasks** | `SEOMeta`: page_slug (unique), meta_title, meta_description, og_title, og_description, og_image, twitter_card_type, canonical_url, noindex (boolean), structured_data_type, structured_data (JSON), sitemap_priority, sitemap_changefreq, score, last_reviewed_at |
| **API Tasks** | `GET /api/admin/seo/` (list); `GET /api/admin/seo/:slug/` (single); `PUT /api/admin/seo/:slug/` (update); `POST /api/admin/seo/:slug/score/` (recalculate) |
| **Validation Rules** | Meta title: 30-60 chars; Meta description: 120-160 chars; OG image: valid URL; Canonical: valid absolute URL; Sitemap priority: 0.0-1.0 |
| **Acceptance Criteria** | All pages with SEO scores; per-page edit with character counter; OG preview real-time; noindex toggle; canonical editable; structured data selectable; changes in page source; scores color-coded (green ≥ 80, yellow ≥ 60, red < 60) |
| **Test Cases** | 1. Edit home title → appears in source 2. Description 200 chars → validation error 3. Noindex → robots meta added 4. Select FAQPage structured data → JSON-LD injected 5. OG image in source 6. Score colors 7. Empty title → error |
| **Dependencies** | F-ARCH-001, F-ADMIN-001 |
| **Risks** | Meta tag injection must be server-side for SEO (SSR or helmet per page) |
| **Estimated Complexity** | Medium (4-5 days) |

---

### Feature 33 — Dynamic Sitemap & Robots.txt

| Field | Detail |
|-------|--------|
| **Feature Number** | 33 |
| **Feature ID** | `F-SITEMAP-001` |
| **Feature Name** | Dynamic Sitemap & Robots.txt |
| **Objective** | Generate dynamic sitemap.xml and robots.txt from database, auto-including new articles, CMS pages, and jobs |
| **Business Value** | Search engines always have fresh sitemap; automated content discovery |
| **Current Codebase Status** | Static sitemap.xml and robots.txt generated at build from site.json |
| **Scope** | Enhancement |
| **Frontend Tasks** | None (server-rendered XML) |
| **Backend Tasks** | Dynamic sitemap view (`/sitemap.xml`); sitemap index if >50,000 URLs; include: static pages, articles, CMS pages, jobs, FAQ items, resources; dynamic robots.txt; cache sitemap (1-hour TTL); lastmod/changefreq/priority from SEO meta |
| **Database Tasks** | None (uses existing models + SEOMeta) |
| **API Tasks** | `GET /sitemap.xml` (dynamic); `GET /robots.txt` (dynamic) |
| **Validation Rules** | Sitemap: valid XML, max 50,000 URLs per index, max 50MB; Robots.txt: valid syntax, must include sitemap ref |
| **Acceptance Criteria** | Sitemap includes all pages, articles, CMS pages, jobs; new article auto-appears; robots.txt references sitemap; 1-hour cache; noindex excluded; lastmod reflects actual dates; validates against schema |
| **Test Cases** | 1. GET /sitemap.xml → valid XML 2. Publish article → appears next cache miss 3. Noindex page → excluded 4. robots.txt includes Sitemap: 5. lastmod matches DB 6. XML validates |
| **Dependencies** | F-ARCH-001, F-SEO-001 |
| **Risks** | Large URL count → sitemap index needed; caching invalidation logic |
| **Estimated Complexity** | Low-Medium (2-3 days) |

---

### Feature 34 — User Authentication & Authorization

| Field | Detail |
|-------|--------|
| **Feature Number** | 34 |
| **Feature ID** | `F-AUTH-001` |
| **Feature Name** | User Authentication & Authorization System |
| **Objective** | Implement JWT-based authentication with role-based access control for all admin features |
| **Business Value** | Secures all admin features; multi-user access with different permission levels |
| **Current Codebase Status** | No authentication; `.env.example` has ADMIN_USERNAME/ADMIN_PASSWORD/JWT_SECRET for Workers only |
| **Scope** | New feature |
| **Frontend Tasks** | Create `LoginPage` (email + password, remember me, forgot password); auth context/provider with login/logout/refresh; `ProtectedRoute` for admin; `AdminLayout` with user menu; `ForgotPassword` and `ResetPassword` pages; `ProfilePage` for password change; 401 interceptor auto-redirect; role-based component visibility (`AdminContent`, `EditorContent`) |
| **Backend Tasks** | Django Simple JWT configuration; custom User model; role/permission system; token refresh/revoke; login rate limiting; password policies |
| **Database Tasks** | Django User (email as username); `UserProfile`: user (OneToOne), phone, department, avatar, is_active; `Role`: name (SUPER_ADMIN/ADMIN/EDITOR/VIEWER), permissions (JSON); `RefreshToken`: user (FK), token, expires_at |
| **API Tasks** | `POST /api/auth/login/` (access+refresh tokens); `POST /api/auth/refresh/`; `POST /api/auth/logout/` (revoke); `POST /api/auth/forgot-password/` (send email); `POST /api/auth/reset-password/`; `GET /api/auth/me/` (profile) |
| **Validation Rules** | Password: min 8, upper+lower+number; Login: 5 attempts/15min/IP; Access token: 30min; Refresh token: 7 days |
| **Acceptance Criteria** | Login renders; valid credentials return JWT; protected routes redirect to login; token refresh transparent; rate limiting blocks after 5 fails; forgot password sends link; reset with valid token works; role-based visibility in admin |
| **Test Cases** | 1. Valid login → 200 with tokens 2. Wrong password → 401 3. Protected route no token → redirect 4. Expired access → auto-refresh 5. 5 fails → rate limited 6. Forgot password → email sent 7. Invalid reset token → 400 8. Logout → refresh revoked 9. Editor role cannot access admin-only |
| **Dependencies** | F-ARCH-001 |
| **Risks** | JWT storage (httpOnly cookie vs localStorage); CSRF with JWT; token rotation complexity |
| **Estimated Complexity** | High (6-8 days) |

---

### Feature 35 — Admin User Management

| Field | Detail |
|-------|--------|
| **Feature Number** | 35 |
| **Feature ID** | `F-ADMIN-USERS-001` |
| **Feature Name** | Admin User Management |
| **Objective** | Build admin interface for managing users, roles, permissions, and access control |
| **Business Value** | Team collaboration with proper access controls; security compliance |
| **Current Codebase Status** | Not present |
| **Scope** | New feature |
| **Frontend Tasks** | Create `UserManagement` page (list with search, filter by role/status); `UserEditor` (create/edit: name, email, role, department, phone); `UserDetail` (activity log, last login, permissions); `RoleManagement` (CRUD for roles, permission assignment); `InviteUser` (send invitation, set temp password, assign role); user status toggle (active/inactive) |
| **Backend Tasks** | User management API; invitation system; activity tracking; permission enforcement middleware |
| **Database Tasks** | Covered by User + Role models from F-034; Additional: `UserInvitation`: email, role (FK), invited_by (FK), token, status, expires_at, accepted_at; `Permission`: codename, name, resource_type |
| **API Tasks** | `GET /api/admin/users/` (list); `POST /api/admin/users/` (create); `PUT /api/admin/users/:id/` (update); `DELETE /api/admin/users/:id/` (deactivate); `POST /api/admin/users/invite/`; `GET /api/admin/roles/`; `POST/PUT /api/admin/roles/` |
| **Validation Rules** | Email: unique valid; Role: must be valid; Cannot delete own account; Cannot reduce own role permissions |
| **Acceptance Criteria** | User list shows all; super admin creates new; invitation email sends; accepting sets password; role changes immediate; inactive users blocked; permission checks enforced |
| **Test Cases** | 1. Create user → appears 2. Invite → email received 3. Accept → active 4. Change role → permissions updated 5. Deactivate → blocked 6. Delete own → error 7. Viewer cannot create users |
| **Dependencies** | F-AUTH-001, F-ADMIN-001 |
| **Risks** | Permission granularity (too fine = complex, too coarse = insecure) |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 36 — Business Analytics Dashboard

| Field | Detail |
|-------|--------|
| **Feature Number** | 36 |
| **Feature ID** | `F-ANALYTICS-001` |
| **Feature Name** | Business Analytics Dashboard |
| **Objective** | Build BI dashboard with lead conversion metrics, traffic analytics, content performance, and ROI tracking |
| **Business Value** | Data-driven decision making; measure marketing effectiveness; justify ROI |
| **Current Codebase Status** | Plausible analytics (pageviews only); no business analytics |
| **Scope** | New feature |
| **Frontend Tasks** | Create `AnalyticsDashboard` (date range picker, KPI row, chart panels); charts: Lead funnel (sankey), Lead source (pie), Leads over time (line), Demo bookings over time (bar), Content performance (table), Conversion rate trend (line); export to CSV/PDF |
| **Backend Tasks** | Analytics data aggregation service; materialized views for performance; Celery beat daily aggregation; Plausible API integration for traffic; custom event tracking for conversions |
| **Database Tasks** | `AnalyticsDailySnapshot`: date, total_visitors, total_leads, new_leads, demo_bookings_completed, contact_enquiries, newsletter_subscriptions, resource_downloads, conversions, conversion_rate, avg_response_time_minutes; `AnalyticsEvent`: event_name, properties (JSON), source, page, ip_address, user_agent; Database views for funnel aggregation |
| **API Tasks** | `GET /api/admin/analytics/summary/` (KPI summary); `GET /api/admin/analytics/funnel/` (conversion funnel); `GET /api/admin/analytics/sources/` (source breakdown); `GET /api/admin/analytics/trends/` (time-series); `GET /api/admin/analytics/content/` (content performance); `GET /api/admin/analytics/export/` (CSV) |
| **Validation Rules** | Date range: max 365 days; All analytics auth-required; Data aggregated hourly |
| **Acceptance Criteria** | KPIs show totals, rate, demos, response time; date filter updates all; funnel shows drop-off at each stage; source breakdown correct; content performance shows article→lead conversion; CSV export works |
| **Test Cases** | 1. Load → KPIs populated 2. Date 30d → charts update 3. Funnel matches lead counts 4. Sources sum to total 5. CSV valid 6. Daily aggregation runs |
| **Dependencies** | F-LEAD-001, F-ADMIN-001, F-AUTH-001 |
| **Risks** | Data accuracy if events missed; large date range performance; aggregation job failures |
| **Estimated Complexity** | High (7-9 days) |

---

### Feature 37 — Form Rate Limiting & Spam Protection

| Field | Detail |
|-------|--------|
| **Feature Number** | 37 |
| **Feature ID** | `F-SEC-FORM-001` |
| **Feature Name** | Form Rate Limiting & Spam Protection |
| **Objective** | Implement comprehensive spam protection: rate limiting, CAPTCHA, honeypot enhancement, spam detection |
| **Business Value** | Prevents spam; ensures lead quality; protects email reputation |
| **Current Codebase Status** | Basic honeypot in JS; no rate limiting; no CAPTCHA |
| **Scope** | Enhancement |
| **Frontend Tasks** | Integrate hCaptcha or Cloudflare Turnstile on all public forms; loading/verification states for CAPTCHA; progressive rate limit messaging |
| **Backend Tasks** | Rate limiting middleware (Django Ratelimit or custom); spam detection (keyword filtering, URL detection, pattern matching); honeypot timing validation (bot <2 seconds); IP-based cooldown; CAPTCHA verification |
| **Database Tasks** | `FormSubmissionLog`: form_type, ip_address, user_agent, submission_time_ms, is_spam, spam_reason; `RateLimitRecord`: ip_address, endpoint, request_count, window_start, window_end |
| **API Tasks** | Update all form endpoints with rate limiting; `POST /api/auth/captcha/verify/` (validate token) |
| **Validation Rules** | Demo booking: 3/hour/IP; Contact: 5/hour/IP; Newsletter: 10/hour/IP; Resource: 20/hour/IP; Min submission time: 3 seconds; Honeypot: must be empty |
| **Acceptance Criteria** | Forms reject rapid submissions; CAPTCHA blocks automated; suspicious patterns flagged (logged but reviewed); legitimate users not blocked; counters reset per window |
| **Test Cases** | 1. 3x submit in 1 min → 4th blocked 2. Honeypot filled → silent rejection 3. <2 seconds → flagged 4. URL in name field → flagged 5. Rate limit IP only (not auth users) 6. After cooldown → allowed |
| **Dependencies** | F-MIG-DEMO-001, F-MIG-CONTACT-001, F-MIG-NEWS-001 |
| **Risks** | CAPTCHA impact on conversion rate; mobile CAPTCHA UX; rate limit false positives for shared IPs |
| **Estimated Complexity** | Medium (3-4 days) |

---

### Feature 38 — Security Hardening

| Field | Detail |
|-------|--------|
| **Feature Number** | 38 |
| **Feature ID** | `F-SEC-HARDEN-001` |
| **Feature Name** | Security Hardening |
| **Objective** | Implement comprehensive security: CSP, CSRF, XSS prevention, secure headers, CORS, data encryption, security.txt |
| **Business Value** | Enterprise-grade security; client trust; compliance preparation |
| **Current Codebase Status** | Nginx security headers exist for Docker; Netlify has equivalent; Django needs Django-specific security |
| **Scope** | Enhancement |
| **Frontend Tasks** | Review React for XSS vectors (dangerouslySetInnerHTML); sanitize user content (DOMPurify); add CSRF token to API requests; secure JWT storage (httpOnly cookie); Subresource Integrity (SRI) for CDN |
| **Backend Tasks** | Django security middleware: SECURE_SSL_REDIRECT, SECURE_HSTS, SECURE_BROWSER_XSS_FILTER, CONTENT_TYPE_NOSNIFF, CSRF/SESSION_COOKIE_SECURE, SECURE_REFERRER_POLICY; CSP via Django-CSP; nginx CSP compatibility with Django-admin; encrypt sensitive fields (WhatsApp keys, SMTP); API key rotation; request ID in responses; security.txt endpoint |
| **Database Tasks** | None (configuration only) |
| **API Tasks** | `GET /.well-known/security.txt`; `GET /health` (detailed); All responses include X-Request-ID, security headers |
| **Validation Rules** | CSP no unsafe-inline for scripts (nonce-based); Sensitive settings encrypted at rest; All API responses include security headers |
| **Acceptance Criteria** | CSP header on all responses; CSRF on state-changing requests; XSS sanitization on all user content; security.txt accessible; HTTPS enforced; Django admin behind secure config; penetration test shows no high/critical findings |
| **Test Cases** | 1. Verify response headers (CSP, HSTS, X-Frame, etc.) 2. XSS attempt via rich text → sanitized 3. CSRF without token → rejected 4. HTTP → redirected to HTTPS 5. security.txt endpoint 6. Sensitive fields encrypted in DB 7. Request ID in responses |
| **Dependencies** | F-AUTH-001, F-ARCH-001 |
| **Risks** | CSP too strict → breaks functionality; CSP too loose → ineffective; Django admin CSP compatibility |
| **Estimated Complexity** | Medium (4-5 days) |

---

### Feature 39 — Logging & Monitoring

| Field | Detail |
|-------|--------|
| **Feature Number** | 39 |
| **Feature ID** | `F-OPS-LOG-001` |
| **Feature Name** | Logging & Monitoring |
| **Objective** | Set up structured logging, error tracking, uptime monitoring, and performance metrics |
| **Business Value** | Production observability; faster incident response; performance optimization data |
| **Current Codebase Status** | Nginx access/error logs only; no application logging, error tracking, or monitoring |
| **Scope** | New feature |
| **Frontend Tasks** | Frontend error tracking (Sentry browser SDK); frontend performance monitoring (Web Vitals: LCP, FID, CLS via web-vitals library); send errors/performance to backend reporting endpoint |
| **Backend Tasks** | Structured logging (Django with JSON format — python-json-logger); log levels per environment; Sentry SDK for Django; health check endpoints with detailed component status (DB, cache, email, storage); request/response logging middleware with duration; slow query logging; Gunicorn access logging |
| **Database Tasks** | `ErrorLog`: error_type, message, stack_trace, url, user_id (nullable), ip_address, user_agent, severity (DEBUG/INFO/WARNING/ERROR/CRITICAL), environment, created_at; `PerformanceMetric`: page_url, metric_name (LCP/FID/CLS/TTFB/FCP), metric_value, created_at |
| **API Tasks** | `POST /api/logging/error/` (report frontend error); `POST /api/logging/performance/` (report Web Vitals); `GET /api/admin/logs/` (view logs, admin); `GET /health` (extended: DB, cache, email connectivity) |
| **Validation Rules** | Error: message required max 5000; Performance: value numeric; Logging endpoints rate limited |
| **Acceptance Criteria** | All errors logged with context; frontend JS errors captured; slow queries logged (>500ms); health endpoint returns component statuses; error tracking shows frequency/trends; Web Vitals collected; JSON-formatted logs |
| **Test Cases** | 1. Trigger 500 → logged with stack 2. Frontend JS error → reported 3. Page load → Web Vitals sent 4. GET /health → all healthy 5. Slow query >500ms → warning 6. JSON log format 7. Log rotation configured |
| **Dependencies** | F-ARCH-001, F-ADMIN-001 |
| **Risks** | Error reporting overhead; log volume; Sentry cost at scale |
| **Estimated Complexity** | Medium (3-5 days) |

---

### Feature 40 — Payment Gateway Integration (Razorpay)

| Field | Detail |
|-------|--------|
| **Feature Number** | 40 |
| **Feature ID** | `F-PAYMENT-001` |
| **Feature Name** | Payment Gateway Integration (Razorpay) |
| **Objective** | Integrate Razorpay for pricing plan purchases, setup fee payments, and automated invoicing |
| **Business Value** | Enable online sales; reduce sales cycle; professional invoicing |
| **Current Codebase Status** | Pricing page is static; no payment capability |
| **Scope** | New feature |
| **Frontend Tasks** | Create `PaymentModal` on pricing page (select plan → payment form → Razorpay checkout overlay); `PaymentFlow` (plan selection, company details, payment method, order summary, Razorpay integration); payment success page with invoice download; payment failure with retry; `InvoiceHistory` (admin: paid invoices with download) |
| **Backend Tasks** | Razorpay SDK (Python); order management; webhook handler for payment events; invoice generation (PDF via WeasyPrint/xhtml2pdf); payment status tracking |
| **Database Tasks** | `Order`: order_id (unique, Razorpay), lead/customer (FK nullable), plan_type, amount, gst_amount, total_amount, currency (INR), status (CREATED/PAID/FAILED/REFUNDED), razorpay_order_id, razorpay_payment_id, razorpay_signature, billing_details (JSON), timestamps; `Invoice`: order (FK), invoice_number (INV-YYYY-NNNN), pdf_file, status, sent_at, due_date; `PaymentConfig`: razorpay_key_id, razorpay_key_secret (encrypted), is_test_mode, webhook_secret |
| **API Tasks** | `POST /api/payments/create-order/` (create Razorpay order); `POST /api/payments/verify/` (verify signature); `POST /api/payments/webhook/` (Razorpay events); `GET /api/admin/payments/orders/`; `GET /api/admin/payments/invoices/`; `GET /api/admin/payments/invoices/:id/download/` |
| **Validation Rules** | Order: amount matches plan; Webhook: verify signature first; Invoice: GST calculation (18%); Plan: valid slug |
| **Acceptance Criteria** | Select plan → billing details → Razorpay checkout → paid → success with invoice PDF; webhook handles failed payments; admin views orders/invoices; test mode toggle; GST on invoice (18%); refund processing reflected |
| **Test Cases** | 1. Select Starter → checkout ₹49,000 + ₹25,000 2. Complete → callback received 3. Signature verified → marked PAID 4. Invoice generated downloadable 5. Failed → marked FAILED 6. Wrong webhook signature → rejected 7. Test mode → test keys used 8. GST calculated at 18% |
| **Dependencies** | F-MIG-PRICING-001, F-AUTH-001, F-ARCH-001 |
| **Risks** | Razorpay account approval; GST compliance complexity; payment reconciliation; PCI-DSS minimized via Razorpay Checkout |
| **Estimated Complexity** | High (7-9 days) |
```

---

### Feature 41 — Advanced Demo Booking Calendar

| Field | Detail |
|-------|--------|
| **Feature Number** | 41 |
| **Feature ID** | `F-CALENDAR-001` |
| **Feature Name** | Advanced Demo Booking Calendar |
| **Objective** | Upgrade demo booking calendar with admin-configurable availability, buffer time, holidays, and multi-slot management |
| **Business Value** | Prevents double-booking; optimized scheduling; reduces no-shows |
| **Current Codebase Status** | Basic calendar widget in demo-booking page; no backend availability |
| **Scope** | Enhancement |
| **Frontend Tasks** | Rewrite `CalendarWidget` as full-featured scheduler: month/week view, time slots with availability indicators (green/yellow/red), selected slot confirmation modal, timezone display, buffer-time visualization, loading states |
| **Backend Tasks** | Create `ScheduleConfig`, `BookedSlot` models; slot availability calculation (configurable hours, buffer, holidays, max per day); iCal/Google Calendar integration for admin calendar sync |
| **Database Tasks** | `ScheduleConfig`: day_of_week (0-6), is_working_day, start_time, end_time, slot_duration_minutes, buffer_minutes, max_bookings_per_day; `Holiday`: date, name, is_recurring_yearly; `BookedSlot`: booking (FK), date, start_time, end_time, status, google_calendar_event_id; `AvailabilityOverride`: date, reason, is_blocked |
| **API Tasks** | `GET /api/demo-bookings/slots/?date=` (real-time availability); `POST /api/admin/schedule/` (configure weekly schedule); `GET /api/admin/schedule/` (get current); `POST /api/admin/holidays/` (add holiday/blocked date) |
| **Validation Rules** | Slot: no overlap + buffer, not on holiday, not on blocked date, within working hours, max_bookings_per_day not exceeded |
| **Acceptance Criteria** | Calendar shows only available slots; booked slots marked unavailable; holidays/blocked dates grayed out; buffer time respected; admin configures weekly schedule, block dates, set holidays; exceeding daily max shows "no slots available" |
| **Test Cases** | 1. Book 10-11AM with 30min buffer → 11:30AM available, 11AM blocked 2. Holiday → no slots 3. Block date → grayed 4. Exceed max_bookings → remaining hidden 5. Admin changes hours → new slots reflect 6. Concurrent booking → second rejected |
| **Dependencies** | F-MIG-DEMO-001, F-EMAIL-001, F-WHATSAPP-001 |
| **Risks** | Timezone for international; race condition on concurrent; Google Calendar API quota |
| **Estimated Complexity** | High (6-8 days) |

---

### Feature 42 — Meeting Booking System

| Field | Detail |
|-------|--------|
| **Feature Number** | 42 |
| **Feature ID** | `F-MEETING-001` |
| **Feature Name** | Meeting Booking System |
| **Objective** | Build Calendly-style meeting booking for sales team with meeting types and automated reminders |
| **Business Value** | Streamlined sales; self-service scheduling; reduced email back-and-forth |
| **Current Codebase Status** | Not present |
| **Scope** | New feature |
| **Frontend Tasks** | Create `MeetingBooking` (meeting types: 15min discovery, 30min consultation, 60min deep dive); team member availability selector; confirmation page with .ics download; meeting types configuration in admin |
| **Backend Tasks** | Create `MeetingType`, `MeetingBooking` models; iCal file generation; meeting link generation (Google Meet/Zoom optional); meeting reminder system (email + WhatsApp) |
| **Database Tasks** | `MeetingType`: name, description, duration_minutes, buffer_minutes, location_type (GOOGLE_MEET/ZOOM/PHONE/IN_PERSON), location_link, team_member (FK, nullable), is_active; `MeetingBooking`: meeting_type (FK), booker_name, booker_email, booker_company, booker_phone, meeting_date, start_time, end_time, assigned_to (FK), meeting_link, google_calendar_event_id, status (CONFIRMED/CANCELLED/RESCHEDULED/COMPLETED/NO_SHOW), calendar_invite_sent, reminder_sent_at |
| **API Tasks** | `GET /api/meetings/types/` (available types); `GET /api/meetings/slots/?type=&date=&member=` (available slots); `POST /api/meetings/book/` (book); `POST /api/meetings/:id/cancel/` (public cancel); `GET /api/meetings/:id/ics/` (download invite); `GET /api/admin/meetings/` (list); `PUT /api/admin/meetings/:id/` (update status) |
| **Validation Rules** | Meeting type: valid, active; Booker name/email: required; Date: working day, >= tomorrow; Slot: available, within working hours; Cancellation: only if CONFIRMED, >= 2 hours before |
| **Acceptance Criteria** | User selects meeting type, views available slots, books meeting, receives confirmation with .ics; admin views all meetings; reminders sent via email + WhatsApp; cancel within window; no-show tracking |
| **Test Cases** | 1. Select meeting type → slots shown 2. Book → confirmation + .ics 3. Cancel >2h before → cancelled 4. Cancel <2h before → not allowed 5. Reminder 1h before → received 6. Admin marks no-show → status updated 7. New meeting type added in admin → visible to users |
| **Dependencies** | F-CALENDAR-001, F-EMAIL-001, F-WHATSAPP-001 |
| **Risks** | Google Calendar API integration complexity; timezone handling; double-booking prevention |
| **Estimated Complexity** | High (6-8 days) |

---

### Feature 43 — Automated Email Drip Campaigns

| Field | Detail |
|-------|--------|
| **Feature Number** | 43 |
| **Feature ID** | `F-DRIP-001` |
| **Feature Name** | Automated Email Drip Campaigns |
| **Objective** | Build automated email drip sequences triggered by lead status, demo booking, or time-based events |
| **Business Value** | Nurture leads automatically; increase conversion rate; reduce sales team manual follow-up |
| **Current Codebase Status** | No email automation |
| **Scope** | New feature |
| **Frontend Tasks** | Create `DripCampaignList` (admin: list of campaigns with status); `DripCampaignEditor` (trigger event: lead_created, demo_booked, demo_completed, no_show, pricing_page_visit, 7_days_no_activity; sequence steps: email template, delay days, condition); campaign stats (sent, opened, clicked, converted); A/B test variant configuration |
| **Backend Tasks** | Create `DripCampaign`, `DripSequence`, `DripEnrollment` models; Celery task for sequence processing; trigger event detection; lead status change listener; unenrollment on unsubscribe/conversion; email template selection from existing EmailTemplate model |
| **Database Tasks** | `DripCampaign`: name, trigger_event (LEAD_CREATED/DEMO_BOOKED/DEMO_COMPLETED/NO_SHOW/PRICING_VISIT/INACTIVE_7D), is_active, created_at; `DripSequence`: campaign (FK), step_order, email_template (FK), delay_hours, subject_override, conditions (JSON); `DripEnrollment`: campaign (FK), lead (FK), current_step, next_send_at, status (ACTIVE/COMPLETED/UNENROLLED), started_at, completed_at |
| **API Tasks** | `GET /api/admin/drips/` (list); `POST /api/admin/drips/` (create); `PUT /api/admin/drips/:id/` (update); `GET /api/admin/drips/:id/stats/` (analytics); `POST /api/admin/drips/:id/activate/` (activate) |
| **Validation Rules** | Campaign: trigger_event required valid type; Sequence: at least 1 step; Delay: >= 1 hour; Email template: must exist and be active; Lead must not already be enrolled in same campaign (active) |
| **Acceptance Criteria** | Lead created → enrolled in Welcome drip: Day 0 (intro), Day 2 (case study), Day 5 (demo offer); Demo booked → enrolled in Pre-demo drip: Day -1 (preparation tips), Day -0 (confirmation); Demo completed → enrolled in Post-demo drip: Day +1 (thank you + resources), Day +3 (pricing breakdown), Day +7 (follow-up); Lead converts → auto-unenroll; admin creates new drips with any trigger; stats show conversion metrics |
| **Test Cases** | 1. Create lead → enrolled 2. Day 0 email sent 3. Day 2 email sent 4. Lead books demo → un-enroll from welcome, enroll in pre-demo 5. Demo completed → enroll post-demo 6. Lead unsubscribes → removed from all drips 7. A/B test variant → 50% split 8. Stats show per-campaign metrics |
| **Dependencies** | F-LEAD-001, F-EMAIL-001, F-NEWS-CAMPAIGN-001 |
| **Risks** | Complex trigger logic; race conditions on status changes; email fatigue/unsubscribes |
| **Estimated Complexity** | High (8-10 days) |

---

### Feature 44 — PWA & Offline Support

| Field | Detail |
|-------|--------|
| **Feature Number** | 44 |
| **Feature ID** | `F-PWA-001` |
| **Feature Name** | PWA & Offline Support |
| **Objective** | Convert the React app into a Progressive Web App with offline support, installability, and push notifications |
| **Business Value** | Mobile-installable app without App Store; offline access; push notification engagement |
| **Current Codebase Status** | Basic manifest.json exists (generated at build); no service worker |
| **Scope** | New feature |
| **Frontend Tasks** | Create service worker (Workbox via Vite PWA plugin); cache strategy: stale-while-revalidate for HTML, cache-first for assets, network-only for API; offline fallback page; install prompt; background sync for form submissions when offline; configure manifest.json (icons, splash screen, theme color, shortcuts) |
| **Backend Tasks** | Push notification subscription API; web push via VAPID keys; push notification sending integration with notification triggers (new article, newsletter, drip campaign) |
| **Database Tasks** | `PushSubscription`: user/visitor_id, endpoint, p256dh_key, auth_key, device_type, is_active, subscribed_at, unsubscribed_at |
| **API Tasks** | `POST /api/pwa/subscribe/` (save push subscription); `POST /api/pwa/unsubscribe/` (remove); `POST /api/admin/pwa/notify/` (send push to subscriber segment) |
| **Validation Rules** | Service worker: must be at root scope; Manifest: all required fields; Icons: all required sizes (192, 512); Push subscription: valid VAPID format |
| **Acceptance Criteria** | Site installable on mobile/desktop; offline access to cached pages; install prompt appears; push notification permission request; offline form submissions queued and synced; manifest with correct icons; score >90 on Lighthouse PWA audit |
| **Test Cases** | 1. Lighthouse PWA audit >90 2. Install → app icon on home screen 3. Go offline → cached pages load 4. Submit form offline → queued 5. Go online → queued form submitted 6. Push notification received 7. Unsubscribe → no more notifications 8. Splash screen on launch |
| **Dependencies** | F-ARCH-001, F-AUTH-001 |
| **Risks** | Service worker cache invalidation complexity; iOS PWA limitations; push notification browser support |
| **Estimated Complexity** | Medium (4-6 days) |

---

### Feature 45 — Multilingual Support (Hindi, Gujarati)

| Field | Detail |
|-------|--------|
| **Feature Number** | 45 |
| **Feature ID** | `F-I18N-001` |
| **Feature Name** | Multilingual Support (Hindi, Gujarati) |
| **Objective** | Add Hindi and Gujarati language support using Django i18n + React i18next for key conversion pages |
| **Business Value** | Indian MSME owners prefer regional languages; competitive advantage; broader reach |
| **Current Codebase Status** | English only; no i18n infrastructure |
| **Scope** | New feature |
| **Frontend Tasks** | Integrate i18next with React; create language switcher in nav; extract all UI strings to translation JSON files; translate: home, demo-booking, pricing, contact (priority pages); add hreflang meta tags; add language to URL pattern (`/os/hi/`, `/os/gu/` or subdomain); RTL consideration (not needed for Hindi/Gujarati) |
| **Backend Tasks** | Django model translations (django-modeltranslation); translated CMS content; translated FAQ items; translated articles; language-specific SEO meta; hreflang sitemap; language detection (Accept-Language header or geo-IP) |
| **Database Tasks** | Multilingual fields on key models (using django-modeltranslation or separate translation table); `Translation`: language_code, model_name, field_name, object_id, translated_text |
| **API Tasks** | `GET /api/i18n/:lang/` (translations for language); All public APIs accept `Accept-Language` header and return translated content |
| **Validation Rules** | Translation completeness: priority pages must be 100% translated before language goes live; Fallback: always fall back to English if translation missing |
| **Acceptance Criteria** | Language switcher in nav; switching language changes all UI text and content; URLs reflect language (`/os/hi/` or `/hi/os/`); hreflang tags present; SEO meta translated; priority pages (home, demo, pricing, contact) fully translated in Hindi and Gujarati; fallback to English works seamlessly |
| **Test Cases** | 1. Switch to Hindi → all UI text in Hindi 2. Navigate to pricing → content in Hindi 3. Switch to Gujarati → content in Gujarati 4. Missing translation → English fallback 5. hreflang tags in page source 6. Sitemap includes language alternates 7. Booking form placeholder text translated |
| **Dependencies** | All migration features (F-005 through F-015) |
| **Risks** | Translation quality and maintenance; content freshness across languages; URL structure decision (subdomain vs path vs param); SEO impact of multilingual |
| **Estimated Complexity** | Very High (12-15 days) |

---

### Feature 46 — Social Media Integration & Share

| Field | Detail |
|-------|--------|
| **Feature Number** | 46 |
| **Feature ID** | `F-SOCIAL-001` |
| **Feature Name** | Social Media Integration & Social Share |
| **Objective** | Add social sharing buttons to articles and resources, and embed social proof from LinkedIn/X reviews |
| **Business Value** | Content amplification; social proof from real platforms; increased referral traffic |
| **Current Codebase Status** | Footer social icons (LinkedIn, X, YouTube) — static links only |
| **Scope** | New feature |
| **Frontend Tasks** | Create `SocialShare` component (article detail, resource page: share to LinkedIn, X/Twitter, WhatsApp, email, copy link); share counts display; Open Graph / Twitter Card meta verified; `SocialProof` widget (embed recent LinkedIn/X posts or reviews) |
| **Backend Tasks** | Social link management in admin; social share tracking for analytics; optional: LinkedIn/X API integration for automated posting |
| **Database Tasks** | `SocialLink`: platform, url, display_order, is_active; `SocialShare`: content_type, content_id, platform, shared_at (tracking for analytics) |
| **API Tasks** | `GET /api/social/links/` (active social links); `POST /api/social/share/` (track share event) |
| **Validation Rules** | Social URL: valid URL per platform; Share tracking: rate limited to prevent inflation |
| **Acceptance Criteria** | Share buttons on each article detail page; WhatsApp share pre-fills message; copy link copies to clipboard with toast; share counts tracked; social links in footer configurable from admin; OG tags verified for rich preview on LinkedIn/Twitter |
| **Test Cases** | 1. Click LinkedIn share → opens LinkedIn share dialog with URL + title 2. Click WhatsApp → opens WhatsApp with prefilled text 3. Copy link → clipboard copied, toast shown 4. Share count increments 5. Update social link in admin → footer updated |
| **Dependencies** | F-MIG-NEWS-001, F-ARCH-001 |
| **Risks** | Platform API changes break share dialogs; share count accuracy (client-side only) |
| **Estimated Complexity** | Low-Medium (2-3 days) |

---

### Feature 47 — Site Settings & Configuration

| Field | Detail |
|-------|--------|
| **Feature Number** | 47 |
| **Feature ID** | `F-SETTINGS-001` |
| **Feature Name** | Site Settings & Configuration |
| **Objective** | Build centralized site settings admin for global configuration: company info, contact details, social links, branding, email templates, maintenance mode |
| **Business Value** | Admin-controlled site configuration; no deployment for config changes |
| **Current Codebase Status** | Company info in site.json (phone, email, location); form contact uses hardcoded values |
| **Scope** | New feature |
| **Frontend Tasks** | Create `SiteSettings` admin page (tabbed interface: General, Contact, Branding, Email, Social, Maintenance); General tab: site name, tagline, description, Google Analytics ID; Contact tab: phone, email, WhatsApp, address; Branding tab: logo upload, favicon upload, primary/secondary colors; Email tab: SMTP config, from name, from email; Social tab: LinkedIn, X, YouTube URLs; Maintenance tab: maintenance mode toggle, maintenance message, allowed IPs |
| **Backend Tasks** | Extend `SiteSetting` model; create API for all settings; update all site references to use dynamic settings; cache settings in Redis; create maintenance mode middleware |
| **Database Tasks** | Update `SiteSetting`: add group, input_type (TEXT/TEXTAREA/NUMBER/BOOLEAN/SELECT/IMAGE/URL/COLOR/JSON), options (JSON for select), is_public (boolean), validation_rules (JSON) |
| **API Tasks** | `GET /api/admin/settings/` (all settings grouped); `PUT /api/admin/settings/` (batch update); `GET /api/settings/public/` (public settings for frontend) |
| **Validation Rules** | Email: valid format; Phone: valid format; URL: valid URL; Logo/Favicon: max 2MB, png/svg; Colors: valid hex/oklch; Maintenance IPs: valid CIDR notation |
| **Acceptance Criteria** | All site info fetched from settings API; admin updates reflect across site without deploy; maintenance mode blocks non-admin access with custom message; contact info on all pages comes from settings; logo/favicon uploadable; email sender configurable; settings cached for performance |
| **Test Cases** | 1. Change phone in admin → all pages reflect 2. Enable maintenance → frontend shows maintenance page 3. Admin IP → still accesses site 4. Upload new logo → nav updates 5. Change email sender → test email from new sender 6. Cache hit: 1000 requests < 5ms |
| **Dependencies** | F-ARCH-001, F-ADMIN-001, F-AUTH-001 |
| **Risks** | Caching stale settings; maintenance mode accidentally blocking all traffic |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 48 — Data Export & Backup System

| Field | Detail |
|-------|--------|
| **Feature Number** | 48 |
| **Feature ID** | `F-BACKUP-001` |
| **Feature Name** | Data Export & Backup System |
| **Objective** | Implement automated database backups, data export for admin, and lead/contact data export in CSV format |
| **Business Value** | Data safety; compliance; customer data portability (DPDP Act 2023 requirement) |
| **Current Codebase Status** | No backup system; no data export capability |
| **Scope** | New feature |
| **Frontend Tasks** | Create `DataExport` page in admin (export types: leads full export, leads filtered export, demo bookings export, newsletter subscribers export, analytics data export; select date range; select fields; format: CSV/JSON; download or email export); backup status dashboard (last backup time, size, status) |
| **Backend Tasks** | PostgreSQL backup (pg_dump) via Celery beat (daily); backup rotation (keep 7 daily, 4 weekly, 3 monthly); backup encryption; S3/cloud storage upload; export API with streaming CSV; DPDP Act data portability endpoint for customer data requests |
| **Database Tasks** | `BackupRecord`: backup_type (FULL/INCREMENTAL), file_path, file_size, status (RUNNING/COMPLETED/FAILED), started_at, completed_at, error_message; `DataExport`: export_type, filters (JSON), requested_by (FK), file_path, file_size, format, status, expires_at (72 hour), created_at |
| **API Tasks** | `POST /api/admin/exports/` (create export job); `GET /api/admin/exports/` (list); `GET /api/admin/exports/:id/download/` (download); `GET /api/admin/backups/` (status); `POST /api/admin/backups/trigger/` (manual backup); `POST /api/data-portability/request/` (DPDP Act: customer data export) |
| **Validation Rules** | Export: valid export_type, max 365 day range, max 100,000 records per export; Backup: must complete within 60 minutes; Storage: secure, encrypted at rest |
| **Acceptance Criteria** | Admin exports leads as CSV with selected fields and date range; backup runs daily automatically; backup dashboard shows status; failed backups alert admin; exports expire after 72 hours; DPDP Act data request creates export of all customer data |
| **Test Cases** | 1. Export leads for last 30 days → CSV downloaded with correct fields 2. Daily backup runs → record created 3. Backup fails → error logged 4. Manual backup trigger → runs immediately 5. Export expires after 72h → download unavailable 6. DPDP request → all customer data exported |
| **Dependencies** | F-LEAD-001, F-AUTH-001, F-ADMIN-001 |
| **Risks** | Backup storage costs; large export file generation timeout; data privacy in exports |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 49 — A/B Testing System

| Field | Detail |
|-------|--------|
| **Feature Number** | 49 |
| **Feature ID** | `F-ABTEST-001` |
| **Feature Name** | A/B Testing System |
| **Objective** | Build A/B testing framework for hero headlines, CTAs, pricing display, and landing pages |
| **Business Value** | Data-driven optimization; improve conversion rate through experimentation |
| **Current Codebase Status** | Not present |
| **Scope** | New feature |
| **Frontend Tasks** | Create A/B test provider context; variant assignment (cookie-based, 50/50 split default); variant rendering components; test result tracking (variant → CTA click, form submit, demo booking); admin test configuration (test name, variants, target pages, goals, sample size, confidence level) |
| **Backend Tasks** | Create `ABTest`, `ABTestVariant`, `ABTestImpression`, `ABTestConversion` models; variant assignment API; results calculation (conversion rate, uplift, statistical significance via chi-squared test); test auto-stopping when significance reached |
| **Database Tasks** | `ABTest`: name, description, target_page_slugs, status (DRAFT/RUNNING/PAUSED/COMPLETED), started_at, ended_at, min_sample_size, confidence_threshold; `ABTestVariant`: test (FK), variant_key (control/variant_a/variant_b), config (JSON: hero headline, CTA text, color, etc.), traffic_percentage; `ABTestImpression`: test (FK), variant (FK), visitor_id, page_url, created_at; `ABTestConversion`: test (FK), variant (FK), visitor_id, conversion_type (CTA_CLICK/FORM_SUBMIT/DEMO_BOOKED), created_at |
| **API Tasks** | `GET /api/ab-test/active/` (active tests for current page with variant assignment); `POST /api/ab-test/impression/` (record impression); `POST /api/ab-test/conversion/` (record conversion); `GET /api/admin/ab-tests/` (list); `POST /api/admin/ab-tests/` (create); `GET /api/admin/ab-tests/:id/results/` (live results) |
| **Validation Rules** | Test: requires at least 2 variants; Total traffic must equal 100%; Goal: valid conversion type; Results: only show significance after min_sample_size reached |
| **Acceptance Criteria** | Admin creates A/B test with 2 headline variants on home page; visitors randomly assigned variant; CTA click tracked per variant; results dashboard shows conversion rate and significance; test auto-completes when significance reached; test can be paused/resumed; no SEO impact (canonical URL unchanged) |
| **Test Cases** | 1. Create test → visitors see variant A or B 2. Refresh page → same variant (cookie) 3. CTA click tracked 4. Results show variant A: 3.2%, variant B: 4.1%, uplift +28%, significant 5. Auto-stop when significant 6. Paused test → all see control 7. Completed test → control (winner) shown to all |
| **Dependencies** | F-CMS-HERO-001, F-LEAD-001 |
| **Risks** | Cookie-based assignment vs SEO (Googlebot should see control); statistical significance complexity; test duration too short for meaningful results |
| **Estimated Complexity** | High (8-10 days) |

---

### Feature 50 — Page Speed & Performance Optimization

| Field | Detail |
|-------|--------|
| **Feature Number** | 50 |
| **Feature ID** | `F-PERF-001` |
| **Feature Name** | Page Speed & Performance Optimization |
| **Objective** | Optimize Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1), implement code splitting, image optimization, CDN, and lazy loading |
| **Business Value** | SEO ranking factor; improved user experience; lower bounce rate |
| **Current Codebase Status** | Current static site is performant (~13KB gzipped); React app will be larger and needs optimization |
| **Scope** | Enhancement |
| **Frontend Tasks** | Configure Vite code splitting (route-based + component lazy loading); implement `React.lazy` + `Suspense` for below-fold sections; configure image component with lazy loading, WebP/AVIF, responsive srcset; implement font loading strategy (font-display: swap); inline critical CSS; defer non-critical scripts; implement resource hints (preload, prefetch, preconnect); measure and optimize bundle sizes; tree-shaking verification |
| **Backend Tasks** | Configure CDN for static assets and media; enable GZip/Brotli in Django (Whitenoise or nginx); implement ETag and Last-Modified headers; database query optimization (select_related, prefetch_related, N+1 detection); Redis caching for frequent queries; database connection pooling (pgbouncer); API response compression |
| **Database Tasks** | Query optimization indexes: add composite indexes for frequent filter/sort patterns; analyze slow query log; configure PostgreSQL shared_buffers, work_mem for workload |
| **API Tasks** | `GET /api/admin/performance/` (Web Vitals dashboard from collected metrics); Cache headers on all API responses |
| **Validation Rules** | LCP < 2.5s; FID < 100ms; CLS < 0.1; Total bundle < 200KB gzipped; API responses < 200ms p95; Lighthouse Performance > 85 |
| **Acceptance Criteria** | Lighthouse Performance > 85 on all pages; LCP under 2.5s on 3G; CLS under 0.1; route transitions < 200ms; API p95 < 200ms; bundle sizes tracked and alerted if growth > 20%; images served in WebP/AVIF with lazy loading; CDN serving /static/ and /media/ |
| **Test Cases** | 1. Lighthouse Performance audit >85 2. Web Vitals LCP < 2.5s 3. Route change loads new chunk <200ms 4. Image loads lazy (verified in Network tab) 5. API /api/articles/ <200ms 6. Bundle size <200KB gzipped 7. CDN headers present on assets 8. ETag/Last-Modified headers on API |
| **Dependencies** | All features (optimization touches everything) |
| **Risks** | Over-optimization of non-critical paths; CDN misconfiguration; code splitting breaking SSR compatibility |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 51 — Accessibility Final Pass

| Field | Detail |
|-------|--------|
| **Feature Number** | 51 |
| **Feature ID** | `F-A11Y-001` |
| **Feature Name** | Accessibility Final Audit & Remediation |
| **Objective** | Perform full WCAG 2.2 AA audit on React app, fix all issues, integrate axe-core into CI pipeline |
| **Business Value** | Legal compliance; all-user inclusive; SEO benefit; brand values |
| **Current Codebase Status** | Static site is WCAG 2.2 AA compliant (contrast, skip-link, focus, aria); React port may introduce new issues |
| **Scope** | Quality assurance |
| **Frontend Tasks** | Run axe-core on all routes (automated); conduct manual keyboard testing on all interactive components; verify screen reader output (NVDA/VoiceOver); fix: ensure all form inputs have associated labels; ensure all icon-only buttons have aria-labels; ensure carousel/slider has pause/stop controls; ensure modals trap focus; ensure toast notifications are announced; ensure dynamic content updates use aria-live regions; ensure color is not the only visual indicator; ensure touch targets are at least 44x44px; create accessibility statement page |
| **Backend Tasks** | Ensure API error responses include human-readable messages; ensure all images have alt text in API responses |
| **Database Tasks** | None |
| **API Tasks** | None |
| **Validation Rules** | WCAG 2.2 AA: all 50 Level A + AA success criteria passed; axe-core: zero violations on all routes; Keyboard: all functionality operable; Screen reader: all content announced correctly |
| **Acceptance Criteria** | axe-core audit: 0 violations on all 16 routes + admin; keyboard: every interactive element reachable and operable; screen reader: all content announced logically; accessibility statement page published; CI pipeline blocks PRs with a11y violations; Lighthouse Accessibility > 95 |
| **Test Cases** | 1. axe-core scan all routes → 0 violations 2. Tab through entire page → all interactive elements reachable 3. Screen reader announces page title → navigation → main content → footer 4. Modal opens → focus trapped 5. Form error → announced to screen reader 6. Touch targets >44x44px on mobile 7. Color contrast verified for all text 8. Accessibility statement page exists |
| **Dependencies** | All features (comprehensive audit across entire app) |
| **Risks** | Third-party components may have inherent a11y issues; time-intensive manual testing |
| **Estimated Complexity** | High (8-10 days) |

---

### Feature 52 — SEO Final Pass & E-E-A-T Compliance

| Field | Detail |
|-------|--------|
| **Feature Number** | 52 |
| **Feature ID** | `F-SEO-FINAL-001` |
| **Feature Name** | SEO Final Audit & E-E-A-T Compliance |
| **Objective** | Perform full SEO audit, implement E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals, structured data completeness, and Google Search Console integration |
| **Business Value** | Search ranking; organic traffic growth; E-E-A-T signals for Google ranking |
| **Current Codebase Status** | SEO foundation exists (titles, descriptions, OG, structured data, sitemap); needs enhancement for React app and E-E-A-T |
| **Scope** | Quality assurance |
| **Frontend Tasks** | Ensure all pages have unique title + meta description (verify via react-helmet-async); implement breadcrumb structured data on all pages (dynamic from route); implement Article structured data on blog posts; implement FAQ structured data on FAQ page; implement LocalBusiness structured data on contact page; add author bio pages with structured data; add organization "About" page with E-E-A-T signals; verify all OG/Twitter images work; add article published/modified dates prominently; add review/rating structured data on testimonials |
| **Backend Tasks** | Verify XML sitemap includes all dynamic content; ensure canonical URLs correct; ensure hreflang if multilingual; set up Google Search Console API integration for indexing status; implement redirect map from old static URLs; create 301 redirects for all legacy routes |
| **Database Tasks** | Ensure all models have SEO meta fields; ensure author model has bio, social links, credentials |
| **API Tasks** | `GET /api/sitemap-dynamic.xml` (updated); `GET /api/admin/seo/audit/` (automated audit score) |
| **Validation Rules** | All pages: unique title (30-60 chars), unique description (120-160 chars), canonical URL, OG tags; No duplicate content; No broken internal links; All images have alt text; Structured data validates via Google Rich Results Test |
| **Acceptance Criteria** | Automated SEO audit > 90/100; Google Rich Results Test passes for all structured data types; sitemap includes all pages; all canonical URLs correct; noindex correctly applied to admin/non-public pages; breadcrumbs on all pages; E-E-A-T: author pages with bios, about page with company details, privacy/terms accessible, contact info prominent, testimonials with structured data |
| **Test Cases** | 1. SEO audit score > 90 2. Rich Results Test: FAQ → passes 3. Rich Results Test: Article → passes 4. Rich Results Test: LocalBusiness → passes 5. Breadcrumb JSON-LD on all pages 6. Sitemap contains all URLs 7. Canonical matches actual URL 8. 301 redirects work for legacy URLs 9. Author pages accessible with structured data 10. About page has organization schema |
| **Dependencies** | F-SEO-001, F-SITEMAP-001, All migration features |
| **Risks** | Structured data errors causing manual actions in GSC; E-E-A-T is subjective, hard to measure |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 53 — E2E Test Suite

| Field | Detail |
|-------|--------|
| **Feature Number** | 53 |
| **Feature ID** | `F-TEST-E2E-001` |
| **Feature Name** | End-to-End Test Suite |
| **Objective** | Build comprehensive Playwright E2E test suite covering all critical user flows, admin workflows, and cross-browser testing |
| **Business Value** | Prevents regressions; confidence in releases; reduces manual QA |
| **Current Codebase Status** | Existing Playwright tests for static site (4 browser projects); needs complete rewrite for React app |
| **Scope** | New |
| **Frontend Tasks** | None (test code only) |
| **Backend Tasks** | Create test fixtures and factories; create test database with seed data; create API test helpers |
| **Database Tasks** | Test database configuration (in-memory SQLite or separate test PostgreSQL); database seeding scripts |
| **API Tasks** | None (tests consume API) |
| **Test Cases (test code)** | **Public User Flows:** 1. Browse home → navigate to pricing → open ROI calculator → book demo 2. Browse features → navigate to product overview → contact form 3. Read blog article → subscribe to newsletter 4. Search FAQ → find answer → provide feedback 5. Download resource → submit gate form 6. Book meeting → select type → choose slot → confirm 7. Cookie consent banner → accept → verify analytics loaded 8. Mobile navigation → hamburger → drawer → navigate **Admin Flows:** 9. Login → dashboard loads → create blog article → publish 10. View leads → filter by source → update status → add note 11. Create newsletter campaign → add article → send test → schedule 12. Manage users → invite → accept → login 13. Create CMS page → add sections → publish 14. Update site settings → verify on frontend 15. Export leads CSV → download and verify 16. Payment flow → create order → process test payment **Cross-Browser:** 17. All flows on Chrome, Firefox, Safari, Edge |
| **Validation Rules** | All tests must pass in CI; No flaky tests (retry max 2x); Test coverage: 80% of critical user flows; Tests run parallel (4 workers); Complete suite < 15 minutes |
| **Acceptance Criteria** | 30+ E2E test scenarios covering all critical flows; tests run in CI on every PR; visual regression tests for key pages; API integration tests for all endpoints; tests run in <15 minutes total; test reports generated with screenshots on failure |
| **Dependencies** | All features (tests cover everything) |
| **Risks** | Test maintenance overhead; flaky tests due to timing; test data isolation |
| **Estimated Complexity** | High (10-14 days) |

---

### Feature 54 — Unit & Integration Test Suite

| Field | Detail |
|-------|--------|
| **Feature Number** | 54 |
| **Feature ID** | `F-TEST-UNIT-001` |
| **Feature Name** | Unit & Integration Test Suite (80% Coverage) |
| **Objective** | Achieve 80%+ code coverage with unit tests for frontend components/hooks and integration tests for backend APIs |
| **Business Value** | Code quality; prevents regressions; enables confident refactoring |
| **Current Codebase Status** | No unit or integration tests exist |
| **Scope** | New |
| **Frontend Tasks** | Set up Vitest for React component testing; set up React Testing Library; unit tests for: all shared components (Button, Card, Input, Modal, etc.), all custom hooks (useTypewriter, useMouseGlow, useCardTilt, useParallax, useSearch), utility functions (validation, formatting, date); integration tests for: form submission flows, search functionality, calendar widget interaction |
| **Backend Tasks** | Set up pytest + pytest-django; set up factory_boy for test data; unit tests for: all API endpoints (GET/POST/PUT/DELETE), all model methods, business logic services (lead scoring, demo booking availability, payment calculation, email sending), validation rules; integration tests for: API → database flow, email sending, payment integration, search indexing |
| **Database Tasks** | Test database configuration; factory classes for all models; test data seeding |
| **API Tasks** | None (tests consume/exercise APIs) |
| **Validation Rules** | Coverage: frontend >= 80% (statements), backend >= 80% (lines); All critical paths tested; No skipped tests in final suite; CI blocks merge if coverage drops |
| **Acceptance Criteria** | 80%+ coverage on frontend and backend; All components have basic render + interaction tests; All API endpoints have success + error case tests; All models have CRUD operation tests; All custom hooks tested; All form validation rules tested; Tests run < 5 minutes; CI reports coverage |
| **Test Cases** | (Meta: this feature IS the test suite — acceptance is measured by coverage and passing status) |
| **Dependencies** | All features (tests written alongside/reviewing each feature) |
| **Risks** | Coverage metric gaming (100% coverage ≠ bug-free); test maintenance burden; slow test suite |
| **Estimated Complexity** | Very High (15-20 days, spread across development) |

---

### Feature 55 — CI/CD Pipeline

| Field | Detail |
|-------|--------|
| **Feature Number** | 55 |
| **Feature ID** | `F-CICD-001` |
| **Feature Name** | CI/CD Pipeline (GitHub Actions) |
| **Objective** | Set up automated CI/CD pipeline: lint, test, build, deploy with environment gates and preview deployments |
| **Business Value** | Automated quality gates; faster, safer deployments; preview environments for review |
| **Current Codebase Status** | No CI/CD pipeline exists; manual build/deploy |
| **Scope** | New |
| **Frontend Tasks** | None (CI configuration) |
| **Backend Tasks** | None (CI configuration) |
| **Database Tasks** | None |
| **API Tasks** | None |
| **CI Pipeline Configuration** | Create `.github/workflows/ci.yml`: **Lint stage**: ESLint (frontend), stylelint, flake8/ruff (backend), Prettier format check; **Test stage**: Unit tests (frontend + backend), E2E tests (Playwright), coverage report upload; **Build stage**: Build React app (vite build), collect Django static files, Docker image build; **Security stage**: npm audit, pip audit, CodeQL analysis, Snyk scan; **Deploy stage**: Deploy to staging (auto on main), deploy to production (manual approval), preview deploy per PR |
| **Validation Rules** | All stages must pass before merge; Preview deploy URL posted as PR comment; Coverage must not decrease; Security audit must show 0 HIGH/CRITICAL; Docker image scan 0 CRITICAL |
| **Acceptance Criteria** | PR triggers lint + test + build + preview deploy; merge to main triggers deploy to staging; manual approval deploys to production; preview URL posted on PR; failed pipeline blocks merge; all stages complete < 20 minutes; deployment rollback one-click |
| **Test Cases** | 1. Open PR → pipeline triggers 2. Lint fails → pipeline fails 3. Tests fail → pipeline fails 4. Coverage drops → pipeline fails 5. All pass → preview URL posted 6. Merge → staging deployed 7. Manual approve → production deployed 8. Rollback → previous version deployed |
| **Dependencies** | F-ARCH-001, F-TEST-E2E-001, F-TEST-UNIT-001 |
| **Risks** | GitHub Actions minutes cost; Docker image build time; deployment failures in production |
| **Estimated Complexity** | Medium (3-5 days) |

---

### Feature 56 — Docker Compose Production Configuration

| Field | Detail |
|-------|--------|
| **Feature Number** | 56 |
| **Feature ID** | `F-DOCKER-PROD-001` |
| **Feature Name** | Docker Compose Production Configuration |
| **Objective** | Create production-grade Docker Compose configuration with all services, volume management, health checks, and resource limits |
| **Business Value** | One-command production deployment; consistent environments; easy scaling |
| **Current Codebase Status** | Dockerfile for static site only; `docker-compose.yml` for single nginx container |
| **Scope** | New |
| **Frontend Tasks** | Create production Dockerfile for React app (multi-stage: build with Vite, serve with nginx); configure nginx for React SPA (try_files fallback, API proxy_pass) |
| **Backend Tasks** | Create production Dockerfile for Django (multi-stage: build deps, collect static, run with Gunicorn); configure Gunicorn (workers, timeout, log config); create Dockerfile for Celery worker and beat |
| **Database Tasks** | PostgreSQL container configuration (volume, health check, init scripts) |
| **Services Configuration** | `docker-compose.prod.yml`: **nginx**: React static files + API reverse proxy, port 80/443, SSL termination (Let's Encrypt via Traefik or Caddy); **frontend**: serve via nginx (separate or combined); **backend**: Gunicorn + uvicorn workers, scaling (2+ replicas); **celery-worker**: async task processing; **celery-beat**: scheduled tasks; **postgres**: PostgreSQL 16 with persistent volume, resource limits; **redis**: Redis 7 with persistent volume; **Optional: traefik/caddy**: reverse proxy with auto-SSL |
| **Validation Rules** | All services health checks pass; Volumes persist across restarts; Resource limits enforced; No hardcoded secrets (use Docker secrets or env_file); Non-root users for all services |
| **Acceptance Criteria** | `docker compose -f docker-compose.prod.yml up -d` starts all services; health checks all passing; site accessible at configured domain; restart survives with data intact; resource limits prevent runaway processes; logs stream to stdout/stderr; zero-downtime rolling updates |
| **Test Cases** | 1. Compose up → all services healthy 2. Docker compose down + up → data persisted 3. Kill backend container → auto-restart 4. Resource limit test → container throttled 5. Logs visible via docker compose logs 6. Secrets not visible in docker inspect |
| **Dependencies** | F-ARCH-001, F-PERF-001 |
| **Risks** | Docker networking complexity; SSL certificate automation; volume permission issues on Linux hosts |
| **Estimated Complexity** | Medium-High (5-7 days) |

---

### Feature 57 — Nginx Production Configuration

| Field | Detail |
|-------|--------|
| **Feature Number** | 57 |
| **Feature ID** | `F-NGINX-PROD-001` |
| **Feature Name** | Nginx Production Configuration |
| **Objective** | Create production Nginx config for React SPA + Django API reverse proxy with SSL, caching, rate limiting, and WAF rules |
| **Business Value** | Production-grade web serving; security; performance |
| **Current Codebase Status** | Nginx config for static site only (no API proxy, no SSL termination) |
| **Scope** | New |
| **Frontend Tasks** | None |
| **Backend Tasks** | None |
| **Nginx Configuration** | Create `nginx.prod.conf`: **Upstream**: Django backend pool (least_conn), Celery flower (optional); **SSL**: HTTP/2, TLS 1.3, OCSP stapling, strong cipher suite; **SPA**: try_files with cache busting for hashed assets; **API Proxy**: `/api/` → Django, WebSocket support, timeouts, buffering; **Admin**: `/admin/` → Django with IP allowlist (optional); **Rate Limiting**: 100 req/s per IP for API (burst 50), 10 req/s for auth endpoints; **Caching**: micro-caching for GET API (1s), long cache for static assets (1y with content hash), no cache for HTML; **Security**: CSP (strict), HSTS (2 year), X-Frame DENY, X-Content-Type nosniff, ModSecurity/WAF rules (optional), bot blocking, request size limits; **Gzip/Brotli**: level 6, all text types; **Logging**: JSON format, separate access/error logs per service; **Health**: `/health` returns 200 + component statuses |
| **Validation Rules** | SSL Labs grade A+; Security headers all present; Rate limiting functional; CSP valid; Health endpoint returns all upstream statuses |
| **Acceptance Criteria** | SSL Labs A+ rating; all security headers verified; rate limiting blocks excessive requests; API proxy correctly forwards requests; SPA fallback works for client-side routes; static assets cached with content hash; health endpoint reports all services; JSON access logs; 404 page served for unknown routes |
| **Test Cases** | 1. SSL Labs scan → A+ 2. curl -I → all security headers 3. 100 requests/1s → rate limited 4. /api/health → proxied to Django 5. /os/pricing/ → served by React SPA 6. /assets/main.abc123.js → cached 1 year 7. /nonexistent → 404 page 8. JSON access log format 9. WebSocket upgrade works |
| **Dependencies** | F-DOCKER-PROD-001 |
| **Risks** | CSP too strict breaking admin; Rate limiting too aggressive for legitimate use; SSL certificate renewal automation |
| **Estimated Complexity** | Medium (3-4 days) |

---

### Feature 58 — Content Migration Script

| Field | Detail |
|-------|--------|
| **Feature Number** | 58 |
| **Feature ID** | `F-MIGRATE-DATA-001` |
| **Feature Name** | Content Migration Script |
| **Objective** | Build automated migration script to extract all current content from static HTML pages and seed the PostgreSQL database |
| **Business Value** | One-time migration for launch; preserves all current content; no manual re-entry |
| **Current Codebase Status** | All content is hardcoded in 16 HTML pages |
| **Scope** | One-time migration |
| **Frontend Tasks** | None |
| **Backend Tasks** | Create Django management command `migrate_static_content`; parse each HTML page, extract content sections; map to database models: FAQ items (42 items from faq.html), Articles (6 articles from newsletter.html), Pricing plans (3 plans from pricing.html), Features (11 feature sections from features.html), Testimonials (3 from home/why-optiflow), CMS pages (privacy, terms, competitive-positioning sections), Resources (6 from newsletter.html), Site settings (phone, email, location from placeholders); create data validation and consistency checks during migration; generate migration report (migrated/failed/skipped) |
| **Database Tasks** | All models must exist before migration runs |
| **API Tasks** | None |
| **Validation Rules** | Migration must be idempotent (can re-run safely); Failed items logged with reason; Migrated items count must match expected count per content type; Data integrity: all foreign keys, content lengths, slugs validated post-migration |
| **Acceptance Criteria** | Single command `python manage.py migrate_static_content` seeds entire database; all 42 FAQ items migrated with correct categories; all 6 articles migrated with categories; 3 pricing plans migrated; 11 feature sections migrated; 3 testimonials migrated; privacy policy and terms pages migrated; 6 resources migrated; site settings populated; migration produces report; re-running is safe (skips existing) |
| **Test Cases** | 1. Run migration → 0 errors 2. Verify FAQ count = 42 3. Verify article count = 6 4. Verify testimonial count = 3 5. Verify pricing plan count = 3 6. Re-run migration → 0 new items created 7. Content integrity check: no empty questions/answers 8. Category mapping correct 9. Report generated |
| **Dependencies** | All models from all features |
| **Risks** | HTML parsing fragile (inconsistent markup); Content mapping ambiguity; Large HTML files may cause parsing errors |
| **Estimated Complexity** | Medium (4-6 days) |

---

### Feature 59 — Final QA & Pre-Launch Checklist

| Field | Detail |
|-------|--------|
| **Feature Number** | 59 |
| **Feature ID** | `F-QA-FINAL-001` |
| **Feature Name** | Final QA & Pre-Launch Checklist |
| **Objective** | Comprehensive pre-launch validation: visual regression, cross-browser, performance, security, and compliance verification |
| **Business Value** | Launch confidence; zero critical bugs; production readiness |
| **Current Codebase Status** | Current static site is production-ready (99/100 deployment audit); React+Django rebuild needs full QA |
| **Scope** | Quality assurance |
| **Tasks (all disciplines)** | **Visual Regression:** Side-by-side screenshot comparison of original static site vs new React site for all 16 pages at 5 breakpoints; document acceptable differences **Cross-Browser:** Test on Chrome 120+, Firefox 120+, Safari 17+, Edge 120+, mobile Chrome/Safari **Performance:** Lighthouse audit all pages (Perf >80, A11y >95, Best Practices >80, SEO >90); Web Vitals all pages **Security:** OWASP Top 10 scan (ZAP or Burp); dependency vulnerability audit; CSP validation; penetration test **Load Testing:** Apache Bench or k6: 100 concurrent users for 60s on critical pages, verify p95 < 500ms **Compliance:** DPDP Act 2023 compliance checklist (consent, data access, data deletion, breach notification, privacy policy, cookie consent) **Broken Links:** Crawl entire site, verify 0 broken internal links **Form Flows:** Test all 5 submission flows end-to-end (demo, contact, newsletter, meeting, payment) **Email Flows:** Test all automated email triggers (confirmation, notification, reminder, drip) **Data Integrity:** Verify all database relations, no orphaned records, indexes present |
| **Validation Rules** | 0 CRITICAL bugs; 0 HIGH bugs; Max 5 MEDIUM bugs (documented with workaround); All Lighthouse targets met; OWASP scan: 0 HIGH; Load test: no errors, p95 < 500ms |
| **Acceptance Criteria** | All checklist items completed and passed; bug tracker shows 0 CRITICAL/HIGH; performance targets met; security scan clean; compliance checklist signed off; stakeholder sign-off obtained |
| **Test Cases** | This feature IS the QA process — test cases are the checklist items above. Each item must produce a PASS/FAIL result with evidence (screenshot, report, log). |
| **Dependencies** | All features (this is the final validation) |
| **Risks** | Last-minute critical bugs delay launch; Visual regression may require design sign-off on acceptable differences |
| **Estimated Complexity** | High (10-14 days) |

---

### Feature 60 — Production Deployment & Go-Live

| Field | Detail |
|-------|--------|
| **Feature Number** | 60 |
| **Feature ID** | `F-DEPLOY-FINAL-001` |
| **Feature Name** | Production Deployment & Go-Live |
| **Objective** | Execute production deployment, DNS cutover, SSL setup, monitoring activation, and launch-day support |
| **Business Value** | Successful launch; zero downtime; monitoring from day one |
| **Current Codebase Status** | Current static site deployed on multiple platforms; will be replaced by new deployment |
| **Scope** | Deployment |
| **Tasks (all disciplines)** | **Infrastructure:** Provision production VPS/server; configure DNS (A record, CNAME www); set up SSL (Let's Encrypt auto-renewal via Traefik/Caddy or Certbot); configure firewall (UFW: allow 80/443/22); set up swap space **Deployment:** Docker compose production deployment; verify all services healthy; configure automatic container restart; set up log rotation (logrotate); configure backup cron (daily DB dump to S3/cloud) **Monitoring:** Set up Uptime Robot or similar (5-minute checks on /health); set up Sentry project for error tracking; configure alerting (email/Slack for errors, downtime, high resource usage); set up Grafana + Prometheus (optional, for detailed metrics) **Launch Day:** Deploy to production; verify all pages load; smoke test critical flows (home→pricing→demo booking); verify form submissions; verify email sending; verify WhatsApp integration; verify payment gateway (test mode → live mode switch); verify analytics tracking; submit sitemap to Google Search Console; verify redirects from old site **Post-Launch:** 24-hour monitoring; hotfix deployment capability; performance monitoring for first 7 days; traffic spike handling plan |
| **Validation Rules** | DNS propagation verified; SSL valid and auto-renewing; All health checks green; Backup verified (restore test); Monitoring alerts configured and tested; Smoke tests pass on production |
| **Acceptance Criteria** | Site accessible at `https://os.optiflow.co.in`; SSL valid (A+ rating); all pages load without errors; forms submit successfully; emails delivered; payment gateway processes test transaction; analytics tracking data flowing; backups running; monitoring dashboard operational; rollback plan tested |
| **Test Cases** | 1. DNS resolves to correct IP 2. SSL Labs A+ 3. /health returns 200 4. All 16 pages load 5. Demo booking form → email received 6. Newsletter signup → confirmation email 7. Test payment → Razorpay processes 8. Plausible tracking data visible 9. Sentry receiving errors 10. Backup restore test successful 11. Redirects from old URLs work 12. Sitemap submitted to GSC |
| **Dependencies** | F-QA-FINAL-001, F-DOCKER-PROD-001, F-NGINX-PROD-001 |
| **Risks** | DNS propagation delay; SSL issuance failure; production environment differences from staging; zero-downtime deployment complexity; traffic spike on launch day |
| **Estimated Complexity** | Medium-High (7-10 days) |

---

## Part G — Recommended Implementation Order

### Phase 1: Foundation (Features 01-04, ~12-16 days)
1. **F-ARCH-001** — Project Architecture & Monorepo Setup
2. **F-DS-001** — Design System Foundation
3. **F-LAY-001** — Shared Layout Components
4. **F-ROUTE-001** — Routing & Page Shell

### Phase 2: Page Migration (Features 05-15, ~52-73 days)
5. **F-MIG-HOME-001** — Home Page Migration (highest priority)
6. **F-MIG-PRICING-001** — Pricing Page Migration
7. **F-MIG-DEMO-001** — Demo Booking Page Migration
8. **F-MIG-NEWS-001** — Newsletter/Blog System
9. **F-MIG-FAQ-001** — FAQ Page Migration
10. **F-MIG-CONTACT-001** — Contact Page Migration
11. **F-MIG-PROD-001** — Product Overview Page Migration
12. **F-MIG-FEAT-001** — Features Page Migration
13. **F-MIG-PS-WHY-001** — Problem Solutions & Why Optiflow
14. **F-MIG-FSCP-001** — Feature Showcase & Competitive Positioning
15. **F-MIG-LEGAL-001** — Legal Pages & CMS System

### Phase 3: Authentication & Admin (Features 16-20, 34-35, ~33-39 days)
16. **F-AUTH-001** — User Authentication & Authorization
17. **F-ADMIN-USERS-001** — Admin User Management
18. **F-ADMIN-001** — Admin Dashboard
19. **F-LEAD-001** — Lead Management System
20. **F-DYN-NAV-001** — Dynamic Navigation
21. **F-DYN-TEST-001** — Dynamic Testimonial System
22. **F-CMS-HERO-001** — Hero Section CMS

### Phase 4: CMS & Content (Features 21-23, ~34-42 days)
23. **F-CMS-BLOG-001** — Blog Editor
24. **F-CMS-PAGE-001** — Page Builder
25. **F-NEWS-CAMPAIGN-001** — Newsletter Campaign Management

### Phase 5: Business Features (Features 24-28, 40-43, ~36-49 days)
26. **F-EMAIL-001** — SMTP Email Integration
27. **F-WHATSAPP-001** — WhatsApp Integration
28. **F-SEARCH-001** — Site-Wide Search
29. **F-PAYMENT-001** — Payment Gateway Integration
30. **F-CALENDAR-001** — Advanced Demo Booking Calendar
31. **F-MEETING-001** — Meeting Booking System
32. **F-RESOURCE-001** — Resource Download Center
33. **F-CAREER-001** — Career Page & Resume Upload
34. **F-CHATBOT-001** — Rule-Based Chatbot
35. **F-DRIP-001** — Automated Email Drip Campaigns

### Phase 6: Security, Settings & Data (Features 30-31, 37-39, 47-48, ~21-28 days)
36. **F-COOKIE-001** — Cookie Consent Banner
37. **F-BANNER-001** — Announcement Banner
38. **F-SEC-FORM-001** — Form Rate Limiting & Spam Protection
39. **F-SEC-HARDEN-001** — Security Hardening
40. **F-OPS-LOG-001** — Logging & Monitoring
41. **F-SETTINGS-001** — Site Settings & Configuration
42. **F-BACKUP-001** — Data Export & Backup System

### Phase 7: SEO, Analytics & Optimization (Features 32-33, 36, 49-52, ~28-38 days)
43. **F-SEO-001** — SEO Management Dashboard
44. **F-SITEMAP-001** — Dynamic Sitemap & Robots.txt
45. **F-ANALYTICS-001** — Business Analytics Dashboard
46. **F-ABTEST-001** — A/B Testing System
47. **F-PERF-001** — Page Speed & Performance Optimization
48. **F-A11Y-001** — Accessibility Final Pass
49. **F-SEO-FINAL-001** — SEO Final Pass
50. **F-PWA-001** — PWA & Offline Support
51. **F-I18N-001** — Multilingual Support (Hindi, Gujarati)

### Phase 8: Testing & CI/CD (Features 53-55, ~23-34 days)
52. **F-CICD-001** — CI/CD Pipeline
53. **F-TEST-UNIT-001** — Unit & Integration Tests
54. **F-TEST-E2E-001** — E2E Test Suite

### Phase 9: Production (Features 56-60, ~29-45 days)
55. **F-DOCKER-PROD-001** — Docker Compose Production Config
56. **F-NGINX-PROD-001** — Nginx Production Config
57. **F-MIGRATE-DATA-001** — Content Migration Script
58. **F-SOCIAL-001** — Social Media Integration
59. **F-QA-FINAL-001** — Final QA & Pre-Launch Checklist
60. **F-DEPLOY-FINAL-001** — Production Deployment & Go-Live

**Total Estimated Time: 270-383 days (1-1.5 senior full-stack developers, or 4-6 months with 2-3 developers)**

---

## Part H — Risk Assessment

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| R-01 | Visual parity loss during migration | Medium | High | Continuous visual regression testing; per-section sign-off |
| R-02 | Django learning curve for frontend devs | Medium | Medium | Django training sessions; comprehensive docs |
| R-03 | Scope creep — too many features | High | High | Vertical slice discipline; MVP first (phases 1-3), then iterate |
| R-04 | Data loss during content migration | Medium | High | Backup original HTML; test migration on staging first; idempotent script |
| R-05 | Production deployment complexity | Medium | High | Test in staging 3x before production; rollback plan documented |
| R-06 | Third-party API changes (WhatsApp, Razorpay) | Medium | Medium | Abstract API calls behind service layer; version API integrations |
| R-07 | Performance regression from React SPA | Medium | Medium | Lighthouse benchmarks at each phase; bundle size budgets |
| R-08 | Security vulnerability in dependencies | High | Medium | Automated dependency scanning in CI; regular updates |
| R-09 | SEO traffic drop during migration | Medium | High | 301 redirects for all old URLs; maintain URL structure; gradual rollout |
| R-10 | Team bandwidth — some features may stall | High | High | Phase-based delivery; each phase is independently shippable |
| R-11 | PostgreSQL full-text search limitations | Low | Medium | English-only MVP; Elasticsearch as fallback for advanced needs |
| R-12 | WhatsApp Business API approval delays | Medium | Low | Start approval process early; have fallback (manual WhatsApp link) |

---

## Part I — Testing Strategy

### I.1 Testing Pyramid

```
         /\
        /E2E\         30+ scenarios
       /------\
      /  INT   \      100+ API integration tests
     /----------\
    /   UNIT     \    500+ unit tests (frontend + backend)
   /--------------\
```

### I.2 Testing Standards

| Standard | Target |
|----------|--------|
| Unit Test Coverage (Frontend) | 80%+ statements |
| Unit Test Coverage (Backend) | 80%+ lines |
| E2E Coverage | All critical user flows |
| Accessibility | 0 axe-core violations |
| Performance | Lighthouse > 80 Perf, > 95 A11y, > 80 Best Prac, > 90 SEO |
| Security | 0 HIGH/CRITICAL in dependency audit, OWASP scan |
| Visual Regression | 0 unintended visual changes vs original |
| Cross-Browser | Chrome, Firefox, Safari, Edge — all critical flows |

### I.3 Test Categories

1. **Unit Tests (Vitest + pytest):** Component rendering, hook behavior, utility functions, model methods, API validation, business logic
2. **Integration Tests (React Testing Library + pytest-django):** Form submission flows, API → database round-trips, authentication flow, search indexing and retrieval, payment flow simulation
3. **E2E Tests (Playwright):** Complete user journeys, cross-browser verification, mobile viewport flows, admin workflows, visual regression snapshots
4. **Accessibility Tests (axe-core):** Automated on every route, integrated into CI pipeline
5. **Performance Tests (Lighthouse CI):** Automated on every PR, blocks merge if targets not met
6. **Security Tests (npm audit, pip audit, CodeQL, ZAP):** Automated dependency scanning, static analysis, penetration testing

### I.4 Quality Gates

All gates must pass before code can be merged:

| Gate | Tool | Threshold |
|------|------|-----------|
| Lint | ESLint + stylelint + ruff | 0 errors, 0 warnings |
| Type Check | TypeScript (tsc) | 0 errors |
| Unit Tests | Vitest + pytest | All pass, coverage >= 80% |
| Build | Vite + Django collectstatic | Build succeeds |
| E2E | Playwright | All critical flows pass |
| A11y | axe-core | 0 violations |
| Performance | Lighthouse CI | Perf >= 80, A11y >= 95, BP >= 80, SEO >= 90 |
| Security | npm/pip audit + CodeQL | 0 HIGH/CRITICAL |

---

**End of WEBSITE_FEATURE_INVENTORY.md**

This document is the **single source of truth** for all future OptiFlow OS website development. Every implementation task must trace back to a feature in this inventory. No coding should begin without a completed feature specification from this document.
