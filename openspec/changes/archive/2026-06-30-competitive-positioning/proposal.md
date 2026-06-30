## Why

Indian MSMEs evaluating OptiFlow OS have no single page that compares it directly against their current alternatives — WhatsApp/Excel chaos, generic tools, and traditional ERPs. Buyers default to calling sales or leaving the site. A competitive positioning page gives them a self-serve comparison that builds confidence and shortens the sales cycle.

## What Changes

- Add a new "Competitive Positioning" page (`src/pages/competitive-positioning.html`) that compares OptiFlow OS against 4 competitor categories: WhatsApp & Excel Chaos, Generic SaaS Tools, Traditional ERPs, and Manual Paper Systems
- Add the page entry to `site.json` with SEO metadata and nav placement (under Resources dropdown)
- Add the page source mapping to `assemble.mjs` SRC_MAP
- Page includes: hero with value proposition, 4-quadrant competitor comparison grid, detailed feature matrix table, cost comparison, and CTA section
- Link the page from the Why OptiFlow page and Pricing page for cross-linking

## Capabilities

### New Capabilities
- `competitive-positioning-page`: A dedicated comparison page with competitor quadrant grid, feature matrix, cost comparison table, and dark-mode support. Built using existing design system components (cards, grids, section-dark, comparison tables, CTA section).

### Modified Capabilities
- `marketing-pages`: Page inventory increases from 13 to 14. `site.json` pages array gets a new entry for `competitive-positioning/index.html`. Nav dropdown (Resources) gets a new link. Footer resource links get the new page.

## Impact

- `site.json`: New page entry in pages array, new nav dropdown item
- `scripts/assemble.mjs`: New SRC_MAP entry for `competitive-positioning/index.html` → `competitive-positioning.html`
- `src/pages/competitive-positioning.html`: New page source file (~500 lines)
- `src/pages/why-optiflow.html`: Minor edit adding cross-link
- `src/pages/pricing.html`: Minor edit adding cross-link
