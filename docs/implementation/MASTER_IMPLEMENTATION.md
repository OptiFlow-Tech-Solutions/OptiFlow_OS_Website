# OptiFlow OS — Master Implementation (SSOT)

> **Single Source of Truth.** Engineering blueprint, product backlog, feature inventory, roadmap, task tracker, progress tracker, and implementation guide — all in one file.
> **Last updated:** 2026-07-07 | **Current Phase:** 01-04 ✅, 07 partial, 05-06-08-09-10 ⬜

---

## 1. Engineering Baseline

| Dimension | Score | Grade | Target | Gap |
|-----------|-------|-------|--------|-----|
| **Overall Engineering** | **67** | C+ | **90** | +23 |
| Product | 45 | D | 85 | +40 |
| Frontend | 72 | B- | 90 | +18 |
| Backend | 35 | F | 75 | +40 |
| Database | 10 | F | 60 | +50 |
| API | 42 | F | 75 | +33 |
| Business Logic | 15 | F | 70 | +55 |
| UI/UX | 68 | C+ | 85 | +17 |
| Security | 58 | D+ | 85 | +27 |
| Performance | 78 | B | 90 | +12 |
| SEO | 72 | B- | 90 | +18 |
| Accessibility | 62 | D | 85 | +23 |
| DevOps | 65 | C | 85 | +20 |
| Testing | 58 | D+ | 80 | +22 |
| Documentation | 62 | C | 90 | +28 |
| Professional Features | 52 | D+ | 90 | +38 |

---

## 2. Architecture Overview

```
CDN (Cloudflare Pages / Netlify / Coolify Docker)
  └── 16 Static HTML Pages
        ├── assets/css/core.css     (494 lines, Oklch design system)
        ├── assets/js/core.js       (334 lines, vanilla JS)
        ├── assets/img/OptiFlow.Logo.{png,webp,avif}
        └── manifest.json
              │
Build Pipeline (scripts/assemble.mjs, ~500 lines)
  ├── Partial injection (nav, footer, analytics via <!-- INCLUDE -->)
  ├── Placeholder replacement ({{PHONE}}, {{EMAIL}}, {{YEAR}}, etc.)
  ├── SEO injection (OG tags, canonical, JSON-LD)
  ├── Sitemap.xml + robots.txt + manifest.json generation
  └── Image optimization (PNG → WebP + AVIF via sharp)
              │
Post-Build Validation (scripts/validate.mjs, 239 lines)
  ├── Internal link resolution check
  ├── Hardcoded hex color detection
  ├── SEO tag verification (title, desc, h1, OG)
  ├── Dark mode coverage check
  └── Company info consistency check
              │
API Layer (Cloudflare Workers — 3 functions)
  ├── functions/api/form-submit.js  (473 lines — routes: submit, admin login/verify/submissions/stats/export)
  ├── functions/api/email.js        (email dispatch via Resend)
  └── functions/api/_scheduled.js   (data retention cleanup)
              │
Storage (Cloudflare KV)
  ├── SUBMISSIONS    (form data + newsletter subscribers)
  ├── RATE_LIMIT     (per-IP request tracking, 10min TTL)
  ├── NOTIFICATIONS  (email dispatch logs)
  └── AUDIT          (audit trail)
              |
Edge Functions (API Workers)
  ├── CSRF protection (Origin header validation)
  ├── Rate limiting (KV-backed, 5 req/10min per IP)
  ├── Input sanitization (HTML entity encoding)
  ├── Indian phone validation
  ├── Honeypot spam detection
  └── JWT admin auth (single user, env var secret)
```

### Key Source Files

| File | Lines | Purpose |
|------|-------|---------|
| `site.json` | 78 | SSOT: company data, page metadata, nav/footer config |
| `assets/css/core.css` | 494 | Design system (Oklch, CSS custom properties, components) |
| `assets/js/core.js` | 334 | Shared JS: theme, nav, reveal, forms, FAQ, counters, UTMs |
| `scripts/assemble.mjs` | 500 | Build engine — partial injection, placeholder replacement, SEO |
| `scripts/validate.mjs` | 239 | Post-build validation (links, hex colors, SEO, dark mode) |
| `src/pages/*.html` | var | 16 page templates (200-600 lines inline `<style>` each) |
| `src/partials/nav.html` | 39 | Navigation partial |
| `src/partials/footer.html` | 27 | Footer partial (social links, theme toggle) |
| `src/partials/analytics.html` | 3 | Plausible analytics injection |
| `functions/api/form-submit.js` | 473 | Form API — submit, admin auth, submissions CRUD, CSRF, rate limit |
| `functions/api/email.js` | — | Email dispatch via Resend |
| `functions/api/_scheduled.js` | — | Data retention cleanup cron |
| `tests/e2e/*.spec.js` | 5 specs | Playwright E2E (a11y, assets, nav, responsive, seo) |

### Page Inventory (16 pages)

| # | Page | Source | Dist Path | Score | Status |
|---|------|--------|-----------|-------|--------|
| 1 | Home | home.html | /index.html | 68 | Published |
| 2 | Problem Solutions | problem-solutions.html | /problem-solutions/ | 62 | Published |
| 3 | Product Overview | product-overview.html | /product-overview/ | 63 | Published |
| 4 | Features | features.html | /features/ | 65 | Published |
| 5 | Feature Showcase | feature-showcase.html | /feature-showcase/ | 60 | Published |
| 6 | Why OptiFlow | why-optiflow.html | /why-optiflow/ | 63 | Published |
| 7 | Pricing | pricing.html | /pricing/ | 66 | Published |
| 8 | Newsletter | newsletter.html | /newsletter/ | 62 | Published |
| 9 | FAQ | faq.html | /faq/ | 64 | Published |
| 10 | Contact | contact.html | /contact/ | 68 | Published |
| 11 | Demo Booking | demo-booking.html | /demo-booking/ | 55 | Published |
| 12 | Competitive Positioning | competitive-positioning.html | /competitive-positioning/ | 58 | Published |
| 13 | Privacy Policy | privacy-policy.html | /privacy-policy/ | 65 | Published |
| 14 | Terms | terms.html | /terms/ | 65 | Published |
| 15 | 404 | 404.html | /404.html | 72 | Published |
| 16 | 500 | 500.html | /500.html | 70 | Published |

### Reusable UI Sections

| Section | Used On | Status |
|---------|---------|--------|
| Header/Nav | All 16 pages | Complete (UX-003 pending) |
| Footer | All 16 pages | Complete |
| Hero | Home only | Partial (UX-004 pending) |
| CTA Section | 7 pages | Partial (UX-004 pending) |
| Pricing Cards | Pricing | Partial (UX-004 pending) |
| FAQ Accordion | FAQ, Pricing | Partial (SEO-002 pending) |
| Contact Form | Contact, Demo Booking | Partial (UX-001 pending) |
| Newsletter Form | Newsletter | Complete |
| Demo Calendar | Demo Booking | **Placeholder (BE-001 CRITICAL)** |
| Testimonials | Home, Why OptiFlow | Partial (UX-004 pending) |
| Comparison Table | 4 pages | Partial (UX-004 pending) |
| Analytics | All 16 pages | Partial (FE-003 pending) |

---

## 3. Completed Features (17)

### Phase 01 — Critical Fixes ✅ (2026-07-06)

| ID | Feature | What was done |
|----|---------|---------------|
| IMP-0001 | Fix HTML encoding — em dashes | Replaced broken `â€"` with `&mdash;` across all 14 pages |
| IMP-0002 | Add analytics to all pages | Auto-injected Plausible analytics partial via assemble.mjs |

### Phase 02 — Design System & Conventions ✅

| ID | Feature | What was done |
|----|---------|---------------|
| IMP-0003 | Fix DESIGN.md duplicates | Removed lines 396-589 duplicate of lines 5-394 |
| IMP-0004 | Fix hardcoded email in footer | Replaced `mailto:info@optiflow.co.in` with `mailto:{{EMAIL}}` |
| IMP-0005 | Replace hex with CSS variables (contact) | Replaced inline hex colors with `var(--*)` tokens |
| IMP-0006 | Fix green variable conflict (pricing) | Removed `[data-theme="dark"] { --green: ... }` override |

### Phase 03 — Security ✅

| ID | Feature | What was done |
|----|---------|---------------|
| SEC-001 | Rate limiting → Cloudflare KV | Replaced in-memory `globalThis._rateLimit` with KV-backed TTL storage |
| SEC-002 | CSRF protection | Added Origin header validation against allowed domains |
| SEC-003 | Input sanitization | HTML entity encoding on all string fields before storage/email |
| SEC-004 | Phone validation regex | Replaced `^\+?\d{7,15}$` with Indian mobile regex |

### Phase 04 — Missing Pages ✅

| ID | Feature | What was done |
|----|---------|---------------|
| FE-001 | Create 404 page | Created `src/pages/404.html` (3.3KB) with nav, CTA, search suggestion |
| FE-002 | Create 500 page | Created `src/pages/500.html` (3.1KB) with error message and support info |

### Phase 07 — Content & Trust (Partial) ✅

| ID | Feature | What was done |
|----|---------|---------------|
| CNT-001 | Replace placeholder client logos | Replaced fake text spans with verified references |
| CNT-002 | Fix stats inconsistencies | Aligned "10,000+ Tasks Daily" with pricing counter |
| CNT-003 | Add social media links | Added LinkedIn, X/Twitter, YouTube to footer |

---

## 4. Pending Features (17 tracked + 25 planned = 42 features)

---

### ACC-001 — aria-hidden on Decorative SVGs

- **Feature ID:** ACC-001
- **Feature Name:** aria-hidden on Decorative SVGs
- **Category:** Accessibility
- **Current Status:** Pending
- **Current Score:** A11y 62 / 100
- **Target Score:** A11y +5
- **Priority:** Medium
- **Business Value:** Eliminates screen reader noise from 100+ decorative inline SVGs, making the site usable for visually impaired business owners evaluating OptiFlow OS.
- **Technical Value:** Reduces axe-core violations to zero for this rule class; establishes SVG accessibility convention.
- **Problem Statement:** 100+ inline SVGs across all pages lack `aria-hidden="true"`, causing screen readers to announce each as "unnamed graphic" — severe auditory pollution.
- **Current Behaviour:** SVGs are inline with no `aria-hidden` attribute. Some nav SVGs already have `aria-hidden="true"` (verified in nav.html). Meaningful SVGs (logo, charts) need proper labels.
- **Expected Behaviour:** Every decorative SVG has `aria-hidden="true"`. Meaningful SVGs (logo, data charts) retain accessible labels.
- **Why This Needs To Be Built:** WCAG 2.2 AA compliance. Screen reader users are a significant segment of business decision-makers.
- **Affected Pages:** All 16 pages
- **Affected Sections:** Header, Footer, Hero, all inline SVG icons
- **Affected Components:** SVG icon sets, divider SVGs, decorative background SVGs
- **Frontend Impact:** Bulk find-replace across all HTML files: `<svg` → `<svg aria-hidden="true"` on decorative icons. Exclude logo and content SVGs.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None
- **SEO Impact:** None
- **Accessibility Impact:** Primary target — removes 100+ screen reader noise items
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 1.5 hours
- **Acceptance Criteria:**
  - [ ] Zero decorative SVGs without `aria-hidden="true"` across all 16 pages
  - [ ] axe-core scan reports zero serious/critical SVG-related violations
  - [ ] All 16 pages pass `npm test -- a11y`
  - [ ] Logos and charts retain accessible labels (no regression)
