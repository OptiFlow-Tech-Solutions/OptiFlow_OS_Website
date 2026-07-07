# OptiFlow OS — Master Features Catalog

> **SSOT for all features** — Every feature traces back to this document.
> **Generated:** 2026-07-06 | **Source:** Enterprise Engineering Score Report v1.0
> **Total Features:** 34 tracked + 25 planned = 59 total

---

## Feature Taxonomy

| Prefix | Category | Count |
|--------|----------|-------|
| IMP-* | General Implementation (legacy) | 34 |
| SEC-* | Security | 7 |
| FE-* | Frontend | 6 |
| ACC-* | Accessibility | 3 |
| UX-* | UI/UX | 5 |
| CNT-* | Content & Trust | 4 |
| API-* | API | 2 |
| BE-* | Backend | 1 |
| SEO-* | SEO | 3 |
| PERF-* | Performance | 2 |
| DEV-* | DevOps | 4 |
| TEST-* | Testing | 4 |
| DOC-* | Documentation | 3 |
| PROD-* | Product Features | 8 |

---

## COMPLETED FEATURES (17)

### Phase 01 — Critical Fixes

| ID | Name | Category | Priority | Status |
|----|------|----------|----------|--------|
| IMP-0001 | Fix HTML encoding (em dashes) | Frontend | CRITICAL | ✅ Done |
| IMP-0002 | Add analytics to all pages | SEO | CRITICAL | ✅ Done |

### Phase 02 — Design System & Conventions

| ID | Name | Category | Priority | Status |
|----|------|----------|----------|--------|
| IMP-0003 | Fix DESIGN.md duplicate content | Documentation | HIGH | ✅ Done |
| IMP-0004 | Fix hardcoded email in footer | Frontend | HIGH | ✅ Done |
| IMP-0005 | Replace hex with CSS variables (contact) | Design System | HIGH | ✅ Done |
| IMP-0006 | Fix green color variable conflict (pricing) | Design System | HIGH | ✅ Done |

### Phase 03 — Security

| ID | Name | Category | Priority | Status |
|----|------|----------|----------|--------|
| SEC-001 | Migrate rate limiting to KV | Security | CRITICAL | ✅ Done |
| SEC-002 | Add CSRF protection | Security | HIGH | ✅ Done |
| SEC-003 | Add input sanitization | Security | HIGH | ✅ Done |
| SEC-004 | Fix phone validation regex | Security | HIGH | ✅ Done |

### Phase 04 — Missing Pages

| ID | Name | Category | Priority | Status |
|----|------|----------|----------|--------|
| FE-001 | Create 404 error page | Frontend | HIGH | ✅ Done |
| FE-002 | Create 500 error page | Frontend | HIGH | ✅ Done |

### Phase 07 — Content & Trust (Partial)

| ID | Name | Category | Priority | Status |
|----|------|----------|----------|--------|
| CNT-001 | Replace placeholder client logos | Content | HIGH | ✅ Done |
| CNT-002 | Fix stats inconsistencies | Content | MEDIUM | ✅ Done |
| CNT-003 | Add social media links to footer | Frontend | HIGH | ✅ Done |

---

## PENDING FEATURES (17)

### Phase 05 — Accessibility

| ID | Name | Category | Priority | Est. Hours | Status |
|----|------|----------|----------|------------|--------|
| ACC-001 | Add aria-hidden to decorative SVGs | Accessibility | MEDIUM | 1.5 | ⬜ Pending |
| ACC-002 | Skip-to-content link consistency | Accessibility | MEDIUM | 0.5 | ⬜ Pending |
| ACC-003 | ARIA labels on interactive components | Accessibility | LOW | 2.0 | ⬜ Pending |

### Phase 06 — UI/UX Polish

