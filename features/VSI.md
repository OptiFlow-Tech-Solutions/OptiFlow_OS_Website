# OptiFlow OS — Repository Intelligence (VSI)

> Auto-generated: 2026-07-05T15:42:03.386Z
> Schema: V5.0 AI-native feature registry

---

## Vision

Marketing website for OptiFlow OS — Business Execution Operating System for Indian MSMEs. Replace WhatsApp chaos and Excel silos with one structured platform.

## Strategy

- **Pages-first architecture**: Every marketing page is a self-contained HTML file
- **Design system as source of truth**: All visual decisions flow from DESIGN.md
- **Spec-driven development**: Every feature originates from an OpenSpec capability spec
- **Autonomous orchestration**: The V13 engine handles the complete SDD lifecycle
- **AI-native**: Every feature contains AI context for autonomous implementation

## Architecture Philosophy

1. **Fewest files possible** — 15 pages, 1 CSS file, 1 JS file
2. **Immutability** — All data flows through the build pipeline; source → dist
3. **Validation at every boundary** — pre-build, post-build, pre-commit, pre-push
4. **Convention over configuration** — Feature IDs, spec names, page names follow patterns
5. **Auto-discovery over metadata** — The orchestration engine infers linkages at runtime

## Engineering Standards

- **Design**: CSS variables only (var(--*)), no hardcoded hex values, 8px spacing grid, Inter+JetBrains Mono fonts, WCAG 2.2 AA contrast ratios, placeholders only for company data ({{PHONE}}, {{EMAIL}}, {{YEAR}})
- **Code**: ESM modules, no classes unless stateful, immutability preferred, ponytail principle (fewest files, shortest diff), no unnecessary abstractions, security-first (no hardcoded secrets)
- **Testing**: Playwright E2E tests, axe-core a11y audits, Lighthouse CI performance, 80%+ coverage target, visual regression tests
- **Build**: node scripts/assemble.mjs assembles src/ -> dist/, pre/post-build hooks run validation, feature integrity checked on every build
- **Deployment**: Dual-deploy to Cloudflare Pages + Netlify, wrangler.toml + netlify.toml config, manual production promotion

## AI Standards

- **Feature First**: Always read features/features.json BEFORE making any code change — features define what exists, what is planned, and how to implement
- **Design Compliance**: Use CSS variables from core.css, typography classes (.display, h1-h6, .lead, .body), spacing variables (var(--gap-*)), INCLUDE directives for nav/footer, placeholders for company data
- **Skill Discovery**: For skill selection, prefer per-feature aiContext over capability-analyzer re-discovery — aiContext is pre-computed and validated
- **Traceability**: Every commit message MUST reference a Feature ID (e.g., feat(SYS-001): add dark mode toggle). Every implementation MUST trace to a feature
- **Autonomy**: Use /opsx-auto for full autonomous lifecycle. Use individual /opsx-* commands only for debugging or manual control

## Decision Framework

When making engineering decisions:
1. Is it in the design system? → Use that.
2. Is there a spec for it? → Follow the spec.
3. Is there an existing page to copy? → Use that pattern.
4. Is it a new capability? → Create a spec first, then implement.

## Success Metrics

- 36/68 features complete (V1.0)
- 0 hardcoded colors in production
- Build passes with 0 errors on every commit
- WCAG 2.2 AA compliant across all pages

---

## Complete (36 features)

