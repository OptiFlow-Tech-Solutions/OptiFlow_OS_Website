# OptiFlow OS — Master Implementation Index

> 34 improvements from Enterprise Website Audit (2026-07-06)
> Build Mode activated — implementing Phase 01-02 Quick Wins first

---

## IMP-0001: Fix HTML Encoding (Em Dashes)
- **Category:** Frontend | **Page:** All 14 | **Priority:** CRITICAL | **Status:** Pending
- **Problem:** Em dashes render as `â€"` due to UTF-8/Windows-1252 encoding mismatch
- **Solution:** Replace all `â€"` with actual `—` entities or use `&mdash;`
- **Files:** All 14 pages in `src/pages/`
- **Complexity:** Low | **Estimated Time:** 30 min

## IMP-0002: Add Analytics to All Pages
- **Category:** SEO | **Page:** All 14 | **Priority:** CRITICAL | **Status:** Pending
- **Problem:** Plausible analytics only on competitive-positioning page
- **Solution:** Auto-inject analytics partial into all pages via build script
- **Files:** `scripts/assemble.mjs`
- **Complexity:** Low | **Estimated Time:** 15 min

## IMP-0003: Fix DESIGN.md Duplicate Content
- **Category:** Documentation | **Page:** N/A | **Priority:** HIGH | **Status:** Pending
- **Problem:** Lines 396-589 duplicate lines 5-394 exactly
- **Solution:** Remove duplicate block, keep single source
- **Files:** `DESIGN.md/DESIGN.md`
- **Complexity:** Low | **Estimated Time:** 5 min

## IMP-0004: Fix Hardcoded Email in Footer
- **Category:** Frontend | **Page:** All | **Priority:** HIGH | **Status:** Pending
- **Problem:** `mailto:info@optiflow.co.in` hardcoded instead of placeholder
- **Solution:** Use `mailto:{{EMAIL}}` placeholder
- **Files:** `src/partials/footer.html`
- **Complexity:** Low | **Estimated Time:** 5 min

## IMP-0005: Replace Hex with CSS Variables in Contact Form
- **Category:** Design System | **Page:** Contact | **Priority:** HIGH | **Status:** Pending
- **Problem:** Contact form CSS uses `#fff`, `#111827`, `#F9FAFB`, `#E5E7EB`, etc.
- **Solution:** Replace with `var(--surface)`, `var(--fg)`, `var(--bg)`, `var(--border)` variables
- **Files:** `src/pages/contact.html`
- **Complexity:** Low | **Estimated Time:** 20 min

## IMP-0006: Fix Green Color Variable Conflict
- **Category:** Design System | **Page:** Pricing | **Priority:** HIGH | **Status:** Pending
- **Problem:** `[data-theme="dark"] { --green: ... }` in pricing page overrides global green
- **Solution:** Use page-scoped variable or remove override
- **Files:** `src/pages/pricing.html`
- **Complexity:** Low | **Estimated Time:** 10 min

## IMP-0007: Migrate Rate Limiting to KV
- **Category:** Security | **Page:** API | **Priority:** CRITICAL | **Status:** Pending
- **Problem:** `globalThis._rateLimit` reset on every Cloudflare Worker cold start
- **Solution:** Store rate limit data in Cloudflare KV with TTL
- **Files:** `functions/api/form-submit.js`
- **Complexity:** Medium | **Estimated Time:** 2 hrs

## IMP-0008: Add CSRF Protection to API
- **Category:** Security | **Page:** API | **Priority:** HIGH | **Status:** Pending
- **Problem:** `/api/form-submit` accepts POST from any origin without CSRF token
- **Solution:** Generate and validate CSRF tokens, check Origin/Referer headers
- **Files:** `functions/api/form-submit.js`, `assets/js/core.js`
- **Complexity:** Medium | **Estimated Time:** 2 hrs

## IMP-0009: Add Input Sanitization
- **Category:** Security | **Page:** API | **Priority:** HIGH | **Status:** Pending
- **Problem:** Form fields pass to email/KV without HTML entity encoding
- **Solution:** Sanitize all string inputs before storage and email
- **Files:** `functions/api/form-submit.js`, `functions/api/email.js`
- **Complexity:** Low | **Estimated Time:** 45 min

## IMP-0010: Fix Phone Validation Regex
- **Category:** Security | **Page:** API | **Priority:** HIGH | **Status:** Pending
- **Problem:** `^\+?\d{7,15}$` too permissive for Indian numbers
- **Solution:** Use proper Indian mobile regex: `^(\+91[\s-]?)?[6-9]\d{9}$`
- **Files:** `functions/api/form-submit.js`, `src/pages/contact.html`, `src/pages/demo-booking.html`
- **Complexity:** Low | **Estimated Time:** 20 min