| ID | Name | Category | Priority | Est. Hours | Status |
|----|------|----------|----------|------------|--------|
| UX-001 | Unify form component CSS | Design System | MEDIUM | 1.5 | ⬜ Pending |
| UX-002 | Align container width to 1320px | Frontend | MEDIUM | 0.2 | ⬜ Pending |
| UX-003 | Dark mode logo variant in nav | Frontend | LOW | 0.2 | ⬜ Pending |
| UX-004 | Move page styles to core.css | Design System | MEDIUM | 4.0 | ⬜ Pending |
| UX-005 | Implement breadcrumb navigation | Frontend | LOW | 1.5 | ⬜ Pending |

### Phase 07 — Content & Trust (Remaining)

| ID | Name | Category | Priority | Est. Hours | Status |
|----|------|----------|----------|------------|--------|
| CNT-004 | Add proper favicon variants | Frontend | LOW | 0.3 | ⬜ Pending |

### Phase 08 — API & Backend

| ID | Name | Category | Priority | Est. Hours | Status |
|----|------|----------|----------|------------|--------|
| API-001 | Add API versioning prefix | API | MEDIUM | 1.0 | ⬜ Pending |
| SEC-005 | Document JWT secret rotation | Security | MEDIUM | 0.3 | ⬜ Pending |
| BE-001 | Integrate real calendar (Calendly) | Backend | HIGH | 2.0 | ⬜ Pending |

### Phase 09 — SEO

| ID | Name | Category | Priority | Est. Hours | Status |
|----|------|----------|----------|------------|--------|
| SEO-001 | Product + SoftwareApplication schema | SEO | MEDIUM | 0.5 | ⬜ Pending |
| SEO-002 | Dynamic FAQPage structured data | SEO | MEDIUM | 1.0 | ⬜ Pending |
| SEO-003 | Social media OG image (1200x630) | SEO | LOW | 0.5 | ⬜ Pending |

### Phase 10 — Performance & DevOps

| ID | Name | Category | Priority | Est. Hours | Status |
|----|------|----------|----------|------------|--------|
| PERF-001 | PWA service worker | Performance | MEDIUM | 1.5 | ⬜ Pending |
| PERF-002 | Print stylesheet | Performance | LOW | 0.3 | ⬜ Pending |
| FE-003 | Cookie consent banner (GDPR/DPDP) | Frontend | HIGH | 1.5 | ⬜ Pending |
| SEC-006 | CSP meta tag in HTML head | Security | MEDIUM | 0.3 | ⬜ Pending |

---

## PLANNED ADDITIONAL FEATURES (25)

### Product Features (PROD-*)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| PROD-001 | WhatsApp floating button | HIGH | 1.0 |
| PROD-002 | Live chat widget (Tawk.to/Crisp) | MEDIUM | 2.0 |
| PROD-003 | Site-wide search (Pagefind) | MEDIUM | 3.0 |
| PROD-004 | Multi-language support (hi, gu) | LOW | 16.0 |
| PROD-005 | Blog/knowledge base section | MEDIUM | 8.0 |
| PROD-006 | Customer portal (login, dashboard) | HIGH | 40.0 |
| PROD-007 | Admin dashboard UI | HIGH | 20.0 |
| PROD-008 | Product tour / onboarding wizard | MEDIUM | 8.0 |

### Testing (TEST-*)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| TEST-001 | Unit tests for core.js | HIGH | 4.0 |
| TEST-002 | API integration tests | HIGH | 3.0 |
| TEST-003 | Visual regression tests (Percy/Chromatic) | MEDIUM | 2.0 |
| TEST-004 | Load testing for API endpoints | LOW | 2.0 |

### DevOps (DEV-*)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| DEV-001 | Uptime monitoring (UptimeRobot/BetterStack) | HIGH | 1.0 |
| DEV-002 | Error tracking (Sentry) | MEDIUM | 2.0 |
| DEV-003 | Automated database backups (KV export) | HIGH | 1.0 |
| DEV-004 | Staging environment parity | MEDIUM | 2.0 |

### Documentation (DOC-*)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| DOC-001 | API reference (OpenAPI/Swagger) | HIGH | 3.0 |
| DOC-002 | Architecture Decision Records (ADRs) | MEDIUM | 2.0 |
| DOC-003 | Security runbook / incident response | MEDIUM | 2.0 |

