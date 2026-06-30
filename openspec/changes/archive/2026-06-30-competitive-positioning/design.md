## Context

OptiFlow OS has 13 marketing pages. The "Why OptiFlow" page explains value but doesn't directly compare against competitors. Buyers evaluating multiple tools have no self-serve comparison resource. This page fills that gap using existing design system components — no new dependencies, no new CSS in core.css, no new JS in core.js.

## Goals / Non-Goals

**Goals:**
- Add a single new static page: `competitive-positioning.html` (~500 lines)
- Use existing design system exclusively (cards, grids, comparison tables, section-dark, CTA section)
- Place page under Resources nav dropdown alongside Newsletter and FAQ
- Compare against 4 competitor categories: WhatsApp/Excel, Generic SaaS, Traditional ERP, Manual/Paper

**Non-Goals:**
- Named competitor product comparisons (avoid specificity and maintenance burden)
- New core.css components or core.js logic
- New partial or shared component changes beyond nav dropdown
- Backend/API changes (static page only)

## Decisions

### Competitor categories (not named products)
Naming specific competitors (Zoho, Tally, etc.) creates maintenance burden and possible legal risk. Using 4 generic categories covers the full competitive landscape without needing updates when competitor features change. The feature matrix columns already make comparison clear.

### Page under Resources nav
Competitive positioning is reference content, not a primary conversion page. Placing it under the Resources dropdown keeps the main nav uncluttered. The page will link from Why OptiFlow and Pricing for discovery.

### No new CSS in core.css
All page-specific styles stay in a `<style>` block in the page head. This avoids CSS bloat for pages that don't need these styles. The competitive positioning page uses ~80 lines of custom CSS for the quadrant grid and comparison table tweaks. If a second page later needs a competitor matrix, promote to core.css then.

### Feature matrix as HTML table
A semantic `<table>` with `.comparison-table` class (already defined in core.css) handles the feature-by-feature comparison cleanly. No JavaScript needed — static markup, responsive via existing CSS overflow scroll pattern.

## Risks / Trade-offs

[Addition of 14th page to site.json] → Build output grows by ~50KB. Mitigation: single static page, negligible impact.
[Resources dropdown grows to 3 items] → Slightly more visual weight. Mitigation: competitive positioning is genuinely useful reference content, not noise.
[No named competitors] → Some buyers may want product-specific comparisons. Mitigation: generic categories capture the competitive dynamics; specific named comparisons can be added later as a v2 enhancement without breaking the page structure.

## Migration Plan

1. Create `src/pages/competitive-positioning.html`
2. Add page entry to `site.json` pages array
3. Add SRC_MAP entry in `scripts/assemble.mjs`
4. Add "Competitive Positioning" to nav.html Resources dropdown
5. Add cross-links from why-optiflow.html (CTA section) and pricing.html (cost comparison section)
6. Build + validate
7. Deploy

No rollback needed beyond reverting the git commit.
