## Context

OptiFlow OS has 12 marketing pages. The existing Features page (`features.html`) is an exhaustive tabbed reference listing all 12 modules. The Feature Showcase page serves a different purpose — a curated, visually immersive gallery of 6 high-impact features, each presented as a before/after transformation story with quantified outcomes. It targets MSME owners who want to see the platform's impact at a glance without reading through every module.

Reuses: `core.css` variables, `core.js` animations, nav + footer includes, `feature-nav` sub-nav pattern from `features.html`.

## Goals / Non-Goals

**Goals:**
- 6 curated feature showcases with Problem → Fix → Outcome flow
- Dual-device mockup (desktop dashboard + mobile phone frame) per feature
- Interactive sticky sub-navigation matching existing `feature-nav` pattern
- Full dark mode, responsive (1024/768/480px), scroll-reveal animations
- New entry in `site.json` pages and nav

**Non-Goals:**
- Not a replacement for the exhaustive `features.html` list
- No new dependencies or external libraries
- No server-side data — all static HTML/CSS/JS
- No overlapping content with Product Overview or Problem & Solutions pages

## Decisions

**6 features to showcase:** Task Management, Attendance, SOPs, Reports, Checklists, Leave Management — the highest-impact modules for MSME evaluation. Each gets its own `<section>`.

**Section structure per feature:**
1. Problem card (red-bordered, real scenario with ₹ cost)
2. Feature solution cards (2-3 cards per feature)
3. Dual-device visual (dashboard mockup + phone frame side by side)
4. Outcome metric cards (3 KPIs per feature)
5. CTA bar

**Sub-navigation:** Reuse `feature-nav` pattern (`position:fixed`, glass effect on scroll, IntersectionObserver for active tab). 6 tabs + "All" overview.

**Visual pattern:** Alternate `feature-hero` grid direction (image-left, image-right) for visual rhythm, matching PAGE-003 pattern.

**Dark mode:** `[data-theme="dark"]` overrides for `.showcase-problem`, `.showcase-metric`, `.showcase-visual`, `.feature-nav`.

## Risks / Trade-offs

- **Page overlap with features.html** → Mitigation: Clear positioning — Showcase is "see the impact" vs Features is "see all capabilities". Link between both pages.
- **Scroll-driven sub-nav can be disorienting** → Mitigation: IntersectionObserver uses same proven thresholds as features.html
- **13th page increases maintenance** → Mitigation: Follows exact same build/conventions as existing pages
