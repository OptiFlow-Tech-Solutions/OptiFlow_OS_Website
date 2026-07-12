# OptiFlow OS — Documentation

> **Documentation-first development.** Start here. Find the feature. Understand it. Build it.

---

## Quick Start (30 seconds)

| Step | Document |
|------|----------|
| 1. Read the master plan | [`WEBSITE_FEATURE_INVENTORY.md`](../WEBSITE_FEATURE_INVENTORY.md) — 60 vertical slice features |
| 2. Check audit status | [`AUDIT_REPORT.md`](../AUDIT_REPORT.md) — comprehensive pre-implementation audit |
| 3. See implementation order | [WEBSITE_FEATURE_INVENTORY.md Part G](../WEBSITE_FEATURE_INVENTORY.md) — 9 phases |
| 4. Understand architecture | [`ARCHITECTURE.md`](../ARCHITECTURE.md) — system design and decisions |
| 5. Track traceability | [`FEATURE_TRACEABILITY.md`](../FEATURE_TRACEABILITY.md) — feature-to-artifact matrix |
| 6. Learn how to build | [`IMPLEMENTATION_GUIDE.md`](../IMPLEMENTATION_GUIDE.md) — standards + workflow |
| 7. Set up development | [`SETUP.md`](../SETUP.md) — developer onboarding |

---

## Project at a Glance

| Metric | Value |
|--------|-------|
| **Type** | Static marketing website → React + Django (planned migration) |
| **Pages** | 16 static HTML (current) → 20+ React routes (planned) |
| **Build** | Custom Node.js ESM (legacy) → Vite + Django collectstatic (planned) |
| **Deploy** | Docker, Cloudflare Pages, Netlify (static) → Docker Compose multi-service (planned) |
| **Features Planned** | 60 (see WEBSITE_FEATURE_INVENTORY.md) |
| **Features Implemented** | 0 of 60 (pre-implementation stage) |
| **Target Architecture** | React 19 + Django 5 + PostgreSQL 16 + Redis + Docker |

---

## Document Index

### Core Planning Documents (Root)

| Document | Purpose |
|----------|---------|
| [`WEBSITE_FEATURE_INVENTORY.md`](../WEBSITE_FEATURE_INVENTORY.md) | **SSOT.** 60 vertical slice features with full specifications |
| [`AUDIT_REPORT.md`](../AUDIT_REPORT.md) | Comprehensive audit: gaps, risks, 20-section report |
| [`ARCHITECTURE.md`](../ARCHITECTURE.md) | System architecture, tech stack, design decisions |
| [`FEATURE_TRACEABILITY.md`](../FEATURE_TRACEABILITY.md) | End-to-end traceability: feature → UI → API → DB → test |
| [`IMPLEMENTATION_GUIDE.md`](../IMPLEMENTATION_GUIDE.md) | How to implement each feature: workflow, standards, gates |
| [`DATABASE.md`](../DATABASE.md) | PostgreSQL schema: 70+ planned tables, indexes, conventions |
| [`API_REFERENCE.md`](../API_REFERENCE.md) | REST API catalog: 85+ endpoints, auth, formats |
| [`ROUTES.md`](../ROUTES.md) | Route map: 58 routes (20 public + 38 admin) |
| [`SETUP.md`](../SETUP.md) | Developer quick start, prerequisites, all commands |
| [`ENVIRONMENT.md`](../ENVIRONMENT.md) | Environment variable reference (35+ variables) |

### Design System

| Document | Purpose |
|----------|---------|
| [`DESIGN.md/DESIGN.md`](../DESIGN.md/DESIGN.md) | Brand specification: colors, typography, voice, imagery |
| `assets/css/core.css` | Current design system (513 lines CSS custom properties) |

### Developer Docs (This Directory)

| Document | Purpose |
|----------|---------|
| `DEVELOPER.md` | Developer guide: conventions, workflows, OpenSpec |
| `DEPLOYMENT.md` | Multi-platform deployment guides |
| `DOCKER.md` | Docker build and run instructions |
| `DEPLOYMENT_AUDIT.md` | Deployment readiness audit (99/100 score) |

### OpenSpec (Spec-Driven Development)

| Path | Purpose |
|------|---------|
| `openspec/config.yaml` | Project context: tech stack, conventions, rules |
| `openspec/specs/` | 23 capability specifications |
| `openspec/changes/archive/` | 15 archived change sets |

---

## How to Use

1. **New developer:** Read `SETUP.md` → study `WEBSITE_FEATURE_INVENTORY.md` → read `IMPLEMENTATION_GUIDE.md`.
2. **Starting a feature:** Find it in `FEATURE_TRACEABILITY.md` → read the spec → implement per `IMPLEMENTATION_GUIDE.md`.
3. **Design work:** Reference `DESIGN.md/DESIGN.md` + `assets/css/core.css` — never deviate from visual spec.
4. **API development:** Reference `API_REFERENCE.md` — follow response envelope and conventions.

## Traceability

```
WEBSITE_FEATURE_INVENTORY.md (Feature Spec)
  → FEATURE_TRACEABILITY.md (Component/API/DB map)
    → ARCHITECTURE.md (System design)
      → IMPLEMENTATION_GUIDE.md (How to build)
        → API_REFERENCE.md (Endpoints)
        → DATABASE.md (Schema)
        → ROUTES.md (Pages)
    → Git commit (Implementation)
      → Test suite (Verification)
```

## Key Conventions

- **Site data:** Never hardcode — use site settings API (phone, email, location)
- **Design:** Always use `var(--*)` from CSS variables; no hex colors
- **Visual spec:** Current static HTML IS the specification — never redesign
- **Vertical slices:** Every feature = frontend + backend + database + tests
- **TDD:** Write tests first; 80%+ coverage required
- **Commits:** Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`
- **Branches:** `feature/F-XXX-name`, `fix/XXX-description`
