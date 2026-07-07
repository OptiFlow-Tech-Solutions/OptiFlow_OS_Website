# OptiFlow OS — Implementation Order

> **Optimized execution sequence with dependency resolution.**
> **Generated:** 2026-07-06
> **Principle:** Highest ROI + lowest dependency first; critical path tracked.

---

## Execution Order (Phased)

### Sprint 1: Quick Wins (Estimated: 6.5 hours)

| Order | Feature | Est. Hours | Deps | Why First |
|-------|---------|------------|------|-----------|
| 1 | UX-002: Container width fix | 0.2 | None | One-line CSS change, immediate consistency win |
| 2 | UX-003: Dark mode nav logo | 0.2 | None | One-line CSS filter |
| 3 | CNT-004: Favicon variants | 0.3 | None | Build pipeline, quick win |
| 4 | SEC-005: JWT rotation docs | 0.3 | None | Documentation only |
| 5 | SEC-006: CSP meta tag | 0.3 | None | Build pipeline injection |
| 6 | PERF-002: Print stylesheet | 0.3 | None | CSS only |
| 7 | SEO-003: OG image | 0.5 | None | Design asset needed |
| 8 | SEO-001: Product schema | 0.5 | None | Build pipeline |
| 9 | SEO-002: Dynamic FAQ schema | 1.0 | None | Build pipeline |
| 10 | API-001: API versioning | 1.0 | None | Breaking change, do early |
| 11 | ACC-002: Skip-to-content | 0.5 | None | Quick a11y audit |
| 12 | ACC-001: aria-hidden on SVGs | 1.5 | None | Bulk find-replace |

### Sprint 2: Quality & Compliance (Estimated: 9.5 hours)

| Order | Feature | Est. Hours | Deps | Why |
|-------|---------|------------|------|-----|
| 13 | BE-001: Calendar integration | 2.0 | None | HIGH priority, demo booking is fake |
| 14 | FE-003: Cookie consent banner | 1.5 | UX-004 (soft) | Legal compliance, DPDP Act |
| 15 | ACC-003: ARIA labels | 2.0 | None | A11y completion |
| 16 | UX-001: Unify form CSS | 1.5 | None | Design system consistency |
| 17 | TEST-001: Unit tests core.js | 4.0 | None | Testing debt |
| 18 | PERF-001: PWA service worker | 1.5 | None | Offline support |
| 19 | TEST-002: API integration tests | 3.0 | API-001 | Requires versioned endpoints |

### Sprint 3: Design System Consolidation (Estimated: 8 hours)

| Order | Feature | Est. Hours | Deps | Why |
|-------|---------|------------|------|-----|
| 20 | UX-004: Extract page styles to core.css | 4.0 | None (but large) | Central consistency |
| 21 | UX-005: Breadcrumb navigation | 1.5 | UX-004 | Needs core.css refactored |
| 22 | PROD-001: WhatsApp button | 1.0 | None | High business value for Indian market |
| 23 | PROD-002: Live chat widget | 2.0 | None | Lead capture |
| 24 | DEV-001: Uptime monitoring | 1.0 | None | Operations |
| 25 | DEV-002: Error tracking | 2.0 | None | Operations |

### Sprint 4: Developer Infrastructure (Estimated: 11.5 hours)

| Order | Feature | Est. Hours | Deps | Why |
|-------|---------|------------|------|-----|
| 26 | DOC-001: OpenAPI spec | 3.0 | API-001 | Developer enablement |
| 27 | DOC-002: Architecture Decision Records | 2.0 | None | Documentation |
| 28 | DOC-003: Security runbook | 2.0 | None | Operations |
| 29 | SEC-007: Admin rate limiting | 0.5 | None | Security |
| 30 | SEC-008: Password hashing | 1.0 | None | Security |
| 31 | DEV-003: KV backups | 1.0 | None | Data safety |
| 32 | DEV-004: Staging parity | 2.0 | None | Reliability |
| 33 | PERF-003: Self-host fonts | 1.0 | None | Performance |
| 34 | SEC-009: Security.txt | 0.3 | None | Compliance |

### Sprint 5: Product Features (Estimated: 50+ hours)

| Order | Feature | Est. Hours | Deps | Why |
|-------|---------|------------|------|-----|
| 35 | TEST-003: Visual regression tests | 2.0 | None | Quality |
| 36 | TEST-004: Load testing | 2.0 | None | Reliability |
| 37 | PERF-004: Critical CSS | 2.0 | None | Performance |
| 38 | SEO-004: LocalBusiness schema | 0.5 | None | SEO |
| 39 | PROD-003: Site search (Pagefind) | 3.0 | None | UX |
| 40 | PROD-008: Product tour | 8.0 | PROD-007 | Onboarding |
| 41 | PROD-007: Admin dashboard UI | 20.0 | BE-001, API-001 | Core product |
| 42 | PROD-005: Blog/knowledge base | 8.0 | None | Content marketing |
| 43 | PROD-006: Customer portal | 40.0 | PROD-007, SEC-008 | Core product |
| 44 | PROD-004: Multi-language | 16.0 | PROD-006 | Regional reach |

---

## Critical Path Visualization

```
Week 1         Week 2         Week 3         Week 4+
─────────────────────────────────────────────────────
Sprint 1
[Quick Wins]
████████████ (6.5h)

               Sprint 2
               [Quality]
               ████████████████ (9.5h)

                              Sprint 3
                              [Design System]
                              ██████████████ (8h)

                                             Sprint 4
                                             [Dev Infra]
                                             █████████████████ (11.5h)
                                                          ↓
                                             Sprint 5
                                             [Product]
                                             ████████████████████████ (50h+)
```

---

## Parallel Execution Opportunities

### Sprint 1 can be fully parallelized:
- All 12 features have zero dependencies
- 2-3 developers can complete in 2-3 days

### Sprint 2 parallel groups:
- Group A: BE-001, ACC-003, UX-001 (5.5h)
- Group B: FE-003, TEST-001, PERF-001 (7h)
- Group C: TEST-002 (3h, wait for API-001)

### Sprint 3 parallel groups:
- Group A: UX-004 (4h, serial)
- UX-005 waits for UX-004
- Group B: PROD-001, PROD-002, DEV-001, DEV-002 (6h, parallel)

---

## Effort Summary

| Sprint | Features | Est. Hours | Cumulative |
|--------|----------|------------|------------|
| Sprint 1: Quick Wins | 12 | 6.5 | 6.5 |
| Sprint 2: Quality | 7 | 9.5 | 16 |
| Sprint 3: Design System | 6 | 8.0 | 24 |
| Sprint 4: Dev Infra | 9 | 11.5 | 35.5 |
| Sprint 5: Product | 10 | 101.5 | 137 |

**Total estimated implementation: 137 hours (~3.5 weeks for one developer)**

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| UX-004 takes longer than estimated | Medium | High | Break into per-page increments |
| Calendar integration has API compatibility issues | Low | Medium | Test Calendly embed first |
| PROD-006/007 scope creep | High | High | Define strict MVP scope before starting |
| Multi-language requires i18n infrastructure | High | Medium | Evaluate before committing |
