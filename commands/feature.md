# `/opsx:feature <Feature ID>` — Feature-Based Auto-Orchestration

## VSA Single-Command Orchestration

Given only a **Feature ID** (e.g., `PAGE-001`) or **Feature Name** (e.g., `Home Page`), the orchestration engine automatically reconstructs the entire implementation context by scanning the project. No human ever needs to re-explain the project's requirements for a feature.

## Usage

```bash
/opsx:feature PAGE-001              # Auto-orchestrate Home Page
/opsx:feature "Contact & Support"   # Auto-orchestrate by feature name
/opsx:feature list                  # List all 28 registered features
/opsx:feature PAGE-001 --show       # Display full context summary
```

## What Happens

When you run `/opsx:feature PAGE-001`, the engine:

1. **Loads the flat feature inventory** (`features/features.json`) — finds `PAGE-001` → `Home Page`
2. **Auto-resolves dependencies** — SYS-001..SYS-005 (platform foundation)
3. **Discovers specs** — maps feature name to relevant `openspec/specs/`
4. **Discovers source files** — scans `src/pages/` for matching templates
5. **Routes skills** — resolved from spec domains (design-system, seo, accessibility, frontend-patterns)
6. **Selects agents** — tdd-guide, code-reviewer
7. **Triggers hooks** — pre-build, post-build
8. **Sets quality gates** — GATE_SPEC → GATE_BUILD → GATE_VALIDATE → GATE_TEST → GATE_A11Y

## Feature Inventory (28 features)

| ID | Name |
|----|------|
| SYS-001 | Design System & Theming |
| SYS-002 | Site Navigation & Structure |
| SYS-003 | Interactive Runtime |
| SYS-004 | Build & Deployment Pipeline |
| SYS-005 | SEO & Metadata |
| PAGE-001 | Home Page |
| PAGE-002 | Problem & Solutions |
| PAGE-003 | Product Overview |
| PAGE-004 | Feature Showcase |
| PAGE-005 | Competitive Positioning |
| PAGE-006 | Pricing & Plans |
| PAGE-007 | Newsletter & Content |
| PAGE-008 | FAQ & Self-Service |
| LEAD-001 | Demo Booking |
| LEAD-002 | Contact & Support |
| LEGAL-001 | Privacy Policy |
| LEGAL-002 | Terms & Conditions |
| API-001 | Form Processing API |
| API-002 | Admin Authentication |
| API-003 | Admin Dashboard |
| API-004 | Email Notifications |
| API-005 | Database & Data Management |
| API-006 | Monitoring & Observability |
| QA-001 | Accessibility Compliance |
| QA-002 | Testing Suite |
| QA-003 | Code Quality & Performance |
| OPS-001 | Orchestration Engine |
| OPS-002 | Git Hooks & Automation |