## IMP-0011: Create 404 Page
- **Category:** Frontend | **Page:** New | **Priority:** HIGH | **Status:** Pending
- **Problem:** No custom 404 error page exists
- **Solution:** Create `404.html` with navigation, search suggestion, and CTA
- **Files:** New: `src/pages/404.html`, update: `site.json`
- **Complexity:** Medium | **Estimated Time:** 1 hr

## IMP-0012: Create 500 Page
- **Category:** Frontend | **Page:** New | **Priority:** HIGH | **Status:** Pending
- **Problem:** No 500 server error page exists
- **Solution:** Create `500.html` with error message and contact support
- **Files:** New: `src/pages/500.html`, update: `site.json`
- **Complexity:** Medium | **Estimated Time:** 45 min

## IMP-0013: Add aria-hidden to Decorative SVGs
- **Category:** Accessibility | **Page:** All 14 | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** Hundreds of inline SVGs lack `aria-hidden="true"`
- **Solution:** Add `aria-hidden="true"` to all decorative/inline SVG icons
- **Files:** All 14 pages in `src/pages/`, `src/partials/nav.html`, `src/partials/footer.html`
- **Complexity:** Medium | **Estimated Time:** 1.5 hrs

## IMP-0014: Skip-to-Content Link Consistency
- **Category:** Accessibility | **Page:** All 14 | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** Skip link present on some pages but checked across all
- **Solution:** Verify and standardize skip-to-content across all pages
- **Files:** All 14 pages
- **Complexity:** Low | **Estimated Time:** 30 min

## IMP-0015: ARIA Labels on Interactive Components
- **Category:** Accessibility | **Page:** All | **Priority:** LOW | **Status:** Pending
- **Problem:** Some interactive elements lack proper ARIA labels
- **Solution:** Add role and aria-label to interactive elements
- **Files:** All pages, nav, footer
- **Complexity:** Medium | **Estimated Time:** 2 hrs

## IMP-0016: Unify Form Component CSS
- **Category:** Design System | **Page:** Contact, Demo-booking | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** Two different form CSS implementations (`.form-input` vs `.form-group input`)
- **Solution:** Extract shared form styles to core.css, use consistent classes
- **Files:** `core.css`, `contact.html`, `demo-booking.html`
- **Complexity:** Medium | **Estimated Time:** 1.5 hrs

## IMP-0017: Align Container Width to 1320px
- **Category:** Frontend | **Page:** All | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** core.css uses `1200px` but DESIGN.md specifies `1320px`
- **Solution:** Update `--container` to `1320px`
- **Files:** `core.css`
- **Complexity:** Low | **Estimated Time:** 10 min

## IMP-0018: Dark Mode Logo Variant in Nav
- **Category:** Frontend | **Page:** All | **Priority:** LOW | **Status:** Pending
- **Problem:** Nav logo has no dark mode filter (only footer does)
- **Solution:** Add `filter: brightness(10)` or CSS filter to nav logo in dark mode
- **Files:** `core.css` or `nav.html`
- **Complexity:** Low | **Estimated Time:** 10 min

## IMP-0019: Move Page Styles to core.css
- **Category:** Design System | **Page:** All 14 | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** AGENTS.md says "never put component styles in page files" but all pages have 200-400 lines inline
- **Solution:** Gradually extract shared components to core.css
- **Files:** `core.css`, all 14 pages
- **Complexity:** High | **Estimated Time:** 4+ hrs

## IMP-0020: Breadcrumb Navigation
- **Category:** Frontend | **Page:** All | **Priority:** LOW | **Status:** Pending
- **Problem:** CSS placeholder exists but breadcrumbs never implemented
- **Solution:** Add breadcrumb component to pages, auto-generate via build script
- **Files:** `core.css`, `nav.html`, `assemble.mjs`
- **Complexity:** Medium | **Estimated Time:** 1.5 hrs

## IMP-0021: Replace Placeholder Client Logos
- **Category:** Content | **Page:** Home | **Priority:** HIGH | **Status:** Pending
- **Problem:** Trust bar logos are fake text spans (no real clients)
- **Solution:** Either remove or replace with verified client references
- **Files:** `src/pages/home.html`
- **Complexity:** Low | **Estimated Time:** 30 min

## IMP-0022: Fix Stats Inconsistencies
- **Category:** Content | **Page:** Home, Pricing | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** Home says "10,000+ Tasks Daily" but pricing counter shows 500,000
- **Solution:** Align all stats to single source of truth
- **Files:** `site.json`, `home.html`, `pricing.html`
- **Complexity:** Low | **Estimated Time:** 20 min

