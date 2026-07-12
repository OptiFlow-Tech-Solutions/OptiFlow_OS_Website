## Why

The React SPA has stub placeholders for FeatureShowcase (14 lines) and CompetitivePositioning (14 lines) while their static HTML counterparts contain 535 and 391 lines of fully designed, copywritten content. These are key differentiation pages for consideration-stage buyers — every day they sit as stubs is a day of missed conversion opportunity. The `page-migration` spec already requires these pages to render complete content; this change closes that gap.

## What Changes

- **FeatureShowcase.tsx**: Replace stub with full page — hero with EcosystemHub, sticky FeatureNav (6 tabs), 6 transformation sections (problem → solutions → metrics → dual device preview → CTA), and final CTA section
- **CompetitivePositioning.tsx**: Replace stub with full page — hero, 2×2 QuadrantGrid, 13-row ComparisonTable, 4-card CostComparison, 3 StandoutCards, and CTA
- **New component `ShowcaseTransform`**: Page-specific component for the showcase section layout (problem+cost, 2 solutions, 3 metrics, dashboard+phone dual preview, CTA bar)
- **New component `QuadrantGrid`**: 2×2 grid with centered overlay circle for competitive landscape visualization
- **New component `CostComparison`**: 4 cost comparison cards with best-value badge and hover effects
- **New data file `showcase.ts`**: 6 showcase entries with problem, cost, solutions, metrics, dashboard, and phone frame data
- **New data file `competitive.ts`**: Quadrant data, feature matrix rows (13), cost card data, and standout card data
- Reuse existing components: `FeatureSection` (not directly — the showcase layout is different), `FeatureNav`, `EcosystemHub`, `FeatureCTA`, `DashboardPreview`, `PhoneFrame`, `ComparisonTable`, `Section`, `Card`, `Button`, `Container`

## Capabilities

### New Capabilities

- `feature-showcase-page`: Full Feature Showcase page with sticky nav, 6 before/after transformations each containing problem statement with cost pill, 2 solution cards, 3 quantified metrics, and dual device visualization (dashboard + phone frame)
- `competitive-positioning-page`: Full Competitive Positioning page with 2×2 quadrant grid (center overlay), 13-row feature comparison matrix, 4-card cost comparison (OptiFlow as best value), and 3 standout differentiator cards
- `showcase-transform-component`: Reusable section component for feature transformation display — problem+cost → 2 solutions → 3 metrics → dual visual → CTA
- `quadrant-grid-component`: Reusable 2×2 grid with positioned center overlay, configurable quadrant entries with weaknesses list and advantage text, responsive collapse to single column
- `cost-comparison-component`: Cost comparison card grid with best-value highlighting, hover effects, dark mode support, configurable card entries

### Modified Capabilities

<!-- No existing specs are being modified. All requirements are already specified in page-migration, comparison-table-component, and related specs. This change implements existing requirements. -->

## Impact

- **Affected files**: `frontend/src/pages/FeatureShowcase.tsx`, `frontend/src/pages/CompetitivePositioning.tsx`
- **New files**: `frontend/src/components/sections/features/ShowcaseTransform.tsx`, `frontend/src/components/sections/competitive/QuadrantGrid.tsx`, `frontend/src/components/sections/competitive/CostComparison.tsx`, `frontend/src/data/showcase.ts`, `frontend/src/data/competitive.ts`, plus spec files under this change
- **Reused**: `FeatureNav`, `EcosystemHub`, `FeatureCTA`, `DashboardPreview`, `PhoneFrame`, `ComparisonTable`, `Section`, `Card`, `Button`, `Container`, `FeaturesStyles` — no modifications needed
- **Routes**: Already registered in `routes.ts` — no change needed
- **Build**: No new dependencies. All components use existing patterns (inline styles with CSS variables)