- **Definition of Done:**
  - [ ] Code implemented and verified across all pages
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes (a11y suite)
  - [ ] Manual axe-core scan shows zero SVG violations
- **Testing Required:** Accessibility (axe-core), manual screen reader verification
- **Files Expected To Change:** All 14 page HTML files, `nav.html`, `footer.html`
- **Implementation Notes:** Bulk search-replace: `<svg` → `<svg aria-hidden="true"` on all decorative SVGs. Audit for meaningful SVGs (logo images, data visualization) — these should NOT get aria-hidden; they need proper labels instead. The nav.html already has `aria-hidden="true"` on theme toggle and dropdown arrow SVGs — use those as pattern reference.

---

### ACC-002 — Skip-to-Content Consistency

- **Feature ID:** ACC-002
- **Feature Name:** Skip-to-Content Link Consistency
- **Category:** Accessibility
- **Current Status:** Pending
- **Current Score:** A11y 62 / 100
- **Target Score:** A11y +3
- **Priority:** Medium
- **Business Value:** Keyboard-only users can skip repetitive navigation and reach content immediately — essential for accessibility compliance and professional credibility.
- **Technical Value:** Standardizes skip-link pattern; easy audit target for CI.
- **Problem Statement:** Skip-to-content link is present on some pages but not all 16. Inconsistent presence breaks keyboard navigation expectations.
- **Current Behaviour:** A `.skip-link` element exists on some (or most) pages. CSS for `.skip-link` exists in core.css (verified: `--z-skip-link: 1000` at line 49).
- **Expected Behaviour:** Every page has `<a class="skip-link" href="#main-content">Skip to content</a>`. On first Tab, skip link is focused and visible; Enter moves focus to `#main-content`.
- **Why This Needs To Be Built:** WCAG 2.4.1 (Bypass Blocks). Essential for keyboard-only and screen reader users.
- **Affected Pages:** All 16 pages
- **Affected Sections:** None (new element in page structure)
- **Affected Components:** Skip-link component
- **Frontend Impact:** Audit all pages; add missing `.skip-link` elements; verify with keyboard Tab.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None
- **SEO Impact:** Positive — search engines favor accessible pages.
- **Accessibility Impact:** Primary target.
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.5 hours
- **Acceptance Criteria:**
  - [ ] Every one of the 16 pages includes `<a class="skip-link" href="#main-content">Skip to content</a>`
  - [ ] Tab key on page load focuses skip link as first interactive element
  - [ ] Skip link is visually hidden until focused
  - [ ] Activating the skip link moves focus to main content
- **Definition of Done:**
  - [ ] Code implemented on all 16 pages
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] Manual keyboard test on all 16 pages passes
- **Testing Required:** Manual keyboard navigation test (all pages)
- **Files Expected To Change:** Any page HTML file missing skip link
- **Implementation Notes:** The CSS for `.skip-link` already exists in core.css (z-index, focus styles). Simply ensure each page has the `<a class="skip-link" href="#main-content">Skip to content</a>` as the first child of `<body>`. Wrap main content in `<main id="main-content">` for the target.

---

### ACC-003 — ARIA Labels on Interactive Components

- **Feature ID:** ACC-003
- **Feature Name:** ARIA Labels on Interactive Components
- **Category:** Accessibility
- **Current Status:** Pending
- **Current Score:** A11y 62 / 100
- **Target Score:** A11y +5
- **Priority:** Low
- **Business Value:** Ensures all interactive elements are properly labeled for screen readers — essential for form completion (demo booking, contact, newsletter) by visually impaired users.
- **Technical Value:** Eliminates axe-core ARIA violations; improves developer understanding of accessible component patterns.
- **Problem Statement:** Some interactive elements (dropdowns, icon buttons, form controls) lack proper `role`, `aria-label`, or `aria-labelledby` associations.
- **Current Behaviour:** Nav hamburger has `aria-label="Toggle menu"` (good). Theme toggle has `aria-label="Toggle theme"` (good). Social links have `aria-label` (good). Some form inputs and icon-only controls may be missing labels.
- **Expected Behaviour:** All interactive elements have accessible names. All form inputs have associated `<label>` elements. Icon-only buttons have descriptive `aria-label`.
- **Why This Needs To Be Built:** WCAG 4.1.2 (Name, Role, Value). Users must understand what each control does.
- **Affected Pages:** All 16 pages
- **Affected Sections:** Header, Footer, Forms, FAQ accordion, Theme toggle
- **Affected Components:** All buttons, inputs, selects, textareas, toggles
- **Frontend Impact:** Run axe-core scan; fix each violation by adding roles/labels/aria-labelledby.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None
- **SEO Impact:** None direct
- **Accessibility Impact:** Primary target.
- **Business Logic Impact:** None
- **Dependencies:** ACC-001 (decorative SVG cleanup reduces scan noise)
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 2.0 hours
- **Acceptance Criteria:**
  - [ ] axe-core scan reports zero "serious" ARIA violations across all 16 pages
  - [ ] All `<input>`, `<select>`, `<textarea>` have associated labels
  - [ ] All `<button>` elements have visible text or descriptive `aria-label`
  - [ ] Icon-only buttons (search, menu toggle, theme toggle) have `aria-label`
  - [ ] Navigation, header, and footer included in audit
- **Definition of Done:**
  - [ ] Code implemented (markup fixes across all pages)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes (a11y suite)
  - [ ] Manual axe-core scan shows zero serious ARIA violations
- **Testing Required:** Accessibility (axe-core), manual screen reader testing
- **Files Expected To Change:** All page HTML files with violations, nav.html, footer.html
- **Implementation Notes:** Run axe-core on each page. Triage violations by severity. Add missing `<label for="...">` associations to form inputs. Add `aria-label` to icon-only buttons. Add `role` attributes where native semantics are overridden. Re-scan until clean.

---

### UX-001 — Unify Form Component CSS

- **Feature ID:** UX-001
- **Feature Name:** Unify Form Component CSS
- **Category:** Design System
- **Current Status:** Pending
- **Current Score:** Frontend 72 / 100, UI/UX 68 / 100
- **Target Score:** Frontend +3, UI/UX +3
- **Priority:** Medium
- **Business Value:** Consistent form appearance builds trust; users evaluating OptiFlow on Contact vs Demo Booking pages see identical professional forms.
- **Technical Value:** Eliminates CSS duplication; single source of truth for form styling; easier maintenance.
- **Problem Statement:** Two different form CSS implementations exist — Contact page uses `.form-input` class pattern; Demo Booking page uses `.form-group input` pattern. Different naming, different behavior.
- **Current Behaviour:** Contact form: `.form-input` class with `var(--*)` tokens (verified — hex replaced in IMP-0005). Demo booking form: `.form-group input` with inline styles. Both submit to same `/api/form-submit` endpoint.
- **Expected Behaviour:** Single `.form-*` BEM naming convention in core.css used identically by both contact and demo-booking pages.
- **Why This Needs To Be Built:** Design system consistency. AGENTS.md rule: "Never put component styles in page files."
- **Affected Pages:** Contact, Demo Booking
- **Affected Sections:** Contact Form, Demo Booking form
- **Affected Components:** Form inputs, labels, textareas, selects, submit buttons, form states
- **Frontend Impact:** Extract common form styles to core.css under `.form-*` BEM namespace. Update both pages to use unified classes.
- **Backend Impact:** None (both forms already share the same API endpoint)
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** Reduced CSS duplication means slightly smaller page payloads.
- **SEO Impact:** None
- **Accessibility Impact:** Unified form markup enables consistent ARIA label patterns (supports ACC-003).
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 1.5 hours
- **Acceptance Criteria:**
  - [ ] `.form-*` BEM naming defined in core.css (`.form-group`, `.form-label`, `.form-input`, `.form-textarea`, `.form-submit`, `.form-error`, `.form-success`)
  - [ ] Both contact and demo-booking pages use identical form class names
  - [ ] Form appearance identical between pages (light and dark mode)
  - [ ] No inline form styles remain on either page
  - [ ] Form states (idle, focus, error, success, disabled) consistent
- **Definition of Done:**
  - [ ] Code implemented (core.css + contact.html + demo-booking.html updated)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes
  - [ ] Manual visual check: both forms look identical
- **Testing Required:** Visual regression (manual), E2E form submission test
- **Files Expected To Change:** `core.css`, `contact.html`, `demo-booking.html`
- **Implementation Notes:** Audit both form implementations. The Contact form is already on `var(--*)` tokens post IMP-0005. Use that as base. Define `.form-group`, `.form-label`, `.form-input`, `.form-textarea`, `.form-select`, `.form-hint`, `.form-error`, `.form-success`, `.form-submit` in core.css. Update both pages to use unified classes. Remove inline form styles from both pages.

---

### UX-002 — Container Width to 1320px

- **Feature ID:** UX-002
- **Feature Name:** Align Container Width to 1320px
- **Category:** Frontend
- **Current Status:** Pending
- **Current Score:** Frontend 72 / 100
- **Target Score:** Frontend +2
- **Priority:** Medium
- **Business Value:** Consistent container width across the entire site per DESIGN.md specification — maintains visual rhythm and professional polish.
- **Technical Value:** One-line CSS change; eliminates design spec vs. code mismatch.
- **Problem Statement:** `core.css` line 38: `--container: 1200px`. `DESIGN.md` specifies max container width of 1320px.
- **Current Behaviour:** All pages render at max 1200px content width. Gutter remains 32px.
- **Expected Behaviour:** All pages render at max 1320px content width.
- **Why This Needs To Be Built:** Design fidelity. The DESIGN.md is SSOT for layout specifications.
- **Affected Pages:** All 16 pages
- **Affected Sections:** All container-bound sections
- **Affected Components:** `.container` class
- **Frontend Impact:** One-line CSS change: `--container: 1320px` in core.css.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None
- **SEO Impact:** None
- **Accessibility Impact:** None
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.2 hours (10 minutes)
- **Acceptance Criteria:**
  - [ ] `--container` CSS variable set to `1320px` in core.css
  - [ ] No horizontal overflow at any breakpoint (360px, 768px, 1024px, 1440px)
  - [ ] All pages render correctly at 1320px container
- **Definition of Done:**
  - [ ] Code implemented (one-line change in core.css)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes
- **Testing Required:** Responsive visual check at 4 breakpoints
- **Files Expected To Change:** `core.css` (line 38)
- **Implementation Notes:** Single line change: `--container: 1320px;`. Verify no layout regressions across all breakpoints (360px mobile, 768px tablet, 1024px small desktop, 1440px+ large desktop). The gutter remains 32px, so effective content area increases by 120px.

---

### UX-003 — Dark Mode Nav Logo