| ID | Name | Priority | Category | Complexity |
|------|------|------|------|------|
| SYS-001 | Design System & Theming | P0 | system | L |
| SYS-002 | Site Navigation & Structure | P0 | system | L |
| SYS-003 | Interactive Runtime | P0 | system | L |
| SYS-004 | Build & Deployment Pipeline | P0 | system | L |
| SYS-005 | SEO & Metadata | P1 | system | M |
| PAGE-001 | Home Page | P0 | page | L |
| PAGE-002 | Problem & Solutions | P1 | page | M |
| PAGE-003 | Product Overview | P0 | page | L |
| PAGE-004 | Feature Showcase | P1 | page | M |
| PAGE-005 | Competitive Positioning | P1 | page | M |
| PAGE-006 | Pricing & Plans | P0 | page | L |
| PAGE-007 | Newsletter & Content | P2 | page | M |
| PAGE-008 | FAQ & Self-Service | P1 | page | M |
| LEAD-001 | Demo Booking | P0 | lead | L |
| LEAD-002 | Contact & Support | P1 | lead | M |
| LEGAL-001 | Privacy Policy | P0 | legal | L |
| LEGAL-002 | Terms & Conditions | P0 | legal | L |
| API-001 | Form Processing API | P0 | api | L |
| API-002 | Admin Authentication | P1 | api | M |
| API-003 | Admin Dashboard | P1 | api | M |
| API-004 | Email Notifications | P1 | api | M |
| API-005 | Database & Data Management | P0 | api | L |
| API-006 | Monitoring & Observability | P2 | api | M |
| QA-001 | Accessibility Compliance | P0 | quality | L |
| QA-002 | Testing Suite | P1 | quality | M |
| QA-003 | Code Quality & Performance | P1 | quality | M |
| OPS-001 | Orchestration Engine | P0 | operations | L |
| OPS-002 | Git Hooks & Automation | P1 | operations | M |
| UI-001 | Motion & Animation System Enhancement | P2 | ui | M |
| UI-002 | Page Transition Animations | P2 | ui | M |
| UI-003 | Skeleton Loading & Empty States | P2 | ui | M |
| UI-004 | Toast & Notification System | P2 | ui | M |
| UI-005 | Cookie Consent & Privacy Compliance | P1 | ui | M |
| UI-006 | Image Optimization Pipeline | P3 | ui | S |
| UI-007 | Service Worker & PWA Enhancement | P3 | ui | S |
| UI-008 | Interactive Product Demo Mockups | P4 | ui | S |

## In Progress (0 features)

| — | No features currently in progress | — | — | — |

## Planned (31 features)

| ID | Name | Priority | Category | Complexity |
|------|------|------|------|------|
| UI-010 | Error Boundary & Recovery System | P3 | ui | S |
| UI-011 | Hero Section Motion Enhancement | P4 | ui | S |
| UI-012 | Scroll-Triggered Animation System | P3 | ui | S |
| UI-013 | Card & Component Interaction Polish | P4 | ui | S |
| UI-014 | Content Freshness & Last Updated Display | P4 | ui | S |
| PERF-001 | Critical CSS Extraction | P2 | performance | M |
| PERF-002 | Asset Caching & CDN Strategy | P2 | performance | M |
| PERF-003 | Font Self-Hosting & Subsetting | P2 | performance | M |
| PERF-004 | Lighthouse CI Pipeline Integration | P2 | performance | M |
| SEC-001 | CSRF Protection | P1 | security | M |
| SEC-002 | Input Sanitization & XSS Prevention | P1 | security | M |
| SEC-003 | SRI Hash Injection | P2 | security | M |
| SEC-004 | CSP Reporting Endpoint | P2 | security | M |
| TEST-001 | Unit Testing Framework | P1 | testing | M |
| TEST-002 | API Integration Tests | P2 | testing | M |
| TEST-003 | Visual Regression Testing Pipeline | P2 | testing | M |
| TEST-004 | Accessibility Manual Audit Suite | P2 | testing | M |
| TEST-005 | Performance Profiling Suite | P3 | testing | S |
| DOCS-001 | API Documentation Generation | P3 | docs | S |
| DOCS-002 | Architecture Decision Records | P2 | docs | M |
| DOCS-003 | Changelog Automation | P3 | docs | S |
| DOCS-004 | Deployment Runbook | P2 | docs | M |
| DOCS-005 | Component Catalog Documentation | P2 | docs | M |
| CONTENT-001 | Newsletter Content Pipeline | P3 | content | S |
| CONTENT-002 | Case Studies & Customer Stories | P3 | content | S |
| CONTENT-003 | Product Roadmap & Release Notes Page | P3 | content | S |
| CONTENT-004 | Blog Engine & Content Management | P4 | content | S |
| OPS-003 | Monitoring & Alerting Pipeline | P2 | operations | M |
| OPS-004 | Backup & Disaster Recovery Strategy | P2 | operations | M |
| OPS-005 | OpenSpec Coverage Reporting | P3 | operations | S |
| OPS-006 | Orchestration Engine Documentation | P2 | operations | M |

---

## Usage

```bash
node orchestrate/coordinator.mjs --feature-report   # Full feature intelligence report
node orchestrate/coordinator.mjs --feature-sync     # Sync all dashboards
/opsx-auto "Feature Name"                           # Autonomous implementation
```

> Generated by orchestrate/feature-engine.mjs V2.0