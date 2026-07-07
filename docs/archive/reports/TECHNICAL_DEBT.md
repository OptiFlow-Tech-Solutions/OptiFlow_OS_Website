# OptiFlow OS — Technical Debt Register

> **Registered technical debt items with severity, impact, and remediation plans.**
> **Generated:** 2026-07-06 | **Source:** Enterprise Engineering Score Report v1.0
> **Total debt items:** 15

---

## Debt Classification

| Severity | Definition | Count |
|----------|------------|-------|
| CRITICAL | Blocks production, causes data loss, or is a security incident | 1 |
| HIGH | Significant quality/maintenance impact, should fix within 2 weeks | 5 |
| MEDIUM | Noticeable but non-blocking, fix within 1-3 months | 7 |
| LOW | Cosmetic or future risk, fix opportunistically | 2 |

---

## Registered Debt Items

### TD-01: Cloudflare KV as Primary Database
- **Severity:** CRITICAL
- **Category:** Database / Architecture
- **Description:** Cloudflare KV is used as the primary data store for form submissions, subscribers, rate limits, audit logs, and notifications. KV is a key-value store with eventual consistency, no querying, no relationships, no constraints, and limited durability guarantees.
- **Business Impact:** Data loss risk; inability to query or report; no referential integrity; cannot support application features
- **Technical Impact:** Blocking all application development; every feature that needs a database must work around KV limitations
- **Root Cause:** Pre-product phase; chose KV as a simple initial store
- **Remediation:** Migrate to PostgreSQL (or equivalent relational DB) before building any application features
- **Estimated Effort:** ~40 hours
- **Suggested Solution:** Deploy PostgreSQL via Supabase/Neon/Railway; migrate existing KV data; implement proper schema with migrations

### TD-02: 200-600 Lines Inline Styles Per Page
- **Severity:** HIGH
- **Category:** Frontend / Design System
- **Description:** All 14 pages contain 200-600 lines of inline `<style>` blocks. This violates AGENTS.md conventions, duplicates styles across pages, and makes global style changes error-prone.
- **Business Impact:** Maintenance overhead; inconsistency risk; slower page iteration
- **Technical Impact:** Style conflicts; high diff volume; harder to maintain design system consistency
- **Root Cause:** Quick iteration during initial page creation; styles not extracted post-build
- **Remediation:** UX-004: Extract shared styles to core.css
- **Estimated Effort:** 4 hours
- **Suggested Solution:** Audit all page styles; identify shared patterns; migrate to core.css with BEM-style naming; leave only page-unique styles inline

### TD-03: No Unit or API Tests
- **Severity:** HIGH
- **Category:** Testing
- **Description:** Zero unit tests, zero API tests, zero integration tests. Only Playwright E2E tests exist. No test coverage metrics available.
- **Business Impact:** Regression risk; cannot confidently refactor; bugs discovered in production
- **Technical Impact:** No safety net for code changes; core.js (334 lines) has no test coverage
- **Remediation:** TEST-001, TEST-002
- **Estimated Effort:** 7 hours
- **Suggested Solution:** Add Vitest for core.js unit tests; add Playwright API testing for Cloudflare Workers endpoints; target 80%+ coverage

### TD-04: Fake Calendar on Demo Booking Page
- **Severity:** HIGH
- **Category:** Product / Frontend
- **Description:** The demo booking page shows an interactive CSS calendar UI but has no real scheduling backend. Users can select dates and time slots but no booking occurs.
- **Business Impact:** Lead loss; every demo booking attempt silently fails; poor user trust
- **Technical Impact:** Form submissions work but no actual scheduling integration
- **Remediation:** BE-001
- **Estimated Effort:** 2 hours
- **Suggested Solution:** Embed Calendly or Cal.com widget; or integrate Google Calendar API

