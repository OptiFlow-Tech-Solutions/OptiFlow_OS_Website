# OptiFlow OS Website — Developer Guide

> How to work with this codebase. Read this before making changes.

## Quick Start

```bash
git clone <repo>
cd OptiFlow_OS_Website
npm install
npm run dev          # Build + serve locally at http://localhost:3000
```

## Project Overview

**OptiFlow OS** is a Business Execution Operating System marketing website for Indian MSMEs.
- **14 static HTML pages** with a custom design system
- **Custom Node.js build pipeline** — assembles `src/` → `dist/`
- **Deployed** to Docker/Coolify, Cloudflare Pages, and Netlify
- **Build-tooling via OpenSpec workflow** (orchestration engine provided externally)

## Directory Structure

```
├── src/pages/           14 HTML source pages
├── src/partials/        3 reusable partials (nav, footer, analytics)
├── assets/css/          core.css — design system
├── assets/js/           core.js — shared JavaScript
├── hooks/               4 git hooks (pre-commit, pre-build, post-build, utils)
├── scripts/             Build, validate, watch scripts
├── tests/e2e/           5 Playwright E2E specs
├── docs/                Developer documentation
└── site.json            Canonical site data (phone, email, pages, nav)
```

## Before Making Changes

1. **Read `site.json`** — canonical company data
2. **Read design system** in `assets/css/core.css` — all CSS variables
3. **Never hardcode** colors, phone, email — use `var(--*)` and `{{PLACEHOLDER}}`
4. **Read `AGENTS.md`** — agent instructions for this repo

## Adding a New Page

1. Copy an existing page from `src/pages/` as template
2. Use `<!-- INCLUDE: nav -->` and `<!-- INCLUDE: footer -->`
3. Page-specific styles in `<style>` block (not in core.css)
4. Add page metadata to `site.json` `pages` array
5. Run `npm run build && npm run validate`

## Modifying Shared Components

1. Edit `assets/css/core.css` or `assets/js/core.js` — NOT individual pages
2. Rebuild: `npm run build`
3. Validate: `npm run validate`

## CSS Rules

- Colors: always `var(--*)` variables (--bg, --fg, --accent, --teal, etc.)
- Spacing: `var(--gap-*)` variables (--gap-xs through --gap-2xl)
- Typography: `.display`, `h1`-`h6`, `.lead`, `.body` classes
- Never put component styles in page files

## Vertical Slice Architecture

Every feature is a complete vertical slice. Given only a Feature ID, the orchestration engine auto-resolves:

```
Feature ID (e.g., PAGE-001)
  → Dependencies (SYS-001..SYS-005)
  → Specs (marketing-pages)
  → Source files (home.html)
  → Tests (a11y, seo, nav, responsive, assets)
  → Skills (design-system, seo, accessibility)
  → Agents (tdd-guide, code-reviewer)
  → Hooks (pre-build, post-build)
  → Pipeline (apply.yaml)
  → Quality gates (GATE_SPEC → GATE_BUILD → ...)
```

### Command: `/opsx:feature F-XXX`

One command. Everything else is automatic.

## Build Pipeline

```
npm run build      → scripts/assemble.mjs assembles dist/
  ├── Injects nav, footer, analytics partials
  ├── Replaces {{PHONE}}, {{EMAIL}}, {{YEAR}} placeholders
  ├── Copies assets/ → dist/assets/
  ├── Generates sitemap.xml, robots.txt, manifest.json
  └── Generates JSON-LD structured data

npm run validate   → scripts/validate.mjs
  ├── Checks internal links resolve
  ├── Detects hardcoded hex colors
  ├── Verifies SEO tags (title, desc, h1, OG)
  ├── Checks dark mode coverage
  └── Verifies company info consistency
```

## Testing

```bash
npm test                       # All Playwright E2E tests
npx playwright test a11y       # Accessibility only
npx playwright test seo        # SEO only
```

- 4 browser projects: chromium-desktop, chromium-mobile, firefox, webkit
- Axe-core for WCAG 2.2 AA accessibility scanning
- All 14 pages tested

## Linting

```bash
npm run lint        # Stylelint (CSS)
npm run lint:html   # HTML-validate
npm run lint:js     # ESLint (JavaScript)
npm run lint:all    # All three
```

## OpenSpec Workflow

1. `/opsx:explore` — research existing specs + codebase
2. `/opsx:propose <change-name>` — generate proposal + design + specs + tasks
3. `/opsx:apply` — execute tasks from tasks.md
4. `/opsx:verify` — run L1-L7 validation
5. `/opsx:archive` — merge delta specs, generate traceability

## Docker

```bash
docker build -t optiflow-website .   # Build container
docker run -p 80:80 optiflow-website  # Run locally
docker compose up --build             # Or with Compose
```

See `docs/DOCKER.md` for full details.

## Deployment

- **Docker / Coolify:** Select Dockerfile build pack — see `docs/DEPLOYMENT.md`
- **Staging:** Push to `staging` → GitHub Actions → Cloudflare Pages preview
- **Production:** Push to `main` → GitHub Actions → Cloudflare Pages + Netlify
- **Manual:** `npm run deploy`
- **AWS ECS / Kubernetes:** Use Docker image — see `docs/DEPLOYMENT.md`

## Key Files Reference

| File | Purpose |
|------|---------|
| `site.json` | Canonical company data, page metadata, nav/footer config |
| `AGENTS.md` | Agent instructions for AI coding assistants |
| `assets/css/core.css` | Design system (all CSS variables) |
| `assets/js/core.js` | Shared JavaScript runtime |
| `scripts/assemble.mjs` | Build engine |
| `scripts/validate.mjs` | Validation engine |
