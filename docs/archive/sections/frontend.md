# Frontend — Implementation Documentation
- **Current Score:** 72/100 | **Target Score:** 90/100 | **Gap:** 18 | **Last Updated:** 2026-07-06

## Overview
The frontend is a vanilla HTML/CSS/JS static site assembled at build time via `assemble.mjs`. It serves 16 pages (14 content pages + 2 error pages) using a shared design system built on Oklch color space and CSS custom properties. The site supports dark/light theme toggling, scroll-triggered reveal animations, page transitions, and a 4-breakpoint responsive grid. No JavaScript framework or build tool beyond Node.js assembly scripts is used.

## Current State
- **core.css** (494 lines) — design system foundation using Oklch color space, 70+ CSS custom properties, `.display`, `.lead`, `.body` typography classes, responsive grid at 480/768/1024/1320px breakpoints, dark/light theme via `[data-theme]` attribute, scroll reveal animations, page transition states, form input/button states (hover, focus, error)
- **core.js** (334 lines) — vanilla JS: theme toggle with localStorage persistence, scroll reveal via IntersectionObserver, smooth page transitions, mobile nav toggle, form validation helpers, analytics event binding
- **3 partials** (`nav.html`, `footer.html`, `analytics.html`) injected via `<!-- INCLUDE: ... -->` directives during assembly
- **16 HTML pages** — home, pricing, features, about, contact, demo-booking, faq, industries, manufacturing, healthcare, logistics, energy, retail, custom, plus 404 and 500 error pages
- **assemble.mjs** — build script that inlines partials, injects meta tags, generates sitemap.xml and manifest.json, copies static assets to `dist/`
- Running score deductions: 200-600 lines of inline `<style>` per page (TD-02), no breadcrumb component despite CSS existing (TD-11), duplicate form CSS patterns (TD-12), no cookie consent banner (TD-13), missing `aria-hidden` on decorative SVGs (TD-14)

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|------------|------|----------|------------|--------|
| UX-001 | Unify form component CSS | MEDIUM | 1.5 | Not Started |
| UX-002 | Align container width to 1320px | MEDIUM | 0.2 | Not Started |
| UX-003 | Dark mode logo in nav | LOW | 0.2 | Not Started |
| UX-004 | Move page styles to core.css | MEDIUM | 4.0 | Not Started |
| UX-005 | Breadcrumb navigation | LOW | 1.5 | Not Started |
| CNT-004 | Favicon variants | LOW | 0.3 | Not Started |
| FE-003 | Cookie consent banner | HIGH | 1.5 | Not Started |
| ACC-001 | aria-hidden on decorative SVGs | MEDIUM | 1.5 | Not Started |
| ACC-002 | Skip-to-content consistency | MEDIUM | 0.5 | Not Started |
| ACC-003 | ARIA labels on interactive components | LOW | 2.0 | Not Started |
| PERF-002 | Print stylesheet | LOW | 0.3 | Not Started |

## Implementation Order
1. **UX-004 (Move page styles to core.css)** — highest-impact quality change; eliminates 200-600 lines of inline CSS per page, resolves TD-02, enables all subsequent CSS work to touch one file. Must complete before any other UX work.
2. **UX-001 (Unify form component CSS)** — resolves TD-12; standardizes form patterns before adding new form-related features (FE-003 cookie consent, future customer portal forms).
3. **UX-002 (Align container to 1320px)** — quick win (0.2h); fixes grid inconsistency flagged in design audit.
4. **FE-003 (Cookie consent banner)** — HIGH priority legal requirement (Indian DPDP Act 2023, GDPR); blocks Plausible analytics compliance. Requires core.css + core.js changes.
5. **UX-005 (Breadcrumb navigation)** — depends on UX-004 completing to expose breadcrumb CSS from core.css; blocked by UX-004.
6. **UX-003 (Dark mode logo)** — cosmetic; quick win after UX-004 consolidates styles.
7. **CNT-004 (Favicon variants)** — pure asset generation; no CSS dependency; can run in parallel with anything.
8. **ACC-001, ACC-002, ACC-003 (Accessibility triad)** — WCAG 2.2 AA compliance; can run in parallel with later UX items since they're HTML attribute changes, not CSS restructures.
9. **PERF-002 (Print stylesheet)** — lowest priority; append-only CSS, no risk of regression.

## Dependencies
| Depends On | For Feature |
|------------|-------------|
| UX-004 | UX-005 (breadcrumb CSS already in core.css), UX-001 (shared style extraction) |
| UX-001 | FE-003 (consistent form styling in consent banner) |
| UX-005 | FE-003 (breadcrumb must use unified nav styles from UX-004) |
| (none) | UX-002, UX-003, CNT-004, ACC-001, ACC-002, ACC-003, PERF-002 |

## Key Files
| File | Purpose |
|------|---------|
| `assets/css/core.css` | Design system: variables, typography, grid, forms, animations, theme |
| `assets/js/core.js` | Theme toggle, scroll reveals, transitions, nav, analytics hooks |
| `src/partials/nav.html` | Navigation bar with mobile menu, injected into all 16 pages |
| `src/partials/footer.html` | Footer with links, contact info, injected into all 16 pages |
| `src/partials/analytics.html` | Plausible analytics script, injected into all 16 pages |
| `src/pages/*.html` | 14 content pages, each with page-specific inline `<style>` blocks |
| `scripts/assemble.mjs` | Build orchestrator: inlines partials, generates manifest/sitemap |

## Acceptance Criteria
- [ ] Zero inline `<style>` blocks exceeding 20 lines on any content page
- [ ] All form elements use shared `.form-input`, `.form-group`, `.form-error` classes from core.css
- [ ] Container max-width is 1320px consistently across all pages
- [ ] Cookie consent banner appears on first visit; Plausible loads only after consent
- [ ] Breadcrumb navigation renders on all pages except home; includes BreadcrumbList structured data
- [ ] All decorative SVGs have `aria-hidden="true"`; all pages have skip-to-content link; interactive elements have ARIA labels
- [ ] Print stylesheet hides nav, footer, and interactive elements; optimizes typography for print
- [ ] Dark mode logo variant swaps correctly with `[data-theme="dark"]`
- [ ] All 14 pages pass Lighthouse accessibility audit at 95+

## References
- MASTER_IMPLEMENTATION.md
- FEATURE_INDEX.md
- TECHNICAL_DEBT.md (TD-02, TD-11, TD-12, TD-13, TD-14)
- DESIGN.md (design system specification)