### TD-05: Single Admin User Model
- **Severity:** HIGH
- **Category:** Security / Backend
- **Description:** Admin authentication uses a single username/password from environment variables. No RBAC, no multi-user support, no password hashing (plain text in env vars).
- **Business Impact:** Cannot have multiple admin users; security risk if credentials leak; no audit trail per user
- **Technical Impact:** Cannot scale admin access; violates security best practices
- **Remediation:** SEC-008, PROD-007
- **Estimated Effort:** 5 hours
- **Suggested Solution:** Implement bcrypt/argon2 password hashing; add multi-user support; implement role-based access (admin, manager, viewer)

### TD-06: No Monitoring or Alerting
- **Severity:** MEDIUM
- **Category:** DevOps
- **Description:** No uptime monitoring, no error tracking, no performance monitoring, no alerting. Site could be down without team knowledge.
- **Business Impact:** Potential downtime unnoticed; no SLA measurement
- **Technical Impact:** Reactive rather than proactive operations
- **Remediation:** DEV-001, DEV-002
- **Estimated Effort:** 3 hours
- **Suggested Solution:** UptimeRobot (free tier) for uptime; Sentry for error tracking; Plausible is already configured for analytics

### TD-07: API Not Versioned
- **Severity:** MEDIUM
- **Category:** API
- **Description:** API endpoints are at `/api/form-submit`, `/api/email`, etc. with no version prefix. Breaking changes will affect all clients.
- **Business Impact:** Cannot evolve API without breaking existing integrations
- **Technical Impact:** API changes are dangerous; no migration path
- **Remediation:** API-001
- **Estimated Effort:** 1 hour
- **Suggested Solution:** Move to `/api/v1/form-submit`; add redirect from old paths; document in OpenAPI spec

### TD-08: No API Documentation
- **Severity:** MEDIUM
- **Category:** Documentation / API
- **Description:** No OpenAPI/Swagger specification, no endpoint documentation, no request/response examples.
- **Business Impact:** Cannot onboard new developers; no integration guide for partners
- **Technical Impact:** Manual testing required; no auto-generated client SDKs
- **Remediation:** DOC-001
- **Estimated Effort:** 3 hours
- **Suggested Solution:** Generate OpenAPI 3.1 spec; serve via Swagger UI or Scalar

### TD-09: Hardcoded FAQPage Structured Data
- **Severity:** MEDIUM
- **Category:** SEO
- **Description:** FAQ JSON-LD has only 5 hardcoded Q&A pairs. The FAQ page has many more questions. Schema does not reflect page content.
- **Business Impact:** Reduced rich snippet opportunities in search results
- **Technical Impact:** Manual maintenance required; easily becomes stale
- **Remediation:** SEO-002
- **Estimated Effort:** 1 hour
- **Suggested Solution:** Parse FAQ page HTML at build time; dynamically generate all Q&A pairs in JSON-LD

### TD-10: No Service Worker / Offline Support
- **Severity:** MEDIUM
- **Category:** Performance / PWA
- **Description:** manifest.json is generated with PWA icons but no service worker exists. No offline caching, no install prompt optimization.
- **Business Impact:** Cannot be installed as PWA; no offline access
- **Technical Impact:** manifest.json is misleading (declares PWA without implementation)
- **Remediation:** PERF-001
- **Estimated Effort:** 1.5 hours
- **Suggested Solution:** Create simple cache-first service worker for static assets; add offline fallback page

### TD-11: No Breadcrumb Navigation
- **Severity:** MEDIUM
- **Category:** Frontend / UX
- **Description:** Breadcrumb CSS styles exist in core.css but the breadcrumb component was never built. No breadcrumb navigation on any page.
- **Business Impact:** Reduced user orientation on deep pages; missed SEO opportunity
- **Technical Impact:** Dead CSS code; incomplete navigation pattern
- **Remediation:** UX-005
- **Estimated Effort:** 1.5 hours
- **Suggested Solution:** Build breadcrumb component; auto-generate from page URL in assemble.mjs; add structured data