- **Feature ID:** UX-003
- **Feature Name:** Dark Mode Navigation Logo
- **Category:** Frontend
- **Current Status:** Pending
- **Current Score:** Frontend 72 / 100
- **Target Score:** Frontend +1
- **Priority:** Low
- **Business Value:** Users in dark mode can clearly see the brand logo in navigation — essential for brand recognition across all themes.
- **Technical Value:** One-line CSS addition; matches existing footer logo pattern.
- **Problem Statement:** Footer logo already has `filter: brightness(10)` in dark mode. Navigation logo does not, potentially rendering dark against dark background.
- **Current Behaviour:** Footer logo in dark mode: filter brightens it. Nav logo in dark mode: no special handling. The logo is a blue/teal PNG on white/transparent background — may appear too dark against dark nav background.
- **Expected Behaviour:** Navigation logo is clearly visible in dark mode, matching footer logo treatment.
- **Why This Needs To Be Built:** Brand visibility. Users in dark mode should see the logo clearly.
- **Affected Pages:** All 16 pages
- **Affected Sections:** Header/Nav
- **Affected Components:** `.topnav .logo-img`
- **Frontend Impact:** One-line CSS: `[data-theme="dark"] .topnav .logo-img { filter: brightness(10); }` in core.css or nav partial.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None
- **SEO Impact:** None
- **Accessibility Impact:** Improves visual contrast for brand element.
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.2 hours (10 minutes)
- **Acceptance Criteria:**
  - [ ] Navigation logo clearly visible and readable in dark mode
  - [ ] Navigation logo NOT over-brightened in light mode
  - [ ] Matches footer logo dark mode behavior
- **Definition of Done:**
  - [ ] Code implemented (one CSS rule)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] Manual visual check: light mode and dark mode nav logo look correct
- **Testing Required:** Manual visual check (light + dark mode)
- **Files Expected To Change:** `core.css` (or `nav.html` inline style)
- **Implementation Notes:** Add to core.css: `[data-theme="dark"] .topnav .logo-img { filter: brightness(10); }`. Verify it matches the existing footer pattern. Ensure light mode logo is unaffected.

---

### UX-004 — Extract Page Styles to core.css

- **Feature ID:** UX-004
- **Feature Name:** Extract Inline Page Styles to core.css
- **Category:** Design System
- **Current Status:** Pending
- **Current Score:** Frontend 72 / 100
- **Target Score:** Frontend +5
- **Priority:** Medium
- **Business Value:** Consistent component styling across all pages; easier maintenance; faster page loads once CSS is cached.
- **Technical Value:** Eliminates 200-600 lines of duplicate inline `<style>` per page. Reduces total CSS payload through shared component styles. Enforces AGENTS.md conventions.
- **Problem Statement:** All 16 pages have 200-600 lines of inline `<style>` blocks. This violates AGENTS.md ("Never put component styles in page files"), causes style duplication across pages, and makes global design changes painful.
- **Current Behaviour:** Each page has its own `<style>` block with hero styles, card styles, grid layouts, section backgrounds, cta styles, comparison table styles, testimonial card styles, etc. core.css (494 lines) contains design system tokens, base elements, nav, footer, skip-link, buttons, cards, cta sections, comparison tables, testimonials — but pages still duplicate many styles inline.
- **Expected Behaviour:** 80%+ of shared component styles live in core.css with BEM naming. Only page-unique styles (one-off layouts, page-specific animations) remain inline.
- **Why This Needs To Be Built:** Code quality, maintainability, performance (cached CSS), and adherence to project conventions.
- **Affected Pages:** All 16 pages
- **Affected Sections:** Hero, Cards, Grids, CTA sections, Testimonials, Comparison tables, Pricing cards, Feature lists, Showcase before/after, Problem cards, FAQ, Newsletter cards, etc.
- **Affected Components:** `.hero`, `.hero-content`, `.card`, `.feature-card`, `.pricing-card`, `.testimonial-card`, `.comparison-table`, `.cta-section`, `.section`, `.grid`, `.badge`, `.showcase-item`
- **Frontend Impact:** Major refactoring — audit each page's `<style>` block, identify repeat patterns, extract to core.css with BEM naming, update page HTML to use shared classes. Core.css will grow from 494 to ~800+ lines. Page inline `<style>` blocks will shrink by 80%+.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** Positive — shared CSS is browser-cached across page navigations, reducing total CSS download.
- **SEO Impact:** Positive — faster page load.
- **Accessibility Impact:** None direct, but enables consistent accessible component patterns.
- **Business Logic Impact:** None
- **Dependencies:** None (blocks UX-005, FE-003)
- **Estimated Complexity:** Large
- **Estimated Development Time:** 4.0 hours
- **Acceptance Criteria:**
  - [ ] 80%+ of inline styles extracted to core.css
  - [ ] No duplicate CSS between pages in dist/
  - [ ] All 16 pages render identically after migration
  - [ ] `npm run build && npm run validate` passes
  - [ ] core.css uses BEM naming for new component classes
- **Definition of Done:**
  - [ ] Code implemented (core.css + all 16 page files updated)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes (all E2E)
  - [ ] Visual regression: all 16 pages match pre-migration appearance
- **Testing Required:** Visual regression (manual), E2E tests, validate check
- **Files Expected To Change:** `core.css`, all 16 page HTML files
- **Implementation Notes:** Approach page-by-page: home → pricing → features → product-overview → feature-showcase → problem-solutions → why-optiflow → newsletter → faq → contact → demo-booking → competitive-positioning → privacy-policy → terms → 404 → 500. For each page: identify shared patterns (hero variants, card variants, section backgrounds, grid layouts), move to core.css with BEM names, update page HTML, verify visual parity. Use `.section-*`, `.grid-*`, `.hero-*`, `.card-*` naming patterns already established in core.css.

---

### UX-005 — Breadcrumb Navigation

- **Feature ID:** UX-005
- **Feature Name:** Breadcrumb Navigation
- **Category:** Frontend
- **Current Status:** Pending
- **Current Score:** Frontend 72 / 100, UI/UX 68 / 100
- **Target Score:** Frontend +3, UI/UX +2
- **Priority:** Low
- **Business Value:** Improves site navigation for users exploring multiple pages; reduces bounce rate; enhances perceived professionalism.
- **Technical Value:** CSS is already defined in core.css; implementation completes the component. Enables BreadcrumbList JSON-LD for SEO.
- **Problem Statement:** Breadcrumb CSS exists in core.css (`.breadcrumbs` class) but the component was never built. No breadcrumb navigation exists on any page.
- **Current Behaviour:** No breadcrumbs on any page. CSS is defined but unused.
- **Expected Behaviour:** Working breadcrumbs on all pages except home. Auto-generated from page URL path. BreadcrumbList JSON-LD structured data present.
- **Why This Needs To Be Built:** UX convention for multi-page websites. SEO benefit from structured data. Easy implementation since CSS is done.
- **Affected Pages:** All 15 non-home pages
- **Affected Sections:** Header area (below nav, above main content)
- **Affected Components:** Breadcrumb component (new partial), `.breadcrumbs` CSS
- **Frontend Impact:** Create `src/partials/breadcrumbs.html` injected via assemble.mjs. Auto-derive breadcrumb trail from URL path segments. Generate BreadcrumbList JSON-LD.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** Negligible (tiny HTML addition)
- **SEO Impact:** Positive — BreadcrumbList structured data in Google search results.
- **Accessibility Impact:** Positive — breadcrumbs with `aria-label="Breadcrumb"` and proper `aria-current="page"` help navigation.
- **Business Logic Impact:** None
- **Dependencies:** UX-004 (clean core.css first for style consistency)
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 1.5 hours
- **Acceptance Criteria:**
  - [ ] Breadcrumbs visible on all non-home pages
  - [ ] Auto-generated from page URL path (e.g., `/pricing/` → "Home / Pricing")
  - [ ] BreadcrumbList JSON-LD structured data present in `<head>`
  - [ ] Current page marked with `aria-current="page"`
  - [ ] Clickable breadcrumb links work
  - [ ] Breadcrumbs hidden on home page
- **Definition of Done:**
  - [ ] Code implemented (new partial + assemble.mjs logic)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes
  - [ ] Manual: breadcrumbs appear correctly on all 15 non-home pages
- **Testing Required:** E2E navigation test, SEO schema validation
- **Files Expected To Change:** `core.css` (verify `.breadcrumbs`), new `src/partials/breadcrumbs.html`, `scripts/assemble.mjs`
- **Implementation Notes:** Create breadcrumb partial with `{{BREADCRUMB_HTML}}` placeholder. In assemble.mjs: for each page, parse the URL path, split into segments, build breadcrumb trail. Map path segments to human-readable labels (from site.json page titles). Inject via `<!-- INCLUDE: breadcrumbs -->` in each page template OR auto-prepend in assemble.mjs during page assembly.

---

### CNT-004 — Favicon Variants

- **Feature ID:** CNT-004
- **Feature Name:** Favicon Variants (ICO + SVG)
- **Category:** Content / Frontend
- **Current Status:** Pending
- **Current Score:** Frontend 72 / 100
- **Target Score:** Frontend +1
- **Priority:** Low
- **Business Value:** Proper favicon in browser tabs, bookmarks, and search results for brand consistency.
- **Technical Value:** Build pipeline enhancement; cross-browser compatibility.
- **Problem Statement:** Only PNG favicon exists. No `.ico` or SVG variant for older browsers, modern browsers, or platform-specific favicon needs.
- **Current Behaviour:** OptiFlow.Logo.png serves as favicon. No `.ico` or SVG favicon.
- **Expected Behaviour:** favicon.ico, PNG favicon, and SVG favicon all generated/referenced. Build pipeline handles favicon injection.
- **Why This Needs To Be Built:** Cross-browser favicon support. SVG favicon for modern browsers supports dark/light mode.
- **Affected Pages:** All 16 pages
- **Affected Sections:** `<head>` favicon links
- **Affected Components:** None
- **Frontend Impact:** Add favicon generation step to assemble.mjs. Add multiple `<link rel="icon">` tags to head assembly.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None
- **SEO Impact:** Favicon appears in search results.
- **Accessibility Impact:** None
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.3 hours (20 minutes)
- **Acceptance Criteria:**
  - [ ] favicon.ico generated from logo.png and referenced in `<head>`
  - [ ] SVG favicon linked for modern browsers
  - [ ] Build pipeline handles favicon generation and injection
  - [ ] All favicon variants present in dist/ after build
- **Definition of Done:**
  - [ ] Code implemented (assemble.mjs + favicon assets)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
- **Testing Required:** Manual browser check (Chrome, Firefox, Safari)
- **Files Expected To Change:** `scripts/assemble.mjs`, new favicon.ico/SVG assets
- **Implementation Notes:** Generate favicon.ico from logo.png (sharp can do this). Add to assemble.mjs head injection: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`, `<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/OptiFlow.Logo.png">`, `<link rel="icon" type="image/x-icon" href="/favicon.ico">`.

---

### API-001 — API Versioning

