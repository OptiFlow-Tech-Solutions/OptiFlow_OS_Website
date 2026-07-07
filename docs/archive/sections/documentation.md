# Documentation — Implementation Documentation
- **Current Score:** 62/100 | **Target Score:** 90/100 | **Gap:** 28 | **Last Updated:** 2026-07-06

## Overview / Current State
Project documentation is spread across several top-level Markdown files:
- **`README.md`** — Project overview, quick start, tech stack
- **`AGENTS.md`** — AI agent instructions (build conventions, code style, validation)
- **`DEVELOPER.md`** — Local development setup and workflow
- **`DEPLOYMENT.md`** — Deployment targets and procedures
- **`DOCKER.md`** — Docker usage and configuration
- **`DESIGN.md`** — Design system: colors, typography, spacing, voice/tone

`site.json` serves as the single source of truth for company data (phone, email, location) and page metadata.

The implementation documentation system provides:
- **`IMPLEMENTATION_INDEX.md`** — Index of 34 implementation items across categories
- **`IMPLEMENTATION_PROGRESS.md`** — Current progress tracker with scores
- **`IMPLEMENTATION_ROADMAP.md`** — Phased roadmap with milestones

This section documentation layer adds 14 master docs, feature specifications, section-specific docs, and per-page documentation.

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|---|---|---|---|---|
| DOC-001 | API documentation / OpenAPI spec | Medium | 4 | Not Started |
| DOC-002 | Architecture Decision Records (ADRs) | High | 3 | Not Started |
| DOC-003 | Security runbook / incident response plan | Medium | 3 | Not Started |

## Implementation Order
1. **DOC-002** — Create an `docs/adr/` directory and write ADRs for key decisions (static HTML choice, nginx over Caddy, Playwright over Cypress). Template-driven, low effort.
2. **DOC-003** — Write an incident response runbook covering: rollback procedure, secret rotation, DDoS mitigation steps, contact escalation.
3. **DOC-001** — If API endpoints are added (form handlers, search), document them with an OpenAPI spec. Currently not applicable for a static site; defer until APIs exist.

## Dependencies
- DOC-001 is blocked until API endpoints exist. Currently N/A.
- DOC-002 and DOC-003 are independent.

## Key Files
| File | Purpose |
|---|---|
| `README.md` | Project overview and quick start |
| `AGENTS.md` | AI agent build conventions |
| `DEVELOPER.md` | Development workflow |
| `DEPLOYMENT.md` | Deployment procedures |
| `DOCKER.md` | Docker configuration guide |
| `DESIGN.md` | Design system documentation |
| `site.json` | Single source of truth for company data |
| `docs/implementation/IMPLEMENTATION_INDEX.md` | Master index of 34 implementation items |
| `docs/implementation/IMPLEMENTATION_PROGRESS.md` | Score tracker |
| `docs/implementation/IMPLEMENTATION_ROADMAP.md` | Phased milestones |

## Acceptance Criteria
- [ ] All 14 section docs are complete with scores, gaps, and acceptance criteria
- [ ] ADR directory exists with records for all major architectural decisions
- [ ] Security runbook covers secret rotation, rollback, and incident escalation
- [ ] Every `IMPLEMENTATION_INDEX.md` entry links to its corresponding section doc
- [ ] All documentation references are relative links that resolve within the repo
- [ ] `DEVELOPER.md` includes the full test/validate/build command reference
- [ ] No broken links in any documentation file
- [ ] Documentation is written at a level accessible to new contributors
