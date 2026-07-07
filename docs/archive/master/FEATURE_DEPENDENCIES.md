# OptiFlow OS — Feature Dependencies

> **Dependency graph for implementation ordering.**
> **Generated:** 2026-07-06
> **Rule:** A feature cannot start until all its blocking dependencies are completed.

---

## Dependency Graph

```
Phase 05 (Accessibility)
  ACC-001 ─── no blocking deps, can start immediately
  ACC-002 ─── no blocking deps, can start immediately
  ACC-003 ─── no blocking deps, can start immediately
  (All Phase 05 can run in parallel)

Phase 06 (UI/UX Polish)
  UX-002 ─── no blocking deps, can start immediately
  UX-003 ─── no blocking deps, can start immediately
  UX-005 ─── BLOCKED BY: UX-004 (needs core.css refactored)
  UX-001 ─── no blocking deps
  UX-004 ─── BLOCKED BY: none (just large scope)

Phase 07 (Content & Trust)
  CNT-004 ─── no blocking deps

Phase 08 (API & Backend)
  API-001 ─── no blocking deps
  SEC-005 ─── no blocking deps
  BE-001   ─── no blocking deps

Phase 09 (SEO)
  SEO-001 ─── no blocking deps
  SEO-002 ─── no blocking deps
  SEO-003 ─── BLOCKED BY: Design asset needed

Phase 10 (Performance & DevOps)
  PERF-001 ─── no blocking deps
  PERF-002 ─── no blocking deps
  FE-003   ─── BLOCKED BY: UX-004 (style system must be consistent first)
  SEC-006  ─── no blocking deps

Planned (Post-Phase 10)
  TEST-001 ─── no blocking deps
  TEST-002 ─── BLOCKED BY: API-001 (versioned endpoints)
  PROD-002 ─── no blocking deps
  PROD-001 ─── no blocking deps
  PROD-003 ─── no blocking deps
  DEV-001  ─── BLOCKED BY: PROD-007 (needs admin dashboard for monitoring scope)
  PROD-007 ─── BLOCKED BY: API-001, BE-001
  PROD-006 ─── BLOCKED BY: PROD-007, SEC-008
```

---

## Parallel Execution Groups

### Group A — Can All Run Together (0 blocking deps)
ACC-001, ACC-002, ACC-003, UX-001, UX-002, UX-003, CNT-004, API-001, SEC-005, BE-001, SEO-001, SEO-002, PERF-001, PERF-002, SEC-006

### Group B — After UX-004 Completes
UX-005, FE-003

### Group C — After API-001 Completes
TEST-002

### Group D — After PROD-007 Completes
DEV-001

### Group E — After PROD-007 + SEC-008 Complete
PROD-006

---

## Critical Path

```
UX-004 (4.0h) → UX-005 (1.5h) → FE-003 (1.5h)
                            ↘
UX-004 (4.0h) → (unlocks FE-003)

BE-001 (2.0h) → PROD-007 (20h) → PROD-006 (40h)
         ↘
API-001 (1.0h) → TEST-002 (3.0h)
```

**Critical path length: ~64 hours** (UX-004 → BE-001 → PROD-007 → PROD-006)

---

## Dependency Matrix

| Feature | Blocks | Blocked By | Parallel With |
|---------|--------|------------|---------------|
| ACC-001 | — | — | ACC-002, ACC-003, UX-001, UX-002, UX-003 |
| ACC-002 | — | — | ACC-001, ACC-003, UX-001, UX-002, UX-003 |
| ACC-003 | — | — | ACC-001, ACC-002, UX-001, UX-002, UX-003 |
| UX-001 | — | — | ACC-*, UX-002, UX-003 |
| UX-002 | — | — | ACC-*, UX-001, UX-003 |
| UX-003 | — | — | ACC-*, UX-001, UX-002 |
| UX-004 | UX-005, FE-003 | — | ACC-*, UX-001, UX-002, UX-003 |
| UX-005 | — | UX-004 | — |
| CNT-004 | — | — | ACC-*, UX-* |
| API-001 | TEST-002 | — | ACC-*, UX-*, BE-001 |
| SEC-005 | — | — | ACC-*, UX-* |
| BE-001 | PROD-007 | — | ACC-*, API-001 |
| SEO-001 | — | — | ACC-*, SEO-002, SEO-003 |
| SEO-002 | — | — | ACC-*, SEO-001, SEO-003 |
| SEO-003 | — | — | ACC-*, SEO-001, SEO-002 |
| PERF-001 | — | — | ACC-*, PERF-002, SEC-006 |
| PERF-002 | — | — | ACC-*, PERF-001, SEC-006 |
| FE-003 | — | UX-004 | — |
| SEC-006 | — | — | ACC-*, PERF-* |
| TEST-001 | — | — | All |
| TEST-002 | — | API-001 | — |
| PROD-001 | — | — | All |
| PROD-002 | — | — | All |
| PROD-003 | — | — | All |