- **Feature ID:** API-001
- **Feature Name:** API Versioning Prefix (/api/v1/)
- **Category:** API
- **Current Status:** Pending
- **Current Score:** API 42 / 100
- **Target Score:** API +5
- **Priority:** Medium
- **Business Value:** Prevents breaking changes from silently affecting clients. Enables future API evolution.
- **Technical Value:** Standard REST practice; enables safe API contract changes.
- **Problem Statement:** API endpoints are at `/api/form-submit`, `/api/admin/login`, etc. with no version prefix. Any breaking change would break existing clients without warning.
- **Current Behaviour:** Routes: `/api/form-submit`, `/api/email`, `/api/admin/*`, `/api/_scheduled`. Client-side core.js fetches `/api/form-submit`.
- **Expected Behaviour:** All API routes under `/api/v1/`. Legacy routes redirect (301) to v1 equivalents.
- **Why This Needs To Be Built:** API best practice. Enables safe evolution of the API as the product grows.
- **Affected Pages:** Contact, Demo Booking, Newsletter (form submission pages)
- **Affected Sections:** Contact Form, Demo Booking Form, Newsletter Form
- **Affected Components:** `core.js` form submission function
- **Frontend Impact:** Update `core.js` to fetch `/api/v1/form-submit` instead of `/api/form-submit`.
- **Backend Impact:** Update Cloudflare Worker route matcher to handle `/api/v1/*` paths. Add redirect handler for legacy routes.
- **Database Impact:** None
- **API Impact:** Primary target — all endpoints versioned.
- **Security Impact:** None direct
- **Performance Impact:** One additional redirect hop for legacy clients — negligible.
- **SEO Impact:** None
- **Accessibility Impact:** None
- **Business Logic Impact:** None
- **Dependencies:** None (blocking: TEST-002 needs versioned endpoints)
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 1.0 hour
- **Acceptance Criteria:**
  - [ ] `POST /api/v1/form-submit` accepts submissions
  - [ ] `POST /api/form-submit` returns 301 redirect to `/api/v1/form-submit`
  - [ ] `GET /api/v1/admin/*` handles admin routes
  - [ ] `core.js` fetch calls updated to `/api/v1/*` URLs
  - [ ] Backwards-compatible redirect preserves POST body
  - [ ] All E2E tests pass against new endpoints
- **Definition of Done:**
  - [ ] Code implemented (functions + core.js)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes
  - [ ] Manual: form submission through v1 endpoint works
- **Testing Required:** API integration test, E2E form submission test
- **Files Expected To Change:** `functions/api/form-submit.js`, `assets/js/core.js`
- **Implementation Notes:** Update Worker route matching/URL parsing to accept both `/api/*` and `/api/v1/*`. When request comes in on old `/api/form-submit` path, return 301 redirect to `/api/v1/form-submit` with same method and body. Update `core.js` `API_BASE` constant to `/api/v1`. The internal email dispatch at `/api/email` should also move or be called internally at `/api/v1/email`.

---

### BE-001 — Calendar Integration (Calendly)

- **Feature ID:** BE-001
- **Feature Name:** Real Calendar Integration (Calendly/Cal.com)
- **Category:** Backend
- **Current Status:** Pending
- **Current Score:** Product 45 / 100, Backend 35 / 100
- **Target Score:** Product +10
- **Priority:** High
- **Business Value:** Demo booking page currently has a FAKE CSS-only calendar that silently discards every booking. This is the #1 highest-impact pending feature — every demo request is a lost lead.
- **Technical Value:** Replaces decorative HTML/CSS placeholder with real scheduling infrastructure.
- **Problem Statement:** Demo booking calendar is pure HTML/CSS with no backend. User selects a date/time, fills out form — and nothing happens. Booking is never received. Every lead is silently lost.
- **Current Behaviour:** CSS-only calendar UI with day selection squares and time slot radio buttons. Surrounding form (name, email, phone, company) submits to `/api/form-submit` correctly. The calendar part is purely decorative.
- **Expected Behaviour:** Calendly inline widget embedded on demo-booking page. User selects real available slot, completes booking, receives confirmation email. Form fields pre-populate Calendly invitee details.
- **Why This Needs To Be Built:** This is a lead generation leak. Every demo request that goes into the void is a potential customer who never hears back.
- **Affected Pages:** Demo Booking
- **Affected Sections:** Demo Calendar, Demo Booking Form
- **Affected Components:** Calendar placeholder (to be removed)
- **Frontend Impact:** Remove CSS-only calendar HTML. Embed Calendly inline widget script with event type URL. Add prefill parameters from form fields and UTM tracking.
- **Backend Impact:** Calendly account setup. Event type configuration. Webhook for booking notifications (optional).
- **Database Impact:** None (Calendly manages scheduling data)
- **API Impact:** None direct. Optionally: webhook endpoint to receive Calendly booking notifications.
- **Security Impact:** Calendly embed adds external script — must be allowed in CSP (relevant for SEC-006)
- **Performance Impact:** Calendly script is async-loaded; adds ~50KB to page. Acceptable for a dedicated booking page.
- **SEO Impact:** None
- **Accessibility Impact:** Calendly widget has its own accessibility — verify it meets standards.
- **Business Logic Impact:** Lead capture becomes functional — demos actually get scheduled.
- **Dependencies:** None (blocks: PROD-007 indirectly, SEC-006 CSP must allow Calendly domain)
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 2.0 hours
- **Acceptance Criteria:**
  - [ ] Calendly inline widget loads and renders on demo-booking page
  - [ ] User can select available date/time slot and complete booking
  - [ ] Confirmation message displayed after successful booking
  - [ ] Form fields (name, email, phone, company) pre-populate Calendly invitee fields
  - [ ] UTM parameters passed through to Calendly for attribution
  - [ ] Fake CSS calendar placeholder removed
- **Definition of Done:**
  - [ ] Calendly account configured with event type
  - [ ] Widget embedded in demo-booking.html
  - [ ] End-to-end booking flow verified (select slot → fill details → confirm → email received)
  - [ ] `npm run build && npm run validate` passes
  - [ ] `npm test` passes
- **Testing Required:** Manual end-to-end booking test, E2E test update
- **Files Expected To Change:** `src/pages/demo-booking.html`
- **Implementation Notes:** 1. Create Calendly account with optiflow email. 2. Create event type for "Demo Booking" (30/45 min). 3. Get Calendly embed code snippet. 4. Replace `<div class="demo-calendar">...</div>` block with Calendly inline widget `<div>`. 5. Use Calendly prefill API: `data-utm_source`, `data-utm_medium`, `data-utm_campaign`, plus prefill invitee name/email/phone from form. 6. Optionally keep the contact form as pre-booking info capture, then load Calendly after form submit. 7. Remove CSS-only calendar styles from page `<style>` block.

---

### SEC-005 — JWT Rotation Documentation

- **Feature ID:** SEC-005
- **Feature Name:** JWT Secret Rotation Documentation
- **Category:** Security
- **Current Status:** Pending
- **Current Score:** Security 58 / 100, Documentation 62 / 100
- **Target Score:** Security +2, Documentation +3
- **Priority:** Medium
- **Business Value:** Enables secure key rotation for admin authentication; reduces risk of compromised credentials.
- **Technical Value:** Documents the operational procedure for rotating JWT secrets.
- **Problem Statement:** JWT secret is stored in environment variable with no documented rotation process. If the secret is compromised, there's no documented procedure to rotate it.
- **Current Behaviour:** JWT_SECRET env var used for admin auth token signing. No rotation documentation exists.
- **Expected Behaviour:** Documented rotation procedure in .env.example comments.
- **Why This Needs To Be Built:** Security operations readiness. Every secret needs a rotation process.
- **Affected Pages:** None (security operations)
- **Affected Sections:** None
- **Affected Components:** JWT secret env var
- **Frontend Impact:** None
- **Backend Impact:** Documentation only
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** Primary target — enables secure key rotation.
- **Performance Impact:** None
- **SEO Impact:** None
- **Accessibility Impact:** None
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.3 hours (20 minutes)
- **Acceptance Criteria:**
  - [ ] Rotation process documented in .env.example comments
  - [ ] Steps: generate new secret → update env var → restart workers → verify admin login → invalidate old tokens → remove old secret
  - [ ] Rollback procedure documented
- **Definition of Done:**
  - [ ] .env.example updated with rotation documentation
  - [ ] `npm run build && npm run validate` passes
- **Testing Required:** None (documentation only)
- **Files Expected To Change:** `.env.example`
- **Implementation Notes:** Add commented section to .env.example:
```
# JWT_SECRET — used for admin authentication token signing
#
# ROTATION PROCEDURE:
# 1. Generate new secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# 2. Add new secret as JWT_SECRET_NEW in Cloudflare Worker env
# 3. Deploy: tokens signed with either new or old secret are accepted during transition
# 4. Verify admin login works with new secret
# 5. Remove old JWT_SECRET from env
# 6. Deploy again: only new secret accepted
#
# ROLLBACK: Re-add old JWT_SECRET, redeploy
```

---

### SEO-001 — Product Structured Data

- **Feature ID:** SEO-001
- **Feature Name:** Product & SoftwareApplication JSON-LD Schema
- **Category:** SEO
- **Current Status:** Pending
- **Current Score:** SEO 72 / 100
- **Target Score:** SEO +3
- **Priority:** Medium
- **Business Value:** Rich search results for OptiFlow OS — product name, description, pricing, and features appear directly in Google search.
- **Technical Value:** Enhances existing JSON-LD injection system in assemble.mjs.
- **Problem Statement:** Missing Product and SoftwareApplication JSON-LD schemas. Existing JSON-LD only covers Organization and WebSite schemas.
- **Current Behaviour:** assemble.mjs `injectJSONLD()` function generates Organization, WebSite, and BreadcrumbList schemas. No Product or SoftwareApplication schema.
- **Expected Behaviour:** Product schema on homepage. SoftwareApplication schema on product/features page. Schema validates against schema.org.
- **Why This Needs To Be Built:** Rich results increase CTR from search by 5-10%. Competitors likely have structured data.
- **Affected Pages:** Home (Product schema), Product Overview, Features (SoftwareApplication schema)
- **Affected Sections:** `<head>` JSON-LD block
- **Affected Components:** assemble.mjs injectJSONLD function
- **Frontend Impact:** None (build-time injection)
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** Negligible (tiny JSON blob in head)
- **SEO Impact:** Primary target — rich snippets in SERP.
- **Accessibility Impact:** None
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.5 hours (30 minutes)
- **Acceptance Criteria:**
  - [ ] Product schema with name, description, pricing, category on homepage
  - [ ] SoftwareApplication schema with features, OS category, application category on product page
  - [ ] Schema validates against schema.org validator
  - [ ] No errors in Google Rich Results Test
- **Definition of Done:**
  - [ ] Code implemented (assemble.mjs updated)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] JSON-LD validates in schema.org validator
- **Testing Required:** Schema.org validator, Google Rich Results Test
- **Files Expected To Change:** `scripts/assemble.mjs`
- **Implementation Notes:** Add to `injectJSONLD()` in assemble.mjs:
  - Product schema on home page: `@type: Product`, name="OptiFlow OS", description from site.json, offers with pricing plans from site.json, category="BusinessApplication".
  - SoftwareApplication schema on product-overview and features pages: `@type: SoftwareApplication`, name, description, applicationCategory="BusinessApplication", operatingSystem="Web", offers, featureList array.

---

### SEO-002 — Dynamic FAQPage Structured Data

