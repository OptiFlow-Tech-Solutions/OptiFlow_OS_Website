# OptiFlow OS — Feature Index

> **Cross-referenced index of all features, specs, tasks, and affected files.**
> **Generated:** 2026-07-06 | **Total entries:** 34 + 25 planned = 59

---

## Active Features (Pending Implementation)

| Feature ID | Name | Priority | Phase | Est. Hours | Spec | Affected Files |
|------------|------|----------|-------|------------|------|----------------|
| ACC-001 | aria-hidden on decorative SVGs | MEDIUM | 05 | 1.5 | [ACC-001](features/ACC-001.md) | All 14 pages, nav.html, footer.html |
| ACC-002 | Skip-to-content consistency | MEDIUM | 05 | 0.5 | [ACC-002](features/ACC-002.md) | All 14 pages |
| ACC-003 | ARIA labels on interactive components | LOW | 05 | 2.0 | [ACC-003](features/ACC-003.md) | All pages, nav, footer |
| UX-001 | Unify form component CSS | MEDIUM | 06 | 1.5 | [UX-001](features/UX-001.md) | core.css, contact.html, demo-booking.html |
| UX-002 | Align container width to 1320px | MEDIUM | 06 | 0.2 | [UX-002](features/UX-002.md) | core.css |
| UX-003 | Dark mode logo in nav | LOW | 06 | 0.2 | [UX-003](features/UX-003.md) | core.css or nav.html |
| UX-004 | Move page styles to core.css | MEDIUM | 06 | 4.0 | [UX-004](features/UX-004.md) | core.css, all 14 pages |
| UX-005 | Breadcrumb navigation | LOW | 06 | 1.5 | [UX-005](features/UX-005.md) | core.css, nav.html, assemble.mjs |
| CNT-004 | Favicon variants | LOW | 07 | 0.3 | [CNT-004](features/CNT-004.md) | assemble.mjs, favicon files |
| API-001 | API versioning | MEDIUM | 08 | 1.0 | [API-001](features/API-001.md) | form-submit.js, core.js |
| SEC-005 | JWT rotation documentation | MEDIUM | 08 | 0.3 | [SEC-005](features/SEC-005.md) | .env.example, new docs |
| BE-001 | Calendar integration | HIGH | 08 | 2.0 | [BE-001](features/BE-001.md) | demo-booking.html |
| SEO-001 | Product structured data | MEDIUM | 09 | 0.5 | [SEO-001](features/SEO-001.md) | assemble.mjs |
| SEO-002 | Dynamic FAQPage structured data | MEDIUM | 09 | 1.0 | [SEO-002](features/SEO-002.md) | assemble.mjs |
| SEO-003 | Social media OG image | LOW | 09 | 0.5 | [SEO-003](features/SEO-003.md) | New OG image, assemble.mjs |
| PERF-001 | PWA service worker | MEDIUM | 10 | 1.5 | [PERF-001](features/PERF-001.md) | New sw.js, assemble.mjs |
| PERF-002 | Print stylesheet | LOW | 10 | 0.3 | [PERF-002](features/PERF-002.md) | core.css |
| FE-003 | Cookie consent banner | HIGH | 10 | 1.5 | [FE-003](features/FE-003.md) | New partial, core.css, core.js |
| SEC-006 | CSP meta tag | MEDIUM | 10 | 0.3 | [SEC-006](features/SEC-006.md) | assemble.mjs |

---

## Completed Features

| Feature ID | Name | Priority | Phase | Spec |
|------------|------|----------|-------|------|
| IMP-0001 | Fix HTML encoding (em dashes) | CRITICAL | 01 | [IMP-0001](features/IMP-0001.md) |
| IMP-0002 | Add analytics to all pages | CRITICAL | 01 | [IMP-0002](features/IMP-0002.md) |
| IMP-0003 | Fix DESIGN.md duplicates | HIGH | 02 | [IMP-0003](features/IMP-0003.md) |
| IMP-0004 | Fix hardcoded email in footer | HIGH | 02 | [IMP-0004](features/IMP-0004.md) |
| IMP-0005 | Replace hex with CSS variables | HIGH | 02 | [IMP-0005](features/IMP-0005.md) |
| IMP-0006 | Fix green color variable conflict | HIGH | 02 | [IMP-0006](features/IMP-0006.md) |
| SEC-001 | Rate limiting to KV | CRITICAL | 03 | [SEC-001](features/SEC-001.md) |
| SEC-002 | CSRF protection | HIGH | 03 | [SEC-002](features/SEC-002.md) |
| SEC-003 | Input sanitization | HIGH | 03 | [SEC-003](features/SEC-003.md) |
| SEC-004 | Phone validation regex | HIGH | 03 | [SEC-004](features/SEC-004.md) |
| FE-001 | 404 error page | HIGH | 04 | [FE-001](features/FE-001.md) |
| FE-002 | 500 error page | HIGH | 04 | [FE-002](features/FE-002.md) |
| CNT-001 | Replace placeholder logos | HIGH | 07 | [CNT-001](features/CNT-001.md) |
| CNT-002 | Fix stats inconsistencies | MEDIUM | 07 | [CNT-002](features/CNT-002.md) |
| CNT-003 | Social media links | HIGH | 07 | [CNT-003](features/CNT-003.md) |

