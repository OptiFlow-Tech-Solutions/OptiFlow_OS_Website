# Tasks — Execution Queue

> **Work through features row by row. Each links to its spec in `MASTER_IMPLEMENTATION.md`.**
> **Strategy:** Highest ROI + lowest dependency first.

---

## Sprint 1 — Quick Wins (6.5h, 0 dependencies)

| # | ID | Feature | Est. | Files |
|---|-----|---------|------|-------|
| 1 | UX-002 | Container → 1320px | 0.2h | core.css |
| 2 | UX-003 | Dark mode nav logo | 0.2h | core.css |
| 3 | CNT-004 | Favicon variants | 0.3h | assemble.mjs |
| 4 | SEC-005 | JWT rotation docs | 0.3h | .env.example |
| 5 | SEC-006 | CSP meta tag | 0.3h | assemble.mjs |
| 6 | PERF-002 | Print stylesheet | 0.3h | core.css |
| 7 | SEO-003 | OG image | 0.5h | new asset, assemble.mjs |
| 8 | SEO-001 | Product schema | 0.5h | assemble.mjs |
| 9 | ACC-002 | Skip-to-content audit | 0.5h | all 14 pages |
| 10 | SEO-002 | Dynamic FAQPage schema | 1.0h | assemble.mjs |
| 11 | API-001 | API versioning | 1.0h | form-submit.js, core.js |
| 12 | ACC-001 | aria-hidden on SVGs | 1.5h | all pages, nav, footer |

---

## Sprint 2 — Compliance & Quality (9.5h)

| # | ID | Feature | Est. | Files |
|---|-----|---------|------|-------|
| 13 | BE-001 | Calendar (Calendly) — **BLOCKING** | 2.0h | demo-booking.html |
| 14 | FE-003 | Cookie consent banner | 1.5h | new partial, core.css, core.js |
| 15 | ACC-003 | ARIA labels | 2.0h | all pages |
| 16 | UX-001 | Unify form CSS | 1.5h | core.css, contact, demo-booking |
| 17 | PERF-001 | PWA service worker | 1.5h | new sw.js, assemble.mjs |
| 18 | TEST-001 | Unit tests (core.js) | 4.0h | new test file |

---

## Sprint 3 — Design System (5.5h, blocked by UX-004)

| # | ID | Feature | Est. | Deps |
|---|-----|---------|------|------|
| 19 | UX-004 | Extract styles → core.css | 4.0h | — |
| 20 | UX-005 | Breadcrumb navigation | 1.5h | UX-004 |

---

## Sprint 4 — Dev Infra (4.0h)

| # | ID | Feature | Est. |
|---|-----|---------|------|
| 21 | TEST-002 | API integration tests | 3.0h |
| 22 | DEV-001 | Uptime monitoring | 1.0h |

---

## Sprint 5+ — Product (reserved, ~100h)

| # | ID | Feature | Est. |
|---|-----|---------|------|
| 23 | PROD-001 | WhatsApp button | 1.0h |
| 24 | PROD-002 | Live chat | 2.0h |
| 25 | DEV-002 | Error tracking | 2.0h |
| 26 | DEV-003 | KV backups | 1.0h |
| 27 | DOC-001 | OpenAPI spec | 3.0h |
| 28 | SEC-007 | Admin rate limiting | 0.5h |
| 29 | SEC-008 | Password hashing | 1.0h |
| 30 | TEST-003 | Visual regression | 2.0h |
| 31 | DOC-002 | ADRs | 2.0h |
| 32 | DOC-003 | Security runbook | 2.0h |
| 33 | DEV-004 | Staging parity | 2.0h |
| 34 | PERF-003 | Self-host fonts | 1.0h |
| 35 | PERF-004 | Critical CSS | 2.0h |
| 36 | SEO-004 | LocalBusiness schema | 0.5h |
| 37 | SEC-009 | Security.txt | 0.3h |
| 38 | TEST-004 | Load testing | 2.0h |
| 39 | PROD-003 | Site search | 3.0h |
| 40 | PROD-008 | Product tour | 8.0h |
| 41 | PROD-005 | Blog/KB | 8.0h |
| 42 | PROD-007 | Admin dashboard | 20.0h |
| 43 | PROD-004 | Multi-language | 16.0h |
| 44 | PROD-006 | Customer portal | 40.0h |

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not started |
| 🟡 | In progress |
| ✅ | Completed |
| 🔴 | Blocked |

---

## Current Queue (Next 5 to Build)

1. **UX-002** — Container width fix (0.2h, 1 line of CSS)
2. **UX-003** — Dark mode nav logo (0.2h, 1 line of CSS)  
3. **CNT-004** — Favicon variants (0.3h, build pipeline)
4. **SEC-005** — JWT rotation docs (0.3h, comments only)
5. **SEC-006** — CSP meta tag (0.3h, build pipeline)