### TD-12: Duplicate Form CSS Patterns
- **Severity:** MEDIUM
- **Category:** Frontend / Design System
- **Description:** Contact page and demo-booking page use different CSS class patterns for forms (`.form-input` vs `.form-group input`). No shared form component styles.
- **Business Impact:** Visual inconsistency between form pages
- **Technical Impact:** Form changes require editing two different CSS patterns
- **Remediation:** UX-001
- **Estimated Effort:** 1.5 hours
- **Suggested Solution:** Extract shared form styles to core.css; standardize on one class naming convention

### TD-13: No Cookie Consent Banner
- **Severity:** MEDIUM
- **Category:** Legal / Frontend
- **Description:** No cookie consent banner despite using Plausible analytics. Indian DPDP Act 2023 requires consent for tracking. GDPR applies to EU visitors.
- **Business Impact:** Legal non-compliance; potential fines under DPDP Act
- **Technical Impact:** Analytics may be non-compliant without consent mechanism
- **Remediation:** FE-003
- **Estimated Effort:** 1.5 hours
- **Suggested Solution:** Add cookie consent banner; conditionally load Plausible based on consent; store preference in localStorage

### TD-14: Decorative SVGs Missing aria-hidden
- **Severity:** LOW
- **Category:** Accessibility
- **Description:** Over 100 inline SVG icons across all pages lack `aria-hidden="true"`, causing screen reader noise.
- **Business Impact:** Poor screen reader experience; WCAG 2.2 AA non-compliance
- **Technical Impact:** Screen readers announce decorative icons as unlabeled images
- **Remediation:** ACC-001
- **Estimated Effort:** 1.5 hours
- **Suggested Solution:** Add `aria-hidden="true"` to all decorative SVGs; keep meaningful SVGs (logos, charts) with proper labels

### TD-15: No JWT Secret Rotation Process
- **Severity:** LOW
- **Category:** Security
- **Description:** JWT_SECRET is stored in environment variables with no documented rotation process. If compromised, all tokens are valid until manual rotation.
- **Business Impact:** Extended exposure window if secret is compromised
- **Technical Impact:** No automated or documented rotation procedure
- **Remediation:** SEC-005
- **Estimated Effort:** 0.3 hours
- **Suggested Solution:** Document rotation process in security runbook; add comments to .env.example; consider key rotation schedule

---

## Debt Resolution Priority

| Rank | ID | Severity | Est. Hours | Cumulative Hours |
|------|-----|----------|------------|-----------------|
| 1 | TD-01 | CRITICAL | 40 | 40 |
| 2 | TD-04 | HIGH | 2 | 42 |
| 3 | TD-03 | HIGH | 7 | 49 |
| 4 | TD-05 | HIGH | 5 | 54 |
| 5 | TD-02 | HIGH | 4 | 58 |
| 6 | TD-13 | MEDIUM | 1.5 | 59.5 |
| 7 | TD-07 | MEDIUM | 1 | 60.5 |
| 8 | TD-06 | MEDIUM | 3 | 63.5 |
| 9 | TD-08 | MEDIUM | 3 | 66.5 |
| 10 | TD-09 | MEDIUM | 1 | 67.5 |
| 11 | TD-10 | MEDIUM | 1.5 | 69 |
| 12 | TD-12 | MEDIUM | 1.5 | 70.5 |
| 13 | TD-11 | MEDIUM | 1.5 | 72 |
| 14 | TD-14 | LOW | 1.5 | 73.5 |
| 15 | TD-15 | LOW | 0.3 | 73.8 |

**Total estimated debt resolution: ~74 hours**

---

## Debt Metrics

| Metric | Value |
|--------|-------|
| Total debt items | 15 |
| CRITICAL items | 1 |
| HIGH items | 5 |
| MEDIUM items | 7 |
| LOW items | 2 |
| Total estimated resolution time | 74 hours |
| Debt per dimension (avg score) | 67/100 |
