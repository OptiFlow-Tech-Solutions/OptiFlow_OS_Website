# OptiFlow OS — Documentation

> **Feature-driven implementation system.** Start here. Pick a feature. Build it.

---

## Quick Start (30 seconds)

| Step | Open |
|------|------|
| 1. See all features | [`implementation/FEATURE_INDEX.md`](implementation/FEATURE_INDEX.md) |
| 2. Pick a pending feature | Click any domain folder under [`implementation/features/`](implementation/features/) |
| 3. Read the feature spec | `features/<domain>/<ID>.md` — has acceptance criteria, files, deps |
| 4. Check progress | [`implementation/IMPLEMENTATION_PROGRESS.md`](implementation/IMPLEMENTATION_PROGRESS.md) |
| 5. See execution order | [`implementation/IMPLEMENTATION_ROADMAP.md`](implementation/IMPLEMENTATION_ROADMAP.md) |
| 6. Check page impact | [`implementation/pages/<page>.md`](implementation/pages/) |
| 7. Check section impact | [`implementation/sections/<section>.md`](implementation/sections/) |

---

## Project at a Glance

| Metric | Value |
|--------|-------|
| **Type** | Static marketing website + Cloudflare Workers API |
| **Pages** | 16 HTML |
| **Build** | Custom Node.js ESM (`scripts/assemble.mjs`) |
| **Deploy** | Docker, Cloudflare Pages, Netlify |
| **Engineering Score** | 67/100 → Target: 90/100 |
| **Features Completed** | 17 of 34 tracked (50%) |
| **Features Pending** | 17 tracked + 25 planned |

---

## Structure

```
docs/
├── README.md                           ← you are here
├── DEPLOYMENT.md / DEVELOPER.md / DOCKER.md
│
├── implementation/
│   ├── FEATURE_INDEX.md                ← quick lookup (start here)
│   ├── MASTER_IMPLEMENTATION.md        ← SSOT: all feature summaries
│   ├── IMPLEMENTATION_PROGRESS.md      ← scores, debt, completion
│   ├── IMPLEMENTATION_ROADMAP.md       ← 10-phase plan
│   │
│   ├── features/                       ← one file per feature, by domain
│   │   ├── frontend/     (FE-001..003, UX-001..005, CNT-003..004)
│   │   ├── backend/      (BE-001)
│   │   ├── api/          (API-001)
│   │   ├── security/     (SEC-001..006)
│   │   ├── seo/          (SEO-001..003)
│   │   ├── accessibility/(ACC-001..003)
│   │   ├── performance/  (PERF-001..002)
│   │   ├── integrations/ (INT-001)
│   │   ├── testing/      (planned)
│   │   ├── devops/       (planned)
│   │   ├── documentation/(planned)
│   │   ├── database/     (planned)
│   │   ├── business-logic/(planned)
│   │   ├── ui/           (reserved)
│   │   └── ux/           (reserved)
│   │
│   ├── pages/                          ← one per page (what's missing)
│   └── sections/                       ← one per reusable component
│
└── archive/                            ← historical reports, old specs
```

---

## How to Use

1. **New developer:** Read this README → open FEATURE_INDEX.md → find a pending feature.
2. **Starting work:** Open the feature spec in `features/<domain>/<ID>.md`. It has acceptance criteria, affected files, dependencies, and implementation notes.
3. **Checking impact:** See `pages/<page>.md` to know what features touch a specific page.
4. **Verifying completion:** Check the Definition of Done in the feature spec. Run `npm run validate && npm test`.

## Traceability

```
FEATURE_INDEX.md → features/<domain>/<ID>.md (spec)
                 → pages/<page>.md (page impact)
                 → sections/<section>.md (component impact)
                 → Git commit
```

## Key Conventions

- **Site data:** `site.json` is SSOT for phone, email, pages, nav
- **Design:** `DESIGN.md/DESIGN.md` — colors, typography, voice
- **CSS:** Always use `var(--*)` from `core.css`
- **Placeholders:** Never hardcode — use `{{PHONE}}`, `{{EMAIL}}`, `{{YEAR}}`
- **Build:** `npm run build` → `npm run validate` → `npm test`