- **Feature ID:** SEO-002
- **Feature Name:** Dynamic FAQPage JSON-LD Schema
- **Category:** SEO
- **Current Status:** Pending
- **Current Score:** SEO 72 / 100
- **Target Score:** SEO +3
- **Priority:** Medium
- **Business Value:** FAQ rich results in Google — Q&A displayed directly in search results, increasing visibility and CTR.
- **Technical Value:** Replaces hardcoded 5-question FAQ schema with dynamically extracted full FAQ list.
- **Problem Statement:** FAQ JSON-LD is hardcoded with only 5 Q&A pairs. The FAQ page has many more questions. Inaccurate schema may cause Google to show wrong answers.
- **Current Behaviour:** Static FAQPage JSON-LD with 5 hardcoded Q&A pairs injected by assemble.mjs.
- **Expected Behaviour:** All FAQ Q&A pairs extracted from page HTML at build time. FAQPage schema dynamically generated with all questions.
- **Why This Needs To Be Built:** FAQ rich results drive organic traffic. Incomplete schema = missed SEO opportunity.
- **Affected Pages:** FAQ
- **Affected Sections:** FAQ Accordion, `<head>` JSON-LD
- **Affected Components:** assemble.mjs injectJSONLD function, `.faq-item` HTML structure
- **Frontend Impact:** Ensure FAQ HTML uses consistent selectors (`.faq-question`, `.faq-answer`) for build-time parsing.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** Build-time parsing — negligible build time increase.
- **SEO Impact:** Primary target.
- **Accessibility Impact:** None direct (FAQ accordion already has proper ARIA)
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 1.0 hour
- **Acceptance Criteria:**
  - [ ] All FAQ Q&A pairs extracted from page HTML at build time
  - [ ] FAQPage JSON-LD includes every question from the page
  - [ ] Schema validates against schema.org
  - [ ] No errors in Google Rich Results Test
- **Definition of Done:**
  - [ ] Code implemented (assemble.mjs updated)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] JSON-LD validates with all FAQ questions
- **Testing Required:** Schema.org validator, Google Rich Results Test
- **Files Expected To Change:** `scripts/assemble.mjs`, `src/pages/faq.html` (structure verification)
- **Implementation Notes:** In assemble.mjs, when building FAQ page: parse the HTML with a simple regex or DOM parser to extract all `.faq-question` and `.faq-answer` text pairs. Build dynamic FAQPage JSON-LD with `mainEntity` array containing all `@type: Question` / `@type: Answer` pairs. The FAQ page HTML currently has `.faq-item h3` for questions and `.faq-item .faq-body` for answers — verify these selectors are consistent.

---

### SEO-003 — Social Media OG Image

- **Feature ID:** SEO-003
- **Feature Name:** Social Media OpenGraph Share Image (1200x630)
- **Category:** SEO
- **Current Status:** Pending
- **Current Score:** SEO 72 / 100
- **Target Score:** SEO +4
- **Priority:** Low
- **Business Value:** Professional social share previews when OptiFlow OS pages are shared on LinkedIn, X/Twitter, WhatsApp, Facebook — critical for B2B social marketing to Indian MSMEs.
- **Technical Value:** Replaces logo-only og:image with a proper 1200x630 social card.
- **Problem Statement:** `og:image` currently points to the logo PNG (512x512). No proper social share card at 1200x630. Shared links show a misaligned, cropped logo instead of a professional preview card.
- **Current Behaviour:** `og:image` = `/assets/img/OptiFlow.Logo.png` (square logo, not social card dimensions).
- **Expected Behaviour:** Dedicated 1200x630 PNG social share image with OptiFlow branding, tagline, and CTA.
- **Why This Needs To Be Built:** B2B marketing relies on social shares (LinkedIn, WhatsApp). Professional preview cards improve share CTR significantly.
- **Affected Pages:** All 16 pages
- **Affected Sections:** `<head>` OG tags
- **Affected Components:** assemble.mjs OG injection
- **Frontend Impact:** New image asset creation. Update assemble.mjs to reference new OG image.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None
- **SEO Impact:** Primary target — social share appearance.
- **Accessibility Impact:** None
- **Business Logic Impact:** None
- **Dependencies:** Design asset needed (social card image must be created first)
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.5 hours (30 minutes)
- **Acceptance Criteria:**
  - [ ] 1200x630 PNG social share image created
  - [ ] Image includes: OptiFlow OS logo, tagline ("Business Execution OS for Indian MSMEs"), and CTA ("Book a Free Demo")
  - [ ] `og:image` and `twitter:image` point to new image
  - [ ] Image renders correctly in LinkedIn Post Inspector and Twitter Card Validator
- **Definition of Done:**
  - [ ] Design asset created and placed in assets/img/
  - [ ] assemble.mjs updated to reference new OG image
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] Social card validates on LinkedIn/Twitter debug tools
- **Testing Required:** LinkedIn Post Inspector, Twitter Card Validator
- **Files Expected To Change:** New `assets/img/og-image.png`, `scripts/assemble.mjs`
- **Implementation Notes:** Design social card at 1200x630: OptiFlow OS logo centered, gradient background (blue-teal), tagline "Business Execution Operating System for Indian MSMEs", CTA "Book a Free Demo". Must be under 1MB. Use sharp to optimize. Add to assemble.mjs: `<meta property="og:image" content="/assets/img/og-image.png">`, `<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`, `<meta name="twitter:card" content="summary_large_image">`, `<meta name="twitter:image" content="/assets/img/og-image.png">`.

---

### PERF-001 — PWA Service Worker

- **Feature ID:** PERF-001
- **Feature Name:** PWA Service Worker (Offline Support)
- **Category:** Performance
- **Current Status:** Pending
- **Current Score:** Performance 78 / 100
- **Target Score:** Performance +3
- **Priority:** Medium
- **Business Value:** OptiFlow OS marketing site works offline; users in low-connectivity areas (common for Indian MSMEs) can still browse. PWA install prompt for returning visitors.
- **Technical Value:** Complements existing manifest.json. Enables offline-first architecture.
- **Problem Statement:** `manifest.json` is generated by the build pipeline but no service worker exists. PWA install prompt won't trigger optimally. No offline fallback.
- **Current Behaviour:** manifest.json exists with name, icons, theme_color. No sw.js. No offline support.
- **Expected Behaviour:** Cache-first service worker for static assets. Offline fallback page. PWA installable. Lighthouse PWA score ≥ 80.
- **Why This Needs To Be Built:** Offline resilience for Indian MSME users with intermittent connectivity. PWA capabilities for returning visitors.
- **Affected Pages:** All 16 pages
- **Affected Sections:** Entire site
- **Affected Components:** New sw.js, core.js service worker registration
- **Frontend Impact:** Create sw.js with Workbox-like cache-first strategy. Register in core.js. Create offline.html fallback page.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** Service worker scope must be restricted to own origin.
- **Performance Impact:** Positive — cached assets load instantly on repeat visits.
- **SEO Impact:** Lighthouse PWA score improvement may indirectly affect rankings.
- **Accessibility Impact:** Positive — content available offline.
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 1.5 hours
- **Acceptance Criteria:**
  - [ ] sw.js created with cache-first strategy
  - [ ] Static assets (CSS, JS, images, fonts) cached for offline use
  - [ ] HTML pages cached (network-first with cache fallback)
  - [ ] Offline fallback page served when no network
  - [ ] Service worker registered on all pages
  - [ ] Lighthouse PWA score ≥ 80
- **Definition of Done:**
  - [ ] Code implemented (sw.js + core.js update + offline.html)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes
  - [ ] Lighthouse PWA audit score ≥ 80
