# PAGE-004: Feature Showcase

## Why

Prospects evaluating OptiFlow OS need to see real, visual proof of how individual features transform daily operations — not just a checklist of capabilities. The existing Features page lists everything; this page brings the top 6 features to life with before/after transformations and quantified outcomes so MSME owners can instantly visualize the impact on their own business.

## What Changes

- New page `src/pages/feature-showcase.html` — curated visual gallery of 6 high-impact features
- Each feature section includes: The Problem → The Fix → The Outcome with metric cards
- Dual-device mockup visual (desktop + mobile) for each feature showing the UI in action
- Interactive feature tabs with auto-scroll, matching the existing `feature-nav` pattern
- CTA section with Book Demo button and trust indicators
- Full dark mode support, responsive breakpoints, scroll-reveal animations
- Entry added to `site.json` pages array and nav

## Capabilities

### New Capabilities

- `feature-showcase-page`: Immersive visual gallery page showcasing 6 core OptiFlow OS features with before/after transformations, metric cards, and dual-device UI mockups

### Modified Capabilities

- `marketing-pages`: Page inventory expands from 12 to 13 pages to include Feature Showcase
- `shared-components`: Navigation gains a new link for Feature Showcase

## Impact

- Affects: `src/pages/feature-showcase.html` (new), `site.json` (pages + nav), `openspec/specs/marketing-pages/spec.md` (page count)
- Dependencies: core.css, core.js, nav component, footer component, build pipeline
- Build output: `dist/feature-showcase/index.html`
- Active nav: "Showcase"