## IMP-0023: Social Media Links in Footer
- **Category:** Frontend | **Page:** All | **Priority:** HIGH | **Status:** Pending
- **Problem:** Zero social media links anywhere on the site
- **Solution:** Add LinkedIn, Twitter/X, YouTube links to footer
- **Files:** `footer.html`, `site.json`
- **Complexity:** Low | **Estimated Time:** 15 min

## IMP-0024: Favicon Variants
- **Category:** Frontend | **Page:** All | **Priority:** LOW | **Status:** Pending
- **Problem:** Only PNG favicon, no `.ico` or SVG variant
- **Solution:** Generate/add favicon.ico and SVG favicon to build pipeline
- **Files:** `assemble.mjs`, favicon files
- **Complexity:** Low | **Estimated Time:** 20 min

## IMP-0025: API Versioning
- **Category:** API | **Page:** API | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** Endpoints are `/api/form-submit` with no version prefix
- **Solution:** Add `/api/v1/` prefix to all endpoints
- **Files:** `functions/api/form-submit.js`, `core.js`
- **Complexity:** Medium | **Estimated Time:** 1 hr

## IMP-0026: JWT Rotation Documentation
- **Category:** Security | **Page:** N/A | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** JWT secret stored in env var with no documented rotation process
- **Solution:** Add to env.example comments, create security runbook
- **Files:** `.env.example`, new: `docs/security/JWT_ROTATION.md`
- **Complexity:** Low | **Estimated Time:** 20 min

## IMP-0027: Calendar Integration
- **Category:** Backend | **Page:** Demo-booking | **Priority:** HIGH | **Status:** Pending
- **Problem:** Calendar is fake HTML/JS with no real scheduling backend
- **Solution:** Integrate Calendly or Cal.com embedding
- **Files:** `src/pages/demo-booking.html`
- **Complexity:** Medium | **Estimated Time:** 2 hrs

## IMP-0028: Product Structured Data
- **Category:** SEO | **Page:** All | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** Missing Product and SoftwareApplication JSON-LD schemas
- **Solution:** Add schemas to build script's injectJSONLD function
- **Files:** `scripts/assemble.mjs`
- **Complexity:** Low | **Estimated Time:** 30 min

## IMP-0029: Dynamic FAQPage Structured Data
- **Category:** SEO | **Page:** FAQ | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** FAQ JSON-LD is hardcoded with only 5 Q&A pairs
- **Solution:** Parse FAQ page HTML to dynamically extract all Q&A
- **Files:** `scripts/assemble.mjs`
- **Complexity:** Medium | **Estimated Time:** 1 hr

## IMP-0030: Social Media OpenGraph Image
- **Category:** SEO | **Page:** All | **Priority:** LOW | **Status:** Pending
- **Problem:** `og:image` points to logo only, no social share card
- **Solution:** Create a social share image (1200x630)
- **Files:** New OG image, `assemble.mjs`
- **Complexity:** Low | **Estimated Time:** 30 min

## IMP-0031: PWA Service Worker
- **Category:** Performance | **Page:** All | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** `manifest.json` generated but no service worker for offline
- **Solution:** Create simple offline-caching service worker
- **Files:** New: `assets/js/sw.js`, update: `assemble.mjs`
- **Complexity:** Medium | **Estimated Time:** 1.5 hrs

## IMP-0032: Print Stylesheet
- **Category:** Performance | **Page:** All | **Priority:** LOW | **Status:** Pending
- **Problem:** No `@media print` styles
- **Solution:** Add print styles to core.css
- **Files:** `core.css`
- **Complexity:** Low | **Estimated Time:** 20 min

## IMP-0033: Cookie Consent Banner
- **Category:** Frontend | **Page:** All | **Priority:** HIGH | **Status:** Pending
- **Problem:** No cookie consent for GDPR/DPDP Act 2023 compliance
- **Solution:** Add cookie consent banner component
- **Files:** New: `src/partials/cookie-banner.html`, `core.css`, `core.js`
- **Complexity:** Medium | **Estimated Time:** 1.5 hrs

## IMP-0034: CSP Meta Tag
- **Category:** Security | **Page:** All | **Priority:** MEDIUM | **Status:** Pending
- **Problem:** CSP only at nginx/netlify level, not in HTML
- **Solution:** Add CSP meta tag to build script injection
- **Files:** `scripts/assemble.mjs`
- **Complexity:** Low | **Estimated Time:** 20 min