- **Testing Required:** Lighthouse PWA audit, manual offline test
- **Files Expected To Change:** New `assets/js/sw.js`, `assets/js/core.js`, `scripts/assemble.mjs`, new `src/pages/offline.html`, `tests/e2e/` (new PWA spec)
- **Implementation Notes:** sw.js cache strategy: CSS/JS/Images → cache-first (immutable, versioned by build). HTML pages → network-first with cache fallback (stale content better than no content). Register in core.js: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`. Add offline.html as a simple branded fallback page. Assemble.mjs: copy sw.js to dist root, copy offline.html. Set `display: standalone` and `start_url: /` in manifest.json generation.

---

### PERF-002 — Print Stylesheet

- **Feature ID:** PERF-002
- **Feature Name:** Print Stylesheet (@media print)
- **Category:** Performance
- **Current Status:** Pending
- **Current Score:** Performance 78 / 100
- **Target Score:** Performance +2
- **Priority:** Low
- **Business Value:** Business users who print pricing pages, feature comparisons, or terms/privacy get clean output without navigation, CTAs, and irrelevant UI chrome.
- **Technical Value:** Simple CSS addition; improves print usability.
- **Problem Statement:** No `@media print` styles exist. Printing any page renders full navigation, CTAs, background colors, shadows — wasteful and hard to read on paper.
- **Current Behaviour:** Default browser print behavior — includes all visual elements. Background gradient colors waste ink. Navigation takes up space.
- **Expected Behaviour:** Navigation hidden. Footer simplified. CTAs/buttons hidden. Background gradients/colors removed. Text at readable size on A4. Links show URLs in parentheses.
- **Why This Needs To Be Built:** Business users print pricing, feature comparisons, terms, and privacy policies. Clean print output is expected of enterprise SaaS websites.
- **Affected Pages:** All 16 pages
- **Affected Sections:** All (global print styles)
- **Affected Components:** Navigation, Footer, CTAs, Cards, Hero
- **Frontend Impact:** Add `@media print` block to core.css (~30 lines).
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** None
- **Performance Impact:** None (print-only styles)
- **SEO Impact:** None
- **Accessibility Impact:** Positive — print styles improve readability for printed content.
- **Business Logic Impact:** None
- **Dependencies:** None
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.3 hours (20 minutes)
- **Acceptance Criteria:**
  - [ ] Navigation hidden in print
  - [ ] Footer simplified (brand only, no links)
  - [ ] CTA buttons hidden
  - [ ] Background gradients and shadows removed
  - [ ] Text renders at readable size on A4 (10-12pt)
  - [ ] Links show URL in parentheses after link text
- **Definition of Done:**
  - [ ] Code implemented (core.css updated)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] Print preview test on Chrome, Firefox
- **Testing Required:** Manual print preview (Chrome, Firefox, Edge)
- **Files Expected To Change:** `assets/css/core.css`
- **Implementation Notes:** Add to end of core.css:
```css
@media print {
  .topnav, .mobile-drawer, .drawer-overlay, .hamburger, .nav-cta, .theme-toggle,
  .btn-primary, .btn-secondary, .btn-glow, .cta-section, .footer-social,
  .hero-content, .hero-visual, .hero-stats { display: none !important; }
  body { font-size: 12pt; color: #000; background: #fff; }
  .container { max-width: 100%; }
  a { color: #000; text-decoration: underline; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.8em; }
  .footer-grid { display: block; }
  .footer-brand, .footer-col { margin-bottom: 1em; }
  .pagefoot { background: none; color: #000; padding: 1em 0; }
}
```

---

### FE-003 — Cookie Consent Banner

- **Feature ID:** FE-003
- **Feature Name:** Cookie Consent Banner (GDPR / DPDP Act 2023)
- **Category:** Frontend / Compliance
- **Current Status:** Pending
- **Current Score:** Product 45 / 100, Security 58 / 100
- **Target Score:** Product +5, Security +3
- **Priority:** High
- **Business Value:** Legal compliance with Indian DPDP Act 2023 and EU GDPR. Plausible analytics currently loads without user consent — this is a compliance violation.
- **Technical Value:** Consent-gated analytics loading. localStorage persistence. Privacy-first implementation.
- **Problem Statement:** No cookie consent mechanism. Plausible analytics loads on every page without user consent. This violates DPDP Act 2023 (India) and GDPR (EU) requirements for opt-in consent before tracking.
- **Current Behaviour:** Plausible analytics script loaded unconditionally on all pages via `analytics.html` partial. No consent banner. No opt-out mechanism.
- **Expected Behaviour:** Consent banner appears on first visit. "Accept" enables analytics loading. "Decline" blocks it. Preference stored in localStorage. Banner does not reappear after choice.
- **Why This Needs To Be Built:** Legal compliance. DPDP Act 2023 requires explicit consent. Non-compliance risks penalties.
- **Affected Pages:** All 16 pages
- **Affected Sections:** All (banner appears site-wide, analytics partial)
- **Affected Components:** New cookie-banner partial, analytics partial, core.js consent logic
- **Frontend Impact:** Create `src/partials/cookie-banner.html` with fixed-bottom banner styled via core.css. Add consent logic to core.js: check localStorage, show banner if no preference, conditionally load analytics. Update analytics partial or assemble.mjs to gate analytics behind consent.
- **Backend Impact:** None
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** Privacy compliance — user consent respected.
- **Performance Impact:** Analytics script deferred until consent — slightly faster initial load for non-consenting users.
- **SEO Impact:** None direct
- **Accessibility Impact:** Banner must be keyboard-accessible, with proper ARIA role="dialog" or equivalent.
- **Business Logic Impact:** Analytics data may decrease slightly (from non-consenting users). Acceptable trade-off for legal compliance.
- **Dependencies:** UX-004 (style consistency before adding new component)
- **Estimated Complexity:** Medium
- **Estimated Development Time:** 1.5 hours
- **Acceptance Criteria:**
  - [ ] Banner displays on first visit for all pages (no localStorage consent value)
  - [ ] "Accept" button sets consent flag in localStorage, enables Plausible
  - [ ] "Decline" button sets flag, blocks Plausible
  - [ ] Preference persisted in localStorage (no re-prompt)
  - [ ] Privacy policy page linked in banner text
  - [ ] Banner styled consistently with OptiFlow design system
  - [ ] Banner is keyboard accessible (can accept/decline via keyboard)
- **Definition of Done:**
  - [ ] Code implemented (new partial + core.css + core.js + analytics logic)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes
  - [ ] Manual test: first visit shows banner, accept loads analytics, decline blocks analytics, revisit hides banner
- **Testing Required:** E2E (cookie consent flow), manual browser verification
- **Files Expected To Change:** New `src/partials/cookie-banner.html`, `assets/css/core.css`, `assets/js/core.js`, `src/partials/analytics.html` (or assemble.mjs)
- **Implementation Notes:** 1. Create cookie-banner partial: fixed-bottom bar with text "We use Plausible Analytics (privacy-first, no cookies) to understand site usage. By clicking Accept, you consent." Links to privacy policy. Two buttons: Accept (primary) and Decline (secondary). 2. CSS: styled with design system tokens, z-index above content. 3. JS: on DOMContentLoaded, check `localStorage.getItem('optiflow-consent')`. If null, show banner. If 'accepted', load Plausible script dynamically. If 'declined', do nothing. 4. Analytics: remove direct script load from analytics.html. Instead, core.js creates and appends the `<script>` element only when consent is 'accepted'. 5. On Accept click: set localStorage, hide banner, load analytics. On Decline: set localStorage, hide banner, do not load analytics.

---

### SEC-006 — CSP Meta Tag

- **Feature ID:** SEC-006
- **Feature Name:** Content Security Policy Meta Tag
- **Category:** Security
- **Current Status:** Pending
- **Current Score:** Security 58 / 100
- **Target Score:** Security +4
- **Priority:** Medium
- **Business Value:** Defense-in-depth against XSS attacks. CSP at both infrastructure (nginx/netlify headers) and HTML level.
- **Technical Value:** Adds HTML-level CSP as defense-in-depth. Already exists at nginx/netlify level — this adds the meta tag backup.
- **Problem Statement:** CSP is configured at the nginx/netlify level but not present in HTML `<meta>` tags. Defense-in-depth missing. If a CDN/config issue strips the nginx header, there's no HTML fallback.
- **Current Behaviour:** CSP headers set via nginx.conf and netlify.toml. No `<meta http-equiv="Content-Security-Policy">` tag in HTML.
- **Expected Behaviour:** CSP meta tag injected into all page `<head>` elements. Allows: self, fonts.googleapis.com, fonts.gstatic.com, plausible.io, calendly.com (post BE-001). Blocks: inline scripts (except allowed nonces), external images, third-party frames.
- **Why This Needs To Be Built:** Defense-in-depth security practice. If one layer fails, the other catches it.
- **Affected Pages:** All 16 pages
- **Affected Sections:** `<head>`
- **Affected Components:** assemble.mjs head injection
- **Frontend Impact:** Add CSP meta tag injection to assemble.mjs.
- **Backend Impact:** Must coordinate with nginx.conf CSP (avoid conflicts or ensure both are consistent).
- **Database Impact:** None
- **API Impact:** None
- **Security Impact:** Primary target — defense-in-depth for XSS/mixed content protection.
- **Performance Impact:** Negligible (small header addition)
- **SEO Impact:** None
- **Accessibility Impact:** None
- **Business Logic Impact:** None
- **Dependencies:** BE-001 (CSP must allow Calendly domain after calendar integration)
- **Estimated Complexity:** Small
- **Estimated Development Time:** 0.3 hours (20 minutes)
- **Acceptance Criteria:**
  - [ ] `<meta http-equiv="Content-Security-Policy" content="...">` on all pages
  - [ ] CSP allows: 'self', fonts.googleapis.com, fonts.gstatic.com, plausible.io, calendly.com (or cal.com)
  - [ ] CSP blocks: inline scripts (except allowed), external images not from self, third-party frames not from Calendly
  - [ ] CSP meta tag content consistent with nginx/netlify CSP headers
- **Definition of Done:**
  - [ ] Code implemented (assemble.mjs updated)
  - [ ] `npm run build` passes
  - [ ] `npm run validate` passes
  - [ ] `npm test` passes
  - [ ] CSP Evaluator tool confirms policy is valid
- **Testing Required:** CSP Evaluator, manual browser console check for CSP violations
- **Files Expected To Change:** `scripts/assemble.mjs`
- **Implementation Notes:** Add to assemble.mjs head injection:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://plausible.io https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://calendly.com; connect-src 'self' https://plausible.io; base-uri 'self'; form-action 'self';">
```
Adjust after BE-001 if Calendly/Cal.com domain differs. The `unsafe-inline` on style-src is needed because pages have inline `<style>` blocks — this will improve after UX-004.

---

## 5. Planned Features (25, ~140 hours)

### Product Features (PROD-*, 8 features)

| ID | Name | Priority | Est. | Business Value |
|----|------|----------|------|----------------|
| PROD-001 | WhatsApp floating button | HIGH | 1h | Direct customer engagement for Indian MSME audience — WhatsApp is primary business communication channel |
| PROD-002 | Live chat widget (Tawk.to/Crisp) | MEDIUM | 2h | Real-time lead capture and pre-sales support |
| PROD-003 | Site-wide search (Pagefind) | MEDIUM | 3h | Content discoverability across 16 pages |
| PROD-004 | Multi-language support (hi, gu) | LOW | 16h | Regional accessibility for Gujarati/Hindi-speaking MSME owners |
| PROD-005 | Blog / knowledge base section | MEDIUM | 8h | SEO content engine; thought leadership for Indian MSME operations |
| PROD-006 | Customer portal (login, dashboard) | HIGH | 40h | Core product — actual SaaS application with user accounts |
| PROD-007 | Admin dashboard UI | HIGH | 20h | Back-office for managing leads, subscribers, analytics |
| PROD-008 | Product tour / onboarding wizard | MEDIUM | 8h | New user onboarding flow when product launches |

### Testing (TEST-*, 4 features)

| ID | Name | Priority | Est. | Business Value |
|----|------|----------|------|----------------|
| TEST-001 | Unit tests for core.js | HIGH | 4h | Safety net for JavaScript refactoring |
| TEST-002 | API integration tests | HIGH | 3h | Verify form submission, admin API, rate limiting — blocked by API-001 |
| TEST-003 | Visual regression tests (Percy/Chromatic) | MEDIUM | 2h | Catch visual regressions automatically |
| TEST-004 | Load testing for API endpoints | LOW | 2h | Verify rate limiting and scalability |

### DevOps (DEV-*, 4 features)

| ID | Name | Priority | Est. | Business Value |
|----|------|----------|------|----------------|
| DEV-001 | Uptime monitoring (UptimeRobot/BetterStack) | HIGH | 1h | Know when site goes down |
| DEV-002 | Error tracking (Sentry) | MEDIUM | 2h | JavaScript error monitoring for core.js |
| DEV-003 | Automated KV backups | HIGH | 1h | Data safety for form submissions and subscribers |
| DEV-004 | Staging environment parity | MEDIUM | 2h | Prevent "works on staging" issues |

### Documentation (DOC-*, 3 features)

| ID | Name | Priority | Est. | Business Value |
|----|------|----------|------|----------------|
| DOC-001 | API reference (OpenAPI/Swagger) | HIGH | 3h | Developer enablement for future API consumers — blocked by API-001 |
| DOC-002 | Architecture Decision Records (ADRs) | MEDIUM | 2h | Document key architecture decisions for future developers |
| DOC-003 | Security runbook / incident response | MEDIUM | 2h | Operations readiness |

### Security (SEC-*, 3 additional features)

| ID | Name | Priority | Est. | Business Value |
|----|------|----------|------|----------------|
| SEC-007 | Rate limiting on admin login | HIGH | 0.5h | Brute-force protection for admin authentication |
| SEC-008 | Password hashing for admin (bcrypt/argon2) | HIGH | 1h | Replace plain-text env var credentials with hashed passwords |
| SEC-009 | Security.txt implementation | LOW | 0.3h | Vulnerability disclosure policy per RFC 9116 |

### Performance (PERF-*, 2 additional features)

| ID | Name | Priority | Est. | Business Value |
|----|------|----------|------|----------------|
| PERF-003 | Self-host Google Fonts (woff2) | MEDIUM | 1h | Eliminate external font dependency; improve load time and privacy |
| PERF-004 | Critical CSS inlining | LOW | 2h | Inline above-fold critical CSS for faster first paint |

### SEO (SEO-*, 1 additional feature)

| ID | Name | Priority | Est. | Business Value |
|----|------|----------|------|----------------|
| SEO-004 | LocalBusiness structured data | MEDIUM | 0.5h | Local SEO for "OptiFlow Tech Solutions" in Surat, India search results |

---

## 6. Execution Order (by Dependency)

### Sprint 1 — Quick Wins (6.5 hours, all parallel)

| # | ID | Name | Est. | Deps |
|---|-----|------|------|------|
| 1 | UX-002 | Container → 1320px | 0.2h | None |
| 2 | UX-003 | Dark mode nav logo | 0.2h | None |
| 3 | CNT-004 | Favicon variants | 0.3h | None |
| 4 | SEC-005 | JWT rotation docs | 0.3h | None |
| 5 | SEC-006 | CSP meta tag | 0.3h | None |
| 6 | PERF-002 | Print stylesheet | 0.3h | None |
| 7 | SEO-003 | OG image | 0.5h | Design asset |
| 8 | SEO-001 | Product schema | 0.5h | None |
| 9 | SEO-002 | Dynamic FAQPage schema | 1.0h | None |
| 10 | API-001 | API versioning | 1.0h | None |
| 11 | ACC-002 | Skip-to-content | 0.5h | None |
| 12 | ACC-001 | aria-hidden on SVGs | 1.5h | None |

### Sprint 2 — Quality & Compliance (12.0 hours)

| # | ID | Name | Est. | Deps |
|---|-----|------|------|------|
| 13 | BE-001 | Calendar integration | 2.0h | None |
| 14 | FE-003 | Cookie consent banner | 1.5h | UX-004 (soft) |
| 15 | ACC-003 | ARIA labels | 2.0h | ACC-001 (less noise) |
| 16 | UX-001 | Unify form CSS | 1.5h | None |
| 17 | PERF-001 | PWA service worker | 1.5h | None |
| 18 | TEST-001 | Unit tests core.js | 4.0h | None |
| 19 | TEST-002 | API integration tests | 3.0h | API-001 |

### Sprint 3 — Design System Consolidation (8.0 hours)

| # | ID | Name | Est. | Deps |
|---|-----|------|------|------|
| 20 | UX-004 | Extract page styles to core.css | 4.0h | None |
| 21 | UX-005 | Breadcrumb navigation | 1.5h | UX-004 |
| 22 | PROD-001 | WhatsApp button | 1.0h | None |
| 23 | PROD-002 | Live chat widget | 2.0h | None |
| 24 | DEV-001 | Uptime monitoring | 1.0h | None |
| 25 | DEV-002 | Error tracking | 2.0h | None |

### Sprint 4 — Developer Infrastructure (11.5 hours)

| # | ID | Name | Est. | Deps |
|---|-----|------|------|------|
| 26 | DOC-001 | OpenAPI spec | 3.0h | API-001 |
| 27 | DOC-002 | ADRs | 2.0h | None |
| 28 | DOC-003 | Security runbook | 2.0h | None |
| 29 | SEC-007 | Admin rate limiting | 0.5h | None |
| 30 | SEC-008 | Password hashing | 1.0h | None |
| 31 | DEV-003 | KV backups | 1.0h | None |
| 32 | DEV-004 | Staging parity | 2.0h | None |
| 33 | PERF-003 | Self-host fonts | 1.0h | None |
| 34 | SEC-009 | Security.txt | 0.3h | None |

### Sprint 5 — Product Features (101.5 hours)

| # | ID | Name | Est. | Deps |
|---|-----|------|------|------|
| 35 | TEST-003 | Visual regression tests | 2.0h | None |
| 36 | TEST-004 | Load testing | 2.0h | None |
| 37 | PERF-004 | Critical CSS | 2.0h | UX-004 |
| 38 | SEO-004 | LocalBusiness schema | 0.5h | None |
| 39 | PROD-003 | Site search (Pagefind) | 3.0h | None |
| 40 | PROD-008 | Product tour | 8.0h | PROD-007 |
| 41 | PROD-007 | Admin dashboard UI | 20.0h | BE-001, API-001 |
| 42 | PROD-005 | Blog / knowledge base | 8.0h | None |
| 43 | PROD-006 | Customer portal | 40.0h | PROD-007, SEC-008 |
| 44 | PROD-004 | Multi-language | 16.0h | PROD-006 |

---

## 7. Progress Tracking Dashboard

| Feature ID | Name | Category | Status | Priority | Progress | Current Score | Target Score | Est. Hours | Dependencies |
|-----------|------|----------|--------|----------|----------|---------------|-------------|------------|-------------|
| **COMPLETED (17)** | | | | | | | | | |
| IMP-0001 | Fix HTML encoding | Frontend | ✅ Done | CRITICAL | 100% | — | — | — | — |
| IMP-0002 | Analytics all pages | SEO | ✅ Done | CRITICAL | 100% | — | — | — | — |
| IMP-0003 | Fix DESIGN.md | Docs | ✅ Done | HIGH | 100% | — | — | — | — |
| IMP-0004 | Fix hardcoded email | Frontend | ✅ Done | HIGH | 100% | — | — | — | — |
| IMP-0005 | Hex → CSS vars | Design | ✅ Done | HIGH | 100% | — | — | — | — |
| IMP-0006 | Fix green conflict | Design | ✅ Done | HIGH | 100% | — | — | — | — |
| SEC-001 | Rate limit → KV | Security | ✅ Done | CRITICAL | 100% | — | — | — | — |
| SEC-002 | CSRF protection | Security | ✅ Done | HIGH | 100% | — | — | — | — |
| SEC-003 | Input sanitization | Security | ✅ Done | HIGH | 100% | — | — | — | — |
| SEC-004 | Phone validation | Security | ✅ Done | HIGH | 100% | — | — | — | — |
| FE-001 | 404 page | Frontend | ✅ Done | HIGH | 100% | — | — | — | — |
| FE-002 | 500 page | Frontend | ✅ Done | HIGH | 100% | — | — | — | — |
| CNT-001 | Replace logos | Content | ✅ Done | HIGH | 100% | — | — | — | — |
| CNT-002 | Stats consistency | Content | ✅ Done | MEDIUM | 100% | — | — | — | — |
| CNT-003 | Social links | Content | ✅ Done | HIGH | 100% | — | — | — | — |
| **PENDING (17)** | | | | | | | | | |
| ACC-001 | aria-hidden SVGs | A11y | Pending | MEDIUM | 0% | 62 | +5 | 1.5h | — |
| ACC-002 | Skip-to-content | A11y | Pending | MEDIUM | 0% | 62 | +3 | 0.5h | — |
| ACC-003 | ARIA labels | A11y | Pending | LOW | 0% | 62 | +5 | 2.0h | ACC-001 |
| UX-001 | Unify form CSS | Design | Pending | MEDIUM | 0% | 72/68 | +3/+3 | 1.5h | — |
| UX-002 | Container 1320px | Frontend | Pending | MEDIUM | 0% | 72 | +2 | 0.2h | — |
| UX-003 | Dark nav logo | Frontend | Pending | LOW | 0% | 72 | +1 | 0.2h | — |
| UX-004 | Extract styles | Design | Pending | MEDIUM | 0% | 72 | +5 | 4.0h | — |
| UX-005 | Breadcrumbs | Frontend | Pending | LOW | 0% | 72/68 | +3/+2 | 1.5h | UX-004 |
| CNT-004 | Favicon variants | Frontend | Pending | LOW | 0% | 72 | +1 | 0.3h | — |
| API-001 | API versioning | API | Pending | MEDIUM | 0% | 42 | +5 | 1.0h | — |
| BE-001 | Calendar integ. | Backend | Pending | HIGH | 0% | 45/35 | +10 | 2.0h | — |
| SEC-005 | JWT rotation | Security | Pending | MEDIUM | 0% | 58/62 | +2/+3 | 0.3h | — |
| SEO-001 | Product schema | SEO | Pending | MEDIUM | 0% | 72 | +3 | 0.5h | — |
| SEO-002 | FAQPage schema | SEO | Pending | MEDIUM | 0% | 72 | +3 | 1.0h | — |
| SEO-003 | OG image | SEO | Pending | LOW | 0% | 72 | +4 | 0.5h | Design |
| PERF-001 | PWA service worker | Perf | Pending | MEDIUM | 0% | 78 | +3 | 1.5h | — |
| PERF-002 | Print stylesheet | Perf | Pending | LOW | 0% | 78 | +2 | 0.3h | — |
| FE-003 | Cookie consent | Frontend | Pending | HIGH | 0% | 45/58 | +5/+3 | 1.5h | UX-004 |
| SEC-006 | CSP meta tag | Security | Pending | MEDIUM | 0% | 58 | +4 | 0.3h | BE-001 |

| **PENDING TOTALS** | **17 features** | | | | | | | **~25h** | |

---

## 8. Engineering Domain Summaries

### Frontend
- **Current Score:** 72 / 100 → **Target:** 90
- **Current State:** 16 static HTML pages with custom design system. 200-600 lines of inline `<style>` per page. Container at 1200px (should be 1320px). No breadcrumbs, dark mode nav logo missing, form CSS inconsistent. core.css is 494 lines with Oklch design system. core.js is 334 lines of well-organized vanilla JS.
- **Completed (4):** IMP-0001, IMP-0004, FE-001, FE-002
- **Pending (5):** UX-002, UX-003, UX-005, CNT-004, FE-003
- **Planned (0):** None
- **Estimated Remaining:** ~3.7 hours pending + UX-004 (4h design system extraction)

### Backend
- **Current Score:** 35 / 100 → **Target:** 75
- **Current State:** Cloudflare Workers for form submission, email dispatch, and scheduled cleanup. No application server. No user management. No business logic. Demo booking calendar is fake CSS/HTML.
- **Completed (0):** None directly
- **Pending (1):** BE-001 (Calendly integration)
- **Planned (3):** PROD-006, PROD-007, PROD-008
- **Estimated Remaining:** ~68 hours (mostly product build)

### Database
- **Current Score:** 10 / 100 → **Target:** 60
- **Current State:** Cloudflare KV is the only storage — key-value pairs for form submissions, rate limits, notifications, and audit trail. No relational schema. No migrations. No indexes. No backups.
- **Completed (0):** None
- **Pending (0):** None tracked
- **Planned (1):** DEV-003 (KV backups)
- **Estimated Remaining:** ~1 hour (KV backup only; full DB migration to PostgreSQL is a product build milestone, ~40h+)

### API
- **Current Score:** 42 / 100 → **Target:** 75
- **Current State:** 3 Cloudflare Worker functions. No versioning. Action-named endpoints (not RESTful). Single admin user with JWT auth. No OpenAPI spec. No pagination standards.
- **Completed (0):** None directly (SEC-001 through SEC-004 improved API security)
- **Pending (1):** API-001 (versioning)
- **Planned (1):** DOC-001 (OpenAPI spec)
- **Estimated Remaining:** ~4 hours

### Security
- **Current Score:** 58 / 100 → **Target:** 85
- **Current State:** Rate limiting (KV), CSRF protection, input sanitization, and Indian phone validation all implemented. JWT rotation undocumented. CSP at infra level only. No cookie consent. Single admin user with plaintext credentials.
- **Completed (4):** SEC-001, SEC-002, SEC-003, SEC-004
- **Pending (2):** SEC-005, SEC-006
- **Planned (3):** SEC-007, SEC-008, SEC-009
- **Estimated Remaining:** ~2.6 hours

### Performance
- **Current Score:** 78 / 100 → **Target:** 90
- **Current State:** Static HTML served via nginx with Brotli compression. Image optimization (WebP + AVIF). No service worker. No print stylesheet. No self-hosted fonts. No critical CSS inlining.
- **Completed (0):** None directly
- **Pending (2):** PERF-001, PERF-002
- **Planned (2):** PERF-003, PERF-004
- **Estimated Remaining:** ~4.8 hours

### SEO
- **Current Score:** 72 / 100 → **Target:** 90
- **Current State:** All pages have title, description, OG tags, canonical URLs via assemble.mjs. Sitemap.xml and robots.txt generated. Plausible analytics injected. Missing: Product/FAQPage/LocalBusiness JSON-LD, social OG image.
- **Completed (1):** IMP-0002 (analytics all pages)
- **Pending (3):** SEO-001, SEO-002, SEO-003
- **Planned (1):** SEO-004
- **Estimated Remaining:** ~2.5 hours

### Accessibility
- **Current Score:** 62 / 100 → **Target:** 85
- **Current State:** E2E axe-core tests pass. Some pages have skip-links but not all. 100+ SVGs lack aria-hidden. Some interactive elements lack ARIA labels. Nav and footer already have good ARIA patterns (aria-label on buttons, aria-hidden on theme icons).
- **Completed (0):** None
- **Pending (3):** ACC-001, ACC-002, ACC-003
- **Planned (0):** None
- **Estimated Remaining:** ~4.0 hours

### DevOps
- **Current Score:** 65 / 100 → **Target:** 85
- **Current State:** Multi-stage Docker build with Brotli. GitHub Actions CI/CD (ci.yml, deploy.yml, test.yml). Deployable to Cloudflare Pages, Netlify, Coolify, AWS ECS, Kubernetes. No uptime monitoring. No error tracking. No staging parity.
- **Completed (0):** None
- **Pending (0):** None
- **Planned (4):** DEV-001, DEV-002, DEV-003, DEV-004
- **Estimated Remaining:** ~6 hours

### Testing
- **Current Score:** 58 / 100 → **Target:** 80
- **Current State:** 5 Playwright E2E test suites (a11y, assets, nav, responsive, seo) with 4 browser projects. 0 unit tests. 0 API integration tests. 0 visual regression tests. 0 load tests.
- **Completed (0):** None
- **Pending (0):** None directly
- **Planned (4):** TEST-001, TEST-002, TEST-003, TEST-004
- **Estimated Remaining:** ~11 hours

### Documentation
- **Current Score:** 62 / 100 → **Target:** 90
- **Current State:** This MASTER_IMPLEMENTATION.md (SSOT), feature specs for all pending features, page docs, section docs. DEVELOPER.md, DEPLOYMENT.md, DOCKER.md. README.md. No OpenAPI spec. No ADRs. No security runbook.
- **Completed (1):** IMP-0003 (fix DESIGN.md)
- **Pending (1):** SEC-005 (JWT rotation docs)
- **Planned (3):** DOC-001, DOC-002, DOC-003
- **Estimated Remaining:** ~7.3 hours

### Product / Professional Features
- **Current Score:** 45 / 100 (Product), 52 / 100 (Pro Features) → **Target:** 85 / 90
- **Current State:** Marketing website only. No actual SaaS application. Demo booking calendar is fake. No WhatsApp integration. No live chat. No search. No customer portal. No admin dashboard. The "OptiFlow OS" product does not exist in this repo.
- **Completed (0):** None
- **Pending (1):** BE-001 (calendar is the first real product feature)
- **Planned (8):** PROD-001 through PROD-008
- **Estimated Remaining:** ~98 hours (mostly product SaaS build)

---

## 9. Page-wise Summary

| Page | Score | Pending Features | Priority | Completed |
|------|-------|-----------------|----------|-----------|
| Home | 68 | ACC-001, ACC-002, ACC-003, UX-002, UX-003, UX-004, UX-005, CNT-004, SEO-001, SEO-003, PERF-001, PERF-002, FE-003, SEC-006 | HIGH | IMP-0001..0006, FE-001, FE-002, CNT-001..003, SEC-001..004 |
| Pricing | 66 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Features | 65 | ACC-001..003, UX-002..005, CNT-004, SEO-001, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Feature Showcase | 60 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Product Overview | 63 | ACC-001..003, UX-002..005, CNT-004, SEO-001, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Problem Solutions | 62 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Why OptiFlow | 63 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Newsletter | 62 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| FAQ | 64 | ACC-001..003, UX-002..005, CNT-004, SEO-002, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Contact | 68 | ACC-001..003, UX-001..005, CNT-004, API-001, PERF-001, PERF-002, FE-003, SEC-006 | HIGH | Same as above |
| Demo Booking | 55 | ACC-001..003, UX-001..005, CNT-004, BE-001, API-001, PERF-001, PERF-002, FE-003, SEC-006 | **CRITICAL** | Same as above |
| Competitive Pos. | 58 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Privacy Policy | 65 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| Terms | 65 | ACC-001..003, UX-002..005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | MED | Same as above |
| 404 | 72 | ACC-001..003, UX-002, UX-003, UX-005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | LOW | IMP-0001..0006, FE-001 |
| 500 | 70 | ACC-001..003, UX-002, UX-003, UX-005, CNT-004, PERF-001, PERF-002, FE-003, SEC-006 | LOW | IMP-0001..0006, FE-002 |

---

## 10. Section-wise Summary

| Section | Status | Feature IDs | Pending | Dependencies |
|---------|--------|------------|---------|-------------|
| Header/Nav | Complete | UX-003, UX-005, ACC-001, ACC-003 | Dark logo, breadcrumbs, a11y | UX-004 (general consistency) |
| Footer | Complete | ACC-001, ACC-003 | a11y only | None |
| Hero | Partial | UX-004, ACC-001 | Style extraction, a11y | UX-004 |
| CTA Section | Partial | UX-004 | Style extraction, partial refactor | UX-004 |
| Pricing Cards | Partial | UX-004 | Style extraction | UX-004 |
| FAQ Accordion | Partial | SEO-002, ACC-001, ACC-003 | Dynamic schema, a11y | None |
| Contact Form | Partial | UX-001, ACC-003 | Unify CSS, a11y | None |
| Newsletter Form | Complete | ACC-003 | a11y only | None |
| Demo Calendar | **Placeholder** | BE-001, UX-001 | Replace with Calendly (CRITICAL) | None |
| Testimonials | Partial | UX-004 | Style extraction, real names | UX-004 |
| Comparison Table | Partial | UX-004 | Style verification | UX-004 |
| Analytics | Partial | FE-003 | Consent-gated loading | UX-004 (soft) |

---

## 11. Final Roadmap — All Phases

### Phase 01 — Critical Fixes ✅ (Complete)
IMP-0001, IMP-0002

### Phase 02 — Design System & Conventions ✅ (Complete)
IMP-0003, IMP-0004, IMP-0005, IMP-0006

### Phase 03 — Security ✅ (Complete)
SEC-001, SEC-002, SEC-003, SEC-004

### Phase 04 — Missing Pages ✅ (Complete)
FE-001, FE-002

### Phase 05 — Accessibility (3 features, ~4.0h)
ACC-001, ACC-002, ACC-003

### Phase 06 — UI/UX Polish (5 features, ~7.4h)
UX-001, UX-002, UX-003, UX-004, UX-005

### Phase 07 — Content & Trust (1 feature remaining, ~0.3h)
CNT-004 (CNT-001, CNT-002, CNT-003 already complete)

### Phase 08 — API & Backend (3 features, ~3.3h)
API-001, BE-001, SEC-005

### Phase 09 — SEO (3 features, ~2.0h)
SEO-001, SEO-002, SEO-003

### Phase 10 — Performance & DevOps (4 features, ~3.6h)
PERF-001, PERF-002, FE-003, SEC-006

### Phase 11+ — Planned Features (~140h)
PROD-001..008, TEST-001..004, DEV-001..004, DOC-001..003, SEC-007..009, PERF-003..004, SEO-004

---

## 12. Technical Debt Register (Top 5)

| # | ID | Issue | Severity | Fix | Est. |
|---|-----|-------|----------|-----|------|
| 1 | TD-01 | Cloudflare KV as primary database — no relational schema, no queries, no integrity constraints | CRITICAL | Migrate to PostgreSQL before app development | ~40h |
| 2 | TD-02 | 200-600 lines inline `<style>` per page — maintenance nightmare, duplicates CSS across pages | HIGH | UX-004: Extract to core.css | 4.0h |
| 3 | TD-03 | 0 unit tests, 0 API tests — no safety net for JavaScript refactoring | HIGH | TEST-001 + TEST-002 | 7.0h |
| 4 | TD-04 | Demo booking calendar is fake HTML/CSS — every booking silently fails, leads are lost | HIGH | BE-001: Integrate Calendly | 2.0h |
| 5 | TD-05 | Single admin user with plain-text credentials in env vars — no RBAC, no password hashing | HIGH | SEC-007 + SEC-008 | 1.5h |

---

## 13. Quality Gates

| Gate | Status | Note |
|------|--------|------|
| GATE_SPEC | ✅ Pass | Feature specs exist for all pending features |
| GATE_BUILD | ✅ Pass | `npm run build` succeeds |
| GATE_VALIDATE | ✅ Pass | `npm run validate` succeeds |
| GATE_TEST | ⚠ Partial | 5 E2E test suites pass; 0 unit tests; 0 API tests |
| GATE_A11Y | ⚠ Partial | axe-core E2E passes; 3 pending a11y features (ACC-001..003) |
| GATE_PERF | ⚠ Not measured in CI | Lighthouse configured but not run in CI pipeline |
| GATE_SECURITY | ⚠ Partial | Core security done (SEC-001..004); 2 pending (SEC-005, SEC-006) |
| GATE_HUMAN | ⬜ Pending | Review required before production release |

---

## 14. Critical Path

```
Immediate (0 deps, can run now):
  → 12 features parallel (Sprint 1): 6.5h

Then:
  UX-004 (4.0h) → UX-005 (1.5h) → FE-003 (1.5h)
  ACC-001 (1.5h) → ACC-003 (2.0h)
  API-001 (1.0h) → TEST-002 (3.0h)
  BE-001 (2.0h) → [unblocks calendar for all demos]
  BE-001 (2.0h) → PROD-007 (20h) → PROD-006 (40h) [longest chain: ~62h]

  Critical path total: ~62 hours (BE-001 → PROD-007 → PROD-006)
```

---

## 15. Feature Dependency Graph

```
Independent (can run in parallel immediately):
  ACC-001, ACC-002, UX-001, UX-002, UX-003, CNT-004, API-001,
  BE-001, SEC-005, SEO-001, SEO-002, SEO-003, PERF-001, PERF-002,
  SEC-006, TEST-001

Blocked by UX-004:
  UX-005, FE-003

Blocked by API-001:
  TEST-002, DOC-001

Blocked by BE-001:
  PROD-007 (via enabling real product), SEC-006 (CSP must allow Calendly)

Blocked by PROD-007:
  PROD-006, PROD-008

Blocked by PROD-007 + SEC-008:
  PROD-006 (customer portal)

Blocked by PROD-006:
  PROD-004 (multi-language)
```

---

## 16. Final Validation Checklist

- [x] Every implementation task from every document merged — ENGINEERING_GAPS, IMPLEMENTATION_INDEX, IMPLEMENTATION_ROADMAP, MASTER_FEATURES, MISSING_FEATURES, FEATURE_INDEX, all feature specs, all page docs, all section docs, archive reports
- [x] Every engineering improvement exists exactly once
- [x] Every Feature has a unique Feature ID
- [x] Every Feature has implementation details, affected pages, affected sections, dependencies, acceptance criteria, testing requirements, and validation checklist
- [x] No duplicate Features remain
- [x] No implementation information exists outside this document (this is now the SSOT)
- [x] Source code cross-verified against documentation claims (core.css 494 lines ✓, core.js 334 lines ✓, assemble.mjs 500 lines ✓, validate.mjs 239 lines ✓, form-submit.js 473 lines ✓, nav.html has aria-hidden on some SVGs ✓, footer.html has social links and placeholders ✓, analytics loads Plausible unconditionally ⚠)
- [x] All 16 pages accounted for
- [x] All 12 reusable sections accounted for
- [x] 13 engineering domains summarized
- [x] Execution order defined with dependencies
- [x] Progress dashboard tracks all 34 tracked features
- [x] 25 planned features catalogued
- [x] Technical debt top 5 identified with fixes
- [x] Quality gates status current
- [x] Critical path identified
- [x] Dependency graph complete

---

**End of MASTER_IMPLEMENTATION.md — Single Source of Truth for OptiFlow OS Website**
