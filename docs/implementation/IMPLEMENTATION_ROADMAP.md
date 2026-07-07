# OptiFlow OS — Implementation Roadmap

> Source: Enterprise Website Audit (2026-07-06)
> Total improvements: 34

---

## Phase 01 — Critical Fixes (2 tasks, ~1 day)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0001 | Fix HTML encoding — em dashes rendering as broken characters | Frontend | CRITICAL |
| IMP-0002 | Add Plausible analytics to all 14 pages | SEO | CRITICAL |

---

## Phase 02 — Design System & Conventions (4 tasks, ~1 day)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0003 | Fix DESIGN.md duplicate content | Documentation | HIGH |
| IMP-0004 | Fix hardcoded email in footer (use {{EMAIL}} placeholder) | Frontend | HIGH |
| IMP-0005 | Replace hardcoded hex colors with CSS variables in contact form | Design System | HIGH |
| IMP-0006 | Fix green color variable conflict in pricing page | Design System | HIGH |

---

## Phase 03 — Security (4 tasks, ~2 days)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0007 | Migrate rate limiting from in-memory to Cloudflare KV | Security | CRITICAL |
| IMP-0008 | Add CSRF protection to custom API endpoint | Security | HIGH |
| IMP-0009 | Add HTML entity sanitization on form inputs | Security | HIGH |
| IMP-0010 | Fix phone validation regex for Indian mobile numbers | Security | HIGH |

---

## Phase 04 — Missing Pages (2 tasks, ~2 days)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0011 | Create custom 404 error page | Frontend | HIGH |
| IMP-0012 | Create 500 server error page | Frontend | HIGH |

---

## Phase 05 — Accessibility (3 tasks, ~1 day)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0013 | Add aria-hidden="true" to decorative SVGs | Accessibility | MEDIUM |
| IMP-0014 | Add skip-to-content link consistency across all pages | Accessibility | MEDIUM |
| IMP-0015 | Add ARIA labels to interactive components | Accessibility | LOW |

---

## Phase 06 — UI/UX Polish (5 tasks, ~2 days)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0016 | Unify form component CSS across contact and demo-booking | Design System | MEDIUM |
| IMP-0017 | Align container width with DESIGN.md spec (1320px) | Frontend | MEDIUM |
| IMP-0018 | Add dark mode logo variant in navigation | Frontend | LOW |
| IMP-0019 | Move page-specific styles to core.css per conventions | Design System | MEDIUM |
| IMP-0020 | Implement breadcrumb navigation | Frontend | LOW |

---

## Phase 07 — Content & Trust (4 tasks, ~2 days)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0021 | Replace placeholder client logos with verified references | Content | HIGH |
| IMP-0022 | Fix stats inconsistencies across pages | Content | MEDIUM |
| IMP-0023 | Add social media links to footer | Frontend | HIGH |
| IMP-0024 | Add proper favicon variants (ICO + SVG) | Frontend | LOW |

---

## Phase 08 — API & Backend (3 tasks, ~2 days)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0025 | Add API versioning prefix to endpoints | API | MEDIUM |
| IMP-0026 | Document JWT secret rotation process | Security | MEDIUM |
| IMP-0027 | Add real calendar integration (Calendly/Cal.com) | Backend | HIGH |

---

## Phase 09 — SEO (3 tasks, ~1 day)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0028 | Add Product and SoftwareApplication structured data | SEO | MEDIUM |
| IMP-0029 | Add FAQPage structured data to FAQ page dynamically | SEO | MEDIUM |
| IMP-0030 | Add social media OpenGraph image | SEO | LOW |

---

## Phase 10 — Performance & DevOps (4 tasks, ~2 days)

| ID | Title | Category | Priority |
|----|-------|----------|----------|
| IMP-0031 | Implement PWA service worker for offline support | Performance | MEDIUM |
| IMP-0032 | Add print stylesheet | Performance | LOW |
| IMP-0033 | Add cookie consent banner (GDPR/DPDP compliance) | Frontend | HIGH |
| IMP-0034 | Add Content Security Policy meta tag | Security | MEDIUM |

---

## Status Legend

- ⬜ Pending
- 🟡 In Progress
- ✅ Completed
- 🔴 Blocked
