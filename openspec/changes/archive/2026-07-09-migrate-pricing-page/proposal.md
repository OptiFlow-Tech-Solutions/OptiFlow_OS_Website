## Why

The pricing page (1043 lines) is the revenue-critical conversion page with the most complex interactivity on the site: an animated ROI bar chart, real-time cost calculator, feature comparison matrix, and pricing cards. It's the last major page awaiting React migration. Moving it to React with proper component decomposition enables maintainability, shared design tokens, and consistent behavior with the rest of the SPA.

## What Changes

- Replace the 14-line Pricing.tsx stub with a full implementation mirroring the 10-section `pricing.html`
- Build `ROIDashboard`: proportional bar chart with tooltips, connector lines, savings badges, and scroll-triggered entrance animation
- Build `ROICalculator`: two sliders (team size 5–200, per-user cost ₹199–₹5,000) with real-time math computing traditional annual cost, OptiFlow annual + setup, savings, and effective per-user cost
- Build `PricingCard`: three plan cards (Starter, Growth, Scale) with featured state for Growth, feature lists, and CTAs
- Build `ComparisonMatrix`: three-column feature grid (Starter/Growth/Scale) across three sections (Core Platform, Automation & Scale, Support) with dark background
- Build `ImplementationTimeline`: five-step horizontal timeline with connecting lines, hover cards, and three metric cards
- Build `PricingFAQ`: seven-question accordion with expand/collapse
- Reuse existing shared components: `Section`, `Container`, `Card`, `Button`, `TrustBar`, `CTASection`

## Capabilities

### New Capabilities

- `pricing-roi-dashboard`: Animated comparison bar chart showing traditional SaaS vs OptiFlow costs across 5 team sizes (10–200), with proportional bar widths, hover tooltips, connector lines between bar ends, savings badges with staggered entrance animation, and scroll-triggered IntersectionObserver reveal
- `pricing-calculator`: Interactive ROI calculator with two range sliders (team size 5–200, per-user cost ₹199–₹5,000), real-time computation of traditional annual cost, OptiFlow plan selection by team-size thresholds, savings calculation with non-negative guard, and effective per-user cost display
- `pricing-comparison-matrix`: Three-column feature comparison grid across Starter/Growth/Scale plans with section groups (Core Platform, Automation & Scale, Support), yes/limited/no cell states with appropriate icons, and dark background section treatment
- `pricing-timeline`: Five-step implementation timeline with numbered steps, connecting gradient lines, hover elevation, and three summary metric cards

### Modified Capabilities

None. This change introduces new interactive components without modifying existing spec-level requirements.

## Impact

- Affected code: `frontend/src/pages/Pricing.tsx`, new files under `frontend/src/components/pricing/`
- Shared dependencies: `Section`, `Container`, `Card`, `Button`, `TrustBar`, `CTASection`
- Data: plan pricing data, comparison matrix rows, FAQ items — colocated in the component file or a local data module
- No API changes, no database changes, no new dependencies