### Security (SEC-*)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| SEC-007 | Rate limiting on admin login | HIGH | 0.5 |
| SEC-008 | Password hashing for admin (bcrypt/argon2) | HIGH | 1.0 |
| SEC-009 | Security.txt implementation | LOW | 0.3 |

### Performance (PERF-*)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| PERF-003 | Self-host Google Fonts (woff2) | MEDIUM | 1.0 |
| PERF-004 | Critical CSS inlining | LOW | 2.0 |

### SEO (SEO-*)

| ID | Name | Priority | Est. Hours |
|----|------|----------|------------|
| SEO-004 | LocalBusiness structured data | MEDIUM | 0.5 |

---

## Feature Statistics

| Category | Total | Completed | Pending | Planned |
|----------|-------|-----------|---------|---------|
| Frontend | 8 | 4 | 2 | 0 |
| Security | 10 | 4 | 2 | 3 |
| Accessibility | 3 | 0 | 3 | 0 |
| UI/UX | 5 | 0 | 5 | 0 |
| Content | 4 | 3 | 1 | 0 |
| API | 2 | 0 | 1 | 0 |
| Backend | 1 | 0 | 1 | 0 |
| SEO | 5 | 1 | 2 | 1 |
| Performance | 4 | 0 | 2 | 2 |
| DevOps | 4 | 0 | 0 | 4 |
| Testing | 4 | 0 | 0 | 4 |
| Documentation | 5 | 1 | 0 | 3 |
| Product | 8 | 0 | 0 | 8 |
| **TOTAL** | **63** | **13** | **17** | **25** |

---

## Master Feature Cross-Reference Matrix

| Feature ID | Legacy ID | Spec Doc | Task Doc | Section | Pages Affected |
|------------|-----------|----------|----------|---------|----------------|
| SEC-001 | IMP-0007 | features/SEC-001.md | — | security | API |
| SEC-002 | IMP-0008 | features/SEC-002.md | — | security | API |
| SEC-003 | IMP-0009 | features/SEC-003.md | — | security | API |
| SEC-004 | IMP-0010 | features/SEC-004.md | — | security | API, contact, demo-booking |
| SEC-005 | IMP-0026 | features/SEC-005.md | — | security | API |
| SEC-006 | IMP-0034 | features/SEC-006.md | — | security | All |
| FE-001 | IMP-0011 | features/FE-001.md | — | frontend | 404 |
| FE-002 | IMP-0012 | features/FE-002.md | — | frontend | 500 |
| FE-003 | IMP-0033 | features/FE-003.md | — | frontend | All |
| ACC-001 | IMP-0013 | features/ACC-001.md | — | accessibility | All |
| ACC-002 | IMP-0014 | features/ACC-002.md | — | accessibility | All |
| ACC-003 | IMP-0015 | features/ACC-003.md | — | accessibility | All |
| UX-001 | IMP-0016 | features/UX-001.md | — | frontend | contact, demo-booking |
| UX-002 | IMP-0017 | features/UX-002.md | — | frontend | All |
| UX-003 | IMP-0018 | features/UX-003.md | — | frontend | All |
| UX-004 | IMP-0019 | features/UX-004.md | — | frontend | All 14 |
| UX-005 | IMP-0020 | features/UX-005.md | — | frontend | All |
| CNT-004 | IMP-0024 | features/CNT-004.md | — | frontend | All |
| API-001 | IMP-0025 | features/API-001.md | — | api | API |
| BE-001 | IMP-0027 | features/BE-001.md | — | backend | demo-booking |
| SEO-001 | IMP-0028 | features/SEO-001.md | — | seo | All |
| SEO-002 | IMP-0029 | features/SEO-002.md | — | seo | faq |
| SEO-003 | IMP-0030 | features/SEO-003.md | — | seo | All |
| PERF-001 | IMP-0031 | features/PERF-001.md | — | performance | All |
| PERF-002 | IMP-0032 | features/PERF-002.md | — | performance | All |