---

## Planned Additional Features

### Frontend / Product

| Feature ID | Name | Priority | Est. Hours |
|------------|------|----------|------------|
| PROD-001 | WhatsApp floating button | HIGH | 1.0 |
| PROD-002 | Live chat widget | MEDIUM | 2.0 |
| PROD-003 | Site-wide search (Pagefind) | MEDIUM | 3.0 |
| PROD-004 | Multi-language support (hi, gu) | LOW | 16.0 |
| PROD-005 | Blog/knowledge base | MEDIUM | 8.0 |
| PROD-006 | Customer portal (login, dashboard) | HIGH | 40.0 |
| PROD-007 | Admin dashboard UI | HIGH | 20.0 |
| PROD-008 | Product tour / onboarding wizard | MEDIUM | 8.0 |

### Testing

| Feature ID | Name | Priority | Est. Hours |
|------------|------|----------|------------|
| TEST-001 | Unit tests for core.js | HIGH | 4.0 |
| TEST-002 | API integration tests | HIGH | 3.0 |
| TEST-003 | Visual regression tests | MEDIUM | 2.0 |
| TEST-004 | Load testing for API | LOW | 2.0 |

### DevOps

| Feature ID | Name | Priority | Est. Hours |
|------------|------|----------|------------|
| DEV-001 | Uptime monitoring | HIGH | 1.0 |
| DEV-002 | Error tracking (Sentry) | MEDIUM | 2.0 |
| DEV-003 | Automated KV backups | HIGH | 1.0 |
| DEV-004 | Staging environment parity | MEDIUM | 2.0 |

### Documentation

| Feature ID | Name | Priority | Est. Hours |
|------------|------|----------|------------|
| DOC-001 | API reference (OpenAPI) | HIGH | 3.0 |
| DOC-002 | Architecture Decision Records | MEDIUM | 2.0 |
| DOC-003 | Security runbook | MEDIUM | 2.0 |

### Security (Additional)

| Feature ID | Name | Priority | Est. Hours |
|------------|------|----------|------------|
| SEC-007 | Rate limiting on admin login | HIGH | 0.5 |
| SEC-008 | Password hashing (bcrypt) | HIGH | 1.0 |
| SEC-009 | Security.txt | LOW | 0.3 |

### Performance (Additional)

| Feature ID | Name | Priority | Est. Hours |
|------------|------|----------|------------|
| PERF-003 | Self-host Google Fonts | MEDIUM | 1.0 |
| PERF-004 | Critical CSS inlining | LOW | 2.0 |

### SEO (Additional)

| Feature ID | Name | Priority | Est. Hours |
|------------|------|----------|------------|
| SEO-004 | LocalBusiness structured data | MEDIUM | 0.5 |

---

## Files Cross-Reference

| File | Affected Features |
|------|-------------------|
| `core.css` | UX-001, UX-002, UX-003, UX-004, PERF-002, FE-003, PERF-004 |
| `core.js` | BE-001, API-001, FE-003, PROD-002, PROD-003 |
| `assemble.mjs` | UX-005, CNT-004, SEO-001, SEO-002, SEO-003, PERF-001, SEC-006 |
| `nav.html` | ACC-001, ACC-003, UX-003 |
| `footer.html` | ACC-001, ACC-003 |
| `form-submit.js` | API-001, SEC-007, SEC-008 |
| `email.js` | (none pending) |
| `_scheduled.js` | (none pending) |
| `home.html` | ACC-001, ACC-002, ACC-003, UX-004 |
| `pricing.html` | ACC-001, ACC-002, ACC-003, UX-004 |
| `features.html` | ACC-001, ACC-002, ACC-003, UX-004 |
| `contact.html` | ACC-001, ACC-002, ACC-003, UX-001, UX-004 |
| `demo-booking.html` | ACC-001, ACC-002, ACC-003, UX-001, UX-004, BE-001 |
| `faq.html` | ACC-001, ACC-002, ACC-003, UX-004, SEO-002 |
| `*.html` (all 14) | ACC-001, ACC-002, ACC-003, UX-004, UX-005 |
